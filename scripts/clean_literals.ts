
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function cleanLiterals() {
    console.log("🧹 Cleaning Literal '/n' and '\\n' artifacts...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) return;

    for (const article of articles) {
        let content = (article.content as any).en || article.content;

        if (typeof content !== 'string') continue;

        let newContent = content;

        // Remove literal "/n"
        newContent = newContent.replace(/\/n\s?/g, ' ');
        // Remove literal "\n"
        newContent = newContent.replace(/\\n\s?/g, ' ');
        // Remove literal "\r"
        newContent = newContent.replace(/\\r\s?/g, ' ');

        if (newContent !== content) {
            console.log(`✨ Cleaning literals in ${article.slug}`);
            await supabase.from('articles').update({
                content: { en: newContent, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
        }
    }
    console.log("Done.");
}

cleanLiterals();
