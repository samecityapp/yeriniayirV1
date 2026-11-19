// Run after `NEXT_DISABLE_WEBPACK_CACHE=1 npm run build`:
//   node scripts/verify_paket10b_codex_closures.cjs
// Covers Codex Final Release Verdict P1/P2 closures F1-F8 with real before/after checks and clean teardown.
require('./security/network-lock.cjs');

const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { createRequire } = require('node:module');
const loadTs = require('./security/load-ts.cjs');

const ROOT = process.cwd();
const repoRequire = createRequire(path.join(ROOT, 'package.json'));
const TIMEOUT_MS = 240_000;
const watchdog = setTimeout(() => {
  console.error('\nFAIL: verify_paket10b_codex_closures exceeded timeout watchdog.');
  process.exit(1);
}, TIMEOUT_MS);
watchdog.unref();

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

function rawHttpRequest(port, reqPath, hostHeader, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: reqPath,
        method: 'GET',
        headers: {
          Host: hostHeader,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          ...extraHeaders,
        },
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
    req.setTimeout(15000, () => req.destroy(new Error(`Timeout GET ${reqPath}`)));
    req.on('error', reject);
    req.end();
  });
}

async function stopChild(proc) {
  if (!proc || proc.exitCode !== null) return;
  await new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const killTimer = setTimeout(() => {
      try {
        if (proc.exitCode === null) proc.kill('SIGKILL');
      } catch {}
      done();
    }, 1500);
    proc.once('exit', () => {
      clearTimeout(killTimer);
      done();
    });
    try {
      proc.kill('SIGTERM');
    } catch {
      clearTimeout(killTimer);
      done();
    }
  });
}

function extractAttr(tag, attrName) {
  const re = new RegExp(`${attrName}=["']([^"']+)["']`, 'i');
  const m = tag.match(re);
  return m ? m[1] : null;
}

function extractSeoLinks(html) {
  let canonical = null;
  const hreflangs = {};
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of linkTags) {
    const rel = (extractAttr(tag, 'rel') || '').toLowerCase();
    const href = extractAttr(tag, 'href');
    if (!href) continue;
    if (rel === 'canonical') canonical = href;
    if (rel === 'alternate') {
      const hl = extractAttr(tag, 'hreflang');
      if (hl) hreflangs[hl] = href;
    }
  }
  const ldMatches = Array.from(
    html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  ).map((m) => m[1]);
  return { canonical, hreflangs, ldJsonList: ldMatches };
}

