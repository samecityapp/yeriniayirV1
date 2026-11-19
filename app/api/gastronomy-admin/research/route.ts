import { cloudAdmin, PRIVATE_HEADERS } from '@/lib/cloud/auth';
import { enforceRateLimit } from '@/lib/pilot/rateLimit';

export async function GET(request: Request) {
  const rl = await enforceRateLimit(request?.headers ?? new Headers(), 'costly_admin', {
    scope: 'api',
  });
  if (!rl.ok) {
    return Response.json(
      { error: 'Çok fazla arşiv isteği gönderildi.' },
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
    const result = await admin.client.rpc('ya_admin_archive', { p_scope: 'moda/kahve' });
    if (result.error) throw Error('Archive unavailable');
    return Response.json(result.data, {
      headers: {
        ...PRIVATE_HEADERS,
        ...rl.headers,
        'Content-Disposition': 'attachment; filename="yeriniayir-arastirma.json"',
      },
    });
  } catch {
    return Response.json(
      { error: 'Araştırma arşivi alınamadı.' },
      { status: 503, headers: PRIVATE_HEADERS }
    );
  }
}
