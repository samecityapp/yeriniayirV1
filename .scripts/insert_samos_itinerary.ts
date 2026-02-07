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

const itineraryArticle = {
    title: {
        en: "Samos Itinerary: Perfect Plans for 3, 5, and 7 Days (First-Timers + Slow Travel)"
    },
    slug: "samos-itinerary-3-5-7-days",
    cover_image_url: "/images/articles/samos/heraion.png",
    meta_description: {
        en: "Ready-to-use Samos itineraries for 3, 5, and 7 days. Plans for Pythagoreio, Kokkari, and Karlovasi bases, covering beaches, history, and nature."
    },
    location: "Samos",
    is_published: true,
    published_at: new Date(Date.now() + 2000).toISOString(), // Latest
    content: {
        en: `
    <p>Samos is the kind of island that rewards a good plan—but it punishes rushing. Distances look short on a map, yet mountain roads and coastal curves mean you’ll move slower than you expect. That’s not a problem. In fact, it’s the whole point: Samos is best when you mix a few “must-sees” with long swims, village lunches, and evenings that stretch out by the harbour.</p>
    
    <p>This itinerary guide gives you ready-to-use plans for 3 days, 5 days, and 7 days in Samos, including options based on where you stay (Pythagoreio, Kokkari, Samos Town/Vathy, or Karlovasi). You can follow these exactly or use them as a smart base and swap in your own beach picks.</p>

    <h2>Before You Choose an Itinerary: 3 Quick Decisions</h2>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Will you rent a car?</strong> If you want the best beaches and mountain villages without restrictions, a car makes Samos dramatically easier.</li>
      <li><strong>What’s your priority?</strong> Beaches (North coast), History (Pythagoreio), or Nature (Karlovasi)?</li>
      <li><strong>Do you want one base or two?</strong> up to 5 days usually implies one base. 7 days can support two.</li>
    </ul>

    <h2>3 Days in Samos (First-Timers: Best Highlights)</h2>
    <p>This plan gives you a balanced mix: harbour charm, iconic beaches, and a nature day.</p>
    
    <h3>Day 1 — Pythagoreio + Ancient Engineering + Harbour Evening</h3>
    <img src="/images/articles/samos/tunnel.png" alt="Tunnel of Eupalinos" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p><strong>Morning:</strong> Start in Pythagoreio. Walk the harbour, grab coffee, and settle into island pace.<br>
    <strong>Midday:</strong> Visit the Tunnel of Eupalinos (one of the most interesting historical experiences on Samos).<br>
    <strong>Evening:</strong> Dinner in Pythagoreio harbour. This is one of the best “first night” atmospheres on the island.</p>

    <h3>Day 2 — Kokkari + The Famous North Coast Beaches</h3>
    <img src="/images/articles/samos/kokkari.png" alt="Kokkari Village" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p><strong>Morning:</strong> Head to Lemonakia Beach for an early swim.<br>
    <strong>Midday:</strong> Move to Tsamadou Beach (the “wow” beach day for many visitors).<br>
    <strong>Evening:</strong> Stroll and dinner in Kokkari, ideally by the water.</p>

    <h3>Day 3 — Karlovasi + Potami Waterfalls + Potami Beach</h3>
    <img src="/images/articles/samos/potami.png" alt="Potami Waterfalls" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p><strong>Morning:</strong> Go to Potami Waterfalls (wear proper shoes; slippery rocks are common).<br>
    <strong>Afternoon:</strong> Swim at Potami Beach and keep it simple.<br>
    <strong>Evening:</strong> Dinner near Karlovasi or back in your base town.</p>

    <h2>5 Days in Samos (Best Balance)</h2>
    <p>This plan gives you enough time to explore without feeling like you’re doing “a checklist holiday.”</p>
    
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Day 1:</strong> Settle In + Your Base Town + Easy Swim</li>
      <li><strong>Day 2:</strong> Pythagoreio History Day (Tunnel + Heraion)</li>
      <li><strong>Day 3:</strong> North Coast Beach Day (Kokkari + Best Beaches)</li>
      <li><strong>Day 4:</strong> Mountain Villages (Manolates / Vourliotes) + Scenic Drives</li>
      <li><strong>Day 5:</strong> Nature Day (Potami Waterfalls + Beach)</li>
    </ul>
    
    <img src="/images/articles/samos/manolates.png" alt="Samos Mountain Village" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p><em>Pro tip: If you travel in peak summer, village evenings in Manolates can feel cooler and more comfortable than the coast.</em></p>

    <h2>7 Days in Samos (Slow Travel)</h2>
    <p>A week in Samos lets you stop rushing and start noticing small things: the way mornings feel, the difference between beaches, the rhythm of villages.</p>
    
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Day 1:</strong> Arrival + Base Town + Sunset Walk</li>
      <li><strong>Day 2:</strong> Pythagoreio + Tunnel of Eupalinos</li>
      <li><strong>Day 3:</strong> Heraion + Southeast Beaches</li>
      <li><strong>Day 4:</strong> North Coast Beaches + Kokkari Evening</li>
      <li><strong>Day 5:</strong> Interior Villages + Local Food Day</li>
      <li><strong>Day 6:</strong> Karlovasi + Potami Waterfalls + Potami Beach</li>
      <li><strong>Day 7:</strong> Free Day (Repeat your favourite beach or find a quieter bay)</li>
    </ul>

    <h3>Best Itinerary by Base</h3>
    <ul class="list-disc pl-5">
      <li><strong>Pythagoreio Base:</strong> History days are effortless. Do one big north coast day for Tsamadou.</li>
      <li><strong>Kokkari Base:</strong> Beaches become daily rituals. Do Pythagoreio as a day trip.</li>
      <li><strong>Karlovasi Base:</strong> Nature and waterfalls are your highlight. Do one north coast day + one history day.</li>
    </ul>

    <h2>FAQ: Samos Itinerary Planning</h2>
    <div class="space-y-4">
      <div>
        <strong>Is 3 days enough for Samos?</strong>
        <p>Yes for highlights (one history day, one beach day, one nature day). But 5 days feels much more relaxed.</p>
      </div>
      <div>
        <strong>Can I do Samos without a car?</strong>
        <p>Yes, but you’ll want to choose a strong base (Pythagoreio or Kokkari) and reduce the number of “far” day trips.</p>
      </div>
    </div>
    `
    }
};

async function insertItinerary() {
    console.log("Inserting Samos Itinerary article...");

    const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', itineraryArticle.slug)
        .single();

    if (existing) {
        console.log('Updating itinerary article...');
        await supabase.from('articles').update(itineraryArticle).eq('slug', itineraryArticle.slug);
    } else {
        console.log('Inserting itinerary article...');
        await supabase.from('articles').insert([itineraryArticle]);
    }
    console.log('Done.');
}

insertItinerary();
