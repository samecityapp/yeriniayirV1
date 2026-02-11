
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function run() {
    console.log("🛠️ DEBUG: Forcing simple content update on 'travel-insurance-turkey-uk-guide'...");

    // 1. Get current content
    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', 'travel-insurance-turkey-uk-guide')
        .single();

    if (!article) return console.error("Article not found");

    console.log("Current Content Type:", typeof article.content);
    // console.log("Current Content Preview:", JSON.stringify(article.content).slice(0, 100));

    // 2. Prepare simple update with image
    // Note: The content column is JSONB usually in this project based on previous scripts
    // { en: "HTML...", tr: "..." }

    let currentEn = "";
    if (typeof article.content === 'string') {
        // If it's a string, maybe it's just HTML?
        currentEn = article.content;
    } else {
        currentEn = (article.content as any).en || "";
    }

    const testImage = '<img src="/images/articles/travel-insurance-policy-passport-authentic-1767989062717.jpg" alt="test" />';

    // Append to beginning to be easily seen
    const newEn = testImage + currentEn;

    const { error } = await supabase
        .from('articles')
        .update({
            content: { en: newEn, tr: "Updated by debug script" }
        })
        .eq('id', article.id);

    if (error) {
        console.error("❌ Update failed:", error);
    } else {
        console.log("✅ Update successful. Re-fetching to verify...");

        const { data: updated } = await supabase
            .from('articles')
            .select('content')
            .eq('id', article.id)
            .single();

        const updatedEn = (updated?.content as any)?.en || "";
        if (updatedEn.includes('<img src="/images/articles/travel-insurance-policy-passport-authentic-1767989062717.jpg"')) {
            console.log("✅ Verification SUCCESS: Image tag found in DB.");
        } else {
            console.error("❌ Verification FAILED: Image tag NOT found in DB after update.");
        }
    }
}

run();
