require('./research-ts-loader.cjs');
const { validUpstashConfig } = require('../lib/pilot/rateLimitConfig.ts');
// Presence/shape only. Revoked tokens and connectivity require a deployment smoke test.
if (!validUpstashConfig(process.env) || process.env.RATE_LIMIT_CRITICAL_OUTAGE_MODE !== 'block') {
  console.error('FAIL production rate limit: valid Upstash HTTPS URL/token and critical outage mode=block required');
  process.exitCode = 1;
} else console.log('PASS production rate-limit configuration shape (connectivity not verified)');
