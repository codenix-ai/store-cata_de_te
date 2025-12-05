/**
 * Hook for Mercado Pago Checkout Pro integration
 * Based on: https://www.mercadopago.com.co/developers/es/docs/checkout-pro/overview
 */

'use client';

import { useState, useCallback } from 'react';
import { MercadoPagoOrderCheckout, MercadoPagoCheckoutConfig } from '@/types/mercadopago';

export interface UseMercadoPagoCheckoutReturn {
  createCheckout: (orderData: MercadoPagoOrderCheckout) => Promise<MercadoPagoCheckoutConfig>;
  redirectToCheckout: (config: MercadoPagoCheckoutConfig) => void;
  createAndRedirect: (orderData: MercadoPagoOrderCheckout) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useMercadoPagoCheckout = (): UseMercadoPagoCheckoutReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a payment preference in Mercado Pago
   */
  const createCheckout = useCallback(async (orderData: MercadoPagoOrderCheckout): Promise<MercadoPagoCheckoutConfig> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required data
      if (!orderData.orderId) {
        throw new Error('Order ID is required');
      }

      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('At least one item is required');
      }

      if (!orderData.customerEmail) {
        throw new Error('Customer email is required');
      }

      // Call our API endpoint to create the preference
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to create payment preference');
      }

      const data = await response.json();

      return {
        preferenceId: data.preferenceId,
        initPoint: data.initPoint,
        sandboxInitPoint: data.sandboxInitPoint,
        testMode: data.testMode,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Redirect user to Mercado Pago checkout
   */
  const redirectToCheckout = useCallback((config: MercadoPagoCheckoutConfig) => {
    // Use sandbox URL in test mode, production URL otherwise
    const checkoutUrl = config.testMode ? config.sandboxInitPoint : config.initPoint;

    if (!checkoutUrl) {
      setError('Checkout URL not available');
      console.error('No checkout URL available:', config);
      return;
    }

    console.log('Redirecting to Mercado Pago checkout:', {
      testMode: config.testMode,
      preferenceId: config.preferenceId,
      url: checkoutUrl,
    });

    // Redirect to Mercado Pago
    window.location.href = checkoutUrl;
  }, []);

  /**
   * Create preference and immediately redirect to checkout
   */
  const createAndRedirect = useCallback(async (orderData: MercadoPagoOrderCheckout): Promise<void> => {
    try {
      const config = await createCheckout(orderData);
      redirectToCheckout(config);
    } catch (err) {
      // Error already set by createCheckout
      console.error('Failed to create and redirect to Mercado Pago checkout:', err);
      throw err;
    }
  }, [createCheckout, redirectToCheckout]);

  return {
    createCheckout,
    redirectToCheckout,
    createAndRedirect,
    isLoading,
    error,
  };
};
