import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function processArticle(slug: string, imagePrefixMatches: string) {
    const { data: dbArticle } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (!dbArticle) return console.log("Not found:", slug);

    let trContent = '';
    if (typeof dbArticle.content === 'string') {
        try { trContent = JSON.parse(dbArticle.content).tr; } catch (e) { trContent = dbArticle.content; }
    } else { trContent = dbArticle.content.tr; }

    let cleanHtml = trContent.replace(/<img[^>]*>/gi, '');

    // Split by multiple tags to guarantee enough parts for 4 images
    let parts = cleanHtml.split(/(<\/h2>|<\/p>|<\/h3>)/i);

    let resultHtml = parts[0];

    const imgDir = path.resolve(process.cwd(), 'public/images/articles');
    const allFiles = fs.readdirSync(imgDir);
    const matchedFiles = allFiles.filter(f => f.startsWith(imagePrefixMatches)).sort();

    if (matchedFiles.length < 5) return console.log(`Not enough images found for ${slug}`);

    const imgUrls = matchedFiles.map(f => `/images/articles/${f}`);

    let imageIdx = 1;
    for (let i = 1; i < parts.length; i++) {
        // parts array from regex split includes the split strings themselves!
        // so i=1 is the tag (e.g. </h2>), i=2 is the next text block
        // Wait, if parts has the matched tag, we should just append it.
        resultHtml += parts[i];

        // Only inject after a tag (i % 2 === 1)
        if (i % 2 === 1 && imageIdx < 5) {
            // inject image
            resultHtml += `\n<img src="${imgUrls[imageIdx]}" alt="Görsel ${imageIdx}" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />\n`;
            imageIdx++;
        }
    }

    const coverUrl = imgUrls[0];

    await supabase.from('articles').update({
        cover_image_url: coverUrl,
        content: { tr: resultHtml, en: "<p>English version coming soon.</p>" }
    }).eq('slug', slug);

    console.log(`Updated images for ${slug}`);
}

async function main() {
    await processArticle('i-stanbul-da-cocukla-gezi-bebek-cocuk-checklists-ogle-sicagi-yagmur-plani', 'ist_vx_fix9_');
}

main();
