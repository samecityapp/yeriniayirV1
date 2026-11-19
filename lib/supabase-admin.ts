import { createClient } from '@supabase/supabase-js';
import { serviceRoleKey, target, type Target } from './security/supabase-policy';
import {
  createBlockedSupabaseFetch,
  createTimedSupabaseFetch,
  validatedSupabaseTarget,
} from './supabase-env-guard';

// Prevent accidental client-side bundle exposure
if (typeof window !== 'undefined') {
  throw new Error('SECURITY VIOLATION: lib/supabase-admin.ts must never be imported in client components.');
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

let approvedTarget: Target | undefined;
let validatedServiceKey: string | undefined;

try {
  const candidate = validatedSupabaseTarget();
  validatedServiceKey = serviceRoleKey(rawServiceRoleKey, candidate.ref, candidate.environment);
  approvedTarget = candidate;
} catch {
  // Disabled fail-closed: zero sockets will be opened.
}

export const isServiceRoleBlockedByIsolation = !approvedTarget;

export const hasServiceRoleKey = Boolean(approvedTarget && validatedServiceKey);

export function validatedAdminTarget(): Target {
  const current = validatedSupabaseTarget();
  const currentUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const currentServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (
    !hasServiceRoleKey ||
    !approvedTarget ||
    approvedTarget.url !== current.url ||
    approvedTarget.ref !== current.ref ||
    approvedTarget.environment !== current.environment ||
    target(currentUrl, current.environment).url !== current.url
  ) {
    throw new Error('SECURITY BLOCK: Supabase admin configuration unavailable or mismatched.');
  }
  serviceRoleKey(currentServiceKey, current.ref, current.environment);
  return current;
}

export function assertSupabaseAdminReady(): void {
  validatedAdminTarget();
}

const blockReason = isServiceRoleBlockedByIsolation
  ? 'Supabase environment isolation rejected privileged admin access.'
  : 'SUPABASE_SERVICE_ROLE_KEY is invalid or missing; fail-closed admin client refused request.';

// This client bypasses RLS policies only when configured in an authorized server runtime.
// Never fall back to NEXT_PUBLIC_SUPABASE_ANON_KEY and never open sockets when disabled or isolated.
export const supabaseAdmin = hasServiceRoleKey
  ? createClient(approvedTarget!.url, validatedServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: createTimedSupabaseFetch(10_000),
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
