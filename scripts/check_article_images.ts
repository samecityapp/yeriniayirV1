
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const slugsToCheck = [
    'a-la-carte-all-inclusive-turkey',
    'best-all-inclusive-value-uk-turkey',
    'hospitals-and-clinics-in-turkey-for-uk-travellers-guide',
    'lost-passport-phone-wallet-turkey-uk-traveller-guide',
    'package-holiday-vs-booking-separately-turkey-uk-cost-comparison',
    'pharmacies-in-turkey-for-uk-travellers',
    'turkey-resort-transfers-guide',
    'staying-well-in-turkey-food-water-heat-comfort-tips-uk-travellers',
    'travel-insurance-turkey-uk-guide'
];

async function run() {
    console.log("🔍 Checking articles for image counts and cover images...");

    for (const slug of slugsToCheck) {
        const { data: article, error } = await supabase
            .from('articles')
            .select('slug, title, cover_image_url, content')
            .eq('slug', slug)
            .single();

        if (error || !article) {
            console.error(`❌ Article not found: ${slug}`);
            continue;
        }

        const content = typeof article.content === 'object' ? (article.content as any).en || '' : article.content;
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const matches = [...content.matchAll(imgRegex)];
        const imageCount = matches.length;
        const hasCover = !!article.cover_image_url;

        console.log(`\n📄 Article: ${slug}`);
        console.log(`   - Cover Image: ${hasCover ? '✅ Present' : '❌ MISSING'}`);
        if (hasCover) console.log(`     (${article.cover_image_url})`);
        console.log(`   - Inline Images: ${imageCount} / 6`);

        if (imageCount < 6) {
            console.log(`   ⚠️  LOW IMAGE COUNT! Needs ${6 - imageCount} more.`);
        } else {
            console.log(`   ✅ Image count sufficient.`);
        }
    }
}

run();
