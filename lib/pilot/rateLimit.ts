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

export const RATE_LIMIT_COOKIE_NAME = 'ya_rl_anon';
const ANON_COOKIE_TTL_SEC = 15 * 60;
const MAX_NEW_COOKIES_PER_IP_WINDOW = 60;
const NEW_COOKIE_WINDOW_MS = 10_000;
const REDIS_NAMESPACE_RE = /^[a-z0-9:_-]{1,40}$/i;

export interface RateLimitResult {
  ok: boolean;
  status: 200 | 429 | 503;
  limit: number;
  remaining: number;
  reset: number;
  policy: RateLimitPolicySource;
  headers: Record<string, string>;
  setCookieHeader?: string;
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
  skipRemoteIpCeiling?: boolean;
  outagePrimary: WindowSpec;
  outageIpCeiling?: WindowSpec;
  outageGlobal?: WindowSpec;
}

const TIER_CONFIGS: Record<RateLimitTier, TierConfig> = {
  visitor_analytics: {
    mode: 'visitor',
    isCritical: false,
    primary: { limit: 10, windowMs: 10_000, windowText: '10 s' },
    ipCeiling: { limit: 150, windowMs: 10_000, windowText: '10 s' },
    skipRemoteIpCeiling: true,
    outagePrimary: { limit: 10, windowMs: 10_000, windowText: '10 s' },
    outageIpCeiling: { limit: 150, windowMs: 10_000, windowText: '10 s' },
  },
  visitor_redirect: {
    mode: 'visitor',
    isCritical: false,
    primary: { limit: 30, windowMs: 10_000, windowText: '10 s' },
    ipCeiling: { limit: 200, windowMs: 10_000, windowText: '10 s' },
    outagePrimary: { limit: 20, windowMs: 10_000, windowText: '10 s' },
    outageIpCeiling: { limit: 150, windowMs: 10_000, windowText: '10 s' },
  },
  visitor_public: {
    mode: 'visitor',
    isCritical: false,
    primary: { limit: 30, windowMs: 10_000, windowText: '10 s' },
    ipCeiling: { limit: 200, windowMs: 10_000, windowText: '10 s' },
    outagePrimary: { limit: 20, windowMs: 10_000, windowText: '10 s' },
    outageIpCeiling: { limit: 150, windowMs: 10_000, windowText: '10 s' },
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
const ipCookieIssueBuckets = new Map<string, SlidingBucket>();

let upstashOutageUntil = 0;
let cachedRedisSignature: string | null = null;
const cachedUpstashLimiters = new Map<string, Ratelimit>();
let cachedHmacSecret: string | null = null;
let cachedHmacKey: CryptoKey | null = null;

export function resetMemoryRateLimitersForTests(): void {
  adminBuckets.clear();
  ipCeilingBuckets.clear();
  visitorDeviceBuckets.clear();
  ipUaSets.clear();
  ipCookieIssueBuckets.clear();
  upstashOutageUntil = 0;
  cachedRedisSignature = null;
  cachedUpstashLimiters.clear();
  cachedHmacSecret = null;
  cachedHmacKey = null;
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

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(input: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]{32,64}$/.test(input)) return null;
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4);
  try {
    const binary = atob(padded);
    const buf = new ArrayBuffer(binary.length);
    const out = new Uint8Array(buf);
    for (let i = 0; i < binary.length; i++) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  } catch {
    return null;
  }
}

function resolveAnonCookieSecret(
  env: NodeJS.ProcessEnv = process.env
): { secret: string; trusted: boolean } {
  const candidate =
    env.RATE_LIMIT_COOKIE_SECRET?.trim() ||
    env.ADMIN_SESSION_SECRET?.trim() ||
    env.CRON_SECRET?.trim() ||
    '';

  const isCloudProdOrStaging =
    env.APP_ENVIRONMENT === 'production' ||
    env.APP_ENVIRONMENT === 'staging' ||
    env.VERCEL_ENV === 'production';

  if (candidate.length >= 16) {
    return { secret: candidate, trusted: true };
  }
  if (isCloudProdOrStaging) {
    return { secret: '', trusted: false };
  }
  return { secret: 'ya-local-dev-fairness-v1', trusted: true };
}

async function getAnonCookieHmacKey(secret: string): Promise<CryptoKey | null> {
  if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.subtle) {
    return null;
  }
  if (cachedHmacSecret === secret && cachedHmacKey) {
    return cachedHmacKey;
  }
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  cachedHmacSecret = secret;
  cachedHmacKey = key;
  return key;
}

