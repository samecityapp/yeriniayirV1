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
    slug: 'emergency-numbers-pharmacies-getting-help-turkey-guide',
    title: 'Emergency Numbers, Pharmacies & Getting Help in Turkey: UK Traveller Essentials',
    meta_description: 'Turkey has a simple national emergency system (dial 112) and an easy-to-use pharmacy network (look for “Eczane”, with after-hours “Nöbetçi Eczane” duty pharmacies). This UK-friendly guide explains what to save, how to find help fast, and copy-paste questions for a smooth trip.',
    primary_keyword: 'emergency numbers in Turkey for UK travellers',
    content: `<p><strong>Quick answer:</strong> Save <strong>112</strong> before you land. It’s Turkey’s main emergency number. For everyday health needs, pharmacies are easy to spot (look for the sign “Eczane”), and after hours there are always designated <strong>on-duty pharmacies</strong> (“Nöbetçi Eczane”) listed on pharmacy doors. With a 2-minute setup and a few calm habits, getting help in Turkey is usually straightforward.</p>

<h2>The 2-minute setup (do this before you fly)</h2>
<ul>
  <li>Save <strong>112</strong> in your phone as “Turkey Emergency”.</li>
  <li>Screenshot your accommodation address (in English + any local spelling shown on your booking).</li>
  <li>Screenshot your transfer instructions / pickup plan (if you have one).</li>
  <li>Save your travel insurance details somewhere easy to reach.</li>
  <li>Store a photo of your passport in a secure place on your phone (and keep the original safe).</li>
</ul>

<p><strong>Simple rule:</strong> If you can’t access it offline in 10 seconds, it doesn’t count as “prepared”.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>Emergency help in Turkey: keep it simple</h2>

<h3>The main number to know</h3>
<ul>
  <li><strong>112</strong> — the national emergency number (use for urgent situations when you need immediate help).</li>
</ul>

<p><strong>UK-friendly tip:</strong> Save the number and don’t overthink the rest. In an urgent moment, one clear number beats a long list.</p>

<h3>What to say when you call</h3>
<p>You don’t need perfect wording. Aim for calm, clear basics:</p>
<ul>
  <li>Your location (airport / town / area name)</li>
  <li>What you need (medical help / urgent assistance)</li>
  <li>Your name and a callback number</li>
</ul>

<p><strong>Simple rule:</strong> Location first, then the problem.</p>

<h2>Pharmacies in Turkey (Eczane): how they work</h2>
<p>Pharmacies are one of the easiest “help points” for travellers in Turkey. They’re common, clearly signed, and practical for everyday needs.</p>

<h3>How to spot one</h3>
<ul>
  <li>Look for the word <strong>“Eczane”</strong> (pharmacy).</li>
  <li>If you’re unsure, ask your accommodation reception for the nearest pharmacy.</li>
</ul>

<h3>What happens after hours (Nöbetçi Eczane)</h3>
<p>Outside normal hours, Turkey uses a duty pharmacy system:</p>
<ul>
  <li>There are designated <strong>on-duty pharmacies</strong> (“<strong>Nöbetçi Eczane</strong>”).</li>
  <li>Closed pharmacies typically post the address/details of the on-duty pharmacy on the door/window.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If it’s late, don’t search for “a pharmacy that’s open” — search for the <em>on-duty pharmacy</em> (“Nöbetçi Eczane”).</p>

<!-- IMAGE_PHARMACY_SIGN_PLACEHOLDER -->

<p>If you’re planning a family all-inclusive, add “nearest pharmacy” to your arrival-day checklist: <a href="/guide/all-inclusive-family-checklist">All-Inclusive for Families: The Non-Negotiables</a>.</p>

<h2>When to use a pharmacy vs when to get medical care</h2>
<p>This is a practical (not medical) way to decide your next step.</p>

<h3>Pharmacy is great for everyday holiday needs</h3>
<ul>
  <li>Simple travel essentials you forgot</li>
  <li>Basic over-the-counter requests (ask the pharmacist what’s best for your situation)</li>
  <li>Advice on what to do next if you feel unwell</li>
</ul>

<p><strong>Simple rule:</strong> If it’s minor and you’re unsure, a pharmacy is often the quickest first step.</p>

<h3>Medical care makes sense when you need a clinician</h3>
<ul>
  <li>If you feel you need a doctor assessment (not just an over-the-counter solution)</li>
  <li>If symptoms are persistent or worsening</li>
  <li>If you’re not comfortable self-managing</li>
</ul>

<!-- IMAGE_FIRST_AID_PLACEHOLDER -->

<p><strong>UK-friendly tip:</strong> For non-urgent public appointments, Turkey has a national appointment system (also accessible by the <strong>182</strong> call line). This can be useful if you need a scheduled consultation rather than emergency care.</p>

<p>For a smooth “no surprises” approach to your whole trip setup, use: <a href="/guide/best-all-inclusive-value-uk-turkey">How to Get the Best All-Inclusive Value from the UK</a>.</p>

<h2>Travel cover: one key UK detail to know (quick and calm)</h2>
<p>For UK travellers, it’s worth remembering that <strong>UK GHIC/EHIC cards are not valid in Turkey</strong>, so travel insurance is the practical way to keep your trip feeling simple if you ever need care.</p>

<p><strong>Simple rule:</strong> Insurance is part of a calm holiday plan, not a “just in case” afterthought.</p>

<p>Want this in a one-page prep format? See: <a href="/guide/what-to-pack-for-turkey-holiday-list">Turkey Trip Prep Checklist for UK Travellers</a>.</p>

<h2>Copy-paste questions (useful messages to send or ask)</h2>
<p>These questions save time and reduce confusion.</p>

<h3>For your transfer / arrival plan</h3>
<ul>
  <li>Where exactly is the pickup point (terminal/exit reference)?</li>
  <li>Is the transfer direct or shared (and how many stops are typical)?</li>
  <li>What’s the contact method on the day of travel if we can’t find the pickup point?</li>
</ul>

<p>Transfer planning guide: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey</a>.</p>

<h3>For your accommodation reception (local help)</h3>
<ul>
  <li>Where is the nearest pharmacy (“Eczane”) from here?</li>
  <li>Where is the on-duty pharmacy (“Nöbetçi Eczane”) tonight?</li>
  <li>If we need a doctor appointment, what’s the simplest local route?</li>
</ul>

<!-- IMAGE_RECEPTION_HELP_PLACEHOLDER -->

<p><strong>UK-friendly tip:</strong> Reception teams are used to these questions. Ask once, save the answer, and move on with your holiday.</p>

<h2>Mini “help kit” list (small items, big convenience)</h2>
<ul>
  <li>Plasters and basic first-aid essentials</li>
  <li>Sun protection + aftersun</li>
  <li>Rehydration basics (especially in hot weather)</li>
  <li>Your regular prescription items (packed in hand luggage, if possible)</li>
</ul>

<p><strong>Simple rule:</strong> Bring the small essentials you always end up buying — it keeps your trip smoother and your time more enjoyable.</p>

<!-- IMAGE_DUTY_PHARMACY_LIST_PLACEHOLDER -->

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Emergency Help Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `emergency-number-112-on-phone-screen-${timestamp}.jpg`,
            prompt: "A close up of a smartphone screen in a hand against a blurred Turkish street background. The screen displays '112 Emergency' saved in large clear text. Focus on safety preparedness. Authentic style."
        },
        {
            placeholder: '<!-- IMAGE_PHARMACY_SIGN_PLACEHOLDER -->',
            filename: `eczane-pharmacy-sign-turkey-street-${timestamp}.jpg`,
            prompt: "A classic red 'E' or 'Eczane' pharmacy sign on a Turkish street. Clear, recognizable signage. Daytime, sunny. Authentic travel photography. Helps tourists identify pharmacies."
        },
        {
            placeholder: '<!-- IMAGE_FIRST_AID_PLACEHOLDER -->',
            filename: `travel-first-aid-kit-essentials-${timestamp}.jpg`,
            prompt: "A small open travel first-aid kit on a hotel table. Plasters, sanitizer, basic meds. Authentic travel packing vibe. Natural lighting."
        },
        {
            placeholder: '<!-- IMAGE_RECEPTION_HELP_PLACEHOLDER -->',
            filename: `asking-hotel-reception-for-directions-${timestamp}.jpg`,
            prompt: "A traveller at a hotel reception desk asking a staff member for advice or directions. Friendly interaction. Staff member pointing to a map or writing something down. Authentic hotel service."
        },
        {
            placeholder: '<!-- IMAGE_DUTY_PHARMACY_LIST_PLACEHOLDER -->',
            filename: `nobetci-eczane-duty-pharmacy-list-on-window-${timestamp}.jpg`,
            prompt: "Close up of a list taped to a pharmacy window in Turkey (Nöbetçi Eczane list). It shows addresses of pharmacies open on duty. Night time or late evening context but legible. Helpful travel detail."
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye Acil Numaralar ve Eczaneler Rehberi (TR Pasif)" },
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
