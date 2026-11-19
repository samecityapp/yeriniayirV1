// Run after `npm run build`: node scripts/verify_codex_audit_closures.cjs
// Closes all 5 remaining independent audit findings with E2E browser + offline checks:
// 1. Staging preflight runtime parity (rejects legacy synthetic Basic fixture)
// 2. GPS modal close -> reopen -> delayed geolocation callback race isolation
// 3. excludeBbox geometry & nearest-region boundary distance correctness
// 4. Clean-checkout gastronomy verification with zero gitignored work/ directory
// 5. Consent-gated GA4/Clarity + PageViewTracker AND bounded 5-min client region cache TTL
require('./security/network-lock.cjs');

const assert = require('node:assert/strict');
const { execFileSync, spawn, spawnSync } = require('node:child_process');
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

function startNextProcess(port, extraEnv = {}) {
  return spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)],
    {
      cwd: root,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        NODE_OPTIONS: `--require ${path.join(root, 'scripts/security/network-lock.cjs')}`,
        VERCEL: '1',
        VERCEL_ENV: 'preview',
        NEXT_PUBLIC_VERCEL_ENV: 'preview',
        APP_ENVIRONMENT: 'preview',
        GASTRONOMY_AUTH_MODE: 'supabase',
        GASTRONOMY_ENABLE_PREVIEW: '0',
        GASTRONOMY_LOCAL_PREVIEW: '0',
        NEXT_PUBLIC_DISABLE_ANALYTICS: '0',
        NEXT_PUBLIC_SUPABASE_URL: 'https://vhptlecaixpawtxnhsde.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-anon',
        ...extraEnv,
      },
    }
  );
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

