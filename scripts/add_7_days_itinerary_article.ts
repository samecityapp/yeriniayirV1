import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

// Configuration
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = 'us-central1';
const API_ENDPOINT = 'us-central1-aiplatform.googleapis.com';
const MODEL_ID = 'imagen-3.0-generate-001';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLES_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'articles');

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImageVertex(prompt: string, filename: string, retries = 3) {
    console.log(`🎨 Generating ${filename} with Imagen 3...`);

    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);
    if (fs.existsSync(localPath)) {
        console.log(`⏩ File exists, skipping: ${filename}`);
        return `/images/articles/${filename}`;
    }

    const auth = new GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predict`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Increased delay for retry to 40s
            if (attempt > 1) await sleep(40000);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instances: [{ prompt }],
                    parameters: { sampleCount: 1, aspectRatio: "16:9", safetySetting: "block_only_high", personGeneration: "allow_adult" }
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.warn(`⏳ Quota exceeded (429). Waiting 60s before retry ${attempt + 1}...`);
                    await sleep(60000);
                    continue;
                }
                throw new Error(`Vertex API Error: ${response.status}`);
            }

            const data = await response.json();
            if (!data.predictions?.[0]?.bytesBase64Encoded) throw new Error('No predictions');

            fs.writeFileSync(localPath, Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64'));
            console.log(`✅ Saved: ${localPath}`);
            return `/images/articles/${filename}`;
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed:`, error);
            if (attempt === retries) return null;
        }
    }
    return null;
}

