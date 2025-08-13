"use client";
import React from "react";
import Image from "next/image";
import { useStore } from "@/components/StoreProvider";
import { CheckCircle, Package, Truck, CreditCard, MapPin } from "lucide-react";

// Mock data - in a real app, this would come from props or API
const mockOrderData = {
  orderNumber: "ORD-2025-001234",
  date: new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  status: "Confirmado",
  estimatedDelivery: "3-5 días hábiles",
  items: [
    {
      id: "1",
      name: "Producto Ejemplo 1",
      image: "/placeholder-image.svg",
      variant: "Talla M, Color Azul",
      quantity: 2,
      price: 89900,
    },
    {
      id: "2",
      name: "Producto Ejemplo 2",
      image: "/placeholder-image.svg",
      variant: "Talla L",
      quantity: 1,
      price: 129900,
    },
  ],
  subtotal: 309700,
  tax: 58843,
  shipping: 0,
  total: 368543,
  address: {
    name: "Juan Pérez",
    street: "Calle 123 #45-67",
    city: "Bogotá",
    department: "Cundinamarca",
    phone: "+57 300 123 4567",
  },
  payment: {
    method: "Tarjeta de Crédito",
    last4: "1234",
    cardType: "Visa",
  },
};

export default function OrderSuccess() {
  const { store } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle
              className="w-16 h-16 text-green-500"
              style={{ color: store?.primaryColor || "#10b981" }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Orden Confirmada!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Tu pedido ha sido recibido y está siendo procesado
          </p>
          <div className="bg-gray-100 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">Número de orden</p>
            <p className="text-xl font-bold text-gray-900">
              {mockOrderData.orderNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Estado del Pedido
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {mockOrderData.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {mockOrderData.date}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: store?.primaryColor || "#2563eb",
                        width: "25%",
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-2" />
                    Entrega estimada: {mockOrderData.estimatedDelivery}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Ordered */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Productos Ordenados
              </h2>
              <div className="space-y-4">
                {mockOrderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-500">{item.variant}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toLocaleString("es-CO")}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toLocaleString("es-CO")} c/u
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Dirección de Entrega
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  {mockOrderData.address.name}
                </p>
                <p className="text-gray-600">{mockOrderData.address.street}</p>
                <p className="text-gray-600">
                  {mockOrderData.address.city},{" "}
                  {mockOrderData.address.department}
                </p>
                <p className="text-gray-600 mt-2">
                  Teléfono: {mockOrderData.address.phone}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Método de Pago
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {mockOrderData.payment.method}
                    </p>
                    <p className="text-sm text-gray-600">
                      {mockOrderData.payment.cardType} ••••{" "}
                      {mockOrderData.payment.last4}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Pagado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Resumen de la Orden
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ${mockOrderData.subtotal.toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (19%):</span>
                  <span className="font-medium">
                    ${mockOrderData.tax.toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium">
                    {mockOrderData.shipping === 0
                      ? "Gratis"
                      : `$${mockOrderData.shipping.toLocaleString("es-CO")}`}
                  </span>
                </div>
                {mockOrderData.shipping === 0 && (
                  <p className="text-sm text-green-600">
                    ¡Envío gratis por compras superiores a $150.000!
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ${mockOrderData.total.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  className="w-full px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
                  style={{
                    backgroundColor: store?.primaryColor || "#2563eb",
                  }}
                >
                  Seguir mi Pedido
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Descargar Factura
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Seguir Comprando
                </button>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  ¿Necesitas ayuda?
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Contáctanos si tienes alguna pregunta sobre tu pedido.
                </p>
                <div className="text-sm">
                  <p className="text-gray-600">Email: soporte@tienda.com</p>
                  <p className="text-gray-600">Teléfono: +57 300 123 4567</p>
                  <p className="text-gray-600">Horario: Lun-Vie 9:00-18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ¿Qué sigue?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: store?.primaryColor || "#2563eb" }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Preparación</h3>
              <p className="text-sm text-gray-600">
                Preparamos cuidadosamente tu pedido en nuestro almacén
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: store?.primaryColor || "#2563eb" }}
              >
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Envío</h3>
              <p className="text-sm text-gray-600">
                Tu pedido será enviado y recibirás un código de seguimiento
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: store?.primaryColor || "#2563eb" }}
              >
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Entrega</h3>
              <p className="text-sm text-gray-600">
                Recibe tu pedido en la dirección que proporcionaste
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
