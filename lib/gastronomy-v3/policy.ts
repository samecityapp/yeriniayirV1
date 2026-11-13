import type {
  V3CandidateSeed,
  V3EvaluationResult,
  V3GooglePlacePayload,
  V3PublicVenue,
  V3RegionDefinition,
  V3VerifiedRegionSnapshot,
} from './types';

export const CHAIN_BLOCKLIST: readonly string[] = [
  'coffy',
  'espressolab',
  'starbucks',
  'kahve dünyası',
  'kahve dunyasi',
  'arabica',
  'mado',
  'bigchefs',
  'happy moon',
  'midpoint',
  'cookshop',
  "domino's",
  'mcdonald',
  'burger king',
  'popeyes',
  'kfc',
  'simit sarayı',
  'gloria jean',
  'caribou',
  'tchibo',
  'nero',
  'sbarro',
  'little caesars',
  'komagene',
  'baydöner',
  'hd iskender',
  'tavuk dünyası',
];

export const FOOD_PLACE_TYPES = new Set<string>([
  'cafe',
  'coffee_shop',
  'bakery',
  'restaurant',
  'sandwich_shop',
  'fast_food_restaurant',
  'hamburger_restaurant',
  'italian_restaurant',
  'pizza_restaurant',
  'pastry_shop',
  'ice_cream_shop',
  'chocolate_shop',
  'breakfast_restaurant',
  'brunch_restaurant',
  'seafood_restaurant',
  'steak_house',
  'wine_bar',
  'bar_and_grill',
  'meal_takeaway',
  'food',
]);

export const FORBIDDEN_VISITOR_COPY_REGEX =
  /en iyi|rakipsiz|kusursuz|mükemmel|muhteşem|tartışmasız|1 numara|yorum|Michelin|Gault|Time Out|Barista Magazine|Kaynaklar|Neden Gitmeli/i;

export function normalizeTr(text: string): string {
  return text
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .trim();
}

export function cleanMapsUri(uri?: string): string {
  if (!uri) return '';
  return uri.split('&g_mp=')[0].trim();
}

export function isBlockedChain(name: string): boolean {
  const norm = normalizeTr(name);
  return CHAIN_BLOCKLIST.some((token) => norm.includes(normalizeTr(token)));
}

export function isFoodOrDrinkPlace(primaryType?: string, types: readonly string[] = []): boolean {
  if (primaryType && FOOD_PLACE_TYPES.has(primaryType)) return true;
  return types.some((t) => FOOD_PLACE_TYPES.has(t));
}

