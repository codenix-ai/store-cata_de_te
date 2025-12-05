"use client";
import Image from "next/image";
import React from "react";
import { useStore } from "../StoreProvider";
import { ArrowRight } from "lucide-react";
// resolveImageUrl not needed here because banner uses local asset

interface HeroBannerProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  imageE?: string;
  buttonText?: string;
  buttonAction?: string;
  imageAlt?: string;
}

export function HeroBanner({
  title,
  subtitle,
  buttonText = "Solicita tu cotización",
  buttonAction = "#contact-form",
  imageAlt = "Banner principal",
}: HeroBannerProps) {
  const { store } = useStore();

  const displayTitle = title || "Descubre el Mundo del Té y las Infusiones";
  const displaySubtitle =
    subtitle ||
    "Tés de hebras, blends exclusivos e infusiones naturales para cada momento";

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
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/bannercata.webp"
          alt={imageAlt}
          fill
          className="object-cover w-full h-full"
          priority
        />
        {/* Dark overlay to improve text contrast */}
        <div className="absolute inset-0 bg-black/60"></div>
        {/* Accent gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${store?.primaryColor}40 0%, transparent 40%, ${store?.primaryColor}20 100%)`,
          }}
        />
      </div>

      {/* Centered content */}
      <div className="relative z-10 max-w-5xl w-full px-6 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4">
          {displayTitle}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl">
          {displaySubtitle}
        </p>

        <div>
          <button
            onClick={handleButtonClick}
            className="inline-flex items-center justify-center bg-white text-black font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
            style={{
              backgroundColor: store?.primaryColor || undefined,
              color: store?.textColor || "white",
            }}
          >
            {buttonText}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
