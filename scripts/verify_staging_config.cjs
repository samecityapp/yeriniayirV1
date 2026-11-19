const path = require('node:path');
const fs = require('node:fs');
const ts = require('typescript');

// Execute the exact same runtime Supabase & Upstash guards without ever printing credentials.
const previous = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => {
  const libRoot = path.resolve(__dirname, '../lib') + path.sep;
  if (!filename.startsWith(libRoot)) {
    throw new Error('Unexpected TS module outside lib/: ' + filename);
  }
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename
  );
};

const issues = [];
try {
  const { cloudConfig } = require('../lib/cloud/config.ts');
  const { validUpstashConfig } = require('../lib/pilot/rateLimitConfig.ts');
  const config = cloudConfig();
  if (config.environment !== 'staging') {
    issues.push('APP_ENVIRONMENT must resolve to staging');
  }
  if (process.env.STAGING_SUPABASE_PROJECT_REF !== config.ref) {
    issues.push('STAGING_SUPABASE_PROJECT_REF must match the runtime staging target ref');
  }
  if (process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (!validUpstashConfig(process.env)) {
      issues.push('Optional Upstash configuration is malformed (must be https://<id>.upstash.io with clean token)');
    }
  }
} catch {
  issues.push('Runtime Supabase staging environment/auth/project trust boundary rejected');
} finally {
  if (previous) require.extensions['.ts'] = previous;
  else delete require.extensions['.ts'];
}

if (process.env.GASTRONOMY_LOCAL_PREVIEW !== '0') {
  issues.push('GASTRONOMY_LOCAL_PREVIEW must remain disabled (0) in cloud staging');
}

for (const key of [
  'GOOGLE_PLACES_API_KEY',
  'GOOGLE_MAPS_API_KEY',
  'TAVILY_API_KEY',
  'OPENAI_API_KEY',
  'GEMINI_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_PRODUCTION_AUTHORIZED',
  'GASTRONOMY_PRODUCTION_AUTHORIZED',
]) {
  if (process.env[key]) {
    issues.push(`${key} must be absent from default read-only staging`);
  }
}

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exitCode = 1;
} else {
  console.log('PASS runtime-compatible read-only staging configuration (no credential values printed; remote auth not verified)');
}
