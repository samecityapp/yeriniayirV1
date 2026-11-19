import { validUpstashConfig } from './rateLimitConfig';

export type EmergencyLevel = 'off' | 'shed' | 'lockdown';

/**
 * NOTE ABOUT VERCEL ENVIRONMENT VARIABLES VS RUNTIME EMERGENCY SWITCH:
 * On Vercel, normal environment variables (such as `process.env.TRAFFIC_EMERGENCY_MODE`)
 * are baked into a deployment snapshot — changing them in the Vercel Dashboard does NOT
 * affect already-running deployments until a Redeploy completes.
 *
 * To provide a true <15s zero-redeploy kill-switch alongside the static env fallback,
 * `resolveRuntimeEmergencyMode` / `evaluateRuntimeEmergencyShedding` polls the small
 * Upstash Redis REST key `ya:pilot:emergency_mode` ONLY for sheddable non-core routes
 * and critical admin mutations, with a 15s V8-isolate cache, 400ms abort timeout,
 * 10s outage cooldown, and strict 0-Upstash bypass for core Gastronomi V5 routes.
 */
export const EMERGENCY_MODE_REDIS_KEY = 'ya:pilot:emergency_mode';
const DEFAULT_RUNTIME_CACHE_TTL_MS = 15_000;
const RUNTIME_FETCH_TIMEOUT_MS = 400;
const RUNTIME_FAILURE_COOLDOWN_MS = 10_000;

const CORE_LEGAL_PATH_RE =
  /^\/(?:tr|en|el)\/(?:cerez-politikasi|gizlilik-politikasi|kullanim-kosullari|kullanim-sartlari|kvkk-aydinlatma-metni|hakkimizda)$/;
const REGION_API_PATH_RE = /^\/api\/gastronomy\/regions\/[^/]+$/;
const STATIC_ASSET_PATH_RE =
  /^\/(?:_next\/static\/|images\/gastronomy\/|fonts\/|favicon\.ico$|icon\.png$|apple-icon\.png$|icon-192\.png$|icon-512\.png$|logo\.png$|logo-green\.png$|logo\.svg$|yeriniayir-logo\.png$|manifest\.webmanifest$|robots\.txt$|sitemap\.xml$)/;
const ADMIN_PATH_SEGMENT_RE =
  /(?:^|\/)(?:jilinrime|gastronomi-yonetimi|moda-kadikoy-pilot)(?:$|\/|\.)/i;
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]']);

const EMERGENCY_RANK: Record<EmergencyLevel, number> = {
  off: 0,
  shed: 1,
  lockdown: 2,
};

let cachedRuntimeMode: { value: EmergencyLevel; expiresAt: number } | null = null;
let runtimeOutageUntil = 0;
let inFlightRuntimeFetch: Promise<EmergencyLevel> | null = null;

export function resetEmergencyModeCacheForTests(): void {
  cachedRuntimeMode = null;
  runtimeOutageUntil = 0;
  inFlightRuntimeFetch = null;
}

export function parseEmergencyLevel(raw: unknown): EmergencyLevel {
  const normalized = String(raw || '').trim().toLowerCase();
  if (
    normalized === '2' ||
    normalized === 'lockdown' ||
    normalized === 'under_attack' ||
    normalized === 'attack'
  ) {
    return 'lockdown';
  }
  if (
    normalized === '1' ||
    normalized === 'true' ||
    normalized === 'shed' ||
    normalized === 'cost'
  ) {
    return 'shed';
  }
  return 'off';
}

export function getEmergencyMode(env: NodeJS.ProcessEnv = process.env): EmergencyLevel {
  return parseEmergencyLevel(env.TRAFFIC_EMERGENCY_MODE);
}

export function isCoreGastronomyVisitorPath(canonicalPathname: string): boolean {
  if (
    canonicalPathname === '/' ||
    canonicalPathname === '/tr' ||
    canonicalPathname === '/en' ||
    canonicalPathname === '/el'
  ) {
    return true;
  }
  if (REGION_API_PATH_RE.test(canonicalPathname)) {
    return true;
  }
  if (CORE_LEGAL_PATH_RE.test(canonicalPathname)) {
    return true;
  }
  return false;
}

