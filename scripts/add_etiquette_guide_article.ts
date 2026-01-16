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
    slug: 'turkey-travel-etiquette-for-brits-guide',
    title: 'Turkey Travel Etiquette for Brits: Simple Do’s, Don’ts & Local Norms',
    meta_description: 'Turkey is famously welcoming, and most cultural moments are easy to navigate with a few simple habits. This UK-friendly etiquette guide covers greetings, dress in everyday settings, dining manners, tipping basics, and a copy-paste phrase list — plus FAQs (no fear-mongering, no hotel names).',
    primary_keyword: 'Turkey travel etiquette for Brits',
    content: `<p><strong>Quick answer:</strong> Turkey is easy to travel in as a Brit when you lean into three habits: be warmly polite, dress sensibly for the setting, and follow the “mirror rule” (match the tone and formality of the place you’re in). Most day-to-day etiquette is simple — and locals are generally welcoming when you show basic respect.</p>

<h2>The mindset that makes Turkey feel effortless</h2>
<p>British travellers often worry about “doing the wrong thing”. In Turkey, you’ll get far with friendly clarity and calm confidence.</p>

<ul>
  <li><strong>Warm greeting</strong> + a smile goes a long way</li>
  <li><strong>Respect the setting</strong> (resort, restaurant, city street, place of worship)</li>
  <li><strong>Ask once, then relax</strong> — people are used to helping visitors</li>
</ul>

<p><strong>Simple rule:</strong> When in doubt, be slightly more polite and slightly more covered than you think you need — it always lands well.</p>

<h2>Greetings and first impressions (simple, not awkward)</h2>
<ul>
  <li>A friendly “hello” and a smile is perfect</li>
  <li>In more formal moments, a brief, respectful greeting works best</li>
  <li>When someone offers help, a clear “thank you” is appreciated</li>
</ul>

<p><strong>UK-friendly tip:</strong> You don’t need to overthink handshakes or formality — follow the other person’s lead.</p>

<!-- IMAGE_GREETING_PLACEHOLDER -->

<h2>Dress codes: what’s “normal” in everyday Turkey</h2>
<p>Turkey has a mix of modern city life, beach resort culture, and more traditional neighbourhoods. “Right” dress is about matching the setting.</p>

<h3>Resort areas and beach towns</h3>
<ul>
  <li>Beachwear is normal on the beach and around pools</li>
  <li>For restaurants outside the pool area, light smart-casual feels best</li>
</ul>

<h3>Cities and local neighbourhoods</h3>
<ul>
  <li>Daytime: casual is fine, but aim for neat and comfortable</li>
  <li>Evenings: smart-casual works well in most restaurants</li>
</ul>

<h3>Places of worship and respectful spaces</h3>
<ul>
  <li>Dress more modestly than you would at the beach</li>
  <li>Carry a light layer (it solves most “what should I wear?” moments)</li>
</ul>

<p><strong>Simple rule:</strong> Pack one light layer you can throw on — it makes you feel prepared everywhere.</p>

<!-- IMAGE_DRESS_CODE_PLACEHOLDER -->

<h2>Dining etiquette (the easy wins)</h2>
<p>Dining culture is social and welcoming. You don’t need special knowledge — just good manners.</p>

<ul>
  <li>Be patient during busy periods (service can be paced differently than the UK)</li>
  <li>If you’re unsure what something is, asking politely is normal</li>
  <li>If you love something, saying so is appreciated</li>
</ul>

<p><strong>UK-friendly tip:</strong> Turkey is a place where friendly compliments are received warmly — if you enjoyed the meal, say it.</p>

<p>If you’re staying all-inclusive and want to understand dining options clearly, use: <a href="/guide/a-la-carte-all-inclusive-turkey">A La Carte Restaurants in All-Inclusive: How It Works in Turkey</a>.</p>

<h2>Tipping in Turkey (keep it simple)</h2>
<p>Tipping expectations can vary by place and service type. The goal isn’t to stress — it’s to be fair and appreciative when service is good.</p>

<ul>
  <li>In restaurants, many travellers leave a small tip when happy with service</li>
  <li>For drivers or helpers, small tips can be a nice gesture</li>
  <li>In resorts, some guests tip occasionally rather than constantly</li>
</ul>

<p><strong>Simple rule:</strong> Tip when you feel looked after — and keep it consistent with your budget and comfort.</p>

<p>For a practical money setup (so you can tip easily without hassle), see: <a href="/guide/cash-or-card-in-turkey">Money in Turkey: Cards, Cash & Simple Budgeting</a>.</p>

<!-- IMAGE_DINING_PLACEHOLDER -->

<h2>Shopping and markets: friendly and straightforward</h2>
<p>In some markets, conversation is part of the experience. You’re not expected to be an expert — just be polite.</p>

<ul>
  <li>If you’re browsing, a friendly “just looking” vibe is normal</li>
  <li>If you’re not interested, a polite decline is enough</li>
  <li>If you do want to buy, ask the price clearly and calmly</li>
</ul>

<p><strong>UK-friendly tip:</strong> Your tone matters more than the words. Calm + friendly keeps everything pleasant.</p>

<!-- IMAGE_MARKET_PLACEHOLDER -->

<h2>Photos and personal space (respectful, modern approach)</h2>
<ul>
  <li>In busy tourist areas, photos are usually fine</li>
  <li>If you’re photographing people up close, it’s polite to ask</li>
  <li>In respectful or religious spaces, be extra mindful of signs and local behaviour</li>
</ul>

<p><strong>Simple rule:</strong> If you wouldn’t do it in a quiet UK setting, pause and ask first.</p>

<h2>Taxi/transfer etiquette (what helps your trip run smoothly)</h2>
<p>Most travel stress is logistics, not culture. Keeping your transport plan clear is the real “etiquette win”.</p>

<ul>
  <li>Know your pickup point and keep your address/screenshots ready</li>
  <li>Confirm basics calmly before you set off (where you’re going, route expectation)</li>
  <li>Keep a friendly tone — it makes everything smoother</li>
</ul>

<p>For a calm arrival-day plan, use: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey: Reliable Options and What to Avoid</a>.</p>

<h2>Copy-paste phrases (simple and useful)</h2>
<p>Save these in your notes and use them when you need them:</p>

<ul>
  <li><strong>“Hi — could you help me, please?”</strong></li>
  <li><strong>“Thank you — that’s really helpful.”</strong></li>
  <li><strong>“Could you show me where this is on the map?”</strong></li>
  <li><strong>“How much is this?”</strong></li>
  <li><strong>“We’re staying in [AREA]. Could you direct us?”</strong></li>
</ul>

<p><strong>UK-friendly tip:</strong> Keep it short. One clear sentence beats a long explanation.</p>

<!-- IMAGE_TEA_PLACEHOLDER -->

<h2>FAQ: Turkey etiquette questions UK travellers ask</h2>

<h3>Is Turkey strict about what tourists wear?</h3>
<p>Most tourist areas are relaxed. The “right” approach is simply matching the setting: beachwear at the beach, smart-casual for restaurants, and a bit more coverage in respectful spaces.</p>

<h3>Do I need to learn Turkish to be polite?</h3>
<p>No. A friendly tone, patience, and simple “please/thank you” manners go a long way. Keeping a few helpful phrases in your notes is a bonus, not a requirement.</p>

<h3>Is bargaining expected everywhere?</h3>
<p>Not everywhere. In some markets it’s part of the experience; in many fixed-price settings, it isn’t. The easiest approach is to ask the price clearly and decide calmly.</p>

<h3>What’s the most “British” mistake in Turkey?</h3>
<p>Overthinking and apologising so much that you become unclear. In Turkey, polite clarity is appreciated — say what you need simply and kindly.</p>

<h3>How can I be respectful without feeling awkward?</h3>
<p>Use the mirror rule: match the vibe of the place you’re in. If locals are dressed smart-casual, do the same. If it’s a relaxed beach setting, relax too.</p>

<h3>Do I need to tip all the time?</h3>
<p>You don’t need to stress. Many travellers tip when service feels genuinely helpful. Keep it consistent with your budget and comfort.</p>

<h3>What’s the best way to handle arrival day politely and smoothly?</h3>
<p>Have your transfer plan and accommodation address ready (screenshots), confirm the meeting point, and keep communication calm and clear. It makes everything feel easy.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Etiquette Guide Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_GREETING_PLACEHOLDER -->',
            filename: `friendly-handshake-greeting-turkey-authentic-${timestamp}.jpg`,
            prompt: "A friendly and warm greeting between a tourist and a local shopkeeper or host in Turkey. Smiling, handshake or hand on heart gesture. Authentic cultural connection. Warm lighting."
        },
        {
            placeholder: '<!-- IMAGE_DRESS_CODE_PLACEHOLDER -->',
            filename: `smart-casual-dinner-dress-code-authentic-${timestamp}.jpg`,
            prompt: "A couple dressed in smart-casual summer outfits walking to a restaurant in a Turkish resort town. Respectful but holiday-appropriate. Evening light. Authentic travel fashion style."
        },
        {
            placeholder: '<!-- IMAGE_DINING_PLACEHOLDER -->',
            filename: `sharing-dinner-plate-restaurant-turkey-${timestamp}.jpg`,
            prompt: "A table at a Turkish restaurant with shared meze plates. Friends reaching for food. Social dining atmosphere. Authentic food photography style. inviting."
        },
        {
            placeholder: '<!-- IMAGE_MARKET_PLACEHOLDER -->',
            filename: `relaxed-market-shopping-conversation-${timestamp}.jpg`,
            prompt: "A tourist looking at items in a Turkish market stall, chatting smilingly with the seller. No pressure, friendly interaction. Authentic bazaar atmosphere. Colorful background."
        },
        {
            placeholder: '<!-- IMAGE_TEA_PLACEHOLDER -->',
            filename: `turkish-tea-glasses-conversation-${timestamp}.jpg`,
            prompt: "Two traditional tulip-shaped Turkish tea glasses on a small table. Blurred background of people chatting. Symbol of hospitality and conversation. Authentic detail shot."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('COVER')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // Using the tea image as cover metaphorically or just the greeting one? I'll use the greeting one as cover if no specific placeholder
            if (item.filename.includes('greeting')) {
                coverImageUrl = publicUrl;
            }
            // Always insert into content if placeholder exists
            const imgTag = `<img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
            finalContent = finalContent.replace(item.placeholder, imgTag);

            // If we didn't set cover yet, use the first one
            if (!coverImageUrl) coverImageUrl = publicUrl;

        } else {
            console.warn("⚠️ Image generation failed for:", item.filename);
            finalContent = finalContent.replace(item.placeholder, '');
        }
    }

    // Insert into DB
    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye Seyahat Görgü Kuralları ve İpuçları (TR Pasif)" },
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
