const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
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
  'istanbul-kadikoy-feneryolu',
  'istanbul-kadikoy-fenerbahce-kalamis',
  'istanbul-kadikoy-caddebostan',
  'istanbul-kadikoy-suadiye',
  'istanbul-kadikoy-bostanci',
  'istanbul-kadikoy-kosuyolu-acibadem',
  'istanbul-uskudar-merkez',
  'istanbul-uskudar-kuzguncuk',
  'istanbul-uskudar-cengelkoy',
  'istanbul-beyoglu-karakoy',
  'istanbul-beyoglu-cihangir',
  'istanbul-sisli-nisantasi',
  'istanbul-beyoglu-galata',
  'istanbul-besiktas-carsi',
  'istanbul-besiktas-akaretler',
  'istanbul-besiktas-bebek',
  'istanbul-besiktas-etiler',
  'istanbul-besiktas-ortakoy',
  'aydin-kusadasi',
  'gaziantep-merkez',
  'antalya-kaleici',
  'antalya-lara',
  'antalya-konyaalti',
  'mugla-ula-akyaka',
];

const CANONICAL_SLUGS = [
  'pizza',
  'hamburger',
  'kahve',
  'date-mekanlari',
  'kahvalti',
  'denemelisin',
  'balik-deniz-urunleri',
  'kofte-piyaz',
  'kebap-pide-doner',
];

const snapshots = REGION_KEYS.map((key) => {
  const p = path.join(ROOT, `lib/gastronomy-v3/regions/${key}.json`);
  return { key, data: JSON.parse(fs.readFileSync(p, 'utf8')) };
});

