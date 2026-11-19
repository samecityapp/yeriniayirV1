import { Hotel } from './types';
import { getLocalizedText } from './localization';
import { buildHotelPublicUrl } from './hotelSeo';
import { absoluteUrl } from './utils';
import { isHotelSurfaceEnabled } from './hotelLaunchGate';

export function generateHotelSchema(hotel: Hotel, lang: string = 'tr') {
  const hotelName = getLocalizedText(hotel.name, lang);
  const location = getLocalizedText(hotel.location, lang);
  const description = getLocalizedText(hotel.description, lang);
  const about = getLocalizedText(hotel.about, lang);

  const [city, country] = location.split(',').map(s => s.trim());

  const url = buildHotelPublicUrl(hotel, lang);

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': url,
    url: url,
    name: hotelName,
    description: about || description || `${hotelName} - ${lang === 'en' ? 'Comfortable accommodation' : 'Konforlu konaklama imkanı'}`,
    image: hotel.galleryImages && hotel.galleryImages.length > 0
      ? hotel.galleryImages
      : hotel.coverImageUrl
        ? [hotel.coverImageUrl]
        : [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: city || location,
      addressCountry: country || 'TR',
    }
  };

  if (hotel.latitude && hotel.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: hotel.latitude,
      longitude: hotel.longitude,
    };
  }

  if (hotel.gnkScore) {
    schema.starRating = {
      '@type': 'Rating',
      ratingValue: hotel.gnkScore.toString(),
      bestRating: '10',
      worstRating: '1',
    };
  }

  const rawReviewCount = (hotel as Hotel & { reviewCount?: unknown }).reviewCount;
  const verifiedReviewCount =
    typeof rawReviewCount === 'number'
      ? Number.isInteger(rawReviewCount) && rawReviewCount > 0
        ? String(rawReviewCount)
        : null
      : typeof rawReviewCount === 'string' && /^[1-9]\d*$/.test(rawReviewCount.trim())
        ? rawReviewCount.trim()
        : null;

  if (hotel.gnkScore && verifiedReviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: hotel.gnkScore.toString(),
      bestRating: '10',
      worstRating: '1',
      reviewCount: verifiedReviewCount,
    };
  }

  if (hotel.price) {
    schema.priceRange = hotel.price < 2000 ? '$' : hotel.price < 5000 ? '$$' : '$$$';
  }

  if (hotel.amenities && hotel.amenities.length > 0) {
    schema.amenityFeature = hotel.amenities.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    }));
  }

  if (hotel.website_url) {
    schema.sameAs = [hotel.website_url];
  }

  if (hotel.google_maps_url) {
    schema.hasMap = hotel.google_maps_url;
  }

  return schema;
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  const validFaqs = Array.isArray(faqs)
    ? faqs.filter(
        (faq) =>
          typeof faq?.question === 'string' &&
          faq.question.trim().length > 0 &&
          typeof faq?.answer === 'string' &&
          faq.answer.trim().length > 0
      )
    : [];
  if (validFaqs.length === 0) {
    return null;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.trim(),
      },
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  content: string;
  slug: string;
  slug_en?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: { name: string; image?: string };
}, lang: string = 'tr') {

  // TR: /rehber/slug
  // EN: /guide/slug_en
  const pathPrefix = lang === 'en' ? 'guide' : 'rehber';
  const slug = (lang === 'en' && article.slug_en) ? article.slug_en : article.slug;
  const url = encodeURI(absoluteUrl(`/${pathPrefix}/${slug}`, lang));
  const baseUrl = absoluteUrl('/', lang);

  const orgName = lang === 'en' ? 'World And Hotels' : 'Yerini Ayır';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.coverImage || `${baseUrl}yeriniayir-logo.png`,
    datePublished: article.createdAt || new Date().toISOString(),
    dateModified: article.updatedAt || article.createdAt || new Date().toISOString(),
    url: url,
    author: {
      '@type': 'Person',
      name: article.author?.name || (lang === 'en' ? 'Travel Guide' : 'Yerini Ayır Rehberi'),
      image: article.author?.image ? `${baseUrl}${article.author.image}` : undefined
    },
    publisher: {
      '@type': 'Organization',
      name: orgName,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationSchema(lang: string = 'tr') {
  const hotelEnabled = isHotelSurfaceEnabled();
  const baseUrl = absoluteUrl('/', lang);
  const orgName = lang === 'en' && hotelEnabled ? 'World And Hotels' : 'Yerini Ayır';
  const description = hotelEnabled
    ? lang === 'en'
      ? 'Verified neighborhood gastronomy selections and curated hotel guide across Turkey.'
      : 'Doğrulanmış yerel gastronomi seçkileri ve Türkiye genelinde seçkin konaklama rehberi.'
    : lang === 'en'
      ? 'Independent local gastronomy discovery guide featuring curated restaurants, cafes, and regional culinary stops across Turkey.'
      : 'Türkiye genelinde bağımsız restoran, kafe ve yerel lezzet duraklarını derleyen gastronomi keşif rehberi.';

  return {
    '@context': 'https://schema.org',
    '@id': `${baseUrl}#organization`,
    '@type': 'Organization',
    name: orgName,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}logo.svg`,
      width: '800',
      height: '250'
    },
    description: description,
    sameAs: [
      'https://www.instagram.com/yeriniayir/',
    ],
  };
}

export function generateWebSiteSchema(lang: string = 'tr') {
  const hotelEnabled = isHotelSurfaceEnabled();
  const baseUrl = absoluteUrl('/', lang);
  const siteName = lang === 'en' && hotelEnabled ? 'World And Hotels' : 'Yerini Ayır';

  return {
    '@context': 'https://schema.org',
    '@id': `${baseUrl}#website`,
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    inLanguage: lang === 'en' ? 'en' : 'tr-TR',
    publisher: {
      '@id': `${baseUrl}#organization`,
    },
    ...(hotelEnabled
      ? {
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          },
        }
      : {}),
  };
}

