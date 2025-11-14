'use client';

import { ExternalLink } from 'lucide-react';

type MobileHotelInfoProps = {
  hotelName: string;
  price: number;
  rating: number;
  location: string;
  googleMapsUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
};

export function MobileHotelInfo({
  hotelName,
  price,
  rating,
  location,
  googleMapsUrl,
  websiteUrl,
  instagramUrl,
}: MobileHotelInfoProps) {
  const locationCity = location.split(',')[0].trim();

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 mx-5 mt-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight text-center">
        {hotelName}
      </h1>

      <div className="flex items-center justify-center gap-0 mb-4">
        <div className="flex flex-col items-center justify-center bg-white rounded-xl p-3 h-[90px] min-w-[100px]">
          <p className="text-xs font-medium text-gray-600 mb-1.5">Konum</p>
          <p className="text-base font-bold text-gray-900 text-center leading-tight">
            {locationCity}
          </p>
        </div>

        <div className="h-12 w-[1px] bg-gray-200 mx-1"></div>

        <div className="flex flex-col items-center justify-center bg-white rounded-xl p-3 h-[90px] min-w-[100px]">
          <p className="text-xs font-medium text-gray-600 mb-1.5">GNK Skor</p>
          <p className="text-base font-bold text-gray-900">{rating} / 5</p>
        </div>

        <div className="h-12 w-[1px] bg-gray-200 mx-1"></div>

        <div className="flex flex-col items-center justify-center bg-white rounded-xl p-3 h-[90px] min-w-[100px]">
          <p className="text-xs font-medium text-gray-600 mb-1.5">Fiyat</p>
          <p className="text-base font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
        </div>
      </div>

      <div className="space-y-2">
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-[52px] bg-white border border-gray-300 hover:border-gray-400 active:bg-gray-50 text-gray-600 font-semibold rounded-xl transition-all text-[16px]"
          >
            <ExternalLink className="w-5 h-5 mr-2 text-gray-600" strokeWidth={2} />
            Otele Git
          </a>
        )}

        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-[52px] bg-white border border-gray-300 hover:border-gray-400 active:bg-gray-50 text-gray-600 font-semibold rounded-xl transition-all text-[16px]"
          >
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
        )}
      </div>
    </div>
  );
}
