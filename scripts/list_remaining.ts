import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listFethiyeArticles() {
    const { data, error } = await supabase.from('articles')
        .select('slug, title, cover_image_url')
        .order('published_at', { ascending: true });

    if (error) { console.error(error); return; }

    const done = [
        'fethiyede-nerede-kalinir-bolge-secim-rehberi',
        'fethiye-ilk-kez-gidenler-icin-3-5-7-gunluk-hazir-rota',
        'fethiyede-aracsiz-arabasiz-tatil-plani-dolmus-taksi-yuruyus',
        'oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi',
        'kelebekler-vadisi-rehberi-fethiye-ulasim'
    ];

    const remaining = data?.filter(a => !done.includes(a.slug)) || [];
    console.log(`Total articles: ${data?.length}, Remaining: ${remaining.length}`);
    remaining.forEach((a, i) => {
        const title = typeof a.title === 'object' ? a.title.tr : a.title;
        console.log(`${i + 1}. '${a.slug}',  // ${title}`);
    });
}
listFethiyeArticles();
