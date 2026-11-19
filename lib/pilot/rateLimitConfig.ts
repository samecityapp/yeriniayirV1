/** Shared runtime/preflight validation; never include credentials in errors. */
export function validUpstashConfig(env: Record<string, string | undefined>): { url: string; token: string } | null {
  const url = env.UPSTASH_REDIS_REST_URL || '';
  const token = env.UPSTASH_REDIS_REST_TOKEN || '';
  if (!url || !token || url !== url.trim() || /\s|[\x00-\x1f\x7f]/.test(token)) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash ||
        parsed.port || parsed.pathname !== '/' || !parsed.hostname.endsWith('.upstash.io') ||
        !/^[a-z0-9-]+\.upstash\.io$/.test(parsed.hostname)) return null;
    return { url: parsed.origin, token };
  } catch { return null; }
}
