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
    slug: 'shopping-souvenirs-turkey-budget-guide-uk',
    title: 'Shopping & Souvenirs in Turkey: A UK Budget Guide (What to Buy, How to Plan, No Overspending)',
    meta_description: 'Shopping in Turkey is one of the joys of the trip — colourful markets, beautiful crafts, and genuinely useful souvenirs. This UK-friendly guide shows what to buy, how to plan spending without guessing prices, how to pay smoothly, and how to keep purchases “travel-safe” (modern souvenirs, receipts, easy packing). Includes checklists and FAQs.',
    primary_keyword: 'shopping and souvenirs in Turkey',
    content: `<p><strong>Quick answer:</strong> The easiest way to enjoy shopping in Turkey is to keep it simple: decide what you want (useful souvenirs vs “just because”), set a daily or trip-wide shopping limit, pay in Turkish lira when given a choice, and focus on <strong>modern, everyday souvenirs</strong> that are easy to pack and easy to take home. Keep receipts for bigger purchases, and your shopping stays fun and stress-free.</p>

<h2>Why shopping in Turkey is genuinely worth your time</h2>
<p>Turkey is brilliant for souvenirs because you can buy things that are:</p>
<ul>
  <li><strong>Beautiful</strong> (craft, colour, design)</li>
  <li><strong>Practical</strong> (things you’ll actually use at home)</li>
  <li><strong>Giftable</strong> (easy wins for friends and family)</li>
</ul>

<p><strong>Simple rule:</strong> Buy souvenirs you’ll use — that’s how you feel good about the spend.</p>

<h2>What to buy in Turkey (UK traveller favourites, no guesswork)</h2>
<p>These categories are popular because they travel well and feel authentically “Turkey” without being complicated:</p>

<h3>Everyday “use-it-at-home” souvenirs</h3>
<ul>
  <li>Textiles (scarves, towels, throws)</li>
  <li>Home items (small ceramics, bowls, decorative pieces)</li>
  <li>Bath and self-care items (soap-style gifts, hammam-style accessories)</li>
</ul>

<!-- IMAGE_MODERN_SOUVENIRS_PLACEHOLDER -->

<h3>Food and drink gifts (easy suitcase wins)</h3>
<ul>
  <li>Spices and seasonings</li>
  <li>Packaged sweets and local treats</li>
  <li>Tea and café-style items</li>
</ul>

<h3>Small gifts that never fail</h3>
<ul>
  <li>Magnets, postcards, small crafts</li>
  <li>Jewellery-style accessories (choose what matches your taste and budget)</li>
  <li>Modern artisan items (the “I’ve never seen this at home” category)</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re unsure, go for something <em>small, modern, and useful</em>. That’s the safest “happy purchase” formula.</p>

<!-- IMAGE_SPICES_EDIBLE_GIFTS_PLACEHOLDER -->

<h2>The “no overspending” method (works in every Turkish market)</h2>
<p>You don’t need to know exact prices to keep control. Use this simple structure instead:</p>

<ul>
  <li><strong>Choose your souvenir role:</strong> (1) gifts, (2) home item, (3) personal treat</li>
  <li><strong>Set a shopping limit:</strong> per day (city break) or per trip (resort)</li>
  <li><strong>Pick 1–2 “hero buys”</strong> you’ll be excited about</li>
  <li><strong>Keep the rest small</strong> (so your suitcase and budget stay comfortable)</li>
</ul>

<p><strong>Simple rule:</strong> One or two hero buys + a few small gifts = the perfect Turkey shopping balance.</p>

<p>For the bigger money framework (without dodgy averages): <a href="/guide/money-budgeting-turkey-daily-cost-framework-uk">Money in Turkey: Daily Budget Framework</a></p>

<!-- IMAGE_MARKET_BROWSING_PLACEHOLDER -->

<h2>Paying for souvenirs: card, cash, and the “lira” habit</h2>
<p>Many places accept cards, but cash can still be useful in markets and for smaller purchases.</p>

<ul>
  <li><strong>Card-first</strong> for larger or planned purchases</li>
  <li><strong>Cash</strong> for small buys and quick moments</li>
  <li>If a card terminal offers a currency choice, many travellers prefer paying in <strong>local currency (TRY)</strong> for clearer conversion via their bank/card terms.</li>
</ul>

<p><strong>UK-friendly tip:</strong> Keep a small cash stash for markets — it makes shopping feel effortless.</p>

<p>Helpful reads:</p>
<ul>
  <li><a href="/guide/using-cards-cash-atms-turkey-money-guide">Using Cards, Cash & ATMs in Turkey</a></li>
  <li><a href="/guide/exchange-rate-currency-conversion-turkey-guide-uk">Exchange Rates & Currency Conversion in Turkey</a></li>
</ul>

<!-- IMAGE_PAYING_CASH_MARKET_PLACEHOLDER -->

<h2>Keep souvenirs “travel-safe”: the modern souvenir principle</h2>
<p>Turkey has strong protections for cultural heritage. The easiest way to keep shopping simple is to stick to <strong>modern souvenirs</strong> and avoid anything presented as an antiquity or historical artefact. UK travel advice warns that buying or exporting antiquities is illegal and can carry serious penalties, so it’s not a holiday category worth gambling on.</p>

<p><strong>Simple rule:</strong> Modern crafts and everyday souvenirs = easy. “Old/antique” items = unnecessary complexity.</p>

<h3>Receipts: the tiny habit that helps</h3>
<ul>
  <li>Keep receipts for bigger purchases</li>
  <li>If you buy something valuable, ask for a proper receipt and keep it with your travel documents</li>
</ul>

<p><strong>UK-friendly tip:</strong> Take a quick photo of the receipt as a backup. It’s a 10-second habit.</p>

<h2>Shopping in markets vs shops: how to choose</h2>
<ul>
  <li><strong>Markets/bazaars:</strong> great for atmosphere, variety, and browsing</li>
  <li><strong>Shops/boutiques:</strong> great for calmer buying and clearer presentation</li>
</ul>

<p><strong>Simple rule:</strong> Browse in markets, buy where you feel most confident and comfortable.</p>

<h2>What to pack (so shopping doesn’t break your suitcase)</h2>
<ul>
  <li>A foldable tote bag for daytime shopping</li>
  <li>One “fragile zone” in your suitcase (clothes as padding)</li>
  <li>A zip pouch for receipts (or keep them with your passport documents)</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re planning ceramics or glass items, buy them closer to the end of the trip so you’re not carrying fragile items for days.</p>

<!-- IMAGE_PACKING_SOUVENIRS_PLACEHOLDER -->

<h2>Copy-paste shopping checklist (save this)</h2>
<ul>
  <li>Today’s shopping goal: [gifts / home item / personal treat]</li>
  <li>Today’s shopping limit: [set your comfort level]</li>
  <li>Hero buy: [one thing I really want]</li>
  <li>Payment plan: card for bigger buys, small cash for quick buys</li>
  <li>Currency habit: pay in local currency if asked</li>
  <li>Keep receipts for bigger purchases (photo backup)</li>
  <li>Stick to modern souvenirs (keep it easy)</li>
</ul>

<h2>FAQ: shopping & souvenirs in Turkey (UK travellers)</h2>

<h3>What are the best souvenirs to buy in Turkey?</h3>
<p>Modern, practical items travel best: textiles, small ceramics, packaged treats, spices, and modern crafts. Aim for things you’ll genuinely use or gift.</p>

<h3>Should I pay cash or card in Turkish markets?</h3>
<p>Both can work. A simple approach is card-first for bigger buys and a small cash stash for quick purchases and convenience.</p>

<h3>How do I avoid overspending while shopping?</h3>
<p>Decide your shopping “role” (gifts/home/treat), set a limit, and choose 1–2 hero buys. Keep everything else small and intentional.</p>

<h3>Can I buy “antique” items as souvenirs?</h3>
<p>To keep your trip smooth, stick to modern souvenirs. UK travel advice warns that buying or exporting antiquities is illegal and can bring serious penalties, so it’s not worth the risk.</p>

<h3>Do I need to keep receipts?</h3>
<p>It’s a smart habit for bigger purchases. A receipt (and a photo backup) helps keep everything tidy and simple while travelling.</p>

<h3>What’s the easiest “currency choice” rule when paying by card?</h3>
<p>If you’re offered a choice of currencies on a terminal, paying in local currency (TRY) often keeps the conversion clearer via your bank/card terms.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Shopping Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_MODERN_SOUVENIRS_PLACEHOLDER -->',
            filename: `modern-souvenirs-textiles-ceramics-authentic-${timestamp}.jpg`,
            prompt: "A beautiful display of modern Turkish souvenirs: colourful towels (pestemal) and small ceramic bowls. Stylish, neat arrangement in a boutique. Authentic, high quality. Not cluttered."
        },
        {
            placeholder: '<!-- IMAGE_SPICES_EDIBLE_GIFTS_PLACEHOLDER -->',
            filename: `spices-edible-gifts-market-close-up-authentic-${timestamp}.jpg`,
            prompt: "A close-up of colourful boxes of Turkish Delight and small bags of spices at a market stall. Tempting, vibrant colours. Authentic edible gifts. clean focus."
        },
        {
            placeholder: '<!-- IMAGE_MARKET_BROWSING_PLACEHOLDER -->',
            filename: `tourist-browsing-bazaar-atmosphere-authentic-${timestamp}.jpg`,
            prompt: "A UK tourist happily browsing a Turkish bazaar/market. Walking past stalls with hanging lamps or crafts. Warm, atmospheric lighting. Authentic travel vibe. No posing."
        },
        {
            placeholder: '<!-- IMAGE_PAYING_CASH_MARKET_PLACEHOLDER -->',
            filename: `paying-cash-market-hands-authentic-${timestamp}.jpg`,
            prompt: "A close-up of a hand handing over Turkish Lira cash to a merchant at a market for a small item. Focus on the exchange. Authentic, friendly interaction. Shallow depth of field."
        },
        {
            placeholder: '<!-- IMAGE_PACKING_SOUVENIRS_PLACEHOLDER -->',
            filename: `packing-souvenirs-suitcase-careful-authentic-${timestamp}.jpg`,
            prompt: "A neatly packed suitcase on a hotel bed, with a few wrapped souvenirs (ceramics/textiles) being carefully placed inside. 'Travel safe' concept. Organised and calm."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('MODERN')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the browsing one?
            if (item.filename.includes('browsing')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Alışveriş ve Hediyelik Rehberi (TR Pasif)" },
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
