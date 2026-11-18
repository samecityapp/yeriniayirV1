"""Real PostgreSQL, isolated UNIX socket; actual proposed DDL + research import, synthetic Auth users."""
import pathlib,tempfile,subprocess,json,importlib.util
root=pathlib.Path.cwd();source=pathlib.Path('/Users/erdems/Documents/Codex/yeriniayir-gastronomy-integration')
spec=importlib.util.spec_from_file_location('r',source/'scripts/supabase_native_recovery.py');r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
with tempfile.TemporaryDirectory(prefix='ya-cloud-',dir='/private/tmp') as tmp:
 d=pathlib.Path(tmp);sock=d/'sock';sock.mkdir(mode=0o700);b=r.BIN
 env={'PATH':str(b)+':/usr/bin:/bin','LC_ALL':'C','PGHOST':str(sock),'PGPORT':'55439','PGUSER':'postgres','PGDATABASE':'postgres'}
 def run(args,ok=True):
  p=subprocess.run([str(x) for x in args],env=env,capture_output=True,text=True,timeout=40)
  if ok and p.returncode:raise RuntimeError('Local SQL failed: '+p.stderr[:350])
  return p
 def q(sql,ok=True):return run([b/'psql','-X','-w','-Atq','-v','ON_ERROR_STOP=1','-c',sql],ok)
 checks=[]
 def check(label,test):assert test,label;checks.append(label)
 run([b/'initdb','-D',d/'db','-A','trust','-U','postgres','--no-locale']);started=False
 try:
  run([b/'pg_ctl','-D',d/'db','-l',d/'server.log','-o',f"-k {sock} -p 55439 -c listen_addresses='' -c fsync=off",'-w','start']);started=True
  q("CREATE ROLE anon; CREATE ROLE authenticated; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY); CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$; GRANT USAGE ON SCHEMA public,auth TO anon,authenticated;")
  run([b/'psql','-X','-w','-q','-v','ON_ERROR_STOP=1','-f',root/'supabase/proposed/20261101_gastronomy_cloud_admin.sql'])
  import datetime
  seed=(root/'work/cloud-admin/import.private.sql').read_text();old=json.loads((root/'work/cloud-admin/import.private.json').read_text())['validUntil'];seed=seed.replace(old,(datetime.datetime.now(datetime.timezone.utc)+datetime.timedelta(hours=1)).isoformat());(d/'seed.sql').write_text(seed)
  run([b/'psql','-X','-w','-q','-v','ON_ERROR_STOP=1','-f',d/'seed.sql'])
  admin='00000000-0000-4000-8000-000000000001';other='00000000-0000-4000-8000-000000000002'
  q(f"INSERT INTO auth.users VALUES('{admin}'),('{other}'); INSERT INTO ya_private.admin_members VALUES('{admin}',true);")
  def role(name,uid='',aal='aal1'):return f"SET ROLE {name}; SET request.jwt.claim.sub='{uid}'; SET request.jwt.claims='{{\"aal\":\"{aal}\",\"user_metadata\":{{\"is_admin\":true}}}}'; "
  for name,uid,aal in [('anon','','aal1'),('authenticated',other,'aal2'),('authenticated',admin,'aal1')]:
   prefix=role(name,uid,aal)
   check(f'{name}/{aal}: private archive denied',q(prefix+'SELECT * FROM ya_private.workspaces;',False).returncode!=0)
   check(f'{name}/{aal}: raw publication write denied',q(prefix+"UPDATE public.ya_publications SET document='{}';",False).returncode!=0)
   check(f'{name}/{aal}: membership self-assignment denied',q(prefix+f"INSERT INTO ya_private.admin_members VALUES('{other}',true);",False).returncode!=0)
   check(f'{name}/{aal}: publishing denied',q(prefix+"SELECT public.ya_publish_order('moda/kahve',1,ARRAY[]::text[],'unauthorized');",False).returncode!=0)
   check(f'{name}/{aal}: admin history denied',q(prefix+"SELECT public.ya_admin_history('moda/kahve');",False).returncode!=0)
   check(f'{name}/{aal}: research archive denied',q(prefix+"SELECT public.ya_admin_archive('moda/kahve');",False).returncode!=0)
  public=json.loads(q(role('anon')+"SELECT public.ya_read_publication('moda/kahve');").stdout)
  check('real four venue public projection',len(public['document']['venues'])==4)
  check('no private archive/source/review count in public projection',not any(k in json.dumps(public) for k in ['archive','sourcePageUrl','userRatingCount','reviewCount','Time Out']))
  check('unknown scope returns SQL NULL',q(role('anon')+"SELECT public.ya_read_publication('other/kahve');").stdout.strip()=='')
  ids=[v['id'] for v in public['document']['venues']];array='ARRAY['+','.join("'"+x+"'" for x in ids)+']'
  a=role('authenticated',admin,'aal2')
  check('MFA admin membership allowed',q(a+'SELECT public.ya_is_admin();').stdout.strip()=='t')
  check('MFA admin reorder is atomic',q(a+f"SELECT public.ya_publish_order('moda/kahve',1,{array},'Verified reorder');").stdout.strip()=='2')
  check('stale revision rejected',q(a+f"SELECT public.ya_publish_order('moda/kahve',1,{array},'Stale decision');",False).returncode!=0)
  check('unverified added venue rejected',q(a+"SELECT public.ya_publish_order('moda/kahve',2,ARRAY['invented'],'Wrong branch');",False).returncode!=0)
  check('duplicate branch rejected',q(a+f"SELECT public.ya_publish_order('moda/kahve',2,ARRAY['{ids[0]}','{ids[0]}'],'Duplicate branch');",False).returncode!=0)
  check('null revision rejected',q(a+f"SELECT public.ya_publish_order('moda/kahve',NULL,{array},'Null revision');",False).returncode!=0)
  check('remove saves new immutable revision',q(a+f"SELECT public.ya_publish_order('moda/kahve',2,ARRAY['{ids[0]}'],'Manual exclusion');").stdout.strip()=='3')
  check('only active revision public',q(role('anon')+'SELECT count(*) FROM public.ya_publications;').stdout.strip()=='1')
  check('admin undo creates revision, keeps history',q(a+f"SELECT public.ya_publish_order('moda/kahve',3,{array},'Undo exclusion');").stdout.strip()=='4')
  check('archive hash and all files unchanged',q("SELECT archive_sha256=(SELECT archive_sha256 FROM ya_private.workspaces LIMIT 1) AND jsonb_array_length(archive->'files')=46 FROM ya_private.workspaces;").stdout.strip()=='t')
  check('four audit events retained',q("SELECT count(*) FROM ya_private.decisions;").stdout.strip()=='4')
  q(f"UPDATE ya_private.admin_members SET active=false WHERE user_id='{admin}';")
  check('membership revocation immediate despite valid MFA JWT',q(a+'SELECT public.ya_is_admin();').stdout.strip()=='f')
  check('revoked administrator cannot publish',q(a+f"SELECT public.ya_publish_order('moda/kahve',4,{array},'Revoked member');",False).returncode!=0)
  q("UPDATE public.ya_publications SET valid_until=now()-interval '1 second';")
  check('expired publication invisible to visitors',q(role('anon')+'SELECT count(*) FROM public.ya_publications;').stdout.strip()=='0')
  run([b/'psql','-X','-w','-q','-v','ON_ERROR_STOP=1','-f',root/'supabase/proposed/20261101_publication_pipeline.sql'])
  run([b/'psql','-X','-w','-q','-v','ON_ERROR_STOP=1','-f',root/'work/release-system/pipeline-input.private.sql'])
  check('pipeline revalidates real evidence and renews expired snapshot',q(role('anon')+"SELECT jsonb_array_length(public.ya_read_publication('moda/kahve')->'document'->'venues');").stdout.strip()=='4')
  q(f"UPDATE ya_private.admin_members SET active=true WHERE user_id='{admin}';")
  head=int(q("SELECT revision FROM public.ya_publication_heads WHERE scope='moda/kahve';").stdout)
  keep='ARRAY['+','.join("'"+x+"'" for x in ids[1:])+']'
  q(a+f"SELECT public.ya_publish_order('moda/kahve',{head},{keep},'Explicit manual exclusion');")
  q("UPDATE public.ya_publications SET valid_until=now()-interval '1 second' WHERE revision=(SELECT revision FROM public.ya_publication_heads WHERE scope='moda/kahve'); UPDATE ya_private.publication_inputs SET next_check_at=now(); SELECT ya_private.publication_tick();")
  check('automatic renewal preserves manual exclusion and order',json.loads(q(role('anon')+"SELECT public.ya_read_publication('moda/kahve');").stdout)['document']['venues'][0]['id']==ids[1])
  check('automatic renewal does not re-add removed branch',q(role('anon')+"SELECT jsonb_array_length(public.ya_read_publication('moda/kahve')->'document'->'venues');").stdout.strip()=='3')
  before=int(q("SELECT revision FROM public.ya_publication_heads WHERE scope='moda/kahve';").stdout)
  q("UPDATE ya_private.publication_inputs SET next_check_at=now(); SELECT ya_private.publication_tick();")
  check('unchanged input does not create duplicate publication',int(q("SELECT revision FROM public.ya_publication_heads WHERE scope='moda/kahve';").stdout)==before)
  q("UPDATE ya_private.publication_inputs SET evidence_until=now()-interval '1 second',next_check_at=now(); SELECT ya_private.publication_tick();")
  check('expired source proof hides publication immediately',q(role('anon')+'SELECT count(*) FROM public.ya_publications;').stdout.strip()=='0')
  check('expired proof records needs-research, never renewed freshness',q("SELECT state FROM ya_private.publication_jobs ORDER BY id DESC LIMIT 1;").stdout.strip()=='needs-research')
  check('anonymous cannot run publication scheduler',q(role('anon')+'SELECT ya_private.publication_tick();',False).returncode!=0)
  summary={'environment':'local PostgreSQL17, synthetic Auth only; not Supabase Auth service','checksPassed':len(checks),'checks':checks,'productionChanges':False,'cloudConnectionVerified':False}
  (root/'work/cloud-admin/database-tests.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary))
 finally:
  if started:run([b/'pg_ctl','-D',d/'db','-m','fast','-w','stop'])
