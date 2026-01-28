
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function finalTailClean() {
    console.log("🧹 FINAL TAIL CLEAN...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;
        if (typeof content === 'object' && content.en) content = content.en;

        let extraction = content;
        let original = extraction;

        // The artifact seen: ","tr":"<p>Content available in English only.</p>"}"tr":"<p>Content available in English only.</p>"}
        // It seems repeated or escaped.

        // Strategy: Find the LAST </script> tag or Last valid HTML tag.
        // Everything after that, if it looks like JSON garbage, cut it.

        const scriptEnd = extraction.lastIndexOf('</script>');
        if (scriptEnd > -1) {
            // Check what's after script
            const tail = extraction.substring(scriptEnd + 9);
            if (tail.length < 500 && (tail.includes('"tr":') || tail.includes('\"tr\":'))) {
                extraction = extraction.substring(0, scriptEnd + 9);
            }
        } else {
            // If no script, look for last </p>
            const pEnd = extraction.lastIndexOf('</p>');
            if (pEnd > -1) {
                const tail = extraction.substring(pEnd + 4);
                if (tail.length < 500 && (tail.includes('"tr":') || tail.includes('\"tr\":'))) {
                    extraction = extraction.substring(0, pEnd + 4);
                }
            }
        }

        // Final trimming of non-tag chars just to be safe
        extraction = extraction.trim();
        // If it still ends with " or } or ] dump them
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

    console.log(`🧹 Tail Clean Complete. Fixed ${fixedCount} articles.`);
}

finalTailClean();