function readCookieValue(cookieHeader: string | null, cookieName: string): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const eqIdx = part.indexOf('=');
    if (eqIdx <= 0) continue;
    const name = part.slice(0, eqIdx).trim();
    if (name === cookieName) {
      return part.slice(eqIdx + 1).trim();
    }
  }
  return null;
}

async function verifyAnonFairnessCookie(headers: Headers, nowSec: number): Promise<string | null> {
  const { secret, trusted } = resolveAnonCookieSecret();
  if (!trusted || !secret) return null;

  const rawCookie = readCookieValue(headers.get('cookie'), RATE_LIMIT_COOKIE_NAME);
  if (!rawCookie) return null;

  const segments = rawCookie.split('.');
  if (segments.length !== 3) return null;
  const [issuedAtStr, nonceHex, sigB64u] = segments;
  if (!/^\d{10,12}$/.test(issuedAtStr) || !/^[0-9a-f]{32}$/.test(nonceHex)) {
    return null;
  }

  const issuedAtSec = Number(issuedAtStr);
  if (!Number.isSafeInteger(issuedAtSec)) return null;
  if (issuedAtSec > nowSec + 30 || nowSec - issuedAtSec > ANON_COOKIE_TTL_SEC) {
    return null;
  }

  const sigBytes = base64UrlToBytes(sigB64u);
  if (!sigBytes) return null;

  const hmacKey = await getAnonCookieHmacKey(secret);
  if (!hmacKey) return null;

  const payload = `${issuedAtStr}.${nonceHex}`;
  const verified = await globalThis.crypto.subtle.verify(
    'HMAC',
    hmacKey,
    sigBytes as BufferSource,
    new TextEncoder().encode(payload)
  );
  return verified ? payload : null;
}

async function issueAnonFairnessCookieHeader(
  headers: Headers,
  nowSec: number
): Promise<string | undefined> {
  const { secret, trusted } = resolveAnonCookieSecret();
  if (!trusted || !secret || typeof globalThis.crypto === 'undefined' || !globalThis.crypto.subtle) {
    return undefined;
  }
  const hmacKey = await getAnonCookieHmacKey(secret);
  if (!hmacKey) return undefined;

  const randomBytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(randomBytes);
  let nonceHex = '';
  for (let i = 0; i < randomBytes.length; i++) {
    nonceHex += randomBytes[i].toString(16).padStart(2, '0');
  }
  const payload = `${nowSec}.${nonceHex}`;
  const sigBuf = await globalThis.crypto.subtle.sign(
    'HMAC',
    hmacKey,
    new TextEncoder().encode(payload)
  );
  const sigB64u = bytesToBase64Url(new Uint8Array(sigBuf));
  const isSecure =
    headers.get('x-forwarded-proto') === 'https' ||
    process.env.VERCEL === '1' ||
    process.env.APP_ENVIRONMENT === 'production' ||
    process.env.APP_ENVIRONMENT === 'staging' ||
    process.env.VERCEL_ENV === 'production';

  return `${RATE_LIMIT_COOKIE_NAME}=${payload}.${sigB64u}; Path=/; Max-Age=${ANON_COOKIE_TTL_SEC}; HttpOnly; SameSite=Lax${isSecure ? '; Secure' : ''}`;
}

export async function resolveVisitorIdentity(
  scope: string,
  tier: RateLimitTier,
  headers: Headers,
  ipHash: string,
  utcDay: string,
  now: number,
  isCliBot: boolean
): Promise<{ primaryKey: string; verifiedAnon: boolean }> {
  const nowSec = Math.floor(now / 1000);
  if (!isCliBot) {
    const verifiedPayload = await verifyAnonFairnessCookie(headers, nowSec);
    if (verifiedPayload) {
      const tokenHash = await sha256Hex32(`${verifiedPayload}|${utcDay}`);
      return { primaryKey: `anon:${tokenHash}`, verifiedAnon: true };
    }
  }
  const rawFingerprint = await buildVisitorClientKey(headers);
  const resolved = resolveVisitorPrimaryKey(scope, tier, ipHash, rawFingerprint, now);
  return { primaryKey: `unverified:${resolved}`, verifiedAnon: false };
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
  purgeExpiredEntries(ipUaSets, now);
  const trackerKey = `${scope}:${tier}:${ipHash}`;
  let tracker = ipUaSets.get(trackerKey);
  if (!tracker || tracker.expiresAt <= now) {
    if (!tracker && ipUaSets.size >= MAX_IP_UA_TRACKERS) {
      return `${ipHash}:ua-churn`;
    }
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

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]']);

function resolveUpstashRuntimeConfig(
  env: NodeJS.ProcessEnv = process.env
): { url: string; token: string } | null {
  const isCloudProdOrStaging =
    env.APP_ENVIRONMENT === 'production' ||
    env.APP_ENVIRONMENT === 'staging' ||
    env.VERCEL_ENV === 'production';

  if (isCloudProdOrStaging) {
    return validUpstashConfig(env);
  }

  const strict = validUpstashConfig(env);
  if (strict) return strict;

  const url = env.UPSTASH_REDIS_REST_URL || '';
  const token = env.UPSTASH_REDIS_REST_TOKEN || '';
  if (!url || !token || url !== url.trim() || /\s|[\x00-\x1f\x7f]/.test(token)) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.username || parsed.password || parsed.search || parsed.hash) {
      return null;
    }
    const hostLower = parsed.hostname.toLowerCase();
    if (parsed.protocol === 'http:' && LOOPBACK_HOSTS.has(hostLower)) {
      return { url: `${parsed.origin}${parsed.pathname === '/' ? '' : parsed.pathname}`, token };
    }
    if (parsed.protocol === 'https:' && hostLower.endsWith('.invalid') && parsed.pathname === '/') {
      return { url: parsed.origin, token };
    }
    return null;
  } catch {
    return null;
  }
}

