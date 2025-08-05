'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/components/StoreProvider';
import { StoreConfig, defaultStoreConfigs } from '@/lib/store-config';
import { Save, Palette, Settings, Globe, CreditCard, Truck, Building } from 'lucide-react';

export function StoreConfigPanel() {
  const { store, updateStore, isLoading } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState<Partial<StoreConfig>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (store) {
      setConfig(store);
    }
  }, [store]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStore(config);
      // Show success message
    } catch (error) {
      console.error('Failed to save store config:', error);
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  const applyTemplate = (templateName: keyof typeof defaultStoreConfigs) => {
    const template = defaultStoreConfigs[templateName];
    setConfig(prev => ({ ...prev, ...template }));
  };

  if (isLoading || !store) {
    return <div className="p-6">Loading store configuration...</div>;
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'branding', name: 'Marca', icon: Palette },
    { id: 'business', name: 'Negocio', icon: Building },
    { id: 'payments', name: 'Pagos', icon: CreditCard },
    { id: 'shipping', name: 'Envíos', icon: Truck },
    { id: 'seo', name: 'SEO', icon: Globe },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">Configuración de Tienda</h1>
              <p className="text-gray-600 mt-1">Personaliza la apariencia y configuración de tu tienda</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* Templates Section */}
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Plantillas Predefinidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(defaultStoreConfigs).map(([key, template]) => (
              <button
                key={key}
                onClick={() => applyTemplate(key as keyof typeof defaultStoreConfigs)}
                className="p-4 border rounded-lg hover:border-blue-500 transition-colors text-left"
              >
                <div className="w-full h-8 rounded mb-2" style={{ backgroundColor: template.primaryColor }}></div>
                <div className="font-medium capitalize">{key}</div>
                <div className="text-sm text-gray-600">{template.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r">
            <nav className="p-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-2 rounded-lg mb-2 transition-colors ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'general' && <GeneralTab config={config} setConfig={setConfig} />}
            {activeTab === 'branding' && <BrandingTab config={config} setConfig={setConfig} />}
            {activeTab === 'business' && <BusinessTab config={config} setConfig={setConfig} />}
            {activeTab === 'payments' && <PaymentsTab config={config} setConfig={setConfig} />}
            {activeTab === 'shipping' && <ShippingTab config={config} setConfig={setConfig} />}
            {activeTab === 'seo' && <SEOTab config={config} setConfig={setConfig} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual tab components
interface TabProps {
  config: Partial<StoreConfig>;
  setConfig: React.Dispatch<React.SetStateAction<Partial<StoreConfig>>>;
}

function GeneralTab({ config, setConfig }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Información General</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Tienda</label>
          <input
            type="text"
            value={config.name || ''}
            onChange={e => setConfig(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ID de la Tienda (URL)</label>
          <input
            type="text"
            value={config.storeId || ''}
            onChange={e => setConfig(prev => ({ ...prev, storeId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="mi-tienda"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
        <textarea
          rows={3}
          value={config.description || ''}
          onChange={e => setConfig(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe tu tienda..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
          <select
            value={config.currency || 'COP'}
            onChange={e => setConfig(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="COP">Peso Colombiano (COP)</option>
            <option value="USD">Dólar Americano (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
          <select
            value={config.language || 'es'}
            onChange={e => setConfig(prev => ({ ...prev, language: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
          <select
            value={config.timezone || 'America/Bogota'}
            onChange={e => setConfig(prev => ({ ...prev, timezone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/Bogota">Bogotá</option>
            <option value="America/Medellin">Medellín</option>
            <option value="America/Cartagena">Cartagena</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function BrandingTab({ config, setConfig }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Marca y Apariencia</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL del Logo</label>
          <input
            type="url"
            value={config.logoUrl || ''}
            onChange={e => setConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL del Favicon</label>
          <input
            type="url"
            value={config.faviconUrl || ''}
            onChange={e => setConfig(prev => ({ ...prev, faviconUrl: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL del Banner</label>
          <input
            type="url"
            value={config.bannerUrl || ''}
            onChange={e => setConfig(prev => ({ ...prev, bannerUrl: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium mb-4">Colores del Tema</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'primaryColor', label: 'Principal' },
            { key: 'secondaryColor', label: 'Secundario' },
            { key: 'accentColor', label: 'Acento' },
            { key: 'backgroundColor', label: 'Fondo' },
            { key: 'textColor', label: 'Texto' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={(config as any)[key] || '#000000'}
                  onChange={e => setConfig(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={(config as any)[key] || ''}
                  onChange={e => setConfig(prev => ({ ...prev, [key]: e.target.value }))}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusinessTab({ config, setConfig }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Información del Negocio</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Negocio</label>
          <input
            type="text"
            value={config.businessName || ''}
            onChange={e => setConfig(prev => ({ ...prev, businessName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Negocio</label>
          <select
            value={config.businessType || ''}
            onChange={e => setConfig(prev => ({ ...prev, businessType: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar...</option>
            <option value="individual">Persona Natural</option>
            <option value="sas">SAS</option>
            <option value="ltda">Limitada</option>
            <option value="sa">Sociedad Anónima</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">NIT/RUT</label>
          <input
            type="text"
            value={config.taxId || ''}
            onChange={e => setConfig(prev => ({ ...prev, taxId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
          <input
            type="email"
            value={config.email || ''}
            onChange={e => setConfig(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            type="tel"
            value={config.phone || ''}
            onChange={e => setConfig(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
          <input
            type="tel"
            value={config.whatsappNumber || ''}
            onChange={e => setConfig(prev => ({ ...prev, whatsappNumber: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+57 300 123 4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
        <textarea
          rows={2}
          value={config.address || ''}
          onChange={e => setConfig(prev => ({ ...prev, address: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
          <input
            type="text"
            value={config.city || ''}
            onChange={e => setConfig(prev => ({ ...prev, city: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
          <input
            type="text"
            value={config.department || ''}
            onChange={e => setConfig(prev => ({ ...prev, department: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

function PaymentsTab({ config, setConfig }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Métodos de Pago</h3>

      {/* MercadoPago */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">MercadoPago</h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.mercadoPagoEnabled || false}
              onChange={e => setConfig(prev => ({ ...prev, mercadoPagoEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {config.mercadoPagoEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clave Pública</label>
            <input
              type="text"
              value={config.mercadoPagoPublicKey || ''}
              onChange={e => setConfig(prev => ({ ...prev, mercadoPagoPublicKey: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="TEST-..."
            />
          </div>
        )}
      </div>

      {/* Wompi */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Wompi</h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.wompiEnabled || false}
              onChange={e => setConfig(prev => ({ ...prev, wompiEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {config.wompiEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clave Pública</label>
            <input
              type="text"
              value={config.wompiPublicKey || ''}
              onChange={e => setConfig(prev => ({ ...prev, wompiPublicKey: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="pub_test_..."
            />
          </div>
        )}
      </div>

      {/* ePayco */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">ePayco</h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.ePaycoEnabled || false}
              onChange={e => setConfig(prev => ({ ...prev, ePaycoEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {config.ePaycoEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clave Pública</label>
            <input
              type="text"
              value={config.ePaycoPublicKey || ''}
              onChange={e => setConfig(prev => ({ ...prev, ePaycoPublicKey: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="test_..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ShippingTab({ config, setConfig }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Configuración de Envíos</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Envío Gratis Desde (COP)</label>
          <input
            type="number"
            value={config.freeShippingThreshold || 150000}
            onChange={e => setConfig(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Costo Envío Estándar (COP)</label>
          <input
            type="number"
            value={config.standardShippingCost || 15000}
            onChange={e => setConfig(prev => ({ ...prev, standardShippingCost: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Costo Envío Express (COP)</label>
          <input
            type="number"
            value={config.expressShippingCost || ''}
            onChange={e =>
              setConfig(prev => ({ ...prev, expressShippingCost: e.target.value ? Number(e.target.value) : undefined }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Opcional"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tasa de Impuesto (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={config.taxRate || 0.19}
            onChange={e => setConfig(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">IVA Colombia: 0.19 (19%)</p>
        </div>

        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeTaxInPrice || false}
              onChange={e => setConfig(prev => ({ ...prev, includeTaxInPrice: e.target.checked }))}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Incluir impuesto en el precio</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function SEOTab({ config, setConfig }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">SEO y Metadatos</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Título Meta</label>
        <input
          type="text"
          value={config.metaTitle || ''}
          onChange={e => setConfig(prev => ({ ...prev, metaTitle: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Título que aparece en Google"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Meta</label>
        <textarea
          rows={3}
          value={config.metaDescription || ''}
          onChange={e => setConfig(prev => ({ ...prev, metaDescription: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descripción que aparece en los resultados de búsqueda"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Palabras Clave Meta</label>
        <input
          type="text"
          value={config.metaKeywords || ''}
          onChange={e => setConfig(prev => ({ ...prev, metaKeywords: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="palabra1, palabra2, palabra3"
        />
      </div>

      <div>
        <h4 className="text-md font-medium mb-4">Redes Sociales</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'facebookUrl', label: 'Facebook' },
            { key: 'instagramUrl', label: 'Instagram' },
            { key: 'twitterUrl', label: 'Twitter' },
            { key: 'youtubeUrl', label: 'YouTube' },
            { key: 'tiktokUrl', label: 'TikTok' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <input
                type="url"
                value={(config as any)[key] || ''}
                onChange={e => setConfig(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`https://${label.toLowerCase()}.com/...`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
