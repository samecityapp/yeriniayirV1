// Run after `npm run build`: node scripts/verify_paket06_traffic_cost_resilience.cjs
// Paket 06 Verification Suite:
// Group 1: Multi-isolate rate-limit audit, 3-pool memory isolation, CLI & UA-churn caps,
//          cold-start + production fail-closed 503 + 10s outage cooldown, scanner 0-DB guards.
// Group 2: Controlled progressive local load tests (Scenario A: Moda/Kadikoy 3,000 req;
//          Scenario B: 22-city multi-region 2,000 req + Headless Mobile Chrome E2E).
// Group 3: Emergency shed & lockdown mode E2E verification (heavy features 503/202,
//          core gastronomy menu + addresses + canonical Google Maps CID directions stay 100% live).
require('./security/network-lock.cjs');

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { execFileSync, spawn, spawnSync } = require('node:child_process');
const { performance } = require('node:perf_hooks');
const { createRequire } = require('node:module');

const root = process.cwd();
const repoRequire = createRequire(path.join(root, 'package.json'));
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

function sampleProcessStats(pid) {
  try {
    const out = execFileSync('ps', ['-p', String(pid), '-o', 'rss=,pcpu='], {
      encoding: 'utf8',
    }).trim();
    const parts = out.split(/\s+/);
    const rssKb = Number(parts[0]) || 0;
    const cpuPct = Number(parts[1]) || 0;
    return {
      rssMb: Math.round((rssKb / 1024) * 10) / 10,
      cpuPct,
    };
  } catch {
    return { rssMb: 0, cpuPct: 0 };
  }
}

function startNextProcess(port, extraEnv = {}) {
  return spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)],
    {
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
        RATE_LIMIT_ENFORCE: '1',
        NEXT_PUBLIC_DISABLE_ANALYTICS: '1',
        NEXT_PUBLIC_SUPABASE_URL: 'https://vhptlecaixpawtxnhsde.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-anon',
        ...extraEnv,
      },
    }
  );
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
      15000
    );
    proc.stdout.on('data', (c) => {
      const s = String(c);
      logs += s;
      if (s.includes('Ready')) done();
    });
    proc.stderr.on('data', (c) => {
      logs += String(c);
    });
    proc.once('exit', (code) =>
      done(new Error(`Next exited unexpectedly (${code}):\n${logs.slice(-1500)}`))
    );
  });
}

function sendHttpRequest(agent, port, reqSpec) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: reqSpec.path,
        method: reqSpec.method || 'GET',
        agent,
        headers: reqSpec.headers || {},
      },
      (res) => {
        let bytes = 0;
        res.on('data', (chunk) => {
          bytes += chunk.length;
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            ms: performance.now() - start,
            bytes,
            xCache: res.headers['x-nextjs-cache'] || null,
            xEmergency: res.headers['x-emergency-mode'] || null,
          });
        });
      }
    );
    req.on('error', reject);
    if (reqSpec.body) {
      req.write(reqSpec.body);
    }
    req.end();
  });
}

function percentile(sortedNums, p) {
  if (sortedNums.length === 0) return 0;
  const idx = Math.min(sortedNums.length - 1, Math.floor((sortedNums.length - 1) * p));
  return Math.round(sortedNums[idx] * 100) / 100;
}

async function runLoadStage({ port, concurrency, totalRequests, makeRequestSpec, pid }) {
  const agent = new http.Agent({
    keepAlive: true,
    maxSockets: Math.max(concurrency + 8, 32),
    keepAliveMsecs: 5000,
  });

  let nextIdx = 0;
  let status2xx = 0;
  let status429 = 0;
  let status5xx = 0;
  let statusOther = 0;
  let cacheHits = 0;
  let cacheMisses = 0;
  let totalBytes = 0;
  const latencies = new Array(totalRequests);
  let peakStats = sampleProcessStats(pid);

  const stageStart = performance.now();
  const sampleTimer = setInterval(() => {
    const cur = sampleProcessStats(pid);
    if (cur.rssMb > peakStats.rssMb) peakStats.rssMb = cur.rssMb;
    if (cur.cpuPct > peakStats.cpuPct) peakStats.cpuPct = cur.cpuPct;
  }, 150);

  async function worker() {
    while (true) {
      const idx = nextIdx++;
      if (idx >= totalRequests) break;
      const spec = makeRequestSpec(idx);
      const res = await sendHttpRequest(agent, port, spec);
      latencies[idx] = res.ms;
      totalBytes += res.bytes;
      if (res.status >= 200 && res.status < 300) status2xx++;
      else if (res.status === 429) status429++;
      else if (res.status >= 500) status5xx++;
      else statusOther++;
      if (res.xCache === 'HIT' || res.xCache === 'STALE') cacheHits++;
      else if (res.xCache === 'MISS') cacheMisses++;
    }
  }

  try {
    await Promise.all(Array.from({ length: concurrency }, () => worker()));
  } finally {
    clearInterval(sampleTimer);
    agent.destroy();
  }

  const durationMs = performance.now() - stageStart;
  const endStats = sampleProcessStats(pid);
  if (endStats.rssMb > peakStats.rssMb) peakStats.rssMb = endStats.rssMb;
  latencies.sort((a, b) => a - b);

  return {
    concurrency,
    totalRequests,
    durationMs: Math.round(durationMs * 10) / 10,
    rps: Math.round((totalRequests / (durationMs / 1000)) * 10) / 10,
    status2xx,
    status429,
    status5xx,
    statusOther,
    cacheHits,
    cacheMisses,
    totalBytes,
    p50Ms: percentile(latencies, 0.5),
    p95Ms: percentile(latencies, 0.95),
    p99Ms: percentile(latencies, 0.99),
    maxMs: percentile(latencies, 1.0),
    peakRssMb: peakStats.rssMb,
    peakCpuPct: peakStats.cpuPct,
  };
}

