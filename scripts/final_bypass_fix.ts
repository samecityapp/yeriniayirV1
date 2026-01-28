
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function finalBypassFix() {
    console.log("🔓 FINAL BYPASS FIX (Sending RAW HTML)...");

    const { data: articles, error } = await supabase.from('articles').select('*');
    if (error) { console.error(error); return; }

    let fixedCount = 0;

    for (const article of articles) {
        let content = article.content;
        // Drill down to the bottom
        let loops = 0;
        while ((typeof content === 'object' && content.en) || (typeof content === 'string' && content.trim().startsWith('{'))) {
            if (typeof content === 'object' && content.en) {
                content = content.en;
            } else if (typeof content === 'string') {
                try {
                    const parsed = JSON.parse(content);
                    if (parsed.en) content = parsed.en;
                    else break; // Plain string starts with { ?
                } catch (e) { break; }
            }
            loops++;
            if (loops > 20) break; // Safety
        }

        let extraction = content;

        // Ensure string
        if (typeof extraction !== 'string') {
            console.log(`Skipping ${article.slug}, content not string: ${typeof extraction}`);
            continue;
        }

        // Further cleanup of residual JSON stringification if any
        // If it starts with "{"en":..." it might be a stuck string
        if (extraction.startsWith('{"en"')) {
            // Force slice? 
            // Let's use the nuclear option: Find first <
            const startIdx = extraction.indexOf('<');
            if (startIdx > -1) extraction = extraction.substring(startIdx);
        }

        // Unescape again just in case
        extraction = extraction.split('\\"').join('"');
        extraction = extraction.split('\\\\').join('\\');

        // Tail Clean
        const markers = ['","tr":', '", "tr":'];
        for (const m of markers) {
            const idx = extraction.lastIndexOf(m);
            if (idx > -1 && idx > extraction.length - 2000) {
                extraction = extraction.substring(0, idx);
            }
        }

        // Trim junk
        extraction = extraction.trim();
        while (extraction.endsWith('"') || extraction.endsWith('}')) {
            extraction = extraction.slice(0, -1);
            extraction = extraction.trim();
        }

        // UPDATE WITH RAW STRING
        const { error: upErr } = await supabase.from('articles').update({
            content: extraction
        }).eq('id', article.id);

        if (!upErr) fixedCount++;
    }

    console.log(`🔓 Bypass Fix Complete. Updated ${fixedCount} articles.`);
}

finalBypassFix();
