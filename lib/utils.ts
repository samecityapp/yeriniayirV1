import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateReadingTime(text: string): number {
  if (!text) return 1;
  const wordsPerMinute = 200;
  // Strip HTML tags for accurate word count
  const cleanText = text.replace(/<[^>]*>/g, '');
  const numberOfWords = cleanText.split(/\s+/).length;
  return Math.ceil(numberOfWords / wordsPerMinute) || 1;
}

export function absoluteUrl(path: string, lang: string = 'tr'): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Decide domain based on language
  const DOMAIN_TR = 'yeriniayir.com';
  const DOMAIN_EN = 'worldandhotels.com';

  const domain = lang === 'tr' ? DOMAIN_TR : DOMAIN_EN;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  // In development, we might just use localhost but with different behavior,
  // or we can just stick to localhost:3000 for everything and rely on path logic.
  // But for production correctness:
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000/${lang}${cleanPath}`;
  }

  // Check if path already includes lang prefix to avoid doubling
  // The middleware rewrites /en/... to internal paths, but canonicals usually want clean paths.
  // If we are on worldandhotels.com, we want /guide/slug NOT /en/guide/slug if we strip it visually.
  // BUT the middleware I wrote KEEPS the /en prefix for rewriting.
  // Let's assume standard Next.js path structure: /locale/path
  // If we want worldandhotels.com/guide/slug, we need to strip /en from the path if it exists.

  // Current middleware logic:
  // yeriniayir.com -> /tr/... (default)
  // worldandhotels.com -> /en/... (default)

  // So:
  // absoluteUrl('/rehber/otel-1', 'tr') -> https://yeriniayir.com/rehber/otel-1
  // absoluteUrl('/guide/hotel-1', 'en') -> https://worldandhotels.com/guide/hotel-1

  // However, the inputs to this function usually come from Next.js needing a full URL.
  // Often we pass just the slug or relative path.

  // Let's keep it simple:
  // If we are generating a canonical for 'tr', we point to yeriniayir.com/tr/... or just yeriniayir.com/... ?
  // Usually /tr/ is hidden for default locale. 
  // Let's assume we want:
  // TR: https://yeriniayir.com/rehber/... (No /tr if default, but middleware adds it internally)
  // EN: https://worldandhotels.com/guide/... (No /en if default for that domain)

  // Implementation decision: STRIP the lang prefix from the final URL if it matches the domain's default.
  // Because the middleware handles the default locale injection.

  let finalPath = cleanPath;
  if (finalPath.startsWith(`/${lang}/`)) {
    finalPath = finalPath.replace(`/${lang}`, '');
  }

  return `${protocol}://${domain}${finalPath}`;
}