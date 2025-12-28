'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './ui/BrandLogo';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const lang = params.lang as 'tr' | 'en' || 'tr';

  // Basic dictionary for Header (since we can't async load it easily inside nav for now, or we can use a small static one here)
  const navLabels = {
    tr: { hotels: 'Oteller', guide: 'Rehber', about: 'Hakkımızda' },
    en: { hotels: 'Hotels', guide: 'Guide', about: 'About Us' },
  }[lang];

  const switchLanguage = (newLang: string) => {
    const segments = pathname.split('/');
    segments[1] = newLang; // segments[0] is empty string
    router.push(segments.join('/'));
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <BrandLogo className="h-10 w-auto aspect-[3.5/1]" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={`/${lang}/search`} className="text-gray-600 hover:text-primary transition font-medium">{navLabels.hotels}</Link>
            <Link href={`/${lang}/rehber`} className="text-gray-600 hover:text-primary transition font-medium">{navLabels.guide}</Link>
            <Link href={`/${lang}/hakkimizda`} className="text-gray-600 hover:text-primary transition font-medium">{navLabels.about}</Link>

            <div className="flex items-center gap-2 pl-4 border-l ml-4 h-6">
              <button
                onClick={() => switchLanguage('tr')}
                className={`text-xs font-bold ${lang === 'tr' ? 'text-primary' : 'text-gray-400'}`}
              >
                TR
              </button>
              <span className="text-gray-300 text-xs">|</span>
              <button
                onClick={() => switchLanguage('en')}
                className={`text-xs font-bold ${lang === 'en' ? 'text-primary' : 'text-gray-400'}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => switchLanguage(lang === 'tr' ? 'en' : 'tr')}
              className="p-2 text-gray-500 hover:text-primary"
            >
              <Globe size={20} />
            </button>
            <button
              className="p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menüyü aç/kapat"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 flex flex-col border-t pt-4 bg-white">
            <Link
              href={`/${lang}/search`}
              className="text-gray-600 hover:text-primary transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {navLabels.hotels}
            </Link>
            <Link
              href={`/${lang}/rehber`}
              className="text-gray-600 hover:text-primary transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {navLabels.guide}
            </Link>
            <Link
              href={`/${lang}/hakkimizda`}
              className="text-gray-600 hover:text-primary transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {navLabels.about}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}