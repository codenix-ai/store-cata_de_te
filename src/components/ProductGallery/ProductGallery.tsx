'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ImageModal } from '@/components/ImageModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface ProductGalleryProps {
  images: Array<{ url: string }> | string[];
  productName: string;
  className?: string;
}

export function ProductGallery({ images, productName, className = '' }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Normalize image URLs
  const imageUrls = images.map(image => {
    const imageUrl = typeof image === 'string' ? image : image.url;
    return imageUrl.startsWith('http') ? imageUrl : `https://emprendyup-images.s3.us-east-1.amazonaws.com/${imageUrl}`;
  });

  const openModal = (index: number) => {
    setCurrentImage(index);
    setIsModalOpen(true);
  };

  const goToSlide = (index: number) => {
    setCurrentImage(index);
    // Also update the main swiper if it exists
    if (thumbsSwiper) {
      // Find the main swiper instance and slide to the index
      const mainSwiperElement = document.querySelector('.product-gallery .swiper');
      if (mainSwiperElement) {
        const mainSwiper = (mainSwiperElement as any).swiper;
        if (mainSwiper) {
          mainSwiper.slideTo(index);
        }
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Simplified and reliable zoom functionality
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return; // Only on desktop

    const container = e.currentTarget;
    const imageWrapper = container.querySelector('.zoom-image-wrapper') as HTMLElement;

    if (!imageWrapper) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Apply zoom with mouse position as transform origin
    imageWrapper.style.transformOrigin = `${x}% ${y}%`;
    imageWrapper.style.transform = 'scale(2.5)';
    imageWrapper.style.transition = 'transform 0.1s ease-out';
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('MouseEnter event fired!', e.currentTarget); // Debug log
    if (window.innerWidth < 768) {
      console.log('Mobile device - skipping zoom');
      return; // Only on desktop
    }

    const container = e.currentTarget;
    const imageWrapper = container.querySelector('.zoom-image-wrapper') as HTMLElement;

    console.log('Image wrapper found:', imageWrapper); // Debug log
    if (!imageWrapper) {
      console.log('No image wrapper found!');
      return;
    }

    console.log('Mouse entered - applying zoom'); // Debug log
    imageWrapper.style.transition = 'transform 0.2s ease-out';
    imageWrapper.style.transform = 'scale(2.5)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('MouseLeave event fired!', e.currentTarget); // Debug log
    const container = e.currentTarget;
    const imageWrapper = container.querySelector('.zoom-image-wrapper') as HTMLElement;

    console.log('Image wrapper found on leave:', imageWrapper); // Debug log
    if (!imageWrapper) {
      console.log('No image wrapper found on leave!');
      return;
    }

    console.log('Mouse left - removing zoom'); // Debug log
    imageWrapper.style.transformOrigin = 'center center';
    imageWrapper.style.transform = 'scale(1)';
    imageWrapper.style.transition = 'transform 0.3s ease-out';
  };
  return (
    <>
      <div className={`product-gallery ${className}`}>
        {/* Mobile and Desktop Main Gallery */}
        <div className="relative">
          {/* Main Image Swiper */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              spaceBetween={10}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              thumbs={{ swiper: thumbsSwiper }}
              onSlideChange={swiper => setCurrentImage(swiper.activeIndex)}
              className="h-full w-full"
            >
              {imageUrls.map((imageUrl, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="relative h-full w-full cursor-zoom-in group overflow-hidden"
                    onClick={() => openModal(index)}
                  >
                    <div
                      className="relative h-full w-full zoom-container"
                      onMouseMove={handleMouseMove}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onMouseOver={() => console.log('MouseOver detected!')}
                      onMouseOut={() => console.log('MouseOut detected!')}
                    >
                      <div className="zoom-image-wrapper w-full h-full">
                        <Image
                          src={imageUrl}
                          alt={`${productName} - Imagen ${index + 1}`}
                          fill
                          className="object-cover zoom-image"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
          </div>

          {/* Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="hidden md:block">
              <Swiper
                modules={[FreeMode, Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                className="product-gallery-thumbs"
                breakpoints={{
                  640: {
                    slidesPerView: 5,
                  },
                  768: {
                    slidesPerView: 6,
                  },
                }}
              >
                {imageUrls.map((imageUrl, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                        currentImage === index
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => goToSlide(index)}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${productName} - Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Mobile Thumbnail Strip */}
          {imageUrls.length > 1 && (
            <div className="block md:hidden mt-4">
              <Swiper
                modules={[FreeMode]}
                spaceBetween={8}
                slidesPerView={4}
                freeMode={true}
                className="mobile-thumbs"
                breakpoints={{
                  480: {
                    slidesPerView: 5,
                  },
                }}
              >
                {imageUrls.map((imageUrl, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                        currentImage === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                      }`}
                      onClick={() => goToSlide(index)}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${productName} - Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>

      {/* Use the enhanced ImageModal component */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={imageUrls}
        initialIndex={currentImage}
        productName={productName}
      />

      <style jsx global>{`
        .product-gallery-thumbs .swiper-slide {
          opacity: 0.6;
          transition: opacity 0.3s;
        }

        .product-gallery-thumbs .swiper-slide-thumb-active {
          opacity: 1;
        }

        .mobile-thumbs .swiper-slide {
          transition: all 0.3s;
        }

        .mobile-thumbs .swiper-slide:active {
          transform: scale(0.95);
        }

        /* Simplified zoom functionality that actually works */
        .zoom-container {
          overflow: hidden;
          position: relative;
          cursor: zoom-in;
        }

        .zoom-container:hover {
          cursor: zoom-out;
        }

        .zoom-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-origin: center center;
          transition: transform 0.3s ease-out;
          will-change: transform;
        }

        .zoom-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Prevent image dragging */
        .zoom-image img {
          user-select: none;
          -webkit-user-drag: none;
          pointer-events: none;
        }

        /* Mobile - simple tap zoom */
        @media (max-width: 767px) {
          .zoom-container:active .zoom-image-wrapper {
            transform: scale(1.3);
            transition: transform 0.2s ease-out;
          }
        }

        /* Debug styles - remove after testing */
        .zoom-container {
          border: 2px solid transparent;
        }

        .zoom-container:hover {
          border-color: rgba(59, 130, 246, 0.5);
        }

        /* CSS-only fallback hover zoom for testing */
        .zoom-container:hover .zoom-image-wrapper {
          transform: scale(1.5) !important;
          transition: transform 0.3s ease-out !important;
        }
      `}</style>
    </>
  );
}
