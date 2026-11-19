// Run after `npx tsc --noEmit && npm run build`:
//   node scripts/verify_gastronomy_legal_and_hotel_separation.cjs
// Independently verifies Section 8 requirements for Gastronomy-only legal pages
// (natural person controller, cookie code parity, footer links) and initial-launch hotel surface separation.
require('./security/network-lock.cjs');

const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const loadTs = require('./security/load-ts.cjs');

const ROOT = process.cwd();
const TIMEOUT_MS = 180_000;
const watchdog = setTimeout(() => {
  console.error('\nFAIL: verify_gastronomy_legal_and_hotel_separation exceeded timeout watchdog.');
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

function rawHttpRequest(port, reqPath, hostHeader = 'www.yeriniayir.com') {
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

function extractCanonical(html) {
  const m =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return m ? m[1] : null;
}

(async () => {
  let nextProc = null;
  try {
    assert.ok(fs.existsSync(path.join(ROOT, '.next/prerender-manifest.json')), '.next build required first');

    await check('1. All 5 legal pages contain zero hotel, booking, corporate, MERSIS, newsletter, or Booking.com claims', async () => {
      const legalFiles = [
        'app/[lang]/(main)/(legal)/kullanim-kosullari/page.tsx',
        'app/[lang]/(main)/(legal)/gizlilik-politikasi/page.tsx',
        'app/[lang]/(main)/(legal)/kvkk-aydinlatma-metni/page.tsx',
        'app/[lang]/(main)/(legal)/cerez-politikasi/page.tsx',
        'app/[lang]/(main)/(legal)/kullanim-sartlari/page.tsx',
      ];
      const forbiddenRe =
        /otel|hotel|booking|rezervasyon|şirket|company|corporate|mersis|vergi no|bülten|hukuk birimi|gnkotel|revize|konaklama|oda fiyatı|iptal\/iade/i;

      for (const rel of legalFiles) {
        const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
        const m = src.match(forbiddenRe);
        assert.equal(m, null, `Prohibited term "${m && m[0]}" found in ${rel}`);
        assert.ok(src.includes('info@yeriniayir.com'), `Missing info@yeriniayir.com in ${rel}`);
        assert.ok(!src.includes('27.12.2025'), `Outdated revision date remains in ${rel}`);
      }

      for (const rel of legalFiles.slice(0, 3)) {
        const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
        assert.ok(src.includes('[İlgili Bilgiler Eklenecektir]'), `Missing honest natural-person placeholder in ${rel}`);
      }
      const legacyTermsSrc = fs.readFileSync(path.join(ROOT, legalFiles[4]), 'utf8');
      const nums = Array.from(legacyTermsSrc.matchAll(/<h[23][^>]*>(\d+)\.\s+/g)).map((x) => Number(x[1]));
      assert.deepEqual(nums, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    await check('2. Cookie policy, KVKK, and dictionaries match real code behavior (ya_rl_anon, localStorage, opt-in GA4/Clarity, fixed banner links)', async () => {
      const rateLimitSrc = fs.readFileSync(path.join(ROOT, 'lib/pilot/rateLimit.ts'), 'utf8');
      assert.match(rateLimitSrc, /RATE_LIMIT_COOKIE_NAME\s*=\s*'ya_rl_anon'/);
      assert.match(rateLimitSrc, /ANON_COOKIE_TTL_SEC\s*=\s*15\s*\*\s*60/);
      assert.match(rateLimitSrc, /HttpOnly;\s*SameSite=Lax/);

      const consentSrc = fs.readFileSync(path.join(ROOT, 'lib/cookieConsent.ts'), 'utf8');
      assert.match(consentSrc, /COOKIE_CONSENT_STORAGE_KEY\s*=\s*'cookie-consent-granular'/);
      assert.match(consentSrc, /COOKIE_SETTINGS_HASH\s*=\s*'#cerez-ayarlari'/);

      const analyticsSrc = fs.readFileSync(path.join(ROOT, 'components/ConsentManagedAnalytics.tsx'), 'utf8');
      assert.match(analyticsSrc, /clarityId\s*=\s*'ufxa278rg4'/);
      assert.match(analyticsSrc, /analytics_storage:\s*'denied'/);

      const cookiePolicySrc = fs.readFileSync(
        path.join(ROOT, 'app/[lang]/(main)/(legal)/cerez-politikasi/page.tsx'),
        'utf8'
      );
      for (const token of [
        'ya_rl_anon',
        'Max-Age=900',
        '15 dakika',
        'HttpOnly',
        'SameSite=Lax',
        'cookie-consent-granular',
        'localStorage',
        '#cerez-ayarlari',
        'Google Analytics 4',
        'Microsoft Clarity',
        '_ga',
        '_clck',
        '_clsk',
        'denied',
      ]) {
        assert.ok(cookiePolicySrc.includes(token), `Cookie policy missing real code token: ${token}`);
      }

      const kvkkSrc = fs.readFileSync(
        path.join(ROOT, 'app/[lang]/(main)/(legal)/kvkk-aydinlatma-metni/page.tsx'),
        'utf8'
      );
      for (const token of ['ya_rl_anon', 'SHA-256', 'cookie-consent-granular', 'Konumumu Kullan', 'Google Analytics 4', 'Microsoft Clarity', 'Vercel', 'Upstash', 'Supabase', '5651']) {
        assert.ok(kvkkSrc.includes(token), `KVKK disclosure missing real processing token: ${token}`);
      }

      const trDict = JSON.parse(fs.readFileSync(path.join(ROOT, 'dictionaries/tr.json'), 'utf8'));
      const enDict = JSON.parse(fs.readFileSync(path.join(ROOT, 'dictionaries/en.json'), 'utf8'));
      assert.ok(trDict.cookie_banner.description.includes('href="/tr/cerez-politikasi"'));
      assert.equal(trDict.cookie_banner.description.includes('/tr/gizlilik-politikasi'), false);
      assert.ok(enDict.cookie_banner.description.includes('href="/en/cerez-politikasi"'));
      assert.equal(enDict.cookie_banner.description.includes('/en/privacy-policy'), false);

      // Dictionaries about/seo must contain zero hotel claims
      const trAboutSeo = JSON.stringify({ about: trDict.about, seo: trDict.seo });
      const enAboutSeo = JSON.stringify({ about: enDict.about, seo: enDict.seo });
      assert.equal(/otel|konaklama|tatil/i.test(trAboutSeo), false, `Hotel term found in tr about/seo: ${trAboutSeo}`);
      assert.equal(/hotel|holiday|stay/i.test(enAboutSeo), false, `Hotel term found in en about/seo: ${enAboutSeo}`);
    });

    await check('3. Sitemap gates legacy hotels OFF by default even when Supabase is connected and preserves 1,529 gastronomy URLs', async () => {
      const { isHotelSurfaceEnabled } = loadTs('lib/hotelLaunchGate.ts', { cache: new Map() });
      assert.equal(isHotelSurfaceEnabled({}), false);
      assert.equal(isHotelSurfaceEnabled({ ENABLE_HOTEL_SURFACE: '0' }), false);
      assert.equal(isHotelSurfaceEnabled({ ENABLE_HOTEL_SURFACE: '1' }), true);

      let getAllCalled = 0;
      const savedFlag = process.env.ENABLE_HOTEL_SURFACE;
      const savedPubFlag = process.env.NEXT_PUBLIC_ENABLE_HOTEL_SURFACE;
      delete process.env.ENABLE_HOTEL_SURFACE;
      delete process.env.NEXT_PUBLIC_ENABLE_HOTEL_SURFACE;
      try {
        const sitemapMod = loadTs('app/sitemap.ts', {
          cache: new Map(),
          mocks: {
            '@/lib/supabase': { isSupabaseIsolated: false },
            '@/lib/db': {
              db: {
                hotels: {
                  getAll: async () => {
                    getAllCalled++;
                    return [{ id: '11111111-1111-4111-8111-111111111111', slug: 'should-stay-hidden' }];
                  },
                },
                articles: { getAll: async () => [] },
              },
            },
          },
        });
        const entries = await sitemapMod.default();
        assert.equal(getAllCalled, 0, 'db.hotels.getAll() must not run when ENABLE_HOTEL_SURFACE is off');
        assert.equal(
          entries.some((e) => /\/otel\/|\/hotel\/|should-stay-hidden/.test(e.url)),
          false,
          'Default Gastronomy sitemap must NEVER contain hotel URLs'
        );
      } finally {
        if (savedFlag !== undefined) process.env.ENABLE_HOTEL_SURFACE = savedFlag;
        if (savedPubFlag !== undefined) process.env.NEXT_PUBLIC_ENABLE_HOTEL_SURFACE = savedPubFlag;
      }
    });

    const nextPort = await getFreePort();
    const childEnv = {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(nextPort),
      HOSTNAME: '127.0.0.1',
      RATE_LIMIT_ENFORCE: '1',
      RATE_LIMIT_COOKIE_SECRET: 'paket10d-legal-verification-secret-9876543210',
    };
    delete childEnv.ENABLE_HOTEL_SURFACE;
    delete childEnv.NEXT_PUBLIC_ENABLE_HOTEL_SURFACE;
    delete childEnv.GASTRONOMY_LOCAL_PREVIEW;
    delete childEnv.NEXT_PUBLIC_GASTRONOMY_LOCAL_PREVIEW;

    nextProc = await new Promise((resolve, reject) => {
      const p = spawn(
        process.execPath,
        ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(nextPort)],
        { cwd: ROOT, env: childEnv, stdio: ['ignore', 'pipe', 'pipe'] }
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

    await check('4. Live gastronomy footers expose all 4 legal routes + #cerez-ayarlari and leak zero hotel CTAs', async () => {
      const { PILOT_VENUE_IDS } = loadTs('lib/gastronomy-v3/geoPilot.ts', { cache: new Map() });
      const firstPilot = PILOT_VENUE_IDS[0];
      assert.ok(firstPilot);

      for (const reqPath of [
        '/tr',
        '/tr/gastronomi',
        '/tr/gastronomi/istanbul',
        '/tr/gastronomi/istanbul/kadikoy/moda',
        `/tr/gastronomi/mekan/${firstPilot}`,
      ]) {
        const res = await rawHttpRequest(nextPort, reqPath, 'www.yeriniayir.com');
        assert.equal(res.status, 200, `Expected 200 on ${reqPath}`);
        for (const href of [
          '/tr/kullanim-kosullari',
          '/tr/gizlilik-politikasi',
          '/tr/cerez-politikasi',
          '/tr/kvkk-aydinlatma-metni',
          '#cerez-ayarlari',
        ]) {
          assert.ok(res.body.includes(href), `Missing footer legal link "${href}" on ${reqPath}`);
        }
        assert.equal(/Oteller|seçkin konaklama|@geceligi|gnkoteller/i.test(res.body), false, `Hotel leak on ${reqPath}`);
      }

      const rootHtml = (await rawHttpRequest(nextPort, '/tr', 'www.yeriniayir.com')).body;
      assert.equal(rootHtml.includes('/search?q={search_term_string}'), false, 'Root WebSite JSON-LD must not expose hotel /search action');
      assert.equal(/seçkin konaklama|otel önerileri/i.test(rootHtml), false, 'Root metadata/Organization JSON-LD leaked hotel text');
    });

    await check('5. Live About, Header, Footer, RSS feed, manifest, sitemap, and legacy hotel noindex gates hold', async () => {
      const aboutRes = await rawHttpRequest(nextPort, '/tr/hakkimizda', 'www.yeriniayir.com');
      assert.equal(aboutRes.status, 200);
      assert.equal(/Fethiye Otelleri|Antalya Otelleri|#oteller|@geceligi|turkeyandhotels|gnkoteller/i.test(aboutRes.body), false);
      assert.ok(aboutRes.body.includes('info@yeriniayir.com'));
      assert.ok(aboutRes.body.includes('href="/tr/cerez-politikasi"'));
      assert.ok(aboutRes.body.includes('href="#cerez-ayarlari"'));

      const trFeed = await rawHttpRequest(nextPort, '/tr/feed.xml', 'www.yeriniayir.com');
      assert.equal(trFeed.status, 200);
      const trHeader = trFeed.body.split('<item>')[0];
      assert.equal(/konaklama|butik otel/i.test(trHeader), false, `Hotel mention in TR feed header: ${trHeader}`);

      const enFeed = await rawHttpRequest(nextPort, '/en/feed.xml', 'www.worldandhotels.com');
      assert.equal(enFeed.status, 200);
      const enHeader = enFeed.body.split('<item>')[0];
      assert.equal(/boutique stays|hotel/i.test(enHeader.replace(/worldandhotels\.com/gi, '')), false, `Hotel mention in EN feed header: ${enHeader}`);

      const manifestRes = await rawHttpRequest(nextPort, '/manifest.webmanifest', 'www.yeriniayir.com');
      assert.equal(manifestRes.status, 200);
      assert.equal(/otel/i.test(manifestRes.body), false, `Manifest still mentions otel: ${manifestRes.body}`);

      const sitemapRes = await rawHttpRequest(nextPort, '/sitemap.xml', 'www.yeriniayir.com');
      assert.equal(sitemapRes.status, 200);
      const locs = [...sitemapRes.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      assert.equal(locs.length, 1529, `Expected exact 1529 gastronomy sitemap URLs, got ${locs.length}`);
      assert.equal(locs.some((u) => /\/otel\/|\/hotel\//.test(u)), false);

      // Legacy hotel & offer pages must be noindex in initial gastronomy launch
      for (const [reqPath, host] of [
        ['/tr/otel/demo-indirimli-1', 'www.yeriniayir.com'],
        ['/hotel/demo-indirimli-1', 'www.worldandhotels.com'],
        ['/tr/hoteloffer', 'www.yeriniayir.com'],
        ['/tr/search', 'www.yeriniayir.com'],
      ]) {
        const res = await rawHttpRequest(nextPort, reqPath, host);
        assert.equal(res.headers['x-robots-tag'], 'noindex, nofollow', `Missing X-Robots-Tag noindex on ${reqPath}`);
      }
    });

    await check('6. Live HTTP check of all 5 legal routes across TR & EN hosts/locales + canonical/robots parity', async () => {
      for (const slug of ['kullanim-kosullari', 'gizlilik-politikasi', 'cerez-politikasi', 'kvkk-aydinlatma-metni']) {
        for (const [reqPath, host] of [
          [`/tr/${slug}`, 'www.yeriniayir.com'],
          [`/${slug}`, 'www.yeriniayir.com'],
          [`/en/${slug}`, 'www.worldandhotels.com'],
          [`/${slug}`, 'www.worldandhotels.com'],
        ]) {
          const res = await rawHttpRequest(nextPort, reqPath, host);
          assert.equal(res.status, 200, `Expected 200 on ${host}${reqPath}`);
          assert.equal(extractCanonical(res.body), `https://www.yeriniayir.com/${slug}`);
          assert.equal(/Booking\.com|gnkotel|Hukuk Birimi|MERSİS/i.test(res.body), false, `Forbidden text on live ${host}${reqPath}`);
        }
      }

      const legacyTerms = await rawHttpRequest(nextPort, '/tr/kullanim-sartlari', 'www.yeriniayir.com');
      assert.equal(legacyTerms.status, 200);
      assert.equal(legacyTerms.headers['x-robots-tag'], 'noindex, nofollow');
      assert.equal(extractCanonical(legacyTerms.body), 'https://www.yeriniayir.com/kullanim-kosullari');
      assert.equal(/Booking\.com|gnkotel|Hukuk Birimi|otellerin/i.test(legacyTerms.body), false);
    });

    console.log(`\nALL ${passed}/${passed} GASTRONOMY LEGAL & HOTEL SEPARATION CHECKS PASSED.`);
  } finally {
    await stopChild(nextProc);
  }
})().catch((err) => {
  console.error('\nFAIL:', err && err.stack ? err.stack : err);
  process.exit(1);
});
