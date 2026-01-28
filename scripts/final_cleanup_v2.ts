
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function nuclearCleanV2() {
    console.log("☢️ NUCLEAR CLEAN V2 (Recursive Unescape + Polish)...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;
        if (typeof content === 'object' && content.en) content = content.en;

        if (typeof content !== 'string') continue;

        let extraction = content;
        const original = extraction;

        // 1. RECURSIVE UNESCAPE
        let loops = 0;
        let stable = false;
        while (!stable && loops < 10) {
            let prev = extraction;
            extraction = extraction.replace(/\\"/g, '"');
            extraction = extraction.replace(/\\\\/g, '\\');

            // Fix double encoded unicode if any
            extraction = extraction.replace(/\\u003c/gi, '<');

            if (extraction === prev) stable = true;
            loops++;
        }

        // 2. Fix Broken Image Paths (Common side effect)
        // src="\/images -> src="/images
        extraction = extraction.replace(/src="\\+\//g, 'src="/');
        // src="/images... -> Good.

        // 3. POLISH: Remove " - View X" from alt and figcaption
        // Since we are unescaped now, specific regex should work.
        extraction = extraction.replace(/ - View \d+"/g, '"'); // For alt="..."
        extraction = extraction.replace(/ - View \d+<\/figcaption>/g, '</figcaption>');

        // 4. CLEAN TAIL: Remove "tr": garbage
        // Since unescaped, it should look like ","tr":"...
        const tailMarkers = [
            '","tr":',
            '", "tr":',
            '","tr" :',
            '","tr" :'
        ];

        for (const marker of tailMarkers) {
            const idx = extraction.lastIndexOf(marker);
            if (idx > -1 && idx > extraction.length - 1000) {
                extraction = extraction.substring(0, idx);
            }
        }

        // 5. REMOVE </script> if it's the last tag followed by garbage
        // We actually want to keep the script end tag, but remove anything AFTER it if it isn't HTML
        // But the previous tail cut might have left dangling chars

        // 6. Final Trim
        extraction = extraction.trim();
        while (extraction.length > 0 && (extraction.endsWith('"') || extraction.endsWith('}') || extraction.endsWith(']'))) {
            extraction = extraction.slice(0, -1);
            extraction = extraction.trim();
        }

        if (extraction !== original) {
            await supabase.from('articles').update({
                content: { en: extraction, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            fixedCount++;
        }
    }

    console.log(`☢️ Clean Complete. Fixed ${fixedCount} articles.`);
}

nuclearCleanV2();
