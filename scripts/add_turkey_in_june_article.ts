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
    slug: 'turkey-in-june-from-uk',
    title: 'Turkey in June from the UK: Heat, Crowds & The Best Base Choices (Aegean vs Mediterranean)',
    meta_description: 'Turkey in June is when the country really switches into summer mode: long bright days, beach energy, and a strong “holiday feel” without the full intensity of peak-season crowds in many places. This UK-friendly guide helps you choose the right base (Aegean vs Mediterranean vs Istanbul vs inland), plan your day around heat, and pack smart — with FAQs and checklists.',
    primary_keyword: 'Turkey in June from the UK',
    content: `
<h1>Turkey in June from the UK: Heat, Crowds & The Best Base Choices (Aegean vs Mediterranean)</h1>

<p><strong>Quick answer:</strong> June is an excellent month for UK travellers who want a proper summer holiday in Turkey without committing to the most intense peak-season period. Expect long days, strong sunshine, and beach/pool weather across coastal regions. The key to enjoying June is choosing the right coast (Aegean for a breezier “mixed holiday”, Mediterranean for a stronger early-summer feel) and building a simple day rhythm: mornings and evenings outside, midday slower.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>What June in Turkey feels like (in UK terms)</h2>
<ul>
  <li><strong>Summer has arrived:</strong> beaches, pool time, and outdoor evenings feel natural.</li>
  <li><strong>Long daylight:</strong> you can do a lot in one day without rushing.</li>
  <li><strong>Heat management matters:</strong> the difference between a great day and a tiring day is your midday plan.</li>
</ul>

<p><strong>Simple rule:</strong> In June, your base choice sets the vibe — your day rhythm makes it comfortable.</p>

<h2>June by region: choose your base by “summer style”</h2>

<h3>Aegean Coast (west/southwest)</h3>
<ul>
  <li><strong>Best for:</strong> a balanced holiday (beach + exploring) with a fresher edge.</li>
  <li><strong>June vibe:</strong> sunny, warm, often feeling a bit breezier in many spots.</li>
  <li><strong>Great for:</strong> day trips, scenic drives, outdoor dinners without feeling overwhelmed.</li>
</ul>

<h3>Mediterranean Coast (south coast)</h3>
<ul>
  <li><strong>Best for:</strong> a stronger “classic summer” feel and sun-led resort energy.</li>
  <li><strong>June vibe:</strong> hotter and more intense-feeling, especially as the month progresses.</li>
  <li><strong>Great for:</strong> pool-first breaks, early all-inclusive season, beach lovers.</li>
</ul>

<!-- IMAGE_AEGEAN_MED_PLACEHOLDER -->

<h3>Istanbul region (Marmara)</h3>
<ul>
  <li><strong>Best for:</strong> city breaks with summer evenings and a lively atmosphere.</li>
  <li><strong>June vibe:</strong> warm and busy-feeling; walking is best in mornings and later afternoons.</li>
  <li><strong>Great for:</strong> short breaks, food, shopping, neighbourhood exploring.</li>
</ul>

<h3>Inland & highland areas (central interiors)</h3>
<ul>
  <li><strong>Best for:</strong> scenery and cultural itineraries that benefit from longer daylight.</li>
  <li><strong>June vibe:</strong> warm days with cooler evenings than the coasts in many places.</li>
  <li><strong>Key point:</strong> temperature swings can still happen — layers remain useful at night.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re heat-sensitive, choose a base where evenings feel comfortable — that’s where your holiday quality jumps up.</p>

<h2>June crowds: what to expect (without drama)</h2>
<p>June is popular because it feels like “the start of summer”. In many places it can feel lively without being the most intense peak-season period.</p>

<ul>
  <li><strong>Early June:</strong> often feels calmer than mid/late summer.</li>
  <li><strong>Mid to late June:</strong> more holiday energy, busier beaches, more evening buzz.</li>
</ul>

<p><strong>Simple rule:</strong> If you want the calmest June version, aim earlier in the month and choose a base with easy day-trip options.</p>

<h2>Sea feel in June (a realistic view)</h2>
<p>June is when sea-swimming starts to feel more naturally “holiday” for many travellers.</p>

<ul>
  <li>In many coastal areas, the sea feels <strong>less brisk</strong> than spring.</li>
  <li>Your experience still depends on wind, time of day, and recent weather.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you want the easiest swim, go midday. If you want the most refreshing swim, go early morning.</p>

<!-- IMAGE_SEA_FEEL_PLACEHOLDER -->

<h2>The perfect June day plan (heat-proof and enjoyable)</h2>
<p>June becomes effortless when you plan your day like locals do in hot destinations.</p>

<h3>Recommended daily rhythm</h3>
<ul>
  <li><strong>Morning:</strong> outdoors, sightseeing, day-trip start, active plans</li>
  <li><strong>Midday:</strong> long lunch + shade + indoor time (or pool time with breaks)</li>
  <li><strong>Afternoon:</strong> beach/pool, then a rest/reset</li>
  <li><strong>Evening:</strong> dinner out + walking + sunset vibes</li>
</ul>

<p><strong>Simple rule:</strong> The midday pause isn’t “wasting time” — it’s what makes your evenings feel amazing.</p>

<p>For comfort planning: <a href="/guide/staying-healthy-in-turkey-uk-checklist">Staying Healthy in Turkey: Simple Rules</a></p>

<!-- IMAGE_DAY_PLAN_PLACEHOLDER -->

<h2>What to pack for Turkey in June (UK-friendly, no overpacking)</h2>

<h3>The core June capsule</h3>
<ul>
  <li>Breathable day outfits (you’ll wear them more than you think)</li>
  <li>Comfortable sandals/trainers (walking still happens daily)</li>
  <li>Sun essentials: sunscreen, sunglasses, hat</li>
  <li>Light layer for evenings (useful in breezy spots)</li>
  <li>Swimwear + a light cover-up</li>
</ul>

<h3>If you’re doing city + coast</h3>
<ul>
  <li>Add one “smart casual” outfit for evenings out</li>
  <li>Bring shoes you can walk in comfortably for hours</li>
</ul>

<p><strong>UK-friendly tip:</strong> Pack like you’re building a “repeatable outfit system”. June trips feel best when your luggage is simple.</p>

<!-- IMAGE_PACKING_PLACEHOLDER -->

<h2>All-inclusive in June: who it suits best</h2>
<p>June is a strong month for all-inclusive because it has proper summer energy without being the most intense peak period in many areas.</p>

<ul>
  <li><strong>Great for:</strong> families, couples who want an easy rhythm, travellers who love pool days</li>
  <li><strong>Plan for:</strong> midday heat breaks and relaxed pacing</li>
</ul>

<p>Helpful reads:</p>
<ul>
  <li><a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a></li>
  <li><a href="/guide/best-all-inclusive-value-uk-turkey">How to Get the Best All-Inclusive Value from the UK</a></li>
</ul>

<h2>Copy-paste planning prompts (June edition)</h2>
<ul>
  <li>“We want a summer holiday but not peak intensity — is early or mid June better for our style?”</li>
  <li>“We’re heat-sensitive: should we choose an Aegean-style base or plan our day rhythm differently?”</li>
  <li>“We want beach + exploring: what’s the best base for easy day trips?”</li>
  <li>“We want evenings out — which areas feel best for sunset walks and outdoor dinners?”</li>
</ul>

<h2>FAQ: Turkey in June (UK travellers)</h2>

<h3>Is Turkey too hot in June?</h3>
<p>June is a true summer month in many places. Whether it feels “too hot” depends on your base and your day rhythm. If you plan outdoors in mornings/evenings and keep midday calmer, June can feel fantastic.</p>

<h3>Which coast is better in June: Aegean or Mediterranean?</h3>
<p>Choose the Aegean if you want a balanced holiday with a fresher feel and easy exploring. Choose the Mediterranean if you want a stronger “hot summer” vibe and sun-led resort energy.</p>

<h3>Is June a good month for swimming?</h3>
<p>For many travellers, yes — June often feels more naturally “swimmable” than spring. Exact sea feel varies by region and day conditions.</p>

<h3>What should I pack for Turkey in June from the UK?</h3>
<p>Breathable outfits, comfortable walking footwear, sun essentials, swimwear, and one light evening layer for breezy nights.</p>

<h3>Is June good for all-inclusive trips?</h3>
<p>Yes. June suits travellers who want an easy summer rhythm with pool days and relaxed pacing. Plan shade breaks and you’ll feel great.</p>

<h3>How do I avoid feeling exhausted in June heat?</h3>
<p>Use the daily rhythm: outdoors early, midday slower, evening walks and dinners. Combine sun habits and hydration and you’ll enjoy June comfortably.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>
`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Turkey in June Guide Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-in-june-beach-vibe-${timestamp}.jpg`,
            prompt: "A beautiful, vibrant Turkish beach scene in June. Golden sun, clear blue water (Mediterranean style). People enjoying the sun but not overly crowded. Authentic holiday vibe. Realistic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_AEGEAN_MED_PLACEHOLDER -->',
            filename: `aegean-vs-mediterranean-landscape-${timestamp}.jpg`,
            prompt: "A landscape shot showing the diverse beauty of Turkey's coast. Green hills meeting blue water (Aegean feel). A winding coastal road. Sunny summer day. Authentic travel scenery."
        },
        {
            placeholder: '<!-- IMAGE_SEA_FEEL_PLACEHOLDER -->',
            filename: `june-swimming-turkey-sea-${timestamp}.jpg`,
            prompt: "A relaxed swimming scene in calm turquoise water. Midday light, sparkling water texture. A swimmer floating or wading. Inviting and refreshing. Authentic travel moment."
        },
        {
            placeholder: '<!-- IMAGE_DAY_PLAN_PLACEHOLDER -->',
            filename: `june-outdoor-dining-sunset-${timestamp}.jpg`,
            prompt: "An outdoor evening dinner setting in a Turkish coastal town. Warm sunset light. People laughing, eating fresh food. Relaxed summer evening atmosphere. Authentic lifestyle photo."
        },
        {
            placeholder: '<!-- IMAGE_PACKING_PLACEHOLDER -->',
            filename: `turkey-june-packing-light-${timestamp}.jpg`,
            prompt: "Flat lay of packing for Turkey in June. Light linen shirt, sunglasses, sunscreen, sandals, and a summer hat. Breezy and minimal. Authentic travel styling."
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
        title: { en: ARTICLE_DATA.title, tr: "Haziran'da Türkiye: Sıcaklık, Kalabalık ve En İyi Bölgeler (TR Pasif)" },
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
