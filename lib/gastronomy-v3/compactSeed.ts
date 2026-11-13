import type { V3CandidateSeed, V3EvidenceKind } from './types';

export interface CompactSeedInput {
  id: string;
  placeId: string;
  cat: string;
  name?: string;
  brand?: string;
  area: string;
  signals: string[];
  flags?: {
    iconic?: boolean;
    heritage?: boolean;
    insider?: boolean;
    ritual?: boolean;
  };
  desc: string;
  order: [string, ...string[]];
  menu: string[];
  sec: Array<[name: string, note: string, proof: string]>;
  seat: string;
  crowd: string;
  dis: string;
  transit: string;
  sources: Array<[title: string, url: string, kind: V3EvidenceKind, note: string]>;
  pros: [string, ...string[]];
  cons: [string, ...string[]];
  unc: [string, ...string[]];
  verifiedAt?: string;
}

/**
 * Generates a full V3CandidateSeed with complete secondary items, suitability cards,
 * and evidence dossier metadata from a concise authoring payload.
 */
export function compactSeed(input: CompactSeedInput): V3CandidateSeed {
  const verifiedAt = input.verifiedAt || '2026-11-13';
  const f = input.flags || {};

  return {
    id: input.id,
    placeId: input.placeId,
    categoryId: input.cat,
    ...(input.name ? { displayNameOverride: input.name } : {}),
    ...(input.brand ? { expectedBrandWord: input.brand } : {}),
    ...(f.iconic ? { iconicSettingOrVibeProtected: true } : {}),
    ...(f.heritage ? { chefOrHeritageProtected: true } : {}),
    ...(f.insider ? { communityInsiderProtected: true } : {}),
    ...(f.ritual ? { localRitualProtected: true } : {}),
    neighborhoodLabelOverride: input.area,
    localSignals: input.signals,
    description: input.desc,
    whatToOrder: input.order,
    menuFrom: input.menu,
    alsoTry: [],
    secondaryItems: input.sec.map(([name, note, proof]) => ({ name, note, proof })),
    suitability: {
      seating: input.seat,
      crowdAndNoise: input.crowd,
      disadvantage: input.dis,
      transit: input.transit,
    },
    beforeYouGo: [],
    dossier: {
      verifiedAt,
      sources: input.sources.map(([title, url, kind, note]) => ({
        title,
        url,
        date: kind === 'operator' ? verifiedAt : '2026-10-20',
        kind,
        note,
      })),
      pros: input.pros,
      cons: input.cons,
      uncertainties: input.unc,
    },
  };
}

/** Negative audit control candidate rejected by policy gates and recorded in audit logs. */
export function negControl(
  id: string,
  placeId: string,
  cat: string,
  reasonNote: string,
  opts?: { brand?: string; degraded?: string }
): V3CandidateSeed {
  return {
    id,
    placeId,
    categoryId: cat,
    ...(opts?.brand ? { expectedBrandWord: opts.brand } : {}),
    ...(opts?.degraded ? { degradationFlag: true, degradationReason: opts.degraded } : {}),
    localSignals: [],
    description: 'Negatif denetim kontrolü.',
    whatToOrder: ['Kontrol'],
    menuFrom: [],
    alsoTry: [],
    secondaryItems: [{ name: 'Kontrol', note: 'Denetim kaydı.', proof: 'Google Places API' }],
    suitability: {
      seating: 'Al-götür ve masa düzeni denetim kontrolü',
      crowdAndNoise: 'Denetim kontrolü',
      disadvantage: reasonNote,
      transit: 'Antalya kontrol noktası',
    },
    beforeYouGo: [],
    dossier: {
      verifiedAt: '2026-11-13',
      sources: [
        {
          title: 'Google Places API Canlı Kayıt',
          url: 'https://maps.google.com/',
          date: '2026-11-13',
          kind: 'maps',
          note: reasonNote,
        },
      ],
      pros: ['Denetim kontrolü'],
      cons: [reasonNote],
      uncertainties: ['Sadece politika kapısı testi amaçlıdır.'],
    },
  };
}
