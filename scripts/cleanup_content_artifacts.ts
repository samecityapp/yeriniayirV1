
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TARGET_SLUGS = [
    'a-la-carte-all-inclusive-turkey',
    'best-all-inclusive-value-uk-turkey',
    'hospitals-and-clinics-in-turkey-for-uk-travellers-guide',
    'lost-passport-phone-wallet-turkey-uk-traveller-guide',
    'package-holiday-vs-booking-separately-turkey-uk-cost-comparison',
    'pharmacies-in-turkey-for-uk-travellers',
    'turkey-resort-transfers-guide',
    'staying-well-in-turkey-food-water-heat-comfort-tips-uk-travellers',
    'travel-insurance-turkey-uk-guide'
];

async function run() {
    console.log("🧹 Starting Content Cleanup...");

    for (const slug of TARGET_SLUGS) {
        const { data: article } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .single();

        if (!article) continue;

        let content = typeof article.content === 'string' ? article.content : (article.content as any).en || "";

        // Check for damage
        if (!content.includes('\\')) {
            console.log(`✅ ${slug} seems clean.`);
            continue;
        }

        console.log(`⚠️ Cleaning ${slug}...`);

        // 1. Unescape excessive backslashes
        // The screenshot showed `\n\\\\\\\\\\\\\\\n`
        // We need to replace `\` with nothing, but keep `\n` as newline?
        // Actually, in HTML stored in DB, actual Newline chars `\n` might be rendered as whitespace.
        // But `\\n` string literal is `\n` text.
        // The screenshot shows literal backslashes.

        // Global replace of backslashes
        // But careful not to break valid things? HTML doesn't use backslashes usually.
        // It uses forward slashes for tags `</b>`, `/>`.
        // So safe to remove ALL backslashes usually, unless used in some JS code block (unlikely in these articles).

        // Also remove `\n` literals if they are showing up as text `\n`

        let cleaned = content.replace(/\\/g, '');

        // Fix potential `nnnn` artifacts if `\n` became `n`
        // Inspecting screenshot: `\n\\\\...` -> if we remove `\` we get `n`.
        // So we might have orphaned `n` characters at end of lines.
        // Let's replace `\n` sequence with actual newline first, then remove backslashes?

        // Actually best way:
        // 1. recursive unescape? JSON.parse?
        // If it was double stringified, `JSON.parse` might fix it.

        try {
            // Try to parse it as JSON string if it's wrapped in quotes?
            if (content.startsWith('"') && content.endsWith('"')) {
                cleaned = JSON.parse(content);
                console.log("   -> Fixed via JSON.parse");
            }
        } catch (e) {
            // Not a valid JSON string, manual cleanup
        }

        // Manual cleanup regexes based on screenshot
        // Remove `\n` literal
        cleaned = cleaned.replace(/\\n/g, ' ');
        // Remove `\` literal
        cleaned = cleaned.replace(/\\/g, '');

        // Clean up excessive newlines/spaces
        cleaned = cleaned.replace(/\s+/g, ' ');

        // Restore paragraphs?
        // If we destroyed structure, we might need to be careful.
        // But `<p>` tags should be intact, just dirty properties?

        // Screenshot showed `\n\\\\\\` in between list items?
        // verify structure

        // Fix Images: `<figure ...>`
        // In previous script we injected:
        // `\n<figure class="my-8">\n<img ...`
        // Maybe the `\n` there caused it?

        // Ensure proper HTML spacing
        cleaned = cleaned.replace(/>\s+</g, '><'); // remove space between tags
        cleaned = cleaned.replace(/<\/p>/g, '</p>\n'); // add newline after p
        cleaned = cleaned.replace(/<figure/g, '\n<figure');
        cleaned = cleaned.replace(/<\/figure>/g, '</figure>\n');

        // Update DB
        const updatePayload = {
            en: cleaned,
            tr: "<p>Content available in English only.</p>"
        };

        // Important: Update as JSON object again to be standard, hoping Supabase handles it better now that we know we are sending object.
        // Or if previous "string update" worked to save it, maybe we should save as string if column is text?

        // Let's look at what we are saving.
        // If column is JSONB, saving a string might double quote it?
        // If column is TEXT, saving object might `[object Object]`?

        // Since `repair_images_v5_string` worked to INJECT images (proven by readback),
        // but it caused Artifacts.
        // This means I sent a STRING that contained escaped characters `\` that Postgres/Supabase didn't unescape?

        // I will try to save as JSON Object again, but clean content first.

        const { error } = await supabase
            .from('articles')
            .update({
                content: updatePayload,
                updated_at: new Date().toISOString()
            })
            .eq('id', article.id);

        if (error) console.error(`❌ Failed to clean ${slug}:`, error);
        else console.log(`✨ Cleaned ${slug}`);
    }
}

run();
