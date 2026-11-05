const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const base = {
  APP_ENVIRONMENT: 'staging', ADMIN_USER: 'staging-admin',
  ADMIN_PASSWORD: crypto.randomBytes(24).toString('base64url'),
  STAGING_SUPABASE_PROJECT_REF: 'synthetic-staging-fixture',
  NEXT_PUBLIC_SUPABASE_URL: 'https://synthetic-staging-fixture.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-only-placeholder-not-a-real-key',
  GASTRONOMY_LOCAL_PREVIEW: '0',
};
const run = (changes) => spawnSync(process.execPath, ['scripts/verify_staging_config.cjs'], { env: { ...base, ...changes }, encoding: 'utf8' });
assert.equal(run({}).status, 0);
for (const changes of [
  { APP_ENVIRONMENT: 'production' }, { ADMIN_PASSWORD: '' },
  { NEXT_PUBLIC_SUPABASE_ANON_KEY: '' }, { GASTRONOMY_LOCAL_PREVIEW: '1' },
  { STAGING_SUPABASE_PROJECT_REF: 'jerkkxwgddujigsbeqwo', NEXT_PUBLIC_SUPABASE_URL: 'https://jerkkxwgddujigsbeqwo.supabase.co' },
  { GOOGLE_PLACES_API_KEY: 'test-only-placeholder' }, { SUPABASE_SERVICE_ROLE_KEY: 'test-only-placeholder' },
]) assert.notEqual(run(changes).status, 0);
console.log('PASS 8 staging preflight scenarios: isolated configuration, auth, production exclusion and no paid/service-role credentials');
