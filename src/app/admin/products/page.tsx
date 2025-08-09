import { ProductsTab } from '@/components/StoreConfigPanel/ProductsTab';
import React from 'react';

export default function Products() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración de Tienda</h1>
        <p className="text-gray-600 mt-1">Gestiona la configuración y personalización de tu tienda</p>
      </div>
      <ProductsTab />
    </div>
  );
}
