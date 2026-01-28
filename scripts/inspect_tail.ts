
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function inspectTail() {
    const slug = 'women-travelling-in-turkey-comfort-tips';
    console.log(`🔍 Inspecting TAIL of: ${slug}`);

    const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!article) return;

    let content = article.content;
    if (typeof content === 'object' && content.en) content = content.en;

    // Check type
    console.log("Type:", typeof content);

    if (typeof content === 'string') {
        console.log("Length:", content.length);
        console.log("\n--- LAST 1000 CHARS ---");
        console.log(content.slice(-1000));
        console.log("\n--- IMAGE TAGS FOUND ---");
        const images = content.match(/<img[^>]+>/g);
        console.log(images || "No images found.");

        console.log("\n--- CAPTION TAGS FOUND ---");
        const captions = content.match(/<figcaption[^>]*>.*?<\/figcaption>/g);
        console.log(captions || "No captions found.");
    } else {
        console.log("Content is not string!");
        console.log(JSON.stringify(content).slice(-500));
    }
}

inspectTail();
