'use client';

import Image from 'next/image';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Search, 
  Sparkles, 
  ChevronRight,
  Info
} from 'lucide-react';

import { FoodLocation, VisitorFoodVenue as FoodVenue, VisitorFoodDiscovery } from '@/lib/food/types';
import { createRealFoodProvider } from '@/lib/food/realProvider';
import { FOOD_DISCOVERY } from '@/lib/food/config';
import { GastronomyHeader } from './GastronomyHeader';
import { CategoryBar } from './CategoryBar';
import { LocationPickerModal } from './LocationPickerModal';

import { PremiumRestaurantCard } from '@/components/nearby-places/PremiumRestaurantCard';
import { VariantABottomSheet } from '@/components/mobile-detail-variants/VariantABottomSheet';

const REGION_CURATED_CARDS: Record<string, {image:string;badge:string;headline:string;vibe:string}> = {
  'moda-kadikoy': {
    image: '/images/gastronomy/coffee-pour-over.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Moda, Kadıköy',
    vibe: 'Nitelikli kahve, ekşi maya fırınlar, odun fırını pizzacılar ve mahalle mutfağı',
  },
  'carsi-osmanaga-kadikoy': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kadıköy, İstanbul',
    vibe: 'Tarihi Çarşı, Bahariye, Osmanağa ve Yoğurtçu Parkı hattında köklü klasikler ve seçkin duraklar',
  },
  'yeldegirmeni-kadikoy': {
    image: '/images/gastronomy/pizza.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Yeldeğirmeni, Kadıköy',
    vibe: 'Tarihi apartman sokaklarında Napoli pizzacıları, kurukahveci ve esnaf lokantaları',
  },
  'caddebostan-kadikoy': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Caddebostan, Kadıköy',
    vibe: 'Sahil yürüyüş hattında artizan gelato, şef bistroları ve butik burger durakları',
  },
  'suadiye-kadikoy': {
    image: '/images/gastronomy/breakfast.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Suadiye, Kadıköy',
    vibe: 'Şaşkınbakkal’dan Suadiye’ye akşam brasserie’leri, Napoli pizzaları ve profiterol klasikleri',
  },
  'bostanci-kadikoy': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Bostancı, Kadıköy',
    vibe: 'İskele ve Koy Yolu’ndaki köklü balıkçılardan Çatalçeşme bistrolarına, Vukela esnaf lokantalarından gece kokoreç ritüellerine uzanan seçki',
  },
  'kusadasi-aydin': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kuşadası · Merkez, Davutlar & Güzelçamlı',
    vibe: 'Merkez, Çarşı ve Setur Marina’dan Kirazlı, Caferli, Yaylaköy, Davutlar ve Güzelçamlı sahiline uzanan seçki',
  },
  'gaziantep-merkez': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Yöresel Miras Seçkisi',
    headline: 'Gaziantep · Şahinbey & Şehitkamil',
    vibe: 'Tarihi hanlar ve Kalealtı çarşılarından Gazimuhtar ile İbrahimli’ye uzanan küşleme, sabah beyranı, taş fırın baklava ve katmer durakları',
  },
  'kaleici-muratpasa-antalya': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kaleiçi & Merkez, Antalya',
    vibe: 'Tarihi Kaleiçi, eski çarşı ve Işıklar hattından Aksu rotasına uzanan tahinli piyaz, şiş köfte, yaprak döner ve akşam sofraları',
  },
  'lara-muratpasa-antalya': {
    image: '/images/gastronomy/pizza.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Lara, Antalya',
    vibe: 'Şirinyalı, Fener ve Güzeloba hattında falez restoranları, odun fırını pizzacılar, gurme burgerciler ve taş fırın lahmacun durakları',
  },
  'konyaalti-antalya': {
    image: '/images/gastronomy/coffee-pour-over.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Konyaaltı, Antalya',
    vibe: 'Atatürk Kültür Parkı ve sahil şeridinden Gürsu, Liman ve Çakırlar’a uzanan özel gün klasikleri, kruvasan-pastane durakları ve odun ateşi pideler',
  },
  'akyaka-ula-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Akyaka, Muğla',
    vibe: 'Kadın Azmağı kıyısındaki su üstü balıkçılardan Akyaka sokaklarına, Akçapınar tost ritüeline ve Gökova kahvaltı duraklarına uzanan seçki',
  },
};

