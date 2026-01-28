
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function nuclearOption() {
    console.log("☢️ INITIATING NUCLEAR OPTION V2 (HTML SEEKER)...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;

        // Normalize checking
        let strToCheck = "";
        if (typeof content === 'object' && content.en) strToCheck = content.en;
        else if (typeof content === 'string') strToCheck = content;

        // Only run if it looks wrapped (starts with {)
        if (!strToCheck.trim().startsWith('{')) continue;

        console.log(`\nTARGETING: ${article.slug}`);

        let extraction = strToCheck;

        // Find first < OR \u003c that is followed by a letter (tag start)
        // This avoids finding < inside JSON if it's not a tag (though unlikely in this context)
        let match = extraction.match(/(<|\\u003c)[a-z]/i);
        let startIdx = match ? match.index : -1;

        if (startIdx !== undefined && startIdx > -1) {
            extraction = extraction.substring(startIdx);
            console.log(`   ✂️ Sliced prefix. New start: ${extraction.substring(0, 20)}`);
        } else {
            console.log(`   ⚠️ Could not find HTML start (<). match: ${match}`);
            continue;
        }

        // 2. Cleanup suffix (garnish)
        // Strip trailing } or " or space recursively
        extraction = extraction.replace(/(\\?\"|\}|\\)\s*$/g, '');
        extraction = extraction.replace(/(\\?\"|\}|\\)\s*$/g, '');
        extraction = extraction.replace(/(\\?\"|\}|\\)\s*$/g, '');
        extraction = extraction.replace(/(\\?\"|\}|\\)\s*$/g, ''); // 4 times for good luck

        // 3. UNESCAPE until clean
        let loops = 0;
        let diff = true;
        while (loops < 15 && diff) {
            let prev = extraction;

            // Unescape quotes
            extraction = extraction.replace(/\\"/g, '"');
            // Unescape slashes
            extraction = extraction.replace(/\\\\/g, '\\');
            // Unescape unicode start
            extraction = extraction.replace(/\\u003c/gi, '<');
            extraction = extraction.replace(/\\u003e/gi, '>');

            if (extraction === prev) diff = false;
            loops++;
        }

        // 4. One last check for "tr" artifact
        extraction = extraction.replace(/,?\s*"tr"\s*:\s*".*$/i, '');

        // Update
        if (extraction.startsWith('<')) {
            await supabase.from('articles').update({
                content: { en: extraction, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            console.log(`   ✅ NUCLEAR CLEAN SUCCESS`);
            fixedCount++;
        } else {
            console.log(`   ⚠️ Result did not look like HTML: ${extraction.substring(0, 50)}`);
        }
    }

    console.log(`☢️ Nuclear Option Complete. Fixed ${fixedCount} articles.`);
}

nuclearOption();
