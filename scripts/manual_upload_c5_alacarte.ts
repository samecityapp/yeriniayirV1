
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleAuth } from 'google-auth-library';

dotenv.config({ path: '.env.local' });

// --- CONFIGURATION ---
const IMAGEN_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const IMAGEN_LOCATION = 'us-central1';
const IMAGEN_MODEL_ID = 'imagen-3.0-generate-001';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // SERVICE ROLE for deletion
);

const ARTICLES_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'articles');
// "Quiet luxury" and refined dining style
const REALISM_SUFFIX = ", photorealistic style, natural lighting, shot on 35mm film, candid travel photography, authentic atmosphere, no filters, slightly imperfect composition for realism, 4k, highly detailed textures.";

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- IMAGEN 3 GENERATOR (Smart Resume) ---
async function generateImage(prompt: string, filenameBase: string): Promise<string | null> {
    const fullPrompt = prompt + REALISM_SUFFIX;

    // Check for ANY existing file
    const files = fs.readdirSync(ARTICLES_IMAGE_DIR);
    const existingFile = files.find(f => f.startsWith(filenameBase) && f.endsWith('.jpg'));
    if (existingFile) {
        console.log(`⏩ Exists: ${existingFile}`);
        return `/images/articles/${existingFile}`;
    }

    const timestamp = Date.now();
    const filename = `${filenameBase}-${timestamp}.jpg`;
    console.log(`🎨 Generating: ${filename}`);
    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);

    if (!fs.existsSync('google-credentials.json')) return null;

    const auth = new GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    try {
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        const url = `https://${IMAGEN_LOCATION}-aiplatform.googleapis.com/v1/projects/${IMAGEN_PROJECT_ID}/locations/${IMAGEN_LOCATION}/publishers/google/models/${IMAGEN_MODEL_ID}:predict`;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${accessToken.token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        instances: [{ prompt: fullPrompt }],
                        parameters: { sampleCount: 1, aspectRatio: "16:9", safetySetting: "block_only_high", personGeneration: "allow_adult" }
                    })
                });

                if (!response.ok) {
                    if (response.status === 429) {
                        console.warn(`⏳ 429 Quota Hit. Waiting 65s...`);
                        await sleep(65000);
                        continue; // Retry logic
                    }
                    console.warn(`⚠️ Blocked/Error: ${response.status}`);
                    return null;
                }

                const data = await response.json();
                if (!data.predictions || !data.predictions[0]) return null;

                const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
                fs.writeFileSync(localPath, buffer);
                console.log(`✅ Saved: ${localPath}`);
                console.log("⏳ Cooling down API (30s)...");
                await sleep(30000); // Cooldown after successful generation
                return `/images/articles/${filename}`;
            } catch (err) {
                if (attempt === 3) throw err;
            }
        }
    } catch (error) {
        console.error("Gen Failed:", error);
        return null;
    }
    return null;
}

