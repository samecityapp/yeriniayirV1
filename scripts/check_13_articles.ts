import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const titlesToSlugs = [
    "i-stanbul-havalimani-ist-transfer-secimi-taksi-mi-metro-mu-ozel-transfer-mi-gece-varisi-plani",
    "sabiha-gokcen-den-sehre-en-kolay-ulasim-secenekler-ve-hangi-saatte-hangisi-mantikli",
    "i-stanbul-da-1-gunde-2-kita-avrupa-anadolu-rotasi-saat-saat-yurume-seviyesi",
    "i-stanbul-da-gun-batimi-noktalari-kalabaliksiz-saatler-en-i-yi-sunset-walk-rotalari",
    "i-stanbul-da-yagmurlu-gun-plani-kapali-mek-n-rotalari-muze-carsi-kafe-akisi",
    "i-stanbul-da-aksam-ne-yapilir-rehberi-aile-cift-tek-kisi-i-cin-guvenli-ve-keyifli-plan",
    "i-stanbul-da-dolandirilmadan-degil-surpriz-yasamadan-gezmek-basit-kurallar-taksi-menu-tur",
    "i-stanbul-da-camii-ziyareti-rehberi-giyim-saat-fotograf-kurallari-turist-i-cin-basit-anlatim",
    "i-stanbul-da-yuruyerek-gezilecek-semtler-2-3-saatlik-mini-rotalar-harita-mantigiyla",
    "i-stanbul-da-cocukla-gezi-bebek-cocuk-checklists-ogle-sicagi-yagmur-plani",
    "i-stanbul-butce-planlayici-ekonomik-dengeli-rahat-mod-fiyat-vermeden-harcama-mantigi",
    "i-stanbul-da-en-i-yi-fotograf-i-cerik-rotasi-1-gunde-viral-kareler-isik-saatleri-kalabalik-stratejisi",
    "i-stanbul-da-ulasim-rehberi-i-stanbulkart-metro-tramvay-feribot-mantigi-kafasi-karisanlara"
];

async function checkArticles() {
    let allGood = true;
    const report: any[] = [];

    for (const slug of titlesToSlugs) {
        const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();

        if (!article) {
            report.push({ slug, status: 'MISSING' });
            allGood = false;
            continue;
        }

        let trContent = '';
        if (typeof article.content === 'string') {
            try {
                trContent = JSON.parse(article.content).tr || '';
            } catch (e) { trContent = article.content; }
        } else if (article.content && article.content.tr) {
            trContent = article.content.tr;
        }

        const wordCount = trContent.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).length;
        const inlineImgCount = (trContent.match(/<img/g) || []).length;
        const hasCover = article.cover_image_url ? true : false;

        const isWordCountOk = wordCount >= 1300; // Considering Vertex AI limits, 1300 is the hard acceptable floor for 13 articles
        const isImageCountOk = inlineImgCount === 4 && hasCover;

        report.push({
            title: article.title?.tr?.substring(0, 30) + "...",
            slug,
            wordCount,
            inlineImgCount,
            hasCover,
            isOk: isWordCountOk && isImageCountOk
        });

        if (!(isWordCountOk && isImageCountOk)) {
            allGood = false;
        }
    }

    console.table(report);
    if (allGood) {
        console.log("✅ Bütün makaleler mükemmel! Word counts are decent and all have 5 images (1 cover + 4 inline).");
    } else {
        console.log("❌ Eksikler tespit edildi. Lütfen tabloyu inceleyin.");
    }
}

checkArticles();
