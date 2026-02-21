import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const slugs = [
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

async function diagnose() {
    let totalOk = 0;
    let totalMissing = 0;

    for (const slug of slugs) {
        console.log(`\n========== ${slug} ==========`);

        const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
        if (error || !data) {
            console.log("ERROR:", error);
            continue;
        }

        // Check cover
        const coverUrl = data.cover_image_url;
        const coverIsReal = coverUrl?.includes('_real_cover_');
        const coverExists = coverUrl ? fs.existsSync(path.resolve(__dirname, `../public${coverUrl}`)) : false;
        const coverStatus = coverIsReal && coverExists ? '✅' : '❌';
        console.log(`Cover: ${coverStatus} (${coverUrl})`);
        if (coverIsReal && coverExists) totalOk++; else totalMissing++;

        // Check inline
        const contentObj = data.content;
        let contentHtml: string;
        if (typeof contentObj === 'object' && contentObj?.tr) {
            contentHtml = contentObj.tr;
        } else if (typeof contentObj === 'string') {
            contentHtml = contentObj;
        } else { continue; }

        const allImgTags = contentHtml.match(/<img[^>]*>/g) || [];
        for (let i = 0; i < allImgTags.length; i++) {
            const tag = allImgTags[i];
            const srcMatch = tag.match(/src=[\\"]*([^\\">\s]+)/);
            const src = srcMatch ? srcMatch[1] : '';
            const isReal = src.includes('_real_inline_');
            const fileExists = src ? fs.existsSync(path.resolve(__dirname, `../public${src}`)) : false;
            const status = isReal && fileExists ? '✅' : '❌';
            console.log(`  Image ${i}: ${status} | ${src}`);
            if (isReal && fileExists) totalOk++; else totalMissing++;
        }
    }
    console.log(`\n\n=== SUMMARY ===`);
    console.log(`Total OK: ${totalOk}`);
    console.log(`Total MISSING: ${totalMissing}`);
}
diagnose();
