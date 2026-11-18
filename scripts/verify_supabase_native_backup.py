"""Synthetic local PostgreSQL test; no production credentials, DNS or network listener."""
import importlib.util, os, subprocess, tempfile, pathlib, json
spec=importlib.util.spec_from_file_location('recovery',pathlib.Path(__file__).with_name('supabase_native_recovery.py'))
r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
bin=r.BIN

def call(args,env=None):
 p=subprocess.run([str(x)for x in args],env=env,capture_output=True,text=True,timeout=40)
 if p.returncode:raise RuntimeError('Synthetic test failed: '+str(args[0])+' (raw output withheld)')
 return p.stdout

with tempfile.TemporaryDirectory(prefix='ya-pg-',dir='/private/tmp')as tmp:
 folder=pathlib.Path(tmp);data=folder/'db';sock=folder/'socket';sock.mkdir(mode=0o700)
 env={'PATH':str(bin)+':/usr/bin:/bin','LC_ALL':'C','PGHOST':str(sock),'PGPORT':'55434','PGUSER':'postgres','PGDATABASE':'postgres','PGPASSWORD':'SYNTHETIC-CANARY-NOT-A-REAL-SECRET'}
 call([bin/'initdb','-D',data,'-A','trust','-U','postgres','--no-locale'])
 started=False
 try:
  call([bin/'pg_ctl','-D',data,'-l',folder/'server.log','-o',"-k "+str(sock)+" -p 55434 -c listen_addresses='' -c fsync=off",'-w','start']);started=True
  def query(sql,selected=env):return call([bin/'psql','-X','-w','-A','-t','-v','ON_ERROR_STOP=1','-c',sql],selected)
  query("CREATE ROLE anon; CREATE ROLE authenticated; CREATE SCHEMA auth; CREATE SCHEMA storage; CREATE TABLE public.profiles(id integer,is_admin boolean); INSERT INTO public.profiles VALUES(1,false); ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY; CREATE POLICY fixture_policy ON public.profiles FOR SELECT TO anon USING(false); CREATE TABLE auth.users(id integer); INSERT INTO auth.users VALUES(2); CREATE TABLE storage.objects(id integer); INSERT INTO storage.objects VALUES(3);")
  readonly={**env,'PGOPTIONS':'-c default_transaction_read_only=on -c lock_timeout=3000 -c statement_timeout=15000'}
  for name in r.VARIANTS:
   script=r.WORK/'native-templates'/(name+'.sh')
   text=script.read_text();assert 'PGPASSWORD=' not in text and 'synthetic-project' not in text
   result=call(['/bin/bash',script],readonly)
   assert env['PGPASSWORD'] not in result
   (folder/(name+'.sql')).write_text(result)
  print('PASS four CLI-derived dumps execute natively with a read-only session and no Docker')
  query('CREATE DATABASE ya_restore;')
  restore={**env,'PGDATABASE':'ya_restore'}
  for name in ['schema','managed-schema','data']:
   call([bin/'psql','-X','-w','-v','ON_ERROR_STOP=1','-f',folder/(name+'.sql')],restore)
  assert query('SELECT count(*) FROM public.profiles;',restore).strip()=='1'
  assert query('SELECT count(*) FROM auth.users;',restore).strip()=='1'
  assert query('SELECT count(*) FROM storage.objects;',restore).strip()=='1'
  assert query("SELECT count(*) FROM pg_policies WHERE policyname='fixture_policy';",restore).strip()=='1'
  print('PASS synthetic restore preserves public/auth/storage rows and RLS policy')
  rejected=subprocess.run([str(bin/'psql'),'-X','-w','-v','ON_ERROR_STOP=1','-c','INSERT INTO public.profiles VALUES(99,true);'],env=readonly,capture_output=True,text=True)
  assert rejected.returncode!=0 and 'read-only' in rejected.stderr
  print('PASS write attempt rejected while database backup connection is read-only')
  good={'projectRef':r.EXPECTED,'host':'db.'+r.EXPECTED+'.supabase.co','port':5432,'user':'postgres','database':'postgres','password':'synthetic-fixture'}
  assert r.pg_env(good)['PGSSLMODE']=='verify-full'
  for patch in [{'projectRef':'wrong'},{'host':'evil.example'},{'port':6543},{'password':''},{'user':'wrong'}]:
   try:r.validate_connection({**good,**patch})
   except ValueError:pass
   else:raise AssertionError('Unsafe connection accepted')
  print('PASS TLS validation and five unsafe connection cases fail closed')
 finally:
  if started:call([bin/'pg_ctl','-D',data,'-m','fast','-w','stop'])
print('PASS synthetic local test complete; temporary database removed; no production access')