function formatLocationCategoryHeading(locative: string, categoryTitle?: string): string {
  const cleanLocative = locative.trim();
  const cleanTitle = (categoryTitle || 'Mekanlar').trim();
  if (cleanTitle.toLocaleLowerCase('tr').startsWith(cleanLocative.toLocaleLowerCase('tr'))) {
    const remainder = cleanTitle.slice(cleanLocative.length).trim();
    return remainder ? `${cleanLocative} ${remainder}` : cleanLocative;
  }
  return `${cleanLocative} ${cleanTitle}`;
}

interface GastronomyPageClientProps {
  discovery: VisitorFoodDiscovery;
  initialLocationSlug?: string;
  initialCategorySlug?: string;
  lang?: 'tr' | 'en';
  embedded?: boolean;
}

export function GastronomyPageClient({
  discovery,
  initialLocationSlug,
  initialCategorySlug,
  lang = 'tr',
  embedded = false,
}: GastronomyPageClientProps) {
  const router = useRouter();
  const foodDiscoveryProvider = useMemo(() => createRealFoodProvider(discovery), [discovery]);
  const searchParams = useSearchParams();

  // 1. Seçili Bölge Durumu
  const [selectedLocation, setSelectedLocation] = useState<FoodLocation | null>(() => {
    if (initialLocationSlug) {
      const match = foodDiscoveryProvider.getLocationBySlug(initialLocationSlug);
      if (match) return match;
    }
    return null;
  });

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(() => {
    if (selectedLocation) {
      const cats = foodDiscoveryProvider.getRegionCategories(selectedLocation.id);
      if (initialCategorySlug && cats.some((c) => c.slug === initialCategorySlug)) {
        return initialCategorySlug;
      }
      return cats[0]?.slug || 'kahve';
    }
    return initialCategorySlug || 'kahve';
  });

  const [activeVenueForModal, setActiveVenueForModal] = useState<FoodVenue | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // URL is the single source of truth, including Back/Forward and invalid scopes.
  const regionParam = searchParams.get('region') || initialLocationSlug;
  const categoryParam = searchParams.get('category') || initialCategorySlug;
  useEffect(() => {
    const location = regionParam ? foodDiscoveryProvider.getLocationBySlug(regionParam) || null : null;
    setSelectedLocation(location);
    setSelectedCategorySlug(categoryParam || (location ? foodDiscoveryProvider.getRegionCategories(location.id)[0]?.slug || '' : ''));
    setActiveVenueForModal(null);
  }, [regionParam, categoryParam, foodDiscoveryProvider]);

  // Konum seçimi değiştiğinde
  const handleSelectLocation = useCallback(
    (loc: FoodLocation) => {
      try {
        localStorage.setItem(FOOD_DISCOVERY.storage.lastRegionKey, loc.slug);
      } catch {}

      if (!selectedLocation || loc.id !== selectedLocation.id) {
        router.push(`/${lang}?region=${loc.slug}`);
        return;
      }

      setSelectedLocation(loc);

      // Yeni bölgenin kategorilerini al
      const newCats = foodDiscoveryProvider.getRegionCategories(loc.id);

      // Kural: Eski kategorinin karşılığı yeni bölgede varsa koru, yoksa ilk kategoriye geç
      let nextCategorySlug = newCats[0]?.slug || '';
      if (newCats.some((c) => c.slug === selectedCategorySlug)) {
        nextCategorySlug = selectedCategorySlug;
      }

      setSelectedCategorySlug(nextCategorySlug);

      // URL senkronizasyonu ve sunucu tarafı bölge yüklemesi
      const newUrl = `/${lang}?region=${loc.slug}&category=${nextCategorySlug}`;
      router.push(newUrl);
    },
    [lang, selectedLocation, selectedCategorySlug, foodDiscoveryProvider, router]
  );

  // Kategori seçimi değiştiğinde
  const handleSelectCategory = useCallback(
    (catSlug: string) => {
      setSelectedCategorySlug(catSlug);
      if (selectedLocation) {
        const newUrl = `/${lang}?region=${selectedLocation.slug}&category=${catSlug}`;
        window.history.pushState(null,'',newUrl);
      }
    },
    [lang, selectedLocation, router]
  );

  // Seçili bölgenin dinamik kategorileri
  const currentCategories = useMemo(() => {
    if (!selectedLocation) return [];
    return foodDiscoveryProvider.getRegionCategories(selectedLocation.id);
  }, [selectedLocation, foodDiscoveryProvider]);

  // Seçili kategoriye ait mekan sonuçları
  const categoryResult = useMemo(() => {
    if (!selectedLocation) return undefined;
    return foodDiscoveryProvider.getCategoryResult(selectedLocation.id, selectedCategorySlug);
  }, [selectedLocation, selectedCategorySlug, foodDiscoveryProvider]);

  // Hazır tüm bölgeler
  const readyRegions = useMemo(() => {
    return foodDiscoveryProvider.getReadyRegions();
  }, [foodDiscoveryProvider]);

  return (
    <div className={embedded ? "w-full bg-[#fafbfc] text-slate-900 flex flex-col font-sans antialiased" : "min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans antialiased"}>
      {/* 1. ORTAK HEADER */}
      <GastronomyHeader
        currentLocation={selectedLocation}
        onOpenLocationPicker={() => setIsLocationModalOpen(true)}
        lang={lang}
      />

      {/* ANA İÇERİK — ORİJİNAL TAM GENİŞLİK / MAX-W-2XL DÜZENİ */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-3 sm:py-5">
        {/* KOMPAKT SEKME (TAB) GEÇİŞİ: OTELLER / GASTRONOMİ KEŞFİ */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center p-1 rounded-full bg-slate-200/70 border border-slate-200/90 shadow-2xs">
            <a
              href={`/${lang}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm transition-all"
            >
              <span>🏨</span>
              <span>{lang === 'tr' ? 'Oteller' : 'Hotels'}</span>
            </a>
            <a
              href={`/${lang}?view=gastronomi`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-slate-950 font-bold text-xs sm:text-sm shadow-xs border border-slate-200/70 transition-all"
            >
              <span>🍽️</span>
              <span>{lang === 'tr' ? 'Gastronomi Keşfi' : 'Gastronomy Discovery'}</span>
            </a>
          </div>
        </div>
        {/* =================================================================== */}
        {/* 1. DURUM: KONUM HENÜZ SEÇİLMEDİ (YENİ MODERN HERO & KONUM SEÇİMİ)   */}
        {/* =================================================================== */}
        {regionParam && !selectedLocation ? (
          <div className="py-12 text-center"><h1 className="text-xl font-bold">Bu konum için rehber henüz hazır değil.</h1><button className="mt-4 text-blue-600" onClick={()=>router.push(`/${lang}`)}>Konum seçimine dön</button></div>
        ) : !selectedLocation ? (
          <div className="pt-2 sm:pt-4 pb-12 max-w-xl mx-auto">
            {/* BAŞLIK & METİN — İKONSUZ, HEADER'IN DİREKT BİR TIK ALTINDA */}
            <div className="text-center pt-2 sm:pt-4 pb-1">
              <h1 className="text-3xl sm:text-4xl md:text-[44px] font-black tracking-tight text-slate-950 uppercase leading-none">
                CANIN NE ÇEKİYOR?
              </h1>
              <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed mt-3 max-w-md mx-auto">
                Konum seç! Kahvecileri, yemek mekanlarını ve yerel deneyimleri keşfet.
              </p>
            </div>

            {/* ŞIK & MODERN KONUM SEÇ ÇUBUĞU (ÖZEL HAP TASARIMI) */}
            <div className="mt-6 mb-3">
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="w-full flex items-center justify-between gap-3 p-2.5 sm:p-3 bg-white hover:bg-slate-50/90 active:bg-slate-100 border border-slate-200/90 hover:border-blue-400 rounded-full shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.15)] transition-all duration-200 group active:scale-[0.99] text-left"
              >
                <div className="flex items-center gap-3 pl-1 sm:pl-1.5 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                    <Search size={19} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-tight">
                      Konum Seç
                    </div>
                    <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      Akyaka · Antalya · Gaziantep · Kuşadası · Kadıköy · Moda · Yeldeğirmeni · Caddebostan · Suadiye · Bostancı
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 group-hover:bg-blue-600 px-4 py-2.5 rounded-full transition-colors duration-200 flex-shrink-0 mr-1 shadow-xs">
                  <span>Keşfet</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            </div>

            {/* POPÜLER HIZLI SEÇİM ÇİPLERİ */}
            <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-0.5">
                Hızlı Keşif:
              </span>
              {readyRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleSelectLocation(region)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all active:scale-95"
                >
                  <MapPin size={11} className="text-blue-600" />
                  <span>{region.name}</span>
                </button>
              ))}
            </div>

            {/* ÖRNEK KEŞİF BÖLGELERİ — ZENGİN GÖRSEL DERGİ KARTLARI (CERCEVELİ BASİT YAPILAR YERİNE) */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Öne Çıkan Keşif Bölgeleri
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {readyRegions.length} Bölge Hazır
                </span>
              </div>

              <div className="space-y-4">
                {readyRegions.map((region) => {
                  const curated = REGION_CURATED_CARDS[region.id] || {
                    image: '/images/gastronomy/coffee-pour-over.svg',
                    badge: 'Temsili görsel',
                    headline: region.name,
                    vibe: region.characterSubtitle || region.scopeNote || 'Yerel mekanlar ve lezzetler',
                  };

                  return (
                    <div
                      key={region.id}
                      onClick={() => handleSelectLocation(region)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectLocation(region);
                        }
                      }}
                      className="group relative w-full h-44 sm:h-48 rounded-3xl overflow-hidden cursor-pointer shadow-[0_6px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.22)] border border-slate-200/80 transition-all duration-300 active:scale-[0.99] select-none"
                    >
                      {/* Arka Plan Görseli */}
                      <Image
                        src={curated.image}
                        alt="Kahve kategorisi için temsili illüstrasyon"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        fill
                        sizes="(max-width: 640px) 100vw, 640px"
                        priority
                        fetchPriority="high"
                      />

                      {/* Çok Katmanlı Karartma Gradyanı */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-black/25 group-hover:from-slate-950 transition-colors" />

                      {/* Kart İçi İçerik */}
                      <div className="relative h-full p-4 sm:p-5 flex flex-col justify-between">
                        {/* Üst Bar: Rozet ve Ok Butonu */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/25">
                            {curated.badge}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors">
                            <ChevronRight size={16} />
                          </div>
                        </div>

                        {/* Alt Alan: Şehir/Semt Başlığı ve Vibe Açıklaması */}
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug group-hover:text-blue-200 transition-colors">
                            {curated.headline}
                          </h2>
                          <p className="text-xs sm:text-[13px] text-slate-200 font-medium line-clamp-2 mt-1 leading-relaxed">
                            {curated.vibe}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-300 mt-2 group-hover:translate-x-1 transition-transform">
                            <span>Rehberi Keşfet</span>
                            <ChevronRight size={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* 2. DURUM: BÖLGE SEÇİLDİ (GASTRONOMİ LİSTELEME AKIŞI)                */
          /* =================================================================== */
          <div className="pt-1">
            {/* 1. BAŞLIK & AÇIKLAMA (MOCKUP İLE BİREBİR AYNI DİZİLİM) */}
            <div className="pt-1 pb-4 sm:pb-5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2 sm:gap-2.5 leading-tight">
                <span className="text-2xl sm:text-3xl leading-none">{categoryResult?.category.emoji || '🍽️'}</span>
                <span>{formatLocationCategoryHeading(selectedLocation.locative, categoryResult?.category.title)}</span>
              </h1>
              {selectedLocation.characterSubtitle && (
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                  {selectedLocation.characterSubtitle}
                </p>
              )}
            </div>

            {/* 2. 3 SÜTUNLU KATEGORİ IZGARASI (MOCKUPTAKİ 3x2 DÜZENİ) */}
            {currentCategories.length > 0 && (
              <div className="mb-6 sm:mb-7">
                <CategoryBar
                  categories={currentCategories}
                  activeCategorySlug={selectedCategorySlug}
                  onSelectCategory={handleSelectCategory}
                />
              </div>
            )}

            {/* 3. MEKAN KARTLARI LİSTESİ (ORİJİNAL TAM BOY KART DÜZENİ) */}
            {categoryResult && categoryResult.coreVenues.length > 0 ? (
              <div className="space-y-6 sm:space-y-7">
                <div className="grid grid-cols-1 gap-5 sm:gap-6">
                  {categoryResult.coreVenues.map((venue,index) => (
                    <PremiumRestaurantCard
                      key={venue.id}
                      restaurant={venue}
                      priority={index<2}
                      onViewDetails={() => setActiveVenueForModal(venue)}
                      lang={lang}
                    />
                  ))}
                </div>

                {categoryResult.nearbyVenues && categoryResult.nearbyVenues.length > 0 && (
                  <section
                    aria-labelledby="nearby-suggestions-heading"
                    className="pt-6 sm:pt-8 border-t border-slate-200/80 space-y-4"
                    style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 640px' }}
                  >
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                        <MapPin size={12} className="text-blue-600" />
                        <span>KOMŞU SINIR · EN FAZLA 400 METRE</span>
                      </div>
                      <h2
                        id="nearby-suggestions-heading"
                        className="text-lg sm:text-xl font-black text-slate-950 tracking-tight"
                      >
                        Çok Yakındaki Diğer Öneri
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                        {selectedLocation.name} sınırının hemen dışında, yürüme mesafesindeki (maks. 400 m) tek komşu{' '}
                        {categoryResult.category.label.toLocaleLowerCase('tr')} önerisi
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:gap-6">
                      {categoryResult.nearbyVenues.map((venue) => (
                        <PremiumRestaurantCard
                          key={`nearby-${venue.id}`}
                          restaurant={venue}
                          priority={false}
                          onViewDetails={() => setActiveVenueForModal(venue)}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </section>
                )}

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs font-medium bg-white rounded-2xl border border-dashed border-slate-200">
                Bu kategoride bölgede henüz doğrulanmış mekan bulunmuyor.
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. KONUM SEÇİCİ MODAL */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleSelectLocation}
        provider={foodDiscoveryProvider}
        currentLocationId={selectedLocation?.id}
      />

      {/* 4. ONAYLANAN TASARIM A: PREMİUM BOTTOM SHEET DETAY EKRANI */}
      {activeVenueForModal && (
        <VariantABottomSheet
          restaurant={activeVenueForModal}
          onClose={() => setActiveVenueForModal(null)}
          lang={lang}
        />
      )}

      {/* ALT BİLGİ / FOOTER */}
      {!embedded && (
        <footer className="mt-auto border-t border-slate-200/70 bg-white py-6 px-4 text-center text-slate-500 text-xs select-none">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-1 font-bold text-slate-700">
              <span>YERİNİ AYIR</span>
              <span className="text-blue-600">·</span>
              <span className="font-normal text-slate-500">Gastronomi Keşif Platformu</span>
            </div>
            <div>
              {selectedLocation ? `${selectedLocation.displayName} Rehberi` : 'Doğrulanmış Yerel Gastronomi Rehberi'}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
