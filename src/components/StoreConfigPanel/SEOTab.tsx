import { TabProps } from './types';

export function SEOTab({ config, setConfig }: TabProps) {
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
