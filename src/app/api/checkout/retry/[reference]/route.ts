<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
=======
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
>>>>>>> upstream/main
  try {
    const { reference } = await params;

    // In a real app, fetch from database
    // const order = await prisma.order.findUnique({
    //   where: { reference },
    //   include: {
    //     items: true,
    //     payments: true
    //   }
    // });

    // Mock data for development
    const mockOrder = {
<<<<<<< HEAD
      id: "1",
      reference: reference,
      status: "PENDING",
      total: 368543,
      failedAttempts: 1,
      maxAttempts: 3,
      lastFailureReason: "Tu tarjeta fue rechazada por el banco emisor",
      customerEmail: "customer@example.com",
      items: [
        {
          id: "1",
          name: "Producto Ejemplo 1",
          price: 179800,
          quantity: 2,
          image: "/assets/img1.webp",
        },
        {
          id: "2",
          name: "Producto Ejemplo 2",
          price: 129900,
          quantity: 1,
          image: "/assets/img2.png",
=======
      id: '1',
      reference: reference,
      status: 'PENDING',
      total: 368543,
      failedAttempts: 1,
      maxAttempts: 3,
      lastFailureReason: 'Tu tarjeta fue rechazada por el banco emisor',
      customerEmail: 'customer@example.com',
      items: [
        {
          id: '1',
          name: 'Producto Ejemplo 1',
          price: 179800,
          quantity: 2,
          image: '/assets/img1.png',
        },
        {
          id: '2',
          name: 'Producto Ejemplo 2',
          price: 129900,
          quantity: 1,
          image: '/assets/img2.png',
>>>>>>> upstream/main
        },
      ],
      payments: [
        {
<<<<<<< HEAD
          id: "1",
          status: "DECLINED",
          amount: 368543,
          paymentMethod: "CARD",
          failureReason: "Tu tarjeta fue rechazada por el banco emisor",
=======
          id: '1',
          status: 'DECLINED',
          amount: 368543,
          paymentMethod: 'CARD',
          failureReason: 'Tu tarjeta fue rechazada por el banco emisor',
>>>>>>> upstream/main
          createdAt: new Date().toISOString(),
        },
      ],
    };

    if (!mockOrder) {
<<<<<<< HEAD
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
=======
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
>>>>>>> upstream/main
    }

    return NextResponse.json({
      order: mockOrder,
      canRetry: mockOrder.failedAttempts < mockOrder.maxAttempts,
      retryOptions: {
<<<<<<< HEAD
        availableMethods: ["CARD", "PSE", "NEQUI"],
        recommendedMethod:
          mockOrder.payments[0]?.paymentMethod === "CARD" ? "PSE" : "CARD",
      },
    });
  } catch (error) {
    console.error("Error fetching order for retry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
=======
        availableMethods: ['CARD', 'PSE', 'NEQUI'],
        recommendedMethod: mockOrder.payments[0]?.paymentMethod === 'CARD' ? 'PSE' : 'CARD',
      },
    });
  } catch (error) {
    console.error('Error fetching order for retry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
>>>>>>> upstream/main
  try {
    const { reference } = await params;
    const body = await request.json();
    const { paymentMethod } = body;

    // In a real app, update the order and create new payment attempt
    // const order = await prisma.order.update({
    //   where: { reference },
    //   data: {
    //     failedAttempts: { increment: 1 }
    //   }
    // });

    // const newPaymentAttempt = await prisma.payment.create({
    //   data: {
    //     orderId: order.id,
    //     status: 'PENDING',
    //     paymentMethod,
    //     amount: order.total
    //   }
    // });

    // Generate new payment reference for retry
    const newReference = `${reference}_retry_${Date.now()}`;

    // Generate Wompi payment URL
    const wompiData = {
<<<<<<< HEAD
      publicKey:
        process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ||
        "pub_test_G6jyWcpGlLJG8ATDRf9u6gLKy3MH8J",
      currency: "COP",
      amountInCents: 36854300, // Mock amount * 100
      reference: newReference,
      redirectUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/orden-exitosa`,
      customerEmail: "customer@example.com",
=======
      publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_test_G6jyWcpGlLJG8ATDRf9u6gLKy3MH8J',
      currency: 'COP',
      amountInCents: 36854300, // Mock amount * 100
      reference: newReference,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orden-exitosa`,
      customerEmail: 'customer@example.com',
>>>>>>> upstream/main
      paymentMethods: [paymentMethod],
    };

    // In production, generate integrity signature
<<<<<<< HEAD
    const integritySignature = "mock-signature-for-development";

    return NextResponse.json({
      success: true,
      paymentUrl: "https://checkout.wompi.co/p/",
=======
    const integritySignature = 'mock-signature-for-development';

    return NextResponse.json({
      success: true,
      paymentUrl: 'https://checkout.wompi.co/p/',
>>>>>>> upstream/main
      paymentData: wompiData,
      integritySignature,
      newReference,
    });
  } catch (error) {
<<<<<<< HEAD
    console.error("Error creating payment retry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
=======
    console.error('Error creating payment retry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
>>>>>>> upstream/main
  }
}
