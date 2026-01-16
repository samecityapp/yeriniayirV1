import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

// Configuration
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = 'us-central1';
const API_ENDPOINT = 'us-central1-aiplatform.googleapis.com';
const MODEL_ID = 'imagen-3.0-generate-001';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLES_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'articles');
if (!fs.existsSync(ARTICLES_IMAGE_DIR)) {
    fs.mkdirSync(ARTICLES_IMAGE_DIR, { recursive: true });
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Imagen 3 Generation Function ---
async function generateImageVertex(prompt: string, filename: string, retries = 3) {
    console.log(`🎨 Generating ${filename} with Imagen 3...`);

    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);
    if (fs.existsSync(localPath)) {
        console.log(`⏩ File exists, skipping: ${filename}`);
        return `/images/articles/${filename}`;
    }

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

    if (!PROJECT_ID) {
        console.error("❌ GOOGLE_CLOUD_PROJECT_ID missing.");
        return null;
    }

    const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predict`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            if (attempt > 1) await sleep(20000); // 20s delay between retries

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
                if (response.status === 429) {
                    console.warn(`⏳ Quota exceeded (429). Waiting 30s before retry ${attempt + 1}...`);
                    await sleep(30000);
                    continue;
                }
                const errText = await response.text();
                throw new Error(`Vertex API Error: ${response.status} - ${errText}`);
            }

            const data = await response.json();

            if (!data.predictions || data.predictions.length === 0) {
                throw new Error('No predictions returned');
            }

            const base64Image = data.predictions[0].bytesBase64Encoded;
            const buffer = Buffer.from(base64Image, 'base64');

            fs.writeFileSync(localPath, buffer);
            console.log(`✅ Saved: ${localPath}`);

            return `/images/articles/${filename}`;
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed:`, error);
            if (attempt === retries) return null;
        }
    }
    return null;
}

