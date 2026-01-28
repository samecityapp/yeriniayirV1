
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function debugFix() {
    console.log("🐞 Debugging Driving Article (Cleaner Version)...");

    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', 'driving-in-turkey-as-a-uk-traveller-rules-confidence-tips-what-to-expect')
        .single();

    if (!article) {
        console.error("Article not found");
        return;
    }

    let html = "";
    if (typeof article.content === 'string') {
        console.log("Content is STRING");
        html = article.content;
    } else {
        console.log("Content is OBJECT");
        html = (article.content as any).en || JSON.stringify(article.content);
    }

    console.log("--- RAW CONTENT START (First 100) ---");
    console.log(html.substring(0, 100));

    // Try parsing as JSON first
    try {
        const inner = JSON.parse(html);
        console.log("✅ Parse 1 Successful");
        if (inner.en) {
            console.log("Found inner.en, unwrapping...");
            html = inner.en;

            // Try Parsing Layer 2
            try {
                const inner2 = JSON.parse(html);
                console.log("✅ Parse 2 Successful (It was cleaner than expected?)");
            } catch (e2: any) {
                console.error("❌ Parse 2 Failed:", e2.message);
                console.log("Trying Frankenstein Cleaner...");

                let cleaned = html;

                // 1. Remove JSON Prefix artifacts (recursively)
                let working = true;
                while (working) {
                    if (cleaned.startsWith('{"en":')) {
                        cleaned = cleaned.substring(6);
                        if (cleaned.startsWith('"')) cleaned = cleaned.substring(1);
                    } else if (cleaned.startsWith('{\\"en\\":')) {
                        cleaned = cleaned.substring(9);
                        if (cleaned.startsWith('\\"')) cleaned = cleaned.substring(2);
                        else if (cleaned.startsWith('"')) cleaned = cleaned.substring(1);
                    } else {
                        working = false;
                    }
                }

                // 2. Remove trailing JSON artifacts
                cleaned = cleaned.replace(/(\}|"|\\")+$/g, '');

                // 3. Unescape
                cleaned = cleaned.replace(/\\"/g, '"');
                cleaned = cleaned.replace(/\\n/g, ' ');
                cleaned = cleaned.replace(/[\x00-\x1F]+/g, ' ');

                console.log("Cleaned Start:", cleaned.substring(0, 100));

                if (cleaned.includes('<h1') || cleaned.includes('<div') || cleaned.includes('<p>')) {
                    console.log("✅ Looks like HTML. FORCE UPDATING...");
                    const newContent = { en: cleaned, tr: "<p>Content available in English only.</p>" };

                    const { error: upErr } = await supabase
                        .from('articles')
                        .update({ content: newContent })
                        .eq('id', article.id);

                    if (upErr) console.error("Update failed:", upErr);
                    else console.log("✅ FRANKENSTEIN UPDATE SUCCESSFUL");
                }
            }
        }
    } catch (e: any) {
        console.log("❌ Parse 1 Failed:", e.message);
    }
}

debugFix();
