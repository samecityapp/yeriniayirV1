
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function loopFixWomen() {
    console.log("🔄 LOOP FIX: Women Travelling...");
    const slug = 'women-travelling-in-turkey-comfort-tips';

    let passes = 0;
    while (passes < 100) {
        passes++;
        console.log(`\n--- PASS ${passes} ---`);

        const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
        if (!article) return;

        let content = article.content;
        if (typeof content === 'object' && content.en) content = content.en;

        let clean = content;
        let changed = false;

        // 1. Unescape (Split/Join)
        if (clean.includes('\\"')) {
            console.log("   found escaped quotes, unescaping...");
            clean = clean.split('\\"').join('"');
            changed = true;
        }
        if (clean.includes('\\\\')) {
            console.log("   found escaped slashes, unescaping...");
            clean = clean.split('\\\\').join('\\');
            changed = true;
        }

        // 2. Tail Cut
        const marker = '","tr":';
        const idx = clean.lastIndexOf(marker);
        if (idx > -1 && idx > clean.length - 2000) {
            console.log(`   found tail artifact at ${idx}, slicing...`);
            clean = clean.substring(0, idx);
            changed = true;
        } else {
            // Try space variant
            const marker2 = '", "tr":';
            const idx2 = clean.lastIndexOf(marker2);
            if (idx2 > -1 && idx2 > clean.length - 2000) {
                console.log(`   found tail artifact (space) at ${idx2}, slicing...`);
                clean = clean.substring(0, idx2);
                changed = true;
            }
        }

        // 3. Trim garbage
        clean = clean.trim();
        while (clean.endsWith('"') || clean.endsWith('}')) {
            clean = clean.slice(0, -1);
            clean = clean.trim();
            changed = true;
        }

        if (changed) {
            console.log("   Saving changes...");
            await supabase.from('articles').update({
                content: { en: clean, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            // Wait for DB propagation?
            await new Promise(r => setTimeout(r, 1000));
        } else {
            console.log("✅ CONTENT STABLE. No changes needed.");
            break;
        }
    }
}

loopFixWomen();
