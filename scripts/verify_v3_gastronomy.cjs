const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const ROOT = process.cwd();
let passed = 0;

const tests = [];

function test(label, fn) {
  tests.push({ label, fn });
}

function loadTsModule(relPath) {
  const absPath = path.join(ROOT, relPath);
  const visited = new Map();

  function loadRec(filePath) {
    if (visited.has(filePath)) return visited.get(filePath).exports;
    if (filePath.endsWith('.json')) {
      const jsonMod = { exports: JSON.parse(fs.readFileSync(filePath, 'utf8')) };
      visited.set(filePath, jsonMod);
      return jsonMod.exports;
    }

    const mod = { exports: {} };
    visited.set(filePath, mod);

    const src = fs.readFileSync(filePath, 'utf8');
    const js = ts.transpileModule(src, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
        resolveJsonModule: true,
      },
    }).outputText;

    const localRequire = (specifier) => {
      if (specifier.startsWith('.') || specifier.startsWith('@/')) {
        const base = specifier.startsWith('@/')
          ? path.join(ROOT, specifier.slice(2))
          : path.resolve(path.dirname(filePath), specifier);
        const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.json`, path.join(base, 'index.ts')];
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

const REGION_KEYS = [
  'istanbul-kadikoy-moda',
  'istanbul-kadikoy-carsi',
  'istanbul-kadikoy-yeldegirmeni',
  'istanbul-kadikoy-caddebostan',
  'istanbul-kadikoy-suadiye',
];

const CANONICAL_SLUGS = ['pizza', 'hamburger', 'kahve', 'date-mekanlari', 'kahvalti', 'denemelisin'];

const snapshots = REGION_KEYS.map((key) => {
  const p = path.join(ROOT, `lib/gastronomy-v3/regions/${key}.json`);
  return { key, data: JSON.parse(fs.readFileSync(p, 'utf8')) };
});

test('all 5 Kadikoy snapshots follow schema v3, canonical 6-category order, and 1..4 venues per category', () => {
  for (const { key, data } of snapshots) {
    assert.equal(data.schemaVersion, 3, key);
    assert.ok(data.categories.length >= 5 && data.categories.length <= 6, `${key} cats=${data.categories.length}`);

    // Verify canonical ordering of active categories
    const slugs = data.categories.map((c) => c.slug);
    let lastIdx = -1;
    for (const s of slugs) {
      const idx = CANONICAL_SLUGS.indexOf(s);
      assert.ok(idx !== -1, `Unexpected category slug ${s} in ${key}`);
      assert.ok(idx > lastIdx, `Out-of-order canonical category ${s} in ${key}: ${slugs.join(',')}`);
      lastIdx = idx;
    }

    for (const cat of data.categories) {
      const count = data.venues.filter((v) => v.categoryId === cat.id).length;
      assert.ok(count >= 1 && count <= 4, `${key}/${cat.slug} count=${count}`);
    }
  }
});

test('Caddebostan dynamically prunes breakfast ("Yoksa Onerme") when no qualifying venue passes gates', () => {
  const caddebostan = snapshots.find((s) => s.key === 'istanbul-kadikoy-caddebostan').data;
  assert.equal(caddebostan.categories.length, 5);
  assert.equal(caddebostan.categories.some((c) => c.slug === 'kahvalti'), false);
});

test('all 5 Kadikoy regions have zero overlapping placeIds, valid ratings, and canonical CID links', () => {
  const globalPlaceIds = new Set();
  for (const { key, data } of snapshots) {
    for (const venue of data.venues) {
      assert.ok(!globalPlaceIds.has(venue.placeId), `Cross-region or duplicate placeId ${venue.placeId} (${venue.name} in ${key})`);
      globalPlaceIds.add(venue.placeId);
      assert.ok(venue.address.includes('Kadıköy'), `Outside Kadıköy: ${venue.name} -> ${venue.address}`);
      assert.ok(venue.mapsUri.startsWith('https://maps.google.com/?cid='), `Invalid CID URI: ${venue.mapsUri}`);
      assert.ok(typeof venue.rating === 'number' && venue.rating >= 4.2 && venue.rating <= 5.0);
    }
  }
  assert.ok(globalPlaceIds.size >= 80, `Expected >=80 unique Kadikoy venues, got ${globalPlaceIds.size}`);
});

test('snapshots never leak review counts, source URLs, forbidden terms, or API keys', () => {
  for (const { key, data } of snapshots) {
    const raw = JSON.stringify(data);
    assert.ok(!/userRatingCount|reviewCount|googleReviewCount|sourcePageUrl/.test(raw), `Leak in ${key}`);
    assert.ok(
      !/en iyi|rakipsiz|kusursuz|mükemmel|muhteşem|tartışmasız|1 numara|yorum|Michelin|Gault|Time Out|Barista Magazine|Kaynaklar|Neden Gitmeli/i.test(
        raw
      ),
      `Forbidden copy in ${key}`
    );
    assert.ok(!/AIza[0-9A-Za-z_-]{20,}/.test(raw), `API key leak in ${key}`);
  }
});

test('policy gates reject closed, chain, out-of-neighborhood, and degraded candidates in Moda audit log', () => {
  const auditPath = path.join(ROOT, 'work/gastronomy-v3/istanbul-kadikoy-moda.audit.json');
  assert.ok(fs.existsSync(auditPath));
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const byId = new Map(audit.decisions.map((d) => [d.id, d]));

  assert.equal(byId.get('ctrl-fornello').accepted, false);
  assert.ok(byId.get('ctrl-fornello').reason.includes('CLOSED_TEMPORARILY'));

  assert.equal(byId.get('ctrl-mini-eatery').accepted, false);
  assert.ok(byId.get('ctrl-mini-eatery').reason.includes('CLOSED_PERMANENTLY'));

  assert.equal(byId.get('ctrl-naan-bakeshop').accepted, false);
  assert.ok(byId.get('ctrl-naan-bakeshop').reason.includes('CLOSED_PERMANENTLY'));

  assert.equal(byId.get('ctrl-il-pellicano').accepted, false);
  assert.ok(byId.get('ctrl-il-pellicano').reason.includes('outside_strict_neighborhood'));

  assert.equal(byId.get('ctrl-coffy-moda').accepted, false);
  assert.equal(byId.get('ctrl-coffy-moda').reason, 'chain_or_franchise');

  assert.equal(byId.get('ctrl-sliceguy').accepted, false);
  assert.ok(byId.get('ctrl-sliceguy').reason.includes('recent_quality_degradation'));

  assert.equal(byId.get('ctrl-ali-usta').accepted, false);
  assert.equal(byId.get('ctrl-asuman').accepted, false);
});

test('runtime discovery, foodAdapter, and realProvider expose all 5 Kadikoy regions as published with Il>Ilce>Semt', async () => {
  const discoveryMod = loadTsModule('lib/pilot/integration/discovery.ts');
  const adapterMod = loadTsModule('lib/pilot/integration/foodAdapter.ts');
  const providerMod = loadTsModule('lib/food/realProvider.ts');

  const modaDiscovery = await discoveryMod.readIntegrationDiscovery('moda', '');
  assert.ok(modaDiscovery);
  const food = adapterMod.toFoodDiscovery(modaDiscovery);
  const provider = providerMod.createRealFoodProvider(food);

  const ready = provider.getReadyRegions();
  assert.equal(ready.length, 5);
  assert.deepEqual(
    ready.map((r) => r.slug),
    ['moda', 'kadikoy-carsi', 'yeldegirmeni', 'caddebostan', 'suadiye']
  );

  for (const loc of food.locations) {
    assert.ok(loc.city && loc.district && loc.neighborhood, `Missing hierarchy for ${loc.id}`);
  }

  // Unpublished regions cannot resolve
  assert.equal(provider.getLocationBySlug('gaziantep'), undefined);
  assert.equal(provider.getLocationBySlug('antalya-lara'), undefined);
  assert.equal(provider.getLocationBySlug('kosuyolu'), undefined);

  // Verify all 5 published regions resolve cleanly through readIntegrationDiscovery
  for (const slug of ['moda', 'kadikoy-carsi', 'yeldegirmeni', 'caddebostan', 'suadiye']) {
    const disc = await discoveryMod.readIntegrationDiscovery(slug, '');
    assert.ok(disc, `Missing discovery for ${slug}`);
    const f = adapterMod.toFoodDiscovery(disc);
    const p = providerMod.createRealFoodProvider(f);
    const cats = p.getRegionCategories(disc.region.id);
    assert.ok(cats.length >= 5, `${slug} cats=${cats.length}`);
    const firstResult = p.getCategoryResult(disc.region.id, cats[0].slug);
    assert.ok(firstResult && firstResult.coreVenues.length >= 1, `${slug} first category empty`);
    assert.ok(firstResult.coreVenues[0].ratings[0].attribution.mapsUri.startsWith('https://maps.google.com/?cid='));
  }
});

(async () => {
  for (const t of tests) {
    await t.fn();
    passed++;
    console.log('PASS ' + t.label);
  }
  console.log(`${passed}/${passed} V3 gastronomy checks passed.`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
