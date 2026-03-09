import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertArticle3() {
    let htmlContent = fs.readFileSync(path.resolve(process.cwd(), '../data/drafts/istanbul_3.html'), 'utf-8');

    // Replace image placeholders
    htmlContent = htmlContent.replace('<!-- image_istanbulkart_kiosk -->', '<img src="/images/articles/istanbulkart_kiosk.png" alt="Sarı Renkli Biletmatik ve İstanbulkart Yükleme Noktası" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_istanbul_metro_station -->', '<img src="/images/articles/istanbul_metro_station.png" alt="Modern ve Hızlı İstanbul Metro İstasyonu" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_t1_tram_sultanahmet -->', '<img src="/images/articles/t1_tram_sultanahmet.png" alt="Sultanahmet Camii Önünden Geçen T1 Tramvayı" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_istanbul_ferry_bosphorus -->', '<img src="/images/articles/istanbul_ferry_bosphorus.png" alt="Martılar Eşliğinde Boğazı Geçen Vapur" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_istanbul_funicular -->', '<img src="/images/articles/istanbul_funicular.png" alt="Tarihi Karaköy Tünel Füniküler Hattı" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');

    const newArticle = {
        title: {
            en: "Istanbul Public Transport Guide: Metro, Tram and Ferry Logic",
            tr: "İstanbul’da Ulaşım Rehberi: İstanbulkart, Metro/Tramvay/Feribot Mantığı (Kafası Karışanlara)"
        },
        slug: "istanbulda-ulasim-rehberi-istanbulkart-metro-tramvay-mantigi",
        slug_en: "istanbul-public-transport-guide-metro-tram-ferry-logic",
        content: { tr: htmlContent },
        location: { tr: "Istanbul" },
        cover_image_url: "/images/articles/istanbulkart_kiosk.png",
        meta_description: {
            tr: "İstanbul'da ulaşımı çözün! Turistler için İstanbulkart nasıl alınır, T1 Tramvay, M2 Metro ve vapur kullanımı, taksi tuzaklarından korunma rehberi.",
            en: ""
        },
        is_published: true,
        published_at: new Date().toISOString()
    };

    const { error, data } = await supabase.from('articles').upsert(newArticle, { onConflict: 'slug' }).select();
    if (error) {
        console.error("Failed to insert/update article:", error);
    } else {
        console.log("Success! Article 3 inserted with slug:", data[0].slug);
    }
}
insertArticle3();
