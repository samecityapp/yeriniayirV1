
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function diagnose() {
    console.log("🔍 Scanning for specific corruption patterns...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) {
        console.error(error);
        return;
    }

    let jsonArtifactCount = 0;
    let nextArticleCount = 0;
    let doubleCaptionCount = 0;

    for (const article of articles) {
        let content = (article.content as any).en || article.content;
        if (typeof content !== 'string') continue;

        // Check for JSON artifacts
        // pattern: \", \"tr\" or ","tr"
        if (content.match(/\\",\\s*\\"tr\\":/) || content.match(/","tr":/) || content.match(/\\", \\"tr\\":/)) {
            console.log(`\n[JSON ARTIFACT] ${article.slug}`);
            const match = content.match(/.{0,50}(\\",\\s*\\"tr\\":|","tr":).{0,50}/);
            if (match) console.log(`   Context: ...${match[0]}...`);
            jsonArtifactCount++;
        }

        // Check for "Sıradaki makale"
        if (content.match(/Sıradaki makale/i) || content.match(/Next article/i)) {
            console.log(`\n[NEXT ARTICLE] ${article.slug}`);
            const match = content.match(/.{0,50}(Sıradaki makale|Next article).{0,50}/i);
            if (match) console.log(`   Context: ...${match[0]}...`);
            nextArticleCount++;
        }

        // Check for "Last updated"
        if (content.match(/Last updated:/i)) {
            // console.log(`[LAST UPDATED] ${article.slug}`); 
            // Common enough, maybe not error, but check if user wants it removed? 
            // User said "gereksiz harfler yazılar vs var", implying cleanup.
        }

        // Check for potential double strings/captions around images
        // Look for multiple captions?
    }

    console.log(`\n--- SUMMARY ---`);
    console.log(`JSON Artifacts identified: ${jsonArtifactCount}`);
    console.log(`'Next Article' text identified: ${nextArticleCount}`);
}

diagnose();
