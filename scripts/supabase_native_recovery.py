"""Private local backup tooling. No automatic production resume, migration or restore."""
from pathlib import Path
import os, re, json, subprocess, hashlib, datetime, argparse, urllib.parse, sys

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / 'work/supabase-recovery'
BIN = WORK / 'Postgres.app/Contents/Versions/17/bin'
CLI = WORK / 'tooling/node_modules/.bin/supabase'
EXPECTED = 'jerkkxwgddujigsbeqwo'
VARIANTS = {
    'roles': ['--role-only'],
    'schema': [],
    'managed-schema': ['--schema', 'auth,storage'],
    'data': ['--data-only', '--use-copy', '--schema', 'public,auth,storage'],
}

def private_write(path, data):
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w') as f:
        f.write(data)

def prepare():
    WORK.mkdir(parents=True, exist_ok=True)
    WORK.chmod(0o700)
    folder = WORK / 'native-templates'
    folder.mkdir(mode=0o700, exist_ok=True)
    for name, flags in VARIANTS.items():
        # Always a public fake URL, never actual passwords or production config.
        result = subprocess.run([str(CLI), 'db', 'dump', '--dry-run', '--db-url',
            'postgresql://postgres@db.synthetic-project.supabase.co:5432/postgres', *flags],
            capture_output=True, text=True, timeout=45,
            env={k:v for k,v in os.environ.items() if not any(x in k for x in ['PASSWORD','TOKEN','SECRET','API_KEY','DATABASE_URL'])})
        if result.returncode or 'pg_dump' not in result.stdout:
            raise RuntimeError('CLI template generation failed; raw output withheld')
        script = re.sub(r'^export PG[A-Z_]+=.*\n', '', result.stdout, flags=re.M)
        # CLI 2.122 emits unquoted pipe alternation in explicit schema-only patterns.
        script = re.sub(r'--schema=([a-z_|]+)(?=\s)', r'--schema="\1"', script)
        if 'synthetic-project' in script or 'PGPASSWORD=' in script:
            raise RuntimeError('Unsafe template')
        path = folder / (name + '.sh')
        if path.exists(): path.unlink()
        private_write(path, script)
    print('PASS four CLI-generated templates ready; all connection exports removed')

def validate_connection(c):
    if c.get('projectRef') != EXPECTED:
        raise ValueError('Wrong project; refusing connection')
    host, user = c.get('host', ''), c.get('user', '')
    direct = host == 'db.' + EXPECTED + '.supabase.co' and user == 'postgres'
    pooler = re.fullmatch(r'aws-[0-9]+-[a-z0-9-]+\.pooler\.supabase\.com', host) and user == 'postgres.' + EXPECTED
    if not (direct or pooler) or c.get('port') != 5432 or c.get('database') != 'postgres':
        raise ValueError('Only the confirmed project direct/session-pooler endpoint is allowed')
    if not c.get('password') or c['password'] in ('[YOUR-PASSWORD]', 'YOUR_PASSWORD'):
        raise ValueError('Actual database password missing')
    return c

def capture(password_only=False):
    # AppleScript stdout is consumed in memory; no secret appears in command args/logs.
    def ask(prompt):
        script = 'text returned of (display dialog ' + json.dumps(prompt, ensure_ascii=False) + ' default answer "" with hidden answer buttons {"Vazgeç", "Kaydet"} default button "Kaydet")'
        r = subprocess.run(['/usr/bin/osascript', '-e', script], capture_output=True, text=True, timeout=300)
        if r.returncode: raise RuntimeError('Local input cancelled; no raw output shown')
        return r.stdout.rstrip('\n')
    if password_only:
        c = {'projectRef': EXPECTED, 'host': 'db.' + EXPECTED + '.supabase.co', 'port': 5432,
             'database': 'postgres', 'user': 'postgres',
             'password': ask('YeriniAyir DATABASE PASSWORD parolasını gir. Projeye bağlanılmayacak; parola özel yerel dosyada tutulacak. Hesap giriş şifresi veya API anahtarı değil.')}
        validate_connection(c)
        path = WORK / 'connection.private.json'
        if path.exists(): raise RuntimeError('Existing connection retained; no automatic overwrite')
        private_write(path, json.dumps(c))
        print('Private database password captured locally; no connection or reset performed')
        return
    url = urllib.parse.urlsplit(ask('Supabase Connect ekranındaki Direct connection veya Session pooler (5432) bağlantısını yapıştır. Bu alan sohbete/loga gönderilmez.'))
    if url.scheme not in ('postgres','postgresql') or url.query or url.fragment:
        raise ValueError('Use the standard PostgreSQL connection string without extra options')
    c = {'projectRef': EXPECTED, 'host': url.hostname, 'port': url.port or 5432,
         'database': url.path.lstrip('/'), 'user': urllib.parse.unquote(url.username or ''),
         'password': urllib.parse.unquote(url.password or '')}
    if not c['password'] or c['password'] in ('[YOUR-PASSWORD]', 'YOUR_PASSWORD'):
        c['password'] = ask('YeriniAyir DATABASE PASSWORD parolasını gir. Supabase hesabının giriş şifresi veya API anahtarı değil. Şifre sıfırlama yapılmayacak.')
    validate_connection(c)
    path = WORK / 'connection.private.json'
    if path.exists(): raise RuntimeError('Existing connection retained; no automatic overwrite')
    private_write(path, json.dumps(c))
    print('Private local connection saved with mode 0600; no values printed')