export function matchesStrictNeighborhood(
  place: V3GooglePlacePayload,
  regionDef: V3RegionDefinition
): { matches: boolean; matchedNeighborhood: string; detail: string } {
  const componentTexts = (place.addressComponents || [])
    .flatMap((c) => [c.longText || '', c.shortText || ''])
    .filter(Boolean)
    .map(normalizeTr);
  const fullAddrNorm = normalizeTr(place.formattedAddress || '');
  const haystack = [...componentTexts, fullAddrNorm];

  const matchedToken = regionDef.allowedNeighborhoodTokens.find((token) => {
    const tNorm = normalizeTr(token);
    return haystack.some((h) => h.includes(tNorm));
  });

  if (!matchedToken) {
    return {
      matches: false,
      matchedNeighborhood: '',
      detail: `Mahalle uyuşmazlığı (beklenen: ${regionDef.allowedNeighborhoodTokens.join('/')}, adres: ${place.formattedAddress || ''})`,
    };
  }

  const districtNorm = normalizeTr(regionDef.district);
  if (!haystack.some((h) => h.includes(districtNorm))) {
    return {
      matches: false,
      matchedNeighborhood: matchedToken,
      detail: `İlçe uyuşmazlığı (beklenen: ${regionDef.district})`,
    };
  }

  const cityNorm = normalizeTr(regionDef.city);
  if (!haystack.some((h) => h.includes(cityNorm))) {
    return {
      matches: false,
      matchedNeighborhood: matchedToken,
      detail: `İl uyuşmazlığı (beklenen: ${regionDef.city})`,
    };
  }

  const lat = place.location?.latitude;
  const lng = place.location?.longitude;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return { matches: false, matchedNeighborhood: matchedToken, detail: 'Koordinat eksik' };
  }

  const { minLat, maxLat, minLng, maxLng } = regionDef.bbox;
  if (lat < minLat || lat > maxLat || lng < minLng || lng > maxLng) {
    return {
      matches: false,
      matchedNeighborhood: matchedToken,
      detail: `Bbox dışında (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
    };
  }

  return { matches: true, matchedNeighborhood: matchedToken, detail: 'ok' };
}

export function evaluateAndScoreCandidate(
  apiPlace: V3GooglePlacePayload,
  seed: V3CandidateSeed,
  regionDef: V3RegionDefinition
): V3EvaluationResult {
  const rawName = apiPlace.displayName?.text || seed.displayNameOverride || seed.id;
  const resolvedName = seed.displayNameOverride || rawName;
  const rating = typeof apiPlace.rating === 'number' ? apiPlace.rating : null;
  const userRatingCount =
    typeof apiPlace.userRatingCount === 'number' ? apiPlace.userRatingCount : null;
  const businessStatus = apiPlace.businessStatus || null;
  const formattedAddress = apiPlace.formattedAddress || '';
  const mapsUri = cleanMapsUri(apiPlace.googleMapsUri);

  const reject = (reason: string): V3EvaluationResult => ({
    seed,
    accepted: false,
    reason,
    score: 0,
    placeId: apiPlace.id,
    resolvedName,
    rating,
    userRatingCount,
    businessStatus,
    formattedAddress,
    mapsUri,
    matchedNeighborhood: '',
  });

  // Kapı 1: Operasyonel durum
  if (businessStatus !== 'OPERATIONAL') {
    return reject(`not_operational:${businessStatus || 'UNKNOWN'}`);
  }

  // Kapı 2: Zincir / franchise engeli
  if (isBlockedChain(rawName) || isBlockedChain(resolvedName)) {
    return reject('chain_or_franchise');
  }

  // Kapı 3: Yeme-içme kategorisi doğrulaması
  if (!isFoodOrDrinkPlace(apiPlace.primaryType, apiPlace.types)) {
    return reject(`invalid_place_type:${apiPlace.primaryType || 'none'}`);
  }

  // Kapı 4: Sıkı mahalle & ilçe & il sınırı
  const geo = matchesStrictNeighborhood(apiPlace, regionDef);
  if (!geo.matches) {
    return reject(`outside_strict_neighborhood:${geo.detail}`);
  }

  // Kapı 5: Son dönem kalite/porsiyon bozulma kontrolü
  if (seed.degradationFlag) {
    return reject(`recent_quality_degradation:${seed.degradationReason || 'flagged'}`);
  }

  // Kapı 6: Minimum kalite eşiği (şef/miras koruması dahil)
  if (rating === null || userRatingCount === null) {
    return reject('missing_rating_metrics');
  }
  if (seed.chefOrHeritageProtected) {
    if (rating < 4.2 || userRatingCount < 200) {
      return reject(`below_quality_threshold:★${rating}(${userRatingCount})`);
    }
  } else if (rating < 4.4 || userRatingCount < 35) {
    return reject(`below_quality_threshold:★${rating}(${userRatingCount})`);
  }

  // Kapı 7: Aşırı ticarileşmiş turist hacmi filtresi
  if (userRatingCount > 5000 && rating < 4.5 && !seed.chefOrHeritageProtected) {
    return reject(`over_commercialized_tourist_volume:★${rating}(${userRatingCount})`);
  }

  // Bileşik Yerel Cevher Skoru (0..100)
  const baseRatingScore = Math.min(45, Math.max(0, (rating - 3.8) * 45));
  const communityScore = Math.min(25, seed.localSignals.length * 8);
  const hiddenGemBonus =
    userRatingCount >= 35 && userRatingCount <= 600 && rating >= 4.5
      ? 14
      : userRatingCount <= 1200 && rating >= 4.6
      ? 8
      : 0;
  const signatureClarity = seed.whatToOrder.length > 0 ? 10 : 0;
  const heritageBonus = seed.chefOrHeritageProtected ? 18 : 0;

  const totalScore = Math.min(
    100,
    Math.round(baseRatingScore + communityScore + hiddenGemBonus + signatureClarity + heritageBonus)
  );

  return {
    seed,
    accepted: true,
    reason: 'accepted',
    score: totalScore,
    placeId: apiPlace.id,
    resolvedName,
    rating,
    userRatingCount,
    businessStatus,
    formattedAddress,
    mapsUri,
    matchedNeighborhood: geo.matchedNeighborhood,
  };
}

export function validateVisitorCopy(venue: V3PublicVenue): string[] {
  const issues: string[] = [];
  const fields = [
    venue.name,
    venue.description,
    ...venue.whatToOrder,
    ...venue.menuFrom,
    ...venue.alsoTry,
    ...venue.beforeYouGo,
  ];
  for (const text of fields) {
    if (FORBIDDEN_VISITOR_COPY_REGEX.test(text)) {
      issues.push(`Forbidden visitor copy token in "${text}"`);
    }
  }
  if (!venue.mapsUri.startsWith('https://maps.google.com/?cid=')) {
    issues.push(`Expected canonical CID mapsUri for ${venue.id}, got "${venue.mapsUri}"`);
  }
  return issues;
}

export function selectDynamicRegionVenues(
  regionDef: V3RegionDefinition,
  evaluatedList: V3EvaluationResult[],
  verifiedAt = new Date().toISOString()
): V3VerifiedRegionSnapshot {
  const acceptedSorted = evaluatedList
    .filter((item) => item.accepted && item.score >= 65)
    .sort((a, b) => b.score - a.score);

  const usedPlaceIds = new Set<string>();
  const selectedByCategory = new Map<string, V3PublicVenue[]>();

  for (const cat of regionDef.categories) {
    selectedByCategory.set(cat.id, []);
  }

  for (const item of acceptedSorted) {
    if (usedPlaceIds.has(item.placeId)) continue;
    const bucket = selectedByCategory.get(item.seed.categoryId);
    if (!bucket || bucket.length >= 4) continue;

    usedPlaceIds.add(item.placeId);
    bucket.push({
      id: item.seed.id,
      placeId: item.placeId,
      name: item.resolvedName,
      address: item.formattedAddress,
      neighborhood: item.matchedNeighborhood || regionDef.officialQuarter,
      categoryId: item.seed.categoryId,
      rating: item.rating as number,
      mapsUri: item.mapsUri,
      description: item.seed.description,
      whatToOrder: item.seed.whatToOrder.slice(0, 3),
      menuFrom: item.seed.menuFrom,
      alsoTry: item.seed.alsoTry,
      beforeYouGo: item.seed.beforeYouGo.slice(0, 2),
    });
  }

  // Dinamik Kategori Budama ("Yoksa Gösterme")
  const activeCategories = regionDef.categories.filter(
    (cat) => (selectedByCategory.get(cat.id)?.length || 0) > 0
  );
  const venues = activeCategories.flatMap((cat) => selectedByCategory.get(cat.id) || []);

  return {
    schemaVersion: 3,
    verifiedAt,
    region: {
      id: regionDef.id,
      slug: regionDef.slug,
      city: regionDef.city,
      district: regionDef.district,
      neighborhood: regionDef.neighborhood,
      officialQuarter: regionDef.officialQuarter,
      displayName: regionDef.displayName,
      locative: regionDef.locative,
      path: regionDef.path,
      aliases: regionDef.aliases,
      scopeNote: regionDef.scopeNote,
      characterSubtitle: regionDef.characterSubtitle,
      center: regionDef.center,
    },
    categories: activeCategories,
    venues,
  };
}
