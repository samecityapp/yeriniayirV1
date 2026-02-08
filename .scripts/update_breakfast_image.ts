
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

const OLD_URL = "https://images.unsplash.com/photo-1541014741259-df5290ce50ac?auto=format&fit=crop&q=80&w=1000";
const NEW_URL = "https://images.pexels.com/photos/28077098/pexels-photo-28077098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

async function updateImage() {
    console.log('Updating breakfast images...');

    const { data, error } = await supabase
        .from('restaurants')
        .update({ image_url: NEW_URL })
        .eq('image_url', OLD_URL)
        .select();

    if (error) {
        console.error('Error updating images:', error);
    } else {
        console.log(`Updated ${data.length} restaurants with new breakfast image.`);
    }
}

updateImage();
