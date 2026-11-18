'use client';

import React from 'react';
import {VenueImage} from '@/components/food/VenueImage';
import type { VisitorFoodVenue } from '@/lib/food/types';
import { GooglePlaceRating } from '@/components/food/GooglePlaceRating';
import { getLocalizedText } from '@/lib/localization';
import { MapPin, Star, Utensils, ChevronRight, Info, ExternalLink, Sparkles } from 'lucide-react';

interface PremiumRestaurantCardProps {
  restaurant: VisitorFoodVenue;
  onViewDetails: () => void;
  lang?: 'tr' | 'en';
  priority?: boolean;
}

export function PremiumRestaurantCard({
  restaurant,
  onViewDetails,
  lang = 'tr',
  priority = false,
}: PremiumRestaurantCardProps) {
  const firstTip = restaurant.knowBeforeYouGo?.tips?.[0];
  const firstAlsoTry = restaurant.alsoTry?.items?.[0];
  const mapsUrl = restaurant.ratings?.[0]?.attribution?.mapsUri ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getLocalizedText(restaurant.name, lang) + ' ' + (restaurant.address || restaurant.neighborhood || getLocalizedText(restaurant.location, lang)))}`;

  return (
    <article data-venue-id={restaurant.id}
      onClick={onViewDetails}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails();
        }
      }}
      className="group relative w-full bg-white rounded-3xl border border-[#EFE5DF] shadow-[0_6px_24px_-6px_rgba(196,43,28,0.12)] hover:shadow-[0_14px_34px_-6px_rgba(196,43,28,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C42B1C] active:scale-[0.99] transition-all duration-200 overflow-hidden cursor-pointer flex flex-col select-none touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* 1. MEKAN FOTOĞRAFI (Geniş, oranlı, sade) */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#f5f2ec]">
        <VenueImage visual={{url:restaurant.imageUrl,kind:restaurant.imageIsRepresentative?'illustration':'rights-cleared-photo',category:restaurant.imageCategory,venueId:restaurant.id,attribution:restaurant.imageAttribution}} priority={priority} className="group-hover:scale-105 transition-transform duration-500 ease-out" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />

        {restaurant.scope === 'nearby' && restaurant.nearbyAreaLabel && (
          <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full bg-[#181210]/85 backdrop-blur-md text-white text-[10px] font-extrabold tracking-wide flex items-center gap-1 shadow-xs border border-white/15">
            <MapPin size={10} className="text-amber-300 flex-shrink-0" />
            <span>
              Yakın Öneri · {restaurant.nearbyAreaLabel.split(',')[0]}
              {typeof restaurant.distanceMeters === 'number'
                ? ` (${restaurant.distanceMeters} m)`
                : typeof restaurant.distanceKm === 'number'
                ? ` (${restaurant.distanceKm.toFixed(1)} km)`
                : ''}
            </span>
          </div>
        )}

        {/* Mobil dokunma ipucu */}
        <div className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-[#C42B1C] group-hover:bg-[#A61E11] text-white flex items-center justify-center shadow-xs transition-colors duration-200">
          <ChevronRight size={16} />
        </div>
      </div>

      {/* #11 San Marzano görsel altı vurgu şeridi */}
      <div
        aria-hidden="true"
        className="h-[3.5px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, #C42B1C 0%, #EA580C 55%, #F59E0B 100%)' }}
      />

      {/* İÇERİK BLOKLARI */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3.5">
        {/* ÜST BLOK: Konum, Başlık, Google Puanı ve Kısa Karakter Özeti */}
        <div>
          {/* 2. KONUM (Mahalle / Semt - Tıklanınca Google Haritalar'da açılır) */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#6E5A53] uppercase tracking-wider mb-1 min-w-0">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 min-w-0 max-w-full text-[#6E5A53] hover:text-[#B82516] transition-colors group/loc"
              title="Google Haritalar'da Aç"
            >
              <MapPin size={12} className="text-[#B82516] flex-shrink-0 group-hover/loc:scale-110 transition-transform" />
              <span className="truncate underline decoration-[#DFD0C8] group-hover/loc:decoration-[#B82516]">{getLocalizedText(restaurant.location, lang)}</span>
              <ExternalLink size={10} className="text-[#6E5A53] opacity-65 group-hover/loc:opacity-100 flex-shrink-0" />
            </a>
          </div>

          {/* 1. MEKAN ADI */}
          <h2 className="text-lg sm:text-xl font-black text-[#181210] tracking-tight leading-snug group-hover:text-[#991F12] transition-colors">
            {getLocalizedText(restaurant.name, lang)}
          </h2>

          {/* 3. GOOGLE MAPS PUANI */}
          <div onClick={(e) => { if ((e.target as HTMLElement).closest('a')) e.stopPropagation(); }}>
            <GooglePlaceRating ratings={restaurant.ratings} />
          </div>

          {/* 4. MEKANIN RUHU / KISA KARAKTER ÖZETİ */}
          {restaurant.tagline && (
            <p className="text-xs text-[#4E403B] font-medium leading-relaxed mt-2 line-clamp-2">
              {getLocalizedText(restaurant.tagline, lang)}
            </p>
          )}
        </div>

        {/* ALT BLOK: NE SİPARİŞ ETMELİ? / MENÜDEN ÖNE ÇIKANLAR (Kutusuz #11 Sol Çizgi + Kırmızı Kapsül) */}
        {(restaurant.orderSuggestion?.title || (restaurant.menuFrom && restaurant.menuFrom.length > 0)) && (
          <div className="pl-3.5 py-0.5 border-l-[3.5px] border-[#C42B1C]">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-1.5 bg-[#C42B1C] text-white">
              <Utensils size={11} className="text-white flex-shrink-0" />
              <span>{restaurant.orderSuggestion?.title ? 'Ne Sipariş Etmeli?' : 'Menüden Öne Çıkanlar'}</span>
            </span>
            <p className="text-xs sm:text-[13px] font-bold text-[#181210] leading-snug line-clamp-2">
              {restaurant.orderSuggestion?.title || restaurant.menuFrom.join(' · ')}
            </p>
            {firstAlsoTry && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#4A3B36] font-semibold min-w-0">
                <Sparkles size={12} className="text-[#B82516] flex-shrink-0" />
                <span className="truncate">Ayrıca dene: {firstAlsoTry.name}</span>
              </div>
            )}
          </div>
        )}

        {/* DİPNOT: GİTMEDEN BİL / İPUCU */}
        {firstTip && (
          <div className="pt-2.5 border-t border-dashed border-[#E8DDD6] flex items-start gap-1.5 text-[11px] text-[#685650]">
            <Info size={12} className="text-[#B82516] flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">{firstTip}</span>
          </div>
        )}
      </div>
    </article>
  );
}
