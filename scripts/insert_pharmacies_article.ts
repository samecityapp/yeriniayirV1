
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLE_DATA = {
    slug: 'pharmacies-in-turkey-for-uk-travellers',
    title: 'Pharmacies in Turkey for UK Travellers: How to Get Common Medicines (Simple, Calm Guide)',
    meta_description: 'Need a pharmacy in Turkey as a UK traveller? This calm, practical guide explains how Turkish pharmacies (eczane) work, typical opening hours, how “on-duty” night pharmacies work, what you can usually buy, when you’ll need a Turkish prescription, and what to save on your phone. Includes checklists, copy-paste phrases, and FAQs.',
    published_at: new Date().toISOString(),
};

// Reused Images from public/images/articles
const IMAGES = {
    cover: '/images/articles/eczane-pharmacy-sign-turkey-street-1767987110935.jpg',
    sign: '/images/articles/eczane-pharmacy-street-sign-turkey-1767991226342.jpg',
    duty_list: '/images/articles/nobetci-eczane-duty-pharmacy-list-on-window-1767987110935.jpg',
    pharmacist: '/images/articles/pharmacist-consultation-friendly-turkey-1767991226342.jpg',
    shelves: '/images/articles/pharmacy-counter-essentials-turkey-1767991226342.jpg',
    emergency: '/images/articles/emergency-number-112-on-phone-screen-1767987110935.jpg'
};

