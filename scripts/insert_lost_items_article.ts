
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
        console.warn("⚠️ 'google-credentials.json' missing. Skipping generation.");
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
    slug: 'lost-passport-phone-wallet-turkey-uk-traveller-guide',
    title: 'Losing Your Passport, Phone or Wallet in Turkey: A Calm UK Step-by-Step Plan (No Panic Guide)',
    meta_description: 'Lost your passport, phone, or wallet in Turkey? Don’t panic. This UK-friendly guide gives a calm step-by-step plan: what to do in the first 15 minutes, how to lock cards/phones, how to get replacement travel documents, what evidence to collect, and how to keep your trip smooth. Includes checklists, copy-paste scripts, and FAQs.',
    published_at: new Date().toISOString(),
};

// Internal Link Mappings
const INTERNAL_LINKS = {
    '[INTERNAL_LINK:travel-insurance-turkey-uk-what-to-check]': '/guide/travel-insurance-turkey-uk-guide',
    '[INTERNAL_LINK:emergency-numbers-turkey-uk]': '/guide/emergency-numbers-pharmacies-getting-help-turkey-guide',
    // Fallback if user uses slightly different link text or we want to be robust
    '[INTERNAL_LINK:travel-insurance-turkey-uk]': '/guide/travel-insurance-turkey-uk-guide'
};

