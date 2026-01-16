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
    slug: 'adults-only-all-inclusive-turkey-guide',
    title: 'Adults-Only All-Inclusive in Turkey: How to Choose (Quiet Luxury vs Party Resorts)',
    meta_description: 'Adults-only all-inclusive in Turkey can mean very different things — from calm, low-noise breaks to lively, late-night resorts. This UK-focused guide helps you choose the right vibe, avoid surprises, and ask the right questions (no hotel names).',
    primary_keyword: 'adults-only all-inclusive in Turkey',
    content: `<p><strong>Quick answer:</strong> “Adults-only” doesn’t automatically mean quiet. Some adults-only all-inclusive resorts in Turkey are built for daytime relaxation and early nights; others are designed around DJs, late bars and high-energy pool scenes. Decide your vibe first (quiet luxury vs party), then book a region and resort style that matches it — and ask specific questions about noise, dining, and what “included” really means.</p>

<h2>What “adults-only” usually means (and what it doesn’t)</h2>
<p>Adults-only policies vary. In practice, adults-only all-inclusive in Turkey often means:</p>

<ul>
  <li>No children in key areas (sometimes the entire property, sometimes specific zones)</li>
  <li>A more “couples / friends” atmosphere</li>
  <li>Less kid-focused entertainment and facilities</li>
</ul>

<p>It does <strong>not</strong> automatically guarantee:</p>
<ul>
  <li>Silence at night</li>
  <li>Premium drinks included</li>
  <li>À la carte dining without limits</li>
  <li>Luxury service standards</li>
</ul>

<p><strong>Simple rule:</strong> Treat “adults-only” as an <em>audience filter</em>, not a vibe guarantee.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>Step 1: Pick your vibe — Quiet Luxury or Party Resort?</h2>

<h3>Quiet luxury (switch-off, low noise, slow days)</h3>
<p>This style is for you if you want:</p>
<ul>
  <li>Calm pool areas and quieter background music</li>
  <li>More lounging, less scheduled hype</li>
  <li>Dinners that feel un-rushed</li>
  <li>Earlier bedtimes and genuinely restful nights</li>
</ul>

<p><strong>UK-friendly tip:</strong> If your idea of a perfect holiday involves reading by the pool and being asleep before midnight, you’re shopping for <em>quiet luxury</em> — not “adults-only” in general.</p>

<!-- IMAGE_QUIET_POOL_PLACEHOLDER -->

<h3>Party resort (high energy, late nights, social scene)</h3>
<p>This style is for you if you want:</p>
<ul>
  <li>Daytime events (music by the pool, hosted activities)</li>
  <li>Late bars and a social, outgoing crowd</li>
  <li>Entertainment that runs into the night</li>
  <li>A “holiday feels like a festival” vibe</li>
</ul>

<p><strong>Simple rule:</strong> If you care about sleep, avoid resorts where the main stage/bar sits directly under most rooms.</p>

<!-- IMAGE_PARTY_VIBE_PLACEHOLDER -->

<h2>Step 2: Choose the right region for your adult trip style</h2>
<p>Regions shape atmosphere. Not “better/worse” — just different.</p>

<ul>
  <li><strong>Classic all-inclusive zones:</strong> Often bigger resorts, more structured entertainment, easier transfers.</li>
  <li><strong>Greener bay-style regions:</strong> Often calmer surroundings and a slower pace (but always check the resort’s entertainment style).</li>
  <li><strong>Explore-friendly coastal areas:</strong> Good if you want to mix resort comfort with meals out and day trips.</li>
</ul>

<p>Use this region guide as your starting point: <a href="/guide/best-regions-for-all-inclusive-turkey">Best Regions for All-Inclusive in Turkey: Which Coast Fits Your Style?</a>.</p>

<h2>Step 3: Know what matters most for couples (beyond the photos)</h2>

<h3>1) Noise and room placement</h3>
<ul>
  <li>Evening shows, live music and bars can be central</li>
  <li>Pool speakers can run late in party-style resorts</li>
  <li>Service areas (deliveries, staff routes) can be noisy early morning</li>
</ul>

<p><strong>UK-friendly tip:</strong> Ask for a “quiet room” and specify what you mean: away from stage, bars, and main pool.</p>

<h3>2) Dining that fits your pace</h3>
<p>Adults-only trips often revolve around food and drinks. Ask how dining works in reality:</p>
<ul>
  <li>Are there multiple dining venues or mostly one buffet?</li>
  <li>Do à la carte restaurants require booking and are there visit limits?</li>
  <li>Are there late snacks if you eat later than average?</li>
</ul>

<p>To avoid confusion, read: <a href="/guide/a-la-carte-all-inclusive-turkey">A La Carte Restaurants in All-Inclusive: How It Works in Turkey</a>.</p>

<!-- IMAGE_DINING_PLACEHOLDER -->

<h3>3) Drinks: what’s included vs what’s “premium”</h3>
<p>All-inclusive drink policies differ. Some properties include a standard range; others upsell premium options.</p>

<ul>
  <li>Check the included hours for bars</li>
  <li>Ask whether certain items are chargeable (premium spirits, cocktails, branded items)</li>
  <li>Ask if any venues are “extra-cost” even inside the resort</li>
</ul>

<p><strong>Simple rule:</strong> Don’t compare resorts by “included list length”. Compare them by the drinks you’ll actually order.</p>

<!-- IMAGE_DRINKS_PLACEHOLDER -->

<h2>“Avoid surprises” checklist: copy-paste questions for adults-only bookings</h2>
<p>Copy and paste these into your notes or message thread when comparing options:</p>

<ul>
  <li>Is the property <strong>fully adults-only</strong> or does it have <strong>adults-only zones</strong>?</li>
  <li>What time does <strong>evening entertainment</strong> typically finish?</li>
  <li>Where is the <strong>main stage/bar</strong> located relative to standard rooms?</li>
  <li>Is there a <strong>quiet pool</strong> or calm area away from music?</li>
  <li>Do à la carte restaurants require <strong>booking</strong>, and is there a <strong>limit</strong> per stay?</li>
  <li>What’s the policy on <strong>premium drinks</strong> and <strong>cocktails</strong>?</li>
  <li>Are there any <strong>chargeable</strong> experiences couples often assume are included?</li>
  <li>What’s the typical <strong>transfer time</strong> and is it shared or private?</li>
</ul>

<p>For transfers and what to look for, see: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey: Reliable Options and What to Avoid</a>.</p>

<h2>Common UK traveller surprises (and how to prevent them)</h2>
<ul>
  <li><strong>Adults-only ≠ quiet:</strong> Confirm noise levels and entertainment hours.</li>
  <li><strong>À la carte limits:</strong> Some places restrict visits or require early booking.</li>
  <li><strong>Premium upgrades:</strong> Some “special” venues or menus may be chargeable.</li>
  <li><strong>Room view vs reality:</strong> A great view can come with stage noise — ask location questions.</li>
</ul>

<p>For a fuller breakdown of extras, read: <a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts (What UK Travellers Get Surprised By)</a>.</p>

<h2>How to decide fast: a simple decision tree</h2>
<ul>
  <li><strong>If sleep is your priority:</strong> choose quiet luxury style + request a quiet room + prioritise calm zones.</li>
  <li><strong>If social nightlife is your priority:</strong> choose party style + accept late music + focus on bar and event variety.</li>
  <li><strong>If you want both:</strong> pick a mixed-vibe resort and plan “quiet days, lively nights” — but confirm a quiet room is possible.</li>
</ul>

<p><strong>Simple rule:</strong> You can’t outsmart a loud resort with earplugs. Choose the right vibe from the start.</p>

<h2>Mini packing list for an adults-only all-inclusive (UK practical)</h2>
<ul>
  <li>Light evening layer (useful after sunset depending on season)</li>
  <li>Comfortable footwear for larger resort layouts</li>
  <li>Reusable bottle (handy on pool days)</li>
  <li>Smart-casual outfit (some à la carte venues expect it)</li>
</ul>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Adults-Only Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `adults-only-turkey-sunset-couple-${timestamp}.jpg`,
            prompt: "A couple watching a stunning sunset at a high-end Turkish resort. Silhouette against the orange sky, holding wine glasses. Peaceful, romantic, quiet luxury vibe. Authentic / cinematic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_QUIET_POOL_PLACEHOLDER -->',
            filename: `quiet-adults-pool-reading-${timestamp}.jpg`,
            prompt: "A quiet, adults-only infinity pool in Turkey. A person reading a book on a comfortable lounger. calm blue water, pine trees in background. Silence and relaxation themes. Authentic."
        },
        {
            placeholder: '<!-- IMAGE_PARTY_VIBE_PLACEHOLDER -->',
            filename: `adults-resort-evening-social-${timestamp}.jpg`,
            prompt: "An elegant evening social scene at a Turkish resort. People talking at a beach bar with string lights. Sophisticated atmosphere, not a wild rave. Stylish relaxed clothing. Authentic travel night shot."
        },
        {
            placeholder: '<!-- IMAGE_DINING_PLACEHOLDER -->',
            filename: `romantic-dinner-sea-view-${timestamp}.jpg`,
            prompt: "A romantic dinner setup for two by the sea in Turkey. White tablecloth, candles, wine, seafood. Twilight blue hour lighting. Upscale all-inclusive dining. Realistic."
        },
        {
            placeholder: '<!-- IMAGE_DRINKS_PLACEHOLDER -->',
            filename: `premium-cocktails-bar-close-${timestamp}.jpg`,
            prompt: "Close up of two beautifully garnished premium cocktails on a marble bar top. Blurred resort lights in background. Focus on quality and freshness. Authentic drink photography."
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Yetişkin Oteli Rehberi (TR Pasif)" },
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
