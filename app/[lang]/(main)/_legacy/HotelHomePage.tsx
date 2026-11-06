import { db } from '@/lib/db';
import {LegacyHotelCard as HotelCard,LegacySearchFilters as SearchFilters} from '@/components/LegacyHotelHomeClient';

import HotelCardSkeleton from '@/components/skeletons/HotelCardSkeleton';
import { Suspense } from 'react';
import { AlertCircle } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateOrganizationSchema } from '@/lib/schema-generator';
import { Metadata } from 'next';
import { Hotel } from '@/lib/types';

import { getDictionary } from '@/lib/dictionary';
import { getLocalizedText } from '@/lib/localization';
import { absoluteUrl } from '@/lib/utils';
import { headers } from 'next/headers';

// Remove force-static to allow headers() to work
// export const revalidate = 60; 
// export const dynamic = 'force-static'; 

async function HotelGroups({ lang, domain }: { lang: 'tr' | 'en', domain?: string }) {
  const dict = await getDictionary(lang);

  try {
    // Pass the current domain to filter groups
    const groups = await db.groups.getPublishedWithHotels(domain);

    if (!groups || groups.length === 0) {
      return (
        <div className="text-center py-20 px-4">
          <div className="bg-gray-50 rounded-xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">🏨</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{dict.home.no_hotels_found}</h2>
            <p className="text-gray-500">{dict.home.add_hotels_prompt}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 sm:space-y-16">
        {groups.map((group, groupIndex) => (
          <section key={group.id}>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 px-4 sm:px-0">
              {getLocalizedText(group.title, lang)}
            </h2>

            {/* Mobil: Yan yana kaydırılabilir */}
            <div className="sm:hidden overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
              <div className="flex gap-4" style={{ width: 'fit-content' }}>
                {group.hotels.map((hotel: Hotel, hotelIndex: number) => (
                  <div key={hotel.id} className="w-[calc(100vw-7rem)]" style={{ minWidth: 'calc(100vw - 7rem)' }}>
                    <HotelCard hotel={hotel} lang={lang} priority={groupIndex === 0 && hotelIndex === 0} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: 3 Sütunlu Grid görünümü (Her kategoride 3 otel) */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.hotels.map((hotel: Hotel, hotelIndex: number) => (
                <HotelCard key={hotel.id} hotel={hotel} lang={lang} priority={groupIndex === 0 && hotelIndex === 0} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error loading data:', error);
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{dict.common.error}</h2>
          <p className="text-gray-600 mb-6">{dict.common.error_try_again}</p>
        </div>
      </div>
    );
  }
}

function HomePageSkeleton() {
  return (
    <div className="space-y-8 sm:space-y-16">
      {[1, 2].map((groupIdx) => (
        <section key={groupIdx}>
          <div className="h-9 w-64 bg-gray-200 rounded-lg animate-pulse mb-4 sm:mb-6 px-4 sm:px-0"></div>

          {/* Mobil: Yan yana kaydırılabilir skeleton */}
          <div className="sm:hidden overflow-x-auto -mx-4 px-4 pb-2">
            <div className="flex gap-4" style={{ width: 'fit-content' }}>
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="w-[calc(100vw-7rem)]" style={{ minWidth: 'calc(100vw - 7rem)' }}>
                  <HotelCardSkeleton />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid skeleton */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <HotelCardSkeleton key={idx} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as 'tr' | 'en' || 'tr';
  const dict = await getDictionary(lang);

  // Using new absoluteUrl helper that handles domains automatically
  const canonical = absoluteUrl('/', lang);
  const trUrl = absoluteUrl('/', 'tr');
  const enUrl = absoluteUrl('/', 'en');

  return {
    title: dict.seo.home.title,
    description: dict.seo.home.description,
    alternates: {
      canonical: canonical,
      languages: {
        'tr': trUrl,
        'en': enUrl,
        // x-default typically points to the international version for multi-domain setups
        'x-default': enUrl
      },
    },
  };
}



export default async function HomePage({
  params,
  gastronomySection,
}: {
  params: { lang: string };
  gastronomySection?: React.ReactNode;
}) {
  const lang = params.lang as 'tr' | 'en' || 'tr';
  const dict = await getDictionary(lang);
  const organizationSchema = generateOrganizationSchema();

  // Detect domain
  const headersList = await headers();
  const host = headersList.get('host') || '';
  let currentDomain = 'yeriniayir.com'; // default

  if (host.includes('worldandhotels.com')) {
    currentDomain = 'worldandhotels.com';
  } else if (host.includes('yeriniayir.com')) {
    currentDomain = 'yeriniayir.com';
  } else if (host.includes('localhost')) {
    // For local testing: map language to domain
    // This allows testing WorldAndHotels logic by visiting /en
    currentDomain = lang === 'en' ? 'worldandhotels.com' : 'yeriniayir.com';
  }

  console.log(`[HomePage] Host: ${host}, Lang: ${lang} -> Detected Domain: ${currentDomain}`);

  return (
    <>
      <JsonLd data={organizationSchema} />

      <main className="container mx-auto px-4 pt-2 pb-12">
        <div className="text-center mt-2 mb-6">
          <h1 className="text-xl min-[375px]:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight whitespace-nowrap">
            {dict.home.hero_title}
          </h1>

          <Suspense fallback={<div className="h-40" />}>
            <SearchFilters lang={lang} dict={dict} />
          </Suspense>
        </div>

        {/* ÖNEMLİ FEATURE VURGUSU: KAFE & RESTORAN KEŞİF SİSTEMİ ÜST BANNER */}
        {gastronomySection && (
          <div className="mb-10 bg-gradient-to-r from-[#FF385C]/10 via-white to-[#FF385C]/5 border-2 border-[#FF385C]/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF385C] text-white text-xs font-extrabold uppercase tracking-wider">
                <span>🍽️ YENİ ÖZELLİK · GASTRONOMİ KEŞİF SİSTEMİ</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                {lang === 'tr'
                  ? 'Yerini Ayır Kafe & Restoran Keşif Rehberi Yayında!'
                  : 'Yerini Ayır Cafe & Restaurant Discovery Guide is Live!'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
                {lang === 'tr'
                  ? 'Sıradan zincirleri eleyen, her semtin gerçek uzman kahvecilerini, kahvaltıcılarını, balıkçılarını ve date mekanlarını seçen interaktif rehberimizi hemen aşağıda deneyimleyin.'
                  : 'Explore our interactive guide selecting authentic local cafes, breakfast spots, seafood restaurants, and date venues.'}
              </p>
            </div>
            <a
              href={`/${lang}?view=gastronomi`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF385C] hover:bg-red-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0"
            >
              <span>{lang === 'tr' ? 'Kafe & Restoranları Keşfet' : 'Explore Cafes & Restaurants'}</span>
              <span>→</span>
            </a>
          </div>
        )}

        {/* 4 OTEL KATEGORİSİ (HER KATEGORİDE 3 OTEL = 12 OTEL) */}
        <div id="oteller" className="scroll-mt-24">
          <Suspense fallback={<HomePageSkeleton />}>
            <HotelGroups lang={lang} domain={currentDomain} />
          </Suspense>
        </div>

        {/* AYRI BAŞLIKLI ANA SAYFA KAFE & RESTORAN KEŞİF REHBERİ BÖLÜMÜ (ORİJİNAL TAM BOY GÖRÜNÜM) */}
        {gastronomySection && (
          <section id="gastronomi-rehberi" className="mt-16 sm:mt-24 pt-10 sm:pt-14 border-t-2 border-gray-200 scroll-mt-16 -mx-4 sm:mx-0">
            <div className="mb-6 text-center max-w-3xl mx-auto px-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-[#FF385C]/30 text-[#FF385C] text-xs font-extrabold uppercase tracking-wider mb-3">
                <span>✨ ÖNE ÇIKAN ÖZELLİK · YERİNİ AYIR GASTRONOMİ MOTORU V2</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {lang === 'tr'
                  ? 'Kafe & Restoran Keşif Rehberi — Nereye Gidilir, Ne Yenir?'
                  : 'Cafe & Restaurant Discovery Guide — Where to Go & What to Eat'}
              </h2>
            </div>

            {gastronomySection}
          </section>
        )}
      </main>
    </>
  );
}
