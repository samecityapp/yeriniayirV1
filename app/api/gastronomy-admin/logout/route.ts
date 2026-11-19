import { cookies } from 'next/headers';
import { ADMIN_COOKIE, PRIVATE_HEADERS, sameOrigin } from '@/lib/cloud/auth';
import { cloudClient } from '@/lib/cloud/client';
import { enforceRateLimit } from '@/lib/pilot/rateLimit';

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403, headers: PRIVATE_HEADERS });
  }
  const rl = await enforceRateLimit(request.headers, 'admin_read', { scope: 'api' });
  if (!rl.ok) {
    return Response.json(
      { error: 'Too Many Requests' },
      { status: rl.status, headers: { ...PRIVATE_HEADERS, ...rl.headers } }
    );
  }
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (token) {
    try {
      const client = cloudClient(token);
      // GoTrueClient.signOut() skips HTTP revocation when persistSession is false;
      // GoTrueAdminApi.signOut(jwt, 'local') posts /auth/v1/logout?scope=local with the user's JWT + anon apikey.
      await client.auth.admin.signOut(token, 'local');
    } catch {
      /* Cookie is still deleted; token expires shortly. */
    }
  }
  jar.delete(ADMIN_COOKIE);
  if (jar.get('ya_cloud_pending')?.value) {
    jar.delete('ya_cloud_pending');
  }
  return Response.json({ ok: true }, { headers: { ...PRIVATE_HEADERS, ...rl.headers } });
}
