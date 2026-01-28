
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function nuclearOptionV3() {
    console.log("☢️ NUCLEAR OPTION V3 (ESCAPED STRING KILLER)...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;

        // Normalize checking
        let strToCheck = "";
        if (typeof content === 'object' && content.en) strToCheck = content.en;
        else if (typeof content === 'string') strToCheck = content;

        console.log(`\nTARGETING: ${article.slug}`);

        let extraction = strToCheck;

        // 1. UNESCAPE AGGRESSIVELY FIRST
        // If it contains \\", it's escaped.
        let loops = 0;
        let diff = true;
        // Limit loops but be aggressive
        while (loops < 10 && diff) {
            let prev = extraction;
            // Standard JSON unescape attempt if possible?
            // "{\"en ... " -> {"en ...

            // Regex Unescape
            extraction = extraction.replace(/\\\\"/g, '__TEMP_QUOTE__'); // Protect double escaped? No, just unescape layers.
            extraction = extraction.replace(/\\"/g, '"');
            extraction = extraction.replace(/\\\\/g, '\\');

            // Fix temp? No, simple replacement is better.

            if (extraction === prev) diff = false;
            loops++;
        }

        // 2. Find HTML Start <h or <p etc
        let match = extraction.match(/<(h[1-6]|p|div|ul|ol)/i);
        let startIdx = match ? match.index : -1;

        if (startIdx > -1) {
            extraction = extraction.substring(startIdx);
            console.log(`   ✂️ Sliced prefix. New start: ${extraction.substring(0, 20)}`);
        } else {
            // Fallback: maybe it starts with "<h1>...
            if (extraction.startsWith('"<')) {
                extraction = extraction.substring(1);
            }
        }

        // 3. REMOVE TRAILING TR GARBAGE
        // The artifact seen: ","tr":"<p>Content available in English only.</p>"}
        // Also: \",\"tr\":\"...

        // Regex to kill anything after valid HTML closing tags?
        // Or specific target
        extraction = extraction.replace(/,?\s*\\?"?,?\s*\\?"?tr\\?"?\s*:\s*.*$/i, '');
        extraction = extraction.replace(/\}?\s*\]?\s*\}?\s*$/g, '');

        // 4. CLEANUP IMAGES (Fix paths if broken by unescape)
        // Images looked like: src=\\\"/images...
        // After unescape they should be src="/images...
        // Let's ensure standard HTML attributes
        extraction = extraction.replace(/src="\\+\//g, 'src="/');
        extraction = extraction.replace(/alt="\\+/g, 'alt="');
        extraction = extraction.replace(/class="\\+/g, 'class="');

        if (extraction.startsWith('<')) {
            await supabase.from('articles').update({
                content: { en: extraction, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            console.log(`   ✅ V3 CLEAN SUCCESS`);
            fixedCount++;
        } else {
            console.log(`   ⚠️ Failed to find clean HTML start.`);
        }
    }

    console.log(`☢️ Nuclear V3 Complete. Fixed ${fixedCount} articles.`);
}

nuclearOptionV3();
