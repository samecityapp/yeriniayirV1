'use client';

import { useState } from 'react';
import { ImageGallery } from '@/components/ImageGallery';
import { Coffee } from 'lucide-react';

interface BreakfastSectionProps {
  description: string;
  images: string[];
}

export function BreakfastSection({ description, images }: BreakfastSectionProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (!description && (!images || images.length === 0)) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-amber-500 rounded-full p-2 sm:p-2.5">
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Kahvaltımız</h2>
            </div>
            {description && (
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {description}
              </p>
            )}
          </div>

          {images && images.length > 0 && (
            <div className="flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="group relative w-full sm:w-auto"
              >
                <div className="flex gap-2 justify-center sm:justify-start">
                  {images.slice(0, 3).map((image, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <img
                        src={image}
                        alt={`Kahvaltı ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 2 && images.length > 3 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs sm:text-sm">
                            +{images.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-1 sm:-right-1 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Göster
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {isGalleryOpen && images && images.length > 0 && (
        <div className="fixed inset-0 z-[9999]">
          <ImageGallery
            images={images}
            videoUrl={null}
            videoThumbnailUrl={null}
            onClose={() => setIsGalleryOpen(false)}
          />
        </div>
      )}
    </>
  );
}
