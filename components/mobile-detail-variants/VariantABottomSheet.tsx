'use client';

import React from 'react';
import { VenueImage } from '@/components/food/VenueImage';
import type { VisitorFoodVenue } from '@/lib/food/types';
import { GooglePlaceRating } from '@/components/food/GooglePlaceRating';
import { useModalFocus } from '@/lib/food/useModalFocus';
import { resolveSafeVenueMapsUrl } from '@/lib/food/maps';
import { getLocalizedText } from '@/lib/localization';
import {
  X,
  MapPin,
  ExternalLink,
  Utensils,
  Info,
  Sparkles,
} from 'lucide-react';

interface VariantAParseProps {
  restaurant: VisitorFoodVenue;
  onClose: () => void;
  lang?: 'tr' | 'en';
}

function parseTip(raw: string): { label: string | null; value: string; isWarning: boolean } {
  const idx = raw.indexOf(':');
  if (idx > 0 && idx < 38) {
    let label = raw.slice(0, idx).trim();
    const value = raw.slice(idx + 1).trim();
    if (label.startsWith('Bütçe seviyesi')) {
      label = 'Bütçe';
    }
    return { label, value, isWarning: label === 'Dezavantaj' };
  }
  return { label: null, value: raw.trim(), isWarning: false };
}

