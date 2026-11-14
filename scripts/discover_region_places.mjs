import {
  ENTERPRISE_FIELD_MASK,
  FREE_MONTHLY_CAPS,
  PLACES_CACHE_PATH,
  getMonthKey,
  getMonthUsage,
  loadEnvLocal,
  loadPlacesCache,
  parseNumericFlag,
  recordSkuUsage,
  reserveFetchSlot,
  savePlacesCache,
} from './run_region_pipeline.mjs';

const MAX_REVIEW_IDS_PER_RUN = 5;
const REVIEW_FIELD_MASK = 'id,displayName,rating,userRatingCount,reviews';

function parseStringFlag(argv, flagName) {
  const prefix = `--${flagName}=`;
  const eqArg = argv.find((a) => a.startsWith(prefix));
  if (eqArg) return eqArg.slice(prefix.length);
  const idx = argv.indexOf(`--${flagName}`);
  if (idx !== -1 && argv[idx + 1] && !argv[idx + 1].startsWith('--')) {
    return argv[idx + 1];
  }
  return '';
}

function parseRepeatableFlag(argv, flagName) {
  const out = [];
  const prefix = `--${flagName}=`;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith(prefix)) {
      const val = arg.slice(prefix.length).trim();
      if (val) out.push(val);
    } else if (arg === `--${flagName}` && argv[i + 1] && !argv[i + 1].startsWith('--')) {
      const val = argv[i + 1].trim();
      if (val) out.push(val);
      i += 1;
    }
  }
  return out;
}

function splitCsv(raw) {
  return String(raw || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseCenterFlag(raw) {
  if (!raw) return null;
  const parts = raw.split(',').map((s) => Number(s.trim()));
  if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) {
    throw new Error(`Invalid --center="${raw}". Expected "lat,lng".`);
  }
  return { lat: parts[0], lng: parts[1] };
}

function formatPlaceRow(place) {
  const name = place.displayName?.text || place.displayName || '?';
  const rating = place.rating ?? '?';
  const count = place.userRatingCount ?? '?';
  const status = place.businessStatus || '?';
  const type = place.primaryType || '-';
  const coords = place.location ? `${place.location.latitude?.toFixed(5)},${place.location.longitude?.toFixed(5)}` : '-';
  return `${place.id} | ${name} | ★${rating} (${count}) | ${status} | ${type} | ${coords} | ${place.formattedAddress || ''}`;
}

function printStats(cache) {
  const monthKey = getMonthKey();
  const usage = getMonthUsage(cache, monthKey);
  console.log(`=== Google Places Shared Cache (${PLACES_CACHE_PATH}) ===`);
  console.log(`updatedAt: ${cache.updatedAt}`);
  console.log(`byPlaceId: ${Object.keys(cache.byPlaceId || {}).length}`);
  console.log(`byQuery: ${Object.keys(cache.byQuery || {}).length}`);
  console.log(`reviewsByPlaceId: ${Object.keys(cache.reviewsByPlaceId || {}).length}`);
  console.log(
    `monthlyUsage (${monthKey}): detailsEnterprise ${usage.detailsEnterprise}/${FREE_MONTHLY_CAPS.detailsEnterprise} | searchEnterprise ${usage.searchEnterprise}/${FREE_MONTHLY_CAPS.searchEnterprise} | detailsAtmosphere ${usage.detailsAtmosphere}/${FREE_MONTHLY_CAPS.detailsAtmosphere}`
  );
}

async function discoverByQuery({ textQuery, center, radius, apiKey, cache, budget, forceRefresh }) {
  const centerKey = center ? `${center.lat.toFixed(4)},${center.lng.toFixed(4)}:r${radius}` : 'global';
  const discoverKey = `discover::${centerKey}::${textQuery}`;
  if (!forceRefresh && Array.isArray(cache.byQuery[discoverKey]?.placeIds)) {
    budget.cacheHits += 1;
    const cachedPlaces = cache.byQuery[discoverKey].placeIds
      .map((id) => cache.byPlaceId[id]?.payload)
      .filter(Boolean);
    return { source: 'cache', places: cachedPlaces };
  }
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY is missing in .env.local or environment.');
  }
  reserveFetchSlot(budget, `discover searchText "${textQuery}"`);

  const body = {
    textQuery,
    languageCode: 'tr',
    regionCode: 'TR',
    pageSize: 20,
  };
  if (center) {
    body.locationBias = {
      circle: {
        center: { latitude: center.lat, longitude: center.lng },
        radius,
      },
    };
  }

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': ENTERPRISE_FIELD_MASK.split(',')
        .map((f) => `places.${f}`)
        .join(','),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Places searchText "${textQuery}" failed (${res.status}): ${errText}`);
  }
  const data = await res.json();
  const places = Array.isArray(data.places) ? data.places : [];
  const fetchedAt = new Date().toISOString();
  const placeIds = [];
  for (const place of places) {
    if (place?.id) {
      placeIds.push(place.id);
      cache.byPlaceId[place.id] = { fetchedAt, payload: place };
    }
  }
  cache.byQuery[discoverKey] = { fetchedAt, placeIds };
  budget.networkFetches += 1;
  recordSkuUsage(cache, 'searchEnterprise', 1);
  return { source: 'live', places };
}

async function discoverById({ placeId, apiKey, cache, budget, forceRefresh }) {
  if (!forceRefresh && cache.byPlaceId[placeId]?.payload) {
    budget.cacheHits += 1;
    return { source: 'cache', place: cache.byPlaceId[placeId].payload };
  }
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY is missing in .env.local or environment.');
  }
  reserveFetchSlot(budget, `discover GET ${placeId}`);

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=tr`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': ENTERPRISE_FIELD_MASK,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Places GET ${placeId} failed (${res.status}): ${errText}`);
  }
  const payload = await res.json();
  cache.byPlaceId[placeId] = { fetchedAt: new Date().toISOString(), payload };
  budget.networkFetches += 1;
  recordSkuUsage(cache, 'detailsEnterprise', 1);
  return { source: 'live', place: payload };
}

