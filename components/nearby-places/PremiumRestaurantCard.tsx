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
      className="group relative w-full bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.12)] active:scale-[0.99] transition-all duration-200 overflow-hidden cursor-pointer flex flex-col select-none touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* 1. MEKAN FOTOĞRAFI (Geniş, oranlı, sade) */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-slate-100">
        <VenueImage visual={{url:restaurant.imageUrl,kind:restaurant.imageIsRepresentative?'illustration':'rights-cleared-photo',category:restaurant.imageCategory,venueId:restaurant.id,attribution:restaurant.imageAttribution}} priority={priority} className="group-hover:scale-105 transition-transform duration-500 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />

        {restaurant.scope === 'nearby' && restaurant.nearbyAreaLabel && (
          <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold tracking-wide flex items-center gap-1 shadow-xs border border-white/15">
            <MapPin size={10} className="text-amber-300 flex-shrink-0" />
            <span>
              Yakın Öneri · {restaurant.nearbyAreaLabel.split(',')[0]}
              {typeof restaurant.distanceKm === 'number' ? ` (${restaurant.distanceKm.toFixed(1)} km)` : ''}
            </span>
          </div>
        )}

        {/* Mobil dokunma ipucu */}
        <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-800 flex items-center justify-center shadow-xs opacity-90 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
          <ChevronRight size={16} />
        </div>
      </div>

      {/* İÇERİK BLOKLARI */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        {/* ÜST BLOK: Konum, Başlık, Google Puanı ve Kısa Karakter Özeti */}
        <div>
          {/* 2. KONUM (Mahalle / Semt - Tıklanınca Google Haritalar'da açılır) */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors group/loc"
              title="Google Haritalar'da Aç"
            >
              <MapPin size={12} className="text-blue-600 flex-shrink-0 group-hover/loc:scale-110 transition-transform" />
              <span className="truncate underline decoration-slate-300 hover:decoration-blue-600">{getLocalizedText(restaurant.location, lang)}</span>
              <ExternalLink size={10} className="text-slate-400 opacity-60 group-hover/loc:opacity-100" />
            </a>
          </div>

          {/* 1. MEKAN ADI */}
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-snug group-hover:text-blue-900 transition-colors">
            {getLocalizedText(restaurant.name, lang)}
          </h2>

          {/* 3. GOOGLE MAPS PUANI */}
          <GooglePlaceRating ratings={restaurant.ratings} />

          {/* 4. MEKANIN RUHU / KISA KARAKTER ÖZETİ */}
          {restaurant.tagline && (
            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2 line-clamp-2">
              {getLocalizedText(restaurant.tagline, lang)}
            </p>
          )}
        </div>

        {/* ALT BLOK: NE SİPARİŞ ETMELİ? / MENÜDEN ÖNE ÇIKANLAR (Doğrulanmış Ürün Kutusu) */}
        {(restaurant.orderSuggestion?.title || (restaurant.menuFrom && restaurant.menuFrom.length > 0)) && (
          <div className="bg-blue-50/70 border border-blue-150 rounded-2xl p-3 sm:p-3.5 transition-colors group-hover:bg-blue-50 group-hover:border-blue-200">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-800 mb-1">
              <Utensils size={13} className="text-blue-600" />
              <span>{restaurant.orderSuggestion?.title ? 'Ne Sipariş Etmeli?' : 'Menüden Öne Çıkanlar'}</span>
            </div>
            <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug line-clamp-2">
              {restaurant.orderSuggestion?.title || restaurant.menuFrom.join(' · ')}
            </p>
            {firstAlsoTry && (
              <div className="mt-1.5 pt-1.5 border-t border-blue-100/80 flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold">
                <Sparkles size={11} className="text-blue-600 flex-shrink-0" />
                <span className="truncate">Ayrıca dene: {firstAlsoTry.name}</span>
              </div>
            )}
          </div>
        )}

        {/* DİPNOT: GİTMEDEN BİL / İPUCU */}
        {firstTip && (
          <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-slate-50 rounded-xl px-2.5 py-1.5 border border-slate-100">
            <Info size={12} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">{firstTip}</span>
          </div>
        )}
      </div>
    </article>
  );
}
