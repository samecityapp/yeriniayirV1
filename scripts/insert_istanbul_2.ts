import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertArticle2() {
    let htmlContent = fs.readFileSync(path.resolve(process.cwd(), '../data/drafts/istanbul_2.html'), 'utf-8');

    // Replace image placeholders
    htmlContent = htmlContent.replace('<!-- image_istanbul_3_days -->', '<img src="/images/articles/istanbul_3_days.png" alt="Galata Kulesi ve Canlı İstanbul Sokakları" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_istanbul_golden_horn -->', '<img src="/images/articles/istanbul_golden_horn.png" alt="Haliç Günbatımı Panoramik Manzara" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_grand_bazaar_vibes -->', '<img src="/images/articles/grand_bazaar_vibes.png" alt="Kapalıçarşı Rengarenk Otantik Dükkanlar" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_bosphorus_bridge_cruise -->', '<img src="/images/articles/bosphorus_bridge_cruise.png" alt="Boğaziçi Köprüsü Altından Geçen Turist Teknesi" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');
    htmlContent = htmlContent.replace('<!-- image_istiklal_street_tram -->', '<img src="/images/articles/istiklal_street_tram.png" alt="İstiklal Caddesi Nostaljik Kırmızı Tramvay" class="w-full h-auto rounded-2xl shadow-lg my-8 object-cover" />');

    const newArticle = {
        title: {
            en: "First Time in Istanbul: 3–5–7 Days Ready Itinerary",
            tr: "İstanbul’a İlk Kez Gelenler: 3–5–7 Günlük Hazır Rota (Yormayan Plan + Esnek Günler)"
        },
        slug: "istanbula-ilk-kez-gelenler-3-5-7-gunluk-hazir-rota",
        slug_en: "first-time-in-istanbul-3-5-7-days-ready-itinerary",
        content: { tr: htmlContent },
        location: { tr: "Istanbul" },
        cover_image_url: "/images/articles/istanbul_3_days.png",
        meta_description: {
            tr: "İstanbul'u yorulmadan ve kaybolmadan gezmek isteyenler için saat saat planlanmış, en verimli 3 günlük, 5 günlük ve 7 günlük hazır turistik gezi rotası.",
            en: ""
        },
        is_published: true,
        published_at: new Date().toISOString()
    };

    const { error, data } = await supabase.from('articles').upsert(newArticle, { onConflict: 'slug' }).select();
    if (error) {
        console.error("Failed to insert/update article:", error);
    } else {
        console.log("Success! Article 2 inserted with slug:", data[0].slug);
    }
}
insertArticle2();
