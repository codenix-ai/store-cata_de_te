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
}

export function HeroBanner({
  title = (
    <>
      Dotaciones que inspiran confianza, <br /> confecciones que marcan
      diferencia
      <br />
    </>
  ),
  subtitle = (
    <>
      En Pawis diseñamos y fabricamos <br />
      uniformes y dotaciones con la mejor calidad,
      <br /> comodidad y estilo, para que tu equipo <br />
      siempre luzca profesional.
      <br />
    </>
  ),
  leftWidthClass = "w-full md:w-7/12",
  imageA = "/assets/banner.png",
}: HeroBannerProps) {
  const { store } = useStore();

  // Título personalizado con palabras destacadas
  const customTitle = (
    <>
      Dotaciones que inspiran{" "}
      <span style={{ color: store?.secondaryColor }}>confianza</span>, <br />{" "}
      <span style={{ color: store?.secondaryColor }}>confecciones</span> que
      marcan diferencia
      <br />
    </>
  );

  // Subtítulo personalizado con Pawis destacado
  const customSubtitle = (
    <>
      En <span style={{ color: store?.secondaryColor }}>Pawis</span> diseñamos y
      fabricamos <br />
      uniformes y dotaciones con la mejor calidad,
      <br /> comodidad y estilo, para que tu equipo <br />
      siempre luzca profesional.
      <br />
    </>
  );

  const scrollToContactForm = () => {
    const contactSection = document.getElementById("contact-form");
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative py-12 px-6 md:px-12 lg:px-20 min-h-[70vh] flex flex-col md:flex-row items-center overflow-hidden">
      {/* Fondo de imagen solo en móvil */}
      <div className="absolute inset-0 min-h-[30vh] md:hidden">
        <Image
          src={imageA}
          alt="Trabajador industrial con dotaciones de seguridad"
          fill
          className="object-cover"
          priority
        />
        {/* Highlight/overlay para móvil */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(135deg, ${store?.primaryColor}80 0%, transparent 50%, ${store?.primaryColor}40 100%)`,
          }}
        ></div>
      </div>

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
                {customTitle}
              </span>
              <span className="md:hidden">{customTitle}</span>
            </h1>
            <p className="mt-4 text-md lg:text-xl font-bold tracking-tight drop-shadow-2xl md:drop-shadow-none">
              <span className="inline text-gray-300">{customSubtitle}</span>
            </p>
          </div>

          <button
            onClick={scrollToContactForm}
            className="group hover:bg-[#1E1B4B]/80 text-white font-bold py-3 px-6 rounded-2xl flex items-center transition-all duration-300 transform hover:scale-105"
            style={{
              background: store?.backgroundColor,
              color: store?.primaryColor,
              opacity: 1,
              filter: "saturate(1.2) brightness(1.1)",
            }}
          >
            Solicita tu cotización
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="w-full md:w-1/2 justify-center md:justify-end hidden md:flex">
          <div className=" gap-2 w-full max-w-lg">
            <div className="relative overflow-hidden aspect-[3/4]">
              <Image
                src={imageA}
                alt="Dotaciones industriales izquierda"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
