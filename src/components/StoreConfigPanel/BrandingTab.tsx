import { TabProps } from './types';

export function BrandingTab({ config, setConfig }: TabProps) {
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
