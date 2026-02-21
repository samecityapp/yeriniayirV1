import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

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

async function diagnose() {
    for (const slug of slugs) {
        console.log(`\n========== ${slug} ==========`);

        const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
        if (error || !data) {
            console.log("ERROR: Could not fetch article!", error);
            continue;
        }

        // Check cover image
        const coverUrl = data.cover_image_url;
        console.log(`Cover URL: ${coverUrl}`);
        const coverLocalPath = path.resolve(__dirname, `../public${coverUrl}`);
        const coverExists = fs.existsSync(coverLocalPath);
        console.log(`Cover file exists on disk: ${coverExists}`);
        const coverIsReal = coverUrl?.includes('_real_cover_');
        console.log(`Cover is AI-generated: ${coverIsReal}`);

        // Check inline images in content
        const contentObj = data.content;
        let contentHtml: string;
        if (typeof contentObj === 'object' && contentObj?.tr) {
            contentHtml = contentObj.tr;
        } else if (typeof contentObj === 'string') {
            contentHtml = contentObj;
        } else {
            console.log("ERROR: Cannot parse content!");
            continue;
        }

        // Find all img tags
        const allImgTags = contentHtml.match(/<img[^>]*>/g) || [];
        console.log(`Total inline <img> tags: ${allImgTags.length}`);

        for (let i = 0; i < allImgTags.length; i++) {
            const tag = allImgTags[i];
            // Extract src with escaped quotes handling
            const srcMatch = tag.match(/src=[\\"]*([^\\">\s]+)/);
            const src = srcMatch ? srcMatch[1] : 'UNKNOWN';
            const isReal = src.includes('_real_inline_');
            const localPath = path.resolve(__dirname, `../public${src}`);
            const fileExists = fs.existsSync(localPath);

            const status = isReal && fileExists ? '✅' : (fileExists ? '⚠️ OLD' : '❌ MISSING');
            console.log(`  Image ${i}: ${status} | src=${src} | onDisk=${fileExists}`);
        }
    }
}
diagnose();
