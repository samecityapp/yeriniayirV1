
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleAuth } from 'google-auth-library';

dotenv.config({ path: '.env.local' });

const IMAGEN_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const IMAGEN_LOCATION = 'us-central1';
const IMAGEN_MODEL_ID = 'imagen-3.0-generate-001';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLES_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'articles');

// --- EXPANDED CONTENT (Target: 1200 words) ---
const ARTICLE_DATA = {
    slug: 'all-inclusive-turkey-for-families-uk-parent-checklist',
    title: 'All-Inclusive Turkey for Families: The Ultimate UK Parent Survival Guide',
    content: `
<h1>All-Inclusive Turkey for Families: The Ultimate UK Parent Survival Guide</h1>
<p>Booking a family holiday to Turkey is arguably the best "bang for buck" decision you can make in the Mediterranean. The standard of 5-star hotels in Antalya, Belek, and Lara Beach is exceptionally high—far superior to the tired 1980s hotels often found in Spain or Greece for the same price. However, when you are travelling with toddlers, anxious school-age kids, or hard-to-please teenagers, the difference between a "Good" holiday and a "Perfect" one lies entirely in the details.</p>
<p>You are not just looking for a pool; you are looking for specific logistics. Will the transfer take 3 hours? Is the "Kids Club" actually just a room with some crayons? Is the baby milk brand I use available in the local shop?</p>
<p>This guides moves beyond the brochure photos. Here is the brutally honest, logistical checklist for UK parents planning an All-Inclusive trip to Turkey.</p>

<h2>1. Location Strategy: The Transfer Time Trap</h2>
<p>The single biggest mistake UK parents make is looking at the price and ignoring the map. Turkey is huge. The transfer from Antalya Airport to some resorts can take longer than the flight from London.</p>

<h3>Lara Beach (The "15-Minute" Miracle)</h3>
<p>If you have children under 5, stop looking elsewhere. <strong>Lara Beach</strong> is approx. 15-20 minutes from Antalya Airport.
<ul>
    <li><strong>Pros:</strong> You can be in the pool 1 hour after landing. The hotels are huge, "Vegas-style" themed resorts (Titanic, Delphin, Concorde).</li>
    <li><strong>Cons:</strong> It is not "authentic" Turkey. It is a strip of luxury hotels. But do you care? Probably not if you just want ease.</li>
</ul>
</p>

<h3>Belek (The "Luxury" Enclave)</h3>
<p>About 30-45 minutes from the airport.
<ul>
    <li><strong>Pros:</strong> This is where the premium hotels (Rixos, Maxx Royal, Regnum) are. It is greener, surrounded by pine forests and golf courses. It feels more exclusive than Lara.</li>
    <li><strong>Cons:</strong> Expensive. You get what you pay for.</li>
</ul>
</p>

<h3>Alanya / Mahmutlar (The "Budget" Risk)</h3>
<p>You will see amazing prices for 5-star hotels here.
<ul>
    <li><strong>The Catch:</strong> The transfer is <strong>2.5 to 3.5 hours</strong> by coach. If you arrive at 11 PM, you won't get to your room until 3 AM. Unless you are saving £1000+, it is rarely worth the stress with small kids.</li>
</ul>
</p>

<!-- IMG_0 -->

<h2>2. The "Aquapark" Reality Check</h2>
<p>Every hotel listing shouts "AQUAPARK," but the devil is in the safety regulations.
<ul>
    <li><strong>Height Restrictions:</strong> The big, cool slides (Cobras, Space Bowls) strictly enforce a 120cm (sometimes 10 years old) rule. The lifeguards are vigilant. If you promise your 7-year-old they can go on the big slide, you might face a week of tears.</li>
    <li><strong>The "Mid-Size" Gap:</strong> Look for hotels that have a specific "Junior" slide section—bigger than the baby splash park, but smaller than the adult adrenaline slides. Hotels like <em>Gloria Golf</em> or <em>Land of Legends</em> excel at this.</li>
    <li><strong>Heated Pools:</strong> Crucial for May and October. Turkish outdoor pools are unheated by default and can be freezing (18°C) in the shoulder seasons. Check specifically for "Heated Outdoor Pool" in the amenities list.</li>
</ul>
</p>

<!-- IMG_1 -->

<h2>3. Food Logistics: The Fussy Eater Defence</h2>
<p>Turkish buffets are magnificent, featuring endless meze, grilled meats, and salads. However, your 5-year-old likely only eats beige food.
<br><strong>The "Kids Buffet" Checklist:</strong>
 معظم family hotels have a separate low-level buffet. It must stock:
<ol>
    <li><strong>Plain Pasta:</strong> Usually Penne or Spaghetti, un-sauced.</li>
    <li><strong>The Sauce Bowl:</strong> Tomato sauce on the side.</li>
    <li><strong>Chips / Fries:</strong> Always available.</li>
    <li><strong>Nuggets/Schnitzel:</strong> Usually chicken or turkey based.</li>
    <li><strong>Cucumber/Carrot Sticks:</strong> The token vegetable.</li>
</ol>
<strong>Warning:</strong> Turkish "sausages" at breakfast are beef or chicken-based and spiced. They do not taste like a Richmond pork sausage. Warn your kids in advance!</p>

<h2>4. Baby Supplies: What to Pack</h2>
<p>Can you buy nappies and formula in Turkey? Yes, but...
<ul>
    <li><strong>Nappies:</strong> "Prima" is the Turkish brand name for <strong>Pampers</strong>. It is exactly the same product. You can buy them in Migros supermarkets easily.</li>
    <li><strong>Formula:</strong> Aptamil and SMA are widely available, but the specific "Stage" formulations might differ slightly.
    <br><strong>Verdict:</strong> Pack enough formula for the whole trip. It represents a "critical failure point" if your baby rejects the local version. Buy nappies there to save suitcase space.</li>
    <li><strong>Calpol:</strong> The local equivalent is "Parol" (Paracetamol syrup), but the flavour is different. Bring your own Calpol.</li>
</ul>
</p>

<!-- IMG_2 -->

<h2>5. The "Kids Club" Inspection</h2>
<p>Don't just check if it exists. Check the <strong>Nationality Mix</strong> and <strong>Age Brackets</strong>.
<ul>
    <li><strong>Language:</strong> In Belek and Kemer, some hotels cater primarily to Russian or German guests. The animation team might speak only basic English. Check Tripadvisor reviews specifically for "British friendly animation".</li>
    <li><strong>The Teen Void (12-16):</strong> This is the hardest age group. They are too big for face painting but too young for the nightclub.
    <br><strong>Look for:</strong> "Teen Club" offering FIFA/PS5 tournaments, DJ lessons, or archery. If a hotel doesn't mention a Teen Club, your teenager will likely be bored and glued to their phone on the sunbed all week.</li>
</ul>
</p>

<h2>6. Room Selection Strategy</h2>
<p>Spending a little more on the room type can save your evening.
<ul>
    <li><strong>Family Rooms (2 Bedrooms):</strong> Essential. If you are all in one room, <strong>you</strong> have to go to sleep when the baby goes to sleep at 8 PM. A separate bedroom means you can watch Netflix or sit on the balcony.</li>
    <li><strong>"Land View" Warning:</strong> In Turkey, "Land View" often means looking at the dual carriageway or the noisy generator. Upgrade to "Side Sea View" or "Pool View" to avoid the noise.</li>
    <li><strong>Duplex Rooms:</strong> Avoid these with toddlers. The stairs are often marble and sharp-edged.</li>
</ul>
</p>

<!-- IMG_3 -->

<h2>7. Strollers and Pavements</h2>
<p>Inside the hotel, it will be ramped and accessible. Outside is a different story. Pavements in Turkey are often high (high kerbs) and uneven.
<br><strong>The Stroller:</strong> Leave the massive Silver Cross travel system at home. Bring a cheap, lightweight stroller (like a YoYo or a simple umbrella fold) that you can easily lift over kerbs.</p>

<h2>Final Verdict</h2>
<p>Turkey is, without a doubt, the king of All-Inclusive. The service is warmer than Spain, the food is better than Greece, and the pools are bigger than anywhere else. If you pick a hotel in <strong>Lara Beach</strong> or <strong>Belek</strong>, ensure it has a <strong>Heated Pool</strong> (for shoulder season), and book a <strong>Private Transfer</strong> (approx £40), you are set for the perfect stress-free week.</p>
`,
    prompts: [
        "A pristine, modern luxury hotel lobby in Turkey, shiny marble floors, bright sunlight streaming in, check-in desk, welcoming atmosphere, realistic.", // SAFE COVER
        "A close up of a 'Kids Buffet' section in a hotel restaurant, showing plain pasta, chips, and cucumber sticks at a low height for children.",
        "A selection of baby products on a supermarket shelf, showing 'Prima' (Pampers) and Aptamil, realistic shopping.",
        "A bright, modern hotel family room with two separate sleeping areas and a balcony door open to a sea view.",
        "A private Mercedes Vito transfer van with sliding door open, waiting at a sunny airport curb, ready for family."
    ]
};

