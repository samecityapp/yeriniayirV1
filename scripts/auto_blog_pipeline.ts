import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

// --- Configurations ---
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = 'us-central1';
const API_ENDPOINT = 'us-central1-aiplatform.googleapis.com';
const IMAGE_MODEL_ID = 'imagen-3.0-generate-001';
const ARTICLES_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'articles');

// --- Clients ---
// Note: We check for key later or let OpenAI throw if missing
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'MISSING_KEY',
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Helpers ---
async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

async function getAccessToken() {
    if (!fs.existsSync('google-credentials.json')) {
        console.error("❌ 'google-credentials.json' missing.");
        return null;
    }
    const auth = new GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token;
}

// --- Image Generation (Vertex AI) ---
async function generateImageVertex(prompt: string, filename: string, retries = 3) {
    console.log(`🎨 Generating image: ${filename}`);

    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);
    if (fs.existsSync(localPath)) {
        console.log(`⏩ File exists, skipping: ${filename}`);
        return `/images/articles/${filename}`;
    }

    const token = await getAccessToken();
    if (!token || !PROJECT_ID) return null;

    const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${IMAGE_MODEL_ID}:predict`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            if (attempt > 1) await sleep(20000);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instances: [{ prompt: prompt + ", award winning travel photography, 8k, highly detailed, photorealistic, cinematic lighting, shot on 35mm lens" }],
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
                    console.warn(`⏳ Quota exceeded (429). Waiting 30s before retry ${attempt + 1}...`);
                    await sleep(30000);
                    continue;
                }
                const errText = await response.text();
                throw new Error(`Vertex Image API Error: ${response.status} - ${errText}`);
            }

            const data = await response.json();

            if (!data.predictions || data.predictions.length === 0) {
                throw new Error('No predictions returned');
            }

            const base64Image = data.predictions[0].bytesBase64Encoded;
            const buffer = Buffer.from(base64Image, 'base64');

            if (!fs.existsSync(ARTICLES_IMAGE_DIR)) {
                fs.mkdirSync(ARTICLES_IMAGE_DIR, { recursive: true });
            }

            fs.writeFileSync(localPath, buffer as any);
            console.log(`✅ Saved: ${localPath}`);

            return `/images/articles/${filename}`;
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed:`, error);
            if (attempt === retries) return null;
        }
    }
    return null;
}

// --- Article Generation (OpenAI) ---
async function generateArticleOpenAI(topic: string) {
    console.log(`🧠 Generating content for topic: "${topic}" with OpenAI...`);

    if (!process.env.OPENAI_API_KEY) {
        throw new Error("❌ OPENAI_API_KEY is missing in .env.local");
    }

    const prompt = `
    You are an expert "travel advisor" for a website called "yeriniayir.com", targeting UK residents planning trips to Turkey.
    
    **CRITICAL RULES (Failure to follow these will result in rejection):**
    
    1. **NO HOTEL NAMES**: Never mention specific hotels, businesses, or brand names. Focus ONLY on "areas", "regions", "bases", and "concepts".
    2. **LANGUAGE**: Use strict **British English** (spelling: colour, centre, travelling; vocabulary: holiday, lift, pavement).
    3. **TONE**: UK-friendly, clear, practical, safe, and authoritative. NO "scam/fear" language (don't say "unsafe", say "be aware"). NO unproven absolutes ("best", "100%"). Use "typically", "often", "many travellers find".
    4. **CONTENT SOURCE**: Do not invent data. If unsure about a visa fee or price, say "check official sources" or give a safe range.
    5. **STRUCTURE & DEPTH (CRITICAL)**:
       - **H1**: SEO-optimized title (UK search intent: "What / How / Guide to...").
       - **H1**: SEO-optimized title (UK search intent: "What / How / Guide to...").
       - **LENGTH**: **EXTREMELY STRICT TARGET: 2300 - 2500 words**. Do NOT write less than 2000, do NOT write more than 2600.
       - **IMAGE PLACEMENT (CRITICAL)**: You MUST insert exactly 5 image placeholders "[IMAGE_PLACEHOLDER_1]", "[IMAGE_PLACEHOLDER_2]", etc. evenly distributed throughout the text. Do NOT forget them.
       - **BREVITY**: Be direct. No "fluffy" intros. Start with the value. Use bullet points heavily.
       - **VALUE DENSITY**: Maximum information in minimum words.
       - **FEATURED SNIPPET**: The first section MUST be a "Key Takeaways" box (HTML div with strict styling).
       - **ENTITY INJECTION**: You MUST mention specific local entities (Street names in Bodrum, specific dolmus routes in Antalya, name of the local bread, etc.). Generic advice is BANNED.
       - **LSI KEYWORDS**: Use semantic variations (e.g., if topic is "hotels", use "accommodation", "places to stay", "resorts", "lodging").
       - **Quick Answer**: The paragraph after Key Takeaways must be a direct answer.
       - **Structure**:
         - **Key Takeaways** (Box).
         - Introduction (Hook).
         - Detailed Sections (H2/H3).
         - **Insider Tips** (Callout boxes).
         - Practical Info (Prices, Times).
         - FAQs (Schema valid).
       - **Skimmable**: Use many bullet points (<ul>/<li>) but ensure the text *around* them is detailed.
       - **Skimmable**: Use many bullet points (<ul>/<li>).
       - **Micro-Callouts**: Frequently use bold phrases like "**Simple rule:** ..." or "**UK-friendly tip:** ...".
       - **Internal Links**: Insert 3-6 placeholders exactly like this: <a href="[INTERNAL_LINK:related-slug]">Anchor Text</a>. Use accurate kebab-case slugs.
       - **FAQ**: Must end with an FAQ section (H2: FAQ, H3: Questions).
       - **Last Updated**: End the content with <p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>.
       - **Next Read**: After the Last Updated, add: <p>Sıradaki makale: <strong>[Suggest a related topic title]</strong></p>

    6. **FORMAT (JSON)**:
       You must return a valid JSON object with the following structure:
       {
         "slug": "kebab-case-url-slug",
         "title": "SEO Title",
         "meta_description": "160 chars seo description",
         "content": "Raw HTML content (h2, h3, p, ul, li...). MUST include a <script type='application/ld+json'> block with FAQPage schema.",
         "schema_markup": "Raw JSON string of the Schema.org object (Article, Breadcrumb, FAQPage)",
         "image_prompts": [
            { "placeholder": "[IMAGE_PLACEHOLDER_1]", "prompt": "detailed prompt 1", "caption": "caption 1" },
            { "placeholder": "[IMAGE_PLACEHOLDER_2]", "prompt": "detailed prompt 2", "caption": "caption 2" },
            { "placeholder": "[IMAGE_PLACEHOLDER_3]", "prompt": "detailed prompt 3", "caption": "caption 3" },
            { "placeholder": "[IMAGE_PLACEHOLDER_4]", "prompt": "detailed prompt 4", "caption": "caption 4" },
            { "placeholder": "[IMAGE_PLACEHOLDER_5]", "prompt": "detailed prompt 5", "caption": "caption 5" }
         ]
       }
       - "image_prompts" must generate 5 distinct "hyper-realistic, travel photography" style prompts relevant to the article sections.
    
    **TOPIC**: "${topic}"
    `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful JSON generator." }, { role: "user", content: prompt }],
            model: "gpt-5.1", // Ultra-latest model per user request
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("Empty response from OpenAI");

        let parsed = JSON.parse(content);
        let finalContent = parsed.content;

        // Validation & Fallback
        if (!parsed.slug) parsed.slug = slugify(parsed.title || topic);
        if (!parsed.image_prompts) parsed.image_prompts = [];

        return parsed;

    } catch (error) {
        console.error("❌ OpenAI Generation Error:", error);
        return null;
    }
}

