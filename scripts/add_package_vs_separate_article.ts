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
    slug: 'package-vs-separate-turkey',
    title: 'Package Holiday vs Booking Separately for Turkey: A UK Cost Comparison Framework (No Guessing)',
    meta_description: 'Not sure if a package holiday or booking separately is better value for Turkey from the UK? Use this step-by-step comparison framework to check like-for-like costs, what’s actually included, and the copy-paste questions that prevent “cheap” options becoming expensive surprises.',
    primary_keyword: 'package holiday vs booking separately Turkey',
    content: `<p><strong>Quick answer:</strong> For many UK travellers going to Turkey, packages often feel simpler because flights + transfers (and sometimes luggage) are bundled. Booking separately can be better when you want flexibility on flight times, room types, or length of stay — but it only becomes “better value” if you compare the same things: baggage, transfers, board basis, room category, and cancellation terms. Use the framework below to compare like-for-like and avoid hidden costs.</p>

<h2>First, define what “better” means for you</h2>
<p>People argue about “package vs separate” because they’re measuring different outcomes. Decide which matters most for your trip:</p>

<ul>
  <li><strong>Lowest total cost</strong> (all-in, including transfers and bags)</li>
  <li><strong>Lowest hassle</strong> (one booking, one point of contact)</li>
  <li><strong>Most flexibility</strong> (flight times, length of stay, room choice)</li>
  <li><strong>Most confidence</strong> (clear terms, predictable arrival day)</li>
</ul>

<p><strong>Simple rule:</strong> If you don’t define “better”, you’ll end up comparing prices that aren’t comparable.</p>

<h2>The UK “like-for-like” checklist (what you must match in both options)</h2>
<p>Before you compare prices, make sure both options include the same basics. If not, adjust your numbers.</p>

<ul>
  <li><strong>Flights:</strong> same departure airport, similar times, similar airline quality expectation</li>
  <li><strong>Baggage:</strong> carry-on vs checked luggage (and weight limits)</li>
  <li><strong>Transfers:</strong> included or not; shared or private</li>
  <li><strong>Board basis:</strong> all-inclusive vs “ultra/premium” vs half board, etc.</li>
  <li><strong>Room category:</strong> standard vs family room vs swim-up vs suite, etc.</li>
  <li><strong>Cancellation/change terms:</strong> how flexible is each?</li>
</ul>

<p><strong>UK-friendly tip:</strong> Most “packages are cheaper” claims fall apart once you add luggage and transfers to the DIY option — or once you upgrade the package to the same room type.</p>

<!-- IMAGE_COVER_PLACEHOLDER -->

<h2>Step-by-step comparison framework (use this every time)</h2>

<h3>Step 1: Write your “trip baseline” in one line</h3>
<p>Example format (copy-paste and fill it in):</p>
<ul>
  <li><strong>Dates:</strong> [your dates]</li>
  <li><strong>Departing from:</strong> [UK airport]</li>
  <li><strong>Nights:</strong> [number]</li>
  <li><strong>Board basis:</strong> [all-inclusive]</li>
  <li><strong>Room need:</strong> [e.g., separate sleeping area / quiet room / twin beds]</li>
  <li><strong>Transfer preference:</strong> [shared ok / private only]</li>
</ul>

<p><strong>Simple rule:</strong> If you can’t describe your baseline, you can’t compare value.</p>

<h3>Step 2: Compare flight reality (not just price)</h3>
<p>Two flights can be the same route but a very different experience and cost once you add extras.</p>

<ul>
  <li>Departure and arrival times (late arrivals increase transfer stress)</li>
  <li>Luggage rules and fees</li>
  <li>Seat selection if it matters to you</li>
  <li>Airport convenience (closer airport vs cheaper fare)</li>
</ul>

<p><strong>UK-friendly tip:</strong> A “cheaper” DIY flight that lands very late can cost you more in private transfer needs (or just in holiday stress).</p>

<h3>Step 3: Add transfer cost properly (it changes everything)</h3>
<p>Transfers are often the biggest hidden difference between package and separate bookings.</p>

<ul>
  <li><strong>Package:</strong> transfer may be included (often shared)</li>
  <li><strong>Separate:</strong> you may need to add private or shared transfer yourself</li>
</ul>

<p>Use this to choose the right setup: <a href="/guide/turkey-resort-transfers-guide">Resort Transfers in Turkey: Reliable Options and What to Avoid</a>.</p>

<p><strong>Simple rule:</strong> If you’re travelling with young kids or landing late, factor in private transfer cost when comparing DIY.</p>

<h3>Step 4: Confirm board basis and “what’s included”</h3>
<p>All-inclusive can vary, and “ultra/premium” labels can mean different things. Make sure you’re comparing the same level.</p>

<ul>
  <li>Is it standard all-inclusive or a higher tier?</li>
  <li>Do snacks and late options matter to you (and are they available)?</li>
  <li>Are drinks policies similar for what you actually drink?</li>
</ul>

<p>Get the basics right first: <a href="/guide/all-inclusive-whats-included-turkey">All-Inclusive in Turkey: What’s Included</a>.</p>

<!-- IMAGE_TABLET_COMPARISON_PLACEHOLDER -->

<h3>Step 5: Match room category (this is where comparisons break)</h3>
<p>Packages often price a specific room category. DIY booking might show a cheaper “lead-in” room that isn’t what you need.</p>

<ul>
  <li><strong>Families:</strong> does “family room” mean separate sleeping area, or just extra beds?</li>
  <li><strong>Couples:</strong> do you need quiet placement more than size?</li>
  <li><strong>Everyone:</strong> is it the same view/location category?</li>
</ul>

<p><strong>Simple rule:</strong> Compare the room you’ll actually be happy sleeping in — not the cheapest room on the page.</p>

<p>Families checklist: <a href="/guide/all-inclusive-family-checklist">All-Inclusive for Families: The Non-Negotiables</a>.</p>

<h3>Step 6: Check cancellation and changes (value isn’t just price)</h3>
<p>A cheap deal can be poor value if you can’t change it and your plans shift.</p>

<ul>
  <li>Deposit and balance payment rules</li>
  <li>Change fees</li>
  <li>Refundability</li>
  <li>What happens if flight times change?</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re booking far ahead, flexibility can be part of “value” — especially for families and groups.</p>

<h2>When packages usually win (UK traveller reality)</h2>
<ul>
  <li>You want simple planning and one booking journey</li>
  <li>You like the comfort of bundled transfers</li>
  <li>You’re happy with standard room categories and standard flight times</li>
  <li>You’re travelling in a period where packages are heavily promoted</li>
</ul>

<p><strong>Simple rule:</strong> If you want “easy”, packages are hard to beat.</p>

<!-- IMAGE_LUGGAGE_STACK_PLACEHOLDER -->

<h2>When booking separately often wins</h2>
<ul>
  <li>You want specific flight times or a specific UK departure airport</li>
  <li>You want a specific room type that packages don’t show clearly</li>
  <li>You want to combine destinations or adjust length of stay</li>
  <li>You’re confident organising transfers and managing separate confirmations</li>
</ul>

<p><strong>UK-friendly tip:</strong> Separate booking is best when you have strong preferences — not when you’re trying to save money at all costs.</p>

<h2>Hidden cost traps (where DIY booking can creep up)</h2>
<ul>
  <li>Baggage fees and seat selection added later</li>
  <li>Transfer costs not included</li>
  <li>Choosing the wrong board basis by accident</li>
  <li>Room category upgrades required at checkout</li>
</ul>

<p>Use this “avoid surprises” guide: <a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts</a>.</p>

<!-- IMAGE_VALUE_SCORE_PLACEHOLDER -->

<h2>Copy-paste questions to compare package vs separate properly</h2>
<p>Copy and paste these while you’re comparing offers:</p>

<ul>
  <li>Does the price include <strong>checked baggage</strong>? If yes, what weight?</li>
  <li>Is the airport transfer included? Is it <strong>shared or private</strong>?</li>
  <li>What is the exact <strong>board basis</strong> (standard all-inclusive vs premium/ultra)?</li>
  <li>What is the exact <strong>room category</strong> included in this price?</li>
  <li>What are the <strong>cancellation/change terms</strong> and deadlines?</li>
  <li>Are there any mandatory fees payable locally (if applicable)?</li>
  <li>If flight times change, how is the transfer handled?</li>
</ul>

<p><strong>Simple rule:</strong> If any of these answers are unclear, you’re not comparing like-for-like yet.</p>

<h2>The simplest way to decide (a quick scoring method)</h2>
<p>Give each option a quick 1–5 score:</p>

<ul>
  <li><strong>Price clarity:</strong> do you know the true total cost?</li>
  <li><strong>Friction:</strong> how smooth is arrival/departure day?</li>
  <li><strong>Room fit:</strong> is it the room you actually want?</li>
  <li><strong>Flexibility:</strong> can you change plans if needed?</li>
  <li><strong>Confidence:</strong> do you trust the details and confirmations?</li>
</ul>

<!-- IMAGE_FLIGHT_HOTEL_SPLIT_PLACEHOLDER -->

<p><strong>UK-friendly tip:</strong> The best option is usually the one with the best score in “price clarity” and “friction” — not the lowest headline price.</p>

<p><em>Last updated:</em> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
};

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Package vs DIY Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_COVER_PLACEHOLDER -->',
            filename: `package-vs-diy-travel-planning-uk-${timestamp}.jpg`,
            prompt: "A UK traveller at home with a laptop and a notepad, comparing holiday prices. Screen shows flight and hotel options. Authentic, thoughtful, not stressed. Warm home interior."
        },
        {
            placeholder: '<!-- IMAGE_TABLET_COMPARISON_PLACEHOLDER -->',
            filename: `tablet-screen-booking-comparison-authentic-${timestamp}.jpg`,
            prompt: "A close up over the shoulder shot of someone using a tablet to drag and compare hotel prices vs flight prices. Authentic digital travel planning moment. Soft focus background."
        },
        {
            placeholder: '<!-- IMAGE_LUGGAGE_STACK_PLACEHOLDER -->',
            filename: `airport-luggage-stack-family-travel-${timestamp}.jpg`,
            prompt: "A stack of suitcases and a pushchair at an airport check-in area. Represents the 'luggage cost' factor in travel. Realistic, authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_VALUE_SCORE_PLACEHOLDER -->',
            filename: `handwritten-pros-cons-list-holiday-${timestamp}.jpg`,
            prompt: "A handwritten list on a cafe table titled 'Package vs Separate'. Pros and cons listed. Coffee cup nearby. Authentic decision making vibe."
        },
        {
            placeholder: '<!-- IMAGE_FLIGHT_HOTEL_SPLIT_PLACEHOLDER -->',
            filename: `passport-and-tickets-on-table-authentic-${timestamp}.jpg`,
            prompt: "British passport and printed boarding passes/hotel vouchers on a wooden table. Getting ready to travel. Authentic texture and lighting."
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
        title: { en: ARTICLE_DATA.title, tr: "Paket Tur vs Ayrı Rezervasyon Karşılaştırması (TR Pasif)" },
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
