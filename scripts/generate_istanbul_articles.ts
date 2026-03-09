import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const geminiKey = process.env.GEMINI_API_KEY || 'AIzaSyCVEAM5S-_4kUEp9Cetof5CEn-rSXOfRC4';
const ai = new GoogleGenAI({ apiKey: geminiKey });

const titles = [
    "İstanbul’da Nerede Kalınır? Bölge Bölge Base Seçim Rehberi (İlk Kez Gelenler İçin)",
    "İstanbul’a İlk Kez Gelenler: 3–5–7 Günlük Hazır Rota (Yormayan Plan + Esnek Günler)",
    "İstanbul’da Ulaşım Rehberi: İstanbulkart, Metro/Tramvay/Feribot Mantığı (Kafası Karışanlara)",
    "İstanbul Havalimanı Transfer Seçimi: Taksi mi Metro mu Özel Transfer mi? (Gece Varışı Planı)",
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
    "İstanbul’da En İyi Fotoğraf/İçerik Rotası: 1 Günde Viral Kareler (Işık Saatleri + Kalabalık Stratejisi)"
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithRetry(prompt: string, model: string = 'gemini-2.5-flash'): Promise<string> {
    for (let i = 0; i < 5; i++) {
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: prompt,
            });
            return response.text || '';
        } catch (e: any) {
            console.error(`Error generating content (${i + 1}/5):`, e.message);
            await sleep(10000 * (i + 1));
        }
    }
    throw new Error("Failed to generate content after 5 retries");
}

