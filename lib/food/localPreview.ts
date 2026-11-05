import { headers } from 'next/headers';

/**
 * Preview gate for the new Gastronomy Discovery UI.
 * Protects live production (yeriniayir.com) with multiple non-spoofable environment checks.
 *
 * Rules:
 * 1. Hard Production Guard: Never enable on production Vercel environment (VERCEL_ENV === 'production').
 * 2. Host header spoofing resistance: Hostname alone is NEVER sufficient to bypass production guard.
 * 3. Official Vercel Preview: enabled ONLY when process.env.VERCEL === '1' AND process.env.VERCEL_ENV === 'preview'.
 * 4. Staging Cloud Environment: enabled ONLY when APP_ENVIRONMENT === 'staging' or GASTRONOMY_CLOUD_ENV === 'staging'.
 * 5. Local Development: enabled ONLY on actual loopback IPs (127.0.0.1, localhost) with GASTRONOMY_LOCAL_PREVIEW === '1'.
 */
export async function isLocalFoodPreview(): Promise<boolean> {
  // 1. Unconditional Production Guard:
  // If running on Vercel with VERCEL_ENV === 'production', it is unconditionally production.
  if (process.env.VERCEL_ENV === 'production') {
    return false;
  }

  // 2. Official Vercel Preview Environment (injected securely by Vercel platform runtime)
  if (process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'preview') {
    return process.env.GASTRONOMY_ENABLE_PREVIEW !== '0';
  }

  // 3. Staging Cloud Environment
  const isStaging = process.env.APP_ENVIRONMENT === 'staging' || process.env.GASTRONOMY_CLOUD_ENV === 'staging';
  if (isStaging && process.env.GASTRONOMY_ENABLE_PREVIEW !== '0') {
    return true;
  }

  // 4. Local Loopback Development Guard
  const host = (await headers()).get('host') || '';
  const isLoopback = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host);
  if (isLoopback && process.env.GASTRONOMY_LOCAL_PREVIEW === '1') {
    return true;
  }

  return false;
}
