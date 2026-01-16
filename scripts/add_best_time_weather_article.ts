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
    slug: 'best-time-to-visit-turkey-from-uk',
    title: 'Best Time to Visit Turkey from the UK: Weather by Region (Month-by-Month, No Guesswork)',
    meta_description: 'Planning Turkey from the UK? Use this month-by-month guide to match the right region to your travel style — beach heat, city breaks, scenic drives, or cooler walking weather. No hotel names, no unreliable “average” claims — just clear, UK-friendly expectations and a packing checklist to avoid surprises.',
    primary_keyword: 'best time to visit Turkey from the UK',
    content: `
<h1>Best Time to Visit Turkey from the UK: Weather by Region (Month-by-Month, No Guesswork)</h1>

<p><strong>Quick answer:</strong> The “best” time to visit Turkey from the UK depends on <em>what you want your days to feel like</em>. For easy sightseeing and comfortable walking, aim for spring or autumn. For classic beach heat, summer is the main season on the coasts. For winter sun-style breaks, parts of the south coast can feel mild compared to the UK — while inland areas can be properly cold. Use the month-by-month guide below to match the right region (and pack smart).</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>First: pick your trip style (then choose the month)</h2>
<ul>
  <li><strong>Beach & pool days:</strong> you want hot, bright weather and long days.</li>
  <li><strong>City break (museums, food, neighbourhoods):</strong> you want comfortable walking and less heat.</li>
  <li><strong>Scenery & road-trip feel:</strong> you want clear days and calmer temperatures.</li>
  <li><strong>Quiet, relaxed Turkey:</strong> you want fewer crowds and a slower pace.</li>
</ul>

<p><strong>Simple rule:</strong> Choose your “daily vibe” first (beach heat vs walking comfort). The month becomes obvious after that.</p>

<p>Helpful planning links:</p>
<ul>
  <li><a href="/guide/turkey-trip-prep-checklist-uk">Turkey Travel Checklist for UK Tourists</a></li>
  <li><a href="/guide/choosing-where-to-stay-turkey-base-guide">How to Choose Your Base in Turkey</a></li>
  <li><a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a></li>
</ul>

<h2>Turkey weather, simplified: 4 region “types” UK travellers actually feel</h2>

<h3>1) Marmara (Istanbul region)</h3>
<ul>
  <li>More changeable than the southern coasts.</li>
  <li>Great for city breaks when it’s not too hot.</li>
  <li>Winter can be cold, windy, and occasionally wet.</li>
</ul>

<!-- IMAGE_ISTANBUL_PLACEHOLDER -->

<h3>2) Aegean Coast (e.g., west/southwest coast)</h3>
<ul>
  <li>Classic Mediterranean feel with a slightly breezier vibe in many spots.</li>
  <li>Great balance in shoulder seasons (spring/autumn) for mixed beach + exploring.</li>
</ul>

<h3>3) Mediterranean Coast (southern coast)</h3>
<ul>
  <li>Longer “warm season” and strong beach holiday energy.</li>
  <li>Peak summer can be seriously hot — perfect if that’s exactly what you want.</li>
</ul>

<!-- IMAGE_COAST_PLACEHOLDER -->

<h3>4) Inland & highland areas (central/eastern interiors)</h3>
<ul>
  <li>Big temperature swings: warm days can become cool evenings.</li>
  <li>Winters can be properly cold; some areas see snow.</li>
  <li>Shoulder seasons can be ideal for scenic landscapes and relaxed exploring.</li>
</ul>

<p><strong>UK-friendly tip:</strong> Turkey can feel like “multiple climates in one country”. Always pack for your region, not just “Turkey”.</p>

<h2>Month-by-month: what Turkey feels like (and where it fits best)</h2>

<h3>January</h3>
<ul>
  <li><strong>Best for:</strong> calm city breaks, slower travel, winter scenery inland.</li>
  <li><strong>Expect:</strong> cooler days, shorter daylight; inland can be cold.</li>
  <li><strong>Coast vs inland:</strong> south coast is milder; inland is winter-ready.</li>
</ul>

<h3>February</h3>
<ul>
  <li><strong>Best for:</strong> similar to January — quiet, local-feeling trips.</li>
  <li><strong>Expect:</strong> cool conditions; good for cosy cafés and museums.</li>
  <li><strong>UK-friendly tip:</strong> This is a “layering” month — pack for wind and indoor/outdoor shifts.</li>
</ul>

<h3>March</h3>
<ul>
  <li><strong>Best for:</strong> early spring city breaks and beginning-of-season exploring.</li>
  <li><strong>Expect:</strong> warming trend, but still changeable; evenings can be cool.</li>
  <li><strong>Where it shines:</strong> Istanbul-style trips and mixed itineraries.</li>
</ul>

<h3>April</h3>
<ul>
  <li><strong>Best for:</strong> comfortable walking weather and scenic exploring.</li>
  <li><strong>Expect:</strong> spring energy, greener landscapes; not “full summer” yet.</li>
  <li><strong>Great for:</strong> city breaks + day trips, and region-hopping.</li>
</ul>

<h3>May</h3>
<ul>
  <li><strong>Best for:</strong> one of the most balanced months for many UK travellers.</li>
  <li><strong>Expect:</strong> warm days in many areas, comfortable evenings; great for being outdoors.</li>
  <li><strong>Great for:</strong> Aegean and Mediterranean coasts if you want warmth without peak heat.</li>
</ul>

<h3>June</h3>
<ul>
  <li><strong>Best for:</strong> early summer beach holidays and long outdoor days.</li>
  <li><strong>Expect:</strong> hot spells starting; very “holiday” feel on the coasts.</li>
  <li><strong>Simple rule:</strong> If you love heat but not extreme peak, June is a strong sweet spot.</li>
</ul>

<h3>July</h3>
<ul>
  <li><strong>Best for:</strong> full summer beach and pool days.</li>
  <li><strong>Expect:</strong> real heat, especially on the Mediterranean coast; plan shade breaks.</li>
  <li><strong>UK-friendly tip:</strong> Make your day rhythm smart: mornings and evenings outside, midday slower.</li>
</ul>

<h3>August</h3>
<ul>
  <li><strong>Best for:</strong> peak beach season.</li>
  <li><strong>Expect:</strong> the most intense summer feel; hot days and warm nights in many coastal areas.</li>
  <li><strong>Great for:</strong> travellers who want maximum summer energy and don’t mind heat.</li>
</ul>

<h3>September</h3>
<ul>
  <li><strong>Best for:</strong> “late summer” beach weather with a softer edge.</li>
  <li><strong>Expect:</strong> warm sea and more comfortable evenings compared to peak summer.</li>
  <li><strong>Simple rule:</strong> If you want beach time + exploring, September is often ideal.</li>
</ul>

<!-- IMAGE_SEPTEMBER_PLACEHOLDER -->

<h3>October</h3>
<ul>
  <li><strong>Best for:</strong> shoulder-season travel: sightseeing, food, scenic drives.</li>
  <li><strong>Expect:</strong> cooler evenings; coastal days can still feel pleasantly warm.</li>
  <li><strong>Great for:</strong> city breaks + relaxed coastal bases.</li>
</ul>

<h3>November</h3>
<ul>
  <li><strong>Best for:</strong> quieter travel, culture-heavy itineraries, local-feeling Turkey.</li>
  <li><strong>Expect:</strong> more changeable weather; shorter days.</li>
  <li><strong>UK-friendly tip:</strong> Build your plan around “indoor wins” (museums, hammam, food spots) and enjoy the slower pace.</li>
</ul>

<h3>December</h3>
<ul>
  <li><strong>Best for:</strong> winter city breaks and cosy, atmospheric travel.</li>
  <li><strong>Expect:</strong> cool conditions; inland can be cold; coast can be mild compared to the UK.</li>
  <li><strong>Simple rule:</strong> Pack layers and you’ll be comfortable almost anywhere.</li>
</ul>

<h2>Region match: choose the right coast for your style</h2>

<h3>If you want the longest beach season</h3>
<ul>
  <li>Look at the <strong>southern coast</strong> for a longer warm stretch through the year.</li>
</ul>

<h3>If you want a balanced “beach + exploring” holiday</h3>
<ul>
  <li>The <strong>Aegean</strong> can feel like a great mix of coast time and day-trip variety.</li>
</ul>

<h3>If you want a classic city break</h3>
<ul>
  <li><strong>Istanbul region</strong> is great when walking is comfortable and you can enjoy long days out.</li>
</ul>

<p><strong>UK-friendly tip:</strong> Your “base” matters more than your exact month. A smart base makes every weather day easier.</p>

<h2>What to pack: month-proof essentials (no overpacking)</h2>
<ul>
  <li><strong>Layering piece:</strong> a light jacket or overshirt (useful in spring/autumn evenings)</li>
  <li><strong>Sun basics:</strong> sunscreen, sunglasses, hat (useful far beyond summer)</li>
  <li><strong>Comfort shoes:</strong> for city walking days</li>
  <li><strong>Light rain backup:</strong> a compact umbrella or packable rain layer (especially outside peak summer)</li>
</ul>

<p>Health + comfort checklist: <a href="/guide/staying-healthy-in-turkey-uk-checklist">Staying Healthy in Turkey: Simple Rules</a></p>

<!-- IMAGE_PACKING_PLACEHOLDER -->

<h2>UK-friendly planning prompts (copy-paste)</h2>
<ul>
  <li>“We want: (beach heat / comfortable walking / mixed). What month fits that best?”</li>
  <li>“We want a base where evenings are comfortable for eating out and walking.”</li>
  <li>“We’ll do (tours / boat day / lots of walking). What should we pack?”</li>
  <li>“We prefer a calmer trip. Which months feel less intense?”</li>
</ul>

<h2>FAQ: best time to visit Turkey from the UK</h2>

<h3>What months are best for a UK-style city break in Turkey?</h3>
<p>Most people prefer months where walking is comfortable and days feel fresh rather than intensely hot. Spring and autumn often fit that style well.</p>

<h3>When is the best time for a classic beach holiday?</h3>
<p>Summer is the main beach season on both the Aegean and Mediterranean coasts. If you want beach time with a softer feel, late summer and early autumn can be a strong choice.</p>

<h3>Is Turkey too hot in summer?</h3>
<p>It can be very hot in peak summer, especially on the southern coast. If you love heat, it’s perfect. If you prefer comfortable walking, consider shoulder-season months or plan your day around mornings and evenings.</p>

<h3>Can I visit Turkey in winter?</h3>
<p>Yes. Winter trips can be great for city breaks and slower travel. Coastal areas can feel milder than inland regions, which can be much colder.</p>

<h3>Do I need different clothes for different regions?</h3>
<p>Often, yes. Turkey can feel like multiple climates. Pack for your specific base (coast vs inland) rather than packing for “Turkey” as one uniform weather experience.</p>

<h3>What’s the simplest way to avoid weather surprises?</h3>
<p>Choose a base that matches your trip style, pack layers, and keep one light rain backup outside peak summer. That combination handles most situations comfortably.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>
`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Best Time Visit UK Guide Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `best-time-weather-uk-cover-${timestamp}.jpg`,
            prompt: "A landscape collage showing Turkey's changing seasons. Sunny beach on one side, mild green spring city park on the other. Authentic, high quality travel photography. Bright and inviting."
        },
        {
            placeholder: '<!-- IMAGE_ISTANBUL_PLACEHOLDER -->',
            filename: `istanbul-spring-weather-${timestamp}.jpg`,
            prompt: "A beautiful spring day in Istanbul. Bosphorus view with tulips in the foreground. Mild weather, soft sunlight. Authentic travel photo. Not crowded."
        },
        {
            placeholder: '<!-- IMAGE_COAST_PLACEHOLDER -->',
            filename: `turkey-mediterranean-coast-summer-${timestamp}.jpg`,
            prompt: "A stunning Mediterranean beach in Turkey during summer. Crystal clear turquoise water, golden sun. People enjoying the sea. Authentic holiday vibe."
        },
        {
            placeholder: '<!-- IMAGE_SEPTEMBER_PLACEHOLDER -->',
            filename: `turkey-september-evening-dining-${timestamp}.jpg`,
            prompt: "An outdoor evening dining scene in a Turkish coastal town in September. Warm sunset light, comfortable atmosphere. People eating at a table with diverse meze. Authentic and cozy."
        },
        {
            placeholder: '<!-- IMAGE_PACKING_PLACEHOLDER -->',
            filename: `turkey-travel-packing-essentials-${timestamp}.jpg`,
            prompt: "Flat lay travel photo of packing essentials for Turkey. Sunglasses, a light jacket, a hat, comfortable walking shoes. Stylish and practical. Authentic travel prep."
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
            finalContent = finalContent.replace(item.placeholder, '');
        }
    }

    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'yi Ziyaret Etmek İçin En İyi Zaman (UK Rehberi)" },
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
