import { createClient } from '@supabase/supabase-js';
import {
  createBlockedSupabaseFetch,
  createTimedSupabaseFetch,
  resolvePublicSupabaseConfig,
} from './supabase-env-guard';

const resolvedConfig = resolvePublicSupabaseConfig(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const isSupabaseIsolated = resolvedConfig.isolated;

export const supabase = resolvedConfig.isolated
  ? createClient(resolvedConfig.url, resolvedConfig.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: createBlockedSupabaseFetch(resolvedConfig.reason || 'Preview isolation active.'),
      },
    })
  : createClient(resolvedConfig.url, resolvedConfig.anonKey, {
      global: {
        fetch: createTimedSupabaseFetch(8000),
      },
    });
