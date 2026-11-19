// Run after `npm run build`: node scripts/verify_paket10_final_release_audit.cjs
// Paket 10 Final Release E2E, Bot/SEO, Admin Security, Snapshot Integrity & Payload Benchmark Suite.
require('./security/network-lock.cjs');

const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const zlib = require('node:zlib');
const { createRequire } = require('node:module');

const ROOT = process.cwd();
const repoRequire = createRequire(path.join(ROOT, 'package.json'));
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
      () => done(new Error(`Next startup timeout:\n${logs.slice(-1500)}`)),
      20000
    );
    proc.stdout.on('data', (c) => {
      const s = String(c);
      logs += s;
      if (s.includes('Ready')) done();
    });
    proc.stderr.on('data', (c) => {
      logs += String(c);
    });
    proc.once('exit', (code) => {
      done(new Error(`Next exited early (${code}):\n${logs.slice(-1500)}`));
    });
  });
}

function decodeHtmlAttr(s) {
  return String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim();
}

function extractMetaMap(html) {
  const metas = [];
  const tagRe = /<meta\s+[^>]*>/gi;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    const tag = m[0];
    const prop = tag.match(/property=["']([^"']+)["']/i)?.[1];
    const name = tag.match(/name=["']([^"']+)["']/i)?.[1];
    const content = tag.match(/content=["']([^"']*)["']/i)?.[1];
    if ((prop || name) && content !== undefined) {
      metas.push({ key: (prop || name).toLowerCase(), content: decodeHtmlAttr(content) });
    }
  }
  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] ||
    null;
  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((x) => {
      try {
        return JSON.parse(x[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return {
    byKey: Object.fromEntries(metas.map((x) => [x.key, x.content])),
    canonical: canonical ? decodeHtmlAttr(canonical) : null,
    jsonLdBlocks,
  };
}

function httpGetWithHost(port, reqPath, hostHeader) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: reqPath,
        method: 'GET',
        headers: hostHeader ? { Host: hostHeader } : {},
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          });
        });
      }
    );
    req.setTimeout(15000, () => req.destroy(new Error(`HTTP timeout for ${reqPath}`)));
    req.on('error', reject);
    req.end();
  });
}

function collectStrings(node, acc = []) {
  if (typeof node === 'string') {
    acc.push(node);
  } else if (Array.isArray(node)) {
    for (const item of node) collectStrings(item, acc);
  } else if (node && typeof node === 'object') {
    for (const val of Object.values(node)) collectStrings(val, acc);
  }
  return acc;
}

