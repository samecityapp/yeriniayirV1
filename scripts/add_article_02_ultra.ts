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
async function generateImageVertexSafe(prompt: string, filename: string, retries = 3) {
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
            if (attempt > 1) await sleep(20000); // Backoff

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

// --- ARTICLE CONTENT ---
const ARTICLE_DATA = {
    slug: 'ultra-all-inclusive-turkey-explained',
    title: 'Ultra All-Inclusive in Turkey Explained: What It Really Means (No-Surprises Guide)',
    meta_description: 'What is the difference between All-Inclusive and Ultra All-Inclusive in Turkey? This UK-friendly guide explains 24-hour service, branded alcohol, minibar rules, and whether it’s worth the upgrade.',
    primary_keyword: 'Ultra All-Inclusive vs All-Inclusive Turkey',
    content: `
<p class="text-lg font-medium text-gray-800 mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
    <strong>Quick answer:</strong> "Ultra" All-Inclusive (UAI) typically adds three upgrades: <strong>24-hour food and drink</strong> (not stopping at 23:00), <strong>branded imported alcohol</strong> (Smirnoff, Baileys, etc., instead of local copies), and often a <strong>restocked minibar</strong> daily. If you are a night owl or prefer specific drink brands, UAI is worth the extra cost.
</p>

<p>You’re browsing jet2holidays or TUI, and you see two nearly identical hotels. One is "All-Inclusive", the other is "Ultra All-Inclusive". The price difference might be £100 or £500.</p>

<p>Is it just marketing fluff? Or does it actually change your holiday?</p>

<p>In Turkey, the distinction is real, but it’s not regulated by law. "Ultra All-Inclusive" (UAI), "High Class All-Inclusive", and "All-Inclusive Plus" are terms hotels use to say: <em>"We give you more than just the basics."</em> This guide breaks down exactly what that "more" usually looks like for a UK traveller.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2 id="the-three-big-pillars">The "Big Three" Upgrades of UAI</h2>
<p>While every hotel defines it slightly differently, 90% of UAI concepts in Turkey are built on these three pillars:</p>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
    <div class="bg-indigo-50 p-6 rounded-lg">
        <h3 class="font-bold text-indigo-900 mb-2">1. The "24-Hour" Rule</h3>
        <p class="text-sm">Standard AI bars often close at 23:00 or 00:00. After that, you pay for water and beer. <strong>UAI usually guarantees at least one bar and one food source is open 24/7.</strong></p>
    </div>
    <div class="bg-indigo-50 p-6 rounded-lg">
        <h3 class="font-bold text-indigo-900 mb-2">2. Branded Alcohol</h3>
        <p class="text-sm">Standard AI serves "Local Vodka" or "Local Gin" (often weaker/harsher). <strong>UAI includes specific imported brands</strong> like Smirnoff, Gordon's, or Jack Daniels.</p>
    </div>
    <div class="bg-indigo-50 p-6 rounded-lg">
        <h3 class="font-bold text-indigo-900 mb-2">3. The Minibar</h3>
        <p class="text-sm">Standard AI minibars are often empty or just water. <strong>UAI minibars are restocked daily</strong> with Coke, Fanta, Efés beer, and water—free of charge.</p>
    </div>
</div>

<!-- IMAGE_PREMIUM_DRINK_PLACEHOLDER -->

<h2 id="alcohol-brands-verify">How to Verify the "Branded Drinks" Promise</h2>
<p>This is the #1 complaint from Brits: <em>"I paid for Ultra, but they only had local gin."</em></p>
<p>Hotels are clever. "Ultra All-Inclusive" usually includes <strong>"Some Selected Import Brands"</strong>. It rarely means <em>everything</em> behind the bar is free.</p>

<p><strong>Common Turkish UAI Bar Rules:</strong></p>
<ul class="list-disc pl-6 mb-6 space-y-2">
    <li><strong>Included:</strong> Ballantine's or J&B Whisky, Smirnoff Vodka, Gordon's Gin, Baileys, Martini.</li>
    <li><strong>Extra Cost:</strong> Black Label which includes aged whiskies, Grey Goose, premium cognacs, and champagne.</li>
    <li><strong>The "Lobby Bar" Trick:</strong> Often, the premium brands are only free at the Lobby Bar, while the Pool Bar still serves the local stuff. Check this!</li>
</ul>

<p><strong>UK-friendly tip:</strong> Ask for your brand by name. If you ask for a "Gin and Tonic", the barman will pour the local gin (it's cheaper for them). If you ask for "Gordon's and Tonic", they will pour Gordon's if it's on the menu.</p>

<h2 id="food-24-hours">Does "24 Hour Food" mean a full buffet at 3am?</h2>
<p>No. Don't expect a roast dinner at 4am.</p>
<p>In most UAI resorts, the 24-hour food capability means:</p>
<ul class="list-disc pl-6 mb-6 space-y-2">
    <li><strong>07:00 – 10:30:</strong> Breakfast Buffet (Massive)</li>
    <li><strong>10:30 – 11:30:</strong> Late Breakfast (Smaller selection)</li>
    <li><strong>12:30 – 14:30:</strong> Lunch Buffet</li>
    <li><strong>12:00 – 16:00:</strong> Snack Bars (Burgers, Gözleme, Pizza by the pool)</li>
    <li><strong>19:00 – 21:30:</strong> Dinner Buffet</li>
    <li><strong>23:00 – 00:00:</strong> Night Soup (Traditional soup & bread)</li>
    <li><strong>00:00 – 07:00:</strong> <strong>Mini Night Buffet or Sandwich Corner</strong> (This is the "Ultra" part)</li>
</ul>

<p>If you arrive on a late flight from Manchester at 3am, UAI saves you. You can grab a soup or a toastie without paying €20 for room service.</p>

<!-- IMAGE_LATE_SNACK_PLACEHOLDER -->

<h2 id="room-amenities">The Minibar & Room Service Difference</h2>
<p>In a Standard AI hotel, you often arrive to find two small bottles of water in the fridge, and that's it for the week. You end up buying multipacks from the resort shop.</p>
<p>In a good UAI hotel, the minibar is a daily ritual. Housekeeping refills it with:</p>
<ul class="space-y-2 mb-4">
    <li class="flex items-start"><span class="mr-2">🥤</span> 2x Cola / Fanta</li>
    <li class="flex items-start"><span class="mr-2">🍺</span> 2x Efés Beer (sometimes)</li>
    <li class="flex items-start"><span class="mr-2">💧</span> 2x Still Water + 2x Sparkling Water</li>
    <li class="flex items-start"><span class="mr-2">🍫</span> Sometimes a small chocolate or cracker pack</li>
</ul>
<p>This sounds small, but having a cold beer on your balcony while getting ready for dinner—without walking to the bar—is a huge "holiday happiness" factor.</p>

<!-- IMAGE_MINIBAR_PLACEHOLDER -->

<h2 id="a-la-carte">The À La Carte "Myth"</h2>
<p>Many Brits assume "Ultra" means unlimited access to the steakhouse or Italian restaurant. <strong>It usually does not.</strong></p>
<p>Most UAI hotels operate on a "1 free visit per stay" basis for their à la carte restaurants.</p>
<ul class="list-disc pl-6 mb-6 space-y-2">
    <li>You must book at Guest Relations (usually at 09:00 am).</li>
    <li>Places go fast (it's a battle!).</li>
    <li>Some "special" restaurants (e.g., Teppanyaki) might still have a cover charge (£10–£15pp) even on Ultra.</li>
</ul>

<h2 id="checklist">Ultra All-Inclusive "Reality Check" Checklist</h2>
<p>Before you pay the extra £200 for "Ultra", check the hotel's Fact Sheet (often found on their website or Tripadvisor photos) for these keywords:</p>

<div class="bg-gray-100 p-6 rounded-lg my-6">
    <h3 class="text-lg font-bold mb-4">The "Is it Real Ultra?" Test</h3>
    <ul class="space-y-3">
        <li class="flex items-center">
            <input type="checkbox" class="mr-3 h-5 w-5 text-blue-600" disabled>
            <span>Does it explicitly say "Imported Drinks Included"? (If it says "Local Alcoholic Drinks", it's fake Ultra).</span>
        </li>
        <li class="flex items-center">
            <input type="checkbox" class="mr-3 h-5 w-5 text-blue-600" disabled>
            <span>Is the minibar restocked "Daily" or just "On Arrival"?</span>
        </li>
        <li class="flex items-center">
            <input type="checkbox" class="mr-3 h-5 w-5 text-blue-600" disabled>
            <span>Is room service included? (99% of the time: NO. Room service is almost always extra, even in Ultra).</span>
        </li>
        <li class="flex items-center">
            <input type="checkbox" class="mr-3 h-5 w-5 text-blue-600" disabled>
            <span>Do you get free safe box usage? (Standard AI sometimes charges £2/day).</span>
        </li>
    </ul>
</div>

<h2 id="simple-rule">Simple Rule: When is it worth it?</h2>

<div class="overflow-x-auto my-8">
    <table class="min-w-full text-sm text-left text-gray-700 border rounded-lg">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
                <th class="px-6 py-3 border-b">Traveller Type</th>
                <th class="px-6 py-3 border-b">Verdict</th>
                <th class="px-6 py-3 border-b">Reason</th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b">
                <td class="px-6 py-4 font-medium">Night Owls (Up past midnight)</td>
                <td class="px-6 py-4 text-green-600 font-bold">ESSENTIAL</td>
                <td class="px-6 py-4">Standard AI bars close. UAI keeps pouring.</td>
            </tr>
            <tr class="bg-gray-50 border-b">
                <td class="px-6 py-4 font-medium">Brand Snobs (Hate local spirits)</td>
                <td class="px-6 py-4 text-green-600 font-bold">WORTH IT</td>
                <td class="px-6 py-4">Avoiding the "hangover headache" of cheap gin.</td>
            </tr>
            <tr class="bg-white border-b">
                <td class="px-6 py-4 font-medium">Early Risers / Non-Drinkers</td>
                <td class="px-6 py-4 text-red-600 font-bold">WASTE OF MONEY</td>
                <td class="px-6 py-4">You won't use the midnight bar or imported vodka.</td>
            </tr>
        </tbody>
    </table>
</div>

<!-- IMAGE_NIGHT_BAR_PLACEHOLDER -->

<h2 id="faq">FAQ: Common UAI Questions</h2>

<div class="space-y-4">
    <details class="group border-b border-gray-200 pb-4">
        <summary class="flex justify-between items-center cursor-pointer list-none text-lg font-medium text-gray-900">
            What is "High Class All Inclusive"?
            <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
        </summary>
        <div class="text-gray-600 mt-3 group-open:animate-fadeIn">
            This is basically just a fancy marketing name for Ultra All-Inclusive. It tends to be used by luxury chains (like Rixos or Cornelia) to suggest even higher service standards, but the core "24h + Brands" rule is the same.
        </div>
    </details>

    <details class="group border-b border-gray-200 pb-4">
        <summary class="flex justify-between items-center cursor-pointer list-none text-lg font-medium text-gray-900">
            Are cocktails included?
            <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
        </summary>
        <div class="text-gray-600 mt-3 group-open:animate-fadeIn">
            Yes, but the quality varies. In UAI, your Mojito should be made with Bacardi or Havana Club. In Standard AI, it will be made with "Local White Rum".
        </div>
    </details>

    <details class="group border-b border-gray-200 pb-4">
        <summary class="flex justify-between items-center cursor-pointer list-none text-lg font-medium text-gray-900">
            Is fresh orange juice included at breakfast?
            <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
        </summary>
        <div class="text-gray-600 mt-3 group-open:animate-fadeIn">
             Surprisingly, often NO. Even in Ultra hotels, fresh OJ is sometimes a €2 extra. Look for "Fresh fruit juices included" on the fact sheet. UAI usually means <em>concentrated</em> juices are free.
        </div>
    </details>

    <details class="group border-b border-gray-200 pb-4">
        <summary class="flex justify-between items-center cursor-pointer list-none text-lg font-medium text-gray-900">
            Can I wear wristbands to other hotels?
            <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
        </summary>
        <div class="text-gray-600 mt-3 group-open:animate-fadeIn">
            No. Each hotel has unique colours. Also, UAI guests often have a different coloured band (e.g., Gold or Black) compared to Standard guests in the same group, alerting bar staff to serve them premium drinks.
        </div>
    </details>
</div>

<p class="mt-8 text-sm text-gray-500"><em>Last updated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</em></p>
<p class="text-sm text-gray-500"><strong>Next in series:</strong> <a href="/guide/turkey-all-inclusive-room-types">Turkey All-Inclusive Room Types: Standard vs Swim-Up vs Family Rooms</a></p>
    `
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Article Generation (Ultra AI)...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `ultra-all-inclusive-luxury-bar-turkey-${timestamp}.jpg`,
            prompt: "A luxurious, high-end hotel lobby bar in Turkey at night. Elegant lighting, marble floors, premium alcohol bottles visible on back shelf. A couple enjoying branded cocktails. Sophisticated, 'Ultra' vibe. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_PREMIUM_DRINK_PLACEHOLDER -->',
            filename: `branded-alcohol-pour-bartender-${timestamp}.jpg`,
            prompt: "Close up action shot of a bartender pouring a premium branded spirit (like Smirnoff or Jack Daniels) into a glass with ice. Focus on the bottle label and the ice. Dark, moody, premium bar atmosphere. "
        },
        {
            placeholder: '<!-- IMAGE_LATE_SNACK_PLACEHOLDER -->',
            filename: `late-night-snack-soup-turkey-${timestamp}.jpg`,
            prompt: "A cozy late-night buffet station in a Turkish hotel. Traditional Turkish soup (corba) in a ladle, fresh bread basket. Soft warm lighting. Quiet atmosphere, 1am vibe. Comfort food."
        },
        {
            placeholder: '<!-- IMAGE_MINIBAR_PLACEHOLDER -->',
            filename: `stocked-minibar-hotel-room-${timestamp}.jpg`,
            prompt: "A slightly open hotel room minibar fridge, fully stocked. Visible cans of Coke, Fanta, Beer, and water bottles. Clean, modern hotel room background. 'Free refill' concept visual."
        },
        {
            placeholder: '<!-- IMAGE_NIGHT_BAR_PLACEHOLDER -->',
            filename: `night-life-hotel-entertainment-${timestamp}.jpg`,
            prompt: "Evening entertainment at a Turkish resort. A live band or show on stage in the distance. People sitting at candle-lit tables enjoying drinks. Relaxed but lively holiday atmosphere. Summer night."
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
