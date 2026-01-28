
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
// "Details / Checklist" style
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
    slug: "hidden-costs-in-turkey-resorts-what-uk-travellers-get-surprised-by-all-inclusive-reality-check",
    title: "Hidden Costs in Turkey Resorts: What UK Travellers Get Surprised By (All-Inclusive Reality Check)",
    meta_description: "All-inclusive in Turkey can be excellent value — but UK travellers sometimes get surprised by extras. This guide lists the most common hidden costs (restaurants, drinks, transfers, spa, activities, room upgrades, beach extras), shows how to spot them early.",
    prompts: [
        "A close-up of a hotel bill showing extra charges, with a person looking thoughtful, checking details.",
        "A premium cocktail on a bar table with a menu showing prices next to it, evening resort vibe.",
        "A crowded hotel reception with people checking in, luggage, busy atmosphere but calm lighting.",
        "A beautiful spa reception entrance with a price list visible, relaxing but exclusive feel.",
        "A family looking at a menu board outside a restaurant at a resort, discussing options."
    ],
    // Provided content 
    content: `
<h1>Hidden Costs in Turkey Resorts: What UK Travellers Get Surprised By (All-Inclusive Reality Check)</h1>

<p><strong>Quick answer:</strong> Turkey all-inclusive resorts can be fantastic — but “all-inclusive” rarely means literally everything. The most common surprises for UK travellers are: à la carte restaurant charges or limits, premium drinks, spa treatments, paid activities, transfers not included, and room/location upgrades that change the holiday feel. The fix is simple: ask a short set of questions before you book, and you’ll avoid almost all surprises.</p>

<p><em>Note: This guide is not about fear or negativity — it’s a practical “avoid surprises” checklist so your holiday stays smooth and enjoyable.</em></p>

<!-- IMG_0 -->

<h2>First: what “hidden costs” really are</h2>
<p>Most “hidden costs” aren’t scams. They’re usually one of these:</p>
<ul>
  <li>an extra feature that’s optional</li>
  <li>a premium version of something that exists in a basic included form</li>
  <li>a booking-type difference (package vs separate, standard vs ultra style)</li>
  <li>a timing rule (included only at certain hours)</li>
</ul>
<p><strong>Simple rule:</strong> If you know the rules, there are no surprises.</p>

<h2>The UK mindset: you want a clean holiday budget</h2>
<p>UK travellers usually want one of two things:</p>
<ul>
  <li>A fixed-feeling holiday (spend little on-site)</li>
  <li>A flexible holiday (spend on a few upgrades intentionally)</li>
</ul>
<p>Both are great. Problems happen when you want “fixed” but book “flexible” without knowing it.</p>
<p><strong>UK-friendly tip:</strong> Decide upfront: “Are we aiming to spend almost nothing on-site, or are we happy to spend on 2–3 planned extras?” That one decision makes everything clearer.</p>

<!-- IMG_1 -->

<h2>1) À la carte restaurants: the #1 surprise</h2>
<p>Many UK travellers assume all restaurants are included. Often, the main buffet is fully included, while à la carte restaurants may be:</p>
<ul>
  <li>included but limited (e.g., one visit per stay)</li>
  <li>included only for longer stays</li>
  <li>available with a surcharge</li>
  <li>available with reservation limits (prime slots fill)</li>
</ul>
<p><strong>Simple rule:</strong> Ask “How many à la carte visits are included for our stay — and which restaurants count?”</p>
<p>Deep guide: <a href="/en/guide/a-la-carte-restaurants-in-turkey-all-inclusive-how-it-works">A La Carte Restaurants in All-Inclusive: How It Works</a></p>

<h2>2) Drinks: standard vs premium (and timing rules)</h2>
<p>All-inclusive usually covers standard drinks, but “premium” categories can be extra:</p>
<ul>
  <li>imported spirits</li>
  <li>certain wines/champagnes</li>
  <li>premium cocktails</li>
  <li>minibar upgrades</li>
  <li>some branded items (depends on the resort policy)</li>
</ul>
<p>Sometimes the surprise is not “extra cost” but “included only at certain times”.</p>
<p><strong>Simple rule:</strong> Ask “Which drinks are included, and are there any time limits?”</p>
<p><strong>UK-friendly tip:</strong> If you’re not a big drinker, don’t pay more for premium drink packages. Spend on room comfort instead.</p>

<h2>3) Transfers: included in package or separate?</h2>
<p>One of the biggest surprises happens before you even arrive: transfers.</p>
<p>Possible situations:</p>
<ul>
  <li>included in package</li>
  <li>offered as an add-on</li>
  <li>not included if you booked flights and accommodation separately</li>
  <li>included but shared (not private)</li>
</ul>
<p><strong>Simple rule:</strong> If you care about smooth arrival, confirm transfers before paying.</p>
<p>Transfer guide: <a href="/en/guide/resort-transfers-in-turkey-reliable-options-and-what-to-avoid-uk-guide">Resort Transfers in Turkey: Reliable Options and What to Avoid</a></p>

<h2>4) Spa and wellness: usually extra (but easy to plan for)</h2>
<p>Spa access and treatments vary. Common patterns:</p>
<ul>
  <li>basic facilities may be included</li>
  <li>treatments are often extra</li>
  <li>packages and upgrades can add up quickly</li>
</ul>
<p><strong>Simple rule:</strong> Treat spa as a planned extra, not an “included” assumption.</p>
<p><strong>UK-friendly tip:</strong> If spa is a key part of your holiday, budget for it intentionally — then it feels like a highlight, not a surprise.</p>

<!-- IMG_2 -->

<h2>5) Activities and water sports: what’s included vs what’s paid</h2>
<p>Resorts may include basic activities (fitness classes, some sports) and evening entertainment. Often paid: motorised water sports, special excursions, certain sports lessons, and premium experiences.</p>
<p><strong>Simple rule:</strong> Ask “Which activities are included daily, and which are paid add-ons?”</p>

<h2>6) Kids’ club and family extras (families: read this)</h2>
<p>Most family resorts include kids’ clubs, but extras can exist: private babysitting, special lessons, some “paid play” add-ons.</p>
<p><strong>Simple rule:</strong> If you need babysitting or specific child support, confirm it before booking.</p>
<p>Family guide: <a href="/en/guide/all-inclusive-turkey-for-families-uk-parent-checklist">All-Inclusive for Families: The Non-Negotiables</a></p>

<h2>7) Room upgrades: the cost that changes your whole holiday</h2>
<p>This is the “hidden cost” that can be worth paying — because it changes daily comfort. Common upgrade triggers: family room vs standard room, separate sleeping area, quieter location, sea view, access to calm zones.</p>
<p><strong>Simple rule:</strong> If you spend on anything, spend on sleep and comfort first.</p>
<p>Value guide: <a href="/en/guide/how-to-get-the-best-all-inclusive-value-in-turkey-from-the-uk">How to Get the Best All-Inclusive Value from the UK</a></p>

<h2>8) “Premium zones”: paid seating, cabanas, reserved areas</h2>
<p>Some resorts have paid cabanas, reserved beach/pool seating, or “VIP areas”. These aren’t essential — but if the resort is busy, they can tempt people.</p>
<p><strong>Simple rule:</strong> Don’t budget for these unless you know you’ll use them. You can still have an amazing holiday without VIP seating.</p>

<h2>9) Mini bar rules: included… or not exactly</h2>
<p>Mini bar surprises can happen if only water is free, restocking rules are limited, or premium items are charged.</p>
<p><strong>Simple rule:</strong> Ask “What’s included in the minibar, and how does restocking work?”</p>

<!-- IMG_3 -->

<h2>10) Laundry, late checkout, and “convenience costs”</h2>
<p>These small costs can add up: laundry services, late checkout, room service rules.</p>
<p><strong>Simple rule:</strong> Plan one “convenience buffer” in your budget so you don’t feel annoyed by small charges.</p>

<h2>11) Excursions and tours: optional but common spend</h2>
<p>Even if your resort is perfect, many UK travellers still book a boat day or a cultural outing. These aren’t “hidden” — but they’re often forgotten during budgeting.</p>
<p><strong>Simple rule:</strong> If you want 1–2 excursions, budget for them upfront so it feels intentional.</p>
<p>Package vs DIY planning: <a href="/en/guide/package-holiday-vs-booking-separately-for-turkey-uk-cost-comparison-framework">Package Holiday vs Booking Separately for Turkey</a></p>

<h2>12) How to read bills and avoid awkward checkout moments</h2>
<p>Most surprises happen because people don’t check as they go.</p>
<p><strong>The simple habit:</strong> keep notes of anything you charge to your room, ask politely if something is included before you say yes, and check your account once mid-week if you’re using extras.</p>
<p><strong>Simple rule:</strong> “Confirm before you commit” keeps everything calm.</p>

<h2>The 12 questions that prevent 95% of surprises (copy-paste)</h2>
<p>Use these before booking or at check-in:</p>
<ul>
  <li>“What exactly is included in all-inclusive for our booking (meals, snacks, drinks)?”</li>
  <li>“Are there time limits for snacks or drinks?”</li>
  <li>“How many à la carte visits are included, and which restaurants count?”</li>
  <li>“Are any restaurants always paid?”</li>
  <li>“Which drinks are included vs premium?”</li>
  <li>“Is minibar included, and how does restocking work?”</li>
  <li>“Are transfers included in our package — and are they private or shared?”</li>
  <li>“Which activities are included daily, and which are paid?”</li>
  <li>“Is spa access included, and are treatments extra?”</li>
  <li>“Are there paid cabanas or premium seating areas?”</li>
  <li>“Are kids’ clubs included, and is babysitting available (paid)?”</li>
  <li>“Which room upgrades improve sleep/quiet, and what do they cost?”</li>
</ul>
<p><strong>UK-friendly tip:</strong> If a resort can answer these clearly, it’s usually well-organised.</p>

<!-- IMG_4 -->

<h2>Quick checklist: “no surprise” booking routine (UK)</h2>
<ul>
  <li>We know what’s included for food and drink ✅</li>
  <li>We understand à la carte rules ✅</li>
  <li>We know transfer plan and cost ✅</li>
  <li>We know what’s premium/paid (spa, activities, seating) ✅</li>
  <li>We chose the right room type for comfort ✅</li>
  <li>We budgeted for 1–2 optional extras (if we want them) ✅</li>
</ul>

<p><strong>Simple rule:</strong> Clarity is the real luxury.</p>

<h2>FAQ: Hidden costs in Turkey resorts (UK)</h2>

<h3>Is all-inclusive in Turkey really all-inclusive?</h3>
<p>It’s usually very comprehensive, especially for buffet meals and standard drinks, but it often doesn’t include every premium option. À la carte restaurants, premium drinks, spa treatments, and certain activities can be extra depending on the resort.</p>

<h3>What’s the most common surprise for UK travellers?</h3>
<p>À la carte rules (limits or surcharges) and premium drinks are the most common surprises, followed by transfers not being included in some bookings.</p>

<h3>Are these “extras” a bad sign?</h3>
<p>Not necessarily. Many resorts offer paid extras as optional upgrades. The key is knowing what’s included so you can choose intentionally.</p>

<h3>How do we avoid surprises completely?</h3>
<p>Ask the 12 questions in this guide before booking, and confirm any unclear points at check-in. If you do that, surprises are rare.</p>

<h3>Should we pay for upgrades?</h3>
<p>Only if they improve your daily comfort. Room layout and quiet positioning often give the best value. Premium seating and paid zones are optional and usually not necessary.</p>

<h3>Do families face different hidden costs?</h3>
<p>Sometimes. Babysitting, premium kids’ activities, and certain convenience services can be paid extras. Families get the best results by prioritising room layout, snack access, shade, and simple transfers.</p>

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
