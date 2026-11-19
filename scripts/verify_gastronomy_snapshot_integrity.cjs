#!/usr/bin/env node
// Deterministic Gastronomy V3 Snapshot & GEO Integrity Verifier
// Usage: node scripts/verify_gastronomy_snapshot_integrity.cjs [--regions-dir=<dir>] [--json]
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const loadTs = require('./security/load-ts.cjs');

const ROOT = process.cwd();
const DEFAULT_REGIONS_DIR = path.join(ROOT, 'lib/gastronomy-v3/regions');
const FORBIDDEN_VISITOR_COPY_RE =
  /en iyi|rakipsiz|kusursuz|mükemmel|muhteşem|tartışmasız|1 numara|yorum/i;
const CID_URL_RE = /^https:\/\/maps\.google\.com\/\?cid=\d+$/;

function parseArgs(argv) {
  let regionsDir = DEFAULT_REGIONS_DIR;
  let emitJson = false;
  for (const arg of argv) {
    if (arg.startsWith('--regions-dir=')) {
      regionsDir = path.resolve(ROOT, arg.slice('--regions-dir='.length));
    } else if (arg === '--json') {
      emitJson = true;
    }
  }
  return { regionsDir, emitJson };
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function getPublishedRegistryFilenames() {
  const regSrc = fs.readFileSync(path.join(ROOT, 'lib/gastronomy-v3/registry.ts'), 'utf8');
  return Array.from(
    new Set(
      [...regSrc.matchAll(/\.\/regions\/([a-z0-9-]+\.json)/g)].map((m) => m[1])
    )
  ).sort();
}

function verifySnapshotIntegrity({ regionsDir = DEFAULT_REGIONS_DIR } = {}) {
  const { V3_LOCATIONS } = loadTs('lib/gastronomy-v3/registry.ts');
  const { PILOT_VENUE_IDS } = loadTs('lib/gastronomy-v3/geoPilot.ts');

  if (!fs.existsSync(regionsDir) || !fs.statSync(regionsDir).isDirectory()) {
    throw new Error(`Snapshot dizini bulunamadı: ${regionsDir}`);
  }

  const publishedFiles = getPublishedRegistryFilenames();
  assert.equal(
    publishedFiles.length,
    V3_LOCATIONS.length,
    `registry.ts yayınlı dosya sayısı (${publishedFiles.length}) !== V3_LOCATIONS (${V3_LOCATIONS.length})`
  );

  const allJsonFiles = fs
    .readdirSync(regionsDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  for (const reqFile of publishedFiles) {
    if (!allJsonFiles.includes(reqFile)) {
      throw new Error(
        `MISSING_SNAPSHOT:${reqFile} (Kurtarma: git checkout HEAD -- lib/gastronomy-v3/regions/${reqFile})`
      );
    }
  }

  const publishedSet = new Set(publishedFiles);
  const parsedByFile = new Map();
  const digests = {};

  // Parse and checksum EVERY JSON file in regions/ (published + auxiliary nearby pool).
  for (const file of allJsonFiles) {
    const absPath = path.join(regionsDir, file);
    const raw = fs.readFileSync(absPath);
    digests[file] = sha256(raw);

    let parsed;
    try {
      parsed = JSON.parse(raw.toString('utf8'));
    } catch (err) {
      const slugHint = file.replace(/\.json$/, '');
      throw new Error(
        `CORRUPT_JSON:${file}: ${err.message} (Kurtarma: git checkout HEAD -- lib/gastronomy-v3/regions/${file} && node scripts/run_region_pipeline.mjs --region=${slugHint} --max-fetches=0)`
      );
    }
    assert.equal(parsed?.schemaVersion, 3, `${file}: schemaVersion !== 3`);
    assert.ok(parsed?.verifiedAt && !Number.isNaN(Date.parse(parsed.verifiedAt)), `${file}: geçersiz verifiedAt`);
    assert.ok(parsed?.region?.slug && Array.isArray(parsed?.region?.path), `${file}: region meta eksik`);
    assert.ok(Array.isArray(parsed?.categories) && parsed.categories.length > 0, `${file}: categories boş`);
    assert.ok(Array.isArray(parsed?.venues) && parsed.venues.length > 0, `${file}: venues boş`);
    parsedByFile.set(file, parsed);
  }

  const seenPlaceIds = new Map();
  const seenVenueIds = new Map();
  let totalVenues = 0;

  for (const file of publishedFiles) {
    const parsed = parsedByFile.get(file);
    const categoryIds = new Set(parsed.categories.map((c) => c.id));
    for (const v of parsed.venues) {
      assert.ok(v && typeof v === 'object', `${file}: geçersiz venue nesnesi`);
      assert.ok(typeof v.id === 'string' && v.id.length > 0, `${file}: venue.id eksik`);
      assert.ok(typeof v.name === 'string' && v.name.length > 0, `${file}/${v.id}: name eksik`);
      assert.ok(typeof v.address === 'string' && v.address.length > 0, `${file}/${v.id}: address eksik`);
      assert.ok(typeof v.placeId === 'string' && v.placeId.length > 0, `${file}/${v.id}: placeId eksik`);
      assert.match(v.mapsUri || '', CID_URL_RE, `${file}/${v.id}: geçersiz mapsUri (${v.mapsUri})`);
      assert.ok(categoryIds.has(v.categoryId), `${file}/${v.id}: bilinmeyen categoryId=${v.categoryId}`);

      const rawVenueStr = JSON.stringify(v);
      assert.equal(
        /userRatingCount|reviewCount|googleReviewCount|sourcePageUrl/i.test(rawVenueStr),
        false,
        `${file}/${v.id}: yasaklı dahili/yorum alanı sızıntısı`
      );
      assert.equal(
        FORBIDDEN_VISITOR_COPY_RE.test(rawVenueStr),
        false,
        `${file}/${v.id}: yasaklı ziyaretçi metni (FORBIDDEN_VISITOR_COPY_REGEX)`
      );

      if (seenPlaceIds.has(v.placeId)) {
        throw new Error(
          `DUPLICATE_PLACE_ID:${v.placeId} (${seenPlaceIds.get(v.placeId)} ve ${file}/${v.id})`
        );
      }
      seenPlaceIds.set(v.placeId, `${file}/${v.id}`);
      seenVenueIds.set(v.id, file);
      totalVenues++;
    }
  }

  for (const loc of V3_LOCATIONS) {
    const matched = publishedFiles.find((file) => {
      const snap = parsedByFile.get(file);
      return (
        snap.region?.slug === loc.slug &&
        Array.isArray(snap.region?.path) &&
        snap.region.path.join('/') === loc.path.join('/')
      );
    });
    assert.ok(
      matched && publishedSet.has(matched),
      `V3_LOCATIONS kaydı (${loc.slug} / ${loc.path.join('/')}) snapshot dizininde bulunamadı`
    );
  }

  for (const pid of PILOT_VENUE_IDS) {
    assert.ok(seenVenueIds.has(pid), `PILOT_VENUE_IDS kaydı (${pid}) snapshot venues içinde eksik`);
  }

  const llmsPath = path.join(ROOT, 'public/llms.txt');
  const llmsFullPath = path.join(ROOT, 'public/llms-full.txt');
  assert.ok(fs.existsSync(llmsPath) && fs.statSync(llmsPath).size > 1000, 'public/llms.txt eksik veya boş');
  assert.ok(fs.existsSync(llmsFullPath) && fs.statSync(llmsFullPath).size > 10000, 'public/llms-full.txt eksik veya boş');

  const manifestDigest = sha256(
    Buffer.from(
      Object.entries(digests)
        .map(([k, v]) => `${k}:${v}`)
        .join('\n')
    )
  );

  return {
    ok: true,
    regionsDir,
    totalJsonFiles: allJsonFiles.length,
    publishedRegionCount: publishedFiles.length,
    totalVenues,
    uniquePlaceIds: seenPlaceIds.size,
    pilotVenuesVerified: PILOT_VENUE_IDS.length,
    manifestDigest,
  };
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  try {
    const result = verifySnapshotIntegrity({ regionsDir: args.regionsDir });
    if (args.emitJson) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(
        `PASS Gastronomy snapshot integrity: ${result.publishedRegionCount} published regions (${result.totalJsonFiles} JSON files incl. nearby pool), ${result.totalVenues} venues (${result.uniquePlaceIds} unique placeIds), ${result.pilotVenuesVerified} pilot venues, digest=${result.manifestDigest.slice(0, 16)}`
      );
    }
  } catch (err) {
    console.error(`FAIL Gastronomy snapshot integrity: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { verifySnapshotIntegrity };
