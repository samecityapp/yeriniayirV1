
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
    slug: "adults-only-all-inclusive-turkey-guide-quiet-vs-party",
    title: "Adults-Only All-Inclusive in Turkey: How to Choose (Quiet Luxury vs Party Resorts)",
    meta_description: "Want an adults-only all-inclusive in Turkey from the UK? This guide helps you choose the right vibe — quiet luxury, romantic calm, or lively party energy.",
    prompts: [
        "A stylish adults-only hotel pool in Bodrum at sunset, couples lounging, cocktails, warm ambient lighting, no kids.",
        "A quiet luxury beach setup with white cabanas, calm turquoise sea, elegant atmosphere, person reading a book.",
        "A lively night scene at a resort bar, people having drinks, warm string lights, social atmosphere, classy party vibe.",
        "A romantic dinner setup for two on a pier by the sea, white tablecloth, wine, sunset background.",
        "A modern, high-end hotel suite with sea view, minimal design, relaxation vibe, fruit platter and champagne."
    ],
    // Provided content 
    content: `
<h1>Adults-Only All-Inclusive in Turkey: How to Choose (Quiet Luxury vs Party Resorts)</h1>

<p><strong>Quick answer:</strong> Adults-only all-inclusive in Turkey can mean two completely different holidays: quiet luxury (calm pools, refined evenings, premium-feeling relaxation) or party energy (music, late nights, lively social vibe). The fastest way to choose correctly is to decide what you want your evenings to feel like, then match your resort style and area to that. Use the checklist below to avoid booking “adults-only” that’s technically child-free but totally the wrong atmosphere.</p>

<!-- IMG_0 -->

<h2>Step 1: Choose your “adult holiday identity” (be honest)</h2>
<p>Most UK travellers fit one of these profiles:</p>
<ul>
  <li><strong>Quiet luxury reset:</strong> calm days, good food, privacy, slow evenings</li>
  <li><strong>Romantic couples’ vibe:</strong> sunsets, nice dinners, relaxed atmosphere, a bit of buzz</li>
  <li><strong>Social + lively:</strong> DJs, bars, meeting people, late nights</li>
  <li><strong>Wellness-first:</strong> spa rhythm, sleep quality, calm spaces, early starts</li>
  <li><strong>Mixed:</strong> quiet by day, lively by night (rare, but possible)</li>
</ul>

<p><strong>Simple rule:</strong> Decide what you want after 9pm. That’s the real difference-maker.</p>

<p><strong>UK-friendly tip:</strong> If you’re choosing adults-only to escape noise, you want a “quiet luxury” style — not just “no kids”.</p>

<h2>Step 2: Understand what “adults-only” actually means (so you don’t misbook)</h2>
<p>“Adults-only” can describe different set-ups:</p>
<ul>
  <li>A fully adults-only resort (whole property is adult-focused)</li>
  <li>An adults-only zone inside a bigger complex (adult pool/restaurant areas)</li>
  <li>A mostly adult vibe (not formal adults-only, but calm and couple-oriented)</li>
</ul>

<p><strong>Simple rule:</strong> “Adults-only zone” can still feel busy if the surrounding resort is family-heavy. Confirm what the label really refers to.</p>

<h3>Quiet Luxury vs Party Energy: the real differences (no fluff)</h3>
<p>You can often tell the vibe from the way the resort “sells” itself — but you need a practical filter.</p>

<!-- IMG_1 -->

<h4>Quiet luxury usually looks like:</h4>
<ul>
  <li>Calm pool areas and quiet seating spaces</li>
  <li>Emphasis on food quality and relaxed service</li>
  <li>A more refined evening atmosphere (not loud entertainment)</li>
  <li>Strong focus on comfort: shade, spacing, privacy</li>
  <li>Guests who wake up early, spend time reading, and enjoy long dinners</li>
</ul>

<h4>Party energy usually looks like:</h4>
<ul>
  <li>Music-led pool scenes</li>
  <li>Late-night bars and energetic entertainment</li>
  <li>Social atmosphere: meeting people, group vibe</li>
  <li>A “dress up and go out” feel in the evenings</li>
  <li>Guests who prioritise nightlife and don’t mind noise</li>
</ul>

<p><strong>Simple rule:</strong> If “music and entertainment” is the headline, expect a lively vibe. If “relaxation and refined comfort” is the headline, expect quiet luxury.</p>

<h2>Step 3: Pick the right coast/region for your vibe (high-level logic)</h2>
<p>Different coastal regions can support different holiday styles.</p>

<h3>If you want quiet luxury (calm, premium-feeling)</h3>
<p>You’re usually looking for:</p>
<ul>
  <li>Resorts that prioritise spacing, calm pools, and adult-focused areas</li>
  <li>Areas with a relaxed evening scene rather than club energy</li>
  <li>A base where leaving the resort for a calm dinner or sunset walk feels easy</li>
</ul>

<p><strong>UK-friendly tip:</strong> Quiet luxury trips often feel best when the area outside the resort is also calm — not chaotic.</p>

<!-- IMG_2 -->

<h3>If you want party energy (lively and social)</h3>
<p>You’re usually looking for:</p>
<ul>
  <li>Areas known for nightlife energy and late evenings</li>
  <li>Resorts designed around entertainment</li>
  <li>A place where “going out” feels part of the holiday</li>
</ul>

<p><strong>Simple rule:</strong> Party resorts are not “better” — they’re just a different product. Don’t pay for them if your goal is sleep and calm.</p>

<h3>If you want romantic but not boring (couples’ sweet spot)</h3>
<p>You’re usually looking for:</p>
<ul>
  <li>A calm base with stylish evenings</li>
  <li>Easy sunset moments and walkable dinner options</li>
  <li>A resort that feels adult, but not silent</li>
</ul>

<p>Related: <a href="/en/guide/best-regions-for-all-inclusive-in-turkey-which-coast-fits-your-style">Best Regions for All-Inclusive in Turkey: Which Coast Fits Your Style?</a></p>

<h2>Step 4: The adults-only checklist (what to verify before booking)</h2>
<p>This is where UK travellers avoid mistakes. Adults-only can still vary wildly in comfort, noise, and vibe.</p>

<h3>A) Noise and sleep quality (most important)</h3>
<ul>
  <li>Is there loud entertainment late at night?</li>
  <li>Are rooms near bars/stages likely to hear music?</li>
  <li>Is there a “quiet pool” or quiet zone?</li>
  <li>Is the vibe more early-night or late-night?</li>
</ul>

<p><strong>Simple rule:</strong> If sleep matters, avoid “music-first” resorts and ask for quiet-room positioning.</p>

<!-- IMG_3 -->

<h3>B) Pool vibe (calm vs social)</h3>
<ul>
  <li>Are there calm loungers and shaded spots?</li>
  <li>Is the main pool a music/social scene?</li>
  <li>Are there multiple pools so you can choose your mood?</li>
</ul>

<p><strong>UK-friendly tip:</strong> A “quiet pool” is the adult version of a kids’ splash pool — it’s not a luxury, it’s the product.</p>

<h3>C) Food and evening atmosphere</h3>
<ul>
  <li>Is the evening vibe “dress up and dine” or “show and party”?</li>
  <li>Are there quieter dining options?</li>
  <li>Are there late-night snacks included (useful for party style)?</li>
</ul>

<p>Related: <a href="/en/guide/all-inclusive-whats-included-turkey-guide">All-Inclusive in Turkey: What’s Included</a></p>

<h3>D) Adults-only rules and age limits</h3>
<ul>
  <li>Is it 16+ or 18+? (can vary)</li>
  <li>Is the whole resort adults-only or just a zone?</li>
</ul>

<p><strong>Simple rule:</strong> Don’t assume the age policy — confirm it in the booking details.</p>

<h3>E) “Leave the resort” potential</h3>
<p>Even on adults-only trips, UK travellers often want 2–3 “outside” moments:</p>
<ul>
  <li>a scenic sunset spot</li>
  <li>a calm dinner out</li>
  <li>a short boat/scenic day (where relevant)</li>
</ul>

<p><strong>Simple rule:</strong> The best adults-only trips feel like a holiday destination, not just a resort compound.</p>

<!-- IMG_4 -->

<h2>Timing: when adults-only feels best</h2>
<p>Adults-only can be great across seasons, but the vibe shifts.</p>

<h3>Warmer months</h3>
<ul>
  <li>Midday heat makes shade + pool comfort essential</li>
  <li>Evenings become the main event</li>
  <li>Party resorts feel more intense; quiet luxury feels more premium</li>
</ul>

<h3>Shoulder season</h3>
<ul>
  <li>Great for couples who want walking, exploring, and comfortable evenings</li>
  <li>Quiet luxury resorts can feel especially relaxing</li>
</ul>

<p>Related: <a href="/en/guide/best-time-to-visit-turkey-uk-weather">Best Time to Visit Turkey from the UK</a></p>

<h2>The “don’t book the wrong vibe” warning signs</h2>
<p>Use this list like a quick detector.</p>

<h3>You want quiet luxury — avoid if you see:</h3>
<ul>
  <li>Heavy focus on DJs and all-day music</li>
  <li>Late-night entertainment as the headline</li>
  <li>“Party” positioning (even if it sounds fun in theory)</li>
</ul>

<h3>You want party energy — avoid if you see:</h3>
<ul>
  <li>Focus on tranquillity and early evenings</li>
  <li>Emphasis on spa and quiet spaces</li>
  <li>Couples-only romance messaging without nightlife options</li>
</ul>

<p><strong>Simple rule:</strong> Don’t buy a product that fights your natural holiday rhythm.</p>

<h2>Copy-paste questions (send these to a travel agent or use while browsing)</h2>
<ul>
  <li>“Is this adults-only truly quiet, or is it entertainment-led at night?”</li>
  <li>“What time does music/entertainment usually finish?”</li>
  <li>“Are there quiet pool zones and shaded relaxing areas?”</li>
  <li>“Is the whole property adults-only or is it an adults-only section?”</li>
  <li>“What’s the age policy (16+ or 18+)?”</li>
  <li>“Is the evening vibe more ‘dinner and relax’ or ‘show and party’?”</li>
  <li>“Are rooms near bars/stages noticeably louder?”</li>
  <li>“If we want to leave the resort for 1–2 calm evenings, is that easy from this area?”</li>
</ul>

<h2>Quick decision framework (60-second choice)</h2>
<p>Pick the line that sounds like you:</p>
<ul>
  <li>“We want to sleep well and reset.” → <strong>Quiet luxury adults-only</strong></li>
  <li>“We want romance with a bit of buzz.” → <strong>Couples vibe / calmer adult resort</strong></li>
  <li>“We want music, nightlife, and meeting people.” → <strong>Party-led adults-only</strong></li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re unsure, choose romance/calm. It’s easier to add “buzz” with one night out than to escape noise for a whole week.</p>

<h2>FAQ: Adults-only all-inclusive in Turkey (UK)</h2>

<h3>Is adults-only all-inclusive in Turkey worth it?</h3>
<p>It can be very worth it if you choose the right vibe. Adults-only works best for couples and friends who want a calm reset or a social holiday without family-focused noise.</p>

<h3>Are adults-only resorts always quiet?</h3>
<p>No. Some are quiet luxury, others are party-led. The label “adults-only” only tells you there are no children — not whether it’s calm.</p>

<h3>How do I choose between quiet luxury and party resorts?</h3>
<p>Decide what you want your evenings to feel like. Then check entertainment focus, music timing, pool vibe, and room noise risk before you book.</p>

<h3>Which region is best for adults-only?</h3>
<p>It depends on the vibe you want. Some regions support calm scenic holidays; others support nightlife-led trips. Start with your vibe, then match the coast to it.</p>

<h3>What should I prioritise for a romantic adults-only trip?</h3>
<p>Quiet zones, comfortable room layout, calm pools, good food, and an evening atmosphere that feels relaxed and walkable. The best romantic trips are the ones that protect sleep and comfort.</p>

<h3>How can I avoid “surprise extras” on adults-only all-inclusive?</h3>
<p>Ask what’s included for drinks, late-night snacks, premium dining, and any upgraded zones. Check the “extras” so you can compare value properly.</p>

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
