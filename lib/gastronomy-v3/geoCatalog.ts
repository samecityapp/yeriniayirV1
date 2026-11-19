import { getStaticRegionVenuePayload, type StaticRegionVenuePayload } from '@/lib/food/regionDiscovery';
import type { FoodCategory, FoodLocation } from '@/lib/food/types';
import { getPublishedV3Snapshot, V3_LOCATIONS } from './registry';
import type { V3VerifiedRegionSnapshot } from './types';

export const TR_SITE_ORIGIN = 'https://www.yeriniayir.com';
export const EN_SITE_ORIGIN = 'https://www.worldandhotels.com';

const CITY_SLUG_LABELS: Record<string, { tr: string; en: string }> = {
  adana: { tr: 'Adana', en: 'Adana' },
  ankara: { tr: 'Ankara', en: 'Ankara' },
  antalya: { tr: 'Antalya', en: 'Antalya' },
  aydin: { tr: 'Aydın', en: 'Aydin' },
  balikesir: { tr: 'Balıkesir', en: 'Balikesir' },
  bursa: { tr: 'Bursa', en: 'Bursa' },
  canakkale: { tr: 'Çanakkale', en: 'Canakkale' },
  denizli: { tr: 'Denizli', en: 'Denizli' },
  diyarbakir: { tr: 'Diyarbakır', en: 'Diyarbakir' },
  edirne: { tr: 'Edirne', en: 'Edirne' },
  eskisehir: { tr: 'Eskişehir', en: 'Eskisehir' },
  gaziantep: { tr: 'Gaziantep', en: 'Gaziantep' },
  hatay: { tr: 'Hatay', en: 'Hatay' },
  istanbul: { tr: 'İstanbul', en: 'Istanbul' },
  izmir: { tr: 'İzmir', en: 'Izmir' },
  mardin: { tr: 'Mardin', en: 'Mardin' },
  mersin: { tr: 'Mersin', en: 'Mersin' },
  mugla: { tr: 'Muğla', en: 'Mugla' },
  rize: { tr: 'Rize', en: 'Rize' },
  sanliurfa: { tr: 'Şanlıurfa', en: 'Sanliurfa' },
  trabzon: { tr: 'Trabzon', en: 'Trabzon' },
};

const SEGMENT_RE = /^[a-z0-9-]+$/;

export interface GeoCitySummary {
  citySlug: string;
  cityName: string;
  regions: FoodLocation[];
  districts: { districtSlug: string; districtName: string; regions: FoodLocation[] }[];
}

export interface GeoActiveCategoryMeta {
  id: string;
  slug: string;
  label: string;
  title: string;
  emoji: string;
  venueCount: number;
}

export type ResolvedGeoRoute =
  | {
      kind: 'city';
      city: GeoCitySummary;
    }
  | {
      kind: 'district-hub';
      citySlug: string;
      cityName: string;
      districtSlug: string;
      districtName: string;
      childRegions: FoodLocation[];
    }
  | {
      kind: 'region';
      location: FoodLocation;
      snapshot: V3VerifiedRegionSnapshot;
      payload: StaticRegionVenuePayload;
      activeCategories: GeoActiveCategoryMeta[];
      childRegions: FoodLocation[];
    }
  | {
      kind: 'category';
      location: FoodLocation;
      snapshot: V3VerifiedRegionSnapshot;
      payload: StaticRegionVenuePayload;
      category: GeoActiveCategoryMeta;
      activeCategories: GeoActiveCategoryMeta[];
      childRegions: FoodLocation[];
    };

const REGION_BY_PATH_KEY = new Map<string, FoodLocation>(
  V3_LOCATIONS.map((loc) => [loc.path.join('/'), loc])
);

