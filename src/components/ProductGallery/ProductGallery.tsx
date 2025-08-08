"use client";

import { useState } from "react";
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

  // Convert images to URLs with S3 domain
  const imageUrls = images.map((image) => {
    const imageUrl = typeof image === "string" ? image : image.url;
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://emprendyup-images.s3.us-east-1.amazonaws.com/${imageUrl}`;
  });

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const goToImage = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Main Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-zoom-in">
          <Image
            src={imageUrls[currentImage]}
            alt={`${productName} - Imagen ${currentImage + 1}`}
            fill
            className="object-cover"
            onClick={() => setIsModalOpen(true)}
          />

          {/* Navigation Arrows */}
          {imageUrls.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-black" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentImage + 1} / {imageUrls.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {imageUrls.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-2">
            {imageUrls.slice(0, 10).map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  currentImage === index
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={`${productName} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}

            {/* Show More Indicator */}
            {imageUrls.length > 10 && (
              <div className="relative aspect-square rounded-md overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  +{imageUrls.length - 10}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={imageUrls[currentImage]}
                alt={`${productName} - Imagen ${currentImage + 1}`}
                width={800}
                height={800}
                className="object-contain max-w-full max-h-full"
              />
            </div>

            {/* Navigation */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-black transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-black transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              {currentImage + 1} / {imageUrls.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto">
              {imageUrls.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                    currentImage === index
                      ? "border-white ring-2 ring-white ring-opacity-50"
                      : "border-white border-opacity-50 hover:border-opacity-100"
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={`${productName} - Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
