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

async function countWords() {
    let total = 0;
    console.log("| # | Makale ID / Slug | Kelime Sayısı |");
    console.log("|---|---|---|");
    for (let i = 0; i < slugs.length; i++) {
        const slug = slugs[i];
        const { data, error } = await supabase.from('articles').select('content').eq('slug', slug).single();
        if (error || !data) {
            console.log(`| ${i + 1} | ${slug} | ❌ Hata |`);
            continue;
        }

        const contentObj = data.content;
        let contentHtml = '';
        if (typeof contentObj === 'object' && contentObj?.tr) {
            contentHtml = contentObj.tr;
        } else if (typeof contentObj === 'string') {
            contentHtml = contentObj;
        }

        // Strip HTML tags and normalize whitespace
        const textOnly = contentHtml.replace(/<[^>]+>/g, ' ').replace(/\\n/g, ' ');
        const words = textOnly.trim().split(/\s+/).filter(word => word.length > 0);
        const count = words.length;
        total += count;

        const titleSlugMatch = slug.length > 40 ? slug.substring(0, 40) + '...' : slug;
        console.log(`| ${i + 1} | ${titleSlugMatch} | **${count}** |`);
    }
    console.log(`\n**Toplam Fethiye Kelime Sayısı:** ${total} kelime`);
}
countWords();
