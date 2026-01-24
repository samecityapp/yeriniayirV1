import { createClient } from '@supabase/supabase-js';

// Use placeholders to prevent build-time crash if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

// This client bypasses RLS policies! Use only on server-side.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

if (typeof window === 'undefined' && !supabaseServiceRoleKey && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ Supabase Service Role Key is missing! Admin functions will fail.');
}
