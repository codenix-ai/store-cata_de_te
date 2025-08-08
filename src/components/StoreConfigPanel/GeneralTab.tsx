import { TabProps } from './types';

export function GeneralTab({ config, setConfig }: TabProps) {
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
