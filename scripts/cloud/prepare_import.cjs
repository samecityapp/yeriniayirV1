// Generates private review files only. No connection, import, email or API call.
require('./loader.cjs');const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
process.env.GASTRONOMY_DATA_SOURCE='local';
const {readIntegrationDiscovery}=require('../../lib/pilot/integration/discovery.ts'),{publicationDocument}=require('../../lib/cloud/contracts.ts');
(async()=>{const raw=await readIntegrationDiscovery();assert.ok(raw);assert.equal(raw.venues.length,4);assert.ok(raw.venues.every(v=>v.ratings.length===0&&v.photo===null),'Licensed data requires separate handling; never silently discarded');
const document=publicationDocument.parse(raw),manifest=JSON.parse(fs.readFileSync('work/cloud-admin/source-manifest.json')),files=[];
for(const entry of manifest){const bytes=fs.readFileSync(entry.path);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256,'Source changed since isolation');files.push({path:entry.path,sha256:entry.sha256,data:JSON.parse(bytes)});}
const archive={schemaVersion:1,files};const archiveText=JSON.stringify(archive),hash=crypto.createHash('sha256').update(archiveText).digest('hex');
// A one-hour staging lease, not an assertion that source evidence remains valid indefinitely.
const validUntil=new Date(Date.now()+3600_000).toISOString();
const bundle={scope:'moda/kahve',validUntil,document,archive,archiveSha256:hash};
fs.writeFileSync('work/cloud-admin/import.private.json',JSON.stringify(bundle),{mode:0o600});
const literal=value=>{const tag='$ya_'+crypto.randomBytes(8).toString('hex')+'$';const text=typeof value==='string'?value:JSON.stringify(value);assert.ok(!text.includes(tag));return tag+text+tag;};
const sql=`BEGIN;\n-- Explicit initial import only; existing workspace causes failure, never overwrite.\nINSERT INTO ya_private.workspaces(scope,canonical,archive,archive_sha256,valid_until) VALUES(${literal(bundle.scope)},${literal(document)}::jsonb,${literal(archive)}::jsonb,${literal(hash)},${literal(validUntil)});\nINSERT INTO public.ya_publications VALUES(${literal(bundle.scope)},1,${literal(document)}::jsonb,${literal(validUntil)});\nINSERT INTO public.ya_publication_heads VALUES(${literal(bundle.scope)},1);\nINSERT INTO ya_private.decisions(scope,revision,actor,reason,branch_order) VALUES(${literal(bundle.scope)},1,NULL,'Verified local import; staging only',ARRAY[${document.venues.map(v=>literal(v.id)).join(',')}]);\nCOMMIT;\n`;
fs.writeFileSync('work/cloud-admin/import.private.sql',sql,{mode:0o600});
const summary={branches:document.venues.map(v=>({id:v.id,name:v.name,recommended:v.whatToOrder.length,menu:v.menuFrom.length})),archiveFiles:files.length,archiveBytes:Buffer.byteLength(archiveText),visitorBytes:Buffer.byteLength(JSON.stringify(document)),archiveSha256:hash,sourceFilesUnchanged:true,networkRequests:0,productionChanges:false,stagingLeaseHours:1};fs.writeFileSync('work/cloud-admin/import-summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));})().catch(e=>{console.error(e.message);process.exitCode=1;});
