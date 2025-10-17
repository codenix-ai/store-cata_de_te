"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useStore } from "@/components/StoreProvider";

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "Supervisor de Planta",
    company: "Avianca",
    logo: "/assets/avianca.png",
    content:
      "Hemos trabajado con esta empresa por más de 2 años en el suministro de dotaciones para nuestras áreas de mantenimiento. Los buzos térmicos mantienen a nuestro equipo protegido durante las operaciones en hangares.",
    rating: 5,
  },
  {
    name: "Miguel Rodriguez",
    role: "Jefe de Producción",
    company: "Cream Helado",
    logo: "/assets/cream_helado.webp",
    content:
      "Llevamos trabajando con ellos desde hace 3 años para equipar a nuestro personal de cuartos fríos. Los guantes y gorros de lana son perfectos para nuestras operaciones de producción de helados.",
    rating: 5,
  },
  {
    name: "Juan Pablo",
    role: "Gerente de Operaciones",
    company: "Mac Pollo",
    logo: "/assets/mac_pollo.png",
    content:
      "Las dotaciones térmicas son fundamentales para mantener la cadena de frío y la seguridad de nuestros trabajadores.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const { store } = useStore();

  const getColorWithOpacity = (color: string, opacity: number) => {
    if (!color) return `rgba(37, 99, 235, ${opacity})`;
    return `${color}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`;
  };

  return (
    <section
      className="py-12 sm:py-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${getColorWithOpacity(
          store?.primaryColor || "#2563eb",
          0.05
        )} 0%, ${getColorWithOpacity(
          store?.accentColor || "#60a5fa",
          0.05
        )} 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-3 sm:mb-4 px-4">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            Más de 1,000 empresas confían en nosotros para sus dotaciones
            industriales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 italic leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {testimonial.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <Image
                    src={testimonial.logo}
                    alt={`Logo de ${testimonial.company}`}
                    width={50}
                    height={50}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
