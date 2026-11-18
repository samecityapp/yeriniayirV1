export interface ResearchEvidence {
  url: string;
  publisher: string;
  kind: 'open-map' | 'editorial' | 'first-party';
  scope: 'branch' | 'brand';
  retrievedAt: string;
  publishedAt: string | null;
  updatedAt: string | null;
  author: string | null;
  facts: string[];
  usage: string;
}
export interface ResearchCandidate {
  id: string;
  name: string;
  aliases: string[];
  osmIds: string[];
  coordinates: { lat: number; lng: number } | null;
  address: string | null;
  street: string | null;
  houseNumber: string | null;
  website: string | null;
  category: 'coffee-signal' | 'cafe-needs-review';
  branchStatus: 'map-location' | 'address-corroborated' | 'unresolved';
  operation: 'unknown' | 'recent-map-observation' | 'operator-listed' | 'closure-signal' | 'conflict';
  mapCheckedAt: string | null;
  evidence: ResearchEvidence[];
  missing: string[];
  conflicts: string[];
}
export interface ResearchSourceResult {
  id: string;
  url: string;
  status: 'ok' | 'blocked' | 'failed';
  count: number;
  retrievedAt: string;
  message: string;
}
export interface ResearchRun {
  schemaVersion: 1;
  lastAttempt?: { id: string; completedAt: string; discoveredCount: number; sources: ResearchSourceResult[] };
  id: string;
  startedAt: string;
  completedAt: string;
  status: 'complete' | 'partial' | 'failed';
  area: { label: string; bbox: [number, number, number, number]; note: string };
  sources: ResearchSourceResult[];
  candidates: ResearchCandidate[];
  duplicatesMerged: number;
  ignoredUnnamed: number;
  mapSnapshotAt: string | null;
  coverage: { query: string; candidateIds: string[] }[];
  limitations: string[];
}
