'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { ProductCard, Product } from '@/components/ProductCard/ProductCard';

interface FavoritesProps {
  className?: string;
}

export function Favorites({ className = '' }: FavoritesProps) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load favorites from localStorage
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem('emprendyup_favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = (productId: string) => {
    const updatedFavorites = favorites.filter(item => item.id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem('emprendyup_favorites', JSON.stringify(updatedFavorites));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('emprendyup_favorites');
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-300 h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-black mb-2">No tienes favoritos aún</h3>
        <p className="text-gray-500 mb-6">Agrega productos a tus favoritos para encontrarlos fácilmente más tarde</p>
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Mis Favoritos</h2>
          <p className="text-gray-600 mt-1">
            {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'} en tu lista de favoritos
          </p>
        </div>

        {favorites.length > 0 && (
          <button onClick={clearAllFavorites} className="text-red-600 hover:text-red-700 font-medium transition-colors">
            Limpiar Todo
          </button>
        )}
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map(product => (
          <div key={product.id} className="relative">
            <ProductCard product={product} />

            {/* Remove from Favorites Button */}
            <button
              onClick={() => removeFavorite(product.id)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
              title="Remover de favoritos"
            >
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Acciones Rápidas</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors">
            Agregar Todos al Carrito
          </button>
          <Link
            href="/products"
            className="flex-1 text-center border border-gray-300 py-3 px-4 rounded-md font-medium text-gray-700 hover:bg-white transition-colors"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>

      {/* Share Favorites */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black mb-2">Comparte tu Lista</h3>
        <p className="text-gray-600 mb-4">Comparte tu lista de favoritos con amigos y familiares</p>
        <button className="bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors">
          Generar Enlace para Compartir
        </button>
      </div>
    </div>
  );
}

// Service functions for managing favorites
export class FavoritesService {
  private storageKey = 'emprendyup_favorites';

  getFavorites(): Product[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  addFavorite(product: Product): Product[] {
    const favorites = this.getFavorites();
    const exists = favorites.find(item => item.id === product.id);

    if (!exists) {
      favorites.push(product);
      this.saveFavorites(favorites);
    }

    return favorites;
  }

  removeFavorite(productId: string): Product[] {
    const favorites = this.getFavorites();
    const updated = favorites.filter(item => item.id !== productId);
    this.saveFavorites(updated);
    return updated;
  }

  isFavorite(productId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(item => item.id === productId);
  }

  toggleFavorite(product: Product): boolean {
    if (this.isFavorite(product.id)) {
      this.removeFavorite(product.id);
      return false;
    } else {
      this.addFavorite(product);
      return true;
    }
  }

  clearAllFavorites(): void {
    this.saveFavorites([]);
  }

  private saveFavorites(favorites: Product[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
  }
}

export const favoritesService = new FavoritesService();
