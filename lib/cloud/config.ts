import { authMode, publicKey, target } from '../security/supabase-policy';
import { validatedSupabaseTarget } from '../supabase-env-guard';

if (typeof window !== 'undefined') throw new Error('Server module');

export function cloudConfig() {
  if (authMode(process.env) !== 'supabase') {
    throw new Error('Cloud auth mode required');
  }
  const destination = validatedSupabaseTarget();
  const auth = target(process.env.GASTRONOMY_SUPABASE_URL, destination.environment);
  const expectedEnv =
    destination.environment === 'production'
      ? 'production'
      : destination.ref === 'local'
        ? 'local'
        : 'staging';
  if (
    process.env.GASTRONOMY_CLOUD_ENV !== expectedEnv ||
    auth.url !== destination.url ||
    auth.ref !== process.env.GASTRONOMY_SUPABASE_REF ||
    (destination.environment === 'production' &&
      process.env.GASTRONOMY_PRODUCTION_AUTHORIZED !== '1')
  ) {
    throw new Error('Cloud auth/data trust boundary rejected');
  }
  return {
    url: auth.url,
    key: publicKey(process.env.GASTRONOMY_SUPABASE_ANON_KEY),
    ref: auth.ref,
    environment: destination.environment,
  };
}
