import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const ROOT = process.cwd();
const PUBLISHED_REGION_KEYS = [
  'istanbul-kadikoy-moda',
  'istanbul-kadikoy-carsi',
  'istanbul-kadikoy-yeldegirmeni',
  'istanbul-kadikoy-caddebostan',
  'istanbul-kadikoy-suadiye',
];
const NEARBY_POOL_KEY = 'istanbul-kadikoy-nearby-pool';
const DEFAULT_REGION_ORDER = [...PUBLISHED_REGION_KEYS, NEARBY_POOL_KEY];
const PLACES_CACHE_PATH = path.join(ROOT, 'work', 'gastronomy-v3', 'places-cache.json');

function loadPlacesCache() {
  if (!fs.existsSync(PLACES_CACHE_PATH)) {
    return { schemaVersion: 1, updatedAt: new Date().toISOString(), byPlaceId: {}, byQuery: {} };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(PLACES_CACHE_PATH, 'utf8'));
    return {
      schemaVersion: 1,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      byPlaceId: parsed.byPlaceId && typeof parsed.byPlaceId === 'object' ? parsed.byPlaceId : {},
      byQuery: parsed.byQuery && typeof parsed.byQuery === 'object' ? parsed.byQuery : {},
    };
  } catch {
    return { schemaVersion: 1, updatedAt: new Date().toISOString(), byPlaceId: {}, byQuery: {} };
  }
}

function savePlacesCache(cache) {
  cache.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(PLACES_CACHE_PATH), { recursive: true });
  const tmpPath = `${PLACES_CACHE_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(cache, null, 2) + '\n', 'utf8');
  fs.renameSync(tmpPath, PLACES_CACHE_PATH);
}

const FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'rating',
  'userRatingCount',
  'businessStatus',
  'primaryType',
  'types',
  'googleMapsUri',
  'priceLevel',
  'websiteUri',
  'dineIn',
  'takeout',
  'outdoorSeating',
  'reservable',
  'location',
  'addressComponents',
].join(',');

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

function loadTsModule(relPath) {
  const absPath = path.join(ROOT, relPath);
  const visited = new Map();

  function loadRec(filePath) {
    if (visited.has(filePath)) return visited.get(filePath).exports;
    const mod = { exports: {} };
    visited.set(filePath, mod);

    const src = fs.readFileSync(filePath, 'utf8');
    const js = ts.transpileModule(src, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText;

    const localRequire = (specifier) => {
      if (specifier.startsWith('.')) {
        const base = path.resolve(path.dirname(filePath), specifier);
        const candidates = [base, `${base}.ts`, path.join(base, 'index.ts')];
        for (const cand of candidates) {
          if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
            return loadRec(cand);
          }
        }
      }
      if (specifier.startsWith('@/')) {
        const base = path.join(ROOT, specifier.slice(2));
        const candidates = [base, `${base}.ts`, path.join(base, 'index.ts')];
        for (const cand of candidates) {
          if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
            return loadRec(cand);
          }
        }
      }
      return require(specifier);
    };

    const fn = new Function('require', 'module', 'exports', js);
    fn(localRequire, mod, mod.exports);
    return mod.exports;
  }

  return loadRec(absPath);
}

async function fetchPlaceById(placeId, apiKey, cache, stats, forceRefresh) {
  if (!forceRefresh && cache.byPlaceId[placeId]?.payload) {
    stats.cacheHits += 1;
    return cache.byPlaceId[placeId].payload;
  }
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=tr`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Places GET ${placeId} failed (${res.status}): ${errText}`);
  }
  const payload = await res.json();
  stats.networkFetches += 1;
  cache.byPlaceId[placeId] = { fetchedAt: new Date().toISOString(), payload };
  return payload;
}

async function fetchPlaceByQuery(textQuery, regionDef, apiKey, cache, stats, forceRefresh) {
  const queryKey = `${regionDef.id}::${textQuery}`;
  if (!forceRefresh && cache.byQuery[queryKey]?.payload) {
    stats.cacheHits += 1;
    return cache.byQuery[queryKey].payload;
  }
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK.split(',')
        .map((f) => `places.${f}`)
        .join(','),
    },
    body: JSON.stringify({
      textQuery,
      languageCode: 'tr',
      maxResultCount: 1,
      locationBias: {
        circle: {
          center: {
            latitude: regionDef.center.lat,
            longitude: regionDef.center.lng,
          },
          radius: 3000,
        },
      },
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Places searchText "${textQuery}" failed (${res.status}): ${errText}`);
  }
  const data = await res.json();
  const first = data.places?.[0];
  if (!first) {
    throw new Error(`Google Places searchText "${textQuery}" returned 0 results`);
  }
  stats.networkFetches += 1;
  const fetchedAt = new Date().toISOString();
  cache.byQuery[queryKey] = { fetchedAt, payload: first };
  if (first.id) {
    cache.byPlaceId[first.id] = { fetchedAt, payload: first };
  }
  return first;
}

