// No keys in arguments or output. Explicit isolated test project required.
const fs=require('fs'),{spawn}=require('child_process');const c=JSON.parse(fs.readFileSync('work/cloud-admin/staging-connection.private.json'));
if(c.ref==='jerkkxwgddujigsbeqwo'||!c.url.endsWith(c.ref+'.supabase.co'))throw Error('Non-production staging required');
const env={...process.env,GASTRONOMY_SUPABASE_URL:c.url,GASTRONOMY_SUPABASE_REF:c.ref,GASTRONOMY_SUPABASE_ANON_KEY:c.anonKey,GASTRONOMY_CLOUD_ENV:'staging',GASTRONOMY_DATA_SOURCE:'supabase',GASTRONOMY_AUTH_MODE:'supabase',GASTRONOMY_LOCAL_PREVIEW:'1'};
// Bind loopback only; no public preview or production activation.
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3401'],{env,stdio:'inherit'});child.on('exit',code=>process.exitCode=code||0);