(async () => {
  assert.ok(fs.existsSync(path.join(ROOT, '.next/prerender-manifest.json')), '.next build required before Paket 10 audit');

  const { PILOT_VENUE_IDS } = loadTs('lib/gastronomy-v3/geoPilot.ts', { cache: new Map() });
  const { FORBIDDEN_VISITOR_COPY_REGEX: POLICY_FORBIDDEN_RE } = loadTs('lib/gastronomy-v3/policy.ts', {
    cache: new Map(),
  });
  const { V3_LOCATIONS, getPublishedV3Snapshot } = loadTs('lib/gastronomy-v3/registry.ts', {
    cache: new Map(),
  });
  assert.ok(PILOT_VENUE_IDS.length > 0, 'PILOT_VENUE_IDS must be non-empty');
  const firstPilotId = PILOT_VENUE_IDS[0];

  const authLogoutRequests = [];
  const mockPort = await getFreePort();
  const mockServer = http.createServer((req, res) => {
    const u = new URL(req.url || '/', 'http://127.0.0.1');
    if (req.method === 'POST' && u.pathname === '/auth/v1/logout') {
      authLogoutRequests.push({
        method: req.method,
        path: u.pathname,
        query: u.search,
        authorization: req.headers['authorization'] || null,
        apikey: req.headers['apikey'] || null,
      });
      res.writeHead(204);
      res.end();
      return;
    }
    if (u.pathname.startsWith('/upstash/get/')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: 'off' }));
      return;
    }
    if (u.pathname.startsWith('/upstash')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: 1 }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([]));
  });
  await new Promise((r) => mockServer.listen(mockPort, '127.0.0.1', r));

  const nextPort = await getFreePort();
  const origin = `http://127.0.0.1:${nextPort}`;
  const childEnv = {
    ...process.env,
    NODE_ENV: 'production',
    NODE_OPTIONS: `--require ${path.join(ROOT, 'scripts/security/network-lock.cjs')}`,
    APP_ENVIRONMENT: 'test',
    GASTRONOMY_AUTH_MODE: 'supabase',
    GASTRONOMY_LOCAL_PREVIEW: '0',
    RATE_LIMIT_ENFORCE: '1',
    EMERGENCY_RUNTIME_UPSTASH: '0',
    NEXT_PUBLIC_DISABLE_ANALYTICS: '0',
    NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${mockPort}`,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-anon-key-local',
    GASTRONOMY_SUPABASE_URL: `http://127.0.0.1:${mockPort}`,
    GASTRONOMY_SUPABASE_ANON_KEY: 'dummy-anon-key-local',
    GASTRONOMY_SUPABASE_REF: 'local',
    GASTRONOMY_CLOUD_ENV: 'local',
    UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${mockPort}/upstash`,
    UPSTASH_REDIS_REST_TOKEN: 'dummy-token',
  };
  delete childEnv.ADMIN_PASSWORD;
  delete childEnv.VERCEL;
  delete childEnv.VERCEL_ENV;
  delete childEnv.NEXT_PUBLIC_VERCEL_ENV;
  delete childEnv.TRAFFIC_EMERGENCY_MODE;

  const nextProc = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(nextPort)],
    { cwd: ROOT, env: childEnv }
  );

  let browser;
  try {
    await waitForNextReady(nextProc);

    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: ['--no-sandbox'],
    });

    // -------------------------------------------------------------------------
    // 1. Flow A: Instagram Story Landing + WhatsApp/Social Meta Preview + Analytics Consent
    // -------------------------------------------------------------------------
    await check('1. Flow A: Instagram Story landing (390px) & OG/Twitter social cards across all 4 gastronomy routes', async () => {
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      const pageErrors = [];
      const thirdPartyRequests = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const u = new URL(req.url());
        if (u.origin !== origin && !['data:', 'blob:'].includes(u.protocol)) {
          thirdPartyRequests.push(req.url());
          req.abort();
        } else {
          req.continue();
        }
      });

      const storyUrl = `${origin}/tr?utm_source=instagram&utm_medium=story&utm_campaign=moda_launch`;
      const res1 = await page.goto(storyUrl, { waitUntil: 'networkidle0' });
      assert.equal(res1.status(), 200);
      await page.goto(`${origin}/tr?region=moda&category=pizza&utm_source=instagram`, { waitUntil: 'networkidle0' });
      const venueCount = await page.evaluate(() => document.querySelectorAll('[data-venue-id]').length);
      assert.ok(venueCount > 0, 'Expected Moda pizza cards to render for Instagram deep link');
      assert.deepEqual(pageErrors, []);
      assert.equal(
        thirdPartyRequests.filter((u) => /googletagmanager|clarity\.ms|google-analytics/i.test(u)).length,
        0,
        'Analytics requests must stay blocked prior to cookie consent'
      );
      await ctx.close();

      // Verify OG / Twitter metadata on all 4 public gastronomy route groups (TR + EN)
      const socialRoutes = [
        { p: '/tr', expectedOrigin: 'https://www.yeriniayir.com', type: 'website' },
        { p: '/en', expectedOrigin: 'https://www.worldandhotels.com', type: 'website' },
        { p: '/tr/gastronomi', expectedOrigin: 'https://www.yeriniayir.com', type: 'website' },
        { p: '/en/gastronomy', expectedOrigin: 'https://www.worldandhotels.com', type: 'website' },
        { p: '/tr/gastronomi/istanbul/kadikoy/moda', expectedOrigin: 'https://www.yeriniayir.com', type: 'website' },
        { p: '/tr/gastronomi/istanbul/kadikoy/moda/pizza', expectedOrigin: 'https://www.yeriniayir.com', type: 'website' },
        { p: `/tr/gastronomi/mekan/${firstPilotId}`, expectedOrigin: 'https://www.yeriniayir.com', type: 'article' },
        { p: `/en/gastronomy/venue/${firstPilotId}`, expectedOrigin: 'https://www.worldandhotels.com', type: 'article' },
      ];
      for (const route of socialRoutes) {
        const resp = await fetch(`${origin}${route.p}`);
        assert.equal(resp.status, 200, `Expected 200 on ${route.p}`);
        const html = await resp.text();
        const meta = extractMetaMap(html);
        assert.ok(meta.byKey['og:title']?.length > 10, `Missing og:title on ${route.p}`);
        assert.ok(meta.byKey['og:description']?.length > 20, `Missing og:description on ${route.p}`);
        assert.ok(meta.byKey['og:url']?.startsWith(route.expectedOrigin), `Invalid og:url on ${route.p}: ${meta.byKey['og:url']}`);
        assert.equal(meta.byKey['og:type'], route.type, `Invalid og:type on ${route.p}`);
        assert.equal(
          meta.byKey['og:image'],
          `${route.expectedOrigin}/yeriniayir-logo.png`,
          `Unexpected og:image on ${route.p}: ${meta.byKey['og:image']}`
        );
        assert.equal(meta.byKey['twitter:card'], 'summary_large_image', `Missing twitter:card on ${route.p}`);
      }

      const ogAssetRes = await fetch(`${origin}/yeriniayir-logo.png`);
      assert.equal(ogAssetRes.status, 200);
      assert.ok((ogAssetRes.headers.get('content-type') || '').includes('image/png'));
      const ogBytes = await ogAssetRes.arrayBuffer();
      assert.ok(ogBytes.byteLength > 10000);
    });

    // -------------------------------------------------------------------------
    // 2. Flow B: Region Search, No-Results State, Category Switch, Back/Forward, /search
    // -------------------------------------------------------------------------
    await check('2. Flow B: Region search, no-results state, category switch, back/forward history & /search empty state', async () => {
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      const pageErrors = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));

      await page.goto(`${origin}/tr`, { waitUntil: 'networkidle0' });
      // Dismiss cookie banner if present so clicks are unobstructed
      await page.evaluate(() => {
        const banner = document.querySelector('div.fixed.inset-x-0.bottom-0');
        const btn = banner && Array.from(banner.querySelectorAll('button')).pop();
        if (btn) btn.click();
      });

      // Open region modal & test no-results state
      await page.click('header button');
      await page.waitForSelector('[role="dialog"][aria-label="Konum seçimi"] input');
      await page.type('[role="dialog"] input', 'olmayanbolge123');
      await page.waitForFunction(() => {
        const txt = document.querySelector('[role="dialog"]')?.textContent || '';
        return txt.includes('Arama Sonuçları (0)') && txt.includes('bölge bulunamadı');
      });

      // Clear search using modal clear button and select Karaköy
      await page.click('[role="dialog"] input + button');
      await page.waitForFunction(() => (document.querySelector('[role="dialog"] input')?.value || '') === '');
      await page.type('[role="dialog"] input', 'Karaköy');
      await page.waitForFunction(() => {
        return Array.from(document.querySelectorAll('[role="dialog"] button')).some((b) =>
          (b.textContent || '').includes('Karaköy') && !(b.textContent || '').includes('Konumumu')
        );
      });
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find(
          (b) => (b.textContent || '').includes('Karaköy') && !(b.textContent || '').includes('Konumumu')
        );
        btn.click();
      });
      await page.waitForFunction(
        () => location.search.includes('region=karakoy') && document.querySelectorAll('[data-venue-id]').length > 0
      );
      const urlAfterRegion = await page.evaluate(() => location.pathname + location.search);

      // Switch category inside CategoryBar
      await page.waitForSelector('[data-testid="category-grid"]');
      const switchedInfo = await page.evaluate(() => {
        const items = Array.from(
          document.querySelectorAll('[data-testid="category-grid"] button, [data-testid="category-grid"] a')
        );
        const nonActive = items.find((el) => el.getAttribute('aria-current') !== 'page' && !(el.className || '').includes('bg-[#C42B1C]'));
        if (!nonActive) return null;
        const label = (nonActive.textContent || '').trim();
        nonActive.click();
        return { label };
      });
      assert.ok(switchedInfo, 'Expected a second category button in Karaköy CategoryBar');
      await page.waitForFunction((prevUrl) => location.pathname + location.search !== prevUrl, {}, urlAfterRegion);
      const urlAfterCategory = await page.evaluate(() => location.pathname + location.search);

      // Browser Back & Forward navigation
      await page.goBack();
      await page.waitForFunction((exp) => location.pathname + location.search === exp, {}, urlAfterRegion);
      await page.goForward();
      await page.waitForFunction((exp) => location.pathname + location.search === exp, {}, urlAfterCategory);

      // Search page no-results state
      const searchRes = await page.goto(`${origin}/tr/search?q=hicvarolmayanotel999`, { waitUntil: 'networkidle0' });
      assert.equal(searchRes.status(), 200);
      assert.equal(searchRes.headers()['x-robots-tag'], 'noindex, nofollow');
      const searchTitle = await page.$eval('h1', (el) => el.textContent || '');
      assert.ok(searchTitle.includes('Arama Sonuçları'));

      assert.deepEqual(pageErrors, []);
      await ctx.close();
    });

    // -------------------------------------------------------------------------
    // 3. Flow C: Mobile 390px GPS Deny/Timeout/Late Callback/Accept + Viewport Overflow + Keyboard
    // -------------------------------------------------------------------------
    await check('3. Flow C: Mobile 390px GPS deny, timeout, stale callback guard, valid Moda match & zero overflow', async () => {
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      const pageErrors = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));

      await page.evaluateOnNewDocument(() => {
        window.__geoQueue = [];
        Object.defineProperty(navigator, 'geolocation', {
          configurable: true,
          value: {
            getCurrentPosition: (success, error) => window.__geoQueue.push({ success, error }),
          },
        });
      });

      await page.goto(`${origin}/tr`, { waitUntil: 'networkidle0' });
      const openModal = async () => {
        await page.click('header button');
        await page.waitForSelector('[role="dialog"][aria-label="Konum seçimi"]');
      };
      const clickGps = async () => {
        await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
            (b.textContent || '').includes('Konumumu Kullan')
          );
          btn.click();
        });
      };

      await openModal();
      // Deny (code=1)
      await clickGps();
      await page.evaluate(() => window.__geoQueue[0].error({ code: 1, message: 'Denied' }));
      await page.waitForFunction(() => (document.querySelector('[role="dialog"]')?.textContent || '').includes('Konum izni verilmedi'));

      // Timeout (code=3)
      await clickGps();
      await page.evaluate(() => window.__geoQueue[1].error({ code: 3, message: 'Timeout' }));
      await page.waitForFunction(() => (document.querySelector('[role="dialog"]')?.textContent || '').includes('zaman aşımına uğradı'));

      // Close with Escape, reopen, fire stale success -> must be ignored
      await clickGps();
      await page.keyboard.press('Escape');
      await page.waitForSelector('[role="dialog"]', { hidden: true });
      await openModal();
      await page.evaluate(() => window.__geoQueue[2].success({ coords: { latitude: 40.9806, longitude: 29.0265, accuracy: 20 } }));
      await new Promise((r) => setTimeout(r, 120));
      assert.equal(await page.evaluate(() => location.pathname + location.search), '/tr');
      assert.ok(await page.$('[role="dialog"]'), 'Stale callback must not close newly reopened dialog');

      // Valid GPS inside active modal -> selects Moda
      await clickGps();
      await page.evaluate(() => window.__geoQueue[3].success({ coords: { latitude: 40.9806, longitude: 29.0265, accuracy: 20 } }));
      await page.waitForFunction(() => location.search.includes('region=moda') && document.querySelectorAll('[data-venue-id]').length > 0);
      await page.waitForSelector('[role="dialog"]', { hidden: true });

      // Overflow sweep across 390px, 375px, 1280px
      for (const vp of [
        { width: 390, height: 844, isMobile: true, hasTouch: true },
        { width: 375, height: 812, isMobile: true, hasTouch: true },
        { width: 1280, height: 800, isMobile: false, hasTouch: false },
      ]) {
        await page.setViewport(vp);
        for (const p of ['/tr?region=moda&category=kahve', '/tr/gastronomi', '/tr/gastronomi/istanbul/kadikoy/moda', `/tr/gastronomi/mekan/${firstPilotId}`]) {
          await page.goto(`${origin}${p}`, { waitUntil: 'networkidle0' });
          const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
          assert.equal(noOverflow, true, `Horizontal overflow on ${p} at ${vp.width}px`);
        }
      }
      assert.deepEqual(pageErrors, []);
      await ctx.close();
    });

    // -------------------------------------------------------------------------
    // 4. Flow D: AI Bots, 1529 Sitemap, Schema @id Parity, RSS feed.xml, Legal Canonicals, Noindex, Zero CORS
    // -------------------------------------------------------------------------
    await check('4. Flow D: AI bots HTML readability, 1529 sitemap, Schema @id parity, TR/EN feed.xml, legal canonicals, noindex & zero global CORS', async () => {
      for (const ua of ['OAI-SearchBot/1.0', 'GPTBot/1.0', 'PerplexityBot/1.0', 'Googlebot/2.1']) {
        const res = await fetch(`${origin}/tr/gastronomi/mekan/${firstPilotId}`, {
          headers: { 'User-Agent': ua },
        });
        assert.equal(res.status, 200, `Bot ${ua} blocked`);
        assert.equal(res.headers.get('access-control-allow-origin'), null, 'Global CORS header must be removed');
        assert.equal(res.headers.get('access-control-allow-credentials'), null, 'Global CORS credentials header must be removed');
        const html = await res.text();
        assert.ok(html.includes('<h1') && html.includes('application/ld+json'));
        const mainHtml = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || '';
        const headTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '';
        assert.ok(mainHtml.length > 200, 'Expected substantial <main> SSR content for AI bots');
        const visibleText = (headTitle + ' ' + mainHtml.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
        assert.equal(POLICY_FORBIDDEN_RE.test(visibleText), false, 'Forbidden copy found in visible pilot venue HTML');
      }

      // Guide article Schema @id parity & no og-image.jpg 404
      for (const art of [
        { p: '/tr/rehber/cocuklu-aileler-icin-fethiye', expectedOrigin: 'https://www.yeriniayir.com/' },
        {
          p: '/en/guide/best-regions-for-all-inclusive-in-turkey-which-coast-fits-your-style-uk-friendly-guide',
          expectedOrigin: 'https://www.worldandhotels.com/',
        },
      ]) {
        const res = await fetch(`${origin}${art.p}`);
        assert.equal(res.status, 200, `Expected 200 for ${art.p}`);
        const html = await res.text();
        assert.ok(!html.includes('og-image.jpg'), `Missing og-image.jpg still referenced in ${art.p}`);
        const { jsonLdBlocks } = extractMetaMap(html);
        const schemaUrls = collectStrings(jsonLdBlocks);
        assert.ok(
          schemaUrls.some((s) => s.startsWith(art.expectedOrigin)),
          `Expected Schema URL/ID starting with ${art.expectedOrigin} in ${art.p}`
        );
      }

      // TR + EN + root /feed.xml RSS (domain-aware rewrite without serving <html lang="feed.xml">)
      for (const f of [
        { p: '/tr/feed.xml', host: null, langTag: '<language>tr</language>', expectedOrigin: 'https://www.yeriniayir.com/rehber/' },
        { p: '/en/feed.xml', host: null, langTag: '<language>en</language>', expectedOrigin: 'https://www.worldandhotels.com/guide/' },
        { p: '/feed.xml', host: 'www.yeriniayir.com', langTag: '<language>tr</language>', expectedOrigin: 'https://www.yeriniayir.com/rehber/' },
        { p: '/feed.xml', host: 'www.worldandhotels.com', langTag: '<language>en</language>', expectedOrigin: 'https://www.worldandhotels.com/guide/' },
      ]) {
        const res = f.host
          ? await httpGetWithHost(nextPort, f.p, f.host)
          : await fetch(`${origin}${f.p}`).then(async (r) => ({
              status: r.status,
              headers: Object.fromEntries(r.headers.entries()),
              body: await r.text(),
            }));
        assert.equal(res.status, 200, `Expected 200 for ${f.p} (${f.host || 'localhost'})`);
        assert.ok((res.headers['content-type'] || '').includes('application/xml'), `Expected XML content-type for ${f.p}`);
        const xml = res.body;
        assert.ok(xml.includes('<rss') && xml.includes('</rss>') && xml.includes(f.langTag));
        assert.ok(!xml.includes('<html'), `Root /feed.xml rendered HTML instead of RSS XML (${f.host || 'localhost'})`);
        assert.ok(!xml.includes('gnkhotels.com'), `Legacy gnkhotels.com found in ${f.p}`);
        assert.ok(xml.includes(f.expectedOrigin), `Expected ${f.expectedOrigin} items in ${f.p}`);
        const channelHeader = xml.split('<item>')[0];
        assert.equal(POLICY_FORBIDDEN_RE.test(channelHeader), false, `Forbidden copy found in ${f.p} channel header`);
      }

      // Check carsi-ciya-sofrasi EN title does not duplicate Kadikoy
      const ciyaEnRes = await fetch(`${origin}/en/gastronomy/venue/carsi-ciya-sofrasi`);
      assert.equal(ciyaEnRes.status, 200);
      const ciyaEnHtml = await ciyaEnRes.text();
      assert.ok(ciyaEnHtml.includes('(Kadikoy)'), 'Expected clean (Kadikoy) label for carsi-ciya-sofrasi');
      assert.equal(ciyaEnHtml.includes('Kadıköy, Kadikoy'), false, 'Duplicate Kadıköy, Kadikoy label found');

      // Sitemap 1,529 exact URLs
      const smRes = await fetch(`${origin}/sitemap.xml`);
      assert.equal(smRes.status, 200);
      const smXml = await smRes.text();
      const locs = [...smXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      assert.equal(locs.length, 1529, `Expected exact 1529 sitemap URLs, got ${locs.length}`);
      assert.ok(!locs.some((u) => /otel-listesi|kullanim-sartlari/.test(u)));

      // Noindex routes + duplicate legal redirect/canonical check
      for (const ni of [
        { p: '/tr/otel-listesi', canonical: null },
        { p: '/tr/kullanim-sartlari', canonical: 'https://www.yeriniayir.com/kullanim-kosullari' },
      ]) {
        const res = await fetch(`${origin}${ni.p}`);
        assert.equal(res.status, 200);
        assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow');
        const html = await res.text();
        const meta = extractMetaMap(html);
        assert.ok((meta.byKey.robots || '').includes('noindex'), `Expected robots noindex meta on ${ni.p}`);
        if (ni.canonical) assert.equal(meta.canonical, ni.canonical);
      }

      // 4 active legal routes canonical check (TR + EN)
      for (const slug of ['cerez-politikasi', 'gizlilik-politikasi', 'kullanim-kosullari', 'kvkk-aydinlatma-metni']) {
        for (const p of [`/tr/${slug}`, `/en/${slug}`]) {
          const res = await fetch(`${origin}${p}`);
          assert.equal(res.status, 200);
          const meta = extractMetaMap(await res.text());
          assert.equal(meta.canonical, `https://www.yeriniayir.com/${slug}`, `Legal canonical mismatch on ${p}`);
        }
      }
    });

    // -------------------------------------------------------------------------
    // 5. Flow E: Admin Fail-Closed /jilinrime, CSRF Rejection & GoTrue Logout Revocation
    // -------------------------------------------------------------------------
    await check('5. Flow E: Fail-closed /jilinrime & adminAuth 503 without ADMIN_PASSWORD, CSRF 403 & live GoTrue /logout?scope=local revocation', async () => {
      const adminRes = await fetch(`${origin}/tr/jilinrime`, { redirect: 'manual' });
      assert.equal(adminRes.status, 401, `Expected 401 on supabase-mode /tr/jilinrime without session, got ${adminRes.status}`);
      assert.equal(adminRes.headers.get('x-robots-tag'), 'noindex, nofollow');
      assert.ok((adminRes.headers.get('cache-control') || '').includes('no-store'));

      // Bare /gastronomi-yonetimi must rewrite to admin login view (not public gastronomy homepage)
      const bareAdminRes = await fetch(`${origin}/gastronomi-yonetimi`);
      assert.equal(bareAdminRes.status, 200);
      assert.equal(bareAdminRes.headers.get('x-robots-tag'), 'noindex, nofollow');
      assert.ok((bareAdminRes.headers.get('cache-control') || '').includes('no-store'));
      const bareAdminHtml = await bareAdminRes.text();
      assert.ok(bareAdminHtml.includes('AI Gastronomi Yönetimi'), 'Bare /gastronomi-yonetimi did not route to admin UI');
      assert.equal(bareAdminHtml.includes('<html lang="gastronomi-yonetimi"'), false);

      const savedAuthMode = process.env.GASTRONOMY_AUTH_MODE;
      const savedAdminPw = process.env.ADMIN_PASSWORD;
      try {
        process.env.GASTRONOMY_AUTH_MODE = 'basic';
        delete process.env.ADMIN_PASSWORD;
        const { checkPilotAdmin } = loadTs('lib/pilot/adminAuth.ts', { cache: new Map() });
        const basicFailClosed = await checkPilotAdmin(null);
        assert.deepEqual(basicFailClosed, { ok: false, status: 503 });
      } finally {
        if (savedAuthMode === undefined) delete process.env.GASTRONOMY_AUTH_MODE;
        else process.env.GASTRONOMY_AUTH_MODE = savedAuthMode;
        if (savedAdminPw === undefined) delete process.env.ADMIN_PASSWORD;
        else process.env.ADMIN_PASSWORD = savedAdminPw;
      }

      const sessionRes = await fetch(`${origin}/api/gastronomy-admin/session`);
      assert.equal(sessionRes.status, 401);
      assert.ok((sessionRes.headers.get('cache-control') || '').includes('no-store'));

      // Cross-origin CSRF attempt on live logout -> 403 and 0 GoTrue calls
      const hitsBeforeCsrf = authLogoutRequests.length;
      const csrfRes = await fetch(`${origin}/api/gastronomy-admin/logout`, {
        method: 'POST',
        headers: {
          Origin: 'https://evil.example',
          Cookie: 'ya_cloud_admin=header.payload.sig',
        },
      });
      assert.equal(csrfRes.status, 403);
      assert.equal(authLogoutRequests.length, hitsBeforeCsrf);

      // Valid same-origin logout on live isolated build -> clears both cookies safely with private no-store headers
      const okRes = await fetch(`${origin}/api/gastronomy-admin/logout`, {
        method: 'POST',
        headers: {
          Origin: origin,
          Cookie: 'ya_cloud_admin=header.payload.sig; ya_cloud_pending=tmp.pending.jwt',
        },
      });
      assert.equal(okRes.status, 200);
      assert.ok((okRes.headers.get('cache-control') || '').includes('no-store'));
      assert.equal(okRes.headers.get('x-robots-tag'), 'noindex, nofollow');
      const setCookies = okRes.headers.getSetCookie ? okRes.headers.getSetCookie() : [];
      assert.ok(setCookies.some((c) => c.startsWith('ya_cloud_admin=') && /Max-Age=0|Expires=/i.test(c)));
      assert.ok(setCookies.some((c) => c.startsWith('ya_cloud_pending=') && /Max-Age=0|Expires=/i.test(c)));

      // Direct cloud-configured logout handler test against live local GoTrue stub (/auth/v1/logout?scope=local)
      const savedEnv = { ...process.env };
      try {
        delete process.env.VERCEL;
        delete process.env.VERCEL_ENV;
        delete process.env.NEXT_PUBLIC_VERCEL_ENV;
        process.env.NODE_ENV = 'test';
        process.env.APP_ENVIRONMENT = 'test';
        process.env.GASTRONOMY_AUTH_MODE = 'supabase';
        process.env.GASTRONOMY_CLOUD_ENV = 'local';
        process.env.GASTRONOMY_SUPABASE_URL = `http://127.0.0.1:${mockPort}`;
        process.env.GASTRONOMY_SUPABASE_ANON_KEY = 'dummy-anon-key-local';
        process.env.GASTRONOMY_SUPABASE_REF = 'local';
        process.env.NEXT_PUBLIC_SUPABASE_URL = `http://127.0.0.1:${mockPort}`;
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'dummy-anon-key-local';
        process.env.NEXT_PUBLIC_SUPABASE_POLICY = JSON.stringify({
          environment: 'test',
          url: `http://127.0.0.1:${mockPort}`,
          ref: 'local',
        });
        process.env.UPSTASH_REDIS_REST_URL = `http://127.0.0.1:${mockPort}/upstash`;
        process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';
        process.env.RATE_LIMIT_ENFORCE = '1';

        const deletedCookies = [];
        const logoutMod = loadTs('app/api/gastronomy-admin/logout/route.ts', {
          cache: new Map(),
          mocks: {
            'next/headers': {
              cookies: async () => ({
                get: (name) =>
                  name === 'ya_cloud_admin'
                    ? { value: 'header.payload.sig' }
                    : name === 'ya_cloud_pending'
                      ? { value: 'tmp.pending.jwt' }
                      : undefined,
                delete: (name) => deletedCookies.push(name),
              }),
            },
          },
        });
        const directRes = await logoutMod.POST(
          new Request(`${origin}/api/gastronomy-admin/logout`, {
            method: 'POST',
            headers: {
              Origin: origin,
              Host: `127.0.0.1:${nextPort}`,
            },
          })
        );
        assert.equal(directRes.status, 200);
        assert.equal(authLogoutRequests.length, hitsBeforeCsrf + 1);
        const lastLogout = authLogoutRequests[authLogoutRequests.length - 1];
        assert.equal(lastLogout.path, '/auth/v1/logout');
        assert.equal(lastLogout.query, '?scope=local');
        assert.equal(lastLogout.authorization, 'Bearer header.payload.sig');
        assert.equal(lastLogout.apikey, 'dummy-anon-key-local');
        assert.deepEqual(deletedCookies.sort(), ['ya_cloud_admin', 'ya_cloud_pending']);
      } finally {
        process.env = savedEnv;
      }
    });

    // -------------------------------------------------------------------------
    // 6. Flow F: All 92 Live Region Snapshots (2,425 Venues) + Payload Bytes Benchmark
    // -------------------------------------------------------------------------
    await check('6. Flow F: 92 published regions (2272 primary + 153 nearby = 2425 venues) integrity & HTML/compression benchmark', async () => {
      const regionFiles = fs.readdirSync(path.join(ROOT, 'lib/gastronomy-v3/regions')).filter((f) => f.endsWith('.json'));
      assert.equal(regionFiles.length, 93, `Expected 93 JSON files (92 live + 1 nearby pool), got ${regionFiles.length}`);
      assert.ok(regionFiles.includes('istanbul-kadikoy-nearby-pool.json'));

      const snapshots = V3_LOCATIONS.map((loc) => getPublishedV3Snapshot(loc.slug)).filter(Boolean);
      assert.equal(V3_LOCATIONS.length, 92);
      assert.equal(snapshots.length, 92);

      let primaryCount = 0;
      let nearbyCount = 0;
      const seenPlaceIds = new Set();
      for (const snap of snapshots) {
        assert.ok(Array.isArray(snap.venues) && snap.venues.length > 0, `Empty venues in ${snap.region.id}`);
        for (const v of snap.venues) {
          primaryCount++;
          assert.ok(v.placeId && !seenPlaceIds.has(v.placeId), `Duplicate primary placeId: ${v.placeId}`);
          seenPlaceIds.add(v.placeId);
          assert.ok(
            Number.isFinite(v.coordinates?.lat) && Number.isFinite(v.coordinates?.lng),
            `Missing coords in ${v.id}`
          );
          assert.match(String(v.mapsUri || ''), /^https:\/\/maps\.google\.com\/\?cid=\d+$/);
          const publicCopy = [v.name, v.description, ...(v.whatToOrder || []), ...(v.alsoTry || []), ...(v.beforeYouGo || [])].join(' ');
          assert.equal(POLICY_FORBIDDEN_RE.test(publicCopy), false, `Forbidden copy in venue ${v.id}`);
          assert.equal(publicCopy.includes('userRatingCount'), false);
        }
        for (const nv of snap.nearbyVenues || []) {
          nearbyCount++;
          assert.ok(
            Number.isFinite(nv.coordinates?.lat) && Number.isFinite(nv.coordinates?.lng),
            `Missing nearby coords in ${nv.id}`
          );
          assert.match(String(nv.mapsUri || ''), /^https:\/\/maps\.google\.com\/\?cid=\d+$/);
        }
      }
      assert.equal(primaryCount, 2272, `Expected 2272 primary venues, got ${primaryCount}`);
      assert.equal(nearbyCount, 153, `Expected 153 nearby venues, got ${nearbyCount}`);
      assert.equal(primaryCount + nearbyCount, 2425);

      const benchRoutes = ['/tr', '/tr/gastronomi', '/tr/gastronomi/istanbul/kadikoy/moda', `/tr/gastronomi/mekan/${firstPilotId}`];
      const benchRows = [];
      for (const p of benchRoutes) {
        const res = await fetch(`${origin}${p}`);
        assert.equal(res.status, 200);
        const html = await res.text();
        const rawBuf = Buffer.from(html, 'utf8');
        const gzBuf = zlib.gzipSync(rawBuf, { level: 6 });
        const brBuf = zlib.brotliCompressSync(rawBuf);
        const scriptCount = (html.match(/<script\b[^>]*src=/gi) || []).length;
        benchRows.push({
          route: p,
          rawBytes: rawBuf.length,
          gzipBytes: gzBuf.length,
          brotliBytes: brBuf.length,
          scriptTags: scriptCount,
        });
      }
      console.log('PAKET10_HTML_BENCHMARK ' + JSON.stringify(benchRows));
    });

    console.log(`\nALL PAKET 10 FINAL RELEASE AUDIT CHECKS PASSED: ${passed}/6 checks.`);
  } finally {
    if (browser) await browser.close().catch(() => {});
    nextProc.kill('SIGTERM');
    mockServer.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
