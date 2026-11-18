// Pure shared policy: Next build, browser and server use the same allowlist.
const PRODUCTION_REFS = ['jerkkxwgddujigsbeqwo', 'aknhkpevrlpsrfxzqtop'];
const STAGING_REFS = ['vhptlecaixpawtxnhsde'];
const ENVIRONMENTS = ['production', 'preview', 'staging', 'development', 'test'];
const PRODUCTION_BROWSER_HOSTS = [
  'yeriniayir.com',
  'www.yeriniayir.com',
  'worldandhotels.com',
  'www.worldandhotels.com',
];

function fail(message) {
  throw new Error(message || 'Supabase security configuration rejected');
}

function decodeJwtPayload(token) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3 || !parts[1]) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function environment(env) {
  if (!env || typeof env !== 'object') fail();
  const mode = env.APP_ENVIRONMENT;
  if (!ENVIRONMENTS.includes(mode)) fail();
  if (env.VERCEL && env.VERCEL !== '1') fail();
  if (env.VERCEL_ENV && !['production', 'preview', 'development'].includes(env.VERCEL_ENV)) fail();
  if (env.VERCEL === '1' && !env.VERCEL_ENV) fail();
  if (env.NEXT_PUBLIC_VERCEL_ENV && env.NEXT_PUBLIC_VERCEL_ENV !== env.VERCEL_ENV) fail();
  if (env.VERCEL_ENV === 'production' && mode !== 'production') fail();
  if (env.VERCEL_ENV === 'preview' && !['preview', 'staging'].includes(mode)) fail();
  if (env.VERCEL_ENV === 'development' && mode !== 'development') fail();
  if (env.GASTRONOMY_LOCAL_PREVIEW && !['0', '1'].includes(env.GASTRONOMY_LOCAL_PREVIEW)) fail();
  if (env.GASTRONOMY_LOCAL_PREVIEW === '1' && !['development', 'test'].includes(mode)) fail();
  if (env.NODE_ENV === 'test' && mode !== 'test') fail();
  if (env.NODE_ENV === 'development' && mode !== 'development') fail();
  if ((mode === 'test' || mode === 'development') && (env.VERCEL || env.VERCEL_ENV)) fail();
  if (
    mode === 'production' &&
    (env.VERCEL !== '1' ||
      env.VERCEL_ENV !== 'production' ||
      env.NODE_ENV === 'development' ||
      env.NODE_ENV === 'test' ||
      env.SUPABASE_PRODUCTION_AUTHORIZED !== '1')
  ) {
    fail();
  }
  if (env.GASTRONOMY_CLOUD_ENV) {
    const expected =
      mode === 'production'
        ? 'production'
        : mode === 'development' || mode === 'test'
          ? 'local'
          : 'staging';
    if (env.GASTRONOMY_CLOUD_ENV !== expected) fail();
  }
  return mode;
}

function target(raw, mode) {
  if (!ENVIRONMENTS.includes(mode) || typeof raw !== 'string') fail();
  const trimmed = raw.trim();
  if (!trimmed) fail();
  let u;
  try {
    u = new URL(trimmed);
  } catch {
    fail();
  }
  if (u.username || u.password || u.search || u.hash || u.pathname !== '/') fail();
  // Reject trailing dots or raw host suffixes ending in '.' instead of relying on DNS normalization.
  const withoutTrailingSlashes = trimmed.replace(/\/+$/, '');
  if (u.hostname.endsWith('.') || withoutTrailingSlashes.endsWith('.')) fail();

  if (mode === 'development' || mode === 'test') {
    if (u.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(u.hostname.toLowerCase())) {
      fail();
    }
    return { environment: mode, url: u.origin, ref: 'local' };
  }

  if (u.protocol !== 'https:' || u.port) fail();
  const hostLower = u.hostname.toLowerCase();
  const refs = mode === 'production' ? PRODUCTION_REFS : STAGING_REFS;
  const ref = refs.find((r) => hostLower === `${r}.supabase.co`);
  if (!ref) fail();
  return { environment: mode, url: u.origin, ref };
}

function publicKey(key) {
  if (typeof key !== 'string') fail();
  const trimmed = key.trim();
  if (!trimmed || trimmed.startsWith('sb_secret_')) fail();
  // A legacy JWT in a public variable must explicitly carry the anon role.
  if (trimmed.split('.').length === 3) {
    const payload = decodeJwtPayload(trimmed);
    if (!payload || payload.role !== 'anon') fail();
  }
  return trimmed;
}

function serviceRoleKey(key, expectedRef, mode) {
  if (typeof key !== 'string') fail();
  const trimmed = key.trim();
  if (!trimmed || trimmed.startsWith('sb_publishable_')) fail();
  if (trimmed.split('.').length === 3) {
    const payload = decodeJwtPayload(trimmed);
    if (!payload || payload.role !== 'service_role') fail();
    if (payload.ref && expectedRef && expectedRef !== 'local' && payload.ref !== expectedRef) {
      fail();
    }
    return trimmed;
  }
  if (trimmed.startsWith('sb_secret_') && trimmed.length >= 20) {
    return trimmed;
  }
  // In local dev/test harnesses opaque dummy tokens may be used against loopback mocks;
  // cloud preview/staging/production require an actual service_role JWT or sb_secret_ credential.
  if (mode === 'development' || mode === 'test') {
    return trimmed;
  }
  fail();
}

function configuration(env) {
  const mode = environment(env);
  const result = target(env.NEXT_PUBLIC_SUPABASE_URL, mode);
  publicKey(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return result;
}

function authMode(env) {
  const mode = environment(env);
  if (env.GASTRONOMY_AUTH_MODE !== 'basic' && env.GASTRONOMY_AUTH_MODE !== 'supabase') fail();
  if (env.GASTRONOMY_AUTH_MODE === 'basic' && mode !== 'development' && mode !== 'test') fail();
  return env.GASTRONOMY_AUTH_MODE;
}

function hasValidCloudAdminJwtClaims(token, expectedIssuerOrigin, requireJwt) {
  if (typeof token !== 'string' || !token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) {
    return !requireJwt;
  }
  const payload = decodeJwtPayload(token);
  if (!payload || payload.aal !== 'aal2') {
    return false;
  }
  if (
    expectedIssuerOrigin &&
    typeof payload.iss === 'string' &&
    !payload.iss.startsWith(expectedIssuerOrigin)
  ) {
    return false;
  }
  return true;
}

module.exports = {
  PRODUCTION_REFS,
  STAGING_REFS,
  ENVIRONMENTS,
  PRODUCTION_BROWSER_HOSTS,
  decodeJwtPayload,
  hasValidCloudAdminJwtClaims,
  environment,
  target,
  publicKey,
  serviceRoleKey,
  configuration,
  authMode,
};