// --- ARTICLE DATA ---
const articleData = {
    slug: "a-la-carte-restaurants-in-turkey-all-inclusive-how-it-works",
    title: "A La Carte Restaurants in Turkey All-Inclusive: How It Works (UK-Friendly No-Surprises Guide)",
    meta_description: "Confused about à la carte restaurants in Turkey all-inclusive resorts? This UK-friendly guide explains how it usually works: what’s included vs what’s extra, booking rules, dress codes, timing.",
    prompts: [
        "A quiet, elegant hotel restaurant table set for dinner with sea view at sunset, white tablecloth, wine glasses, romantic atmosphere, no people.",
        "A close up of a beautifully plated appetizer being served at a fine dining restaurant, warm lighting, blurred background.",
        "A family sitting at a round dining table in a nice restaurant, happy parents and kids, relaxed atmosphere, waiters in background.",
        "A shot of a guest holding a restaurant reservation card or tablet menu check-in desk, modern hotel lobby.",
        "A couple clinking wine glasses at a candlelit dinner, outdoor terrace, warm evening light, smart casual dress."
    ],
    // Provided content 
    content: `
<h1>A La Carte Restaurants in Turkey All-Inclusive: How It Works (UK-Friendly No-Surprises Guide)</h1>

<p><strong>Quick answer:</strong> In Turkey, “all-inclusive” usually covers the main buffet and standard snack spots, while à la carte restaurants are often a special add-on experience with rules: you may need a reservation, there may be a limited number of included visits (or a small surcharge), and popular time slots can fill quickly. The smartest approach is simple: treat à la carte as a planned highlight, not something you “figure out later”.</p>

<!-- IMG_0 -->

<h2>First: what “à la carte” means in a Turkey resort context</h2>
<p>In an all-inclusive resort, you’ll usually see two dining styles:</p>
<ul>
  <li><strong>Main restaurant (buffet):</strong> the default option, open daily, usually included</li>
  <li><strong>À la carte / specialty restaurants:</strong> themed dining experiences (often smaller, quieter, more “date night” feeling)</li>
</ul>

<p><strong>Simple rule:</strong> Buffet is your reliable daily engine. À la carte is your “special evening”.</p>

<h2>What UK travellers often misunderstand (so you won’t)</h2>

<h3>Misunderstanding #1: “All-inclusive means every restaurant is included.”</h3>
<p>Not always. Many resorts include the buffet and standard snack venues, while à la carte can be:</p>
<ul>
  <li>included but limited (e.g., “one visit per stay”)</li>
  <li>included only for longer stays</li>
  <li>included on specific nights</li>
  <li>available with a surcharge</li>
</ul>

<p><strong>Simple rule:</strong> Never assume à la carte is unlimited. Always check the exact rule for your booking.</p>

<h3>Misunderstanding #2: “We’ll just walk in.”</h3>
<p>Often you can’t. Reservations are common, especially at peak times.</p>

<p><strong>UK-friendly tip:</strong> If you care about à la carte, do your reservation plan on day 1. It’s the easiest win of the trip.</p>

<!-- IMG_1 -->

<h2>The most common à la carte models in Turkey all-inclusive (how it “usually” works)</h2>
<p>Resorts vary, but these are the typical patterns you’ll run into:</p>

<h3>Model A: Included, but limited</h3>
<ul>
  <li>You get a set number of à la carte visits per stay</li>
  <li>Often requires a reservation</li>
  <li>Prime slots can fill</li>
</ul>

<h3>Model B: Included for longer stays</h3>
<ul>
  <li>Short stays may not include it</li>
  <li>Longer stays may include one or more visits</li>
</ul>

<h3>Model C: Small surcharge per person</h3>
<ul>
  <li>Buffet is included daily</li>
  <li>À la carte is treated like a premium upgrade</li>
  <li>Reservation still required</li>
</ul>

<h3>Model D: Included, but with restrictions</h3>
<ul>
  <li>Specific restaurants included, others paid</li>
  <li>Specific days or times</li>
  <li>Certain menu items may be extra</li>
</ul>

<p><strong>Simple rule:</strong> Ask “How many visits are included for our stay, and which restaurants count?” That’s the clarity question.</p>

<h2>Reservations: the real game (and how to win it)</h2>
<p>If you want a smooth à la carte experience, treat reservations like theatre tickets: the best slots go first.</p>

<h3>What to do on Day 1</h3>
<ul>
  <li>Find out how reservations work (desk, app, QR code, guest services, etc.)</li>
  <li>Ask what time reservations open each day</li>
  <li>Book your preferred night early (especially for weekends and peak season)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Book one “special dinner” early in the trip — not on the last night. If anything changes, you still have time to adjust.</p>

<!-- IMG_2 -->

<h3>When to book</h3>
<ul>
  <li><strong>Peak season:</strong> book as soon as possible</li>
  <li><strong>Shoulder season:</strong> still book early if you care about a specific time</li>
</ul>

<p><strong>Simple rule:</strong> If a resort has limited seating, “later” becomes “no availability”.</p>

<h2>Dress code: what it typically means (without overthinking)</h2>
<p>Many resorts have a “smart casual” vibe for à la carte, even if the buffet is relaxed.</p>

<h3>Practical expectations (UK-friendly)</h3>
<ul>
  <li>A little more polished than poolside</li>
  <li>Footwear and cover-ups matter more</li>
  <li>Beachwear is usually not the vibe</li>
</ul>

<p><strong>Simple rule:</strong> Pack one “nice evening” outfit. You don’t need formal — just not beachwear.</p>

<h2>Food experience: how à la carte differs from buffet (so you pick the right nights)</h2>
<p>À la carte is often a different experience:</p>
<ul>
  <li>quieter atmosphere</li>
  <li>table service</li>
  <li>slower pace</li>
  <li>more “date night” feeling</li>
</ul>

<p>But it’s not automatically “better” than buffet — it’s different.</p>

<p><strong>Simple rule:</strong> Choose à la carte for atmosphere and pace, not because you assume buffet is inferior.</p>

<p><strong>UK-friendly tip:</strong> Many people enjoy buffet most nights, then do à la carte once or twice for variety and a special evening.</p>

<!-- IMG_3 -->

<h2>Kids and à la carte: what families should check</h2>
<p>Families can absolutely enjoy à la carte — but the rules can matter.</p>

<h3>Check these points</h3>
<ul>
  <li>Are children welcome at all à la carte venues?</li>
  <li>Are there kid-friendly menu options?</li>
  <li>Does the restaurant allow earlier seating times?</li>
  <li>Is the pace suitable for your child’s routine?</li>
</ul>

<p><strong>Simple rule:</strong> If you have toddlers, early seating matters more than “themed cuisine”.</p>

<p>Related: <a href="/en/guide/all-inclusive-turkey-for-families-uk-parent-checklist">All-Inclusive for Families: The Non-Negotiables</a></p>

<h2>“Included” vs “extra”: the simple way to avoid surprises</h2>
<p>Instead of trying to guess, use this checklist approach:</p>

<h3>Ask these five questions</h3>
<ul>
  <li>How many à la carte visits are included in our booking?</li>
  <li>Which restaurants count as “included”?</li>
  <li>Do we need a reservation — and how do we book?</li>
  <li>Are there any surcharges per person or for premium items?</li>
  <li>Are drinks included the same way as in the buffet restaurant?</li>
</ul>

<p><strong>Simple rule:</strong> If you have answers to these five, you will not be surprised.</p>

<p>Related: <a href="/en/guide/hidden-costs-in-turkey-resorts-for-uk-travellers">Hidden Costs in Turkey Resorts (What UK Travellers Get Surprised By)</a></p>

<h2>Best practice: how to get the best à la carte experience</h2>

<h3>1) Pick the right night</h3>
<ul>
  <li>Not your arrival night (you’ll be tired)</li>
  <li>Not your last night (risk of “no slots” or schedule stress)</li>
  <li>Choose a night you can keep calm and enjoy</li>
</ul>

<h3>2) Choose the right time</h3>
<ul>
  <li>Earlier seating = easier for families</li>
  <li>Later seating = better for couples who like slow evenings</li>
</ul>

<h3>3) Treat it like a highlight, not a default</h3>
<p>If you go in expecting it to be “the main way you’ll eat”, you might be disappointed if bookings are limited.</p>
<p><strong>Simple rule:</strong> Plan 1–2 à la carte nights, and let buffet cover the rest.</p>

<h3>4) Keep your expectations realistic</h3>
<p>À la carte is a holiday experience, not a Michelin competition. You’re paying for atmosphere, service, and variety.</p>

<!-- IMG_4 -->

<h2>Copy-paste questions (send these in a message or ask at check-in)</h2>
<ul>
  <li>“How many à la carte visits are included in our stay?”</li>
  <li>“Which restaurants are included vs paid?”</li>
  <li>“How do reservations work — and what time do bookings open?”</li>
  <li>“Are drinks included in à la carte the same as the main restaurant?”</li>
  <li>“Is there a dress code?”</li>
  <li>“Are children welcome, and is there an early seating option?”</li>
  <li>“If there’s a surcharge, is it per person or per table?”</li>
  <li>“What’s the best night to book if we want a calm atmosphere?”</li>
</ul>

<h2>Quick checklist: à la carte in Turkey all-inclusive (save this)</h2>
<ul>
  <li>Confirm “included vs extra” rules ✅</li>
  <li>Book your preferred night on Day 1 ✅</li>
  <li>Pack one smart-casual outfit ✅</li>
  <li>Decide if you want 1–2 highlight dinners or more ✅</li>
  <li>If travelling with kids: check early seating + menu ✅</li>
</ul>

<p><strong>Simple rule:</strong> Reservation + clarity = zero stress.</p>

<h2>FAQ: À la carte restaurants in Turkey all-inclusive</h2>

<h3>Are à la carte restaurants free in Turkey all-inclusive?</h3>
<p>Sometimes, but often with limits. Many resorts include the main buffet daily and offer à la carte as a limited included visit or with a small surcharge. Always check your booking details.</p>

<h3>Do I need to reserve à la carte restaurants?</h3>
<p>Usually yes, especially in peak season and for popular time slots. The safest approach is to ask how reservations work on Day 1 and book early.</p>

<h3>How many times can we use à la carte?</h3>
<p>It depends on the resort and your booking. Some include one visit per stay, some include more for longer stays, and some charge per visit.</p>

<h3>Is the dress code strict?</h3>
<p>Most places are “smart casual” rather than formal. The goal is simply to avoid beachwear. Pack one nice evening outfit and you’re covered.</p>

<h3>Are drinks included at à la carte?</h3>
<p>It depends. Some resorts include the same drinks as the main restaurant, while others have different rules for premium items. Ask specifically to avoid surprises.</p>

<h3>Can families use à la carte restaurants?</h3>
<p>Often yes, but check child policy, menu options, and seating times. For toddlers, an early seating option is usually the most important detail.</p>

<p><em>Last updated: ${new Date().toLocaleDateString('en-GB')}</em></p>
`
};

