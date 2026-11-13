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

test('all 5 Kadikoy snapshots follow schema v3, canonical 6-category order, dynamic caps (1..5 standard, 1..10 denemelisin)', () => {
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
      const maxAllowed = cat.id === 'denemelisin' ? 10 : 5;
      assert.ok(count >= 1 && count <= maxAllowed, `${key}/${cat.slug} count=${count}`);
    }
  }
});

test('V3.3 dynamic denemelisin, Moda 5-slot iconic coffee & factual view accuracy without padding', () => {
  const moda = snapshots.find((s) => s.key === 'istanbul-kadikoy-moda').data;
  const carsi = snapshots.find((s) => s.key === 'istanbul-kadikoy-carsi').data;
  const yeldegirmeni = snapshots.find((s) => s.key === 'istanbul-kadikoy-yeldegirmeni').data;
  const caddebostan = snapshots.find((s) => s.key === 'istanbul-kadikoy-caddebostan').data;
  const suadiye = snapshots.find((s) => s.key === 'istanbul-kadikoy-suadiye').data;

  const modaCoffee = moda.venues.filter((v) => v.categoryId === 'kahve');
  assert.equal(modaCoffee.length, 5, `Moda kahve should have 5 venues with iconic slot, got ${modaCoffee.length}`);
  const walters = modaCoffee.find((v) => v.name.includes("Walter's Coffee"));
  const rawsters = modaCoffee.find((v) => v.name.includes('Rawsters Moda'));
  assert.ok(walters, "Moda kahve must include Walter's Coffee Roastery");
  assert.ok(rawsters, 'Moda kahve must include Rawsters Moda');
  assert.ok(
    !/deniz manzarası var|deniz manzarasına karşı|panoramik deniz/i.test(
      [walters.description, ...walters.beforeYouGo].join(' ')
    ),
    "Walter's Coffee Roastery copy must never falsely claim a sea view"
  );
  assert.ok(
    /deniz|koy manzar/i.test(rawsters.description),
    'Rawsters Moda copy should reflect its genuine sea-view terrace'
  );

  const countDenemelisin = (snap) => snap.venues.filter((v) => v.categoryId === 'denemelisin').length;
  assert.equal(countDenemelisin(moda), 8, 'Moda denemelisin should have 8 authentic venues');
  assert.equal(countDenemelisin(carsi), 7, 'Carsi denemelisin should have 7 heritage venues');
  assert.equal(countDenemelisin(yeldegirmeni), 4, 'Yeldegirmeni denemelisin must not be artificially padded to 10');
  assert.equal(countDenemelisin(caddebostan), 4, 'Caddebostan denemelisin must not be artificially padded to 10');
  assert.equal(countDenemelisin(suadiye), 4, 'Suadiye denemelisin must not be artificially padded to 10');
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
      assert.ok(typeof venue.rating === 'number' && venue.rating >= 4.0 && venue.rating <= 5.0);
    }
  }
  assert.ok(globalPlaceIds.size >= 85, `Expected >=85 unique Kadikoy venues, got ${globalPlaceIds.size}`);
});

test('every published region limits nearbyVenues to <= 1 per category within <= 400m of its border (Moda has 6)', () => {
  const cachePath = path.join(ROOT, 'work', 'gastronomy-v3', 'places-cache.json');
  assert.ok(fs.existsSync(cachePath), 'places-cache.json must exist after pipeline run');
  const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  assert.ok(Object.keys(cache.byPlaceId || {}).length >= 28, 'places-cache.json should persist verified Moda places');

  for (const { key, data } of snapshots) {
    assert.ok(Array.isArray(data.nearbyVenues), `Missing nearbyVenues array in ${key}`);
    const coreIds = new Set(data.venues.map((v) => v.placeId));

    for (const cat of data.categories) {
      const catNearby = data.nearbyVenues.filter((n) => n.categoryId === cat.id);
      assert.ok(
        catNearby.length <= 1,
        `Expected at most 1 nearby venue in ${key}/${cat.slug}, got ${catNearby.length}`
      );
      for (const nv of catNearby) {
        assert.ok(!coreIds.has(nv.placeId), `Nearby venue overlaps core placeId in ${key}/${cat.slug}: ${nv.name}`);
        assert.ok(
          typeof nv.distanceMeters === 'number' && nv.distanceMeters > 0 && nv.distanceMeters <= 400,
          `Nearby venue exceeds 400m border cap (${nv.distanceMeters}m) in ${key}/${cat.slug}: ${nv.name}`
        );
        assert.ok(
          typeof nv.distanceKm === 'number' && nv.distanceKm > 0 && nv.distanceKm <= 0.4,
          `Invalid distanceKm (${nv.distanceKm}) on ${nv.name}`
        );
        assert.ok(typeof nv.nearbyAreaLabel === 'string' && nv.nearbyAreaLabel.length > 0, `Missing nearbyAreaLabel on ${nv.name}`);
      }
    }
  }

  const moda = snapshots.find((s) => s.key === 'istanbul-kadikoy-moda').data;
  assert.equal(moda.nearbyVenues.length, 6, `Expected 6 single nearby venues across Moda categories, got ${moda.nearbyVenues.length}`);

  const yeldegirmeni = snapshots.find((s) => s.key === 'istanbul-kadikoy-yeldegirmeni').data;
  assert.equal(
    yeldegirmeni.nearbyVenues.filter((n) => n.categoryId === 'kahvalti').length,
    0,
    'Yeldegirmeni kahvalti has no <=400m neighbor and must remain 0 (no distant padding)'
  );
  const suadiye = snapshots.find((s) => s.key === 'istanbul-kadikoy-suadiye').data;
  assert.equal(
    suadiye.nearbyVenues.filter((n) => n.categoryId === 'pizza').length,
    0,
    'Suadiye pizza has no <=400m neighbor and must remain 0 (no distant padding)'
  );
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

  assert.equal(byId.get('ctrl-cekirdekhane').accepted, false);
  assert.ok(byId.get('ctrl-cekirdekhane').reason.includes('brand_discontinuity'));

  assert.equal(byId.get('ctrl-bafetto-chain').accepted, false);
  assert.equal(byId.get('ctrl-bafetto-chain').reason, 'chain_or_franchise');
});

