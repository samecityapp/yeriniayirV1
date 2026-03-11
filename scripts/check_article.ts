import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check(slug: string) {
    const { data: article } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!article) return console.log("Not found:", slug);
    const content = article.content.tr || '';
    const imgCount = (content.match(/<img/g) || []).length;
    const wordCount = content.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).length;
    console.log(`Title: ${article.title.tr}`);
    console.log(`Word Count: ${wordCount}`);
    console.log(`Images in content: ${imgCount}`);
    console.log(`Cover: ${article.cover_image_url}`);
}

check(process.argv[2]);
