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

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImageVertex(prompt: string, filename: string, retries = 3) {
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
                    parameters: { sampleCount: 1, aspectRatio: "16:9", safetySetting: "block_only_high", personGeneration: "allow_adult" }
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.warn(`⏳ Quota exceeded (429). Waiting 30s before retry ${attempt + 1}...`);
                    await sleep(30000);
                    continue;
                }
                throw new Error(`Vertex API Error: ${response.status}`);
            }

            const data = await response.json();
            if (!data.predictions?.[0]?.bytesBase64Encoded) throw new Error('No predictions');

            fs.writeFileSync(localPath, Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64'));
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
    slug: 'turkey-in-may-from-uk',
    title: 'Turkey in May from the UK: Weather by Region, Sea Feel & The Best Trip Styles (Balanced Holiday Guide)',
    meta_description: 'Turkey in May is a favourite for UK travellers because it often feels warm, bright, and easier to enjoy than peak summer heat. Use this UK-friendly guide to match May weather to the right base (Aegean vs Mediterranean vs Istanbul vs inland), plan beach vs sightseeing days, and pack smart — with FAQs and checklists.',
    primary_keyword: 'Turkey in May from the UK',
    content: `
<h1>Turkey in May from the UK: Weather, Sea Feel & The Best Bases for a Balanced Holiday</h1>

<p><strong>Quick answer:</strong> May is one of the most “balanced” months to visit Turkey from the UK. It often brings warm, bright days that suit both beach time and exploring — without the intensity of peak summer heat in many places. The smartest May plan is simple: choose your base by region (Aegean for a breezy mixed trip, Mediterranean for a stronger early-summer feel, Istanbul for a walkable city break), then pack for <strong>day warmth + cooler evenings</strong>.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>What May in Turkey feels like (in UK terms)</h2>
<p>May often feels like Turkey is switching into holiday mode:</p>
<ul>
  <li>More consistent sunshine than early spring</li>
  <li>Comfortable outdoor days for walking and day trips</li>
  <li>Evenings that can still feel cooler (especially if you’re near water or inland)</li>
</ul>

<p><strong>Simple rule:</strong> May is “warm days, flexible evenings” — pack a layer and you’ll be comfortable.</p>

<h2>May by region: where it fits your style best</h2>

<h3>Istanbul region (Marmara)</h3>
<ul>
  <li><strong>Best for:</strong> city breaks, food + neighbourhood exploring, museums, shopping</li>
  <li><strong>May vibe:</strong> very walkable and comfortable for full days out</li>
  <li><strong>Evenings:</strong> a light layer is still useful</li>
</ul>

<h3>Aegean Coast (west/southwest)</h3>
<ul>
  <li><strong>Best for:</strong> a balanced holiday (coast base + exploring + day trips)</li>
  <li><strong>May vibe:</strong> warm and bright with a fresher edge than peak summer</li>
  <li><strong>Great for:</strong> scenic drives, outdoor cafés, relaxed beach afternoons</li>
</ul>

<h3>Mediterranean Coast (south coast)</h3>
<ul>
  <li><strong>Best for:</strong> an earlier “summer feel” and more dependable warmth</li>
  <li><strong>May vibe:</strong> stronger beach/resort energy than many other regions</li>
  <li><strong>Great for:</strong> sun-led breaks, relaxed pool days, early-season all-inclusive</li>
</ul>

<h3>Inland & highland areas (central interiors)</h3>
<ul>
  <li><strong>Best for:</strong> landscapes, viewpoints, slow travel, culture-focused trips</li>
  <li><strong>May vibe:</strong> pleasant days with cooler mornings/evenings</li>
  <li><strong>Key point:</strong> bigger temperature swings than the coast</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you want “May warmth” without feeling cooked, Aegean-style bases can feel perfect.</p>

<h2>Sea feel in May (a realistic way to think about it)</h2>
<p>Instead of obsessing over sea temperature numbers, think in “how it feels” terms:</p>
<ul>
  <li><strong>Brisk-but-doable:</strong> you’ll swim once you’re in, but it’s refreshing</li>
  <li><strong>Comfortable for most:</strong> you can swim without psyching yourself up</li>
  <li><strong>Warm-feeling:</strong> it starts to feel like “proper summer sea”</li>
</ul>

<p>In May, many UK travellers experience the sea as <strong>refreshing</strong> rather than “bath warm” — and that’s part of the charm. Your exact experience depends on region, wind, time of day, and recent weather.</p>

<p><strong>Simple rule:</strong> If sea swimming is the main goal, plan your swim for midday when the sun is strongest.</p>

<h2>Best May trip styles (choose your May win)</h2>

<h3>1) The balanced holiday (beach + exploring)</h3>
<ul>
  <li>Beach afternoons + sightseeing mornings</li>
  <li>Day trips on the best-weather days</li>
  <li>Evenings out without extreme heat</li>
</ul>

<p>Base planning: <a href="/guide/how-to-choose-hotel-in-turkey-checklist-uk-guide">How to Choose Your Base in Turkey</a></p>

<h3>2) The early-summer resort break</h3>
<ul>
  <li>More “holiday mode” without peak-season intensity</li>
  <li>Perfect if you like sunshine but want calmer pacing</li>
  <li>Great for couples and families who want an easier rhythm</li>
</ul>

<p>All-inclusive timing: <a href="/guide/best-all-inclusive-value-uk-turkey">How to Get the Best All-Inclusive Value from the UK</a></p>

<h3>3) The walkable city break (with day trips)</h3>
<ul>
  <li>Long days out without the harshest heat</li>
  <li>Great for culture, food, and neighbourhoods</li>
  <li>Easy to build indoor “backup wins” if weather shifts</li>
</ul>

<p><strong>UK-friendly tip:</strong> May is a top month for travellers who want to do a lot without feeling exhausted.</p>

<h2>What to pack for Turkey in May (the “smart light” list)</h2>

<h3>Core capsule</h3>
<ul>
  <li>Light jacket/overshirt for evenings</li>
  <li>Comfortable walking shoes</li>
  <li>Sun essentials: sunglasses, sunscreen, hat</li>
  <li>Light rain backup (small, packable)</li>
  <li>One beach/pool outfit if coast-led</li>
</ul>

<h3>If you’re inland or doing early starts</h3>
<ul>
  <li>Add one warmer layer for cool mornings</li>
  <li>Bring socks you’re happy walking in all day</li>
</ul>

<p><strong>Simple rule:</strong> May packing is 80% “walking comfort” + 20% “sun holiday”.</p>

<p>Health routine: <a href="/guide/staying-healthy-in-turkey-uk-checklist">Staying Healthy in Turkey: Simple Rules</a></p>

<!-- IMAGE_PACKING_PLACEHOLDER -->

<h2>May day planning (so you get the best of every day)</h2>
<ul>
  <li><strong>Morning:</strong> sightseeing and walking (best energy)</li>
  <li><strong>Midday:</strong> relaxed lunch + shade break</li>
  <li><strong>Afternoon:</strong> beach/pool or a scenic spot</li>
  <li><strong>Evening:</strong> dinner out + easy stroll with a light layer</li>
</ul>

<p><strong>UK-friendly tip:</strong> In May, a simple day rhythm makes your trip feel effortlessly “premium”.</p>

<h2>Copy-paste planning prompts</h2>
<ul>
  <li>“We want a balanced holiday: beach afternoons + exploring mornings. Which base suits May best?”</li>
  <li>“We’re sensitive to heat. Should we choose Aegean-style weather or a warmer south coast base?”</li>
  <li>“We want to swim daily — what’s the best time of day in May?”</li>
  <li>“We want calm evenings out. Which areas feel most comfortable?”</li>
</ul>

<h2>FAQ: Turkey in May (UK travellers)</h2>

<h3>Is Turkey hot in May?</h3>
<p>May is often warm and sunny, but it’s typically less intense than peak summer. Your experience depends on region — southern coastal areas tend to feel more “summer-like” earlier, while other regions can feel pleasantly warm with cooler evenings.</p>

<h3>Can I have a proper beach holiday in May?</h3>
<p>Yes — especially if you’re happy with sunshine, beach time, and refreshing swims rather than guaranteed “bath warm” sea every day. Many travellers love May for this balanced feel.</p>

<h3>Which coast is better in May: Aegean or Mediterranean?</h3>
<p>Choose the Aegean if you want a breezy, balanced holiday with exploring. Choose the Mediterranean if you want a stronger early-summer feel and a more sun-led break.</p>

<h3>What should I pack for Turkey in May from the UK?</h3>
<p>Pack for warm days and cooler evenings: a light jacket/overshirt, walking shoes, sun essentials, and a small rain backup. Add swimwear if you’re coast-led.</p>

<h3>Is May good for all-inclusive trips?</h3>
<p>Yes — May can be a great time if you want a relaxed resort rhythm without peak-season intensity. Pick a base where you’ll enjoy the area beyond just pool time.</p>

<h3>How do I avoid weather disappointment in May?</h3>
<p>Choose your base by region, plan mornings for exploring and afternoons for relaxing, and pack one evening layer. May is mostly about smart comfort rather than extreme planning.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>
`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Turkey in May Guide Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-in-may-balanced-holiday-${timestamp}.jpg`,
            prompt: "A beautiful split composition showing Turkey in May. Left: A sunny Aegean beach with clear water. Right: A couple walking comfortably in a green, historic town street. Bright, fresh spring-summer transition vibe. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_ISTANBUL_PLACEHOLDER -->', // Note: I didn't put a placeholder for this in content, but I'll add one if needed or just generate. Wait, I should add placeholders to content or remove.
            // In the content above I missed adding specific placeholders for regions. I will add them to the array but only process if I add them to content.
            // Alternatively, I will stick to the placeholders I put in the content: COVER and PACKING.
            // The content doesn't have other placeholders like IMAGE_ISTANBUL_PLACEHOLDER.
            // To be better, I should inject 2-3 more images into the content.
            // I will proactively fix the content variable in this script to include placeholders.
            filename: `istanbul-may-street-walking-${timestamp}.jpg`,
            prompt: "People walking comfortably in a trendy Istanbul neighbourhood in May. Light jackets or t-shirts, sunny but soft light. Green trees, outdoor cafe tables. Authentic city break vibe."
        },
        {
            placeholder: '<!-- IMAGE_AEGEAN_PLACEHOLDER -->',
            filename: `aegean-coast-midday-swim-${timestamp}.jpg`,
            prompt: "A refreshing swim scene in an Aegean bay in May. Crystal clear water, rocky pine coast. Bright sun but not harsh heat haze. Inviting and natural. Authentic travel photo."
        },
        {
            placeholder: '<!-- IMAGE_EVENING_PLACEHOLDER -->',
            filename: `turkey-evening-dining-may-${timestamp}.jpg`,
            prompt: "Outdoor evening dining in a Turkish coastal town in May. Guests wearing light shawls or shirts. Warm string lights, twilight sky. Cozy and comfortable. Authentic atmosphere."
        },
        {
            placeholder: '<!-- IMAGE_PACKING_PLACEHOLDER -->',
            filename: `turkey-may-packing-essentials-${timestamp}.jpg`,
            prompt: "Flat lay of packing for Turkey in May. Sunglasses, a light denim jacket, comfortable trainers, and a passport. stylish and practical. Authentic travel prep."
        }
    ];

    let finalContent = ARTICLE_DATA.content;

    // Inject placeholders dynamically if I missed them in the raw string above, 
    // OR just use the replace logic carefully.
    // I will insert them into logical spots in `finalContent` before processing.

    finalContent = finalContent.replace('<h3>Istanbul region (Marmara)</h3>', '<!-- IMAGE_ISTANBUL_PLACEHOLDER -->\n<h3>Istanbul region (Marmara)</h3>');
    finalContent = finalContent.replace('<h2>Sea feel in May (a realistic way to think about it)</h2>', '<!-- IMAGE_AEGEAN_PLACEHOLDER -->\n<h2>Sea feel in May (a realistic way to think about it)</h2>');
    finalContent = finalContent.replace('<h2>Best May trip styles (choose your May win)</h2>', '<!-- IMAGE_EVENING_PLACEHOLDER -->\n<h2>Best May trip styles (choose your May win)</h2>');


    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        if (!item.placeholder.includes('COVER')) await sleep(5000);

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
            finalContent = finalContent.replace(item.placeholder, '');
        }
    }

    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Mayıs'ta Türkiye: Hava Durumu ve Gezi Rehberi (TR Pasif)" },
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
