import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.yeriniayir.com';

  // Get all hotels
  const hotels = await db.hotels.getAll();
  const hotelUrls = hotels.map((hotel) => ({
    url: `${baseUrl}/otel/${hotel.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Get all articles
  const articles = await db.articles.getAll();
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/rehber/${article.slug}`,
    lastModified: new Date(article.published_at || article.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Get all location pages
  const locationUrls = (require('@/lib/constants').LOCATIONS as any[]).map((loc) => ({
    url: `${baseUrl}/otel/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rehber`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/kullanim-sartlari`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...hotelUrls,
    ...articleUrls,
    ...locationUrls,
  ];
}
