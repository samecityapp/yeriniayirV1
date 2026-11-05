import reviewedLedger from './product-evidence.json';
import {evaluateProductSubject,validateProductLedger} from './products';
import type {ProductLedger} from './products';
const ledger=reviewedLedger as unknown as ProductLedger;
validateProductLedger(ledger);
export function readProductResearch(venueId:string,now=new Date().toISOString()){
 const subject=ledger.subjects.find(s=>s.venueId===venueId);
 return subject?evaluateProductSubject(subject,ledger.sources,now):undefined;
}
export function readAllProductResearch(now=new Date().toISOString()){
 return {schemaVersion:1 as const,dataKind:'real-research' as const,method:ledger.method,researchedAt:ledger.researchedAt,assessedAt:now,
  venueCount:ledger.subjects.length,results:ledger.subjects.map(s=>evaluateProductSubject(s,ledger.sources,now)),limitations:ledger.limitations};
}