function parseRegionsArg() {
  const args = process.argv.slice(2);
  if (args.includes('--all')) {
    const defsDir = path.join(ROOT, 'lib', 'gastronomy-v3', 'definitions');
    const files = fs
      .readdirSync(defsDir)
      .filter((f) => f.endsWith('.ts'))
      .map((f) => f.replace(/\.ts$/, ''));
    const ordered = DEFAULT_REGION_ORDER.filter((k) => files.includes(k));
    const extras = files.filter((k) => !ordered.includes(k)).sort();
    return [...ordered, ...extras];
  }
  const idx = args.indexOf('--region');
  let raw = '';
  if (idx !== -1 && args[idx + 1]) {
    raw = args[idx + 1];
  } else {
    const eq = args.find((a) => a.startsWith('--region='));
    if (eq) raw = eq.split('=')[1];
  }
  if (!raw) return ['istanbul-kadikoy-moda'];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function runSingleRegion(regionKey, apiKey, policy, globalUsedPlaceIds, cache, forceRefresh) {
  const defRel = `lib/gastronomy-v3/definitions/${regionKey}.ts`;
  if (!fs.existsSync(path.join(ROOT, defRel))) {
    throw new Error(`Definition not found: ${defRel}`);
  }

  const defModule = loadTsModule(defRel);
  const regionDef = Object.values(defModule).find(
    (v) => v && typeof v === 'object' && Array.isArray(v.candidates) && Array.isArray(v.categories)
  );
  if (!regionDef) {
    throw new Error(`Could not locate V3RegionDefinition export in ${defRel}`);
  }

  console.log(`\n=== V3 Gastronomi Pipeline: ${regionDef.displayName} (${regionKey}) ===`);
  console.log(`Toplam aday havuzu: ${regionDef.candidates.length}`);

  const stats = { cacheHits: 0, networkFetches: 0 };
  const evaluated = [];
  const CONCURRENCY = 8;
  for (let i = 0; i < regionDef.candidates.length; i += CONCURRENCY) {
    const batch = regionDef.candidates.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (seed) => {
        const apiPlace = seed.placeId
          ? await fetchPlaceById(seed.placeId, apiKey, cache, stats, forceRefresh)
          : await fetchPlaceByQuery(seed.searchQuery, regionDef, apiKey, cache, stats, forceRefresh);
        const res = policy.evaluateAndScoreCandidate(apiPlace, seed, regionDef);
        if (res.accepted && globalUsedPlaceIds.has(res.placeId)) {
          return {
            ...res,
            accepted: false,
            score: 0,
            reason: `cross_region_duplicate:${res.placeId}`,
          };
        }
        return res;
      })
    );
    evaluated.push(...batchResults);
  }
  savePlacesCache(cache);
  console.log(
    `✓ Hafıza (Cache): ${stats.cacheHits} önbellekten okundu, ${stats.networkFetches} yeni API sorgusu yapıldı`
  );

  for (const res of evaluated) {
    const badge = res.accepted ? `PASS [skor:${res.score}]` : `DROP [${res.reason}]`;
    console.log(
      ` - ${res.resolvedName} | ${res.businessStatus || '?'} | ★${res.rating ?? '?'} (${res.userRatingCount ?? '?'}) -> ${badge}`
    );
  }

  const snapshot = policy.selectDynamicRegionVenues(regionDef, evaluated);
  for (const venue of snapshot.venues) {
    globalUsedPlaceIds.add(venue.placeId);
  }

  // Ziyaretçi metni ve link güvenlik kontrolü
  const copyErrors = [];
  for (const venue of snapshot.venues) {
    const issues = policy.validateVisitorCopy(venue);
    if (issues.length) {
      copyErrors.push({ id: venue.id, issues });
    }
  }
  if (copyErrors.length > 0) {
    throw new Error(`Visitor copy validation failed:\n${JSON.stringify(copyErrors, null, 2)}`);
  }

  // Denetim raporu (gitignored work/ altında kalır)
  const auditDir = path.join(ROOT, 'work', 'gastronomy-v3');
  fs.mkdirSync(auditDir, { recursive: true });
  const auditPath = path.join(auditDir, `${regionKey}.audit.json`);
  fs.writeFileSync(
    auditPath,
    JSON.stringify(
      {
        verifiedAt: snapshot.verifiedAt,
        regionId: regionDef.id,
        totalCandidates: regionDef.candidates.length,
        acceptedCount: snapshot.venues.length,
        droppedCount: evaluated.filter((e) => !e.accepted).length,
        categoriesSummary: snapshot.categories.map((c) => ({
          slug: c.slug,
          label: c.label,
          count: snapshot.venues.filter((v) => v.categoryId === c.id).length,
        })),
        decisions: evaluated.map((e) => ({
          id: e.seed.id,
          placeId: e.placeId,
          resolvedName: e.resolvedName,
          categoryId: e.seed.categoryId,
          accepted: e.accepted,
          score: e.score,
          reason: e.reason,
          rating: e.rating,
          userRatingCount: e.userRatingCount,
          businessStatus: e.businessStatus,
          formattedAddress: e.formattedAddress,
        })),
      },
      null,
      2
    ) + '\n',
    'utf8'
  );

  // Herkese açık güvenli snapshot
  const publicDir = path.join(ROOT, 'lib', 'gastronomy-v3', 'regions');
  fs.mkdirSync(publicDir, { recursive: true });
  const publicPath = path.join(publicDir, `${regionKey}.json`);
  fs.writeFileSync(publicPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');

  // Kalıcı seçim gerekçesi dosyası (araştırma kanıtları, kaynaklar, artı/eksi/belirsizlikler)
  const selectedPlaceIds = new Set(snapshot.venues.map((v) => v.placeId));
  const dossierDir = path.join(ROOT, 'lib', 'gastronomy-v3', 'dossiers');
  fs.mkdirSync(dossierDir, { recursive: true });
  const dossierPath = path.join(dossierDir, `${regionKey}.dossier.json`);
  const dossierData = {
    schemaVersion: '3.4',
    regionKey,
    displayName: regionDef.displayName,
    verifiedAt: snapshot.verifiedAt,
    selectedCount: snapshot.venues.length,
    rejectedControls: evaluated
      .filter((e) => !e.accepted)
      .map((e) => ({ id: e.seed.id, resolvedName: e.resolvedName, reason: e.reason })),
    venues: evaluated
      .filter((e) => e.accepted)
      .map((e) => ({
        id: e.seed.id,
        categoryId: e.seed.categoryId,
        resolvedName: e.resolvedName,
        branchName: e.formattedAddress,
        placeId: e.placeId,
        coordinates: e.coordinates || null,
        rating: e.rating,
        userRatingCount: e.userRatingCount,
        priceLevel: e.priceLevel || null,
        serviceFlags: {
          dineIn: e.dineIn ?? null,
          takeout: e.takeout ?? null,
          outdoorSeating: e.outdoorSeating ?? null,
          reservable: e.reservable ?? null,
        },
        websiteUri: e.websiteUri || null,
        mapsUri: e.mapsUri,
        recommendedPrimary: e.seed.whatToOrder,
        recommendedSecondary: e.seed.secondaryItems || [],
        suitability: e.seed.suitability || null,
        verifiedAt: e.seed.dossier?.verifiedAt || snapshot.verifiedAt.slice(0, 10),
        sources: e.seed.dossier?.sources || [],
        pros: e.seed.dossier?.pros || [],
        cons: e.seed.dossier?.cons || [],
        uncertainties: e.seed.dossier?.uncertainties || [],
        selectionScore: e.score,
        selectedForSnapshot: selectedPlaceIds.has(e.placeId),
      })),
  };
  fs.writeFileSync(dossierPath, JSON.stringify(dossierData, null, 2) + '\n', 'utf8');

  console.log(`\n✓ ${snapshot.categories.length} aktif kategori, ${snapshot.venues.length} doğrulanmış mekan yazıldı:`);
  for (const cat of snapshot.categories) {
    const count = snapshot.venues.filter((v) => v.categoryId === cat.id).length;
    console.log(`   • ${cat.emoji} ${cat.label}: ${count} mekan`);
  }
  console.log(`✓ Snapshot: lib/gastronomy-v3/regions/${regionKey}.json`);
  console.log(`✓ Dossier: lib/gastronomy-v3/dossiers/${regionKey}.dossier.json`);
  console.log(`✓ Audit log: work/gastronomy-v3/${regionKey}.audit.json`);
}

