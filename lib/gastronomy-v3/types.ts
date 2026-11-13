export interface V3CategoryDef {
  id: string;
  slug: string;
  label: string;
  title: string;
  emoji: string;
  isMustTry?: boolean;
}

export type V3EvidenceKind = 'operator' | 'editorial' | 'community' | 'award' | 'maps';

export interface V3EvidenceSource {
  title: string;
  url: string;
  date: string;
  kind: V3EvidenceKind;
  note?: string;
}

export interface V3SecondaryItemSeed {
  name: string;
  note: string;
  proof: string;
}

export interface V3SuitabilitySeed {
  seating: string;
  crowdAndNoise: string;
  disadvantage: string;
  transit: string;
}

export interface V3SelectionDossierSeed {
  verifiedAt: string;
  sources: V3EvidenceSource[];
  pros: string[];
  cons: string[];
  uncertainties: string[];
}

export interface V3CandidateSeed {
  id: string;
  placeId?: string;
  searchQuery?: string;
  categoryId: string;
  secondaryCategoryIds?: string[];
  pinnedFirst?: boolean;
  displayNameOverride?: string;
  expectedBrandWord?: string;
  localSignals: string[];
  chefOrHeritageProtected?: boolean;
  communityInsiderProtected?: boolean;
  localRitualProtected?: boolean;
  iconicSettingOrVibeProtected?: boolean;
  neighborhoodLabelOverride?: string;
  degradationFlag?: boolean;
  degradationReason?: string;
  description: string;
  whatToOrder: string[];
  menuFrom: string[];
  alsoTry: string[];
  secondaryItems?: V3SecondaryItemSeed[];
  suitability?: V3SuitabilitySeed;
  dossier?: V3SelectionDossierSeed;
  beforeYouGo: string[];
}

export interface V3RegionDefinition {
  id: string;
  slug: string;
  city: string;
  district: string;
  allowedDistricts?: string[];
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
  priceLevel?: string;
  websiteUri?: string;
  dineIn?: boolean;
  takeout?: boolean;
  outdoorSeating?: boolean;
  reservable?: boolean;
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
  priceLevel?: string | null;
  websiteUri?: string | null;
  dineIn?: boolean | null;
  takeout?: boolean | null;
  outdoorSeating?: boolean | null;
  reservable?: boolean | null;
  coordinates?: { lat: number; lng: number } | null;
}

export interface V3VenueDossierRecord {
  id: string;
  categoryId: string;
  resolvedName: string;
  branchName: string;
  placeId: string;
  coordinates: { lat: number; lng: number } | null;
  rating: number | null;
  userRatingCount: number | null;
  priceLevel: string | null;
  serviceFlags: {
    dineIn: boolean | null;
    takeout: boolean | null;
    outdoorSeating: boolean | null;
    reservable: boolean | null;
  };
  websiteUri: string | null;
  mapsUri: string;
  recommendedPrimary: string[];
  recommendedSecondary: V3SecondaryItemSeed[];
  suitability: V3SuitabilitySeed | null;
  verifiedAt: string;
  sources: V3EvidenceSource[];
  pros: string[];
  cons: string[];
  uncertainties: string[];
  selectionScore: number;
  selectedForSnapshot: boolean;
}

export interface V3RegionDossierFile {
  schemaVersion: string;
  regionKey: string;
  displayName: string;
  verifiedAt: string;
  selectedCount: number;
  rejectedControls: Array<{ id: string; resolvedName: string; reason: string }>;
  venues: V3VenueDossierRecord[];
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
  secondaryCategoryIds?: string[];
  rating: number;
  mapsUri: string;
  coordinates?: { lat: number; lng: number };
  description: string;
  whatToOrder: string[];
  menuFrom: string[];
  alsoTry: string[];
  beforeYouGo: string[];
}

export interface V3RegionBoundary {
  bbox: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  excludeBbox?: { minLat: number; maxLat: number; minLng: number; maxLng: number };
}

export interface V3NearbyPublicVenue extends V3PublicVenue {
  nearbyAreaLabel: string;
  distanceKm: number;
  distanceMeters: number;
}

export interface V3VerifiedRegionSnapshot {
  schemaVersion: 3;
  verifiedAt: string;
  region: Omit<
    V3RegionDefinition,
    'candidates' | 'bbox' | 'excludeBbox' | 'allowedNeighborhoodTokens' | 'allowedDistricts' | 'categories'
  > & {
    boundary?: V3RegionBoundary;
  };
  categories: V3CategoryDef[];
  venues: V3PublicVenue[];
  nearbyVenues?: V3NearbyPublicVenue[];
}
