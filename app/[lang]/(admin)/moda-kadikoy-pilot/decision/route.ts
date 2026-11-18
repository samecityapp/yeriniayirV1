import { NextRequest, NextResponse } from 'next/server';
import { checkPilotAdmin, PILOT_PRIVATE_HEADERS, pilotAuthFailureHeaders } from '@/lib/pilot/adminAuth';
import { MODA_KADIKOY_COFFEE_CANDIDATES } from '@/lib/pilot/modaKadikoyCoffeePilot';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Required even when invoked directly, without middleware or the UI.
  const auth = await checkPilotAdmin(request.headers.get('authorization'));
  if (!auth.ok) {
    return NextResponse.json({ error: 'Admin access denied' }, {
      status: auth.status, headers: pilotAuthFailureHeaders(auth.status),
    });
  }
  const respond = (body: object, status = 200) => NextResponse.json(body, { status, headers: PILOT_PRIVATE_HEADERS });

  // Basic Auth is browser-managed, so require same-origin JSON requests (CSRF protection).
  const origin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site');
  // Next.js may normalize its internal URL to localhost; Host retains the browser-facing authority.
  // Do not trust a client-supplied X-Forwarded-Host for this security decision.
  const expectedOrigin = `${request.nextUrl.protocol}//${request.headers.get('host') || request.nextUrl.host}`;
  if (origin !== expectedOrigin || (fetchSite && fetchSite !== 'same-origin')) {
    return respond({ error: 'Same-origin request required' }, 403);
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return respond({ error: 'JSON required' }, 415);
  }
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return respond({ error: 'Invalid decision' }, 400);
    const { candidateId, decision } = body as Record<string, unknown>;
    if (typeof candidateId !== 'string' || !MODA_KADIKOY_COFFEE_CANDIDATES.some(c => c.id === candidateId)
      || !['approved_for_staging', 'revision_requested', 'rejected'].includes(String(decision))
      || typeof decision !== 'string') {
      return respond({ error: 'Invalid candidate or decision' }, 400);
    }
    // Deliberately no persistence: no production DB or shared mutable staging state.
    return respond({ candidateId, decision, persisted: false });
  } catch {
    return respond({ error: 'Invalid JSON' }, 400);
  }
}
