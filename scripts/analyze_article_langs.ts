import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: articles, error } = await supabase.from('articles').select('id, title, slug, slug_en, location');
    if (error) { console.error(error); return; }

    let hasTr = 0;
    let hasEn = 0;

    // Also log the columns
    if (articles.length > 0) {
        console.log("Columns:", Object.keys(articles[0]));
    }

    let pureTr = 0;
    let pureEn = 0;
    let both = 0;
    let neither = 0;

    for (const a of articles) {
        const isTr = !!a.slug; // Assuming slug is TR
        const isEn = !!a.slug_en; // Assuming slug_en is EN
        if (isTr && isEn) both++;
        else if (isTr) pureTr++;
        else if (isEn) pureEn++;
        else neither++;
    }

    console.log(`Total count: ${articles.length}`);
    console.log(`Has both slug and slug_en: ${both}`);
    console.log(`Only TR (slug but no slug_en): ${pureTr}`);
    console.log(`Only EN (slug_en but no slug): ${pureEn}`);
    console.log(`Neither: ${neither}`);

    // Let's also check if title is a String or an Object
    if (articles.length > 0) {
        console.log("Sample title type:", typeof articles[0].title);
        console.log("Sample title (first item):", JSON.stringify(articles[0].title));
    }
}
run();
