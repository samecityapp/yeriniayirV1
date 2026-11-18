require('./research-ts-loader.cjs');
// Run after `npm run build`: node scripts/verify_p0_security_fixes.cjs
// All DB/Auth checks talk strictly to an ephemeral 127.0.0.1 loopback mock server.
// Real external network calls are explicitly blocked/asserted as 0.
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { createRequire } = require('node:module');

const root = process.cwd();
const repoRequire = createRequire(path.join(root, 'package.json'));
const ts = repoRequire('typescript');
const { NextRequest } = repoRequire('next/server');

const REAL_FETCH = global.fetch;

function transpileAndLoad(relativePath, { mocks = {}, clearCache = false, moduleCache = new Map() } = {}) {
  const filename = path.join(root, relativePath);
  if (!clearCache && moduleCache.has(filename)) {
    return moduleCache.get(filename).exports;
  }

  const mod = { exports: {} };
  if (!clearCache) {
    moduleCache.set(filename, mod);
  }

  const localRequire = createRequire(filename);
  const source = fs.readFileSync(filename, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;

  function scopedRequire(id) {
    if (Object.prototype.hasOwnProperty.call(mocks, id)) {
      return mocks[id];
    }
    if (id.startsWith('@/')) {
      return transpileAndLoad(id.slice(2) + '.ts', { mocks, clearCache, moduleCache });
    }
    if (id.startsWith('./') || id.startsWith('../')) {
      const resolvedBase = path.resolve(path.dirname(filename), id);
      const candidates = [
        resolvedBase,
        `${resolvedBase}.ts`,
        `${resolvedBase}.tsx`,
        `${resolvedBase}.js`,
      ];
      const hit = candidates.find((candidate) => fs.existsSync(candidate));
      if (hit && (hit.endsWith('.ts') || hit.endsWith('.tsx'))) {
        return transpileAndLoad(path.relative(root, hit), { mocks, clearCache, moduleCache });
      }
    }
    return localRequire(id);
  }

  new Function('require', 'module', 'exports', transpiled)(scopedRequire, mod, mod.exports);
  return mod.exports;
}

function makeMockSupabaseServer() {
  const state = {
    hits: [],
    mockUserIsAdmin: false,
    mockUserValid: true,
  };

  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      state.hits.push({
        method: req.method,
        url: req.url,
        authorization: req.headers.authorization || '',
        apikey: req.headers.apikey || '',
        body,
      });

      if (req.url === '/auth/v1/user') {
        if (!state.mockUserValid) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid JWT' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            id: state.mockUserIsAdmin ? '00000000-0000-4000-8000-000000000999' : '00000000-0000-4000-8000-000000000111',
            aud: 'authenticated',
            role: 'authenticated',
            is_anonymous: false,
            email: state.mockUserIsAdmin ? 'admin@example.invalid' : 'user@example.invalid',
          })
        );
        return;
      }

      if (req.url === '/rest/v1/rpc/ya_is_admin') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(Boolean(state.mockUserIsAdmin)));
        return;
      }

      if (req.url.startsWith('/rest/v1/offers')) {
        if (req.method === 'DELETE') {
          res.writeHead(204);
          res.end();
          return;
        }
        const accept = String(req.headers.accept || '');
        const sampleOffer = {
          id: '11111111-1111-4111-8111-111111111111',
          slug: 'test-hotel-offer',
          hotel_name: 'Mock Hotel',
          price: '10.000',
          currency: 'TL',
          region: 'Kapadokya',
          promo_text: 'Mock Promo',
          included_items: [],
          created_at: '2026-11-18T00:00:00.000Z',
          updated_at: '2026-11-18T00:00:00.000Z',
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(accept.includes('vnd.pgrst.object+json') ? sampleOffer : [sampleOffer]));
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unexpected endpoint in mock server' }));
    });
  });

  return { server, state };
}

