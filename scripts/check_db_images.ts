
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const slugs = [
    "best-regions-for-all-inclusive-in-turkey-which-coast-fits-your-style",
    "all-inclusive-turkey-for-families-uk-parent-checklist",
    "adults-only-all-inclusive-turkey-guide-quiet-vs-party"
];

async function checkImages() {
    console.log("🔍 Checking DB for Cover Images...");
    const { data, error } = await supabase
        .from('articles')
        .select('slug, cover_image_url')
        .in('slug', slugs);

    if (error) {
        console.error("❌ DB Error:", error);
        return;
    }

    data.forEach(article => {
        console.log(`\n📄 Slug: ${article.slug}`);
        console.log(`   🖼️ Cover URL: ${article.cover_image_url || "MISSING (NULL)"}`);
    });
}

checkImages();
