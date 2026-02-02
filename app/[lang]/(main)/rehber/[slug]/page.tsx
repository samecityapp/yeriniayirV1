import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { cn, calculateReadingTime } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getLocalizedText } from '@/lib/localization';
import { getDictionary } from '@/lib/dictionary';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema-generator';
import { QuickSummary } from '@/components/blog/QuickSummary';
import { RelatedHotels } from '@/components/blog/RelatedHotels';
import { RelatedArticles } from '@/components/RelatedArticles';
import { LOCATIONS } from '@/lib/constants';
import { ArticleList } from '@/components/ArticleList';
import { getRandomAuthor } from '@/lib/authors';
import { BlogAuthor } from '@/components/blog/BlogAuthor';
import { SmartContent } from '@/components/blog/SmartContent';


type Props = { params: { slug: string; lang: 'tr' | 'en' } };

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang || 'tr';
  const dict = await getDictionary(lang);
  const location = LOCATIONS.find(l => l.slug === params.slug);

  // If it's a location page
  if (location) {
    const locationDescription = dict.guide.locations[location.slug as keyof typeof dict.guide.locations] || location.description;
    const title = lang === 'tr'
      ? `${location.title} Gezi Rehberi - Gezilecek Yerler ve Öneriler`
      : `${location.title} Travel Guide - Places to Visit and Recommendations`;

    return {
      title: title,
      description: locationDescription,
      openGraph: {
        title: title,
        description: locationDescription,
        images: [location.image],
      },
      alternates: {
        canonical: `https://www.yeriniayir.com/${lang}/rehber/${params.slug}`,
        languages: {
          'tr': `https://www.yeriniayir.com/tr/rehber/${params.slug}`,
          'en': `https://www.yeriniayir.com/en/rehber/${params.slug}`,
        },
      }
    };
  }

  // If it's an article page
  const article = await db.articles.getBySlug(params.slug);
  if (!article) {
    return {
      title: 'Yazı Bulunamadı',
      description: 'Aradığınız rehber yazısı sistemimizde mevcut değil.',
    };
  }

  const title = getLocalizedText(article.title, lang);
  const description = getLocalizedText(article.meta_description, lang);
  const articleLocation = getLocalizedText(article.location, lang);

  // Determine slugs for both languages
  const slugTr = article.slug;
  const slugEn = (article as any).slug_en || article.slug; // Fallback if not set but DB should have it

  return {
    title: `${title}`,
    description: description,
    keywords: [title, articleLocation, 'rehber', 'gezi', 'otel', 'türkiye'],
    alternates: {
      canonical: lang === 'tr'
        ? `https://www.yeriniayir.com/tr/rehber/${slugTr}`
        : `https://www.yeriniayir.com/en/guide/${slugEn}`,
      languages: {
        'tr': `https://www.yeriniayir.com/tr/rehber/${slugTr}`,
        'en': `https://www.yeriniayir.com/en/guide/${slugEn}`,
      },
    },
    openGraph: {
      title: title,
      description: description,
      images: article.cover_image_url ? [article.cover_image_url] : [],
      type: 'article',
      publishedTime: article.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: article.cover_image_url ? [article.cover_image_url] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const lang = params.lang || 'tr';
  const dict = await getDictionary(lang);
  const locationConstant = LOCATIONS.find(l => l.slug === params.slug);

  // --- LOCATION DETAIL PAGE LOGIC ---
  if (locationConstant) {
    const articles = await db.articles.getAllByLocation(locationConstant.title);
    const locationDescription = dict.guide.locations[locationConstant.slug as keyof typeof dict.guide.locations] || locationConstant.description;

    return (
      <div className="min-h-screen bg-background">
        {/* Hero Header for Location */}
        <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
          <Image
            src={locationConstant.image}
            alt={locationConstant.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
              {locationConstant.title} {lang === 'tr' ? 'Rehberi' : 'Guide'}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow-md">
              {locationDescription}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href={`/${lang}/rehber`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {lang === 'tr' ? 'Tüm bölgelere dön' : 'Back to all regions'}
          </Link>

          <h2 className="text-2xl font-bold mb-8">{locationConstant.title} {lang === 'tr' ? 'Makaleleri' : 'Articles'}</h2>
          <ArticleList articles={articles} lang={lang} />
        </div>
      </div>
    );
  }

  // --- ARTICLE DETAIL PAGE LOGIC (Existing) ---
  const article = await db.articles.getBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.published_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yeriniayir.com';
  const author = getRandomAuthor(article.slug);
  // const supabase = createClient(); // using imported singleton

  const title = getLocalizedText(article.title, lang);
  const description = getLocalizedText(article.meta_description, lang);
  const slugTr = article.slug;
  const slugEn = (article as any).slug_en || article.slug;

  // Extract FAQs from content for Schema
  // Logic: Look for "Sıkça Sorulan Sorular" or "FAQ" H2/H3/H4
  // Then look for strong/bold questions and paragraphs following them, or H-tags and P-tags.
  // Simplest robust method for this specific format:
  // Usually Q: <p><strong>Question?</strong></p> or <h3>Question?</h3>
  // A: <p>Answer...</p>

  const content = getLocalizedText(article.content, lang);

  // Extract Image URLs from content to fetch metadata
  const imgUrlRegex = /<img[^>]+src="([^">]+)"/g;
  const imgUrls: string[] = [];
  let imgMatch;
  while ((imgMatch = imgUrlRegex.exec(content)) !== null) {
    if (imgMatch[1]) imgUrls.push(imgMatch[1]);
  }

  // Fetch metadata for these images if any
  let imageMetadata: Record<string, { alt_tr: string; alt_en: string }> | undefined;

  if (imgUrls.length > 0) {
    try {
      const { data: mediaData, error: mediaError } = await supabase
        .from('article_media')
        .select('url, alt_tr, alt_en')
        .in('url', imgUrls);

      if (!mediaError && mediaData && mediaData.length > 0) {
        imageMetadata = mediaData.reduce((acc, item) => {
          acc[item.url] = { alt_tr: item.alt_tr, alt_en: item.alt_en };
          return acc;
        }, {} as Record<string, { alt_tr: string; alt_en: string }>);
      }
    } catch (e) {
      console.warn('Failed to fetch image metadata:', e);
      // Continue without metadata
    }
  }

  const readingTime = calculateReadingTime(content);
  const faqs: { question: string; answer: string }[] = [];

  // Detection Strategy:
  // 1. Find the FAQ section header (approximate)
  // 2. Parse Q&A pairs.

  // Matches <h3>Question?</h3> <p>Answer</p> which is common in these articles.
  // Or <p><strong>Question?</strong></p> <p>Answer</p>

  // Let's try to find H3 tags that represent questions.
  // Regex to find <h3>...</h3> followed by <p>...</p>
  // Regex to find <h3>...</h3> followed by <p>...</p>
  const faqRegex = /<(h[34]|p><strong>)(.*?)<\/\1>(?:\s*<p>)?(.*?)(?:<\/p>)/gi;

  // We strictly only look for FAQs if the content mentions "Sıkça Sorulan" or "FAQ" to avoid false positives?
  // Or just parse everything that looks like a Q&A structure?
  // Let's rely on the structure being somewhat semantic if it exists.
  // However, global H3 -> P parsing might catch non-FAQs.
  // Best to only do this if we find a "FAQ" section header.

  const faqSectionRegex = /(?:Sıkça Sorulan Sorular|FAQ|Hakkında Merak Edilenler)/i;

  if (faqSectionRegex.test(content)) {
    // If we are in the FAQ area. 
    // Since split is hard with regex in TS without DOM, we'll use a simpler regex across the whole file
    // but acceptable for now.
    let match;
    // Reset lastIndex if using global regex object, but here we create new.
    const qnaRegex = /<(?:h3|strong)>(.*?)<\/(?:h3|strong)>\s*<p>(.*?)<\/p>/gi;

    while ((match = qnaRegex.exec(content)) !== null) {
      const q = match[1].replace(/<[^>]*>/g, '').trim();
      const a = match[2].replace(/<[^>]*>/g, '').trim();

      if (q.length > 5 && a.length > 10 && (q.includes('?') || q.includes('Mı') || q.includes('Mi'))) {
        faqs.push({ question: q, answer: a });
      }
    }
  }

  const articleSchema = generateArticleSchema({
    title,
    description,
    content: getLocalizedText(article.content, lang),
    slug: lang === 'tr' ? slugTr : slugEn,
    coverImage: article.cover_image_url || undefined,
    createdAt: article.published_at,
    updatedAt: article.updated_at,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    {
      name: lang === 'tr' ? 'Ana Sayfa' : 'Home',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yeriniayir.com'
    },
    {
      name: lang === 'tr' ? 'Rehber' : 'Guide',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang === 'tr' ? 'tr/rehber' : 'en/guide'}`
    },
    {
      name: title,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang === 'tr' ? 'tr/rehber' : 'en/guide'}/${lang === 'tr' ? slugTr : slugEn}`
    }
  ]);

  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href={`/${lang}/rehber`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-12 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {lang === 'tr' ? 'Tüm Rehberlere Dön' : 'Back to All Guides'}
          </Link>

          <article>
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  {getLocalizedText(article.location, lang)}
                </span>
                <span className="text-zinc-300">•</span>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Calendar className="w-3 h-3" />
                  <time dateTime={article.published_at}>{publishedDate}</time>
                </div>
                <span className="text-zinc-300">•</span>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Clock className="w-3 h-3" />
                  <span>{lang === 'tr' ? `${readingTime} DK OKUMA` : `${readingTime} MIN READ`}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-900 mb-8 leading-tight tracking-tight">
                {getLocalizedText(article.title, lang)}
              </h1>

              <p className="text-lg text-zinc-600 leading-relaxed">
                {getLocalizedText(article.meta_description, lang)}
              </p>
            </header>

            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-16">
              <Image
                src={article.cover_image_url || 'https://placehold.co/1200x675/e5e5e5/666666?text=Yerini+Ayir'}
                alt={getLocalizedText(article.title, lang)}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="max-w-3xl mx-auto">
              <QuickSummary items={[
                `${getLocalizedText(article.location, lang)} ${lang === 'tr' ? 'bölgesinde gezilecek en iyi yerler' : 'best places to visit'}`,
                lang === 'tr' ? 'Yerel restoran ve kafe önerileri' : 'Local restaurant and cafe recommendations',
                lang === 'tr' ? 'Konaklama seçenekleri ve fiyat aralıkları' : 'Accommodation options and price ranges',
                lang === 'tr' ? 'Ulaşım bilgileri ve ipuçları' : 'Transportation info and tips',
              ]} />

              <SmartContent content={getLocalizedText(article.content, lang)} lang={lang} imageMetadata={imageMetadata} />

              <BlogAuthor author={author} />
            </div>


            <div className="mt-20">
              <RelatedHotels location={getLocalizedText(article.location, lang)} />
            </div>

            <div className="mt-8">
              <RelatedArticles location={getLocalizedText(article.location, lang).split(',')[0].trim()} lang={lang} />
            </div>

            <div className="mt-12 pt-12 border-t border-zinc-200">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Bu rehber işinize yaradı mı?
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {getLocalizedText(article.location, lang)} bölgesindeki daha fazla gizli cenneti keşfetmek için diğer rehberlerimize göz atın.
                </p>
                <Link
                  href={`/${lang}/rehber`}
                  className="inline-flex items-center gap-2 bg-foreground hover:bg-zinc-800 text-background px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  Tüm Rehberleri Keşfet
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
