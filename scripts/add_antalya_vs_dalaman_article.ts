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
            if (attempt > 1) await sleep(20000);

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
    slug: 'antalya-vs-dalaman-coast-all-inclusive',
    title: 'Antalya vs Dalaman Coast for All-Inclusive: Which Is Better for Brits?',
    meta_description: 'Choosing between Antalya and the Dalaman coast for an all-inclusive in Turkey? This UK-focused comparison breaks down vibe, beaches, transfers, resort style and who each coast suits — plus a copy-paste question list to avoid surprises (no hotel names).',
    primary_keyword: 'Antalya vs Dalaman coast all-inclusive',
    content: `<p><strong>Quick answer:</strong> If you want the most “classic” all-inclusive experience — big resorts, lots of on-site facilities, and generally simple logistics — the Antalya coast is usually the easier match for many UK travellers. If you want greener scenery, a calmer rhythm, and a more bay-and-nature feel, the Dalaman coast often suits better. Neither is “best” for everyone: it depends on your holiday style, sleep needs, and what you plan to do outside the resort.</p>

<h2>How this guide helps you choose (without overthinking)</h2>
<p>This is a practical comparison built around the questions UK travellers actually ask:</p>

<ul>
  <li>Which feels easier on arrival day?</li>
  <li>Which suits families vs couples better?</li>
  <li>Which is calmer vs more energetic?</li>
  <li>What are the common “surprises” people don’t plan for?</li>
</ul>

<p><strong>Simple rule:</strong> Choose the coast that matches your <em>daily routine</em> (pool time, meals, naps, bedtime), not the coast that looks best in one photo.</p>

<h2>One-minute decision: pick your coast fast</h2>
<ul>
  <li><strong>Choose Antalya</strong> if you want big resort choice, lots of facilities, and a “stay on-site” holiday.</li>
  <li><strong>Choose Dalaman</strong> if you want bays, greener scenery, and a calmer, more nature-led feel.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re travelling with young kids and you want predictability, Antalya often reduces friction. If you’re travelling as a couple and your top priority is switching off, Dalaman-style regions often feel more relaxed.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>Resort style: mega-resort vs bay-style relaxation</h2>

<h3>Antalya coast (often more “all-inclusive engineered”)</h3>
<ul>
  <li>Larger, purpose-built resort zones</li>
  <li>More structured entertainment schedules</li>
  <li>Lots of on-site dining and activity options</li>
  <li>Good fit for “do everything inside the resort” holidays</li>
</ul>

<p><strong>Simple rule:</strong> If you want maximum facilities per pound, Antalya-style resort zones often deliver.</p>

<h3>Dalaman coast (often more scenery-led)</h3>
<ul>
  <li>Greener backdrops and bay environments</li>
  <li>A slower, calmer “holiday rhythm” in many areas</li>
  <li>Resorts can feel more spread out and less “mega”</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you want long, slow mornings and a less high-energy atmosphere, Dalaman-style regions can be a better match — but always check the resort’s entertainment vibe.</p>

<!-- IMAGE_RESORT_LAYOUT_PLACEHOLDER -->

<h2>Transfers and arrival day: what typically feels easier</h2>
<p>For UK travellers, arrival day matters: you’re tired, hungry, and you want it to be simple.</p>

<ul>
  <li><strong>Antalya coast:</strong> often feels straightforward if you’re choosing common resort areas and standard transfer routes.</li>
  <li><strong>Dalaman coast:</strong> transfer times can vary more depending on which bay/area you’re staying in.</li>
</ul>

<p><strong>Simple rule:</strong> If you hate uncertainty on arrival day, prioritise a transfer setup you can predict and tolerate.</p>

<p>Use this planning guide: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey: Reliable Options and What to Avoid</a>.</p>

<h2>Beaches and swimming: don’t assume they’re the same</h2>
<p>Coastlines vary across Turkey. What matters isn’t “which is better”, but what you personally want.</p>

<ul>
  <li>Some areas have long open beaches; others have smaller bays</li>
  <li>Beach surfaces can vary (sand, pebbles, platforms, or mixed)</li>
  <li>In some places the resort experience is pool-led rather than beach-led</li>
</ul>

<p><strong>UK-friendly tip:</strong> If beach type matters to you (sand vs pebbles), check it specifically before you book. Don’t rely on generic “beachfront” wording.</p>

<!-- IMAGE_BEACH_COMPARISON_PLACEHOLDER -->

<h2>Who should choose which? (UK traveller profiles)</h2>

<h3>Families with young kids</h3>
<ul>
  <li><strong>Often suits Antalya</strong> if you want bigger kids’ facilities, predictable routines, and easier “everything on site”.</li>
  <li><strong>Choose Dalaman</strong> if your family prioritises calmer surroundings and downtime — and you’re comfortable checking transfer details.</li>
</ul>

<p>Use the family checklist here: <a href="/guide/all-inclusive-family-checklist">All-Inclusive for Families: The Non-Negotiables</a>.</p>

<h3>Couples (quiet break)</h3>
<ul>
  <li><strong>Often suits Dalaman</strong> for a slower rhythm and scenery-led feel.</li>
  <li><strong>Choose Antalya</strong> if you still want lots of facilities and entertainment options but plan to manage noise with room placement.</li>
</ul>

<p>Use: <a href="/guide/adults-only-all-inclusive-turkey-guide">Adults-Only All-Inclusive: How to Choose</a>.</p>

<h3>Groups / social travellers</h3>
<ul>
  <li><strong>Often suits Antalya</strong> if you want more entertainment options and a lively resort atmosphere.</li>
  <li><strong>Dalaman</strong> can still work if you choose a resort style that matches your nightlife expectations.</li>
</ul>

<!-- IMAGE_SCENERY_PLACEHOLDER -->

<p><strong>Simple rule:</strong> If nightlife is the goal, focus on the resort vibe first, not just the coast.</p>

<h2>Food and dining: what changes between coasts?</h2>
<p>The bigger factor is usually the resort category and operating style rather than the coastline itself. Still, your experience can differ based on the type of resort you choose.</p>

<ul>
  <li>Larger resorts may offer more venue variety</li>
  <li>Quieter resorts may offer fewer venues but a calmer dining atmosphere</li>
  <li>À la carte access often depends on booking rules and limits</li>
</ul>

<p>To avoid confusion, use: <a href="/guide/a-la-carte-all-inclusive-turkey">A La Carte Restaurants in All-Inclusive: How It Works in Turkey</a>.</p>

<h2>Value: where UK travellers get surprised</h2>
<p>“Value” is often lost through add-ons and mismatched expectations.</p>

<ul>
  <li>Premium drinks and special menus may be extra</li>
  <li>Some activities can be chargeable</li>
  <li>Transfer type (shared vs private) changes comfort and timing</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re hunting value, spend money on sleep (room placement/layout) and daily reality (snacks/drinks you’ll actually use) before paying for “nice-to-have” extras.</p>

<p>Value framework: <a href="/guide/best-all-inclusive-value-uk-turkey">How to Get the Best All-Inclusive Value from the UK</a>.</p>

<!-- IMAGE_VALUE_COMPARISON_PLACEHOLDER -->

<h2>Copy-paste checklist: questions that decide Antalya vs Dalaman for you</h2>
<p>Copy and paste this list into your notes while comparing options:</p>

<ul>
  <li>What’s the typical <strong>transfer time</strong> to this exact area (and is it shared or private)?</li>
  <li>Is the holiday mainly <strong>resort-led</strong> (you stay on-site) or <strong>explore-led</strong> (you’ll go out)?</li>
  <li>What is the beach like: <strong>sand, pebbles, platform, or mixed</strong>?</li>
  <li>How late does evening entertainment usually run, and can we request a <strong>quiet room</strong>?</li>
  <li>Do we have reliable <strong>snack access</strong> and meals that match our routine?</li>
  <li>How do à la carte restaurants work: <strong>booking, limits, chargeable items</strong>?</li>
  <li>Are there any common extras people pay for (water sports, spa, games room)?</li>
</ul>

<p><strong>Simple rule:</strong> If you can’t get clear answers on transfer time + beach type + noise/room placement, you’re not ready to decide between coasts yet.</p>

<h2>Final decision: the “3 priorities” method</h2>
<p>Write down your top 3 priorities and choose the coast that supports them best.</p>

<ul>
  <li><strong>Priority: easiest logistics</strong> → often Antalya</li>
  <li><strong>Priority: calm + scenery</strong> → often Dalaman</li>
  <li><strong>Priority: maximum facilities</strong> → often Antalya</li>
  <li><strong>Priority: slower rhythm</strong> → often Dalaman</li>
</ul>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Antalya vs Dalaman Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `antalya-vs-dalaman-coast-comparison-${timestamp}.jpg`,
            prompt: "A split composition or wide concept shot showing the difference between a large Antalya resort (pools, scale) and a green Dalaman bay (pine trees, calm water). Authentic travel photography style, sunny, inviting."
        },
        {
            placeholder: '<!-- IMAGE_RESORT_LAYOUT_PLACEHOLDER -->',
            filename: `mega-resort-aerial-view-antalya-${timestamp}.jpg`,
            prompt: "High angle view of a large, well-designed all-inclusive resort in Antalya. multiple pools, gardens, beachfront. Shows scale and facilities. Realistic, not a 3D render."
        },
        {
            placeholder: '<!-- IMAGE_SCENERY_PLACEHOLDER -->',
            filename: `dalaman-coast-green-bay-scenery-${timestamp}.jpg`,
            prompt: "A stunning, calm bay on the Dalaman coast (like Gocek or Fethiye style). Pine forests meeting turquoise water. Peace, nature, sailing boats in distance. Authentic Turkish landscape."
        },
        {
            placeholder: '<!-- IMAGE_BEACH_COMPARISON_PLACEHOLDER -->',
            filename: `beach-texture-pebble-sand-authentic-${timestamp}.jpg`,
            prompt: "A close up ground level shot of a mixed sand and pebble beach in Turkey, with clear water lapping the shore. Sunlight on stones. Authentic nature detail used to illustrate beach types."
        },
        {
            placeholder: '<!-- IMAGE_VALUE_COMPARISON_PLACEHOLDER -->',
            filename: `couple-looking-at-map-turkey-coast-${timestamp}.jpg`,
            prompt: "A couple looking at a map of Turkey's coast, deciding where to go. Relaxed outdoor setting. Authentic travel decision moment. Natural light."
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
        title: { en: ARTICLE_DATA.title, tr: "Antalya vs Dalaman Sahili Karşılaştırması (TR Pasif)" },
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
