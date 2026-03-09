import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
async function test() {
  const { data: d1 } = await supabase.from('articles').select('title, location').ilike('location', '%Fethiye%');
  console.log("Fethiye count:", d1?.length);
  if(d1?.length) { console.log(d1.slice(0, 3)); }
}
test();
