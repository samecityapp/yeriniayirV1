import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

// --- Configuration ---
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
    if (!fs.existsSync('google-credentials.json')) {
        console.warn(`⚠️ Skipping Image Generation: 'google-credentials.json' missing.`);
        return '';
    }

    console.log(`🎨 Generating ${filename} with Imagen 3...`);

    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);
    if (fs.existsSync(localPath)) {
        console.log(`⏩ File exists, skipping: ${filename}`);
        return `/images/articles/${filename}`;
    }

    // ... rest of the function ...

    // (This part needs to be fully replaced to be valid TS, so I'll rewrite the function start significantly)
    // Actually, I'll just change the top check to return empty string instead of null/error
    return null;
}

// ... (I need to rewrite the whole function to be clean)

async function generateImageVertexSafe(prompt: string, filename: string, retries = 3) {
    if (!fs.existsSync('google-credentials.json')) {
        console.warn("⚠️ 'google-credentials.json' missing. Skipping AI generation.");
        return null;
    }

    // Original logic
    // ...
    // Copying the original logic but adapting the file check

    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);
    if (fs.existsSync(localPath)) {
        return `/images/articles/${filename}`;
    }

    // ... Rest of auth logic ...
    try {
        const auth = new GoogleAuth({
            keyFile: 'google-credentials.json',
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();

        if (!process.env.GOOGLE_CLOUD_PROJECT_ID) return null;

        const url = `https://${API_ENDPOINT}/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predict`;

        for (let attempt = 1; attempt <= retries; attempt++) {
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
                    await sleep(30000);
                    continue;
                }
                const errText = await response.text();
                console.error(`Vertex Error: ${errText}`);
                return null;
            }

            const data = await response.json();
            if (!data.predictions?.[0]?.bytesBase64Encoded) return null;

            const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
            fs.writeFileSync(localPath, buffer);
            console.log(`✅ Saved: ${localPath}`);
            return `/images/articles/${filename}`;
        }
    } catch (e) {
        console.error("Generaton error:", e);
        return null;
    }
    return null;
}

