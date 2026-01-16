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
    slug: 'visiting-mosques-cultural-sites-turkey-etiquette-guide',
    title: 'Visiting Mosques & Cultural Sites in Turkey: UK Tourist Dress, Etiquette & Simple Rules',
    meta_description: 'Turkey makes cultural visits easy for UK travellers — you just need a few simple habits: dress appropriately for the setting, follow on-site guidance, keep behaviour calm and respectful, and ask before close-up photos. This practical guide includes a copy-paste checklist and FAQs (no hotel names).',
    primary_keyword: 'visiting mosques in Turkey as a tourist',
    content: `<p><strong>Quick answer:</strong> Visiting mosques and cultural sites in Turkey is genuinely straightforward for UK tourists: dress a little more modestly than you would for the beach, follow the signage and staff guidance, keep your voice and movement calm, and ask before close-up photos. Most places are welcoming — a respectful approach is all you need.</p>

<h2>Why cultural visits in Turkey feel easy (when you know the basics)</h2>
<p>Turkey is proud of its heritage, and visitors are a normal part of daily life in major destinations. The “secret” is not rules — it’s mindset.</p>
<ul>
  <li><strong>Respect the setting:</strong> treat it like a place people genuinely value</li>
  <li><strong>Follow the flow:</strong> signage and staff make expectations clear</li>
  <li><strong>Dress to match:</strong> modest, comfortable, and practical</li>
</ul>

<p><strong>Simple rule:</strong> If you’re unsure, choose the more respectful option — it always lands well.</p>

<!-- IMAGE_MOSQUE_EXTERIOR_PLACEHOLDER -->

<h2>What to wear: the UK-friendly “one-layer solution”</h2>
<p>Dress expectations vary by site, but you can solve most situations with one simple packing approach.</p>

<h3>The easiest outfit approach for everyone</h3>
<ul>
  <li>Wear clothing that covers shoulders and knees (easy default)</li>
  <li>Carry a <strong>light layer</strong> (scarf/shawl/light shirt) you can put on in seconds</li>
  <li>Choose comfortable shoes you can remove easily if needed</li>
</ul>

<p><strong>UK-friendly tip:</strong> Pack a light scarf or shawl in your day bag — it instantly makes you feel prepared without overthinking.</p>

<!-- IMAGE_SCARF_PREP_PLACEHOLDER -->

<h2>Mosque visits: the simple etiquette checklist</h2>
<p>Mosques are living places of worship. Many welcome visitors outside prayer times, and the experience can be calm and memorable.</p>

<h3>Do this (it’s simple)</h3>
<ul>
  <li>Check visiting hours/entry guidance on-site (or ask politely)</li>
  <li>Keep voices low and movement unhurried</li>
  <li>Follow designated visitor areas and directions</li>
  <li>Put your phone on silent</li>
</ul>

<h3>Avoid this (for a smoother experience)</h3>
<ul>
  <li>Loud calls, rushed behaviour, or “in-a-hurry” filming</li>
  <li>Walking into restricted areas</li>
  <li>Close-up photos of people without permission</li>
</ul>

<p><strong>Simple rule:</strong> Walk slowly, speak softly, follow signs — and you’ll be perfectly fine.</p>

<p>For broader day-to-day manners, see: <a href="/guide/turkey-travel-etiquette-for-brits-guide">Turkey Travel Etiquette for Brits</a>.</p>

<!-- IMAGE_SHOE_SHELVES_PLACEHOLDER -->

<h2>Photography: how to take great photos respectfully</h2>
<p>Turkey is incredibly photogenic, and you can take plenty of photos. The key is choosing the “easy yes” approach.</p>

<h3>The “easy yes” photo approach</h3>
<ul>
  <li>Architecture and wide shots are usually the smoothest</li>
  <li>If you want close-ups of people, ask first (a gesture works)</li>
  <li>Follow any no-photo areas or specific rules</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you want content without awkward moments, prioritise wide shots and details (tiles, domes, courtyards) rather than faces.</p>

<h2>Cultural sites beyond mosques: what changes?</h2>
<p>Museums, historic sites, and monuments are usually even simpler: follow opening hours, queue respectfully, and keep your behaviour calm around preserved areas.</p>

<ul>
  <li>Don’t touch fragile surfaces or protected displays</li>
  <li>Respect barriers and ropes (they exist for preservation)</li>
  <li>Keep snacks and drinks where permitted</li>
</ul>

<p><strong>Simple rule:</strong> Treat heritage like it’s valuable — because it is.</p>

<!-- IMAGE_CALM_INTERIOR_PLACEHOLDER -->

<h2>Planning your visit: make it calm and comfortable</h2>
<p>These planning choices make cultural visits feel effortless.</p>

<ul>
  <li>Go earlier in the day if you like quieter atmospheres</li>
  <li>Bring water and a light layer</li>
  <li>Keep your route simple (2–3 key stops beats 8 rushed stops)</li>
</ul>

<p>If you’re using city transport for sightseeing days, pair with: <a href="/guide/public-transport-turkey-tourist-guide">Public Transport in Turkey for UK Tourists</a>.</p>

<h2>Copy-paste checklist (save to your Notes)</h2>
<p>Copy and paste this before a mosque or cultural site day:</p>

<ul>
  <li>Light layer/scarf packed ✅</li>
  <li>Outfit covers shoulders + knees (easy default) ✅</li>
  <li>Shoes easy to remove ✅</li>
  <li>Phone on silent ✅</li>
  <li>Follow signage/staff guidance ✅</li>
  <li>Wide shots first, ask before close-up photos ✅</li>
  <li>Water + comfortable shoes ✅</li>
</ul>

<p><strong>UK-friendly tip:</strong> The goal is “prepared and relaxed” — not “perfect”.</p>

<!-- IMAGE_GENERIC_CULTURAL_SITE_PLACEHOLDER -->

<h2>Helpful internal reads for a smooth trip</h2>
<ul>
  <li><a href="/guide/what-to-pack-for-turkey-holiday-list">Turkey Travel Checklist for UK Tourists</a></li>
  <li><a href="/guide/turkey-tourist-basics-brits-documents-check-in-guide">Turkey Tourist Basics for Brits: Documents & Arrival Day</a></li>
  <li><a href="/guide/emergency-numbers-pharmacies-getting-help-turkey-guide">Emergency Numbers, Pharmacies & Getting Help in Turkey</a></li>
</ul>

<h2>FAQ: mosques and cultural site visits in Turkey (UK travellers)</h2>

<h3>Can tourists visit mosques in Turkey?</h3>
<p>Yes — many mosques welcome visitors outside prayer times, with clear on-site guidance. The best approach is to check signage and follow staff directions.</p>

<h3>Do I need special clothing to enter a mosque?</h3>
<p>You don’t need special clothing — just a modest, respectful outfit for the setting. A light layer/scarf is the easiest solution to feel prepared anywhere.</p>

<h3>Can I take photos inside mosques?</h3>
<p>Often yes in visitor areas, but rules can vary by site. Follow signs, avoid restricted areas, and ask before taking close-up photos of people.</p>

<h3>What’s the most respectful behaviour inside a mosque?</h3>
<p>Keep your voice low, move calmly, follow the visitor route, and treat it as a meaningful space rather than a “content set”.</p>

<h3>How do I avoid feeling awkward as a British visitor?</h3>
<p>Use the mirror rule: match the calmness and respect you see around you. A simple “thank you” and relaxed manners go a long way.</p>

<h3>What should I bring for a cultural sightseeing day?</h3>
<p>A light layer, water, comfortable shoes, and a simple plan for 2–3 key stops. Keeping it calm makes the day more enjoyable.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Mosque Etiquette Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_MOSQUE_EXTERIOR_PLACEHOLDER -->',
            filename: `historic-mosque-exterior-istanbul-authentic-${timestamp}.jpg`,
            prompt: "Wide angle view of a historic mosque in Istanbul (like Blue Mosque style) with soft morning light. Birds flying, peaceful atmosphere. Authentic travel photography. High resolution."
        },
        {
            placeholder: '<!-- IMAGE_SCARF_PREP_PLACEHOLDER -->',
            filename: `tourist-adjusting-scarf-respectful-authentic-${timestamp}.jpg`,
            prompt: "A female tourist respectfully adjusting a light scarf over her head/shoulders before entering a cultural site. calm expression. Authentic travel moment. Soft, natural lighting."
        },
        {
            placeholder: '<!-- IMAGE_SHOE_SHELVES_PLACEHOLDER -->',
            filename: `mosque-entry-shoe-shelves-authentic-${timestamp}.jpg`,
            prompt: "Entry area of a mosque showing wooden shoe shelves and a clean carpeted floor. Visitors taking off shoes respectfully. Authentic cultural detail. Warm interior lighting."
        },
        {
            placeholder: '<!-- IMAGE_CALM_INTERIOR_PLACEHOLDER -->',
            filename: `mosque-interior-peaceful-authentic-${timestamp}.jpg`,
            prompt: "Interior view of a grand mosque in Turkey. Beautiful calligraphy and dome details. Soft light filtering through windows. Visitors admiring quietly. Peaceful atmosphere. Wide shot."
        },
        {
            placeholder: '<!-- IMAGE_GENERIC_CULTURAL_SITE_PLACEHOLDER -->',
            filename: `ancient-ruins-museum-turkey-authentic-${timestamp}.jpg`,
            prompt: "A respectful tourist walking through an outdoor ancient ruin or museum site in Turkey (e.g. Ephesus style). Sunlight, ancient stones. Authentic cultural exploration. High quality."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('EXTERIOR')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the Exterior one?
            if (item.filename.includes('mosque-exterior')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Camii ve Kültürel Yer Ziyaret Rehberi (TR Pasif)" },
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
