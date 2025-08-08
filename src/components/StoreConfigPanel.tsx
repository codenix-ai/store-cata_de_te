'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/components/StoreProvider';
import { StoreConfig, defaultStoreConfigs } from '@/lib/store-config';
import { Save, Palette, Settings, Globe, CreditCard, Truck, Building, Package } from 'lucide-react';
import { gql, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import {
  GeneralTab,
  BrandingTab,
  BusinessTab,
  PaymentsTab,
  ShippingTab,
  SEOTab,
  ProductsTab,
} from './StoreConfigPanel/';

// GraphQL mutation for updating store
const UPDATE_STORE_MUTATION = gql`
  mutation UpdateStore($storeId: String!, $input: UpdateStoreInput!) {
    updateStore(storeId: $storeId, input: $input) {
      id
      name
      description
      logoUrl
      primaryColor
      secondaryColor
      accentColor
      backgroundColor
      textColor
      email
      phone
      address
      city
      department
      country
      businessType
      taxId
      businessName
      facebookUrl
      instagramUrl
      twitterUrl
      youtubeUrl
      tiktokUrl
      whatsappNumber
      currency
      language
      timezone
      isActive
      maintenanceMode
      metaTitle
      metaDescription
      metaKeywords
      mercadoPagoEnabled
      mercadoPagoPublicKey
      wompiEnabled
      wompiPublicKey
      ePaycoEnabled
      ePaycoPublicKey
      freeShippingThreshold
      standardShippingCost
      expressShippingCost
      taxRate
      includeTaxInPrice
    }
  }
`;

export function StoreConfigPanel() {
  const { store, updateStore, isLoading } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState<Partial<StoreConfig>>({});
  const [isSaving, setIsSaving] = useState(false);

  // GraphQL mutation hook
  const [updateStoreMutation] = useMutation(UPDATE_STORE_MUTATION, {
    onCompleted: data => {
      console.log('Store updated successfully:', data);
      toast.success('Configuración guardada exitosamente');
    },
    onError: error => {
      console.error('Error updating store:', error);
      toast.error('Error al guardar la configuración');
    },
  });

  useEffect(() => {
    if (store) {
      setConfig(store);
    }
  }, [store]);

  const handleSave = async () => {
    if (!store?.id) {
      toast.error('No se encontró el ID de la tienda');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare the input data for the mutation
      const input = {
        name: config.name,
        description: config.description,
        logoUrl: config.logoUrl,
        primaryColor: config.primaryColor,
        faviconUrl: config.faviconUrl,
        bannerUrl: config.bannerUrl,
        secondaryColor: config.secondaryColor,
        accentColor: config.accentColor,
        backgroundColor: config.backgroundColor,
        textColor: config.textColor,
        email: config.email,
        phone: config.phone,
        address: config.address,
        city: config.city,
        country: config.country,
        twitterUrl: config.twitterUrl,
        facebook: config.facebookUrl,
        instagramUrl: config.instagramUrl,
        tiktokUrl: config.tiktokUrl,
        youtubeUrl: config.youtubeUrl,
      };

      // Execute the GraphQL mutation
      const result = await updateStoreMutation({
        variables: {
          storeId: store.id,
          input: input,
        },
      });

      // Update local store state after successful mutation
      if (result.data?.updateStore) {
        await updateStore(result.data.updateStore);
      }
    } catch (error) {
      console.error('Failed to save store config:', error);
      toast.error('Error al guardar la configuración');
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
