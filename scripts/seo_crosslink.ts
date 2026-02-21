import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const fethiyeArticles = [
    { slug: 'fethiyede-nerede-kalinir-bolge-secim-rehberi', keywords: ['Nerede Kalınır', 'nerede kalınır', 'konaklama', 'otel seçimi', 'bölge seçimi'] },
    { slug: 'fethiye-ilk-kez-gidenler-icin-3-5-7-gunluk-hazir-rota', keywords: ['Hazır Rota', 'kaç gün kalınır', 'gezi planı', 'gezi rotası', '5 günlük rota'] },
    { slug: 'fethiyede-aracsiz-arabasiz-tatil-plani-dolmus-taksi-yuruyus', keywords: ['Araçsız', 'Arabasız tatil', 'Dolmuş', 'toplu taşıma'] },
    { slug: 'oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi', keywords: ['Ölüdeniz', 'Kumburnu', 'Belcekız'] },
    { slug: 'kelebekler-vadisi-rehberi-fethiye-ulasim', keywords: ['Kelebekler Vadisi', 'Kelebekler vadisi'] },
    { slug: 'fethiye-tekne-turu-secme-rehberi', keywords: ['Tekne Turu', '12 Adalar', 'Korsan Gemisi'] },
    { slug: 'fethiyede-en-iyi-gun-batimi-noktalari-sunset', keywords: ['Gün Batımı', 'Çalış Plajı gün batımı', 'Seyir Terası'] },
    { slug: 'saklikent-kanyonu-gezi-rehberi-fethiye-selale', keywords: ['Saklıkent', 'Saklıkent Kanyonu', 'kanyon'] },
    { slug: 'tlos-antik-kenti-yakapark-gizlikent-fethiye-selale-rotasi', keywords: ['Tlos', 'Yakapark', 'Gizlikent'] },
    { slug: 'likya-yolu-fethiye-baslangic-parkurlari-rota', keywords: ['Likya Yolu', 'trekking', 'doğa yürüyüşü'] },
    { slug: 'fethiyede-en-iyi-plaj-ve-koy-secimi', keywords: ['Plaj', 'Koy', 'Kabak Koyu', 'Kıdrak'] },
    { slug: 'fethiyeye-ne-zaman-gidilir-hava-durumu', keywords: ['Ne Zaman Gidilir', 'Hava Durumu', 'hangi ay'] },
    { slug: 'fethiyede-cocukla-tatil-kisabir-rehber', keywords: ['Çocukla Tatil', 'çocuk dostu', 'aile oteli'] },
    { slug: 'fethiye-butce-planlayici', keywords: ['Bütçe', 'Maliyet', 'fiyatlar', 'ne kadar harcanır'] },
    { slug: 'fethiye-icerik-fotograf-rotasi-instagram', keywords: ['Fotoğraf rotası', 'Instagram', 'manzara noktaları', 'fotoğraf çekilecek'] }
];

function replaceOutsideTags(html: string, keyword: string, replacement: string): string {
    // Split the html into tokens: tags and text nodes
    const tokens = html.split(/(<[^>]+>)/g);
    let replaced = false;

    for (let i = 0; i < tokens.length; i++) {
        // Even indices are text nodes, odd indices are html tags
        if (i % 2 === 0 && !replaced) {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'i');
            if (regex.test(tokens[i])) {
                tokens[i] = tokens[i].replace(regex, replacement);
                replaced = true;
            }
        }
    }
    return { html: tokens.join(''), replaced };
}

async function fixAndLink() {
    console.log("Starting SEO Internal Linking and Cleanup process...");

    for (let current of fethiyeArticles) {
        console.log(`\nProcessing: ${current.slug}`);
        const { data, error } = await supabase.from('articles').select('id, content').eq('slug', current.slug).single();
        if (error || !data) { console.error("Error fetching", current.slug); continue; }

        let contentObj = data.content;
        let contentHtml = typeof contentObj === 'object' ? contentObj.tr : contentObj;
        if (!contentHtml) continue;

        // 1. FIX EXISTING BROKEN LINKS
        const brokenLinkRegex = /\[INTERNAL_LINK:([^\]]+)\]/g;
        let match;
        let replacedBroken = 0;
        while ((match = brokenLinkRegex.exec(contentHtml)) !== null) {
            const rawSlug = match[1];
            const cleanSlug = rawSlug.replace('guide/', '').replace('rehber/', '');
            contentHtml = contentHtml.replace(match[0], `<a href="/tr/rehber/${cleanSlug}" class="text-blue-600 hover:text-blue-800 underline decoration-blue-300 decoration-2 transition-colors font-medium">bu rehbere</a>`);
            replacedBroken++;
        }

        const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        while ((match = mdLinkRegex.exec(contentHtml)) !== null) {
            if (!match[0].includes('<img')) {
                contentHtml = contentHtml.replace(match[0], `<a href="${match[2]}" class="text-blue-600 hover:text-blue-800 underline decoration-blue-300 decoration-2 transition-colors font-medium">${match[1]}</a>`);
                replacedBroken++;
            }
        }

        if (replacedBroken > 0) console.log(`- Fixed ${replacedBroken} broken link formatting issues.`);

        // 2. SEO CROSSLINKING
        let addedLinks = 0;
        for (let target of fethiyeArticles) {
            if (target.slug === current.slug) continue;
            if (contentHtml.includes(`href="/tr/rehber/${target.slug}"`)) continue;

            for (let keyword of target.keywords) {
                // Ensure keyword doesn't happen inside an existing <a> context accidentally
                // We use our safe tokenizer
                const replacement = `<a href="/tr/rehber/${target.slug}" class="text-blue-600 hover:text-blue-800 underline decoration-blue-300 decoration-2 transition-colors font-medium" title="${target.slug.replace(/-/g, ' ')}">$1</a>`;

                const result = replaceOutsideTags(contentHtml, keyword, replacement);
                if (result.replaced) {
                    contentHtml = result.html;
                    addedLinks++;
                    break;
                }
            }
        }

        console.log(`- Injected ${addedLinks} new native SEO internal links.`);

        // Update database
        let contentUpdate = typeof contentObj === 'object' ? { ...contentObj, tr: contentHtml } : { tr: contentHtml };
        await supabase.from('articles').update({ content: contentUpdate }).eq('id', data.id);
    }
    console.log("\n✅ ALL FETHIYE ARTICLES CROSS-LINKED!");
}

fixAndLink();
