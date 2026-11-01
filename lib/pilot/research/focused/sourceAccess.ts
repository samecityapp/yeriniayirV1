import {promises as fs} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {TavilyPilot,type SearchPilot} from '../search/tavily';
import {FocusHttp,FOCUS_SOURCES,normalized} from './sources';
import {buildFocusedDossiers} from './report';
import type {FocusCache,FocusClaim,FocusReport,FocusSource} from './types';
export interface SourceAccessReport {id:string;completedAt:string;demo:false;search:SearchPilot;comparison:{baselineRunId:string;baselineFiles:number;currentFiles:number;baselineClaims:number;currentClaims:number;newlyVerifiedClaims:number;discoveredUrls:number;originalSourcesChecked:number;newMethodMeasured:boolean};businesses:{id:string;name:string;facts:FocusClaim[];independentMentions:FocusClaim[];currentExperienceVerified:0;unknown:string[];baselineClaims:number;currentClaims:number}[];leads:{url:string;targets:string[];state:'original-source-checked'|'needs-source-adapter'|'rights-restricted'|'access-blocked';excludedTargets?:string[];note:string}[];sources?:FocusSource[];originalAccess:FocusReport['access'];limitations:string[];}
const folder=(root:string)=>path.join(root,'work','source-access-pilot');
export async function readSourceAccessReport(root=process.cwd()):Promise<SourceAccessReport|null>{try{return JSON.parse(await fs.readFile(path.join(folder(root),'latest.json'),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e;}}
export function partitionEvidence(dossier:FocusReport['dossiers'][number],sources:FocusSource[]){
 const facts=dossier.claims.filter(c=>c.field==='address'||c.field==='operation'||c.sourceIds.some(id=>sources.find(s=>s.id===id)?.kind==='operator'));
 const independentMentions=dossier.claims.filter(c=>!['address','operation','hours'].includes(c.field)&&c.sourceIds.some(id=>sources.find(s=>s.id===id)?.kind==='editorial'));
 return {facts,independentMentions,currentExperienceVerified:0 as const,unknown:[...dossier.conflicts,...dossier.gaps,'Bağımsız yayında ürün adının geçmesi lezzetin veya güncel şube deneyiminin doğrulandığı anlamına gelmez.']};
}
export async function runSourceAccessPilot(root=process.cwd(),env:Record<string,string|undefined>=process.env,fetcher:typeof fetch=fetch):Promise<SourceAccessReport>{
 if(env.NODE_ENV==='production'||env.VERCEL)throw new Error('LOCAL_SOURCE_ACCESS_ONLY');await fs.mkdir(folder(root),{recursive:true});const lock=await fs.open(path.join(folder(root),'run.lock'),'wx');
 try{const baseline:FocusReport=JSON.parse(await fs.readFile(path.join(root,'work','focused-research','latest.json'),'utf8'));if(baseline.demo!==false||baseline.dossiers.length!==5)throw new Error('REAL_FIVE_CANDIDATE_BASELINE_REQUIRED');
  const search=await new TavilyPilot(root,env,fetcher).run(),leads:SourceAccessReport['leads']=[],sources=[...baseline.sources];let cache:FocusCache;
  try{cache=JSON.parse(await fs.readFile(path.join(root,'work','focused-research','cache.json'),'utf8'));}catch{throw new Error('SOURCE_CACHE_REQUIRED');}
  try{const own:FocusCache=JSON.parse(await fs.readFile(path.join(folder(root),'original-cache.json'),'utf8'));cache={sources:{...cache.sources,...own.sources},blockedHosts:{...cache.blockedHosts,...own.blockedHosts}};}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  const http=new FocusHttp(cache,fetcher,{maxRequests:12,maxDurationMs:90000});
  const canonical=(url:string)=>{const u=new URL(url);return u.origin+u.pathname.replace(/\/$/,'')+u.search;};const checked=new Set<string>();
  for(const result of search.results)for(const lead of result.leads){const previous=leads.find(l=>l.url===lead.url);if(previous){if(!previous.targets.includes(lead.target))previous.targets.push(lead.target);const registered=FOCUS_SOURCES.find(s=>s.url===lead.url);if(registered?.target&&registered.target!==lead.target){previous.excludedTargets=Array.from(new Set([...(previous.excludedTargets||[]),lead.target]));previous.note+=' Farklı işletme sorgusundan gelen eşleşme o işletmeye kanıt yapılmadı.';}continue;}
   const host=new URL(lead.url).hostname.replace(/^www\./,'');
   if(['filternotes.com','instagram.com','yandex.com.tr','tripadvisor.com.tr'].includes(host)){leads.push({url:lead.url,targets:[lead.target],state:'rights-restricted',note:host==='filternotes.com'?'Yayın ticari rakip veritabanı kullanımını yazılı izne bağlıyor; sadece bağlantı tutuldu. Ayrıca ana inceleme Çarşı şubesine ait, Moda kalite kanıtı yapılmadı.':'Müşteri yorumu/sosyal içerik için uygun yeniden kullanım izni/adaptörü yok; içerik toplanmadı.'});continue;}
   const spec=FOCUS_SOURCES.find(s=>canonical(s.url)===canonical(lead.url));if(!spec){leads.push({url:lead.url,targets:[lead.target],state:'needs-source-adapter',note:'Keşif bağlantısı; asıl sayfa izin/robots ve şube ayrıştırıcısı henüz kontrol edilmedi. İddia olarak kullanılmadı.'});continue;}
   if(!checked.has(spec.id)){const original=await http.page(spec);cache.sources[spec.id]=original;checked.add(spec.id);const i=sources.findIndex(s=>s.id===spec.id);if(i<0)sources.push(original);else sources[i]=original;}
   const original=sources.find(s=>s.id===spec.id);leads.push({url:lead.url,targets:[lead.target],state:original?.status==='blocked'?'access-blocked':'original-source-checked',note:original?.status==='blocked'?'Asıl kaynak erişimi engellendi; engel aşılmadı ve iddia üretilmedi.':original?.facts.length?'Arama özeti kullanılmadı; asıl kaynaktaki olgular/önbellek kontrol edildi.':'Kaynak erişimi veya ayrıştırma yeterli değil; bu bağlantıdan iddia üretilmedi.'});
  }
  // Missing-key runs preserve the saved evidence exactly; enabled runs audit original sources, never search snippets.
  const current=search.status==='inactive'?baseline.dossiers:buildFocusedDossiers(sources);
  const signature=(c:FocusClaim)=>[c.field,normalized(c.value),c.scope].join('|');
  const before=new Set(baseline.dossiers.flatMap(d=>d.claims.filter(c=>c.status!=='conflict').map(c=>d.id+'|'+signature(c))));
  const report:SourceAccessReport={id:randomUUID(),completedAt:new Date().toISOString(),demo:false,search,comparison:{baselineRunId:baseline.id,baselineFiles:baseline.stats.filesReady,currentFiles:current.filter(d=>d.fileReady).length,baselineClaims:baseline.stats.supportedClaims,currentClaims:current.flatMap(d=>d.claims).filter(c=>['source-supported','corroborated'].includes(c.status)).length,newlyVerifiedClaims:current.reduce((n,d)=>n+d.claims.filter(c=>['source-supported','corroborated'].includes(c.status)&&!before.has(d.id+'|'+signature(c))).length,0),discoveredUrls:leads.length,originalSourcesChecked:checked.size,newMethodMeasured:search.results.some(r=>r.status==='ok'||r.status==='cached')},sources,businesses:current.map(d=>({id:d.id,name:d.name,...partitionEvidence(d,sources),baselineClaims:baseline.dossiers.find(b=>b.id===d.id)?.claims.length||0,currentClaims:d.claims.length})),leads,originalAccess:http.logs,limitations:[
   'Tavily sadece URL keşfidir. Arama yanıtı, özet, puan ve ham sayfa kalıcı kanıt olarak saklanmaz; model yanıtı istenmez.',
   'Yeni alan adı/yol otomatik taranmaz. İzin, robots, haklar ve şube ayrıştırıcısı olmayan URL araştırma bağlantısı olarak kalır.',
   'Anahtar/etkinleştirme yoksa canlı Tavily karşılaştırması ölçülemez; mevcut kanıt sayısı korunur, yeni keşif veya başarı uydurulmaz.',
   'Sayaç yerel uygulama kullanımını sınırlar. Başka istemcilerin tüketimi sağlayıcının kullanım kontrolünden izlenir; ücretsiz plan/ücretli ek kullanım kapalı durumu doğrulanmadan arama yapılmaz.',
  ]};
  await fs.writeFile(path.join(folder(root),'original-cache.json.tmp'),JSON.stringify(cache,null,2));await fs.rename(path.join(folder(root),'original-cache.json.tmp'),path.join(folder(root),'original-cache.json'));
  await fs.mkdir(path.join(folder(root),'runs'),{recursive:true});const write=async(file:string)=>{await fs.writeFile(file+'.tmp',JSON.stringify(report,null,2));await fs.rename(file+'.tmp',file);};await write(path.join(folder(root),'runs',report.id+'.json'));await write(path.join(folder(root),'latest.json'));return report;
 }finally{await lock.close();await fs.unlink(path.join(folder(root),'run.lock'));}
}