function resolveRedisNamespace(): string {
  const ns = (process.env.RATE_LIMIT_REDIS_NAMESPACE || '').trim();
  return ns && REDIS_NAMESPACE_RE.test(ns) ? ns : '';
}

function getUpstashLimiter(
  limiterName: string,
  spec: WindowSpec,
  cfg: { url: string; token: string }
): Ratelimit {
  const ns = resolveRedisNamespace();
  const signature = `${cfg.url}|${cfg.token}|${ns}`;
  if (cachedRedisSignature !== signature) {
    cachedRedisSignature = signature;
    cachedUpstashLimiters.clear();
  }

  const cached = cachedUpstashLimiters.get(limiterName);
  if (cached) return cached;

  const prefix = ns
    ? `@upstash/ratelimit/${ns}/${limiterName}`
    : `@upstash/ratelimit/${limiterName}`;
  const redis = new Redis({ url: cfg.url, token: cfg.token });
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(spec.limit, spec.windowText),
    analytics: false,
    prefix,
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
  policy: RateLimitPolicySource,
  setCookieHeader?: string
): RateLimitResult {
  const ok = status === 200;
  const headers = rateLimitHeaders({ ok, limit, remaining, reset, policy });
  return setCookieHeader
    ? { ok, status, limit, remaining, reset, policy, headers, setCookieHeader }
    : { ok, status, limit, remaining, reset, policy, headers };
}

