import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { db } from '@/lib/db';
import { ImageGallery } from '@/components/ImageGallery';
import { BackButton } from '@/components/BackButton';
import { RelatedArticles } from '@/components/RelatedArticles';
import { MobileHotelInfo } from '@/components/MobileHotelInfo';
import { HotelFeatures } from '@/components/hotel/HotelFeatures';
import { HotelDescription } from '@/components/hotel/HotelDescription';
import { LocationCard } from '@/components/hotel/LocationCard';
import { NearbyGuide } from '@/components/hotel/NearbyGuide';

export const revalidate = 1800;

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hotel = await db.hotels.getById(params.id);

  if (!hotel) {
    return {
      title: 'Otel Bulunamadı | GNK',
      description: 'Aradığınız otel sistemimizde mevcut değil.',
    };
  }

  return {
    title: `GNK | ${hotel.name} - ${hotel.location}`,
    description: `${hotel.name} hakkında detaylı bilgi. ${(hotel.about || '').substring(0, 120)}...`,
  };
}

export default async function HotelDetailPage({ params }: Props) {
  const hotel = await db.hotels.getById(params.id);

  if (!hotel) {
    notFound();
  }

  const allTags = await db.tags.getAll();
  const hotelTagsWithIcons = hotel.tags
    ?.map(tagSlug => allTags.find(t => t.slug === tagSlug))
    .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined) || [];

  const rating = {
    score: hotel.gnkScore || 0,
    reviewCount: 0,
    text: 'İyi',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.about || '',
    image: hotel.galleryImages && hotel.galleryImages.length > 0 ? hotel.galleryImages[0] : hotel.coverImageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.location,
      addressLocality: hotel.location.split(',')[1]?.trim() || hotel.location,
      addressCountry: 'TR',
    },
    geo: hotel.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: hotel.coordinates.lat,
      longitude: hotel.coordinates.lng,
    } : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.score,
      reviewCount: rating.reviewCount,
      bestRating: 10,
    },
    priceRange: '₺₺₺',
  };

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden bg-gray-50 min-h-screen">
        <div className="relative w-full">
          <BackButton variant="overlay" />

          <div className="px-5 pt-4">
            <ImageGallery
              images={hotel.galleryImages || (hotel.coverImageUrl ? [hotel.coverImageUrl] : [])}
              videoUrl={hotel.video_url}
              videoThumbnailUrl={hotel.video_thumbnail_url}
            />
          </div>

          <MobileHotelInfo
            hotelName={hotel.name}
            price={hotel.price}
            rating={rating.score}
            location={hotel.location}
            googleMapsUrl={hotel.google_maps_url}
            websiteUrl={hotel.website_url}
            instagramUrl={hotel.instagram_url}
          />
        </div>

        <div className="px-5 flex flex-col space-y-1.5">
          <div className="order-1">
            <HotelFeatures tags={hotelTagsWithIcons} isMobile={true} />
          </div>

          <div className="order-2">
            <HotelDescription about={hotel.about || ''} isMobile={true} />
          </div>

          <div className="order-3">
            <LocationCard latitude={hotel.latitude} longitude={hotel.longitude} hotelName={hotel.name} address={hotel.location} />
          </div>

          <div className="order-4">
            <NearbyGuide location={hotel.location} coordinates={hotel.coordinates} isMobile={true} />
          </div>

          <RelatedArticles location={hotel.location.split(',')[0].trim()} />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <BackButton />

          <div className="flex flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Otel / {hotel.location} / {hotel.name}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{hotel.name}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin size={16} className="mr-2" />
                <span className="text-base">{hotel.location}</span>
              </div>
            </div>
            <div className="flex-shrink-0 border-2 border-blue-600 bg-white px-6 py-4 rounded-xl shadow-sm">
              <div className="text-center">
                <p className="text-xs font-medium mb-1 text-gray-600">GNK Puan</p>
                <p className="font-bold text-4xl text-blue-600">{rating.score.toFixed(1)}<span className="text-2xl text-gray-500">/10</span></p>
              </div>
            </div>
          </div>

          <ImageGallery
            images={hotel.galleryImages || (hotel.coverImageUrl ? [hotel.coverImageUrl] : [])}
            videoUrl={hotel.video_url}
            videoThumbnailUrl={hotel.video_thumbnail_url}
          />

          <div className="my-6 sm:my-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Gecelik Başlangıç Fiyatı</p>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{hotel.price.toLocaleString('tr-TR')} ₺</p>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                {hotel.website_url && (
                  <a
                    href={hotel.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <span>Otele Git</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                )}
                {hotel.instagram_url && (
                  <a
                    href={hotel.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <HotelFeatures tags={hotelTagsWithIcons} />
            </div>
            <div className="lg:col-span-1">
              <LocationCard latitude={hotel.latitude} longitude={hotel.longitude} hotelName={hotel.name} address={hotel.location} />
            </div>
          </div>

          <div className="mb-6">
            <HotelDescription about={hotel.about || ''} />
          </div>

          <div className="mb-6">
            <NearbyGuide location={hotel.location} coordinates={hotel.coordinates} />
          </div>

          <RelatedArticles location={hotel.location.split(',')[0].trim()} />
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
