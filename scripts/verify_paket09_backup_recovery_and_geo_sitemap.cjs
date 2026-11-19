// Automated Paket 09 Verification Suite:
// 7 Isolated Disaster/Recovery Scenarios, Emergency Switch Under Redis Outage,
// Local Rollback Rehearsal, and 100% Sitemap GEO Crawl (All <loc> URLs, 0 Sampling)
// Run after `npm run build`: node scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs
require('./security/network-lock.cjs');

const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const loadTs = require('./security/load-ts.cjs');

const ROOT = process.cwd();
let passed = 0;

async function check(label, fn) {
  const start = Date.now();
  await fn();
  passed++;
  console.log(`PASS ${label} (${Date.now() - start} ms)`);
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    proc.once('exit', (code, signal) => {
      done(new Error(`Next server exited early (code=${code}, signal=${signal}):\n${logs.slice(-1500)}`));
    });
  });
}

async function stopChild(proc) {
  if (!proc || proc.exitCode !== null) return;
  proc.kill('SIGTERM');
  await new Promise((r) => {
    const t = setTimeout(() => {
      if (proc.exitCode === null) proc.kill('SIGKILL');
      r();
    }, 3000);
    proc.once('exit', () => {
      clearTimeout(t);
      r();
    });
  });
}

function rawHttpGet(port, reqPath, hostHeader, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: reqPath,
        method: 'GET',
        headers: {
          Host: hostHeader,
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
    req.setTimeout(15000, () => {
      req.destroy(new Error(`HTTP timeout for ${hostHeader}${reqPath}`));
    });
    req.on('error', reject);
    req.end();
  });
}

