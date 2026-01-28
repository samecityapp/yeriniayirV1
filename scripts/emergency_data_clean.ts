
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function emergencyClean() {
    console.log("🚨 STARTING EMERGENCY DATA CLEANUP 🚨");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) {
        console.error("DB Error:", error);
        return;
    }

    console.log(`Checking ${articles.length} articles...`);

    for (const article of articles) {
        let needsUpdate = false;

        // --- 1. CLEAN TITLE ---
        let cleanTitle = article.title;
        // Handle object at top level
        if (typeof cleanTitle === 'object') {
            cleanTitle = cleanTitle.en || Object.values(cleanTitle)[0] || "";
        }

        // Handle recursive stringification
        let titleLoops = 0;
        while (typeof cleanTitle === 'string' && (cleanTitle.trim().startsWith('{') || cleanTitle.trim().startsWith('"')) && titleLoops < 5) {
            try {
                // Remove potential double encoded quotes
                if (cleanTitle.startsWith('"') && cleanTitle.endsWith('"')) {
                    cleanTitle = JSON.parse(cleanTitle);
                } else {
                    const parsed = JSON.parse(cleanTitle);
                    cleanTitle = parsed.en || parsed;
                }
                titleLoops++;
            } catch (e) {
                break;
            }
        }

        if (JSON.stringify(article.title) !== JSON.stringify(cleanTitle) && cleanTitle !== article.title) {
            // Check if we actually changed it to something cleaner
            if (typeof cleanTitle === 'string' && cleanTitle.length > 5 && !cleanTitle.includes('{"en"')) {
                console.log(`🧹 Fixed Title: ${article.slug}`);
                console.log(`   Old: ${JSON.stringify(article.title).substring(0, 50)}...`);
                console.log(`   New: ${cleanTitle}`);
                needsUpdate = true;
            }
        }

        // --- 2. CLEAN CONTENT ---
        let content = article.content;

        // Unwrap top object
        if (typeof content === 'object' && content.en) {
            content = content.en;
        } else if (typeof content === 'string') {
            // Try parse
            try {
                const parsed = JSON.parse(content);
                if (parsed.en) content = parsed.en;
            } catch (e) { }
        }

        // Recursive String Unwrap (Frankenstein)
        let loops = 0;
        while (typeof content === 'string' && (content.trim().startsWith('{"en"') || content.trim().startsWith('{\\"en"')) && loops < 5) {
            try {
                // Try standard parse first
                const parsed = JSON.parse(content);
                if (parsed.en) content = parsed.en;
            } catch (e) {
                // Brute force strip (Frankenstein Logic)
                let cleaned = content;
                if (cleaned.startsWith('{"en":')) {
                    cleaned = cleaned.substring(6);
                    if (cleaned.startsWith('"')) cleaned = cleaned.substring(1);
                } else if (cleaned.startsWith('{\\"en\\":')) {
                    cleaned = cleaned.substring(9);
                    if (cleaned.startsWith('\\"')) cleaned = cleaned.substring(2);
                    else if (cleaned.startsWith('"')) cleaned = cleaned.substring(1);
                }
                // trailing
                cleaned = cleaned.replace(/(\}|"|\\")+$/g, '');
                // unescape
                cleaned = cleaned.replace(/\\"/g, '"');
                cleaned = cleaned.replace(/\\n/g, ' ');
                content = cleaned;
            }
            loops++;
        }

        // --- 3. SURGICAL REMOVAL OF ARTIFACTS ---
        if (typeof content === 'string') {
            const lenBefore = content.length;

            // Remove lingering JSON keys like ","tr":"..."
            content = content.replace(/"?,"tr":"[^"]*"?}?/g, '');
            content = content.replace(/","tr":"[^"]*"/g, '');
            content = content.replace(/", "tr": "[^"]*"/g, '');

            // Remove control chars
            content = content.replace(/[\x00-\x1F]+/g, ' ');

            // --- 4. FIX BROKEN IMAGE CAPTIONS ---
            // Replace alt="{...}" with alt="Clean Title - View X"
            let viewCount = 1;
            content = content.replace(/alt=["'](\{[^"']+\}|\\"[^"']+\\")["']/g, (match) => {
                return `alt="${cleanTitle} - View ${viewCount++}"`;
            });
            // Also fix captions in figcaption if they look like json
            content = content.replace(/<figcaption[^>]*>([^{<]*\{[^<]+\}[^<]*)<\/figcaption>/g, (match, inner) => {
                return `<figcaption class="text-center text-sm text-gray-500 mt-2 italic">${cleanTitle} - View (Fixed)</figcaption>`;
            });

            if (content.length !== lenBefore || content !== article.content) {
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            console.log(`💾 Updating ${article.slug}...`);
            const { error: upErr } = await supabase
                .from('articles')
                .update({
                    title: { en: cleanTitle, tr: cleanTitle }, // Standardize title as object
                    content: { en: content, tr: "<p>Content available in English only.</p>" }
                })
                .eq('id', article.id);

            if (upErr) console.error("Update failed:", upErr);
        }
    }

    console.log("🏁 DONE.");
}

emergencyClean();
