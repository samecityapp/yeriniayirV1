import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['tr', 'en'];
const defaultLocale = 'tr';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // 1. Skip if it's a file, API, or internal next path
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico' ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        return;
    }

    // 2. Check if the pathname already has a locale
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // 3. Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // Check for cookie or header, or just use default
        // For now, let's JUST rewrite to avoid 404s if the folder structure is active
        // Rewrite / -> /tr/
        // Rewrite /search -> /tr/search
        return NextResponse.rewrite(
            new URL(`/${defaultLocale}${pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
    ],
};