const REALISM_SUFFIX = ", photorealistic style, natural lighting, shot on 35mm film, candid travel photography, authentic atmosphere, no filters, slightly imperfect composition for realism, 4k, highly detailed textures.";

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImage(prompt: string, filename: string): Promise<string | null> {
    const fullPrompt = prompt + REALISM_SUFFIX;
    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);

    // Force regenerate strictly for this fix
    // if (fs.existsSync(localPath)) ... NO, we overwrite to ensure the SAFE prompt is used for Cover.

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
                        console.warn(`⏳ 429 Quota Hit. Waiting 60s...`);
                        await sleep(60000);
                        continue;
                    }
                    if (response.status === 400 || response.status === 500) {
                        // Safety filter often returns 400 or generic error
                        const txt = await response.text();
                        console.warn(`⚠️ Blocked/Error: ${txt}`);
                        return null;
                    }
                }

                const data = await response.json();
                if (!data.predictions || !data.predictions[0]) {
                    console.error("❌ No predictions (Safety?). Skip.");
                    return null;
                }

                const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
                fs.writeFileSync(localPath, buffer);
                console.log(`✅ Saved: ${localPath}`);
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

async function fixArticle() {
    console.log("🚑 STARTING SURGICAL FIX FOR FAMILY ARTICLE...");

    // 1. Generate Images
    let finalHtml = ARTICLE_DATA.content;

    // Generate Cover strictly
    console.log("🎨 Generating Cover Image (Safe Mode)...");
    const coverUrl = await generateImage(ARTICLE_DATA.prompts[0], `${ARTICLE_DATA.slug}-remaster-0-FIXED.jpg`);
    if (coverUrl) {
        // Inject Cover
        const imgHtml = `
<figure class="my-8">
  <img src="${coverUrl}" alt="Hotel Lobby" class="w-full h-auto rounded-lg shadow-sm" />
</figure>`;
        finalHtml = finalHtml.replace("<!-- IMG_0 -->", imgHtml);
    } else {
        console.error("❌ CRITICAL: Cover image failed even with safe prompt!");
    }
    await sleep(30000); // Cool down

    // Generate others
    for (let i = 1; i < ARTICLE_DATA.prompts.length; i++) {
        console.log(`🎨 Generating Image ${i}...`);
        const url = await generateImage(ARTICLE_DATA.prompts[i], `${ARTICLE_DATA.slug}-remaster-${i}-FIXED.jpg`);
        if (url) {
            const placeholder = `<!-- IMG_${i} -->`;
            const imgHtml = `
<figure class="my-8">
  <img src="${url}" alt="Travel Image" class="w-full h-auto rounded-lg shadow-sm" />
</figure>`;
            if (finalHtml.includes(placeholder)) {
                finalHtml = finalHtml.replace(placeholder, imgHtml);
            } else {
                finalHtml += imgHtml;
            }
        }
        await sleep(30000); // Cool down
    }

    // 2. Save
    const payload = {
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: `${ARTICLE_DATA.title}(TR)` },
        content: { en: finalHtml, tr: "<p>TR content pending</p>" },
        meta_description: { en: ARTICLE_DATA.title, tr: ARTICLE_DATA.title },
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('articles').upsert(payload, { onConflict: 'slug' });
    if (error) console.error("❌ DB Error:", error);
    else console.log("✅ SUCCESS. Article fixed and saved.");
}

fixArticle();
