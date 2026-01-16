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
    slug: 'turkey-in-july-from-uk',
    title: 'Turkey in July from the UK: Peak Summer Comfort Plan (Best Bases + Daily Rhythm Guide)',
    meta_description: 'Turkey in July is peak summer: long bright days, strong beach energy, and proper heat. This UK-friendly guide shows how to enjoy July comfortably — choose the right base (Aegean vs Mediterranean vs city), plan your day around midday heat, pack smart, and keep families happy. Includes checklists and FAQs.',
    primary_keyword: 'Turkey in July from the UK',
    content: `
<h1>Turkey in July from the UK: Peak Summer Comfort Plan (Best Bases + Daily Rhythm)</h1>

<p><strong>Quick answer:</strong> July in Turkey is for travellers who want full summer: beach days, warm evenings, and a lively holiday atmosphere. The key is not “avoiding” the heat — it’s <strong>designing your day around it</strong>. Choose your base carefully (Aegean for a fresher mixed-holiday feel, Mediterranean for classic sun-led resort energy, city breaks only if you like early starts), then use a simple rhythm: mornings and evenings outside, midday slower.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>What July in Turkey feels like (in UK terms)</h2>
<ul>
  <li><strong>Peak summer:</strong> strong sunshine and long bright days.</li>
  <li><strong>Heat is part of the experience:</strong> you’ll enjoy it most with smart pacing.</li>
  <li><strong>Evenings are a highlight:</strong> outdoor dinners and walks feel natural.</li>
</ul>

<p><strong>Simple rule:</strong> If you plan July like you plan a UK city break (non-stop walking at midday), you’ll feel tired. If you plan it like a sun destination, you’ll love it.</p>

<h2>Choose your July base: the right coast makes everything easier</h2>

<h3>Aegean Coast (balanced summer)</h3>
<ul>
  <li><strong>Best for:</strong> beach + exploring, scenic drives, calmer “mixed holiday” vibe.</li>
  <li><strong>July feel:</strong> hot and sunny, often with a fresher edge in many areas.</li>
  <li><strong>Who it suits:</strong> travellers who want summer without the most intense “oven” feeling.</li>
</ul>

<h3>Mediterranean Coast (classic peak summer)</h3>
<ul>
  <li><strong>Best for:</strong> sun-led resort holidays, pool-first trips, all-inclusive rhythm.</li>
  <li><strong>July feel:</strong> true hot-summer energy, especially inland from the sea.</li>
  <li><strong>Who it suits:</strong> travellers who love heat and want maximum “summer holiday” feeling.</li>
</ul>

<!-- IMAGE_COAST_COMPARISON_PLACEHOLDER -->

<h3>Istanbul region (city break in summer)</h3>
<ul>
  <li><strong>Best for:</strong> short breaks, food, neighbourhoods, evenings out.</li>
  <li><strong>July feel:</strong> warm and busy; walking is best early and late.</li>
  <li><strong>Simple rule:</strong> Do Istanbul in July only if you’re happy with early starts and midday indoor time.</li>
</ul>

<h3>Inland & highland areas (a different July option)</h3>
<ul>
  <li><strong>Best for:</strong> scenery, cultural trips, and travellers who want a different pace from the coast.</li>
  <li><strong>July feel:</strong> warm days with cooler nights in some areas; less “sticky beach heat” feel.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re travelling with kids, choose a base where you can walk to shade, snacks, and water easily. That’s the family-holiday secret.</p>

<h2>The perfect July day rhythm (this is the whole game)</h2>
<p>July is brilliant when you run a “hot country schedule”.</p>

<h3>Comfort-first schedule</h3>
<ul>
  <li><strong>Morning:</strong> beach, swimming, excursions, sightseeing (your best energy)</li>
  <li><strong>Midday:</strong> shade + long lunch + rest (or pool with breaks)</li>
  <li><strong>Afternoon:</strong> light plans, then reset</li>
  <li><strong>Evening:</strong> your big vibe — dinner out, walks, sunset time</li>
</ul>

<p><strong>Simple rule:</strong> Your midday pause is what buys you a great evening.</p>

<p>Health routine: <a href="/guide/staying-healthy-in-turkey-uk-checklist">Staying Healthy in Turkey: Simple Rules</a></p>

<!-- IMAGE_DAY_RHYTHM_PLACEHOLDER -->

<h2>Swimming and beach planning in July (make it feel premium)</h2>
<ul>
  <li>Swim early for calm water and less heat.</li>
  <li>Swim midday if you want the warmest “summer sea feel”.</li>
  <li>Use shade breaks as part of the day (not as a rescue plan).</li>
</ul>

<p><strong>UK-friendly tip:</strong> Pack a light cover-up you actually like wearing — it makes beach-to-lunch transitions effortless.</p>

<h2>All-inclusive in July: who it’s perfect for</h2>
<p>July is peak all-inclusive season because the “easy rhythm” matches the weather.</p>

<ul>
  <li><strong>Great for:</strong> families, couples who want maximum relaxation, travellers who love pool days</li>
  <li><strong>Best approach:</strong> treat the resort as your “shade base”, then add short excursions</li>
</ul>

<p>Useful links:</p>
<ul>
  <li><a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a></li>
  <li><a href="/guide/all-inclusive-family-checklist">All-Inclusive for Families: UK Parent Checklist</a></li>
</ul>

<!-- IMAGE_POOL_VIBE_PLACEHOLDER -->

<h2>What to pack for Turkey in July (UK-friendly essentials)</h2>

<h3>Heat-comfort essentials</h3>
<ul>
  <li>Breathable outfits (you’ll re-wear your favourites)</li>
  <li>Comfortable sandals/trainers</li>
  <li>Sunscreen, sunglasses, hat</li>
  <li>After-sun / soothing moisturiser</li>
  <li>Refillable water bottle (or an easy hydration system)</li>
</ul>

<h3>Family add-ons (if relevant)</h3>
<ul>
  <li>Extra sun protection bits (hat/cover-ups)</li>
  <li>Simple snacks for “between meals” moments</li>
  <li>Small entertainment for midday rest (quiet time wins)</li>
</ul>

<p><strong>Simple rule:</strong> July packing is 70% sun comfort, 30% walking comfort.</p>

<h2>Money planning for July (keep it smooth)</h2>
<p>In July you may spend more on “comfort choices” (taxis, cold drinks, shade breaks). That’s normal. Plan for it.</p>
<ul>
  <li>Pick your daily style: <strong>simple / balanced / treat</strong></li>
  <li>Add a small “comfort buffer” for hot days</li>
</ul>

<p>Budget framework: <a href="/guide/money-budgeting-turkey-daily-cost-framework-uk">Money in Turkey: Daily Budget Framework</a></p>

<!-- IMAGE_SUMMER_TREATS_PLACEHOLDER -->

<h2>Copy-paste July planning prompts</h2>
<ul>
  <li>“We want peak summer but not constant exhaustion — which base suits that?”</li>
  <li>“We’ll do beach + one day trip. Which day should be the ‘active morning’ day?”</li>
  <li>“We’re travelling with kids — how do we plan naps/quiet time around heat?”</li>
  <li>“We want lively evenings. Which areas are best for sunset walks and outdoor dinners?”</li>
</ul>

<h2>Quick checklist: July in Turkey (save this)</h2>
<ul>
  <li>Chosen base: Aegean (balanced) / Mediterranean (sun-led) / city (early-start) ✅</li>
  <li>Daily rhythm planned (midday slower) ✅</li>
  <li>Sun kit ready (sunscreen, hat, sunglasses) ✅</li>
  <li>Hydration habit planned ✅</li>
  <li>Evening layer (optional but useful) ✅</li>
  <li>Comfort buffer in budget ✅</li>
</ul>

<h2>FAQ: Turkey in July (UK travellers)</h2>

<h3>Is Turkey too hot in July?</h3>
<p>It can be very hot, especially in coastal resort areas. Whether it’s “too hot” depends on your base and your day rhythm. Plan outdoor time for mornings/evenings and keep midday calmer — and July becomes brilliant.</p>

<h3>Which coast is better in July: Aegean or Mediterranean?</h3>
<p>Aegean suits travellers who want a balanced summer feel and easy exploring. Mediterranean suits travellers who want classic peak-summer resort energy and don’t mind stronger heat.</p>

<h3>Is July a good month for all-inclusive?</h3>
<p>Yes — July matches all-inclusive perfectly because resorts make it easy to rest, hydrate, and enjoy pool time comfortably.</p>

<h3>What should I pack for Turkey in July from the UK?</h3>
<p>Breathable outfits, sun essentials, after-sun, comfortable footwear, and a simple hydration plan. Add family extras if travelling with children.</p>

<h3>Can I do a city break in July?</h3>
<p>Yes, especially as a short trip — but you’ll enjoy it most if you’re happy with early starts and midday indoor time.</p>

<h3>How do I avoid feeling exhausted?</h3>
<p>Use the hot-country schedule: do active plans early, rest at midday, then enjoy evenings. Combine sun protection and steady hydration.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>
`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Turkey in July Guide Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-in-july-peak-summer-vibe-${timestamp}.jpg`,
            prompt: "A stunning, vibrant shot of a Turkish beach in July. Bright blue sky, golden sands, colorful umbrellas. People having fun in the water. High summer energy. Authentic travel photography. 4k resolution."
        },
        {
            placeholder: '<!-- IMAGE_COAST_COMPARISON_PLACEHOLDER -->',
            filename: `aegean-green-mediterranean-blue-comparison-${timestamp}.jpg`,
            prompt: "A split composition or scenic view showing the lush green coastline of the Aegean meeting the deep blue sea of the Mediterranean. Sunny, bright, inviting. Authentic landscape photography."
        },
        {
            placeholder: '<!-- IMAGE_DAY_RHYTHM_PLACEHOLDER -->',
            filename: `july-midday-shade-relaxation-${timestamp}.jpg`,
            prompt: "A relaxed midday scene in a shaded garden or cafe in Turkey. Cold drinks on a table (lemonade or iced coffee). People resting comfortably away from the sun. Authentic lifestyle photo."
        },
        {
            placeholder: '<!-- IMAGE_POOL_VIBE_PLACEHOLDER -->',
            filename: `family-resort-pool-july-fun-${timestamp}.jpg`,
            prompt: "A joyful family scene at a resort pool in Turkey. Kids splashing, parents relaxing on sunbeds with clear blue water. Bright summer light. Authentic family holiday momement."
        },
        {
            placeholder: '<!-- IMAGE_SUMMER_TREATS_PLACEHOLDER -->',
            filename: `turkish-ice-cream-summer-treat-authentic-${timestamp}.jpg`,
            prompt: "Close up of someone holding a traditional Turkish ice cream (Maraş dondurma) or a cold refreshing fruit drink. Summer sunset background. Happy, refreshing vibe. Authentic street food photo."
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
        title: { en: ARTICLE_DATA.title, tr: "Temmuz'da Türkiye: Zirve Yaz Konfor Planı (TR Pasif)" },
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
