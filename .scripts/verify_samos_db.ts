import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
// ... (Simplifying env loading for brevity, relying on process.env if loaded, or simple parse)
// Actually better to reuse the robust loading from previous script to avoid errors.
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

async function checkSamos() {
    console.log("Checking Samos articles...");

    // 1. Check specific article
    const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', 'samos-island-travel-guide');

    console.log("Article Query Result:", article ? article.length : 0, error || "No Error");
    if (article && article.length > 0) {
        console.log("Article Location:", article[0].location);
        console.log("Article Published:", article[0].is_published);
        console.log("Article DeletedAt:", article[0].deleted_at);
        console.log("Article Title Type:", typeof article[0].title);
        console.log("Article Title:", JSON.stringify(article[0].title));
    }

    // 2. Check search query used by app
    const { data: searchResults, error: searchError } = await supabase
        .from('articles')
        .select('title, location')
        .ilike('location', '%Samos%');

    console.log("Search 'Samos' Result:", searchResults?.length, searchError || "No Error");
}

checkSamos();
