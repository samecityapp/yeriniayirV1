'use client';

import React, { useEffect } from 'react';
import {VenueImage} from '@/components/food/VenueImage';
import type { VisitorFoodVenue } from '@/lib/food/types';
import { GooglePlaceRating } from '@/components/food/GooglePlaceRating';
import { useModalFocus } from '@/lib/food/useModalFocus';
import { getLocalizedText } from '@/lib/localization';
import { 
  X, 
  MapPin, 
  ExternalLink, 
  Utensils, 
  Info, 
  Star,
  Sparkles
} from 'lucide-react';

interface VariantAParseProps {
  restaurant: VisitorFoodVenue;
  onClose: () => void;
  lang?: 'tr' | 'en';
}

export function VariantABottomSheet({ restaurant, onClose, lang = 'tr' }: VariantAParseProps) {
  const modalRef=useModalFocus(true,onClose);
  const mapsUrl = restaurant.ratings?.[0]?.attribution?.mapsUri ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getLocalizedText(restaurant.name, lang) + ' ' + (restaurant.address || restaurant.neighborhood || getLocalizedText(restaurant.location, lang)))}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-200 p-0 sm:p-4"
      onClick={onClose}
      style={{ overscrollBehavior: 'contain' }}
    >
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="venue-detail-title"
        className="w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Mobil Tutamaç */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Görsel & Başlık Alanı */}
        <div className="relative w-full h-52 sm:h-60 flex-shrink-0 bg-slate-100">
          <VenueImage visual={{url:restaurant.imageUrl,kind:restaurant.imageIsRepresentative?'illustration':'rights-cleared-photo',category:restaurant.imageCategory,venueId:restaurant.id,attribution:restaurant.imageAttribution}} priority labelPlacement="below-category" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          
          {/* Kapat Butonu */}
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition shadow-xs"
          >
            <X size={18} />
          </button>

          {/* Kategori Etiketi */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-xs backdrop-blur-xs">
              {restaurant.categoryName}
            </span>
          </div>

          {/* Mekan Adı, Konum ve Harita */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 id="venue-detail-title" className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-xs">
              {getLocalizedText(restaurant.name, lang)}
            </h2>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-white/95 hover:text-white mt-1 group/map transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MapPin size={13} className="text-blue-400 flex-shrink-0 group-hover/map:scale-110 transition-transform" />
              <span className="font-medium truncate underline decoration-white/40">{restaurant.neighborhood || getLocalizedText(restaurant.location, lang)}</span>
              <ExternalLink size={11} className="opacity-75" />
            </a>
          </div>
        </div>

        {/* Bilgi Odaklı İçerik Gövdesi */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-900">
          
          {/* 1. DOĞRULANMIŞ PUAN & KISA TARAFSIZ AÇIKLAMA */}
          <div className="space-y-2">
            <GooglePlaceRating ratings={restaurant.ratings} />

            {restaurant.tagline && (
              <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
                {getLocalizedText(restaurant.tagline, lang)}
              </p>
            )}
          </div>

          {/* 2. DOĞRULANMIŞ MENÜ ÜRÜNÜ / NE SİPARİŞ ETMELİ? */}
          {(restaurant.orderSuggestion?.title || restaurant.menuFrom.length > 0) && (
            <div className="bg-blue-50/70 border border-blue-150 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-blue-900 uppercase tracking-wider mb-1.5">
                <Utensils size={15} className="text-blue-600" />
                <span>{restaurant.orderSuggestion ? 'Ne Sipariş Etmeli?' : 'Menüden'}</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-950 mb-1 leading-snug">
                {restaurant.orderSuggestion?.title || restaurant.menuFrom.join(' · ')}
              </h3>

            </div>
          )}

          {/* 3. AYRICA BUNLARI DA DENE (Varsa ve doğrulanmışsa) */}
          {restaurant.alsoTry && restaurant.alsoTry.items && restaurant.alsoTry.items.length > 0 && (
            <div className="pt-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-600" />
                <span>Ayrıca Bunları da Dene</span>
              </div>
              <div className="space-y-2">
                {restaurant.alsoTry.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <span className="text-xs font-black text-slate-900 block mb-0.5">
                      {item.name}
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. GİTMEDEN BİL (Kesinleşmiş pratik bilgiler) */}
          {restaurant.knowBeforeYouGo?.tips && restaurant.knowBeforeYouGo.tips.length > 0 && (
            <div className="pt-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Info size={14} className="text-blue-600" />
                <span>Gitmeden Bil</span>
              </div>
              <div className="space-y-1.5">
                {restaurant.knowBeforeYouGo.tips.map((tip, idx) => (
                  <div 
                    key={idx} 
                    className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-700 leading-relaxed"
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. GOOGLE HARİTALAR'DA AÇ BUTONU */}
          <div className="pt-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
            >
              <MapPin size={16} />
              <span>Google Haritalar&#39;da Konumu Gör</span>
              <ExternalLink size={14} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
