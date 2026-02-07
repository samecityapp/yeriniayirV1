import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
let envVars: Record<string, string> = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envVars = envContent.split('\n').reduce((acc, line) => {
        if (line.startsWith('#') || !line.trim()) return acc;
        const firstEquals = line.indexOf('=');
        if (firstEquals !== -1) {
            const key = line.substring(0, firstEquals).trim();
            let value = line.substring(firstEquals + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string>);
} catch (e) { }

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

const MAPPINGS = [
    {
        // Search by PARTIAL title or OLD slug to find the row
        search: "Best Beaches in Samos",
        newSlug: "best-beaches-in-samos-swimming-guide"
    },
    {
        search: "Samos Island Travel Guide",
        newSlug: "samos-travel-guide-places-to-visit"
    },
    {
        search: "Where to Stay in Samos",
        newSlug: "where-to-stay-in-samos-best-areas-hotels"
    },
    {
        search: "Samos Itinerary",
        newSlug: "samos-itinerary-3-5-7-days"
    },
    {
        search: "How to Get to Samos",
        newSlug: "how-to-get-to-samos-flights-ferries"
    },
    {
        search: "Top Things to Do in Samos",
        newSlug: "top-things-to-do-in-samos-sights-villages"
    },
    {
        search: "Samos Travel Tips",
        newSlug: "samos-travel-tips-costs-weather-packing"
    }
];

async function fixSlugs() {
    console.log("Fixing Samos slugs...");

    for (const item of MAPPINGS) {
        console.log(`Processing: ${item.search} -> ${item.newSlug}`);

        // Find the article first
        const { data: articles, error } = await supabase
            .from('articles')
            .select('*')
            .ilike('title', `%${item.search}%`);

        if (error || !articles || articles.length === 0) {
            console.error(`  Could not find article for "${item.search}"`);
            continue;
        }

        const article = articles[0]; // Assuming first match is correct
        console.log(`  Found article: ${article.slug}`);

        // Update slug and slug_en
        const { error: updateError } = await supabase
            .from('articles')
            .update({
                slug: item.newSlug,
                slug_en: item.newSlug // Sync them to be safe
            })
            .eq('id', article.id);

        if (updateError) {
            console.error(`  Error updating: ${updateError.message}`);
        } else {
            console.log(`  Updated successfully to: ${item.newSlug}`);
        }
    }

    console.log("Done.");
}

fixSlugs();
