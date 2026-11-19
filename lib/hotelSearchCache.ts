import { isSupabaseIsolated, supabase } from '@/lib/supabase';

export interface RawHotelSearchRow {
  id: string;
  name: unknown;
  location: unknown;
  price?: number | string | null;
  rating?: number | string | null;
  image_url?: string | null;
  tags?: string[] | null;
  amenities?: string[] | null;
  gallery_images?: string[] | null;
  about?: unknown;
  description?: unknown;
}

export interface RawTagRow {
  id: string;
  name: unknown;
  slug: string;
  icon?: string | null;
  is_featured?: boolean | null;
}

export interface RawPriceTagRow {
  id: string;
  label: string;
  slug: string;
  min_price: number;
  max_price: number;
}

export interface HotelSearchCatalog {
  tags: RawTagRow[];
  priceTags: RawPriceTagRow[];
  hotels: RawHotelSearchRow[];
}

const CATALOG_CACHE_TTL_MS = 5 * 60 * 1000;
const HOTEL_PAGE_SIZE = 100;
const MAX_HOTEL_PAGES = 25; // Deterministic ceiling: up to 2,500 active hotels
const EMPTY_CATALOG: HotelSearchCatalog = { tags: [], priceTags: [], hotels: [] };

let cachedCatalog: HotelSearchCatalog | null = null;
let cachedAt = 0;
let inFlightPromise: Promise<HotelSearchCatalog> | null = null;

export function resetHotelSearchCatalogCacheForTests(): void {
  cachedCatalog = null;
  cachedAt = 0;
  inFlightPromise = null;
}

async function fetchAllActiveHotels(): Promise<RawHotelSearchRow[]> {
  const allRows: RawHotelSearchRow[] = [];
  const seenIds = new Set<string>();

  for (let page = 0; page < MAX_HOTEL_PAGES; page++) {
    const offset = page * HOTEL_PAGE_SIZE;
    const baseQuery = supabase
      .from('hotels')
      .select('id, name, location, price, rating, image_url, tags, amenities, gallery_images, about, description')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .order('id', { ascending: true }) as unknown as {
      range?: (from: number, to: number) => Promise<{ data?: unknown[] | null; error?: unknown }>;
      limit?: (n: number) => Promise<{ data?: unknown[] | null; error?: unknown }>;
    };

    const usesRange = typeof baseQuery.range === 'function';
    const res = usesRange
      ? await baseQuery.range!(offset, offset + HOTEL_PAGE_SIZE - 1)
      : await baseQuery.limit!(HOTEL_PAGE_SIZE);

    if (res?.error || !Array.isArray(res?.data) || res.data.length === 0) {
      break;
    }

    for (const raw of res.data as RawHotelSearchRow[]) {
      if (raw && typeof raw.id === 'string' && !seenIds.has(raw.id)) {
        seenIds.add(raw.id);
        allRows.push(raw);
      }
    }

    if (!usesRange || res.data.length < HOTEL_PAGE_SIZE) {
      break;
    }
  }

  return allRows;
}

export async function loadHotelSearchCatalog(): Promise<HotelSearchCatalog> {
  if (isSupabaseIsolated) {
    return EMPTY_CATALOG;
  }

  const now = Date.now();
  if (cachedCatalog && now - cachedAt < CATALOG_CACHE_TTL_MS) {
    return cachedCatalog;
  }

  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const [tagsRes, priceTagsRes, hotels] = await Promise.all([
        supabase
          .from('tags')
          .select('id, name, slug, icon, is_featured')
          .is('deleted_at', null)
          .order('name', { ascending: true })
          .limit(500),
        supabase
          .from('price_tags')
          .select('id, label, slug, min_price, max_price')
          .is('deleted_at', null)
          .order('min_price', { ascending: true })
          .limit(100),
        fetchAllActiveHotels(),
      ]);

      const catalog: HotelSearchCatalog = {
        tags: Array.isArray(tagsRes.data) ? (tagsRes.data as RawTagRow[]) : [],
        priceTags: Array.isArray(priceTagsRes.data) ? (priceTagsRes.data as RawPriceTagRow[]) : [],
        hotels,
      };
      cachedCatalog = catalog;
      cachedAt = Date.now();
      return catalog;
    } catch {
      return EMPTY_CATALOG;
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}
