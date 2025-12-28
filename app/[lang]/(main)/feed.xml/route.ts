import { db } from '@/lib/db';
import { getLocalizedText } from '@/lib/localization';

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gnkhotels.com';
    const articles = await db.articles.getAll();

    const rssItems = articles
      .map((article: any) => {
        const title = getLocalizedText(article.title);
        const description = getLocalizedText(article.summary) || getLocalizedText(article.content)?.slice(0, 200);
        const link = `${siteUrl}/rehber/${article.slug}`;
        const pubDate = article.published_at
          ? new Date(article.published_at).toUTCString()
          : new Date(article.created_at).toUTCString();
        const location = getLocalizedText(article.location);

        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${location ? `<category><![CDATA[${location}]]></category>` : ''}
      ${article.cover_image ? `<enclosure url="${article.cover_image}" type="image/jpeg" />` : ''}
    </item>`;
      })
      .join('');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>GNK Gezi Rehberi</title>
    <link>${siteUrl}</link>
    <description>Türkiye'nin en seçkin butik otel kürasyon platformu - Gezi rehberi ve otel önerileri</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>GNK Hotels RSS Generator</generator>
    <image>
      <url>${siteUrl}/icon-512.png</url>
      <title>GNK Gezi Rehberi</title>
      <link>${siteUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rssFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('RSS Feed Error:', error);

    // Return minimal valid RSS feed on error
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gnkhotels.com';
    const errorFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>GNK Gezi Rehberi</title>
    <link>${siteUrl}</link>
    <description>Türkiye'nin en seçkin butik otel kürasyon platformu</description>
    <language>tr</language>
  </channel>
</rss>`;

    return new Response(errorFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
      status: 200,
    });
  }
}