async function main() {
  const savedEnv = { ...process.env };
  const tsconfigPath = path.join(root, 'tsconfig.json');
  const savedTsconfig = fs.existsSync(tsconfigPath) ? fs.readFileSync(tsconfigPath, 'utf8') : null;

  // Instrumented local loopback mock for Supabase + Upstash (strictly 127.0.0.1)
  let mockUpstashHits = 0;
  let mockSupabaseHits = 0;
  const mockInfraServer = http.createServer((req, res) => {
    if ((req.url || '').startsWith('/upstash')) {
      mockUpstashHits++;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: 1 }));
      return;
    }
    mockSupabaseHits++;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([]));
  });
  await new Promise((resolve) => mockInfraServer.listen(0, '127.0.0.1', resolve));
  const mockInfraPort = mockInfraServer.address().port;

  try {
    // -------------------------------------------------------------------------
    // GROUP 1: Rate-Limit Architecture Re-Audit & Scanner / Retry-Loop Guards
    // -------------------------------------------------------------------------
    await check('1.1 Memory rate limits do NOT share across isolates; shared Upstash enforces global limit', async () => {
      process.env.RATE_LIMIT_ENFORCE = '1';
      process.env.APP_ENVIRONMENT = 'test';
      delete process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE;

      // Without Upstash -> two isolated instances each get 8 (16 total)
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
      const isoA = loadTs('lib/pilot/rateLimit.ts', { cache: new Map() });
      const isoB = loadTs('lib/pilot/rateLimit.ts', { cache: new Map() });
      isoA.resetMemoryRateLimitersForTests();
      isoB.resetMemoryRateLimitersForTests();

      const hdr = new Headers({ 'x-real-ip': '198.51.100.31' });
      let localPassed = 0;
      for (let i = 0; i < 8; i++) {
        if ((await isoA.enforceRateLimit(hdr, 'admin_auth', { scope: 'api' })).ok) localPassed++;
        if ((await isoB.enforceRateLimit(hdr, 'admin_auth', { scope: 'api' })).ok) localPassed++;
      }
      assert.equal(localPassed, 16, 'Proves in-memory buckets alone are per-isolate (not global)');

      // With shared Upstash Redis -> across Isolate A + Isolate B, total strictly capped at 8!
      const sharedRedisCounts = new Map();
      const sharedUpstashMocks = {
        '@upstash/redis': { Redis: class {} },
        '@upstash/ratelimit': {
          Ratelimit: class {
            static slidingWindow(limit) {
              return { limit };
            }
            constructor(opts) {
              this.limitVal = opts.limiter?.limit || 8;
              this.prefix = opts.prefix || 'rl';
            }
            async limit(key) {
              const k = `${this.prefix}:${key}`;
              const next = (sharedRedisCounts.get(k) || 0) + 1;
              sharedRedisCounts.set(k, next);
              return {
                success: next <= this.limitVal,
                limit: this.limitVal,
                remaining: Math.max(0, this.limitVal - next),
                reset: Math.ceil(Date.now() / 1000) + 60,
              };
            }
          },
        },
      };
      process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.example.invalid';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';
      const distA = loadTs('lib/pilot/rateLimit.ts', { cache: new Map(), mocks: sharedUpstashMocks });
      const distB = loadTs('lib/pilot/rateLimit.ts', { cache: new Map(), mocks: sharedUpstashMocks });
      distA.resetMemoryRateLimitersForTests();
      distB.resetMemoryRateLimitersForTests();

      let distOk = 0;
      for (let i = 0; i < 4; i++) {
        if ((await distA.enforceRateLimit(hdr, 'admin_auth', { scope: 'api' })).ok) distOk++;
        if ((await distB.enforceRateLimit(hdr, 'admin_auth', { scope: 'api' })).ok) distOk++;
      }
      assert.equal(distOk, 8);
      const nthFromB = await distB.enforceRateLimit(hdr, 'admin_auth', { scope: 'api' });
      assert.equal(nthFromB.ok, false);
      assert.equal(nthFromB.status, 429);
      assert.equal(nthFromB.policy, 'upstash');
    });

    await check('1.2 3-pool isolation, CLI bot 6/10s cap (0 Upstash), UA-churn collapse, and Vercel trusted IP extraction', async () => {
      let upstashHits = 0;
      process.env.RATE_LIMIT_ENFORCE = '1';
      process.env.APP_ENVIRONMENT = 'test';
      process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.example.invalid';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';

      const rl = loadTs('lib/pilot/rateLimit.ts', {
        cache: new Map(),
        mocks: {
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
        },
      });
      rl.resetMemoryRateLimitersForTests();

      // Vercel spoofed x-forwarded-for ignored in favor of x-vercel-forwarded-for
      process.env.VERCEL = '1';
      assert.equal(
        rl.extractClientIp(
          new Headers({
            'x-forwarded-for': '8.8.8.8',
            'x-vercel-forwarded-for': '203.0.113.55, 10.0.0.1',
          })
        ),
        '203.0.113.55'
      );
      delete process.env.VERCEL;

      // CLI scraper (curl/8.4.0) blocked at 7th request with ZERO Upstash calls after cap
      const cliHdr = new Headers({ 'x-real-ip': '192.0.2.77', 'user-agent': 'curl/8.4.0' });
      for (let i = 1; i <= 6; i++) {
        assert.equal((await rl.enforceRateLimit(cliHdr, 'visitor_redirect', { scope: 'api' })).ok, true);
      }
      const upstashAtCliCap = upstashHits;
      const cliBlocked = await rl.enforceRateLimit(cliHdr, 'visitor_redirect', { scope: 'api' });
      assert.equal(cliBlocked.ok, false);
      assert.equal(cliBlocked.status, 429);
      assert.equal(cliBlocked.policy, 'memory-l1');
      assert.equal(upstashHits, upstashAtCliCap, 'Blocked CLI bot must consume 0 Upstash commands');

      // Seed admin_auth budget for 203.0.113.99 (8 attempts -> must remain 429 even after 4500 random visitor UAs!)
      const targetAdminHdr = new Headers({ 'x-real-ip': '203.0.113.99' });
      for (let i = 0; i < 8; i++) {
        assert.equal((await rl.enforceRateLimit(targetAdminHdr, 'admin_auth', { scope: 'api' })).ok, true);
      }
      assert.equal((await rl.enforceRateLimit(targetAdminHdr, 'admin_auth', { scope: 'api' })).status, 429);

      // Single IP rotating 120 UAs in 10s -> first 40 get distinct keys, 41..120 collapse onto ua-churn & hit L1 429!
      let churnBlocked = 0;
      for (let i = 0; i < 120; i++) {
        const res = await rl.enforceRateLimit(
          new Headers({
            'x-real-ip': '198.51.100.200',
            'user-agent': `Mozilla/5.0 BotSweep/${i}`,
          }),
          'visitor_public',
          { scope: 'api' }
        );
        if (!res.ok) churnBlocked++;
      }
      assert.ok(churnBlocked >= 40, `Expected UA-churn collapsing to block >=40 rotating bot requests, blocked ${churnBlocked}`);

      // Flood 4,500 different visitor IPs -> isolated pool guarantees targetAdminHdr is STILL 429!
      for (let i = 0; i < 4500; i++) {
        await rl.enforceEdgeMemoryShield(
          new Headers({ 'x-real-ip': `198.18.${Math.floor(i / 250)}.${(i % 250) + 1}`, 'user-agent': `Mozilla/5.0 UA/${i}` }),
          'visitor_public',
          { scope: 'api' }
        );
      }
      assert.equal(
        (await rl.enforceRateLimit(targetAdminHdr, 'admin_auth', { scope: 'api' })).status,
        429,
        'Visitor flood must NEVER evict admin_auth pool'
      );
    });

    await check('1.3 Production fail-closed 503 (missing/malformed/outage) & 10s Upstash outage cooldown', async () => {
      const savedAppEnv = process.env.APP_ENVIRONMENT;
      const savedOutageMode = process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE;
      const savedUrl = process.env.UPSTASH_REDIS_REST_URL;
      const savedToken = process.env.UPSTASH_REDIS_REST_TOKEN;
      let upstashCalls = 0;

      process.env.RATE_LIMIT_ENFORCE = '1';
      process.env.APP_ENVIRONMENT = 'production';
      delete process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE;
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;

      const rlProd = loadTs('lib/pilot/rateLimit.ts', {
        cache: new Map(),
        mocks: {
          '@upstash/redis': { Redis: class {} },
          '@upstash/ratelimit': {
            Ratelimit: class {
              static slidingWindow() {
                return {};
              }
              async limit() {
                upstashCalls++;
                await new Promise((r) => setTimeout(r, 80));
                throw new Error('Upstash outage');
              }
            },
          },
        },
      });
      rlProd.resetMemoryRateLimitersForTests();

      // Missing Upstash in production across 100 rotating IPs -> ALL return fail-closed 503 outage-blocked!
      for (let i = 0; i < 100; i++) {
        const missingRes = await rlProd.enforceRateLimit(
          new Headers({ 'x-real-ip': `203.0.113.${(i % 200) + 1}` }),
          'admin_auth',
          { scope: 'api' }
        );
        assert.equal(missingRes.status, 503);
        assert.equal(missingRes.policy, 'outage-blocked');
      }

      // Malformed Upstash URLs / tokens in production must NEVER fall back to unlimited memory-fallback!
      for (const badCfg of [
        { url: 'http://bad.upstash.io', token: 'dummy-token' },
        { url: 'https://evil.example.com', token: 'dummy-token' },
        { url: 'https://mock-prod-unit.upstash.io:8443', token: 'dummy-token' },
        { url: 'https://mock-prod-unit.upstash.io/path', token: 'dummy-token' },
        { url: 'https://mock-prod-unit.upstash.io', token: 'bad token' },
        { url: 'https://mock-prod-unit.upstash.io', token: '' },
      ]) {
        process.env.UPSTASH_REDIS_REST_URL = badCfg.url;
        process.env.UPSTASH_REDIS_REST_TOKEN = badCfg.token;
        const badRes = await rlProd.enforceRateLimit(
          new Headers({ 'x-real-ip': '203.0.113.210' }),
          'admin_auth',
          { scope: 'api' }
        );
        assert.equal(badRes.status, 503, `Malformed config (${badCfg.url}) must fail-closed 503`);
        assert.equal(badRes.policy, 'outage-blocked');
      }

      // Emergency outage mode with missing config still enforces tight 6/60s global ceiling across 100 rotating IPs
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
      process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE = 'emergency';
      let emergencyAllowed = 0;
      for (let i = 0; i < 100; i++) {
        const emRes = await rlProd.enforceRateLimit(
          new Headers({ 'x-real-ip': `198.51.100.${(i % 200) + 1}` }),
          'admin_auth',
          { scope: 'api' }
        );
        if (emRes.ok) emergencyAllowed++;
      }
      assert.equal(emergencyAllowed, 6, 'Missing config in emergency mode must enforce 6/60s global cap');
      rlProd.resetMemoryRateLimitersForTests();
      delete process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE;

      // Runtime Upstash failure on valid https://*.upstash.io engages 10s cooldown -> 2nd call skips slow remote call!
      process.env.UPSTASH_REDIS_REST_URL = 'https://mock-prod-unit.upstash.io';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy-token';
      const firstFail = await rlProd.enforceRateLimit(
        new Headers({ 'x-real-ip': '203.0.113.11' }),
        'costly_admin',
        { scope: 'api' }
      );
      assert.equal(firstFail.status, 503);
      assert.equal(firstFail.policy, 'outage-blocked');
      assert.equal(upstashCalls, 1);

      const t0 = performance.now();
      const secondFail = await rlProd.enforceRateLimit(
        new Headers({ 'x-real-ip': '203.0.113.12' }),
        'costly_admin',
        { scope: 'api' }
      );
      const elapsed = performance.now() - t0;
      assert.equal(secondFail.status, 503);
      assert.equal(secondFail.policy, 'outage-blocked');
      assert.equal(upstashCalls, 1, 'Cooldown circuit breaker must skip calling failing Upstash');
      assert.ok(elapsed < 25, `Expected cooldown response < 25ms, got ${elapsed}ms`);

      // Verify preflight production rate-limit config check script (positive + negative)
      const preflightGood = spawnSync(process.execPath, ['scripts/verify_production_ratelimit_config.cjs'], {
        cwd: root,
        env: {
          ...process.env,
          UPSTASH_REDIS_REST_URL: 'https://preflight-unit.upstash.io',
          UPSTASH_REDIS_REST_TOKEN: 'dummy-shape-token',
          RATE_LIMIT_CRITICAL_OUTAGE_MODE: 'block',
        },
        encoding: 'utf8',
      });
      assert.equal(preflightGood.status, 0, preflightGood.stderr);
      const preflightBad = spawnSync(process.execPath, ['scripts/verify_production_ratelimit_config.cjs'], {
        cwd: root,
        env: {
          ...process.env,
          UPSTASH_REDIS_REST_URL: 'https://not-upstash.example.com',
          UPSTASH_REDIS_REST_TOKEN: 'dummy-shape-token',
          RATE_LIMIT_CRITICAL_OUTAGE_MODE: 'emergency',
        },
        encoding: 'utf8',
      });
      assert.notEqual(preflightBad.status, 0);

      if (savedAppEnv === undefined) delete process.env.APP_ENVIRONMENT;
      else process.env.APP_ENVIRONMENT = savedAppEnv;
      if (savedOutageMode === undefined) delete process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE;
      else process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE = savedOutageMode;
      if (savedUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
      else process.env.UPSTASH_REDIS_REST_URL = savedUrl;
      if (savedToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN;
      else process.env.UPSTASH_REDIS_REST_TOKEN = savedToken;
    });

    await check('1.5 Sliding-window clock boundary never expires newer timestamps early & never evicts live buckets', async () => {
      process.env.RATE_LIMIT_ENFORCE = '1';
      process.env.APP_ENVIRONMENT = 'test';
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
      delete process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE;

      const rlClock = loadTs('lib/pilot/rateLimit.ts', { cache: new Map() });
      rlClock.resetMemoryRateLimitersForTests();

      const tBase = Date.UTC(2026, 10, 19, 12, 0, 0);
      const h = new Headers({
        'x-real-ip': '203.0.113.77',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) SlidingTest/1.0',
      });

      // t = 0ms -> 1 request (oldest slot)
      assert.equal((await rlClock.enforceRateLimit(h, 'visitor_redirect', { scope: 'api', nowMs: tBase })).ok, true);
      // t = 9000ms -> 29 requests (total 30 within [0, 9000ms])
      for (let i = 0; i < 29; i++) {
        assert.equal(
          (await rlClock.enforceRateLimit(h, 'visitor_redirect', { scope: 'api', nowMs: tBase + 9000 })).ok,
          true
        );
      }
      // t = 10001ms -> t=0ms expired, 29 requests at t=9000ms MUST remain live -> ONLY 1 new request accepted!
      let acceptedAtBoundary = 0;
      let rejectedAtBoundary = 0;
      for (let i = 0; i < 30; i++) {
        const res = await rlClock.enforceRateLimit(h, 'visitor_redirect', {
          scope: 'api',
          nowMs: tBase + 10001,
        });
        if (res.ok) acceptedAtBoundary++;
        else rejectedAtBoundary++;
      }
      assert.equal(acceptedAtBoundary, 1, 'Rolling 10s window must keep all 29 newer timestamps alive');
      assert.equal(rejectedAtBoundary, 29, 'Rolling 10s window must block remaining 29 burst requests');

      // Visitor bucket pool overflow must fail closed for newcomers WITHOUT evicting existing budgets
      rlClock.resetMemoryRateLimitersForTests();
      const victimHdr = new Headers({ 'x-real-ip': '198.51.100.1', 'user-agent': 'VictimClient/1.0' });
      for (let i = 0; i < 30; i++) {
        assert.equal(
          (await rlClock.enforceEdgeMemoryShield(victimHdr, 'visitor_public', { scope: 'mw', nowMs: tBase })).ok,
          true
        );
      }
      for (let i = 0; i < 4200; i++) {
        await rlClock.enforceEdgeMemoryShield(
          new Headers({
            'x-real-ip': `100.64.${Math.floor(i / 250)}.${(i % 250) + 1}`,
            'user-agent': `PoolFiller/${i}`,
          }),
          'visitor_public',
          { scope: 'mw', nowMs: tBase + 100 }
        );
      }
      const victimAfterFlood = await rlClock.enforceEdgeMemoryShield(victimHdr, 'visitor_public', {
        scope: 'mw',
        nowMs: tBase + 200,
      });
      assert.equal(victimAfterFlood.status, 429, 'Pool overflow must never evict existing active bucket');
    });

    await check('1.4 Scanner 0-DB guards on lib/db.ts & both opengraph-image handlers block invalid probes', async () => {
      let dbQueries = 0;
      let ogRenderCalls = 0;
      const mocks = {
        '@/lib/supabase': {
          isSupabaseIsolated: false,
          supabase: {
            from: () => {
              dbQueries++;
              const chain = {
                select: () => chain,
                eq: () => chain,
                or: () => chain,
                ilike: () => chain,
                is: () => chain,
                order: () => chain,
                limit: () => chain,
                maybeSingle: async () => ({ data: null, error: null }),
              };
              return chain;
            },
          },
        },
        'next/og': {
          ImageResponse: class {
            constructor() {
              ogRenderCalls++;
            }
          },
        },
      };

      const { db } = loadTs('lib/db.ts', { cache: new Map(), mocks });
      assert.equal(await db.hotels.getById('not-a-uuid-scanner-probe'), null);
      assert.equal(await db.articles.getBySlug('bad.eq.1,id.neq.0'), null);
      assert.equal(dbQueries, 0, 'Malformed IDs and PostgREST injection probes must incur 0 DB queries');

      const hotelOg = loadTs('app/[lang]/(main)/otel/[id]/opengraph-image.tsx', {
        cache: new Map(),
        mocks: { ...mocks, '@/lib/db': { db } },
      });
      const rehberOg = loadTs('app/[lang]/(main)/rehber/[slug]/opengraph-image.tsx', {
        cache: new Map(),
        mocks: { ...mocks, '@/lib/db': { db } },
      });
      const resHotelOg = await hotelOg.default({ params: { id: 'random-bot-probe' } });
      const resRehberOg = await rehberOg.default({ params: { slug: 'bad_slug!probe' } });
      assert.equal(resHotelOg.status, 404);
      assert.equal(resRehberOg.status, 404);
      assert.equal(dbQueries, 0);
      assert.equal(ogRenderCalls, 0);
    });

    // -------------------------------------------------------------------------
    // GROUP 2: Controlled Progressive Local Load Tests (Scenario A & Scenario B)
    // -------------------------------------------------------------------------
    const loadPort = await getFreePort();
    const loadOrigin = `http://127.0.0.1:${loadPort}`;
    const nextLoadProc = startNextProcess(loadPort, {
      UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${mockInfraPort}/upstash`,
      UPSTASH_REDIS_REST_TOKEN: 'dummy-token',
    });

    const benchmarkReport = {
      generatedAt: new Date().toISOString(),
      environment: 'local-isolated-loopback-next-start',
      scenarioA: { warmup: null, stages: [], recovery: null, upstashHits: 0, supabaseHits: 0 },
      scenarioB: { warmup: null, stages: [], recovery: null, chromeE2E: null, upstashHits: 0, supabaseHits: 0 },
      scenarioC_emergency: null,
    };

    try {
      await waitForNextReady(nextLoadProc);

      // Warm ISR cache + measure baseline stats
      const warmPaths = [
        '/tr',
        '/en',
        '/api/gastronomy/regions/moda',
        '/api/gastronomy/regions/kadikoy',
        '/api/gastronomy/regions/karakoy',
        '/api/gastronomy/regions/nisantasi',
        '/api/gastronomy/regions/besiktas-carsi',
        '/api/gastronomy/regions/galata',
        '/api/gastronomy/regions/alsancak',
        '/api/gastronomy/regions/alacati',
        '/api/gastronomy/regions/urla',
        '/api/gastronomy/regions/foca',
        '/api/gastronomy/regions/bodrum-merkez',
        '/api/gastronomy/regions/yalikavak',
        '/api/gastronomy/regions/fethiye-merkez',
        '/api/gastronomy/regions/kas-merkez',
        '/api/gastronomy/regions/antalya-kaleici',
        '/api/gastronomy/regions/gaziantep',
        '/api/gastronomy/regions/sanliurfa',
        '/api/gastronomy/regions/adana',
        '/api/gastronomy/regions/tunali-hilmi',
        '/api/gastronomy/regions/eskisehir-merkez',
        '/api/gastronomy/regions/bursa-merkez',
        '/api/gastronomy/regions/trabzon-merkez',
        '/images/gastronomy/bolge-moda.svg',
        '/fonts/Inter-TR-EN-04308d9ab394.woff2',
      ];
      const warmupStats = [];
      for (const wp of warmPaths) {
        const res = await fetch(`${loadOrigin}${wp}`);
        assert.equal(res.status, 200, `Warmup failed for ${wp}`);
        warmupStats.push({
          path: wp,
          xCache: res.headers.get('x-nextjs-cache'),
        });
      }
      const baselineStats = sampleProcessStats(nextLoadProc.pid);
      benchmarkReport.scenarioA.warmup = { baselineRssMb: baselineStats.rssMb, regionsWarmed: 22 };

      await check('2.1 Scenario A (Moda/Kadikoy viral surge 3,000 req): 0 5xx, 0 429, 0 DB, 0 Upstash & clean recovery', async () => {
        mockUpstashHits = 0;
        mockSupabaseHits = 0;
        const cgnatIps = Array.from({ length: 10 }, (_, i) => `198.51.100.${10 + i}`);
        const aTargets = [
          (i) => `/tr?region=moda&utm_source=instagram&fbclid=ig_${i}`,
          () => '/tr?region=moda',
          () => '/api/gastronomy/regions/moda',
          () => '/api/gastronomy/regions/kadikoy',
          () => '/images/gastronomy/bolge-moda.svg',
          () => '/fonts/Inter-TR-EN-04308d9ab394.woff2',
        ];
        const stageSpecs = [
          { concurrency: 10, totalRequests: 200 },
          { concurrency: 50, totalRequests: 800 },
          { concurrency: 150, totalRequests: 2000 },
        ];
        for (const st of stageSpecs) {
          const result = await runLoadStage({
            port: loadPort,
            concurrency: st.concurrency,
            totalRequests: st.totalRequests,
            pid: nextLoadProc.pid,
            makeRequestSpec: (idx) => {
              const pathFn = aTargets[idx % aTargets.length];
              return {
                path: pathFn(idx),
                method: 'GET',
                headers: {
                  'x-real-ip': cgnatIps[idx % cgnatIps.length],
                  'user-agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 17_${idx % 5} like Mac OS X) Instagram/${idx % 200}`,
                },
              };
            },
          });
          assert.equal(result.status5xx, 0, `Scenario A produced 5xx at c=${st.concurrency}`);
          assert.equal(result.status429, 0, `Scenario A produced unexpected 429 at c=${st.concurrency}`);
          assert.equal(result.statusOther, 0, `Scenario A produced unexpected non-200 at c=${st.concurrency}`);
          benchmarkReport.scenarioA.stages.push(result);
        }

        const recovery = await runLoadStage({
          port: loadPort,
          concurrency: 4,
          totalRequests: 20,
          pid: nextLoadProc.pid,
          makeRequestSpec: (idx) => ({
            path: idx % 2 === 0 ? '/tr' : '/api/gastronomy/regions/moda',
            method: 'GET',
          }),
        });
        assert.equal(recovery.status2xx, 20);
        benchmarkReport.scenarioA.recovery = recovery;
        benchmarkReport.scenarioA.upstashHits = mockUpstashHits;
        benchmarkReport.scenarioA.supabaseHits = mockSupabaseHits;
        assert.equal(mockUpstashHits, 0, 'Scenario A static/ISR flow must consume 0 Upstash commands');
        assert.equal(mockSupabaseHits, 0, 'Scenario A static/ISR flow must execute 0 Supabase queries');
        console.log('  Scenario A stages:', JSON.stringify(benchmarkReport.scenarioA.stages.map((s) => ({ c: s.concurrency, n: s.totalRequests, rps: s.rps, p95: s.p95Ms, p99: s.p99Ms, hits: s.cacheHits, rssMb: s.peakRssMb }))));
      });

      await check('2.2 Scenario B (22-city multi-region 2,000 req + Chrome 390px filter/detail E2E): 0 5xx, 0 429, 0 DB, 0 Upstash', async () => {
        mockUpstashHits = 0;
        mockSupabaseHits = 0;
        const multiPaths = [
          '/',
          '/tr?utm_source=instagram&fbclid=story_b',
          '/api/gastronomy/regions/moda',
          '/api/gastronomy/regions/kadikoy',
          '/api/gastronomy/regions/karakoy',
          '/api/gastronomy/regions/nisantasi',
          '/api/gastronomy/regions/besiktas-carsi',
          '/api/gastronomy/regions/galata',
          '/api/gastronomy/regions/alsancak',
          '/api/gastronomy/regions/alacati',
          '/api/gastronomy/regions/urla',
          '/api/gastronomy/regions/foca',
          '/api/gastronomy/regions/bodrum-merkez',
          '/api/gastronomy/regions/yalikavak',
          '/api/gastronomy/regions/fethiye-merkez',
          '/api/gastronomy/regions/kas-merkez',
          '/api/gastronomy/regions/antalya-kaleici',
          '/api/gastronomy/regions/gaziantep',
          '/api/gastronomy/regions/sanliurfa',
          '/api/gastronomy/regions/adana',
          '/api/gastronomy/regions/tunali-hilmi',
          '/api/gastronomy/regions/eskisehir-merkez',
          '/api/gastronomy/regions/bursa-merkez',
          '/api/gastronomy/regions/trabzon-merkez',
          '/images/gastronomy/kahve-ana-matisse.svg',
          '/images/gastronomy/pizza-ana-matisse.svg',
          '/images/gastronomy/hamburger-ana-matisse.svg',
          '/images/gastronomy/bolge-karakoy.svg',
        ];
        const stageSpecs = [
          { concurrency: 10, totalRequests: 200 },
          { concurrency: 50, totalRequests: 600 },
          { concurrency: 120, totalRequests: 1200 },
        ];
        for (const st of stageSpecs) {
          const result = await runLoadStage({
            port: loadPort,
            concurrency: st.concurrency,
            totalRequests: st.totalRequests,
            pid: nextLoadProc.pid,
            makeRequestSpec: (idx) => ({
              path: multiPaths[idx % multiPaths.length],
              method: 'GET',
              headers: {
                'x-real-ip': `198.51.100.${50 + (idx % 30)}`,
                'user-agent': `Mozilla/5.0 (Linux; Android 14) Chrome/125 Mobile/${idx % 100}`,
              },
            }),
          });
          assert.equal(result.status5xx, 0);
          assert.equal(result.status429, 0);
          assert.equal(result.statusOther, 0);
          benchmarkReport.scenarioB.stages.push(result);
        }

        // Real Headless Chrome Mobile (390x844) multi-city browse, category filter & CID detail check
        const browser = await puppeteer.launch({
          headless: true,
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          args: ['--no-sandbox'],
        });
        try {
          const ctx = await browser.createBrowserContext();
          const page = await ctx.newPage();
          await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
          const pageErrors = [];
          const hitUrls = [];
          page.on('pageerror', (e) => pageErrors.push(e.message));
          await page.setRequestInterception(true);
          page.on('request', (req) => {
            const u = new URL(req.url());
            if (u.origin !== loadOrigin && !['data:', 'blob:'].includes(u.protocol)) {
              req.abort();
            } else {
              hitUrls.push(`${u.pathname}${u.search}`);
              req.continue();
            }
          });

          await page.goto(`${loadOrigin}/tr?utm_source=instagram&fbclid=multi_city`, {
            waitUntil: 'networkidle0',
          });
          await page.evaluate(() => {
            const banner = document.querySelector('div.fixed.inset-x-0.bottom-0');
            const btn = banner && Array.from(banner.querySelectorAll('button')).pop();
            if (btn) btn.click();
          });

          for (const targetCity of ['Moda, Kadıköy', 'Gaziantep', 'Alsancak, Konak']) {
            await page.click('header button');
            await page.waitForSelector('[role="dialog"] input');
            await page.evaluate((lbl) => {
              const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
                (b.textContent || '').includes(lbl)
              );
              if (!btn) throw new Error(`City button not found: ${lbl}`);
              btn.click();
            }, targetCity);
            await page.waitForSelector('[data-venue-id]', { timeout: 10000 });
          }

          // Switch category & open venue detail sheet -> verify address & Google Maps CID link
          const catButtons = await page.$$('button[aria-pressed]');
          assert.ok(catButtons.length >= 2);
          await catButtons[1].click();
          await page.waitForSelector('[data-venue-id] h2');
          await page.click('[data-venue-id] h2');
          await page.waitForSelector('[role="dialog"] a[href^="https://maps.google.com/?cid="]');
          const cidHref = await page.$eval(
            '[role="dialog"] a[href^="https://maps.google.com/?cid="]',
            (a) => a.getAttribute('href')
          );
          assert.match(cidHref || '', /^https:\/\/maps\.google\.com\/\?cid=\d+$/);
          assert.deepEqual(pageErrors, []);
          assert.equal(hitUrls.some((u) => u.startsWith('/api/track-event')), false);
          assert.equal(hitUrls.some((u) => u.startsWith('/_next/image')), false);
          benchmarkReport.scenarioB.chromeE2E = {
            citiesVisited: ['Moda, Kadıköy', 'Gaziantep', 'Alsancak, Konak'],
            cidHref,
            totalLoopbackRequests: hitUrls.length,
            trackEventCalls: 0,
            nextImageCalls: 0,
          };
          await ctx.close();
        } finally {
          await browser.close();
        }

        const recovery = await runLoadStage({
          port: loadPort,
          concurrency: 4,
          totalRequests: 20,
          pid: nextLoadProc.pid,
          makeRequestSpec: (idx) => ({
            path: idx % 2 === 0 ? '/tr' : '/api/gastronomy/regions/gaziantep',
            method: 'GET',
          }),
        });
        assert.equal(recovery.status2xx, 20);
        benchmarkReport.scenarioB.recovery = recovery;
        benchmarkReport.scenarioB.upstashHits = mockUpstashHits;
        benchmarkReport.scenarioB.supabaseHits = mockSupabaseHits;
        assert.equal(mockUpstashHits, 0);
        assert.equal(mockSupabaseHits, 0);
        console.log('  Scenario B stages:', JSON.stringify(benchmarkReport.scenarioB.stages.map((s) => ({ c: s.concurrency, n: s.totalRequests, rps: s.rps, p95: s.p95Ms, p99: s.p99Ms, hits: s.cacheHits, rssMb: s.peakRssMb }))));
      });
    } finally {
      nextLoadProc.kill('SIGTERM');
    }

    // -------------------------------------------------------------------------
    // GROUP 3: Emergency Cost-Shedding & Lockdown Runbook E2E (Asama 5)
    // -------------------------------------------------------------------------
    const shedPort = await getFreePort();
    const shedOrigin = `http://127.0.0.1:${shedPort}`;
    const nextShedProc = startNextProcess(shedPort, {
      TRAFFIC_EMERGENCY_MODE: 'shed',
      UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${mockInfraPort}/upstash`,
      UPSTASH_REDIS_REST_TOKEN: 'dummy-token',
    });

    try {
      await waitForNextReady(nextShedProc);

      await check('3.1 TRAFFIC_EMERGENCY_MODE=shed sheds expensive routes (503/202, 0 Upstash/DB) while keeping gastronomy + CID directions live', async () => {
        mockUpstashHits = 0;
        mockSupabaseHits = 0;

        const shedRoutes = [
          '/tr/search?q=otel',
          '/tr/otel/123e4567-e89b-12d3-a456-426614174000',
          '/tr/rehber',
          '/tr/feed.xml',
          '/api/go?hotelId=123e4567-e89b-12d3-a456-426614174000',
          '/api/gastronomy-public?scope=moda/kahve',
          '/_next/image?url=%2Flogo.png&w=64&q=75',
          '/tr/luvicavehotel-teklif',
        ];
        const shedResults = [];
        for (const r of shedRoutes) {
          const res = await fetch(`${shedOrigin}${r}`);
          assert.equal(res.status, 503, `Expected 503 shed on ${r}, got ${res.status}`);
          assert.equal(res.headers.get('x-emergency-mode'), 'shed');
          assert.equal(res.headers.get('retry-after'), '120');
          shedResults.push({ path: r, status: res.status });
        }

        const trackRes = await fetch(`${shedOrigin}/api/track-event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_type: 'page_view', hotel_id: null }),
        });
        assert.equal(trackRes.status, 202);
        const trackJson = await trackRes.json();
        assert.equal(trackJson.shed, true);

        // Verify core Gastronomy page & Moda/Gaziantep region APIs stay 200 OK in Mobile Chrome
        const browser = await puppeteer.launch({
          headless: true,
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          args: ['--no-sandbox'],
        });
        try {
          const ctx = await browser.createBrowserContext();
          const page = await ctx.newPage();
          await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
          const pageErrors = [];
          page.on('pageerror', (e) => pageErrors.push(e.message));
          await page.setRequestInterception(true);
          page.on('request', (req) => {
            const u = new URL(req.url());
            if (u.origin !== shedOrigin && !['data:', 'blob:'].includes(u.protocol)) req.abort();
            else req.continue();
          });

          const homeRes = await page.goto(`${shedOrigin}/tr`, { waitUntil: 'networkidle0' });
          assert.equal(homeRes.status(), 200);
          await page.evaluate(() => {
            const banner = document.querySelector('div.fixed.inset-x-0.bottom-0');
            const btn = banner && Array.from(banner.querySelectorAll('button')).pop();
            if (btn) btn.click();
          });

          await page.click('header button');
          await page.waitForSelector('[role="dialog"] input');
          await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find((b) =>
              (b.textContent || '').includes('Moda, Kadıköy')
            );
            btn.click();
          });
          await page.waitForSelector('[data-venue-id]', { timeout: 10000 });
          await page.click('[data-venue-id] h2');
          await page.waitForSelector('[role="dialog"] a[href^="https://maps.google.com/?cid="]');
          const sheetInfo = await page.evaluate(() => {
            const dlg = document.querySelector('[role="dialog"]');
            const link = dlg.querySelector('a[href^="https://maps.google.com/?cid="]');
            return { href: link?.getAttribute('href') || '', address: link?.textContent?.trim() || '' };
          });
          assert.match(sheetInfo.href, /^https:\/\/maps\.google\.com\/\?cid=\d+$/);
          assert.ok(sheetInfo.address.length > 8);
          assert.deepEqual(pageErrors, []);
          await ctx.close();
        } finally {
          await browser.close();
        }

        assert.equal(mockUpstashHits, 0, 'Shed mode must incur 0 Upstash calls on shed or core routes');
        assert.equal(mockSupabaseHits, 0, 'Shed mode must incur 0 Supabase calls');

        // Lockdown emergency mode unit checks: blocks admin publish/research/actions while keeping /tr + regions 200
        const em = loadTs('lib/pilot/emergencyMode.ts', { cache: new Map() });
        const lockEnv = { ...process.env, TRAFFIC_EMERGENCY_MODE: 'lockdown' };
        assert.equal(em.evaluateEmergencyShedding('/tr', 'GET', lockEnv).shed, false);
        assert.equal(em.evaluateEmergencyShedding('/api/gastronomy/regions/moda', 'GET', lockEnv).shed, false);
        assert.equal(em.evaluateEmergencyShedding('/api/gastronomy-admin/publish', 'POST', lockEnv).status, 503);
        assert.equal(em.evaluateEmergencyShedding('/api/gastronomy-admin/research', 'GET', lockEnv).status, 503);

        process.env.TRAFFIC_EMERGENCY_MODE = 'lockdown';
        const actions = loadTs('app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts', {
          cache: new Map(),
          mocks: {
            'next/cache': { revalidatePath: () => {} },
            'next/headers': { headers: async () => new Headers() },
            '@/lib/admin/offerAdminGuard': {
              requireOfferAdminAccess: async () => {
                throw new Error('Should not be reached in lockdown');
              },
            },
            '@/lib/offers': { offers: {} },
          },
        });
        const lockAct = await actions.createOffer(new FormData());
        assert.equal(lockAct.success, false);
        assert.equal(lockAct.status, 503);
        delete process.env.TRAFFIC_EMERGENCY_MODE;

        benchmarkReport.scenarioC_emergency = {
          shedRoutes,
          trackEventStatus: 202,
          upstashHits: mockUpstashHits,
          supabaseHits: mockSupabaseHits,
          lockdownAdminBlocked: true,
        };
      });
    } finally {
      nextShedProc.kill('SIGTERM');
    }

    const outPath = path.join(root, 'work/paket06-load-benchmark.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(benchmarkReport, null, 2));
    console.log(`\nALL PAKET 06 TRAFFIC & COST RESILIENCE CHECKS PASSED: ${passed} checks.`);
    console.log(`Benchmark telemetry saved to ${outPath}`);
  } finally {
    process.env = savedEnv;
    await new Promise((resolve) => mockInfraServer.close(resolve));
    if (savedTsconfig !== null) {
      fs.writeFileSync(tsconfigPath, savedTsconfig);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
