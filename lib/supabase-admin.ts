import { createClient } from '@supabase/supabase-js';
import {
  ISOLATED_PREVIEW_SENTINEL_URL,
  createBlockedSupabaseFetch,
  isNonProductionRuntime,
  isProductionSupabaseUrl,
} from './supabase-env-guard';

// Prevent accidental client-side bundle exposure
if (typeof window !== 'undefined') {
  throw new Error('SECURITY VIOLATION: lib/supabase-admin.ts must never be imported in client components.');
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const rawServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';

export const isServiceRoleBlockedByIsolation =
  isNonProductionRuntime() &&
  (isProductionSupabaseUrl(rawUrl) || rawUrl === ISOLATED_PREVIEW_SENTINEL_URL);

export const hasServiceRoleKey =
  Boolean(rawServiceRoleKey) &&
  Boolean(rawUrl) &&
  !isServiceRoleBlockedByIsolation &&
  rawUrl !== ISOLATED_PREVIEW_SENTINEL_URL;

export function assertSupabaseAdminReady(): void {
  if (isServiceRoleBlockedByIsolation || rawUrl === ISOLATED_PREVIEW_SENTINEL_URL) {
    throw new Error(
      'SECURITY BLOCK: Non-production environment cannot use service_role against production Supabase.'
    );
  }
  if (!hasServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.');
  }
}

const blockReason =
  isServiceRoleBlockedByIsolation || rawUrl === ISOLATED_PREVIEW_SENTINEL_URL
    ? 'Non-production environment is blocked from using service_role against production Supabase.'
    : 'SUPABASE_SERVICE_ROLE_KEY is not configured; fail-closed admin client refused request.';

// This client bypasses RLS policies when configured in an authorized server runtime.
// Never fall back to NEXT_PUBLIC_SUPABASE_ANON_KEY and never open sockets when disabled or isolated.
export const supabaseAdmin = hasServiceRoleKey
  ? createClient(rawUrl, rawServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : createClient('http://127.0.0.1:54321', 'disabled-service-role-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: createBlockedSupabaseFetch(blockReason),
      },
    });
