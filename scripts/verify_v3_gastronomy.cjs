const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const ROOT = process.cwd();
let passed = 0;

function test(label, fn) {
  fn();
  passed++;
  console.log('PASS ' + label);
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

const snapshotPath = path.join(ROOT, 'lib/gastronomy-v3/regions/istanbul-kadikoy-moda.json');
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));

test('snapshot schema v3 has 5 dynamic categories and 1..4 venues per category', () => {
  assert.equal(snapshot.schemaVersion, 3);
  assert.equal(snapshot.categories.length, 5);
  assert.ok(snapshot.venues.length >= 15 && snapshot.venues.length <= 20);
  for (const cat of snapshot.categories) {
    const count = snapshot.venues.filter((v) => v.categoryId === cat.id).length;
    assert.ok(count >= 1 && count <= 4, `${cat.slug} count=${count}`);
  }
});

test('all venues are strictly inside Caferaga (Moda) with canonical Google Maps CID links', () => {
  const seenPlaceIds = new Set();
  for (const venue of snapshot.venues) {
    assert.ok(!seenPlaceIds.has(venue.placeId), `Duplicate placeId ${venue.placeId}`);
    seenPlaceIds.add(venue.placeId);
    assert.ok(venue.address.includes('Caferağa'), `Outside Caferağa: ${venue.name} -> ${venue.address}`);
    assert.ok(venue.mapsUri.startsWith('https://maps.google.com/?cid='), `Invalid CID URI: ${venue.mapsUri}`);
    assert.ok(typeof venue.rating === 'number' && venue.rating >= 4.2 && venue.rating <= 5.0);
  }
});

test('snapshot never leaks review counts, source URLs, or forbidden superlative/review terms', () => {
  const raw = JSON.stringify(snapshot);
  assert.ok(!/userRatingCount|reviewCount|googleReviewCount|sourcePageUrl/.test(raw));
  assert.ok(!/en iyi|rakipsiz|kusursuz|mükemmel|muhteşem|tartışmasız|1 numara|yorum|Michelin|Gault|Time Out|Barista Magazine|Kaynaklar|Neden Gitmeli/i.test(raw));
  assert.ok(!/AIza[0-9A-Za-z_-]{20,}/.test(raw));
});

test('policy gates reject closed, chain, out-of-neighborhood, and degraded candidates', () => {
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

test('runtime discovery adapter and realProvider expose only V3 Moda as published with Il>Ilce>Semt metadata', () => {
  const discoveryMod = loadTsModule('lib/pilot/integration/discovery.ts');
  const adapterMod = loadTsModule('lib/pilot/integration/foodAdapter.ts');
  const providerMod = loadTsModule('lib/food/realProvider.ts');

  const integration = {
    schemaVersion: 1,
    dataKind: 'real-research',
    mode: 'integration-preparation',
    productionPublished: false,
    region: {
      id: snapshot.region.id,
      slug: snapshot.region.slug,
      name: snapshot.region.neighborhood,
      displayName: snapshot.region.displayName,
      path: snapshot.region.path,
    },
    categories: snapshot.categories.map((c) => ({
      slug: c.slug,
      id: c.id,
      label: c.label,
      isMustTry: Boolean(c.isMustTry),
      emoji: c.emoji,
    })),
    categorySlug: 'kahve',
    venues: snapshot.venues.map((v) => ({
      id: v.id,
      name: v.name,
      location: v.address,
      categoryId: v.categoryId,
      description: v.description,
      whatToOrder: v.whatToOrder,
      menuFrom: v.menuFrom,
      alsoTry: v.alsoTry,
      beforeYouGo: v.beforeYouGo,
      photo: null,
      ratings: [
        {
          platform: 'google-maps',
          value: v.rating,
          attribution: { label: 'Google Maps', mapsUri: v.mapsUri, providers: [] },
        },
      ],
    })),
    rituals: [],
  };

  assert.ok(discoveryMod.readIntegrationDiscovery);
  const food = adapterMod.toFoodDiscovery(integration);
  const provider = providerMod.createRealFoodProvider(food);

  const ready = provider.getReadyRegions();
  assert.equal(ready.length, 1);
  assert.equal(ready[0].id, 'moda-kadikoy');

  for (const loc of food.locations) {
    assert.ok(loc.city && loc.district && loc.neighborhood, `Missing hierarchy for ${loc.id}`);
  }

  // Unpublished regions cannot resolve
  assert.equal(provider.getLocationBySlug('gaziantep'), undefined);
  assert.equal(provider.getLocationBySlug('antalya-lara'), undefined);

  // Dynamic category pruning works
  assert.equal(provider.getRegionCategories('moda-kadikoy').length, 5);
  assert.equal(provider.getCategoryResult('moda-kadikoy', 'balik-deniz-urunleri'), undefined);
  assert.equal(provider.getCategoryResult('moda-kadikoy', 'kahve').coreVenues.length, 3);
  assert.equal(provider.getCategoryResult('moda-kadikoy', 'kahve').coreVenues[0].ratings[0].attribution.mapsUri.startsWith('https://maps.google.com/?cid='), true);
});

console.log(`${passed}/${passed} V3 gastronomy checks passed.`);
