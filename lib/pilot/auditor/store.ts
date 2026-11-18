import { readFocusedReport } from '../research/focused/runner';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';
import { loadCatalog } from '../gastronomy/catalog';
import { readManagementState } from '../gastronomy/store';
import type { ManagedCandidate,ManagementState } from '../gastronomy/types';
import { planAudit,GEOGRAPHIES,AUDIT_BUDGET } from './planner';
import { collectAuditSources,fingerprint } from './sources';
import { compareAudit } from './compare';
import type { AuditorState,AuditorView,AuditJob,CategoryId,Correction } from './types';
const directory=path.join(process.cwd(),'work','quality-auditor');
export class AuditorError extends Error {constructor(message:string,public status=400){super(message);}}
export const initialAuditorState=():AuditorState=>({schemaVersion:1,revision:0,plans:[],jobs:[],cache:{},overlays:{},corrections:[],suppressedCorrections:{},events:[],lastSuccess:{},lastCompleted:{},periodic:{enabled:false,nextDueAt:null,intervalDays:7}});
export function localOnly(){if(process.env.VERCEL||process.env.NODE_ENV==='production')throw new AuditorError('Denetim yalnızca yerel geliştirmede etkin.',403);}
export async function readAuditorState():Promise<AuditorState>{try{const state=JSON.parse(await fs.readFile(path.join(directory,'state.json'),'utf8'));if(state.schemaVersion!==1||!Array.isArray(state.jobs))throw new Error('Invalid audit state');return state;}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return initialAuditorState();throw e;}}
async function transact<T>(fn:(state:AuditorState)=>T|Promise<T>):Promise<T>{
 localOnly();await fs.mkdir(directory,{recursive:true});let lock;
 try{lock=await fs.open(path.join(directory,'write.lock'),'wx');}catch(e){if((e as NodeJS.ErrnoException).code==='EEXIST')throw new AuditorError('Denetim kaydı meşgul; tekrar deneyin.',409);throw e;}
 try{const state=await readAuditorState(),result=await fn(state);state.revision++;const temp=path.join(directory,`state-${process.pid}.tmp`);await fs.writeFile(temp,JSON.stringify(state,null,2));await fs.rename(temp,path.join(directory,'state.json'));return result;}finally{await lock.close();await fs.unlink(path.join(directory,'write.lock'));}
}
const event=(s:AuditorState,action:string,details:string,jobId?:string)=>s.events.push({id:randomUUID(),at:new Date().toISOString(),action,details,...(jobId?{jobId}:{})});
export async function enqueueAudit(geoId:string,category:CategoryId|'all'){
 const planned=planAudit(geoId,category);
 return transact(state=>{
  const now=new Date().toISOString(),id=randomUUID(),jobIds:string[]=[];
  for(const item of planned.jobs){const scope=item.geoId+'/'+item.category;
   const existing=state.jobs.find(j=>j.scope===scope&&['planned','queued','running','retry-wait'].includes(j.status));if(existing){jobIds.push(existing.id);continue;}
   const job:AuditJob={id:randomUUID(),planId:id,geoId:item.geoId,category:item.category,scope,status:item.executable?'queued':'planned',attempts:0,createdAt:now,startedAt:null,completedAt:null,retryAt:null,leaseToken:null,leaseUntil:null,reason:item.executable?'İzole Moda kahve denetimi sırada.':'Pilot dışı kapsam; geniş tarama çalıştırılmadı.',report:null};state.jobs.push(job);jobIds.push(job.id);
  }
  state.plans.push({id,geoId,category,jobIds,createdAt:now,message:planned.message});event(state,'plan',`${jobIds.length} sınırlı alt iş planlandı; Türkiye çapında sorgu yapılmadı.`);return id;
 });
}
export async function retryAudit(id:string){return transact(state=>{const job=state.jobs.find(j=>j.id===id);if(!job||!['failed','partial','retry-wait'].includes(job.status))throw new AuditorError('Bu iş yeniden denenemez.',409);if(job.attempts>=AUDIT_BUDGET.maxAttempts)throw new AuditorError('En fazla üç deneme yapılabilir.',409);if(job.retryAt&&Date.parse(job.retryAt)>Date.now())throw new AuditorError('Güvenli yeniden deneme bekleme süresi dolmadı.',429);job.status='queued';job.reason='Başarısız kaynaklar yeniden denenmek üzere sırada; geçerli önbellek korunur.';event(state,'retry',job.reason,job.id);});}
export function correctionKey(c:Pick<Correction,'scope'|'candidateId'|'field'>){return `${c.scope}|${c.candidateId}|${c.field}`;}
export function projectAuditCatalog(catalog:ManagedCandidate[],state:AuditorState,manual:Record<string,'add'|'remove'>){
 const active:string[]=[];const result=catalog.map(c=>({...c}));
 for(const overlay of Object.values(state.overlays)){const c=result.find(c=>c.id===overlay.candidateId);if(!c||manual[c.id]||overlay.undoneAt||c[overlay.field]!==overlay.before)continue;c[overlay.field]=overlay.after;active.push(overlay.id);}
 return {candidates:result,active};
}
export function auditInputCatalog(catalog:ManagedCandidate[],management:ManagementState){
 const map=new Map(catalog.map(c=>[c.id,c]));
 for(const c of Object.values(management.retainedCandidates||{}))if(!map.has(c.id))map.set(c.id,{...c,identityVerified:false,operation:'unknown'});
 for(const c of Object.values(management.manualCandidates))map.set(c.id,c);
 return Array.from(map.values());
}
const manualFor=(management:ManagementState)=>Object.fromEntries(Object.entries(management.scopes['moda-kadikoy/coffee']?.overrides||{}).map(([id,v])=>[id,v.mode]));
export async function readAuditProjection(){const [raw,state,management]=await Promise.all([loadCatalog(),readAuditorState(),readManagementState()]);return projectAuditCatalog(auditInputCatalog(raw,management),state,manualFor(management));}
export async function readAuditorView():Promise<AuditorView>{const [state,raw,management,focused]=await Promise.all([readAuditorState(),loadCatalog(),readManagementState(),readFocusedReport()]);const projection=projectAuditCatalog(auditInputCatalog(raw,management),state,manualFor(management));return {focused,revision:state.revision,geographies:GEOGRAPHIES,plans:state.plans,jobs:state.jobs,corrections:state.corrections,events:state.events,lastSuccess:state.lastSuccess,lastCompleted:state.lastCompleted,periodic:state.periodic,budgets:AUDIT_BUDGET,productionCorrectionEnabled:false,isolation:'audit-overlay-only',activeCorrectionIds:projection.active};}
export async function undoAuditCorrections(jobId:string){return transact(state=>{
 const corrections=state.corrections.filter(c=>c.jobId===jobId&&!c.undoneAt);if(!corrections.length)throw new AuditorError('Geri alınacak etkin düzeltme yok.',409);
 for(const c of corrections)if(state.overlays[correctionKey(c)]?.id!==c.id)throw new AuditorError('Sonraki düzeltme korunuyor; eski işlem onu ezemez.',409);
 const now=new Date().toISOString();state.suppressedCorrections ||= {};for(const c of corrections){c.undoneAt=now;state.suppressedCorrections[correctionKey(c)]={before:c.before,after:c.after,undoneAt:now};delete state.overlays[correctionKey(c)];}event(state,'undo',`${corrections.length} izole düzeltme geri alındı; önceki araştırma/manuel karar dosyaları değişmedi.`,jobId);
 });}
