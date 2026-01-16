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
    slug: 'bargaining-in-turkey-haggling-guide-uk-tourists',
    title: 'Bargaining in Turkey: A UK-Friendly Guide to Polite Haggling (Markets & Bazaars, No Awkwardness)',
    meta_description: 'Bargaining in Turkey can be friendly and enjoyable when you keep it polite and simple. This UK-focused guide shows when haggling is normal, when it isn’t, how to make offers without awkwardness, and how to set a spending limit so you don’t overpay or overspend. Includes copy-paste phrases and FAQs.',
    primary_keyword: 'bargaining in Turkey for UK travellers',
    content: `<p><strong>Quick answer:</strong> Bargaining in Turkey is often a friendly part of market culture — but it works best when you keep it polite, light, and fair. Haggle in places where it’s normal (markets/bazaars, some independent stalls), and don’t haggle where prices are clearly fixed. Decide your max spend before you start, make a calm offer, and be happy to walk away. That’s the whole skill.</p>

<h2>Is bargaining expected in Turkey?</h2>
<p>In many traditional markets and bazaars, yes — bargaining can be part of the experience. In modern retail settings, supermarkets, and places with clearly displayed fixed prices, bargaining is usually not the norm.</p>

<p><strong>Simple rule:</strong> If it feels like a “market stall”, bargaining may be normal. If it feels like a “shop with a fixed till”, pay the price and move on.</p>

<!-- IMAGE_MARKET_STALL_INTERACTION_PLACEHOLDER -->

<h2>Where bargaining is normal (and where it usually isn’t)</h2>

<h3>Usually normal</h3>
<ul>
  <li>Markets and bazaars</li>
  <li>Independent souvenir stalls</li>
  <li>Handmade goods and crafts where pricing is flexible</li>
</ul>

<h3>Usually not normal</h3>
<ul>
  <li>Supermarkets and convenience shops</li>
  <li>Chain-style stores and malls</li>
  <li>Places where prices are clearly labelled and consistent</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re unsure, ask with a smile: “Is this the best price?” It’s a soft way to test whether bargaining is welcome.</p>

<h2>The mindset that makes bargaining feel easy (and respectful)</h2>
<p>UK travellers often worry about being rude. The solution is to treat bargaining as a friendly conversation, not a confrontation.</p>

<ul>
  <li>Be warm and respectful</li>
  <li>Be clear about your budget</li>
  <li>Be happy to walk away without drama</li>
</ul>

<p><strong>Simple rule:</strong> If you’d feel uncomfortable saying it in a friendly tone, don’t say it.</p>

<h2>Step-by-step: how to bargain without awkwardness</h2>

<h3>Step 1: decide your “max price” before you ask</h3>
<p>This prevents impulse buys and keeps your holiday spending calm.</p>
<ul>
  <li>Ask yourself: “What would I feel happy paying for this?”</li>
  <li>Set a max and stick to it</li>
  <li>If you can’t decide, it’s not a must-buy</li>
</ul>

<p>For spending structure, use: <a href="/guide/money-budgeting-turkey-daily-cost-framework-uk">Money in Turkey: Daily Budget Framework</a></p>

<!-- IMAGE_CALCULATED_OFFER_PHONE_PLACEHOLDER -->

<h3>Step 2: ask the price and keep your reaction neutral</h3>
<ul>
  <li>Don’t look shocked</li>
  <li>Don’t look overly excited</li>
  <li>Just stay calm and friendly</li>
</ul>

<p><strong>UK-friendly tip:</strong> Your facial expression is part of the negotiation.</p>

<h3>Step 3: make a polite offer</h3>
<p>Make an offer that feels fair to you. If you’re buying more than one item, bundle your offer.</p>

<ul>
  <li>Single item: “Could you do it for [your price]?”</li>
  <li>Multiple items: “If I take these two/three, what’s the best total price?”</li>
</ul>

<p><strong>Simple rule:</strong> Bundle buys are often the easiest way to get a better deal without aggressive haggling.</p>

<h3>Step 4: pause (silence helps)</h3>
<p>After you offer, stop talking. Let the seller respond. This is the part UK travellers often skip.</p>

<p><strong>UK-friendly tip:</strong> A calm pause does more than extra words.</p>

<h3>Step 5: decide quickly and stick to your max</h3>
<ul>
  <li>If it’s within your max and you want it, say yes and enjoy it</li>
  <li>If it’s not, smile and say you’ll think — then walk away</li>
</ul>

<p><strong>Simple rule:</strong> Walking away politely is a normal part of market shopping.</p>

<!-- IMAGE_WALKING_AWAY_POLITE_PLACEHOLDER -->

<h2>How to bargain when you don’t speak Turkish</h2>
<p>You don’t need Turkish to bargain politely. Use simple English, a calculator screen, or your phone notes.</p>

<ul>
  <li>Use clear numbers</li>
  <li>Point politely</li>
  <li>Smile and keep it friendly</li>
</ul>

<p><strong>UK-friendly tip:</strong> Showing the number on your phone avoids confusion and keeps everything smooth.</p>

<!-- IMAGE_HANDSHAKE_DEAL_PLACEHOLDER -->

<h2>Paying and currency: keep it clear</h2>
<p>Many stalls prefer cash; some accept card. Keep both options available if you’re shopping a lot.</p>

<ul>
  <li>Use card for bigger purchases when available</li>
  <li>Use cash for fast purchases and easy bargaining</li>
  <li>If a card terminal offers a currency choice, many travellers prefer paying in local currency for clearer conversion via their bank/card terms</li>
</ul>

<p>Helpful reads:</p>
<ul>
  <li><a href="/guide/using-cards-cash-atms-turkey-money-guide">Using Cards, Cash & ATMs in Turkey</a></li>
  <li><a href="/guide/exchange-rate-currency-conversion-turkey-guide-uk">Exchange Rates & Currency Conversion in Turkey</a></li>
</ul>

<h2>What not to do (so the experience stays positive)</h2>
<ul>
  <li>Don’t bargain aggressively on small, low-cost items — it can feel unnecessary</li>
  <li>Don’t push someone below a fair level just “because you can”</li>
  <li>Don’t pretend you’ll buy if you won’t</li>
  <li>Don’t let the moment pressure you into buying something you don’t want</li>
</ul>

<p><strong>Simple rule:</strong> Bargaining should feel friendly for both sides.</p>

<h2>Copy-paste phrases (UK-friendly, polite)</h2>
<ul>
  <li><strong>“Is this the best price?”</strong></li>
  <li><strong>“Could you do it for [X]?”</strong></li>
  <li><strong>“If I take two, what’s the best total?”</strong></li>
  <li><strong>“That’s a bit above my budget — thank you though.”</strong></li>
  <li><strong>“I’ll have a think and come back.”</strong></li>
</ul>

<p><strong>UK-friendly tip:</strong> “Thank you” is your bargaining superpower. It keeps everything warm and respectful.</p>

<h2>Quick checklist: the “no awkwardness” bargain method</h2>
<ul>
  <li>Decide your max price first</li>
  <li>Ask “Is this the best price?”</li>
  <li>Bundle items if buying more than one</li>
  <li>Make one calm offer</li>
  <li>Pause</li>
  <li>Say yes if happy, or walk away politely</li>
</ul>

<!-- IMAGE_HAPPY_PURCHASE_PLACEHOLDER -->

<h2>FAQ: bargaining in Turkey (UK travellers)</h2>

<h3>Do I have to bargain in Turkey?</h3>
<p>No. Bargaining is optional. If you don’t enjoy it, shop in fixed-price places and buy what you like without negotiating.</p>

<h3>Where should I bargain?</h3>
<p>Markets and bazaars are the main places where bargaining may be normal. In modern shops with fixed labels, bargaining usually isn’t expected.</p>

<h3>What’s the most polite way to start bargaining?</h3>
<p>Start softly: “Is this the best price?” If the seller engages, you can make a calm offer.</p>

<h3>Is it rude to walk away?</h3>
<p>No — walking away politely is normal in market culture. Just smile and say thank you.</p>

<h3>How do I avoid overspending when I’m enjoying the vibe?</h3>
<p>Set a max price before you ask, and choose 1–2 hero buys for your trip. That way you enjoy shopping without budget stress.</p>

<h3>Should I pay cash or card when bargaining?</h3>
<p>Cash can make bargaining and small purchases simpler. Card is great for bigger purchases when available. Keeping both options gives you the smoothest experience.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Bargaining Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_MARKET_STALL_INTERACTION_PLACEHOLDER -->',
            filename: `friendly-market-interaction-smile-authentic-${timestamp}.jpg`,
            prompt: "A polite, smiling tourist interacting with a friendly Turkish market seller. Relaxed, open body language. Colourful stall background (lamps or textiles). Authentic travel moment. Warm lighting."
        },
        {
            placeholder: '<!-- IMAGE_CALCULATED_OFFER_PHONE_PLACEHOLDER -->',
            filename: `showing-price-on-phone-calculator-authentic-${timestamp}.jpg`,
            prompt: "Close up of a hand holding a smartphone showing a calculator screen with a price, suggesting a polite offer in a market. Blurred background of market wares. Helpful, clear communication style. Authentic detail."
        },
        {
            placeholder: '<!-- IMAGE_WALKING_AWAY_POLITE_PLACEHOLDER -->',
            filename: `tourist-walking-away-smiling-market-authentic-${timestamp}.jpg`,
            prompt: "A tourist walking away from a stall in a Turkish market with a polite, friendly smile. 'No pressure' vibe. Colourful, busy background but focused on the calm tourist. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_HANDSHAKE_DEAL_PLACEHOLDER -->',
            filename: `handshake-deal-market-seller-authentic-${timestamp}.jpg`,
            prompt: "A warm handshake between a tourist and a market seller after a deal. Positive, respectful connection. Hands consistent with adult age. Authentic cultural exchange moment."
        },
        {
            placeholder: '<!-- IMAGE_HAPPY_PURCHASE_PLACEHOLDER -->',
            filename: `happy-tourist-holding-shopping-bag-authentic-${timestamp}.jpg`,
            prompt: "A happy tourist holding a shopping bag (traditional patterns maybe) in a sunny Turkish bazaar street. Looking satisfied with a purchase. Authentic, simple travel joy."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('INTERACTION')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the market interaction?
            if (item.filename.includes('interaction')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Pazarlık Rehberi (TR Pasif)" },
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
