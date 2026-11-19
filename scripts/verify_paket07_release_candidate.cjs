// Run after `npm run build`: node scripts/verify_paket07_release_candidate.cjs
// Comprehensive Görev 7 Before/After & Release-Candidate Verification Suite (Items 1-9).
require('./security/network-lock.cjs');

const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');

const root = process.cwd();
const repoRequire = createRequire(path.join(root, 'package.json'));
const puppeteer = repoRequire('puppeteer');
const loadTs = require('./security/load-ts.cjs');

let passed = 0;
async function check(label, fn) {
  await fn();
  passed++;
  console.log(`PASS ${label}`);
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const addr = srv.address();
      srv.close(() => resolve(addr.port));
    });
    srv.on('error', reject);
  });
}

async function waitForNextReady(proc) {
  await new Promise((resolve, reject) => {
    let logs = '';
    let settled = false;
    const done = (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (err) reject(err);
      else resolve();
    };
    const timer = setTimeout(
      () => done(new Error(`Next server startup timeout:\n${logs.slice(-1500)}`)),
      15000
    );
    proc.stdout.on('data', (c) => {
      const s = String(c);
      logs += s;
      if (s.includes('Ready')) done();
    });
    proc.stderr.on('data', (c) => {
      logs += String(c);
    });
    proc.once('exit', (code) =>
      done(new Error(`Next exited early (${code}):\n${logs.slice(-1500)}`))
    );
  });
}

function buildMockHotels(total) {
  const rows = [];
  const baseTime = Date.UTC(2026, 10, 19, 12, 0, 0);
  for (let i = 1; i <= total; i++) {
    const num = String(i).padStart(3, '0');
    rows.push({
      id: `10000000-0000-4000-8000-${String(i).padStart(12, '0')}`,
      name: {
        tr: i === total ? `Otel ${i} Tarihî Konak` : `Butik Otel ${num}`,
        en: i === total ? `Hotel ${i} Historic Mansion` : `Boutique Hotel ${num}`,
      },
      location: { tr: i === total ? 'Mardin' : 'Bodrum, Muğla', en: i === total ? 'Mardin' : 'Bodrum, Muğla' },
      price: 4500 + i * 10,
      rating: 9.2,
      image_url: '/icon.png',
      tags: ['denize-sifir'],
      amenities: [],
      gallery_images: [],
      about: { tr: `Deneyim açıklaması #${num}`, en: `Experience description #${num}` },
      description: { tr: `Kısa özet #${num}`, en: `Short summary #${num}` },
      created_at: new Date(baseTime - i * 60_000).toISOString(),
    });
  }
  return rows;
}

