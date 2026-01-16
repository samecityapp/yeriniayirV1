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
    slug: 'turkey-in-december-from-uk',
    title: 'Turkey in December from the UK: Winter City Break Guide (What to Do, What to Pack & Best Bases)',
    meta_description: 'Turkey in December is ideal for UK travellers who want a winter city break with culture, food, and cosy daily plans. This guide explains what December feels like by region, how to build an itinerary that works in changeable weather, what to pack (layers + rain/wind plan), plus FAQs and checklists — no hotel names.',
    primary_keyword: 'Turkey in December from the UK',
    content: `
<h1>Turkey in December from the UK: Winter City Break Guide (What to Do, What to Pack & Best Bases)</h1>

<p><strong>Quick answer:</strong> December is a great time for UK travellers to experience Turkey as a <strong>winter city-break destination</strong>: culture, food, museums, markets, cosy cafés, and a calmer pace than summer. Weather is more changeable, evenings are cooler, and inland areas can be properly wintery — so the best December plan is simple: choose a base that offers strong indoor options (city break style), keep your days flexible, and pack layers plus a wind/rain-ready outer layer.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>What December in Turkey feels like (in UK terms)</h2>
<ul>
  <li><strong>Winter mode:</strong> cooler days and chilly evenings compared to the coasts in summer.</li>
  <li><strong>Cosy travel:</strong> food, cafés, museums, and indoor experiences become the stars.</li>
  <li><strong>Flexible planning:</strong> you’ll enjoy it most when your itinerary adapts easily.</li>
</ul>

<p><strong>Simple rule:</strong> December is for “city-break energy”, not “guaranteed beach heat”.</p>

<h2>December by region: where it works best</h2>

<h3>Istanbul region (top December base)</h3>
<ul>
  <li><strong>Best for:</strong> museums, neighbourhoods, food, shopping, culture.</li>
  <li><strong>December vibe:</strong> atmospheric, lively indoors, and great for walk-and-stop days.</li>
  <li><strong>Why it wins:</strong> you can do a full trip even if the weather changes.</li>
</ul>

<!-- IMAGE_ISTANBUL_WINTER_PLACEHOLDER -->

<h3>Mediterranean Coast (milder winter feel)</h3>
<ul>
  <li><strong>Best for:</strong> travellers who want a softer climate compared to inland regions.</li>
  <li><strong>December vibe:</strong> calmer coastal days, scenic walks, relaxed cafés.</li>
  <li><strong>Best approach:</strong> treat it as a scenic reset with indoor options — not a summer holiday.</li>
</ul>

<h3>Aegean Coast (quiet, local-feeling coastal break)</h3>
<ul>
  <li><strong>Best for:</strong> slow travel, food, calm coastal atmosphere.</li>
  <li><strong>December vibe:</strong> cooler evenings; good for cosy days and scenic moments.</li>
</ul>

<h3>Inland & highland areas (proper winter energy)</h3>
<ul>
  <li><strong>Best for:</strong> travellers who enjoy crisp weather and winter scenery.</li>
  <li><strong>December vibe:</strong> colder conditions and bigger temperature swings — pack warmer layers.</li>
</ul>

<p><strong>UK-friendly tip:</strong> In December, the “best base” is the one that still feels fun when you spend a few hours indoors.</p>

<h2>What to do in Turkey in December (the no-stress itinerary framework)</h2>
<p>The easiest December itinerary is built around indoor “anchors” with outdoor “windows”.</p>

<h3>Your daily structure</h3>
<ul>
  <li><strong>Anchor 1 (late morning):</strong> museum/cultural sight</li>
  <li><strong>Outdoor window:</strong> neighbourhood walk or viewpoint when weather is good</li>
  <li><strong>Anchor 2 (afternoon):</strong> market/shopping/café route</li>
  <li><strong>Evening:</strong> food-focused night + cosy atmosphere</li>
</ul>

<p><strong>Simple rule:</strong> Build your day around 2 indoor anchors. Treat outdoor plans as “bonus windows”.</p>

<!-- IMAGE_COSY_CAFE_PLACEHOLDER -->

<h2>How to keep December travel feeling “holiday” (not just cold)</h2>
<ul>
  <li>Plan one <strong>signature moment</strong> per day (museum, market, hammam-style relaxation, a scenic café).</li>
  <li>Keep days walkable: lots of short walks rather than one long march.</li>
  <li>Make evenings the highlight: warm dinner + a short stroll.</li>
</ul>

<p><strong>UK-friendly tip:</strong> December trips feel premium when you slow down. Think “quality stops”, not “maximum steps”.</p>

<h2>What to pack for Turkey in December (UK-friendly essentials)</h2>
<p>December packing is all about layers and a reliable outer layer.</p>

<h3>The core December capsule</h3>
<ul>
  <li><strong>Outer layer:</strong> wind/rain-resistant jacket (your best friend)</li>
  <li><strong>Mid layer:</strong> jumper/hoodie-style warm layer</li>
  <li><strong>Base layers:</strong> tops you can layer comfortably</li>
  <li><strong>Comfortable closed shoes</strong> for walking</li>
  <li><strong>Scarf</strong> (big comfort upgrade on windy days)</li>
  <li><strong>Compact umbrella</strong> (optional but useful)</li>
</ul>

<p><strong>Simple rule:</strong> In December, pack like you’re doing a UK winter city break — plus a touch more flexibility.</p>

<!-- IMAGE_PACKING_DECEMBER_PLACEHOLDER -->

<h3>If you’re going inland/highland</h3>
<ul>
  <li>Add a warmer layer for evenings</li>
  <li>Prioritise socks and shoes that stay comfortable all day</li>
</ul>

<h2>Health & comfort basics (winter edition)</h2>
<ul>
  <li>Stay hydrated (winter air can still dry you out)</li>
  <li>Keep a simple “warmth kit”: scarf + lip balm + moisturiser</li>
  <li>Choose cafés and indoor stops as part of the plan, not as rescue</li>
</ul>

<p>Comfort guide: <a href="/guide/staying-healthy-in-turkey-uk-checklist">Staying Healthy in Turkey: Simple Rules</a></p>

<h2>All-inclusive in December: when it makes sense</h2>
<p>December all-inclusive only makes sense if your goal is a quiet base with predictable meals — not if your main goal is beach/pool weather.</p>
<ul>
  <li><strong>Good for:</strong> calm resets and travellers who like staying “based”</li>
  <li><strong>Better approach:</strong> choose a city-style trip if you want daily variety</li>
</ul>

<p>Related reads:</p>
<ul>
  <li><a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a></li>
  <li><a href="/guide/travel-insurance-turkey-uk-guide">Travel Insurance for Turkey from the UK</a></li>
</ul>

<h2>Copy-paste planning prompts (December edition)</h2>
<ul>
  <li>“We want a winter city break: culture, food, cosy days. Which base suits December best?”</li>
  <li>“We want an itinerary that works even if the weather changes — how should we structure each day?”</li>
  <li>“We prefer mild winter weather — should we choose a coastal base?”</li>
  <li>“We want walkable days without overdoing it — what’s a good pace?”</li>
</ul>

<!-- IMAGE_XMAS_MARKET_PLACEHOLDER -->

<h2>Quick checklist: Turkey in December (UK travellers)</h2>
<ul>
  <li>Chosen base: city-break friendly (strong indoor options) ✅</li>
  <li>Itinerary built with 2 indoor anchors/day ✅</li>
  <li>Layering plan ready ✅</li>
  <li>Wind/rain outer layer packed ✅</li>
  <li>Comfort shoes packed ✅</li>
  <li>One signature experience planned per day ✅</li>
</ul>

<h2>FAQ: Turkey in December (UK travellers)</h2>

<h3>Is Turkey warm in December?</h3>
<p>December is winter mode. Coastal areas can feel milder than inland regions, but evenings are typically cool and weather can be changeable. It’s best approached as a winter city break or calm scenic trip.</p>

<h3>Is December a good time to visit Istanbul?</h3>
<p>Yes. Istanbul is a strong December base because you can mix indoor and outdoor plans easily, enjoy culture, food, and neighbourhoods without peak-season intensity.</p>

<h3>What should I pack for Turkey in December from the UK?</h3>
<p>Layers, a wind/rain-resistant jacket, comfortable closed shoes, and a scarf. Pack like a UK winter city break with flexible layering.</p>

<h3>Can I do a beach holiday in December?</h3>
<p>December isn’t a guaranteed beach-heat month. Coastal bases can be enjoyable as scenic resets, but plan your trip around culture, food, and flexible indoor options.</p>

<h3>Is all-inclusive worth it in December?</h3>
<p>Only if you want a calm base and predictable meals. If you want variety and daily exploring, a city-break style trip usually fits December better.</p>

<h3>How do I avoid weather disappointment in December?</h3>
<p>Build your day around indoor anchors (museums/markets/cafés), treat outdoor time as “weather windows”, and pack the right outer layer. December is brilliant when planned for comfort and culture.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>
`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Turkey in December Guide Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-december-winter-city-break-${timestamp}.jpg`,
            prompt: "A beautiful winter city scene in Turkey (Istanbul). Atmospheric, historical buildings including the Hagia Sophia or Blue Mosque, maybe a light dusting of snow or just crisp winter light. People in coats. Authentic travel vibe."
        },
        {
            placeholder: '<!-- IMAGE_ISTANBUL_WINTER_PLACEHOLDER -->',
            filename: `istanbul-winter-street-tram-authentic-${timestamp}.jpg`,
            prompt: "A red tram on Istiklal Street or similar in Istanbul in winter. Holiday lights or winter decorations. People walking in winter clothing. Lively, cultural atmosphere. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_COSY_CAFE_PLACEHOLDER -->',
            filename: `cosy-turkish-cafe-interior-winter-${timestamp}.jpg`,
            prompt: "Interior of a warm, traditional Turkish cafe in winter. Steam rising from tea glasses. Rugs or cushions. People relaxing inside while it's cold outside. Inviting, cozy atmosphere."
        },
        {
            placeholder: '<!-- IMAGE_PACKING_DECEMBER_PLACEHOLDER -->',
            filename: `packing-for-december-turkey-winter-flatlay-${timestamp}.jpg`,
            prompt: "Flat lay of packing for December in Turkey. A warm coat, stylish scarf, comfortable leather boots, wool sweater. 'Winter city break' packing style. Authentic photo."
        },
        {
            placeholder: '<!-- IMAGE_XMAS_MARKET_PLACEHOLDER -->',
            filename: `december-market-food-stall-turkey-${timestamp}.jpg`,
            prompt: "A food stall or market scene in Turkey in December. Roasted chestnuts (kestane) cart. Steam rising. Warm lights. Evening atmosphere. Authentic street food culture."
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
        title: { en: ARTICLE_DATA.title, tr: "Aralık'ta Türkiye: Kış Şehir Rehberi (TR Pasif)" },
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
