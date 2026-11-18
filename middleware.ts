import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { checkPilotAdmin, PILOT_PRIVATE_HEADERS, pilotAuthFailureHeaders } from '@/lib/pilot/adminAuth';

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

async function applicationMiddleware(request: NextRequest) {

    const pathname = request.nextUrl.pathname;
    const hostname = request.headers.get('host') || '';
    const ip = request.headers.get('x-real-ip') || '127.0.0.1';

    // Independent cloud endpoints authenticate inside each handler; no legacy Basic fallback.
    if(pathname.startsWith('/api/gastronomy-admin/')||pathname==='/api/gastronomy-public'||pathname.split('/').includes('gastronomi-yonetimi')){
        const response=NextResponse.next();
        if(pathname!=='/api/gastronomy-public'){
            response.headers.set('Cache-Control','private, no-store');
            response.headers.set('X-Robots-Tag','noindex, nofollow');
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
        const hasLocale = locales.some(locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
        const response = hasLocale
            ? NextResponse.next()
            : NextResponse.rewrite(new URL(`/${hostname === 'worldandhotels.com' || hostname === 'www.worldandhotels.com' ? 'en' : 'tr'}${pathname}`, request.url));
        for (const [name, value] of Object.entries(PILOT_PRIVATE_HEADERS)) response.headers.set(name, value);
        return response;
    }

    const applyJilinrimeHeaders = (response: NextResponse) => {
        response.headers.set('Cache-Control', 'private, no-store, max-age=0');
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        response.headers.set('Vary', process.env.GASTRONOMY_AUTH_MODE === 'supabase' ? 'Cookie' : 'Authorization');
        return response;
    };

    const isJilinrime = pathname.split('/').includes('jilinrime');
    if (isJilinrime) {
        if (process.env.GASTRONOMY_AUTH_MODE === 'supabase') {
            const adminCookie = request.cookies.get('ya_cloud_admin')?.value;
            if (!adminCookie) {
                return new NextResponse('Auth Required', {
                    status: 401,
                    headers: {
                        'Cache-Control': 'private, no-store, max-age=0',
                        'Vary': 'Cookie',
                        'X-Robots-Tag': 'noindex, nofollow',
                    },
                });
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

    // 1. CRITICAL: Skip all internal Next.js paths and static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico' ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        const res = NextResponse.next();
        return isJilinrime ? applyJilinrimeHeaders(res) : res;
    }

    // RATE LIMITING LOGIC (Skip for localhost to avoid dev friction)
    // OPTIMIZATION: Only limit API routes and Admin sections to prevent latency on normal page navigation
    try {
        if (process.env.NODE_ENV === 'production' && (pathname.startsWith('/api') || isJilinrime)) {
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
            const res = NextResponse.rewrite(
                new URL(`/en${pathname}`, request.url)
            );
            return isJilinrime ? applyJilinrimeHeaders(res) : res;
        }
    }

    // --- CASE B: YERINIAYIR.COM (Turkish Domain) ---
    else {
        if (urlLocale === 'en' && !isDev) {
            const newUrl = new URL(pathname, `https://${DOMAIN_EN}`);
            return NextResponse.redirect(newUrl);
        }

        if (pathnameIsMissingLocale) {
            const res = NextResponse.rewrite(
                new URL(`/tr${pathname}`, request.url)
            );
            return isJilinrime ? applyJilinrimeHeaders(res) : res;
        }
    }

    // 4. Fallback for other languages or mixed states
    const res = NextResponse.next();
    return isJilinrime ? applyJilinrimeHeaders(res) : res;


}

// Staging is opt-in and fails closed without its own ADMIN_PASSWORD.
export async function middleware(request:NextRequest){
 const staging=process.env.APP_ENVIRONMENT==='staging';
 if(staging){const auth=await checkPilotAdmin(request.headers.get('authorization'));if(!auth.ok)return new NextResponse(auth.status===503?'Staging configuration unavailable':'Auth Required',{status:auth.status,headers:{...pilotAuthFailureHeaders(auth.status),'X-Robots-Tag':'noindex, nofollow, noarchive'}});}
 const api=request.nextUrl.pathname==='/api'||request.nextUrl.pathname.startsWith('/api/');
 const response=api?NextResponse.next():await applicationMiddleware(request);
 if(staging){response.headers.set('X-Robots-Tag','noindex, nofollow, noarchive');response.headers.set('Cache-Control','private, no-store, max-age=0');response.headers.set('Vary','Authorization');}
 return response;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
