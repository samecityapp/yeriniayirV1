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
    slug: 'tipping-in-turkey-situations-guide-uk',
    title: 'Tipping in Turkey: Exact Situations UK Travellers Tip (A Simple, Modern Guide)',
    meta_description: 'Tipping in Turkey doesn’t need to be awkward. This UK-friendly guide shows the exact situations where Brits commonly tip (restaurants, drivers, housekeeping, spa, tours), when you can skip it, and how to keep it simple with a “tip routine”. Includes copy-paste lines, checklists, and FAQs.',
    primary_keyword: 'tipping in Turkey situations',
    content: `<p><strong>Quick answer:</strong> UK travellers usually tip in Turkey when service feels personal, helpful, or repeated (restaurants, drivers, luggage help, housekeeping, spa, tours). You don’t need to tip constantly. The easiest system is: keep small cash ready, tip for genuinely good help, and use end-of-stay tipping for staff who supported you all week.</p>

<h2>The mindset that makes tipping easy (and never awkward)</h2>
<p>Tipping in Turkey is best treated as a warm “thank you”, not a strict rulebook.</p>
<ul>
  <li><strong>Tip for real service</strong> (helpful, kind, consistent)</li>
  <li><strong>Skip it when it’s purely transactional</strong> or you didn’t receive help</li>
  <li><strong>Keep it simple and consistent</strong> with your budget</li>
</ul>

<p><strong>Simple rule:</strong> Tip when you feel looked after — not because you feel pressured.</p>

<!-- IMAGE_SIMPLE_CASH_HANDOVER_PLACEHOLDER -->

<h2>Your “tip routine” (do this and you’re sorted)</h2>
<ul>
  <li>Carry a small amount of cash separately for tips</li>
  <li>Use small notes/coins so you’re not stuck needing change</li>
  <li>Decide your style: <strong>Occasional</strong> (only standout moments) or <strong>Light & regular</strong> (small tips for consistent help)</li>
</ul>

<p><strong>UK-friendly tip:</strong> A tidy tip routine feels respectful and relaxed — and stops you overthinking every interaction.</p>

<h2>Exact situations UK travellers commonly tip in Turkey</h2>

<h3>1) Restaurants and cafés</h3>
<p>Many UK travellers tip when service is warm and attentive.</p>
<ul>
  <li>If service feels great: leaving a small tip is common</li>
  <li>If service is basic/quick: you can skip or keep it minimal</li>
  <li>If you’re unsure: ask calmly whether service is included</li>
</ul>

<p><strong>Simple rule:</strong> If you’d tip for this level of care in the UK, tipping lightly here is a nice gesture.</p>

<!-- IMAGE_RESTAURANT_TIPPING_PLACEHOLDER -->

<h3>2) Airport transfers and drivers</h3>
<p>Drivers who make arrival day easy often receive a tip from travellers.</p>
<ul>
  <li>Private transfer: tip if it’s smooth, on time, and luggage help is provided</li>
  <li>Shared transfer: tip if the driver/assistant is particularly helpful</li>
</ul>

<p>Make arrival day easy: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey</a></p>

<!-- IMAGE_DRIVER_HELPING_LUGGAGE_PLACEHOLDER -->

<h3>3) Taxi rides</h3>
<p>Tipping for taxis is usually optional and based on experience.</p>
<ul>
  <li>Tip if the ride is smooth, helpful, and you feel well looked after</li>
  <li>Skip if it’s a basic short ride and nothing extra happened</li>
</ul>

<p>Taxi basics: <a href="/guide/taxis-in-turkey-uk-travellers">Taxis in Turkey for UK Travellers</a></p>

<h3>4) All-inclusive resorts (the most common tipping pattern)</h3>
<p>All-inclusive trips can feel confusing because “everything is included”. The calm reality: many guests tip occasionally, not constantly.</p>
<ul>
  <li><strong>Tip occasionally</strong> for staff you see daily who consistently help</li>
  <li><strong>Tip for standout moments</strong> (special help, quick solutions, thoughtful care)</li>
  <li><strong>End-of-stay tipping</strong> can feel more natural than tipping every day</li>
</ul>

<p><strong>Simple rule:</strong> In all-inclusive, tip for people — not for the concept of “all-inclusive”.</p>

<p>All-inclusive clarity: <a href="/guide/all-inclusive-whats-included-turkey-guide">All-Inclusive in Turkey: What’s Included</a></p>

<h3>5) Housekeeping and luggage help</h3>
<p>Many travellers tip when they receive extra help or consistently good care.</p>
<ul>
  <li>Housekeeping: tip if you’ve had great care or special requests handled quickly</li>
  <li>Luggage help: tip if someone carries bags, finds your room, and makes check-in smoother</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you ask for extras (more towels, quick fixes, special setup), tipping is a warm “thank you”.</p>

<!-- IMAGE_HOUSEKEEPING_TOWEL_ART_PLACEHOLDER -->

<h3>6) Spa treatments and personal services</h3>
<p>If you book a massage, spa session, or a personal service, many travellers tip when the service feels excellent.</p>
<ul>
  <li>Tip if you felt genuinely well cared for</li>
  <li>Skip or keep it light if it’s a basic service without much interaction</li>
</ul>

<!-- IMAGE_SPA_RELAXATION_PLACEHOLDER -->

<h3>7) Tours, guides and day trips</h3>
<p>For guided experiences, tips are often based on how good the experience is.</p>
<ul>
  <li>Tip if the guide was informative, organised, and looked after the group</li>
  <li>Tip drivers/helpers if they were particularly supportive</li>
</ul>

<p><strong>Simple rule:</strong> If someone made your day noticeably better, a small tip is a great way to say thanks.</p>

<h2>When you can skip tipping (and feel totally fine)</h2>
<ul>
  <li>Self-service or purely transactional moments</li>
  <li>When you didn’t receive any help beyond the basics</li>
  <li>When your budget is tight — politeness matters more than money</li>
</ul>

<p><strong>UK-friendly tip:</strong> A genuine “thank you” with calm manners is never the wrong move.</p>

<h2>How to tip without awkwardness (3 simple ways)</h2>
<ul>
  <li><strong>Direct and simple:</strong> hand over the tip with “Thank you”</li>
  <li><strong>End-of-stay:</strong> tip once at the end for consistent care</li>
  <li><strong>Moment-based:</strong> tip when someone goes above and beyond</li>
</ul>

<p><strong>Simple rule:</strong> Choose one tipping style for your trip and stick to it.</p>

<h2>Copy-paste lines (use these anywhere)</h2>
<ul>
  <li><strong>“Thank you — we really appreciate your help.”</strong></li>
  <li><strong>“Is service included?”</strong></li>
  <li><strong>“Thank you for looking after us today.”</strong></li>
  <li><strong>“You’ve made this really easy for us — thank you.”</strong></li>
</ul>

<h2>Quick checklist: your tipping plan in one screen</h2>
<ul>
  <li>Small cash ready for tips ✅</li>
  <li>Tip style chosen: occasional / light & regular ✅</li>
  <li>Restaurants: tip when service feels warm ✅</li>
  <li>Drivers/transfers: tip for smooth, helpful service ✅</li>
  <li>Resorts: tip occasionally or end-of-stay ✅</li>
  <li>Skip tipping when it’s purely transactional ✅</li>
</ul>

<h2>FAQ: tipping in Turkey (UK travellers)</h2>

<h3>Do I have to tip in Turkey?</h3>
<p>No. Tipping is usually a choice and is best treated as appreciation for good service.</p>

<h3>Is tipping different in all-inclusive resorts?</h3>
<p>Yes — many guests tip occasionally for standout or consistent service, or tip at the end of the stay. You don’t need to tip every interaction.</p>

<h3>Should I tip in cash?</h3>
<p>Cash is often the simplest because it’s immediate and clear. Keeping small notes/coins makes it effortless.</p>

<h3>What’s the least awkward way to tip?</h3>
<p>Pick one approach (occasional, moment-based, or end-of-stay) and stick to it. Consistency removes awkwardness.</p>

<h3>What if I’m not sure whether to tip?</h3>
<p>Ask “Is service included?” or tip lightly if you feel genuinely helped. If it was purely basic service, you can skip.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Tipping Situations Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_SIMPLE_CASH_HANDOVER_PLACEHOLDER -->',
            filename: `simple-cash-tip-handover-authentic-${timestamp}.jpg`,
            prompt: "A close-up of a hand politely offering a small cash tip (Turkish Lira) to a waiter or staff member. Warm, respectful gesture. Authentic travel interaction. Focus on the hands. Blurred background."
        },
        {
            placeholder: '<!-- IMAGE_RESTAURANT_TIPPING_PLACEHOLDER -->',
            filename: `restaurant-bill-tip-tray-authentic-${timestamp}.jpg`,
            prompt: "A Turkish restaurant table with a bill folder and a small cash tip left on top. Tea glasses nearby. Warm, inviting atmosphere. Authentic dining etiquette. Realistic lighting."
        },
        {
            placeholder: '<!-- IMAGE_DRIVER_HELPING_LUGGAGE_PLACEHOLDER -->',
            filename: `driver-helping-family-luggage-authentic-${timestamp}.jpg`,
            prompt: "A friendly driver helping a family load suitcases into a transfer van in sunny Turkey. Helpful service moment. Authentic travel logistics. Positive vibe."
        },
        {
            placeholder: '<!-- IMAGE_HOUSEKEEPING_TOWEL_ART_PLACEHOLDER -->',
            filename: `housekeeping-towel-art-bed-authentic-${timestamp}.jpg`,
            prompt: "A tidy hotel bed with a simple, cute towel art (swan or flower) and a small 'thank you' note. Clean, bright room. Authentic resort detail. Welcoming touch."
        },
        {
            placeholder: '<!-- IMAGE_SPA_RELAXATION_PLACEHOLDER -->',
            filename: `spa-relaxation-area-calm-authentic-${timestamp}.jpg`,
            prompt: "A serene relaxation area in a Turkish spa or hammam. Soft lighting, towels, calm atmosphere. Authentic wellness setting. No people faces, focused on the environment."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('HANDOVER')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the restaurant one?
            if (item.filename.includes('handover')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Bahşiş Durumları Rehberi (TR Pasif)" },
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
