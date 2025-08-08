import { TabProps } from './types';

export function BusinessTab({ config, setConfig }: TabProps) {
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
