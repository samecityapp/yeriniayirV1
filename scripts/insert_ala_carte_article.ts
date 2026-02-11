
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLE_DATA = {
    slug: 'a-la-carte-all-inclusive-turkey',
    title: 'A La Carte Restaurants in Turkey All-Inclusive: How It Works (UK-Friendly No-Surprises Guide)',
    meta_description: 'Confused about à la carte restaurants in Turkey all-inclusive resorts? This UK-friendly guide explains how it usually works, booking rules, extra costs, and how to avoid surprises.',
    published_at: new Date().toISOString(),
};

const IMAGES = {
    cover: '/images/articles/alacarte_romantic_dinner_1770577127682.png',
    family: '/images/articles/alacarte_family_dinner_1770577141880.png',
    reservation: '/images/articles/guest_relations_reservation_1770577154600.png',
    dress_code: '/images/articles/smart_casual_dress_code_1770577168112.png',
    food: '/images/articles/turkish_specialty_dish_1770577182380.png',
    atmosphere: '/images/articles/calm_restaurant_atmosphere_1770577199013.png'
};

const content = `
<p><strong>Quick answer:</strong> In Turkey, “all-inclusive” usually covers the main buffet and standard snack spots, while à la carte restaurants are often a special add-on experience with rules: you may need a reservation, there may be a limited number of included visits (or a small surcharge), and popular time slots can fill quickly. The smartest approach is simple: treat à la carte as a planned highlight, not something you “figure out later”.</p>

<h2>First: what “à la carte” means in a Turkey resort context</h2>

<p>In an all-inclusive resort, you’ll usually see two dining styles:</p>
<ul>
    <li><strong>Main restaurant (buffet):</strong> the default option, open daily, usually included</li>
    <li><strong>À la carte / specialty restaurants:</strong> themed dining experiences (often smaller, quieter, more “date night” feeling)</li>
</ul>

<p><strong>Simple rule:</strong> Buffet is your reliable daily engine. À la carte is your “special evening”.</p>

<h2>What UK travellers often misunderstand (so you won’t)</h2>

<h3>Misunderstanding #1: “All-inclusive means every restaurant is included.”</h3>
<p>Not always. Many resorts include the buffet and standard snack venues, while à la carte can be:</p>
<ul>
    <li>included but limited (e.g., “one visit per stay”)</li>
    <li>included only for longer stays</li>
    <li>included on specific nights</li>
    <li>available with a surcharge</li>
</ul>

<p><strong>Simple rule:</strong> Never assume à la carte is unlimited. Always check the exact rule for your booking.</p>

<img src="${IMAGES.family}" alt="Family enjoying a relaxed à la carte dinner in Turkey" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h3>Misunderstanding #2: “We’ll just walk in.”</h3>
<p>Often you can’t. Reservations are common, especially at peak times.</p>
<p><strong>UK-friendly tip:</strong> If you care about à la carte, do your reservation plan on day 1. It’s the easiest win of the trip.</p>


<h2>The most common à la carte models in Turkey all-inclusive (how it “usually” works)</h2>

<p>Resorts vary, but these are the typical patterns you’ll run into:</p>

<ul>
    <li><strong>Model A: Included, but limited</strong><br>You get a set number of à la carte visits per stay. Often requires a reservation. Prime slots can fill.</li>
    <li><strong>Model B: Included for longer stays</strong><br>Short stays may not include it. Longer stays may include one or more visits.</li>
    <li><strong>Model C: Small surcharge per person</strong><br>Buffet is included daily. À la carte is treated like a premium upgrade. Reservation still required.</li>
    <li><strong>Model D: Included, but with restrictions</strong><br>Specific restaurants included, others paid. Specific days or times. Certain menu items may be extra.</li>
</ul>

<p><strong>Simple rule:</strong> Ask “How many visits are included for our stay, and which restaurants count?” That’s the clarity question.</p>

<h2>Reservations: the real game (and how to win it)</h2>

<p>If you want a smooth à la carte experience, treat reservations like theatre tickets: the best slots go first.</p>

<img src="${IMAGES.reservation}" alt="Guest making dinner reservation at guest relations desk" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h3>What to do on Day 1</h3>
<ul>
    <li>Find out how reservations work (desk, app, QR code, guest services, etc.)</li>
    <li>Ask what time reservations open each day</li>
    <li>Book your preferred night early (especially for weekends and peak season)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Book one “special dinner” early in the trip — not on the last night. If anything changes, you still have time to adjust.</p>

<h3>When to book</h3>
<ul>
    <li><strong>Peak season:</strong> book as soon as possible</li>
    <li><strong>Shoulder season:</strong> still book early if you care about a specific time</li>
</ul>

<p><strong>Simple rule:</strong> If a resort has limited seating, “later” becomes “no availability”.</p>


<h2>Dress code: what it typically means (without overthinking)</h2>

<p>Many resorts have a “smart casual” vibe for à la carte, even if the buffet is relaxed.</p>

<img src="${IMAGES.dress_code}" alt="Smart casual dress code example for dinner in Turkey" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h3>Practical expectations (UK-friendly)</h3>
<ul>
    <li>A little more polished than poolside</li>
    <li>Footwear and cover-ups matter more</li>
    <li>Beachwear is usually not the vibe</li>
</ul>

<p><strong>Simple rule:</strong> Pack one “nice evening” outfit. You don’t need formal — just not beachwear.</p>


<h2>Food experience: how à la carte differs from buffet (so you pick the right nights)</h2>

<p>À la carte is often a different experience:</p>
<ul>
    <li>quieter atmosphere</li>
    <li>table service</li>
    <li>slower pace</li>
    <li>more “date night” feeling</li>
</ul>

<img src="${IMAGES.food}" alt="Delicious Turkish specialty dish presentation" class="w-full h-auto rounded-lg my-6 shadow-md" />

<p>But it’s not automatically “better” than buffet — it’s different.</p>

<p><strong>Simple rule:</strong> Choose à la carte for atmosphere and pace, not because you assume buffet is inferior.</p>
<p><strong>UK-friendly tip:</strong> Many people enjoy buffet most nights, then do à la carte once or twice for variety and a special evening.</p>


<h2>Kids and à la carte: what families should check</h2>

<p>Families can absolutely enjoy à la carte — but the rules can matter.</p>

<h3>Check these points</h3>
<ul>
    <li>Are children welcome at all à la carte venues?</li>
    <li>Are there kid-friendly menu options?</li>
    <li>Does the restaurant allow earlier seating times?</li>
    <li>Is the pace suitable for your child’s routine?</li>
</ul>

<p><strong>Simple rule:</strong> If you have toddlers, early seating matters more than “themed cuisine”.</p>

<p>Related: <a href="/guide/all-inclusive-family-checklist">All-Inclusive for Families: The Non-Negotiables</a></p>


<h2>“Included” vs “extra”: the simple way to avoid surprises</h2>

<p>Instead of trying to guess, use this checklist approach:</p>

<h3>Ask these five questions</h3>
<ul>
    <li>How many à la carte visits are included in our booking?</li>
    <li>Which restaurants count as “included”?</li>
    <li>Do we need a reservation — and how do we book?</li>
    <li>Are there any surcharges per person or for premium items?</li>
    <li>Are drinks included the same way as in the buffet restaurant?</li>
</ul>

<p><strong>Simple rule:</strong> If you have answers to these five, you will not be surprised.</p>

<p>Related: <a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts (What UK Travellers Get Surprised By)</a></p>


<h2>Best practice: how to get the best à la carte experience</h2>

<h3>1) Pick the right night</h3>
<ul>
    <li>Not your arrival night (you’ll be tired)</li>
    <li>Not your last night (risk of “no slots” or schedule stress)</li>
    <li>Choose a night you can keep calm and enjoy</li>
</ul>

<h3>2) Choose the right time</h3>
<ul>
    <li>Earlier seating = easier for families</li>
    <li>Later seating = better for couples who like slow evenings</li>
</ul>

<img src="${IMAGES.atmosphere}" alt="Calm evening atmosphere at à la carte restaurant" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h3>3) Treat it like a highlight, not a default</h3>
<p>If you go in expecting it to be “the main way you’ll eat”, you might be disappointed if bookings are limited.</p>
<p><strong>Simple rule:</strong> Plan 1–2 à la carte nights, and let buffet cover the rest.</p>

<h3>4) Keep your expectations realistic</h3>
<p>À la carte is a holiday experience, not a Michelin competition. You’re paying for atmosphere, service, and variety.</p>


<h2>Copy-paste questions (send these in a message or ask at check-in)</h2>

<ul>
    <li>“How many à la carte visits are included in our stay?”</li>
    <li>“Which restaurants are included vs paid?”</li>
    <li>“How do reservations work — and what time do bookings open?”</li>
    <li>“Are drinks included in à la carte the same as the main restaurant?”</li>
    <li>“Is there a dress code?”</li>
    <li>“Are children welcome, and is there an early seating option?”</li>
    <li>“If there’s a surcharge, is it per person or per table?”</li>
    <li>“What’s the best night to book if we want a calm atmosphere?”</li>
</ul>


<h2>Quick checklist: à la carte in Turkey all-inclusive (save this)</h2>

<ul>
    <li>Confirm “included vs extra” rules ✅</li>
    <li>Book your preferred night on Day 1 ✅</li>
    <li>Pack one smart-casual outfit ✅</li>
    <li>Decide if you want 1–2 highlight dinners or more ✅</li>
    <li>If travelling with kids: check early seating + menu ✅</li>
</ul>

<p><strong>Simple rule:</strong> Reservation + clarity = zero stress.</p>


<h2>FAQ: À la carte restaurants in Turkey all-inclusive</h2>

<h3>Are à la carte restaurants free in Turkey all-inclusive?</h3>
<p>Sometimes, but often with limits. Many resorts include the main buffet daily and offer à la carte as a limited included visit or with a small surcharge. Always check your booking details.</p>

<h3>Do I need to reserve à la carte restaurants?</h3>
<p>Usually yes, especially in peak season and for popular time slots. The safest approach is to ask how reservations work on Day 1 and book early.</p>

<h3>How many times can we use à la carte?</h3>
<p>It depends on the resort and your booking. Some include one visit per stay, some include more for longer stays, and some charge per visit.</p>

<h3>Is the dress code strict?</h3>
<p>Most places are “smart casual” rather than formal. The goal is simply to avoid beachwear. Pack one nice evening outfit and you’re covered.</p>

<h3>Are drinks included at à la carte?</h3>
<p>It depends. Some resorts include the same drinks as the main restaurant, while others have different rules for premium items. Ask specifically to avoid surprises.</p>

<h3>Can families use à la carte restaurants?</h3>
<p>Often yes, but check child policy, menu options, and seating times. For toddlers, an early seating option is usually the most important detail.</p>
`;

async function run() {
    console.log("🚀 Inserting/Updating A La Carte Article...");

    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de A La Carte Restoranlar Nasıl Çalışır? (TR Pasif)" },
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
        console.log("✅ Article Added/Updated Successfully!");
        console.log("👉 Slug:", ARTICLE_DATA.slug);
    }
}

run();
