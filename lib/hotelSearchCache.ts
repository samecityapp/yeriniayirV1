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
const EMPTY_CATALOG: HotelSearchCatalog = { tags: [], priceTags: [], hotels: [] };

let cachedCatalog: HotelSearchCatalog | null = null;
let cachedAt = 0;
let inFlightPromise: Promise<HotelSearchCatalog> | null = null;

export function resetHotelSearchCatalogCacheForTests(): void {
  cachedCatalog = null;
  cachedAt = 0;
  inFlightPromise = null;
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
      const [tagsRes, priceTagsRes, hotelsRes] = await Promise.all([
        supabase
          .from('tags')
          .select('id, name, slug, icon, is_featured')
          .is('deleted_at', null)
          .order('name', { ascending: true })
          .limit(100),
        supabase
          .from('price_tags')
          .select('id, label, slug, min_price, max_price')
          .is('deleted_at', null)
          .order('min_price', { ascending: true })
          .limit(50),
        supabase
          .from('hotels')
          .select('id, name, location, price, rating, image_url, tags, amenities, gallery_images, about, description')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      const catalog: HotelSearchCatalog = {
        tags: Array.isArray(tagsRes.data) ? (tagsRes.data as RawTagRow[]) : [],
        priceTags: Array.isArray(priceTagsRes.data) ? (priceTagsRes.data as RawPriceTagRow[]) : [],
        hotels: Array.isArray(hotelsRes.data) ? (hotelsRes.data as RawHotelSearchRow[]) : [],
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
