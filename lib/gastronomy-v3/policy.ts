import type {
  V3CandidateSeed,
  V3EvaluationResult,
  V3GooglePlacePayload,
  V3NearbyPublicVenue,
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
  'sushico',
  'burger yiyelim',
  'ekrem coşkun',
  'ekrem coskun',
  'bafetto',
  'pizza locale',
  'viyana kahvesi',
  'çeşme bazlama',
  'cesme bazlama',
  'beyaz fırın',
  'beyaz firin',
  'nappo',
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
  'turkish_restaurant',
  'middle_eastern_restaurant',
  'sushi_restaurant',
  'japanese_restaurant',
  'vegan_restaurant',
  'vegetarian_restaurant',
  'dumpling_restaurant',
  'dessert_restaurant',
  'dessert_shop',
  'candy_store',
  'confectionery',
  'bistro',
  'gastropub',
  'cocktail_bar',
  'bar',
  'kebab_shop',
]);

export const FORBIDDEN_VISITOR_COPY_REGEX =
  /en iyi|rakipsiz|kusursuz|mükemmel|muhteşem|tartışmasız|1 numara|yorum|Michelin|Gault|Time Out|Barista Magazine|Kaynaklar|Neden Gitmeli/i;

export const FIRST_PERSON_TASTING_REGEX =
  /\b(tattım|tattık|denedim|denedik|gittim|gittik|bayıldım|bayıldık|benim favorim|bizim favorimiz|kendim deneyimledim)\b/i;

export const UNVERIFIED_PRICE_OR_CLOCK_REGEX =
  /(\b\d+\s*(tl|₺|try|lira)\b|\b([01]?\d|2[0-3]):[0-5]\d\b)/i;

