"use client";

import { useState } from "react";
import { Check, ChevronDown, Search, Tag, Loader2 } from "lucide-react";
import { useQuery, gql } from "@apollo/client";
import { ProductCategory } from "@/types/product";

interface CategorySelectorProps {
  selectedCategories: ProductCategory[];
  onChange: (categories: ProductCategory[]) => void;
}

// GraphQL Query to fetch categories
const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
    }
  }
`;

export function CategorySelector({
  selectedCategories,
  onChange,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories from GraphQL
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  const categories: ProductCategory[] = data?.categories || [];

  const filteredCategories = categories.filter((category: ProductCategory) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategory = (category: ProductCategory) => {
    // Permitir selección múltiple sin duplicados
    const alreadySelected = selectedCategories.some(
      (c) => c.id === category.id
    );
    if (alreadySelected) {
      onChange(selectedCategories.filter((c) => c.id !== category.id));
    } else {
      // Agregar solo si no existe (evitar duplicados)
      const newCategories = [...selectedCategories, category].filter(
        (cat, idx, arr) => arr.findIndex((c) => c.id === cat.id) === idx
      );
      onChange(newCategories);
    }
  };

  const removeCategory = (categoryId: string) => {
    onChange(selectedCategories.filter((c) => c.id !== categoryId));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Categorías
        </label>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-gray-600">
            Cargando categorías...
          </span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Categorías
        </label>
        <div className="text-red-600 text-sm p-4 bg-red-50 border border-red-200 rounded-lg">
          Error al cargar las categorías: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Categorías
      </label>

      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories
            .filter(
              (cat, idx, arr) => arr.findIndex((c) => c.id === cat.id) === idx
            )
            .map((category, idx) => (
              <span
                key={category.id + "-" + idx}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {category.name}
                <button
                  type="button"
                  onClick={() => removeCategory(category.id)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-700">
              {selectedCategories.length > 0
                ? selectedCategories.map((cat) => cat.name).join(", ")
                : "Seleccionar categoría"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar categorías..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Categories List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category: ProductCategory) => {
                  const isSelected = selectedCategories.some(
                    (selected) => selected.id === category.id
                  );
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span className="text-gray-900">{category.name}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  No se encontraron categorías
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedCategories.length === 0 && (
        <p className="text-sm text-gray-500">
          {categories.length === 0
            ? "No hay categorías disponibles"
            : "Selecciona una categoría para tu producto"}
        </p>
      )}
    </div>
  );
}
