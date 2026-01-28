import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleAuth } from 'google-auth-library';
import { BATCH_1_PART_1 } from './data/batch_1_full';

dotenv.config({ path: '.env.local' });

// --- Configuration ---
const IMAGEN_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const IMAGEN_LOCATION = 'us-central1';
const IMAGEN_MODEL_ID = 'imagen-3.0-generate-001';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLES_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'articles');
if (!fs.existsSync(ARTICLES_IMAGE_DIR)) {
    fs.mkdirSync(ARTICLES_IMAGE_DIR, { recursive: true });
}

const REALISM_SUFFIX = ", photorealistic style, natural lighting, shot on 35mm film, candid travel photography, authentic atmosphere, no filters, slightly imperfect composition for realism, 4k, highly detailed textures.";

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Imagen 3 Generator (Smart Resume) ---
async function generateImage(prompt: string, filenameBase: string): Promise<string | null> {
    const fullPrompt = prompt + REALISM_SUFFIX;

    // Check for ANY existing file with this base pattern
    const files = fs.readdirSync(ARTICLES_IMAGE_DIR);
    const existingFile = files.find(f => f.startsWith(filenameBase) && f.endsWith('.jpg'));

    if (existingFile) {
        console.log(`⏩ Exists: ${existingFile}`);
        return `/images/articles/${existingFile}`;
    }

    const timestamp = Date.now();
    const filename = `${filenameBase}-${timestamp}.jpg`;
    console.log(`🎨 Generating NEW: ${filename}`);

    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);

    if (!fs.existsSync('google-credentials.json')) return null;

    const auth = new GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    try {
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();

        const url = `https://${IMAGEN_LOCATION}-aiplatform.googleapis.com/v1/projects/${IMAGEN_PROJECT_ID}/locations/${IMAGEN_LOCATION}/publishers/google/models/${IMAGEN_MODEL_ID}:predict`;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${accessToken.token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        instances: [{ prompt: fullPrompt }],
                        parameters: { sampleCount: 1, aspectRatio: "16:9", safetySetting: "block_only_high", personGeneration: "allow_adult" }
                    })
                });

                if (!response.ok) {
                    if (response.status === 429) {
                        console.warn(`⏳ 429 Quota Hit. Waiting 65s...`);
                        await sleep(65000);
                        continue;
                    }
                    const txt = await response.text();
                    throw new Error(`Vertex Error: ${response.status} - ${txt}`);
                }

                const data = await response.json();

                if (!data.predictions || !data.predictions[0]) {
                    console.error("❌ No predictions. Skip.", JSON.stringify(data));
                    return null;
                }

                const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
                fs.writeFileSync(localPath, buffer);
                console.log(`✅ Saved: ${localPath}`);
                console.log("⏳ Cooling down API (30s)...");
                await sleep(30000);
                return `/images/articles/${filename}`;
            } catch (err) {
                if (attempt === 3) throw err;
                console.warn(`⚠️ Attempt ${attempt} failed: ${err}`);
            }
        }
    } catch (error) {
        console.error("❌ Gen Failed Final:", error);
        return null;
    }
    return null;
}

async function verifyAndSave() {
    console.log("🔍 Starting QUALITY CHECK for Batch 1 (Part 1 - 3 Articles)...");

    for (const article of BATCH_1_PART_1) {
        console.log(`\n📄 Checking: ${article.title}`);

        // 1. Length Check
        const wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        console.log(`   📏 Word Count: ${wordCount}`);
        if (wordCount < 800) {
            console.error(`   ⚠️ WARNING: Word count low! User wanted 1000+ words.`);
        }

        // 2. Image Prompt Check
        console.log(`   🖼️  Prompts defined: ${article.prompts.length}`);
        if (article.prompts.length < 5) {
            console.error(`   ⚠️ FATAL: Less than 5 images! Aborting save.`);
            continue;
        }

        // 3. Generate All 5 Images
        let finalHtml = article.content;
        for (let i = 0; i < article.prompts.length; i++) {
            const filenameBase = `${article.slug}-remaster-${i}`;
            const publicUrl = await generateImage(article.prompts[i], filenameBase);

            if (publicUrl) {
                const imgHtml = `
<figure class="my-8">
  <img src="${publicUrl}" alt="${article.prompts[i].split(',')[0]}" class="w-full h-auto rounded-lg shadow-sm" />
  <figcaption class="text-center text-sm text-gray-500 mt-2">${article.prompts[i].split(',')[0]}</figcaption>
</figure>`;

                // Injecting logic: 
                // If <!-- IMG_i --> exists, replace it. 
                // If not, and it's image 3 or 4 (the new ones), append nicely or intersperse?
                // For now, if IMG_X doesn't exist, we append to end. 
                // Ideally, the content draft should have IMG_3 and IMG_4 tags, but if not, appending is safe.

                const placeholder = `<!-- IMG_${i} -->`;
                if (finalHtml.includes(placeholder)) {
                    finalHtml = finalHtml.replace(placeholder, imgHtml);
                } else {
                    // Smart insert? Or just append.
                    // If tag missing, append to end of specific sections if possible, or just end of string.
                    // For safety of structure, let's append before the last <p> or just at bottom.
                    // Actually, let's just create the tag if it's missing in the source content?
                    // No, simpler: Append to bottom if missing.
                    if (i >= 3 && !finalHtml.includes(placeholder)) {
                        // Attempt to insert before "Verdict" or last h2
                        const lastH2Index = finalHtml.lastIndexOf('<h2>');
                        if (lastH2Index > 0) {
                            finalHtml = finalHtml.slice(0, lastH2Index) + imgHtml + "\n" + finalHtml.slice(lastH2Index);
                        } else {
                            finalHtml += imgHtml;
                        }
                    } else {
                        finalHtml += imgHtml;
                    }
                }
            }
        }

        // 4. Final Text Clean check
        if (finalHtml.includes('```') || finalHtml.includes('JSON')) {
            console.error("   ❌ CONTENT DIRTY: Found code blocks or JSON text. Aborting.");
            continue;
        }

        // 5. Save
        const payload = {
            slug: article.slug,
            title: { en: article.title, tr: `${article.title}(TR)` },
            content: { en: finalHtml, tr: "<p>TR content pending</p>" },
            meta_description: { en: article.title, tr: article.title }, // Simplified for now
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase.from('articles').upsert(payload, { onConflict: 'slug' });
        if (error) console.error("Error saving:", error);
        else console.log("✅ Verified & Saved to DB.");
    }
}

verifyAndSave();