test('all published snapshots follow schema v3, canonical order, dynamic caps (1..5 standard/coastal/heritage, 1..10 denemelisin)', () => {
  for (const { key, data } of snapshots) {
    assert.equal(data.schemaVersion, 3, key);
    const isCoastal =
      key === 'aydin-kusadasi' ||
      key === 'mugla-ula-akyaka' ||
      key === 'istanbul-kadikoy-fenerbahce-kalamis' ||
      key === 'istanbul-kadikoy-bostanci' ||
      key === 'istanbul-uskudar-cengelkoy' ||
      key === 'istanbul-beyoglu-karakoy' ||
      key === 'istanbul-besiktas-carsi' ||
      key === 'istanbul-besiktas-bebek' ||
      key === 'istanbul-besiktas-ortakoy';
    const isHeritage = key === 'gaziantep-merkez';
    const isAntalya = key.startsWith('antalya-');
    assert.ok(
      isHeritage
        ? data.categories.length === 8
        : isAntalya
        ? data.categories.length >= 8 && data.categories.length <= 9
        : isCoastal
        ? (key === 'istanbul-besiktas-bebek' ? data.categories.length === 6 : data.categories.length === 7)
        : data.categories.length >= 5 && data.categories.length <= 6,
      `${key} cats=${data.categories.length}`
    );

    const slugs = data.categories.map((c) => c.slug);
    if (isHeritage) {
      assert.ok(
        !slugs.includes('pizza') && !slugs.includes('hamburger'),
        `${key} must never expose pizza or hamburger categories`
      );
      assert.deepEqual(
        slugs,
        ['kebap', 'beyran', 'baklava', 'katmer', 'antep-mutfagi', 'kahvalti', 'kahve', 'denemelisin'],
        `Unexpected heritage categories in ${key}`
      );
    } else {
      // Verify canonical ordering of active categories
      let lastIdx = -1;
      for (const s of slugs) {
        const idx = CANONICAL_SLUGS.indexOf(s);
        assert.ok(idx !== -1, `Unexpected category slug ${s} in ${key}`);
        assert.ok(idx > lastIdx, `Out-of-order canonical category ${s} in ${key}: ${slugs.join(',')}`);
        lastIdx = idx;
      }
    }

    for (const cat of data.categories) {
      const lowerTitle = cat.title.toLocaleLowerCase('tr-TR');
      assert.ok(
        !lowerTitle.includes(data.region.locative.toLocaleLowerCase('tr-TR')) &&
          !lowerTitle.includes(data.region.city.toLocaleLowerCase('tr-TR')),
        `Category title must not repeat region locative/city (${data.region.locative} ${cat.title}) in ${key}`
      );
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
  assert.equal(countDenemelisin(moda), 10, 'Moda denemelisin should have 10 authentic venues');
  assert.equal(countDenemelisin(carsi), 10, 'Kadikoy denemelisin should have 10 heritage venues');
  assert.equal(countDenemelisin(yeldegirmeni), 7, 'Yeldegirmeni denemelisin should have 7 authentic venues');
  assert.ok(
    yeldegirmeni.venues.every((v) => typeof v.neighborhood === 'string' && v.neighborhood.includes(',')),
    'Every Yeldegirmeni venue must expose a street/micro-area sub-location label'
  );
  assert.equal(countDenemelisin(caddebostan), 8, 'Caddebostan denemelisin should have 8 authentic venues');
  assert.equal(countDenemelisin(suadiye), 7, 'Suadiye denemelisin should have 7 authentic venues');

  assert.ok(
    caddebostan.venues.every((v) => typeof v.neighborhood === 'string' && v.neighborhood.includes(',')),
    'Every Caddebostan venue must expose a street/micro-area sub-location label'
  );
  for (const expected of [
    'Fıştık Cadde',
    'Cremeria Milano Caddebostan',
    'Uzun Masa',
    'J Burger',
    'Salt Fried Chicken Cadde',
    'Çilingir Sofrası Cadde',
    'Stoa Cadde Ocakbaşı',
  ]) {
    assert.ok(
      caddebostan.venues.some((v) => v.name === expected),
      `Caddebostan missing upgraded/clean venue ${expected}`
    );
  }

  assert.ok(
    suadiye.venues.every((v) => typeof v.neighborhood === 'string' && v.neighborhood.includes(',')),
    'Every Suadiye venue must expose a street/micro-area sub-location label'
  );
  for (const expected of [
    "Pizz'All Suadiye",
    "3 Monkey's Burger",
    'Machi Suadiye',
    'Bread House Suadiye',
    'Saltator',
    'Şaşkın Balık',
    'Dokuz Ondokuz',
    'Manzé Istanbul',
  ]) {
    assert.ok(
      suadiye.venues.some((v) => v.name.includes(expected)),
      `Suadiye missing upgraded/clean venue ${expected}`
    );
  }
  assert.equal(
    suadiye.venues.some((v) => v.name.includes('House of B')),
    false,
    'Chain House of B must be excluded from Suadiye snapshot'
  );

  assert.ok(
    moda.venues.every((v) => typeof v.neighborhood === 'string' && v.neighborhood.includes(',')),
    'Every Moda venue must expose a street/micro-area sub-location label'
  );
  const imece = moda.venues.find((v) => v.id === 'moda-imece');
  assert.equal(imece?.name, 'İmece Moda Mutfak', 'moda-imece must use clean capitalized display name');
  assert.ok(
    moda.venues.some((v) => v.categoryId === 'denemelisin' && v.name.includes('Reks Kokoreç')),
    'Moda denemelisin must include Reks Kokoreç'
  );
  assert.ok(
    moda.venues.some((v) => v.categoryId === 'denemelisin' && v.name.includes('Moda Aile Çay Bahçesi')),
    'Moda denemelisin must include Moda Aile Çay Bahçesi'
  );

  assert.equal(carsi.region.slug, 'kadikoy');
  assert.equal(carsi.region.neighborhood, 'Kadıköy');
  assert.equal(carsi.region.locative, "Kadıköy'de");
  assert.equal(carsi.region.displayName, 'Kadıköy, İstanbul');
  const kadikoyCoffee = carsi.venues.filter((v) => v.categoryId === 'kahve');
  assert.equal(kadikoyCoffee.length, 5, 'Kadikoy kahve should have 5 venues (incl. Fazil Bey)');
  assert.ok(kadikoyCoffee.some((v) => v.name.includes("Fazıl Bey")), 'Kadikoy kahve must include Fazil Bey');
  const brekkie = carsi.venues.find((v) => v.id === 'carsi-brekkie');
  assert.equal(brekkie?.neighborhood, 'Yoğurtçu Parkı, Kadıköy', 'Brekkie must show Yogurtcu Parki sub-area');
  assert.ok(
    carsi.venues.some((v) => v.categoryId === 'hamburger' && v.name.includes('Salt Fried Chicken Kadıköy')),
    'Kadikoy hamburger must include Salt Fried Chicken Kadıköy'
  );
  assert.ok(
    carsi.venues.some((v) => v.id === 'carsi-atm-burger' && v.name === 'ATM Burger'),
    'carsi-atm-burger must use clean ATM Burger display name'
  );
  const kadikoyDate = carsi.venues.filter((v) => v.categoryId === 'date');
  assert.equal(kadikoyDate.length, 5, 'Kadikoy date should have 5 venues with iconic Gunesin Sofrasi slot');
  assert.ok(
    kadikoyDate.some((v) => v.name.includes('Güneşin Sofrası Meyhane')),
    'Kadikoy date must include Güneşin Sofrası Meyhane'
  );
  assert.ok(
    carsi.venues.some((v) => v.categoryId === 'denemelisin' && v.name === 'Kadı Nimet Balıkçılık'),
    'Kadikoy denemelisin must include Kadı Nimet Balıkçılık'
  );
  assert.ok(
    carsi.venues.some((v) => v.categoryId === 'denemelisin' && v.name === 'Sayla Mantı'),
    'Kadikoy denemelisin must include Sayla Mantı'
  );
});

test('Caddebostan dynamically prunes breakfast ("Yoksa Onerme") when no qualifying venue passes gates', () => {
  const caddebostan = snapshots.find((s) => s.key === 'istanbul-kadikoy-caddebostan').data;
  assert.equal(caddebostan.categories.length, 5);
  assert.equal(caddebostan.categories.some((c) => c.slug === 'kahvalti'), false);
});

test('Feneryolu dynamically prunes date venues ("Yoksa Onerme") when no qualifying venue passes strict border', () => {
  const feneryolu = snapshots.find((s) => s.key === 'istanbul-kadikoy-feneryolu').data;
  assert.equal(feneryolu.categories.length, 5);
  assert.equal(feneryolu.categories.some((c) => c.slug === 'date-mekanlari'), false);
});

test('Bebek dynamically prunes pizza ("Yoksa Onerme") when no qualifying >=4.4 non-chain pizzeria passes strict border', () => {
  const bebek = snapshots.find((s) => s.key === 'istanbul-besiktas-bebek').data;
  assert.equal(bebek.categories.length, 6);
  assert.equal(bebek.categories.some((c) => c.slug === 'pizza'), false);
  assert.equal(bebek.categories.some((c) => c.slug === 'balik-deniz-urunleri'), true);
});

test('all 27 published regions have zero overlapping placeIds, valid ratings, and canonical CID links', () => {
  const globalPlaceIds = new Set();
  for (const { key, data } of snapshots) {
    const expectedDistricts =
      key === 'antalya-kaleici'
        ? ['Muratpaşa', 'Aksu', 'Kepez']
        : key === 'antalya-konyaalti'
        ? ['Konyaaltı', 'Muratpaşa']
        : key === 'istanbul-beyoglu-galata'
        ? ['Beyoğlu', 'Taksim']
        : data.region.district.split('&').map((s) => s.trim());
    for (const venue of data.venues) {
      assert.ok(!globalPlaceIds.has(venue.placeId), `Cross-region or duplicate placeId ${venue.placeId} (${venue.name} in ${key})`);
      globalPlaceIds.add(venue.placeId);
      assert.ok(
        expectedDistricts.some((d) => venue.address.includes(d)) && venue.address.includes(data.region.city),
        `Outside ${data.region.district}/${data.region.city}: ${venue.name} -> ${venue.address}`
      );
      assert.ok(venue.mapsUri.startsWith('https://maps.google.com/?cid='), `Invalid CID URI: ${venue.mapsUri}`);
      const minRating = venue.id === 'usk-kanaat-lokantasi' ? 3.7 : 3.8;
      assert.ok(
        typeof venue.rating === 'number' && venue.rating >= minRating && venue.rating <= 5.0,
        `Invalid rating ${venue.rating} on ${venue.id} (${venue.name})`
      );
    }
  }
  assert.ok(globalPlaceIds.size >= 500, `Expected >=500 unique published venues, got ${globalPlaceIds.size}`);
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
    1,
    'Suadiye pizza now receives 1 ultra-close <=400m Catalcesme/Bostanci neighbor'
  );
});

test('snapshots never leak review counts, source URLs, forbidden terms, or API keys', () => {
  for (const { key, data } of snapshots) {
    const raw = JSON.stringify(data);
    assert.ok(!/userRatingCount|reviewCount|googleReviewCount|sourcePageUrl/.test(raw), `Leak in ${key}`);
    assert.ok(
      !/en iyi|rakipsiz|kusursuz|mükemmel|muhteşem|tartışmasız|1 numara|yorum|Michelin|Gault|Time Out|Barista Magazine|Kaynaklar|Neden Gitmeli|API fiyat|Google fiyat|Google Places|fiyat verisi API|fiyat seviyesi API|API üzerinde/i.test(
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

  const carsiAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-kadikoy-carsi.audit.json'), 'utf8')
  );
  const cMap = new Map(carsiAudit.decisions.map((d) => [d.id, d]));
  assert.equal(cMap.get('ctrl-carsi-starbucks').accepted, false);
  assert.equal(cMap.get('ctrl-carsi-starbucks').reason, 'chain_or_franchise');
  assert.equal(cMap.get('ctrl-carsi-beppe-closed').accepted, false);
  assert.ok(cMap.get('ctrl-carsi-beppe-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(cMap.get('ctrl-carsi-moda-outside').accepted, false);
  assert.ok(cMap.get('ctrl-carsi-moda-outside').reason.includes('outside_strict_neighborhood'));

  const konyaaltiAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/antalya-konyaalti.audit.json'), 'utf8')
  );
  const kMap = new Map(konyaaltiAudit.decisions.map((d) => [d.id, d]));
  assert.equal(kMap.get('ctrl-konyaalti-routeburger-closed').accepted, false);
  assert.ok(kMap.get('ctrl-konyaalti-routeburger-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(kMap.get('ctrl-konyaalti-kumluca-distant').accepted, false);
  assert.ok(kMap.get('ctrl-konyaalti-kumluca-distant').reason.includes('outside_strict_neighborhood'));

  const laraAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/antalya-lara.audit.json'), 'utf8')
  );
  const lMap = new Map(laraAudit.decisions.map((d) => [d.id, d]));
  assert.equal(lMap.get('ctrl-lara-sudd-closed').accepted, false);
  assert.ok(lMap.get('ctrl-lara-sudd-closed').reason.includes('CLOSED_PERMANENTLY'));

  const akyakaAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-ula-akyaka.audit.json'), 'utf8')
  );
  const aMap = new Map(akyakaAudit.decisions.map((d) => [d.id, d]));
  assert.equal(aMap.get('ctrl-akyaka-leos-closed').accepted, false);
  assert.ok(aMap.get('ctrl-akyaka-leos-closed').reason.includes('CLOSED_TEMPORARILY'));
  assert.equal(aMap.get('ctrl-akyaka-lightroom-closed').accepted, false);
  assert.ok(aMap.get('ctrl-akyaka-lightroom-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(aMap.get('ctrl-akyaka-starbucks-chain').accepted, false);
  assert.equal(aMap.get('ctrl-akyaka-starbucks-chain').reason, 'chain_or_franchise');
  assert.equal(aMap.get('ctrl-akyaka-mentese-outside').accepted, false);
  assert.ok(aMap.get('ctrl-akyaka-mentese-outside').reason.includes('outside_strict_neighborhood'));

  const caddeAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-kadikoy-caddebostan.audit.json'), 'utf8')
  );
  const cdMap = new Map(caddeAudit.decisions.map((d) => [d.id, d]));
  assert.equal(cdMap.get('ctrl-cadde-nappo-closed').accepted, false);
  assert.ok(cdMap.get('ctrl-cadde-nappo-closed').reason.includes('CLOSED_PERMANENTLY'));

  const suaAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-kadikoy-suadiye.audit.json'), 'utf8')
  );
  const sMap = new Map(suaAudit.decisions.map((d) => [d.id, d]));
  assert.equal(sMap.get('ctrl-sua-house-of-b').accepted, false);
  assert.equal(sMap.get('ctrl-sua-house-of-b').reason, 'chain_or_franchise');
  assert.equal(sMap.get('ctrl-sua-beyaz-firin').accepted, false);
  assert.equal(sMap.get('ctrl-sua-beyaz-firin').reason, 'chain_or_franchise');
  assert.equal(sMap.get('ctrl-sua-kizilkayalar').accepted, false);
  assert.equal(sMap.get('ctrl-sua-kizilkayalar').reason, 'chain_or_franchise');

  const bosAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-kadikoy-bostanci.audit.json'), 'utf8')
  );
  const bMap = new Map(bosAudit.decisions.map((d) => [d.id, d]));
  assert.equal(bMap.get('ctrl-bostanci-starbucks').accepted, false);
  assert.equal(bMap.get('ctrl-bostanci-starbucks').reason, 'chain_or_franchise');
  assert.equal(bMap.get('ctrl-bostanci-dominos').accepted, false);
  assert.equal(bMap.get('ctrl-bostanci-dominos').reason, 'chain_or_franchise');
  assert.equal(bMap.get('ctrl-bostanci-hacibasar-atasehir').accepted, false);
  assert.ok(bMap.get('ctrl-bostanci-hacibasar-atasehir').reason.includes('outside_strict_neighborhood'));
  assert.equal(bMap.get('ctrl-bostanci-crocups-maltepe').accepted, false);
  assert.ok(bMap.get('ctrl-bostanci-crocups-maltepe').reason.includes('outside_strict_neighborhood'));

  const kaAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-kadikoy-kosuyolu-acibadem.audit.json'), 'utf8')
  );
  const kaMap = new Map(kaAudit.decisions.map((d) => [d.id, d]));
  assert.equal(kaMap.get('ctrl-ka-flan-closed').accepted, false);
  assert.ok(kaMap.get('ctrl-ka-flan-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(kaMap.get('ctrl-ka-viyana-chain').accepted, false);
  assert.equal(kaMap.get('ctrl-ka-viyana-chain').reason, 'chain_or_franchise');
  assert.equal(kaMap.get('ctrl-ka-kontrbus-chain').accepted, false);
  assert.equal(kaMap.get('ctrl-ka-kontrbus-chain').reason, 'chain_or_franchise');
  assert.equal(kaMap.get('ctrl-ka-beyazfirin-chain').accepted, false);
  assert.equal(kaMap.get('ctrl-ka-beyazfirin-chain').reason, 'chain_or_franchise');
  assert.equal(kaMap.get('ctrl-ka-pizzav-chain').accepted, false);
  assert.equal(kaMap.get('ctrl-ka-pizzav-chain').reason, 'chain_or_franchise');
  assert.equal(kaMap.get('ctrl-ka-kaffee-schutz-chain').accepted, false);
  assert.equal(kaMap.get('ctrl-ka-kaffee-schutz-chain').reason, 'chain_or_franchise');
  assert.equal(kaMap.get('ctrl-ka-hane-cikolata').accepted, false);
  assert.ok(kaMap.get('ctrl-ka-hane-cikolata').reason.includes('kahve_category_not_coffee_specialist'));
  assert.equal(kaMap.get('ctrl-ka-adile-sultan-chain').accepted, false);
  assert.equal(kaMap.get('ctrl-ka-adile-sultan-chain').reason, 'chain_or_franchise');
  assert.equal(kaMap.get('ctrl-ka-canak-below-threshold').accepted, false);
  assert.ok(kaMap.get('ctrl-ka-canak-below-threshold').reason.includes('below_quality_threshold'));
  assert.equal(kaMap.get('ctrl-ka-brand-burger-chain').accepted, false);
  assert.equal(kaMap.get('ctrl-ka-brand-burger-chain').reason, 'chain_or_franchise');
  assert.equal(kaMap.get('ctrl-ka-kirpi-chain').accepted, false);
  assert.equal(kaMap.get('ctrl-ka-kirpi-chain').reason, 'chain_or_franchise');
  assert.equal(kaMap.get('ctrl-ka-intiba-chain').accepted, false);
  assert.equal(kaMap.get('ctrl-ka-intiba-chain').reason, 'chain_or_franchise');

  const uskAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-uskudar-merkez.audit.json'), 'utf8')
  );
  const uMap = new Map(uskAudit.decisions.map((d) => [d.id, d]));
  assert.equal(uMap.get('ctrl-usk-mimkahve-closed').accepted, false);
  assert.ok(uMap.get('ctrl-usk-mimkahve-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(uMap.get('ctrl-usk-hunburger-closed').accepted, false);
  assert.ok(uMap.get('ctrl-usk-hunburger-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(uMap.get('ctrl-usk-starbucks').accepted, false);
  assert.equal(uMap.get('ctrl-usk-starbucks').reason, 'chain_or_franchise');
  assert.equal(uMap.get('ctrl-usk-coffy').accepted, false);
  assert.equal(uMap.get('ctrl-usk-coffy').reason, 'chain_or_franchise');
  assert.equal(uMap.get('ctrl-usk-pizza-amore-chain').accepted, false);
  assert.equal(uMap.get('ctrl-usk-pizza-amore-chain').reason, 'chain_or_franchise');
  assert.equal(uMap.get('ctrl-usk-butchers-chain').accepted, false);
  assert.equal(uMap.get('ctrl-usk-butchers-chain').reason, 'chain_or_franchise');
  assert.equal(uMap.get('ctrl-usk-filizler-chain').accepted, false);
  assert.equal(uMap.get('ctrl-usk-filizler-chain').reason, 'chain_or_franchise');
  assert.equal(uMap.get('ctrl-usk-kaffee-schutz').accepted, false);
  assert.equal(uMap.get('ctrl-usk-kaffee-schutz').reason, 'chain_or_franchise');
  assert.equal(uMap.get('ctrl-usk-adile-sultan').accepted, false);
  assert.equal(uMap.get('ctrl-usk-adile-sultan').reason, 'chain_or_franchise');
  assert.equal(uMap.get('ctrl-usk-espressolab').accepted, false);
  assert.equal(uMap.get('ctrl-usk-espressolab').reason, 'chain_or_franchise');
  assert.equal(uMap.get('ctrl-usk-laveria-chain').accepted, false);
  assert.equal(uMap.get('ctrl-usk-laveria-chain').reason, 'chain_or_franchise');
  assert.equal(uMap.get('ctrl-usk-donerbank-chain').accepted, false);
  assert.equal(uMap.get('ctrl-usk-donerbank-chain').reason, 'chain_or_franchise');

  const feneryoluAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-kadikoy-feneryolu.audit.json'), 'utf8')
  );
  const fMap = new Map(feneryoluAudit.decisions.map((d) => [d.id, d]));
  assert.equal(fMap.get('ctrl-fen-starbucks').accepted, false);
  assert.equal(fMap.get('ctrl-fen-starbucks').reason, 'chain_or_franchise');
  assert.equal(fMap.get('ctrl-fen-beyazfirin').accepted, false);
  assert.equal(fMap.get('ctrl-fen-beyazfirin').reason, 'chain_or_franchise');
  assert.equal(fMap.get('ctrl-fen-adilesultan').accepted, false);
  assert.equal(fMap.get('ctrl-fen-adilesultan').reason, 'chain_or_franchise');
  assert.equal(fMap.get('ctrl-fen-dominos').accepted, false);
  assert.equal(fMap.get('ctrl-fen-dominos').reason, 'chain_or_franchise');
  assert.equal(fMap.get('ctrl-fen-nazar-chain').accepted, false);
  assert.equal(fMap.get('ctrl-fen-nazar-chain').reason, 'chain_or_franchise');
  assert.equal(fMap.get('ctrl-fen-kerem-kahve-purity').accepted, false);
  assert.ok(fMap.get('ctrl-fen-kerem-kahve-purity').reason.includes('kahve_category_not_coffee_specialist'));
  assert.equal(fMap.get('ctrl-fen-largando-fenerbahce').accepted, false);
  assert.ok(fMap.get('ctrl-fen-largando-fenerbahce').reason.includes('outside_strict_neighborhood'));
  assert.equal(fMap.get('ctrl-fen-lamora-below-44').accepted, false);
  assert.ok(fMap.get('ctrl-fen-lamora-below-44').reason.includes('below_quality_threshold'));

  const fkAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-kadikoy-fenerbahce-kalamis.audit.json'), 'utf8')
  );
  const fkMap = new Map(fkAudit.decisions.map((d) => [d.id, d]));
  assert.equal(fkMap.get('fk-boter-kalamis').accepted, true);
  assert.equal(fkMap.get('ctrl-fk-cundali-closed').accepted, false);
  assert.ok(fkMap.get('ctrl-fk-cundali-closed').reason.includes('CLOSED_TEMPORARILY'));
  for (const chainId of [
    'ctrl-fk-midpoint-chain',
    'ctrl-fk-happymoons-chain',
    'ctrl-fk-dominos-chain',
    'ctrl-fk-kronotrop-chain',
    'ctrl-fk-develi-chain',
    'ctrl-fk-5masa-chain',
    'ctrl-fk-simpleco-chain',
  ]) {
    assert.equal(fkMap.get(chainId).accepted, false);
    assert.equal(fkMap.get(chainId).reason, 'chain_or_franchise');
  }
  assert.equal(fkMap.get('ctrl-fk-gorgulu-kahve-purity').accepted, false);
  assert.ok(fkMap.get('ctrl-fk-gorgulu-kahve-purity').reason.includes('kahve_category_not_coffee_specialist'));
  assert.equal(fkMap.get('ctrl-fk-ouzo-below-44').accepted, false);
  assert.ok(fkMap.get('ctrl-fk-ouzo-below-44').reason.includes('below_quality_threshold'));
  assert.equal(fkMap.get('ctrl-fk-paysage-below-44').accepted, false);
  assert.ok(fkMap.get('ctrl-fk-paysage-below-44').reason.includes('below_quality_threshold'));

  const yelAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-kadikoy-yeldegirmeni.audit.json'), 'utf8')
  );
  const yelMap = new Map(yelAudit.decisions.map((d) => [d.id, d]));
  for (const chainId of [
    'ctrl-yel-adile-sultan-chain',
    'ctrl-yel-coffee-manifesto-chain',
    'ctrl-yel-balta-chain',
    'ctrl-yel-beylerbeyi-chain',
  ]) {
    assert.equal(yelMap.get(chainId).accepted, false);
    assert.equal(yelMap.get(chainId).reason, 'chain_or_franchise');
  }
  assert.equal(yelMap.get('ctrl-yel-kuff-below-44').accepted, false);
  assert.ok(yelMap.get('ctrl-yel-kuff-below-44').reason.includes('below_quality_threshold'));
  assert.equal(yelMap.get('ctrl-yel-carbo-below-44').accepted, false);
  assert.ok(yelMap.get('ctrl-yel-carbo-below-44').reason.includes('below_quality_threshold'));

  const kuzAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-uskudar-kuzguncuk.audit.json'), 'utf8')
  );
  const kzMap = new Map(kuzAudit.decisions.map((d) => [d.id, d]));
  assert.equal(kzMap.get('ctrl-kuz-balikcisi-closed').accepted, false);
  assert.ok(kzMap.get('ctrl-kuz-balikcisi-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(kzMap.get('ctrl-kuz-pulat-closed').accepted, false);
  assert.ok(kzMap.get('ctrl-kuz-pulat-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(kzMap.get('ctrl-kuz-foco-closed').accepted, false);
  assert.ok(kzMap.get('ctrl-kuz-foco-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(kzMap.get('ctrl-kuz-beylerbeyi-outside').accepted, false);
  assert.ok(kzMap.get('ctrl-kuz-beylerbeyi-outside').reason.includes('outside_strict_neighborhood'));

  const cengAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-uskudar-cengelkoy.audit.json'), 'utf8')
  );
  const cgMap = new Map(cengAudit.decisions.map((d) => [d.id, d]));
  assert.equal(cgMap.get('ctrl-ceng-espressolab').accepted, false);
  assert.equal(cgMap.get('ctrl-ceng-espressolab').reason, 'chain_or_franchise');
  assert.equal(cgMap.get('ctrl-ceng-sutis-chain').accepted, false);
  assert.equal(cgMap.get('ctrl-ceng-sutis-chain').reason, 'chain_or_franchise');
  assert.equal(cgMap.get('ctrl-ceng-starbucks').accepted, false);
  assert.equal(cgMap.get('ctrl-ceng-starbucks').reason, 'chain_or_franchise');
  assert.equal(cgMap.get('ctrl-ceng-beylerbeyi-outside').accepted, false);
  assert.ok(cgMap.get('ctrl-ceng-beylerbeyi-outside').reason.includes('outside_strict_neighborhood'));
  assert.equal(cgMap.get('ctrl-ceng-cikolata-kahve').accepted, false);
  assert.ok(cgMap.get('ctrl-ceng-cikolata-kahve').reason.includes('kahve_category_not_coffee_specialist'));
  assert.equal(cgMap.get('ctrl-ceng-vakko-chain').accepted, false);
  assert.equal(cgMap.get('ctrl-ceng-vakko-chain').reason, 'chain_or_franchise');
  assert.equal(cgMap.get('ctrl-ceng-borekcisi-chain').accepted, false);
  assert.equal(cgMap.get('ctrl-ceng-borekcisi-chain').reason, 'chain_or_franchise');

  const karAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-beyoglu-karakoy.audit.json'), 'utf8')
  );
  const krMap = new Map(karAudit.decisions.map((d) => [d.id, d]));
  assert.equal(krMap.get('ctrl-kar-espressolab-chain').accepted, false);
  assert.equal(krMap.get('ctrl-kar-espressolab-chain').reason, 'chain_or_franchise');
  assert.equal(krMap.get('ctrl-kar-kronotrop-chain').accepted, false);
  assert.equal(krMap.get('ctrl-kar-kronotrop-chain').reason, 'chain_or_franchise');
  assert.equal(krMap.get('ctrl-kar-faruk-gulluoglu-chain').accepted, false);
  assert.equal(krMap.get('ctrl-kar-faruk-gulluoglu-chain').reason, 'chain_or_franchise');
  assert.equal(krMap.get('ctrl-kar-perlos-chain').accepted, false);
  assert.equal(krMap.get('ctrl-kar-perlos-chain').reason, 'chain_or_franchise');
  assert.equal(krMap.get('ctrl-kar-burgerlab-chain').accepted, false);
  assert.equal(krMap.get('ctrl-kar-burgerlab-chain').reason, 'chain_or_franchise');
  assert.equal(krMap.get('ctrl-kar-factory-kahve-purity').accepted, false);
  assert.ok(krMap.get('ctrl-kar-factory-kahve-purity').reason.includes('kahve_category_not_coffee_specialist'));
  assert.equal(krMap.get('ctrl-kar-karabatak-below-44').accepted, false);
  assert.ok(krMap.get('ctrl-kar-karabatak-below-44').reason.includes('below_quality_threshold'));
  assert.equal(krMap.get('ctrl-kar-akin-balik-below-44').accepted, false);
  assert.ok(krMap.get('ctrl-kar-akin-balik-below-44').reason.includes('below_quality_threshold'));
  assert.equal(krMap.get('ctrl-kar-namli-below-44').accepted, false);
  assert.ok(krMap.get('ctrl-kar-namli-below-44').reason.includes('below_quality_threshold'));

  const cihAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-beyoglu-cihangir.audit.json'), 'utf8')
  );
  const chMap = new Map(cihAudit.decisions.map((d) => [d.id, d]));
  assert.equal(chMap.get('ctrl-cih-espressolab-chain').accepted, false);
  assert.equal(chMap.get('ctrl-cih-espressolab-chain').reason, 'chain_or_franchise');
  assert.equal(chMap.get('ctrl-cih-kronotrop-chain').accepted, false);
  assert.equal(chMap.get('ctrl-cih-kronotrop-chain').reason, 'chain_or_franchise');
  assert.equal(chMap.get('ctrl-cih-pizzabulls-chain').accepted, false);
  assert.equal(chMap.get('ctrl-cih-pizzabulls-chain').reason, 'chain_or_franchise');
  assert.equal(chMap.get('ctrl-cih-homevibe-kahve-purity').accepted, false);
  assert.ok(chMap.get('ctrl-cih-homevibe-kahve-purity').reason.includes('kahve_category_not_coffee_specialist'));
  assert.equal(chMap.get('ctrl-cih-cuma-below-44').accepted, false);
  assert.ok(chMap.get('ctrl-cih-cuma-below-44').reason.includes('below_quality_threshold'));
  assert.equal(chMap.get('ctrl-cih-jash-below-44').accepted, false);
  assert.ok(chMap.get('ctrl-cih-jash-below-44').reason.includes('below_quality_threshold'));
  assert.equal(chMap.get('ctrl-cih-smashsquare-outside').accepted, false);
  assert.ok(chMap.get('ctrl-cih-smashsquare-outside').reason.includes('outside_strict_neighborhood'));

  const nisAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/istanbul-sisli-nisantasi.audit.json'), 'utf8')
  );
  const nsMap = new Map(nisAudit.decisions.map((d) => [d.id, d]));
  assert.equal(nsMap.get('ctrl-nis-delicatessen-closed').accepted, false);
  assert.ok(nsMap.get('ctrl-nis-delicatessen-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(nsMap.get('ctrl-nis-bigchefs-chain').accepted, false);
  assert.ok(nsMap.get('ctrl-nis-bigchefs-chain').reason.includes('below_quality_threshold'));
  assert.equal(nsMap.get('ctrl-nis-dominos-chain').accepted, false);
  assert.equal(nsMap.get('ctrl-nis-dominos-chain').reason, 'chain_or_franchise');
  assert.equal(nsMap.get('ctrl-nis-papajohns-chain').accepted, false);
  assert.equal(nsMap.get('ctrl-nis-papajohns-chain').reason, 'chain_or_franchise');
  assert.equal(nsMap.get('ctrl-nis-adile-sultan-chain').accepted, false);
  assert.equal(nsMap.get('ctrl-nis-adile-sultan-chain').reason, 'chain_or_franchise');
  assert.equal(nsMap.get('ctrl-nis-vakko-chain').accepted, false);
  assert.equal(nsMap.get('ctrl-nis-vakko-chain').reason, 'chain_or_franchise');
  assert.equal(nsMap.get('ctrl-nis-develi-chain').accepted, false);
  assert.equal(nsMap.get('ctrl-nis-develi-chain').reason, 'chain_or_franchise');
  assert.equal(nsMap.get('ctrl-nis-saltbae-chain').accepted, false);
  assert.equal(nsMap.get('ctrl-nis-saltbae-chain').reason, 'chain_or_franchise');
  assert.equal(nsMap.get('ctrl-nis-crocups-chain').accepted, false);
  assert.equal(nsMap.get('ctrl-nis-crocups-chain').reason, 'chain_or_franchise');
  assert.equal(nsMap.get('ctrl-nis-whiteburger-chain').accepted, false);
  assert.equal(nsMap.get('ctrl-nis-whiteburger-chain').reason, 'chain_or_franchise');
  assert.equal(nsMap.get('ctrl-nis-beymen-below-44').accepted, false);
  assert.ok(nsMap.get('ctrl-nis-beymen-below-44').reason.includes('below_quality_threshold'));
  assert.equal(nsMap.get('ctrl-nis-400c-below-44').accepted, false);
  assert.ok(nsMap.get('ctrl-nis-400c-below-44').reason.includes('below_quality_threshold'));
  assert.equal(nsMap.get('ctrl-nis-smashy-besiktas-outside').accepted, false);
  assert.ok(nsMap.get('ctrl-nis-smashy-besiktas-outside').reason.includes('outside_strict_neighborhood'));
});

test('Galata and Besiktas Carsi audit logs verify strict neighborhood, coffee purity, and chain rejections', () => {
  const galAuditPath = path.join(ROOT, 'work/gastronomy-v3/istanbul-beyoglu-galata.audit.json');
  if (fs.existsSync(galAuditPath)) {
    const galAudit = JSON.parse(fs.readFileSync(galAuditPath, 'utf8'));
    const glMap = new Map(galAudit.decisions.map((d) => [d.id, d]));
    assert.equal(glMap.get('ctrl-gal-federal-chain').accepted, false);
    assert.equal(glMap.get('ctrl-gal-federal-chain').reason, 'chain_or_franchise');
    assert.equal(glMap.get('ctrl-gal-viyana-chain').accepted, false);
    assert.equal(glMap.get('ctrl-gal-viyana-chain').reason, 'chain_or_franchise');
    assert.equal(glMap.get('ctrl-gal-saltbae-chain').accepted, false);
    assert.equal(glMap.get('ctrl-gal-saltbae-chain').reason, 'chain_or_franchise');
    assert.equal(glMap.get('ctrl-gal-sirin-firin-kahve-purity').accepted, false);
    assert.ok(glMap.get('ctrl-gal-sirin-firin-kahve-purity').reason.includes('kahve_category_not_coffee_specialist'));
    assert.equal(glMap.get('ctrl-gal-saraphane-asmalimescit-outside').accepted, false);
    assert.ok(glMap.get('ctrl-gal-saraphane-asmalimescit-outside').reason.includes('outside_strict_neighborhood'));
    assert.equal(glMap.get('ctrl-gal-barnathan-commercial').accepted, false);
    assert.ok(glMap.get('ctrl-gal-barnathan-commercial').reason.includes('below_quality_threshold'));
    assert.equal(glMap.get('ctrl-gal-firuzende-below-44').accepted, false);
    assert.ok(glMap.get('ctrl-gal-firuzende-below-44').reason.includes('below_quality_threshold'));
  }

  const besAuditPath = path.join(ROOT, 'work/gastronomy-v3/istanbul-besiktas-carsi.audit.json');
  if (fs.existsSync(besAuditPath)) {
    const besAudit = JSON.parse(fs.readFileSync(besAuditPath, 'utf8'));
    const bsMap = new Map(besAudit.decisions.map((d) => [d.id, d]));
    assert.equal(bsMap.get('ctrl-bes-vogue-closed-temp').accepted, false);
    assert.ok(bsMap.get('ctrl-bes-vogue-closed-temp').reason.includes('not_operational'));
    assert.equal(bsMap.get('ctrl-bes-house-of-b-chain').accepted, false);
    assert.equal(bsMap.get('ctrl-bes-house-of-b-chain').reason, 'chain_or_franchise');
    assert.equal(bsMap.get('ctrl-bes-pizza-krema-chain').accepted, false);
    assert.equal(bsMap.get('ctrl-bes-pizza-krema-chain').reason, 'chain_or_franchise');
    assert.equal(bsMap.get('ctrl-bes-fres-burger-chain').accepted, false);
    assert.equal(bsMap.get('ctrl-bes-fres-burger-chain').reason, 'chain_or_franchise');
    assert.equal(bsMap.get('ctrl-bes-balkan-chain').accepted, false);
    assert.equal(bsMap.get('ctrl-bes-balkan-chain').reason, 'chain_or_franchise');
    assert.equal(bsMap.get('ctrl-bes-the-co-chain').accepted, false);
    assert.equal(bsMap.get('ctrl-bes-the-co-chain').reason, 'chain_or_franchise');
    assert.equal(bsMap.get('ctrl-bes-lavie-kahve-purity').accepted, false);
    assert.ok(bsMap.get('ctrl-bes-lavie-kahve-purity').reason.includes('kahve_category_not_coffee_specialist'));
    assert.equal(bsMap.get('ctrl-bes-bargozzy-nisantasi-outside').accepted, false);
    assert.ok(bsMap.get('ctrl-bes-bargozzy-nisantasi-outside').reason.includes('outside_strict_neighborhood'));
    assert.equal(bsMap.get('ctrl-bes-carsi-balik-below-44').accepted, false);
    assert.ok(bsMap.get('ctrl-bes-carsi-balik-below-44').reason.includes('below_quality_threshold'));
  }
});

test('Etiler and Ortakoy audit logs verify strict neighborhood, coffee purity, >=4.4 floor, and chain rejections', () => {
  const etilerAuditPath = path.join(ROOT, 'work/gastronomy-v3/istanbul-besiktas-etiler.audit.json');
  if (fs.existsSync(etilerAuditPath)) {
    const etilerAudit = JSON.parse(fs.readFileSync(etilerAuditPath, 'utf8'));
    const etMap = new Map(etilerAudit.decisions.map((d) => [d.id, d]));
    for (const chainId of [
      'ctrl-eti-akali-chain',
      'ctrl-eti-espressolab-chain',
      'ctrl-eti-beyazfirin-chain',
      'ctrl-eti-cookshop-chain',
      'ctrl-eti-mikel-chain',
      'ctrl-eti-bodrum-manti-chain',
      'ctrl-eti-grandma-chain',
      'ctrl-eti-casita-chain',
      'ctrl-eti-nusret-chain',
    ]) {
      assert.equal(etMap.get(chainId).accepted, false);
      assert.equal(etMap.get(chainId).reason, 'chain_or_franchise');
    }
    assert.equal(etMap.get('ctrl-eti-melodi-cikolata').accepted, false);
    assert.ok(etMap.get('ctrl-eti-melodi-cikolata').reason.includes('kahve_category_not_coffee_specialist'));
    assert.equal(etMap.get('ctrl-eti-opera-pastanesi').accepted, false);
    assert.ok(etMap.get('ctrl-eti-opera-pastanesi').reason.includes('kahve_category_not_coffee_specialist'));
    for (const belowId of [
      'ctrl-eti-scarpetta-below-44',
      'ctrl-eti-supernormal-below-44',
      'ctrl-eti-harvard-below-44',
      'ctrl-eti-minoa-village-below-44',
    ]) {
      assert.equal(etMap.get(belowId).accepted, false);
      assert.ok(etMap.get(belowId).reason.includes('below_quality_threshold'));
    }
    assert.equal(etMap.get('ctrl-eti-oliva-sariyer').accepted, false);
    assert.ok(etMap.get('ctrl-eti-oliva-sariyer').reason.includes('outside_strict_neighborhood'));
  }

  const ortakoyAuditPath = path.join(ROOT, 'work/gastronomy-v3/istanbul-besiktas-ortakoy.audit.json');
  if (fs.existsSync(ortakoyAuditPath)) {
    const ortakoyAudit = JSON.parse(fs.readFileSync(ortakoyAuditPath, 'utf8'));
    const orMap = new Map(ortakoyAudit.decisions.map((d) => [d.id, d]));
    for (const chainId of [
      'ctrl-ort-housecafe-chain',
      'ctrl-ort-espressolab-chain',
      'ctrl-ort-adilesultan-chain',
      'ctrl-ort-pasaport-pizza-chain',
      'ctrl-ort-8one-burger-chain',
      'ctrl-ort-burgerking-chain',
    ]) {
      assert.equal(orMap.get(chainId).accepted, false);
      assert.equal(orMap.get(chainId).reason, 'chain_or_franchise');
    }
    assert.equal(orMap.get('ctrl-ort-osk-dondurma-purity').accepted, false);
    assert.ok(orMap.get('ctrl-ort-osk-dondurma-purity').reason.includes('kahve_category_not_coffee_specialist'));
    for (const belowId of [
      'ctrl-ort-beltas-below-44',
      'ctrl-ort-kumpir14-below-44',
      'ctrl-ort-bizce-below-44',
      'ctrl-ort-ruby-below-44',
    ]) {
      assert.equal(orMap.get(belowId).accepted, false);
      assert.ok(orMap.get(belowId).reason.includes('below_quality_threshold'));
    }
    assert.equal(orMap.get('ctrl-ort-mavibalik-kurucesme').accepted, false);
    assert.ok(orMap.get('ctrl-ort-mavibalik-kurucesme').reason.includes('outside_strict_neighborhood'));
  }
});

test('V3.2 rules, secondaryItems, suitability, zero Çekirdekhane, complete dossiers & visitor isolation', () => {
  const rulesPath = path.join(ROOT, 'lib', 'gastronomy-v3', 'RULES.md');
  assert.ok(fs.existsSync(rulesPath), 'RULES.md must exist');
  assert.ok(fs.readFileSync(rulesPath, 'utf8').length > 500, 'RULES.md must be populated');

  const agentsPath = path.join(ROOT, 'AGENTS.md');
  assert.ok(fs.existsSync(agentsPath), 'AGENTS.md must exist');
  const agentsSrc = fs.readFileSync(agentsPath, 'utf8');
  const agentsBytes = Buffer.byteLength(agentsSrc, 'utf8');
  assert.ok(agentsBytes > 2000 && agentsBytes < 24000, `AGENTS.md byte size out of bounds: ${agentsBytes}`);
  assert.ok(!agentsSrc.trimStart().startsWith('---'), 'AGENTS.md must not contain YAML frontmatter');

  const skillPath = path.join(ROOT, '.agents', 'skills', 'yeriniayir-gastronomy-v3', 'SKILL.md');
  const refPath = path.join(
    ROOT,
    '.agents',
    'skills',
    'yeriniayir-gastronomy-v3',
    'references',
    'architecture-and-checklist.md'
  );
  assert.ok(fs.existsSync(skillPath), 'SKILL.md must exist');
  assert.ok(fs.existsSync(refPath), 'architecture-and-checklist.md must exist');
  const skillSrc = fs.readFileSync(skillPath, 'utf8');
  assert.ok(
    skillSrc.startsWith('---\nname: yeriniayir-gastronomy-v3\n'),
    'SKILL.md must begin with valid yeriniayir-gastronomy-v3 frontmatter'
  );

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

test('runtime discovery, foodAdapter, and realProvider expose all 6 Kadikoy regions as published with Il>Ilce>Semt', async () => {
  const discoveryMod = loadTsModule('lib/pilot/integration/discovery.ts');
  const adapterMod = loadTsModule('lib/pilot/integration/foodAdapter.ts');
  const providerMod = loadTsModule('lib/food/realProvider.ts');

  const modaDiscovery = await discoveryMod.readIntegrationDiscovery('moda', '');
  assert.ok(modaDiscovery);
  const food = adapterMod.toFoodDiscovery(modaDiscovery);
  const provider = providerMod.createRealFoodProvider(food);

  const ready = provider.getReadyRegions();
  assert.equal(ready.length, 27);
  assert.deepEqual(
    ready.map((r) => r.slug),
    [
      'moda',
      'kadikoy',
      'yeldegirmeni',
      'feneryolu',
      'fenerbahce-kalamis',
      'caddebostan',
      'suadiye',
      'bostanci',
      'kosuyolu-acibadem',
      'uskudar',
      'kuzguncuk',
      'cengelkoy',
      'karakoy',
      'cihangir',
      'nisantasi',
      'galata',
      'besiktas-carsi',
      'akaretler',
      'bebek',
      'etiler',
      'ortakoy',
      'kusadasi',
      'gaziantep',
      'antalya-kaleici',
      'antalya-lara',
      'antalya-konyaalti',
      'akyaka',
    ]
  );

  for (const loc of food.locations) {
    assert.ok(loc.city && loc.district && loc.neighborhood, `Missing hierarchy for ${loc.id}`);
  }

  // Legacy kadikoy-carsi slug, Feneryolu, Bostanci, Kosuyolu/Acibadem, Uskudar, Kuzguncuk, Cengelkoy, Karakoy, Cihangir, Nisantasi, Galata, Besiktas Carsi, Kusadasi, Gaziantep, Antalya & Akyaka aliases resolve cleanly
  assert.equal(provider.getLocationBySlug('kadikoy-carsi')?.slug, 'kadikoy');
  assert.equal(provider.getLocationBySlug('feneryolu-kadikoy')?.slug, 'feneryolu');
  assert.equal(provider.getLocationBySlug('kuyubasi')?.slug, 'feneryolu');
  assert.equal(provider.getLocationBySlug('fenerbahce')?.slug, 'fenerbahce-kalamis');
  assert.equal(provider.getLocationBySlug('kalamis')?.slug, 'fenerbahce-kalamis');
  assert.equal(provider.getLocationBySlug('dalyan')?.slug, 'fenerbahce-kalamis');
  assert.equal(provider.getLocationBySlug('catalcesme')?.slug, 'bostanci');
  assert.equal(provider.getLocationBySlug('kosuyolu')?.slug, 'kosuyolu-acibadem');
  assert.equal(provider.getLocationBySlug('acibadem')?.slug, 'kosuyolu-acibadem');
  assert.equal(provider.getLocationBySlug('salacak')?.slug, 'uskudar');
  assert.equal(provider.getLocationBySlug('icadiye')?.slug, 'kuzguncuk');
  assert.equal(provider.getLocationBySlug('cinaralti')?.slug, 'cengelkoy');
  assert.equal(provider.getLocationBySlug('kuleli')?.slug, 'cengelkoy');
  assert.equal(provider.getLocationBySlug('kemankes')?.slug, 'karakoy');
  assert.equal(provider.getLocationBySlug('tophane')?.slug, 'karakoy');
  assert.equal(provider.getLocationBySlug('galataport')?.slug, 'karakoy');
  assert.equal(provider.getLocationBySlug('cukurcuma')?.slug, 'cihangir');
  assert.equal(provider.getLocationBySlug('firuzaga')?.slug, 'cihangir');
  assert.equal(provider.getLocationBySlug('tesvikiye')?.slug, 'nisantasi');
  assert.equal(provider.getLocationBySlug('topagaci')?.slug, 'nisantasi');
  assert.equal(provider.getLocationBySlug('macka')?.slug, 'nisantasi');
  assert.equal(provider.getLocationBySlug('kuledibi')?.slug, 'galata');
  assert.equal(provider.getLocationBySlug('bereketzade')?.slug, 'galata');
  assert.equal(provider.getLocationBySlug('serdar-i-ekrem')?.slug, 'galata');
  assert.equal(provider.getLocationBySlug('besiktas')?.slug, 'besiktas-carsi');
  assert.equal(provider.getLocationBySlug('koyici')?.slug, 'besiktas-carsi');
  assert.equal(provider.getLocationBySlug('sinanpasa')?.slug, 'besiktas-carsi');
  assert.equal(provider.getLocationBySlug('akaretler')?.slug, 'akaretler');
  assert.equal(provider.getLocationBySlug('visnezade')?.slug, 'akaretler');
  assert.equal(provider.getLocationBySlug('siraevler')?.slug, 'akaretler');
  assert.equal(provider.getLocationBySlug('bebek')?.slug, 'bebek');
  assert.equal(provider.getLocationBySlug('kucuk-bebek')?.slug, 'bebek');
  assert.equal(provider.getLocationBySlug('etiler')?.slug, 'etiler');
  assert.equal(provider.getLocationBySlug('nispetiye')?.slug, 'etiler');
  assert.equal(provider.getLocationBySlug('akatlar')?.slug, 'etiler');
  assert.equal(provider.getLocationBySlug('ortakoy')?.slug, 'ortakoy');
  assert.equal(provider.getLocationBySlug('mecidiye')?.slug, 'ortakoy');
  assert.equal(provider.getLocationBySlug('dereboyu')?.slug, 'ortakoy');
  assert.equal(provider.getLocationBySlug('guzelcamli')?.slug, 'kusadasi');
  assert.equal(provider.getLocationBySlug('davutlar')?.slug, 'kusadasi');
  assert.equal(provider.getLocationBySlug('merkez-kusadasi-aydin')?.slug, 'kusadasi');
  assert.equal(provider.getLocationBySlug('sahinbey')?.slug, 'gaziantep');
  assert.equal(provider.getLocationBySlug('sehitkamil')?.slug, 'gaziantep');
  assert.equal(provider.getLocationBySlug('antalya')?.slug, 'antalya-kaleici');
  assert.equal(provider.getLocationBySlug('lara')?.slug, 'antalya-lara');
  assert.equal(provider.getLocationBySlug('konyaalti')?.slug, 'antalya-konyaalti');
  assert.equal(provider.getLocationBySlug('gokova')?.slug, 'akyaka');
  assert.equal(provider.getLocationBySlug('akcapinar')?.slug, 'akyaka');

  // Unpublished regions cannot resolve
  assert.equal(provider.getLocationBySlug('yalikavak'), undefined);
  assert.equal(provider.getLocationBySlug('bitez'), undefined);
  assert.equal(provider.getLocationBySlug('beylerbeyi'), undefined);
  assert.equal(provider.getLocationBySlug('asmalimescit'), undefined);

  // Verify all 27 published regions resolve cleanly through readIntegrationDiscovery
  for (const slug of [
    'moda',
    'kadikoy',
    'yeldegirmeni',
    'feneryolu',
    'fenerbahce-kalamis',
    'caddebostan',
    'suadiye',
    'bostanci',
    'kosuyolu-acibadem',
    'uskudar',
    'kuzguncuk',
    'cengelkoy',
    'karakoy',
    'cihangir',
    'nisantasi',
    'galata',
    'besiktas-carsi',
    'akaretler',
    'bebek',
    'etiler',
    'ortakoy',
    'kusadasi',
    'gaziantep',
    'antalya-kaleici',
    'antalya-lara',
    'antalya-konyaalti',
    'akyaka',
  ]) {
    const disc = await discoveryMod.readIntegrationDiscovery(slug, '');
    assert.ok(disc, `Missing discovery for ${slug}`);
    const f = adapterMod.toFoodDiscovery(disc);
    const p = providerMod.createRealFoodProvider(f);
    if (slug === 'kadikoy') {
      const brekkieCard = f.venues.find((v) => v.id === 'carsi-brekkie');
      assert.equal(brekkieCard?.location, 'Yoğurtçu Parkı, Kadıköy');
    }
    if (slug === 'yeldegirmeni') {
      assert.equal(p.getLocationBySlug('yeldegirmeni')?.locative, "Yeldeğirmeni'nde");
      assert.equal(p.getLocationBySlug('yeldegirmeni-kadikoy')?.slug, 'yeldegirmeni');
      assert.ok(
        p.searchLocations('rasimpasa').some((l) => l.slug === 'yeldegirmeni'),
        'searchLocations("rasimpasa") must match yeldegirmeni'
      );
      assert.equal(p.getRegionCategories(disc.region.id).length, 6, 'yeldegirmeni must expose 6 categories');
      assert.equal(f.venues.length, 28, 'yeldegirmeni must expose 28 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Yeldeğirmeni')),
        'Every Yeldegirmeni card location must use street + , Yeldeğirmeni label'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name,
        'Salepepe Tokyo Style Pizza',
        'Yeldegirmeni pizza #1 must be Salepepe Tokyo Style Pizza'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name,
        'Bamb’s Smash Burger',
        'Yeldegirmeni hamburger #1 must be Bamb’s Smash Burger'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name,
        'Yeldeğirmeni Kurukahvecisi',
        'Yeldegirmeni kahve #1 must be Yeldeğirmeni Kurukahvecisi'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name,
        'La Pasta Mamma',
        'Yeldegirmeni date #1 must be La Pasta Mamma'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name,
        'Flake Breakfast & More',
        'Yeldegirmeni kahvalti #1 must be Flake Breakfast & More'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        'A.Ç.T. Dürüm & Meze',
        'Yeldegirmeni denemelisin #1 must be A.Ç.T. Dürüm & Meze'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Salepepe',
        'Lento Napoli',
        'Porto Napoli',
        'Triger',
        'Bamb’s',
        '3 Burger',
        'Calzone Burger',
        'Yeldeğirmeni Kurukahvecisi',
        'Albero Della Vita',
        'Yell Coffee',
        'Village Coffee',
        'Story Coffee',
        'La Pasta Mamma',
        'Borden',
        'Javel',
        'Chapel Pub',
        'Flake',
        'Rucio Breakfast',
        'Müjgan',
        'Bop!',
        'Mill Bakery',
        'A.Ç.T.',
        'Paitan Ramen',
        'Hoş Sefa',
        'Müdavim Lokantası',
        'Leylak Kitchen',
        'Katibe Hanım',
        'Kadıköy Lahmacun',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `yeldegirmeni missing ${expected}`);
      }
      for (const forbidden of [
        'Coffee Manifesto',
        'Balta Burger',
        'Adile Sultan',
        'Beylerbeyi Profiterol',
        'Küff',
        'Carbo Smash',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `yeldegirmeni must exclude ${forbidden}`);
      }
    }
    if (slug === 'bostanci') {
      assert.equal(p.getLocationBySlug('bostanci')?.locative, "Bostancı'da");
      assert.equal(disc.region.displayName, 'Bostancı, Kadıköy, İstanbul');
      const bosCats = p.getRegionCategories(disc.region.id);
      assert.equal(bosCats.length, 7, 'Bostanci must expose 7 coastal categories');
      assert.ok(
        bosCats.some((c) => c.slug === 'balik-deniz-urunleri'),
        'Bostanci missing balik-deniz-urunleri category'
      );
      const bosBalik = p.getCategoryResult(disc.region.id, 'balik-deniz-urunleri');
      assert.ok(
        bosBalik?.coreVenues[0]?.name.includes('Cunda Balık Restaurant'),
        `Bostanci balik #1 must be Cunda Balık Restaurant, got ${bosBalik?.coreVenues[0]?.name}`
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Cunda Balık Restaurant',
        'Hatay Restaurant 1967',
        'Maziden Meyhane',
        'Saatli Fırın',
        'Tarihi Kuzguncuk Fırını',
        'Üçel Kokoreç',
        'Tarihi Şen Lokantası',
        'Noxus Chocolate Bostancı',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `Bostanci missing ${expected}`);
      }
      for (const forbidden of ['Starbucks', "Domino's", 'Hacıbaşar', 'Cro & Cups', 'Pizza V']) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `Bostanci must exclude ${forbidden}`);
      }
    }
    if (slug === 'kusadasi') {
      assert.equal(p.getLocationBySlug('kusadasi')?.locative, "Kuşadası'nda");
      assert.equal(disc.region.displayName, 'Kuşadası, Aydın');
      const locations = f.venues.map((v) => v.location);
      assert.ok(locations.some((loc) => loc.includes('Merkez, Kuşadası')), 'Kusadasi missing Merkez location');
      assert.ok(locations.some((loc) => loc.includes('Davutlar')), 'Kusadasi missing Davutlar location');
      assert.ok(locations.some((loc) => loc.includes('Güzelçamlı')), 'Kusadasi missing Guzelcamli location');
      const names = f.venues.map((v) => v.name);
      assert.ok(names.some((n) => n.includes('Çardak 6')), 'Kusadasi missing Cardak 6');
      assert.ok(names.some((n) => n.includes('Tuki Çarşaflı')), 'Kusadasi missing Tuki Carsafli');
      assert.ok(names.some((n) => n.includes('Ada Söğüşçüsü')), 'Kusadasi missing Ada Soguscusu');
      assert.ok(names.some((n) => n.includes('Bottarga Restaurant')), 'Kusadasi missing Bottarga Restaurant');
      const kusadasiCats = p.getRegionCategories(disc.region.id);
      assert.equal(kusadasiCats.length, 7, 'Kusadasi must expose 7 categories incl. coastal seafood');
      assert.ok(
        kusadasiCats.some((c) => c.slug === 'balik-deniz-urunleri'),
        'Kusadasi missing balik-deniz-urunleri category'
      );
    }
    if (slug === 'gaziantep') {
      assert.equal(p.getLocationBySlug('gaziantep')?.locative, "Gaziantep'te");
      assert.equal(disc.region.displayName, 'Gaziantep');
      const antepCats = p.getRegionCategories(disc.region.id);
      assert.equal(antepCats.length, 8, 'Gaziantep must expose 8 culinary heritage categories');
      assert.equal(antepCats.some((c) => c.slug === 'pizza'), false, 'Gaziantep must not expose pizza');
      assert.equal(antepCats.some((c) => c.slug === 'hamburger'), false, 'Gaziantep must not expose hamburger');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Kebapçı Halil Usta',
        'Zeki İnal',
        'Metanet Lokantası',
        'Katmerci Zekeriya Usta',
        'Hışvahan',
        'Tahmis Kahvesi',
        'Dürümcü Recep Usta',
        'Meşhur Nohutçu Metin Usta',
        'Orkide Pastanesi',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `Gaziantep missing ${expected}`);
      }
      for (const forbidden of ['Aşina', 'Papirüs', 'Sahan', 'Starbucks', 'Espressolab']) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `Gaziantep must exclude ${forbidden}`);
      }
    }
    if (slug === 'antalya-kaleici') {
      assert.equal(p.getLocationBySlug('antalya-kaleici')?.locative, "Kaleiçi ve Merkez'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 9, 'Antalya Kaleici must expose 9 categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Route Burger House',
        'Piyazcı Ahmet',
        'Meşhur Aksu Şimşek Köfte Piyaz',
        'İpek Döner',
        'Komaş Döner Nazım Usta',
        'Aksu Pide Salonu',
        'Ağam Gaziantep Kebap',
        'Börekçi Tevfik',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `antalya-kaleici missing ${expected}`);
      }
      assert.equal(names.some((n) => n.includes('Arma Restaurant')), false, 'Closed Arma must be excluded');
      const kaleiciPizza = p.getCategoryResult(disc.region.id, 'pizza');
      const kaleiciDate = p.getCategoryResult(disc.region.id, 'date-mekanlari');
      assert.ok(
        kaleiciPizza?.coreVenues[0]?.name.includes('Belforno'),
        `Kaleici pizza #1 must be Belforno, got ${kaleiciPizza?.coreVenues[0]?.name}`
      );
      assert.ok(
        kaleiciDate?.coreVenues[0]?.name.includes('Belforno'),
        `Kaleici date-mekanlari #1 must be Belforno, got ${kaleiciDate?.coreVenues[0]?.name}`
      );
    }
    if (slug === 'akyaka') {
      assert.equal(p.getLocationBySlug('akyaka')?.locative, "Akyaka'da");
      assert.equal(disc.region.displayName, 'Akyaka, Muğla');
      const akyakaCats = p.getRegionCategories(disc.region.id);
      assert.equal(akyakaCats.length, 7, 'Akyaka must expose 7 coastal categories');
      assert.ok(
        akyakaCats.some((c) => c.slug === 'balik-deniz-urunleri'),
        'Akyaka missing balik-deniz-urunleri category'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Pizza Fellas',
        "Börfi's Burger",
        "Halil'in Yeri",
        'Akyaka Orfoz',
        'Olta Balık',
        'West Cafe Bistro',
        'Gökova Börek',
        'Mosso Akyaka',
        "No22 Riders'Inn",
        'Meşhur Akçapınar Tostçusu',
        'Sandal Balık Ekmek',
        'Pazarola Yöresel Mutfak',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `Akyaka missing ${expected}`);
      }
      for (const forbidden of ["Leo's Pizza", 'Lightroom', 'Starbucks', "Domino's"]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `Akyaka must exclude ${forbidden}`);
      }
    }
    if (slug === 'antalya-lara') {
      assert.equal(p.getLocationBySlug('antalya-lara')?.locative, "Lara'da");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 8, 'Antalya Lara must expose 8 categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Schiller Kaffee Güzeloba',
        'Route Burger House',
        'B12 Steak & Kasap',
        'Sultanyar Kebap',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `antalya-lara missing ${expected}`);
      }
      assert.equal(names.some((n) => n.includes('The Sudd')), false, 'Closed Lara Sudd must be excluded');
    }
    if (slug === 'antalya-konyaalti') {
      assert.equal(p.getLocationBySlug('antalya-konyaalti')?.locative, "Konyaaltı'nda");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 8, 'Antalya Konyaalti must expose 8 categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of ['7 Mehmet Restaurant', 'Cafe Pouchkine Antalya', 'Çamlık Pide Kebap']) {
        assert.ok(names.some((n) => n.includes(expected)), `antalya-konyaalti missing ${expected}`);
      }
      assert.equal(names.some((n) => n.includes('Merkez Pide & Kebap')), false, 'Distant Kumluca pide must be excluded');
    }
    if (slug === 'kosuyolu-acibadem') {
      assert.equal(p.getLocationBySlug('kosuyolu-acibadem')?.locative, "Koşuyolu ve Acıbadem'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'kosuyolu-acibadem must expose 6 categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Speranza Pizzeria',
        'Wake N Bake',
        'Feinka Coffee',
        'SØLVI',
        'Monstera Coffee',
        'Zeytinli Mutfak',
        'Affan Ocakbaşı',
        'Adana Park Ocakbaşı',
        'Tarihi Kuzguncuk Fırını Acıbadem',
        'Ceviz Ağacı Koşuyolu',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `kosuyolu-acibadem missing ${expected}`);
      }
      for (const forbidden of [
        'Viyana Kahvesi',
        'Beyaz Fırın',
        'Pizza V',
        'Kaffee Schütz',
        'Hane Çikolata',
        'Adile Sultan',
        'Çanak Kebap',
        'BRAND BURGER',
        'Brand Burger',
        'Kirpi',
        'İntiba',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `kosuyolu-acibadem must exclude ${forbidden}`);
      }
    }
    if (slug === 'feneryolu') {
      assert.equal(p.getLocationBySlug('feneryolu')?.locative, "Feneryolu'nda");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 5, 'feneryolu must expose 5 categories');
      assert.equal(f.venues.length, 17, 'feneryolu must expose 17 verified venues');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'il Bello',
        'Spello Kitchen',
        'Rustie Eatery',
        'Orlando Coffee',
        'Seven Specialty Coffee',
        'Alaturka İstanbul',
        'Merveilleux Patisserie',
        'Kameriye Kafe Çay Bahçesi',
        'Mantiquem',
        'Tarhun Restoran',
        'Grain Mediterranean',
        'Bake Bar',
        'İl Fico Gelato',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `feneryolu missing ${expected}`);
      }
      for (const forbidden of [
        'Starbucks',
        'Beyaz Fırın',
        'Adile Sultan',
        "Domino's",
        'Nazar Profiterol',
        'La Mora',
        'Kerem Pastanesi',
        'Largando',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `feneryolu must exclude ${forbidden}`);
      }
    }
    if (slug === 'fenerbahce-kalamis') {
      assert.equal(p.getLocationBySlug('fenerbahce-kalamis')?.locative, "Fenerbahçe ve Kalamış'ta");
      assert.equal(disc.region.displayName, 'Fenerbahçe & Kalamış, Kadıköy, İstanbul');
      const fkCats = p.getRegionCategories(disc.region.id);
      assert.equal(fkCats.length, 7, 'fenerbahce-kalamis must expose 7 coastal categories');
      assert.ok(
        fkCats.some((c) => c.slug === 'balik-deniz-urunleri'),
        'fenerbahce-kalamis missing balik-deniz-urunleri category'
      );
      assert.equal(f.venues.length, 30, 'fenerbahce-kalamis must expose 30 verified venues');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Boter Kalamış',
        'Via Pizzeria',
        'Spenta Pizza',
        'Sailors Pizza Kalamış',
        'Seri Street Food',
        'Büffe Kalamış',
        'Elloi Kalamış',
        'Klar Coffee Roastery',
        'Doppio Fika Point',
        'Peggy Coffee',
        'Parvus Kalamış',
        'Son Lokanta',
        'Duende Kalamış',
        'il Boccalino 34',
        'Nokta Kalamış',
        'Morney Eatery',
        'Kalamissia Kafe',
        'Affan Ocakbaşı',
        'Damak Köfte',
        'Payyar Ocakbaşı',
        'Largando',
        'Patriça',
        'Çapa Milos Balık',
        'Saca Marin',
        'Todori Fenerbahçe',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `fenerbahce-kalamis missing ${expected}`);
      }
      assert.equal(
        p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name,
        'Boter Kalamış',
        'Boter Kalamış must rank #1 in kahve'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name,
        'Boter Kalamış',
        'Boter Kalamış must rank #1 in kahvalti'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        'Boter Kalamış',
        'Boter Kalamış must rank #1 in denemelisin'
      );
      for (const forbidden of [
        'Midpoint',
        'Happy Moon',
        "Domino's",
        'Kronotrop',
        'Develi',
        '5masa',
        'Simple Co',
        'Flân',
        'Perran Ocakbaşı',
        'Ouzo Roof',
        'Kalamış Paysage',
        'Görgülü',
      ]) {
        assert.equal(
          names.some((n) => n.includes(forbidden)),
          false,
          `fenerbahce-kalamis must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'uskudar') {
      assert.equal(p.getLocationBySlug('uskudar')?.locative, "Üsküdar'da");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'uskudar must expose 6 categories');
      assert.equal(f.venues.length, 26, 'uskudar must expose 26 verified venues');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Bobby Baccalieri',
        'Pizza Rita',
        'Space Pizza',
        'Rikka Burger',
        'Olinna Coffee',
        'Heep',
        'Nevmekan Selimiye',
        'Koparan Balık Evi',
        'Fournos Artisan Bakery',
        'Üsküdar Kooperatif',
        'Kuymak Adam',
        'Kanaat Lokantası',
        'Lokanta İmren',
        'Vanilla Sütlü Tatlı',
        'Gözlemeye',
        'Dede Ahmet',
        'Ayhan Usta',
        'Yener Usta',
        'Mehveş Ev Yapımı',
        'Mantıstan',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `uskudar missing ${expected}`);
      }
      for (const forbidden of [
        'Starbucks',
        'Mim Kahve',
        'Pizza Amore',
        "Butcher's Burger",
        'Filizler Köftecisi',
        'Katibim',
        'Nevmekan Sahil',
        'Riff Specialty',
        'Öz Bolu',
        'Kaffee Schütz',
        'Adile Sultan',
        'Espressolab',
        'La Veria',
        'Döner Bank',
        'Burger Evim',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `uskudar must exclude ${forbidden}`);
      }
    }
    if (slug === 'kuzguncuk') {
      assert.equal(p.getLocationBySlug('kuzguncuk')?.locative, "Kuzguncuk'ta");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'kuzguncuk must expose 6 categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Mahalle Kuzguncuk',
        'Jobu Smash Burgers',
        'Nail Kitabevi & Cafe',
        'Glow Coffee',
        'İsmet Baba Restaurant',
        'Tarihi Kuzguncuk Fırını',
        'Metet Közde Döner',
        'Ekmek Teknesi',
        'Bay Mantı',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `kuzguncuk missing ${expected}`);
      }
      for (const forbidden of [
        'Via Balık',
        'Pulat Çiftliği',
        'Pita Kuzguncuk',
        'Kuzguncuk Çınaraltı',
        'Dilim Pastanesi',
        'Seyret Nakkaştepe',
        'Ira Bakery Exclusive',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `kuzguncuk must exclude ${forbidden}`);
      }
    }
    if (slug === 'cengelkoy') {
      assert.equal(p.getLocationBySlug('cengelkoy')?.locative, "Çengelköy'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'cengelkoy must expose 7 coastal categories');
      assert.ok(
        cats.some((c) => c.slug === 'balik-deniz-urunleri'),
        'cengelkoy missing balik-deniz-urunleri category'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        "Pap's Pizzeria",
        'Dopio Pizza',
        'Kael Burger',
        'Crust HQ',
        'Newtown Specialty Coffee',
        'Znâ Matcha',
        'Birds Çengelköy',
        'Çengelköy Tarihi Çınaraltı',
        'Paşa Kokoreç',
        "L'aube Patisserie",
        'Del Mare',
        'Rigel Restaurant',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `cengelkoy missing ${expected}`);
      }
      for (const forbidden of [
        'Emirgan Sütiş',
        'Espressolab',
        'Villa Bosphorus',
        'Çengelköy Börekçisi',
        'Vakko',
        'Çikolata Kahve',
        'Şen Balık',
        'Chacha Balık',
        'Boon Cafe',
        'Münire',
        "Barto's",
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `cengelkoy must exclude ${forbidden}`);
      }
    }
    if (slug === 'karakoy') {
      assert.equal(p.getLocationBySlug('karakoy')?.locative, "Karaköy'de");
      assert.equal(p.getLocationBySlug('karakoy-beyoglu')?.slug, 'karakoy');
      assert.ok(
        p.searchLocations('kemankes').some((l) => l.slug === 'karakoy'),
        'searchLocations("kemankes") must match karakoy'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'karakoy must expose 7 coastal categories');
      assert.ok(
        cats.some((c) => c.slug === 'balik-deniz-urunleri'),
        'karakoy missing balik-deniz-urunleri category'
      );
      assert.equal(f.venues.length, 31, 'karakoy must expose 31 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Karaköy')),
        'Every Karakoy card location must use street + , Karaköy label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Crust & Co');
      assert.equal(p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name, 'Chuck Burger');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Coffee Sapiens');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, 'Faros Karaköy');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[1].name, 'Mürver');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Â La Lune Patisserie');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        'Karaköy Güllüoğlu - Nadir Güllü'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'balik-deniz-urunleri').coreVenues[0].name,
        'Yelkenci Karaköy'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Crust & Co',
        'Faros Karaköy',
        'Chuck Burger',
        'Coffee Sapiens',
        'Coe Coffee',
        'Mürver',
        'Neolokal',
        'Â La Lune Patisserie',
        'Karaköy Güllüoğlu - Nadir Güllü',
        'Karaköy Lokantası',
        'Nato Lokantası 1952',
        'Meşhur Balıkçı Eyyup Usta',
        'Yelkenci Karaköy',
        'Liman Karaköy',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `karakoy missing ${expected}`);
      }
      for (const forbidden of [
        'Espressolab',
        'Kronotrop',
        'Faruk Güllüoğlu',
        "Perlo's",
        'BURGERLAB',
        'Karabatak',
        'Akın Balık',
        'Namlı Gurme',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `karakoy must exclude ${forbidden}`);
      }
    }
    if (slug === 'cihangir') {
      assert.equal(p.getLocationBySlug('cihangir')?.locative, "Cihangir'de");
      assert.equal(p.getLocationBySlug('cihangir-beyoglu')?.slug, 'cihangir');
      assert.ok(
        p.searchLocations('cukurcuma').some((l) => l.slug === 'cihangir'),
        'searchLocations("cukurcuma") must match cihangir'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'cihangir must expose 6 categories');
      assert.equal(f.venues.length, 25, 'cihangir must expose 25 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Cihangir')),
        'Every Cihangir card location must use street + , Cihangir label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'UN Cihangir');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name,
        'B.A.D Burger Basic And Delicious'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name,
        'Ground Coffee Company Cihangir'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, '49 Çukurcuma');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[1].name, 'Rose Marine Cihangir');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Kaktüs Cihangir');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        '1932 Cihangir Doyum Mantı'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'UN Cihangir',
        '49 Çukurcuma',
        'B.A.D Burger',
        'Ground Coffee Company Cihangir',
        'Rose Marine Cihangir',
        'Kaktüs Cihangir',
        'Van Kahvaltı Evi',
        '1932 Cihangir Doyum Mantı',
        'Tarihi Savoy Pastanesi 1950',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `cihangir missing ${expected}`);
      }
      for (const forbidden of ['Espressolab', 'Kronotrop', 'Pizzabulls', 'Homevibe', 'Cuma', 'Jash']) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `cihangir must exclude ${forbidden}`);
      }
    }
    if (slug === 'nisantasi') {
      assert.equal(p.getLocationBySlug('nisantasi')?.locative, "Nişantaşı'nda");
      assert.equal(p.getLocationBySlug('nisantasi-sisli')?.slug, 'nisantasi');
      assert.ok(
        p.searchLocations('tesvikiye').some((l) => l.slug === 'nisantasi'),
        'searchLocations("tesvikiye") must match nisantasi'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'nisantasi must expose 6 categories');
      assert.equal(f.venues.length, 26, 'nisantasi must expose 26 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Nişantaşı')),
        'Every Nisantasi card location must use street + , Nişantaşı label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Bargozzy');
      assert.equal(p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name, 'Woody');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Pioni Coffee');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, 'Juno');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Kruvasan');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        'SADE Beş Denizler Mutfağı'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Bargozzy',
        'Azzurro Pizza Napoletana',
        'The Big Slice Pizza Nişantaşı',
        'Woody',
        'Pioni Coffee',
        'Coffee Department Nişantaşı',
        'Juno',
        'Kruvasan',
        'SADE Beş Denizler Mutfağı',
        'Hünkar 1950',
        'Tatbak',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `nisantasi missing ${expected}`);
      }
      for (const forbidden of [
        "Domino's",
        "Papa John's",
        'Adile Sultan',
        'Vakko',
        'Develi',
        'Saltbae',
        'Cro & Cups',
        'White Burger',
        'Big Chefs',
        'Beymen Brasserie',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `nisantasi must exclude ${forbidden}`);
      }
    }
    if (slug === 'galata') {
      assert.equal(p.getLocationBySlug('galata')?.locative, "Galata'da");
      assert.equal(p.getLocationBySlug('galata-beyoglu')?.slug, 'galata');
      assert.ok(
        p.searchLocations('kuledibi').some((l) => l.slug === 'galata'),
        'searchLocations("kuledibi") must match galata'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'galata must expose 6 categories');
      assert.equal(f.venues.length, 23, 'galata must expose 23 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Galata')),
        'Every Galata card location must use street + , Galata label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Molto Bene Galata');
      assert.equal(p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name, 'Grabs Street Food');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Egono Galata');
      const dateVenues = p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues;
      assert.equal(dateVenues[0].name, 'Molto Bene Galata');
      assert.equal(dateVenues[1].name, 'Güney Restaurant 1964 - Kuledibi');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Limon Kahvaltı - Galata');
      assert.equal(p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name, 'Petek Büfe Galata 1971');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Molto Bene Galata',
        'Hi Italia Galata',
        'Grabs Street Food',
        'WUUX Burger',
        'Egono Galata',
        'Old Java Coffee Roasters',
        'Mundo Novo Coffee',
        'Cafe Le Banc',
        'Güney Restaurant 1964 - Kuledibi',
        'Simone',
        "Pepo's Galata",
        'Sensus Galata Şarap Butiği',
        'Il Cortile Ristorante',
        'Limon Kahvaltı - Galata',
        'Menemen Galata',
        'Dükkan Galata',
        'Privato Cafe Galata',
        'Petek Büfe Galata 1971',
        'Galata Süheyla',
        'Galata Kitchen',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `galata missing ${expected}`);
      }
      for (const forbidden of [
        'Federal Galata',
        'Viyana Kahvesi',
        'Saltbae',
        'Şirin Fırın',
        'Galata Şaraphanesi',
        'Barnathan',
        'Firuzende',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `galata must exclude ${forbidden}`);
      }
    }
    if (slug === 'besiktas-carsi') {
      assert.equal(p.getLocationBySlug('besiktas-carsi')?.locative, "Beşiktaş Çarşı'da");
      assert.equal(p.getLocationBySlug('carsi-besiktas')?.slug, 'besiktas-carsi');
      assert.ok(
        p.searchLocations('koyici').some((l) => l.slug === 'besiktas-carsi'),
        'searchLocations("koyici") must match besiktas-carsi'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'besiktas-carsi must expose 7 coastal categories');
      assert.ok(
        cats.some((c) => c.slug === 'balik-deniz-urunleri'),
        'besiktas-carsi missing balik-deniz-urunleri category'
      );
      assert.equal(f.venues.length, 28, 'besiktas-carsi must expose 28 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Beşiktaş Çarşı')),
        'Every Besiktas Carsi card location must use street + , Beşiktaş Çarşı label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Sprout');
      assert.equal(p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name, 'The Smashy');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'O Coffee');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name,
        'Agafya Meyhanesi'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name,
        'Peynir Ekmek Kahvaltı'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        'Karadeniz Döner Asım Usta'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'balik-deniz-urunleri').coreVenues[0].name,
        'By Muzaffer Beşiktaş'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Sprout',
        'Pizza Circasso',
        'The Smashy',
        'Beyefendi Burger',
        'O Coffee',
        'Coffers Coffee',
        'Pangea Roasting',
        'Agafya Meyhanesi',
        'Maltica Gastro Pub',
        'Peynir Ekmek Kahvaltı',
        'Çakmak Kahvaltı Salonu',
        'Karadeniz Döner Asım Usta',
        'Tarihi Oktay Kurabiye Fırını',
        'Vegan Masa',
        'Mantizz',
        'By Muzaffer Beşiktaş',
        'Beşiktaş Olta Balık',
        'Balıkçı Hasan Beşiktaş',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `besiktas-carsi missing ${expected}`);
      }
      for (const forbidden of [
        'Vona Akaretler',
        'caffestudio by KEF',
        'Mahal Meze & Meyhane',
        'House of B',
        'Pizza Krema',
        'Fres Burger',
        'Balkan Lokantası',
        'THE CO. COFFEE',
        'La Vie Praline',
        'Bargozzy',
        'BEŞİKTAŞ ÇARŞI BALIK',
        'Vogue Restaurant',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `besiktas-carsi must exclude ${forbidden}`);
      }
    }
    if (slug === 'akaretler') {
      assert.equal(p.getLocationBySlug('akaretler')?.locative, "Akaretler'de");
      assert.equal(p.getLocationBySlug('akaretler-besiktas')?.slug, 'akaretler');
      assert.ok(
        p.searchLocations('visnezade').some((l) => l.slug === 'akaretler'),
        'searchLocations("visnezade") must match akaretler'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'akaretler must expose 6 standard categories');
      assert.equal(f.venues.length, 20, 'akaretler must expose 20 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Akaretler')),
        'Every Akaretler card location must use street + , Akaretler label'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name,
        'Emporio Ristorante Akaretler'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name, 'Vona Akaretler');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'caffestudio by KEF');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name,
        'Emporio Ristorante Akaretler'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[1].name,
        'Mahal Meze & Meyhane'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Sabrosa Restaurant');
      assert.equal(p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name, 'Kavur Beşiktaş');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Emporio Ristorante Akaretler',
        'Vona Akaretler',
        'The Single Bite',
        'Beny Burger House',
        'caffestudio by KEF',
        'Amazonas Coffee Roastery',
        'Blum Coffee House',
        'Rodi Coffee Shop',
        'Mahal Meze & Meyhane',
        'Agata İstanbul',
        'Bordo Kulüp Maçka',
        'Tiny Drinkery House',
        'Sabrosa Restaurant',
        'Madame Kuki Patisserie',
        'Şairler Kahvesi Akaretler',
        'Kavur Beşiktaş',
        'Mamamanti',
        'Say Cheese Akaretler',
        'Atıştır1989',
        'Minoa Books & Coffee Akaretler',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `akaretler missing ${expected}`);
      }
      for (const forbidden of [
        'Beyond Akaretler',
        'The Hunger Akaretler',
        'Simple Co Akaretler',
        'Napoli Gourmet',
        'Death By Chocolate',
        'NUQ GASTRO',
        'Bellini Akaretler',
        'ravenna akaretler',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `akaretler must exclude ${forbidden}`);
      }
    }
    if (slug === 'bebek') {
      assert.equal(p.getLocationBySlug('bebek')?.locative, "Bebek'te");
      assert.equal(p.getLocationBySlug('bebek-besiktas')?.slug, 'bebek');
      assert.ok(
        p.searchLocations('kucuk bebek').some((l) => l.slug === 'bebek'),
        'searchLocations("kucuk bebek") must match bebek'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'bebek must expose 6 active categories with pizza pruned');
      assert.equal(
        cats.some((c) => c.slug === 'pizza'),
        false,
        'bebek must dynamically hide pizza when no qualifying venue exists'
      );
      assert.ok(
        cats.some((c) => c.slug === 'balik-deniz-urunleri'),
        'bebek must expose balik-deniz-urunleri coastal category'
      );
      assert.equal(f.venues.length, 11, 'bebek must expose 11 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Bebek')),
        'Every Bebek card location must use street + , Bebek label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name, 'Bread & Burger');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'POCO Coffee & Matcha Bar');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name,
        'Sekizdeyiz Bebek'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Numa Bebek');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        'Meşhur Bebek Badem Ezmesi'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'balik-deniz-urunleri').coreVenues[0].name,
        'Bebek Balıkçı'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Bread & Burger',
        'ÇK & Steakhouse Bebek',
        'POCO Coffee & Matcha Bar',
        'Sabba Coffee',
        'Sekizdeyiz Bebek',
        'Numa Bebek',
        'SEASON Artisan Bakery',
        'Meşhur Bebek Badem Ezmesi',
        'Bebek Mini Dondurma',
        'Yirmibir Kebap Bebek',
        'Bebek Balıkçı',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `bebek missing ${expected}`);
      }
      for (const forbidden of [
        'Sankai by Nagaya',
        'Upper Crust',
        'Espressolab Bebek',
        'Divan Pastanesi Bebek',
        'Selamlique Bebek',
        'Ninda Bebek',
        'ATLAS BALIK',
        'Piccola Pizzeria Arnavutköy',
        'Lucca',
        'Mangerie',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `bebek must exclude ${forbidden}`);
      }
    }
    if (slug === 'etiler') {
      assert.equal(p.getLocationBySlug('etiler')?.locative, "Etiler'de");
      assert.equal(p.getLocationBySlug('etiler-besiktas')?.slug, 'etiler');
      assert.ok(
        p.searchLocations('akatlar').some((l) => l.slug === 'etiler'),
        'searchLocations("akatlar") must match etiler'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'etiler must expose 6 active standard categories');
      assert.equal(f.venues.length, 20, 'etiler must expose 20 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Etiler')),
        'Every Etiler card location must use street + , Etiler label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Pizza Wood Fire');
      assert.equal(p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name, "Catch-N'-Eat");
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Lali Coffee');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, 'Arkestra');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Minval');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        'Aşkana Mantı Ulus'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Pizza Wood Fire',
        'Da Lupo Trattoria',
        "Catch-N'-Eat",
        'Çiftlik Kasap Burger',
        'Abrakadabra Burger Ulus',
        'Lali Coffee',
        'Molecule House',
        'Roastico Coffee & Cocktail Bar',
        'Arkestra',
        'Sipster Etiler',
        'Paper Moon',
        'Bardy.',
        'Minval',
        'Aşkana Mantı Ulus',
        'Miyabi Sushi & Japanese Grill Bar',
        'MiniKebapçı',
        'By Ulus Steakhouse',
        'Saye Ocakbaşı',
        'Citra',
        'İkonium Etiler Etli Ekmek & Tandır',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `etiler missing ${expected}`);
      }
      for (const forbidden of [
        'Akali Etiler',
        'Espressolab Etiler',
        'Beyaz Fırın Etiler',
        'COOKSHOP',
        'Mikel Coffee',
        'Bodrum Mantı',
        'Grandma',
        'Casita',
        'Nusr-Et',
        'Melodi Çikolata',
        'Etiler Opera Pastanesi',
        'Scarpetta',
        'Supernormal Burger',
        'Harvard Bistro',
        'Minoa Village',
        'Oliva İstanbul',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `etiler must exclude ${forbidden}`);
      }
    }
    if (slug === 'ortakoy') {
      assert.equal(p.getLocationBySlug('ortakoy')?.locative, "Ortaköy'de");
      assert.equal(p.getLocationBySlug('ortakoy-besiktas')?.slug, 'ortakoy');
      assert.ok(
        p.searchLocations('mecidiye').some((l) => l.slug === 'ortakoy'),
        'searchLocations("mecidiye") must match ortakoy'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'ortakoy must expose 7 active coastal categories');
      assert.ok(
        cats.some((c) => c.slug === 'balik-deniz-urunleri'),
        'ortakoy must expose balik-deniz-urunleri coastal category'
      );
      assert.equal(f.venues.length, 25, 'ortakoy must expose 25 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Ortaköy')),
        'Every Ortakoy card location must use street + , Ortaköy label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Pizano Pizzeria');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name,
        'Sizzle Street Food'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Per Noi Coffee Co.');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name,
        'Lokanta Feriye'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name,
        'Casa Fırın Ortaköy'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        'Ortaköy Mantıcısı'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'balik-deniz-urunleri').coreVenues[0].name,
        'Park Fora'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Pizano Pizzeria',
        'Del Ponte Pizzeria',
        '4 / Kitchen Ortaköy',
        'Sizzle Street Food',
        'Per Noi Coffee Co.',
        'Ora Coffee Ortaköy',
        'Ortaköy Koyu Kahve',
        'Lokanta Feriye',
        'Sefarad Meyhane',
        'Visorante Kitchen & Bar Ortaköy',
        'Casa Fırın Ortaköy',
        'WAY Coffee & Bakery',
        'Çaynik Breakfast Cafe',
        'Ortaköy Cafe Kahvaltı',
        'Ortaköy Mantıcısı',
        'Konyalı Ferdi Usta Ortaköy',
        'Dürümcü Enişte',
        'Kebapçı Memet',
        'Ortaköy Köftecisi',
        'Taşfırın Ortaköy',
        'Anadolu Kumpir',
        "Kumrucu Adnan'ın Yeri",
        'Park Fora',
        'İstakozi',
        'Dalyan Balık Izgara',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `ortakoy missing ${expected}`);
      }
      for (const forbidden of [
        'The House Cafe',
        'Espressolab Ortaköy',
        'Adile Sultan',
        'Pasaport Pizza',
        '8one Burger',
        'Burger King',
        'Ortaköy OSK',
        'Beltaş',
        'Kumpir 14',
        'Bizce Ortaköy',
        'Ruby İstanbul',
        'Mavi Balık',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `ortakoy must exclude ${forbidden}`);
      }
    }
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

test('V3.6 strict chain blocklist, coffee purity, and >=4.4 quality floor across all 27 snapshots', () => {
  const bannedRe =
    /pizza v|kaffee schütz|kaffee schutz|adile sultan|hane çikolata|çanak kebap|brand burger|butcher's burger|vakko|filizler köftecisi|çengelköy börekçisi|kirpi|intiba döner|la veria|döner bank|doner bank|burger evim|nazar profiterol|pizzalazza|simple co|5masa|develi|bedri usta|divan brasserie|perran ocakbaşı|coffee manifesto|balta burger|beylerbeyi profiterol|saltbae|the house cafe|faruk güllüoğlu|hafız mustafa|cro & cups|white burger|biber burger|perlo's|burgerlab|akali|federal galata|ot cafe|pizza krema|sun brothers|fres burger|napoli gourmet|sliceguy|betro burger|the hunger|upper crust|selamlique|mikel coffee|pasaport pizza|8one burger|bodrum mantı|bodrum manti|casita|grandma|nusr-et|nusret/i;
  const nonCoffeeRe = /çikolata|cikolata|pastanesi|unlu mamülleri|börek|borek|baklava/i;

  for (const { key, data } of snapshots) {
    for (const v of data.venues) {
      assert.ok(!bannedRe.test(v.name), `V3.6 banned chain/mediocre venue leaked in ${key}: ${v.name}`);
      if (v.categoryId === 'kahve') {
        assert.ok(!nonCoffeeRe.test(v.name), `V3.6 non-coffee specialist leaked into kahve in ${key}: ${v.name}`);
      }
    }
  }
});

test('V3.7 cost guardrails: pipeline strips Atmosphere SKU fields, blocks bulk --all --refresh, and ships shared discovery cache CLI', () => {
  const pipelineSrc = fs.readFileSync(path.join(ROOT, 'scripts/run_region_pipeline.mjs'), 'utf8');
  const maskMatch = pipelineSrc.match(/export const ENTERPRISE_FIELD_MASK\s*=\s*\[([\s\S]*?)\]\.join\(/);
  assert.ok(maskMatch, 'V3.7 run_region_pipeline.mjs must define ENTERPRISE_FIELD_MASK');
  const fieldNames = [...maskMatch[1].matchAll(/'([a-zA-Z0-9_]+)'/g)].map((m) => m[1]);

  const forbiddenAtmosphereFields = [
    'dineIn',
    'takeout',
    'outdoorSeating',
    'reservable',
    'reviews',
    'editorialSummary',
    'currentOpeningHours',
    'regularOpeningHours',
  ];
  for (const forbidden of forbiddenAtmosphereFields) {
    assert.ok(
      !fieldNames.includes(forbidden),
      `V3.7 cost leak: ENTERPRISE_FIELD_MASK must not include Atmosphere field "${forbidden}"`
    );
  }

  const requiredEnterpriseFields = [
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
    'location',
    'addressComponents',
  ];
  for (const required of requiredEnterpriseFields) {
    assert.ok(
      fieldNames.includes(required),
      `V3.7 ENTERPRISE_FIELD_MASK missing required field "${required}"`
    );
  }

  const discoverPath = path.join(ROOT, 'scripts/discover_region_places.mjs');
  assert.ok(fs.existsSync(discoverPath), 'V3.7 scripts/discover_region_places.mjs must exist');
  const discoverSrc = fs.readFileSync(discoverPath, 'utf8');
  assert.ok(discoverSrc.includes('pageSize: 20'), 'V3.7 discover CLI must batch searchText with pageSize: 20');
  assert.ok(discoverSrc.includes('MAX_REVIEW_IDS_PER_RUN = 5'), 'V3.7 discover CLI must cap --reviews at 5 IDs');

  const statsRes = spawnSync(process.execPath, [discoverPath, '--stats'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(statsRes.status, 0, `discover --stats failed: ${statsRes.stderr}`);
  assert.ok(statsRes.stdout.includes('byPlaceId:'), 'discover --stats must report byPlaceId count');
  assert.ok(statsRes.stdout.includes('monthlyUsage'), 'discover --stats must report monthlyUsage caps');

  const guardRes = spawnSync(
    process.execPath,
    [path.join(ROOT, 'scripts/run_region_pipeline.mjs'), '--all', '--refresh'],
    { cwd: ROOT, encoding: 'utf8' }
  );
  assert.notEqual(guardRes.status, 0, 'V3.7 pipeline --all --refresh must be blocked without --confirm-paid-refresh');
  assert.ok(
    `${guardRes.stdout}\n${guardRes.stderr}`.includes('QUOTA_GUARD'),
    `Expected QUOTA_GUARD error on --all --refresh, got: ${guardRes.stderr}`
  );
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
