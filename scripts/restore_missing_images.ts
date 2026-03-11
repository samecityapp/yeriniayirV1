import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreImages() {
    console.log("Restoring missing inline images and formatting perfectly...");
    const targetSlugs = [
        'i-stanbul-havalimani-ist-transfer-secimi-taksi-mi-metro-mu-ozel-transfer-mi-gece-varisi-plani',
        'sabiha-gokcen-den-sehre-en-kolay-ulasim-secenekler-ve-hangi-saatte-hangisi-mantikli',
        'i-stanbul-da-1-gunde-2-kita-avrupa-anadolu-rotasi-saat-saat-yurume-seviyesi',
        'i-stanbul-da-gun-batimi-noktalari-kalabaliksiz-saatler-en-i-yi-sunset-walk-rotalari',
        'i-stanbul-da-yagmurlu-gun-plani-kapali-mek-n-rotalari-muze-carsi-kafe-akisi',
        'i-stanbul-da-aksam-ne-yapilir-rehberi-aile-cift-tek-kisi-i-cin-guvenli-ve-keyifli-plan',
        'i-stanbul-da-dolandirilmadan-degil-surpriz-yasamadan-gezmek-basit-kurallar-taksi-menu-tur',
        'i-stanbul-da-camii-ziyareti-rehberi-giyim-saat-fotograf-kurallari-turist-i-cin-basit-anlatim',
        'i-stanbul-da-yuruyerek-gezilecek-semtler-2-3-saatlik-mini-rotalar-harita-mantigiyla',
        'i-stanbul-da-cocukla-gezi-bebek-cocuk-checklists-ogle-sicagi-yagmur-plani',
        'i-stanbul-butce-planlayici-ekonomik-dengeli-rahat-mod-fiyat-vermeden-harcama-mantigi',
        'i-stanbul-da-en-i-yi-fotograf-i-cerik-rotasi-1-gunde-viral-kareler-isik-saatleri-kalabalik-stratejisi',
        'i-stanbul-da-ulasim-rehberi-i-stanbulkart-metro-tramvay-feribot-mantigi-kafasi-karisanlara'
    ];

    const { data: articles } = await supabase.from('articles').select('slug, content, cover_image_url').in('slug', targetSlugs);
    if (!articles) return;

    for (const article of articles) {
        let trContent = '';
        if (typeof article.content === 'string') {
            try { trContent = JSON.parse(article.content).tr; } catch (e) { trContent = article.content; }
        } else { trContent = article.content?.tr || ''; }

        let coverUrl = article.cover_image_url || '';
        if (!coverUrl) {
            console.log(`Skipping ${article.slug}: No cover image!`);
            continue;
        }

        let prefix = coverUrl.substring(0, coverUrl.lastIndexOf('_'));

        // Strip ALL existing inner `<img >` tags just to be completely clean
        let cleanHtml = trContent.replace(/<img[^>]*>/gi, '');

        let imageTagsArr = [];
        // Typically image indexes are 1, 2, 3, 4. But some older articles might have non-standard names.
        // We will just generate exactly _1 to _4 dynamically using the prefix. (Because we know this is how generate_13_articles.ts works)
        for (let i = 1; i <= 4; i++) {
            let src = `${prefix}_${i}.jpg`;
            imageTagsArr.push(`<img src="${src}" alt="Görsel ${i}" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />`);
        }

        // Split by </p> to inject evenly
        const parts = cleanHtml.split(/(<\/p>)/i);
        let resultHtml = "";

        const pTags = parts.filter(p => p.toLowerCase() === '</p>');
        let pCount = pTags.length;
        let imagesToInject = 4;

        let injectInterval = Math.max(1, Math.floor(pCount / (imagesToInject + 1)));

        let currentP = 0;
        let imageIdx = 0;

        for (let i = 0; i < parts.length; i++) {
            resultHtml += parts[i];

            if (parts[i].toLowerCase() === '</p>') {
                currentP++;
                if (currentP % injectInterval === 0 && imageIdx < imagesToInject) {
                    resultHtml += `\n\n${imageTagsArr[imageIdx]}\n\n`;
                    imageIdx++;
                }
            }
        }

        // Safety: If any images left, append inside a dummy <div class="my-8">
        if (imageIdx < imagesToInject) {
            resultHtml += `\n<div class="space-y-8 my-8">\n`;
            while (imageIdx < imagesToInject) {
                resultHtml += `${imageTagsArr[imageIdx]}\n`;
                imageIdx++;
            }
            resultHtml += `</div>\n`;
        }

        let newContent = article.content;
        if (typeof newContent === 'string') {
            newContent = { tr: resultHtml, en: "<p>English version coming soon.</p>" };
        } else {
            newContent.tr = resultHtml;
        }

        await supabase.from('articles').update({ content: newContent }).eq('slug', article.slug);
        console.log(`✅ Restored 4 images elegantly for ${article.slug}`);
    }
}

restoreImages();
