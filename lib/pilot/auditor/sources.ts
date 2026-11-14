import { createHash } from 'node:crypto';
import type { AuditSource,SourceFacts,MapFact,OperatorFact,EditorialFact } from './types';
import { AUDIT_BUDGET } from './planner';
const USER_AGENT='YeriniAyirAuditor/1.0 (+https://yeriniayir.com; local isolated pilot)';
export const AUDIT_SOURCES=[{id:'map',url:'https://overpass-api.de/api/interpreter',family:'openstreetmap.org',kind:'map' as const},{id:'story',url:'https://storyroasters.com/pages/kafelerimiz',family:'storyroasters.com',kind:'operator' as const},{id:'montag',url:'https://www.montagcoffee.com/pages/subelerimiz',family:'montagcoffee.com',kind:'operator' as const},{id:'barista',url:'https://www.baristamagazine.com/5-cool-cafes-to-check-out-in-kadikoy-istanbul/',family:'baristamagazine.com',kind:'editorial' as const}];
export const fingerprint=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const text=(html:string)=>html.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;|&apos;/g,"'").replace(/\s+/g,' ').trim();
export class RequestBudget {
 used=0;readonly deadline:number;
 constructor(readonly now=Date.now()){this.deadline=now+AUDIT_BUDGET.maxDurationMs;}
 claim(maxDuration=18000){if(this.used>=AUDIT_BUDGET.maxRequests)throw new Error('REQUEST_BUDGET_EXHAUSTED');if(Date.now()>=this.deadline)throw new Error('TIME_BUDGET_EXHAUSTED');this.used++;return Math.min(maxDuration,this.deadline-Date.now());}
}
export function auditRobotsAllowed(body:string,path:string){
 const groups:{agents:string[];rules:{allow:boolean;path:string}[]}[]=[];let group={agents:[] as string[],rules:[] as {allow:boolean;path:string}[]};
 for(const line of body.split(/\r?\n/)){const m=line.split('#')[0].trim().match(/^([^:]+):\s*(.*)$/);if(!m)continue;const k=m[1].toLowerCase(),v=m[2].trim();if(k==='user-agent'){if(group.rules.length){groups.push(group);group={agents:[],rules:[]};}group.agents.push(v.toLowerCase());}else if(['allow','disallow'].includes(k)&&v)group.rules.push({allow:k==='allow',path:v});}groups.push(group);
 const exact=groups.filter(g=>g.agents.some(a=>a!=='*'&&USER_AGENT.toLowerCase().includes(a)));const selected=exact.length?exact:groups.filter(g=>g.agents.includes('*'));
 const rules=selected.flatMap(g=>g.rules).filter(r=>new RegExp('^'+r.path.split('*').map(p=>p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*').replace(/\\\$$/,'$')).test(path)).sort((a,b)=>b.path.length-a.path.length||Number(b.allow)-Number(a.allow));
 return !rules.length||rules[0].allow;
}
async function download(url:string,budget:RequestBudget,fetcher:typeof fetch,conditional?:AuditSource){
 const permitted=AUDIT_SOURCES.some(s=>url===s.url||url===new URL('/robots.txt',s.url).href)||url.startsWith(AUDIT_SOURCES[0].url+'?data=');if(!permitted)throw new Error('Source URL not allowed');
 const headers:Record<string,string>={'User-Agent':USER_AGENT,Accept:'application/json,text/html,text/plain'};
 if(conditional?.etag)headers['If-None-Match']=conditional.etag;if(conditional?.lastModified)headers['If-Modified-Since']=conditional.lastModified;
 const res=await fetcher(url,{headers,redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(Math.max(1,budget.claim(url.startsWith(AUDIT_SOURCES[0].url)?30000:18000)))});
 if(res.status===304&&conditional?.status==='ok')return {body:null,etag:conditional.etag,lastModified:conditional.lastModified};
 if(!res.ok)throw new Error(`HTTP ${res.status}`);
 if(Number(res.headers.get('content-length'))>2000000)throw new Error('Source too large');
 const reader=res.body?.getReader();if(!reader)throw new Error('Empty source');const parts:Uint8Array[]=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2000000)throw new Error('Source too large');parts.push(value);}}finally{await reader.cancel();}
 return {body:Buffer.concat(parts).toString('utf8'),etag:res.headers.get('etag')||undefined,lastModified:res.headers.get('last-modified')||undefined};
}
export function parseAuditMap(body:string):SourceFacts {
 const data=JSON.parse(body);if(!Array.isArray(data.elements)||data.remark)throw new Error('Incomplete independent map query');const map:MapFact[]=[];
 for(const e of data.elements){const t=e.tags||{},lat=e.lat??e.center?.lat,lng=e.lon??e.center?.lon;if(!t.name||!Number.isFinite(lat)||!Number.isFinite(lng)||lat<40.978||lat>40.992||lng<29.018||lng>29.037||!['node','way','relation'].includes(e.type)||!Number.isSafeInteger(e.id))continue;
  const street=t['addr:street']||null,houseNumber=t['addr:housenumber']||null;map.push({id:`osm-${e.type}-${e.id}`,name:t.name,address:street?[street,houseNumber].filter(Boolean).join(' '):null,street,houseNumber,lat,lng,closure:t.disused==='yes'||Boolean(t['disused:amenity']||t['abandoned:amenity']),coffeeSignal:/coffee|kahve|roast|espresso/i.test(t.name+' '+(t.cuisine||'')+' '+(t.shop||'')),updatedAt:e.timestamp||null});
 }return {map:map.sort((a,b)=>a.id.localeCompare(b.id))};
}
export function parseAuditOperator(body:string,id:string):SourceFacts {
 const operators:OperatorFact[]=[];
 if(id==='story')for(const match of Array.from(body.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi))){const card=match[1],name=text(card.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1]||'');const address=Array.from(card.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)).map(m=>text(m[1])).find(s=>/No\s*:/i.test(s)&&/Dalga/i.test(s));if(name&&address){const number=address.match(/No\s*:\s*([\w/-]+)/i)?.[1];if(number)operators.push({name,brand:'Story',street:'Dalga Sokağı',houseNumber:number,address});}}
 else for(const match of Array.from(body.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi))){const name=text(match[1]);if(!/Montag/i.test(name))continue;const content=text(match[2]);const street=content.match(/(Bademaltı\s+(?:Sok\.?|Sokak|Sokağı)|Muvakk[iı]thane\s+(?:Cad\.?|Caddesi))/i)?.[1];const number=street?content.slice(content.indexOf(street)+street.length).match(/No\s*:?\s*([0-9]+(?:\/[A-Za-z])?)/i)?.[1]:null;if(street&&number)operators.push({name,brand:'Montag',street,houseNumber:number,address:street+' '+number});}
 if(!operators.length)throw new Error('Operator parser could not identify branch addresses');return {operators:operators.sort((a,b)=>a.address.localeCompare(b.address))};
}
export function parseAuditEditorial(body:string):SourceFacts {
 const end=body.search(/ABOUT THE AUTHOR/i),article=end<0?body:body.slice(0,end),publishedAt=body.match(/"datePublished"\s*:\s*"([^"]+)"/)?.[1]||null;const editorial:EditorialFact[]=[];
 for(const m of Array.from(article.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi))){const name=text(m[1]);if(!name||name.length>90)continue;const prose=text(m[2]);const vocabulary=['V60','espresso','cortado','cappuccino','Americano','filter coffee','Turkish'];const products=vocabulary.filter(p=>new RegExp('\\b'+p+'\\b','i').test(prose));editorial.push({name,products,publishedAt,experienceAt:null});}
 if(!editorial.length)throw new Error('Editorial parser found no named businesses');return {editorial:editorial.sort((a,b)=>a.name.localeCompare(b.name))};
}
export async function collectAuditSources(cache:Record<string,AuditSource>,fetcher:typeof fetch=fetch,now=new Date().toISOString()){
 const budget=new RequestBudget(),sources:AuditSource[]=[];
 for(const spec of AUDIT_SOURCES){const previous=cache[spec.id],age=previous?Date.parse(now)-Date.parse(previous.validatedAt):Infinity;const ttl=previous?.status==='ok'||previous?.status==='blocked'?24*3600000:60000;
  if(previous&&age>=0&&age<ttl){sources.push({...previous,fromCache:true,unchanged:true});continue;}
  try{
   let url=spec.url;
   if(spec.id==='map')url+='?data='+encodeURIComponent('[out:json][timeout:25];(nwr["amenity"="cafe"](40.978,29.018,40.992,29.037);nwr["shop"="coffee"](40.978,29.018,40.992,29.037);nwr["disused:amenity"="cafe"](40.978,29.018,40.992,29.037););out center meta;');
   else {const robots=await download(new URL('/robots.txt',url).href,budget,fetcher);if(!robots.body?.toLowerCase().includes('user-agent:')||!auditRobotsAllowed(robots.body,new URL(url).pathname))throw new Error('Robots access denied');}
   const downloaded=await download(url,budget,fetcher,previous?.status==='ok'?previous:undefined);
   const facts=downloaded.body===null?previous!.facts:spec.id==='map'?parseAuditMap(downloaded.body):spec.kind==='operator'?parseAuditOperator(downloaded.body,spec.id):parseAuditEditorial(downloaded.body);
   const hash=fingerprint(facts);sources.push({...spec,status:'ok',facts,fingerprint:hash,validatedAt:now,fetchedAt:downloaded.body===null?previous!.fetchedAt:now,fromCache:false,unchanged:hash===previous?.fingerprint,error:null,etag:downloaded.etag,lastModified:downloaded.lastModified});
  }catch(error){const message=error instanceof Error?error.message:'Source unavailable';sources.push({...spec,status:/403|429|Robots/.test(message)?'blocked':'failed',facts:{},fingerprint:null,validatedAt:now,fetchedAt:null,fromCache:false,unchanged:false,error:message});}
 }
 return {sources,requestsUsed:budget.used};
}
