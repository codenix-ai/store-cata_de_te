import { TabProps } from './types';

export function ShippingTab({ config, setConfig }: TabProps) {
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
