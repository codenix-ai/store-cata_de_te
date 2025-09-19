'use client';
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { useStorePaymentConfiguration } from '@/hooks/usePaymentConfiguration';
import { Shield, Save, AlertCircle, CheckCircle, Key, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentConfiguration() {
  const {
    configuration,
    loading,
    error,
    setupWompiConfiguration,
    setupMercadoPagoConfiguration,
    setupEpaycoConfiguration,
    isWompiEnabled,
    isMercadoPagoEnabled,
    isEpaycoEnabled,
  } = useStorePaymentConfiguration();

  const [activeTab, setActiveTab] = useState('wompi');
  const [saving, setSaving] = useState(false);

  // Wompi configuration state
  const [wompiConfig, setWompiConfig] = useState({
    publicKey: configuration?.wompiPublicKey || '',
    apiKey: '',
    testMode: configuration?.wompiTestMode ?? true,
    webhookUrl: configuration?.webhookUrl || '',
    successUrl: configuration?.successUrl || '',
    cancelUrl: configuration?.cancelUrl || '',
  });

  // MercadoPago configuration state
  const [mercadoPagoConfig, setMercadoPagoConfig] = useState({
    publicKey: configuration?.mercadoPagoPublicKey || '',
    apiKey: '',
    testMode: configuration?.mercadoPagoTestMode ?? true,
  });

  // ePayco configuration state
  const [epaycoConfig, setEpaycoConfig] = useState({
    publicKey: configuration?.epaycoPublicKey || '',
    apiKey: '',
    testMode: configuration?.epaycoTestMode ?? true,
  });

  const handleSaveWompi = async () => {
    setSaving(true);
    try {
      await setupWompiConfiguration(wompiConfig);
      toast.success('Configuración de Wompi guardada exitosamente');
    } catch (error) {
      console.error('Error saving Wompi config:', error);
      toast.error('Error al guardar la configuración de Wompi');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMercadoPago = async () => {
    setSaving(true);
    try {
      await setupMercadoPagoConfiguration(mercadoPagoConfig);
      toast.success('Configuración de MercadoPago guardada exitosamente');
    } catch (error) {
      console.error('Error saving MercadoPago config:', error);
      toast.error('Error al guardar la configuración de MercadoPago');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEpayco = async () => {
    setSaving(true);
    try {
      await setupEpaycoConfiguration(epaycoConfig);
      toast.success('Configuración de ePayco guardada exitosamente');
    } catch (error) {
      console.error('Error saving ePayco config:', error);
      toast.error('Error al guardar la configuración de ePayco');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando configuración...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configuración de Pagos</h1>
            <p className="text-gray-600 mt-2">Configura los proveedores de pago para tu tienda</p>
          </div>

          {/* Status Cards */}
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
                    {isWompiEnabled ? 'Configurado' : 'No configurado'}
                  </p>
                </div>
                {isWompiEnabled ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-400" />
                )}
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
                    {isMercadoPagoEnabled ? 'Configurado' : 'No configurado'}
                  </p>
                </div>
                {isMercadoPagoEnabled ? (
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-400" />
                )}
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
                    {isEpaycoEnabled ? 'Configurado' : 'No configurado'}
                  </p>
                </div>
                {isEpaycoEnabled ? (
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Configuration Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('wompi')}
                  className={`px-6 py-3 border-b-2 font-medium text-sm ${
                    activeTab === 'wompi'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Wompi
                </button>
                <button
                  onClick={() => setActiveTab('mercadopago')}
                  className={`px-6 py-3 border-b-2 font-medium text-sm ${
                    activeTab === 'mercadopago'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  MercadoPago
                </button>
                <button
                  onClick={() => setActiveTab('epayco')}
                  className={`px-6 py-3 border-b-2 font-medium text-sm ${
                    activeTab === 'epayco'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ePayco
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Wompi Configuration */}
              {activeTab === 'wompi' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Wompi</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Configura tu integración con Wompi para procesar pagos con tarjetas de crédito, PSE y Nequi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Key className="w-4 h-4 inline mr-2" />
                        Clave Pública
                      </label>
                      <input
                        type="text"
                        value={wompiConfig.publicKey}
                        onChange={e => setWompiConfig({ ...wompiConfig, publicKey: e.target.value })}
                        placeholder="pub_test_xxxxxxxx"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Shield className="w-4 h-4 inline mr-2" />
                        Clave Privada
                      </label>
                      <input
                        type="password"
                        value={wompiConfig.apiKey}
                        onChange={e => setWompiConfig({ ...wompiConfig, apiKey: e.target.value })}
                        placeholder="prv_test_xxxxxxxx"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Globe className="w-4 h-4 inline mr-2" />
                        URL de Webhook
                      </label>
                      <input
                        type="url"
                        value={wompiConfig.webhookUrl}
                        onChange={e => setWompiConfig({ ...wompiConfig, webhookUrl: e.target.value })}
                        placeholder="https://tudominio.com/api/webhooks/wompi"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL de Éxito</label>
                      <input
                        type="url"
                        value={wompiConfig.successUrl}
                        onChange={e => setWompiConfig({ ...wompiConfig, successUrl: e.target.value })}
                        placeholder="https://tudominio.com/orden-exitosa"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL de Cancelación</label>
                      <input
                        type="url"
                        value={wompiConfig.cancelUrl}
                        onChange={e => setWompiConfig({ ...wompiConfig, cancelUrl: e.target.value })}
                        placeholder="https://tudominio.com/checkout/cancel"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="wompi-test-mode"
                        checked={wompiConfig.testMode}
                        onChange={e => setWompiConfig({ ...wompiConfig, testMode: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="wompi-test-mode" className="ml-2 block text-sm text-gray-900">
                        Modo de pruebas
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveWompi}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                  </div>
                </div>
              )}

              {/* MercadoPago Configuration */}
              {activeTab === 'mercadopago' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de MercadoPago</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Configura tu integración con MercadoPago para procesar pagos.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Key className="w-4 h-4 inline mr-2" />
                        Clave Pública
                      </label>
                      <input
                        type="text"
                        value={mercadoPagoConfig.publicKey}
                        onChange={e => setMercadoPagoConfig({ ...mercadoPagoConfig, publicKey: e.target.value })}
                        placeholder="TEST-xxxxxxxx"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Shield className="w-4 h-4 inline mr-2" />
                        Access Token
                      </label>
                      <input
                        type="password"
                        value={mercadoPagoConfig.apiKey}
                        onChange={e => setMercadoPagoConfig({ ...mercadoPagoConfig, apiKey: e.target.value })}
                        placeholder="TEST-xxxxxxxx"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mp-test-mode"
                        checked={mercadoPagoConfig.testMode}
                        onChange={e => setMercadoPagoConfig({ ...mercadoPagoConfig, testMode: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="mp-test-mode" className="ml-2 block text-sm text-gray-900">
                        Modo de pruebas
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveMercadoPago}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                  </div>
                </div>
              )}

              {/* ePayco Configuration */}
              {activeTab === 'epayco' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de ePayco</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Configura tu integración con ePayco para procesar pagos.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Key className="w-4 h-4 inline mr-2" />
                        Clave Pública
                      </label>
                      <input
                        type="text"
                        value={epaycoConfig.publicKey}
                        onChange={e => setEpaycoConfig({ ...epaycoConfig, publicKey: e.target.value })}
                        placeholder="ePayco public key"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Shield className="w-4 h-4 inline mr-2" />
                        Clave Privada
                      </label>
                      <input
                        type="password"
                        value={epaycoConfig.apiKey}
                        onChange={e => setEpaycoConfig({ ...epaycoConfig, apiKey: e.target.value })}
                        placeholder="ePayco private key"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="epayco-test-mode"
                        checked={epaycoConfig.testMode}
                        onChange={e => setEpaycoConfig({ ...epaycoConfig, testMode: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="epayco-test-mode" className="ml-2 block text-sm text-gray-900">
                        Modo de pruebas
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveEpayco}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">Error: {error.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
