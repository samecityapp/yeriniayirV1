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

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImageVertex(prompt: string, filename: string, retries = 3) {
    console.log(`🎨 Generating ${filename} with Imagen 3...`);

    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);
    if (fs.existsSync(localPath)) {
        console.log(`⏩ File exists, skipping: ${filename}`);
        return `/images/articles/${filename}`;
    }

    const auth = new GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
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
                    parameters: { sampleCount: 1, aspectRatio: "16:9", safetySetting: "block_only_high", personGeneration: "allow_adult" }
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.warn(`⏳ Quota exceeded (429). Waiting 30s before retry ${attempt + 1}...`);
                    await sleep(30000);
                    continue;
                }
                throw new Error(`Vertex API Error: ${response.status}`);
            }

            const data = await response.json();
            if (!data.predictions?.[0]?.bytesBase64Encoded) throw new Error('No predictions');

            fs.writeFileSync(localPath, Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64'));
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
    slug: 'turkey-in-august-from-uk',
    title: 'Turkey in August from the UK: Peak Season Comfort Guide (Best Bases + Family-Friendly Rhythm)',
    meta_description: 'Turkey in August is full summer: maximum sunshine, warm evenings, and peak holiday energy. This UK-friendly guide helps you choose the right base (Aegean vs Mediterranean vs city), plan around midday heat, keep families comfortable, and pack smart — with checklists and FAQs.',
    primary_keyword: 'Turkey in August from the UK',
    content: `
<h1>Turkey in August from the UK: Peak Season Comfort Guide (Best Bases + Family-Friendly Rhythm)</h1>

<p><strong>Quick answer:</strong> August is peak summer in Turkey — bright days, warm nights, and a lively holiday atmosphere. It’s a fantastic time to go if you love full-on summer. The key is comfort planning: choose a base that matches your heat tolerance (Aegean for a more mixed-holiday feel, Mediterranean for classic sun-led resort energy), build a “hot-country schedule” (mornings and evenings outside, midday slower), and pack smart for sun and hydration.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>What August in Turkey feels like (in UK terms)</h2>
<ul>
  <li><strong>Maximum summer:</strong> strong sunshine and long days.</li>
  <li><strong>Warm evenings:</strong> outdoor dinners and sunset walks become the main event.</li>
  <li><strong>Holiday buzz:</strong> popular areas feel lively and energetic.</li>
</ul>

<p><strong>Simple rule:</strong> August in Turkey is brilliant when you plan for comfort first — then you enjoy the vibe fully.</p>

<h2>Choose your August base: Aegean vs Mediterranean vs city</h2>

<h3>Aegean Coast (balanced peak-summer feel)</h3>
<ul>
  <li><strong>Best for:</strong> beach + exploring, scenic drives, a mixed holiday rhythm.</li>
  <li><strong>August vibe:</strong> hot and sunny, with a “holiday breeze” feel in many areas.</li>
  <li><strong>Who it suits:</strong> travellers who want peak summer but still want day trips and walking.</li>
</ul>

<h3>Mediterranean Coast (classic peak-summer resort energy)</h3>
<ul>
  <li><strong>Best for:</strong> sun-led resort breaks, pool-first holidays, all-inclusive comfort.</li>
  <li><strong>August vibe:</strong> true peak heat and strong summer intensity.</li>
  <li><strong>Who it suits:</strong> travellers who love heat and want the most “summer holiday” atmosphere.</li>
</ul>

<!-- IMAGE_RESORT_ENERGY_PLACEHOLDER -->

<h3>Istanbul region (summer city break)</h3>
<ul>
  <li><strong>Best for:</strong> short breaks, food, shopping, culture + evening life.</li>
  <li><strong>August vibe:</strong> warm and busy; best enjoyed with early starts and midday indoor time.</li>
  <li><strong>Simple rule:</strong> Do a city break in August only if you’re happy pacing yourself.</li>
</ul>

<h3>Inland & highland areas (a different August option)</h3>
<ul>
  <li><strong>Best for:</strong> travellers who want scenery and a different rhythm from the coast.</li>
  <li><strong>August vibe:</strong> warm days with cooler nights in some areas; good for early mornings and sunsets.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re travelling with children, choose a base where shade, snacks, and water are always close. That’s what makes August feel easy.</p>

<h2>August crowds: how to make peak season feel smooth</h2>
<p>August is popular. You don’t need to avoid it — you just need a simple strategy.</p>

<ul>
  <li><strong>Start earlier:</strong> do your “must-do” activities in the morning.</li>
  <li><strong>Book key moments:</strong> if there’s a specific tour/day trip you care about, plan it ahead.</li>
  <li><strong>Use evenings:</strong> August evenings are one of Turkey’s biggest holiday pleasures.</li>
</ul>

<p><strong>Simple rule:</strong> In August, mornings are for doing — evenings are for enjoying.</p>

<h2>The perfect August day rhythm (hot-country schedule)</h2>
<p>This daily rhythm is what turns “too hot” into “perfect holiday”.</p>

<ul>
  <li><strong>Morning:</strong> beach, swimming, excursions, sightseeing</li>
  <li><strong>Midday:</strong> shade + long lunch + rest (or pool with breaks)</li>
  <li><strong>Afternoon:</strong> light plans, then reset</li>
  <li><strong>Evening:</strong> dinner out, shopping strolls, sunset time</li>
</ul>

<p><strong>Simple rule:</strong> The midday rest is not optional in August — it’s what makes you feel great.</p>

<p>Comfort guide: <a href="/guide/staying-healthy-in-turkey-uk-checklist">Staying Healthy in Turkey: Simple Rules</a></p>

<!-- IMAGE_EVENING_VIBE_PLACEHOLDER -->

<h2>All-inclusive in August: why it works so well</h2>
<p>August is peak all-inclusive season because resorts are built for heat comfort: shade, easy food, hydration, and a relaxed pace.</p>

<ul>
  <li><strong>Great for:</strong> families, groups, couples who want maximum ease</li>
  <li><strong>Best approach:</strong> enjoy the resort rhythm and add short morning excursions</li>
</ul>

<p>Helpful reads:</p>
<ul>
  <li><a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a></li>
  <li><a href="/guide/all-inclusive-family-checklist">All-Inclusive for Families: UK Parent Checklist</a></li>
</ul>

<h2>What to pack for Turkey in August (UK-friendly essentials)</h2>

<h3>Heat comfort essentials</h3>
<ul>
  <li>Breathable outfits (repeatable favourites)</li>
  <li>Comfortable sandals/trainers (you’ll walk more than you think)</li>
  <li>Sunscreen, sunglasses, hat</li>
  <li>After-sun / soothing moisturiser</li>
  <li>Refillable water bottle (or an easy hydration plan)</li>
  <li>Light cover-up for beach-to-lunch transitions</li>
</ul>

<h3>Family add-ons (if relevant)</h3>
<ul>
  <li>Extra sun protection bits (hats/cover-ups)</li>
  <li>Snacks for “between meals” moments</li>
  <li>Small entertainment for midday quiet time</li>
</ul>

<p><strong>Simple rule:</strong> August packing is 80% sun comfort, 20% walking comfort.</p>

<!-- IMAGE_PACKING_AUGUST_PLACEHOLDER -->

<h2>Money planning for August (keep it calm)</h2>
<p>In August, comfort spending can rise: cold drinks, taxis, shade breaks, and convenience choices. That’s normal — just plan for it.</p>

<ul>
  <li>Pick your daily style: <strong>simple / balanced / treat</strong></li>
  <li>Add a small “comfort buffer” for peak-heat days</li>
</ul>

<p>Budget help: <a href="/guide/money-budgeting-turkey-daily-cost-framework-uk">Money in Turkey: Daily Budget Framework</a></p>

<h2>Copy-paste August planning prompts</h2>
<ul>
  <li>“We want peak summer but comfort-first — which base suits that best?”</li>
  <li>“We’re travelling as a family — how do we plan midday quiet time?”</li>
  <li>“We want beach + one excursion day — what should the schedule look like?”</li>
  <li>“We want lively evenings — which areas are best for sunset walks and outdoor dinners?”</li>
</ul>

<h2>Quick checklist: August in Turkey (save this)</h2>
<ul>
  <li>Chosen base: Aegean (balanced) / Mediterranean (sun-led) / city (paced) ✅</li>
  <li>Daily rhythm planned (midday slower) ✅</li>
  <li>Sun kit ready (sunscreen, hat, sunglasses) ✅</li>
  <li>Hydration habit planned ✅</li>
  <li>Family comfort plan (if relevant) ✅</li>
  <li>Comfort buffer in budget ✅</li>
</ul>

<!-- IMAGE_FAMILY_FUN_PLACEHOLDER -->

<h2>FAQ: Turkey in August (UK travellers)</h2>

<h3>Is Turkey too hot in August?</h3>
<p>August is peak summer and can feel very hot, especially in coastal resort areas. If you plan outdoors for mornings/evenings and keep midday slower, August becomes one of the most enjoyable holiday months.</p>

<h3>Which coast is better in August: Aegean or Mediterranean?</h3>
<p>Aegean suits travellers who want a balanced holiday with exploring. Mediterranean suits travellers who want classic peak-summer resort energy and don’t mind stronger heat.</p>

<h3>Is August good for all-inclusive holidays?</h3>
<p>Yes. All-inclusive resorts make peak heat feel easy: shade, hydration, and a comfortable daily rhythm.</p>

<h3>What should I pack for Turkey in August from the UK?</h3>
<p>Breathable outfits, sun essentials, after-sun, comfortable footwear, and a hydration plan. Add family extras if travelling with children.</p>

<h3>How do I avoid crowds ruining the trip?</h3>
<p>Do must-do activities early, use midday for rest, and enjoy evenings. Peak season feels smooth when you use the day rhythm.</p>

<h3>Can I do a city break in August?</h3>
<p>Yes, especially as a short break — just pace yourself with early starts and midday indoor time.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>
`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Turkey in August Guide Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-august-peak-summer-beach-vibe-${timestamp}.jpg`,
            prompt: "A beautiful, energetic beach scene in Turkey in August. Clear blue sky, sparkling water, happy vacationers (not overcrowded, but lively). Authentic summer holiday atmosphere. High quality, realistic."
        },
        {
            placeholder: '<!-- IMAGE_RESORT_ENERGY_PLACEHOLDER -->',
            filename: `mediterranean-resort-pool-sun-august-${timestamp}.jpg`,
            prompt: "A vibrant scene at a Mediterranean resort pool in Turkey. Sunshines, blue water, people relaxing on loungers. Classic peak summer holiday vibe. Authentic, bright, and inviting."
        },
        {
            placeholder: '<!-- IMAGE_EVENING_VIBE_PLACEHOLDER -->',
            filename: `august-warm-evening-dining-fethiye-${timestamp}.jpg`,
            prompt: "Outdoor dining in a lively Turkish coastal town at night (e.g., Fethiye or Bodrum). Warm string lights, happy diners, summer evening breeze. Authentic travel lifestyle."
        },
        {
            placeholder: '<!-- IMAGE_PACKING_AUGUST_PLACEHOLDER -->',
            filename: `august-packing-essentials-sun-comfort-${timestamp}.jpg`,
            prompt: "Flat lay of August packing essentials for Turkey. Sunscreen, hat, sunglasses, light breathable clothes, water bottle. Focused on heat comfort. Authentic travel style."
        },
        {
            placeholder: '<!-- IMAGE_FAMILY_FUN_PLACEHOLDER -->',
            filename: `family-ice-cream-evening-walk-turkey-${timestamp}.jpg`,
            prompt: "A family enjoying an evening walk in a Turkish resort town, eating ice cream. Warm summer night atmosphere. Happy, relaxed. Authentic family travel moment."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        if (!item.placeholder.includes('COVER')) await sleep(5000);

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
        title: { en: ARTICLE_DATA.title, tr: "Ağustos'ta Türkiye: Zirve Sezon Konfor Rehberi (TR Pasif)" },
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
