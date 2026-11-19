import {isLocalFoodPreview} from '@/lib/food/localPreview';
import {getAllowedPublicSupabaseOrigin} from '@/lib/supabase-env-guard';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { ConsentManagedAnalytics } from '@/components/ConsentManagedAnalytics';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: false,
});

// 13: export const metadata: Metadata = {
// ...
// 70: };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#10b981",
};

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang as 'tr' | 'en' || 'tr';
  const siteName = lang === 'en' ? 'WorldandHotels' : 'Yerini Ayır';

  return {
    // DOMAIN LOGIC: metadataBase needs a valid URL.
    // We can set it to the primary domain since absoluteUrl handles the rest.
    metadataBase: new URL('https://www.yeriniayir.com'),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: "Doğrulanmış yerel gastronomi seçkileri ve Türkiye'nin seçkin konaklama rehberi",
    keywords: ['gastronomi rehberi', 'yerel restoranlar', 'nitelikli kahve', 'moda kadıköy rehberi', 'otel önerileri'],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    manifest: '/manifest.webmanifest',

    openGraph: {
      type: 'website',
      locale: lang === 'en' ? 'en_US' : 'tr_TR',
      siteName: siteName,
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
    },
    alternates: {
      types: {
        'application/rss+xml': [
          { url: '/feed.xml', title: `${siteName} Gezi Rehberi RSS Feed` },
        ],
      },
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
    },
  };
}

import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema-generator';


export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const localPreview = (await isLocalFoodPreview());
  const allowedSupabaseOrigin = localPreview
    ? null
    : getAllowedPublicSupabaseOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const orgSchema = generateOrganizationSchema(params.lang);
  const websiteSchema = generateWebSiteSchema(params.lang);

  // Dynamic Google Analytics ID
  // yeriniayir.com (TR) -> G-593PL85N6Q
  // worldandhotels.com (EN) -> G-XXXXXXXXXX (Placeholder - Replace with actual ID)
  const gaId = params.lang === 'en' ? 'G-E2Z6W3YXSM' : 'G-593PL85N6Q';

  return (
    <html lang={params.lang} className={localPreview?'gastronomy-font':inter.variable} style={{ backgroundColor: '#ffffff' }}>
      <head>{localPreview&&<link rel="preload" href="/fonts/Inter-TR-EN-04308d9ab394.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>}{!localPreview && <>
        {allowedSupabaseOrigin && <link rel="preconnect" href={allowedSupabaseOrigin} />}
        <link rel="preconnect" href="https://images.pexels.com" />
        {allowedSupabaseOrigin && <link rel="dns-prefetch" href={allowedSupabaseOrigin} />}
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </>}</head>
      <body className="font-sans" style={{ backgroundColor: '#ffffff' }}>
        <Providers disableTracking={localPreview}>
          {children}
        </Providers>
        <ConsentManagedAnalytics
          gaId={gaId}
          clarityId="ufxa278rg4"
          disabled={localPreview || process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === '1'}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  );
}