/** Product-level decisions are independent from venue selection and manual overrides. */
export type ProductState='recommendable'|'menu-confirmed'|'uncertain';
export interface ProductDefinition {id:string;label:string;categoryId:string;variant:string;kind:'drink'|'food';aliases?:string[];}
export interface ProductSource {
 id:string;url:string;publisher:string;kind:'operator'|'expert'|'editorial'|'firsthand'|'directory';
 independent:boolean;firsthand:'explicit'|'observational'|'unclear';sponsorship:'not-detected'|'sponsored'|'unknown';
 publishedAt:string|null;updatedAt:string|null;experienceAt:string|null;experienceYear?:number;checkedAt:string;
 access:'read'|'blocked'|'unavailable';rights:'factual-summary-only'|'link-only';originId:string;derivedFrom?:string;
 note:string;
}
export interface ProductObservation {sourceId:string;productId:string;scope:'branch'|'brand'|'unresolved';branchId:string|null;
 role:'menu'|'review';sentiment:'positive'|'negative'|'mixed'|'neutral';detail:'sensory'|'specific'|'mention';
 association?:'signature'|'visit-purpose'|'best-seller'|'popular';availability?:'listed'|'absent'|'unverified';binding?:'direct-branch'|'operator-linked-shared'|'unverified';note:string;}
