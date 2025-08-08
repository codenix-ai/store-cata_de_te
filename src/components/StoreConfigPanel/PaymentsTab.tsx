import { TabProps } from './types';

export function PaymentsTab({ config, setConfig }: TabProps) {
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
