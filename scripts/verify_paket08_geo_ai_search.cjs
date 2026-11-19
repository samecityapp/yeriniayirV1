// Automated Paket 08 GEO & AI Search Verification Suite (Offline + Socket-Locked)
// Run after `npm run build`: node scripts/verify_paket08_geo_ai_search.cjs
require('./security/network-lock.cjs');

const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { createRequire } = require('node:module');
const loadTs = require('./security/load-ts.cjs');

const root = process.cwd();
const repoRequire = createRequire(path.join(root, 'package.json'));
const puppeteer = repoRequire('puppeteer');

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

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function stripTagsAndScripts(html) {
  return decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    blocks.push(JSON.parse(m[1]));
  }
  return blocks;
}

function extractAlternatesAndCanonical(html) {
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const hreflangs = {};
  const altRe = /<link[^>]+rel=["']alternate["'][^>]*>/gi;
  let m;
  while ((m = altRe.exec(html)) !== null) {
    const tag = m[0];
    const hl = tag.match(/hrefLang=["']([^"']+)["']/i) || tag.match(/hreflang=["']([^"']+)["']/i);
    const href = tag.match(/href=["']([^"']+)["']/i);
    if (hl && href) {
      hreflangs[hl[1]] = href[1];
    }
  }
  return {
    canonical: canonicalMatch ? canonicalMatch[1] : null,
    hreflangs,
  };
}

function jaccardSimilarity(textA, textB) {
  const tok = (s) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-zçğıöşü0-9\s]/gi, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 4)
    );
  const a = tok(textA);
  const b = tok(textB);
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

