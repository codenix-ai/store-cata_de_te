"use client";
import React from "react";
import { useStore } from "@/components/StoreProvider";
import Layout from "@/components/Layout/Layout";
import {
  Truck,
  RefreshCcw,
  Clock,
  AlertCircle,
  Shield,
  FileText,
} from "lucide-react";

export default function ReturnsPolicyPage() {
  const { store } = useStore();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold text-black font-montserrat mb-4"
            style={{ color: store?.primaryColor }}
          >
            Política de Devoluciones y Cambios
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce nuestro proceso de devoluciones, tiempos y condiciones para
            garantizar una experiencia clara y segura.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Última actualización: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-10">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-6">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{
                  backgroundColor: `${store?.primaryColor || "#2563eb"}15`,
                }}
              >
                <Truck
                  className="w-6 h-6"
                  style={{ color: store?.primaryColor || "#2563eb" }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black font-montserrat">
                  Plazo para Devoluciones
                </h2>
                <p className="text-gray-700 mt-2">
                  Aceptamos solicitudes de devolución dentro de los 30 días
                  calendario posteriores a la entrega del producto, salvo que se
                  indique lo contrario en la ficha del producto.
                </p>
              </div>
            </div>
            <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
              <li>
                Productos en perfecto estado, sin uso y con su empaque original.
              </li>
              <li>
                Productos personalizados, perecederos o de higiene no son
                reembolsables salvo defecto de fabricación.
              </li>
              <li>
                El cliente debe conservar la factura o comprobante de compra.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-6">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{
                  backgroundColor: `${store?.primaryColor || "#2563eb"}15`,
                }}
              >
                <RefreshCcw
                  className="w-6 h-6"
                  style={{ color: store?.primaryColor || "#2563eb" }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black font-montserrat">
                  Proceso de Devolución
                </h2>
                <p className="text-gray-700 mt-2">
                  Para iniciar una devolución, contáctanos a través de nuestro
                  formulario de soporte o correo y facilita la siguiente
                  información:
                </p>
              </div>
            </div>
            <ol className="list-decimal list-inside mt-4 text-gray-700 space-y-2">
              <li>Número de pedido y fecha de compra.</li>
              <li>
                Motivo de la devolución y descripción del estado del producto.
              </li>
              <li>
                Fotografías del producto si aplica (ej. defecto, daño en
                transporte).
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-6">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{
                  backgroundColor: `${store?.primaryColor || "#2563eb"}15`,
                }}
              >
                <Clock
                  className="w-6 h-6"
                  style={{ color: store?.primaryColor || "#2563eb" }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black font-montserrat">
                  Tiempos de Procesamiento
                </h2>
                <p className="text-gray-700 mt-2">
                  Una vez recibida la devolución y verificado su estado,
                  procesaremos el reembolso en un plazo de 5-10 días hábiles.
                </p>
              </div>
            </div>
            <p className="text-gray-700 mt-4">
              El reembolso podrá realizarse al mismo medio de pago utilizado en
              la compra. En caso de pagos con tarjeta, el tiempo de acreditación
              puede variar según el emisor.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-6">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{
                  backgroundColor: `${store?.primaryColor || "#2563eb"}15`,
                }}
              >
                <AlertCircle
                  className="w-6 h-6"
                  style={{ color: store?.primaryColor || "#2563eb" }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black font-montserrat">
                  Productos No Elegibles
                </h2>
                <p className="text-gray-700 mt-2">
                  No se aceptan devoluciones en los siguientes casos:
                </p>
              </div>
            </div>
            <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
              <li>Productos con señales de uso o daños por mal uso.</li>
              <li>
                Productos personalizados a medida salvo defecto de fabricación.
              </li>
              <li>
                Productos cuyo embalaje original haya sido alterado o perdido.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-6">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{
                  backgroundColor: `${store?.primaryColor || "#2563eb"}15`,
                }}
              >
                <Shield
                  className="w-6 h-6"
                  style={{ color: store?.primaryColor || "#2563eb" }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black font-montserrat">
                  Costos de Envío en Devoluciones
                </h2>
                <p className="text-gray-700 mt-2">
                  Los gastos de envío para devoluciones correrán por cuenta del
                  cliente, excepto en caso de productos defectuosos o errores
                  por parte de la tienda, en cuyo caso asumiremos el costo.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-6">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{
                  backgroundColor: `${store?.primaryColor || "#2563eb"}15`,
                }}
              >
                <FileText
                  className="w-6 h-6"
                  style={{ color: store?.primaryColor || "#2563eb" }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black font-montserrat">
                  Contacto y Soporte
                </h2>
                <p className="text-gray-700 mt-2">
                  Para iniciar una devolución o solicitar soporte, por favor
                  contáctanos a través de nuestro formulario en el Centro de
                  Soporte o al correo soporte@emprendyup.com.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>
              Estos términos de devolución se rigen por las leyes de Colombia.
            </p>
            <p>
              Para disputas legales, la jurisdicción competente serán los
              tribunales de Bogotá, Colombia.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
