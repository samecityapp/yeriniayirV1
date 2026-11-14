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
  'istanbul-kadikoy-bostanci',
  'istanbul-kadikoy-kosuyolu-acibadem',
  'istanbul-uskudar-merkez',
  'istanbul-uskudar-kuzguncuk',
  'istanbul-uskudar-cengelkoy',
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
      key === 'istanbul-kadikoy-bostanci' ||
      key === 'istanbul-uskudar-cengelkoy';
    const isHeritage = key === 'gaziantep-merkez';
    const isAntalya = key.startsWith('antalya-');
    assert.ok(
      isHeritage
        ? data.categories.length === 8
        : isAntalya
        ? data.categories.length >= 8 && data.categories.length <= 9
        : isCoastal
        ? data.categories.length === 7
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
  assert.equal(countDenemelisin(yeldegirmeni), 4, 'Yeldegirmeni denemelisin must not be artificially padded to 10');
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

test('all 16 published regions have zero overlapping placeIds, valid ratings, and canonical CID links', () => {
  const globalPlaceIds = new Set();
  for (const { key, data } of snapshots) {
    const expectedDistricts =
      key === 'antalya-kaleici'
        ? ['Muratpaşa', 'Aksu', 'Kepez']
        : key === 'antalya-konyaalti'
        ? ['Konyaaltı', 'Muratpaşa']
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
  assert.ok(globalPlaceIds.size >= 420, `Expected >=420 unique published venues, got ${globalPlaceIds.size}`);
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

test('runtime discovery, foodAdapter, and realProvider expose all 6 Kadikoy regions as published with Il>Ilce>Semt', async () => {
  const discoveryMod = loadTsModule('lib/pilot/integration/discovery.ts');
  const adapterMod = loadTsModule('lib/pilot/integration/foodAdapter.ts');
  const providerMod = loadTsModule('lib/food/realProvider.ts');

  const modaDiscovery = await discoveryMod.readIntegrationDiscovery('moda', '');
  assert.ok(modaDiscovery);
  const food = adapterMod.toFoodDiscovery(modaDiscovery);
  const provider = providerMod.createRealFoodProvider(food);

  const ready = provider.getReadyRegions();
  assert.equal(ready.length, 16);
  assert.deepEqual(
    ready.map((r) => r.slug),
    [
      'moda',
      'kadikoy',
      'yeldegirmeni',
      'caddebostan',
      'suadiye',
      'bostanci',
      'kosuyolu-acibadem',
      'uskudar',
      'kuzguncuk',
      'cengelkoy',
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

  // Legacy kadikoy-carsi slug, Bostanci, Kosuyolu/Acibadem, Uskudar, Kuzguncuk, Cengelkoy, Kusadasi, Gaziantep, Antalya & Akyaka aliases resolve cleanly
  assert.equal(provider.getLocationBySlug('kadikoy-carsi')?.slug, 'kadikoy');
  assert.equal(provider.getLocationBySlug('catalcesme')?.slug, 'bostanci');
  assert.equal(provider.getLocationBySlug('kosuyolu')?.slug, 'kosuyolu-acibadem');
  assert.equal(provider.getLocationBySlug('acibadem')?.slug, 'kosuyolu-acibadem');
  assert.equal(provider.getLocationBySlug('salacak')?.slug, 'uskudar');
  assert.equal(provider.getLocationBySlug('icadiye')?.slug, 'kuzguncuk');
  assert.equal(provider.getLocationBySlug('cinaralti')?.slug, 'cengelkoy');
  assert.equal(provider.getLocationBySlug('kuleli')?.slug, 'cengelkoy');
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

  // Verify all 16 published regions resolve cleanly through readIntegrationDiscovery
  for (const slug of [
    'moda',
    'kadikoy',
    'yeldegirmeni',
    'caddebostan',
    'suadiye',
    'bostanci',
    'kosuyolu-acibadem',
    'uskudar',
    'kuzguncuk',
    'cengelkoy',
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
      for (const forbidden of ['Starbucks', "Domino's", 'Hacıbaşar', 'Cro & Cups']) {
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
        'Ceviz Ağacı Koşuyolu',
        'Tarihi Kuzguncuk Fırını Acıbadem',
        'Çanak Kebap',
        'Acıbadem İntiba Döner',
        'Null Coffee Roasters',
        'Speranza Pizzeria',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `kosuyolu-acibadem missing ${expected}`);
      }
      for (const forbidden of ['Viyana Kahvesi', 'Beyaz Fırın']) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `kosuyolu-acibadem must exclude ${forbidden}`);
      }
    }
    if (slug === 'uskudar') {
      assert.equal(p.getLocationBySlug('uskudar')?.locative, "Üsküdar'da");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'uskudar must expose 6 categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'Kanaat Lokantası',
        'Filizler Köftecisi',
        'Katibim',
        'Nevmekan Sahil',
        'Bobby Baccalieri',
        'Olinna Coffee',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `uskudar missing ${expected}`);
      }
      for (const forbidden of ['Starbucks', 'Mim Kahve']) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `uskudar must exclude ${forbidden}`);
      }
    }
    if (slug === 'kuzguncuk') {
      assert.equal(p.getLocationBySlug('kuzguncuk')?.locative, "Kuzguncuk'ta");
      const cats = p.getRegionCategories(disc.region.id);
      assert.equal(cats.length, 6, 'kuzguncuk must expose 6 categories');
      const names = f.venues.map((v) => v.name);
      for (const expected of [
        'İsmet Baba Restaurant',
        'Tarihi Kuzguncuk Fırını',
        'Metet Közde Döner',
        'Nail Kitabevi & Cafe',
        'Ekmek Teknesi',
        'Pita Kuzguncuk',
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `kuzguncuk missing ${expected}`);
      }
      for (const forbidden of ['Via Balık', 'Pulat Çiftliği']) {
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
        'Çengelköy Tarihi Çınaraltı',
        'Çengelköy Börekçisi',
        'Del Mare',
        'Şen Balık Lokantası',
        'Kael Burger',
        "Pap's Pizzeria",
      ]) {
        assert.ok(names.some((n) => n.includes(expected)), `cengelkoy missing ${expected}`);
      }
      for (const forbidden of ['Emirgan Sütiş', 'Espressolab', 'Villa Bosphorus']) {
        assert.equal(names.some((n) => n.includes(forbidden)), false, `cengelkoy must exclude ${forbidden}`);
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
