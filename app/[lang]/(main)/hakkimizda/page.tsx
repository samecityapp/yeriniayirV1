import React from 'react';
import type { Metadata } from 'next';
import { Instagram, Mail } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';
import { EN_SITE_ORIGIN, TR_SITE_ORIGIN } from '@/lib/gastronomy-v3/geoCatalog';
import { isHotelSurfaceEnabled } from '@/lib/hotelLaunchGate';

export async function generateMetadata(props: {
  params: Promise<{ lang: 'tr' | 'en' }>;
}): Promise<Metadata> {
  const params = await props.params;
  const isEn = params.lang === 'en';
  const trUrl = `${TR_SITE_ORIGIN}/hakkimizda`;
  const enUrl = `${EN_SITE_ORIGIN}/hakkimizda`;

  return {
    title: isEn ? 'About Us' : 'Hakkımızda',
    description: isEn
      ? 'About Yerini Ayır: an independent local gastronomy discovery guide operated by a natural person across Turkey.'
      : 'Yerini Ayır hakkında: gerçek kişi tarafından işletilen bağımsız yerel gastronomi keşif rehberi.',
    alternates: {
      canonical: isEn ? enUrl : trUrl,
      languages: {
        'tr-TR': trUrl,
        en: enUrl,
        'x-default': trUrl,
      },
    },
  };
}

export default async function AboutPage(props: { params: Promise<{ lang: 'tr' | 'en' }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang);
  const hotelSurfaceEnabled = isHotelSurfaceEnabled();

  return (
    <main className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">

        {/* Başlık */}
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-8 tracking-tight">
          {dict.about.subtitle}
        </h1>

        {/* Giriş Hikayesi */}
        <div className="prose prose-zinc prose-lg text-zinc-600 mb-12">
          <p>
            {dict.about.story}
          </p>
        </div>

        <hr className="border-zinc-100 my-12" />

        {/* Misyon & Vizyon */}
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-1 bg-black rounded-full"></span>
              {dict.about.what_is_yerini_ayir}
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              {dict.about.what_is_yerini_ayir_text}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-1 bg-black rounded-full"></span>
              {dict.about.our_goal}
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              {dict.about.our_goal_text}
            </p>
          </div>
        </div>

        <div className="mt-10 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
          <p className="text-zinc-800 font-medium text-center italic">
            {dict.about.quote}
          </p>
        </div>

        {/* İletişim / Sosyal Medya */}
        <div className="mt-16 text-center">
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">
            {dict.about.follow_us}
          </p>
          {hotelSurfaceEnabled ? (
            <div className="flex justify-center gap-4">
              <a
                href="https://www.instagram.com/geceligi.ne.kadar/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-all hover:scale-105"
              >
                <Instagram size={18} />
                @geceligi.ne.kadar
              </a>
              <a
                href="https://www.instagram.com/turkeyandhotels/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 border border-zinc-200 text-zinc-900 rounded-full font-medium hover:bg-zinc-50 transition-all hover:scale-105"
              >
                <Instagram size={18} />
                @turkeyandhotels
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <a
                href="mailto:info@yeriniayir.com"
                className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-colors"
              >
                <Mail size={18} />
                info@yeriniayir.com
              </a>
              <p className="text-xs text-zinc-500">
                {lang === 'en'
                  ? 'Operated by an individual natural person — Gastronomy Discovery Release'
                  : 'Gerçek kişi site işletmecisi tarafından yürütülen İlk Gastronomi Yayını'}
              </p>
            </div>
          )}
        </div>

      </article>
    </main>
  );
}
