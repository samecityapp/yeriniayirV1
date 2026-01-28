
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function finalUniversalFix() {
    console.log("🌍 UNIVERSAL FIX (Unescape + IndexOf Slice)...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;
        if (typeof content === 'object' && content.en) content = content.en;
        if (typeof content !== 'string') continue;

        let extraction = content;
        const original = extraction;

        // 1. Force Unescape (The "Split/Join" method)
        // Replace \" with "
        // Replace \\ with \
        let unescaped = extraction.split('\\"').join('"');
        unescaped = unescaped.split('\\\\').join('\\');
        extraction = unescaped;

        // 2. Remove Tail Artifacts using IndexOf (Robust)
        // Target: ","tr":
        const idx = extraction.lastIndexOf('","tr":');
        if (idx > -1 && idx > extraction.length - 200) { // Should be near end
            extraction = extraction.substring(0, idx);
        } else {
            // Target: ", "tr":
            const idx2 = extraction.lastIndexOf('", "tr":');
            if (idx2 > -1 && idx2 > extraction.length - 200) {
                extraction = extraction.substring(0, idx2);
            }
        }

        // 3. Remove Title/Next Article Artifacts that might be lurking
        // "Next article" sometimes appears as text
        // Let's rely on previous scripts for that, this is for the JSON wrapping corruption.

        // 4. Clean trailing garbage
        extraction = extraction.trim();
        // Remove trailing " or } or ] recursively
        while (extraction.length > 0 && (extraction.endsWith('"') || extraction.endsWith('}') || extraction.endsWith(']'))) {
            extraction = extraction.slice(0, -1);
            extraction = extraction.trim();
        }

        if (extraction !== original) {
            await supabase.from('articles').update({
                content: { en: extraction, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            fixedCount++;
        }
    }

    console.log(`🌍 Universal Fix Complete. Updated ${fixedCount} articles.`);
}

finalUniversalFix();
