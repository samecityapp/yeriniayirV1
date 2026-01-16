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
    slug: 'money-budgeting-turkey-daily-cost-framework-uk',
    title: 'Money in Turkey for UK Travellers: A Realistic Daily Budget Framework (Without Guessing Prices)',
    meta_description: 'Turkey is a fantastic-value destination for many UK travellers — and budgeting is easiest when you avoid unreliable “average prices”. Use this simple framework to plan daily spending by trip style (city break vs resort), keep your money setup smooth, and build a flexible buffer so you can enjoy Turkey confidently.',
    primary_keyword: 'money in Turkey for UK travellers',
    content: `<p><strong>Quick answer:</strong> The most reliable way to budget for Turkey from the UK is to stop searching for “typical prices” and instead build a simple daily framework: choose your trip style, split spending into clear categories, set a daily comfort level (low / moderate / treat), and add a flexible buffer because exchange rates and personal choices vary. Turkey uses the Turkish lira, and rates move over time — so a smart plan stays flexible.</p>

<h2>Why “average prices” usually fail (and what works better)</h2>
<p>UK travellers often get conflicting price info because costs depend on:</p>
<ul>
  <li>your <strong>destination type</strong> (city vs resort)</li>
  <li>your <strong>season</strong> and travel dates</li>
  <li>your <strong>habits</strong> (coffee stops, taxis, day trips, shopping)</li>
  <li>your <strong>exchange rate</strong> on the day</li>
</ul>

<p><strong>Simple rule:</strong> Don’t budget off internet “averages”. Budget off <em>your</em> trip style.</p>

<!-- IMAGE_BUDGET_PLANNING_NOTE_PLACEHOLDER -->

<h2>Step 1: Choose your trip style (this determines your spend pattern)</h2>

<h3>City break (Istanbul-style days)</h3>
<ul>
  <li>More <strong>transport</strong> (public transport + occasional taxis)</li>
  <li>More <strong>food/drinks out</strong> (multiple stops per day)</li>
  <li>More <strong>attractions</strong> (tickets, museums, experiences)</li>
</ul>

<p>Pair with: <a href="/guide/public-transport-turkey-tourist-guide">Public Transport in Turkey for UK Tourists</a></p>

<!-- IMAGE_CITY_BREAK_SPEND_PLACEHOLDER -->

<h3>Resort holiday (all-inclusive or resort-led)</h3>
<ul>
  <li>Daily spending can be lower if many meals/drinks are included</li>
  <li>Extras are often <strong>optional</strong> (spa, activities, off-site trips)</li>
  <li>A smooth budget depends on knowing what’s included</li>
</ul>

<p>Pair with:</p>
<ul>
  <li><a href="/guide/all-inclusive-whats-included-turkey-guide">All-Inclusive in Turkey: What’s Included</a></li>
  <li><a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts</a></li>
</ul>

<!-- IMAGE_RESORT_SPEND_PLACEHOLDER -->

<h2>Step 2: Split your spend into 6 simple categories</h2>
<p>These categories work for almost every UK traveller:</p>

<ul>
  <li><strong>Food & drinks out:</strong> cafés, meals, treats</li>
  <li><strong>Transport:</strong> public transport, taxis, short rides</li>
  <li><strong>Attractions & experiences:</strong> tickets, tours, day trips</li>
  <li><strong>Convenience:</strong> small essentials, snacks, “forgotten items”</li>
  <li><strong>Tips:</strong> if you choose to tip for great service</li>
  <li><strong>Shopping:</strong> souvenirs and personal buys</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you track only one thing, track “extras” (experiences + shopping). That’s where budgets usually drift — in a fun way.</p>

<!-- IMAGE_SPENDING_CATEGORIES_PLACEHOLDER -->

<h2>Step 3: Pick your daily comfort level (no numbers needed)</h2>
<p>Instead of pricing every item, choose a daily “mode”.</p>

<h3>Low-spend mode (simple, efficient)</h3>
<ul>
  <li>Public transport + walking</li>
  <li>One main meal out, other stops kept simple</li>
  <li>One paid attraction/experience every couple of days (or fewer)</li>
</ul>

<h3>Moderate mode (balanced and relaxed)</h3>
<ul>
  <li>Mix of public transport and occasional taxis</li>
  <li>Meals out + regular café stops</li>
  <li>Paid attractions/experiences on most days</li>
</ul>

<h3>Treat mode (comfort-first)</h3>
<ul>
  <li>More taxis / convenience choices</li>
  <li>More “special” meals and experiences</li>
  <li>Shopping and extras become part of the fun</li>
</ul>

<p><strong>Simple rule:</strong> Decide your “mode” each morning. Your budget stays in control without feeling restrictive.</p>

<h2>Step 4: Add a buffer (the smartest part of a Turkey budget)</h2>
<p>Because exchange rates and daily choices can vary, a buffer keeps your trip feeling confident and enjoyable. Turkey’s official currency is the Turkish lira, and exchange rates are published and updated over time by official sources.</p>

<ul>
  <li><strong>City breaks:</strong> buffer for extra rides, extra stops, extra tickets</li>
  <li><strong>Resorts:</strong> buffer for spa/activities and off-site days</li>
  <li><strong>Families:</strong> buffer for convenience spending (snacks, little essentials)</li>
</ul>

<p><strong>UK-friendly tip:</strong> A buffer isn’t “wasted money” — it’s what lets you say yes to the moments that make Turkey memorable.</p>

<h2>Step 5: Set up your spending system (so the plan is effortless)</h2>
<p>Budgeting works best when your payment setup is smooth.</p>

<ul>
  <li>Use a <strong>main card</strong> for everyday spending</li>
  <li>Keep a <strong>backup card</strong> stored separately</li>
  <li>Carry a <strong>small cash amount</strong> for convenience and tips</li>
  <li>Withdraw cash calmly when needed (fewer, more intentional withdrawals)</li>
</ul>

<p>Use: <a href="/guide/using-cards-cash-atms-turkey-money-guide">Using Cards, Cash & ATMs in Turkey</a></p>

<h2>One “avoid surprises” payment tip (worth knowing)</h2>
<p>Sometimes card terminals or ATMs may offer to convert your payment into your home currency at the point of sale (a currency conversion option). For clear budgeting, many travellers prefer paying in the <strong>local currency</strong> so the conversion happens via their own bank/card terms.</p>

<p><strong>Simple rule:</strong> When given a currency choice, choose the local currency for clearer comparisons.</p>

<h2>Copy-paste: your Turkey budget plan template</h2>
<p>Copy this into Notes and fill it in:</p>

<ul>
  <li>Trip style: [City break / Resort / Mixed]</li>
  <li>Daily mode target: [Low / Moderate / Treat]</li>
  <li>Top 3 spend categories for this trip: [e.g., food, attractions, taxis]</li>
  <li>Buffer purpose: [extras / shopping / convenience / family]</li>
  <li>Main payment method: [Card]</li>
  <li>Backup method: [Backup card location]</li>
  <li>Cash plan: [Small daily cash + top-up plan]</li>
</ul>

<!-- IMAGE_BUFFER_ENJOYMENT_PLACEHOLDER -->

<h2>FAQ: money and budgeting in Turkey (UK travellers)</h2>

<h3>What currency is used in Turkey?</h3>
<p>Turkey uses the Turkish lira.</p>

<h3>Is it better to budget in pounds or local currency?</h3>
<p>Plan in pounds for your overall comfort, but think in “categories” day-to-day. When you’re paying, local-currency awareness helps you stay grounded.</p>

<h3>How do I budget without checking prices all the time?</h3>
<p>Use daily “modes” (low/moderate/treat) and category caps. It’s easier than pricing every item and keeps the holiday fun.</p>

<h3>Why do I need a buffer?</h3>
<p>A buffer keeps your trip flexible and enjoyable — especially when daily choices and exchange rates can vary over time.</p>

<h3>Is a resort holiday easier to budget than a city break?</h3>
<p>Often yes, because more is bundled. The key is understanding what’s included and treating extras as optional.</p>

<h3>What’s the simplest payment setup?</h3>
<p>Main card + backup card + small cash stash. That combination covers almost every situation smoothly.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Budget Framework Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_BUDGET_PLANNING_NOTE_PLACEHOLDER -->',
            filename: `travel-budget-journal-pen-authentic-${timestamp}.jpg`,
            prompt: "A close-up of a travel journal open on a table with a pen, showing a handwritten list titled 'Holiday Budget'. Coffee cup nearby. Authentic planning vibe. Soft, natural lighting. High quality."
        },
        {
            placeholder: '<!-- IMAGE_CITY_BREAK_SPEND_PLACEHOLDER -->',
            filename: `istanbul-cafe-payment-moment-authentic-${timestamp}.jpg`,
            prompt: "A tourist paying for two coffees at a charming Istanbul cafe. Card terminal, cups on table. Vibrant city atmosphere in background but blurred. Authentic travel lifestyle."
        },
        {
            placeholder: '<!-- IMAGE_RESORT_SPEND_PLACEHOLDER -->',
            filename: `resort-poolside-drink-relax-authentic-${timestamp}.jpg`,
            prompt: "POV of a relaxing drink by a resort pool in Turkey. Sunglasses on table. 'All-inclusive' feeling of no immediate payment needed. Very relaxed, sunny, authentic holiday vibe."
        },
        {
            placeholder: '<!-- IMAGE_SPENDING_CATEGORIES_PLACEHOLDER -->',
            filename: `travel-essentials-flatlay-money-cards-authentic-${timestamp}.jpg`,
            prompt: "A stylish flatlay of travel essentials: a wallet, some Turkish Lira notes, a public transport card (Istanbulkart style), and museum tickets. Organized but natural. Authentic travel gear."
        },
        {
            placeholder: '<!-- IMAGE_BUFFER_ENJOYMENT_PLACEHOLDER -->',
            filename: `happy-tourist-shopping-bazaar-authentic-${timestamp}.jpg`,
            prompt: "A happy tourist browsing in a Turkish bazaar, holding a small shopping bag. Smiling, enjoying the moment without worry. Colourful background of lamps or ceramics. Authentic travel joy."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('NOTE')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the journal one?
            if (item.filename.includes('journal')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye İçin Gerçekçi Günlük Bütçe Rehberi (TR Pasif)" },
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
