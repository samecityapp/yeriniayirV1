
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLES_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'articles');

function getArticleImages(slug: string): string[] {
    if (!fs.existsSync(ARTICLES_IMAGE_DIR)) return [];

    // Find all images starting with slug-
    const files = fs.readdirSync(ARTICLES_IMAGE_DIR);
    return files
        .filter(f => f.startsWith(`${slug}-`) && f.endsWith('.jpg'))
        .sort() // Ensure order 1, 2, 3...
        .map(f => `/images/articles/${f}`);
}

async function repairArticles() {
    console.log("🛠️ Starting Image Repair Job (Injecting 5 images per article)...");

    const { data: articles, error } = await supabase
        .from('articles')
        .select('*');

    if (error || !articles) {
        console.error("❌ DB Error:", error);
        return;
    }

    console.log(`Found ${articles.length} articles to check.`);

    for (const article of articles) {
        let content = typeof article.content === 'object' ? (article.content as any).en : article.content;

        // Count existing images
        const imgCount = (content.match(/<img/g) || []).length;
        if (imgCount >= 5) {
            console.log(`✅ [OK] ${article.title} already has ${imgCount} images.`);
            continue;
        }

        console.log(`🔧 Repairing: ${article.title} (Has ${imgCount} images)`);

        // 1. Find images on disk
        const images = getArticleImages(article.slug);

        if (images.length < 5) {
            console.warn(`⚠️ Only found ${images.length} images for ${article.slug}. Skipping... (Need to regenerate?)`);
            // TODO: Add regeneration logic later if needed. For now, we assume images passed.
            continue;
        }

        // 2. Inject Images Logic
        // Strategy: Inject after H2 tags or paragraphs if H2 are scarce.
        // We need to inject images 2, 3, 4, 5 (Image 1 is usually cover or already there)

        // Split by </p> to find paragraph breaks
        let parts = content.split('</p>');
        let newContent = "";
        let imgIndex = 0;

        // If image 0 is not in content, we might want to add it? 
        // Usually cover image is handled by metadata. Let's assume we want to inject all available images into the body 
        // distributed evenly.

        // However, if the first image is already the cover, maybe we don't want it twice?
        // Let's stick to the user request: "5 visuals". If cover is separate, we put 5 in body?
        // Usually "Cover Image" is header. Body needs images.
        // Let's inject 5 images into the body.

        const totalParts = parts.length;
        const interval = Math.floor(totalParts / (images.length + 1));

        // We will inject at index: interval, 2*interval, 3*interval, etc.
        let injectionPoints = images.map((_, i) => (i + 1) * interval);

        let currentImg = 0;

        for (let i = 0; i < parts.length; i++) {
            newContent += parts[i] + '</p>';

            if (currentImg < images.length && i === injectionPoints[currentImg]) {
                const imgUrl = images[currentImg];
                const altText = `${article.title} - Scene ${currentImg + 1}`;
                const imgTag = `
                <figure class="my-8">
                    <img src="${imgUrl}" alt="${altText}" class="w-full h-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300" />
                    <figcaption class="text-center text-sm text-gray-500 mt-2 italic">${article.title} - View ${currentImg + 1}</figcaption>
                </figure>
                `;
                newContent += imgTag;
                currentImg++;
            }
        }

        // 3. Update DB
        const { error: updateError } = await supabase
            .from('articles')
            .update({
                content: { en: newContent, tr: "<p>Content available in English only.</p>" }
            })
            .eq('id', article.id);

        if (updateError) {
            console.error(`❌ Failed to update ${article.slug}:`, updateError);
        } else {
            console.log(`✨ Fixed ${article.slug}: Injected ${currentImg} images.`);
        }
    }
}

repairArticles();
