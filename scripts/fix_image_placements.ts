import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function processAll() {
    console.log("Fetching articles...");
    const { data: articles } = await supabase.from('articles').select('slug, content, title');
    if (!articles) return;

    for (const dbArticle of articles) {
        let trContent = '';
        if (typeof dbArticle.content === 'string') {
            try { trContent = JSON.parse(dbArticle.content).tr; } catch (e) { trContent = dbArticle.content; }
        } else { trContent = dbArticle.content?.tr || ''; }

        // Extract all <img>
        const imgRegex = /<img[^>]+>/gi;
        const images = trContent.match(imgRegex);
        if (!images || images.length === 0) {
            console.log(`No images found in ${dbArticle.slug}, skipping.`);
            continue;
        }

        // Clean html from images
        let cleanHtml = trContent.replace(imgRegex, '');

        // Split by </p> to inject evenly
        const parts = cleanHtml.split(/(<\/p>)/i);
        let resultHtml = "";

        // Actual number of closing p tags
        const pTags = parts.filter(p => p.toLowerCase() === '</p>');
        let pCount = pTags.length;
        let imagesToInject = images.length;

        let injectInterval = Math.max(1, Math.floor(pCount / (imagesToInject + 1)));

        let currentP = 0;
        let imageIdx = 0;

        for (let i = 0; i < parts.length; i++) {
            resultHtml += parts[i];

            if (parts[i].toLowerCase() === '</p>') {
                currentP++;
                // Check if it's time to inject an image
                // Space them out: first image after `injectInterval` p tags, second after `2*injectInterval`...
                if (currentP % injectInterval === 0 && imageIdx < imagesToInject) {
                    resultHtml += `\n\n${images[imageIdx]}\n\n`;
                    imageIdx++;
                }
            }
        }

        // If any images are left, append them at the end safely
        while (imageIdx < imagesToInject) {
            resultHtml += `\n\n${images[imageIdx]}\n\n`;
            imageIdx++;
        }

        let newContent = dbArticle.content;
        if (typeof newContent === 'string') {
            newContent = { tr: resultHtml, en: "<p>English version coming soon.</p>" };
        } else {
            newContent.tr = resultHtml;
        }

        await supabase.from('articles').update({ content: newContent }).eq('slug', dbArticle.slug);
        console.log(`Re-distributed ${images.length} images for ${dbArticle.slug} (Total paragraphs: ${pCount}, Interval: ${injectInterval})`);
    }
    console.log("✅ All image placements fixed!");
}

processAll();