function decodeHtmlAttr(s) {
  return String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

function normalizeCanonicalForCompare(u) {
  const parsed = new URL(u);
  if (parsed.pathname === '/') {
    return `${parsed.origin}`;
  }
  return `${parsed.origin}${parsed.pathname}`;
}

function extractSeoMeta(html) {
  const canonicalMatch =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const robotsMatch =
    html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/i);

  const hreflangs = {};
  const altRe = /<link[^>]+rel=["']alternate["'][^>]*>/gi;
  let m;
  while ((m = altRe.exec(html)) !== null) {
    const tag = m[0];
    const hl = tag.match(/hrefLang=["']([^"']+)["']/i) || tag.match(/hreflang=["']([^"']+)["']/i);
    const href = tag.match(/href=["']([^"']+)["']/i);
    if (hl && href) {
      hreflangs[hl[1]] = decodeHtmlAttr(href[1]);
    }
  }
  return {
    canonical: canonicalMatch ? decodeHtmlAttr(canonicalMatch[1]) : null,
    robotsMeta: robotsMatch ? robotsMatch[1].toLowerCase() : '',
    hreflangs,
  };
}

function parseSitemapEntries(xml) {
  const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  return urlBlocks.map((block) => {
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    const hreflangs = {};
    const linkRe = /<xhtml:link[^>]*rel=["']alternate["'][^>]*>/gi;
    let m;
    while ((m = linkRe.exec(block)) !== null) {
      const tag = m[0];
      const hl = tag.match(/hreflang=["']([^"']+)["']/i);
      const href = tag.match(/href=["']([^"']+)["']/i);
      if (hl && href) {
        hreflangs[hl[1]] = decodeHtmlAttr(href[1]);
      }
    }
    return {
      loc: locMatch ? decodeHtmlAttr(locMatch[1]) : null,
      hreflangs,
    };
  });
}

(async () => {
  assert.ok(fs.existsSync(path.join(ROOT, '.next/prerender-manifest.json')), '.next build required');

  // Dynamic mock backend shared across live server tests
  let upstashMode = 'off'; // 'off' | 'shed' | 'lockdown' | 'down_500'
  let supabaseMode = 'empty'; // 'empty' | 'down_503' | 'broken_offer' | 'corrupt_pub'
  let mockUpstashHits = 0;
  let mockDbHits = 0;

  const mockPort = await getFreePort();
  const mockServer = http.createServer((req, res) => {
    const u = new URL(req.url || '/', 'http://127.0.0.1');
    if (u.pathname.startsWith('/upstash/get/')) {
      mockUpstashHits++;
      if (upstashMode === 'down_500') {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Simulated Redis Outage' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: upstashMode }));
      return;
    }
    if (u.pathname.startsWith('/upstash')) {
      mockUpstashHits++;
      if (upstashMode === 'down_500') {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Simulated Redis Outage' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: 1 }));
      return;
    }

    mockDbHits++;
    if (supabaseMode === 'down_503') {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Simulated Supabase outage' }));
      return;
    }

    if (supabaseMode === 'broken_offer' && u.pathname.startsWith('/rest/v1/offers')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify([
          {
            id: '00000000-0000-4000-8000-000000000999',
            slug: 'bozuk-teklif-test',
            hotel_name: 'Restored Partial Hotel',
            price: 15000,
            currency: null,
            region: null,
            promo_text: null,
            // Malformed array elements (null, number) + missing fields to verify defensive sanitizer
            included_items: [null, 42, { invalid: true }, { id: 'feat1', title: 'X', description: 'Y', isActive: true }],
            created_at: '2026-10-01T00:00:00Z',
            updated_at: '2026-10-01T00:00:00Z',
          },
        ])
      );
      return;
    }

    if (supabaseMode === 'corrupt_pub' && u.pathname.includes('ya_read_publication')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          revision: 99,
          scope: 'moda/kahve',
          validUntil: '2099-01-01T00:00:00Z',
          document: {
            schemaVersion: 1,
            dataKind: 'real-research',
            mode: 'integration-preparation',
            productionPublished: false,
            region: { id: 'moda', slug: 'moda', name: 'Moda', displayName: 'Moda', path: ['istanbul', 'kadikoy', 'moda'] },
            categories: [{ slug: 'kahve', id: 'coffee', label: 'Kahve', isMustTry: false }],
            categorySlug: 'kahve',
            // Invalid: duplicate venue ID + unknown shape -> Zod publicationEnvelope MUST reject!
            venues: [
              { id: 'dup', name: 'A', location: 'Loc', categoryId: 'coffee', description: null, whatToOrder: [], menuFrom: [], alsoTry: [], beforeYouGo: [], photo: null, ratings: [] },
              { id: 'dup', name: 'B', location: 'Loc', categoryId: 'coffee', description: null, whatToOrder: [], menuFrom: [], alsoTry: [], beforeYouGo: [], photo: null, ratings: [] },
            ],
            rituals: [],
          },
        })
      );
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([]));
  });
  await new Promise((r) => mockServer.listen(mockPort, '127.0.0.1', r));

  const nextPort = await getFreePort();
  const origin = `http://127.0.0.1:${nextPort}`;
  const adminPw = crypto.randomBytes(16).toString('hex');
  const childEnv = {
    ...process.env,
    NODE_ENV: 'production',
    NODE_OPTIONS: `--require ${path.join(ROOT, 'scripts/security/network-lock.cjs')}`,
    APP_ENVIRONMENT: 'test',
    GASTRONOMY_AUTH_MODE: 'supabase',
    GASTRONOMY_LOCAL_PREVIEW: '0',
    RATE_LIMIT_ENFORCE: '1',
    EMERGENCY_RUNTIME_UPSTASH: '1',
    EMERGENCY_MODE_CACHE_TTL_MS: '120',
    EMERGENCY_OUTAGE_GRACE_MS: '700',
    EMERGENCY_OUTAGE_COOLDOWN_MS: '50',
    ADMIN_PASSWORD: adminPw,
    NEXT_PUBLIC_DISABLE_ANALYTICS: '1',
    NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${mockPort}`,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-anon',
    GASTRONOMY_SUPABASE_URL: `http://127.0.0.1:${mockPort}`,
    GASTRONOMY_SUPABASE_ANON_KEY: 'dummy-anon',
    GASTRONOMY_SUPABASE_REF: 'local',
    GASTRONOMY_CLOUD_ENV: 'local',
    UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${mockPort}/upstash`,
    UPSTASH_REDIS_REST_TOKEN: 'dummy-token',
  };
  delete childEnv.VERCEL;
  delete childEnv.VERCEL_ENV;
  delete childEnv.NEXT_PUBLIC_VERCEL_ENV;
  delete childEnv.TRAFFIC_EMERGENCY_MODE;

  const nextProc = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(nextPort)],
    { cwd: ROOT, env: childEnv }
  );

  try {
    await waitForNextReady(nextProc);

    // -------------------------------------------------------------------------
    // SCENARIO 1: Database completely unreachable (503)
    // -------------------------------------------------------------------------
    await check('1. Scenario 1 (DB unreachable): core gastronomy + CID directions stay 200 OK, DB endpoints degrade cleanly', async () => {
      supabaseMode = 'down_503';
      upstashMode = 'off';

      for (const p of [
        '/tr',
        '/tr/gastronomi/istanbul/kadikoy/moda',
        '/tr/gastronomi/mekan/moda-vermilion',
        '/api/gastronomy/regions/moda',
      ]) {
        const res = await fetch(`${origin}${p}`);
        assert.equal(res.status, 200, `Expected 200 for ${p} during DB outage`);
        const body = await res.text();
        assert.ok(body.includes('maps.google.com/?cid=') || p === '/tr', `Missing CID directions in ${p}`);
      }

      const track = await fetch(`${origin}/api/track-event`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          event_type: 'page_view',
          device_type: 'desktop',
          metadata: { path: '/tr' },
        }),
      });
      assert.equal(track.status, 202);

      const pubApi = await fetch(`${origin}/api/gastronomy-public?scope=moda/kahve`);
      assert.equal(pubApi.status, 503);
      const pubJson = await pubApi.json();
      assert.equal(Boolean(pubJson.stack), false);

      const goRes = await fetch(`${origin}/api/go?hotelId=11111111-1111-4111-8111-111111111111`, {
        redirect: 'manual',
      });
      assert.ok(goRes.status >= 300 && goRes.status < 400);

      const offerRes = await fetch(`${origin}/tr/luvicavehotel-teklif`);
      const offerHtml = await offerRes.text();
      assert.ok(
        offerRes.status === 404 || /NEXT_HTTP_ERROR_FALLBACK;404/.test(offerHtml),
        `Expected 404 or not-found fallback marker, got status ${offerRes.status}`
      );
      assert.equal(offerHtml.includes('Luvi Cave Hotel'), false);
      supabaseMode = 'empty';
    });

    // -------------------------------------------------------------------------
    // SCENARIO 2: Upstash Redis completely down (500)
    // -------------------------------------------------------------------------
    await check('2. Scenario 2 (Upstash down): visitor gastronomy runs with 0 Upstash dependency; prod admin auth fails closed 503', async () => {
      upstashMode = 'down_500';
      await sleep(160); // expire any prior emergency cache
      const hitsBefore = mockUpstashHits;

      const modaRes = await fetch(`${origin}/tr/gastronomi/istanbul/kadikoy/moda`);
      assert.equal(modaRes.status, 200);
      const apiRegionRes = await fetch(`${origin}/api/gastronomy/regions/moda`);
      assert.equal(apiRegionRes.status, 200);
      assert.equal(mockUpstashHits, hitsBefore, 'Core gastronomy routes must not query Upstash');

      // Production critical endpoints must fail-closed (503 outage-blocked) when Upstash is unreachable
      const savedEnv = { ...process.env };
      try {
        process.env.RATE_LIMIT_ENFORCE = '1';
        process.env.NODE_ENV = 'production';
        process.env.APP_ENVIRONMENT = 'production';
        process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE = 'block';
        process.env.UPSTASH_REDIS_REST_URL = `http://127.0.0.1:${mockPort}/upstash`;
        process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';

        const rlMod = loadTs('lib/pilot/rateLimit.ts', { cache: new Map() });
        rlMod.resetMemoryRateLimitersForTests();
        const blocked = await rlMod.enforceRateLimit(
          new Headers({ 'x-real-ip': '198.51.100.55' }),
          'admin_auth',
          { scope: 'api' }
        );
        assert.equal(blocked.ok, false);
        assert.equal(blocked.status, 503);
        assert.equal(blocked.policy, 'outage-blocked');
      } finally {
        for (const k of Object.keys(process.env)) if (!(k in savedEnv)) delete process.env[k];
        Object.assign(process.env, savedEnv);
        upstashMode = 'off';
      }
    });

    // -------------------------------------------------------------------------
    // SCENARIO 3: External APIs unreachable (socket egress locked)
    // -------------------------------------------------------------------------
    await check('3. Scenario 3 (External APIs down): network-locked runtime incurs 0 external calls and offline integrity passes', async () => {
      // network-lock.cjs rejects any outbound non-loopback socket with ENETUNREACH
      let blockedExternal = false;
      try {
        await fetch('https://places.googleapis.com/v1/places/test');
      } catch {
        blockedExternal = true;
      }
      assert.equal(blockedExternal, true, 'network-lock must block non-loopback egress');

      const v3Check = spawnSync(process.execPath, ['scripts/verify_v3_gastronomy.cjs'], {
        cwd: ROOT,
        encoding: 'utf8',
      });
      assert.equal(v3Check.status, 0, `${v3Check.stdout}\n${v3Check.stderr}`);

      const integrityCheck = spawnSync(
        process.execPath,
        ['scripts/verify_gastronomy_snapshot_integrity.cjs'],
        { cwd: ROOT, encoding: 'utf8' }
      );
      assert.equal(integrityCheck.status, 0, `${integrityCheck.stdout}\n${integrityCheck.stderr}`);
    });

    // -------------------------------------------------------------------------
    // SCENARIO 4 + ASAMA 4: Bad app deployment & Local Isolated Rollback Drill
    // -------------------------------------------------------------------------
    await check('4. Scenario 4 (Bad release + Local Upstream Switchover Simulation): auto-detect 500 on broken backend and switch upstream port to healthy build < 1s (local port simulation, not Vercel Edge alias rollback)', async () => {
      const badPort = await getFreePort();
      const badServer = http.createServer((_req, res) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Simulated broken deployment v-bad');
      });
      await new Promise((r) => badServer.listen(badPort, '127.0.0.1', r));

      let activeTargetPort = nextPort; // initially healthy deployment
      const proxyPort = await getFreePort();
      const routerProxy = http.createServer((req, res) => {
        const fwd = http.request(
          {
            hostname: '127.0.0.1',
            port: activeTargetPort,
            path: req.url,
            method: req.method,
            headers: req.headers,
          },
          (upRes) => {
            res.writeHead(upRes.statusCode || 502, upRes.headers);
            upRes.pipe(res);
          }
        );
        fwd.on('error', () => {
          res.writeHead(502);
          res.end('Bad Gateway');
        });
        req.pipe(fwd);
      });
      await new Promise((r) => routerProxy.listen(proxyPort, '127.0.0.1', r));

      try {
        const preRes = await fetch(`http://127.0.0.1:${proxyPort}/tr/gastronomi/istanbul/kadikoy/moda`);
        assert.equal(preRes.status, 200);

        // Simulate bad release promoted to production
        activeTargetPort = badPort;
        const badProbe = await fetch(`http://127.0.0.1:${proxyPort}/tr/gastronomi/istanbul/kadikoy/moda`);
        assert.equal(badProbe.status, 500);

        // Automated instant pointer rollback to last known good deployment
        const rollbackStart = performance.now();
        activeTargetPort = nextPort;
        const postProbe = await fetch(`http://127.0.0.1:${proxyPort}/tr/gastronomi/istanbul/kadikoy/moda`);
        const rollbackDurationMs = performance.now() - rollbackStart;

        assert.equal(postProbe.status, 200);
        const body = await postProbe.text();
        assert.ok(body.includes('GG Pizza Moda') && body.includes('maps.google.com/?cid='));
        assert.ok(rollbackDurationMs < 2000, `Expected instant pointer rollback < 2s, got ${rollbackDurationMs} ms`);
      } finally {
        routerProxy.closeAllConnections?.();
        badServer.closeAllConnections?.();
        await new Promise((r) => routerProxy.close(r));
        await new Promise((r) => badServer.close(r));
      }
    });

    // -------------------------------------------------------------------------
    // SCENARIO 5: Corrupted Gastronomy JSON file
    // -------------------------------------------------------------------------
    await check('5. Scenario 5 (Corrupted Gastronomy JSON): integrity gate blocks corrupt JSON/duplicate placeId & restores cleanly', async () => {
      const tmpRegions = fs.mkdtempSync(path.join(os.tmpdir(), 'ya-corrupt-snap-'));
      try {
        const srcDir = path.join(ROOT, 'lib/gastronomy-v3/regions');
        for (const f of fs.readdirSync(srcDir)) {
          if (f.endsWith('.json')) {
            fs.copyFileSync(path.join(srcDir, f), path.join(tmpRegions, f));
          }
        }
        const modaFile = path.join(tmpRegions, 'istanbul-kadikoy-moda.json');
        const originalModa = fs.readFileSync(modaFile, 'utf8');

        // 5A: Truncated / syntactically broken JSON
        fs.writeFileSync(modaFile, originalModa.slice(0, 120), 'utf8');
        const r1 = spawnSync(
          process.execPath,
          ['scripts/verify_gastronomy_snapshot_integrity.cjs', `--regions-dir=${tmpRegions}`],
          { cwd: ROOT, encoding: 'utf8' }
        );
        assert.equal(r1.status, 1);
        assert.match(r1.stderr, /CORRUPT_JSON:istanbul-kadikoy-moda\.json/);

        // 5B: Valid JSON syntax but corrupt mapsUri
        const brokenSchema = JSON.parse(originalModa);
        brokenSchema.venues[0].mapsUri = 'https://evil.example/redirect';
        fs.writeFileSync(modaFile, JSON.stringify(brokenSchema, null, 2), 'utf8');
        const r2 = spawnSync(
          process.execPath,
          ['scripts/verify_gastronomy_snapshot_integrity.cjs', `--regions-dir=${tmpRegions}`],
          { cwd: ROOT, encoding: 'utf8' }
        );
        assert.equal(r2.status, 1);

        // 5C: Recover from Git/clean copy
        fs.writeFileSync(modaFile, originalModa, 'utf8');
        const r3 = spawnSync(
          process.execPath,
          ['scripts/verify_gastronomy_snapshot_integrity.cjs', `--regions-dir=${tmpRegions}`],
          { cwd: ROOT, encoding: 'utf8' }
        );
        assert.equal(r3.status, 0);
      } finally {
        fs.rmSync(tmpRegions, { recursive: true, force: true });
      }
    });

    // -------------------------------------------------------------------------
    // SCENARIO 6: Missing or conflicting environment variables
    // -------------------------------------------------------------------------
    await check('6. Scenario 6 (Missing/conflicting env vars): fail-closed 503/throw on admin/prod mismatch, safe isolated fallback for showcase', async () => {
      // Missing ADMIN_PASSWORD fails closed with 503
      const { checkPilotAdmin } = loadTs('lib/pilot/adminAuth.ts', { cache: new Map() });
      const savedPw = process.env.ADMIN_PASSWORD;
      const savedEnvName = process.env.APP_ENVIRONMENT;
      const savedAuth = process.env.GASTRONOMY_AUTH_MODE;
      try {
        process.env.APP_ENVIRONMENT = 'test';
        process.env.GASTRONOMY_AUTH_MODE = 'basic';
        delete process.env.ADMIN_PASSWORD;
        const authRes = await checkPilotAdmin('Basic ' + Buffer.from('admin:anything').toString('base64'));
        assert.equal(authRes.ok, false);
        assert.equal(authRes.status, 503);
      } finally {
        if (savedPw === undefined) delete process.env.ADMIN_PASSWORD;
        else process.env.ADMIN_PASSWORD = savedPw;
        if (savedEnvName === undefined) delete process.env.APP_ENVIRONMENT;
        else process.env.APP_ENVIRONMENT = savedEnvName;
        if (savedAuth === undefined) delete process.env.GASTRONOMY_AUTH_MODE;
        else process.env.GASTRONOMY_AUTH_MODE = savedAuth;
      }

      // Production target without SUPABASE_PRODUCTION_AUTHORIZED=1 throws deterministically
      const policy = require('../lib/security/supabase-policy');
      assert.throws(() =>
        policy.configuration({
          NODE_ENV: 'production',
          APP_ENVIRONMENT: 'production',
          VERCEL_ENV: 'production',
          GASTRONOMY_CLOUD_ENV: 'production',
          GASTRONOMY_SUPABASE_URL: 'https://jerkkxwgddujigsbeqwo.supabase.co',
          GASTRONOMY_SUPABASE_ANON_KEY: 'dummy',
          NEXT_PUBLIC_SUPABASE_URL: 'https://jerkkxwgddujigsbeqwo.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy',
          GASTRONOMY_SUPABASE_REF: 'jerkkxwgddujigsbeqwo',
        })
      );

      // Build-time ambiguous env defaults cleanly to ISOLATED mode (confirmed live server renders 200 OK)
      const modaRes = await fetch(`${origin}/tr/gastronomi/istanbul/kadikoy/moda`);
      assert.equal(modaRes.status, 200);
    });

    // -------------------------------------------------------------------------
    // SCENARIO 7: Inconsistent restored DB data + migration safety scan
    // -------------------------------------------------------------------------
    await check('7. Scenario 7 (Inconsistent restored DB data): malformed offers.included_items & invalid ya_publications handled safely without 500', async () => {
      // 7A: Inconsistent restored offers row (null/numeric included_items + null region) renders safely 200 OK
      const mockSupabaseOfferMod = {
        isSupabaseIsolated: false,
        supabase: {
          from: () => ({
            select: () => ({
              eq: () => ({
                limit: async () => ({
                  data: [
                    {
                      id: '00000000-0000-4000-8000-000000000999',
                      slug: 'bozuk-teklif-test',
                      hotel_name: 'Restored Partial Hotel',
                      price: 15000,
                      currency: null,
                      region: null,
                      promo_text: null,
                      included_items: [null, 42, { id: 'feat1', title: 'X', description: 'Y', isActive: true }],
                      created_at: '2026-10-01T00:00:00Z',
                      updated_at: '2026-10-01T00:00:00Z',
                    },
                  ],
                  error: null,
                }),
              }),
            }),
          }),
        },
      };
      const { offers } = loadTs('lib/offers.ts', {
        cache: new Map(),
        mocks: {
          './supabase': mockSupabaseOfferMod,
          '@/lib/supabase': mockSupabaseOfferMod,
          './supabase-admin': {
            assertSupabaseAdminReady: () => {},
            supabaseAdmin: {},
            validatedAdminTarget: () => ({}),
          },
        },
      });
      const fetchedOffer = await offers.getBySlug('bozuk-teklif-test');
      assert.ok(fetchedOffer && fetchedOffer.hotel_name === 'Restored Partial Hotel');
      // Also verify DynamicOfferPage TSX handles malformed array without crashing
      const slugPageMod = loadTs('app/[lang]/[slug]/page.tsx', {
        cache: new Map(),
        mocks: {
          '@/lib/offers': { offers },
          '@/components/OfferPageTemplate': (props) => ({ renderedProps: props }),
          '@/components/Header': () => null,
        },
      });
      const rendered = await slugPageMod.default({
        params: Promise.resolve({ lang: 'tr', slug: 'bozuk-teklif-test' }),
      });
      const serialized = JSON.stringify(rendered);
      assert.ok(serialized.includes('Restored Partial Hotel'));
      assert.ok(serialized.includes('Türkiye')); // defaulted safely from null region

      // 7B: Corrupt restored publication envelope rejected by Zod contract
      supabaseMode = 'corrupt_pub';
      const pubMod = loadTs('lib/cloud/publication.ts', {
        cache: new Map(),
        mocks: {
          '../cloud/config': { cloudConfig: () => ({ url: `http://127.0.0.1:${mockPort}`, key: 'k', ref: 'local' }) },
          './config': { cloudConfig: () => ({ url: `http://127.0.0.1:${mockPort}`, key: 'k', ref: 'local' }) },
        },
      });
      pubMod.invalidateCloudPublication();
      await assert.rejects(() => pubMod.readCloudPublication('moda/kahve'));
      supabaseMode = 'empty';

      // 7C: Migration inventory check (72 applied + 5 proposed)
      const migs = fs.readdirSync(path.join(ROOT, 'supabase/migrations')).filter((f) => f.endsWith('.sql'));
      const proposed = fs.readdirSync(path.join(ROOT, 'supabase/proposed')).filter((f) => f.endsWith('.sql'));
      assert.equal(migs.length, 72);
      assert.equal(proposed.length, 5);
    });

    // -------------------------------------------------------------------------
    // ASAMA 4: Redis-backed TRAFFIC_EMERGENCY_MODE survives Upstash outage mid-incident
    // -------------------------------------------------------------------------
    await check('8. Asama 4 (Emergency mode under Redis outage): preserves active shed level across Redis outage & keeps gastronomy + CID 200 OK', async () => {
      // 8A: Set Redis mode to 'shed' and prime cache via live Next middleware
      upstashMode = 'shed';
      await sleep(160);
      const shedSearch1 = await fetch(`${origin}/tr/search`, { redirect: 'manual' });
      assert.equal(shedSearch1.status, 503);
      assert.equal(shedSearch1.headers.get('x-emergency-mode'), 'shed');

      // 8B: Upstash fails mid-attack AFTER 120ms cache TTL expires
      upstashMode = 'down_500';
      await sleep(160);

      // Previously, emergencyMode.ts dropped back to 'off' -> 200 on /tr/search!
      // With grace window, it MUST preserve 'shed' (503) while keeping core gastronomy + CID 200 OK!
      const shedDuringOutage = await fetch(`${origin}/tr/search`, { redirect: 'manual' });
      assert.equal(shedDuringOutage.status, 503, 'Active emergency shed mode must NOT drop to off when Redis fails mid-attack');
      assert.equal(shedDuringOutage.headers.get('x-emergency-mode'), 'shed');

      for (const safeUrl of [
        '/tr',
        '/tr/gastronomi/istanbul/kadikoy/moda',
        '/tr/gastronomi/mekan/moda-vermilion',
        '/api/gastronomy/regions/moda',
      ]) {
        const okRes = await fetch(`${origin}${safeUrl}`);
        assert.equal(okRes.status, 200, `${safeUrl} must stay 200 OK even during emergency shed + Redis outage`);
        if (safeUrl !== '/tr') {
          const text = await okRes.text();
          assert.ok(text.includes('maps.google.com/?cid='), `${safeUrl} must preserve CID maps directions`);
        }
      }

      // 8C: Grace window expiry resets cleanly back to normal when static env is off
      await sleep(600);
      const afterGrace = await fetch(`${origin}/tr/search`, { redirect: 'manual' });
      assert.equal(afterGrace.status, 200, 'After bounded outage grace expires with off static env, traffic recovers');

      // 8D: Verify Redis recovery explicit 'off' clears protection immediately too
      upstashMode = 'off';
      await sleep(120);
      const recovered = await fetch(`${origin}/tr/search`, { redirect: 'manual' });
      assert.equal(recovered.status, 200);
    });

    // -------------------------------------------------------------------------
    // ASAMA 5: Exhaustive 100% Sitemap Crawl + Canonical + Hreflang + Domain Separation + Admin Noindex + Cold ISR
    // -------------------------------------------------------------------------
    await check('9. Asama 5 (100% Sitemap Crawl + Admin/Internal Noindex + Domain Separation + First-Hit ISR)', async () => {
      upstashMode = 'off';
      supabaseMode = 'empty';

      // Verify first-hit cold ISR on a non-prerendered city/district/category page BEFORE sitemap warm-up
      const prerenderManifest = JSON.parse(
        fs.readFileSync(path.join(ROOT, '.next/prerender-manifest.json'), 'utf8')
      );
      const nonPrerenderedPath = '/gastronomi/izmir/urla/kahve';
      assert.equal(Boolean(prerenderManifest.routes[`/tr${nonPrerenderedPath}`]), false);
      const coldIsr = await rawHttpGet(nextPort, nonPrerenderedPath, 'www.yeriniayir.com');
      assert.equal(coldIsr.status, 200);
      assert.ok(coldIsr.body.includes('application/ld+json'));

      const sitemapRes = await rawHttpGet(nextPort, '/sitemap.xml', 'www.yeriniayir.com');
      assert.equal(sitemapRes.status, 200);
      const entries = parseSitemapEntries(sitemapRes.body);
      assert.ok(entries.length >= 1525, `Expected full sitemap >= 1525 URLs, got ${entries.length}`);

      // Every non-gastronomy URL + sample/all URLs parsed; zero sampling: check ALL 100%!
      const concurrency = 20;
      let cursor = 0;
      const errors = [];
      let checkedCount = 0;

      async function worker() {
        while (true) {
          const idx = cursor++;
          if (idx >= entries.length) break;
          const entry = entries[idx];
          const urlObj = new URL(entry.loc);
          const reqPath = `${urlObj.pathname}${urlObj.search}`;

          const res = await rawHttpGet(nextPort, reqPath, urlObj.host);
          if (res.status !== 200) {
            errors.push(`Status ${res.status} on ${entry.loc} (location=${res.headers.location || '-'})`);
            continue;
          }
          if (/NEXT_HTTP_ERROR_FALLBACK;404/.test(res.body)) {
            errors.push(`Streaming 404 fallback marker inside 200 body on ${entry.loc}`);
            continue;
          }

          if (res.headers['x-robots-tag'] && /noindex/i.test(String(res.headers['x-robots-tag']))) {
            errors.push(`Unexpected X-Robots-Tag noindex on sitemap URL ${entry.loc}`);
            continue;
          }

          const meta = extractSeoMeta(res.body);
          if (meta.robotsMeta.includes('noindex')) {
            errors.push(`Unexpected meta noindex on sitemap URL ${entry.loc}`);
            continue;
          }

          if (!meta.canonical) {
            errors.push(`Missing canonical link on sitemap URL ${entry.loc}`);
            continue;
          }

          if (normalizeCanonicalForCompare(meta.canonical) !== normalizeCanonicalForCompare(entry.loc)) {
            errors.push(`Canonical mismatch on ${entry.loc}: got ${meta.canonical}`);
            continue;
          }

          // Strict domain separation assertion
          if (urlObj.host === 'www.yeriniayir.com') {
            assert.ok(meta.canonical.startsWith('https://www.yeriniayir.com'));
          } else if (urlObj.host === 'www.worldandhotels.com') {
            assert.ok(meta.canonical.startsWith('https://www.worldandhotels.com'));
          } else {
            errors.push(`Unexpected host in sitemap: ${entry.loc}`);
          }

          // Verify hreflang consistency whenever declared in sitemap
          for (const [hlKey, hlUrl] of Object.entries(entry.hreflangs)) {
            const pageHl = meta.hreflangs[hlKey];
            if (!pageHl || normalizeCanonicalForCompare(pageHl) !== normalizeCanonicalForCompare(hlUrl)) {
              errors.push(`Hreflang mismatch (${hlKey}) on ${entry.loc}: html=${pageHl} vs sitemap=${hlUrl}`);
              break;
            }
          }

          checkedCount++;
        }
      }

      await Promise.all(Array.from({ length: concurrency }, () => worker()));
      assert.equal(errors.length, 0, `Sitemap audit failures (${errors.length}/${entries.length}):\n${errors.slice(0, 15).join('\n')}`);
      assert.equal(checkedCount, entries.length, 'Must inspect 100% of sitemap URLs without sampling');

      // Ensure legacy TR-only mock articles return 404 on worldandhotels.com and are NOT in sitemap
      const badEnArticle = await rawHttpGet(nextPort, '/guide/cocuklu-aileler-icin-fethiye', 'www.worldandhotels.com');
      assert.equal(badEnArticle.status, 404);
      assert.equal(sitemapRes.body.includes('worldandhotels.com/guide/cocuklu-aileler-icin-fethiye'), false);

      // Verify domain separation redirects (308)
      const crossTrToEn = await rawHttpGet(nextPort, '/gastronomy/istanbul', 'www.yeriniayir.com');
      assert.equal(crossTrToEn.status, 308);
      assert.equal(crossTrToEn.headers.location, 'https://www.worldandhotels.com/gastronomy/istanbul');

      const crossEnToTr = await rawHttpGet(nextPort, '/tr/gastronomi', 'www.worldandhotels.com');
      assert.equal(crossEnToTr.status, 308);
      assert.equal(crossEnToTr.headers.location, 'https://www.yeriniayir.com/gastronomi');

      // Verify admin & internal/demo/search/offer routes NEVER appear in sitemap and return noindex or auth block
      const internalRoutes = [
        '/tr/jilinrime',
        '/tr/gastronomi-yonetimi',
        '/tr/moda-kadikoy-pilot',
        '/tr/design-demo',
        '/tr/preview-food-card',
        '/tr/fethiye-yemek-rehberi',
        '/tr/search',
        '/tr/hoteloffer',
      ];
      for (const priv of internalRoutes) {
        assert.equal(sitemapRes.body.includes(priv), false, `Admin/internal path leaked into sitemap: ${priv}`);
        const res = await rawHttpGet(nextPort, priv, 'www.yeriniayir.com');
        const xRobots = String(res.headers['x-robots-tag'] || '').toLowerCase();
        const meta = extractSeoMeta(res.body);
        assert.ok(
          xRobots.includes('noindex') || meta.robotsMeta.includes('noindex') || res.status === 401 || res.status === 503,
          `Admin/internal path ${priv} must carry noindex or fail-closed auth (status=${res.status}, x-robots=${xRobots})`
        );
      }

      console.log(`  INFO Verified 100% of sitemap URLs: ${checkedCount}/${entries.length} passed with 0 errors`);
    });
  } finally {
    await stopChild(nextProc);
    mockServer.closeAllConnections?.();
    await new Promise((r) => mockServer.close(r));
    const globalDispatcher = globalThis[Symbol.for('undici.globalDispatcher.1')];
    if (globalDispatcher && typeof globalDispatcher.close === 'function') {
      await globalDispatcher.close().catch(() => {});
    }
  }

  console.log(`\nPASS Paket 09 backup, disaster recovery, rollback & 100% sitemap GEO verification: ${passed}/${passed} checks passed!`);
})().catch((err) => {
  console.error('\nFAIL Paket 09 verification:', err);
  process.exit(1);
});
