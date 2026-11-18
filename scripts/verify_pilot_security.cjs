require('./research-ts-loader.cjs');
// Run from the repository root: node scripts/verify_pilot_security.cjs
// Tests actual TypeScript handlers using the installed TypeScript transpiler and Next Request/Response.
// No env files are loaded and all outbound fetches are forbidden.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const root = process.cwd();
const repoRequire = createRequire(path.join(root, 'package.json'));
const ts = repoRequire('typescript');
const { NextRequest } = repoRequire('next/server');
const savedEnv = { ...process.env };
const savedFetch = global.fetch;
let pageAuthorization = null;
const cache = new Map();
function load(relative) {
  const filename = path.join(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const localRequire = createRequire(filename);
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  function scopedRequire(id) {
    if (id === 'next/headers') return { headers: () => new Headers(pageAuthorization ? { authorization: pageAuthorization } : {}) };
    if (id === './PilotClient') return { __esModule: true, default: () => null };
    if (id === '@upstash/redis') return { Redis: class {} };
    if (id === '@upstash/ratelimit') return { Ratelimit: class { static slidingWindow() {} } };
    if (id.startsWith('@/')) return load(id.slice(2) + '.ts');
    return localRequire(id);
  }
  new Function('require', 'module', 'exports', output)(scopedRequire, module, module.exports);
  return module.exports;
}
let passed = 0;
async function check(label, fn) { await fn(); passed++; console.log(`PASS ${label}`); }
const basic = (user = 'pilot-admin', password = 'test-only-secret:with-colon') => `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`;
function request(url, { authorization = basic(), origin = 'http://localhost:3000', contentType = 'application/json', fetchSite = 'same-origin', raw, body } = {}) {
  const headers = new Headers();
  if (authorization !== null) headers.set('authorization', authorization);
  if (origin !== null) headers.set('origin', origin);
  if (contentType !== null) headers.set('content-type', contentType);
  if (fetchSite !== null) headers.set('sec-fetch-site', fetchSite);
  return new NextRequest(url, { method: 'POST', headers, body: raw === undefined ? JSON.stringify(body ?? { candidateId: 'montag-moda-bademalti', decision: 'approved_for_staging' }) : raw });
}
async function main() {
  process.env.NODE_ENV = 'test';
  process.env.ADMIN_USER = 'pilot-admin';
  process.env.ADMIN_PASSWORD = 'test-only-secret:with-colon';
  global.fetch = () => { throw new Error('Outbound network forbidden in security tests'); };
  const auth = load('lib/pilot/adminAuth.ts');
  const { middleware } = load('middleware.ts');
  const { POST } = load('app/[lang]/(admin)/moda-kadikoy-pilot/decision/route.ts');
  const page = load('app/[lang]/(admin)/moda-kadikoy-pilot/page.tsx');
  const endpoint = 'http://localhost:3000/tr/moda-kadikoy-pilot/decision';
  for (const [label, value] of [['missing', null], ['wrong password', basic('pilot-admin','wrong')], ['wrong user', basic('intruder')], ['malformed base64', 'Basic !!!!'], ['no colon', 'Basic bm9jb2xvbg=='], ['Bearer', 'Bearer anything']]) {
    await check(`auth rejects ${label}`, async () => assert.deepEqual(await auth.checkPilotAdmin(value), { ok: false, status: 401 }));
  }
  await check('valid Basic credentials including password colon', async () => assert.deepEqual(await auth.checkPilotAdmin(basic()), { ok: true }));
  for (const password of [undefined, '', '   ']) {
    if (password === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = password;
    await check('missing/empty password fails closed on helper, page middleware and direct POST', async () => {
      assert.equal((await auth.checkPilotAdmin(basic())).status, 503);
      assert.equal((await middleware(new NextRequest('http://localhost:3000/tr/moda-kadikoy-pilot'))).status, 503);
      assert.equal((await POST(request(endpoint))).status, 503);
    });
  }
  process.env.ADMIN_PASSWORD = 'test-only-secret:with-colon';
  for (const route of ['/tr/moda-kadikoy-pilot', '/en/moda-kadikoy-pilot', '/el/moda-kadikoy-pilot', '/moda-kadikoy-pilot', '/tr/moda-kadikoy-pilot/', '/tr/moda-kadikoy-pilot/decision', '/tr/moda-kadikoy-pilot/file.json', '/tr/moda-kadikoy-pilot?_rsc=abc']) {
    await check(`middleware denies anonymous ${route}`, async () => {
      const res = await middleware(new NextRequest(`http://localhost:3000${route}`));
      assert.equal(res.status, 401);
      assert.match(res.headers.get('www-authenticate'), /^Basic /);
      assert.match(res.headers.get('cache-control'), /no-store/);
    });
  }
  await check('authenticated page request allowed with private no-store headers', async () => {
    const res = await middleware(new NextRequest('http://localhost:3000/tr/moda-kadikoy-pilot', { headers: { authorization: basic() } }));
    assert.equal(res.headers.get('x-middleware-next'), '1');
    assert.match(res.headers.get('cache-control'), /private, no-store/);
  });
  await check('authenticated locale-free alias rewrites to protected page', async () => {
    const res = await middleware(new NextRequest('http://localhost:3000/moda-kadikoy-pilot', { headers: { authorization: basic() } }));
    assert.equal(new URL(res.headers.get('x-middleware-rewrite')).pathname, '/tr/moda-kadikoy-pilot');
  });
  await check('public page remains accessible', async () => assert.equal((await middleware(new NextRequest('http://localhost:3000/tr'))).status, 200));
  await check('server page independently denies anonymous request', async () => {
    pageAuthorization = null;
    await assert.rejects(() => page.default({ params: { lang: 'tr' } }), /access denied/);
  });
  await check('server page renders only after valid authorization', async () => {
    pageAuthorization = basic();
    assert.ok(await page.default({ params: { lang: 'tr' } }));
    assert.equal(page.dynamic, 'force-dynamic');
  });
  const originalData = JSON.stringify(load('lib/pilot/modaKadikoyCoffeePilot.ts').MODA_KADIKOY_COFFEE_CANDIDATES);
  for (const decision of ['approved_for_staging', 'rejected', 'revision_requested']) {
    for (const authorization of [null, basic('pilot-admin', 'wrong')]) {
      await check(`direct POST rejects unauthorized ${decision}`, async () => {
        const res = await POST(request(endpoint, { authorization, body: { candidateId: 'montag-moda-bademalti', decision } }));
        assert.equal(res.status, 401);
      });
    }
    await check(`direct POST accepts authorized ${decision} without persistence`, async () => {
      const res = await POST(request(endpoint, { body: { candidateId: 'montag-moda-bademalti', decision } }));
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), { candidateId: 'montag-moda-bademalti', decision, persisted: false });
      assert.match(res.headers.get('cache-control'), /no-store/);
    });
  }
  for (const origin of [null, 'null', 'https://evil.example', 'http://localhost:4000']) {
    await check(`CSRF rejects origin ${origin}`, async () => assert.equal((await POST(request(endpoint, { origin }))).status, 403));
  }
  await check('CSRF rejects cross-site fetch metadata even with valid origin', async () => assert.equal((await POST(request(endpoint, { fetchSite: 'cross-site' }))).status, 403));
  await check('rejects non-JSON request', async () => assert.equal((await POST(request(endpoint, { contentType: 'text/plain' }))).status, 415));
  await check('rejects malformed JSON', async () => assert.equal((await POST(request(endpoint, { raw: '{' }))).status, 400));
  for (const body of [null, [], {}, { candidateId: 'unknown', decision: 'approved_for_staging' }, { candidateId: 'montag-moda-bademalti', decision: 'pending_review' }, { candidateId: 'montag-moda-bademalti', decision: {} }]) {
    await check('rejects invalid candidate/decision payload', async () => assert.equal((await POST(request(endpoint, { raw: JSON.stringify(body) }))).status, 400));
  }
  await check('CSRF uses browser Host when Next normalizes internal localhost URL', async () => {
    const req = request(endpoint, { origin: 'http://127.0.0.1:3000' });
    req.headers.set('host', '127.0.0.1:3000');
    assert.equal((await POST(req)).status, 200);
  });
  await check('CSRF ignores spoofed forwarded host', async () => {
    const req = request(endpoint, { origin: 'https://evil.example' });
    req.headers.set('x-forwarded-host', 'evil.example');
    assert.equal((await POST(req)).status, 403);
  });
  await check('shared candidate data remains unchanged', async () => assert.equal(JSON.stringify(load('lib/pilot/modaKadikoyCoffeePilot.ts').MODA_KADIKOY_COFFEE_CANDIDATES), originalData));
  console.log(`\n${passed}/${passed} pilot security checks passed (no network or database access).`);
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
  Object.assign(process.env, savedEnv);
  global.fetch = savedFetch;
});
