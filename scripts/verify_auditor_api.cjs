require('./research-ts-loader.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),{NextRequest}=require('next/server');
const auth=require('../lib/pilot/adminAuth.ts');let writes=0,runs=0,passed=0;const view={revision:0};class AuditorError extends Error{constructor(message,status){super(message);this.status=status;}}
const store={AuditorError,readAuditorView:async()=>view,enqueueAudit:async()=>{writes++;},runNextAudit:async()=>{runs++;},retryAudit:async()=>{writes++;},undoAuditCorrections:async()=>{writes++;},setPeriodicAudit:async()=>{writes++;}};
const m={exports:{}},js=ts.transpileModule(fs.readFileSync('app/[lang]/(admin)/moda-kadikoy-pilot/auditor/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
new Function('require','module','exports',js)(id=>id.endsWith('/store')?store:id.endsWith('/adminAuth')?auth:require(id),m,m.exports);
const saved={...process.env};process.env.ADMIN_USER='test';process.env.ADMIN_PASSWORD='ephemeral-test-only';process.env.NODE_ENV='test';delete process.env.VERCEL;
const authorization='Basic '+Buffer.from('test:ephemeral-test-only').toString('base64');
const req=(method='POST',body={type:'check',geoId:'moda',category:'coffee'},headers={})=>new NextRequest('http://localhost:3100/tr/moda-kadikoy-pilot/auditor',{method,headers:{authorization,origin:'http://localhost:3100','content-type':'application/json',...headers},...(method==='POST'?{body:typeof body==='string'?body:JSON.stringify(body)}:{})});
async function check(label,fn){await fn();passed++;console.log('PASS '+label);}
(async()=>{try{
 await check('GET/POST enforce independent authentication',async()=>{for(const method of ['GET','POST'])assert.equal((await m.exports[method](req(method,{}, {authorization:''}))).status,401);assert.equal(writes,0);});
 await check('missing credentials fail closed',async()=>{delete process.env.ADMIN_PASSWORD;assert.equal((await m.exports.POST(req())).status,503);process.env.ADMIN_PASSWORD='ephemeral-test-only';});
 await check('foreign origin and cross-site requests cannot mutate',async()=>{for(const headers of [{origin:'https://evil.example'},{'sec-fetch-site':'cross-site'}])assert.equal((await m.exports.POST(req('POST',{},headers))).status,403);assert.equal(writes,0);});
 await check('production and hosted environments deny correction operations',async()=>{process.env.NODE_ENV='production';assert.equal((await m.exports.POST(req())).status,403);process.env.NODE_ENV='test';process.env.VERCEL='1';assert.equal((await m.exports.POST(req())).status,403);delete process.env.VERCEL;assert.equal(writes,0);});
 await check('invalid JSON/type/oversize bodies rejected before store',async()=>{for(const body of ['bad','null','[]',{type:'unknown'},{type:'check'},{type:'periodic',enabled:'true'}])assert.equal((await m.exports.POST(req('POST',body))).status,400);assert.equal((await m.exports.POST(req('POST','x'.repeat(2049)))).status,413);assert.equal((await m.exports.POST(req('POST',{}, {'content-type':'text/plain'}))).status,415);assert.equal(writes,0);});
 await check('province planning cannot launch network jobs',async()=>{assert.equal((await m.exports.POST(req('POST',{type:'check',geoId:'istanbul',category:'all'}))).status,200);assert.equal(writes,1);assert.equal(runs,0);});
 await check('explicit Moda coffee request launches bounded worker once',async()=>{assert.equal((await m.exports.POST(req())).status,200);assert.equal(writes,2);assert.equal(runs,1);});
 await check('GET remains private read-only without research',async()=>{const r=await m.exports.GET(req('GET'));assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/private, no-store/);assert.equal(writes,2);assert.equal(runs,1);});
 console.log(`\n${passed}/${passed} auditor API security checks passed; mocked persistence/network only.`);
 }finally{for(const key of Object.keys(process.env))if(!(key in saved))delete process.env[key];Object.assign(process.env,saved);}})().catch(e=>{console.error(e);process.exitCode=1;});
