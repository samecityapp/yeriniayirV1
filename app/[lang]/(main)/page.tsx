import { db } from '@/lib/db';
import HotelCard from '@/components/HotelCard';

import HotelCardSkeleton from '@/components/skeletons/HotelCardSkeleton';
import SearchFilters from '@/components/SearchFilters';
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

            {/* Desktop: Grid görünümü */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((idx) => (
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



export default async function HomePage({ params }: { params: { lang: string } }) {
  const lang = params.lang as 'tr' | 'en' || 'tr';
  const dict = await getDictionary(lang);
  const organizationSchema = generateOrganizationSchema();

  // Detect domain
  const headersList = headers();
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

      <main className="container mx-auto px-4 pt-2 pb-8">
        <div className="text-center mt-2 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            {dict.home.hero_title}
          </h1>

          <p className="text-[10px] text-gray-400 mt-[-1rem] mb-6 max-w-2xl mx-auto px-4">
            {dict.home.demo_disclaimer}
          </p>

          <Suspense fallback={<div className="h-40" />}>
            <SearchFilters lang={lang} dict={dict} />
          </Suspense>
        </div>

        <Suspense fallback={<HomePageSkeleton />}>
          <HotelGroups lang={lang} domain={currentDomain} />
        </Suspense>
      </main>
    </>
  );
}
