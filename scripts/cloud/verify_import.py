"""Read-only equality proof of the already approved staging import."""
import pathlib,json,subprocess,os,datetime,secrets
root=pathlib.Path.cwd();c=json.loads((root/'work/cloud-admin/staging-connection.private.json').read_text());b=json.loads((root/'work/cloud-admin/import.private.json').read_text());assert c['ref']=='vhptlecaixpawtxnhsde'
source=pathlib.Path('/Users/erdems/Documents/Codex/yeriniayir-gastronomy-integration/work/supabase-recovery');db=c['database']
env={'PATH':'/usr/bin:/bin','LC_ALL':'C','PGHOST':db['host'],'PGPORT':'5432','PGUSER':db['user'],'PGDATABASE':'postgres','PGPASSWORD':db['password'],'PGSSLMODE':'verify-full','PGSSLROOTCERT':str(source/'prod-ca-2021.crt'),'PGCONNECT_TIMEOUT':'8'}
def lit(value):
 text=json.dumps(value,ensure_ascii=False,separators=(',',':'));tag='$verify_'+secrets.token_hex(8)+'$';assert tag not in text;return tag+text+tag+'::jsonb'
sql="BEGIN READ ONLY; SELECT jsonb_build_object('readOnly',current_setting('transaction_read_only'),'canonicalMatches',canonical="+lit(b['document'])+",'archiveMatches',archive="+lit(b['archive'])+",'files',jsonb_array_length(archive->'files'),'venues',jsonb_array_length(canonical->'venues'),'hashMatches',archive_sha256='"+b['archiveSha256']+"','revision',(SELECT revision FROM public.ya_publication_heads WHERE scope='moda/kahve'),'leaseValid',valid_until>now()) FROM ya_private.workspaces WHERE scope='moda/kahve'; COMMIT;"
p=subprocess.run([str(source/'Postgres.app/Contents/Versions/17/bin/psql'),'-X','-w','-Atq','-v','ON_ERROR_STOP=1'],input=sql,env=env,capture_output=True,text=True,timeout=30)
if p.returncode:raise RuntimeError('Staging equality verification failed; sensitive output withheld')
r=json.loads(p.stdout);assert r['readOnly']=='on' and r['canonicalMatches'] and r['archiveMatches'] and r['hashMatches'] and r['leaseValid'] and r['files']==46 and r['venues']==4
r.update(environment='STAGING',productionChanges=False);(root/'work/cloud-admin/import-verification.json').write_text(json.dumps(r,indent=2));print(json.dumps(r))
