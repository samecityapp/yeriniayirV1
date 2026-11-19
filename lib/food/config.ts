/**
 * Gastronomi keşif modülünün yayın bayrakları.
 *
 * `isPublic: false` olduğu sürece ana sayfa ve tüm bölge/kategori sayfaları
 * `noindex` olarak işaretlenir. Ayrıca yalnızca `published` durumundaki bölgeler
 * indekslenebilir; `demo` ve `coming_soon` asla indekslenmez.
 */
export const FOOD_DISCOVERY = {
  isPublic: false,
  maxCategoriesPerRegion: 7,
  mustTrySlug: 'mutlaka-denenmeli',
  storage: {
    lastRegionKey: 'ya:food:lastRegion',
    pendingCategoryKey: 'ya:food:pendingCategory',
  },
  /** "Konumumu kullan" sonrasında bölge sınırından önerilecek azami mesafe */
  nearbySuggestionRadiusMeters: 6000,
} as const;
