// Local browser check. Credentials stay in process memory and are never printed.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer');
require('dotenv').config({path:'.env.local',quiet:true});
const base='http://127.0.0.1:3100';
const url=base+'/tr/moda-kadikoy-pilot';
(async()=>{
  const username=process.env.ADMIN_USER?.trim()||'admin', password=process.env.ADMIN_PASSWORD?.trim();
  assert.ok(password,'Local admin password missing');
  assert.equal((await fetch(url)).status,401);console.log('PASS anonymous local page denied');
  assert.equal((await fetch(url+'/research')).status,401);console.log('PASS anonymous research data denied');
  const auth='Basic '+Buffer.from(`${username}:${password}`).toString('base64');
  assert.equal((await fetch(url+'/research',{method:'POST',headers:{authorization:auth,origin:'https://evil.example','content-type':'application/json'},body:'{}'})).status,403);console.log('PASS live cross-origin research denied');
  const snapshot=fs.readFileSync('work/pilot-research/latest.json','utf8');
  const latestResponse=await fetch(url+'/research',{headers:{authorization:auth}});
  const latestRun=(await latestResponse.json()).run;
  const browser=await puppeteer.launch({headless:true});
  try {
    const page=await browser.newPage();await page.setViewport({width:1440,height:1000});
    await page.authenticate({username,password});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    const requests=[];
    await page.setRequestInterception(true);
    page.on('request',request=>{
      const u=new URL(request.url());
      if(!['127.0.0.1','localhost'].includes(u.hostname)&&!['data:','blob:'].includes(u.protocol))return request.abort();
      requests.push({url:request.url(),method:request.method()});return request.continue();
    });
    await page.goto(url,{waitUntil:'networkidle2',timeout:90000});
    await page.evaluate(()=>Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Otomatik Araştırma Havuzu').click());
    await page.waitForFunction(()=>document.body.innerText.includes('Gerçek kaynaklardan keşif'),{timeout:30000});
    assert.equal(fs.readFileSync('work/pilot-research/latest.json','utf8'),snapshot);
    assert.ok(!requests.some(r=>r.method==='POST' && r.url===url+'/research'));console.log('PASS page renders saved real snapshot without research execution');
    const text=await page.$eval('body',el=>el.innerText);
    assert.ok(text.includes(`${latestRun.candidates.length} aday kaydı`));assert.ok(text.includes('Erişim engelli'));console.log('PASS actual candidate count and blocked source visible');
    if(latestRun.lastAttempt){assert.ok(text.includes('Son denemede harita kaynağı okunamadı'));assert.ok(text.includes('HTTP 502'));console.log('PASS live source failure shown separately from previous valid snapshot');}
    const input=await page.$('section[aria-label="Otomatik araştırma havuzu"] input[type="search"]');await input.type('Story');
    const summary=await page.$('section[aria-label="Otomatik araştırma havuzu"] details summary');await summary.click();
    assert.ok((await page.$eval('section[aria-label="Otomatik araştırma havuzu"]',el=>el.innerText)).includes('Kaynaklar ve kaydedilen bilgiler'));console.log('PASS candidate branch, sources and missing evidence expand');
    await input.click({clickCount:3});await input.type('Guten Morgen');
    assert.ok((await page.$eval('section[aria-label="Otomatik araştırma havuzu"]',el=>el.innerText)).includes('Guten Morgen'));console.log('PASS Guten Morgen searchable without winner status');
    await page.setViewport({width:390,height:844});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));console.log('PASS mobile viewport fits');
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:'work/research/preview-mobile.png',fullPage:true});
    await page.setViewport({width:1440,height:1000});
    const responsePromise=page.waitForResponse(r=>r.url()===url+'/research'&&r.request().method()==='POST',{timeout:160000});
    await page.evaluate(()=>Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Araştırmayı çalıştır').click());
    const response=await responsePromise;assert.equal(response.status(),200);const result=await response.json();assert.ok(result.run.candidates.length>0);console.log('PASS browser button -> authenticated POST -> persisted research response'+(result.reused?' (cooldown snapshot)':''));
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('button')).some(b=>b.textContent==='Araştırmayı çalıştır'&&!b.disabled));
    assert.equal(errors.length,0,errors.join('\n'));console.log('PASS no browser runtime errors');
    await input.click({clickCount:3});await input.press('Backspace');
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:'work/research/preview-desktop.png',fullPage:true});
    console.log('Browser checks complete; no production services or external browser requests.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
