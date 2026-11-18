import type { ResearchRun } from '../research/types';
import type { QualitySource, QualityTarget, QualityReport, QualityDossier } from './types';
export interface QualityLedger { schemaVersion:number; researchedAt:string; method:string; sources:QualitySource[]; targets:QualityTarget[]; limitations:string[] }
export function validateLedger(ledger: QualityLedger): void {
  if (ledger.schemaVersion !== 1 || ledger.method !== 'development-agent-web-review') throw new Error('Unknown evidence provenance');
  if (new Set(ledger.sources.map(s=>s.id)).size !== ledger.sources.length || new Set(ledger.targets.map(t=>t.id)).size !== ledger.targets.length) throw new Error('Duplicate source or target identity');
  const sources=new Map(ledger.sources.map(s=>[s.id,s]));
  for (const source of ledger.sources) {
    const url=new URL(source.url);
    if(url.protocol!=='https:' || url.username || url.password) throw new Error('Unsafe source URL');
    if(source.eligibleIndependent && source.kind!=='editorial') throw new Error('Non-editorial source cannot count as independent quality evidence');
    if(!Number.isFinite(Date.parse(source.accessedAt))) throw new Error('Missing access date');
  }
  for(const target of ledger.targets) {
    if(!target.searchQueries.length || !target.gaps.length) throw new Error('Research audit and gaps required');
    for(const claim of target.claims) {
      if(!claim.sourceIds.length || claim.sourceIds.some(id=>!sources.has(id))) throw new Error('Unsupported claim');
      if(claim.sourceIds.some(id=>sources.get(id)!.access!=='read' || sources.get(id)!.rights==='link-only')) throw new Error('Blocked or link-only source cannot support a claim');
      if(!claim.scope || !claim.basis) throw new Error('Claim scope and basis required');
    }
  }
}
export function independentFamilies(sources: QualitySource[]): string[] {
  return Array.from(new Set(sources.filter(s=>s.eligibleIndependent && s.access==='read' && s.rights!=='link-only' && s.kind==='editorial').map(s=>s.family)));
}
export function sourceAge(source: QualitySource, referenceDate: string): 'recent-publication'|'historical'|'undated'|'future-invalid' {
  if(!source.publishedAt) return 'undated';
  const elapsed=Date.parse(referenceDate)-Date.parse(source.publishedAt);
  if(!Number.isFinite(elapsed))return 'undated';
  if(elapsed<0)return 'future-invalid';
  return elapsed<=365*86400000?'recent-publication':'historical';
}
export function buildQualityReport(discovery: ResearchRun, ledger: QualityLedger, generatedAt=new Date().toISOString()): QualityReport {
  validateLedger(ledger);
  const byId=new Map(discovery.candidates.map(c=>[c.id,c]));
  const sourceById=new Map(ledger.sources.map(s=>[s.id,s]));
  const dossiers:QualityDossier[]=ledger.targets.map(target=>{
    const candidate=byId.get(target.id);
    if(!candidate) throw new Error(`Research target absent from discovery: ${target.id}`);
    const linked=Array.from(new Set(target.claims.flatMap(c=>c.sourceIds))).map(id=>sourceById.get(id)!);
    const independent=independentFamilies(linked);
    const productClaims=target.claims.filter(c=>['drink','specialty','also'].includes(c.field));
    const branchSources=productClaims.filter(c=>c.scope==='branch').flatMap(c=>c.sourceIds).map(id=>sourceById.get(id)!);
    // Discovery closure tags and third-party listing absences are never sufficient for confirmed closure.
    const state: QualityDossier['state']=independent.length && productClaims.length ? 'promising' : 'needs-research';
    return {...target,candidate,state,independentFamilies:independent,recentPublicationFamilies:independentFamilies(linked.filter(s=>sourceAge(s,ledger.researchedAt)==='recent-publication')),branchProductFamilies:independentFamilies(branchSources),
      gaps:[...target.gaps,'Bugünkü faaliyet ve ürün kalitesi bağımsız güncel deneyimle kesinleşmedi.']};
  }).sort((a,b)=>a.name.localeCompare(b.name,'tr'));
  const deepIds=new Set(dossiers.map(d=>d.id));
  const coffee=discovery.candidates.filter(c=>c.category==='coffee-signal');
  const review=discovery.candidates.filter(c=>c.category==='coffee-signal'||deepIds.has(c.id));
  const triage=review.map(c=>({id:c.id,name:c.name,deep:deepIds.has(c.id),address:c.address,operation:c.operation,
    specialty:deepIds.has(c.id)?'Kaynak dosyası incelendi':'Ad/etiket sinyali; nitelikli kahve uzmanlığı henüz doğrulanmadı',
    gaps:[...(!c.address?['Harita adresi eksik.']:[]),...(c.branchStatus!=='address-corroborated'?['Fiziksel şube için ikinci adres teyidi eksik.']:[]),'Güncel faaliyet kesinleşmedi.',...(!deepIds.has(c.id)?['Derin ürün araştırması sırada; eleme yapılmadı.']:[])]}));
  return {schemaVersion:1,researchedAt:ledger.researchedAt,generatedAt,discoveryRunId:discovery.id,discoveryCompletedAt:discovery.completedAt,staleDiscovery:Boolean(discovery.lastAttempt),sources:ledger.sources,dossiers,triage,
    stats:{coffeeSignals:coffee.length,additionalCandidates:review.length-coffee.length,triaged:triage.length,deep:dossiers.length,comparison:dossiers.filter(d=>d.compare).length,independentFamilies:independentFamilies(ledger.sources).length,sourceCount:ledger.sources.length,confirmedClosed:0},limitations:ledger.limitations};
}