const CITIES_LIST: GeoCitySummary[] = (() => {
  const byCity = new Map<string, FoodLocation[]>();
  for (const loc of V3_LOCATIONS) {
    const cSlug = loc.path[0];
    if (!cSlug) continue;
    const list = byCity.get(cSlug) || [];
    list.push(loc);
    byCity.set(cSlug, list);
  }

  return Array.from(byCity.entries())
    .map(([citySlug, regions]) => {
      const cityName =
        CITY_SLUG_LABELS[citySlug]?.tr || regions[0]?.city || citySlug;
      const byDistrict = new Map<string, { districtName: string; regions: FoodLocation[] }>();
      for (const r of regions) {
        const dSlug = r.path[1] || r.slug;
        const dGroup = byDistrict.get(dSlug) || {
          districtName: r.district || r.neighborhood || r.name,
          regions: [],
        };
        dGroup.regions.push(r);
        byDistrict.set(dSlug, dGroup);
      }
      const districts = Array.from(byDistrict.entries()).map(([districtSlug, info]) => ({
        districtSlug,
        districtName: info.districtName,
        regions: info.regions,
      }));
      return { citySlug, cityName, regions, districts };
    })
    .sort((a, b) => b.regions.length - a.regions.length || a.citySlug.localeCompare(b.citySlug));
})();

const CITY_BY_SLUG = new Map(CITIES_LIST.map((c) => [c.citySlug, c]));

const DISTRICT_HUB_BY_KEY = new Map<
  string,
  {
    citySlug: string;
    cityName: string;
    districtSlug: string;
    districtName: string;
    childRegions: FoodLocation[];
  }
>();

for (const city of CITIES_LIST) {
  for (const loc of city.regions) {
    if (loc.path.length === 3) {
      const dSlug = loc.path[1];
      const key = `${city.citySlug}/${dSlug}`;
      const existing = DISTRICT_HUB_BY_KEY.get(key) || {
        citySlug: city.citySlug,
        cityName: city.cityName,
        districtSlug: dSlug,
        districtName: loc.district || dSlug,
        childRegions: [],
      };
      existing.childRegions.push(loc);
      DISTRICT_HUB_BY_KEY.set(key, existing);
    }
  }
}

export function getGeoCities(): readonly GeoCitySummary[] {
  return CITIES_LIST;
}

export function getGeoCityBySlug(citySlug: string): GeoCitySummary | null {
  return CITY_BY_SLUG.get(citySlug) || null;
}

export function getGeoDistrictHubs(): Array<{
  citySlug: string;
  cityName: string;
  districtSlug: string;
  districtName: string;
  childRegions: FoodLocation[];
}> {
  return Array.from(DISTRICT_HUB_BY_KEY.values()).filter(
    (d) => !REGION_BY_PATH_KEY.has(`${d.citySlug}/${d.districtSlug}`)
  );
}

export function getChildRegionsForLocation(loc: FoodLocation): FoodLocation[] {
  if (loc.path.length !== 2) return [];
  return V3_LOCATIONS.filter(
    (other) =>
      other.id !== loc.id &&
      other.path.length === 3 &&
      other.path[0] === loc.path[0] &&
      other.path[1] === loc.path[1]
  );
}

export function getSiblingRegionsForLocation(loc: FoodLocation): FoodLocation[] {
  const sameCity = V3_LOCATIONS.filter((other) => other.path[0] === loc.path[0] && other.id !== loc.id);
  if (loc.path.length === 3) {
    const sameDistrict = sameCity.filter((other) => other.path[1] === loc.path[1]);
    const rest = sameCity.filter((other) => other.path[1] !== loc.path[1]);
    return [...sameDistrict, ...rest].slice(0, 8);
  }
  return sameCity.slice(0, 8);
}

export function computeActiveCategoriesFromPayload(
  payload: StaticRegionVenuePayload,
  snapshot: V3VerifiedRegionSnapshot
): GeoActiveCategoryMeta[] {
  const snapCatBySlug = new Map(snapshot.categories.map((c) => [c.slug, c]));
  const active: GeoActiveCategoryMeta[] = [];

  for (const cat of payload.categories) {
    const matchingVenues = payload.venues.filter((v) => v.categorySlugs.includes(cat.slug));
    if (matchingVenues.length === 0) continue;
    const snapCat = snapCatBySlug.get(cat.slug);
    active.push({
      id: snapCat?.id || cat.slug,
      slug: cat.slug,
      label: cat.label,
      title: cat.title || snapCat?.title || cat.label,
      emoji: cat.emoji || snapCat?.emoji || '🍽️',
      venueCount: matchingVenues.length,
    });
  }
  return active;
}

