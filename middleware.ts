import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cloudClient } from '@/lib/cloud/client';
import { cloudConfig } from '@/lib/cloud/config';
import { checkPilotAdmin, PILOT_PRIVATE_HEADERS, pilotAuthFailureHeaders } from '@/lib/pilot/adminAuth';
import {
  enforceEdgeMemoryShield,
  enforceRateLimit,
  type RateLimitResult,
  type RateLimitTier,
} from '@/lib/pilot/rateLimit';
import { authMode, hasValidCloudAdminJwtClaims } from '@/lib/pilot/securityPolicy';

const locales = ['tr', 'en', 'el'];
const MAX_URL_LENGTH = 2048;
const REGION_API_ROUTE_RE = /^\/api\/gastronomy\/regions\/[^/]+$/;

interface ApiRouteRule {
  methods: readonly string[];
  tier: RateLimitTier;
  mode: 'edge-shield' | 'upstash';
  isAdmin: boolean;
}

const API_ROUTE_RULES: Record<string, ApiRouteRule> = {
  '/api/track-event': {
    methods: ['POST'],
    tier: 'visitor_analytics',
    mode: 'edge-shield',
    isAdmin: false,
  },
  '/api/go': {
    methods: ['GET', 'HEAD'],
    tier: 'visitor_redirect',
    mode: 'edge-shield',
    isAdmin: false,
  },
  '/api/gastronomy-public': {
    methods: ['GET', 'HEAD'],
    tier: 'visitor_public',
    mode: 'edge-shield',
    isAdmin: false,
  },
  '/api/gastronomy-admin/login': {
    methods: ['POST'],
    tier: 'admin_auth',
    mode: 'upstash',
    isAdmin: true,
  },
  '/api/gastronomy-admin/logout': {
    methods: ['POST'],
    tier: 'admin_read',
    mode: 'upstash',
    isAdmin: true,
  },
  '/api/gastronomy-admin/publish': {
    methods: ['POST'],
    tier: 'costly_admin',
    mode: 'upstash',
    isAdmin: true,
  },
  '/api/gastronomy-admin/session': {
    methods: ['GET', 'HEAD'],
    tier: 'admin_read',
    mode: 'upstash',
    isAdmin: true,
  },
  '/api/gastronomy-admin/workspace': {
    methods: ['GET', 'HEAD'],
    tier: 'admin_read',
    mode: 'upstash',
    isAdmin: true,
  },
  '/api/gastronomy-admin/jobs': {
    methods: ['GET', 'HEAD'],
    tier: 'admin_read',
    mode: 'upstash',
    isAdmin: true,
  },
  '/api/gastronomy-admin/research': {
    methods: ['GET', 'HEAD'],
    tier: 'costly_admin',
    mode: 'upstash',
    isAdmin: true,
  },
};

type NormalizedPathResult =
  | {
      ok: true;
      canonical: string;
      segments: string[];
      hadPercent: boolean;
      hadDoubleSlash: boolean;
    }
  | { ok: false };

function normalizeRequestPathname(rawPathname: string): NormalizedPathResult {
  if (rawPathname.includes('\0') || rawPathname.includes('\\')) {
    return { ok: false };
  }

  let decoded = rawPathname;
  for (let i = 0; i < 2; i++) {
    if (!decoded.includes('%')) break;
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      return { ok: false };
    }
  }

  if (decoded.includes('%') || decoded.includes('\0') || decoded.includes('\\')) {
    return { ok: false };
  }

  const rawParts = decoded.split('/');
  if (rawParts.some((seg) => seg === '.' || seg === '..')) {
    return { ok: false };
  }

  const segments = rawParts.filter(Boolean);
  const canonical = segments.length > 0 ? `/${segments.join('/')}` : '/';
  return {
    ok: true,
    canonical,
    segments,
    hadPercent: rawPathname.includes('%'),
    hadDoubleSlash: rawPathname.includes('//'),
  };
}

function privateSecurityHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    'Cache-Control': 'private, no-store, max-age=0',
    Vary: 'Cookie, Authorization',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    ...extra,
  };
}

function attachRateLimitHeaders(response: NextResponse, rl: RateLimitResult): NextResponse {
  for (const [k, v] of Object.entries(rl.headers)) {
    response.headers.set(k, v);
  }
  return response;
}

