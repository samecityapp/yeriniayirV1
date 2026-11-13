import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const ROOT = process.cwd();
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

async function fetchPlaceById(placeId, apiKey) {
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
  return res.json();
}

async function fetchPlaceByQuery(textQuery, regionDef, apiKey) {
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
  return first;
}

function parseRegionArg() {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--region');
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  const eq = args.find((a) => a.startsWith('--region='));
  if (eq) return eq.split('=')[1];
  return 'istanbul-kadikoy-moda';
}

async function main() {
  loadEnvLocal();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GOOGLE_PLACES_API_KEY is missing in .env.local or environment.');
    process.exit(1);
  }

  const regionKey = parseRegionArg();
  const defRel = `lib/gastronomy-v3/definitions/${regionKey}.ts`;
  if (!fs.existsSync(path.join(ROOT, defRel))) {
    console.error(`ERROR: Definition not found: ${defRel}`);
    process.exit(1);
  }

  const policy = loadTsModule('lib/gastronomy-v3/policy.ts');
  const defModule = loadTsModule(defRel);
  const regionDef = Object.values(defModule).find(
    (v) => v && typeof v === 'object' && Array.isArray(v.candidates) && Array.isArray(v.categories)
  );
  if (!regionDef) {
    console.error(`ERROR: Could not locate V3RegionDefinition export in ${defRel}`);
    process.exit(1);
  }

  console.log(`\n=== V3 Gastronomi Pipeline: ${regionDef.displayName} (${regionKey}) ===`);
  console.log(`Toplam aday havuzu: ${regionDef.candidates.length}`);

  const evaluated = [];
  const CONCURRENCY = 8;
  for (let i = 0; i < regionDef.candidates.length; i += CONCURRENCY) {
    const batch = regionDef.candidates.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (seed) => {
        const apiPlace = seed.placeId
          ? await fetchPlaceById(seed.placeId, apiKey)
          : await fetchPlaceByQuery(seed.searchQuery, regionDef, apiKey);
        return policy.evaluateAndScoreCandidate(apiPlace, seed, regionDef);
      })
    );
    evaluated.push(...batchResults);
  }

  for (const res of evaluated) {
    const badge = res.accepted ? `PASS [skor:${res.score}]` : `DROP [${res.reason}]`;
    console.log(
      ` - ${res.resolvedName} | ${res.businessStatus || '?'} | ★${res.rating ?? '?'} (${res.userRatingCount ?? '?'}) -> ${badge}`
    );
  }

  const snapshot = policy.selectDynamicRegionVenues(regionDef, evaluated);

  // Ziyaretçi metni ve link güvenlik kontrolü
  const copyErrors = [];
  for (const venue of snapshot.venues) {
    const issues = policy.validateVisitorCopy(venue);
    if (issues.length) {
      copyErrors.push({ id: venue.id, issues });
    }
  }
  if (copyErrors.length > 0) {
    console.error('ERROR: Visitor copy validation failed:', JSON.stringify(copyErrors, null, 2));
    process.exit(1);
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

  console.log(`\n✓ ${snapshot.categories.length} aktif kategori, ${snapshot.venues.length} doğrulanmış mekan yazıldı:`);
  for (const cat of snapshot.categories) {
    const count = snapshot.venues.filter((v) => v.categoryId === cat.id).length;
    console.log(`   • ${cat.emoji} ${cat.label}: ${count} mekan`);
  }
  console.log(`✓ Snapshot: lib/gastronomy-v3/regions/${regionKey}.json`);
  console.log(`✓ Audit log: work/gastronomy-v3/${regionKey}.audit.json\n`);
}

main().catch((err) => {
  console.error('PIPELINE FAILED:', err.message);
  process.exit(1);
});
