import modaSnapshotJson from './regions/istanbul-kadikoy-moda.json';
import carsiSnapshotJson from './regions/istanbul-kadikoy-carsi.json';
import yeldegirmeniSnapshotJson from './regions/istanbul-kadikoy-yeldegirmeni.json';
import caddebostanSnapshotJson from './regions/istanbul-kadikoy-caddebostan.json';
import suadiyeSnapshotJson from './regions/istanbul-kadikoy-suadiye.json';
import kusadasiSnapshotJson from './regions/aydin-kusadasi.json';
import gaziantepSnapshotJson from './regions/gaziantep-merkez.json';
import antalyaKaleiciSnapshotJson from './regions/antalya-kaleici.json';
import antalyaLaraSnapshotJson from './regions/antalya-lara.json';
import antalyaKonyaaltiSnapshotJson from './regions/antalya-konyaalti.json';
import muglaUlaAkyakaSnapshotJson from './regions/mugla-ula-akyaka.json';
import type { FoodLocation } from '../food/types';
import type { V3VerifiedRegionSnapshot } from './types';

const MODA_SNAPSHOT = modaSnapshotJson as V3VerifiedRegionSnapshot;
const CARSI_SNAPSHOT = carsiSnapshotJson as V3VerifiedRegionSnapshot;
const YELDEGIRMENI_SNAPSHOT = yeldegirmeniSnapshotJson as V3VerifiedRegionSnapshot;
const CADDEBOSTAN_SNAPSHOT = caddebostanSnapshotJson as V3VerifiedRegionSnapshot;
const SUADIYE_SNAPSHOT = suadiyeSnapshotJson as V3VerifiedRegionSnapshot;
const KUSADASI_SNAPSHOT = kusadasiSnapshotJson as V3VerifiedRegionSnapshot;
const GAZIANTEP_SNAPSHOT = gaziantepSnapshotJson as V3VerifiedRegionSnapshot;
const ANTALYA_KALEICI_SNAPSHOT = antalyaKaleiciSnapshotJson as V3VerifiedRegionSnapshot;
const ANTALYA_LARA_SNAPSHOT = antalyaLaraSnapshotJson as V3VerifiedRegionSnapshot;
const ANTALYA_KONYAALTI_SNAPSHOT = antalyaKonyaaltiSnapshotJson as V3VerifiedRegionSnapshot;
const AKYAKA_SNAPSHOT = muglaUlaAkyakaSnapshotJson as V3VerifiedRegionSnapshot;

export const V3_ALL_PUBLISHED_SNAPSHOTS: readonly V3VerifiedRegionSnapshot[] = [
  MODA_SNAPSHOT,
  CARSI_SNAPSHOT,
  YELDEGIRMENI_SNAPSHOT,
  CADDEBOSTAN_SNAPSHOT,
  SUADIYE_SNAPSHOT,
  KUSADASI_SNAPSHOT,
  GAZIANTEP_SNAPSHOT,
  ANTALYA_KALEICI_SNAPSHOT,
  ANTALYA_LARA_SNAPSHOT,
  ANTALYA_KONYAALTI_SNAPSHOT,
  AKYAKA_SNAPSHOT,
];

export const V3_PUBLISHED_SNAPSHOTS: Record<string, V3VerifiedRegionSnapshot> = {
  moda: MODA_SNAPSHOT,
  'moda-kadikoy': MODA_SNAPSHOT,
  kadikoy: CARSI_SNAPSHOT,
  'kadikoy-merkez': CARSI_SNAPSHOT,
  'kadikoy-carsi': CARSI_SNAPSHOT,
  'carsi-osmanaga-kadikoy': CARSI_SNAPSHOT,
  yeldegirmeni: YELDEGIRMENI_SNAPSHOT,
  'yeldegirmeni-kadikoy': YELDEGIRMENI_SNAPSHOT,
  caddebostan: CADDEBOSTAN_SNAPSHOT,
  'caddebostan-kadikoy': CADDEBOSTAN_SNAPSHOT,
  suadiye: SUADIYE_SNAPSHOT,
  'suadiye-kadikoy': SUADIYE_SNAPSHOT,
  kusadasi: KUSADASI_SNAPSHOT,
  'kusadasi-aydin': KUSADASI_SNAPSHOT,
  'merkez-kusadasi-aydin': KUSADASI_SNAPSHOT,
  guzelcamli: KUSADASI_SNAPSHOT,
  davutlar: KUSADASI_SNAPSHOT,
  gaziantep: GAZIANTEP_SNAPSHOT,
  'gaziantep-merkez': GAZIANTEP_SNAPSHOT,
  sahinbey: GAZIANTEP_SNAPSHOT,
  sehitkamil: GAZIANTEP_SNAPSHOT,
  'kalealti-sahinbey-gaziantep': GAZIANTEP_SNAPSHOT,
  antalya: ANTALYA_KALEICI_SNAPSHOT,
  'antalya-merkez': ANTALYA_KALEICI_SNAPSHOT,
  'antalya-kaleici': ANTALYA_KALEICI_SNAPSHOT,
  kaleici: ANTALYA_KALEICI_SNAPSHOT,
  muratpasa: ANTALYA_KALEICI_SNAPSHOT,
  aksu: ANTALYA_KALEICI_SNAPSHOT,
  'kaleici-muratpasa-antalya': ANTALYA_KALEICI_SNAPSHOT,
  'antalya-lara': ANTALYA_LARA_SNAPSHOT,
  lara: ANTALYA_LARA_SNAPSHOT,
  sirinyali: ANTALYA_LARA_SNAPSHOT,
  'antalya-sirinyali': ANTALYA_LARA_SNAPSHOT,
  guzeloba: ANTALYA_LARA_SNAPSHOT,
  'lara-muratpasa-antalya': ANTALYA_LARA_SNAPSHOT,
  'antalya-konyaalti': ANTALYA_KONYAALTI_SNAPSHOT,
  konyaalti: ANTALYA_KONYAALTI_SNAPSHOT,
  cakirlar: ANTALYA_KONYAALTI_SNAPSHOT,
  gursu: ANTALYA_KONYAALTI_SNAPSHOT,
  'konyaalti-antalya': ANTALYA_KONYAALTI_SNAPSHOT,
  akyaka: AKYAKA_SNAPSHOT,
  'akyaka-ula-mugla': AKYAKA_SNAPSHOT,
  'mugla-ula-akyaka': AKYAKA_SNAPSHOT,
  gokova: AKYAKA_SNAPSHOT,
  akcapinar: AKYAKA_SNAPSHOT,
};

