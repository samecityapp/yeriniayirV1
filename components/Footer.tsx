import Link from 'next/link';
import { Mail, Instagram, Globe } from 'lucide-react';
import { db } from '@/lib/db';
import { getLocalizedText } from '@/lib/localization';
import { Article } from '@/lib/types';
import { BrandLogo } from './ui/BrandLogo';
import { getDictionary } from '@/lib/dictionary';

export async function Footer({ lang = 'tr' }: { lang?: 'tr' | 'en' }) {
  const currentYear = 2026;
  const latestArticles = await db.articles.getLatest(3);
  const dict = await getDictionary(lang);

  return (
    <footer className="bg-white text-gray-600 mt-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BrandLogo className="h-8 w-auto aspect-[3.5/1]" />
            </div>
            <p className="text-sm text-gray-500">
              {lang === 'tr'
                ? 'Kalabalıkların değil, "bilenlerin" tercih ettiği yerleri keşfet'
                : 'Discover the places chosen by those "in the know", not the crowds'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">{dict.navigation.explore}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${lang}`} className="text-sm hover:text-blue-600 transition-colors">
                  {dict.navigation.home}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/search`} className="text-sm hover:text-blue-600 transition-colors">
                  {dict.navigation.search}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/rehber`} className="text-sm hover:text-blue-600 transition-colors">
                  {dict.navigation.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Latest Articles */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">{dict.home.latest_articles}</h3>
            <ul className="space-y-2">
              {latestArticles.length > 0 ? (
                latestArticles.map((article: Article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/${lang}/rehber/${article.slug}`}
                      className="text-sm hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {getLocalizedText(article.title, lang)}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-400">
                  {lang === 'tr' ? 'Henüz yazı yok' : 'No articles yet'}
                </li>
              )}
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">{dict.home.popular_locations}</h3>
            <ul className="space-y-2">
              {['Fethiye', 'Antalya', 'Bodrum', 'Marmaris'].map((loc) => (
                <li key={loc}>
                  <Link href={`/${lang}/search?location=${loc}`} className="text-sm hover:text-blue-600 transition-colors">
                    {loc} {lang === 'tr' ? 'Otelleri' : 'Hotels'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-3">
              <p className="text-sm text-gray-500">
                &copy; {currentYear} Yerini Ayır. {dict.footer.rights}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-500">
                <Link href={`/${lang}/kullanim-kosullari`} className="hover:text-blue-600 transition-colors">
                  {dict.footer.terms}
                </Link>
                <Link href={`/${lang}/gizlilik-politikasi`} className="hover:text-blue-600 transition-colors">
                  {dict.footer.privacy}
                </Link>
                <Link href={`/${lang}/cerez-politikasi`} className="hover:text-blue-600 transition-colors">
                  {dict.footer.cookie}
                </Link>
                <Link href={`/${lang}/kvkk-aydinlatma-metni`} className="hover:text-blue-600 transition-colors">
                  {dict.footer.kvkk}
                </Link>
                <Link href={`/${lang}/hakkimizda`} className="hover:text-blue-600 transition-colors">
                  {dict.navigation.about}
                </Link>
              </div>
            </div>

            {/* Social Media */}
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
