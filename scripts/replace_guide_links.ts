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

async function replaceGuideLinks() {
    let replacedCount = 0;

    for (const slug of slugs) {
        const { data, error } = await supabase.from('articles').select('id, content').eq('slug', slug).single();
        if (error || !data) continue;

        let contentObj = data.content;
        let contentHtml = typeof contentObj === 'object' ? contentObj.tr : contentObj;

        if (!contentHtml) continue;

        const originalHtml = contentHtml;

        // Handle standard quotes
        contentHtml = contentHtml.replace(/href="\/guide\//g, 'href="/tr/rehber/');
        contentHtml = contentHtml.replace(/href='\/guide\//g, "href='/tr/rehber/");

        // Handle escaped quotes (which might still exist in the DB representation)
        contentHtml = contentHtml.replace(/href=\\"\/guide\//g, 'href=\\"/tr/rehber/');
        contentHtml = contentHtml.replace(/href=\\'\/guide\//g, "href=\\'/tr/rehber/");

        // Handle without leading slash
        contentHtml = contentHtml.replace(/href="guide\//g, 'href="/tr/rehber/');
        contentHtml = contentHtml.replace(/href=\\"guide\//g, 'href=\\"/tr/rehber/');

        if (contentHtml !== originalHtml) {
            let contentUpdate = typeof contentObj === 'object' ? { ...contentObj, tr: contentHtml } : { tr: contentHtml };
            const { error: updateError } = await supabase.from('articles').update({ content: contentUpdate }).eq('id', data.id);
            if (!updateError) {
                replacedCount++;
                console.log(`[${slug}] Replaced guide links and updated.`);
            }
        }
    }

    console.log(`\nFixed links in ${replacedCount} articles.`);
}
replaceGuideLinks();
