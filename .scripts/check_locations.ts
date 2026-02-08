
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLocations() {
    const { data: hotels, error } = await supabase
        .from('hotels')
        .select('location');

    if (error) {
        console.error('Error fetching hotels:', error);
        return;
    }

    // Normalize locations (trim) and get unique values
    const locations = new Set(hotels.map((h: any) => h.location.trim()));
    console.log('Unique Locations:', Array.from(locations));

    // Filter for potential Greek locations
    const greekLocations = Array.from(locations).filter(loc => {
        const lower = loc.toLowerCase();
        return lower.includes('yunanistan') ||
            lower.includes('greece') ||
            lower.includes('samos') ||
            lower.includes('kos') ||
            lower.includes('meis') ||
            lower.includes('sakız');
    });

    console.log('\nPotential Greek Locations:', greekLocations);
}

checkLocations();
