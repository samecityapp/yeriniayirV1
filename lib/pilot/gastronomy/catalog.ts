import {readProductResearch} from '../quality/productResearch';
import {applyResearchPortfolio} from './portfolioCatalog';
import { readAdditionalDiscovery } from './discovery';
import { readQualityReport } from '../quality/store';
import { readLatestResearch } from '../research/store';
import type { ManagedCandidate,Evidence } from './types';
export async function loadCatalog():Promise<ManagedCandidate[]> {
 const [quality,discovery,additional]=await Promise.all([readQualityReport(),readLatestResearch(),readAdditionalDiscovery()]);
 const dossiers=new Map(quality?.dossiers.map(d=>[d.id,d])||[]);
 const base:ManagedCandidate[]=(discovery?.candidates||[]).map(candidate=>{
  const dossier=dossiers.get(candidate.id),evidence:Evidence[]=[];
  if(quality&&dossier)for(const claim of dossier.claims.filter(c=>c.scope==='branch'&&['specialty','drink','identity','operation'].includes(c.field)&&c.basis!=='inference'))for(const id of claim.sourceIds){
   const s=quality.sources.find(s=>s.id===id);if(!s||s.access!=='read'||s.rights==='link-only')continue;
   // A product claim supports quality; an identity claim only supports an operator branch listing.
   if(s.kind==='operator'&&!['identity','operation'].includes(claim.field))continue;
   if(s.kind!=='operator'&&(!s.eligibleIndependent||s.kind!=='editorial'||claim.field!=='drink'))continue;
   evidence.push({id:claim.id+':'+id,family:s.family,url:s.url,kind:s.kind==='operator'?'operator':'independent',branchId:candidate.id,productCategory:'coffee',productName:claim.field==='drink'?claim.text:null,publishedAt:s.publishedAt,experienceAt:s.experienceDate,checkedAt:s.accessedAt,usable:true});
  }
  const identityConflict=(text:string)=>/adres|kapı|kimlik|koordinat|konum|aynı şube|şube sayılmaz|birleştir|Yeldeğirmeni/iu.test(text);
  return {id:candidate.id,name:dossier?.name||candidate.name,regionId:'moda-kadikoy',categoryIds:candidate.category==='coffee-signal'||dossier?['coffee']:[],address:candidate.address,coordinates:candidate.coordinates,identityVerified:candidate.branchStatus==='address-corroborated',operation:candidate.operation==='operator-listed'?'listed':candidate.operation==='closure-signal'?'closure-signal':'unknown',evidence,conflicts:[...candidate.conflicts,...(dossier?.conflicts||[]).filter(identityConflict)],advisories:(dossier?.conflicts||[]).filter(text=>!identityConflict(text)),claimNotes:dossier?.claims.map(c=>c.text)||[],reportId:quality?.discoveryRunId||null};
 });
 const merged=new Map(base.map(c=>[c.id,c]));
 for(const extra of additional){const existing=merged.get(extra.id);if(existing){existing.categoryIds=Array.from(new Set([...existing.categoryIds,...extra.categoryIds]));}else merged.set(extra.id,extra);}
 const catalog=await applyResearchPortfolio(Array.from(merged.values()),quality,discovery);
 // Read-only product/category assessment never rewrites venue selection or manual decisions.
 return catalog.map(c=>({...c,productResearch:readProductResearch(c.id)}));
}
