'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Star,
  MapPin,
  Utensils,
  Clock,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Award,
  CheckCircle2
} from 'lucide-react';
import {
  RegionFoodGuide,
  LabVenue,
  DesignMeta
} from '@/data/designLabFoodGuideData';

interface MobileProDesignProps {
  design: DesignMeta;
  region: RegionFoodGuide;
  venues: LabVenue[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onSelectVenue: (venue: LabVenue, design: DesignMeta) => void;
  viewportMode: 'desktop' | 'mobile';
}

export function FoodGuideMobileProDesigns({
  design,
  region,
  venues,
  activeCategory,
  setActiveCategory,
  onSelectVenue,
  viewportMode
}: MobileProDesignProps) {
  const [expandedVenueId, setExpandedVenueId] = useState<string>(
    venues[0]?.id || ''
  );
  const [activeCarouselIdx, setActiveCarouselIdx] = useState<number>(0);

  const categories = region.categories.slice(0, 7);

  /* =========================================================================
     DESIGN 11: MOBİL VİTRİN + KOMPAKT AKIŞ (Hero Showcase + Precision List)
     Shows 1 hero card at top + compact 88x88 aligned rows below (3-4 visible at once on phone!)
     ========================================================================= */
  if (design.number === 11) {
    const heroVenue = venues[0];
    const listVenues = venues.slice(1);

    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-7 space-y-4">
          {/* Clean Header */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
                {region.cityLabel} · Gurme Rehberi
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Yakında Ne Yenir?
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tabular-nums">
              {venues.length} Seçkin Mekan
            </span>
          </div>

          {/* Edge-to-Edge Smooth Category Rail */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat, idx) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 h-9 px-3.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {idx === 0 && <Sparkles className="w-3 h-3 shrink-0" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Featured #1 Hero Card */}
          {heroVenue && (
            <div className="rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-50/50 via-white to-white p-3.5 sm:p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3.5 sm:items-center">
                <div className="relative w-full sm:w-44 h-40 sm:h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={heroVenue.image}
                    alt={heroVenue.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 176px"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    ★ Kategori Lideri
                  </div>
                  {heroVenue.isDemo && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                      DEMO
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{heroVenue.neighborhood}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900 truncate mt-0.5">
                        {heroVenue.name}
                      </h4>
                    </div>
                    {heroVenue.verifiedRating && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold tabular-nums">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {heroVenue.verifiedRating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {heroVenue.editorialDescription}
                  </p>

                  <div className="pt-1 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-blue-100/60 px-2.5 py-1 rounded-lg truncate">
                      <Utensils className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{heroVenue.signatureDish}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectVenue(heroVenue, design)}
                      className="shrink-0 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <span>Detayları Gör</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Perfectly Aligned Compact Rows Below */}
          <div
            className={`grid gap-2.5 ${
              viewportMode === 'mobile'
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {listVenues.map((venue, idx) => (
              <div
                key={venue.id}
                onClick={() => onSelectVenue(venue, design)}
                className="group p-3 rounded-xl border border-slate-200/90 hover:border-blue-400 bg-white transition-all flex items-center gap-3 cursor-pointer"
              >
                <div className="relative w-[84px] h-[84px] rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                    sizes="84px"
                  />
                  <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-md bg-slate-900/85 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {idx + 2}
                  </span>
                </div>

                <div className="min-w-0 flex-1 flex flex-col justify-between h-[84px]">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600">
                        {venue.name}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        {venue.isDemo && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold">
                            DEMO
                          </span>
                        )}
                        {venue.verifiedRating && (
                          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-slate-800 tabular-nums">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            {venue.verifiedRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {venue.neighborhood} · {venue.distanceText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-blue-700 truncate">
                      🍽️ {venue.signatureDish}
                    </span>
                    <span className="shrink-0 text-[11px] font-bold text-blue-600 inline-flex items-center">
                      Detaylar
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     DESIGN 12: KAYDIRMALI KARUSEL + HIZLI DİZİN (Snap Peek Deck + Quick Index)
     Zero vertical bloat on mobile! Horizontal snap cards + 1-line quick jump index below.
     ========================================================================= */
  if (design.number === 12) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-7 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                Yakında Ne Yenir?
              </h3>
              <p className="text-xs text-slate-500">
                Sağa kaydırarak keşfedin veya alttaki hızlı dizinden seçin
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg tabular-nums">
              1–{venues.length} / {venues.length}
            </span>
          </div>

          {/* Horizontal Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveCarouselIdx(0);
                }}
                className={`shrink-0 h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Horizontal Scroll-Snap Deck (85% width on mobile so next card peeks!) */}
          <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {venues.map((venue, idx) => (
              <div
                key={venue.id}
                onClick={() => setActiveCarouselIdx(idx)}
                className={`snap-start shrink-0 rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                  viewportMode === 'mobile'
                    ? 'w-[82%]'
                    : 'w-[300px] sm:w-[320px]'
                } ${
                  activeCarouselIdx === idx
                    ? 'border-blue-600 shadow-md bg-white'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="relative h-40 w-full bg-slate-100">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-slate-900 text-[11px] font-bold shadow-sm truncate max-w-[180px]">
                        {venue.neighborhood}
                      </span>
                      {venue.isDemo ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                          DEMO
                        </span>
                      ) : (
                        venue.verifiedRating && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[11px] font-bold inline-flex items-center gap-1 tabular-nums">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {venue.verifiedRating.toFixed(1)}
                          </span>
                        )
                      )}
                    </div>
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <h4 className="text-base font-extrabold truncate">
                        {idx + 1}. {venue.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed h-8">
                      {venue.editorialDescription}
                    </p>
                    <div className="p-2 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-xs font-bold text-blue-950 truncate">
                        {venue.signatureDish}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-3.5 pb-3.5 pt-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    {venue.distanceText} · {venue.priceTier}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVenue(venue, design);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                  >
                    Detayları Gör
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Compact Quick-Tap Directory Below Carousel */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1.5 mb-1.5">
              Hızlı Liste Dizini (Dokun ve Detay Aç)
            </div>
            <div className="divide-y divide-slate-200/70">
              {venues.map((venue, idx) => (
                <button
                  key={venue.id}
                  type="button"
                  onClick={() => onSelectVenue(venue, design)}
                  className="w-full py-2 px-1.5 flex items-center justify-between gap-2 text-left hover:bg-white rounded-lg transition-colors"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {venue.name}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
                      · {venue.signatureDish}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {venue.verifiedRating && (
                      <span className="text-xs font-bold text-slate-700 tabular-nums">
                        ★ {venue.verifiedRating.toFixed(1)}
                      </span>
                    )}
                    <span className="text-xs font-bold text-blue-600">
                      İncele →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     DESIGN 13: İKİ SÜTUNLU MOBİL BENTO (2x2 Smart Mobile Grid)
     Shows 4 venues simultaneously on a single mobile screen in a symmetrical 2-column grid!
     ========================================================================= */
  if (design.number === 13) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="p-3.5 sm:p-7 space-y-4">
          <div className="flex items-center justify-between gap-2 px-0.5">
            <div>
              <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                Yakında Ne Yenir?
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                2x2 Simetrik Mobil Izgara · Tek Ekranda 4 Mekan
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold">
              {region.cityLabel}
            </span>
          </div>

          {/* Compact Pill Rail */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 h-8 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 2-Column Grid EVEN ON MOBILE (3-Column on Desktop) */}
          <div
            className={`grid gap-2.5 sm:gap-4 ${
              viewportMode === 'mobile'
                ? 'grid-cols-2'
                : 'grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {venues.map((venue) => (
              <div
                key={venue.id}
                onClick={() => onSelectVenue(venue, design)}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative w-full h-28 sm:h-40 bg-slate-100">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    {venue.verifiedRating && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-slate-900/85 text-white text-[10px] font-bold inline-flex items-center gap-0.5 tabular-nums">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        {venue.verifiedRating.toFixed(1)}
                      </span>
                    )}
                    {venue.isDemo && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-extrabold">
                        DEMO
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 sm:p-4 space-y-1">
                    <div className="text-[10px] font-semibold text-blue-600 truncate">
                      {venue.neighborhood.split('·')[0].trim()}
                    </div>
                    <h4 className="text-xs sm:text-base font-extrabold text-slate-900 truncate">
                      {venue.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug h-7 sm:h-8">
                      {venue.signatureDish}
                    </p>
                  </div>
                </div>

                <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVenue(venue, design);
                    }}
                    className="w-full py-1.5 sm:py-2 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-[11px] sm:text-xs font-bold transition-colors text-center"
                  >
                    Detayları Gör
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     DESIGN 14: iOS APP STORE "GÜNÜN SEÇKİSİ" DÜZENİ (Apple HIG Inset Grouped)
     Calm #F2F2F7 surface, white rounded-2xl cards, bottom App Store "GET" action bar alignment!
     ========================================================================= */
  if (design.number === 14) {
    return (
      <div className="bg-[#F2F2F7] border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-7 space-y-4">
          {/* iOS Large Title Style Header */}
          <div className="flex items-end justify-between border-b border-slate-300/70 pb-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                {region.name} Rehberi
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                Yakında Ne Yenir?
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Bugünün Seçkisi
            </span>
          </div>

          {/* iOS Segmented Capsule Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#007AFF] text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* iOS Inset Grouped Cards */}
          <div
            className={`grid gap-3.5 ${
              viewportMode === 'mobile'
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between border border-black/[0.04]"
              >
                {/* Top Photo + Editorial Caption */}
                <div>
                  <div className="relative h-40 w-full bg-slate-100">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-medium">
                      {venue.neighborhood}
                    </div>
                    {venue.isDemo && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                        DEMO
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 pb-2.5">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {venue.editorialDescription}
                    </p>
                  </div>
                </div>

                {/* Bottom App-Store Style Action Bar (Strict Alignment) */}
                <div className="px-3.5 py-3 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-950 truncate">
                        {venue.name}
                      </h4>
                      {venue.verifiedRating && (
                        <span className="shrink-0 text-[11px] font-bold text-amber-600 tabular-nums">
                          ★ {venue.verifiedRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#007AFF] font-semibold truncate">
                      {venue.signatureDish}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectVenue(venue, design)}
                    className="shrink-0 px-4 py-1.5 rounded-full bg-[#007AFF] hover:bg-blue-600 text-white text-xs font-bold tracking-tight transition-colors"
                  >
                    DETAYLAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     DESIGN 15: AKILLI AKORDEON ÖNİZLEMELİ LİSTE (Progressive Disclosure UX)
     Shows 4-5 ultra-clean rows; tapping "Önizle" expands signature dish & tip inline,
     while "Detayları Gör" opens the full modal!
     ========================================================================= */
  if (design.number === 15) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-7 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Yakında Ne Yenir?
              </h3>
              <p className="text-xs text-slate-500">
                Satıra dokunarak hızlı özeti açın veya tam detay penceresini inceleyin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {venues.map((venue, idx) => {
              const isExpanded = expandedVenueId === venue.id;
              return (
                <div
                  key={venue.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-blue-500 bg-blue-50/15 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Main Row — Strictly Aligned */}
                  <div
                    onClick={() =>
                      setExpandedVenueId(isExpanded ? '' : venue.id)
                    }
                    className="p-3 sm:p-4 flex items-center gap-3 cursor-pointer"
                  >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-blue-600 tabular-nums">
                          #{idx + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {venue.name}
                        </h4>
                        {venue.isDemo && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-bold">
                            DEMO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {venue.neighborhood} · {venue.distanceText}
                      </p>
                      <p className="text-xs font-semibold text-slate-700 truncate mt-1">
                        🍽️ {venue.signatureDish}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {venue.verifiedRating && (
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-900 text-xs font-bold inline-flex items-center gap-1 tabular-nums">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {venue.verifiedRating.toFixed(1)}
                        </span>
                      )}
                      <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Drawer */}
                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-200/70 space-y-2.5 bg-white">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {venue.editorialDescription}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                          <span className="font-bold text-blue-900 block">
                            Ne Sipariş Etmeli?
                          </span>
                          <span className="text-blue-950">
                            {venue.signatureDishDetail}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70">
                          <span className="font-bold text-amber-900 block">
                            Gitmeden Bilin:
                          </span>
                          <span className="text-slate-700">
                            {venue.knowBeforeYouGo[0]}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">
                          En İyi Saat: {venue.bestTime} · Fiyat: {venue.priceTier}
                        </span>
                        <button
                          type="button"
                          onClick={() => onSelectVenue(venue, design)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Tüm Detayları Gör</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     DESIGN 16: AIRBNB "MİSAFİR FAVORİSİ" TARZI (Borderless Clean Discovery)
     Zero box clutter! Clean rounded images, Guest Favorite pill, 3-line crisp typography.
     ========================================================================= */
  if (design.number === 16) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              Yakında Ne Yenir?
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {region.name}
            </span>
          </div>

          {/* Airbnb-style Bottom-Border Category Strip */}
          <div className="flex items-center gap-5 overflow-x-auto border-b border-slate-200 pb-2.5 no-scrollbar">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 pb-2 -mb-[11px] text-xs sm:text-sm transition-all border-b-2 ${
                    active
                      ? 'border-slate-950 text-slate-950 font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Borderless Clean Cards */}
          <div
            className={`grid gap-6 ${
              viewportMode === 'mobile'
                ? 'grid-cols-1'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {venues.map((venue) => (
              <div
                key={venue.id}
                onClick={() => onSelectVenue(venue, design)}
                className="group cursor-pointer space-y-2.5"
              >
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-slate-950 text-[11px] font-extrabold shadow-sm">
                    {venue.isDemo ? 'DEMO ÖRNEK' : 'Müdavim Favorisi'}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-semibold">
                    {venue.distanceText}
                  </div>
                </div>

                {/* 3-Line Precision Typography */}
                <div className="space-y-1 px-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-slate-950 truncate">
                      {venue.name}
                    </h4>
                    {venue.verifiedRating && (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-slate-950 tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                        {venue.verifiedRating.toFixed(1)}
                        <span className="text-slate-400 font-normal">
                          ({venue.reviewCount})
                        </span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 truncate">
                    {venue.neighborhood} · {venue.priceTier}
                  </p>

                  <p className="text-xs text-slate-700 line-clamp-1">
                    <span className="font-semibold text-blue-600">Öneri:</span>{' '}
                    {venue.signatureDish}
                  </p>

                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-950 underline underline-offset-4 group-hover:text-blue-600">
                      Detayları Gör
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     DESIGN 17: OPTİK HİZALI KOMPAKT REHBER (Optical Alignment Masterclass)
     Left rank column, middle 3-line fixed typography + blue dish pill, right 84x84 photo.
     ========================================================================= */
  if (design.number === 17) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Yakında Ne Yenir?
              </h3>
              <p className="text-xs text-slate-500">
                Milimetrik optik hizalama: Göz yormadan tek bakışta tarama
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              {region.cityLabel}
            </span>
          </div>

          {/* Segmented Capsule Rail */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl no-scrollbar">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 h-8 px-3 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Optical Alignment List */}
          <div
            className={`grid gap-3 ${
              viewportMode === 'mobile'
                ? 'grid-cols-1'
                : 'grid-cols-1 lg:grid-cols-2'
            }`}
          >
            {venues.map((venue, idx) => (
              <div
                key={venue.id}
                onClick={() => onSelectVenue(venue, design)}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 bg-white transition-all flex items-center gap-3 cursor-pointer"
              >
                {/* Left Optical Number Strip */}
                <div className="w-7 shrink-0 flex flex-col items-center justify-center">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold flex items-center justify-center tabular-nums">
                    {idx + 1}
                  </span>
                  {venue.verifiedRating && (
                    <span className="mt-2 text-[11px] font-extrabold text-slate-700 tabular-nums">
                      ★{venue.verifiedRating.toFixed(1)}
                    </span>
                  )}
                </div>

                {/* Middle Fixed-Height Content */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                      {venue.name}
                    </h4>
                    {venue.isDemo && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-bold shrink-0">
                        DEMO
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {venue.neighborhood} · {venue.priceTier}
                  </p>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-semibold max-w-full truncate">
                    <span className="truncate">🍽️ {venue.signatureDish}</span>
                  </div>
                  <div className="pt-0.5">
                    <span className="text-[11px] font-bold text-blue-600 inline-flex items-center gap-0.5">
                      Detayları Gör
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Right Square Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     DESIGN 18: MICHELIN MOBİL UYGULAMA KARTLARI (Bib Gourmand Structured Cards)
     Warm eye-friendly stone background, structured 2-column metadata grid inside each card.
     ========================================================================= */
  if (design.number === 18) {
    return (
      <div className="bg-[#F9F8F5] border border-stone-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-red-800 block">
                Gastronomi Seçkisi · {region.cityLabel}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                Yakında Ne Yenir?
              </h3>
            </div>
            <Award className="w-6 h-6 text-red-800 shrink-0" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-red-900 text-white'
                    : 'bg-white text-stone-700 border border-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div
            className={`grid gap-4 ${
              viewportMode === 'mobile'
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-3.5 shadow-sm flex flex-col justify-between space-y-3"
              >
                {/* Card Top Meta Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-base font-extrabold text-stone-900 truncate">
                      {venue.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">
                      {venue.neighborhood}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    {venue.isDemo && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-200 text-stone-900 text-[9px] font-extrabold">
                        DEMO
                      </span>
                    )}
                    {venue.verifiedRating && (
                      <span className="px-2 py-1 rounded-lg bg-stone-100 text-stone-900 text-xs font-bold tabular-nums">
                        ★ {venue.verifiedRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Crisp 16:9 Photo */}
                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Structured 2-Column Info Table */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase text-stone-400 font-bold block">
                      İmza Sipariş
                    </span>
                    <span className="font-bold text-stone-900 truncate block">
                      {venue.signatureDish}
                    </span>
                  </div>
                  <div className="min-w-0 border-l border-stone-200 pl-2">
                    <span className="text-[10px] uppercase text-stone-400 font-bold block">
                      Zaman & Fiyat
                    </span>
                    <span className="font-semibold text-stone-700 truncate block">
                      {venue.priceTier} · {venue.bestTime.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectVenue(venue, design)}
                  className="w-full py-2 rounded-xl bg-stone-900 hover:bg-red-900 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Detayları Gör</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     DESIGN 19: HİKÂYE HALKALARI + MODERN AKIŞ (Instagram Story Category Rings)
     Thumb-friendly circular visual category rings + balanced blue-white cards below.
     ========================================================================= */
  if (design.number === 19) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Yakında Ne Yenir?
            </h3>
            <span className="text-xs font-semibold text-blue-600">
              Kategori Halkasına Dokunun
            </span>
          </div>

          {/* Visual Story Rings for Categories */}
          <div className="flex items-start gap-3 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat, idx) => {
              const active = activeCategory === cat;
              const ringImage =
                region.venues.find((v) => v.category === cat)?.image ||
                region.venues[idx % region.venues.length]?.image ||
                region.venues[0].image;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 w-[76px] flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className={`p-0.5 rounded-full transition-all ${
                      active
                        ? 'bg-gradient-to-tr from-blue-600 to-sky-400 scale-105 shadow-md'
                        : 'bg-slate-200 group-hover:bg-blue-300'
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white bg-slate-100">
                      <Image
                        src={ringImage}
                        alt={cat}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  </div>
                  <span
                    className={`text-[11px] leading-tight text-center line-clamp-2 ${
                      active
                        ? 'font-extrabold text-blue-600'
                        : 'font-medium text-slate-600'
                    }`}
                  >
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Balanced Hybrid Cards */}
          <div
            className={`grid gap-3.5 ${
              viewportMode === 'mobile'
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {venues.map((venue) => (
              <div
                key={venue.id}
                onClick={() => onSelectVenue(venue, design)}
                className="rounded-2xl border border-slate-200 p-3.5 hover:border-blue-500 transition-all bg-white flex flex-col justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold text-blue-600 truncate">
                        {venue.neighborhood}
                      </span>
                      {venue.verifiedRating && (
                        <span className="shrink-0 text-xs font-extrabold text-slate-900 tabular-nums">
                          ★ {venue.verifiedRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 truncate mt-0.5">
                      {venue.name}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                      {venue.editorialDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    🍴 {venue.signatureDish}
                  </span>
                  <span className="shrink-0 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                    Detayları Gör
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     DESIGN 20: YERİNİ AYIR "KUSURSUZ MOBİL" PRO (Ultimate Blue-White Mobile UX)
     The crown jewel of blue-white mobile ergonomics:
     - Shows 3 complete cards on a single mobile viewport
     - Strict 96x96 left thumbnail, fixed 3-tier right typography, full-width bottom bar
       with aligned "Ne Sipariş Etmeli?" pill + "Detayları Gör" CTA.
     ========================================================================= */
  return (
    <div className="bg-white border-2 border-blue-600/20 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden">
      <div className="p-4 sm:p-8 space-y-5">
        {/* Crown Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Yerini Ayır Mobil Pro Standardı · {region.cityLabel}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Yakında Ne Yenir?
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 tabular-nums">
              {venues.length} Seçkin Durak
            </span>
          </div>
        </div>

        {/* Thumb-Friendly Sticky-Feel Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat, idx) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 h-10 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all inline-flex items-center gap-1.5 ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {idx === 0 && <Sparkles className="w-3.5 h-3.5 shrink-0" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Precision-Aligned Cards: 1-col on phone (3 fit per screen!), 2-col on tablet, 3-col on desktop */}
        <div
          className={`grid gap-3.5 sm:gap-5 ${
            viewportMode === 'mobile'
              ? 'grid-cols-1'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {venues.map((venue) => (
            <article
              key={venue.id}
              onClick={() => onSelectVenue(venue, design)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all p-3.5 flex flex-col justify-between gap-3 cursor-pointer"
            >
              {/* Top Row: Fixed 92x92 Photo + 3-Tier Strictly Aligned Content */}
              <div className="flex items-start gap-3.5">
                <div className="relative w-[92px] h-[92px] rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="92px"
                  />
                  {venue.isDemo && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-extrabold">
                      DEMO
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 h-[92px] flex flex-col justify-between">
                  <div>
                    {/* Line 1: Neighborhood + Rating (Tabular Nums) */}
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[11px] font-bold text-blue-600 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{venue.neighborhood}</span>
                      </span>

                      {venue.verifiedRating && (
                        <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-slate-900 border border-amber-200/80 text-[11px] font-extrabold tabular-nums">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {venue.verifiedRating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Line 2: Venue Name */}
                    <h4 className="text-base font-extrabold text-slate-900 truncate mt-0.5 group-hover:text-blue-600 transition-colors">
                      {venue.name}
                    </h4>

                    {/* Line 3: Exact 2-line Clamped Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-snug mt-1">
                      {venue.editorialDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Bar: Signature Dish Pill + Detayları Gör Button */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1 flex items-center gap-1.5 bg-blue-50/80 border border-blue-100 px-2.5 py-1.5 rounded-xl">
                  <Utensils className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-blue-950 truncate">
                    {venue.signatureDish}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVenue(venue, design);
                  }}
                  className="shrink-0 h-8 px-3.5 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-sm"
                >
                  <span>Detayları Gör</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
