export interface V3CategoryDef {
  id: string;
  slug: string;
  label: string;
  title: string;
  emoji: string;
  isMustTry?: boolean;
}

export interface V3CandidateSeed {
  id: string;
  placeId?: string;
  searchQuery?: string;
  categoryId: string;
  displayNameOverride?: string;
  localSignals: string[];
  chefOrHeritageProtected?: boolean;
  degradationFlag?: boolean;
  degradationReason?: string;
  description: string;
  whatToOrder: string[];
  menuFrom: string[];
  alsoTry: string[];
  beforeYouGo: string[];
}

export interface V3RegionDefinition {
  id: string;
  slug: string;
  city: string;
  district: string;
  neighborhood: string;
  officialQuarter: string;
  displayName: string;
  locative: string;
  path: string[];
  aliases: string[];
  scopeNote: string;
  characterSubtitle: string;
  center: { lat: number; lng: number };
  bbox: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  excludeBbox?: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  allowedNeighborhoodTokens: string[];
  categories: V3CategoryDef[];
  candidates: V3CandidateSeed[];
}

export interface V3GooglePlacePayload {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
  primaryType?: string;
  types?: string[];
  googleMapsUri?: string;
  location?: { latitude?: number; longitude?: number };
  addressComponents?: Array<{
    longText?: string;
    shortText?: string;
    types?: string[];
  }>;
}

export interface V3EvaluationResult {
  seed: V3CandidateSeed;
  accepted: boolean;
  reason: string;
  score: number;
  placeId: string;
  resolvedName: string;
  rating: number | null;
  userRatingCount: number | null;
  businessStatus: string | null;
  formattedAddress: string;
  mapsUri: string;
  matchedNeighborhood: string;
}

/**
 * Ziyaretçi yüzüne çıkan güvenli mekan kontratı.
 * KESİNLİKLE userRatingCount, reviewCount, googleReviewCount veya sourcePageUrl içermez.
 */
export interface V3PublicVenue {
  id: string;
  placeId: string;
  name: string;
  address: string;
  neighborhood: string;
  categoryId: string;
  rating: number;
  mapsUri: string;
  description: string;
  whatToOrder: string[];
  menuFrom: string[];
  alsoTry: string[];
  beforeYouGo: string[];
}

export interface V3VerifiedRegionSnapshot {
  schemaVersion: 3;
  verifiedAt: string;
  region: Omit<
    V3RegionDefinition,
    'candidates' | 'bbox' | 'excludeBbox' | 'allowedNeighborhoodTokens' | 'categories'
  >;
  categories: V3CategoryDef[];
  venues: V3PublicVenue[];
}
