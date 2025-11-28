import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gnkhotels.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/anasayfa-yonetimi/',
          '/etiket-yonetimi/',
          '/otel-listesi/'
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
