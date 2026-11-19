const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { STAGING_REFS, PRODUCTION_REFS } = require('../lib/security/supabase-policy');

const ref = STAGING_REFS[0];
const prodRef = PRODUCTION_REFS[0];

const base = {
  APP_ENVIRONMENT: 'staging',
  NODE_ENV: 'production',
  VERCEL: '1',
  VERCEL_ENV: 'preview',
  GASTRONOMY_AUTH_MODE: 'supabase',
  GASTRONOMY_CLOUD_ENV: 'staging',
  STAGING_SUPABASE_PROJECT_REF: ref,
  GASTRONOMY_SUPABASE_REF: ref,
  NEXT_PUBLIC_SUPABASE_URL: `https://${ref}.supabase.co`,
  GASTRONOMY_SUPABASE_URL: `https://${ref}.supabase.co`,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-only-public-placeholder',
  GASTRONOMY_SUPABASE_ANON_KEY: 'test-only-public-placeholder',
  GASTRONOMY_LOCAL_PREVIEW: '0',
};

const run = (overrides = {}, unsetKeys = []) => {
  const env = { ...base, ...overrides };
  for (const k of unsetKeys) delete env[k];
  return spawnSync(process.execPath, ['scripts/verify_staging_config.cjs'], {
    env,
    encoding: 'utf8',
  });
};

// 1. Positive runtime-valid staging baseline
const positive = run({});
assert.equal(positive.status, 0, positive.stderr);

// 2. Legacy pre-fix Basic fixture MUST now be rejected instead of false PASS
const legacyFixture = run(
  {
    ADMIN_USER: 'staging-admin',
    ADMIN_PASSWORD: crypto.randomBytes(24).toString('base64url'),
    STAGING_SUPABASE_PROJECT_REF: 'synthetic-staging-fixture',
    NEXT_PUBLIC_SUPABASE_URL: 'https://synthetic-staging-fixture.supabase.co',
  },
  ['GASTRONOMY_AUTH_MODE', 'GASTRONOMY_CLOUD_ENV', 'GASTRONOMY_SUPABASE_REF', 'GASTRONOMY_SUPABASE_URL', 'GASTRONOMY_SUPABASE_ANON_KEY', 'VERCEL', 'VERCEL_ENV']
);
assert.notEqual(legacyFixture.status, 0, 'Legacy synthetic-staging-fixture without supabase auth must FAIL');

// 3. Exhaustive runtime mismatch & secret leakage negative matrix
const negatives = [
  ['empty-auth-mode', { GASTRONOMY_AUTH_MODE: '' }],
  ['basic-auth-mode', { GASTRONOMY_AUTH_MODE: 'basic' }],
  ['invalid-auth-mode', { GASTRONOMY_AUTH_MODE: 'invalid' }],
  ['prod-app-env', { APP_ENVIRONMENT: 'production' }],
  ['prod-vercel-env', { VERCEL_ENV: 'production' }],
  ['empty-vercel-env', { VERCEL_ENV: '' }],
  ['empty-public-anon', { NEXT_PUBLIC_SUPABASE_ANON_KEY: '' }],
  ['empty-cloud-anon', { GASTRONOMY_SUPABASE_ANON_KEY: '' }],
  ['sb-secret-in-public-anon', { NEXT_PUBLIC_SUPABASE_ANON_KEY: 'sb_' + 'secret_placeholder_should_reject' }],
  ['local-preview-enabled', { GASTRONOMY_LOCAL_PREVIEW: '1' }],
  ['cloud-env-production', { GASTRONOMY_CLOUD_ENV: 'production' }],
  ['mismatched-gastronomy-ref', { GASTRONOMY_SUPABASE_REF: 'wrong-ref' }],
  ['mismatched-staging-ref', { STAGING_SUPABASE_PROJECT_REF: 'wrong-ref' }],
  ['isolated-policy-sentinel', { NEXT_PUBLIC_SUPABASE_POLICY: 'ISOLATED' }],
  ['unknown-synthetic-url', { NEXT_PUBLIC_SUPABASE_URL: 'https://synthetic-staging-fixture.supabase.co' }],
  ['prod-url-public', { NEXT_PUBLIC_SUPABASE_URL: `https://${prodRef}.supabase.co` }],
  ['evil-suffix-host', { NEXT_PUBLIC_SUPABASE_URL: `https://${ref}.supabase.co.evil.test` }],
  ['trailing-dot-host', { NEXT_PUBLIC_SUPABASE_URL: `https://${ref}.supabase.co.` }],
  ['prod-auth-url', { GASTRONOMY_SUPABASE_URL: `https://${prodRef}.supabase.co` }],
  ['paid-places-key', { GOOGLE_PLACES_API_KEY: 'test-only-placeholder' }],
  ['service-role-key', { SUPABASE_SERVICE_ROLE_KEY: 'test-only-placeholder' }],
  ['prod-authorized-flag', { SUPABASE_PRODUCTION_AUTHORIZED: '1' }],
  ['malformed-upstash-url', { UPSTASH_REDIS_REST_URL: 'http://bad-upstash.example.com', UPSTASH_REDIS_REST_TOKEN: 'tok' }],
  ['upstash-url-without-token', { UPSTASH_REDIS_REST_URL: 'https://staging-rl.upstash.io' }],
];

for (const [label, changes] of negatives) {
  const res = run(changes);
  assert.notEqual(res.status, 0, `Expected failure for negative case: ${label}`);
}

// 4. Normalized valid staging URL + valid optional Upstash config should pass
assert.equal(run({ NEXT_PUBLIC_SUPABASE_URL: `https://${ref.toUpperCase()}.supabase.co/` }).status, 0);
assert.equal(
  run({
    UPSTASH_REDIS_REST_URL: 'https://staging-rl.upstash.io',
    UPSTASH_REDIS_REST_TOKEN: 'staging-dummy-token-value',
  }).status,
  0
);

const totalChecks = negatives.length + 4;
console.log(`PASS ${totalChecks} staging preflight cases aligned with runtime cloudConfig (remote auth not verified).`);
