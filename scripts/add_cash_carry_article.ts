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
    slug: 'how-much-cash-to-carry-turkey-travel-guide',
    title: 'How Much Cash to Carry in Turkey: UK Traveller Rules of Thumb (Simple, Safe, Stress-Free)',
    meta_description: 'Not sure how much cash to carry in Turkey as a UK traveller? Use this calm, practical approach: go card-first, keep a small daily cash amount for convenience and tips, top up when needed, and avoid “pay in pounds” prompts at terminals/ATMs. Includes checklists, copy-paste lines, and FAQs.',
    primary_keyword: 'how much cash to carry in Turkey',
    content: `<p><strong>Quick answer:</strong> The easiest cash plan in Turkey is “card-first + small cash buffer”. Use your card for most everyday spending, carry a small amount of cash for tips and quick purchases, and top up calmly when you need to — rather than carrying a lot on you. Your goal is convenience, not a bulky wallet.</p>

<h2>The UK-friendly cash mindset for Turkey</h2>
<p>Turkey is a modern, well-travelled destination. You don’t need a complicated money strategy — you need a routine that’s easy to repeat.</p>

<ul>
  <li><strong>Card-first</strong> for most spending</li>
  <li><strong>Cash for convenience</strong> (small purchases, tips if you choose, quick moments)</li>
  <li><strong>Top up</strong> only when needed</li>
</ul>

<p><strong>Simple rule:</strong> Carry what you’d be comfortable losing without ruining your day — and keep the rest secure.</p>

<!-- IMAGE_CARD_FIRST_WALLET_PLACEHOLDER -->

<h2>Start here: pick your “cash comfort level”</h2>
<p>Instead of chasing a magic number, choose a style that matches your trip.</p>

<h3>1) City break cash style (lots of moving around)</h3>
<ul>
  <li>Carry small cash for quick stops (snacks, small purchases, tips)</li>
  <li>Use card for most meals and larger spending</li>
  <li>Top up when it’s convenient (not when you’re rushed)</li>
</ul>

<p>Pair with: <a href="/guide/public-transport-turkey-tourist-guide">Public Transport in Turkey for UK Tourists</a></p>

<h3>2) Resort holiday cash style (predictable days)</h3>
<ul>
  <li>Cash is mainly for tips (if you choose) and off-site days</li>
  <li>Card covers bigger extras (spa/activities/shopping)</li>
  <li>Top up on your schedule (not daily)</li>
</ul>

<p>Pair with: <a href="/guide/tipping-in-turkey-uk-travellers-guide">Tipping in Turkey for UK Travellers</a></p>

<h3>3) Family cash style (convenience-first)</h3>
<ul>
  <li>Carry a little extra “convenience cash” for snacks and quick fixes</li>
  <li>Keep your main funds card-first</li>
  <li>Split money between adults (so one lost wallet doesn’t disrupt the day)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Families do best with a “boring” system: one adult holds the main card, the other holds the backup card.</p>

<!-- IMAGE_FAMILY_SPLIT_MONEY_PLACEHOLDER -->

<h2>What you’ll actually use cash for in Turkey</h2>
<p>Cash works best for small, fast moments. For most UK travellers, that’s:</p>

<ul>
  <li>Small purchases where you want speed</li>
  <li>Tips (if you choose to tip)</li>
  <li>Quick taxis or short rides in some situations</li>
  <li>Little add-ons: water, snacks, convenience items</li>
</ul>

<p><strong>Simple rule:</strong> If it’s a “small and fast” moment, cash is useful. If it’s a “bigger and planned” spend, card is usually easier.</p>

<!-- IMAGE_SMALL_CASH_STASH_PLACEHOLDER -->

<h2>How to top up cash without stress (the calm rhythm)</h2>
<p>The biggest money mistake on holiday is turning “cash” into a daily task. Instead, use a simple rhythm.</p>

<ul>
  <li>Do your first top-up when you’re calm (not straight off the plane)</li>
  <li>Withdraw fewer times rather than lots of small withdrawals</li>
  <li>Keep notes/coins handy so you’re not constantly searching for change</li>
</ul>

<p>For the full setup, use: <a href="/guide/using-cards-cash-atms-turkey-money-guide">Using Cards, Cash & ATMs in Turkey</a></p>

<!-- IMAGE_CALM_ATM_TOPUP_PLACEHOLDER -->

<h2>The “pay in local currency” habit (avoids surprises)</h2>
<p>Sometimes a card terminal or ATM may offer to charge you in your home currency. For clarity, many travellers prefer to pay in the <strong>local currency</strong> so conversion happens via their card/bank terms.</p>

<p><strong>Simple rule:</strong> When given a currency choice, choose the local currency.</p>

<h3>Copy-paste lines (use them anywhere)</h3>
<ul>
  <li><strong>“Local currency, please.”</strong></li>
  <li><strong>“Please charge in lira.”</strong></li>
  <li><strong>“No conversion, thank you.”</strong></li>
</ul>

<h2>Where to keep your money (simple, low-effort organisation)</h2>
<p>The best system is the one you’ll actually follow:</p>

<ul>
  <li><strong>Daily cash:</strong> in an easy-to-reach pocket/wallet section</li>
  <li><strong>Main card:</strong> with you, but not mixed with all cash</li>
  <li><strong>Backup card:</strong> stored separately (different bag/pocket)</li>
  <li><strong>Extra cash:</strong> kept securely, not carried day-to-day</li>
</ul>

<p><strong>UK-friendly tip:</strong> Don’t keep everything in one place. One simple split prevents 99% of money stress.</p>

<h2>Arrival day: the smartest cash move</h2>
<p>Your arrival day goal is comfort. Keep it easy:</p>
<ul>
  <li>Make sure you can pay immediately (card + a small cash buffer)</li>
  <li>Don’t do multiple money tasks on day one</li>
  <li>If you need cash, do one calm top-up when you’re settled</li>
</ul>

<p>Pair with: <a href="/guide/turkey-tourist-basics-brits-documents-check-in-guide">Turkey Tourist Basics for Brits: Documents & Arrival Day</a></p>

<!-- IMAGE_ARRIVAL_DAY_COMFORT_PLACEHOLDER -->

<h2>Big cash amounts: keep it compliant and calm</h2>
<p>Most holidays don’t involve carrying large amounts of cash. If you ever do, check declaration rules for both ends of your journey (UK and Turkey) and keep documentation tidy.</p>

<p><strong>Simple rule:</strong> If it’s a “large cash” situation, do the 2-minute admin check — it keeps everything smooth.</p>

<h2>Copy-paste: your “Turkey cash plan” template</h2>
<ul>
  <li>Trip type: [City / Resort / Mixed]</li>
  <li>Daily cash purpose: [Tips / small purchases / convenience]</li>
  <li>Cash rhythm: “Top up when calm, not daily”</li>
  <li>Main card: [WITH ME]</li>
  <li>Backup card: [STORED SEPARATELY]</li>
  <li>Currency choice habit: “Local currency every time”</li>
</ul>

<h2>FAQ: cash in Turkey for UK travellers</h2>

<h3>How much cash should I carry day-to-day in Turkey?</h3>
<p>Carry a small, sensible amount for convenience and tips (if you tip), and use your card for most spending. Top up when needed rather than carrying a lot.</p>

<h3>Should I rely on cash or card in Turkey?</h3>
<p>For most travellers, card-first is easiest, with cash as a convenience backup. This keeps your spending smooth without overthinking.</p>

<h3>What’s the simplest way to avoid conversion surprises?</h3>
<p>When asked to choose a currency at a terminal or ATM, choose the local currency. It keeps comparisons clearer.</p>

<h3>How do I make my money feel “safe and easy” without being anxious?</h3>
<p>Use a simple split: daily cash + main card on you, backup card stored separately, and extra cash kept secure. Then stop thinking about it and enjoy Turkey.</p>

<h3>Do I need to bring lots of cash from the UK?</h3>
<p>Most travellers don’t. A card-first approach plus a small cash stash for convenience is usually the easiest setup. If you prefer arriving with a little cash for peace of mind, keep it modest.</p>

<h3>What if I’m carrying a large amount of cash?</h3>
<p>Check declaration rules for the UK side and the Turkey side before travel, and keep any paperwork/receipts tidy. For the UK, there are clear declaration requirements above a set threshold.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Cash to Carry Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_CARD_FIRST_WALLET_PLACEHOLDER -->',
            filename: `travel-wallet-organised-cards-cash-authentic-${timestamp}.jpg`,
            prompt: "A neat travel wallet open on a table, showing a bank card in the front slot and a small amount of cash tucked behind. Organized, safe, stress-free travel vibe. Authentic everyday carry."
        },
        {
            placeholder: '<!-- IMAGE_FAMILY_SPLIT_MONEY_PLACEHOLDER -->',
            filename: `couple-splitting-travel-money-authentic-${timestamp}.jpg`,
            prompt: "A couple calmly sharing/splitting some travel cash at a cafe table. 'You take half, I take half' concept. Safe and organised. Authentic travel partners moment. No stress."
        },
        {
            placeholder: '<!-- IMAGE_SMALL_CASH_STASH_PLACEHOLDER -->',
            filename: `small-cash-purchase-market-authentic-${timestamp}.jpg`,
            prompt: "A tourist buying a small item (like a magnet or snack) with cash at a Turkish market stall. Quick, easy transaction. Authentic market detail. High resolution."
        },
        {
            placeholder: '<!-- IMAGE_CALM_ATM_TOPUP_PLACEHOLDER -->',
            filename: `calm-atm-withdrawal-sunny-day-authentic-${timestamp}.jpg`,
            prompt: "A tourist using a bank ATM in a safe, sunny location in Turkey (not a dark alley). Calmly taking cash. Secure feeling. Authentic city/resort background."
        },
        {
            placeholder: '<!-- IMAGE_ARRIVAL_DAY_COMFORT_PLACEHOLDER -->',
            filename: `arrival-day-coffee-relax-authentic-${timestamp}.jpg`,
            prompt: "A traveller enjoying their first coffee upon arrival in Turkey. Suitcase nearby but settled. Looking relaxed and ready. 'Arrival comfort' vibe. Authentic lighting."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('WALLET')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the wallet one?
            if (item.filename.includes('wallet')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Ne Kadar Nakit Taşımalı? (TR Pasif)" },
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
