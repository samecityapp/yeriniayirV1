import { createClient } from '@supabase/supabase-js';

// Prevent accidental client-side bundle exposure
if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: lib/supabase-admin.ts must never be imported in client components.');
}

// Use placeholders to prevent build-time crash if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
export const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// This client bypasses RLS policies when SUPABASE_SERVICE_ROLE_KEY is set! Use only on server-side.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

if (!hasServiceRoleKey && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is not configured; falling back to anon key (RLS enforced).');
}
