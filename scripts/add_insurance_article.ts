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
    slug: 'travel-insurance-turkey-uk-guide',
    title: 'Travel Insurance for Turkey from the UK: What to Check for a Truly Relaxed Trip',
    meta_description: 'Turkey is a brilliant, easy holiday choice for Brits — and the best trips start with one simple admin win: the right travel insurance. This UK-friendly guide explains what to check (medical, cancellations, activities, excess), what to save on your phone, and copy-paste questions — plus FAQs.',
    primary_keyword: 'travel insurance for Turkey from the UK',
    content: `<p><strong>Quick answer:</strong> Travel insurance for Turkey is mostly about confidence and convenience: make sure your policy covers medical care, cancellations/changes, baggage delays, and any activities you’ll actually do. Don’t overbuy features you won’t use — just get the right basics, save your policy details offline, and you’ll travel feeling calm and sorted.</p>

<h2>Why this matters (in a positive way)</h2>
<p>Turkey is a well-established destination for UK travellers. Insurance isn’t about expecting problems — it’s about keeping your holiday smooth if plans change or you need support. For Turkey specifically, it’s worth remembering that UK GHIC/EHIC cards are designed for use in certain countries and <strong>do not cover Turkey</strong>, so travel insurance is the straightforward “relaxed trip” setup. (You can still carry a GHIC for other trips.)</p>
<p><strong>UK-friendly tip:</strong> Think of insurance like airport transfers: you may never “use” it, but having it sorted makes everything feel easier.</p>
<p><a href="/guide/emergency-numbers-pharmacies-getting-help-turkey-guide">Emergency Numbers, Pharmacies & Getting Help in Turkey</a></p>

<h2>The 6 checks that make your policy “Turkey-ready”</h2>

<h3>1) Medical cover (the core)</h3>
<ul>
  <li>Emergency medical treatment (the main thing)</li>
  <li>Hospital costs (including private care if needed)</li>
  <li>Repatriation (getting you home if you’re advised to travel back)</li>
</ul>
<p><strong>Simple rule:</strong> If the medical cover is unclear, it’s not the right policy.</p>

<!-- IMAGE_MEDICAL_HOSPITAL_SIGN_PLACEHOLDER -->

<h3>2) Cancellation and curtailment (your plan changes)</h3>
<ul>
  <li>Cancellation cover if you can’t travel for covered reasons</li>
  <li>Curtailment cover if you need to return early for covered reasons</li>
  <li>Clear timelines for when you must notify the insurer</li>
</ul>
<p><strong>UK-friendly tip:</strong> If your trip is high-value (flights, transfers, prepaid extras), prioritise cancellation clarity.</p>

<!-- IMAGE_FLIGHT_BOARD_CANCEL_PLACEHOLDER -->

<h3>3) Baggage and delays (keeping day one easy)</h3>
<ul>
  <li>Baggage delay cover (so you can buy essentials and enjoy day one)</li>
  <li>Lost/stolen items cover (especially phones)</li>
  <li>Any single-item limits (important for cameras/tech)</li>
</ul>
<p><strong>Simple rule:</strong> Your phone is usually the most important “item” on holiday — check how it’s covered.</p>

<!-- IMAGE_BAGGAGE_CLAIM_PLACEHOLDER -->

<h3>4) Excess (know what you’d pay)</h3>
<p>The excess is what you pay towards a claim. A low premium can come with a higher excess.</p>
<ul>
  <li>Check the excess for medical and baggage claims</li>
  <li>Check if you can reduce excess (and whether it’s worth it)</li>
</ul>
<p><strong>UK-friendly tip:</strong> “Cheap policy + high excess” often feels less helpful when you actually need it.</p>

<h3>5) Pre-existing medical conditions (don’t leave this vague)</h3>
<ul>
  <li>If anyone travelling has pre-existing conditions, declare them properly</li>
  <li>Check written confirmation that the condition is covered</li>
</ul>
<p><strong>Simple rule:</strong> If it isn’t declared/confirmed, assume it isn’t covered.</p>

<h3>6) Activities and add-ons (cover what you’ll actually do)</h3>
<p>Most travellers just need standard holiday cover. If you’re doing activities beyond pool-and-beach, check what’s included.</p>
<ul>
  <li>Water activities (if you plan them)</li>
  <li>Day trips and guided experiences</li>
  <li>Any “adventure” activity categories in your policy wording</li>
</ul>
<p><strong>UK-friendly tip:</strong> Don’t pay for activities you won’t do — just make sure the activities you <em>will</em> do are covered.</p>

<h2>One important UK detail: travel advice and policy validity</h2>
<p>Insurers can link coverage to official UK travel advice. The easy approach is simply: check the official advice for the specific region you’re visiting so your policy remains valid as written.</p>
<p><strong>Simple rule:</strong> Travel where your policy expects you to travel — it keeps everything clean and simple.</p>

<!-- IMAGE_PASSPORT_INSURANCE_DOC_PLACEHOLDER -->

<h2>What to save on your phone (so it’s actually useful)</h2>
<ul>
  <li>Policy number and emergency assistance phone number</li>
  <li>A PDF or screenshot of your policy schedule (offline access)</li>
  <li>A note of any declared medical conditions and the insurer’s confirmation</li>
  <li>Your travel dates and address details (screenshots)</li>
</ul>

<p>Pair this with your arrival-day setup: <a href="/guide/turkey-tourist-basics-brits-documents-check-in-guide">Turkey Tourist Basics for Brits: Documents & Arrival Day</a></p>

<!-- IMAGE_PHONE_SAVE_DETAILS_PLACEHOLDER -->

<h2>How to buy the “right” policy without overthinking</h2>
<p>Use this simple decision method:</p>
<ul>
  <li><strong>Start with your trip type:</strong> city break, resort, family, long stay</li>
  <li><strong>Add what’s non-negotiable:</strong> medical + cancellation clarity</li>
  <li><strong>Match your activities:</strong> standard vs add-ons</li>
  <li><strong>Check excess + item limits:</strong> especially for phones/tech</li>
</ul>

<p><strong>UK-friendly tip:</strong> The best policy is the one you understand. Clarity beats complexity.</p>

<h2>Copy-paste questions to ask before you buy</h2>
<p>Copy and paste these into your notes or chat with a provider:</p>
<ul>
  <li>Does this policy cover <strong>medical treatment</strong> in Turkey and <strong>repatriation</strong> if advised?</li>
  <li>What is the <strong>excess</strong> for medical and baggage claims?</li>
  <li>What is the <strong>single item limit</strong> (especially for phones/cameras)?</li>
  <li>Is <strong>baggage delay</strong> covered, and what can I claim for essentials?</li>
  <li>Are my <strong>planned activities</strong> included, or do I need an add-on?</li>
  <li>If we have <strong>pre-existing conditions</strong>, are they declared and confirmed in writing?</li>
  <li>How quickly must we contact you if we need help while abroad?</li>
</ul>

<h2>FAQ: travel insurance for Turkey (UK travellers)</h2>

<h3>Do I need travel insurance for Turkey from the UK?</h3>
<p>Most UK travellers choose travel insurance because it keeps the trip stress-free if you need medical support, have cancellations, or face baggage delays. UK GHIC/EHIC cards do not cover Turkey, so insurance is the straightforward option for cover.</p>

<h3>What’s the most important part of a Turkey policy?</h3>
<p>Medical cover (including hospital care and repatriation) plus clear cancellation terms. After that, check excess and item limits for phones/tech.</p>

<h3>Should families buy different cover?</h3>
<p>Families often benefit from strong cancellation clarity and baggage delay cover (so day one stays easy). The “right” cover is the one that matches your reality: kids, luggage, and timing.</p>

<h3>Do I need extra cover for an all-inclusive holiday?</h3>
<p>Usually standard cover is enough. Just check whether any activities you plan (water activities, excursions) need an add-on.</p>

<h3>What should I keep offline on my phone?</h3>
<p>Your policy number, the insurer’s emergency assistance number, and screenshots/PDFs of your policy schedule and confirmations.</p>

<h3>Does official UK travel advice matter for insurance?</h3>
<p>It can. The simplest approach is to check official advice for the specific region you’re visiting and make sure your insurance expectations match your itinerary.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Insurance Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_PASSPORT_INSURANCE_DOC_PLACEHOLDER -->',
            filename: `travel-insurance-policy-passport-authentic-${timestamp}.jpg`,
            prompt: "A flat lay of a British passport next to a printed travel insurance policy document on a wooden table. Reading glasses nearby. Authentic travel planning preparation. Soft morning light. High quality."
        },
        {
            placeholder: '<!-- IMAGE_MEDICAL_HOSPITAL_SIGN_PLACEHOLDER -->',
            filename: `modern-hospital-sign-turkey-authentic-${timestamp}.jpg`,
            prompt: "A clean, modern hospital exterior sign in Turkey (e.g. 'ACIL' or 'HASTANE'). Blue sky background. Reassuring, professional medical facility vibe. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_FLIGHT_BOARD_CANCEL_PLACEHOLDER -->',
            filename: `airport-departure-board-blurred-authentic-${timestamp}.jpg`,
            prompt: "A blurred artistic shot of an airport departure board. Focus on the atmosphere of travel transit. Authentic airport vibe. Cinematic lighting. Subtle hint of schedule changes."
        },
        {
            placeholder: '<!-- IMAGE_BAGGAGE_CLAIM_PLACEHOLDER -->',
            filename: `baggage-claim-carousel-authentic-${timestamp}.jpg`,
            prompt: "A traveller waiting at a baggage claim carousel. Suitcase coming into view. Authentic airport arrival moment. Realistic lighting and depth of field."
        },
        {
            placeholder: '<!-- IMAGE_PHONE_SAVE_DETAILS_PLACEHOLDER -->',
            filename: `saving-insurance-details-phone-authentic-${timestamp}.jpg`,
            prompt: "A close-up of a person saving a document (insurance PDF) on their smartphone. Screen shows a generic document icon. Authentic POV shot. Tech savviness in travel. High resolution."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('PASSPORT')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the passport one?
            if (item.filename.includes('passport')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye Seyahat Sigortası Rehberi (TR Pasif)" },
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
