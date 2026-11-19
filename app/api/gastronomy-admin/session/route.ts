import { cloudAdmin, PRIVATE_HEADERS } from '@/lib/cloud/auth';
import { enforceRateLimit } from '@/lib/pilot/rateLimit';

export async function GET(request: Request) {
  const rl = await enforceRateLimit(request?.headers ?? new Headers(), 'admin_read', {
    scope: 'api',
  });
  if (!rl.ok) {
    return Response.json(
      { authenticated: false },
      { status: rl.status, headers: { ...PRIVATE_HEADERS, ...rl.headers } }
    );
  }
  try {
    const admin = await cloudAdmin();
    return Response.json(
      { authenticated: !!admin },
      { status: admin ? 200 : 401, headers: { ...PRIVATE_HEADERS, ...rl.headers } }
    );
  } catch {
    return Response.json(
      { authenticated: false },
      { status: 503, headers: { ...PRIVATE_HEADERS, ...rl.headers } }
    );
  }
}