export type EmergencyShedDecision =
  | { shed: false }
  | {
      shed: true;
      mode: 'shed' | 'lockdown';
      status: 202 | 503;
      reason: string;
      asJson: boolean;
    };

function evaluateDecisionForMode(
  canonicalPathname: string,
  method: string,
  mode: EmergencyLevel
): EmergencyShedDecision {
  if (mode === 'off') {
    return { shed: false };
  }

  const upperMethod = (method || 'GET').toUpperCase();
  const isReadMethod = upperMethod === 'GET' || upperMethod === 'HEAD';

  if (isCoreGastronomyVisitorPath(canonicalPathname) && isReadMethod) {
    return { shed: false };
  }

  if (STATIC_ASSET_PATH_RE.test(canonicalPathname) && isReadMethod) {
    return { shed: false };
  }

  if (canonicalPathname === '/api/track-event') {
    return {
      shed: true,
      mode,
      status: 202,
      reason: 'emergency-analytics-shed',
      asJson: true,
    };
  }

  if (canonicalPathname.startsWith('/_next/image')) {
    return {
      shed: true,
      mode,
      status: 503,
      reason: 'emergency-image-opt-shed',
      asJson: false,
    };
  }

  if (canonicalPathname === '/api/go' || canonicalPathname === '/api/gastronomy-public') {
    return {
      shed: true,
      mode,
      status: 503,
      reason: 'emergency-dynamic-api-shed',
      asJson: true,
    };
  }

  if (canonicalPathname.startsWith('/api/gastronomy-admin/')) {
    if (
      mode === 'lockdown' &&
      (canonicalPathname === '/api/gastronomy-admin/publish' ||
        canonicalPathname === '/api/gastronomy-admin/research' ||
        (!isReadMethod &&
          canonicalPathname !== '/api/gastronomy-admin/login' &&
          canonicalPathname !== '/api/gastronomy-admin/logout'))
    ) {
      return {
        shed: true,
        mode,
        status: 503,
        reason: 'emergency-lockdown-admin-mutation',
        asJson: true,
      };
    }
    return { shed: false };
  }

  if (canonicalPathname.startsWith('/api/') || ADMIN_PATH_SEGMENT_RE.test(canonicalPathname)) {
    return { shed: false };
  }

  return {
    shed: true,
    mode,
    status: 503,
    reason: 'emergency-legacy-route-shed',
    asJson: false,
  };
}

export function evaluateEmergencyShedding(
  canonicalPathname: string,
  method: string,
  env: NodeJS.ProcessEnv = process.env
): EmergencyShedDecision {
  return evaluateDecisionForMode(canonicalPathname, method, getEmergencyMode(env));
}

function resolveRuntimeCacheTtlMs(env: NodeJS.ProcessEnv): number {
  const override = Number(env.EMERGENCY_MODE_CACHE_TTL_MS);
  if (Number.isFinite(override) && override >= 50 && override <= 60_000) {
    return override;
  }
  return DEFAULT_RUNTIME_CACHE_TTL_MS;
}

function resolveRuntimeEmergencyUpstashEndpoint(
  env: NodeJS.ProcessEnv
): { url: string; token: string } | null {
  const isCloudRuntime =
    env.APP_ENVIRONMENT === 'production' ||
    env.APP_ENVIRONMENT === 'staging' ||
    env.VERCEL_ENV === 'production';

  if (isCloudRuntime) {
    return validUpstashConfig(env);
  }

  if (env.EMERGENCY_RUNTIME_UPSTASH !== '1') {
    return null;
  }

  const strict = validUpstashConfig(env);
  if (strict) return strict;

  const rawUrl = env.UPSTASH_REDIS_REST_URL || '';
  const token = env.UPSTASH_REDIS_REST_TOKEN || '';
  if (!rawUrl || !token || rawUrl !== rawUrl.trim() || /\s|[\x00-\x1f\x7f]/.test(token)) {
    return null;
  }

  try {
    const parsed = new URL(rawUrl);
    if (
      parsed.protocol === 'http:' &&
      LOOPBACK_HOSTS.has(parsed.hostname.toLowerCase()) &&
      !parsed.username &&
      !parsed.password &&
      !parsed.search &&
      !parsed.hash
    ) {
      return {
        url: `${parsed.origin}${parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/+$/, '')}`,
        token,
      };
    }
  } catch {
    return null;
  }

  return null;
}

