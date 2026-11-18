"""Explicit staging-only operations. Defaults read-only; never accepts production credentials."""
import argparse,pathlib,json,os,re,subprocess,hashlib,datetime
ROOT=pathlib.Path.cwd();PRIVATE=ROOT/'work/cloud-admin';PROD='jerkkxwgddujigsbeqwo'
p=argparse.ArgumentParser();p.add_argument('action',choices=['check','schema','import','grant-admin','repair-conflict','pipeline-schema','pipeline-input','pipeline-cron']);p.add_argument('--approved-staging-action',action='store_true');p.add_argument('--user-id');a=p.parse_args()
c=json.loads((PRIVATE/'staging-connection.private.json').read_text());ref=c['ref'];db=c['database']
if ref==PROD or not re.fullmatch(r'[a-z]{20}',ref):raise RuntimeError('Only confirmed non-production staging allowed')
valid=(db['host']=='db.'+ref+'.supabase.co' and db['user']=='postgres') or (re.fullmatch(r'aws-[0-9]+-[a-z0-9-]+\.pooler\.supabase\.com',db['host']) and db['user']=='postgres.'+ref)
if not valid or db['port']!=5432 or db['database']!='postgres' or c['url']!='https://'+ref+'.supabase.co':raise RuntimeError('Staging connection mismatch')
source=pathlib.Path('/Users/erdems/Documents/Codex/yeriniayir-gastronomy-integration/work/supabase-recovery')
bin=source/'Postgres.app/Contents/Versions/17/bin/psql'
env={'PATH':'/usr/bin:/bin','LC_ALL':'C','PGHOST':db['host'],'PGPORT':'5432','PGUSER':db['user'],'PGDATABASE':'postgres','PGPASSWORD':db['password'],'PGSSLMODE':'verify-full','PGSSLROOTCERT':str(source/'prod-ca-2021.crt'),'PGCONNECT_TIMEOUT':'8','PGAPPNAME':'yeriniayir-staging-only','PGOPTIONS':'-c statement_timeout=15000 -c lock_timeout=3000'+(' -c default_transaction_read_only=on' if a.action=='check' else '')}
def query(sql):
 r=subprocess.run([str(bin),'-X','-w','-Atq','-v','ON_ERROR_STOP=1'],input=sql,env=env,capture_output=True,text=True,timeout=30)
 if r.returncode:raise RuntimeError('Staging operation failed; raw server output withheld')
 return r.stdout.strip()
if a.action=='check':
 result=json.loads(query("BEGIN READ ONLY; SELECT jsonb_build_object('readOnly',current_setting('transaction_read_only'),'hasCloudSchema',EXISTS(SELECT 1 FROM pg_namespace WHERE nspname='ya_private'),'applicationTables',(SELECT count(*) FROM pg_tables WHERE schemaname='public')); COMMIT;"))
 print(json.dumps({'environment':'STAGING','project':ref,**result}));raise SystemExit
if not a.approved_staging_action:raise RuntimeError('Concrete staging change needs approval; no mutation performed')
if a.action=='schema':
 existing=int(query("SELECT count(*) FROM pg_tables WHERE schemaname='public' AND tablename<>'spatial_ref_sys';"))
 if existing:raise RuntimeError('Staging contains existing application tables; no automatic migration')
 query((ROOT/'supabase/proposed/20261101_gastronomy_cloud_admin.sql').read_text())
elif a.action in ('pipeline-schema','pipeline-input','pipeline-cron'):
 files={'pipeline-schema':ROOT/'supabase/proposed/20261101_publication_pipeline.sql','pipeline-input':PRIVATE.parent/'release-system/pipeline-input.private.sql','pipeline-cron':ROOT/'supabase/proposed/20261101_publication_cron.sql'}
 query(files[a.action].read_text())
elif a.action=='repair-conflict':
 query((ROOT/'supabase/proposed/20261101_staging_conflict_fix.sql').read_text())
elif a.action=='import':
 bundle=json.loads((PRIVATE/'import.private.json').read_text())
 if datetime.datetime.fromisoformat(bundle['validUntil'].replace('Z','+00:00'))<=datetime.datetime.now(datetime.timezone.utc):raise RuntimeError('Staging snapshot lease expired; rebuild from current research')
 archive=json.dumps(bundle['archive'],separators=(',',':'),ensure_ascii=False).encode()
 if hashlib.sha256(archive).hexdigest()!=bundle['archiveSha256']:raise RuntimeError('Archive checksum mismatch')
 query((PRIVATE/'import.private.sql').read_text())
else:
 if not a.user_id or not re.fullmatch(r'[0-9a-fA-F-]{36}',a.user_id):raise RuntimeError('Confirmed staging Auth user UUID required')
 # No username/email rule; only an explicitly selected, confirmed Auth user can be bootstrapped.
 approved=query(f"SELECT count(*) FROM auth.users WHERE id='{a.user_id}'::uuid AND email_confirmed_at IS NOT NULL AND NOT coalesce(is_anonymous,false);")
 if approved!='1':raise RuntimeError('Confirmed non-anonymous staging Auth user required')
 query(f"INSERT INTO ya_private.admin_members(user_id) VALUES('{a.user_id}'::uuid);")
print(json.dumps({'environment':'STAGING','project':ref,'action':a.action,'completed':True,'productionChanges':False}))
