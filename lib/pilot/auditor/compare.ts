import type { ManagedCandidate } from '../gastronomy/types';
import type { AuditReport,AuditSource,CandidateAudit,FieldCheck,MapFact } from './types';
import { fingerprint } from './sources';
import { AUDIT_BUDGET } from './planner';
const normalize=(v:string)=>v.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,' ').trim();
const brand=(v:string)=>normalize(v.split('•')[0]).replace(/\b(coffee|roasters|roastery|food|moda|kadikoy|and)\b/g,'').replace(/\s+/g,' ').trim();
const street=(v:string)=>normalize(v).replace(/\b(sokagi|sokak|sok|sk|caddesi|cadde|cad|cd)\b/g,'').replace(/\s+/g,' ').trim();
const house=(v:string)=>normalize(v).replace(/\s/g,'');
const cleanWhitespace=(v:string)=>v.trim().replace(/\s+/g,' ');
const distance=(a:{lat:number;lng:number},b:{lat:number;lng:number})=>{const r=Math.PI/180,h=Math.sin((a.lat-b.lat)*r/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin((a.lng-b.lng)*r/2)**2;return 12742000*Math.asin(Math.min(1,Math.sqrt(h)));};
export function compareAudit(catalog:ManagedCandidate[],manual:Record<string,'add'|'remove'>,sources:AuditSource[],previous:CandidateAudit[]=[],requestsUsed=0,now=new Date().toISOString()):AuditReport {
 const mapSource=sources.find(s=>s.id==='map'&&s.status==='ok'),map=mapSource?.facts.map||[];
 const operatorSources=sources.filter(s=>s.kind==='operator'&&s.status==='ok');
 const editorialSources=sources.filter(s=>s.kind==='editorial'&&s.status==='ok');
 const baseline=catalog.filter(c=>c.regionId==='moda-kadikoy'&&(c.categoryIds.includes('coffee')||manual[c.id]));
 const limited=[...baseline].sort((a,b)=>a.id.localeCompare(b.id)).slice(0,AUDIT_BUDGET.maxCandidates);
 const proposals:AuditReport['correctionProposals']=[],results:CandidateAudit[]=[];
 for(const c of limited){
  const signature=fingerprint({version:1,date:now.slice(0,10),baseline:{id:c.id,name:c.name,address:c.address,coordinates:c.coordinates,categories:c.categoryIds,claims:c.claimNotes,evidence:c.evidence},manual:manual[c.id]||null,sources:sources.map(s=>[s.id,s.status,s.fingerprint])});
  const cached=previous.find(r=>r.id===c.id&&r.comparisonFingerprint===signature);
  if(cached){results.push({...cached,reused:true});continue;}
  const point=map.find(m=>m.id===c.id),checks:FieldCheck[]=[],warnings:string[]=[];
  const identityCompatible=Boolean(point&&brand(point.name)&&brand(c.name)===brand(point.name));
  checks.push({field:'identity',status:identityCompatible?'consistent':point?'conflict':'unverified',detail:identityCompatible?'Yeni harita sorgusunda nesne kimliği ve ad tutarlı; bu kaynak ilk haritayla aynı aileden.':point?'Aynı harita nesnesindeki işletme adı mevcut kayıtla uyuşmuyor.':'Yeni harita sorgusunda eşleşen nesne yok; bu tek başına kapanış kanıtı değildir.',sourceIds:point?['map']:[]});
  const near=Boolean(point&&c.coordinates&&distance(c.coordinates,point)<=30);
  checks.push({field:'location',status:near?'consistent':point&&c.coordinates?'conflict':'unverified',detail:near?'Koordinat yeni harita kaydıyla 30 m içinde; bağımsız ikinci konum teyidi değildir.':point&&c.coordinates?'Koordinat farkı 30 m üzerinde; taşıma otomatik uygulanmadı.':'Konum doğrulanamadı.',sourceIds:point?['map']:[]});
  const op=point?.street&&point.houseNumber?operatorSources.flatMap(s=>(s.facts.operators||[]).map(f=>({source:s,fact:f}))).find(({fact:f})=>normalize(point.name).includes(normalize(f.brand))&&street(point.street!)===street(f.street)&&house(point.houseNumber!)===house(f.houseNumber)):undefined;
  if(op&&identityCompatible)checks[0]={field:'identity',status:'corroborated',detail:'Yeni harita kimliği ile işletmenin şube listesi aynı sokak ve kapı numarasında eşleşiyor.',sourceIds:['map',op.source.id]};
  if(point?.closure)warnings.push('Yeni harita kaydında faaliyet dışı sinyali var; işletme kapanışı kesinleştirilmedi.');
  checks.push({field:'operation',status:point?.closure&&op?'conflict':'unverified',detail:point?.closure?op?'Harita kapanış sinyali ile işletme şube listesi çelişiyor.':'Haritada kapanış sinyali var; bağımsız güncel faaliyet araştırması gerekli.':op?'İşletme şube listesinde mevcut; bugün açık olduğu bağımsız deneyimle teyit edilmedi.':'Güncel faaliyet için şubeye özgü bağımsız kanıt yok.',sourceIds:[...(point?['map']:[]),...(op?[op.source.id]:[])]});
  checks.push({field:'category',status:'unverified',detail:point?.coffeeSignal?'Yeni haritada kahve sinyali var; nitelikli kahve uzmanlığı veya kategoriye kesin uygunluk kanıtı değildir.':'Kahve uzmanlığı yeniden doğrulanmadı; başka yiyecek satmak eleme nedeni değildir.',sourceIds:point?['map']:[]});
  const mentions=editorialSources.flatMap(s=>(s.facts.editorial||[]).filter(f=>brand(f.name)===brand(c.name)).map(f=>({source:s,fact:f})));
  checks.push({field:'products',status:'unverified',detail:mentions.length?mentions.map(m=>`${m.source.family}: ${m.fact.products.join(', ')||'somut ürün adı çıkarılamadı'}; yayın ${m.fact.publishedAt||'belirsiz'}, deneyim tarihi belirsiz. Marka anlatısı belirli şubeye taşınmadı.`).join(' '):'Önerilen ürünler için yeni şube kapsamlı bağımsız tadım kanıtı bulunmadı.',sourceIds:mentions.map(m=>m.source.id)});
  const families=Array.from(new Set(mentions.map(m=>m.source.family)));
  checks.push({field:'sources',status:'unverified',detail:`Yeni okumada ${families.length} ilgili editöryal aile görüldü. Aynı yayının yeniden okunması yeni bağımsız kaynak değildir. İlk seçimin kalite hükmü kabul edilmedi.`,sourceIds:mentions.map(m=>m.source.id)});
  checks.push({field:'freshness',status:'unverified',detail:'Kaynak erişim/önbellek tarihleri ayrı tutuldu. Kesin tarihli yeni şube deneyimi yok; güncellik ileri taşınmadı.',sourceIds:mentions.map(m=>m.source.id)});
  if(manual[c.id]==='remove')warnings.push('Manuel çıkarma korundu; denetçi işletmeyi yeniden ekleyemez.');
  if(manual[c.id]==='add')warnings.push('Manuel ekleme korundu; eksik kanıt ve faaliyet sorunları ayrıca işaretlendi.');
  if(op&&point&&near&&identityCompatible&&!point.closure&&!manual[c.id])for(const field of ['name','address'] as const){const before=c[field];if(typeof before==='string'){const after=cleanWhitespace(before);if(before!==after&&before.trim()&&proposals.length<AUDIT_BUDGET.maxCorrections)proposals.push({candidateId:c.id,field,before,after,reason:'Aynı şube harita ve işletme listesinde eşleşti. Yalnızca gereksiz boşluklar düzeltildi; isim/adres içeriği değiştirilmedi.',sourceIds:['map',op.source.id],sourceFingerprints:[mapSource!.fingerprint!,op.source.fingerprint!]});}}
  results.push({id:c.id,name:c.name,manual:manual[c.id]||null,verified:checks.every(c=>c.status==='consistent'||c.status==='corroborated'),checks,warnings,comparisonFingerprint:signature,computedAt:now,reused:false});
 }
 const knownIds=new Set(catalog.map(c=>c.id));
 const novel=map.filter(m=>m.coffeeSignal&&!m.closure&&!knownIds.has(m.id));const distinct:MapFact[]=[];
 for(const m of novel)if(!distinct.some(p=>brand(p.name)===brand(m.name)&&distance(p,m)<25))distinct.push(m);
 const newCandidates=distinct.slice(0,AUDIT_BUDGET.maxNewCandidates).map(m=>({id:m.id,name:m.name,status:'extra-research' as const,reason:'İlk katalog dışında yeni harita adayı; güçlü aday sayılması için bağımsız şube/ürün ve güncel deneyim kanıtı gerekli.'}));
 return {checkedAt:now,results,sources,newCandidates,newStrongCandidates:[],correctionProposals:proposals,warnings:['Bu pilot ayrı kaynak okumaları ve olgusal alan karşılaştırması yapar. Model/arama sağlayıcısı bağlı olmadığından tam AI kalite denetimi tamamlanmış sayılmaz.','Denetim katmanı dışında araştırma verisi, manuel kararlar veya üretim yayını değiştirilmedi.','Harita nesnesinin yeniden görülmesi bağımsız kaynak veya açık işletme teyidi değildir.'],stats:{inspected:results.length,fullyVerified:results.filter(r=>r.verified).length,mapConsistent:results.filter(r=>r.checks.find(c=>c.field==='location')?.status==='consistent').length,operatorCorroborated:results.filter(r=>r.checks.find(c=>c.field==='identity')?.status==='corroborated').length,newDiscovered:newCandidates.length,strongNew:0,reusedComparisons:results.filter(r=>r.reused).length,requestsUsed,correctionsApplied:0,truncated:baseline.length>limited.length||distinct.length>newCandidates.length}};
}
