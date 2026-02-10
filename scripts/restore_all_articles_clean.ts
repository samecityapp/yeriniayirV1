
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ARTICLES = [
    {
        slug: 'lost-property-in-turkey-what-to-do',
        title: 'Lost Property in Turkey: What to Do If You Leave Something in a Hotel, Taxi, or Airport',
        meta_description: 'Lost something in Turkey? Don’t panic. A calm, step-by-step guide for UK travellers on how to retrieve lost items from hotels, transfer vans, airports (Antalya, Dalaman, Bodrum), and taxis. Includes “copy-paste” messages to send and tips for police reports if needed.',
        clean_file: 'lost_items.html',
        images: {
            '{{IMAGE_COVER}}': '/images/articles/packing-souvenirs-suitcase-careful-authentic-1767990834291.jpg',
            '<!-- IMAGE_1_CHECKING_BAG -->': '/images/articles/airport-luggage-stack-family-travel-1767986408887.jpg',
            '<!-- IMAGE_2_ACCOMMODATION_HELP -->': '/images/articles/reception-check-in-questions-authentic-1767986640560.jpg',
            '<!-- IMAGE_3_PHONE_SECURITY -->': '/images/articles/emergency-number-112-on-phone-screen-1767987110935.jpg',
            '<!-- IMAGE_4_WALLET_BACKUP -->': '/images/articles/travel-wallet-organised-cards-cash-authentic-1767990541740.jpg',
            '<!-- IMAGE_5_PASSPORT_CHECK -->': '/images/articles/british-passport-travel-prep-authentic-1767987684522.jpg',
            '<!-- IMAGE_6_CALM_KIT -->': '/images/articles/travel-checklist-notebook-authentic-1767985612952.jpg'
        }
    },
    {
        slug: 'a-la-carte-restaurants-in-turkey-all-inclusive-how-it-works',
        title: 'A La Carte Restaurants in Turkey All-Inclusive Resorts: Is It Worth Paying Extra? (UK Guide)',
        meta_description: 'Confused by "A La Carte" rules in Turkey? This calm guide explains how hotel restaurant bookings work, the typical costs (and free options), dress codes, and why booking a special dinner date is usually the highlight of the week. Perfect for couples and families wanting a break from the buffet.',
        clean_file: 'alacarte.html',
        images: {
            '{{IMAGE_COVER}}': '/images/articles/alacarte_romantic_dinner_1770577127682.png',
            '{{IMAGE_ROMANTIC}}': '/images/articles/alacarte_romantic_dinner_1770577127682.png',
            '{{IMAGE_FAMILY}}': '/images/articles/alacarte_family_dinner_1770577141880.png',
            '{{IMAGE_ATMOSPHERE}}': '/images/articles/calm_restaurant_atmosphere_1770577199013.png',
            '{{IMAGE_RESERVATION}}': '/images/articles/guest_relations_reservation_1770577154600.png',
            '{{IMAGE_DRESS_CODE}}': '/images/articles/smart-casual-dinner-dress-code-authentic-1767987445923.jpg',
            '{{IMAGE_FOOD}}': '/images/articles/seafood_mezze_platter_1770577184232.png'
        }
    },
    {
        slug: 'how-to-get-the-best-all-inclusive-value-in-turkey-from-the-uk',
        title: 'How to Get the Best All-Inclusive Value in Turkey (From a UK Perspective)',
        meta_description: 'Want the best value for your Turkey holiday? It’s not just about the cheapest price. Learn how to spot the “sweet spot” dates (May/October), why “Ultra” All-Inclusive pays off for Brits, and how room choice affects your actual relaxation. A practical guide to booking smarter, not just cheaper.',
        clean_file: 'best_value.html',
        images: {
            '{{IMAGE_COVER}}': '/images/articles/best_value_season_collage_1770577412117.png',
            '{{IMAGE_SEASON_COLLAGE}}': '/images/articles/best_value_season_collage_1770577412117.png',
            '{{IMAGE_POOL_SHADE}}': '/images/articles/best_value_pool_shade_1770577441890.png',
            '{{IMAGE_SIMPLE_FOOD}}': '/images/articles/best_value_simple_food_1770577456641.png',
            '{{IMAGE_FAMILY_ROOM}}': '/images/articles/best_value_family_room_1770577427551.png',
            '{{IMAGE_EVENING_VIBE}}': '/images/articles/best_value_evening_vibe_1770577471298.png',
            '{{IMAGE_CHECK_TRANSFERS}}': '/images/articles/best_value_check_transfers_1770577486840.png'
        }
    },
    {
        slug: 'hospitals-and-clinics-in-turkey-for-tourists',
        title: 'Hospitals and Clinics in Turkey: A Calm Guide for UK Travellers (Insurance, EHIC, Quality)',
        meta_description: 'Medical worry? Here’s the reality of Turkish healthcare for tourists. It’s modern, efficient, and often faster than the NHS—if you have insurance. Learn the difference between private hospitals and state clinics, how the "provision" system works with insurance, and what to do if you feel unwell.',
        clean_file: 'hospitals.html',
        images: {
            '{{IMAGE_COVER}}': '/images/articles/modern-hospital-sign-turkey-authentic-1767989062717.jpg',
            '{{IMAGE_URGENT}}': '/images/articles/emergency-number-112-on-phone-screen-1767987110935.jpg',
            '{{IMAGE_CLINIC}}': '/images/articles/modern-hospital-sign-turkey-authentic-1767989062717.jpg',
            '{{IMAGE_DOCTOR}}': '/images/articles/pharmacist-consultation-friendly-turkey-1767991226342.jpg',
            '{{IMAGE_NOTES}}': '/images/articles/travel-insurance-policy-passport-authentic-1767989062717.jpg',
            '{{IMAGE_HOTEL_HELP}}': '/images/articles/eczane-pharmacy-sign-turkey-street-1767987110935.jpg',
            '{{IMAGE_HOSPITAL}}': '/images/articles/healthcare-in-turkey-for-tourists-guide-1-1769345698235.jpg'
        }
    },
    {
        slug: 'package-holiday-vs-booking-separately-for-turkey-uk-cost-comparison',
        title: 'Package Holiday vs Booking Separately for Turkey: The Honest UK Cost Comparison',
        meta_description: 'Should you book a TUI/Jet2 package or do it DIY with EasyJet/Pegasus? We break down the real costs, the stress factors, and the "protection" difference (ATOL). Find out which travel style actually suits your family best for a Turkey trip.',
        clean_file: 'package_vs_uk.html',
        images: {
            '{{IMAGE_COVER}}': '/images/articles/package-holiday-vs-booking-separately-turkey-uk-1-1769335088638.jpg',
            '{{IMAGE_POOL}}': '/images/articles/best_value_pool_shade_1770577441890.png',
            '{{IMAGE_TRANSFERS}}': '/images/articles/package-holiday-vs-booking-separately-turkey-uk-3-1769335174855.jpg',
            '{{IMAGE_FLEXIBILITY}}': '/images/articles/package-holiday-vs-booking-separately-turkey-uk-2-1769335158695.jpg',
            '{{IMAGE_VALUE}}': '/images/articles/best_value_simple_food_1770577456641.png',
            '{{IMAGE_LIST}}': '/images/articles/tablet-screen-booking-comparison-authentic-1767986408887.jpg'
        }
    },
    {
        slug: 'pharmacies-in-turkey-for-uk-travellers',
        title: 'Pharmacies in Turkey for UK Travellers: How to Get Common Medicines (Simple, Calm Guide)',
        meta_description: 'Need a pharmacy in Turkey as a UK traveller? This calm, practical guide explains how Turkish pharmacies (eczane) work, typical opening hours, how “on-duty” night pharmacies work, what you can usually buy, when you’ll need a Turkish prescription, and what to save on your phone. Includes checklists, copy-paste phrases, and FAQs.',
        clean_file: 'pharmacies.html',
        images: {
            '{{IMAGE_COVER}}': '/images/articles/eczane-pharmacy-sign-turkey-street-1767987110935.jpg',
            '{{IMAGE_SIGN}}': '/images/articles/eczane-pharmacy-street-sign-turkey-1767991226342.jpg',
            '{{IMAGE_DUTY_LIST}}': '/images/articles/nobetci-eczane-duty-pharmacy-list-on-window-1767987110935.jpg',
            '{{IMAGE_SHELVES}}': '/images/articles/pharmacy-counter-essentials-turkey-1767991226342.jpg',
            '{{IMAGE_PHARMACIST}}': '/images/articles/pharmacist-consultation-friendly-turkey-1767991226342.jpg',
            '{{IMAGE_EMERGENCY}}': '/images/articles/emergency-number-112-on-phone-screen-1767987110935.jpg'
        }
    },
    {
        slug: 'turkey-resort-transfers-guide',
        title: 'Resort Transfers in Turkey: Reliable Options and What to Avoid (UK-Friendly Guide)',
        meta_description: 'Arriving in Turkey? Compare private transfers, shared shuttles, and taxis from the UK. See reliable options, cost warnings, and how to avoid the "airport stress" trap.',
        clean_file: 'resort_transfers.html',
        images: {
            '{{IMAGE_COVER}}': '/images/articles/resort_transfers_map_app_1770577751586.png',
            '{{IMAGE_SIGN}}': '/images/articles/resort_transfers_airport_sign_1770577766437.png',
            '{{IMAGE_PRIVATE_VAN}}': '/images/articles/driver-loading-luggage-van-authentic-1767988483591.jpg',
            '{{IMAGE_SHUTTLE}}': '/images/articles/dalaman-airport-shuttle-1767122553343.jpg',
            '{{IMAGE_TAXI}}': '/images/articles/antalya-airport-taxi-rank-1767129109823.jpg',
            '{{IMAGE_ARRIVAL}}': '/images/articles/airport-arrival-hall-authentic-1767987684522.jpg'
        }
    },
    {
        slug: 'staying-well-in-turkey-food-water-heat-comfort-tips-uk-travellers',
        title: 'Staying Well in Turkey: Food, Water & Heat Comfort Tips for UK Travellers (No-Panic Guide)',
        meta_description: 'Want a smooth, healthy-feeling Turkey holiday from the UK? Use this calm comfort guide: food and drink habits that minimise stomach upsets, water choices that make sense, and heat/sun routines that keep you energised. Includes simple rules, packing lists, copy-paste questions, and FAQs (no scare stories).',
        clean_file: 'staying_well.html',
        images: {
            '{{IMAGE_COVER}}': '/images/articles/best_value_pool_shade_1770577441890.png',
            '{{IMAGE_BOTTLED_WATER}}': '/images/articles/turkey-hotel-glass-water-refill-authentic-1767906171028.jpg',
            '{{IMAGE_SHADED_RELAXATION}}': '/images/articles/best_value_pool_shade_1770577441890.png',
            '{{IMAGE_LIGHT_MEAL}}': '/images/articles/best_value_simple_food_1770577456641.png',
            '{{IMAGE_PHARMACY_HELP}}': '/images/articles/eczane-pharmacy-sign-turkey-street-1767987110935.jpg',
            '{{IMAGE_PACKING_ESSENTIALS}}': '/images/articles/travel-checklist-notebook-authentic-1767985612952.jpg',
            '{{IMAGE_NO_STRESS_CHECKLIST}}': '/images/articles/relaxed-traveller-by-pool-no-stress-1767986640560.jpg'
        }
    },
    {
        slug: 'travel-insurance-turkey-uk-guide',
        title: 'Travel Insurance for Turkey from the UK: What to Check (Medical, Activities, All-Inclusive)',
        meta_description: 'Heading to Turkey from the UK? This calm, practical guide shows what to check in your travel insurance before you go: emergency medical cover, repatriation, cancellations, baggage, activities, all-inclusive “extras”, and how to keep claims smooth. Includes checklists, copy-paste questions, and FAQs.',
        clean_file: 'travel_insurance.html',
        images: {
            '{{IMAGE_COVER}}': '/images/articles/travel-insurance-policy-passport-authentic-1767989062717.jpg',
            '{{IMAGE_MEDICAL}}': '/images/articles/modern-hospital-sign-turkey-authentic-1767989062717.jpg',
            '{{IMAGE_BAGGAGE}}': '/images/articles/airport-luggage-stack-family-travel-1767986408887.jpg',
            '{{IMAGE_ACTIVITIES}}': '/images/articles/water-sports-rental-beach-turkey-1767986132245.jpg',
            '{{IMAGE_EMERGENCY}}': '/images/articles/emergency-number-112-on-phone-screen-1767987110935.jpg',
            '{{IMAGE_CHECKLIST}}': '/images/articles/travel-checklist-notebook-authentic-1767985612952.jpg'
        }
    }
];

