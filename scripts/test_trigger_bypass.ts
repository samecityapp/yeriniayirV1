
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testTriggerBypass() {
    console.log("🧪 TEST TRIGGER BYPASS: Women Travelling...");
    const slug = 'women-travelling-in-turkey-comfort-tips';

    // 1. Fetch
    const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!article) return;

    let content = article.content;
    if (typeof content === 'object' && content.en) content = content.en;

    console.log(`Initial Length: ${content.length}`);

    // Clean it a bit first (remove existing wrapper garbage if possible)
    let clean = content;
    // ... basic clean ...
    clean = clean.split('\\"').join('"');
    // ...

    // 2. Update with RAW STRING (No {en: ...})
    console.log("Sending RAW STRING...");
    const { error } = await supabase.from('articles').update({
        content: clean // <-- KEY CHANGE
    }).eq('id', article.id);

    if (error) {
        console.error("❌ Update Error:", error);
        return;
    }
    console.log("✅ Update called.");

    // 3. Read Back
    const { data: check } = await supabase.from('articles').select('*').eq('id', article.id).single();

    console.log("Readback Type:", typeof check.content);
    if (typeof check.content === 'object') {
        console.log("Readback Keys:", Object.keys(check.content));
        if (check.content.en && typeof check.content.en === 'string') {
            console.log("✅ Trigger successfully wrapped string in {en}!");
            console.log("Inner Content Length:", check.content.en.length);
        } else {
            console.log("❓ Trigger did something else:", JSON.stringify(check.content).substring(0, 100));
        }
    } else {
        console.log("Readback is String (No trigger wrap?):", check.content.substring(0, 50));
    }
}

testTriggerBypass();
