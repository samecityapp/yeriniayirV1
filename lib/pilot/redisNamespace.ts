export const REDIS_NAMESPACE_RE = /^[a-z0-9:_-]{1,40}$/i;

export interface RedisNamespaceValidation {
  valid: boolean;
  namespace: string | null;
  reason?: string;
}

/**
 * Validate optional Redis namespace env var fail-closed.
 * Empty/unset means un-namespaced default is intentionally selected;
 * any non-empty malformed or whitespace-padded value MUST be rejected
 * rather than silently falling back to the shared un-namespaced key.
 */
export function validateRedisNamespaceValue(
  raw: string | undefined,
  reasonKey: string
): RedisNamespaceValidation {
  if (raw === undefined || raw === null || raw === '') {
    return { valid: true, namespace: null };
  }
  if (typeof raw !== 'string' || raw !== raw.trim() || !REDIS_NAMESPACE_RE.test(raw)) {
    return { valid: false, namespace: null, reason: reasonKey };
  }
  return { valid: true, namespace: raw };
}

export function validateEmergencyRedisNamespace(
  env: Record<string, string | undefined> = process.env
): RedisNamespaceValidation {
  return validateRedisNamespaceValue(
    env.EMERGENCY_MODE_REDIS_NAMESPACE,
    'invalid-emergency-redis-namespace'
  );
}

export function validateRateLimitRedisNamespace(
  env: Record<string, string | undefined> = process.env
): RedisNamespaceValidation {
  return validateRedisNamespaceValue(
    env.RATE_LIMIT_REDIS_NAMESPACE,
    'invalid-ratelimit-redis-namespace'
  );
}
