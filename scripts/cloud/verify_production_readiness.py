#!/usr/bin/env python3
"""
Yerini Ayır — Supabase Pro Production Readiness Verification (READ-ONLY)
Project: jerkkxwgddujigsbeqwo (Frankfurt, Pro)

Verifies production database health, SSL handshake, policy counts,
and extension availability without altering any production state.
"""

import pathlib, json, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
SOURCE = pathlib.Path('/Users/erdems/Documents/Codex/yeriniayir-gastronomy-integration/work/supabase-recovery')
BIN = SOURCE / 'Postgres.app/Contents/Versions/17/bin/psql'
CERT = SOURCE / 'prod-ca-2021.crt'
CONN_FILE = SOURCE / 'connection.private.json'

if not CONN_FILE.exists():
    print(json.dumps({"error": "Production credentials file not found"}))
    sys.exit(1)

conn = json.loads(CONN_FILE.read_text())
ref = conn.get('projectRef') or conn.get('ref', 'jerkkxwgddujigsbeqwo')

if ref != 'jerkkxwgddujigsbeqwo':
    print(json.dumps({"error": f"Unexpected production reference: {ref}"}))
    sys.exit(1)

host = conn['host'] if 'host' in conn else conn['database']['host']
port = str(conn['port'] if 'port' in conn else conn['database']['port'])
user = conn['user'] if 'user' in conn else conn['database']['user']
password = conn['password'] if 'password' in conn else conn['database']['password']
dbname = conn['database'] if isinstance(conn['database'], str) else conn['database']['database']

env = {
    'PATH': '/usr/bin:/bin',
    'LC_ALL': 'C',
    'PGHOST': host,
    'PGPORT': port,
    'PGUSER': user,
    'PGDATABASE': dbname,
    'PGPASSWORD': password,
    'PGSSLMODE': 'verify-full',
    'PGSSLROOTCERT': str(CERT),
    'PGCONNECT_TIMEOUT': '10',
    'PGAPPNAME': 'yeriniayir-pro-readiness-audit',
    'PGOPTIONS': '-c default_transaction_read_only=on -c statement_timeout=15000 -c lock_timeout=3000'
}

sql = """
BEGIN READ ONLY;
SELECT jsonb_build_object(
    'database', current_database(),
    'readOnly', current_setting('transaction_read_only'),
    'pgVersion', version(),
    'hasPgCron', EXISTS(SELECT 1 FROM pg_available_extensions WHERE name = 'pg_cron'),
    'hasCloudSchema', EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = 'ya_private'),
    'policyCount', (SELECT count(*) FROM pg_policies WHERE schemaname IN ('public', 'storage')),
    'oldPermissive', (SELECT count(*) FROM pg_policies WHERE schemaname IN ('public', 'storage') AND permissive = 'PERMISSIVE'),
    'restrictiveHolds', (SELECT count(*) FROM pg_policies WHERE schemaname IN ('public', 'storage') AND policyname LIKE 'ya_v1_hold_%'),
    'legacyPublicTables', (SELECT count(*) FROM pg_tables WHERE schemaname = 'public' AND tablename <> 'spatial_ref_sys')
);
COMMIT;
"""

try:
    res = subprocess.run([str(BIN), '-X', '-w', '-Atq', '-v', 'ON_ERROR_STOP=1'], input=sql, env=env, capture_output=True, text=True, timeout=25)
    if res.returncode != 0:
        print(json.dumps({"error": "Read-only production audit query failed", "code": res.returncode}))
        sys.exit(1)

    data = json.loads(res.stdout.strip())
    
    # Assertions
    assert data['readOnly'] == 'on', "Connection must be read-only"
    assert data['policyCount'] == 87, f"Expected 87 policies, found {data['policyCount']}"
    assert data['oldPermissive'] == 45, f"Expected 45 permissive policies, found {data['oldPermissive']}"
    assert data['restrictiveHolds'] == 42, f"Expected 42 restrictive holds, found {data['restrictiveHolds']}"
    assert data['hasPgCron'] == True, "pg_cron extension must be available in Pro project"

    result = {
        "status": "PASS",
        "environment": "PRODUCTION",
        "projectRef": ref,
        "readOnlyVerified": True,
        "productionMutations": False,
        "details": data
    }
    print(json.dumps(result, indent=2))
except Exception as e:
    print(json.dumps({"status": "FAIL", "error": str(e)}))
    sys.exit(1)