async function generateImageWithRetry(prompt: string): Promise<string | null> {
    for (let i = 0; i < 5; i++) {
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '16:9'
                }
            });
            if (response.generatedImages && response.generatedImages.length > 0) {
                return response.generatedImages[0].image?.imageBytes ?? null;
            }
        } catch (e: any) {
            console.error(`Error generating image (${i + 1}/5):`, e.message);
            if (e.message && e.message.includes("quota")) {
                console.log("Quota exceeded, sleeping for 60 seconds...");
                await sleep(60000);
            } else {
                await sleep(10000 * (i + 1));
            }
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

    // 1. Generate Article Content
    console.log("1. Generating article HTML...");
    const articlePrompt = `
You are an expert travel writer and SEO specialist. Write a comprehensive, highly engaging, and flawlessly formatted Turkish article (2000 - 3000 words) about: "${title}".

RULES:
- Language: Turkish.
- Target Audience: Users of 'yeriniayir.com' looking for practical, well-structured travel advice.
- Formatting: Return ONLY valid HTML. Do NOT wrap it in \`\`\`html or markdown blockticks. Use <h2>, <h3>, <p class="text-lg text-gray-700 leading-relaxed mb-6">, <ul>, <li>. Add visually appealing classes for readability.
- Structure: Start with an engaging introduction paragraph. Then use multiple <h2> sections. Include a FAQ section at the end inside <div class="space-y-4 my-8">.
- NO AI artifacts: Do NOT include phrases like "İşte makaleniz", "Here is the article", "\\n", or markdown bold ** inside HTML tags.
- The content must be extremely detailed, practical, and highly valuable.
`;
    let htmlContent = await generateWithRetry(articlePrompt, 'gemini-2.5-pro'); // use Pro for larger context if available, otherwise flash
    htmlContent = cleanHtml(htmlContent);
    const wordCount = htmlContent.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    console.log(`Generated ~${wordCount} words of HTML.`);

    // 2. Generate Meta Description
    console.log("2. Generating meta description...");
    const metaPrompt = `Write a 1-2 sentence SEO meta description in Turkish for an article titled: "${title}". The meta description must be catchy and include keywords. Return ONLY the text, no quotes.`;
    let metaDescriptionTr = await generateWithRetry(metaPrompt);
    metaDescriptionTr = metaDescriptionTr.replace(/"/g, '').trim();

    // 3. Generate Image Prompts & Fetch Images
    console.log("3. Generating Image Prompts...");
    const imagePromptsPrompt = `
Write 5 distinct image generation prompts in ENGLISH for a travel article titled: "${title}". 
The images should be hyper-realistic, high quality, cinematic lighting, 8k resolution, suitable for a premium travel blog. Ensure no text is in the images.
Return them as a valid JSON array of strings. ONLY JSON. Example: ["Prompt 1", "Prompt 2", "Prompt 3", "Prompt 4", "Prompt 5"]
`;
    const imagePromptsJsonStr = await generateWithRetry(imagePromptsPrompt);
    let imagePrompts: string[] = [];
    try {
        const parsedStr = cleanHtml(imagePromptsJsonStr).replace(/json\n?/g, '');
        imagePrompts = JSON.parse(parsedStr);
    } catch (e) {
        console.error("Failed to parse image prompts JSON. Constructing default prompts.");
        imagePrompts = [
            `Hyper realistic cinematic photo of Istanbul related to ${title}, 8k, highly detailed, no text`,
            `Beautiful sunny day in Istanbul, aesthetic photography related to ${title}, 8k, no text`,
            `Premium travel blog photo of Istanbul streets, related to ${title}, 8k, no text`,
            `Atmospheric wide angle shot of Istanbul, related to ${title}, 8k, no text`,
            `Breathtaking view in Istanbul, travel photography, related to ${title}, 8k, no text`
        ];
    }

    const imageUrls: string[] = [];
    const publicDir = path.resolve(process.cwd(), '../public/images/articles');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

    for (let i = 0; i < 5; i++) {
        console.log(`Generating image ${i + 1}/5...`);
        const base64Bytes = await generateImageWithRetry(imagePrompts[i] + ", hyper-realistic, highly detailed, professional photography, 8k, absolutely no text, no watermark");
        if (base64Bytes) {
            const buffer = Buffer.from(base64Bytes, 'base64');
            const filename = `istanbul_${generateSlug(title).substring(0, 30)}_${Date.now()}_${i}.jpg`;
            const filepath = path.join(publicDir, filename);
            fs.writeFileSync(filepath, new Uint8Array(buffer));
            imageUrls.push(`/images/articles/${filename}`);
            console.log(`Saved image to ${filepath}`);
        } else {
            console.error(`Failed to generate image ${i + 1}/5`);
        }
        await sleep(5000); // Sleep briefly to respect Imagen quota
    }

    // 4. Inject Images into HTML
    console.log("4. Injecting images into HTML...");
    let parts = htmlContent.split('<h2>');
    let injectedHtml = parts[0];
    let imageIndex = 1; // 0 is cover image

    for (let i = 1; i < parts.length; i++) {
        if (i % 2 === 1 && imageIndex < imageUrls.length) {
            const imgTag = `\n<img src="${imageUrls[imageIndex]}" alt="${title} Görsel ${imageIndex}" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />\n`;
            injectedHtml += imgTag;
            imageIndex++;
        }
        injectedHtml += '<h2>' + parts[i];
    }

    while (imageIndex < imageUrls.length) {
        injectedHtml += `\n<img src="${imageUrls[imageIndex]}" alt="${title} Görsel ${imageIndex}" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />\n`;
        imageIndex++;
    }

    // 5. Database Insertion
    console.log("5. Saving to database...");
    const baseSlug = generateSlug(title);

    const newArticle = {
        title: { en: title, tr: title },
        slug: baseSlug,
        slug_en: baseSlug + "-en",
        content: { tr: injectedHtml },
        location: { tr: "Istanbul" },
        cover_image_url: imageUrls.length > 0 ? imageUrls[0] : "", // Use image 0 as cover
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
        console.log("Success! Article inserted with slug:", data[0].slug);
    }
}

async function main() {
    console.log("Starting Istanbul Articles Generation Pipeline...");
    for (let i = 0; i < titles.length; i++) {
        try {
            await processArticle(titles[i], i);
        } catch (e) {
            console.error(`Failed to process article ${i + 1}. Skipping. Error:`, e);
        }
        console.log(`Sleeping 5s before next article to avoid rate limits...`);
        await sleep(5000);
    }
    console.log("All 15 articles generated!");
}

main();
