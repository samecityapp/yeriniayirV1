
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
    slug: 'hospitals-and-clinics-in-turkey-for-uk-travellers-guide',
    title: 'Hospitals & Clinics in Turkey for UK Travellers: Where to Go, What to Expect (Calm Guide)',
    meta_description: 'Need medical care in Turkey as a UK traveller? This calm guide explains how hospitals and clinics work, when to call 112, how to choose public vs private care, what documents to bring, how payment and insurance usually work, and how to book non-urgent appointments (including MHRS/Alo 182). Includes checklists, copy-paste scripts, and FAQs.',
    published_at: new Date().toISOString(),
};

// Internal Link Mappings
const INTERNAL_LINKS = {
    '[INTERNAL_LINK:emergency-numbers-turkey-uk]': '/guide/emergency-numbers-pharmacies-getting-help-turkey-guide',
    '[INTERNAL_LINK:pharmacies-in-turkey-uk-travellers]': '/guide/pharmacies-in-turkey-for-uk-travellers',
    '[INTERNAL_LINK:travel-insurance-turkey-uk-what-to-check]': '/guide/travel-insurance-turkey-uk-guide'
};

const rawContent = `
<p><strong>Quick answer:</strong> If it’s urgent, call <strong>112</strong> in Turkey and get help fast through the emergency system. For non-urgent medical needs, you’ll usually choose between private hospitals/clinics (often quicker and more English-friendly in major tourist areas) and public hospitals (wide coverage, structured systems, and often excellent clinical care). The easiest way to keep everything calm is to (1) know your “urgent vs non-urgent” decision, (2) save your address and insurance details, and (3) use your accommodation staff to point you to the simplest nearby option.</p>

<p>This guide is designed for UK travellers. It’s practical, reassuring, and not fear-based.</p>

<h2>1) Step one: decide “urgent” or “non-urgent”</h2>

<p>This single decision saves the most time and stress.</p>

<h3>If it’s urgent (now)</h3>
<p>Examples: severe symptoms, serious injury, breathing issues, heavy bleeding, loss of consciousness, or anything that feels like it cannot wait.</p>
<ul>
<li><strong>Call 112</strong> (Turkey’s main emergency number).</li>
<li>Use the fastest location method: share your exact address and a nearby landmark.</li>
</ul>
<p><strong>Simple rule:</strong> If you’re even slightly unsure and it feels urgent, treat it as urgent and call 112.</p>

<h3>If it’s non-urgent</h3>
<p>Examples: manageable illness, mild injury, symptoms you’d normally book a same/next-day appointment for, or you simply need medical advice.</p>
<ul>
<li>Start with a <strong>pharmacy (eczane)</strong> for common, mild problems (they can often guide you).</li>
<li>Or choose a clinic / hospital for an assessment, prescription, or tests.</li>
</ul>

<p><strong>UK-friendly tip:</strong> Most holiday health issues are made worse by delay. Sorting it early usually protects the rest of your trip.</p>

<p>Related internal guides:
<a href="[INTERNAL_LINK:emergency-numbers-turkey-uk]">Emergency Numbers & Help</a>
<a href="[INTERNAL_LINK:pharmacies-in-turkey-uk-travellers]">Pharmacies in Turkey</a>
<a href="[INTERNAL_LINK:travel-insurance-turkey-uk-what-to-check]">Travel Insurance Guide</a></p>

<!-- IMAGE_1_URGENT_VS_NON_URGENT -->

<h2>2) Public vs private healthcare in Turkey (the simple comparison)</h2>

<p>You’ll hear people say “go private” or “use a public hospital” as if there’s one right answer. In reality, it’s about what you need today.</p>

<h3>Private hospitals / private clinics</h3>
<p><strong>Often best for:</strong></p>
<ul>
<li>travellers who want speed and predictability</li>
<li>English-speaking support (more common in major tourist areas and large cities)</li>
<li>non-urgent issues where you want a quick assessment</li>
<li>situations where you’ll pay and then claim via insurance</li>
</ul>
<p><strong>Trade-offs:</strong></p>
<ul>
<li>You will usually pay out of pocket (then claim, if covered)</li>
<li>Prices vary by provider and service</li>
<li>You must keep documentation for insurance</li>
</ul>
<p><strong>Simple rule:</strong> If convenience and communication matter most, private care is often the easiest route.</p>

<h3>Public hospitals</h3>
<p><strong>Often best for:</strong></p>
<ul>
<li>emergencies and complex cases</li>
<li>broad service availability</li>
<li>structured pathways for many types of care</li>
</ul>
<p><strong>Trade-offs:</strong></p>
<ul>
<li>waits can vary (especially in busy cities)</li>
<li>English availability can vary</li>
<li>admin steps can feel unfamiliar to UK travellers</li>
</ul>
<p><strong>UK-friendly tip:</strong> Public hospitals can provide very strong clinical care. The main difference for travellers is often the “process” and waiting, not the capability.</p>

<h2>3) A UK-friendly “where should we go?” decision tool</h2>

<p>Use this quick tool instead of overthinking.</p>

<p><strong>Go to a pharmacy first if:</strong></p>
<ul>
<li>you have mild symptoms and want advice/products</li>
<li>you’re not sure if you need a doctor yet</li>
<li>you want the simplest first step</li>
</ul>
<p>(Pharmacy notes for travellers + on-duty pharmacies): <a href="[INTERNAL_LINK:pharmacies-in-turkey-uk-travellers]">Read the Pharmacy Guide</a></p>

<p><strong>Go to a clinic / private hospital if:</strong></p>
<ul>
<li>you think you’ll need a prescription</li>
<li>you need a doctor’s note (e.g., for travel/insurance)</li>
<li>symptoms aren’t severe but you want a proper assessment</li>
</ul>

<p><strong>Go to a hospital emergency department (or call 112) if:</strong></p>
<ul>
<li>it’s urgent</li>
<li>symptoms are escalating</li>
<li>you’re worried it can’t safely wait</li>
</ul>

<p><strong>Simple rule:</strong> Start with the simplest safe option — but don’t delay urgent care.</p>

<!-- IMAGE_2_CLINIC_RECEPTION -->

<h2>4) The most important preparation: what to save on your phone</h2>

<p>Most medical “stress” comes from missing details, not medical treatment itself.</p>

<p><strong>Save these before you travel (or on day 1)</strong></p>
<ul>
<li>Accommodation name + full address (copy/paste text)</li>
<li>A screenshot of that address (offline)</li>
<li>Your travel insurance provider + policy number + emergency line</li>
<li>A short medical note: allergies, conditions, regular meds</li>
<li>A photo of your passport ID page (securely stored)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Screenshots beat poor signal. Save them.</p>

<h2>5) What to expect at a hospital/clinic visit (so it feels familiar)</h2>

<p>Every country’s process looks different. Here’s the “shape” of a typical visit in Turkey so you feel grounded:</p>

<p><strong>Typical steps</strong></p>
<ul>
<li>Registration / intake (basic identity + contact details)</li>
<li>Triage (how urgent your case is, especially in ER)</li>
<li>Doctor assessment</li>
<li>Tests if needed (bloodwork, imaging, etc.)</li>
<li>Treatment plan + prescription / referral</li>
<li>Payment paperwork (more common in private care; public varies by route)</li>
</ul>

<p><strong>Simple rule:</strong> The process may look different to the NHS, but your job is the same: be clear, be calm, give accurate information.</p>

<!-- IMAGE_3_DOCTOR_CONSULTATION -->

<h2>6) Payment and insurance: the calm, realistic approach</h2>

<p>The UK FCDO guidance for Turkey health highlights the importance of travel insurance and notes that UK GHIC/EHIC cards are not valid in Turkey.</p>

<p><strong>What that means in practice</strong></p>
<ul>
<li>Expect to pay in many situations as a tourist and then claim, depending on your policy.</li>
<li>Your insurer may require you to call their assistance line for authorisation in certain cases (especially hospital admission).</li>
</ul>
<p><strong>Simple rule:</strong> Assume you’ll need insurance support and documentation. Keep everything.</p>

<p><strong>The documentation you want (for claims)</strong></p>
<ul>
<li>Itemised invoice/receipt</li>
<li>Medical report/doctor note (even brief)</li>
<li>Prescription copy</li>
<li>Test results (if relevant)</li>
</ul>
<p>UK guidance on what to do if hospitalised abroad can help you stay organised.</p>

<h2>7) Non-urgent appointments: MHRS and Alo 182 (what it is, when it helps)</h2>

<p>Turkey has a central appointment system called MHRS (Centralised Doctor Appointment System). It offers booking via website/app and via the Alo 182 appointment line.</p>

<p><strong>When MHRS can be useful</strong></p>
<ul>
<li>You’re staying longer and want a scheduled appointment</li>
<li>You prefer a structured booking route for public facilities</li>
<li>You’re not in an urgent situation</li>
</ul>

<p><strong>The practical traveller reality</strong></p>
<ul>
<li>The system is primarily designed for residents, and the experience can vary for visitors.</li>
<li>For short stays, many UK travellers find it simpler to use:
  <ul>
  <li>accommodation staff to recommend a nearby clinic/hospital, or</li>
  <li>private care for speed (then claim if insured)</li>
  </ul>
</li>
</ul>

<p><strong>Simple rule:</strong> MHRS/Alo 182 is a good option when you have time and want structure; private clinics are often simpler for short tourist stays.</p>

<h2>8) Language and communication: how to get the best help fast</h2>

<p>You don’t need perfect Turkish. You need clear information.</p>

<p><strong>Bring a one-minute symptom summary</strong></p>
<p>Write this in Notes (then show it):</p>
<ul>
<li>“I’m visiting from the UK.”</li>
<li>“My symptoms started: [day/time].”</li>
<li>“Main symptoms: [3 bullets].”</li>
<li>“Allergies: [list].”</li>
<li>“Regular medications: [list].”</li>
<li>“Medical conditions: [list].”</li>
<li>“What I’ve taken so far: [list].”</li>
</ul>

<p><strong>UK-friendly tip:</strong> If you ask “Can you write the instructions down?” you avoid 90% of confusion.</p>

<!-- IMAGE_4_COMMUNICATION_NOTES -->

<h2>9) Prescriptions: don’t assume UK prescriptions work</h2>

<p>The UK FCDO Turkey health guidance states that British prescriptions are not accepted in Turkey, and that medication rules can differ.</p>

<p><strong>Simple rule:</strong> If you need a prescription medicine, expect that you may need a local prescription pathway.</p>

<p>Related internal: <a href="[INTERNAL_LINK:pharmacies-in-turkey-uk-travellers]">Pharmacy Guide</a></p>

<h2>10) Your accommodation is your “local assistant” (use them)</h2>

<p>This is one of the most underrated travel advantages.</p>

<p><strong>Ask your accommodation:</strong></p>
<ul>
<li>“What’s the nearest good clinic/hospital?”</li>
<li>“Where is the closest on-duty pharmacy if it’s after hours?”</li>
<li>“Can you write the address in Turkish to show a taxi/driver?”</li>
<li>“If we need a doctor, what’s the simplest option today?”</li>
</ul>

<p><strong>Simple rule:</strong> Don’t DIY the local system when someone can point you to the cleanest route in 30 seconds.</p>

<!-- IMAGE_5_ACCOMMODATION_HELP -->

<h2>11) The “Calm Medical Visit” checklist (save this)</h2>

<p>Use this before leaving your room:</p>

<p><strong>Essentials</strong></p>
<ul>
<li>Passport/ID (or a secure copy if appropriate)</li>
<li>Insurance details + emergency line</li>
<li>Payment method</li>
<li>Symptom note (in your phone)</li>
<li>Allergy/medication list</li>
<li>Address screenshot + map pin</li>
</ul>

<p><strong>For families</strong></p>
<ul>
<li>Child details (age, allergies, meds)</li>
<li>Snacks/water</li>
<li>Comfort item (small toy, etc.)</li>
</ul>

<p><strong>UK-friendly tip:</strong> Planning the visit like a small mission keeps it calm and quick.</p>

<h2>12) Copy-paste scripts (use these in messages or at reception)</h2>

<p><strong>Script A: asking reception for the right option</strong></p>
<p>“Hi — we need medical help (non-urgent). What’s the simplest nearby clinic/hospital for visitors? Could you write the address and best way to get there?”</p>

<p><strong>Script B: checking insurance process</strong></p>
<p>“Hi — if we need to see a doctor today, do we need to call our insurer first? We have the emergency assistance line and policy number.”</p>

<p><strong>Script C: at the clinic desk</strong></p>
<p>“Hello — I’m visiting from the UK. I need to see a doctor for [symptom]. Here is a short note of my symptoms and medications.”</p>

<!-- IMAGE_6_HOSPITAL_EXTERIOR -->

<h2>FAQ: Hospitals & clinics in Turkey for UK travellers</h2>

<h3>What number do I call in an emergency in Turkey?</h3>
<p>Call 112 for emergency help in Turkey.</p>

<h3>Are UK GHIC/EHIC cards valid in Turkey?</h3>
<p>No — the UK FCDO guidance states EHIC/GHIC cards are not valid in Turkey, so travel insurance is important.</p>

<h3>Can I use a UK prescription in Turkey?</h3>
<p>The UK FCDO guidance states British prescriptions are not accepted in pharmacies in Turkey.</p>

<h3>Should I use a private hospital or a public hospital?</h3>
<p>Choose based on your situation. Private care is often quicker and more communication-friendly for tourists; public hospitals are comprehensive and are a strong choice especially for emergencies. The best option is the one that gets you appropriate care smoothly and safely.</p>

<h3>How do I book a non-urgent appointment in Turkey?</h3>
<p>Turkey has a central appointment system (MHRS) and an appointment line (Alo 182) used for booking through that system. For short tourist stays, many travellers find it simplest to use accommodation help or private clinics, depending on the situation.</p>

<h3>What should I bring to a clinic/hospital as a tourist?</h3>
<p>Bring your ID, insurance details, a payment method, and a short symptom/allergy/medication note. Keep all receipts and medical notes for your records and any insurance claim.</p>

<h3>What should I do if I’m hospitalised abroad?</h3>
<p>Follow your insurer’s instructions and keep documentation. The UK provides general guidance on medical emergencies and hospitalisation abroad.</p>
`;

