import type {FocusClaim,FocusDossier,FocusSource} from './types';
import {normalized,TARGETS,digest,FOCUS_SOURCES,MAP_ENDPOINTS} from './sources';
const sameDoor=(a:string,b:string)=>normalized(a)===normalized(b);
const sameStreet=(a:string,b:string)=>normalized(a).replace(/(sokagi|sokak|sok|sk|caddesi|cad|cd)$/,'')===normalized(b).replace(/(sokagi|sokak|sok|sk|caddesi|cad|cd)$/,'');
export function buildFocusedDossiers(sources:FocusSource[],now=new Date().toISOString()):FocusDossier[]{
 // This audit validates each extracted fact/provenance/scope, rather than accepting initial candidate claims.
 const valid=sources.filter(s=>{const registered=FOCUS_SOURCES.find(p=>p.id===s.id);return (registered?registered.url===s.url&&registered.family===s.family&&registered.kind===s.kind:s.id==='focused-map'&&MAP_ENDPOINTS.includes(s.url)&&s.kind==='map'&&s.family==='openstreetmap.org')&&s.fingerprint===digest(s.facts)&&s.facts.every(f=>/^[a-f0-9]{64}$/.test(f.witnessHash))&&s.status==='ok'&&Number.isFinite(Date.parse(s.accessedAt))&&Date.parse(s.accessedAt)<=Date.parse(now)&&(!s.publishedAt||Date.parse(s.publishedAt)<=Date.parse(now))&&(!s.updatedAt||Date.parse(s.updatedAt)<=Date.parse(now));});
 return TARGETS.map(target=>{
  const extracted=valid.flatMap(source=>source.facts.filter(f=>f.target===target.id&&f.value&&f.witnessHash&&['branch','brand'].includes(f.scope)).map(fact=>({source,fact})));const facts=extracted.filter(x=>!extracted.some(other=>other!==x&&other.source.id===x.source.id&&other.fact.field===x.fact.field&&other.fact.scope===x.fact.scope&&normalized(other.fact.value)!==normalized(x.fact.value)&&normalized(other.fact.value).includes(normalized(x.fact.value))));const claims:FocusClaim[]=[],conflicts:string[]=[],gaps:string[]=[];
  const addresses=facts.filter(({fact})=>fact.field==='address'&&fact.scope==='branch'&&fact.street&&fact.door),addressGroups=new Map<string,typeof addresses>();
  for(const x of addresses){const matching=Array.from(addressGroups.values()).find(group=>sameStreet(group[0].fact.street!,x.fact.street!)&&sameDoor(group[0].fact.door!,x.fact.door!));if(matching)matching.push(x);else addressGroups.set(x.source.id,[x]);}
  let identity:FocusDossier['identity']='unresolved';
  for(const group of Array.from(addressGroups.values())){const families=new Set(group.map(x=>x.source.family));const status=families.size>=2?'corroborated':'source-supported';if(status==='corroborated')identity='corroborated';else if(identity==='unresolved')identity='source-supported';claims.push({id:target.id+'-address-'+claims.length,field:'address',value:group[0].fact.value,scope:'branch',sourceIds:Array.from(new Set(group.map(x=>x.source.id))),status,asOf:null,limitation:'Kaynakların adres beyanı eşleşmesi; harita veya eski rehber tek başına bugünkü faaliyet kanıtı değildir.'});}
  if(addressGroups.size>1){conflicts.push('Şube kapı/adres değerleri kaynaklar arasında uyuşmuyor; güncel doğru kapı kesinleştirilmedi.');identity='unresolved';for(const c of claims)c.status='conflict';}
  const operatorAddresses=addresses.filter(x=>x.source.kind==='operator'&&Date.parse(now)-Date.parse(x.source.accessedAt)<86400000);
  if(facts.some(x=>x.fact.closure))conflicts.push('Yeni haritada faaliyet dışı sinyali var; kapanış kesinleştirilmedi ve dosya hazır sayılmadı.');
  const operation=operatorAddresses.length?'operator-listed':'unverified';if(operation==='operator-listed')claims.push({id:target.id+'-operation',field:'operation',value:'Erişilen resmî şube listesinde mevcut.',scope:'branch',sourceIds:Array.from(new Set(operatorAddresses.map(x=>x.source.id))),status:'source-supported',asOf:operatorAddresses[0].source.accessedAt,limitation:'İşletmenin web beyanıdır; kapının bugün açık olduğu veya bağımsız güncel ziyaret doğrulanmadı.'});
  for(const {source,fact}of facts.filter(x=>x.fact.field!=='address')){
   const editorial=source.kind==='editorial';const historical=editorial&&(!source.publishedAt||Date.parse(now)-Date.parse(source.publishedAt)>365*86400000);
   const limitation=editorial?'Yayında bu ürün/anlatı var; deneyim tarihi bilinmiyor. '+(historical?'Tarihsel/tarihi belirsiz kayıt, güncel kalite tavsiyesi değildir.':'Yayın tarihi ziyaret tarihi değildir; bugünkü servis/kalite kanıtı değildir.'):(fact.scope==='brand'?'Marka menüsü/kataloğu; Moda şubesinde bugünkü stok, servis veya kalite doğrulanmadı.':'İşletmenin beyanı; bağımsız deneyim teyidi değildir.');
   const existing=claims.find(c=>c.field===fact.field&&normalized(c.value)===normalized(fact.value)&&c.scope===fact.scope&&c.status===(historical?'historical':'source-supported'));
   if(existing){if(!existing.sourceIds.includes(source.id))existing.sourceIds.push(source.id);}else claims.push({id:target.id+'-'+claims.length,field:fact.field,value:fact.value,scope:fact.scope,sourceIds:[source.id],status:historical?'historical':'source-supported',asOf:editorial?source.publishedAt:source.updatedAt,limitation});
  }
  for(const source of valid.filter(s=>s.facts.some(f=>f.target===target.id)))for(const note of source.notes||[])if(!conflicts.includes(note))conflicts.push(note);
  gaps.push('Harita erişimi yoksa koordinat doğrulanmış sayılmaz; kaynak adresi koordinat teyidi değildir.');
  gaps.push('Kesin tarihli yeni bağımsız şube ziyareti yok; güncel kalite sıralaması ve kesin açık/kapalı hükmü üretilemez.');
  if(identity!=='corroborated')gaps.push('Şube adresi en az iki ayrı kaynak ailesiyle çelişkisiz eşleştirilmedi.');if(operation==='unverified')gaps.push('Güncel resmî şube/faaliyet beyanı doğrulanamadı.');
  if(!claims.some(c=>c.field==='drink'&&c.sourceIds.some(id=>valid.find(s=>s.id===id)?.kind==='operator')))gaps.push('Erişilebilir resmî içecek menüsü yok; rehber ürünleri güncel servis kabul edilmedi.');
  if(!claims.some(c=>c.field==='food'))gaps.push('Kahve dışı somut ürün için erişilebilir kanıt yok.');
  const independentFamilies=Array.from(new Set(facts.filter(x=>x.source.kind==='editorial').map(x=>x.source.family)));
  const fileReady=!facts.some(x=>x.fact.closure)&&identity==='corroborated'&&operation==='operator-listed'&&independentFamilies.length>=1&&claims.some(c=>c.field==='drink'&&c.sourceIds.some(id=>valid.find(s=>s.id===id)?.kind==='operator'));
  return {id:target.id,name:target.name,candidateId:target.candidateId,claims,identity,operation,quality:'extra-research',fileReady,independentFamilies,gaps,conflicts,costUsd:0};
 });
}
