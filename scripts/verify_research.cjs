require('./research-ts-loader.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const {NextRequest} = require('next/server');
const e = require('../lib/pilot/research/engine.ts');
let passed=0;
async function check(label, fn) {await fn();passed++;console.log('PASS '+label);}
const now='2026-10-29T12:00:00.000Z';
const osm=(id,name,lat=40.984,extra={})=>({type:'node',id,lat,lon:29.025,timestamp:'2026-10-28T10:00:00Z',tags:{amenity:'cafe',name,...extra}});
const parse=els=>e.parseOsm({elements:els},now).candidates;
(async()=>{
  await check('Turkish names normalize without losing branch identity',()=>assert.equal(e.brandKey('Çekirdek Coffee'),e.brandKey('Cekirdek')));
  await check('close duplicate map records merge with both source URLs',()=>{const r=e.deduplicate(parse([osm(1,'Meet Lab Coffee'),osm(2,'Meet Lab Coffee',40.98403)]));assert.equal(r.merged,1);assert.equal(r.candidates[0].evidence.length,2);});
  await check('minor coffee spelling variant at the same physical branch merges',()=>{const result=e.deduplicate(parse([osm(1,'Coffe pots'),osm(2,'Coffee Pots',40.98403)]));assert.equal(result.candidates.length,1);assert.equal(result.candidates[0].category,'coffee-signal');});
  await check('different branch addresses never merge even at same coordinate',()=>assert.equal(e.deduplicate(parse([osm(1,'Montag',40.984,{'addr:housenumber':'22'}),osm(2,'Montag',40.984,{'addr:housenumber':'16'})])).candidates.length,2));
  await check('same brand distant branches remain separate',()=>assert.equal(e.deduplicate(parse([osm(1,'Story'),osm(2,'Story',40.989)])).candidates.length,2));
  await check('different street prevents duplicate merge',()=>assert.equal(e.deduplicate(parse([osm(1,'Cafe',40.984,{'addr:street':'A'}),osm(2,'Cafe',40.984,{'addr:street':'B'})])).candidates.length,2));
  await check('last edit yesterday does not establish activity',()=>assert.equal(parse([osm(1,'A')])[0].operation,'unknown'));
  await check('recent check date is only map observation',()=>assert.equal(parse([osm(1,'A',40.984,{check_date:'2026-10-20'})])[0].operation,'recent-map-observation'));
  await check('future and stale survey dates are not current activity',()=>{for(const date of ['2027-10-01','2020-01-01'])assert.equal(parse([osm(1,'A',40.984,{check_date:date})])[0].operation,'unknown');});
  await check('disused map signal retained for review',()=>assert.equal(parse([osm(1,'A',40.984,{'disused:amenity':'cafe'})])[0].operation,'closure-signal'));
  await check('conflicting duplicate closure cannot silently become active',()=>{const r=e.deduplicate(parse([osm(1,'A'),osm(2,'A',40.984,{'disused:amenity':'cafe'})]));assert.equal(r.candidates[0].operation,'conflict');});
  await check('outside area and unnamed entries not invented',()=>{const r=e.parseOsm({elements:[osm(1,undefined),osm(2,'Outside',41.2)]},now);assert.equal(r.candidates.length,0);assert.equal(r.ignoredUnnamed,1);});
  await check('Overpass error/partial response is not an empty successful result',()=>{assert.throws(()=>e.parseOsm({elements:[],remark:'timeout'},now));assert.throws(()=>e.parseOsm({},now));});
  await check('unsafe website protocols discarded',()=>{assert.equal(e.publicWebsite('javascript:alert(1)'),null);assert.equal(e.publicWebsite('https://user:pass@example.com'),null);});
  await check('editorial facts remain brand scoped with original date',()=>{const c=parse([osm(1,'Montag'),osm(2,'Montag',40.989)]);e.attachEditorial(c,'<h3>Montag</h3><h4>ABOUT THE AUTHOR</h4><h3>Related</h3>"datePublished":"2026-03-02"',now);assert.equal(c.length,2);assert.equal(c[0].evidence[1].scope,'brand');assert.equal(c[0].evidence[1].publishedAt,'2026-03-02');assert.equal(c[0].operation,'unknown');});
  await check('editorial-only discovery retained with unknown physical branch',()=>{const c=[];e.attachEditorial(c,'<h3>New Cafe</h3>',now);assert.equal(c.length,1);assert.equal(c[0].coordinates,null);assert.equal(c[0].branchStatus,'unresolved');});
  const operator='<article><h2>Story Moda</h2><p>Caferağa Mah. Dalga Sok. No: 22, Kadıköy</p></article>';
  await check('operator corroboration requires street AND house number',()=>{const c=parse([osm(1,'Story',40.984,{'addr:street':'Dalga Sokağı','addr:housenumber':'22'}),osm(2,'Story',40.989,{'addr:street':'Other','addr:housenumber':'22'})]);e.attachOperator(c,operator,now);assert.equal(c[0].branchStatus,'address-corroborated');assert.equal(c[1].branchStatus,'map-location');});
  await check('operator does not choose an ambiguous branch',()=>{const c=parse([osm(1,'Story'),osm(2,'Story',40.989)]);e.attachOperator(c,operator,now);assert.equal(c.length,3);assert.equal(c[0].operation,'unknown');assert.equal(c[2].coordinates,null);});
  await check('parser drift fails visibly',()=>{assert.throws(()=>e.editorialNames('<html>challenge</html>'));assert.throws(()=>e.attachOperator([],'<html>changed</html>',now));});
  await check('robots wildcard and specific-agent policies respected',()=>{assert.equal(e.robotsAllowed('User-agent: *\nDisallow: /', '/istanbul/'),false);assert.equal(e.robotsAllowed('User-agent: *\nDisallow: /admin\nUser-agent: Nutch\nDisallow: /','/pages/kafelerimiz'),true);assert.equal(e.robotsAllowed('User-agent: YeriniAyirResearch\nDisallow: /\nUser-agent: *\nAllow: /','/istanbul/'),false);});
  await check('source allowlist forbids SSRF before network request',async()=>{let calls=0;await assert.rejects(()=>e.fetchText('http://127.0.0.1/',async()=>{calls++;}));assert.equal(calls,0);});
  await check('redirects and oversized sources rejected',async()=>{await assert.rejects(()=>e.fetchText(e.SOURCES.story,async()=>new Response('',{status:302})),/302/);await assert.rejects(()=>e.fetchText(e.SOURCES.story,async()=>new Response('x',{headers:{'content-length':'4000000'}})),/large/);});
  await check('all provider failures yield explicit failed run with no legacy candidates',async()=>{const run=await e.runResearch(async()=>{throw new Error('Network unavailable');},()=>new Date(now));assert.equal(run.candidates.length,0);assert.equal(run.status,'failed');assert.equal(run.sources.length,4);assert.ok(run.sources.every(s=>s.status==='failed'));assert.ok(run.coverage.every(c=>!c.candidateIds.length));});
  await check('403 robots response never triggers page request or bypass',async()=>{const urls=[];await assert.rejects(()=>e.fetchPage(e.SOURCES.ect,async url=>{urls.push(url);return new Response('',{status:403});}));assert.equal(urls.length,1);assert.match(urls[0],/robots.txt$/);});
  await check('real flow with controlled sources preserves provenance and partial failure',async()=>{
    const run=await e.runResearch(async url=>{
      if(url.startsWith(e.SOURCES.osm+'?'))return Response.json({elements:[osm(1,'Story',40.984,{'addr:street':'Dalga Sokağı','addr:housenumber':'22'})],osm3s:{timestamp_osm_base:now}});
      if(url.includes('europeancoffeetrip'))return new Response('',{status:403});
      if(url.endsWith('robots.txt'))return new Response('User-agent: *\nDisallow:');
      return new Response(url===e.SOURCES.story?operator:'<h3>New Cafe</h3>');
    },()=>new Date(now));assert.equal(run.status,'partial');assert.equal(run.candidates.length,2);assert.equal(run.sources.find(s=>s.id==='ect').status,'blocked');assert.ok(run.candidates.every(c=>c.missing.length));
  });
  // Invoke the actual Next route, replacing only disk/job boundary; direct bypass still needs auth.
  const {checkPilotAdmin,PILOT_PRIVATE_HEADERS,pilotAuthFailureHeaders}=require('../lib/pilot/adminAuth.ts');
  let executions=0,reads=0;
  const fakeStore={executeResearch:async()=>{executions++;return {run:{id:'test'},reused:false}},readLatestResearch:async()=>{reads++;return null},ResearchBusyError:class extends Error{}};
  const module={exports:{}};
  const file='app/[lang]/(admin)/moda-kadikoy-pilot/research/route.ts';
  const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  new Function('require','module','exports',js)(id=>id.endsWith('/store')?fakeStore:id.endsWith('/adminAuth')?{checkPilotAdmin,PILOT_PRIVATE_HEADERS,pilotAuthFailureHeaders}:require(id),module,module.exports);
  const {GET,POST}=module.exports;
  const saved={...process.env};process.env.ADMIN_USER='test';process.env.ADMIN_PASSWORD='temporary-test-only';delete process.env.VERCEL;
  const basic='Basic '+Buffer.from('test:temporary-test-only').toString('base64');
  const req=(method,overrides={},body='{}')=>new NextRequest('http://localhost:3000/tr/moda-kadikoy-pilot/research',{method,headers:{authorization:basic,origin:'http://localhost:3000','content-type':'application/json',...overrides},...(method==='POST'?{body}:{})});
  try {
    await check('direct research GET/POST reject bad or missing auth',async()=>{for(const authorization of ['', 'Basic aW52YWxpZA==']){assert.equal((await GET(req('GET',{authorization}))).status,401);assert.equal((await POST(req('POST',{authorization}))).status,401);}assert.equal(executions,0);assert.equal(reads,0);});
    await check('missing admin password fails closed on research endpoints',async()=>{delete process.env.ADMIN_PASSWORD;assert.equal((await POST(req('POST'))).status,503);assert.equal((await GET(req('GET'))).status,503);process.env.ADMIN_PASSWORD='temporary-test-only';});
    await check('GET only reads persisted snapshot and is private no-store',async()=>{const r=await GET(req('GET'));assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/private, no-store/);assert.equal(reads,1);assert.equal(executions,0);});
    await check('cross-origin and spoofed forwarded host rejected',async()=>{assert.equal((await POST(req('POST',{origin:'https://evil.example','x-forwarded-host':'evil.example'}))).status,403);assert.equal((await POST(req('POST',{'sec-fetch-site':'cross-site'}))).status,403);assert.equal(executions,0);});
    await check('arbitrary URLs and invalid payload rejected',async()=>{for(const body of ['[]','null','bad','{"url":"http://localhost"}'])assert.equal((await POST(req('POST',{},body))).status,400);assert.equal((await POST(req('POST',{},' '.repeat(129)))).status,413);assert.equal((await POST(req('POST',{'content-type':'text/plain'}))).status,415);assert.equal(executions,0);});
    await check('hosted environments cannot run research',async()=>{process.env.VERCEL='1';assert.equal((await POST(req('POST'))).status,403);delete process.env.VERCEL;assert.equal(executions,0);});
    await check('authorized same-origin empty POST triggers job once',async()=>{assert.equal((await POST(req('POST'))).status,200);assert.equal(executions,1);});
  } finally {for(const key of Object.keys(process.env))if(!(key in saved))delete process.env[key];Object.assign(process.env,saved);}
  const path=require('node:path');
  const temp=fs.mkdtempSync(path.join(process.cwd(),'work','research','store-test-'));
  let jobs=0,jobFails=false;
  const storeModule={exports:{}};
  const storeJs=ts.transpileModule(fs.readFileSync('lib/pilot/research/store.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
  const fakeProcess={cwd:()=>temp,env:{},pid:process.pid};
  new Function('require','module','exports','process',storeJs)(id=>id==='./engine'?{deduplicate:e.deduplicate,runResearch:async()=>{jobs++;if(jobFails)throw new Error('job failed');return {schemaVersion:1,id:'moda-test',candidates:[],sources:[],duplicatesMerged:0,completedAt:new Date().toISOString()};}}:require(id),storeModule,storeModule.exports,fakeProcess);
  const store=storeModule.exports;
  try {
    await check('missing snapshot reads null without starting a job',async()=>{assert.equal(await store.readLatestResearch(),null);assert.equal(jobs,0);});
    await check('execution persists snapshot and cooldown reuses identical run',async()=>{const first=await store.executeResearch();assert.equal(first.reused,false);assert.deepEqual(await store.readLatestResearch(),first.run);const second=await store.executeResearch();assert.equal(second.reused,true);assert.equal(jobs,1);assert.equal(second.run.id,first.run.id);});
    await check('disk lock rejects concurrent research',async()=>{const lock=path.join(temp,'work','pilot-research','run.lock');fs.writeFileSync(lock,'');await assert.rejects(()=>store.executeResearch(),store.ResearchBusyError);fs.unlinkSync(lock);assert.equal(jobs,1);});
    await check('map outage retains last usable pool with separate failed attempt provenance',async()=>{
      const folder=path.join(temp,'work','pilot-research'),latest=path.join(folder,'latest.json');
      const previous={schemaVersion:1,id:'moda-previous',candidates:[],sources:[{id:'osm',status:'ok'}],duplicatesMerged:0,completedAt:'2026-10-01T00:00:00Z'};
      const failed={schemaVersion:1,id:'moda-failed',candidates:[],sources:[{id:'osm',status:'failed',message:'HTTP 502'}],duplicatesMerged:0,completedAt:new Date().toISOString()};
      fs.writeFileSync(path.join(folder,'moda-previous.json'),JSON.stringify(previous));fs.writeFileSync(latest,JSON.stringify(failed));
      const loaded=await store.readLatestResearch();assert.equal(loaded.id,previous.id);assert.equal(loaded.completedAt,previous.completedAt);assert.equal(loaded.lastAttempt.id,failed.id);assert.equal(loaded.lastAttempt.sources[0].message,'HTTP 502');
      const before=jobs;assert.equal((await store.executeResearch()).reused,true);assert.equal(jobs,before);
      fs.unlinkSync(path.join(folder,'moda-previous.json'));fs.writeFileSync(latest,JSON.stringify({schemaVersion:1,id:'moda-test',candidates:[],sources:[],duplicatesMerged:0,completedAt:new Date().toISOString()}));
    });
    await check('job failure preserves previous snapshot and releases lock',async()=>{const latest=path.join(temp,'work','pilot-research','latest.json');const previous=JSON.parse(fs.readFileSync(latest));previous.completedAt='2020-01-01T00:00:00Z';fs.writeFileSync(latest,JSON.stringify(previous));jobFails=true;await assert.rejects(()=>store.executeResearch(),/job failed/);assert.deepEqual(await store.readLatestResearch(),previous);assert.equal(fs.existsSync(path.join(temp,'work','pilot-research','run.lock')),false);});
  } finally {fs.rmSync(temp,{recursive:true,force:true});}
  console.log(`\n${passed}/${passed} research checks passed. Fixtures are tests only; no network/database access.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