const content = `
<p><strong>Quick answer:</strong> In Turkey, a pharmacy is called an “eczane” (usually marked with a red E sign). Most pharmacies keep standard daytime hours that can vary by province, and outside normal hours there’s a rotating “on-duty” pharmacy system (nöbetçi eczane) so you can still get medicines at night and on Sundays. In an emergency, call 112.</p>

<p>This guide is written for UK travellers and focuses on calm, practical steps — no panic, no scare stories.</p>

<h2>1) What UK travellers should know about Turkish pharmacies (the basics)</h2>

<p>Turkey’s pharmacy experience is generally straightforward:</p>
<ul>
<li>Pharmacies are professional, regulated settings (not a general convenience store).</li>
<li>Many pharmacists are used to helping visitors, especially in tourist areas and big cities.</li>
<li>You can often get help with common issues (cold symptoms, allergies, sun care, stomach upsets) — but some medicines are prescription-only under Turkish rules.</li>
<li>A UK prescription isn’t accepted as a prescription in Turkish pharmacies; if a medicine needs a prescription in Turkey, you’ll need a Turkish prescription.</li>
</ul>

<p><strong>Simple rule:</strong> Treat the pharmacy as your first “calm help point” for non-urgent issues — and treat 112 as the emergency route.</p>

<p>Internal guide if you want it later:
<a href="/guide/emergency-numbers-pharmacies-getting-help-turkey-guide">Emergency Numbers & Getting Help in Turkey</a>
<a href="/guide/travel-insurance-turkey-uk-guide">Travel Insurance for Turkey from the UK</a></p>

<h2>2) Recognising a pharmacy: “Eczane” and the red “E”</h2>

<p>In most places you’ll spot a pharmacy quickly:</p>
<ul>
<li>“Eczane” on the sign</li>
<li>Red E symbol</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you’re searching on your phone, try keywords like:</p>
<ul>
<li>“eczane near me”</li>
<li>“nöbetçi eczane” + your district (for night/Sunday)</li>
</ul>

<img src="${IMAGES.sign}" alt="Eczane pharmacy street sign" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>3) Opening hours: what to expect (and why it varies)</h2>

<p>Pharmacy hours can differ by city and province. As a practical reference, Istanbul’s pharmacists’ chamber has published pharmacy working hours as 09:00–19:00 (weekday and Saturday in that notice).</p>

<p><strong>Common travel reality:</strong></p>
<ul>
<li>Many pharmacies are open during the day</li>
<li>On Sundays and late evenings, most standard pharmacies are closed except on-duty pharmacies</li>
</ul>

<p><strong>Simple rule:</strong> After hours, don’t hunt randomly — search for the on-duty pharmacy.</p>

<h2>4) The on-duty system: “Nöbetçi Eczane” (how night/Sunday access works)</h2>

<p>Turkey uses a rotating duty system so there is always at least one open pharmacy for each area at night and on Sundays.</p>

<p><strong>How it works in practice:</strong></p>
<ul>
<li>Your nearest closed pharmacy often posts the address of the on-duty pharmacy.</li>
<li>You can also find on-duty lists online via local pharmacists’ chambers.</li>
</ul>

<p>Example (official local chamber): Istanbul Eczacı Odası provides an up-to-date “Nöbetçi Eczaneler” page for Istanbul/Yalova. They also describe their on-duty pharmacy app and how it helps you find the nearest option.</p>

<p><strong>UK-friendly tip:</strong> If you’re in Istanbul and it’s late, use the chamber list first. It saves time and keeps things calm.</p>

<img src="${IMAGES.duty_list}" alt="List of on-duty pharmacies on window" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>5) What you can usually get at a pharmacy (tourist-friendly overview)</h2>

<p>This section is intentionally general — because specific medicines vary by brand and local regulation.</p>

<p><strong>Often handled well at pharmacies:</strong></p>
<ul>
<li>Basic symptom relief products (colds, cough, sore throat comfort)</li>
<li>Allergy support products</li>
<li>Sunburn support and skin comfort products</li>
<li>Rehydration / electrolyte support products</li>
<li>Simple first-aid items (plasters, antiseptic basics)</li>
</ul>

<p><strong>What often requires extra steps:</strong></p>
<ul>
<li>Medicines that are prescription-only in Turkey (you’ll need a Turkish prescription)</li>
<li>Anything classed as “strong” or controlled</li>
</ul>

<p><strong>Important:</strong> The UK Foreign Office notes that legal status and regulation of medicines can differ between the UK and other countries, and that British prescriptions are not accepted in Turkey.</p>

<p><strong>Simple rule:</strong> If it’s “strong” in the UK, assume it might require a Turkish prescription and ask calmly.</p>

<img src="${IMAGES.shelves}" alt="Pharmacy shelves with essentials" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>6) Antibiotics and prescriptions: don’t assume</h2>

<p>A key example: antibiotics are regulated and are not generally sold as over-the-counter items in Turkey; pharmacies are not allowed to dispense them without a doctor’s prescription.</p>

<p><strong>UK-friendly tip:</strong> If you think you need something prescription-based, skip the guessing and ask the pharmacy:
“Does this require a prescription here?”
If yes, ask:
“What’s the simplest way to get a Turkish prescription?”</p>

<h2>7) If you brought medication from the UK: how to travel smarter</h2>

<p>If you take regular medication, travel-health guidance commonly recommends carrying evidence it’s prescribed to you, such as a copy of your prescription and/or a doctor’s letter.</p>

<p>A Turkish consulate info note also advises travellers to carry a medical report/prescription detailing purpose and dosage when travelling with medications.</p>

<p><strong>Simple rule:</strong> Keep medicines in original packaging + keep proof (digital + paper if possible). It reduces stress.</p>

<h2>8) The easiest “how-to” when you feel unwell (calm, practical steps)</h2>

<h3>Step 1: Decide if it’s urgent</h3>
<ul>
<li>If it’s an emergency or you need urgent help: <strong>call 112</strong>.</li>
<li>If it’s non-urgent and you need advice/products: go to an eczane.</li>
</ul>

<h3>Step 2: If it’s after hours</h3>
<p>Search for:
“nöbetçi eczane” + your area/district
Or use local chamber lists (example: Istanbul).</p>

<h3>Step 3: Bring the right info (this makes it fast)</h3>
<ul>
<li>A short note of symptoms (1–2 lines)</li>
<li>Allergies</li>
<li>Current medications (photo of labels helps)</li>
<li>If relevant: your insurance details (not always needed for a pharmacy purchase, but useful overall)</li>
</ul>

<p><strong>UK-friendly tip:</strong> The pharmacist can help best when you describe the problem, not when you insist on a specific brand.</p>

<img src="${IMAGES.pharmacist}" alt="Pharmacist consulting with a customer" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>9) How to communicate at the pharmacy (without perfect Turkish)</h2>

<p>You can do this in simple English. Keep it short and practical.</p>

<p><strong>Copy-paste phrases (save in Notes)</strong></p>
<ul>
<li>“Hello — I’m visiting from the UK. Could you help me?”</li>
<li>“I have these symptoms: ______.”</li>
<li>“Do I need a prescription for this in Turkey?”</li>
<li>“Is there a non-prescription option for symptom relief?”</li>
<li>“I’m allergic to ______.”</li>
<li>“Can you write down the name of the product and how to use it?”</li>
<li>“Do you have an English leaflet / instructions?”</li>
</ul>

<p><strong>Simple rule:</strong> Ask them to write it down. That prevents misunderstandings.</p>

<h2>10) Paying, receipts, and insurance (keep it organised)</h2>

<p>Most travellers just want a smooth purchase:</p>
<ul>
<li>Pay normally (card or cash depending on the location)</li>
<li>Ask for a receipt if you’re keeping records or may claim later</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you think you may claim something through insurance, keep:
- the receipt
- a short note of what it was for
- any medical documentation if you had a clinic visit</p>

<p>Related: <a href="/guide/travel-insurance-turkey-uk-guide">Travel Insurance for Turkey from the UK: What to Check</a></p>

<h2>11) Where pharmacies help the most: the “holiday disruptors”</h2>

<p>These are the issues that most commonly ruin a day — and where quick pharmacy support can help you get back to enjoying Turkey:</p>
<ul>
<li>Sun overexposure and skin discomfort</li>
<li>Mild stomach upset from heat, schedule changes, or new foods</li>
<li>Seasonal allergies</li>
<li>Blisters from walking more than you do at home</li>
<li>Simple colds from air-con changes</li>
</ul>

<p><strong>Simple rule:</strong> Fix the small problem early so it doesn’t become a two-day problem.</p>

<h2>12) Your “Pharmacy Plan” for day 1 (this makes you feel confident)</h2>

<p>Before you travel (or on arrival), do this once:</p>
<ul>
<li>Save your accommodation address as text + screenshot</li>
<li>Save: “112 — Turkey Emergency”</li>
<li>Learn the two key words: eczane (pharmacy) and nöbetçi eczane (on-duty pharmacy)</li>
<li>If you’re in a big city, bookmark a local on-duty pharmacy list (example: Istanbul)</li>
<li>Put a small “medical note” in your phone (allergies, meds, conditions)</li>
</ul>

<p><strong>UK-friendly tip:</strong> This is a 5-minute job that makes your whole trip feel calmer.</p>

<img src="${IMAGES.emergency}" alt="Emergency 112 number on phone screen" class="w-full h-auto rounded-lg my-6 shadow-md" />

<h2>13) Common mistakes UK travellers make (and the easy fixes)</h2>

<p><strong>Mistake 1:</strong> Waiting until Sunday night to figure it out
<br><strong>Fix:</strong> know the “nöbetçi eczane” concept early.</p>

<p><strong>Mistake 2:</strong> Bringing a UK prescription and assuming it works
<br><strong>Fix:</strong> UK prescriptions aren’t accepted as prescriptions in Turkish pharmacies.</p>

<p><strong>Mistake 3:</strong> Asking for “antibiotics” directly
<br><strong>Fix:</strong> antibiotics need a prescription; ask the pharmacist what’s possible without one, and what the next step is if you need a doctor.</p>

<p><strong>Mistake 4:</strong> Not keeping proof for regular medicines
<br><strong>Fix:</strong> keep packaging + prescription/doctor letter (digital copy is fine).</p>

<h2>14) Copy-paste questions to ask a pharmacist (fast clarity)</h2>

<ul>
<li>“Is this prescription-only in Turkey?”</li>
<li>“What is the simplest option for relief without a prescription?”</li>
<li>“If I do need a prescription, what is the quickest way to get one locally?”</li>
<li>“Can you write down the product name and directions in English?”</li>
<li>“Are there any interactions with my current medication?” (show label/photo)</li>
<li>“Is there a milder option if I’m sensitive to strong medicines?”</li>
</ul>

<p><strong>Simple rule:</strong> The goal is clarity, not speed.</p>

<h2>FAQ: Pharmacies in Turkey for UK travellers</h2>

<h3>What is a pharmacy called in Turkey?</h3>
<p>A pharmacy is called an eczane. After hours, look for a nöbetçi eczane (on-duty pharmacy).</p>

<h3>Are pharmacies open on Sundays in Turkey?</h3>
<p>Most standard pharmacies close on Sundays, but the on-duty system means certain pharmacies remain open. The easiest method is to search for “nöbetçi eczane” or use a local chamber list (for example, Istanbul’s chamber list).</p>

<h3>What are typical opening hours?</h3>
<p>Hours vary by province, but as a practical reference, Istanbul’s pharmacists’ chamber has published pharmacy hours as 09:00–19:00 in the cited notice.</p>

<h3>Can I use my UK prescription in a Turkish pharmacy?</h3>
<p>The UK Foreign Office states that British prescriptions are not accepted in pharmacies in Turkey. If a medicine needs a prescription in Turkey, you’ll need a Turkish prescription for an equivalent medicine.</p>

<h3>Can I buy antibiotics over the counter in Turkey?</h3>
<p>No — pharmacies are not allowed to dispense antibiotics without a doctor’s prescription in Turkey.</p>

<h3>What should I do in an emergency?</h3>
<p>Call 112 for emergency services in Turkey.</p>

<h3>What should I carry if I travel with regular medication?</h3>
<p>Travel health guidance commonly recommends carrying proof your medicine is prescribed to you (prescription copy and/or a doctor letter), and keeping medicines in original packaging.</p>
`;

async function run() {
    console.log("🚀 Inserting Pharmacies Article...");

    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Eczaneler ve İlaç Temini (TR Pasif)" },
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
        console.log("✅ Pharmacies Article Added Successfully!");
        console.log("👉 Slug:", ARTICLE_DATA.slug);
    }
}

run();
