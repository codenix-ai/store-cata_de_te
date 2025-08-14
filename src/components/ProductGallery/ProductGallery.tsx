"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: Array<{ url: string }> | string[];
  productName: string;
  className?: string;
}

export function ProductGallery({
  images,
  productName,
  className = "",
}: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [highResSrc, setHighResSrc] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Normalizamos URLs
  const imageUrls = images.map((image) => {
    const imageUrl = typeof image === "string" ? image : image.url;
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://emprendyup-images.s3.us-east-1.amazonaws.com/${imageUrl}`;
  });

  const goToImage = (index: number) => {
    setCurrentImage(index);
    loadHighRes(index);
  };

  const loadHighRes = (index: number) => {
    const url = imageUrls[index];
    const hdUrl = url;
    setHighResSrc(hdUrl);
  };

  const nextImage = () => {
    const newIndex = (currentImage + 1) % imageUrls.length;
    goToImage(newIndex);
  };

  const prevImage = () => {
    const newIndex = (currentImage - 1 + imageUrls.length) % imageUrls.length;
    goToImage(newIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !highResSrc) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      loadHighRes(currentImage);
      setIsZoomActive(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsZoomActive(false);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
        {/* Miniaturas */}
        {imageUrls.length > 1 && (
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:w-24 md:h-[500px]">
            {imageUrls.slice(0, 10).map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  currentImage === index
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={`${productName} - Miniatura ${index + 1}`}
                  fill
                  className="object-contain bg-white"
                />
              </button>
            ))}
            {imageUrls.length > 10 && (
              <div className="relative aspect-square rounded-md overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  +{imageUrls.length - 10}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Imagen principal */}
        <div
          ref={containerRef}
          className={`relative flex-1 aspect-square bg-gray-100 rounded-lg overflow-hidden group ${
            isMobile
              ? "cursor-zoom-in"
              : isZoomActive
              ? "cursor-zoom-out"
              : "cursor-zoom-in"
          }`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (isMobile) {
              setIsModalOpen(true);
              loadHighRes(currentImage);
            }
          }}
        >
          {/* Imagen base */}
          <Image
            src={imageUrls[currentImage]}
            alt={`${productName} - Imagen ${currentImage + 1}`}
            fill
            className="object-contain bg-white transition-opacity duration-200"
            priority
          />

          {/* Zoom */}
          {isZoomActive && highResSrc && (
            <div
              className="absolute inset-0 bg-no-repeat bg-contain"
              style={{
                backgroundImage: `url(${highResSrc})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "200%",
              }}
            />
          )}

          {/* Flechas abajo a la derecha */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={prevImage}
                className="bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-md"
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </button>
              <button
                onClick={nextImage}
                className="bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-md"
              >
                <ChevronRight className="w-5 h-5 text-black" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 text-2xl"
          >
            ✕
          </button>
          {highResSrc ? (
            <Image
              src={highResSrc}
              alt={`${productName} - Imagen ampliada`}
              width={1000}
              height={1000}
              className="object-contain max-w-full max-h-full"
            />
          ) : (
            <Image
              src={imageUrls[currentImage]}
              alt={`${productName} - Imagen ampliada`}
              width={1000}
              height={1000}
              className="object-contain max-w-full max-h-full"
            />
          )}
        </div>
      )}
    </>
  );
}
