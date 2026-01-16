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
    slug: 'is-turkey-safe-for-uk-tourists-practical-guide',
    title: 'Is Turkey Safe for UK Tourists? A Calm, Practical Guide for a Smooth Trip',
    meta_description: 'Turkey is a well-established holiday destination for UK travellers — and most trips are straightforward with simple planning. This calm guide focuses on practical habits, emergency basics (save 112), and UK-friendly checklists to help you feel confident without fear-mongering.',
    primary_keyword: 'is Turkey safe for UK tourists',
    content: `<p><strong>Quick answer:</strong> Turkey is a straightforward place to holiday when you plan like a confident traveller: choose the right base for your style, use official transport options, keep your essentials organised, and save the key help details before you land (including the national emergency number, 112). This guide keeps it calm and practical — no drama, just the habits that make your trip feel easy.</p>

<h2>What “feeling safe” actually means on holiday</h2>
<p>Most UK travellers don’t want a lecture — they want a holiday that runs smoothly. In real life, “feeling safe” usually comes down to:</p>

<ul>
  <li><strong>Clarity:</strong> knowing how you’ll get from the airport to your accommodation</li>
  <li><strong>Control:</strong> having your essentials, documents, and contacts in one place</li>
  <li><strong>Comfort:</strong> staying in an area that matches your vibe (quiet, family-friendly, lively)</li>
  <li><strong>Backup:</strong> knowing what to do if you need help</li>
</ul>

<p><strong>Simple rule:</strong> The calmer your plan, the calmer your holiday feels.</p>

<h2>Choose the right base (this solves most “worries” instantly)</h2>
<p>For UK travellers, the best confidence boost is choosing the right region and resort style for your trip — so you’re not fighting your own routine (late arrivals, long transfers, noisy evenings, constant travel).</p>

<ul>
  <li><strong>Want an easy, resort-led break?</strong> Choose a base that’s designed for all-inclusive living.</li>
  <li><strong>Want a calmer, scenery-led holiday?</strong> Choose a bay-style base and prioritise quiet comfort.</li>
  <li><strong>Want to explore?</strong> Choose a base that makes day trips realistic (without long travel days).</li>
</ul>

<p>Start here: <a href="/guide/best-regions-for-all-inclusive-turkey">Best Regions for All-Inclusive in Turkey</a>.</p>

<p><strong>UK-friendly tip:</strong> Most “holiday stress” isn’t about the country — it’s about picking the wrong base for your style.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>Transport that feels simple: arrive, transfer, relax</h2>
<p>Your arrival day sets the mood. The best approach is to make your transfer plan boring (in the best way).</p>

<ul>
  <li>If your transfer is included in a package, confirm whether it’s <strong>shared</strong> or <strong>private</strong></li>
  <li>If you’re booking separately, choose a transfer option with <strong>clear meeting instructions</strong></li>
  <li>Families often prefer direct transfers because it reduces friction when everyone is tired</li>
</ul>

<p>Use: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey: Reliable Options and What to Avoid</a>.</p>

<p><strong>Simple rule:</strong> The “best” transfer is the one you can do happily after a flight.</p>

<!-- IMAGE_TRANSPORT_PLACEHOLDER -->

<h2>Your calm “before you fly” essentials (2-minute setup)</h2>
<p>Do this once and you’ll feel instantly more confident.</p>

<ul>
  <li>Save the national emergency number: <strong>112</strong></li>
  <li>Screenshot your accommodation address and transfer instructions</li>
  <li>Keep passport + travel documents together (with a digital backup)</li>
  <li>Have a simple plan for mobile data (eSIM/SIM/roaming)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Screenshot > search. When you land, your phone might not be “ready” instantly.</p>

<!-- IMAGE_EMERGENCY_INFO_PLACEHOLDER -->

<h2>Getting help in Turkey: keep it simple</h2>
<p>You don’t need to memorise lots of numbers. The main thing is knowing the single emergency number and having your trip details accessible.</p>

<ul>
  <li><strong>Emergency:</strong> call <strong>112</strong></li>
  <li><strong>Non-urgent issues:</strong> contact your accommodation reception or your travel provider first</li>
  <li><strong>Documents:</strong> keep a photo of your passport and travel insurance details</li>
</ul>

<p><strong>Simple rule:</strong> Save the number, save your details, and you’ll rarely need anything else.</p>

<h2>Money & cards: how to keep payments easy</h2>
<p>A smooth trip is often about smooth spending. Keep it simple and flexible.</p>

<ul>
  <li>Carry a mix of card + a small amount of cash for day-to-day convenience</li>
  <li>Know your bank’s travel settings before you go</li>
  <li>Keep one backup card stored separately</li>
</ul>

<!-- IMAGE_DOCUMENTS_PLACEHOLDER -->

<p><strong>UK-friendly tip:</strong> “Backup card in a different place” is the quiet travel habit that saves holidays.</p>

<h2>Confidence checklist: copy-paste questions for your accommodation or travel agent</h2>
<p>Use these questions to feel fully sorted before you travel:</p>

<ul>
  <li>What is the typical <strong>transfer time range</strong> to this exact area, and is it shared or private?</li>
  <li>Where exactly is the <strong>pickup/meeting point</strong> at the airport?</li>
  <li>Can we request a <strong>quiet room</strong> away from evening entertainment and service areas?</li>
  <li>What’s the best way to contact you on arrival day (WhatsApp/phone)?</li>
  <li>Is there a simple <strong>late arrival</strong> plan (food/snacks/check-in steps)?</li>
</ul>

<p>Helpful supporting reads:</p>
<ul>
  <li><a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts</a></li>
  <li><a href="/guide/package-vs-separate-turkey">Package Holiday vs Booking Separately for Turkey</a></li>
  <li><a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a></li>
</ul>

<h2>On-the-ground “good traveller habits” (positive, easy, effective)</h2>
<p>These are simple habits that make any destination feel smoother — and they work brilliantly in Turkey too.</p>

<ul>
  <li>Use official/arranged transport options where possible (it reduces confusion)</li>
  <li>Keep your phone charged when you’re out for the day</li>
  <li>Stick to areas that match your plan (resort-led vs explore-led)</li>
  <li>Ask staff for the easiest option — people are generally helpful, and it saves time</li>
</ul>

<p><strong>UK-friendly tip:</strong> A confident traveller asks one clear question and moves on. Overthinking is what makes travel feel hard.</p>

<h2>Quick wrap: the “calm holiday formula”</h2>
<ul>
  <li><strong>Right base</strong> (region + vibe)</li>
  <li><strong>Simple transfer</strong> (clear pickup plan)</li>
  <li><strong>Organised essentials</strong> (screenshots + backups)</li>
  <li><strong>One help number saved</strong> (112)</li>
</ul>

<!-- IMAGE_RELAXED_VIBE_PLACEHOLDER -->

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Safety Guide Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `confident-uk-traveller-airport-turkey-${timestamp}.jpg`,
            prompt: "A relaxed and confident UK traveller walking through a modern, clean Turkish airport terminal with organised luggage. Smiling, checking phone casually. Authentic travel confidence. Bright, modern atmosphere."
        },
        {
            placeholder: '<!-- IMAGE_TRANSPORT_PLACEHOLDER -->',
            filename: `official-transfer-vehicle-waiting-authentic-${timestamp}.jpg`,
            prompt: "A clean, official transfer vehicle (minivan) waiting kerbside at an airport or hotel in Turkey. Clear signage. Professional driver nearby. Authentic travel logistics moment. Reassuring."
        },
        {
            placeholder: '<!-- IMAGE_EMERGENCY_INFO_PLACEHOLDER -->',
            filename: `smartphone-screen-112-saved-authentic-${timestamp}.jpg`,
            prompt: "A close up of a smartphone screen held in a hand. The screen shows '112' saved as an emergency contact. Focus on safety preparation. Authentic detail shot. Natural light."
        },
        {
            placeholder: '<!-- IMAGE_DOCUMENTS_PLACEHOLDER -->',
            filename: `travel-documents-passport-on-table-authentic-${timestamp}.jpg`,
            prompt: "British passport, boarding pass, and travel insurance printout neatly organised on a coffee table next to a cup of tea. Preparation and organization. Authentic home or hotel setting."
        },
        {
            placeholder: '<!-- IMAGE_RELAXED_VIBE_PLACEHOLDER -->',
            filename: `relaxed-couple-sunset-tea-turkey-${timestamp}.jpg`,
            prompt: "A calm couple enjoying Turkish tea at a quiet café with a sunset view. Relaxed body language, feeling safe and happy. Authentic travel moment. Warm evening light."
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye Güvenli mi? Pratik Rehber (TR Pasif)" },
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
