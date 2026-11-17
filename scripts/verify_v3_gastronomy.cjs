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
  'istanbul-beyoglu-cukurcuma',
  'istanbul-fatih-balat',
  'istanbul-sariyer-yenikoy',
  'istanbul-eyupsultan-gokturk',
  'istanbul-beyoglu-asmalimescit',
  'istanbul-beyoglu-taksim',
  'aydin-kusadasi',
  'gaziantep-merkez',
  'antalya-kaleici',
  'antalya-lara',
  'antalya-konyaalti',
  'antalya-kas-merkez',
  'antalya-kalkan-merkez',
  'antalya-alanya-merkez',
  'antalya-side',
  'antalya-kemer',
  'mugla-ula-akyaka',
  'mugla-fethiye-yaniklar',
  'mugla-fethiye-gocek',
  'mugla-fethiye-merkez',
  'mugla-fethiye-calis',
  'mugla-fethiye-oludeniz',
  'mugla-bodrum-merkez',
  'mugla-bodrum-yalikavak',
  'mugla-bodrum-gumusluk',
  'mugla-bodrum-turkbuku',
  'mugla-bodrum-bitez',
  'mugla-bodrum-turgutreis',
  'mugla-bodrum-ortakent-yahsi',
  'mugla-bodrum-gundogan',
  'mugla-bodrum-gumbet',
  'mugla-bodrum-torba',
  'mugla-bodrum-akyarlar',
  'mugla-marmaris-merkez',
  'mugla-datca-merkez',
  'izmir-konak-alsancak',
  'izmir-karsiyaka-bostanli',
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
      key === 'istanbul-besiktas-ortakoy' ||
      key === 'istanbul-sariyer-yenikoy' ||
      key === 'antalya-kas-merkez' ||
      key === 'antalya-kalkan-merkez' ||
      key === 'antalya-alanya-merkez' ||
      key === 'antalya-side' ||
      key === 'antalya-kemer' ||
      key === 'mugla-fethiye-yaniklar' ||
      key === 'mugla-fethiye-gocek' ||
      key === 'mugla-fethiye-merkez' ||
      key === 'mugla-fethiye-calis' ||
      key === 'mugla-fethiye-oludeniz' ||
      key === 'mugla-bodrum-merkez' ||
      key === 'mugla-bodrum-yalikavak' ||
      key === 'mugla-bodrum-gumusluk' ||
      key === 'mugla-bodrum-turkbuku' ||
      key === 'mugla-bodrum-bitez' ||
      key === 'mugla-bodrum-turgutreis' ||
      key === 'mugla-bodrum-ortakent-yahsi' ||
      key === 'mugla-bodrum-gundogan' ||
      key === 'mugla-bodrum-gumbet' ||
      key === 'mugla-bodrum-torba' ||
      key === 'mugla-bodrum-akyarlar' ||
      key === 'mugla-marmaris-merkez' ||
      key === 'mugla-datca-merkez' ||
      key === 'izmir-konak-alsancak' ||
      key === 'izmir-karsiyaka-bostanli';
    const isHeritage = key === 'gaziantep-merkez';
    const isAntalya =
      key === 'antalya-kaleici' ||
      key === 'antalya-lara' ||
      key === 'antalya-konyaalti';
    assert.ok(
      isHeritage
        ? data.categories.length === 8
        : isAntalya
        ? data.categories.length >= 8 && data.categories.length <= 9
        : isCoastal
        ? (key === 'istanbul-besiktas-bebek' || key === 'antalya-side' || key === 'mugla-bodrum-yalikavak' || key === 'mugla-bodrum-turgutreis' || key === 'mugla-bodrum-akyarlar'
            ? data.categories.length === 6
            : key === 'istanbul-sariyer-yenikoy' || key === 'mugla-bodrum-gumusluk' || key === 'mugla-bodrum-gundogan'
            ? data.categories.length === 5
            : key === 'mugla-bodrum-torba'
            ? data.categories.length === 4
            : key === 'mugla-bodrum-gumbet'
            ? data.categories.length === 3
            : key === 'mugla-fethiye-yaniklar'
            ? data.categories.length === 2
            : data.categories.length === 7)
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

test('Yenikoy dynamically prunes pizza & hamburger ("Yoksa Onerme") and exposes 5 active categories with coastal fish', () => {
  const yenikoy = snapshots.find((s) => s.key === 'istanbul-sariyer-yenikoy').data;
  assert.equal(yenikoy.categories.length, 5);
  assert.equal(yenikoy.categories.some((c) => c.slug === 'pizza'), false);
  assert.equal(yenikoy.categories.some((c) => c.slug === 'hamburger'), false);
  assert.equal(yenikoy.categories.some((c) => c.slug === 'balik-deniz-urunleri'), true);
});

test('Yalikavak dynamically prunes kahve ("Yoksa Onerme") and exposes 6 active categories with coastal fish', () => {
  const yalikavak = snapshots.find((s) => s.key === 'mugla-bodrum-yalikavak').data;
  assert.equal(yalikavak.categories.length, 6);
  assert.equal(yalikavak.categories.some((c) => c.slug === 'kahve'), false);
  assert.equal(yalikavak.categories.some((c) => c.slug === 'balik-deniz-urunleri'), true);
});

test('Gumusluk dynamically prunes hamburger & kahve ("Yoksa Onerme") and exposes 5 active categories with coastal fish', () => {
  const gumusluk = snapshots.find((s) => s.key === 'mugla-bodrum-gumusluk').data;
  assert.equal(gumusluk.categories.length, 5);
  assert.equal(gumusluk.categories.some((c) => c.slug === 'hamburger'), false);
  assert.equal(gumusluk.categories.some((c) => c.slug === 'kahve'), false);
  assert.equal(gumusluk.categories.some((c) => c.slug === 'balik-deniz-urunleri'), true);
});

test('all 58 published regions have zero overlapping placeIds, valid ratings, and canonical CID links', () => {
  const globalPlaceIds = new Set();
  for (const { key, data } of snapshots) {
    const expectedDistricts =
      key === 'antalya-kaleici'
        ? ['Muratpaşa']
        : key === 'antalya-konyaalti'
        ? ['Konyaaltı', 'Muratpaşa']
        : key === 'antalya-kalkan-merkez'
        ? ['Kaş', 'Kalkan']
        : key === 'antalya-side'
        ? ['Manavgat', 'Side']
        : key === 'istanbul-beyoglu-galata' ||
          key === 'istanbul-beyoglu-asmalimescit' ||
          key === 'istanbul-beyoglu-taksim'
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
  assert.equal(lMap.get('ctrl-lara-flamingolara-closed').accepted, false);
  assert.ok(lMap.get('ctrl-lara-flamingolara-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(lMap.get('ctrl-lara-schiller-francos-chain').accepted, false);
  assert.ok(lMap.get('ctrl-lara-schiller-francos-chain').reason.includes('chain_or_franchise'));
  assert.equal(lMap.get('ctrl-lara-routeburger-chain').accepted, false);
  assert.ok(lMap.get('ctrl-lara-routeburger-chain').reason.includes('chain_or_franchise'));
  assert.equal(lMap.get('ctrl-lara-sirali-chain').accepted, false);
  assert.ok(lMap.get('ctrl-lara-sirali-chain').reason.includes('chain_or_franchise'));
  assert.equal(lMap.get('ctrl-lara-komas-zerdalilik-outside').accepted, false);
  assert.ok(lMap.get('ctrl-lara-komas-zerdalilik-outside').reason.includes('outside_strict_neighborhood'));
  assert.equal(lMap.get('ctrl-lara-larabalik-genclik-outside').accepted, false);
  assert.ok(lMap.get('ctrl-lara-larabalik-genclik-outside').reason.includes('outside_strict_neighborhood'));

  const kasAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/antalya-kas-merkez.audit.json'), 'utf8')
  );
  const kasMap = new Map(kasAudit.decisions.map((d) => [d.id, d]));
  assert.equal(kasMap.get('ctrl-kas-dominos-chain').accepted, false);
  assert.equal(kasMap.get('ctrl-kas-dominos-chain').reason, 'chain_or_franchise');
  assert.equal(kasMap.get('ctrl-kas-bambi-chain').accepted, false);
  assert.equal(kasMap.get('ctrl-kas-bambi-chain').reason, 'chain_or_franchise');
  assert.equal(kasMap.get('ctrl-kas-nurdos-low').accepted, false);
  assert.equal(kasMap.get('ctrl-kas-nurdos-low').reason, 'chain_or_franchise');
  assert.equal(kasMap.get('ctrl-kas-elia-outside').accepted, false);
  assert.ok(kasMap.get('ctrl-kas-elia-outside').reason.includes('outside_strict_neighborhood'));
  assert.equal(kasMap.get('ctrl-kas-olivegarden-outside').accepted, false);
  assert.ok(kasMap.get('ctrl-kas-olivegarden-outside').reason.includes('outside_strict_neighborhood'));
  assert.equal(kasMap.get('ctrl-kas-krambi-noncoffee').accepted, false);
  assert.ok(kasMap.get('ctrl-kas-krambi-noncoffee').reason.includes('kahve_category_not_coffee_specialist'));

  const kalkanAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/antalya-kalkan-merkez.audit.json'), 'utf8')
  );
  const kalMap = new Map(kalkanAudit.decisions.map((d) => [d.id, d]));
  for (const chainCtrl of [
    'neg-dominos-kalkan',
    'neg-pasaport-pizza-kalkan',
    'neg-moc-coffee-kalkan',
    'neg-levent-borek-kalkan',
    'neg-saliha-sultan-kalkan',
  ]) {
    assert.equal(kalMap.get(chainCtrl).accepted, false);
    assert.equal(kalMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const outCtrl of [
    'neg-zeytin-dali-islamlar',
    'neg-yayla-musa-islamlar',
    'neg-pello-bezirgan',
    'neg-kalimera-bezirgan',
    'neg-house-kitchen-kalamar-outer',
  ]) {
    assert.equal(kalMap.get(outCtrl).accepted, false);
    assert.ok(kalMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const alanyaAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/antalya-alanya-merkez.audit.json'), 'utf8')
  );
  const alMap = new Map(alanyaAudit.decisions.map((d) => [d.id, d]));
  for (const chainCtrl of [
    'ctrl-alanya-dominos-chain',
    'ctrl-alanya-burgerking-chain',
    'ctrl-alanya-papajohns-chain',
    'ctrl-alanya-pasaport-chain',
    'ctrl-alanya-burgeryiyelim-chain',
    'ctrl-alanya-paperroasting-chain',
    'ctrl-alanya-espressolab-mahmutlar-chain',
    'ctrl-alanya-citirim-noncoffee',
  ]) {
    assert.equal(alMap.get(chainCtrl).accepted, false);
    assert.equal(alMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const outCtrl of [
    'ctrl-alanya-enberi-oba-outside',
    'ctrl-alanya-meetncorner-oba-outside',
    'ctrl-alanya-dimcayi-outside',
    'ctrl-alanya-croissant-mahmutlar-outside',
  ]) {
    assert.equal(alMap.get(outCtrl).accepted, false);
    assert.ok(alMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const sideAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/antalya-side.audit.json'), 'utf8')
  );
  const sideMap = new Map(sideAudit.decisions.map((d) => [d.id, d]));
  assert.equal(sideMap.get('ctrl-side-apollon-closed').accepted, false);
  assert.ok(sideMap.get('ctrl-side-apollon-closed').reason.includes('CLOSED_TEMPORARILY'));
  for (const chainCtrl of [
    'ctrl-side-miss-pizza-chain',
    'ctrl-side-burger-king-chain',
    'ctrl-side-mcdonalds-chain',
  ]) {
    assert.equal(sideMap.get(chainCtrl).accepted, false);
    assert.equal(sideMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const outCtrl of [
    'ctrl-side-nehir-balik-outside',
    'ctrl-side-guney-deniz-outside',
    'ctrl-side-la-pizza-outside',
    'ctrl-side-burger-mood-outside',
    'ctrl-side-tas-konak-outside',
    'ctrl-side-cihan-pide-outside',
  ]) {
    assert.equal(sideMap.get(outCtrl).accepted, false);
    assert.ok(sideMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const kemerAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/antalya-kemer.audit.json'), 'utf8')
  );
  const kemerMap = new Map(kemerAudit.decisions.map((d) => [d.id, d]));
  for (const chainCtrl of [
    'ctrl-kemer-dominos-chain',
    'ctrl-kemer-burgerking-chain',
    'ctrl-kemer-mcdonalds-chain',
    'ctrl-kemer-starbucks-chain',
    'ctrl-kemer-mackbear-chain',
    'ctrl-kemer-gilig-chain',
    'ctrl-kemer-tezgah-chain',
    'ctrl-kemer-subway-chain',
  ]) {
    assert.equal(kemerMap.get(chainCtrl).accepted, false);
    assert.equal(kemerMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-kemer-qualista-ayisigi-low',
    'ctrl-kemer-pasakebap-low',
    'ctrl-kemer-doydoy-low',
    'ctrl-kemer-naturelbalik-low',
  ]) {
    assert.equal(kemerMap.get(lowCtrl).accepted, false);
    assert.ok(kemerMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  assert.equal(kemerMap.get('ctrl-kemer-saraypastanesi-noncoffee').accepted, false);
  assert.ok(
    kemerMap.get('ctrl-kemer-saraypastanesi-noncoffee').reason.includes('kahve_category_not_coffee_specialist')
  );
  for (const outCtrl of [
    'ctrl-kemer-harnup-cirali-outside',
    'ctrl-kemer-forellenhof-goynuk-outside',
    'ctrl-kemer-deniz-camyuva-outside',
    'ctrl-kemer-mithat-tekirova-outside',
    'ctrl-kemer-cici-kuzdere-outside',
  ]) {
    assert.equal(kemerMap.get(outCtrl).accepted, false);
    assert.ok(kemerMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const akyakaAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-ula-akyaka.audit.json'), 'utf8')
  );
  const aMap = new Map(akyakaAudit.decisions.map((d) => [d.id, d]));
  assert.equal(aMap.get('ctrl-akyaka-leos-closed').accepted, false);
  assert.ok(aMap.get('ctrl-akyaka-leos-closed').reason.includes('CLOSED_TEMPORARILY'));
  assert.equal(aMap.get('ctrl-akyaka-lightroom-closed').accepted, false);
  assert.ok(aMap.get('ctrl-akyaka-lightroom-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(aMap.get('ctrl-akyaka-pangea-closed').accepted, false);
  assert.ok(aMap.get('ctrl-akyaka-pangea-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(aMap.get('ctrl-akyaka-starbucks-chain').accepted, false);
  assert.equal(aMap.get('ctrl-akyaka-starbucks-chain').reason, 'chain_or_franchise');
  assert.equal(aMap.get('ctrl-akyaka-dominos-chain').accepted, false);
  assert.equal(aMap.get('ctrl-akyaka-dominos-chain').reason, 'chain_or_franchise');
  assert.equal(aMap.get('ctrl-akyaka-huysuz-kahve-purity').accepted, false);
  assert.ok(
    aMap.get('ctrl-akyaka-huysuz-kahve-purity').reason.includes('kahve_category_not_coffee_specialist')
  );
  for (const nonFoodCtrl of ['ctrl-akyaka-akcapinar-otel', 'ctrl-akyaka-loop-hotel']) {
    assert.equal(aMap.get(nonFoodCtrl).accepted, false);
    assert.ok(aMap.get(nonFoodCtrl).reason.includes('invalid_place_type'));
  }
  assert.equal(aMap.get('ctrl-akyaka-backloop-inflation').accepted, false);
  assert.equal(
    aMap.get('ctrl-akyaka-backloop-inflation').reason,
    'suspected_rating_inflation_no_community_proof'
  );
  for (const lowCtrl of [
    'ctrl-akyaka-ayseana-low',
    'ctrl-akyaka-sems-burger-low',
    'ctrl-akyaka-rahat-meyhane-low',
    'ctrl-akyaka-kordon-low',
    'ctrl-akyaka-pisi-breakfast-low',
    'ctrl-akyaka-su-cafe-low',
    'ctrl-akyaka-cennet-low',
    'ctrl-akyaka-sunset-low',
    'ctrl-akyaka-viya-low',
    'ctrl-akyaka-gokova-dinlenme-low',
    'ctrl-akyaka-azmakbasi-low-count',
  ]) {
    assert.equal(aMap.get(lowCtrl).accepted, false);
    assert.ok(aMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of ['ctrl-akyaka-mentese-outside', 'ctrl-akyaka-citlik-collective-outside']) {
    assert.equal(aMap.get(outCtrl).accepted, false);
    assert.ok(aMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const yaniklarAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-fethiye-yaniklar.audit.json'), 'utf8')
  );
  const yaniklarMap = new Map(yaniklarAudit.decisions.map((d) => [d.id, d]));
  assert.equal(yaniklarMap.get('ctrl-yaniklar-harput-dibek').accepted, false);
  assert.equal(yaniklarMap.get('ctrl-yaniklar-harput-dibek').reason, 'chain_or_franchise');
  assert.equal(yaniklarMap.get('ctrl-yaniklar-kerpic-evler').accepted, false);
  assert.equal(yaniklarMap.get('ctrl-yaniklar-kerpic-evler').reason, 'insufficient_independent_sources');
  for (const lowCtrl of [
    'ctrl-yaniklar-rei',
    'ctrl-yaniklar-misa',
    'ctrl-yaniklar-morr',
    'ctrl-yaniklar-soncare',
    'ctrl-yaniklar-kafi',
  ]) {
    assert.equal(yaniklarMap.get(lowCtrl).accepted, false);
    assert.ok(yaniklarMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const typeCtrl of [
    'ctrl-yaniklar-yesil-vadi',
    'ctrl-yaniklar-suna-village',
    'ctrl-yaniklar-pastoral-vadi',
    'ctrl-yaniklar-yonca-lodge',
  ]) {
    assert.equal(yaniklarMap.get(typeCtrl).accepted, false);
    assert.ok(yaniklarMap.get(typeCtrl).reason.includes('invalid_place_type'));
  }
  for (const outCtrl of [
    'ctrl-yaniklar-asmali-bahce',
    'ctrl-yaniklar-yoruk-muzesi',
    'ctrl-yaniklar-ciftlik-pisiricisi',
    'ctrl-yaniklar-soner-inlice',
    'ctrl-yaniklar-zoi-fish',
  ]) {
    assert.equal(yaniklarMap.get(outCtrl).accepted, false);
    assert.ok(yaniklarMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const gocekAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-fethiye-gocek.audit.json'), 'utf8')
  );
  const gocekMap = new Map(gocekAudit.decisions.map((d) => [d.id, d]));
  for (const closedCtrl of ['ctrl-gocek-guverte-closed', 'ctrl-gocek-qlounge-closed']) {
    assert.equal(gocekMap.get(closedCtrl).accepted, false);
    assert.ok(gocekMap.get(closedCtrl).reason.includes('CLOSED_TEMPORARILY'));
  }
  for (const chainCtrl of [
    'ctrl-gocek-pizzalocale-chain',
    'ctrl-gocek-mcdonalds-chain',
    'ctrl-gocek-moc-chain',
    'ctrl-gocek-nero-chain',
    'ctrl-gocek-starbucks-chain',
    'ctrl-gocek-kahvedunyasi-chain',
    'ctrl-gocek-makemejoi-chain',
  ]) {
    assert.equal(gocekMap.get(chainCtrl).accepted, false);
    assert.equal(gocekMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-gocek-westcafe-low',
    'ctrl-gocek-damak-low',
    'ctrl-gocek-ozcan-low',
    'ctrl-gocek-lotis-low',
    'ctrl-gocek-epocafe-low',
  ]) {
    assert.equal(gocekMap.get(lowCtrl).accepted, false);
    assert.ok(gocekMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-gocek-soner-inlice-outside',
    'ctrl-gocek-ebegumeci-inlice-outside',
    'ctrl-gocek-gobun-dalaman-outside',
    'ctrl-gocek-dalamanbalik-outside',
    'ctrl-gocek-guz-gokceovacik-outside',
  ]) {
    assert.equal(gocekMap.get(outCtrl).accepted, false);
    assert.ok(gocekMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const fethiyeMerkezAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-fethiye-merkez.audit.json'), 'utf8')
  );
  const fethiyeMerkezMap = new Map(fethiyeMerkezAudit.decisions.map((d) => [d.id, d]));
  assert.equal(fethiyeMerkezMap.get('neg-mozaik-bahce-closed').accepted, false);
  assert.ok(fethiyeMerkezMap.get('neg-mozaik-bahce-closed').reason.includes('CLOSED_TEMPORARILY'));
  assert.equal(fethiyeMerkezMap.get('neg-karamel-pastane-kahve').accepted, false);
  assert.ok(
    fethiyeMerkezMap.get('neg-karamel-pastane-kahve').reason.includes('kahve_category_not_coffee_specialist')
  );
  for (const chainCtrl of [
    'neg-coffee-de-madrid',
    'neg-goodeer-coffee',
    'neg-starbucks-carsi',
    'neg-burger-yiyelim',
    'neg-burger-king-ataturk',
    'neg-pizzabulls-fethiye',
    'neg-dominos-akarca',
    'neg-little-caesars-akarca',
  ]) {
    assert.equal(fethiyeMerkezMap.get(chainCtrl).accepted, false);
    assert.equal(fethiyeMerkezMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'neg-hilmi-cumhuriyet',
    'neg-girida-port',
    'neg-trattoria-di-kukina',
    'neg-bogazici-tuzla',
    'neg-address-restaurant',
    'neg-limon-h2o',
  ]) {
    assert.equal(fethiyeMerkezMap.get(lowCtrl).accepted, false);
    assert.ok(fethiyeMerkezMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'neg-doc-coffee-foca',
    'neg-efe-firin-patlangic',
    'neg-pan-kayakoy',
    'neg-bella-gusto-oludeniz',
  ]) {
    assert.equal(fethiyeMerkezMap.get(outCtrl).accepted, false);
    assert.ok(fethiyeMerkezMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const calisAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-fethiye-calis.audit.json'), 'utf8')
  );
  const calisMap = new Map(calisAudit.decisions.map((d) => [d.id, d]));
  assert.equal(calisMap.get('ctrl-sundia-hotel-calis').accepted, false);
  assert.ok(calisMap.get('ctrl-sundia-hotel-calis').reason.includes('invalid_place_type'));
  for (const chainCtrl of [
    'ctrl-gua-coffee-calis',
    'ctrl-federico-calis',
    'ctrl-understone-calis',
    'ctrl-mado-calis',
    'ctrl-panama-coffee-calis',
    'ctrl-burger-home-calis',
    'ctrl-terra-pizza-akarca',
    'ctrl-pasaport-pizza-akarca',
    'ctrl-burger-king-akarca',
  ]) {
    assert.equal(calisMap.get(chainCtrl).accepted, false);
    assert.equal(calisMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-pizza-calisto-calis',
    'ctrl-allora-pizza-calis',
    'ctrl-dodo-coffee-calis',
    'ctrl-babafirin-calis',
    'ctrl-kerimoglu-yoruk-calis',
    'ctrl-sora-sushi-calis',
    'ctrl-ada-balik-calis',
    'ctrl-dogan-balik-calis',
    'ctrl-calis-indian-calis',
  ]) {
    assert.equal(calisMap.get(lowCtrl).accepted, false);
    assert.ok(calisMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-sushi-station-calis',
    'ctrl-papelli-akarca',
    'ctrl-zentara-ciftlik',
    'ctrl-rodos-balikcisi-yeni',
    'ctrl-ada-sovalye',
    'ctrl-beyoglu-pide-karagedik',
    'ctrl-cervos-akarca',
  ]) {
    assert.equal(calisMap.get(outCtrl).accepted, false);
    assert.ok(calisMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const oludenizAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-fethiye-oludeniz.audit.json'), 'utf8')
  );
  const oludenizMap = new Map(oludenizAudit.decisions.map((d) => [d.id, d]));
  assert.equal(oludenizMap.get('ctrl-jade-residence-hotel-oludeniz').accepted, false);
  assert.ok(oludenizMap.get('ctrl-jade-residence-hotel-oludeniz').reason.includes('invalid_place_type'));
  assert.equal(oludenizMap.get('ctrl-oludeniz-sahil-park').accepted, false);
  assert.ok(oludenizMap.get('ctrl-oludeniz-sahil-park').reason.includes('invalid_place_type'));
  assert.equal(oludenizMap.get('ctrl-sea-horse-hotel-oludeniz').accepted, false);
  for (const chainCtrl of ['ctrl-pellini-oludeniz', 'ctrl-starbucks-oludeniz', 'ctrl-dominos-hisaronu']) {
    assert.equal(oludenizMap.get(chainCtrl).accepted, false);
    assert.equal(oludenizMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-bella-gusto-oludeniz',
    'ctrl-montebello-kitchen-oludeniz',
    'ctrl-mimoza-cafe-oludeniz',
    'ctrl-sey-beach-oludeniz',
    'ctrl-captain-hook-oludeniz',
    'ctrl-paradise-beach-oludeniz',
    'ctrl-ottoman-oludeniz',
    'ctrl-bamboo-oludeniz',
    'ctrl-sea-horse-restoran-oludeniz',
  ]) {
    assert.equal(oludenizMap.get(lowCtrl).accepted, false);
    assert.ok(oludenizMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-cake-coffee-ovacik',
    'ctrl-dominic-hisaronu',
    'ctrl-loca-luna-hisaronu',
    'ctrl-shiraz-ovacik',
    'ctrl-karizma-ovacik',
    'ctrl-narli-bahce-ovacik',
    'ctrl-qaya-lounge-kayakoy',
    'ctrl-balbura-faralya',
  ]) {
    assert.equal(oludenizMap.get(outCtrl).accepted, false);
    assert.ok(oludenizMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const bodrumAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-merkez.audit.json'), 'utf8')
  );
  const bodrumMap = new Map(bodrumAudit.decisions.map((d) => [d.id, d]));
  assert.equal(bodrumMap.get('ctrl-bodrum-iki-sandal-closed').accepted, false);
  assert.ok(bodrumMap.get('ctrl-bodrum-iki-sandal-closed').reason.includes('CLOSED_PERMANENTLY'));
  assert.equal(bodrumMap.get('ctrl-bodrum-kocadon-hotel').accepted, false);
  assert.ok(bodrumMap.get('ctrl-bodrum-kocadon-hotel').reason.includes('invalid_place_type'));
  assert.equal(bodrumMap.get('ctrl-bodrum-marina-nonfood').accepted, false);
  assert.ok(bodrumMap.get('ctrl-bodrum-marina-nonfood').reason.includes('invalid_place_type'));
  for (const chainCtrl of [
    'ctrl-bodrum-starbucks-tepecik',
    'ctrl-bodrum-kahve-dunyasi-marina',
    'ctrl-bodrum-espressolab-marina',
    'ctrl-bodrum-caffe-nero-marina',
    'ctrl-bodrum-terra-pizza-carsi',
    'ctrl-bodrum-coffee-lab',
    'ctrl-bodrum-kaleici-muhallebicisi',
    'ctrl-bodrum-divan-pastane',
    'ctrl-bodrum-so-big-gastro-pub',
  ]) {
    assert.equal(bodrumMap.get(chainCtrl).accepted, false);
    assert.equal(bodrumMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-bodrum-sunger-pizza',
    'ctrl-bodrum-benjamin-burger',
    'ctrl-bodrum-otantik-ocakbasi',
    'ctrl-bodrum-memedof-below-threshold',
  ]) {
    assert.equal(bodrumMap.get(lowCtrl).accepted, false);
    assert.ok(bodrumMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-bodrum-cheers-gumbet-outside',
    'ctrl-bodrum-kuytu-bahce-bitez-outside',
    'ctrl-bodrum-crudo-konacik-outside',
    'ctrl-bodrum-industry-cumhuriyet-outside',
    'ctrl-bodrum-pixel-cevat-sakir-outside',
  ]) {
    assert.equal(bodrumMap.get(outCtrl).accepted, false);
    assert.ok(bodrumMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const yalikavakAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-yalikavak.audit.json'), 'utf8')
  );
  const yalikavakMap = new Map(yalikavakAudit.decisions.map((d) => [d.id, d]));
  for (const closedCtrl of [
    'ctrl-zuma-bodrum-yalikavak',
    'ctrl-novikov-bodrum-yalikavak',
    'ctrl-nusret-yalikavak',
    'ctrl-bagatelle-bodrum-yalikavak',
  ]) {
    assert.equal(yalikavakMap.get(closedCtrl).accepted, false);
    assert.ok(yalikavakMap.get(closedCtrl).reason.includes('CLOSED_TEMPORARILY'));
  }
  for (const nonFoodCtrl of [
    'ctrl-yalikavak-marina',
    'ctrl-yaz-yalikavak-hotel',
    'ctrl-marina-garden-hotel-yalikavak',
    'ctrl-gunay-restaurant-yalikavak',
  ]) {
    assert.equal(yalikavakMap.get(nonFoodCtrl).accepted, false);
    assert.ok(yalikavakMap.get(nonFoodCtrl).reason.includes('invalid_place_type'));
  }
  for (const chainCtrl of [
    'ctrl-starbucks-yalikavak',
    'ctrl-meet-lab-yalikavak',
    'ctrl-blak-coffee-yalikavak',
    'ctrl-nespresso-yalikavak',
    'ctrl-huqqa-yalikavak',
    'ctrl-bodrum-manti-yalikavak',
    'ctrl-mado-yalikavak',
    'ctrl-godiva-yalikavak',
    'ctrl-five-oclock-yalikavak',
    'ctrl-mua-gelatieri-yalikavak',
    'ctrl-gurkan-sef-yalikavak',
  ]) {
    assert.equal(yalikavakMap.get(chainCtrl).accepted, false);
    assert.equal(yalikavakMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  assert.equal(yalikavakMap.get('ctrl-cafe-di-dolce-yalikavak').accepted, false);
  assert.ok(
    yalikavakMap.get('ctrl-cafe-di-dolce-yalikavak').reason.includes('kahve_category_not_coffee_specialist')
  );
  for (const lowCtrl of [
    'ctrl-sait-yalikavak',
    'ctrl-asmali-cardak-yalikavak',
    'ctrl-kavakli-koftecisi-yalikavak',
    'ctrl-havva-ana-yalikavak',
    'ctrl-bir-baska-yalikavak',
  ]) {
    assert.equal(yalikavakMap.get(lowCtrl).accepted, false);
    assert.ok(yalikavakMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-jour-gundogan',
    'ctrl-atilay-turkbuku',
    'ctrl-kozalak-dagbelen',
    'ctrl-irme-dagbelen',
    'ctrl-furnos-koyunbaba',
    'ctrl-zeytin-alti-geris',
    'ctrl-iz-bodrum-muskebi',
  ]) {
    assert.equal(yalikavakMap.get(outCtrl).accepted, false);
    assert.ok(yalikavakMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const gumuslukAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-gumusluk.audit.json'), 'utf8')
  );
  const gumuslukMap = new Map(gumuslukAudit.decisions.map((d) => [d.id, d]));
  assert.equal(gumuslukMap.get('ctrl-limon-gumusluk').accepted, false);
  assert.ok(gumuslukMap.get('ctrl-limon-gumusluk').reason.includes('CLOSED_TEMPORARILY'));
  assert.equal(gumuslukMap.get('ctrl-kofteci-kemal-gumusluk').accepted, false);
  assert.ok(gumuslukMap.get('ctrl-kofteci-kemal-gumusluk').reason.includes('invalid_place_type'));
  assert.equal(gumuslukMap.get('ctrl-gumusluk-firin-pastane').accepted, false);
  assert.ok(
    gumuslukMap.get('ctrl-gumusluk-firin-pastane').reason.includes('kahve_category_not_coffee_specialist')
  );
  for (const chainCtrl of [
    'ctrl-starbucks-turgutreis',
    'ctrl-bigchefs-turgutreis',
    'ctrl-battalbey-gumusluk',
  ]) {
    assert.equal(gumuslukMap.get(chainCtrl).accepted, false);
    assert.equal(gumuslukMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-mimoza-gumusluk',
    'ctrl-melengec-gumusluk',
    'ctrl-karafaki-37-gumusluk',
    'ctrl-tuz-duman-gumusluk',
    'ctrl-club-gumusluk',
    'ctrl-cilli-pizza-gumusluk',
  ]) {
    assert.equal(gumuslukMap.get(lowCtrl).accepted, false);
    assert.ok(gumuslukMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-zest-burger-bahcelievler',
    'ctrl-degirmen-turgutreis',
    'ctrl-zerde-peksimet',
    'ctrl-zeytin-alti-geris',
  ]) {
    assert.equal(gumuslukMap.get(outCtrl).accepted, false);
    assert.ok(gumuslukMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const turkbukuAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-turkbuku.audit.json'), 'utf8')
  );
  const turkbukuMap = new Map(turkbukuAudit.decisions.map((d) => [d.id, d]));
  for (const nonFoodCtrl of [
    'ctrl-turkbuku-maxx-royal',
    'ctrl-turkbuku-club-turkbuku',
    'ctrl-turkbuku-cennet-koyu',
    'ctrl-turkbuku-the-spa-mandarin',
  ]) {
    assert.equal(turkbukuMap.get(nonFoodCtrl).accepted, false);
    assert.ok(turkbukuMap.get(nonFoodCtrl).reason.includes('invalid_place_type'));
  }
  for (const chainCtrl of [
    'ctrl-turkbuku-hakkasan',
    'ctrl-turkbuku-lokanta-divan',
    'ctrl-turkbuku-vakko-mare',
    'ctrl-turkbuku-gaia',
    'ctrl-turkbuku-firin-bi-tatli-tuzlu',
    'ctrl-turkbuku-firin-bi-tatli-tuzlu-gol',
    'ctrl-turkbuku-starbucks-torba-outside',
  ]) {
    assert.equal(turkbukuMap.get(chainCtrl).accepted, false);
    assert.equal(turkbukuMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-turkbuku-paper-moon',
    'ctrl-turkbuku-atilay',
    'ctrl-turkbuku-miam',
    'ctrl-turkbuku-macakizi',
    'ctrl-turkbuku-daze',
    'ctrl-turkbuku-tufan-milat',
    'ctrl-turkbuku-sofra-cennet',
  ]) {
    assert.equal(turkbukuMap.get(lowCtrl).accepted, false);
    assert.ok(turkbukuMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-turkbuku-jour-gundogan-outside',
    'ctrl-turkbuku-bodrum-hayat-farilya-outside',
    'ctrl-turkbuku-torba-cafe-outside',
    'ctrl-turkbuku-garos',
  ]) {
    assert.equal(turkbukuMap.get(outCtrl).accepted, false);
    assert.ok(turkbukuMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const bitezAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-bitez.audit.json'), 'utf8')
  );
  const bitezMap = new Map(bitezAudit.decisions.map((d) => [d.id, d]));
  assert.equal(bitezMap.get('ctrl-bitez-deniz-hotel').accepted, false);
  assert.ok(bitezMap.get('ctrl-bitez-deniz-hotel').reason.includes('invalid_place_type'));
  assert.equal(bitezMap.get('ctrl-bitez-oslo').accepted, false);
  assert.ok(bitezMap.get('ctrl-bitez-oslo').reason.includes('recent_quality_degradation'));
  for (const chainCtrl of [
    'ctrl-bitez-dondurmacisi',
    'ctrl-bitez-bodrum-dondurmacisi',
    'ctrl-bitez-eleos',
    'ctrl-bitez-pasaport-pizza',
    'ctrl-bitez-david-people',
    'ctrl-bitez-starbucks',
    'ctrl-bitez-levent-borek',
    'ctrl-bitez-pizza-locale',
    'ctrl-bitez-cookshop',
  ]) {
    assert.equal(bitezMap.get(chainCtrl).accepted, false);
    assert.equal(bitezMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-bitez-bagarasi',
    'ctrl-bitez-balikci-ismet',
    'ctrl-bitez-verona',
    'ctrl-bitez-gumsal',
    'ctrl-bitez-kurul',
    'ctrl-bitez-bitz-lounge',
    'ctrl-bitez-pescador',
    'ctrl-bitez-almera',
    'ctrl-bitez-koftecisi',
    'ctrl-bitez-rascal-pizza',
  ]) {
    assert.equal(bitezMap.get(lowCtrl).accepted, false);
    assert.ok(bitezMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-bitez-havandan-konacik-outside',
    'ctrl-bitez-hey-joe-konacik-outside',
    'ctrl-bitez-vula-konacik-outside',
    'ctrl-bitez-kruvasanci-outside',
    'ctrl-bitez-cheers-gumbet-outside',
    'ctrl-bitez-madu-gumbet-outside',
    'ctrl-bitez-suzgec-muskebi-outside',
  ]) {
    assert.equal(bitezMap.get(outCtrl).accepted, false);
    assert.ok(bitezMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const turgutreisAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-turgutreis.audit.json'), 'utf8')
  );
  const turgutreisMap = new Map(turgutreisAudit.decisions.map((d) => [d.id, d]));
  for (const nonFoodCtrl of ['ctrl-turgutreis-d-marin', 'ctrl-turgutreis-peksimet-otel']) {
    assert.equal(turgutreisMap.get(nonFoodCtrl).accepted, false);
    assert.ok(turgutreisMap.get(nonFoodCtrl).reason.includes('invalid_place_type'));
  }
  assert.equal(turgutreisMap.get('ctrl-turgutreis-izze-coffee').accepted, false);
  assert.equal(
    turgutreisMap.get('ctrl-turgutreis-izze-coffee').reason,
    'suspected_rating_inflation_no_community_proof'
  );
  for (const chainCtrl of [
    'ctrl-turgutreis-big-chefs',
    'ctrl-turgutreis-starbucks',
    'ctrl-turgutreis-kahve-dunyasi',
    'ctrl-turgutreis-caffe-nero',
    'ctrl-turgutreis-dominos',
    'ctrl-turgutreis-endless-pizza',
    'ctrl-turgutreis-burger-king',
    'ctrl-turgutreis-mcdonalds',
    'ctrl-turgutreis-bitez-dondurma',
    'ctrl-turgutreis-bodrum-ekleristan',
  ]) {
    assert.equal(turgutreisMap.get(chainCtrl).accepted, false);
    assert.equal(turgutreisMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-turgutreis-sunger-pizza',
    'ctrl-turgutreis-sold-out-hamburger',
    'ctrl-turgutreis-diva-pastanesi',
    'ctrl-turgutreis-ana-ogul',
    'ctrl-turgutreis-hulyanin-yeri',
    'ctrl-turgutreis-yi-gec-balik',
    'ctrl-turgutreis-sunset-maksim',
    'ctrl-turgutreis-kahvalti-16',
  ]) {
    assert.equal(turgutreisMap.get(lowCtrl).accepted, false);
    assert.ok(turgutreisMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-turgutreis-cotto-kadikalesi-outside',
    'ctrl-turgutreis-zerde-peksimet-outside',
    'ctrl-turgutreis-yali-peksimet-outside',
    'ctrl-turgutreis-marea-akyarlar-outside',
    'ctrl-turgutreis-burger-house-akyarlar-outside',
    'ctrl-turgutreis-geremeli-islamhaneleri-outside',
    'ctrl-turgutreis-jura-iskele-outside',
    'ctrl-turgutreis-monachello-outside',
  ]) {
    assert.equal(turgutreisMap.get(outCtrl).accepted, false);
    assert.ok(turgutreisMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const ortakentYahsiAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-ortakent-yahsi.audit.json'), 'utf8')
  );
  const oyMap = new Map(ortakentYahsiAudit.decisions.map((d) => [d.id, d]));
  for (const nonFoodCtrl of [
    'ctrl-oy-midtown-avm',
    'ctrl-oy-kefi-beach-hotel',
    'ctrl-oy-marin-beach-otel',
    'ctrl-oy-yahsi-yalisi',
  ]) {
    assert.equal(oyMap.get(nonFoodCtrl).accepted, false);
    assert.ok(oyMap.get(nonFoodCtrl).reason.includes('invalid_place_type'));
  }
  assert.equal(oyMap.get('ctrl-oy-mernas-bahce').accepted, false);
  assert.equal(oyMap.get('ctrl-oy-mernas-bahce').reason, 'suspected_rating_inflation_no_community_proof');
  for (const chainCtrl of [
    'ctrl-oy-big-chefs',
    'ctrl-oy-starbucks',
    'ctrl-oy-caffe-nero',
    'ctrl-oy-kahve-dunyasi',
    'ctrl-oy-costa-coffee',
    'ctrl-oy-bursa-kebap-evi',
    'ctrl-oy-chinese-inn',
  ]) {
    assert.equal(oyMap.get(chainCtrl).accepted, false);
    assert.equal(oyMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-oy-suzgec',
    'ctrl-oy-tuzz',
    'ctrl-oy-sirin-bahce',
    'ctrl-oy-kosem-balik',
    'ctrl-oy-la-bohemme',
    'ctrl-oy-ortakent-lokantasi',
    'ctrl-oy-hortma-beach',
    'ctrl-oy-yuzgec',
    'ctrl-oy-ayana-balik',
    'ctrl-oy-yahsi-bati-rest',
  ]) {
    assert.equal(oyMap.get(lowCtrl).accepted, false);
    assert.ok(oyMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-oy-crudo-konacik-outside',
    'ctrl-oy-geremeli-islamhaneleri-outside',
    'ctrl-oy-irme-dagbelen-outside',
    'ctrl-oy-mid-burger-bitez-outside',
  ]) {
    assert.equal(oyMap.get(outCtrl).accepted, false);
    assert.ok(oyMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const gundoganAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-gundogan.audit.json'), 'utf8')
  );
  const gdMap = new Map(gundoganAudit.decisions.map((d) => [d.id, d]));
  for (const nonFoodCtrl of [
    'ctrl-gundogan-costa-farilya-hotel',
    'ctrl-gundogan-halk-plaji',
    'ctrl-gundogan-via-farilya-hotel',
    'ctrl-gundogan-kucukbuk-sahil',
    'ctrl-gundogan-balikci-barinagi',
    'ctrl-gundogan-club-turkbuku-outside',
  ]) {
    assert.equal(gdMap.get(nonFoodCtrl).accepted, false);
    assert.ok(gdMap.get(nonFoodCtrl).reason.includes('invalid_place_type'));
  }
  assert.equal(gdMap.get('ctrl-gundogan-murgarita-pizza').accepted, false);
  assert.equal(
    gdMap.get('ctrl-gundogan-murgarita-pizza').reason,
    'suspected_rating_inflation_no_community_proof'
  );
  for (const chainCtrl of ['ctrl-gundogan-bitez-dondurma', 'ctrl-gundogan-royal-firin']) {
    assert.equal(gdMap.get(chainCtrl).accepted, false);
    assert.equal(gdMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const lowCtrl of [
    'ctrl-gundogan-midyeci-sehmus-usta',
    'ctrl-gundogan-sail-loft',
    'ctrl-gundogan-reana-restaurant',
    'ctrl-gundogan-quzine-kahvalti',
    'ctrl-gundogan-terzi-mustafa',
    'ctrl-gundogan-koroglu-ocakbasi',
    'ctrl-gundogan-mehmet-okaliptus',
    'ctrl-gundogan-valentino-beach-cafe',
    'ctrl-gundogan-dandik-restaurant',
    'ctrl-gundogan-dozo-beach',
    'ctrl-gundogan-moon-burger',
    'ctrl-gundogan-gambille-gurme',
    'ctrl-gundogan-balikcilar-kahvesi',
  ]) {
    assert.equal(gdMap.get(lowCtrl).accepted, false);
    assert.ok(gdMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-gundogan-safiye-yalikavak-outside',
    'ctrl-gundogan-mezra-yalikavak-outside',
    'ctrl-gundogan-kahraman-dirmil-outside',
    'ctrl-gundogan-azur-dirmil-outside',
    'ctrl-gundogan-farina-turkbuku-outside',
    'ctrl-gundogan-pizzerie-ce-turkbuku-outside',
    'ctrl-gundogan-fuat-usta-turkbuku-outside',
  ]) {
    assert.equal(gdMap.get(outCtrl).accepted, false);
    assert.ok(gdMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const gumbetAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-gumbet.audit.json'), 'utf8')
  );
  const gmMap = new Map(gumbetAudit.decisions.map((d) => [d.id, d]));
  assert.equal(gmMap.get('ctrl-gumbet-sahil-invalid-type').accepted, false);
  assert.ok(gmMap.get('ctrl-gumbet-sahil-invalid-type').reason.includes('invalid_place_type'));
  assert.equal(gmMap.get('ctrl-gumbet-madu-inflation').accepted, false);
  assert.equal(
    gmMap.get('ctrl-gumbet-madu-inflation').reason,
    'suspected_rating_inflation_no_community_proof'
  );
  for (const chainCtrl of [
    'ctrl-gumbet-burger-king',
    'ctrl-gumbet-mcdonalds',
    'ctrl-gumbet-little-caesars',
    'ctrl-gumbet-dominos',
    'ctrl-gumbet-royal-pastanesi',
    'ctrl-gumbet-pizza-locale',
    'ctrl-gumbet-starbucks-oasis',
    'ctrl-gumbet-cookshop',
    'ctrl-gumbet-maharet-manti-chain',
    'ctrl-gumbet-oses-cigkofte-chain',
  ]) {
    assert.equal(gmMap.get(chainCtrl).accepted, false);
    assert.equal(gmMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const degCtrl of [
    'ctrl-gumbet-family-door-karaoke',
    'ctrl-gumbet-cheers-upsell',
    'ctrl-gumbet-bamboo-house-adisyon',
    'ctrl-gumbet-landscape-bistro-complaint',
  ]) {
    assert.equal(gmMap.get(degCtrl).accepted, false);
    assert.ok(gmMap.get(degCtrl).reason.includes('recent_quality_degradation'));
  }
  for (const lowCtrl of [
    'ctrl-gumbet-konya-nergiz-low',
    'ctrl-gumbet-doner-low',
    'ctrl-gumbet-ates-doner-low',
    'ctrl-gumbet-alora-beach-low',
    'ctrl-gumbet-bonita-lounge-low',
    'ctrl-gumbet-ozukara-low',
    'ctrl-gumbet-burnger-low',
    'ctrl-gumbet-gozleme-low-count',
    'ctrl-gumbet-cali-kebap-low-count',
  ]) {
    assert.equal(gmMap.get(lowCtrl).accepted, false);
    assert.ok(gmMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-gumbet-bosstans-inflation',
    'ctrl-gumbet-odd-burger-bitez-outside',
    'ctrl-gumbet-fika-bitez-outside',
    'ctrl-gumbet-rascal-bitez-excludebbox',
    'ctrl-gumbet-rubys-eskicesme-outside',
    'ctrl-gumbet-chives-eskicesme-outside',
    'ctrl-gumbet-kaya-balik-eskicesme-outside',
    'ctrl-gumbet-basar-balik-yenikoy-outside',
    'ctrl-gumbet-ile-kitabevi-cumhuriyet-outside',
  ]) {
    assert.equal(gmMap.get(outCtrl).accepted, false);
    assert.ok(gmMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const torbaAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-torba.audit.json'), 'utf8')
  );
  const trbMap = new Map(torbaAudit.decisions.map((d) => [d.id, d]));
  for (const closedCtrl of [
    'ctrl-torba-mehmetin-yeri',
    'ctrl-torba-doner-kebap-ev-yemekleri',
  ]) {
    assert.equal(trbMap.get(closedCtrl).accepted, false);
    assert.ok(trbMap.get(closedCtrl).reason.includes('not_operational'));
  }
  for (const nonFoodCtrl of [
    'ctrl-torba-susona-bodrum-hotel',
    'ctrl-torba-voyage-torba-hotel',
    'ctrl-torba-hyde-bodrum-hotel',
    'ctrl-torba-hotel-zeytinada',
    'ctrl-torba-bodrum-shop-and-go',
  ]) {
    assert.equal(trbMap.get(nonFoodCtrl).accepted, false);
    assert.ok(trbMap.get(nonFoodCtrl).reason.includes('invalid_place_type'));
  }
  for (const chainCtrl of [
    'ctrl-torba-starbucks',
    'ctrl-torba-big-chefs-yahsi',
    'ctrl-torba-karya-firin',
  ]) {
    assert.equal(trbMap.get(chainCtrl).accepted, false);
    assert.equal(trbMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  assert.equal(trbMap.get('ctrl-torba-unlu-mamulleri').accepted, false);
  assert.ok(
    trbMap.get('ctrl-torba-unlu-mamulleri').reason.includes('kahve_category_not_coffee_specialist')
  );
  assert.equal(trbMap.get('ctrl-torba-belediye-kafe-dup').accepted, false);
  assert.equal(
    trbMap.get('ctrl-torba-belediye-kafe-dup').reason,
    'insufficient_independent_sources'
  );
  for (const lowCtrl of [
    'ctrl-torba-hotel-torbahan',
    'ctrl-torba-plaji',
    'ctrl-torba-suyah-bodrum',
    'ctrl-torba-mercan-restaurant-beach',
    'ctrl-torba-sanat-evi-restoran',
    'ctrl-torba-sanat-evi-pin2',
    'ctrl-torba-karya-lounge-doner',
    'ctrl-torba-dalli-restaurant',
    'ctrl-torba-el-papi-usuluk',
  ]) {
    assert.equal(trbMap.get(lowCtrl).accepted, false);
    assert.ok(trbMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-torba-paper-moon-golkoy-outside',
    'ctrl-torba-kaana-gundogan-outside',
    'ctrl-torba-egede-maya-carsi-outside',
    'ctrl-torba-sultan-bahce-umurca-outside',
    'ctrl-torba-zeytinli-bahce-ciftlik-outside',
  ]) {
    assert.equal(trbMap.get(outCtrl).accepted, false);
    assert.ok(trbMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const akyarlarAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-bodrum-akyarlar.audit.json'), 'utf8')
  );
  const akyMap = new Map(akyarlarAudit.decisions.map((d) => [d.id, d]));
  for (const closedCtrl of [
    'ctrl-akyarlar-tipsy-crab-closed',
    'ctrl-akyarlar-buselik-anthaven-closed',
  ]) {
    assert.equal(akyMap.get(closedCtrl).accepted, false);
    assert.ok(akyMap.get(closedCtrl).reason.includes('not_operational'));
  }
  for (const chainCtrl of [
    'ctrl-akyarlar-magnolia-shop-chain',
    'ctrl-akyarlar-kahve-dunyasi-chain',
    'ctrl-akyarlar-bedri-usta-chain',
    'ctrl-akyarlar-big-chefs-chain',
    'ctrl-akyarlar-caytaze-chain',
  ]) {
    assert.equal(akyMap.get(chainCtrl).accepted, false);
    assert.equal(akyMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const nonFoodCtrl of [
    'ctrl-akyarlar-radisson-hotel',
    'ctrl-akyarlar-anthaven-carsi-mall',
    'ctrl-akyarlar-anthaven-service',
    'ctrl-akyarlar-adacik-attraction',
    'ctrl-akyarlar-sahil-evleri',
  ]) {
    assert.equal(akyMap.get(nonFoodCtrl).accepted, false);
    assert.ok(akyMap.get(nonFoodCtrl).reason.includes('invalid_place_type'));
  }
  assert.equal(akyMap.get('ctrl-akyarlar-makbush-kahve-purity').accepted, false);
  assert.ok(
    akyMap
      .get('ctrl-akyarlar-makbush-kahve-purity')
      .reason.includes('kahve_category_not_coffee_specialist')
  );
  for (const infCtrl of [
    'ctrl-akyarlar-kayikhan-inflation',
    'ctrl-akyarlar-castello-inflation',
    'ctrl-akyarlar-asia-hotel-inflation',
  ]) {
    assert.equal(akyMap.get(infCtrl).accepted, false);
    assert.equal(akyMap.get(infCtrl).reason, 'suspected_rating_inflation_no_community_proof');
  }
  for (const lowCtrl of [
    'ctrl-akyarlar-aspat-hotel-rest',
    'ctrl-akyarlar-kardesler-motel',
    'ctrl-akyarlar-karabatak-low',
    'ctrl-akyarlar-parilti-low',
    'ctrl-akyarlar-sedir-low',
    'ctrl-akyarlar-kadikoyluler-low',
    'ctrl-akyarlar-karaincir-motel-low',
    'ctrl-akyarlar-pareo-beach-low',
    'ctrl-akyarlar-bal-mahmut-low',
    'ctrl-akyarlar-moonlight-low',
    'ctrl-akyarlar-belediye-cafe-low',
    'ctrl-akyarlar-fener-doner-low',
    'ctrl-akyarlar-ozbalci-pide-low',
    'ctrl-akyarlar-katre-low-count',
    'ctrl-akyarlar-delice-bahce-low-count',
    'ctrl-akyarlar-ninetta-low-count',
  ]) {
    assert.equal(akyMap.get(lowCtrl).accepted, false);
    assert.ok(akyMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-akyarlar-jura-turgutreis-outside',
    'ctrl-akyarlar-monachello-turgutreis-outside',
    'ctrl-akyarlar-costa-sueno-turgutreis-outside',
    'ctrl-akyarlar-caffeine-turgutreis-outside',
    'ctrl-akyarlar-balikcinin-yeri-yahsi-outside',
    'ctrl-akyarlar-sakalli-bahcelievler-outside',
  ]) {
    assert.equal(akyMap.get(outCtrl).accepted, false);
    assert.ok(akyMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const marmarisAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-marmaris-merkez.audit.json'), 'utf8')
  );
  const marmMap = new Map(marmarisAudit.decisions.map((d) => [d.id, d]));
  for (const chainCtrl of [
    'ctrl-marmaris-terra-pizza-chain',
    'ctrl-marmaris-burger-king-chain',
    'ctrl-marmaris-roberts-coffee-chain',
    'ctrl-marmaris-pizza-locale-chain',
    'ctrl-marmaris-burger-yiyelim-chain',
    'ctrl-marmaris-dominos-chain',
    'ctrl-marmaris-obadan-chain',
    'ctrl-marmaris-kircicegi-chain',
    'ctrl-marmaris-tekin-usta-chain',
    'ctrl-marmaris-meliha-hanim-chain',
    'ctrl-marmaris-books-coffee-chain',
  ]) {
    assert.equal(marmMap.get(chainCtrl).accepted, false);
    assert.equal(marmMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const nonFoodCtrl of [
    'ctrl-marmaris-kale-attraction',
    'ctrl-marmaris-netsel-marina',
    'ctrl-marmaris-netsel-avm',
  ]) {
    assert.equal(marmMap.get(nonFoodCtrl).accepted, false);
    assert.ok(marmMap.get(nonFoodCtrl).reason.includes('invalid_place_type'));
  }
  for (const purityCtrl of [
    'ctrl-marmaris-marvella-kahve-purity',
    'ctrl-marmaris-sefler-kahve-purity',
  ]) {
    assert.equal(marmMap.get(purityCtrl).accepted, false);
    assert.ok(marmMap.get(purityCtrl).reason.includes('kahve_category_not_coffee_specialist'));
  }
  assert.equal(marmMap.get('ctrl-marmaris-pioverdo-inflation').accepted, false);
  assert.equal(
    marmMap.get('ctrl-marmaris-pioverdo-inflation').reason,
    'suspected_rating_inflation_no_community_proof'
  );
  for (const lowCtrl of [
    'ctrl-marmaris-fredonia-low',
    'ctrl-marmaris-nil-balik-low',
    'ctrl-marmaris-aslankok-low',
    'ctrl-marmaris-pide-maris-low-count',
  ]) {
    assert.equal(marmMap.get(lowCtrl).accepted, false);
    assert.ok(marmMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-marmaris-cafe-anne-icmeler-outside',
    'ctrl-marmaris-cosy-corner-armutalan-outside',
    'ctrl-marmaris-turgutreis-balik-armutalan-outside',
    'ctrl-marmaris-kocabahce-bozburun-outside',
  ]) {
    assert.equal(marmMap.get(outCtrl).accepted, false);
    assert.ok(marmMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const datcaAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/mugla-datca-merkez.audit.json'), 'utf8')
  );
  const datMap = new Map(datcaAudit.decisions.map((d) => [d.id, d]));
  for (const closedCtrl of [
    'ctrl-datca-serap-cafe-closed',
    'ctrl-datca-azzurra-closed',
  ]) {
    assert.equal(datMap.get(closedCtrl).accepted, false);
    assert.ok(datMap.get(closedCtrl).reason.includes('not_operational'));
  }
  for (const chainCtrl of [
    'ctrl-datca-dominos-chain',
    'ctrl-datca-burger-king-chain',
    'ctrl-datca-cajun-corner-chain',
    'ctrl-datca-meliha-hanim-chain',
    'ctrl-datca-tekin-usta-chain',
  ]) {
    assert.equal(datMap.get(chainCtrl).accepted, false);
    assert.equal(datMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const nonFoodCtrl of [
    'ctrl-datca-kumluk-attraction',
    'ctrl-datca-necmi-kaptan-service',
  ]) {
    assert.equal(datMap.get(nonFoodCtrl).accepted, false);
    assert.ok(datMap.get(nonFoodCtrl).reason.includes('invalid_place_type'));
  }
  for (const purityCtrl of [
    'ctrl-datca-no96-kahve-purity',
    'ctrl-datca-ekim-kahve-purity',
  ]) {
    assert.equal(datMap.get(purityCtrl).accepted, false);
    assert.ok(datMap.get(purityCtrl).reason.includes('kahve_category_not_coffee_specialist'));
  }
  assert.equal(datMap.get('ctrl-datca-lumi-coffee-inflation').accepted, false);
  assert.equal(
    datMap.get('ctrl-datca-lumi-coffee-inflation').reason,
    'suspected_rating_inflation_no_community_proof'
  );
  for (const lowCtrl of [
    'ctrl-datca-sail-roastery-low',
    'ctrl-datca-coffee-grinder-low',
    'ctrl-datca-kekik-low',
    'ctrl-datca-zekeriya-low',
    'ctrl-datca-maradona-low',
    'ctrl-datca-hammur-low-count',
    'ctrl-datca-depo-pizza-low-count',
  ]) {
    assert.equal(datMap.get(lowCtrl).accepted, false);
    assert.ok(datMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }
  for (const outCtrl of [
    'ctrl-datca-eskidatcburger-outside',
    'ctrl-datca-pizza-trio-outside',
    'ctrl-datca-franco-pizza-ovabuku-outside',
    'ctrl-datca-palamut-beach-outside',
    'ctrl-datca-yesim-kargi-outside',
    'ctrl-datca-tales-resadiye-outside',
  ]) {
    assert.equal(datMap.get(outCtrl).accepted, false);
    assert.ok(datMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }

  const alsancakAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/izmir-konak-alsancak.audit.json'), 'utf8')
  );
  const alsMap = new Map(alsancakAudit.decisions.map((d) => [d.id, d]));
  for (const chainCtrl of [
    'ctrl-alsancak-pizza-locale-chain',
    'ctrl-alsancak-burger-street-chain',
    'ctrl-alsancak-two-hands-chain',
    'ctrl-alsancak-ohannes-chain',
    'ctrl-alsancak-starbucks-chain',
    'ctrl-alsancak-arabica-chain',
    'ctrl-alsancak-brew-mood-chain',
    'ctrl-alsancak-kahve-dunyasi-chain',
    'ctrl-alsancak-leone-chain',
    'ctrl-alsancak-ozsut-chain',
    'ctrl-alsancak-cizz-bizz-chain',
    'ctrl-alsancak-tuzu-biberi-chain',
    'ctrl-alsancak-buckin-chain',
    'ctrl-alsancak-poka-chain',
    'ctrl-alsancak-unlu-mamul-chain',
    'ctrl-alsancak-tavaci-recep-volume',
  ]) {
    assert.equal(alsMap.get(chainCtrl).accepted, false);
    assert.equal(alsMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const purityCtrl of [
    'ctrl-alsancak-hane-cikolata-purity',
    'ctrl-alsancak-saveur-purity',
  ]) {
    assert.equal(alsMap.get(purityCtrl).accepted, false);
    assert.ok(alsMap.get(purityCtrl).reason.includes('kahve_category_not_coffee_specialist'));
  }
  for (const outCtrl of [
    'ctrl-alsancak-sakiz-akdeniz-outside',
    'ctrl-alsancak-margaux-akdeniz-outside',
    'ctrl-alsancak-coffee-been-kahramanlar',
    'ctrl-alsancak-prego-halkapinar',
    'ctrl-alsancak-bayrakli-kiyi',
    'ctrl-alsancak-nays-turgutreis',
  ]) {
    assert.equal(alsMap.get(outCtrl).accepted, false);
    assert.ok(alsMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }
  for (const lowCtrl of [
    'ctrl-alsancak-la-puerta-low',
    'ctrl-alsancak-two-cups-low',
    'ctrl-alsancak-cartel-low',
    'ctrl-alsancak-brgr-low',
    'ctrl-alsancak-pizza-arte-low-count',
    'ctrl-alsancak-pukky-low-count',
  ]) {
    assert.equal(alsMap.get(lowCtrl).accepted, false);
    assert.ok(alsMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }

  const bostanliAudit = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'work/gastronomy-v3/izmir-karsiyaka-bostanli.audit.json'), 'utf8')
  );
  const bosMap = new Map(bostanliAudit.decisions.map((d) => [d.id, d]));
  for (const chainCtrl of [
    'ctrl-bostanli-pizza-locale-chain',
    'ctrl-bostanli-slices-chain',
    'ctrl-bostanli-uptown-chain',
    'ctrl-bostanli-biber-burger-chain',
    'ctrl-bostanli-burger-street-chain',
    'ctrl-bostanli-goldenfingers-chain',
    'ctrl-bostanli-white-burger-chain',
    'ctrl-bostanli-sasso-chain',
    'ctrl-bostanli-bravo-chain',
    'ctrl-bostanli-reyhan-chain',
    'ctrl-bostanli-bogazici-chain',
    'ctrl-bostanli-coffeemania-chain',
    'ctrl-bostanli-starbucks-chain',
  ]) {
    assert.equal(bosMap.get(chainCtrl).accepted, false);
    assert.equal(bosMap.get(chainCtrl).reason, 'chain_or_franchise');
  }
  for (const purityCtrl of [
    'ctrl-bostanli-gusto-cikolata-purity',
    'ctrl-bostanli-spatula-bakery-purity',
  ]) {
    assert.equal(bosMap.get(purityCtrl).accepted, false);
    assert.ok(bosMap.get(purityCtrl).reason.includes('kahve_category_not_coffee_specialist'));
  }
  for (const outCtrl of [
    'ctrl-bostanli-moradaris-aksoy-outside',
    'ctrl-bostanli-kybele-donanmaci-outside',
    'ctrl-bostanli-rucola-atakent-outside',
    'ctrl-bostanli-leaf-atakent-outside',
    'ctrl-bostanli-smor-yali-outside',
    'ctrl-bostanli-montagna-nergiz-outside',
    'ctrl-bostanli-denizkent-mavisehir-outside',
  ]) {
    assert.equal(bosMap.get(outCtrl).accepted, false);
    assert.ok(bosMap.get(outCtrl).reason.includes('outside_strict_neighborhood'));
  }
  for (const lowCtrl of [
    'ctrl-bostanli-goches-chain',
    'ctrl-bostanli-optimist-low',
    'ctrl-bostanli-dogan-konice-low',
    'ctrl-bostanli-ayvalik-balikcisi-low',
    'ctrl-bostanli-yalin-balik-low',
    'ctrl-bostanli-zemin-low',
    'ctrl-bostanli-mekan-low-count',
    'ctrl-bostanli-mezeci-low-count',
    'ctrl-bostanli-cochem-low-count',
  ]) {
    assert.equal(bosMap.get(lowCtrl).accepted, false);
    assert.ok(bosMap.get(lowCtrl).reason.includes('below_quality_threshold'));
  }

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
  assert.equal(chMap.get('ctrl-cih-kumbasar-below-44').accepted, false);
  assert.ok(chMap.get('ctrl-cih-kumbasar-below-44').reason.includes('below_quality_threshold'));
  assert.equal(chMap.get('ctrl-cih-jash-below-44').accepted, false);
  assert.ok(chMap.get('ctrl-cih-jash-below-44').reason.includes('below_quality_threshold'));
  assert.equal(chMap.get('ctrl-cih-smashsquare-outside').accepted, false);
  assert.ok(chMap.get('ctrl-cih-smashsquare-outside').reason.includes('outside_strict_neighborhood'));
  assert.equal(chMap.get('ctrl-cih-49-cukurcuma-outside').accepted, false);
  assert.ok(chMap.get('ctrl-cih-49-cukurcuma-outside').reason.includes('outside_strict_neighborhood'));

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

test('Cukurcuma and Balat audit logs enforce strict boundary, chain, coffee purity, and >=4.4 rules', () => {
  const nodeFs = require('node:fs');
  const nodePath = require('node:path');
  const auditDir = nodePath.resolve(__dirname, '..', 'work', 'gastronomy-v3');
  const cukAuditPath = nodePath.join(auditDir, 'istanbul-beyoglu-cukurcuma.audit.json');
  const balAuditPath = nodePath.join(auditDir, 'istanbul-fatih-balat.audit.json');
  if (nodeFs.existsSync(cukAuditPath)) {
    const cukAudit = JSON.parse(nodeFs.readFileSync(cukAuditPath, 'utf8'));
    const cukMap = new Map(cukAudit.decisions.map((d) => [d.id, d]));
    assert.equal(cukAudit.acceptedCount, 19);
    assert.equal(cukMap.get('ctrl-cuk-koftecisi-closed').accepted, false);
    assert.ok(cukMap.get('ctrl-cuk-koftecisi-closed').reason.includes('not_operational'));
    for (const chainId of ['ctrl-cuk-burgeryiyelim-chain', 'ctrl-cuk-burgerking-chain', 'ctrl-cuk-betro-chain']) {
      assert.equal(cukMap.get(chainId).accepted, false);
      assert.ok(cukMap.get(chainId).reason.includes('chain_or_franchise'));
    }
    assert.equal(cukMap.get('ctrl-cuk-bolci-kahve-purity').accepted, false);
    assert.ok(cukMap.get('ctrl-cuk-bolci-kahve-purity').reason.includes('kahve_category_not_coffee_specialist'));
    for (const lowId of [
      'ctrl-cuk-cuma-below-44',
      'ctrl-cuk-norre-below-44',
      'ctrl-cuk-curve-below-44',
      'ctrl-cuk-probador-below-44',
      'ctrl-cuk-hayvore-below-44',
      'ctrl-cuk-limonlu-below-44',
    ]) {
      assert.equal(cukMap.get(lowId).accepted, false);
      assert.ok(cukMap.get(lowId).reason.includes('below_quality_threshold'));
    }
    for (const outId of ['ctrl-cuk-tavanarasi-asmalimescit', 'ctrl-cuk-bad-burger-cihangir']) {
      assert.equal(cukMap.get(outId).accepted, false);
      assert.ok(cukMap.get(outId).reason.includes('outside_strict_neighborhood'));
    }
  }
  if (nodeFs.existsSync(balAuditPath)) {
    const balAudit = JSON.parse(nodeFs.readFileSync(balAuditPath, 'utf8'));
    const balMap = new Map(balAudit.decisions.map((d) => [d.id, d]));
    assert.equal(balAudit.acceptedCount, 23);
    assert.equal(balMap.get('ctrl-bal-velvet-closed').accepted, false);
    assert.ok(balMap.get('ctrl-bal-velvet-closed').reason.includes('not_operational'));
    for (const chainId of [
      'ctrl-bal-davidpeople-chain',
      'ctrl-bal-paperroasting-chain',
      'ctrl-bal-asirliktencere-chain',
      'ctrl-bal-8one-chain',
    ]) {
      assert.equal(balMap.get(chainId).accepted, false);
      assert.ok(balMap.get(chainId).reason.includes('chain_or_franchise'));
    }
    for (const purityId of ['ctrl-bal-soil-kahve-purity', 'ctrl-bal-francala-kahve-purity']) {
      assert.equal(balMap.get(purityId).accepted, false);
      assert.ok(balMap.get(purityId).reason.includes('kahve_category_not_coffee_specialist'));
    }
    for (const lowId of [
      'ctrl-bal-pops-below-44',
      'ctrl-bal-ilters-below-44',
      'ctrl-bal-sahil-below-44',
      'ctrl-bal-perispri-below-44',
    ]) {
      assert.equal(balMap.get(lowId).accepted, false);
      assert.ok(balMap.get(lowId).reason.includes('below_quality_threshold'));
    }
    assert.equal(balMap.get('ctrl-bal-cibalikapi-outside').accepted, false);
    assert.ok(balMap.get('ctrl-bal-cibalikapi-outside').reason.includes('outside_strict_neighborhood'));
  }
});

test('Yenikoy and Gokturk audit logs enforce strict boundary, chain, coffee purity, and >=4.4 rules', () => {
  const nodeFs = require('node:fs');
  const nodePath = require('node:path');
  const auditDir = nodePath.resolve(__dirname, '..', 'work', 'gastronomy-v3');
  const yenAuditPath = nodePath.join(auditDir, 'istanbul-sariyer-yenikoy.audit.json');
  const gokAuditPath = nodePath.join(auditDir, 'istanbul-eyupsultan-gokturk.audit.json');
  if (nodeFs.existsSync(yenAuditPath)) {
    const yenAudit = JSON.parse(nodeFs.readFileSync(yenAuditPath, 'utf8'));
    const yenMap = new Map(yenAudit.decisions.map((d) => [d.id, d]));
    assert.equal(yenAudit.acceptedCount, 18);
    for (const closedId of ['ctrl-yen-vagabondos-closed', 'ctrl-yen-marcel-closed']) {
      assert.equal(yenMap.get(closedId).accepted, false);
      assert.ok(yenMap.get(closedId).reason.includes('not_operational'));
    }
    for (const chainId of [
      'ctrl-yen-juanvaldez-chain',
      'ctrl-yen-kronotrop-chain',
      'ctrl-yen-caffenero-chain',
      'ctrl-yen-whiteburger-chain',
      'ctrl-yen-hopdaddy-chain',
      'ctrl-yen-fiko-chain',
      'ctrl-yen-voi-chain',
      'ctrl-yen-ioki-chain',
      'ctrl-yen-girandola-purity',
    ]) {
      assert.equal(yenMap.get(chainId).accepted, false);
      assert.ok(yenMap.get(chainId).reason.includes('chain_or_franchise'));
    }
    for (const lowId of ['ctrl-yen-emekmanti-below44', 'ctrl-yen-gazebo-below44']) {
      assert.equal(yenMap.get(lowId).accepted, false);
      assert.ok(yenMap.get(lowId).reason.includes('below_quality_threshold'));
    }
    for (const outId of ['ctrl-yen-flamor-tarabya', 'ctrl-yen-haga-istinye']) {
      assert.equal(yenMap.get(outId).accepted, false);
      assert.ok(yenMap.get(outId).reason.includes('outside_strict_neighborhood'));
    }
  }
  if (nodeFs.existsSync(gokAuditPath)) {
    const gokAudit = JSON.parse(nodeFs.readFileSync(gokAuditPath, 'utf8'));
    const gokMap = new Map(gokAudit.decisions.map((d) => [d.id, d]));
    assert.equal(gokAudit.acceptedCount, 25);
    for (const closedId of ['gok-neg-mapburger', 'gok-neg-cups-clouds']) {
      assert.equal(gokMap.get(closedId).accepted, false);
      assert.ok(gokMap.get(closedId).reason.includes('not_operational'));
    }
    for (const chainId of [
      'gok-neg-espressolab',
      'gok-neg-kronotrop',
      'gok-neg-bigchefs',
      'gok-neg-little-caesars',
      'gok-neg-numnum',
      'gok-neg-il-forno',
      'gok-neg-laos-coffee',
    ]) {
      assert.equal(gokMap.get(chainId).accepted, false);
      assert.ok(gokMap.get(chainId).reason.includes('chain_or_franchise'));
    }
    assert.equal(gokMap.get('gok-neg-moso-gelato-kahve').accepted, false);
    assert.ok(gokMap.get('gok-neg-moso-gelato-kahve').reason.includes('kahve_category_not_coffee_specialist'));
    assert.equal(gokMap.get('gok-neg-dekante').accepted, false);
    assert.ok(gokMap.get('gok-neg-dekante').reason.includes('below_quality_threshold'));
    for (const outId of ['gok-neg-yesil-orman', 'gok-neg-yesil-vadi']) {
      assert.equal(gokMap.get(outId).accepted, false);
      assert.ok(gokMap.get(outId).reason.includes('outside_strict_neighborhood'));
    }
  }
});

test('Asmalimescit-Pera and Taksim-Istiklal audit logs reject closed, chains, non-coffee pastry/chocolate, low-rating, and outside venues', () => {
  const nodeFs = require('node:fs');
  const nodePath = require('node:path');
  const auditDir = nodePath.join(ROOT, 'work', 'gastronomy-v3');
  const asmAuditPath = nodePath.join(auditDir, 'istanbul-beyoglu-asmalimescit.audit.json');
  const takAuditPath = nodePath.join(auditDir, 'istanbul-beyoglu-taksim.audit.json');

  if (nodeFs.existsSync(asmAuditPath)) {
    const asmAudit = JSON.parse(nodeFs.readFileSync(asmAuditPath, 'utf8'));
    const asmMap = new Map(asmAudit.decisions.map((d) => [d.id, d]));
    assert.equal(asmAudit.acceptedCount, 25);
    assert.equal(asmMap.get('ctrl-asm-lebon-closed').accepted, false);
    assert.ok(asmMap.get('ctrl-asm-lebon-closed').reason.includes('not_operational'));
    for (const chainId of [
      'ctrl-asm-espressolab-chain',
      'ctrl-asm-viyana-chain',
      'ctrl-asm-betro-chain',
      'ctrl-asm-burgeryiyelim-chain',
      'ctrl-asm-midpoint-chain',
      'ctrl-asm-thehunger-chain',
      'ctrl-asm-mado-chain',
      'ctrl-asm-eleos-chain',
      'ctrl-asm-misspizza-below44',
      'ctrl-asm-yesenburger-below44',
      'ctrl-asm-cecconis-below44',
      'ctrl-asm-mocpera-newchain',
      'ctrl-asm-noirpit-newchain',
    ]) {
      assert.equal(asmMap.get(chainId).accepted, false);
      assert.ok(asmMap.get(chainId).reason.includes('chain_or_franchise'));
    }
    for (const purityId of ['ctrl-asm-patisserie-pera-purity', 'ctrl-asm-jadore-purity']) {
      assert.equal(asmMap.get(purityId).accepted, false);
      assert.ok(asmMap.get(purityId).reason.includes('kahve_category_not_coffee_specialist'));
    }
    assert.equal(asmMap.get('ctrl-asm-perabakery-below44').accepted, false);
    assert.ok(asmMap.get('ctrl-asm-perabakery-below44').reason.includes('below_quality_threshold'));
    for (const outId of ['ctrl-asm-outside-galata-frida', 'ctrl-asm-outside-taksim-sini']) {
      assert.equal(asmMap.get(outId).accepted, false);
      assert.ok(asmMap.get(outId).reason.includes('outside_strict_neighborhood'));
    }
  }

  if (nodeFs.existsSync(takAuditPath)) {
    const takAudit = JSON.parse(nodeFs.readFileSync(takAuditPath, 'utf8'));
    const takMap = new Map(takAudit.decisions.map((d) => [d.id, d]));
    assert.equal(takAudit.acceptedCount, 28);
    assert.equal(takMap.get('neg-taksim-changa').accepted, false);
    assert.ok(takMap.get('neg-taksim-changa').reason.includes('not_operational'));
    for (const chainId of [
      'neg-taksim-espressolab',
      'neg-taksim-hafiz-mustafa',
      'neg-taksim-burger-king',
      'neg-taksim-papa-johns',
      'neg-taksim-sbarro',
      'neg-taksim-mado',
      'neg-taksim-simit-sarayi',
      'neg-taksim-faruk-gulluoglu',
      'neg-taksim-kizilkayalar',
      'neg-taksim-balkan-lokantasi',
      'neg-taksim-mono-burger',
      'neg-taksim-heros-pizza',
      'neg-taksim-saray-muhallebicisi',
      'neg-taksim-bambi-cafe',
    ]) {
      assert.equal(takMap.get(chainId).accepted, false);
      assert.ok(takMap.get(chainId).reason.includes('chain_or_franchise'));
    }
    assert.equal(takMap.get('neg-taksim-bolci-kahve').accepted, false);
    assert.ok(takMap.get('neg-taksim-bolci-kahve').reason.includes('kahve_category_not_coffee_specialist'));
    for (const lowId of ['neg-taksim-esmer-cafe', 'neg-taksim-roastory']) {
      assert.equal(takMap.get(lowId).accepted, false);
      assert.ok(takMap.get(lowId).reason.includes('below_quality_threshold'));
    }
    for (const outId of [
      'neg-taksim-ancre-cihangir',
      'neg-taksim-nevet-exclude',
      'neg-taksim-pilavci-asmalimescit',
    ]) {
      assert.equal(takMap.get(outId).accepted, false);
      assert.ok(takMap.get(outId).reason.includes('outside_strict_neighborhood'));
    }
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
  assert.equal(ready.length, 58);
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
      'cukurcuma',
      'balat',
      'yenikoy',
      'gokturk',
      'asmalimescit',
      'taksim',
      'kusadasi',
      'gaziantep',
      'antalya-kaleici',
      'antalya-lara',
      'antalya-konyaalti',
      'kas-merkez',
      'kalkan-merkez',
      'alanya-merkez',
      'side',
      'kemer',
      'akyaka',
      'yaniklar',
      'gocek',
      'fethiye-merkez',
      'calis',
      'oludeniz',
      'bodrum-merkez',
      'yalikavak',
      'gumusluk',
      'turkbuku',
      'bitez',
      'turgutreis',
      'ortakent-yahsi',
      'gundogan',
      'gumbet',
      'torba',
      'akyarlar',
      'marmaris-merkez',
      'datca-merkez',
      'alsancak',
      'bostanli',
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
  assert.equal(provider.getLocationBySlug('cukurcuma')?.slug, 'cukurcuma');
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
  assert.equal(provider.getLocationBySlug('cukurcuma')?.slug, 'cukurcuma');
  assert.equal(provider.getLocationBySlug('faik-pasa')?.slug, 'cukurcuma');
  assert.equal(provider.getLocationBySlug('turnacibasi')?.slug, 'cukurcuma');
  assert.equal(provider.getLocationBySlug('balat')?.slug, 'balat');
  assert.equal(provider.getLocationBySlug('fener')?.slug, 'balat');
  assert.equal(provider.getLocationBySlug('vodina')?.slug, 'balat');
  assert.equal(provider.getLocationBySlug('cifit-carsisi')?.slug, 'balat');
  assert.equal(provider.getLocationBySlug('yenikoy')?.slug, 'yenikoy');
  assert.equal(provider.getLocationBySlug('yenikoy-sariyer')?.slug, 'yenikoy');
  assert.equal(provider.getLocationBySlug('koybasi')?.slug, 'yenikoy');
  assert.equal(provider.getLocationBySlug('kalender')?.slug, 'yenikoy');
  assert.equal(provider.getLocationBySlug('gokturk')?.slug, 'gokturk');
  assert.equal(provider.getLocationBySlug('gokturk-eyupsultan')?.slug, 'gokturk');
  assert.equal(provider.getLocationBySlug('arcadium-gokturk')?.slug, 'gokturk');
  assert.equal(provider.getLocationBySlug('larus-palas')?.slug, 'gokturk');
  assert.equal(provider.getLocationBySlug('asmalimescit')?.slug, 'asmalimescit');
  assert.equal(provider.getLocationBySlug('beyoglu')?.slug, 'asmalimescit');
  assert.equal(provider.getLocationBySlug('pera')?.slug, 'asmalimescit');
  assert.equal(provider.getLocationBySlug('tunel')?.slug, 'asmalimescit');
  assert.equal(provider.getLocationBySlug('tepebasi')?.slug, 'asmalimescit');
  assert.equal(provider.getLocationBySlug('taksim')?.slug, 'taksim');
  assert.equal(provider.getLocationBySlug('istiklal')?.slug, 'taksim');
  assert.equal(provider.getLocationBySlug('istiklal-caddesi')?.slug, 'taksim');
  assert.equal(provider.getLocationBySlug('cicek-pasaji')?.slug, 'taksim');
  assert.equal(provider.getLocationBySlug('nevizade')?.slug, 'taksim');
  assert.equal(provider.getLocationBySlug('talimhane')?.slug, 'taksim');
  assert.equal(provider.getLocationBySlug('gumussuyu')?.slug, 'taksim');
  assert.equal(provider.getLocationBySlug('guzelcamli')?.slug, 'kusadasi');
  assert.equal(provider.getLocationBySlug('davutlar')?.slug, 'kusadasi');
  assert.equal(provider.getLocationBySlug('merkez-kusadasi-aydin')?.slug, 'kusadasi');
  assert.equal(provider.getLocationBySlug('sahinbey')?.slug, 'gaziantep');
  assert.equal(provider.getLocationBySlug('sehitkamil')?.slug, 'gaziantep');
  assert.equal(provider.getLocationBySlug('antalya')?.slug, 'antalya-kaleici');
  assert.equal(provider.getLocationBySlug('kaleici')?.slug, 'antalya-kaleici');
  assert.equal(provider.getLocationBySlug('uckapilar')?.slug, 'antalya-kaleici');
  assert.equal(provider.getLocationBySlug('lara')?.slug, 'antalya-lara');
  assert.equal(provider.getLocationBySlug('eski-lara')?.slug, 'antalya-lara');
  assert.equal(provider.getLocationBySlug('yesilbahce')?.slug, 'antalya-lara');
  assert.equal(provider.getLocationBySlug('fener-antalya')?.slug, 'antalya-lara');
  assert.equal(provider.getLocationBySlug('caglayan-lara')?.slug, 'antalya-lara');
  assert.equal(provider.getLocationBySlug('fener')?.slug, 'balat');
  assert.equal(provider.getLocationBySlug('konyaalti')?.slug, 'antalya-konyaalti');
  assert.equal(provider.getLocationBySlug('konyaalti-sahil')?.slug, 'antalya-konyaalti');
  assert.equal(provider.getLocationBySlug('akdeniz-bulvari')?.slug, 'antalya-konyaalti');
  assert.equal(provider.getLocationBySlug('cakirlar'), undefined);
  assert.equal(provider.getLocationBySlug('aksu'), undefined);
  assert.equal(provider.getLocationBySlug('kas')?.slug, 'kas-merkez');
  assert.equal(provider.getLocationBySlug('uzun-carsi')?.slug, 'kas-merkez');
  assert.equal(provider.getLocationBySlug('andifli')?.slug, 'kas-merkez');
  assert.equal(provider.getLocationBySlug('kucuk-cakil')?.slug, 'kas-merkez');
  assert.equal(provider.getLocationBySlug('kalkan')?.slug, 'kalkan-merkez');
  assert.equal(provider.getLocationBySlug('kalkan-iskele')?.slug, 'kalkan-merkez');
  assert.equal(provider.getLocationBySlug('yaliboyu-kalkan')?.slug, 'kalkan-merkez');
  assert.equal(provider.getLocationBySlug('cukurbag'), undefined);
  assert.equal(provider.getLocationBySlug('islamlar'), undefined);
  assert.equal(provider.getLocationBySlug('alanya')?.slug, 'alanya-merkez');
  assert.equal(provider.getLocationBySlug('damlatas')?.slug, 'alanya-merkez');
  assert.equal(provider.getLocationBySlug('kleopatra-alanya')?.slug, 'alanya-merkez');
  assert.equal(provider.getLocationBySlug('side')?.slug, 'side');
  assert.equal(provider.getLocationBySlug('side-antik-liman')?.slug, 'side');
  assert.equal(provider.getLocationBySlug('side-manavgat')?.slug, 'side');
  assert.equal(provider.getLocationBySlug('mahmutlar'), undefined);
  assert.equal(provider.getLocationBySlug('avsallar'), undefined);
  assert.equal(provider.getLocationBySlug('colakli'), undefined);
  assert.equal(provider.getLocationBySlug('kemer')?.slug, 'kemer');
  assert.equal(provider.getLocationBySlug('kemer-merkez')?.slug, 'kemer');
  assert.equal(provider.getLocationBySlug('idyros')?.slug, 'kemer');
  assert.equal(provider.getLocationBySlug('kemer-marina')?.slug, 'kemer');
  assert.equal(provider.getLocationBySlug('goynuk'), undefined);
  assert.equal(provider.getLocationBySlug('beldibi'), undefined);
  assert.equal(provider.getLocationBySlug('camyuva'), undefined);
  assert.equal(provider.getLocationBySlug('tekirova'), undefined);
  assert.equal(provider.getLocationBySlug('gokova')?.slug, 'akyaka');
  assert.equal(provider.getLocationBySlug('akcapinar')?.slug, 'akyaka');
  assert.equal(provider.getLocationBySlug('akyaka-akcapinar')?.slug, 'akyaka');
  assert.equal(provider.getLocationBySlug('kadin-azmagi')?.slug, 'akyaka');
  assert.equal(provider.getLocationBySlug('asiklar-yolu')?.slug, 'akyaka');
  assert.equal(provider.getLocationBySlug('yaniklar')?.slug, 'yaniklar');
  assert.equal(provider.getLocationBySlug('karaot-plaji')?.slug, 'yaniklar');
  assert.equal(provider.getLocationBySlug('katranci-koyu')?.slug, 'yaniklar');
  assert.equal(provider.getLocationBySlug('gocek')?.slug, 'gocek');
  assert.equal(provider.getLocationBySlug('gocek-merkez')?.slug, 'gocek');
  assert.equal(provider.getLocationBySlug('gocek-marina')?.slug, 'gocek');
  assert.equal(provider.getLocationBySlug('d-marin-gocek')?.slug, 'gocek');
  assert.equal(provider.getLocationBySlug('fethiye')?.slug, 'fethiye-merkez');
  assert.equal(provider.getLocationBySlug('fethiye-merkez')?.slug, 'fethiye-merkez');
  assert.equal(provider.getLocationBySlug('paspatur')?.slug, 'fethiye-merkez');
  assert.equal(provider.getLocationBySlug('karagozler')?.slug, 'fethiye-merkez');
  assert.equal(provider.getLocationBySlug('calis')?.slug, 'calis');
  assert.equal(provider.getLocationBySlug('calis-plaji')?.slug, 'calis');
  assert.equal(provider.getLocationBySlug('foca-calis')?.slug, 'calis');
  assert.equal(provider.getLocationBySlug('oludeniz')?.slug, 'oludeniz');
  assert.equal(provider.getLocationBySlug('belcekiz')?.slug, 'oludeniz');
  assert.equal(provider.getLocationBySlug('kumburnu')?.slug, 'oludeniz');
  assert.equal(provider.getLocationBySlug('kidrak')?.slug, 'oludeniz');
  const fethiyeMatches = provider.searchLocations('fethiye').map((l) => l.slug);
  assert.ok(
    fethiyeMatches.includes('yaniklar') &&
      fethiyeMatches.includes('gocek') &&
      fethiyeMatches.includes('fethiye-merkez') &&
      fethiyeMatches.includes('calis') &&
      fethiyeMatches.includes('oludeniz')
  );
  assert.equal(provider.getLocationBySlug('hisaronu'), undefined);
  assert.equal(provider.getLocationBySlug('ovacik'), undefined);
  assert.equal(provider.getLocationBySlug('kayakoy'), undefined);
  assert.equal(provider.getLocationBySlug('faralya'), undefined);
  assert.equal(provider.getLocationBySlug('inlice'), undefined);

  // Bodrum resolution & unpublished neighboring Peninsula exclusions
  assert.equal(provider.getLocationBySlug('bodrum')?.slug, 'bodrum-merkez');
  assert.equal(provider.getLocationBySlug('bodrum-merkez')?.slug, 'bodrum-merkez');
  assert.equal(provider.getLocationBySlug('kumbahce')?.slug, 'bodrum-merkez');
  assert.equal(provider.getLocationBySlug('eskicesme')?.slug, 'bodrum-merkez');
  assert.equal(provider.getLocationBySlug('bodrum-marina')?.slug, 'bodrum-merkez');
  assert.equal(provider.getLocationBySlug('yalikavak')?.slug, 'yalikavak');
  assert.equal(provider.getLocationBySlug('yalikavak-marina')?.slug, 'yalikavak');
  assert.equal(provider.getLocationBySlug('palmarina')?.slug, 'yalikavak');
  assert.equal(provider.getLocationBySlug('tilkicik')?.slug, 'yalikavak');
  assert.equal(provider.getLocationBySlug('gumusluk')?.slug, 'gumusluk');
  assert.equal(provider.getLocationBySlug('tavsan-adasi')?.slug, 'gumusluk');
  assert.equal(provider.getLocationBySlug('koyunbaba')?.slug, 'gumusluk');
  assert.equal(provider.getLocationBySlug('turkbuku')?.slug, 'turkbuku');
  assert.equal(provider.getLocationBySlug('golturkbuku')?.slug, 'turkbuku');
  assert.equal(provider.getLocationBySlug('golkoy')?.slug, 'turkbuku');
  assert.equal(provider.getLocationBySlug('cennet-koyu')?.slug, 'turkbuku');
  assert.equal(provider.getLocationBySlug('bitez')?.slug, 'bitez');
  assert.equal(provider.getLocationBySlug('bitez-yalisi')?.slug, 'bitez');
  assert.equal(provider.getLocationBySlug('bitez-sahil')?.slug, 'bitez');
  assert.equal(provider.getLocationBySlug('turgutreis')?.slug, 'turgutreis');
  assert.equal(provider.getLocationBySlug('d-marin-turgutreis')?.slug, 'turgutreis');
  assert.equal(provider.getLocationBySlug('karabag-turgutreis')?.slug, 'turgutreis');
  assert.equal(provider.getLocationBySlug('ortakent-yahsi')?.slug, 'ortakent-yahsi');
  assert.equal(provider.getLocationBySlug('ortakent')?.slug, 'ortakent-yahsi');
  assert.equal(provider.getLocationBySlug('yahsi')?.slug, 'ortakent-yahsi');
  assert.equal(provider.getLocationBySlug('muskebi')?.slug, 'ortakent-yahsi');
  assert.equal(provider.getLocationBySlug('gundogan')?.slug, 'gundogan');
  assert.equal(provider.getLocationBySlug('farilya')?.slug, 'gundogan');
  assert.equal(provider.getLocationBySlug('kucukbuk')?.slug, 'gundogan');
  assert.equal(provider.getLocationBySlug('gumbet')?.slug, 'gumbet');
  assert.equal(provider.getLocationBySlug('asarlik')?.slug, 'gumbet');
  assert.equal(provider.getLocationBySlug('torba')?.slug, 'torba');
  assert.equal(provider.getLocationBySlug('torba-koyu')?.slug, 'torba');
  assert.equal(provider.getLocationBySlug('zeytinlikahve')?.slug, 'torba');
  assert.equal(provider.getLocationBySlug('akyarlar')?.slug, 'akyarlar');
  assert.equal(provider.getLocationBySlug('karaincir')?.slug, 'akyarlar');
  assert.equal(provider.getLocationBySlug('aspat')?.slug, 'akyarlar');
  assert.equal(provider.getLocationBySlug('anthaven')?.slug, 'akyarlar');
  const bodrumMatches = provider.searchLocations('bodrum').map((l) => l.slug);
  assert.ok(
    bodrumMatches.includes('bodrum-merkez') &&
      bodrumMatches.includes('yalikavak') &&
      bodrumMatches.includes('gumusluk') &&
      bodrumMatches.includes('turkbuku') &&
      bodrumMatches.includes('bitez') &&
      bodrumMatches.includes('turgutreis') &&
      bodrumMatches.includes('ortakent-yahsi') &&
      bodrumMatches.includes('gundogan') &&
      bodrumMatches.includes('gumbet') &&
      bodrumMatches.includes('torba') &&
      bodrumMatches.includes('akyarlar')
  );
  assert.equal(provider.getLocationBySlug('konacik'), undefined);
  assert.equal(provider.getLocationBySlug('kadikalesi'), undefined);
  assert.equal(provider.getLocationBySlug('peksimet'), undefined);
  assert.equal(provider.getLocationBySlug('bagla'), undefined);
  assert.equal(provider.getLocationBySlug('guvercinlik'), undefined);
  assert.equal(provider.getLocationBySlug('yaliciftlik'), undefined);
  assert.equal(provider.getLocationBySlug('mazikoy'), undefined);
  assert.equal(provider.getLocationBySlug('marmaris')?.slug, 'marmaris-merkez');
  assert.equal(provider.getLocationBySlug('marmaris-merkez')?.slug, 'marmaris-merkez');
  assert.equal(provider.getLocationBySlug('netsel-marina')?.slug, 'marmaris-merkez');
  assert.equal(provider.getLocationBySlug('uzunyali')?.slug, 'marmaris-merkez');
  assert.equal(provider.getLocationBySlug('marmaris-kaleici')?.slug, 'marmaris-merkez');
  assert.equal(provider.getLocationBySlug('datca')?.slug, 'datca-merkez');
  assert.equal(provider.getLocationBySlug('datca-merkez')?.slug, 'datca-merkez');
  assert.equal(provider.getLocationBySlug('kumluk')?.slug, 'datca-merkez');
  assert.equal(provider.getLocationBySlug('datca-iskele')?.slug, 'datca-merkez');
  assert.equal(provider.getLocationBySlug('taslik-plaji')?.slug, 'datca-merkez');
  assert.equal(provider.getLocationBySlug('alsancak')?.slug, 'alsancak');
  assert.equal(provider.getLocationBySlug('kordon')?.slug, 'alsancak');
  assert.equal(provider.getLocationBySlug('kordonboyu')?.slug, 'alsancak');
  assert.equal(provider.getLocationBySlug('kibris-sehitleri')?.slug, 'alsancak');
  assert.equal(provider.getLocationBySlug('gul-sokak')?.slug, 'alsancak');
  assert.equal(provider.getLocationBySlug('bostanli')?.slug, 'bostanli');
  assert.equal(provider.getLocationBySlug('bostanli-sahil')?.slug, 'bostanli');
  assert.equal(provider.getLocationBySlug('bostanli-iskele')?.slug, 'bostanli');
  assert.equal(provider.getLocationBySlug('cengiz-topel')?.slug, 'bostanli');
  assert.equal(provider.getLocationBySlug('nalkesen')?.slug, 'bostanli');
  for (const unpublishedNeighbor of [
    'icmeler',
    'turunc',
    'bozburun',
    'sogut',
    'hisaronu',
    'orhaniye',
    'armutalan',
    'eski-datca',
    'palamutbuku',
    'mesudiye',
    'hayitbuku',
    'ovabuku',
    'knidos',
    'kemeralti',
    'pasaport',
    'mavisehir',
    'bornova',
    'urla',
    'alacati',
    'cesme',
    'guzelbahce',
    'karabaglar',
    'buca',
  ]) {
    assert.equal(provider.getLocationBySlug(unpublishedNeighbor), undefined);
  }

  // Unpublished regions cannot resolve
  assert.equal(provider.getLocationBySlug('beylerbeyi'), undefined);

  // Verify all 58 published regions resolve cleanly through readIntegrationDiscovery
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
    'cukurcuma',
    'balat',
    'yenikoy',
    'gokturk',
    'asmalimescit',
    'taksim',
    'kusadasi',
    'gaziantep',
    'antalya-kaleici',
    'antalya-lara',
    'antalya-konyaalti',
    'kas-merkez',
    'kalkan-merkez',
    'alanya-merkez',
    'side',
    'kemer',
    'akyaka',
    'yaniklar',
    'gocek',
    'fethiye-merkez',
    'calis',
    'oludeniz',
    'bodrum-merkez',
    'yalikavak',
    'gumusluk',
    'turkbuku',
    'bitez',
    'turgutreis',
    'ortakent-yahsi',
    'gundogan',
    'gumbet',
    'torba',
    'akyarlar',
    'marmaris-merkez',
    'datca-merkez',
    'alsancak',
    'bostanli',
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
      assert.equal(p.getLocationBySlug('antalya-kaleici')?.locative, "Kaleiçi'nde");
      assert.equal(disc.region.displayName, 'Kaleiçi, Antalya');
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 9, 'Antalya Kaleici must expose 9 categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Belforno',
        'Fin Del Mundo',
        'Bartelo',
        'Brevio Coffee',
        'Sauvignon',
        'Seraser',
        'Balıkçı Meyhanesi Kaleiçi',
        'Piyazcı Sami',
        'Topçu Kebap',
        'Parlak Restaurant',
        'Ayar Meyhanesi',
        'Börekçi Tevfik',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `antalya-kaleici missing ${expected}`);
      }
      for (const forbidden of [
        'Arma Restaurant',
        'Route Burger House',
        "Franco's Pizza",
        'Varuna Gezgin',
        'The Beaver',
        'Milklaç',
        'Paçacı Şemsi',
        'Meşhur Aksu Şimşek',
        'Komaş Döner',
        'Piyazcı Ahmet',
        'LUNA GARDEN',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `antalya-kaleici must exclude ${forbidden}`);
      }
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
      assert.equal(p.getLocationBySlug('akyaka')?.locative, "Akyaka ve Akçapınar'da");
      assert.equal(disc.region.displayName, 'Akyaka & Akçapınar, Ula, Muğla');
      const akyakaCats = p.getRegionCategories(disc.region.id);
      assert.equal(akyakaCats.length, 7, 'Akyaka & Akçapınar must expose 7 coastal categories');
      assert.ok(
        akyakaCats.some((c) => c.slug === 'balik-deniz-urunleri'),
        'Akyaka missing balik-deniz-urunleri category'
      );
      assert.equal(f.venues.length, 31, 'Akyaka & Akçapınar must expose 31 verified venues');
      assert.ok(
        f.venues.every(
          (v) =>
            typeof v.location === 'string' &&
            (v.location.endsWith(', Akyaka') || v.location.endsWith(', Akçapınar'))
        ),
        'Every Akyaka & Akçapınar card location must end with , Akyaka or , Akçapınar'
      );
      const akyakaFish = p.getCategoryResult(disc.region.id, 'balik-deniz-urunleri');
      assert.ok(
        akyakaFish?.coreVenues[0]?.name.includes('Yengeç'),
        `Akyaka & Akçapınar balik #1 must be Yengeç, got ${akyakaFish?.coreVenues[0]?.name}`
      );
      const akyakaKahvalti = p.getCategoryResult(disc.region.id, 'kahvalti');
      assert.ok(
        akyakaKahvalti?.coreVenues[0]?.name.includes('West Cafe'),
        `Akyaka & Akçapınar kahvalti #1 must be West Cafe, got ${akyakaKahvalti?.coreVenues[0]?.name}`
      );
      const akyakaDate = p.getCategoryResult(disc.region.id, 'date-mekanlari');
      assert.ok(
        akyakaDate?.coreVenues.some((v) => v.name.includes('Yengeç')),
        'Akyaka & Akçapınar date-mekanlari must include Yengeç'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Yengeç Restaurant & Otel',
        'West Cafe Bistro',
        'Sepia Akçapınar',
        'Köprü Restaurant',
        'Lemongrass Coffee Bar',
        'Gökova Köy Lokantası',
        'Gökova Pide',
        'Selanik',
        'Muhtar Akçapınar',
        'Idyma Restaurant Akçapınar',
        'Pizza Fellas',
        "Börfi's Burger",
        "Halil'in Yeri",
        'Akyaka Orfoz',
        'Olta Balık',
        'Gökova Börek',
        'Mosso Akyaka',
        "No22 Riders'Inn",
        'Meşhur Akçapınar Tostçusu',
        'Kite Beach Akyaka',
        'Sandal Balık Ekmek',
        'Pazarola Yöresel Mutfak',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `Akyaka missing ${expected}`);
      }
      for (const forbidden of [
        "Leo's Pizza",
        'Lightroom',
        'Starbucks',
        "Domino's",
        'Pangea',
        'Huysuz',
        'Back Loop',
        'Collective Coffee',
        'Cennet Restaurant',
        'Sems Burger',
        'Kordon Restaurant',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `Akyaka must exclude ${forbidden}`);
      }
    }
    if (slug === 'antalya-lara') {
      assert.equal(p.getLocationBySlug('antalya-lara')?.locative, "Lara'da");
      assert.equal(disc.region.displayName, 'Lara, Antalya');
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 8, 'Antalya Lara must expose 8 categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Piccolo Neapolitan Pizza',
        'THE OVEN Pizza Napoletana',
        "Bun'ca Burger",
        'Road Smash Burgers',
        'The Finger House',
        'il Mio Coffee Kitchen',
        'MEF Space Café',
        'Nobler Coffee Shop',
        'Bella Vita Restaurant',
        'Zaruri',
        'Asmani Restaurant',
        'Art of Tart Gastro Bistrot',
        'Sanda Lara Balık',
        'Kalamar Balık',
        'Antalya Balıkevi',
        '242 Et & Izgara',
        'Sultanyar Kebap',
        'Meşhur Aksu Yıldız Köfte',
        'Sade Patisserie',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `antalya-lara missing ${expected}`);
      }
      for (const forbidden of [
        'The Sudd',
        'Flamingo Lara',
        'Wine Up',
        'Schiller',
        "Franco's Pizza",
        'Route Burger',
        'Tezgah Burger',
        'Sıralı Kebap',
        'Mahalle Burger',
        'Skull Street Food',
        'Paçacı Şemsi',
        'Akdeniz Dondurma',
        'Giliğ',
        'Pikan Fırın',
        'Pasaport Pizza',
        'Kahve Dünyası',
        'Komaş Döner',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `antalya-lara must exclude ${forbidden}`);
      }
      assert.equal(names.some((n) => n.trim() === 'Lara Balık'), false, 'antalya-lara must exclude Lara Balık');
    }
    if (slug === 'antalya-konyaalti') {
      assert.equal(p.getLocationBySlug('antalya-konyaalti')?.locative, "Konyaaltı Sahil'de");
      assert.equal(disc.region.displayName, 'Konyaaltı Sahil, Antalya');
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 8, 'Antalya Konyaalti must expose 8 categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Pile Neapolitan Pizza',
        'La Crosta Pizzeria',
        'Altınçınar Burger',
        'Smokey BBQ',
        'Jiraf Coffee & Book',
        'Element Lab Coffee',
        '7 Mehmet Restaurant',
        'Sensus Wine',
        'Cafe Pouchkine Antalya',
        'Vilanel Bakery',
        'Adab-ı Balık',
        'Harran Gurme',
        'Çamlık Pide Kebap',
        'Casaba Mahir',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `antalya-konyaalti missing ${expected}`);
      }
      for (const forbidden of [
        'Merkez Pide & Kebap',
        'Shakespeare',
        'Mahalle Burger',
        'Tezgah Burger',
        'Route Burger',
        'Giliğ',
        'Paçacı Şaban',
        'THE OVEN',
        'Mackbear',
        'The Beaver',
        'Schiller',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `antalya-konyaalti must exclude ${forbidden}`);
      }
    }
    if (slug === 'kas-merkez') {
      assert.equal(p.getLocationBySlug('kas-merkez')?.locative, "Kaş Merkez'de");
      assert.equal(disc.region.displayName, 'Kaş Merkez, Antalya');
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'kas-merkez must expose 7 coastal categories');
      assert.equal(f.venues.length, 35, 'kas-merkez must expose 35 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Kaş Merkez')),
        'Every kas-merkez card location must use street/micro-area + , Kaş Merkez label'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        "Pi'Casa",
        'Luwian Pizza',
        "Barla's Street Food",
        'FÜM Smokehouse',
        'GODO COFFEE & MORE',
        'Linckia Roastery Cafe',
        "L'Apéro Kaş",
        'Ehlikeyf Meyhane Kaş',
        'Bugün Kahvaltı Kaş',
        'Bunbun Kaş',
        'N8 Bakery',
        'Işık Lokantası Çerçiler',
        'Memedin Yeri',
        'Sardunya Restaurant',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `kas-merkez missing ${expected}`);
      }
      for (const forbidden of [
        "Domino's",
        'Bambi Cafe',
        'NURDOS',
        "Smiley's",
        'Üzüm Kızı',
        '2000 Restoran',
        'Elia Restaurant',
        'Doğal Anne Eli',
        'Olive Garden',
        'Krambi',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `kas-merkez must exclude ${forbidden}`);
      }
    }
    if (slug === 'kalkan-merkez') {
      assert.equal(p.getLocationBySlug('kalkan-merkez')?.locative, "Kalkan Merkez'de");
      assert.equal(disc.region.displayName, 'Kalkan Merkez, Antalya');
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'kalkan-merkez must expose 7 coastal categories');
      assert.equal(f.venues.length, 31, 'kalkan-merkez must expose 31 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Kalkan Merkez')),
        'Every kalkan-merkez card location must use street/micro-area + , Kalkan Merkez label'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Tesoro Pizza&Ristorante',
        'Street Munch',
        'Lycian Corner',
        'Woon Coffee & Concept',
        'Olala cafe Kalkan',
        'Sade Terrace Restaurant',
        'Eski Ev Terrace Restaurant',
        'Osmanlı Kahvesi Kahvaltı Salonu',
        'Kuşhane Tencere Yemekleri',
        'Mâbeyn Ocakbaşı',
        'Sini Cafe & Restaurant',
        'Zula Fish and Mezze',
        'Marina Restaurant Kalkan',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `kalkan-merkez missing ${expected}`);
      }
      for (const forbidden of [
        "Domino's",
        'Pasaport Pizza',
        'MOC Coffee',
        'Levent Börek',
        'saliha sultan',
        'Nur Pastanesi',
        'Hünkar Ocakbaşı',
        'Hatay Ocakbaşı',
        'Salt and Pepper',
        'Aubergine',
        "Foto's Pizza",
        'Zeytin Dalı',
        'Yayla Musa',
        'Pello Kalkan',
        'Kaliméra',
        'House Kitchen and Bar',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `kalkan-merkez must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'alanya-merkez') {
      assert.equal(p.getLocationBySlug('alanya-merkez')?.locative, "Alanya Merkez'de");
      assert.equal(disc.region.displayName, 'Alanya Merkez, Antalya');
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'alanya-merkez must expose 7 coastal categories');
      assert.equal(f.venues.length, 34, 'alanya-merkez must expose 34 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Alanya Merkez')),
        'Every alanya-merkez card location must use street/micro-area + , Alanya Merkez label'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Cafe Local',
        'Fiaba Brasserie',
        'Pizza Cafe 42',
        'Miante Burger',
        'Felice Coffee & Burger',
        'Greenspresso Coffee & Roastery',
        'Zero Coffee',
        'Kahveci Enes',
        'Mahperi Restaurant',
        'Merlot Restaurant Alanya',
        'Le Chevy Restaurant',
        'SMAK Cafe & Eatery',
        'Tersane Cafe',
        'Cuppa Corner',
        'İskele Sofrası',
        'Ravza Restaurant',
        'ÖZTAT KEBAP Alanya',
        'Aksu Köfte Piyaz İsmail Usta',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `alanya-merkez missing ${expected}`);
      }
      for (const forbidden of [
        "Domino's",
        'Burger King',
        "Papa John's",
        'Pasaport Pizza',
        'Burger Yiyelim',
        'Paper Roasting',
        'Espressolab',
        'Çıtırım Pastanesi',
        'Harbour Kitchen',
        'Gardenia Restaurant',
        'ZİLLİ ÖKÜZ',
        'Bumba Restaurant',
        'Enberi Cafe',
        'Meet’n Corner',
        'Dimçayı Pınarbaşı',
        'Croissant Atelier',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `alanya-merkez must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'side') {
      assert.equal(p.getLocationBySlug('side')?.locative, "Side'de");
      assert.equal(disc.region.displayName, 'Side, Antalya');
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'side must dynamically prune hamburger and expose 6 coastal categories');
      assert.equal(cats.some((c) => c.slug === 'hamburger'), false, 'side must prune empty hamburger category');
      assert.equal(f.venues.length, 30, 'side must expose 30 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Side')),
        'Every side card location must use street/micro-area + , Side label'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Zagon Restaurant',
        'The Harlem Side',
        'Pizza Point Bistro Cafe-Bar',
        'Ristorante Italiano',
        'Daily Core Coffee&Shop',
        'Muddy Art Cafe',
        'Glow Coffee',
        'Serenade Restaurant Bar',
        'Carpe Diem Restaurant in Side',
        'Gardenia Side Cafe&Restaurant',
        'Kibrit Kasap & Mangal',
        'Kamer Restaurant',
        'Apollonik Cafe',
        'Bardo Gelato',
        'Karadeniz Balıkçısı',
        'İskele Balık Side',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `side missing ${expected}`);
      }
      for (const forbidden of [
        'Apollon Exclusive',
        'Side Miss Pizza',
        'Burger King',
        "McDonald's",
        'LİMAN RESTAURANT LOUNGE CLUB',
        'Zula Side',
        'Side Grill House',
        'By Rasim Balıkçı',
        'Burger Bros',
        'NEHİR BALIK EVİ',
        'Güney Deniz Balık',
        'Burger Mood',
        'Taş Konak Restaurant Manavgat',
        'Cihan Pide Restoran',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `side must exclude ${forbidden}`
        );
      }
      assert.equal(names.some((n) => n.trim() === 'La Pizza'), false, 'side must exclude La Pizza');
    }
    if (slug === 'kemer') {
      assert.equal(p.getLocationBySlug('kemer')?.locative, "Kemer'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'kemer must expose 7 coastal categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Casa La Luna Kemer',
        'Sir Williams Pub & Bistro',
        'Coffee Extrax Specialty Coffee House',
        'The Lombak',
        'Qualista Restaurant Marina',
        'Kemer Pastanesi Fırın & Mutfak',
        'Liman Cafe & Bar',
        'Skyline Restaurant Kemer',
        'Nokta Balık Kemer',
        'Çaça Balık',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `kemer missing ${expected}`);
      }
      for (const forbidden of [
        "Domino's",
        'Burger King',
        "McDonald's",
        'Starbucks',
        'Mackbear',
        'Giliğ',
        'Tezgah Burger',
        'Subway',
        'PAŞA KEBAP',
        'DOY DOY DÖNER',
        'NATUREL BALIK EVİ',
        'SARAY PASTANESİ',
        'HARNUP COFFEE SHOP',
        'Forellenhof',
        'Deniz Restaurant',
        'Mithat’ın Yeri',
        'CİCİ Restaurant',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `kemer must exclude ${forbidden}`
        );
      }
      assert.equal(names.some((n) => n.trim() === 'Qualista'), false, 'kemer must exclude standalone Qualista beach club');
    }
    if (slug === 'yaniklar') {
      assert.equal(p.getLocationBySlug('yaniklar')?.locative, "Yanıklar'da");
      const cats = p.getRegionCategories(disc.region.id);
      assert.deepEqual(
        cats.map((c) => c.slug),
        ['kahvalti', 'denemelisin'],
        'yaniklar must dynamically prune empty tabs and expose only kahvalti + denemelisin'
      );
      assert.equal(f.venues.length, 6, 'yaniklar must expose 6 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Yanıklar')),
        'Every Yanıklar card location must end with , Yanıklar'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Avocado Garden Coffee',
        'Tabiat Ana Kahvaltı Bahçesi',
        'Gözleme Durağı Yanıklar',
        'Huzur Sofrası Restaurant',
        'Baraqa Hoolbox Restaurant (Tiny House)',
        'Kokobus48',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `yaniklar missing ${expected}`);
      }
      for (const forbidden of [
        'Rei Fethiye',
        'Misa Kahvalti Evi',
        'MORR Garden',
        'Sonçare Köftecisi',
        'Kâfi Fethiye',
        'Yeşil Vadi Yanıklar',
        'Suna Village',
        'Pastoral Vadi',
        'Yonca Lodge',
        'Kerpiç Evler',
        'fethiyeharputdibek',
        'Asmalı Bahçe',
        'Enver Yalçın Yörük Müzesi',
        'Çiftlik Pişiricisi',
        'Soner ustanın yeri',
        'Zoi Fish',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `yaniklar must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'gocek') {
      assert.equal(p.getLocationBySlug('gocek')?.locative, "Göcek'te");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'gocek must expose 7 coastal categories');
      assert.equal(f.venues.length, 25, 'gocek must expose 25 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Göcek')),
        'Every Göcek card location must end with , Göcek'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Mercan Pizza',
        'Drunken Bee Gocek Cafe & Bistro',
        'Bunzo Port Göcek',
        'Rizz Kitchen',
        'Dodo Cafe Göcek',
        'Adin Gusto',
        'Nena Lounge Göcek',
        'Sea Lounge | Göcek',
        'Anjelika Kitchen',
        'Monz Artisan Bakery',
        'Blues Cafe & Restaurant Göcek',
        'Tarhun Restaurant & Bar',
        'Pabechi Göcek',
        'Just Mezze Göcek',
        'Latife Meyhane Göcek',
        'Joy Restaurant and Lounge Bar',
        'Göcek Ege Balık',
        'Can Restaurant',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `gocek missing ${expected}`);
      }
      for (const forbidden of [
        'Güverte Restaurant',
        'Q Lounge',
        'Pizza Locale',
        "McDonald's",
        'MOC Coffee Roastery',
        'Caffè Nero',
        'Starbucks',
        'Kahve Dünyası',
        'MAKE ME JOI',
        'West Cafe Bistro',
        'DAMAK RESTAURANT',
        'Özcan Restaurant',
        'Lotis Prime Göcek',
        'Epocafe',
        'Soner ustanın yeri',
        'Ebegümeci',
        'Gobun Restaurant',
        'Dalaman Balık',
        'Guz Gökçeovacık',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `gocek must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'fethiye-merkez') {
      assert.equal(p.getLocationBySlug('fethiye-merkez')?.locative, "Fethiye Merkez'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'fethiye-merkez must expose 7 coastal categories');
      assert.equal(f.venues.length, 32, 'fethiye-merkez must expose 32 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Fethiye Merkez')),
        'Every Fethiye Merkez card location must end with , Fethiye Merkez'
      );
      assert.equal((f.nearbyVenues || []).length, 4, 'fethiye-merkez must expose 4 border <=400m nearbyVenues');
      assert.ok((f.nearbyVenues || []).every((n) => n.distanceMeters <= 400));
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Vicoli Neapolitan Pizza',
        'Papelli Fethiye',
        'B1 Burger',
        'HANG Smash Snack Drink',
        'Burger And More',
        'Keçi Coffee Roastery',
        'C.R.E.A.M. Coffee Roastery',
        'No Way! Speciality Coffee Shop',
        'Rise Restaurant',
        'Nomades Cafe & Restaurant',
        '2MB Sole Coffee & Eatery',
        'Ercan Usta Adana Kebapçısı',
        'Mantyka Gastro Market',
        'Lokanta Fethiye',
        'Yengeç Restaurant',
        'Cunda Balık Fethiye',
        'Öztoklu Balık Restoranı',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `fethiye-merkez missing ${expected}`);
      }
      for (const forbidden of [
        'Mozaik Bahçe',
        'Coffee de Madrid',
        'Goodeer Coffee',
        'Starbucks',
        'Burger Yiyelim',
        'Burger King',
        'Pizzabulls',
        "Domino's",
        'Little Caesars',
        'Karamel Pastane',
        'Hilmi Restaurant',
        'Girida Port',
        'Trattoria di Kukina',
        'Boğaziçi Restaurant',
        'Address Restaurant',
        'LimonH2O',
        'Doc Coffee Co.',
        'Efe Fırın',
        'Pan Restaurant Kayaköy',
        'Bella Gusto',
        'Cervos',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `fethiye-merkez must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'calis') {
      assert.equal(p.getLocationBySlug('calis')?.locative, "Çalış'ta");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'calis must expose 7 coastal categories');
      assert.equal(f.venues.length, 28, 'calis must expose 28 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Çalış')),
        'Every Calis card location must end with , Çalış'
      );
      assert.equal((f.nearbyVenues || []).length, 1, 'calis must expose 1 border <=400m nearbyVenue (Papelli Fethiye)');
      assert.ok((f.nearbyVenues || []).every((n) => n.distanceMeters <= 400));
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Mojo Italian Gusto',
        "SAPORI D'ITALIA",
        'La Casa Di Mamma Ristorante',
        'Lu Bistro',
        'Puc Coffee Roasters Co.',
        'Doc Coffee Co.',
        'Cervos Coffee Roasters',
        'Hann Coffee Roastery',
        'Levissi Luxe',
        'Efendi Fethiye',
        'YEZİ COFFEE-WINE-FOOD',
        'RakulaFethiye',
        'Sobre Coffee & Dessert',
        'Kavala Ocakbaşı',
        '10 Masa Meyhane',
        'Fethiye Meze Evi',
        'Zoi Fish Restaurant',
        'BALIK PAZARI ÇALIŞ',
        'Çalış Balıkçısı',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `calis missing ${expected}`);
      }
      for (const forbidden of [
        'Gua Coffee Company',
        'Federico',
        'Understone',
        'MADO',
        'Panama Coffee',
        'Burger Home',
        'Pizza Calisto',
        'Allora pizza',
        'Dodo coffee',
        'Babafırın',
        'Kerimoğlu',
        'SORA Sushi',
        'Ada Balık Fethiye',
        'DOĞAN BALIK MARKET',
        'Çalış Beach Indian',
        'Sushi Station',
        'Sundia Exclusive',
        'Papelli Fethiye',
        'Terra Pizza',
        'Pasaport Pizza',
        'Burger King',
        'zentara',
        'Rodos Balıkçısı',
        'Ada Restaurant Sovalye',
        'Beyoğlu Pide',
        'Akarca',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `calis must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'oludeniz') {
      assert.equal(p.getLocationBySlug('oludeniz')?.locative, "Ölüdeniz'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'oludeniz must expose 7 coastal categories');
      assert.equal(f.venues.length, 14, 'oludeniz must expose 14 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Ölüdeniz')),
        'Every Oludeniz card location must end with , Ölüdeniz'
      );
      assert.equal((f.nearbyVenues || []).length, 0, 'oludeniz must have 0 <=400m nearbyVenues');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'İnfinity Pizza Ölüdeniz',
        'FOODBOX ÖLÜDENİZ KEBAP VE HAMBURGER',
        'The HangOut Ölüdeniz',
        'Fly Coffee',
        'Jade Terrace Food & Drink',
        'Rose Garden Restoran Bar',
        'Secret Garden Restaurant',
        'Bake & More Ölüdeniz',
        'Banana Cafe & Beach',
        'Nice N Easy',
        'Safran Turkish Delights & Baklava',
        'The Kumsal Restaurant',
        'Oyster Restaurant Ölüdeniz',
        'Buzz Beach Bar',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `oludeniz missing ${expected}`);
      }
      for (const forbidden of [
        'Pellini',
        'Starbucks',
        "Domino's Pizza",
        'Jade Residence',
        'Sea Horse Beach Club',
        'Ölüdeniz Sahil',
        'Bella Gusto',
        'MONTEBELLO KITCHEN',
        'Mimoza Cafe',
        'Şey Beach Lounge',
        'Captain Hook',
        'Paradise Beach',
        'Ottoman restaurant',
        'BamBoo Restaurant',
        'Sea Horse Restoran',
        'Cake Coffee',
        'Dominic Restaurant',
        'Loca Luna',
        'Shiraz Eat & Drink',
        'Karizma Restaurant',
        'Narlı bahçe',
        'Qaya Lounge',
        'Balbura',
        'Hisarönü',
        'Ovacık',
        'Kayaköy',
        'Faralya',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `oludeniz must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'bodrum-merkez') {
      assert.equal(p.getLocationBySlug('bodrum')?.locative, "Bodrum Merkez'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'bodrum-merkez must expose 7 coastal categories');
      assert.equal(f.venues.length, 36, 'bodrum-merkez must expose 36 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Bodrum Merkez')),
        'Every Bodrum Merkez card location must end with , Bodrum Merkez'
      );
      assert.equal(
        (f.nearbyVenues || []).length,
        3,
        'bodrum-merkez must expose 3 border <=400m nearbyVenues from Gümbet'
      );
      assert.ok((f.nearbyVenues || []).every((n) => n.distanceMeters <= 400));
      assert.ok((f.nearbyVenues || []).some((n) => n.name.includes('Pixel Burger')));
      assert.ok((f.nearbyVenues || []).some((n) => n.name.includes('The Colombia')));
      assert.ok((f.nearbyVenues || []).some((n) => n.name.includes('Gumbet Dragon')));
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Arka Ristorente Pizzeria Bodrum',
        'Mamarossa Pizzeria',
        '4Munchies Bodrum Merkez',
        'DIY and Green / Art & Coffee Shop',
        'La Pasion Bodrum',
        'Bakery Stuff Bodrum',
        'Nazik Ana Restaurant',
        'Gemibaşı Restaurant',
        'Orfoz Restaurant Bodrum',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `bodrum-merkez missing ${expected}`);
      }
      for (const forbidden of [
        'Starbucks',
        'Kahve Dünyası',
        'Espressolab',
        'Caffè Nero',
        'Terra Pizza',
        'Endless Pizza',
        'Coffee LAB',
        'Kaleiçi Muhallebicisi',
        'So Big Gastro Pub',
        'iki sandal',
        'Memedof',
        'Cheers Restaurant',
        'Kuytu Bahçe',
        'Crudo Bodrum',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `bodrum-merkez must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'yalikavak') {
      assert.equal(p.getLocationBySlug('yalikavak')?.locative, "Yalıkavak'ta");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'yalikavak must expose 6 categories (kahve pruned)');
      assert.equal(cats.some((c) => c.slug === 'kahve'), false, 'yalikavak must prune kahve');
      assert.equal(f.venues.length, 20, 'yalikavak must expose 20 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Yalıkavak')),
        'Every Yalikavak card location must end with , Yalıkavak'
      );
      assert.equal((f.nearbyVenues || []).length, 0, 'yalikavak must have 0 <=400m nearbyVenues');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Arka Pizzeria Yalıkavak',
        'Burger 85 Yalıkavak',
        "Sofi’s Marina Brasserie",
        'Sefte Bahçe',
        'Aloha Bakery',
        'Çardaklı Restaurant',
        'Memedof Balık Restaurant',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `yalikavak missing ${expected}`);
      }
      for (const forbidden of [
        'Zuma Bodrum',
        'Novikov',
        'Nusr-Et',
        'Bagatelle',
        'HuQQa',
        'Meet Lab',
        'BLAK Coffee',
        'Starbucks',
        'Godiva',
        "Five O'Clock",
        'Muà',
        'Sait',
        'Asmalı Çardak',
        'Kavaklı Köftecisi',
        'JOUR Bodrum',
        'ATILAY',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `yalikavak must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'gumusluk') {
      assert.equal(p.getLocationBySlug('gumusluk')?.locative, "Gümüşlük'te");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 5, 'gumusluk must expose 5 active categories (hamburger & kahve pruned)');
      assert.equal(cats.some((c) => c.slug === 'hamburger'), false, 'gumusluk must prune hamburger');
      assert.equal(cats.some((c) => c.slug === 'kahve'), false, 'gumusluk must prune kahve');
      assert.equal(f.venues.length, 19, 'gumusluk must expose 19 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Gümüşlük')),
        'Every Gumusluk card location must end with , Gümüşlük'
      );
      assert.equal((f.nearbyVenues || []).length, 0, 'gumusluk must have 0 <=400m nearbyVenues');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Munda Gümüşlük',
        'Sia Eli Bodrum',
        'Teras Gümüşlük',
        'Daisy Coffee & Breakfast',
        'Furnos',
        'Social Gümüşlük',
        'Karafaki Erhan Usta',
        'Gümüşlük Balık Evi',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `gumusluk missing ${expected}`);
      }
      for (const forbidden of [
        'Mimoza',
        'Melengeç',
        'Tuz Duman',
        'Club Gümüşlük',
        'Zeytun Balık',
        'LİMON GÜMÜŞLÜK',
        'Starbucks',
        'Big Chefs',
        'Battalbey',
        'Zerde',
        'Değirmen Lokantası',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `gumusluk must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'turkbuku') {
      assert.equal(p.getLocationBySlug('turkbuku')?.locative, "Türkbükü'nde");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'turkbuku must expose 7 coastal categories');
      assert.equal(f.venues.length, 15, 'turkbuku must expose 15 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Türkbükü')),
        'Every Turkbuku card location must end with , Türkbükü'
      );
      assert.equal(
        (f.nearbyVenues || []).length,
        1,
        'turkbuku must have 1 <=400m nearbyVenue (Kucukbuk border Ekmek Iskelesi)'
      );
      assert.ok(
        f.nearbyVenues[0].distanceMeters <= 400 &&
          f.nearbyVenues[0].name.includes('Ekmek İskelesi'),
        'Turkbuku nearbyVenue must be Ekmek Iskelesi within <= 400m of border'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Mila Türkbükü',
        'Hörn Türkbükü',
        'Intense Burger',
        'Lago Bodrum',
        'Mana Türkbükü',
        'Farina',
        'Solmaz Hanımın Mutfağı',
        'Çetimek Restaurant',
        'Dalgıç Türkbükü',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `turkbuku missing ${expected}`);
      }
      for (const forbidden of [
        'Hakkasan',
        'Paper Moon',
        'Lokanta by Divan',
        'Vakko',
        'Gaia Bodrum',
        'Fırın Bi Tatlı Tuzlu',
        'ATILAY',
        'Miam',
        'Macakizi',
        'DAZE',
        'JOUR Bodrum',
        'Torba Cafe',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `turkbuku must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'bitez') {
      assert.equal(p.getLocationBySlug('bitez')?.locative, "Bitez'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'bitez must expose 7 coastal categories');
      assert.equal(f.venues.length, 26, 'bitez must expose 26 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Bitez')),
        'Every Bitez card location must end with , Bitez'
      );
      assert.equal(
        (f.nearbyVenues || []).length,
        2,
        'bitez must expose 2 border <=400m nearbyVenues from Gümbet'
      );
      assert.ok((f.nearbyVenues || []).every((n) => n.distanceMeters <= 400));
      assert.ok((f.nearbyVenues || []).some((n) => n.name.includes('Iconic Beach')));
      assert.ok((f.nearbyVenues || []).some((n) => n.name.includes('Bodrum Kalabalık Ocakbaşı')));
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'il mio sogno',
        'Elvis Bar',
        'Odd Burger Co.',
        'Fika Coffee Tea',
        'Cibez Bitez',
        'Kuytu Bahçe Bodrum',
        'Van Kahvaltı Lounge Bodrum Bitez',
        'Bitez Kuru Fasulye',
        'Karavida Bitez',
        'Aqua Restaurant Bitez',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `bitez missing ${expected}`);
      }
      for (const forbidden of [
        'Bitez Dondurmacısı',
        'Eleos',
        'Pasaport Pizza',
        'Starbucks',
        'Bağarası',
        'Balikçı İsmet',
        'OSLO BİTEZ',
        'Havandan',
        'Vula Bodrum',
        'Kruvasancı',
        'Cheers Restaurant',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `bitez must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'turgutreis') {
      assert.equal(p.getLocationBySlug('turgutreis')?.locative, "Turgutreis'te");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'turgutreis must expose 6 coastal categories (empty pizza pruned)');
      assert.ok(!cats.some((c) => c.slug === 'pizza'), 'turgutreis must prune empty pizza category');
      assert.equal(f.venues.length, 25, 'turgutreis must expose 25 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Turgutreis')),
        'Every Turgutreis card location must end with , Turgutreis'
      );
      assert.equal((f.nearbyVenues || []).length, 0, 'turgutreis must have 0 <=400m nearbyVenues');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Milanz Crispy',
        'Blue Coffee Bar',
        'Caffeine Coffee Turgutreis',
        'Costa Del Sueno',
        'Bitter Bodrum',
        'Salt Kitchen & Lounge',
        'Kupula Bahçe',
        'Turgutreis Doğal Dondurma',
        'Değirmen Lokantası',
        'Hadi Balık',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `turgutreis missing ${expected}`);
      }
      for (const forbidden of [
        'Big Chefs',
        'Starbucks',
        'Kahve Dünyası',
        'Caffè Nero',
        'Ekleristan',
        'BİTEZ DONDURMA',
        'Sunger Pizza',
        'Diva Pastanesi',
        'İzze Coffee',
        'Cotto Cafe Kadikalesi',
        'Zerde',
        'Marea Fish',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `turgutreis must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'ortakent-yahsi') {
      assert.equal(p.getLocationBySlug('ortakent-yahsi')?.locative, "Ortakent ve Yahşi'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'ortakent-yahsi must expose 7 coastal categories');
      assert.equal(f.venues.length, 19, 'ortakent-yahsi must expose 19 verified venues');
      assert.ok(
        f.venues.every(
          (v) =>
            typeof v.location === 'string' &&
            (v.location.endsWith(', Ortakent') || v.location.endsWith(', Yahşi'))
        ),
        'Every Ortakent & Yahsi card location must end with , Ortakent or , Yahşi'
      );
      assert.equal((f.nearbyVenues || []).length, 0, 'ortakent-yahsi must have 0 <=400m nearbyVenues');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'İZ Bodrum',
        'Mid Burger Yahşi',
        'Nis Coffee & Bakery',
        'Mini Coffee Shop',
        'Yaghane Cafe&Bistro',
        'Yarbasan Restaurant',
        'FIRINCI',
        'Cezayir Usta Bodrum Döner Salonu',
        "Ramo'nun Yeri Bodrum",
        'Balıkçının Yeri Balık Restaurant',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `ortakent-yahsi missing ${expected}`);
      }
      for (const forbidden of [
        'Big Chefs',
        'Starbucks',
        'Caffè Nero',
        'Kahve Dünyası',
        'COSTA COFFEE',
        'Bursa Kebap Evi',
        'Chinese Inn',
        'Süzgeç',
        'TUZZ RESTAURANT',
        'Crudo Bodrum',
        'Geremeli',
        'Mernas Bahçe',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `ortakent-yahsi must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'gundogan') {
      assert.equal(p.getLocationBySlug('gundogan')?.locative, "Gündoğan'da");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 5, 'gundogan must expose 5 coastal categories (hamburger & kahve pruned)');
      assert.ok(
        !cats.some((c) => c.slug === 'hamburger') && !cats.some((c) => c.slug === 'kahve'),
        'gundogan must prune empty hamburger and kahve categories'
      );
      assert.equal(f.venues.length, 17, 'gundogan must expose 17 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.endsWith(', Gündoğan')),
        'Every Gundogan card location must end with , Gündoğan'
      );
      assert.equal((f.nearbyVenues || []).length, 0, 'gundogan must have 0 <=400m nearbyVenues');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Gündoğan Pam Pizza',
        'JOUR Bodrum',
        'Piha Bodrum',
        'Itsumi Bodrum',
        'Bodrum Hayat Kahvaltı Evi',
        'Ekmek İskelesi & Beequpa Kahve',
        'Güno Ocakbaşı Steakhouse',
        'Akbalık Restaurant',
        'Paragadi Bodrum Balık Restaurant',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `gundogan missing ${expected}`);
      }
      for (const forbidden of [
        'Royal Fırın',
        'Bitez Dondurma',
        'Midyeci Şehmus',
        'Sail Loft',
        'Reana Restaurant',
        'quzine Kahvaltı',
        'Moon Burger',
        'murgarita pizza',
        'SAFİYE YALIKAVAK',
        'KAHRAMAN BODRUM',
        'Farina',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `gundogan must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'gumbet') {
      assert.equal(p.getLocationBySlug('gumbet')?.locative, "Gümbet'te");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(
        cats.length,
        3,
        'gumbet must expose 3 coastal categories (pizza, kahve, kahvalti & balik pruned)'
      );
      assert.ok(
        !cats.some(
          (c) =>
            c.slug === 'pizza' ||
            c.slug === 'kahve' ||
            c.slug === 'kahvalti' ||
            c.slug === 'balik-deniz-urunleri'
        ),
        'gumbet must prune empty pizza, kahve, kahvalti and balik-deniz-urunleri categories'
      );
      assert.equal(f.venues.length, 11, 'gumbet must expose 11 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.endsWith(', Gümbet')),
        'Every Gumbet card location must end with , Gümbet'
      );
      assert.equal((f.nearbyVenues || []).length, 2, 'gumbet must expose 2 border <=400m nearbyVenues from Bitez');
      assert.ok((f.nearbyVenues || []).every((n) => n.distanceMeters <= 400));
      assert.ok((f.nearbyVenues || []).some((n) => n.name.includes('Odd Burger')));
      assert.ok((f.nearbyVenues || []).some((n) => n.name.includes('Sade Bodrum')));
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Pixel Burger Bodrum',
        'ANNALIVIA RESTAURANT GUMBET',
        'Mistral Bay Steak & Wine House',
        'The Colombia Restoran Steak House',
        'Iconic Beach Bodrum',
        'Gumbet Dragon Chinese and Indian Restaurant & Sushi Bar',
        'Hane Ocakbaşı Gümbet',
        'Bodrum Kalabalık Ocakbaşı Restaurant',
        'Konya Uğurlu Restorant',
        'Baki Ustanın Yeri',
        'KÖZHAN ET DÖNER BODRUM',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `gumbet missing ${expected}`);
      }
      for (const forbidden of [
        'Madu Bodrum',
        "Bosstan's",
        'FAMİLY DOOR',
        'Cheers Restaurant',
        'Bamboo house',
        'Landscape Bistro',
        'Maharet Mantı',
        'Oses',
        'Royal Pastanesi',
        'Burger King',
        'Odd Burger',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `gumbet must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'torba') {
      assert.equal(p.getLocationBySlug('torba')?.locative, "Torba'da");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(
        cats.length,
        4,
        'torba must expose 4 coastal categories (pizza, hamburger & kahve pruned)'
      );
      assert.ok(
        !cats.some((c) => c.slug === 'pizza' || c.slug === 'hamburger' || c.slug === 'kahve'),
        'torba must prune empty pizza, hamburger and kahve categories'
      );
      assert.equal(f.venues.length, 8, 'torba must expose 8 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.endsWith(', Torba')),
        'Every Torba card location must end with , Torba'
      );
      assert.equal((f.nearbyVenues || []).length, 0, 'torba must have 0 <=400m nearbyVenues');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Torba Çakıl Beach',
        'Ezi Restaurant',
        'Rise Restaurant',
        'Torba Cafe (Bodrum Belediyesi)',
        'BODRUM Çardak Kokoreç ve Köfte',
        "Hoca'nın Yeri",
        'Essahlı Adana İşi',
        'Gonca Balık Bodrum',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `torba missing ${expected}`);
      }
      for (const forbidden of [
        'Mehmetin Yeri',
        'Susona Bodrum',
        'Voyage Torba',
        'Hyde Bodrum',
        'Starbucks',
        'Big Chefs',
        'KARYA FIRIN',
        'belediye Kafe',
        'Torba Unlu Mamulleri',
        'Dalli Restaurant',
        'El Papi',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `torba must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'akyarlar') {
      assert.equal(p.getLocationBySlug('akyarlar')?.locative, "Akyarlar'da");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'akyarlar must expose 6 coastal categories (kahve pruned)');
      assert.ok(
        !cats.some((c) => c.slug === 'kahve'),
        'akyarlar must prune empty kahve category'
      );
      assert.equal(f.venues.length, 10, 'akyarlar must expose 10 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.endsWith(', Akyarlar')),
        'Every Akyarlar card location must end with , Akyarlar'
      );
      assert.equal(
        (f.nearbyVenues || []).length,
        1,
        'akyarlar must expose 1 border <=400m nearbyVenue from Turgutreis (Costa Del Sueno)'
      );
      assert.ok((f.nearbyVenues || []).every((n) => n.distanceMeters <= 400));
      assert.ok((f.nearbyVenues || []).some((n) => n.name.includes('Costa Del Sueno')));
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Antre Pizza Aspat',
        'BURGER HOUSE BODRUM',
        'Tiki Beach Bodrum',
        'Yalı Cafe Akyarlar',
        'Bake My Day Anthaven',
        'Cafeluka lokanta',
        'Kaptanın yeri',
        'Marea Fish Restaurant',
        'Fener Restaurant',
        'Mehtap Restaurant & Cafe',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `akyarlar missing ${expected}`);
      }
      for (const forbidden of [
        'Tipsy Crab',
        'Buselik Meyhane',
        'Magnolia Shop',
        'Kahve Dünyası',
        'Bedri Usta',
        'Big Chefs',
        'Çaytaze',
        'Makbush',
        'Radisson Collection',
        'Kayıkhane Bodrum',
        'Castello Aspat',
        'Asia Hotel',
        'Jura İskele',
        'Costa Del Sueno',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `akyarlar must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'marmaris-merkez') {
      assert.equal(p.getLocationBySlug('marmaris-merkez')?.locative, "Marmaris Merkez'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'marmaris-merkez must expose 7 coastal categories');
      assert.equal(f.venues.length, 35, 'marmaris-merkez must expose 35 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.endsWith(', Marmaris Merkez')),
        'Every Marmaris Merkez card location must end with , Marmaris Merkez'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Slice of Pizza Luna',
        'Gusto Pizza & More Marmaris',
        'ESCADO BURGER MARMARIS',
        'Munch Burger',
        'Foru Coffee + Tea',
        'AVLU Coffee, Etc.',
        'OZ COFFEE 40 YIL SONRA',
        'Pineapple Restaurant',
        'Maree Cafe',
        'EGE SEFASI MARMARİS',
        'Esnaf Marmaris',
        'Dr. Gelato',
        'Balıkçıl Balık Restoranı',
        'O`yes restaurant',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `marmaris-merkez missing ${expected}`);
      }
      for (const forbidden of [
        'Terra Pizza',
        'Burger King',
        "Robert's Coffee",
        'Pizza Locale',
        'Burger Yiyelim',
        "Domino's Pizza",
        'Obadan Coffee',
        'Kırçiçeği',
        'Tekin Usta',
        'Meliha Hanım',
        'Books & Coffee',
        'Marvella Coffee',
        'Şefler & Cafe Pastane',
        'Fredonia Coffee',
        'Nil Balık',
        'Cafe Anne',
        'Cosy Corner',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `marmaris-merkez must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'datca-merkez') {
      assert.equal(p.getLocationBySlug('datca-merkez')?.locative, "Datça Merkez'de");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'datca-merkez must expose 7 coastal categories');
      assert.equal(f.venues.length, 32, 'datca-merkez must expose 32 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.endsWith(', Datça Merkez')),
        'Every Datça Merkez card location must end with , Datça Merkez'
      );
      const denemCat = p.getCategoryResult(disc.region.id, 'denemelisin');
      assert.ok(denemCat && denemCat.coreVenues.length === 10);
      assert.ok(
        denemCat.coreVenues[0].name.includes('Sevinç'),
        `datca-merkez denemelisin #1 must be Sevinç'in Lezzet Sofrası (got ${denemCat.coreVenues[0].name})`
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'D-PO Pizza',
        'Lezzet Restaurant',
        'Smashora Datça',
        'Datça.burger köfte',
        'SOSO Coffee House',
        'Züraf Datça',
        'Ege Meyhanesi',
        'Âlâ Restaurant',
        'Meyhane Datca',
        'Cafe Inn',
        "Sevinç'in Lezzet Sofrası",
        'DATÇA OCAKBAŞI',
        'İl Fico Gelato',
        'İskandil Balık',
        'Kumluk Big Balık',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `datca-merkez missing ${expected}`);
      }
      for (const forbidden of [
        'Serap Cafe',
        'AZZURRA',
        "Domino's Pizza",
        'Burger King',
        'Cajun corner',
        'Meliha Hanım',
        'Tekin Usta',
        'No:96 Patisserie',
        'Ekim Pastanesi',
        'Lumi Coffee',
        'Kekik Restoran',
        'Zekeriya Sofrası',
        'EskiDatçaBurger',
        'PIZZA TRIO',
        'Franco Pizza',
        'Palamut Restaurant',
        'Tales Datça',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `datca-merkez must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'alsancak') {
      assert.equal(p.getLocationBySlug('alsancak')?.locative, "Alsancak'ta");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'alsancak must expose 7 coastal categories');
      assert.equal(f.venues.length, 29, 'alsancak must expose 29 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.endsWith(', Alsancak')),
        'Every Alsancak card location must end with , Alsancak'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Winapoli',
        'Ristorante Pizzeria Venedik',
        'Harbourger',
        'REEL BURGER',
        'Soviet Coffee Gallery',
        'Coffeemamma',
        'Alliance Kordon',
        'Madame Prokopp',
        'Improvement',
        'Uwawi',
        'Zeynel Ergin',
        'Alsancak Dostlar Fırını',
        'Çelebi Unlu Mamuller',
        'Sevinç Pastanesi',
        'Alsancak Balık Pişiricisi',
        'İzmir Deniz Restaurant',
        'Birinci Kordon Balık',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `alsancak missing ${expected}`);
      }
      for (const forbidden of [
        'Tuzu Biberi',
        'Reyhan Pastanesi',
        'Leone Patisserie',
        'Burger Street',
        'Two Hands Burger',
        'Buckin Coffee',
        'Poka Coffee',
        'Cızz Bızz',
        'Hane Çikolata',
        'Sakız Alsancak',
        'Tavacı Recep',
        'Saveur Cake',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `alsancak must exclude ${forbidden}`
        );
      }
    }
    if (slug === 'bostanli') {
      assert.equal(p.getLocationBySlug('bostanli')?.locative, "Bostanlı'da");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 7, 'bostanli must expose 7 coastal categories');
      assert.equal(f.venues.length, 26, 'bostanli must expose 26 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.endsWith(', Bostanlı')),
        'Every Bostanlı card location must end with , Bostanlı'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Kupika',
        'Soledo',
        'Spazzo',
        'Sanos Burger',
        'Jungle Burger',
        'Nomi Burger',
        'Gracia Coffee',
        'Lot Coffee Roastery',
        'Myth Coffee',
        'Cucina Maestra',
        'Karaf Meyhane',
        'Kulüp Meyhane',
        'Nuvia Bostanlı',
        'Le Dimanche',
        'Rue Gelato',
        'gibi vegan',
        'Neuf Patisserie',
        'Pişir Balıkçım',
        'OLTA BALIK BOSTANLI',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `bostanli missing ${expected}`);
      }
      for (const forbidden of [
        'Boğaziçi Restaurant',
        'Bravo Patisserie',
        'Goldenfingers',
        'Slices of The World',
        'Uptown Pizza',
        'Sasso Fried Chicken',
        'Moradaris',
        'Pizza Rucola',
        'Kybele Pizza',
        'Gusto Cafe',
        'The Leaf Coffee',
        'Smör Bakery',
      ]) {
        assert.equal(
          names.some((n) => n.toLocaleLowerCase('tr').includes(forbidden.toLocaleLowerCase('tr'))),
          false,
          `bostanli must exclude ${forbidden}`
        );
      }
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
        p.searchLocations('firuzaga').some((l) => l.slug === 'cihangir'),
        'searchLocations("firuzaga") must match cihangir'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'cihangir must expose 6 categories');
      assert.equal(f.venues.length, 23, 'cihangir must expose 23 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Cihangir')),
        'Every Cihangir card location must use street + , Cihangir label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Pizza Bianca Italiano');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name,
        'B.A.D Burger Basic And Delicious'
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name,
        'Ground Coffee Company Cihangir'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, 'Rose Marine Cihangir');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[1].name, 'Cafe Firuz');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Kaktüs Cihangir');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        '1932 Cihangir Doyum Mantı'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Pizza Bianca Italiano',
        'B.A.D Burger',
        'Ground Coffee Company Cihangir',
        'Mundo Novo Cafe Cihangir',
        'Rose Marine Cihangir',
        'Demeti Meyhanesi',
        'Cafe Firuz',
        'Kaktüs Cihangir',
        'Van Kahvaltı Evi',
        '1932 Cihangir Doyum Mantı',
        'Tarihi Savoy Pastanesi 1950',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `cihangir missing ${expected}`);
      }
      for (const forbidden of [
        'Espressolab',
        'Kronotrop',
        'Pizzabulls',
        'Homevibe',
        'Cuma',
        'Jash',
        '49 Çukurcuma',
        'UN Cihangir',
      ]) {
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
    if (slug === 'cukurcuma') {
      assert.equal(p.getLocationBySlug('cukurcuma')?.locative, "Çukurcuma'da");
      assert.equal(p.getLocationBySlug('cukurcuma-beyoglu')?.slug, 'cukurcuma');
      assert.ok(
        p.searchLocations('turnacibasi').some((l) => l.slug === 'cukurcuma'),
        'searchLocations("turnacibasi") must match cukurcuma'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 5, 'cukurcuma must auto-prune hamburger and expose 5 categories');
      assert.equal(
        cats.some((c) => c.id === 'hamburger'),
        false,
        'cukurcuma must hide hamburger under Yoksa Gosterme rule'
      );
      assert.equal(f.venues.length, 19, 'cukurcuma must expose 19 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Çukurcuma')),
        'Every Cukurcuma card location must use street + , Çukurcuma label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'UN Cihangir');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Cosmos Coffee Event');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, 'Solera Winery');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Meraki Cihangir Cafe');
      assert.equal(p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name, 'Mayko Lokanta');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'UN Cihangir',
        '49 Çukurcuma',
        'Cosmos Coffee Event',
        'Müz Botanik',
        'Solera Winery',
        'No 19 Dining',
        'Meraki Cihangir Cafe',
        'Mayko Lokanta',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `cukurcuma missing ${expected}`);
      }
      for (const forbidden of [
        'Cuma',
        'Betro',
        'Bolçi',
        'Hayvore',
        'B.A.D Burger',
        'David People',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `cukurcuma must exclude ${forbidden}`);
      }
    }
    if (slug === 'balat') {
      assert.equal(p.getLocationBySlug('balat')?.locative, "Balat'ta");
      assert.equal(p.getLocationBySlug('balat-fatih')?.slug, 'balat');
      assert.ok(
        p.searchLocations('fener').some((l) => l.slug === 'balat'),
        'searchLocations("fener") must match balat'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'balat must expose 6 categories');
      assert.equal(f.venues.length, 23, 'balat must expose 23 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Balat')),
        'Every Balat card location must use street + , Balat label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Forno Balat');
      assert.equal(p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name, 'Burgermoon');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Coffee Department');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, 'Primi Balat');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Maison Balat');
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        'Agora Meyhanesi 1890'
      );
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Forno Balat',
        'Burgermoon',
        'Coffee Department',
        'Primi Balat',
        'Maison Balat',
        'Agora Meyhanesi 1890',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `balat missing ${expected}`);
      }
      for (const forbidden of [
        'Velvet Cafe',
        'David People',
        'Paper Roasting',
        'Asırlık Tencere',
        '8one',
        'Soil',
        'Francala',
        'Pops Balat',
        'Perispri',
        'Cibalikapı',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `balat must exclude ${forbidden}`);
      }
    }
    if (slug === 'yenikoy') {
      assert.equal(p.getLocationBySlug('yenikoy')?.locative, "Yeniköy'de");
      assert.equal(p.getLocationBySlug('yenikoy-sariyer')?.slug, 'yenikoy');
      assert.ok(
        p.searchLocations('koybasi').some((l) => l.slug === 'yenikoy'),
        'searchLocations("koybasi") must match yenikoy'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 5, 'yenikoy must expose 5 active categories with pizza and hamburger pruned');
      assert.equal(cats.some((c) => c.slug === 'pizza'), false, 'yenikoy must prune pizza');
      assert.equal(cats.some((c) => c.slug === 'hamburger'), false, 'yenikoy must prune hamburger');
      assert.equal(
        cats.some((c) => c.slug === 'balik-deniz-urunleri'),
        true,
        'yenikoy must expose balik-deniz-urunleri coastal category'
      );
      assert.equal(f.venues.length, 18, 'yenikoy must expose 18 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Yeniköy')),
        'Every Yenikoy card location must use street + , Yeniköy label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Grea Coffee Nations');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, 'Araka');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Apartıman Yeniköy');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues.length, 4);
      assert.ok(
        p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues.some((v) => v.name === 'Bramble Cafe Yeniköy')
      );
      assert.equal(
        p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name,
        'Evimiz Osmanlı Mutfağı'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'balik-deniz-urunleri').coreVenues[0].name, 'Sandal Balık');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Grea Coffee Nations',
        'Araka',
        'Bramble Cafe Yeniköy',
        'Evimiz Osmanlı Mutfağı',
        'Sandal Balık',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `yenikoy missing ${expected}`);
      }
      for (const forbidden of [
        "Vagabondo's",
        'White Burger',
        'HOPDADDY',
        'Fiko Yeniköy',
        'VOI Yeniköy',
        'İoki',
        'Girandola',
        'Flamor',
        'Haga Smash',
        'Gazebo',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `yenikoy must exclude ${forbidden}`);
      }
    }
    if (slug === 'gokturk') {
      assert.equal(p.getLocationBySlug('gokturk')?.locative, "Göktürk'te");
      assert.equal(p.getLocationBySlug('gokturk-eyupsultan')?.slug, 'gokturk');
      assert.ok(
        p.searchLocations('larus palas').some((l) => l.slug === 'gokturk'),
        'searchLocations("larus palas") must match gokturk'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'gokturk must expose 6 categories');
      assert.equal(f.venues.length, 25, 'gokturk must expose 25 verified venues');
      assert.ok(
        f.venues.every((v) => typeof v.location === 'string' && v.location.includes(', Göktürk')),
        'Every Gokturk card location must use street + , Göktürk label'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Pizza Alto');
      assert.equal(p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name, 'Pascal Smash Burger');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Løke & Sip');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, 'Lokanta Göktürk');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, "Mayko'nun Mutfağı");
      assert.equal(p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name, 'Arcadium Kebapçı');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Pizza Alto',
        'Pascal Smash Burger',
        'Løke & Sip',
        'Lokanta Göktürk',
        "Mayko'nun Mutfağı",
        'Arcadium Kebapçı',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `gokturk missing ${expected}`);
      }
      for (const forbidden of [
        'Espressolab',
        'Kronotrop',
        'BigChefs',
        'Little Caesars',
        'Numnum',
        'IL Forno',
        'Laos Coffee',
        'Moso Gelato',
        'Dekante',
        'Yeşil Orman',
        'Yeşil Vadi',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `gokturk must exclude ${forbidden}`);
      }
    }
    if (slug === 'asmalimescit') {
      assert.equal(p.getLocationBySlug('asmalimescit')?.locative, "Asmalımescit ve Pera'da");
      assert.equal(p.getLocationBySlug('beyoglu')?.slug, 'asmalimescit');
      assert.ok(
        p.searchLocations('tunel').some((l) => l.slug === 'asmalimescit'),
        'searchLocations("tunel") must match asmalimescit'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 5, 'asmalimescit must auto-prune hamburger and expose 5 categories');
      assert.equal(
        cats.some((c) => c.id === 'hamburger'),
        false,
        'asmalimescit must hide hamburger under Yoksa Gosterme rule'
      );
      assert.equal(f.venues.length, 25, 'asmalimescit must expose 25 verified venues');
      assert.ok(
        f.venues.every(
          (v) =>
            typeof v.location === 'string' &&
            (v.location.endsWith(', Asmalımescit') || v.location.endsWith(', Pera'))
        ),
        'Every Asmalimescit & Pera card location must end with , Asmalımescit or , Pera'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Pizzeria Pera');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Mandabatmaz');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, 'Mikla');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Mornings In Pera');
      assert.equal(p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name, 'Asmalı Cavit');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Pizzeria Pera',
        'Play Pizza',
        'Mandabatmaz',
        'Mikla',
        'Yeni Lokanta',
        'Mornings In Pera',
        'Kafe Ara',
        'Asmalı Cavit',
        'Fıccın Restoran',
        '1924 İstanbul',
        'Yakup 2',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `asmalimescit missing ${expected}`);
      }
      for (const forbidden of [
        'Lebon',
        'Espressolab',
        'Viyana Kahvesi',
        'Betro Burger',
        'Midpoint',
        'Eleos',
        'Patisserie De Pera',
        'Jadore',
        'Miss Pizza',
        'Moc Pera',
        'Noir Pit',
        'Galata Frida',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `asmalimescit must exclude ${forbidden}`);
      }
    }
    if (slug === 'taksim') {
      assert.equal(p.getLocationBySlug('taksim')?.locative, "Taksim ve İstiklal'de");
      assert.equal(p.getLocationBySlug('istiklal')?.slug, 'taksim');
      assert.ok(
        p.searchLocations('nevizade').some((l) => l.slug === 'taksim'),
        'searchLocations("nevizade") must match taksim'
      );
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'taksim must expose 6 categories');
      assert.equal(f.venues.length, 28, 'taksim must expose 28 verified venues');
      assert.ok(
        f.venues.every(
          (v) =>
            typeof v.location === 'string' &&
            (v.location.endsWith(', Taksim') || v.location.endsWith(', İstiklal'))
        ),
        'Every Taksim & Istiklal card location must end with , Taksim or , İstiklal'
      );
      assert.equal(p.getCategoryResult(disc.region.id, 'pizza').coreVenues[0].name, 'Antique Pizzeria Beyoğlu');
      assert.equal(p.getCategoryResult(disc.region.id, 'hamburger').coreVenues[0].name, 'Smash Square Burger');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahve').coreVenues[0].name, 'Vinyl and Coffee');
      assert.equal(p.getCategoryResult(disc.region.id, 'date-mekanlari').coreVenues[0].name, 'The Red Balloon');
      assert.equal(p.getCategoryResult(disc.region.id, 'kahvalti').coreVenues[0].name, 'Tarihi Van Kahvaltı Evi 1978');
      assert.equal(p.getCategoryResult(disc.region.id, 'denemelisin').coreVenues[0].name, 'Hacı Abdullah Lokantası');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Antique Pizzeria Beyoğlu',
        'Smash Square Burger',
        'Vinyl and Coffee',
        'The Red Balloon',
        'Biz İstanbul',
        'Tarihi Van Kahvaltı Evi 1978',
        'Lades Menemen',
        'Hacı Abdullah Lokantası',
        'Tunç Balık Beyoğlu',
        'Reşat Balık Market',
        'Zübeyir Ocakbaşı',
        'İnci Pastanesi',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `taksim missing ${expected}`);
      }
      for (const forbidden of [
        'Changa',
        'Espressolab',
        'Hafız Mustafa',
        'Kızılkayalar',
        'Balkan Lokantası',
        'Saray Muhallebicisi',
        'Bambi Cafe',
        'Bolci',
        'Mono Burger',
        "Hero's Pizza",
        'Simit sarayi',
      ]) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `taksim must exclude ${forbidden}`);
      }
    }
    const cats = p.getRegionCategories(disc.region.id);
    assert.ok(
      slug === 'yaniklar'
        ? cats.length === 2
        : slug === 'gumbet'
        ? cats.length === 3
        : slug === 'torba'
        ? cats.length === 4
        : cats.length >= 5,
      `${slug} cats=${cats.length}`
    );
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

test('V3.6 strict chain blocklist, coffee purity, and >=4.4 quality floor across all 58 snapshots', () => {
  const bannedRe =
    /pizza v|kaffee schütz|kaffee schutz|adile sultan|hane çikolata|çanak kebap|brand burger|butcher's burger|vakko|filizler köftecisi|çengelköy börekçisi|kirpi|intiba döner|la veria|döner bank|doner bank|burger evim|nazar profiterol|pizzalazza|simple co|5masa|develi|bedri usta|divan brasserie|perran ocakbaşı|coffee manifesto|balta burger|beylerbeyi profiterol|saltbae|the house cafe|faruk güllüoğlu|hafız mustafa|cro & cups|white burger|biber burger|perlo's|burgerlab|akali|federal galata|ot cafe|pizza krema|sun brothers|fres burger|napoli gourmet|sliceguy|betro burger|the hunger|upper crust|selamlique|mikel coffee|pasaport pizza|8one burger|bodrum mantı|bodrum manti|casita|grandma|nusr-et|nusret|david people|paper roasting|asırlık tencere|asirlik tencere|tarihi tencere|hopdaddy|fiko yeniköy|fiko yenikoy|fiko ocakbaşı|fiko ocakbasi|voi yeniköy|voi yenikoy|voi göktürk|voi gokturk|voi coffee|ioki|girandola|numnum|il forno|laos coffee|kolcuoğlu|kolcuoglu|emmy burger|hızlı burger|hizli burger|noww|cup of joy|backhaus|karafırın|karafirin|pelit|coni&co|carl's jr|mezzaluna|serafina|zsa zsa zsu|blackjack pizza|eleos|moc pera|ministry of coffee|noir pit|miss pizza|cecconi's|yesen burger|bambi cafe|saray muhallebicisi|bravo coffee roastery|twins coffee roasters|hero's pizza|mono burger|pera döner|pera doner|simit sarayi|varuna gezgin|shakespeare|mahalle burger|hmbrgr|mackbear|the big man|robert's coffee|roberts coffee|yemen kahvesi|dodo pizza|knockout burger|the beaver coffee|chemex coffee|rotto pizzeria|ottobros|balıkçı halil|balikci halil|milklaç|milklac|dospresso|skull street food|skull kaleiçi|skull kaleici|route burger|tezgah burger|schiller|franco's pizza|francos pizza|sıralı kebap|sirali kebap|paçacı şemsi|pacaci semsi|akdeniz dondurma|giliğ|gilig|pikan fırın|pikan firin|texas buffalo|arap nazmi|404 coffee|burger 242|pizza la vera|moc coffee|moc coffee roastery|levent borek|levent börek|saliha sultan|nurdos|yomumu|mama africa|özsüt|ozsut|kocatepe kahve|surf coffee|gönül kahvesi|gonul kahvesi|soulmate coffee|coffeemania|coffee mania|artukbey|bayramefendi|osmanlı kahvecisi|osmanli kahvecisi|fırıncı baba|firinci baba|akat ankara simit|simit noktası|simit noktasi|harmoni fırın|harmoni firin|romm coffee|zulu coffee|luuq coffee|endless pizza|enjoy burger|just burger|tadim tantuni|tadım tantuni|hanci bistro|hancı bistro|hanci pastane|citirim pastane|çıtırım pastane|pizza tomato|q stand coffee|alaçatı muhallebicisi|alacati muhallebicisi|harput dibek|harpurdibek|harputdibek|make me joi|coffee de madrid|goodeer coffee|gua coffee|federico|understone|panama coffee|burger home|lokum döner|lokum doner|bakku coffee|sirius coffee|ohannes|cajun corner|bolulu hasan usta|pellini|coffee lab|kaleiçi muhallebicisi|kaleici muhallebicisi|sobig|so big|divan pastane|divan bodrum|huqqa|meet lab|five o'clock|five o clock|mua gelatieri|mua yalikavak|godiva|blak coffee|gurkan sef|gürkan şef|nespresso|karaarslan et|zuma bodrum|novikov|bagatelle|hakkasan|gaia bodrum|firin bi tatli tuzlu|fırın bi tatlı tuzlu|lokanta by divan|battalbey|battal bey|big chefs|bitez dondurmacisi|bitez dondurmacısı|bitez dondurma|bodrum dondurmacisi|bodrum dondurmacısı|ekleristan|endlesspizza|costa coffee|bursa kebap evi|chinese inn|royal firin|royal fırın|royal pastanesi|karya firin|karya fırın|maharet manti|maharet mantı|oses cig kofte|oses çiğ köfte|oses cigkofte|magnolia shop|buselik meyhane|caytaze|çaytaze|meliha hanim|meliha hanım|obadan|kircicegi|kırçiçeği|tekin usta|books & coffee marmaris|books & coffee uzunyali|books & coffee uzunyalı|coffee kuppa|kupa coffee|tuzu biberi|reyhan pastanesi|bogazici restaurant|boğaziçi restaurant|baristocrat|alsancak unlu mamul|kumrucu sevki|kumrucu şevki|burgerhane|spada coffee|bravo patisserie|brew mood|kahve diyari|kahve diyarı|leone patisserie|burger street|goldenfingers|slices of the world|sasso fried chicken|two hands burger|uptown pizza|carre gusto|cizz bizz|cızz bızz|tavaci recep usta|tavacı recep usta|midyeci ahmet|chop bbq|buckin coffee|poka coffee|un posto/i;
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
