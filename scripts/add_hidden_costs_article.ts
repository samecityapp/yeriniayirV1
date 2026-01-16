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
    slug: 'hidden-costs-turkey-resorts',
    title: 'Hidden Costs in Turkey Resorts: What UK Travellers Get Surprised By (All-Inclusive Guide)',
    meta_description: 'All-inclusive in Turkey can be great value, but UK travellers often get caught out by the same “extras” again and again. This guide lists the most common hidden costs, how to spot them early, and the exact questions to ask so you avoid surprises (no hotel names).',
    primary_keyword: 'hidden costs in Turkey resorts',
    content: `<p><strong>Quick answer:</strong> “Hidden costs” in Turkey resorts are usually not scams — they’re <em>assumptions</em>. UK travellers often assume certain drinks, snacks, à la carte dining, activities, or convenience services are included, then discover they’re limited, time-restricted, or chargeable. The fix is simple: know the common categories of extras and ask clear questions before you book (and again on arrival).</p>

<h2>What this guide is (and what it isn’t)</h2>
<p>This is a practical “avoid surprises” guide. It’s not saying resorts are trying to trick you. Many extra charges exist everywhere in the world — the problem is when you don’t expect them.</p>

<p><strong>Simple rule:</strong> If you care about something, confirm it specifically. “All-inclusive” is a system, not a single global standard.</p>

<p>If you want a baseline of what all-inclusive usually covers, start here: <a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included (and What Usually Isn’t)</a>.</p>

<h2>The 8 most common hidden-cost categories (UK traveller reality)</h2>

<h3>1) Premium drinks and branded spirits</h3>
<p>Many all-inclusive packages include a standard range of drinks, but certain items can be classed as “premium”. The exact definition varies by resort.</p>

<ul>
  <li>Some branded spirits and certain cocktails may be extra</li>
  <li>Some venues may have a different drinks list (e.g., “premium bar”)</li>
  <li>Sometimes drinks are included only at specific bars or specific hours</li>
</ul>

<p><strong>UK-friendly tip:</strong> Instead of asking “Are drinks included?”, ask: “Are cocktails and the spirits we’ll actually order included, and are any bars excluded?”</p>

<!-- IMAGE_PREMIUM_DRINKS_PLACEHOLDER -->

<h3>2) Snack timing (what’s available, and when)</h3>
<p>Snacks can be a value-maker — or a frustration — depending on how they’re delivered.</p>

<ul>
  <li>Snacks may be available only at set times</li>
  <li>Late-night food may be limited or not daily</li>
  <li>Some “snack bars” serve a small fixed menu (not a buffet)</li>
</ul>

<p><strong>Simple rule:</strong> If you rely on snacks (kids, late eaters), timing matters more than variety.</p>

<h3>3) À la carte dining (booking rules, limits, and chargeable items)</h3>
<p>UK travellers often assume à la carte is unlimited if it’s “part of all-inclusive”. In reality, common policies include:</p>

<ul>
  <li>Advance booking requirements</li>
  <li>Limits on number of visits per stay</li>
  <li>Chargeable dishes, tasting menus, or premium seafood/meat</li>
</ul>

<p>Use this explainer: <a href="/guide/a-la-carte-all-inclusive-turkey">A La Carte Restaurants in All-Inclusive: How It Works in Turkey</a>.</p>

<h3>4) Spa, wellness, and “treatments”</h3>
<p>Many resorts have spa facilities. Access and pricing vary by property.</p>

<ul>
  <li>Some basic areas may be included, while treatments are chargeable</li>
  <li>Packages, upgrades, and special services can add up</li>
  <li>Couples often spend more here than they expect</li>
</ul>

<p><strong>UK-friendly tip:</strong> Decide before you go: are you a “one treatment max” person, or will spa become part of your daily routine? Budget accordingly.</p>

<!-- IMAGE_SPA_TREATMENTS_PLACEHOLDER -->

<h3>5) Water sports, activities, and on-site entertainment extras</h3>
<p>All-inclusive typically includes standard resort entertainment. But certain activities may be chargeable.</p>

<ul>
  <li>Water sports and certain equipment hire can be extra</li>
  <li>Games rooms, premium experiences, or lessons can be extra</li>
  <li>Some off-site activities are arranged via the resort and paid separately</li>
</ul>

<p><strong>Simple rule:</strong> If an activity looks like a “special experience”, treat it as potentially chargeable until confirmed.</p>

<h3>6) Transfers: shared vs private (and comfort vs cost)</h3>
<p>Transfers are one of the biggest hidden differences between deals, especially if you book separately.</p>

<ul>
  <li>Package holidays may include shared transfers</li>
  <li>Private transfers cost more but reduce hassle, especially for families</li>
  <li>Transfer time can vary significantly by exact area</li>
</ul>

<p>Plan reliably here: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey: Reliable Options and What to Avoid</a>.</p>

<h3>7) Room-related extras (the “comfort upsell”)</h3>
<p>Some costs aren’t framed as “extras” — they show up as upgrades you suddenly want after you arrive.</p>

<ul>
  <li>Quiet room placement vs central rooms near entertainment</li>
  <li>Bigger room layout (families often realise this matters on night one)</li>
  <li>View or terrace upgrades that affect how relaxing the room feels</li>
</ul>

<p><strong>Simple rule:</strong> Spend money on sleep and layout before you spend money on status upgrades.</p>

<p>Value framework: <a href="/guide/best-all-inclusive-value-uk-turkey">How to Get the Best All-Inclusive Value from the UK</a>.</p>

<!-- IMAGE_ROOM_UPGRADE_PLACEHOLDER -->

<h3>8) Convenience spending (small things that add up)</h3>
<p>These are not “gotchas” — they’re optional costs that creep up when you’re not paying attention.</p>

<ul>
  <li>On-site shops (suncream, inflatables, medicines)</li>
  <li>Premium coffee or branded snacks (depends on policy)</li>
  <li>Photos, souvenirs, special celebration setups</li>
</ul>

<p><strong>UK-friendly tip:</strong> Bring the small essentials you always end up buying (suncream, aftersun, plasters). It’s an easy win.</p>

<h2>Copy-paste questions: ask these to eliminate surprises</h2>
<p>Copy and paste this list into your notes or message thread:</p>

<ul>
  <li>Which drinks are included, and what counts as <strong>premium</strong> or chargeable?</li>
  <li>What are the <strong>snack hours</strong>, and is there <strong>late-night food</strong>?</li>
  <li>How do à la carte restaurants work: <strong>booking, limits, chargeable items</strong>?</li>
  <li>Are any bars/restaurants <strong>excluded</strong> from all-inclusive?</li>
  <li>Which activities are included and which are <strong>extra</strong> (water sports, games room, lessons)?</li>
  <li>What spa facilities are included, and what is charged <strong>per treatment</strong>?</li>
  <li>Is the transfer shared or private, and what’s the typical transfer <strong>range</strong>?</li>
  <li>Are there any “premium experiences” marketed on-site that cost extra?</li>
</ul>

<!-- IMAGE_ASKING_QUESTIONS_PLACEHOLDER -->

<p><strong>Simple rule:</strong> If you can’t get clear answers, assume the stricter version and decide if you’re still happy.</p>

<h2>How to keep spending under control once you arrive</h2>
<p>Small habits prevent “holiday spend drift”.</p>

<ul>
  <li>Do a 10-minute “what’s included” check-in on day one (snacks, bars, dining rules)</li>
  <li>Plan 1–2 paid extras you actually want, then ignore the rest</li>
  <li>If you’re a cocktails person, learn which bars are included and stick to them</li>
  <li>Book any must-do à la carte early (if it’s important to you)</li>
</ul>

<p><strong>UK-friendly tip:</strong> You’ll enjoy your holiday more when you choose your extras intentionally, rather than discovering them by accident.</p>

<h2>What to do if you booked a “deal” and now you’re worried</h2>
<p>Don’t panic. Most “hidden costs” are optional. Focus on clarifying the few things that affect your daily routine.</p>

<ul>
  <li>Snacks + meal times (especially with kids)</li>
  <li>Drinks you actually want</li>
  <li>Noise and room placement (sleep)</li>
  <li>Transfers (arrival/departure comfort)</li>
</ul>

<!-- IMAGE_RELAXED_PLANNING_PLACEHOLDER -->

<p>Use these supporting guides:</p>
<ul>
  <li><a href="/guide/all-inclusive-family-checklist">All-Inclusive for Families: The Non-Negotiables</a></li>
  <li><a href="/guide/adults-only-all-inclusive-turkey-guide">Adults-Only All-Inclusive: How to Choose</a></li>
  <li><a href="/guide/package-vs-separate-turkey">Package Holiday vs Booking Separately for Turkey</a></li>
</ul>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Hidden Costs Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_PREMIUM_DRINKS_PLACEHOLDER -->',
            filename: `premium-drinks-menu-bar-authentic-${timestamp}.jpg`,
            prompt: "Close up view of a resort bar menu (or sign) in Turkey showing 'Premium' section vs 'Inclusive' section. Authentic bar detail. Soft lighting, realistic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_SPA_TREATMENTS_PLACEHOLDER -->',
            filename: `spa-treatment-menu-pricing-authentic-${timestamp}.jpg`,
            prompt: "A guest looking at a spa treatment menu in a relaxing Turkish hotel spa reception. Focus on the list of services. Calm atmosphere, soft towels background. Authentic wellness photo."
        },
        {
            placeholder: '<!-- IMAGE_ROOM_UPGRADE_PLACEHOLDER -->',
            filename: `hotel-room-upgrade-view-authentic-${timestamp}.jpg`,
            prompt: "View from a 'premium' hotel room balcony in Turkey vs a standard view. Maybe showing a sea view vs a garden view side by side concept, or just a stunning upgraded view. Authentic travel vibe."
        },
        {
            placeholder: '<!-- IMAGE_ASKING_QUESTIONS_PLACEHOLDER -->',
            filename: `reception-check-in-questions-authentic-${timestamp}.jpg`,
            prompt: "A UK traveller at a hotel reception desk in Turkey, asking a question or checking a detail on a document. Friendly receptionist. Authentic check-in interaction. Warm lighting."
        },
        {
            placeholder: '<!-- IMAGE_RELAXED_PLANNING_PLACEHOLDER -->',
            filename: `relaxed-traveller-by-pool-no-stress-${timestamp}.jpg`,
            prompt: "A relaxed traveller lying on a sunbed by a pool in Turkey, reading a book or enjoying a drink. No stress, everything sorted. Enhancing the 'peace of mind' aspect. Authentic holiday moment."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('COVER')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // Note: Cover image is not explicitly in the placeholders list for content replacement in this specific script version provided by user content structure
            // But we keep the logic if we want to use one as cover. 
            // The user didn't put a COVER placeholder in the text this time, but usually does.
            // Let's assume the first image is the 'cover' conceptually if no placeholder exists, but wait, the placeholders ARE there.
            // I added standard placeholders in the content variable above corresponding to the prompts.
            // Wait, I missed adding a COVER placeholder in the content variable I constructed.
            // I will add <!-- IMAGE_COVER_PLACEHOLDER --> to the content now.

            if (item.filename.includes('premium-drinks')) { // Let's use the first one as cover if needed, or just insert.
                const imgTag = `<img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
                finalContent = finalContent.replace(item.placeholder, imgTag);
                if (!coverImageUrl) coverImageUrl = publicUrl; // Use first generated as cover
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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye Otellerinde Gizli Maliyetler (TR Pasif)" },
        meta_description: { en: ARTICLE_DATA.meta_description, tr: "TR Pasif içerik." },
        content: { en: finalContent, tr: "<p>Bu içerik sadece İngilizce dilinde yayındadır.</p>" },
        cover_image_url: coverImageUrl, // Will be the first image generated
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
