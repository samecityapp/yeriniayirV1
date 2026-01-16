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
    slug: 'best-all-inclusive-value-uk-turkey',
    title: 'How to Get the Best All-Inclusive Value from the UK: Timing, Room Types, and Smart Trade-Offs',
    meta_description: 'Want better all-inclusive value in Turkey from the UK without guessing? Use this practical framework: when to travel, which room types are worth paying for, and the copy-paste questions that stop “cheap” deals becoming expensive surprises (no hotel names).',
    primary_keyword: 'best all-inclusive value from the UK Turkey',
    content: `<p><strong>Quick answer:</strong> The best all-inclusive value for UK travellers in Turkey usually comes from matching your trip timing to your priorities, then spending your budget on the upgrades you’ll actually use (room layout, location, and comfort) rather than “nice-to-have” extras. Use a simple value score: <strong>what you’ll consume</strong> (food/drinks/snacks), <strong>what reduces friction</strong> (transfer, room setup), and <strong>what protects sleep</strong> (noise/room placement).</p>

<h2>First: what “value” really means for an all-inclusive</h2>
<p>“Best value” is not the cheapest price. It’s the best match between what you pay and what you’ll genuinely use.</p>

<ul>
  <li><strong>True value</strong> = fewer extra costs + less hassle + more comfort (for your style)</li>
  <li><strong>False value</strong> = low headline price + lots of add-ons + annoying limitations</li>
</ul>

<p><strong>Simple rule:</strong> Don’t chase the biggest “included” list. Chase the <em>few inclusions</em> that drive your daily happiness.</p>

<p>Start with the basics if you need a refresher: <a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included (and What Usually Isn’t)</a>.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>Step 1: Pick your priority (then time your trip around it)</h2>
<p>Timing affects price, crowd level, heat, and availability. Because conditions vary year to year, use this as a <em>planning framework</em> rather than a promise.</p>

<h3>If your priority is: best price (value for money)</h3>
<ul>
  <li>Look for periods when demand is lower and choice is still good.</li>
  <li>Be flexible with travel dates if you can.</li>
  <li>Expect more availability for preferred room types.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you have school-age children, your flexibility drops — so value comes more from room setup, meal/snack access and transfer simplicity than from “bargain hunting”.</p>

<h3>If your priority is: calm resort feel (less busy)</h3>
<ul>
  <li>Choose dates that are less likely to be peak for both UK and local travel.</li>
  <li>Prioritise resorts with genuine quiet areas and room placement options.</li>
</ul>

<p><strong>Simple rule:</strong> If you hate queues and pool-bed competition, pay for the resort style and layout that reduces friction, not the fanciest marketing.</p>

<h3>If your priority is: “perfect pool weather”</h3>
<ul>
  <li>Think about heat tolerance (especially for young kids and older travellers).</li>
  <li>Shade access becomes part of value when it’s hot.</li>
</ul>

<p><strong>UK-friendly tip:</strong> A resort with plentiful shade can feel “more luxurious” than a pricier resort where you’re constantly escaping the sun.</p>

<p>For planning by season, use: <a href="/guide/best-time-to-visit-turkey-weather">Best Time to Visit Turkey: Weather and When It Feels Best</a>.</p>

<h2>Step 2: Spend on the upgrades that actually change your holiday</h2>
<p>Most people waste money on upgrades that look impressive but don’t change day-to-day comfort. Here’s what tends to matter most.</p>

<h3>Upgrade #1 (often worth it): the right room layout</h3>
<p>Room layout affects sleep, naps, downtime, and how “rested” you feel.</p>

<ul>
  <li><strong>Families:</strong> separate sleeping area can be a game-changer</li>
  <li><strong>Couples:</strong> quieter room placement often matters more than square metres</li>
  <li><strong>Everyone:</strong> a room you can actually relax in reduces the urge to spend elsewhere</li>
</ul>

<p><strong>Simple rule:</strong> If an upgrade improves sleep, it’s usually worth considering.</p>

<!-- IMAGE_ROOM_LAYOUT_PLACEHOLDER -->

<p>Families: use <a href="/guide/all-inclusive-family-checklist">All-Inclusive for Families: The Non-Negotiables</a> to decide what you truly need.</p>

<h3>Upgrade #2 (situational): room location (quiet vs central)</h3>
<p>Central rooms can be convenient but noisier. Quiet rooms can feel more “premium” even without luxury branding.</p>

<ul>
  <li>If you want early nights, prioritise distance from stage/bars/main pool</li>
  <li>If you love nightlife, being closer can be a plus</li>
</ul>

<p><strong>UK-friendly tip:</strong> Ask “What’s directly below/next to this room block?” That question is more useful than “Is it quiet?”</p>

<h3>Upgrade #3 (sometimes): view upgrades</h3>
<p>Views can feel special, but they don’t always increase comfort. Consider them only after you’ve secured layout and quiet.</p>

<ul>
  <li>Pay for a view if you’ll use your balcony/terrace daily</li>
  <li>Skip it if you mainly live by the pool/beach</li>
</ul>

<p><strong>Simple rule:</strong> If you won’t sit outside, don’t pay for the view.</p>

<h3>Upgrade #4 (be careful): “premium all-inclusive” tiers</h3>
<p>Some resorts offer higher tiers (sometimes described as “premium” or “ultra”). The value depends on what changes in practice.</p>

<ul>
  <li>Is it better drinks, or just a longer list of brands you won’t order?</li>
  <li>Does it unlock more dining access (à la carte limits/booking)?</li>
  <li>Does it include better rooms or just different wristbands?</li>
</ul>

<p>Use this explainer: <a href="/guide/ultra-all-inclusive-in-turkey-explained-expectations-uk-guide">Ultra All Inclusive Explained</a>.</p>

<h2>Step 3: Avoid “cheap becoming expensive” (the hidden-cost framework)</h2>
<p>Hidden costs aren’t automatically bad — they’re only bad when you don’t expect them. The goal is clarity.</p>

<h3>The most common add-ons that change your total spend</h3>
<ul>
  <li>Premium spirits/cocktails or branded items</li>
  <li>À la carte limits or chargeable dishes</li>
  <li>Water activities, spa, or games rooms</li>
  <li>Airport transfer choices (shared vs private)</li>
</ul>

<!-- IMAGE_HIDDEN_COSTS_PLACEHOLDER -->

<p>Full guide here: <a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts</a>.</p>

<p><strong>Simple rule:</strong> If you care about something (cocktails, à la carte, late snacks), confirm it specifically — don’t assume it’s included.</p>

<h2>Step 4: Choose the right region for your value goal</h2>
<p>Where you stay shapes your “value” because it affects transfer friction, resort style, and what you’ll do outside.</p>

<ul>
  <li><strong>Resort-first travellers:</strong> choose regions known for large all-inclusive setups and easy logistics</li>
  <li><strong>Calm + scenery travellers:</strong> choose greener bay-style regions (then check entertainment style)</li>
  <li><strong>Explore-minded travellers:</strong> choose areas that make day trips realistic</li>
</ul>

<p>Use: <a href="/guide/best-regions-for-all-inclusive-turkey">Best Regions for All-Inclusive in Turkey</a>.</p>

<h2>Copy-paste checklist: questions that protect your value</h2>
<p>These questions are designed to get useful answers quickly and prevent “fine print” surprises.</p>

<ul>
  <li>What exactly is included in <strong>drinks</strong> (and what is considered premium/extra)?</li>
  <li>Are there <strong>late snacks</strong>, and what are the serving hours?</li>
  <li>How do <strong>à la carte restaurants</strong> work: booking, limits, chargeable items?</li>
  <li>Is the transfer <strong>shared or private</strong>, and what’s the typical transfer time?</li>
  <li>What room types are available, and does “family room” mean <strong>separate sleeping area</strong>?</li>
  <li>Can we request a <strong>quiet room</strong> away from stage/bars/pool speakers?</li>
  <li>Are any activities that look “included” actually <strong>chargeable</strong> (water sports, games room, spa)?</li>
  <li>Is there a dress code for dinner venues (especially à la carte)?</li>
</ul>

<!-- IMAGE_CHECKLIST_PLACEHOLDER -->

<p>For dining specifics, use: <a href="/guide/a-la-carte-all-inclusive-turkey">A La Carte Restaurants in All-Inclusive</a>.</p>

<h2>A simple value score you can use (no maths stress)</h2>
<p>Give each resort a quick score from 1–5 for each category based on what you learn. You’re not trying to be scientific — you’re trying to choose confidently.</p>

<ul>
  <li><strong>Sleep & comfort:</strong> room layout + quiet room options + bed comfort</li>
  <li><strong>Food reality:</strong> reliable basics + snack access + meal timings</li>
  <li><strong>Drink fit:</strong> the drinks you’ll actually order are included</li>
  <li><strong>Friction:</strong> transfer simplicity + layout convenience</li>
  <li><strong>Surprise risk:</strong> clarity on extras (low risk = higher score)</li>
</ul>

<p><strong>Simple rule:</strong> The resort with the highest “surprise risk” is rarely good value — even if the headline price is low.</p>

<!-- IMAGE_VALUE_SCORE_PLACEHOLDER -->

<h2>What to do if you’re booking a package vs separately (UK mindset)</h2>
<p>Value changes depending on how you book because what’s bundled differs. Instead of assuming one is always cheaper, compare like-for-like:</p>

<ul>
  <li>Is transfer included, and what type is it?</li>
  <li>Are checked bags included?</li>
  <li>What room category is actually included?</li>
  <li>Are you comparing the same board basis (all-inclusive vs ultra/premium)?</li>
</ul>

<p>Use this framework: <a href="/guide/package-vs-separate-turkey">Package Holiday vs Booking Separately for Turkey</a>.</p>

<h2>Quick summary: the 5 best value moves</h2>
<ul>
  <li>Choose your coast based on your style first</li>
  <li>Pay for room layout and quiet (sleep is value)</li>
  <li>Confirm snack access and drink policy (daily reality)</li>
  <li>Ask about à la carte booking/limits before you arrive</li>
  <li>Compare packages like-for-like (transfer, bags, room category)</li>
</ul>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Value Guide Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `value-turkey-all-inclusive-planning-${timestamp}.jpg`,
            prompt: "A relaxed traveller (UK style) planning a holiday at a cafe, looking at a tablet with beautiful Turkey photos. Coffee on table. Calm, organized, positive vibe. Authentic travel planning moment."
        },
        {
            placeholder: '<!-- IMAGE_ROOM_LAYOUT_PLACEHOLDER -->',
            filename: `hotel-room-layout-comfort-authentic-${timestamp}.jpg`,
            prompt: "A comfortable, spacious hotel room in Turkey. Clean, airy, showing a practical layout (maybe a partition or seating area). inviting bed, soft light. Authentic interior photography."
        },
        {
            placeholder: '<!-- IMAGE_HIDDEN_COSTS_PLACEHOLDER -->',
            filename: `resort-extras-drinks-menu-authentic-${timestamp}.jpg`,
            prompt: "A close up of a drinks menu at a resort bar, showing some items as 'included' and others as 'premium'. Hand holding a drink. Authentic travel detail, realistic lighting."
        },
        {
            placeholder: '<!-- IMAGE_CHECKLIST_PLACEHOLDER -->',
            filename: `travel-checklist-notebook-authentic-${timestamp}.jpg`,
            prompt: "A handwritten travel checklist in a notebook on a rustic table. Items like 'Quiet Room', 'Transfer', 'Late Snacks' visible. Sunglasses and a passport nearby. Authentic travel prep vibe."
        },
        {
            placeholder: '<!-- IMAGE_VALUE_SCORE_PLACEHOLDER -->',
            filename: `happy-couple-at-resort-sunset-${timestamp}.jpg`,
            prompt: "A happy couple enjoying a drink on a balcony at sunset in Turkey. Relaxed smiles, feeling they made a great choice. Warm golden hour light. Authentic emotion, not staged stock photo."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('COVER')) await sleep(8000);

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
        title: { en: ARTICLE_DATA.title, tr: "En İyi Her Şey Dahil Değerini Yakalamak (TR Pasif)" },
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
