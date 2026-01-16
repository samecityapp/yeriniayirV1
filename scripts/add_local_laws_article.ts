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
    slug: 'turkey-local-laws-uk-tourists-rules-guide',
    title: 'Turkey Local Laws for UK Tourists: Simple Rules That Keep Your Trip Smooth (Positive Guide)',
    meta_description: 'Turkey is an easy, welcoming destination for UK travellers — and a smooth trip mostly comes down to a few simple local rules: carry photo ID, follow smoke-free indoor/public transport rules, be mindful around official sites when taking photos, and shop souvenirs sensibly. This guide keeps it practical, positive, and hassle-free.',
    primary_keyword: 'Turkey local laws for UK tourists',
    content: `<p><strong>Quick answer:</strong> Turkey is a straightforward place to holiday when you follow a few clear “local basics”: carry photographic ID, respect smoke-free indoor spaces and public transport, be sensible around official sites when using cameras, and keep your shopping focused on normal souvenirs. Do those, and most trips feel easy from day one.</p>

<h2>Why this matters (in a good way)</h2>
<p>Local laws aren’t something to worry about — they’re just the “house rules” that make daily life run smoothly. If you know them in advance, you feel more confident and your holiday stays relaxing.</p>

<p><strong>Simple rule:</strong> Aim for “quietly prepared”. It’s the fastest route to a stress-free trip.</p>

<h2>The 7 Turkey “house rules” most useful for UK travellers</h2>

<h3>1) Carry photographic ID</h3>
<p>In Turkey, you should carry some form of photographic ID. The simplest approach for UK visitors is to keep your passport with you (or a residence permit if you live in Turkey).</p>

<ul>
  <li>Keep your ID accessible, especially in busy city areas</li>
  <li>Store a separate photo/scan securely on your phone (backup, not a replacement)</li>
  <li>Keep your original document safe and dry (a simple zip pouch helps)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Make your “ID routine” automatic: same pocket, same bag compartment, every day.</p>

<p>Related prep guide: <a href="/guide/turkey-tourist-basics-brits-documents-check-in-guide">Turkey Tourist Basics for Brits: Documents & Arrival Day</a></p>

<!-- IMAGE_ID_CARD_PLACEHOLDER -->

<h3>2) Respect smoke-free rules indoors and on public transport</h3>
<p>Turkey has clear smoke-free rules for indoor public spaces and public transport. You’ll also see restrictions in certain outdoor event areas.</p>

<ul>
  <li>If you’re unsure, look for signs and follow the local setup</li>
  <li>In cafés and restaurants, outdoor seating is often the “easy” choice for smokers</li>
  <li>If you don’t smoke, choosing smoke-free spaces is usually straightforward</li>
</ul>

<p><strong>Simple rule:</strong> Follow the signs — it keeps everything comfortable for everyone.</p>

<!-- IMAGE_NO_SMOKING_SIGN_PLACEHOLDER -->

<h3>3) Be mindful with cameras near official sites</h3>
<p>Turkey is extremely photogenic — cities, coastlines, markets, sunsets. You can take plenty of photos, but keep one practical boundary in mind: avoid photographing near military or official installations, and ask before photographing people up close.</p>

<ul>
  <li>When in doubt, put the camera down and move a few steps away</li>
  <li>If you’re taking a close-up of a person (e.g., a vendor), a quick “Is it OK?” gesture works well</li>
  <li>In religious or respectful spaces, follow signs and mirror local behaviour</li>
</ul>

<p><strong>UK-friendly tip:</strong> Wide shots of streets, views, and scenery are usually the smoothest choice.</p>

<!-- IMAGE_CAMERA_SCENERY_PLACEHOLDER -->

<h3>4) Souvenir shopping: keep it simple and modern</h3>
<p>Turkey has brilliant everyday souvenirs — textiles, ceramics, spices, modern crafts, and local treats. The simplest rule is: buy normal, modern souvenirs you genuinely like.</p>

<ul>
  <li>Focus on regular gifts and everyday items</li>
  <li>If something is marketed as “very old” or “historical”, treat it as a “not worth the hassle” category</li>
  <li>If you love antiques, only consider clearly legitimate channels with proper paperwork</li>
</ul>

<p><strong>Simple rule:</strong> Modern souvenirs = easy travel. “Antique-looking” items = unnecessary complexity.</p>

<!-- IMAGE_SOUVENIRS_PLACEHOLDER -->

<h3>5) Drones: register and fly responsibly (or skip it)</h3>
<p>If you fly drones, Turkey has an official system for unmanned aircraft. A simple rule of thumb is based on weight:</p>

<ul>
  <li><strong>500g and above:</strong> registration/approval requirements apply via the Turkish civil aviation system</li>
  <li><strong>Under 500g:</strong> requirements may be lighter, but you still need to respect no-fly zones and local restrictions</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re not 100% sure about rules in a specific location, enjoy the view and film from the ground. Your holiday is the priority.</p>

<h3>6) Ramadan: travel with a little extra cultural awareness</h3>
<p>Ramadan is a meaningful month, and Turkey remains very welcoming to visitors. In some local neighbourhoods, it’s considerate to be discreet with eating/drinking during daytime in public.</p>

<ul>
  <li>In tourist areas and resorts, services often continue normally</li>
  <li>In local areas, a little discretion in daytime is appreciated</li>
  <li>Evenings can feel especially lively and social</li>
</ul>

<p><strong>Simple rule:</strong> Mirror the neighbourhood. Tourist zone = relaxed; local zone = a bit more discreet in daytime.</p>

<h3>7) Everyday respect for national symbols and public spaces</h3>
<p>As with many countries, it’s best to treat national symbols and public spaces respectfully — in person and online. This isn’t about walking on eggshells; it’s simply good travel manners.</p>

<ul>
  <li>Keep your tone respectful in public conversations</li>
  <li>Be mindful about what you post publicly online while travelling</li>
  <li>When unsure, choose the more respectful option</li>
</ul>

<p><strong>UK-friendly tip:</strong> The best travel mindset is “friendly, neutral, and focused on enjoying the trip”.</p>

<!-- IMAGE_RESPECTFUL_TRAVEL_PLACEHOLDER -->

<h2>The “smooth day” checklist (copy-paste)</h2>
<p>Copy this into your notes and you’ll feel instantly organised:</p>

<ul>
  <li>Passport (or residence permit) on me</li>
  <li>Backup photo of passport stored securely</li>
  <li>Accommodation address screenshot saved offline</li>
  <li>Transfer plan confirmed (meeting point + contact)</li>
  <li>Smoke-free rules followed indoors/public transport</li>
  <li>Camera use: avoid official sites; ask before close-up portraits</li>
  <li>Souvenirs: modern items only</li>
</ul>

<p>Helpful companion reads:</p>
<ul>
  <li><a href="/guide/turkey-travel-etiquette-for-brits-guide">Turkey Travel Etiquette for Brits</a></li>
  <li><a href="/guide/emergency-numbers-pharmacies-getting-help-turkey-guide">Emergency Numbers, Pharmacies & Getting Help in Turkey</a></li>
  <li><a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey: Reliable Options</a></li>
</ul>

<h2>FAQ: Turkey local laws (UK travellers’ common questions)</h2>

<h3>Do I really need to carry my passport every day?</h3>
<p>Turkey expects people to carry photographic ID. Many UK travellers choose to carry their passport day-to-day for simplicity. A digital copy is a useful backup, but it’s not the same as carrying the original.</p>

<h3>Can I take photos freely as a tourist?</h3>
<p>You can take loads of scenery and holiday photos. The practical boundary is to avoid photography near military or official installations, and ask permission before close-up photos of people.</p>

<h3>Is smoking allowed in restaurants and indoor public places?</h3>
<p>Turkey has smoke-free rules for indoor public places and public transport. When in doubt, follow signage and choose the seating area that matches the venue’s setup.</p>

<h3>What’s the simplest approach to souvenirs?</h3>
<p>Stick to modern souvenirs (textiles, crafts, ceramics, food items). If something is presented as historical/antique, it’s usually best to skip it and choose a normal souvenir instead.</p>

<h3>Can I fly a drone on holiday in Turkey?</h3>
<p>Turkey has an official unmanned aircraft system. If your drone is 500g or above, registration/approval requirements apply. Under 500g may be lighter, but no-fly zones and local restrictions still matter.</p>

<h3>How should I behave during Ramadan as a tourist?</h3>
<p>Turkey is welcoming to visitors. In local neighbourhoods, it’s considerate to be discreet with eating/drinking in public during daytime. In tourist zones and resorts, you’ll usually find things run smoothly as normal.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Local Laws Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_ID_CARD_PLACEHOLDER -->',
            filename: `passport-safe-keeping-authentic-${timestamp}.jpg`,
            prompt: "A close-up highly realistic shot of a British passport in a travel pouch or safe inside a hotel room. Authentic travel security vibe. Soft lighting, detailed texture of the passport. Not a stock photo."
        },
        {
            placeholder: '<!-- IMAGE_NO_SMOKING_SIGN_PLACEHOLDER -->',
            filename: `no-smoking-sign-turkey-authentic-${timestamp}.jpg`,
            prompt: "A clear 'Sigara İçilmez' (No Smoking) sign on a glass window of a modern Turkish cafe. Reflections of the sunny street outside. Authentic urban detail photography. High resolution."
        },
        {
            placeholder: '<!-- IMAGE_CAMERA_SCENERY_PLACEHOLDER -->',
            filename: `tourist-taking-scenery-photo-authentic-${timestamp}.jpg`,
            prompt: "A tourist taking a photo of a beautiful Turkish landscape (e.g., Cappadocia or a coastal view) with a professional camera. Focus on the person and the camera screen. Golden hour lighting. Authentic travel moment. No military objects."
        },
        {
            placeholder: '<!-- IMAGE_SOUVENIRS_PLACEHOLDER -->',
            filename: `modern-turkish-souvenirs-ceramics-authentic-${timestamp}.jpg`,
            prompt: "A vibrant display of modern Turkish ceramics (bowls, plates) in a shop. Colorful, detailed patterns. Authentic market vibe, but clearly modern goods (not antiques). Shallow depth of field."
        },
        {
            placeholder: '<!-- IMAGE_RESPECTFUL_TRAVEL_PLACEHOLDER -->',
            filename: `respectful-tourist-mosque-courtyard-authentic-${timestamp}.jpg`,
            prompt: "A respectful tourist walking quietly in the courtyard of a historic mosque in Istanbul. Dressed modestly. Peaceful atmosphere. Authentic architectural details in background. Cinematic travel photography."
        }
    ];

    let finalContent = ARTICLE_DATA.content;
    let coverImageUrl = '';

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        if (!item.placeholder.includes('ID')) await sleep(8000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {
            // First image is cover or maybe the scenery one? Let's use the Scenery one as cover as it is most inspiring
            if (item.filename.includes('scenery')) {
                coverImageUrl = publicUrl;
            }
            const imgTag = `<img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
            finalContent = finalContent.replace(item.placeholder, imgTag);

            // Fallback cover if scenery fails or isn't first (logic check: we prefer scenery but if it fails we might want another)
            if (!coverImageUrl && item.filename.includes('passport')) coverImageUrl = publicUrl;

        } else {
            console.warn("⚠️ Image generation failed for:", item.filename);
            finalContent = finalContent.replace(item.placeholder, '');
        }
    }

    // Insert into DB
    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "İngiliz Turistler İçin Türkiye Yerel Kuralları (TR Pasif)" },
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
