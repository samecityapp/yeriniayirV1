import { validUpstashConfig } from './rateLimitConfig';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type RateLimitTier =
  | 'visitor_analytics'
  | 'visitor_redirect'
  | 'visitor_public'
  | 'admin_read'
  | 'admin_panel'
  | 'admin_auth'
  | 'costly_admin';

export type RateLimitPolicySource =
  | 'disabled'
  | 'upstash'
  | 'memory-l1'
  | 'memory-fallback'
  | 'emergency-fallback'
  | 'outage-blocked';

export interface RateLimitResult {
  ok: boolean;
  status: 200 | 429 | 503;
  limit: number;
  remaining: number;
  reset: number;
  policy: RateLimitPolicySource;
  headers: Record<string, string>;
}

interface WindowSpec {
  limit: number;
  windowMs: number;
  windowText: `${number} s`;
}

interface TierConfig {
  mode: 'visitor' | 'ip';
  isCritical: boolean;
  primary: WindowSpec;
  ipCeiling?: WindowSpec;
  outagePrimary: WindowSpec;
  outageIpCeiling?: WindowSpec;
  outageGlobal?: WindowSpec;
}

const TIER_CONFIGS: Record<RateLimitTier, TierConfig> = {
  visitor_analytics: {
    mode: 'visitor',
    isCritical: false,
    primary: { limit: 10, windowMs: 10_000, windowText: '10 s' },
    ipCeiling: { limit: 120, windowMs: 10_000, windowText: '10 s' },
    outagePrimary: { limit: 10, windowMs: 10_000, windowText: '10 s' },
    outageIpCeiling: { limit: 120, windowMs: 10_000, windowText: '10 s' },
  },
  visitor_redirect: {
    mode: 'visitor',
    isCritical: false,
    primary: { limit: 30, windowMs: 10_000, windowText: '10 s' },
    ipCeiling: { limit: 150, windowMs: 10_000, windowText: '10 s' },
    outagePrimary: { limit: 20, windowMs: 10_000, windowText: '10 s' },
    outageIpCeiling: { limit: 100, windowMs: 10_000, windowText: '10 s' },
  },
  visitor_public: {
    mode: 'visitor',
    isCritical: false,
    primary: { limit: 30, windowMs: 10_000, windowText: '10 s' },
    ipCeiling: { limit: 150, windowMs: 10_000, windowText: '10 s' },
    outagePrimary: { limit: 20, windowMs: 10_000, windowText: '10 s' },
    outageIpCeiling: { limit: 100, windowMs: 10_000, windowText: '10 s' },
  },
  admin_read: {
    mode: 'ip',
    isCritical: false,
    primary: { limit: 30, windowMs: 60_000, windowText: '60 s' },
    outagePrimary: { limit: 10, windowMs: 60_000, windowText: '60 s' },
    outageGlobal: { limit: 20, windowMs: 60_000, windowText: '60 s' },
  },
  admin_panel: {
    mode: 'ip',
    isCritical: false,
    primary: { limit: 25, windowMs: 60_000, windowText: '60 s' },
    outagePrimary: { limit: 6, windowMs: 60_000, windowText: '60 s' },
    outageGlobal: { limit: 12, windowMs: 60_000, windowText: '60 s' },
  },
  admin_auth: {
    mode: 'ip',
    isCritical: true,
    primary: { limit: 8, windowMs: 60_000, windowText: '60 s' },
    outagePrimary: { limit: 3, windowMs: 60_000, windowText: '60 s' },
    outageGlobal: { limit: 6, windowMs: 60_000, windowText: '60 s' },
  },
  costly_admin: {
    mode: 'ip',
    isCritical: true,
    primary: { limit: 12, windowMs: 60_000, windowText: '60 s' },
    outagePrimary: { limit: 3, windowMs: 60_000, windowText: '60 s' },
    outageGlobal: { limit: 6, windowMs: 60_000, windowText: '60 s' },
  },
};

const MAX_ADMIN_BUCKETS = 1024;
const MAX_IP_BUCKETS = 2048;
const MAX_VISITOR_BUCKETS = 4096;
const MAX_IP_UA_TRACKERS = 2048;
const MAX_DISTINCT_UAS_PER_IP_WINDOW = 40;
const UA_CHURN_WINDOW_MS = 10_000;
const UPSTASH_TIMEOUT_MS = 1500;
const UPSTASH_CIRCUIT_COOLDOWN_MS = 10_000;

