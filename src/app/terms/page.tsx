"use client";
import React from "react";
import { useStore } from "@/components/StoreProvider";
import Layout from "@/components/Layout/Layout";
import {
  FileText,
  Shield,
  Truck,
  CreditCard,
  Users,
  AlertCircle,
  Scale,
  Phone,
} from "lucide-react";

export default function TermsPage() {
  const { store } = useStore();

  const sections = [
    {
      icon: FileText,
      title: "Introducción y Aceptación",
      id: "introduccion",
      content: [
        'Al acceder y utilizar EmprendyUp (el "Sitio"), usted acepta cumplir y estar sujeto a estos Términos y Condiciones de Uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro sitio.',
        "Estos términos se aplican a todos los usuarios del sitio, incluidos visitantes, usuarios registrados, vendedores y compradores.",
        "Nos reservamos el derecho de actualizar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio.",
      ],
    },
    {
      icon: Users,
      title: "Elegibilidad y Cuenta de Usuario",
      id: "elegibilidad",
      content: [
        "Debe tener al menos 18 años para crear una cuenta y realizar compras en nuestro sitio.",
        "Al crear una cuenta, se compromete a proporcionar información precisa y actualizada.",
        "Es responsable de mantener la confidencialidad de su cuenta y contraseña.",
        "Debe notificarnos inmediatamente cualquier uso no autorizado de su cuenta.",
        "Una persona o entidad puede tener solo una cuenta activa.",
      ],
    },
    {
      icon: CreditCard,
      title: "Compras y Pagos",
      id: "compras",
      content: [
        "Los precios mostrados en el sitio están en pesos colombianos (COP) e incluyen IVA cuando aplique.",
        "Aceptamos los siguientes métodos de pago: MercadoPago, Wompi, ePayco, tarjetas Visa/Mastercard, PSE y pago contraentrega (en zonas disponibles).",
        "El pago debe completarse antes del envío del producto, excepto en casos de pago contraentrega.",
        "Todas las transacciones están sujetas a verificación y aprobación.",
        "Los precios pueden cambiar sin previo aviso, pero se respetarán los precios confirmados en pedidos ya realizados.",
      ],
    },
    {
      icon: Truck,
      title: "Envíos y Entregas",
      id: "envios",
      content: [
        "Ofrecemos envíos a todo Colombia con tiempos de entrega variables según la ubicación.",
        "Envío gratuito en compras superiores a $150.000 COP. Costo de envío estándar: $15.000 COP.",
        "Los tiempos de entrega son estimados y pueden variar por condiciones climáticas o situaciones imprevistas.",
        "Es responsabilidad del comprador proporcionar una dirección de entrega precisa y accesible.",
        "El riesgo de pérdida o daño pasa al comprador una vez entregado el producto.",
      ],
    },
    {
      icon: Shield,
      title: "Privacidad y Protección de Datos",
      id: "privacidad",
      content: [
        "Recopilamos y procesamos sus datos personales de acuerdo con nuestra Política de Privacidad.",
        "Sus datos se utilizan únicamente para procesar pedidos, mejorar nuestros servicios y comunicarnos con usted.",
        "No vendemos ni compartimos su información personal con terceros sin su consentimiento, excepto cuando sea necesario para completar transacciones.",
        "Implementamos medidas de seguridad para proteger su información contra acceso no autorizado.",
        "Tiene derecho a acceder, corregir o eliminar sus datos personales contactándonos.",
      ],
    },
    {
      icon: AlertCircle,
      title: "Limitación de Responsabilidad",
      id: "responsabilidad",
      content: [
        "EmprendyUp no será responsable por daños indirectos, incidentales, especiales o consecuenciales.",
        "Nuestra responsabilidad máxima no excederá el monto total pagado por el producto específico.",
        "No garantizamos que el sitio esté libre de errores, virus o interrupciones.",
        'Los productos se venden "tal como están" sin garantías adicionales más allá de las legalmente requeridas.',
        "No somos responsables por el uso indebido de los productos adquiridos.",
      ],
    },
    {
      icon: FileText,
      title: "Propiedad Intelectual",
      id: "propiedad",
      content: [
        "Todo el contenido del sitio, incluyendo textos, imágenes, logos y diseños, está protegido por derechos de autor.",
        "No está permitido reproducir, distribuir o modificar nuestro contenido sin autorización escrita.",
        "Los nombres de productos y marcas pertenecen a sus respectivos propietarios.",
        "Respetamos los derechos de propiedad intelectual de terceros y esperamos lo mismo de nuestros usuarios.",
      ],
    },
  ];

  // quickLinks removed - navigation shortcuts intentionally omitted

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black font-montserrat mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Al utilizar EmprendyUp, aceptas estos términos y condiciones. Te
            recomendamos leerlos cuidadosamente para entender tus derechos y
            obligaciones.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Última actualización: 9 de septiembre de 2025
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <div
              key={index}
              id={section.id}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <div className="flex items-start mb-6">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                  style={{
                    backgroundColor: `${store?.primaryColor || "#2563eb"}15`,
                  }}
                >
                  <section.icon
                    className="w-6 h-6"
                    style={{ color: store?.primaryColor || "#2563eb" }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black font-montserrat">
                    {section.title}
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div
          className="mt-16 rounded-lg p-8"
          style={{
            backgroundColor: store?.primaryColor
              ? `${store.primaryColor}08`
              : "#f8fafc",
          }}
        >
          <div className="text-center">
            <Phone
              className="w-16 h-16 mx-auto mb-6"
              style={{ color: store?.primaryColor || "#2563eb" }}
            />
            <h2 className="text-2xl font-bold text-black font-montserrat mb-4">
              ¿Tienes preguntas sobre estos términos?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nuestro equipo de soporte está disponible para aclarar cualquier
              duda sobre nuestros términos y condiciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-6 py-3 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: store?.primaryColor || "#2563eb" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    store?.secondaryColor || "#1e293b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    store?.primaryColor || "#2563eb";
                }}
              >
                Contáctanos
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Centro de Ayuda
              </button>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>
              Estos términos y condiciones se rigen por las leyes de Colombia.
            </p>
            <p>
              EmprendyUp es una marca registrada. Todos los derechos reservados.
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
