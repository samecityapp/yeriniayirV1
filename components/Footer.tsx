import Link from 'next/link';
import { Hotel, Mail, Phone, MapPin, Instagram, Globe } from 'lucide-react';
import { db } from '@/lib/db';
import { getLocalizedText } from '@/lib/localization';

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const latestArticles = await db.articles.getLatest(3);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hotel className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">GNK Oteller</span>
            </div>
            <p className="text-sm text-gray-400">
              Erdem&apos;in seçtiği en iyi oteller ve tatil deneyimleri. Türkiye&apos;nin en güzel destinasyonlarını keşfedin.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-blue-400 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm hover:text-blue-400 transition-colors">
                  Otel Ara
                </Link>
              </li>
              <li>
                <Link href="/rehber" className="text-sm hover:text-blue-400 transition-colors">
                  Gezi Rehberi
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm hover:text-blue-400 transition-colors">
                  Admin Paneli
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Son Yazılar</h3>
            <ul className="space-y-2">
              {latestArticles.length > 0 ? (
                latestArticles.map((article: any) => (
                  <li key={article.slug}>
                    <Link
                      href={`/rehber/${article.slug}`}
                      className="text-sm hover:text-blue-400 transition-colors line-clamp-1"
                    >
                      {getLocalizedText(article.title)}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">Henüz yazı yok</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Popüler Lokasyonlar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search?location=Fethiye" className="text-sm hover:text-blue-400 transition-colors">
                  Fethiye Otelleri
                </Link>
              </li>
              <li>
                <Link href="/search?location=Antalya" className="text-sm hover:text-blue-400 transition-colors">
                  Antalya Otelleri
                </Link>
              </li>
              <li>
                <Link href="/search?location=Bodrum" className="text-sm hover:text-blue-400 transition-colors">
                  Bodrum Otelleri
                </Link>
              </li>
              <li>
                <Link href="/search?location=Marmaris" className="text-sm hover:text-blue-400 transition-colors">
                  Marmaris Otelleri
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Türkiye</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-blue-500" />
                <a href="mailto:info@gnkoteller.com" className="hover:text-blue-400 transition-colors">
                  info@gnkoteller.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-blue-500" />
                <a href="tel:+905001234567" className="hover:text-blue-400 transition-colors">
                  +90 500 123 45 67
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} GNK Oteller. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
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
