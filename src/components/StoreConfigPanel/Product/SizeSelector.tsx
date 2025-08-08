'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ProductSize } from '@/types/product';

interface SizeSelectorProps {
  sizes: ProductSize[];
  onChange: (sizes: ProductSize[]) => void;
}

const PRESET_SIZES = [
  { name: 'Extra Small', value: 'XS' },
  { name: 'Small', value: 'S' },
  { name: 'Medium', value: 'M' },
  { name: 'Large', value: 'L' },
  { name: 'Extra Large', value: 'XL' },
  { name: 'Double XL', value: 'XXL' },
];

export function SizeSelector({ sizes, onChange }: SizeSelectorProps) {
  const [customSize, setCustomSize] = useState({ name: '', value: '' });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const addPresetSize = (preset: { name: string; value: string }) => {
    if (sizes.some(size => size.value === preset.value)) return;

    const newSize: ProductSize = {
      id: `size-${Date.now()}`,
      name: preset.name,
      value: preset.value
    };

    onChange([...sizes, newSize]);
  };

  const addCustomSize = () => {
    if (!customSize.name.trim() || !customSize.value.trim()) return;
    if (sizes.some(size => size.value === customSize.value)) return;

    const newSize: ProductSize = {
      id: `size-${Date.now()}`,
      name: customSize.name,
      value: customSize.value
    };

    onChange([...sizes, newSize]);
    setCustomSize({ name: '', value: '' });
    setShowCustomForm(false);
  };

  const removeSize = (index: number) => {
    onChange(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, field: 'name' | 'value', value: string) => {
    const updatedSizes = sizes.map((size, i) => 
      i === index ? { ...size, [field]: value } : size
    );
    onChange(updatedSizes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Tallas Disponibles</label>
        <button
          type="button"
          onClick={() => setShowCustomForm(!showCustomForm)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4 mr-1" />
          Talla Personalizada
        </button>
      </div>

      {/* Preset Sizes */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tallas Estándar</h4>
        <div className="flex flex-wrap gap-2">
          {PRESET_SIZES.map((preset) => {
            const isSelected = sizes.some(size => size.value === preset.value);
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => addPresetSize(preset)}
                disabled={isSelected}
                className={`px-3 py-1 rounded-full border text-sm ${
                  isSelected
                    ? 'bg-blue-100 border-blue-300 text-blue-700 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {preset.value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Size Form */}
      {showCustomForm && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre de la Talla
              </label>
              <input
                type="text"
                value={customSize.name}
                onChange={(e) => setCustomSize({ ...customSize, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ej: Extra Grande"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Valor/Código
              </label>
              <input
                type="text"
                value={customSize.value}
                onChange={(e) => setCustomSize({ ...customSize, value: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ej: XG"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={addCustomSize}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Agregar
              </button>
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Sizes */}
      {sizes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tallas Seleccionadas</h4>
          <div className="space-y-2">
            {sizes.map((size, index) => (
              <div key={size.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={size.name}
                    onChange={(e) => updateSize(index, 'name', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    placeholder="Nombre de la talla"
                  />
                  <input
                    type="text"
                    value={size.value}
                    onChange={(e) => updateSize(index, 'value', e.target.value.toUpperCase())}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    placeholder="Código"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {sizes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No hay tallas seleccionadas</p>
          <p className="text-xs">Selecciona tallas estándar o agrega tallas personalizadas</p>
        </div>
      )}
    </div>
  );
}
