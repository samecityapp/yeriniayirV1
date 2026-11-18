require('./security/network-lock.cjs');
// Run after `npm run build`: node scripts/verify_p0_security_fixes.cjs
// All DB/Auth checks run strictly against an ephemeral 127.0.0.1 loopback server.
// Child Next build/start processes inherit scripts/security/network-lock.cjs via NODE_OPTIONS.
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const { createRequire } = require('node:module');

const root = process.cwd();
const repoRequire = createRequire(path.join(root, 'package.json'));
const ts = repoRequire('typescript');
const { NextRequest } = repoRequire('next/server');

const REAL_FETCH = global.fetch;
const NETWORK_LOCK_PATH = path.join(root, 'scripts/security/network-lock.cjs');

const ADMIN_ID = '00000000-0000-4000-8000-000000000999';
const NON_ADMIN_ID = '00000000-0000-4000-8000-000000000111';
const REVOKED_ADMIN_ID = '00000000-0000-4000-8000-000000000777';

function makeJwt(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.synthetic-test-sig`;
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

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
      ...(filename.endsWith('.tsx') ? { jsx: ts.JsxEmit.ReactJSX } : {}),
    },
  }).outputText;

  function scopedRequire(id) {
    if (Object.prototype.hasOwnProperty.call(mocks, id)) {
      return mocks[id];
    }
    if (id.startsWith('@/')) {
      const base = path.join(root, id.slice(2));
      for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.js`]) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          if (candidate.endsWith('.ts') || candidate.endsWith('.tsx')) {
            return transpileAndLoad(path.relative(root, candidate), { mocks, clearCache, moduleCache });
          }
          return localRequire(candidate);
        }
      }
    }
    if (id.startsWith('./') || id.startsWith('../')) {
      const resolvedBase = path.resolve(path.dirname(filename), id);
      for (const candidate of [
        resolvedBase,
        `${resolvedBase}.ts`,
        `${resolvedBase}.tsx`,
        `${resolvedBase}.js`,
      ]) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          if (candidate.endsWith('.ts') || candidate.endsWith('.tsx')) {
            return transpileAndLoad(path.relative(root, candidate), { mocks, clearCache, moduleCache });
          }
          return localRequire(candidate);
        }
      }
    }
    return localRequire(id);
  }

  new Function('require', 'module', 'exports', transpiled)(scopedRequire, mod, mod.exports);
  return mod.exports;
}

