"""Tests the proposed hold against synthetic local PostgreSQL only."""
import importlib.util,pathlib,tempfile,subprocess,json
root=pathlib.Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('recovery',root/'scripts/supabase_native_recovery.py');r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
hold=root/'supabase/operations/20261031_emergency_write_hold.sql';rollback=hold.with_name('20261031_emergency_write_hold.rollback.sql')
import re
targets=sorted(set(re.findall(r'ON "([a-z_]+)"\."([a-z_]+)"',hold.read_text())))
with tempfile.TemporaryDirectory(prefix='ya-hold-',dir='/private/tmp')as tmp:
 d=pathlib.Path(tmp);sock=d/'socket';sock.mkdir(mode=0o700);pg=d/'db';b=r.BIN
 env={'PATH':str(b)+':/usr/bin:/bin','LC_ALL':'C','PGHOST':str(sock),'PGPORT':'55435','PGUSER':'postgres','PGDATABASE':'postgres'}
 def call(args):
  p=subprocess.run([str(x)for x in args],env=env,capture_output=True,text=True,timeout=40)
  if p.returncode:raise RuntimeError('Synthetic SQL test failed; raw output withheld')
  return p.stdout.strip()
 def q(s):return call([b/'psql','-X','-w','-A','-t','-v','ON_ERROR_STOP=1','-c',s])
 call([b/'initdb','-D',pg,'-A','trust','-U','postgres','--no-locale']);started=False
 try:
  call([b/'pg_ctl','-D',pg,'-l',d/'server.log','-o',"-k "+str(sock)+" -p 55435 -c listen_addresses='' -c fsync=off",'-w','start']);started=True
  q('CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA storage; GRANT USAGE ON SCHEMA public,storage TO anon,authenticated,service_role;')
  for schema,table in targets:
   full=f'"{schema}"."{table}"'
   q(f'CREATE TABLE {full}(id integer); INSERT INTO {full} VALUES(1); ALTER TABLE {full} ENABLE ROW LEVEL SECURITY; GRANT ALL ON {full} TO anon,authenticated,service_role; CREATE POLICY fixture_original ON {full} FOR ALL TO anon,authenticated USING(true) WITH CHECK(true);')
  call([b/'psql','-X','-w','-v','ON_ERROR_STOP=1','-f',hold])
  checks=0
  for schema,table in targets:
   full=f'"{schema}"."{table}"'
   for role in ['anon','authenticated']:
    assert q(f'SET ROLE {role}; SELECT count(*) FROM {full};').splitlines()[-1]=='1'
    failure=subprocess.run([str(b/'psql'),'-X','-w','-v','ON_ERROR_STOP=1','-c',f'SET ROLE {role}; INSERT INTO {full} VALUES(2);'],env=env,capture_output=True,text=True)
    assert failure.returncode!=0 and 'row-level security' in failure.stderr
    q(f'SET ROLE {role}; UPDATE {full} SET id=9; DELETE FROM {full};')
    assert q(f'SELECT id FROM {full};')=='1';checks+=3
   q(f'SET ROLE service_role; INSERT INTO {full} VALUES(2); DELETE FROM {full} WHERE id=2;');checks+=1
  call([b/'psql','-X','-w','-v','ON_ERROR_STOP=1','-f',rollback])
  assert q("SELECT count(*) FROM pg_policies WHERE policyname LIKE 'ya_v1_hold_%';")=='0'
  assert q("SELECT count(*) FROM pg_policies WHERE policyname='fixture_original';")==str(len(targets))
  for schema,table in targets:q(f'SET ROLE anon; INSERT INTO "{schema}"."{table}" VALUES(3);')
  print('PASS',checks,'write-hold checks across',len(targets),'synthetic tables; reads/service-role preserved; rollback restores original policy behavior')
 finally:
  if started:call([b/'pg_ctl','-D',pg,'-m','fast','-w','stop'])
