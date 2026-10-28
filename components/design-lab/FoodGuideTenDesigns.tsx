'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Info,
  Star,
  MapPin,
  Utensils,
  Clock,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Compass,
  Award,
  BookOpen,
  Flame,
  CheckCircle2,
  FlaskConical,
  Navigation,
  Heart
} from 'lucide-react';
import {
  RegionFoodGuide,
  LabVenue,
  DesignMeta
} from '@/data/designLabFoodGuideData';

interface DesignInstanceProps {
  design: DesignMeta;
  region: RegionFoodGuide;
  syncedCategory: string | null;
  onSelectVenue: (venue: LabVenue, design: DesignMeta) => void;
  isFavorite: boolean;
  onToggleFavorite: (designNumber: number) => void;
  viewportMode: 'desktop' | 'mobile';
}

/**
 * Ensures fair, consistent filtering across all 10 designs.
 * - Index 0 ("Mutlaka Denenmesi Gerekenler") returns the region's Must-Try showcase (6 venues).
 * - Specific category tabs return matching category venues first, plus complementary local pairings
 *   so every category tab renders a balanced 3-card showcase for fair grid/list comparison.
 */
export function getFairFilteredVenues(
  region: RegionFoodGuide,
  activeCategory: string
): { venues: LabVenue[]; exactCount: number } {
  if (
    !activeCategory ||
    activeCategory === 'Mutlaka Denenmesi Gerekenler' ||
    !region.categories.includes(activeCategory)
  ) {
    const mustTry = region.venues.filter((v) => v.isMustTry);
    const rest = region.venues.filter((v) => !v.isMustTry);
    const combined = [...mustTry, ...rest].slice(0, 6);
    return { venues: combined, exactCount: combined.length };
  }

  const exactMatches = region.venues.filter((v) => v.category === activeCategory);
  if (exactMatches.length >= 3) {
    return { venues: exactMatches, exactCount: exactMatches.length };
  }

  // Pair with complementary must-try venues from the same region so 3-column layouts remain fair to compare
  const complementary = region.venues.filter(
    (v) => v.category !== activeCategory && v.isMustTry
  );
  const combined = [...exactMatches, ...complementary].slice(0, 3);
  return { venues: combined, exactCount: exactMatches.length };
}

