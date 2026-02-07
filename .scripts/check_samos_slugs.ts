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

async function checkSlugs() {
    console.log("Checking Samos article slugs...");

    const { data: articles, error } = await supabase
        .from('articles')
        .select('title, slug, location')
        .eq('location', 'Samos');

    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log(`Found ${articles.length} articles for Samos:`);
    articles.forEach(a => {
        // The content column isn't selected, but title is a JSON object usually.
        // We print it as is.
        console.log(`- Slug: ${a.slug}`);
        console.log(`  Title: ${JSON.stringify(a.title)}`);
    });
}

checkSlugs();
