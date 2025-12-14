import Link from 'next/link';
import { Mail, Instagram, Globe } from 'lucide-react';
import { db } from '@/lib/db';
import { getLocalizedText } from '@/lib/localization';
import { Article } from '@/lib/types';
import { BrandLogo } from './ui/BrandLogo';

export async function Footer() {
  // Hardcoded as requested: 2026
  // const currentYear = new Date().getFullYear(); 
  const latestArticles = await db.articles.getLatest(3);

  return (
    <footer className="bg-white text-gray-600 mt-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">

          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BrandLogo className="w-8 h-8" />
              <span className="text-2xl font-bold text-gray-900">Yerini Ayır</span>
            </div>
            <p className="text-sm text-gray-500">
              Kalabalıkların değil, &quot;bilenlerin&quot; tercih ettiği yerleri keşfet
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-blue-600 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm hover:text-blue-600 transition-colors">
                  Otel Ara
                </Link>
              </li>
              <li>
                <Link href="/rehber" className="text-sm hover:text-blue-600 transition-colors">
                  Gezi Rehberi
                </Link>
              </li>
              {/* Admin Panel removed as requested */}
            </ul>
          </div>

          {/* Latest Articles */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Son Yazılar</h3>
            <ul className="space-y-2">
              {latestArticles.length > 0 ? (
                latestArticles.map((article: Article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/rehber/${article.slug}`}
                      className="text-sm hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {getLocalizedText(article.title)}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-400">Henüz yazı yok</li>
              )}
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Popüler Lokasyonlar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search?location=Fethiye" className="text-sm hover:text-blue-600 transition-colors">
                  Fethiye Otelleri
                </Link>
              </li>
              <li>
                <Link href="/search?location=Antalya" className="text-sm hover:text-blue-600 transition-colors">
                  Antalya Otelleri
                </Link>
              </li>
              <li>
                <Link href="/search?location=Bodrum" className="text-sm hover:text-blue-600 transition-colors">
                  Bodrum Otelleri
                </Link>
              </li>
              <li>
                <Link href="/search?location=Marmaris" className="text-sm hover:text-blue-600 transition-colors">
                  Marmaris Otelleri
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-blue-600" />
                <a href="mailto:hello@yeriniayir.com" className="hover:text-blue-600 transition-colors">
                  hello@yeriniayir.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-3">
              <p className="text-sm text-gray-500">
                &copy; 2026 Yerini Ayır. Tüm Haklar saklıdır.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-500">
                <Link href="/kullanim-kosullari" className="hover:text-blue-600 transition-colors">
                  Kullanım Koşulları
                </Link>
                <Link href="/gizlilik-politikasi" className="hover:text-blue-600 transition-colors">
                  Gizlilik Politikası
                </Link>
                <Link href="/cerez-politikasi" className="hover:text-blue-600 transition-colors">
                  Çerez Politikası
                </Link>
                <Link href="/kvkk-aydinlatma-metni" className="hover:text-blue-600 transition-colors">
                  KVKK
                </Link>
                <Link href="/hakkimizda" className="hover:text-blue-600 transition-colors">
                  Hakkımızda
                </Link>
              </div>
            </div>

            {/* Social Media - Kept logic but updated styling for light theme */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com/gnkoteller"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://gnkoteller.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
