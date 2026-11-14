import type { ResearchCandidate } from '../research/types';
export interface QualitySource {
  id: string;
  url: string;
  publisher: string;
  author: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  accessedAt: string;
  experienceDate: string | null;
  family: string;
  kind: 'editorial' | 'operator' | 'interview' | 'community' | 'map-derived';
  access: 'read' | 'blocked' | 'unavailable';
  eligibleIndependent: boolean;
  rights: 'factual-summary-only' | 'link-only';
  note: string;
}
export type ClaimField = 'specialty' | 'drink' | 'why' | 'also' | 'fit' | 'before' | 'identity' | 'operation';
export interface QualityClaim {
  id: string;
  field: ClaimField;
  text: string;
  sourceIds: string[];
  scope: 'branch' | 'brand' | 'unresolved';
  basis: 'reported' | 'menu' | 'inference';
  caveat: string;
}
export interface QualityTarget {
  id: string;
  name: string;
  reason: string;
  compare: boolean;
  searchQueries: string[];
  claims: QualityClaim[];
  gaps: string[];
  conflicts: string[];
}
export interface QualityDossier extends QualityTarget {
  candidate: ResearchCandidate;
  state: 'promising' | 'needs-research' | 'confirmed-closed';
  independentFamilies: string[];
  recentPublicationFamilies: string[];
  branchProductFamilies: string[];
}
export interface QualityReport {
  schemaVersion: 1;
  researchedAt: string;
  generatedAt: string;
  discoveryRunId: string;
  discoveryCompletedAt: string;
  staleDiscovery: boolean;
  sources: QualitySource[];
  dossiers: QualityDossier[];
  triage: {id:string;name:string;deep:boolean;address:string|null;operation:string;specialty:string;gaps:string[]}[];
  stats: {coffeeSignals:number;additionalCandidates:number;triaged:number;deep:number;comparison:number;independentFamilies:number;sourceCount:number;confirmedClosed:number};
  limitations: string[];
}