export function VariantABottomSheet({ restaurant, onClose, lang = 'tr' }: VariantAParseProps) {
  const modalRef = useModalFocus(true, onClose);
  const mapsUrl = resolveSafeVenueMapsUrl(restaurant, lang);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#181210]/60 backdrop-blur-sm transition-opacity duration-200 p-0 sm:p-4"
      onClick={onClose}
      style={{ overscrollBehavior: 'contain' }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="venue-detail-title"
        className="w-full sm:max-w-md bg-white rounded-t-[28px] sm:rounded-[28px] shadow-[0_18px_45px_-12px_rgba(24,18,16,0.28)] border border-[#EFE5DF] flex flex-col max-h-[90vh] supports-[height:100dvh]:max-h-[90dvh] overflow-hidden animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Karartmasız Net Görsel Alanı */}
        <div className="relative w-full aspect-[16/10] flex-shrink-0 bg-[#f5f2ec] overflow-hidden">
          <VenueImage
            visual={{
              url: restaurant.imageUrl,
              kind: restaurant.imageIsRepresentative ? 'illustration' : 'rights-cleared-photo',
              category: restaurant.imageCategory,
              venueId: restaurant.id,
              attribution: restaurant.imageAttribution,
            }}
            priority
            labelPlacement="bottom-rail"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 opacity-50" />

          {/* Mobil Üst Tutamaç */}
          <div className="pointer-events-none absolute top-2 inset-x-0 flex justify-center z-10 sm:hidden">
            <span className="w-9 h-1 rounded-full bg-white/85 shadow-xs" />
          </div>

          {/* Üst Bar: Sol Kategori/Yakın Rozetleri & Sağ Kapat Butonu */}
          <div className="absolute top-4 inset-x-5 z-10 flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="h-8 inline-flex items-center px-3 rounded-full text-xs font-extrabold whitespace-nowrap shadow-xs bg-white/95 text-[#181210] border border-[#EFE5DF]">
                {restaurant.categoryName}
              </span>
              {restaurant.scope === 'nearby' && restaurant.nearbyAreaLabel && (
                <span className="h-7 inline-flex items-center px-2.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-[#FFFBEB] text-[#78350F] border border-[#FCD34D] shadow-xs">
                  Yakın · {restaurant.nearbyAreaLabel.split(',')[0]}
                  {typeof restaurant.distanceMeters === 'number'
                    ? ` · ${restaurant.distanceMeters} m`
                    : typeof restaurant.distanceKm === 'number'
                    ? ` · ${restaurant.distanceKm.toFixed(1)} km`
                    : ''}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="w-8 h-8 rounded-full flex-shrink-0 bg-white/95 hover:bg-white text-[#181210] border border-[#EFE5DF] shadow-xs flex items-center justify-center transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C42B1C]"
            >
              <X size={16} strokeWidth={2.3} />
            </button>
          </div>
        </div>

        {/* 3.5px San Marzano Şeridi */}
        <div
          aria-hidden="true"
          className="w-full h-[3.5px] flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, #C42B1C 0%, #EA580C 55%, #F59E0B 100%)' }}
        />

        {/* Kutusuz Porselen İçerik Gövdesi */}
        <div className="flex-1 min-h-0 px-5 pt-5 pb-5 overflow-y-auto space-y-5 bg-white text-[#181210]">
          {/* 1. ADRES, MEKAN ADI, PUAN & KISA AÇIKLAMA */}
          <div className="space-y-2.5">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-start gap-1.5 text-xs font-semibold text-[#68554E] hover:text-[#181210] transition-colors min-w-0"
            >
              <span className="pt-0.5 flex-shrink-0">
                <MapPin size={13} className="text-[#B82516]" />
              </span>
              <span className="leading-snug min-w-0 break-words">
                <span className="underline decoration-[#DFD0C8]">
                  {restaurant.scope === 'nearby'
                    ? `${getLocalizedText(restaurant.location, lang)}${
                        restaurant.address ? ` — ${restaurant.address}` : ''
                      }`
                    : restaurant.address ||
                      restaurant.neighborhood ||
                      getLocalizedText(restaurant.location, lang)}
                </span>
                <span className="inline-flex align-middle ml-1 opacity-70">
                  <ExternalLink size={11} />
                </span>
              </span>
            </a>

            <h2
              id="venue-detail-title"
              className="text-[22px] font-black tracking-tight leading-tight text-[#181210] break-words"
            >
              {getLocalizedText(restaurant.name, lang)}
            </h2>

            <div>
              <GooglePlaceRating ratings={restaurant.ratings} />
            </div>

            {restaurant.tagline && (
              <p className="text-[13px] font-medium leading-[1.6] text-[#3F332E]">
                {getLocalizedText(restaurant.tagline, lang)}
              </p>
            )}
          </div>

          <hr className="border-[#EFE5DF]" />

          {/* 2. NE SİPARİŞ ETMELİ? */}
          {(restaurant.orderSuggestion?.title || restaurant.menuFrom.length > 0) && (
            <div className="pl-3.5 border-l-[3.5px] border-[#C42B1C]">
              <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#C42B1C] text-white mb-2">
                <Utensils size={11} />
                <span>{restaurant.orderSuggestion ? 'Ne Sipariş Etmeli?' : 'Menüden'}</span>
              </div>
              <h3 className="text-[15px] font-extrabold text-[#181210] leading-snug">
                {restaurant.orderSuggestion?.title || restaurant.menuFrom.join(' · ')}
              </h3>
            </div>
          )}

          {/* 3. AYRICA BUNLARI DA DENE */}
          {restaurant.alsoTry && restaurant.alsoTry.items && restaurant.alsoTry.items.length > 0 && (
            <div className="pl-3.5 border-l-[3.5px] border-[#E8C5BA]">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#9E1F13] mb-1.5">
                <Sparkles size={13} className="text-[#B82516]" />
                <span>Ayrıca Bunları da Dene</span>
              </div>
              <div className="space-y-2.5">
                {restaurant.alsoTry.items.map((item, idx) => (
                  <div key={idx}>
                    <div className="text-[13px] font-extrabold text-[#181210] leading-snug">
                      {item.name}
                    </div>
                    {item.description && (
                      <p className="text-xs text-[#4A3B36] leading-[1.55] mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. UYGUNLUK & GİTMEDEN BİL */}
          {restaurant.knowBeforeYouGo?.tips && restaurant.knowBeforeYouGo.tips.length > 0 && (
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#68554E]">
                <Info size={13} className="text-[#B82516]" />
                <span>Uygunluk & Gitmeden Bil</span>
              </div>
              <div className="divide-y divide-[#F1E8E2] border-y border-[#EFE5DF]">
                {restaurant.knowBeforeYouGo.tips.map((raw, idx) => {
                  const parsed = parseTip(raw);
                  return parsed.label ? (
                    <div
                      key={idx}
                      className="grid grid-cols-[106px_1fr] gap-3 py-2.5 items-baseline"
                    >
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wide leading-snug ${
                          parsed.isWarning ? 'text-[#9A3412]' : 'text-[#68554E]'
                        }`}
                      >
                        {parsed.label}
                      </span>
                      <span className="text-xs leading-[1.6] text-[#2F2521] min-w-0">
                        {parsed.value}
                      </span>
                    </div>
                  ) : (
                    <div key={idx} className="py-2.5 text-xs leading-[1.6] text-[#2F2521]">
                      {parsed.value}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sabit Alt Bar CTA */}
        <div className="px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] border-t border-[#EFE5DF] bg-white flex-shrink-0">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[46px] flex items-center justify-center gap-2 px-4 rounded-2xl bg-[#C42B1C] hover:bg-[#A61E11] active:scale-[0.98] text-white font-bold text-sm shadow-[0_6px_18px_-4px_rgba(196,43,28,0.35)] transition-all"
          >
            <MapPin size={16} />
            <span>Google Haritalar&#39;da Konumu Gör</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
