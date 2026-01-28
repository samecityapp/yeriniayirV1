
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fixContentQuality() {
    console.log("🧹 Starting Content Quality Fixer...");

    // Fetch all articles
    const { data: articles, error } = await supabase.from('articles').select('*');

    if (error || !articles) {
        console.error("❌ DB Error:", error);
        return;
    }

    console.log(`Found ${articles.length} articles.`);

    for (const article of articles) {
        let needsUpdate = false;
        let contentObj = article.content;

        // 1. Fix Double Encoding / Bad Structure
        // Check if content is string (should be object)
        if (typeof contentObj === 'string') {
            try {
                contentObj = JSON.parse(contentObj);
                needsUpdate = true;
                console.log(`🔹 parsed string content for ${article.slug}`);
            } catch (e) {
                // If not json, maybe it's raw html? assume it is en
                contentObj = { en: contentObj };
                needsUpdate = true;
            }
        }

        // Ensure contentObj has .en
        if (!contentObj.en) {
            console.warn(`⚠️ Article ${article.slug} has no 'en' key.`);
            continue;
        }

        let html = contentObj.en;

        // Check for double/triple encoding inside .en
        // Loop until it no longer looks like a JSON object wrapper with an 'en' key
        let attempts = 0;
        while (typeof html === 'string' && attempts < 5) {
            const trimmed = html.trim();
            if (trimmed.startsWith('{"en":') || trimmed.startsWith('{\\"en\\":')) {
                try {
                    // Sanitize bad control characters (raw newlines, tabs, etc) that break JSON.parse
                    // We replace them with space. Matches ASCII 0-31.
                    const sanitized = html.replace(/[\x00-\x1F]+/g, ' ');
                    const inner = JSON.parse(sanitized);
                    if (inner.en) {
                        html = inner.en;
                        needsUpdate = true;
                        console.log(`🔹 Unwrapped layer ${attempts + 1} for ${article.slug}`);
                        attempts++;
                        continue; // check again
                    }
                } catch (e) {
                    // Parse failed? Try Frankenstein Cleaner (Brute Force Prefix Removal)
                    let cleaned = html;
                    let modified = false;
                    let working = true;
                    while (working) {
                        if (cleaned.startsWith('{"en":')) {
                            cleaned = cleaned.substring(6);
                            if (cleaned.startsWith('"')) cleaned = cleaned.substring(1);
                            modified = true;
                        } else if (cleaned.startsWith('{\\"en\\":')) {
                            cleaned = cleaned.substring(9);
                            if (cleaned.startsWith('\\"')) cleaned = cleaned.substring(2);
                            else if (cleaned.startsWith('"')) cleaned = cleaned.substring(1);
                            modified = true;
                        } else {
                            working = false;
                        }
                    }

                    if (modified) {
                        // Cleanup trailing
                        cleaned = cleaned.replace(/(\}|"|\\")+$/g, '');
                        // Unescape
                        cleaned = cleaned.replace(/\\"/g, '"');
                        cleaned = cleaned.replace(/\\n/g, ' ');
                        html = cleaned;
                        needsUpdate = true;
                        console.log(`🧟 Frankenstein Cleaned ${article.slug}`);
                        break; // Assume it's clean enough now, or next loop catch it?
                        // Actually break loop to save
                    } else {
                        break; // Nothing more to do
                    }
                }
            }
            break; // stop if pattern doesn't match
        }

        // 2. Fix Formatting Glitches (/n, \n, \\n)
        let oldHtml = html;

        // Replace literal "\n" strings (which render as \n on screen)
        // In JS string, looking for literal backslash then n -> "\\n" regex
        html = html.replace(/\\n/g, ' ');

        // Replace literal "/n" (user mentioned this specifically)
        html = html.replace(/\/n/g, ' ');

        // Replace literal \r
        html = html.replace(/\\r/g, ' ');

        // Remove newlines in the string which might be causing issues? 
        // Actually real newlines are fine in HTML source, but if we want to be safe:
        // html = html.replace(/\n/g, ' '); 

        if (html !== oldHtml) {
            needsUpdate = true;
            console.log(`🔹 Cleaned formatting characters for ${article.slug}`);
        }

        // 3. Save if needed
        if (needsUpdate) {
            contentObj.en = html;
            // Also ensure tr exists
            if (!contentObj.tr) contentObj.tr = "<p>Content available in English only.</p>";

            const { error: updateError } = await supabase
                .from('articles')
                .update({ content: contentObj })
                .eq('id', article.id);

            if (updateError) {
                console.error(`❌ Failed to update ${article.slug}:`, updateError);
            } else {
                console.log(`✅ Fixed ${article.slug}`);
            }
        }
    }

    console.log("🏁 Fix Complete.");
}

fixContentQuality();
