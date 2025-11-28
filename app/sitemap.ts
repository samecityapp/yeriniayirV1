import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gnkhotels.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: hotels } = await supabase
    .from('hotels')
    .select('id, updated_at')
    .is('deleted_at', null);

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .is('deleted_at', null);

  const hotelUrls = (hotels || []).map(hotel => ({
    url: `${BASE_URL}/otel/${hotel.id}`,
    lastModified: hotel.updated_at ? new Date(hotel.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const articleUrls = (articles || []).map(article => ({
    url: `${BASE_URL}/rehber/${article.slug}`,
    lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rehber`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  ];

  return [...staticUrls, ...hotelUrls, ...articleUrls];
}