function maxEmergencyLevel(a: EmergencyLevel, b: EmergencyLevel): EmergencyLevel {
  return EMERGENCY_RANK[a] >= EMERGENCY_RANK[b] ? a : b;
}

export async function resolveRuntimeEmergencyMode(
  env: NodeJS.ProcessEnv = process.env
): Promise<EmergencyLevel> {
  const staticMode = getEmergencyMode(env);
  if (staticMode === 'lockdown') {
    return 'lockdown';
  }

  const endpoint = resolveRuntimeEmergencyUpstashEndpoint(env);
  if (!endpoint) {
    return staticMode;
  }

  const now = Date.now();
  if (cachedRuntimeMode && now < cachedRuntimeMode.expiresAt) {
    return maxEmergencyLevel(staticMode, cachedRuntimeMode.value);
  }

  if (now < runtimeOutageUntil) {
    return staticMode;
  }

  if (inFlightRuntimeFetch) {
    const dynamicMode = await inFlightRuntimeFetch;
    return maxEmergencyLevel(staticMode, dynamicMode);
  }

  const ttlMs = resolveRuntimeCacheTtlMs(env);
  inFlightRuntimeFetch = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), RUNTIME_FETCH_TIMEOUT_MS);
    try {
      const targetUrl = `${endpoint.url}/get/${encodeURIComponent(EMERGENCY_MODE_REDIS_KEY)}`;
      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${endpoint.token}`,
        },
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!res.ok) {
        runtimeOutageUntil = Date.now() + RUNTIME_FAILURE_COOLDOWN_MS;
        return 'off';
      }
      const data = (await res.json()) as { result?: unknown };
      const parsed = parseEmergencyLevel(data?.result);
      cachedRuntimeMode = {
        value: parsed,
        expiresAt: Date.now() + ttlMs,
      };
      runtimeOutageUntil = 0;
      return parsed;
    } catch {
      runtimeOutageUntil = Date.now() + RUNTIME_FAILURE_COOLDOWN_MS;
      return 'off';
    } finally {
      clearTimeout(timer);
      inFlightRuntimeFetch = null;
    }
  })();

  const dynamicMode = await inFlightRuntimeFetch;
  return maxEmergencyLevel(staticMode, dynamicMode);
}

export async function evaluateRuntimeEmergencyShedding(
  canonicalPathname: string,
  method: string,
  env: NodeJS.ProcessEnv = process.env
): Promise<EmergencyShedDecision> {
  const upperMethod = (method || 'GET').toUpperCase();
  const isReadMethod = upperMethod === 'GET' || upperMethod === 'HEAD';

  // Core Gastronomi V5 & static assets NEVER incur Upstash calls or shedding overhead.
  if (
    (isCoreGastronomyVisitorPath(canonicalPathname) && isReadMethod) ||
    (STATIC_ASSET_PATH_RE.test(canonicalPathname) && isReadMethod)
  ) {
    return { shed: false };
  }

  const envMode = getEmergencyMode(env);
  const staticDecision = evaluateDecisionForMode(canonicalPathname, method, envMode);
  if (envMode === 'lockdown' || (staticDecision.shed && !canonicalPathname.startsWith('/api/gastronomy-admin/'))) {
    return staticDecision;
  }

  const mode = await resolveRuntimeEmergencyMode(env);
  return evaluateDecisionForMode(canonicalPathname, method, mode);
}