export function FoodGuideDesignSection({
  design,
  region,
  syncedCategory,
  onSelectVenue,
  isFavorite,
  onToggleFavorite,
  viewportMode
}: DesignInstanceProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    region.categories[0] || 'Mutlaka Denenmesi Gerekenler'
  );
  const [selectedMapVenueId, setSelectedMapVenueId] = useState<string>(
    region.venues[0]?.id || ''
  );

  // Reset to first category ("Mutlaka Denenmesi Gerekenler") when region changes
  useEffect(() => {
    setActiveCategory(region.categories[0] || 'Mutlaka Denenmesi Gerekenler');
    setSelectedMapVenueId(region.venues[0]?.id || '');
  }, [region]);

  // Synchronize category if global category sync is triggered
  useEffect(() => {
    if (syncedCategory && region.categories.includes(syncedCategory)) {
      setActiveCategory(syncedCategory);
    }
  }, [syncedCategory, region]);

  const { venues } = getFairFilteredVenues(region, activeCategory);

  useEffect(() => {
    if (venues.length > 0 && !venues.some((v) => v.id === selectedMapVenueId)) {
      setSelectedMapVenueId(venues[0].id);
    }
  }, [venues, selectedMapVenueId]);

  const activeMapVenue =
    venues.find((v) => v.id === selectedMapVenueId) || venues[0];

  return (
    <section
      id={design.id}
      className="scroll-mt-36 transition-all"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 760px' }}
    >
      {/* Design Lab Section Header Bar */}
      <div className="mb-4 rounded-2xl bg-slate-900 text-white p-4 sm:p-5 shadow-md border border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white tracking-wide">
              TASARIM #{design.number}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {design.name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-blue-300 border border-slate-700">
              {design.badge}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
              Renk Yönü: {design.colorDirection}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
            {design.philosophy}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onToggleFavorite(design.number)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              isFavorite
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-slate-950 text-slate-950' : 'text-amber-400'
              }`}
            />
            {isFavorite ? `Favorim Seçildi (#${design.number})` : `Favori Seç (#${design.number})`}
          </button>
        </div>
      </div>

      {/* Viewport Frame Wrapper (Full Desktop or 390px Mobile Simulation Frame) */}
      <div
        className={`transition-all duration-300 ${
          viewportMode === 'mobile'
            ? 'max-w-[412px] mx-auto border-[6px] border-slate-900 rounded-[36px] shadow-2xl overflow-hidden bg-white'
            : 'w-full'
        }`}
      >
        {viewportMode === 'mobile' && (
          <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1.5 px-4 flex items-center justify-between">
            <span>9:41 · Mobil Önizleme (390px)</span>
            <span>Tasarım #{design.number}</span>
          </div>
        )}

        {/* =====================================================================
            DESIGN 1: MEVCUT TASARIM (Exact Baseline Reference)
           ===================================================================== */}
        {design.number === 1 && (
          <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Yakında Ne Yenir?
                </h3>
                <span className="text-xs font-medium text-gray-500">
                  {region.name} · Mevcut Canlı Görünüm Referansı
                </span>
              </div>

              <div className="space-y-6">
                {/* Exact CategoryFilters.tsx replica */}
                <div className="flex flex-wrap gap-3">
                  {region.categories.slice(0, 7).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Exact RestaurantCard.tsx 3-column grid replica + required neighborhood & DEMO badge */}
                <div
                  className={`grid gap-6 ${
                    viewportMode === 'mobile'
                      ? 'grid-cols-1'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {venues.map((venue) => (
                    <div
                      key={venue.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col"
                    >
                      <div className="relative w-full h-48 bg-gray-200">
                        <Image
                          src={venue.image}
                          alt={venue.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {venue.isDemo && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-100/95 text-amber-900 border border-amber-300 text-[11px] font-bold">
                            DEMO
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{venue.neighborhood}</span>
                        </div>
                        <h4 className="text-lg font-bold mb-2 text-gray-900">
                          {venue.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                          {venue.editorialDescription}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <Info className="w-4 h-4 mr-1 text-blue-500 shrink-0" />
                            <button
                              type="button"
                              onClick={() => onSelectVenue(venue, design)}
                              className="text-blue-600 hover:underline text-sm font-medium"
                            >
                              Detayları Gör
                            </button>
                          </div>

                          {venue.verifiedRating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-bold text-gray-800">
                                {venue.verifiedRating.toFixed(1)}
                              </span>
                              {venue.reviewCount && (
                                <span className="text-gray-500 text-xs">
                                  ({venue.reviewCount})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESIGN 2: MEVCUT TASARIM 2.0 (Upgraded Blue-White Premium Evolution)
           ===================================================================== */}
        {design.number === 2 && (
          <div className="bg-gradient-to-b from-white via-slate-50/40 to-white border border-blue-100 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-8 lg:p-10 space-y-7">
              {/* Upgraded Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200/80">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2.5 border border-blue-200/60">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Yerini Ayır Gurme Rehberi · {region.cityLabel}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    Yakında Ne Yenir?
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {region.tagline}
                  </p>
                </div>
                <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-end">
                  Toplam {region.categories.length} yerel kategori (Maks. 7 kuralı aktif)
                </div>
              </div>

              {/* Refined Blue-White Category Pills */}
              <div className="flex flex-wrap gap-2.5">
                {region.categories.slice(0, 7).map((category, idx) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-600 ring-offset-2'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700'
                      }`}
                    >
                      {idx === 0 && (
                        <Sparkles
                          className={`w-3.5 h-3.5 ${
                            isActive ? 'text-blue-200' : 'text-blue-600'
                          }`}
                        />
                      )}
                      <span>{category}</span>
                    </button>
                  );
                })}
              </div>

              {/* Upgraded 2.0 Cards */}
              <div
                className={`grid gap-6 ${
                  viewportMode === 'mobile'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {venues.map((venue) => (
                  <article
                    key={venue.id}
                    className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-200 overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/20" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 backdrop-blur-md shadow-sm">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          {venue.neighborhood}
                        </span>
                        {venue.isDemo ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 shadow-sm">
                            DEMO
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-600/95 text-white backdrop-blur-md shadow-sm">
                            Doğrulanmış
                          </span>
                        )}
                      </div>

                      {/* Bottom Overlay Rating & Distance */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-xs font-medium bg-slate-900/75 backdrop-blur-md px-2.5 py-1 rounded-md">
                          {venue.distanceText}
                        </span>
                        {venue.verifiedRating && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/95 text-slate-900 text-xs font-bold shadow-sm">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{venue.verifiedRating.toFixed(1)}</span>
                            {venue.reviewCount && (
                              <span className="text-slate-500 font-normal">
                                ({venue.reviewCount.toLocaleString('tr-TR')})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {venue.name}
                        </h4>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {venue.priceTier}
                        </span>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                        {venue.editorialDescription}
                      </p>

                      {/* Signature Dish Mini Callout inside Card 2.0 */}
                      <div className="mt-auto mb-4 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-0.5 flex items-center gap-1">
                          <Utensils className="w-3 h-3" />
                          Ne Sipariş Etmeli?
                        </div>
                        <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                          {venue.signatureDish}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectVenue(venue, design)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Detayları Gör</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESIGN 3: PREMIUM EDITORIAL (Michelin Guide / Condé Nast Style)
           ===================================================================== */}
        {design.number === 3 && (
          <div className="bg-[#FAF7F2] border border-stone-300 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden text-stone-900">
            <div className="p-6 sm:p-10 space-y-8">
              {/* Magazine Masthead */}
              <div className="border-b-2 border-stone-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-red-800 font-bold mb-2">
                    <Award className="w-4 h-4" />
                    Culinaria Seçkisi · {region.name}
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-stone-950">
                    Yakında Ne Yenir?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md font-serif italic">
                  “{region.tagline}”
                </p>
              </div>

              {/* Editorial Underline Tabs */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-stone-300 pb-3">
                {region.categories.slice(0, 7).map((category, idx) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`pb-2 text-sm transition-all relative ${
                        isActive
                          ? 'font-bold text-red-900 border-b-2 border-red-800 -mb-[13px]'
                          : 'font-medium text-stone-600 hover:text-stone-950'
                      }`}
                    >
                      <span className="text-[11px] font-mono text-stone-400 mr-1">
                        0{idx + 1}
                      </span>
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Editorial Columns */}
              <div
                className={`grid gap-8 ${
                  viewportMode === 'mobile'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-3'
                }`}
              >
                {venues.map((venue, index) => (
                  <article
                    key={venue.id}
                    className="flex flex-col border-b border-stone-300 pb-6 group"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-mono">
                      <span>SEÇKİ NO. 0{index + 1}</span>
                      <span>{venue.neighborhood}</span>
                    </div>

                    <div className="relative w-full h-56 mb-4 overflow-hidden bg-stone-200">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover grayscale-[12%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {venue.isDemo && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-200 text-stone-900 text-[10px] font-bold tracking-wider uppercase">
                          DEMO
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 bg-red-900 text-white px-3 py-1 text-[11px] font-semibold tracking-wider uppercase">
                        Editörün Seçimi · {venue.priceTier}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <h4 className="font-serif text-2xl text-stone-950 group-hover:text-red-900 transition-colors">
                        {venue.name}
                      </h4>
                      {venue.verifiedRating && (
                        <span className="text-xs font-bold text-stone-800 shrink-0 border border-stone-400 px-2 py-0.5 rounded-full">
                          ★ {venue.verifiedRating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <p className="text-stone-700 text-sm leading-relaxed mb-4 flex-1">
                      {venue.editorialDescription}
                    </p>

                    <div className="border-t border-stone-200 pt-3 mb-4">
                      <div className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
                        İmza Tabak
                      </div>
                      <div className="font-serif italic text-sm text-stone-900 mt-0.5">
                        “{venue.signatureDish}”
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectVenue(venue, design)}
                      className="inline-flex items-center justify-between text-xs uppercase tracking-[0.15em] font-bold text-red-900 hover:text-stone-950 pt-2 transition-colors"
                    >
                      <span>Detayları Gör & Rehber Notu</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESIGN 4: BÜYÜK GÖRSELLİ KARTLAR (Immersive Photography Hierarchy)
           ===================================================================== */}
        {design.number === 4 && (
          <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-800">
            <div className="p-5 sm:p-8 lg:p-10 space-y-7">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                    Görsel Keşif Modu · {region.name}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    Yakında Ne Yenir?
                  </h3>
                </div>

                {/* Translucent Dark Pill Filters */}
                <div className="flex flex-wrap gap-2">
                  {region.categories.slice(0, 7).map((category) => {
                    const isActive = activeCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25'
                            : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tall Full-Bleed Visual Cards */}
              <div
                className={`grid gap-6 ${
                  viewportMode === 'mobile'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {venues.map((venue) => (
                  <div
                    key={venue.id}
                    onClick={() => onSelectVenue(venue, design)}
                    className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-sky-400/70 transition-all shadow-lg"
                  >
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/10" />

                    {/* Top Floating Glass Bar */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-950/75 text-white backdrop-blur-md border border-white/15">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        {venue.neighborhood}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {venue.isDemo && (
                          <span className="px-2 py-1 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
                            DEMO
                          </span>
                        )}
                        {venue.verifiedRating && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-white backdrop-blur-md border border-white/15">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {venue.verifiedRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Scrim Content */}
                    <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300 mb-1">
                        <Utensils className="w-3.5 h-3.5" />
                        {venue.signatureDish}
                      </span>
                      <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                        {venue.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 mb-4">
                        {venue.editorialDescription}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-white/15">
                        <span className="text-xs text-slate-300">
                          {venue.distanceText} · {venue.priceTier}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectVenue(venue, design);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-sky-500 hover:text-slate-950 text-white text-xs font-bold backdrop-blur-md transition-colors"
                        >
                          <span>Detayları Gör</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESIGN 5: KOMPAKT LİSTE (High-Density Less-Scrolling Modern List)
           ===================================================================== */}
        {design.number === 5 && (
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Yakında Ne Yenir? · Hızlı Karşılaştırma Listesi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Minimum kaydırma ile {region.name} bölgesindeki işletmeleri tek bakışta tarayın.
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full self-start sm:self-center">
                  {venues.length} İşletme Listeleniyor
                </span>
              </div>

              {/* Compact Horizontal Category Bar */}
              <div className="flex flex-wrap gap-2">
                {region.categories.slice(0, 7).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* High-Density 2-Column List Grid */}
              <div
                className={`grid gap-3.5 ${
                  viewportMode === 'mobile'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 lg:grid-cols-2'
                }`}
              >
                {venues.map((venue, idx) => (
                  <div
                    key={venue.id}
                    className="group p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex items-start gap-3.5"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                      <span className="absolute top-1 left-1 w-5 h-5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                              {venue.name}
                            </h4>
                            {venue.isDemo && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                                DEMO
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>{venue.neighborhood}</span>
                            <span>·</span>
                            <span>{venue.priceTier}</span>
                          </div>
                        </div>

                        {venue.verifiedRating && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 text-xs font-bold shrink-0">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            {venue.verifiedRating.toFixed(1)}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1 mt-1.5">
                        {venue.editorialDescription}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-medium text-blue-700 truncate">
                          🍽️ {venue.signatureDish}
                        </span>
                        <button
                          type="button"
                          onClick={() => onSelectVenue(venue, design)}
                          className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                        >
                          <span>Detayları Gör</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESIGN 6: HARİTA + KARTLAR (Interactive Map + Venue Discovery Split)
           ===================================================================== */}
        {design.number === 6 && (
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    <Navigation className="w-3.5 h-3.5" />
                    Konum & Mesafe Odaklı Keşif
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Yakında Ne Yenir? ({region.cityLabel} Haritası)
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {region.categories.slice(0, 7).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        activeCategory === category
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split View: Cards Left, Interactive Neighborhood Map Right */}
              <div
                className={`grid gap-6 ${
                  viewportMode === 'mobile'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 lg:grid-cols-12'
                }`}
              >
                {/* Interactive Radar Map Canvas */}
                <div
                  className={`${
                    viewportMode === 'mobile' ? '' : 'lg:col-span-5 lg:order-2'
                  }`}
                >
                  <div className="relative h-80 sm:h-96 lg:h-full min-h-[360px] rounded-2xl overflow-hidden border border-blue-200 bg-gradient-to-br from-sky-50 via-blue-50/70 to-indigo-50 p-4 flex flex-col justify-between">
                    {/* Stylized Cartographic Grid & Water/Roads SVG */}
                    <svg
                      className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
                      viewBox="0 0 400 400"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <pattern
                          id={`grid-${region.id}`}
                          width="40"
                          height="40"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="#93c5fd"
                            strokeWidth="0.8"
                          />
                        </pattern>
                      </defs>
                      <rect width="400" height="400" fill={`url(#grid-${region.id})`} />
                      <path
                        d="M 0 280 Q 140 240 260 310 T 400 290 L 400 400 L 0 400 Z"
                        fill="#bae6fd"
                      />
                      <path
                        d="M 40 0 Q 180 150 350 380"
                        stroke="#60a5fa"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                        fill="none"
                      />
                    </svg>

                    {/* Map Top Bar */}
                    <div className="relative z-10 flex items-center justify-between gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-blue-100 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Compass className="w-4 h-4 text-blue-600" />
                        <span>{region.name} Canlı Pin Haritası</span>
                      </div>
                      <span className="text-[11px] text-blue-700 font-semibold">
                        Pine Tıklayın
                      </span>
                    </div>

                    {/* Interactive Venue Pins */}
                    <div className="relative z-10 flex-1 my-2">
                      {venues.map((venue, idx) => {
                        const isSelected = activeMapVenue?.id === venue.id;
                        return (
                          <button
                            key={venue.id}
                            type="button"
                            onClick={() => setSelectedMapVenueId(venue.id)}
                            style={{
                              left: `${venue.mapPosition.x}%`,
                              top: `${venue.mapPosition.y}%`
                            }}
                            className={` -translate-x-1/2 -translate-y-1/2 absolute transition-all duration-200 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold shadow-md ${
                              isSelected
                                ? 'bg-blue-600 text-white scale-110 z-20 ring-4 ring-blue-300/70'
                                : 'bg-white text-slate-800 hover:bg-blue-50 border border-slate-300 z-10'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-900/15 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="max-w-[110px] truncate">
                              {venue.name.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Pin Preview Card Inside Map */}
                    {activeMapVenue && (
                      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-blue-200 shadow-lg flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">
                              {activeMapVenue.neighborhood} · {activeMapVenue.distanceText}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                            {activeMapVenue.name}
                          </h5>
                          <p className="text-xs text-slate-600 truncate">
                            Öneri: {activeMapVenue.signatureDish}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectVenue(activeMapVenue, design)}
                          className="shrink-0 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                        >
                          Detayları Gör
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cards Column */}
                <div
                  className={`${
                    viewportMode === 'mobile' ? '' : 'lg:col-span-7 lg:order-1'
                  } grid grid-cols-1 sm:grid-cols-2 gap-4`}
                >
                  {venues.map((venue, idx) => {
                    const isSelected = activeMapVenue?.id === venue.id;
                    return (
                      <div
                        key={venue.id}
                        onMouseEnter={() => setSelectedMapVenueId(venue.id)}
                        onClick={() => setSelectedMapVenueId(venue.id)}
                        className={`rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/30 shadow-md ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                              <Image
                                src={venue.image}
                                alt={venue.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                              <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-slate-900 text-sm truncate">
                                  {venue.name}
                                </h4>
                                {venue.isDemo && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                    DEMO
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 truncate mt-0.5">
                                {venue.neighborhood}
                              </p>
                              <p className="text-[11px] text-blue-700 font-medium mt-0.5">
                                {venue.distanceText}
                              </p>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                            {venue.editorialDescription}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                          {venue.verifiedRating ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              {venue.verifiedRating.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">DEMO</span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectVenue(venue, design);
                            }}
                            className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Detayları Gör</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESIGN 7: NE YEMELİ ODAKLI (Signature Dish First Discovery)
           ===================================================================== */}
        {design.number === 7 && (
          <div className="bg-gradient-to-b from-amber-50/40 via-white to-white border border-amber-200/80 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-8 lg:p-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    İmza Lezzet Odaklı Keşif · Önce Tabağı Seçin
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {region.cityLabel}’da Bugün Ne Yemeli?
                  </h3>
                </div>
                <p className="text-xs text-slate-600 max-w-sm">
                  Bu tasarımda işletme adından önce o mekanda mutlaka sipariş edilmesi gereken özel yiyecek/içecek başroldedir.
                </p>
              </div>

              {/* Dish-focused Category Pills */}
              <div className="flex flex-wrap gap-2.5">
                {region.categories.slice(0, 7).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                      activeCategory === category
                        ? 'bg-slate-900 text-amber-300 shadow-md'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Signature-Dish-First Cards */}
              <div
                className={`grid gap-6 ${
                  viewportMode === 'mobile'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {venues.map((venue) => (
                  <div
                    key={venue.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
                  >
                    <div className="relative h-48 w-full bg-slate-100">
                      <Image
                        src={venue.image}
                        alt={venue.signatureDish}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                        İmza Sipariş
                      </div>
                      {venue.isDemo && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-900/90 text-amber-300 text-[10px] font-bold">
                          DEMO
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      {/* HERO IS THE DISH */}
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                        Ne Sipariş Etmeli?
                      </div>
                      <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug mb-2">
                        {venue.signatureDish}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                        {venue.signatureDishDetail}
                      </p>

                      {/* Venue Attribution Box */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold uppercase text-slate-400">
                            Nerede Yenir?
                          </div>
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {venue.name}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {venue.neighborhood}
                          </div>
                        </div>

                        {venue.verifiedRating && (
                          <div className="shrink-0 text-right">
                            <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              {venue.verifiedRating.toFixed(1)}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectVenue(venue, design)}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Detayları Gör & Mekan Rehberi</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESIGN 8: YEREL HİKÂYE (Regional Culinary Culture & Storytelling)
           ===================================================================== */}
        {design.number === 8 && (
          <div className="bg-[#F7F6F2] border border-stone-300 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-8 lg:p-10 space-y-7">
              {/* Cultural Manifesto Banner */}
              <div className="rounded-2xl bg-stone-900 text-stone-100 p-6 sm:p-8 relative overflow-hidden">
                <div className="max-w-3xl space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                    <BookOpen className="w-4 h-4" />
                    Yerel Mutfak Hafızası · {region.name}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Yakında Ne Yenir? — {region.cityLabel} Gastronomi Hikâyesi
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pt-1">
                    {region.culturalIntro}
                  </p>
                </div>
              </div>

              {/* Category Chapters */}
              <div className="flex flex-wrap gap-2">
                {region.categories.slice(0, 7).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      activeCategory === category
                        ? 'bg-stone-900 text-amber-200 shadow-sm'
                        : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Narrative Story Cards */}
              <div
                className={`grid gap-6 ${
                  viewportMode === 'mobile'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-3'
                }`}
              >
                {venues.map((venue) => (
                  <article
                    key={venue.id}
                    className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-3">
                        <span className="font-semibold text-stone-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-700" />
                          {venue.neighborhood}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] bg-stone-100 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          {venue.bestTime}
                        </span>
                      </div>

                      <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 bg-stone-100">
                        <Image
                          src={venue.image}
                          alt={venue.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {venue.isDemo && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-300 text-stone-950 text-[10px] font-bold">
                            DEMO
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-xl font-bold text-stone-900 mb-2">
                        {venue.name}
                      </h4>

                      {/* Local Heritage Pull-Quote */}
                      <blockquote className="border-l-2 border-amber-700 pl-3 py-1 mb-3 text-xs italic text-stone-700 bg-amber-50/50 rounded-r-lg">
                        “{venue.localHeritageNote}”
                      </blockquote>

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4 line-clamp-3">
                        {venue.editorialDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                      {venue.verifiedRating && (
                        <span className="text-xs font-bold text-stone-800 inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {venue.verifiedRating.toFixed(1)} ({venue.reviewCount})
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectVenue(venue, design)}
                        className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Hikâyeyi & Detayları Gör</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESIGN 9: MINIMAL & ELEGANT (Ultra-Clean Swiss Typographic Grid)
           ===================================================================== */}
        {design.number === 9 && (
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 sm:p-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-slate-900 pb-5">
                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-950">
                  Yakında Ne Yenir <span className="font-semibold">— {region.cityLabel}</span>
                </h3>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Minimal Seçki · 01—0{venues.length}
                </span>
              </div>

              {/* Ultra-clean Minimalist Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {region.categories.slice(0, 7).map((category) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`px-3.5 py-1.5 text-xs tracking-wide uppercase transition-all border ${
                        isActive
                          ? 'bg-slate-950 text-white border-slate-950 font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-900'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Hairline Architectural Grid */}
              <div
                className={`grid border-t border-l border-slate-200 ${
                  viewportMode === 'mobile'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-3'
                }`}
              >
                {venues.map((venue, index) => (
                  <div
                    key={venue.id}
                    className="p-5 sm:p-6 border-r border-b border-slate-200 flex flex-col justify-between hover:bg-slate-50/70 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-4">
                        <span>0{index + 1} / {venue.priceTier}</span>
                        <span>
                          {venue.isDemo ? 'DEMO VERİ' : `★ ${venue.verifiedRating?.toFixed(1)}`}
                        </span>
                      </div>

                      <div className="relative h-40 w-full mb-5 overflow-hidden bg-slate-100">
                        <Image
                          src={venue.image}
                          alt={venue.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      <div className="text-[11px] uppercase tracking-wider text-blue-600 font-semibold mb-1">
                        {venue.neighborhood}
                      </div>
                      <h4 className="text-xl font-semibold text-slate-950 tracking-tight mb-2">
                        {venue.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 line-clamp-3">
                        {venue.editorialDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Öneri</span>
                        <span className="font-medium text-slate-900 truncate max-w-[190px]">
                          {venue.signatureDish}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectVenue(venue, design)}
                        className="w-full py-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white text-xs uppercase tracking-widest font-semibold transition-colors"
                      >
                        Detayları Gör
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            DESIGN 10: MOBILE FIRST (Thumb-Zone Ergonomics + Modern App Experience)
           ===================================================================== */}
        {design.number === 10 && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-8 space-y-5">
              {/* App-like Sticky Header */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{region.name} · Mobil Öncelikli Rehber</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                    Yakında Ne Yenir?
                  </h3>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold shrink-0">
                  {venues.length} Nokta
                </span>
              </div>

              {/* Horizontal Thumb-Scroll Category Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {region.categories.slice(0, 7).map((category) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Mobile-First Touch Cards (Works on both Mobile & Desktop Bento) */}
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
                    className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div className="flex gap-3.5">
                      <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={venue.image}
                          alt={venue.name}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                        {venue.verifiedRating && (
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/85 text-white text-[11px] font-bold inline-flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {venue.verifiedRating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-semibold text-blue-600 truncate">
                              {venue.neighborhood}
                            </span>
                            {venue.isDemo && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                                DEMO
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-extrabold text-slate-900 truncate mt-0.5">
                            {venue.name}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                            {venue.editorialDescription}
                          </p>
                        </div>

                        <div className="text-[11px] text-slate-500 font-medium truncate">
                          🕒 {venue.bestTime} · {venue.priceTier}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Thumb-Zone Action Strip */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">
                          Ne Sipariş Etmeli?
                        </div>
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {venue.signatureDish}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectVenue(venue, design)}
                        className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 active:scale-95 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Detayları Gör
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
