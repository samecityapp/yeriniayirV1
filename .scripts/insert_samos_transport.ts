import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
let envVars: Record<string, string> = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envVars = envContent.split('\n').reduce((acc, line) => {
        if (line.startsWith('#') || !line.trim()) return acc;
        const firstEquals = line.indexOf('=');
        if (firstEquals !== -1) {
            const key = line.substring(0, firstEquals).trim();
            let value = line.substring(firstEquals + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string>);
} catch (e) { }

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

const transportArticle = {
    title: {
        en: "How to Get to Samos: Flights, Ferries, Ports & Local Transport Tips"
    },
    slug: "how-to-get-to-samos-flights-ferries",
    cover_image_url: "/images/articles/samos/samos-town.png", // Vathy Port arrival vibe
    meta_description: {
        en: "A complete guide on getting to Samos by flight or ferry. Covers Vathy, Pythagoreio, and Karlovasi ports, airport tips, and how to get around the island."
    },
    location: "Samos",
    is_published: true,
    published_at: new Date(Date.now() + 3000).toISOString(),
    content: {
        en: `
    <p>Getting to Samos is simple once you understand one thing: there are two main ways in—by air and by sea—and which one is best depends on your starting country, the season, and whether you want to combine Samos with other Greek islands or the nearby Turkish coast.</p>
    
    <p>This guide covers how to get to Samos step by step, including the island’s ports (Vathy, Pythagoreio, Karlovasi), what to expect from flights, how ferries usually work, and the smartest ways to move around once you arrive.</p>

    <h2>Quick Answer: The Easiest Way to Get to Samos</h2>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Fastest route:</strong> Fly to Samos Airport (often via Athens).</li>
      <li><strong>Best for island-hopping:</strong> Take a ferry into Karlovasi, Vathy, or Pythagoreio depending on your route.</li>
      <li><strong>Best if you’re coming from Türkiye:</strong> Seasonal sea crossings can make Samos one of the most accessible Greek islands from the Turkish coast.</li>
    </ul>

    <h2>1) Flying to Samos (Samos International Airport)</h2>
    <img src="/images/articles/samos/tsamadou.png" alt="Samos Scenic Arrival" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>Samos has an airport commonly referred to as Samos International Airport. Flight availability changes by season, and routes vary depending on where you’re travelling from.</p>
    <p><strong>Tips for booking:</strong> Check multiple arrival options. Sometimes it’s faster or cheaper to fly into another Greek airport and continue by ferry.</p>

    <h2>2) Getting to Samos by Ferry</h2>
    <p>Ferries are a classic way to reach Samos—especially if you’re combining islands or travelling from the mainland. The key is knowing which port you’re arriving into.</p>
    
    <h3>Vathy (Samos Town) Port</h3>
    <img src="/images/articles/samos/samos-town.png" alt="Samos Town Port" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>Best if you’re staying in or near Samos Town (Vathy). Practical for services, shops, and local life.</p>

    <h3>Pythagoreio Port</h3>
    <img src="/images/articles/samos/pythagoreio.png" alt="Pythagoreio Port" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>Best if you’re staying in Pythagoreio or the southeast side. Often feels like a “prettier arrival” because of the harbour vibe.</p>

    <h3>Karlovasi Port</h3>
    <img src="/images/articles/samos/potami-beach.png" alt="Karlovasi Area" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>Best if you’re staying in Karlovasi or planning a nature-heavy trip. Convenient for western side stays.</p>

    <h2>3) Getting Around Samos Once You Arrive</h2>
    <img src="/images/articles/samos/manolates.png" alt="Samos Mountain Roads" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>Samos is not a “tiny flat island.” It’s mountainous, and that changes everything. The island is easiest when you plan transport wisely.</p>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Rent a car (Option A):</strong> Best overall choice for flexibility and reaching the best beaches.</li>
      <li><strong>Scooter / ATV (Option B):</strong> Good for confident riders in warm months, but be realistic about steep roads.</li>
      <li><strong>Local buses (Option C):</strong> Connect major towns but limit your reach to remote spots.</li>
    </ul>

    <h2>FAQ: Getting to Samos</h2>
    <p><strong>Is it easy to get to Samos?</strong> Yes. Flights and ferries make it accessible, especially in peak season.</p>
    <p><strong>Which port should I arrive at?</strong> Match your port to your base (e.g., Pythagoreio Port for Pythagoreio stays).</p>
    <p><strong>Do I need a car?</strong> Strongly recommended if you want to explore beyond your base town.</p>
    `
    }
};

async function insertTransport() {
    console.log("Inserting Samos Transport article...");

    const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', transportArticle.slug)
        .single();

    if (existing) {
        console.log('Updating transport article...');
        await supabase.from('articles').update(transportArticle).eq('slug', transportArticle.slug);
    } else {
        console.log('Inserting transport article...');
        await supabase.from('articles').insert([transportArticle]);
    }
    console.log('Done.');
}

insertTransport();
