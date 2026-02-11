
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TARGET_ARTICLES = [
    {
        slug: 'a-la-carte-all-inclusive-turkey',
        images: [
            '/images/articles/alacarte_romantic_dinner_1770577127682.png',
            '/images/articles/luxury-dining-couple-sunset-1767986408887.jpg',
            '/images/articles/gourmet-plate-fine-dining-turkey-1767986408887.jpg',
            '/images/articles/wine-tasting-vineyard-turkey-1767986408887.jpg',
            '/images/articles/chef-preparing-meal-open-kitchen-1767986408887.jpg',
            '/images/articles/couple-toasting-sunset-view-1767986408887.jpg'
        ]
    },
    {
        slug: 'best-all-inclusive-value-uk-turkey',
        images: [
            '/images/articles/best_value_season_collage_1770577412117.png',
            '/images/articles/family-pool-fun-water-slide-1767986408887.jpg',
            '/images/articles/buffet-spread-all-inclusive-1767986408887.jpg',
            '/images/articles/kids-club-activities-painting-1767986408887.jpg',
            '/images/articles/beach-volleyball-game-active-1767986408887.jpg',
            '/images/articles/evening-entertainment-show-stage-1767986408887.jpg'
        ]
    },
    {
        slug: 'hospitals-and-clinics-in-turkey-for-uk-travellers-guide',
        images: [
            '/images/articles/emergency-number-112-on-phone-screen-1767987110935.jpg',
            '/images/articles/modern-hospital-building-exterior-1767987110935.jpg',
            '/images/articles/doctor-consultation-patient-friendly-1767987110935.jpg',
            '/images/articles/pharmacy-sign-green-cross-1767987110935.jpg',
            '/images/articles/ambulance-emergency-service-vehicle-1767987110935.jpg',
            '/images/articles/travel-insurance-document-review-1767987110935.jpg'
        ]
    },
    {
        slug: 'lost-passport-phone-wallet-turkey-uk-traveller-guide',
        images: [
            '/images/articles/reception-check-in-questions-authentic-1767986640560.jpg',
            '/images/articles/tourist-checking-phone-banking-app-authentic-1767990201789.jpg',
            '/images/articles/british-passport-travel-prep-authentic-1767987684522.jpg',
            '/images/articles/travel-wallet-organised-cards-cash-authentic-1767990541740.jpg',
            '/images/articles/police-station-exterior-friendly-1767987110935.jpg',
            '/images/articles/hotel-lobby-waiting-calm-1767986640560.jpg'
        ]
    },
    {
        slug: 'package-holiday-vs-booking-separately-turkey-uk-cost-comparison',
        images: [
            '/images/articles/package-vs-diy-travel-planning-uk-1767986408887.jpg',
            '/images/articles/laptop-flight-booking-screen-1767986408887.jpg',
            '/images/articles/travel-agency-brochures-desk-1767986408887.jpg',
            '/images/articles/airport-transfer-bus-shuttle-1767986408887.jpg',
            '/images/articles/villa-rental-pool-view-1767986408887.jpg',
            '/images/articles/calculator-travel-budget-planning-1767986408887.jpg'
        ]
    },
    {
        slug: 'pharmacies-in-turkey-for-uk-travellers',
        images: [
            '/images/articles/eczane-pharmacy-sign-turkey-street-1767987110935.jpg',
            '/images/articles/pharmacist-helping-customer-counter-1767987110935.jpg',
            '/images/articles/medicine-shelf-sunscreen-vitamins-1767987110935.jpg',
            '/images/articles/travel-first-aid-kit-contents-1767987110935.jpg',
            '/images/articles/prescription-paper-doctor-hand-1767987110935.jpg',
            '/images/articles/water-bottle-pills-stay-healthy-1767987110935.jpg'
        ]
    },
    {
        slug: 'turkey-resort-transfers-guide',
        images: [
            '/images/articles/resort_transfers_map_app_1770577751586.png',
            '/images/articles/private-transfer-van-interior-luxury-1767986408887.jpg',
            '/images/articles/airport-exit-driver-sign-waiting-1767986408887.jpg',
            '/images/articles/shuttle-bus-sharing-tourists-1767986408887.jpg',
            '/images/articles/taxi-rank-airport-queue-1767986408887.jpg',
            '/images/articles/family-loading-luggage-car-boot-1767986408887.jpg'
        ]
    },
    {
        slug: 'staying-well-in-turkey-food-water-heat-comfort-tips-uk-travellers',
        images: [
            '/images/articles/best_value_pool_shade_1770577441890.png',
            '/images/articles/fresh-fruit-market-stall-turkey-1767986408887.jpg',
            '/images/articles/water-bottle-beach-sun-hat-1767987110935.jpg',
            '/images/articles/grilled-vegetables-healthy-meal-1767986408887.jpg',
            '/images/articles/tourist-drinking-tea-cafe-shade-1767986640560.jpg',
            '/images/articles/sunscreen-application-poolside-1767987110935.jpg'
        ]
    },
    {
        slug: 'travel-insurance-turkey-uk-guide',
        images: [
            '/images/articles/travel-insurance-policy-passport-authentic-1767989062717.jpg',
            '/images/articles/hospital-reception-desk-paperwork-1767987110935.jpg',
            '/images/articles/flight-delay-board-airport-1767986408887.jpg',
            '/images/articles/dropped-camera-broken-concept-1767986408887.jpg',
            '/images/articles/activity-paragliding-adventure-risk-1767986408887.jpg',
            '/images/articles/phone-call-insurance-support-1767990201789.jpg'
        ]
    }
];

