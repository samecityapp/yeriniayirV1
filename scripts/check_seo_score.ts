import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const GEO_KEYWORDS = [
    'taksim', 'kadıköy', 'sultanahmet', 'beşiktaş', 'galata',
    'eminönü', 'karaköy', 'boğaz', 'bosphorus', 'üsküdar',
    'balat', 'istiklal', 'ortaköy', 'şişli', 'nişantaşı',
    'moda', 'kadikoy', 'besiktas', 'uskudar'
];

async function checkSeoScores() {
    console.log("Fetching exact 13 Istanbul articles to calculate SEO/Geo score...\n");
    const targetSlugs = [
        'i-stanbul-havalimani-ist-transfer-secimi-taksi-mi-metro-mu-ozel-transfer-mi-gece-varisi-plani',
        'sabiha-gokcen-den-sehre-en-kolay-ulasim-secenekler-ve-hangi-saatte-hangisi-mantikli',
        'i-stanbul-da-1-gunde-2-kita-avrupa-anadolu-rotasi-saat-saat-yurume-seviyesi',
        'i-stanbul-da-gun-batimi-noktalari-kalabaliksiz-saatler-en-i-yi-sunset-walk-rotalari',
        'i-stanbul-da-yagmurlu-gun-plani-kapali-mek-n-rotalari-muze-carsi-kafe-akisi',
        'i-stanbul-da-aksam-ne-yapilir-rehberi-aile-cift-tek-kisi-i-cin-guvenli-ve-keyifli-plan',
        'i-stanbul-da-dolandirilmadan-degil-surpriz-yasamadan-gezmek-basit-kurallar-taksi-menu-tur',
        'i-stanbul-da-camii-ziyareti-rehberi-giyim-saat-fotograf-kurallari-turist-i-cin-basit-anlatim',
        'i-stanbul-da-yuruyerek-gezilecek-semtler-2-3-saatlik-mini-rotalar-harita-mantigiyla',
        'i-stanbul-da-cocukla-gezi-bebek-cocuk-checklists-ogle-sicagi-yagmur-plani',
        'i-stanbul-butce-planlayici-ekonomik-dengeli-rahat-mod-fiyat-vermeden-harcama-mantigi',
        'i-stanbul-da-en-i-yi-fotograf-i-cerik-rotasi-1-gunde-viral-kareler-isik-saatleri-kalabalik-stratejisi',
        'i-stanbul-da-ulasim-rehberi-i-stanbulkart-metro-tramvay-feribot-mantigi-kafasi-karisanlara'
    ];

    const { data: finalArticles } = await supabase.from('articles').select('slug, content, cover_image_url').in('slug', targetSlugs);

    if (!finalArticles || finalArticles.length === 0) return console.log("No articles found.");

    let totalScoreAll = 0;
    const results = [];

    for (const article of finalArticles) {
        let trContent = '';
        if (typeof article.content === 'string') {
            try { trContent = JSON.parse(article.content).tr; } catch (e) { trContent = article.content; }
        } else { trContent = article.content?.tr || ''; }

        let score = 0;
        let scoreDetails: any = {};

        // 1. Word Count (Max 30)
        const pureText = trContent.replace(/<[^>]*>?/gm, ' ');
        const wordCount = pureText.trim().split(/\s+/).length;
        let wordScore = 0;
        if (wordCount >= 1500) wordScore = 30;
        else if (wordCount >= 1200) wordScore = 20;
        else if (wordCount >= 900) wordScore = 15;
        score += wordScore;
        scoreDetails['WordCount'] = `${wordScore}/30 (${wordCount} words)`;

        // 2. Headings (Max 15)
        let headingScore = 0;
        if (trContent.includes('<h2')) headingScore += 10;
        if (trContent.includes('<h3')) headingScore += 5;
        score += headingScore;
        scoreDetails['Headings'] = `${headingScore}/15`;

        // 3. Media (Max 15) -> 1 cover (5 pts) + exactly 4 inline (10 pts)
        let mediaScore = 0;
        if (article.cover_image_url && article.cover_image_url.length > 5) mediaScore += 5;
        const inlineImgCount = (trContent.match(/<img/g) || []).length;
        if (inlineImgCount >= 4) mediaScore += 10;
        else if (inlineImgCount > 0) mediaScore += 5;
        score += mediaScore;
        scoreDetails['Media'] = `${mediaScore}/15 (Cover: ${!!article.cover_image_url}, Inline: ${inlineImgCount})`;

        // 4. Geo-Targeting (Max 20)
        let geoScore = 0;
        const lowerText = pureText.toLowerCase();
        let geoMentions = 0;
        for (const kw of GEO_KEYWORDS) {
            // Count occurrences of kw
            const matches = lowerText.match(new RegExp(kw, 'g'));
            if (matches) geoMentions += matches.length;
        }
        if (geoMentions >= 5) geoScore = 20;
        else if (geoMentions >= 2) geoScore = 10;
        else if (geoMentions === 1) geoScore = 5;
        score += geoScore;
        scoreDetails['Geo'] = `${geoScore}/20 (${geoMentions} mentions)`;

        // 5. FAQ Presence (Max 10)
        let faqScore = 0;
        if (lowerText.includes('sıkça sorulan sorular') || lowerText.includes('faq')) {
            faqScore = 10;
        }
        score += faqScore;
        scoreDetails['FAQ'] = `${faqScore}/10`;

        // 6. Formatting / Readability (Max 10)
        let formatScore = 0;
        if (trContent.includes('<p>')) formatScore += 5;
        else if (trContent.includes('<p ')) formatScore += 5;
        if (trContent.includes('<ul') || trContent.includes('<ol')) formatScore += 5;
        score += formatScore;
        scoreDetails['Format'] = `${formatScore}/10`;

        totalScoreAll += score;
        results.push({
            Slug: article.slug.substring(0, 30) + '...',
            Score: score,
            Details: scoreDetails
        });
    }

    console.table(results.map(r => ({
        ...r,
        Details: undefined,
        Word: r.Details.WordCount.split(' ')[0],
        H: r.Details.Headings,
        Img: r.Details.Media.split(' ')[0],
        Geo: r.Details.Geo.split(' ')[0],
        FAQ: r.Details.FAQ,
        Fmt: r.Details.Format
    })));

    const avg = totalScoreAll / finalArticles.length;
    console.log(`\n========================================`);
    console.log(`🎯 AVERAGE SEO & GEO SCORE: ${avg.toFixed(2)} / 100`);
    console.log(`========================================`);

    if (avg >= 85) {
        console.log("🌟 OUTSTANDING! These articles are perfectly optimized for Search Engines and Local Queries.");
    }
}

checkSeoScores();
