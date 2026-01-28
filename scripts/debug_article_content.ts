
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function dumpContent() {
    const { data: article } = await supabase
        .from('articles')
        .select('content')
        .eq('slug', 'turkey-city-coast-itinerary-uk-best-split-seasons')
        .single();

    if (article) {
        // Handle content field which might be an object { en: "..." } or string
        let html = "";
        if (typeof article.content === 'string') {
            html = article.content;
        } else if (article.content && (article.content as any).en) {
            html = (article.content as any).en;
        }

        console.log(html);
        fs.writeFileSync('debug_article.html', html);
    } else {
        console.log("Article not found");
    }
}

dumpContent();
