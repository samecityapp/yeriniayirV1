import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const apiKey = 'AIzaSyCVEAM5S-_4kUEp9Cetof5CEn-rSXOfRC4';

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

async function generateImage(prompt: string, filename: string): Promise<string> {
    const fullPrompt = `${prompt}, hyper realistic professional travel photography, highly detailed, 8k resolution, cinematic lighting, Fethiye Turkey`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

    console.log(`  🎨 Generating: ${filename}`);
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "instances": [{ "prompt": fullPrompt }],
            "parameters": { "sampleCount": 1 }
        })
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
    }
    if (!data.predictions || data.predictions.length === 0) {
        throw new Error("No predictions returned");
    }

    const base64Image = data.predictions[0].bytesBase64Encoded;
    const buffer = Buffer.from(base64Image, 'base64');

    const publicPath = `/images/articles/${filename}.png`;
    const localPath = path.resolve(__dirname, `../public${publicPath}`);

    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(localPath, buffer);
    console.log(`  ✅ Saved: ${publicPath}`);
    return publicPath;
}

async function processArticles() {
    for (let s = 0; s < slugs.length; s++) {
        const slug = slugs[s];
        console.log(`\n========== [${s + 1}/10] FIXING: ${slug} ==========`);

        const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
        if (error || !data) {
            console.log("ERROR: Could not fetch article!", error);
            continue;
        }

        // Parse content correctly
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

        // Clean double-stringified content first
        if (contentHtml.startsWith('{"tr":"')) {
            try {
                const parsed = JSON.parse(contentHtml);
                if (parsed.tr) contentHtml = parsed.tr;
            } catch (e) {
                contentHtml = contentHtml.replace(/^\{"tr":"/, '').replace(/"\}$/, '');
            }
        }
        contentHtml = contentHtml.replace(/\\n/g, '\n').replace(/\\"/g, '"');

        const titleText = typeof data.title === 'object' && data.title?.tr ? data.title.tr : (data.title || slug);

        // ====== STEP 1: Fix cover image ======
        let newCoverUrl = data.cover_image_url;
        const coverIsReal = newCoverUrl?.includes('_real_cover_');
        const coverExists = newCoverUrl ? fs.existsSync(path.resolve(__dirname, `../public${newCoverUrl}`)) : false;

        if (!coverIsReal || !coverExists) {
            console.log(`  Cover needs generation (real=${coverIsReal}, exists=${coverExists})`);
            const coverFilename = `${slug.replace(/-/g, '_')}_real_cover_${Date.now()}`;
            try {
                newCoverUrl = await generateImage(`Beautiful panoramic landscape of Fethiye Turkey, ${titleText}`, coverFilename);
            } catch (e: any) {
                console.error(`  Cover generation failed:`, e.message);
            }
        } else {
            console.log(`  Cover OK ✅`);
        }

        // ====== STEP 2: Fix inline images ======
        const allImgTags = contentHtml.match(/<img[^>]*>/g) || [];
        console.log(`  Found ${allImgTags.length} inline images to process`);

        for (let i = 0; i < allImgTags.length; i++) {
            const tag = allImgTags[i];
            const srcMatch = tag.match(/src=[\\"]*([^\\">\s]+)/);
            const src = srcMatch ? srcMatch[1] : '';
            const altMatch = tag.match(/alt=[\\"]*([^\\">]*)/);
            const altText = altMatch ? altMatch[1] : `Beautiful scene in Fethiye Turkey number ${i + 1}`;

            const isReal = src.includes('_real_inline_');
            const fileExists = src ? fs.existsSync(path.resolve(__dirname, `../public${src}`)) : false;

            if (isReal && fileExists) {
                console.log(`  Image ${i}: Already OK ✅`);
                continue;
            }

            console.log(`  Image ${i}: Needs replacement`);
            const inlineFilename = `${slug.replace(/-/g, '_')}_real_inline_${i}_${Date.now()}`;

            try {
                const newInlineUrl = await generateImage(altText, inlineFilename);
                const newImgTag = `<img src="${newInlineUrl}" alt="${altText}" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />`;
                contentHtml = contentHtml.replace(tag, newImgTag);
                console.log(`  Image ${i}: Replaced ✅`);
            } catch (e: any) {
                console.error(`  Image ${i} generation failed:`, e.message);
            }
        }

        // ====== STEP 3: Save to database ======
        let contentUpdate: any;
        if (typeof contentObj === 'object') {
            contentUpdate = { ...contentObj, tr: contentHtml };
        } else {
            contentUpdate = { tr: contentHtml };
        }

        const { error: updateError } = await supabase.from('articles').update({
            cover_image_url: newCoverUrl,
            content: contentUpdate
        }).eq('id', data.id);

        if (updateError) {
            console.error(`  ❌ Database update failed:`, updateError);
        } else {
            console.log(`  ✅ Database updated for ${slug}`);
        }
    }
    console.log("\n\n🎉 ALL 10 REMAINING ARTICLES PROCESSED!");
}

processArticles();
