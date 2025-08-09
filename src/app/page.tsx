'use client';

import Link from 'next/link';
import { ShoppingBag, Heart, Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { useStore } from '@/components/StoreProvider';
import Layout from '@/components/Layout/Layout';

// Mock featured products data
const featuredProducts = [
  {
    id: '1',
    name: 'Producto Destacado 1',
    price: 89900,
    originalPrice: 119900,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 124,
    category: 'Electrónicos',
    description: 'Producto de alta calidad para emprendedores',
    inStock: true,
  },
  {
    id: '2',
    name: 'Producto Destacado 2',
    price: 45000,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 89,
    category: 'Hogar',
    description: 'Perfecto para tu negocio',
    inStock: true,
  },
  {
    id: '3',
    name: 'Producto Destacado 3',
    price: 67500,
    originalPrice: 85000,
    image: '/api/placeholder/300/300',
    rating: 4.3,
    reviews: 56,
    category: 'Oficina',
    description: 'Herramientas para emprendedores',
    inStock: true,
  },
  {
    id: '4',
    name: 'Producto Destacado 4',
    price: 156000,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 203,
    category: 'Tecnología',
    description: 'Impulsa tu emprendimiento',
    inStock: true,
  },
];

const features = [
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'En compras superiores a $150.000 COP',
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Protección total en tus transacciones',
  },
  {
    icon: CreditCard,
    title: 'Múltiples Pagos',
    description: 'MercadoPago, Wompi, ePayco y más',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Estamos aquí para ayudarte siempre',
  },
];

export default function HomePage() {
  const { store } = useStore();

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section
          className="text-white"
          style={{
            background: `linear-gradient(to right, ${store?.primaryColor || '#2563eb'}, ${
              store?.secondaryColor || '#1d4ed8'
            })`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-6">Emprende con Confianza</h1>
              <p
                className="text-xl md:text-2xl mb-8"
                style={{ color: `${store?.primaryColor ? '#e0f2fe' : '#dbeafe'}` }}
              >
                Tu tienda online para emprendedores colombianos. Productos de calidad, envío rápido, precios justos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center px-8 py-4 bg-white font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: store?.primaryColor || '#2563eb' }}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Explorar Productos
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg transition-colors"
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = store?.primaryColor || '#2563eb';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Crear Cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{
                    backgroundColor: store?.primaryColor ? `${store.primaryColor}20` : '#dbeafe',
                    color: store?.primaryColor || '#2563eb',
                  }}
                >
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Featured Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-montserrat mb-4">Productos Destacados</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Descubre nuestra selección de productos más populares, ideales para impulsar tu emprendimiento
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 text-white font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: store?.primaryColor || '#2563eb',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = store?.secondaryColor || '#1d4ed8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = store?.primaryColor || '#2563eb';
              }}
            >
              Ver Todos los Productos
            </Link>
          </div>
        </section>
        {/* Newsletter Section */}
        {/* <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-montserrat mb-4">Mantente al Día</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Suscríbete a nuestro newsletter y recibe las mejores ofertas, nuevos productos y consejos para
              emprendedores
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 text-black focus:outline-none"
                onFocus={e => {
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${store?.primaryColor || '#3b82f6'}`;
                }}
                onBlur={e => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                className="px-8 py-3 rounded-r-lg font-medium transition-colors"
                style={{
                  backgroundColor: store?.primaryColor || '#2563eb',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = store?.secondaryColor || '#1d4ed8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = store?.primaryColor || '#2563eb';
                }}
              >
                Suscribirse
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              No enviamos spam. Puedes cancelar tu suscripción en cualquier momento.
            </p>
          </div>
        </div>
      </section> */}
        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div
            className="rounded-2xl p-8 md:p-12 text-center"
            style={{
              backgroundColor: store?.primaryColor ? `${store.primaryColor}10` : '#eff6ff',
            }}
          >
            <h2 className="text-3xl font-bold text-gray-900 font-montserrat mb-4">¿Listo para Emprender?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Únete a miles de emprendedores colombianos que confían en nosotros para hacer crecer sus negocios
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-3 text-white font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: store?.primaryColor || '#2563eb',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = store?.secondaryColor || '#1d4ed8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = store?.primaryColor || '#2563eb';
                }}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Comenzar a Comprar
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center px-8 py-3 border font-medium rounded-lg transition-colors"
                style={{
                  borderColor: store?.primaryColor || '#2563eb',
                  color: store?.primaryColor || '#2563eb',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = store?.primaryColor ? `${store.primaryColor}10` : '#eff6ff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Headphones className="w-5 h-5 mr-2" />
                Contactar Soporte
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
