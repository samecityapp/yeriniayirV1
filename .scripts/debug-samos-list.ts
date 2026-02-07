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

async function doesArticleSupportLang(article: any, lang: string = 'tr'): Promise<boolean> {
    if (article.language) return article.language === lang;
    if (article.title && typeof article.title === 'object') {
        const supports = !!(article.title as any)[lang];
        console.log(`Checking article ${article.slug}: Title is object. Key [${lang}] exists? ${supports}`);
        return supports;
    }
    if (typeof article.title === 'string') return lang === 'tr';
    return false;
}

async function debugList() {
    const location = "Samos";
    const lang = "en";

    console.log(`Querying for location: %${location}%`);

    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .ilike('location', `%${location}%`)
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('published_at', { ascending: false });

    if (error) {
        console.error("DB Error:", error);
        return;
    }

    console.log(`Found ${data?.length} raw articles.`);

    if (data && data.length > 0) {
        for (const art of data) {
            console.log(`- Article: ${art.slug}, Location: ${art.location}`);
            console.log(`  - Title Type: ${typeof art.title}`);
            console.log(`  - Title Value: ${JSON.stringify(art.title)}`);
            const supported = await doesArticleSupportLang(art, lang);
            console.log(`  - Supports ${lang}? ${supported}`);
        }
    }
}

debugList();
