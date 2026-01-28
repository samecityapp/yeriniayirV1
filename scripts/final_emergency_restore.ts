
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function emergencyRestore() {
    console.log("🚑 EMERGENCY RESTORE (Fixing __TEMP_QUOTE__)...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;

        // Normalize checking
        let strToCheck = "";
        if (typeof content === 'object' && content.en) strToCheck = content.en;
        else if (typeof content === 'string') strToCheck = content;

        let extraction = strToCheck;
        let original = extraction;

        // 1. Fix __TEMP_QUOTE__ disaster
        // It seems we have `\\__TEMP_QUOTE__` or just `__TEMP_QUOTE__`
        // We want to replace it with "
        extraction = extraction.replace(/\\\\__TEMP_QUOTE__/g, '"');
        extraction = extraction.replace(/\\__TEMP_QUOTE__/g, '"');
        extraction = extraction.replace(/__TEMP_QUOTE__/g, '"');

        // 2. Fix Backslashes
        // \\" -> "
        extraction = extraction.replace(/\\"/g, '"');
        // \\ -> \
        // cleaning up messy paths: src="\\/images... -> src="/images...
        extraction = extraction.replace(/src="\\+\//g, 'src="/');
        extraction = extraction.replace(/alt="\\+/g, 'alt="');

        // 3. Remove the persistent JSON tail artifact
        // `","tr":"<p>Content available in English only.</p>"}`
        // `","tr":"...`
        extraction = extraction.replace(/","tr":"<p>Content available in English only.<\/p>"}/g, '');
        extraction = extraction.replace(/","tr":".*$/g, '');

        // 4. Remove </script> at the end if it exists (seen in logs)
        extraction = extraction.replace(/<\/script>\s*$/g, '');

        // 5. Final cleanliness check
        // Trim trailing } 
        extraction = extraction.replace(/}\s*$/g, '');
        extraction = extraction.trim();

        if (extraction !== original) {
            await supabase.from('articles').update({
                content: { en: extraction, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            // console.log(`   ✅ Restored: ${article.slug}`);
            fixedCount++;
        }
    }

    console.log(`🚑 Restore Complete. Fixed ${fixedCount} articles.`);
}

emergencyRestore();
