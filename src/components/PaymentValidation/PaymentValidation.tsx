'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { useStore } from '@/components/StoreProvider';
import { CheckCircle, Package, Truck, CreditCard, MapPin, AlertCircle, XCircle, RefreshCw, Loader } from 'lucide-react';
import { GET_PAYMENT } from '@/lib/graphql/queries';
import { PaymentStatus } from '@/types/payment';
import Link from 'next/link';

interface PaymentValidationProps {
  paymentId: string;
}

export default function PaymentValidation({ paymentId }: PaymentValidationProps) {
  const { store } = useStore();
  const [polling, setPolling] = useState(true);

  const { data, loading, error, refetch } = useQuery(GET_PAYMENT, {
    variables: { id: paymentId },
    pollInterval: polling ? 3000 : 0, // Poll every 3 seconds while pending
    errorPolicy: 'all',
  });

  const payment = data?.payment;

  // Stop polling when payment is in a final state
  useEffect(() => {
    if (
      payment?.status &&
      [PaymentStatus.COMPLETED, PaymentStatus.FAILED, PaymentStatus.CANCELLED].includes(payment.status)
    ) {
      setPolling(false);
    }
  }, [payment?.status]);

  // Auto-stop polling after 5 minutes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPolling(false);
    }, 5 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading && !payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verificando tu pago...</h2>
          <p className="text-gray-600">Esto puede tomar unos momentos</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al verificar el pago</h2>
          <p className="text-gray-600 mb-4">
            No pudimos encontrar la información de tu pago. Por favor, contacta con soporte.
          </p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2">
            Reintentar
          </button>
          <Link href="/support" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Contactar Soporte
          </Link>
        </div>
      </div>
    );
  }

  const renderPaymentStatus = () => {
    switch (payment.status) {
      case PaymentStatus.COMPLETED:
        return (
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
            <p className="text-lg text-gray-600">Tu orden ha sido confirmada y está siendo procesada</p>
          </div>
        );

      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return (
          <div className="text-center mb-8">
            <div className="relative">
              <RefreshCw className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Procesando Pago...</h1>
            <p className="text-lg text-gray-600">Tu pago está siendo verificado. Por favor espera.</p>
            {polling && <p className="text-sm text-blue-600 mt-2">Actualizando automáticamente...</p>}
          </div>
        );

      case PaymentStatus.FAILED:
        return (
          <div className="text-center mb-8">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pago Fallido</h1>
            <p className="text-lg text-gray-600">No pudimos procesar tu pago</p>
            {payment.errorMessage && <p className="text-sm text-red-600 mt-2">Motivo: {payment.errorMessage}</p>}
          </div>
        );

      case PaymentStatus.CANCELLED:
        return (
          <div className="text-center mb-8">
            <Link href="/payment/cancelled">
              <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pago Cancelado</h1>
            <p className="text-lg text-gray-600">El pago fue cancelado</p>
          </div>
        );

      default:
        return (
          <div className="text-center mb-8">
            <Link href="/payment/unknown">
              <AlertCircle className="w-20 h-20 text-gray-500 mx-auto mb-4" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Estado Desconocido</h1>
            <p className="text-lg text-gray-600">No pudimos determinar el estado del pago</p>
          </div>
        );
    }
  };

  const renderActionButtons = () => {
    switch (payment.status) {
      case PaymentStatus.COMPLETED:
        return (
          <div className="flex gap-4 justify-center">
            <Link
              href="/orders"
              className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: store?.primaryColor || '#2563eb' }}
            >
              Ver Mis Órdenes
            </Link>
            <Link href="/" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Seguir Comprando
            </Link>
          </div>
        );

      case PaymentStatus.FAILED:
        return (
          <div className="flex gap-4 justify-center">
            <Link
              href={`/checkout/retry/${payment.id}`}
              className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: store?.primaryColor || '#2563eb' }}
            >
              Reintentar Pago
            </Link>
            <Link
              href="/cart"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Volver al Carrito
            </Link>
          </div>
        );

      case PaymentStatus.CANCELLED:
        return (
          <div className="flex gap-4 justify-center">
            <Link
              href="/cart"
              className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: store?.primaryColor || '#2563eb' }}
            >
              Volver al Carrito
            </Link>
            <Link href="/" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Seguir Comprando
            </Link>
          </div>
        );

      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: store?.primaryColor || '#2563eb' }}
            >
              Actualizar Estado
            </button>
            <Link
              href="/support"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Contactar Soporte
            </Link>
          </div>
        );

      default:
        return (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: store?.primaryColor || '#2563eb' }}
            >
              Verificar Estado
            </button>
            <Link
              href="/support"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Contactar Soporte
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderPaymentStatus()}

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Pago</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">ID de Pago</p>
              <p className="font-medium">{payment.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <p className="font-medium">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    payment.status === PaymentStatus.COMPLETED
                      ? 'bg-green-100 text-green-800'
                      : payment.status === PaymentStatus.FAILED
                      ? 'bg-red-100 text-red-800'
                      : payment.status === PaymentStatus.PENDING
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {payment.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monto</p>
              <p className="font-medium">
                ${payment.amount.toLocaleString('es-CO')} {payment.currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Proveedor</p>
              <p className="font-medium">{payment.provider}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Método de Pago</p>
              <p className="font-medium">{payment.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha</p>
              <p className="font-medium">{new Date(payment.createdAt).toLocaleString('es-CO')}</p>
            </div>
            {payment.providerTransactionId && (
              <div>
                <p className="text-sm text-gray-600">ID de Transacción</p>
                <p className="font-medium text-xs">{payment.providerTransactionId}</p>
              </div>
            )}
            {payment.referenceNumber && (
              <div>
                <p className="text-sm text-gray-600">Referencia</p>
                <p className="font-medium text-xs">{payment.referenceNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Information */}
        {payment.order && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de la Orden</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Número de Orden</p>
                <p className="font-medium">{payment.order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-medium">${payment.order.total.toLocaleString('es-CO')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado de la Orden</p>
                <p className="font-medium">{payment.order.status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center">{renderActionButtons()}</div>

        {/* Support Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Tienes algún problema?{' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-700">
              Contacta nuestro soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
