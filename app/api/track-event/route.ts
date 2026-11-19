import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveRuntimeEmergencyMode } from '@/lib/pilot/emergencyMode';
import {
  buildVisitorClientKey,
  enforceRateLimit,
} from '@/lib/pilot/rateLimit';
import { isSupabaseIsolated, supabase } from '@/lib/supabase';
import { hasServiceRoleKey, supabaseAdmin } from '@/lib/supabase-admin';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
};

const MAX_BODY_BYTES = 2048;
const MAX_DEDUPE_ENTRIES = 2000;
const DEDUPE_TTL_MS = 60_000;
const DB_TIMEOUT_MS = 2500;

function safeAnalyticsErrorMeta(err: unknown): { name: string; code?: string } {
  if (!err || typeof err !== 'object') {
    return { name: 'UnknownError' };
  }
  const rawName = 'name' in err && typeof err.name === 'string' ? err.name : 'Error';
  const name = /^[A-Za-z0-9_.-]{1,64}$/.test(rawName) ? rawName : 'Error';
  const rawCode = 'code' in err && (typeof err.code === 'string' || typeof err.code === 'number')
    ? String(err.code)
    : '';
  const code = /^[A-Za-z0-9_.-]{1,32}$/.test(rawCode) ? rawCode : undefined;
  return code ? { name, code } : { name };
}

const eventSchema = z
  .object({
    hotel_id: z.string().uuid().nullable().optional(),
    event_type: z.enum([
      'page_view',
      'view',
      'click',
      'booking_click',
      'contact_click',
      'website_click',
      'instagram_click',
      'whatsapp_click',
      'phone_click',
    ]),
    device_type: z.enum(['mobile', 'desktop', 'tablet', 'unknown']).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .superRefine((val, ctx) => {
    if (!['page_view', 'view'].includes(val.event_type) && !val.hotel_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['hotel_id'],
        message: 'hotel_id is required for interaction events.',
      });
    }
  });

const recentViewEvents = new Map<string, number>();

function pruneDedupeMap(now: number) {
  for (const [key, expiresAt] of Array.from(recentViewEvents.entries())) {
    if (expiresAt <= now) {
      recentViewEvents.delete(key);
    }
  }
  while (recentViewEvents.size >= MAX_DEDUPE_ENTRIES) {
    const oldest = recentViewEvents.keys().next().value;
    if (!oldest) break;
    recentViewEvents.delete(oldest);
  }
}

