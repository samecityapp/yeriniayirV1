import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function check() {
    const { data } = await supabase.from('articles').select('*').eq('slug', 'i-stanbul-butce-planlayici-ekonomik-dengeli-rahat-mod-fiyat-vermeden-harcama-mantigi').maybeSingle();
    console.log("Type of content:", typeof data?.content);
    console.log("Content object itself:", data?.content);
}
check();