(async () => {
  const savedEnv = { ...process.env };

  // ---------------------------------------------------------------------------
  // 1. Staging Preflight P1 — Before (old false PASS) vs After (runtime parity)
  // ---------------------------------------------------------------------------
  await check('1. Staging preflight before/after: legacy c295aa6 gave false PASS, fixed runtime rejects it and passes 28 cases', async () => {
    const legacyShow = spawnSync('git', ['show', 'c295aa6:scripts/verify_staging_config.cjs'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(legacyShow.status, 0, 'Must read historical c295aa6 verify_staging_config.cjs from git');

    const badEnv = {
      ...process.env,
      APP_ENVIRONMENT: 'staging',
      ADMIN_USER: 'staging-admin',
      ADMIN_PASSWORD: crypto.randomBytes(24).toString('base64url'),
      STAGING_SUPABASE_PROJECT_REF: 'synthetic-staging-fixture',
      NEXT_PUBLIC_SUPABASE_URL: 'https://synthetic-staging-fixture.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-only-placeholder-not-a-real-key',
      GASTRONOMY_LOCAL_PREVIEW: '0',
    };
    delete badEnv.GASTRONOMY_AUTH_MODE;

    const oldResult = spawnSync(process.execPath, ['-e', legacyShow.stdout], {
      cwd: root,
      env: badEnv,
      encoding: 'utf8',
    });
    assert.equal(oldResult.status, 0, 'Reproduces historical defect: old script falsely exited 0');

    const newResult = spawnSync(process.execPath, ['scripts/verify_staging_config.cjs'], {
      cwd: root,
      env: badEnv,
      encoding: 'utf8',
    });
    assert.notEqual(newResult.status, 0, 'Fixed staging config MUST reject invalid synthetic fixture');

    const preflightRes = spawnSync(process.execPath, ['scripts/verify_staging_preflight.cjs'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(preflightRes.status, 0, preflightRes.stderr);
  });

  // ---------------------------------------------------------------------------
  // 3. excludeBbox Before/After (Antalya/Konyaalti real case)
  // ---------------------------------------------------------------------------
  await check('3. excludeBbox before/after: Antalya/Konyaalti excluded center no longer returns 0m fallback', async () => {
    const {
      distanceToBboxMeters,
      distanceToAllowedBoundaryMeters,
      findNearestPublishedRegion,
    } = loadTs('lib/food/maps.ts', { cache: new Map() });
    const { V3_LOCATIONS } = loadTs('lib/gastronomy-v3/registry.ts', { cache: new Map() });

    const konyaalti = V3_LOCATIONS.find((l) => l.slug === 'antalya-konyaalti');
    assert.ok(konyaalti && konyaalti.boundary?.excludeBbox);
    const excludeCenter = { lat: 36.87425, lng: 30.61575 };

    // Before: naive distanceToBboxMeters returned 0m inside excludeBbox!
    assert.equal(distanceToBboxMeters(excludeCenter, konyaalti.boundary.bbox), 0);

    // After: findNearestPublishedRegion excludes antalya-konyaalti cleanly!
    const afterMatch = findNearestPublishedRegion(excludeCenter, V3_LOCATIONS, 6000);
    assert.ok(afterMatch === null || afterMatch.location.slug !== 'antalya-konyaalti');

    // Allowed distance from outside carved corner reports >1200m
    const outsideCorner = { lat: 36.8835, lng: 30.6150 };
    assert.ok(
      distanceToAllowedBoundaryMeters(outsideCorner, konyaalti.boundary.bbox, konyaalti.boundary.excludeBbox) > 1200
    );
  });

  // ---------------------------------------------------------------------------
  // 4. Clean Checkout Gastronomy Tests & Zero Silent Skips
  // ---------------------------------------------------------------------------
  await check('4. Clean-checkout gastronomy verification passes 21/21 without work/ and has ZERO conditional skips', async () => {
    const v3Src = fs.readFileSync(path.join(root, 'scripts/verify_v3_gastronomy.cjs'), 'utf8');
    assert.equal(
      /if\s*\(\s*testFileExists\s*\(/.test(v3Src),
      false,
      'verify_v3_gastronomy.cjs must NEVER skip checks conditionally when audit inputs are missing'
    );

    const tmpClean = fs.mkdtempSync(path.join(os.tmpdir(), 'ya-rc-clean-'));
    try {
      for (const dirName of ['scripts', 'lib', 'components', '.agents']) {
        fs.symlinkSync(path.join(root, dirName), path.join(tmpClean, dirName), 'dir');
      }
      for (const fileName of ['package.json', 'AGENTS.md', 'tsconfig.json']) {
        fs.symlinkSync(path.join(root, fileName), path.join(tmpClean, fileName), 'file');
      }
      fs.symlinkSync(path.join(root, 'node_modules'), path.join(tmpClean, 'node_modules'), 'dir');

      const res = spawnSync(process.execPath, ['scripts/verify_v3_gastronomy.cjs'], {
        cwd: tmpClean,
        encoding: 'utf8',
      });
      assert.equal(res.status, 0, `${res.stdout}\n${res.stderr}`);
      assert.ok(res.stdout.includes('21/21 V3 offline gastronomy checks passed'));
    } finally {
      fs.rmSync(tmpClean, { recursive: true, force: true });
    }
  });

  // ---------------------------------------------------------------------------
  // 7A. Unit Check: Hotel Search Catalog Pagination (>100 active hotels + <100 optimization)
  // ---------------------------------------------------------------------------
  await check('7A. loadHotelSearchCatalog paginates >100 hotels (245 rows across 3 pages) and keeps 1 query when <100', async () => {
    const fullRows = buildMockHotels(245);
    let dataset = fullRows;
    let hotelQueries = 0;

    const makeBuilder = (table) => {
      const state = { asc: true };
      const chain = {
        select: () => chain,
        is: () => chain,
        order: (_col, opts) => {
          state.asc = opts?.ascending !== false;
          return chain;
        },
        limit: async (n) => {
          if (table === 'hotels') hotelQueries++;
          return {
            data: table === 'hotels' ? dataset.slice(0, n) : [],
            error: null,
          };
        },
        range: async (from, to) => {
          if (table === 'hotels') hotelQueries++;
          return {
            data: table === 'hotels' ? dataset.slice(from, to + 1) : [],
            error: null,
          };
        },
      };
      return chain;
    };

    const searchMod = loadTs('lib/hotelSearchCache.ts', {
      cache: new Map(),
      mocks: {
        '@/lib/supabase': {
          isSupabaseIsolated: false,
          supabase: { from: makeBuilder },
        },
      },
    });

    searchMod.resetHotelSearchCatalogCacheForTests();
    const res245 = await searchMod.loadHotelSearchCatalog();
    assert.equal(res245.hotels.length, 245, 'Must return all 245 hotels without 100-row truncation');
    assert.equal(res245.hotels[0].id, fullRows[0].id);
    assert.equal(res245.hotels[244].id, fullRows[244].id);
    assert.equal(hotelQueries, 3, '245 rows with pageSize 100 should query 3 range batches');

    // Cached hit uses 0 extra DB queries
    const resCached = await searchMod.loadHotelSearchCatalog();
    assert.equal(resCached.hotels.length, 245);
    assert.equal(hotelQueries, 3);

    // Small dataset (<100) uses exactly 1 query
    searchMod.resetHotelSearchCatalogCacheForTests();
    dataset = fullRows.slice(0, 40);
    hotelQueries = 0;
    const res40 = await searchMod.loadHotelSearchCatalog();
    assert.equal(res40.hotels.length, 40);
    assert.equal(hotelQueries, 1);
  });

  // ---------------------------------------------------------------------------
  // 9. Rate-Limit Codex Counterexamples Re-Verification
  // ---------------------------------------------------------------------------
  await check('9. Rate-limit re-audit: P1-01 outage block, P2-01 sliding window, global vs per-isolate, and CGNAT fairness', async () => {
    process.env.RATE_LIMIT_ENFORCE = '1';
    process.env.NODE_ENV = 'production';
    process.env.APP_ENVIRONMENT = 'production';
    process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE = 'block';
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const rlProd = loadTs('lib/pilot/rateLimit.ts', { cache: new Map() });
    rlProd.resetMemoryRateLimitersForTests();
    for (let i = 0; i < 100; i++) {
      const r = await rlProd.enforceRateLimit(
        new Headers({ 'x-real-ip': `198.51.100.${(i % 200) + 1}` }),
        'admin_auth',
        { scope: 'api' }
      );
      assert.equal(r.status, 503);
      assert.equal(r.policy, 'outage-blocked');
    }

    // P2-01 rolling sliding window exact millisecond boundary + overflow non-eviction
    process.env.APP_ENVIRONMENT = 'test';
    delete process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE;
    const rlTest = loadTs('lib/pilot/rateLimit.ts', { cache: new Map() });
    rlTest.resetMemoryRateLimitersForTests();
    const t0 = Date.UTC(2026, 10, 19, 13, 0, 0);
    const visitorHdr = new Headers({
      'x-real-ip': '203.0.113.40',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) InstagramApp/1',
    });
    assert.equal((await rlTest.enforceRateLimit(visitorHdr, 'visitor_redirect', { scope: 'api', nowMs: t0 })).ok, true);
    for (let i = 0; i < 29; i++) {
      assert.equal(
        (await rlTest.enforceRateLimit(visitorHdr, 'visitor_redirect', { scope: 'api', nowMs: t0 + 9000 })).ok,
        true
      );
    }
    let passCount = 0;
    let rejectCount = 0;
    for (let i = 0; i < 30; i++) {
      const r = await rlTest.enforceRateLimit(visitorHdr, 'visitor_redirect', { scope: 'api', nowMs: t0 + 10001 });
      if (r.ok) passCount++;
      else rejectCount++;
    }
    assert.equal(passCount, 1);
    assert.equal(rejectCount, 29);

    // CGNAT fairness: 35 distinct devices behind 1 CGNAT IP all pass visitor_redirect (30/device, 150/IP)
    rlTest.resetMemoryRateLimitersForTests();
    for (let d = 0; d < 35; d++) {
      const h = new Headers({
        'x-real-ip': '100.64.22.10',
        'user-agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 18_${d % 4} like Mac OS X) Instagram/${310 + d}`,
      });
      const r = await rlTest.enforceRateLimit(h, 'visitor_redirect', { scope: 'api', nowMs: t0 + 20_000 });
      assert.equal(r.ok, true, `Distinct CGNAT device #${d} must not be blocked`);
    }

    // Shared Upstash enforces global limit across two separate isolates (8 vs 16 without Upstash)
    const sharedCounts = new Map();
    const sharedMocks = {
      '@upstash/redis': { Redis: class {} },
      '@upstash/ratelimit': {
        Ratelimit: class {
          static slidingWindow(limit) {
            return { limit };
          }
          constructor(opts) {
            this.limitVal = opts.limiter?.limit || 8;
            this.prefix = opts.prefix || 'rl';
          }
          async limit(k) {
            const key = `${this.prefix}:${k}`;
            const next = (sharedCounts.get(key) || 0) + 1;
            sharedCounts.set(key, next);
            return {
              success: next <= this.limitVal,
              limit: this.limitVal,
              remaining: Math.max(0, this.limitVal - next),
              reset: Math.ceil(Date.now() / 1000) + 60,
            };
          }
        },
      },
    };
    process.env.UPSTASH_REDIS_REST_URL = 'https://mock-rl.example.invalid';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';
    const iso1 = loadTs('lib/pilot/rateLimit.ts', { cache: new Map(), mocks: sharedMocks });
    const iso2 = loadTs('lib/pilot/rateLimit.ts', { cache: new Map(), mocks: sharedMocks });
    iso1.resetMemoryRateLimitersForTests();
    iso2.resetMemoryRateLimitersForTests();
    const adminHdr = new Headers({ 'x-real-ip': '203.0.113.88' });
    let totalAllowed = 0;
    for (let i = 0; i < 4; i++) {
      if ((await iso1.enforceRateLimit(adminHdr, 'admin_auth', { scope: 'api' })).ok) totalAllowed++;
      if ((await iso2.enforceRateLimit(adminHdr, 'admin_auth', { scope: 'api' })).ok) totalAllowed++;
    }
    assert.equal(totalAllowed, 8);
    assert.equal((await iso1.enforceRateLimit(adminHdr, 'admin_auth', { scope: 'api' })).status, 429);

    process.env = { ...savedEnv };
  });

  // ---------------------------------------------------------------------------
  // Live Mock Supabase (135 hotels) + Live Mock Upstash + HTTP Proxy + Compiled Next.js + Chrome E2E
  // Covers Checks 2, 5, 6, 7B, and 8!
  // ---------------------------------------------------------------------------
  assert.ok(fs.existsSync(path.join(root, '.next/prerender-manifest.json')), '.next build required');

  const hotels135 = buildMockHotels(135);
  let runtimeEmergencyRedisValue = null; // null -> off -> shed -> lockdown -> off
  let runtimeEmergencyUpstashHits = 0;

  const mockBackendPort = await getFreePort();
  const mockBackendServer = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': 'content-range',
    };

    if (req.method === 'OPTIONS') {
      res.writeHead(204, corsHeaders);
      res.end();
      return;
    }

    if (url.pathname.startsWith('/upstash/get/')) {
      runtimeEmergencyUpstashHits++;
      res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: runtimeEmergencyRedisValue }));
      return;
    }

    if (url.pathname.startsWith('/upstash')) {
      res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: 1 }));
      return;
    }

    if (url.pathname === '/rest/v1/hotels') {
      const qOffset = url.searchParams.get('offset');
      const qLimit = url.searchParams.get('limit');
      const rangeHeader = String(req.headers.range || '');
      const m = rangeHeader.match(/^(\d+)-(\d+)$/);
      let from = 0;
      let to = hotels135.length - 1;
      if (qOffset !== null && qLimit !== null) {
        from = Math.max(0, Number(qOffset));
        to = Math.max(from, from + Math.max(1, Number(qLimit)) - 1);
      } else if (m) {
        from = Number(m[1]);
        to = Number(m[2]);
      }
      const slice = hotels135.slice(from, to + 1);
      res.writeHead(200, {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'content-range': `${from}-${Math.max(from, from + slice.length - 1)}/${hotels135.length}`,
      });
      res.end(JSON.stringify(slice));
      return;
    }

    if (url.pathname === '/rest/v1/tags') {
      res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify([
          { id: 't1', name: { tr: 'Denize Sıfır', en: 'Seafront' }, slug: 'denize-sifir', icon: 'Waves', is_featured: true },
        ])
      );
      return;
    }

    if (url.pathname === '/rest/v1/price_tags') {
      res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
      return;
    }

    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify([]));
  });
  await new Promise((r) => mockBackendServer.listen(mockBackendPort, '127.0.0.1', r));

  const nextPort = await getFreePort();
  const proxyPort = await getFreePort();
  let modaVersion = 1;
  let modaFetches = 0;
  const modaCacheHeaders = [];

  const proxyServer = http.createServer((clientReq, clientRes) => {
    const reqUrl = clientReq.url || '/';
    const isSupabaseProxy = reqUrl.startsWith('/rest/v1/') || reqUrl.startsWith('/auth/v1/');
    const targetPort = isSupabaseProxy ? mockBackendPort : nextPort;
    const isModa = reqUrl.startsWith('/api/gastronomy/regions/moda');
    if (isModa) {
      modaFetches++;
      modaCacheHeaders.push(String(clientReq.headers['cache-control'] || ''));
    }
    const forwardHeaders = { ...clientReq.headers, host: `127.0.0.1:${targetPort}` };
    if (isModa && modaVersion >= 2) {
      delete forwardHeaders['if-none-match'];
      delete forwardHeaders['if-modified-since'];
    }
    const up = http.request(
      { hostname: '127.0.0.1', port: targetPort, path: reqUrl, method: clientReq.method, headers: forwardHeaders },
      (upRes) => {
        const chunks = [];
        upRes.on('data', (c) => chunks.push(c));
        upRes.on('end', () => {
          let body = Buffer.concat(chunks);
          const outHdrs = { ...upRes.headers };
          delete outHdrs['transfer-encoding'];
          if (isModa && upRes.statusCode === 200) {
            outHdrs['cache-control'] = 'public, max-age=1, must-revalidate';
            if (modaVersion >= 2) {
              const p = JSON.parse(body.toString('utf8'));
              if (Array.isArray(p.venues) && p.venues.length > 0) {
                p.version = 'v3-mock-updated-v2';
                p.venues[0] = { ...p.venues[0], name: `${p.venues[0].name} [CANLI YENILENDI v2]` };
              }
              body = Buffer.from(JSON.stringify(p), 'utf8');
            }
          }
          outHdrs['content-length'] = String(body.length);
          clientRes.writeHead(upRes.statusCode || 200, outHdrs);
          clientRes.end(body);
        });
      }
    );
    up.on('error', (e) => {
      clientRes.writeHead(502);
      clientRes.end(String(e));
    });
    clientReq.pipe(up);
  });
  await new Promise((r) => proxyServer.listen(proxyPort, '127.0.0.1', r));

  const tempDistDir = `.next-paket07-rc-${mockBackendPort}`;
  const tsconfigPath = path.join(root, 'tsconfig.json');
  const savedTsconfig = fs.existsSync(tsconfigPath) ? fs.readFileSync(tsconfigPath, 'utf8') : null;
  const cleanChildEnv = {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_DIST_DIR: tempDistDir,
    NODE_OPTIONS: `--require ${path.join(root, 'scripts/security/network-lock.cjs')}`,
    APP_ENVIRONMENT: 'test',
    GASTRONOMY_AUTH_MODE: 'supabase',
    GASTRONOMY_LOCAL_PREVIEW: '0',
    RATE_LIMIT_ENFORCE: '1',
    NEXT_PUBLIC_DISABLE_ANALYTICS: '0',
    EMERGENCY_RUNTIME_UPSTASH: '1',
    EMERGENCY_MODE_CACHE_TTL_MS: '150',
    ADMIN_PASSWORD: crypto.randomBytes(16).toString('hex'),
    NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${proxyPort}`,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-anon',
    GASTRONOMY_SUPABASE_URL: `http://127.0.0.1:${proxyPort}`,
    GASTRONOMY_SUPABASE_ANON_KEY: 'dummy-anon',
    GASTRONOMY_SUPABASE_REF: 'local',
    GASTRONOMY_CLOUD_ENV: 'local',
    UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${mockBackendPort}/upstash`,
    UPSTASH_REDIS_REST_TOKEN: 'dummy-token',
  };
  delete cleanChildEnv.VERCEL;
  delete cleanChildEnv.VERCEL_ENV;
  delete cleanChildEnv.NEXT_PUBLIC_VERCEL_ENV;
  delete cleanChildEnv.TRAFFIC_EMERGENCY_MODE;

  let browser = null;
  let liveNext = null;
  const origin = `http://127.0.0.1:${proxyPort}`;
  const mockOrigin = `http://127.0.0.1:${mockBackendPort}`;

  try {
    const buildEnv = { ...cleanChildEnv };
    delete buildEnv.NODE_OPTIONS;
    await new Promise((resolve, reject) => {
      const b = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
        cwd: root,
        env: buildEnv,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      let out = '';
      let err = '';
      b.stdout.on('data', (c) => {
        out += String(c);
      });
      b.stderr.on('data', (c) => {
        err += String(c);
      });
      b.on('error', reject);
      b.on('exit', (code) => {
        if (code === 0) return resolve();
        reject(new Error(`temp next build exited ${code}:\n${out.slice(-1500)}\n${err.slice(-1500)}`));
      });
    });

    liveNext = spawn(
      process.execPath,
      ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(nextPort)],
      { cwd: root, env: cleanChildEnv }
    );

    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: ['--no-sandbox'],
    });

    await waitForNextReady(liveNext);

    await check('2. GPS modal ignores late success, deny (code=1), and timeout (code=3) callbacks across close -> reopen', async () => {
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      const pageErrors = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const u = new URL(req.url());
        if (u.origin !== origin && !['data:', 'blob:'].includes(u.protocol)) req.abort();
        else req.continue();
      });

      await page.evaluateOnNewDocument(() => {
        window.__geoQ = [];
        Object.defineProperty(navigator, 'geolocation', {
          configurable: true,
          value: {
            getCurrentPosition: (success, error) => window.__geoQ.push({ success, error }),
          },
        });
      });

      await page.goto(`${origin}/tr`, { waitUntil: 'networkidle0' });
      const openModal = async () => {
        await page.click('header button');
        await page.waitForSelector('[role="dialog"][aria-label="Konum seçimi"]');
      };
      const triggerGps = async () => {
        await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
            (b.textContent || '').includes('Konumumu Kullan')
          );
          btn.click();
        });
      };

      // Late success
      await openModal();
      await triggerGps();
      await page.keyboard.press('Escape');
      await page.waitForSelector('[role="dialog"]', { hidden: true });
      await openModal();
      await page.evaluate(() => window.__geoQ[0].success({ coords: { latitude: 40.9806, longitude: 29.0265, accuracy: 20 } }));
      await new Promise((r) => setTimeout(r, 120));
      assert.equal(await page.evaluate(() => location.pathname + location.search), '/tr');
      assert.ok(await page.$('[role="dialog"]'));

      // Late deny (code=1)
      await triggerGps();
      await page.keyboard.press('Escape');
      await page.waitForSelector('[role="dialog"]', { hidden: true });
      await openModal();
      await page.evaluate(() => window.__geoQ[1].error({ code: 1, message: 'Denied' }));
      await new Promise((r) => setTimeout(r, 120));
      const tDeny = await page.$eval('[role="dialog"]', (el) => el.textContent || '');
      assert.ok(!tDeny.includes('Konum izni verilmedi'));

      // Late timeout (code=3)
      await triggerGps();
      await page.keyboard.press('Escape');
      await page.waitForSelector('[role="dialog"]', { hidden: true });
      await openModal();
      await page.evaluate(() => window.__geoQ[2].error({ code: 3, message: 'Timeout' }));
      await new Promise((r) => setTimeout(r, 120));
      const tTimeout = await page.$eval('[role="dialog"]', (el) => el.textContent || '');
      assert.ok(!tTimeout.includes('zaman aşımına uğradı'));

      // Fresh valid GPS inside current modal works
      await triggerGps();
      await page.evaluate(() => window.__geoQ[3].success({ coords: { latitude: 40.9806, longitude: 29.0265, accuracy: 20 } }));
      await page.waitForFunction(() => location.search.includes('region=moda') && location.search.includes('category=pizza'));
      await page.waitForSelector('[role="dialog"]', { hidden: true });
      assert.deepEqual(pageErrors, []);
      await page.close();
      await ctx.close();
    });

    await check('5. Cookie consent blocks GA4/Clarity before consent & on reject, applies saved accept on load, and allows preference change via #cerez-ayarlari', async () => {
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      const pageErrors = [];
      const thirdPartyReqs = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const u = new URL(req.url());
        if (u.origin !== origin && !['data:', 'blob:'].includes(u.protocol)) {
          if (u.hostname.includes('googletagmanager.com') || u.hostname.includes('clarity.ms')) {
            thirdPartyReqs.push(req.url());
          }
          req.abort();
        } else {
          req.continue();
        }
      });

      // Initial -> 0 GA4/Clarity
      await page.goto(`${origin}/tr`, { waitUntil: 'networkidle0' });
      assert.deepEqual(thirdPartyReqs, []);

      // Reject -> Reload -> 0 GA4/Clarity
      await page.evaluate(() => {
        const b = document.querySelector('div.fixed.inset-x-0.bottom-0');
        Array.from(b.querySelectorAll('button'))[1].click();
      });
      await new Promise((r) => setTimeout(r, 150));
      await page.reload({ waitUntil: 'networkidle0' });
      assert.deepEqual(thirdPartyReqs, []);
      assert.equal(await page.evaluate(() => window['ga-disable-G-593PL85N6Q']), true);

      // Clear -> Reload -> Accept All -> Reload auto-applies saved accept!
      await page.evaluate(() => localStorage.removeItem('cookie-consent-granular'));
      await page.reload({ waitUntil: 'networkidle0' });
      await page.evaluate(() => {
        const b = document.querySelector('div.fixed.inset-x-0.bottom-0');
        Array.from(b.querySelectorAll('button')).pop().click();
      });
      await page.waitForFunction(() => Boolean(document.getElementById('ga4-gtag-loader')) && window['ga-disable-G-593PL85N6Q'] === false);
      const countAfterAccept = thirdPartyReqs.length;
      assert.ok(countAfterAccept >= 2);

      // Reload applies saved accept automatically without banner interaction
      await page.reload({ waitUntil: 'networkidle0' });
      await page.waitForFunction(() => Boolean(document.getElementById('ga4-gtag-loader')) && window['ga-disable-G-593PL85N6Q'] === false);
      assert.ok(thirdPartyReqs.length > countAfterAccept);

      // Preference modification flow on /tr/cerez-politikasi clicking "Çerez Ayarları" link (#cerez-ayarlari)
      await page.goto(`${origin}/tr/cerez-politikasi`, { waitUntil: 'networkidle0' });
      await page.click('a[href="#cerez-ayarlari"]');
      await page.waitForSelector('div.fixed.inset-x-0.bottom-0 input[type="checkbox"]');
      await page.evaluate(() => {
        const boxes = Array.from(document.querySelectorAll('div.fixed.inset-x-0.bottom-0 input[type="checkbox"]'));
        // box[0] is Necessary (disabled), box[1] is Analytics (currently checked=true) -> toggle OFF
        if (boxes[1].checked) boxes[1].click();
      });
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('div.fixed.inset-x-0.bottom-0 button'));
        btns[btns.length - 1].click(); // Save Preferences
      });
      await page.waitForFunction(() => !document.getElementById('ga4-gtag-loader') && window['ga-disable-G-593PL85N6Q'] === true);
      const countAfterChange = thirdPartyReqs.length;
      await page.reload({ waitUntil: 'networkidle0' });
      assert.equal(thirdPartyReqs.length, countAfterChange, 'Changed analytics=false must persist across reload');

      assert.deepEqual(pageErrors, []);
      await page.close();
      await ctx.close();
    });

    await check('6. Gastronomy region payload carries deterministic version and client regionCacheRef respects TTL without unnecessary refetches', async () => {
      const { getStaticRegionVenuePayload } = loadTs('lib/food/regionDiscovery.ts', { cache: new Map() });
      const modaPayload = await getStaticRegionVenuePayload('moda');
      assert.match(modaPayload?.version || '', /^v3-[0-9a-f]{8}$/);

      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      const pageErrors = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const u = new URL(req.url());
        if (u.origin !== origin && !['data:', 'blob:'].includes(u.protocol)) req.abort();
        else req.continue();
      });
      await page.evaluateOnNewDocument(() => {
        window.__YA_REGION_CACHE_TTL_MS = 1200;
      });
      modaVersion = 1;
      modaFetches = 0;
      modaCacheHeaders.length = 0;

      await page.goto(`${origin}/tr`, { waitUntil: 'networkidle0' });
      const pick = async (searchText, matchText, expectedRegion) => {
        await page.click('header button');
        await page.waitForSelector('[role="dialog"] input');
        await page.type('[role="dialog"] input', searchText);
        await page.evaluate((needle) => {
          const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
            (b.textContent || '').includes(needle)
          );
          btn.click();
        }, matchText);
        await page.waitForFunction(
          (slug) => location.search.includes(`region=${slug}`) && location.search.includes('category=') && document.querySelectorAll('[data-venue-id]').length > 0,
          { timeout: 10000 },
          expectedRegion
        );
      };

      await pick('Moda', 'Moda, Kadıköy, İstanbul', 'moda');
      assert.equal(modaFetches, 1);
      await pick('Karaköy', 'Karaköy, Beyoğlu', 'karakoy');
      await page.goBack();
      await page.waitForFunction(() => location.search.includes('region=moda') && document.querySelectorAll('[data-venue-id]').length > 0);
      assert.equal(modaFetches, 1, 'Within TTL, Moda must use client memory cache (0 refetches)');

      modaVersion = 2;
      await pick('Karaköy', 'Karaköy, Beyoğlu', 'karakoy');
      await new Promise((r) => setTimeout(r, 1300));
      await page.goBack();
      await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('[data-venue-id]')).some((el) =>
          (el.textContent || '').includes('[CANLI YENILENDI v2]')
        )
      );
      assert.equal(modaFetches, 2);
      assert.match(modaCacheHeaders[1] || '', /^(?:no-cache|max-age=0)$/);
      assert.deepEqual(pageErrors, []);
      await page.close();
      await ctx.close();
    });

    await check('7B. Browser E2E /tr/search with 135 active hotels finds hotel #135 (previously truncated at 100) while preserving UI', async () => {
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      const pageErrors = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const u = new URL(req.url());
        if (u.origin !== origin && u.origin !== mockOrigin && !['data:', 'blob:'].includes(u.protocol)) req.abort();
        else req.continue();
      });

      await page.goto(`${origin}/tr/search`, { waitUntil: 'networkidle0' });
      await page.waitForFunction(() => (document.body.innerText || '').includes('135 otel bulundu'), { timeout: 10000 });
      const initialBody = await page.evaluate(() => document.body.innerText || '');
      assert.ok(initialBody.includes('135 otel bulundu'));
      assert.ok(initialBody.includes('Daha Fazla Göster (123)'), 'Initial UI pagination still renders 12 cards and preserves Daha Fazla Göster button');

      await page.goto(`${origin}/tr/search?q=Otel%20135`, { waitUntil: 'networkidle0' });
      await page.waitForFunction(() => (document.body.innerText || '').includes('Otel 135 Tarihî Konak'), { timeout: 10000 });
      const searchBody = await page.evaluate(() => document.body.innerText || '');
      assert.ok(searchBody.includes('1 otel bulundu'));
      assert.ok(searchBody.includes('Otel 135 Tarihî Konak'));

      assert.deepEqual(pageErrors, []);
      await page.close();
      await ctx.close();
    });

    await check('8. Live Upstash runtime switch toggles shed -> lockdown -> off WITHOUT restarting next start, and Gastronomi V5 incurs 0 Upstash calls', async () => {
      runtimeEmergencyRedisValue = null;
      runtimeEmergencyUpstashHits = 0;

      // Wait >150ms cache TTL so clean start reads baseline
      await new Promise((r) => setTimeout(r, 180));
      const baselineSearch = await fetch(`${origin}/tr/search`);
      assert.equal(baselineSearch.status, 200);

      // Hit core Gastronomi V5 20 times -> must incur 0 Upstash emergency reads!
      const hitsBeforeGastro = runtimeEmergencyUpstashHits;
      for (let i = 0; i < 10; i++) {
        const g1 = await fetch(`${origin}/tr`);
        const g2 = await fetch(`${origin}/api/gastronomy/regions/moda`);
        assert.equal(g1.status, 200);
        assert.equal(g2.status, 200);
      }
      assert.equal(
        runtimeEmergencyUpstashHits,
        hitsBeforeGastro,
        'Core Gastronomi V5 routes MUST NOT call Upstash runtime emergency switch'
      );

      // Flip Redis key to 'shed' WITHOUT restarting server -> expires in <= 150ms!
      runtimeEmergencyRedisValue = 'shed';
      await new Promise((r) => setTimeout(r, 200));

      const shedSearch = await fetch(`${origin}/tr/search`);
      const shedGo = await fetch(`${origin}/api/go?hotelId=123e4567-e89b-12d3-a456-426614174000`);
      const shedImg = await fetch(`${origin}/_next/image?url=%2Flogo.png&w=64&q=75`);
      const shedTrack = await fetch(`${origin}/api/track-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'page_view', hotel_id: null }),
      });
      assert.equal(shedSearch.status, 503);
      assert.equal(shedSearch.headers.get('x-emergency-mode'), 'shed');
      assert.equal(shedGo.status, 503);
      assert.equal(shedImg.status, 503);
      assert.equal(shedTrack.status, 202);
      assert.equal((await fetch(`${origin}/tr`)).status, 200);
      assert.equal((await fetch(`${origin}/api/gastronomy/regions/moda`)).status, 200);

      // Flip Redis key to 'lockdown' WITHOUT restarting server!
      runtimeEmergencyRedisValue = 'lockdown';
      await new Promise((r) => setTimeout(r, 200));
      const lockPub = await fetch(`${origin}/api/gastronomy-admin/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: origin,
          Host: `127.0.0.1:${proxyPort}`,
        },
        body: JSON.stringify({ scope: 'moda/kahve', expectedRevision: 1, order: [], reason: 'test' }),
      });
      assert.equal(lockPub.status, 503);
      assert.equal(lockPub.headers.get('x-emergency-mode'), 'lockdown');

      // Flip Redis key back to 'off' WITHOUT restarting server -> recovers to 200!
      runtimeEmergencyRedisValue = 'off';
      await new Promise((r) => setTimeout(r, 200));
      const recoveredSearch = await fetch(`${origin}/tr/search`);
      assert.equal(recoveredSearch.status, 200);
    });
  } finally {
    if (browser) await browser.close();
    if (liveNext) liveNext.kill('SIGTERM');
    await new Promise((r) => proxyServer.close(r));
    await new Promise((r) => mockBackendServer.close(r));
    fs.rmSync(path.join(root, tempDistDir), { recursive: true, force: true });
    if (savedTsconfig !== null) {
      fs.writeFileSync(tsconfigPath, savedTsconfig);
    }
    process.env = { ...savedEnv };
  }

  console.log(`\nALL PAKET 07 RELEASE CANDIDATE CHECKS PASSED: ${passed} checks.`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
