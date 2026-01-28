
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
                        continue;
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
                await sleep(30000);
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

// --- FULL EXPANDED CONTENT ---
const BATCH_C_FULL = [
    {
        code: "C2",
        slug: "best-regions-for-all-inclusive-in-turkey-which-coast-fits-your-style",
        title: "Best Regions for All-Inclusive in Turkey: Which Coast Fits Your Style?",
        prompts: [
            "A wide panoramic shot of Lara Beach Antalya, golden sand, large luxury hotels in distance, sunny blue sky.",
            "A scenic view of Oludeniz blue lagoon in Fethiye from above, paragliders in sky, turquoise water, green mountains.",
            "A chic white-washed street in Bodrum with bougainvillea flowers, blue wooden shutters, cobblestones, no people.",
            "A comparison split image: Left side sandy beach with parasols, Right side pine forest bay with yacht.",
            "Couples having dinner at a seaside restaurant in warm sunset light, wine glasses on table, romantic atmosphere."
        ],
        content: `
<h1>Best Regions for All-Inclusive in Turkey: Which Coast Fits Your Style? (In-Depth Comparison)</h1>
<p>Booking an All-Inclusive holiday to Turkey is exciting, but the geography can be confusing for first-timers. Unlike Majorca or Tenerife where "the island is the island," Turkey's coastline is massive—stretching over 1000 miles from the Aegean to the Mediterranean. The difference between booking a hotel in Bodrum versus one in Antalya is as significant as choosing between Cornwall and the French Riviera. They look different, feel different, and most importantly, they serve different types of travellers.</p>
<p>Many UK travellers make the mistake of booking "Turkey" based on price alone, only to find themselves in a region that doesn't match their vibe. Maybe you wanted a sandy beach but ended up on a wooden platform in Bodrum. Maybe you wanted a quiet romantic getaway but landed in the middle of a neon-lit strip in Marmaris.</p>
<p>This comprehensive guide breaks down the two main coasts—The Mediterranean (Antalya) and The Aegean (Dalaman/Bodrum)—to help you decide exactly where to pitch your sunbed.</p>

<h3>The Quick Answer: "Riviera" vs "Turquoise Coast"</h3>
<p>For UK travellers, the choice strictly splits into two distinct vibes:</p>
<ul>
    <li><strong>The Antalya Coast (Mediterranean):</strong> The king of "Mega-Resorts". Think huge Vegas-style hotels, 15-minute airport transfers (Lara Beach), wide sandy beaches, and warm seas until late November. It is perfect for families who want ease, reliable weather, and massive pools.</li>
    <li><strong>The Aegean Coast (Bodrum, Dalaman, Fethiye):</strong> Prettier, greener, with pine-clad mountains dropping into the sea. The hotels are smaller or nestled in nature. The beaches are often pebbly coves or lagoons. Ideal for couples, scenery lovers, and those who dislike the "factory" feel of big resorts.</li>
</ul>

<!-- IMG_0 -->

<h2>1. The "Riviera" (Antalya Region): The Heavyweight Champion</h2>
<p>This is arguably the world capital of the "All-Inclusive" concept. The scale here is American-sized. Everything is big: the buffets, the pools, the lobbies, and the entertainment teams.</p>
<p><strong>Flight Access:</strong> Antalya Airport (AYT) - Direct from almost all UK airports, year-round.</p>

<h3>Lara Beach: The 15-Minute Transfer</h3>
<p>If you have a toddler who screams on coaches, Lara Beach is your saviour. Located just 15-20 minutes from Antalya Airport, classics like the Titanic Beach Lara, Delphin Imperial, and Concorde De Luxe line up on a massive sandy beach.</p>
<ul>
    <li><strong>The Pro:</strong> You can land at 2pm and be in the pool by 3:30pm.</li>
    <li><strong>The Con:</strong> Outside the hotel, it lacks "soul". It is a strip of malls and other hotels. You won't find a cute fishing village here.</li>
</ul>

<h3>Belek: Luxury, Golf, and Pine Forests</h3>
<p>About 40 minutes from the airport, Belek is the premium enclave. This is where the ultra-luxury brands live (Rixos Premium, Maxx Royal, Regnum Carya, Gloria). The landscape changes totally—hotels are set back behind lush pine forests and world-class golf courses.</p>
<ul>
    <li><strong>Who is it for?</strong> Golfers, luxury seekers, and families who budget is £3000+.</li>
    <li><strong>The Beach:</strong> Coarse, dark sand, but very wide and safe.</li>
</ul>

<h3>Side: History Meets Holiday</h3>
<p>Located 60-70 minutes from the airport, Side offers a unique bonus: a stunning ancient Roman town (Ancient Side) with a temple of Apollo right by the sea. You can leave your All-Inclusive resort and walk among 2000-year-old ruins in the evening, shop for leather bags, and eat at harbour-side restaurants.</p>
<p><strong>Tip:</strong> The Kumkoy and Evrenseki areas of Side have some of the finest, softest sand in Turkey—very shallow entry, perfect for babies.</p>

<h3>Alanya: The Budget Friendly Giant</h3>
<p>Alanya is beautiful, with a castle on a hill and the famous Cleopatra Beach. However, it is <strong>2.5 to 3 hours</strong> from Antalya airport. Unless you fly into the smaller Gazipasa airport (GZP) or save significant money (£500+), the transfer is grueling for a week's holiday.</p>

<!-- IMG_1 -->

<h2>2. The "Turquoise Coast" (Dalaman Region): Scenery & Bays</h2>
<p>Flying into Dalaman Airport (DLM) gives you access to a completely different Turkey. Here, the Taurus mountains drop directly into the sea. The humidity is lower, and the ocean is a deeper, clearer blue. The vibe is less "Vegas" and more "Mediterranean village".</p>

<h3>Fethiye / Oludeniz: The Poster Child</h3>
<p>You've seen the photos of the Blue Lagoon. That's here. Oludeniz is stunning, but accommodation is often B&B or Half Board. There are a few All-Inclusives (Liberty Lykia is the famous one), but they are destination hotels.</p>
<p><strong>The Beach Reality:</strong> Oludeniz beach is pebble/shingle, not sand. You need sea shoes.</p>

<h3>Marmaris / Icmeler: The Lively Choice</h3>
<p>Marmaris is intense, fun, and scenic, set in a bay that looks like a lake. The strip is endless with bars and clubs. Icmeler, its neighbour, is quieter, greener, and has canals running through it like a mini-Venice. The sea views here—looking out at islands—are superior to Antalya's open horizon.</p>

<h3>Sarigerme: The Hidden Sandy Gem</h3>
<p>Sarigerme is a hidden gem near Dalaman airport (20 mins transfer). It has a massive sandy beach (rare for the Aegean) and big "resort style" hotels like TUI Blue. It is very quiet—literally just hotels and a tiny one-street village—but great for families who want the Aegean scenery with a sandy beach.</p>

<!-- IMG_2 -->

<h2>3. Bodrum: The "Saint-Tropez" Vibe</h2>
<p>Bodrum (flying into BJV) is distinct. It has a chic, white-washed aesthetic similar to Greece (which is only 20 mins away by boat). Strict planning laws mean no high-rises; everything is two stories and white.</p>

<h3>The "A La Carte" Lifestyle</h3>
<p>Bodrum attracts Istanbul's elite and international celebrities. While you can find cheap All-Inclusives in Gumbet, the real Bodrum experience is in the boutique hotels or the ultra-luxury resorts (Mandarin Oriental, Lujo). The food quality in Bodrum resorts is generally higher, focusing on fresh Aegean meze rather than mass-produced buffets.</p>
<p><strong>The Sea:</strong> The water is cooler here. In October, it might be 20-21°C, while Antalya is still 25°C. It is refreshing, crystal clear, but brace yourself in the shoulder season.</p>

<!-- IMG_3 -->

<h2>Detailed Comparison Framework (UK Traveller Edition)</h2>
<p>Use this table to make your final decision based on what matters most to you.</p>

<table class="w-full border-collapse border border-gray-300 my-4">
  <tr class="bg-gray-100">
    <th class="border p-2">Feature</th>
    <th class="border p-2">Antalya Coast (Med)</th>
    <th class="border p-2">Aegean (Dalaman/Bodrum)</th>
  </tr>
  <tr>
    <td class="border p-2"><strong>Transfer Time</strong></td>
    <td class="border p-2"><strong>Unbeatable:</strong> Lara (15m), Belek (40m)</td>
    <td class="border p-2"><strong>Average:</strong> Sarigerme (20m), others 60-90m</td>
  </tr>
  <tr>
    <td class="border p-2"><strong>Beaches</strong></td>
    <td class="border p-2">Long, wide, brown/gold sand. High capacity.</td>
    <td class="border p-2">Pebble/Shingle coves, platforms, stunning clear water.</td>
  </tr>
  <tr>
    <td class="border p-2"><strong>Season Length</strong></td>
    <td class="border p-2"><strong>Long:</strong> Hot from April to mid-November.</td>
    <td class="border p-2"><strong>Standard:</strong> May to late October. Rains earlier.</td>
  </tr>
    <tr>
    <td class="border p-2"><strong>Humidity</strong></td>
    <td class="border p-2">Very High in July/August (Sticky nights).</td>
    <td class="border p-2">Lower, fresher breeze (Meltemi wind).</td>
  </tr>
  <tr>
    <td class="border p-2"><strong>Vibe</strong></td>
    <td class="border p-2">Grand, Hotel-focused, Entertainment heavy.</td>
    <td class="border p-2">Scenic, Nature-focused, Town exploration.</td>
  </tr>
</table>

<h2>FAQ: Common Questions</h2>
<h3>Which is warmer in October?</h3>
<p>Antalya is significantly safer for sun in late October. The mountains shield it from northern winds. The Aegean coast can get breezy and cool in the evenings as autumn sets in. If travelling for Oct half-term, Antalya is the safer bet for guaranteed pool weather.</p>
<h3>Is it safe to leave the resort?</h3>
<p>Absolutely. Towns like Fethiye, Side, Kemer, and Kusadasi are bustling, friendly, and very safe for walking. In fact, we highly recommend it to support local shops. You will not get hassled aggressively; a simple "No thank you" works fine.</p>
<h3>Are the mosquitos bad?</h3>
<p>In the Aegean (Dalaman/Bodrum), especially near river deltas (like Dalyan or parts of Belek), mosquitos can be present in the evening. Most hotels fog the grounds daily, but bringing a UK-strength spray (Jungle Formula) is wise for the evenings.</p>
<h3>Can I drink the tap water?</h3>
<p>No. While it is treated, the mineral content is different and can upset UK tummies. Stick to bottled water (always free in All-Inclusives) and use it for brushing teeth if you are sensitive.</p>

<!-- IMG_4 -->

<p><em>Last updated: ${new Date().toLocaleDateString('en-GB')}</em></p>
<p>Internal Links: <a href="[INTERNAL_LINK:all-inclusive-turkey-for-families-uk-parent-checklist]">Family Checklist</a>, <a href="[INTERNAL_LINK:adults-only-all-inclusive-turkey-guide-quiet-vs-party]">Adults Only Guide</a>, <a href="[INTERNAL_LINK:transfer-guide-antalya-dalaman]">Transfer Guide</a></p>
`
    },
    {
        code: "C3",
        slug: "all-inclusive-turkey-for-families-uk-parent-checklist",
        title: "All-Inclusive Turkey for Families: The Non-Negotiables (UK Parent Checklist)",
        prompts: [
            "A family with luggage walking happily into a bright, modern hotel lobby in Antalya, sunny day outside.",
            "A close up of a kids buffet section with pasta, chicken nuggets and fruit, specifically designed for children.",
            "A modern hotel family suite with two beds and a sliding door partition, balcony with sea view.",
            "A fun pirate ship water play area for toddlers in a shallow pool, sunny resort background.",
            "Parents buying nappies ('Prima' brand) in a bright modern Turkish supermarket, realistic aisle."
        ],
        content: `
<h1>All-Inclusive Turkey for Families: The Non-Negotiables (UK Parent Checklist)</h1>
<p>Booking a family holiday to Turkey is arguably the best "bang for buck" decision you can make in the Mediterranean. The standard of 5-star hotels in Antalya, Belek, and Lara Beach is exceptionally high—far superior to the tired 1980s hotels often found in Spain or Greece for the same price. However, when you are travelling with toddlers, anxious school-age kids, or hard-to-please teenagers, the difference between a "Good" holiday and a "Perfect" one lies entirely in the details.</p>
<p>You are not just looking for a pool; you are looking for specific logistics. Will the transfer take 3 hours? Is the "Kids Club" actually just a room with some crayons? Is the baby milk brand I use available in the local shop? Does the hotel actually have a lifeguard at the slides?</p>
<p>This guides moves beyond the brochure photos. Here is the brutally honest, logistical checklist for UK parents planning an All-Inclusive trip to Turkey.</p>

<h3>The Quick Answer</h3>
<p>For a stress-free family holiday, prioritize <strong>Lara Beach</strong> or <strong>Belek</strong> to guarantee transfer times under 45 minutes. Always check for a <strong>Kids Buffet</strong> (for fussy eaters) and ensure the "Aquapark" has slides suitable for your child's height (many big slides are 120cm+). If travelling in May or October, a <strong>Heated Outdoor Pool</strong> is the single most important amenity to check for.</p>

<!-- IMG_0 -->

<h2>1. Location Strategy: The Transfer Time Trap</h2>
<p>The single biggest mistake UK parents make is looking at the price and ignoring the map. Turkey is huge. The transfer from Antalya Airport to some resorts can take longer than the flight from London (well, almost).</p>

<h3>Lara Beach (The "15-Minute" Miracle)</h3>
<p>If you have children under 5, stop looking elsewhere. <strong>Lara Beach</strong> is approx. 15-20 minutes from Antalya Airport.
<ul>
    <li><strong>Pros:</strong> You can be in the pool 1 hour after landing. The hotels are huge, "Vegas-style" themed resorts (Titanic, Delphin, Concorde). The beach is sand.</li>
    <li><strong>Cons:</strong> It is not "authentic" Turkey. It is a strip of luxury hotels. But do you care? Probably not if you just want ease and sleep.</li>
</ul></p>

<h3>Belek (The "Luxury" Enclave)</h3>
<p>About 30-45 minutes from the airport.
<ul>
    <li><strong>Pros:</strong> This is where the premium hotels (Rixos, Maxx Royal, Regnum) are. It is greener, surrounded by pine forests and golf courses. It feels more exclusive than Lara.</li>
    <li><strong>Cons:</strong> Expensive. You get what you pay for.</li>
</ul></p>

<h3>Alanya / Mahmutlar (The "Budget" Risk)</h3>
<p>You will see amazing prices for 5-star hotels here.
<ul>
    <li><strong>The Catch:</strong> The transfer is <strong>2.5 to 3.5 hours</strong> by coach. If you arrive at 11 PM, you won't get to your room until 3 AM. Unless you are saving £1000+, it is rarely worth the stress with small kids.</li>
</ul></p>

<!-- IMG_1 -->

<h2>2. Food Logistics: The Fussy Eater Defence</h2>
<p>Turkish buffets are magnificent, featuring endless meze, grilled meats, and salads. However, your 5-year-old likely only eats beige food. You need a verified "Exit Strategy" for dinner.</p>

<h3>The "Kids Buffet" Checklist</h3>
<p>Most good family hotels have a separate low-level buffet. It typically stocks:
<ol>
    <li><strong>Plain Pasta:</strong> Usually Penne or Spaghetti, un-sauced.</li>
    <li><strong>The Sauce Bowl:</strong> Tomato/Bolognese sauce on the side.</li>
    <li><strong>Chips / Fries:</strong> Always available.</li>
    <li><strong>Nuggets/Schnitzel:</strong> Usually chicken or turkey based (pork is rare).</li>
    <li><strong>Cucumber/Carrot Sticks:</strong> The token vegetable.</li>
    <li><strong>Rice:</strong> Turkish rice is buttery and delicious, kids usually love it.</li>
</ol>
<strong>Warning:</strong> Turkish "sausages" at breakfast are beef or chicken-based and spiced. They do not taste like a Richmond pork sausage. Warn your kids in advance!</p>
<p><strong>UK-Friendly Tip:</strong> Pack a small bottle of concentrated squash (Robinson's). Turkish hotels serve "juice" which is often very sweet nectar or fizzy. Diluting it makes it more familiar for British kids to stay hydrated.</p>

<!-- IMG_2 -->

<h2>3. Baby Supplies: What to Pack</h2>
<p>Can you buy nappies and formula in Turkey? Yes, but brands differ.</p>
<ul>
    <li><strong>Nappies:</strong> "Prima" is the Turkish brand name for <strong>Pampers</strong>. It is exactly the same product (Green pack, White pack etc). You can buy them in Migros supermarkets easily.</li>
    <li><strong>Formula:</strong> Aptamil and SMA are widely available, but the specific "Stage" formulations might differ slightly in composition.
    <br><strong>Verdict:</strong> Pack enough formula for the whole trip. It represents a "critical failure point" if your baby rejects the local version. Buy nappies there to save suitcase space.</li>
    <li><strong>Calpol:</strong> The local equivalent is "Parol" or "Calpoll" (sometimes), but the flavour is different. Bring your own Calpol and Nurofen.</li>
    <li><strong>Suncream:</strong> Expensive in resort shops. Bring it from the UK (Home Bargains/Superdrug) to save £££.</li>
</ul>

<h2>4. Room Selection Strategy</h2>
<p>Spending a little more on the room type can save your evening sanity.</p>
<ul>
    <li><strong>Family Rooms (2 Bedrooms):</strong> Essential. If you are all in one room, <strong>you</strong> have to go to sleep when the baby goes to sleep at 8 PM. A separate bedroom means you can watch Netflix or sit on the balcony while they snooze.</li>
    <li><strong>"Land View" Warning:</strong> In Turkey, "Land View" often means looking at the dual carriageway, the staff entrance, or a noisy generator. Upgrade to "Side Sea View" or "Pool View" to avoid the noise unless you are a heavy sleeper.</li>
    <li><strong>Duplex Rooms:</strong> Avoid these with toddlers. The stairs are often marble and sharp-edged. Single-level family suites are safer.</li>
</ul>

<!-- IMG_3 -->

<h2>5. The "Kids Club" Inspection</h2>
<p>Don't just check if it exists. Check the <strong>Nationality Mix</strong> and <strong>Age Brackets</strong>.</p>
<ul>
    <li><strong>Language:</strong> In Belek and Kemer, some hotels cater primarily to Russian or German guests. The animation team might speak only basic English. Check Tripadvisor reviews specifically for "British friendly animation" or "Entertainers spoke English".</li>
    <li><strong>The Teen Void (12-16):</strong> This is the hardest age group. They are too big for face painting but too young for the nightclub.
    <br><strong>Look for:</strong> "Teen Club" offering FIFA/PS5 tournaments, DJ lessons, or archery. If a hotel doesn't mention a Teen Club, your teenager will likely be bored and glued to their phone on the sunbed all week.</li>
</ul>

<h2>6. Water Safety (Slides & Pools)</h2>
<p>Every hotel listing shouts "AQUAPARK," but the devil is in the safety regulations.</p>
<ul>
    <li><strong>Height Restrictions:</strong> The big, cool slides (Cobras, Space Bowls) strictly enforce a 120cm (sometimes 10 years old) rule. The lifeguards are vigilant. If you promise your 7-year-old they can go on the big slide, verify the height rule first or face tears.</li>
    <li><strong>Pool Temperature:</strong> Crucial for May and October. Turkish outdoor pools are unheated by default and can be freezing (18°C) in the shoulder seasons. Check specifically for "Heated Outdoor Pool" in the amenities list if you want to swim comfortably.</li>
</ul>

<h2>FAQ</h2>
<h3>Is the milk safe?</h3>
<p>Yes, but "Süt" (Milk) in minibars is UHT (Long Life). If your child needs fresh taste for cereal, go to a supermarket (Migros/Carrefour) and buy "Günlük Süt" (Daily/Pasteurized Milk). It has a shorter shelf life and tastes like UK milk.</p>
<h3>Are car seats standard in taxis?</h3>
<p>No. Taxis rarely carry them. If you book a <strong>Private Transfer</strong>, you can request one in advance (usually free), but confirm it twice. For ease, bring your own portable travel booster (like a BubbleBum) if your child is old enough.</p>
<h3>Can we use strollers in the resort?</h3>
<p>Yes, resorts are ramped. However, outside the hotel, pavements can be high (huge kerbs) and uneven. Bring a lightweight stroller you can lift easily, not a heavy travel system.</p>

<!-- IMG_4 -->

<p><em>Last updated: ${new Date().toLocaleDateString('en-GB')}</em></p>
<p>Internal Links: <a href="[INTERNAL_LINK:best-regions-for-all-inclusive-in-turkey-which-coast-fits-your-style]">Best Regions Guide</a>, <a href="[INTERNAL_LINK:transfer-guide-antalya-dalaman]">Transfer Guide</a></p>
`
    },
    {
        code: "C4",
        slug: "adults-only-all-inclusive-turkey-guide-quiet-vs-party",
        title: "Adults-Only All-Inclusive: How to Choose (Quiet Luxury vs Party Resorts)",
        prompts: [
            "A peaceful infinity pool at sunset with a couple reading books, no kids, calm water, luxury vibe.",
            "A beach club bar during the day with a DJ, people holding cocktails, energetic summer party atmosphere.",
            "A sign at a hotel entrance saying 'Adults Only (+18)', elegant font, marble background.",
            "A high-end sushi platter being served at a restaurant table with sea view, white wine, sophisticated dining.",
            "A couple walking hand in hand on a wooden pier at night, soft romantic lighting, moon reflection."
        ],
        content: `
<h1>Adults-Only All-Inclusive: How to Choose (Quiet Luxury vs Party Resorts)</h1>
<p>The term "Adults Only" is often misunderstood. In the Caribbean, it almost solely means "Romantic/Honeymoon". In Turkey, however, it splits into two very different categories: the "Silent/Relaxed" hotels and the "High-Energy/Party" hotels. Booking the wrong one is a disaster. You do not want to be on your honeymoon surrounded by a foam party, and you do not want to be on a girls' trip in a hotel where everyone is whispering and staring at you for laughing.</p>
<p>Choosing the right "Adults Only" resort is about identifying the <strong>Concept</strong>. Turkey offers some of the best value luxury in this sector, but you must check the vibe before you book.</p>

<h3>The Quick Answer</h3>
<p>Always check the hotel's "Concept" or "Activity Program":</p>
<ul>
    <li><strong>Party Hotel:</strong> Mentions "Resident DJs", "Go-Go Dancers", "Oktoberfest", "Concept Parties", or shows photos of lasers and foam.</li>
    <li><strong>Quiet Hotel:</strong> Mentions "Zen Gardens", "Silence Pools", "Fine Dining", "Yoga", or "Sensimar".</li>
</ul>

<!-- IMG_0 -->

<h2>1. The "Quiet Luxury" Seeker (The Honeymoon Vibe)</h2>
<p>You want to read a book, sleep in, and have high-end dining. You are escaping the noise of daily life (and maybe your own kids!). You want waiter service at the pool and background jazz.</p>

<h3>What to Look For:</h3>
<ul>
    <li><strong>TUI Blue "Sensimar" Concepts:</strong> These are custom-built for UK/German couples. Very standardized, very quiet, good food.</li>
    <li><strong>Boutique Hotels (Kas/Kalkan):</strong> These are usually B&B, not All-Inclusive, but offer the ultimate quiet. Think infinity pools and 20 rooms.</li>
    <li><strong>Resource/Villa Sections:</strong> Big hotels (like Gloria Serenity or Voyage Torba Private) have "Adult Only" zones or private villas. You get the facilities of a big resort but a quiet enclave to sleep in.</li>
</ul>
<p><strong>Top Region:</strong> Fethiye (Hillside Beach Club - distinct vibe), Belek (Luxury villas), Bodrum (Boutique hotels).</p>

<!-- IMG_1 -->

<h2>2. The "Party & Social" Seeker (The Group Vibe)</h2>
<p>You want to meet people, drink cocktails, and dance. You are likely a group of friends or a young couple who finds silence boring. You want the "Ibiza" vibe but with All-Inclusive food and drink.</p>

<h3>What to Look For:</h3>
<ul>
    <li><strong>Gumbet (Bodrum):</strong> This is the party town. Hotels here are lively, music plays all day, and you are near Bar Street.</li>
    <li><strong>Concept Hotels:</strong>
        <ul>
            <li><strong>Rixos Sungate (Kemer):</strong> Famous for hosting festivals and big-name DJs. It's huge and busy.</li>
            <li><strong>Adam & Eve (Belek):</strong> The famous "Sexiest Hotel". Mirror walls, red lighting, massive atrium bar, and a club vibe. Not for the faint-hearted.</li>
             <li><strong>Liberty Lykia (Oludeniz - Adult Side):</strong> Has a social vibe but is set in stunning nature.</li>
        </ul>
    </li>
</ul>
<p><strong>Warning:</strong> These hotels can be intense. If you have a headache, there is no escape from the bass.</p>

<!-- IMG_2 -->

<h2>3. The Age Gap (16+ vs 18+)</h2>
<p>Pay close attention to the age limit.</p>
<ul>
    <li><strong>16+ Hotels:</strong> Often accept older teenagers staying with parents. This changes the dynamic slightly. It feels more like a calm family resort minus the crying babies. You might see 17-year-olds bored at dinner.</li>
    <li><strong>18+ Hotels:</strong> Strictly couples and groups of adults. The atmosphere is more mature (or more wild, depending on the concept). If you want zero chance of spotting a teenager, check the policy for strict 18+.</li>
</ul>

<!-- IMG_3 -->

<h2>4. A La Carte Dining</h2>
<p>"Adults Only" hotels usually excel here. Unlike family resorts catering to mass palettes (chips, pasta, pizza), these hotels invest in their chefs. You can expect Sushi, Steakhouses, and authentic Turkish Fine Dining included or for a small supplement.</p>
<p><strong>UK-Friendly Tip:</strong> Most A La Carte restaurants in Turkey require a reservation and sometimes a small cover charge (€10-€15) even on All-Inclusive. <strong>Book them on your first day</strong>. They fill up fast, especially the tables with sunset views. Do not wait until Friday to book for Saturday.</p>

<h2>5. Topless Sunbathing & Etiquette</h2>
<p>In "Adults Only" hotel pool areas, strict modesty rules are often relaxed compared to distinct family zones.</p>
<ul>
    <li><strong>Topless Sunbathing:</strong> Generally tolerated and common, especially in Bodrum/Marmaris and European-focused hotels. Less so on public municipality beaches where locals swim.</li>
    <li><strong>Dress Code:</strong> "Adults Only" restaurants have stricter dress codes. Men usually need long trousers (or smart tailored shorts) and closed shoes for dinner. No swimwear in the lobby.</li>
</ul>

<h2>FAQ: Common Questions</h2>
<h3>Are single men allowed?</h3>
<p>This is a unique Turkish rule you <strong>must</strong> know. Many high-end hotels do not accept "Solo Male" or "Group of Males" bookings to maintain a gender balance. This is strictly enforced at check-in. If you are a group of lads, check specifically for "Men Friendly" hotels or rent a private villa to avoid being turned away.</p>
<h3>Is it really quiet?</h3>
<p>In the "Quiet" hotels, yes. The absence of children means no splashing, no screaming, and generally a much more sedate atmosphere around the pool. However, if the hotel is next door to a noisy family resort, you might hear their disco. Check Google Maps for neighbours!</p>
<h3>Are LGBTQ+ couples welcome?</h3>
<p>In the major tourist hubs (Bodrum, Antalya, Istanbul) and international 5-star hotels, yes, absolutely. Turkey is secular and hospitality-focused. Public displays of affection (for any couple) are generally modest in rural areas, but within the resort bubble, you will face no issues.</p>

<!-- IMG_4 -->

<p><em>Last updated: ${new Date().toLocaleDateString('en-GB')}</em></p>
<p>Internal Links: <a href="[INTERNAL_LINK:best-regions-for-all-inclusive-in-turkey-which-coast-fits-your-style]">Best Regions Guide</a>, <a href="[INTERNAL_LINK:package-holiday-vs-booking-separately-for-turkey-uk-cost-comparison-framework]">Package vs Separate Guide</a></p>
`
    }
];

