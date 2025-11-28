"use client";
import Image from "next/image";
import React from "react";
import { useStore } from "../StoreProvider";
import { ArrowRight } from "lucide-react";

interface HeroBannerProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  leftWidthClass?: string;
  imageA?: string;
  buttonText?: string;
  buttonAction?: string;
  imageAlt?: string;
}

export function HeroBanner({
  title,
  subtitle,
  imageA = "/assets/bannercata.webp",
  buttonText = "Solicita tu cotización",
  buttonAction = "#contact-form",
  imageAlt = "Banner principal",
}: HeroBannerProps) {
  const { store } = useStore();

  const displayTitle = title || "Descubre el Mundo del Té Premium";
  const displaySubtitle =
    subtitle ||
    "Té de hebras e infusiones de la más alta calidad para verdaderos conocedores";

  const handleButtonClick = () => {
    if (buttonAction.startsWith("#")) {
      const element = document.getElementById(buttonAction.substring(1));
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else if (buttonAction.startsWith("/")) {
      window.location.href = buttonAction;
    }
  };

  return (
    <section className="relative py-12 px-6 md:px-12 lg:px-20 min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Fondo de imagen */}
      <div className="absolute inset-0">
        <Image
          src={imageA}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay oscuro para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${store?.primaryColor}80 0%, transparent 50%, ${store?.primaryColor}40 100%)`,
          }}
        ></div>
      </div>

      {/* Contenido centrado */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-2xl mb-6">
          {displayTitle}
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl text-gray-100 drop-shadow-lg mb-8 max-w-2xl mx-auto">
          {displaySubtitle}
        </p>

        <button
          onClick={handleButtonClick}
          className="group inline-flex items-center justify-center text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl mx-auto"
          style={{
            backgroundColor: store?.primaryColor || "#2563eb",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              store?.secondaryColor || "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              store?.primaryColor || "#2563eb";
          }}
        >
          {buttonText}
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}

export default HeroBanner;