function sanitizeMetadata(
  rawMeta?: Record<string, unknown>
): Record<string, string> {
  if (!rawMeta || typeof rawMeta !== 'object') return {};

  const safe: Record<string, string> = {};
  if (typeof rawMeta.path === 'string') {
    const cleanPath = rawMeta.path.split(/[?#]/)[0].trim().slice(0, 120);
    if (cleanPath) safe.path = cleanPath;
  }
  if (typeof rawMeta.lang === 'string') {
    const cleanLang = rawMeta.lang.trim().slice(0, 20);
    if (cleanLang) safe.lang = cleanLang;
  }
  if (typeof rawMeta.region === 'string') {
    const cleanRegion = rawMeta.region.trim().slice(0, 80);
    if (cleanRegion) safe.region = cleanRegion;
  }
  return safe;
}

async function withTimeout<T>(promise: PromiseLike<T>, ms: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  if ((await resolveRuntimeEmergencyMode()) !== 'off') {
    return NextResponse.json(
      { success: true, recorded: false, shed: true },
      { status: 202, headers: NO_STORE_HEADERS }
    );
  }
  try {
    const rawText = await request.text();
    if (Buffer.byteLength(rawText, 'utf8') > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413, headers: NO_STORE_HEADERS }
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // Validate BEFORE invoking Upstash or Supabase so malformed calls incur zero quota cost
    const validation = eventSchema.safeParse(parsedJson);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (
      isSupabaseIsolated ||
      process.env.ANALYTICS_DB_ENABLED === '0' ||
      process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === '1'
    ) {
      return NextResponse.json(
        { ok: true, success: true, recorded: false },
        { status: 202, headers: NO_STORE_HEADERS }
      );
    }

    const { hotel_id, event_type, device_type, metadata } = validation.data;
    const safeMetadata = sanitizeMetadata(metadata);
    const visitorKey = await buildVisitorClientKey(request.headers);

    const isViewEvent = event_type === 'page_view' || event_type === 'view';
    const dedupeKey = isViewEvent
      ? `${visitorKey}:${event_type}:${hotel_id || safeMetadata.path || 'root'}`
      : null;

    if (dedupeKey) {
      const now = Date.now();
      pruneDedupeMap(now);
      const existingExpiry = recentViewEvents.get(dedupeKey);
      if (existingExpiry && existingExpiry > now) {
        return NextResponse.json(
          { ok: true, success: true, deduplicated: true },
          { status: 200, headers: NO_STORE_HEADERS }
        );
      }
    }

    const rl = await enforceRateLimit(request.headers, 'visitor_analytics', { scope: 'api' });
    const rlHeaders: Record<string, string> = {
      ...rl.headers,
      ...(rl.setCookieHeader ? { 'Set-Cookie': rl.setCookieHeader } : {}),
    };
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { ...NO_STORE_HEADERS, ...rlHeaders } }
      );
    }

    if (rl.policy !== 'upstash') {
      console.warn(
        `[Analytics] Dropped event: distributed rate-limit unavailable (policy=${rl.policy})`
      );
      return NextResponse.json(
        { ok: true, success: true, recorded: false },
        { status: 202, headers: { ...NO_STORE_HEADERS, ...rlHeaders } }
      );
    }

    const isCloudRuntime =
      process.env.APP_ENVIRONMENT === 'production' ||
      process.env.APP_ENVIRONMENT === 'staging' ||
      process.env.VERCEL === '1' ||
      process.env.VERCEL_ENV === 'production' ||
      process.env.VERCEL_ENV === 'preview';

    if (isCloudRuntime && !hasServiceRoleKey) {
      console.warn('[Analytics] Dropped event: server service_role writer unavailable');
      return NextResponse.json(
        { ok: true, success: true, recorded: false },
        { status: 202, headers: { ...NO_STORE_HEADERS, ...rlHeaders } }
      );
    }

    const analyticsClient = hasServiceRoleKey ? supabaseAdmin : supabase;

    const dbController = new AbortController();
    let dbAbortTimer: ReturnType<typeof setTimeout> | undefined;
    try {
      dbAbortTimer = setTimeout(() => dbController.abort(), DB_TIMEOUT_MS);
      const baseInsert = analyticsClient.from('analytics_events').insert({
        hotel_id: hotel_id ?? null,
        event_type,
        device_type: device_type || 'unknown',
        metadata: safeMetadata,
      });
      const abortableInsert =
        baseInsert &&
        typeof (baseInsert as { abortSignal?: (s: AbortSignal) => typeof baseInsert }).abortSignal ===
          'function'
          ? (baseInsert as unknown as { abortSignal: (s: AbortSignal) => PromiseLike<{ error: unknown }> }).abortSignal(
              dbController.signal
            )
          : baseInsert;

      const { error } = await withTimeout(
        abortableInsert as PromiseLike<{ error: unknown }>,
        DB_TIMEOUT_MS,
        'Analytics DB insert timeout'
      );

      if (error) {
        // Do not emit HTTP 500 to visitors when analytics writes are blocked (e.g., RLS hold)
        console.warn('[Analytics] Insert degraded:', JSON.stringify(safeAnalyticsErrorMeta(error)));
        return NextResponse.json(
          { ok: true, success: true, recorded: false },
          { status: 202, headers: { ...NO_STORE_HEADERS, ...rlHeaders } }
        );
      }
    } finally {
      if (dbAbortTimer) clearTimeout(dbAbortTimer);
    }

    if (dedupeKey) {
      recentViewEvents.set(dedupeKey, Date.now() + DEDUPE_TTL_MS);
    }

    return NextResponse.json(
      { ok: true, success: true, recorded: true },
      { status: 200, headers: { ...NO_STORE_HEADERS, ...rlHeaders } }
    );
  } catch (error) {
    console.warn('[Analytics] Route degraded cleanly:', JSON.stringify(safeAnalyticsErrorMeta(error)));
    return NextResponse.json(
      { ok: true, success: true, recorded: false },
      { status: 202, headers: NO_STORE_HEADERS }
    );
  }
}
