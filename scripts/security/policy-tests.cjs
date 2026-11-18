require('./network-lock.cjs');
const assert = require('node:assert/strict');
const p = require('../../lib/security/supabase-policy');
const load = require('./load-ts.cjs');

const prod = 'https://jerkkxwgddujigsbeqwo.supabase.co';
const prodB = 'https://aknhkpevrlpsrfxzqtop.supabase.co';
const stage = 'https://vhptlecaixpawtxnhsde.supabase.co';

function makeJwt(payload) {
  const hdr = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${hdr}.${body}.sig`;
}

const anonJwt = makeJwt({ role: 'anon', ref: 'vhptlecaixpawtxnhsde' });
const prodAnonJwt = makeJwt({ role: 'anon', ref: 'jerkkxwgddujigsbeqwo' });
const serviceJwtStage = makeJwt({ role: 'service_role', ref: 'vhptlecaixpawtxnhsde' });
const serviceJwtProd = makeJwt({ role: 'service_role', ref: 'jerkkxwgddujigsbeqwo' });
const adminAal2JwtStage = makeJwt({
  sub: '00000000-0000-4000-8000-000000000999',
  role: 'authenticated',
  aal: 'aal2',
  iss: `${stage}/auth/v1`,
});
const adminAal1JwtStage = makeJwt({
  sub: '00000000-0000-4000-8000-000000000999',
  role: 'authenticated',
  aal: 'aal1',
  iss: `${stage}/auth/v1`,
});

const base = {
  APP_ENVIRONMENT: 'test',
  NODE_ENV: 'test',
  GASTRONOMY_AUTH_MODE: 'supabase',
  NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54329',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-local-anon',
  GASTRONOMY_CLOUD_ENV: 'local',
  GASTRONOMY_SUPABASE_REF: 'local',
  GASTRONOMY_SUPABASE_URL: 'http://127.0.0.1:54329',
  GASTRONOMY_SUPABASE_ANON_KEY: 'dummy-local-anon',
  SUPABASE_SERVICE_ROLE_KEY: 'dummy-local-service',
};

const staging = {
  APP_ENVIRONMENT: 'staging',
  NODE_ENV: 'production',
  VERCEL: '1',
  VERCEL_ENV: 'preview',
  GASTRONOMY_AUTH_MODE: 'supabase',
  NEXT_PUBLIC_SUPABASE_URL: stage,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: anonJwt,
  GASTRONOMY_CLOUD_ENV: 'staging',
  GASTRONOMY_SUPABASE_REF: 'vhptlecaixpawtxnhsde',
  GASTRONOMY_SUPABASE_URL: stage,
  GASTRONOMY_SUPABASE_ANON_KEY: anonJwt,
  SUPABASE_SERVICE_ROLE_KEY: serviceJwtStage,
};

const production = {
  ...staging,
  APP_ENVIRONMENT: 'production',
  VERCEL_ENV: 'production',
  SUPABASE_PRODUCTION_AUTHORIZED: '1',
  NEXT_PUBLIC_SUPABASE_URL: prod,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: prodAnonJwt,
  GASTRONOMY_CLOUD_ENV: 'production',
  GASTRONOMY_SUPABASE_URL: prod,
  GASTRONOMY_SUPABASE_REF: 'jerkkxwgddujigsbeqwo',
  GASTRONOMY_SUPABASE_ANON_KEY: prodAnonJwt,
  GASTRONOMY_PRODUCTION_AUTHORIZED: '1',
  SUPABASE_SERVICE_ROLE_KEY: serviceJwtProd,
};

let count = 0;
function check(name, fn) {
  fn();
  count++;
  console.log('PASS ' + name);
}
async function checkAsync(name, fn) {
  await fn();
  count++;
  console.log('PASS ' + name);
}

function env(values) {
  for (const k of Object.keys(process.env)) {
    if (/^(VERCEL|NEXT_PUBLIC_|APP_ENVIRONMENT|GASTRONOMY_|SUPABASE_|NODE_ENV|ADMIN_)/.test(k)) {
      delete process.env[k];
    }
  }
  Object.assign(process.env, values);
}

async function run() {
  for (const good of [base, staging, production]) {
    check('valid environment + authMode: ' + good.APP_ENVIRONMENT, () => {
      p.configuration(good);
      p.authMode(good);
    });
  }

  // Codex Finding 2 counterexamples: missing/conflicting env MUST fail closed
  const badEnvs = [
    { APP_ENVIRONMENT: undefined },
    { APP_ENVIRONMENT: 'prod' },
    { VERCEL_ENV: 'wat' },
    { VERCEL: '1' },
    { NODE_ENV: 'development' },
    { APP_ENVIRONMENT: 'production' },
    { GASTRONOMY_CLOUD_ENV: 'production' },
    { NEXT_PUBLIC_VERCEL_ENV: 'preview' },
    { APP_ENVIRONMENT: undefined, NODE_ENV: 'production', VERCEL: undefined, VERCEL_ENV: undefined, GASTRONOMY_CLOUD_ENV: undefined },
    { APP_ENVIRONMENT: undefined, NODE_ENV: 'development', VERCEL: undefined, VERCEL_ENV: undefined, GASTRONOMY_CLOUD_ENV: undefined },
  ];
  for (const overrides of badEnvs) {
    check('reject conflicting/missing environment ' + JSON.stringify(overrides), () =>
      assert.throws(() => p.configuration({ ...base, ...overrides }))
    );
  }

  check('production runtime refuses APP_ENVIRONMENT=staging override', () =>
    assert.throws(() => p.configuration({ ...production, APP_ENVIRONMENT: 'staging' }))
  );

  check('production requires SUPABASE_PRODUCTION_AUTHORIZED=1', () =>
    assert.throws(() => p.configuration({ ...production, SUPABASE_PRODUCTION_AUTHORIZED: undefined }))
  );

  // URL normalization & strict allowlist tests (including trailing-dot DNS bypass)
  const badStagingUrls = [
    prod,
    prodB,
    prod + '.',
    stage + '.',
    prod + ':444',
    stage + ':444',
    'https://evil.example',
    'https://vhptlecaixpawtxnhsde.supabase.co.evil.example',
    stage + '/rest/v1',
    stage + '?x=1',
    stage + '#x',
    'https://user:pass@vhptlecaixpawtxnhsde.supabase.co',
    'http://vhptlecaixpawtxnhsde.supabase.co',
    'https://127.0.0.1',
    'http://127.0.0.1:54321',
  ];
  for (const url of badStagingUrls) {
    check('reject staging URL variant: ' + url, () =>
      assert.throws(() => p.configuration({ ...staging, NEXT_PUBLIC_SUPABASE_URL: url }))
    );
  }

  check('normalize uppercase and outer whitespace safely', () =>
    assert.equal(
      p.configuration({ ...staging, NEXT_PUBLIC_SUPABASE_URL: '  HTTPS://VHPTLECAIXPAWTXNHSDE.SUPABASE.CO/  ' }).url,
      stage
    )
  );

  check('development/test only allow loopback HTTP targets', () => {
    assert.throws(() => p.configuration({ ...base, NEXT_PUBLIC_SUPABASE_URL: stage }));
    assert.throws(() => p.configuration({ ...base, NEXT_PUBLIC_SUPABASE_URL: prod }));
    assert.throws(() => p.configuration({ ...base, NEXT_PUBLIC_SUPABASE_URL: 'https://127.0.0.1:54329' }));
  });

  // Key validation (anon vs service_role)
  check('publicKey rejects sb_secret_ and service_role JWT', () => {
    const fakeSecretPrefix = 'sb_secret_';
    assert.throws(() => p.publicKey(`${fakeSecretPrefix}12345678901234567890`));
    assert.throws(() => p.publicKey(serviceJwtStage));
    assert.equal(p.publicKey(anonJwt), anonJwt);
  });

  check('hasValidCloudAdminJwtClaims rejects prefix-spoofed iss and missing iss under cloud requireJwt=true', () => {
    const spoofedIssJwt = makeJwt({
      sub: '00000000-0000-4000-8000-000000000999',
      role: 'authenticated',
      aal: 'aal2',
      iss: `${stage}.evil.example/auth/v1`,
    });
    const missingIssJwt = makeJwt({
      sub: '00000000-0000-4000-8000-000000000999',
      role: 'authenticated',
      aal: 'aal2',
    });
    assert.equal(p.hasValidCloudAdminJwtClaims(spoofedIssJwt, stage, true), false);
    assert.equal(p.hasValidCloudAdminJwtClaims(missingIssJwt, stage, true), false);
    assert.equal(p.hasValidCloudAdminJwtClaims(adminAal2JwtStage, stage, true), true);
  });

  check('serviceRoleKey rejects sb_publishable_, anon JWT, wrong-ref JWT, and non-JWT dummy in cloud', () => {
    assert.throws(() => p.serviceRoleKey('sb_publishable_12345', 'vhptlecaixpawtxnhsde', 'staging'));
    assert.throws(() => p.serviceRoleKey(anonJwt, 'vhptlecaixpawtxnhsde', 'staging'));
    assert.throws(() => p.serviceRoleKey(serviceJwtProd, 'vhptlecaixpawtxnhsde', 'staging'));
    assert.throws(() => p.serviceRoleKey('dummy-service-role-key', 'vhptlecaixpawtxnhsde', 'staging'));
    assert.equal(p.serviceRoleKey(serviceJwtStage, 'vhptlecaixpawtxnhsde', 'staging'), serviceJwtStage);
  });

  // Codex Finding 4: mandatory authMode enum, no fallback to basic
  for (const mode of [undefined, '', 'SUPABASE', 'invalid', 'basic']) {
    check('production auth rejects ' + String(mode), () =>
      assert.throws(() => p.authMode({ ...production, GASTRONOMY_AUTH_MODE: mode }))
    );
    check('staging auth rejects ' + String(mode), () =>
      assert.throws(() => p.authMode({ ...staging, GASTRONOMY_AUTH_MODE: mode }))
    );
  }
  for (const mode of [undefined, '', 'BASIC', 'SUPABASE', 'invalid']) {
    check('test auth rejects invalid/empty mode ' + String(mode), () =>
      assert.throws(() => p.authMode({ ...base, GASTRONOMY_AUTH_MODE: mode }))
    );
  }
  check('basic mode explicitly permitted only in development/test', () => {
    assert.equal(p.authMode({ ...base, GASTRONOMY_AUTH_MODE: 'basic' }), 'basic');
  });

  // Build/runtime parity + browser host checks in supabase-env-guard.ts
  env(staging);
  const guard = load('lib/supabase-env-guard.ts');
  process.env.NEXT_PUBLIC_SUPABASE_POLICY = JSON.stringify(p.configuration(staging));
  check('build/runtime descriptor matches in staging', () =>
    assert.equal(guard.validatedSupabaseTarget().url, stage)
  );
  check('build/runtime descriptor mismatch fails closed', () => {
    process.env.NEXT_PUBLIC_SUPABASE_POLICY = JSON.stringify(p.configuration(production));
    assert.throws(() => guard.validatedSupabaseTarget());
  });
  check('ISOLATED build sentinel fails closed even if env changed', () => {
    process.env.NEXT_PUBLIC_SUPABASE_POLICY = 'ISOLATED';
    assert.throws(() => guard.validatedSupabaseTarget());
    assert.equal(guard.resolvePublicSupabaseConfig(prod, prodAnonJwt).isolated, true);
  });

  process.env.NEXT_PUBLIC_SUPABASE_POLICY = JSON.stringify(p.configuration(staging));
  global.window = { location: { hostname: 'preview.example.com' } };
  check('browser uses staging build policy on preview domain', () =>
    assert.equal(guard.resolvePublicSupabaseConfig(stage, anonJwt).isolated, false)
  );
  check('browser rejects different URL', () =>
    assert.equal(guard.resolvePublicSupabaseConfig(prod, prodAnonJwt).isolated, true)
  );
  global.window.location.hostname = 'www.yeriniayir.com';
  check('browser staging policy isolated if rendered on production domain', () =>
    assert.equal(guard.resolvePublicSupabaseConfig(stage, anonJwt).isolated, true)
  );
  process.env.NEXT_PUBLIC_SUPABASE_POLICY = JSON.stringify(p.configuration(production));
  global.window.location.hostname = 'preview.example.com';
  check('browser production disallowed on preview hostname', () =>
    assert.equal(guard.resolvePublicSupabaseConfig(prod, prodAnonJwt).isolated, true)
  );
  global.window.location.hostname = 'www.yeriniayir.com';
  check('browser production approved domain succeeds', () =>
    assert.equal(guard.resolvePublicSupabaseConfig(prod, prodAnonJwt).isolated, false)
  );
  global.window.location.hostname = 'www.yeriniayir.com.';
  check('browser trailing-dot hostname rejected', () =>
    assert.equal(guard.resolvePublicSupabaseConfig(prod, prodAnonJwt).isolated, true)
  );
  delete global.window;

  // Guard parity when NODE_ENV=production without APP_ENVIRONMENT (Codex Counterexample #1)
  env({ NODE_ENV: 'production', NEXT_PUBLIC_SUPABASE_URL: prod, NEXT_PUBLIC_SUPABASE_ANON_KEY: prodAnonJwt, SUPABASE_SERVICE_ROLE_KEY: serviceJwtProd });
  check('Counterexample #1 (no env markers + NODE_ENV=production) stays isolated', () => {
    const freshGuard = load('lib/supabase-env-guard.ts');
    const freshAdmin = load('lib/supabase-admin.ts');
    assert.equal(freshGuard.isNonProductionRuntime(), true);
    assert.equal(freshGuard.resolvePublicSupabaseConfig(prod, prodAnonJwt).isolated, true);
    assert.equal(freshAdmin.hasServiceRoleKey, false);
    assert.equal(freshAdmin.isServiceRoleBlockedByIsolation, true);
  });

  // Codex Counterexample #2 (only NODE_ENV=development) stays isolated
  env({ NODE_ENV: 'development', NEXT_PUBLIC_SUPABASE_URL: prod, NEXT_PUBLIC_SUPABASE_ANON_KEY: prodAnonJwt, SUPABASE_SERVICE_ROLE_KEY: serviceJwtProd });
  check('Counterexample #2 (only NODE_ENV=development) stays isolated', () => {
    const freshGuard = load('lib/supabase-env-guard.ts');
    const freshAdmin = load('lib/supabase-admin.ts');
    assert.equal(freshGuard.resolvePublicSupabaseConfig(prod, prodAnonJwt).isolated, true);
    assert.equal(freshAdmin.hasServiceRoleKey, false);
  });

  // Codex Finding 3: cross-project Cloud Auth <-> offers write target MUST be rejected
  env(production);
  process.env.GASTRONOMY_SUPABASE_URL = stage;
  process.env.GASTRONOMY_SUPABASE_REF = 'vhptlecaixpawtxnhsde';
  process.env.GASTRONOMY_CLOUD_ENV = 'staging';
  check('cross-project staging Cloud Auth vs production offers write target rejected', () =>
    assert.throws(() => load('lib/cloud/config.ts').cloudConfig())
  );

  // Binding OfferAdminCapability to target + checking aal1 vs aal2 JWT at Node layer
  env(staging);
  delete process.env.NEXT_PUBLIC_SUPABASE_POLICY;
  const { NextRequest } = require('next/server');
  const guardMocks = {
    'next/headers': {},
    '@/lib/cloud/client': {
      cloudClient: () => ({
        auth: { getUser: async () => ({ data: { user: { id: '00000000-0000-4000-8000-000000000999', is_anonymous: false } }, error: null }) },
        rpc: async () => ({ data: true, error: null }),
      }),
    },
  };
  const authGuard = load('lib/admin/offerAdminGuard.ts', { mocks: guardMocks });
  await checkAsync('offerAdminGuard rejects aal1 JWT inside ya_cloud_admin cookie with 403', async () => {
    const res = await authGuard.verifyOfferAdminRequest({
      requestHeaders: new Headers({ host: 'preview.example.com', origin: 'https://preview.example.com' }),
      cookieToken: adminAal1JwtStage,
      requireSameOrigin: true,
    });
    assert.equal(res.ok, false);
    assert.equal(res.status, 403);
  });

  let issuedCap;
  await checkAsync('offerAdminGuard issues target-bound capability for valid aal2 admin', async () => {
    const res = await authGuard.verifyOfferAdminRequest({
      requestHeaders: new Headers({ host: 'preview.example.com', origin: 'https://preview.example.com' }),
      cookieToken: adminAal2JwtStage,
      requireSameOrigin: true,
    });
    assert.equal(res.ok, true);
    issuedCap = res.capability;
    assert.equal(issuedCap.targetUrl, stage);
    assert.equal(issuedCap.environment, 'staging');
    assert.equal(issuedCap.projectRef, 'vhptlecaixpawtxnhsde');
    authGuard.assertValidOfferAdminCapability(issuedCap);
  });

  check('capability replay against a different runtime target throws', () => {
    env(production);
    assert.throws(() => authGuard.assertValidOfferAdminCapability(issuedCap));
  });

  // Codex Finding 6: staging + supabase middleware allows login flow and blocks everything else until MFA cookie valid
  env(staging);
  let isAdmin = false;
  const mw = load('middleware.ts', {
    mocks: {
      '@upstash/redis': { Redis: class {} },
      '@upstash/ratelimit': {
        Ratelimit: class {
          static slidingWindow() {
            return {};
          }
          limit() {
            return Promise.resolve({ success: true, limit: 20, reset: 0, remaining: 20 });
          }
        },
      },
      '@/lib/cloud/client': {
        cloudClient: () => ({
          auth: { getUser: async () => ({ data: { user: { id: 'test-member', is_anonymous: false } }, error: null }) },
          rpc: async () => ({ data: isAdmin, error: null }),
        }),
      },
    },
  }).middleware;

  await checkAsync('staging login UI + POST login reachable with noindex/private headers', async () => {
    const pageRes = await mw(new NextRequest('https://preview.example.com/tr/gastronomi-yonetimi'));
    assert.equal(pageRes.status, 200);
    assert.match(pageRes.headers.get('cache-control') || '', /private, no-store/);
    assert.match(pageRes.headers.get('x-robots-tag') || '', /noindex/);
    const postRes = await mw(new NextRequest('https://preview.example.com/api/gastronomy-admin/login', { method: 'POST' }));
    assert.equal(postRes.status, 200);
  });

  await checkAsync('staging blocks anonymous public pages, APIs, /_next/image, and /tr/jilinrime.rsc without MFA', async () => {
    for (const u of ['/tr', '/api/gastronomy/regions/moda', '/tr/jilinrime', '/tr/jilinrime.rsc', '/images/gastronomy/coffee-pour-over.svg', '/_next/image?url=%2Fimages%2Flogo.png']) {
      const r = await mw(new NextRequest('https://preview.example.com' + u));
      assert.equal(r.status, 401);
      assert.match(r.headers.get('cache-control') || '', /no-store/);
      assert.match(r.headers.get('x-robots-tag') || '', /noindex/);
    }
  });

  await checkAsync('staging custom hostname visiting /en does not redirect to worldandhotels.com', async () => {
    isAdmin = true;
    const r = await mw(new NextRequest('https://preview.example.com/en', { headers: { host: 'preview.example.com', cookie: `ya_cloud_admin=${adminAal2JwtStage}` } }));
    assert.equal(r.status, 200);
    assert.equal(r.headers.get('location'), null);
    isAdmin = false;
  });

  await checkAsync('staging rejects aal1 JWT in ya_cloud_admin with 403', async () => {
    const r = await mw(new NextRequest('https://preview.example.com/tr/jilinrime', { headers: { cookie: `ya_cloud_admin=${adminAal1JwtStage}` } }));
    assert.equal(r.status, 403);
  });

  await checkAsync('staging rejects non-admin member with aal2 JWT (ya_is_admin=false -> 403)', async () => {
    isAdmin = false;
    const r = await mw(new NextRequest('https://preview.example.com/tr/jilinrime', { headers: { cookie: `ya_cloud_admin=${adminAal2JwtStage}` } }));
    assert.equal(r.status, 403);
  });

  await checkAsync('staging MFA admin allowed (mocked Auth/RPC) with Cookie+Authorization Vary & noindex', async () => {
    isAdmin = true;
    const r = await mw(new NextRequest('https://preview.example.com/tr/jilinrime', { headers: { cookie: `ya_cloud_admin=${adminAal2JwtStage}` } }));
    assert.equal(r.status, 200);
    assert.match(r.headers.get('vary') || '', /Cookie/);
    assert.match(r.headers.get('x-robots-tag') || '', /noindex/);
  });

  await checkAsync('staging rejects invalid/basic auth mode with 503', async () => {
    process.env.GASTRONOMY_AUTH_MODE = 'basic';
    assert.equal((await mw(new NextRequest('https://preview.example.com/tr/gastronomi-yonetimi'))).status, 503);
    delete process.env.GASTRONOMY_AUTH_MODE;
    assert.equal((await mw(new NextRequest('https://preview.example.com/tr/gastronomi-yonetimi'))).status, 503);
  });

  // Verify TS wrapper parity in lib/pilot/securityPolicy.ts
  env(base);
  const tsPolicy = load('lib/pilot/securityPolicy.ts');
  check('lib/pilot/securityPolicy.ts parity with supabase-policy.js', () => {
    assert.deepEqual(tsPolicy.configuration(staging), p.configuration(staging));
    assert.equal(tsPolicy.authMode(staging), p.authMode(staging));
  });

  console.log(`PASS ${count} security policy/boundary checks (Auth/RPC checks in this script are unit mocks; PG16 & compiled HTTP verified separately).`);
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
