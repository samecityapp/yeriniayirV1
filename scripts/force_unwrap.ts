
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function forceUnwrap() {
    console.log("🔨 STARTING FORCE UNWRAP...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;

        // Normalize
        if (typeof content === 'object' && content.en) content = content.en;

        if (typeof content !== 'string') continue;

        let originalContent = content;
        let loops = 0;
        let changed = false;

        // Loop until it doesn't look like JSON or we hit limit
        while (loops < 15) {
            content = content.trim();

            // 1. Try Clean Parse
            try {
                const parsed = JSON.parse(content);
                if (parsed.en) {
                    content = parsed.en;
                    changed = true;
                    // console.log(`   Parsed layer ${loops} for ${article.slug}`);
                    loops++;
                    continue;
                }
            } catch (e) {
                // Parse failed. 
            }

            // 2. Try Frankenstein Unwrap (Manual Strip)
            // Look for {"en": " ... "} pattern
            if (content.startsWith('{"en":')) {
                // Check if it ends with } or "}?
                // It's risky to just strip chars, but we must escape chaos.

                // Find start of value: {"en":"VALUE...
                // Skip first 7 chars or so
                let startIdx = content.indexOf(':', 0);
                if (startIdx > -1) {
                    let quoteIdx = content.indexOf('"', startIdx);
                    if (quoteIdx > -1) {
                        // We found the start quote of the value
                        let inner = content.substring(quoteIdx + 1);

                        // Find end: We expect "} at the end, but might be multiple } due to nesting errors
                        // Let's strip the last few chars if they are "} 
                        inner = inner.replace(/\"\}\s*$/, '');

                        // UNESCAPE: This is critical.
                        // \" -> "
                        // \\ -> \
                        // \/ -> /
                        try {
                            inner = inner.replace(/\\"/g, '"');
                            inner = inner.replace(/\\\\/g, '\\');
                            inner = inner.replace(/\\\//g, '/');

                            // Check if result looks better?
                            if (inner.length > 0) {
                                content = inner;
                                changed = true;
                                console.log(`   🧟 Frankenstein peeled layer ${loops} for ${article.slug}`);
                                loops++;
                                continue;
                            }
                        } catch (e) { }
                    }
                }
            } else if (content.startsWith('{\\"en\\":')) {
                // Double escaped case?
                // {\"en\":\"...
                // This effectively means the string ITSELF is content.
                // We should unescape the whole string first?
                content = content.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                changed = true;
                continue;
            }

            // If we are here, we couldn't peel it further
            break;
        }

        // Final sanity check: Does it start with < ?
        // If not, and still starts with {, verify.
        if (content.trim().startsWith('{')) {
            console.log(`⚠️ ${article.slug} STILL starts with {`);
        }

        if (changed) {
            // ONE LAST SURGICAL CLEAN on the result
            // Remove "tr" artifacts that might have been unescaped
            content = content.replace(/,?\s*"tr"\s*:\s*"<p>Content available in English only.<\/p>"\s*\}?$/g, '');
            content = content.replace(/<p>\s*Sıradaki makale:.*?<\/p>/gi, '');

            // Save
            await supabase.from('articles').update({
                content: { en: content, tr: "<p>Content available in English only.</p>" }
            }).eq('id', article.id);
            fixedCount++;
            console.log(`💾 Saved FORCE UNWRAPPED ${article.slug}`);
        }
    }

    console.log(`🎉 Force Unwrap Complete. Updated ${fixedCount} articles.`);
}

forceUnwrap();
