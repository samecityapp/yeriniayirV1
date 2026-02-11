
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
    console.log("🧹 Starting 'N' Artifact Cleanup...");

    for (const slug of TARGET_SLUGS) {
        const { data: article } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .single();

        if (!article) continue;

        console.log(`🔨 Cleaning artifacts in ${slug}...`);

        let content = typeof article.content === 'string' ? article.content : (article.content as any).en || "";

        // Patterns to fix:
        // "nnnnnnn" -> "\n\n"
        // " nn " -> " " or "\n"

        // Regex to find sequences of 'n' that are 2 or more, surrounded by spaces or newlines?
        // Or just excessive 'n's?
        // Browser said: `nnnnnnn What evidence`

        // Replace 3+ 'n's with double newline
        let cleaned = content;

        // Safety: ensure we don't break words like "planning" "scanner".
        // Words usually don't have 3 'n's. 
        // "anniversary" has 2. "planning" has 2. "beginning" has 2.
        // So 3 'n's is safe to target.

        cleaned = cleaned.replace(/n{3,}/g, '\n\n');

        // Target: `\n n \n` type patterns?
        // Browser said "found lone Ns".
        // Replace " n " with " "? 
        // " an " is valid. " in " is valid. " on " is valid.
        // " n " is NOT valid in English usually (unless 'n' variable).
        cleaned = cleaned.replace(/\s+n\s+/g, ' ');

        // Target: `nn` at start of formatting?
        // Browser: `nn UK-friendly tip`
        // Likely `\n\n` became `nn`.
        // Replace `nn` with `\n` IF it's likely trash?
        // But "planning" has `nn`. We MUST rely on word boundaries.
        // `\bnn\b` -> `\n`? No, that matches "inn".
        // We need to look for ` nn ` (spaces around).
        cleaned = cleaned.replace(/\s+nn\s+/g, '\n\n');

        // Also check if they are attached to words?
        // The artifacts might be `...end.nnnnStart...`
        // This would be matched by `n{3,}`.

        // Let's also enforce Paragraph spacing again.
        cleaned = cleaned.replace(/<\/p>\s*n+\s*<p>/g, '</p>\n<p>'); // Remove 'n's between p tags

        // Fix any mangled tags
        cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n'); // Convert br to newline just in case

        // Update
        // Use STRING update since we are fixing a string mess.
        const { error } = await supabase
            .from('articles')
            .update({
                content: cleaned,
                updated_at: new Date().toISOString()
            })
            .eq('id', article.id);

        if (error) {
            console.error(`❌ Failed to update ${slug}:`, error);
        } else {
            console.log(`✨ Cleaned 'n' artifacts from ${slug}`);
        }
    }
}

run();
