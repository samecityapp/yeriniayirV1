import { cloudAdmin, PRIVATE_HEADERS } from '@/lib/cloud/auth';
import { cloudConfig } from '@/lib/cloud/config';
import { enforceRateLimit } from '@/lib/pilot/rateLimit';

export async function GET(request: Request) {
  const rl = await enforceRateLimit(request?.headers ?? new Headers(), 'admin_read', {
    scope: 'api',
  });
  if (!rl.ok) {
    return Response.json(
      { error: 'Too Many Requests' },
      { status: rl.status, headers: { ...PRIVATE_HEADERS, ...rl.headers } }
    );
  }
  try {
    const admin = await cloudAdmin();
    if (!admin) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { ...PRIVATE_HEADERS, ...rl.headers } }
      );
    }
    const result = await admin.client.rpc('ya_admin_workspace', { p_scope: 'moda/kahve' });
    if (result.error) throw Error('Workspace unavailable');
    return Response.json(
      { environment: 'staging', project: cloudConfig().ref, workspace: result.data },
      { headers: { ...PRIVATE_HEADERS, ...rl.headers } }
    );
  } catch {
    return Response.json(
      { error: 'Yönetim verisi alınamadı.' },
      { status: 503, headers: PRIVATE_HEADERS }
    );
  }
}
