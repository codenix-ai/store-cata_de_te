"use client";
import React from "react";
import Layout from "@/components/Layout/Layout";
import { useStore } from "@/components/StoreProvider";
import { Shield, FileText, Mail, Phone, Clock } from "lucide-react";

export default function PrivacyPage() {
  const { store } = useStore();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: store?.primaryColor }}
          >
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tu privacidad es importante para nosotros. Aquí explicamos cómo
            recopilamos, usamos y protegemos tu información.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Última actualización: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-10">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-4">
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
                <h2 className="text-2xl font-bold">
                  Información que recopilamos
                </h2>
                <p className="text-gray-700 mt-2">
                  Recopilamos información que tú nos proporcionas directamente
                  (nombre, email, dirección, teléfono) y datos de uso y
                  transacciones para proporcionar y mejorar nuestros servicios.
                </p>
              </div>
            </div>
            <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
              <li>
                Información de cuenta: nombre, correo electrónico, contraseña.
              </li>
              <li>
                Información de pago: datos necesarios para procesar
                transacciones (no almacenamos tarjetas completas en nuestros
                servidores).
              </li>
              <li>
                Datos de uso: acciones dentro del sitio, historial de navegación
                y compras.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-4">
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
                <h2 className="text-2xl font-bold">
                  Cómo usamos tu información
                </h2>
                <p className="text-gray-700 mt-2">
                  Usamos tu información para procesar pedidos, comunicar
                  actualizaciones, personalizar la experiencia y mejorar
                  nuestros productos y servicios.
                </p>
              </div>
            </div>
            <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
              <li>Procesar y entregar pedidos.</li>
              <li>
                Enviar comunicaciones importantes y promocionales (puedes
                cancelar la suscripción en cualquier momento).
              </li>
              <li>Detectar y prevenir fraude y abuso.</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{
                  backgroundColor: `${store?.primaryColor || "#2563eb"}15`,
                }}
              >
                <Mail
                  className="w-6 h-6"
                  style={{ color: store?.primaryColor || "#2563eb" }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Compartir y divulgar información
                </h2>
                <p className="text-gray-700 mt-2">
                  No vendemos tu información. Podemos compartir datos con
                  proveedores que nos ayudan a operar el sitio (logística,
                  pagos) y cuando la ley lo requiera.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-4">
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
                <h2 className="text-2xl font-bold">Conservación de datos</h2>
                <p className="text-gray-700 mt-2">
                  Conservamos tus datos mientras sea necesario para proporcionar
                  servicios y cumplir obligaciones legales. Puedes solicitar la
                  eliminación de tus datos salvo que exista una obligación legal
                  que lo impida.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start mb-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{
                  backgroundColor: `${store?.primaryColor || "#2563eb"}15`,
                }}
              >
                <Phone
                  className="w-6 h-6"
                  style={{ color: store?.primaryColor || "#2563eb" }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Tus derechos</h2>
                <p className="text-gray-700 mt-2">
                  Tienes derecho a acceder, rectificar y eliminar tus datos, así
                  como a solicitar portabilidad o limitar su procesamiento. Para
                  ejercer estos derechos contáctanos.
                </p>
              </div>
            </div>
            <p className="text-gray-700 mt-4">
              Para consultas sobre privacidad, escríbenos a
              soporte@emprendyup.com o utiliza el formulario de contacto en el
              Centro de Soporte.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>
              Esta política de privacidad se rige por las leyes de Colombia.
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
