import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create client lazily or allow undefined during build time to prevent build crash
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || '', {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

if (typeof window === 'undefined' && !supabaseServiceRoleKey && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ Supabase Service Role Key is missing! Admin functions will fail.');
}
