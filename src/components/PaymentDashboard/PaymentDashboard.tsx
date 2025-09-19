'use client';
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { usePayments, usePaymentSummary } from '@/hooks/usePayments';
import { useStorePaymentConfiguration } from '@/hooks/usePaymentConfiguration';
import { PaymentStatus, PaymentProvider, PaymentMethod, PaymentFilter, Payment } from '@/types/payment';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Eye,
  RefreshCw,
  Settings,
} from 'lucide-react';

export default function PaymentDashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    to: new Date().toISOString().split('T')[0], // today
  });

  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
    filters,
    setFilters,
    refetch: refetchPayments,
  } = usePayments();

  const { summary, loading: summaryLoading, error: summaryError } = usePaymentSummary(dateRange);

  const { configuration, isWompiEnabled, isMercadoPagoEnabled, isEpaycoEnabled } = useStorePaymentConfiguration();

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case PaymentStatus.FAILED:
      case PaymentStatus.CANCELLED:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.FAILED:
      case PaymentStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (summaryLoading || paymentsLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando dashboard de pagos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Pagos</h1>
            <p className="text-gray-600 mt-2">Gestiona y monitorea todos los pagos de tu tienda</p>
          </div>

          {/* Payment Provider Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div
              className={`p-4 rounded-lg border ${
                isWompiEnabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Wompi</h3>
                  <p className={`text-sm ${isWompiEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                    {isWompiEnabled ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
                <CreditCard className={`w-8 h-8 ${isWompiEnabled ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${
                isMercadoPagoEnabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">MercadoPago</h3>
                  <p className={`text-sm ${isMercadoPagoEnabled ? 'text-blue-600' : 'text-gray-500'}`}>
                    {isMercadoPagoEnabled ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
                <CreditCard className={`w-8 h-8 ${isMercadoPagoEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${
                isEpaycoEnabled ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">ePayco</h3>
                  <p className={`text-sm ${isEpaycoEnabled ? 'text-purple-600' : 'text-gray-500'}`}>
                    {isEpaycoEnabled ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
                <CreditCard className={`w-8 h-8 ${isEpaycoEnabled ? 'text-purple-600' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Pagos</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.totalPayments}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completados</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.completedPayments}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monto Total</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.successRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              <Filter className="w-5 h-5 text-gray-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={filters.status || ''}
                  onChange={e => setFilters({ ...filters, status: (e.target.value as PaymentStatus) || undefined })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los Estados</option>
                  {Object.values(PaymentStatus).map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
                <select
                  value={filters.provider || ''}
                  onChange={e => setFilters({ ...filters, provider: (e.target.value as PaymentProvider) || undefined })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los Proveedores</option>
                  {Object.values(PaymentProvider).map(provider => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método</label>
                <select
                  value={filters.paymentMethod || ''}
                  onChange={e =>
                    setFilters({ ...filters, paymentMethod: (e.target.value as PaymentMethod) || undefined })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los Métodos</option>
                  {Object.values(PaymentMethod).map(method => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={filters.customerEmail || ''}
                  onChange={e => setFilters({ ...filters, customerEmail: e.target.value || undefined })}
                  placeholder="Buscar por email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => refetchPayments()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Actualizar
              </button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pagos Recientes</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment: Payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(payment.amount)} {payment.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.provider}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.customerEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => {
                            /* TODO: Navigate to payment detail */
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {payments.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron pagos</p>
              </div>
            )}
          </div>

          {/* Error States */}
          {(paymentsError || summaryError) && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">
                  Error al cargar los datos: {paymentsError?.message || summaryError?.message}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
