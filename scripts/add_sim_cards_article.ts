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
    slug: 'turkey-sim-cards-mobile-data-uk-travellers-guide',
    title: 'Turkey SIM Cards & Mobile Data for UK Travellers: eSIM vs Local SIM (Simple Setup)',
    meta_description: 'Staying connected in Turkey is easy: choose between roaming, a travel eSIM, or a local tourist SIM. This UK-friendly guide explains what to pick based on your trip style, how setup works, what to check before you land, and a copy-paste question list — plus FAQs (no hotel names).',
    primary_keyword: 'Turkey SIM cards for UK travellers',
    content: `<p><strong>Quick answer:</strong> For most UK travellers, the easiest mobile-data choice in Turkey is either (1) a travel eSIM you install before you fly, or (2) a local tourist SIM/eSIM you activate in-store after you land. Roaming can also work if your UK plan makes it simple. The “best” option depends on one thing: do you want <em>maximum convenience</em>, or <em>maximum control</em> over data and costs.</p>

<h2>Start here: pick the right option in 30 seconds</h2>
<ul>
  <li><strong>Choose Roaming</strong> if your UK plan covers Turkey on reasonable terms and you want zero setup.</li>
  <li><strong>Choose a Travel eSIM</strong> if you want to land with data ready (great for city breaks and late arrivals).</li>
  <li><strong>Choose a Local Tourist SIM/eSIM</strong> if you want a Turkish number and a “local-style” setup for your stay.</li>
</ul>

<p><strong>Simple rule:</strong> If you’ll be using maps, messaging, and booking things on the move, get reliable data sorted before day one.</p>

<!-- IMAGE_ESIM_SETUP_PLACEHOLDER -->

<h2>What most UK travellers actually need in Turkey</h2>
<p>For typical holidays, you mainly need data for:</p>
<ul>
  <li>Maps and navigation</li>
  <li>WhatsApp / iMessage / messaging</li>
  <li>Ride bookings and meeting points</li>
  <li>Banking and confirmations (secure connection helps)</li>
  <li>Restaurant and attraction lookups</li>
</ul>

<p><strong>UK-friendly tip:</strong> A little planning here makes arrival day feel effortless — especially if you’re travelling as a family or landing late.</p>

<h2>Option A: Roaming (the “no admin” choice)</h2>
<p>Roaming is the simplest option if your UK plan includes Turkey or offers a clear add-on.</p>

<h3>When roaming is a great idea</h3>
<ul>
  <li>You’re staying a short time</li>
  <li>You don’t need a local number</li>
  <li>Your provider terms are clear and you’re happy with them</li>
</ul>

<h3>What to check before you rely on roaming</h3>
<ul>
  <li>Is Turkey included in your plan, or is there a daily add-on?</li>
  <li>Any data cap / fair usage limit?</li>
  <li>Does your plan cover tethering/hotspot?</li>
</ul>

<p><strong>Simple rule:</strong> If you don’t know the rule, you don’t know the cost.</p>

<h2>Option B: Travel eSIM (the “land with data” upgrade)</h2>
<p>A travel eSIM is popular with UK travellers because you can set it up before you fly and have data ready when you land.</p>

<h3>Why travel eSIMs work well for Turkey trips</h3>
<ul>
  <li>No physical SIM swap</li>
  <li>Great for airport navigation and meeting transfers</li>
  <li>Easy for city breaks where you’ll be moving around a lot</li>
</ul>

<h3>Before you buy a travel eSIM, check these 3 basics</h3>
<ul>
  <li><strong>Your phone supports eSIM</strong> (and is network-unlocked)</li>
  <li><strong>You know your setup method</strong> (QR code / app install)</li>
  <li><strong>You understand what it includes</strong> (data-only vs data + calls)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Install the eSIM before you fly, but only switch it on when you arrive — that way it’s ready without wasting time.</p>

<!-- IMAGE_AIRPORT_SIM_SHOP_PLACEHOLDER -->

<h2>Option C: Local Tourist SIM/eSIM (the “local number” route)</h2>
<p>If you want a Turkish number for local calls/texts (or you simply prefer a local setup), a tourist SIM or tourist eSIM can be a good fit.</p>

<h3>What to expect with local tourist SIMs</h3>
<ul>
  <li>Activation is usually done in-store</li>
  <li>You’ll typically be asked for identity details during registration</li>
  <li>You’ll pick a package that suits your stay (data + minutes, etc.)</li>
</ul>

<p><strong>Simple rule:</strong> If you want a local number, plan 15–30 minutes to get set up properly.</p>

<h3>Airport shop vs city shop: which is better?</h3>
<ul>
  <li><strong>Airport:</strong> convenient if you want it done instantly after landing</li>
  <li><strong>City shop:</strong> often calmer, sometimes easier to compare options</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you land late or you’ve got kids and luggage, convenience beats optimisation — get connected first, refine later if you really want to.</p>

<!-- IMAGE_LOCAL_SIM_INSERT_PLACEHOLDER -->

<h2>One important note for longer stays (keep it calm)</h2>
<p>Most holidaymakers don’t need to think about this. But if you’ll be in Turkey for an extended period and plan to use a Turkish SIM/eSIM in a foreign-bought phone, there can be device registration rules for long-term use on local networks.</p>

<p><strong>Simple rule:</strong> For normal holidays, don’t overthink it. For long stays, check the current device-registration requirements before relying on one phone for months.</p>

<h2>Make your data last longer (easy wins)</h2>
<ul>
  <li>Download offline maps for your main areas</li>
  <li>Turn off background app refresh for heavy apps</li>
  <li>Use Low Data Mode (or similar)</li>
  <li>Save key confirmations and addresses as screenshots</li>
</ul>

<p>Pair this with your arrival-day plan: <a href="/guide/turkey-tourist-basics-brits-documents-check-in-guide">Turkey Tourist Basics for Brits</a></p>

<!-- IMAGE_MAPS_STREET_PLACEHOLDER -->

<h2>Security (positive and practical)</h2>
<p>Turkey is a modern, connected destination — and you’ll find Wi-Fi in lots of places. For a smoother trip, use mobile data for anything sensitive (banking, bookings, identity checks) and keep public Wi-Fi for lighter browsing.</p>

<p><strong>UK-friendly tip:</strong> Your phone on mobile data is often the simplest “secure default” while travelling.</p>

<h2>Copy-paste questions to ask in a SIM shop (or before you buy an eSIM)</h2>
<p>Copy and paste these into your notes — they make setup simple:</p>

<ul>
  <li>Is this <strong>data-only</strong> or <strong>data + calls</strong>?</li>
  <li>How long is it valid for (does it match my travel dates)?</li>
  <li>Can I <strong>top up</strong> easily if I need more data?</li>
  <li>Do I need to show ID/passport details for activation?</li>
  <li>Can I use <strong>hotspot/tethering</strong>?</li>
  <li>What should I do if data works but calls don’t (or vice versa)?</li>
</ul>

<p><strong>Simple rule:</strong> If you can’t explain what you’re buying in one sentence, don’t buy it yet.</p>

<h2>Best choices by trip type (UK-focused)</h2>

<h3>Istanbul / city break</h3>
<ul>
  <li>Travel eSIM or roaming works brilliantly for moving around</li>
  <li>Offline maps + transport planning = easy days</li>
</ul>
<p>Pair with: <a href="/guide/public-transport-turkey-tourist-guide">Public Transport in Turkey for UK Tourists</a></p>

<h3>All-inclusive / resort holiday</h3>
<ul>
  <li>Travel eSIM is great for arrival day + day trips</li>
  <li>Local SIM only if you want a Turkish number</li>
</ul>
<p>Pair with: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey</a></p>

<h3>Family trip</h3>
<ul>
  <li>Prioritise “works immediately” (travel eSIM or roaming)</li>
  <li>Keep one adult as the “connection lead” for maps, messages, and plans</li>
</ul>
<p>Pair with: <a href="/guide/what-to-pack-for-turkey-holiday-list">Turkey Travel Checklist for UK Tourists</a></p>

<!-- IMAGE_RELAXED_MESSAGING_PLACEHOLDER -->

<h2>FAQ: SIM cards and mobile data in Turkey (UK travellers)</h2>

<h3>Do I need a Turkish SIM in Turkey, or is Wi-Fi enough?</h3>
<p>For many travellers, having your own mobile data makes the trip smoother (maps, meeting points, bookings). Wi-Fi is a helpful bonus, but data is what makes your day easy.</p>

<h3>Is an eSIM better than a physical SIM?</h3>
<p>eSIM is often more convenient because there’s no physical swap. Physical SIMs can be great if you want a local number and in-store setup.</p>

<h3>Can I use WhatsApp in Turkey the same way as in the UK?</h3>
<p>Yes — WhatsApp works normally as long as you have data or Wi-Fi. Most travellers use WhatsApp as their main messaging tool.</p>

<h3>Should I buy a SIM at the airport?</h3>
<p>If you want instant connection right after landing, the airport is convenient. If you prefer a calmer setup and comparison time, a city shop can feel easier.</p>

<h3>Will my phone definitely work in Turkey?</h3>
<p>Most modern phones do. The key checks are: your phone is unlocked, your plan/eSIM is set up correctly, and you have data access for the apps you rely on.</p>

<h3>What’s the simplest “don’t think about it” option?</h3>
<p>If your UK roaming plan is clear and affordable for Turkey, roaming is the simplest. If not, a travel eSIM is the easiest upgrade for most people.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting SIM Card Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_ESIM_SETUP_PLACEHOLDER -->',
            filename: `travel-esim-setup-screen-authentic-${timestamp}.jpg`,
            prompt: "A close-up of a modern smartphone screen showing a 'Travel eSIM' setup complete notification. Blurred airport background. High tech, simple, authentic travel vibe. No text on screen if possible, just UI elements. High resolution."
        },
        {
            placeholder: '<!-- IMAGE_AIRPORT_SIM_SHOP_PLACEHOLDER -->',
            filename: `airport-sim-shop-istanbul-authentic-${timestamp}.jpg`,
            prompt: "A bright, clean mobile operator shop in Istanbul Airport arrivals hall. Travellers queuing politely. Authentic signage (generic telecom style). Realistic airport lighting. 4k resolution."
        },
        {
            placeholder: '<!-- IMAGE_LOCAL_SIM_INSERT_PLACEHOLDER -->',
            filename: `inserting-sim-card-cafe-authentic-${timestamp}.jpg`,
            prompt: "A traveller's hands inserting a physical SIM card into a phone at a sunny Turkish cafe table. Turkish tea glass (cay) nearby. Authentic detail, focus on hands and phone slot. Hyper realistic, no AI artifacts."
        },
        {
            placeholder: '<!-- IMAGE_MAPS_STREET_PLACEHOLDER -->',
            filename: `using-maps-istanbul-street-authentic-${timestamp}.jpg`,
            prompt: "A tourist looking at map app on their phone while standing on a lively Istanbul street. Tram passing in background. Authentic travel navigation moment. Sunlight. Detailed environment."
        },
        {
            placeholder: '<!-- IMAGE_RELAXED_MESSAGING_PLACEHOLDER -->',
            filename: `relaxed-messaging-beach-authentic-${timestamp}.jpg`,
            prompt: "A relaxed tourist lying on a sun lounger at a Turkish resort, smiling at their phone (messaging). Blue pool/sea background. Authentic holiday vibe. High resolution. Relaxed atmosphere."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('ESIM')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the maps one? Wireless/tech vibe -> eSIM or Maps. Let's use Maps as it is active.
            if (item.filename.includes('maps')) {
                coverImageUrl = publicUrl;
            }
            const imgTag = `<img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
            finalContent = finalContent.replace(item.placeholder, imgTag);

            // Fallback cover
            if (!coverImageUrl) coverImageUrl = publicUrl;

        } else {
            console.warn("⚠️ Image generation failed for:", item.filename);
            finalContent = finalContent.replace(item.placeholder, '');
        }
    }

    // Insert into DB
    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye SIM Kart ve Mobil Veri Rehberi (TR Pasif)" },
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
