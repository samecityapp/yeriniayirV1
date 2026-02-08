
// @ts-nocheck
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const LOCATIONS = [
    "Samos, Yunanistan", "Samos, Greece",
    "Patmos, Yunanistan", "Patmos, Greece",
    "Kos, Yunanistan", "Kos, Greece",
    "Rodos, Yunanistan", "Rodos, Greece",
    "Leros, Yunanistan", "Leros, Greece",
    "Meis Adası, Yunanistan", "Meis Adası, Greece",
    "Simi, Yunanistan", "Simi, Greece",
    "Sakız, Yunanistan", "Sakız, Greece",
    "Midilli, Yunanistan", "Midilli, Greece",
    "Thassos, Yunanistan", "Thassos, Greece",
];

// 4 Unique Images per Category - FINAL MIX (7 AI Images + Pexels)
const IMAGE_POOLS = {
    breakfast: [
        "/restaurants/greek_breakfast_platter.png", // AI Generated
        "/restaurants/greek_yogurt_honey.png", // AI Generated
        "/restaurants/greek_breakfast_view.png", // AI Generated
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop"  // Authentic Greek
    ],
    coffee: [
        "/restaurants/freddo_espresso.png", // AI Generated
        "/restaurants/greek_coffee_briki.png", // AI Generated
        "/restaurants/frappe_beach.png", // AI Generated
        "https://images.unsplash.com/photo-1544145945-8c6e2646d5f7?q=80&w=2070&auto=format&fit=crop"  // Espresso Deep Blue
    ],
    pizza: [
        "/restaurants/rustic_pizza_fire.png", // AI Generated
        "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",   // Classic Neapolitan
        "https://images.pexels.com/photos/34425637/pexels-photo-34425637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Arugula Garlic
        "https://images.pexels.com/photos/33593000/pexels-photo-33593000.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"  // Gourmet Veggie
    ],
    seafood: [
        "https://images.pexels.com/photos/5696510/pexels-photo-5696510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Grilled Octopus (Pexels)
        "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",   // Seafood Platter (Pexels)
        "https://images.pexels.com/photos/1247677/pexels-photo-1247677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Fresh Fish (Pexels)
        "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"   // Dining by Sea (Pexels)
    ],
    burger: [
        "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Gourmet Burger (Pexels)
        "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Classic Cheeseburger (Pexels)
        "https://images.pexels.com/photos/580612/pexels-photo-580612.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  // Burger & Fries (Pexels)
        "https://images.pexels.com/photos/2987564/pexels-photo-2987564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"  // Juicy Burger (Pexels)
    ]
};

