"""Actual 87 production policy definitions; synthetic rows on local PostgreSQL only."""
import pathlib,tempfile,subprocess,json,importlib.util
root=pathlib.Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('r',root/'scripts/supabase_native_recovery.py');r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
source=json.loads((root/'work/free-capacity/production-inventory.private.json').read_text())
policies=source['policies'];assert len(policies)==87
old=[p for p in policies if not p['name'].startswith('ya_v1_hold_')];hold=[p for p in policies if p['name'].startswith('ya_v1_hold_')]
assert len(old)==45 and len(hold)==42
quote=lambda x:'"'+x.replace('"','""')+'"'
def ddl(p):
 roles=','.join('PUBLIC'if x=='public'else quote(x)for x in p['roles'])
 s=f"CREATE POLICY {quote(p['name'])} ON {quote(p['schema'])}.{quote(p['table_name'])} AS {p['permissive']} FOR {p['cmd']} TO {roles}"
 if p['qual']is not None:s+=' USING ('+p['qual']+')'
 if p['with_check']is not None:s+=' WITH CHECK ('+p['with_check']+')'
 return s+';'
targets=sorted({(p['schema'],p['table_name'])for p in policies});protected=sorted({(p['schema'],p['table_name'])for p in hold})
with tempfile.TemporaryDirectory(prefix='ya-real-rls-',dir='/private/tmp')as tmp:
 d=pathlib.Path(tmp);sock=d/'sock';sock.mkdir(mode=0o700);pg=d/'db';b=r.BIN
 env={'PATH':str(b)+':/usr/bin:/bin','LC_ALL':'C','PGHOST':str(sock),'PGPORT':'55436','PGUSER':'postgres','PGDATABASE':'postgres'}
 def run(args,ok=True):
  p=subprocess.run([str(x)for x in args],env=env,capture_output=True,text=True,timeout=40)
  if ok and p.returncode:raise RuntimeError('Local policy test failed; raw details withheld')
  return p
 def q(sql):return run([b/'psql','-X','-w','-A','-t','-q','-v','ON_ERROR_STOP=1','-c',sql]).stdout.strip()
 run([b/'initdb','-D',pg,'-A','trust','-U','postgres','--no-locale']);started=False
 try:
  run([b/'pg_ctl','-D',pg,'-l',d/'server.log','-o',"-k "+str(sock)+" -p 55436 -c listen_addresses='' -c fsync=off",'-w','start']);started=True
  q("CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE unauthorised_member IN ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE SCHEMA storage; CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT current_setting('request.jwt.claim.role',true) $$; GRANT USAGE ON SCHEMA public,auth,storage TO anon,authenticated,unauthorised_member,service_role;")
  for schema,table in targets:
   full=quote(schema)+'.'+quote(table)
   q(f"CREATE TABLE {full}(id integer PRIMARY KEY,deleted_at timestamptz,is_published boolean,bucket_id text); INSERT INTO {full} VALUES(1,NULL,true,'hotel-images'),(2,NULL,true,'hotel-videos'),(3,NULL,true,'images'); ALTER TABLE {full} ENABLE ROW LEVEL SECURITY; GRANT ALL ON {full} TO anon,authenticated,unauthorised_member,service_role;")
  for p in old:q(ddl(p))
  # Demonstrate the actual baseline exploit only on synthetic local rows.
  assert q("SET ROLE anon; INSERT INTO public.restaurants VALUES(80,NULL,true,'hotel-images'); SELECT count(*) FROM public.restaurants WHERE id=80;")=='1'
  q('DELETE FROM public.restaurants WHERE id=80;')
  roles=[('anon','anon'),('authenticated','authenticated'),('unauthorised_member','authenticated'),('authenticated','admin')]
  before={}
  for role,claim in roles:
   for schema,table in targets:
    before[(role,claim,schema,table)]=q(f"SET ROLE {quote(role)}; SET request.jwt.claim.role='{claim}'; SELECT count(*) FROM {quote(schema)}.{quote(table)};")
  for p in hold:q(ddl(p))
  assert q('SELECT count(*) FROM pg_policies;')=='87'
  checks=0
  for role,claim in roles:
   prefix=f"SET ROLE {quote(role)}; SET request.jwt.claim.role='{claim}'; "
   for schema,table in targets:
    assert q(prefix+f'SELECT count(*) FROM {quote(schema)}.{quote(table)};')==before[(role,claim,schema,table)];checks+=1
   for schema,table in protected:
    full=quote(schema)+'.'+quote(table)
    for bucket in (['hotel-images','hotel-videos','images']if schema=='storage'else['hotel-images']):
     p=run([b/'psql','-X','-w','-q','-v','ON_ERROR_STOP=1','-c',prefix+f"INSERT INTO {full} VALUES(99,NULL,true,'{bucket}');"],False)
     assert p.returncode!=0 and 'row-level security'in p.stderr;checks+=1
    for cmd in [f'UPDATE {full} SET is_published=false RETURNING id',f'DELETE FROM {full} RETURNING id']:
     assert q(prefix+'WITH changed AS ('+cmd+') SELECT count(*) FROM changed;')=='0';checks+=1
    assert q(f'SELECT count(*) FROM {full};')=='3';checks+=1
  # Show OR of old permissive rules cannot defeat AND false on restrictive write rules.
  result={'environment':'Local PostgreSQL 17, UNIX socket only; synthetic rows, actual policy definitions','productionProject':'jerkkxwgddujigsbeqwo','productionChanges':False,'originalPermissivePolicies':45,'newRestrictivePolicies':42,'combinedPolicies':87,'protectedRelations':len(protected),'checkedPolicyRelations':len(targets),'roleScenarios':4,'checksPassed':checks,'baselineAnonymousInsertWorked':True,'allInsertsRejected':True,'updatesAndDeletesAffectedZeroRows':True,'readCountsPreserved':True,'forgedJwtRoleCannotBypassDatabaseRole':True,'rule':'OR(applicable PERMISSIVE) AND AND(applicable RESTRICTIVE); false restrictive write rule denies writes'}
  (root/'work/free-capacity/actual-rls-test.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
 finally:
  if started:run([b/'pg_ctl','-D',pg,'-m','fast','-w','stop'])
