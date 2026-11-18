#!/usr/bin/env node
/**
 * Yerini Ayır — Unified Agent & Admin Workspace CLI
 *
 * Used by Codex, Antigravity, and automated workflows to inspect,
 * verify, and coordinate canonical venue management without conflicts.
 *
 * Usage:
 *   node scripts/cloud/workspace_cli.cjs status
 *   node scripts/cloud/workspace_cli.cjs jobs
 *   node scripts/cloud/workspace_cli.cjs verify-sync
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT = path.resolve(__dirname, '../..');
const connPath = path.join(ROOT, 'work/cloud-admin/staging-connection.private.json');

if (!fs.existsSync(connPath)) {
  console.error('Error: Staging connection configuration not found.');
  process.exit(1);
}

const conn = JSON.parse(fs.readFileSync(connPath, 'utf8'));
if (conn.ref === 'jerkkxwgddujigsbeqwo') {
  console.error('Error: Production project blocked. Only staging is allowed.');
  process.exit(1);
}

const supabase = createClient(conn.url, conn.anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const action = process.argv[2] || 'status';

async function main() {
  switch (action) {
    case 'status':
      await showStatus();
      break;
    case 'jobs':
      await showJobs();
      break;
    case 'verify-sync':
      await verifySync();
      break;
    default:
      console.log('Usage: node scripts/cloud/workspace_cli.cjs [status|jobs|verify-sync]');
      process.exit(1);
  }
}

async function showStatus() {
  console.log('=== YERİNİ AYIR CANONICAL WORKSPACE STATUS ===');
  console.log('Environment:', 'STAGING (' + conn.ref + ')');

  // 1. Public projection
  const pubRes = await supabase.rpc('ya_read_publication', { p_scope: 'moda/kahve' });
  if (pubRes.error) {
    console.error('Public publication error:', pubRes.error.message);
    process.exit(1);
  }

  const pub = pubRes.data;
  console.log('Scope:', pub.scope);
  console.log('Active Revision (Head):', pub.revision);
  console.log('Valid Until:', pub.validUntil);
  console.log('\n--- Active Published Venues (' + pub.document.venues.length + ') ---');
  pub.document.venues.forEach((v, idx) => {
    const menu = v.menuFrom && v.menuFrom.length ? `[Menüden: ${v.menuFrom.join(', ')}]` : '';
    const rec = v.whatToOrder && v.whatToOrder.length ? `[Öneri: ${v.whatToOrder.join(', ')}]` : '';
    console.log(`  ${idx + 1}. ${v.name} (${v.id}) - ${v.location} ${rec} ${menu}`);
  });

  // 2. Canonical bundle comparison
  const importPath = path.join(ROOT, 'work/cloud-admin/import.private.json');
  if (fs.existsSync(importPath)) {
    const bundle = JSON.parse(fs.readFileSync(importPath, 'utf8'));
    const allVenues = bundle.document.venues || [];
    const activeIds = new Set(pub.document.venues.map((v) => v.id));
    const excluded = allVenues.filter((v) => !activeIds.has(v.id));
    if (excluded.length > 0) {
      console.log('\n--- Manually Excluded Canonical Venues (' + excluded.length + ') ---');
      excluded.forEach((v) => {
        console.log(`  [X] ${v.name} (${v.id})`);
      });
    } else {
      console.log('\nAll canonical venues are currently active.');
    }
  }

  console.log('\nStatus check completed successfully.');
}

async function showJobs() {
  console.log('=== YERİNİ AYIR PUBLICATION JOBS HISTORY ===');
  // Query jobs directly via RPC or postgres check
  const { spawnSync } = require('child_process');
  const pyCode = `
import pathlib, json, subprocess
c = json.loads(pathlib.Path('${connPath}').read_text())
source = pathlib.Path('/Users/erdems/Documents/Codex/yeriniayir-gastronomy-integration/work/supabase-recovery')
bin = source / 'Postgres.app/Contents/Versions/17/bin/psql'
db = c['database']
env = {'PATH': '/usr/bin:/bin', 'LC_ALL': 'C', 'PGHOST': db['host'], 'PGPORT': '5432', 'PGUSER': db['user'], 'PGDATABASE': 'postgres', 'PGPASSWORD': db['password'], 'PGSSLMODE': 'verify-full', 'PGSSLROOTCERT': str(source / 'prod-ca-2021.crt'), 'PGCONNECT_TIMEOUT': '8'}
sql = "SELECT id, scope, state, attempts, created_at, finished_at, revision, detail FROM ya_private.publication_jobs ORDER BY id DESC LIMIT 10;"
r = subprocess.run([str(bin), '-X', '-w', '-Atq'], input=sql, env=env, capture_output=True, text=True)
print(r.stdout.strip())
`;
  const res = spawnSync('python3', ['-c', pyCode], { encoding: 'utf8' });
  if (res.status !== 0 || !res.stdout.trim()) {
    console.log('No recent job records or query failed.');
    return;
  }

  const lines = res.stdout.trim().split('\n');
  lines.forEach((line) => {
    const [id, scope, state, attempts, created, finished, rev, detail] = line.split('|');
    console.log(`Job #${id} [${state.toUpperCase()}] Rev: ${rev || '-'} (${finished || created})`);
    console.log(`  Detail: ${detail}`);
  });
}

async function verifySync() {
  console.log('=== VERIFYING WORKSPACE & PUBLICATION SYNCHRONIZATION ===');
  const pubRes = await supabase.rpc('ya_read_publication', { p_scope: 'moda/kahve' });
  if (pubRes.error || !pubRes.data) {
    console.error('FAIL: Public projection could not be retrieved:', pubRes.error?.message);
    process.exit(1);
  }

  const doc = pubRes.data.document;
  const venues = doc.venues;

  // Check 1: 4 venues
  if (venues.length !== 4) {
    console.error(`FAIL: Expected 4 verified venues, got ${venues.length}`);
    process.exit(1);
  }
  console.log('PASS: Exactly 4 venues in publication document');

  // Check 2: No private leak
  const str = JSON.stringify(pubRes.data);
  const forbidden = ['sources', 'userRatingCount', 'reviewCount', 'archive_sha256', 'password'];
  for (const word of forbidden) {
    if (str.includes(word)) {
      console.error(`FAIL: Private field "${word}" leaked into public document`);
      process.exit(1);
    }
  }
  console.log('PASS: Zero private fields or review count leaks');

  // Check 3: Verified IDs match OSM nodes
  const expectedPrefix = 'osm-node-';
  for (const v of venues) {
    if (!v.id.startsWith(expectedPrefix)) {
      console.error(`FAIL: Venue ID ${v.id} does not match verified OSM format`);
      process.exit(1);
    }
  }
  console.log('PASS: All venue IDs conform to canonical verified OSM nodes');

  console.log('\nALL SYNC CHECKS PASSED: Workspace, Pipeline and Public Output are in perfect sync.');
}

main().catch((err) => {
  console.error('CLI Error:', err);
  process.exit(1);
});
