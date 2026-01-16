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
    slug: 'exchange-rate-currency-conversion-turkey-guide-uk',
    title: 'Exchange Rates & Currency Conversion in Turkey: A UK Guide to Paying in Lira (Avoid Surprises)',
    meta_description: 'Turkey uses the Turkish lira (TRY), and exchange rates can move over time — so the smartest UK traveller approach is simple: pay in lira when given a choice, avoid “pay in pounds” prompts (dynamic currency conversion can add a markup), and use official rate sources for quick reality checks.',
    primary_keyword: 'currency conversion in Turkey for UK travellers',
    content: `<p><strong>Quick answer:</strong> When you pay by card in Turkey, you may be offered a choice: pay in Turkish lira (TRY) or pay in pounds (GBP). For clearer, usually cleaner pricing, choose <strong>lira</strong>. Paying in pounds can add an extra conversion markup at the till or ATM. Keep it simple: pay in lira, check a live rate occasionally, and your holiday spending stays calm and predictable.</p>

<h2>First: the one thing to understand about “conversion”</h2>
<p>Currency conversion happens in one of two places:</p>
<ul>
  <li><strong>Option A (preferred for clarity):</strong> You pay in <strong>TRY</strong>, and your card network/bank converts it to GBP on your statement.</li>
  <li><strong>Option B (often higher/less clear):</strong> The shop/ATM converts it for you at the point of sale and charges you in <strong>GBP</strong>.</li>
</ul>

<p><strong>Simple rule:</strong> If you want the clearest comparison, pay in the local currency (TRY).</p>

<h2>Turkey money basics (keep it practical)</h2>
<ul>
  <li>Turkey’s currency is the <strong>Turkish lira</strong> (TRY).</li>
  <li>Rates can change over time, so it’s normal for “what it costs in pounds” to feel different from one trip to another.</li>
  <li>Your actual rate depends on <strong>where</strong> the conversion happens and <strong>what fees</strong> your card/bank applies.</li>
</ul>

<p><strong>UK-friendly tip:</strong> You don’t need to track the rate daily. You just need a simple rule for paying (TRY) and a quick way to sanity-check occasionally.</p>

<h2>The most important moment: when the terminal asks “GBP or TRY?”</h2>
<p>In Turkey, some card machines will offer you a choice:</p>
<ul>
  <li><strong>Pay in TRY (lira)</strong></li>
  <li><strong>Pay in GBP (pounds)</strong></li>
</ul>

<p>Paying in GBP is often called <strong>Dynamic Currency Conversion</strong> (DCC). It can feel convenient, but convenience is not the same as value.</p>

<p><strong>Simple rule:</strong> If you see GBP on a Turkish card terminal, pause — and choose TRY.</p>

<!-- IMAGE_CARD_TERMINAL_CHOICE_PLACEHOLDER -->

<h3>Exactly what to say (so it’s never awkward)</h3>
<ul>
  <li><strong>“Please charge me in Turkish lira.”</strong></li>
  <li><strong>“Local currency, please.”</strong></li>
  <li><strong>“No conversion — lira is fine.”</strong></li>
</ul>

<p><strong>UK-friendly tip:</strong> Say it before the card is tapped/inserted. It keeps the moment smooth.</p>

<h2>ATMs: the same “currency choice” issue can appear</h2>
<p>Some ATMs may offer to convert your withdrawal into GBP or show a “guaranteed rate”. The calm approach:</p>
<ul>
  <li>Withdraw in <strong>TRY</strong> and let your bank/card do the conversion.</li>
  <li>If an option feels unclear or “salesy”, choose the simpler path (TRY).</li>
</ul>

<p><strong>Simple rule:</strong> Avoid “helpful conversion” prompts. Choose lira and keep going.</p>

<p>For the full “smooth money setup”, pair with: <a href="/guide/using-cards-cash-atms-turkey-money-guide">Using Cards, Cash & ATMs in Turkey</a>.</p>

<!-- IMAGE_ATM_SCREEN_CAUTION_PLACEHOLDER -->

<h2>How to check the exchange rate (without obsessing)</h2>
<p>You only need a quick reference rate to understand what you’re spending. Use one of these approaches:</p>

<ul>
  <li><strong>Check an official reference occasionally</strong> (for a reality check, not day-trading).</li>
  <li><strong>Use your banking app</strong> (many show the GBP equivalent after the transaction posts).</li>
  <li><strong>Do a simple “mental estimate”</strong> and accept small variation.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you check a rate, check it once in the morning and stop there. Your holiday deserves your attention more than the market does.</p>

<!-- IMAGE_HANDHELD_LIRA_PLACEHOLDER -->

<h2>Why your statement won’t exactly match the “headline rate”</h2>
<p>Even when you do everything “right” (paying in TRY), your final GBP amount can differ slightly from what you expected because:</p>
<ul>
  <li>your bank may apply a foreign transaction fee (depends on your card)</li>
  <li>the conversion rate can be based on the processing time (not the exact second you paid)</li>
  <li>some transactions post a day or two later</li>
</ul>

<p><strong>Simple rule:</strong> Use the rate as a guide, not a promise.</p>

<h2>A super simple Turkey spending method that always works</h2>
<p>This is the method most UK travellers end up loving because it’s calm and repeatable:</p>
<ul>
  <li><strong>Card-first</strong> for most spending</li>
  <li><strong>Small cash stash</strong> for tips, tiny purchases, and convenience</li>
  <li><strong>One backup card</strong> stored separately</li>
  <li><strong>Pay in TRY</strong> whenever asked</li>
</ul>

<p><strong>UK-friendly tip:</strong> Decide your “cash top-up rhythm” (e.g., one ATM visit every few days) so you’re not thinking about money daily.</p>

<!-- IMAGE_BANKING_APP_CHECK_PLACEHOLDER -->

<h2>Budgeting with exchange-rate movement (without fear, without fuss)</h2>
<p>Rates can move — that’s normal. The best way to keep your Turkey budget stable is to plan with a buffer.</p>

<ul>
  <li><strong>City breaks:</strong> buffer for extra taxis, extra coffees, extra tickets</li>
  <li><strong>Resort holidays:</strong> buffer for day trips, spa/activities, and off-site meals</li>
  <li><strong>Families:</strong> buffer for convenience spending (snacks, essentials)</li>
</ul>

<p><strong>Simple rule:</strong> A buffer protects your mood, not just your maths.</p>

<p>Use the full framework: <a href="/guide/money-budgeting-turkey-daily-cost-framework-uk">Money in Turkey: A Realistic Daily Budget Framework</a>.</p>

<h2>Tourist areas vs local areas: how currency choices show up</h2>
<p>In busy visitor areas, card terminals offering “pay in GBP” can appear more often because lots of tourists pass through. That’s not a problem — it’s just a moment to use your rule.</p>

<ul>
  <li>Stay relaxed</li>
  <li>Choose TRY</li>
  <li>Enjoy your day</li>
</ul>

<p><strong>UK-friendly tip:</strong> A confident “lira, please” is the whole skill.</p>

<h2>Copy-paste: the “I want lira” message</h2>
<p>Save this in Notes and you’ll never hesitate:</p>
<ul>
  <li><strong>“Hi — please charge in Turkish lira (TRY), not pounds.”</strong></li>
  <li><strong>“Local currency only, thank you.”</strong></li>
  <li><strong>“No conversion at the terminal, please.”</strong></li>
</ul>

<h2>Quick checklist: avoid surprises in 20 seconds</h2>
<ul>
  <li>When asked “GBP or TRY?” → choose <strong>TRY</strong></li>
  <li>ATM offers conversion/guaranteed rate → choose <strong>TRY</strong> option</li>
  <li>Use card for most spending</li>
  <li>Keep small cash for convenience</li>
  <li>Check a reference rate occasionally (not constantly)</li>
</ul>

<p>Pair with your trip prep: <a href="/guide/what-to-pack-for-turkey-holiday-list">Turkey Travel Checklist for UK Tourists</a>.</p>

<!-- IMAGE_RELAXED_TOURIST_BUFFER_PLACEHOLDER -->

<h2>FAQ: exchange rates & currency conversion in Turkey (UK travellers)</h2>

<h3>Should I pay in lira or pounds in Turkey?</h3>
<p>If you’re given the choice, paying in <strong>Turkish lira (TRY)</strong> is the clearest approach. Paying in pounds at the terminal can include extra conversion markup.</p>

<h3>What is Dynamic Currency Conversion (DCC)?</h3>
<p>DCC is when a merchant or ATM converts your purchase into your home currency (GBP) at the point of sale. It can look convenient, but it’s not always the best value.</p>

<h3>Will my bank’s exchange rate match what I see online?</h3>
<p>Not exactly. Rates can vary by processing time and your bank’s fees. Use online rates as a guide, not a guarantee.</p>

<h3>Do I need to exchange a lot of cash before I travel?</h3>
<p>Most UK travellers don’t need to. A card-first approach plus a small cash stash for convenience is usually the easiest setup.</p>

<h3>How often should I check the exchange rate?</h3>
<p>Only occasionally — enough to stay grounded. If you check, check once in the morning and move on.</p>

<h3>What’s the simplest way to keep my Turkey budget stable?</h3>
<p>Use a daily budget “mode” (simple/balanced/treat) and add a buffer so you can enjoy spontaneous moments without stress.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Exchange Rate Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_CARD_TERMINAL_CHOICE_PLACEHOLDER -->',
            filename: `card-terminal-currency-choice-authentic-${timestamp}.jpg`,
            prompt: "Close up of a modern card payment terminal in Turkey showing a choice between 'TRY' and 'GBP' (or home currency). Finger hovering to select TRY. Background of a shop or cafe counter. Authentic payment moment."
        },
        {
            placeholder: '<!-- IMAGE_ATM_SCREEN_CAUTION_PLACEHOLDER -->',
            filename: `tourist-using-atm-screen-check-authentic-${timestamp}.jpg`,
            prompt: "Over-the-shoulder view of a tourist at an ATM in Turkey, looking at the screen carefully. Screen shows transaction options. Calm, focused. Authentic travel finance moment. City background."
        },
        {
            placeholder: '<!-- IMAGE_HANDHELD_LIRA_PLACEHOLDER -->',
            filename: `turkish-lira-banknotes-in-hand-authentic-${timestamp}.jpg`,
            prompt: "A hand holding a fanned out selection of Turkish Lira banknotes (200, 100, 50). Blurred background of a Turkish street or market. Focus on the currency details. Authentic travel vibe."
        },
        {
            placeholder: '<!-- IMAGE_BANKING_APP_CHECK_PLACEHOLDER -->',
            filename: `tourist-checking-phone-banking-app-authentic-${timestamp}.jpg`,
            prompt: "A relaxed traveller checking their smartphone (banking app) at a cafe table in Turkey. Coffee nearby. Looking reassured/calm. Authentic digital nomad/travel style."
        },
        {
            placeholder: '<!-- IMAGE_RELAXED_TOURIST_BUFFER_PLACEHOLDER -->',
            filename: `tourist-relaxing-sunset-no-stress-authentic-${timestamp}.jpg`,
            prompt: "A peaceful shot of a UK tourist enjoying a sunset view in Turkey (coast or city). Relaxed posture, enjoying the moment. Symbolising financial peace of mind. Warm golden hour light."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('TERMINAL')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the Lira handheld? Let's use the terminal choice as it's the core concept.
            if (item.filename.includes('terminal')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Döviz Kurları ve Dönüştürme Rehberi (TR Pasif)" },
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
