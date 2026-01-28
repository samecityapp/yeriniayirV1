
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

async function listLinks() {
    console.log("🔍 Fetching last 55 generated articles...\n");

    const { data: articles, error } = await supabase
        .from('articles')
        .select('slug, title, created_at')
        .order('created_at', { ascending: false })
        .limit(55);

    if (error || !articles) {
        console.error("❌ DB Error:", error);
        return;
    }

    console.log("### 📝 Full List of Generated Articles (Latest First)\n");

    for (const article of articles) {
        const title = typeof article.title === 'object' ? (article.title as any).en : article.title;
        console.log(`- [${title}](http://localhost:3000/en/guide/${article.slug})`);
    }

    console.log(`\n\n✅ Listed ${articles.length} articles.`);
}

listLinks();
