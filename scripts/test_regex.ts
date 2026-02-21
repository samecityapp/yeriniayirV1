import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
async function check() {
    const { data } = await supabase.from('articles').select('content').eq('slug', 'oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi').single();
    if(data) {
        let content = typeof data.content === 'object' ? (data.content as any).tr : data.content;
        const matches = [...content.matchAll(/<img[^>]+src=[\\"]+([^\\"]+)[\\"]+/g)];
        console.log("Found matches:", matches.length);
        if(matches.length > 0) {
            console.log("Match 1 string:", matches[0][0]);
            console.log("Match 1 src:", matches[0][1]);
        }
    } 
}
check();
