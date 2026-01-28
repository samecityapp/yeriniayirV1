
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function smartFixWomen() {
    console.log("🧠 SMART FIX: Women Travelling...");
    const slug = 'women-travelling-in-turkey-comfort-tips';

    const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!article) return;

    let content = article.content;
    if (typeof content === 'object' && content.en) content = content.en;

    console.log(`Original Length: ${content.length}`);

    let clean = content;
    let loops = 0;

    // 1. In-Memory Recursive Unescape
    while (loops < 1000) {
        let prev = clean;

        // Unescape
        clean = clean.split('\\"').join('"');
        clean = clean.split('\\\\').join('\\');

        // Tail Cut (Check every layer)
        const marker = '","tr":';
        const idx = clean.lastIndexOf(marker);
        if (idx > -1 && idx > clean.length - 2000) {
            clean = clean.substring(0, idx);
        } else {
            const marker2 = '", "tr":';
            const idx2 = clean.lastIndexOf(marker2);
            if (idx2 > -1 && idx2 > clean.length - 2000) {
                clean = clean.substring(0, idx2);
            }
        }

        // Trim
        clean = clean.trim();
        while (clean.endsWith('"') || clean.endsWith('}')) {
            clean = clean.slice(0, -1);
            clean = clean.trim();
        }

        if (clean === prev) {
            console.log(`✅ Stabilized after ${loops} loops.`);
            break;
        }
        loops++;
    }

    // 2. Final Sanity Checks
    // Remove " - View X" if hidden
    clean = clean.replace(/ - View \d+/g, '');

    console.log(`Final Length: ${clean.length}`);

    if (clean !== content) {
        console.log("Saving changes...");
        const { error } = await supabase.from('articles').update({
            content: { en: clean, tr: "<p>Content available in English only.</p>" }
        }).eq('id', article.id);
        if (!error) console.log("🎉 Saved.");
    } else {
        console.log("No changes needed (already clean?).");
    }
}

smartFixWomen();
