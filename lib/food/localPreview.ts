/**
 * Preview gate for the Gastronomy Discovery UI without per-request headers() overhead.
 * Protects live production (yeriniayir.com) using build/runtime platform environment flags.
 *
 * Rules:
 * 1. Hard Production Guard: Never enable on production Vercel environment (VERCEL_ENV === 'production').
 * 2. Official Vercel Preview: enabled ONLY when process.env.VERCEL === '1' AND process.env.VERCEL_ENV === 'preview'.
 * 3. Staging Cloud Environment: enabled ONLY when APP_ENVIRONMENT === 'staging' or GASTRONOMY_CLOUD_ENV === 'staging'.
 * 4. Local Development: enabled ONLY when not in Vercel/production runtime and GASTRONOMY_LOCAL_PREVIEW === '1'.
 */
export function isLocalFoodPreviewSync(): boolean {
  if (process.env.VERCEL_ENV === 'production') {
    return false;
  }

  if (process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'preview') {
    return process.env.GASTRONOMY_ENABLE_PREVIEW !== '0';
  }

  const isStaging =
    process.env.APP_ENVIRONMENT === 'staging' ||
    process.env.GASTRONOMY_CLOUD_ENV === 'staging';
  if (isStaging && process.env.GASTRONOMY_ENABLE_PREVIEW !== '0') {
    return true;
  }

  if (
    process.env.VERCEL !== '1' &&
    process.env.APP_ENVIRONMENT !== 'production' &&
    process.env.GASTRONOMY_CLOUD_ENV !== 'production' &&
    process.env.GASTRONOMY_LOCAL_PREVIEW === '1'
  ) {
    return true;
  }

  return false;
}

export async function isLocalFoodPreview(): Promise<boolean> {
  return isLocalFoodPreviewSync();
}
