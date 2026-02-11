
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLE_DATA = {
    slug: 'turkey-resort-transfers-guide',
    title: 'Resort Transfers in Turkey: Reliable Options and What to Avoid (UK-Friendly Guide)',
    meta_description: 'Arriving in Turkey? Compare private transfers, shared shuttles, and taxis from the UK. See reliable options, cost warnings, and how to avoid the "airport stress" trap.',
    published_at: new Date().toISOString(),
};

// Reusing existing images where possible + the 2 generated ones
const IMAGES = {
    cover: '/images/articles/resort_transfers_map_app_1770577751586.png', // Generated
    sign: '/images/articles/resort_transfers_airport_sign_1770577766437.png', // Generated
    private_van: '/images/articles/driver-loading-luggage-van-authentic-1767988483591.jpg', // Reused
    shuttle: '/images/articles/dalaman-airport-shuttle-1767122553343.jpg', // Reused
    taxi: '/images/articles/antalya-airport-taxi-rank-1767129109823.jpg', // Reused
    arrival: '/images/articles/airport-arrival-hall-authentic-1767987684522.jpg' // Reused
};

const content = `
<p><strong>Quick answer:</strong> For most UK travellers, a <strong>private transfer</strong> is the “sweet spot” for value: it costs only slightly more than a shared shuttle (for a family/group) but saves you 1–2 hours of drop-off loops. Shared shuttles are cheap but slow. Taxis are fine for short hops but can be variable on price. Renting a car just for the airport run is rarely worth the paperwork.</p>

<h2>The 4 main options for UK travellers (ranked by “sanity score”)</h2>

<h3>1) Private Transfer (The UK Favourite)</h3>
<p>You book in advance, the driver waits with a sign (usually your name), and you go straight to your hotel.</p>
<ul>
  <li><strong>Pros:</strong> Zero waiting, fixed price (£), door-to-door, air-con, often free child seats.</li>
  <li><strong>Cons:</strong> You must book before you fly.</li>
  <li><strong>Sanity Score:</strong> 10/10</li>
</ul>

<img src="${IMAGES.private_van}" alt="Private transfer van loading luggage at airport" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h3>2) Shared Shuttle (The Budget Choice)</h3>
<p>You book a seat on a bus. You wait for other flights to land. You stop at 4–8 other hotels before yours.</p>
<ul>
  <li><strong>Pros:</strong> Cheap for solo travellers or couples.</li>
  <li><strong>Cons:</strong> Can add 1–2 hours to your journey. “First on the bus” often means “last off”.</li>
  <li><strong>Sanity Score:</strong> 6/10 (good for price, bad for time)</li>
</ul>

<img src="${IMAGES.shuttle}" alt="Shared shuttle bus at busy airport terminal" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h3>3) Airport Taxi (The "I Forgot to Book" Option)</h3>
<p>Yellow taxis are available 24/7 at ranks. They use meters (usually).</p>
<ul>
  <li><strong>Pros:</strong> No pre-booking needed.</li>
  <li><strong>Cons:</strong> Price varies by traffic. Not all have child seats. Variable vehicle quality.</li>
  <li><strong>Sanity Score:</strong> 7/10</li>
</ul>

<img src="${IMAGES.taxi}" alt="Yellow taxi rank at Turkish airport" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h3>4) Hotel Transfer (The "Easy but Pricey" Option)</h3>
<p>You ask your hotel to arrange it.</p>
<ul>
  <li><strong>Pros:</strong> If it goes wrong, the hotel fixes it.</li>
  <li><strong>Cons:</strong> Often 20–30% more expensive than booking a direct transfer company yourself.</li>
  <li><strong>Sanity Score:</strong> 9/10 (you pay for the ease)</li>
</ul>

<img src="${IMAGES.arrival}" alt="Relaxed arrival at hotel lobby" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>Transfer time reality check (don't underestimate distances)</h2>
<p>Turkey’s coast is huge. “Antalya Airport” transfers cover a massive area.</p>

<ul>
  <li><strong>Antalya Airport to Lara Beach:</strong> 20–30 mins</li>
  <li><strong>Antalya Airport to Belek:</strong> 30–45 mins</li>
  <li><strong>Antalya Airport to Side:</strong> 60–75 mins</li>
  <li><strong>Antalya Airport to Alanya:</strong> 2 hours+ (This is the one that catches people out!)</li>
</ul>

<p><strong>Dalaman Airport:</strong></p>
<ul>
  <li><strong>To Marmaris:</strong> 90 mins</li>
  <li><strong>To Fethiye/Ölüdeniz:</strong> 60 mins</li>
</ul>

<p><strong>Bodrum Airport:</strong></p>
<ul>
  <li><strong>To Bodrum Town:</strong> 40 mins</li>
</ul>

<h2>How to spot reliable companies (UK-friendly checklist)</h2>
<p>Don't just pick the cheapest Google ad.</p>
<ul>
  <li><strong>Do they have a 24/7 WhatsApp number?</strong> (Essential if your flight is delayed).</li>
  <li><strong>Do they ask for your flight number?</strong> (So they track delays).</li>
  <li><strong>Do they offer "pay on arrival" or "free cancellation"?</strong> (Avoids risk if plans change).</li>
  <li><strong>Are child seats free/guaranteed?</strong> (Good companies always offer this).</li>
</ul>

<img src="${IMAGES.sign}" alt="Transfer driver holding name sign at arrivals" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>The "Airport Stress" Trap (and how to avoid it)</h2>
<p>The biggest stress is landing, feeling the heat, wrangling tired kids/bags, and <em>then</em> trying to negotiate transport.</p>

<p><strong>Rule:</strong> If you are travelling with kids or landing after 9 pm, <strong>pre-book a private transfer</strong>. The extra £20 is worth avoiding the argument at the taxi rank.</p>

<img src="${IMAGES.cover}" alt="Tourist checking map app on phone in Turkey" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>FAQ: UK Traveller Transfers</h2>

<h3>Do transfer drivers speak English?</h3>
<p>Usually basic "transport English". But they have WhatsApp and Google Translate. It’s rarely an issue.</p>

<h3>Do I tip the transfer driver?</h3>
<p>It's polite but not mandatory. 50–100 TL (or £2–£3) is appreciated for help with bags.</p>

<h3>What if my flight is delayed?</h3>
<p>If you gave your flight number, they track it. If it's a huge delay (4+ hours), message them on WhatsApp before you fly.</p>

<h3>Can I use Uber?</h3>
<p>Uber exists in Istanbul (calls yellow taxis) and some coastal spots, but it's not reliable for long <em>airport-to-resort</em> journeys. Stick to pre-booked transfers.</p>
`;

async function run() {
    console.log("🚀 Inserting Resort Transfers Article...");

    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye Otel Transfer Rehberi (TR Pasif)" },
        meta_description: { en: ARTICLE_DATA.meta_description, tr: "TR Pasif içerik." },
        content: { en: content, tr: "<p>Bu içerik sadece İngilizce dilinde yayındadır.</p>" },
        cover_image_url: IMAGES.cover,
        published_at: ARTICLE_DATA.published_at,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });

    if (error) {
        console.error("❌ DB Insert Failed:", error);
    } else {
        console.log("✅ Resort Transfers Article Added Successfully!");
        console.log("👉 Slug:", ARTICLE_DATA.slug);
    }
}

run();
