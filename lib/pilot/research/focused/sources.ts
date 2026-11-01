import {createHash} from 'node:crypto';
import {auditRobotsAllowed} from '../../auditor/sources';
import type {AccessLog,FocusCache,FocusFact,FocusSource,TargetId} from './types';
export const TARGETS:{id:TargetId;name:string;candidateId:string;street:string;door:string}[]=[
 {id:'montag',name:'Montag • Moda Bademaltı',candidateId:'osm-node-9375785317',street:'Bademaltı',door:'22/A'},
 {id:'story',name:'Story • Moda Dalga Sokak',candidateId:'osm-node-6124757286',street:'Dalga',door:'22'},
 {id:'cekirdek',name:'Çekirdek • Şair Latifi',candidateId:'osm-node-5764070654',street:'Şair Latifi',door:'9/A'},
 {id:'guten',name:'Guten Morgen • Fırıldak',candidateId:'osm-node-8017443297',street:'Fırıldak',door:'19'},
 {id:'manifesto',name:'Coffee Manifesto • Moda',candidateId:'osm-node-10168814917',street:'Dr. Esat Işık',door:'22/B'},
];
export const FOCUS_SOURCES:{id:string;url:string;family:string;kind:FocusSource['kind'];target?:TargetId}[]=[
 {id:'story-site',url:'https://storyroasters.com/',family:'storyroasters.com',kind:'operator',target:'story'},
 {id:'oggusto-guten',url:'https://www.oggusto.com/gastronomi/istanbul/modada-gidebileceginiz-en-iyi-mekanlar',family:'oggusto.com',kind:'editorial',target:'guten'},
 {id:'story-branches',url:'https://storyroasters.com/pages/kafelerimiz',family:'storyroasters.com',kind:'operator',target:'story'},
 {id:'story-menu',url:'https://storyroasters.com/pages/story-coffee-menu',family:'storyroasters.com',kind:'operator',target:'story'},
 {id:'time-story',url:'https://www.timeout.com/istanbul/tr/restoranlar/story-coffee-food',family:'timeout.com',kind:'editorial',target:'story'},
 {id:'time-guten',url:'https://www.timeout.com/istanbul/tr/restoranlar/guten-morgen-1',family:'timeout.com',kind:'editorial',target:'guten'},
 {id:'time-cekirdek',url:'https://www.timeout.com/istanbul/tr/restoranlar/cekirdek',family:'timeout.com',kind:'editorial',target:'cekirdek'},
 {id:'cornucopia',url:'https://www.cornucopia.net/guide/listings/restaurants/cekirdek-kahve/',family:'cornucopia.net',kind:'editorial',target:'cekirdek'},
 {id:'manifesto-branches',url:'https://coffeemanifesto.com/dukkanlarimiz',family:'coffeemanifesto.com',kind:'operator',target:'manifesto'},
 {id:'manifesto-site',url:'https://coffeemanifesto.com/',family:'coffeemanifesto.com',kind:'operator',target:'manifesto'},
 {id:'guten-contact',url:'https://gutenmorgenroastery.com/contact/',family:'gutenmorgenroastery.com',kind:'operator',target:'guten'},
 {id:'guten-site',url:'https://gutenmorgenroastery.com/',family:'gutenmorgenroastery.com',kind:'operator',target:'guten'},
 {id:'barista',url:'https://www.baristamagazine.com/5-cool-cafes-to-check-out-in-kadikoy-istanbul/',family:'baristamagazine.com',kind:'editorial'},
 {id:'montag-branches',url:'https://www.montagcoffee.com/pages/subelerimiz',family:'montagcoffee.com',kind:'operator',target:'montag'},
];
export const MAP_ENDPOINTS=['https://overpass-api.de/api/interpreter','https://overpass.private.coffee/api/interpreter'];
export const FOCUS_LIMITS={maxRequests:32,maxDurationMs:240000};
const UA='YeriniAyirAuditor/1.0 (+https://yeriniayir.com; local isolated pilot)';
export const digest=(value:unknown)=>createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
export const plain=(s:string)=>s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;|&#160;/g,' ').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/\s+/g,' ').trim();
export const normalized=(s:string)=>s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]/g,'');
const family=(url:string)=>new URL(url).hostname.replace(/^www\./,'');
const dateFrom=(html:string,key:string)=>{const match=html.match(new RegExp('"'+key+'"\\s*:\\s*"([^"<>]+)"'));const v=match?.[1]||null;return v&&/^\d{4}-\d{2}-\d{2}/.test(v)&&Number.isFinite(Date.parse(v))?v:null;};
export function extractSource(spec:typeof FOCUS_SOURCES[number],html:string,at:string):FocusSource {
 const facts:FocusFact[]=[];const notes:string[]=[];let content=html;
 const add=(target:TargetId,field:FocusFact['field'],value:string,scope:FocusFact['scope'],witness:string,extra:Partial<FocusFact>={})=>facts.push({target,field,value,scope,witnessHash:digest(witness),...extra});
 const addr=(target:TargetId,chunk:string)=>{const t=TARGETS.find(t=>t.id===target)!;const p=plain(chunk);const pattern=target==='story'?/Dalga\s+(?:Sokak|Sok\.?|Sokağı)\s*(?:No\s*:?\s*)?22\b/i:target==='cekirdek'?/Şair\s+Latifi\s+(?:Sokak|Sok\.?|Sokağı)\s*(?:No\.?\s*:?\s*)?9\s*\/?\s*A\b/i:target==='guten'?/Fırıldak\s+(?:Sokak|Sok\.?|Sokağı)\s*(?:No\.?\s*:?\s*)?19\b/i:target==='montag'?/Bademaltı\s+(?:Sokak|Sok\.?|Sokağı)\s*(?:No\.?\s*:?\s*)?22\s*\/?\s*A\b/i:/Dr\.?\s*Esat\s+Işık\s+(?:Cad\.?|Caddesi)\s*(?:No\.?\s*:?\s*)?22\s*\/?\s*B\b/i;const m=p.match(pattern);if(m)add(target,'address',t.street+' '+t.door,'branch',m[0],{street:t.street,door:t.door});};
 const terms=(target:TargetId,chunk:string,scope:FocusFact['scope'])=>{
  const text=normalized(plain(chunk));
  const lists={drink:['iced dirty chai latte','iced caramel latte','Japanese Iced Pour Over','iced V60 pourover','V60 Pour Over','sunshine latte','golden latte','Cortado','V60','espresso','Americano','filter coffee','cappuccino','Cold Brew'],food:['Cinnamon Roll','Sea Salt Brownie','portakallı çikolatalı roll','ekşi mayalı','limonlu quark cheesecake','vişneli tart','cheesecake'],specialty:['micro-roasted','nitelikli kahve','kavurulmuş']};
  for(const [field,values] of Object.entries(lists)){
   const spans:{start:number;end:number}[]=[];
   for(const value of [...values].sort((a,b)=>normalized(b).length-normalized(a).length)){
    const needle=normalized(value);let start=text.indexOf(needle),matched=false;
    while(start>=0){const end=start+needle.length;if(!spans.some(s=>start<s.end&&end>s.start)){spans.push({start,end});matched=true;}start=text.indexOf(needle,start+needle.length);}
    if(matched)add(target,field as FocusFact['field'],value,scope,value);
   }
  }
 };
 if(spec.id==='story-site'){
  const body=plain(html);if(/Story/i.test(body)&&/Kahveler/i.test(body))add('story','specialty','Resmî sitede markanın paket kahve kataloğu bulunuyor.','brand','Kahveler');
 }else if(spec.id==='story-branches'){
  const card=Array.from(html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi)).map(m=>m[1]).find(s=>/<h2[^>]*>\s*Story Moda\s*<\/h2>/i.test(s));
  if(card){addr('story',card);const p=plain(card),hours=p.match(/Her gün\s+\d{2}:\d{2}[–-]\d{2}:\d{2}/i);if(hours)add('story','hours',hours[0],'branch',hours[0]);if(/bahçe/i.test(p))add('story','atmosphere','İşletme tarihi bina ve bahçe bildiriyor.','branch','bahçe');}
 }else if(spec.id==='story-menu'){
  // Actual menu rows only; products in navigation, scripts or recommendations are ignored.
  const rows=Array.from(html.matchAll(/<div class="menu-row"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/gi)).map(m=>plain(m[1]));
  for(const value of rows){if(['Cortado','V60 Pour Over','Espresso','Cold Brew','Iced Dirty Chai Latte','Dirty Chai Latte','Japanese Iced Pour Over','Iced Caramel Latte'].includes(value))add('story','drink',value,'brand',value);if(['Cinnamon Roll','Sea Salt Brownie','San Sebastian Cheesecake'].includes(value))add('story','food',value,'brand',value);}
 }else if(spec.id.startsWith('time-')){
  const title=plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||'');const target=spec.target!;const expected=target==='story'?'Story':target==='guten'?'Guten Morgen':'Çekirdek';
  if(normalized(title).includes(normalized(expected))){content=html.slice(html.search(/<h1/i));const prose=plain(content);const start=prose.indexOf('Time Out diyor ki'),end=prose.indexOf('Ayrıntılar',Math.max(0,start));if(start>=0&&end>start)terms(target,prose.slice(start,end),'branch');if(start>=0&&prose.slice(0,start).includes('Üsküdar')&&prose.slice(end).includes('Kadıköy'))notes.push('Bölge etiketi Üsküdar; ayrıntılı adres Kadıköy. Etiket konuma aktarılmadı.');addr(target,prose);}
 }else if(spec.id==='cornucopia'){
  const p=plain(html),start=p.indexOf('Find it'),end=p.indexOf('More Reading',start);if(start>=0&&end>start){const chunk=p.slice(start,end);addr('cekirdek',chunk);terms('cekirdek',chunk,'branch');}
 }else if(spec.id==='manifesto-branches'){
  const m=html.match(/<h2[^>]*>\s*COFFEE MANIFESTO MODA\s*<\/h2>([\s\S]*?)(?=<h2|$)/i);if(m)addr('manifesto',m[1]);
 }else if(spec.id==='manifesto-site'){
  // Packaged bean names are brand products, never a claim about today's cups in Moda.
  for(const name of ['No 19 Shakiso','No 17 Monteblanco Golden Grand Cru','No 01 Vital'])if(plain(html).includes(name))add('manifesto','specialty',name+' — markanın paket çekirdeği','brand',name);
 }else if(spec.id==='guten-contact'){
  const p=plain(html),m=p.match(/Fırıldak\s+Sk\.\s*No:\s*19\/B/i);if(m)add('guten','address','Fırıldak 19/B','branch',m[0],{street:'Fırıldak',door:'19/B'});
 }else if(spec.id==='guten-site'){
  const p=plain(html);addr('guten',p);if(/GUTEN MORGEN/i.test(p)&&/Kahvelerimiz/i.test(p))add('guten','specialty','İşletmenin kahve kavurma ve paket çekirdek kataloğu var.','brand','Kahvelerimiz');
 }else if(spec.id==='montag-branches'){
  const m=html.match(/<h3[^>]*>\s*Montag Coffee Moda\s*<\/h3>([\s\S]*?)(?=<h3|$)/i);if(m)addr('montag',m[1]);
 }else if(spec.id==='barista'){
  const end=html.search(/ABOUT THE AUTHOR/i),article=end<0?html:html.slice(0,end);for(const m of Array.from(article.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi))){const name=normalized(plain(m[1]));const target=name==='cekirdek'?'cekirdek':name==='montag'?'montag':name==='coffeemanifesto'?'manifesto':null;if(target)terms(target,m[2],target==='cekirdek'?'branch':'brand');}
 }
 const updatedAt=spec.id==='story-menu'?plain(html).match(/İçecek menüsünün fiyat değişim tarihi:\s*(\d{2})\.(\d{2})\.(\d{4})/)?.slice(1).reverse().join('-')||null:dateFrom(html,'dateModified');
 return {id:spec.id,url:spec.url,family:spec.family,kind:spec.kind,status:'ok',accessedAt:at,publishedAt:dateFrom(html,'datePublished'),experienceAt:null,updatedAt,facts,fingerprint:digest(facts),error:facts.length?null:'Kaynak okundu; desteklenen alan ayrıştırılamadı.',cacheHit:false,notes};
}
export class FocusHttp {
 readonly logs:AccessLog[]=[];private readonly robots=new Map<string,{body:string|null;allowed:boolean}>();readonly started=Date.now();private requests=0;
 constructor(readonly cache:FocusCache,readonly fetcher:typeof fetch=fetch,readonly limits=FOCUS_LIMITS){}
 private blocked(url:string){const item=this.cache.blockedHosts[family(url)];return item&&Date.parse(item.until)>Date.now()?item:null;}
 private allowed(url:string){return FOCUS_SOURCES.some(s=>s.url===url||new URL('/robots.txt',s.url).href===url)||MAP_ENDPOINTS.some(s=>url.startsWith(s+'?data='));}
 async get(url:string,sourceId:string,stage:AccessLog['stage']):Promise<{body:string;status:number}>{
  if(!this.allowed(url))throw new Error('SOURCE_URL_NOT_ALLOWED');const blocked=this.blocked(url);if(blocked){this.logs.push({sourceId,url,stage:'cache',at:new Date().toISOString(),status:'blocked',httpStatus:null,durationMs:0,bytes:0,costUsd:0,detail:blocked.reason+'; alan adı beklemesi '+blocked.until});throw new Error('HOST_COOLDOWN');}
  if(this.requests>=this.limits.maxRequests||Date.now()-this.started>=this.limits.maxDurationMs)throw new Error('FOCUSED_BUDGET_EXHAUSTED');this.requests++;const start=Date.now();
  let status:number|null=null,bytes=0;
  try{const r=await this.fetcher(url,{headers:{'User-Agent':UA,Accept:'text/html,application/json,text/plain'},redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(Math.max(1,Math.min(stage==='map'?25000:15000,this.limits.maxDurationMs-(Date.now()-this.started))))});status=r.status;
   if([403,429].includes(status)){const retry=r.headers.get('retry-after'),seconds=Number(retry),when=retry&&!Number.isNaN(Date.parse(retry))?Date.parse(retry):Date.now()+((retry&&Number.isFinite(seconds))?seconds*1000:86400000);this.cache.blockedHosts[family(url)]={until:new Date(Math.max(Date.now()+3600000,when)).toISOString(),reason:'HTTP '+status};throw new Error('HTTP '+status);}
   if(status===404&&stage==='robots'){this.logs.push({sourceId,url,stage,at:new Date().toISOString(),status:'ok',httpStatus:status,durationMs:Date.now()-start,bytes:0,costUsd:0,detail:'robots.txt yok (RFC 9309); yalnızca açık sayfadaki olgular.'});return {body:'',status};}
   if(!r.ok)throw new Error('HTTP '+status);if(Number(r.headers.get('content-length'))>2000000)throw new Error('SOURCE_TOO_LARGE');const reader=r.body?.getReader();if(!reader)throw new Error('EMPTY_SOURCE');const parts:Uint8Array[]=[];try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>2000000)throw new Error('SOURCE_TOO_LARGE');parts.push(value);}}finally{await reader.cancel();}
   this.logs.push({sourceId,url,stage,at:new Date().toISOString(),status:'ok',httpStatus:status,durationMs:Date.now()-start,bytes,costUsd:0,detail:'İzinli kaynak isteği; ham sayfa saklanmadı.'});return {body:Buffer.concat(parts).toString('utf8'),status};
  }catch(e){const detail=e instanceof Error?e.message:'FETCH_FAILED';this.logs.push({sourceId,url,stage,at:new Date().toISOString(),status:[403,429].includes(status||0)?'blocked':'failed',httpStatus:status,durationMs:Date.now()-start,bytes,costUsd:0,detail});throw e;}
 }
 async page(spec:typeof FOCUS_SOURCES[number]):Promise<FocusSource>{
  const previous=this.cache.sources[spec.id];if(previous&&Date.now()-Date.parse(previous.accessedAt)>=0&&Date.now()-Date.parse(previous.accessedAt)<(previous.status==='failed'?60000:86400000)){this.logs.push({sourceId:spec.id,url:spec.url,stage:'cache',at:new Date().toISOString(),status:'cached',httpStatus:null,durationMs:0,bytes:0,costUsd:0,detail:'Olgu önbelleği; erişim/deneyim tarihi yenilenmedi.'});return {...previous,cacheHit:true};}
  try{const origin=new URL(spec.url).origin;let robots=this.robots.get(origin);if(!robots){const r=await this.get(origin+'/robots.txt',spec.id,'robots');robots={body:r.status===404?null:r.body,allowed:r.status===404||/user-agent\s*:/i.test(r.body)};this.robots.set(origin,robots);}
   if(!robots.allowed||(robots.body!==null&&!auditRobotsAllowed(robots.body,new URL(spec.url).pathname)))throw new Error('ROBOTS_DENIED');
   let result:{body:string;status:number};try{result=await this.get(spec.url,spec.id,'page');}catch(e){const message=e instanceof Error?e.message:'';if(!/^HTTP 50[234]$/.test(message))throw e;await new Promise(resolve=>setTimeout(resolve,1000));result=await this.get(spec.url,spec.id,'page');}
   return extractSource(spec,result.body,new Date().toISOString());
  }catch(e){const error=e instanceof Error?e.message:'FETCH_FAILED';return {id:spec.id,url:spec.url,family:spec.family,kind:spec.kind,status:/403|429|COOLDOWN|ROBOTS/.test(error)?'blocked':'failed',accessedAt:new Date().toISOString(),publishedAt:null,experienceAt:null,updatedAt:null,facts:[],fingerprint:null,error,cacheHit:false};}
 }
 async map():Promise<FocusSource>{
  const id='focused-map',previous=this.cache.sources[id];if(previous&&Date.now()-Date.parse(previous.accessedAt)<(previous.status==='ok'?86400000:21600000)){this.logs.push({sourceId:id,url:previous.url,stage:'cache',at:new Date().toISOString(),status:'cached',httpStatus:null,durationMs:0,bytes:0,costUsd:0,detail:'Harita olgu önbelleği.'});return {...previous,cacheHit:true};}
  const query='[out:json][timeout:20];node(id:'+TARGETS.map(t=>t.candidateId.replace('osm-node-','')).join(',')+');out meta;';let lastError='No map',lastUrl=MAP_ENDPOINTS[0];
  for(const endpoint of MAP_ENDPOINTS){lastUrl=endpoint;try{const {body}=await this.get(endpoint+'?data='+encodeURIComponent(query),id,'map');const json=JSON.parse(body);if(!Array.isArray(json.elements)||json.remark)throw new Error('INCOMPLETE_MAP');const facts:FocusFact[]=[];
    for(const e of json.elements){const target=TARGETS.find(t=>t.candidateId==='osm-node-'+e.id);if(e.type!=='node'||!target||!e.tags?.name||!Number.isFinite(e.lat)||!Number.isFinite(e.lon)||!normalized(e.tags.name).includes(normalized(target.id==='cekirdek'?'Çekirdek':target.id==='guten'?'Guten Morgen':target.id==='manifesto'?'Manifesto':target.id))||e.lat<40.978||e.lat>40.992||e.lon<29.018||e.lon>29.037)continue;const street=e.tags['addr:street'],door=e.tags['addr:housenumber'];if(street&&door)facts.push({target:target.id,field:'address',value:street+' '+door,scope:'branch',street,door,witnessHash:digest({id:e.id,tags:e.tags,lat:e.lat,lon:e.lon}),closure:e.tags.disused==='yes'||Boolean(e.tags['disused:amenity']||e.tags['abandoned:amenity'])});}
    return {id,url:endpoint,family:'openstreetmap.org',kind:'map',status:'ok',accessedAt:new Date().toISOString(),publishedAt:null,experienceAt:null,updatedAt:json.osm3s?.timestamp_osm_base||null,facts,fingerprint:digest(facts),error:null,cacheHit:false};
   }catch(e){lastError=e instanceof Error?e.message:'MAP_FAILED';if(/403|429|COOLDOWN|BUDGET/.test(lastError))break; // Mirrors are outage alternatives, never a way around access denial.
   }}
  return {id,url:lastUrl,family:'openstreetmap.org',kind:'map',status:/403|429|COOLDOWN/.test(lastError)?'blocked':'failed',accessedAt:new Date().toISOString(),publishedAt:null,experienceAt:null,updatedAt:null,facts:[],fingerprint:null,error:lastError,cacheHit:false};
 }
}
