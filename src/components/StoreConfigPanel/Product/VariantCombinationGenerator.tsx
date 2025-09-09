'use client';

import { useState, useMemo, useEffect } from 'react';
import { Zap, Package, Hash } from 'lucide-react';
import { ProductColor, ProductSize } from '@/types/product';

interface CustomVariant {
  id: string;
  type: string;
  name: string;
  value: string;
}

interface VariantCombination {
  id: string;
  name: string;
  variants: Array<{
    type: string;
    name: string;
    value: string;
  }>;
  stock: number;
  price?: number;
}

interface VariantCombinationGeneratorProps {
  colors: ProductColor[];
  sizes: ProductSize[];
  customVariants: CustomVariant[];
  onCombinationsChange: (combinations: VariantCombination[]) => void;
  existingCombinations?: VariantCombination[];
  isEditMode?: boolean;
  basePrice?: number; // Add base price prop
}

export function VariantCombinationGenerator({
  colors,
  sizes,
  customVariants,
  onCombinationsChange,
  existingCombinations = [],
  isEditMode = false,
  basePrice = 0, // Add base price with default value
}: VariantCombinationGeneratorProps) {
  const [showCombinations, setShowCombinations] = useState(isEditMode && existingCombinations.length > 0);
  const [combinations, setCombinations] = useState<VariantCombination[]>(existingCombinations);

  // Group custom variants by type
  const customVariantsByType = useMemo(() => {
    const grouped: Record<string, CustomVariant[]> = {};
    customVariants.forEach(variant => {
      const type = variant.type.toLowerCase();
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(variant);
    });
    return grouped;
  }, [customVariants]);

  // Update combinations when existingCombinations change (for edit mode)
  useEffect(() => {
    if (isEditMode && existingCombinations.length > 0 && combinations.length === 0) {
      console.log('🔄 Loading existing combinations:', existingCombinations.length);
      setCombinations(existingCombinations);
      setShowCombinations(true);
      onCombinationsChange(existingCombinations);
    }
  }, [existingCombinations, isEditMode]); // Removed onCombinationsChange from deps to avoid loops

  // Generate all possible combinations
  const generateCombinations = () => {
    // If we're in edit mode and have existing combinations, ask for confirmation
    if (isEditMode && combinations.length > 0) {
      const shouldRegenerate = window.confirm(
        `Ya existen ${combinations.length} combinaciones de variantes con stock asignado. ¿Estás seguro de que quieres regenerar todas las combinaciones? Esto reemplazará las existentes.`
      );

      if (!shouldRegenerate) {
        return; // User cancelled
      }
    }

    const allVariantTypes: Array<{
      type: string;
      variants: Array<{ name: string; value: string; hex?: string }>;
    }> = [];

    // Add colors
    if (colors.length > 0) {
      allVariantTypes.push({
        type: 'color',
        variants: colors.map(color => ({
          name: color.name,
          value: color.name,
          hex: color.hex,
        })),
      });
    }

    // Add sizes
    if (sizes.length > 0) {
      allVariantTypes.push({
        type: 'size',
        variants: sizes.map(size => ({
          name: size.name,
          value: size.value || size.name,
        })),
      });
    }

    // Add custom variants by type
    Object.entries(customVariantsByType).forEach(([type, variants]) => {
      if (variants.length > 0) {
        allVariantTypes.push({
          type,
          variants: variants.map(variant => ({
            name: variant.name,
            value: variant.value || variant.name,
          })),
        });
      }
    });

    // Generate cartesian product
    const generateCartesianProduct = (
      arrays: Array<{
        type: string;
        variants: Array<{ name: string; value: string; hex?: string }>;
      }>
    ): VariantCombination[] => {
      if (arrays.length === 0) return [];
      if (arrays.length === 1) {
        return arrays[0].variants.map((variant, index) => ({
          id: `combination-${index}`,
          name: variant.name,
          variants: [
            {
              type: arrays[0].type,
              name: variant.name,
              value: variant.value,
            },
          ],
          stock: 10,
          price: basePrice ?? 0,
        }));
      }

      const result: VariantCombination[] = [];
      const [first, ...rest] = arrays;
      const restCombinations = generateCartesianProduct(rest);

      first.variants.forEach(variant => {
        restCombinations.forEach((restCombination, index) => {
          const combinationName = `${variant.name} - ${restCombination.name}`;
          result.push({
            id: `combination-${variant.name}-${restCombination.id}-${index}`,
            name: combinationName,
            variants: [
              {
                type: first.type,
                name: variant.name,
                value: variant.value,
              },
              ...restCombination.variants,
            ],
            stock: 10,
            price: basePrice ?? 0,
          });
        });
      });

      return result;
    };

    const newCombinations = generateCartesianProduct(allVariantTypes);

    // If we have existing combinations, try to preserve their stock values
    const combinationsWithPreservedStock = newCombinations.map(newCombo => {
      const existingCombo = combinations.find(
        existing =>
          existing.name === newCombo.name ||
          (existing.variants.length === newCombo.variants.length &&
            existing.variants.every(
              (ev, i) => ev.type === newCombo.variants[i].type && ev.name === newCombo.variants[i].name
            ))
      );

      return {
        ...newCombo,
        stock: existingCombo ? existingCombo.stock : 10,
        price: existingCombo ? existingCombo.price : basePrice, // Use base price for new combinations
      };
    });

    setCombinations(combinationsWithPreservedStock);
    setShowCombinations(true);
    onCombinationsChange(combinationsWithPreservedStock);
  };

  const updateCombinationStock = (combinationId: string, stock: number) => {
    const updatedCombinations = combinations.map(combination =>
      combination.id === combinationId ? { ...combination, stock } : combination
    );
    setCombinations(updatedCombinations);
    onCombinationsChange(updatedCombinations);
  };

  const updateCombinationPrice = (combinationId: string, price: number) => {
    const updatedCombinations = combinations.map(combination =>
      combination.id === combinationId ? { ...combination, price } : combination
    );
    setCombinations(updatedCombinations);
    onCombinationsChange(updatedCombinations);
  };

  const getTotalVariants = () => {
    return colors.length + sizes.length + customVariants.length;
  };

  const hasVariants = getTotalVariants() > 0;

  if (!hasVariants) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-center text-gray-500">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Agrega colores, tallas o variantes personalizadas para generar combinaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center">
          <Hash className="w-5 h-5 mr-2 text-purple-600" />
          <h5 className="text-md font-medium text-gray-800">Gestión de Inventario por Variante</h5>
        </div>
        <button
          type="button"
          onClick={generateCombinations}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          <Zap className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">
            {isEditMode && existingCombinations.length > 0
              ? 'Regenerar Combinaciones'
              : 'Generar Combinaciones de Variantes'}
          </span>
          <span className="sm:hidden">{isEditMode && existingCombinations.length > 0 ? 'Regenerar' : 'Generar'}</span>
        </button>
      </div>

      {!showCombinations && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start">
            <Package className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-purple-800 font-medium">Combinaciones disponibles</p>
              <p className="text-sm text-purple-700 mt-1">
                Con las variantes actuales se pueden generar{' '}
                <strong>
                  {colors.length > 0 && sizes.length > 0
                    ? colors.length * sizes.length
                    : colors.length || sizes.length || 0}{' '}
                  combinaciones básicas
                </strong>
                {Object.keys(customVariantsByType).length > 0 && (
                  <span> más las combinaciones con las variantes personalizadas</span>
                )}
              </p>
              <p className="text-xs text-purple-600 mt-2">
                💡{' '}
                {isEditMode && existingCombinations.length > 0
                  ? "Las combinaciones existentes se cargan automáticamente. Usa 'Regenerar' para crear nuevas combinaciones."
                  : 'Haz clic en "Generar Combinaciones" para gestionar el stock individual de cada variante'}
              </p>
            </div>
          </div>
        </div>
      )}

      {showCombinations && combinations.length > 0 && (
        <div className="space-y-4">
          {isEditMode && existingCombinations.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <p className="text-sm text-green-800">
                  <strong>Combinaciones existentes cargadas:</strong> Se han cargado {combinations.length} combinaciones
                  con su stock actual.
                </p>
              </div>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h6 className="text-sm font-medium text-gray-800">
                  Combinaciones de Variantes ({combinations.length})
                </h6>
                <button
                  type="button"
                  onClick={() => setShowCombinations(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 self-start sm:self-auto"
                >
                  Ocultar
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-0">
                {combinations.map((combination, index) => (
                  <div
                    key={combination.id}
                    className={`px-4 py-4 border-b border-gray-100 last:border-b-0 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    {/* Mobile and Tablet Layout */}
                    <div className="block lg:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <h6 className="text-sm font-medium text-gray-900 truncate">{combination.name}</h6>
                      </div>

                      {/* Variants Tags - Responsive Layout */}
                      <div className="flex flex-wrap gap-1.5">
                        {combination.variants.map((variant, vIndex) => (
                          <span
                            key={vIndex}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              variant.type === 'color'
                                ? 'bg-purple-100 text-purple-800'
                                : variant.type === 'size'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {variant.type === 'color' && (
                              <div
                                className="w-2 h-2 rounded-full mr-1"
                                style={{
                                  backgroundColor: colors.find(c => c.name === variant.name)?.hex || '#000',
                                }}
                              />
                            )}
                            {variant.name}
                          </span>
                        ))}
                      </div>

                      {/* Controls - Stack on mobile */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-600 block">Precio ($)</label>
                          <input
                            type="number"
                            min="0"
                            value={combination.price ?? 0}
                            onChange={e => updateCombinationPrice(combination.id, parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-600 block">Stock (unidades)</label>
                          <input
                            type="number"
                            min="0"
                            value={combination.stock}
                            onChange={e => updateCombinationStock(combination.id, parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:flex items-center justify-between">
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center space-x-3">
                          <h6 className="text-sm font-medium text-gray-900 truncate">{combination.name}</h6>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {combination.variants.map((variant, vIndex) => (
                            <span
                              key={vIndex}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                variant.type === 'color'
                                  ? 'bg-purple-100 text-purple-800'
                                  : variant.type === 'size'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {variant.type === 'color' && (
                                <div
                                  className="w-2 h-2 rounded-full mr-1"
                                  style={{
                                    backgroundColor: colors.find(c => c.name === variant.name)?.hex || '#000',
                                  }}
                                />
                              )}
                              {variant.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 flex-shrink-0">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600 whitespace-nowrap">Precio:</label>
                          <input
                            type="number"
                            min="0"
                            value={combination.price ?? 0}
                            onChange={e => updateCombinationPrice(combination.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-500">$</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600 whitespace-nowrap">Stock:</label>
                          <input
                            type="number"
                            min="0"
                            value={combination.stock}
                            onChange={e => updateCombinationStock(combination.id, parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-500">unidades</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                <span className="text-gray-600">Total de combinaciones: {combinations.length}</span>
                <span className="text-gray-600">
                  Stock total:{' '}
                  <span className="font-medium">
                    {combinations.reduce((total, combination) => total + combination.stock, 0)} unidades
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Package className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">💡 Gestión de inventario por variante</p>
                <p className="text-sm text-blue-700 mt-1">
                  Puedes establecer diferentes cantidades de stock para cada combinación de variantes. Esto te permitirá
                  tener un control preciso del inventario para cada versión específica de tu producto.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
