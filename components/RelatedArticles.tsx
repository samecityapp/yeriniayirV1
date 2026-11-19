import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ChevronRight, Clock } from 'lucide-react';
import { getLocalizedText } from '@/lib/localization';
import { Article } from '@/lib/types';

export async function RelatedArticles({ location, lang = 'tr' }: { location: string; lang?: 'tr' | 'en' }) {
  const articles = await db.articles.getAllByLocation(location, lang);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="mt-12 bg-white rounded-2xl border border-border/50 overflow-hidden">
      <div className="p-6 border-b border-border/40 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-zinc-900" />
        <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">
          {lang === 'en' ? `Guides About ${location}` : `${location} Hakkında Rehberler`}
        </h3>
      </div>

      <div className="divide-y divide-border/40">
        {articles.map((article: Article) => (
          <Link
            key={article.id}
            href={`/${lang}/${lang === 'en' ? 'guide' : 'rehber'}/${(lang === 'en' && article.slug_en) ? article.slug_en : article.slug}`}
            className="group flex gap-4 p-5 hover:bg-zinc-50/80 transition-colors"
          >
            <div className="shrink-0 w-24 h-24 bg-zinc-200 rounded-lg overflow-hidden relative">
              {article.cover_image_url ? (
                <Image
                  src={article.cover_image_url}
                  alt={getLocalizedText(article.title, lang)}
                  fill
                  sizes="96px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300" />
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center min-w-0">
              <h4 className="text-base font-semibold text-zinc-900 leading-tight mb-1 group-hover:text-black line-clamp-2">
                {getLocalizedText(article.title, lang)}
              </h4>
              <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                {getLocalizedText(article.meta_description, lang)}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400 font-medium uppercase tracking-wider">
                <span>{lang === 'en' ? 'Guide' : 'Rehber'}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{lang === 'en' ? '8 min' : '8 dk'}</span>
                </div>
              </div>
            </div>

            <div className="self-center text-zinc-300 group-hover:text-zinc-900 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