async function restoreArticles() {
    console.log("🚀 Starting Master Content Restoration...");
    const cleanContentDir = path.join(process.cwd(), 'scripts', 'clean_content');
    let successCount = 0;
    let failCount = 0;

    for (const article of ARTICLES) {
        console.log(`\n---------------------------------------`);
        console.log(`🔷 Processing: ${article.slug}`);

        try {
            const filePath = path.join(cleanContentDir, article.clean_file);
            if (!fs.existsSync(filePath)) throw new Error(`Clean content file not found: ${filePath}`);
            let content = fs.readFileSync(filePath, 'utf-8');
            let injectedCount = 0;

            for (const [placeholder, imageUrl] of Object.entries(article.images)) {
                if (placeholder === '{{IMAGE_COVER}}') continue;

                // Allow replacing HTML comments OR standard placeholders
                if (content.includes(placeholder)) {
                    const imgTag = `<img src="${imageUrl}" alt="${article.title}" class="w-full h-auto rounded-lg my-6 shadow-md" />`;
                    content = content.replace(placeholder, imgTag);
                    injectedCount++;
                }
            }

            const dbPayload = {
                slug: article.slug,
                title: { en: article.title, tr: `${article.title.substring(0, 50)}... (TR Pasif)` },
                meta_description: { en: article.meta_description, tr: "TR Pasif içerik." },
                content: { en: content, tr: "<p>Bu içerik sadece İngilizce dilinde yayındadır.</p>" },
                cover_image_url: article.images['{{IMAGE_COVER}}'],
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase.from('articles').upsert(dbPayload, { onConflict: 'slug' });

            if (error) {
                console.error(`❌ DB Upsert Failed for ${article.slug}:`, error.message);
                failCount++;
            } else {
                console.log(`✅ Success! Updated ${article.slug}`);
                console.log(`   - Injected ${injectedCount} inline images.`);
                successCount++;
            }

        } catch (err) {
            console.error(`❌ Fatal Error for ${article.slug}:`, err);
            failCount++;
        }
    }
    console.log(`\n🎉 RESTORATION COMPLETE: ${successCount} Success, ${failCount} Failed`);
}

restoreArticles();
