import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const defaultLocale = 'tr';
const locales = ['tr', 'en', 'el'];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // 1. CRITICAL: Skip all internal Next.js paths and static files
    // This prevents the "white screen" / MIME type error
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') || // Files with extensions (images, css, js)
        pathname === '/favicon.ico' ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        return NextResponse.next();
    }

    // 2. Check if the pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // 3. If no locale, rewrite to default locale (tr)
    // This handles localhost:3000/ -> localhost:3000/tr/
    // And localhost:3000/search -> localhost:3000/tr/search
    if (!pathnameHasLocale) {
        return NextResponse.rewrite(
            new URL(`/${defaultLocale}${pathname}`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    // Matcher to filter what the middleware runs on
    // Negative lookahead to ignore internal paths
    matcher: ['/((?!_next|api|static|favicon.ico|robots.txt).*)'],
};
