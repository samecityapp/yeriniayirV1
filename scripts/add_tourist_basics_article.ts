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
    slug: 'turkey-tourist-basics-brits-documents-check-in-guide',
    title: 'Turkey Tourist Basics for Brits: Documents, Check-In, and a Smooth Arrival Day (No Stress)',
    meta_description: 'Planning Turkey from the UK? This practical guide covers the exact documents to prep (passport validity + visa basics), what to screenshot before you fly, and a simple arrival-day checklist from airport to check-in — plus FAQs to keep everything smooth.',
    primary_keyword: 'Turkey travel documents UK tourists',
    content: `<p><strong>Quick answer:</strong> A smooth Turkey trip from the UK is mostly admin done well: check your passport validity (Turkey uses a 150-day rule for British citizen passports), know the simple visa-free allowance for tourism, keep your key info in screenshots, and have a clear transfer plan so you can arrive, check in, and relax.</p>

<h2>The 5-minute “before you fly” checklist (do this once)</h2>
<ul>
  <li><strong>Passport:</strong> check validity against Turkey’s entry rules for British citizens.</li>
  <li><strong>Travel insurance:</strong> have your policy details accessible (Turkey isn’t covered by UK GHIC/EHIC).</li>
  <li><strong>Arrival plan:</strong> know how you’ll get from the airport to your accommodation (shared vs private). <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey</a></li>
  <li><strong>Screenshots:</strong> save your accommodation address + transfer instructions for offline access.</li>
  <li><strong>Emergency:</strong> save 112 in your phone (national emergency number).</li>
</ul>

<p><strong>Simple rule:</strong> If you can’t open it in 10 seconds with no signal, screenshot it.</p>

<!-- IMAGE_PASSPORT_PREP_PLACEHOLDER -->

<h2>Entry basics for British citizens (keep it simple)</h2>

<h3>Passport validity (the one rule most people forget)</h3>
<p>For travellers using a full “British citizen” passport, Turkey requires:</p>
<ul>
  <li>Your passport expiry date must be <strong>at least 150 days after your arrival date</strong></li>
  <li>Your passport must have <strong>at least 1 blank page</strong></li>
</ul>
<p>That’s the practical check that keeps your trip smooth.</p>

<h3>Visa allowance for tourism (the headline you actually need)</h3>
<p>For British citizen passport holders visiting for tourism or business, you can visit Turkey <strong>without a visa</strong> for up to <strong>90 days in any 180-day period</strong>.</p>

<p><strong>UK-friendly tip:</strong> If you don’t hold a full British citizen passport (or you’re staying for a different reason), check the official guidance before booking.</p>

<h2>Travel insurance and health basics (calm and practical)</h2>
<p>UK EHIC/GHIC cards are <strong>not valid in Turkey</strong>, so travel insurance is the straightforward way to keep your trip feeling easy if you ever need care.</p>

<p><strong>Simple rule:</strong> Insurance is part of a relaxed holiday plan — not a “maybe later” job.</p>

<!-- IMAGE_AIRPORT_ARRIVAL_PLACEHOLDER -->

<h2>Arrival day: the smooth step-by-step flow</h2>

<h3>Step 1: Land → get organised (2 minutes)</h3>
<ul>
  <li>Turn your phone on, get your data plan working (or wait until you’re settled if you prefer).</li>
  <li>Open your screenshots: address, booking, transfer instructions.</li>
  <li>Keep passport and documents together until you’re checked in.</li>
</ul>

<h3>Step 2: Airport → transfer (make it boring on purpose)</h3>
<p>The easiest arrival day is the one with a clear pickup plan.</p>
<ul>
  <li><strong>Package transfer:</strong> confirm if it’s shared and where to meet.</li>
  <li><strong>Private transfer:</strong> confirm meeting point, sign name, and travel-day contact.</li>
  <li><strong>DIY plans:</strong> choose the option that matches your stress tolerance, not just price.</li>
</ul>

<p>Use: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey: Reliable Options and What to Avoid</a></p>

<!-- IMAGE_TRANSFER_VAN_PLACEHOLDER -->

<p><strong>Simple rule:</strong> Arrival day is not the day to “figure it out live”.</p>

<h3>Step 3: Check-in (what to have ready)</h3>
<ul>
  <li>Passports for everyone on the booking</li>
  <li>Your booking confirmation (screenshot or email)</li>
  <li>A quick note of any preferences (quiet room, twin beds, cot, etc.)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Ask one clear question at check-in, then relax. Over-explaining is what makes travel feel hard.</p>

<!-- IMAGE_HOTEL_CHECKIN_PLACEHOLDER -->

<h2>Money and customs: simple clarity (no drama)</h2>

<h3>Taking money in/out (what’s officially stated)</h3>
<p>UK travellers often ask about bringing money for holiday spending. Official guidance states:</p>
<ul>
  <li>There is <strong>no limit</strong> on the amount of foreign currency or Turkish lira you can take <strong>into</strong> Turkey.</li>
  <li>There are rules on taking currency <strong>out</strong> of Turkey above certain thresholds, including declaration requirements.</li>
</ul>
<p>If you’re moving larger amounts, check the official wording before you travel.</p>

<p><strong>Simple rule:</strong> For normal holiday spending, keep it easy: card + a small amount of cash for convenience.</p>

<h2>Families: the “make day one easy” checklist</h2>
<ul>
  <li>Pack essentials in hand luggage (wipes, snacks, a spare top)</li>
  <li>Choose the simplest transfer option if kids are likely to crash after the flight</li>
  <li>Ask about late food/snacks if you arrive late</li>
  <li>Confirm room layout (a “family room” can mean different things)</li>
</ul>

<p>Use the full UK parent checklist: <a href="/guide/all-inclusive-family-checklist">All-Inclusive for Families: The Non-Negotiables</a></p>

<h2>Copy-paste messages (fast, clear, UK-friendly)</h2>

<h3>Message to your transfer provider</h3>
<ul>
  <li>“Hi — can you confirm the exact meeting point in arrivals (terminal/exit), what name will be on the sign, and the contact number/WhatsApp for travel day?”</li>
</ul>

<h3>Message to your accommodation before arrival</h3>
<ul>
  <li>“Hi — we arrive on [date/time]. Can you confirm late check-in is smooth, and whether there’s any food/snack option if we arrive late?”</li>
  <li>“If possible, we’d love a quiet room away from evening entertainment.”</li>
</ul>

<p><strong>UK-friendly tip:</strong> The best message is short, polite, and specific.</p>

<!-- IMAGE_RELAXED_HOLIDAY_VIBE_PLACEHOLDER -->

<h2>FAQ: UK travellers’ Turkey arrival questions</h2>

<h3>Do British citizens need a visa for a normal Turkey holiday?</h3>
<p>For tourism, British citizen passport holders can visit without a visa for up to 90 days in any 180-day period.</p>

<h3>What’s the passport validity rule for Turkey?</h3>
<p>Your passport must have an expiry date at least 150 days after the date you arrive, and at least one blank page.</p>

<h3>Is UK GHIC/EHIC valid in Turkey?</h3>
<p>No — official UK guidance states EHIC and GHIC are not valid in Turkey, so travel insurance is the practical approach.</p>

<h3>What emergency number should I save in Turkey?</h3>
<p>Save 112 — it’s the national emergency number.</p>

<h3>What’s the best way to reduce stress on arrival day?</h3>
<p>Have screenshots ready (address, booking, transfer), and choose a transfer plan you’ll be happy with after a flight. The simplest plan usually feels the best.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Tourist Basics Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_PASSPORT_PREP_PLACEHOLDER -->',
            filename: `british-passport-travel-prep-authentic-${timestamp}.jpg`,
            prompt: "A close-up, high-angle shot of a British passport and a boarding pass resting on a rustic wooden coffee table next to a cup of coffee. Warm, natural sunlight casting soft shadows. Extremely realistic texture of the passport cover and paper. Authentic travel preparation vibe. 4k resolution, highly detailed."
        },
        {
            placeholder: '<!-- IMAGE_AIRPORT_ARRIVAL_PLACEHOLDER -->',
            filename: `turkish-airport-arrival-hall-authentic-${timestamp}.jpg`,
            prompt: "A candid, slightly blurred view from the perspective of a traveler walking through a modern Turkish airport arrival hall. Glass windows with bright daylight. People with luggage in the distance. Authentic travel documentary style. Cinematic lighting, realistic atmosphere, not staged."
        },
        {
            placeholder: '<!-- IMAGE_TRANSFER_VAN_PLACEHOLDER -->',
            filename: `transfer-van-waiting-airport-turkey-${timestamp}.jpg`,
            prompt: "A sleek black transfer van waiting curbside at a sunny Turkish airport. Driver standing casually nearby (blurred faces). Blue sky, palm tree in background. Photorealistic, high contrast, sharp focus on the vehicle reflecting the sun. Authentic travel logistics."
        },
        {
            placeholder: '<!-- IMAGE_HOTEL_CHECKIN_PLACEHOLDER -->',
            filename: `hotel-reception-checkin-authentic-${timestamp}.jpg`,
            prompt: "A close-up over-the-shoulder shot of a hotel receptionist's hand handing a key card to a guest. Warm, welcoming hotel lobby lighting. Blurred background of a stylish hotel interior. Authentic, candid moment. Highly realistic textures and skin tones."
        },
        {
            placeholder: '<!-- IMAGE_RELAXED_HOLIDAY_VIBE_PLACEHOLDER -->',
            filename: `relaxed-tourists-walking-resort-authentic-${timestamp}.jpg`,
            prompt: "A couple walking away from the camera down a lush, sun-drenched path in a Turkish holiday resort. Luggage rolling beside them. Dappled sunlight through trees. Relaxed, peaceful atmosphere. Photorealistic, cinematic composition, authentic holiday feeling."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('PASSPORT')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover
            if (item.filename.includes('passport')) {
                coverImageUrl = publicUrl;
            }
            // Insert image
            const imgTag = `<img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
            finalContent = finalContent.replace(item.placeholder, imgTag);
        } else {
            console.warn("⚠️ Image generation failed for:", item.filename);
            finalContent = finalContent.replace(item.placeholder, '');
        }
    }

    // Insert into DB
    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "İngiliz Turistler İçin Türkiye Temelleri (TR Pasif)" },
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
