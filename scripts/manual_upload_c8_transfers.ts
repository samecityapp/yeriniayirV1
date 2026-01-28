
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
// "Smooth transport" style
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
    slug: "resort-transfers-in-turkey-reliable-options-and-what-to-avoid-uk-guide",
    title: "Resort Transfers in Turkey: Reliable Options and What to Avoid (UK-Friendly Guide)",
    meta_description: "Landing in Turkey from the UK and heading to a resort? This practical guide compares transfer options (private, shuttle, taxi, public transport, car hire), shows how to choose the smoothest plan for your arrival time and travel style.",
    prompts: [
        "A relaxed family stepping out of a modern private transfer van at a resort entrance, hotel staff greeting them, sunny day.",
        "A view from the back seat of a clean transfer vehicle looking out at the Turkish coast road, sea view, calm travel vibe.",
        "A busy airport arrivals hall with people holding name boards, but focused on a couple finding their driver easily.",
        "A group of friends laughing inside a spacious shuttle bus, air conditioning, comfortable seats.",
        "A car driving on a scenic coastal road in Turkey with blue sea in background, clear signage, easy driving conditions."
    ],
    // Provided content 
    content: `
<h1>Resort Transfers in Turkey: Reliable Options and What to Avoid (UK-Friendly Guide)</h1>

<p><strong>Quick answer:</strong> The smoothest way to reach a resort in Turkey is usually a pre-booked transfer (private or shared) because it gives you a clear plan, predictable pickup, and less thinking after a flight. Taxis can also be a simple option in many places if you use the official airport system and confirm basics before you go. Public transport can be great for city bases, but it’s not always the easiest for resort areas—especially with luggage, children, or late arrivals. The best transfer choice depends on three things: your arrival time, your travel group, and your tolerance for hassle.</p>

<!-- IMG_0 -->

<h2>Start with the UK traveller mindset: “arrival day should feel easy”</h2>
<p>A Turkey holiday often begins with a flight, airport time, and then the transfer. If you get this part right, the whole trip feels more premium.</p>

<p><strong>Simple rule:</strong> Plan your transfer like you’re planning the first night: keep it calm, predictable, and low-effort.</p>

<p><strong>UK-friendly tip:</strong> If you land late, don’t choose an option that requires lots of decisions or multiple steps. Late arrivals are when “simple wins”.</p>

<h2>Your transfer options (explained simply)</h2>

<h3>Option 1) Pre-booked private transfer (most predictable)</h3>
<p><strong>What it is:</strong> A driver meets you and takes you directly to your accommodation.</p>
<h4>Best for:</h4>
<ul>
  <li>families (especially with younger kids)</li>
  <li>couples who want calm, door-to-door comfort</li>
  <li>late-night or early-morning arrivals</li>
  <li>anyone who hates negotiating or uncertainty</li>
</ul>
<h4>Why it’s reliable:</h4>
<ul>
  <li>you usually get confirmation details in advance</li>
  <li>you know the pickup method (meeting point, name board, etc.)</li>
  <li>direct route, no extra stops (in most cases)</li>
</ul>
<h4>Potential downsides:</h4>
<ul>
  <li>can cost more than shared options</li>
  <li>you must book properly and keep your flight details accurate</li>
</ul>
<p><strong>Simple rule:</strong> If you want the least mental effort, private transfer is the easiest win.</p>

<!-- IMG_1 -->

<h3>Option 2) Shared shuttle transfer (best value when it’s well-organised)</h3>
<p><strong>What it is:</strong> You share a shuttle with other travellers, usually with multiple drop-offs.</p>
<h4>Best for:</h4>
<ul>
  <li>budget-minded travellers</li>
  <li>people who don’t mind extra time for additional stops</li>
  <li>daytime arrivals (when delays feel less stressful)</li>
</ul>
<h4>Why it can be great:</h4>
<ul>
  <li>often cheaper than private transfers</li>
  <li>still pre-arranged, so it’s more structured than “figure it out on arrival”</li>
</ul>
<h4>Potential downsides:</h4>
<ul>
  <li>you may wait for other passengers</li>
  <li>journey can take longer due to multiple drop-offs</li>
  <li>not ideal if you’re travelling with very small children or you land late</li>
</ul>
<p><strong>UK-friendly tip:</strong> Shared shuttles can be excellent value if you’re relaxed about time. If you’re time-sensitive, go private.</p>

<h3>Option 3) Taxi (simple when you use the official system)</h3>
<p><strong>What it is:</strong> You take a taxi directly from the airport to your destination.</p>
<h4>Best for:</h4>
<ul>
  <li>short-to-medium distances</li>
  <li>confident travellers who like flexibility</li>
  <li>people arriving at normal hours and travelling light</li>
</ul>
<h4>How to make it smooth:</h4>
<ul>
  <li>use the official airport taxi rank</li>
  <li>confirm the route and the payment method calmly before departing</li>
  <li>make sure you’re comfortable with luggage space (especially as a group)</li>
</ul>
<h4>Potential downsides:</h4>
<ul>
  <li>pricing structure and expectations can vary by location</li>
  <li>if you’re tired, it can feel like “too many decisions”</li>
</ul>
<p><strong>Simple rule:</strong> Taxi works best when it’s a straightforward, official airport pickup and you’re not arriving exhausted with kids and five bags.</p>

<h3>Option 4) Public transport (great for cities, mixed for resorts)</h3>
<p><strong>What it is:</strong> Metro, tram, bus, or combinations.</p>
<h4>Best for:</h4>
<ul>
  <li>city stays (especially when the airport is well-connected)</li>
  <li>solo travellers or couples with light luggage</li>
  <li>daytime arrivals</li>
</ul>
<h4>Potential downsides for resort areas:</h4>
<ul>
  <li>resort zones may require multiple changes</li>
  <li>schedules can be less convenient late at night</li>
  <li>not ideal with kids, heavy luggage, or short stays</li>
</ul>
<p><strong>UK-friendly tip:</strong> Public transport is often brilliant for a city base, but for a resort base, it’s usually best used only if you already know the route and timing.</p>

<!-- IMG_2 -->

<h3>Option 5) Car hire (best for exploring-heavy trips)</h3>
<p><strong>What it is:</strong> You drive yourself from the airport.</p>
<h4>Best for:</h4>
<ul>
  <li>travellers planning multiple day trips</li>
  <li>people comfortable driving abroad</li>
  <li>longer stays where exploring is a core part of the holiday</li>
</ul>
<h4>Potential downsides:</h4>
<ul>
  <li>not the easiest choice after a flight (especially at night)</li>
  <li>parking and navigation can add effort depending on your base</li>
</ul>
<p><strong>Simple rule:</strong> Car hire is a lifestyle choice. Only do it if it supports your itinerary.</p>

<p>Driving guide (if you need it later): <a href="/en/guide/driving-in-turkey-as-a-uk-traveller-rules-confidence-tips-what-to-expect">Driving in Turkey as a UK Traveller: Rules and Confidence Tips</a></p>

<h2>The “best transfer” decision: choose by arrival time + travel group</h2>

<h3>If you land late (or you’re exhausted)</h3>
<p><strong>Choose:</strong> private transfer (or a very straightforward official taxi option).</p>
<p><strong>Why:</strong> you don’t want extra waiting, extra stops, or multiple steps.</p>
<p><strong>Simple rule:</strong> Late arrivals = predictability first.</p>

<h3>If you’re travelling with children</h3>
<p><strong>Choose:</strong> private transfer when you can, especially for naps/bedtime routines, child seat needs, and quick door-to-door comfort.</p>
<p>Shared shuttle can still work if your kids are older, you’re arriving daytime, or you’re not time-sensitive.</p>

<p>Family planning help: <a href="/en/guide/all-inclusive-turkey-for-families-uk-parent-checklist">All-Inclusive for Families: The Non-Negotiables</a></p>

<h3>If you’re a couple on a calm reset</h3>
<p><strong>Choose:</strong> private transfer if you want the trip to feel premium from the start.</p>
<p><strong>Choose:</strong> taxi if the distance is short and you’re happy to keep it flexible.</p>
<p><strong>UK-friendly tip:</strong> The transfer sets the mood. A calm arrival often makes the whole week feel smoother.</p>

<h3>If you’re on a tight budget</h3>
<p><strong>Choose:</strong> shared shuttle (well-organised), or public transport for city bases.</p>
<p><strong>Simple rule:</strong> Save money where it doesn’t cost you energy. If a cheaper option adds stress, it’s not real value.</p>

<p>Best value guide: <a href="/en/guide/how-to-get-the-best-all-inclusive-value-in-turkey-from-the-uk">How to Get the Best All-Inclusive Value from the UK</a></p>

<!-- IMG_3 -->

<h2>How to book a reliable transfer (without overthinking)</h2>
<p>You don’t need to become a logistics expert. You just need a short verification routine.</p>

<h3>The booking essentials (do these every time)</h3>
<ul>
  <li>You have a written confirmation (email/app message)</li>
  <li>It includes pickup instructions (where to meet, how to identify driver/desk)</li>
  <li>It includes your flight number (or arrival time) so they can track delays</li>
  <li>It includes luggage and passenger count</li>
  <li>It includes a clear cancellation or change policy (at least in basic terms)</li>
</ul>
<p><strong>Simple rule:</strong> If the pickup plan isn’t clear in writing, choose a different option.</p>

<h3>Transfers with kids: child seats and comfort planning</h3>
<p>This is one of the most important UK parent details.</p>
<p><strong>What to do:</strong> specify child age(s) and seat needs when booking, confirm the seat is provided (if required), and allow extra time if you need buggy/pram handling.</p>
<p><strong>UK-friendly tip:</strong> Even when everything is “fine”, having the child-seat detail sorted before you land is what makes the arrival feel effortless.</p>

<h2>“What to avoid” without stress: calm red flags (avoid surprises)</h2>
<p>This section isn’t about fear—it’s about keeping your holiday smooth.</p>

<h3>Red flag 1: No clear pickup instructions</h3>
<p>If you don’t know where to meet or how to identify your driver/desk, it can become chaotic after landing.</p>
<p><strong>Simple rule:</strong> Clarity equals comfort.</p>

<h3>Red flag 2: Price is unclear or keeps changing</h3>
<p>You want a clean, understandable price structure. If it’s confusing, you can end up spending your first hour doing maths.</p>
<p><strong>UK-friendly tip:</strong> Your arrival hour is not the time for negotiation.</p>

<h3>Red flag 3: No confirmation in writing</h3>
<p>If you don’t have a message with your details, it’s hard to fix problems quickly.</p>

<h3>Red flag 4: No vehicle details for larger groups</h3>
<p>If you’re 3–5 people with suitcases, confirm that luggage space is sufficient.</p>
<p><strong>Simple rule:</strong> “Seats” and “luggage capacity” are not the same thing.</p>

<h3>Red flag 5: Child seat needs brushed off</h3>
<p>If you request a child seat and the response is vague, choose a different provider or option.</p>

<h3>Red flag 6: Pickup depends on “call me when you land” only</h3>
<p>Some systems use calls or messaging, which can be fine, but if everything depends on last-minute communication, it can add stress—especially if you don’t have data yet.</p>

<p>Connectivity help: <a href="/en/guide/turkey-sim-cards-mobile-data-uk-travellers-guide">SIM Cards & eSIM in Turkey: Simple Setup for UK Travellers</a></p>

<!-- IMG_4 -->

<h2>Private transfer vs taxi vs shuttle: quick comparison (UK-friendly)</h2>

<h3>Private transfer</h3>
<ul>
  <li><strong>Best for:</strong> families, late arrivals, comfort-first travellers</li>
  <li><strong>Trade-off:</strong> often costs more</li>
  <li><strong>Big win:</strong> lowest hassle</li>
</ul>

<h3>Shared shuttle</h3>
<ul>
  <li><strong>Best for:</strong> budget travellers, daytime arrivals</li>
  <li><strong>Trade-off:</strong> waiting + multiple stops</li>
  <li><strong>Big win:</strong> value when you’re flexible</li>
</ul>

<h3>Taxi</h3>
<ul>
  <li><strong>Best for:</strong> short straightforward trips, confident travellers</li>
  <li><strong>Trade-off:</strong> you must confirm basics calmly</li>
  <li><strong>Big win:</strong> flexibility</li>
</ul>

<h3>Public transport</h3>
<ul>
  <li><strong>Best for:</strong> cities, light luggage, daytime</li>
  <li><strong>Trade-off:</strong> steps and changes</li>
  <li><strong>Big win:</strong> cost-effective and often efficient in city areas</li>
</ul>

<h2>The “arrival day plan” that makes everything feel easy</h2>
<h3>The no-stress routine</h3>
<ul>
  <li>Keep day 1 schedule light (no big tours)</li>
  <li>Eat something simple</li>
  <li>Hydrate</li>
  <li>Get settled</li>
  <li>Enjoy the first calm evening</li>
</ul>
<p><strong>Simple rule:</strong> Don’t try to “use” arrival day like a full holiday day. Let it be a smooth landing.</p>

<p>Related: <a href="/en/guide/staying-healthy-in-turkey-uk-traveller-checklist-food-sun-heat-hydration">Staying Healthy in Turkey: Simple Rules</a></p>

<h2>Copy-paste questions (use these when booking transfers)</h2>
<ul>
  <li>“Can you confirm the pickup point and how we find you at arrivals?”</li>
  <li>“Is the price fixed for our group, including luggage?”</li>
  <li>“Do you track flight delays using our flight number?”</li>
  <li>“Can you confirm vehicle size for __ adults and __ suitcases?”</li>
  <li>“We need a child seat for age __. Can you confirm it’s provided?”</li>
  <li>“If our flight time changes, what should we do?”</li>
  <li>“Do we pay in advance or on arrival, and what payment methods are accepted?”</li>
  <li>“Can you send written confirmation with all details?”</li>
</ul>

<h2>Quick checklist: Turkey resort transfers (save this)</h2>
<ul>
  <li>Arrival time considered (late/night vs daytime) ✅</li>
  <li>Transfer chosen by travel group (kids vs couples vs friends) ✅</li>
  <li>Written confirmation received ✅</li>
  <li>Pickup instructions clear ✅</li>
  <li>Flight number shared ✅</li>
  <li>Luggage capacity confirmed ✅</li>
  <li>Child seat confirmed (if needed) ✅</li>
  <li>Plan B decided (in case of delays) ✅</li>
</ul>

<p><strong>Simple rule:</strong> If the checklist is done, your holiday starts smoothly.</p>

<h2>FAQ: Resort transfers in Turkey (UK travellers)</h2>

<h3>What’s the most reliable transfer option in Turkey?</h3>
<p>For most UK travellers, a pre-booked private transfer is the most predictable because pickup and destination are planned in advance. Taxis can also work well when you use the official airport system and confirm the basics calmly.</p>

<h3>Is a shared shuttle worth it?</h3>
<p>Yes if you’re flexible with time and arriving at a normal hour. Shared shuttles can be great value, but they may involve waiting and multiple drop-offs.</p>

<h3>Should families book private transfers?</h3>
<p>Often yes, especially with younger children. It reduces steps, protects bedtime routines, and makes day 1 feel much easier—particularly for late arrivals.</p>

<h3>Can we use public transport to get to a resort?</h3>
<p>Sometimes, but it depends on the location and the time you arrive. Public transport is usually easiest for city bases. For resort zones, it can involve multiple steps and may be less convenient with luggage.</p>

<h3>What should we check to avoid surprises?</h3>
<p>Make sure you have written confirmation, clear pickup instructions, a clear price, and the right vehicle size. If travelling with kids, confirm child seat arrangements in advance.</p>

<h3>What if our flight is delayed?</h3>
<p>When you book, include your flight number and ask if they track delays. If your arrival time changes significantly, message the provider as soon as possible using the contact method in your confirmation.</p>

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
