import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data } = await supabase.from('articles').select('content').eq('slug', 'fethiyede-nerede-kalinir-bolge-secim-rehberi').single();
    let content = typeof data.content === 'object' ? data.content.tr : data.content;

    // Custom link matches
    const aTags = content.match(/<a[^>]*>/g);
    console.log("Total <a> tags:", aTags ? aTags.length : 0);

    if (aTags) {
        aTags.slice(0, 3).forEach(t => console.log(t));
    }
}
check();
