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
    'fethiyede-nerede-kalinir-bolge-secim-rehberi',
    'fethiye-ilk-kez-gidenler-icin-3-5-7-gunluk-hazir-rota',
    'fethiyede-aracsiz-arabasiz-tatil-plani-dolmus-taksi-yuruyus',
    'oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi',
    'kelebekler-vadisi-rehberi-fethiye-ulasim'
];

async function generateImage(prompt: string, filename: string): Promise<string> {
    const fullPrompt = `${prompt}, hyper realistic professional travel photography, highly detailed, 8k resolution, cinematic lighting, Fethiye Turkey`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

    console.log(`Generating image for: ${filename} | Prompt: ${fullPrompt}`);
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

    fs.writeFileSync(localPath, buffer);
    console.log(`-> Saved to ${publicPath}`);
    return publicPath;
}

async function processArticles() {
    for (const slug of slugs) {
        console.log(`\n--- Processing Article: ${slug} ---`);

        const { data: articlesToProcess, error: fetchErr } = await supabase.from('articles')
            .select('*')
            .eq('slug', slug);

        if (fetchErr || !articlesToProcess || articlesToProcess.length === 0) {
            console.error(`Failed to fetch article ${slug}`, fetchErr);
            continue;
        }

        const article = articlesToProcess[0];

        let contentHtml = typeof article.content === 'object' && article.content?.tr ? article.content.tr : article.content;
        const titleText = typeof article.title === 'object' && article.title?.tr ? article.title.tr : article.title || "";

        console.log(`Found content of length: ${contentHtml?.length || 0}`);

        // Generate Cover Image
        const coverFilename = `${slug.replace(/-/g, '_')}_real_cover_${Date.now()}`;
        const coverPrompt = `Beautiful landscape of Fethiye Turkey representing the topic: ${titleText}`;
        try {
            if (!article.cover_image_url || article.cover_image_url.includes('photo_placeholder') || article.cover_image_url.includes('177161')) {
                const newCoverUrl = await generateImage(coverPrompt, coverFilename);
                article.cover_image_url = newCoverUrl;
            } else {
                console.log("Cover already real, skipping...");
            }
        } catch (e) { console.error("Cover image generation failed:", e); }

        // robust regex matching
        const imgRegex = /<img[^>]+src=[\\"]+([^\\"]+)[\\"]+(?:[^>]*alt=[\\"]+([^\\"]*)[\\"]+)?[^>]*>/g;
        const matches = [...contentHtml.matchAll(imgRegex)];
        console.log(`Found ${matches.length} inline images to replace in content.`);

        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const fullImgTag = match[0];
            const oldSrc = match[1];
            // if alt doesn't exist, default to Fethiye
            const originalAlt = match[2] || `Beautiful sight in Fethiye Turkey`;

            if (oldSrc.includes('_real_inline_')) continue;

            const inlineFilename = `${slug.replace(/-/g, '_')}_real_inline_${i}_${Date.now()}`;
            const inlinePrompt = originalAlt;

            try {
                const newInlineUrl = await generateImage(inlinePrompt, inlineFilename);
                const newImgTag = fullImgTag.replace(oldSrc, newInlineUrl);
                contentHtml = contentHtml.replace(fullImgTag, newImgTag);
                console.log(`Inline image ${i} generated and replaced in HTML.`);
            } catch (e) {
                console.error(`Inline image ${i} generation failed:`, e);
            }
        }

        article.content.tr = contentHtml;

        const { error: updateError } = await supabase.from('articles').update({
            cover_image_url: article.cover_image_url,
            content: article.content
        }).eq('id', article.id);

        if (updateError) {
            console.error(`Update failed for ${slug}:`, updateError);
        } else {
            console.log(`✓ Successfully updated ${slug} in Supabase with ${matches.length} inline images.`);
        }
    }
    console.log("\nAll 5 articles processed!");
}

processArticles();
