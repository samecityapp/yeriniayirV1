import { cookies, headers } from 'next/headers';
import { ADMIN_COOKIE } from '@/lib/cloud/auth';
import { cloudClient } from '@/lib/cloud/client';
import { checkPilotAdmin } from '@/lib/pilot/adminAuth';

if (typeof window !== 'undefined') {
  throw new Error('SECURITY VIOLATION: lib/admin/offerAdminGuard.ts must never be imported in client components.');
}

const OFFER_ADMIN_CAPABILITY = Symbol('OfferAdminCapability');
const PENDING_COOKIE = 'ya_cloud_pending';

export interface OfferAdminCapability {
  readonly [OFFER_ADMIN_CAPABILITY]: true;
  readonly mode: 'cloud_mfa' | 'pilot_basic';
  readonly userId?: string;
}

export type OfferAdminGuardResult =
  | { ok: true; capability: OfferAdminCapability }
  | { ok: false; status: 401 | 403 | 503; error: string };

export function assertValidOfferAdminCapability(cap: unknown): asserts cap is OfferAdminCapability {
  if (
    !cap ||
    typeof cap !== 'object' ||
    (cap as Record<symbol, unknown>)[OFFER_ADMIN_CAPABILITY] !== true
  ) {
    throw new Error('SECURITY VIOLATION: Validated admin capability is required.');
  }
}

function isLoopbackHost(host: string): boolean {
  return /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host);
}

function readCookieValue(rawCookieHeader: string | null, cookieName: string): string | null {
  if (!rawCookieHeader) return null;
  const parts = rawCookieHeader.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx <= 0) continue;
    if (trimmed.slice(0, eqIdx).trim() === cookieName) {
      return decodeURIComponent(trimmed.slice(eqIdx + 1).trim());
    }
  }
  return null;
}

function hasNonAdminUserSessionSignals(
  requestHeaders: Headers,
  pendingCookieToken?: string | null
): boolean {
  const authHeader = requestHeaders.get('authorization')?.trim() || '';
  if (/^Bearer\s+/i.test(authHeader)) return true;
  if (pendingCookieToken) return true;
  const rawCookie = requestHeaders.get('cookie') || '';
  return /(?:^|;\s*)(?:ya_cloud_pending|sb-[^=;]*-auth-token)=/i.test(rawCookie);
}

function verifySameOriginHeaders(requestHeaders: Headers): boolean {
  if (requestHeaders.get('sec-fetch-site') === 'cross-site') return false;
  const origin = requestHeaders.get('origin')?.trim();
  const host = requestHeaders.get('host')?.trim();
  if (!origin || !host) return false;
  try {
    const incoming = new URL(origin);
    if (incoming.username || incoming.password) return false;
    if (incoming.origin !== origin || incoming.host !== host) return false;
    if (isLoopbackHost(incoming.host)) {
      return incoming.protocol === 'http:' || incoming.protocol === 'https:';
    }
    return incoming.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function verifyOfferAdminRequest(options: {
  requestHeaders: Headers;
  cookieToken?: string | null;
  pendingCookieToken?: string | null;
  requireSameOrigin: boolean;
}): Promise<OfferAdminGuardResult> {
  const { requestHeaders, requireSameOrigin } = options;
  const rawCookieHeader = requestHeaders.get('cookie');
  const cookieToken =
    options.cookieToken ?? readCookieValue(rawCookieHeader, ADMIN_COOKIE);
  const pendingCookieToken =
    options.pendingCookieToken ?? readCookieValue(rawCookieHeader, PENDING_COOKIE);

  if (requireSameOrigin && !verifySameOriginHeaders(requestHeaders)) {
    return {
      ok: false,
      status: 403,
      error: 'Cross-origin request forbidden',
    };
  }

  if (process.env.GASTRONOMY_AUTH_MODE === 'supabase') {
    if (!cookieToken) {
      if (hasNonAdminUserSessionSignals(requestHeaders, pendingCookieToken)) {
        return {
          ok: false,
          status: 403,
          error: 'Forbidden: MFA admin session required',
        };
      }
      return {
        ok: false,
        status: 401,
        error: 'Unauthorized',
      };
    }

    try {
      const client = cloudClient(cookieToken);
      const { data, error } = await client.auth.getUser(cookieToken);
      if (error || !data.user || data.user.is_anonymous) {
        return {
          ok: false,
          status: 401,
          error: 'Unauthorized',
        };
      }

      const membership = await client.rpc('ya_is_admin');
      if (membership.error || membership.data !== true) {
        return {
          ok: false,
          status: 403,
          error: 'Forbidden: Admin MFA privileges required',
        };
      }

      return {
        ok: true,
        capability: {
          [OFFER_ADMIN_CAPABILITY]: true,
          mode: 'cloud_mfa',
          userId: data.user.id,
        },
      };
    } catch {
      return {
        ok: false,
        status: 503,
        error: 'Cloud auth configuration unavailable',
      };
    }
  }

  const authHeader = requestHeaders.get('authorization')?.trim() || '';
  if (/^Bearer\s+/i.test(authHeader)) {
    return {
      ok: false,
      status: 403,
      error: 'Forbidden: Admin privileges required',
    };
  }

  const basicAuth = await checkPilotAdmin(requestHeaders.get('authorization'));
  if (!basicAuth.ok) {
    if (basicAuth.status === 503) {
      return {
        ok: false,
        status: 503,
        error: 'Admin configuration unavailable',
      };
    }
    if (hasNonAdminUserSessionSignals(requestHeaders, pendingCookieToken)) {
      return {
        ok: false,
        status: 403,
        error: 'Forbidden: Admin privileges required',
      };
    }
    return {
      ok: false,
      status: 401,
      error: 'Unauthorized',
    };
  }

  return {
    ok: true,
    capability: {
      [OFFER_ADMIN_CAPABILITY]: true,
      mode: 'pilot_basic',
    },
  };
}

export async function requireOfferAdminAccess(options?: {
  requireSameOrigin?: boolean;
}): Promise<OfferAdminGuardResult> {
  const [requestHeaders, jar] = await Promise.all([headers(), cookies()]);
  return verifyOfferAdminRequest({
    requestHeaders,
    cookieToken: jar.get(ADMIN_COOKIE)?.value ?? null,
    pendingCookieToken: jar.get(PENDING_COOKIE)?.value ?? null,
    requireSameOrigin: options?.requireSameOrigin ?? true,
  });
}