function makeOfferFormData(overrides = {}) {
  const fd = new FormData();
  fd.set('hotel_name', overrides.hotel_name ?? 'Test Hotel');
  fd.set('slug', overrides.slug ?? 'test-hotel-offer');
  fd.set('price', overrides.price ?? '25.000');
  fd.set('currency', overrides.currency ?? 'TL');
  fd.set('region', overrides.region ?? 'Kapadokya');
  fd.set('promo_text', overrides.promo_text ?? '2 Gece 1 Öde');
  if (overrides.included_items !== undefined) {
    fd.set('included_items', overrides.included_items);
  } else {
    fd.set(
      'included_items',
      JSON.stringify([{ id: 'feat1', title: 'Üyelik', description: '12 ay', isActive: true }])
    );
  }
  return fd;
}

async function run() {
  const savedEnv = { ...process.env };
  const { server: mockServer, state } = makeMockSupabaseServer();

  await new Promise((resolve) => mockServer.listen(0, '127.0.0.1', resolve));
  const port = mockServer.address().port;
  const loopbackUrl = `http://127.0.0.1:${port}`;
  const loopbackRef = 'isolated-mock-ref';

  // Ensure zero external network calls escape the process during tests
  global.fetch = async (input, init) => {
    const targetUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const parsed = new URL(targetUrl);
    if (parsed.hostname !== '127.0.0.1' || Number(parsed.port) !== port) {
      throw new Error(`SECURITY TEST FAILURE: Unexpected outbound fetch attempted to ${targetUrl}`);
    }
    return REAL_FETCH(input, init);
  };

  let passed = 0;
  async function check(label, fn) {
    await fn();
    passed++;
    console.log(`PASS ${label}`);
  }

  let currentHeaders = new Headers();
  let currentCookies = new Map();
  const revalidatedPaths = [];

  const nextMocks = {
    'next/headers': {
      headers: async () => currentHeaders,
      cookies: async () => ({
        get: (name) => (currentCookies.has(name) ? { name, value: currentCookies.get(name) } : undefined),
      }),
    },
    'next/cache': {
      revalidatePath: (p) => revalidatedPaths.push(p),
      revalidateTag: () => {},
    },
    '@upstash/redis': { Redis: class {} },
    '@upstash/ratelimit': { Ratelimit: class { static slidingWindow() { return {}; } } },
  };

  try {
    // Prepare isolated loopback environment for Pilot Basic mode
    process.env.NODE_ENV = 'test';
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.APP_ENVIRONMENT;
    delete process.env.GASTRONOMY_LOCAL_PREVIEW;
    process.env.GASTRONOMY_AUTH_MODE = 'basic';
    process.env.ADMIN_USER = 'pilot-admin';
    process.env.ADMIN_PASSWORD = 'isolated-test-admin-password-32ch';
    process.env.NEXT_PUBLIC_SUPABASE_URL = loopbackUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'dummy-anon-key-only';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy-service-role-key-only';

    const sharedCache = new Map();
    const actions = transpileAndLoad(
      'app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts',
      { mocks: nextMocks, moduleCache: sharedCache }
    );
    const { middleware } = transpileAndLoad('middleware.ts', {
      mocks: nextMocks,
      moduleCache: sharedCache,
    });
    const { offers } = transpileAndLoad('lib/offers.ts', {
      mocks: nextMocks,
      moduleCache: sharedCache,
    });

    const validBasic =
      'Basic ' + Buffer.from('pilot-admin:isolated-test-admin-password-32ch').toString('base64');
    const wrongBasic = 'Basic ' + Buffer.from('pilot-admin:wrong-pass').toString('base64');
    const offerUuid = '22222222-2222-4222-8222-222222222222';

    // =========================================================================
    // TEST GROUP A: Anonim Kullanıcı
    // =========================================================================
    await check('Group A.1: actions.getOffers is removed (not exposed as Server Action)', async () => {
      assert.equal(typeof actions.getOffers, 'undefined');
    });

    for (const route of [
      '/tr/jilinrime/teklif-yonetimi',
      '/en/jilinrime/teklif-yonetimi',
      '/jilinrime/teklif-yonetimi',
      '/tr/jilinrime/teklif-yonetimi.json',
      '/tr/jilinrime/teklif-yonetimi?_rsc=123',
    ]) {
      await check(`Group A.2: middleware denies anonymous ${route} with 401 + no-store + noindex`, async () => {
        const res = await middleware(new NextRequest(`http://localhost:3000${route}`));
        assert.equal(res.status, 401);
        assert.match(res.headers.get('cache-control') || '', /no-store/);
        assert.match(res.headers.get('x-robots-tag') || '', /noindex/);
      });
    }

    await check('Group A.3: middleware fails closed (503) when ADMIN_PASSWORD is missing', async () => {
      const savedPwd = process.env.ADMIN_PASSWORD;
      delete process.env.ADMIN_PASSWORD;
      const res = await middleware(new NextRequest('http://localhost:3000/tr/jilinrime/teklif-yonetimi'));
      assert.equal(res.status, 503);
      process.env.ADMIN_PASSWORD = savedPwd;
    });

    await check('Group A.4: Anonymous createOffer/updateOffer/deleteOffer rejected (401, 0 DB hits)', async () => {
      state.hits.length = 0;
      currentCookies = new Map();
      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
      });

      const r1 = await actions.createOffer(makeOfferFormData());
      const r2 = await actions.updateOffer(offerUuid, makeOfferFormData());
      const r3 = await actions.deleteOffer(offerUuid);

      assert.equal(r1.success, false);
      assert.equal(r1.status, 401);
      assert.equal(r2.success, false);
      assert.equal(r2.status, 401);
      assert.equal(r3.success, false);
      assert.equal(r3.status, 401);
      assert.equal(state.hits.length, 0);
    });

    await check('Group A.5: Direct lib/offers admin calls throw SECURITY VIOLATION without capability', async () => {
      state.hits.length = 0;
      await assert.rejects(() => offers.getAll(null), /SECURITY VIOLATION/);
      await assert.rejects(() => offers.create({}, { hotel_name: 'X', slug: 'x', price: '1', currency: 'TL', region: 'Y' }), /SECURITY VIOLATION/);
      await assert.rejects(() => offers.update({}, offerUuid, { price: '2' }), /SECURITY VIOLATION/);
      await assert.rejects(() => offers.delete({}, offerUuid), /SECURITY VIOLATION/);
      assert.equal(state.hits.length, 0);
    });

    // =========================================================================
    // TEST GROUP B: Normal (Oturum Açmış Yetkisiz) Kullanıcı
    // =========================================================================
    await check('Group B.1: Basic mode rejects Bearer JWT (403) and sb-user cookie (403) with 0 DB hits', async () => {
      state.hits.length = 0;
      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
        authorization: 'Bearer user-jwt-token',
      });
      const rBearer = await actions.createOffer(makeOfferFormData());
      assert.equal(rBearer.success, false);
      assert.equal(rBearer.status, 403);

      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
        cookie: 'sb-project-auth-token=normal-user-session',
      });
      const rCookie = await actions.deleteOffer(offerUuid);
      assert.equal(rCookie.success, false);
      assert.equal(rCookie.status, 403);

      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
        authorization: wrongBasic,
      });
      const rWrong = await actions.updateOffer(offerUuid, makeOfferFormData());
      assert.equal(rWrong.success, false);
      assert.equal(rWrong.status, 401);
      assert.equal(state.hits.length, 0);
    });

    // Switch to Cloud MFA mode (GASTRONOMY_AUTH_MODE=supabase) pointing to isolated mock server
    process.env.GASTRONOMY_AUTH_MODE = 'supabase';
    process.env.GASTRONOMY_CLOUD_ENV = 'staging';
    process.env.GASTRONOMY_SUPABASE_REF = loopbackRef;
    process.env.GASTRONOMY_SUPABASE_URL = `https://${loopbackRef}.supabase.co`;
    process.env.GASTRONOMY_SUPABASE_ANON_KEY = 'dummy-cloud-staging-anon';

    const cloudMocks = {
      ...nextMocks,
      '@/lib/cloud/client': {
        cloudClient: (token) => {
          // Route cloud auth verification requests strictly to our local loopback mock server
          const { createClient } = repoRequire('@supabase/supabase-js');
          return createClient(loopbackUrl, 'dummy-cloud-staging-anon', {
            auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
            global: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
          });
        },
      },
    };
    const cloudCache = new Map();
    const cloudActions = transpileAndLoad(
      'app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts',
      { mocks: cloudMocks, moduleCache: cloudCache }
    );

    await check('Group B.2: Cloud MFA mode rejects retired Basic Auth on BOTH middleware and Server Actions', async () => {
      state.hits.length = 0;
      const mwRes = await middleware(
        new NextRequest('http://127.0.0.1:3000/tr/jilinrime/teklif-yonetimi', {
          headers: { authorization: validBasic },
        })
      );
      assert.equal(mwRes.status, 401);

      currentCookies = new Map();
      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
        authorization: validBasic,
      });
      const r1 = await cloudActions.createOffer(makeOfferFormData());
      const r2 = await cloudActions.deleteOffer(offerUuid);
      assert.equal(r1.success, false);
      assert.equal(r1.status, 401);
      assert.equal(r2.success, false);
      assert.equal(r2.status, 401);
      assert.equal(state.hits.length, 0);
    });

    await check('Group B.3: Cloud MFA mode denies pending MFA (aal1) cookie (403, 0 DB hits)', async () => {
      state.hits.length = 0;
      currentCookies = new Map([['ya_cloud_pending', 'pending-aal1-token']]);
      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
      });
      const res = await cloudActions.deleteOffer(offerUuid);
      assert.equal(res.success, false);
      assert.equal(res.status, 403);
      assert.equal(state.hits.length, 0);
    });

    await check('Group B.4: Cloud MFA mode denies normal authenticated non-admin user (ya_is_admin=false -> 403, 0 offers mutations)', async () => {
      state.hits.length = 0;
      state.mockUserValid = true;
      state.mockUserIsAdmin = false;
      currentCookies = new Map([['ya_cloud_admin', 'normal-user-jwt']]);
      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
      });

      const rCreate = await cloudActions.createOffer(makeOfferFormData());
      const rUpdate = await cloudActions.updateOffer(offerUuid, makeOfferFormData());
      const rDelete = await cloudActions.deleteOffer(offerUuid);

      assert.equal(rCreate.success, false);
      assert.equal(rCreate.status, 403);
      assert.equal(rUpdate.success, false);
      assert.equal(rUpdate.status, 403);
      assert.equal(rDelete.success, false);
      assert.equal(rDelete.status, 403);
      assert.equal(state.hits.filter((h) => h.url.includes('/rest/v1/offers')).length, 0);
    });

    // =========================================================================
    // TEST GROUP C: Yönetici (Yetkili) + CSRF + SSRF Engelleri
    // =========================================================================
    await check('Group C.1: Cross-origin / missing Origin / sec-fetch-site=cross-site rejected (403) even for valid admin', async () => {
      state.hits.length = 0;
      state.mockUserValid = true;
      state.mockUserIsAdmin = true;
      currentCookies = new Map([['ya_cloud_admin', 'valid-admin-mfa-jwt']]);

      for (const badHeaders of [
        { host: 'www.yeriniayir.com', origin: 'https://evil.example' },
        { host: '127.0.0.1:3000', origin: 'http://127.0.0.1:4000' },
        { host: 'www.yeriniayir.com', origin: 'http://www.yeriniayir.com' },
        { host: 'www.yeriniayir.com' },
        { host: 'www.yeriniayir.com', origin: 'https://www.yeriniayir.com', 'sec-fetch-site': 'cross-site' },
      ]) {
        currentHeaders = new Headers(badHeaders);
        const r = await cloudActions.deleteOffer(offerUuid);
        assert.equal(r.success, false);
        assert.equal(r.status, 403);
      }
      assert.equal(state.hits.length, 0);
    });

    await check('Group C.2: Authorized Pilot Basic Admin executes CRUD cleanly on isolated mock DB (no warmup SSRF fetch)', async () => {
      process.env.GASTRONOMY_AUTH_MODE = 'basic';
      state.hits.length = 0;
      revalidatedPaths.length = 0;
      currentCookies = new Map();
      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
        authorization: validBasic,
      });

      const rCreate = await actions.createOffer(makeOfferFormData());
      const rUpdate = await actions.updateOffer(offerUuid, makeOfferFormData({ price: '29.000' }));
      const rDelete = await actions.deleteOffer(offerUuid);

      assert.deepEqual(rCreate, { success: true });
      assert.deepEqual(rUpdate, { success: true });
      assert.deepEqual(rDelete, { success: true });
      assert.ok(revalidatedPaths.includes('/tr/test-hotel-offer'));
      assert.ok(revalidatedPaths.includes('/en/test-hotel-offer'));
      assert.equal(state.hits.filter((h) => h.url.includes('/rest/v1/offers')).length, 3);
      assert.ok(state.hits.every((h) => h.authorization === 'Bearer dummy-service-role-key-only'));
    });

    await check('Group C.3: Authorized Cloud MFA Admin (ya_is_admin=true) executes CRUD cleanly on isolated mock DB', async () => {
      process.env.GASTRONOMY_AUTH_MODE = 'supabase';
      state.hits.length = 0;
      state.mockUserValid = true;
      state.mockUserIsAdmin = true;
      currentCookies = new Map([['ya_cloud_admin', 'valid-admin-mfa-jwt']]);
      currentHeaders = new Headers({
        host: 'www.yeriniayir.com',
        origin: 'https://www.yeriniayir.com',
      });

      const rCreate = await cloudActions.createOffer(makeOfferFormData());
      const rUpdate = await cloudActions.updateOffer(offerUuid, makeOfferFormData());
      const rDelete = await cloudActions.deleteOffer(offerUuid);

      assert.deepEqual(rCreate, { success: true });
      assert.deepEqual(rUpdate, { success: true });
      assert.deepEqual(rDelete, { success: true });
      assert.equal(state.hits.filter((h) => h.url.includes('/rest/v1/offers')).length, 3);
    });

    await check('Group C.4: Authorized Admin cannot trigger SSRF/path-traversal via invalid slug, UUID or malformed JSON', async () => {
      process.env.GASTRONOMY_AUTH_MODE = 'basic';
      state.hits.length = 0;
      currentCookies = new Map();
      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
        authorization: validBasic,
      });

      for (const badSlug of [
        '../api/go?hotelId=1',
        '../../etc/passwd',
        'http://169.254.169.254/latest',
        'slug/with/slash',
        'SlugWithCaps',
        '-leading-dash',
      ]) {
        const res = await actions.createOffer(makeOfferFormData({ slug: badSlug }));
        assert.equal(res.success, false, `Expected invalid slug rejected: ${badSlug}`);
        assert.equal(res.status, 400);
      }

      const badJsonRes = await actions.createOffer(makeOfferFormData({ included_items: '{invalid-json' }));
      assert.equal(badJsonRes.success, false);
      assert.equal(badJsonRes.status, 400);

      const badIdRes = await actions.deleteOffer('not-a-uuid');
      assert.equal(badIdRes.success, false);
      assert.equal(badIdRes.status, 400);

      assert.equal(state.hits.length, 0);
    });

    // =========================================================================
    // TEST GROUP D: Ziyaretçi Teklif Sayfası En Az Yetki (Anon Client)
    // =========================================================================
    await check('Group D: offers.getBySlug uses anon key (never service_role) and rejects malformed slugs with 0 queries', async () => {
      state.hits.length = 0;
      const invalid = await offers.getBySlug('../secret?x=1');
      assert.equal(invalid, null);
      assert.equal(state.hits.length, 0);

      const valid = await offers.getBySlug('test-hotel-offer');
      assert.equal(valid?.slug, 'test-hotel-offer');
      assert.equal(state.hits.length, 1);
      assert.equal(state.hits[0].apikey, 'dummy-anon-key-only');
      assert.equal(state.hits[0].authorization, 'Bearer dummy-anon-key-only');
    });

    // =========================================================================
    // TEST GROUP E: P0-2 Preview/Staging <-> Production Supabase İzolasyonu
    // =========================================================================
    for (const prodUrl of [
      'https://jerkkxwgddujigsbeqwo.supabase.co',
      'https://aknhkpevrlpsrfxzqtop.supabase.co',
    ]) {
      await check(`Group E.1: Preview blocks all reads & service_role writes targeting ${prodUrl} with 0 network sockets`, async () => {
        process.env.VERCEL = '1';
        process.env.VERCEL_ENV = 'preview';
        process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
        process.env.NEXT_PUBLIC_SUPABASE_URL = prodUrl;
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'dummy-prod-anon-key';
        process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy-prod-service-role-key';

        // Temporarily forbid EVEN loopback inside fetch so we prove the isolation client NEVER calls fetch()!
        const isolatedCache = new Map();
        const savedFetchNow = global.fetch;
        global.fetch = async (url) => {
          throw new Error(`SECURITY FAILURE: Isolated Supabase client called fetch for ${url}`);
        };
        try {
          const guardMod = transpileAndLoad('lib/supabase-env-guard.ts', { clearCache: true, moduleCache: isolatedCache });
          const pubMod = transpileAndLoad('lib/supabase.ts', { clearCache: true, moduleCache: isolatedCache });
          const admMod = transpileAndLoad('lib/supabase-admin.ts', { clearCache: true, moduleCache: isolatedCache });

          assert.equal(guardMod.isNonProductionRuntime(), true);
          assert.equal(guardMod.getAllowedPublicSupabaseOrigin(prodUrl), null);
          assert.equal(pubMod.isSupabaseIsolated, true);
          assert.equal(admMod.isServiceRoleBlockedByIsolation, true);
          assert.equal(admMod.hasServiceRoleKey, false);
          assert.throws(() => admMod.assertSupabaseAdminReady(), /SECURITY BLOCK/);

          const pubRes = await pubMod.supabase.from('offers').select('*').limit(1);
          assert.equal(pubRes.error?.code, 'YA_SUPABASE_ENV_ISOLATION_BLOCKED');

          const admRes = await admMod.supabaseAdmin.from('offers').delete().eq('id', offerUuid);
          assert.equal(admRes.error?.code, 'YA_SUPABASE_ENV_ISOLATION_BLOCKED');
        } finally {
          global.fetch = savedFetchNow;
        }
      });
    }

    await check('Group E.2: next.config.js masks live Supabase build env under VERCEL_ENV=preview', async () => {
      delete process.env.APP_ENVIRONMENT;
      delete process.env.GASTRONOMY_CLOUD_ENV;
      process.env.VERCEL_ENV = 'preview';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://jerkkxwgddujigsbeqwo.supabase.co';
      delete require.cache[require.resolve(path.join(root, 'next.config.js'))];
      const cfg = require(path.join(root, 'next.config.js'));
      assert.equal(cfg.env?.NEXT_PUBLIC_SUPABASE_URL, 'https://isolated-preview-blocked.invalid');
      assert.equal(cfg.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'isolated-preview-blocked-anon-key');

      process.env.VERCEL_ENV = 'production';
      delete require.cache[require.resolve(path.join(root, 'next.config.js'))];
      const prodCfg = require(path.join(root, 'next.config.js'));
      assert.equal(prodCfg.env, undefined);
    });

    await check('Group E.3: lib/cloud/config.ts blocks production ref when VERCEL_ENV=preview even with authorization flags', async () => {
      process.env.VERCEL_ENV = 'preview';
      process.env.GASTRONOMY_CLOUD_ENV = 'production';
      process.env.GASTRONOMY_PRODUCTION_AUTHORIZED = '1';
      process.env.GASTRONOMY_SUPABASE_REF = 'jerkkxwgddujigsbeqwo';
      process.env.GASTRONOMY_SUPABASE_URL = 'https://jerkkxwgddujigsbeqwo.supabase.co';
      process.env.GASTRONOMY_SUPABASE_ANON_KEY = 'dummy-key';
      const cloudCfg = transpileAndLoad('lib/cloud/config.ts', { clearCache: true });
      assert.throws(() => cloudCfg.cloudConfig(), /explicit authorization/);
    });

    // =========================================================================
    // TEST GROUP F: Built Manifest & Source Static Guarantees + Next Server Smoke
    // =========================================================================
    await check('Group F.1: No warmup SSRF fetch remains in actions.ts or OfferManager.tsx', async () => {
      const actionsSrc = fs.readFileSync(path.join(root, 'app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts'), 'utf8');
      const managerSrc = fs.readFileSync(path.join(root, 'app/[lang]/(admin)/jilinrime/teklif-yonetimi/OfferManager.tsx'), 'utf8');
      assert.doesNotMatch(actionsSrc, /fetch\s*\(/);
      assert.doesNotMatch(managerSrc, /fetch\s*\(\s*`\$\{checkUrl\}/);
      assert.doesNotMatch(managerSrc, /const checkUrl\s*=\s*`https:\/\/www\.yeriniayir\.com\/tr\//);
    });

    const manifestPath = path.join(root, '.next/server/server-reference-manifest.json');
    if (fs.existsSync(manifestPath)) {
      await check('Group F.2: Compiled server-reference-manifest.json excludes getOffers and includes create/update/deleteOffer', async () => {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const exportedNames = new Set(Object.values(manifest.node || {}).map((e) => e.exportedName));
        assert.equal(exportedNames.has('getOffers'), false, 'getOffers must not be registered as a Server Action');
        assert.equal(exportedNames.has('createOffer'), true);
        assert.equal(exportedNames.has('updateOffer'), true);
        assert.equal(exportedNames.has('deleteOffer'), true);

        const deleteEntry = Object.entries(manifest.node || {}).find(([, v]) => v.exportedName === 'deleteOffer');
        assert.ok(deleteEntry);

        // Spin up built next server under Preview simulation with isolated dummy keys
        const testPort = 3319;
        await new Promise((resolve, reject) => {
          const srv = spawn('npx', ['next', 'start', '-p', String(testPort)], {
            cwd: root,
            env: {
              ...process.env,
              NODE_ENV: 'production',
              VERCEL: '1',
              VERCEL_ENV: 'preview',
              NEXT_PUBLIC_VERCEL_ENV: 'preview',
              NEXT_PUBLIC_SUPABASE_URL: 'https://jerkkxwgddujigsbeqwo.supabase.co',
              NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-preview-anon',
              SUPABASE_SERVICE_ROLE_KEY: 'dummy-preview-service-role',
              ADMIN_USER: 'pilot-admin',
              ADMIN_PASSWORD: 'isolated-test-admin-password-32ch',
              GASTRONOMY_AUTH_MODE: 'supabase',
            },
          });
          let settled = false;
          const finish = (err) => {
            if (settled) return;
            settled = true;
            srv.kill('SIGTERM');
            if (err) reject(err);
            else resolve();
          };
          const timer = setTimeout(() => finish(new Error('Next server startup timeout')), 15000);

          srv.stdout.on('data', async (chunk) => {
            if (!String(chunk).includes('Ready')) return;
            try {
              // Restore REAL_FETCH briefly only for localhost Next server port 3319
              global.fetch = (input, init) => REAL_FETCH(input, init);

              const trRes = await REAL_FETCH(`http://127.0.0.1:${testPort}/tr`);
              assert.equal(trRes.status, 200);
              const trHtml = await trRes.text();
              assert.equal(trHtml.includes('jerkkxwgddujigsbeqwo.supabase.co'), false, 'Preview HTML must not preconnect to production Supabase');

              const retiredBasic = 'Basic ' + Buffer.from('pilot-admin:isolated-test-admin-password-32ch').toString('base64');
              const postBypass = await REAL_FETCH(`http://127.0.0.1:${testPort}/tr/jilinrime/teklif-yonetimi`, {
                method: 'POST',
                headers: {
                  Host: `127.0.0.1:${testPort}`,
                  Origin: `http://127.0.0.1:${testPort}`,
                  Authorization: retiredBasic,
                  'Next-Action': deleteEntry[0],
                  'Content-Type': 'text/plain;charset=UTF-8',
                },
                body: JSON.stringify([offerUuid]),
              });
              assert.equal(postBypass.status, 401);
              assert.match(postBypass.headers.get('cache-control') || '', /no-store/);
              assert.match(postBypass.headers.get('x-robots-tag') || '', /noindex/);

              const anonOfferPage = await REAL_FETCH(`http://127.0.0.1:${testPort}/tr/luvicavehotel-teklif`);
              assert.equal(anonOfferPage.status, 200);

              clearTimeout(timer);
              finish();
            } catch (err) {
              clearTimeout(timer);
              finish(err);
            }
          });
        });
      });
    } else {
      console.log('SKIP Group F.2: .next/server/server-reference-manifest.json not built yet.');
    }

    console.log(`\nALL P0 SECURITY FIX VERIFICATION CHECKS PASSED: ${passed} checks.`);
  } finally {
    global.fetch = REAL_FETCH;
    process.env = savedEnv;
    await new Promise((resolve) => mockServer.close(resolve));
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