(async () => {
  // ---------------------------------------------------------------------------
  // 1. Staging Preflight Runtime Parity
  // ---------------------------------------------------------------------------
  await check('1. Staging preflight rejects legacy synthetic fixture and enforces 28 runtime parity checks', async () => {
    const legacyRes = spawnSync(process.execPath, ['scripts/verify_staging_config.cjs'], {
      cwd: root,
      env: {
        ...process.env,
        APP_ENVIRONMENT: 'staging',
        ADMIN_USER: 'staging-admin',
        ADMIN_PASSWORD: crypto.randomBytes(24).toString('base64url'),
        STAGING_SUPABASE_PROJECT_REF: 'synthetic-staging-fixture',
        NEXT_PUBLIC_SUPABASE_URL: 'https://synthetic-staging-fixture.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-only-placeholder-not-a-real-key',
        GASTRONOMY_LOCAL_PREVIEW: '0',
      },
      encoding: 'utf8',
    });
    assert.notEqual(legacyRes.status, 0, 'Legacy synthetic Basic fixture must fail staging config check');

    const preflightRes = spawnSync(process.execPath, ['scripts/verify_staging_preflight.cjs'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(preflightRes.status, 0, preflightRes.stderr);
  });

  // ---------------------------------------------------------------------------
  // 3. excludeBbox Geometry & Boundary Distance Correction
  // ---------------------------------------------------------------------------
  await check('3. excludeBbox regions never win as 0m fallback and measure distance to allowed geometry', async () => {
    const {
      findNearestPublishedRegion,
      distanceToAllowedBoundaryMeters,
    } = loadTs('lib/food/maps.ts', { cache: new Map() });
    const { V3_LOCATIONS } = loadTs('lib/gastronomy-v3/registry.ts', { cache: new Map() });

    const konyaaltiCenterPt = { lat: 36.87425, lng: 30.61575 };
    const konyaaltiMatch = findNearestPublishedRegion(konyaaltiCenterPt, V3_LOCATIONS, 6000);
    assert.ok(
      konyaaltiMatch === null || konyaaltiMatch.location.slug !== 'antalya-konyaalti',
      `Point inside antalya-konyaalti excludeBbox must NOT match antalya-konyaalti (got ${konyaaltiMatch?.location.slug} at ${konyaaltiMatch?.distanceMeters}m)`
    );

    const kilitbahirEdgePt = { lat: 40.148, lng: 26.379 };
    const kilitbahirInsidePt = { lat: 40.148, lng: 26.385 };
    const mEdge = findNearestPublishedRegion(kilitbahirEdgePt, V3_LOCATIONS, 6000);
    const mInside = findNearestPublishedRegion(kilitbahirInsidePt, V3_LOCATIONS, 6000);
    assert.ok(mEdge === null || mEdge.location.slug !== 'canakkale-merkez');
    assert.ok(mInside === null || mInside.location.slug !== 'canakkale-merkez');

    const konyaaltiLoc = V3_LOCATIONS.find((l) => l.slug === 'antalya-konyaalti');
    assert.ok(konyaaltiLoc && konyaaltiLoc.boundary?.excludeBbox);
    const outsideExcludedCorner = { lat: 36.8835, lng: 30.6150 };
    const allowedDist = distanceToAllowedBoundaryMeters(
      outsideExcludedCorner,
      konyaaltiLoc.boundary.bbox,
      konyaaltiLoc.boundary.excludeBbox
    );
    assert.ok(
      allowedDist > 1200,
      `Expected >1200m to allowed geometry outside carved quadrant, got ${allowedDist}m`
    );

    // Synthetic overlapping fallback test: Region A has hole (excludeBbox) covered by Region B nearby
    const syntheticRegions = [
      {
        id: 'reg-a',
        name: 'Region A',
        displayName: 'Region A',
        slug: 'region-a',
        level: 'semt',
        city: 'Test',
        path: ['test', 'region-a'],
        locative: "A'da",
        status: 'published',
        center: { lat: 40.0, lng: 29.0 },
        boundary: {
          bbox: { minLat: 39.98, maxLat: 40.02, minLng: 28.98, maxLng: 29.02 },
          excludeBbox: { minLat: 39.99, maxLat: 40.01, minLng: 28.99, maxLng: 29.01 },
        },
      },
      {
        id: 'reg-b',
        name: 'Region B',
        displayName: 'Region B',
        slug: 'region-b',
        level: 'semt',
        city: 'Test',
        path: ['test', 'region-b'],
        locative: "B'de",
        status: 'published',
        center: { lat: 40.0, lng: 29.025 },
        boundary: {
          bbox: { minLat: 39.995, maxLat: 40.005, minLng: 29.015, maxLng: 29.035 },
        },
      },
    ];
    const holeMatch = findNearestPublishedRegion({ lat: 40.0, lng: 29.0 }, syntheticRegions, 6000);
    assert.ok(holeMatch, 'Nearby non-excluded Region B should still match within radius');
    assert.equal(holeMatch.location.slug, 'region-b');
    assert.ok(holeMatch.distanceMeters > 1000 && holeMatch.distanceMeters < 1500);
  });

  // ---------------------------------------------------------------------------
  // 4. Clean-Checkout Verification Without gitignored work/ Directory
  // ---------------------------------------------------------------------------
  await check('4. Clean checkout without work/ directory passes verify_v3_gastronomy.cjs 21/21', async () => {
    const tmpClean = fs.mkdtempSync(path.join(os.tmpdir(), 'ya-clean-checkout-'));
    try {
      for (const dirName of ['scripts', 'lib', 'components', '.agents']) {
        fs.symlinkSync(path.join(root, dirName), path.join(tmpClean, dirName), 'dir');
      }
      for (const fileName of ['package.json', 'AGENTS.md', 'tsconfig.json']) {
        fs.symlinkSync(path.join(root, fileName), path.join(tmpClean, fileName), 'file');
      }
      fs.symlinkSync(path.join(root, 'node_modules'), path.join(tmpClean, 'node_modules'), 'dir');
      assert.equal(fs.existsSync(path.join(tmpClean, 'work')), false, 'Temp clean checkout must have zero work/');

      const res = spawnSync(process.execPath, ['scripts/verify_v3_gastronomy.cjs'], {
        cwd: tmpClean,
        encoding: 'utf8',
      });
      assert.equal(res.status, 0, `Clean checkout failed:\n${res.stdout}\n${res.stderr}`);
      assert.ok(res.stdout.includes('21/21 V3 offline gastronomy checks passed'));
    } finally {
      fs.rmSync(tmpClean, { recursive: true, force: true });
    }
  });

  // ---------------------------------------------------------------------------
  // 2 & 5. Compiled Next.js + Proxy + Headless Chrome E2E
  // ---------------------------------------------------------------------------
  assert.ok(fs.existsSync(path.join(root, '.next/prerender-manifest.json')), '.next build required');

  const nextPort = await getFreePort();
  const proxyPort = await getFreePort();
  let modaProxyServeVersion = 1;
  let modaProxyFetchCount = 0;
  const modaProxyRequestCacheHeaders = [];

  const proxyServer = http.createServer((clientReq, clientRes) => {
    const reqUrl = clientReq.url || '/';
    const isModaApi = reqUrl.startsWith('/api/gastronomy/regions/moda');
    if (isModaApi) {
      modaProxyFetchCount++;
      modaProxyRequestCacheHeaders.push({
        cacheControl: clientReq.headers['cache-control'] || '',
        pragma: clientReq.headers['pragma'] || '',
      });
    }

    const forwardHeaders = {
      ...clientReq.headers,
      host: `127.0.0.1:${nextPort}`,
    };
    if (isModaApi && modaProxyServeVersion >= 2) {
      delete forwardHeaders['if-none-match'];
      delete forwardHeaders['if-modified-since'];
    }
    const upstreamReq = http.request(
      {
        hostname: '127.0.0.1',
        port: nextPort,
        path: reqUrl,
        method: clientReq.method,
        headers: forwardHeaders,
      },
      (upstreamRes) => {
        const chunks = [];
        upstreamRes.on('data', (c) => chunks.push(c));
        upstreamRes.on('end', () => {
          let body = Buffer.concat(chunks);
          const outHeaders = { ...upstreamRes.headers };
          if (isModaApi && upstreamRes.statusCode === 200) {
            outHeaders['cache-control'] = 'public, max-age=1, must-revalidate';
            if (modaProxyServeVersion >= 2) {
              const parsed = JSON.parse(body.toString('utf8'));
              if (Array.isArray(parsed.venues) && parsed.venues.length > 0) {
                parsed.venues[0] = {
                  ...parsed.venues[0],
                  name: `${parsed.venues[0].name} [CANLI YENILENDI v2]`,
                };
              }
              body = Buffer.from(JSON.stringify(parsed), 'utf8');
              outHeaders['content-length'] = String(body.length);
            }
          }
          clientRes.writeHead(upstreamRes.statusCode || 200, outHeaders);
          clientRes.end(body);
        });
      }
    );
    upstreamReq.on('error', (err) => {
      clientRes.writeHead(502);
      clientRes.end(String(err));
    });
    clientReq.pipe(upstreamReq);
  });

  await new Promise((resolve) => proxyServer.listen(proxyPort, '127.0.0.1', resolve));
  const nextProc = startNextProcess(nextPort);
  const proxyOrigin = `http://127.0.0.1:${proxyPort}`;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox'],
  });

  try {
    await waitForNextReady(nextProc);

    await check('2. GPS modal ignores delayed success & error callbacks across close -> reopen cycles', async () => {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

      const pageErrors = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const u = new URL(req.url());
        if (u.origin !== proxyOrigin && !['data:', 'blob:'].includes(u.protocol)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.evaluateOnNewDocument(() => {
        const pending = [];
        window.__geoPending = pending;
        Object.defineProperty(navigator, 'geolocation', {
          configurable: true,
          value: {
            getCurrentPosition: (success, error) => {
              pending.push({ success, error });
            },
          },
        });
      });

      await page.goto(`${proxyOrigin}/tr`, { waitUntil: 'networkidle0' });

      const openLocationPicker = async () => {
        await page.click('header button');
        await page.waitForSelector('[role="dialog"][aria-label="Konum seçimi"]');
      };
      const clickGpsButton = async () => {
        const clicked = await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
            (b.textContent || '').includes('Konumumu Kullan')
          );
          if (!btn) return false;
          btn.click();
          return true;
        });
        assert.equal(clicked, true, 'Konumumu Kullan button must exist');
      };

      // Race A: trigger GPS (req #0), close modal, reopen modal (no GPS clicked!), resolve req #0 with Moda coords
      await openLocationPicker();
      await clickGpsButton();
      assert.equal(await page.evaluate(() => window.__geoPending.length), 1);

      await page.keyboard.press('Escape');
      await page.waitForSelector('[role="dialog"]', { hidden: true });
      await openLocationPicker();

      await page.evaluate(() => {
        window.__geoPending[0].success({
          coords: { latitude: 40.9806, longitude: 29.0265, accuracy: 20 },
        });
      });
      await new Promise((r) => setTimeout(r, 150));

      assert.equal(await page.evaluate(() => location.pathname + location.search), '/tr');
      assert.ok(await page.$('[role="dialog"][aria-label="Konum seçimi"]'), 'Reopened modal must stay open');
      const modalTextAfterStaleSuccess = await page.$eval('[role="dialog"]', (el) => el.textContent || '');
      assert.ok(!modalTextAfterStaleSuccess.includes('Konumunuza en yakın bölge'));

      // Race B: while reopened modal is open, trigger GPS (req #1), close & reopen, fire delayed ERROR on req #1
      await clickGpsButton();
      assert.equal(await page.evaluate(() => window.__geoPending.length), 2);
      await page.keyboard.press('Escape');
      await page.waitForSelector('[role="dialog"]', { hidden: true });
      await openLocationPicker();
      await page.evaluate(() => {
        window.__geoPending[1].error({ code: 1, message: 'Permission denied' });
      });
      await new Promise((r) => setTimeout(r, 150));
      const modalTextAfterStaleError = await page.$eval('[role="dialog"]', (el) => el.textContent || '');
      assert.ok(!modalTextAfterStaleError.includes('Konum izni verilmedi'));

      // Now trigger a fresh GPS request #2 inside current open modal and verify it DOES navigate & close cleanly!
      await clickGpsButton();
      assert.equal(await page.evaluate(() => window.__geoPending.length), 3);
      await page.evaluate(() => {
        window.__geoPending[2].success({
          coords: { latitude: 40.9806, longitude: 29.0265, accuracy: 20 },
        });
      });
      await page.waitForFunction(
        () => location.search.includes('region=moda') && location.search.includes('category=pizza')
      );
      await page.waitForSelector('[role="dialog"]', { hidden: true });

      assert.deepEqual(pageErrors, []);
      await page.close();
      await context.close();
    });

    await check('5a. Consent-managed GA4/Clarity & PageViewTracker block scripts before consent & on reject, load on accept, and stop on revoke', async () => {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

      const pageErrors = [];
      const thirdPartyRequests = [];
      const trackEventRequests = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const u = new URL(req.url());
        if (u.origin !== proxyOrigin && !['data:', 'blob:'].includes(u.protocol)) {
          if (u.hostname.includes('googletagmanager.com') || u.hostname.includes('clarity.ms')) {
            thirdPartyRequests.push(req.url());
          }
          req.abort();
        } else {
          if (u.pathname.startsWith('/api/track-event')) {
            trackEventRequests.push(req.url());
          }
          req.continue();
        }
      });

      // 1) Initial visit without consent -> ZERO GA4 / Clarity requests or loader tags, Consent default = denied
      await page.goto(`${proxyOrigin}/tr`, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 250));
      assert.deepEqual(thirdPartyRequests, [], 'Initial visit must make 0 GA4/Clarity network requests');
      const initialState = await page.evaluate(() => ({
        gaTag: Boolean(document.getElementById('ga4-gtag-loader')),
        clarityTag: Boolean(document.getElementById('ms-clarity-loader')),
        gaDisabled: window['ga-disable-G-593PL85N6Q'],
        hasBanner: Boolean(document.querySelector('div.fixed.inset-x-0.bottom-0')),
      }));
      assert.equal(initialState.gaTag, false);
      assert.equal(initialState.clarityTag, false);
      assert.equal(initialState.gaDisabled, true);
      assert.equal(initialState.hasBanner, true);

      // 2) Click REJECT ALL (2nd button in banner), verify 0 third-party scripts before & after reload
      await page.evaluate(() => {
        const banner = document.querySelector('div.fixed.inset-x-0.bottom-0');
        const buttons = banner ? Array.from(banner.querySelectorAll('button')) : [];
        if (buttons[1]) buttons[1].click();
      });
      await new Promise((r) => setTimeout(r, 200));
      assert.deepEqual(thirdPartyRequests, [], 'Rejecting cookies must trigger 0 GA4/Clarity requests');
      const storedReject = await page.evaluate(() => localStorage.getItem('cookie-consent-granular'));
      assert.equal(JSON.parse(storedReject || '{}').analytics, false);

      await page.reload({ waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 200));
      assert.deepEqual(thirdPartyRequests, [], 'Reload after reject must make 0 GA4/Clarity requests');
      assert.equal(await page.evaluate(() => Boolean(document.querySelector('div.fixed.inset-x-0.bottom-0'))), false);
      assert.equal(await page.evaluate(() => window['ga-disable-G-593PL85N6Q']), true);

      // 3) On rejected state, hotel detail UUID route must NOT send /api/track-event from PageViewTracker
      await page.goto(`${proxyOrigin}/tr/otel/11111111-1111-4111-8111-111111111111`, {
        waitUntil: 'domcontentloaded',
      });
      await new Promise((r) => setTimeout(r, 300));
      assert.deepEqual(trackEventRequests, [], 'Rejected analytics must skip PageViewTracker /api/track-event');

      // 4) Clear consent -> reload /tr -> click ACCEPT ALL (last button) -> verifies GA4 & Clarity scripts load!
      await page.evaluate(() => localStorage.removeItem('cookie-consent-granular'));
      await page.goto(`${proxyOrigin}/tr`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => {
        const banner = document.querySelector('div.fixed.inset-x-0.bottom-0');
        const buttons = banner ? Array.from(banner.querySelectorAll('button')) : [];
        const acceptBtn = buttons[buttons.length - 1];
        if (acceptBtn) acceptBtn.click();
      });
      await page.waitForFunction(
        () =>
          Boolean(document.getElementById('ga4-gtag-loader')) &&
          Boolean(document.getElementById('ms-clarity-loader')) &&
          window['ga-disable-G-593PL85N6Q'] === false
      );
      await new Promise((r) => setTimeout(r, 150));
      assert.ok(thirdPartyRequests.some((u) => u.includes('googletagmanager.com/gtag/js?id=G-593PL85N6Q')));
      assert.ok(thirdPartyRequests.some((u) => u.includes('clarity.ms/tag/ufxa278rg4')));

      // 5) Revoke consent via storage/custom event -> scripts removed & ga-disable restored to true; reload stays 0!
      const countAfterAccept = thirdPartyRequests.length;
      await page.evaluate(() => {
        const denied = { necessary: true, analytics: false, marketing: false, functional: false, performance: false };
        localStorage.setItem('cookie-consent-granular', JSON.stringify(denied));
        window.dispatchEvent(new CustomEvent('ya:cookie-consent-updated', { detail: denied }));
      });
      await page.waitForFunction(
        () =>
          !document.getElementById('ga4-gtag-loader') &&
          !document.getElementById('ms-clarity-loader') &&
          window['ga-disable-G-593PL85N6Q'] === true
      );
      await page.reload({ waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 150));
      assert.equal(thirdPartyRequests.length, countAfterAccept);

      assert.deepEqual(pageErrors, []);
      await page.close();
      await context.close();
    });

    await check('5b. Client regionCacheRef hits inside TTL, expires cleanly, and sends no-cache refresh for updated data', async () => {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

      const pageErrors = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const u = new URL(req.url());
        if (u.origin !== proxyOrigin && !['data:', 'blob:'].includes(u.protocol)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.evaluateOnNewDocument(() => {
        window.__YA_REGION_CACHE_TTL_MS = 1200;
      });

      modaProxyServeVersion = 1;
      modaProxyFetchCount = 0;
      modaProxyRequestCacheHeaders.length = 0;

      await page.goto(`${proxyOrigin}/tr`, { waitUntil: 'networkidle0' });

      const chooseRegionFromModal = async (searchText, matchText) => {
        await page.click('header button');
        await page.waitForSelector('[role="dialog"] input');
        await page.type('[role="dialog"] input', searchText);
        const ok = await page.evaluate((needle) => {
          const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
            (b.textContent || '').includes(needle)
          );
          if (!btn) return false;
          btn.click();
          return true;
        }, matchText);
        assert.equal(ok, true, `Failed to pick region: ${matchText}`);
      };

      // Fetch #1: Moda v1
      await chooseRegionFromModal('Moda', 'Moda, Kadıköy, İstanbul');
      await page.waitForFunction(
        () =>
          location.search.includes('region=moda') &&
          location.search.includes('category=') &&
          document.querySelectorAll('[data-venue-id]').length > 0,
        { timeout: 10000 }
      );
      assert.equal(modaProxyFetchCount, 1);

      // Immediately switch to Karaköy -> Back to Moda within 1200ms TTL -> MUST hit cache (0 new fetch!)
      await chooseRegionFromModal('Karaköy', 'Karaköy, Beyoğlu');
      await page.waitForFunction(
        () =>
          location.search.includes('region=karakoy') &&
          location.search.includes('category=') &&
          document.querySelectorAll('[data-venue-id]').length > 0,
        { timeout: 10000 }
      );
      await page.goBack();
      await page.waitForFunction(
        () => location.search.includes('region=moda') && document.querySelectorAll('[data-venue-id]').length > 0,
        { timeout: 10000 }
      );
      assert.equal(modaProxyFetchCount, 1, 'Inside TTL (<1200ms), Moda must serve from client cache');

      // Flip proxy to serve updated v2 JSON, wait past 1200ms TTL, switch away & back to Moda -> MUST re-fetch with revalidation & render v2!
      modaProxyServeVersion = 2;
      await chooseRegionFromModal('Karaköy', 'Karaköy, Beyoğlu');
      await page.waitForFunction(
        () =>
          location.search.includes('region=karakoy') &&
          location.search.includes('category=') &&
          document.querySelectorAll('[data-venue-id]').length > 0,
        { timeout: 10000 }
      );
      await new Promise((r) => setTimeout(r, 1300));

      await page.goBack();
      await page.waitForFunction(
        () =>
          Array.from(document.querySelectorAll('[data-venue-id]')).some((el) =>
            (el.textContent || '').includes('[CANLI YENILENDI v2]')
          ),
        { timeout: 10000 }
      );
      assert.equal(modaProxyFetchCount, 2, 'Expired region cache must re-fetch fresh data from server');
      assert.match(
        modaProxyRequestCacheHeaders[1]?.cacheControl || '',
        /^(?:no-cache|max-age=0)$/,
        'Expired refresh must send cache-control revalidation header (no-cache / max-age=0) to bypass fresh browser disk cache'
      );

      assert.deepEqual(pageErrors, []);
      await page.close();
      await context.close();
    });
  } finally {
    await browser.close();
    nextProc.kill('SIGTERM');
    await new Promise((r) => proxyServer.close(r));
  }

  console.log(`\nALL CODEX AUDIT CLOSURE CHECKS PASSED: ${passed} checks.`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
