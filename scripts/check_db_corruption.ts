import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const slugs = [
        'fethiye-tekne-turu-secme-rehberi',
        'oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi'
    ];

    for (const slug of slugs) {
        console.log(`\n--- CHECKING: ${slug} ---`);
        const { data, error } = await supabase.from('articles').select('content').eq('slug', slug).single();
        if (error) { console.error(error); continue; }

        console.log("Type of data.content:", typeof data.content);
        let contentStr = '';
        if (typeof data.content === 'object') {
            console.log("Keys:", Object.keys(data.content));
            console.log("Type of data.content.tr:", typeof data.content.tr);
            contentStr = String(data.content.tr);
        } else {
            contentStr = String(data.content);
        }

        console.log("First 150 chars:", contentStr.substring(0, 150));

        const imgMatches = contentStr.match(/<img[^>]*>/g);
        console.log("Image tags found:", imgMatches ? imgMatches.length : 0);
        if (imgMatches && imgMatches.length > 0) {
            console.log("First image tag:", imgMatches[0].substring(0, 100));
        }
    }
}
check();
