"use client";
import Image from "next/image";
import React from "react";
import { useStore } from "../StoreProvider";
import { ArrowRight } from "lucide-react";
<<<<<<< HEAD
=======
import { resolveImageUrl } from "@/lib/image";
>>>>>>> upstream/main

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
<<<<<<< HEAD
  imageA = "/assets/bannercata.webp",
=======
  leftWidthClass = "w-full md:w-7/12",
  imageA = "/assets/banner.png",
>>>>>>> upstream/main
  buttonText = "Solicita tu cotización",
  buttonAction = "#contact-form",
  imageAlt = "Banner principal",
}: HeroBannerProps) {
  const { store } = useStore();

<<<<<<< HEAD
  const displayTitle = title || "Descubre el Mundo del Té Premium";
  const displaySubtitle =
    subtitle ||
    "Té de hebras e infusiones de la más alta calidad para verdaderos conocedores";
=======
  const displayTitle = title;
  const displaySubtitle = subtitle;
  const resolvedImage = resolveImageUrl(imageA);
>>>>>>> upstream/main

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
<<<<<<< HEAD
    <section className="relative py-12 px-6 md:px-12 lg:px-20 min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Fondo de imagen */}
      <div className="absolute inset-0">
        <Image
          src={imageA}
=======
    <section className="relative py-12 px-6 md:px-12 lg:px-20 min-h-[70vh] flex flex-col md:flex-row items-center overflow-hidden">
      {/* Fondo de imagen solo en móvil */}
      <div className="absolute inset-0 min-h-[30vh] md:hidden">
        <Image
          src={resolvedImage}
>>>>>>> upstream/main
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
<<<<<<< HEAD
        {/* Overlay oscuro para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div
          className="absolute inset-0 opacity-30"
=======
        {/* Highlight/overlay para móvil */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div
          className="absolute inset-0 opacity-40"
>>>>>>> upstream/main
          style={{
            background: `linear-gradient(135deg, ${store?.primaryColor}80 0%, transparent 50%, ${store?.primaryColor}40 100%)`,
          }}
        ></div>
      </div>
<<<<<<< HEAD

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
=======
      {/* Fondo de color para desktop */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background: `linear-gradient(135deg, ${store?.primaryColor} 0%, ${store?.primaryColor}E6 80%)`,
        }}
      ></div>
      <div className="relative max-w-8xl mx-auto flex flex-col md:flex-row items-center w-full z-10">
        {/* Texto */}
        <div className={`${leftWidthClass} text-left`}>
          <div className="relative inline-block mb-8">
            <h1 className="mt-4 text-4xl md:text-6xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-2xl md:drop-shadow-none">
              <span
                className="hidden md:inline"
                style={{ color: store?.textColor }}
              >
                {displayTitle}
              </span>
              <span className="md:hidden">{displayTitle}</span>
            </h1>
            <p className="mt-4 text-md lg:text-xl font-bold tracking-tight drop-shadow-2xl md:drop-shadow-none">
              <span className="inline text-gray-300">{displaySubtitle}</span>
            </p>
          </div>

          <button
            onClick={handleButtonClick}
            className="group hover:bg-[#1E1B4B]/80 text-white font-bold py-3 px-6 rounded-2xl flex items-center transition-all duration-300 transform hover:scale-105"
            style={{
              background: store?.backgroundColor,
              color: store?.primaryColor,
              opacity: 1,
              filter: "saturate(1.2) brightness(1.1)",
            }}
          >
            {buttonText}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="w-full md:w-1/2 justify-center md:justify-end hidden md:flex">
          <div className=" gap-2 w-full max-w-lg">
            <div className="relative overflow-hidden aspect-[3/4]">
              <Image
                src={resolvedImage}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
>>>>>>> upstream/main
      </div>
    </section>
  );
}

export default HeroBanner;
