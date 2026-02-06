import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
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
import { getDictionary } from '@/lib/dictionary';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateHotelSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema-generator';

const LocationCard = dynamic(() => import('@/components/hotel/LocationCard'), {
  ssr: false,
  loading: () => <div className="h-[250px] w-full bg-gray-100 animate-pulse rounded-xl" />
});

export const revalidate = 0;

import { LOCATIONS } from '@/lib/constants';
import { LocationListingView } from '@/components/hotel/LocationListingView';

type Props = {
  params: { id: string; lang: 'tr' | 'en' };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang || 'tr';
  const dict = await getDictionary(lang);
  const location = LOCATIONS.find(l => l.slug === params.id);

  if (location) {
    const title = lang === 'tr'
      ? `En İyi ${location.title} Otelleri | Yerini Ayır`
      : `Best ${location.title} Hotels | Yerini Ayır`;
    const description = lang === 'tr'
      ? `${location.title} bölgesinde konaklayabileceğiniz en seçkin ve butik oteller. Erdem'in kaleminden ${location.title} otel önerileri ve detaylı incelemeler.`
      : `The most exclusive and boutique hotels you can stay in ${location.title}. Hotel recommendations and detailed reviews from Erdem's pen.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [location.image],
      },
      alternates: {
        canonical: `https://www.yeriniayir.com/${lang}/otel/${location.slug}`,
      }
    };
  }

  const hotel = await db.hotels.getById(params.id);

  if (!hotel) {
    return {
      title: lang === 'tr' ? 'Otel Bulunamadı' : 'Hotel Not Found',
      description: lang === 'tr' ? 'Aradığınız otel sistemimizde mevcut değil.' : 'The hotel you are looking for is not available in our system.',
    };
  }

  const hotelName = getLocalizedText(hotel.name, lang);
  const locationName = getLocalizedText(hotel.location, lang);
  const aboutText = getLocalizedText(hotel.about, lang);
  const descText = getLocalizedText(hotel.description, lang);
  const description = aboutText || descText || (lang === 'tr' ? `${hotelName} hakkında detaylı bilgi ve rezervasyon` : `Detailed information and reservation for ${hotelName}`);

  return {
    title: `${hotelName} - ${locationName}`,
    description: description.substring(0, 160),
    keywords: [
      hotelName,
      locationName,
      lang === 'tr' ? 'otel' : 'hotel',
      lang === 'tr' ? 'konaklama' : 'accommodation',
      lang === 'tr' ? 'rezervasyon' : 'booking',
      ...(hotel.tags || []),
    ],
    openGraph: {
      title: `${hotelName} - ${locationName}`,
      description: description.substring(0, 160),
      images: hotel.coverImageUrl ? [hotel.coverImageUrl] : [],
      type: 'website',
    },
    alternates: {
      canonical: `https://www.yeriniayir.com/${lang}/otel/${hotel.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hotelName} - ${locationName}`,
      description: description.substring(0, 160),
      images: hotel.coverImageUrl ? [hotel.coverImageUrl] : [],
    },
  };
}

