
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleAuth } from 'google-auth-library';

dotenv.config({ path: '.env.local' });

// --- Config ---
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = 'us-central1';
const API_ENDPOINT = 'us-central1-aiplatform.googleapis.com';
const IMAGE_MODEL_ID = 'imagen-3.0-generate-001';
const ARTICLES_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'articles');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Google Auth ---
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

// --- Vertex Image Gen ---
async function generateImageVertex(basePrompt: string, filename: string) {
    // ENHANCED PROMPT FOR REALISM
    const fullPrompt = `Raw candid photo of ${basePrompt}, shot on Fujifilm GFX 100, 35mm lens, f/1.8, natural sunlight, film grain, highly detailed textures, hyperrealistic, 8k resolution, authentic travel photography. Style: National Geographic, Award Winning Documentary. NOT illustration, NOT 3D render, NOT cartoon, NO smooth skin filter.`;

    console.log(`🎨 Generating: "${basePrompt.substring(0, 30)}..."`);

    const token = await getAccessToken();
    if (!token || !PROJECT_ID) return null;

    const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${IMAGE_MODEL_ID}:predict`;

    // MAX RETRIES
    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instances: [{ prompt: fullPrompt }],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: "16:9",
                        safetySetting: "block_only_high",
                        personGeneration: "allow_adult",
                    }
                })
            });

            if (response.status === 429) {
                console.warn(`⏳ Quota exceeded (429). Waiting 35s... (Attempt ${attempt}/5)`);
                await new Promise(r => setTimeout(r, 35000));
                continue;
            }

            if (!response.ok) {
                console.error(`Vertex Error: ${response.status}`);
                return null;
            }

            const data = await response.json();
            if (!data.predictions || data.predictions.length === 0) return null;

            const base64Image = data.predictions[0].bytesBase64Encoded;
            const buffer = Buffer.from(base64Image, 'base64');
            const localPath = path.join(ARTICLES_IMAGE_DIR, filename);

            if (!fs.existsSync(ARTICLES_IMAGE_DIR)) fs.mkdirSync(ARTICLES_IMAGE_DIR, { recursive: true });

            fs.writeFileSync(localPath, buffer as any);
            console.log(`✅ Saved: ${filename}`);
            return `/images/articles/${filename}`;

        } catch (e: any) {
            console.error("Gen failed:", e.message);
            return null;
        }
    }
    return null;
}

// --- Main Regeneration Logic ---
async function regenerateTestBatch() {
    const targetSlugs = [
        'driving-in-turkey-as-a-uk-traveller-rules-confidence-tips-what-to-expect',
        'women-travelling-in-turkey-comfort-tips',
        'best-regions-for-all-inclusive-in-turkey-which-coast-fits-your-style'
    ];

    console.log("🚀 Starting SUPER-REALISM Regeneration for 3 Articles...");

    for (const slug of targetSlugs) {
        // 1. Get Article
        const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
        if (!article) {
            console.error(`❌ Article not found: ${slug}`);
            continue;
        }

        // Fix Title (Handle JSON title issue seen in screenshot)
        let cleanTitle = article.title;
        if (typeof cleanTitle === 'object' && cleanTitle.en) {
            cleanTitle = cleanTitle.en;
        } else if (typeof cleanTitle === 'string' && cleanTitle.startsWith('{')) {
            try { cleanTitle = JSON.parse(cleanTitle).en; } catch (e) { }
        }

        console.log(`\n🔄 Processing: ${cleanTitle}`);

        // 2. Clear Old Images from Content 
        let content = article.content;

        // Handle object vs string structure aggressively
        if (typeof content === 'object' && (content as any).en) {
            content = (content as any).en;
        } else if (typeof content === 'string') {
            // Try to unwrap if it looks like JSON
            try {
                const parsed = JSON.parse(content);
                if (parsed.en) content = parsed.en;
            } catch (e) { /* use raw string */ }
        }

        // Remove existing figure/img blocks
        content = content.replace(/<figure class="my-8">[\s\S]*?<\/figure>/g, '');
        content = content.replace(/<img[^>]*>/g, '');

        // 3. Generate 5 New Images
        // We'll infer prompts from the title since we lost the original prompts in the condenser loop
        // We will create 5 variations based on the title context
        const basePrompts = [
            `${cleanTitle}, scenic wide angle landscape view, realistic`,
            `${cleanTitle}, close up detail, authentic atmosphere, realistic`,
            `${cleanTitle}, people interacting naturally, candid shot, realistic`,
            `${cleanTitle}, street view or local architecture, realistic`,
            `${cleanTitle}, atmospheric evening or golden hour shot, realistic`
        ];

        const newImageUrls: string[] = [];

        for (let i = 0; i < 5; i++) {
            const timestamp = Date.now();
            const filename = `${slug}-v2-realism-${i + 1}-${timestamp}.jpg`; // v2 to avoid cache
            const url = await generateImageVertex(basePrompts[i], filename);
            if (url) newImageUrls.push(url);
            // small delay
            await new Promise(r => setTimeout(r, 4000));
        }

        // 4. Inject Into Content (Clean HTML)
        let parts = content.split('</p>');
        let newContent = "";
        let currentImg = 0;
        const interval = Math.floor(parts.length / (newImageUrls.length + 1));
        let injectionPoints = newImageUrls.map((_, i) => (i + 1) * interval);

        for (let i = 0; i < parts.length; i++) {
            newContent += parts[i] + '</p>';
            if (currentImg < newImageUrls.length && i === injectionPoints[currentImg]) {
                const imgUrl = newImageUrls[currentImg];
                // CLEAN CAPTION - NO JSON
                const caption = `${cleanTitle} - View ${currentImg + 1}`;

                const imgTag = `
                <figure class="my-8">
                    <img src="${imgUrl}" alt="${caption}" class="w-full h-auto rounded-xl shadow-lg" />
                    <figcaption class="text-center text-sm text-gray-500 mt-2 italic">${caption}</figcaption>
                </figure>
                `;
                newContent += imgTag;
                currentImg++;
            }
        }
        // Force result to be clean object, avoiding stringification issues
        // The DB cleaner guarantees article.content is good before this runs, but we output clean object.


        // 5. Update DB
        const { error: upErr } = await supabase.from('articles').update({
            content: { en: newContent, tr: "<p>Content available in English only.</p>" },
            cover_image_url: newImageUrls[0] // Set new cover
        }).eq('id', article.id);

        if (upErr) console.error("❌ Update failed:", upErr);
        else console.log("✅ Article updated with NEW visuals.");
    }
}

regenerateTestBatch();
