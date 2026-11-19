import { readCloudPublication } from '@/lib/cloud/publication';
import { getPublishedV3Snapshot } from '@/lib/gastronomy-v3/registry';
import { enforceRateLimit } from '@/lib/pilot/rateLimit';

const SCOPE_REGEX = /^[a-z0-9-]{1,60}\/[a-z0-9-]{1,40}$/;
const BASE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export async function GET(request: Request) {
  try {
    if (request.url.length > 512) {
      return Response.json({ error: 'İstek geçersiz.' }, { status: 400, headers: BASE_HEADERS });
    }

    const scope = (new URL(request.url).searchParams.get('scope') || 'moda/kahve').trim();
    if (!SCOPE_REGEX.test(scope)) {
      return Response.json({ error: 'Geçersiz kapsam.' }, { status: 400, headers: BASE_HEADERS });
    }

    const regionSlug = scope.split('/')[0];
    if (!getPublishedV3Snapshot(regionSlug)) {
      return Response.json({ error: 'Geçersiz bölge kapsamı.' }, { status: 400, headers: BASE_HEADERS });
    }

    const rl = await enforceRateLimit(request.headers, 'visitor_public', { scope: 'api' });
    const rlHeaders: Record<string, string> = {
      ...BASE_HEADERS,
      ...rl.headers,
      ...(rl.setCookieHeader ? { 'Set-Cookie': rl.setCookieHeader } : {}),
    };
    if (!rl.ok) {
      return Response.json(
        { error: 'Çok fazla istek gönderildi.' },
        { status: rl.status, headers: rlHeaders }
      );
    }

    const data = await readCloudPublication(scope);
    // Server/Data Cache handles query reduction; browser/CDN must not extend evidence expiry.
    return Response.json(data, {
      status: data ? 200 : 404,
      headers: rlHeaders,
    });
  } catch {
    return Response.json(
      { error: 'Rehber şu anda kullanılamıyor.' },
      { status: 503, headers: BASE_HEADERS }
    );
  }
}
