import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const defaultLocale = 'tr';
const locales = ['tr', 'en', 'el'];

// Initialize Redis and Ratelimit
// We use a sliding window of 20 requests per 10 seconds for general traffic
// and stricter limits for API routes could be applied if needed
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

export async function middleware(request: NextRequest) {

    const pathname = request.nextUrl.pathname;
    const hostname = request.headers.get('host') || '';
    const ip = request.ip || '127.0.0.1';

    // 1. CRITICAL: Skip all internal Next.js paths and static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico' ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        return NextResponse.next();
    }

    // RATE LIMITING LOGIC (Skip for localhost to avoid dev friction)
    try {
        if (process.env.NODE_ENV === 'production' && !pathname.startsWith('/api')) {
            // We limit page views here. API routes can have their own limits if needed.
            const { success, pending, limit, reset, remaining } = await ratelimit.limit(
                `ratelimit_middleware_${ip}`
            );

            // Return headers for visibility
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
        // Continue execution if Redis/RateLimit fails
    }

    // 5. ADMIN PROTECTION (Basic Auth) - MOVED UP
    // This must run before locale rewrites to ensure it catches the path
    if (pathname.includes('/jilinrime')) {
        const basicAuth = request.headers.get('authorization');

        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            if (user === 'admin' && pwd === (process.env.ADMIN_PASSWORD || 'Otel2024!')) {
                // Valid credentials, proceed
            } else {
                return new NextResponse('Auth Required', {
                    status: 401,
                    headers: {
                        'WWW-Authenticate': 'Basic realm="Secure Area"',
                    },
                });
            }
        } else {
            return new NextResponse('Auth Required', {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="Secure Area"',
                },
            });
        }
    }

    // 2. Domain-Based Routing Configuration
    const DOMAIN_TR = 'yeriniayir.com';
    const DOMAIN_EN = 'worldandhotels.com';

    // Development / Vercel Preview support
    const isDev = hostname.includes('localhost') || hostname.endsWith('.vercel.app');

    // Determine which domain we are on
    // Check for both bare domain and www subdomain
    const isTurkishDomain = hostname === DOMAIN_TR || hostname === `www.${DOMAIN_TR}` || (isDev && !request.cookies.get('NEXT_LOCALE')?.value);
    const isEnglishDomain = hostname === DOMAIN_EN || hostname === `www.${DOMAIN_EN}`;

    // 3. Locale Logic
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // ANALYZE CURRENT PATH LOCALE
    const urlLocale = locales.find(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // --- CASE A: WORLDANDHOTELS.COM (English Domain) ---
    if (isEnglishDomain) {
        if (urlLocale === 'tr') {
            const newUrl = new URL(pathname, `https://${DOMAIN_TR}`);
            return NextResponse.redirect(newUrl);
        }

        if (pathnameIsMissingLocale) {
            return NextResponse.rewrite(
                new URL(`/en${pathname}`, request.url)
            );
        }
    }

    // --- CASE B: YERINIAYIR.COM (Turkish Domain) ---
    else {
        if (urlLocale === 'en' && !isDev) {
            const newUrl = new URL(pathname, `https://${DOMAIN_EN}`);
            return NextResponse.redirect(newUrl);
        }

        if (pathnameIsMissingLocale) {
            return NextResponse.rewrite(
                new URL(`/tr${pathname}`, request.url)
            );
        }
    }

    // 4. Fallback for other languages or mixed states
    return NextResponse.next();


}

export const config = {
    // Matcher to filter what the middleware runs on
    // Negative lookahead to ignore internal paths
    matcher: ['/((?!_next|api|static|favicon.ico|robots.txt).*)'],
};
