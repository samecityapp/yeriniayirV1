/**
 * Yerini Ayır — Dinamik Gastronomi Keşif UI Sözleşmesi (UI Contract).
 *
 * Bu tipler UI katmanının tükettiği dinamik gastronomi modelini tanımlar:
 * 1. Bölgeye özel dinamik kategoriler (Moda != Gaziantep != Fethiye)
 * 2. Bölgesel "Buranın Ritüelleri" (kategori sekmelerinden bağımsız ayrı deneyim bölümü)
 * 3. Esnek "Mutlaka Denenmesi Gerekenler" kuralı (zorunlu değil; varsa daima 1. sırada)
 * 4. Mobil öncelikli, temiz, emojisiz navigasyon
 */
import type { PremiumRestaurantDetail } from '@/lib/types-premium/restaurant-detail';

/** Türkiye idari/coğrafi seviyeleri. `semt` resmi mahalle olmak zorunda değildir (örn. Moda). */
export type FoodLocationLevel = 'il' | 'ilce' | 'semt';

/**
 * published   → gerçek, doğrulanmış ve yayına hazır rehber (indekslenebilir)
 * demo        → tasarım önizlemesi; veriler örnek/temsili (asla indekslenmez)
 * coming_soon → rehber hazırlanıyor; seçilemez
 */
export type FoodRegionStatus = 'published' | 'demo' | 'coming_soon';

export interface FoodLocation {
  /** URL yoluyla aynı: 'istanbul/kadikoy/moda' veya 'gaziantep' */
  id: string;
  level: FoodLocationLevel;
  name: string;
  slug: string;
  /** URL segmentleri: ['istanbul', 'kadikoy', 'moda'] */
  path: string[];
  parentId?: string;
  /** Arama sonucunda gösterilen tam ad: 'Moda, Kadıköy, İstanbul' */
  displayName: string;
  city?: string;
  district?: string;
  neighborhood?: string;
  /** Başlıklarda kullanılan Türkçe bulunma hâli: "Moda'da", "Gaziantep'te" */
  locative: string;
  /** Arama eş anlamlıları (aksansız yazımlar dahil) */
  aliases?: string[];
  status: FoodRegionStatus;
  center?: { lat: number; lng: number };
  /** Kullanıcıya gösterilecek kapsam notu */
  scopeNote?: string;
  /** Bölgenin gastronomi karakter özeti (örn. "Güneydoğu mutfak mirası & UNESCO tescilli gastronomi") */
  characterSubtitle?: string;
}

export interface FoodCategory {
  slug: string;
  /** Sekme üzerinde gösterilen metin: "Kahve", "Kebap" */
  label: string;
  /** Başlıkta kullanılan ad: "Moda'da {title}" */
  title: string;
  /** Kategoriye ait emoji ikonu: "☕", "🍔", vb. */
  emoji?: string;
  /** Yalnızca "Mutlaka Denenmesi Gerekenler" için true (varsa daima 1. sırada) */
  isMustTry?: boolean;
}

/** Bir mekanın seçili bölgeyle coğrafi ilişkisi */
export type VenueScope = 'core' | 'nearby';

export interface FoodVenue extends PremiumRestaurantDetail {
  categorySlugs: string[];
  /** core: seçilen semtin içinde · nearby: yürüme mesafesindeki komşu bölge */
  scope: VenueScope;
  /** nearby ise hangi komşu bölgeden geldiği */
  nearbyAreaLabel?: string;
}

/** "Buranın Ritüelleri" - Standart yemek kategorilerinden bağımsız yerel deneyim */
export interface RitualStop {
  order: number;
  venueName: string;
  action: string;
  note?: string;
  mapsUrl?: string;
}

export interface FoodRitual {
  id: string;
  locationId: string;
  title: string;
  headline: string; // Örn: "Moda'da Böyle Yap" veya "Gaziantep'te Böyle Yap"
  summary: string;
  badgeText?: string;
  bestTime?: string;
  verifiedNote?: string;
  stops: RitualStop[];
  tips?: string[];
  imageUrl?: string;
}

export interface CategoryResult {
  location: FoodLocation;
  category: FoodCategory;
  coreVenues: FoodVenue[];
  nearbyVenues: FoodVenue[];
  /** Komşu bölgelere genişlendiyse kullanıcıya gösterilecek açıklama */
  expansionNote?: string;
  isDemo: boolean;
}

export interface FoodDiscoveryProvider {
  searchLocations(query: string): FoodLocation[];
  getLocationByPath(path: string[]): FoodLocation | undefined;
  getLocationBySlug(slug: string): FoodLocation | undefined;
  getChildren(locationId: string): FoodLocation[];
  getReadyRegions(): FoodLocation[];
  /** Bölgede gerçekten verisi olan dinamik kategoriler (en fazla 7 kategori) */
  getRegionCategories(locationId: string): FoodCategory[];
  getCategoryResult(locationId: string, categorySlug: string): CategoryResult | undefined;
  /** Bölgeye özel doğrulanmış ritüeller (varsa) */
  getRegionRituals(locationId: string): FoodRitual[];
}

/** Actual visitor contract: no editorial evidence, review counts or prototype fields. */
export interface VisitorFoodVenue {
  id:string; name:string; location:string; address:string; neighborhood:string;
  categoryName:string; categorySlugs:string[];
  tagline:string|null; imageUrl:string; imageIsRepresentative:boolean; imageCategory:string; imageAttribution?:{label:string;url?:string}[];
  ratings:import('@/lib/pilot/googlePlaces/visitorRating').VisitorGoogleRating[];
  orderSuggestion:{title:string}|null; menuFrom:string[];
  alsoTry:{items:{name:string;description:string}[]};
  knowBeforeYouGo:{tips:string[]};
}
export interface VisitorFoodDiscovery {
  locations:FoodLocation[]; categories:FoodCategory[]; venues:VisitorFoodVenue[];
}
