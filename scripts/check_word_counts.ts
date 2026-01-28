
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

async function checkWordCounts() {
    console.log("🔍 Checking Article Word Counts...");
    const { data, error } = await supabase
        .from('articles')
        .select('slug, content')
        .in('slug', slugs);

    if (error) {
        console.error("❌ DB Error:", error);
        return;
    }

    data.forEach(article => {
        // Strip HTML tags for accurate word count
        const textObject = article.content;
        // Handle if content is stored as JSON (en/tr) or string
        const contentStr = typeof textObject === 'object' && textObject.en ? textObject.en : String(textObject);

        const cleanText = contentStr.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const wordCount = cleanText.split(' ').length;

        console.log(`\n📄 Slug: ${article.slug}`);
        console.log(`   📝 Word Count: ${wordCount}`);
    });
}

checkWordCounts();