const ARTICLE_DATA = {
    slug: 'best-regions-for-all-inclusive-turkey',
    title: 'Best Regions for All-Inclusive in Turkey: Which Coast Fits Your Style?',
    meta_description: 'Choosing the right coast matters more than most UK travellers think. This guide compares Turkey’s main all-inclusive regions (Mediterranean, Dalaman area, and Aegean) so you can pick the best base for your style.',
    primary_keyword: 'best regions for all-inclusive in Turkey',
    content: `<p><strong>Quick answer:</strong> If you want big, feature-packed all-inclusive resorts and the easiest “arrive and switch off” experience, the Mediterranean coast around Antalya is usually the simplest choice. If you prefer greener scenery and a calmer pace, the Dalaman area often fits better. If you want more local character and day trips alongside all-inclusive comfort, the Aegean coast is a strong match.</p>

<h2>Why choosing the region matters (more than the resort)</h2>
<p>In Turkey, two all-inclusive holidays can feel completely different even if they look similar online. The <strong>coast you choose</strong> influences:</p>

<ul>
  <li>Transfer time and how “easy” arrival day feels</li>
  <li>Beach style (sand, shingle, platforms, or mixed)</li>
  <li>Resort layout and atmosphere (mega-resort vs lower-density)</li>
  <li>What you’ll realistically do outside the resort</li>
</ul>

<p><strong>Simple rule:</strong> Pick your coast first, then compare resorts within that region.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>Region 1: Mediterranean coast (Antalya area) — the classic all-inclusive hub</h2>

<h3>Best for</h3>
<ul>
  <li>First-time Turkey visitors from the UK</li>
  <li>Families who want everything on-site</li>
  <li>Travellers who prioritise short, straightforward transfers</li>
  <li>Anyone who likes lots of facilities and structured entertainment</li>
</ul>

<h3>What it’s like</h3>
<ul>
  <li>Large-scale resorts designed for all-day, on-site living</li>
  <li>Multiple pools, activities schedules, evening shows</li>
  <li>A reliable “package holiday” feel</li>
</ul>

<!-- IMAGE_ANTALYA_PLACEHOLDER -->

<p><strong>UK-friendly tip:</strong> If your ideal holiday is “land, transfer, wristband, done”, this is the coast built for that.</p>

<p>If you want a clear idea of what all-inclusive usually covers (and what it often doesn’t), read <a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a>.</p>

<h2>Region 2: The Dalaman area — greener scenery and a more relaxed rhythm</h2>

<h3>Best for</h3>
<ul>
  <li>Couples and chilled-out groups</li>
  <li>Families who want space and a calmer vibe</li>
  <li>Travellers who like nature, views, and quieter surroundings</li>
</ul>

<h3>What it’s like</h3>
<ul>
  <li>More natural landscape: bays, hills, pine-backed beaches</li>
  <li>Resorts that can feel less “mega” and more spread out</li>
  <li>A slightly slower pace overall (less constant entertainment)</li>
</ul>

<!-- IMAGE_DALAMAN_PLACEHOLDER -->

<p><strong>Simple rule:</strong> If you want all-inclusive comfort without a high-energy resort atmosphere, the Dalaman area is often a better fit.</p>

<p><strong>UK-friendly tip:</strong> Double-check transfer time before you book — it can vary by bay and road route. Use <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey</a> to plan reliably.</p>

<h2>Region 3: Aegean coast — local character with all-inclusive convenience</h2>

<h3>Best for</h3>
<ul>
  <li>Travellers who want to explore nearby towns</li>
  <li>Adults and older families who prefer a less “big resort” feel</li>
  <li>People who like mixing pool time with culture and food spots</li>
</ul>

<h3>What it’s like</h3>
<ul>
  <li>More “out-and-about” potential compared to pure resort zones</li>
  <li>A different look and feel to the coastline and towns</li>
  <li>All-inclusive that can be great value, but often less “theme-park” in style</li>
</ul>

<!-- IMAGE_AEGEAN_PLACEHOLDER -->

<p><strong>UK-friendly tip:</strong> If you hate the idea of staying inside the resort boundary all week, the Aegean is often the easiest coast to mix resort time with exploring.</p>

<p>Not sure whether to go package or book separately for this coast? Use <a href="/guide/package-vs-separate-turkey">Package Holiday vs Booking Separately for Turkey</a>.</p>

<h2>Choose your coast in 60 seconds (style match)</h2>
<ul>
  <li><strong>You want maximum facilities and easy logistics:</strong> Mediterranean coast (Antalya area)</li>
  <li><strong>You want nature, bays, and a calmer vibe:</strong> Dalaman area</li>
  <li><strong>You want local character and day trips:</strong> Aegean coast</li>
</ul>

<p><strong>Simple rule:</strong> If you’re travelling with kids and want predictable routines, go Mediterranean. If you want slower mornings and scenery, go Dalaman. If you want to explore, go Aegean.</p>

<h2>“Avoid surprises” checklist (copy-paste questions for your booking)</h2>
<p>Copy-paste these questions into your notes (or ask your travel agent):</p>

<ul>
  <li>What’s the <strong>typical transfer time</strong> to this area (and is it shared or private)?</li>
  <li>Is the beach <strong>sandy, pebbly, or a platform</strong> (and is there a shuttle)?</li>
  <li>Does the resort feel <strong>quiet, mixed, or lively</strong> in peak season?</li>
  <li>Are <strong>à la carte restaurants</strong> included or do they require booking/extra charges?</li>
  <li>What’s the realistic plan outside the resort: <strong>walkable area or taxi/shuttle needed</strong>?</li>
</ul>

<p>For à la carte expectations specifically, see <a href="/guide/a-la-carte-all-inclusive-turkey">A La Carte Restaurants in All-Inclusive: How It Works in Turkey</a>.</p>

<h2>Common UK traveller surprises by region (and how to prevent them)</h2>
<ul>
  <li><strong>Beach assumptions:</strong> “Turkey = long sandy beaches” isn’t true everywhere. Coastlines vary by region.</li>
  <li><strong>Atmosphere mismatch:</strong> Some areas are built for high-energy resort life; others are naturally quieter.</li>
  <li><strong>Hidden extras:</strong> Premium drinks, certain dining options, and some activities can be limited or chargeable.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re comparing costs, focus on what you’ll actually use (kids’ activities, dining, late snacks, drinks) rather than the longest “included list”.</p>

<p>To avoid cost surprises, read <a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts</a>.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Regions Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-all-inclusive-regions-map-vibe-${timestamp}.jpg`,
            prompt: "A beautiful, wide landscape shot showing the diversity of the Turkish coast. A mix of blue sea, a sandy beach, and green mountains in the distance. Sunny, inviting, high-quality travel photography style. Authentic colors. No text."
        },
        {
            placeholder: '<!-- IMAGE_ANTALYA_PLACEHOLDER -->',
            filename: `antalya-large-resort-pool-scene-${timestamp}.jpg`,
            prompt: "A large, impressive all-inclusive resort pool in Antalya. Palm trees, sun loungers, blue water. A 'mega resort' feel but tasteful. Sunny bright day. Authentic, not 3D render style."
        },
        {
            placeholder: '<!-- IMAGE_DALAMAN_PLACEHOLDER -->',
            filename: `dalaman-green-bay-resort-view-${timestamp}.jpg`,
            prompt: "A scenic view of the Dalaman coast (Fethiye or Gocek style). Green pine forests meeting the blue sea. A smaller hotel or resort nestled in nature. Peaceful, calm vibe. Authentic photography."
        },
        {
            placeholder: '<!-- IMAGE_AEGEAN_PLACEHOLDER -->',
            filename: `aegean-coast-town-hotel-mix-${timestamp}.jpg`,
            prompt: "A charming Aegean coast scene (Bodrum or nearby). White houses with bougainvillea, a clear blue sea, and a hotel nearby. A mix of local town character and holiday comfort. Authentic style."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('COVER')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            if (item.placeholder.includes('COVER')) {
                coverImageUrl = publicUrl;
                finalContent = finalContent.replace(item.placeholder, '');
            } else {
                const imgTag = `<img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
                finalContent = finalContent.replace(item.placeholder, imgTag);
            }
        } else {
            console.warn("⚠️ Image generation failed for:", item.filename);
            finalContent = finalContent.replace(item.placeholder, '');
        }
    }

    // Insert into DB
    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Her Şey Dahil Bölgeleri (TR Pasif)" },
        meta_description: { en: ARTICLE_DATA.meta_description, tr: "TR Pasif içerik." },
        content: { en: finalContent, tr: "<p>Bu içerik sadece İngilizce dilinde yayındadır.</p>" },
        cover_image_url: coverImageUrl,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });

    if (error) {
        console.error("❌ DB Insert Failed:", error);
    } else {
        console.log("✅ Article Added Successfully!");
        console.log("👉 Slug:", ARTICLE_DATA.slug);
    }
}

run();
