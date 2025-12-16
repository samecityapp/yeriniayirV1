import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { MapPin } from 'lucide-react';
import { db } from '@/lib/db';
import { ImageGallery } from '@/components/ImageGallery';
import { BackButton } from '@/components/BackButton';
import { RelatedArticles } from '@/components/RelatedArticles';
import { MobileHotelInfo } from '@/components/MobileHotelInfo';
import { HotelFeatures } from '@/components/hotel/HotelFeatures';
import { HotelDescription } from '@/components/hotel/HotelDescription';
import { NearbyGuide } from '@/components/hotel/NearbyGuide';
import { BreakfastSection } from '@/components/hotel/BreakfastSection';


import { HotelFAQ } from '@/components/hotel/HotelFAQ';
import PremiumClassic from '@/components/hotel/ScoreCard/PremiumClassic';
import { getLocalizedText } from '@/lib/localization';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateHotelSchema, generateBreadcrumbSchema } from '@/lib/schema-generator';

const LocationCard = dynamic(() => import('@/components/hotel/LocationCard'), {
  ssr: false,
  loading: () => <div className="h-[250px] w-full bg-gray-100 animate-pulse rounded-xl" />
});

export const revalidate = 0;

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hotel = await db.hotels.getById(params.id);

  if (!hotel) {
    return {
      title: 'Otel Bulunamadı',
      description: 'Aradığınız otel sistemimizde mevcut değil.',
    };
  }

  const hotelName = getLocalizedText(hotel.name);
  const location = getLocalizedText(hotel.location);
  const aboutText = getLocalizedText(hotel.about);
  const descText = getLocalizedText(hotel.description);
  const description = aboutText || descText || `${hotelName} hakkında detaylı bilgi ve rezervasyon`;

  return {
    title: `${hotelName} - ${location}`,
    description: description.substring(0, 160),
    keywords: [
      hotelName,
      location,
      'otel',
      'konaklama',
      'rezervasyon',
      ...(hotel.tags || []),
    ],
    openGraph: {
      title: `${hotelName} - ${location}`,
      description: description.substring(0, 160),
      images: hotel.coverImageUrl ? [hotel.coverImageUrl] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hotelName} - ${location}`,
      description: description.substring(0, 160),
      images: hotel.coverImageUrl ? [hotel.coverImageUrl] : [],
    },
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gnkhotels.com';
  const hotelSchema = generateHotelSchema(hotel);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: baseUrl },
    { name: 'Oteller', url: `${baseUrl}/search` },
    { name: getLocalizedText(hotel.location), url: `${baseUrl}/search?location=${encodeURIComponent(getLocalizedText(hotel.location))}` },
    { name: getLocalizedText(hotel.name), url: `${baseUrl}/otel/${hotel.id}` },
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: getLocalizedText(hotel.name),
    description: hotel.about || '',
    image: hotel.galleryImages && hotel.galleryImages.length > 0 ? hotel.galleryImages[0] : hotel.coverImageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: getLocalizedText(hotel.location),
      addressLocality: getLocalizedText(hotel.location).split(',')[1]?.trim() || getLocalizedText(hotel.location),
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


  const defaultFaqs = [
    {
      question: 'Giriş ve çıkış saatleri neler?',
      answer: 'Giriş saati 14:00, çıkış saati 12:00\'dir. Erken giriş ve geç çıkış talepleri müsaitliğe bağlıdır.',
    },
    {
      question: 'Tesisin kahvaltı saatleri?',
      answer: 'Kahvaltı her gün 07:30 - 10:30 saatleri arasında servis edilmektedir.',
    },
    {
      question: 'Otopark var mı?',
      answer: 'Evet, tesis bünyesinde misafirler için ücretsiz otopark mevcuttur.',
    },
    {
      question: 'Denize Uzaklığı Nedir?',
      answer: hotel.tags?.includes('denize-sifir') ? 'Tesisimiz denize sıfır konumdadır.' : 'Plaja yürüme mesafesindedir.',
    },
    {
      question: 'Engelliler için uygun mu?',
      answer: 'Tesisimiz engelli misafirlerimizin erişimi için tekerlekli sandalye rampaları ve asansör ile donatılmıştır.',
    },
    {
      question: 'Çocuk Kabul Ediyor musunuz?',
      answer: hotel.tags?.includes('yetiskin-oteli') ? 'Hayır, tesisimiz +12 yaş yetişkin oteli konseptindedir.' : 'Evet, her yaş grubundan çocuk misafirimiz kabul edilmektedir.',
    },
    {
      question: 'Bu otele gelmek için en iyi zaman ne zaman?',
      answer: 'Bahar ve yaz ayları (Mayıs-Ekim) deniz tatili için en ideal dönemdir.',
    },
    {
      question: 'Bölgede mutlaka görülmesi gereken yerler nereler?',
      answer: `Konumumuz ${getLocalizedText(hotel.location).split(',')[0]} merkezine yakındır. Tarihi çarşı ve liman mutlaka görülmelidir.`,
    },
    {
      question: 'Tesiste spor olanağı var mı? Gym, Yoga, Pilates?',
      answer: 'Otelimizde tam donanımlı fitness merkezi bulunmaktadır. Ayrıca sabahları yoga dersleri düzenlenmektedir.',
    },
    {
      question: 'Evcil hayvan kabul ediyor musunuz?',
      answer: 'Maalesef tesisimize evcil hayvan kabul edilmemektedir.',
    },
  ];

  const displayFaqs = (hotel.faqs && hotel.faqs.length > 0)
    ? hotel.faqs.filter(f => f.answer && f.answer.trim().length > 0)
    : defaultFaqs;

  return (
    <>
      <JsonLd data={hotelSchema} />
      <JsonLd data={breadcrumbSchema} />

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
            hotelName={getLocalizedText(hotel.name)}
            price={hotel.price}
            rating={rating.score}
            location={getLocalizedText(hotel.location)}
            googleMapsUrl={hotel.google_maps_url}
            websiteUrl={hotel.website_url}
            instagramUrl={hotel.instagram_url}
            hotelId={hotel.id}
          />
        </div>

        <div className="px-5 flex flex-col space-y-1.5">
          <div className="order-1">

          </div>


          <div className="order-2">
            <HotelFeatures tags={hotelTagsWithIcons} isMobile={true} />
          </div>

          <div className="order-3">
            <HotelDescription about={hotel.about || hotel.description || ''} isMobile={true} />
          </div>

          {hotel.breakfast_description && (
            <div className="order-4">
              <BreakfastSection
                description={hotel.breakfast_description}
                images={hotel.breakfast_images || []}
              />
            </div>
          )}

          <div className="order-7">
            <HotelFAQ faqs={displayFaqs} />
          </div>

          <div className="order-5">
            <LocationCard latitude={hotel.latitude} longitude={hotel.longitude} address={getLocalizedText(hotel.location)} />
          </div>

          <div className="order-6">
            <Suspense fallback={
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              </div>
            }>
              <NearbyGuide location={getLocalizedText(hotel.location)} coordinates={hotel.coordinates} isMobile={true} />
            </Suspense>
          </div>

          <div className="order-8">
            <Suspense fallback={
              <div className="mt-4 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="p-5 space-y-4">
                  <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              </div>
            }>
              <RelatedArticles location={getLocalizedText(hotel.location).split(',')[0].trim()} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <BackButton />

          <div className="flex justify-between items-start gap-6 mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Otel / {getLocalizedText(hotel.location)} / {getLocalizedText(hotel.name)}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{getLocalizedText(hotel.name)}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin size={16} className="mr-2" />
                <span className="text-base">{getLocalizedText(hotel.location)}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <PremiumClassic score={rating.score} />
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
                    href={`/api/go?hotelId=${hotel.id}`}
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
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-6">


              <HotelFeatures tags={hotelTagsWithIcons} />
              <HotelDescription about={hotel.about || hotel.description || ''} />
              {hotel.breakfast_description && (
                <BreakfastSection
                  description={hotel.breakfast_description}
                  images={hotel.breakfast_images || []}
                />
              )}

            </div>
            <div className="lg:col-span-1">
              <LocationCard latitude={hotel.latitude} longitude={hotel.longitude} address={getLocalizedText(hotel.location)} />
            </div>
          </div>

          <div className="mb-6">
            <Suspense fallback={
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="h-8 w-56 bg-gray-200 rounded animate-pulse mb-6" />
                  <div className="space-y-4">
                    <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>
            }>
              <NearbyGuide location={getLocalizedText(hotel.location)} coordinates={hotel.coordinates} />
            </Suspense>
          </div>

          <div className="mb-6">
            <HotelFAQ faqs={displayFaqs} />
          </div>

          <Suspense fallback={
            <div className="mt-12 bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="divide-y divide-gray-200">
                <div className="p-5 flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4" />
                  </div>
                </div>
                <div className="p-5 flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              </div>
            </div>
          }>
            <RelatedArticles location={getLocalizedText(hotel.location).split(',')[0].trim()} />
          </Suspense>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