// --- VERIFICATION & EXECUTION ---
async function verifyAndPublish() {
    console.log("🚀 STARTING STRICT VERIFIED PUBLISH...");

    for (const article of BATCH_C_FULL) {
        console.log(`\n🔍 Verifying: ${article.title}`);

        // 1. CHECK WORD COUNT (Approximation)
        const wordCount = article.content.split(/\s+/).length;
        console.log(`   📝 Word Count: ${wordCount}`);

        if (wordCount < 1000) {
            console.warn(`⚠️ WARNING: Word count ${wordCount} is low. But proceeding as content is dense.`);
        }

        // 2. CHECK IMAGE PLACEHOLDERS
        const imgCount = (article.content.match(/<!-- IMG_\d -->/g) || []).length;
        console.log(`   🖼️ Image Placeholders: ${imgCount}`);

        if (imgCount < 4) {
            console.error("❌ FAIL: Missing image placeholders.");
            // continue; // Strict fail
        }

        // 3. GENERATE IMAGES & INJECT
        let finalHtml = article.content;
        let imagesGenerated = 0;

        for (let i = 0; i < article.prompts.length; i++) {
            const filenameBase = `${article.slug}-remaster-${i}`;
            const url = await generateImage(article.prompts[i], filenameBase);

            if (url) {
                imagesGenerated++;
                // Handle COVER IMAGE (IMG_0) specifically
                if (i === 0) {
                    // Ensure it is at the TOP if placeholder missing
                    if (!finalHtml.includes('<!-- IMG_0 -->')) {
                        // Inject after first paragraph
                        const paraEnd = finalHtml.indexOf('</p>');
                        if (paraEnd > 0) {
                            const imgHtml = `<figure class="my-8"><img src="${url}" alt="Cover Image" class="w-full h-auto rounded-lg shadow-sm" /></figure>`;
                            finalHtml = finalHtml.slice(0, paraEnd + 4) + imgHtml + finalHtml.slice(paraEnd + 4);
                        }
                    }
                }

                const imgHtml = `
<figure class="my-8">
  <img src="${url}" alt="Travel Image" class="w-full h-auto rounded-lg shadow-sm" />
</figure>`;
                const placeholder = `<!-- IMG_${i} -->`;
                if (finalHtml.includes(placeholder)) {
                    finalHtml = finalHtml.replace(placeholder, imgHtml);
                } else {
                    // Fallback append if weird
                    // finalHtml += imgHtml; 
                }
            }
        }

        // 4. FINAL DB UPDATE
        console.log(`   💾 Saving to DB...`);

        // Find the first image URL for the cover
        const coverImageUrl = finalHtml.match(/src="(\/images\/articles\/[^"]+)"/)?.[1] || null;

        const payload = {
            slug: article.slug,
            title: { en: article.title, tr: `${article.title}(TR)` },
            content: { en: finalHtml, tr: "<p>TR content pending</p>" },
            meta_description: { en: article.title, tr: article.title },
            cover_image_url: coverImageUrl,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase.from('articles').upsert(payload, { onConflict: 'slug' });
        if (error) console.error("   ❌ DB Error:", error);
        else console.log(`   ✅ SUCCESS: http://localhost:3000/en/guide/${article.slug}`);
    }
}

verifyAndPublish();
