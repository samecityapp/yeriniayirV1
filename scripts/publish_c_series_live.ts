
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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLES_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'articles');
const REALISM_SUFFIX = ", photorealistic style, natural lighting, shot on 35mm film, candid travel photography, authentic atmosphere, no filters, slightly imperfect composition for realism, 4k, highly detailed textures.";

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- IMAGEN 3 GENERATOR ---
async function generateImage(prompt: string, filenameBase: string): Promise<string | null> {
    const fullPrompt = prompt + REALISM_SUFFIX;

    // Check for ANY existing file to avoid duplicate/cost (Smart Resume)
    // If user wants fresh, we can disable this, but for speed let's keep it unless forced
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
                        continue;
                    }
                    if (response.status === 400 || response.status === 500) {
                        // Safety filter or bad request
                        console.warn(`⚠️ Blocked/Error: ${response.status}`);
                        return null; // Don't crash, just skip image
                    }
                }

                const data = await response.json();
                if (!data.predictions || !data.predictions[0]) return null;

                const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
                fs.writeFileSync(localPath, buffer);
                console.log(`✅ Saved: ${localPath}`);
                console.log("⏳ Cooling down API (30s)...");
                await sleep(30000);
                return `/images/articles/${filename}`;
            } catch (err) {
                if (attempt === 3) throw err;
                console.warn(`Retry...`);
            }
        }
    } catch (error) {
        console.error("Gen Failed:", error);
        return null;
    }
    return null;
}

