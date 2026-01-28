
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function finalPolish() {
    console.log("✨ FINAL POLISH (Removing tail garbage)...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;
        if (typeof content === 'object' && content.en) content = content.en;

        let extraction = content;
        let original = extraction;

        // 1. Remove the stubborn "tr": artifact
        // Convert to single line for regex safety?
        // match ", "tr": ... to end
        extraction = extraction.replace(/",\s*"tr":.*$/s, ''); // s flag for dotAll? JS regex support varies.
        extraction = extraction.replace(/",\s*"tr":[\s\S]*$/, ''); // safer dotAll

        // Match just "tr": ... if comma missing
        extraction = extraction.replace(/"tr":[\s\S]*$/, '');

        // 2. Remove trailing quotes or brackets left over
        // e.g. "" or "
        extraction = extraction.replace(/"+$/g, '');
        extraction = extraction.replace(/}+$/g, '');
        extraction = extraction.replace(/]+$/g, '');

        // 3. Remove </script> garbage if it is at the very end and malformed
        // The one we saw in log: </script>    </p></p></p></p>
        // We probably want to keep the script but remove the Ps? 
        // Or is the script the JSON-LD schema? Yes.
        // Let's just trim whitespace.
        extraction = extraction.trim();

        if (extraction !== original) {
            await supabase.from('articles').update({
                content: { en: extraction, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            fixedCount++;
        }
    }

    console.log(`✨ Polish Complete. Fixed ${fixedCount} articles.`);
}

finalPolish();
