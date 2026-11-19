import { MetadataRoute } from 'next';
import { isLocalFoodPreviewSync } from '@/lib/food/localPreview';

const DISALLOW_PRIVATE_PATHS = [
  '/jilinrime/',
  '/gastronomi-yonetimi/',
  '/moda-kadikoy-pilot/',
  '/design-demo',
  '/preview-food-card',
  '/fethiye-yemek-rehberi',
  '/api/',
];

const ALLOW_PUBLIC_PATHS = ['/', '/llms.txt', '/llms-full.txt'];

const BOT_USER_AGENTS = [
  'Googlebot',
  'Google-Extended',
  'GoogleOther',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'PerplexityBot',
  'Perplexity-User',
  'Bingbot',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Applebot',
  'Applebot-Extended',
  '*',
];

export default function robots(): MetadataRoute.Robots {
  const isNonIndexableEnv =
    process.env.APP_ENVIRONMENT === 'staging' || isLocalFoodPreviewSync();

  if (isNonIndexableEnv) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: BOT_USER_AGENTS.map((userAgent) => ({
      userAgent,
      allow: ALLOW_PUBLIC_PATHS,
      disallow: DISALLOW_PRIVATE_PATHS,
    })),
    sitemap: [
      'https://www.yeriniayir.com/sitemap.xml',
      'https://www.worldandhotels.com/sitemap.xml',
    ],
  };
}
