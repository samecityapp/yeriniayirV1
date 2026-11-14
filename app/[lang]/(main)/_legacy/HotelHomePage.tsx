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

      <main className="container mx-auto px-4 pt-3 pb-12">
        {/* KOMPAKT SEKME (TAB) GEÇİŞİ: OTELLER / GASTRONOMİ KEŞFİ */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center p-1 rounded-full bg-gray-100 border border-gray-200/80 shadow-xs">
            <a
              href={`/${lang}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-gray-900 font-bold text-xs sm:text-sm shadow-xs border border-gray-200/60 transition-all"
            >
              <span>🏨</span>
              <span>{lang === 'tr' ? 'Oteller' : 'Hotels'}</span>
            </a>
            <a
              href={`/${lang}?view=gastronomi`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-gray-600 hover:text-[#FF385C] font-bold text-xs sm:text-sm transition-all"
            >
              <span>🍽️</span>
              <span>{lang === 'tr' ? 'Gastronomi Keşfi' : 'Gastronomy Discovery'}</span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-[#FF385C]/10 text-[#FF385C]">
                {lang === 'tr' ? 'Yeni' : 'New'}
              </span>
            </a>
          </div>
        </div>

        <div className="text-center mt-1 mb-6">
          <h1 className="text-xl min-[375px]:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight whitespace-nowrap">
            {dict.home.hero_title}
          </h1>

          <Suspense fallback={<div className="h-40" />}>
            <SearchFilters lang={lang} dict={dict} />
          </Suspense>
        </div>

        {/* 4 OTEL KATEGORİSİ (HER KATEGORİDE 3 OTEL = 12 OTEL) */}
        <div id="oteller" className="scroll-mt-24">
          <Suspense fallback={<HomePageSkeleton />}>
            <HotelGroups lang={lang} domain={currentDomain} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
