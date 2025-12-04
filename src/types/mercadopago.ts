/**
 * Types for Mercado Pago Checkout Pro integration
 * Based on: https://www.mercadopago.com.co/developers/es/docs/checkout-pro/overview
 */

// Preference item type
export interface MercadoPagoItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

// Payer information type
export interface MercadoPagoPayer {
  name?: string;
  surname?: string;
  email: string;
  phone?: {
    area_code?: string;
    number?: string;
  };
  identification?: {
    type?: string;
    number?: string;
  };
  address?: {
    zip_code?: string;
    street_name?: string;
    street_number?: number;
  };
}

// Back URLs configuration
export interface MercadoPagoBackUrls {
  success: string;
  failure: string;
  pending: string;
}

// Shipment type
export interface MercadoPagoShipment {
  mode?: string;
  local_pickup?: boolean;
  dimensions?: string;
  cost?: number;
  receiver_address?: {
    zip_code?: string;
    street_name?: string;
    street_number?: number;
    floor?: string;
    apartment?: string;
    city_name?: string;
    state_name?: string;
    country_name?: string;
  };
}

// Preference creation input
export interface CreateMercadoPagoPreferenceInput {
  items: MercadoPagoItem[];
  payer?: MercadoPagoPayer;
  back_urls?: MercadoPagoBackUrls;
  auto_return?: 'approved' | 'all';
  external_reference?: string;
  notification_url?: string;
  statement_descriptor?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
  shipments?: MercadoPagoShipment;
  metadata?: Record<string, string>;
}

// Preference response from Mercado Pago API
export interface MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  date_created: string;
  external_reference?: string;
  items: MercadoPagoItem[];
  payer: MercadoPagoPayer;
  back_urls?: MercadoPagoBackUrls;
  auto_return?: string;
  notification_url?: string;
}

// Webhook notification types
export type MercadoPagoWebhookAction =
  | 'payment.created'
  | 'payment.updated'
  | 'payment.cancelled';

export interface MercadoPagoWebhookPayload {
  id: number;
  live_mode: boolean;
  type: string;
  date_created: string;
  application_id: string;
  user_id: string;
  version: number;
  api_version: string;
  action: MercadoPagoWebhookAction;
  data: {
    id: string;
  };
}

// Payment status from Mercado Pago
export type MercadoPagoPaymentStatus =
  | 'pending'
  | 'approved'
  | 'authorized'
  | 'in_process'
  | 'in_mediation'
  | 'rejected'
  | 'cancelled'
  | 'refunded'
  | 'charged_back';

// Payment information from Mercado Pago
export interface MercadoPagoPayment {
  id: number;
  date_created: string;
  date_approved?: string;
  date_last_updated: string;
  money_release_date?: string;
  operation_type: string;
  payment_method_id: string;
  payment_type_id: string;
  status: MercadoPagoPaymentStatus;
  status_detail: string;
  currency_id: string;
  description?: string;
  live_mode: boolean;
  payer: {
    id?: string;
    email?: string;
    identification?: {
      type?: string;
      number?: string;
    };
    phone?: {
      area_code?: string;
      number?: string;
      extension?: string;
    };
    first_name?: string;
    last_name?: string;
  };
  transaction_amount: number;
  transaction_amount_refunded?: number;
  transaction_details?: {
    net_received_amount?: number;
    total_paid_amount?: number;
    overpaid_amount?: number;
    installment_amount?: number;
  };
  external_reference?: string;
  statement_descriptor?: string;
  installments?: number;
  additional_info?: {
    items?: Array<{
      id?: string;
      title?: string;
      description?: string;
      picture_url?: string;
      category_id?: string;
      quantity?: number;
      unit_price?: number;
    }>;
  };
  order?: {
    id?: string;
    type?: string;
  };
}

// Checkout configuration for the frontend
export interface MercadoPagoCheckoutConfig {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  testMode: boolean;
}

// Order checkout data for creating a preference
export interface MercadoPagoOrderCheckout {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
  tax?: number;
  shipping?: number;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  customerDocument?: string;
  customerDocumentType?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode?: string;
    country?: string;
  };
}
