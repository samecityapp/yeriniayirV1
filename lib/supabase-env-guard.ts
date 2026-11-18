export const PRODUCTION_SUPABASE_REFS = [
  'jerkkxwgddujigsbeqwo',
  'aknhkpevrlpsrfxzqtop',
] as const;

export const ISOLATED_PREVIEW_SENTINEL_URL = 'https://isolated-preview-blocked.invalid';
export const ISOLATED_PREVIEW_SENTINEL_ANON_KEY = 'isolated-preview-blocked-anon-key';
const ISOLATED_LOCAL_CLIENT_URL = 'http://127.0.0.1:54321';

function isLoopbackOrPreviewHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.vercel.app')
  );
}

export function isProductionSupabaseUrl(rawUrl?: string | null): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  try {
    const parsed = new URL(rawUrl.trim());
    const hostname = parsed.hostname.toLowerCase();
    return PRODUCTION_SUPABASE_REFS.some((ref) => hostname === `${ref}.supabase.co`);
  } catch {
    return false;
  }
}

export function isNonProductionRuntime(): boolean {
  const browserHost = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : null;

  if (
    process.env.VERCEL === '1' &&
    process.env.VERCEL_ENV === 'production' &&
    (!browserHost || !isLoopbackOrPreviewHost(browserHost))
  ) {
    return false;
  }

  if (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development') {
    return true;
  }

  if (
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
  ) {
    return true;
  }

  if (
    process.env.APP_ENVIRONMENT === 'staging' ||
    process.env.GASTRONOMY_CLOUD_ENV === 'staging'
  ) {
    return true;
  }

  if (process.env.GASTRONOMY_LOCAL_PREVIEW === '1' || process.env.NODE_ENV === 'test') {
    return true;
  }

  if (browserHost && isLoopbackOrPreviewHost(browserHost)) {
    return true;
  }

  return false;
}

export function createBlockedSupabaseFetch(reason: string): typeof fetch {
  return async () =>
    new Response(
      JSON.stringify({
        message: reason,
        code: 'YA_SUPABASE_ENV_ISOLATION_BLOCKED',
        details: null,
        hint: null,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
}

export interface ResolvedPublicSupabaseConfig {
  url: string;
  anonKey: string;
  isolated: boolean;
  reason: string | null;
}

export function resolvePublicSupabaseConfig(
  rawUrl?: string,
  rawAnonKey?: string
): ResolvedPublicSupabaseConfig {
  const trimmedUrl = rawUrl?.trim();
  const trimmedAnonKey = rawAnonKey?.trim();

  if (
    trimmedUrl === ISOLATED_PREVIEW_SENTINEL_URL ||
    (isNonProductionRuntime() && isProductionSupabaseUrl(trimmedUrl))
  ) {
    return {
      url: ISOLATED_LOCAL_CLIENT_URL,
      anonKey: 'isolated-non-production-anon-key',
      isolated: true,
      reason: 'Preview/staging/test environment is blocked from accessing live production Supabase.',
    };
  }

  if (!trimmedUrl || !trimmedAnonKey) {
    throw new Error('Missing Supabase environment variables. Check .env file.');
  }

  return {
    url: trimmedUrl,
    anonKey: trimmedAnonKey,
    isolated: false,
    reason: null,
  };
}

export function getAllowedPublicSupabaseOrigin(rawUrl?: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl || trimmedUrl === ISOLATED_PREVIEW_SENTINEL_URL) return null;
  if (isNonProductionRuntime() && isProductionSupabaseUrl(trimmedUrl)) return null;

  try {
    const parsed = new URL(trimmedUrl);
    if (parsed.protocol !== 'https:') return null;
    if (isLoopbackOrPreviewHost(parsed.hostname.toLowerCase())) return null;
    if (parsed.hostname.toLowerCase() === 'isolated-preview-blocked.invalid') return null;
    return parsed.origin;
  } catch {
    return null;
  }
}