// --- THE DATA (C2, C3, C4) ---
const BATCH_C = [
    {
        code: "C2",
        slug: "best-regions-for-all-inclusive-in-turkey-which-coast-fits-your-style",
        title: "Best Regions for All-Inclusive in Turkey: Which Coast Fits Your Style?",
        content: `
<h1>Best Regions for All-Inclusive in Turkey: Which Coast Fits Your Style?</h1>
<h3>The Quick Answer</h3>
<p>For UK travellers, the choice usually splits into two distinct vibes. <strong>The Antalya Coast (Mediterranean)</strong> is the king of "Mega-Resorts"—think huge hotels, 15-minute airport transfers (Lara Beach), sandy beaches, and warm seas until late October. It is perfect for families who want ease. <strong>The Aegean Coast (Bodrum, Dalaman, Fethiye)</strong> offers a prettier, greener landscape with bays and islands, slightly cooler water, and a more "European" town feel, ideal for couples or those who want to explore outside the hotel.</p>

<h2>1. The "Riviera" (Antalya, Belek, Lara, Side)</h2>
<p>This is arguably the world capital of the "All-Inclusive" concept. The scale here is American-sized.</p>
<ul>
  <li><strong>Best For:</strong> Families with toddlers (short transfers), shoulder-season travellers (October/April warmth), and luxury seekers.</li>
  <li><strong>The Vibe:</strong> Grandiose. Large marble lobbies, massive aquaparks, and long stretches of sandy beach.</li>
  <li><strong>UK-Friendly Tip:</strong> If you want a transfer under 20 minutes, pick <strong>Lara Beach</strong>. If you want pine forests and golf, pick <strong>Belek</strong>. Avoid Alanya if you hate 2-hour bus rides.</li>
</ul>

<!-- IMG_0 -->

<h2>2. The "Turquoise Coast" (Dalaman, Marmaris, Fethiye)</h2>
<p>Here, the mountains drop directly into the sea. The humidity is lower, and the scenery is spectacular.</p>
<ul>
  <li><strong>Best For:</strong> Couples, active families, and scenery lovers.</li>
  <li><strong>The Vibe:</strong> More intimate. Hotels are often nestled in bays. You are more likely to take a boat trip here than in Antalya.</li>
  <li><strong>Simple Rule:</strong> The season is shorter here. It might rain in late October, whereas Antalya is still sunny.</li>
</ul>

<!-- IMG_1 -->

<h2>3. Bodrum: The "Saint-Tropez" of Turkey</h2>
<p>Bodrum is distinct. It has a chic, white-washed aesthetic similar to Greece.</p>
<p>While there are massive resorts, the charm here is the town itself. It is sophisticated, heavily visited by Istanbul's elite, and offers fantastic nightlife that feels classy, not tacky.</p>

<!-- IMG_2 -->

<h2>Comparison Table: Choosing Your Base</h2>
<table class="w-full border-collapse border border-gray-300 my-4">
  <tr class="bg-gray-100">
    <th class="border p-2">Feature</th>
    <th class="border p-2">Antalya Coast</th>
    <th class="border p-2">Aegean (Dalaman/Bodrum)</th>
  </tr>
  <tr>
    <td class="border p-2"><strong>Transfer Time</strong></td>
    <td class="border p-2">Fast (15-30 mins for Lara/Belek)</td>
    <td class="border p-2">Medium (45-90 mins usually)</td>
  </tr>
  <tr>
    <td class="border p-2"><strong>Beaches</strong></td>
    <td class="border p-2">Long, wide, sandy strips</td>
    <td class="border p-2">Pebbly coves & platforms (clearer water)</td>
  </tr>
  <tr>
    <td class="border p-2"><strong>Season</strong></td>
    <td class="border p-2">Long (April to Nov)</td>
    <td class="border p-2">Standard (May to Oct)</td>
  </tr>
</table>

<!-- IMG_3 -->

<h2>FAQ: Common Questions</h2>
<h3>Which is warmer in October?</h3>
<p>Antalya is significantly safer for sun in late October. The Aegean coast can get breezy and cooler in the evenings as autumn sets in.</p>
<h3>Is it safe to leave the resort?</h3>
<p>Absolutely. Towns like Fethiye or Side are bustling, friendly, and walking-safe. In fact, we recommend it to support local shops.</p>

<!-- IMG_4 -->

<p><em>Last updated: ${new Date().toLocaleDateString('en-GB')}</em></p>
`,
        prompts: [
            "A wide panoramic shot of Lara Beach Antalya, golden sand, large luxury hotels in distance, sunny blue sky.",
            "A scenic view of Oludeniz blue lagoon in Fethiye from above, paragliders in sky, turquoise water, green mountains.",
            "A chic white-washed street in Bodrum with bougainvillea flowers, blue wooden shutters, cobblestones, no people.",
            "A comparison split image: Left side sandy beach with parasols, Right side pine forest bay with yacht.",
            "Couples having dinner at a seaside restaurant in warm sunset light, wine glasses on table, romantic atmosphere."
        ]
    },
    {
        code: "C3",
        slug: "all-inclusive-turkey-for-families-uk-parent-checklist",
        title: "All-Inclusive Turkey for Families: The Non-Negotiables (UK Parent Checklist)",
        content: `
<h1>All-Inclusive Turkey for Families: The Non-Negotiables (UK Parent Checklist)</h1>
<h3>The Quick Answer</h3>
<p>For a stress-free family holiday, prioritize <strong>Lara Beach</strong> or <strong>Belek</strong> to guarantee transfer times under 45 minutes. Always check for a <strong>Kids Buffet</strong> (for fussy eaters) and ensure the "Aquapark" has slides suitable for your child's height (many big slides are 120cm+). If travelling in May or October, a <strong>Heated Outdoor Pool</strong> is the single most important amenity to check for.</p>

<h2>1. Transfer Times: The Toddler Ticking Clock</h2>
<p>Nothing kills the holiday vibe quicker than a 3-hour coach ride after a 4-hour flight.</p>
<ul>
    <li><strong>Lara Beach:</strong> 15-20 mins. (Gold Standard)</li>
    <li><strong>Belek:</strong> 30-45 mins. (Excellent)</li>
    <li><strong>Side:</strong> 60-75 mins. (Manageable)</li>
    <li><strong>Alanya:</strong> 2.5 - 3 hours. (Avoid with under-5s)</li>
</ul>

<!-- IMG_0 -->

<h2>2. Food: The "Nugget Strategy"</h2>
<p>Turkish food is delicious, but kids can be overwhelmed by huge buffets. Look specifically for a hotel with a dedicated <strong>"Kids Corner"</strong>.</p>
<p><strong>UK-Friendly Tip:</strong> Pack a small bottle of concentrated squash (Robinson's). Turkish hotels serve "juice" which is often very sweet nectar. Diluting it makes it more familiar for British kids.</p>

<!-- IMG_1 -->

<h2>3. Room Types: Separation is Key</h2>
<p>Standard rooms mean you sit in the dark from 8pm when the baby sleeps.
<br><strong>Simple Rule:</strong> Always check the price diff for a "Family Room" or "Dublex". It is often only £100-£200 more for the week but gives you a separate sleeping area or at least a partition.</p>

<!-- IMG_2 -->

<h2>4. Pools and Slides</h2>
<p>Check the fine print on slides. "Aquapark" can mean anything from one slide to a massive complex.</p>
<ul>
    <li><strong>Height Restrictions:</strong> Strictly enforced. 120cm is the magic number for the big Cobra slides.</li>
    <li><strong>Temperature:</strong> Unheated pools in October are 18-19°C. That is bracing!</li>
</ul>

<!-- IMG_3 -->

<h2>FAQ</h2>
<h3>Can I buy nappies there?</h3>
<p>Yes, "Prima" is the Turkish name for Pampers. They are identical. Sold in every Migros.</p>
<h3>Is the milk safe?</h3>
<p>Yes, but "Süt" (Milk) in minibars is UHT. If your child needs fresh taste, buy "Günlük Süt" (Daily Milk) from a supermarket.</p>

<!-- IMG_4 -->

<p><em>Last updated: ${new Date().toLocaleDateString('en-GB')}</em></p>
`,
        prompts: [
            "A family with luggage walking happily into a bright, modern hotel lobby in Antalya, sunny day outside.",
            "A close up of a kids buffet section with pasta, chicken nuggets and fruit, specifically designed for children.",
            "A modern hotel family suite with two beds and a sliding door partition, balcony with sea view.",
            "A fun pirate ship water play area for toddlers in a shallow pool, sunny resort background.",
            "Parents buying nappies ('Prima' brand) in a bright modern Turkish supermarket, realistic aisle."
        ]
    },
    {
        code: "C4",
        slug: "adults-only-all-inclusive-turkey-guide-quiet-vs-party",
        title: "Adults-Only All-Inclusive: How to Choose (Quiet Luxury vs Party Resorts)",
        content: `
<h1>Adults-Only All-Inclusive: How to Choose (Quiet Luxury vs Party Resorts)</h1>
<h3>The Quick Answer</h3>
<p>Not all "Adults-Only" are created equal. In Turkey, they fall into two camps: <strong>"Quiet/Romantic"</strong> (Think: Yoga, silent pools, candlelight dinners, Bodrum/Gocek vibes) and <strong>"Party/Social"</strong> (Think: DJ by the pool at 2pm, vodka mixers, neon lights, Adam&Eve style). Do not mix these up, or you will hate your week.</p>

<h2>1. The "Quiet Luxury" Seeker</h2>
<p>You want to read a book, sleep in, and have high-end dining.</p>
<ul>
    <li><strong>Look For:</strong> "Sensimar" concepts, small boutique hotels in Kas or Kalkan (often just B&B but very quiet), or specific "Residence" areas of bigger resorts in Belek (like Gloria Serenity).</li>
    <li><strong>Vibe:</strong> Soft jazz, no animation team, waiter service at the lounger.</li>
</ul>

<!-- IMG_0 -->

<h2>2. The "Party & Social" Seeker</h2>
<p>You want to meet people, drink cocktails, and dance.</p>
<ul>
    <li><strong>Look For:</strong> Hotels in Gumbet (Bodrum) or specific "Party Concept" hotels like Rixos Sungate (zones) or Adam&Eve in Belek (famous for its mirror décor and club vibe).</li>
    <li><strong>Vibe:</strong> High energy, foam parties, loud music during the day.</li>
</ul>

<!-- IMG_1 -->

<h2>3. The Age Gap (16+ vs 18+)</h2>
<p><strong>Simple Rule:</strong> Hotels marked "16+" often accept older teenagers staying with parents. Hotels marked "18+" are strictly couples/groups. If you want zero chance of spotting a teenager, check the policy.</p>

<!-- IMG_2 -->

<h2>4. A La Carte Dining</h2>
<p>"Adults Only" hotels usually excel here. Unlike family resorts catering to mass palettes, these hotels often have Sushi, Steakhouse, and Fine Dining included.</p>

<!-- IMG_3 -->

<h2>FAQ</h2>
<h3>Is top-less sunbathing allowed?</h3>
<p>In "Adults Only" hotel pool areas, it is generally tolerated and common, especially in Bodrum/Marmaris. Less so on public municipality beaches.</p>
<h3>Are single men allowed?</h3>
<p>This is a unique Turkish rule. Many hotels do not accept "Solo Male" or "Group of Males" bookings to maintain a gender balance. Always check before booking a 'stag do'.</p>

<!-- IMG_4 -->

<p><em>Last updated: ${new Date().toLocaleDateString('en-GB')}</em></p>
`,
        prompts: [
            "A peaceful infinity pool at sunset with a couple reading books, no kids, calm water, luxury vibe.",
            "A beach club bar during the day with a DJ, people holding cocktails, energetic summer party atmosphere.",
            "A sign at a hotel entrance saying 'Adults Only (+18)', elegant font, marble background.",
            "A high-end sushi platter being served at a restaurant table with sea view, white wine, sophisticated dining.",
            "A couple walking hand in hand on a wooden pier at night, soft romantic lighting, moon reflection."
        ]
    }
];