async function main() {
  loadEnvLocal();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GOOGLE_PLACES_API_KEY is missing in .env.local or environment.');
    process.exit(1);
  }

  const forceRefresh = process.argv.slice(2).includes('--refresh');
  const cache = loadPlacesCache();
  const regionKeys = parseRegionsArg();
  const policy = loadTsModule('lib/gastronomy-v3/policy.ts');
  const globalUsedPlaceIds = new Set();

  for (const regionKey of regionKeys) {
    await runSingleRegion(regionKey, apiKey, policy, globalUsedPlaceIds, cache, forceRefresh);
  }

  // Aşama 2: Yayınlanmış 5 semtin "Çok Yakındaki Diğer Öneri" (<= 400m, en fazla 1) havuzunu hesapla
  const regionsDir = path.join(ROOT, 'lib', 'gastronomy-v3', 'regions');
  const dossiersDir = path.join(ROOT, 'lib', 'gastronomy-v3', 'dossiers');
  const poolPath = path.join(regionsDir, `${NEARBY_POOL_KEY}.json`);
  const nearbyPoolSnap = fs.existsSync(poolPath)
    ? JSON.parse(fs.readFileSync(poolPath, 'utf8'))
    : null;

  const scoreByPlaceId = new Map();
  for (const key of DEFAULT_REGION_ORDER) {
    const dPath = path.join(dossiersDir, `${key}.dossier.json`);
    if (!fs.existsSync(dPath)) continue;
    const dData = JSON.parse(fs.readFileSync(dPath, 'utf8'));
    for (const v of dData.venues || []) {
      if (v.placeId && typeof v.selectionScore === 'number') {
        scoreByPlaceId.set(v.placeId, v.selectionScore);
      }
    }
  }

  const publishedSnaps = PUBLISHED_REGION_KEYS.map((key) => ({
    key,
    path: path.join(regionsDir, `${key}.json`),
  }))
    .filter((entry) => fs.existsSync(entry.path))
    .map((entry) => {
      const snapshot = JSON.parse(fs.readFileSync(entry.path, 'utf8'));
      if (!snapshot.region.boundary) {
        const defRel = `lib/gastronomy-v3/definitions/${entry.key}.ts`;
        if (fs.existsSync(path.join(ROOT, defRel))) {
          const defMod = loadTsModule(defRel);
          const def = Object.values(defMod).find(
            (v) => v && typeof v === 'object' && v.bbox
          );
          if (def) {
            snapshot.region.boundary = {
              bbox: def.bbox,
              ...(def.excludeBbox ? { excludeBbox: def.excludeBbox } : {}),
            };
          }
        }
      }
      return { key: entry.key, path: entry.path, snapshot };
    });

  if (publishedSnaps.length > 0) {
    console.log('\n=== Aşama 2: Çok Yakındaki Tekil Öneriler (<= 400m, maks. 1) Hesaplanıyor ===');
    const allSnapsOnly = publishedSnaps.map((p) => p.snapshot);
    for (const entry of publishedSnaps) {
      const nearbyVenues = policy.computeRegionNearbyVenues(
        entry.snapshot,
        allSnapsOnly,
        nearbyPoolSnap,
        1,
        400,
        scoreByPlaceId
      );
      for (const nv of nearbyVenues) {
        const issues = policy.validateVisitorCopy(nv);
        if (issues.length > 0) {
          throw new Error(
            `Nearby visitor copy validation failed (${entry.key}/${nv.id}):\n${issues.join('\n')}`
          );
        }
      }
      const updated = { ...entry.snapshot, nearbyVenues };
      fs.writeFileSync(entry.path, JSON.stringify(updated, null, 2) + '\n', 'utf8');
      const perCat = entry.snapshot.categories
        .map((c) => `${c.slug}:${nearbyVenues.filter((n) => n.categoryId === c.id).length}`)
        .join(', ');
      console.log(` ✓ ${entry.key}: ${nearbyVenues.length} yakın öneri (${perCat})`);
    }
  }

  console.log(`\n=== Tamamlandı: ${regionKeys.length} bölge, toplam ${globalUsedPlaceIds.size} benzersiz doğrulanmış mekan ===\n`);
}

main().catch((err) => {
  console.error('PIPELINE FAILED:', err.message);
  process.exit(1);
});
