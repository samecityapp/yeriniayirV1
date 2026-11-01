import { headers } from 'next/headers';

/**
 * Preview gate for the new Gastronomy Discovery UI.
 * Protects live production (yeriniayir.com) from accidental premature release.
 *
 * Activates Gastronomy Discovery UI when:
 * 1. Local development loopback with GASTRONOMY_LOCAL_PREVIEW === '1'
 * 2. Vercel Preview deployments (VERCEL_ENV === 'preview' or host includes '.vercel.app')
 * 3. Staging cloud environment (APP_ENVIRONMENT === 'staging' or GASTRONOMY_CLOUD_ENV === 'staging')
 *
 * Production host (yeriniayir.com) safely returns false, keeping existing legacy hotel pages untouched.
 */
export async function isLocalFoodPreview(): Promise<boolean> {
  const host = (await headers()).get('host') || '';
  const isLoopback = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host);

  if (process.env.GASTRONOMY_LOCAL_PREVIEW === '1' && isLoopback) {
    return true;
  }

  const isVercelPreview = process.env.VERCEL_ENV === 'preview' || host.includes('.vercel.app');
  const isStagingEnv = process.env.APP_ENVIRONMENT === 'staging' || process.env.GASTRONOMY_CLOUD_ENV === 'staging';

  if ((isVercelPreview || isStagingEnv) && process.env.GASTRONOMY_ENABLE_PREVIEW !== '0') {
    return true;
  }

  return false;
}