test('V3.2 rules, secondaryItems, suitability, zero Çekirdekhane, complete dossiers & visitor isolation', () => {
  const rulesPath = path.join(ROOT, 'lib', 'gastronomy-v3', 'RULES.md');
  assert.ok(fs.existsSync(rulesPath), 'RULES.md must exist');
  assert.ok(fs.readFileSync(rulesPath, 'utf8').length > 500, 'RULES.md must be populated');

  const firstPersonRe = /\b(tattım|tattık|denedim|denedik|gittim|gittik|bayıldım|bayıldık|benim favorim|bizim favorimiz|kendim deneyimledim)\b/i;
  const unverifiedPriceClockRe = /(\b\d+\s*(tl|₺|try|lira)\b|\b([01]?\d|2[0-3]):[0-5]\d\b)/i;

  for (const key of REGION_KEYS) {
    const snap = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib', 'gastronomy-v3', 'regions', `${key}.json`), 'utf8'));
    for (const v of snap.venues) {
      assert.ok(!/çekirdekhane|cekirdekhane|^çekirdek$/i.test(v.name), `Forbidden Cekirdek/Cekirdekhane in ${key}: ${v.name}`);
      assert.ok(Array.isArray(v.alsoTry) && v.alsoTry.length >= 1, `Missing alsoTry in ${key}/${v.id}`);
      assert.ok(v.alsoTry.every((item) => item.includes(' — ')), `Expected ' — ' format in alsoTry for ${key}/${v.id}`);
      assert.ok(Array.isArray(v.beforeYouGo) && v.beforeYouGo.length >= 3, `Expected >=3 beforeYouGo tips in ${key}/${v.id}`);

      const texts = [v.name, v.description, ...v.whatToOrder, ...v.menuFrom, ...v.alsoTry, ...v.beforeYouGo];
      for (const txt of texts) {
        assert.ok(!firstPersonRe.test(txt), `First-person claim in ${key}/${v.id}: ${txt}`);
        assert.ok(!unverifiedPriceClockRe.test(txt), `Unverified TL/clock in ${key}/${v.id}: ${txt}`);
      }
    }

    const dossierPath = path.join(ROOT, 'lib', 'gastronomy-v3', 'dossiers', `${key}.dossier.json`);
    assert.ok(fs.existsSync(dossierPath), `Missing dossier for ${key}`);
    const dossier = JSON.parse(fs.readFileSync(dossierPath, 'utf8'));
    assert.equal(dossier.selectedCount, snap.venues.length);
    for (const dv of dossier.venues) {
      assert.ok(Array.isArray(dv.sources) && dv.sources.length >= 2, `Expected >=2 sources in dossier ${key}/${dv.id}`);
      assert.ok(Array.isArray(dv.pros) && dv.pros.length >= 1, `Expected pros in dossier ${key}/${dv.id}`);
      assert.ok(Array.isArray(dv.cons) && dv.cons.length >= 1, `Expected cons in dossier ${key}/${dv.id}`);
      assert.ok(Array.isArray(dv.uncertainties) && dv.uncertainties.length >= 1, `Expected uncertainties in dossier ${key}/${dv.id}`);
    }
  }

  // Ensure visitor runtime & UI files never import dossiers/
  const runtimeCheckFiles = [
    path.join(ROOT, 'lib', 'gastronomy-v3', 'registry.ts'),
    path.join(ROOT, 'lib', 'pilot', 'integration', 'discovery.ts'),
    path.join(ROOT, 'lib', 'pilot', 'integration', 'foodAdapter.ts'),
    path.join(ROOT, 'components', 'nearby-places', 'PremiumRestaurantCard.tsx'),
    path.join(ROOT, 'components', 'mobile-detail-variants', 'VariantABottomSheet.tsx'),
  ];
  for (const file of runtimeCheckFiles) {
    const content = fs.readFileSync(file, 'utf8');
    assert.ok(!content.includes('dossiers/'), `Forbidden dossiers import/ref in ${file}`);
  }
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
    assert.ok(
      firstResult.nearbyVenues.length <= 1,
      `${slug} first category exceeded single nearbyVenue cap: ${firstResult.nearbyVenues.length}`
    );
    if (slug === 'moda') {
      assert.equal(firstResult.nearbyVenues.length, 1, 'Moda first category must have 1 ultra-close nearby venue');
      assert.ok(
        typeof firstResult.nearbyVenues[0].distanceMeters === 'number' &&
          firstResult.nearbyVenues[0].distanceMeters <= 400,
        'Moda nearby venue must be <= 400m from border'
      );
    }
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
