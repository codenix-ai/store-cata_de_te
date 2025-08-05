'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Menu, X, ShoppingCart, Heart, User, Search, HelpCircle } from 'lucide-react';
import { cartService } from '@/lib/cart';
import { useStore } from '@/components/StoreProvider';

export function Navbar() {
  const { data: session } = useSession();
  const { store, isLoading } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    setCartItemCount(cartService.getItemCount());

    // Listen for cart updates
    const handleStorageChange = () => {
      setCartItemCount(cartService.getItemCount());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading || !store) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="animate-pulse bg-gray-300 h-8 w-32 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-8 w-64 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  const navigation = [
    { name: 'Tienda', href: '/products' },
    { name: '', href: '/cart', icon: ShoppingCart, badge: cartItemCount },
    { name: '', href: '/favorites', icon: Heart },
    { name: '', href: '/support', icon: HelpCircle },
  ];

  // Mobile navigation excludes cart and favorites (they're in the navbar)
  const mobileNavigation = [
    { name: 'Tienda', href: '/products' },
    { name: 'Soporte', href: '/support', icon: HelpCircle },
  ];

  return (
    <nav className="shadow-lg sticky top-0 z-50" style={{ backgroundColor: store.backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {store.logoUrl ? (
                <Image src={store.logoUrl} alt={store.name} width={120} height={40} className="h-8 w-auto" />
              ) : (
                <span className="text-2xl font-bold font-montserrat" style={{ color: store.primaryColor }}>
                  {store.name}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative hover:opacity-80"
                style={{
                  color: store.textColor,
                }}
              >
                {item.icon && <item.icon className="w-5 h-5 mr-1" />}
                {item.name}
                {item.badge && item.badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    style={{ backgroundColor: store.accentColor }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* User Menu */}
            <div className="flex items-center">
              {session ? (
                <Link
                  href="/user"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: store.textColor }}
                >
                  <User className="w-5 h-5 mr-1" />
                  Mi Cuenta
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-white hover:opacity-90"
                  style={{ backgroundColor: store.primaryColor }}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button and icons */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Heart Icon */}
            <Link href="/favorites" className="text-gray-700 hover:text-blue-600 transition-colors">
              <Heart className="w-6 h-6" />
            </Link>

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {mobileNavigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                  {item.name}
                </Link>
              ))}

              <div className="border-t pt-4">
                {session ? (
                  <Link
                    href="/user"
                    className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Mi Cuenta
                  </Link>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
