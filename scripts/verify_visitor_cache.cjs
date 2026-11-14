require('./research-ts-loader.cjs');const assert=require('node:assert/strict');
const {createVisitorCache,visitorSourceVersion}=require('../lib/pilot/integration/visitorCache.ts');
(async()=>{let n=0;const cache=createVisitorCache(15,2),load=async()=>({n:++n,items:['safe-visitor-only']});
 const values=await Promise.all(Array.from({length:100},()=>cache('rev1',load)));assert.equal(n,1);values[0].items.push('mutated');assert.equal((await cache('rev1',load)).items.length,1);
 await cache('manual-rev2',load);assert.equal(n,2);await new Promise(r=>setTimeout(r,20));await cache('manual-rev2',load);assert.equal(n,3);
 const failing=createVisitorCache();let tries=0;await assert.rejects(()=>failing('x',async()=>{tries++;throw Error('fixture');}));await failing('x',async()=>{tries++;return 'ok';});assert.equal(tries,2);
 const noLicenseRetention=createVisitorCache(30000,4,()=>false);let rated=0;await noLicenseRetention('rating',async()=>++rated);await noLicenseRetention('rating',async()=>++rated);assert.equal(rated,2);
 const bounded=createVisitorCache(30000,1);let b=0;for(const k of ['a','b','a'])await bounded(k,async()=>++b);assert.equal(b,3);
 const fs=require('node:fs').promises,originalStat=fs.stat;let revision=1;try{fs.stat=async file=>({ino:1,size:10,mtimeMs:String(file).endsWith('state.json')?revision:1,ctimeMs:1});const v1=await visitorSourceVersion();revision=2;assert.notEqual(await visitorSourceVersion(),v1);}finally{fs.stat=originalStat;}
 console.log('PASS 8 visitor-cache groups: 100 concurrent misses deduplicated, isolation, revision/TTL, failures, licensed-data bypass, bounded memory');
})().catch(e=>{console.error(e.message);process.exitCode=1});