const CLI_BOT_SUBCAP: WindowSpec = {
  limit: 6,
  windowMs: 10_000,
  windowText: '10 s',
};

const AUTOMATED_CLI_UA_RE =
  /^(?:curl|wget|python-requests|python-urllib|go-http-client|scrapy|httpie|libwww-perl|java\/|okhttp\/)/i;

interface SlidingBucket {
  timestamps: number[];
  expiresAt: number;
}

interface IpUaTracker {
  keys: Set<string>;
  expiresAt: number;
}

// Isolated pools prevent visitor UA churn from evicting IP ceilings or admin rate limits.
const adminBuckets = new Map<string, SlidingBucket>();
const ipCeilingBuckets = new Map<string, SlidingBucket>();
const visitorDeviceBuckets = new Map<string, SlidingBucket>();
const ipUaSets = new Map<string, IpUaTracker>();

let upstashOutageUntil = 0;
let cachedRedisSignature: string | null = null;
const cachedUpstashLimiters = new Map<string, Ratelimit>();

export function resetMemoryRateLimitersForTests(): void {
  adminBuckets.clear();
  ipCeilingBuckets.clear();
  visitorDeviceBuckets.clear();
  ipUaSets.clear();
  upstashOutageUntil = 0;
  cachedRedisSignature = null;
  cachedUpstashLimiters.clear();
}

export function isRateLimitActive(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.RATE_LIMIT_ENFORCE === '1';
}

export function isAutomatedCliUserAgent(uaRaw: string | null): boolean {
  const ua = (uaRaw || '').trim();
  if (ua.length < 4) return true;
  return AUTOMATED_CLI_UA_RE.test(ua);
}

export function resolveCriticalOutageMode(env: NodeJS.ProcessEnv = process.env): 'block' | 'emergency' {
  const explicit = (env.RATE_LIMIT_CRITICAL_OUTAGE_MODE || '').trim().toLowerCase();
  if (explicit === 'block') return 'block';
  if (explicit === 'emergency') return 'emergency';
  if (env.APP_ENVIRONMENT === 'production' || env.VERCEL_ENV === 'production') {
    return 'block';
  }
  return 'emergency';
}

export function extractClientIp(headers: Headers): string {
  if (process.env.VERCEL === '1') {
    const vercelForwarded = headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();
    if (vercelForwarded) return vercelForwarded.slice(0, 64);

    const realIp = headers.get('x-real-ip')?.trim();
    if (realIp) return realIp.slice(0, 64);

    return '127.0.0.1';
  }

  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp) return realIp.slice(0, 64);

  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) return forwarded.slice(0, 64);

  return '127.0.0.1';
}

async function sha256Hex32(input: string): Promise<string> {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
    const encoded = new TextEncoder().encode(input);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
    const bytes = new Uint8Array(digest);
    let hex = '';
    for (let i = 0; i < 16; i++) {
      hex += bytes[i].toString(16).padStart(2, '0');
    }
    return hex;
  }

  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x85ebca6b) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

export async function buildVisitorClientKey(headers: Headers): Promise<string> {
  const ip = extractClientIp(headers);
  const utcDay = new Date().toISOString().slice(0, 10);
  const ua = (headers.get('user-agent') || 'unknown').slice(0, 120);
  const acceptLang = (headers.get('accept-language') || '').slice(0, 32);
  const mobileHint = (headers.get('sec-ch-ua-mobile') || '').slice(0, 8);
  return sha256Hex32(`${ip}|${utcDay}|${ua}|${acceptLang}|${mobileHint}`);
}

function purgeExpiredEntries<T extends { expiresAt: number }>(
  pool: Map<string, T>,
  now: number
): void {
  for (const [k, entry] of Array.from(pool.entries())) {
    if (entry.expiresAt <= now) {
      pool.delete(k);
    }
  }
}

function pruneMapPool<T extends { expiresAt: number }>(
  pool: Map<string, T>,
  maxEntries: number,
  now: number
): void {
  purgeExpiredEntries(pool, now);
  while (pool.size >= maxEntries) {
    const oldest = pool.keys().next().value;
    if (!oldest) break;
    pool.delete(oldest);
  }
}

