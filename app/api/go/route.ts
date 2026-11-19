import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDemoHotelById } from '@/lib/demoHotels';
import { enforceRateLimit } from '@/lib/pilot/rateLimit';
import { isSupabaseIsolated, supabase } from '@/lib/supabase';
import { hasServiceRoleKey, supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const MAX_URL_LENGTH = 512;
const DB_TIMEOUT_MS = 4000;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NO_STORE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
};

function isUnsafeRedirectHost(rawHost: string): boolean {
  const host = rawHost.toLowerCase().replace(/\.$/, '').replace(/^\[|\]$/g, '');
  if (!host) return true;
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true;
  }
  if (
    host === '::1' ||
    host === '::' ||
    host.startsWith('fe80:') ||
    host.startsWith('fc') ||
    host.startsWith('fd') ||
    host.startsWith('::ffff:')
  ) {
    return true;
  }
  const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
  }
  return false;
}

function safeClickErrorCode(err: unknown): string {
  if (!err || typeof err !== 'object') return 'unknown';
  const raw = 'code' in err && (typeof err.code === 'string' || typeof err.code === 'number')
    ? String(err.code)
    : '';
  return /^[A-Za-z0-9_.-]{1,32}$/.test(raw) ? raw : 'unknown';
}

function sanitizeHttpUrl(rawUrl: string | null | undefined): URL | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    if (parsed.username || parsed.password) return null;
    if (isUnsafeRedirectHost(parsed.hostname)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function sanitizeReferrer(rawRef: string | null): string {
  if (!rawRef) return '';
  try {
    const parsed = new URL(rawRef.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return '';
    return `${parsed.origin}${parsed.pathname}`.slice(0, 200);
  } catch {
    return '';
  }
}

function hashDailyIp(rawIp: string): string {
  const utcDay = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(`${rawIp}:${utcDay}`).digest('hex').slice(0, 32);
}

async function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Supabase query timeout')), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function GET(request: NextRequest) {
  try {
    if (request.url.length > MAX_URL_LENGTH) {
      return NextResponse.json(
        { error: 'Request URI too long' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const hotelId = request.nextUrl.searchParams.get('hotelId')?.trim();
    if (!hotelId) {
      return NextResponse.redirect(new URL('/', request.url), { headers: NO_STORE_HEADERS });
    }

    const demoHotel = hotelId.length <= 120 ? getDemoHotelById(hotelId) : null;
    if (demoHotel && demoHotel.website_url) {
      const safeDemoUrl = sanitizeHttpUrl(demoHotel.website_url);
      if (safeDemoUrl) {
        return NextResponse.redirect(safeDemoUrl, { headers: NO_STORE_HEADERS });
      }
      return NextResponse.redirect(new URL('/', request.url), { headers: NO_STORE_HEADERS });
    }

    // Validate UUID BEFORE invoking Upstash or Supabase so invalid probes incur zero quota cost.
    if (!UUID_REGEX.test(hotelId)) {
      return NextResponse.json(
        { error: 'Invalid hotelId' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const rl = await enforceRateLimit(request.headers, 'visitor_redirect', { scope: 'api' });
    const rlResponseHeaders: Record<string, string> = {
      ...NO_STORE_HEADERS,
      ...rl.headers,
      ...(rl.setCookieHeader ? { 'Set-Cookie': rl.setCookieHeader } : {}),
    };
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { status: rl.status, headers: rlResponseHeaders }
      );
    }

    if (isSupabaseIsolated) {
      return NextResponse.redirect(new URL('/', request.url), {
        headers: rlResponseHeaders,
      });
    }

    const rawIp =
      request.headers.get('x-real-ip')?.trim() ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '127.0.0.1';
    const userIpHash = hashDailyIp(rawIp);
    const userAgent = (request.headers.get('user-agent') || 'unknown').slice(0, 256);
    const referrer = sanitizeReferrer(
      request.headers.get('referer') || request.headers.get('referrer')
    );

    const isCloudRuntime =
      process.env.APP_ENVIRONMENT === 'production' ||
      process.env.APP_ENVIRONMENT === 'staging' ||
      process.env.VERCEL === '1' ||
      process.env.VERCEL_ENV === 'production' ||
      process.env.VERCEL_ENV === 'preview';

    const canRecordClick =
      rl.policy === 'upstash' && (hasServiceRoleKey || !isCloudRuntime);
    const clickClient = hasServiceRoleKey ? supabaseAdmin : supabase;

    const hotelResult = await withTimeout(
      supabase.from('hotels').select('website_url').eq('id', hotelId).maybeSingle(),
      DB_TIMEOUT_MS
    ).catch((err) => ({ data: null, error: err }));

    const resolvedHotelUrl =
      hotelResult && !hotelResult.error
        ? sanitizeHttpUrl(hotelResult.data?.website_url)
        : null;

    if (!resolvedHotelUrl) {
      return NextResponse.redirect(new URL('/', request.url), {
        headers: rlResponseHeaders,
      });
    }

    let clickTracked = false;
    if (canRecordClick) {
      try {
        const clickResult = await withTimeout(
          clickClient.from('hotel_clicks').insert({
            hotel_id: hotelId,
            user_ip: userIpHash,
            user_agent: userAgent,
            referrer,
          }),
          DB_TIMEOUT_MS
        );
        if (clickResult?.error) {
          console.error('Failed to track click:', safeClickErrorCode(clickResult.error));
        } else {
          clickTracked = true;
        }
      } catch (clickErr) {
        console.error('Failed to track click:', safeClickErrorCode(clickErr));
      }
    }

    const response = NextResponse.redirect(resolvedHotelUrl, {
      headers: rlResponseHeaders,
    });
    response.headers.set('X-Hotel-Click-Tracked', clickTracked ? 'true' : 'false');
    return response;
  } catch (err) {
    const safeName = err && typeof err === 'object' && 'name' in err ? String((err as Error).name).slice(0, 64) : 'Error';
    console.warn('Click tracking error:', safeName);
    return NextResponse.redirect(new URL('/', request.url), { headers: NO_STORE_HEADERS });
  }
}
