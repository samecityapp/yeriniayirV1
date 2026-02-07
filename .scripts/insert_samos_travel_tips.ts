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

const travelTipsArticle = {
    title: {
        en: "Samos Travel Tips: Costs, Car Rental, Weather by Month, What to Pack & Common Mistakes"
    },
    slug: "samos-travel-tips-costs-weather-packing",
    cover_image_url: "/images/articles/samos/samos-cover.png", // General beautiful Samos shot
    meta_description: {
        en: "A practical guide to Samos travel: Budgeting, car rental advice, weather by month, packing lists, and common mistakes to avoid."
    },
    location: "Samos",
    is_published: true,
    published_at: new Date(Date.now() + 5000).toISOString(),
    content: {
        en: `
    <p>Samos is easy to love—and easy to do wrong if you assume it works like a tiny, flat Greek island where everything is 10 minutes away. It’s mountainous, spread out, and full of small decisions that can either make your holiday smooth or slightly frustrating (usually because you’re driving too much, planning too much, or choosing the wrong base).</p>

    <p>This practical guide covers the travel details that actually matter: costs, car rental, weather by month, what to pack, how to avoid common mistakes, and small local-style tips that help you enjoy Samos with less effort.</p>

    <h2>Quick Tips for a Better Samos Trip</h2>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Don’t over-plan:</strong> Samos is best with one main highlight per day.</li>
      <li><strong>Expect longer driving times:</strong> Curvy mountain roads slow everything down.</li>
      <li><strong>Bring reef shoes:</strong> Many beaches are pebbly.</li>
      <li><strong>Choose your base with intention:</strong> Pythagoreio vs Kokkari vs Vathy vs Karlovasi matters.</li>
      <li><strong>Go early to popular beaches:</strong> The difference is huge in peak months.</li>
    </ul>

    <h2>Costs in Samos: What to Expect</h2>
    <img src="/images/articles/samos/samos-town.png" alt="Samos Town Atmosphere" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p>Costs vary by season. Accommodation prices jump in peak summer. Food is generally great value if you stick to traditional tavernas. Car rental is often your biggest extra cost but worth it.</p>

    <h2>Car Rental: Is It Worth It?</h2>
    <img src="/images/articles/samos/manolates.png" alt="Samos Mountain Roads" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <p><strong>The honest answer: Yes.</strong> Samos has excellent beaches and villages, but they’re not all clustered together. A car gives you freedom to explore beyond your base and reach the best spots.</p>

    <h2>Weather by Month</h2>
    <img src="/images/articles/samos/tsamadou.png" alt="Samos Summer Weather" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>May:</strong> Green, comfortable, calm. One of the best months.</li>
      <li><strong>June:</strong> Warmer sea, summer energy begins.</li>
      <li><strong>July–August:</strong> Hot, busy. Start beach days early.</li>
      <li><strong>September:</strong> Warm sea, calmer atmosphere. A favourite for many.</li>
    </ul>

    <h2>What to Pack</h2>
    <img src="/images/articles/samos/potami.png" alt="Nature Packing Needs" class="w-full h-auto rounded-xl shadow-lg my-6" />
    <ul class="list-disc pl-5 space-y-2">
      <li>Reef shoes (Essential for pebble beaches)</li>
      <li>Snorkel mask (Clear water!)</li>
      <li>Sunscreen & Hat</li>
      <li>Light layers for evenings</li>
      <li>Proper shoes/grip for Potami Waterfalls</li>
    </ul>

    <h2>Common Mistakes to Avoid</h2>
    <ul class="list-disc pl-5 space-y-2">
      <li>Trying to “do the whole island” in 2 days.</li>
      <li>Choosing a base that doesn’t match your style.</li>
      <li>Underestimating driving times on mountain roads.</li>
      <li>Not bringing reef shoes.</li>
    </ul>

    <h2>Wrap-Up</h2>
    <p>Samos is at its best when you choose a smart base, plan one main highlight per day, and leave space for long swims and slow dinners. The island doesn’t need you to rush. It needs you to settle in.</p>
    `
    }
};

async function insertTravelTips() {
    console.log("Inserting Samos Travel Tips article...");

    const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', travelTipsArticle.slug)
        .single();

    if (existing) {
        console.log('Updating article...');
        await supabase.from('articles').update(travelTipsArticle).eq('slug', travelTipsArticle.slug);
    } else {
        console.log('Inserting article...');
        await supabase.from('articles').insert([travelTipsArticle]);
    }
    console.log('Done.');
}

insertTravelTips();
