'use client';

import Image from 'next/image';
import React from 'react';

interface HeroBannerProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  leftWidthClass?: string; // allow small layout tweaks
  imageA?: string;
  imageB?: string;
}

export function HeroBanner({
  title = (
    <>
      Deja que tu estilo
      <br />
      hable por ti
    </>
  ),
  subtitle = (
    <>
      Mira nuestra nueva <br />
      coleccion.
    </>
  ),
  leftWidthClass = 'w-full md:w-7/12',
  imageA = '/assets/man.webp',
  imageB = '/assets/man.webp',
}: HeroBannerProps) {
  return (
    <section className="py-16 md:py-20 px-6 md:px-12 lg:px-20 min-h-[70vh] md:min-h-[80vh] flex items-center bg-gradient-to-r from-[#C2B1A5] via-[#E9DCCF] to-[#F7F5F3]">
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center gap-10 w-full">
        <div className={`${leftWidthClass} text-left`}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight md:leading-snug font-thin font-serif text-gray-800 tracking-tight">
            {title}
          </h1>

          <p className="mt-6 max-w-xl text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">{subtitle}</p>
        </div>

        <div className="w-full md:w-[50%] flex justify-center md:justify-end">
          <div className="w-full flex flex-col sm:flex-row items-center md:items-start gap-4 sm:gap-6">
            <div className="rounded-3xl overflow-hidden shadow-lg w-full sm:w-56 md:w-72 aspect-[3/4] bg-gray-100 relative">
              <Image src={imageA} alt="banner" fill className="object-cover" />
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl w-full sm:w-64 md:w-80 aspect-[3/4] bg-gray-100 relative">
              <Image src={imageB} alt="hero image" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
