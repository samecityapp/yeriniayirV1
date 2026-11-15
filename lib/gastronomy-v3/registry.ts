import modaSnapshotJson from './regions/istanbul-kadikoy-moda.json';
import carsiSnapshotJson from './regions/istanbul-kadikoy-carsi.json';
import yeldegirmeniSnapshotJson from './regions/istanbul-kadikoy-yeldegirmeni.json';
import feneryoluSnapshotJson from './regions/istanbul-kadikoy-feneryolu.json';
import fenerbahceKalamisSnapshotJson from './regions/istanbul-kadikoy-fenerbahce-kalamis.json';
import caddebostanSnapshotJson from './regions/istanbul-kadikoy-caddebostan.json';
import suadiyeSnapshotJson from './regions/istanbul-kadikoy-suadiye.json';
import bostanciSnapshotJson from './regions/istanbul-kadikoy-bostanci.json';
import kosuyoluAcibademSnapshotJson from './regions/istanbul-kadikoy-kosuyolu-acibadem.json';
import uskudarMerkezSnapshotJson from './regions/istanbul-uskudar-merkez.json';
import kuzguncukSnapshotJson from './regions/istanbul-uskudar-kuzguncuk.json';
import cengelkoySnapshotJson from './regions/istanbul-uskudar-cengelkoy.json';
import karakoySnapshotJson from './regions/istanbul-beyoglu-karakoy.json';
import cihangirSnapshotJson from './regions/istanbul-beyoglu-cihangir.json';
import nisantasiSnapshotJson from './regions/istanbul-sisli-nisantasi.json';
import galataSnapshotJson from './regions/istanbul-beyoglu-galata.json';
import besiktasCarsiSnapshotJson from './regions/istanbul-besiktas-carsi.json';
import akaretlerSnapshotJson from './regions/istanbul-besiktas-akaretler.json';
import bebekSnapshotJson from './regions/istanbul-besiktas-bebek.json';
import etilerSnapshotJson from './regions/istanbul-besiktas-etiler.json';
import ortakoySnapshotJson from './regions/istanbul-besiktas-ortakoy.json';
import cukurcumaSnapshotJson from './regions/istanbul-beyoglu-cukurcuma.json';
import balatSnapshotJson from './regions/istanbul-fatih-balat.json';
import yenikoySnapshotJson from './regions/istanbul-sariyer-yenikoy.json';
import gokturkSnapshotJson from './regions/istanbul-eyupsultan-gokturk.json';
import asmalimescitSnapshotJson from './regions/istanbul-beyoglu-asmalimescit.json';
import taksimSnapshotJson from './regions/istanbul-beyoglu-taksim.json';
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
const FENERYOLU_SNAPSHOT = feneryoluSnapshotJson as V3VerifiedRegionSnapshot;
const FENERBAHCE_KALAMIS_SNAPSHOT = fenerbahceKalamisSnapshotJson as V3VerifiedRegionSnapshot;
const CADDEBOSTAN_SNAPSHOT = caddebostanSnapshotJson as V3VerifiedRegionSnapshot;
const SUADIYE_SNAPSHOT = suadiyeSnapshotJson as V3VerifiedRegionSnapshot;
const BOSTANCI_SNAPSHOT = bostanciSnapshotJson as V3VerifiedRegionSnapshot;
const KOSUYOLU_ACIBADEM_SNAPSHOT = kosuyoluAcibademSnapshotJson as V3VerifiedRegionSnapshot;
const USKUDAR_MERKEZ_SNAPSHOT = uskudarMerkezSnapshotJson as V3VerifiedRegionSnapshot;
const KUZGUNCUK_SNAPSHOT = kuzguncukSnapshotJson as V3VerifiedRegionSnapshot;
const CENGELKOY_SNAPSHOT = cengelkoySnapshotJson as V3VerifiedRegionSnapshot;
const KARAKOY_SNAPSHOT = karakoySnapshotJson as V3VerifiedRegionSnapshot;
const CIHANGIR_SNAPSHOT = cihangirSnapshotJson as V3VerifiedRegionSnapshot;
const NISANTASI_SNAPSHOT = nisantasiSnapshotJson as V3VerifiedRegionSnapshot;
const GALATA_SNAPSHOT = galataSnapshotJson as V3VerifiedRegionSnapshot;
const BESIKTAS_CARSI_SNAPSHOT = besiktasCarsiSnapshotJson as V3VerifiedRegionSnapshot;
const AKARETLER_SNAPSHOT = akaretlerSnapshotJson as V3VerifiedRegionSnapshot;
const BEBEK_SNAPSHOT = bebekSnapshotJson as V3VerifiedRegionSnapshot;
const ETILER_SNAPSHOT = etilerSnapshotJson as V3VerifiedRegionSnapshot;
const ORTAKOY_SNAPSHOT = ortakoySnapshotJson as V3VerifiedRegionSnapshot;
const CUKURCUMA_SNAPSHOT = cukurcumaSnapshotJson as V3VerifiedRegionSnapshot;
const BALAT_SNAPSHOT = balatSnapshotJson as V3VerifiedRegionSnapshot;
const YENIKOY_SNAPSHOT = yenikoySnapshotJson as V3VerifiedRegionSnapshot;
const GOKTURK_SNAPSHOT = gokturkSnapshotJson as V3VerifiedRegionSnapshot;
const ASMALIMESCIT_SNAPSHOT = asmalimescitSnapshotJson as V3VerifiedRegionSnapshot;
const TAKSIM_SNAPSHOT = taksimSnapshotJson as V3VerifiedRegionSnapshot;
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
  FENERYOLU_SNAPSHOT,
  FENERBAHCE_KALAMIS_SNAPSHOT,
  CADDEBOSTAN_SNAPSHOT,
  SUADIYE_SNAPSHOT,
  BOSTANCI_SNAPSHOT,
  KOSUYOLU_ACIBADEM_SNAPSHOT,
  USKUDAR_MERKEZ_SNAPSHOT,
  KUZGUNCUK_SNAPSHOT,
  CENGELKOY_SNAPSHOT,
  KARAKOY_SNAPSHOT,
  CIHANGIR_SNAPSHOT,
  NISANTASI_SNAPSHOT,
  GALATA_SNAPSHOT,
  BESIKTAS_CARSI_SNAPSHOT,
  AKARETLER_SNAPSHOT,
  BEBEK_SNAPSHOT,
  ETILER_SNAPSHOT,
  ORTAKOY_SNAPSHOT,
  CUKURCUMA_SNAPSHOT,
  BALAT_SNAPSHOT,
  YENIKOY_SNAPSHOT,
  GOKTURK_SNAPSHOT,
  ASMALIMESCIT_SNAPSHOT,
  TAKSIM_SNAPSHOT,
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
  feneryolu: FENERYOLU_SNAPSHOT,
  'feneryolu-kadikoy': FENERYOLU_SNAPSHOT,
  'istanbul-kadikoy-feneryolu': FENERYOLU_SNAPSHOT,
  kuyubasi: FENERYOLU_SNAPSHOT,
  'fenerbahce-kalamis': FENERBAHCE_KALAMIS_SNAPSHOT,
  'fenerbahce-kalamis-kadikoy': FENERBAHCE_KALAMIS_SNAPSHOT,
  'istanbul-kadikoy-fenerbahce-kalamis': FENERBAHCE_KALAMIS_SNAPSHOT,
  fenerbahce: FENERBAHCE_KALAMIS_SNAPSHOT,
  kalamis: FENERBAHCE_KALAMIS_SNAPSHOT,
  dalyan: FENERBAHCE_KALAMIS_SNAPSHOT,
  'fenerbahce-burnu': FENERBAHCE_KALAMIS_SNAPSHOT,
  caddebostan: CADDEBOSTAN_SNAPSHOT,
  'caddebostan-kadikoy': CADDEBOSTAN_SNAPSHOT,
  suadiye: SUADIYE_SNAPSHOT,
  'suadiye-kadikoy': SUADIYE_SNAPSHOT,
  bostanci: BOSTANCI_SNAPSHOT,
  'bostanci-kadikoy': BOSTANCI_SNAPSHOT,
  catalcesme: BOSTANCI_SNAPSHOT,
  'kosuyolu-acibadem': KOSUYOLU_ACIBADEM_SNAPSHOT,
  kosuyolu: KOSUYOLU_ACIBADEM_SNAPSHOT,
  acibadem: KOSUYOLU_ACIBADEM_SNAPSHOT,
  'kosuyolu-kadikoy': KOSUYOLU_ACIBADEM_SNAPSHOT,
  validebag: KOSUYOLU_ACIBADEM_SNAPSHOT,
  uskudar: USKUDAR_MERKEZ_SNAPSHOT,
  'merkez-uskudar': USKUDAR_MERKEZ_SNAPSHOT,
  'uskudar-merkez': USKUDAR_MERKEZ_SNAPSHOT,
  'istanbul-uskudar-merkez': USKUDAR_MERKEZ_SNAPSHOT,
  salacak: USKUDAR_MERKEZ_SNAPSHOT,
  selimiye: USKUDAR_MERKEZ_SNAPSHOT,
  kuzguncuk: KUZGUNCUK_SNAPSHOT,
  'kuzguncuk-uskudar': KUZGUNCUK_SNAPSHOT,
  'istanbul-uskudar-kuzguncuk': KUZGUNCUK_SNAPSHOT,
  icadiye: KUZGUNCUK_SNAPSHOT,
  cengelkoy: CENGELKOY_SNAPSHOT,
  'cengelkoy-uskudar': CENGELKOY_SNAPSHOT,
  'istanbul-uskudar-cengelkoy': CENGELKOY_SNAPSHOT,
  cinaralti: CENGELKOY_SNAPSHOT,
  kuleli: CENGELKOY_SNAPSHOT,
  karakoy: KARAKOY_SNAPSHOT,
  'karakoy-beyoglu': KARAKOY_SNAPSHOT,
  'istanbul-beyoglu-karakoy': KARAKOY_SNAPSHOT,
  kemankes: KARAKOY_SNAPSHOT,
  tophane: KARAKOY_SNAPSHOT,
  galataport: KARAKOY_SNAPSHOT,
  cihangir: CIHANGIR_SNAPSHOT,
  'cihangir-beyoglu': CIHANGIR_SNAPSHOT,
  'istanbul-beyoglu-cihangir': CIHANGIR_SNAPSHOT,
  firuzaga: CIHANGIR_SNAPSHOT,
  nisantasi: NISANTASI_SNAPSHOT,
  'nisantasi-sisli': NISANTASI_SNAPSHOT,
  'istanbul-sisli-nisantasi': NISANTASI_SNAPSHOT,
  tesvikiye: NISANTASI_SNAPSHOT,
  topagaci: NISANTASI_SNAPSHOT,
  macka: NISANTASI_SNAPSHOT,
  galata: GALATA_SNAPSHOT,
  'galata-beyoglu': GALATA_SNAPSHOT,
  'istanbul-beyoglu-galata': GALATA_SNAPSHOT,
  kuledibi: GALATA_SNAPSHOT,
  bereketzade: GALATA_SNAPSHOT,
  sahkulu: GALATA_SNAPSHOT,
  'serdar-i-ekrem': GALATA_SNAPSHOT,
  'besiktas-carsi': BESIKTAS_CARSI_SNAPSHOT,
  'carsi-besiktas': BESIKTAS_CARSI_SNAPSHOT,
  'istanbul-besiktas-carsi': BESIKTAS_CARSI_SNAPSHOT,
  besiktas: BESIKTAS_CARSI_SNAPSHOT,
  koyici: BESIKTAS_CARSI_SNAPSHOT,
  sinanpasa: BESIKTAS_CARSI_SNAPSHOT,
  turkali: BESIKTAS_CARSI_SNAPSHOT,
  cihannuma: BESIKTAS_CARSI_SNAPSHOT,
  abbasaga: BESIKTAS_CARSI_SNAPSHOT,
  akaretler: AKARETLER_SNAPSHOT,
  'akaretler-besiktas': AKARETLER_SNAPSHOT,
  'istanbul-besiktas-akaretler': AKARETLER_SNAPSHOT,
  visnezade: AKARETLER_SNAPSHOT,
  'suleyman-seba': AKARETLER_SNAPSHOT,
  siraevler: AKARETLER_SNAPSHOT,
  bebek: BEBEK_SNAPSHOT,
  'bebek-besiktas': BEBEK_SNAPSHOT,
  'istanbul-besiktas-bebek': BEBEK_SNAPSHOT,
  'kucuk-bebek': BEBEK_SNAPSHOT,
  'cevdet-pasa': BEBEK_SNAPSHOT,
  insirah: BEBEK_SNAPSHOT,
  etiler: ETILER_SNAPSHOT,
  'etiler-besiktas': ETILER_SNAPSHOT,
  'istanbul-besiktas-etiler': ETILER_SNAPSHOT,
  nispetiye: ETILER_SNAPSHOT,
  nisbetiye: ETILER_SNAPSHOT,
  akatlar: ETILER_SNAPSHOT,
  akat: ETILER_SNAPSHOT,
  alkent: ETILER_SNAPSHOT,
  ortakoy: ORTAKOY_SNAPSHOT,
  'ortakoy-besiktas': ORTAKOY_SNAPSHOT,
  'istanbul-besiktas-ortakoy': ORTAKOY_SNAPSHOT,
  mecidiye: ORTAKOY_SNAPSHOT,
  dereboyu: ORTAKOY_SNAPSHOT,
  'eski-bahce': ORTAKOY_SNAPSHOT,
  'muallim-naci': ORTAKOY_SNAPSHOT,
  feriye: ORTAKOY_SNAPSHOT,
  cukurcuma: CUKURCUMA_SNAPSHOT,
  'cukurcuma-beyoglu': CUKURCUMA_SNAPSHOT,
  'istanbul-beyoglu-cukurcuma': CUKURCUMA_SNAPSHOT,
  'faik-pasa': CUKURCUMA_SNAPSHOT,
  turnacibasi: CUKURCUMA_SNAPSHOT,
  'cezayir-sokagi': CUKURCUMA_SNAPSHOT,
  balat: BALAT_SNAPSHOT,
  'balat-fatih': BALAT_SNAPSHOT,
  'istanbul-fatih-balat': BALAT_SNAPSHOT,
  fener: BALAT_SNAPSHOT,
  ayvansaray: BALAT_SNAPSHOT,
  vodina: BALAT_SNAPSHOT,
  'cifit-carsisi': BALAT_SNAPSHOT,
  yenikoy: YENIKOY_SNAPSHOT,
  'yenikoy-sariyer': YENIKOY_SNAPSHOT,
  'istanbul-sariyer-yenikoy': YENIKOY_SNAPSHOT,
  koybasi: YENIKOY_SNAPSHOT,
  kalender: YENIKOY_SNAPSHOT,
  gokturk: GOKTURK_SNAPSHOT,
  'gokturk-eyupsultan': GOKTURK_SNAPSHOT,
  'istanbul-eyupsultan-gokturk': GOKTURK_SNAPSHOT,
  'gokturk-merkez': GOKTURK_SNAPSHOT,
  'arcadium-gokturk': GOKTURK_SNAPSHOT,
  'larus-palas': GOKTURK_SNAPSHOT,
  asmalimescit: ASMALIMESCIT_SNAPSHOT,
  'asmalimescit-beyoglu': ASMALIMESCIT_SNAPSHOT,
  'istanbul-beyoglu-asmalimescit': ASMALIMESCIT_SNAPSHOT,
  beyoglu: ASMALIMESCIT_SNAPSHOT,
  pera: ASMALIMESCIT_SNAPSHOT,
  tunel: ASMALIMESCIT_SNAPSHOT,
  mesrutiyet: ASMALIMESCIT_SNAPSHOT,
  odakule: ASMALIMESCIT_SNAPSHOT,
  tepebasi: ASMALIMESCIT_SNAPSHOT,
  taksim: TAKSIM_SNAPSHOT,
  'taksim-beyoglu': TAKSIM_SNAPSHOT,
  'istanbul-beyoglu-taksim': TAKSIM_SNAPSHOT,
  istiklal: TAKSIM_SNAPSHOT,
  'istiklal-caddesi': TAKSIM_SNAPSHOT,
  'taksim-meydani': TAKSIM_SNAPSHOT,
  'cicek-pasaji': TAKSIM_SNAPSHOT,
  nevizade: TAKSIM_SNAPSHOT,
  'mis-sokagi': TAKSIM_SNAPSHOT,
  talimhane: TAKSIM_SNAPSHOT,
  gumussuyu: TAKSIM_SNAPSHOT,
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
  'kaleici-antalya': ANTALYA_KALEICI_SNAPSHOT,
  uckapilar: ANTALYA_KALEICI_SNAPSHOT,
  kalekapisi: ANTALYA_KALEICI_SNAPSHOT,
  'yat-limani': ANTALYA_KALEICI_SNAPSHOT,
  'kaleici-muratpasa-antalya': ANTALYA_KALEICI_SNAPSHOT,
  'antalya-lara': ANTALYA_LARA_SNAPSHOT,
  lara: ANTALYA_LARA_SNAPSHOT,
  sirinyali: ANTALYA_LARA_SNAPSHOT,
  'antalya-sirinyali': ANTALYA_LARA_SNAPSHOT,
  guzeloba: ANTALYA_LARA_SNAPSHOT,
  'lara-muratpasa-antalya': ANTALYA_LARA_SNAPSHOT,
  'antalya-konyaalti': ANTALYA_KONYAALTI_SNAPSHOT,
  konyaalti: ANTALYA_KONYAALTI_SNAPSHOT,
  'konyaalti-sahil': ANTALYA_KONYAALTI_SNAPSHOT,
  'antalya-konyaalti-sahil': ANTALYA_KONYAALTI_SNAPSHOT,
  'akdeniz-bulvari': ANTALYA_KONYAALTI_SNAPSHOT,
  'yasam-parki': ANTALYA_KONYAALTI_SNAPSHOT,
  gursu: ANTALYA_KONYAALTI_SNAPSHOT,
  altinkum: ANTALYA_KONYAALTI_SNAPSHOT,
  arapsuyu: ANTALYA_KONYAALTI_SNAPSHOT,
  liman: ANTALYA_KONYAALTI_SNAPSHOT,
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
  // YAYINDA (V3 %100 Canlı API Doğrulamalı — Kadıköy 6 Semt + Anadolu & Ege Seçkileri)
  ...V3_ALL_PUBLISHED_SNAPSHOTS.map(toPublishedLocation),

  // SIRADAKİ DOĞRULAMA KUYRUĞU (İl > İlçe > Semt ayrıştırılmış)
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
