
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function debugNuclear() {
    console.log("🐞 DEBUG NUCLEAR...");
    const slug = 'driving-in-turkey-as-a-uk-traveller-rules-confidence-tips-what-to-expect';

    const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!article) return;

    let strToCheck = article.content;
    if (typeof strToCheck === 'object' && strToCheck.en) strToCheck = strToCheck.en;

    console.log("Original Length:", strToCheck.length);
    console.log("Start (100):", strToCheck.substring(0, 100));

    // Logic from Nuclear Option V2
    let extraction = strToCheck;
    let match = extraction.match(/(<|\\u003c)[a-z]/i);
    let startIdx = match ? match.index : -1;

    console.log(`Match detected: ${match ? match[0] : 'None'}`);
    console.log(`Start Index: ${startIdx}`);

    if (startIdx > -1) {
        extraction = extraction.substring(startIdx);
        console.log("Sliced Start:", extraction.substring(0, 50));

        // Unescape loop simulation
        let loops = 0;
        let diff = true;
        while (loops < 15 && diff) {
            let prev = extraction;
            extraction = extraction.replace(/\\"/g, '"');
            extraction = extraction.replace(/\\\\/g, '\\');
            extraction = extraction.replace(/\\u003c/gi, '<');
            extraction = extraction.replace(/\\u003e/gi, '>');

            if (extraction === prev) diff = false;
            loops++;
        }
        console.log("After Unescape loops:", loops);
        console.log("Result Start:", extraction.substring(0, 50));

        if (extraction.startsWith('<')) {
            console.log("✅ RESULT IS HTML. WOULD UPDATE NOW.");

            const { error: upErr } = await supabase.from('articles').update({
                content: { en: extraction, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            if (upErr) console.log("❌ Update Error:", upErr);
            else console.log("💾 Forced Update Complete.");

        } else {
            console.log("❌ Result NOT HTML.");
        }

    } else {
        console.log("❌ No HTML tag found regex.");
    }
}

debugNuclear();
