import {
  configuration,
  PRODUCTION_BROWSER_HOSTS,
  PRODUCTION_REFS,
  publicKey,
  target,
  type Target,
} from './security/supabase-policy';

export const PRODUCTION_SUPABASE_REFS = PRODUCTION_REFS;
export const ISOLATED_PREVIEW_SENTINEL_URL = 'https://isolated-preview-blocked.invalid';
export const ISOLATED_PREVIEW_SENTINEL_ANON_KEY = 'isolated-preview-blocked-anon-key';
const ISOLATED_LOCAL_CLIENT_URL = 'http://127.0.0.1:54321';

export function isProductionSupabaseUrl(rawUrl?: string | null): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  try {
    const parsed = new URL(rawUrl.trim());
    const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '');
    return PRODUCTION_REFS.some((ref) => hostname === `${ref}.supabase.co`);
  } catch {
    return false;
  }
}

// Non-secret build descriptor must agree with validated server runtime and allowed browser origins.
export function validatedSupabaseTarget(): Target {
  const built = process.env.NEXT_PUBLIC_SUPABASE_POLICY;
  if (built === 'ISOLATED') {
    throw new Error('Supabase build policy isolated');
  }

  let descriptor: Target | undefined;
  if (built) {
    const parsed = JSON.parse(built);
    descriptor = target(parsed?.url, parsed?.environment);
    if (descriptor.ref !== parsed?.ref) {
      throw new Error('Supabase build policy rejected');
    }
  }

  if (typeof window !== 'undefined') {
    if (!descriptor) {
      throw new Error('Supabase build policy missing');
    }
    const host = window.location.hostname.toLowerCase();
    if (!host || host.endsWith('.')) {
      throw new Error('Malformed or trailing-dot browser origin rejected');
    }
    if (descriptor.environment === 'production' && !PRODUCTION_BROWSER_HOSTS.includes(host)) {
      throw new Error('Production Supabase browser origin rejected');
    }
    if (
      (descriptor.environment === 'preview' || descriptor.environment === 'staging') &&
      PRODUCTION_BROWSER_HOSTS.includes(host)
    ) {
      throw new Error('Non-production Supabase browser origin rejected on production host');
    }
    if (
      (descriptor.environment === 'test' || descriptor.environment === 'development') &&
      !['127.0.0.1', 'localhost', '[::1]'].includes(host)
    ) {
      throw new Error('Local Supabase browser origin rejected');
    }
    return descriptor;
  }

  const runtime = configuration(process.env);
  if (
    descriptor &&
    (descriptor.environment !== runtime.environment ||
      descriptor.url !== runtime.url ||
      descriptor.ref !== runtime.ref)
  ) {
    throw new Error('Supabase build/runtime mismatch');
  }
  return runtime;
}

export function isNonProductionRuntime(): boolean {
  try {
    return validatedSupabaseTarget().environment !== 'production';
  } catch {
    return true;
  }
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

export function createTimedSupabaseFetch(timeoutMs = 8000): typeof fetch {
  return async (input, init) => {
    const controller = new AbortController();
    const externalSignal = init?.signal;
    const abort = () => controller.abort();
    if (externalSignal?.aborted) {
      abort();
    } else {
      externalSignal?.addEventListener('abort', abort, { once: true });
    }
    const timer = setTimeout(abort, timeoutMs);
    try {
      return await globalThis.fetch(input, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
      externalSignal?.removeEventListener('abort', abort);
    }
  };
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
  try {
    const expected = validatedSupabaseTarget();
    if (target(rawUrl, expected.environment).url !== expected.url) {
      throw new Error('Target mismatch');
    }
    return {
      url: expected.url,
      anonKey: publicKey(rawAnonKey),
      isolated: false,
      reason: null,
    };
  } catch {
    return {
      url: ISOLATED_LOCAL_CLIENT_URL,
      anonKey: 'isolated-non-production-anon-key',
      isolated: true,
      reason: 'Supabase security configuration rejected; client isolated in fail-closed mode.',
    };
  }
}

export function getAllowedPublicSupabaseOrigin(rawUrl?: string): string | null {
  try {
    const expected = validatedSupabaseTarget();
    return target(rawUrl, expected.environment).url === expected.url &&
      expected.url.startsWith('https:')
      ? expected.url
      : null;
  } catch {
    return null;
  }
}
