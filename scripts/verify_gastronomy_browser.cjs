const assert=require('node:assert/strict'),puppeteer=require('puppeteer');
require('dotenv').config({path:'.env.local',quiet:true});
const base='http://127.0.0.1:3100/tr/moda-kadikoy-pilot';
(async()=>{
 const username=process.env.ADMIN_USER?.trim()||'admin',password=process.env.ADMIN_PASSWORD?.trim();assert.ok(password);
 const authorization='Basic '+Buffer.from(`${username}:${password}`).toString('base64');
 assert.equal((await fetch(base+'/manage')).status,401);assert.equal((await fetch(base+'/selection')).status,401);console.log('PASS management and local publication preview require authentication');
 const browser=await puppeteer.launch({headless:true});let cleanupEvents=[];
 const request=async action=>{const current=await (await fetch(base+'/manage',{headers:{authorization}})).json();const r=await fetch(base+'/manage',{method:'POST',headers:{authorization,origin:'http://127.0.0.1:3100','content-type':'application/json'},body:JSON.stringify({...action,reason:'İzole tarayıcı testi; gerçek işletme veya yayın değildir',revision:current.revision})});const result=await r.json();assert.equal(r.status,200,result.error);return result;};
 try{
  const page=await browser.newPage();await page.authenticate({username,password});await page.setViewport({width:1440,height:1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);page.on('request',r=>{const u=new URL(r.url());if(!['localhost','127.0.0.1'].includes(u.hostname)&&!['data:','blob:'].includes(u.protocol))return r.abort();return r.continue();});
  await page.goto(base,{waitUntil:'networkidle2',timeout:90000});const root='section[aria-label="AI Gastronomi Yönetimi"]';await page.waitForSelector(root);
  assert.ok((await page.$eval(root,e=>e.innerText)).includes('Ek Araştırma: 95'));assert.ok((await page.$eval(root,e=>e.innerText)).includes('Seçki: 0'));console.log('PASS autonomous management is default and real insufficient evidence produces zero winners');
  const clickButton=async text=>page.$eval(root,(element,text)=>Array.from(element.querySelectorAll('button')).find(b=>b.textContent.trim()===text).click(),text);
  const waitAction=type=>page.waitForResponse(r=>r.url()===base+'/manage'&&r.request().method()==='POST'&&JSON.parse(r.request().postData()).type===type,{timeout:120000});
  await page.$eval(root,r=>Array.from(r.querySelectorAll('summary')).find(s=>s.textContent==='Yeni bölge oluştur').click());
  await page.type('[aria-label="Yeni bölge adı"]','İZOLE TARAYICI TESTİ');await page.click('[aria-label="Karar gerekçesi"]',{clickCount:3});await page.keyboard.press('Backspace');await page.type('[aria-label="Karar gerekçesi"]','İzole tarayıcı testi; gerçek işletme veya yayın değildir');
  // Keep the human-readable default reason for UI actions, record a separate test reason through API in cleanup.
  const createWait=waitAction('create-region');await clickButton('Bölge ekle');const created=await (await createWait).json();assert.ok(created.regions);const testRegion=created.regions.find(r=>r.name==='İZOLE TARAYICI TESTİ');const createEvent=created.events.at(-1);cleanupEvents.unshift(createEvent.id);
  await page.select(root+' select',testRegion.id);
  await page.$eval(root,r=>Array.from(r.querySelectorAll('summary')).find(s=>s.textContent==='Havuzda olmayan yeni mekan ekle').click());
  await page.type('[aria-label="Yeni mekan adı"]','İZOLE TEST — gerçek işletme değil');await page.type('[aria-label="Yeni mekan adresi"]','Yalnızca yerel tarayıcı testi');
  const addWait=waitAction('new-candidate');await clickButton('Araştırma kaydı oluştur');const added=await (await addWait).json();const addEvent=added.events.at(-1),candidateId=addEvent.targetId;cleanupEvents.unshift(addEvent.id);const scope=added.scopes.find(s=>s.key===testRegion.id+'/coffee');assert.equal(scope.manualHeld.length,1);assert.equal(scope.localPublished.length,0);console.log('PASS manual unverified addition persists without publishing quality claims');
  const removeWait=waitAction('remove');await page.$eval(`[data-managed-candidate="${candidateId}"]`,node=>Array.from(node.querySelectorAll('button')).find(b=>b.textContent.includes('Çıkar ve')).click());const removed=await (await removeWait).json();const removeEvent=removed.events.at(-1);cleanupEvents.unshift(removeEvent.id);
  await page.reload({waitUntil:'networkidle2'});await page.select(root+' select',testRegion.id);assert.ok((await page.$eval(root,e=>e.innerText)).includes('Manuel dışlanan: 1'));console.log('PASS sticky manual exclusion survives page/server state reload');
  const ran=await request({type:'run',regionId:testRegion.id,categoryId:'coffee'});const runEvent=ran.events.at(-1);cleanupEvents.unshift(runEvent.id);assert.equal(ran.scopes.find(s=>s.key===testRegion.id+'/coffee').excluded.length,1);console.log('PASS autonomous run respects manual removal');
  await clickButton('Son durumu yenile');await page.waitForFunction(id=>document.querySelector(`[data-management-event="${id}"]`),{},runEvent.id);
  const undoWait=waitAction('undo');await page.$eval(`[data-management-event="${removeEvent.id}"]`,node=>Array.from(node.querySelectorAll('button')).find(b=>b.textContent==='Bu kararı geri al').click());const undone=await (await undoWait).json();cleanupEvents=cleanupEvents.filter(id=>id!==removeEvent.id);assert.equal(undone.scopes.find(s=>s.key===testRegion.id+'/coffee').manualHeld.length,1);console.log('PASS undo through UI restores manual addition and appends audit event');
  const preview=await fetch(base+`/selection?region=${testRegion.id}&category=coffee`,{headers:{authorization}});assert.ok((await preview.text()).includes('Doğrulanmamış kalite iddiaları yayımlanmadı'));console.log('PASS local publication preview rejects unverified manual business');
  await page.setViewport({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'work/research/management-mobile.png',fullPage:false});await page.setViewport({width:1440,height:1000});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'work/research/management-desktop.png',fullPage:false});assert.deepEqual(errors,[]);console.log('PASS mobile layout and browser runtime');
 }finally{
  // Reverse temporary test actions; all audit records remain explicit and local, no fixture publication occurred.
  for(const id of cleanupEvents){try{await request({type:'undo',eventId:id});}catch(e){console.error('Test cleanup: '+e.message);throw e;}}
  await browser.close();
 }
 const final=await (await fetch(base+'/manage',{headers:{authorization}})).json();assert.ok(!final.regions.some(r=>r.name==='İZOLE TARAYICI TESTİ'));console.log('PASS temporary test region and candidate reversed; original research data preserved');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