export interface SpecialtyObservation {sourceId:string;categoryId:string;scope:'branch'|'brand';branchId:string|null;role:'main-focus'|'visit-purpose'|'category-quality';detail:'specific'|'mention';note:string;}
export interface ProductSubject {venueId:string;brandId:string;name:string;branchId:string;address:string|null;identityVerified:boolean;identityGaps:string[];previousProducts:string[];products:ProductDefinition[];observations:ProductObservation[];specialties:SpecialtyObservation[];}
export interface ProductLedger {schemaVersion:1;method:'development-agent-web-review';researchedAt:string;sources:ProductSource[];subjects:ProductSubject[];limitations:string[];}
export interface ProductDecision {product:ProductDefinition;state:ProductState;reasons:string[];menuEvidence:ProductObservation[];positiveEvidence:ProductObservation[];negativeEvidence:ProductObservation[];historicalEvidence:ProductObservation[];sourceIds:string[];}
export interface CategorySuitability {categoryId:string;status:'supported'|'historical'|'brand-only'|'needs-research';reasons:string[];sourceIds:string[];}
export interface VenueProductResearch {venueId:string;asOf:string;mainSpecialty:{categoryId:string;scope:'branch'|'brand';sourceIds:string[];current:boolean}[];categorySuitability:CategorySuitability[];signatureProducts:string[];recommendedProducts:string[];signatureFindings:{productId:string;status:'supported-association'|'research-lead';current:boolean;sourceIds:string[];reasons:string[]}[];products:ProductDecision[];sources:ProductSource[];identityGaps:string[];previousProducts:string[];}
export const PRODUCT_POLICY={menuCheckDays:90,qualityPublicationDays:365,experienceDays:365,specialtyHistoryDays:1095,maxRecommendations:3} as const;
const safeUrl=(v:string)=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
const recent=(date:string|null,now:string,days:number)=>{if(!date)return false;const age=Date.parse(now)-Date.parse(date);return Number.isFinite(age)&&age>=0&&age<=days*86400000;};
function allowed(s:ProductSource|undefined,now:string):s is ProductSource{return Boolean(s&&safeUrl(s.url)&&s.access==='read'&&s.rights==='factual-summary-only'&&recent(s.checkedAt,now,90));}
function independent(s:ProductSource|undefined,now:string):s is ProductSource{return Boolean(allowed(s,now)&&s.independent&&s.kind!=='operator'&&s.kind!=='directory'&&s.sponsorship==='not-detected'&&!s.derivedFrom);}
function freshQuality(s:ProductSource,now:string){return (!s.experienceYear||s.experienceYear>=new Date(now).getUTCFullYear()-1)&&recent(s.publishedAt,now,PRODUCT_POLICY.qualityPublicationDays)&&(!s.experienceAt||recent(s.experienceAt,now,PRODUCT_POLICY.experienceDays))&&(!s.experienceAt||Date.parse(s.experienceAt)<=Date.parse(s.publishedAt!));}
function rootId(source:ProductSource,sources:Map<string,ProductSource>):string{
 const seen=new Set<string>();let current=source;while(current.derivedFrom){if(seen.has(current.id))return 'invalid-cycle';seen.add(current.id);const next=sources.get(current.derivedFrom);if(!next)return 'unresolved-origin';current=next;}return current.originId;
}
function enough(sources:ProductSource[],all:Map<string,ProductSource>){
 const roots=new Map<string,ProductSource>();for(const s of sources){const root=rootId(s,all);if(root==='invalid-cycle'||root==='unresolved-origin')continue;const old=roots.get(root);if(!old||s.kind==='expert')roots.set(root,s);}
 const unique=Array.from(roots.values());return unique.some(s=>s.kind==='expert'&&s.firsthand!=='unclear')||new Set(unique.filter(s=>s.firsthand==='explicit'||s.firsthand==='observational').map(s=>new URL(s.url).hostname.replace(/^www\./,''))).size>=2;
}
export function evaluateProductSubject(subject:ProductSubject,allSources:ProductSource[],now:string):VenueProductResearch {
 const sources=new Map(allSources.map(s=>[s.id,s]));
 const usableSpecialties=subject.specialties.filter(o=>(o.scope==='brand'||o.branchId===subject.branchId)&&independent(sources.get(o.sourceId),now)&&o.detail==='specific');
 const mainSpecialty=Array.from(new Set(usableSpecialties.filter(o=>o.role==='main-focus'||o.role==='visit-purpose').map(o=>o.categoryId))).map(categoryId=>{
  const claims=usableSpecialties.filter(o=>o.categoryId===categoryId&&(o.role==='main-focus'||o.role==='visit-purpose'));
  return {categoryId,scope:claims.some(o=>o.scope==='branch'&&o.branchId===subject.branchId)?'branch' as const:'brand' as const,sourceIds:Array.from(new Set(claims.map(o=>o.sourceId))),current:claims.some(o=>freshQuality(sources.get(o.sourceId)!,now))};
 });
 const categoryIds=Array.from(new Set([...subject.products.map(p=>p.categoryId),...subject.specialties.map(o=>o.categoryId)]));
 const categorySuitability:CategorySuitability[]=categoryIds.map(categoryId=>{
  const relevant=usableSpecialties.filter(o=>o.categoryId===categoryId&&o.scope==='branch'&&o.branchId===subject.branchId);
  const branchReviews=subject.observations.filter(o=>o.role==='review'&&o.scope==='branch'&&o.branchId===subject.branchId&&o.sentiment==='positive'&&o.detail!=='mention'&&subject.products.find(p=>p.id===o.productId)?.categoryId===categoryId&&independent(sources.get(o.sourceId),now));
  const ids=Array.from(new Set([...relevant.map(o=>o.sourceId),...branchReviews.map(o=>o.sourceId)]));
  const fresh=ids.map(id=>sources.get(id)!).filter(s=>freshQuality(s,now));
  const status=!subject.identityVerified?'needs-research':enough(fresh,sources)?'supported':ids.some(id=>recent(sources.get(id)!.publishedAt,now,PRODUCT_POLICY.specialtyHistoryDays))?'historical':usableSpecialties.some(o=>o.categoryId===categoryId&&o.scope==='brand')?'brand-only':'needs-research';
  return {categoryId,status,reasons:[status==='supported'?'Kategoriye özgü bağımsız, güncel ve ayrıntılı kanıt var.':status==='historical'?'Kategori anlatısı var; güncel güçlü deneyim standardı tamamlanmadı.':status==='brand-only'?'Marka uzmanlığı şubenin kategori başarısı sayılmadı.':'Menü mevcudiyeti, popülerlik veya eksik kimlik kategori başarısını doğrulamaz.'],sourceIds:ids};
 });
 const products:ProductDecision[]=subject.products.map(product=>{
  const observations=subject.observations.filter(o=>o.productId===product.id);
  const validMenu=observations.filter(o=>o.role==='menu'&&o.availability==='listed'&&o.scope==='branch'&&o.branchId===subject.branchId&&['direct-branch','operator-linked-shared'].includes(o.binding||'')&&allowed(sources.get(o.sourceId),now)&&sources.get(o.sourceId)!.kind==='operator'&&recent(sources.get(o.sourceId)!.checkedAt,now,PRODUCT_POLICY.menuCheckDays));
  const reviews=observations.filter(o=>o.role==='review'&&o.scope==='branch'&&o.branchId===subject.branchId&&o.detail!=='mention'&&independent(sources.get(o.sourceId),now));
  const fresh=reviews.filter(o=>freshQuality(sources.get(o.sourceId)!,now)),positive=fresh.filter(o=>o.sentiment==='positive'),negative=fresh.filter(o=>['negative','mixed'].includes(o.sentiment));
  const historical=reviews.filter(o=>!freshQuality(sources.get(o.sourceId)!,now));
  const conflictingMenu=observations.some(o=>o.role==='menu'&&o.availability==='absent'&&o.scope==='branch'&&o.branchId===subject.branchId&&allowed(sources.get(o.sourceId),now)&&sources.get(o.sourceId)!.kind==='operator');
  const category=categorySuitability.find(c=>c.categoryId===product.categoryId);
  const hasMenu=subject.identityVerified&&validMenu.length>0&&!conflictingMenu;
  const canRecommend=hasMenu&&category?.status==='supported'&&negative.length===0&&enough(positive.map(o=>sources.get(o.sourceId)!),sources);
  const state:ProductState=!hasMenu?'uncertain':canRecommend?'recommendable':'menu-confirmed';
  const reasons:string[]=[];
  if(!subject.identityVerified)reasons.push('Fiziksel şube kimliği veya menü sahipliği doğrulanmadı.');
  if(!validMenu.length)reasons.push('Aynı şubeye uygulanabilir güncel resmî menü kaydı yok.');
  if(conflictingMenu)reasons.push('Güncel menü kaynakları ürünün mevcudiyetinde çelişiyor.');
  if(negative.length)reasons.push('Güncel bağımsız ürün değerlendirmelerinde çözülmemiş karşı kanıt var.');
  if(!enough(positive.map(o=>sources.get(o.sourceId)!),sources))reasons.push('Bir güncel güçlü uzman incelemesi veya bağımsız ayrıntılı ilk elden destek eşiği sağlanmadı.');
  if(category?.status!=='supported')reasons.push('Ürün kategorisi için güncel güçlü bağımsız uygunluk kanıtı eksik.');
  if(historical.length)reasons.push('Eski veya deneyim tarihi belirsiz değerlendirmeler güncel tadım sayılmadı.');
  if(canRecommend)reasons.push('Şube menüsü, aynı ürün varyantı, bağımsız ürün kalitesi ve kategori odağı birlikte destekli.');
  return {product,state,reasons,menuEvidence:validMenu,positiveEvidence:positive,negativeEvidence:negative,historicalEvidence:historical,sourceIds:Array.from(new Set(observations.map(o=>o.sourceId)))};
 });
 const ranked=products.filter(p=>p.state==='recommendable').sort((a,b)=>{
  const expert=(p:ProductDecision)=>p.positiveEvidence.some(o=>sources.get(o.sourceId)?.kind==='expert'&&sources.get(o.sourceId)?.firsthand!=='unclear');
  const latest=(p:ProductDecision)=>p.positiveEvidence.map(o=>sources.get(o.sourceId)!.publishedAt||'').sort().pop()||'';
  return Number(expert(b))-Number(expert(a))||latest(b).localeCompare(latest(a))||a.product.id.localeCompare(b.product.id);
 }).slice(0,PRODUCT_POLICY.maxRecommendations);
 const signatureFindings=subject.products.flatMap(product=>{
  const observations=subject.observations.filter(o=>o.productId===product.id&&o.role==='review'&&o.scope==='branch'&&o.branchId===subject.branchId&&o.sentiment==='positive'&&o.detail!=='mention'&&independent(sources.get(o.sourceId),now));
  if(!observations.length)return [];
  const supporting=observations.map(o=>sources.get(o.sourceId)!);
  const associationSources=observations.filter(o=>o.association==='signature'||o.association==='visit-purpose').map(o=>sources.get(o.sourceId)!);
  const supported=subject.identityVerified&&enough(associationSources,sources);
  return [{productId:product.id,status:supported?'supported-association' as const:'research-lead' as const,current:supported&&enough(associationSources.filter(s=>freshQuality(s,now)),sources),sourceIds:Array.from(new Set(observations.map(o=>o.sourceId))),reasons:[supported?'Bağımsız ürüne özgü ilişkilendirme kanıtı var; bu sonuç güncel sunum veya lezzet tavsiyesi değildir.':'Ürüne özgü anlatı araştırma ipucu; güçlü imza ilişkisi doğrulanmadı.']}];
 });
 const used=new Set([...subject.observations.map(o=>o.sourceId),...subject.specialties.map(o=>o.sourceId)]);
 return {venueId:subject.venueId,asOf:now,mainSpecialty,categorySuitability,signatureProducts:signatureFindings.filter(f=>f.status==='supported-association').map(f=>f.productId),recommendedProducts:ranked.map(p=>p.product.id),signatureFindings,products,sources:allSources.filter(s=>used.has(s.id)),identityGaps:[...subject.identityGaps],previousProducts:[...subject.previousProducts]};
}
export function categoryCanLead(research:VenueProductResearch,categoryId:string){return research.categorySuitability.some(c=>c.categoryId===categoryId&&c.status==='supported');}
export function visitorProductLists(research:VenueProductResearch,categoryId:string){
 const selected=research.recommendedProducts.map(id=>research.products.find(p=>p.product.id===id)).filter((p):p is ProductDecision=>Boolean(p&&p.state==='recommendable'));
 return {whatToOrder:selected.filter(p=>p.product.categoryId===categoryId).map(p=>p.product.label),alsoTry:selected.filter(p=>p.product.categoryId!==categoryId).map(p=>p.product.label),menuFrom:research.products.filter(p=>p.state==='menu-confirmed'&&p.product.categoryId===categoryId).slice(0,3).map(p=>p.product.label)};
}

