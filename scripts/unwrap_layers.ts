
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function unwrapLayers() {
    console.log("🧅 UNWRAPPING LAYERS...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    for (const article of articles) {
        let content = article.content;
        let changed = false;

        // Start with whatever we have
        let currentString = "";

        // Normalize to the inner string
        if (typeof content === 'object' && content.en) {
            currentString = content.en;
        } else if (typeof content === 'string') {
            currentString = content;
        }

        // Loop to unwrap
        let loops = 0;
        while (loops < 10) {
            currentString = currentString.trim();

            // Case 1: JSON String {"en": "..."}
            if (currentString.startsWith('{"en"')) {
                try {
                    const parsed = JSON.parse(currentString);
                    if (parsed.en) {
                        currentString = parsed.en;
                        console.log(`   Unwrapped JSON layer for ${article.slug}`);
                        changed = true;
                        continue;
                    }
                } catch (e) { }
            }

            // Case 2: Escaped JSON String "{\"en\"..." at start (common in log output but maybe in DB too)
            if (currentString.startsWith('{\\"en\\"')) {
                // Try to manual unescape if parse fails? 
                // Usually JSON.parse handles the string itself.
            }

            // Case 3: It has the "tr": garbage at the end but starts with <
            // This was handled by surgical clean, but let's double check.

            break; // If we didn't continue, we are done
            loops++;
        }

        // Final consistency check
        if (currentString.trim().startsWith('{')) {
            console.log(`⚠️ Warning: ${article.slug} still starts with { after unwrapping.`);
            // Force brute parse
            try {
                const parsed = JSON.parse(currentString);
                if (parsed.en) {
                    currentString = parsed.en;
                    changed = true;
                }
            } catch (e) { }
        }

        // If we extracted a better string, save it
        if (changed || content.en !== currentString) {
            // Check if we lost data? 
            if (currentString.length < 50) {
                console.error(`❌ Skipping ${article.slug}, result too short: ${currentString}`);
                continue;
            }

            console.log(`💾 Saving unwrapped ${article.slug}...`);
            await supabase.from('articles').update({
                content: { en: currentString, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
        }
    }
    console.log("Done.");
}

unwrapLayers();
