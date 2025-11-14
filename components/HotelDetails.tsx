'use client';

import { MapPin, ExternalLink, Instagram, Map } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { NearbyPlacesTab } from './nearby-places/NearbyPlacesTab';

type HotelDetailsProps = {
  features: string[];
  tabs: {
    about: string;
    rules: string;
  };
  mapImageUrl: string;
  location: string;
  websiteUrl?: string;
  instagramUrl?: string;
  googleMapsUrl?: string;
  tags?: Array<{ name: string; slug: string; icon?: string }>;
  coordinates?: { lat: number; lng: number };
};

export function HotelDetails({ features, tabs, mapImageUrl, location, websiteUrl, instagramUrl, googleMapsUrl, tags, coordinates }: HotelDetailsProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden hidden md:block">
            <div className="p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Otel Özellikleri</h2>
              {tags && tags.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {tags.map((tag, index) => {
                    const IconComponent = (LucideIcons as any)[tag.icon || 'Tag'] || LucideIcons.Tag;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl sm:rounded-2xl hover:shadow-md transition-all group"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-blue-900 font-semibold text-xs sm:text-sm leading-tight">{tag.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 font-medium">Otel özellikleri henüz eklenmemiş.</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h2 className="text-[20px] font-semibold text-gray-900 mb-4">Otel Özellikleri</h2>
              {tags && tags.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {tags.map((tag, index) => {
                    const IconComponent = (LucideIcons as any)[tag.icon || 'Tag'] || LucideIcons.Tag;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 p-3.5 bg-white border border-gray-200 rounded-xl"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-400 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-4.5 h-4.5 text-white" strokeWidth={2} />
                        </div>
                        <span className="text-gray-600 font-medium text-[14px] leading-snug">{tag.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 font-medium text-sm">Otel özellikleri henüz eklenmemiş.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden md:block hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Neden Bu Otel</h2>
              {tabs.about ? (
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {tabs.about}
                  </p>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 font-medium">Bu bölüm henüz doldurulmamış.</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h2 className="text-[20px] font-semibold text-gray-900 mb-4">Neden Bu Otel</h2>
              {tabs.about ? (
                <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line">
                  {tabs.about}
                </p>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 font-medium text-sm">Bu bölüm henüz doldurulmamış.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden md:block hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Yakında Ne Yenir</h2>
              <NearbyPlacesTab location={location} coordinates={coordinates} />
            </div>
          </div>

          <div className="md:hidden">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h2 className="text-[20px] font-semibold text-gray-900 mb-4">Yakında Ne Yenir</h2>
              <NearbyPlacesTab location={location} coordinates={coordinates} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden md:block hidden">
        <div className="p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
            Konum
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6">{location}</p>
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 sm:gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-colors shadow-md hover:shadow-lg group"
            >
              <Map className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base">Haritada Gör</span>
            </a>
          )}
        </div>
      </div>

      <div className="md:hidden">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <h2 className="text-[20px] font-semibold text-gray-900 mb-4">Konum</h2>
          <div className="flex items-start gap-2.5 mb-4">
            <MapPin className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-gray-700 text-[15px] leading-relaxed">{location}</p>
          </div>
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-[52px] bg-white border border-gray-300 hover:border-gray-900 active:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all text-[16px]"
            >
              <Map className="w-5 h-5 mr-2" strokeWidth={2} />
              Haritada Gör
            </a>
          )}
        </div>
      </div>
    </>
  );
}
