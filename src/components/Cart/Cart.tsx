'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { cartService, Cart as CartType, CartItem } from '@/lib/cart';
import { useStore } from '@/components/StoreProvider';

interface CartProps {
  className?: string;
}

export function Cart({ className = '' }: CartProps) {
  const [cart, setCart] = useState<CartType>({ items: [], total: 0, subtotal: 0, tax: 0, shipping: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const { store } = useStore();

  useEffect(() => {
    setCart(cartService.getCart());
  }, []);

  const updateQuantity = async (productId: string, quantity: number, variant?: string) => {
    setIsLoading(true);
    const updatedCart = cartService.updateQuantity(productId, quantity, variant);
    setCart(updatedCart);
    window.dispatchEvent(new Event('storage'));
    setIsLoading(false);
  };

  const removeItem = async (productId: string, variant?: string) => {
    setIsLoading(true);
    const updatedCart = cartService.removeItem(productId, variant);
    setCart(updatedCart);
    window.dispatchEvent(new Event('storage'));
    setIsLoading(false);
  };

  const clearCart = async () => {
    setIsLoading(true);
    const updatedCart = cartService.clearCart();
    setCart(updatedCart);
    window.dispatchEvent(new Event('storage'));
    setIsLoading(false);
  };

  if (cart.items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-black mb-2">Tu carrito está vacío</h3>
        <p className="text-gray-500 mb-6">Agrega algunos productos para comenzar a comprar</p>
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors"
          style={{
            backgroundColor: store?.primaryColor || '#3B82F6',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = store?.secondaryColor || store?.primaryColor || '#2563EB';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = store?.primaryColor || '#3B82F6';
          }}
        >
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cart Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">
          Carrito de Compras ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)
        </h2>
        <button
          onClick={clearCart}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
        >
          Vaciar Carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <CartItemCard
              key={`${item.productId}-${item.variant || 'default'}`}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary cart={cart} store={store} />
        </div>
      </div>
    </div>
  );
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number, variant?: string) => void;
  onRemove: (productId: string, variant?: string) => void;
  isLoading: boolean;
}

function CartItemCard({ item, onUpdateQuantity, onRemove, isLoading }: CartItemCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-black mb-1">{item.name}</h3>
          {item.variant && <p className="text-sm text-gray-500 mb-2">Variante: {item.variant}</p>}
          <p className="text-lg font-semibold text-black">${item.price.toLocaleString('es-CO')}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1, item.variant)}
            disabled={isLoading || item.quantity <= 1}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1, item.variant)}
            disabled={isLoading}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.productId, item.variant)}
          disabled={isLoading}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Item Total */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">Subtotal:</span>
        <span className="font-semibold text-black">${(item.price * item.quantity).toLocaleString('es-CO')}</span>
      </div>
    </div>
  );
}

interface OrderSummaryProps {
  cart: CartType;
  store: any;
}

function OrderSummary({ cart, store }: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-black">Resumen del Pedido</h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">${cart.subtotal.toLocaleString('es-CO')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">IVA (19%):</span>
          <span className="font-medium">${cart.tax.toLocaleString('es-CO')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Envío:</span>
          <span className="font-medium">
            {cart.shipping === 0 ? 'Gratis' : `$${cart.shipping.toLocaleString('es-CO')}`}
          </span>
        </div>
        {cart.shipping === 0 && cart.subtotal >= 150000 && (
          <p className="text-sm text-green-600">¡Envío gratis por compras superiores a $150.000!</p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-black">Total:</span>
          <span className="text-xl font-bold text-black">${cart.total.toLocaleString('es-CO')}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          className="w-full text-white py-3 px-4 rounded-md font-medium transition-colors"
          style={{
            backgroundColor: store?.primaryColor || '#3B82F6',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = store?.secondaryColor || store?.primaryColor || '#2563EB';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = store?.primaryColor || '#3B82F6';
          }}
        >
          Proceder al Pago
        </button>
        <Link
          href="/products"
          className="block w-full text-center border border-gray-300 py-3 px-4 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Continuar Comprando
        </Link>
      </div>

      {/* Payment Methods */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-medium text-black mb-3">Métodos de Pago Aceptados:</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-2 rounded border text-center text-xs font-medium">MercadoPago</div>
          <div className="bg-white p-2 rounded border text-center text-xs font-medium">Wompi</div>
          <div className="bg-white p-2 rounded border text-center text-xs font-medium">ePayco</div>
        </div>
      </div>
    </div>
  );
}
