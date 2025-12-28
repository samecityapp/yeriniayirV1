import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/jilinrime/', '/api/'],
    },
    sitemap: 'https://www.yeriniayir.com/sitemap.xml',
  };
}
