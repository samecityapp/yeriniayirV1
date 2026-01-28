
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function surgicalClean() {
    console.log("🔪 STARTING SURGICAL CLEANUP...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    console.log(`Processing ${articles.length} articles...`);

    let fixedCount = 0;

    for (const article of articles) {
        let content = (article.content as any).en || article.content;

        // Safety check: must be string
        if (typeof content !== 'string') {
            // force unwrap attempts
            try { content = JSON.parse(content).en || content; } catch (e) { }
            if (typeof content !== 'string') continue;
        }

        let originalContent = content;

        // 1. REMOVE JSON ARTIFACTS (End of string usually)
        // Matches: ","tr":"<p>Content available in English only.</p>"} and variations
        // escaped or unescaped
        content = content.replace(/,?\s*\\?"?,?\s*\\?"?tr\\?"?\s*:\s*\\?"?\s*<p>Content available in English only.<\/p>\\?"?\s*\}?\s*$/g, '');
        // Aggressive cleanup of trailing JSON chars
        content = content.replace(/\}?\"?\}?$/g, ''); // lingering "} at end?

        // 2. REMOVE "Next Article" / "Sıradaki makale"
        content = content.replace(/<p>\s*Sıradaki makale:.*?<\/p>/gi, '');
        content = content.replace(/<p>\s*Next article:.*?<\/p>/gi, '');

        // 3. REMOVE "Last updated"
        content = content.replace(/<p>\s*<em>\s*Last updated:.*?<\/em>\s*.*?<\/p>/gi, '');

        // 4. FIX "Double Prompts" / "Prompt text in body"
        // User said: "görseller altında şimdi 2 tane prompt var"
        // This might mean: <figcaption>...Title...</figcaption> <p>...Title...</p>
        // Let's remove any <p> that looks like a prompt or filename immediately following a figure
        // Or remove any paragraph that matches the article title exactly?
        const title = (typeof article.title === 'string' ? article.title : (article.title as any).en) || "";
        const cleanTitle = title.replace(/[\[\]"]/g, ''); // regex safe

        // Remove <p>Title - View X</p> if it exists (orphan caption)
        const orphanCaptionRegex = new RegExp(`<p>\\s*${cleanTitle.substring(0, 20)}.*?View \\d+.*?<\\/p>`, 'gi');
        content = content.replace(orphanCaptionRegex, '');

        // 5. Clean literal control chars again just in case
        content = content.replace(/\/n\s?/g, ' ');
        content = content.replace(/\\n\s?/g, ' ');

        // 6. Final Trim
        content = content.trim();

        if (content !== originalContent) {
            // Update DB
            const { error: upErr } = await supabase
                .from('articles')
                .update({
                    content: { en: content, tr: "<p>Content available in English only.</p>" }
                })
                .eq('id', article.id);

            if (!upErr) {
                console.log(`✅ Fixed: ${article.slug}`);
                fixedCount++;
            }
        }
    }

    console.log(`\n🎉 Surgery Complete. Fixed ${fixedCount} articles.`);
}

surgicalClean();