export default async function HotelDetailPage({ params }: Props) {
  const lang = params.lang || 'tr';
  const dict = await getDictionary(lang);
  const location = LOCATIONS.find(l => l.slug === params.id);

  if (location) {
    const hotels = await db.hotels.searchByLocation(location.title);
    return <LocationListingView location={location} hotels={hotels} lang={lang} />;
  }

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
    text: lang === 'tr' ? 'İyi' : 'Good',
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yeriniayir.com';
  const hotelSchema = generateHotelSchema(hotel, lang);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.navigation.home, url: `${baseUrl}/${lang}` },
    { name: dict.navigation.hotels || 'Oteller', url: `${baseUrl}/${lang}/search` },
    { name: getLocalizedText(hotel.location, lang), url: `${baseUrl}/${lang}/search?location=${encodeURIComponent(getLocalizedText(hotel.location, lang))}` },
    { name: getLocalizedText(hotel.name, lang), url: `${baseUrl}/${lang}/otel/${hotel.id}` },
  ]);

  const defaultFaqs = [
    {
      question: lang === 'tr' ? 'Giriş ve çıkış saatleri neler?' : 'What are the check-in and check-out times?',
      answer: lang === 'tr' ? 'Giriş saati 14:00, çıkış saati 12:00\'dir. Erken giriş ve geç çıkış talepleri müsaitliğe bağlıdır.' : 'Check-in time is 14:00, check-out time is 12:00. Early check-in and late check-out requests are subject to availability.',
    },
    {
      question: lang === 'tr' ? 'Tesisin kahvaltı saatleri?' : 'What are the breakfast hours?',
      answer: lang === 'tr' ? 'Kahvaltı her gün 07:30 - 10:30 saatleri arasında servis edilmektedir.' : 'Breakfast is served daily between 07:30 - 10:30.',
    },
    {
      question: lang === 'tr' ? 'Otopark var mı?' : 'Is there parking?',
      answer: lang === 'tr' ? 'Evet, tesis bünyesinde misafirler için ücretsiz otopark mevcuttur.' : 'Yes, free parking is available on site for guests.',
    },
    {
      question: lang === 'tr' ? 'Denize Uzaklığı Nedir?' : 'How far is it to the sea?',
      answer: hotel.tags?.includes('denize-sifir')
        ? (lang === 'tr' ? 'Tesisimiz denize sıfır konumdadır.' : 'Our facility is located on the seafront.')
        : (lang === 'tr' ? 'Plaja yürüme mesafesindedir.' : 'It is within walking distance to the beach.'),
    },
    {
      question: lang === 'tr' ? 'Engelliler için uygun mu?' : 'Is it suitable for the disabled?',
      answer: lang === 'tr' ? 'Tesisimiz engelli misafirlerimizin erişimi için tekerlekli sandalye rampaları ve asansör ile donatılmıştır.' : 'Our facility is equipped with wheelchair ramps and an elevator for the access of our disabled guests.',
    },
    {
      question: lang === 'tr' ? 'Çocuk Kabul Ediyor musunuz?' : 'Do you accept children?',
      answer: hotel.tags?.includes('yetiskin-oteli')
        ? (lang === 'tr' ? 'Hayır, tesisimiz +12 yaş yetişkin oteli konseptindedir.' : 'No, our facility is adult-only (+12 years old) concept.')
        : (lang === 'tr' ? 'Evet, her yaş grubundan çocuk misafirimiz kabul edilmektedir.' : 'Yes, child guests of all age groups are accepted.'),
    },
    {
      question: lang === 'tr' ? 'Bu otele gelmek için en iyi zaman ne zaman?' : 'When is the best time to visit this hotel?',
      answer: lang === 'tr' ? 'Bahar ve yaz ayları (Mayıs-Ekim) deniz tatili için en ideal dönemdir.' : 'Spring and summer months (May-October) are the most ideal period for sea holiday.',
    },
    {
      question: lang === 'tr' ? 'Bölgede mutlaka görülmesi gereken yerler nereler?' : 'Which places should be seen in the region?',
      answer: lang === 'tr'
        ? `Konumumuz ${getLocalizedText(hotel.location, lang).split(',')[0]} merkezine yakındır. Tarihi çarşı ve liman mutlaka görülmelidir.`
        : `Our location is close to ${getLocalizedText(hotel.location, lang).split(',')[0]} center. The historical bazaar and harbor should definitely be seen.`,
    },
    {
      question: lang === 'tr' ? 'Tesiste spor olanağı var mı? Gym, Yoga, Pilates?' : 'Are there sport facilities? Gym, Yoga, Pilates?',
      answer: lang === 'tr' ? 'Otelimizde tam donanımlı fitness merkezi bulunmaktadır. Ayrıca sabahları yoga dersleri düzenlenmektedir.' : 'Our hotel has a fully equipped fitness center. Also, yoga classes are organized in the mornings.',
    },
    {
      question: lang === 'tr' ? 'Evcil hayvan kabul ediyor musunuz?' : 'Do you accept pets?',
      answer: lang === 'tr' ? 'Maalesef tesisimize evcil hayvan kabul edilmemektedir.' : 'Unfortunately, pets are not accepted in our facility.',
    },
  ];

  const displayFaqs = (hotel.faqs && hotel.faqs.length > 0)
    ? hotel.faqs.filter(f => f.answer && f.answer.trim().length > 0)
    : defaultFaqs;

  const faqSchema = generateFAQSchema(displayFaqs);

  return (
    <>
      <JsonLd data={hotelSchema} />
      <JsonLd data={breadcrumbSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Mobile View */}
      <div className="md:hidden bg-gray-50 min-h-screen">
        <div className="relative w-full">
          <BackButton variant="overlay" lang={lang} />

          <div className="px-5 pt-4">
            <ImageGallery
              images={hotel.galleryImages || (hotel.coverImageUrl ? [hotel.coverImageUrl] : [])}
              videoUrl={hotel.video_url}
              videoThumbnailUrl={hotel.video_thumbnail_url}
              altPrefix={`${getLocalizedText(hotel.name, lang)} - ${getLocalizedText(hotel.location, lang)}`}
              priority={true}
              lang={lang}
            />
          </div>


          <MobileHotelInfo
            hotelName={getLocalizedText(hotel.name, lang)}
            price={hotel.price}
            rating={rating.score}
            location={getLocalizedText(hotel.location, lang)}
            googleMapsUrl={hotel.google_maps_url}
            websiteUrl={hotel.website_url}
            instagramUrl={hotel.instagram_url}
            hotelId={hotel.id}
            lang={lang}
          />
        </div>

        <div className="px-5 flex flex-col space-y-1.5">
          <div className="order-1">

          </div>


          <div className="order-2">
            <HotelFeatures tags={hotelTagsWithIcons} isMobile={true} lang={lang} />
          </div>

          <div className="order-3">
            <HotelDescription about={hotel.about || hotel.description || ''} isMobile={true} lang={lang} />
          </div>

          {hotel.breakfast_description && (
            <div className="order-4">
              <BreakfastSection
                description={hotel.breakfast_description}
                images={hotel.breakfast_images || []}
                lang={lang}
              />
            </div>
          )}

          <div className="order-7">
            <HotelFAQ faqs={displayFaqs} lang={lang} />
          </div>

          <div className="order-5">
            <LocationCard latitude={hotel.latitude} longitude={hotel.longitude} address={getLocalizedText(hotel.location, lang)} dict={dict} />
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
              <NearbyGuide location={getLocalizedText(hotel.location, lang)} coordinates={hotel.coordinates} isMobile={true} lang={lang} />
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
              <RelatedArticles location={getLocalizedText(hotel.location, lang).split(',')[0].trim()} lang={lang} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <BackButton lang={lang} />

          <div className="flex justify-between items-start gap-6 mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">
                {lang === 'tr' ? 'Otel' : 'Hotel'} / {getLocalizedText(hotel.location, lang)} / {getLocalizedText(hotel.name, lang)}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{getLocalizedText(hotel.name, lang)}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin size={16} className="mr-2" />
                <span className="text-base">{getLocalizedText(hotel.location, lang)}</span>
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
            altPrefix={`${getLocalizedText(hotel.name, lang)} - ${getLocalizedText(hotel.location, lang)}`}
            priority={true}
            lang={lang}
          />


          <div className="my-6 sm:my-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">{lang === 'tr' ? 'Gecelik Başlangıç Fiyatı' : 'Starting Price per Night'}</p>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {hotel.price.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-GB')} ₺
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                {hotel.website_url && (
                  <a
                    href={`/api/go?hotelId=${hotel.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <span>{lang === 'tr' ? 'Otele Git' : 'Go to Hotel'}</span>
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


              <HotelFeatures tags={hotelTagsWithIcons} lang={lang} />
              <HotelDescription about={hotel.about || hotel.description || ''} lang={lang} />
              {hotel.breakfast_description && (
                <BreakfastSection
                  description={hotel.breakfast_description}
                  images={hotel.breakfast_images || []}
                  lang={lang}
                />
              )}

            </div>
            <div className="lg:col-span-1">
              <LocationCard latitude={hotel.latitude} longitude={hotel.longitude} address={getLocalizedText(hotel.location, lang)} dict={dict} />
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
              <NearbyGuide location={getLocalizedText(hotel.location, lang)} coordinates={hotel.coordinates} lang={lang} />
            </Suspense>
          </div>

          <div className="mb-6">
            <HotelFAQ faqs={displayFaqs} lang={lang} />
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
            <RelatedArticles location={getLocalizedText(hotel.location, lang).split(',')[0].trim()} lang={lang} />
          </Suspense>
        </div>
      </div>

    </>
  );
}