export async function getRegionBundle(
  loc: FoodLocation
): Promise<{
  snapshot: V3VerifiedRegionSnapshot;
  payload: StaticRegionVenuePayload;
  activeCategories: GeoActiveCategoryMeta[];
  childRegions: FoodLocation[];
} | null> {
  const snapshot = getPublishedV3Snapshot(loc.slug);
  const payload = await getStaticRegionVenuePayload(loc.slug);
  if (!snapshot || !payload) return null;
  const activeCategories = computeActiveCategoriesFromPayload(payload, snapshot);
  const childRegions = getChildRegionsForLocation(loc);
  return { snapshot, payload, activeCategories, childRegions };
}

export async function resolveGeoHierarchySegments(
  rawSegments: string[]
): Promise<ResolvedGeoRoute | null> {
  if (!Array.isArray(rawSegments) || rawSegments.length === 0 || rawSegments.length > 4) {
    return null;
  }
  if (rawSegments.some((s) => !s || !SEGMENT_RE.test(s))) {
    return null;
  }
  if (rawSegments[0] === 'mekan' || rawSegments[0] === 'venue') {
    return null;
  }

  // 1 segment: city hub (/gastronomi/istanbul)
  if (rawSegments.length === 1) {
    const city = getGeoCityBySlug(rawSegments[0]);
    if (!city) return null;
    return { kind: 'city', city };
  }

  // 2..3 segments: exact published region match
  const exactPathKey = rawSegments.join('/');
  const exactRegion = REGION_BY_PATH_KEY.get(exactPathKey);
  if (exactRegion) {
    const bundle = await getRegionBundle(exactRegion);
    if (!bundle) return null;
    return {
      kind: 'region',
      location: exactRegion,
      ...bundle,
    };
  }

  // 2 segments without standalone region -> district hub (/gastronomi/mugla/bodrum)
  if (rawSegments.length === 2) {
    const hub = DISTRICT_HUB_BY_KEY.get(exactPathKey);
    if (hub) {
      return {
        kind: 'district-hub',
        ...hub,
      };
    }
    return null;
  }

  // 3 or 4 segments: regionPath + categorySlug
  const parentPathKey = rawSegments.slice(0, -1).join('/');
  const categorySlug = rawSegments[rawSegments.length - 1];
  const parentRegion = REGION_BY_PATH_KEY.get(parentPathKey);
  if (parentRegion) {
    const bundle = await getRegionBundle(parentRegion);
    if (!bundle) return null;
    const category = bundle.activeCategories.find((c) => c.slug === categorySlug);
    if (!category) return null;
    return {
      kind: 'category',
      location: parentRegion,
      ...bundle,
      category,
    };
  }

  return null;
}

