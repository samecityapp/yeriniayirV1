import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
async function run() {
    const { data } = await supabase.from('articles').select('slug, content').limit(3);
    if(data) {
        data.forEach(d => {
            let contentStr = typeof d.content === 'string' ? d.content : JSON.stringify(d.content);
            console.log(d.slug, contentStr.includes('_real_inline_') ? "SUCCESS" : "FAILED");
        });
    } 
}
run();
