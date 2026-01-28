
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fixWomen() {
    console.log("🐞 DEBUG FIX: Women Travelling...");
    const slug = 'women-travelling-in-turkey-comfort-tips';

    const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!article) return;

    let content = article.content;
    if (typeof content === 'object' && content.en) content = content.en;

    console.log("OLD Length:", content.length);
    console.log("OLD Tail (50):", content.slice(-50));
    console.log("OLD Image Sample:", content.match(/<img[^>]+>/)?.[0] || "No img");

    let extraction = content;

    // 1. Force Unescape
    // Replace \" with "
    let unescaped = extraction.split('\\"').join('"');
    if (unescaped !== extraction) {
        console.log("✅ Unescape changed content.");
    } else {
        console.log("⚠️ Unescape did NOT change content. Double checking...");
        // Maybe it's not \\" but something else?
    }
    extraction = unescaped;

    // 2. Remove Tail
    // ",\"tr\":\"... Or ","tr":"...
    // Let's index search
    const idx = extraction.indexOf('","tr":');
    if (idx > -1) {
        console.log(`✅ Found '","tr":' at index ${idx}. Slicing...`);
        extraction = extraction.substring(0, idx);
    } else {
        const idx2 = extraction.indexOf('", "tr":');
        if (idx2 > -1) {
            console.log(`✅ Found '", "tr":' at index ${idx2}. Slicing...`);
            extraction = extraction.substring(0, idx2);
        } else {
            // Maybe it's still escaped?
            const idx3 = extraction.indexOf('\",\"tr\":');
            if (idx3 > -1) {
                console.log(`✅ Found escaped '\",\"tr\":' at index ${idx3}. Slicing...`);
                extraction = extraction.substring(0, idx3);
            } else {
                console.log("⚠️ Could not find tr artifact.");
            }
        }
    }

    // 3. Remove script
    const scriptIdx = extraction.indexOf('</script>');
    if (scriptIdx > -1) {
        // Check if it's near end
        if (extraction.length - scriptIdx < 2000) { // arbitrary buffer
            // Actually, we want to KEEP <script> if it is schema?
            // User hates "garbage". 
            // If the script is the schema, we KEEP it but remove what follows.
            // But the tail artifact follows it.
            // If we sliced at tr, we likely cut off the closing } of JSON?
            // Wait. The artifact is: `</script> ... ","tr":...`
            // So if we cut at `","tr":`, we stand with `</script> ... `
            // That is clean enough?
        }
    }

    // 4. Clean trailing garbage chars
    extraction = extraction.trim();
    while (extraction.endsWith('"') || extraction.endsWith('}')) {
        extraction = extraction.slice(0, -1);
        extraction = extraction.trim();
    }

    // 5. Final Image check
    const imgStart = extraction.indexOf('src="');
    if (imgStart === -1) {
        console.log("⚠️ WARNING: No standard src=\" found. Checking for escaped...");
        if (extraction.indexOf('src=\\"') > -1) console.log("Found src=\\\" (Escaped)");
    } else {
        console.log("✅ Found standard src=\"");
    }

    if (extraction !== content) {
        console.log("Updating DB...");
        const { error } = await supabase.from('articles').update({
            content: { en: extraction, tr: "<p>Content available in English only.</p>" }
        }).eq('id', article.id);
        if (!error) console.log("🎉 Saved.");
        else console.error("Error:", error);
    } else {
        console.log("No changes made.");
    }
}

fixWomen();
