
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function listRecent() {
    const { data, error } = await supabase
        .from('articles')
        .select('title, slug')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error(error);
        return;
    }

    console.log("Recent Articles:");
    data.forEach(a => {
        // Handle title if it's an object (JSONB) or string
        const title = typeof a.title === 'object' ? a.title?.en : a.title;
        console.log(`- [${title}](http://localhost:3000/en/guide/${a.slug})`);
    });
}

listRecent();
