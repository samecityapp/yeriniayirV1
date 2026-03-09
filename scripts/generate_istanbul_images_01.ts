import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCVEAM5S-_4kUEp9Cetof5CEn-rSXOfRC4';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;

async function generateImage(prompt: string, filename: string): Promise<string> {
    const strictPrompt = prompt + " Absolutely NO text, NO letters, NO words, NO signs, NO watermarks anywhere in the image. Keep it purely visual and hyper-realistic.";
    console.log("Generating:", filename);
    const body = {
        instances: [{ prompt: strictPrompt }],
        parameters: { sampleCount: 1, aspectRatio: "16:9", outputOptions: { mimeType: "image/png" } }
    };

    const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to generate image ${filename}: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    if (!data.predictions || data.predictions.length === 0) {
        throw new Error("No predictions returned from Imagen 4");
    }

    const base64Data = data.predictions[0].bytesBase64Encoded;
    const buffer = Buffer.from(base64Data, 'base64');

    const publicPath = `/images/articles/${filename}.png`;
    const localPath = path.resolve(__dirname, `../public${publicPath}`);
    fs.writeFileSync(localPath, buffer);
    console.log("Saved:", localPath);
    return publicPath;
}

async function run() {
    const slug = 'istanbulda-nerede-kalinir-bolge-bolge-base-secim-rehberi';

    const imagesToGenerate = [
        {
            prompt: "Hyper realistic beautiful aerial photo of Istanbul Bosphorus at sunset with a luxury hotel terrace in the foreground. Very cinematic, travel photography.",
            filename: `istanbul_01_cover_${Date.now()}`
        },
        {
            prompt: "Hyper realistic beautiful morning photo of Sultanahmet Square with Blue Mosque and Hagia Sophia. Golden hour lighting, peaceful atmosphere, no tourists, cinematic.",
            filename: `istanbul_01_inline1_${Date.now()}`
        },
        {
            prompt: "Hyper realistic artistic photo of Karakoy and Galata narrow cobblestone streets with aesthetic cafes and Galata tower in the background. Modern, trendy vibe.",
            filename: `istanbul_01_inline2_${Date.now()}`
        },
        {
            prompt: "Hyper realistic photo of a traditional Istanbul passenger ferry crossing the Bosphorus towards Kadikoy. Seagulls flying, sunny day, cinematic travel shot.",
            filename: `istanbul_01_inline3_${Date.now()}`
        },
        {
            prompt: "Hyper realistic photo of Besiktas coastline and Ortakoy mosque with the Bosphorus bridge in the background at twilight. Purple and orange sky, cinematic lighting.",
            filename: `istanbul_01_inline4_${Date.now()}`
        }
    ];

    try {
        const coverUrl = await generateImage(imagesToGenerate[0].prompt, imagesToGenerate[0].filename);
        const inline1Url = await generateImage(imagesToGenerate[1].prompt, imagesToGenerate[1].filename);
        const inline2Url = await generateImage(imagesToGenerate[2].prompt, imagesToGenerate[2].filename);
        const inline3Url = await generateImage(imagesToGenerate[3].prompt, imagesToGenerate[3].filename);
        const inline4Url = await generateImage(imagesToGenerate[4].prompt, imagesToGenerate[4].filename);

        const { data, error } = await supabase.from('articles').select('content').eq('slug', slug).single();
        if (error || !data) throw error;

        let contentHtml = typeof data.content === 'object' ? data.content.tr : data.content;

        contentHtml = contentHtml.replace('/images/articles/istanbul_sultanahmet_square_placeholder.png', inline1Url);
        contentHtml = contentHtml.replace('/images/articles/istanbul_karakoy_galata_streets_placeholder.png', inline2Url);
        contentHtml = contentHtml.replace('/images/articles/istanbul_kadikoy_moda_ferry_placeholder.png', inline3Url);
        contentHtml = contentHtml.replace('/images/articles/istanbul_besiktas_bosphorus_placeholder.png', inline4Url);

        const updateObj = typeof data.content === 'object' ? { ...data.content, tr: contentHtml } : { tr: contentHtml };

        const { error: updateError } = await supabase.from('articles').update({
            cover_image_url: coverUrl,
            content: updateObj
        }).eq('slug', slug);

        if (updateError) throw updateError;

        console.log("Successfully generated and updated Article 1 with Imagen 4 images!");

    } catch (e) {
        console.error("Error generating images:", e);
    }
}

run();
