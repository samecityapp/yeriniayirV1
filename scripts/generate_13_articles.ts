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

// Vertex AI Config
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = 'us-central1';
const IMAGE_MODEL_ID = 'imagen-3.0-generate-001';
const TEXT_MODEL_ID = 'gemini-2.5-pro';

// Define credentials explicitly for VertexAI SDK
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), 'google-credentials.json');
const vertex_ai = new VertexAI({ project: PROJECT_ID, location: LOCATION });

const titles = [
    "İstanbul Havalimanı (IST) Transfer Seçimi: Taksi mi Metro mu Özel Transfer mi? (Gece Varışı Planı)",
    "Sabiha Gökçen’den Şehre En Kolay Ulaşım: Seçenekler ve Hangi Saatte Hangisi Mantıklı?",
    "İstanbul’da 1 Günde 2 Kıta: Avrupa → Anadolu Rotası (Saat Saat + Yürüme Seviyesi)",
    "İstanbul’da Gün Batımı Noktaları: Kalabalıksız Saatler + En İyi “Sunset Walk” Rotaları",
    "İstanbul’da Yağmurlu Gün Planı: Kapalı Mekân Rotaları (Müze + Çarşı + Kafe Akışı)",
    "İstanbul’da “Akşam Ne Yapılır?” Rehberi: Aile/Çift/Tek Kişi İçin Güvenli ve Keyifli Plan",
    "İstanbul’da Dolandırılmadan Değil, “Sürpriz Yaşamadan” Gezmek: Basit Kurallar (Taksi, Menü, Tur)",
    "İstanbul’da Camii Ziyareti Rehberi: Giyim, Saat, Fotoğraf Kuralları (Turist İçin Basit Anlatım)",
    "İstanbul’da “Yürüyerek Gezilecek” Semtler: 2–3 Saatlik Mini Rotalar (Harita Mantığıyla)",
    "İstanbul’da Çocukla Gezi: Bebek/Çocuk Checklists + Öğle Sıcağı/Yağmur Planı",
    "İstanbul Bütçe Planlayıcı: Ekonomik/Dengeli/Rahat Mod (Fiyat Vermeden Harcama Mantığı)",
    "İstanbul’da En İyi Fotoğraf/İçerik Rotası: 1 Günde Viral Kareler (Işık Saatleri + Kalabalık Stratejisi)",
    "İstanbul’da Ulaşım Rehberi: İstanbulkart, Metro/Tramvay/Feribot Mantığı (Kafası Karışanlara)"
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getAccessToken() {
    if (!fs.existsSync('google-credentials.json')) {
        const cr = path.resolve(process.cwd(), '../google-credentials.json');
        if (fs.existsSync(cr)) {
            const auth = new GoogleAuth({
                keyFile: cr,
                scopes: ['https://www.googleapis.com/auth/cloud-platform']
            });
            return await (await auth.getClient()).getAccessToken();
        }
    } else {
        const auth = new GoogleAuth({
            keyFile: 'google-credentials.json',
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        return await (await auth.getClient()).getAccessToken();
    }
    return null;
}

async function generateWithRetry(prompt: string, modelStr: string = TEXT_MODEL_ID): Promise<string> {
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: modelStr,
        generationConfig: {
            maxOutputTokens: 8192,
            temperature: 0.7,
        },
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
    if (!token) {
        console.error("NO ACCESS TOKEN FOR IMAGEN");
        return null;
    }

    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${IMAGE_MODEL_ID}:predict`;

    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instances: [{ prompt: prompt }],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: "16:9",
                        safetySetting: "block_only_high",
                        personGeneration: "allow_adult",
                    }
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.log("Quota exceeded, sleeping 30s...");
                    await sleep(30000);
                    continue;
                }
                throw new Error(`Imagen API Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.predictions && data.predictions.length > 0) {
                return data.predictions[0].bytesBase64Encoded;
            }
            throw new Error("No predictions");
        } catch (e: any) {
            console.error(`Error generating image (${i + 1}/5):`, e.message);
            await sleep(15000 * (i + 1));
        }
    }
    return null;
}

