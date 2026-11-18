import React from 'react';
import { Instagram } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';

export default async function AboutPage(props: { params: Promise<{ lang: 'tr' | 'en' }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang);

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

        {/* Sosyal Medya */}
        <div className="mt-16 text-center">
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">
            {dict.about.follow_us}
          </p>
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
        </div>

      </article>
    </main>
  );
}
