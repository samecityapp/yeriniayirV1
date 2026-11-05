'use client';

import { useState } from 'react';
import Image from 'next/image';
import { NearbyGuide } from '@/components/hotel/NearbyGuide';
import { fethiyePlaces } from '@/data/fethiyePlaces';
import { Restaurant } from '@/lib/types';
import { getLocalizedText } from '@/lib/localization';
import {
  Star,
  Utensils,
  MessageSquare,
  MapPin,
  Smartphone,
  Monitor,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Coffee,
  Flame,
  Fish,
  Croissant,
  Beef,
  X,
  Check,
  ExternalLink,
} from 'lucide-react';

type DesignVariant = 'current' | 'editorial' | 'compact' | 'hotel-context';
type ViewportMode = 'desktop' | 'mobile';

const CATEGORY_ICONS: Record<string, any> = {
  'En İyi Kahve & Tatlı': Coffee,
  'En İyi Hamburger & Sokak Lezzetleri': Flame,
  'En İyi Serpme Kahvaltı': Croissant,
  'En İyi Balık & Meze': Fish,
  'En İyi Et & Kayaköy Kendin Pişir': Beef,
};

export default function FethiyeYemekRehberiDesignPage() {
  const [designVariant, setDesignVariant] = useState<DesignVariant>('current');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [activeCategory, setActiveCategory] = useState<string>(
    getLocalizedText(fethiyePlaces[0].title, 'tr')
  );
  const [expandedCardId, setExpandedCardId] = useState<string | null>('fethiye-coffee-1');
  const [drawerPlace, setDrawerPlace] = useState<Restaurant | null>(null);

  const currentCategoryObj = fethiyePlaces.find(
    (c) => getLocalizedText(c.title, 'tr') === activeCategory
  );
  const activePlaces = currentCategoryObj?.places || [];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 pb-24">
      {/* Top Sticky Studio Control Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                YA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-gray-900">
                    Yakında Ne Yenir? — UI/UX Stüdyosu
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    Fethiye (15 Mekan, 5 Kategori)
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  yeriniayir.com • Otel Detay Sayfası Yeme-İçme Rehberi Modülü
                </p>
              </div>
            </div>

            {/* Viewport Switcher (Mobile/Desktop) */}
            <div className="flex lg:hidden items-center bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewportMode === 'desktop' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                }`}
                title="Masaüstü Görünüm"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewportMode === 'mobile' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                }`}
                title="Mobil Simülasyon"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Design Variant Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => setDesignVariant('current')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  designVariant === 'current'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                1. Mevcut Tasarım
              </button>
              <button
                onClick={() => setDesignVariant('editorial')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  designVariant === 'editorial'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                2. Editorial Gurme Kartlar
              </button>
              <button
                onClick={() => setDesignVariant('compact')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  designVariant === 'compact'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                3. Kompakt Sıralı Liste
              </button>
              <button
                onClick={() => setDesignVariant('hotel-context')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  designVariant === 'hotel-context'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                4. Otel Sayfası İçinde Gör
              </button>
            </div>

            {/* Desktop Viewport Switcher */}
            <div className="hidden lg:flex items-center bg-gray-100 p-1 rounded-xl ml-2">
              <button
                onClick={() => setViewportMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewportMode === 'desktop'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Geniş Ekran
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewportMode === 'mobile'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobil (iPhone)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main
        className={`mx-auto transition-all duration-300 pt-8 px-4 ${
          viewportMode === 'mobile'
            ? 'max-w-[430px]'
            : designVariant === 'hotel-context'
            ? 'max-w-6xl'
            : 'max-w-5xl'
        }`}
      >
        {/* Mobile Frame Header indicator when in mobile simulation */}
        {viewportMode === 'mobile' && (
          <div className="mb-4 bg-gray-900 text-white text-xs py-2 px-4 rounded-full flex items-center justify-between shadow-md">
            <span className="font-semibold flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              iPhone 16 Pro Boyutu (390-430px)
            </span>
            <span className="text-gray-400">Tek El UX Testi</span>
          </div>
        )}

        {/* =========================================================
            VARIANT 1: MEVCUT ORİJİNAL TASARIM (NearbyGuide)
           ========================================================= */}
        {designVariant === 'current' && (
          <div className="space-y-4">
            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-blue-950">
                  Varyasyon #1: Mevcut `NearbyGuide` & `RestaurantCard` Tasarımı
                </h2>
                <p className="text-xs text-blue-800 mt-0.5">
                  Şu an `yeriniayirV1` içinde çalışan birebir bileşen. Kategoriler arası geçiş yapabilir ve{' '}
                  <strong>&ldquo;Detayları Gör&rdquo;</strong> butonuna tıklayarak pop-up modalı test edebilirsin.
                </p>
              </div>
            </div>

            <NearbyGuide
              location="Fethiye, Muğla"
              isMobile={viewportMode === 'mobile'}
              lang="tr"
            />
          </div>
        )}

        {/* =========================================================
            VARIANT 2: EDITORIAL GURME KARTLAR (YENİ NESİL UI/UX)
           ========================================================= */}
        {designVariant === 'editorial' && (
          <div className="space-y-4">
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4">
              <h2 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Varyasyon #2: Editorial Gurme Kartlar (Kart Üstü &ldquo;Ne Yemeli?&rdquo; + Açılır Müdavim Notları)
              </h2>
              <p className="text-xs text-amber-900 mt-0.5">
                Kullanıcıyı modal açmaya zorlamadan <strong>&ldquo;Ne Sipariş Etmeli?&rdquo;</strong> bilgisini doğrudan kartta gösterir. Görsel üstünde cam efektli puan rozeti, ikonlu kategori barı ve akordeon müdavim ipuçları içerir.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5 sm:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Fethiye & Ölüdeniz Gurme Rehberi
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Yakında Ne Yenir?
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Turistik tuzaklardan uzak, yerellerin ve müdavimlerin gittiği nokta atışı mekanlar
                  </p>
                </div>
              </div>

              {/* Icon Category Pills */}
              <div className="flex gap-2.5 overflow-x-auto pb-3 no-scrollbar -mx-1 px-1">
                {fethiyePlaces.map((cat) => {
                  const title = getLocalizedText(cat.title, 'tr');
                  const Icon = CATEGORY_ICONS[title] || Utensils;
                  const isActive = activeCategory === title;
                  const count = (cat.places || []).length;

                  return (
                    <button
                      key={title}
                      onClick={() => setActiveCategory(title)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                        isActive
                          ? 'bg-gray-900 text-white shadow-md scale-[1.01]'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-500'}`} />
                      <span>{title}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Cards Grid */}
              <div
                className={`mt-6 grid gap-6 ${
                  viewportMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {activePlaces.map((place, index) => {
                  const placeId = place.id || `${activeCategory}-${index}`;
                  const isExpanded = expandedCardId === placeId;
                  const name = getLocalizedText(place.name, 'tr');
                  const desc = getLocalizedText(place.description, 'tr');
                  const orderSuggestion = place.orderSuggestion
                    ? getLocalizedText(place.orderSuggestion, 'tr')
                    : '';
                  const rating = place.googleRating || place.google_rating || 0;
                  const reviews = place.reviewCount || place.review_count || '0';

                  return (
                    <div
                      key={placeId}
                      className="group bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Image Header with Badges */}
                      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={place.image || ''}
                          alt={name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                        {/* Top Left Rank Badge */}
                        <div className="absolute top-3.5 left-3.5 bg-gray-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/15">
                          #{index + 1} Favori
                        </div>

                        {/* Top Right Google Rating Badge */}
                        <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-extrabold">{rating}</span>
                          <span className="text-[11px] text-gray-500 font-medium">({reviews})</span>
                        </div>

                        {/* Bottom Title over Image */}
                        <div className="absolute bottom-3.5 left-4 right-4">
                          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug drop-shadow-sm">
                            {name}
                          </h3>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-4">
                          <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>

                          {/* Signature Order Suggestion Box (Always Visible!) */}
                          {orderSuggestion && (
                            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Utensils className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                                  Ne Sipariş Etmeli?
                                </span>
                                <p className="text-sm font-bold text-gray-900 mt-0.5">
                                  {orderSuggestion}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Expandable Regulars' Notes ("Müdavimleri Ne Diyor?") */}
                        {place.notes && place.notes.length > 0 && (
                          <div className="pt-2 border-t border-gray-100">
                            <button
                              onClick={() =>
                                setExpandedCardId(isExpanded ? null : placeId)
                              }
                              className="w-full flex items-center justify-between py-2 text-left text-xs sm:text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                            >
                              <span className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                Müdavimleri Ne Diyor? ({place.notes.length} İpucu)
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="mt-3 space-y-2.5 animate-fadeIn">
                                {place.notes.map((note, idx) => (
                                  <div
                                    key={note.id || idx}
                                    className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-start gap-2.5"
                                  >
                                    <span className="text-base leading-none mt-0.5">
                                      {note.emoji}
                                    </span>
                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                      {getLocalizedText(note.text, 'tr')}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VARIANT 3: KOMPAKT SIRALI LİSTE + DETAY ÇEKMECESİ
           ========================================================= */}
        {designVariant === 'compact' && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <h2 className="text-sm font-bold text-purple-950">
                Varyasyon #3: Kompakt Mobil-Öncelikli Sıralı Liste (Yüksek Tarama Hızı)
              </h2>
              <p className="text-xs text-purple-800 mt-0.5">
                Otel sayfasında çok fazla dikey alan kaplamadan 4-5 mekanı tek bakışta gösterir. Bir mekana tıkladığında alttan/yandan zengin detay çekmecesi açılır.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Yakında Ne Yenir? • Fethiye
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Kategori seçin ve müdavim notları için mekana dokunun
                  </p>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-5 border-b border-gray-100">
                {fethiyePlaces.map((cat) => {
                  const title = getLocalizedText(cat.title, 'tr');
                  const isActive = activeCategory === title;
                  return (
                    <button
                      key={title}
                      onClick={() => setActiveCategory(title)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {title}
                    </button>
                  );
                })}
              </div>

              {/* Compact Rows */}
              <div className="divide-y divide-gray-100">
                {activePlaces.map((place, idx) => {
                  const name = getLocalizedText(place.name, 'tr');
                  const desc = getLocalizedText(place.description, 'tr');
                  const order = place.orderSuggestion
                    ? getLocalizedText(place.orderSuggestion, 'tr')
                    : '';
                  const rating = place.googleRating || 0;
                  const reviews = place.reviewCount || '0';

                  return (
                    <div
                      key={place.id || idx}
                      onClick={() => setDrawerPlace(place)}
                      className="py-4 first:pt-1 last:pb-1 flex items-start sm:items-center gap-4 cursor-pointer group hover:bg-gray-50/80 -mx-3 px-3 rounded-2xl transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={place.image || ''}
                          alt={name}
                          fill
                          sizes="112px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-gray-900/85 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {name}
                          </h3>
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-lg flex-shrink-0">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-gray-900">{rating}</span>
                            <span className="text-[11px] text-gray-500">({reviews})</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                          {desc}
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {order && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg">
                              <Utensils className="w-3 h-3" />
                              {order}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-blue-600 ml-auto group-hover:underline">
                            Müdavim Notları ({place.notes?.length || 0}) →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VARIANT 4: TAM OTEL SAYFASI BAĞLAMINDA GÖRÜNÜM
           ========================================================= */}
        {designVariant === 'hotel-context' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <h2 className="text-sm font-bold text-emerald-950">
                Varyasyon #4: Gerçek Fethiye Otel Sayfası Akışında Görünüm
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5">
                Otel başlığı, fotoğraf galerisi, &ldquo;Neden Bu Otel?&rdquo; ve hemen altında{' '}
                <strong>&ldquo;Yakında Ne Yenir?&rdquo;</strong> modülünün sayfa içindeki duruşu.
              </p>
            </div>

            {/* Simulated Hotel Header */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">
                    Otel / Muğla / Fethiye / Kalemya Koyu
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    Hillside Beach Club
                  </h1>
                  <div className="flex items-center text-gray-600 text-sm mt-1.5">
                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>Fethiye, Muğla</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-900 text-white px-4 py-2.5 rounded-2xl text-center">
                    <span className="text-[10px] uppercase tracking-wider text-gray-300 block">
                      Yerini Ayır Skoru
                    </span>
                    <span className="text-lg font-black">9.8 / 10</span>
                  </div>
                </div>
              </div>

              {/* Mini Hero Photo Strip */}
              <div className="grid grid-cols-3 gap-3 my-6 h-44 sm:h-64 rounded-2xl overflow-hidden">
                <div className="col-span-2 relative bg-gray-100">
                  <Image
                    src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Hillside Fethiye"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="col-span-1 flex flex-col gap-3">
                  <div className="relative flex-1 bg-gray-100">
                    <Image
                      src="https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Fethiye Koy"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative flex-1 bg-gray-100">
                    <Image
                      src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Fethiye Havuz"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Brief About Hotel */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-2">Neden Bu Otel?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Kalemya Koyu&apos;nda çam ormanlarıyla çevrili özel plajı, Sanda Nature Spa&apos;sı ve kusursuz hizmet anlayışıyla Fethiye&apos;nin en ikonik tatil deneyimi. Otel dışına çıkıp Fethiye Kordon, Paspatur, Kayaköy veya Ölüdeniz&apos;i keşfetmek istediğinizde ise aşağıdaki yerel rehberimiz devreye giriyor.
                </p>
              </div>
            </div>

            {/* Actual NearbyGuide Component in Hotel Page Context */}
            <NearbyGuide
              location="Fethiye, Muğla"
              isMobile={viewportMode === 'mobile'}
              lang="tr"
            />
          </div>
        )}
      </main>

      {/* Drawer / Modal for Variant 3 */}
      {drawerPlace && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setDrawerPlace(null)}
        >
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={drawerPlace.image || ''}
                alt={getLocalizedText(drawerPlace.name, 'tr')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <button
                onClick={() => setDrawerPlace(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <h3 className="text-xl font-bold text-white">
                  {getLocalizedText(drawerPlace.name, 'tr')}
                </h3>
                <div className="bg-white px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{drawerPlace.googleRating}</span>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                {getLocalizedText(drawerPlace.description, 'tr')}
              </p>

              {(drawerPlace.orderSuggestion || drawerPlace.order_suggestion) && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-center text-blue-800 mb-1.5">
                    <Utensils className="w-4 h-4 mr-2" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Ne Sipariş Etmeli?
                    </h4>
                  </div>
                  <p className="text-blue-950 font-bold text-sm sm:text-base">
                    {getLocalizedText(
                      (drawerPlace.orderSuggestion || drawerPlace.order_suggestion)!,
                      'tr'
                    )}
                  </p>
                </div>
              )}

              {drawerPlace.notes && drawerPlace.notes.length > 0 && (
                <div>
                  <div className="flex items-center text-gray-900 mb-3">
                    <MessageSquare className="w-4 h-4 mr-2 text-gray-600" />
                    <h4 className="font-bold text-sm">Müdavimleri Ne Diyor?</h4>
                  </div>
                  <div className="space-y-2.5">
                    {drawerPlace.notes.map((note, idx) => (
                      <div
                        key={note.id || idx}
                        className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex items-start gap-3"
                      >
                        <span className="text-lg">{note.emoji}</span>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {getLocalizedText(note.text, 'tr')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
