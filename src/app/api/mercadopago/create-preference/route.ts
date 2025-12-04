import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { MercadoPagoOrderCheckout } from '@/types/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body: MercadoPagoOrderCheckout = await request.json();

    // Validate required fields
    if (!body.orderId || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and items are required' },
        { status: 400 }
      );
    }

    // Get access token from environment
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('MERCADOPAGO_ACCESS_TOKEN not configured');
      return NextResponse.json(
        { error: 'Mercado Pago is not configured' },
        { status: 500 }
      );
    }

    // Initialize Mercado Pago client
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    // Determine test mode - only enable production mode when explicitly in production
    // and MERCADOPAGO_TEST_MODE is not set to 'true'
    const isProduction = process.env.NODE_ENV === 'production';
    const testMode = !isProduction || process.env.MERCADOPAGO_TEST_MODE === 'true';

    // Build base URL for callbacks - prefer explicit configuration over request headers
    // to prevent Host header injection attacks
    const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!configuredBaseUrl && isProduction) {
      console.error('NEXT_PUBLIC_BASE_URL must be configured in production');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    const baseUrl = configuredBaseUrl || 'http://localhost:3200';

    // Create preference items from order items
    const items = body.items.map(item => ({
      id: item.id,
      title: item.name,
      description: item.description || item.name,
      picture_url: item.imageUrl,
      quantity: item.quantity,
      currency_id: 'COP',
      unit_price: item.unitPrice,
    }));

    // Build preference payload
    const preferenceData = {
      items,
      payer: {
        email: body.customerEmail,
        ...(body.customerName && {
          name: body.customerName.split(' ')[0],
          surname: body.customerName.split(' ').slice(1).join(' ') || '',
        }),
        ...(body.customerPhone && {
          phone: {
            area_code: '57', // Colombia
            number: body.customerPhone.replace(/\D/g, ''),
          },
        }),
        ...(body.customerDocument && body.customerDocumentType && {
          identification: {
            type: body.customerDocumentType.toUpperCase(),
            number: body.customerDocument,
          },
        }),
        ...(body.shippingAddress && {
          address: {
            zip_code: body.shippingAddress.zipCode || '',
            street_name: body.shippingAddress.street,
          },
        }),
      },
      back_urls: {
        success: `${baseUrl}/orden-exitosa?orderId=${body.orderId}&provider=mercadopago`,
        failure: `${baseUrl}/checkout/retry/${body.orderId}?provider=mercadopago`,
        pending: `${baseUrl}/orden-exitosa?orderId=${body.orderId}&provider=mercadopago&status=pending`,
      },
      auto_return: 'approved' as const,
      external_reference: body.orderId,
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      statement_descriptor: 'EMPRENDYUP',
      ...(body.shippingAddress && {
        shipments: {
          receiver_address: {
            zip_code: body.shippingAddress.zipCode || '',
            street_name: body.shippingAddress.street,
            city_name: body.shippingAddress.city,
            state_name: body.shippingAddress.state,
            country_name: body.shippingAddress.country || 'Colombia',
          },
        },
      }),
      metadata: {
        order_id: body.orderId,
        store_id: process.env.NEXT_PUBLIC_STORE_ID || '',
        test_mode: testMode.toString(),
      },
    };

    // Create preference in Mercado Pago
    const response = await preference.create({ body: preferenceData });

    // Return preference data for frontend
    return NextResponse.json({
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
      testMode,
      orderId: body.orderId,
    });
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);

    // Handle specific Mercado Pago errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to create payment preference',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
