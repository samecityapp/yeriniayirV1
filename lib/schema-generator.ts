import { Hotel } from './types';
import { getLocalizedText } from './localization';
import { absoluteUrl } from './utils';

export function generateHotelSchema(hotel: Hotel, lang: string = 'tr') {
  const hotelName = getLocalizedText(hotel.name, lang);
  const location = getLocalizedText(hotel.location, lang);
  const description = getLocalizedText(hotel.description, lang);
  const about = getLocalizedText(hotel.about, lang);

  const [city, country] = location.split(',').map(s => s.trim());

  // Determine standard path. TR -> /otel/, EN -> /hotel/ (per rewritten logic)
  // But strictly internal ID should match the canonical URL.
  // absoluteUrl handles domain. We just need to give it the correct path prefix relative to lang.
  // TR: /otel/slug
  // EN: /hotel/slug
  const pathPrefix = lang === 'en' ? 'hotel' : 'otel';
  const url = absoluteUrl(`/${pathPrefix}/${hotel.slug || hotel.id}`, lang);

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
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: hotel.gnkScore.toString(),
      bestRating: '10',
      worstRating: '1',
      reviewCount: '1',
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
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
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
  const url = absoluteUrl(`/${pathPrefix}/${slug}`, lang);
  const baseUrl = absoluteUrl('/', lang);

  const orgName = lang === 'en' ? 'World And Hotels' : 'Yerini Ayır';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.coverImage || `${baseUrl}og-image.jpg`,
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
  const baseUrl = absoluteUrl('/', lang);
  const orgName = lang === 'en' ? 'World And Hotels' : 'Yerini Ayır';
  const description = lang === 'en'
    ? "Turkey's most exclusive hotels and travel guide - Best accommodation suggestions"
    : "Türkiye'nin en seçkin otelleri ve gezi rehberi - Erdem'in kaleminden en iyi konaklama önerileri";

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
      // Add social media URLs here if available
    ],
  };
}

export function generateWebSiteSchema(lang: string = 'tr') {
  const baseUrl = absoluteUrl('/', lang);
  const siteName = lang === 'en' ? 'World And Hotels' : 'Yerini Ayır';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

