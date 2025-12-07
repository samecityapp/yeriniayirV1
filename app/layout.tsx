import type { Metadata } from 'next';
import { Inter, Quicksand } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Providers } from '@/components/Providers';
import { CookieBanner } from '@/components/ui/CookieBanner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gnkhotels.com'),
  title: {
    default: 'GNK Otel Rehberi',
    template: '%s | GNK Otel Rehberi',
  },
  description: "Erdem'in Seçtiği En İyi Oteller - Türkiye'nin en güvenilir otel rehberi",
  keywords: ['otel', 'tatil', 'konaklama', 'türkiye otelleri', 'otel rehberi', 'otel önerileri'],
  authors: [{ name: 'GNK Otel Rehberi' }],
  creator: 'GNK',
  publisher: 'GNK',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'GNK Otel Rehberi',
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
        { url: '/feed.xml', title: 'GNK Gezi Rehberi RSS Feed' },
      ],
    },
  },
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

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
});

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="tr" className={`${inter.variable} ${quicksand.variable}`}>
      <head>
        <link rel="preconnect" href="https://aknhkpevrlpsrfxzqtop.supabase.co" />
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://aknhkpevrlpsrfxzqtop.supabase.co" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body className="font-sans">
        <Providers>
          <Header />
          <main className="min-h-[100dvh]">{children}</main>
          <Footer />
          <CookieBanner />
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
      </body>
    </html>
  );
}