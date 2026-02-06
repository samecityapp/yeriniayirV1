import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const TR_DOMAIN = 'https://www.yeriniayir.com';
  const EN_DOMAIN = 'https://www.worldandhotels.com';

  // Get all hotels
  const hotels = await db.hotels.getAll();
  const hotelUrls = hotels.flatMap((hotel) => {
    // TR URL
    const tr = {
      url: `${TR_DOMAIN}/otel/${hotel.slug || hotel.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
    // EN URL
    const en = {
      url: `${EN_DOMAIN}/hotel/${hotel.slug || hotel.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
    return [tr, en];
  });

  // Get all articles
  const articles = await db.articles.getAll();
  const articleUrls = articles.flatMap((article) => {
    // Turkish URL
    const trUrl = {
      url: `${TR_DOMAIN}/rehber/${article.slug}`,
      lastModified: new Date(article.published_at || article.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };

    // English URL
    const enUrl = {
      url: `${EN_DOMAIN}/guide/${(article as any).slug_en || article.slug}`,
      lastModified: new Date(article.published_at || article.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };

    return [trUrl, enUrl];
  });

  // Get all location pages
  const locationUrls = (require('@/lib/constants').LOCATIONS as any[]).flatMap((loc) => {
    // TR
    const tr = {
      url: `${TR_DOMAIN}/otel/${loc.slug}`, // Listing pages usually /otel/slug
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
    // EN
    const en = {
      url: `${EN_DOMAIN}/hotel/${loc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
    return [tr, en];
  });

  // Static Pages
  const staticPages = [
    // Home
    { url: TR_DOMAIN, priority: 1 },
    { url: EN_DOMAIN, priority: 1 },
    // Search
    { url: `${TR_DOMAIN}/otel`, priority: 0.9 }, // assuming /otel is search/list
    { url: `${EN_DOMAIN}/hotel`, priority: 0.9 },
    // About / Static
    { url: `${TR_DOMAIN}/hakkimizda`, priority: 0.5 },
    { url: `${EN_DOMAIN}/about`, priority: 0.5 }, // Assuming /about exists or rewritten
  ];

  return [
    ...staticPages.map(page => ({
      url: page.url,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: page.priority,
    })),
    ...hotelUrls,
    ...articleUrls,
    ...locationUrls,
  ];
}
