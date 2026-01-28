import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleAuth } from 'google-auth-library';

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

// --- Types ---
interface ArticleSection {
    type: 'text' | 'image' | 'list';
    content?: string; // HTML for text, prompt for image
    items?: string[]; // For lists
    alt?: string;     // For images (SEO)
    caption?: string; // For images (User Facing) - STRICTLY SEPARATED
    level?: number;   // For headers h2, h3
}

interface ArticleConfig {
    slug: string;
    title: string;
    meta_description: string;
    sections: ArticleSection[];
    keywords: string[];
}

// --- Helpers ---
async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Imagen 3 Generator ---
async function generateImageVertex(prompt: string, filename: string): Promise<string | null> {
    console.log(`🎨 Generating Image: ${filename}`);
    console.log(`   Prompt: "${prompt}"`);

    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);
    if (fs.existsSync(localPath)) {
        console.log(`⏩ File exists, skipping generation.`);
        return `/images/articles/${filename}`;
    }

    if (!fs.existsSync('google-credentials.json')) {
        console.warn("⚠️ 'google-credentials.json' missing. Skipping AI generation.");
        return null; // Return null so we can maybe use a placeholder?
    }

    const auth = new GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const url = `https://${IMAGEN_LOCATION}-aiplatform.googleapis.com/v1/projects/${IMAGEN_PROJECT_ID}/locations/${IMAGEN_LOCATION}/publishers/google/models/${IMAGEN_MODEL_ID}:predict`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instances: [{ prompt }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "16:9",
                    safetySetting: "block_only_high",
                    personGeneration: "allow_adult",
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Vertex API Error: ${response.status} ${await response.text()}`);
        }

        const data = await response.json();
        if (!data.predictions?.[0]?.bytesBase64Encoded) {
            throw new Error('No image returned');
        }

        const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
        fs.writeFileSync(localPath, buffer);
        console.log(`✅ Saved to ${localPath}`);
        return `/images/articles/${filename}`;

    } catch (error) {
        console.error("❌ Image Generation Failed:", error);
        return null;
    }
}

// --- Validations ---
function sanitizeContent(html: string): string {
    // 1. Unescape literal \n
    let clean = html.replace(/\\n/g, '\n');

    // 2. Remove accidentally leaked JSON snippets
    if (clean.trim().startsWith('{') || clean.trim().endsWith('}')) {
        console.warn("⚠️ Warning: Text block starts/ends with { or }. Check for leakage.");
    }

    // 3. Remove prompt keywords from TEXT (not image prompts)
    const badKeywords = ['hyper-realistic', 'do not pose', 'camera settings'];
    badKeywords.forEach(kw => {
        const regex = new RegExp(kw, 'gi');
        clean = clean.replace(regex, '');
    });

    return clean;
}

// --- Main Builder ---
export async function createArticle(config: ArticleConfig) {
    console.log(`\n🚀 Building Article: ${config.title}`);

    let htmlContent = "";
    let coverImageUrl = "";

    const timestamp = Date.now();

    for (const section of config.sections) {
        if (section.type === 'text') {
            if (section.level) {
                const tag = `h${section.level}`;
                htmlContent += `<${tag}>${sanitizeContent(section.content || "")}</${tag}>\n`;
            } else {
                htmlContent += `<p>${sanitizeContent(section.content || "")}</p>\n`;
            }
        }
        else if (section.type === 'list') {
            htmlContent += `<ul>\n`;
            section.items?.forEach(item => {
                htmlContent += `  <li>${sanitizeContent(item)}</li>\n`;
            });
            htmlContent += `</ul>\n`;
        }
        else if (section.type === 'image') {
            // Generate Image
            const filename = `${config.slug}-${timestamp}-${Math.floor(Math.random() * 1000)}.jpg`;
            const publicUrl = await generateImageVertex(section.content || "", filename); // prompt is in content

            if (publicUrl) {
                if (!coverImageUrl) coverImageUrl = publicUrl;

                // STRICT HTML STRUCTURE for Images
                // caption is purely user facing text.
                // alt is for SEO.
                htmlContent += `
<figure class="my-8">
  <img src="${publicUrl}" alt="${section.alt}" class="w-full h-auto rounded-lg shadow-md" />
  ${section.caption ? `<figcaption class="text-center text-sm text-gray-500 mt-2 italic">${section.caption}</figcaption>` : ''}
</figure>
`;
            } else {
                console.warn(`⚠️ Skipping image section due to generation failure.`);
            }
        }
    }

    // Add Date
    htmlContent += `<p class="mt-8 text-sm text-gray-500"><em>Last updated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</em></p>`;

    // DB Insert (Safe JSON Wrapper)
    const payload = {
        slug: config.slug,
        title: { en: config.title, tr: `${config.title} (TR Pasif)` },
        meta_description: { en: config.meta_description, tr: "TR Pasif" },
        content: { en: htmlContent, tr: "<p>Turkish content not available.</p>" },
        cover_image_url: coverImageUrl,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    console.log("💾 Saving to Database...");

    const { error } = await supabase.from('articles').upsert(payload, { onConflict: 'slug' });

    if (error) {
        console.error("❌ DB Insert Failed:", error);
    } else {
        console.log("✅ Custom Article Created Successfully!");
        console.log(`🔗 Link: http://localhost:3000/en/guide/${config.slug}`);
    }
}
