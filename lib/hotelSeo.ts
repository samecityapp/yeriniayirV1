import { EN_SITE_ORIGIN, TR_SITE_ORIGIN } from '@/lib/gastronomy-v3/geoCatalog';

const VALID_HOTEL_IDENTIFIER_RE = /^[a-z0-9-]+$/i;

export type HotelSeoIdentifierInput =
  | string
  | {
      id: string;
      slug?: string | null;
    };

export function getHotelPublicIdentifier(hotelOrId: HotelSeoIdentifierInput): string {
  if (typeof hotelOrId === 'string') {
    return hotelOrId.trim();
  }
  const slug = typeof hotelOrId.slug === 'string' ? hotelOrId.slug.trim() : '';
  if (slug && VALID_HOTEL_IDENTIFIER_RE.test(slug)) {
    return slug;
  }
  return String(hotelOrId.id || '').trim();
}

export function buildHotelPublicUrl(
  hotelOrId: HotelSeoIdentifierInput,
  lang: string = 'tr'
): string {
  const safeId = encodeURIComponent(getHotelPublicIdentifier(hotelOrId));
  if (lang === 'en') {
    return `${EN_SITE_ORIGIN}/hotel/${safeId}`;
  }
  if (lang === 'el') {
    return `${TR_SITE_ORIGIN}/el/otel/${safeId}`;
  }
  return `${TR_SITE_ORIGIN}/otel/${safeId}`;
}

export function buildHotelAlternates(
  hotelOrId: HotelSeoIdentifierInput,
  currentLang: string = 'tr'
): {
  canonical: string;
  languages: {
    'tr-TR': string;
    en: string;
    'x-default': string;
  };
} {
  const trUrl = buildHotelPublicUrl(hotelOrId, 'tr');
  const enUrl = buildHotelPublicUrl(hotelOrId, 'en');
  return {
    canonical: buildHotelPublicUrl(hotelOrId, currentLang),
    languages: {
      'tr-TR': trUrl,
      en: enUrl,
      'x-default': trUrl,
    },
  };
}
