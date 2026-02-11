
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLE_DATA = {
    slug: 'travel-insurance-turkey-uk-guide',
    title: 'Travel Insurance for Turkey from the UK: What to Check (Medical, Activities, All-Inclusive)',
    meta_description: 'Heading to Turkey from the UK? This calm, practical guide shows what to check in your travel insurance before you go: emergency medical cover, repatriation, cancellations, baggage, activities, all-inclusive “extras”, and how to keep claims smooth. Includes checklists, copy-paste questions, and FAQs.',
    published_at: new Date().toISOString(),
};

// Reused Images
const IMAGES = {
    cover: '/images/articles/travel-insurance-policy-passport-authentic-1767989062717.jpg',
    medical: '/images/articles/modern-hospital-sign-turkey-authentic-1767989062717.jpg',
    baggage: '/images/articles/airport-luggage-stack-family-travel-1767986408887.jpg',
    activities: '/images/articles/water-sports-rental-beach-turkey-1767986132245.jpg',
    emergency: '/images/articles/smartphone-screen-112-saved-authentic-1767986898725.jpg',
    checklist: '/images/articles/travel-checklist-notebook-authentic-1767985612952.jpg'
};

const content = `
<p><strong>Quick answer:</strong> For a Turkey trip, the “right” insurance is the policy that covers emergency medical treatment, medical evacuation/repatriation, cancellations, and the activities you’ll actually do — with clear instructions on what to do if something happens. The UK government’s advice is simple: buy appropriate travel insurance before you go, especially if you have health conditions or could need medical help abroad.</p>

<p>This is a calm, practical guide for UK travellers — no fear, just clarity. (Not legal advice.)</p>

<h2>1) Start with one reality: Turkey is outside GHIC/EHIC coverage</h2>

<p>A UK GHIC/EHIC is designed for necessary state healthcare in the EEA and a limited set of covered countries — Turkey is not listed in the standard eligibility list.</p>

<p><strong>Simple rule:</strong> Don’t rely on GHIC/EHIC for Turkey. Treat travel insurance as your main safety net.</p>

<p><strong>UK-friendly tip:</strong> If you already have a GHIC, still take it for EU trips — but for Turkey, focus on insurance policy wording.</p>

<img src="${IMAGES.cover}" alt="Travel insurance policy document next to passport" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>2) The non-negotiables: the 5 cover areas most UK travellers actually need</h2>

<p>Before comparing prices, check whether your policy covers these properly:</p>

<h3>A) Emergency medical treatment</h3>
<p>The UK government explicitly recommends having appropriate travel insurance for local treatment or unexpected medical evacuation.</p>

<p>What to look for (in plain English):</p>
<ul>
<li>Emergency medical expenses (not planned treatment)</li>
<li>Hospital admission and outpatient care</li>
<li>Prescription/medicine costs (where included)</li>
<li>Excess amount (what you pay first)</li>
</ul>

<p><strong>Simple rule:</strong> If medical cover is vague, it’s not the right policy.</p>

<img src="${IMAGES.medical}" alt="Modern hospital sign in Turkey" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h3>B) Medical evacuation and repatriation</h3>
<p>This is the “big one” that people forget to check. FCDO guidance stresses having insurance for unexpected medical evacuation.</p>

<p>Look for wording like:</p>
<ul>
<li>“medical evacuation”</li>
<li>“repatriation”</li>
<li>“air ambulance / medically escorted return”</li>
<li>“return of dependants” (helpful for families)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Repatriation cover is the difference between “stressful admin” and “handled properly”.</p>

<h3>C) Cancellation and curtailment</h3>
<p>Covers you if you can’t travel or need to cut the trip short for a covered reason.</p>

<p>Check:</p>
<ul>
<li>Your cancellation limit is realistic for your trip cost</li>
<li>What reasons are covered (and what proof they require)</li>
</ul>

<h3>D) Baggage, valuables, and gadgets</h3>
<p>Most claims problems come from assumptions.</p>

<p>Check:</p>
<ul>
<li>Single item limits (phones/cameras often have caps)</li>
<li>Unattended items rules (very common exclusions)</li>
<li>Whether you need proof of ownership/receipts</li>
</ul>

<p><strong>Simple rule:</strong> If you’d be upset to lose it, don’t leave it unattended — and know your single-item limit.</p>

<img src="${IMAGES.baggage}" alt="Luggage stacked at airport" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h3>E) Personal liability</h3>
<p>Often included, rarely used — but good to have.</p>

<h2>3) If you’re going all-inclusive: what insurance should still cover</h2>

<p>All-inclusive reduces daily spending, but it doesn’t remove travel risks. Insurance still matters for:</p>
<ul>
<li>medical issues</li>
<li>cancellations</li>
<li>delayed travel</li>
<li>lost baggage / stolen phone</li>
<li>activity-related incidents (pool, fitness classes, excursions)</li>
</ul>

<p><strong>UK-friendly tip:</strong> All-inclusive can make claims simpler because your trip is more self-contained — but you still need the correct cover.</p>

<p>Related: <a href="/guide/hidden-costs-turkey-resorts">Hidden Costs in Turkey Resorts (What UK Travellers Get Surprised By)</a></p>

<h2>4) Activities: the fastest way to accidentally be uninsured</h2>

<p>A policy can look perfect until you do something it classifies as a higher-risk activity.</p>

<p>Common holiday activities to sanity-check</p>
<ul>
<li>boat trips</li>
<li>water sports (even “casual” ones)</li>
<li>quad biking / ATV</li>
<li>scuba/snorkelling (varies by policy)</li>
<li>hiking (especially if it’s remote or high altitude)</li>
<li>gym/fitness classes (usually fine, but check definitions)</li>
</ul>

<p><strong>Simple rule:</strong> If you’ll do it on holiday, search your policy PDF for it.</p>

<p><strong>UK-friendly tip:</strong> If you’re unsure, call the insurer and ask them to confirm in writing or point you to the policy wording.</p>

<img src="${IMAGES.activities}" alt="Water sports rental station on beach" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>5) Pre-existing medical conditions: do this properly (it’s worth it)</h2>

<p>The UK government guidance on foreign travel insurance emphasises buying appropriate insurance that covers existing physical or mental health conditions (including those under investigation).</p>

<p>What “properly” means:</p>
<ul>
<li>Declare conditions honestly</li>
<li>Answer screening questions accurately</li>
<li>Keep confirmation of what’s covered</li>
<li>Understand any exclusions</li>
</ul>

<p><strong>Simple rule:</strong> If it’s not declared (when required), it can be excluded.</p>

<h2>6) The “what to do if you need help” section (this matters more than the price)</h2>

<p>Good insurance isn’t just cover — it’s a clear process.</p>

<p>Before you fly, find these 3 things in your policy:</p>
<ul>
<li>Emergency assistance phone number (24/7)</li>
<li>How to notify them if you go to hospital</li>
<li>What evidence they need for claims (receipts, police reports, medical reports)</li>
</ul>

<p>FCDO also has guidance on what to do if you’re hospitalised abroad.</p>

<p><strong>Simple rule:</strong> Save your insurer’s emergency number like you save your boarding pass.</p>

<img src="${IMAGES.emergency}" alt="Smartphone screen showing saved emergency number" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>7) Documents to keep (this makes claims smooth)</h2>

<p>Put these in a folder (cloud + offline screenshot):</p>
<ul>
<li>Policy number + emergency line</li>
<li>Proof of travel (booking confirmation)</li>
<li>Receipts for major items (phone, camera)</li>
<li>Any pre-existing condition acceptance documents</li>
<li>A note of your emergency contacts</li>
</ul>

<p><strong>UK-friendly tip:</strong> Screenshots win when you have no signal.</p>

<h2>8) Families: the UK parent insurance checklist</h2>

<p>Families usually need the same cover areas, but the process matters more.</p>

<p>Check:</p>
<ul>
<li>Each child is named/covered</li>
<li>Cover includes medical treatment + repatriation for the whole family</li>
<li>“Returning children” or “accompanying adult” wording (if one person is ill)</li>
<li>Any activities your family will do (boat trips, water parks, etc.)</li>
</ul>

<p>Related: <a href="/guide/all-inclusive-family-checklist">All-Inclusive for Families: The Non-Negotiables</a></p>

<p><strong>Simple rule:</strong> For families, choose the policy with the clearest emergency process, not the cheapest headline.</p>

<h2>9) Couples and adults-only trips: what matters most</h2>

<p>For couples, the biggest “value” is:</p>
<ul>
<li>medical + repatriation clarity</li>
<li>cancellation cover that matches trip cost</li>
<li>gadget limits that match what you’re carrying</li>
</ul>

<p>Related: <a href="/guide/adults-only-all-inclusive-turkey-guide">Adults-Only All-Inclusive: How to Choose</a></p>

<h2>10) Solo travellers: keep it simple and documented</h2>

<p>Solo travellers benefit from:</p>
<ul>
<li>easy access to emergency assistance</li>
<li>clear medical process</li>
<li>good gadget cover if you rely on your phone for everything</li>
</ul>

<p><strong>Simple rule:</strong> Solo travel insurance should reduce admin, not create it.</p>

<h2>11) Copy-paste questions to ask any insurer (UK travellers)</h2>

<p>Use these questions to get clarity fast:</p>
<ul>
<li>“Does this policy cover emergency medical treatment in Turkey, including hospital admission?”</li>
<li>“Does it include medical evacuation and repatriation to the UK if needed?”</li>
<li>“Are pre-existing conditions covered if declared and accepted?”</li>
<li>“What’s the excess for medical claims and for baggage claims?”</li>
<li>“What’s the single-item limit for phones/cameras?”</li>
<li>“If I go to hospital, what’s the exact process—who do I call first?”</li>
<li>“Are boat trips / water sports / quad biking covered (if we do them)?”</li>
<li>“What evidence do you require for theft or loss?”</li>
</ul>

<p><strong>Simple rule:</strong> If they can answer these clearly, you’re in good hands.</p>

<h2>12) The “Turkey Travel Insurance” quick checklist (save this)</h2>

<p>Tick these before you buy:</p>

<h3>Core cover</h3>
<ul>
<li>Emergency medical expenses ✅</li>
<li>Medical evacuation / repatriation ✅</li>
<li>Cancellation / curtailment ✅</li>
<li>Baggage + gadget limits make sense ✅</li>
<li>Personal liability ✅</li>
</ul>

<h3>Your personal situation</h3>
<ul>
<li>Pre-existing conditions declared and accepted ✅</li>
<li>Activities you’ll do are covered ✅</li>
<li>Excess amounts are acceptable ✅</li>
</ul>

<h3>Practical</h3>
<ul>
<li>24/7 emergency number saved ✅</li>
<li>Claim evidence requirements understood ✅</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you can tick these calmly, your holiday will feel more relaxed.</p>

<img src="${IMAGES.checklist}" alt="Travel checklist notebook" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>FAQ: Travel insurance for Turkey from the UK</h2>

<h3>Do I really need travel insurance for Turkey?</h3>
<p>The UK government advises buying appropriate travel insurance before travelling abroad, and specifically highlights this for Turkey health planning.</p>

<h3>Does GHIC/EHIC cover Turkey?</h3>
<p>A UK GHIC/EHIC is designed for the EEA and certain covered countries listed by NHS/NHSBSA sources — Turkey isn’t part of the standard coverage list.</p>

<h3>What’s the most important cover feature for Turkey?</h3>
<p>Emergency medical cover plus medical evacuation/repatriation wording you understand. That’s the part that protects you if something serious happens.</p>

<h3>Should I tell the insurer about pre-existing conditions?</h3>
<p>Yes. UK government guidance on foreign travel insurance stresses getting appropriate cover for existing conditions (including those under investigation).</p>

<h3>Are all holiday activities automatically covered?</h3>
<p>Not always. Many policies have activity categories and exclusions. The best approach is to check the policy wording for anything you plan to do.</p>

<h3>What should I do if I’m hospitalised abroad?</h3>
<p>Follow your insurer’s instructions and keep documentation. The UK government provides guidance on steps and help available if you’re hospitalised abroad.</p>
`;

async function run() {
    console.log("🚀 Inserting Travel Insurance Article...");

    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye Seyahat Sigortası Rehberi (TR Pasif)" },
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
        console.log("✅ Travel Insurance Article Added Successfully!");
        console.log("👉 Slug:", ARTICLE_DATA.slug);
    }
}

run();
