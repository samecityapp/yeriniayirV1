const assert=require('node:assert/strict');
const fs=require('node:fs');
const puppeteer=require('puppeteer');
require('dotenv').config({path:'.env.local',quiet:true});
const base='http://127.0.0.1:3100/tr/moda-kadikoy-pilot';
(async()=>{
 const username=process.env.ADMIN_USER?.trim()||'admin',password=process.env.ADMIN_PASSWORD?.trim();assert.ok(password);
 assert.equal((await fetch(base)).status,401);console.log('PASS quality page denied without admin credentials');
 const before=fs.readFileSync('work/pilot-quality/latest.json','utf8');
 const browser=await puppeteer.launch({headless:true});
 try {
  const page=await browser.newPage();await page.setViewport({width:1440,height:1000});await page.authenticate({username,password});
  const errors=[],posts=[];page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);
  page.on('request',r=>{const u=new URL(r.url());if(!['127.0.0.1','localhost'].includes(u.hostname)&&!['data:','blob:'].includes(u.protocol))return r.abort();if(r.method()==='POST'&&r.url().endsWith('/research'))posts.push(r.url());return r.continue();});
  await page.goto(base,{waitUntil:'networkidle2',timeout:90000});
  await page.evaluate(()=>Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Kalite & Ürün Araştırması').click());
  const panel='section[aria-label="Kalite ve ürün araştırması"]';
  await page.waitForFunction(()=>document.body.innerText.includes('Kalite ve Ürün Araştırması • Aşama 2'));
  assert.equal((await page.$$('[data-quality-candidate]')).length,10);console.log('PASS default comparison shows 10 real research dossiers');
  const text=await page.$eval(panel,e=>e.innerText);for(const word of ['91 kahve','20 ayrıntılı','32 kaynak','Guten Morgen','Coffee Manifesto','2020','Ek Araştırma'])assert.ok(text.includes(word),word);
  assert.ok(text.includes('Menüde bulunmak, iyi yapılmış olduğunun kanıtı değildir'));console.log('PASS specific products, old dates, branch conflict and evidence gaps visible');
  const clickLabel=async name=>{await page.$eval(panel,(root,name)=>{const label=Array.from(root.querySelectorAll('label')).find(l=>l.innerText.includes(name));label.querySelector('input[type="checkbox"]').click();},name);};
  await clickLabel('Meet Lab');assert.ok((await page.$eval(panel,e=>e.innerText)).includes('En fazla 10 aday'));assert.equal((await page.$$('[data-quality-candidate]')).length,10);console.log('PASS comparison selection capped at 10');
  await clickLabel('Guten Morgen');await page.waitForFunction(()=>document.querySelectorAll('[data-quality-candidate]').length===9);await clickLabel('Meet Lab');await page.waitForSelector('[data-quality-candidate="osm-node-14302332555"]');console.log('PASS less visible candidate can be added without ranking');
  await clickLabel('Meet Lab');await clickLabel('Guten Morgen');
  await page.$eval(panel,root=>Array.from(root.querySelectorAll('summary')).find(s=>s.innerText.includes('Tüm ön kontrol havuzu')).click());
  assert.equal((await page.$$(panel+' tbody tr')).length,95);console.log('PASS all 91 signals plus 4 recovered candidates remain reviewable');
  await page.$eval(panel,root=>Array.from(root.querySelectorAll('summary')).find(s=>s.innerText.includes('Engellenen / sayımdan')).click());
  const visible=await page.$eval(panel,e=>e.innerText);assert.ok(visible.includes('Lenovo'));assert.ok(visible.includes('403'));console.log('PASS sponsorship and blocked source limitations shown explicitly');
  await page.setViewport({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));console.log('PASS mobile layout fits screen');
  await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'work/research/quality-mobile.png',fullPage:false});
  await page.setViewport({width:1440,height:1000});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'work/research/quality-desktop.png',fullPage:false});
  assert.equal(fs.readFileSync('work/pilot-quality/latest.json','utf8'),before);assert.equal(posts.length,0);assert.deepEqual(errors,[]);console.log('PASS no research jobs on page navigation, no data mutation or browser runtime errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
