import { cookies } from 'next/headers';
import { hasValidCloudAdminJwtClaims } from '../security/supabase-policy';
import { cloudConfig } from './config';
import { cloudClient } from './client';

export const ADMIN_COOKIE = 'ya_cloud_admin';
export const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  Vary: 'Cookie',
  'X-Robots-Tag': 'noindex, nofollow',
};

export async function cloudAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const cfg = cloudConfig();
  const requireJwt = cfg.environment === 'production' || cfg.environment === 'staging' || cfg.environment === 'preview';
  if (!hasValidCloudAdminJwtClaims(token, cfg.url, requireJwt)) {
    return null;
  }
  const client = cloudClient(token);
  // getUser validates the signature & session against Auth, not untrusted local cookie claims alone.
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user || data.user.is_anonymous) return null;
  // Database membership and aal2 are authoritative on every request, including revoked members.
  const membership = await client.rpc('ya_is_admin');
  if (membership.error || membership.data !== true) return null;
  return { client, userId: data.user.id };
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || request.headers.get('sec-fetch-site') === 'cross-site') return false;
  try {
    const incoming = new URL(origin);
    const url = new URL(request.url);
    return (
      !incoming.username &&
      !incoming.password &&
      incoming.origin === origin &&
      incoming.host === request.headers.get('host') &&
      incoming.protocol === url.protocol
    );
  } catch {
    return false;
  }
}
