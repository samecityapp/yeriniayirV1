import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data } = await supabase.from('articles').select('slug, content').eq('slug', 'oludeniz-gunu-nasil-planlanir-saat-saat-akis-fethiye-rehberi').single();
    if (data) {
        let contentHtml = typeof data.content === 'object' ? (data.content as any).tr : data.content;

        const imgRegex = /<img[^>]+src=[\\"]+([^\\"]+)[\\"]+(?:[^>]*alt=[\\"]+([^\\"]*)[\\"]+)?[^>]*>/g;
        const matches = [...contentHtml.matchAll(imgRegex)];

        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const fullImgTag = match[0];
            const newImgTag = `<img src="NEW_IMAGE_${i}.png" alt="new alt" />`;

            contentHtml = contentHtml.replace(fullImgTag, newImgTag);
            console.log(`Replaced match ${i}`);
        }

        const newMatches = [...contentHtml.matchAll(imgRegex)];
        console.log("Images left containing placeholder:", newMatches.length);
        console.log("First 500 chars after replace:", contentHtml.substring(0, 500));

        const testNew = [...contentHtml.matchAll(/NEW_IMAGE/g)];
        console.log("Total NEW_IMAGE tags found:", testNew.length);
    }
}
run();
