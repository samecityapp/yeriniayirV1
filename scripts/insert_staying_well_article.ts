
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
        console.warn("⚠️ 'google-credentials.json' missing. Skipping generation.");
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
    slug: 'staying-well-in-turkey-food-water-heat-comfort-tips-uk-travellers',
    title: 'Staying Well in Turkey: Food, Water & Heat Comfort Tips for UK Travellers (No-Panic Guide)',
    meta_description: 'Want a smooth, healthy-feeling Turkey holiday from the UK? Use this calm comfort guide: food and drink habits that minimise stomach upsets, water choices that make sense, and heat/sun routines that keep you energised. Includes simple rules, packing lists, copy-paste questions, and FAQs (no scare stories).',
    published_at: new Date().toISOString(),
};

// Internal Link Mappings
const INTERNAL_LINKS = {
    '[INTERNAL_LINK:all-inclusive-in-turkey-whats-included]': '/guide/all-inclusive-in-turkey-explained-uk-guide',
    '[INTERNAL_LINK:hidden-costs-turkey-resorts]': '/guide/hidden-costs-turkey-resorts',
    '[INTERNAL_LINK:all-inclusive-for-families-uk-checklist]': '/guide/all-inclusive-family-checklist'
};

const rawContent = `
<p><strong>Quick answer:</strong> Most UK travellers have a great time in Turkey with no issues — and the easiest way to keep it that way is to follow three “comfort habits”: (1) hydrate smart, (2) keep food choices simple on day 1, and (3) respect the midday heat. You don’t need fear-based rules. You need a calm routine that protects your energy so the trip feels premium.</p>

<p>This guide is about comfort, not worry.</p>

<h2>The UK traveller mindset that works best in Turkey</h2>

<p>Turkey holidays can be more active than you think: hotter weather, more walking, later dinners, and a different daily rhythm. If you treat “wellbeing” as part of your itinerary, you’ll enjoy more.</p>

<p><strong>Simple rule:</strong> Your goal is not “avoid everything” — your goal is “stay energised”.</p>

<p><strong>UK-friendly tip:</strong> The best Turkey holidays have a soft midday: shade, water, slow lunch, then you come alive again late afternoon/evening.</p>

<h2>Part 1 — Water: what to drink (without overthinking)</h2>
<p>The real question isn’t “Is the water safe?”</p>

<p>The useful question is: what will keep your stomach comfortable on holiday?</p>

<p>Many travellers choose to drink:</p>
<ul>
<li>sealed bottled water for day-to-day hydration</li>
<li>hot drinks (tea/coffee) as normal</li>
<li>sealed soft drinks and canned drinks</li>
<li>ice when they’re confident in the venue (especially reputable, busy places)</li>
</ul>

<p><strong>Simple rule:</strong> If you want the calmest trip, make bottled water your default.</p>

<!-- IMAGE_1_BOTTLED_WATER -->

<h3>A simple approach that works in practice</h3>

<p><strong>Day 1–2: stick to sealed bottled water for drinking</strong></p>
<ul>
<li>Brush teeth: many travellers still use tap water with no problems, but if you want zero mental load, use bottled water the first couple of days too</li>
<li>If you’re unsure about ice: skip it for a day or two, then decide based on comfort</li>
</ul>

<p><strong>UK-friendly tip:</strong> Don’t let “water decisions” become your holiday. Pick a default (bottled) and move on.</p>

<h3>Hydration that actually helps (not just “drink more”)</h3>

<p>When it’s hot, you lose more fluid and salts through sweat.</p>

<p>Try this rhythm:</p>
<ul>
<li>Morning: 1–2 glasses before you head out</li>
<li>Midday: steady sips + something salty/food</li>
<li>Late afternoon: one “reset” drink before dinner</li>
<li>Evening: hydrate, but don’t overdo it right before bed</li>
</ul>

<p><strong>Simple rule:</strong> Hydration works best when you drink regularly, not in one big hit.</p>

<h2>Part 2 — Heat & sun: how to stay comfortable (and still enjoy summer)</h2>
<h3>Why heat “hits” UK travellers</h3>

<p>If you live in the UK most of the year, Turkey’s summer sun can feel like a different category — not because it’s scary, but because your body isn’t used to it.</p>

<p>Common “holiday fatigue” triggers:</p>
<ul>
<li>too much sun between 12:00–16:00</li>
<li>not enough water + salts</li>
<li>long walks without shade breaks</li>
<li>alcohol + sun combo</li>
<li>pushing through instead of resting</li>
</ul>

<p><strong>Simple rule:</strong> The midday sun is not the time to prove anything.</p>

<!-- IMAGE_2_SHADED_RELAXATION -->

<h3>The Turkey midday plan (the one that makes holidays feel luxury)</h3>

<p>This is the simplest high-impact routine:</p>
<ul>
<li>Morning: beach/pool/walks/exploring</li>
<li>Midday: shade + lunch + slow time + nap/quiet</li>
<li>Late afternoon: beach/pool again</li>
<li>Evening: dinner + strolling + enjoying the vibe</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you copy local rhythm, you’ll feel better fast. Turkey does evenings brilliantly — save your energy for them.</p>

<h3>Heat comfort checklist (quick wins)</h3>
<ul>
<li>Wear breathable fabrics</li>
<li>Use a hat/cap</li>
<li>Keep sunscreen where you can reapply (bag, not suitcase)</li>
<li>Choose shade before you feel bad</li>
<li>If you feel drained: cool shower + water + salty snack</li>
</ul>

<p><strong>Simple rule:</strong> Prevention beats recovery.</p>

<h3>Sun protection that’s realistic (not perfectionist)</h3>
<p>You don’t need to be obsessed — you need to be consistent.</p>
<ul>
<li>Apply sunscreen before you go out</li>
<li>Reapply after swimming/sweating</li>
<li>Don’t forget ears, neck, tops of feet</li>
</ul>

<p><strong>UK-friendly tip:</strong> Most “sun problems” happen on day 1–2 because people underestimate it. Treat the first two days as your “adaptation period”.</p>

<h2>Part 3 — Food: how to eat well and keep your stomach calm</h2>
<h3>Turkey is a food country — enjoy it</h3>

<p>This guide isn’t here to make you nervous. Turkish food culture is a highlight. The trick is to be smart on timing, not restrictive.</p>

<p><strong>Simple rule:</strong> Eat confidently — just don’t shock your system on day 1.</p>

<!-- IMAGE_3_LIGHT_MEAL -->

<h3>Day 1 food strategy (works for most UK travellers)</h3>
<p>After a flight + heat + schedule change, your body likes simple food.</p>
<p>Good Day 1 choices:</p>
<ul>
<li>grilled items</li>
<li>rice/potatoes/bread</li>
<li>yoghurt-based foods if you tolerate dairy</li>
<li>soups</li>
<li>fruit you can peel</li>
<li>cooked vegetables</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re going all-inclusive, don’t try “everything” at once on day 1. Try a few things, then expand.</p>

<p>Related: <a href="[INTERNAL_LINK:all-inclusive-in-turkey-whats-included]">All-Inclusive: What’s Included</a>
Related: <a href="[INTERNAL_LINK:hidden-costs-turkey-resorts]">Hidden Costs in Turkey Resorts</a></p>

<h3>Street food: enjoy it the smart way</h3>
<p>Street food can be amazing. The comfort method is:</p>
<ul>
<li>choose places with high turnover (busy is good)</li>
<li>prefer freshly cooked hot food</li>
<li>avoid anything that’s been sitting in heat for ages</li>
</ul>

<p><strong>Simple rule:</strong> Busy + fresh + hot = usually your best bet.</p>

<h3>Buffets (all-inclusive): how to do it like a pro</h3>
<p>Buffets are convenient and often great — and there’s an easy way to make them feel better.</p>
<ul>
<li>Choose food that’s clearly hot and freshly replenished</li>
<li>Avoid “mixing everything” on one plate</li>
<li>If you try something new, try a small portion first</li>
<li>If you’re sensitive, keep breakfast simple and experiment more at dinner</li>
</ul>

<p><strong>UK-friendly tip:</strong> Your stomach likes routine. If breakfast is the same most days, the rest of the day is easier.</p>

<h2>Part 4 — The “holiday stomach” reality (calm, practical)</h2>
<p>Sometimes travellers feel off for totally non-dramatic reasons:</p>
<ul>
<li>heat + dehydration</li>
<li>travel fatigue</li>
<li>irregular meals</li>
<li>more oil/spice than usual</li>
<li>alcohol + sun</li>
</ul>

<p><strong>Simple rule:</strong> If you feel off, reset your basics first: water + bland food + rest.</p>

<h3>The 24-hour reset plan (non-medical, comfort-focused)</h3>
<p>If you feel unsettled:</p>
<ul>
<li>drink steadily (don’t chug)</li>
<li>eat simple foods</li>
<li>avoid heavy alcohol</li>
<li>take a quiet midday break</li>
<li>sleep earlier</li>
</ul>

<p>If you’re worried or symptoms are severe/worsening, get professional help promptly.</p>
<p><strong>Emergency support reminder:</strong> 112 is the main emergency number in Turkey.</p>

<!-- IMAGE_4_PHARMACY_HELP -->

<h2>Part 5 — Families: how to keep kids happy in Turkey heat</h2>
<p>Kids usually do great in Turkey — as long as you protect the basics.</p>

<h3>The family comfort priorities</h3>
<ul>
<li>shade access</li>
<li>regular water breaks</li>
<li>snack rhythm</li>
<li>midday downtime</li>
<li>early nights if needed</li>
</ul>

<p><strong>Simple rule:</strong> Kids don’t “push through heat” well. Build shade into the day.</p>

<p>Family guide: <a href="[INTERNAL_LINK:all-inclusive-for-families-uk-checklist]">Family All-Inclusive Checklist</a></p>

<h3>Easy parent trick: “water + salt + shade”</h3>
<p>If your child looks wiped:</p>
<ul>
<li>water</li>
<li>something salty (food/snack)</li>
<li>cool down in shade/air-con</li>
</ul>

<p><strong>UK-friendly tip:</strong> Keep a small “heat kit” in your bag: wipes, a hat, and a spare top.</p>

<h2>Part 6 — What to pack for comfort (UK-friendly mini list)</h2>
<p>This is not a massive packing list — just the items that make a big difference.</p>

<h3>Heat comfort essentials</h3>
<ul>
<li>hat/cap</li>
<li>sunglasses</li>
<li>sunscreen</li>
<li>lightweight layer for evenings/air-con</li>
<li>rehydration support (or plan to buy locally)</li>
</ul>

<h3>Stomach comfort essentials</h3>
<ul>
<li>a couple of “safe snacks” for day 1 (plain biscuits, etc.)</li>
<li>basic plasters and antiseptic wipes</li>
<li>any regular medication in original packaging</li>
</ul>

<p><strong>UK-friendly tip:</strong> Don’t pack a pharmacy. Pack a routine.</p>
<p>If you need medicines while there, pharmacies (“eczane”) are common — and there’s an on-duty system outside normal hours in many areas. (Example info via Istanbul’s pharmacists’ chamber communications.)</p>

<!-- IMAGE_5_PACKING_ESSENTIALS -->

<h2>Part 7 — Copy-paste questions (save these)</h2>
<p>Use these in resorts, restaurants, or with guides:</p>
<ul>
<li>“What’s your most popular freshly cooked dish?”</li>
<li>“Which dishes are mild (not spicy)?”</li>
<li>“Is this served fresh today?”</li>
<li>“Do you have bottled water available?”</li>
<li>“We’re travelling with kids — what’s the best shaded time for activities?”</li>
<li>“Is there a quiet, shaded area we can use midday?”</li>
</ul>

<p><strong>Simple rule:</strong> Asking one simple question prevents a lot of discomfort.</p>

<h2>Part 8 — The “No-Panic Comfort Checklist” (save this)</h2>
<h3>Every morning</h3>
<ul>
<li>water before leaving the room ✅</li>
<li>sunscreen before the sun “feels strong” ✅</li>
<li>plan shade for midday ✅</li>
</ul>

<h3>Day 1–2</h3>
<ul>
<li>keep food simple ✅</li>
<li>bottled water as default ✅</li>
<li>don’t overdo alcohol in the sun ✅</li>
</ul>

<h3>If you feel off</h3>
<ul>
<li>hydration + salty food ✅</li>
<li>rest in shade/air-con ✅</li>
<li>simple meals ✅</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you do nothing else, do the morning water + midday shade. It’s the biggest win.</p>

<!-- IMAGE_6_NO_STRESS_CHECKLIST -->

<h2>FAQ: Food, water & heat comfort in Turkey (UK travellers)</h2>

<h3>Should UK travellers drink bottled water in Turkey?</h3>
<p>Many UK travellers choose bottled water as a simple comfort default because it removes guesswork and helps avoid stomach upset during the first days of travel. It’s a low-effort habit that often makes the trip feel smoother.</p>

<h3>Is ice okay?</h3>
<p>In many reputable places, ice is commonly used. If you want the calmest approach, skip ice for the first day or two and then decide based on your comfort and the venue.</p>

<h3>What’s the best way to avoid feeling wiped out in the heat?</h3>
<p>Use the local rhythm: active morning, shaded midday break, then late afternoon and evening enjoyment. Hydrate steadily and don’t treat midday sun like an endurance test.</p>

<h3>What’s the best Day 1 food plan?</h3>
<p>Simple, familiar food (grilled items, rice/potatoes, soups, fruit you can peel) and smaller portions. Let your body settle, then explore more.</p>

<h3>Are buffets risky?</h3>
<p>Buffets can be absolutely fine. The comfort method is to choose food that’s clearly hot and fresh, avoid mixing too many new items at once, and keep breakfast simple.</p>

<h3>What should I do if someone in our group feels unwell?</h3>
<p>Start with basic comfort steps (rest, hydration, simple food). If symptoms are severe, worsening, or you’re concerned, seek professional help. For emergencies, Turkey’s main emergency number is 112.</p>
`;

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Staying Well Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_1_BOTTLED_WATER -->',
            filename: `bottled-water-vacation-table-turkey-${timestamp}.jpg`,
            prompt: "A cold bottle of water on a restaurant table in Turkey. Sunny background, condensation on the bottle. Refreshing, clean, simple key to staying well. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_2_SHADED_RELAXATION -->',
            filename: `shaded-sunbed-relaxation-turkey-midday-${timestamp}.jpg`,
            prompt: "A person relaxing on a shaded sunbed under a parasol or tree in Turkey. Peaceful midday break. Not direct sun. Reading or napping. Authentic holiday vibe."
        },
        {
            placeholder: '<!-- IMAGE_3_LIGHT_MEAL -->',
            filename: `light-grilled-chicken-meal-turkey-${timestamp}.jpg`,
            prompt: "A simple, healthy meal of grilled chicken and rice with salad in Turkey. Fresh, appetizing, not heavy. Perfect for day 1. Authentic food photography."
        },
        {
            placeholder: '<!-- IMAGE_4_PHARMACY_HELP -->',
            filename: `eczane-pharmacy-friendly-help-turkey-${timestamp}.jpg`,
            prompt: "A friendly Turkish pharmacist giving advice to a traveller. Clean, modern pharmacy interior. Helpful interaction. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_5_PACKING_ESSENTIALS -->',
            filename: `travel-essentials-sunscreen-hat-water-${timestamp}.jpg`,
            prompt: "Flat lay of travel essentials on a bed: Sunscreen, hat, sunglasses, water bottle, pack of plasters. Practical packing for Turkey. Authentic travel style."
        },
        {
            placeholder: '<!-- IMAGE_6_NO_STRESS_CHECKLIST -->',
            filename: `relaxed-traveller-morning-coffee-view-${timestamp}.jpg`,
            prompt: "A relaxed traveller enjoying a morning coffee or water on a balcony with a sea view in Turkey. Calm, start of the day. No stress. Authentic holiday moment."
        }
    ];

    let finalContent = rawContent;
    let coverImageUrl = '';

    // Replace Internal Links
    for (const [key, value] of Object.entries(INTERNAL_LINKS)) {
        finalContent = finalContent.split(key).join(value);
    }

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        await sleep(5000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {

            // Use shading/relax as cover potentially
            if (item.filename.includes('shaded-sunbed')) {
                coverImageUrl = publicUrl;
            } else if (!coverImageUrl) {
                coverImageUrl = publicUrl;
            }

            const imgTag = `<img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
            finalContent = finalContent.replace(item.placeholder, imgTag);
        } else {
            console.warn("⚠️ Image generation failed for:", item.filename);

            // Fallback logic
            let fallbackUrl = '';
            // Reuse images from previous runs since we know credentials are likely missing
            if (item.filename.includes('bottled-water')) fallbackUrl = '/images/articles/greek-coffee-briki-1770547681033.png'; // Pro tem - using beverage image
            else if (item.filename.includes('shaded-sunbed')) fallbackUrl = '/images/articles/best_value_pool_shade_1770577441890.png'; // Perfect match
            else if (item.filename.includes('light-grilled-chicken')) fallbackUrl = '/images/articles/best_value_simple_food_1770577456641.png'; // Perfect match
            else if (item.filename.includes('eczane')) fallbackUrl = '/images/articles/eczane-pharmacy-sign-turkey-street-1767987110935.jpg'; // Reused
            else if (item.filename.includes('packing-essentials')) fallbackUrl = '/images/articles/travel-checklist-notebook-authentic-1767985612952.jpg'; // Reused
            else if (item.filename.includes('relaxed-traveller')) fallbackUrl = '/images/articles/turkey-family-all-inclusive-pool-happy-1770578680608.jpg'; // Reused from family

            // Better fallbacks if available
            if (item.filename.includes('bottled-water')) fallbackUrl = '/images/articles/guest_relations_reservation_1770577154600.png'; // Maybe restaurant setting?
            // Actually, let's use:
            // Bottled Water -> maybe just ignore or use a generic one? I'll use `calm_restaurant_atmosphere`?
            if (item.filename.includes('bottled-water')) fallbackUrl = '/images/articles/calm_restaurant_atmosphere_1770577199013.png';

            if (fallbackUrl) {
                const imgTag = `<img src="${fallbackUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
                finalContent = finalContent.replace(item.placeholder, imgTag);
            } else {
                finalContent = finalContent.replace(item.placeholder, '');
            }

            // Fallback Cover Logic
            if (!coverImageUrl) {
                if (item.filename.includes('shaded-sunbed')) coverImageUrl = fallbackUrl;
            }
        }
    }

    // Double check cover image
    if (!coverImageUrl) {
        coverImageUrl = '/images/articles/best_value_pool_shade_1770577441890.png'; // Shaded pool is perfect for "Staying Well"
    }

    // Insert into DB
    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Sağlıklı Kalmak: Su, Yemek ve Sıcaklık İpuçları (TR Pasif)" },
        meta_description: { en: ARTICLE_DATA.meta_description, tr: "TR Pasif içerik." },
        content: { en: finalContent, tr: "<p>Bu içerik sadece İngilizce dilinde yayındadır.</p>" },
        cover_image_url: coverImageUrl,
        published_at: ARTICLE_DATA.published_at,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });

    if (error) {
        console.error("❌ DB Insert Failed:", error);
    } else {
        console.log("✅ Staying Well Article Added Successfully!");
        console.log("👉 Slug:", ARTICLE_DATA.slug);
    }
}

run();
