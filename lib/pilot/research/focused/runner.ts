import {readSourceAccessReport} from './sourceAccess';
import {promises as fs,existsSync,readFileSync} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {FocusHttp,FOCUS_SOURCES,FOCUS_LIMITS,digest} from './sources';
import {buildFocusedDossiers} from './report';
import type {FocusCache,FocusReport} from './types';
export function focusedConnections(){
 const values=['OPENAI_API_KEY','GEMINI_API_KEY','GOOGLE_GENERATIVE_AI_API_KEY','GOOGLE_APPLICATION_CREDENTIALS','GOOGLE_CLOUD_PROJECT','GOOGLE_CLOUD_PROJECT_ID','BRAVE_API_KEY','BRAVE_SEARCH_API_KEY','TAVILY_API_KEY','SERPER_API_KEY','GOOGLE_MAPS_API_KEY'].map(name=>({name,configured:Boolean(process.env[name]?.trim())}));
 values.push({name:'GOOGLE_SERVICE_ACCOUNT_FILE',configured:existsSync(path.join(process.cwd(),'google-credentials.json'))});
 try{const receipt=JSON.parse(readFileSync(path.join(process.cwd(),'work','focused-research','connections.json'),'utf8'));values.push({name:'GOOGLE_OAUTH_TEST_PASSED',configured:receipt.googleServiceAccountOAuth===true&&Date.now()-Date.parse(receipt.checkedAt)<86400000});}catch{values.push({name:'GOOGLE_OAUTH_TEST_PASSED',configured:false});}
 return values;
}
export const FOCUSED_DIAGNOSIS=[
 'Önceki denetçi ürün, kategori, faaliyet ve güncellik alanlarını koşulsuz unverified üretiyordu; yedi alanın tamamını isteyen başarı ölçütü bu adaptörlerle hiçbir zaman sağlanamıyordu.',
 'Bağımsız ürün/menü olguları harita eşleşmesinden bağımsız değerlendirilmiyordu. Overpass 502 ve Montag 429 temel adres eşleştirmesini de engelledi.',
 'Arama API anahtarı yok. Önceki kontrolün atladığı mevcut Google servis hesabı ayrıca bulundu; OAuth testi başarılı. Model yetkisi/kota/faturalama model çağrısıyla sınanmadı. Oturum web araması uygulamanın API bağlantısı değildir.',
 'Bazı ilk havuz kayıtları aynı marka farklı şube. Coffee Manifesto Güneşli Bahçe kaydı, resmî Moda şubesiyle birleştirilmedi.',
];
const dir=()=>path.join(process.cwd(),'work','focused-research');
export async function readFocusedReport():Promise<FocusReport|null>{try{const report=JSON.parse(await fs.readFile(path.join(dir(),'latest.json'),'utf8'));return {...report,connections:focusedConnections(),sourceAccess:await readSourceAccessReport()};}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e;}}
export async function runFocusedResearch(fetcher:typeof fetch=fetch):Promise<FocusReport>{
 if(process.env.NODE_ENV==='production'||process.env.VERCEL)throw new Error('LOCAL_FOCUSED_RESEARCH_ONLY');await fs.mkdir(dir(),{recursive:true});const lockPath=path.join(dir(),'run.lock');const lock=await fs.open(lockPath,'wx');
 try{
  let cache:FocusCache={sources:{},blockedHosts:{}};try{cache=JSON.parse(await fs.readFile(path.join(dir(),'cache.json'),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  // Respect access denial already encountered by the independent auditor, across both paths on the same host.
  try{const audit=JSON.parse(await fs.readFile(path.join(process.cwd(),'work','quality-auditor','state.json'),'utf8'));for(const source of Object.values(audit.cache||{})as {url:string;status:string;validatedAt:string;error:string}[]){if(source.status==='blocked'&&/403|429/.test(source.error||'')){const host=new URL(source.url).hostname.replace(/^www\./,'');const until=new Date(Date.parse(source.validatedAt)+86400000).toISOString();if(Date.parse(until)>Date.now())cache.blockedHosts[host]={until,reason:source.error};}}}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  const startedAt=new Date().toISOString(),http=new FocusHttp(cache,fetcher),sources=[];
  // Sequential and bounded: no burst against publishers, robots checked once per host, no model or paid calls.
  for(const spec of FOCUS_SOURCES){const source=await http.page(spec);sources.push(source);cache.sources[source.id]=source;}
  const map=await http.map();sources.push(map);cache.sources[map.id]=map;
  const completedAt=new Date().toISOString(),dossiers=buildFocusedDossiers(sources,completedAt);
  // Prior discovery is a comparison target only, never supporting evidence for the new file.
  try{const baseline=JSON.parse(await fs.readFile(path.join(process.cwd(),'work','pilot-research','latest.json'),'utf8'));const old=(baseline.candidates||[]).find((c:{id:string;address?:string})=>c.id==='osm-node-5688805531');const current=dossiers.find(d=>d.id==='manifesto');if(old?.address&&current?.claims.some(c=>c.field==='address')&&old.address!==current.claims.find(c=>c.field==='address')?.value)current.conflicts.push('İlk havuzdaki '+old.address+' adresi ile erişilen Moda adresi farklı; şubeler birleştirilmedi.');}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  const report:FocusReport={schemaVersion:1,id:randomUUID(),startedAt,completedAt,method:'live-source-fetch-and-deterministic-claim-audit',demo:false,diagnosis:FOCUSED_DIAGNOSIS,connections:focusedConnections(),sources,access:http.logs,dossiers,stats:{targets:dossiers.length,filesReady:dossiers.filter(d=>d.fileReady).length,supportedClaims:dossiers.flatMap(d=>d.claims).filter(c=>['source-supported','corroborated'].includes(c.status)).length,historicalClaims:dossiers.flatMap(d=>d.claims).filter(c=>c.status==='historical').length,conflicts:dossiers.reduce((n,d)=>n+d.conflicts.length,0),fullyQualityVerified:0,httpRequests:http.logs.filter(l=>l.stage!=='cache').length,cacheHits:http.logs.filter(l=>l.stage==='cache').length,apiCostUsd:0,modelCalls:0},limits:FOCUS_LIMITS,limitations:[
   'Kaynak kayıt dizini bu geliştirme oturumunda web aramasıyla seçildi; bağımsız yeni URL keşfi uygulamada arama API anahtarı olmadan otomatik tekrarlanamaz.',
   'Bu çalışma doğrulanmış kaynak olguları içeren kanıt dosyası üretir. Tüm güncel kalite/faaliyet alanları doğrulandı veya otomatik yayına uygun anlamına gelmez.',
   'Harici API bedeli 0 USD; Codex oturumunun hesap kullanım bedeli uygulama tarafından ölçülemez. Model çağrısı yapılmadı.',
   'Ham sayfa, müşteri yorumu, puan ve fotoğraf saklanmaz. Olgular, kaynak ailesi/tarihi, içerik parmak izi ve erişim günlükleri saklanır.',
  ]};
  const history:NonNullable<FocusReport['history']>=[];
  try{for(const filename of (await fs.readdir(path.join(dir(),'runs'))).filter(name=>/^[a-f0-9-]+\.json$/.test(name)).slice(-100)){const past:FocusReport=JSON.parse(await fs.readFile(path.join(dir(),'runs',filename),'utf8'));history.push({id:past.id,completedAt:past.completedAt,httpRequests:past.stats.httpRequests,cacheHits:past.stats.cacheHits,filesReady:past.stats.filesReady,apiCostUsd:past.stats.apiCostUsd});}}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  history.push({id:report.id,completedAt,httpRequests:report.stats.httpRequests,cacheHits:report.stats.cacheHits,filesReady:report.stats.filesReady,apiCostUsd:0});report.history=history.sort((a,b)=>a.completedAt.localeCompare(b.completedAt)).slice(-20);
  const write=async(name:string,data:unknown)=>{const tmp=path.join(dir(),name+'.tmp');await fs.writeFile(tmp,JSON.stringify(data,null,2));await fs.rename(tmp,path.join(dir(),name));};
  await write('cache.json',cache);await fs.mkdir(path.join(dir(),'runs'),{recursive:true});await write('runs/'+report.id+'.json',report);await write('latest.json',report);
  // Individual automatically generated evidence files contain only extracted factual metadata, never demo dossiers.
  for(const dossier of dossiers)await write(dossier.id+'.json',{runId:report.id,generatedAt:completedAt,demo:false,dossier,sources:sources.filter(s=>s.facts.some(f=>f.target===dossier.id)),auditFingerprint:digest(dossier)});
  return report;
 }finally{await lock.close();await fs.unlink(lockPath);}
}
