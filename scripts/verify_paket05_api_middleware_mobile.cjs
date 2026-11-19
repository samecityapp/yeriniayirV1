// Run after `npm run build`: node scripts/verify_paket05_api_middleware_mobile.cjs
// Tests Paket 05: API inventory & abuse protection, tiered rate limits + Upstash outage circuit breaker,
// CGNAT Instagram Story surge, middleware bypass closure & static exclusion, search deduplication,
// Permissions-Policy geolocation=(self), 2425-venue CID branch accuracy, and Mobile Chrome/Safari E2E flows.
require('./security/network-lock.cjs');

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { createRequire } = require('node:module');

const root = process.cwd();
const repoRequire = createRequire(path.join(root, 'package.json'));
const ts = repoRequire('typescript');
const { NextRequest } = repoRequire('next/server');
const { pathToRegexp } = repoRequire('next/dist/compiled/path-to-regexp');
const puppeteer = repoRequire('puppeteer');
const loadTs = require('./security/load-ts.cjs');

let passed = 0;
async function check(label, fn) {
  await fn();
  passed++;
  console.log(`PASS ${label}`);
}

function listFilesRecursive(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRecursive(full));
    else out.push(full);
  }
  return out;
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

function extractMiddlewareMatcherRegex() {
  const mwSrc = fs.readFileSync(path.join(root, 'middleware.ts'), 'utf8');
  const transpiled = ts.transpileModule(mwSrc, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  const dummy = new Proxy(
    {},
    {
      get() {
        return function () {
          return {};
        };
      },
    }
  );
  new Function('require', 'module', 'exports', transpiled)(
    (id) => {
      if (id === 'next/server') return { NextResponse: dummy };
      return new Proxy(
        {},
        {
          get() {
            return () => ({});
          },
        }
      );
    },
    mod,
    mod.exports
  );
  assert.ok(Array.isArray(mod.exports.config?.matcher), 'middleware config.matcher must be array');
  return pathToRegexp(mod.exports.config.matcher[0]);
}

async function main() {
  const savedEnv = { ...process.env };
  const tsconfigPath = path.join(root, 'tsconfig.json');
  const savedTsconfig = fs.existsSync(tsconfigPath) ? fs.readFileSync(tsconfigPath, 'utf8') : null;

  try {
    // -------------------------------------------------------------------------
    // GROUP 1: API Inventory & Static Guardrails
    // -------------------------------------------------------------------------
    await check('1.1 Active API routes & Server Actions inventory matches verified surface', async () => {
      const routeFiles = listFilesRecursive(path.join(root, 'app'))
        .filter((f) => path.basename(f) === 'route.ts' || path.basename(f) === 'route.js')
        .map((f) => path.relative(root, f))
        .sort();
      assert.equal(routeFiles.length, 20, `Expected 20 route files, got ${routeFiles.length}`);
      assert.ok(routeFiles.includes('app/api/gastronomy/regions/[slug]/route.ts'));
      assert.ok(routeFiles.includes('app/api/track-event/route.ts'));
      assert.ok(routeFiles.includes('app/api/go/route.ts'));
      assert.ok(routeFiles.includes('app/api/gastronomy-public/route.ts'));

      const regionSrc = fs.readFileSync(
        path.join(root, 'app/api/gastronomy/regions/[slug]/route.ts'),
        'utf8'
      );
      assert.match(regionSrc, /export const dynamicParams = false/);
      assert.match(regionSrc, /export const revalidate = 3600/);

      const feedSrc = fs.readFileSync(path.join(root, 'app/[lang]/(main)/feed.xml/route.ts'), 'utf8');
      assert.match(feedSrc, /export const revalidate = 3600/);
      assert.match(feedSrc, /isSupabaseIsolated/);

      const nextCfg = require(path.join(root, 'next.config.js'));
      const hdrBlocks = await nextCfg.headers();
      const globalHdrs = hdrBlocks.find((h) => h.source === '/:path*')?.headers || [];
      const perm = globalHdrs.find((h) => h.key === 'Permissions-Policy')?.value || '';
      assert.match(perm, /geolocation=\(self\)/);
      assert.match(perm, /camera=\(\)/);
      assert.match(perm, /microphone=\(\)/);
    });

    // -------------------------------------------------------------------------
    // GROUP 2: Tiered Rate-Limits, CGNAT Fairness, Early Validation, Upstash Outage
    // -------------------------------------------------------------------------
    await check('2.1 Invalid /api/go hotelId & /api/gastronomy-public scope reject 400 with ZERO Upstash or DB cost', async () => {
      let upstashHits = 0;
      let dbHits = 0;
      process.env.RATE_LIMIT_ENFORCE = '1';
      process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.example.invalid';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';

      const mocks = {
        '@upstash/redis': { Redis: class {} },
        '@upstash/ratelimit': {
          Ratelimit: class {
            static slidingWindow() {
              return {};
            }
            async limit() {
              upstashHits++;
              return { success: true, limit: 30, remaining: 29, reset: 9999999999 };
            }
          },
        },
        '@/lib/supabase': {
          isSupabaseIsolated: false,
          supabase: {
            from: () => ({
              insert: async () => {
                dbHits++;
                return { error: null };
              },
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => {
                    dbHits++;
                    return { data: null, error: null };
                  },
                }),
              }),
            }),
          },
        },
        '@/lib/cloud/publication': {
          readCloudPublication: async () => {
            dbHits++;
            return null;
          },
        },
      };

      const goRoute = loadTs('app/api/go/route.ts', mocks);
      const badGo = await goRoute.GET(new NextRequest('https://www.yeriniayir.com/api/go?hotelId=not-a-uuid'));
      assert.equal(badGo.status, 400);
      assert.match(badGo.headers.get('cache-control') || '', /no-store/);

      const pubRoute = loadTs('app/api/gastronomy-public/route.ts', mocks);
      const badPub1 = await pubRoute.GET(new Request('https://www.yeriniayir.com/api/gastronomy-public?scope=bad!scope'));
      assert.equal(badPub1.status, 400);
      const badPub2 = await pubRoute.GET(new Request('https://www.yeriniayir.com/api/gastronomy-public?scope=unknown-region/kahve'));
      assert.equal(badPub2.status, 400);

      assert.equal(upstashHits, 0, 'Invalid inputs must incur 0 Upstash commands');
      assert.equal(dbHits, 0, 'Invalid inputs must incur 0 DB/RPC calls');
    });

    await check('2.2 Tiered limits + CGNAT 25-device fairness + Layer-1 Upstash flood shielding', async () => {
      let upstashHits = 0;
      const cache = new Map();
      process.env.RATE_LIMIT_ENFORCE = '1';
      process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.example.invalid';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';

      const mocks = {
        '@upstash/redis': { Redis: class {} },
        '@upstash/ratelimit': {
          Ratelimit: class {
            static slidingWindow() {
              return {};
            }
            async limit() {
              upstashHits++;
              return { success: true, limit: 30, remaining: 29, reset: Math.ceil(Date.now() / 1000) + 10 };
            }
          },
        },
      };

      const rlMod = loadTs('lib/pilot/rateLimit.ts', { mocks, cache });
      rlMod.resetMemoryRateLimitersForTests();

      // 25 distinct mobile devices behind SAME CGNAT IP must all pass visitor_redirect (limit 30/device, 150/IP)
      for (let i = 0; i < 25; i++) {
        const hdr = new Headers({
          'x-real-ip': '198.51.100.77',
          'user-agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 17_${i % 5} like Mac OS X) InstagramApp/${i}`,
          'accept-language': 'tr-TR',
        });
        const r = await rlMod.enforceRateLimit(hdr, 'visitor_redirect', { scope: 'api' });
        assert.equal(r.ok, true, `CGNAT mobile device #${i} must not be blocked`);
      }

      // Single device flooding 35 requests -> first 30 ok, 31..35 return 429 at Layer 1 WITHOUT billing Upstash
      const upstashBeforeFlood = upstashHits;
      const abuseHdr = new Headers({
        'x-real-ip': '198.51.100.88',
        'user-agent': 'FloodBot/1.0',
      });
      for (let i = 1; i <= 30; i++) {
        assert.equal((await rlMod.enforceRateLimit(abuseHdr, 'visitor_redirect', { scope: 'api' })).ok, true);
      }
      const upstashAtCap = upstashHits;
      assert.ok(upstashAtCap > upstashBeforeFlood);
      for (let i = 31; i <= 35; i++) {
        const blocked = await rlMod.enforceRateLimit(abuseHdr, 'visitor_redirect', { scope: 'api' });
        assert.equal(blocked.ok, false);
        assert.equal(blocked.status, 429);
        assert.equal(blocked.policy, 'memory-l1');
        assert.ok(blocked.headers['Retry-After']);
      }
      assert.equal(upstashHits, upstashAtCap, 'Layer-1 blocked flood must consume 0 additional Upstash calls');

      // Critical admin_auth (8/60s) vs costly_admin (12/60s) differentiation
      const adminHdr = new Headers({ 'x-real-ip': '203.0.113.45' });
      for (let i = 1; i <= 8; i++) {
        assert.equal((await rlMod.enforceRateLimit(adminHdr, 'admin_auth', { scope: 'api' })).ok, true);
      }
      const auth9 = await rlMod.enforceRateLimit(adminHdr, 'admin_auth', { scope: 'api' });
      assert.equal(auth9.ok, false);
      assert.equal(auth9.status, 429);

      for (let i = 1; i <= 12; i++) {
        assert.equal((await rlMod.enforceRateLimit(adminHdr, 'costly_admin', { scope: 'api' })).ok, true);
      }
      const costly13 = await rlMod.enforceRateLimit(adminHdr, 'costly_admin', { scope: 'api' });
      assert.equal(costly13.ok, false);
      assert.equal(costly13.status, 429);
    });

    await check('2.3 Upstash outage triggers tight emergency-fallback circuit breaker (never unlimited!) on critical endpoints', async () => {
      const cache = new Map();
      process.env.RATE_LIMIT_ENFORCE = '1';
      process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.example.invalid';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';
      delete process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE;

      const failingMocks = {
        '@upstash/redis': { Redis: class {} },
        '@upstash/ratelimit': {
          Ratelimit: class {
            static slidingWindow() {
              return {};
            }
            async limit() {
              throw new Error('Simulated Upstash ECONNREFUSED');
            }
          },
        },
      };

      const rlMod = loadTs('lib/pilot/rateLimit.ts', { mocks: failingMocks, cache });
      rlMod.resetMemoryRateLimitersForTests();

      // Per-IP outage limit on admin_auth = 3/60s -> 4th blocked with 429 emergency-fallback!
      const attackerIp1 = new Headers({ 'x-real-ip': '192.0.2.10' });
      for (let i = 1; i <= 3; i++) {
        const res = await rlMod.enforceRateLimit(attackerIp1, 'admin_auth', { scope: 'api' });
        assert.equal(res.ok, true);
        assert.equal(res.policy, 'emergency-fallback');
      }
      const blockedIp1 = await rlMod.enforceRateLimit(attackerIp1, 'admin_auth', { scope: 'api' });
      assert.equal(blockedIp1.ok, false);
      assert.equal(blockedIp1.status, 429);
      assert.equal(blockedIp1.policy, 'emergency-fallback');
      assert.ok(blockedIp1.headers['Retry-After']);

      // Rotating IPs during outage: global cap = 6/60s (3 already spent above -> 3 more allowed across IPs, 7th blocked!)
      for (let i = 0; i < 3; i++) {
        const h = new Headers({ 'x-real-ip': `192.0.2.${50 + i}` });
        assert.equal((await rlMod.enforceRateLimit(h, 'admin_auth', { scope: 'api' })).ok, true);
      }
      const blockedGlobal = await rlMod.enforceRateLimit(
        new Headers({ 'x-real-ip': '192.0.2.99' }),
        'admin_auth',
        { scope: 'api' }
      );
      assert.equal(blockedGlobal.ok, false);
      assert.equal(blockedGlobal.status, 429);
      assert.equal(blockedGlobal.policy, 'emergency-fallback');

      // Explicit block mode -> 503 outage-blocked
      process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE = 'block';
      const blocked503 = await rlMod.enforceRateLimit(
        new Headers({ 'x-real-ip': '192.0.2.100' }),
        'costly_admin',
        { scope: 'api' }
      );
      assert.equal(blocked503.ok, false);
      assert.equal(blocked503.status, 503);
      assert.equal(blocked503.policy, 'outage-blocked');
      delete process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE;
    });

    await check('2.4 Critical endpoint handlers (login, publish, createOffer) stay bounded during Upstash outage', async () => {
      const cache = new Map();
      let hdrs = new Headers({
        host: 'www.yeriniayir.com',
        origin: 'https://www.yeriniayir.com',
        'x-real-ip': '198.51.100.222',
      });
      process.env.APP_ENVIRONMENT = 'test';
      process.env.NODE_ENV = 'test';
      process.env.RATE_LIMIT_ENFORCE = '1';
      process.env.GASTRONOMY_AUTH_MODE = 'basic';
      process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.example.invalid';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';
      delete process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE;

      const mocks = {
        'next/headers': {
          headers: async () => hdrs,
          cookies: async () => new Map(),
        },
        'next/cache': {
          revalidatePath: () => {},
          revalidateTag: () => {},
        },
        '@/lib/cloud/auth': {
          ADMIN_COOKIE: 'ya_cloud_admin',
          PRIVATE_HEADERS: { 'Cache-Control': 'private, no-store, max-age=0' },
          sameOrigin: () => true,
          cloudAdmin: async () => null,
        },
        '@/lib/cloud/client': {
          cloudClient: () => ({}),
        },
        '@/lib/cloud/publication': {
          invalidateCloudPublication: () => {},
        },
        '@/lib/admin/offerAdminGuard': {
          requireOfferAdminAccess: async () => ({ ok: false, status: 401, error: 'Unauthorized' }),
        },
        '@/lib/offers': {
          offers: {},
        },
        '@upstash/redis': { Redis: class {} },
        '@upstash/ratelimit': {
          Ratelimit: class {
            static slidingWindow() {
              return {};
            }
            async limit() {
              throw new Error('Upstash down');
            }
          },
        },
      };

      const rlMod = loadTs('lib/pilot/rateLimit.ts', { mocks, cache });
      rlMod.resetMemoryRateLimitersForTests();
      const loginRoute = loadTs('app/api/gastronomy-admin/login/route.ts', { mocks, cache });
      const publishRoute = loadTs('app/api/gastronomy-admin/publish/route.ts', { mocks, cache });
      const offerActions = loadTs('app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts', {
        mocks,
        cache,
      });

      const mkPost = (u, b) =>
        new Request(u, {
          method: 'POST',
          headers: {
            host: 'www.yeriniayir.com',
            origin: 'https://www.yeriniayir.com',
            'x-real-ip': '198.51.100.222',
          },
          body: b,
        });

      for (let i = 1; i <= 3; i++) {
        const res = await loginRoute.POST(mkPost('https://www.yeriniayir.com/api/gastronomy-admin/login', '{}'));
        assert.equal(res.status, 400);
      }
      const login4 = await loginRoute.POST(mkPost('https://www.yeriniayir.com/api/gastronomy-admin/login', '{}'));
      assert.equal(login4.status, 429);
      assert.equal(login4.headers.get('x-ratelimit-policy'), 'emergency-fallback');

      for (let i = 1; i <= 3; i++) {
        const res = await publishRoute.POST(mkPost('https://www.yeriniayir.com/api/gastronomy-admin/publish', '{}'));
        assert.equal(res.status, 401);
      }
      const pub4 = await publishRoute.POST(mkPost('https://www.yeriniayir.com/api/gastronomy-admin/publish', '{}'));
      assert.equal(pub4.status, 429);
      assert.equal(pub4.headers.get('x-ratelimit-policy'), 'emergency-fallback');

      const fd = new FormData();
      for (let i = 1; i <= 3; i++) {
        const res = await offerActions.createOffer(fd);
        assert.equal(res.status, 401);
      }
      const act4 = await offerActions.createOffer(fd);
      assert.equal(act4.success, false);
      assert.equal(act4.status, 429);
    });

    // -------------------------------------------------------------------------
    // GROUP 3: Live Compiled Next Server — Matcher, CDN, CGNAT Surge, Evasion
    // -------------------------------------------------------------------------
    const matcherRegex = extractMiddlewareMatcherRegex();
    await check('3.1 Middleware matcher skips static .svg/.woff2 assets while trapping traversal attempts', async () => {
      for (const staticPath of [
        '/images/gastronomy/bolge-moda.svg',
        '/images/articles/sample-123.jpg',
        '/images/demo-hotels/hotel_bodrum_1.png',
        '/fonts/Inter-TR-EN-04308d9ab394.woff2',
        '/authors/melis.png',
        '/restaurants/frappe_beach.png',
        '/favicon.ico',
        '/robots.txt',
        '/sitemap.xml',
      ]) {
        assert.equal(matcherRegex.test(staticPath), false, `Static asset must bypass middleware: ${staticPath}`);
      }

      for (const dynamicOrAttackPath of [
        '/tr',
        '/api/go',
        '/tr/jilinrime.rsc',
        '/tr/jilinrime.svg',
        '/images/../tr/jilinrime.svg',
        '/images/%2e%2e/tr/jilinrime.svg',
        '/tr/%6a%69%6c%69%6e%72%69%6d%65',
      ]) {
        assert.equal(matcherRegex.test(dynamicOrAttackPath), true, `Dynamic/evasion path must enter middleware: ${dynamicOrAttackPath}`);
      }
    });

    const nextPort = await getFreePort();
    const origin = `http://127.0.0.1:${nextPort}`;
    const nextProc = spawn(
      process.execPath,
      ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(nextPort)],
      {
        cwd: root,
        env: {
          ...savedEnv,
          NODE_ENV: 'production',
          NODE_OPTIONS: `--require ${path.join(root, 'scripts/security/network-lock.cjs')}`,
          VERCEL: '1',
          VERCEL_ENV: 'preview',
          NEXT_PUBLIC_VERCEL_ENV: 'preview',
          APP_ENVIRONMENT: 'preview',
          GASTRONOMY_AUTH_MODE: 'supabase',
          GASTRONOMY_ENABLE_PREVIEW: '0',
          GASTRONOMY_LOCAL_PREVIEW: '0',
          RATE_LIMIT_ENFORCE: '1',
          NEXT_PUBLIC_DISABLE_ANALYTICS: '1',
          NEXT_PUBLIC_SUPABASE_URL: 'https://vhptlecaixpawtxnhsde.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-anon',
        },
      }
    );

    try {
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
        const timer = setTimeout(() => done(new Error(`Next startup timeout:\n${logs.slice(-1500)}`)), 15000);
        nextProc.stdout.on('data', (c) => {
          const text = String(c);
          logs += text;
          if (text.includes('Ready')) done();
        });
        nextProc.stderr.on('data', (c) => {
          logs += String(c);
        });
        nextProc.once('exit', (code) => done(new Error(`Next exited (${code}):\n${logs.slice(-1500)}`)));
      });

      await check('3.2 Live CDN headers, Permissions-Policy geolocation=(self), and Instagram 200-request CGNAT surge pass 100%', async () => {
        const trRes = await fetch(`${origin}/tr`);
        assert.equal(trRes.status, 200);
        assert.match(trRes.headers.get('cache-control') || '', /s-maxage=3600/);
        assert.match(trRes.headers.get('permissions-policy') || '', /geolocation=\(self\)/);

        const svgRes = await fetch(`${origin}/images/gastronomy/bolge-moda.svg`);
        assert.equal(svgRes.status, 200);
        assert.match(svgRes.headers.get('content-type') || '', /image\/svg\+xml/);
        assert.match(svgRes.headers.get('cache-control') || '', /max-age=86400/);

        const fontRes = await fetch(`${origin}/fonts/Inter-TR-EN-04308d9ab394.woff2`);
        assert.equal(fontRes.status, 200);
        assert.match(fontRes.headers.get('cache-control') || '', /max-age=31536000, immutable/);

        const regRes = await fetch(`${origin}/api/gastronomy/regions/moda`);
        assert.equal(regRes.status, 200);
        assert.match(regRes.headers.get('cache-control') || '', /public, max-age=300, s-maxage=3600/);

        // Instagram Story 200-request surge from ONE shared mobile CGNAT IP -> ZERO 429s!
        const cgnatIp = '198.51.100.77';
        const endpoints = [
          '/tr?utm_source=instagram&fbclid=ig_surge',
          '/api/gastronomy/regions/moda',
          '/api/gastronomy/regions/karakoy',
          '/images/gastronomy/bolge-moda.svg',
          '/fonts/Inter-TR-EN-04308d9ab394.woff2',
        ];
        const results = [];
        for (let batch = 0; batch < 10; batch++) {
          const chunk = await Promise.all(
            Array.from({ length: 20 }, (_, j) => {
              const idx = batch * 20 + j;
              const u = endpoints[idx % endpoints.length];
              return fetch(`${origin}${u}`, {
                headers: {
                  'x-real-ip': cgnatIp,
                  'user-agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) Instagram/${idx}`,
                },
              }).then((r) => r.status);
            })
          );
          results.push(...chunk);
        }
        assert.equal(results.length, 200);
        assert.equal(
          results.filter((s) => s !== 200).length,
          0,
          `Expected 200/200 OK under CGNAT surge, got non-200 statuses: ${results.filter((s) => s !== 200)}`
        );
      });

      await check('3.3 Live /api/* method guards, unknown API 404, encoded API 400, and admin evasion closure', async () => {
        // Unknown /api route -> 404 from middleware
        const unknownApi = await fetch(`${origin}/api/probe-nonexistent`);
        assert.equal(unknownApi.status, 404);
        assert.match(unknownApi.headers.get('cache-control') || '', /no-store/);

        // Wrong HTTP methods -> 405
        assert.equal((await fetch(`${origin}/api/go`, { method: 'POST' })).status, 405);
        assert.equal((await fetch(`${origin}/api/track-event`, { method: 'GET' })).status, 405);
        assert.equal((await fetch(`${origin}/api/gastronomy/regions/moda`, { method: 'POST' })).status, 405);
        assert.equal((await fetch(`${origin}/api/gastronomy-admin/login`, { method: 'GET' })).status, 405);

        // Encoded /api -> 400; double-slash /api//go canonicalized (308 -> /api/go) then 400 Invalid hotelId
        assert.equal((await fetch(`${origin}/%61%70%69/gastronomy-admin/workspace`, { redirect: 'manual' })).status, 400);
        const dblApiManual = await fetch(`${origin}/api//go?hotelId=bad`, { redirect: 'manual' });
        assert.equal(dblApiManual.status, 308);
        assert.equal((await fetch(`${origin}/api//go?hotelId=bad`)).status, 400);

        // Admin encoded / case / double-slash / traversal / suffix bypass attempts -> all denied (400/401/403), NEVER 200!
        for (const bypassPath of [
          '/tr/jilinrime',
          '/tr/jilinrime.rsc',
          '/tr/jilinrime/teklif-yonetimi.json',
          '/tr/%6a%69%6c%69%6e%72%69%6d%65',
          '/tr/%256a%69%6c%69%6e%72%69%6d%65',
          '/tr/jilinrime%2ersc',
          '/tr/JILINRIME',
          '/tr//jilinrime',
          '/images/../tr/jilinrime.svg',
          '/images/%2e%2e/tr/jilinrime.svg',
          '/tr/%6d%6f%64%61-kadikoy-pilot',
          '/tr/moda-kadikoy-pilot/decision.json',
        ]) {
          const rManual = await fetch(`${origin}${bypassPath}`, { redirect: 'manual' });
          const r =
            rManual.status === 308 && bypassPath.includes('//')
              ? await fetch(`${origin}${bypassPath}`)
              : rManual;
          assert.ok(
            [400, 401, 403, 503].includes(r.status),
            `Expected 400/401/403/503 fail-closed status for ${bypassPath}, got ${r.status}`
          );
          assert.match(r.headers.get('cache-control') || '', /no-store/);
        }
      });

      await check('3.4 Direct middleware test: even authenticated admin receives 400 on percent-encoded / uppercase / double-slash admin paths', async () => {
        Object.assign(process.env, {
          NODE_ENV: 'test',
          APP_ENVIRONMENT: 'test',
          RATE_LIMIT_ENFORCE: '0',
          GASTRONOMY_AUTH_MODE: 'basic',
          ADMIN_USER: 'pilot-admin',
          ADMIN_PASSWORD: 'test-only-password',
        });
        const { middleware } = loadTs('middleware.ts', {
          mocks: {
            '@upstash/redis': { Redis: class {} },
            '@upstash/ratelimit': {
              Ratelimit: class {
                static slidingWindow() {
                  return {};
                }
                async limit() {
                  return { success: true, limit: 25, remaining: 24, reset: 9999999999 };
                }
              },
            },
          },
        });
        const authHdr = 'Basic ' + Buffer.from('pilot-admin:test-only-password').toString('base64');
        for (const anom of [
          '/tr/%6a%69%6c%69%6e%72%69%6d%65',
          '/tr/JILINRIME',
          '/tr//jilinrime',
          '/tr/%6d%6f%64%61-kadikoy-pilot',
        ]) {
          const res = await middleware(
            new NextRequest(`http://localhost:3000${anom}`, { headers: { authorization: authHdr } })
          );
          assert.equal(res.status, 400, `Authenticated anomaly ${anom} must return 400`);
        }
        // Valid trailing-slash path with valid auth remains allowed
        const validTrailing = await middleware(
          new NextRequest('http://localhost:3000/tr/moda-kadikoy-pilot/', { headers: { authorization: authHdr } })
        );
        assert.equal(validTrailing.status, 200);
      });

      // -------------------------------------------------------------------------
      // GROUP 4: Search Catalog Deduplication & Isolation
      // -------------------------------------------------------------------------
      await check('4.1 loadHotelSearchCatalog deduplicates concurrent calls and skips queries when Supabase isolated', async () => {
        const queriedTables = [];
        let isolated = false;
        const makeQueryBuilder = (table) => {
          queriedTables.push(table);
          const chain = {
            select: () => chain,
            is: () => chain,
            order: () => chain,
            limit: async () => ({
              data: table === 'hotels' ? [{ id: 'h1', name: { tr: 'Test Otel' }, location: 'Moda' }] : [],
              error: null,
            }),
          };
          return chain;
        };

        const searchCache = loadTs('lib/hotelSearchCache.ts', {
          mocks: {
            '@/lib/supabase': {
              get isSupabaseIsolated() {
                return isolated;
              },
              supabase: { from: makeQueryBuilder },
            },
          },
        });

        searchCache.resetHotelSearchCatalogCacheForTests();
        const [a, b, c] = await Promise.all([
          searchCache.loadHotelSearchCatalog(),
          searchCache.loadHotelSearchCatalog(),
          searchCache.loadHotelSearchCatalog(),
        ]);
        assert.equal(a.hotels.length, 1);
        assert.equal(b.hotels.length, 1);
        assert.equal(c.hotels.length, 1);
        assert.deepEqual(queriedTables.sort(), ['hotels', 'price_tags', 'tags']);

        searchCache.resetHotelSearchCatalogCacheForTests();
        isolated = true;
        queriedTables.length = 0;
        const isoRes = await searchCache.loadHotelSearchCatalog();
        assert.equal(isoRes.hotels.length, 0);
        assert.equal(queriedTables.length, 0);
      });

      // -------------------------------------------------------------------------
      // GROUP 5: GPS Matching, 2425 Venue CID Branch Integrity & Mobile Browser E2E
      // -------------------------------------------------------------------------
      await check('5.1 All 92 regions (2425 venues) have unique CIDs inside bbox & accurate findNearestPublishedRegion across huge bboxes', async () => {
        const reg = loadTs('lib/gastronomy-v3/registry.ts');
        const { getStaticRegionVenuePayload } = loadTs('lib/food/regionDiscovery.ts');
        const maps = loadTs('lib/food/maps.ts');

        let totalVenues = 0;
        const seenCoreCids = new Set();
        for (const loc of reg.V3_LOCATIONS) {
          const payload = await getStaticRegionVenuePayload(loc.slug);
          assert.ok(payload, `Missing payload for ${loc.slug}`);
          const snap = reg.getPublishedV3Snapshot(loc.slug);
          for (const v of [...payload.venues, ...(payload.nearbyVenues || [])]) {
            totalVenues++;
            const url = maps.resolveSafeVenueMapsUrl(v, 'tr');
            assert.match(url, /^https:\/\/maps\.google\.com\/\?cid=\d+$/, `Expected CID link for ${v.name}`);
          }
          for (const sv of snap.venues) {
            assert.equal(seenCoreCids.has(sv.mapsUri), false, `Duplicate CID across regions: ${sv.mapsUri}`);
            seenCoreCids.add(sv.mapsUri);
            const b = loc.boundary.bbox;
            assert.ok(
              sv.coordinates.lat >= b.minLat - 0.001 &&
                sv.coordinates.lat <= b.maxLat + 0.001 &&
                sv.coordinates.lng >= b.minLng - 0.001 &&
                sv.coordinates.lng <= b.maxLng + 0.001,
              `Venue ${sv.name} in ${loc.slug} falls outside bbox`
            );
          }
        }
        assert.equal(reg.V3_LOCATIONS.length, 92);
        assert.equal(totalVenues, 2425);
        assert.equal(seenCoreCids.size, 2272);

        // Moda center -> inside Moda
        const mModa = maps.findNearestPublishedRegion({ lat: 40.9845, lng: 29.0258 }, reg.V3_LOCATIONS, 6000);
        assert.equal(mModa?.location.slug, 'moda');
        assert.equal(mModa?.insideBoundary, true);

        // Yeni Foca / Foca outer bbox (~11km from center, inside bbox) -> matches foca!
        const mFoca = maps.findNearestPublishedRegion({ lat: 38.742, lng: 26.828 }, reg.V3_LOCATIONS, 6000);
        assert.equal(mFoca?.location.slug, 'foca');
        assert.equal(mFoca?.insideBoundary, true);

        // Distant unrelated city (Konya) & invalid (0,0) -> null
        assert.equal(maps.findNearestPublishedRegion({ lat: 37.8746, lng: 32.4932 }, reg.V3_LOCATIONS, 6000), null);
        assert.equal(maps.findNearestPublishedRegion({ lat: 0, lng: 0 }, reg.V3_LOCATIONS, 6000), null);
      });

      await check('5.2 Mobile Chrome (Android 412px) & Mobile Safari UA (iOS 390px) GPS grant/deny/error, address & CID directions, search URI safety', async () => {
        const reg = loadTs('lib/gastronomy-v3/registry.ts');
        const modaKahveCidSet = new Set(reg.getPublishedV3Snapshot('moda').venues.map((v) => v.mapsUri));

        const browser = await puppeteer.launch({
          headless: true,
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          args: ['--no-sandbox'],
        });

        try {
          // Profile A: Mobile Chrome (412x915)
          {
            const ctx = await browser.createBrowserContext();
            const page = await ctx.newPage();
            await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
            await page.setUserAgent(
              'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'
            );
            const pageErrors = [];
            page.on('pageerror', (e) => pageErrors.push(e.message));
            await page.setRequestInterception(true);
            page.on('request', (req) => {
              const u = new URL(req.url());
              if (u.origin !== origin && !['data:', 'blob:'].includes(u.protocol)) req.abort();
              else req.continue();
            });

            // Override navigator.geolocation with controllable stub
            await page.evaluateOnNewDocument(() => {
              window.__mockGeoBehavior = { mode: 'success', lat: 40.9845, lng: 29.0258 };
              Object.defineProperty(navigator, 'geolocation', {
                configurable: true,
                value: {
                  getCurrentPosition(success, error) {
                    const b = window.__mockGeoBehavior;
                    if (b.mode === 'success') {
                      success({
                        coords: {
                          latitude: b.lat,
                          longitude: b.lng,
                          accuracy: 25,
                          altitude: null,
                          altitudeAccuracy: null,
                          heading: null,
                          speed: null,
                        },
                        timestamp: Date.now(),
                      });
                    } else {
                      error({
                        code: b.code,
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2,
                        TIMEOUT: 3,
                        message: 'Mock geo error',
                      });
                    }
                  },
                },
              });
            });

            const navRes = await page.goto(`${origin}/tr`, { waitUntil: 'networkidle0' });
            assert.match(navRes.headers()['permissions-policy'] || '', /geolocation=\(self\)/);

            // Dismiss cookie banner if rendered
            await page.evaluate(() => {
              const banner = document.querySelector('div.fixed.inset-x-0.bottom-0');
              const btn = banner && Array.from(banner.querySelectorAll('button')).pop();
              if (btn) btn.click();
            });

            // 1) Grant GPS -> Use Current Location -> automatically selects Moda and loads Moda cards
            await page.click('header button');
            await page.waitForSelector('[role="dialog"] input');
            await page.evaluate(() => {
              const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
                (b.textContent || '').includes('Konumumu Kullan')
              );
              btn.click();
            });
            await page.waitForFunction(() => location.search.includes('region=moda'));
            await page.waitForSelector('[data-venue-id]', { timeout: 10000 });

            // Open detail bottom sheet -> verify visible full address & canonical CID Maps CTA
            await page.click('[data-venue-id] h2');
            await page.waitForSelector('[role="dialog"] a[href^="https://maps.google.com/?cid="]');
            const detail = await page.evaluate(() => {
              const dlg = document.querySelector('[role="dialog"]');
              const links = Array.from(dlg.querySelectorAll('a[href]')).map((a) => a.getAttribute('href'));
              const cta = links.find((h) => h && h.startsWith('https://maps.google.com/?cid='));
              const addressText = dlg.querySelector('a[href^="https://maps.google.com/?cid="]')?.textContent || '';
              return { cta, addressText };
            });
            assert.ok(detail.cta && modaKahveCidSet.has(detail.cta), `Detail CTA must use venue CID link, got ${detail.cta}`);
            assert.ok(detail.addressText.trim().length > 8, 'Venue full address must remain visible');

            await page.keyboard.press('Escape');
            await page.waitForSelector('[role="dialog"]', { hidden: true });

            // 2) Permission denied -> friendly message, page unbroken, venue cards & addresses still visible, manual pick works
            await page.evaluate(() => {
              window.__mockGeoBehavior = { mode: 'error', code: 1 };
            });
            await page.click('header button');
            await page.waitForSelector('[role="dialog"] input');
            await page.evaluate(() => {
              const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
                (b.textContent || '').includes('Konumumu Kullan')
              );
              btn.click();
            });
            await page.waitForFunction(() =>
              (document.querySelector('[role="dialog"]')?.textContent || '').includes('Konum izni verilmedi')
            );
            assert.ok((await page.$$('[data-venue-id]')).length > 0, 'Venues must remain visible after GPS denial');
            await page.type('[role="dialog"] input', 'Karaköy');
            await page.evaluate(() => {
              const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
                (b.textContent || '').includes('Karaköy, Beyoğlu')
              );
              btn.click();
            });
            await page.waitForFunction(
              () => location.search.includes('region=karakoy') && document.querySelectorAll('[data-venue-id]').length > 0
            );

            assert.deepEqual(pageErrors, []);
            await ctx.close();
          }

          // Profile B: Mobile Safari UA (iPhone 390x844) + Foca outer-bbox GPS + Search malformed URI test
          {
            const ctx = await browser.createBrowserContext();
            const page = await ctx.newPage();
            await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
            await page.setUserAgent(
              'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
            );
            const pageErrors = [];
            page.on('pageerror', (e) => pageErrors.push(e.message));
            await page.setRequestInterception(true);
            page.on('request', (req) => {
              const u = new URL(req.url());
              if (u.origin !== origin && !['data:', 'blob:'].includes(u.protocol)) req.abort();
              else req.continue();
            });

            await page.evaluateOnNewDocument(() => {
              window.__mockGeoBehavior = { mode: 'error', code: 2 };
              Object.defineProperty(navigator, 'geolocation', {
                configurable: true,
                value: {
                  getCurrentPosition(success, error) {
                    const b = window.__mockGeoBehavior;
                    if (b.mode === 'success') {
                      success({
                        coords: {
                          latitude: b.lat,
                          longitude: b.lng,
                          accuracy: 40,
                          altitude: null,
                          altitudeAccuracy: null,
                          heading: null,
                          speed: null,
                        },
                        timestamp: Date.now(),
                      });
                    } else {
                      error({
                        code: b.code,
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2,
                        TIMEOUT: 3,
                        message: 'Unavailable',
                      });
                    }
                  },
                },
              });
            });

            await page.goto(`${origin}/tr`, { waitUntil: 'networkidle0' });
            await page.evaluate(() => {
              const banner = document.querySelector('div.fixed.inset-x-0.bottom-0');
              const btn = banner && Array.from(banner.querySelectorAll('button')).pop();
              if (btn) btn.click();
            });

            // 1) POSITION_UNAVAILABLE -> clean fallback without horizontal overflow
            await page.click('header button');
            await page.waitForSelector('[role="dialog"] input');
            await page.evaluate(() => {
              const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
                (b.textContent || '').includes('Konumumu Kullan')
              );
              btn.click();
            });
            await page.waitForFunction(() =>
              (document.querySelector('[role="dialog"]')?.textContent || '').includes('Konum bilgisi alınamadı')
            );
            const noOverflow = await page.evaluate(
              () => document.documentElement.scrollWidth <= window.innerWidth + 1
            );
            assert.equal(noOverflow, true, 'Mobile 390px modal must not cause horizontal overflow');

            // 2) Grant Foça outer-boundary point -> boundary check matches foca!
            await page.evaluate(() => {
              window.__mockGeoBehavior = { mode: 'success', lat: 38.742, lng: 26.828 };
              const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
                (b.textContent || '').includes('Konumumu Kullan')
              );
              btn.click();
            });
            await page.waitForFunction(
              () => location.search.includes('region=foca') && document.querySelectorAll('[data-venue-id]').length > 0
            );

            // 3) Malformed percent-encoded query on /tr/search?q=%E0%A4%A must NOT crash UI!
            await page.goto(`${origin}/tr/search?q=%E0%A4%A`, { waitUntil: 'networkidle0' });
            const searchH1 = await page.$eval('h1', (el) => el.textContent || '');
            assert.ok(searchH1.includes('Arama Sonuçları'), 'Malformed % query must render safely');

            assert.deepEqual(pageErrors, []);
            await ctx.close();
          }
        } finally {
          await browser.close();
        }
      });
    } finally {
      nextProc.kill('SIGTERM');
    }

    console.log(`\nALL PAKET 05 API, MIDDLEWARE & MOBILE CHECKS PASSED: ${passed} checks.`);
  } finally {
    process.env = savedEnv;
    if (savedTsconfig !== null) {
      fs.writeFileSync(tsconfigPath, savedTsconfig);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
