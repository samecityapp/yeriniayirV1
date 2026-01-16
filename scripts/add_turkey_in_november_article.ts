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
            // Increased delay for retry to 40s
            if (attempt > 1) await sleep(40000);

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
                    console.warn(`⏳ Quota exceeded (429). Waiting 60s before retry ${attempt + 1}...`);
                    await sleep(60000);
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
    slug: 'turkey-in-november-from-uk',
    title: 'Turkey in November from the UK: Calm-Season Guide (City Breaks, Culture & What to Pack)',
    meta_description: 'Turkey in November is ideal for UK travellers who want a calmer trip: city breaks, culture, food, and a more local-feeling pace. This guide explains what November feels like by region, how to plan flexible days, what to pack (layers + rain plan), plus FAQs and checklists — no hotel names.',
    primary_keyword: 'Turkey in November from the UK',
    content: `
<h1>Turkey in November from the UK: Calm-Season Guide (City Breaks, Culture & What to Pack)</h1>

<p><strong>Quick answer:</strong> November is a great month for UK travellers who want Turkey with a calm, local-feeling atmosphere. It’s not a “guaranteed beach heat” month — it’s a <strong>culture + comfort</strong> month: city breaks, food, museums, neighbourhood wandering, and scenic moments without peak-season intensity. Coastal areas can feel milder than inland regions, but days can be more changeable, so the November win is simple: pick a base that suits indoor/outdoor flexibility and pack <strong>layers + a light rain plan</strong>.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>What November in Turkey feels like (in UK terms)</h2>
<ul>
  <li><strong>Calm travel:</strong> a slower pace and less “holiday rush”.</li>
  <li><strong>More indoor wins:</strong> museums, cafés, hammam-style relaxation, food spots.</li>
  <li><strong>Changeable days:</strong> you’ll want a plan that adapts easily.</li>
</ul>

<p><strong>Simple rule:</strong> In November, plan a trip where every day has an indoor “backup win”.</p>

<h2>November by region: choose your base by what you want to do</h2>

<h3>Istanbul region (best November all-rounder)</h3>
<ul>
  <li><strong>Best for:</strong> city breaks, food, neighbourhoods, museums, shopping.</li>
  <li><strong>November vibe:</strong> cosy, cultural, and very “walk-and-stop” friendly.</li>
  <li><strong>Why it works:</strong> you can swap outdoor plans for indoor ones easily.</li>
</ul>

<!-- IMAGE_ISTANBUL_VIBE_PLACEHOLDER -->

<h3>Mediterranean Coast (milder late-season feel)</h3>
<ul>
  <li><strong>Best for:</strong> travellers who want a softer climate compared to inland areas.</li>
  <li><strong>November vibe:</strong> calmer coastal days, gentle exploring, relaxed cafés.</li>
  <li><strong>Great for:</strong> a quiet reset rather than a full beach holiday.</li>
</ul>

<h3>Aegean Coast (shoulder-season charm)</h3>
<ul>
  <li><strong>Best for:</strong> scenic coastal bases and slow travel.</li>
  <li><strong>November vibe:</strong> quieter seaside atmosphere with cooler evenings.</li>
  <li><strong>Great for:</strong> food-focused trips and scenic walks on good days.</li>
</ul>

<h3>Inland & highland areas (cooler, more seasonal)</h3>
<ul>
  <li><strong>Best for:</strong> culture-heavy itineraries and travellers who enjoy crisp weather.</li>
  <li><strong>November vibe:</strong> cooler days and colder evenings; layers matter more.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you want the easiest November trip, choose a base where you can enjoy the day even if the weather is “café + museum” weather.</p>

<h2>Can you still do a coastal trip in November?</h2>
<p>Yes — if you plan it the right way. November coastal travel works best when you treat the coast as a <strong>scenic base</strong>, not a “pool-first” plan.</p>
<ul>
  <li>Choose a base with plenty of walkable cafés and indoor options.</li>
  <li>Use good-weather windows for scenic spots and outdoor lunches.</li>
  <li>Keep evenings cosy and relaxed.</li>
</ul>

<p><strong>Simple rule:</strong> November coast = scenic reset, not guaranteed beach heat.</p>

<!-- IMAGE_COASTAL_SCENIC_PLACEHOLDER -->

<h2>The perfect November day plan (comfort + culture)</h2>
<ul>
  <li><strong>Morning:</strong> outdoor walk, neighbourhood exploring, viewpoints</li>
  <li><strong>Midday:</strong> long lunch + warm café stop</li>
  <li><strong>Afternoon:</strong> museum/indoor sight or a covered market-style wander</li>
  <li><strong>Evening:</strong> dinner out + a short walk if comfortable</li>
</ul>

<p><strong>UK-friendly tip:</strong> Build your plan around “stops”. November is perfect for a slower, richer day.</p>

<h2>What to pack for Turkey in November (UK-friendly essentials)</h2>
<p>November packing is simple: think layers, comfort, and rain readiness.</p>

<h3>The core November capsule</h3>
<ul>
  <li>Light-to-medium jacket (something you can wear daily)</li>
  <li>One warmer layer (jumper/hoodie-style)</li>
  <li>Comfortable closed shoes (you’ll walk a lot)</li>
  <li>Compact umbrella or packable rain layer</li>
  <li>Scarf/light accessory (useful for wind and evening chill)</li>
</ul>

<p><strong>Simple rule:</strong> In November, your shoes and jacket matter more than your outfits.</p>

<!-- IMAGE_PACKING_NOVEMBER_PLACEHOLDER -->

<h2>How to keep the trip feeling “holiday” (even in cooler weather)</h2>
<ul>
  <li>Choose a base with strong food options — it becomes your daily highlight.</li>
  <li>Plan one “signature experience” per day (museum, hammam, market, scenic café).</li>
  <li>Keep evenings simple: warm dinner + cosy atmosphere.</li>
</ul>

<p>Comfort planning: <a href="/guide/staying-healthy-in-turkey-uk-checklist">Staying Healthy in Turkey: Simple Rules</a></p>

<h2>All-inclusive in November: when it makes sense</h2>
<p>November all-inclusive can work if your goal is a quiet reset with predictable meals and a comfortable base — not if your main goal is guaranteed pool and beach weather.</p>
<ul>
  <li><strong>Good for:</strong> travellers who want an easy routine and a calm pace</li>
  <li><strong>Smart move:</strong> choose a base that’s enjoyable beyond outdoor-only plans</li>
</ul>

<p>Useful reads:</p>
<ul>
  <li><a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a></li>
  <li><a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts (What UK Travellers Get Surprised By)</a></li>
</ul>

<h2>Copy-paste planning prompts (November edition)</h2>
<ul>
  <li>“We want a calm trip: culture, food, and cosy evenings. Which base suits November best?”</li>
  <li>“We prefer mild weather — should we choose a coastal base?”</li>
  <li>“We want an itinerary that works even if it rains for a few hours. How should we structure the days?”</li>
  <li>“We want a short city break — what should our ‘must-do’ list look like?”</li>
</ul>

<!-- IMAGE_TURKISH_TEA_MOMENT_PLACEHOLDER -->

<h2>FAQ: Turkey in November (UK travellers)</h2>

<h3>Is Turkey cold in November?</h3>
<p>November is cooler than summer and can be changeable. Coastal areas often feel milder than inland regions, and evenings are typically cooler — layers make it comfortable.</p>

<h3>Is November a good month for Istanbul?</h3>
<p>Yes. Istanbul suits November well because you can mix indoor and outdoor plans easily, enjoy food and neighbourhoods, and keep the day comfortable.</p>

<h3>Can I still enjoy the coast in November?</h3>
<p>Yes — if you treat it as a scenic, calm base rather than expecting guaranteed beach heat. Use good-weather windows for outdoor moments and enjoy cafés and indoor options as backup wins.</p>

<h3>What should I pack for Turkey in November from the UK?</h3>
<p>Layers, a practical jacket, comfortable closed shoes, and a compact rain backup. Add a scarf for evenings and wind.</p>

<h3>Is November good for all-inclusive?</h3>
<p>It can be if you want a quiet reset with predictable meals and a calm base. Just keep expectations realistic: it’s not peak beach season.</p>

<h3>How do I avoid weather disappointment in November?</h3>
<p>Choose a base with strong indoor options, plan one “signature experience” per day, and keep the schedule flexible. November is brilliant when you travel for culture and comfort.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>
`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Turkey in November Guide Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-november-calm-culture-vibe-${timestamp}.jpg`,
            prompt: "A beautiful, atmospheric street scene in Turkey in November (maybe Istanbul or Antalya). Soft autumn light, slightly overcast but bright. Historic buildings, fallen leaves. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_ISTANBUL_VIBE_PLACEHOLDER -->',
            filename: `istanbul-november-street-scene-${timestamp}.jpg`,
            prompt: "A lively street in Istanbul in November. People walking in light coats and jackets. A tram passing or a view of a mosque. Urban, cultural, authentic travel vibe."
        },
        {
            placeholder: '<!-- IMAGE_COASTAL_SCENIC_PLACEHOLDER -->',
            filename: `scenic-coastal-cafe-november-turkey-${timestamp}.jpg`,
            prompt: "A view from a coastal cafe in Turkey in November. The sea is calm, maybe a bit grey/blue but beautiful. People sitting indoors or under heaters, looking out. Quiet reflection vibe. Authentic travel."
        },
        {
            placeholder: '<!-- IMAGE_PACKING_NOVEMBER_PLACEHOLDER -->',
            filename: `packing-for-november-turkey-flatlay-${timestamp}.jpg`,
            prompt: "Flat lay of packing for November in Turkey. A stylish jacket, scarf, comfortable boots or sneakers, notebook, compact umbrella. 'City break' packing style. Authentic photo."
        },
        {
            placeholder: '<!-- IMAGE_TURKISH_TEA_MOMENT_PLACEHOLDER -->',
            filename: `turkish-tea-simit-cozy-cafe-${timestamp}.jpg`,
            prompt: "Close up of Turkish tea in a glass and a simit on a cafe table. Warm, cozy indoor atmosphere. Rainy or overcast window in background (optional). Authentic Turkish food culture."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Increased delay to 20s to avoid quota limits
        if (!item.placeholder.includes('COVER')) {
            console.log("⏳ Waiting 20s to respect API quota...");
            await sleep(20000);
        }

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
        title: { en: ARTICLE_DATA.title, tr: "Kasım'da Türkiye: Sakin Sezon Rehberi (TR Pasif)" },
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