// --- EXECUTION ---
async function publish() {
    console.log(`🚀 PUBLISHING with SERVICE ROLE: ${articleData.title}`);

    // 1. DELETE DUPLICATE (Hard Delete)
    console.log(`🗑️ Deleting existing article with slug: ${articleData.slug}...`);
    const { error: delError } = await supabase.from('articles').delete().eq('slug', articleData.slug);

    if (delError) console.error("   ❌ Delete Failed:", delError);
    else console.log("   ✅ Delete command executed.");

    // 2. GENERATE IMAGES & INJECT
    let finalHtml = articleData.content;

    // Inject IMG_0 (Cover) early if it exists
    const coverUrl = await generateImage(articleData.prompts[0], `${articleData.slug}-remaster-0`);
    if (coverUrl) {
        if (finalHtml.includes('<!-- IMG_0 -->')) {
            // Standard injection
        } else {
            // Fallback injection if marker missing
            console.log("   ⚠️ IMG_0 marker missing, using DB cover_image_url only.");
        }
    }

    for (let i = 0; i < articleData.prompts.length; i++) {
        const filenameBase = `${articleData.slug}-remaster-${i}`;
        const url = await generateImage(articleData.prompts[i], filenameBase);

        if (url) {
            const imgHtml = `
<figure class="my-8">
  <img src="${url}" alt="Travel Image" class="w-full h-auto rounded-lg shadow-sm" />
</figure>`;
            const placeholder = `<!-- IMG_${i} -->`;
            if (finalHtml.includes(placeholder)) {
                finalHtml = finalHtml.replace(placeholder, imgHtml);
            }
        }
    }

    // 3. FINAL DB INSERT
    const payload = {
        slug: articleData.slug,
        title: { en: articleData.title, tr: `${articleData.title}(TR)` },
        content: { en: finalHtml, tr: "<p>TR pending</p>" },
        meta_description: { en: articleData.meta_description, tr: "TR pending" },
        cover_image_url: coverUrl, // Explicitly set cover
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_published: true
    };

    // UPSERT with onConflict
    const { error: upsertError } = await supabase.from('articles').upsert(payload, { onConflict: 'slug' });
    if (upsertError) {
        console.error("   ❌ DB Upsert Error:", upsertError);
    } else {
        console.log(`   ✅ SUCCESS: http://localhost:3000/en/guide/${articleData.slug}`);
    }
}

publish();