async function maybeAttachAnonCookie(
  result: RateLimitResult,
  cfg: TierConfig,
  headers: Headers,
  ipHash: string,
  now: number,
  verifiedAnon: boolean,
  isCliBot: boolean,
  allowSetCookie: boolean
): Promise<RateLimitResult> {
  if (!result.ok || cfg.mode !== 'visitor' || verifiedAnon || isCliBot || !allowSetCookie) {
    return result;
  }
  const issueBucket = consumeSlidingWindow(
    ipCookieIssueBuckets,
    MAX_IP_BUCKETS,
    `cookie:${ipHash}`,
    {
      limit: MAX_NEW_COOKIES_PER_IP_WINDOW,
      windowMs: NEW_COOKIE_WINDOW_MS,
      windowText: '10 s',
    },
    now
  );
  if (!issueBucket.success) {
    return result;
  }
  const setCookieHeader = await issueAnonFairnessCookieHeader(headers, Math.floor(now / 1000));
  return setCookieHeader ? { ...result, setCookieHeader } : result;
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
  options?: { scope?: string; nowMs?: number; allowSetCookie?: boolean }
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
  const allowSetCookie = options?.allowSetCookie ?? scope === 'api';
  const now = typeof options?.nowMs === 'number' && Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
  const ip = extractClientIp(headers);
  const utcDay = new Date(now).toISOString().slice(0, 10);
  const ipHash = await sha256Hex32(`${ip}|${utcDay}`);
  const isCliBot = cfg.mode === 'visitor' && isAutomatedCliUserAgent(headers.get('user-agent'));
  const identity =
    cfg.mode === 'visitor'
      ? await resolveVisitorIdentity(scope, tier, headers, ipHash, utcDay, now, isCliBot)
      : { primaryKey: ipHash, verifiedAnon: false };

  const l1 = enforceLayer1(scope, tier, identity.primaryKey, ipHash, isCliBot, now, false);
  if (!l1.ok) {
    return buildResult(429, l1.limit, l1.remaining, l1.reset, 'memory-l1');
  }
  const okRes = buildResult(200, l1.limit, l1.remaining, l1.reset, 'memory-l1');
  return maybeAttachAnonCookie(
    okRes,
    cfg,
    headers,
    ipHash,
    now,
    identity.verifiedAnon,
    isCliBot,
    allowSetCookie
  );
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
  options?: { scope?: string; nowMs?: number; allowSetCookie?: boolean }
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
  const allowSetCookie = options?.allowSetCookie ?? scope === 'api';
  const now = typeof options?.nowMs === 'number' && Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
  const ip = extractClientIp(headers);
  const utcDay = new Date(now).toISOString().slice(0, 10);
  const ipHash = await sha256Hex32(`${ip}|${utcDay}`);
  const isCliBot = cfg.mode === 'visitor' && isAutomatedCliUserAgent(headers.get('user-agent'));
  const identity =
    cfg.mode === 'visitor'
      ? await resolveVisitorIdentity(scope, tier, headers, ipHash, utcDay, now, isCliBot)
      : { primaryKey: ipHash, verifiedAnon: false };
  const primaryKey = identity.primaryKey;

  // Layer 1: Bounded in-memory shield stops floods BEFORE invoking Upstash.
  const l1 = enforceLayer1(scope, tier, primaryKey, ipHash, isCliBot, now, false);
  if (!l1.ok) {
    return buildResult(429, l1.limit, l1.remaining, l1.reset, 'memory-l1');
  }

  const upstashCfg = resolveUpstashRuntimeConfig();
  if (!upstashCfg) {
    if (cfg.isCritical && resolveCriticalOutageMode() === 'block') {
      const reset = Math.ceil((now + cfg.outagePrimary.windowMs) / 1000);
      return buildResult(503, 0, 0, reset, 'outage-blocked');
    }
    const explicitOutageMode = Boolean((process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE || '').trim());
    const isLocalTestOrDevHarness =
      !explicitOutageMode &&
      process.env.VERCEL !== '1' &&
      !process.env.VERCEL_ENV &&
      (process.env.APP_ENVIRONMENT === 'test' || process.env.APP_ENVIRONMENT === 'development');
    const enforceCriticalEmergencyPolicy =
      cfg.isCritical &&
      !isLocalTestOrDevHarness &&
      (process.env.NODE_ENV === 'production' ||
        explicitOutageMode ||
        process.env.APP_ENVIRONMENT === 'production' ||
        process.env.APP_ENVIRONMENT === 'staging');
    if (enforceCriticalEmergencyPolicy) {
      const fallbackRes = handleCriticalOutageFallback(
        scope,
        tier,
        cfg,
        primaryKey,
        ipHash,
        isCliBot,
        now
      );
      return maybeAttachAnonCookie(
        fallbackRes,
        cfg,
        headers,
        ipHash,
        now,
        identity.verifiedAnon,
        isCliBot,
        allowSetCookie
      );
    }
    return maybeAttachAnonCookie(
      l1,
      cfg,
      headers,
      ipHash,
      now,
      identity.verifiedAnon,
      isCliBot,
      allowSetCookie
    );
  }

  // Cooldown circuit breaker skips hanging 1500ms Upstash timeouts during active outages.
  if (now < upstashOutageUntil) {
    const fallbackRes = handleCriticalOutageFallback(
      scope,
      tier,
      cfg,
      primaryKey,
      ipHash,
      isCliBot,
      now
    );
    return maybeAttachAnonCookie(
      fallbackRes,
      cfg,
      headers,
      ipHash,
      now,
      identity.verifiedAnon,
      isCliBot,
      allowSetCookie
    );
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

    if (cfg.ipCeiling && !cfg.skipRemoteIpCeiling) {
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
    const okRes = buildResult(
      200,
      pRemote.limit || cfg.primary.limit,
      pRemote.remaining,
      pRemote.reset,
      'upstash'
    );
    return maybeAttachAnonCookie(
      okRes,
      cfg,
      headers,
      ipHash,
      now,
      identity.verifiedAnon,
      isCliBot,
      allowSetCookie
    );
  } catch (err) {
    // Log only error name (never full SDK exception objects containing URLs/headers).
    upstashOutageUntil = now + UPSTASH_CIRCUIT_COOLDOWN_MS;
    console.warn(`Rate limiter Upstash failure for ${scope}:${tier} (${(err as Error)?.name || 'Error'}); circuit breaker engaged.`);
    const fallbackRes = handleCriticalOutageFallback(
      scope,
      tier,
      cfg,
      primaryKey,
      ipHash,
      isCliBot,
      now
    );
    return maybeAttachAnonCookie(
      fallbackRes,
      cfg,
      headers,
      ipHash,
      now,
      identity.verifiedAnon,
      isCliBot,
      allowSetCookie
    );
  }
}
