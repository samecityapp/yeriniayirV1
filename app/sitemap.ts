import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gnkhotels.com';
const MAX_URLS = 50000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data: hotels } = await supabase
      .from('hotels')
      .select('id, updated_at')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .limit(Math.floor(MAX_URLS * 0.7));

    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false })
      .limit(Math.floor(MAX_URLS * 0.3));

    const staticUrls: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/search`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/rehber`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }
    ];

    const hotelUrls: MetadataRoute.Sitemap = (hotels || []).map(hotel => ({
      url: `${BASE_URL}/otel/${hotel.id}`,
      lastModified: hotel.updated_at ? new Date(hotel.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const articleUrls: MetadataRoute.Sitemap = (articles || []).map(article => ({
      url: `${BASE_URL}/rehber/${article.slug}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const allUrls = [...staticUrls, ...hotelUrls, ...articleUrls];

    return allUrls.slice(0, MAX_URLS);
  } catch (error) {
    console.error('Error generating sitemap:', error);

    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      }
    ];
  }
}
