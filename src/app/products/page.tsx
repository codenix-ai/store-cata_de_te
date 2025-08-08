"use client";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { useStore } from "@/components/StoreProvider";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

// Mock products data
const products = [
  {
    id: "1",
    name: "Laptop para Emprendedores Pro",
    price: 2500000,
    originalPrice: 3000000,
    image: "/api/placeholder/400/400",
    rating: 4.8,
    reviews: 156,
    category: "Tecnología",
    description: "Laptop de alto rendimiento para profesionales",
    inStock: true,
  },
  {
    id: "2",
    name: "Kit de Oficina Completo",
    price: 450000,
    image: "/api/placeholder/400/400",
    rating: 4.5,
    reviews: 89,
    category: "Oficina",
    description: "Todo lo que necesitas para tu oficina",
    inStock: true,
  },
  {
    id: "3",
    name: "Cámara Profesional 4K",
    price: 1800000,
    originalPrice: 2200000,
    image: "/api/placeholder/400/400",
    rating: 4.9,
    reviews: 234,
    category: "Fotografía",
    description: "Cámara profesional para contenido de calidad",
    inStock: true,
  },
  {
    id: "4",
    name: "Mesa de Trabajo Ergonómica",
    price: 680000,
    image: "/api/placeholder/400/400",
    rating: 4.3,
    reviews: 67,
    category: "Mobiliario",
    description: "Mesa ajustable para máxima comodidad",
    inStock: true,
  },
  {
    id: "5",
    name: "Micrófono Podcast Pro",
    price: 320000,
    originalPrice: 450000,
    image: "/api/placeholder/400/400",
    rating: 4.7,
    reviews: 145,
    category: "Audio",
    description: "Micrófono de estudio para podcasts",
    inStock: false,
  },
  {
    id: "6",
    name: "Silla Ejecutiva Premium",
    price: 890000,
    image: "/api/placeholder/400/400",
    rating: 4.6,
    reviews: 98,
    category: "Mobiliario",
    description: "Silla ergonómica para largas jornadas",
    inStock: true,
  },
  {
    id: "7",
    name: "Tablet para Presentaciones",
    price: 1250000,
    image: "/api/placeholder/400/400",
    rating: 4.4,
    reviews: 112,
    category: "Tecnología",
    description: "Tablet profesional con stylus incluido",
    inStock: true,
  },
  {
    id: "8",
    name: "Kit de Iluminación LED",
    price: 580000,
    originalPrice: 750000,
    image: "/api/placeholder/400/400",
    rating: 4.8,
    reviews: 203,
    category: "Fotografía",
    description: "Iluminación profesional para videos",
    inStock: true,
  },
];

const categories = [
  "Todas las Categorías",
  "Tecnología",
  "Oficina",
  "Fotografía",
  "Mobiliario",
  "Audio",
  "Hogar",
  "Deportes",
];

const sortOptions = [
  { value: "featured", label: "Destacados" },
  { value: "price-low", label: "Precio: Menor a Mayor" },
  { value: "price-high", label: "Precio: Mayor a Menor" },
  { value: "rating", label: "Mejor Calificados" },
  { value: "newest", label: "Más Nuevos" },
];

export default function ProductsPage() {
  const { store } = useStore();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black font-montserrat mb-4">
          Todos los Productos
        </h1>
        <p className="text-gray-600">
          Encuentra todo lo que necesitas para hacer crecer tu emprendimiento
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>

        {/* Sort Filter */}
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <SlidersHorizontal className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>

        {/* Mobile Filters Button */}
        <button className="lg:hidden flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filtros
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">Mostrando {products.length} productos</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <nav className="flex items-center space-x-2">
          <button
            className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled
          >
            Anterior
          </button>
          <button
            className="px-3 py-2 text-white rounded-md"
            style={{ backgroundColor: store?.primaryColor || "#2563eb" }}
          >
            1
          </button>
          <button className="px-3 py-2 text-gray-700 hover:text-black rounded-md hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-2 text-gray-700 hover:text-black rounded-md hover:bg-gray-100">
            3
          </button>
          <span className="px-3 py-2 text-gray-500">...</span>
          <button className="px-3 py-2 text-gray-700 hover:text-black rounded-md hover:bg-gray-100">
            10
          </button>
          <button className="px-3 py-2 text-gray-700 hover:text-black">
            Siguiente
          </button>
        </nav>
      </div>
    </div>
  );
}
