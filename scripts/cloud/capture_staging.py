"""Masked local setup only; no APIs, account changes or network connections."""
import json,os,pathlib,re,subprocess,sys,urllib.parse
ref=sys.argv[1] if len(sys.argv)>=2 else '';action=sys.argv[2] if len(sys.argv)>=3 else 'key'
if not re.fullmatch(r'[a-z]{20}',ref) or ref=='jerkkxwgddujigsbeqwo' or action not in ['key','database','setup-secret']:raise RuntimeError('Confirmed non-production project and setup step required')
path=pathlib.Path('work/cloud-admin/staging-connection.private.json')
def ask(prompt):
 script='text returned of (display dialog '+json.dumps(prompt,ensure_ascii=False)+' default answer "" with hidden answer buttons {"Vazgeç", "Kaydet"} default button "Kaydet")'
 p=subprocess.run(['/usr/bin/osascript','-e',script],capture_output=True,text=True,timeout=300)
 if p.returncode:raise RuntimeError('Private setup cancelled')
 return p.stdout.strip()
if action=='key':
 if path.exists():raise RuntimeError('Existing private staging key retained')
 key=ask('Yalnızca YeriniAyir-Staging publishable/anon anahtarını yapıştır. Sohbete, loga veya Git’e yazılmayacak. Production, secret/service_role anahtarı veya hesap şifresi değil.')
 if key.startswith('sb_secret_') or not (key.startswith('sb_publishable_') or key.startswith('eyJ')):raise RuntimeError('Publishable/anon key required')
 if key.startswith('eyJ'):
  import base64
  claim=json.loads(base64.urlsafe_b64decode(key.split('.')[1]+'==='))
  if claim.get('role')!='anon' or claim.get('ref')!=ref:raise RuntimeError('Wrong key role/project')
 config={'ref':ref,'url':'https://'+ref+'.supabase.co','anonKey':key}
 fd=os.open(path,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
 with os.fdopen(fd,'w') as f:json.dump(config,f)
elif action=='setup-secret':
 config=json.loads(path.read_text())
 if config['ref']!=ref or 'setupSecret' in config:raise RuntimeError('Existing configuration retained; wrong setup step')
 key=ask('Yalnızca YeriniAyir-Staging Secret/service_role anahtarını gir. Sadece sentetik test hesaplarının kurulumu için özel yerel dosyada tutulur; site koduna veya production’a eklenmez.')
 if key.startswith('eyJ'):
  import base64
  claim=json.loads(base64.urlsafe_b64decode(key.split('.')[1]+'==='))
  if claim.get('role')!='service_role' or claim.get('ref')!=ref:raise RuntimeError('Wrong setup key role/project')
 elif not key.startswith('sb_secret_'):raise RuntimeError('Staging server setup key required')
 config['setupSecret']=key
 temp=path.with_suffix('.tmp');fd=os.open(temp,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
 with os.fdopen(fd,'w') as f:json.dump(config,f)
 os.replace(temp,path)
else:
 config=json.loads(path.read_text())
 if config['ref']!=ref or 'database' in config:raise RuntimeError('Existing configuration retained; wrong setup step')
 url=urllib.parse.urlsplit(ask('Staging → Connect → Session pooler bağlantısını yapıştır. Port 5432 olmalı. YOUR-PASSWORD yer tutucusu kalabilir; parolayı sonraki maskeli alanda isteyeceğim.'))
 user=urllib.parse.unquote(url.username or '');password=urllib.parse.unquote(url.password or '')
 if url.scheme not in ['postgres','postgresql'] or url.port!=5432 or url.path!='/postgres' or url.query or url.fragment:raise RuntimeError('Standard session/direct connection required')
 valid=(url.hostname=='db.'+ref+'.supabase.co' and user=='postgres') or (re.fullmatch(r'aws-[0-9]+-[a-z0-9-]+\.pooler\.supabase\.com',url.hostname or '') and user=='postgres.'+ref)
 if not valid:raise RuntimeError('Wrong staging connection')
 if not password or 'PASSWORD' in password:password=ask('Yalnızca YeriniAyir-Staging oluştururken belirlediğin DATABASE PASSWORD parolasını gir. Supabase hesap giriş şifren değil.')
 if not password or 'PASSWORD' in password:raise RuntimeError('Actual staging database password required')
 config['database']={'host':url.hostname,'port':5432,'user':user,'password':password,'database':'postgres'}
 temp=path.with_suffix('.tmp');fd=os.open(temp,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
 with os.fdopen(fd,'w') as f:json.dump(config,f)
 os.replace(temp,path)
print('Staging '+action+' saved locally with mode 0600; no values printed, no connection or transfer performed')
