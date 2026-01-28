
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function polishCaptions() {
    console.log("✨ POLISHING CAPTIONS (Removing '- View X')...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;
        if (typeof content === 'object' && content.en) content = content.en;

        let extraction = content;
        let original = extraction;

        // Regex to replace " - View X" with ""
        // Target: alt="... - View 1"
        extraction = extraction.replace(/alt="([^"]*?) - View \d+"/g, 'alt="$1"');

        // Target: <figcaption ...>... - View 1</figcaption>
        // Use capturing group for the content before " - View X"
        // Be careful with newlines or attributes in figcaption tag
        extraction = extraction.replace(/(<figcaption[^>]*>)(.*?) - View \d+(<\/figcaption>)/g, '$1$2$3');

        if (extraction !== original) {
            await supabase.from('articles').update({
                content: { en: extraction, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            // console.log(`   ✅ Polished: ${article.slug}`);
            fixedCount++;
        }
    }

    console.log(`✨ Caption Polish Complete. Updated ${fixedCount} articles.`);
}

polishCaptions();
