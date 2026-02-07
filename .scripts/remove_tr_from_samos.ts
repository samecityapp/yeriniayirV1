import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env
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

const slugs = [
    "samos-island-travel-guide",
    "where-to-stay-in-samos-best-areas",
    "best-beaches-in-samos-15-beaches"
];

async function removeTurkishContent() {
    console.log("Removing Turkish content from Samos articles...");

    for (const slug of slugs) {
        const { data: article, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !article) {
            console.error(`Error fetching ${slug}:`, error);
            continue;
        }

        // Helper to remove 'tr' key from object or JSON string
        const removeTr = (field: any) => {
            let obj = field;
            if (typeof field === 'string') {
                try {
                    obj = JSON.parse(field);
                } catch (e) {
                    // If it's a plain string, we can't really "remove tr" unless we know it's TR content.
                    // But our data is structure {"en": ..., "tr": ...}
                    return field;
                }
            }

            if (obj && typeof obj === 'object') {
                if ('tr' in obj) {
                    delete obj.tr;
                }
                // Ensure 'en' is present
                if (!obj.en && Object.keys(obj).length > 0) {
                    // If for some reason en is missing but we have others? Unlikely.
                }
            }
            return obj;
        };

        const updates = {
            title: removeTr(article.title),
            content: removeTr(article.content),
            meta_description: removeTr(article.meta_description),
            updated_at: new Date().toISOString()
        };

        // Explicitly set language tag to 'en' as a safeguard
        // (We might need to add this column if it exists, or just rely on title structure)
        // The previous migration file didn't show a 'language' column, but localization.ts checks for it.
        // Let's check if we can update it.

        // Actually, localization.ts logic: 
        // 1. article.language === lang (if exists)
        // 2. article.title[lang] exists

        // So removing 'tr' from title is sufficient.

        console.log(`Updating ${slug}...`);
        const { error: updateError } = await supabase
            .from('articles')
            .update(updates)
            .eq('id', article.id);

        if (updateError) {
            console.error(`Failed to update ${slug}:`, updateError);
        } else {
            console.log(`Successfully removed TR from ${slug}`);
        }
    }
}

removeTurkishContent();
