import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Load environment variables manually
const envPath = path.join(process.cwd(), '.env.local');
let envVars: Record<string, string> = {};

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envVars = envContent.split('\n').reduce((acc, line) => {
        // Ignore comments and empty lines
        if (line.startsWith('#') || !line.trim()) return acc;

        // Split by first equals sign
        const firstEquals = line.indexOf('=');
        if (firstEquals !== -1) {
            const key = line.substring(0, firstEquals).trim();
            let value = line.substring(firstEquals + 1).trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string>);
} catch (error) {
    console.warn('.env.local not found or unreadable, relying on process.env');
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const article = {
    id: crypto.randomUUID(),
    title: {
        en: "Samos Island Travel Guide: Where to Stay, What to Do, Best Beaches & Local Tips",
        tr: "Samos Adası Gezi Rehberi: Nerede Kalınır, Ne Yapılır & En İyi Plajlar"
    },
    slug: "samos-island-travel-guide",
    cover_image_url: "/images/articles/samos/samos-cover.png",
    meta_description: {
        en: "A comprehensive guide to Samos Island, Greece. Discover where to stay, best beaches like Tsamadou and Lemonakia, local food, and practical travel tips.",
        tr: "Yunanistan Samos Adası için kapsamlı rehber. Konaklama bölgeleri, Tsamadou ve Lemonakia gibi en iyi plajlar, yerel lezzetler ve pratik seyahat ipuçları."
    },
    location: "Samos",
    is_published: true,
    published_at: new Date().toISOString(),
    content: {
        en: `
    <p>Samos is a lush Greek island in the eastern Aegean, close to the Turkish coast, known for pine-covered mountains, clear coves, traditional villages, and a laid-back rhythm that feels authentically local. It’s the kind of place where you can spend the morning swimming in turquoise water, the afternoon hiking through shaded valleys, and the evening eating fresh seafood in a harbour town that still feels “real,” not staged for tourists.</p>
    
    <p>This guide is written for anyone planning a trip to Samos—first-timers, repeat visitors, couples, families, solo travellers, and island-hoppers. You’ll find practical advice on where to stay, the best things to do, beaches worth prioritising, local food to try, and sample itineraries you can copy-paste into your trip plan.</p>

    <h2>Quick Facts About Samos</h2>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Where it is:</strong> Eastern Aegean Sea, Greece (very close to Türkiye)</li>
      <li><strong>Main towns/areas:</strong> Samos Town (Vathy), Pythagoreio, Kokkari, Karlovasi</li>
      <li><strong>Landscape:</strong> Mountains + forests + beaches + valleys</li>
      <li><strong>Vibe:</strong> Relaxed, nature-forward, authentic, not overly “party”</li>
      <li><strong>Best for:</strong> Beaches, hiking, history, village life, calm island days</li>
    </ul>

    <div class="bg-blue-50 p-4 rounded-lg my-6 border-l-4 border-blue-500">
      <p><strong>How many days?</strong></p>
      <ul class="mt-2 list-disc pl-5">
        <li><strong>2–3 days:</strong> highlights + best beaches</li>
        <li><strong>4–5 days:</strong> comfortable pace + villages + hikes</li>
        <li><strong>7 days:</strong> slow travel + hidden coves + deeper exploration</li>
      </ul>
    </div>

    <h2>Best Time to Visit Samos</h2>
    <p>Samos is enjoyable from spring through autumn, but your “best” season depends on what you want.</p>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>April–May:</strong> Green landscapes, mild weather, quieter roads. Great for hiking, villages, and relaxed beach time (water can still be cool).</li>
      <li><strong>June:</strong> Warmer sea, longer days, still not peak crowded in many areas.</li>
      <li><strong>July–August:</strong> Hottest months with the busiest atmosphere. Expect higher prices and more people at the top beaches.</li>
      <li><strong>September:</strong> One of the best months—warm sea, fewer crowds, great evenings.</li>
      <li><strong>October:</strong> Still lovely for many travellers, especially early October; quieter, more local feel.</li>
    </ul>
    <p><em>If you want that “Samos is all mine” feeling, aim for late May, June, or September.</em></p>

    <h2>How to Get to Samos</h2>
    
    <h3>By air</h3>
    <p>Samos has an airport (often referred to as Samos International Airport). Flights vary by season, so it’s common to connect through Athens or Thessaloniki, especially outside peak months. In summer, more direct routes may appear depending on your departure city and airlines.</p>

    <h3>By ferry</h3>
    <p>Samos is well-connected by ferry routes from other parts of Greece, and it’s also popular as a crossing point from Türkiye via nearby coastal ports (routes and schedules are seasonal, so always check the latest timings).</p>
    <p><strong>Main ferry ports on Samos:</strong></p>
    <ul class="list-disc pl-5">
      <li>Vathy (Samos Town)</li>
      <li>Pythagoreio</li>
      <li>Karlovasi</li>
    </ul>
    <p>If you’re island-hopping, Karlovasi can be very convenient depending on your route.</p>

    <h2>Getting Around Samos: Car, Scooter, Taxi, Buses</h2>
    <p>Samos is mountainous and spread out. You can enjoy it without a car, but your options expand massively if you drive.</p>
    
    <div class="space-y-4 my-6">
      <div>
        <strong>Car rental (best overall)</strong>
        <p>If you want beaches like Potami, Tsamadou, Lemonakia, and village routes through the mountains, a car is the easiest way. Roads are generally fine, but you’ll find plenty of curves and elevation changes.</p>
      </div>
      <div>
        <strong>Scooter or ATV</strong>
        <p>Works well for confident riders, especially in warm months. Just be realistic: some roads are steep and windy.</p>
      </div>
      <div>
        <strong>Public buses</strong>
        <p>Useful for major towns and some popular spots, but not ideal if you want hidden coves and flexible plans.</p>
      </div>
      <div>
        <strong>Taxis</strong>
        <p>Good for short distances or nights out, but costs add up quickly if you rely on them for everything.</p>
      </div>
    </div>
    
    <p><strong>Practical rule:</strong> Staying in Pythagoreio, Kokkari, or Samos Town without a car is doable. If you want to “collect beaches,” book a car.</p>

    <h2>Where to Stay in Samos: Best Areas</h2>
    <img src="/images/articles/samos/pythagoreio.png" alt="Pythagoreio Harbour Evening" class="w-full h-auto rounded-xl shadow-lg my-8" />
    <p>Choosing where to stay on Samos is mostly about what kind of trip you want: scenic harbours, beach access, quiet villages, or a practical base.</p>

    <h3>Pythagoreio: Best for charm + harbour evenings</h3>
    <p>Pythagoreio is one of the most loved areas to stay. It has a beautiful harbour lined with tavernas, an easygoing vibe at night, and great access to historical sights like the Tunnel of Eupalinos and the Heraion of Samos.</p>
    <ul class="list-disc pl-5">
        <li>Walkable harbour town</li>
        <li>Restaurants and nightlife (calm, not wild)</li>
        <li>A scenic base for day trips</li>
        <li>A “classic Greek island” feel</li>
    </ul>

    <h3>Kokkari: Best for beaches + postcard scenery</h3>
    <p>Kokkari is compact, pretty, and very popular with travellers who want beach time and an attractive seaside setting. It’s close to excellent beaches like Tsamadou Beach and Lemonakia Beach.</p>
    <ul class="list-disc pl-5">
        <li>Swim-ready beaches nearby</li>
        <li>A small-town vibe with strong views</li>
        <li>Easy evenings: eat, stroll, repeat</li>
    </ul>

    <h3>Samos Town (Vathy): Best for practicality + local life</h3>
    <p>Samos Town (Vathy) feels more “working island” than resort town. It’s practical: shops, services, port connections, and a wider range of everyday choices.</p>
    <ul class="list-disc pl-5">
        <li>A more local, lived-in feel</li>
        <li>Easy access to transport and services</li>
        <li>A base that doesn’t feel tourist-only</li>
    </ul>

    <h3>Karlovasi: Best for nature + waterfalls access</h3>
    <p>Karlovasi is a solid base if you care most about nature and hikes, especially the route to Potami Waterfalls and the beaches around that area. It’s less “cute harbour town” and more functional, with a calm energy.</p>
    <ul class="list-disc pl-5">
        <li>Hiking and nature close by</li>
        <li>A quieter base</li>
        <li>Quick access to Potami area</li>
    </ul>

    <h3>Mountain villages (Manolates, Vourliotes): Best for quiet and views</h3>
    <p>If you want a slower pace, consider a village stay like Manolates or Vourliotes. These places offer cooler air, mountain views, and tavernas that feel like they’re for locals first.</p>
    <ul class="list-disc pl-5">
        <li>Silence at night, birds in the morning</li>
        <li>Cooler temperatures in summer</li>
        <li>Authentic village atmosphere</li>
    </ul>

    <h2>Top Things to Do in Samos</h2>
    <img src="/images/articles/samos/potami.png" alt="Potami Waterfalls Nature" class="w-full h-auto rounded-xl shadow-lg my-8" />
    
    <ol class="list-decimal pl-5 space-y-4">
      <li>
        <strong>Walk the harbour in Pythagoreio</strong>
        <p>Pythagoreio’s harbour is an evening ritual: sunset light, boats, relaxed dining, and that perfect “I’m on an island” feeling. It’s simple, but it’s a core Samos experience.</p>
      </li>
      <li>
        <strong>Visit the Tunnel of Eupalinos</strong>
        <p>The Tunnel of Eupalinos is one of Samos’ standout historical sites—an ancient engineering feat that’s genuinely interesting even if you’re not a history person. It’s one of those “how did they do this?” places.</p>
      </li>
      <li>
        <strong>See the Heraion of Samos (Temple of Hera)</strong>
        <p>The Heraion is a UNESCO-recognised archaeological area linked to Hera worship in ancient times. Even if you do a quick visit, it adds depth to your trip and helps you understand how significant Samos once was.</p>
      </li>
      <li>
        <strong>Go to Potami Waterfalls (near Karlovasi)</strong>
        <p>Potami Waterfalls are a favourite: a short adventure, a bit of walking, and a reward of cool water and green scenery. Wear proper shoes—rocks can be slippery. <em>Tip: Combine the waterfalls with Potami Beach on the same day.</em></p>
      </li>
      <li>
        <strong>Swim at Tsamadou and Lemonakia</strong>
        <p>These two beaches near Kokkari are often mentioned for good reason: clear water, beautiful setting, and a “wow” factor that feels very Aegean.</p>
      </li>
      <li>
        <strong>Drive through the mountains for villages and viewpoints</strong>
        <p>Samos has interior roads that deliver big scenery—pine forests, curves, and viewpoints that make you stop the car just to stare. Add a lunch stop in Manolates or Vourliotes for a full day.</p>
      </li>
      <li>
        <strong>Taste local Samos wine (with balance)</strong>
        <p>Samos is famous for wine—especially sweet styles made from Muscat grapes. If wine culture interests you, add a tasting experience to your plan, but keep it relaxed and responsible, especially if you’re driving.</p>
      </li>
    </ol>

    <h2>Best Beaches in Samos</h2>
    <img src="/images/articles/samos/kokkari.png" alt="Kokkari Beach View" class="w-full h-auto rounded-xl shadow-lg my-8" />
    
    <p>Samos has a mix of organised beaches (sunbeds, beach bars) and quieter coves where nature does the talking. Here are reliable favourites to build your beach list.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      <div>
        <strong>Tsamadou Beach (near Kokkari)</strong>
        <p>Clear water, dramatic landscape, and a vibe that feels “signature Samos.” Great for swimmers and anyone who loves that rocky-Aegean look.</p>
      </div>
      <div>
        <strong>Lemonakia Beach (near Kokkari)</strong>
        <p>Smaller and very scenic. Great for a half-day swim + chill, especially if you’re staying in Kokkari.</p>
      </div>
      <div>
        <strong>Potami Beach (near Karlovasi)</strong>
        <p>Wide, refreshing, and a great pairing with the waterfalls. The area feels more “nature beach” than “resort beach.”</p>
      </div>
      <div>
        <strong>Psili Ammos (south/east side)</strong>
        <p>Often recommended for its shallow water and family-friendly feel. It can get busy in high season, but it’s popular because it works well for many travellers.</p>
      </div>
    </div>
    
    <p><strong>Micro Seiti / Megalo Seiti (near Kokkari):</strong> If you like a slightly wilder beach feel, these are worth looking into. Conditions can vary, but the scenery is often excellent.</p>
    <p><em>Beach planning tip: Pick one “wow beach” per day, then add a flexible second option nearby. Samos rewards slow travel—don’t try to hit five beaches in one day.</em></p>

    <h2>What to Eat in Samos: Local Food to Try</h2>
    <img src="/images/articles/samos/wine.png" alt="Samos Wine and Food" class="w-full h-auto rounded-xl shadow-lg my-8" />
    <p>Samos is a strong food island—fresh ingredients, simple cooking, and excellent tavernas if you choose well.</p>
    
    <strong>Try these:</strong>
    <ul class="list-disc pl-5">
      <li>Fresh seafood (grilled fish, calamari, octopus)</li>
      <li>Greek salad done right (tomatoes that taste real, good olive oil)</li>
      <li>Saganaki (fried cheese)</li>
      <li>Gemista (stuffed vegetables, often in summer)</li>
      <li>Kleftiko (slow-cooked lamb, if available)</li>
      <li>Local cheeses and olives</li>
      <li>Samos wine (especially if you enjoy aromatic or sweet wines)</li>
    </ul>

    <p class="mt-4"><strong>How to spot a good taverna:</strong> Short menu, not 8 pages. Locals eating there. Seasonal dishes written on a board. Staff who don’t chase you with “special price my friend” energy.</p>

    <h2>Sample Itineraries for Samos</h2>
    
    <h3>2 Days in Samos (highlights)</h3>
    <ul class="list-disc pl-5">
      <li><strong>Day 1:</strong> Pythagoreio + history + beach. Morning harbour walk, Midday Tunnel of Eupalinos, Afternoon beach, Evening dinner in harbour.</li>
      <li><strong>Day 2:</strong> Kokkari + beaches. Morning Kokkari stroll + swim at Lemonakia, Afternoon Tsamadou Beach, Sunset scenic drive or dinner in Kokkari.</li>
    </ul>

    <h3>3 Days in Samos (balanced)</h3>
    <ul class="list-disc pl-5">
      <li><strong>Day 1:</strong> Pythagoreio + Tunnel of Eupalinos + harbour dinner</li>
      <li><strong>Day 2:</strong> Kokkari + Tsamadou + Lemonakia</li>
      <li><strong>Day 3:</strong> Karlovasi + Potami Waterfalls + Potami Beach</li>
    </ul>

    <h3>5 Days in Samos (slow and complete)</h3>
    <ul class="list-disc pl-5">
      <li><strong>Day 1:</strong> Arrive + settle in + evening stroll</li>
      <li><strong>Day 2:</strong> Pythagoreio + Heraion + relaxed swim</li>
      <li><strong>Day 3:</strong> Kokkari beaches day</li>
      <li><strong>Day 4:</strong> Mountain villages (Manolates / Vourliotes) + winery/tasting (optional)</li>
      <li><strong>Day 5:</strong> Karlovasi + Potami Waterfalls + last sunset dinner</li>
    </ul>
    
    <p><em>Kural: Uzak günlerden sonra “kolay gün” koy. Arabasız tatilin kalitesi burada yükseliyor.</em></p>

    <h2>Practical Tips for a Smooth Trip</h2>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Cash vs card:</strong> Cards are widely accepted, but keep some cash for small tavernas, remote spots, and quick purchases.</li>
      <li><strong>Driving notes:</strong> Expect curves and elevation. Drive slower at night on mountain roads. Don’t underestimate travel time.</li>
      <li><strong>What to pack:</strong> Reef shoes or sturdy sandals (rocky beaches), Sunscreen + hat, Light jacket for evenings.</li>
      <li><strong>Crowd strategy:</strong> In peak months, go to the most popular beaches earlier.</li>
    </ul>

    <h2>Samos FAQ</h2>
    <div class="space-y-4">
      <div>
        <strong>Is Samos good for families?</strong>
        <p>Yes. Beaches like Psili Ammos can be family-friendly, and towns like Pythagoreio and Kokkari are easy for evening strolls and simple routines.</p>
      </div>
      <div>
        <strong>Is Samos a party island?</strong>
        <p>Not really. You can find bars and lively nights in the main towns, but Samos is more about nature, tavernas, and relaxed evenings.</p>
      </div>
      <div>
        <strong>Do I need a car in Samos?</strong>
        <p>Not mandatory, but it’s the best way to explore beyond the main towns. If you want hidden coves, mountain villages, and flexible beach hopping, a car makes your trip much easier.</p>
      </div>
      <div>
        <strong>Which area is best to stay: Pythagoreio or Kokkari?</strong>
        <p>Pythagoreio for harbour charm and history. Kokkari for beach-forward vibes. Both are excellent choices.</p>
      </div>
      <div>
        <strong>How many days are enough for Samos?</strong>
        <p>3–5 days is a sweet spot. 2 days highlights only, 5 days is relaxed.</p>
      </div>
    </div>

    <h2>Final Thoughts: Why Samos Works So Well</h2>
    <p>Samos is a rare mix: genuinely beautiful beaches, real village life, and enough history to make the island feel meaningful—not just scenic. If you base yourself smartly (Pythagoreio, Kokkari, Samos Town, or Karlovasi) and plan at a calm pace, you’ll get the best version of the island: morning swims, mountain air, and long dinners that stretch into the night.</p>
    `,
        tr: `
    <p>Samos, çam kaplı dağları, berrak koyları, geleneksel köyleri ve otantik hissettiren sakin ritmiyle Doğu Ege'de, Türkiye kıyılarının hemen yanı başında yer alan yemyeşil bir Yunan adasıdır. Sabah turkuaz sularda yüzüp, öğleden sonra gölgeli vadilerde yürüyüş yapabileceğiniz ve akşamları turistler için "sahnelenmiş" değil, gerçekten "yaşayan" bir liman kasabasında taze deniz ürünleri yiyebileceğiniz türden bir yerdir.</p>
    
    <p>Bu rehber Samos'a gezi planlayan herkes için yazıldı; ister ilk kez gidenler, ister müdavimler, çiftler, aileler veya yalnız gezginler olsun. Nerede kalınır, yapılacak en iyi şeyler, öncelik verilmesi gereken plajlar, denenmesi gereken yerel lezzetler ve gezi planınıza kopyalayıp yapıştırabileceğiniz örnek rotalar hakkında pratik tavsiyeler bulacaksınız.</p>
    
    <!-- Türkçe içerik buraya gelecek, şimdilik İngilizce içeriği referans alıyoruz ancak kullanıcı sadece İngilizce metin verdi. -->
    <!-- Kullanıcı talebi: "Samos Island Travel Guide..." Ingilizce idi. TR için otomatik çeviri veya placeholder koyabilirim ama şimdilik EN öncelikli. -->
    <p><em>Not: Bu rehber şu anda İngilizce olarak hazırlanmıştır ancak Türkçe çevirisi yakında eklenecektir. Temel bilgiler evrenseldir!</em></p>
    `
    }
};

async function insertArticle() {
    console.log('Inserting Samos article...');

    // Check if article with same slug exists
    const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', article.slug)
        .single();

    if (existing) {
        console.log('Article already exists, updating...');
        const { error } = await supabase
            .from('articles')
            .update(article)
            .eq('slug', article.slug);

        if (error) {
            console.error('Error updating article:', error);
        } else {
            console.log('Article updated successfully!');
        }
    } else {
        const { error } = await supabase
            .from('articles')
            .insert([article]);

        if (error) {
            console.error('Error inserting article:', error);
        } else {
            console.log('Article inserted successfully!');
        }
    }
}

insertArticle();
