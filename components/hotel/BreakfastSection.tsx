'use client';

import { useState } from 'react';
import { Coffee } from 'lucide-react';
import Image from 'next/image';
import { LocalizedString } from '@/lib/types';
import { getLocalizedText } from '@/lib/localization';

interface BreakfastSectionProps {
  description: LocalizedString | string;
  images: string[];
}

export function BreakfastSection({ description, images }: BreakfastSectionProps) {
  const descriptionText = getLocalizedText(description);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!description && (!images || images.length === 0)) {
    return null;
  }

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && images) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && images) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="bg-amber-500 rounded-full p-2 sm:p-2.5 flex-shrink-0">
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Kahvaltımız</h2>

          {images && images.length > 0 && (
            <div className="flex gap-1.5 sm:gap-2 ml-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 flex-shrink-0"
                >
                  <Image
                    src={image}
                    alt={`Kahvaltı ${index + 1}`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {descriptionText && (
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {descriptionText}
          </p>
        )}
      </div>

      {selectedImageIndex !== null && images && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 hover:bg-black/70"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 hover:bg-black/70"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative max-w-7xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImageIndex]}
              alt={`Kahvaltı ${selectedImageIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
