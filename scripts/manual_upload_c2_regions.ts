
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
  process.env.SUPABASE_SERVICE_ROLE_KEY! // USE SERVICE ROLE
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

// --- ARTICLE DATA ---
const articleData = {
  slug: "best-regions-for-all-inclusive-in-turkey-which-coast-fits-your-style",
  title: "Best Regions for All-Inclusive in Turkey: Which Coast Fits Your Style? (UK-Friendly Guide)",
  meta_description: "Choosing an all-inclusive region in Turkey from the UK? Use this practical guide to match your travel style to the right coast — family-first resorts, calm “quiet luxury”, lively nightlife, or nature-led escapes.",
  prompts: [
    "A wide panoramic shot of Lara Beach Antalya, golden sand, large luxury hotels in distance, sunny blue sky.",
    "A scenic view of Oludeniz blue lagoon in Fethiye from above, paragliders in sky, turquoise water, green mountains.",
    "A chic white-washed street in Bodrum with bougainvillea flowers, blue wooden shutters, cobblestones, no people.",
    "A comparison split image: Left side sandy beach with parasols, Right side pine forest bay with yacht.",
    "Couples having dinner at a seaside restaurant in warm sunset light, wine glasses on table, romantic atmosphere."
  ],
  // Provided content with basic HTML structure. Images will be injected.
  content: `
<h1>Best Regions for All-Inclusive in Turkey: Which Coast Fits Your Style?</h1>

<p><strong>Quick answer:</strong> The “best” all-inclusive region in Turkey depends on the kind of holiday you want. If you want the biggest resort choice and the most classic all-inclusive set-up, the <strong>Antalya region</strong> is the go-to for many UK travellers. If you want a more scenic, mixed holiday feel (beach + boat days + exploring), the <strong>Dalaman Coast</strong> often fits better. If you want a more “town + coast” vibe with shorter, easy exploring days, parts of the <strong>Aegean Coast</strong> can feel ideal. Use the guide below to match your style to the right coast, without guesswork.</p>

<!-- IMG_0 -->

<h2>Start here: choose your all-inclusive “holiday type”</h2>
<p>Before you pick a coast, decide what you want your days to feel like. Most UK travellers fall into one of these:</p>
<ul>
  <li><strong>Family-first ease:</strong> kids’ facilities, predictable meals, low-effort days.</li>
  <li><strong>Couples’ reset:</strong> calm pools, good food, nice evenings, not too hectic.</li>
  <li><strong>Adults-only vibe:</strong> quiet luxury or a lively party atmosphere (very different experiences).</li>
  <li><strong>Beach-first:</strong> you want the beach to be the main event.</li>
  <li><strong>Mixed holiday:</strong> resort comfort plus day trips, boat days, scenic exploring.</li>
</ul>

<p><strong>Simple rule:</strong> Pick your holiday type first. The “best region” becomes obvious after that.</p>

<h2>What “all-inclusive in Turkey” usually means (so you compare regions properly)</h2>
<p>All-inclusive in Turkey can be excellent value and very easy — but packages and resort styles vary. The point of this article is the <em>region choice</em>, not the fine print, but you’ll compare regions better if you understand the basics:</p>
<ul>
  <li>Some areas are built around <strong>large resort complexes</strong> with lots of facilities.</li>
  <li>Other areas suit <strong>smaller-scale</strong> resort-style stays with a more scenic, “out and about” feel.</li>
  <li>The same coast can contain very different resort areas (family-focused, quieter, or more lively).</li>
</ul>

<p>Deep dive (optional): <a href="/en/guide/all-inclusive-whats-included-turkey-guide">All-Inclusive in Turkey: What’s Included (and What Usually Isn’t)</a></p>

<!-- IMG_1 -->

<h2>The three main all-inclusive “coast choices” for UK travellers</h2>
<p>For most UK travellers, all-inclusive planning comes down to three coastal zones:</p>
<ul>
  <li><strong>Antalya region (Mediterranean Coast):</strong> big resort choice, classic all-inclusive set-up.</li>
  <li><strong>Dalaman Coast (southwest):</strong> scenic coast, mixed holiday energy, great for boat-and-explore days.</li>
  <li><strong>Aegean Coast (west/southwest):</strong> town-and-coast feel, easier exploring, great shoulder-season vibes.</li>
</ul>

<p><strong>UK-friendly tip:</strong> Think of it like this: Antalya = “resort universe”, Dalaman = “scenic holiday”, Aegean = “coast + character”.</p>

<h2>Antalya region: best for classic all-inclusive scale and choice</h2>
<p>If you want Turkey’s most established all-inclusive infrastructure, the Antalya region is usually the strongest match. It’s known for resort areas that are designed around:</p>
<ul>
  <li><strong>Large, facility-heavy resorts</strong> (lots happening on-site)</li>
  <li><strong>Family-friendly layouts</strong> and structured entertainment</li>
  <li><strong>Convenient “stay-in-one-place” holidays</strong></li>
</ul>

<h3>Who the Antalya region fits best</h3>
<ul>
  <li><strong>Families</strong> who want predictable, low-effort days</li>
  <li><strong>First-time all-inclusive travellers</strong> who want the classic experience</li>
  <li><strong>People who want variety inside the resort</strong> (pools, activities, evening shows)</li>
  <li><strong>Heat lovers</strong> (in peak summer, it’s full summer energy)</li>
</ul>

<h3>How to choose an Antalya-area resort zone (without naming hotels)</h3>
<p>Different resort areas can feel different. Use these “vibe labels” when you research:</p>
<ul>
  <li><strong>Family hubs:</strong> lots of kids’ facilities, larger resorts, busy daytime energy</li>
  <li><strong>Couples-friendly zones:</strong> calmer pools, nicer evening atmosphere, less constant activity noise</li>
  <li><strong>Nature/landscape areas:</strong> more scenic surroundings and outdoor feel</li>
</ul>

<p><strong>Simple rule:</strong> In the Antalya region, you’re choosing <em>resort style</em> more than you’re choosing “a town”. Pick a zone that matches your daily rhythm.</p>

<h3>Antalya region “best-for” cheat sheet</h3>
<ul>
  <li><strong>Best for families:</strong> big resort infrastructure and on-site variety</li>
  <li><strong>Best for all-inclusive first-timers:</strong> easiest place to get the full concept</li>
  <li><strong>Best for maximum facilities:</strong> most choice in one region</li>
</ul>

<!-- IMG_2 -->

<h2>Dalaman Coast: best for scenic, mixed holidays (resort + exploring)</h2>
<p>The Dalaman Coast (southwest) often appeals to UK travellers who want all-inclusive comfort <em>and</em> a more “out and about” holiday feeling. Many people love it for:</p>
<ul>
  <li><strong>Scenery-first coastlines</strong> and a holiday vibe beyond the resort gates</li>
  <li><strong>Boat day culture</strong> and water-focused excursions (where available)</li>
  <li><strong>Mixing resort relaxation with casual exploring</strong></li>
</ul>

<h3>Who the Dalaman Coast fits best</h3>
<ul>
  <li><strong>Couples</strong> who want relaxed days and great evenings</li>
  <li><strong>Mixed-holiday travellers</strong> who get bored staying only inside a resort</li>
  <li><strong>People who like “scenic wins”</strong> (viewpoints, walks, sea-day moments)</li>
  <li><strong>Repeat Turkey visitors</strong> looking for a different feel than the biggest resort zones</li>
</ul>

<h3>Dalaman Coast “best-for” cheat sheet</h3>
<ul>
  <li><strong>Best for scenic variety:</strong> when you want the destination to feel like part of the holiday</li>
  <li><strong>Best for couples’ balance:</strong> resort comfort + easy adventures</li>
  <li><strong>Best for a flexible itinerary:</strong> you can build day trips without turning your week into a marathon</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re the kind of traveller who says, “Let’s do something today,” Dalaman-style bases often suit you better than a purely resort-centric plan.</p>

<h2>Aegean Coast: best for “coast + character” and easier exploring</h2>
<p>Parts of the Aegean Coast can feel ideal if you want all-inclusive comfort but also enjoy a bit more “town-and-coast” character. It can work especially well for:</p>
<ul>
  <li><strong>Shoulder-season trips</strong> where comfortable exploring matters</li>
  <li><strong>Short day trips</strong> and casual “wander and eat” days</li>
  <li><strong>Travellers who value atmosphere</strong> and variety outside the resort</li>
</ul>

<h3>Who the Aegean Coast fits best</h3>
<ul>
  <li><strong>People who want a more balanced climate feel</strong> for walking-heavy holidays</li>
  <li><strong>Travellers who like a bit of buzz</strong> without designing the whole trip around nightlife</li>
  <li><strong>Food-and-stroll travellers</strong> who love evenings out and short walks</li>
</ul>

<h3>Aegean Coast “best-for” cheat sheet</h3>
<ul>
  <li><strong>Best for shoulder-season comfort:</strong> when your trip includes exploring, not just sunbathing</li>
  <li><strong>Best for atmosphere:</strong> if you want your holiday to feel “lived-in”</li>
  <li><strong>Best for mixing resort time with town time:</strong> easy to add small adventures</li>
</ul>

<p><strong>Simple rule:</strong> Choose the Aegean when you want all-inclusive to be your <em>base</em>, not your entire holiday.</p>

<!-- IMG_3 -->

<h2>Beach reality check: what kind of beach do you want?</h2>
<p>Not all resort beaches feel the same — and this can influence which region you’ll enjoy most. Without making any “best beach” claims, here’s a practical way to choose:</p>

<h3>Choose based on your beach preferences</h3>
<ul>
  <li><strong>Easy family beach days:</strong> you’ll value convenience, shade options, and calm routines</li>
  <li><strong>Swim-and-sun adults:</strong> you’ll value comfortable sunbeds, quiet zones, and good sea access</li>
  <li><strong>Walks and scenery:</strong> you’ll value views, promenades, and evening atmosphere</li>
</ul>

<p><strong>UK-friendly tip:</strong> The best beach for you is the one that matches your daily rhythm. A perfect-looking beach is less important than “does it feel easy at 11am and 5pm?”.</p>

<h2>Transfers and airport logic: choose the coast that fits your tolerance</h2>
<p>For UK travellers, transfer time can quietly decide whether the first day feels smooth or tiring. You don’t need exact minutes to plan smart — you just need a simple rule:</p>

<ul>
  <li><strong>If you hate long transfers:</strong> prioritise a base that keeps airport-to-resort logistics simple.</li>
  <li><strong>If you’re fine with a longer transfer for a better vibe:</strong> you can widen your options.</li>
  <li><strong>If you’re travelling with young kids:</strong> shorter and simpler usually wins.</li>
</ul>

<p><strong>Simple rule:</strong> Your “arrival day” should feel easy. If you’re landing late, pick the simplest transfer set-up.</p>

<p>Transfer planning help: <a href="/en/guide/resort-transfers-turkey-reliable-options">Resort Transfers in Turkey: Reliable Options and What to Avoid</a></p>

<h2>Which region fits your style? (Pick your profile)</h2>

<h3>Profile 1: “We want an easy family week with minimal decisions.”</h3>
<ul>
  <li><strong>Best match:</strong> Antalya region (classic large-scale all-inclusive)</li>
  <li><strong>Plan style:</strong> resort-led days + 1 short outing max</li>
  <li><strong>Non-negotiables:</strong> kids’ food options, shade, easy access to snacks and water</li>
</ul>

<p>Family checklist: <a href="/en/guide/all-inclusive-turkey-for-families-uk-parent-checklist">All-Inclusive for Families: The Non-Negotiables (UK Parent Checklist)</a></p>

<h3>Profile 2: “We want a couples’ reset — calm, comfortable, nice evenings.”</h3>
<ul>
  <li><strong>Best match:</strong> Dalaman Coast or calmer zones within Antalya region</li>
  <li><strong>Plan style:</strong> relaxed mornings, scenic afternoons, easy evenings out</li>
  <li><strong>Non-negotiables:</strong> quiet pool zones, comfortable evening atmosphere</li>
</ul>

<h3>Profile 3: “We want adults-only — but we need the right vibe.”</h3>
<ul>
  <li><strong>Best match:</strong> depends on whether you want quiet luxury or lively party energy</li>
  <li><strong>Plan style:</strong> pick your vibe first, then pick the region that supports it</li>
</ul>

<p>Adults-only guide: <a href="/en/guide/adults-only-all-inclusive-turkey-guide-quiet-vs-party">Adults-Only All-Inclusive: How to Choose</a></p>

<h3>Profile 4: “We’ll get bored if we stay inside the resort all week.”</h3>
<ul>
  <li><strong>Best match:</strong> Dalaman Coast or Aegean Coast</li>
  <li><strong>Plan style:</strong> 3 resort days + 2 easy outings + 1 boat/scenic day</li>
  <li><strong>Non-negotiables:</strong> easy excursion options and walkable evening atmosphere</li>
</ul>

<h3>Profile 5: “We want the simplest ‘first Turkey all-inclusive’ choice.”</h3>
<ul>
  <li><strong>Best match:</strong> Antalya region</li>
  <li><strong>Plan style:</strong> keep it classic, keep it easy, focus on comfort</li>
  <li><strong>Non-negotiables:</strong> clear inclusions, predictable meals, easy daily rhythm</li>
</ul>

<!-- IMG_4 -->

<h2>Timing matters: match your region to your month</h2>
<p>Turkey’s coasts can feel different depending on season. Instead of chasing exact temperatures, plan based on comfort:</p>
<ul>
  <li><strong>Peak summer:</strong> choose the region and resort style that makes heat feel enjoyable (shade, pools, evening comfort).</li>
  <li><strong>Shoulder season:</strong> choose regions that suit exploring as well as resort time.</li>
  <li><strong>Cooler months:</strong> plan for “scenic + culture” rather than guaranteed pool days.</li>
</ul>

<p>Season overview: <a href="/en/guide/best-time-to-visit-turkey-uk-weather">Best Time to Visit Turkey from the UK: Weather by Region</a></p>

<p><strong>Simple rule:</strong> In hotter months, your <em>daily rhythm</em> matters as much as your region. In shoulder months, your <em>exploring options</em> matter more.</p>

<h2>Hidden-cost surprises: what to check before you decide a region</h2>
<p>All-inclusive can be excellent value — but UK travellers sometimes get surprised by “extras” that vary by resort style and location. You don’t need to worry; you just need to ask the right questions.</p>

<ul>
  <li>What’s included for drinks and snacks (and at what times)?</li>
  <li>Are some restaurants or experiences extra?</li>
  <li>Is the beach set-up included or are there paid upgrades?</li>
  <li>Are transfers included in your package, or separate?</li>
</ul>

<p>Read next: <a href="/en/guide/hidden-costs-in-turkey-resorts-for-uk-travellers">Hidden Costs in Turkey Resorts (What UK Travellers Get Surprised By)</a></p>

<h2>Copy-paste questions to choose the right region (UK travellers)</h2>
<p>Use these when comparing regions or speaking to a travel agent:</p>
<ul>
  <li>“We want a holiday that feels (resort-led / mixed / exploring-heavy). Which coast suits that best?”</li>
  <li>“We care most about (family facilities / calm pools / evening atmosphere). Which region supports that?”</li>
  <li>“We’re landing (daytime/late). What’s the simplest transfer set-up for our trip?”</li>
  <li>“We want to leave the resort 2–3 times. Which region makes that easiest?”</li>
  <li>“We prefer a calmer vibe. Which resort areas are more couples-friendly?”</li>
</ul>

<h2>Quick checklist: choosing an all-inclusive region in Turkey</h2>
<ul>
  <li><strong>Holiday type chosen:</strong> family / couples / adults-only / mixed ✅</li>
  <li><strong>Heat tolerance considered:</strong> peak summer vs shoulder season ✅</li>
  <li><strong>Beach preference clear:</strong> convenience vs scenery vs swim-led ✅</li>
  <li><strong>Transfer tolerance decided:</strong> short/easy vs flexible ✅</li>
  <li><strong>Exploring plan set:</strong> resort-only vs 2–3 outings ✅</li>
  <li><strong>Extras checked:</strong> restaurants, drinks, beach set-up, transfers ✅</li>
</ul>

<h2>FAQ: Best regions for all-inclusive in Turkey</h2>

<h3>Which region is best for all-inclusive in Turkey for UK travellers?</h3>
<p>It depends on your style. Many UK travellers choose the Antalya region for the biggest classic all-inclusive choice and facility-heavy resorts. Others prefer the Dalaman Coast or Aegean Coast for a more scenic, mixed-holiday feel that includes exploring.</p>

<h3>Is Antalya always the best option?</h3>
<p>Antalya is often the easiest choice for the “classic all-inclusive” experience, especially for families and first-timers. But it’s not automatically best for everyone — if you want scenery-led days and more “out and about” energy, a Dalaman or Aegean base may suit you more.</p>

<h3>Which coast is better for couples?</h3>
<p>Couples often enjoy regions that support calm days and good evenings. Dalaman-style bases can be great for scenic variety, while calmer zones in the Antalya region can work well for a resort-led reset. The key is choosing a couples-friendly resort style rather than focusing only on the name of the coast.</p>

<h3>Which region is best for families?</h3>
<p>Families often find the Antalya region a strong match because many resort areas are designed around family facilities, predictable meals, and on-site variety. The best choice still depends on your children’s ages and your preference for resort-only vs mixed days.</p>

<h3>Is the Aegean good for all-inclusive?</h3>
<p>Yes, especially if you want all-inclusive as a comfortable base while still enjoying a bit of town-and-coast atmosphere and easier exploring. It can also feel especially nice in shoulder-season months when walking comfort matters.</p>

<h3>How do I avoid choosing the wrong region?</h3>
<p>Decide your holiday type first (family-first, couples’ reset, adults-only vibe, or mixed). Then consider transfer tolerance and whether you’ll leave the resort. If you match region to rhythm, it’s very hard to get it wrong.</p>

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
    title: { en: articleData.title, tr: `${articleData.title}(TR)` }, // Placeholder TR
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
