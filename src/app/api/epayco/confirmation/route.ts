import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Interfaz para los datos que envía ePayco en el webhook de confirmación
 */
interface EpaycoConfirmationData {
  x_cust_id_cliente?: string;
  x_ref_payco: string;
  x_id_invoice: string; // nuestro orderId
  x_description?: string;
  x_amount: string;
  x_amount_country?: string;
  x_amount_ok?: string;
  x_tax?: string;
  x_amount_base?: string;
  x_currency_code: string;
  x_bank_name?: string;
  x_cardnumber?: string;
  x_quotas?: string;
  x_response?: string;
  x_approval_code?: string;
  x_transaction_id: string;
  x_fecha_transaccion?: string;
  x_cod_response?: string;
  x_response_reason_text?: string;
  x_cod_transaction_state: string; // 1=Aceptada, 2=Rechazada, 3=Pendiente, 4=Fallida
  x_transaction_state?: string; // Texto: Aceptada, Rechazada, Pendiente, Fallida
  x_errorcode?: string;
  x_franchise?: string;
  x_business?: string;
  x_customer_doctype?: string;
  x_customer_document?: string;
  x_customer_name?: string;
  x_customer_lastname?: string;
  x_customer_email?: string;
  x_customer_phone?: string;
  x_customer_movil?: string;
  x_customer_ind_pais?: string;
  x_customer_country?: string;
  x_customer_city?: string;
  x_customer_address?: string;
  x_customer_ip?: string;
  x_signature?: string;
  x_extra1?: string; // Campos personalizados
  x_extra2?: string;
  x_extra3?: string;
}

/**
 * Endpoint de confirmación para ePayco Standard Checkout
 * ePayco envía una notificación POST a esta URL cuando se procesa un pago
 */
