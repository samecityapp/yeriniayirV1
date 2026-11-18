#!/usr/bin/env node
// Never prints matched credential values.
// Supports --ref=<git-ref> to inventory a Git tree read-only without checkout/mutation.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const refArg = process.argv.find((a) => a.startsWith('--ref='));
const ref = refArg ? refArg.slice(6) : null;
if (ref && !/^[a-zA-Z0-9_./-]+$/.test(ref)) {
  throw new Error('Invalid git ref');
}

const git = (args) => execFileSync('git', args, { maxBuffer: 128 * 1024 * 1024 });
const trackedFiles = git(
  ref ? ['ls-tree', '-r', '--name-only', '-z', ref] : ['ls-files', '-z']
)
  .toString()
  .split('\0')
  .filter(Boolean);

const keys = new Map();
const findings = [];

function recordFinding(value, type, filePath, lineNumber) {
  if (!keys.has(value)) {
    keys.set(value, `credential-${String(keys.size + 1).padStart(2, '0')}`);
  }
  findings.push({
    id: keys.get(value),
    type,
    path: filePath,
    line: lineNumber,
  });
}

function isScannerDefinitionFile(filePath, lineText) {
  if (
    filePath === 'scripts/cloud/verify_secret_leakage.cjs' ||
    filePath === 'scripts/security/scan-secrets.cjs'
  ) {
    if (lineText.includes('BEGIN ') && lineText.includes('PRIVATE KEY') && lineText.includes('/')) {
      return true;
    }
  }
  return false;
}

for (const file of trackedFiles) {
  const data = ref
    ? git(['show', `${ref}:${file}`])
    : fs.existsSync(file)
      ? fs.readFileSync(file)
      : Buffer.alloc(0);
  if (data.includes(0)) continue;

  const lines = data.toString('utf8').split('\n');
  for (const [index, line] of lines.entries()) {
    if (isScannerDefinitionFile(file, line)) continue;

    for (const m of line.matchAll(/AIza[0-9A-Za-z_-]{35}/g)) {
      recordFinding(m[0], 'Google API key', file, index + 1);
    }
    for (const m of line.matchAll(
      /(?:sb_secret_[A-Za-z0-9_-]{10,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|sk-(?:proj-)?[A-Za-z0-9_-]{32,}|tvly-[A-Za-z0-9_-]{18,})/g
    )) {
      recordFinding(m[0], 'API/Secret token', file, index + 1);
    }
    for (const m of line.matchAll(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g)) {
      try {
        const payload = JSON.parse(Buffer.from(m[0].split('.')[1], 'base64url').toString('utf8'));
        if (payload && payload.role === 'service_role') {
          recordFinding(m[0], 'Supabase service_role JWT', file, index + 1);
        }
      } catch {
        // Ignore malformed non-JWT strings
      }
    }
    if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(line)) {
      recordFinding(`private-key:${file}:${index + 1}`, 'Private key header', file, index + 1);
    }
    for (const m of line.matchAll(/postgres(?:ql)?:\/\/[^:\s/'"]+?:[^@\s/'"]+?@[^\s/'"]+/gi)) {
      if (!/^postgres(?:ql)?:\/\/(?:user:pass|username:password|postgres:postgres)@(?:127\.0\.0\.1|localhost)(?::\d+)?$/i.test(m[0])) {
        recordFinding(m[0], 'Postgres URI with credentials', file, index + 1);
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      ref: ref || 'working tracked files',
      filesScanned: trackedFiles.length,
      uniqueCredentials: keys.size,
      findings,
    },
    null,
    2
  )
);

if (findings.length > 0) {
  process.exitCode = 1;
}
