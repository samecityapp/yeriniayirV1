import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: articles, error } = await supabase.from('articles').select('*').not('slug_en', 'is', null).not('slug', 'is', null).limit(1);
    if (error) { console.error(error); return; }

    console.log(JSON.stringify(articles[0], null, 2));
}
run();
