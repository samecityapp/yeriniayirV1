
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function findSlugs() {
    const searchTerms = [
        "a-la-carte",
        "resort-transfers",
        "families",
        "value",
        "package"
    ];

    console.log("🔍 Searching for slugs...");

    for (const term of searchTerms) {
        const { data } = await supabase
            .from('articles')
            .select('slug, title')
            .ilike('slug', `%${term}%`)
            .limit(5);

        if (data && data.length > 0) {
            console.log(`\nTerm: "${term}"`);
            data.forEach(a => console.log(`   - ${a.slug}`));
        }
    }
}

findSlugs();