// --- ARTICLE CONTENT ---
const ARTICLE_DATA = {
    slug: 'all-inclusive-vs-half-board-vs-bb-turkey',
    title: 'Turkey All-Inclusive vs Half Board vs B&B: Which One Suits UK Travellers?',
    meta_description: 'Deciding between All-Inclusive, Half Board, and B&B in Turkey? This UK-friendly guide breaks down the real costs, hidden extras, and which board basis suits your holiday style (Pool vs Exploration).',
    primary_keyword: 'Turkey all-inclusive vs half board',
    content: `
<p class="text-lg font-medium text-gray-800 mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
    <strong>Quick answer:</strong> If your priority is switching off, budgeting upfront, and staying poolside, <strong>All-Inclusive</strong> is unbeatable for value. If you plan to explore locally and eat out at least 50% of the time, <strong>B&B</strong> is cheaper and more authentic. <strong>Half Board</strong> is often a "middle ground trap"—you still pay for lunch and drinks, which can add up to more than All-Inclusive.
</p>

<p>For UK travellers, booking a Turkey holiday often starts with one big question: <em>"Do I lock in all my costs now, or do I want the freedom to roam?"</em></p>

<p>Ten years ago, Turkey was almost exclusively sold as an All-Inclusive destination. Today, the choice is wider. The lira exchange rate and the incredible quality of local dining mean that B&B (Bed & Breakfast) is making a massive comeback. However, the cost of alcohol in Turkey has risen, meaning "pay as you go" drinking can be a shock if you’re used to European prices.</p>

<p>This guide breaks down exactly what you get, what you lose, and where the hidden costs hide for each option.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2 id="all-inclusive">1. All-Inclusive (AI): The "Switch Off" Option</h2>
<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
    <h3 class="text-xl font-semibold mb-4 text-gray-900">What it usually includes</h3>
    <ul class="space-y-2 mb-0">
        <li class="flex items-start"><span class="mr-2">✅</span> Breakfast, Lunch, Dinner (Buffet style)</li>
        <li class="flex items-start"><span class="mr-2">✅</span> Local alcoholic and soft drinks (usually 10:00–23:00)</li>
        <li class="flex items-start"><span class="mr-2">✅</span> Snacks (Gözleme, ice cream hours, afternoon tea)</li>
        <li class="flex items-start"><span class="mr-2">✅</span> Activities and entertainment</li>
    </ul>
</div>

<p><strong>The Reality:</strong> All-Inclusive in Turkey is generally superior to European standards (like Spain or Greece). The buffets are vast, and the service is generous. However, "Standard" All-Inclusive often excludes imported spirits (like Jack Daniels, Smirnoff) and fresh juices. You will get "local equivalents" (Efés beer, local vodka, local gin).</p>

<p><strong>Who is it for?</strong></p>
<ul class="list-disc pl-6 mb-6 space-y-2">
    <li><strong>Families:</strong> Endless ice cream and drinks for kids means zero stress.</li>
    <li><strong>Budget-conscious groups:</strong> You know exactly what the holiday costs before you fly.</li>
    <li><strong>Pool lovers:</strong> If you don't plan to leave the resort before sunset, paying for AI makes total sense.</li>
</ul>

<p><strong>The "Hidden" Cost:</strong> The "Guilt Factor". When you pay for AI, you feel guilty eating out. This means you might miss the incredible local Turkish cuisine in town because "we've already paid for dinner".</p>

<!-- IMAGE_BUFFET_PLACEHOLDER -->

<h2 id="half-board">2. Half Board (HB): The "Middle Ground Trap"?</h2>
<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
    <h3 class="text-xl font-semibold mb-4 text-gray-900">What it usually includes</h3>
    <ul class="space-y-2 mb-0">
        <li class="flex items-start"><span class="mr-2">✅</span> Breakfast and Dinner (Buffet)</li>
        <li class="flex items-start"><span class="mr-2">❌</span> Lunch is NOT included</li>
        <li class="flex items-start"><span class="mr-2">❌</span> <strong>Drinks are usually NOT included at dinner</strong></li>
    </ul>
</div>

<p><strong>The Reality:</strong> Half Board often catches Brits out. You might assume drinks with dinner are free (like at breakfast)—they rarely are. You will sign a bill for every glass of wine, beer, or cola. Additionally, buying lunch every day and snacks by the pool at "hotel prices" can quickly make this <em>more expensive</em> than All-Inclusive.</p>

<p><strong>Who is it for?</strong></p>
<ul class="list-disc pl-6 mb-6 space-y-2">
    <li>People who are out on day trips all day (miss lunch) but want a guaranteed meal when they return tired.</li>
    <li>Those who don't drink alcohol (saving the drink costs).</li>
</ul>

<p><strong>Simple rule:</strong> Only book Half Board if the price difference is massive compared to All-Inclusive. Otherwise, the cost of drinks and lunch will eat up your savings.</p>

<h2 id="bed-and-breakfast">3. Bed & Breakfast (B&B): The "Explorer's Choice"</h2>
<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
    <h3 class="text-xl font-semibold mb-4 text-gray-900">What it usually includes</h3>
    <ul class="space-y-2 mb-0">
        <li class="flex items-start"><span class="mr-2">✅</span> Breakfast only (usually strict hours, e.g., 08:00–10:30)</li>
        <li class="flex items-start"><span class="mr-2">❌</span> No other meals, no drinks, no snacks</li>
    </ul>
</div>

<p><strong>The Reality:</strong> This is the most authentic way to see Turkey. You are forced to leave the hotel. You will find <a href="[INTERNAL_LINK:best-beach-bases-turkey-brits]">local restaurants</a>, try authentic pides, mezes, and grilled fish for a fraction of UK prices. However, pool days become expensive if you buy hotel beers and burgers all day.</p>

<p><strong>UK-friendly tip:</strong> If you book B&B, find a local "migros" or supermarket to stock your room fridge with huge bottles of water and snacks (check if your hotel allows this—most small B&Bs do, big resorts might not).</p>

<!-- IMAGE_LOCAL_BREAKFAST_PLACEHOLDER -->

<h2 id="comparison">The "Alcohol Math" (Why it matters)</h2>
<p>Alcohol taxes in Turkey have risen significantly. In supermarkets, beer and wine are reasonable, but in bars and restaurants, prices are creeping closer to UK pub prices.</p>

<ul class="list-disc pl-6 mb-6 space-y-2">
    <li><strong>Local Beer (50cl):</strong> £3.50 – £5.50 in a tourist bar.</li>
    <li><strong>Cocktail:</strong> £8.00 – £12.00.</li>
    <li><strong>Glass of Wine:</strong> £5.00 – £7.00.</li>
</ul>

<p>If you enjoy 4–5 alcoholic drinks a day by the pool, <strong>All-Inclusive</strong> pays for itself very quickly. If you only have one glass of wine with dinner, B&B is smart.</p>

<!-- IMAGE_POOL_DRINK_PLACEHOLDER -->

<h2 id="decision-matrix">Decision Matrix: Which one are you?</h2>

<div class="overflow-x-auto my-8">
    <table class="min-w-full text-sm text-left text-gray-700 border rounded-lg">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
                <th class="px-6 py-3 border-b">Your Style</th>
                <th class="px-6 py-3 border-b">Best Choice</th>
                <th class="px-6 py-3 border-b">Why?</th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b">
                <td class="px-6 py-4 font-medium">Pool Potato</td>
                <td class="px-6 py-4 text-green-600 font-bold">All-Inclusive</td>
                <td class="px-6 py-4">Drinks and snacks all day add up fast if you pay cash.</td>
            </tr>
            <tr class="bg-gray-50 border-b">
                <td class="px-6 py-4 font-medium">Culture Vulture</td>
                <td class="px-6 py-4 text-blue-600 font-bold">B&B</td>
                <td class="px-6 py-4">You won't be in the hotel to eat lunch or grab snacks.</td>
            </tr>
            <tr class="bg-white border-b">
                <td class="px-6 py-4 font-medium">Foodie</td>
                <td class="px-6 py-4 text-blue-600 font-bold">B&B</td>
                <td class="px-6 py-4">Hotel buffets are repetitive. Local restaurants are incredible.</td>
            </tr>
            <tr class="bg-gray-50 border-b">
                <td class="px-6 py-4 font-medium">Family with Teens</td>
                <td class="px-6 py-4 text-green-600 font-bold">All-Inclusive</td>
                <td class="px-6 py-4">Teens eat and drink constantly. AI caps the cost.</td>
            </tr>
        </tbody>
    </table>
</div>

<h2 id="checklist">"Avoid Surprises" Checklist</h2>
<p>Before you book, ask these three questions. The answers change everything.</p>

<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
    <ol class="list-decimal pl-6 space-y-2">
        <li><strong>For AI:</strong> "Are fresh juices and Turkish coffee included, or extra?" (Often extra).</li>
        <li><strong>For Half Board:</strong> "Is water included at dinner?" (Usually no).</li>
        <li><strong>For B&B:</strong> "Is there a fridge in the room?" (Essential for cold water/store-bought beer).</li>
    </ol>
</div>

<!-- IMAGE_EVENING_DINING_PLACEHOLDER -->

<h2 id="faq">FAQ: Common UK Traveller Questions</h2>

<div class="space-y-4">
    <details class="group border-b border-gray-200 pb-4">
        <summary class="flex justify-between items-center cursor-pointer list-none text-lg font-medium text-gray-900">
            Is Full Board worth it?
            <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
        </summary>
        <div class="text-gray-600 mt-3 group-open:animate-fadeIn">
            Rarely. Full Board gives you lunch but NO drinks. It's the worst of both worlds. You are stuck at the hotel for lunch, but still pay for every coke and beer.
        </div>
    </details>

    <details class="group border-b border-gray-200 pb-4">
        <summary class="flex justify-between items-center cursor-pointer list-none text-lg font-medium text-gray-900">
            Can I upgrade from B&B to All-Inclusive when I arrive?
            <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
        </summary>
        <div class="text-gray-600 mt-3 group-open:animate-fadeIn">
            Sometimes, but it's usually much more expensive (daily rate) than booking it in advance as a package from the UK. Check with the hotel reception via email <em>before</em> you fly.
        </div>
    </details>

    <details class="group border-b border-gray-200 pb-4">
        <summary class="flex justify-between items-center cursor-pointer list-none text-lg font-medium text-gray-900">
            Is the food safe in All-Inclusive?
            <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
        </summary>
        <div class="text-gray-600 mt-3 group-open:animate-fadeIn">
            Yes. Turkey has very strict hygiene standards for tourism hotels. Stick to cooked foods if you have a sensitive stomach, but generally, the salad bars and buffets are safe and high quality.
        </div>
    </details>

    <details class="group border-b border-gray-200 pb-4">
        <summary class="flex justify-between items-center cursor-pointer list-none text-lg font-medium text-gray-900">
            Do I need to tip in All-Inclusive?
            <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
        </summary>
        <div class="text-gray-600 mt-3 group-open:animate-fadeIn">
            It's not mandatory but appreciated. A "tip box" is usually available at reception or the restaurant entrance. Small tips for bar staff often result in stronger drinks and faster service! See our <a href="[INTERNAL_LINK:tipping-in-turkey-guide]">Tipping Guide</a>.
        </div>
    </details>
</div>

<p class="mt-8 text-sm text-gray-500"><em>Last updated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</em></p>
<p class="text-sm text-gray-500"><strong>Next in series:</strong> <a href="/guide/ultra-all-inclusive-turkey-explained">Ultra All-Inclusive in Turkey Explained: What It Really Means</a></p>
    `
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Article Generation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-all-inclusive-vs-bb-cover-${timestamp}.jpg`,
            prompt: "A split composition concept image. Left side: A relaxing poolside drink at a Turkish resort. Right side: A beautiful authentic Turkish breakfast spread (kahvalti) at a local cafe. Sunny, inviting, travel photography style. High quality, realistic."
        },
        {
            placeholder: '<!-- IMAGE_BUFFET_PLACEHOLDER -->',
            filename: `turkey-hotel-buffet-selection-${timestamp}.jpg`,
            prompt: "A high-quality, lavish open buffet at a Turkish hotel. Chefs in white uniforms behind counters. Fresh salads, grilled meats, endless desert section. Bright lighting, clean, appetizing, abundance. Authentic 5-star turkey hotel vibe."
        },
        {
            placeholder: '<!-- IMAGE_LOCAL_BREAKFAST_PLACEHOLDER -->',
            filename: `turkish-breakfast-serpme-authentic-${timestamp}.jpg`,
            prompt: "Authentic Turkish 'serpme' breakfast on a wooden table outdoors. Dozens of small plates (olives, cheese, honey, jams), tulip-shaped tea glasses, fresh bread. Sunlight filtering through vine leaves. Rustic, charming, inviting."
        },
        {
            placeholder: '<!-- IMAGE_POOL_DRINK_PLACEHOLDER -->',
            filename: `cocktail-by-pool-turkey-resort-${timestamp}.jpg`,
            prompt: "Close up of a refreshing cocktail with ice and lime by a turquoise swimming pool. Focus on the drink. Soft blurred background of sun loungers and palm trees. Summer holiday vibe. Refreshing, cool, luxury."
        },
        {
            placeholder: '<!-- IMAGE_EVENING_DINING_PLACEHOLDER -->',
            filename: `evening-dining-sea-view-turkey-${timestamp}.jpg`,
            prompt: "Dinner time at a seaside restaurant in Turkey during sunset. Warm ambient lighting, white tablecloths, people enjoying meal. View of the Mediterranean sea. Relaxed, romantic, 'pay as you go' dining atmosphere."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('COVER')) await sleep(8000);

        const publicUrl = await generateImageVertexSafe(item.prompt, item.filename);

        if (publicUrl) {
            if (item.placeholder.includes('COVER')) {
                coverImageUrl = publicUrl;
                finalContent = finalContent.replace(item.placeholder, '');
            } else {
                const imgTag = `<figure class="my-8"><img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg shadow-md" /></figure>`;
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
        title: { en: ARTICLE_DATA.title, tr: `${ARTICLE_DATA.title} (TR Pasif)` },
        meta_description: { en: ARTICLE_DATA.meta_description, tr: "TR Pasif içerik." },
        content: { en: finalContent, tr: "<p>Turkish content not available.</p>" },
        cover_image_url: coverImageUrl,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });

    if (error) {
        console.error("❌ DB Insert Failed:", error);
    } else {
        console.log("✅ Article Added Successfully!");
        console.log(`👉 Slug: ${ARTICLE_DATA.slug}`);
        console.log(`🔗 Link: http://localhost:3000/en/guide/${ARTICLE_DATA.slug}`);
    }
}

run();