const rawContent = `
<p><strong>Quick answer:</strong> If you lose something important in Turkey, the fastest way to stay calm is to follow a simple order: (1) secure your money and accounts, (2) confirm whether it’s genuinely lost or just misplaced, (3) get the right “paper trail” for insurance and replacement documents, and (4) keep your holiday moving with a temporary plan. Most situations are fixable within the same day or the next day if you act quickly and methodically.</p>

<p>This guide is designed for UK travellers. It’s practical, reassuring, and not fear-based.</p>

<h2>The first 15 minutes: do this before you do anything else</h2>

<p>When something goes missing, stress makes people jump to the wrong steps (like rushing around without securing cards).</p>

<h3>Step 1 — Stop, breathe, and do a “real check”</h3>

<p>Do a calm 2-minute scan:</p>
<ul>
<li>bag compartments (including hidden pockets)</li>
<li>jacket pockets</li>
<li>bathroom / bedside table / safe</li>
<li>suitcase front pocket</li>
<li>the place you last paid or showed your phone</li>
</ul>

<p><strong>Simple rule:</strong> Don’t assume theft. Most “lost” items are misplaced during a rushed moment.</p>

<!-- IMAGE_1_CHECKING_BAG -->

<h3>Step 2 — Secure money first (wallet/phone)</h3>

<p>If your wallet or phone is missing, protect your finances immediately:</p>
<ul>
<li>lock/freeze cards in your banking app if you can</li>
<li>contact your bank if you can’t access the app</li>
<li>change passwords for key accounts if needed (email first, then banking)</li>
</ul>

<p><strong>UK-friendly tip:</strong> A lost wallet is annoying. A drained account is a trip-killer. Secure money first.</p>

<h3>Step 3 — Tell your accommodation (they’re your local support team)</h3>

<p>Say: “We’ve lost a passport/phone/wallet — what’s the simplest next step locally?”
They can often help with:</p>
<ul>
<li>checking CCTV in common areas</li>
<li>calling taxis/restaurants on your behalf</li>
<li>guiding you to the right local office or police station if needed</li>
<li>printing confirmations or helping with translations</li>
</ul>

<p><strong>Simple rule:</strong> Don’t DIY the local system when a staffed place can guide you quickly.</p>

<!-- IMAGE_2_ACCOMMODATION_HELP -->

<h2>Scenario A: You lost your phone (the most common modern problem)</h2>

<p>A lost phone feels huge because it holds your maps, tickets, banking, and contacts. But you can stabilise the situation quickly.</p>

<h3>Step-by-step: phone missing</h3>
<ul>
<li>Call it (or use “Find my” from another device)</li>
<li>Check last known location (if enabled)</li>
<li>Lock the phone / enable lost mode</li>
<li>Lock banking apps / cards (if you haven’t already)</li>
<li>Secure your email account (because email resets everything)</li>
<li>Get a temporary connectivity plan (SIM/eSIM on a spare phone if available)</li>
</ul>

<p><strong>Simple rule:</strong> Email security first. Banking security second. Everything else after.</p>

<h3>If you’re travelling as a couple/family</h3>

<p>Agree roles:</p>
<ul>
<li>one person handles the “account security” steps</li>
<li>the other handles the “physical search” and speaking to staff</li>
</ul>

<p><strong>UK-friendly tip:</strong> Split tasks. Two people doing the same thing wastes time.</p>

<h3>What evidence to collect for insurance</h3>
<ul>
<li>a brief note of time/place when you noticed it missing</li>
<li>any receipts for the phone (if you have them)</li>
<li>any report number if you file a police report (when required by your policy)</li>
</ul>

<p><strong>Simple rule:</strong> Insurance likes timelines and proof. Keep it simple and written down.</p>

<p>Related internal:
<a href="[INTERNAL_LINK:travel-insurance-turkey-uk-what-to-check]">Travel Insurance for Turkey from the UK: What to Check</a></p>

<!-- IMAGE_3_PHONE_SECURITY -->

<h2>Scenario B: You lost your wallet (cards, cash, ID)</h2>

<p>Your wallet is usually a mix of:</p>
<ul>
<li>bank cards</li>
<li>cash</li>
<li>driving licence (sometimes)</li>
<li>sometimes your passport (try not to carry it daily)</li>
</ul>

<h3>Step-by-step: wallet missing</h3>
<ul>
<li>Freeze cards immediately</li>
<li>Check if you have backup payment (second card kept separately, Apple Pay/Google Pay, cash in luggage)</li>
<li>Ask last venue (restaurants/taxis/shops — many “lost wallets” are returned quickly)</li>
<li>Decide if you need a police report (often required for insurance claims)</li>
</ul>

<p><strong>Simple rule:</strong> You don’t need your wallet to enjoy Turkey — you need a payment plan.</p>

<h3>The best “backup payment” strategy (UK-friendly)</h3>
<ul>
<li>one primary card in your daily wallet</li>
<li>one backup card stored separately in your accommodation</li>
<li>a small cash reserve stored separately</li>
<li>digital wallet enabled if you use it</li>
</ul>

<p><strong>UK-friendly tip:</strong> Separation is the whole trick. One mistake shouldn’t take down your whole trip.</p>

<!-- IMAGE_4_WALLET_BACKUP -->

<h2>Scenario C: You lost your passport (or it was stolen)</h2>

<p>This feels like the biggest one, but it’s manageable.</p>

<h3>First: confirm it’s truly lost</h3>
<p>Many passports are simply:</p>
<ul>
<li>left in the room safe</li>
<li>left in a suitcase pocket</li>
<li>handed to reception and then returned later</li>
</ul>

<p>Do a calm check:</p>
<ul>
<li>safe + its instructions (sometimes people forget they used it)</li>
<li>inside luggage pockets</li>
<li>between book covers / document wallets</li>
<li>ask reception if anything was handed in</li>
</ul>

<p><strong>Simple rule:</strong> Don’t start the replacement process until you’ve done a full, calm check.</p>

<h3>If it’s genuinely lost: your priorities</h3>
<ul>
<li>Secure your identity documents (keep photos/copies ready)</li>
<li>Create a clean timeline (when you last saw it, where you stayed, where you went)</li>
<li>Get the correct support route for replacement travel documents</li>
<li>Keep your trip moving (you can still enjoy your days while admin is happening)</li>
</ul>

<p><strong>UK-friendly tip:</strong> This becomes much easier if you already have a photo of your passport ID page saved securely.</p>

<!-- IMAGE_5_PASSPORT_CHECK -->

<h2>The “paper trail” rule: when you need reports and receipts</h2>
<p>Most travellers don’t want admin — but a little admin prevents a lot of hassle later.</p>

<h3>When you might need a police report</h3>
<p>Common reasons:</p>
<ul>
<li>your insurer requires it for theft/loss claims</li>
<li>you need formal documentation for replacement steps</li>
<li>you lost multiple important items and need a reference number</li>
</ul>

<p><strong>Simple rule:</strong> If you think you’ll claim, get the paper trail early.</p>

<h3>What to keep (minimum set)</h3>
<ul>
<li>a written note of what happened (time/place)</li>
<li>list of missing items</li>
<li>any reference number you’re given</li>
<li>receipts (if you have them)</li>
<li>photos/screenshots of booking confirmations</li>
</ul>

<h2>How to avoid “double loss” (the mistake that makes everything worse)</h2>
<p>When people panic, they often lose the second essential item while searching for the first.</p>

<h3>The prevention routine</h3>
<ul>
<li>Put your remaining essentials in one secure place (bag or room safe)</li>
<li>Do not carry every card/cash item while searching</li>
<li>Keep your phone (if you still have it) secure while retracing steps</li>
</ul>

<p><strong>Simple rule:</strong> Pause the chaos. Protect what you still have.</p>

<h2>Your Turkey “lost item” decision tree (fast)</h2>
<p>Use this as your quick guide:</p>

<p><strong>If it’s a phone</strong></p>
<ul>
<li>lock it + secure email + secure banking</li>
<li>then search and report if needed</li>
</ul>

<p><strong>If it’s a wallet</strong></p>
<ul>
<li>freeze cards</li>
<li>switch to backup payment</li>
<li>then search and report if needed</li>
</ul>

<p><strong>If it’s a passport</strong></p>
<ul>
<li>do a full check</li>
<li>then start replacement route + get any required documentation</li>
</ul>

<p><strong>Simple rule:</strong> Security first, admin second, holiday third — in that order.</p>

<h2>What your accommodation can do (use them properly)</h2>
<p>Here are the exact kinds of help you can ask for:</p>
<ul>
<li>“Can you call the taxi company/restaurant for us?”</li>
<li>“Can you confirm the address in Turkish for a report?”</li>
<li>“Can you print our booking confirmation?”</li>
<li>“Is there a local lost property office we should contact?”</li>
<li>“Can you help us get to the correct place quickly?”</li>
</ul>

<p><strong>UK-friendly tip:</strong> Ask for practical actions, not general advice.</p>

<h2>Copy-paste scripts (use these messages)</h2>

<p><strong>Script 1 — To a restaurant/shop</strong></p>
<p>“Hi, I visited today around [TIME]. I think I may have left my [PHONE/WALLET/PASSPORT]. Could you please check lost property? Description: [COLOUR/CASE/BRAND]. My contact: [NUMBER/EMAIL].”</p>

<p><strong>Script 2 — To your accommodation</strong></p>
<p>“Hi, we’ve lost a [PHONE/WALLET/PASSPORT]. Could you help us with the simplest next step locally? We last saw it around [TIME] and we visited [PLACES].”</p>

<p><strong>Script 3 — For your own notes (insurance)</strong></p>
<p>“Date/time noticed missing: ___<br>
Last known location: ___<br>
Places visited after: ___<br>
Actions taken: cards frozen / phone locked / venue contacted<br>
Reference number (if any): ___”</p>

<h2>The “calm kit” you should prepare before you ever travel (takes 5 minutes)</h2>
<p>If you do this once, you prevent 80% of panic.</p>

<p>Save in your phone (and screenshot offline):</p>
<ul>
<li>passport photo page (securely stored)</li>
<li>insurance policy number + emergency line</li>
<li>accommodation address (text + screenshot)</li>
<li>a second contact method (partner’s email/number)</li>
<li>your bank emergency contact route (or at least the name of your bank’s travel help)</li>
</ul>

<p>Related internal:
<a href="[INTERNAL_LINK:emergency-numbers-turkey-uk]">Emergency Numbers & Getting Help in Turkey</a>
<a href="[INTERNAL_LINK:travel-insurance-turkey-uk-what-to-check]">Travel Insurance for Turkey from the UK</a></p>

<p><strong>Simple rule:</strong> Preparation isn’t paranoia. It’s comfort.</p>

<!-- IMAGE_6_CALM_KIT -->

<h2>How to keep enjoying Turkey while you fix the admin</h2>
<p>People often “lose the holiday” mentally when something goes missing. You don’t have to.</p>

<h3>The realistic plan</h3>
<ul>
<li>Do the security steps immediately</li>
<li>Do one clean admin block (1–2 hours)</li>
<li>Then go back to your day, and handle remaining steps the next morning</li>
</ul>

<p><strong>UK-friendly tip:</strong> Turkey is at its best when you’re relaxed. Don’t let one admin problem steal your evenings.</p>

<h2>The UK “Lost Passport/Phone/Wallet” checklist (save this)</h2>

<h3>First 15 minutes</h3>
<ul>
<li>full calm check ✅</li>
<li>freeze cards if wallet missing ✅</li>
<li>lock phone / secure email if phone missing ✅</li>
<li>tell accommodation ✅</li>
</ul>

<h3>Same day</h3>
<ul>
<li>contact last venues ✅</li>
<li>create a simple timeline ✅</li>
<li>gather receipts / photos / proof ✅</li>
<li>decide if police report is needed ✅</li>
</ul>

<h3>Next day (if unresolved)</h3>
<ul>
<li>follow replacement route for documents ✅</li>
<li>keep copies of all reference numbers ✅</li>
<li>continue trip with backup payment/ID plan ✅</li>
</ul>

<p><strong>Simple rule:</strong> Order beats panic.</p>

<h2>FAQ: Losing your passport, phone or wallet in Turkey (UK travellers)</h2>

<h3>What should I do first if I lose my wallet in Turkey?</h3>
<p>Freeze your cards immediately, then switch to your backup payment method (second card kept separately or digital wallet). After that, contact places you visited and decide if you need a report for insurance.</p>

<h3>What should I do first if I lose my phone?</h3>
<p>Lock the phone, secure your email account, and then secure banking access. Once your accounts are safe, focus on retrieving the phone via last-location tools and venue checks.</p>

<h3>If I lose my passport, do I need to cancel the whole trip?</h3>
<p>Not automatically. First confirm it’s truly lost. If it is, start the replacement process and gather the documentation you need — but you can often still enjoy your days while you handle admin in short blocks.</p>

<h3>Do I always need a police report?</h3>
<p>Not always, but many insurance policies require some form of report for theft/loss claims. If you expect to claim, it’s usually best to get the documentation early.</p>

<h3>How can I prevent this happening?</h3>
<p>Use separation: keep a backup card and small cash reserve separate from your daily wallet, keep your passport stored safely (not carried daily unless needed), and save digital copies securely before travel.</p>

<h3>What’s the best “backup payment” plan?</h3>
<p>One card for daily use, one backup card stored separately, a small cash reserve stored separately, and digital wallet enabled if you use it. That way, one loss doesn’t end your spending ability.</p>
`;

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Lost Items Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_1_CHECKING_BAG -->',
            filename: `checking-suitcase-pocket-calmly-authentic-${timestamp}.jpg`,
            prompt: "A traveller calmly checking a suitcase pocket or bag compartment in a hotel room. Organised, not panicking. Trying to find a lost item. Authentic travel moment."
        },
        {
            placeholder: '<!-- IMAGE_2_ACCOMMODATION_HELP -->',
            filename: `hotel-reception-help-lost-item-authentic-${timestamp}.jpg`,
            prompt: "A UK traveller speaking to a helpful hotel receptionist in Turkey? Asking for help. Friendly, professional service. Authentic hotel lobby scene."
        },
        {
            placeholder: '<!-- IMAGE_3_PHONE_SECURITY -->',
            filename: `phone-security-lock-screen-authentic-${timestamp}.jpg`,
            prompt: "Close up of a smartphone screen showing a 'Lost Mode' or security lock screen, or a banking app freeze card screen. Clear digital security concept. Authentic."
        },
        {
            placeholder: '<!-- IMAGE_4_WALLET_BACKUP -->',
            filename: `travel-wallet-backup-cards-authentic-${timestamp}.jpg`,
            prompt: "An organised travel wallet or safe showing backup cards and cash stored separately. Smart travel preparation. Authentic travel photography."
        },
        {
            placeholder: '<!-- IMAGE_5_PASSPORT_CHECK -->',
            filename: `uk-passport-on-hotel-table-authentic-${timestamp}.jpg`,
            prompt: "A flexible UK passport on a hotel table or desk in Turkey. Safe and secure. Document importance focus. Authentic travel photo."
        },
        {
            placeholder: '<!-- IMAGE_6_CALM_KIT -->',
            filename: `calm-travel-planning-notebook-authentic-${timestamp}.jpg`,
            prompt: "A traveller writing in a notebook or checking a phone calmly by a pool or in a cafe. 'Calm kit' concept. No stress. Authentic holiday vibe."
        }
    ];

    let finalContent = rawContent;
    let coverImageUrl = '';

    // Replace Internal Links
    for (const [key, value] of Object.entries(INTERNAL_LINKS)) {
        finalContent = finalContent.split(key).join(value);
    }

    for (const item of imagesToGenerate) {
        // Add delay to respect quotas
        await sleep(5000);

        const publicUrl = await generateImageVertex(item.prompt, item.filename);

        if (publicUrl) {

            // Use accommodation help or passport as cover candidate
            if (item.filename.includes('hotel-reception') && !coverImageUrl) {
                coverImageUrl = publicUrl;
            } else if (!coverImageUrl) {
                coverImageUrl = publicUrl;
            }

            const imgTag = `<img src="${publicUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
            finalContent = finalContent.replace(item.placeholder, imgTag);
        } else {
            console.warn("⚠️ Image generation failed for:", item.filename);

            // Fallback logic
            let fallbackUrl = '';

            if (item.filename.includes('checking-suitcase')) fallbackUrl = '/images/articles/packing-souvenirs-suitcase-careful-authentic-1767990834291.jpg';
            else if (item.filename.includes('hotel-reception')) fallbackUrl = '/images/articles/reception-check-in-questions-authentic-1767986640560.jpg';
            else if (item.filename.includes('phone-security')) fallbackUrl = '/images/articles/tourist-checking-phone-banking-app-authentic-1767990201789.jpg';
            else if (item.filename.includes('wallet-backup')) fallbackUrl = '/images/articles/travel-wallet-organised-cards-cash-authentic-1767990541740.jpg';
            else if (item.filename.includes('uk-passport')) fallbackUrl = '/images/articles/british-passport-travel-prep-authentic-1767987684522.jpg';
            else if (item.filename.includes('calm-travel')) fallbackUrl = '/images/articles/travel-essentials-flatlay-money-cards-authentic-1767989787226.jpg';

            if (fallbackUrl) {
                const imgTag = `<img src="${fallbackUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
                finalContent = finalContent.replace(item.placeholder, imgTag);
            } else {
                finalContent = finalContent.replace(item.placeholder, '');
            }

            // Fallback Cover Logic
            if (!coverImageUrl) {
                if (item.filename.includes('uk-passport')) coverImageUrl = fallbackUrl;
                else if (item.filename.includes('hotel-reception')) coverImageUrl = fallbackUrl;
            }
        }
    }

    // Double check cover image
    if (!coverImageUrl) {
        coverImageUrl = '/images/articles/british-passport-travel-prep-authentic-1767987684522.jpg';
    }

    // Insert into DB
    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Pasaport/Telefon Kaybetmek (TR Pasif)" },
        meta_description: { en: ARTICLE_DATA.meta_description, tr: "TR Pasif içerik." },
        content: { en: finalContent, tr: "<p>Bu içerik sadece İngilizce dilinde yayındadır.</p>" },
        cover_image_url: coverImageUrl,
        published_at: ARTICLE_DATA.published_at,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });

    if (error) {
        console.error("❌ DB Insert Failed:", error);
    } else {
        console.log("✅ Lost Items Article Added Successfully!");
        console.log("👉 Slug:", ARTICLE_DATA.slug);
    }
}

run();