const ARTICLE_DATA = {
    slug: '7-days-in-turkey-itinerary-from-uk',
    title: '7 Days in Turkey from the UK: Easy Itinerary Framework (Choose Your Base + Day Trips)',
    meta_description: 'Planning one week in Turkey from the UK? This UK-friendly 7-day framework helps you pick the right base (city, coast, or mixed), build simple day trips, and keep the trip smooth without overplanning. Includes copy-paste questions, checklists, and FAQs — no hotel names.',
    primary_keyword: '7 days in Turkey itinerary from the UK',
    content: `
<h1>7 Days in Turkey from the UK: Easy Itinerary Framework (Choose Your Base + Day Trips)</h1>

<p><strong>Quick answer:</strong> The easiest way to plan 7 days in Turkey from the UK is to <strong>choose one base</strong> (or at most two) and build day trips around it. Turkey is big and varied, so trying to “see everything” in a week usually turns into constant travel. Instead, pick your trip style (city, coast, or mixed), choose a base that matches it, then use this simple structure: <strong>2–3 big experiences, 2 flexible days, 1 slow day</strong>. You’ll see more and feel better.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>Step 1: Choose your 7-day trip style (don’t skip this)</h2>
<ul>
  <li><strong>City break week:</strong> culture, neighbourhoods, food, short day trips.</li>
  <li><strong>Coast week:</strong> beach/pool rhythm, short excursions, relaxed evenings.</li>
  <li><strong>Mixed week:</strong> a city base + a coast base (or one base that gives both).</li>
</ul>

<p><strong>Simple rule:</strong> In 7 days, your style matters more than your route. Pick the vibe first.</p>

<p>Base selection help: <a href="/guide/choosing-where-to-stay-turkey-base-guide">How to Choose Your Base in Turkey</a></p>

<h2>Step 2: Pick one base (or two max) — here’s why</h2>
<p>Turkey is not a “quick hop” destination between far regions. Every extra move costs you:</p>
<ul>
  <li>packing time</li>
  <li>transfer time</li>
  <li>check-in/check-out time</li>
  <li>energy (the hidden cost)</li>
</ul>

<p><strong>Simple rule:</strong> One base = relaxed and rich. Two bases = possible if you keep travel simple. Three bases in 7 days = usually too much.</p>

<h2>The 3 best 7-day frameworks (pick one and personalise)</h2>

<h3>Framework A: One-base city week (most reliable for first-timers)</h3>
<p><strong>Best for:</strong> first-time visitors, culture and food lovers, winter/shoulder-season trips.</p>

<ul>
  <li><strong>Day 1:</strong> Arrival + easy neighbourhood walk + early night</li>
  <li><strong>Day 2:</strong> Main cultural sights (your “big city day”)</li>
  <li><strong>Day 3:</strong> Food + markets + a slower pace</li>
  <li><strong>Day 4:</strong> Day trip (choose one “nearby classic”)</li>
  <li><strong>Day 5:</strong> Flexible day (weather-based or mood-based)</li>
  <li><strong>Day 6:</strong> Second day trip OR “hidden corners” city day</li>
  <li><strong>Day 7:</strong> Brunch + final walk + departure</li>
</ul>

<p><strong>UK-friendly tip:</strong> Build your city week around <em>neighbourhoods</em>, not just “sights”. It feels more authentic and more enjoyable.</p>

<!-- IMAGE_CITY_NEIGHBOURHOOD_PLACEHOLDER -->

<h3>Framework B: One-base coast week (easy holiday mode)</h3>
<p><strong>Best for:</strong> summer trips, families, anyone who wants a simple rhythm.</p>

<ul>
  <li><strong>Day 1:</strong> Arrival + beach/pool reset</li>
  <li><strong>Day 2:</strong> Full relax day (you’ll need it after travel)</li>
  <li><strong>Day 3:</strong> Morning excursion + lazy afternoon</li>
  <li><strong>Day 4:</strong> Beach day + sunset dinner</li>
  <li><strong>Day 5:</strong> Day trip (short and easy)</li>
  <li><strong>Day 6:</strong> Slow day (spa / café day / scenic walk)</li>
  <li><strong>Day 7:</strong> Easy morning + departure</li>
</ul>

<p>All-inclusive planning: <a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a></p>

<h3>Framework C: Mixed week (city + coast) — the “best of both” plan</h3>
<p><strong>Best for:</strong> travellers who want variety and are happy with one travel day mid-week.</p>

<ul>
  <li><strong>Days 1–3:</strong> City base (culture + neighbourhoods + one flexible day)</li>
  <li><strong>Day 4:</strong> Travel day + coastal reset (keep plans light)</li>
  <li><strong>Days 5–6:</strong> Coast base (relax + one short excursion)</li>
  <li><strong>Day 7:</strong> Easy morning + departure</li>
</ul>

<p><strong>Simple rule:</strong> If you do two bases, keep one of them “rest-heavy” so you don’t burn out.</p>

<!-- IMAGE_COASTAL_RELAX_PLACEHOLDER -->

<h2>How to choose your day trips (without overplanning)</h2>
<p>Day trips are where people lose time. Use this filter:</p>
<ul>
  <li><strong>One “big” day trip</strong> (your headline experience)</li>
  <li><strong>One “easy” day trip</strong> (short, low-stress)</li>
  <li><strong>One “optional” day trip</strong> (only if energy is high)</li>
</ul>

<p><strong>Simple rule:</strong> Don’t book every day. Leave space for Turkey to feel enjoyable.</p>

<h2>The “2–2–2–1” week structure (super simple)</h2>
<p>If you want an even simpler system, use this:</p>
<ul>
  <li><strong>2 big experience days</strong></li>
  <li><strong>2 relaxed days</strong></li>
  <li><strong>2 flexible days</strong> (weather/mood dependent)</li>
  <li><strong>1 travel day</strong> (arrival/departure or a base move)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Flex days are not “empty”. They’re what stops your week feeling like a checklist.</p>

<h2>Transport planning for a smooth 7 days</h2>
<ul>
  <li>Choose a base where you can walk to food and daily essentials.</li>
  <li>Keep transfer days light (no major tours on the same day).</li>
  <li>Plan your “must-do outdoors” for mornings (especially in warmer months).</li>
</ul>

<p>Getting around: <a href="/guide/turkey-airports-and-transfers-uk">Flights, Airports & Transfers in Turkey</a></p>

<!-- IMAGE_TRANSPORT_PLANNING_PLACEHOLDER -->

<h2>What to pack for a 7-day Turkey trip (the smart list)</h2>
<ul>
  <li>Comfortable walking shoes (even on a coast trip)</li>
  <li>One light layer for evenings</li>
  <li>Sun essentials (sunscreen, sunglasses)</li>
  <li>Small day bag for day trips</li>
  <li>Offline backups (screenshots of bookings and key info)</li>
</ul>

<p><strong>Simple rule:</strong> Pack for comfort, not outfits. Turkey trips involve more walking than most people expect.</p>

<h2>Copy-paste questions (use these to plan quickly)</h2>
<ul>
  <li>“We want a trip that feels (relaxed / balanced / busy). Which 7-day framework fits?”</li>
  <li>“We prefer one base. What day trips make sense without long travel?”</li>
  <li>“We want one ‘big’ highlight and the rest easy. What should the week look like?”</li>
  <li>“We’re travelling with kids — where do we put the slow day?”</li>
</ul>

<!-- IMAGE_PLANNING_NOTES_PLACEHOLDER -->

<h2>Quick checklist: 7 days in Turkey (UK travellers)</h2>
<ul>
  <li>Trip style chosen (city / coast / mixed) ✅</li>
  <li>Bases chosen (1 or 2 max) ✅</li>
  <li>2 big experience days selected ✅</li>
  <li>2 flexible days kept free ✅</li>
  <li>Transfer day kept light ✅</li>
  <li>Day trips filtered (big + easy + optional) ✅</li>
</ul>

<h2>FAQ: 7 days in Turkey from the UK</h2>

<h3>Is 7 days enough for Turkey?</h3>
<p>Yes — if you focus on one region or one base. Turkey is big and varied, so a week is best for a “deep” experience rather than trying to cover multiple far-apart regions.</p>

<h3>Should I do one base or two bases in a week?</h3>
<p>One base is the easiest and most relaxing. Two bases can work if you keep travel simple and treat the mid-week move as a light day.</p>

<h3>What’s the biggest mistake in a 7-day Turkey itinerary?</h3>
<p>Trying to see too many far-apart places. It turns the trip into constant transfers rather than enjoying the country.</p>

<h3>Is this itinerary framework good for families?</h3>
<p>Yes — families benefit most from fewer moves, a predictable rhythm, and at least one slow day. That’s how you keep everyone happy.</p>

<h3>How do I make the week feel less rushed?</h3>
<p>Use the 2–2–2–1 structure, keep two flexible days, and avoid booking activities for every single day. Space is what makes the trip feel premium.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>
`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting 7 Days Itinerary Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-7-days-itinerary-map-planning-${timestamp}.jpg`,
            prompt: "A beautiful flat lay of a Turkey travel map with a notebook, pen, and a cup of Turkish tea. Planning a 7-day trip. 'Relaxed planning' vibe. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_CITY_NEIGHBOURHOOD_PLACEHOLDER -->',
            filename: `istanbul-neighbourhood-walk-vibe-${timestamp}.jpg`,
            prompt: "A charming street in a Turkish city neighbourhood (like Istanbul or Antalya Old Town). People walking casually, local shops. 'Local vibe' over 'tourist rush'. Authentic travel scene."
        },
        {
            placeholder: '<!-- IMAGE_COASTAL_RELAX_PLACEHOLDER -->',
            filename: `turkey-coastal-relax-easy-day-${timestamp}.jpg`,
            prompt: "A relaxed view of a Turkish coast. Someone sitting by the sea or on a balcony with a view, reading or resting. 'Holiday mode'. Calm blue sea. Authentic travel moment."
        },
        {
            placeholder: '<!-- IMAGE_TRANSPORT_PLANNING_PLACEHOLDER -->',
            filename: `turkey-transport-ferry-or-bus-scenic-${timestamp}.jpg`,
            prompt: "A scenic shot of Turkish transport - maybe a ferry on the Bosphorus or a comfortable modern bus on a scenic road. 'Easy travel'. Blue sky. Authentic travel logistics."
        },
        {
            placeholder: '<!-- IMAGE_PLANNING_NOTES_PLACEHOLDER -->',
            filename: `travel-journal-checklist-turkey-${timestamp}.jpg`,
            prompt: "Close up of a travel journal or checklist on a cafe table in Turkey. 'Day 1, Day 2' written or implied. Coffee or tea nearby. Organizing a trip. Authentic detail."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Increased delay to 20s to avoid quota limits
        if (!item.placeholder.includes('COVER')) {
            console.log("⏳ Waiting 20s to respect API quota...");
            await sleep(20000);
        }

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            if (item.placeholder.includes('COVER')) {
                coverImageUrl = publicUrl;
                finalContent = finalContent.replace(item.placeholder, '');
            } else {
                const imgTag = `<img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
                finalContent = finalContent.replace(item.placeholder, imgTag);
            }
        } else {
            console.warn("⚠️ Image generation failed for:", item.filename);
            finalContent = finalContent.replace(item.placeholder, '');
        }
    }

    // Insert into DB
    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de 7 Gün: Kolay Rota Çerçevesi (TR Pasif)" },
        meta_description: { en: ARTICLE_DATA.meta_description, tr: "TR Pasif içerik." },
        content: { en: finalContent, tr: "<p>Bu içerik sadece İngilizce dilinde yayındadır.</p>" },
        cover_image_url: coverImageUrl,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });

    if (error) {
        console.error("❌ DB Insert Failed:", error);
    } else {
        console.log("✅ Article Added Successfully!");
        console.log("👉 Slug:", ARTICLE_DATA.slug);
    }
}

run();
