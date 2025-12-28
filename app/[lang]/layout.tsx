import type { Metadata } from 'next';
import { Inter, Quicksand } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yeriniayir.com'),
  title: {
    default: 'Yerini Ayır',
    template: '%s | Yerini Ayır',
  },
  description: "Erdem'in Seçtiği En İyi Oteller - Türkiye'nin en güvenilir otel rehberi",
  keywords: ['otel', 'tatil', 'konaklama', 'türkiye otelleri', 'otel rehberi', 'otel önerileri'],
  authors: [{ name: 'Yerini Ayır' }],
  creator: 'Yerini Ayır',
  publisher: 'Yerini Ayır',
  manifest: '/manifest.json',

  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Yerini Ayır',
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
        { url: '/feed.xml', title: 'Yerini Ayır Gezi Rehberi RSS Feed' },
      ],
    },
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  themeColor: "#10b981",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

import Script from 'next/script';

// ... existing imports

import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema-generator';

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
});

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang={params.lang} className={`${inter.variable} ${quicksand.variable}`}>
      <head>
        <link rel="preconnect" href="https://jerkkxwgddujigsbeqwo.supabase.co" />
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://jerkkxwgddujigsbeqwo.supabase.co" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body className="font-sans">
        <Providers>
          {children}
        </Providers>
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ufxa278rg4");
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-593PL85N6Q"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-593PL85N6Q');
          `}
        </Script>
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