export async function POST(request: NextRequest) {
  try {
    console.log("📨 ePayco confirmation webhook received");

    // ePayco envía los datos como application/x-www-form-urlencoded
    const formData = await request.formData();

    // Convertir FormData a objeto tipado
    const body: Partial<EpaycoConfirmationData> = {};
    formData.forEach((value, key) => {
      body[key as keyof EpaycoConfirmationData] = value.toString();
    });

    console.log("📝 ePayco confirmation data:", JSON.stringify(body, null, 2));

    // Extraer los parámetros relevantes
    const {
      x_id_invoice, // Este es nuestro orderId
      x_ref_payco,
      x_transaction_id,
      x_amount,
      x_currency_code,
      x_cod_transaction_state,
      x_transaction_state,
      x_signature,
      x_cust_id_cliente,
      x_approval_code,
      x_fecha_transaccion,
      x_customer_email,
      x_customer_name,
      x_customer_lastname,
      x_extra3, // storeId
    } = body;

    // Validar parámetros obligatorios
    if (!x_ref_payco || !x_transaction_id || !x_cod_transaction_state) {
      console.error("❌ Faltan parámetros obligatorios en la confirmación");
      return NextResponse.json(
        { success: false, error: "Parámetros obligatorios faltantes" },
        { status: 400 }
      );
    }

    // Validar la firma para asegurar que viene de ePayco (solo log, no bloqueante)
    const isValidSignature = await verifyEpaycoSignature(body);
    if (!isValidSignature) {
      console.warn("⚠️ Firma inválida detectada. Procesando de todos modos...");
    } else {
      console.log("✅ Firma verificada correctamente");
    }

    // Mapear el estado de ePayco a nuestro sistema
    // x_cod_transaction_state: 1=Aceptada, 2=Rechazada, 3=Pendiente, 4=Fallida
    let orderStatus: "PENDING" | "PAID" | "FAILED";
    switch (x_cod_transaction_state) {
      case "1": // Aceptada
        orderStatus = "PAID";
        break;
      case "2": // Rechazada
      case "4": // Fallida
        orderStatus = "FAILED";
        break;
      case "3": // Pendiente
      default:
        orderStatus = "PENDING";
        break;
    }

    console.log(
      `📦 Orden ${x_id_invoice} - Estado: ${orderStatus} (${x_transaction_state})`
    );
    console.log(`💳 Transacción ePayco: ${x_ref_payco} / ${x_transaction_id}`);
    console.log(`💰 Monto: ${x_amount} ${x_currency_code}`);
    console.log(
      `👤 Cliente: ${x_customer_name} ${x_customer_lastname} (${x_customer_email})`
    );

    if (x_approval_code) {
      console.log(`✅ Código de aprobación: ${x_approval_code}`);
    }

    // Preparar datos para enviar al webhook del backend
    const webhookPayload = {
      orderId: x_id_invoice,
      status: orderStatus,
      transactionId: x_transaction_id,
      epaycoReference: x_ref_payco,
      amount: parseFloat(x_amount || "0"),
      currency: x_currency_code,
      approvalCode: x_approval_code,
      transactionDate: x_fecha_transaccion,
      transactionState: x_transaction_state,
      codTransactionState: x_cod_transaction_state,
      customer: {
        email: x_customer_email,
        name: x_customer_name,
        lastname: x_customer_lastname,
      },
      storeId: x_extra3,
      paymentProvider: "EPAYCO",
      signatureValid: isValidSignature,
      rawData: body, // Enviar todos los datos raw para que el backend pueda validar
    };

    // Llamar al webhook del backend
    try {
      const backendWebhookUrl =
        process.env.BACKEND_WEBHOOK_URL ||
        process.env.NEXT_PUBLIC_GRAPHQL_URL?.replace(
          "/graphql",
          "/webhook/epayco/confirmation"
        );

      if (!backendWebhookUrl) {
        console.error("❌ BACKEND_WEBHOOK_URL no configurada");
        throw new Error("BACKEND_WEBHOOK_URL no configurada");
      }

      console.log(`🔗 Llamando al webhook del backend: ${backendWebhookUrl}`);

      const webhookResponse = await fetch(backendWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Si tu backend requiere autenticación, agrégala aquí
          // "Authorization": `Bearer ${process.env.BACKEND_API_KEY}`,
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error(
          `❌ Error del webhook del backend: ${webhookResponse.status} - ${errorText}`
        );
        throw new Error(`Backend webhook failed: ${webhookResponse.status}`);
      }

      const webhookResult = await webhookResponse.json();
      console.log(
        "✅ Webhook del backend ejecutado correctamente:",
        webhookResult
      );

      return NextResponse.json({
        success: true,
        message: "Confirmación procesada correctamente",
        orderId: x_id_invoice,
        status: orderStatus,
        transactionState: x_transaction_state,
        epaycoReference: x_ref_payco,
        backendResponse: webhookResult,
      });
    } catch (webhookError) {
      console.error("❌ Error llamando al webhook del backend:", webhookError);

      // Aún así respondemos success a ePayco para evitar reintentos
      // pero registramos el error para investigación
      return NextResponse.json({
        success: true,
        message: "Confirmación recibida pero error al procesar",
        orderId: x_id_invoice,
        status: orderStatus,
        warning: "Error al actualizar backend",
      });
    }
  } catch (error) {
    console.error("❌ Error procesando confirmación de ePayco:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * Verifica la firma de ePayco para validar la autenticidad de la notificación
 * La firma se calcula como: SHA256(x_cust_id_cliente + '^' + x_currency_code + '^' + x_amount + '^' + x_ref_payco + '^' + p_cust_id_cliente)
 * donde p_cust_id_cliente es la clave privada de ePayco (EPAYCO_PRIVATE_KEY)
 */
async function verifyEpaycoSignature(
  data: Partial<EpaycoConfirmationData>
): Promise<boolean> {
  const privateKey = process.env.EPAYCO_PRIVATE_KEY;

  if (!privateKey) {
    console.warn(
      "⚠️ EPAYCO_PRIVATE_KEY no configurada. Omitiendo validación de firma."
    );
    return true; // En desarrollo permitir sin firma
  }

  const {
    x_cust_id_cliente,
    x_currency_code,
    x_amount,
    x_ref_payco,
    x_signature,
  } = data;

  if (!x_signature) {
    console.error("❌ No se recibió firma (x_signature)");
    return false;
  }

  if (!x_cust_id_cliente || !x_currency_code || !x_amount || !x_ref_payco) {
    console.error("❌ Faltan datos necesarios para verificar la firma");
    console.log("Datos recibidos:", {
      x_cust_id_cliente,
      x_currency_code,
      x_amount,
      x_ref_payco,
    });
    return false;
  }

  try {
    // Construir la cadena para calcular la firma según documentación de ePayco
    // Formato: x_cust_id_cliente^x_currency_code^x_amount^x_ref_payco^p_cust_id_cliente
    const signatureString = `${x_cust_id_cliente}^${x_currency_code}^${x_amount}^${x_ref_payco}^${privateKey}`;

    console.log(
      "🔐 String para firma:",
      signatureString.replace(privateKey, "***")
    );

    // ePayco usa SHA256 para la firma de confirmación
    const calculatedSignature = crypto
      .createHash("sha256")
      .update(signatureString)
      .digest("hex");

    console.log("🔐 Firma recibida:", x_signature);
    console.log("🔐 Firma calculada:", calculatedSignature);
    console.log("🔐 Coinciden?:", x_signature === calculatedSignature);

    return x_signature === calculatedSignature;
  } catch (error) {
    console.error("❌ Error verificando firma:", error);
    return false;
  }
}

// También manejar GET en caso de que ePayco envíe parámetros por URL
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    console.log("📨 ePayco confirmation GET received:", params);

    return NextResponse.json({
      status: "success",
      message: "GET confirmation received",
    });
  } catch (error) {
    console.error("❌ Error processing ePayco GET confirmation:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error processing GET confirmation",
      },
      { status: 500 }
    );
  }
}
