import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkArticle() {
    const targetSlug = process.argv[2] || 'where-to-stay-in-bodrum-best-areas-guide-uk';
    console.log(`🔍 Checking for slug: ${targetSlug}`);

    const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', targetSlug)
        .single();

    if (error) {
        console.error("❌ Error fetching article:", error);
    } else if (article) {
        console.log("✅ Article found!");
        console.log(`Title (en): ${JSON.stringify(article.title)}`);
        console.log(`ID: ${article.id}`);
        console.log("--- Content Structure Analysis ---");
        let root = article.content;
        console.log("Type of root:", typeof root);

        let inner = root;
        if (typeof root === 'object' && root.en) {
            console.log("Root is object with .en");
            inner = root.en;
        }

        console.log("Type of inner:", typeof inner);
        if (typeof inner === 'string') {
            console.log("Inner starts with:", inner.substring(0, 15));
            if (inner.trim().startsWith('{')) console.log("⚠️ WARNING: Inner looks like JSON!");
            else console.log("✅ Inner looks like HTML/Text");
        }

        console.log("--- Content Preview (Raw Inner) ---");
        console.log(typeof inner === 'string' ? inner.substring(0, 500) : JSON.stringify(inner).substring(0, 500));

        // Find first image tag
        const imgMatch = (typeof inner === 'string' ? inner : JSON.stringify(inner)).match(/<img[^>]+>/);
        if (imgMatch) {
            console.log("--- First Image Tag ---");
            console.log(imgMatch[0]);
        } else {
            console.log("--- No Image Tag Found ---");
        }
    } else {
        console.log("❌ Article not found!");
    }
}

checkArticle();
