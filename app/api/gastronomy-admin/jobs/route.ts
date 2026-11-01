import { cloudAdmin, PRIVATE_HEADERS } from '@/lib/cloud/auth';

export async function GET() {
  try {
    const admin = await cloudAdmin();
    if (!admin) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers: PRIVATE_HEADERS });
    }
    const result = await admin.client.rpc('ya_publication_job_history');
    if (result.error) {
      throw Error('Job history unavailable: ' + result.error.message);
    }
    return Response.json({ jobs: result.data || [] }, { headers: PRIVATE_HEADERS });
  } catch (err) {
    return Response.json({ error: 'İş geçmişi alınamadı.' }, { status: 503, headers: PRIVATE_HEADERS });
  }
}
