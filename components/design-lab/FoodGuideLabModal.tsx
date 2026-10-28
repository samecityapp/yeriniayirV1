'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Star,
  MapPin,
  Utensils,
  Sparkles,
  Info,
  MessageSquareQuote,
  Clock,
  CheckCircle2,
  FlaskConical,
  Compass
} from 'lucide-react';
import { LabVenue, DesignMeta } from '@/data/designLabFoodGuideData';

interface FoodGuideLabModalProps {
  venue: LabVenue | null;
  designMeta: DesignMeta | null;
  regionName: string;
  onClose: () => void;
}

export function FoodGuideLabModal({
  venue,
  designMeta,
  regionName,
  onClose
}: FoodGuideLabModalProps) {
  useEffect(() => {
    if (!venue) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [venue, onClose]);

  if (!venue) return null;

  const isBaselineDesign1 = designMeta?.number === 1;
  const isEditorial = designMeta?.number === 3 || designMeta?.number === 8;

  return (
    <div
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lab-modal-title"
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl shadow-2xl border transition-all ${
          isEditorial
            ? 'bg-[#FAF8F5] border-stone-300 text-stone-900'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div
          className={`sticky top-0 z-20 px-5 sm:px-6 py-4 border-b flex items-center justify-between gap-4 ${
            isEditorial
              ? 'bg-[#FAF8F5]/95 border-stone-200 backdrop-blur-md'
              : 'bg-white/95 border-slate-200 backdrop-blur-md'
          }`}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {designMeta && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Tasarım #{designMeta.number} · {designMeta.shortName}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                {venue.category}
              </span>
              {venue.isDemo ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <FlaskConical className="w-3 h-3" />
                  DEMO İÇERİK
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Doğrulanmış Kayıt
                </span>
              )}
            </div>
            <h2
              id="lab-modal-title"
              className={`text-xl sm:text-2xl font-bold truncate ${
                isEditorial ? 'font-serif tracking-tight text-stone-900' : 'text-slate-900'
              }`}
            >
              {venue.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Hero Photo + Location & Rating Overlay */}
          <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
            <Image
              src={venue.image}
              alt={venue.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-slate-900 backdrop-blur-md shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                {venue.neighborhood}
              </span>

              {venue.verifiedRating && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/90 text-white backdrop-blur-md shadow-sm">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span>{venue.verifiedRating.toFixed(1)}</span>
                  {venue.reviewCount && (
                    <span className="text-slate-300 font-normal">
                      ({venue.reviewCount.toLocaleString('tr-TR')})
                    </span>
                  )}
                  {venue.isDemo && (
                    <span className="ml-1 px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded text-[10px] font-bold">
                      DEMO
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-white">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-100">
                <Compass className="w-4 h-4 text-blue-300 shrink-0" />
                <span>{regionName} · {venue.distanceText}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-md font-medium">
                  Fiyat: {venue.priceTier}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-md font-medium inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-300" />
                  {venue.bestTime}
                </span>
              </div>
            </div>
          </div>

          {/* Short Editorial Summary */}
          <div className="space-y-1.5">
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {venue.editorialDescription}
            </p>
            <p className="text-xs text-slate-500 italic">
              Yerel Miras Notu: {venue.localHeritageNote}
            </p>
          </div>

          {/* 1. NE SİPARİŞ ETMELİ? (Preserving the beloved blue callout character from Mevcut Tasarım) */}
          <div
            className={`rounded-xl p-4 sm:p-5 border ${
              isBaselineDesign1
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gradient-to-br from-blue-50/90 via-blue-50/50 to-sky-50/80 border-blue-200/90 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Utensils className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-blue-950">
                Ne Sipariş Etmeli?
              </h3>
            </div>
            <p className="text-base sm:text-lg font-bold text-blue-900 mb-1">
              {venue.signatureDish}
            </p>
            <p className="text-sm text-blue-900/85 leading-relaxed">
              {venue.signatureDishDetail}
            </p>
          </div>

          {/* 2. NEDEN GİTMELİ? & 3. GİTMEDEN BİLİN (Two-column on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Neden Gitmeli? */}
            <div className="rounded-xl p-4 sm:p-5 bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Neden Gitmeli?
                </h3>
              </div>
              <ul className="space-y-2.5">
                {venue.whyGo.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gitmeden Bilin */}
            <div className="rounded-xl p-4 sm:p-5 bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Gitmeden Bilin
                </h3>
              </div>
              <ul className="space-y-2.5">
                {venue.knowBeforeYouGo.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-2" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. KAYNAKLI ZİYARETÇİ DENEYİMLERİ / MÜDAVİMLERİ NE DİYOR? */}
          {venue.visitorExperiences && venue.visitorExperiences.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MessageSquareQuote className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Müdavimleri Ne Diyor? · Kaynaklı Ziyaretçi Deneyimleri
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  {venue.ratingSource}
                </span>
              </div>

              <div className="space-y-2.5">
                {venue.visitorExperiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-slate-100/90 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-3"
                  >
                    <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
                      {exp.emoji}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm text-slate-800 leading-relaxed">
                        “{exp.text}”
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="text-[11px] font-semibold text-slate-600">
                          Kaynak: {exp.source}
                        </span>
                        {exp.verified ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Doğrulanmış Deneyim
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            DEMO ÖRNEK YORUM
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-20 px-5 sm:px-6 py-3.5 bg-slate-50/95 border-t border-slate-200 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 truncate">
            {venue.name} · {venue.neighborhood}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0"
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