export function buildGeoPageHref(
  subPath: string,
  lang: 'tr' | 'en',
  mode: 'internal' | 'public' = 'internal'
): string {
  const trimmed = (subPath || '').trim();
  const isHub = !trimmed || trimmed === '/';
  if (isHub) {
    if (lang === 'en') return mode === 'internal' ? '/en/gastronomy' : '/gastronomy';
    return mode === 'internal' ? '/tr/gastronomi' : '/gastronomi';
  }
  const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (lang === 'en') {
    const enClean = clean.replace(/^\/mekan\//, '/venue/');
    return mode === 'internal' ? `/en/gastronomy${enClean}` : `/gastronomy${enClean}`;
  }
  return mode === 'internal' ? `/tr/gastronomi${clean}` : `/gastronomi${clean}`;
}

export function buildGeoPublicUrl(subPath: string, lang: 'tr' | 'en'): string {
  const trimmed = (subPath || '').trim();
  const isHub = !trimmed || trimmed === '/';
  if (isHub) {
    return lang === 'en' ? `${EN_SITE_ORIGIN}/gastronomy` : `${TR_SITE_ORIGIN}/gastronomi`;
  }
  const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (lang === 'en') {
    const enClean = clean.replace(/^\/mekan\//, '/venue/');
    return `${EN_SITE_ORIGIN}/gastronomy${enClean}`;
  }
  return `${TR_SITE_ORIGIN}/gastronomi${clean}`;
}

export function buildGeoAlternates(subPath: string, lang: 'tr' | 'en') {
  const trUrl = buildGeoPublicUrl(subPath, 'tr');
  const enUrl = buildGeoPublicUrl(subPath, 'en');
  return {
    canonical: lang === 'en' ? enUrl : trUrl,
    languages: {
      'tr-TR': trUrl,
      en: enUrl,
      'x-default': trUrl,
    },
  };
}

export function buildGeoRootAlternates(lang: 'tr' | 'en') {
  return {
    canonical: lang === 'en' ? EN_SITE_ORIGIN : TR_SITE_ORIGIN,
    languages: {
      'tr-TR': TR_SITE_ORIGIN,
      en: EN_SITE_ORIGIN,
      'x-default': TR_SITE_ORIGIN,
    },
  };
}

export function buildGeoSocialMetadata(params: {
  title: string;
  description: string;
  url: string;
  lang: 'tr' | 'en';
  type?: 'website' | 'article';
  imageUrl?: string;
}) {
  const origin = params.lang === 'en' ? EN_SITE_ORIGIN : TR_SITE_ORIGIN;
  const siteName = params.lang === 'en' ? 'World And Hotels' : 'Yerini Ayır';
  const locale = params.lang === 'en' ? 'en_US' : 'tr_TR';
  const image = params.imageUrl || `${origin}/yeriniayir-logo.png`;

  return {
    openGraph: {
      title: params.title,
      description: params.description,
      url: params.url,
      siteName,
      locale,
      type: params.type ?? 'website',
      images: [
        {
          url: image,
          alt: `${siteName} — ${params.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: params.title,
      description: params.description,
      images: [image],
    },
  };
}

export function getModaKadikoyPilotStaticParamTuples(): Array<{ segments: string[] }> {
  const tuples: Array<{ segments: string[] }> = [
    { segments: ['istanbul'] },
    { segments: ['istanbul', 'kadikoy'] },
    { segments: ['istanbul', 'kadikoy', 'moda'] },
  ];
  for (const slug of ['kadikoy', 'moda']) {
    const loc = V3_LOCATIONS.find((l) => l.slug === slug);
    const snap = getPublishedV3Snapshot(slug);
    if (!loc || !snap) continue;
    for (const cat of snap.categories) {
      const catMatches = snap.venues.some(
        (v) => v.categoryId === cat.id || (v.secondaryCategoryIds || []).includes(cat.id)
      );
      if (catMatches) {
        tuples.push({ segments: [...loc.path, cat.slug] });
      }
    }
  }
  return tuples;
}

export function getFoodCategoryTitleEn(cat: Pick<FoodCategory, 'slug' | 'title' | 'label'>): string {
  const map: Record<string, string> = {
    pizza: 'Artisan & Wood-Fired Pizza',
    hamburger: 'Craft Burgers',
    kahve: 'Specialty Coffee',
    'date-mekanlari': 'Evening Dining & Wine Spots',
    kahvalti: 'Breakfast & Sourdough Bakeries',
    denemelisin: 'Notable Culinary Institutions & Must-Try Stops',
    'balik-deniz-urunleri': 'Seafood & Coastal Taverns',
  };
  return map[cat.slug] || cat.title || cat.label;
}

export function getCityNameLocalized(citySlug: string, fallbackName: string, lang: 'tr' | 'en'): string {
  const entry = CITY_SLUG_LABELS[citySlug];
  if (!entry) return fallbackName;
  return lang === 'en' ? entry.en : entry.tr;
}
