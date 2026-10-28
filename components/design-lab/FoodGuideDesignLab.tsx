'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Smartphone,
  Monitor,
  Heart,
  Check,
  Copy,
  MapPin,
  ShieldCheck,
  FlaskConical,
  Layers
} from 'lucide-react';
import {
  DESIGN_VARIATIONS,
  REGION_FOOD_GUIDES,
  RegionFoodGuide,
  LabVenue,
  DesignMeta
} from '@/data/designLabFoodGuideData';
import { FoodGuideDesignSection } from './FoodGuideTenDesigns';
import { FoodGuideLabModal } from './FoodGuideLabModal';

export function FoodGuideDesignLab() {
  const [selectedRegionId, setSelectedRegionId] =
    useState<RegionFoodGuide['id']>('kadikoy');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [syncedCategory, setSyncedCategory] = useState<string | null>(
    'Mutlaka Denenmesi Gerekenler'
  );
  const [favoriteDesigns, setFavoriteDesigns] = useState<number[]>([]);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Active Details Modal State
  const [modalState, setModalState] = useState<{
    venue: LabVenue | null;
    design: DesignMeta | null;
  }>({ venue: null, design: null });

  const currentRegion = REGION_FOOD_GUIDES[selectedRegionId];

  // Load saved favorite design numbers from localStorage
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('yeriniayir_food_lab_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setFavoriteDesigns(parsed);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleFavoriteDesign = (designNumber: number) => {
    setFavoriteDesigns((prev) => {
      const next = prev.includes(designNumber)
        ? prev.filter((n) => n !== designNumber)
        : [...prev, designNumber].sort((a, b) => a - b);
      try {
        window.localStorage.setItem(
          'yeriniayir_food_lab_favorites',
          JSON.stringify(next)
        );
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const handleRegionChange = (regionId: RegionFoodGuide['id']) => {
    setSelectedRegionId(regionId);
    setSyncedCategory('Mutlaka Denenmesi Gerekenler');
  };

  const handleCopyFavoriteSummary = async () => {
    const selectedNames = favoriteDesigns
      .map((num) => {
        const found = DESIGN_VARIATIONS.find((d) => d.number === num);
        return found ? `#${found.number} ${found.name}` : `#${num}`;
      })
      .join(', ');

    const text =
      favoriteDesigns.length > 0
        ? `Yerini Ayır "Yakında Ne Yenir?" Favori Tasarım Seçimim: ${selectedNames}`
        : 'Henüz favori tasarım seçilmedi.';

    try {
      await navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-28">
      {/* Top Sticky Lab Control & Quick-Jump Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          {/* Row 1: Title, Region Switcher, Desktop/Mobile Viewport Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                10X
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                    YERİNİ AYIR — “Yakında Ne Yenir?” Tasarım Laboratuvarı
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    İzole Önizleme (Canlıya Dokunmaz)
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  10 farklı tasarımı alt alta karşılaştırın, kategorilere tıklayın, detay pencerelerini açın ve favorinizi seçin.
                </p>
              </div>
            </div>

            {/* Controls: Region Selector + Viewport Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Region Selector */}
              <div
                className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200"
                role="group"
                aria-label="Bölge Seçimi"
              >
                {(
                  [
                    { id: 'kadikoy', label: 'Kadıköy' },
                    { id: 'gaziantep', label: 'Gaziantep' },
                    { id: 'bodrum', label: 'Bodrum' },
                    { id: 'sapanca', label: 'Sapanca' }
                  ] as const
                ).map((reg) => {
                  const active = selectedRegionId === reg.id;
                  return (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => handleRegionChange(reg.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        active
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {reg.label}
                    </button>
                  );
                })}
              </div>

              {/* Desktop / Mobile Preview Frame Toggle */}
              <div
                className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200"
                role="group"
                aria-label="Görünüm Modu"
              >
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewportMode === 'desktop'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Masaüstü</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewportMode === 'mobile'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobil (390px)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Quick Jump Links to All 10 Designs */}
          <nav
            aria-label="10 Tasarıma Hızlı Geçiş"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-2"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              Hızlı Geçiş:
            </span>
            {DESIGN_VARIATIONS.map((d) => {
              const isFav = favoriteDesigns.includes(d.number);
              return (
                <a
                  key={d.id}
                  href={`#${d.id}`}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isFav
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200/80'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {d.number}
                  </span>
                  <span>{d.shortName}</span>
                  {isFav && (
                    <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Comparison Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">
        {/* Region & Category Rules Live Verification Banner */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <MapPin className="w-3.5 h-3.5" />
                  Aktif Test Bölgesi: {currentRegion.name}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  Kategori Sayısı: {currentRegion.categories.length} / Maksimum 7
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                  Doğrulanmamış Örnekler “DEMO” Rozetlidir
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 pt-1">
                {currentRegion.dateCategoryReason}
              </p>
            </div>

            {/* Optional: Sync Category Across All 10 Designs at Once */}
            <div className="shrink-0 flex flex-col sm:items-end gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                10 Tasarımda Ortak Kategori Seç (Veya Her Tasarımda Ayrı Tıklayın):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentRegion.categories.slice(0, 7).map((cat, idx) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSyncedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      syncedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {idx === 0 ? `★ ${cat}` : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* All 10 Designs Stacked Vertically (1 to 10) */}
        <div className="space-y-14">
          {DESIGN_VARIATIONS.map((design) => (
            <FoodGuideDesignSection
              key={design.id}
              design={design}
              region={currentRegion}
              syncedCategory={syncedCategory}
              onSelectVenue={(venue, d) => setModalState({ venue, design: d })}
              isFavorite={favoriteDesigns.includes(design.number)}
              onToggleFavorite={toggleFavoriteDesign}
              viewportMode={viewportMode}
            />
          ))}
        </div>
      </main>

      {/* Bottom Floating Favorite Picker & Quick Summary Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 text-white border-t border-slate-800 backdrop-blur-md px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs font-bold text-slate-300 shrink-0 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Favori Tasarımınızı Seçin:
            </span>
            {DESIGN_VARIATIONS.map((d) => {
              const selected = favoriteDesigns.includes(d.number);
              return (
                <button
                  key={d.number}
                  type="button"
                  onClick={() => toggleFavoriteDesign(d.number)}
                  className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all shrink-0 flex items-center justify-center border ${
                    selected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title={`Tasarım #${d.number}: ${d.name}`}
                >
                  {d.number}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="text-xs text-slate-300 hidden sm:block">
              {favoriteDesigns.length > 0 ? (
                <span>
                  Seçilen:{' '}
                  <strong className="text-amber-400">
                    {favoriteDesigns
                      .map((n) => {
                        const found = DESIGN_VARIATIONS.find((d) => d.number === n);
                        return found ? `#${n} ${found.shortName}` : `#${n}`;
                      })
                      .join(', ')}
                  </strong>
                </span>
              ) : (
                <span>Henüz favori numarası seçilmedi (1-10 arası tıklayın)</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopyFavoriteSummary}
              disabled={favoriteDesigns.length === 0}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                favoriteDesigns.length > 0
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Seçimi Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Shared Interactive Details Modal */}
      <FoodGuideLabModal
        venue={modalState.venue}
        designMeta={modalState.design}
        regionName={currentRegion.name}
        onClose={() => setModalState({ venue: null, design: null })}
      />
    </div>
  );
}
