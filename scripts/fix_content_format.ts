import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const slugs = [
    'fethiyede-nerede-kalinir-bolge-secim-rehberi',
    'fethiye-ilk-kez-gidenler-icin-3-5-7-gunluk-hazir-rota',
    'fethiyede-aracsiz-arabasiz-tatil-plani-dolmus-taksi-yuruyus',
    'oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi',
    'kelebekler-vadisi-rehberi-fethiye-ulasim'
];

async function fixContent() {
    for (const slug of slugs) {
        console.log(`\n--- Checking content format for: ${slug} ---`);

        const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
        if (error || !data) {
            console.log("ERROR:", error);
            continue;
        }

        const contentObj = data.content;
        let trContent: string;

        if (typeof contentObj === 'object' && contentObj?.tr) {
            trContent = contentObj.tr;
        } else if (typeof contentObj === 'string') {
            trContent = contentObj;
        } else {
            console.log("Unknown format");
            continue;
        }

        // Check if the content starts with {"tr":" which means it's double-wrapped
        let cleanedContent = trContent;

        // Remove leading/trailing {"tr":"...\n and similar artifacts
        if (cleanedContent.startsWith('{"tr":"')) {
            // It's double-stringified. Parse it out
            try {
                const parsed = JSON.parse(cleanedContent);
                if (parsed.tr) {
                    cleanedContent = parsed.tr;
                    console.log("  Fixed double-stringified content");
                }
            } catch (e) {
                // Manual strip
                cleanedContent = cleanedContent.replace(/^\{"tr":"/, '').replace(/"\}$/, '');
                console.log("  Manually stripped JSON wrapper");
            }
        }

        // Remove literal \n that should be actual newlines
        cleanedContent = cleanedContent.replace(/\\n/g, '\n');

        // Remove escaped quotes that shouldn't be there  
        cleanedContent = cleanedContent.replace(/\\"/g, '"');

        // Check if anything changed
        if (cleanedContent !== trContent) {
            console.log(`  Content was dirty, cleaning...`);

            // Build proper content object
            let contentUpdate: any;
            if (typeof contentObj === 'object') {
                contentUpdate = { ...contentObj, tr: cleanedContent };
            } else {
                contentUpdate = { tr: cleanedContent };
            }

            const { error: updateError } = await supabase.from('articles').update({
                content: contentUpdate
            }).eq('id', data.id);

            if (updateError) {
                console.error(`  ❌ Update failed:`, updateError);
            } else {
                console.log(`  ✅ Content cleaned and saved`);
            }
        } else {
            console.log(`  Content is clean ✅`);
        }
    }
    console.log("\n🎉 Content cleanup complete!");
}

fixContent();
