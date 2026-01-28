
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function deepDebugWomen() {
    console.log("🕵️ DEEP DEBUG: Women Travelling...");
    const slug = 'women-travelling-in-turkey-comfort-tips';

    const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!article) return;

    let content = article.content;
    if (typeof content === 'object' && content.en) content = content.en;

    // Check escaping
    console.log("Has \\\" ?", content.includes('\\"'));
    console.log("Has \" ?", content.includes('"'));

    // Check tail
    const marker = '","tr":';
    const idx = content.lastIndexOf(marker);
    console.log(`LastIndexOf '${marker}': ${idx}`);
    console.log(`Total Length: ${content.length}`);
    console.log(`Tail Preview (at idx): ${content.substring(Math.max(0, idx), idx + 20)}`);

    // Try simple replacement in memory
    let clean = content;
    // Unescape
    clean = clean.split('\\"').join('"');
    console.log("After split/join unescape, has \\\" ?", clean.includes('\\"'));

    // Tail cut
    const newIdx = clean.lastIndexOf(marker);
    console.log(`New LastIndexOf '${marker}': ${newIdx}`);

    if (newIdx > -1) {
        clean = clean.substring(0, newIdx);
        console.log("Sliced tail.");
    }

    // Save?
    if (clean !== content) {
        console.log("Updating real DB with debug result...");
        const { error } = await supabase.from('articles').update({
            content: { en: clean, tr: "<p>Content available in English only.</p>" }
        }).eq('id', article.id);
        if (!error) console.log("✅ Debug Fix Saved.");
    }
}

deepDebugWomen();