function makeStatefulSupabaseServer({ serviceRoleSecret, anonKey }) {
  const state = {
    hits: [],
    mutations: [],
    offers: new Map(),
    adminMembers: new Map([
      [ADMIN_ID, true],
      [REVOKED_ADMIN_ID, false],
    ]),
    issuerBase: '',
  };

  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const reqUrl = new URL(req.url, 'http://127.0.0.1');
      const authHeader = String(req.headers.authorization || '');
      const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

      state.hits.push({
        method: req.method,
        url: req.url,
        authorization: authHeader,
        apikey: req.headers.apikey || '',
        body,
      });

      const json = (status, data) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      };

      // Password sign-in (issues aal1 token only)
      if (reqUrl.pathname === '/auth/v1/token' && reqUrl.searchParams.get('grant_type') === 'password') {
        const parsed = body ? JSON.parse(body) : {};
        if (parsed.email === 'admin@yeriniayir.invalid' && parsed.password === 'correct-password-123') {
          const token = makeJwt({
            sub: ADMIN_ID,
            role: 'authenticated',
            aal: 'aal1',
            iss: `${state.issuerBase}/auth/v1`,
          });
          return json(200, {
            access_token: token,
            refresh_token: 'synthetic-refresh-token-aal1',
            token_type: 'bearer',
            expires_in: 300,
            expires_at: Math.floor(Date.now() / 1000) + 300,
            user: {
              id: ADMIN_ID,
              aud: 'authenticated',
              role: 'authenticated',
              email: 'admin@yeriniayir.invalid',
              email_confirmed_at: '2026-11-01T00:00:00Z',
              is_anonymous: false,
              factors: [
                { id: 'factor-totp-1', factor_type: 'totp', friendly_name: 'Admin TOTP', status: 'verified' },
              ],
            },
          });
        }
        return json(400, { error: 'invalid_grant', error_description: 'Invalid login credentials' });
      }

      if (reqUrl.pathname === '/auth/v1/factors') {
        const payload = decodeJwtPayload(bearer);
        if (!payload?.sub) return json(401, { message: 'Invalid JWT' });
        if (req.method === 'GET') {
          return json(200, [
            { id: 'factor-totp-1', factor_type: 'totp', friendly_name: 'Admin TOTP', status: 'verified' },
          ]);
        }
      }

      if (reqUrl.pathname === '/auth/v1/factors/factor-totp-1/challenge' && req.method === 'POST') {
        const payload = decodeJwtPayload(bearer);
        if (!payload?.sub) return json(401, { message: 'Invalid JWT' });
        return json(200, { id: 'challenge-1', expires_at: Math.floor(Date.now() / 1000) + 300 });
      }

      if (reqUrl.pathname === '/auth/v1/factors/factor-totp-1/verify' && req.method === 'POST') {
        const payload = decodeJwtPayload(bearer);
        if (!payload?.sub) return json(401, { message: 'Invalid JWT' });
        const parsed = body ? JSON.parse(body) : {};
        if (parsed.code !== '123456') {
          return json(422, { message: 'Invalid TOTP code' });
        }
        const aal2 = makeJwt({
          sub: payload.sub,
          role: 'authenticated',
          aal: 'aal2',
          iss: `${state.issuerBase}/auth/v1`,
        });
        return json(200, {
          access_token: aal2,
          refresh_token: 'synthetic-refresh-token-aal2',
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: {
            id: payload.sub,
            aud: 'authenticated',
            role: 'authenticated',
            email_confirmed_at: '2026-11-01T00:00:00Z',
            is_anonymous: false,
          },
        });
      }

      if (reqUrl.pathname === '/auth/v1/user') {
        const payload = decodeJwtPayload(bearer);
        if (!payload || !payload.sub) {
          return json(401, { message: 'Invalid JWT' });
        }
        return json(200, {
          id: payload.sub,
          aud: 'authenticated',
          role: 'authenticated',
          is_anonymous: false,
          email: `${payload.sub}@example.invalid`,
          email_confirmed_at: '2026-11-01T00:00:00Z',
          factors: [
            { id: 'factor-totp-1', factor_type: 'totp', friendly_name: 'Admin TOTP', status: 'verified' },
          ],
        });
      }

      if (reqUrl.pathname === '/rest/v1/rpc/ya_has_membership') {
        const payload = decodeJwtPayload(bearer);
        return json(200, Boolean(payload?.sub && state.adminMembers.get(payload.sub) === true));
      }

      if (reqUrl.pathname === '/rest/v1/rpc/ya_is_admin') {
        const payload = decodeJwtPayload(bearer);
        const allowed = Boolean(
          payload &&
            payload.aal === 'aal2' &&
            payload.sub &&
            state.adminMembers.get(payload.sub) === true
        );
        return json(200, allowed);
      }

      if (reqUrl.pathname === '/rest/v1/offers') {
        const accept = String(req.headers.accept || '');
        const wantsSingle = accept.includes('vnd.pgrst.object+json');
        const idEq = reqUrl.searchParams.get('id')?.replace(/^eq\./, '') || null;
        const slugEq = reqUrl.searchParams.get('slug')?.replace(/^eq\./, '') || null;

        if (req.method === 'GET') {
          let rows = Array.from(state.offers.values());
          if (idEq) rows = rows.filter((r) => r.id === idEq);
          if (slugEq) rows = rows.filter((r) => r.slug === slugEq);
          rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
          const limit = reqUrl.searchParams.get('limit');
          if (limit) rows = rows.slice(0, Number(limit));

          if (wantsSingle) {
            if (rows.length !== 1) {
              return json(406, { code: 'PGRST116', message: 'Cannot coerce the result to a single JSON object' });
            }
            return json(200, rows[0]);
          }
          return json(200, rows);
        }

        // Writes require valid service_role bearer! Reject anon/user writes like Supabase RLS.
        if (bearer !== serviceRoleSecret) {
          return json(403, { code: '42501', message: 'new row violates row-level security policy for table "offers"' });
        }

        if (req.method === 'POST') {
          const parsed = JSON.parse(body);
          const input = Array.isArray(parsed) ? parsed[0] : parsed;
          if (Array.from(state.offers.values()).some((r) => r.slug === input.slug)) {
            return json(409, { code: '23505', message: 'duplicate key value violates unique constraint' });
          }
          const id = crypto.randomUUID();
          const now = new Date().toISOString();
          const row = {
            id,
            hotel_name: input.hotel_name,
            slug: input.slug,
            price: input.price,
            currency: input.currency || 'TL',
            region: input.region,
            promo_text: input.promo_text || '',
            included_items: input.included_items ?? [],
            created_at: now,
            updated_at: now,
          };
          state.offers.set(id, row);
          state.mutations.push({ op: 'INSERT', id, slug: row.slug });
          return json(201, wantsSingle ? row : [row]);
        }

        if (req.method === 'PATCH') {
          if (!idEq || !state.offers.has(idEq)) {
            return json(406, { code: 'PGRST116', message: 'Row not found' });
          }
          const existing = state.offers.get(idEq);
          const patch = JSON.parse(body);
          const updated = { ...existing, ...patch, id: existing.id };
          state.offers.set(idEq, updated);
          state.mutations.push({ op: 'UPDATE', id: idEq, fromSlug: existing.slug, toSlug: updated.slug });
          return json(200, wantsSingle ? updated : [updated]);
        }

        if (req.method === 'DELETE') {
          const existing = idEq ? state.offers.get(idEq) : null;
          if (idEq) state.offers.delete(idEq);
          state.mutations.push({ op: 'DELETE', id: idEq, slug: existing?.slug || null });
          if (wantsSingle) {
            return json(200, existing ? { slug: existing.slug } : null);
          }
          return json(200, existing ? [{ slug: existing.slug }] : []);
        }
      }

      if (reqUrl.pathname.startsWith('/rest/v1/') && req.method === 'GET') {
        // Non-offer public tables queried during Next build (e.g. sitemap.xml): empty array, never mocks.
        return json(200, []);
      }

      return json(404, { error: 'Unexpected endpoint in test Supabase backend: ' + req.url });
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

function makeFlightActionFormData(boundArgsPrefix, fields) {
  // React 19 / Next 15 Flight encodeReply format:
  // inner FormData keys `_1_<key>` precede `'0': '["$K1"]'` or `'0': '["<id>","$K1"]'`.
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    fd.set(`_1_${k}`, v);
  }
  fd.set('0', JSON.stringify([...boundArgsPrefix, '$K1']));
  return fd;
}

