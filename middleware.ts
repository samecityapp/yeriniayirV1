import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { cloudClient } from '@/lib/cloud/client';
import { cloudConfig } from '@/lib/cloud/config';
import { checkPilotAdmin, PILOT_PRIVATE_HEADERS, pilotAuthFailureHeaders } from '@/lib/pilot/adminAuth';
import { authMode, hasValidCloudAdminJwtClaims } from '@/lib/pilot/securityPolicy';

const locales = ['tr', 'en', 'el'];

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

function privateSecurityHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    'Cache-Control': 'private, no-store, max-age=0',
    Vary: 'Cookie, Authorization',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    ...extra,
  };
}

async function verifyCloudAdminCookie(token: string | undefined): Promise<
  { ok: true } | { ok: false; status: 401 | 403 | 503 }
> {
  if (!token) {
    return { ok: false, status: 401 };
  }
  try {
    const cfg = cloudConfig();
    const requireJwt =
      cfg.environment === 'production' ||
      cfg.environment === 'staging' ||
      cfg.environment === 'preview';
    if (!hasValidCloudAdminJwtClaims(token, cfg.url, requireJwt)) {
      return { ok: false, status: 403 };
    }
    const client = cloudClient(token);
    const user = await client.auth.getUser(token);
    if (user.error || !user.data.user || user.data.user.is_anonymous) {
      return { ok: false, status: 401 };
    }
    const membership = await client.rpc('ya_is_admin');
    if (membership.error || membership.data !== true) {
      return { ok: false, status: 403 };
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 503 };
  }
}

async function applicationMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get('host') || '';
  const ip = request.headers.get('x-real-ip') || '127.0.0.1';

  // Independent cloud endpoints authenticate inside each handler; no legacy Basic fallback.
  if (
    pathname.startsWith('/api/gastronomy-admin/') ||
    pathname === '/api/gastronomy-public' ||
    pathname.split('/').includes('gastronomi-yonetimi')
  ) {
    const response = NextResponse.next();
    if (pathname !== '/api/gastronomy-public') {
      response.headers.set('Cache-Control', 'private, no-store, max-age=0');
      response.headers.set('Vary', 'Cookie');
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }
    return response;
  }

  // Protect all locales, the locale-free alias and child routes before static-file skips.
  // Route handlers also authenticate independently of middleware.
  const isPilot = pathname.split('/').includes('moda-kadikoy-pilot');
  if (isPilot) {
    const auth = await checkPilotAdmin(request.headers.get('authorization'));
    if (!auth.ok) {
      return new NextResponse(auth.status === 503 ? 'Admin configuration unavailable' : 'Auth Required', {
        status: auth.status,
        headers: pilotAuthFailureHeaders(auth.status),
      });
    }
    const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
    const response = hasLocale
      ? NextResponse.next()
      : NextResponse.rewrite(
          new URL(
            `/${hostname === 'worldandhotels.com' || hostname === 'www.worldandhotels.com' ? 'en' : 'tr'}${pathname}`,
            request.url
          )
        );
    for (const [name, value] of Object.entries(PILOT_PRIVATE_HEADERS)) response.headers.set(name, value);
    return response;
  }

  const applyJilinrimeHeaders = (response: NextResponse, mode: 'basic' | 'supabase') => {
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Vary', mode === 'supabase' ? 'Cookie' : 'Authorization');
    return response;
  };

  let jilinrimeAuthMode: 'basic' | 'supabase' = 'basic';
  const isJilinrime = pathname.split('/').includes('jilinrime');
  if (isJilinrime) {
    try {
      jilinrimeAuthMode = authMode(process.env);
    } catch {
      return new NextResponse('Admin configuration unavailable', {
        status: 503,
        headers: privateSecurityHeaders(),
      });
    }

    if (jilinrimeAuthMode === 'supabase') {
      const check = await verifyCloudAdminCookie(request.cookies.get('ya_cloud_admin')?.value);
      if (!check.ok) {
        return new NextResponse(
          check.status === 503 ? 'Admin configuration unavailable' : 'Auth Required',
          {
            status: check.status,
            headers: {
              'Cache-Control': 'private, no-store, max-age=0',
              Vary: 'Cookie',
              'X-Robots-Tag': 'noindex, nofollow',
            },
          }
        );
      }
    } else {
      const auth = await checkPilotAdmin(request.headers.get('authorization'));
      if (!auth.ok) {
        return new NextResponse(auth.status === 503 ? 'Admin configuration unavailable' : 'Auth Required', {
          status: auth.status,
          headers: {
            ...pilotAuthFailureHeaders(auth.status),
            'X-Robots-Tag': 'noindex, nofollow',
          },
        });
      }
    }
  }

  // Skip internal Next.js paths and static files after admin route protections run.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    const res = NextResponse.next();
    return isJilinrime ? applyJilinrimeHeaders(res, jilinrimeAuthMode) : res;
  }

  // Rate limit API routes and Admin sections only to avoid latency on normal navigation.
  try {
    if (process.env.NODE_ENV === 'production' && (pathname.startsWith('/api') || isJilinrime)) {
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_middleware_${ip}`);
      if (!success) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        });
      }
    }
  } catch (error) {
    console.error('Rate Limiting Error (Fail Open):', error);
  }

  const DOMAIN_TR = 'yeriniayir.com';
  const DOMAIN_EN = 'worldandhotels.com';
  const isDev = hostname.includes('localhost') || hostname.endsWith('.vercel.app');
  const isEnglishDomain = hostname === DOMAIN_EN || hostname === `www.${DOMAIN_EN}`;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  const urlLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (isEnglishDomain) {
    if (urlLocale === 'tr') {
      return NextResponse.redirect(new URL(pathname, `https://${DOMAIN_TR}`));
    }
    if (pathnameIsMissingLocale) {
      const res = NextResponse.rewrite(new URL(`/en${pathname}`, request.url));
      return isJilinrime ? applyJilinrimeHeaders(res, jilinrimeAuthMode) : res;
    }
  } else {
    if (urlLocale === 'en' && !isDev) {
      return NextResponse.redirect(new URL(pathname, `https://${DOMAIN_EN}`));
    }
    if (pathnameIsMissingLocale) {
      const res = NextResponse.rewrite(new URL(`/tr${pathname}`, request.url));
      return isJilinrime ? applyJilinrimeHeaders(res, jilinrimeAuthMode) : res;
    }
  }

  const res = NextResponse.next();
  return isJilinrime ? applyJilinrimeHeaders(res, jilinrimeAuthMode) : res;
}

