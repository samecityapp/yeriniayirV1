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
    slug: 'turkey-resort-transfers-guide',
    title: 'Resort Transfers in Turkey: Reliable Options and What to Avoid (UK Traveller Guide)',
    meta_description: 'Not sure how to get from the airport to your resort in Turkey? This UK-focused guide explains the main transfer options, how to judge reliability, what to check before you land, and copy-paste questions that help you avoid avoidable hassles (no hotel names).',
    primary_keyword: 'resort transfers in Turkey',
    content: `<p><strong>Quick answer:</strong> For most UK travellers heading to resorts in Turkey, the most reliable transfer choices are either a transfer included in your package holiday (often shared) or a pre-booked private transfer with clear pickup instructions. Taxis can work, but reliability depends on the exact airport, time of day, and your comfort with on-the-spot arrangements. The key to avoiding hassles is to confirm <strong>who meets you, where, when, and what happens if your flight is delayed</strong>.</p>

<h2>Why transfers feel confusing (and how to simplify it)</h2>
<p>Airport-to-resort transfers sound simple until you factor in:</p>

<ul>
  <li>Different airports serving multiple resort areas</li>
  <li>Shared transfers with multiple stops</li>
  <li>Late arrivals and flight delays</li>
  <li>Families with luggage, pushchairs, and tired kids</li>
</ul>

<p><strong>Simple rule:</strong> A “good transfer” is the one that matches your stress tolerance — not the one that looks cheapest.</p>

<p>If you’re still choosing where to base yourself, start here: <a href="/guide/best-regions-for-all-inclusive-turkey">Best Regions for All-Inclusive in Turkey</a>.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>The main transfer options (what UK travellers typically use)</h2>

<h3>Option 1: Package-included transfer (often shared)</h3>
<p>If you book a package holiday, a transfer is often included. It may be a shared coach/minibus with multiple drop-offs.</p>

<ul>
  <li><strong>Pros:</strong> simple, organised, usually good value, less planning</li>
  <li><strong>Cons:</strong> can be slower (multiple stops), less flexible, waiting time possible</li>
</ul>

<p><strong>UK-friendly tip:</strong> Ask (or check) whether your transfer is shared, and whether it’s a coach or smaller vehicle. It changes the comfort level a lot.</p>

<h3>Option 2: Pre-booked private transfer</h3>
<p>A private transfer is typically a driver meeting you and taking you directly to your accommodation.</p>

<ul>
  <li><strong>Pros:</strong> door-to-door, faster, easier with kids, less waiting</li>
  <li><strong>Cons:</strong> costs more than shared, you must book carefully</li>
</ul>

<p><strong>Simple rule:</strong> If you’re arriving late, travelling with kids, or you value peace of mind, private transfers often feel “worth it”.</p>

<!-- IMAGE_PRIVATE_TRANSFER_PLACEHOLDER -->

<h3>Option 3: Taxi on arrival</h3>
<p>Taxis are available at airports, but the experience can vary depending on timing and location. This option suits travellers who are comfortable with on-the-spot logistics.</p>

<ul>
  <li><strong>Pros:</strong> no pre-booking, straightforward for short distances</li>
  <li><strong>Cons:</strong> less predictability, you need clarity on price/route, queues can happen</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you choose a taxi, focus on clarity: confirm the approximate cost and route expectations before you set off.</p>

<h3>Option 4: Car hire (drive yourself)</h3>
<p>Car hire can work well if you want to explore, but it’s not always the “easy” option after a flight.</p>

<ul>
  <li><strong>Pros:</strong> freedom, good for exploring, no waiting for transfers</li>
  <li><strong>Cons:</strong> fatigue after travel, navigation, parking, and driving confidence required</li>
</ul>

<p><strong>Simple rule:</strong> If your holiday is mostly resort-based, you often don’t need a car — a transfer is simpler.</p>

<p>For booking style comparisons, see: <a href="/guide/package-vs-separate-turkey">Package Holiday vs Booking Separately for Turkey</a>.</p>

<h2>Shared vs private: how to decide (real-life scenarios)</h2>

<h3>Choose shared if…</h3>
<ul>
  <li>You’re travelling as adults and don’t mind extra time</li>
  <li>You want the simplest “included” solution</li>
  <li>You’re arriving in daytime and don’t mind a longer ride</li>
</ul>

<h3>Choose private if…</h3>
<ul>
  <li>You’re travelling with toddlers or children who melt down when tired</li>
  <li>You’re landing late (or you just want to minimise friction)</li>
  <li>You want to go straight to your accommodation with no extra stops</li>
  <li>You’re carrying a lot of luggage or special items (pushchair, sports kit)</li>
</ul>

<!-- IMAGE_SHARED_TRANSFER_PLACEHOLDER -->

<p><strong>UK-friendly tip:</strong> Private transfers are often “value” for families because they reduce the worst part of the day — arrival and departure stress.</p>

<h2>What affects transfer time (and why it’s hard to promise a number)</h2>
<p>Transfer time depends on variables that change by day and season. Instead of trusting a single “minutes” claim, check the factors.</p>

<ul>
  <li><strong>Distance to your area</strong> (some airports serve multiple resort zones)</li>
  <li><strong>Number of stops</strong> (shared transfers)</li>
  <li><strong>Traffic</strong> (time of day)</li>
  <li><strong>Route</strong> (coastal roads, mountain roads, urban roads)</li>
</ul>

<p><strong>Simple rule:</strong> Ask for a <em>typical range</em> and whether your transfer is direct or multi-stop.</p>

<h2>Reliability checklist (how to judge a transfer before you book)</h2>
<p>These checks reduce the chance of confusion on arrival.</p>

<ul>
  <li><strong>Meeting point:</strong> exactly where will the driver/rep be waiting?</li>
  <li><strong>Signage:</strong> what name will be on the sign (yours, the company, or a reference code)?</li>
  <li><strong>Contact method:</strong> do you have a working number/WhatsApp for the day of travel?</li>
  <li><strong>Flight tracking:</strong> will they monitor delays, or do you need to message?</li>
  <li><strong>Vehicle details:</strong> is it a car/minivan/coach, and is it air-conditioned?</li>
  <li><strong>Luggage policy:</strong> does the vehicle suit your luggage and pushchair needs?</li>
</ul>

<p><strong>UK-friendly tip:</strong> Screenshot your booking confirmation and meeting instructions. Airport Wi-Fi or data can be patchy right when you need it.</p>

<!-- IMAGE_AIRPORT_SIGN_PLACEHOLDER -->

<h2>What to avoid (without going into “fear” mode)</h2>
<p>You don’t need to be paranoid — just organised. Most problems happen because travellers don’t confirm basics.</p>

<ul>
  <li><strong>Vague instructions</strong> like “meet outside” without a terminal/exit reference</li>
  <li><strong>No backup contact</strong> (no working number/message option)</li>
  <li><strong>Unclear pricing</strong> if you’re doing on-arrival taxis</li>
  <li><strong>Assuming all transfers are direct</strong> (shared can include multiple stops)</li>
</ul>

<p><strong>Simple rule:</strong> If you don’t know where you’re being met and who to contact, it’s not a “reliable” plan yet.</p>

<h2>Copy-paste questions to send before your trip</h2>
<p>Copy and paste these into your message/email to your provider or travel agent:</p>

<ul>
  <li>Where exactly is the <strong>meeting point</strong> in the arrivals area (terminal/exit)?</li>
  <li>What name will be on the <strong>sign</strong>?</li>
  <li>Is the transfer <strong>private or shared</strong>, and how many stops are typical?</li>
  <li>Do you <strong>track flight delays</strong>, or should we message if we land late?</li>
  <li>What is the <strong>contact number / WhatsApp</strong> for travel day issues?</li>
  <li>What type of vehicle is it (car/minivan/coach) and is it <strong>air-conditioned</strong>?</li>
  <li>Is there a child seat option if needed (and what’s the process)?</li>
  <li>What’s the plan if we can’t find the driver within 10 minutes?</li>
</ul>

<!-- IMAGE_CHECKLIST_PLACEHOLDER -->

<h2>Departure day transfers: don’t forget this part</h2>
<p>Leaving the resort can be more stressful than arriving if you don’t know pickup time and location.</p>

<ul>
  <li>Confirm pickup time the day before (or ask how it will be confirmed)</li>
  <li>Ask where the vehicle will stop (main entrance, security gate, lobby)</li>
  <li>Build in buffer time for traffic and check-in queues</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re on a shared transfer back to the airport, expect earlier pickups — that’s normal because the vehicle is collecting other travellers too.</p>

<h2>How transfers link to “all-inclusive value”</h2>
<p>A smooth transfer can make a holiday feel more premium, even if the resort isn’t top-tier. If you’re comparing deals, include transfer comfort in your value calculation.</p>

<ul>
  <li>Families often get more “value” from private transfers than from premium drinks</li>
  <li>Late arrivals often benefit from direct, pre-booked transfers</li>
  <li>Shared transfers make sense when you’re flexible on time</li>
</ul>

<p>Use this framework: <a href="/guide/best-all-inclusive-value-uk-turkey">How to Get the Best All-Inclusive Value from the UK</a>.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Resort Transfers Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `airport-transfer-driver-sign-turkey-${timestamp}.jpg`,
            prompt: "A professional airport transfer driver holding a name sign in a modern Turkish airport arrivals hall. clean, bright, convenient atmosphere. Travellers walking by with luggage. Authentic arrival day vibe."
        },
        {
            placeholder: '<!-- IMAGE_PRIVATE_TRANSFER_PLACEHOLDER -->',
            filename: `private-transfer-minivan-family-loading-${timestamp}.jpg`,
            prompt: "A family loading luggage into a clean, modern private transfer minivan in Turkey. Sunny day, ease of travel. Driver helping. Authentic travel logistical moment. Not a generic stock photo."
        },
        {
            placeholder: '<!-- IMAGE_SHARED_TRANSFER_PLACEHOLDER -->',
            filename: `tour-coach-bus-interior-passengers-${timestamp}.jpg`,
            prompt: "Interior of a modern, clean shared transfer coach or bus. Comfortable seats, air conditioning. Passengers relaxing on the way to a resort. Authentic view."
        },
        {
            placeholder: '<!-- IMAGE_AIRPORT_SIGN_PLACEHOLDER -->',
            filename: `airport-meeting-point-signage-turkey-${timestamp}.jpg`,
            prompt: "Clear signage at a Turkish airport (like Antalya or Dalaman) showing 'Meeting Point' or 'Tour Operators'. Authentic environmental detail photo. Helpful for travellers."
        },
        {
            placeholder: '<!-- IMAGE_CHECKLIST_PLACEHOLDER -->',
            filename: `smartphone-checking-booking-confirmation-${timestamp}.jpg`,
            prompt: "A traveller checking a booking confirmation or WhatsApp message on their smartphone at the airport. Focus on the phone screen and airport background blur. Authentic modern travel."
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye Otel Transfer Rehberi (TR Pasif)" },
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
