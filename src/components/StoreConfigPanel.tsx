'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/components/StoreProvider';
import { StoreConfig, defaultStoreConfigs } from '@/lib/store-config';
import { Save, Palette, Settings, Globe, CreditCard, Truck, Building, Package } from 'lucide-react';
import { 
  GeneralTab, 
  BrandingTab, 
  BusinessTab, 
  PaymentsTab, 
  ShippingTab, 
  SEOTab,
  ProductsTab
} from './StoreConfigPanel/';

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
    { id: 'products', name: 'Productos', icon: Package },
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
            {activeTab === 'products' && <ProductsTab config={config} setConfig={setConfig} />}
            {activeTab === 'payments' && <PaymentsTab config={config} setConfig={setConfig} />}
            {activeTab === 'shipping' && <ShippingTab config={config} setConfig={setConfig} />}
            {activeTab === 'seo' && <SEOTab config={config} setConfig={setConfig} />}
          </div>
        </div>
      </div>
    </div>
  );
}
