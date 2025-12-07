'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Heart, Wifi, Wind, Droplets, Play } from 'lucide-react';
import { Hotel } from '@/lib/types';
import { getLocalizedText } from '@/lib/localization';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  loading: () => <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"><p className="text-white">Video Oynatıcı Yükleniyor...</p></div>
});

interface HotelCardProps {
  hotel: Hotel;
  priority?: boolean;
}

const amenityIcons: Record<string, JSX.Element> = {
  Havuz: <Wind size={16} />,
  WiFi: <Wifi size={16} />,
  Spa: <Droplets size={16} />,
};

export default function HotelCard({ hotel, priority = false }: HotelCardProps) {
  const router = useRouter();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const formattedPrice = new Intl.NumberFormat('tr-TR').format(hotel.price);
  const featuredAmenities = hotel.amenities?.slice(0, 3) || [];

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoOpen(true);
  };

  return (
    <div className="relative group mb-32">
      <Link href={`/otel/${hotel.id}`} className="block">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">

          {/* FOTOĞRAF ALANI */}
          <div className="relative">
            {hotel.video_url ? (
              <div className="relative w-full aspect-[3/4]">
                {hotel.video_thumbnail_url ? (
                  <Image
                    src={hotel.video_thumbnail_url}
                    alt={getLocalizedText(hotel.name)}
                    fill
                    sizes={priority ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={priority}
                    loading={priority ? undefined : "lazy"}
                    quality={75}
                    {...(priority ? { fetchPriority: "high" } : {})}
                  />
                ) : hotel.coverImageUrl ? (
                  <Image
                    src={hotel.coverImageUrl}
                    alt={getLocalizedText(hotel.name)}
                    fill
                    sizes={priority ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={priority}
                    loading={priority ? undefined : "lazy"}
                    quality={75}
                    {...(priority ? { fetchPriority: "high" } : {})}
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">Video Kapak</span>
                  </div>
                )}
                <div
                  onClick={handleVideoClick}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
            ) : hotel.coverImageUrl ? (
              <Image
                src={hotel.coverImageUrl}
                alt={getLocalizedText(hotel.name)}
                width={400}
                height={533}
                sizes={priority ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                priority={priority}
                loading={priority ? undefined : "lazy"}
                quality={75}
                {...(priority ? { fetchPriority: "high" } : {})}
              />
            ) : (
              <div className="w-full aspect-[3/4] flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">Resim Yok</span>
              </div>
            )}

            {/* Alttan Yukarı Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Favori Butonu (Sol Üst) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:text-red-500 transition-colors"
            >
              <Heart size={20} />
            </button>

            {/* Puan (Sağ Üst) */}
            {hotel.gnkScore > 0 && (
              <div className="absolute top-3 right-3 flex items-center bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
                <Star size={14} className="mr-1.5 fill-white" />
                <span>{hotel.gnkScore.toFixed(1)}/10</span>
              </div>
            )}

            {/* Fiyat (Sol Alt) */}
            {hotel.price > 0 && (
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-2xl font-bold">{formattedPrice} TL</span>
                <span className="text-sm"> / Gece</span>
              </div>
            )}
          </div>

          {/* KARTIN ALT BİLGİ ALANI (2 SATIR) */}
          <div className="p-4 space-y-3">
            {/* 1. Satır: İsim ve Konum */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 truncate">{getLocalizedText(hotel.name)}</h3>
              <p className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                <span className="truncate">{getLocalizedText(hotel.location)}</span>
              </p>
            </div>

            {/* 2. Satır: Öne Çıkan Olanaklar */}
            {featuredAmenities.length > 0 && (
              <div className="flex items-center space-x-4 text-gray-600">
                {featuredAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center text-xs">
                    {amenityIcons[amenity] || null}
                    <span className="ml-1.5">{amenity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* --- BAĞIMSIZ YUVARLAK BUTON (KARTIN DIŞINDA) --- */}
      <div className="absolute -bottom-28 left-1/2 transform -translate-x-1/2 z-30">
        <Link
          href={`/otel/${hotel.id}#yeme-icme-rehberi`}
          className="flex flex-col items-center justify-center w-24 h-24 bg-white shadow-[0_15px_30px_rgba(0,0,0,0.2)] rounded-full border border-gray-100 hover:scale-110 hover:shadow-orange-500/40 transition-all duration-300 ease-out cursor-pointer"
        >
          {/* Üst Kısım: Şehir */}
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            {getLocalizedText(hotel.location).split(',')[0].trim()}&apos;DE
          </span>
          {/* Orta Kısım: NE YENİR */}
          <span className="text-sm font-black text-gray-800 leading-none text-center">
            NE<br />YENİR?
          </span>
          {/* Alt Kısım: İkon */}
          <span className="text-xs mt-1 text-orange-500">🍽️</span>
        </Link>
      </div>

      {hotel.video_url && (
        <VideoPlayer
          videoUrl={hotel.video_url}
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
        />
      )}
    </div>
  );
}