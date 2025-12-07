"use client";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import { useStore } from "../StoreProvider";
import { SiteHeroSlide } from "@/types/siteConfig";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface HeroSliderProps {
  slides: SiteHeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const { store } = useStore();

  const handleButtonClick = (action?: string) => {
    if (!action) return;
    
    if (action.startsWith("#")) {
      const element = document.getElementById(action.substring(1));
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else if (action.startsWith("/")) {
      window.location.href = action;
    }
  };

  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        loop={true}
        className="h-[70vh] hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Full-bleed background image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.backgroundImage.id}
                  alt={slide.backgroundImage.alt}
                  fill
                  className="object-cover w-full h-full"
                  priority={index === 0}
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
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl">
                    {slide.subtitle}
                  </p>
                )}

                {slide.buttons && slide.buttons.length > 0 && (
                  <div className="flex gap-4 flex-wrap justify-center">
                    {slide.buttons.map((button, btnIndex) => (
                      <button
                        key={btnIndex}
                        onClick={() => handleButtonClick(button.action)}
                        className="inline-flex items-center justify-center bg-white text-black font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
                        style={{
                          backgroundColor:
                            button.variant === "primary"
                              ? store?.primaryColor || undefined
                              : button.variant === "outline"
                              ? "transparent"
                              : store?.secondaryColor || undefined,
                          color:
                            button.variant === "primary"
                              ? store?.textColor || "white"
                              : button.variant === "outline"
                              ? "white"
                              : store?.textColor || "white",
                          border:
                            button.variant === "outline"
                              ? "2px solid white"
                              : "none",
                        }}
                      >
                        {button.text}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after {
          font-size: 20px;
        }
        .hero-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: ${store?.primaryColor || "white"};
        }
      `}</style>
    </section>
  );
}

export default HeroSlider;