export async function setPeriodicAudit(enabled:boolean){return transact(state=>{state.periodic={enabled,nextDueAt:enabled?new Date(Date.now()+7*86400000).toISOString():null,intervalDays:7};event(state,'periodic',enabled?'Yalnızca Moda kahve için haftalık denetim planı etkin.':'Periyodik denetim planı kapalı.');});}
export async function scheduleDueAudit(){const s=await readAuditorState();if(!s.periodic.enabled||!s.periodic.nextDueAt||Date.parse(s.periodic.nextDueAt)>Date.now())return false;await enqueueAudit('moda','coffee');await transact(state=>{state.periodic.nextDueAt=new Date(Date.now()+7*86400000).toISOString();});return true;}
export async function runNextAudit(fetcher:typeof fetch=fetch){
 localOnly();const claim=await transact(state=>{
  const now=Date.now();
  for(const j of state.jobs)if(j.status==='running'&&j.leaseUntil&&Date.parse(j.leaseUntil)<=now){j.status=j.attempts>=AUDIT_BUDGET.maxAttempts?'failed':'retry-wait';j.retryAt=new Date(now+60000).toISOString();j.reason='Önceki işlem süresi doldu; eski işçi sonucu kabul edilmeyecek.';j.leaseToken=null;event(state,'lease-expired',j.reason,j.id);}
  for(const j of state.jobs)if(['retry-wait','partial','failed'].includes(j.status)&&j.retryAt&&Date.parse(j.retryAt)<=now&&j.attempts<AUDIT_BUDGET.maxAttempts&&j.geoId==='moda'&&j.category==='coffee')j.status='queued';
  if(state.jobs.some(j=>j.status==='running'))return null;
  const job=state.jobs.find(j=>j.status==='queued'&&j.geoId==='moda'&&j.category==='coffee'&&j.attempts<AUDIT_BUDGET.maxAttempts);
  if(!job)return null;job.status='running';job.attempts++;job.startedAt=new Date(now).toISOString();job.leaseToken=randomUUID();job.leaseUntil=new Date(now+120000).toISOString();event(state,'started','Kaynak bütçesi 8 istek; eşzamanlı iş sınırı 1.',job.id);return {job:JSON.parse(JSON.stringify(job)) as AuditJob,cache:state.cache,previous:state.jobs.filter(j=>j.scope===job.scope&&j.report).at(-1)?.report?.results||[]};
 });
 if(!claim)return null;
 try{
  const [raw,management]=await Promise.all([loadCatalog(),readManagementState()]);const catalog=auditInputCatalog(raw,management),manual=manualFor(management);
  const {sources,requestsUsed}=await collectAuditSources(claim.cache,fetcher);const report=compareAudit(catalog,manual,sources,claim.previous,requestsUsed);
  const [latestRaw,latestManagement]=await Promise.all([loadCatalog(),readManagementState()]);const latestCatalog=auditInputCatalog(latestRaw,latestManagement);
  await transact(state=>{const job=state.jobs.find(j=>j.id===claim.job.id);if(!job||job.status!=='running'||job.leaseToken!==claim.job.leaseToken||!job.leaseUntil||Date.parse(job.leaseUntil)<Date.now())throw new AuditorError('Eski işçi sonucu reddedildi.',409);
   for(const s of sources)state.cache[s.id]=s;const now=new Date().toISOString();
   for(const proposal of report.correctionProposals){const base=latestCatalog.find(c=>c.id===proposal.candidateId),original=catalog.find(c=>c.id===proposal.candidateId);
    const identity=(c:ManagedCandidate)=>fingerprint({id:c.id,name:c.name,address:c.address,coordinates:c.coordinates,region:c.regionId,categories:c.categoryIds});
    if(!base||!original||identity(base)!==identity(original)||latestManagement.scopes['moda-kadikoy/coffee']?.overrides[base.id]||base[proposal.field]!==proposal.before){const warning='Denetim sürerken kimlik veya manuel tercih değişti; ilgili düzeltme uygulanmadı.';if(!report.warnings.includes(warning))report.warnings.push(warning);continue;}const key=correctionKey({...proposal,scope:job.scope});if(state.overlays[key]?.after===proposal.after||(state.suppressedCorrections?.[key]?.before===proposal.before&&state.suppressedCorrections[key].after===proposal.after))continue;
    const correction:Correction={...proposal,id:randomUUID(),jobId:job.id,scope:job.scope,createdAt:now,undoneAt:null};state.corrections.push(correction);state.overlays[key]=correction;report.stats.correctionsApplied++;event(state,'corrected',`${base.name}: yalnızca ${proposal.field} boşluk biçimi düzeltildi.`,job.id);
   }
   job.report=report;job.completedAt=now;job.status=sources.every(s=>s.status==='ok')?'completed':'partial';job.reason=job.status==='completed'?'Sınırlı kaynak kontrolü tamamlandı; tam işletme doğrulaması ayrı gösterilir.':'Bazı kaynaklar erişilemedi; kısmi sonuç korunuyor.';job.retryAt=job.status==='partial'?new Date(Date.now()+60000*2**(job.attempts-1)).toISOString():null;job.leaseToken=null;job.leaseUntil=null;state.lastCompleted[job.scope]=now;if(job.status==='completed')state.lastSuccess[job.scope]=now;event(state,'completed',job.reason,job.id);
  });return claim.job.id;
 }catch(e){await transact(state=>{const job=state.jobs.find(j=>j.id===claim.job.id);if(job?.status==='running'&&job.leaseToken===claim.job.leaseToken){job.status='failed';job.reason=e instanceof Error?e.message:'Audit unavailable';job.completedAt=new Date().toISOString();job.retryAt=new Date(Date.now()+60000*2**(job.attempts-1)).toISOString();job.leaseToken=null;job.leaseUntil=null;event(state,'failed',job.reason,job.id);}});return claim.job.id;}
}