export function matchesExpectedBrandWord(name: string, expectedBrandWord?: string): boolean {
  if (!expectedBrandWord || !expectedBrandWord.trim()) return true;
  const clean = (s: string) =>
    normalizeTr(s)
      .replace(/[^a-z0-9çğıöşü]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  const normName = clean(name);
  const normExpected = clean(expectedBrandWord);
  if (!normExpected) return true;
  const nameTokens = normName.split(' ');
  const expectedTokens = normExpected.split(' ');
  for (let i = 0; i <= nameTokens.length - expectedTokens.length; i++) {
    let allMatch = true;
    for (let j = 0; j < expectedTokens.length; j++) {
      if (nameTokens[i + j] !== expectedTokens[j]) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) return true;
  }
  return false;
}

export function formatVerifiedPriceTier(priceLevel?: string | null): string | null {
  switch (priceLevel) {
    case 'PRICE_LEVEL_INEXPENSIVE':
      return 'Bütçe seviyesi (Google): Ekonomik';
    case 'PRICE_LEVEL_MODERATE':
      return 'Bütçe seviyesi (Google): Orta';
    case 'PRICE_LEVEL_EXPENSIVE':
      return 'Bütçe seviyesi (Google): Üst-orta';
    case 'PRICE_LEVEL_VERY_EXPENSIVE':
      return 'Bütçe seviyesi (Google): Yüksek';
    default:
      return null;
  }
}

export function buildStructuredBeforeYouGo(item: V3EvaluationResult): string[] {
  const s = item.seed.suitability;
  if (!s) {
    return item.seed.beforeYouGo.slice(0, 4);
  }
  const tips: string[] = [
    `Oturma & Servis: ${s.seating}${s.crowdAndNoise ? ` · ${s.crowdAndNoise}` : ''}`,
    `Dezavantaj: ${s.disadvantage}`,
    `Ulaşım: ${s.transit}`,
  ];
  const priceTier = formatVerifiedPriceTier(item.priceLevel);
  if (priceTier) {
    tips.push(priceTier);
  }
  return tips;
}

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

  if (regionDef.excludeBbox) {
    const ex = regionDef.excludeBbox;
    if (lat >= ex.minLat && lat <= ex.maxLat && lng >= ex.minLng && lng <= ex.maxLng) {
      return {
        matches: false,
        matchedNeighborhood: matchedToken,
        detail: `ExcludeBbox içinde (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
      };
    }
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
  const priceLevel = apiPlace.priceLevel || null;
  const websiteUri = apiPlace.websiteUri || null;
  const dineIn = typeof apiPlace.dineIn === 'boolean' ? apiPlace.dineIn : null;
  const takeout = typeof apiPlace.takeout === 'boolean' ? apiPlace.takeout : null;
  const outdoorSeating =
    typeof apiPlace.outdoorSeating === 'boolean' ? apiPlace.outdoorSeating : null;
  const reservable = typeof apiPlace.reservable === 'boolean' ? apiPlace.reservable : null;
  const coordinates =
    apiPlace.location?.latitude != null && apiPlace.location?.longitude != null
      ? { lat: apiPlace.location.latitude, lng: apiPlace.location.longitude }
      : null;

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
    priceLevel,
    websiteUri,
    dineIn,
    takeout,
    outdoorSeating,
    reservable,
    coordinates,
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

  // Kapı 5B: Marka sürekliliği ve isim değişimi kontrolü
  if (!matchesExpectedBrandWord(rawName, seed.expectedBrandWord)) {
    return reject(`brand_discontinuity:expected_${seed.expectedBrandWord}_got_${rawName}`);
  }

  // Kapı 6: Minimum kalite eşiği (yerel müdavim / şef / miras koruması dahil)
  if (rating === null || userRatingCount === null) {
    return reject('missing_rating_metrics');
  }

  const sources = seed.dossier?.sources || [];
  const independentProofSources = sources.filter(
    (s) => s.kind === 'editorial' || s.kind === 'community' || s.kind === 'award'
  );

  if (seed.iconicSettingOrVibeProtected) {
    if (rating < 4.1 || userRatingCount < 200 || independentProofSources.length < 2) {
      return reject(
        `below_quality_threshold:★${rating}(${userRatingCount})_proofs_${independentProofSources.length}`
      );
    }
  } else if (seed.chefOrHeritageProtected) {
    if (rating < 4.0 || userRatingCount < 200 || independentProofSources.length < 2) {
      return reject(
        `below_quality_threshold:★${rating}(${userRatingCount})_proofs_${independentProofSources.length}`
      );
    }
  } else if (seed.communityInsiderProtected) {
    if (rating < 4.2 || userRatingCount < 200 || independentProofSources.length < 2) {
      return reject(
        `below_quality_threshold:★${rating}(${userRatingCount})_proofs_${independentProofSources.length}`
      );
    }
  } else if (rating < 4.4 || userRatingCount < 35) {
    return reject(`below_quality_threshold:★${rating}(${userRatingCount})`);
  }

  // Kapı 7: Aşırı ticarileşmiş turist hacmi filtresi
  if (
    userRatingCount > 5000 &&
    rating < 4.5 &&
    !seed.chefOrHeritageProtected &&
    !seed.communityInsiderProtected &&
    !seed.iconicSettingOrVibeProtected
  ) {
    return reject(`over_commercialized_tourist_volume:★${rating}(${userRatingCount})`);
  }

  // Kapı 8: Çoklu kaynak uzlaşısı, şişirilmiş puan koruması ve seçim gerekçesi tamlığı
  if (userRatingCount < 150 && rating >= 4.8 && independentProofSources.length === 0) {
    return reject('suspected_rating_inflation_no_community_proof');
  }
  if (sources.length < 2) {
    return reject('insufficient_independent_sources');
  }
  const secondaryItems = seed.secondaryItems || [];
  if (!seed.whatToOrder.length || !secondaryItems.length) {
    return reject('missing_primary_or_secondary_items');
  }
  const primarySet = new Set(seed.whatToOrder.map((w) => normalizeTr(w)));
  for (const sec of secondaryItems) {
    if (!sec.name.trim() || !sec.note.trim() || !sec.proof.trim()) {
      return reject('incomplete_secondary_item_proof');
    }
    if (primarySet.has(normalizeTr(sec.name))) {
      return reject(`duplicate_primary_and_secondary_item:${sec.name}`);
    }
  }
  if (
    !seed.suitability?.seating ||
    !seed.suitability?.disadvantage ||
    !seed.suitability?.transit ||
    !seed.dossier?.cons?.length ||
    !seed.dossier?.uncertainties?.length
  ) {
    return reject('incomplete_selection_dossier');
  }
  if (
    dineIn === false &&
    !/(al[- ]?götür|paket|ayakta|oturma alanı yok)/i.test(seed.suitability.seating)
  ) {
    return reject('seating_mismatch_no_dine_in');
  }

  // Bileşik Yerel Cevher Skoru (0..100) — çoklu kaynak + müdavim + uzmanlık + ikincil ürün dengeli
  const baseRatingScore = Math.min(36, Math.max(0, (rating - 3.6) * 30));
  const evidenceScore = Math.min(28, sources.length * 8 + independentProofSources.length * 5);
  const communitySignalScore = Math.min(12, seed.localSignals.length * 4);
  const hiddenGemBonus =
    userRatingCount >= 35 && userRatingCount <= 700 && rating >= 4.5
      ? 12
      : userRatingCount <= 1500 && rating >= 4.5
      ? 7
      : userRatingCount <= 1200 && rating >= 4.4
      ? 5
      : 0;
  const completenessBonus =
    (seed.whatToOrder.length > 0 ? 5 : 0) + (secondaryItems.length > 0 ? 5 : 0);
  const heritageBonus = seed.iconicSettingOrVibeProtected
    ? 15
    : seed.chefOrHeritageProtected || seed.communityInsiderProtected
    ? 12
    : 0;

  const totalScore = Math.min(
    100,
    Math.round(
      baseRatingScore +
        evidenceScore +
        communitySignalScore +
        hiddenGemBonus +
        completenessBonus +
        heritageBonus
    )
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
    priceLevel,
    websiteUri,
    dineIn,
    takeout,
    outdoorSeating,
    reservable,
    coordinates,
  };
}

export function validateVisitorCopy(
  venue: V3PublicVenue & { nearbyAreaLabel?: string }
): string[] {
  const issues: string[] = [];
  const fields = [
    venue.name,
    venue.description,
    ...(venue.nearbyAreaLabel ? [venue.nearbyAreaLabel] : []),
    ...venue.whatToOrder,
    ...venue.menuFrom,
    ...venue.alsoTry,
    ...venue.beforeYouGo,
  ];
  for (const text of fields) {
    if (FORBIDDEN_VISITOR_COPY_REGEX.test(text)) {
      issues.push(`Forbidden visitor copy token in "${text}"`);
    }
    if (FIRST_PERSON_TASTING_REGEX.test(text)) {
      issues.push(`First-person tasting claim in "${text}"`);
    }
    if (UNVERIFIED_PRICE_OR_CLOCK_REGEX.test(text)) {
      issues.push(`Unverified price or clock string in "${text}"`);
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
  const categoryMaxCap = new Map<string, number>();

  for (const cat of regionDef.categories) {
    selectedByCategory.set(cat.id, []);
    if (regionDef.id === 'kadikoy-nearby-pool' || cat.id === 'denemelisin') {
      categoryMaxCap.set(cat.id, 10);
    } else {
      const hasIconicVibe = acceptedSorted.some(
        (item) => item.seed.categoryId === cat.id && item.seed.iconicSettingOrVibeProtected === true
      );
      categoryMaxCap.set(cat.id, hasIconicVibe ? 5 : 4);
    }
  }

  for (const item of acceptedSorted) {
    if (usedPlaceIds.has(item.placeId)) continue;
    const bucket = selectedByCategory.get(item.seed.categoryId);
    const cap = categoryMaxCap.get(item.seed.categoryId) ?? 4;
    if (!bucket || bucket.length >= cap) continue;

    usedPlaceIds.add(item.placeId);
    const formattedAlsoTry =
      item.seed.secondaryItems && item.seed.secondaryItems.length > 0
        ? item.seed.secondaryItems.map((sec) => `${sec.name} — ${sec.note}`)
        : item.seed.alsoTry;

    bucket.push({
      id: item.seed.id,
      placeId: item.placeId,
      name: item.resolvedName,
      address: item.formattedAddress,
      neighborhood:
        item.seed.neighborhoodLabelOverride ||
        item.matchedNeighborhood ||
        regionDef.officialQuarter,
      categoryId: item.seed.categoryId,
      rating: item.rating as number,
      mapsUri: item.mapsUri,
      ...(item.coordinates ? { coordinates: item.coordinates } : {}),
      description: item.seed.description,
      whatToOrder: item.seed.whatToOrder.slice(0, 3),
      menuFrom: item.seed.menuFrom,
      alsoTry: formattedAlsoTry,
      beforeYouGo: buildStructuredBeforeYouGo(item),
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

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function computeRegionNearbyVenues(
  targetSnapshot: V3VerifiedRegionSnapshot,
  peerSnapshots: readonly V3VerifiedRegionSnapshot[],
  nearbyPoolSnapshot?: V3VerifiedRegionSnapshot | null,
  maxPerCategory = 4
): V3NearbyPublicVenue[] {
  const targetPlaceIds = new Set(targetSnapshot.venues.map((v) => v.placeId));
  const seenPoolPlaceIds = new Set<string>();

  type PoolCandidate = {
    venue: V3PublicVenue;
    areaLabel: string;
    isMicroArea: boolean;
  };
  const pool: PoolCandidate[] = [];

  for (const v of nearbyPoolSnapshot?.venues || []) {
    if (targetPlaceIds.has(v.placeId) || seenPoolPlaceIds.has(v.placeId)) continue;
    seenPoolPlaceIds.add(v.placeId);
    pool.push({
      venue: v,
      areaLabel: v.neighborhood,
      isMicroArea: true,
    });
  }

  for (const peer of peerSnapshots) {
    if (peer.region.id === targetSnapshot.region.id) continue;
    const areaLabel = `${peer.region.neighborhood}, ${peer.region.district}`;
    for (const v of peer.venues) {
      if (targetPlaceIds.has(v.placeId) || seenPoolPlaceIds.has(v.placeId)) continue;
      seenPoolPlaceIds.add(v.placeId);
      pool.push({
        venue: v,
        areaLabel,
        isMicroArea: false,
      });
    }
  }

  const nearbyResults: V3NearbyPublicVenue[] = [];

  for (const cat of targetSnapshot.categories) {
    const withDistance = pool
      .filter((entry) => entry.venue.categoryId === cat.id && entry.venue.coordinates != null)
      .map((entry) => {
        const rawDist = haversineKm(targetSnapshot.region.center, entry.venue.coordinates!);
        const distanceKm = Math.max(0.4, Math.round(rawDist * 10) / 10);
        const rankScore =
          entry.venue.rating * 15 - distanceKm * 3.2 + (entry.isMicroArea ? 5.5 : 0);
        return { ...entry, distanceKm, rankScore };
      });

    let candidates = withDistance.filter((c) => c.distanceKm <= 5.5);
    if (candidates.length < 3) {
      candidates = withDistance.filter((c) => c.distanceKm <= 8.0);
    }
    candidates.sort((a, b) => b.rankScore - a.rankScore);

    const picked: typeof candidates = [];
    const usedPlaceIds = new Set<string>();
    const usedAreas = new Set<string>();

    // 1. Geçiş: Mahalle çeşitliliği için her farklı areaLabel'dan en fazla 1 mekan
    for (const c of candidates) {
      if (picked.length >= maxPerCategory) break;
      if (usedPlaceIds.has(c.venue.placeId) || usedAreas.has(c.areaLabel)) continue;
      usedPlaceIds.add(c.venue.placeId);
      usedAreas.add(c.areaLabel);
      picked.push(c);
    }

    // 2. Geçiş: Eksik kalırsa aynı areaLabel'dan ek mekanlara izin ver
    if (picked.length < maxPerCategory) {
      for (const c of candidates) {
        if (picked.length >= maxPerCategory) break;
        if (usedPlaceIds.has(c.venue.placeId)) continue;
        usedPlaceIds.add(c.venue.placeId);
        picked.push(c);
      }
    }

    picked.sort((a, b) => a.distanceKm - b.distanceKm || b.venue.rating - a.venue.rating);

    for (const item of picked) {
      nearbyResults.push({
        ...item.venue,
        nearbyAreaLabel: item.areaLabel,
        distanceKm: item.distanceKm,
      });
    }
  }

  return nearbyResults;
}
