import { Hotel } from './types';
import { getLocalizedText } from './localization';

export function generateHotelSchema(hotel: Hotel) {
  const hotelName = getLocalizedText(hotel.name);
  const location = getLocalizedText(hotel.location);
  const description = getLocalizedText(hotel.description);

  const [city, country] = location.split(',').map(s => s.trim());

  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotelName,
    description: description || hotel.about || `${hotelName} - Konforlu konaklama imkanı`,
    image: hotel.galleryImages && hotel.galleryImages.length > 0
      ? hotel.galleryImages
      : hotel.coverImageUrl
        ? [hotel.coverImageUrl]
        : [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: city || location,
      addressCountry: country || 'TR',
    },
    ...(hotel.latitude && hotel.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: hotel.latitude,
        longitude: hotel.longitude,
      },
    }),
    ...(hotel.gnkScore && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: hotel.gnkScore.toString(),
        bestRating: '10',
        worstRating: '1',
      },
    }),
    ...(hotel.price && {
      priceRange: hotel.price < 2000 ? '$' : hotel.price < 5000 ? '$$' : '$$$',
    }),
    ...(hotel.amenities && hotel.amenities.length > 0 && {
      amenityFeature: hotel.amenities.map(amenity => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity,
      })),
    }),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  content: string;
  slug: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gnkhotels.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.coverImage || `${baseUrl}/og-image.jpg`,
    datePublished: article.createdAt || new Date().toISOString(),
    dateModified: article.updatedAt || article.createdAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article.author || 'GNK Otel Rehberi',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GNK Otel Rehberi',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/rehber/${article.slug}`,
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

export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gnkhotels.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GNK Otel Rehberi',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: "Türkiye'nin en güvenilir otel rehberi - Erdem'in seçtiği en iyi oteller",
    sameAs: [],
  };
}
