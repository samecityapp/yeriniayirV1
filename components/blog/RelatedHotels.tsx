import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Hotel, ChevronRight, MapPin, Star } from 'lucide-react';
import { getLocalizedText } from '@/lib/localization';
import { getDictionary } from '@/lib/dictionary';

export async function RelatedHotels({ location, lang = 'tr' }: { location: string; lang?: string }) {
  const hotels = await db.hotels.searchByLocation(location);
  const dict = await getDictionary(lang as 'tr' | 'en');

  if (!hotels || hotels.length === 0) return null;

  const topHotels = hotels.slice(0, 4);

  return (
    <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 overflow-hidden">
      <div className="p-6 border-b border-blue-100 flex items-center gap-3">
        <Hotel className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
          {dict.blog_detail.popular_hotels_in.replace('{location}', location)}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {topHotels.map((hotel: any) => (
          <Link
            key={hotel.id}
            href={`/${lang}/otel/${hotel.id}`}
            className="group flex gap-4 p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blue-200"
          >
            <div className="shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden relative">
              {hotel.coverImageUrl ? (
                <Image
                  src={hotel.coverImageUrl}
                  alt={getLocalizedText(hotel.name, lang)}
                  fill
                  sizes="80px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-1 group-hover:text-blue-600 line-clamp-1">
                {getLocalizedText(hotel.name, lang)}
              </h4>
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{getLocalizedText(hotel.location, lang)}</span>
              </div>
              {hotel.gnkScore && (
                <div className="flex items-center gap-1 text-xs font-medium text-blue-600">
                  <Star className="w-3 h-3 fill-blue-600" />
                  <span>{hotel.gnkScore}/10 GNK {lang === 'tr' ? 'Puanı' : 'Score'}</span>
                </div>
              )}
            </div>

            <div className="self-center text-gray-300 group-hover:text-blue-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="px-6 pb-6">
        <Link
          href={`/${lang}/search?location=${encodeURIComponent(location)}`}
          className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          {dict.blog_detail.view_all_hotels_in.replace('{location}', location)}
        </Link>
      </div>
    </div>
  );
}