async function startNextServer({ port, cwd, env }) {
  return new Promise((resolve, reject) => {
    const srv = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
      cwd,
      env: {
        ...env,
        NODE_OPTIONS: `--require ${NETWORK_LOCK_PATH}`,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let logs = '';
    const onData = (chunk) => {
      const s = String(chunk);
      logs += s;
      if (s.includes('Ready')) {
        clearTimeout(timer);
        resolve(srv);
      }
    };
    srv.stdout.on('data', onData);
    srv.stderr.on('data', onData);
    srv.on('exit', (code) => {
      if (code !== null && code !== 0) {
        clearTimeout(timer);
        reject(new Error(`Next start exited with ${code}:\n${logs}`));
      }
    });
    const timer = setTimeout(() => {
      srv.kill('SIGTERM');
      reject(new Error(`Next server startup timeout:\n${logs}`));
    }, 20000);
  });
}

function clearPolicyEnv() {
  for (const k of Object.keys(process.env)) {
    if (/^(VERCEL|NEXT_PUBLIC_|APP_ENVIRONMENT|GASTRONOMY_|SUPABASE_|NODE_ENV|ADMIN_|ALLOW_DEMO_OFFER_FALLBACK)/.test(k)) {
      delete process.env[k];
    }
  }
}

function parseActionJsonResult(rawText) {
  // Next Flight responses emit chunk 0 (metadata {"a":"$@1",...}) before chunk 1 (action return value).
  for (const line of rawText.split('\n')) {
    const idx = line.indexOf('{');
    if (idx >= 0) {
      try {
        const parsed = JSON.parse(line.slice(idx));
        if (parsed && typeof parsed === 'object' && typeof parsed.success === 'boolean') {
          return parsed;
        }
      } catch {
        // continue searching chunks
      }
    }
  }
  return null;
}

async function run() {
  const savedEnv = { ...process.env };
  const tsconfigPath = path.join(root, 'tsconfig.json');
  const savedTsconfig = fs.existsSync(tsconfigPath) ? fs.readFileSync(tsconfigPath, 'utf8') : null;
  const anonKey = 'dummy-anon-key-only';
  const serviceKey = makeJwt({ role: 'service_role', ref: 'local' });
  const { server: mockServer, state } = makeStatefulSupabaseServer({
    serviceRoleSecret: serviceKey,
    anonKey,
  });

  await new Promise((resolve) => mockServer.listen(0, '127.0.0.1', resolve));
  const port = mockServer.address().port;
  const loopbackUrl = `http://127.0.0.1:${port}`;
  state.issuerBase = loopbackUrl;

  const adminAal2Jwt = makeJwt({
    sub: ADMIN_ID,
    role: 'authenticated',
    aal: 'aal2',
    iss: `${loopbackUrl}/auth/v1`,
  });
  const adminAal1Jwt = makeJwt({
    sub: ADMIN_ID,
    role: 'authenticated',
    aal: 'aal1',
    iss: `${loopbackUrl}/auth/v1`,
  });
  const nonAdminAal2Jwt = makeJwt({
    sub: NON_ADMIN_ID,
    role: 'authenticated',
    aal: 'aal2',
    iss: `${loopbackUrl}/auth/v1`,
  });
  const revokedAdminAal2Jwt = makeJwt({
    sub: REVOKED_ADMIN_ID,
    role: 'authenticated',
    aal: 'aal2',
    iss: `${loopbackUrl}/auth/v1`,
  });

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
      revalidatePath: (p, t) => revalidatedPaths.push({ path: p, type: t }),
      revalidateTag: () => {},
    },
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
  };

  const tempDistDir = '.next-p0-http';

  try {
    clearPolicyEnv();
    process.env.NODE_ENV = 'test';
    process.env.APP_ENVIRONMENT = 'test';
    process.env.GASTRONOMY_AUTH_MODE = 'basic';
    process.env.ADMIN_USER = 'pilot-admin';
    process.env.ADMIN_PASSWORD = 'isolated-test-admin-password-32ch';
    process.env.NEXT_PUBLIC_SUPABASE_URL = loopbackUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey;
    process.env.SUPABASE_SERVICE_ROLE_KEY = serviceKey;

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
    const fakeUuid = '22222222-2222-4222-8222-222222222222';

    // =========================================================================
    // TEST GROUP A: Anonim + Fail-Closed Auth Mode / Env Guards
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

    await check('Group A.3: middleware and actions fail closed (503) on invalid/missing GASTRONOMY_AUTH_MODE (never Basic fallback)', async () => {
      const savedMode = process.env.GASTRONOMY_AUTH_MODE;
      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
        authorization: validBasic,
      });
      for (const badMode of [undefined, '', 'SUPABASE', 'oidc']) {
        if (badMode === undefined) delete process.env.GASTRONOMY_AUTH_MODE;
        else process.env.GASTRONOMY_AUTH_MODE = badMode;

        const mwRes = await middleware(
          new NextRequest('http://localhost:3000/tr/jilinrime/teklif-yonetimi', {
            headers: { authorization: validBasic },
          })
        );
        assert.equal(mwRes.status, 503);

        const actRes = await actions.createOffer(makeOfferFormData());
        assert.equal(actRes.success, false);
        assert.equal(actRes.status, 503);
      }
      process.env.GASTRONOMY_AUTH_MODE = savedMode;
    });

    await check('Group A.4: middleware fails closed (503) when ADMIN_PASSWORD is missing', async () => {
      const savedPwd = process.env.ADMIN_PASSWORD;
      delete process.env.ADMIN_PASSWORD;
      const res = await middleware(new NextRequest('http://localhost:3000/tr/jilinrime/teklif-yonetimi'));
      assert.equal(res.status, 503);
      process.env.ADMIN_PASSWORD = savedPwd;
    });

    await check('Group A.5: Anonymous createOffer/updateOffer/deleteOffer rejected (401, 0 DB hits)', async () => {
      state.hits.length = 0;
      currentCookies = new Map();
      currentHeaders = new Headers({ host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000' });

      const r1 = await actions.createOffer(makeOfferFormData());
      const r2 = await actions.updateOffer(fakeUuid, makeOfferFormData());
      const r3 = await actions.deleteOffer(fakeUuid);
      assert.equal(r1.status, 401);
      assert.equal(r2.status, 401);
      assert.equal(r3.status, 401);
      assert.equal(state.hits.length, 0);
    });

    await check('Group A.6: Direct lib/offers calls throw SECURITY VIOLATION without capability', async () => {
      await assert.rejects(() => offers.getAll(null), /SECURITY VIOLATION/);
      await assert.rejects(() => offers.create({}, { hotel_name: 'X', slug: 'x', price: '1', currency: 'TL', region: 'Y' }), /SECURITY VIOLATION/);
      await assert.rejects(() => offers.update({}, fakeUuid, { price: '2' }), /SECURITY VIOLATION/);
      await assert.rejects(() => offers.delete({}, fakeUuid), /SECURITY VIOLATION/);
    });

    // =========================================================================
    // TEST GROUP B: Non-admin Users, Retired Basic in Cloud, aal1 vs aal2, Revoked
    // =========================================================================
    await check('Group B.1: Basic mode rejects Bearer JWT & sb-user cookie (403) and wrong Basic (401)', async () => {
      state.hits.length = 0;
      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
        authorization: 'Bearer user-jwt-token',
      });
      assert.equal((await actions.createOffer(makeOfferFormData())).status, 403);

      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
        cookie: 'sb-project-auth-token=normal-user-session',
      });
      assert.equal((await actions.deleteOffer(fakeUuid)).status, 403);

      currentHeaders = new Headers({
        host: '127.0.0.1:3000',
        origin: 'http://127.0.0.1:3000',
        authorization: wrongBasic,
      });
      assert.equal((await actions.updateOffer(fakeUuid, makeOfferFormData())).status, 401);
      assert.equal(state.hits.length, 0);
    });

    // Switch to Cloud MFA mode pointing both Cloud Auth and Data target to bound local test server
    process.env.GASTRONOMY_AUTH_MODE = 'supabase';
    process.env.GASTRONOMY_CLOUD_ENV = 'local';
    process.env.GASTRONOMY_SUPABASE_REF = 'local';
    process.env.GASTRONOMY_SUPABASE_URL = loopbackUrl;
    process.env.GASTRONOMY_SUPABASE_ANON_KEY = anonKey;

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
      assert.equal((await actions.createOffer(makeOfferFormData())).status, 401);
      assert.equal((await actions.deleteOffer(fakeUuid)).status, 401);
      assert.equal(state.hits.length, 0);
    });

    await check('Group B.3: Cloud MFA mode denies BOTH pending aal1 cookie AND aal1 JWT placed inside ya_cloud_admin (403)', async () => {
      state.hits.length = 0;
      currentCookies = new Map([['ya_cloud_pending', adminAal1Jwt]]);
      currentHeaders = new Headers({ host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000' });
      assert.equal((await actions.deleteOffer(fakeUuid)).status, 403);

      // Put genuine active-admin aal1 JWT inside ya_cloud_admin cookie directly: MUST fail at Node guard BEFORE offers write!
      currentCookies = new Map([['ya_cloud_admin', adminAal1Jwt]]);
      assert.equal((await actions.createOffer(makeOfferFormData())).status, 403);
      assert.equal((await middleware(new NextRequest('http://127.0.0.1:3000/tr/jilinrime', { headers: { cookie: `ya_cloud_admin=${adminAal1Jwt}` } }))).status, 403);
      assert.equal(state.hits.filter((h) => h.url.includes('/rest/v1/offers')).length, 0);
    });

    await check('Group B.4: Cloud MFA mode denies non-admin aal2 user AND revoked active=false admin (403, 0 mutations)', async () => {
      state.mutations.length = 0;
      for (const jwt of [nonAdminAal2Jwt, revokedAdminAal2Jwt]) {
        currentCookies = new Map([['ya_cloud_admin', jwt]]);
        currentHeaders = new Headers({ host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000' });
        assert.equal((await actions.createOffer(makeOfferFormData())).status, 403);
        assert.equal((await actions.updateOffer(fakeUuid, makeOfferFormData())).status, 403);
        assert.equal((await actions.deleteOffer(fakeUuid)).status, 403);
      }
      assert.equal(state.mutations.length, 0);
    });

    // =========================================================================
    // TEST GROUP C & D: CSRF, Authenticated CRUD, Multi-Locale Old/New Revalidation, Anon Read
    // =========================================================================
    await check('Group C.1: Cross-origin / missing Origin / sec-fetch-site=cross-site rejected (403) even for valid aal2 admin', async () => {
      state.mutations.length = 0;
      currentCookies = new Map([['ya_cloud_admin', adminAal2Jwt]]);
      for (const badHeaders of [
        { host: 'www.yeriniayir.com', origin: 'https://evil.example' },
        { host: '127.0.0.1:3000', origin: 'http://127.0.0.1:4000' },
        { host: 'www.yeriniayir.com', origin: 'http://www.yeriniayir.com' },
        { host: 'www.yeriniayir.com' },
        { host: 'www.yeriniayir.com', origin: 'https://www.yeriniayir.com', 'sec-fetch-site': 'cross-site' },
      ]) {
        currentHeaders = new Headers(badHeaders);
        assert.equal((await actions.deleteOffer(fakeUuid)).status, 403);
      }
      assert.equal(state.mutations.length, 0);
    });

    await check('Group C.2: Authorized aal2 Cloud Admin creates, renames slug (invalidating OLD+NEW TR/EN/EL), and deletes cleanly', async () => {
      state.offers.clear();
      state.mutations.length = 0;
      revalidatedPaths.length = 0;
      currentCookies = new Map([['ya_cloud_admin', adminAal2Jwt]]);
      currentHeaders = new Headers({ host: 'www.yeriniayir.com', origin: 'https://www.yeriniayir.com' });

      const rCreate = await actions.createOffer(makeOfferFormData({ slug: 'old-hotel-slug', hotel_name: 'Old Name' }));
      assert.deepEqual(rCreate, { success: true });
      const createdRow = Array.from(state.offers.values())[0];
      assert.ok(createdRow);

      revalidatedPaths.length = 0;
      const rUpdate = await actions.updateOffer(createdRow.id, makeOfferFormData({ slug: 'new-hotel-slug', hotel_name: 'New Name' }));
      assert.deepEqual(rUpdate, { success: true });
      for (const lang of ['tr', 'en', 'el']) {
        assert.ok(revalidatedPaths.some((p) => p.path === `/${lang}/old-hotel-slug`), `Must revalidate /${lang}/old-hotel-slug`);
        assert.ok(revalidatedPaths.some((p) => p.path === `/${lang}/new-hotel-slug`), `Must revalidate /${lang}/new-hotel-slug`);
        assert.ok(revalidatedPaths.some((p) => p.path === `/${lang}/jilinrime/teklif-yonetimi` && p.type === 'page'));
      }

      revalidatedPaths.length = 0;
      const rDelete = await actions.deleteOffer(createdRow.id);
      assert.deepEqual(rDelete, { success: true });
      for (const lang of ['tr', 'en', 'el']) {
        assert.ok(revalidatedPaths.some((p) => p.path === `/${lang}/new-hotel-slug`), `Delete must revalidate /${lang}/new-hotel-slug`);
        assert.ok(revalidatedPaths.some((p) => p.path === `/${lang}/jilinrime/teklif-yonetimi` && p.type === 'page'));
      }
      assert.equal(state.offers.size, 0);
    });

    await check('Group C.3: Authorized Admin cannot inject SSRF/traversal slugs, malformed JSON, or invalid UUID', async () => {
      state.mutations.length = 0;
      for (const badSlug of ['../api/go?hotelId=1', 'http://169.254.169.254/latest', 'slug/with/slash', 'SlugWithCaps']) {
        assert.equal((await actions.createOffer(makeOfferFormData({ slug: badSlug }))).status, 400);
      }
      assert.equal((await actions.createOffer(makeOfferFormData({ included_items: '{bad' }))).status, 400);
      assert.equal((await actions.deleteOffer('not-a-uuid')).status, 400);
      assert.equal(state.mutations.length, 0);
    });

    await check('Group D: offers.getBySlug uses anon key only and no phantom luvicavehotel-teklif fallback in default mode', async () => {
      state.hits.length = 0;
      assert.equal(await offers.getBySlug('../secret?x=1'), null);
      assert.equal(state.hits.length, 0);

      assert.equal(await offers.getBySlug('luvicavehotel-teklif'), null);

      const seededId = crypto.randomUUID();
      state.offers.set(seededId, {
        id: seededId,
        slug: 'gercek-kayit',
        hotel_name: 'Gerçek Otel',
        price: '12.000',
        currency: 'TL',
        region: 'Bodrum',
        promo_text: '',
        included_items: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      const hit = await offers.getBySlug('gercek-kayit');
      assert.equal(hit?.hotel_name, 'Gerçek Otel');
      assert.equal(state.hits[state.hits.length - 1].apikey, anonKey);
      assert.equal(state.hits[state.hits.length - 1].authorization, `Bearer ${anonKey}`);
      state.offers.clear();
    });

    // =========================================================================
    // TEST GROUP E: Fail-Closed Isolation + Cross-Project Binding + Build Policy
    // =========================================================================
    for (const prodUrl of [
      'https://jerkkxwgddujigsbeqwo.supabase.co',
      'https://aknhkpevrlpsrfxzqtop.supabase.co',
    ]) {
      await check(`Group E.1: Preview blocks all reads & writes targeting ${prodUrl} (even with trailing dot!) with 0 sockets`, async () => {
        for (const variant of [prodUrl, `${prodUrl}.`]) {
          clearPolicyEnv();
          process.env.NODE_ENV = 'production';
          process.env.VERCEL = '1';
          process.env.VERCEL_ENV = 'preview';
          process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
          process.env.APP_ENVIRONMENT = 'preview';
          process.env.GASTRONOMY_AUTH_MODE = 'supabase';
          process.env.NEXT_PUBLIC_SUPABASE_URL = variant;
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'dummy-prod-anon-key';
          process.env.SUPABASE_SERVICE_ROLE_KEY = makeJwt({ role: 'service_role', ref: 'jerkkxwgddujigsbeqwo' });

          const isolatedCache = new Map();
          const savedFetch = global.fetch;
          global.fetch = async (url) => {
            throw new Error(`SECURITY FAILURE: Isolated client called fetch for ${url}`);
          };
          try {
            const guardMod = transpileAndLoad('lib/supabase-env-guard.ts', { clearCache: true, moduleCache: isolatedCache });
            const pubMod = transpileAndLoad('lib/supabase.ts', { clearCache: true, moduleCache: isolatedCache });
            const admMod = transpileAndLoad('lib/supabase-admin.ts', { clearCache: true, moduleCache: isolatedCache });

            assert.equal(guardMod.isNonProductionRuntime(), true);
            assert.equal(guardMod.getAllowedPublicSupabaseOrigin(variant), null);
            assert.equal(pubMod.isSupabaseIsolated, true);
            assert.equal(admMod.isServiceRoleBlockedByIsolation, true);
            assert.equal(admMod.hasServiceRoleKey, false);
            assert.throws(
              () => admMod.assertSupabaseAdminReady(),
              /SECURITY BLOCK|Supabase security configuration rejected/
            );

            assert.equal((await pubMod.supabase.from('offers').select('*').limit(1)).error?.code, 'YA_SUPABASE_ENV_ISOLATION_BLOCKED');
            assert.equal((await admMod.supabaseAdmin.from('offers').delete().eq('id', fakeUuid)).error?.code, 'YA_SUPABASE_ENV_ISOLATION_BLOCKED');
          } finally {
            global.fetch = savedFetch;
          }
        }
      });
    }

    await check('Group E.2: next.config.js isolates preview builds and throws hard on misconfigured production builds', async () => {
      clearPolicyEnv();
      process.env.VERCEL = '1';
      process.env.VERCEL_ENV = 'preview';
      process.env.APP_ENVIRONMENT = 'preview';
      process.env.GASTRONOMY_AUTH_MODE = 'supabase';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://jerkkxwgddujigsbeqwo.supabase.co';
      delete require.cache[require.resolve(path.join(root, 'next.config.js'))];
      const previewCfg = require(path.join(root, 'next.config.js'));
      assert.equal(previewCfg.env?.NEXT_PUBLIC_SUPABASE_POLICY, 'ISOLATED');
      assert.equal(previewCfg.env?.NEXT_PUBLIC_SUPABASE_URL, 'https://isolated-preview-blocked.invalid');

      clearPolicyEnv();
      process.env.VERCEL = '1';
      process.env.VERCEL_ENV = 'production';
      process.env.APP_ENVIRONMENT = 'staging'; // conflict!
      process.env.GASTRONOMY_AUTH_MODE = 'supabase';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://jerkkxwgddujigsbeqwo.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = makeJwt({ role: 'anon' });
      delete require.cache[require.resolve(path.join(root, 'next.config.js'))];
      assert.throws(() => require(path.join(root, 'next.config.js')));
    });

    await check('Group E.3: Cross-project staging Cloud Auth + production offers target strictly rejected', async () => {
      clearPolicyEnv();
      process.env.NODE_ENV = 'production';
      process.env.VERCEL = '1';
      process.env.VERCEL_ENV = 'production';
      process.env.APP_ENVIRONMENT = 'production';
      process.env.SUPABASE_PRODUCTION_AUTHORIZED = '1';
      process.env.GASTRONOMY_PRODUCTION_AUTHORIZED = '1';
      process.env.GASTRONOMY_AUTH_MODE = 'supabase';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://jerkkxwgddujigsbeqwo.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = makeJwt({ role: 'anon' });
      process.env.GASTRONOMY_CLOUD_ENV = 'staging';
      process.env.GASTRONOMY_SUPABASE_REF = 'vhptlecaixpawtxnhsde';
      process.env.GASTRONOMY_SUPABASE_URL = 'https://vhptlecaixpawtxnhsde.supabase.co';
      process.env.GASTRONOMY_SUPABASE_ANON_KEY = makeJwt({ role: 'anon' });

      const cloudCfg = transpileAndLoad('lib/cloud/config.ts', { clearCache: true });
      assert.throws(() => cloudCfg.cloudConfig(), /trust boundary rejected|Supabase security configuration rejected/);

      // Also test when GASTRONOMY_CLOUD_ENV matches 'production' but Cloud URL points to staging ref!
      process.env.GASTRONOMY_CLOUD_ENV = 'production';
      assert.throws(() => cloudCfg.cloudConfig(), /trust boundary rejected|Supabase security configuration rejected/);
    });

    // =========================================================================
    // TEST GROUP F: Built Manifest (NO SKIP) + Socket-Locked Compiled HTTP E2E
    // =========================================================================
    await check('Group F.1: No warmup SSRF fetch and .next server-reference-manifest is built & clean', async () => {
      const actionsSrc = fs.readFileSync(path.join(root, 'app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts'), 'utf8');
      const managerSrc = fs.readFileSync(path.join(root, 'app/[lang]/(admin)/jilinrime/teklif-yonetimi/OfferManager.tsx'), 'utf8');
      assert.doesNotMatch(actionsSrc, /fetch\s*\(/);
      assert.doesNotMatch(managerSrc, /fetch\s*\(\s*`\$\{checkUrl\}/);
      assert.doesNotMatch(managerSrc, /const checkUrl\s*=\s*`https:\/\/www\.yeriniayir\.com\/tr\//);

      const manifestPath = path.join(root, '.next/server/server-reference-manifest.json');
      assert.ok(fs.existsSync(manifestPath), 'FAIL: .next/server/server-reference-manifest.json must exist (npm run build required, skipping forbidden)');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const exportedNames = new Set(Object.values(manifest.node || {}).map((e) => e.exportedName));
      assert.equal(exportedNames.has('getOffers'), false);
      assert.equal(exportedNames.has('createOffer'), true);
      assert.equal(exportedNames.has('updateOffer'), true);
      assert.equal(exportedNames.has('deleteOffer'), true);
    });

    await check('Group F.2: Compiled .next server enforces Staging+Cloud MFA gate, Preview Isolation, and no zombie fallback under socket egress lock', async () => {
      const manifest = JSON.parse(fs.readFileSync(path.join(root, '.next/server/server-reference-manifest.json'), 'utf8'));
      const deleteEntry = Object.entries(manifest.node || {}).find(([, v]) => v.exportedName === 'deleteOffer');
      assert.ok(deleteEntry);

      // 1) Staging + Cloud MFA entry gate check (isolated child next start with network-lock.cjs)
      const stagingPort = 3320;
      const stagingSrv = await startNextServer({
        port: stagingPort,
        cwd: root,
        env: {
          ...savedEnv,
          NODE_ENV: 'production',
          VERCEL: '1',
          VERCEL_ENV: 'preview',
          NEXT_PUBLIC_VERCEL_ENV: 'preview',
          APP_ENVIRONMENT: 'staging',
          GASTRONOMY_AUTH_MODE: 'supabase',
          NEXT_PUBLIC_SUPABASE_URL: 'https://vhptlecaixpawtxnhsde.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: makeJwt({ role: 'anon' }),
          GASTRONOMY_CLOUD_ENV: 'staging',
          GASTRONOMY_SUPABASE_REF: 'vhptlecaixpawtxnhsde',
          GASTRONOMY_SUPABASE_URL: 'https://vhptlecaixpawtxnhsde.supabase.co',
          GASTRONOMY_SUPABASE_ANON_KEY: makeJwt({ role: 'anon' }),
        },
      });
      try {
        const anonHome = await REAL_FETCH(`http://127.0.0.1:${stagingPort}/tr`);
        assert.equal(anonHome.status, 401);
        assert.match(anonHome.headers.get('cache-control') || '', /private, no-store/);
        assert.match(anonHome.headers.get('x-robots-tag') || '', /noindex/);

        const anonRegionApi = await REAL_FETCH(`http://127.0.0.1:${stagingPort}/api/gastronomy/regions/moda`);
        assert.equal(anonRegionApi.status, 401);
        assert.match(anonRegionApi.headers.get('cache-control') || '', /private, no-store/);
        assert.match(anonRegionApi.headers.get('x-robots-tag') || '', /noindex/);

        const anonJson = await REAL_FETCH(`http://127.0.0.1:${stagingPort}/tr/jilinrime/teklif-yonetimi`);
        assert.equal(anonJson.status, 401);

        const loginPage = await REAL_FETCH(`http://127.0.0.1:${stagingPort}/tr/gastronomi-yonetimi`);
        assert.equal(loginPage.status, 200);
        assert.match(loginPage.headers.get('cache-control') || '', /private, no-store/);
        assert.match(loginPage.headers.get('x-robots-tag') || '', /noindex/);

        // No luvicavehotel zombie under default Preview/Isolated mode!
        const postRetired = await REAL_FETCH(`http://127.0.0.1:${stagingPort}/tr/jilinrime/teklif-yonetimi`, {
          method: 'POST',
          headers: {
            Host: `127.0.0.1:${stagingPort}`,
            Origin: `http://127.0.0.1:${stagingPort}`,
            Authorization: validBasic,
            'Next-Action': deleteEntry[0],
            'Content-Type': 'text/plain;charset=UTF-8',
          },
          body: JSON.stringify([fakeUuid]),
        });
        assert.equal(postRetired.status, 401);
      } finally {
        stagingSrv.kill('SIGTERM');
      }
    });

    await check('Group F.3: Socket-locked compiled Next.js real HTTP CRUD, MFA login, aal1/revoked rejection, and old/new slug cache invalidation', async () => {
      state.offers.clear();
      state.mutations.length = 0;

      const buildEnv = {
        ...savedEnv,
        NODE_ENV: 'production',
        NEXT_DIST_DIR: tempDistDir,
        APP_ENVIRONMENT: 'test',
        GASTRONOMY_AUTH_MODE: 'supabase',
        GASTRONOMY_CLOUD_ENV: 'local',
        GASTRONOMY_SUPABASE_REF: 'local',
        GASTRONOMY_SUPABASE_URL: loopbackUrl,
        GASTRONOMY_SUPABASE_ANON_KEY: anonKey,
        NEXT_PUBLIC_SUPABASE_URL: loopbackUrl,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
        SUPABASE_SERVICE_ROLE_KEY: serviceKey,
      };
      delete buildEnv.NODE_OPTIONS;
      // Note: next build downloads next/font/google CSS; runtime server starts with OS socket lock below.
      delete buildEnv.VERCEL;
      delete buildEnv.VERCEL_ENV;
      delete buildEnv.NEXT_PUBLIC_VERCEL_ENV;
      delete buildEnv.GASTRONOMY_LOCAL_PREVIEW;

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
          reject(new Error(`next build exited ${code}:\nSTDOUT TAIL:\n${out.slice(-2000)}\nSTDERR TAIL:\n${err.slice(-2000)}`));
        });
      });

      const testManifest = JSON.parse(
        fs.readFileSync(path.join(root, tempDistDir, 'server/server-reference-manifest.json'), 'utf8')
      );
      const findActionId = (name) => {
        const entry = Object.entries(testManifest.node || {}).find(([, v]) => v.exportedName === name);
        assert.ok(entry, `Action ${name} must exist in compiled manifest`);
        return entry[0];
      };
      const createActionId = findActionId('createOffer');
      const updateActionId = findActionId('updateOffer');
      const deleteActionId = findActionId('deleteOffer');

      const httpPort = 3321;
      const srv = await startNextServer({
        port: httpPort,
        cwd: root,
        env: buildEnv,
      });

      try {
        const base = `http://127.0.0.1:${httpPort}`;

        // 1) Real /api/gastronomy-admin/login -> aal1 pending -> wrong code rejected -> right code sets ya_cloud_admin aal2 cookie
        const step1 = await REAL_FETCH(`${base}/api/gastronomy-admin/login`, {
          method: 'POST',
          headers: {
            Host: `127.0.0.1:${httpPort}`,
            Origin: base,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'login', email: 'admin@yeriniayir.invalid', password: 'correct-password-123' }),
        });
        assert.equal(step1.status, 200);
        const step1Json = await step1.json();
        assert.equal(step1Json.step, 'verify');
        const pendingCookie = (step1.headers.get('set-cookie') || '').match(/ya_cloud_pending=([^;]+)/)?.[1];
        assert.ok(pendingCookie, 'Login step 1 must issue ya_cloud_pending cookie');

        const step2Bad = await REAL_FETCH(`${base}/api/gastronomy-admin/login`, {
          method: 'POST',
          headers: {
            Host: `127.0.0.1:${httpPort}`,
            Origin: base,
            Cookie: `ya_cloud_pending=${pendingCookie}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'verify', code: '000000' }),
        });
        assert.equal(step2Bad.status, 401);

        const step2Ok = await REAL_FETCH(`${base}/api/gastronomy-admin/login`, {
          method: 'POST',
          headers: {
            Host: `127.0.0.1:${httpPort}`,
            Origin: base,
            Cookie: `ya_cloud_pending=${pendingCookie}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'verify', code: '123456' }),
        });
        assert.equal(step2Ok.status, 200);
        const adminCookie = (step2Ok.headers.get('set-cookie') || '').match(/ya_cloud_admin=([^;]+)/)?.[1];
        assert.ok(adminCookie, 'Login step 2 must issue ya_cloud_admin cookie');

        const postAction = async ({ actionId, body, headers = {} }) =>
          REAL_FETCH(`${base}/tr/jilinrime/teklif-yonetimi`, {
            method: 'POST',
            headers: {
              Host: `127.0.0.1:${httpPort}`,
              Origin: base,
              'Next-Action': actionId,
              ...headers,
            },
            body,
          });

        // 2) Negative HTTP Server Action attempts (anon, aal1 in admin cookie, non-admin, revoked admin, CSRF) -> 0 mutations!
        const aal1Attempt = await postAction({
          actionId: createActionId,
          headers: { Cookie: `ya_cloud_admin=${pendingCookie}` },
          body: makeFlightActionFormData([], {
            hotel_name: 'Attack',
            slug: 'attack-slug',
            price: '1',
            currency: 'TL',
            region: 'X',
            promo_text: '',
            included_items: '[]',
          }),
        });
        const aal1Body = await aal1Attempt.text();
        assert.ok(aal1Attempt.status === 403 || parseActionJsonResult(aal1Body)?.status === 403);

        const nonAdminAttempt = await postAction({
          actionId: createActionId,
          headers: { Cookie: `ya_cloud_admin=${nonAdminAal2Jwt}` },
          body: makeFlightActionFormData([], {
            hotel_name: 'NonAdmin',
            slug: 'nonadmin-slug',
            price: '1',
            currency: 'TL',
            region: 'X',
            promo_text: '',
            included_items: '[]',
          }),
        });
        const nonAdminText = await nonAdminAttempt.text();
        assert.ok(nonAdminAttempt.status === 403 || parseActionJsonResult(nonAdminText)?.status === 403);

        const revokedAttempt = await postAction({
          actionId: createActionId,
          headers: { Cookie: `ya_cloud_admin=${revokedAdminAal2Jwt}` },
          body: makeFlightActionFormData([], {
            hotel_name: 'Revoked',
            slug: 'revoked-slug',
            price: '1',
            currency: 'TL',
            region: 'X',
            promo_text: '',
            included_items: '[]',
          }),
        });
        const revokedText = await revokedAttempt.text();
        assert.ok(revokedAttempt.status === 403 || parseActionJsonResult(revokedText)?.status === 403);

        const csrfAttempt = await REAL_FETCH(`${base}/tr/jilinrime/teklif-yonetimi`, {
          method: 'POST',
          headers: {
            Host: `127.0.0.1:${httpPort}`,
            Origin: 'https://evil.example',
            Cookie: `ya_cloud_admin=${adminCookie}`,
            'Next-Action': createActionId,
          },
          body: makeFlightActionFormData([], {
            hotel_name: 'Csrf',
            slug: 'csrf-slug',
            price: '1',
            currency: 'TL',
            region: 'X',
            promo_text: '',
            included_items: '[]',
          }),
        });
        const csrfText = await csrfAttempt.text();
        assert.ok(csrfAttempt.status >= 400 || parseActionJsonResult(csrfText)?.status === 403);
        assert.equal(state.mutations.length, 0);

        // Also verify Sec-Fetch-Site: cross-site even when Origin matches Host reaches our own guard and returns 403!
        const crossSiteAttempt = await postAction({
          actionId: createActionId,
          headers: {
            Cookie: `ya_cloud_admin=${adminCookie}`,
            'Sec-Fetch-Site': 'cross-site',
          },
          body: makeFlightActionFormData([], {
            hotel_name: 'CrossSite',
            slug: 'cross-site-slug',
            price: '1',
            currency: 'TL',
            region: 'X',
            promo_text: '',
            included_items: '[]',
          }),
        });
        const crossSiteText = await crossSiteAttempt.text();
        assert.equal(parseActionJsonResult(crossSiteText)?.status, 403);
        assert.equal(state.mutations.length, 0);

        // 3) Authorized aal2 admin CREATE via real HTTP Server Action
        const createRes = await postAction({
          actionId: createActionId,
          headers: { Cookie: `ya_cloud_admin=${adminCookie}` },
          body: makeFlightActionFormData([], {
            hotel_name: 'Kapadokya Taş Konak',
            slug: 'canli-teklif-1',
            price: '19.500',
            currency: 'TL',
            region: 'Kapadokya',
            promo_text: '3 Gece Kal 2 Öde',
            included_items: JSON.stringify([{ id: 'f1', title: 'Kahvaltı', description: 'Dahil', isActive: true }]),
          }),
        });
        assert.equal(createRes.status, 200);
        const createPayload = parseActionJsonResult(await createRes.text());
        assert.deepEqual(createPayload, { success: true });
        assert.equal(state.offers.size, 1);
        const createdOfferId = Array.from(state.offers.keys())[0];

        const assertOfferNotFound = async (url, label) => {
          const r = await REAL_FETCH(url);
          const html = await r.text();
          const isNotFound =
            r.status === 404 ||
            /NEXT_HTTP_ERROR_FALLBACK;404|This page could not be found|NEXT_NOT_FOUND/.test(html);
          assert.ok(isNotFound, `${label}: expected 404/notFound marker, got status ${r.status}`);
          assert.doesNotMatch(html, /19\.500|21\.000|Luvi Cave Hotel/, `${label}: stale offer content must not remain`);
        };

        const stripHtml = (s) => s.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '');

        const localhostBase = `http://localhost:${httpPort}`;

        // Visitor SSR/ISR pages across TR & EN load and render offer details from mock Supabase anon SELECT
        const trOffer1 = await REAL_FETCH(`${base}/tr/canli-teklif-1`);
        assert.equal(trOffer1.status, 200);
        const trOffer1Html = await trOffer1.text();
        assert.match(stripHtml(trOffer1Html), /19\.500/);
        assert.match(stripHtml(trOffer1Html), /3\s*Gece\s*Kal\s*2\s*Öde/);
        const enOffer1 = await REAL_FETCH(`${localhostBase}/en/canli-teklif-1`);
        assert.equal(enOffer1.status, 200);
        assert.match(stripHtml(await enOffer1.text()), /19\.500/);
        const elOffer1 = await REAL_FETCH(`${base}/el/canli-teklif-1`);
        assert.equal(elOffer1.status, 200);
        assert.match(stripHtml(await elOffer1.text()), /19\.500/);

        // Admin listing page reflects created offer and blocks anon
        assert.equal((await REAL_FETCH(`${base}/tr/jilinrime/teklif-yonetimi`)).status, 401);
        const adminListRes = await REAL_FETCH(`${base}/tr/jilinrime/teklif-yonetimi`, {
          headers: { Cookie: `ya_cloud_admin=${adminCookie}` },
        });
        assert.equal(adminListRes.status, 200);
        assert.match(await adminListRes.text(), /Kapadokya Taş Konak/);

        // 4) Authorized aal2 admin UPDATE renaming slug -> OLD slug MUST immediately return 404/notFound, NEW slug renders updated data
        const updateRes = await postAction({
          actionId: updateActionId,
          headers: { Cookie: `ya_cloud_admin=${adminCookie}` },
          body: makeFlightActionFormData([createdOfferId], {
            hotel_name: 'Kapadokya Taş Konak Yenilendi',
            slug: 'canli-teklif-2',
            price: '21.000',
            currency: 'TL',
            region: 'Kapadokya',
            promo_text: '4 Gece Kal 3 Öde',
            included_items: JSON.stringify([{ id: 'f1', title: 'Kahvaltı', description: 'Dahil', isActive: true }]),
          }),
        });
        assert.equal(updateRes.status, 200);
        assert.deepEqual(parseActionJsonResult(await updateRes.text()), { success: true });

        await assertOfferNotFound(`${base}/tr/canli-teklif-1`, 'Stale old TR slug');
        await assertOfferNotFound(`${localhostBase}/en/canli-teklif-1`, 'Stale old EN slug');
        await assertOfferNotFound(`${base}/el/canli-teklif-1`, 'Stale old EL slug');
        const trOffer2 = await REAL_FETCH(`${base}/tr/canli-teklif-2`);
        assert.equal(trOffer2.status, 200);
        const trOffer2Html = await trOffer2.text();
        assert.match(stripHtml(trOffer2Html), /21\.000/);
        assert.match(stripHtml(trOffer2Html), /4\s*Gece\s*Kal\s*3\s*Öde/);

        const adminListUpdated = await REAL_FETCH(`${base}/tr/jilinrime/teklif-yonetimi`, {
          headers: { Cookie: `ya_cloud_admin=${adminCookie}` },
        });
        assert.equal(adminListUpdated.status, 200);
        assert.match(await adminListUpdated.text(), /Kapadokya Taş Konak Yenilendi/);

        // 5) Authorized aal2 admin DELETE -> NEW slug MUST immediately return 404/notFound, and luvicavehotel-teklif stays disabled
        const deleteRes = await postAction({
          actionId: deleteActionId,
          headers: {
            Cookie: `ya_cloud_admin=${adminCookie}`,
            'Content-Type': 'text/plain;charset=UTF-8',
          },
          body: JSON.stringify([createdOfferId]),
        });
        assert.equal(deleteRes.status, 200);
        assert.deepEqual(parseActionJsonResult(await deleteRes.text()), { success: true });
        assert.equal(state.offers.size, 0);
        await assertOfferNotFound(`${base}/tr/canli-teklif-2`, 'Deleted TR slug');
        await assertOfferNotFound(`${localhostBase}/en/canli-teklif-2`, 'Deleted EN slug');
        await assertOfferNotFound(`${base}/el/canli-teklif-2`, 'Deleted EL slug');
        await assertOfferNotFound(`${base}/tr/luvicavehotel-teklif`, 'Zombie luvicavehotel-teklif fallback');
      } finally {
        srv.kill('SIGTERM');
      }
    });

    console.log(`\nALL P0 SECURITY FIX VERIFICATION CHECKS PASSED: ${passed} checks.`);
  } finally {
    global.fetch = REAL_FETCH;
    clearPolicyEnv();
    Object.assign(process.env, savedEnv);
    fs.rmSync(path.join(root, tempDistDir), { recursive: true, force: true });
    if (savedTsconfig !== null) {
      fs.writeFileSync(tsconfigPath, savedTsconfig);
    }
    await new Promise((resolve) => mockServer.close(resolve));
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