function rateLimitDeniedResponse(rl: RateLimitResult, asJson: boolean): NextResponse {
  const headers = privateSecurityHeaders(rl.headers);
  if (asJson) {
    return NextResponse.json(
      { error: rl.status === 503 ? 'Rate limiter unavailable' : 'Too Many Requests' },
      { status: rl.status, headers }
    );
  }
  return new NextResponse(
    rl.status === 503 ? 'Service Unavailable' : 'Too Many Requests',
    { status: rl.status, headers }
  );
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

function hasProtectedSegment(pathname: string, segmentName: string): boolean {
  const target = segmentName.toLowerCase();
  return pathname
    .split('/')
    .filter(Boolean)
    .some((seg) => {
      const lower = seg.toLowerCase();
      return lower === target || lower.startsWith(`${target}.`);
    });
}

function hasSegmentAnomaly(norm: Extract<NormalizedPathResult, { ok: true }>, segmentLower: string): boolean {
  if (norm.hadPercent || norm.hadDoubleSlash) return true;
  return norm.segments.some((seg) => {
    const lower = seg.toLowerCase();
    return (lower === segmentLower || lower.startsWith(`${segmentLower}.`)) && seg !== lower;
  });
}

function hasApiAnomaly(norm: Extract<NormalizedPathResult, { ok: true }>): boolean {
  if (norm.hadPercent || norm.hadDoubleSlash) return true;
  const first = norm.segments[0];
  return Boolean(first && first.toLowerCase() === 'api' && first !== 'api');
}

async function handleApiMiddleware(
  request: NextRequest,
  norm: Extract<NormalizedPathResult, { ok: true }>
): Promise<NextResponse> {
  if (hasApiAnomaly(norm)) {
    return NextResponse.json(
      { error: 'Bad Request' },
      { status: 400, headers: privateSecurityHeaders() }
    );
  }

  const canonical = norm.canonical;
  const method = request.method.toUpperCase();

  if (REGION_API_ROUTE_RE.test(canonical)) {
    if (method !== 'GET' && method !== 'HEAD') {
      return NextResponse.json(
        { error: 'Method Not Allowed' },
        { status: 405, headers: privateSecurityHeaders({ Allow: 'GET, HEAD' }) }
      );
    }
    return NextResponse.next();
  }

  const rule = API_ROUTE_RULES[canonical];
  if (!rule) {
    return NextResponse.json(
      { error: 'Not Found' },
      { status: 404, headers: privateSecurityHeaders() }
    );
  }

  if (!rule.methods.includes(method)) {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      {
        status: 405,
        headers: privateSecurityHeaders({ Allow: rule.methods.join(', ') }),
      }
    );
  }

  const rl =
    rule.mode === 'edge-shield'
      ? await enforceEdgeMemoryShield(request.headers, rule.tier, { scope: 'mw' })
      : await enforceRateLimit(request.headers, rule.tier, { scope: 'mw' });

  if (!rl.ok) {
    return rateLimitDeniedResponse(rl, true);
  }

  const response = NextResponse.next();
  if (rule.isAdmin) {
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('Vary', 'Cookie');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return attachRateLimitHeaders(response, rl);
}

async function applicationMiddleware(
  request: NextRequest,
  norm: Extract<NormalizedPathResult, { ok: true }>
) {
  const pathname = norm.canonical;
  const hostname = request.headers.get('host') || '';

  if (hasProtectedSegment(pathname, 'gastronomi-yonetimi')) {
    if (hasSegmentAnomaly(norm, 'gastronomi-yonetimi')) {
      return new NextResponse('Bad Request', {
        status: 400,
        headers: privateSecurityHeaders(),
      });
    }
    const rl = await enforceRateLimit(request.headers, 'admin_read', { scope: 'mw' });
    if (!rl.ok) {
      return rateLimitDeniedResponse(rl, false);
    }
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('Vary', 'Cookie');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return attachRateLimitHeaders(response, rl);
  }

  // Protect all locales, the locale-free alias and child routes before static-file skips.
  // Route handlers also authenticate independently of middleware.
  const isPilot = hasProtectedSegment(pathname, 'moda-kadikoy-pilot');
  if (isPilot) {
    const isMutatingOrCostly =
      (request.method !== 'GET' && request.method !== 'HEAD') ||
      norm.segments.some((s) =>
        ['research', 'manage', 'auditor', 'decision'].includes(s.toLowerCase())
      );
    const rl = await enforceRateLimit(
      request.headers,
      isMutatingOrCostly ? 'costly_admin' : 'admin_panel',
      { scope: 'mw' }
    );
    if (!rl.ok) {
      return rateLimitDeniedResponse(rl, false);
    }

    const auth = await checkPilotAdmin(request.headers.get('authorization'));
    if (!auth.ok) {
      return new NextResponse(auth.status === 503 ? 'Admin configuration unavailable' : 'Auth Required', {
        status: auth.status,
        headers: pilotAuthFailureHeaders(auth.status),
      });
    }

    if (hasSegmentAnomaly(norm, 'moda-kadikoy-pilot')) {
      return new NextResponse('Bad Request', {
        status: 400,
        headers: privateSecurityHeaders(),
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
    return attachRateLimitHeaders(response, rl);
  }

  const applyJilinrimeHeaders = (response: NextResponse, mode: 'basic' | 'supabase') => {
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Vary', mode === 'supabase' ? 'Cookie' : 'Authorization');
    return response;
  };

  let jilinrimeAuthMode: 'basic' | 'supabase' = 'basic';
  const isJilinrime = hasProtectedSegment(pathname, 'jilinrime');
  if (isJilinrime) {
    try {
      jilinrimeAuthMode = authMode(process.env);
    } catch {
      return new NextResponse('Admin configuration unavailable', {
        status: 503,
        headers: privateSecurityHeaders(),
      });
    }

    const isMutating = request.method !== 'GET' && request.method !== 'HEAD';
    const rl = await enforceRateLimit(
      request.headers,
      isMutating ? 'costly_admin' : 'admin_panel',
      { scope: 'mw' }
    );
    if (!rl.ok) {
      return rateLimitDeniedResponse(rl, false);
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

    if (hasSegmentAnomaly(norm, 'jilinrime')) {
      return new NextResponse('Bad Request', {
        status: 400,
        headers: privateSecurityHeaders(),
      });
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

  const DOMAIN_TR = 'yeriniayir.com';
  const DOMAIN_EN = 'worldandhotels.com';
  const isDev =
    hostname.includes('localhost') ||
    hostname.startsWith('127.0.0.1') ||
    hostname.endsWith('.vercel.app') ||
    process.env.APP_ENVIRONMENT === 'staging' ||
    process.env.VERCEL_ENV === 'preview';
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
      const res = NextResponse.rewrite(new URL(`/en${pathname === '/' ? '' : pathname}`, request.url));
      return isJilinrime ? applyJilinrimeHeaders(res, jilinrimeAuthMode) : res;
    }
  } else {
    if (urlLocale === 'en' && !isDev) {
      return NextResponse.redirect(new URL(pathname, `https://${DOMAIN_EN}`));
    }
    if (pathnameIsMissingLocale) {
      const res = NextResponse.rewrite(new URL(`/tr${pathname === '/' ? '' : pathname}`, request.url));
      return isJilinrime ? applyJilinrimeHeaders(res, jilinrimeAuthMode) : res;
    }
  }

  const res = NextResponse.next();
  return isJilinrime ? applyJilinrimeHeaders(res, jilinrimeAuthMode) : res;
}

// Staging is opt-in, requires mandatory Supabase MFA auth, and stays noindex + private.
export async function middleware(request: NextRequest) {
  if (request.url.length > MAX_URL_LENGTH) {
    return new NextResponse('URI Too Long', {
      status: 414,
      headers: privateSecurityHeaders(),
    });
  }

  const norm = normalizeRequestPathname(request.nextUrl.pathname);
  if (!norm.ok) {
    return new NextResponse('Bad Request', {
      status: 400,
      headers: privateSecurityHeaders(),
    });
  }

  const canonical = norm.canonical;
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

    const isCleanRaw = !norm.hadPercent && !norm.hadDoubleSlash;
    const isLoginPage =
      isCleanRaw &&
      request.method === 'GET' &&
      /^\/(?:tr\/|en\/|el\/)?gastronomi-yonetimi$/.test(canonical);
    const isLoginApi =
      isCleanRaw &&
      ((request.method === 'POST' && canonical === '/api/gastronomy-admin/login') ||
        (request.method === 'GET' && canonical === '/api/gastronomy-admin/session') ||
        (request.method === 'POST' && canonical === '/api/gastronomy-admin/logout'));
    const isLoginAsset =
      isCleanRaw && request.method === 'GET' && /^(?:\/_next\/static\/|\/fonts\/)/.test(canonical);

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

  const isApi = canonical === '/api' || canonical.startsWith('/api/');
  const response = isApi
    ? await handleApiMiddleware(request, norm)
    : await applicationMiddleware(request, norm);

  if (staging) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('Vary', 'Cookie, Authorization');
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static/|fonts/(?!.*(?:\\.\\.|%))[A-Za-z0-9._/-]+\\.(?:woff2|ttf|txt)$|images/(?!.*(?:\\.\\.|%))[A-Za-z0-9._/-]+\\.(?:svg|png|jpg|jpeg|webp|avif|gif)$|authors/(?!.*(?:\\.\\.|%))[A-Za-z0-9._/-]+\\.png$|restaurants/(?!.*(?:\\.\\.|%))[A-Za-z0-9._/-]+\\.png$|favicon\\.ico$|icon\\.png$|apple-icon\\.png$|icon-192\\.png$|icon-512\\.png$|logo\\.png$|logo-green\\.png$|logo\\.svg$|yeriniayir-logo\\.png$|manifest\\.webmanifest$|robots\\.txt$|sitemap\\.xml$).*)',
  ],
};
