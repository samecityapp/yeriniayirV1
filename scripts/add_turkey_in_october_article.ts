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
    slug: 'turkey-in-october-from-uk',
    title: 'Turkey in October from the UK: Shoulder-Season Guide (Weather, Best Bases & What to Pack)',
    meta_description: 'Turkey in October is a brilliant UK-friendly month for a calmer, more comfortable trip: great for city breaks, scenic exploring, and relaxed coastal bases without peak-summer intensity. This guide explains what October feels like by region, how to plan flexible days, what to pack, plus FAQs and checklists — no hotel names.',
    primary_keyword: 'Turkey in October from the UK',
    content: `
<h1>Turkey in October from the UK: Shoulder-Season Guide (Weather, Best Bases & What to Pack)</h1>

<p><strong>Quick answer:</strong> October is a fantastic month for UK travellers who want Turkey with a calmer, more comfortable feel. It’s shoulder season: great for walking-heavy city breaks, scenic exploring, and relaxed coastal stays. Some coastal areas can still feel pleasantly warm, especially earlier in the month, while evenings become cooler and weather can be more changeable. The winning October approach is simple: choose the right base (Aegean for balanced exploring, Mediterranean for the warmest late-season feel, Istanbul for a walkable city break), then pack <strong>layers + a light rain backup</strong>.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>What October in Turkey feels like (in UK terms)</h2>
<ul>
  <li><strong>Comfort-first travel:</strong> easier for walking and day trips than peak summer.</li>
  <li><strong>Calmer pace:</strong> many travellers love the slower rhythm.</li>
  <li><strong>More variety:</strong> you may have warm sunny days and cooler, breezier moments.</li>
</ul>

<p><strong>Simple rule:</strong> October is about flexibility — plan your “must-do outdoors” for the best-weather windows.</p>

<h2>October by region: choose your base by “late-season style”</h2>

<h3>Mediterranean Coast (the warmest late-season option)</h3>
<ul>
  <li><strong>Best for:</strong> travellers who want the strongest “still-summer” feel.</li>
  <li><strong>October vibe:</strong> warmer coastal days, especially earlier in the month.</li>
  <li><strong>Great for:</strong> relaxed sun-led breaks and gentle exploring.</li>
</ul>

<h3>Aegean Coast (balanced shoulder season)</h3>
<ul>
  <li><strong>Best for:</strong> mixed trips — coastal base plus day trips and scenic drives.</li>
  <li><strong>October vibe:</strong> pleasant days with cooler evenings; great for outdoor cafés and exploring.</li>
  <li><strong>Great for:</strong> travellers who want “holiday feel” without summer intensity.</li>
</ul>

<!-- IMAGE_SCENIC_EXPLORING_PLACEHOLDER -->

<h3>Istanbul region (excellent city-break month)</h3>
<ul>
  <li><strong>Best for:</strong> food, neighbourhoods, culture, museums, shopping.</li>
  <li><strong>October vibe:</strong> often very walkable and comfortable for full days out.</li>
  <li><strong>Great for:</strong> travellers who want a city break with strong day-to-day comfort.</li>
</ul>

<h3>Inland & highland areas (scenery and crisp evenings)</h3>
<ul>
  <li><strong>Best for:</strong> landscapes, viewpoints, calm travel, photography-style days.</li>
  <li><strong>October vibe:</strong> pleasant daytime exploring, cooler nights.</li>
  <li><strong>Key point:</strong> bring layers — temperature swings can be bigger than the coast.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you want a “best of both worlds” trip in October, choose a base that gives you easy indoor options (museums, cafés, hammam) as well as outdoor day trips.</p>

<h2>Can you do a beach holiday in October?</h2>
<p>You can absolutely do a coast-led holiday in October — the smartest way is to keep your expectations flexible:</p>
<ul>
  <li>Earlier October can feel more “summer-like” than later October.</li>
  <li>Some days will be perfect for sun and swimming; others may suit walking and exploring.</li>
</ul>

<p><strong>Simple rule:</strong> In October, plan for “sun days” and “explore days” — both are wins.</p>

<!-- IMAGE_BEACH_WALK_PLACEHOLDER -->

<h2>The perfect October day plan (shoulder-season rhythm)</h2>
<ul>
  <li><strong>Morning:</strong> outdoor exploring, day trips, walking</li>
  <li><strong>Midday:</strong> long lunch + café time + optional indoor stop</li>
  <li><strong>Afternoon:</strong> scenic spots or a relaxed coastal walk</li>
  <li><strong>Evening:</strong> dinner out + a light layer</li>
</ul>

<p><strong>UK-friendly tip:</strong> October is the month where you can enjoy “full days” without needing a strict heat survival plan.</p>

<h2>All-inclusive in October: who it suits best</h2>
<p>October can be a great month for all-inclusive if you want a calmer resort atmosphere and you enjoy mixing resort time with exploring.</p>

<ul>
  <li><strong>Great for:</strong> couples and families who want an easy pace</li>
  <li><strong>Smart move:</strong> choose a base where the area is enjoyable even if you’re not in the pool all day</li>
</ul>

<p>Useful reads:</p>
<ul>
  <li><a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a></li>
  <li><a href="/guide/best-all-inclusive-value-uk-turkey">How to Get the Best All-Inclusive Value from the UK</a></li>
</ul>

<h2>What to pack for Turkey in October (UK-friendly essentials)</h2>

<h3>The core October capsule</h3>
<ul>
  <li>Light jacket or overshirt (evenings)</li>
  <li>One warmer layer (especially for inland or late-month trips)</li>
  <li>Comfortable walking shoes</li>
  <li>Compact rain layer or small umbrella</li>
  <li>Sun essentials (yes — still useful)</li>
</ul>

<h3>If you’re doing a coast-led October trip</h3>
<ul>
  <li>Bring swimwear (for the good days)</li>
  <li>Bring a light cover-up for breezy moments</li>
</ul>

<p><strong>Simple rule:</strong> October packing is “layers + rain backup + optional swim kit”.</p>

<!-- IMAGE_PACKING_OCTOBER_PLACEHOLDER -->

<p>Comfort guide: <a href="/guide/staying-healthy-in-turkey-uk-checklist">Staying Healthy in Turkey: Simple Rules</a></p>

<h2>Copy-paste planning prompts (October edition)</h2>
<ul>
  <li>“We want a calm trip with comfortable walking — which base suits October best?”</li>
  <li>“We’d like a coast base but also want day trips — which region fits that?”</li>
  <li>“We’re travelling late October — what layers matter most?”</li>
  <li>“We want a flexible plan that works even if one day is breezy — how should we structure it?”</li>
</ul>

<!-- IMAGE_CITY_BREAK_CAFE_PLACEHOLDER -->

<h2>FAQ: Turkey in October (UK travellers)</h2>

<h3>Is Turkey warm in October?</h3>
<p>Many areas can feel pleasantly warm during the day, especially earlier in the month and in coastal regions. Evenings are cooler, and weather can be more changeable than summer.</p>

<h3>Can I swim in Turkey in October?</h3>
<p>Often yes on warmer days, especially earlier in October and in some coastal areas. The best approach is to pack swimwear and keep expectations flexible — you’ll still have a great holiday either way.</p>

<h3>Is October good for Istanbul?</h3>
<p>Yes. October is often a very comfortable month for walking-heavy city breaks, with a great food and neighbourhood vibe.</p>

<h3>Which coast is better in October: Aegean or Mediterranean?</h3>
<p>Mediterranean is often the warmest late-season choice. Aegean is great for a balanced shoulder-season trip with exploring and scenic drives.</p>

<h3>What should I pack for Turkey in October from the UK?</h3>
<p>Layers, comfortable shoes, and a compact rain backup. Add swimwear if you’re coast-led and want the option to swim on warm days.</p>

<h3>Is October good for all-inclusive?</h3>
<p>Yes if you want a calmer resort atmosphere and you enjoy mixing resort time with exploring. Choose a base where the local area feels enjoyable beyond just pool time.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>
`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Turkey in October Guide Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-october-autumn-light-scenic-${timestamp}.jpg`,
            prompt: "A beautiful scenic view of Turkey in October. Soft, warm autumn light (not grey). Maybe a coastal view with some clouds or a historic site. Peaceful, shoulder-season travel vibe. Authentic photography."
        },
        {
            placeholder: '<!-- IMAGE_SCENIC_EXPLORING_PLACEHOLDER -->',
            filename: `aegean-scenic-drive-october-turkey-${timestamp}.jpg`,
            prompt: "A scenic coastal road or viewpoint in the Aegean region of Turkey in October. Clear air, beautiful landscape, easy driving conditions. Authentic travel exploration."
        },
        {
            placeholder: '<!-- IMAGE_BEACH_WALK_PLACEHOLDER -->',
            filename: `october-beach-walk-relaxed-turkey-${timestamp}.jpg`,
            prompt: "People walking on a beach in Turkey in October. Relaxed, some wearing light cardigans or layers, others barefoot. Calm sea. Peaceful atmosphere. Authentic travel moment."
        },
        {
            placeholder: '<!-- IMAGE_PACKING_OCTOBER_PLACEHOLDER -->',
            filename: `packing-layers-october-turkey-flatlay-${timestamp}.jpg`,
            prompt: "Flat lay of packing for October in Turkey. A light jacket, comfortable walking shoes, sunglasses, and a compact umbrella. 'Prepared but light' vibe. Authentic travel style."
        },
        {
            placeholder: '<!-- IMAGE_CITY_BREAK_CAFE_PLACEHOLDER -->',
            filename: `istanbul-cafe-autumn-cozy-vibe-${timestamp}.jpg`,
            prompt: "A cozy outdoor/indoor cafe scene in Istanbul in October. People enjoying coffee or tea. Comfortable clothing (light jackets). Lively but relaxed city atmosphere. Authentic travel lifestyle."
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
        title: { en: ARTICLE_DATA.title, tr: "Ekim'de Türkiye: Omuz Sezonu Rehberi (TR Pasif)" },
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