async function run() {
    console.log("🚀 STARTING LIVE PREVIEW GENERATION (BATCH C2, C3, C4)...");

    for (const article of BATCH_C) {
        console.log(`\n📄 Processing: ${article.title}`);

        let finalHtml = article.content;

        // Generate Images & Inject
        for (let i = 0; i < article.prompts.length; i++) {
            const filenameBase = `${article.slug}-remaster-${i}`;
            const url = await generateImage(article.prompts[i], filenameBase);

            if (url) {
                const imgHtml = `
<figure class="my-8">
  <img src="${url}" alt="Travel Guide Image" class="w-full h-auto rounded-lg shadow-sm" />
</figure>`;
                // Inject
                const placeholder = `<!-- IMG_${i} -->`;
                if (finalHtml.includes(placeholder)) {
                    finalHtml = finalHtml.replace(placeholder, imgHtml);
                } else {
                    finalHtml += imgHtml;
                }
            }
        }

        // Save to DB
        const payload = {
            slug: article.slug,
            title: { en: article.title, tr: `${article.title}(TR)` },
            content: { en: finalHtml, tr: "<p>TR pending</p>" }, // Placeholder TR
            meta_description: { en: article.title, tr: article.title },
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase.from('articles').upsert(payload, { onConflict: 'slug' });
        if (error) console.error("❌ DB Error:", error);
        else console.log(`✅ LIVE: http://localhost:3000/en/guide/${article.slug}`);
    }
}

run();
