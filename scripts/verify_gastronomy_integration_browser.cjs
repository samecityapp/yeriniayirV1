const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),puppeteer=require('puppeteer'),ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const origin=process.env.VERIFY_ORIGIN||'http://127.0.0.1:3300',out=path.resolve('work/integration/browser');fs.mkdirSync(out,{recursive:true});
let checks=0;const pass=label=>{checks++;console.log('PASS '+label);};
const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync('components/food/CategoryBar.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText)(require,m,m.exports);
const categoryFixtures=[3,6,7].map(count=>renderToStaticMarkup(React.createElement(m.exports.CategoryBar,{categories:Array.from({length:count},(_,i)=>({slug:'test-'+i,label:i===0?'Mutlaka Denenmesi Gerekenler':['Kahve','Hamburger','Pizza','Kahvaltı','Tatlı ve Pastane','Yöresel Lezzetler'][i-1],isMustTry:i===0})),activeCategorySlug:'test-0',onSelectCategory:()=>{}})));
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.PUPPETEER_EXECUTABLE_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
 try{
 const page=await browser.newPage(),errors=[],external=[],responses=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.setRequestInterception(true);page.on('request',r=>{const u=new URL(r.url());if(u.origin!==origin&&!['data:','blob:'].includes(u.protocol)){external.push(u.hostname);r.abort();}else r.continue();});
 page.on('response',r=>{if(r.url().startsWith(origin))responses.push({status:r.status(),url:r.url().replace(origin,'')});});
 if(!process.env.VERIFY_BOUNDARY_ONLY){
 for(const width of [375,390,430,1440]){
  await page.setViewport({width,height:width===1440?1000:844,isMobile:width<500,hasTouch:width<500});
  await page.goto(origin+'/tr',{waitUntil:'networkidle0'});
  assert.equal(await page.$$eval('header',e=>e.length),1);assert.ok((await page.$eval('h1',e=>e.textContent)).includes('CANIN NE ÇEKİYOR'));
  await page.click('header button');await page.waitForSelector('[role="dialog"] input');await page.type('[role="dialog"] input','Kadıköy');
  const buttons=await page.$$('[role="dialog"] button');let chosen=false;for(const b of buttons){const t=await b.evaluate(e=>e.textContent);if(t.includes('Moda, Kadıköy, İstanbul')){await b.click();chosen=true;break;}}
  assert.ok(chosen);await page.waitForSelector('[data-venue-id]');await page.waitForFunction(()=>location.search.includes('region=moda')&&location.search.includes('category=kahve'));
  assert.equal(await page.$$eval('header',e=>e.length),1);assert.equal(await page.$$eval('[data-venue-id]',e=>e.length),4);
  const names=await page.$$eval('[data-venue-id] h2',e=>e.map(n=>n.textContent));for(const name of ['Çekirdek','Story','Guten Morgen','Montag'])assert.ok(names.some(t=>t.includes(name)));
  const body=await page.$eval('body',e=>e.innerText);assert.ok(!/Neden Gitmeli|yorum sayısı|Gaziantep|Fethiye|Time Out|Barista Magazine|Kaynaklar/.test(body));assert.ok(!/\b[1-5],[0-9]\/5\b/.test(body), 'Unverified Google ratings must be cleanly omitted');
  await page.waitForFunction(()=>document.querySelectorAll('[data-venue-id] img').length===4&&Array.from(document.querySelectorAll('[data-venue-id] img')).every(n=>n.complete&&n.naturalWidth>0),{timeout:10000});
  assert.equal(await page.$$eval('[data-venue-id] img',e=>e.filter(n=>n.complete&&n.naturalWidth>0).length),4);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:path.join(out,`list-${width}.png`),fullPage:true});
  const ids=await page.$$eval('[data-venue-id]',e=>e.map(n=>n.getAttribute('data-venue-id')));
  for(const id of ids){
   await page.$eval(`[data-venue-id="${id}"]`,e=>e.scrollIntoView({block:'center'}));await page.click(`[data-venue-id="${id}"]`);await page.waitForSelector('[role="dialog"]');
   assert.ok((await page.$eval('[role="dialog"]',e=>e.innerText)).includes('Temsili görsel'));
   assert.ok(await page.$eval('[role="dialog"]',e=>e.getBoundingClientRect().right<=innerWidth&&e.getBoundingClientRect().left>=0));
   assert.ok(!/Neden Gitmeli|Kaynaklar|Time Out|yorum/.test(await page.$eval('[role="dialog"]',e=>e.innerText)));
   if(id===ids[1])await page.screenshot({path:path.join(out,`detail-${width}.png`)});
   await page.keyboard.press('Escape');await page.waitForSelector('[role="dialog"]',{hidden:true});assert.equal(await page.$$eval('[data-venue-id]',e=>e.length),4);
  }
  pass(`${width}px: location search → URL → four real cards → four details → close; one header, loaded illustrations, no overflow/source/count/rating leaks`);
  for(let i=0;i<categoryFixtures.length;i++){
   await page.evaluate(html=>{const host=document.createElement('div');host.id='category-fixture';host.style.cssText='position:fixed;inset:0 auto auto 0;width:min(100vw,672px);padding:16px;background:white;z-index:100';host.innerHTML=html;document.body.appendChild(host);},categoryFixtures[i]);
   const result=await page.$eval('#category-fixture',host=>({overflow:host.scrollWidth>host.clientWidth,buttons:Array.from(host.querySelectorAll('button')).map(b=>({visible:b.getBoundingClientRect().right<=innerWidth&&b.getBoundingClientRect().left>=0,clipped:b.scrollWidth>b.clientWidth||b.scrollHeight>b.clientHeight}))}));
   assert.equal(result.buttons.length,[3,6,7][i]);assert.equal(result.overflow,false);assert.ok(result.buttons.every(b=>b.visible&&!b.clipped));await page.$eval('#category-fixture',e=>e.remove());
  }
  pass(`${width}px: 3/6/7 category component fixtures all visible, no horizontal scroll or clipped labels (not real categories)`);
 }
 await page.goto(origin+'/tr?region=moda&category=kahve',{waitUntil:'networkidle0'});await page.goto(origin+'/tr?region=moda&category=pizza',{waitUntil:'networkidle0'});assert.equal(await page.$$('[data-venue-id]').then(e=>e.length),0);await page.goBack({waitUntil:'networkidle0'});assert.equal(await page.$$eval('[data-venue-id]',e=>e.length),4);await page.goForward({waitUntil:'networkidle0'});assert.equal(await page.$$eval('[data-venue-id]',e=>e.length),0);pass('unsupported category stays empty; browser Back/Forward restores matching scope');
 await page.goto(origin+'/tr?region=gaziantep&category=kahve',{waitUntil:'networkidle0'});assert.equal(await page.$$eval('[data-venue-id]',e=>e.length),0);assert.ok((await page.$eval('h1',e=>e.textContent)).includes('hazır değil'));pass('unsupported region cannot silently show Moda or demos');
 const resp=await page.goto(origin+'/tr?region=moda&category=kahve',{waitUntil:'networkidle0'}),html=await resp.text();assert.equal(resp.status(),200);assert.ok(!/reviewCount|userRatingCount|googleReviewCount|sourcePageUrl|permissionProof|productResearch|positiveEvidence|baristamagazine.com|timeout.com/.test(html));assert.ok(!/mockProvider/.test(html));assert.ok(/noindex/.test(html));pass('actual SSR/RSC payload excludes admin evidence and review counts, local preview is noindex');
 }
 await page.goto(origin+'/tr?region=moda&category=kahve',{waitUntil:'networkidle0'});
 const unauthorized=await fetch(origin+'/tr/moda-kadikoy-pilot/selection/data');assert.ok([401,503].includes(unauthorized.status));pass('admin API remains protected without credentials ('+unauthorized.status+')');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);pass('no browser runtime errors or external network requests');
 fs.writeFileSync(path.join(out,process.env.VERIFY_BOUNDARY_ONLY?'boundaries.json':'result.json'),JSON.stringify({checks,widths:[375,390,430,1440],external,errors,responses},null,2));console.log(`${checks}/${checks} browser checks passed`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
