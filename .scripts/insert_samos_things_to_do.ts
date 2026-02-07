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

const thingsToDoArticle = {
    title: {
        en: "Top Things to Do in Samos: Must-See Sights, Villages, Hikes & Hidden Gems"
    },
    slug: "top-things-to-do-in-samos-sights-villages",
    cover_image_url: "/images/articles/samos/manolates.png", // Village vibe feels right for "Hidden Gems/Real Samos"
    meta_description: {
        en: "A curated list of the best things to do in Samos: Ancient history (Tunnel of Eupalinos), best beaches (Tsamadou), mountain villages (Manolates), and nature hikes."
    },
    location: "Samos",
    is_published: true,
    published_at: new Date(Date.now() + 4000).toISOString(),
    content: {
        en: `
    <p>Samos isn’t a “one-note” island where you just rotate between sunbeds and tavernas (though you can absolutely do that). What makes Samos special is how much variety it packs into one place: a UNESCO-level archaeological site, an ancient engineering masterpiece, mountain villages with real daily life, dramatic beaches, waterfalls, and forested hiking routes that feel surprisingly wild for a Greek island.</p>

    <p>This guide covers the best things to do in Samos for first-time visitors and repeat travellers—whether you’re staying in Pythagoreio, Kokkari, Samos Town (Vathy), or Karlovasi. Use it as a menu: pick what fits your trip style and ignore the rest.</p>

    <h2>Quick Picks: Top 10 Things to Do</h2>
    <ul class="list-disc pl-5 space-y-2">
      <li>Explore Pythagoreio harbour and old town</li>
      <li>Visit the Tunnel of Eupalinos</li>
      <li>See the Heraion of Samos</li>
      <li>Swim at Tsamadou and/or Lemonakia</li>
      <li>Do Potami Waterfalls + Potami Beach</li>
      <li>Spend an evening in Kokkari</li>
      <li>Drive to mountain villages like Manolates</li>
      <li>Take a scenic coastal drive</li>
      <li>Try local food + Samos wine</li>
    </ul>

    <h2>1) Pythagoreio: Harbour Walks & History</h2>
    <img src="/images/articles/samos/pythagoreio.png" alt="Pythagoreio Harbour" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>Pythagoreio is one of the most iconic places on Samos. It’s the kind of harbour town where the simple routine becomes your favourite memory: morning coffee by the water, a slow afternoon, then dinner.</p>

    <h2>2) Tunnel of Eupalinos</h2>
    <img src="/images/articles/samos/tunnel.png" alt="Tunnel of Eupalinos" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>The Tunnel of Eupalinos is one of the most impressive ancient engineering projects you can visit in Greece. It feels practical and genius rather than “just ruins.”</p>

    <h2>3) Heraion of Samos (Temple of Hera)</h2>
    <img src="/images/articles/samos/heraion.png" alt="Heraion Ruins" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>The Heraion of Samos is one of the island’s most important archaeological places. Even if you do a short visit, it adds depth to your Samos trip.</p>

    <h2>4) Kokkari: Seaside Beauty</h2>
    <img src="/images/articles/samos/kokkari.png" alt="Kokkari Village" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>Kokkari is famous because it looks and feels like what many people imagine when they picture a Greek island: a compact seaside place with views.</p>

    <h2>5) Tsamadou & Lemonakia: Iconic Beaches</h2>
    <img src="/images/articles/samos/tsamadou.png" alt="Tsamadou Beach" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>If you do one dedicated beach day outside your base, make it the north coast beaches near Kokkari. Tsamadou offers clear water and a classic Samos “wow” factor.</p>

    <h2>6) Potami Waterfalls & Beach</h2>
    <img src="/images/articles/samos/potami.png" alt="Potami Waterfalls" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>Potami Waterfalls (near Karlovasi) are one of the most popular nature experiences. Pair it with Potami Beach for a perfect nature day.</p>

    <h2>7) Mountain Villages: Manolates</h2>
    <img src="/images/articles/samos/manolates.png" alt="Manolates Village" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>The interior villages like Manolates give you a version of the island that feels quieter, cooler, and more local. Perfect for a long lunch.</p>

    <h2>8) Samos Wine & Food</h2>
    <img src="/images/articles/samos/wine.png" alt="Samos Wine" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>Samos is known for wine—especially Muscat-based styles. Adding a tasting to your trip can be a highlight. Pair it with fresh local food at a taverna.</p>

    <h2>FAQ</h2>
    <p><strong>What is Samos most famous for?</strong> Natural beauty, beaches, history (Tunnel/Heraion), and wine.</p>
    <p><strong>Is Samos good for hiking?</strong> Yes, especially around Karlovasi and interior villages.</p>
    `
    }
};

async function insertThingsToDo() {
    console.log("Inserting Samos Things To Do article...");

    const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', thingsToDoArticle.slug)
        .single();

    if (existing) {
        console.log('Updating article...');
        await supabase.from('articles').update(thingsToDoArticle).eq('slug', thingsToDoArticle.slug);
    } else {
        console.log('Inserting article...');
        await supabase.from('articles').insert([thingsToDoArticle]);
    }
    console.log('Done.');
}

insertThingsToDo();
