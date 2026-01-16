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
    slug: 'tipping-in-turkey-uk-travellers-guide',
    title: 'Tipping in Turkey for UK Travellers: Simple, Stress-Free Rules (Restaurants, Transfers, Resorts)',
    meta_description: 'Not sure how tipping works in Turkey as a UK traveller? This calm guide explains where tipping is common (restaurants, drivers, resort staff), how to keep it simple, and how to tip without overthinking — plus a copy-paste checklist and FAQs.',
    primary_keyword: 'tipping in Turkey for UK travellers',
    content: `<p><strong>Quick answer:</strong> Tipping in Turkey is usually a simple “thank you” for good service — not a rigid rulebook. Many UK travellers tip in restaurants and for helpful service (drivers, luggage help, standout staff), and keep it light and consistent with their budget. The easiest approach is to carry a little cash for tips and use a calm, repeatable routine.</p>

<h2>Why tipping feels confusing (and how to make it easy)</h2>
<p>British travellers often want to “do the right thing” without turning the holiday into maths. The best approach is to focus on fairness and simplicity.</p>

<p><strong>Simple rule:</strong> Tip when you feel looked after — and keep it consistent with your comfort.</p>

<h2>Do you have to tip in Turkey?</h2>
<p>You don’t need to feel pressured. Tipping is often appreciated, but it’s rarely the main event. The point is to show appreciation when service is genuinely helpful.</p>

<p><strong>UK-friendly tip:</strong> The easiest mindset is: “If I’d tip for this in the UK, I’ll tip here too — just with a simpler routine.”</p>

<!-- IMAGE_TIPPING_CASH_PLACEHOLDER -->

<h2>Where tipping is most common (UK traveller map)</h2>

<h3>1) Restaurants and cafés</h3>
<p>Many travellers leave a tip when they’re happy with the service. How you do it depends on how you pay:</p>
<ul>
  <li>If paying by card, you can leave a small cash tip if you want the simplest option.</li>
  <li>If paying cash, you can add a little extra as appreciation.</li>
</ul>

<p><strong>Simple rule:</strong> If the service felt warm and attentive, a small tip is a nice gesture.</p>

<!-- IMAGE_RESTAURANT_BILL_PLACEHOLDER -->

<h3>2) Transfers and drivers</h3>
<p>If someone drives you smoothly, helps with luggage, or makes your arrival day easier, many travellers tip.</p>
<ul>
  <li>Private transfer drivers: tipping is common as a “thanks” for a smooth ride.</li>
  <li>Shared transfers: some travellers tip the driver/assistant if they’ve been particularly helpful.</li>
</ul>

<p>Arrival-day planning guide: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey</a>.</p>

<!-- IMAGE_DRIVER_HELP_PLACEHOLDER -->

<h3>3) All-inclusive resorts (staff you interact with daily)</h3>
<p>In all-inclusive settings, some guests tip occasionally rather than constantly. The simplest approach is to tip:</p>
<ul>
  <li>When someone goes out of their way to help</li>
  <li>When service is consistently excellent (e.g., the same person helps you every day)</li>
  <li>When you want to show appreciation at the end of the stay</li>
</ul>

<p><strong>UK-friendly tip:</strong> Don’t tip out of anxiety. Tip out of appreciation.</p>

<h3>4) Luggage help / housekeeping</h3>
<p>Some travellers tip when they receive extra help or when housekeeping has been particularly attentive.</p>

<!-- IMAGE_HOUSEKEEPING_NOTE_PLACEHOLDER -->

<p><strong>Simple rule:</strong> If you ask for extra support (more towels, special requests) and it’s handled quickly and kindly, a small tip is a warm gesture.</p>

<h2>The easiest tipping setup (so you never overthink it)</h2>
<p>Make tipping effortless with a simple “holiday wallet” routine.</p>

<ul>
  <li>Carry a small amount of cash separately for tips</li>
  <li>Use small notes/coins so you’re not stuck needing change</li>
  <li>Decide your “default tip” style before you go (light, moderate, occasional)</li>
</ul>

<p><strong>Simple rule:</strong> If you have small cash ready, tipping becomes a choice — not a stressful decision.</p>

<h2>All-inclusive: what changes (and what doesn’t)</h2>
<p>All-inclusive can make tipping feel awkward because you’ve already paid for “everything”. The calm reality:</p>

<ul>
  <li>You’re not tipping because you “must” — you’re tipping to appreciate great service</li>
  <li>You don’t need to tip every interaction</li>
  <li>Small, occasional tips can feel more natural than constant tipping</li>
</ul>

<p>If you’re optimising overall value (not just tipping), use: <a href="/guide/best-all-inclusive-value-uk-turkey">How to Get the Best All-Inclusive Value from the UK</a>.</p>

<h2>Copy-paste tipping checklist (quick, practical)</h2>
<p>Copy this into your notes and you’ll never overthink it again:</p>

<ul>
  <li>Have a small “tip cash” stash separate from spending money</li>
  <li>Tip when service is genuinely helpful or consistently great</li>
  <li>Don’t tip out of pressure — tip out of appreciation</li>
  <li>For resorts: tip occasionally (daily helper, standout service, or end-of-stay)</li>
  <li>For transfers: tip if the ride is smooth and luggage/help was provided</li>
</ul>

<p><strong>UK-friendly tip:</strong> A smile + a calm “thank you” with a small tip is the whole system.</p>

<!-- IMAGE_SMILING_STAFF_PLACEHOLDER -->

<h2>How to handle tipping when you’re unsure</h2>
<p>If you’re genuinely unsure in a moment, choose one of these simple options:</p>
<ul>
  <li>Tip lightly and move on (keeps it warm and easy)</li>
  <li>Ask politely: “Is service included?” (then decide calmly)</li>
  <li>If it’s a resort, tip later when you’ve seen consistent service</li>
</ul>

<p><strong>Simple rule:</strong> When uncertain, “light and polite” is always safe.</p>

<h2>FAQ: tipping in Turkey (UK traveller questions)</h2>

<h3>Is tipping expected everywhere in Turkey?</h3>
<p>No. It’s commonly used as appreciation for good service, especially in restaurants and when someone is particularly helpful.</p>

<h3>Should I tip in an all-inclusive resort?</h3>
<p>You don’t have to, but many guests tip occasionally for standout or consistent service. Keeping it occasional and genuine is the easiest approach.</p>

<h3>Is it better to tip in cash?</h3>
<p>Cash is often the simplest because it’s immediate and clear. Carrying small notes/coins makes it easy.</p>

<h3>Do I need to tip taxi drivers?</h3>
<p>Many travellers tip when the ride is smooth and helpful (especially with luggage). If you’re unsure, you can keep it light.</p>

<h3>How do I avoid feeling awkward about tipping?</h3>
<p>Set a simple routine (small cash stash + occasional tips for great service). Then you’re choosing calmly, not deciding under pressure.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Tipping Guide Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_TIPPING_CASH_PLACEHOLDER -->',
            filename: `tipping-cash-turkish-lira-authentic-${timestamp}.jpg`,
            prompt: "A close-up of a hand placing a small Turkish Lira tip (banknotes) on a restaurant bill tray. Elegant lighting. Authentic travel detail. High resolution, shallow depth of field."
        },
        {
            placeholder: '<!-- IMAGE_RESTAURANT_BILL_PLACEHOLDER -->',
            filename: `turkish-restaurant-table-bill-authentic-${timestamp}.jpg`,
            prompt: "A relaxed Turkish restaurant table setting after a meal. Empty tea glasses, a bill folder with some cash visible. Warm, inviting atmosphere. Authentic dining experience. No posed people."
        },
        {
            placeholder: '<!-- IMAGE_DRIVER_HELP_PLACEHOLDER -->',
            filename: `driver-loading-luggage-van-authentic-${timestamp}.jpg`,
            prompt: "A friendly driver helping with luggage at the back of a black transfer van. Sunny day. Authentic, helpful service moment. Focus on the action of help. Realistic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_HOUSEKEEPING_NOTE_PLACEHOLDER -->',
            filename: `housekeeping-towel-art-note-authentic-${timestamp}.jpg`,
            prompt: "A neat hotel bed with a simple towel art decoration and a small 'thank you' note or tip left on the pillow. Bright, clean hotel room. Authentic resort detail. Welcoming vibe."
        },
        {
            placeholder: '<!-- IMAGE_SMILING_STAFF_PLACEHOLDER -->',
            filename: `smiling-waiter-turkish-tea-authentic-${timestamp}.jpg`,
            prompt: "A friendly Turkish waiter serving tea on a tray with a genuine smile. Blurred background of a sunny cafe. Authentic hospitality. Warm, human connection found in travel."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('CASH')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the bill one? Let's use the tipping cash one as cover
            if (item.filename.includes('tipping-cash')) {
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Bahşiş Rehberi (TR Pasif)" },
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
