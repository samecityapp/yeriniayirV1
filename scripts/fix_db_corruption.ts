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
    'kelebekler-vadisi-rehberi-fethiye-ulasim',
    'fethiye-tekne-turu-secme-rehberi',
    'fethiyede-en-iyi-gun-batimi-noktalari-sunset',
    'saklikent-kanyonu-gezi-rehberi-fethiye-selale',
    'tlos-antik-kenti-yakapark-gizlikent-fethiye-selale-rotasi',
    'likya-yolu-fethiye-baslangic-parkurlari-rota',
    'fethiyede-en-iyi-plaj-ve-koy-secimi',
    'fethiyeye-ne-zaman-gidilir-hava-durumu',
    'fethiyede-cocukla-tatil-kisabir-rehber',
    'fethiye-butce-planlayici',
    'fethiye-icerik-fotograf-rotasi-instagram'
];

async function fixAndClean() {
    console.log("Starting DB Formatting Fix...");
    for (const slug of slugs) {
        const { data, error } = await supabase.from('articles').select('id, content').eq('slug', slug).single();
        if (error || !data) {
            console.error("Skipping", slug, error);
            continue;
        }

        let raw = data.content;

        // Recursively unpack multiple layers of JSON stringification
        while (typeof raw === 'string') {
            try {
                raw = JSON.parse(raw);
            } catch (e) {
                // If JSON parse fails but it looks like a stringified JSON object
                if (raw.startsWith('{"tr":"')) {
                    raw = { tr: raw.replace(/^\{"tr":"/, '').replace(/"\}$/, '') };
                } else {
                    break;
                }
            }
        }

        let htmlStr = '';
        if (typeof raw === 'object' && raw?.tr) {
            htmlStr = raw.tr;
        } else if (typeof raw === 'string') {
            htmlStr = raw;
        } else {
            console.log("Could not extract HTML for", slug);
            continue;
        }

        // Deep cleaning of escaped newlines and escaped quotes
        htmlStr = htmlStr.replace(/\\\\n/g, '\n');
        htmlStr = htmlStr.replace(/\\n/g, '\n');
        htmlStr = htmlStr.replace(/\\\\"/g, '"');
        htmlStr = htmlStr.replace(/\\"/g, '"');

        // In case there's another layer of parsing needed inside the string:
        // E.g., "{\"tr\":\n..."
        if (htmlStr.trim().startsWith('{"tr":')) {
            try {
                const innerObj = JSON.parse(htmlStr);
                if (innerObj.tr) htmlStr = innerObj.tr;
            } catch (e) {
                htmlStr = htmlStr.replace(/^\{"tr":\s*"/, '').replace(/"\}$/, '');
            }
            htmlStr = htmlStr.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\\\"/g, '"').replace(/\\"/g, '"');
        }

        const updateObj = { tr: htmlStr };

        // Log a snippet to confirm
        console.log(`\n--- FIXED: ${slug} ---`);
        console.log(htmlStr.substring(0, 100).replace(/\n/g, ' '));

        const { error: updateError } = await supabase.from('articles').update({ content: updateObj }).eq('id', data.id);
        if (updateError) {
            console.error("Update failed for", slug, updateError);
        } else {
            console.log("==> DB Updated Successfully.");
        }
    }
    console.log("\n✅ ALL ARTICLES FIXED.");
}

fixAndClean();
