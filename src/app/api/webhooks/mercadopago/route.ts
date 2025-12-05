import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { apolloClient } from '@/lib/apollo';
import { UPDATE_PAYMENT, GET_PAYMENT_BY_REFERENCE } from '@/lib/graphql/queries';
import { PaymentStatus } from '@/types/payment';
import { MercadoPagoPaymentStatus } from '@/types/mercadopago';

/**
 * Map Mercado Pago payment status to internal PaymentStatus
 */
const mapMercadoPagoStatus = (status: MercadoPagoPaymentStatus): PaymentStatus => {
  switch (status) {
    case 'approved':
      return PaymentStatus.COMPLETED;
    case 'authorized':
      return PaymentStatus.AUTHORIZED;
    case 'pending':
    case 'in_process':
    case 'in_mediation':
      return PaymentStatus.PENDING;
    case 'rejected':
      return PaymentStatus.REJECTED;
    case 'cancelled':
      return PaymentStatus.CANCELLED;
    case 'refunded':
      return PaymentStatus.REFUNDED;
    case 'charged_back':
      return PaymentStatus.CHARGEBACK;
    default:
      return PaymentStatus.PENDING;
  }
};

/**
 * Validate Mercado Pago webhook signature
 * 
 * SECURITY NOTE: This implementation currently skips signature validation.
 * Before deploying to production, you MUST implement proper HMAC validation
 * using the MERCADOPAGO_WEBHOOK_SECRET environment variable.
 * 
 * Reference: https://www.mercadopago.com.co/developers/es/docs/checkout-pro/additional-content/security/notifications
 */
const validateWebhookSignature = (
  request: NextRequest,
  _body: string
): boolean => {
  // Get signature from headers
  const xSignature = request.headers.get('x-signature');
  const xRequestId = request.headers.get('x-request-id');

  // In development, skip validation but log a warning
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️ Skipping webhook signature validation in development');
    return true;
  }

  // In production, require signature validation
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('❌ MERCADOPAGO_WEBHOOK_SECRET not configured - rejecting webhook');
    return false;
  }

  if (!xSignature || !xRequestId) {
    console.warn('❌ Missing webhook signature headers - rejecting webhook');
    return false;
  }

  // IMPORTANT: Implement proper HMAC validation here before production
  // For now, log a warning and accept the webhook if headers are present
  // This should be replaced with actual signature verification
  console.warn('⚠️ Webhook signature validation not fully implemented - accepting webhook based on header presence');
  console.warn('⚠️ TODO: Implement proper HMAC validation before production deployment');
  
  return true;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Validate webhook signature
    if (!validateWebhookSignature(request, body)) {
      console.error('Invalid Mercado Pago webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload = JSON.parse(body);
    console.log('Received Mercado Pago webhook:', {
      type: payload.type,
      action: payload.action,
      dataId: payload.data?.id,
    });

    // Only process payment notifications
    if (payload.type !== 'payment') {
      console.log(`Ignoring non-payment webhook type: ${payload.type}`);
      return NextResponse.json(
        { message: 'Webhook type not processed' },
        { status: 200 }
      );
    }

    // Get access token
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('MERCADOPAGO_ACCESS_TOKEN not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Initialize Mercado Pago client
    const client = new MercadoPagoConfig({ accessToken });
    const paymentApi = new Payment(client);

    // Get payment details from Mercado Pago
    const paymentId = payload.data?.id;
    if (!paymentId) {
      console.error('No payment ID in webhook payload');
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    const mpPayment = await paymentApi.get({ id: paymentId });

    console.log('Mercado Pago payment details:', {
      id: mpPayment.id,
      status: mpPayment.status,
      external_reference: mpPayment.external_reference,
      transaction_amount: mpPayment.transaction_amount,
    });

    // Get order ID from external reference
    const orderId = mpPayment.external_reference;
    if (!orderId) {
      console.error('No external reference in payment');
      return NextResponse.json(
        { error: 'Payment has no order reference' },
        { status: 400 }
      );
    }

    // Try to find existing payment by reference (order ID)
    let existingPayment;
    try {
      const { data: paymentData } = await apolloClient.query({
        query: GET_PAYMENT_BY_REFERENCE,
        variables: { reference: orderId },
        fetchPolicy: 'network-only',
      });
      existingPayment = paymentData?.paymentByReference;
    } catch {
      console.log('No existing payment found for order:', orderId);
    }

    // Map Mercado Pago status to our internal status
    const newStatus = mapMercadoPagoStatus(mpPayment.status as MercadoPagoPaymentStatus);

    // Prepare update data
    const updateData = {
      status: newStatus,
      providerTransactionId: mpPayment.id?.toString(),
      referenceNumber: mpPayment.external_reference,
      ...(mpPayment.status_detail && {
        notes: JSON.stringify({
          mercadoPagoStatus: mpPayment.status,
          statusDetail: mpPayment.status_detail,
          paymentMethodId: mpPayment.payment_method_id,
          paymentTypeId: mpPayment.payment_type_id,
          processedAt: new Date().toISOString(),
        }),
      }),
      ...(newStatus === PaymentStatus.COMPLETED && {
        completedAt: mpPayment.date_approved ? new Date(mpPayment.date_approved) : new Date(),
      }),
      ...((newStatus === PaymentStatus.FAILED || newStatus === PaymentStatus.REJECTED) && {
        errorCode: `MP_${mpPayment.status_detail}`,
        errorMessage: mpPayment.status_detail || 'Payment rejected',
      }),
    };

    // Update payment if exists
    if (existingPayment) {
      // Only update if status actually changed
      if (existingPayment.status === newStatus) {
        console.log(`Payment ${existingPayment.id} status unchanged: ${newStatus}`);
        return NextResponse.json(
          { message: 'Status unchanged' },
          { status: 200 }
        );
      }

      const { data: updatedPayment } = await apolloClient.mutate({
        mutation: UPDATE_PAYMENT,
        variables: {
          id: existingPayment.id,
          input: updateData,
        },
      });

      console.log('Payment updated successfully:', {
        paymentId: updatedPayment?.updatePayment?.id,
        oldStatus: existingPayment.status,
        newStatus: newStatus,
        mpPaymentId: mpPayment.id,
      });
    } else {
      console.log('No existing payment record found, webhook processed without update');
    }

    return NextResponse.json(
      {
        message: 'Webhook processed successfully',
        orderId: orderId,
        mpPaymentId: mpPayment.id,
        status: newStatus,
        processedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mercado Pago webhook processing error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to process webhook',
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  // Mercado Pago may send GET requests for verification
  return NextResponse.json(
    { status: 'ok', message: 'Mercado Pago webhook endpoint' },
    { status: 200 }
  );
}