const productNameKey=(text:string)=>text.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').trim().replace(/\s+/g,' ');
export function matchProductLabel(label:string,products:ProductDefinition[]):ProductDefinition|null {
 const key=productNameKey(label),matches=products.filter(p=>[p.label,...(p.aliases||[])].some(alias=>productNameKey(alias)===key));
 return matches.length===1?matches[0]:null;
}
export function validateProductLedger(ledger:ProductLedger){
 if(ledger.schemaVersion!==1||ledger.method!=='development-agent-web-review'||!Number.isFinite(Date.parse(ledger.researchedAt)))throw Error('PRODUCT_LEDGER_PROVENANCE');
 const ids=new Set(ledger.sources.map(s=>s.id));if(ids.size!==ledger.sources.length||new Set(ledger.subjects.map(s=>s.venueId)).size!==ledger.subjects.length)throw Error('PRODUCT_LEDGER_DUPLICATE');
 for(const s of ledger.sources){
  if(!safeUrl(s.url)||!s.originId||!Number.isFinite(Date.parse(s.checkedAt))||(s.derivedFrom&&!ids.has(s.derivedFrom))||!['operator','expert','editorial','firsthand','directory'].includes(s.kind)||!['explicit','observational','unclear'].includes(s.firsthand)||!['not-detected','sponsored','unknown'].includes(s.sponsorship)||!['read','blocked','unavailable'].includes(s.access)||!['factual-summary-only','link-only'].includes(s.rights)||(s.independent&&['operator','directory'].includes(s.kind)))throw Error('PRODUCT_SOURCE_INVALID');
  for(const date of [s.publishedAt,s.updatedAt,s.experienceAt])if(date!==null&&(!/^\d{4}-\d{2}-\d{2}/.test(date)||!Number.isFinite(Date.parse(date))))throw Error('PRODUCT_DATE_INVALID');
  if(s.experienceYear!==undefined&&(!Number.isInteger(s.experienceYear)||s.experienceYear<1900||s.experienceYear>new Date(ledger.researchedAt).getUTCFullYear()))throw Error('PRODUCT_YEAR_INVALID');
 }
 for(const subject of ledger.subjects){const products=new Set(subject.products.map(p=>p.id));if(products.size!==subject.products.length)throw Error('PRODUCT_DUPLICATE');
  for(const p of subject.products)if(!p.id||!p.variant||!p.categoryId||!p.label||p.label.length>80||/muhteşem|efsane|mükemmel|en iyi|mutlaka|bence|benim|[“”"<>]/i.test(p.label))throw Error('PRODUCT_LABEL_INVALID');
  for(const o of subject.observations)if(!ids.has(o.sourceId)||!products.has(o.productId)||!['branch','brand','unresolved'].includes(o.scope)||!['menu','review'].includes(o.role)||!['positive','negative','mixed','neutral'].includes(o.sentiment)||!['sensory','specific','mention'].includes(o.detail))throw Error('PRODUCT_UNSUPPORTED');
  for(const o of subject.specialties)if(!ids.has(o.sourceId))throw Error('SPECIALTY_UNSUPPORTED');
 }
}