// Staging is opt-in, requires mandatory Supabase MFA auth, and stays noindex + private.
export async function middleware(request: NextRequest) {
  const staging = process.env.APP_ENVIRONMENT === 'staging';
  if (staging) {
    let mode: 'basic' | 'supabase';
    try {
      mode = authMode(process.env);
    } catch {
      return new NextResponse('Staging configuration unavailable', {
        status: 503,
        headers: privateSecurityHeaders(),
      });
    }
    if (mode !== 'supabase') {
      return new NextResponse('Staging configuration unavailable', {
        status: 503,
        headers: privateSecurityHeaders(),
      });
    }

    const pathname = request.nextUrl.pathname;
    const isLoginPage =
      request.method === 'GET' && /^\/(?:tr\/|en\/|el\/)?gastronomi-yonetimi\/?$/.test(pathname);
    const isLoginApi =
      (request.method === 'POST' && pathname === '/api/gastronomy-admin/login') ||
      (request.method === 'GET' && pathname === '/api/gastronomy-admin/session') ||
      (request.method === 'POST' && pathname === '/api/gastronomy-admin/logout');
    const isLoginAsset = request.method === 'GET' && /^(?:\/_next\/|\/fonts\/)/.test(pathname);

    if (!isLoginPage && !isLoginApi && !isLoginAsset) {
      const check = await verifyCloudAdminCookie(request.cookies.get('ya_cloud_admin')?.value);
      if (!check.ok) {
        return new NextResponse(
          check.status === 503 ? 'Staging configuration unavailable' : 'Auth Required',
          {
            status: check.status,
            headers: privateSecurityHeaders(),
          }
        );
      }
    }
  }

  const api = request.nextUrl.pathname === '/api' || request.nextUrl.pathname.startsWith('/api/');
  const response = api ? NextResponse.next() : await applicationMiddleware(request);
  if (staging) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('Vary', 'Cookie, Authorization');
  }
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