// --- Main Process ---
async function processTopic(topic: string) {
    // 1. Generate Article Data
    const articleData = await generateArticleOpenAI(topic);
    if (!articleData) return;

    // Check if exists (Re-enabled to protect long articles)
    const { data: existing } = await supabase.from('articles').select('id').eq('slug', articleData.slug).single();
    if (existing) {
        console.log(`⏩ Article with slug "${articleData.slug}" already exists. Skipping to protect content...`);
        return;
    }

    let finalContent = articleData.content;
    let coverImageUrl = '';

    // 2. Generate Images
    console.log(`📸 Generating ${articleData.image_prompts.length} images...`);

    for (const [index, imgItem] of articleData.image_prompts.entries()) {
        const timestamp = Date.now();
        const filename = `${articleData.slug}-${index + 1}-${timestamp}.jpg`;

        // Add delay to avoid hitting Vertex AI rate limits too hard
        if (index > 0) await sleep(5000);

        const publicUrl = await generateImageVertex(imgItem.prompt, filename);

        if (publicUrl) {
            // Use the first image as cover/og image
            if (index === 0) coverImageUrl = publicUrl;

            const imgTag = `<img src="${publicUrl}" alt="${articleData.title} - Image ${index + 1}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
            finalContent = finalContent.replace(imgItem.placeholder, imgTag);
        } else {
            // Remove placeholder if generation failed
            finalContent = finalContent.replace(imgItem.placeholder, '');
        }
    }

    // 3. Save to Supabase (Upsert)
    const sanitize = (str: string) => str ? str.replace(/\u0000/g, '') : str;

    const { error } = await supabase.from('articles').upsert({
        slug: sanitize(articleData.slug),
        title: { en: sanitize(articleData.title), tr: sanitize(`${articleData.title} (TR)`) },
        meta_description: { en: sanitize(articleData.meta_description), tr: "TR Pasif." },
        content: { en: sanitize(finalContent), tr: "<p>Content available in English only.</p>" },
        cover_image_url: coverImageUrl,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });

    if (error) {
        console.error("❌ DB Insert Failed:", error);
    } else {
        console.log(`✅ Successfully added article: "${articleData.title}"`);
    }
}

async function runPipeline() {
    console.log("🚀 Starting Auto Blog Pipeline (OpenAI Edition)...");

    const topicsPath = path.join(__dirname, 'topics.json');
    if (!fs.existsSync(topicsPath)) {
        console.error("❌ topics.json not found!");
        return;
    }

    const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));
    console.log(`Found ${topics.length} topics.`);

    for (const topic of topics) {
        await processTopic(topic);

        console.log("⏳ Waiting 60 seconds before next topic...");
        await sleep(60000); // 1 minute delay between articles
    }

    console.log("🎉 Pipeline Finished!");
}

runPipeline();
