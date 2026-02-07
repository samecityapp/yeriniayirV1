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

async function testLookup() {
    const targetSlug = "best-beaches-in-samos-swimming-guide";
    console.log(`Testing lookup for: ${targetSlug}`);

    // 1. Check raw table content first
    console.log("\n--- Raw DB Check ---");
    const { data: allArticles } = await supabase
        .from('articles')
        .select('slug, slug_en')
        .ilike('location', '%Samos%');

    console.log("All Samos Articles (slug, slug_en):");
    console.table(allArticles);

    // 2. Simulate getBySlug
    console.log("\n--- getBySlug Logic Check ---");
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .or(`slug.eq.${targetSlug},slug_en.eq.${targetSlug}`)
            .maybeSingle();

        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Result:", data ? "FOUND" : "NOT FOUND");
            if (data) console.log("Slug found:", data.slug);
        }
    } catch (e) {
        console.error("Exception:", e);
    }
}

testLookup();
