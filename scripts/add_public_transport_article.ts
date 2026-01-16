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
if (!fs.existsSync(ARTICLES_IMAGE_DIR)) {
    fs.mkdirSync(ARTICLES_IMAGE_DIR, { recursive: true });
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Imagen 3 Generation Function ---
async function generateImageVertex(prompt: string, filename: string, retries = 3) {
    console.log(`🎨 Generating ${filename} with Imagen 3...`);

    const localPath = path.join(ARTICLES_IMAGE_DIR, filename);
    if (fs.existsSync(localPath)) {
        console.log(`⏩ File exists, skipping: ${filename}`);
        return `/images/articles/${filename}`;
    }

    if (!fs.existsSync('google-credentials.json')) {
        console.error("❌ 'google-credentials.json' missing.");
        return null;
    }

    const auth = new GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    if (!PROJECT_ID) {
        console.error("❌ GOOGLE_CLOUD_PROJECT_ID missing.");
        return null;
    }

    const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predict`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            if (attempt > 1) await sleep(20000);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instances: [{ prompt }],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: "16:9",
                        safetySetting: "block_only_high",
                        personGeneration: "allow_adult",
                    }
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.warn(`⏳ Quota exceeded (429). Waiting 30s before retry ${attempt + 1}...`);
                    await sleep(30000);
                    continue;
                }
                const errText = await response.text();
                throw new Error(`Vertex API Error: ${response.status} - ${errText}`);
            }

            const data = await response.json();

            if (!data.predictions || data.predictions.length === 0) {
                throw new Error('No predictions returned');
            }

            const base64Image = data.predictions[0].bytesBase64Encoded;
            const buffer = Buffer.from(base64Image, 'base64');

            fs.writeFileSync(localPath, buffer);
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
    slug: 'public-transport-turkey-tourist-guide',
    title: 'Public Transport in Turkey for UK Tourists: Istanbul, Cities, and Simple Day-to-Day Getting Around',
    meta_description: 'Getting around Turkey is easier than most UK travellers expect — especially in major cities. This practical guide explains the main transport options (metro, tram, bus, ferries), how to pay, simple etiquette, and a “smooth day” checklist — plus FAQs. No hotel names, no drama.',
    primary_keyword: 'public transport in Turkey for UK tourists',
    content: `<p><strong>Quick answer:</strong> In Turkey’s major cities, public transport is a practical, budget-friendly way to get around — especially in Istanbul where metro, trams and ferries can cover most tourist routes. The easiest approach is to use one local transport card where available, keep a bit of spare balance for busy days, and travel at calmer times if you prefer a more relaxed ride.</p>

<h2>Why public transport is a great choice in Turkey (especially for Brits)</h2>
<p>If you’re used to London travel, you’ll adapt quickly in Turkey’s big cities. The key benefits:</p>
<ul>
  <li><strong>Convenience:</strong> metro/tram networks connect major areas efficiently</li>
  <li><strong>Predictability:</strong> you’re less dependent on traffic for many routes</li>
  <li><strong>Value:</strong> great for day trips and neighbourhood hopping</li>
  <li><strong>Experience:</strong> ferries and trams can be part of the fun</li>
</ul>

<p><strong>Simple rule:</strong> If you’re doing multiple stops in a day, public transport often beats car travel on ease.</p>

<!-- IMAGE_TRAM_ISTANBUL_PLACEHOLDER -->

<h2>Know your transport “mix” (what you’ll actually use)</h2>
<p>Most UK travellers end up using a simple combination:</p>
<ul>
  <li><strong>Metro</strong> for longer cross-city moves</li>
  <li><strong>Tram</strong> for central, tourist-heavy corridors</li>
  <li><strong>Bus</strong> for gaps where rail lines don’t reach</li>
  <li><strong>Ferry</strong> in coastal/strait cities (especially Istanbul)</li>
  <li><strong>Taxi</strong> for late-night returns, luggage days, or when you want door-to-door comfort</li>
</ul>

<p><strong>UK-friendly tip:</strong> Plan “public transport out, taxi back” for late evenings — it’s often the best comfort/value combo.</p>

<h2>How paying works (keep it easy)</h2>
<p>Payment systems vary by city, but the easiest mindset is:</p>
<ul>
  <li>Look for a <strong>local transport card</strong> option where available</li>
  <li>Top up before peak times (stations get busy)</li>
  <li>Keep a backup payment option ready (cash/card) depending on the city’s system</li>
</ul>

<p><strong>Simple rule:</strong> Treat your transport card like an Oyster: keep a little extra balance so you’re never stuck.</p>

<p>If you prefer a resort-led holiday and only need transfers, start here instead: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey</a>.</p>

<!-- IMAGE_ISTANBULKART_PLACEHOLDER -->

<h2>Istanbul: the easiest city to use public transport as a tourist</h2>
<p>Istanbul is big, but tourist movement is often straightforward once you understand the “shape” of the city: historic sights, central districts, and ferry-linked areas.</p>

<h3>What works brilliantly in Istanbul</h3>
<ul>
  <li><strong>Metro</strong> for speed across longer distances</li>
  <li><strong>Trams</strong> for central sightseeing corridors</li>
  <li><strong>Ferries</strong> for scenic, low-stress crossings</li>
</ul>

<p><strong>UK-friendly tip:</strong> Ferries aren’t just transport — they’re a built-in “break” from walking.</p>

<!-- IMAGE_FERRY_BOSPHORUS_PLACEHOLDER -->

<h3>A simple Istanbul day plan (transport-first)</h3>
<ul>
  <li>Start early with metro/tram while it’s calm</li>
  <li>Use ferries mid-day when you want a scenic reset</li>
  <li>Return by metro/tram before late-night crowds, or take a taxi if you’re tired</li>
</ul>

<p><strong>Simple rule:</strong> If your day has 3+ stops, anchor it around rail/ferry — then fill gaps with short walks.</p>

<h2>Other cities in Turkey: what to expect</h2>
<p>Outside Istanbul, many cities still have easy transport, but the network style can vary.</p>

<ul>
  <li>Some cities are rail-heavy (metro/tram)</li>
  <li>Some rely more on buses and central hubs</li>
  <li>Coastal cities can be very walkable in key areas</li>
</ul>

<p><strong>UK-friendly tip:</strong> In smaller cities, your “best transport” can be a mix of walking + short rides rather than complex networks.</p>

<h2>Etiquette: the quick, respectful basics</h2>
<ul>
  <li>Let passengers off before you get on</li>
  <li>Keep bags close in crowded areas (normal big-city habit)</li>
  <li>Offer space to those who need it more (older travellers, parents with pushchairs)</li>
  <li>Keep noise low on quieter routes</li>
</ul>

<p><strong>Simple rule:</strong> Mirror local behaviour. Calm, polite, and you’ll be fine.</p>

<p>More culture basics: <a href="/guide/turkey-travel-etiquette-for-brits-guide">Turkey Travel Etiquette for Brits</a>.</p>

<!-- IMAGE_METRO_INTERIOR_PLACEHOLDER -->

<h2>Airport to city vs airport to resort: don’t mix the two</h2>
<p>UK travellers sometimes assume “airport transfer” always means the same thing. In practice:</p>
<ul>
  <li><strong>City break:</strong> you’re choosing airport-to-city options and then using public transport day-to-day</li>
  <li><strong>Resort holiday:</strong> you want airport-to-resort transfers that are direct and predictable</li>
</ul>

<p><strong>Simple rule:</strong> City break = public transport mindset. Resort break = transfer mindset.</p>

<h2>The “smooth transport day” checklist (copy-paste)</h2>
<ul>
  <li>Transport card / payment ready</li>
  <li>Spare balance topped up before peak time</li>
  <li>Address pinned/screenshot for where I’m going next</li>
  <li>Comfortable shoes (walking is part of the system)</li>
  <li>Light layer + water (keeps the day easy)</li>
  <li>Plan for a calmer return (metro/tram before late crowds or taxi if tired)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Plan your “return route” before you leave — it’s the biggest stress reducer.</p>

<!-- IMAGE_BUS_STOP_PLACEHOLDER -->

<h2>FAQ: public transport in Turkey (UK traveller questions)</h2>

<h3>Is public transport in Turkey easy for tourists?</h3>
<p>In major cities, yes — especially Istanbul. The easiest approach is using rail and ferries for main moves, then walking or short rides for gaps.</p>

<h3>Do I need cash for public transport?</h3>
<p>It depends on the city and payment system. The practical approach is to have both: a transport card where available, plus a backup payment option.</p>

<h3>Is Istanbul public transport safe and comfortable?</h3>
<p>Istanbul is a major global city with busy peak times. Travel at calmer hours if you prefer more space, keep your belongings close in crowded areas, and you’ll usually find it straightforward.</p>

<h3>What’s the best transport option for sightseeing in Istanbul?</h3>
<p>A mix of tram/metro for speed and ferries for scenic crossings works well. Walking fills the gaps.</p>

<h3>Should I use public transport for a resort holiday?</h3>
<p>For a resort-led trip, it’s usually better to focus on a reliable airport-to-resort transfer and then enjoy the resort. Public transport is more relevant for city breaks and exploring.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Public Transport Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_TRAM_ISTANBUL_PLACEHOLDER -->',
            filename: `istanbul-red-tram-istiklal-authentic-${timestamp}.jpg`,
            prompt: "A photorealistic shot of the iconic red tram on Istiklal Avenue in Istanbul. People walking nearby, blurred background. Overcast but bright day. Authentic street photography. High detail."
        },
        {
            placeholder: '<!-- IMAGE_ISTANBULKART_PLACEHOLDER -->',
            filename: `hand-holding-istanbulkart-metro-turnstile-${timestamp}.jpg`,
            prompt: "Close up of a hand holding an Istanbulkart (public transport card) tapping it on a modern metro turnstile reader. Focus on the card and the reader light. Authentic POV travel shot. Realistic lighting."
        },
        {
            placeholder: '<!-- IMAGE_FERRY_BOSPHORUS_PLACEHOLDER -->',
            filename: `istanbul-ferry-bosphorus-view-authentic-${timestamp}.jpg`,
            prompt: "A scenic view from the deck of an Istanbul ferry crossing the Bosphorus. Seagulls in the air, city skyline in the distance with minarets. Authentic travel experience. Cinematic lighting. Relaxing vibe."
        },
        {
            placeholder: '<!-- IMAGE_METRO_INTERIOR_PLACEHOLDER -->',
            filename: `modern-metro-interior-istanbul-authentic-${timestamp}.jpg`,
            prompt: "Interior of a modern, clean metro train in Istanbul. Commuters sitting and standing (blurred faces). Bright, cool lighting. Digital display showing stops. Authentic urban transport atmosphere."
        },
        {
            placeholder: '<!-- IMAGE_BUS_STOP_PLACEHOLDER -->',
            filename: `waiting-at-bus-stop-istanbul-authentic-${timestamp}.jpg`,
            prompt: "A tourist checking their phone/map at a modern bus stop in a Turkish city. Bus approaching in the background. Glass shelter, city street context. Authentic everyday travel moment."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('TRAM')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // Use Tram as cover
            if (item.filename.includes('tram')) {
                coverImageUrl = publicUrl;
            }
            const imgTag = `<img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
            finalContent = finalContent.replace(item.placeholder, imgTag);

            // Fallback cover
            if (!coverImageUrl) coverImageUrl = publicUrl;

        } else {
            console.warn("⚠️ Image generation failed for:", item.filename);
            finalContent = finalContent.replace(item.placeholder, '');
        }
    }

    // Insert into DB
    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Toplu Taşıma Rehberi (TR Pasif)" },
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
