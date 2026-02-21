import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const slugs = [
    'fethiyede-nerede-kalinir-bolge-secim-rehberi',
    'fethiye-ilk-kez-gidenler-icin-3-5-7-gunluk-hazir-rota',
    'fethiyede-aracsiz-arabasiz-tatil-plani-dolmus-taksi-yuruyus',
    'oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi',
    'kelebekler-vadisi-rehberi-fethiye-ulasim',
    'fethiye-tekne-turu-secme-rehberi',
    'fethiyede-en-iyi-gun-batimi-noktalari-sunset',
    'saklikent-kanyonu-gezi-rehberi-fethiye-selale',
    'tlos-antik-kenti-yakapark-gizlikent-fethiye-selale-rotasi',
    'likya-yolu-fethiye-baslangic-parkurlari-rota',
    'fethiyede-en-iyi-plaj-ve-koy-secimi',
    'fethiyeye-ne-zaman-gidilir-hava-durumu',
    'fethiyede-cocukla-tatil-kisabir-rehber',
    'fethiye-butce-planlayici',
    'fethiye-icerik-fotograf-rotasi-instagram'
];

async function analyze() {
    let stats = {
        totalH2: 0,
        totalH3: 0,
        totalLists: 0,
        totalInternalLinks: 0,
        totalImagesUrl: 0,
        totalImagesAlt: 0,
        totalBoldText: 0
    };

    console.log("Analyzing 15 articles for SEO/GEO metrics...\n");

    for (const slug of slugs) {
        const { data, error } = await supabase.from('articles').select('title, content').eq('slug', slug).single();
        if (error || !data) continue;

        const contentObj = data.content;
        let contentHtml = '';
        if (typeof contentObj === 'object' && contentObj?.tr) contentHtml = contentObj.tr;
        else if (typeof contentObj === 'string') contentHtml = contentObj;

        // Headings
        const h2Count = (contentHtml.match(/<h2/g) || []).length;
        const h3Count = (contentHtml.match(/<h3/g) || []).length;

        // Structure (GEO loves lists)
        const listCount = (contentHtml.match(/<ul|<ol/g) || []).length;

        // Emphasized entities (GEO)
        const boldCount = (contentHtml.match(/<strong|<b[^>]/g) || []).length;

        // Links
        const linkMatches = contentHtml.match(/<a href=[\\"']+([^\\"']+)[\\"']+/g) || [];
        const internalLinks = linkMatches.filter(l => l.includes('yeriniayir') || l.includes('href=\\"/') || l.includes('href="/')).length;

        // Images and Alt tags
        const imgTags = contentHtml.match(/<img[^>]*>/g) || [];
        let altCount = 0;
        imgTags.forEach(img => {
            if (img.includes('alt="') && !img.includes('alt=""')) altCount++;
        });

        stats.totalH2 += h2Count;
        stats.totalH3 += h3Count;
        stats.totalLists += listCount;
        stats.totalInternalLinks += internalLinks;
        stats.totalImagesUrl += imgTags.length;
        stats.totalImagesAlt += altCount;
        stats.totalBoldText += boldCount;

        console.log(`${slug.substring(0, 30)}... | H2: ${h2Count} | H3: ${h3Count} | Lists: ${listCount} | Links: ${internalLinks} | Bold: ${boldCount} | Img/Alt: ${imgTags.length}/${altCount}`);
    }

    console.log("\n=== AGGREGATE SEO/GEO STATS ===");
    console.log(stats);
}
analyze();