(async () => {
  assert.ok(fs.existsSync(path.join(ROOT, '.next/prerender-manifest.json')), '.next build required first');

  const dbHotelSlugUuid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const dbHotelNoSlugUuid = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const mockHotels = [
    {
      id: dbHotelSlugUuid,
      name: { tr: 'Kapadokya Taş Saray', en: 'Cappadocia Stone Palace' },
      slug: 'cappadocia-cave-palace',
      location: { tr: 'Ürgüp, Kapadokya', en: 'Urgup, Cappadocia' },
      rating: 9.4,
      price: 11200,
      currency: 'TRY',
      about: { tr: 'Kapadokya butik taş otel', en: 'Cappadocia boutique cave hotel' },
      description: { tr: 'Kapadokya açıklaması', en: 'Cappadocia description' },
      tags: [],
      amenities: [],
      image_url: '/images/demo-hotels/hotel_indirimli_1.png',
      gallery_images: [],
      faqs: [],
    },
    {
      id: dbHotelNoSlugUuid,
      name: { tr: 'Boğaz Köşkü', en: 'Bosphorus Mansion' },
      slug: null,
      location: { tr: 'Bebek, İstanbul', en: 'Bebek, Istanbul' },
      rating: 9.2,
      price: 14500,
      currency: 'TRY',
      about: { tr: 'Boğaz otel', en: 'Bosphorus hotel' },
      description: { tr: 'İstanbul açıklaması', en: 'Istanbul description' },
      tags: [],
      amenities: [],
      image_url: '/images/demo-hotels/hotel_indirimli_1.png',
      gallery_images: [],
      faqs: [],
    },
  ];

  let upstashHttpStatus = 200;
  let upstashJsonPayload = JSON.stringify({ result: 'off' });

  const mockPort = await getFreePort();
  const mockServer = http.createServer((req, res) => {
    const reqUrl = new URL(req.url || '/', `http://127.0.0.1:${mockPort}`);

    if (reqUrl.pathname.startsWith('/upstash/get/')) {
      res.writeHead(upstashHttpStatus, { 'Content-Type': 'application/json' });
      res.end(upstashJsonPayload);
      return;
    }

    if (reqUrl.pathname === '/rest/v1/hotels') {
      const idFilter = reqUrl.searchParams.get('id');
      const slugFilter = reqUrl.searchParams.get('slug');
      const accept = String(req.headers.accept || '');
      let rows = mockHotels;
      if (idFilter && idFilter.startsWith('eq.')) {
        const needle = idFilter.slice(3);
        rows = mockHotels.filter((h) => h.id === needle);
      } else if (slugFilter && slugFilter.startsWith('eq.')) {
        const needle = slugFilter.slice(3);
        rows = mockHotels.filter((h) => h.slug === needle);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (accept.includes('application/vnd.pgrst.object+json')) {
        res.end(JSON.stringify(rows[0] || null));
      } else {
        res.end(JSON.stringify(rows));
      }
      return;
    }

    if (reqUrl.pathname === '/rest/v1/rpc/ya_read_publication') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          revision: 1,
          scope: 'moda/kahve',
          validUntil: '2099-01-01T00:00:00Z',
          document: {
            schemaVersion: 1,
            dataKind: 'real-research',
            mode: 'integration-preparation',
            productionPublished: false,
            region: {
              id: 'moda',
              slug: 'moda',
              name: 'Moda',
              displayName: 'Moda',
              path: ['istanbul', 'kadikoy', 'moda'],
            },
            categories: [{ slug: 'kahve', id: 'coffee', label: 'Kahve', isMustTry: false }],
            categorySlug: 'kahve',
            venues: [
              {
                id: 'montag',
                name: 'Montag Coffee',
                location: 'Moda',
                categoryId: 'coffee',
                description: null,
                whatToOrder: [],
                menuFrom: [],
                alsoTry: [],
                beforeYouGo: [],
                photo: null,
                ratings: [],
              },
            ],
            rituals: [],
          },
        })
      );
      return;
    }

    if (reqUrl.pathname.startsWith('/rest/v1/')) {
      const accept = String(req.headers.accept || '');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(accept.includes('application/vnd.pgrst.object+json') ? 'null' : '[]');
      return;
    }

    if (reqUrl.pathname.startsWith('/storage/v1/object/public/ya_publications/')) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end('{"error":"not_found"}');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{}');
  });
  await new Promise((r) => mockServer.listen(mockPort, '127.0.0.1', r));

  const tempDistDir = `.next-paket10b-${mockPort}`;
  const tsconfigPath = path.join(ROOT, 'tsconfig.json');
  const savedTsconfig = fs.existsSync(tsconfigPath) ? fs.readFileSync(tsconfigPath, 'utf8') : null;
  const nextPort = await getFreePort();
  const nextEnv = {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_DIST_DIR: tempDistDir,
    NEXT_DISABLE_WEBPACK_CACHE: '1',
    PORT: String(nextPort),
    HOSTNAME: '127.0.0.1',
    APP_ENVIRONMENT: 'test',
    RATE_LIMIT_ENFORCE: '1',
    RATE_LIMIT_COOKIE_SECRET: 'paket10b-live-test-cookie-secret-9876543210',
    NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${mockPort}`,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-anon',
    GASTRONOMY_SUPABASE_URL: `http://127.0.0.1:${mockPort}`,
    GASTRONOMY_SUPABASE_ANON_KEY: 'dummy-anon',
    GASTRONOMY_SUPABASE_REF: 'local',
    GASTRONOMY_CLOUD_ENV: 'local',
    GASTRONOMY_AUTH_MODE: 'supabase',
  };
  delete nextEnv.GASTRONOMY_LOCAL_PREVIEW;
  delete nextEnv.NEXT_PUBLIC_GASTRONOMY_LOCAL_PREVIEW;
  delete nextEnv.VERCEL;
  delete nextEnv.VERCEL_ENV;
  delete nextEnv.NEXT_PUBLIC_VERCEL_ENV;

  let nextProc = null;
  let teardownMs = 0;

  try {
    // Check 1 — F1 Server Actions & jilinrime isolation
    await check('1. F1 Legacy admin /jilinrime uses hardened Server Actions, zero client supabase writes, and forward migration 72/72 intact', async () => {
      const adminDir = path.join(ROOT, 'app/[lang]/(admin)/jilinrime');
      const clientFiles = [];
      function walk(dir) {
        for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, ent.name);
          if (ent.isDirectory()) walk(full);
          else if (ent.name === 'page.tsx' && full !== path.join(adminDir, 'legacyAdminActions.ts')) {
            clientFiles.push(full);
          }
        }
      }
      walk(adminDir);
      assert.ok(clientFiles.length >= 7);
      for (const f of clientFiles) {
        const src = fs.readFileSync(f, 'utf8');
        assert.equal(/supabase\s*\.\s*(from|storage)\s*\(/.test(src), false, `Forbidden direct supabase write/query in ${f}`);
      }

      let dbWrites = 0;
      let accessMode = 'unauth';
      const savedEnv = { ...process.env };
      try {
        delete process.env.TRAFFIC_EMERGENCY_MODE;
        const actions = loadTs('app/[lang]/(admin)/jilinrime/legacyAdminActions.ts', {
          cache: new Map(),
          mocks: {
            'next/cache': { revalidatePath: () => {} },
            'next/headers': {
              headers: async () => new Headers({ 'x-real-ip': '203.0.113.50' }),
              cookies: async () => ({ get: () => ({ value: 'mock-jwt' }) }),
            },
            '@/lib/pilot/emergencyMode': {
              resolveRuntimeEmergencyMode: async () =>
                process.env.TRAFFIC_EMERGENCY_MODE === 'lockdown' ? 'lockdown' : 'off',
            },
            '@/lib/pilot/rateLimit': {
              enforceRateLimit: async () => ({ ok: true, status: 200, headers: {} }),
            },
            '@/lib/admin/offerAdminGuard': {
              requireOfferAdminAccess: async () => {
                if (accessMode === 'unauth') {
                  return { ok: false, status: 401, error: 'Unauthorized' };
                }
                if (accessMode === 'aal1') {
                  return { ok: false, status: 403, error: 'MFA aal2 required' };
                }
                return { ok: true, mode: 'supabase', actorId: 'admin-uuid', aal: 'aal2' };
              },
            },
            '@/lib/cloud/client': {
              cloudClient: () => ({
                from: () => ({
                  insert: () => {
                    dbWrites++;
                    return Promise.resolve({ data: null, error: null });
                  },
                }),
              }),
            },
            '@/lib/supabase-admin': {
              assertSupabaseAdminReady: () => {},
              supabaseAdmin: {
                from: () => ({
                  insert: () => {
                    dbWrites++;
                    return Promise.resolve({ data: null, error: null });
                  },
                }),
              },
            },
          },
        });

        accessMode = 'unauth';
        const unauthReadRes = await actions.listAdminTagsAction();
        assert.equal(unauthReadRes.ok, false);
        assert.equal(unauthReadRes.status, 401);

        const unauthRes = await actions.saveAdminRestaurantAction({
          category_id: 'kahve',
          location: 'Moda, Kadıköy',
          name: 'Test',
          google_rating: 4.5,
          display_order: 1,
        });
        assert.equal(unauthRes.ok, false);
        assert.equal(unauthRes.status, 401);

        accessMode = 'aal1';
        const aal1Res = await actions.deleteAdminHotelAction('11111111-1111-4111-8111-111111111111');
        assert.equal(aal1Res.ok, false);
        assert.equal(aal1Res.status, 403);

        accessMode = 'aal2';
        process.env.TRAFFIC_EMERGENCY_MODE = 'lockdown';
        const lockRes = await actions.deleteAdminHotelAction('11111111-1111-4111-8111-111111111111');
        assert.equal(lockRes.ok, false);
        assert.equal(lockRes.status, 503);
        assert.equal(dbWrites, 0);
      } finally {
        process.env = savedEnv;
      }

      const migFiles = fs.readdirSync(path.join(ROOT, 'supabase/migrations')).filter((f) => f.endsWith('.sql'));
      assert.equal(migFiles.length, 73);
      assert.ok(migFiles.includes('20261119180000_enforce_cloud_mfa_admin_rls.sql'));
      assert.ok(migFiles.includes('20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql'));
    });

    // Check 2 — F2 & F3 Emergency mode fail-safe + corrupt Redis + namespace isolation
    await check('2. F2 & F3 Invalid env/Redis emergency modes fail-safe and preserve active incident state across corruption/unexpected null', async () => {
      const savedEnv = { ...process.env };
      try {
        const em = loadTs('lib/pilot/emergencyMode.ts', { cache: new Map() });
        assert.equal(em.parseEmergencyModeSetting('lockdwon'), 'invalid');
        assert.equal(em.getEmergencyMode({ TRAFFIC_EMERGENCY_MODE: 'lockdwon' }), 'shed');
        assert.equal(em.getEmergencyMode({ TRAFFIC_EMERGENCY_MODE: '123' }), 'shed');
        assert.equal(em.getEmergencyMode({ TRAFFIC_EMERGENCY_MODE: '' }), 'off');
        assert.equal(em.getEmergencyMode({ TRAFFIC_EMERGENCY_MODE: 'off' }), 'off');
        assert.equal(em.getEmergencyMode({ TRAFFIC_EMERGENCY_MODE: 'lockdown' }), 'lockdown');

        const baseTestEnv = {
          UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${mockPort}/upstash`,
          UPSTASH_REDIS_REST_TOKEN: 'dummy-token',
          EMERGENCY_RUNTIME_UPSTASH: '1',
          EMERGENCY_MODE_CACHE_TTL_MS: '60',
          EMERGENCY_OUTAGE_COOLDOWN_MS: '60',
          EMERGENCY_OUTAGE_GRACE_MS: '5000',
        };

        // Start active 'lockdown'
        em.resetEmergencyModeCacheForTests();
        upstashHttpStatus = 200;
        upstashJsonPayload = JSON.stringify({ result: 'lockdown' });
        assert.equal(await em.resolveRuntimeEmergencyMode(baseTestEnv), 'lockdown');

        // Corrupt JSON, missing result, typo 'lockdwon', wrong type, unexpected null must ALL preserve active 'lockdown'
        const corruptPayloads = [
          '{broken-json',
          JSON.stringify({ wrong_key: 'off' }),
          JSON.stringify({ result: 'lockdwon' }),
          JSON.stringify({ result: { nested: true } }),
          JSON.stringify({ result: null }),
        ];
        for (const payload of corruptPayloads) {
          await new Promise((r) => setTimeout(r, 80));
          upstashJsonPayload = payload;
          const preserved = await em.resolveRuntimeEmergencyMode(baseTestEnv);
          assert.equal(preserved, 'lockdown', `Active lockdown dropped on payload: ${payload}`);
        }

        // Only explicit 'off' clears active incident immediately once cooldown elapses
        await new Promise((r) => setTimeout(r, 80));
        upstashJsonPayload = JSON.stringify({ result: 'off' });
        assert.equal(await em.resolveRuntimeEmergencyMode(baseTestEnv), 'off');

        // Without prior active incident, invalid Redis payload ('lockdwon') fail-safes to 'shed' (never 'off')
        em.resetEmergencyModeCacheForTests();
        upstashJsonPayload = JSON.stringify({ result: 'lockdwon' });
        assert.equal(await em.resolveRuntimeEmergencyMode(baseTestEnv), 'shed');

        // Namespace isolation check
        const sharedCheck = em.verifyEmergencyRedisIsolation(
          { UPSTASH_REDIS_REST_URL: 'https://shared-redis.upstash.io', UPSTASH_REDIS_REST_TOKEN: 'tok-a' },
          { UPSTASH_REDIS_REST_URL: 'https://shared-redis.upstash.io', UPSTASH_REDIS_REST_TOKEN: 'tok-a' }
        );
        assert.equal(sharedCheck.isolated, false);

        const namespacedCheck = em.verifyEmergencyRedisIsolation(
          {
            UPSTASH_REDIS_REST_URL: 'https://shared-redis.upstash.io',
            UPSTASH_REDIS_REST_TOKEN: 'tok-a',
            EMERGENCY_MODE_REDIS_NAMESPACE: 'prod',
          },
          {
            UPSTASH_REDIS_REST_URL: 'https://shared-redis.upstash.io',
            UPSTASH_REDIS_REST_TOKEN: 'tok-a',
            EMERGENCY_MODE_REDIS_NAMESPACE: 'staging',
          }
        );
        assert.equal(namespacedCheck.isolated, true);
        assert.equal(em.resolveEmergencyModeRedisKey({ EMERGENCY_MODE_REDIS_NAMESPACE: 'staging' }), 'ya:staging:pilot:emergency_mode');
      } finally {
        process.env = savedEnv;
        upstashJsonPayload = JSON.stringify({ result: 'off' });
      }
    });

    // Check 3 — F4 CGNAT identical-UA real user fairness + forged/cookieless bot cap + multi-instance
    await check('3. F4 CGNAT 25x2+ identical-UA signed cookie fairness vs zero forged/cookieless bot bypass', async () => {
      const savedEnv = { ...process.env };
      try {
        process.env.RATE_LIMIT_ENFORCE = '1';
        process.env.RATE_LIMIT_COOKIE_SECRET = 'multi-instance-fairness-secret-0123456';
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;

        const rl1 = loadTs('lib/pilot/rateLimit.ts', { cache: new Map() });
        rl1.resetMemoryRateLimitersForTests();

        const igUa = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Instagram 315.0.0.19.99';
        const cgnatIp = '198.51.100.77';

        // 25 concurrent real Instagram users sharing identical IP + identical UA + headers
        const userCookies = [];
        for (let i = 0; i < 25; i++) {
          const r1 = await rl1.enforceRateLimit(
            new Headers({
              'x-real-ip': cgnatIp,
              'user-agent': igUa,
              'accept-language': 'tr-TR',
              'sec-ch-ua-mobile': '?1',
            }),
            'visitor_public',
            { scope: 'api' }
          );
          assert.equal(r1.ok, true, `User #${i} initial request must pass`);
          assert.ok(r1.setCookieHeader && r1.setCookieHeader.includes('ya_rl_anon='), `User #${i} must receive signed ya_rl_anon cookie`);
          const cookiePair = r1.setCookieHeader.split(';')[0];
          userCookies.push(cookiePair);
        }

        // Send 2 more requests per user (50 more requests, 75 total behind same CGNAT IP + identical UA)
        for (let round = 0; round < 2; round++) {
          for (let i = 0; i < 25; i++) {
            const rNext = await rl1.enforceRateLimit(
              new Headers({
                'x-real-ip': cgnatIp,
                'user-agent': igUa,
                'accept-language': 'tr-TR',
                'sec-ch-ua-mobile': '?1',
                cookie: userCookies[i],
              }),
              'visitor_public',
              { scope: 'api' }
            );
            assert.equal(rNext.ok, true, `CGNAT cookie-holder user #${i} round ${round} must pass without false 429`);
          }
        }

        // Multi-instance module reload: fresh instance must verify the exact same HMAC cookies
        const rl2 = loadTs('lib/pilot/rateLimit.ts', { cache: new Map() });
        const crossInstanceRes = await rl2.enforceRateLimit(
          new Headers({
            'x-real-ip': cgnatIp,
            'user-agent': igUa,
            cookie: userCookies[0],
          }),
          'visitor_public',
          { scope: 'api' }
        );
        assert.equal(crossInstanceRes.ok, true);
        assert.equal(crossInstanceRes.setCookieHeader, undefined, 'Valid cookie must not be re-issued on second isolate');

        // Cookieless bot with same UA must hit 429 at request 31
        let cookielessBlocked = 0;
        for (let i = 1; i <= 40; i++) {
          const botRes = await rl1.enforceRateLimit(
            new Headers({
              'x-real-ip': '198.51.100.89',
              'user-agent': igUa,
              'accept-language': 'tr-TR',
              'sec-ch-ua-mobile': '?1',
            }),
            'visitor_public',
            { scope: 'api' }
          );
          if (!botRes.ok) {
            assert.equal(botRes.status, 429);
            cookielessBlocked++;
          }
        }
        assert.equal(cookielessBlocked, 10, `Cookieless bot must get 429 on 31..40, blocked=${cookielessBlocked}`);

        // Forged-cookie bot rotating fake cookies must NOT bypass -> hits 429 on 31..40
        let forgedBlocked = 0;
        for (let i = 1; i <= 40; i++) {
          const forgedRes = await rl1.enforceRateLimit(
            new Headers({
              'x-real-ip': '198.51.100.90',
              'user-agent': igUa,
              cookie: `ya_rl_anon=1700000000.${String(i).padStart(32, 'a')}.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`,
            }),
            'visitor_public',
            { scope: 'api' }
          );
          if (!forgedRes.ok) {
            assert.equal(forgedRes.status, 429);
            forgedBlocked++;
          }
        }
        assert.equal(forgedBlocked, 10, `Forged-cookie bot must get 429 on 31..40, blocked=${forgedBlocked}`);
      } finally {
        process.env = savedEnv;
      }
    });

    // Check 4 — F5 Unified analytics route drops cleanly on Upstash outage with zero DB write and redacted logs
    await check('4. F5 /api/track-event drops DB writes on Upstash outage and redacts secrets/URLs/stacks in logs', async () => {
      const savedEnv = { ...process.env };
      const origWarn = console.warn;
      const origError = console.error;
      const capturedLogs = [];
      let dbWrites = 0;
      const leakSecret = 'SECRET_UPSTASH_TOKEN_XYZ_987';
      const leakHost = 'https://secret-upstash-endpoint.example.com';

      console.warn = (...args) => capturedLogs.push(args.map(String).join(' '));
      console.error = (...args) => capturedLogs.push(args.map(String).join(' '));

      try {
        process.env.NODE_ENV = 'production';
        process.env.RATE_LIMIT_ENFORCE = '1';
        process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.example.invalid';
        process.env.UPSTASH_REDIS_REST_TOKEN = leakSecret;
        delete process.env.ANALYTICS_DB_ENABLED;
        delete process.env.NEXT_PUBLIC_DISABLE_ANALYTICS;

        const { POST } = loadTs('app/api/track-event/route.ts', {
          cache: new Map(),
          mocks: {
            '@/lib/pilot/emergencyMode': { resolveRuntimeEmergencyMode: async () => 'off' },
            '@/lib/supabase': {
              isSupabaseIsolated: false,
              supabase: {
                from: () => ({
                  insert: () => {
                    dbWrites++;
                    return Promise.resolve({ error: null });
                  },
                }),
              },
            },
            '@upstash/redis': { Redis: class {} },
            '@upstash/ratelimit': {
              Ratelimit: class {
                static slidingWindow() {
                  return {};
                }
                async limit() {
                  throw new Error(`Connection error ${leakHost}?token=${leakSecret}`);
                }
              },
            },
          },
        });

        const res = await POST(
          new Request('https://www.yeriniayir.com/api/track-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-real-ip': '203.0.113.77',
            },
            body: JSON.stringify({
              event_type: 'website_click',
              hotel_id: dbHotelSlugUuid,
              device_type: 'mobile',
            }),
          })
        );
        assert.equal(res.status, 202);
        const body = await res.json();
        assert.equal(body.recorded, false);
        assert.equal(dbWrites, 0, 'Analytics outage degradation must skip Supabase write');

        const joined = capturedLogs.join('\n');
        assert.equal(joined.includes(leakSecret), false, 'Secret token leaked into analytics logs!');
        assert.equal(joined.includes('secret-upstash-endpoint'), false, 'Redis host leaked into analytics logs!');
      } finally {
        console.warn = origWarn;
        console.error = origError;
        process.env = savedEnv;
      }
    });

    // Check 6 — F6 Legal heading numbering and email fix without fabricated company info
    await check('5. F6 kullanim-sartlari fixes heading numbering & gnkotel email while leaving unverified legal placeholders intact', async () => {
      const termsSrc = fs.readFileSync(
        path.join(ROOT, 'app/[lang]/(main)/(legal)/kullanim-sartlari/page.tsx'),
        'utf8'
      );
      assert.equal(termsSrc.includes('gnkotel.com'), false);
      assert.ok(termsSrc.includes('info@yeriniayir.com'));
      const headingNums = Array.from(termsSrc.matchAll(/<h[23][^>]*>(\d+)\.\s+/g)).map((m) => Number(m[1]));
      assert.deepEqual(headingNums, [1, 2, 3, 4, 5, 6, 7, 8, 9]);

      for (const rel of [
        'app/[lang]/(main)/(legal)/gizlilik-politikasi/page.tsx',
        'app/[lang]/(main)/(legal)/kvkk-aydinlatma-metni/page.tsx',
        'app/[lang]/(main)/(legal)/kullanim-kosullari/page.tsx',
      ]) {
        const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
        assert.ok(
          src.includes('[İlgili Bilgiler Eklenecektir]'),
          `Missing honest legal placeholder in ${rel}`
        );
      }
    });

    // Compile isolated DB-backed build once (cacheless) and boot live production `next start`
    const buildEnv = { ...nextEnv };
    delete buildEnv.NODE_OPTIONS;
    await new Promise((resolve, reject) => {
      const b = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
        cwd: ROOT,
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

    nextProc = await new Promise((resolve, reject) => {
      const p = spawn(
        process.execPath,
        ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(nextPort)],
        { cwd: ROOT, env: nextEnv, stdio: ['ignore', 'pipe', 'pipe'] }
      );
      let logs = '';
      const timer = setTimeout(() => reject(new Error(`Next start timeout:\n${logs}`)), 20000);
      const onData = (c) => {
        logs += String(c);
        if (logs.includes('Ready')) {
          clearTimeout(timer);
          resolve(p);
        }
      };
      p.stdout.on('data', onData);
      p.stderr.on('data', onData);
      p.once('exit', (code) => {
        clearTimeout(timer);
        reject(new Error(`Next start exited early (${code}):\n${logs}`));
      });
    });

    await check('6. F4 Live HTTP SSR /tr has zero Set-Cookie while /api/gastronomy-public issues signed HttpOnly ya_rl_anon', async () => {
      const ssr = await rawHttpRequest(nextPort, '/tr', 'www.yeriniayir.com');
      assert.equal(ssr.status, 200);
      assert.equal(ssr.headers['set-cookie'], undefined, 'SSR/ISR HTML /tr must NEVER set ya_rl_anon cookie');

      const apiRes = await rawHttpRequest(
        nextPort,
        '/api/gastronomy-public?scope=moda/kahve',
        'www.yeriniayir.com',
        { 'x-real-ip': '198.51.100.91' }
      );
      assert.equal(apiRes.status, 200);
      const setCookies = Array.isArray(apiRes.headers['set-cookie'])
        ? apiRes.headers['set-cookie'].join(' | ')
        : String(apiRes.headers['set-cookie'] || '');
      assert.ok(setCookies.includes('ya_rl_anon='), `Expected ya_rl_anon cookie header, got: ${setCookies}`);
      assert.ok(setCookies.includes('HttpOnly') && setCookies.includes('SameSite=Lax'));
    });

    await check('7. F8 Hotels (live HTTP demo/location + mocked DB slug & UUID fallback) sitemap, canonical, hreflang & JSON-LD match 1:1', async () => {
      // 7A: Live HTTP SSR check on compiled DB-backed Next build (DB hotels + demo hotel + location)
      const sitemapRes = await rawHttpRequest(nextPort, '/sitemap.xml', 'www.yeriniayir.com');
      assert.equal(sitemapRes.status, 200);
      assert.equal(sitemapRes.body.includes('/en/otel/'), false, 'Sitemap must NEVER emit /en/otel/');
      assert.equal(sitemapRes.body.includes('worldandhotels.com/otel/'), false, 'Sitemap must NEVER mix TR path on EN host');
      assert.ok(sitemapRes.body.includes('https://www.yeriniayir.com/otel/cappadocia-cave-palace'));
      assert.ok(sitemapRes.body.includes('https://www.worldandhotels.com/hotel/cappadocia-cave-palace'));
      assert.ok(sitemapRes.body.includes(`https://www.yeriniayir.com/otel/${dbHotelNoSlugUuid}`));
      assert.ok(sitemapRes.body.includes(`https://www.worldandhotels.com/hotel/${dbHotelNoSlugUuid}`));

      const trDbHtml = await rawHttpRequest(nextPort, '/otel/cappadocia-cave-palace', 'www.yeriniayir.com');
      assert.equal(trDbHtml.status, 200);
      const trDbMeta = extractSeoLinks(trDbHtml.body);
      assert.equal(trDbMeta.canonical, 'https://www.yeriniayir.com/otel/cappadocia-cave-palace');
      assert.equal(trDbMeta.hreflangs['tr-TR'], 'https://www.yeriniayir.com/otel/cappadocia-cave-palace');
      assert.equal(trDbMeta.hreflangs.en, 'https://www.worldandhotels.com/hotel/cappadocia-cave-palace');

      const enDbHtml = await rawHttpRequest(nextPort, '/hotel/cappadocia-cave-palace', 'www.worldandhotels.com');
      assert.equal(enDbHtml.status, 200);
      const enDbMeta = extractSeoLinks(enDbHtml.body);
      assert.equal(enDbMeta.canonical, 'https://www.worldandhotels.com/hotel/cappadocia-cave-palace');
      assert.equal(enDbMeta.hreflangs['tr-TR'], 'https://www.yeriniayir.com/otel/cappadocia-cave-palace');
      assert.equal(enDbMeta.hreflangs.en, 'https://www.worldandhotels.com/hotel/cappadocia-cave-palace');
      assert.equal(
        enDbMeta.ldJsonList.some((raw) => raw.includes('/en/otel/')),
        false,
        'EN DB hotel JSON-LD must never contain /en/otel/'
      );
      assert.ok(
        enDbMeta.ldJsonList.some((raw) => raw.includes('"https://www.worldandhotels.com/hotel/cappadocia-cave-palace"')),
        'EN DB hotel schema JSON-LD must carry EN canonical URL'
      );

      const enUuidHtml = await rawHttpRequest(
        nextPort,
        `/hotel/${dbHotelNoSlugUuid}`,
        'www.worldandhotels.com'
      );
      assert.equal(enUuidHtml.status, 200);
      const enUuidMeta = extractSeoLinks(enUuidHtml.body);
      assert.equal(enUuidMeta.canonical, `https://www.worldandhotels.com/hotel/${dbHotelNoSlugUuid}`);
      assert.equal(enUuidMeta.hreflangs['tr-TR'], `https://www.yeriniayir.com/otel/${dbHotelNoSlugUuid}`);
      assert.equal(enUuidMeta.hreflangs.en, `https://www.worldandhotels.com/hotel/${dbHotelNoSlugUuid}`);

      const trDemoHtml = await rawHttpRequest(nextPort, '/otel/demo-indirimli-1', 'www.yeriniayir.com');
      assert.equal(trDemoHtml.status, 200);
      const trDemoMeta = extractSeoLinks(trDemoHtml.body);
      assert.equal(trDemoMeta.canonical, 'https://www.yeriniayir.com/otel/demo-indirimli-1');
      assert.equal(trDemoMeta.hreflangs['tr-TR'], 'https://www.yeriniayir.com/otel/demo-indirimli-1');
      assert.equal(trDemoMeta.hreflangs.en, 'https://www.worldandhotels.com/hotel/demo-indirimli-1');
      assert.equal(trDemoMeta.hreflangs['x-default'], 'https://www.yeriniayir.com/otel/demo-indirimli-1');

      const enDemoHtml = await rawHttpRequest(nextPort, '/hotel/demo-indirimli-1', 'www.worldandhotels.com');
      assert.equal(enDemoHtml.status, 200);
      const enDemoMeta = extractSeoLinks(enDemoHtml.body);
      assert.equal(enDemoMeta.canonical, 'https://www.worldandhotels.com/hotel/demo-indirimli-1');
      assert.equal(enDemoMeta.ldJsonList.some((raw) => raw.includes('/en/otel/')), false);
      assert.equal(enDemoMeta.hreflangs['tr-TR'], 'https://www.yeriniayir.com/otel/demo-indirimli-1');
      assert.equal(enDemoMeta.hreflangs.en, 'https://www.worldandhotels.com/hotel/demo-indirimli-1');
      assert.ok(
        enDemoMeta.ldJsonList.some((raw) => raw.includes('"https://www.worldandhotels.com/hotel/demo-indirimli-1"')),
        'EN hotel schema JSON-LD must carry EN canonical URL'
      );

      // Location route on EN host
      const enLocHtml = await rawHttpRequest(nextPort, '/hotel/fethiye', 'www.worldandhotels.com');
      assert.equal(enLocHtml.status, 200);
      const enLocMeta = extractSeoLinks(enLocHtml.body);
      assert.equal(enLocMeta.canonical, 'https://www.worldandhotels.com/hotel/fethiye');
      assert.equal(enLocMeta.hreflangs['tr-TR'], 'https://www.yeriniayir.com/otel/fethiye');

      // 7B: Mocked active Supabase DB hotels (slug + UUID-only fallback) via real db.ts, sitemap.ts, page.tsx, schema-generator.ts
      const { createClient } = repoRequire('@supabase/supabase-js');
      const liveMockSupabase = createClient(`http://127.0.0.1:${mockPort}`, 'dummy-anon-key-local');
      const dbMod = loadTs('lib/db.ts', {
        cache: new Map(),
        mocks: {
          '@/lib/supabase': { isSupabaseIsolated: false, supabase: liveMockSupabase },
          './supabase': { isSupabaseIsolated: false, supabase: liveMockSupabase },
        },
      });
      const fetchedBySlug = await dbMod.db.hotels.getById('cappadocia-cave-palace');
      assert.ok(fetchedBySlug && fetchedBySlug.id === dbHotelSlugUuid);
      const fetchedByUuid = await dbMod.db.hotels.getById(dbHotelNoSlugUuid);
      assert.ok(fetchedByUuid && fetchedByUuid.id === dbHotelNoSlugUuid);

      const schemaMod = loadTs('lib/schema-generator.ts', { cache: new Map() });
      const sitemapMod = loadTs('app/sitemap.ts', {
        cache: new Map(),
        mocks: {
          '@/lib/db': { db: dbMod.db },
          '@/lib/supabase': { isSupabaseIsolated: false },
        },
      });
      const dbSitemap = await sitemapMod.default();
      const trSlugEntry = dbSitemap.find((u) => u.url === 'https://www.yeriniayir.com/otel/cappadocia-cave-palace');
      const enSlugEntry = dbSitemap.find((u) => u.url === 'https://www.worldandhotels.com/hotel/cappadocia-cave-palace');
      const trUuidEntry = dbSitemap.find((u) => u.url === `https://www.yeriniayir.com/otel/${dbHotelNoSlugUuid}`);
      const enUuidEntry = dbSitemap.find((u) => u.url === `https://www.worldandhotels.com/hotel/${dbHotelNoSlugUuid}`);
      assert.ok(trSlugEntry && enSlugEntry && trUuidEntry && enUuidEntry, 'DB hotels (slug + UUID fallback) missing in sitemap');
      assert.equal(enSlugEntry.alternates.languages.en, 'https://www.worldandhotels.com/hotel/cappadocia-cave-palace');
      assert.equal(enSlugEntry.alternates.languages['tr-TR'], 'https://www.yeriniayir.com/otel/cappadocia-cave-palace');
      assert.equal(enSlugEntry.alternates.languages['x-default'], 'https://www.yeriniayir.com/otel/cappadocia-cave-palace');
      assert.equal(dbSitemap.some((u) => u.url.includes('/en/otel/')), false);

      const hotelPageMod = loadTs('app/[lang]/(main)/otel/[id]/page.tsx', {
        cache: new Map(),
        mocks: {
          '@/lib/db': { db: dbMod.db },
          '@/components/ImageGallery': { ImageGallery: () => null },
          '@/components/BackButton': { BackButton: () => null },
          '@/components/RelatedArticles': { RelatedArticles: () => null },
          '@/components/MobileHotelInfo': { MobileHotelInfo: () => null },
          '@/components/hotel/HotelFeatures': { HotelFeatures: () => null },
          '@/components/hotel/HotelDescription': { HotelDescription: () => null },
          '@/components/hotel/NearbyGuide': { NearbyGuide: () => null },
          '@/components/hotel/BreakfastSection': { BreakfastSection: () => null },
          '@/components/hotel/HotelFAQ': { HotelFAQ: () => null },
          '@/components/hotel/ScoreCard/PremiumClassic': () => null,
          '@/components/seo/JsonLd': { JsonLd: () => null },
          '@/components/hotel/LocationCard': () => null,
          '@/components/hotel/LocationListingView': { LocationListingView: () => null },
          '@/lib/dictionary': { getDictionary: async () => ({ navigation: { home: 'Home', hotels: 'Hotels' } }) },
          next: {},
          'next/dynamic': () => () => null,
          'next/image': () => null,
          'next/navigation': { notFound: () => { throw new Error('NOT_FOUND'); } },
          'lucide-react': { MapPin: () => null },
        },
      });
      const enSlugMeta = await hotelPageMod.generateMetadata({
        params: Promise.resolve({ id: 'cappadocia-cave-palace', lang: 'en' }),
      });
      assert.equal(enSlugMeta.alternates.canonical, 'https://www.worldandhotels.com/hotel/cappadocia-cave-palace');
      assert.equal(enSlugMeta.alternates.languages['tr-TR'], 'https://www.yeriniayir.com/otel/cappadocia-cave-palace');
      assert.equal(enSlugMeta.alternates.languages.en, 'https://www.worldandhotels.com/hotel/cappadocia-cave-palace');

      const uuidEnMetaObj = await hotelPageMod.generateMetadata({
        params: Promise.resolve({ id: dbHotelNoSlugUuid, lang: 'en' }),
      });
      assert.equal(uuidEnMetaObj.alternates.canonical, `https://www.worldandhotels.com/hotel/${dbHotelNoSlugUuid}`);

      const enSchema = schemaMod.generateHotelSchema(fetchedBySlug, 'en');
      assert.equal(enSchema.url, 'https://www.worldandhotels.com/hotel/cappadocia-cave-palace');
      assert.equal(enSchema['@id'], 'https://www.worldandhotels.com/hotel/cappadocia-cave-palace');
    });
  } finally {
    const t0 = performance.now();
    await stopChild(nextProc);
    mockServer.closeAllConnections?.();
    await new Promise((r) => mockServer.close(r));
    const globalDispatcher = globalThis[Symbol.for('undici.globalDispatcher.1')];
    if (globalDispatcher && typeof globalDispatcher.close === 'function') {
      await globalDispatcher.close().catch(() => {});
    }
    fs.rmSync(path.join(ROOT, tempDistDir), { recursive: true, force: true });
    fs.rmSync(path.join(ROOT, '.next/cache'), { recursive: true, force: true });
    if (savedTsconfig !== null) {
      fs.writeFileSync(tsconfigPath, savedTsconfig);
    }
    teardownMs = Math.round(performance.now() - t0);
  }

  console.log(`\nALL PAKET 10B CODEX CLOSURE CHECKS PASSED: ${passed}/7 checks (clean teardown in ${teardownMs}ms).`);
})().catch((err) => {
  console.error('\nFAIL Paket 10B:', err);
  process.exit(1);
});
