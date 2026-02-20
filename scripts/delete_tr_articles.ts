import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: articles, error } = await supabase.from('articles').select('id, title, location, slug, slug_en');
    if (error) { console.error('Error fetching articles:', error); return; }

    console.log(`Found ${articles.length} articles total.`);

    let pureTrCount = 0;
    let bilingualCount = 0;

    for (const article of articles) {
        const isTr = !!article.slug;
        const isEn = !!article.slug_en;

        if (isTr && !isEn) {
            // Pure Turkish article -> Delete perfectly
            console.log(`Deleting TR-only article: ${article.slug}`);
            const { error: deleteError } = await supabase.from('articles').delete().eq('id', article.id);
            if (deleteError) {
                console.error(`Failed to delete ${article.slug}:`, deleteError);
            } else {
                pureTrCount++;
            }
        } else if (isTr && isEn) {
            // Bilingual article -> Remove TR keys from JSON
            bilingualCount++;

            let changed = false;
            let newTitle = article.title;
            let newLocation = article.location;

            // Handle title
            if (typeof article.title === 'string' && article.title.trim().startsWith('{')) {
                try {
                    const parsedObj = JSON.parse(article.title);
                    if (parsedObj.tr) {
                        delete parsedObj.tr;
                        newTitle = JSON.stringify(parsedObj);
                        changed = true;
                    }
                } catch (e) {
                    // Ignore parse error
                }
            }

            // Handle location
            if (typeof article.location === 'string' && article.location.trim().startsWith('{')) {
                try {
                    const parsedObj = JSON.parse(article.location);
                    if (parsedObj.tr) {
                        delete parsedObj.tr;
                        newLocation = JSON.stringify(parsedObj);
                        changed = true;
                    }
                } catch (e) {
                    // Ignore parse error
                }
            }

            if (changed) {
                const { error: updateError } = await supabase.from('articles').update({
                    title: newTitle,
                    location: newLocation
                }).eq('id', article.id);

                if (updateError) {
                    console.error(`Failed to update ${article.slug_en}:`, updateError);
                }
            }
        }
    }

    console.log(`\nCleanup Complete!`);
    console.log(`Deleted ${pureTrCount} pure Turkish articles.`);
    console.log(`Updated ${bilingualCount} bilingual articles to be English-only.`);
}
run();
