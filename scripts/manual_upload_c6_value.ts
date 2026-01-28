
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
// "Value" and comfort style
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
    slug: "how-to-get-the-best-all-inclusive-value-in-turkey-from-the-uk",
    title: "How to Get the Best All-Inclusive Value in Turkey from the UK (Timing + Room Types + Simple Rules)",
    meta_description: "Want the best-value all-inclusive in Turkey from the UK without compromising comfort? Use this practical guide to time your trip smartly, choose the right room type, understand “value signals”, and avoid common add-on surprises.",
    prompts: [
        "A wide shot of a comfortable hotel balcony with a view of the sea and hotel gardens, inviting atmosphere, sunny day.",
        "A family room interior with separate beds, clean, modern design, luggage neatly packed, bright and airy.",
        "A comparison shot: Left side crowded pool, Right side quiet shaded garden area with loungers.",
        "A selection of fresh food at a high-quality buffet, colorful fruits, salads, clean presentation, chef in background.",
        "A happy couple walking on a pier at sunset, relaxed vibe, not crowded, enjoying the moment."
    ],
    // Provided content 
    content: `
<h1>How to Get the Best All-Inclusive Value in Turkey from the UK (Timing + Room Types + Simple Rules)</h1>

<p><strong>Quick answer:</strong> The best all-inclusive “value” from the UK is not just the lowest price — it’s the best cost-to-comfort result for your travel style. You get the strongest value when you (1) choose a month that matches your heat tolerance and holiday goals, (2) pick a room type that protects sleep and daily convenience, and (3) compare resorts by “value signals” (what you’ll actually use) rather than brochure extras. Use this guide to avoid overpaying for features you won’t use — and to spend on the upgrades that genuinely improve your holiday.</p>

<!-- IMG_0 -->

<h2>First: define “value” the UK way (so you don’t chase the wrong deal)</h2>
<p>UK travellers often say they want “best value”, but they usually mean one of these:</p>
<ul>
  <li><strong>Value = maximum ease:</strong> predictable meals, minimal decisions, stress-free days</li>
  <li><strong>Value = comfort per pound:</strong> good room, good sleep, good food, calm vibe</li>
  <li><strong>Value = family efficiency:</strong> kids are happy, parents can rest, no daily drama</li>
  <li><strong>Value = adults-only reset:</strong> quiet zones, refined evenings, low noise</li>
  <li><strong>Value = holiday content:</strong> you want activities, shows, sports, water features</li>
</ul>

<p><strong>Simple rule:</strong> Value isn’t a number. It’s the best match between your style and the resort’s set-up.</p>

<p><strong>UK-friendly tip:</strong> A “cheaper” deal that gives you poor sleep or long queues often costs you more in the only currency that matters on holiday: energy.</p>

<h2>Part 1: Timing — when “value” usually gets better (without making risky promises)</h2>
<p>There isn’t one perfect month for everyone. But value generally improves when your expectations match the season.</p>

<h3>1) Peak summer: pay for shade, pools, and evening comfort</h3>
<p>In the hottest months, value is about heat management:</p>
<ul>
  <li>strong shade options</li>
  <li>multiple pools or calmer zones</li>
  <li>easy snack/hydration access</li>
  <li>evenings that feel comfortable and enjoyable</li>
</ul>

<p><strong>Simple rule:</strong> In peak summer, you’re buying comfort design, not just a room.</p>
<p>If you love full summer energy, peak season can be brilliant — Turkey does summer holidays extremely well. Just be honest about heat tolerance and daily rhythm.</p>

<!-- IMG_1 -->

<h3>2) Shoulder season: value often feels “best” for mixed travellers</h3>
<p>Shoulder months (spring or autumn) often feel like a sweet spot if you want:</p>
<ul>
  <li>resort comfort plus exploring</li>
  <li>more comfortable walking</li>
  <li>calmer daily pace</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you want “holiday + a bit of adventure”, shoulder season usually gives you the best cost-to-experience ratio.</p>

<h3>3) Cooler months: value becomes “scenic + calm” rather than “pool-first”</h3>
<p>In cooler months, don’t judge value by summer features. Judge it by:</p>
<ul>
  <li>indoor comfort and atmosphere</li>
  <li>food quality</li>
  <li>relaxation and calm</li>
  <li>easy day trips or city/culture add-ons</li>
</ul>

<p><strong>Simple rule:</strong> In cooler months, value is about cosy quality, not water slides.</p>

<p>Related seasonal help: <a href="/en/guide/best-time-to-visit-turkey-from-uk">Best Time to Visit Turkey from the UK: Weather by Region</a></p>

<h2>Part 2: Booking timing — avoid the two classic UK mistakes</h2>
<p>The two biggest UK booking mistakes are:</p>

<h3>Mistake A: Booking too early without knowing your “non-negotiables”</h3>
<p>Booking early can be great — but only if you already know what matters to you (room type, vibe, transfers, food style).</p>

<h3>Mistake B: Booking too late and being forced into a compromise</h3>
<p>Last-minute can sometimes work, but families and specific-vibe travellers often lose value because:</p>
<ul>
  <li>the best room types disappear</li>
  <li>the quietest room locations aren’t available</li>
  <li>you end up paying more for less choice</li>
</ul>

<p><strong>Simple rule:</strong> Book when you have clarity — not when you’re emotionally panicking.</p>

<p><strong>UK-friendly tip:</strong> If you’re travelling with kids or you’re vibe-sensitive (quiet luxury vs party), earlier planning usually protects value because you secure the right type of stay.</p>

<h2>Part 3: Room types — the biggest hidden lever for value</h2>
<p>Many UK travellers overspend on resort “extras” while underinvesting in the one thing that determines daily happiness: the room set-up.</p>

<h3>Why room choice matters in all-inclusive</h3>
<p>You’ll be in your room more than you think:</p>
<ul>
  <li>early mornings</li>
  <li>nap time</li>
  <li>pre-dinner reset</li>
  <li>wind/heat breaks</li>
  <li>bedtime routines</li>
</ul>

<p><strong>Simple rule:</strong> In all-inclusive, a better room often gives more value than more “facilities”.</p>

<!-- IMG_2 -->

<h3>The practical room-type guide (what suits who)</h3>

<h4>1) Standard room</h4>
<ul>
  <li><strong>Best if:</strong> you’re out all day, you sleep easily, you’re a couple or travelling solo</li>
  <li><strong>Risk:</strong> can feel tight for families or longer stays</li>
</ul>

<h4>2) Family room / larger room</h4>
<ul>
  <li><strong>Best if:</strong> you have kids, you want less chaos, you need extra storage</li>
  <li><strong>Value win:</strong> less stress, easier mornings</li>
</ul>

<h4>3) Separate sleeping area / suite-style layout</h4>
<ul>
  <li><strong>Best if:</strong> naps and early bedtimes are non-negotiable, you want adults to have space in the evening</li>
  <li><strong>Value win:</strong> parents can relax after bedtime without sitting in darkness</li>
</ul>

<h4>4) Connecting rooms</h4>
<ul>
  <li><strong>Best if:</strong> you want real separation with kids, you’re travelling with older kids/teens</li>
  <li><strong>Value win:</strong> everyone sleeps better</li>
</ul>

<p><strong>UK-friendly tip:</strong> For families, paying for better room layout is often the single best “upgrade” you can make.</p>

<p>Related: <a href="/en/guide/all-inclusive-turkey-for-families-uk-parent-checklist">All-Inclusive for Families: The Non-Negotiables (UK Parent Checklist)</a></p>

<h2>Part 4: The “upgrade” truth — what’s usually worth it (and what often isn’t)</h2>
<p>Upgrades are not bad. The goal is to upgrade the right things.</p>

<h3>Upgrades that often deliver real value</h3>
<ul>
  <li>Better room layout (sleep + space)</li>
  <li>Quieter room positioning (if you’re noise-sensitive)</li>
  <li>Sea-view only if you’ll actually sit and enjoy it</li>
  <li>Access to calm zones if you’re choosing adults-only or couples reset vibes</li>
</ul>

<p><strong>Simple rule:</strong> Upgrades that protect sleep and calm almost always pay back.</p>

<h3>Upgrades that can be poor value (depending on your style)</h3>
<ul>
  <li>paying extra for restaurants you won’t use</li>
  <li>premium “extras” when you mostly want beach/pool simplicity</li>
  <li>luxury branding signals that don’t change your daily comfort</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you have a limited budget, spend it on room and calm first. “Fancy extras” only matter after that’s sorted.</p>

<p>Helpful context: <a href="/en/guide/all-inclusive-whats-included-turkey-guide">All-Inclusive in Turkey: What’s Included (and What Usually Isn’t)</a></p>

<h2>Part 5: Ultra all-inclusive vs standard all-inclusive (value comparison without hype)</h2>
<p>People often ask: is “ultra” worth it? The real answer: it depends on how you holiday.</p>

<h3>Standard all-inclusive usually suits you if:</h3>
<ul>
  <li>you’re happy with buffet + snack rhythm</li>
  <li>you don’t care about 24/7 service</li>
  <li>you’re out exploring sometimes</li>
</ul>

<h3>Ultra-style packages often suit you if:</h3>
<ul>
  <li>you love late nights and want more availability</li>
  <li>you want more dining variety included</li>
  <li>you want fewer “timing limits” around snacks and drinks</li>
</ul>

<p><strong>Simple rule:</strong> If your holiday day runs late (late dinners, late snacks), ultra-style can deliver value. If you’re an early-to-bed person, standard may be perfect.</p>

<p>Optional deep-dive: <a href="/en/guide/ultra-all-inclusive-in-turkey-explained-expectations-uk-guide">Ultra All Inclusive Explained</a></p>

<!-- IMG_3 -->

<h2>Part 6: Compare resorts by “value signals” (not by sales language)</h2>
<p>Here’s the no-nonsense way to compare options without getting lost.</p>

<ul>
  <li><strong>Value signal #1: Daily convenience:</strong> snacks and drinks easy to access, short walks, shade and seating that doesn’t feel like a competition</li>
  <li><strong>Value signal #2: Food reliability:</strong> can you eat well every day? are simple options consistently available?</li>
  <li><strong>Value signal #3: Sleep and noise control:</strong> quiet zones exist, room locations can be calm</li>
  <li><strong>Value signal #4: “Your vibe” matches the property:</strong> the wrong vibe is the biggest value killer</li>
  <li><strong>Value signal #5: Leaving the resort is easy:</strong> if you want mixed days, don’t book a remote set-up</li>
</ul>

<p>Adults-only vibe help: <a href="/en/guide/adults-only-all-inclusive-turkey-guide-quiet-vs-party">Adults-Only All-Inclusive: How to Choose (Quiet Luxury vs Party Resorts)</a></p>

<h2>Part 7: Hidden costs — the “surprise” list UK travellers should check</h2>
<p>All-inclusive value is strongest when you know what’s included.</p>

<h3>Common “extras” to ask about</h3>
<ul>
  <li>à la carte restaurants (included visits vs surcharge)</li>
  <li>premium drinks or imported items</li>
  <li>spa treatments</li>
  <li>water sports or special activities</li>
  <li>airport transfers (included in package vs separate)</li>
  <li>paid “upgraded zones” (cabana-style, premium seating, etc.)</li>
</ul>

<p><strong>Simple rule:</strong> Ask the “what’s extra?” question before you book — not when you arrive.</p>

<p>Read next: <a href="/en/guide/hidden-costs-in-turkey-resorts-for-uk-travellers">Hidden Costs in Turkey Resorts (What UK Travellers Get Surprised By)</a></p>

<h2>Part 8: Value by traveller type (choose your strategy)</h2>
<ul>
  <li><strong>UK Family:</strong> room layout first, kids’ food reliability, shade + pool practicality, transfer simplicity. <em>(For families, “easy days” are the luxury.)</em></li>
  <li><strong>Couple:</strong> calm zones + sleep quality, pleasant evenings, 1–2 planned highlights.</li>
  <li><strong>Adults-only:</strong> pick vibe correctly (quiet vs party), confirm entertainment times.</li>
  <li><strong>Resort-only:</strong> choose the resort with the best on-site variety.</li>
  <li><strong>Mixed-day:</strong> choose a region that supports short outings, don’t book remote.</li>
</ul>

<!-- IMG_4 -->

<h2>Part 9: Copy-paste questions (use these to compare deals properly)</h2>
<ul>
  <li>“What’s included in all-inclusive for our specific booking (meals, snacks, drinks timings)?”</li>
  <li>“Are any restaurants or experiences extra cost?”</li>
  <li>“How many à la carte visits are included, if any?”</li>
  <li>“What room type best protects sleep for (couple / family with ages __)?”</li>
  <li>“Is there a quiet pool or quiet zone?”</li>
  <li>“What time does entertainment usually finish?”</li>
  <li>“Are transfers included in the package or separate?”</li>
  <li>“If we want to leave the resort 2–3 times, is that easy from this area?”</li>
  <li>“Which upgrade gives the biggest comfort benefit for our style?”</li>
</ul>

<h2>The UK “Best Value” Checklist (save this)</h2>
<h3>Tick these before you book:</h3>
<ul>
  <li><strong>Timing:</strong> We chose a month that matches our heat tolerance ✅</li>
  <li><strong>Room:</strong> We chose a room type that protects sleep & prioritised layout over extras ✅</li>
  <li><strong>Comfort:</strong> Shade, pools, and snack access look easy ✅</li>
  <li><strong>Vibe:</strong> The vibe matches us (quiet / romantic / lively) ✅</li>
  <li><strong>Money:</strong> We know what’s included vs extra (transfers, à la carte) ✅</li>
</ul>

<p><strong>Simple rule:</strong> If you can tick most of these, your “value” will feel excellent.</p>

<h2>FAQ: Best all-inclusive value in Turkey from the UK</h2>

<h3>What’s the best way to get value on a Turkey all-inclusive?</h3>
<p>Define your travel style, choose a season that matches it, then prioritise room layout and daily convenience. Value comes from comfort and rhythm, not just a low price.</p>

<h3>Is it better to book early or late from the UK?</h3>
<p>It depends. Early planning often protects value for families and vibe-specific travellers because the best room types and calm options are available. Late booking can work if you’re flexible on room type and vibe.</p>

<h3>Are room upgrades worth it?</h3>
<p>Often yes — especially upgrades that improve sleep, space, and calm (family rooms, separate sleeping areas, quieter positioning). These upgrades change your day-to-day comfort more than “extra features” you might not use.</p>

<h3>Is ultra all-inclusive worth it?</h3>
<p>It can be if you value late-night availability and fewer timing limits. If you’re an early-to-bed traveller and mostly use buffet and daytime snacks, standard all-inclusive can be great value.</p>

<h3>How do I avoid hidden costs?</h3>
<p>Ask what’s extra before booking: à la carte rules, premium items, spa treatments, activities, and transfers. Clarity is what protects value.</p>

<h3>Which matters more: region or resort?</h3>
<p>Both matter, but for value, the resort’s daily convenience and your room type often matter more than the region name. Choose a region that matches your vibe, then choose a resort set-up that matches your routine.</p>

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
