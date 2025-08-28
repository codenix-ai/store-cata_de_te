"use client";

import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Heart,
  Truck,
  Shield,
  CreditCard,
  Headphones,
  Star,
  ArrowRight,
  Play,
  TrendingUp,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { useStore } from "@/components/StoreProvider";
import Layout from "@/components/Layout/Layout";
import { HeroBanner } from "@/components/HeroBanner";

// GraphQL Query
const GET_PRODUCTS_BY_STORE = gql`
  query GetProductsByStore($storeId: String!, $page: Int, $pageSize: Int) {
    productsByStore(storeId: $storeId, page: $page, pageSize: $pageSize) {
      items {
        id
        name
        title
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

const features = [
  {
    icon: Truck,
    title: "Envío Express",
    description: "Entrega en 24-48h en principales ciudades",
    highlight: "Gratis desde $150.000",
  },
  {
    icon: Shield,
    title: "Garantía Total",
    description: "30 días para cambios y devoluciones",
    highlight: "100% Seguro",
  },
  {
    icon: CreditCard,
    title: "Pago Flexible",
    description: "Hasta 12 cuotas sin interés",
    highlight: "Todos los medios",
  },
  {
    icon: Headphones,
    title: "Asesoría Personal",
    description: "Expertos en moda masculina",
    highlight: "Chat 24/7",
  },
];

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "CEO StartupCo",
    content:
      "La calidad es excepcional. Mis camisas SPH siempre me dan confianza en reuniones importantes.",
    rating: 5,
  },
  {
    name: "Miguel Rodriguez",
    role: "Arquitecto",
    content:
      "Encontré mi estilo perfecto. El blazer que compré se ha convertido en mi favorito.",
    rating: 5,
  },
  {
    name: "Juan Pablo",
    role: "Emprendedor",
    content:
      "Excelente atención al cliente y productos de primera. Recomiendo 100%.",
    rating: 5,
  },
];

export default function HomePage() {
  const { store } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch products from GraphQL
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery(GET_PRODUCTS_BY_STORE, {
    variables: {
      storeId: store?.id || "default-store",
      page: 2,
      pageSize: 8,
    },
    skip: !store?.id,
  });

  const products = productsData?.productsByStore?.items || [];

  const getColorWithOpacity = (color: string, opacity: number) => {
    if (!color) return `rgba(37, 99, 235, ${opacity})`;
    return `${color}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`;
  };

  // Carousel functionality
  const nextSlide = () => {
    if (products.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }
  };

  const prevSlide = () => {
    if (products.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Helper function to get product image
  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      // Create a copy and sort images by order and get the first one
      const sortedImages = [...product.images].sort(
        (a: any, b: any) => a.order - b.order
      );
      return `https://emprendyup-images.s3.us-east-1.amazonaws.com/${sortedImages[0].url}`;
    }
    return "/placeholder.jpg";
  };

  // Helper function to get product badge
  const getProductBadge = (product: any) => {
    if (!product.inStock || (product.stock && product.stock === 0)) {
      return "Agotado";
    }
    // Check basic stock level
    if (product.stock && product.stock < 5) {
      return "Últimas unidades";
    }
    if (product.categories && product.categories.length > 0) {
      return product.categories[0].category.name;
    }
    if (!product.available) {
      return "No disponible";
    }
    return "Disponible";
  };

  // Helper function to get best price (simplified)
  const getBestPrice = (product: any) => {
    return product.price;
  };
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section - reusable component */}
        <HeroBanner />

        {/* Features Section - Enhanced */}
        <section className="py-12 sm:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-3 sm:mb-4">
                ¿Por qué Elegir SPH?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Más que una tienda, somos tu aliado en el estilo masculino
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group text-center p-6 sm:p-8 rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundColor: getColorWithOpacity(
                        store?.primaryColor || "#2563eb",
                        0.1
                      ),
                      color: store?.primaryColor || "#2563eb",
                    }}
                  >
                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">
                    {feature.description}
                  </p>
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: store?.primaryColor || "#2563eb" }}
                  >
                    {feature.highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section - Enhanced */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span
                className="inline-block px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4"
                style={{
                  backgroundColor: getColorWithOpacity(
                    store?.primaryColor || "#2563eb",
                    0.1
                  ),
                  color: store?.primaryColor || "#2563eb",
                }}
              >
                Lo Más Popular
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-3 sm:mb-4 px-4">
                Productos Destacados
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Descubre los favoritos de nuestros clientes. Calidad premium y
                estilo inigualable.
              </p>
            </div>

            {/* Products Carousel */}
            <div
              className="relative mb-8 sm:mb-12"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {productsLoading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : productsError ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Error al cargar productos</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay productos disponibles</p>
                </div>
              ) : (
                <>
                  {/* Carousel Container */}
                  <div className="overflow-hidden rounded-2xl">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${
                          currentSlide * (100 / Math.min(products.length, 4))
                        }%)`,
                        width: `${Math.max(products.length * 25, 100)}%`,
                      }}
                    >
                      {products.map((product: any) => (
                        <div
                          key={product.id}
                          className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-2 sm:px-4"
                        >
                          <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                            {/* Badge */}
                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                              <span
                                className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white"
                                style={{
                                  backgroundColor:
                                    store?.accentColor || "#60a5fa",
                                }}
                              >
                                {getProductBadge(product)}
                              </span>
                            </div>

                            {/* Product Image */}
                            <div className="aspect-square overflow-hidden relative">
                              <Image
                                src={getProductImage(product)}
                                alt={product.name || product.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="p-3 sm:p-6">
                              <div className="flex items-center mb-1 sm:mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                        i < 4
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">
                                  (4.5)
                                </span>
                              </div>

                              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base line-clamp-2">
                                {product.name || product.title}
                              </h3>

                              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
                                {product.categories &&
                                product.categories.length > 0
                                  ? product.categories[0].category.name
                                  : "Producto de calidad premium"}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                  <span className="text-sm sm:text-lg font-bold text-gray-900">
                                    {product.currency || "$"}
                                    {getBestPrice(product)?.toLocaleString()}
                                  </span>
                                  {/* Show stock info */}
                                  {product.stock && product.stock < 10 && (
                                    <span className="text-xs text-orange-500">
                                      Solo {product.stock} disponibles
                                    </span>
                                  )}
                                </div>
                                <button
                                  className="p-1.5 sm:p-2 rounded-full transition-colors hover:scale-110 transform"
                                  style={{
                                    backgroundColor: getColorWithOpacity(
                                      store?.primaryColor || "#2563eb",
                                      0.1
                                    ),
                                    color: store?.primaryColor || "#2563eb",
                                  }}
                                >
                                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center z-10 group"
                    style={{ color: store?.primaryColor || "#2563eb" }}
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center z-10 group"
                    style={{ color: store?.primaryColor || "#2563eb" }}
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
                    {products.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                          currentSlide === index
                            ? "scale-125"
                            : "hover:scale-110"
                        }`}
                        style={{
                          backgroundColor:
                            currentSlide === index
                              ? store?.primaryColor || "#2563eb"
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="text-center">
              <Link
                href="/products"
                className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-sm sm:text-base"
                style={{ backgroundColor: store?.primaryColor || "#2563eb" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    store?.secondaryColor || "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    store?.primaryColor || "#2563eb";
                }}
              >
                Ver Toda la Colección
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section - New */}
        <section
          className="py-12 sm:py-20 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${getColorWithOpacity(
              store?.primaryColor || "#2563eb",
              0.05
            )} 0%, ${getColorWithOpacity(
              store?.accentColor || "#60a5fa",
              0.05
            )} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-3 sm:mb-4 px-4">
                Lo que Dicen Nuestros Clientes
              </h2>
              <p className="text-base sm:text-lg text-gray-600 px-4">
                Más de 10,000 hombres confían en SPH para su estilo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 italic leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
