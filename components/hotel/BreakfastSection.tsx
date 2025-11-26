'use client';

import { Coffee } from 'lucide-react';

interface BreakfastSectionProps {
  description: string;
  images: string[];
}

export function BreakfastSection({ description, images }: BreakfastSectionProps) {
  if (!description && (!images || images.length === 0)) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
        <div className="bg-amber-500 rounded-full p-2 sm:p-2.5">
          <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Kahvaltımız</h2>
      </div>

      {description && (
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
          {description}
        </p>
      )}

      {images && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md"
            >
              <img
                src={image}
                alt={`Kahvaltı ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
