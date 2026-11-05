/**
 * High-concurrency surge traffic simulator.
 * Simulates viral Instagram/TikTok traffic spikes to Yerini Ayır.
 * Target: 100 concurrent visitors, 1000 requests to /tr?region=moda&category=kahve
 * and 50 concurrent requests to /api/gastronomy-public.
 */
const http = require('node:http');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ORIGIN = process.env.PERF_ORIGIN || 'http://127.0.0.1:3401';
const REPORT_DIR = path.resolve('work/release-system/load-test');
fs.mkdirSync(REPORT_DIR, { recursive: true });

async function makeRequest(url) {
  const start = performance.now();
  return new Promise((resolve, reject) => {
    http.get(url, { headers: { 'Accept': 'text/html,application/xhtml+xml,application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = performance.now() - start;
        resolve({
          status: res.statusCode,
          duration,
          bytes: Buffer.byteLength(data, 'utf8'),
        });
      });
    }).on('error', reject);
  });
}

async function runLoadTest(name, url, totalRequests, concurrency) {
  console.log(`\n=== Running Load Test: ${name} ===`);
  console.log(`Target: ${url}`);
  console.log(`Requests: ${totalRequests}, Concurrency: ${concurrency}`);

  const results = [];
  let inFlight = 0;
  let completed = 0;
  let requestIndex = 0;
  const overallStart = performance.now();

  return new Promise((resolve, reject) => {
    function launchNext() {
      if (completed >= totalRequests) {
        const totalDuration = performance.now() - overallStart;
        const durations = results.map(r => r.duration).sort((a, b) => a - b);
        const p50 = durations[Math.floor(durations.length * 0.50)];
        const p95 = durations[Math.floor(durations.length * 0.95)];
        const p99 = durations[Math.floor(durations.length * 0.99)];
        const rps = (totalRequests / (totalDuration / 1000)).toFixed(1);
        const errors = results.filter(r => r.status < 200 || r.status >= 300).length;

        const summary = {
          name,
          url,
          totalRequests,
          concurrency,
          totalDurationMs: Math.round(totalDuration),
          rps: parseFloat(rps),
          p50Ms: Math.round(p50 * 10) / 10,
          p95Ms: Math.round(p95 * 10) / 10,
          p99Ms: Math.round(p99 * 10) / 10,
          minMs: Math.round(durations[0] * 10) / 10,
          maxMs: Math.round(durations[durations.length - 1] * 10) / 10,
          errors,
          successRate: `${(((totalRequests - errors) / totalRequests) * 100).toFixed(2)}%`,
        };

        console.log(`Results: RPS=${rps}, p50=${summary.p50Ms}ms, p95=${summary.p95Ms}ms, p99=${summary.p99Ms}ms, Errors=${errors}/${totalRequests}`);
        resolve(summary);
        return;
      }

      while (inFlight < concurrency && requestIndex < totalRequests) {
        inFlight++;
        requestIndex++;
        makeRequest(url)
          .then(res => {
            results.push(res);
            inFlight--;
            completed++;
            launchNext();
          })
          .catch(err => {
            results.push({ status: 500, duration: 0, bytes: 0, error: err.message });
            inFlight--;
            completed++;
            launchNext();
          });
      }
    }

    launchNext();
  });
}

(async () => {
  try {
    // 1. Warm-up
    await makeRequest(`${ORIGIN}/tr?region=moda&category=kahve`);
    await makeRequest(`${ORIGIN}/api/gastronomy-public`);

    // 2. High-concurrency page surge (Instagram traffic spike)
    const pageSurge = await runLoadTest(
      'Instagram Viral Spike - Moda Coffee Page',
      `${ORIGIN}/tr?region=moda&category=kahve`,
      1000,
      100
    );

    // 3. High-concurrency API surge
    const apiSurge = await runLoadTest(
      'Client Hydration / API Query Surge',
      `${ORIGIN}/api/gastronomy-public`,
      500,
      50
    );

    const fullReport = {
      timestamp: new Date().toISOString(),
      tests: [pageSurge, apiSurge],
    };

    fs.writeFileSync(path.join(REPORT_DIR, 'surge-test-results.json'), JSON.stringify(fullReport, null, 2));

    // Assertions
    assert.equal(pageSurge.errors, 0, 'Page surge must have 0 errors');
    assert.equal(apiSurge.errors, 0, 'API surge must have 0 errors');
    assert.ok(pageSurge.p50Ms < 200, `Page surge p50 should be < 200ms, was ${pageSurge.p50Ms}ms`);
    assert.ok(pageSurge.rps > 250, `Page surge RPS should be > 250, was ${pageSurge.rps}`);
    assert.ok(apiSurge.p95Ms < 50, `API surge p95 should be < 50ms, was ${apiSurge.p95Ms}ms`);
    assert.ok(apiSurge.rps > 1000, `API surge RPS should be > 1000, was ${apiSurge.rps}`);

    console.log('\n✓ ALL SURGE LOAD TESTS PASSED (Zero errors, high throughput)');
  } catch (err) {
    console.error('Load test failed:', err);
    process.exit(1);
  }
})();
