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
    slug: 'pharmacies-in-turkey-uk-travellers-guide',
    title: 'Pharmacies in Turkey for UK Travellers: What to Know (Common Needs, How to Ask, No Stress)',
    meta_description: 'Pharmacies in Turkey (“eczane”) are widespread and can help with many everyday travel needs — from advice on minor issues to over-the-counter medicines and prescription dispensing. This UK-friendly guide shows how pharmacies work, how to find an on-duty pharmacy (“nöbetçi eczane”), what to bring, and what to do in an emergency (112).',
    primary_keyword: 'pharmacies in Turkey for UK travellers',
    content: `<p><strong>Quick answer:</strong> Pharmacies in Turkey are called <strong>“eczane”</strong> and they’re widely available for everyday travel needs. For minor issues (headaches, sunburn, stomach upset, allergies), pharmacists can often help you choose an appropriate over-the-counter option and advise what to do next. If you need an out-of-hours pharmacy, look for a <strong>“nöbetçi eczane”</strong> (pharmacy on duty). For urgent medical emergencies, the UK government advises calling <strong>112</strong> for an ambulance.</p>

<h2>Why this guide matters (in a calm, positive way)</h2>
<p>Turkey is a well-travelled destination with modern services in major cities and holiday areas. Knowing how pharmacies work helps you stay relaxed: you’ll spend less time searching, you’ll ask for the right thing faster, and you’ll enjoy your trip more.</p>

<p><strong>Simple rule:</strong> Use pharmacies for <em>minor</em> problems and quick travel essentials. For anything serious or worrying, get medical help promptly.</p>

<p>Helpful companion reads:</p>
<ul>
  <li><a href="/guide/travel-insurance-turkey-uk-guide">Travel Insurance for Turkey from the UK</a></li>
  <li><a href="/guide/emergency-numbers-pharmacies-getting-help-turkey-guide">Emergency Numbers, Pharmacies & Getting Help in Turkey</a></li>
  <li><a href="/guide/turkey-sim-cards-mobile-data-uk-travellers-guide">Turkey SIM Cards & Mobile Data (eSIM vs SIM)</a></li>
</ul>

<h2>What pharmacies are called in Turkey (and what to look for)</h2>
<p>In Turkey, pharmacies are commonly referred to as <strong>“eczane”</strong>.</p>

<ul>
  <li>Look for the word <strong>ECZANE</strong> on the sign</li>
  <li>Pharmacies are usually easy to spot in town centres and busy neighbourhoods</li>
  <li>They can help with everyday over-the-counter needs and prescriptions (where appropriate)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Save one phrase in your notes: <em>“Eczane nerede?”</em> (Where is the pharmacy?). Even if you don’t speak Turkish, it’s a useful opener.</p>

<!-- IMAGE_ECZANE_SIGN_PLACEHOLDER -->

<h2>Finding an out-of-hours pharmacy: “nöbetçi eczane”</h2>
<p>Outside normal opening hours, Turkey operates a system of pharmacies on duty in each area. The phrase you’re looking for is <strong>“nöbetçi eczane”</strong>, which translates as <strong>pharmacy on duty</strong>.</p>

<h3>How to find the nearest “nöbetçi eczane” fast</h3>
<ul>
  <li>Search your maps app for: <strong>“nöbetçi eczane” + your area</strong></li>
  <li>Ask any open pharmacy — they often display details for the duty pharmacy in the area</li>
  <li>Ask at your restaurant/café/host (any local can usually point you quickly)</li>
</ul>

<p><strong>Simple rule:</strong> If it’s late and you need a pharmacy, the correct keyword is “nöbetçi eczane”.</p>

<!-- IMAGE_NOBETCI_ECZANE_LIST_PLACEHOLDER -->

<h2>What pharmacies can help with (common UK traveller needs)</h2>
<p>Pharmacists can often advise on everyday travel issues and recommend appropriate over-the-counter options.</p>

<h3>Typical “pharmacy problems” on holiday</h3>
<ul>
  <li>Headaches and general aches</li>
  <li>Colds, sore throats, coughs</li>
  <li>Allergies (seasonal or unexpected)</li>
  <li>Sunburn and heat-related discomfort</li>
  <li>Stomach upset (travel routine changes can do this)</li>
  <li>Blisters and small skin irritations</li>
  <li>Basic first-aid items (plasters, antiseptic, etc.)</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re not sure what you need, describe your symptoms calmly and ask what they recommend “for adults/for a child” and “for daytime/night”.</p>

<!-- IMAGE_PHARMACIST_CONSULTATION_PLACEHOLDER -->

<h2>What to bring with you (so the pharmacy visit takes 2 minutes, not 20)</h2>
<ul>
  <li>Your <strong>passport or ID</strong> (useful to have, especially if you need a prescription item)</li>
  <li>A <strong>photo of your prescription</strong> if you take regular medication</li>
  <li>The <strong>generic drug name</strong> (if you know it) rather than only a UK brand name</li>
  <li>A note of <strong>allergies</strong> and any key medical conditions</li>
  <li>If buying for a child: the child’s <strong>age</strong> and approximate <strong>weight</strong></li>
</ul>

<p><strong>Simple rule:</strong> The more specific your info (symptoms, age, allergies), the easier it is for the pharmacist to help.</p>

<h2>How to ask for what you need (simple, polite, effective)</h2>
<p>You do not need fluent Turkish. Short, clear information works well.</p>

<h3>Copy-paste questions (English)</h3>
<ul>
  <li><strong>“I have a headache / sore throat / allergy symptoms. What do you recommend?”</strong></li>
  <li><strong>“Is this suitable for daytime or nighttime?”</strong></li>
  <li><strong>“How often should I take it?”</strong></li>
  <li><strong>“Can I take this with my other medication?”</strong></li>
  <li><strong>“Is there a non-drowsy option?”</strong></li>
  <li><strong>“Do I need to see a doctor for this?”</strong></li>
</ul>

<h3>Copy-paste phrases (super simple Turkish helpers)</h3>
<ul>
  <li><strong>“Ağrım var.”</strong> (I have pain.)</li>
  <li><strong>“Alerjim var.”</strong> (I have allergies.)</li>
  <li><strong>“Çocuk için.”</strong> (For a child.)</li>
  <li><strong>“Ne kadar kullanmalıyım?”</strong> (How much should I use?)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Show the pharmacist your phone note with your symptoms. It’s often the quickest way to avoid misunderstandings.</p>

<h2>Payments and receipts (keep it smooth)</h2>
<p>For most UK travellers, the easiest approach is:</p>
<ul>
  <li>Pay by card when it’s convenient</li>
  <li>Keep a small amount of cash for quick purchases</li>
  <li>Keep receipts for anything important (especially if you may claim on insurance later)</li>
</ul>

<p>Money setup help:</p>
<ul>
  <li><a href="/guide/using-cards-cash-atms-turkey-money-guide">Using Cards, Cash & ATMs in Turkey</a></li>
  <li><a href="/guide/exchange-rate-currency-conversion-turkey-guide-uk">Exchange Rates & Currency Conversion in Turkey</a></li>
</ul>

<h2>When it’s NOT a pharmacy situation</h2>
<p>Pharmacies are great for minor issues. But if symptoms are severe, unusual, or worsening, it’s smarter to get medical help promptly.</p>

<h3>Use emergency services when it’s urgent</h3>
<p>The UK government’s Turkey travel advice lists <strong>112</strong> as the emergency number for an ambulance.</p>

<ul>
  <li>Severe breathing difficulty</li>
  <li>Chest pain</li>
  <li>Severe allergic reaction</li>
  <li>Serious injury</li>
  <li>Symptoms that feel rapidly worsening or frightening</li>
</ul>

<p><strong>Simple rule:</strong> If you’re thinking “Should we call?” — call. 112 is there to help.</p>

<!-- IMAGE_EMERGENCY_112_DIAL_PLACEHOLDER -->

<h2>Make your pharmacy experience effortless: a 30-second prep checklist</h2>
<ul>
  <li>Symptom summary (what it is + when it started) ✅</li>
  <li>Any allergies / conditions ✅</li>
  <li>Age/weight if for a child ✅</li>
  <li>Photo of prescription if relevant ✅</li>
  <li>Ask: dosage, timing, drowsy/non-drowsy, interactions ✅</li>
  <li>Save receipt if needed ✅</li>
</ul>

<!-- IMAGE_FIRST_AID_ESSENTIALS_PLACEHOLDER -->

<p><strong>UK-friendly tip:</strong> Do the checklist once and you’ll feel confident for the rest of the trip.</p>

<h2>FAQ: pharmacies in Turkey (UK travellers)</h2>

<h3>What are pharmacies called in Turkey?</h3>
<p>They’re commonly called <strong>“eczane”</strong>.</p>

<h3>How do I find a pharmacy that’s open late?</h3>
<p>Search for <strong>“nöbetçi eczane”</strong> (pharmacy on duty) plus your area in your maps app, or ask locally.</p>

<h3>Can a pharmacist help me choose medicine for minor issues?</h3>
<p>For minor issues, pharmacists can often advise on over-the-counter options and basic next steps. For anything serious or worsening, seek medical care.</p>

<h3>What should I bring to the pharmacy?</h3>
<p>Bring ID if you have it, a photo of any prescription medication you take, and a quick note of allergies/conditions. If buying for a child, have age and approximate weight ready.</p>

<h3>What’s the emergency number in Turkey?</h3>
<p>The UK government’s travel advice lists <strong>112</strong> for an ambulance and emergency services.</p>

<h3>Should I keep receipts from pharmacy purchases?</h3>
<p>Yes for anything significant — it’s tidy travel admin and can help if you need to reference what you bought or make an insurance claim later.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Pharmacies Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_ECZANE_SIGN_PLACEHOLDER -->',
            filename: `eczane-pharmacy-street-sign-turkey-${timestamp}.jpg`,
            prompt: "A clear, recognizable red 'E' or 'Eczane' pharmacy sign on a Turkish street. Sunny day. Helpful visual for tourists. Authentic street photography. High quality."
        },
        {
            placeholder: '<!-- IMAGE_NOBETCI_ECZANE_LIST_PLACEHOLDER -->',
            filename: `nobetci-eczane-night-duty-list-window-${timestamp}.jpg`,
            prompt: "A close-up of a 'Nöbetçi Eczane' (duty pharmacy) list taped to a pharmacy window at night. Lit from inside. Authentic travel detail. Helpful information visual."
        },
        {
            placeholder: '<!-- IMAGE_PHARMACIST_CONSULTATION_PLACEHOLDER -->',
            filename: `pharmacist-consultation-friendly-turkey-${timestamp}.jpg`,
            prompt: "A friendly Turkish pharmacist speaking with a customer (tourist) at the counter. Professional, clean pharmacy interior. Helpful, calm atmosphere. Authentic interaction."
        },
        {
            placeholder: '<!-- IMAGE_EMERGENCY_112_DIAL_PLACEHOLDER -->',
            filename: `emergency-112-smartphone-screen-${timestamp}.jpg`,
            prompt: "A smartphone screen showing '112' being dialed. Blurred background of a street or safe environment. Focus on the emergency number. Safety preparedness concept. Authentic style."
        },
        {
            placeholder: '<!-- IMAGE_FIRST_AID_ESSENTIALS_PLACEHOLDER -->',
            filename: `pharmacy-counter-essentials-turkey-${timestamp}.jpg`,
            prompt: "A pharmacy counter with basic travel health essentials: sunscreen, plasters, vitamins. Clean, organized. Authentic Turkish pharmacy vibe. Bright lighting."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('SIGN')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the Eczane sign?
            if (item.filename.includes('sign')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Eczaneler ve Nöbetçi Eczane Rehberi (TR Pasif)" },
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
