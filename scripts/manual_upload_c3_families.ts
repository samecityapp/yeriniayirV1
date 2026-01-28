
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
    slug: "all-inclusive-turkey-for-families-uk-parent-checklist",
    title: "All-Inclusive for Families in Turkey: The Non-Negotiables (UK Parent Checklist)",
    meta_description: "Booking an all-inclusive family holiday in Turkey from the UK? Use this practical parent checklist to choose the right resort area and set-up without surprises: food, room layout, pools, kids’ clubs.",
    prompts: [
        "A happy UK family (mum, dad, two young kids) at a Turkish resort pool, sunny day, colorful swimsuits, laughing, authentic holiday moment.",
        "A close up of a child eating plain pasta and fruit at a buffet restaurant, high chair, messy face, happy parent supervised.",
        "A modern family hotel room interior with a separate sleeping area for kids, warm lighting, tidy, balcony visible.",
        "A colorful kids splash pool with shade sails overhead, shallow water, safe design, sunny Turkey background.",
        "A relaxed family arrival scene in a hotel lobby, cool drinks, reception desk, stress-free atmosphere."
    ],
    // Provided content 
    content: `
<h1>All-Inclusive for Families in Turkey: The Non-Negotiables (UK Parent Checklist)</h1>

<p><strong>Quick answer:</strong> The best family all-inclusive in Turkey isn’t about “luxury extras” — it’s about smooth daily life. UK parents usually have the same non-negotiables: predictable food, shade and snacks, pools that work for your child’s age, a room set-up that lets adults rest after bedtime, and a transfer plan that doesn’t melt everyone on arrival. Use this checklist to choose confidently and avoid the classic family-holiday surprises.</p>

<!-- IMG_0 -->

<h2>Start with the family reality check (before you look at photos)</h2>
<p>Families often book all-inclusive thinking it guarantees “easy”. It can — but only if the set-up matches your children’s ages and your routine.</p>

<p><strong>Simple rule:</strong> Choose the resort set-up that protects sleep, snacks, and shade. Everything else is a bonus.</p>

<h3>Pick your family profile</h3>
<ul>
  <li><strong>Baby/toddler family (0–3):</strong> naps, shade, early nights, easy food, calm pools</li>
  <li><strong>Young kids (4–8):</strong> splash pools, kids’ club, short activities, easy evenings</li>
  <li><strong>Older kids/teens:</strong> activities, sports, independence, fast Wi-Fi, evening options</li>
  <li><strong>Mixed ages:</strong> you need “zoned” facilities (quiet areas + active areas)</li>
</ul>

<p><strong>UK-friendly tip:</strong> If your kids are under 6, prioritise layout and convenience over “wow factor”. Big resorts only help if they’re easy to navigate.</p>

<h2>Non-negotiable #1: Food that actually works for UK kids</h2>
<p>All-inclusive food can be excellent — but for families, the question is: Will my child reliably eat something every day without drama?</p>

<h3>What to check</h3>
<ul>
  <li>Kid-safe staples available daily (plain pasta/rice/potatoes, simple proteins, fruit, yoghurt)</li>
  <li>Flexible meal timing (early dinner options or always-available snacks)</li>
  <li>Snack access between meals (not just “set hours” with long gaps)</li>
  <li>Allergy and dietary handling (clear labelling or staff who can help)</li>
</ul>

<p><strong>Simple rule:</strong> If your child is picky, you want a resort where “plain” food is normal, not something you have to negotiate.</p>

<!-- IMG_1 -->

<p><strong>UK-friendly tip:</strong> A place that does “family routine” well usually has:</p>
<ul>
  <li>breakfast that’s not stressful,</li>
  <li>a reliable midday option,</li>
  <li>snacks that don’t require a hike,</li>
  <li>and dinner that starts early enough for young kids.</li>
</ul>

<p>Related: <a href="/en/guide/all-inclusive-whats-included-turkey-guide">All-Inclusive in Turkey: What’s Included</a></p>

<h2>Non-negotiable #2: Room set-up (this is where holidays are won or lost)</h2>
<p>For parents, the room is not just a room — it’s your recovery zone.</p>

<h3>What UK families often need</h3>
<ul>
  <li>A set-up where kids can sleep while adults still have space (even a small separation helps)</li>
  <li>Enough storage so the room doesn’t become chaos by day 2</li>
  <li>Quiet at night (or at least predictable noise patterns)</li>
</ul>

<h3>Room-type reality check (no hotel names, just logic)</h3>
<ul>
  <li><strong>Standard room:</strong> can work for older kids or very short stays</li>
  <li><strong>Family room:</strong> usually best for 1–2 kids</li>
  <li><strong>Connecting rooms / separate sleeping area:</strong> best for sleep-sensitive families</li>
  <li><strong>Suite-style layout:</strong> great if naps and early bedtimes are part of the trip</li>
</ul>

<p><strong>Simple rule:</strong> If naps matter, you need a room layout that lets at least one adult stay “awake” without sitting in the dark in silence.</p>

<!-- IMG_2 -->

<p><strong>UK-friendly tip:</strong> If you’re travelling with a baby/toddler, a balcony or small outdoor sitting area can be a game-changer for evenings.</p>

<h2>Non-negotiable #3: Pools that match your child’s age (not just “lots of pools”)</h2>
<p>Families often get distracted by huge pool photos. What matters is the right pool for the right age.</p>

<h3>What to check by age</h3>
<ul>
  <li><strong>0–3:</strong> shallow splash area, shade near water, calm zones, easy changing</li>
  <li><strong>4–8:</strong> safe slides/splash features, lifeguard presence (if available), clear rules</li>
  <li><strong>9–15:</strong> bigger slides/activities, sports, places to hang out</li>
</ul>

<p><strong>Simple rule:</strong> One perfect kid pool beats five pools you don’t feel comfortable using.</p>

<p><strong>UK-friendly tip:</strong> Shade access at the pool is part of safety and comfort — don’t treat it as a luxury extra.</p>

<!-- IMG_3 -->

<h2>Non-negotiable #4: Shade, heat comfort, and “midday survival”</h2>
<p>Turkey in warm months is real summer. Families enjoy it most when midday has a plan.</p>

<h3>The family-friendly daily rhythm</h3>
<ul>
  <li><strong>Morning:</strong> active pool/beach time, excursions, kids’ club start</li>
  <li><strong>Midday:</strong> lunch + shade + nap/quiet time</li>
  <li><strong>Late afternoon:</strong> pool/beach again</li>
  <li><strong>Evening:</strong> dinner + easy walk</li>
</ul>

<p><strong>Simple rule:</strong> Midday rest isn’t wasted time — it buys you a happy evening.</p>

<p>Related: <a href="/en/guide/staying-healthy-in-turkey-uk-checklist">Staying Healthy in Turkey: Simple Rules</a></p>

<h2>Non-negotiable #5: Kids’ club quality (and whether your child will actually go)</h2>
<p>Kids’ clubs can be brilliant — but the question is: Will your child use it?<br>
Some kids love it. Others refuse after 10 minutes.</p>

<h3>What to check</h3>
<ul>
  <li>Age group split (so your child isn’t “too old” or “too young” for the group)</li>
  <li>Indoor option for hot or windy days</li>
  <li>Clear timings and drop-off rules (especially for younger ages)</li>
  <li>Evening mini-disco / family entertainment style (if you care about it)</li>
</ul>

<p><strong>Simple rule:</strong> For younger kids, you’re not buying “activities” — you’re buying parent breathing space.</p>

<p><strong>UK-friendly tip:</strong> If you have one shy child and one outgoing child, choose a resort with multiple activity types so both can win.</p>

<h2>Non-negotiable #6: Beach access and beach “ease”</h2>
<p>Beach looks can be misleading. Families need a beach that’s practical.</p>

<h3>What makes a beach family-friendly</h3>
<ul>
  <li>Easy access (not a long shuttle process every time)</li>
  <li>Shade and toilets nearby</li>
  <li>Calm entry for little ones (where possible)</li>
  <li>Snack/water access without major effort</li>
</ul>

<p><strong>Simple rule:</strong> A beach you can use at 10am and 4pm comfortably is better than a “prettier” beach that’s inconvenient.</p>

<p>Optional read: <a href="/en/guide/private-beach-turkey-what-to-expect">Private Beach in Turkey: What to Expect</a></p>

<h2>Non-negotiable #7: Transfers that don’t ruin day 1</h2>
<p>Arrivals with kids can make or break the first 24 hours.</p>

<h3>What to plan</h3>
<ul>
  <li>If you land late, choose a set-up with the simplest transfer</li>
  <li>Build an “arrival survival kit” (snacks, wipes, change of clothes, water)</li>
  <li>Keep day 1 expectations low</li>
</ul>

<p><strong>Simple rule:</strong> With kids, transfer simplicity beats everything on arrival day.</p>

<p>Related: <a href="/en/guide/resort-transfers-turkey-reliable-options-and-what-to-avoid">Resort Transfers in Turkey: Reliable Options and What to Avoid</a></p>

<!-- IMG_4 -->

<h2>Non-negotiable #8: Safety and “parent peace of mind”</h2>
<p>This isn’t about fear — it’s about smooth confidence.</p>

<h3>What to check</h3>
<ul>
  <li>Clear pool rules and visible supervision norms</li>
  <li>Safe walkways/stairs for prams (if relevant)</li>
  <li>Basic first-aid access and a plan if someone feels unwell</li>
  <li>24/7 reception or reliable help availability</li>
</ul>

<p><strong>Simple rule:</strong> Parents relax when help feels available quickly, even if you never need it.</p>

<h2>Non-negotiable #9: The “extras” that catch UK families out</h2>
<p>All-inclusive value depends on what’s truly included.</p>

<h3>Ask these before you book</h3>
<ul>
  <li>Are some snacks/drinks only at certain times?</li>
  <li>Are some restaurants/areas “extra”?</li>
  <li>Are kids’ activities included or pay-per-use?</li>
  <li>Are transfers included in your package or separate?</li>
  <li>Is room upgrade value worth it for your family routine?</li>
</ul>

<p>Read next: <a href="/en/guide/hidden-costs-in-turkey-resorts-for-uk-travellers">Hidden Costs in Turkey Resorts (What UK Travellers Get Surprised By)</a></p>

<h2>Copy-paste question list (use when comparing resorts/areas)</h2>
<p>Copy and paste these into messages or calls:</p>
<ul>
  <li>“We’re travelling with kids aged __. Which resort areas suit a family routine best?”</li>
  <li>“Is there a shallow splash pool and shade near it?”</li>
  <li>“What food options are reliably available for picky kids?”</li>
  <li>“Do you have family rooms or separate sleeping areas?”</li>
  <li>“What time does dinner start, and are snacks available between meals?”</li>
  <li>“How long is the transfer from the airport typically, and what are the options?”</li>
  <li>“Is kids’ club split by age and is there an indoor option?”</li>
  <li>“Are any restaurants or activities extra cost?”</li>
</ul>

<h2>The UK Parent Checklist (save this)</h2>
<h3>Must-haves (tick these)</h3>
<ul>
  <li>Food staples + snack access ✅</li>
  <li>Room layout that protects sleep ✅</li>
  <li>Pools that match your child’s age ✅</li>
  <li>Shade plan for midday ✅</li>
  <li>Transfer plan that won’t drain day 1 ✅</li>
  <li>Kids’ club that fits your child (or accept you won’t use it) ✅</li>
  <li>Beach set-up that’s practical ✅</li>
  <li>Clear “what’s included” answers ✅</li>
</ul>

<p><strong>Simple rule:</strong> If you can tick 7 out of 8, you’re in a great place.</p>

<h2>FAQ: All-inclusive for families in Turkey (UK)</h2>

<h3>Is Turkey all-inclusive good for families?</h3>
<p>Yes, it can be excellent for families because it reduces daily decisions: meals, snacks, and facilities are built in. The best results come from choosing a set-up that matches your child’s age and your routine.</p>

<h3>What’s the biggest mistake UK parents make?</h3>
<p>Booking based on photos alone. The real wins are practical: room layout, snack timing, shade, and easy access to pools/beach.</p>

<h3>Is all-inclusive better than half-board for families?</h3>
<p>All-inclusive often feels easier with children because snacks and drinks are part of the rhythm, not an extra decision. Half-board can work well if you enjoy going out daily and your kids handle flexible meals easily.</p>

<h3>What should we prioritise for toddlers?</h3>
<p>Shade, naps, room layout, predictable food, and short walking distances. Toddlers don’t care about “wow” features — they care about routine.</p>

<h3>How do we avoid surprises on arrival day?</h3>
<p>Choose the simplest transfer option, keep day 1 light, and bring an arrival kit (snacks, water, wipes, change of clothes). Your first evening should be easy.</p>

<h3>Are there hidden costs in family all-inclusive?</h3>
<p>Sometimes. Extras can include certain restaurants, premium drinks, activities, or upgraded beach/pool areas. Ask what’s included before booking so the value is clear.</p>

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
