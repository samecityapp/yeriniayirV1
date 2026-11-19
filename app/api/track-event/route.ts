import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';
import {
  buildVisitorClientKey,
  enforceEdgeMemoryShield,
  isRateLimitActive,
} from '@/lib/pilot/rateLimit';
import { isSupabaseIsolated, supabase } from '@/lib/supabase';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
};

const MAX_BODY_BYTES = 2048;
const MAX_DEDUPE_ENTRIES = 2000;
const DEDUPE_TTL_MS = 60_000;
const UPSTASH_TIMEOUT_MS = 1500;
const DB_TIMEOUT_MS = 4000;

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

let cachedLimiterSignature: string | null = null;
let cachedRateLimiter: Ratelimit | null = null;

function getRateLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || '';
  if (!url || !token) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  const signature = `${url}|${token}`;
  if (cachedLimiterSignature === signature && cachedRateLimiter) {
    return cachedRateLimiter;
  }

  const redis = new Redis({ url, token });
  cachedRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: false,
    prefix: '@upstash/ratelimit/api/track-event',
  });
  cachedLimiterSignature = signature;
  return cachedRateLimiter;
}

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

    if (isSupabaseIsolated || process.env.ANALYTICS_DB_ENABLED === '0') {
      return NextResponse.json(
        { success: true, recorded: false },
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
          { success: true, deduplicated: true },
          { status: 200, headers: NO_STORE_HEADERS }
        );
      }
    }

    let rlHeaders: Record<string, string> = {};
    if (isRateLimitActive()) {
      // Layer 1 memory shield blocks CGNAT-safe / IP floods BEFORE billing Upstash.
      const shield = await enforceEdgeMemoryShield(request.headers, 'visitor_analytics', {
        scope: 'api',
      });
      rlHeaders = shield.headers;
      if (!shield.ok) {
        return NextResponse.json(
          { error: 'Too Many Requests' },
          { status: 429, headers: { ...NO_STORE_HEADERS, ...shield.headers } }
        );
      }

      const limiter = getRateLimiter();
      if (limiter) {
        try {
          const remote = await withTimeout(
            limiter.limit(visitorKey),
            UPSTASH_TIMEOUT_MS,
            'Analytics Upstash timeout'
          );
          if (!remote.success) {
            return NextResponse.json(
              { error: 'Too Many Requests' },
              {
                status: 429,
                headers: {
                  ...NO_STORE_HEADERS,
                  'Retry-After': '10',
                  'X-RateLimit-Policy': 'upstash',
                },
              }
            );
          }
        } catch (rateError) {
          // Layer 1 memory shield remains enforced; never unlimited.
          console.warn('Analytics ratelimit fail-open:', rateError);
        }
      }
    }

    const { error } = await withTimeout(
      supabase.from('analytics_events').insert({
        hotel_id: hotel_id ?? null,
        event_type,
        device_type: device_type || 'unknown',
        metadata: safeMetadata,
      }),
      DB_TIMEOUT_MS,
      'Analytics DB insert timeout'
    );

    if (error) {
      // Do not emit HTTP 500 to visitors when analytics writes are blocked (e.g., RLS hold)
      console.warn('Analytics insert degraded:', error.code || error.message);
      return NextResponse.json(
        { success: true, recorded: false },
        { status: 202, headers: { ...NO_STORE_HEADERS, ...rlHeaders } }
      );
    }

    if (dedupeKey) {
      recentViewEvents.set(dedupeKey, Date.now() + DEDUPE_TTL_MS);
    }

    return NextResponse.json(
      { success: true, recorded: true },
      { status: 200, headers: { ...NO_STORE_HEADERS, ...rlHeaders } }
    );
  } catch (error) {
    console.warn('Analytics route degraded cleanly:', error);
    return NextResponse.json(
      { success: true, recorded: false },
      { status: 202, headers: NO_STORE_HEADERS }
    );
  }
}
