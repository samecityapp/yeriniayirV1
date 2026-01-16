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
    slug: 'food-drink-costs-turkey-budgeting-guide-uk',
    title: 'Food & Drink Costs in Turkey for UK Travellers: How to Budget by Style (Without Unreliable “Average Prices”)',
    meta_description: 'Food in Turkey can fit almost any UK holiday style — from simple local bites to full “treat” dinners. Instead of unreliable “average prices”, use this practical budgeting guide: choose your eating style, set a daily routine, plan 1–2 splurges, and avoid surprises with smart menu habits. Includes checklists, copy-paste questions, and FAQs.',
    primary_keyword: 'food and drink costs in Turkey for UK travellers',
    content: `<p><strong>Quick answer:</strong> The easiest way to budget for food and drink in Turkey is to plan by <em>style</em>, not “average prices”. Decide what you want your days to feel like (simple / balanced / treat), split spend into a few categories (breakfast, cafés, meals, drinks, extras), and use two habits: (1) check the menu before you sit, and (2) choose your “treat moments” on purpose. That’s how you enjoy Turkey without money stress.</p>

<h2>Why “average food prices” usually mislead UK travellers</h2>
<p>Turkey has a huge range of eating styles — and your daily spend changes fast depending on:</p>
<ul>
  <li><strong>Where you are:</strong> major tourist streets vs local neighbourhoods</li>
  <li><strong>What you order:</strong> simple staples vs premium dishes</li>
  <li><strong>How you travel:</strong> city break with multiple stops vs resort days</li>
  <li><strong>Your routine:</strong> “one main meal” days vs “coffee-and-snack hopping” days</li>
  <li><strong>Exchange rate and season:</strong> both can shift how prices feel in pounds</li>
</ul>

<p><strong>Simple rule:</strong> Don’t budget off the internet. Budget off your day structure.</p>

<!-- IMAGE_MENU_SELECTION_PLACEHOLDER -->

<h2>Step 1: Choose your Turkey eating style (this is the whole system)</h2>

<h3>Style A — Simple & local (low-stress, low-spend)</h3>
<ul>
  <li>One main meal out</li>
  <li>Other stops kept simple (snack, bakery-style bites, quick lunches)</li>
  <li>Water/soft drinks kept minimal</li>
</ul>

<h3>Style B — Balanced holiday (most UK travellers)</h3>
<ul>
  <li>Two meals out (or one meal + cafés)</li>
  <li>Regular coffee/tea stops</li>
  <li>One “nice” dinner every couple of days</li>
</ul>

<h3>Style C — Treat-led (comfort-first)</h3>
<ul>
  <li>Atmosphere-driven restaurants most evenings</li>
  <li>More drinks and desserts</li>
  <li>More “we’ll decide as we go” choices (which is fine — just plan a buffer)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Pick your style in one sentence before the trip. It instantly clarifies your budget.</p>

<!-- IMAGE_SIMPLE_LOCAL_MEAL_PLACEHOLDER -->

<h2>Step 2: Build your “day structure” (budgeting without numbers)</h2>
<p>Instead of tracking prices, track the number of paid moments in your day.</p>

<h3>City break day structure (Istanbul-style)</h3>
<ul>
  <li><strong>Morning:</strong> breakfast OR first café stop</li>
  <li><strong>Midday:</strong> lunch</li>
  <li><strong>Afternoon:</strong> coffee + snack (optional)</li>
  <li><strong>Evening:</strong> dinner</li>
  <li><strong>Extras:</strong> drinks, desserts, “we found this place” moments</li>
</ul>

<p><strong>Simple rule:</strong> The more stops you do, the more you need a simple plan.</p>

<h3>Resort day structure (all-inclusive or resort-led)</h3>
<ul>
  <li><strong>Main meals:</strong> often included</li>
  <li><strong>Spending hotspots:</strong> off-site cafés, day trips, premium drinks/extras, treats outside the resort</li>
</ul>

<p>Use these to stay clear on inclusions and extras:</p>
<ul>
  <li><a href="/guide/all-inclusive-whats-included-turkey-guide">All-Inclusive in Turkey: What’s Included</a></li>
  <li><a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts</a></li>
</ul>

<h2>Step 3: Split food & drink into 5 budget categories</h2>
<p>This makes your spending feel predictable — without calculating every item.</p>

<ul>
  <li><strong>Essentials:</strong> water, quick snacks, “I just need something now” buys</li>
  <li><strong>Cafés:</strong> coffees/teas, pastries, small daytime treats</li>
  <li><strong>Main meals:</strong> lunch and dinner</li>
  <li><strong>Drinks & desserts:</strong> the fun add-ons that can quietly stack up</li>
  <li><strong>Experience meals:</strong> your “special” dinners with views/ambience</li>
</ul>

<p><strong>UK-friendly tip:</strong> If your budget drifts, it’s usually “drinks & desserts” + “experience meals”. Track those two lightly and you’ll stay in control.</p>

<!-- IMAGE_CAFE_MOMENT_PLACEHOLDER -->

<h2>The “choose your treat” method (works brilliantly in Turkey)</h2>
<p>Turkey is full of tempting places. The easiest way to enjoy them is to choose <em>when</em> you’ll spend more — so you don’t spend more accidentally every day.</p>

<ul>
  <li>Pick <strong>one treat moment per day</strong> (nice dinner OR multiple café stops OR desserts/drinks)</li>
  <li>Keep the rest of the day <strong>simple</strong></li>
  <li>If you want two treat moments, do it knowingly — and keep tomorrow simpler</li>
</ul>

<p><strong>Simple rule:</strong> One treat per day feels indulgent. Two treats per day needs a bigger budget buffer.</p>

<h2>Tourist streets vs local streets (how to think about it)</h2>
<p>In popular visitor areas, you’re often paying for location, views, and convenience. That can still be totally worth it — just decide intentionally.</p>

<h3>The best strategy (positive, not restrictive)</h3>
<ul>
  <li>Do <strong>one “view/atmosphere” meal</strong> when it suits your day</li>
  <li>Balance it with <strong>one simpler meal</strong> elsewhere</li>
  <li>Use cafés for breaks, but avoid turning every break into a full spend</li>
</ul>

<p><strong>UK-friendly tip:</strong> “One iconic meal + one normal meal” is the sweet spot for most people.</p>

<!-- IMAGE_EXPERIENCE_DINNER_PLACEHOLDER -->

<h2>Menu habits that prevent surprises (and keep the holiday fun)</h2>

<h3>Before you sit down</h3>
<ul>
  <li>Look at the menu and decide if it matches your budget mood today</li>
  <li>If prices aren’t visible, ask calmly before ordering</li>
  <li>If you’re in a rush, choose the simpler option and keep moving</li>
</ul>

<h3>When ordering</h3>
<ul>
  <li>Confirm if an item is <strong>for one</strong> or <strong>for sharing</strong></li>
  <li>If you’re ordering multiple things, ask what’s “best as a set” (it reduces over-ordering)</li>
  <li>Keep drinks intentional (they can quietly become the biggest line item)</li>
</ul>

<p><strong>Simple rule:</strong> Menu clarity first, then relax and enjoy.</p>

<h2>All-inclusive: budgeting for food and drink outside the resort</h2>
<p>Even in all-inclusive, UK travellers often spend on:</p>
<ul>
  <li>One or two off-site “local food” experiences</li>
  <li>Day trips (where you’ll eat and drink outside)</li>
  <li>Cafés on walking days</li>
  <li>Souvenirs and treats</li>
</ul>

<p><strong>UK-friendly tip:</strong> For all-inclusive trips, budget “outside food” as an <em>experience</em>, not a necessity. It keeps it fun and controlled.</p>

<h2>Copy-paste questions (use these anywhere)</h2>
<p>These save time and keep everything smooth:</p>

<ul>
  <li>“Is this dish for one person or to share?”</li>
  <li>“Is service included, or is tipping optional?”</li>
  <li>“Which option is best value if we want something filling but simple?”</li>
  <li>“Can we see the menu before we sit down?”</li>
  <li>“Do you have a smaller portion / half portion option?”</li>
</ul>

<p><strong>UK-friendly tip:</strong> One clear question prevents five minutes of awkward guessing.</p>

<!-- IMAGE_SHARING_MEAL_PLACEHOLDER -->

<h2>Mini checklists by trip type</h2>

<h3>City break (Istanbul-style) — keep spending predictable</h3>
<ul>
  <li>Choose your daily mode: simple / balanced / treat</li>
  <li>Limit café “add-ons” (desserts + extra drinks) unless it’s your treat moment</li>
  <li>Plan one standout dinner, then keep the next day simpler</li>
</ul>

<p>Pair with: <a href="/guide/public-transport-turkey-tourist-guide">Public Transport in Turkey for UK Tourists</a></p>

<h3>Resort holiday — keep extras intentional</h3>
<ul>
  <li>Know what’s included (snacks, drinks, à la carte rules)</li>
  <li>Choose 1–2 off-site food moments you’ll actually remember</li>
  <li>Keep a small cash stash for quick cafés and tips (if you choose)</li>
</ul>

<p>Pair with: <a href="/guide/best-all-inclusive-value-uk-guide">How to Get the Best All-Inclusive Value from the UK</a></p>

<h2>FAQ: food and drink budgeting in Turkey (UK travellers)</h2>

<h3>Is Turkey “cheap” for food?</h3>
<p>Turkey can feel like great value, but it depends on where and how you eat. A simple plan (local bites + one treat meal) usually delivers the best value and the best experience.</p>

<h3>How do I budget without looking up prices?</h3>
<p>Budget by “number of paid moments” in a day and choose your style (simple/balanced/treat). That controls your spending without turning the trip into a spreadsheet.</p>

<h3>What causes food budgets to blow up?</h3>
<p>Lots of extra stops (multiple cafés, desserts, drinks) plus frequent “experience meals”. It’s not a problem — just make those choices intentional.</p>

<h3>Are tourist areas always bad value?</h3>
<p>No. Sometimes you’re paying for location, views and convenience — which can be worth it. The smart approach is balancing one iconic meal with one simpler meal.</p>

<h3>How should all-inclusive travellers budget for food outside?</h3>
<p>Treat outside meals as optional “experiences” (1–2 memorable meals), plus café spending on day trips. Most of your daily eating is already handled.</p>

<h3>What’s the simplest habit to avoid surprises?</h3>
<p>Check the menu before you sit (or ask calmly), and decide your one “treat moment” for the day. Everything becomes easy after that.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Food & Drink Cost Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_MENU_SELECTION_PLACEHOLDER -->',
            filename: `couple-checking-menu-restaurant-authentic-${timestamp}.jpg`,
            prompt: "A couple checking a restaurant menu displayed on a stand before entering. Casual, relaxed. Authentic street dining atmosphere in Turkey. Warm lighting. High quality."
        },
        {
            placeholder: '<!-- IMAGE_SIMPLE_LOCAL_MEAL_PLACEHOLDER -->',
            filename: `simple-turkish-street-food-authentic-${timestamp}.jpg`,
            prompt: "A delicious, simple Turkish meal (like Pide or Lahmacun) served on a wooden board. Fresh, authentic local food photography. Sharp focus, natural colours. Inviting."
        },
        {
            placeholder: '<!-- IMAGE_CAFE_MOMENT_PLACEHOLDER -->',
            filename: `turkish-tea-simit-cafe-break-authentic-${timestamp}.jpg`,
            prompt: "A glass of Turkish tea and a Simit (sesame ring) on a small cafe table. Sunlight patterns. Relaxed afternoon break vibe. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_EXPERIENCE_DINNER_PLACEHOLDER -->',
            filename: `rooftop-dinner-view-istanbul-authentic-${timestamp}.jpg`,
            prompt: "Dining at a rooftop restaurant with a view of the Bosphorus or city lights. Elegant but accessible. 'Treat night' atmosphere. Soft evening light. Authentic travel experience."
        },
        {
            placeholder: '<!-- IMAGE_SHARING_MEAL_PLACEHOLDER -->',
            filename: `group-sharing-meze-platter-authentic-${timestamp}.jpg`,
            prompt: "A group of friends sharing a variety of Meze dishes on a table. Hands reaching in, social dining atmosphere. Authentic Turkish hospitality. Warm, inviting."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('MENU')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // first image as cover? let's use the simple local meal or the cafe one. 
            // actually the menu selection fits 'budgeting' well.
            if (item.filename.includes('menu')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Yeme İçme Maliyetleri ve Bütçe (TR Pasif)" },
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
