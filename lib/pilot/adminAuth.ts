// Server/Edge-only: never import into a client component.
export type PilotAdminAuthResult = { ok: true } | { ok: false; status: 401 | 503 };

export const PILOT_PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  'Vary': 'Authorization',
};

// Compare fixed-size digests without short-circuiting on credential characters.
async function credentialsMatch(actual: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(actual)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  const left = new Uint8Array(a);
  const right = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}

export async function checkPilotAdmin(authorization: string | null): Promise<PilotAdminAuthResult> {
  // Cloud activation retires legacy Basic access; no shared-password route may bypass MFA.
  if(process.env.GASTRONOMY_AUTH_MODE==='supabase')return {ok:false,status:503};
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return { ok: false, status: 503 };
  const username = process.env.ADMIN_USER?.trim() || 'admin';
  const match = authorization?.match(/^Basic ([A-Za-z0-9+/]+={0,2})$/i);
  if (!match) return { ok: false, status: 401 };
  try {
    const decoded = atob(match[1]);
    const colon = decoded.indexOf(':');
    if (colon < 0) return { ok: false, status: 401 };
    const [userMatches, passwordMatches] = await Promise.all([
      credentialsMatch(decoded.slice(0, colon), username),
      credentialsMatch(decoded.slice(colon + 1), password),
    ]);
    return userMatches && passwordMatches ? { ok: true } : { ok: false, status: 401 };
  } catch {
    return { ok: false, status: 401 };
  }
}

export function pilotAuthFailureHeaders(status: 401 | 503): Record<string, string> {
  return status === 401
    ? { ...PILOT_PRIVATE_HEADERS, 'WWW-Authenticate': 'Basic realm="Moda Pilot Admin", charset="UTF-8"' }
    : PILOT_PRIVATE_HEADERS;
}
