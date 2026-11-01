import {assessPortfolio,compareAssessments} from './portfolio';
import type { Evidence,ManagedCandidate,Assessment,Category,Region,Scope,ScopeView } from './types';
export const POLICY_VERSION='autonomous-v2-2026-10-30';
export const DEFAULT_CATEGORIES:Category[]=[{id:'must-try',name:'Mutlaka Denenmesi Gerekenler'},{id:'coffee',name:'Nitelikli Kahve'},{id:'burger',name:'Hamburger'},{id:'pizza',name:'Pizza'},{id:'breakfast',name:'Kahvaltı'},{id:'regional',name:'Yöresel Lezzetler'},{id:'dessert',name:'Tatlı ve Fırın'}];
export const emptyScope=():Scope=>({automaticIds:[],overrides:{},order:[],lastRunAt:null,nextReviewAt:null,publishedIds:[],warnings:[]});
export function validateCategories(categories:Category[]) {
 if(!Array.isArray(categories)||categories.length<1||categories.length>7)throw new Error('Bölgede 1–7 kategori olmalı.');
 if(categories[0]?.id!=='must-try'||categories[0]?.name!=='Mutlaka Denenmesi Gerekenler')throw new Error('İlk kategori Mutlaka Denenmesi Gerekenler olmalı.');
 if(new Set(categories.map(c=>c.id)).size!==categories.length || categories.some(c=>!/^[-a-z0-9]{1,50}$/.test(c.id)||typeof c.name!=='string'||!c.name.trim()||c.name.length>80))throw new Error('Kategori kimliği/adı geçersiz.');
}
export function recent(date:string|null,now:string,days:number) {if(!date)return false;const age=Date.parse(now)-Date.parse(date);return Number.isFinite(age)&&age>=0&&age<=days*86400000;}
export function evidenceAllowed(e:Evidence,c:ManagedCandidate,category:string,now:string) {
 try {const u=new URL(e.url);if(u.protocol!=='https:'||u.username||u.password)return false;}catch{return false;}
 return e.usable&&e.branchId===c.id&&e.productCategory===category&&recent(e.checkedAt,now,90);
}
export function assess(c:ManagedCandidate,category:string,now:string):Assessment {
 if(c.researchProfile?.policy==='portfolio-v2')return assessPortfolio(c,category,now);
 const reasons:string[]=[];
 const usable=c.evidence.filter(e=>evidenceAllowed(e,c,category,now));
 const independent=usable.filter(e=>e.kind==='independent'&&Boolean(e.productName?.trim())&&recent(e.publishedAt,now,365)&&Date.parse(e.publishedAt!)<=Date.parse(e.checkedAt)&&(!e.experienceAt||Date.parse(e.experienceAt)<=Date.parse(e.publishedAt!)));
 const families=Array.from(new Set(independent.map(e=>e.family).filter(Boolean)));
 const experiences=independent.filter(e=>recent(e.experienceAt,now,180));
 const operator=usable.some(e=>e.kind==='operator');
 if(!c.categoryIds.includes(category))reasons.push('Kategoriye özgü ürün kanıtı yok.');
 if(!c.identityVerified||!c.address||!c.coordinates)reasons.push('Doğru şube/adres/konum teyidi eksik.');
 if(c.operation!=='listed'||!operator)reasons.push(c.operation==='confirmed-closed'?'Kapanış doğrulandı; yayın durduruldu.':'Son 90 günde şubeye özgü işletme faaliyet beyanı eksik.');
 if(c.conflicts.length)reasons.push('Kimlik veya kanıtta çözülmemiş önemli çelişki var.');
 if(families.length<2)reasons.push('Son 365 günde iki bağımsız şube/ürün kaynağı ailesi yok.');
 if(!experiences.length)reasons.push('Son 180 günde kesin tarihli bağımsız şube deneyimi yok.');
 return {id:c.id,name:c.name,eligible:reasons.length===0,reasons,familyCount:families.length,latestExperience:experiences.map(e=>e.experienceAt!).sort().reverse()[0]||null,evidence:[...independent,...usable.filter(e=>e.kind==='operator')],conflicts:c.conflicts,manual:null,origin:'research',warnings:[...(c.advisories||[])]};
}
export function evaluateScope(candidates:ManagedCandidate[],region:Region,categoryId:string,scope:Scope,now:string):ScopeView {
 const category=region.categories.find(c=>c.id===categoryId);if(!category)throw new Error('Kategori bu bölgede etkin değil.');
 const assessments=candidates.filter(c=>c.regionId===region.id&&(c.categoryIds.includes(categoryId)||Boolean(scope.overrides[c.id]))).map(c=>{
  const a=assess(c,categoryId,now),o=scope.overrides[c.id];a.manual=o?.mode||null;
  if(o?.mode==='add'&&!a.eligible)a.warnings.push('Manuel ekleme korundu; kanıt sorunları nedeniyle yayımlanamaz.');
  if(o?.mode==='remove')a.reasons.push('Yönetici tarafından çıkarıldı; otomatik geri ekleme kapalı.');return a;
 });
 const priority=compareAssessments;
 const wanted=assessments.filter(a=>a.eligible&&a.manual!=='remove'&&(a.manual==='add'||scope.automaticIds.includes(a.id)));
 wanted.sort((a,b)=>{
  const ai=scope.order.indexOf(a.id),bi=scope.order.indexOf(b.id);
  if(ai>=0||bi>=0)return (ai<0?Number.MAX_SAFE_INTEGER:ai)-(bi<0?Number.MAX_SAFE_INTEGER:bi);
  return Number(b.manual==='add')-Number(a.manual==='add')||priority(a,b);
 });
 const selected=wanted.slice(0,5).map(a=>({...a,origin:(a.manual==='add'?'manual':'automatic') as Assessment['origin']}));
 const selectedIds=new Set(selected.map(a=>a.id));
 const research=assessments.filter(a=>!selectedIds.has(a.id)&&a.manual!=='remove').map(a=>({...a,reasons:a.eligible?[...a.reasons,'Kanıtı uygun; seçki kapasitesi/sırası nedeniyle yedekte.']:a.reasons}));
 const warnings=[...scope.warnings,...(selected.length<3?[`Kanıt standardını sağlayan seçki ${selected.length} mekan. Listeyi doldurmak için standart düşürülmedi.`]:[])];
 return {key:region.id+'/'+categoryId,region,category,selected,research,manualHeld:research.filter(a=>a.manual==='add'),excluded:assessments.filter(a=>a.manual==='remove'),lastRunAt:scope.lastRunAt,nextReviewAt:scope.nextReviewAt,warnings,localPublished:scope.publishedIds.filter(id=>selectedIds.has(id))};
}
export function eligibleOrder(candidates:ManagedCandidate[],category:string,now:string) {
 return candidates.map(c=>assess(c,category,now)).filter(a=>a.eligible).sort(compareAssessments).map(a=>a.id);
}
