// Run after `npm run build`: node scripts/verify_paket03_perf_and_analytics.cjs
// Verifies CDN/ISR static prerendering, zero Footer DB queries on Gastronomy root,
// region API visitor isolation, analytics deduplication/sanitization/degradation,
// P0 security file untouchability, and real 390px/1440px browser flows.
const assert = require('node:assert/strict');
const { execFileSync, spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { createRequire } = require('node:module');

const root = process.cwd();
const repoRequire = createRequire(path.join(root, 'package.json'));
const ts = repoRequire('typescript');
const puppeteer = repoRequire('puppeteer');

function loadTs(relativePath, mocks = {}, cache = new Map()) {
  const filename = path.join(root, relativePath);
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = { exports: {} };
  cache.set(filename, mod);
  const localRequire = createRequire(filename);
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      ...(filename.endsWith('.tsx') ? { jsx: ts.JsxEmit.ReactJSX } : {}),
    },
  }).outputText;

  function scopedRequire(id) {
    if (Object.prototype.hasOwnProperty.call(mocks, id)) return mocks[id];
    if (id.startsWith('@/')) {
      const target = path.join(root, id.slice(2));
      for (const ext of ['', '.ts', '.tsx', '.js']) {
        if (fs.existsSync(target + ext) && fs.statSync(target + ext).isFile()) {
          if ((target + ext).endsWith('.ts') || (target + ext).endsWith('.tsx')) {
            return loadTs(path.relative(root, target + ext), mocks, cache);
          }
          return localRequire(target + ext);
        }
      }
    }
    if (id.startsWith('./') || id.startsWith('../')) {
      const target = path.resolve(path.dirname(filename), id);
      for (const ext of ['', '.ts', '.tsx', '.js']) {
        if (fs.existsSync(target + ext) && fs.statSync(target + ext).isFile()) {
          if ((target + ext).endsWith('.ts') || (target + ext).endsWith('.tsx')) {
            return loadTs(path.relative(root, target + ext), mocks, cache);
          }
          return localRequire(target + ext);
        }
      }
    }
    return localRequire(id);
  }

  new Function('require', 'module', 'exports', output)(scopedRequire, mod, mod.exports);
  return mod.exports;
}

