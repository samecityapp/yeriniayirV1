import { cloudAdmin, PRIVATE_HEADERS } from '@/lib/cloud/auth';
import { enforceRateLimit } from '@/lib/pilot/rateLimit';

const MAX_JOB_HISTORY = 50;

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
    const result = await admin.client.rpc('ya_publication_job_history');
    if (result.error) {
      throw Error('Job history unavailable: ' + result.error.message);
    }
    const jobs = Array.isArray(result.data) ? result.data.slice(0, MAX_JOB_HISTORY) : [];
    return Response.json({ jobs }, { headers: { ...PRIVATE_HEADERS, ...rl.headers } });
  } catch {
    return Response.json(
      { error: 'İş geçmişi alınamadı.' },
      { status: 503, headers: PRIVATE_HEADERS }
    );
  }
}