function cleanHtml(html: string): string {
    let clean = html.replace(/```html/gi, '').replace(/```/g, '');
    clean = clean.replace(/\/en/g, '').replace(/Ttr/g, '');
    clean = clean.replace(/\\n/g, '');
    return clean.trim();
}

function generateSlug(title: string): string {
    return title.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

async function processArticle(title: string, index: number) {
    console.log(`\n\n--- Processing Article ${index + 1}/${titles.length}: ${title} ---`);
    const baseSlug = generateSlug(title);

    const { data: existing } = await supabase.from('articles').select('id, slug').eq('slug', baseSlug).maybeSingle();
    if (existing) {
        console.log(`Article ${baseSlug} already exists in DB. Skipping to save quota.`);
        return;
    }

    let htmlContent = '';
    let wordCount = 0;
    let attempts = 0;

    while (wordCount < 1800 && attempts < 3) {
        attempts++;
        console.log(`1. Generating article HTML (Attempt ${attempts}, target: 1800-3000 words)...`);

        const articlePrompt = `
You are an expert travel writer and SEO specialist writing for 'yeriniayir.com'. Write a MASSIVE, extremely detailed, highly engaging Turkish article about: "${title}".

CRITICAL RULE 1: Length MUST BE BETWEEN 2000 and 3000 words. Do not write short summaries. Expand deeply on every single subtopic. Provide intricate details, insider tips, full day schedules, exact step-by-step instructions.
CRITICAL RULE 2: Formatting MUST be valid raw HTML. Use <h2>, <h3>, <p class="text-lg text-gray-700 leading-relaxed mb-6">, <ul class="list-disc pl-6 mb-4 text-gray-700 space-y-2">, <li>. Do NOT wrap it in \`\`\`html.
CRITICAL RULE 3: Include semantic structure. Give a hook intro, many H2s and H3s.
CRITICAL RULE 4: End the article with a "Sıkça Sorulan Sorular (F.A.Q.)" section inside <div class="space-y-4 my-8"> with at least 4 questions.
CRITICAL RULE 5: Provide extreme value. Add "Pro Tips", "Local Advice", "Cost Estimates" where relevant. Length is paramount.

Write the full HTML now:
`;
        htmlContent = await generateWithRetry(articlePrompt);
        htmlContent = cleanHtml(htmlContent);

        const textOnly = htmlContent.replace(/<[^>]*>?/gm, ' ');
        wordCount = textOnly.trim().split(/\s+/).length;
        console.log(`Generated ~${wordCount} words of HTML.`);

        if (wordCount < 1800) {
            console.log(`Word count too low (${wordCount} < 1800). Retrying...`);
        }
    }

    console.log("2. Generating meta description...");
    let metaDescriptionTr = await generateWithRetry(`Write a 1-2 sentence SEO meta description in Turkish for: "${title}". Use local keywords. Return ONLY the text, no quotes.`, 'gemini-2.5-flash');
    metaDescriptionTr = metaDescriptionTr.replace(/"/g, '').trim();

    console.log("3. Generating exactly 5 Image Prompts...");
    const imagePromptsPrompt = `
Write exactly 5 distinct image generation prompts in ENGLISH for a travel article titled: "${title}". 
CRITICAL RULE: The images MUST NOT contain any text, letters, symbols, words, or signs whatsoever. They must be purely visual.
Format: Hyper-realistic, high quality, cinematic lighting, 8k resolution, suitable for a premium travel blog, absolutely no text.
Return them as a valid JSON array of strings. ONLY JSON. Example: ["Prompt 1", "Prompt 2", "Prompt 3", "Prompt 4", "Prompt 5"]
`;
    const imagePromptsJsonStr = await generateWithRetry(imagePromptsPrompt, 'gemini-2.5-flash');
    let imagePrompts: string[] = [];
    try {
        const parsedStr = cleanHtml(imagePromptsJsonStr).replace(/json\n?/g, '');
        imagePrompts = JSON.parse(parsedStr);
    } catch (e) {
        console.error("Failed to parse image prompts JSON. Constructing default prompts.");
        imagePrompts = [
            `Hyper realistic cinematic photo of Istanbul related to ${title}, 8k, highly detailed, absolutely no text`,
            `Beautiful sunny day in Istanbul, aesthetic photography related to ${title}, 8k, absolutely no text`,
            `Premium travel blog photo of Istanbul streets, related to ${title}, 8k, absolutely no text`,
            `Atmospheric wide angle shot of Istanbul, related to ${title}, 8k, absolutely no text`,
            `Breathtaking view in Istanbul, travel photography, related to ${title}, 8k, absolutely no text`
        ];
    }

    while (imagePrompts.length < 5) imagePrompts.push(`Istanbul travel photography, hyper realistic, no text, 8k, related to ${title}`);
    imagePrompts = imagePrompts.slice(0, 5);

    const imageUrls: string[] = [];
    const publicDir = path.resolve(process.cwd(), 'public/images/articles');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

    for (let i = 0; i < 5; i++) {
        console.log(`Generating image ${i + 1}/5...`);
        const fullPrompt = imagePrompts[i] + ", hyper-realistic, highly detailed, professional photography, 8k, absolutely no text, no alphabet, no letters, no watermark, no signs";
        const base64Bytes = await generateImageWithRetry(fullPrompt);
        if (base64Bytes) {
            const buffer = Buffer.from(base64Bytes, 'base64');
            const filename = `ist_vx_${baseSlug.substring(0, 15)}_${Date.now()}_${i}.jpg`;
            const filepath = path.join(publicDir, filename);
            fs.writeFileSync(filepath, new Uint8Array(buffer));
            imageUrls.push(`/images/articles/${filename}`);
            console.log(`Saved image to ${filepath}`);
        } else {
            console.error(`Failed to generate image ${i + 1}/5`);
            imageUrls.push("");
        }
        await sleep(6000);
    }

    console.log("4. Injecting images into HTML...");
    let parts = htmlContent.split('<h2>');
    let injectedHtml = parts[0] || '';
    let imageIndex = 1;

    for (let i = 1; i < parts.length; i++) {
        if (i % 2 === 1 && imageIndex < 5 && imageUrls[imageIndex]) {
            const imgTag = `\n<img src="${imageUrls[imageIndex]}" alt="${title} Görsel ${imageIndex}" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />\n`;
            injectedHtml += imgTag;
            imageIndex++;
        }
        injectedHtml += '\n<h2>' + parts[i];
    }

    while (imageIndex < 5 && imageUrls[imageIndex]) {
        injectedHtml += `\n<img src="${imageUrls[imageIndex]}" alt="${title} Görsel ${imageIndex}" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />\n`;
        imageIndex++;
    }

    console.log("5. Saving to database...");
    const enTitlePrompt = `Translate this Turkish article title to English SEO style: "${title}". ONLY return the title, no quotes.`;
    let titleEn = await generateWithRetry(enTitlePrompt, 'gemini-2.5-flash');
    titleEn = titleEn.replace(/"/g, '').trim();

    const newArticle = {
        title: { en: titleEn, tr: title },
        slug: baseSlug,
        slug_en: baseSlug + "-en",
        content: { tr: injectedHtml, en: "<p>English version coming soon.</p>" },
        location: { tr: "Istanbul" },
        cover_image_url: imageUrls[0] || "",
        meta_description: {
            tr: metaDescriptionTr,
            en: ""
        },
        is_published: true,
        published_at: new Date().toISOString()
    };

    const { error, data } = await supabase.from('articles').upsert(newArticle, { onConflict: 'slug' }).select();
    if (error) {
        console.error("Failed to insert/update article:", error);
    } else {
        console.log("✅ Success! Article inserted with slug:", data[0].slug);
    }
}

async function main() {
    console.log("🚀 Starting Istanbul Deep-Dive Articles Generation Pipeline (VERTEX AI)...");
    for (let i = 0; i < titles.length; i++) {
        try {
            await processArticle(titles[i], i);
        } catch (e) {
            console.error(`❌ Failed to process article ${i + 1}. Skipping. Error:`, e);
        }
        console.log(`⏳ Sleeping 15s before next article to avoid global rate limits...`);
        await sleep(15000);
    }
    console.log("🎉 All articles processed!");
}

main();
