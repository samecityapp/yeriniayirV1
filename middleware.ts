import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const defaultLocale = 'tr';
const locales = ['tr', 'en', 'el'];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const hostname = request.headers.get('host') || '';

    // 1. CRITICAL: Skip all internal Next.js paths and static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico' ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        return NextResponse.next();
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
    // note: for dev testing, we might need a way to simulate EN domain, usually we just test path behavior or use hosts file.

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
        // If user tries to access /tr/... on worldandhotels, redirect to yeriniayir.com/tr/...
        if (urlLocale === 'tr') {
            const newUrl = new URL(pathname, `https://${DOMAIN_TR}`);
            return NextResponse.redirect(newUrl);
        }

        // If no locale is present, rewrite to /en/ (Default for this domain)
        if (pathnameIsMissingLocale) {
            return NextResponse.rewrite(
                new URL(`/en${pathname}`, request.url)
            );
        }
    }

    // --- CASE B: YERINIAYIR.COM (Turkish Domain) ---
    else {
        // If user tries to access /en/... on yeriniayir, redirect to worldandhotels.com/en/... (or just worldandhotels.com/...)
        if (urlLocale === 'en' && !isDev) {
            // We redirect to the English domain. 
            // We can keep the /en prefix or strip it depending on preference.
            // But since worldandhotels defaults to EN, we can technically strip it OR keep it if we want explicit structure.
            // Let's keep /en for consistency if the app relies on [lang] param.
            // PROPOSAL: Redirect to worldandhotels.com/en/...
            const newUrl = new URL(pathname, `https://${DOMAIN_EN}`);
            return NextResponse.redirect(newUrl);
        }

        // If no locale is present, rewrite to /tr/ (Default for this domain)
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
