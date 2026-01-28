
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // verifying headers/status
// If node-fetch is not available in environment, we might need to rely on native fetch if node version supports it, 
// usually 'tsx' runs with node, which has global fetch in recent versions. 
// We will try global fetch first, if it fails we will remove the import.

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function auditArticles() {
    console.log("🔍 Auditing last 20 articles...");

    const { data: articles, error } = await supabase
        .from('articles')
        .select('title, slug, content')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error("❌ DB Error:", error);
        return;
    }

    console.log(`Found ${articles.length} articles.\n`);

    for (const article of articles) {
        // 1. Word Count
        let contentStr = "";
        if (typeof article.content === 'object' && article.content !== null) {
            contentStr = (article.content as any).en || "";
        } else if (typeof article.content === 'string') {
            contentStr = article.content;
        }

        const cleanText = contentStr.replace(/<[^>]*>?/gm, '');
        const wordCount = cleanText.split(/\s+/).length;

        // 2. Link Check
        const url = `http://localhost:3000/en/guide/${article.slug}`;
        let status = "Unknown";
        let icon = "❓";

        try {
            const res = await fetch(url);
            status = res.status.toString();
            icon = res.ok ? "✅" : "❌";
        } catch (e) {
            status = "Error (Server down?)";
            icon = "☠️";
        }

        const title = typeof article.title === 'object' ? (article.title as any).en : article.title;

        console.log(`${icon} [${status}] Length: ${wordCount} words`);
        console.log(`   Title: ${title}`);
        console.log(`   Link: ${url}`);
        console.log('---');
    }
}

auditArticles();
