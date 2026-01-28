
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function atomicVerify() {
    console.log("atom ATOMIC VERIFY: Women Travelling...");
    const slug = 'women-travelling-in-turkey-comfort-tips';

    // 1. Fetch
    const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!article) return;

    console.log(`ID: ${article.id}`);

    let content = article.content;
    if (typeof content === 'object' && content.en) content = content.en;
    console.log(`Initial Length: ${content.length}`);

    // 2. Mod
    let clean = content + " MARKER_UPDATE";
    // Actually let's clean it properly again
    let prev = clean;
    // Tail cut logic
    const idx = clean.lastIndexOf('","tr":');
    if (idx > -1) clean = clean.substring(0, idx);
    clean = clean.trim();

    console.log(`Proposed Length: ${clean.length}`);

    // 3. Update
    const { error } = await supabase.from('articles').update({
        content: { en: clean, tr: "<p>Content available in English only.</p>" }
    }).eq('id', article.id);

    if (error) {
        console.error("❌ Update Error:", error);
        return;
    }
    console.log("✅ Update called successfully.");

    // 4. Read Back Immediately
    const { data: check } = await supabase.from('articles').select('*').eq('id', article.id).single();
    let checkContent = check.content;
    if (typeof checkContent === 'object' && checkContent.en) checkContent = checkContent.en;

    console.log(`Readback Length: ${checkContent.length}`);

    if (checkContent.length === clean.length) {
        console.log("✅ PERSISTENCE CONFIRMED in same session.");
    } else {
        console.log("❌ PERSISTENCE FAILED. Readback matches initial?");
        console.log("Readback == Initial?", checkContent.length === content.length);
    }
}

atomicVerify();
