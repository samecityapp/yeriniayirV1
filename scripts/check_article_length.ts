
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkLength() {
    const { data, error } = await supabase
        .from('articles')
        .select('title, content')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error(error);
        return;
    }

    // Data is array now
    const articles = Array.isArray(data) ? data : [data];

    for (const article of articles) {
        let contentStr = "";
        if (typeof article.content === 'object' && article.content !== null) {
            contentStr = (article.content as any).en || "";
        } else if (typeof article.content === 'string') {
            contentStr = article.content;
        }

        const cleanText = contentStr.replace(/<[^>]*>?/gm, '');
        const wordCount = cleanText.split(/\s+/).length;

        console.log(`Title: ${typeof article.title === 'object' ? (article.title as any).en : article.title}`);
        console.log(`Word Count: ~${wordCount}`);
        console.log(`Character Count: ${cleanText.length}`);
        console.log('---');
    }
}


checkLength();