async function fetchReviewsForPlace({ placeId, apiKey, cache, budget, forceRefresh }) {
  if (!forceRefresh && cache.reviewsByPlaceId?.[placeId]?.payload) {
    budget.cacheHits += 1;
    return { source: 'cache', payload: cache.reviewsByPlaceId[placeId].payload };
  }
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY is missing in .env.local or environment.');
  }
  reserveFetchSlot(budget, `discover reviews ${placeId}`);

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=tr`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': REVIEW_FIELD_MASK,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Places reviews GET ${placeId} failed (${res.status}): ${errText}`);
  }
  const payload = await res.json();
  if (!cache.reviewsByPlaceId || typeof cache.reviewsByPlaceId !== 'object') {
    cache.reviewsByPlaceId = {};
  }
  cache.reviewsByPlaceId[placeId] = { fetchedAt: new Date().toISOString(), payload };
  budget.networkFetches += 1;
  recordSkuUsage(cache, 'detailsAtmosphere', 1);
  return { source: 'live', payload };
}

async function main() {
  const args = process.argv.slice(2);
  const showStats = args.includes('--stats');
  const forceRefresh = args.includes('--refresh');
  const queries = [
    ...splitCsv(parseStringFlag(args, 'queries')),
    ...parseRepeatableFlag(args, 'query'),
  ];
  const ids = splitCsv(parseStringFlag(args, 'ids'));
  const reviewIds = splitCsv(parseStringFlag(args, 'reviews'));
  const center = parseCenterFlag(parseStringFlag(args, 'center'));
  const radius = Math.min(50000, Math.max(100, parseNumericFlag(args, 'radius', 2500)));
  const maxFetches = parseNumericFlag(args, 'max-fetches', 25);

  if (reviewIds.length > MAX_REVIEW_IDS_PER_RUN) {
    throw new Error(
      `QUOTA_GUARD: --reviews tek seferde en fazla ${MAX_REVIEW_IDS_PER_RUN} placeId destekler (istenen: ${reviewIds.length}). Yorum araştırması için öncelikle web aramasını kullanın.`
    );
  }

  const cache = loadPlacesCache();
  if (showStats && queries.length === 0 && ids.length === 0 && reviewIds.length === 0) {
    printStats(cache);
    return;
  }

  if (queries.length === 0 && ids.length === 0 && reviewIds.length === 0) {
    console.error(
      'Kullanım: node scripts/discover_region_places.mjs [--stats] [--queries="q1,q2" --center="lat,lng" --radius=2500] [--ids="id1,id2"] [--reviews="id1,id2"] [--max-fetches=25] [--refresh]'
    );
    process.exit(1);
  }

  loadEnvLocal();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
  const budget = {
    cacheHits: 0,
    networkFetches: 0,
    reservedFetches: 0,
    maxFetches,
  };

  try {
    for (const textQuery of queries) {
      const result = await discoverByQuery({
        textQuery,
        center,
        radius,
        apiKey,
        cache,
        budget,
        forceRefresh,
      });
      console.log(`\n[QUERY:${result.source}] "${textQuery}" -> ${result.places.length} mekan`);
      for (const place of result.places) {
        console.log(`  - ${formatPlaceRow(place)}`);
      }
    }

    for (const placeId of ids) {
      const result = await discoverById({ placeId, apiKey, cache, budget, forceRefresh });
      console.log(`\n[ID:${result.source}] ${formatPlaceRow(result.place)}`);
    }

    for (const placeId of reviewIds) {
      const result = await fetchReviewsForPlace({ placeId, apiKey, cache, budget, forceRefresh });
      const p = result.payload;
      console.log(
        `\n[REVIEWS:${result.source}] ${p.id} | ${p.displayName?.text || '?'} | ★${p.rating ?? '?'} (${p.userRatingCount ?? '?'})`
      );
      for (const r of p.reviews || []) {
        const snippet = String(r.text?.text || '').replace(/\s+/g, ' ').slice(0, 220);
        console.log(`  • ${r.rating ?? '?'}★ (${r.relativePublishTimeDescription || ''}): ${snippet}`);
      }
    }
  } finally {
    if (budget.networkFetches > 0) {
      savePlacesCache(cache);
    }
  }

  if (showStats) {
    console.log('');
    printStats(cache);
  } else {
    const monthKey = getMonthKey();
    const usage = getMonthUsage(cache, monthKey);
    console.log(
      `\n✓ Özet: ${budget.cacheHits} önbellek, ${budget.networkFetches} canlı sorgu | Aylık (${monthKey}): Details ${usage.detailsEnterprise}/${FREE_MONTHLY_CAPS.detailsEnterprise}, Search ${usage.searchEnterprise}/${FREE_MONTHLY_CAPS.searchEnterprise}, Atmosphere ${usage.detailsAtmosphere}/${FREE_MONTHLY_CAPS.detailsAtmosphere}`
    );
  }
}

main().catch((err) => {
  console.error('DISCOVERY FAILED:', err.message);
  process.exit(1);
});
