
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function repair() {
    const slug = 'all-inclusive-turkey-for-families-uk-parent-checklist';
    const correctImage = '/images/articles/all-inclusive-turkey-for-families-uk-parent-checklist-remaster-0-FIXED-v2.jpg';

    console.log(`🚑 REPAIRING: ${slug} (CACHE BUST MODE)`);

    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (error) {
        console.error("❌ DB Error:", error);
        return;
    }

    let content = data.content;
    let mainContent = "";

    // Handle JSON vs String content structure
    if (typeof content === 'string') {
        mainContent = content; // Should not be string based on previous scripts, but handling just in case
    } else if (content.en) {
        mainContent = content.en;
    } else {
        console.error("❌ Content format unknown", content);
        return;
    }

    // Prepare the Image HTML
    const imgHtml = `
<figure class="my-8">
  <img src="${correctImage}" alt="Luxury Hotel Lobby" class="w-full h-auto rounded-lg shadow-sm" />
</figure>`;

    // CHECK 1: Is the image already there?
    if (mainContent.includes(correctImage)) {
        console.log("ℹ️ Content ALREADY contains correct image path. Maybe a cache issue?");
    } else {
        console.log("⚠️ Content missing exact image path. Injecting...");
    }

    // REMOVE old IMG_0 placeholder if present
    if (mainContent.includes('<!-- IMG_0 -->')) {
        console.log("Found <!-- IMG_0 --> placeholder. Replacing.");
        mainContent = mainContent.replace('<!-- IMG_0 -->', imgHtml);
    }
    // If NO placeholder, check if we need to prepend it
    else if (!mainContent.includes(correctImage)) {
        console.log("No placeholder found. Injecting after <h1>.");
        const h1End = mainContent.indexOf('</h1>');
        if (h1End > 0) {
            const insertPos = h1End + 5; // after </h1>
            mainContent = mainContent.slice(0, insertPos) + "\n" + imgHtml + "\n" + mainContent.slice(insertPos);
        } else {
            console.error("❌ No H1 found? Appending to top.");
            mainContent = imgHtml + mainContent;
        }
    }

    // Payload update
    const newPayload = {
        ...data,
        content: { en: mainContent, tr: data.content.tr || "<p>TR pending</p>" },
        updated_at: new Date().toISOString()
    };

    const { error: saveError } = await supabase.from('articles').upsert(newPayload);
    if (saveError) console.error("❌ Save Failed:", saveError);
    else console.log("✅ FIXED & SAVED.");

    // Verify
    const { data: verify } = await supabase.from('articles').select('content').eq('slug', slug).single();
    console.log("VERIFY DATA STRUCTURE:", typeof verify.content, Array.isArray(verify.content), Object.keys(verify.content || {}));

    let verifiedContent = "";
    if (typeof verify.content === 'string') verifiedContent = verify.content;
    else if (verify.content?.en) verifiedContent = verify.content.en;

    if (verifiedContent.includes(correctImage)) {
        console.log("✅ VERIFIED: Image path is present in DB.");
    } else {
        console.error("❌ VERIFICATION FAILED. Content does not contain image path.");
        console.log("PARTIAL CONTENT:", verifiedContent.substring(0, 500));
    }
}

repair();
