import {buildVenueCards} from './cards';
import { randomUUID } from 'node:crypto';
import { DEFAULT_CATEGORIES,emptyScope,evaluateScope,eligibleOrder,validateCategories,POLICY_VERSION } from './policy';
import type { ManagementState,ManagementAction,ManagedCandidate,ManagementView,Patch,Scope,Region } from './types';
export class ManagementError extends Error {constructor(message:string,public status=400){super(message);}}
const copy=<T>(v:T):T=>JSON.parse(JSON.stringify(v));
export const scopeKey=(region:string,category:string)=>`${region}/${category}`;
export function initialState():ManagementState {return {schemaVersion:1,revision:0,regions:{'moda-kadikoy':{id:'moda-kadikoy',name:'Moda–Kadıköy',categories:copy(DEFAULT_CATEGORIES)}},scopes:{},manualCandidates:{},retainedCandidates:{},events:[]};}
function getScope(state:ManagementState,key:string):Scope {return state.scopes[key]||(state.scopes[key]=emptyScope());}
function automation(s:Scope){return {automaticIds:s.automaticIds,lastRunAt:s.lastRunAt,nextReviewAt:s.nextReviewAt,warnings:s.warnings};}
function valueForPatch(state:ManagementState,patch:Patch,scope:string):unknown {
 const s=getScope(state,scope);
 if(patch.kind==='override')return s.overrides[patch.key]||null;
 if(patch.kind==='order')return s.order;
 if(patch.kind==='automation')return automation(s);
 if(patch.kind==='region')return state.regions[patch.key]||null;
 return {candidate:state.manualCandidates[patch.key]||null,override:s.overrides[patch.key]||null};
}
function applyPatch(state:ManagementState,patch:Patch,scope:string,value:unknown) {
 const s=getScope(state,scope);
 if(patch.kind==='override'){if(value)s.overrides[patch.key]=copy(value as Scope['overrides'][string]);else delete s.overrides[patch.key];}
 else if(patch.kind==='order')s.order=copy(value as string[]);
 else if(patch.kind==='automation')Object.assign(s,copy(value));
 else if(patch.kind==='region'){if(value)state.regions[patch.key]=copy(value as Region);else delete state.regions[patch.key];}
 else {const v=value as {candidate:ManagedCandidate|null;override:Scope['overrides'][string]|null};if(v.candidate)state.manualCandidates[patch.key]=copy(v.candidate);else delete state.manualCandidates[patch.key];if(v.override)s.overrides[patch.key]=copy(v.override);else delete s.overrides[patch.key];}
}
function mergedCatalog(state:ManagementState,catalog:ManagedCandidate[]) {
 const byId=new Map(catalog.map(c=>[c.id,c]));
 for(const c of Object.values(state.retainedCandidates||{}))if(!byId.has(c.id))byId.set(c.id,{...c,identityVerified:false,operation:'unknown',conflicts:[...c.conflicts,'Son keşif kaydında bulunamadı; kayıt korundu, faaliyet ve kimlik yeniden doğrulanmalı.']});
 for(const c of Object.values(state.manualCandidates))byId.set(c.id,c);
 return Array.from(byId.values());
}
export function managementView(state:ManagementState,catalog:ManagedCandidate[],now=new Date().toISOString()):ManagementView {
 const candidates=mergedCatalog(state,catalog);
 const view:ManagementView={availableCandidates:candidates.map(c=>({id:c.id,name:c.name,regionId:c.regionId})).sort((a,b)=>a.name.localeCompare(b.name,'tr')),revision:state.revision,regions:Object.values(state.regions),scopes:Object.values(state.regions).flatMap(r=>r.categories.map(c=>evaluateScope(candidates,r,c.id,state.scopes[scopeKey(r.id,c.id)]||emptyScope(),now))),events:state.events,undoneEventIds:state.events.filter(e=>e.undoOf).map(e=>e.undoOf!),productionPublicationEnabled:false,workerMode:'local',policyVersion:POLICY_VERSION};
 return {...view,cards:buildVenueCards(view.scopes,candidates)};
}
export function applyManagementAction(original:ManagementState,catalog:ManagedCandidate[],action:ManagementAction,actor:'admin'|'engine',now=new Date().toISOString(),warnings:string[]=[]):ManagementState {
 if(!Number.isInteger(action.revision)||action.revision!==original.revision)throw new ManagementError('Veri değişti; son durumu yenileyip tekrar deneyin.',409);
 if(typeof action.reason!=='string'||action.reason.trim().length<3||action.reason.length>1000)throw new ManagementError('3–1000 karakterlik gerekçe gerekli.');
 const state=copy(original),all=mergedCatalog(state,catalog);state.retainedCandidates ||= {};
 let scope='system',patch:Patch|null=null,targetId:string|undefined,undoOf:string|undefined;
 if('regionId'in action){if(typeof action.regionId!=='string'||!/^[-a-z0-9]{1,60}$/.test(action.regionId))throw new ManagementError('Bölge kimliği geçersiz.');const region=state.regions[action.regionId];if(!region)throw new ManagementError('Bölge bulunamadı.');
  if('categoryId'in action){if(!region.categories.some(c=>c.id===action.categoryId))throw new ManagementError('Kategori bölgede etkin değil.');scope=scopeKey(action.regionId,action.categoryId);}
 }
 if(action.type==='create-region'){
  if(typeof action.id!=='string'||!/^[-a-z0-9]{1,60}$/.test(action.id)||state.regions[action.id]||typeof action.name!=='string'||!action.name.trim()||action.name.length>100)throw new ManagementError('Bölge kimliği/adı geçersiz veya zaten var.');
  patch={kind:'region',key:action.id,before:null,after:{id:action.id,name:action.name.trim(),categories:copy(DEFAULT_CATEGORIES)}};
 }else if(action.type==='categories'){
  validateCategories(action.categories);patch={kind:'region',key:action.regionId,before:copy(state.regions[action.regionId]),after:{...state.regions[action.regionId],categories:copy(action.categories)}};
 }else if(action.type==='undo'){
  const event=state.events.find(e=>e.id===action.eventId);
  if(!event?.patch||state.events.some(e=>e.undoOf===event.id))throw new ManagementError('Karar bulunamadı veya zaten geri alındı.',409);
  scope=event.scope;targetId=event.targetId;undoOf=event.id;
  if(JSON.stringify(valueForPatch(state,event.patch,scope))!==JSON.stringify(event.patch.after))throw new ManagementError('Sonraki çelişen değişiklik korunuyor; önce o değişikliği geri alın.',409);
  if(event.patch.kind==='region'&&event.patch.before===null&&(Object.entries(state.scopes).some(([key,s])=>key.startsWith(event.patch!.key+'/')&&(Object.keys(s.overrides).length>0||s.automaticIds.length>0||s.order.length>0||Boolean(s.lastRunAt)))||Object.values(state.manualCandidates).some(c=>c.regionId===event.patch!.key)))throw new ManagementError('Bölgeye bağlı kararlar var; bölge silinemez.',409);
  patch={...event.patch,before:copy(event.patch.after),after:copy(event.patch.before)};
 }else{
  const s=getScope(state,scope),[regionId,categoryId]=scope.split('/');
  if(action.type==='run'){
   patch={kind:'automation',key:scope,before:automation(s),after:{automaticIds:eligibleOrder(all.filter(c=>c.regionId===regionId&&c.categoryIds.includes(categoryId)),categoryId,now),lastRunAt:now,nextReviewAt:new Date(Date.parse(now)+7*86400000).toISOString(),warnings}};
  }else if(action.type==='order'){
   if(!Array.isArray(action.ids)||action.ids.length>100||new Set(action.ids).size!==action.ids.length||action.ids.some(id=>!all.some(c=>c.id===id&&c.regionId===regionId)))throw new ManagementError('Sıra geçersiz veya başka bölgeden aday içeriyor.');
   patch={kind:'order',key:scope,before:copy(s.order),after:action.ids};
  }else if(action.type==='new-candidate'){
   if(typeof action.name!=='string'||!action.name.trim()||action.name.length>150||typeof action.address!=='string'||!action.address.trim()||action.address.length>300)throw new ManagementError('İşletme adı ve adresi gerekli.');
   const existing=all.find(c=>c.regionId===regionId&&c.name.trim().toLocaleLowerCase('tr')===action.name.trim().toLocaleLowerCase('tr')&&c.address?.trim().toLocaleLowerCase('tr')===action.address.trim().toLocaleLowerCase('tr'));
   if(existing)throw new ManagementError('Bu ad/adres zaten kayıtlı. Mevcut adayı seçin.');
   targetId='manual-'+randomUUID();patch={kind:'candidate',key:targetId,before:{candidate:null,override:null},after:{candidate:{id:targetId,name:action.name.trim(),regionId,categoryIds:[categoryId],address:action.address.trim(),coordinates:null,identityVerified:false,operation:'unknown',evidence:[],conflicts:[],claimNotes:[],reportId:null},override:{mode:'add',reason:action.reason,at:now}}};
  }else{
   targetId=action.candidateId;
   if(!all.some(c=>c.id===targetId&&c.regionId===regionId))throw new ManagementError('Aday bu bölgede bulunamadı.');
   if(!targetId.startsWith('manual-'))state.retainedCandidates[targetId]=copy(all.find(c=>c.id===targetId)!);
   patch={kind:'override',key:targetId,before:copy(s.overrides[targetId]||null),after:action.type==='reset'?null:{mode:action.type,reason:action.reason,at:now}};
  }
 }
 if(patch)applyPatch(state,patch,scope,patch.after);
 // Persist the local publication projection after every decision; no production adapter exists here.
 const views=managementView(state,catalog,now);
 const affectedViews=views.scopes.filter(view=>view.key===scope||(patch?.kind==='region'&&view.region.id===patch.key));
 const affectedBefore=Object.entries(original.scopes).filter(([key])=>key===scope||(patch?.kind==='region'&&key.startsWith(patch.key+'/'))).flatMap(([,value])=>value.publishedIds);
 for(const view of affectedViews){
  getScope(state,view.key).publishedIds=view.selected.map(c=>c.id);
  for(const selected of view.selected){const candidate=all.find(c=>c.id===selected.id);if(candidate&&!candidate.id.startsWith('manual-'))state.retainedCandidates[candidate.id]=copy(candidate);}
 }
 if(patch?.kind==='region')for(const [key,value] of Object.entries(state.scopes))if(key.startsWith(patch.key+'/')&&!affectedViews.some(v=>v.key===key))value.publishedIds=[];
 const recordedAssessments=affectedViews.flatMap(view=>[...view.selected,...view.research,...view.excluded].map(candidate=>({candidate,scope:view.key,selected:view.selected.some(c=>c.id===candidate.id)})));
 state.revision++;
 state.events.push({policyVersion:POLICY_VERSION,decisions:recordedAssessments.map(({candidate:c,scope:decisionScope,selected})=>({scope:decisionScope,id:c.id,name:c.name,status:selected?'selected':c.manual==='remove'?'manual-excluded':'extra-research',reasons:[...c.reasons,...c.warnings],sources:c.evidence.map(e=>({url:e.url,family:e.family,publishedAt:e.publishedAt,experienceAt:e.experienceAt}))})),id:randomUUID(),at:now,actor,action:action.type,scope,reason:action.reason.trim(),targetId,patch,selectedBefore:affectedBefore,selectedAfter:affectedViews.flatMap(view=>view.selected.map(c=>c.id)),sourceReportIds:Array.from(new Set(all.filter(c=>affectedViews.some(view=>c.regionId===view.region.id&&(c.categoryIds.includes(view.category.id)||Boolean(state.scopes[view.key]?.overrides[c.id])))).map(c=>c.reportId).filter((id):id is string=>Boolean(id)))),...(undoOf?{undoOf}:{})});
 return state;
}
