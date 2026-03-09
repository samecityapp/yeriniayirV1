import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertArticle1() {
    let htmlContent = fs.readFileSync(path.resolve(process.cwd(), '../data/drafts/istanbul_1.html'), 'utf-8');

    // Replace image placeholders
    htmlContent = htmlContent.replace('<!-- image_istanbul_skyline_view -->', '<img src="/images/articles/istanbul_skyline_view.png" alt="İstanbul Boğazı ve Tarihi Yarımada Günbatımı" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_sultanahmet_historic_street -->', '<img src="/images/articles/sultanahmet_historic_street.png" alt="Sultanahmet Tarihi Evler ve Sokaklar" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_karakoy_cafe_vibe -->', '<img src="/images/articles/karakoy_cafe_vibe.png" alt="Karaköy Kafe Sokakları ve Atmosferi" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_besiktas_bosphorus_coast -->', '<img src="/images/articles/besiktas_bosphorus_coast.png" alt="Beşiktaş Boğaz Sahili Yürüyüş Yolu" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_kadikoy_moda_ferry -->', '<img src="/images/articles/kadikoy_moda_ferry.png" alt="Kadıköy Moda İskelesine Yanaşan Vapur" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');

    const newArticle = {
        title: {
            en: "Where to Stay in Istanbul? Area & Base Selection Guide",
            tr: "İstanbul’da Nerede Kalınır? Bölge Bölge Base Seçim Rehberi (İlk Kez Gelenler İçin)"
        },
        slug: "istanbulda-nerede-kalinir-bolge-bolge-base-secim-rehberi",
        slug_en: "where-to-stay-in-istanbul-area-selection-guide",
        content: { tr: htmlContent },
        location: { tr: "Istanbul" },
        cover_image_url: "/images/articles/istanbul_skyline_view.png",
        meta_description: {
            tr: "İstanbul'da ilk kez nerede kalınır? Sultanahmet, Karaköy, Taksim, Beşiktaş ve Kadıköy bölgelerinin detaylı, artı-eksi analizli, ulaşım odaklı konaklama rehberi.",
            en: ""
        },
        is_published: true,
        published_at: new Date().toISOString()
    };

    const { error, data } = await supabase.from('articles').upsert(newArticle, { onConflict: 'slug' }).select();
    if (error) {
        console.error("Failed to insert/update article:", error);
    } else {
        console.log("Success! Article inserted with slug:", data[0].slug);
    }
}
insertArticle1();
