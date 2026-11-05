import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import puppeteer from 'puppeteer';
import {navigation,snapshot,startTimespan} from '../work/premium-performance/tooling/node_modules/lighthouse/core/index.js';
import desktopConfig from '../work/premium-performance/tooling/node_modules/lighthouse/core/config/desktop-config.js';
const stage=process.argv[2];if(!['before','after'].includes(stage))throw Error('before/after required');
const origin=process.env.PERF_ORIGIN||'http://127.0.0.1:3330',dir=path.resolve(process.env.PERF_REPORT_DIR||'work/premium-performance/'+stage);fs.mkdirSync(dir,{recursive:true});
const targets=[['cekirdek','osm-node-5764070654'],['story','osm-node-6124757286'],['guten','osm-node-8017443297'],['montag','osm-node-9375785317']];let summaries=[];
function save(result,device,run,state,mode){const lhr=result.lhr;const id=`${device}-${run}-${state}-${mode}`;fs.writeFileSync(path.join(dir,id+'.json'),JSON.stringify(lhr));
 const scores=Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,v.score===null?null:Math.round(v.score*100)]));
 const metrics=Object.fromEntries(['largest-contentful-paint','cumulative-layout-shift','total-blocking-time','interaction-to-next-paint','total-byte-weight'].map(k=>[k,lhr.audits[k]?.numericValue??null]));
 const failures=Object.values(lhr.audits).filter(x=>x.score!==null&&x.score<1&&x.scoreDisplayMode!=='informative').map(x=>({id:x.id,title:x.title,score:x.score,display:x.displayValue,details:x.details}));
 const row={device,run,state,mode,scores,metrics,runtimeError:lhr.runtimeError||null};summaries.push(row);fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify(summaries,null,2));fs.writeFileSync(path.join(dir,id+'-failures.json'),JSON.stringify(failures,null,2));console.log(JSON.stringify(row));}
const maxRuns=parseInt(process.env.PERF_RUNS||'1',10);
for(const device of (process.env.PERF_DEVICES==='mobile'?['mobile']:['mobile','desktop']))for(let run=1;run<=maxRuns;run++){
 const browser=await puppeteer.launch({executablePath:process.env.PUPPETEER_EXECUTABLE_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{const page=await browser.newPage();await page.setRequestInterception(true);page.on('request',r=>{const u=new URL(r.url());if(u.origin===origin||['data:','blob:'].includes(u.protocol))r.continue();else r.abort();});
 const config={...(device==='desktop'?desktopConfig:{extends:'lighthouse:default'}),settings:{...(device==='desktop'?desktopConfig.settings:{}),onlyCategories:['performance','accessibility','best-practices','seo'],disableStorageReset:false,maxWaitForLoad:20000,screenEmulation:device==='desktop'?{mobile:false,width:1440,height:1000,deviceScaleFactor:1,disabled:false}:{mobile:true,width:[375,390,430][run-1],height:844,deviceScaleFactor:2,disabled:false}}};
 for(const [state,url]of [['home','/tr'],['moda-coffee','/tr?region=moda&category=kahve']]){
  const result=await navigation(page,origin+url,{config});assert.ok(result);save(result,device,run,state,'navigation');
 }
 assert.equal(await page.$$eval('[data-venue-id]',a=>a.length),4);
 for(const [state,id]of targets){
  const timespan=await startTimespan(page,{config:{...config,settings:{...config.settings,onlyCategories:['performance','best-practices']}}});await page.$eval(`[data-venue-id="${id}"]`,e=>e.scrollIntoView({block:'center'}));await page.click(`[data-venue-id="${id}"]`);await page.waitForSelector('[role="dialog"]');await new Promise(r=>setTimeout(r,350));
  const span=await timespan.endTimespan();save(span,device,run,state,'timespan');
  const snap=await snapshot(page,{config:{...config,settings:{...config.settings,onlyCategories:['accessibility','best-practices','seo']}}});save(snap,device,run,state,'snapshot');await page.keyboard.press('Escape');await page.waitForSelector('[role="dialog"]',{hidden:true});
 }
 }finally{await browser.close();}
}
