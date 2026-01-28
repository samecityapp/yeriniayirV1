
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
// "Scenic holiday" and resort comparison style
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
    slug: "antalya-vs-dalaman-coast-for-all-inclusive-which-is-better-for-brits",
    title: "Antalya vs Dalaman Coast for All-Inclusive: Which Is Better for Brits? (Practical UK Guide)",
    meta_description: "Antalya or the Dalaman Coast for an all-inclusive Turkey holiday from the UK? This guide compares them by what really matters to Brits: resort style, vibe (family vs couples), beach feel, transfers, exploring options, season comfort, and value signals.",
    prompts: [
        "A split shot concept: Left side a large luxury resort pool with slides (Antalya), Right side a scenic bay with boats and mountains (Dalaman), photorealistic travel style.",
        "A family playing in a large hotel pool complex, sunny day, palm trees, busy but fun atmosphere.",
        "A couple dining by a river with mountain views, scenic and calm atmosphere, romantic evening.",
        "A wide aerial view of a beautiful turquoise coast with green mountains meeting the sea, boats anchored in a bay.",
        "A traveler checking a map near a transfer van, luggage nearby, sunny airport arrival scene."
    ],
    // Provided content 
    content: `
<h1>Antalya vs Dalaman Coast for All-Inclusive: Which Is Better for Brits? (Practical UK Guide)</h1>

<p><strong>Quick answer:</strong> For many Brits, Antalya is the easiest choice if you want a classic, large-scale all-inclusive experience with lots of facilities and family-focused set-ups. The Dalaman Coast often suits Brits who want all-inclusive comfort but also a more scenic, mixed holiday feel — where leaving the resort for boat days or exploring can feel more “part of the trip”. Neither is “better” for everyone. Pick based on your holiday rhythm, not the name of the coast.</p>

<!-- IMG_0 -->

<h2>The UK decision in 60 seconds (pick your lane)</h2>
<p>Choose the line that sounds most like you:</p>
<ul>
  <li>“We want the most classic all-inclusive week, lots going on, minimal decisions.” → <strong>Antalya</strong></li>
  <li>“We want all-inclusive comfort but we’ll get bored staying in all week.” → <strong>Dalaman Coast</strong></li>
  <li>“We’re a family with young kids and want pure convenience.” → <strong>Antalya</strong></li>
  <li>“We’re a couple and want scenery + relaxed evenings.” → <strong>Dalaman Coast</strong></li>
  <li>“We want resort life first, exploring optional.” → <strong>Antalya</strong></li>
  <li>“We want destination feel first, resort is our base.” → <strong>Dalaman Coast</strong></li>
</ul>

<p><strong>Simple rule:</strong> Antalya = “resort universe”. Dalaman = “scenic holiday with resort comfort”.</p>

<h2>1) Resort style: what you’re actually buying</h2>

<h3>Antalya: big resort infrastructure</h3>
<p>Antalya is well known for:</p>
<ul>
  <li>larger resorts with extensive facilities</li>
  <li>structured entertainment</li>
  <li>lots of on-site variety (pools, activities, shows)</li>
</ul>
<p><strong>Best for:</strong> families, first-time all-inclusive travellers, people who want everything inside the resort.</p>

<h3>Dalaman Coast: mixed holiday energy</h3>
<p>Dalaman Coast holidays often feel like:</p>
<ul>
  <li>resort comfort plus “out and about” options</li>
  <li>scenic moments and day-trip/boat-day culture</li>
  <li>a bit more destination character outside the resort</li>
</ul>
<p><strong>Best for:</strong> couples, repeat visitors, mixed-style travellers.</p>

<p><strong>UK-friendly tip:</strong> If your ideal day includes “let’s do something today”, Dalaman-style trips often suit you better.</p>

<!-- IMG_1 -->

<h2>2) Vibe: families, couples, and “noise tolerance”</h2>

<h3>If you’re travelling as a family</h3>
<p>Antalya often has more of the big, family-first infrastructure that makes daily life easy.</p>
<p>Dalaman Coast can work well for families too, but the “best fit” depends more on your children’s ages and your routine.</p>
<p><strong>Simple rule:</strong> With kids, choose the set-up that protects sleep, snacks, shade, and easy pools.</p>

<p>Related: <a href="/en/guide/all-inclusive-turkey-for-families-uk-parent-checklist">All-Inclusive for Families: The Non-Negotiables</a></p>

<h3>If you’re travelling as a couple</h3>
<p>Antalya can be great if you choose a calmer, couples-friendly set-up.</p>
<p>Dalaman Coast can feel naturally couples-friendly if you want scenic variety and relaxed evenings.</p>
<p><strong>Simple rule:</strong> Couples value evenings. Pick the coast that matches your ideal evening (quiet luxury vs lively).</p>

<p>Related: <a href="/en/guide/adults-only-all-inclusive-turkey-guide-quiet-vs-party">Adults-Only All-Inclusive: How to Choose</a></p>

<h2>3) Beach feel: choose what “good beach” means for you</h2>
<p>Different travellers mean different things by “good beach”.</p>

<h3>If you want convenience</h3>
<p>You’ll care about:</p>
<ul>
  <li>easy access from room to beach</li>
  <li>shade availability</li>
  <li>toilets and snack access nearby</li>
  <li>a beach that feels simple at 11am and 4pm</li>
</ul>
<p>Antalya often performs well for convenience-driven resort life.</p>

<h3>If you want scenery and “holiday moments”</h3>
<p>You’ll care about:</p>
<ul>
  <li>views, coastline feel, boat-day potential (where relevant)</li>
  <li>sunset walks and scenic stops</li>
  <li>the destination feeling beyond the resort</li>
</ul>
<p>Dalaman Coast often attracts travellers who want that scenic, mixed vibe.</p>

<p><strong>Simple rule:</strong> Pick beach convenience for family efficiency. Pick scenic coast if “holiday moments” are your priority.</p>

<!-- IMG_2 -->

<h2>4) Transfers: the hidden factor that changes your whole week</h2>
<p>Arrival day matters more than people admit.</p>

<h3>How to choose by transfer tolerance</h3>
<ul>
  <li><strong>If you hate long transfers or you’re travelling with young kids:</strong> choose the option that keeps logistics simplest.</li>
  <li><strong>If you’re happy to trade a bit more transfer time for a vibe you love:</strong> you can widen your options.</li>
</ul>

<p><strong>Simple rule:</strong> If you land late, don’t choose a plan that makes day 1 hard.</p>

<p>Deep dive: <a href="/en/guide/resort-transfers-in-turkey-reliable-options-and-what-to-avoid">Resort Transfers in Turkey: Reliable Options and What to Avoid</a></p>

<h2>5) Exploring: do you want to leave the resort?</h2>
<p>This is where Antalya vs Dalaman becomes clear.</p>

<h3>If you’ll mostly stay in the resort</h3>
<p>Antalya usually wins because:</p>
<ul>
  <li>resort variety is the product</li>
  <li>you can have a full week without needing to go anywhere</li>
</ul>

<h3>If you want 2–4 outings</h3>
<p>Dalaman Coast often feels better because:</p>
<ul>
  <li>the destination vibe can feel like part of the holiday</li>
  <li>boat/scenic days and short exploring moments often fit naturally</li>
</ul>

<p><strong>Simple rule:</strong> Resort-only week → Antalya. Mixed week → Dalaman.</p>

<!-- IMG_3 -->

<h2>6) Season comfort: match the coast to your month (and your heat tolerance)</h2>
<p>Instead of chasing exact temperatures, plan for comfort.</p>

<h3>Peak summer</h3>
<ul>
  <li>If you love full summer heat and resort life: Antalya can be brilliant.</li>
  <li>If you want variety and scenic breaks from the resort: Dalaman can feel more “mixed”.</li>
</ul>
<p><strong>Simple rule:</strong> In peak heat, your holiday quality is mostly about shade + pools + evening comfort, not just the region.</p>

<h3>Shoulder season (spring/autumn)</h3>
<ul>
  <li>Dalaman Coast can feel especially good for mixed days and scenic exploring.</li>
  <li>Antalya can still be great if you want classic resort comfort with less intensity.</li>
</ul>

<p>Season guide: <a href="/en/guide/best-time-to-visit-turkey-from-uk">Best Time to Visit Turkey from the UK</a></p>

<h2>7) Value signals: how to compare deals like a pro (UK method)</h2>
<p>Don’t compare resorts by “marketing language”. Compare by what you’ll actually use.</p>

<h3>Antalya value signals</h3>
<ul>
  <li>strong on-site variety</li>
  <li>many family-first features</li>
  <li>classic all-inclusive rhythm done well</li>
</ul>

<h3>Dalaman value signals</h3>
<ul>
  <li>resort comfort plus destination feel</li>
  <li>better fit for “we want to do a bit” travellers</li>
  <li>scenic variety that feels like free entertainment</li>
</ul>

<p><strong>Simple rule:</strong> Value is the best match between your style and the resort’s set-up — not the lowest headline price.</p>

<p>Value guide: <a href="/en/guide/how-to-get-the-best-all-inclusive-value-in-turkey-from-the-uk">How to Get the Best All-Inclusive Value from the UK</a></p>

<!-- IMG_4 -->

<h2>8) Common UK traveller mistakes (and how to avoid them)</h2>

<h3>Mistake 1: Picking a coast without defining your rhythm</h3>
<p><strong>Fix:</strong> decide “resort-only” vs “mixed holiday” first.</p>

<h3>Mistake 2: Ignoring transfer reality</h3>
<p><strong>Fix:</strong> plan arrival day to be easy, especially with kids.</p>

<h3>Mistake 3: Chasing “the best beach” instead of “the easiest beach for us”</h3>
<p><strong>Fix:</strong> choose based on convenience vs scenery.</p>

<h3>Mistake 4: Overbooking excursions</h3>
<p><strong>Fix:</strong> one headline outing + one easy outing is usually enough.</p>

<p><strong>UK-friendly tip:</strong> A calm itinerary is what makes Turkey feel premium.</p>

<h2>Copy-paste questions (use these to choose Antalya vs Dalaman)</h2>
<ul>
  <li>“We want (resort-only / mixed holiday). Which coast fits that best?”</li>
  <li>“We care most about (family facilities / calm vibe / scenery). Which region supports it?”</li>
  <li>“We’re landing late — which option gives the simplest transfer?”</li>
  <li>“We want to leave the resort 2–3 times. Which coast makes that easiest?”</li>
  <li>“We’re noise-sensitive. Which resort style is better for sleep?”</li>
  <li>“Which option gives better value for our style, not just headline price?”</li>
</ul>

<h2>Quick checklist: Antalya vs Dalaman decision</h2>
<p>Tick the side that matches you most.</p>

<h3>Choose Antalya if:</h3>
<ul>
  <li>You want classic all-inclusive scale and facilities ✅</li>
  <li>You’re a family who wants pure convenience ✅</li>
  <li>You want to stay mostly in the resort ✅</li>
  <li>You prefer structured entertainment ✅</li>
</ul>

<h3>Choose Dalaman Coast if:</h3>
<ul>
  <li>You want a scenic, mixed holiday feel ✅</li>
  <li>You want boat/scenic days and exploring moments ✅</li>
  <li>You get bored staying inside a resort all week ✅</li>
  <li>You value destination atmosphere and evenings ✅</li>
</ul>

<p><strong>Simple rule:</strong> If you’re 70% on one side, that’s your answer.</p>

<h2>FAQ: Antalya vs Dalaman Coast for all-inclusive (UK)</h2>

<h3>Which is better for families: Antalya or Dalaman?</h3>
<p>Many UK families choose Antalya because the all-inclusive infrastructure is very family-first and resort-led. Dalaman Coast can also work well, but families often do best when convenience and easy routines are the priority.</p>

<h3>Which is better for couples?</h3>
<p>Couples often enjoy Dalaman Coast for scenic variety and relaxed evenings, but Antalya can be excellent too if you choose a calmer, couples-friendly resort style. Your “evening vibe” is the key.</p>

<h3>Which is better if we want to explore?</h3>
<p>Dalaman Coast often suits mixed holidays where you’ll leave the resort a few times. Antalya is perfect if you want the resort itself to be the main event.</p>

<h3>Is transfer time a big deal?</h3>
<p>Yes — especially with kids or late arrivals. The best choice is the one that makes day 1 easy and protects your holiday energy.</p>

<h3>How do we choose without overthinking?</h3>
<p>Decide your holiday type: resort-only or mixed. Then use the checklist above and ask the copy-paste questions. If your rhythm matches the coast, you won’t regret it.</p>

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
