"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { ProductGallery } from "@/components/ProductGallery/ProductGallery";
import { cartService } from "@/lib/cart";

// Mock product data - in real app, this would come from API/GraphQL
const getProductById = (id: string) => {
  const products = {
    "1": {
      id: "1",
      name: "Laptop para Emprendedores Pro",
      price: 2500000,
      originalPrice: 3000000,
      images: [
        "/api/placeholder/600/600",
        "/api/placeholder/600/600",
        "/api/placeholder/600/600",
        "/api/placeholder/600/600",
        "/api/placeholder/600/600",
      ],
      rating: 4.8,
      reviews: 156,
      category: "Tecnología",
      description:
        "Laptop de alto rendimiento diseñada específicamente para emprendedores y profesionales que buscan potencia, portabilidad y elegancia. Con procesador de última generación y componentes premium.",
      features: [
        "Procesador Intel Core i7 de 12va generación",
        "16GB RAM DDR5",
        "SSD 512GB NVMe",
        'Pantalla 15.6" 4K OLED',
        "Batería de 12 horas",
        "Conectividad Wi-Fi 6E",
      ],
      specifications: {
        Procesador: "Intel Core i7-1260P",
        "Memoria RAM": "16GB DDR5",
        Almacenamiento: "512GB SSD NVMe",
        Pantalla: '15.6" 4K OLED (3840x2160)',
        Gráficos: "Intel Iris Xe",
        "Sistema Operativo": "Windows 11 Pro",
        Peso: "1.8 kg",
        Garantía: "2 años",
      },
      inStock: true,
      stock: 15,
      variants: [
        {
          id: "config1",
          name: "Configuración",
          value: "16GB RAM / 512GB SSD",
          price: 2500000,
        },
        {
          id: "config2",
          name: "Configuración",
          value: "32GB RAM / 1TB SSD",
          price: 3200000,
        },
      ],
    },
  };

  return products[id as keyof typeof products];
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const product = getProductById(productId);

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">
            Producto no encontrado
          </h1>
          <Link href="/products" className="text-blue-600 hover:text-blue-700">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - currentPrice) / product.originalPrice) * 100
      )
    : 0;

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      cartService.addItem({
        id: `${product.id}-${selectedVariant?.id || "default"}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: currentPrice,
        image: product.images[0],
        variant: selectedVariant?.value,
        quantity,
      });

      // Trigger storage event to update cart count
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorites service
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-700">
          Productos
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-gray-700"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-black">{product.name}</span>
      </nav>

      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a productos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold text-black mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.reviews} reseñas)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-black">
                ${currentPrice.toLocaleString("es-CO")}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toLocaleString("es-CO")}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <p className="text-green-600 font-medium">
                  ✓ En stock ({product.stock} disponibles)
                </p>
              ) : (
                <p className="text-red-600 font-medium">✗ Agotado</p>
              )}
            </div>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-black mb-3">
                Configuración:
              </h3>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <label
                    key={variant.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVariant?.id === variant.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="variant"
                        value={variant.id}
                        checked={selectedVariant?.id === variant.id}
                        onChange={() => setSelectedVariant(variant)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-black">{variant.value}</span>
                    </div>
                    <span className="font-medium text-black">
                      ${variant.price?.toLocaleString("es-CO")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-medium text-black mb-3">Cantidad:</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 rounded-l-lg"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 rounded-r-lg"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <span className="text-gray-600">
                Máximo {product.stock} unidades
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al Carrito
                  </>
                )}
              </button>
              <button
                onClick={handleToggleFavorite}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Comprar Ahora
            </button>
          </div>

          {/* Shipping & Security */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-green-600" />
              <span className="text-black">
                Envío gratis en compras superiores a $150.000
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-black">Compra 100% segura y protegida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="border-t pt-8">
        <div className="flex space-x-8 border-b">
          {[
            { id: "description", label: "Descripción" },
            { id: "features", label: "Características" },
            { id: "specifications", label: "Especificaciones" },
            { id: "reviews", label: "Reseñas" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "features" && (
            <div>
              <h3 className="text-lg font-medium text-black mb-4">
                Características principales:
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "specifications" && (
            <div>
              <h3 className="text-lg font-medium text-black mb-4">
                Especificaciones técnicas:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-gray-200"
                  >
                    <span className="font-medium text-black">{key}:</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="text-lg font-medium text-black mb-4">
                Reseñas de clientes
              </h3>
              <p className="text-gray-600">
                Las reseñas se mostrarán aquí próximamente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
