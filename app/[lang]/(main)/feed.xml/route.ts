import { fallbackArticles } from '@/data/fallbackArticles';
import { mockArticles } from '@/data/mockArticles';
import { db } from '@/lib/db';
import { EN_SITE_ORIGIN, TR_SITE_ORIGIN } from '@/lib/gastronomy-v3/geoCatalog';
import { isHotelSurfaceEnabled } from '@/lib/hotelLaunchGate';
import { doesArticleSupportLang, getLocalizedText } from '@/lib/localization';
import { isSupabaseIsolated } from '@/lib/supabase';

export const revalidate = 3600;

function escapeCdata(value: string): string {
  return (value || '').replace(/\]\]>/g, ']]]]><![CDATA[>');
}

function escapeXmlAttr(value: string): string {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function resolveSiteUrl(lang: 'tr' | 'en'): string {
  if (lang === 'en') return EN_SITE_ORIGIN;
  const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
  return envUrl || TR_SITE_ORIGIN;
}

function getLocalFallbackArticles(lang: 'tr' | 'en') {
  return [...fallbackArticles, ...mockArticles].filter((article: any) =>
    doesArticleSupportLang(article, lang)
  );
}

function renderRssXml(articles: any[], lang: 'tr' | 'en', siteUrl: string): string {
  const hotelEnabled = isHotelSurfaceEnabled();
  const pathPrefix = lang === 'en' ? 'guide' : 'rehber';
  const channelTitle =
    lang === 'en'
      ? hotelEnabled
        ? 'World And Hotels Travel Guide'
        : 'Yerini Ayır Gastronomy &amp; Travel Guide'
      : 'Yerini Ayır Gastronomi ve Şehir Rehberi';
  const channelDescription = hotelEnabled
    ? lang === 'en'
      ? 'Verified neighborhood gastronomy picks, boutique stays, and city guides across Turkey.'
      : 'Türkiye şehirleri ve kıyı rotaları için doğrulanmış gezi rehberi, konaklama ve yerel lezzet durakları.'
    : lang === 'en'
      ? 'Verified neighborhood gastronomy picks, independent restaurants, and city culinary guides across Turkey.'
      : 'Türkiye genelinde 21 il ve 92 bölge için doğrulanmış yerel gastronomi seçkileri ve şehir lezzet rehberi.';

  const rssItems = articles
    .map((article: any) => {
      const title = getLocalizedText(article.title, lang);
      const description =
        getLocalizedText(article.meta_description, lang) ||
        getLocalizedText(article.summary, lang) ||
        getLocalizedText(article.content, lang)?.slice(0, 200) ||
        '';
      const slug = (lang === 'en' && article.slug_en ? article.slug_en : article.slug) || '';
      const link = encodeURI(`${siteUrl}/${pathPrefix}/${slug}`);
      const pubDate = article.published_at
        ? new Date(article.published_at).toUTCString()
        : article.created_at
          ? new Date(article.created_at).toUTCString()
          : new Date().toUTCString();
      const location = getLocalizedText(article.location, lang);
      const rawImage = article.cover_image_url || article.cover_image || '';
      const imageUrl =
        typeof rawImage === 'string' && rawImage.startsWith('/')
          ? `${siteUrl}${rawImage}`
          : rawImage;

      return `
    <item>
      <title><![CDATA[${escapeCdata(title)}]]></title>
      <description><![CDATA[${escapeCdata(description)}]]></description>
      <link>${escapeXmlAttr(link)}</link>
      <guid isPermaLink="true">${escapeXmlAttr(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      ${location ? `<category><![CDATA[${escapeCdata(location)}]]></category>` : ''}
      ${imageUrl ? `<enclosure url="${escapeXmlAttr(encodeURI(imageUrl))}" type="image/jpeg" />` : ''}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${channelTitle}</title>
    <link>${siteUrl}</link>
    <description>${channelDescription}</description>
    <language>${lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Yerini Ayır RSS Generator</generator>
    <image>
      <url>${siteUrl}/icon-512.png</url>
      <title>${channelTitle}</title>
      <link>${siteUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ lang: string }> }
) {
  const resolvedParams = await context.params;
  const lang: 'tr' | 'en' = resolvedParams?.lang === 'en' ? 'en' : 'tr';
  const siteUrl = resolveSiteUrl(lang);

  let articles: any[];
  if (isSupabaseIsolated) {
    articles = getLocalFallbackArticles(lang);
  } else {
    try {
      articles = await db.articles.getAll(lang);
    } catch (error) {
      console.error('RSS Feed DB fallback:', error);
      articles = getLocalFallbackArticles(lang);
    }
  }

  return new Response(renderRssXml(articles, lang, siteUrl), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
    status: 200,
  });
}
