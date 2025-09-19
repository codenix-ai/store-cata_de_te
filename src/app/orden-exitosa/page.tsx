'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout/Layout';
import PaymentValidation from '@/components/PaymentValidation/PaymentValidation';
import { Loader } from 'lucide-react';
import Link from 'next/link';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment');

  if (!paymentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pago no encontrado</h2>
          <p className="text-gray-600 mb-4">
            No se pudo encontrar la información del pago. Por favor verifica el enlace.
          </p>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return <PaymentValidation paymentId={paymentId} />;
}

export default function OrderSuccessPage() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Cargando información del pago...</p>
            </div>
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </Layout>
  );
}
