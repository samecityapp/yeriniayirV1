import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function inspect() {
    const slug = 'women-travelling-in-turkey-comfort-tips-uk';
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (error) console.log(error);
    else {
        console.log("Type of content:", typeof data.content);
        if (typeof data.content === 'string') {
            console.log("RAW STRING START:", data.content.substring(0, 100));
            console.log("RAW STRING END:", data.content.slice(-200));
            const badKeywords = ['hyper-realistic', 'do not pose', 'camera settings', 'f/8', 'high quality photo'];
            badKeywords.forEach(kw => {
                if (data.content.toLowerCase().includes(kw)) console.log("FOUND KEYWORD:", kw);
            });
        }
        console.log("Content Keys:", Object.keys(data.content));
        if (data.content && data.content.en) {
            console.log("--- EN START ---");
            console.log(data.content.en.substring(0, 500)); // First 500 chars
            console.log("...");
            console.log(data.content.en.slice(-500)); // Last 500 chars
            console.log("--- EN END ---");
        }
    }
}
inspect();