function consumeSlidingWindow(
  pool: Map<string, SlidingBucket>,
  maxEntries: number,
  bucketKey: string,
  spec: WindowSpec,
  now: number
): { success: boolean; limit: number; remaining: number; reset: number } {
  purgeExpiredEntries(pool, now);
  const cutoff = now - spec.windowMs;
  const existing = pool.get(bucketKey);
  // Never evict live counters: rotating identities must not reset another budget.
  if (!existing && pool.size >= maxEntries) {
    const earliestExpiry = Math.min(...Array.from(pool.values(), (b) => b.expiresAt));
    return { success: false, limit: spec.limit, remaining: 0, reset: Math.ceil(earliestExpiry / 1000) };
  }
  const timestamps = existing ? existing.timestamps.filter((t) => t > cutoff) : [];

  if (timestamps.length >= spec.limit) {
    const oldest = timestamps[0] ?? now;
    const resetMs = oldest + spec.windowMs;
    pool.set(bucketKey, { timestamps, expiresAt: timestamps[timestamps.length - 1] + spec.windowMs });
    return {
      success: false,
      limit: spec.limit,
      remaining: 0,
      reset: Math.ceil(resetMs / 1000),
    };
  }

  timestamps.push(now);
  const oldest = timestamps[0] ?? now;
  const resetMs = oldest + spec.windowMs;
  pool.set(bucketKey, { timestamps, expiresAt: timestamps[timestamps.length - 1] + spec.windowMs });
  return {
    success: true,
    limit: spec.limit,
    remaining: Math.max(0, spec.limit - timestamps.length),
    reset: Math.ceil(resetMs / 1000),
  };
}

function resolveVisitorPrimaryKey(
  scope: string,
  tier: RateLimitTier,
  ipHash: string,
  rawPrimaryKey: string,
  now: number
): string {
  pruneMapPool(ipUaSets, MAX_IP_UA_TRACKERS, now);
  const trackerKey = `${scope}:${tier}:${ipHash}`;
  let tracker = ipUaSets.get(trackerKey);
  if (!tracker || tracker.expiresAt <= now) {
    tracker = { keys: new Set<string>(), expiresAt: now + UA_CHURN_WINDOW_MS };
    ipUaSets.set(trackerKey, tracker);
  }
  if (tracker.keys.has(rawPrimaryKey)) {
    return rawPrimaryKey;
  }
  if (tracker.keys.size < MAX_DISTINCT_UAS_PER_IP_WINDOW) {
    tracker.keys.add(rawPrimaryKey);
    return rawPrimaryKey;
  }
  return `${ipHash}:ua-churn`;
}

function hasValidUpstashConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || '';
  if (!url || !token) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    return { url, token };
  } catch {
    return null;
  }
}

function getUpstashLimiter(
  limiterName: string,
  spec: WindowSpec,
  cfg: { url: string; token: string }
): Ratelimit {
  const signature = `${cfg.url}|${cfg.token}`;
  if (cachedRedisSignature !== signature) {
    cachedRedisSignature = signature;
    cachedUpstashLimiters.clear();
  }

  const cached = cachedUpstashLimiters.get(limiterName);
  if (cached) return cached;

  const redis = new Redis({ url: cfg.url, token: cfg.token });
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(spec.limit, spec.windowText),
    analytics: false,
    prefix: `@upstash/ratelimit/${limiterName}`,
    timeout: 0, // Disable SDK fail-open timeout; our timeout rejects into outage policy.
  });
  cachedUpstashLimiters.set(limiterName, limiter);
  return limiter;
}

async function limitWithTimeout(limiter: Ratelimit, key: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const res = await Promise.race([
      limiter.limit(key),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Upstash rate-limit timeout')), UPSTASH_TIMEOUT_MS);
      }),
    ]);
    return {
      success: Boolean(res?.success),
      limit: typeof res?.limit === 'number' ? res.limit : 0,
      remaining: typeof res?.remaining === 'number' ? res.remaining : 0,
      reset: typeof res?.reset === 'number' ? res.reset : Math.ceil((Date.now() + 10_000) / 1000),
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function rateLimitHeaders(
  result: Pick<RateLimitResult, 'ok' | 'limit' | 'remaining' | 'reset' | 'policy'>
): Record<string, string> {
  const nowSec = Math.floor(Date.now() / 1000);
  const retryAfterSec = Math.max(1, result.reset - nowSec);
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.reset),
    'X-RateLimit-Policy': result.policy,
  };
  if (!result.ok) {
    headers['Retry-After'] = String(retryAfterSec);
    headers['Cache-Control'] = 'private, no-store, max-age=0';
  }
  return headers;
}

