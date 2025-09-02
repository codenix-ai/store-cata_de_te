"use client";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { useStore } from "@/components/StoreProvider";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import Layout from "@/components/Layout/Layout";

const GET_PRODUCTS_BY_STORE = gql`
  query GetProductsByStore($storeId: String!, $page: Int, $pageSize: Int) {
    productsByStore(storeId: $storeId, page: $page, pageSize: $pageSize) {
      items {
        id
        name
        title
        description
        price
        currency
        available
        inStock
        stock
        images {
          id
          url
          order
        }
        colors {
          id
          color
          colorHex
        }
        categories {
          category {
            id
            name
            slug
          }
        }
      }
      total
      page
      pageSize
    }
  }
`;

const categories = [
  "Todas las Categorías",
  "Tecnología",
  "Oficina",
  "Fotografía",
  "Mobiliario",
  "Audio",
  "Hogar",
  "Deportes",
  "Servicios",
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  // GraphQL query for products by store
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_STORE, {
    variables: {
      storeId: store?.id || "default-store",
      page: currentPage,
      pageSize: productsPerPage,
    },
    skip: !store?.id,
  });
  
  const products = data?.productsByStore.items || [];
  const totalProducts = data?.productsByStore.total || 0;
  // Calcula el total de páginas manualmente ya que el backend no retorna totalPages
  const totalPages = Math.ceil(totalProducts / productsPerPage) || 1;

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };
  return (
    <Layout>
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
          {loading ? (
            <div className="bg-gray-300 h-4 rounded w-48 animate-pulse"></div>
          ) : (
            <p className="text-gray-600">
              Mostrando {(currentPage - 1) * productsPerPage + 1}-
              {Math.min(currentPage * productsPerPage, totalProducts)} de{" "}
              {totalProducts} productos
              {totalPages > 1 && ` (Página ${currentPage} de ${totalPages})`}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {loading ? (
            // Loading skeleton
            Array.from({ length: productsPerPage }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-48 mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-600 mb-4">Error al cargar los productos</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-white rounded hover:bg-blue-600"
                style={{ backgroundColor: store?.primaryColor || "#2563eb" }}
              >
                Intentar de nuevo
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No se encontraron productos
              </p>
              <p className="text-gray-500">
                Intenta ajustar tus filtros de búsqueda
              </p>
            </div>
          ) : (
            products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={goToPrevious}
              >
                Anterior
              </button>

              {getPageNumbers().map((page, index) => (
                <span key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      className={`px-3 py-2 rounded-md transition-colors ${
                        currentPage === page
                          ? "text-white"
                          : "text-gray-700 hover:text-black hover:bg-gray-100"
                      }`}
                      style={
                        currentPage === page
                          ? {
                              backgroundColor: store?.primaryColor || "#2563eb",
                            }
                          : {}
                      }
                      onClick={() => goToPage(page as number)}
                    >
                      {page}
                    </button>
                  )}
                </span>
              ))}

              <button
                className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={goToNext}
              >
                Siguiente
              </button>
            </nav>
          </div>
        )}
      </div>
    </Layout>
  );
}
