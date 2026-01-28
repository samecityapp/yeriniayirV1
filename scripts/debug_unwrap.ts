
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function debugUnwrap() {
    const slug = 'driving-in-turkey-as-a-uk-traveller-rules-confidence-tips-what-to-expect';
    console.log(`🐞 Debugging Unwrap for: ${slug}`);

    const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!article) return;

    let current = article.content;

    console.log("--- LAYER 0 (Raw DB Type) ---");
    console.log(typeof current);

    // Manual Unwrap Simulation
    let depth = 0;
    while (depth < 10) {
        depth++;
        console.log(`\n--- LAYER ${depth} ---`);

        let strVal = "";

        if (typeof current === 'object' && current !== null) {
            console.log("Type: Object");
            console.log("Keys:", Object.keys(current));
            if (current.en) {
                console.log("Found .en key, extracting...");
                current = current.en;
            } else {
                console.log("No .en key in object. Stopping.");
                break;
            }
        } else if (typeof current === 'string') {
            console.log("Type: String");
            console.log("Start:", current.substring(0, 50));

            try {
                const parsed = JSON.parse(current);
                console.log("✅ JSON.parse success!");
                current = parsed; // Go to next loop as object
            } catch (e) {
                console.log("❌ JSON.parse failed. This is the final string?");
                // Check if it looks like escaped JSON but failed
                if (current.trim().startsWith('"{')) {
                    console.log("Looks like double quoted string start...");
                }
                break;
            }
        } else {
            console.log("Type: " + typeof current);
            break;
        }
    }

    console.log("\n--- FINAL CONTENT START ---");
    if (typeof current === 'string') {
        console.log(current.substring(0, 100));
    } else {
        console.log(JSON.stringify(current).substring(0, 100));
    }
}

debugUnwrap();