function buildResult(
  status: 200 | 429 | 503,
  limit: number,
  remaining: number,
  reset: number,
  policy: RateLimitPolicySource
): RateLimitResult {
  const ok = status === 200;
  const headers = rateLimitHeaders({ ok, limit, remaining, reset, policy });
  return { ok, status, limit, remaining, reset, policy, headers };
}

function enforceLayer1(
  scope: string,
  tier: RateLimitTier,
  primaryKey: string,
  ipHash: string,
  isCliBot: boolean,
  now: number,
  useOutageSpecs: boolean
): RateLimitResult {
  const cfg = TIER_CONFIGS[tier];
  const primarySpec = useOutageSpecs ? cfg.outagePrimary : cfg.primary;
  const ipCeilingSpec = useOutageSpecs ? cfg.outageIpCeiling : cfg.ipCeiling;
  const policy: RateLimitPolicySource = useOutageSpecs ? 'emergency-fallback' : 'memory-fallback';

  if (ipCeilingSpec) {
    const ipRes = consumeSlidingWindow(
      ipCeilingBuckets,
      MAX_IP_BUCKETS,
      `${scope}:${useOutageSpecs ? 'outage:' : ''}${tier}:ip:${ipHash}`,
      ipCeilingSpec,
      now
    );
    if (!ipRes.success) {
      return buildResult(429, ipRes.limit, ipRes.remaining, ipRes.reset, policy);
    }
  }

  if (cfg.mode === 'visitor' && isCliBot) {
    const cliRes = consumeSlidingWindow(
      ipCeilingBuckets,
      MAX_IP_BUCKETS,
      `${scope}:${useOutageSpecs ? 'outage:' : ''}${tier}:cli:${ipHash}`,
      CLI_BOT_SUBCAP,
      now
    );
    if (!cliRes.success) {
      return buildResult(429, cliRes.limit, cliRes.remaining, cliRes.reset, policy);
    }
  }

  const primaryPool = cfg.mode === 'visitor' ? visitorDeviceBuckets : adminBuckets;
  const primaryMax = cfg.mode === 'visitor' ? MAX_VISITOR_BUCKETS : MAX_ADMIN_BUCKETS;
  const pRes = consumeSlidingWindow(
    primaryPool,
    primaryMax,
    `${scope}:${useOutageSpecs ? 'outage:' : ''}${tier}:p:${primaryKey}`,
    primarySpec,
    now
  );
  if (!pRes.success) {
    return buildResult(429, pRes.limit, pRes.remaining, pRes.reset, policy);
  }

  // Check outage global circuit-breaker AFTER per-key checks so one throttled IP cannot exhaust global admin budget.
  if (useOutageSpecs && cfg.outageGlobal) {
    const gRes = consumeSlidingWindow(
      adminBuckets,
      MAX_ADMIN_BUCKETS,
      `${scope}:outage:${tier}:__global__`,
      cfg.outageGlobal,
      now
    );
    if (!gRes.success) {
      return buildResult(429, gRes.limit, gRes.remaining, gRes.reset, 'emergency-fallback');
    }
  }

  return buildResult(200, pRes.limit, pRes.remaining, pRes.reset, policy);
}

export async function enforceEdgeMemoryShield(
  headers: Headers,
  tier: RateLimitTier,
  options?: { scope?: string }
): Promise<RateLimitResult> {
  const cfg = TIER_CONFIGS[tier];
  if (!isRateLimitActive()) {
    return {
      ok: true,
      status: 200,
      limit: cfg.primary.limit,
      remaining: cfg.primary.limit,
      reset: 0,
      policy: 'disabled',
      headers: {},
    };
  }

  const scope = options?.scope || 'mw';
  const now = Date.now();
  const ip = extractClientIp(headers);
  const utcDay = new Date(now).toISOString().slice(0, 10);
  const ipHash = await sha256Hex32(`${ip}|${utcDay}`);
  const isCliBot = cfg.mode === 'visitor' && isAutomatedCliUserAgent(headers.get('user-agent'));
  const rawPrimaryKey = cfg.mode === 'visitor' ? await buildVisitorClientKey(headers) : ipHash;
  const primaryKey =
    cfg.mode === 'visitor'
      ? resolveVisitorPrimaryKey(scope, tier, ipHash, rawPrimaryKey, now)
      : rawPrimaryKey;

  const l1 = enforceLayer1(scope, tier, primaryKey, ipHash, isCliBot, now, false);
  if (!l1.ok) {
    return buildResult(429, l1.limit, l1.remaining, l1.reset, 'memory-l1');
  }
  return buildResult(200, l1.limit, l1.remaining, l1.reset, 'memory-l1');
}

