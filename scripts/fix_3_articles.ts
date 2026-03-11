import { VertexAI } from '@google-cloud/vertexai';
import { createClient } from '@supabase/supabase-js';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = 'us-central1';
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), 'google-credentials.json');
const vertex_ai = new VertexAI({ project: PROJECT_ID, location: LOCATION });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getAccessToken() {
    const auth = new GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    return await (await auth.getClient()).getAccessToken();
}

async function generateWithRetry(prompt: string, modelStr: string = 'gemini-2.5-pro'): Promise<string> {
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: modelStr,
        generationConfig: { maxOutputTokens: 8192, temperature: 0.7 },
    });
    for (let i = 0; i < 5; i++) {
        try {
            const req = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
            const resp = await generativeModel.generateContent(req);
            const contentResponse = await resp.response;
            if (contentResponse.candidates && contentResponse.candidates[0].content.parts[0].text) {
                return contentResponse.candidates[0].content.parts[0].text;
            }
            return '';
        } catch (e: any) {
            console.error(`Error generating content (${i + 1}/5):`, e.message);
            await sleep(15000 * (i + 1));
        }
    }
    throw new Error("Failed to generate content after 5 retries");
}

async function generateImageWithRetry(prompt: string): Promise<string | null> {
    const token = await getAccessToken();
    if (!token) return null;
    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-generate-001:predict`;
    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token.token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instances: [{ prompt: prompt }],
                    parameters: { sampleCount: 1, aspectRatio: "16:9", safetySetting: "block_only_high", personGeneration: "allow_adult" }
                })
            });
            if (!response.ok) {
                if (response.status === 429) { await sleep(30000); continue; }
                throw new Error(`Imagen API Error: ${response.status}`);
            }
            const data = await response.json();
            if (data.predictions && data.predictions.length > 0) return data.predictions[0].bytesBase64Encoded;
            throw new Error("No predictions");
        } catch (e: any) {
            console.error(`Error generating image (${i + 1}/5):`, e.message);
            await sleep(15000 * (i + 1));
        }
    }
    return null;
}

function cleanHtml(html: string): string {
    let clean = html.replace(/```html/gi, '').replace(/```/g, '').replace(/\/en/g, '').replace(/Ttr/g, '').replace(/\\n/g, '');
    return clean.trim();
}

async function fixArticle9() {
    // 9. İstanbul’da Çocukla Gezi (All 5 images missing)
    console.log("Fixing Article: i-stanbul-da-cocukla-gezi...");
    const slug = 'i-stanbul-da-cocukla-gezi-bebek-cocuk-checklists-ogle-sicagi-yagmur-plani';
    const { data: dbArticle } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!dbArticle) return console.log("Article not found.");

    // Generate 5 new images
    const imagePromptsPrompt = `Write exactly 5 distinct image generation prompts in ENGLISH for a travel article titled: "İstanbul’da Gezi: Müzeler, Parklar ve Öğle Sıcağı Planı". Format: Hyper-realistic, high quality, cinematic lighting, 8k resolution, suitable for a premium travel blog, absolutely no text, no children, no people, empty parks, beautiful scenery. Return ONLY JSON array of 5 strings.`;
    const imagePromptsJsonStr = await generateWithRetry(imagePromptsPrompt, 'gemini-2.5-flash');
    let imagePrompts: string[] = [];
    try {
        const parsedStr = cleanHtml(imagePromptsJsonStr).replace(/json\n?/g, '');
        imagePrompts = JSON.parse(parsedStr);
    } catch (e) {
        imagePrompts = Array(5).fill("Hyper realistic cinematic photo of Istanbul beautiful parks and museums, 8k, highly detailed, absolutely no text, no people");
    }

    const imageUrls: string[] = [];
    const publicDir = path.resolve(process.cwd(), 'public/images/articles');

    for (let i = 0; i < 5; i++) {
        console.log(`Generating image ${i + 1}/5...`);
        const fullPrompt = (imagePrompts[i] || "Istanbul travel photography, hyper realistic, no text, 8k, beautiful scenic spots") + ", hyper-realistic, highly detailed, professional photography, 8k, absolutely no text, no alphabet, no letters, no watermark, no signs, no people, empty area";
        const base64Bytes = await generateImageWithRetry(fullPrompt);
        if (base64Bytes) {
            const buffer = Buffer.from(base64Bytes, 'base64');
            const filename = `ist_vx_fix9_${Date.now()}_${i}.jpg`;
            const filepath = path.join(publicDir, filename);
            fs.writeFileSync(filepath, new Uint8Array(buffer));
            imageUrls.push(`/images/articles/${filename}`);
        } else {
            imageUrls.push("");
        }
        await sleep(6000);
    }

    let trContent = '';
    if (typeof dbArticle.content === 'string') {
        try { trContent = JSON.parse(dbArticle.content).tr; } catch (e) { trContent = dbArticle.content; }
    } else { trContent = dbArticle.content.tr; }

    let parts = trContent.split('<h2>');
    let injectedHtml = parts[0] || '';
    let imageIndex = 1;

    for (let i = 1; i < parts.length; i++) {
        if (i % 2 === 1 && imageIndex < 5 && imageUrls[imageIndex]) {
            const imgTag = `\n<img src="${imageUrls[imageIndex]}" alt="Görsel ${imageIndex}" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />\n`;
            injectedHtml += imgTag;
            imageIndex++;
        }
        injectedHtml += '\n<h2>' + parts[i];
    }

    // Update DB
    dbArticle.cover_image_url = imageUrls[0] || "";
    dbArticle.content = { tr: injectedHtml, en: "<p>English version coming soon.</p>" };
    await supabase.from('articles').update({ cover_image_url: dbArticle.cover_image_url, content: dbArticle.content }).eq('slug', slug);
    console.log("Fixed Article 9!");
}

async function fixArticle5() {
    // 5. İstanbul’da Akşam Ne Yapılır (Cover missing)
    console.log("Fixing Article: i-stanbul-da-aksam-ne-yapilir...");
    const slug = 'i-stanbul-da-aksam-ne-yapilir-rehberi-aile-cift-tek-kisi-i-cin-guvenli-ve-keyifli-plan';
    const { data: dbArticle } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!dbArticle) return console.log("Article not found.");

    const fullPrompt = "Hyper realistic cinematic photo of Istanbul at night, safe and enjoyable evening activities, premium travel blog, 8k, highly detailed, absolutely no text, no alphabet, no letters, no watermark, no signs";
    console.log(`Generating cover image...`);
    const base64Bytes = await generateImageWithRetry(fullPrompt);
    if (base64Bytes) {
        const publicDir = path.resolve(process.cwd(), 'public/images/articles');
        const buffer = Buffer.from(base64Bytes, 'base64');
        const filename = `ist_vx_fix5_${Date.now()}_cover.jpg`;
        const filepath = path.join(publicDir, filename);
        fs.writeFileSync(filepath, new Uint8Array(buffer));

        await supabase.from('articles').update({ cover_image_url: `/images/articles/${filename}` }).eq('slug', slug);
        console.log("Fixed Article 5!");
    }
}

async function fixArticle1() {
    // 1. Sabiha Gökçen (Word count too low, 1292. Content generation required)
    console.log("Fixing Article: sabiha-gokcen...");
    const slug = 'sabiha-gokcen-den-sehre-en-kolay-ulasim-secenekler-ve-hangi-saatte-hangisi-mantikli';
    const title = "Sabiha Gökçen’den Şehre En Kolay Ulaşım: Seçenekler ve Hangi Saatte Hangisi Mantıklı?";

    let htmlContent = '';
    let wordCount = 0;
    while (wordCount < 1500) {
        console.log(`Generating VERY LONG article HTML...`);
        const articlePrompt = `
You are an expert travel writer writing for 'yeriniayir.com'. Write a MASSIVE, extremely detailed Turkish article about: "${title}".
CRITICAL RULE 1: Length MUST BE OVER 1700 words. Expand deeply on every single subtopic.
CRITICAL RULE 2: Formatting MUST be valid raw HTML. Use <h2>, <h3>, <p class="text-lg text-gray-700 leading-relaxed mb-6">, <ul class="list-disc pl-6 mb-4 text-gray-700 space-y-2">, <li>. Do NOT wrap it in \`\`\`html.
CRITICAL RULE 3: End the article with a "Sıkça Sorulan Sorular (F.A.Q.)" section inside <div class="space-y-4 my-8"> with at least 5 questions.
Write the full HTML now:
`;
        htmlContent = await generateWithRetry(articlePrompt, 'gemini-2.5-pro');
        htmlContent = cleanHtml(htmlContent);
        wordCount = htmlContent.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).length;
        console.log(`Word count: ${wordCount}`);
    }

    const { data: dbArticle } = await supabase.from('articles').select('*').eq('slug', slug).single();
    let oldTrContent = '';
    if (typeof dbArticle.content === 'string') {
        try { oldTrContent = JSON.parse(dbArticle.content).tr; } catch (e) { oldTrContent = dbArticle.content; }
    } else { oldTrContent = dbArticle.content.tr; }

    // Preserve old images!
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    const oldImages: string[] = [];
    while ((match = imgRegex.exec(oldTrContent)) !== null) {
        oldImages.push(match[1]);
    }

    // Usually 4 inline images. Index 0 is cover, 1..4 is inline.
    // The DB record has "cover_image_url", which is image 0. We don't overwrite it.
    let parts = htmlContent.split('<h2>');
    let injectedHtml = parts[0] || '';
    let oldImgIdx = 0;

    for (let i = 1; i < parts.length; i++) {
        if (i % 2 === 1 && oldImgIdx < oldImages.length) {
            const imgTag = `\n<img src="${oldImages[oldImgIdx]}" alt="Görsel ${oldImgIdx + 1}" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />\n`;
            injectedHtml += imgTag;
            oldImgIdx++;
        }
        injectedHtml += '\n<h2>' + parts[i];
    }

    await supabase.from('articles').update({ content: { tr: injectedHtml, en: "<p>English version coming soon.</p>" } }).eq('slug', slug);
    console.log("Fixed Article 1!");
}

async function main() {
    // await fixArticle9();
    // await fixArticle5();
    await fixArticle1();
    console.log("All fixes applied.");
}

main();
