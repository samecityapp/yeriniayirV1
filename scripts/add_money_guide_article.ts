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
    slug: 'using-cards-cash-atms-turkey-money-guide',
    title: 'Using Cards, Cash & ATMs in Turkey: A UK-Friendly Money Setup (No Stress)',
    meta_description: 'Turkey is easy to navigate financially once you set up a simple routine: one main card, one backup, and a small amount of cash for day-to-day convenience. This UK-focused guide explains how to use cards and ATMs smoothly, how to avoid unnecessary fees, and what to do on arrival day — plus FAQs.',
    primary_keyword: 'cards cash and ATMs in Turkey',
    content: `<p><strong>Quick answer:</strong> The smoothest way to handle money in Turkey as a UK traveller is simple: use a card for most spending, carry a small amount of cash for convenience, and withdraw cash from ATMs only when you need it (checking fees calmly on-screen). Add a backup card kept separately, and you’ll feel sorted from day one.</p>

<h2>The “perfectly simple” Turkey money setup (do this before you fly)</h2>
<ul>
  <li><strong>Main spending card:</strong> the card you’ll use most days</li>
  <li><strong>Backup card:</strong> stored separately (not in the same wallet)</li>
  <li><strong>Small cash:</strong> for quick purchases, tips, and convenience</li>
  <li><strong>Bank settings:</strong> make sure overseas spending is enabled in your banking app</li>
</ul>

<p><strong>Simple rule:</strong> One main method + one backup method = a relaxed holiday.</p>

<p>Pair this with your arrival-day checklist: <a href="/guide/what-to-pack-for-turkey-holiday-list">Turkey Travel Checklist for UK Tourists</a>.</p>

<!-- IMAGE_MAIN_BACKUP_CARDS_PLACEHOLDER -->

<h2>Card vs cash in Turkey: what most UK travellers find easiest</h2>
<p>In many places you can pay by card, especially in cities and tourist areas. Cash is still useful for day-to-day convenience and small moments.</p>

<ul>
  <li><strong>Use card for:</strong> main spending, restaurants, bigger shops, everyday costs where contactless is accepted</li>
  <li><strong>Use cash for:</strong> small purchases, quick tips, and “no fuss” moments</li>
</ul>

<p><strong>UK-friendly tip:</strong> Think “card-first, cash-as-backup” — it keeps life simple.</p>

<!-- IMAGE_CONTACTLESS_PAYMENT_PLACEHOLDER -->

<h2>ATMs in Turkey: how to withdraw cash smoothly</h2>
<p>ATMs are common and usually straightforward. The main thing is to stay calm and read the on-screen prompts.</p>

<h3>How to avoid unnecessary fees (the calm way)</h3>
<ul>
  <li>Use a debit card that you understand (know your bank’s foreign usage fees)</li>
  <li>Withdraw fewer times rather than lots of small withdrawals (fees can stack up)</li>
  <li>When the ATM shows extra options or “suggested conversions”, read carefully before accepting</li>
</ul>

<p><strong>Simple rule:</strong> If an ATM option makes the cost unclear, decline it and choose the clearer path.</p>

<h3>A quick ATM checklist (copy-paste)</h3>
<ul>
  <li>Use an ATM in a well-lit, normal location (airport, mall, main street)</li>
  <li>Cover the keypad when entering your PIN</li>
  <li>Read prompts carefully before confirming</li>
  <li>Take your card first, cash second, receipt last</li>
</ul>

<p><strong>UK-friendly tip:</strong> Do your first withdrawal when you’re not rushed. “Calm first cash” sets the tone.</p>

<!-- IMAGE_ATM_WITHDRAWAL_PLACEHOLDER -->

<h2>Currency exchange: keep it practical, not complicated</h2>
<p>For most holidays, you don’t need a big strategy. Your goals are simplicity and clarity.</p>

<ul>
  <li>If you’re using ATMs, you may not need to exchange much cash at all</li>
  <li>If you do exchange, focus on clear rates and clear receipts</li>
  <li>Don’t turn holiday money into a hobby — your time is more valuable</li>
</ul>

<p><strong>Simple rule:</strong> Use the method you understand best, then move on and enjoy your trip.</p>

<h2>All-inclusive holidays: the “what do I actually need money for?” list</h2>
<p>Even on all-inclusive, having a simple money setup makes the holiday smoother.</p>

<ul>
  <li>Tips (if you choose to tip)</li>
  <li>Off-site snacks, taxis, or small shopping</li>
  <li>Optional extras (spa, activities, souvenirs)</li>
</ul>

<p>To keep spending intentional, see: <a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts</a>.</p>

<!-- IMAGE_SMALL_CASH_TIPS_PLACEHOLDER -->

<h2>Arrival day: the smartest first money move</h2>
<p>On arrival day, your only aim is convenience.</p>

<ul>
  <li>Make sure you can pay for essentials immediately (card or a small amount of cash)</li>
  <li>Don’t do lots of separate withdrawals on day one</li>
  <li>If you need cash, withdraw once calmly and keep it simple</li>
</ul>

<p><strong>UK-friendly tip:</strong> Arrival day is about comfort, not optimisation.</p>

<p>For smooth transfers (often where people first need money), use: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey</a>.</p>

<h2>How to avoid money stress (the “3 habits” method)</h2>
<ul>
  <li><strong>Separate your money:</strong> main card + backup card in different places</li>
  <li><strong>Stay aware of small fees:</strong> fewer withdrawals, clearer choices on ATMs</li>
  <li><strong>Keep receipts for bigger purchases:</strong> it’s just tidy travel admin</li>
</ul>

<p><strong>Simple rule:</strong> A holiday budget works best when it’s boring and predictable.</p>

<h2>Copy-paste notes template (your “money plan” in one screen)</h2>
<p>Copy this into your notes and fill it in before you travel:</p>

<ul>
  <li>Main spending card: [CARD NAME]</li>
  <li>Backup card location: [WHERE YOU KEEP IT]</li>
  <li>Cash target to carry daily: [SMALL AMOUNT]</li>
  <li>ATM plan: “Withdraw only when needed, fewer times”</li>
  <li>Bank app quick-check: overseas spending enabled ✅</li>
</ul>

<!-- IMAGE_RELAXED_MONEY_PLAN_PLACEHOLDER -->

<h2>FAQ: cards, cash and ATMs in Turkey (UK travellers)</h2>

<h3>Should I bring cash from the UK or withdraw in Turkey?</h3>
<p>Many travellers find it simplest to withdraw cash in Turkey when needed and use card for most spending. If you prefer arriving with a little cash for peace of mind, that’s fine too — keep it small and simple.</p>

<h3>Will my UK card work in Turkey?</h3>
<p>Most UK cards work normally in Turkey, especially in tourist areas and cities. The key step is making sure overseas spending is enabled and you know your bank’s foreign usage rules.</p>

<h3>How do I avoid paying unnecessary ATM fees?</h3>
<p>Withdraw fewer times, read the on-screen prompts carefully, and avoid options that make the total cost unclear. Knowing your own bank’s fees helps too.</p>

<h3>Is contactless common?</h3>
<p>In many places, yes — especially in cities and tourist-heavy areas. Still, having a small cash backup keeps everything smooth.</p>

<h3>How much cash should I carry day-to-day?</h3>
<p>Enough for convenience (small purchases, tips if you choose, quick taxis), but not so much that you’d be annoyed if you lost your wallet. “Small and sensible” is the right level.</p>

<h3>What’s the simplest setup for an all-inclusive holiday?</h3>
<p>Card for flexibility, a small cash stash for tips and little off-site spending, and a backup card stored separately. That’s it.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Money Guide Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_MAIN_BACKUP_CARDS_PLACEHOLDER -->',
            filename: `travel-cards-main-backup-authentic-${timestamp}.jpg`,
            prompt: "Two bank cards (one main, one backup) lying next to a travel wallet on a wooden table. Authentic travel preparation vibe. Soft lighting, high detail, no visible brand names but clearly bank cards."
        },
        {
            placeholder: '<!-- IMAGE_CONTACTLESS_PAYMENT_PLACEHOLDER -->',
            filename: `contactless-payment-turkey-shop-authentic-${timestamp}.jpg`,
            prompt: "Close up of a hand using a contactless card to pay at a modern payment terminal in a Turkish shop. Turkish delight or souvenirs in background. Authentic retail moment. High resolution."
        },
        {
            placeholder: '<!-- IMAGE_ATM_WITHDRAWAL_PLACEHOLDER -->',
            filename: `tourist-using-atm-turkey-authentic-${timestamp}.jpg`,
            prompt: "A UK tourist calmly using a modern bank ATM in a Turkish city street. Sunny day. Paying attention to screen. Authentic urban travel photography. Realistic details."
        },
        {
            placeholder: '<!-- IMAGE_SMALL_CASH_TIPS_PLACEHOLDER -->',
            filename: `small-turkish-cash-in-hand-authentic-${timestamp}.jpg`,
            prompt: "A small amount of Turkish Lira cash (banknotes and coins) held in a hand, ready for small spending. Authentic travel detail. Natural lighting. No blurred text, crisp banknote details."
        },
        {
            placeholder: '<!-- IMAGE_RELAXED_MONEY_PLAN_PLACEHOLDER -->',
            filename: `relaxed-financial-planning-cafe-authentic-${timestamp}.jpg`,
            prompt: "A relaxed tourist enjoying a coffee at a table, wallet sitting securely nearby. Looking organized and stress-free. Authentic holiday vibe. Warm atmosphere."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('MAIN')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the ATM one? Let's use the cards one as it's the main setup concept.
            if (item.filename.includes('main-backup')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Kart ve Nakit Kullanımı (TR Pasif)" },
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
