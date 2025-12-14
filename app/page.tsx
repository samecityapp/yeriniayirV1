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

export const revalidate = 3600;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Yerini Ayır - Türkiye\'nin En Seçkin Otelleri',
  description: 'Türkiye\'nin en iyi otellerini keşfedin. Bodrum, Antalya, Çeşme ve daha fazlası için detaylı otel rehberi ve öneriler.',
  alternates: {
    canonical: 'https://www.gnkhotels.com',
  },
};

async function HotelGroups() {
  try {
    const groups = await db.groups.getPublishedWithHotels();

    if (!groups || groups.length === 0) {
      return (
        <div className="text-center py-20 px-4">
          <div className="bg-gray-50 rounded-xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">🏨</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Henüz Otel Yok</h2>
            <p className="text-gray-500">Yönetim panelinden otel ekleyerek başlayın.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 sm:space-y-16">
        {groups.map((group, groupIndex) => (
          <section key={group.id}>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 px-4 sm:px-0">{group.title}</h2>

            {/* Mobil: Yan yana kaydırılabilir */}
            <div className="sm:hidden overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
              <div className="flex gap-4" style={{ width: 'fit-content' }}>
                {group.hotels.map((hotel: Hotel, hotelIndex: number) => (
                  <div key={hotel.id} className="w-[calc(100vw-7rem)]" style={{ minWidth: 'calc(100vw - 7rem)' }}>
                    <HotelCard key={hotel.id} hotel={hotel} priority={groupIndex === 0 && hotelIndex === 0} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid görünümü */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {group.hotels.map((hotel: Hotel, hotelIndex: number) => (
                <HotelCard key={hotel.id} hotel={hotel} priority={groupIndex === 0 && hotelIndex === 0} />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</p>
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

export default function HomePage() {
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <JsonLd data={organizationSchema} />

      <main className="container mx-auto px-4 pt-2 pb-8">
        <div className="text-center mt-2 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Türkiye'nin En Seçkin Otellerini Keşfedin
          </h1>
          <Suspense fallback={<div className="h-24" />}>
            <SearchFilters />
          </Suspense>
        </div>

        <Suspense fallback={<HomePageSkeleton />}>
          <HotelGroups />
        </Suspense>
      </main>
    </>
  );
}
