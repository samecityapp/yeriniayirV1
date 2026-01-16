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
    slug: 'a-la-carte-all-inclusive-turkey',
    title: 'A La Carte Restaurants in Turkey All-Inclusive: How It Works (UK Traveller Guide)',
    meta_description: 'Wondering how à la carte dining works at Turkey all-inclusive resorts? This UK-focused guide explains the common rules (booking, limits, dress codes, and “what’s included”), plus copy-paste questions to avoid surprises — no hotel names.',
    primary_keyword: 'a la carte restaurants all-inclusive Turkey',
    content: `<p><strong>Quick answer:</strong> In many Turkey all-inclusive resorts, à la carte restaurants are available but often come with rules: you may need to book in advance, there may be limits on how many visits you get per stay, and some menus or “premium” items can cost extra. The best way to avoid surprises is to ask a few specific questions before you book (or before you arrive).</p>

<h2>What “à la carte” usually means in an all-inclusive resort</h2>
<p>In a typical all-inclusive setup, the main buffet is the default option for most meals. An à la carte restaurant is usually a <strong>seated meal</strong> where you order from a menu (rather than serving yourself).</p>

<ul>
  <li><strong>Buffet:</strong> walk in, serve yourself, often wider choice, less formal</li>
  <li><strong>À la carte:</strong> seated dining, menu-based, often calmer and slower paced</li>
</ul>

<p><strong>Simple rule:</strong> Treat à la carte as an “experience upgrade” inside the resort — not automatically an unlimited free extra.</p>

<p>If you want the basics of what all-inclusive tends to include, start here: <a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included (and What Usually Isn’t)</a>.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>The most common à la carte “rules” (what UK travellers should expect)</h2>
<p>Policies vary by resort, but these are the patterns UK travellers most often run into.</p>

<h3>1) Booking is usually required</h3>
<ul>
  <li>Many resorts use a reservation system (sometimes same-day, sometimes a few days ahead)</li>
  <li>Popular time slots can fill quickly in busy periods</li>
  <li>Some places only take bookings in person (e.g., via guest services)</li>
</ul>

<p><strong>UK-friendly tip:</strong> If à la carte matters to you, plan it like theatre tickets: book early, then build your days around it.</p>

<h3>2) There may be visit limits per stay</h3>
<p>Some all-inclusive packages allow a certain number of à la carte visits depending on:</p>
<ul>
  <li>Length of stay (e.g., longer stays may allow more visits)</li>
  <li>Room type or package tier</li>
  <li>Season / occupancy levels</li>
</ul>

<p><strong>Simple rule:</strong> Assume there could be a limit unless it’s clearly stated otherwise.</p>

<h3>3) Not everything on the menu is always included</h3>
<p>Even when an à la carte visit is “included”, there can be exceptions. Examples of things that are <em>sometimes</em> extra (depending on the resort policy):</p>

<ul>
  <li>Premium seafood or speciality cuts</li>
  <li>Branded/premium drinks and certain cocktails</li>
  <li>Special tasting menus or celebration packages</li>
</ul>

<p><strong>UK-friendly tip:</strong> Ask, “Are there any chargeable items on the à la carte menu?” It’s a more useful question than “Is it included?”</p>

<!-- IMAGE_MENU_PLACEHOLDER -->

<p>For a broader view of extra charges that surprise people, see: <a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts (What UK Travellers Get Surprised By)</a>.</p>

<h3>4) Dress codes can exist (and they’re not always obvious)</h3>
<p>À la carte venues are often more “evening” than buffet restaurants. Some resorts apply simple dress expectations such as:</p>
<ul>
  <li>No swimwear in the restaurant</li>
  <li>Closed-toe shoes sometimes preferred for men</li>
  <li>Smart-casual vibe at dinner</li>
</ul>

<p><strong>Simple rule:</strong> Pack at least one smart-casual dinner outfit so you’re never blocked by a dress rule.</p>

<h3>5) Restaurant “themes” can be seasonal or rotated</h3>
<p>Not every venue runs every night. Depending on staffing and season, a resort may:</p>
<ul>
  <li>Rotate venues by day of week</li>
  <li>Run fewer restaurants in quieter periods</li>
  <li>Offer fewer time slots when occupancy is low</li>
</ul>

<!-- IMAGE_THEME_PLACEHOLDER -->

<p><strong>UK-friendly tip:</strong> If you’re travelling outside peak weeks, ask which restaurants will be operating during your dates.</p>

<h2>What affects your chances of getting a booking</h2>
<p>When people say, “We couldn’t get into the à la carte restaurants,” it usually comes down to timing and expectations, not luck.</p>

<ul>
  <li><strong>Stay length:</strong> shorter stays mean fewer opportunities to fit a booking</li>
  <li><strong>Arrival day:</strong> late arrival can put you behind the queue for popular slots</li>
  <li><strong>Peak periods:</strong> demand is higher, especially for early dinner times</li>
  <li><strong>Group size:</strong> couples are easier to place than larger groups</li>
</ul>

<p><strong>Simple rule:</strong> If you want an early slot (UK family dinner time), try to book as soon as the booking window opens.</p>

<h2>À la carte vs buffet: what to choose and when</h2>
<p>À la carte is great, but it’s not automatically “better” every night. Here’s a practical way to decide:</p>

<ul>
  <li><strong>Choose buffet</strong> when you want speed, flexibility, and variety</li>
  <li><strong>Choose à la carte</strong> when you want slower dining, a calmer setting, and a “date night” feel</li>
  <li><strong>Mix both</strong> if you’re staying longer than a few nights — it keeps the holiday feeling fresh</li>
</ul>

<!-- IMAGE_BUFFET_VS_ALACARTE_PLACEHOLDER -->

<p><strong>UK-friendly tip:</strong> If you’re exhausted from travel or heat, buffet can be the smartest choice — save à la carte for a night you’ll enjoy it properly.</p>

<h2>Copy-paste questions to ask before you book (or before you arrive)</h2>
<p>Use these questions to get clear, practical answers fast:</p>

<ul>
  <li>How many à la carte visits are included for our <strong>length of stay</strong>?</li>
  <li>Do we need to <strong>reserve</strong> and when can we start booking?</li>
  <li>How do bookings work: <strong>app, reception, guest services, or in-person only</strong>?</li>
  <li>Are there <strong>chargeable items</strong> on the menu (premium dishes/drinks)?</li>
  <li>Which à la carte venues will be <strong>operating</strong> during our dates?</li>
  <li>Is there a <strong>dress code</strong> for dinner?</li>
  <li>What time are the <strong>earliest</strong> dinner slots typically available?</li>
  <li>Can dietary needs be handled (allergies/intolerances), and what’s the process?</li>
</ul>

<!-- IMAGE_RESERVATION_PLACEHOLDER -->

<p><strong>Simple rule:</strong> If a resort can’t clearly answer the booking/limits/extra-cost questions, assume the strictest version and decide if you’re still happy.</p>

<h2>Common misunderstandings (quick fixes)</h2>
<ul>
  <li><strong>Misunderstanding:</strong> “À la carte means unlimited.”<br>
      <strong>Fix:</strong> Ask about limits per stay and booking rules.</li>
  <li><strong>Misunderstanding:</strong> “Included means everything is free.”<br>
      <strong>Fix:</strong> Ask whether any dishes/drinks are chargeable.</li>
  <li><strong>Misunderstanding:</strong> “We can decide on the day.”<br>
      <strong>Fix:</strong> Book early, especially for peak weeks and early slots.</li>
</ul>

<h2>How this connects to value (UK budgeting mindset)</h2>
<p>If à la carte dining is a major reason you’re choosing all-inclusive, it’s part of your value calculation — but only if you can actually use it.</p>

<ul>
  <li>If booking is difficult, buffet becomes your main dining option</li>
  <li>If premium items are extra, your “all-inclusive” spend can creep up</li>
  <li>If restaurants rotate/close, expectations need adjusting</li>
</ul>

<p>For a UK-focused framework on getting real value (timing + room choices), see: <a href="/guide/best-all-inclusive-value-uk-turkey">How to Get the Best All-Inclusive Value from the UK</a>.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting A La Carte Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `a-la-carte-restaurant-turkey-resort-authentic-${timestamp}.jpg`,
            prompt: "A beautiful outdoor à la carte restaurant at a Turkish resort at sunset. Tables with white tablecloths, lanterns, sea view. Guests enjoying a relaxed meal. Elegant, authentic holiday atmosphere. Not staged."
        },
        {
            placeholder: '<!-- IMAGE_MENU_PLACEHOLDER -->',
            filename: `a-la-carte-menu-hands-close-${timestamp}.jpg`,
            prompt: "A close up of a person holding an elegant restaurant menu in a resort setting. Warm lighting, dinner table background. Focus on the menu and hands. Authentic travel detail."
        },
        {
            placeholder: '<!-- IMAGE_THEME_PLACEHOLDER -->',
            filename: `themed-restaurant-interior-turkey-${timestamp}.jpg`,
            prompt: "Interior of a themed restaurant in a Turkish hotel (e.g., Italian or Seafood style). Stylish decor, warm lighting, nice table settings. Welcoming atmosphere. Realistic architectural photography."
        },
        {
            placeholder: '<!-- IMAGE_BUFFET_VS_ALACARTE_PLACEHOLDER -->',
            filename: `plated-dinner-dish-fine-dining-${timestamp}.jpg`,
            prompt: "A beautifully plated dinner dish (e.g., grilled fish or steak) served at an à la carte restaurant. High quality food photography. Fresh ingredients, nice garnish. Looks delicious and premium."
        },
        {
            placeholder: '<!-- IMAGE_RESERVATION_PLACEHOLDER -->',
            filename: `guest-booking-dinner-reception-${timestamp}.jpg`,
            prompt: "A guest speaking with a concierge or guest relations staff at a hotel desk, making a dinner reservation. Friendly interaction. Bright, professional resort lobby setting. Authentic."
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de A La Carte Restoranlar Nasıl Çalışır? (TR Pasif)" },
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
