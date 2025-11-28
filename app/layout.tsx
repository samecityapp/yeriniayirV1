import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="font-sans">
        <Providers>
          <Header />
          <main className="min-h-[100dvh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}