async function run() {
    const timestamp = Date.now();
    console.log("🚀 Starting Hospitals & Clinics Article Automation...");

    const imagesToGenerate = [
        {
            placeholder: '<!-- IMAGE_1_URGENT_VS_NON_URGENT -->',
            filename: `emergency-112-smartphone-screen-${timestamp}.jpg`,
            prompt: "Close up of a smart phone screen showing the number 112 with 'Emergency' written below it. Blurred background of a modern Turkish street. Professional, safety focus. Authentic travel photography style."
        },
        {
            placeholder: '<!-- IMAGE_2_CLINIC_RECEPTION -->',
            filename: `modern-clinic-reception-desk-turkey-${timestamp}.jpg`,
            prompt: "Modern, clean medical clinic reception desk in Turkey. Friendly atmosphere, bright lighting. Staff member behind desk, professional appearance. English speaking friendly vibe. Authentic photography."
        },
        {
            placeholder: '<!-- IMAGE_3_DOCTOR_CONSULTATION -->',
            filename: `doctor-patient-consultation-calm-turkey-${timestamp}.jpg`,
            prompt: "A calm medical consultation scene. A doctor listing to a patient in a modern office. Back of patient's head visible. Reassuring, professional, clean medical environment in Turkey. Authentic style."
        },
        {
            placeholder: '<!-- IMAGE_4_COMMUNICATION_NOTES -->',
            filename: `symptom-notes-on-phone-screen-${timestamp}.jpg`,
            prompt: "Close up of a phone screen showing a notes app with a bullet list of medical symptoms (English text). Hand holding the phone. Helpful for travel preparation. Authentic, focus on the screen."
        },
        {
            placeholder: '<!-- IMAGE_5_ACCOMMODATION_HELP -->',
            filename: `hotel-reception-giving-directions-hospital-${timestamp}.jpg`,
            prompt: "Hotel receptionist helping a guest with a map, pointing out a location. Friendly, helpful interaction. Modern hotel lobby background. Authentic travel service vibe."
        },
        {
            placeholder: '<!-- IMAGE_6_HOSPITAL_EXTERIOR -->',
            filename: `modern-private-hospital-exterior-turkey-${timestamp}.jpg`,
            prompt: "Exterior of a modern private hospital in Turkey. Glass facade, clean entrance, sunny day. Professional medical facility architecture. 'Hospital' or 'Hastane' sign visible (optional). Authentic photography."
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
            // Use the first image (Urgent vs Non-Urgent 112) as cover if appropriate, or maybe the Hospital Exterior
            // User didn't specify cover, but usually the first image or a specific "Cover" is good. 
            // I'll set the Hospital Exterior as cover if available, otherwise the first generated one.

            // Wait, for the article inserted, we need a cover_image_url separate from content images.
            // I will use `modern-private-hospital-exterior` for the cover if generated, otherwise the first one.

            if (item.filename.includes('hospital-exterior')) {
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
            if (item.filename.includes('112')) fallbackUrl = '/images/articles/emergency-number-112-on-phone-screen-1767987110935.jpg';
            else if (item.filename.includes('reception-desk')) fallbackUrl = '/images/articles/hotel-reception-checkin-authentic-1767987684522.jpg';
            else if (item.filename.includes('doctor-patient')) fallbackUrl = '/images/articles/pharmacist-consultation-friendly-turkey-1767991226342.jpg';
            else if (item.filename.includes('symptom-notes')) fallbackUrl = '/images/articles/travel-checklist-notebook-authentic-1767985612952.jpg';
            else if (item.filename.includes('giving-directions')) fallbackUrl = '/images/articles/asking-hotel-reception-for-directions-1767987110935.jpg';
            else if (item.filename.includes('hospital-exterior')) fallbackUrl = '/images/articles/modern-hospital-sign-turkey-authentic-1767989062717.jpg';

            if (fallbackUrl) {
                const imgTag = `<img src="${fallbackUrl}" alt="${item.prompt}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
                finalContent = finalContent.replace(item.placeholder, imgTag);
            } else {
                finalContent = finalContent.replace(item.placeholder, '');
            }

            // Fallback Cover Logic
            if (!coverImageUrl) {
                if (item.filename.includes('hospital-exterior')) coverImageUrl = fallbackUrl;
                else if (item.filename.includes('112')) coverImageUrl = fallbackUrl;
            }
        }
    }

    // Double check cover image
    if (!coverImageUrl) {
        coverImageUrl = '/images/articles/modern-hospital-sign-turkey-authentic-1767989062717.jpg'; // Reused
    }

    // Insert into DB
    const { error } = await supabase.from('articles').upsert({
        slug: ARTICLE_DATA.slug,
        title: { en: ARTICLE_DATA.title, tr: "Türkiye'de Hastaneler ve Klinikler (TR Pasif)" },
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
        console.log("✅ Hospitals & Clinics Article Added Successfully!");
        console.log("👉 Slug:", ARTICLE_DATA.slug);
    }
}

run();
