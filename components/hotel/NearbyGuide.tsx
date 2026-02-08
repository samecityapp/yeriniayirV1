'use client';

import { NearbyPlacesTab } from '../nearby-places/NearbyPlacesTab';

interface NearbyGuideProps {
  location: string;
  coordinates?: { lat: number; lng: number };
  isMobile?: boolean;
}

export function NearbyGuide({ location, coordinates, isMobile = false, lang = 'tr' }: NearbyGuideProps & { lang?: 'tr' | 'en' }) {
  if (isMobile) {
    return (
      <div id="yeme-icme-rehberi" className="bg-white p-5 rounded-xl border border-gray-200 scroll-mt-24">
        <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
          {lang === 'tr' ? 'Yakında Ne Yenir?' : 'Where to Eat Nearby?'}
        </h2>
        <NearbyPlacesTab location={location} coordinates={coordinates} lang={lang} />
      </div>
    );
  }

  return (
    <div id="yeme-icme-rehberi" className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden scroll-mt-24">
      <div className="p-6 sm:p-8 lg:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          {lang === 'tr' ? 'Yakında Ne Yenir?' : 'Where to Eat Nearby?'}
        </h2>
        <NearbyPlacesTab location={location} coordinates={coordinates} lang={lang} />
      </div>
    </div>
  );
}
