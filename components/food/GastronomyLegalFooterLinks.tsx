'use client';

import Link from 'next/link';
import { COOKIE_SETTINGS_HASH, OPEN_COOKIE_SETTINGS_EVENT } from '@/lib/cookieConsent';

export function GastronomyLegalFooterLinks({
  lang = 'tr',
  maxWidthClass = 'max-w-2xl',
}: {
  lang?: 'tr' | 'en';
  maxWidthClass?: string;
}) {
  const isEn = lang === 'en';
  const localePrefix = isEn ? '/en' : '/tr';

  return (
    <div
      className={`${maxWidthClass} mx-auto mt-3 pt-2.5 border-t border-[#F4EDE8] flex flex-wrap items-center justify-center sm:justify-between gap-x-4 gap-y-1.5 text-[11px] text-[#68554E]`}
    >
      <nav
        aria-label={isEn ? 'Legal and Platform Information' : 'Yasal Bilgilendirme'}
        className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3.5 gap-y-1"
      >
        <Link
          href={`${localePrefix}/kullanim-kosullari`}
          prefetch={false}
          className="hover:text-[#181210] underline-offset-2 hover:underline transition-colors"
        >
          {isEn ? 'Terms of Use' : 'Kullanım Koşulları'}
        </Link>
        <Link
          href={`${localePrefix}/gizlilik-politikasi`}
          prefetch={false}
          className="hover:text-[#181210] underline-offset-2 hover:underline transition-colors"
        >
          {isEn ? 'Privacy Policy' : 'Gizlilik Politikası'}
        </Link>
        <Link
          href={`${localePrefix}/cerez-politikasi`}
          prefetch={false}
          className="hover:text-[#181210] underline-offset-2 hover:underline transition-colors"
        >
          {isEn ? 'Cookie Policy' : 'Çerez Politikası'}
        </Link>
        <Link
          href={`${localePrefix}/kvkk-aydinlatma-metni`}
          prefetch={false}
          className="hover:text-[#181210] underline-offset-2 hover:underline transition-colors"
        >
          {isEn ? 'KVKK Disclosure' : 'KVKK Aydınlatma Metni'}
        </Link>
        <a
          href={COOKIE_SETTINGS_HASH}
          onClick={(e) => {
            if (typeof window !== 'undefined') {
              e.preventDefault();
              window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
            }
          }}
          className="hover:text-[#181210] underline-offset-2 hover:underline transition-colors"
        >
          {isEn ? 'Cookie Preferences' : 'Çerez Tercihleri'}
        </a>
        <Link
          href={`${localePrefix}/hakkimizda`}
          prefetch={false}
          className="hover:text-[#181210] underline-offset-2 hover:underline transition-colors"
        >
          {isEn ? 'About' : 'Hakkımızda'}
        </Link>
      </nav>
      <span className="text-[10px] text-[#8A756D]">
        {isEn
          ? 'Gastronomy Release · info@yeriniayir.com'
          : 'Gastronomi Rehberi · info@yeriniayir.com'}
      </span>
    </div>
  );
}