function handleCriticalOutageFallback(
  scope: string,
  tier: RateLimitTier,
  cfg: TierConfig,
  primaryKey: string,
  ipHash: string,
  isCliBot: boolean,
  now: number
): RateLimitResult {
  if (cfg.isCritical && resolveCriticalOutageMode() === 'block') {
    const reset = Math.ceil((now + cfg.outagePrimary.windowMs) / 1000);
    return buildResult(503, 0, 0, reset, 'outage-blocked');
  }
  return enforceLayer1(scope, tier, primaryKey, ipHash, isCliBot, now, true);
}

export async function enforceRateLimit(
  headers: Headers,
  tier: RateLimitTier,
  options?: { scope?: string }
): Promise<RateLimitResult> {
  const cfg = TIER_CONFIGS[tier];
  if (!isRateLimitActive()) {
    return {
      ok: true,
      status: 200,
      limit: cfg.primary.limit,
      remaining: cfg.primary.limit,
      reset: 0,
      policy: 'disabled',
      headers: {},
    };
  }

  const scope = options?.scope || 'api';
  const now = Date.now();
  const ip = extractClientIp(headers);
  const utcDay = new Date(now).toISOString().slice(0, 10);
  const ipHash = await sha256Hex32(`${ip}|${utcDay}`);
  const isCliBot = cfg.mode === 'visitor' && isAutomatedCliUserAgent(headers.get('user-agent'));
  const rawPrimaryKey = cfg.mode === 'visitor' ? await buildVisitorClientKey(headers) : ipHash;
  const primaryKey =
    cfg.mode === 'visitor'
      ? resolveVisitorPrimaryKey(scope, tier, ipHash, rawPrimaryKey, now)
      : rawPrimaryKey;

  // Layer 1: Bounded in-memory shield stops floods BEFORE invoking Upstash.
  const l1 = enforceLayer1(scope, tier, primaryKey, ipHash, isCliBot, now, false);
  if (!l1.ok) {
    return buildResult(429, l1.limit, l1.remaining, l1.reset, 'memory-l1');
  }

  const upstashCfg = hasValidUpstashConfig();
  if (!upstashCfg) {
    if (cfg.isCritical && resolveCriticalOutageMode() === 'block') {
      const reset = Math.ceil((now + cfg.outagePrimary.windowMs) / 1000);
      return buildResult(503, 0, 0, reset, 'outage-blocked');
    }
    return l1;
  }

  // Cooldown circuit breaker skips hanging 1500ms Upstash timeouts during active outages.
  if (now < upstashOutageUntil) {
    return handleCriticalOutageFallback(scope, tier, cfg, primaryKey, ipHash, isCliBot, now);
  }

  // Layer 2: Distributed Upstash Redis sliding window.
  try {
    const primaryLimiter = getUpstashLimiter(`${scope}/${tier}`, cfg.primary, upstashCfg);
    const pRemote = await limitWithTimeout(primaryLimiter, primaryKey);
    if (!pRemote.success) {
      return buildResult(
        429,
        pRemote.limit || cfg.primary.limit,
        pRemote.remaining,
        pRemote.reset,
        'upstash'
      );
    }

    if (cfg.ipCeiling) {
      const ipLimiter = getUpstashLimiter(`${scope}/${tier}/ip`, cfg.ipCeiling, upstashCfg);
      const ipRemote = await limitWithTimeout(ipLimiter, ipHash);
      if (!ipRemote.success) {
        return buildResult(
          429,
          ipRemote.limit || cfg.ipCeiling.limit,
          ipRemote.remaining,
          ipRemote.reset,
          'upstash'
        );
      }
    }

    upstashOutageUntil = 0;
    return buildResult(
      200,
      pRemote.limit || cfg.primary.limit,
      pRemote.remaining,
      pRemote.reset,
      'upstash'
    );
  } catch (err) {
    // Log only error name (never full SDK exception objects containing URLs/headers).
    upstashOutageUntil = Date.now() + UPSTASH_CIRCUIT_COOLDOWN_MS;
    console.warn(`Rate limiter Upstash failure for ${scope}:${tier} (${(err as Error)?.name || 'Error'}); circuit breaker engaged.`);
    return handleCriticalOutageFallback(scope, tier, cfg, primaryKey, ipHash, isCliBot, now);
  }
}
