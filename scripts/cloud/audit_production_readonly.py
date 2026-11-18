"""Read-only inventory; credentials stay in the original private recovery file."""
import importlib.util,json,pathlib,subprocess,os,hashlib,re,urllib.parse
source=pathlib.Path('/Users/erdems/Documents/Codex/yeriniayir-gastronomy-integration')
spec=importlib.util.spec_from_file_location('recovery',source/'scripts/supabase_native_recovery.py');r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
env=r.pg_env(json.loads((source/'work/supabase-recovery/connection.private.json').read_text()))
sql="""SELECT jsonb_build_object('database',current_database(),'readonly',current_setting('transaction_read_only'),
'policies',(SELECT jsonb_agg(jsonb_build_object('schema',schemaname,'table_name',tablename,'name',policyname,'permissive',permissive,'cmd',cmd,'roles',roles,'qual',qual,'with_check',with_check) ORDER BY schemaname,tablename,policyname) FROM pg_policies WHERE schemaname IN ('public','storage')),
'newSchemaExists',EXISTS(SELECT 1 FROM pg_namespace WHERE nspname='ya_private'),
'authUsers',(SELECT count(*) FROM auth.users),
'storage',(SELECT jsonb_agg(jsonb_build_object('bucket',bucket_id,'name',name,'bytes',coalesce((metadata->>'size')::bigint,0))) FROM storage.objects),
'buckets',(SELECT jsonb_agg(jsonb_build_object('id',id,'public',public)) FROM storage.buckets));"""
p=subprocess.run([str(r.BIN/'psql'),'-X','-w','-At','-v','ON_ERROR_STOP=1','-c',sql],env=env,capture_output=True,text=True,timeout=35)
if p.returncode:raise RuntimeError('Read-only audit failed; server details withheld')
data=json.loads(p.stdout);assert data['readonly']=='on'
old=json.loads((source/'work/free-capacity/production-inventory.private.json').read_text())['policies']
key=lambda p:json.dumps(p,sort_keys=True)
assert sorted(map(key,old))==sorted(map(key,data['policies'])),'Policy definitions changed; review privately'
files=list((source/'work/supabase-recovery/database-backup-20261031T193110Z').glob('*data*.sql'))
public_text=''
if files:
 text=files[0].read_text();chunks=re.findall(r'COPY public\.[\s\S]*?\n\\\.\n',text);public_text='\n'.join(chunks)
for o in data['storage'] or []:
 o['referenceInPublicBackup']=bool(public_text) and (o['name'] in public_text or urllib.parse.quote(o['name'],safe='/') in public_text)
 # A missing application reference is never proof of safe deletion (external consumers/backups).
 o['classification']='referenced-in-public-backup' if o['referenceInPublicBackup'] else 'needs-review-not-safe-to-delete'
out=pathlib.Path('work/cloud-admin');out.mkdir(parents=True,exist_ok=True)
fd=os.open(out/'production-audit.private.json',os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
with os.fdopen(fd,'w') as f:json.dump(data,f)
summary={'environment':'PRODUCTION jerkkxwgddujigsbeqwo','readOnly':True,'productionChanges':False,'policiesUnchanged':True,'oldPermissive':sum(p['permissive']=='PERMISSIVE' for p in data['policies']),'restrictiveHolds':sum(p['name'].startswith('ya_v1_hold_') for p in data['policies']),'newCloudSchemaExists':data['newSchemaExists'],'storageObjects':len(data['storage'] or []),'storageBytes':sum(o['bytes'] for o in data['storage'] or []),'storageReferenceCandidates':sum(not o['referenceInPublicBackup'] for o in data['storage'] or []),'referencesComparedWithDatedBackup':bool(public_text),'deleted':0}
(out/'production-audit-summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary))
