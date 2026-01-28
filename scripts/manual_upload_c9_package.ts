
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
// "Comparison/Choices" style
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
    slug: "package-holiday-vs-booking-separately-for-turkey-uk-cost-comparison-framework",
    title: "Package Holiday vs Booking Separately for Turkey: UK Cost Comparison Framework (No-Guesswork Guide)",
    meta_description: "Should you book a package holiday to Turkey from the UK or book flights + accommodation separately? Use this practical comparison framework to decide based on your trip style, risk tolerance, transfers, flexibility, and real “total cost” signals.",
    prompts: [
        "A split concept shot: Left side a neat stack of travel documents (package), Right side a laptop with multiple tabs open (planning separately), photorealistic table setting.",
        "A family arriving at a Turkish airport with a rep holding a clipboard, easy arrival concept, warm lighting.",
        "A couple looking at a beautiful view from a balcony, relaxed atmosphere, drinks on table.",
        "A messy table with maps and phone, planning a road trip style holiday, coffee cup nearby.",
        "A suitcase being packed neatly with key holiday items like sunglasses and a hat, preparation vibe."
    ],
    // Provided content 
    content: `
<h1>Package Holiday vs Booking Separately for Turkey: UK Cost Comparison Framework (No-Guesswork Guide)</h1>

<p><strong>Quick answer:</strong> For many UK travellers, a package holiday is the easiest way to get Turkey right: one booking, clear inclusions, and often a smoother transfer set-up. Booking separately can be great value and gives more flexibility, especially if you want a mixed itinerary or you’re confident organising logistics. The best choice isn’t “which is cheaper” — it’s which option gives you the best total cost (money + time + mental effort) for your travel style.</p>

<!-- IMG_0 -->

<h2>The UK decision in one minute (pick your profile)</h2>
<p>Choose the line that sounds most like you:</p>
<ul>
  <li>“We want easy. We don’t want to think.” → <strong>Package</strong></li>
  <li>“We want flexibility and we’re happy to plan.” → <strong>Separate</strong></li>
  <li>“We’re travelling with kids and want minimal friction.” → <strong>Package</strong> (usually)</li>
  <li>“We want to change bases / do day trips / move around.” → <strong>Separate</strong> (often)</li>
  <li>“We’re bargain-hunting and comparing lots of options.” → <strong>Either</strong>, but use the framework</li>
  <li>“We want protection and simple support if plans change.” → <strong>Package</strong> (usually)</li>
</ul>

<p><strong>Simple rule:</strong> If stress costs you more than money, package is often the best “value”.</p>

<h2>First: stop comparing headline price (use “Total Cost”)</h2>
<p>A package might look more expensive — until you count what’s included. Booking separately might look cheaper — until you add hidden extras.</p>
<p><strong>Total Cost = Money + Time + Mental Load</strong></p>
<ul>
  <li><strong>Money:</strong> flights, accommodation, transfers, add-ons, luggage, meals (if not all-inclusive)</li>
  <li><strong>Time:</strong> searching, comparing, booking, managing changes</li>
  <li><strong>Mental load:</strong> arrival-day decisions, coordination, problem-solving</li>
</ul>

<p><strong>UK-friendly tip:</strong> If your holiday is short, the mental load of DIY planning can be a bigger cost than you realise.</p>

<!-- IMG_1 -->

<h2>What packages usually do well in Turkey (for UK travellers)</h2>
<p>Package holidays often work particularly well for Turkey because they can bundle the parts that cause friction:</p>

<h3>1) One booking, one set of details</h3>
<ul>
  <li>fewer confirmations to manage</li>
  <li>easier to communicate changes (in many cases)</li>
</ul>

<h3>2) Transfers are often sorted (or at least offered clearly)</h3>
<p>Transfers are where DIY trips can get messy if you haven’t planned.</p>
<p>Related: <a href="/en/guide/resort-transfers-in-turkey-reliable-options-and-what-to-avoid-uk-guide">Resort Transfers in Turkey: Reliable Options and What to Avoid</a></p>

<h3>3) Clear “holiday rhythm”</h3>
<p>If you’re booking all-inclusive, packages can make the whole trip feel like one smooth product.</p>

<h3>4) Strong fit for families and first-timers</h3>
<p>Families often benefit from fewer moving parts, simpler arrival day, and predictable structure.</p>
<p>Family guide: <a href="/en/guide/all-inclusive-turkey-for-families-uk-parent-checklist">All-Inclusive for Families: The Non-Negotiables</a></p>

<p><strong>Simple rule:</strong> Packages are best when you want the trip to feel like a single, tidy plan.</p>

<h2>What booking separately does better (when you know what you want)</h2>
<p>Booking separately can be brilliant — but it’s not automatically better.</p>

<h3>1) Flexibility</h3>
<p>Choose flight times that suit you, mix accommodation styles, or change bases (city + coast trips).</p>
<p>Itinerary frameworks: <a href="/en/guide/turkey-itinerary-for-couples-uk-7-10-days">10 Days in Turkey: The Two-Base Itinerary</a></p>

<h3>2) Potential value for confident planners</h3>
<p>If you’re good at planning, you can build your own “best fit” trip and avoid paying for bundled extras you won’t use.</p>

<h3>3) Better for “mixed holidays”</h3>
<p>If you want 2–3 different experiences in one trip (city + coast, exploring-heavy), DIY planning often fits.</p>

<p><strong>Simple rule:</strong> Book separately if you want a trip with more than one “mode”.</p>

<!-- IMG_2 -->

<h2>The UK cost comparison framework (use this to decide)</h2>
<p>Don’t ask “Which is cheaper?” Ask these five questions:</p>

<h3>Question 1: How many moving parts can you handle?</h3>
<ul>
  <li>If you want fewer decisions → package</li>
  <li>If you enjoy planning and can manage details → separate</li>
</ul>
<p><strong>Simple rule:</strong> Your tolerance for admin is part of the budget.</p>

<h3>Question 2: Is your arrival day likely to be stressful?</h3>
<p>Consider landing late, travelling with kids, multiple suitcases, or a short trip. If yes, package transfers (or pre-planned private transfer) become more valuable.</p>

<h3>Question 3: Do you need flexibility?</h3>
<ul>
  <li>If you want specific flight times, a split stay, or changes → separate</li>
  <li>If you want one smooth “resort week” → package</li>
</ul>

<h3>Question 4: Do you care about “vibe matching”?</h3>
<p>If you’re very sensitive to quiet vs lively, adults-only vibe vs family energy, or sleep quality, then booking separately can help you choose more precisely — but only if you’re willing to research properly.</p>
<p>Adults-only guide: <a href="/en/guide/adults-only-all-inclusive-turkey-guide-quiet-vs-party">Adults-Only All-Inclusive: How to Choose</a></p>

<h3>Question 5: What does “value” mean for you?</h3>
<ul>
  <li>families: value = easy routines</li>
  <li>couples: value = calm + good evenings</li>
  <li>explorers: value = flexibility</li>
  <li>resort-lovers: value = on-site variety</li>
</ul>
<p>Value guide: <a href="/en/guide/how-to-get-the-best-all-inclusive-value-in-turkey-from-the-uk">How to Get the Best All-Inclusive Value from the UK</a></p>

<h2>What to compare line-by-line (so it’s a fair fight)</h2>
<p>Whether you’re comparing package vs DIY, compare these items:</p>
<ul>
  <li><strong>A) Flights:</strong> flight times, convenience, luggage allowances, total travel time.</li>
  <li><strong>B) Transfers:</strong> included vs extra, private vs shared, arrival-time suitability.</li>
  <li><strong>C) Food plan:</strong> all-inclusive vs half-board vs room-only, daily eating rhythm.</li>
  <li><strong>D) Room type / layout:</strong> This matters more than most people think, especially for families.</li>
</ul>
<p>Room logic: <a href="/en/guide/how-to-get-the-best-all-inclusive-value-in-turkey-from-the-uk">Room Types in Turkey: What UK Travellers Should Know</a></p>

<ul>
  <li><strong>E) Change flexibility:</strong> can you change names, dates, or flight times? what happens if plans change?</li>
</ul>
<p><strong>Simple rule:</strong> If you can’t compare these five areas, you’re not comparing total cost.</p>

<!-- IMG_3 -->

<h2>Common UK mistakes (and how to avoid them)</h2>

<h3>Mistake 1: Choosing DIY for “savings” then paying in stress</h3>
<p><strong>Fix:</strong> if you want DIY, plan transfers and arrival day properly.</p>

<h3>Mistake 2: Choosing a package but not reading the inclusions</h3>
<p><strong>Fix:</strong> confirm transfers, baggage, and what “all-inclusive” includes for your booking.</p>

<h3>Mistake 3: Comparing a premium package to a barebones DIY plan</h3>
<p><strong>Fix:</strong> compare like-for-like: same board basis, same transfer type, same luggage.</p>

<h3>Mistake 4: Forgetting the “energy cost”</h3>
<p><strong>Fix:</strong> if you’re doing a short trip, simplicity is worth more.</p>

<h2>When package is usually the smarter choice (UK scenarios)</h2>
<ul>
  <li>You’re travelling with young kids</li>
  <li>You’re a first-time Turkey visitor</li>
  <li>You’re landing late or you want a smooth arrival</li>
  <li>You want a classic all-inclusive week</li>
  <li>You don’t want to coordinate multiple bookings</li>
  <li>You want simple support if things change</li>
</ul>
<p><strong>Simple rule:</strong> If the goal is “easy holiday”, package often wins.</p>

<h2>When booking separately is usually better (UK scenarios)</h2>
<ul>
  <li>You want a city + coast split</li>
  <li>You care about specific flight times</li>
  <li>You like building your own itinerary</li>
  <li>You want short stays in multiple places</li>
  <li>You’re comfortable organising transfers and logistics</li>
  <li>You want maximum control</li>
</ul>
<p><strong>Simple rule:</strong> If the goal is “custom holiday”, separate often wins.</p>

<!-- IMG_4 -->

<h2>Copy-paste questions (use these before you decide)</h2>
<ul>
  <li>“What exactly is included in the package price (transfers, luggage, board basis)?”</li>
  <li>“If we book separately, what will transfers cost and how do we arrange them?”</li>
  <li>“How much flexibility do we have if flight times change?”</li>
  <li>“Are we comparing the same room type and board basis?”</li>
  <li>“Are there any resort extras we’re likely to pay for?”</li>
  <li>“Which option gives us the easiest arrival day?”</li>
</ul>

<h2>Quick checklist: package vs separate (UK)</h2>

<h3>Package likely suits you if:</h3>
<ul>
  <li>We want minimal decisions ✅</li>
  <li>We want transfers sorted ✅</li>
  <li>We’re travelling with kids ✅</li>
  <li>We want a classic all-inclusive week ✅</li>
  <li>We value simplicity over customisation ✅</li>
</ul>

<h3>Booking separately likely suits you if:</h3>
<ul>
  <li>We want flexibility and control ✅</li>
  <li>We want a split stay (city + coast) ✅</li>
  <li>We’re confident planning transfers ✅</li>
  <li>We want specific flight times ✅</li>
  <li>We enjoy itinerary-building ✅</li>
</ul>

<p><strong>Simple rule:</strong> If one side has clearly more ticks, that’s your answer.</p>

<h2>FAQ: Package holiday vs booking separately for Turkey (UK)</h2>

<h3>Are package holidays to Turkey cheaper from the UK?</h3>
<p>Sometimes, but not always. The better question is total cost: packages often include transfers and simplify planning. Booking separately can be cheaper if you plan well and you don’t need bundled extras.</p>

<h3>Is booking separately risky?</h3>
<p>Not necessarily. It’s just more admin. If you book flights, accommodation, and transfers thoughtfully, DIY trips can be smooth — especially for mixed itineraries.</p>

<h3>Which is better for families?</h3>
<p>Packages are often easier for families because they reduce moving parts and usually make arrival day simpler. Families also benefit from predictable routines and fewer logistics decisions.</p>

<h3>Which is better for couples?</h3>
<p>Couples can enjoy either. Packages can feel effortless for a calm reset. Booking separately can be great if you want a more customised itinerary or specific flight times.</p>

<h3>What’s the best way to compare fairly?</h3>
<p>Compare like-for-like: same board basis, same luggage needs, same transfer type, same room type. Then add the “time + mental load” factor.</p>

<h3>What if we want to do a city + coast trip?</h3>
<p>Booking separately is often the best fit because you can control timing and split your trip across two bases without trying to fit a package template.</p>

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
