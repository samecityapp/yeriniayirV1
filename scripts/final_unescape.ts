
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function finalUnescape() {
    console.log("🔓 FINAL UNESCAPE & CLEAN...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;
        if (typeof content === 'object' && content.en) content = content.en;

        let extraction = content;
        let original = extraction;

        // 1. GLOBAL UNESCAPE
        // We see \" in logs, which means literal backslash + quote
        // Replace \\" with "
        let loops = 0;
        let diff = true;
        while (loops < 5 && diff) {
            let prev = extraction;
            extraction = extraction.replace(/\\"/g, '"');
            extraction = extraction.replace(/\\\\/g, '\\');
            if (extraction === prev) diff = false;
            loops++;
        }

        // 2. Fix Image Paths specific breakage if any left
        // src="\/images -> src="/images
        extraction = extraction.replace(/src="\\+\//g, 'src="/');

        // 3. Remove Title/Next Article Artifacts (Clean HTML)
        extraction = extraction.replace(/,?\s*"tr":.*$/s, '');
        extraction = extraction.replace(/,?\s*"tr":[\s\S]*$/, '');
        extraction = extraction.replace(/"tr":[\s\S]*$/, '');

        // 4. Remove trailing quotes or brackets unique to this JSON mess
        extraction = extraction.replace(/"+$/g, '');
        extraction = extraction.replace(/}+$/g, '');
        extraction = extraction.replace(/]+$/g, '');

        // 5. Trim
        extraction = extraction.trim();

        if (extraction !== original) {
            await supabase.from('articles').update({
                content: { en: extraction, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            fixedCount++;
        }
    }

    console.log(`🔓 Unescape Complete. Fixed ${fixedCount} articles.`);
}

finalUnescape();