(async () => {
  assert.ok(fs.existsSync(path.join(root, '.next/prerender-manifest.json')), '.next build required');

  const { V3_LOCATIONS, getPublishedV3Snapshot } = loadTs('lib/gastronomy-v3/registry.ts', { cache: new Map() });
  const { PILOT_VENUE_IDS, resolveGeoPilotVenue, getPilotEditorial } = loadTs('lib/gastronomy-v3/geoPilot.ts', {
    cache: new Map(),
  });
  const { FORBIDDEN_VISITOR_COPY_REGEX } = loadTs('lib/gastronomy-v3/policy.ts', { cache: new Map() });
  const { getGeoCities } = loadTs('lib/gastronomy-v3/geoCatalog.ts', { cache: new Map() });

  const cities = getGeoCities();
  const modaSnap = getPublishedV3Snapshot('moda');
  const kadikoySnap = getPublishedV3Snapshot('kadikoy');
  assert.equal(cities.length, 21);
  assert.equal(V3_LOCATIONS.length, 92);
  assert.equal(PILOT_VENUE_IDS.length, 18);

  let mockUpstashHits = 0;
  let mockDbHits = 0;
  let runtimeEmergencyRedisValue = 'off';

  const mockPort = await getFreePort();
  const mockServer = http.createServer((req, res) => {
    const u = new URL(req.url || '/', 'http://127.0.0.1');
    if (u.pathname.startsWith('/upstash/get/')) {
      mockUpstashHits++;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: runtimeEmergencyRedisValue }));
      return;
    }
    if (u.pathname.startsWith('/upstash')) {
      mockUpstashHits++;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: 1 }));
      return;
    }
    mockDbHits++;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([]));
  });
  await new Promise((r) => mockServer.listen(mockPort, '127.0.0.1', r));

  const nextPort = await getFreePort();
  const origin = `http://127.0.0.1:${nextPort}`;
  const childEnv = {
    ...process.env,
    NODE_ENV: 'production',
    NODE_OPTIONS: `--require ${path.join(root, 'scripts/security/network-lock.cjs')}`,
    APP_ENVIRONMENT: 'test',
    GASTRONOMY_AUTH_MODE: 'supabase',
    GASTRONOMY_LOCAL_PREVIEW: '0',
    RATE_LIMIT_ENFORCE: '1',
    EMERGENCY_RUNTIME_UPSTASH: '1',
    EMERGENCY_MODE_CACHE_TTL_MS: '120',
    ADMIN_PASSWORD: crypto.randomBytes(16).toString('hex'),
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
    { cwd: root, env: childEnv }
  );

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox'],
  });

  try {
    await waitForNextReady(nextProc);

    // -------------------------------------------------------------------------
    // 1. robots.txt, sitemap.xml, llms.txt & llms-full.txt
    // -------------------------------------------------------------------------
    await check('1. robots.txt, sitemap.xml, llms.txt & llms-full.txt expose AI search bots, 92 regions & only 18 pilot venues', async () => {
      const robotsRes = await fetch(`${origin}/robots.txt`);
      assert.equal(robotsRes.status, 200);
      const robotsTxt = await robotsRes.text();
      for (const ua of [
        'OAI-SearchBot',
        'ChatGPT-User',
        'GPTBot',
        'PerplexityBot',
        'Perplexity-User',
        'Googlebot',
        'Google-Extended',
        'Bingbot',
        'ClaudeBot',
        'Claude-SearchBot',
      ]) {
        assert.ok(robotsTxt.includes(ua), `robots.txt missing rule for ${ua}`);
      }
      assert.ok(robotsTxt.includes('Allow: /llms.txt'));
      assert.ok(robotsTxt.includes('Allow: /llms-full.txt'));
      assert.ok(robotsTxt.includes('Disallow: /jilinrime/'));
      assert.ok(robotsTxt.includes('Disallow: /api/'));
      assert.ok(robotsTxt.includes('https://www.yeriniayir.com/sitemap.xml'));
      assert.ok(robotsTxt.includes('https://www.worldandhotels.com/sitemap.xml'));

      const sitemapRes = await fetch(`${origin}/sitemap.xml`);
      assert.equal(sitemapRes.status, 200);
      const sitemapXml = await sitemapRes.text();
      assert.ok(sitemapXml.includes('https://www.yeriniayir.com/gastronomi</loc>'));
      assert.ok(sitemapXml.includes('https://www.worldandhotels.com/gastronomy</loc>'));
      assert.ok(sitemapXml.includes('https://www.yeriniayir.com/gastronomi/istanbul/kadikoy/moda</loc>'));
      assert.ok(sitemapXml.includes('https://www.yeriniayir.com/gastronomi/istanbul/kadikoy/moda/kahve</loc>'));
      assert.ok(sitemapXml.includes('https://www.yeriniayir.com/gastronomi/istanbul</loc>'));
      for (const loc of V3_LOCATIONS) {
        assert.ok(
          sitemapXml.includes(`https://www.yeriniayir.com/gastronomi/${loc.path.join('/')}</loc>`),
          `sitemap missing region ${loc.slug}`
        );
      }
      for (const pid of PILOT_VENUE_IDS) {
        assert.ok(sitemapXml.includes(`https://www.yeriniayir.com/gastronomi/mekan/${pid}</loc>`));
        assert.ok(sitemapXml.includes(`https://www.worldandhotels.com/gastronomy/venue/${pid}</loc>`));
      }
      // Anti-thin-content check: non-pilot venues must NEVER appear in sitemap.xml
      assert.equal(sitemapXml.includes('/mekan/moda-il-sud'), false);
      assert.equal(sitemapXml.includes('/mekan/carsi-pizz-italia'), false);

      const llmsRes = await fetch(`${origin}/llms.txt`);
      const llmsFullRes = await fetch(`${origin}/llms-full.txt`);
      assert.equal(llmsRes.status, 200);
      assert.equal(llmsFullRes.status, 200);
      const llmsTxt = await llmsRes.text();
      const llmsFullTxt = await llmsFullRes.text();
      assert.ok(llmsTxt.includes('/gastronomi/istanbul/kadikoy/moda'));
      assert.ok(llmsTxt.includes('/gastronomi/mekan/moda-gg-pizza'));
      assert.ok(llmsFullTxt.includes('GG Pizza Moda'));
      assert.ok(llmsFullTxt.includes('Çiya Sofrası'));
      assert.equal(FORBIDDEN_VISITOR_COPY_REGEX.test(llmsTxt), false);
      assert.equal(FORBIDDEN_VISITOR_COPY_REGEX.test(llmsFullTxt), false);
      assert.equal(/userRatingCount|reviewCount/i.test(llmsFullTxt), false);
    });

    // -------------------------------------------------------------------------
    // 2. Zero-JS Raw HTML Semantic Content & Entity Recall (+ ISR + 404 Gates)
    // -------------------------------------------------------------------------
    await check('2. Raw HTML (no JS) delivers 100% of Moda (29) & Kadikoy (32) venues, ISR works cleanly, invalid/pruned routes return 404', async () => {
      const upBefore = mockUpstashHits;
      const dbBefore = mockDbHits;

      // Baseline /tr root HTML has crawl links to Moda & /tr/gastronomi (whereas pre-GEO SPA cards hid all 29 Moda stops behind client JS)
      const trRootHtml = await (await fetch(`${origin}/tr`)).text();
      assert.ok(trRootHtml.includes('/tr/gastronomi/istanbul/kadikoy/moda'));
      assert.ok(trRootHtml.includes('/tr/gastronomi/istanbul'));

      // Moda neighborhood page: all 29 venues readable in raw HTML without executing JS!
      const modaRes = await fetch(`${origin}/tr/gastronomi/istanbul/kadikoy/moda`);
      assert.equal(modaRes.status, 200);
      const modaHtml = await modaRes.text();
      const modaVisible = stripTagsAndScripts(modaHtml);
      let modaFoundInRawHtml = 0;
      for (const v of modaSnap.venues) {
        if (modaVisible.includes(v.name) && modaHtml.includes(v.mapsUri)) modaFoundInRawHtml++;
      }
      assert.equal(
        modaFoundInRawHtml,
        modaSnap.venues.length,
        `Expected ${modaSnap.venues.length}/29 Moda venues in visible no-JS HTML, got ${modaFoundInRawHtml}`
      );
      assert.ok(modaHtml.includes('/tr/gastronomi/mekan/moda-vermilion'));
      assert.ok(modaHtml.includes('/tr/gastronomi/istanbul/kadikoy/moda/kahve'));

      // Kadikoy center page: all 32 venues + 7 child neighborhoods linked in raw HTML!
      const kadikoyRes = await fetch(`${origin}/tr/gastronomi/istanbul/kadikoy`);
      assert.equal(kadikoyRes.status, 200);
      const kadikoyHtml = await kadikoyRes.text();
      const kadikoyVisible = stripTagsAndScripts(kadikoyHtml);
      let kadikoyFoundInRawHtml = 0;
      for (const v of kadikoySnap.venues) {
        if (kadikoyVisible.includes(v.name)) kadikoyFoundInRawHtml++;
      }
      assert.equal(kadikoyFoundInRawHtml, kadikoySnap.venues.length);
      for (const childSlug of [
        '/tr/gastronomi/istanbul/kadikoy/moda',
        '/tr/gastronomi/istanbul/kadikoy/yeldegirmeni',
        '/tr/gastronomi/istanbul/kadikoy/bostanci',
      ]) {
        assert.ok(kadikoyHtml.includes(childSlug), `Missing child link ${childSlug}`);
      }

      // Category page TR & EN rewrite
      const modaKahveTr = await (await fetch(`${origin}/tr/gastronomi/istanbul/kadikoy/moda/kahve`)).text();
      assert.ok(modaKahveTr.includes('Vermilion Coffee'));
      assert.ok(modaKahveTr.includes('Montag Espresso Bar'));
      assert.ok(modaKahveTr.includes('Komşu') || modaKahveTr.includes('400 m') || modaKahveTr.includes('400 Metre'));

      const modaKahveEnRes = await fetch(`${origin}/en/gastronomy/istanbul/kadikoy/moda/kahve`);
      assert.equal(modaKahveEnRes.status, 200);
      const modaKahveEn = await modaKahveEnRes.text();
      assert.ok(modaKahveEn.includes('Specialty Coffee'));
      assert.ok(modaKahveEn.includes('Vermilion Coffee'));

      // Non-pre-rendered ISR pages (cities/districts/regions outside static build list) work with 0 DB / 0 Upstash
      for (const isrUrl of [
        `${origin}/tr/gastronomi/mugla/bodrum`,
        `${origin}/tr/gastronomi/gaziantep/merkez`,
        `${origin}/tr/gastronomi/izmir/cesme/alacati`,
      ]) {
        const r = await fetch(isrUrl);
        assert.equal(r.status, 200, `Expected 200 ISR for ${isrUrl}`);
      }

      // Live domain Host rewrite checks (yeriniayir.com & worldandhotels.com without external DNS)
      const hostGet = (hostHeader, reqPath) =>
        new Promise((resolve, reject) => {
          const req = http.request(
            { hostname: '127.0.0.1', port: nextPort, path: reqPath, method: 'GET', headers: { host: hostHeader } },
            (res) => {
              const chunks = [];
              res.on('data', (c) => chunks.push(c));
              res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
            }
          );
          req.on('error', reject);
          req.end();
        });

      const trDomainModa = await hostGet('www.yeriniayir.com', '/gastronomi/istanbul/kadikoy/moda');
      assert.equal(trDomainModa.status, 200);
      assert.ok(trDomainModa.body.includes('GG Pizza Moda'));

      const enDomainModa = await hostGet('www.worldandhotels.com', '/gastronomy/istanbul/kadikoy/moda');
      assert.equal(enDomainModa.status, 200);
      assert.ok(enDomainModa.body.includes('Vermilion Coffee'));

      const enDomainVenue = await hostGet('www.worldandhotels.com', '/gastronomy/venue/moda-vermilion');
      assert.equal(enDomainVenue.status, 200);
      assert.ok(enDomainVenue.body.includes('Single-Origin V60'));

      // Quality & anti-doorway negative gates MUST return 404
      assert.equal((await fetch(`${origin}/tr/gastronomi/istanbul/besiktas/bebek/pizza`)).status, 404);
      assert.equal((await fetch(`${origin}/tr/gastronomi/mekan/moda-il-sud`)).status, 404);
      assert.equal((await fetch(`${origin}/tr/gastronomi/ankara/olmayan-semt`)).status, 404);

      assert.equal(mockUpstashHits, upBefore, 'GEO pages must incur 0 Upstash calls');
      assert.equal(mockDbHits, dbBefore, 'GEO pages must incur 0 Supabase DB calls');
    });

    // -------------------------------------------------------------------------
    // 3. Schema.org JSON-LD, Canonical & hreflang Validation
    // -------------------------------------------------------------------------
    await check('3. Schema.org JSON-LD (CollectionPage/ItemList/Restaurant/FAQPage/BreadcrumbList), canonical & hreflang pass cleanly', async () => {
      const schemaTargets = [
        {
          url: `${origin}/tr`,
          expectedTypes: ['Organization', 'WebSite', 'CollectionPage'],
          expectedCanonical: 'https://www.yeriniayir.com',
        },
        {
          url: `${origin}/tr/gastronomi`,
          expectedTypes: ['BreadcrumbList', 'CollectionPage'],
          expectedCanonical: 'https://www.yeriniayir.com/gastronomi',
        },
        {
          url: `${origin}/tr/gastronomi/istanbul/kadikoy/moda`,
          expectedTypes: ['BreadcrumbList', 'CollectionPage', 'FAQPage'],
          expectedCanonical: 'https://www.yeriniayir.com/gastronomi/istanbul/kadikoy/moda',
        },
        {
          url: `${origin}/en/gastronomy/istanbul/kadikoy/moda`,
          expectedTypes: ['BreadcrumbList', 'CollectionPage', 'FAQPage'],
          expectedCanonical: 'https://www.worldandhotels.com/gastronomy/istanbul/kadikoy/moda',
        },
        {
          url: `${origin}/tr/gastronomi/mekan/moda-vermilion`,
          expectedTypes: ['CafeOrCoffeeShop', 'BreadcrumbList', 'FAQPage'],
          expectedCanonical: 'https://www.yeriniayir.com/gastronomi/mekan/moda-vermilion',
        },
        {
          url: `${origin}/en/gastronomy/venue/carsi-ciya-sofrasi`,
          expectedTypes: ['Restaurant', 'BreadcrumbList', 'FAQPage'],
          expectedCanonical: 'https://www.worldandhotels.com/gastronomy/venue/carsi-ciya-sofrasi',
        },
      ];

      for (const spec of schemaTargets) {
        const res = await fetch(spec.url);
        assert.equal(res.status, 200, `Failed ${spec.url}`);
        const html = await res.text();
        const blocks = extractJsonLdBlocks(html);
        const types = blocks.map((b) => b['@type']);
        for (const t of spec.expectedTypes) {
          assert.ok(types.includes(t), `${spec.url} missing JSON-LD @type=${t} (got ${types.join(',')})`);
        }
        const serialized = JSON.stringify(blocks);
        assert.equal(
          /reviewCount|userRatingCount|en iyi|rakipsiz|mükemmel/i.test(serialized),
          false,
          `Forbidden metadata/copy inside JSON-LD for ${spec.url}`
        );

        const meta = extractAlternatesAndCanonical(html);
        assert.equal(meta.canonical, spec.expectedCanonical, `Canonical mismatch for ${spec.url}`);
        assert.ok(meta.hreflangs['tr-TR']?.startsWith('https://www.yeriniayir.com'));
        assert.ok(meta.hreflangs['en']?.startsWith('https://www.worldandhotels.com'));
        assert.ok(meta.hreflangs['x-default']?.startsWith('https://www.yeriniayir.com'));
      }
    });

    // -------------------------------------------------------------------------
    // 4. All 18 Pilot Venue Pages: Uniqueness (Jaccard < 0.35), Depth & Visitor Copy Gate
    // -------------------------------------------------------------------------
    await check('4. All 18 pilot venue detail pages render richly in TR & EN, avoid template duplication (Jaccard < 0.35), and pass visitor copy rules', async () => {
      const trEditorials = [];
      let maxJaccard = 0;

      for (const vid of PILOT_VENUE_IDS) {
        const resolved = await resolveGeoPilotVenue(vid);
        assert.ok(resolved);
        const editorial = getPilotEditorial(vid);
        const combined = `${editorial.culinaryIdentity.tr} ${editorial.microLocationContext.tr} ${editorial.selectionComparison.tr}`;
        for (const prev of trEditorials) {
          const sim = jaccardSimilarity(combined, prev.text);
          if (sim > maxJaccard) maxJaccard = sim;
          assert.ok(
            sim < 0.35,
            `Pilot venue prose too similar between ${vid} and ${prev.id}: Jaccard=${sim.toFixed(3)}`
          );
        }
        trEditorials.push({ id: vid, text: combined });

        for (const [lang, url] of [
          ['tr', `${origin}/tr/gastronomi/mekan/${vid}`],
          ['en', `${origin}/en/gastronomy/venue/${vid}`],
        ]) {
          const res = await fetch(url);
          assert.equal(res.status, 200, `${url} should be 200`);
          const html = await res.text();
          const visible = stripTagsAndScripts(html);
          assert.ok(visible.includes(resolved.snapshotVenue.name), `${url} missing name`);
          assert.ok(visible.includes(resolved.snapshotVenue.address), `${url} missing address`);
          assert.ok(html.includes(resolved.snapshotVenue.mapsUri), `${url} missing mapsUri`);
          assert.equal(
            FORBIDDEN_VISITOR_COPY_REGEX.test(visible),
            false,
            `${url} matched FORBIDDEN_VISITOR_COPY_REGEX: ${visible.match(FORBIDDEN_VISITOR_COPY_REGEX)?.[0]}`
          );
          assert.equal(
            /userRatingCount|reviewCount|Michelin|Gault|Time Out|Barista Magazine|tattım|denedim/i.test(visible),
            false,
            `${url} leaked forbidden internal word`
          );
        }
      }
      console.log(`  Pilot 18-venue max pairwise Jaccard similarity: ${maxJaccard.toFixed(3)} (< 0.35 OK)`);
    });

    // -------------------------------------------------------------------------
    // 5. AI Bot Access + Admin Security Preservation + Emergency Shed Compatibility
    // -------------------------------------------------------------------------
    await check('5. AI crawlers get 200 OK without rate-limit/Upstash penalty while spoofed admin probes remain 401/403 and GEO stays live during shed', async () => {
      const botAgents = [
        'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot',
        'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
        'Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)',
        'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0)',
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
        'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-SearchBot/1.0)',
      ];
      const botTargets = [
        '/tr/gastronomi',
        '/tr/gastronomi/istanbul/kadikoy/moda',
        '/tr/gastronomi/istanbul/kadikoy/moda/kahve',
        '/tr/gastronomi/mekan/moda-vermilion',
        '/en/gastronomy/venue/carsi-ciya-sofrasi',
        '/llms.txt',
        '/robots.txt',
        '/sitemap.xml',
        '/tr',
        '/api/gastronomy/regions/moda',
      ];

      const upBefore = mockUpstashHits;
      for (let i = 0; i < 70; i++) {
        const ua = botAgents[i % botAgents.length];
        const target = botTargets[i % botTargets.length];
        const res = await fetch(`${origin}${target}`, {
          headers: { 'User-Agent': ua, 'x-real-ip': '20.15.88.10' },
        });
        assert.equal(res.status, 200, `AI bot ${ua} blocked on ${target}: ${res.status}`);
      }
      assert.equal(mockUpstashHits, upBefore, '70 AI crawler hits on GEO routes must use 0 Upstash calls');

      // Spoofed AI Bot User-Agent probing protected admin endpoints MUST still be rejected!
      const spoofedAdmin = await fetch(`${origin}/tr/jilinrime`, {
        headers: { 'User-Agent': 'OAI-SearchBot/1.0' },
      });
      assert.equal(spoofedAdmin.status, 401);

      const spoofedPublish = await fetch(`${origin}/api/gastronomy-admin/publish`, {
        method: 'POST',
        headers: {
          'User-Agent': 'Googlebot/2.1',
          Origin: origin,
          Host: `127.0.0.1:${nextPort}`,
          'Content-Type': 'application/json',
        },
        body: '{}',
      });
      assert.ok([401, 403].includes(spoofedPublish.status));

      // Live Upstash Emergency SHED sheds /tr/search (503) while keeping ALL GEO routes 200 OK (0 Upstash)
      runtimeEmergencyRedisValue = 'shed';
      await new Promise((r) => setTimeout(r, 180));
      const shedSearch = await fetch(`${origin}/tr/search`);
      assert.equal(shedSearch.status, 503);
      const hitsDuringShed = mockUpstashHits;
      for (const safeGeoPath of [
        '/tr/gastronomi',
        '/tr/gastronomi/istanbul/kadikoy/moda',
        '/tr/gastronomi/mekan/moda-vermilion',
        '/en/gastronomy/venue/carsi-ciya-sofrasi',
        '/llms.txt',
      ]) {
        const r = await fetch(`${origin}${safeGeoPath}`);
        assert.equal(r.status, 200, `GEO route ${safeGeoPath} must stay 200 during emergency shed`);
      }
      assert.equal(mockUpstashHits, hitsDuringShed, 'GEO core routes incur 0 Upstash checks even during shed');
      runtimeEmergencyRedisValue = 'off';
    });

    // -------------------------------------------------------------------------
    // 6. Headless Chrome Mobile (390x844) & Desktop (1280x900) Visual/Interactive Integrity
    // -------------------------------------------------------------------------
    await check('6. Headless Chrome renders Moda selection, category links & pilot venue detail with 0 errors and 0 horizontal overflow', async () => {
      for (const vp of [
        { width: 390, height: 844, isMobile: true, hasTouch: true },
        { width: 1280, height: 900, isMobile: false, hasTouch: false },
      ]) {
        const ctx = await browser.createBrowserContext();
        const page = await ctx.newPage();
        await page.setViewport(vp);
        const pageErrors = [];
        page.on('pageerror', (e) => pageErrors.push(e.message));
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const u = new URL(req.url());
          if (u.origin !== origin && !['data:', 'blob:'].includes(u.protocol)) req.abort();
          else req.continue();
        });

        await page.goto(`${origin}/tr/gastronomi/istanbul/kadikoy/moda`, { waitUntil: 'networkidle0' });
        await page.waitForSelector('[data-venue-id]');
        const overflow1 = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth
        );
        assert.equal(overflow1, false, `Horizontal overflow on Moda page at width=${vp.width}`);

        // Click category link to Moda Kahve
        await page.click('a[href="/tr/gastronomi/istanbul/kadikoy/moda/kahve"]');
        await page.waitForFunction(
          () => location.pathname === '/tr/gastronomi/istanbul/kadikoy/moda/kahve' && document.querySelectorAll('[data-venue-id]').length >= 4
        );

        // Open detail page for Vermilion Coffee
        await page.goto(`${origin}/tr/gastronomi/mekan/moda-vermilion`, { waitUntil: 'networkidle0' });
        const bodyText = await page.evaluate(() => document.body.innerText || '');
        assert.ok(bodyText.includes('Vermilion Coffee'));
        assert.ok(bodyText.includes('Tek Köken V60'));
        const overflow2 = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth
        );
        assert.equal(overflow2, false, `Horizontal overflow on Venue page at width=${vp.width}`);

        assert.deepEqual(pageErrors, []);
        await page.close();
        await ctx.close();
      }
    });
  } finally {
    await browser.close();
    nextProc.kill('SIGTERM');
    await new Promise((r) => mockServer.close(r));
  }

  console.log(`\nALL PAKET 08 GEO & AI SEARCH CHECKS PASSED: ${passed} checks.`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