function toPublishedLocation(snap: V3VerifiedRegionSnapshot): FoodLocation {
  return {
    id: snap.region.id,
    level: 'semt',
    city: snap.region.city,
    district: snap.region.district,
    neighborhood: snap.region.neighborhood,
    name: snap.region.neighborhood,
    slug: snap.region.slug,
    path: snap.region.path,
    displayName: snap.region.displayName,
    locative: snap.region.locative,
    status: 'published',
    aliases: snap.region.aliases,
    center: snap.region.center,
    scopeNote: snap.region.scopeNote,
    characterSubtitle: snap.region.characterSubtitle,
  };
}

/**
 * Sıkı "İl > İlçe > Semt" lokalizasyon ağacı.
 * İlçeler veya mahalleler asla tek bir birleşik bölgede karıştırılmaz.
 * Yalnızca V3 canlı Google Places pipeline'ından geçmiş bölgeler 'published' olur.
 */
export const V3_LOCATIONS: FoodLocation[] = [
  // YAYINDA (V3 %100 Canlı API Doğrulamalı — Kadıköy 5 Semt)
  ...V3_ALL_PUBLISHED_SNAPSHOTS.map(toPublishedLocation),

  // SIRADAKİ DOĞRULAMA KUYRUĞU (İl > İlçe > Semt ayrıştırılmış)
  {
    id: 'kosuyolu-kadikoy',
    level: 'semt',
    city: 'İstanbul',
    district: 'Kadıköy',
    neighborhood: 'Koşuyolu',
    name: 'Koşuyolu',
    slug: 'kosuyolu',
    path: ['istanbul', 'kadikoy', 'kosuyolu'],
    displayName: 'Koşuyolu, Kadıköy, İstanbul',
    locative: "Koşuyolu'nda",
    status: 'coming_soon',
    aliases: ['Koşuyolu', 'Kosuyolu', 'Kadıköy'],
    scopeNote: 'İstanbul · Kadıköy · Koşuyolu (V3 Doğrulama Sırasında)',
  },
  {
    id: 'karakoy-beyoglu',
    level: 'semt',
    city: 'İstanbul',
    district: 'Beyoğlu',
    neighborhood: 'Karaköy',
    name: 'Karaköy',
    slug: 'karakoy',
    path: ['istanbul', 'beyoglu', 'karakoy'],
    displayName: 'Karaköy, Beyoğlu, İstanbul',
    locative: "Karaköy'de",
    status: 'coming_soon',
    aliases: ['Karaköy', 'Karakoy', 'Beyoğlu'],
    scopeNote: 'İstanbul · Beyoğlu · Karaköy (V3 Doğrulama Sırasında)',
  },
  {
    id: 'galata-beyoglu',
    level: 'semt',
    city: 'İstanbul',
    district: 'Beyoğlu',
    neighborhood: 'Galata',
    name: 'Galata',
    slug: 'galata',
    path: ['istanbul', 'beyoglu', 'galata'],
    displayName: 'Galata, Beyoğlu, İstanbul',
    locative: "Galata'da",
    status: 'coming_soon',
    aliases: ['Galata', 'Beyoğlu'],
    scopeNote: 'İstanbul · Beyoğlu · Galata (V3 Doğrulama Sırasında)',
  },
  {
    id: 'cihangir-beyoglu',
    level: 'semt',
    city: 'İstanbul',
    district: 'Beyoğlu',
    neighborhood: 'Cihangir',
    name: 'Cihangir',
    slug: 'cihangir',
    path: ['istanbul', 'beyoglu', 'cihangir'],
    displayName: 'Cihangir, Beyoğlu, İstanbul',
    locative: "Cihangir'de",
    status: 'coming_soon',
    aliases: ['Cihangir', 'Beyoğlu'],
    scopeNote: 'İstanbul · Beyoğlu · Cihangir (V3 Doğrulama Sırasında)',
  },
  {
    id: 'asmalimescit-beyoglu',
    level: 'semt',
    city: 'İstanbul',
    district: 'Beyoğlu',
    neighborhood: 'Asmalımescit',
    name: 'Asmalımescit',
    slug: 'asmalimescit',
    path: ['istanbul', 'beyoglu', 'asmalimescit'],
    displayName: 'Asmalımescit, Beyoğlu, İstanbul',
    locative: "Asmalımescit'te",
    status: 'coming_soon',
    aliases: ['Asmalımescit', 'Asmalimescit', 'Beyoğlu'],
    scopeNote: 'İstanbul · Beyoğlu · Asmalımescit (V3 Doğrulama Sırasında)',
  },
  {
    id: 'kuzguncuk-uskudar',
    level: 'semt',
    city: 'İstanbul',
    district: 'Üsküdar',
    neighborhood: 'Kuzguncuk',
    name: 'Kuzguncuk',
    slug: 'kuzguncuk',
    path: ['istanbul', 'uskudar', 'kuzguncuk'],
    displayName: 'Kuzguncuk, Üsküdar, İstanbul',
    locative: "Kuzguncuk'ta",
    status: 'coming_soon',
    aliases: ['Kuzguncuk', 'Üsküdar'],
    scopeNote: 'İstanbul · Üsküdar · Kuzguncuk (V3 Doğrulama Sırasında)',
  },
  {
    id: 'cengelkoy-uskudar',
    level: 'semt',
    city: 'İstanbul',
    district: 'Üsküdar',
    neighborhood: 'Çengelköy',
    name: 'Çengelköy',
    slug: 'cengelkoy',
    path: ['istanbul', 'uskudar', 'cengelkoy'],
    displayName: 'Çengelköy, Üsküdar, İstanbul',
    locative: "Çengelköy'de",
    status: 'coming_soon',
    aliases: ['Çengelköy', 'Cengelkoy', 'Üsküdar'],
    scopeNote: 'İstanbul · Üsküdar · Çengelköy (V3 Doğrulama Sırasında)',
  },
  {
    id: 'bebek-besiktas',
    level: 'semt',
    city: 'İstanbul',
    district: 'Beşiktaş',
    neighborhood: 'Bebek',
    name: 'Bebek',
    slug: 'bebek',
    path: ['istanbul', 'besiktas', 'bebek'],
    displayName: 'Bebek, Beşiktaş, İstanbul',
    locative: "Bebek'te",
    status: 'coming_soon',
    aliases: ['Bebek', 'Beşiktaş'],
    scopeNote: 'İstanbul · Beşiktaş · Bebek (V3 Doğrulama Sırasında)',
  },
  {
    id: 'nisantasi-sisli',
    level: 'semt',
    city: 'İstanbul',
    district: 'Şişli',
    neighborhood: 'Nişantaşı',
    name: 'Nişantaşı',
    slug: 'nisantasi',
    path: ['istanbul', 'sisli', 'nisantasi'],
    displayName: 'Nişantaşı, Şişli, İstanbul',
    locative: "Nişantaşı'nda",
    status: 'coming_soon',
    aliases: ['Nişantaşı', 'Nisantasi', 'Şişli', 'Teşvikiye'],
    scopeNote: 'İstanbul · Şişli · Nişantaşı (V3 Doğrulama Sırasında)',
  },
  {
    id: 'yalikavak-bodrum-mugla',
    level: 'semt',
    city: 'Muğla',
    district: 'Bodrum',
    neighborhood: 'Yalıkavak',
    name: 'Yalıkavak',
    slug: 'yalikavak',
    path: ['mugla', 'bodrum', 'yalikavak'],
    displayName: 'Yalıkavak, Bodrum, Muğla',
    locative: "Yalıkavak'ta",
    status: 'coming_soon',
    aliases: ['Yalıkavak', 'Yalikavak', 'Bodrum', 'Muğla'],
    scopeNote: 'Muğla · Bodrum · Yalıkavak (V3 Doğrulama Sırasında)',
  },
  {
    id: 'bitez-bodrum-mugla',
    level: 'semt',
    city: 'Muğla',
    district: 'Bodrum',
    neighborhood: 'Bitez',
    name: 'Bitez',
    slug: 'bitez',
    path: ['mugla', 'bodrum', 'bitez'],
    displayName: 'Bitez, Bodrum, Muğla',
    locative: "Bitez'de",
    status: 'coming_soon',
    aliases: ['Bitez', 'Bodrum', 'Muğla'],
    scopeNote: 'Muğla · Bodrum · Bitez (V3 Doğrulama Sırasında)',
  },
];

export function getPublishedV3Snapshot(regionSlugOrId: string): V3VerifiedRegionSnapshot | null {
  return V3_PUBLISHED_SNAPSHOTS[regionSlugOrId] || null;
}
