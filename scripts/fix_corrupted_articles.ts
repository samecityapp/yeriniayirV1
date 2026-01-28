import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fixArticles() {
    console.log("🚑 Starting Surgical Fix for Corrupted Articles...");

    const { data: articles, error } = await supabase
        .from('articles')
        .select('slug, content');

    if (error || !articles) {
        console.error("❌ DB Error:", error);
        return;
    }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;
        let originalString = JSON.stringify(content); // For comparison
        let needsUpdate = false;

        // 1. Unwrap Double Encoded JSON or Markdown Blocks
        if (typeof content === 'string') {
            // Check for Markdown block
            if (content.includes('```json')) {
                console.log(`[${article.slug}] Removing Markdown JSON block...`);
                content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
                needsUpdate = true;
            }

            // Try Parsing
            let jsonParsed = false;

            if (content.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(content);
                    // Check schema
                    if (parsed.en || parsed.tr) {
                        console.log(`[${article.slug}] Unwrapped Double-Encoded JSON (Standard).`);
                        content = parsed;
                        jsonParsed = true;
                        needsUpdate = true;
                    } else if (parsed.content) {
                        // Handle { content: "..." } case
                        console.log(`[${article.slug}] Unwrapped Double-Encoded JSON (Found .content).`);
                        content = {
                            en: typeof parsed.content === 'string' ? parsed.content : JSON.stringify(parsed.content),
                            tr: ""
                        };
                        jsonParsed = true;
                        needsUpdate = true;
                    } else {
                        // Valid JSON but unknown schema. Treat as Raw String to be safe? 
                        // Or if we know it should be text, maybe the whole thing is text?
                        // Let's assume if it is JSON but not our schema, we wrap it stringified? 
                        // No, that keeps quotes.
                        // Let's try to see if it has 'title' and 'slug' inside content? 
                        // If so, maybe content is the WHOLE payload.
                        // Let's check keys to decide. 
                        console.log(`[${article.slug}] JSON parsed but unknown schema keys: ${Object.keys(parsed)}. wrapping as EN.`);
                        content = { en: content, tr: "" }; // Wrap the raw string
                        needsUpdate = true;
                        jsonParsed = true;
                    }
                } catch (e) {
                    // Ignore parse error, proceed to Raw String fallback
                }
            }

            if (!jsonParsed) {
                // It's a raw string (e.g. <h1>Title...</h1>). 
                // We assume this is the ENGLISH content.
                console.log(`[${article.slug}] Found Raw String Content. Wrapping in {en, tr}...`);
                content = { en: content, tr: "" };
                needsUpdate = true;
            }
        }

        // If content is now an object (as expected), verify 'en' field
        if (typeof content === 'object' && content !== null) {
            if (content.en && typeof content.en === 'string') {
                let enText = content.en;
                let enUpdated = false;

                // 2. Fix Escaped Newlines (literal \n -> real newline or space)
                // In HTML, \n is whitespace. Literal \n looks bad.
                if (enText.includes('\\n')) {
                    enText = enText.replace(/\\n/g, '\n');
                    enUpdated = true;
                }

                // 3. Remove Prompt Leakage keywords
                const badKeywords = [
                    'hyper-realistic', 'do not pose', 'camera settings', 'f/8', 'ISO 100',
                    'cinematic lighting', '4k', '8k', 'high quality photo of', 'photorealistic',
                    'width:', 'height:', 'aspect ratio', 'style:', 'prompt:'
                ];

                badKeywords.forEach(kw => {
                    const regex = new RegExp(kw, 'gi');
                    if (regex.test(enText)) {
                        console.log(`[${article.slug}] Removing keyword: "${kw}"`);
                        enText = enText.replace(regex, '');
                        enUpdated = true;
                    }
                });

                // 4. Remove Placeholders
                if (enText.includes('<!-- IMAGE_') || enText.includes('[Image')) {
                    console.log(`[${article.slug}] Removing leftover placeholders.`);
                    enText = enText.replace(/<!-- IMAGE_[^>]+-->/g, '')
                        .replace(/\[Image[^\]]+\]/g, '');
                    enUpdated = true;
                }

                // 5. Remove Leaked JSON fragments in text
                // Clean any trailing JSON object structure
                // e.g. {"slug": ...} at the end
                if (enText.includes('{"') || enText.includes('}')) {
                    const jsonDumpRegex = /\s*\{"[a-zA-Z0-9_]+":[\s\S]*\}\s*$/;
                    if (jsonDumpRegex.test(enText)) {
                        console.log(`[${article.slug}] Removing appended JSON dump.`);
                        enText = enText.replace(jsonDumpRegex, '');
                        enUpdated = true;
                    }
                }

                if (enUpdated) {
                    content.en = enText;
                    needsUpdate = true;
                }
            }
        }

        // Perform Update if needed
        if (needsUpdate) {
            const { error: updateError } = await supabase
                .from('articles')
                .update({ content: content })
                .eq('slug', article.slug);

            if (updateError) {
                console.error(`❌ Failed to update ${article.slug}:`, updateError);
            } else {
                console.log(`✅ Fixed: ${article.slug}`);
                fixedCount++;
            }
        }
    }

    console.log(`\n🎉 Repair Complete. Fixed ${fixedCount} articles.`);
}

fixArticles();
