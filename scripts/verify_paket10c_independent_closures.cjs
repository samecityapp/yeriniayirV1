// Run after `npx tsc --noEmit && NEXT_DISABLE_WEBPACK_CACHE=1 npm run build`:
//   node scripts/verify_paket10c_independent_closures.cjs
// Independently verifies Paket 10C closures for ChatGPT findings B1-B6 using real routes/builds/isolation checks.
require('./security/network-lock.cjs');

const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const loadTs = require('./security/load-ts.cjs');

const ROOT = process.cwd();
const TIMEOUT_MS = 240_000;
const watchdog = setTimeout(() => {
  console.error('\nFAIL: verify_paket10c_independent_closures exceeded timeout watchdog.');
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

function rawHttpRequest(port, reqPath, hostHeader) {
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

(async () => {
  try {
    // -------------------------------------------------------------------------
    // B1: Migration storage scope check (non-restaurant buckets never dropped or blocked)
    // -------------------------------------------------------------------------
    await check('1. B1 SQL migrations scope storage.objects drops & restrictive guards strictly to restaurant-images', async () => {
      const mig18 = fs.readFileSync(
        path.join(ROOT, 'supabase/migrations/20261119180000_enforce_cloud_mfa_admin_rls.sql'),
        'utf8'
      );
      assert.match(mig18, /restaurant-images/);
      assert.match(mig18, /ILIKE '%restaurant-images%'/);
      assert.match(mig18, /bucket_id <> 'restaurant-images' OR public\.is_admin_user\(\)/);

      const mig21 = fs.readFileSync(
        path.join(
          ROOT,
          'supabase/migrations/20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql'
        ),
        'utf8'
      );
      assert.match(mig21, /bucket_id <> 'restaurant-images' OR public\.is_admin_user\(\)/);
      assert.match(mig21, /REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public\.analytics_events FROM PUBLIC, anon, authenticated/);
      assert.match(mig21, /REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public\.hotel_clicks FROM PUBLIC, anon, authenticated/);
      assert.match(mig21, /CREATE OR REPLACE FUNCTION public\.ya_admin_save_restaurant/);
      assert.match(mig21, /CREATE OR REPLACE FUNCTION public\.ya_admin_save_group/);
    });

    // -------------------------------------------------------------------------
    // B3 + B2: Upstash missing/malformed stops analytics DB writes (never 200 memory-fallback)
    //          + server analytics/go routes use service_role and fail-closed on cloud without key
    // -------------------------------------------------------------------------
    await check('2. B3 /api/track-event skips DB writes (202 recorded:false) when Upstash missing/malformed or disabled in prod/staging', async () => {
      const savedEnv = { ...process.env };
      try {
        const scenarios = [
          {
            label: 'missing-upstash-prod',
            env: {
              NODE_ENV: 'production',
              APP_ENVIRONMENT: 'production',
              VERCEL: '1',
              VERCEL_ENV: 'production',
              RATE_LIMIT_ENFORCE: '1',
              NEXT_PUBLIC_SUPABASE_URL: 'https://jerkkxwgddujigsbeqwo.supabase.co',
              SUPABASE_PRODUCTION_AUTHORIZED: '1',
            },
            expectedRlPolicy: 'memory-fallback',
          },
          {
            label: 'malformed-upstash-prod',
            env: {
              NODE_ENV: 'production',
              APP_ENVIRONMENT: 'production',
              VERCEL: '1',
              VERCEL_ENV: 'production',
              RATE_LIMIT_ENFORCE: '1',
              UPSTASH_REDIS_REST_URL: 'http://bad-upstash.example.com',
              UPSTASH_REDIS_REST_TOKEN: 'tok',
              NEXT_PUBLIC_SUPABASE_URL: 'https://jerkkxwgddujigsbeqwo.supabase.co',
              SUPABASE_PRODUCTION_AUTHORIZED: '1',
            },
            expectedRlPolicy: 'memory-fallback',
          },
          {
            label: 'disabled-ratelimit-prod',
            env: {
              NODE_ENV: 'production',
              APP_ENVIRONMENT: 'production',
              VERCEL: '1',
              VERCEL_ENV: 'production',
              RATE_LIMIT_ENFORCE: '0',
              NEXT_PUBLIC_SUPABASE_URL: 'https://jerkkxwgddujigsbeqwo.supabase.co',
              SUPABASE_PRODUCTION_AUTHORIZED: '1',
            },
            expectedRlPolicy: 'memory-fallback',
          },
          {
            label: 'disabled-ratelimit-nonprod',
            env: {
              NODE_ENV: 'test',
              APP_ENVIRONMENT: 'test',
              RATE_LIMIT_ENFORCE: '0',
            },
            expectedRlPolicy: 'disabled',
          },
        ];

        for (const sc of scenarios) {
          process.env = { ...savedEnv };
          delete process.env.VERCEL;
          delete process.env.VERCEL_ENV;
          delete process.env.UPSTASH_REDIS_REST_URL;
          delete process.env.UPSTASH_REDIS_REST_TOKEN;
          delete process.env.RATE_LIMIT_ENFORCE;
          delete process.env.ANALYTICS_DB_ENABLED;
          delete process.env.NEXT_PUBLIC_DISABLE_ANALYTICS;
          Object.assign(process.env, sc.env);

          let anonWrites = 0;
          let adminWrites = 0;

          const rlMod = loadTs('lib/pilot/rateLimit.ts', { cache: new Map() });
          const rlCheck = await rlMod.enforceRateLimit(
            new Headers({ 'x-real-ip': '203.0.113.42' }),
            'visitor_analytics',
            { scope: 'api' }
          );
          assert.equal(rlCheck.policy, sc.expectedRlPolicy, `Expected ${sc.expectedRlPolicy} for ${sc.label}`);

          const { POST } = loadTs('app/api/track-event/route.ts', {
            cache: new Map(),
            mocks: {
              '@/lib/pilot/emergencyMode': { resolveRuntimeEmergencyMode: async () => 'off' },
              '@/lib/supabase': {
                isSupabaseIsolated: false,
                supabase: {
                  from: () => ({
                    insert: async () => {
                      anonWrites++;
                      return { error: null };
                    },
                  }),
                },
              },
              '@/lib/supabase-admin': {
                hasServiceRoleKey: true,
                supabaseAdmin: {
                  from: () => ({
                    insert: async () => {
                      adminWrites++;
                      return { error: null };
                    },
                  }),
                },
              },
            },
          });

          const res = await POST(
            new Request('https://www.yeriniayir.com/api/track-event', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-real-ip': '203.0.113.43',
              },
              body: JSON.stringify({
                event_type: 'website_click',
                hotel_id: '11111111-1111-4111-8111-111111111111',
                device_type: 'mobile',
              }),
            })
          );
          assert.equal(res.status, 202, `${sc.label} must return 202, not 200`);
          const body = await res.json();
          assert.equal(body.recorded, false, `${sc.label} must return recorded: false`);
          assert.equal(adminWrites, 0, `${sc.label} must execute 0 supabaseAdmin writes`);
          assert.equal(anonWrites, 0, `${sc.label} must execute 0 supabase anon writes`);
        }
      } finally {
        process.env = savedEnv;
      }
    });

    await check('3. B2 /api/track-event & /api/go write exclusively via supabaseAdmin, never fall back to anon in cloud, and preserve /api/go redirect', async () => {
      const savedEnv = { ...process.env };
      try {
        process.env.NODE_ENV = 'production';
        process.env.APP_ENVIRONMENT = 'production';
        process.env.VERCEL = '1';
        process.env.VERCEL_ENV = 'production';
        process.env.RATE_LIMIT_ENFORCE = '1';
        process.env.UPSTASH_REDIS_REST_URL = 'https://prod-rl.upstash.io';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-upstash-token';
        delete process.env.ANALYTICS_DB_ENABLED;
        delete process.env.NEXT_PUBLIC_DISABLE_ANALYTICS;

        const sharedMocks = (serviceReady, counters) => ({
          '@/lib/pilot/emergencyMode': { resolveRuntimeEmergencyMode: async () => 'off' },
          '@upstash/redis': { Redis: class {} },
          '@upstash/ratelimit': {
            Ratelimit: class {
              static slidingWindow() {
                return {};
              }
              async limit() {
                return { success: true, limit: 20, remaining: 19, reset: 9999999999 };
              }
            },
          },
          '@/lib/supabase': {
            isSupabaseIsolated: false,
            supabase: {
              from: (table) => {
                if (table === 'hotels') {
                  return {
                    select: () => ({
                      eq: () => ({
                        maybeSingle: async () => ({
                          data: { website_url: 'https://hotel.example.com/reserve' },
                          error: null,
                        }),
                      }),
                    }),
                  };
                }
                return {
                  insert: async () => {
                    counters.anon++;
                    return { error: null };
                  },
                };
              },
            },
          },
          '@/lib/supabase-admin': {
            hasServiceRoleKey: serviceReady,
            supabaseAdmin: {
              from: () => ({
                insert: async () => {
                  counters.admin++;
                  return { error: null };
                },
              }),
            },
          },
        });

        // 3A. track-event with service_role writes via supabaseAdmin (0 anon writes)
        const trackCountersA = { anon: 0, admin: 0 };
        const trackWithAdmin = loadTs('app/api/track-event/route.ts', {
          cache: new Map(),
          mocks: sharedMocks(true, trackCountersA),
        });
        const trackOkRes = await trackWithAdmin.POST(
          new Request('https://www.yeriniayir.com/api/track-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-real-ip': '203.0.113.51' },
            body: JSON.stringify({
              event_type: 'website_click',
              hotel_id: '11111111-1111-4111-8111-111111111111',
              device_type: 'desktop',
            }),
          })
        );
        assert.equal(trackOkRes.status, 200);
        assert.equal((await trackOkRes.json()).recorded, true);
        assert.equal(trackCountersA.admin, 1);
        assert.equal(trackCountersA.anon, 0);

        // 3B. track-event in cloud without service_role does NOT fall back to anon client -> 202
        const trackCountersB = { anon: 0, admin: 0 };
        const trackNoAdmin = loadTs('app/api/track-event/route.ts', {
          cache: new Map(),
          mocks: sharedMocks(false, trackCountersB),
        });
        const trackDropRes = await trackNoAdmin.POST(
          new Request('https://www.yeriniayir.com/api/track-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-real-ip': '203.0.113.52' },
            body: JSON.stringify({
              event_type: 'website_click',
              hotel_id: '11111111-1111-4111-8111-111111111111',
              device_type: 'desktop',
            }),
          })
        );
        assert.equal(trackDropRes.status, 202);
        assert.equal((await trackDropRes.json()).recorded, false);
        assert.equal(trackCountersB.anon, 0);

        // 3C. /api/go with service_role records via supabaseAdmin; without service_role in cloud still redirects cleanly
        const { NextRequest } = require('next/server');
        const goCountersA = { anon: 0, admin: 0 };
        const goWithAdmin = loadTs('app/api/go/route.ts', {
          cache: new Map(),
          mocks: sharedMocks(true, goCountersA),
        });
        const goResA = await goWithAdmin.GET(
          new NextRequest('https://www.yeriniayir.com/api/go?hotelId=11111111-1111-4111-8111-111111111111', {
            headers: { 'x-real-ip': '203.0.113.53' },
          })
        );
        assert.equal(goResA.status, 307);
        assert.equal(goResA.headers.get('location'), 'https://hotel.example.com/reserve');
        assert.equal(goResA.headers.get('x-hotel-click-tracked'), 'true');
        assert.equal(goCountersA.admin, 1);
        assert.equal(goCountersA.anon, 0);

        const goCountersB = { anon: 0, admin: 0 };
        const goNoAdmin = loadTs('app/api/go/route.ts', {
          cache: new Map(),
          mocks: sharedMocks(false, goCountersB),
        });
        const goResB = await goNoAdmin.GET(
          new NextRequest('https://www.yeriniayir.com/api/go?hotelId=11111111-1111-4111-8111-111111111111', {
            headers: { 'x-real-ip': '203.0.113.54' },
          })
        );
        assert.equal(goResB.status, 307);
        assert.equal(goResB.headers.get('location'), 'https://hotel.example.com/reserve');
        assert.equal(goResB.headers.get('x-hotel-click-tracked'), 'false');
        assert.equal(goCountersB.anon, 0);
        assert.equal(goCountersB.admin, 0);

        // 3D. ReportGenerator no longer queries supabase directly on client
        const reportSrc = fs.readFileSync(
          path.join(ROOT, 'components/admin/ReportGenerator.tsx'),
          'utf8'
        );
        assert.equal(/supabase\s*\.\s*from\s*\(/.test(reportSrc), false);
        assert.match(reportSrc, /getAdminHotelAnalyticsSummaryAction/);
      } finally {
        process.env = savedEnv;
      }
    });

    // -------------------------------------------------------------------------
    // B5: Invalid Redis namespace fails closed & never falls back to shared key
    // -------------------------------------------------------------------------
    await check('4. B5 Invalid Redis namespaces reject fail-closed in emergencyMode, rateLimit & staging preflight', async () => {
      const savedEnv = { ...process.env };
      try {
        const em = loadTs('lib/pilot/emergencyMode.ts', { cache: new Map() });
        for (const badNs of ['prod!', ' prod ', '   ', 'staging/1']) {
          assert.equal(em.validateEmergencyRedisNamespace({ EMERGENCY_MODE_REDIS_NAMESPACE: badNs }).valid, false);
          assert.throws(() => em.resolveEmergencyModeRedisKey({ EMERGENCY_MODE_REDIS_NAMESPACE: badNs }));
        }
        assert.equal(em.resolveEmergencyModeRedisKey({ EMERGENCY_MODE_REDIS_NAMESPACE: 'staging' }), 'ya:staging:pilot:emergency_mode');
        assert.equal(em.resolveEmergencyModeRedisKey({}), 'ya:pilot:emergency_mode');

        const isoInvalid = em.verifyEmergencyRedisIsolation(
          {
            UPSTASH_REDIS_REST_URL: 'https://shared.upstash.io',
            UPSTASH_REDIS_REST_TOKEN: 'tok',
            EMERGENCY_MODE_REDIS_NAMESPACE: 'prod!',
          },
          {
            UPSTASH_REDIS_REST_URL: 'https://shared.upstash.io',
            UPSTASH_REDIS_REST_TOKEN: 'tok',
            EMERGENCY_MODE_REDIS_NAMESPACE: 'staging',
          }
        );
        assert.equal(isoInvalid.isolated, false);
        assert.equal(isoInvalid.reason, 'invalid-redis-namespace');

        em.resetEmergencyModeCacheForTests();
        const modeWithBadNs = await em.resolveRuntimeEmergencyMode({
          NODE_ENV: 'production',
          APP_ENVIRONMENT: 'production',
          UPSTASH_REDIS_REST_URL: 'https://prod-emergency.upstash.io',
          UPSTASH_REDIS_REST_TOKEN: 'tok',
          EMERGENCY_MODE_REDIS_NAMESPACE: 'prod!',
        });
        assert.equal(modeWithBadNs, 'shed');

        process.env.NODE_ENV = 'production';
        process.env.APP_ENVIRONMENT = 'production';
        process.env.VERCEL = '1';
        process.env.VERCEL_ENV = 'production';
        process.env.RATE_LIMIT_ENFORCE = '1';
        process.env.UPSTASH_REDIS_REST_URL = 'https://prod-rl.upstash.io';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'tok';
        process.env.RATE_LIMIT_REDIS_NAMESPACE = 'prod!';

        const rlMod = loadTs('lib/pilot/rateLimit.ts', { cache: new Map() });
        assert.equal(rlMod.validateRateLimitRedisNamespace(process.env).valid, false);
        const costlyRes = await rlMod.enforceRateLimit(
          new Headers({ 'x-real-ip': '203.0.113.60' }),
          'costly_admin',
          { scope: 'action' }
        );
        assert.equal(costlyRes.status, 503);
        assert.equal(costlyRes.policy, 'outage-blocked');
      } finally {
        process.env = savedEnv;
      }

      const preflight = spawnSync(process.execPath, ['scripts/verify_staging_preflight.cjs'], {
        cwd: ROOT,
        encoding: 'utf8',
      });
      assert.equal(preflight.status, 0, preflight.stderr || preflight.stdout);
    });

    // -------------------------------------------------------------------------
    // B6: legacyAdminActions uses transactional RPCs and aborts cleanly on errors
    // -------------------------------------------------------------------------
    await check('5. B6 legacyAdminActions invokes atomic RPCs for restaurant/group saves and skips revalidation on rollback errors', async () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'app/[lang]/(admin)/jilinrime/legacyAdminActions.ts'),
        'utf8'
      );
      assert.equal(/\.from\('restaurant_notes'\)\s*\.delete/.test(src), false);
      assert.equal(/\.from\('group_hotels'\)\s*\.delete/.test(src), false);
      assert.match(src, /rpc\('ya_admin_save_restaurant'/);
      assert.match(src, /rpc\('ya_admin_save_group'/);

      let revalidations = 0;
      const rpcCalls = [];
      let rpcBehavior = 'ok';

      const savedEnv = { ...process.env };
      try {
        delete process.env.TRAFFIC_EMERGENCY_MODE;
        const actions = loadTs('app/[lang]/(admin)/jilinrime/legacyAdminActions.ts', {
          cache: new Map(),
          mocks: {
            'next/cache': { revalidatePath: () => revalidations++ },
            'next/headers': {
              headers: async () => new Headers({ 'x-real-ip': '203.0.113.70' }),
              cookies: async () => ({ get: () => ({ value: 'mock-jwt' }) }),
            },
            '@/lib/pilot/emergencyMode': { resolveRuntimeEmergencyMode: async () => 'off' },
            '@/lib/pilot/rateLimit': {
              enforceRateLimit: async () => ({ ok: true, status: 200, headers: {} }),
            },
            '@/lib/admin/offerAdminGuard': {
              requireOfferAdminAccess: async () => ({
                ok: true,
                capability: { mode: 'cloud_mfa', actorId: 'admin-uuid', aal: 'aal2' },
              }),
            },
            '@/lib/cloud/client': {
              cloudClient: () => ({
                rpc: async (fnName, params) => {
                  rpcCalls.push({ fnName, params });
                  if (rpcBehavior === 'forbidden') return { data: null, error: { code: '42501', message: 'unauthorized' } };
                  if (rpcBehavior === 'fail') return { data: null, error: { code: '22023', message: 'rollback' } };
                  return { data: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', error: null };
                },
              }),
            },
            '@/lib/supabase-admin': {
              assertSupabaseAdminReady: () => {},
              supabaseAdmin: {},
            },
          },
        });

        const okRest = await actions.saveAdminRestaurantAction({
          category_id: '11111111-1111-4111-8111-111111111111',
          location: 'Moda, Kadıköy',
          name: 'Atomik Kafe',
          notes: [{ emoji: '☕', text: 'Filtre' }],
        });
        assert.equal(okRest.ok, true);
        assert.equal(rpcCalls[0].fnName, 'ya_admin_save_restaurant');
        assert.ok(revalidations > 0);

        const prevRev = revalidations;
        rpcBehavior = 'fail';
        const failGroup = await actions.saveAdminGroupAction({
          id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
          title: 'Test Grup',
          domains: ['yeriniayir.com'],
          hotelIds: ['11111111-1111-4111-8111-111111111111'],
        });
        assert.equal(failGroup.ok, false);
        assert.equal(failGroup.status, 500);
        assert.equal(revalidations, prevRev, 'Failed atomic RPC must never trigger revalidatePath');

        rpcBehavior = 'forbidden';
        const forbiddenRest = await actions.saveAdminRestaurantAction({
          category_id: '11111111-1111-4111-8111-111111111111',
          location: 'Moda, Kadıköy',
          name: 'Yetkisiz Kafe',
          notes: [],
        });
        assert.equal(forbiddenRest.ok, false);
        assert.equal(forbiddenRest.status, 403);
      } finally {
        process.env = savedEnv;
      }
    });

    // -------------------------------------------------------------------------
    // B4: Unit schema-generator check + live Next SSR hotel pages with empty vs verified FAQs
    // -------------------------------------------------------------------------
    await check('6. B4 generateHotelSchema omits fabricated aggregateRating/reviewCount:1 & generateFAQSchema rejects empty FAQs', async () => {
      const sg = loadTs('lib/schema-generator.ts', { cache: new Map() });
      const sWithoutCount = sg.generateHotelSchema(
        {
          id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          slug: 'stone-hotel',
          name: { tr: 'Taş Otel', en: 'Stone Hotel' },
          location: { tr: 'Ürgüp', en: 'Urgup' },
          gnkScore: 9.3,
          price: 8000,
          description: { tr: 'Test', en: 'Test' },
        },
        'tr'
      );
      assert.equal(sWithoutCount.aggregateRating, undefined);
      assert.equal(JSON.stringify(sWithoutCount).includes('reviewCount'), false);

      const sWithVerifiedCount = sg.generateHotelSchema(
        {
          id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          slug: 'stone-hotel',
          name: { tr: 'Taş Otel', en: 'Stone Hotel' },
          location: { tr: 'Ürgüp', en: 'Urgup' },
          gnkScore: 9.3,
          reviewCount: 42,
          price: 8000,
          description: { tr: 'Test', en: 'Test' },
        },
        'tr'
      );
      assert.equal(sWithVerifiedCount.aggregateRating?.reviewCount, '42');
      assert.equal(sg.generateFAQSchema([]), null);
    });

    const emptyFaqId = '10c10c10-1111-4111-8111-111111111111';
    const verifiedFaqId = '10c10c10-2222-4222-8222-222222222222';
    const mockHotels = [
      {
        id: emptyFaqId,
        name: { tr: 'Doğrulanmış Butik Otel', en: 'Verified Boutique Hotel' },
        slug: 'empty-faq-hotel',
        location: { tr: 'Alaçatı, Çeşme', en: 'Alacati, Cesme' },
        rating: 9.2,
        price: 9500,
        currency: 'TRY',
        about: { tr: 'Sadece taş mimari açıklama.', en: 'Stone architecture editorial note only.' },
        description: { tr: 'Kısa otel özeti.', en: 'Short hotel summary.' },
        tags: [],
        amenities: ['Havuz'],
        image_url: '/images/demo-hotels/hotel_indirimli_1.png',
        gallery_images: [],
        faqs: [],
      },
      {
        id: verifiedFaqId,
        name: { tr: 'Özel SSS Oteli', en: 'Custom FAQ Hotel' },
        slug: 'verified-faq-hotel',
        location: { tr: 'Kaş, Antalya', en: 'Kas, Antalya' },
        rating: 8.9,
        price: 7800,
        currency: 'TRY',
        about: { tr: 'Editöryal tanıtım.', en: 'Editorial introduction.' },
        description: { tr: 'Özet.', en: 'Summary.' },
        tags: [],
        amenities: [],
        image_url: '/images/demo-hotels/hotel_indirimli_1.png',
        gallery_images: [],
        faqs: [
          {
            question: 'Editöryal Doğrulanmış Soru: Tekne transferi var mı?',
            answer: 'Evet, yalnızca özel iskele tekne transferi sağlanır.',
          },
        ],
      },
    ];

    const mockPort = await getFreePort();
    const mockServer = http.createServer((req, res) => {
      const reqUrl = new URL(req.url || '/', `http://127.0.0.1:${mockPort}`);
      if (reqUrl.pathname === '/rest/v1/hotels') {
        const idFilter = reqUrl.searchParams.get('id');
        const slugFilter = reqUrl.searchParams.get('slug');
        const accept = String(req.headers.accept || '');
        let rows = mockHotels;
        if (idFilter && idFilter.startsWith('eq.')) {
          rows = mockHotels.filter((h) => h.id === idFilter.slice(3));
        } else if (slugFilter && slugFilter.startsWith('eq.')) {
          rows = mockHotels.filter((h) => h.slug === slugFilter.slice(3));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(accept.includes('application/vnd.pgrst.object+json') ? JSON.stringify(rows[0] || null) : JSON.stringify(rows));
        return;
      }
      if (reqUrl.pathname.startsWith('/rest/v1/')) {
        const accept = String(req.headers.accept || '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(accept.includes('application/vnd.pgrst.object+json') ? 'null' : '[]');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{}');
    });
    await new Promise((r) => mockServer.listen(mockPort, '127.0.0.1', r));

    const tempDistDir = `.next-paket10c-${mockPort}`;
    const tsconfigPath = path.join(ROOT, 'tsconfig.json');
    const savedTsconfig = fs.existsSync(tsconfigPath) ? fs.readFileSync(tsconfigPath, 'utf8') : null;
    const nextPort = await getFreePort();
    let nextProc = null;

    try {
      const nextEnv = {
        ...process.env,
        NODE_ENV: 'production',
        NEXT_DIST_DIR: tempDistDir,
        NEXT_DISABLE_WEBPACK_CACHE: '1',
        PORT: String(nextPort),
        HOSTNAME: '127.0.0.1',
        APP_ENVIRONMENT: 'test',
        GASTRONOMY_LOCAL_PREVIEW: '0',
        GASTRONOMY_AUTH_MODE: 'basic',
        ADMIN_USER: 'local-audit',
        ADMIN_PASSWORD: 'local-audit-password-10c',
        NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${mockPort}`,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'local-test-anon-key',
      };
      delete nextEnv.VERCEL;
      delete nextEnv.VERCEL_ENV;
      delete nextEnv.UPSTASH_REDIS_REST_URL;
      delete nextEnv.UPSTASH_REDIS_REST_TOKEN;
      delete nextEnv.RATE_LIMIT_ENFORCE;

      const buildEnv = { ...nextEnv };
      delete buildEnv.NODE_OPTIONS;
      await new Promise((resolve, reject) => {
        const b = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
          cwd: ROOT,
          env: buildEnv,
          stdio: ['ignore', 'pipe', 'pipe'],
        });
        let err = '';
        b.stderr.on('data', (c) => {
          err += String(c);
        });
        b.on('error', reject);
        b.on('exit', (code) => {
          if (code === 0) return resolve();
          reject(new Error(`temp next build exited ${code}:\n${err.slice(-1500)}`));
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

      await check('7. B4 Live SSR hotel pages with empty FAQs omit FAQPage, default claims & hardcoded reviewCount:1 across TR & EN', async () => {
        for (const [reqPath, host] of [
          ['/otel/empty-faq-hotel', 'www.yeriniayir.com'],
          ['/hotel/empty-faq-hotel', 'www.worldandhotels.com'],
        ]) {
          const res = await rawHttpRequest(nextPort, reqPath, host);
          assert.equal(res.status, 200, `Expected 200 on ${reqPath}`);
          assert.equal(
            /<h2[^>]*>\s*(?:Sıkça Sorulan Sorular|Frequently Asked Questions)\s*<\/h2>/i.test(res.body),
            false,
            `HotelFAQ heading must not render on ${reqPath} when hotel.faqs is empty`
          );
          for (const forbidden of [
            'FAQPage',
            'Giriş ve çıkış saatleri neler',
            'What are the check-in and check-out times',
            'Tesisin kahvaltı saatleri',
            'ücretsiz otopark',
            'free parking is available',
            'evcil hayvan kabul edilmemektedir',
            'pets are not accepted',
            'tekerlekli sandalye rampaları',
            'wheelchair ramps',
            'fitness center',
            'spor olanağı var mı',
            '07:30 - 10:30',
            'Tarihi çarşı ve liman',
            'AggregateRating',
            '"reviewCount":"1"',
          ]) {
            const idx = res.body.indexOf(forbidden);
            if (idx !== -1) {
              const snippet = res.body.slice(Math.max(0, idx - 120), idx + 220);
              assert.fail(`Unverified claim "${forbidden}" leaked on ${reqPath}: ${snippet}`);
            }
          }
        }

        const verifiedRes = await rawHttpRequest(nextPort, '/otel/verified-faq-hotel', 'www.yeriniayir.com');
        assert.equal(verifiedRes.status, 200);
        assert.ok(verifiedRes.body.includes('FAQPage'));
        assert.ok(verifiedRes.body.includes('Editöryal Doğrulanmış Soru: Tekne transferi var mı?'));
        assert.equal(verifiedRes.body.includes('ücretsiz otopark'), false);
        assert.equal(verifiedRes.body.includes('AggregateRating'), false);
        assert.equal(verifiedRes.body.includes('"reviewCount":"1"'), false);
      });
    } finally {
      await stopChild(nextProc);
      mockServer.close();
      fs.rmSync(path.join(ROOT, tempDistDir), { recursive: true, force: true });
      if (savedTsconfig !== null && fs.readFileSync(tsconfigPath, 'utf8') !== savedTsconfig) {
        fs.writeFileSync(tsconfigPath, savedTsconfig, 'utf8');
      }
    }

    console.log(`\nALL PAKET 10C INDEPENDENT CLOSURES PASSED (${passed}/7 checks).`);
  } catch (err) {
    console.error('\nFAIL:', err && err.stack ? err.stack : err);
    process.exitCode = 1;
  }
})();
