'use client';

import { gql, useQuery } from '@apollo/client';
import { ReactNode } from 'react';
import { StoreProvider } from './StoreProvider';

const GET_STORE_CONFIG = gql`
  query GetStore($storeId: String!) {
    store(storeId: $storeId) {
      id
      storeId
      name
      primaryColor
      secondaryColor
      accentColor
      backgroundColor
      textColor
      description
      logoUrl
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
      platform
      shopUrl
      status
      currency
      language
      timezone
      isActive
      maintenanceMode
      metaTitle
      metaDescription
      metaKeywords
      createdAt
      updatedAt
    }
  }
`;

export function AppConfigLoader({ children }: { children: ReactNode }) {
  const { loading, error, data } = useQuery(GET_STORE_CONFIG, {
    variables: { storeId: process.env.NEXT_PUBLIC_STORE_ID },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          {/* Modern spinning loader */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: 'reverse',
                animationDuration: '1.5s',
              }}
            ></div>
          </div>

          {/* Loading text with pulse animation */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 animate-pulse">Cargando tienda...</h2>
            <p className="text-gray-600 text-sm">Configurando tu experiencia personalizada</p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }
  if (error || !data?.store) {
    console.error('Error fetching store config:', error);
    // Use mock/fallback store config when GraphQL is not available
    const fallbackStore = {
      id: 'fallback',
      storeId: 'default',
      name: 'Store',
      primaryColor: '#8B4513',
      secondaryColor: '#F5DEB3',
      accentColor: '#D2691E',
      backgroundColor: '#FFFFFF',
      textColor: '#333333',
      country: 'Colombia',
      currency: 'COP',
      language: 'es',
      timezone: 'America/Bogota',
      isActive: true,
      maintenanceMode: false,
      mercadoPagoEnabled: false,
      wompiEnabled: false,
      ePaycoEnabled: false,
      freeShippingThreshold: 150000,
      standardShippingCost: 15000,
      taxRate: 0.19,
      includeTaxInPrice: false,
    };
    return <StoreProvider initialStore={fallbackStore}>{children}</StoreProvider>;
  }

  return <StoreProvider initialStore={data.store}>{children}</StoreProvider>;
}
