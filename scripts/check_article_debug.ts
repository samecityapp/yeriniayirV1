import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkArticle() {
    const slug = 'turkey-in-may-from-uk';
    console.log(`🔍 Checking for slug: ${slug}`);

    const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, published_at')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error("❌ Error fetching article:", error);
    } else {
        console.log("✅ Article found:", data);
    }
}

checkArticle();