(async () => {
  let passed = 0;
  async function check(label, fn) {
    await fn();
    passed++;
    console.log(`PASS ${label}`);
  }

  // ---------------------------------------------------------------------------
  // 1. Static & Hardened P0 Baseline Preservation Checks
  // ---------------------------------------------------------------------------
  await check('1.1 Perf merge (0cd87e6) left all P0 security boundaries intact and active', async () => {
    const perfTouched = execFileSync('git', ['diff', '--name-only', 'b208160', 'feat/gastronomy-v5-perf-cost'], {
      cwd: root,
      encoding: 'utf8',
    })
      .trim()
      .split('\n');
    const securityCore = [
      'lib/security/supabase-policy.js',
      'lib/pilot/securityPolicy.ts',
      'lib/admin/offerAdminGuard.ts',
      'lib/supabase-env-guard.ts',
      'lib/supabase.ts',
      'lib/supabase-admin.ts',
      'lib/cloud/config.ts',
      'lib/cloud/auth.ts',
      'lib/offers.ts',
      'middleware.ts',
      'next.config.js',
      'app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts',
    ];
    for (const secFile of securityCore) {
      assert.equal(perfTouched.includes(secFile), false, `Perf branch 0cd87e6 must not touch ${secFile}`);
    }
    assert.match(fs.readFileSync(path.join(root, 'lib/offers.ts'), 'utf8'), /assertValidOfferAdminCapability/);
    assert.match(fs.readFileSync(path.join(root, 'middleware.ts'), 'utf8'), /hasProtectedSegment/);
  });

  await check('1.2 localPreview.ts no longer uses headers() and Gastronomy root uses ISR', async () => {
    const lpSrc = fs.readFileSync(path.join(root, 'lib/food/localPreview.ts'), 'utf8');
    const lpCodeOnly = lpSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    assert.doesNotMatch(lpCodeOnly, /next\/headers/);
    assert.doesNotMatch(lpCodeOnly, /\bheaders\s*\(/);

    const rootPageSrc = fs.readFileSync(path.join(root, 'app/[lang]/(gastronomy)/page.tsx'), 'utf8');
    assert.doesNotMatch(rootPageSrc, /force-dynamic/);
    assert.doesNotMatch(rootPageSrc, /searchParams/);
    assert.match(rootPageSrc, /export const revalidate = 3600/);

    assert.equal(fs.existsSync(path.join(root, 'app/[lang]/(main)/page.tsx')), false);
  });

  await check('1.3 publish/route.ts preserves auth guards while revalidating static gastronomy routes', async () => {
    const pubSrc = fs.readFileSync(path.join(root, 'app/api/gastronomy-admin/publish/route.ts'), 'utf8');
    assert.match(pubSrc, /sameOrigin\(request\)/);
    assert.match(pubSrc, /cloudAdmin\(\)/);
    assert.match(pubSrc, /revalidateTag\('ya-publication'\)/);
    assert.match(pubSrc, /revalidatePath\('\/tr'\)/);
    assert.match(pubSrc, /revalidatePath\('\/en'\)/);
    assert.match(pubSrc, /revalidatePath\(`\/api\/gastronomy\/regions\/\$\{regionSlug\}`\)/);
  });

  // ---------------------------------------------------------------------------
  // 2. Region API Endpoint Verification (DTO isolation, staging headers, 404)
  // ---------------------------------------------------------------------------
  await check('2.1 Region endpoint exports force-static, revalidate=3600 and 92 static params', async () => {
    const regMod = loadTs('app/api/gastronomy/regions/[slug]/route.ts');
    assert.equal(regMod.dynamic, 'force-static');
    assert.equal(regMod.revalidate, 3600);
    const params = regMod.generateStaticParams();
    assert.equal(params.length, 92);

    const savedAppEnv = process.env.APP_ENVIRONMENT;
    try {
      delete process.env.APP_ENVIRONMENT;
      const res = await regMod.GET(new Request('http://127.0.0.1/api/gastronomy/regions/moda'), {
        params: Promise.resolve({ slug: 'moda' }),
      });
      assert.equal(res.status, 200);
      assert.match(res.headers.get('cache-control') || '', /public, max-age=300, s-maxage=3600/);
      const bodyText = await res.text();
      assert.doesNotMatch(bodyText, /reviewCount|userRatingCount|sourcePageUrl|dossiers|locations/);
      const json = JSON.parse(bodyText);
      assert.equal(json.regionSlug, 'moda');
      assert.ok(json.venues.length > 0);
      assert.ok(json.categories.length > 0);

      // Unknown or coming_soon slug -> 404
      const res404 = await regMod.GET(new Request('http://127.0.0.1/api/gastronomy/regions/not-published-xyz'), {
        params: Promise.resolve({ slug: 'not-published-xyz' }),
      });
      assert.equal(res404.status, 404);

      // Staging must mark cache private, no-store
      process.env.APP_ENVIRONMENT = 'staging';
      const resStaging = await regMod.GET(new Request('http://127.0.0.1/api/gastronomy/regions/moda'), {
        params: Promise.resolve({ slug: 'moda' }),
      });
      assert.equal(resStaging.status, 200);
      assert.match(resStaging.headers.get('cache-control') || '', /private, no-store/);
    } finally {
      if (savedAppEnv === undefined) delete process.env.APP_ENVIRONMENT;
      else process.env.APP_ENVIRONMENT = savedAppEnv;
    }
  });

  // ---------------------------------------------------------------------------
  // 3. Analytics /api/track-event Verification (Dedup, Sanitization, Degradation)
  // ---------------------------------------------------------------------------
  await check('3.1 /api/track-event validates before Upstash, deduplicates views, strips PII/tracking params, never 500s', async () => {
    const savedEnv = { ...process.env };
    let upstashCalls = [];
    let upstashShouldThrow = false;
    let dbInserts = [];
    let dbErrorToReturn = null;
    let isolatedFlag = false;

    const mocks = {
      '@/lib/supabase': {
        get isSupabaseIsolated() {
          return isolatedFlag;
        },
        supabase: {
          from: () => ({
            insert: async (row) => {
              if (dbErrorToReturn === 'THROW') throw new Error('Simulated DB socket error');
              if (dbErrorToReturn) return { error: dbErrorToReturn };
              dbInserts.push(row);
              return { error: null };
            },
          }),
        },
      },
      '@upstash/redis': {
        Redis: class {
          constructor(cfg) {
            this.cfg = cfg;
          }
        },
      },
      '@upstash/ratelimit': {
        Ratelimit: class {
          static slidingWindow() {
            return {};
          }
          async limit(key) {
            upstashCalls.push(key);
            if (upstashShouldThrow) throw new Error('Simulated Upstash outage');
            return { success: true };
          }
        },
      },
    };

    try {
      process.env.NODE_ENV = 'production';
      process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.example.invalid';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';
      delete process.env.ANALYTICS_DB_ENABLED;

      const { POST } = loadTs('app/api/track-event/route.ts', mocks);

      const mkReq = (rawBody, ip = '203.0.113.10') =>
        new Request('https://www.yeriniayir.com/api/track-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': ip,
          },
          body: typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody),
        });

      // a) Invalid JSON -> 400, 0 Upstash calls, 0 DB inserts
      const rBadJson = await POST(mkReq('{bad-json'));
      assert.equal(rBadJson.status, 400);
      assert.equal(upstashCalls.length, 0);
      assert.equal(dbInserts.length, 0);

      // b) Click event without hotel_id -> 400, 0 Upstash calls
      const rClickNoId = await POST(mkReq({ event_type: 'website_click', hotel_id: null }));
      assert.equal(rClickNoId.status, 400);
      assert.equal(upstashCalls.length, 0);

      // c) Valid page_view with hotel_id: null & noisy/PII metadata -> 200, metadata stripped, IP hashed
      const rPv1 = await POST(
        mkReq({
          event_type: 'page_view',
          hotel_id: null,
          metadata: {
            path: '/tr/otel/11111111-1111-4111-8111-111111111111?fbclid=leak123',
            search: '?utm_source=ig&fbclid=leak123',
            email: 'user@example.com',
            fbclid: 'leak123',
            lang: 'tr',
          },
        })
      );
      assert.equal(rPv1.status, 200);
      const pv1Body = await rPv1.json();
      assert.equal(pv1Body.recorded, true);
      assert.equal(upstashCalls.length, 1);
      assert.notEqual(upstashCalls[0], '203.0.113.10'); // IP hashed
      assert.equal(dbInserts.length, 1);
      assert.deepEqual(dbInserts[0].metadata, {
        path: '/tr/otel/11111111-1111-4111-8111-111111111111',
        lang: 'tr',
      });

      // d) Duplicate page_view within 60s -> deduplicated, 0 extra Upstash or DB writes!
      const rPvDup = await POST(
        mkReq({
          event_type: 'page_view',
          hotel_id: null,
          metadata: { path: '/tr/otel/11111111-1111-4111-8111-111111111111' },
        })
      );
      assert.equal(rPvDup.status, 200);
      assert.equal((await rPvDup.json()).deduplicated, true);
      assert.equal(upstashCalls.length, 1);
      assert.equal(dbInserts.length, 1);

      // e) Interaction events (website_click, instagram_click) with UUID -> 200
      const hotelUuid = '22222222-2222-4222-8222-222222222222';
      const rClick = await POST(
        mkReq({ event_type: 'website_click', hotel_id: hotelUuid, device_type: 'mobile' })
      );
      assert.equal(rClick.status, 200);
      assert.equal(dbInserts.length, 2);

      // f) Supabase RLS hold (42501) -> 202 (never 500)
      dbErrorToReturn = { code: '42501', message: 'new row violates row-level security policy' };
      const rRlsHold = await POST(
        mkReq({ event_type: 'instagram_click', hotel_id: hotelUuid, device_type: 'mobile' })
      );
      assert.equal(rRlsHold.status, 202);
      assert.equal((await rRlsHold.json()).recorded, false);

      // g) Upstash outage + DB throw -> still degrades gracefully (202, never 500!)
      upstashShouldThrow = true;
      dbErrorToReturn = 'THROW';
      const rOutage = await POST(
        mkReq({ event_type: 'website_click', hotel_id: hotelUuid, device_type: 'mobile' }, '203.0.113.11')
      );
      assert.equal(rOutage.status, 202);

      // h) Isolated Preview mode -> 202, 0 Upstash, 0 DB
      isolatedFlag = true;
      upstashCalls = [];
      dbInserts = [];
      const rIso = await POST(mkReq({ event_type: 'website_click', hotel_id: hotelUuid }));
      assert.equal(rIso.status, 202);
      assert.equal(upstashCalls.length, 0);
      assert.equal(dbInserts.length, 0);
    } finally {
      process.env = savedEnv;
    }
  });

  // ---------------------------------------------------------------------------
  // 4. Built Prerender & Headless Chrome Full E2E Flows
  // ---------------------------------------------------------------------------
  const prerenderPath = path.join(root, '.next/prerender-manifest.json');
  assert.ok(fs.existsSync(prerenderPath), '.next build must exist before running this script');

  await check('4.1 Compiled build statically prerenders /tr, /en, /rehber, /sitemap.xml and all 92 region endpoints', async () => {
    const manifest = JSON.parse(fs.readFileSync(prerenderPath, 'utf8'));
    const routes = Object.keys(manifest.routes || {});
    assert.ok(routes.includes('/tr'), '/tr must be statically prerendered');
    assert.ok(routes.includes('/en'), '/en must be statically prerendered');
    assert.ok(routes.includes('/tr/rehber'), '/tr/rehber must be statically prerendered');
    assert.ok(routes.includes('/en/rehber'), '/en/rehber must be statically prerendered');
    assert.ok(routes.includes('/sitemap.xml'), '/sitemap.xml must be prerendered');
    const regionRoutes = routes.filter((r) => r.startsWith('/api/gastronomy/regions/'));
    assert.equal(regionRoutes.length, 92, 'All 92 region endpoints must be prerendered');
  });

  await check('4.2 Live Next server + Headless Chrome (390px & 1440px): zero track-event, zero articles DB, UTM/fbclid safe, Back/Forward cached', async () => {
    let articlesQueries = 0;
    let analyticsQueries = 0;
    let upstashCalls = 0;

    const mockServer = http.createServer((req, res) => {
      if (req.url.startsWith('/rest/v1/articles')) articlesQueries++;
      if (req.url.startsWith('/rest/v1/analytics_events')) analyticsQueries++;
      if (req.url.startsWith('/upstash')) upstashCalls++;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
    });
    await new Promise((r) => mockServer.listen(0, '127.0.0.1', r));
    const mockPort = mockServer.address().port;
    const nextPort = 3345;
    const origin = `http://127.0.0.1:${nextPort}`;

    const nextProc = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(nextPort)], {
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
        NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${mockPort}`,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-anon',
        UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${mockPort}/upstash`,
        UPSTASH_REDIS_REST_TOKEN: 'dummy-token',
      },
    });

    try {
      await new Promise((resolve, reject) => {
        let startupLogs = '';
        let settled = false;
        const done = (err) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (err) reject(err);
          else resolve();
        };
        const timer = setTimeout(() => {
          done(new Error(`Next startup timeout. Logs:\n${startupLogs.slice(-1500)}`));
        }, 15000);
        nextProc.stdout.on('data', (c) => {
          const text = String(c);
          startupLogs += text;
          if (text.includes('Ready')) {
            done();
          }
        });
        nextProc.stderr.on('data', (c) => {
          startupLogs += String(c);
        });
        nextProc.once('exit', (code, signal) => {
          done(new Error(`Next exited early (code=${code}, signal=${signal}). Logs:\n${startupLogs.slice(-1500)}`));
        });
      });

      const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ['--no-sandbox'],
      });

      try {
        for (const width of [390, 1440]) {
          const context = await browser.createBrowserContext();
          const page = await context.newPage();
          await page.setViewport({
            width,
            height: width < 500 ? 844 : 1000,
            isMobile: width < 500,
            hasTouch: width < 500,
          });

          const pageErrors = [];
          const regionFetches = [];
          const trackCalls = [];
          page.on('pageerror', (e) => pageErrors.push(e.message));
          await page.setRequestInterception(true);
          page.on('request', (req) => {
            const u = new URL(req.url());
            if (u.origin !== origin && !['data:', 'blob:'].includes(u.protocol)) {
              req.abort();
            } else {
              req.continue();
            }
          });
          page.on('response', (res) => {
            if (!res.url().startsWith(origin)) return;
            const u = new URL(res.url());
            if (u.pathname.startsWith('/api/gastronomy/regions/')) {
              regionFetches.push({ path: u.pathname, status: res.status() });
            } else if (u.pathname.startsWith('/api/track-event')) {
              trackCalls.push({ status: res.status() });
            }
          });

          // 1. Open with Instagram UTM + fbclid
          await page.goto(`${origin}/tr?utm_source=instagram&fbclid=story_test_${width}`, {
            waitUntil: 'networkidle0',
          });
          const headingText = await page.$eval('h1', (el) => el.textContent || '');
          assert.ok(headingText.includes('CANIN NE ÇEKİYOR'));
          // UTM/fbclid preserved in browser bar without server SSR churn
          assert.ok(page.url().includes('fbclid=story_test_'));

          // Dismiss cookie banner if present
          await page.evaluate(() => {
            const banner = document.querySelector('div.fixed.inset-x-0.bottom-0');
            if (banner) {
              const btn = Array.from(banner.querySelectorAll('button')).pop();
              if (btn) btn.click();
            }
          });

          // 2. Choose Moda -> renders Moda's first canonical category (pizza: 3 core + 1 nearby = 4 cards) -> open/close detail
          await page.click('header button');
          await page.waitForSelector('[role="dialog"] input');
          await page.type('[role="dialog"] input', 'Kadıköy');
          const pickedModa = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
              (b.textContent || '').includes('Moda, Kadıköy, İstanbul')
            );
            if (!btn) return false;
            btn.click();
            return true;
          });
          assert.equal(pickedModa, true);
          await page.waitForSelector('[data-venue-id]', { timeout: 10000 });
          await page.waitForFunction(
            () => location.search.includes('region=moda') && location.search.includes('category=pizza')
          );
          assert.equal(await page.$$eval('[data-venue-id]', (els) => els.length), 4);

          await page.$eval('[data-venue-id]', (el) => el.scrollIntoView({ block: 'start' }));
          await new Promise((r) => setTimeout(r, 150));
          await page.click('[data-venue-id] h2');
          await page.waitForSelector('[role="dialog"]');
          await page.keyboard.press('Escape');
          await page.waitForSelector('[role="dialog"]', { hidden: true });

          // 3. Switch to Karaköy, then test browser Back back to Moda (should hit in-memory cache!)
          await page.click('header button');
          await page.waitForSelector('[role="dialog"] input');
          await page.type('[role="dialog"] input', 'Karaköy');
          await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
              (b.textContent || '').includes('Karaköy, Beyoğlu')
            );
            if (btn) btn.click();
          });
          await page.waitForFunction(
            () => location.search.includes('region=karakoy') && document.querySelectorAll('[data-venue-id]').length > 0
          );
          const countAfterKarakoy = regionFetches.length;
          assert.equal(countAfterKarakoy, 2, 'Only moda and karakoy should have fetched');

          await page.goBack();
          await page.waitForFunction(
            () => location.search.includes('region=moda') && document.querySelectorAll('[data-venue-id]').length === 4
          );
          assert.equal(regionFetches.length, 2, 'Back navigation to cached Moda must incur 0 extra fetches');

          await page.goForward();
          await page.waitForFunction(
            () => location.search.includes('region=karakoy') && document.querySelectorAll('[data-venue-id]').length > 0
          );
          assert.equal(regionFetches.length, 2, 'Forward navigation to cached Karakoy must incur 0 extra fetches');

          // 4. Unsupported category & unsupported region edge cases
          await page.goto(`${origin}/tr?region=moda&category=deniz-urunleri`, { waitUntil: 'networkidle0' });
          assert.equal(await page.$$eval('[data-venue-id]', (e) => e.length), 0);

          await page.goto(`${origin}/tr?region=hazir-olmayan-bolge`, { waitUntil: 'networkidle0' });
          assert.ok((await page.$eval('h1', (e) => e.textContent || '')).includes('hazır değil'));

          // 5. Direct deep link with fbclid (Moda Kahve: 5 core + 1 nearby = 6 cards)
          await page.goto(`${origin}/tr?region=moda&category=kahve&fbclid=deep_123`, { waitUntil: 'networkidle0' });
          await page.waitForSelector('[data-venue-id]', { timeout: 10000 });
          assert.equal(await page.$$eval('[data-venue-id]', (els) => els.length), 6);

          assert.deepEqual(pageErrors, []);
          assert.deepEqual(trackCalls, [], 'Gastronomy routes must trigger 0 /api/track-event calls');
          await page.close();
          await context.close();
        }
      } finally {
        await browser.close();
      }

      assert.equal(articlesQueries, 0, 'Gastronomy routes must trigger 0 articles DB queries');
      assert.equal(analyticsQueries, 0, 'Gastronomy routes must trigger 0 analytics DB writes');
      assert.equal(upstashCalls, 0, 'Gastronomy routes must trigger 0 Upstash commands');
    } finally {
      nextProc.kill('SIGTERM');
      await new Promise((r) => mockServer.close(r));
    }
  });

  console.log(`\nALL PAKET 03 PERFORMANCE & ANALYTICS CHECKS PASSED: ${passed} checks.`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