def pg_env(c):
    validate_connection(c)
    return {'PATH': str(BIN) + ':/usr/bin:/bin', 'LC_ALL':'C',
            'PGHOST':c['host'], 'PGPORT':str(c['port']), 'PGUSER':c['user'],
            'PGDATABASE':c['database'], 'PGPASSWORD':c['password'],
            'PGSSLMODE':'verify-full', 'PGSSLROOTCERT':str(WORK/'prod-ca-2021.crt'),
            'PGCONNECT_TIMEOUT':'8', 'PGAPPNAME':'yeriniayir-readonly-backup',
            'PGOPTIONS':'-c default_transaction_read_only=on -c statement_timeout=120000 -c lock_timeout=3000'}

def run_to_file(command, env, path, timeout=180):
    # Sensitive output only enters a private file, never terminal/log/chat.
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'wb') as output:
        r = subprocess.run(command, env=env, stdout=output, stderr=subprocess.PIPE, timeout=timeout)
    if r.returncode:
        raise RuntimeError('Read-only operation failed; partial file retained privately, error details withheld')
    if path.stat().st_size == 0: raise RuntimeError('Empty result; not accepted as complete')

def file_hash(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()

def execute(action):
    path = WORK / 'connection.private.json'
    if path.is_symlink() or path.stat().st_mode & 0o077: raise RuntimeError('Connection file permissions must be 0600')
    env = pg_env(json.loads(path.read_text()))
    if not (BIN/'pg_dump').exists(): raise RuntimeError('Native tools missing')
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    dest = WORK / ('database-backup-' + stamp if action == 'backup' else 'rls-audit-' + stamp)
    dest.mkdir(mode=0o700)
    # Read-only PostgreSQL metadata probe, enforced by session PGOPTIONS.
    probe = subprocess.run([str(BIN/'psql'), '-X', '-w', '-A', '-t', '-v','ON_ERROR_STOP=1','-c',
      "SELECT current_setting('transaction_read_only'),current_setting('server_version_num');"], env=env, capture_output=True, text=True, timeout=15)
    if probe.returncode or not re.fullmatch(r'on\|17[0-9]{4}\s*', probe.stdout):
        raise RuntimeError('TLS/read-only/Postgres 17 preflight failed; no dump started')
    if action == 'audit':
        run_to_file([str(BIN/'psql'),'-X','-w','-v','ON_ERROR_STOP=1','-f',str(ROOT/'supabase/audits/production_rls_readonly.sql')],env,dest/'metadata.private.txt')
        print('Read-only metadata audit completed; private output retained locally')
        return
    manifest = {'projectRef':EXPECTED,'cliVersion':'2.122.0','nativePostgres':'17.11','readOnly':True,
                'commonSnapshotAcrossFiles':False,'restoreTested':False,'files':[],
                'limits':['Separate dumps are not one shared snapshot','Storage ZIP is separate','No Vault root key, edge-function config or custom-schema coverage guarantee']}
    # First enumerate schemas without reading application data. Extra custom schemas require review.
    schemas = subprocess.run([str(BIN/'psql'),'-X','-w','-A','-t','-v','ON_ERROR_STOP=1','-c',
      "SELECT nspname FROM pg_namespace ORDER BY nspname;"],env=env,capture_output=True,text=True,timeout=15)
    if schemas.returncode: raise RuntimeError('Schema inventory failed')
    private_write(dest/'schema-inventory.private.json',json.dumps(schemas.stdout.splitlines()))
    for name in VARIANTS:
        template = WORK/'native-templates'/(name+'.sh')
        if not template.exists(): raise RuntimeError('CLI template missing')
        partial = dest/(name+'.sql.partial')
        run_to_file(['/bin/bash',str(template)],env,partial)
        final=partial.with_suffix('');partial.rename(final)
        manifest['files'].append({'name':final.name,'bytes':final.stat().st_size,
          'sha256':file_hash(final)})
    private_write(dest/'manifest.private.json',json.dumps(manifest,indent=2))
    print('Four read-only logical dump files completed; restore verification still required')

if __name__ == '__main__':
    parser=argparse.ArgumentParser();parser.add_argument('action',choices=['prepare','capture','capture-password','backup','audit']);args=parser.parse_args()
    try:
        if args.action=='prepare': prepare()
        elif args.action in ('capture','capture-password'): capture(args.action=='capture-password')
        else: execute(args.action)
    except Exception as error:
        print('Recovery stopped safely: '+type(error).__name__+'; raw details withheld',file=sys.stderr)
        sys.exit(1)