const TEMPLATES = {
    breakfast: [
        {
            name: (loc) => ({ tr: `${loc.split(',')[0]} Breakfast Club`, en: `${loc.split(',')[0]} Breakfast Club` }),
            description: { tr: "Ege denizi manzaralı, zengin içerikli geleneksel Yunan kahvaltısı.", en: "Traditional Greek breakfast with rich content and Aegean sea view." },
            orderSuggestion: { tr: "Yunan Omleti", en: "Greek Omelette" },
            googleRating: 4.8, reviewCount: "1.2k",
            notes: [
                { emoji: "🥞", text: { tr: "Pancakeleri çok meşhur, mutlaka deneyin.", en: "Their pancakes are famous, a must-try." } },
                { emoji: "🌅", text: { tr: "Deniz kenarı masalar için erken gitmekte fayda var.", en: "It's better to go early for seaside tables." } },
                { emoji: "☕", text: { tr: "Sınırsız filtre kahve ikramı var.", en: "Unlimited filter coffee is served." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Sunny Mornings ${loc.split(',')[0]}`, en: `Sunny Mornings ${loc.split(',')[0]}` }),
            description: { tr: "Limon ağaçları altında, huzurlu ve organik bir kahvaltı.", en: "A peaceful and organic breakfast experience under lemon trees." },
            orderSuggestion: { tr: "Pancake", en: "Pancakes" },
            googleRating: 4.6, reviewCount: "850",
            notes: [
                { emoji: "🍋", text: { tr: "Bahçedeki limonlardan yapılan ev yapımı limonata harika.", en: "Homemade lemonade made from garden lemons is amazing." } },
                { emoji: "🌿", text: { tr: "Tamamen organik ürünler kullanılıyor.", en: "Completely organic products are used." } },
                { emoji: "🐈", text: { tr: "Bahçede sevimli kediler size eşlik edebilir.", en: "Cute cats in the garden might join you." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Blue View Cafe`, en: `Blue View Cafe` }),
            description: { tr: "Denizin hemen kenarında, dalga sesleri eşliğinde kahvaltı.", en: "Breakfast right by the sea, accompanied by the sound of waves." },
            orderSuggestion: { tr: "Serpme Kahvaltı", en: "Mixed Breakfast" },
            googleRating: 4.7, reviewCount: "2.1k",
            notes: [
                { emoji: "🌊", text: { tr: "Dalga sesleri eşliğinde huzurlu bir sabah.", en: "A peaceful morning accompanied by the sound of waves." } },
                { emoji: "📸", text: { tr: "Manzara fotoğraf çekimi için mükemmel.", en: "The view is perfect for photos." } },
                { emoji: "🥐", text: { tr: "Taze kruvasanları çok hızlı tükeniyor.", en: "Fresh croissants run out very fast." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Grandma's Kitchen`, en: `Grandma's Kitchen` }),
            description: { tr: "Geleneksel tariflerle hazırlanan, sıcak ve samimi.", en: "Warm and friendly, prepared with traditional recipes." },
            orderSuggestion: { tr: "Ev Yapımı Börek", en: "Homemade Pie" },
            googleRating: 4.9, reviewCount: "500",
            notes: [
                { emoji: "👵", text: { tr: "Gerçek bir büyükanne tarifi ile yapılan reçeller.", en: "Jams made with a real grandmother's recipe." } },
                { emoji: "🥧", text: { tr: "Ispanaklı böreği efsane.", en: "The spinach pie is legendary." } },
                { emoji: "❤️", text: { tr: "Çok samimi ve sıcak bir aile işletmesi.", en: "A very friendly and warm family business." } }
            ]
        }
    ],
    coffee: [
        {
            name: (loc) => ({ tr: `${loc.split(',')[0]} Coffee Roasters`, en: `${loc.split(',')[0]} Coffee Roasters` }),
            description: { tr: "Adanın en iyi 3. dalga kahvecisi.", en: "Best 3rd wave coffee shop on the island." },
            orderSuggestion: { tr: "Freddo Espresso", en: "Freddo Espresso" },
            googleRating: 4.7, reviewCount: "950",
            notes: [
                { emoji: "☕", text: { tr: "Kendi kavurdukları çekirdekleri satın alabilirsiniz.", en: "You can buy beans they roast themselves." } },
                { emoji: "💻", text: { tr: "Uzaktan çalışanlar için hızlı Wi-Fi mevcut.", en: "Fast Wi-Fi available for remote workers." } },
                { emoji: "🧊", text: { tr: "Soğuk kahveleri adanın en iyisi.", en: "Their cold coffees are the best on the island." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Traditional Greek Cafe`, en: `Traditional Greek Cafe` }),
            description: { tr: "Limanda, tekneleri izleyerek kahvenizi yudumlayabileceğiniz geleneksel bir mekan.", en: "A traditional place where you can sip your coffee watching the boats." },
            orderSuggestion: { tr: "Yunan Kahvesi", en: "Greek Coffee" },
            googleRating: 4.5, reviewCount: "1.5k",
            notes: [
                { emoji: "🇬🇷", text: { tr: "Geleneksel sunum ve lokum ikramı.", en: "Traditional presentation and Turkish delight treat." } },
                { emoji: "⛵", text: { tr: "Liman manzarası çok dinlendirici.", en: "The harbor view is very relaxing." } },
                { emoji: "👴", text: { tr: "Yerel halkın da uğrak noktası.", en: "A frequent spot for locals too." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Sunset Lounge`, en: `Sunset Lounge` }),
            description: { tr: "Gün batımını izlemek için en iyi nokta.", en: "Best spot to watch the sunset." },
            orderSuggestion: { tr: "Frappe", en: "Frappe" },
            googleRating: 4.8, reviewCount: "3k",
            notes: [
                { emoji: "🌅", text: { tr: "Gün batımından 1 saat önce yerinizi alın.", en: "Take your seat 1 hour before sunset." } },
                { emoji: "🍹", text: { tr: "Kahve dışında kokteylleri de başarılı.", en: "Cocktails are also good besides coffee." } },
                { emoji: "🎶", text: { tr: "Akşamları chill müzikler çalıyor.", en: "Chill music plays in the evenings." } }
            ]
        },
        {
            name: (loc) => ({ tr: `The Old Bakery`, en: `The Old Bakery` }),
            description: { tr: "Eski bir fırından dönüştürülmüş, nostaljik atmosferli kafe.", en: "A nostalgic cafe converted from an old bakery." },
            orderSuggestion: { tr: "Cappuccino", en: "Cappuccino" },
            googleRating: 4.6, reviewCount: "700",
            notes: [
                { emoji: "🍞", text: { tr: "Tarihi taş fırın hala içeride duruyor.", en: "The historic stone oven represents inside." } },
                { emoji: "🍪", text: { tr: "Taze kurabiyeleri kahveyle harika gidiyor.", en: "Fresh cookies go great with coffee." } },
                { emoji: "🕯️", text: { tr: "İçerisi çok otantik ve loş.", en: "Inside is very authentic and dim." } }
            ]
        }
    ],
    pizza: [
        {
            name: (loc) => ({ tr: `Pizzeria Gusto`, en: `Pizzeria Gusto` }),
            description: { tr: "Odun ateşinde gerçek Napoli pizzası.", en: "Real Neapolitan pizza from wood fire." },
            orderSuggestion: { tr: "Margherita", en: "Margherita" },
            googleRating: 4.7, reviewCount: "1.1k",
            notes: [
                { emoji: "🍕", text: { tr: "Hamuru 48 saat mayalanıyor, çok hafif.", en: "Dough ferments for 48 hours, very light." } },
                { emoji: "🔥", text: { tr: "Gerçek odun ateşi lezzeti.", en: "Real wood fire taste." } },
                { emoji: "🇮🇹", text: { tr: "Malzemeler İtalya'dan geliyor.", en: "Ingredients come from Italy." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Olive Wood Pizza`, en: `Olive Wood Pizza` }),
            description: { tr: "Zeytin ağaçları arasında, rustik ortamda pizza keyfi.", en: "Pizza enjoyment in a rustic setting among olive trees." },
            orderSuggestion: { tr: "Prosciutto", en: "Prosciutto" },
            googleRating: 4.5, reviewCount: "800",
            notes: [
                { emoji: "🌳", text: { tr: "Zeytin ağaçlarının gölgesinde yemek keyfi.", en: "Dining pleasure in the shade of olive trees." } },
                { emoji: "🍷", text: { tr: "Ev yapımı şarapları pizzayla çok yakışıyor.", en: "Homemade wines go very well with pizza." } },
                { emoji: "🧀", text: { tr: "Yerel peynirler kullanılıyor.", en: "Local cheeses are used." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Port Pizza`, en: `Port Pizza` }),
            description: { tr: "Hızlı, lezzetli ve harika manzaralı.", en: "Fast, delicious and great view." },
            orderSuggestion: { tr: "Pepperoni", en: "Pepperoni" },
            googleRating: 4.3, reviewCount: "2.5k",
            notes: [
                { emoji: "⚡", text: { tr: "Servis çok hızlı.", en: "Service is very fast." } },
                { emoji: "👀", text: { tr: "Gelen geçeni izlemek için ideal konum.", en: "Ideal location for people watching." } },
                { emoji: "🥤", text: { tr: "Dilim pizza seçeneği de var.", en: "Slice pizza option available." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Mama Mia Trattoria`, en: `Mama Mia Trattoria` }),
            description: { tr: "Sadece pizza değil, ev yapımı makarnalarıyla da ünlü.", en: "Famous not only for pizza but also for homemade pasta." },
            orderSuggestion: { tr: "Quattro Formaggi", en: "Quattro Formaggi" },
            googleRating: 4.6, reviewCount: "1.8k",
            notes: [
                { emoji: "🍝", text: { tr: "Pizzalar kadar makarnalar da iddialı.", en: "Pastas are as ambitious as pizzas." } },
                { emoji: "👨‍👩‍👧‍👦", text: { tr: "Çocuklu aileler için uygun.", en: "Suitable for families with children." } },
                { emoji: "🍮", text: { tr: "Tiramisu yemeden kalkmayın.", en: "Don't leave without eating Tiramisu." } }
            ]
        }
    ],
    seafood: [
        {
            name: (loc) => ({ tr: `${loc.split(',')[0]} Fish Tavern`, en: `${loc.split(',')[0]} Fish Tavern` }),
            description: { tr: "Günlük taze balıklar ve ahtapot ızgara.", en: "Daily fresh fish and grilled octopus." },
            orderSuggestion: { tr: "Ahtapot Izgara", en: "Grilled Octopus" },
            googleRating: 4.8, reviewCount: "3.5k",
            notes: [
                { emoji: "🐙", text: { tr: "Ahtapotu güneşte kurutup ızgara yapıyorlar.", en: "They dry the octopus in the sun and grill it." } },
                { emoji: "🌅", text: { tr: "Gün batımında rezervasyon şart.", en: "Reservation required at sunset." } },
                { emoji: "🐟", text: { tr: "Günün balığını mutlaka sorun.", en: "Make sure to ask for the catch of the day." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Captain's Table`, en: `Captain's Table` }),
            description: { tr: "Denizin üzerinde, iskelede yemek deneyimi.", en: "Dining experience on the pier, over the sea." },
            orderSuggestion: { tr: "Deniz Mahsüllü Makarna", en: "Seafood Pasta" },
            googleRating: 4.6, reviewCount: "2.2k",
            notes: [
                { emoji: "⚓", text: { tr: "Denizin tam üzerinde masalar.", en: "Tables right over the sea." } },
                { emoji: "🦐", text: { tr: "Karidesli makarnası çok meşhur.", en: "Shrimp pasta is very famous." } },
                { emoji: "🥂", text: { tr: "Romantik akşam yemeği için ideal.", en: "Ideal for romantic dinner." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Blue Lagoon Restaurant`, en: `Blue Lagoon Restaurant` }),
            description: { tr: "Turkuaz sulara karşı, taze mezeler ve balık keyfi.", en: "Fresh mezes and fish enjoyment against turquoise waters." },
            orderSuggestion: { tr: "Kalamar", en: "Calamari" },
            googleRating: 4.5, reviewCount: "1.9k",
            notes: [
                { emoji: "🦑", text: { tr: "Kalamar tava çıtır çıtır, yağ çekmemiş.", en: "Fried calamari is crispy, not oily." } },
                { emoji: "🥗", text: { tr: "Meze tepsisinden seçerek sipariş verin.", en: "Order by choosing from the appetizer try." } },
                { emoji: "🌊", text: { tr: "Denize girmek için iskeleleri de var.", en: "They also have a pier for swimming." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Sunset Fish`, en: `Sunset Fish` }),
            description: { tr: "Güneşi denize batırırken taze balık yemek için en iyi adres.", en: "Best address to eat fresh fish while sunset." },
            orderSuggestion: { tr: "Levrek", en: "Sea Bass" },
            googleRating: 4.7, reviewCount: "1.4k",
            notes: [
                { emoji: "📸", text: { tr: "Fotoğraf makinelerinizi hazırlayın.", en: "Get your cameras ready." } },
                { emoji: "🍋", text: { tr: "Balıklar kömür ateşinde pişiyor.", en: "Fish are cooked on charcoal fire." } },
                { emoji: "🍷", text: { tr: "Yerel beyaz şarapları çok iyi.", en: "Local white wines are very good." } }
            ]
        }
    ],
    burger: [
        {
            name: (loc) => ({ tr: `Burger House ${loc.split(',')[0]}`, en: `Burger House ${loc.split(',')[0]}` }),
            description: { tr: "Adanın en iyi burgeri. %100 dana eti.", en: "Best burger on the island. 100% beef." },
            orderSuggestion: { tr: "Cheeseburger", en: "Cheeseburger" },
            googleRating: 4.6, reviewCount: "2k",
            notes: [
                { emoji: "🍔", text: { tr: "Köfteler günlük hazırlanıyor.", en: "Patties are prepared daily." } },
                { emoji: "🍟", text: { tr: "Patates kızartması baharatlı ve çok lezzetli.", en: "French fries are spicy and very delicious." } },
                { emoji: "🥤", text: { tr: "Milkshake ile denemelisiniz.", en: "You must try with milkshake." } }
            ]
        },
        {
            name: (loc) => ({ tr: `The Joint`, en: `The Joint` }),
            description: { tr: "Sokak lezzetleri konseptli, modern ve hızlı.", en: "Street food concept, modern and fast." },
            orderSuggestion: { tr: "Truffle Burger", en: "Truffle Burger" },
            googleRating: 4.5, reviewCount: "1.2k",
            notes: [
                { emoji: "🍄", text: { tr: "Trüf mantarlı sosları efsane.", en: "Truffle mushroom sauces are legendary." } },
                { emoji: "🍺", text: { tr: "Geniş bir bira menüsü var.", en: "Has a wide beer menu." } },
                { emoji: "🎵", text: { tr: "Müzikler ve ortam çok enerjik.", en: "Music and atmosphere are very energetic." } }
            ]
        },
        {
            name: (loc) => ({ tr: `Smokey Grill`, en: `Smokey Grill` }),
            description: { tr: "Füme etler ve barbekü soslu burgerler.", en: "Smoked meats and BBQ sauce burgers." },
            orderSuggestion: { tr: "BBQ Burger", en: "BBQ Burger" },
            googleRating: 4.4, reviewCount: "900",
            notes: [
                { emoji: "🔥", text: { tr: "Füme et sevenler için cennet.", en: "Heaven for smoked meat lovers." } },
                { emoji: "🧅", text: { tr: "Karamelize soğanları çok iyi.", en: "Caramelized onions are very good." } },
                { emoji: "🧤", text: { tr: "Elle yemek serbest!", en: "Eating with hands is allowed!" } }
            ]
        },
        {
            name: (loc) => ({ tr: `Beach Burger`, en: `Beach Burger` }),
            description: { tr: "Plajın hemen yanında rahat bir yer.", en: "A relaxed place right next to the beach." },
            orderSuggestion: { tr: "Classic Burger", en: "Classic Burger" },
            googleRating: 4.3, reviewCount: "1.5k",
            notes: [
                { emoji: "🏖️", text: { tr: "Denizden çıkıp burger yemek paha biçilemez.", en: "Eating burger after swimming is priceless." } },
                { emoji: "👙", text: { tr: "Mayo ve terlikle rahatça oturabilirsiniz.", en: "You can sit comfortably with swimwear and flip flops." } },
                { emoji: "🍹", text: { tr: "Soğuk içecek servisi hızlı.", en: "Cold drink service is fast." } }
            ]
        }
    ]
};

async function populateData() {
    console.log('Starting FINAL population with AI images (Mixed Source)...');

    // 1. CLEAR EXISTING DATA
    const { error: deleteError } = await supabase
        .from('restaurants')
        .delete()
        .in('location', LOCATIONS);

    if (deleteError) {
        console.error('Error clearing old data:', deleteError);
        return;
    }
    console.log('Cleared existing data for Greek locations.');

    // 2. Get Categories
    const { data: categories } = await supabase.from('restaurant_categories').select('*');
    const categoryIds = {};
    categories?.forEach(c => {
        if (c.title.en.includes("Breakfast")) categoryIds.breakfast = c.id;
        if (c.title.en.includes("Coffee")) categoryIds.coffee = c.id;
        if (c.title.en.includes("Pizza")) categoryIds.pizza = c.id;
        if (c.title.en.includes("Seafood")) categoryIds.seafood = c.id;
        if (c.title.en.includes("Burger")) categoryIds.burger = c.id;
    });

    // 3. Insert Restaurants
    for (const location of LOCATIONS) {
        console.log(`Processing location: ${location}`);

        for (const [catKey, catItems] of Object.entries(TEMPLATES)) {
            const categoryId = categoryIds[catKey];
            if (!categoryId) continue;

            const images = IMAGE_POOLS[catKey];

            for (let i = 0; i < catItems.length; i++) {
                const item = catItems[i];
                const name = item.name(location);

                // Use image at index i
                const imageUrl = images[i];

                const { data: restaurant, error: rError } = await supabase
                    .from('restaurants')
                    .insert({
                        category_id: categoryId,
                        location: location,
                        name: name,
                        image_url: imageUrl,
                        description: item.description,
                        google_rating: item.googleRating,
                        review_count: item.reviewCount,
                        order_suggestion: item.orderSuggestion,
                        display_order: i + 1
                    })
                    .select()
                    .single();

                if (rError) {
                    console.error(`Error inserting ${name.en}:`, rError);
                    continue; // Skip notes if restaurant insertion failed
                }

                // Insert Notes
                if (item.notes && item.notes.length > 0) {
                    const notesToInsert = item.notes.map((note, index) => ({
                        restaurant_id: restaurant.id,
                        emoji: note.emoji,
                        text: note.text,
                        display_order: index + 1
                    }));

                    const { error: nError } = await supabase
                        .from('restaurant_notes')
                        .insert(notesToInsert);

                    if (nError) {
                        console.error(`Error inserting notes for ${name.en}:`, nError);
                    }
                }
            }
        }
    }

    console.log('Final mixed AI population complete!');
}

populateData();
