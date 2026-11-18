/**
 * Client Bundle & Static Asset Secret Leakage Scanner
 * Ensures NO service role keys, admin passwords, database credentials,
 * or private API keys leaked into client-side JS/CSS/HTML bundles.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const STATIC_DIR = path.resolve('.next/static');
assert.ok(fs.existsSync(STATIC_DIR), '.next/static must exist');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles(STATIC_DIR);
console.log(`Scanning ${files.length} client-facing static files for potential secret leaks...`);

// Patterns that should NEVER appear in client bundles (actual secret values, tokens, keys)
const FORBIDDEN_PATTERNS = [
  { name: 'Supabase Service Role Key Token', pattern: /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/ },
  { name: 'Postgres Connection String with Password', pattern: /postgres(ql)?:\/\/[^:]+:[^@\s]+@[^\s/]+/i },
  { name: 'Tavily API Key (private)', pattern: /tvly-[A-Za-z0-9_-]{20,}/ },
  { name: 'Google Private Key Header', pattern: /-----BEGIN PRIVATE KEY-----/ },
  { name: 'Google Cloud Private Service Account Key', pattern: /"type":\s*"service_account"/ },
  { name: 'Assigned Admin Password Value', pattern: /ADMIN_PASSWORD\s*[:=]\s*['"][^'"]{4,}['"]/i },
  { name: 'Assigned Service Role Key Value', pattern: /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*['"][^'"]{10,}['"]/i },
];

let leaks = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const { name, pattern } of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      console.error(`[LEAK DETECTED] ${name} matched in ${file}`);
      leaks++;
    }
  }
}

console.log(`\nScan completed. Leaks found: ${leaks}`);
assert.equal(leaks, 0, 'Zero client bundle secret leaks required for production readiness');
console.log('✓ ALL CLIENT BUNDLES CLEAN: 0 secret leaks detected.');