const FALLBACK_IMAGE = '/images/articles/turkey_holiday_generic_1767986408887.jpg';

async function run() {
    console.log("🧹 Starting Content Cleanup (Master Fix V2)...");

    for (const item of TARGET_ARTICLES) {
        // 1. Fetch
        const { data: article } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', item.slug)
            .single();

        if (!article) continue;

        console.log(`🔨 Processing ${item.slug}...`);

        let content = typeof article.content === 'string' ? article.content : (article.content as any).en || "";

        // 2. FORCE CLEANUP (Remove artifacts)
        content = content.replace(/\\/g, '');
        content = content.replace(/\\n/g, ' ');
        content = content.replace(/<img[^>]*>/g, '');
        content = content.replace(/<figure[^>]*>.*?<\/figure>/gs, '');

        // 3. RE-INJECT
        const parts = content.split('</p>');
        let newContent = "";

        const imagesToInject = item.images.slice(1);
        const totalImages = imagesToInject.length;
        const interval = Math.max(3, Math.floor(parts.length / (totalImages + 2)));

        let injected = 0;

        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            part = part.trim();
            if (part === '') continue;

            newContent += part + '</p>\n\n';

            if (injected < totalImages && (i + 1) % interval === 0) {
                const imgUrl = imagesToInject[injected];
                const altText = `${article.title} - Image ${injected + 2}`;
                const imgBlock = `
<figure class="my-8">
<img src="${imgUrl}" alt="${altText}" class="w-full h-auto rounded-xl shadow-lg" loading="lazy" onError="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
</figure>
`;
                newContent += imgBlock;
                injected++;
            }
        }

        while (injected < totalImages) {
            const imgUrl = imagesToInject[injected];
            const altText = `${article.title} - Extra Image ${injected + 2}`;
            const imgBlock = `
<figure class="my-8">
<img src="${imgUrl}" alt="${altText}" class="w-full h-auto rounded-xl shadow-lg" loading="lazy" onError="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
</figure>
`;
            newContent += imgBlock;
            injected++;
        }

        // 4. Update
        // Trying STRING UPDATE since the user saw artifacts, implying String was stored.
        // If we save Object, maybe it restores Object structure?
        // But if I want to be safe, I should just save String if that persists.
        // Let's try OBJECT again, but log return data.

        const updatePayload = {
            en: newContent,
            tr: "<p>Content available in English only.</p>"
        };

        const { error, data } = await supabase
            .from('articles')
            .update({
                content: updatePayload,
                updated_at: new Date().toISOString()
            })
            .eq('id', article.id)
            .select();

        if (error) {
            console.error(`❌ Failed Update:`, error);
        } else {
            console.log(`✨ Sent Update.`);
            // DEBUG LOG RAW RETURN
            // console.log("Returned Data:", JSON.stringify(data));

            // Immediate verify from FRESH select
            const { data: verifyData } = await supabase
                .from('articles')
                .select('content')
                .eq('id', article.id)
                .single();

            const vContent = typeof verifyData?.content === 'string' ? verifyData.content : (verifyData?.content as any)?.en || "";
            const c = (vContent.match(/<img/g) || []).length;
            console.log(`   -> Verify (Fresh Select): ${c} images found.`);

            if (c < 5) {
                console.log("   ⚠️  Update failed to persist. Retrying as raw STRING...");

                // RETRY AS STRING
                const { error: err2 } = await supabase
                    .from('articles')
                    .update({
                        content: newContent, // JUST STRING
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', article.id);

                if (err2) console.error("   ❌ String update failed too:", err2);
                else console.log("   ✅ String update sent.");
            }
        }
    }
}

run();
