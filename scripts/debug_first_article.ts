import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function check() {
    const { data } = await supabase.from('articles').select('*').eq('slug', 'i-stanbul-havalimani-ist-transfer-secimi-taksi-mi-metro-mu-ozel-transfer-mi-gece-varisi-plani').maybeSingle();
    console.log(JSON.stringify(data, null, 2));
}

check();
