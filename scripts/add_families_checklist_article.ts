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
    slug: 'all-inclusive-family-checklist',
    title: 'All-Inclusive for Families in Turkey: The Non-Negotiables (UK Parent Checklist)',
    meta_description: 'Planning a family all-inclusive in Turkey from the UK? Use this practical checklist to choose the right region, room setup, food options and facilities — plus copy-paste questions that help you avoid common surprises (no hotel names).',
    primary_keyword: 'all-inclusive for families in Turkey',
    content: `<p><strong>Quick answer:</strong> For a stress-free family all-inclusive in Turkey, focus on the non-negotiables first: a genuinely workable room setup, safe and practical pools, food your child will actually eat, shade and nap-friendly spaces, and a transfer plan you can handle on arrival day. Everything else (fancy extras, long lists of “included”) comes second.</p>

<h2>Start with the one decision that changes everything: your family “holiday style”</h2>
<p>Before comparing resorts, decide which of these you are. It will stop you booking the wrong kind of place.</p>

<ul>
  <li><strong>Pool-first family:</strong> You’ll spend most days on-site, want multiple pools, and a predictable routine.</li>
  <li><strong>Mixed family:</strong> You want resort comfort but also short trips out and a bit of variety.</li>
  <li><strong>Quiet-routine family:</strong> You prioritise naps, early nights, calmer evenings, and less noise.</li>
</ul>

<p><strong>Simple rule:</strong> Pick a resort that matches your <em>daily rhythm</em> (nap times, bedtimes, meal habits) — not just the photos.</p>

<p>If you haven’t already, get clear on what “all-inclusive” typically covers in Turkey: <a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included (and What Usually Isn’t)</a>.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>The Non-Negotiables (read this before you look at anything else)</h2>

<h3>1) Room setup that actually works for your family</h3>
<p>“Family room” can mean very different things. What matters is whether it supports your evenings.</p>

<ul>
  <li><strong>Separate sleeping area</strong> (door or partition) if you want lights-out for children while adults stay up.</li>
  <li><strong>Enough beds</strong> without turning the room into a maze of sofa beds.</li>
  <li><strong>Bathroom practicality:</strong> storage, hooks, and space for getting kids ready without chaos.</li>
  <li><strong>Noise reality:</strong> rooms above evening venues or busy pool zones can ruin sleep.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you have toddlers, treat “separate sleeping space” as a must-have, not a nice-to-have.</p>

<!-- IMAGE_ROOM_PLACEHOLDER -->

<h3>2) Pools you feel safe using every day</h3>
<p>For families, pool design matters more than pool count.</p>

<ul>
  <li><strong>Shallow kids’ pool</strong> that’s not an afterthought.</li>
  <li><strong>Clear sightlines</strong> (can you see your child from the shade?)</li>
  <li><strong>Shade nearby</strong> so you can do long pool days without feeling fried.</li>
  <li><strong>Slip risk:</strong> wet surfaces + sprinting children = reality. You want good layouts and supervision.</li>
</ul>

<p><strong>Simple rule:</strong> One brilliant kids’ pool beats five “adult” pools when you’re travelling with children.</p>

<h3>3) Food your child will eat (not just “lots of options”)</h3>
<p>All-inclusive buffets look amazing until it’s day three and your child refuses everything.</p>

<ul>
  <li><strong>Reliable basics</strong> at every meal (plain pasta/rice, simple proteins, fruit, yoghurt).</li>
  <li><strong>Snack access</strong> between meals (especially for toddlers).</li>
  <li><strong>Meal timing</strong> that matches your routine (early dinner matters for young kids).</li>
  <li><strong>Allergies/intolerances:</strong> you need clear labelling or staff support you trust.</li>
</ul>

<p><strong>UK-friendly tip:</strong> Don’t judge a resort by the “most variety”. Judge it by whether it offers <em>simple, repeatable</em> choices your child will happily eat every day.</p>

<p>À la carte dining can be great, but it often comes with booking rules or limits. See: <a href="/guide/a-la-carte-all-inclusive-turkey">A La Carte Restaurants in All-Inclusive: How It Works in Turkey</a>.</p>

<!-- IMAGE_KIDS_FOOD_PLACEHOLDER -->

<h3>4) Naps, early nights, and the “quiet zones” problem</h3>
<p>Family holidays fall apart when your child can’t sleep. You need a realistic plan for naps and bedtimes.</p>

<ul>
  <li><strong>Quiet room location</strong> (ask what’s nearby: stage, bars, pool music, service areas).</li>
  <li><strong>Shade + calm seating</strong> for stroller naps or downtime.</li>
  <li><strong>Evening noise</strong> you can avoid (or accept) depending on your family style.</li>
</ul>

<p><strong>Simple rule:</strong> If sleep matters, treat “quiet room request” as part of the booking — not a last-minute hope.</p>

<h3>5) A transfer plan you can handle on arrival day</h3>
<p>After a flight, families don’t want a complicated arrival. Transfers vary by region and property location.</p>

<ul>
  <li><strong>Shared vs private</strong> (shared can mean multiple stops).</li>
  <li><strong>Arrival time reality:</strong> late arrivals + hungry kids = plan for snacks.</li>
  <li><strong>Car seats:</strong> confirm availability if it matters to you.</li>
</ul>

<p><strong>UK-friendly tip:</strong> Decide in advance what you can tolerate: “one stop max” or “door-to-door only”. Then book accordingly.</p>

<p>Use this to plan calmly: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey: Reliable Options and What to Avoid</a>.</p>

<h2>Choosing the right region for families (without overcomplicating it)</h2>
<p>Different coasts tend to create different family experiences — not “better or worse”, just different.</p>
<ul>
  <li><strong>Big, on-site resort experience:</strong> Often easiest for routine and facilities.</li>
  <li><strong>Greener, calmer resort zones:</strong> Often better for naps, downtime, and a slower rhythm.</li>
  <li><strong>More “explore-friendly” areas:</strong> Great if you want short trips out, but may be less “everything in one place”.</li>
</ul>

<p>To choose a coast quickly, use: <a href="/guide/best-regions-for-all-inclusive-turkey">Best Regions for All-Inclusive in Turkey: Which Coast Fits Your Style?</a>.</p>

<h2>What to prioritise by child age</h2>

<h3>Toddlers (1–3)</h3>
<ul>
  <li>Shade, short walks, and easy access to the room</li>
  <li>Simple food at predictable times</li>
  <li>Safe shallow pool and calm nap spaces</li>
  <li>A room you can darken/quiet down</li>
</ul>

<h3>Kids (4–10)</h3>
<ul>
  <li>Kids’ club that runs at useful times (not just one short slot)</li>
  <li>Activities beyond the pool (crafts, games, mini-disco)</li>
  <li>Evening entertainment that isn’t too late</li>
</ul>

<h3>Tweens/teens (11+)</h3>
<ul>
  <li>Independence-friendly layout (safe zones to hang out)</li>
  <li>Sports, water activities, and structured teen options</li>
  <li>Wi-Fi reliability (yes, it matters)</li>
</ul>

<p><strong>Simple rule:</strong> Toddlers need comfort and routine; older kids need activity and freedom.</p>

<h2>Hidden cost traps families notice most</h2>
<p>You don’t need to fear surprises — you just need to ask the right questions.</p>

<ul>
  <li><strong>Premium drinks / branded items:</strong> may be extra or limited</li>
  <li><strong>Ice cream, snacks, fresh juices:</strong> sometimes included, sometimes limited by time/venue</li>
  <li><strong>Water activities / games rooms:</strong> can be chargeable</li>
  <li><strong>À la carte limits:</strong> booking requirements or number of visits per stay</li>
</ul>

<p>For a full “avoid surprises” guide, see: <a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts (What UK Travellers Get Surprised By)</a>.</p>

<h2>Copy-paste checklist: questions to ask before you book</h2>
<p>Copy and paste this into your notes and tick it off while you compare options:</p>

<ul>
  <li>Is the room <strong>one space</strong> or does it have a <strong>separate sleeping area</strong>?</li>
  <li>Can we request a <strong>quiet room</strong> away from evening music and service areas?</li>
  <li>Is there a <strong>shallow kids’ pool</strong> and is it close to shade and toilets?</li>
  <li>Do meals include <strong>simple child-friendly basics</strong> every day?</li>
  <li>Is the transfer <strong>shared or private</strong>, and how many stops are typical?</li>
  <li>What is the kids’ club <strong>age range</strong> and <strong>daily schedule</strong>?</li>
  <li>Are there any <strong>chargeable</strong> activities families often assume are included?</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you can’t get a clear answer to the room setup + kids’ pool + snack access, keep looking. Those three decide your daily stress level.</p>

<h2>Red flags (when to think twice)</h2>
<ul>
  <li>“Family room” is vague and no one can describe the layout</li>
  <li>No mention of shallow pool / kids’ facilities beyond one slide</li>
  <li>Food looks impressive but there’s no clear “simple basics” plan</li>
  <li>Evening entertainment is central and the resort can’t offer quiet room options</li>
  <li>Transfer details are unclear or changeable without explanation</li>
</ul>

<h2>Mini packing list for UK families (practical, not overkill)</h2>
<ul>
  <li>Pool shoes (helpful on mixed surfaces)</li>
  <li>High-factor sun protection + aftersun</li>
  <li>Refillable water bottle</li>
  <li>Basic medicines your family relies on (plus plasters)</li>
  <li>Light layer for evenings (some families feel it after sunset depending on season)</li>
</ul>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Family Checklist Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-family-all-inclusive-pool-happy-${timestamp}.jpg`,
            prompt: "A happy family (UK style) at a Turkish resort pool. Parents and two kids playing in shallow water. Sunny day, bright blue water, colorful swimsuits. Authentic family holiday vibe, not staged advertising. Realistic lighting."
        },
        {
            placeholder: '<!-- IMAGE_ROOM_PLACEHOLDER -->',
            filename: `family-suite-room-layout-authentic-${timestamp}.jpg`,
            prompt: "Interior of a practical family hotel room in Turkey. Showing a separate sleeping area or a partition. Clean, bright, with a balcony view. Authentic travel photo style. No ultra-wide angle distortion."
        },
        {
            placeholder: '<!-- IMAGE_KIDS_FOOD_PLACEHOLDER -->',
            filename: `kids-buffet-food-options-authentic-${timestamp}.jpg`,
            prompt: "A section of a hotel buffet with kid-friendly food options (pasta, fruit, simple snacks). Bright, clean, appetizing. Authentic food photography style. No plastic fake food look."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('COVER')) await sleep(8000);

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
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Aile Tatili Kontrol Listesi (TR Pasif)" },
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
