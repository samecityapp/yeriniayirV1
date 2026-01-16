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
    slug: 'turkey-in-september-from-uk',
    title: 'Turkey in September from the UK: The Sweet Spot Month (Weather, Sea Feel & Best Bases)',
    meta_description: 'Turkey in September is a UK favourite: warm “late summer” days, comfortable evenings, and a relaxed holiday pace compared to peak season. This guide shows what September feels like by region (Aegean vs Mediterranean vs Istanbul vs inland), how to plan beach + exploring days, what to pack, and FAQs — no hotel names.',
    primary_keyword: 'Turkey in September from the UK',
    content: `
<h1>Turkey in September from the UK: The Sweet Spot Month (Weather, Sea Feel & Best Bases)</h1>

<p><strong>Quick answer:</strong> September is one of the best months for many UK travellers visiting Turkey because it combines warm, sunny “late summer” weather with a softer, more comfortable feel than peak season. It’s ideal for a <strong>balanced holiday</strong>: beach time in the afternoon, exploring in the morning, and comfortable evenings for dinners and walks. Choose your base by region (Aegean for an easy mixed trip, Mediterranean for stronger summer warmth, Istanbul for a walkable city break), then pack for warm days and slightly cooler evenings.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>What September in Turkey feels like (in UK terms)</h2>
<ul>
  <li><strong>Late summer:</strong> warm days with a calmer edge.</li>
  <li><strong>Better evenings:</strong> outdoor dinners often feel more comfortable than peak summer.</li>
  <li><strong>Balanced pace:</strong> easier to mix beach and sightseeing without feeling drained.</li>
</ul>

<p><strong>Simple rule:</strong> September is the “do a bit of everything” month — beach + exploring + great evenings.</p>

<h2>September by region: choose the right base for your style</h2>

<h3>Aegean Coast (mixed holiday perfection)</h3>
<ul>
  <li><strong>Best for:</strong> beach + exploring, scenic drives, day trips, outdoor cafés.</li>
  <li><strong>September vibe:</strong> warm and sunny with a more comfortable feel for walking.</li>
  <li><strong>Who it suits:</strong> travellers who want a holiday that’s not “only resort”.</li>
</ul>

<h3>Mediterranean Coast (stronger late-summer warmth)</h3>
<ul>
  <li><strong>Best for:</strong> sun-led breaks, pool-first holidays, all-inclusive ease.</li>
  <li><strong>September vibe:</strong> still very summer-like, often feeling warmer later into the season.</li>
  <li><strong>Who it suits:</strong> travellers who want maximum beach weather without peak-season intensity.</li>
</ul>

<!-- IMAGE_COAST_COMPARISON_PLACEHOLDER -->

<h3>Istanbul region (city break sweet spot)</h3>
<ul>
  <li><strong>Best for:</strong> walking-heavy city breaks, food, neighbourhoods, culture.</li>
  <li><strong>September vibe:</strong> often more comfortable for full days out than peak summer.</li>
  <li><strong>Who it suits:</strong> travellers who want a city trip with great evening atmosphere.</li>
</ul>

<h3>Inland & highland areas (scenery + comfortable exploring)</h3>
<ul>
  <li><strong>Best for:</strong> landscapes, viewpoints, cultural itineraries, calmer travel.</li>
  <li><strong>September vibe:</strong> pleasant days with cooler evenings; great for being outdoors.</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you want the best “holiday comfort”, focus on evenings. September often makes evenings feel genuinely enjoyable.</p>

<h2>Sea feel in September (why swimmers love it)</h2>
<p>September is popular with UK travellers because sea-swimming often feels more naturally “easy” than spring or early summer.</p>
<ul>
  <li>Many people find the sea feels <strong>less brisk</strong> than earlier months.</li>
  <li>The exact feel depends on region, wind, and time of day.</li>
</ul>

<p><strong>Simple rule:</strong> If you want your easiest swim, choose midday or early afternoon when the sun has warmed the day.</p>

<!-- IMAGE_SEA_SWIM_PLACEHOLDER -->

<h2>The perfect September day plan (balanced, not exhausting)</h2>
<p>September is the month where you can enjoy a full day without strict “survival scheduling”.</p>

<ul>
  <li><strong>Morning:</strong> sightseeing, day trips, walking</li>
  <li><strong>Midday:</strong> long lunch + light shade break</li>
  <li><strong>Afternoon:</strong> beach/pool time</li>
  <li><strong>Evening:</strong> dinner out + walk + relaxed night vibe</li>
</ul>

<p><strong>UK-friendly tip:</strong> September is perfect for travellers who want to feel active and relaxed at the same time.</p>

<h2>All-inclusive in September: who it’s ideal for</h2>
<p>September can be a brilliant all-inclusive month because you still get summer weather but often with a calmer overall feel.</p>
<ul>
  <li><strong>Great for:</strong> couples, families, and anyone who wants an easy holiday rhythm</li>
  <li><strong>Smart move:</strong> add 1–2 short excursions and keep the rest relaxed</li>
</ul>

<p>Useful reads:</p>
<ul>
  <li><a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a></li>
  <li><a href="/guide/best-all-inclusive-value-uk-turkey">How to Get the Best All-Inclusive Value from the UK</a></li>
</ul>

<h2>What to pack for Turkey in September (UK-friendly essentials)</h2>
<p>September packing is easy: warm days, slightly cooler evenings.</p>

<ul>
  <li>Light layers for evenings (one overshirt/jacket)</li>
  <li>Comfortable walking shoes</li>
  <li>Sun essentials (sunscreen, sunglasses, hat)</li>
  <li>Swimwear + light cover-up</li>
  <li>Small rain backup (useful in shoulder season)</li>
</ul>

<p><strong>Simple rule:</strong> September packing is “summer kit + one evening layer”.</p>

<!-- IMAGE_PACKING_SEPTEMBER_PLACEHOLDER -->

<p>Comfort guide: <a href="/guide/staying-healthy-in-turkey-uk-checklist">Staying Healthy in Turkey: Simple Rules</a></p>

<h2>September money mindset (keep it calm and flexible)</h2>
<p>September often feels great for “value” because you can do more walking and exploring comfortably.</p>
<ul>
  <li>Choose your daily style: <strong>simple / balanced / treat</strong></li>
  <li>Plan 1–2 treat moments, keep the rest relaxed</li>
</ul>

<p>Budget framework: <a href="/guide/money-budgeting-turkey-daily-cost-framework-uk">Money in Turkey: Daily Budget Framework</a></p>

<!-- IMAGE_OUTDOOR_DINING_PLACEHOLDER -->

<h2>Copy-paste planning prompts (September edition)</h2>
<ul>
  <li>“We want a balanced holiday: exploring mornings and beach afternoons — which base suits September best?”</li>
  <li>“We want comfortable evenings for walking and dinners — which coast fits that vibe?”</li>
  <li>“We want sea swimming daily — what time of day is easiest in September?”</li>
  <li>“We want a calmer trip — should we go early or later in September?”</li>
</ul>

<h2>FAQ: Turkey in September (UK travellers)</h2>

<h3>Is Turkey hot in September?</h3>
<p>September is generally warm and sunny, with a softer feel than peak summer. The Mediterranean coast often stays more summer-like later, while other regions can feel very comfortable for walking and exploring.</p>

<h3>Is September a good month for a beach holiday?</h3>
<p>Yes. September is often ideal for beach holidays because the weather can feel warm and the sea often feels easier than earlier in the year for many travellers.</p>

<h3>Which is better in September: Aegean or Mediterranean?</h3>
<p>Aegean is great for a balanced “mixed holiday” with exploring. Mediterranean is great for stronger late-summer warmth and a more sun-led resort vibe.</p>

<h3>Is September good for Istanbul?</h3>
<p>Yes — many travellers find September more comfortable for full walking days compared to peak summer, while still enjoying lively evenings.</p>

<h3>What should I pack for Turkey in September from the UK?</h3>
<p>Bring your summer essentials plus one light evening layer. Add comfortable walking shoes and a small rain backup for shoulder-season flexibility.</p>

<h3>Is September good for all-inclusive?</h3>
<p>Yes. It’s often a sweet spot: summer weather with a calmer feel. Add one or two short excursions for a perfect balance.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB')}</p>
`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Turkey in September Guide Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `turkey-september-late-summer-vibe-${timestamp}.jpg`,
            prompt: "A beautiful, serene beach scene in Turkey in September. Soft warm sunlight, clear water, not too crowded. The 'golden hour' feel of late summer. Authentic travel photography. High quality."
        },
        {
            placeholder: '<!-- IMAGE_COAST_COMPARISON_PLACEHOLDER -->',
            filename: `aegean-town-street-cafe-september-${timestamp}.jpg`,
            prompt: "A charming street scene in an Aegean coastal town (like Alaçatı or Bodrum). Stone buildings, bougainvillea, outdoor cafe tables. Sunny but relaxed atmosphere. Authentic travel lifestyle."
        },
        {
            placeholder: '<!-- IMAGE_SEA_SWIM_PLACEHOLDER -->',
            filename: `september-swimming-calm-sea-turkey-${timestamp}.jpg`,
            prompt: "A swimmer enjoying the calm, warm sea in Turkey in late afternoon. Soft lighting, peaceful water texture. The feeling of an 'easy' swim. Authentic, natural travel photo."
        },
        {
            placeholder: '<!-- IMAGE_PACKING_SEPTEMBER_PLACEHOLDER -->',
            filename: `packing-for-september-turkey-layers-${timestamp}.jpg`,
            prompt: "Flat lay of packing for September in Turkey. Summer clothes plus a light denim jacket or linen shirt for evenings. Walking shoes. Sunglasses. Authentic travel style."
        },
        {
            placeholder: '<!-- IMAGE_OUTDOOR_DINING_PLACEHOLDER -->',
            filename: `outdoor-evening-dinner-september-turkey-${timestamp}.jpg`,
            prompt: "Outdoor dining in a Turkish town at dusk. Warm string lights, people laughing, comfortable temperature distinct from peak summer sweat. Inviting, authentic evening atmosphere."
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
        title: { en: ARTICLE_DATA.title, tr: "Eylül'de Türkiye: En Tatlı Geçiş Ayı (TR Pasif)" },
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
