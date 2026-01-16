import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkSlugs() {
    const slugsToCheck = [
        'staying-healthy-in-turkey-uk-checklist',
        'all-inclusive-whats-included-turkey',
        'best-all-inclusive-value-uk-turkey' // Already verified but good to double check
    ];

    console.log("🔍 Checking slugs in DB...");

    const { data, error } = await supabase
        .from('articles')
        .select('slug, title')
        .in('slug', slugsToCheck);

    if (error) {
        console.error("❌ DB Error:", error);
    } else {
        console.log("✅ Found Articles:", data);
        const foundSlugs = data.map(a => a.slug);
        const missing = slugsToCheck.filter(s => !foundSlugs.includes(s));
        if (missing.length > 0) {
            console.warn("⚠️ Missing Slugs:", missing);
        } else {
            console.log("🎉 All slugs confirmed!");
        }
    }
}

checkSlugs();
