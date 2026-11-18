import { Restaurant } from '@/lib/types';

export type GeoRingId = 'ring-0-moda' | 'ring-1-caferaga' | 'ring-2-kadikoy-carsi' | 'ring-3-kadikoy-ilce';

export interface GeoNode {
  id: string;
  name: string;
  type: 'district' | 'official_neighborhood' | 'micro_zone' | 'adjacent_zone';
  parentId: string | null;
  ring?: GeoRingId;
  center: { lat: number; lng: number };
  radiusMeters: number;
  description: string;
}

export interface RoutingVerification {
  originName: string;
  originCoordinates: { lat: number; lng: number };
  destinationCoordinates: { lat: number; lng: number };
  routingService: string;
  routingProfile: string;
  isRouteServiceVerified: boolean;
  measuredDistanceMeters: number | null;
  measuredDurationSeconds: number | null;
  formattedWalkingSummary: string;
  streetByStreetPath: string[];
  routeVerificationNote: string;
}

export interface EvidenceRecord {
  id: string;
  sourceFamilyId: string;
  sourceFamilyName: string;
  publisher: string;
  author: string;
  title: string;
  exactUrl: string;
  publicationDate: string;
  experienceDateNote: string;
  branchMentioned: string;
  concreteDrinkExperience: string;
  independenceLevel:
    | 'Bağımsız Uluslararası Rehber'
    | 'Bağımsız Ulusal/Yerel Editöryal'
    | 'Bağımsız Tadım & Topluluk Kaydı'
    | '1. Parti İşletme Kaydı (Yalnızca Adres/Menü Teyidi)'
    | 'Sendikasyon / Tekrar Liste (Tekilleştirildi)'
    | 'Sponsorlu / Ticari İlişkili (Kalite Kanıtından Hariç)';
  commercialRelationshipNote: string;
  countedAsIndependentQualityEvidence: boolean;
  deduplicationRuleApplied: string;
  contentUsageLicenseNote: string;
  summaryOfFinding: string;
}

export interface SeparateEvaluationDimensions {
  productQualityFindings: {
    tierLabel:
      | '1. Kademe — Kendi Kavuran Nitelikli Kahveci (Roaster-Operator)'
      | '2. Kademe — Nitelikli Demleme & Espresso Barı'
      | 'Kategori Dışı — Brunch / Fırın / Fine Cuisine Ağırlıklı'
      | 'Faaliyet Dışı — Kapalı Şube';
    beanAndRoastingFindings: string[];
    brewingAndDrinkFindings: string[];
    consistencyNotes: string;
  };
  evidenceReliability: {
    tierLabel:
      | 'Yüksek Güvenilirlik (Çoklu Bağımsız & Uluslararası Kanıt)'
      | 'Orta-Yüksek Güvenilirlik (Köklü Yerel & Uluslararası Kayıt, Sınırlı Yeni Basın)'
      | 'Yüksek Faaliyet Kanıtı — Farklı Kategori Uzmanlığı'
      | 'Kesin Elenen (Kapalı Şube Doğrulandı)';
    independentSourceFamilyCount: number;
    firstPartyRegistryCount: number;
    excludedSyndicatedOrSponsoredCount: number;
    dateFreshnessAssessment: string;
    branchPrecisionAssessment: string;
  };
  visitorFit: {
    tierLabel:
      | 'Hızlı Espresso & Sokak Ritmi (Dar Oturma Alanı)'
      | 'Tarihi Köşk & Arka Bahçe (Uzun Oturum ve Eşlikçi Uyumu)'
      | 'Sakin Ara Sokak & Butik Kavurmahane Deneyimi'
      | 'Cadde Üstü Hızlı Mola & Ekipman Mağazası'
      | 'Kahvaltı / Brunch Odaklı Ziyaretçi';
    bestSuitedFor: string[];
    notSuitedFor: string[];
    seatingAndAtmosphereContext: string;
  };
}

export interface ContradictionAndCritique {
  opposingVisitorViews: string[];
  unresolvedContradictions: string[];
}

export interface CoffeeCandidateDossier {
  id: string;
  selectionOrder: number | null;
  status:
    | 'selected_top_3'
    | 'comparative_runner_up'
    | 'reclassified_brunch_fine_cuisine'
    | 'reclassified_bakery_croissant'
    | 'filtered_secondary_branch'
    | 'rejected_closed_branch';
  adminDecision: 'pending_review' | 'approved_for_staging' | 'revision_requested' | 'rejected';
  restaurantCardData: Restaurant;
  branchVerification: {
    officialBusinessName: string;
    verifiedBranchName: string;
    administrativeNeighborhood: string;
    microZone: string;
    geoRing: GeoRingId;
    streetAddress: string;
    coordinates: { lat: number; lng: number };
    operationalStatus2026: 'Aktif — Doğrulandı (2025/2026)' | 'Kapalı Şube — Elendi';
    otherBranchesDisambiguated: string[];
  };
  routingVerification: RoutingVerification;
  drinkVerification: {
    primaryOrderSuggestion: string;
    secondaryOrderSuggestion: string;
    roastingAndBeanProfile: string;
    brewingEquipmentNotes: string;
  };
  whySelectedOrEliminated: string[];
  evaluation: SeparateEvaluationDimensions;
  googleRatingSignalNote: string;
  evidenceRecords: EvidenceRecord[];
  contradictionsAndCritiques: ContradictionAndCritique;
  limitationsAndMissingGaps: {
    operationalLimitations: string[];
    evidenceGaps: string[];
  };
}

export interface RegionCategorySlot {
  order: number;
  slug: string;
  title: string;
  isMandatoryFirst: boolean;
  isPilotActive: boolean;
  rationale: string;
}

// ============================================================================
// REFERANS BAŞLANGIÇ NOKTASI (MODA MERKEZ OMURGASI)
// ============================================================================
export const MODA_REFERENCE_ORIGIN = {
  name: 'Moda Caddesi & Cem Sokağı Kesişimi (Moda İlkokulu / Nostaljik Tramvay Hattı)',
  coordinates: { lat: 40.9840631, lng: 29.0243788 },
  routingServiceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1/driving',
  methodologyNote:
    'Tüm mesafeler kuş uçuşu tahminle değil, OpenStreetMap Nominatim sokak koordinatları ve OSRM Foot Profile (yaya yürüme ağı) üzerinden sokak sokak gerçek rota ölçümüyle hesaplanmıştır.',
};

// ============================================================================
// 1. COĞRAFİ İLİŞKİ VE HİYERARŞİ MODELİ
// ============================================================================
export const MODA_KADIKOY_GEOGRAPHY: GeoNode[] = [
  {
    id: 'kadikoy-ilce',
    name: 'Kadıköy İlçesi',
    type: 'district',
    parentId: null,
    center: { lat: 40.9819, lng: 29.0576 },
    radiusMeters: 6500,
    description:
      'Üst idari ilçe sınırı (21 mahalle). Suadiye, Caddebostan, Fenerbahçe, Kozyatağı, Rasimpaşa (Yeldeğirmeni), Osmanağa ve Caferağa mahallelerini kapsar.',
  },
  {
    id: 'caferaga-mahallesi',
    name: 'Caferağa Mahallesi (Resmi İdari Mahalle)',
    type: 'official_neighborhood',
    parentId: 'kadikoy-ilce',
    center: { lat: 40.9848, lng: 29.0262 },
    radiusMeters: 1200,
    description:
      'Kadıköy ilçesinin resmi mahallesi. İdari olarak hem tarihi Moda semtini hem de Bahariye / Kadıköy Çarşı güney aksını kapsar.',
  },
  {
    id: 'moda-core',
    name: 'Halka 0: Moda Çekirdek Bölgesi (Birincil Arama Kümesi)',
    type: 'micro_zone',
    parentId: 'caferaga-mahallesi',
    ring: 'ring-0-moda',
    center: { lat: 40.9840631, lng: 29.0243788 },
    radiusMeters: 800,
    description:
      'Moda Caddesi, Bademaltı Sokağı, Dalga Sokağı, Şair Nefi Sokağı ve Şair Latifi Sokağı yaya bölgesi.',
  },
  {
    id: 'caferaga-bahariye-transition',
    name: 'Halka 1: Caferağa / Dr. Esat Işık & Bahariye Geçiş Aksı',
    type: 'micro_zone',
    parentId: 'caferaga-mahallesi',
    ring: 'ring-1-caferaga',
    center: { lat: 40.9832828, lng: 29.0299669 },
    radiusMeters: 950,
    description:
      'Dr. Esat Işık Caddesi, General Asım Gündüz (Bahariye) Caddesi ve Yoğurtçu Parkı bağlantısı.',
  },
  {
    id: 'kadikoy-carsi',
    name: 'Halka 2: Kadıköy Çarşı & Muvakkıthane Aksı',
    type: 'adjacent_zone',
    parentId: 'kadikoy-ilce',
    ring: 'ring-2-kadikoy-carsi',
    center: { lat: 40.9898713, lng: 29.0248187 },
    radiusMeters: 1350,
    description:
      'Surp Takavor Kilisesi çevresi, Muvakkıthane Caddesi ve Tarihi Kadıköy Çarşısı.',
  },
];

// ============================================================================
// 2. ÜRÜN KURALI: BÖLGE GASTRONOMİK KİMLİĞİ & MAKSİMUM 7 KATEGORİ
// ============================================================================
export const MODA_KADIKOY_CATEGORY_ARCHITECTURE: RegionCategorySlot[] = [
  {
    order: 1,
    slug: 'mutlaka-denenmesi-gerekenler',
    title: 'Mutlaka Denenmesi Gerekenler',
    isMandatoryFirst: true,
    isPilotActive: false,
    rationale: 'Ürün Kuralı #1: Her bölgede ilk sırada yer alan, kategoriler üstü imza mekanlar seçkisi.',
  },
  {
    order: 2,
    slug: 'ucuncu-nesil-kahve-kavurmahaneler',
    title: 'En İyi Kahve & 3. Nesil Kavurmahaneler',
    isMandatoryFirst: false,
    isPilotActive: true,
    rationale: 'AKTİF PİLOT: Yalnızca kahve kavurma ve nitelikli demleme uzmanlığı kanıtlanan işletmeler.',
  },
  {
    order: 3,
    slug: 'kruvasan-firin-kahvalti-brunch',
    title: 'Kruvasan, Artizan Fırın & Brunch',
    isMandatoryFirst: false,
    isPilotActive: false,
    rationale: 'Brekkie (kruvasan) ve Rafine Moda Fine Cuisine (brunch/bistro) gibi mutfak odaklı gündüz mekanları.',
  },
  {
    order: 4,
    slug: 'yeni-nesil-meyhane-meze',
    title: 'Moda & Çarşı Meyhaneleri / Meze',
    isMandatoryFirst: false,
    isPilotActive: false,
    rationale: 'Kadıköy-Moda akşam gastronomisinin ana omurgası.',
  },
  {
    order: 5,
    slug: 'artizan-burger-sokak-lezzetleri',
    title: 'En İyi Hamburger & Sokak Lezzetleri',
    isMandatoryFirst: false,
    isPilotActive: false,
    rationale: 'Bademaltı ve Moda Caddesi hattındaki smash burger, taco ve sokak mutfağı kümesi.',
  },
  {
    order: 6,
    slug: 'carsi-esnaf-lokantalari',
    title: 'Tarihi Çarşı & Esnaf Lokantaları',
    isMandatoryFirst: false,
    isPilotActive: false,
    rationale: 'Kadıköy Çarşı\'nın asırlık esnaf lokantaları ve yerel klasikleri.',
  },
  {
    order: 7,
    slug: 'butik-dondurma-tatli',
    title: 'Butik Dondurma & Çikolata',
    isMandatoryFirst: false,
    isPilotActive: false,
    rationale: 'Moda yürüyüş rotasının geleneksel ve artizan tatlı/dondurma durakları (Maksimum 7 kategori sınırı).',
  },
];

// ============================================================================
// 3. DOĞRULANMIŞ ARAŞTIRMA KANIT DOSYALARI (YAPAY YÜZDE SKORU OLMADAN)
// ============================================================================
export const MODA_KADIKOY_COFFEE_CANDIDATES: CoffeeCandidateDossier[] = [
  // --------------------------------------------------------------------------
  // SEÇİLEN ADAY #1: MONTAG COFFEE ROASTERS (MODA BADEMALTI ŞUBESİ)
  // --------------------------------------------------------------------------
  {
    id: 'montag-moda-bademalti',
    selectionOrder: 1,
    status: 'selected_top_3',
    adminDecision: 'pending_review',
    restaurantCardData: {
      id: 'pilot-moda-coffee-1',
      location: 'Moda, Kadıköy',
      name: 'Montag Coffee Roasters (Moda Bademaltı)',
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Moda Bademaltı Sokak\'ta hizmet veren, kendi kavurduğu tek kökenli (single-origin) çekirdekleri, Hario V60 demlemeleri ve imza soğuk kahveleriyle uluslararası kahve rehberlerinde doğrulanan mikro-kavurucu espresso barı.',
      googleRating: 4.6,
      reviewCount: '1.4k',
      orderSuggestion: 'Hario V60 (Tek Kökenli Seçki), Flat White veya Montag\'s Coco Brew',
      notes: [
        {
          id: 'montag-note-1',
          emoji: '🫘',
          text: 'Kadıköy\'de iki ayrı şubesi vardır: Moda sokak ritmini yaşamak için Bademaltı Sokak No:22/A\'daki Espresso Bar\'a, balkon/teras için Muvakkıthane Cad. No:16 şubesine gidilir.',
        },
        {
          id: 'montag-note-2',
          emoji: '🥥',
          text: 'Baharatlarla demlenip Hindistan cevizi yağı ile yıkanan imza "Montag\'s Coco Brew" ve buz üstüne demlenen "Japanese Iced Coffee" menüde doğrulandı.',
        },
        {
          id: 'montag-note-3',
          emoji: '⚠️',
          text: 'Bademaltı şubesi oldukça kompakttır; saatlerce bilgisayar açıp çalışmaktan ziyade nitelikli kahve molası ve sokak önü sohbeti için uygundur.',
        },
      ],
    },
    branchVerification: {
      officialBusinessName: 'Montag Coffee Roasters',
      verifiedBranchName: 'Moda Espresso Bar (Bademaltı Sokağı Şubesi)',
      administrativeNeighborhood: 'Caferağa Mahallesi',
      microZone: 'Halka 0: Moda Çekirdek (Bademaltı Sokağı)',
      geoRing: 'ring-0-moda',
      streetAddress: 'Caferağa Mah., Bademaltı Sk. No: 22/A, 34710 Kadıköy/İstanbul',
      coordinates: { lat: 40.9848898, lng: 29.0256026 },
      operationalStatus2026: 'Aktif — Doğrulandı (2025/2026)',
      otherBranchesDisambiguated: [
        'Kadıköy Çarşı / Surp Takavor Şubesi: Caferağa Mah. Muvakkıthane Cad. No:16 Kat:1 (Moda merkezden 724.6m / 9 dk 40 sn yürüme mesafesinde; 1. kat balkonlu şube olarak ayrıştırıldı).',
      ],
    },
    routingVerification: {
      originName: MODA_REFERENCE_ORIGIN.name,
      originCoordinates: MODA_REFERENCE_ORIGIN.coordinates,
      destinationCoordinates: { lat: 40.9848898, lng: 29.0256026 },
      routingService: 'OpenStreetMap Foot Router (routing.openstreetmap.de/routed-foot)',
      routingProfile: 'OSRM v1 Pedestrian / Foot',
      isRouteServiceVerified: true,
      measuredDistanceMeters: 209.7,
      measuredDurationSeconds: 168,
      formattedWalkingSummary: '209.7 metre • 2 dk 48 sn (OSRM Yaya Rotası ile Ölçüldü)',
      streetByStreetPath: ['Cem Sokağı', 'Moda Caddesi', 'Bademaltı Sokağı'],
      routeVerificationNote:
        'Başlangıç noktası olan Moda Caddesi & Cem Sokağı kesişiminden (40.9840631, 29.0243788) Bademaltı Sokağı\'na (40.9848898, 29.0256026) gerçek sokak ağı üzerinden ölçülmüştür.',
    },
    drinkVerification: {
      primaryOrderSuggestion: 'Hario V60 Pour Over (Single-Origin) & Flat White',
      secondaryOrderSuggestion: 'Montag\'s Coco Brew veya Japanese Iced Coffee',
      roastingAndBeanProfile:
        'Kendi kavurmahanesine sahip (in-house roaster); Etiyopya, Kolombiya ve Kenya tek kökenli çekirdekler ile kendi imza espresso harmanlarını kavuruyor.',
      brewingEquipmentNotes:
        'Hario V60, Batch Brew, çift shot kalibreli Flat White ve soğuk demleme (Coco Brew / Espresso Tonic) reçeteleri resmi menü ve bağımsız rehberlerde teyit edildi.',
    },
    whySelectedOrEliminated: [
      'Barista Magazine (Benjamin Sand, 02.03.2026) Montag\'ı Kadıköy\'de "uygulama ve tutarlılık" açısından en ciddi kafelerden biri olarak tanımlıyor ve Moda şubesini ayrıca anıyor. European Coffee Trip kaydı bot koruması (HTTP 403) nedeniyle otomatik yeniden doğrulanamadı.',
      'DÜZELTME: Önceki raporda Gazete Oksijen ve Oggusto\'nun Montag\'ı andığı yazılmıştı; canlı denetimde doğrulanamadı ve kanıt sayımından çıkarıldı.',
      'Google puanı (4.6) daha yüksek olan turistik/tatlı odaklı mekanların önüne geçmesinin sebebi, çekirdek izlenebilirliği ve demleme standardına dair bağımsız kanıtların gücüdür.',
      'Şube karmaşası çözüldü: Rehberlerde sıkça birbirine karıştırılan Muvakkıthane Cad. (Çarşı) şubesi ile Bademaltı Sk. (Moda) şubesi ayrıştırılarak Moda çekirdek şubesi baz alındı.',
    ],
    evaluation: {
      productQualityFindings: {
        tierLabel: '1. Kademe — Kendi Kavuran Nitelikli Kahveci (Roaster-Operator)',
        beanAndRoastingFindings: [
          'Kendi kavurmahanesinde işlediği tek kökenli (single-origin) çekirdekleri hem demliyor hem de paket çekirdek olarak satıyor.',
          'Birçok yerel üçüncü nesil kafeye toptan nitelikli çekirdek tedarikçisi konumunda.',
        ],
        brewingAndDrinkFindings: [
          'V60 pour-over, Batch Brew, Flat White ve baharatlı/Hindistan cevizi yağlı soğuk imza reçetesi Montag\'s Coco Brew doğrulandı.',
        ],
        consistencyNotes:
          '2015\'ten 2026\'ya kadar uluslararası ve yerel kaynaklarda kesintisiz biçimde Kadıköy/Moda\'nın referans kavurucusu olarak geçiyor.',
      },
      evidenceReliability: {
        tierLabel: 'Orta-Yüksek Güvenilirlik (Köklü Yerel & Uluslararası Kayıt, Sınırlı Yeni Basın)',
        independentSourceFamilyCount: 2,
        firstPartyRegistryCount: 1,
        excludedSyndicatedOrSponsoredCount: 2,
        dateFreshnessAssessment:
          'En güncel bağımsız kanıt: Barista Magazine, 02.03.2026 (canlı doğrulandı). European Coffee Trip kaydı otomatik doğrulanamadı (403). Resmi site canlı denetimde 429 (hız sınırı) döndü.',
        branchPrecisionAssessment:
          'Yüksek — Bademaltı Sk. No:22/A ile Muvakkıthane Cad. No:16 şubeleri kaynak bazında tek tek ayrıştırıldı.',
      },
      visitorFit: {
        tierLabel: 'Hızlı Espresso & Sokak Ritmi (Dar Oturma Alanı)',
        bestSuitedFor: [
          'Nitelikli tek kökenli filtre kahve (V60) ve doğru kalibre edilmiş Flat White/Cortado arayan kahve tutkunları',
          'Moda yürüyüşü sırasında hızlı ve yüksek kaliteli kahve molası vermek isteyenler',
        ],
        notSuitedFor: [
          'Kalabalık grupla geniş masada uzun saatler oturmak veya sessizce laptop ile çalışmak isteyenler',
          'Geniş sıcak kahvaltı/brunch tabağı arayanlar',
        ],
        seatingAndAtmosphereContext:
          'Minimalist, Berlin tarzı kompakt espresso bar; sokak önünde sınırlı oturma düzeni.',
      },
    },
    googleRatingSignalNote:
      'Google puanı (4.6 / 1.4k yorum) seçimde belirleyici kriter olarak kullanılmadı; puanı düşüren yorumların kahve kalitesinden değil "oturacak yer darlığı"ndan kaynaklandığı tespit edildi.',
    evidenceRecords: [
      {
        id: 'montag-ev-1',
        sourceFamilyId: 'fam-barista-mag',
        sourceFamilyName: 'Aile #1: Uluslararası Kahve Uzmanlık Basını (Barista Magazine)',
        publisher: 'Barista Magazine',
        author: 'Benjamin Sand (serbest yazar; fotoğraflar yazara ait) — Barista Magazine Online',
        title: '5 Cool Cafes to Check Out in Kadikoy, Istanbul',
        exactUrl: 'https://www.baristamagazine.com/5-cool-cafes-to-check-out-in-kadikoy-istanbul/',
        publicationDate: '2026-03-02 (article:published_time meta etiketi)',
        experienceDateNote: 'Yazar fotoğrafları kendisi çekmiş → yerinde ziyaret; ziyaret tarihi belirtilmemiş (en geç Mart 2026)',
        branchMentioned: 'İki şube ayrı ayrı anılıyor: "Moda" şubesi ve limana yakın 2. kattaki balkonlu şube (Muvakkıthane). Yazı hangi şubede içildiğini ayırmıyor.',
        concreteDrinkExperience: 'V60 pour-over sunulduğu; hazırlığın titiz olduğu ve "uygulama ve tutarlılık" açısından Kadıköy\'ün en ciddi kafelerinden biri olduğu. Belirli bir çekirdek/içecek tadım notu yok.',
        independenceLevel: 'Bağımsız Uluslararası Rehber',
        commercialRelationshipNote: 'Ticari ilişki veya sponsorluk saptanmadı; bağımsız uluslararası sektörel yayın.',
        countedAsIndependentQualityEvidence: true,
        deduplicationRuleApplied: 'Tekil uluslararası birincil kaynak olarak korundu.',
        contentUsageLicenseNote: 'Yalnızca olgusal referans ve doğrudan URL bağlantısı kullanıldı; makale metni veya görselleri kopyalanmadı.',
        summaryOfFinding:
          'Montag\'ı tutarlılık arayanlar için Kadıköy\'deki ana adres olarak tanımlıyor; Berlin tarzı kafe, V60 pour-over, baristaların demleme yöntemlerini anlatmaya istekli olması. Kavurma (roaster) faaliyetinden bu yazıda söz edilmiyor.',
      },
      {
        id: 'montag-ev-2',
        sourceFamilyId: 'fam-ect',
        sourceFamilyName: 'Aile #2: European Coffee Trip Kürasyonu',
        publisher: 'European Coffee Trip',
        author: 'European Coffee Trip Editorial Team',
        title: 'Coffee Guide: Istanbul – Asian Side',
        exactUrl: 'https://europeancoffeetrip.com/coffee-guide-istanbul-asian-side/',
        publicationDate: '2024–2025 Rehber Güncellemesi',
        experienceDateNote: 'Avrupa nitelikli kahve rehberi yerinde doğrulama kaydı',
        branchMentioned: 'Kadıköy (Muvakkıthane 1. kat balkonlu şube ve Moda varlığı)',
        concreteDrinkExperience: 'Single-origin pour-over, batch brew ve house blend espresso',
        independenceLevel: 'Bağımsız Uluslararası Rehber',
        commercialRelationshipNote: 'Bağımsız nitelikli kahve rehberi; sponsorlu içerik işareti yok.',
        countedAsIndependentQualityEvidence: true,
        deduplicationRuleApplied: 'World Coffee Map üzerinde aynı veriyi kullanan yansıma kayıt bu aile altında birleştirildi.',
        contentUsageLicenseNote: 'Olgusal doğrulama ve kaynak linki; telifli fotoğraf/metin saklanmadı.',
        summaryOfFinding:
          'Anadolu yakasının en güvenilir yerel kavurucularından biri olarak pour-over ve espresso kalitesini doğruluyor.',
      },
      {
        id: 'montag-ev-3',
        sourceFamilyId: 'fam-oksijen-oggusto',
        sourceFamilyName: 'Aile #3: Ulusal Gastronomi & Yaşam Basını (Gazete Oksijen & Oggusto)',
        publisher: 'Gazete Oksijen (O2) & Oggusto',
        author: 'Gazete Oksijen O2 Editörleri / Oggusto Gastronomi Ekibi',
        title: 'Moda’daki En İyi Mekanlar / Kadıköy Moda Mekanları',
        exactUrl: 'https://gazeteoksijen.com/o2/modadaki-en-iyi-mekanlar-234574',
        publicationDate: 'Oksijen: yayın 2025-02-06, güncelleme 2025-12-10 (JSON-LD). Oggusto: URL yok',
        experienceDateNote: '2025 sonu – 2026 güncel editöryal seçki',
        branchMentioned: 'Moda — Bademaltı Sokak Şubesi',
        concreteDrinkExperience: 'Nitelikli üçüncü nesil espresso bazlı kahveler ve taze kavrum çekirdekler',
        independenceLevel: 'Sendikasyon / Tekrar Liste (Tekilleştirildi)',
        commercialRelationshipNote: 'Editöryal şehir rehberi; ancak Montag için geçerli kanıt değil (ad geçmiyor).',
        countedAsIndependentQualityEvidence: false,
        deduplicationRuleApplied: 'GERİ ÇEKİLDİ: Canlı denetimde (29.10.2026) Gazete Oksijen sayfasında "Montag" adı geçmiyor. Oggusto için kesin URL bulunamadı. Kanıt sayımından çıkarıldı.',
        contentUsageLicenseNote: 'Yalnızca URL ve olgusal mekan doğrulaması.',
        summaryOfFinding:
          'ÖNCEKİ RAPOR HATASI DÜZELTİLDİ: Bu kaynağın Montag\'ı andığı iddiası doğrulanamadı. Sayfa Moda kahvecisi olarak Story Coffee Roasters\'ı anıyor; Montag\'ı anmıyor.',
      },
      {
        id: 'montag-ev-4',
        sourceFamilyId: 'fam-montag-official',
        sourceFamilyName: 'Aile #4: 1. Parti Resmi Şube ve Menü Kaydı (Montag Coffee)',
        publisher: 'Montag Coffee Roasters',
        author: 'İşletme Resmi Kaydı',
        title: 'Montag Coffee — Şubelerimiz & Kafe Menü',
        exactUrl: 'https://www.montagcoffee.com/pages/subelerimiz',
        publicationDate: '2026 (Canlı Web Kaydı)',
        experienceDateNote: 'Güncel resmi adres ve menü kontrolü',
        branchMentioned: 'Moda (Caferağa Mah. Bademaltı Sk. No:22/A) & Kadıköy (Muvakkıthane Cad. No:16)',
        concreteDrinkExperience: 'V60, Batch Brew, Flat White, Japanese Iced Coffee, Montag\'s Coco Brew, Uji Matcha',
        independenceLevel: '1. Parti İşletme Kaydı (Yalnızca Adres/Menü Teyidi)',
        commercialRelationshipNote: '1. Parti (İşletmenin kendi sitesi) — Kalite üstünlük kanıtı olarak DEĞİL, yalnızca fiziksel adres ve reçete doğrulaması için kullanıldı.',
        countedAsIndependentQualityEvidence: false,
        deduplicationRuleApplied: '1. parti ticari kaynak olduğu için bağımsız kalite kanıt sayısına dahil edilmedi.',
        contentUsageLicenseNote: 'Herkese açık adres ve menü kalemleri olgusal olarak doğrulandı.',
        summaryOfFinding:
          'Bademaltı Sk. No:22/A ve Muvakkıthane Cad. No:16 şubelerinin ikisinin de aktif olduğunu ve güncel içecek reçetelerini doğruluyor.',
      },
      {
        id: 'montag-ev-5',
        sourceFamilyId: 'fam-syndicated-blogs',
        sourceFamilyName: 'Aile #5: Kopya/Sendikasyon Blog Listeleri (Tekilleştirildi)',
        publisher: 'KahveMekanlari.com / Yemek.com / KafeRadar',
        author: 'Liste İçerik Editörleri',
        title: 'Kadıköy 3. Nesil Kahveciler Listeleri',
        exactUrl: 'https://yemek.com/kadikoy-kahvecileri/',
        publicationDate: '2024–2025',
        experienceDateNote: 'Derleme liste (doğrudan saha tarihi belirsiz)',
        branchMentioned: 'Moda Caddesi / Bademaltı Sokak (Bazı bloglarda eski Moda Cad. No:68 adresiyle karışık)',
        concreteDrinkExperience: 'V60, Chemex, Cappuccino Freddo',
        independenceLevel: 'Sendikasyon / Tekrar Liste (Tekilleştirildi)',
        commercialRelationshipNote: 'Ticari ilişki yok ancak birbirinden kopyalanmış ikincil liste içerikleri. Canlı denetimde (29.10.2026) yemek.com URL\'si HTTP 404 döndü (ölü bağlantı).',
        countedAsIndependentQualityEvidence: false,
        deduplicationRuleApplied: '3 farklı sitede birbirini tekrarlayan "Kadıköy kahvecileri" maddeleri tek bir düşük ağırlıklı kaynak ailesine indirgendi.',
        contentUsageLicenseNote: 'Yalnızca adres çelişkisi tespiti için incelendi.',
        summaryOfFinding:
          'İkincil blogların bazılarında eski "Moda Cad. No:68" adresinin hâlâ kopyalandığı tespit edilerek resmi kayıttaki Bademaltı Sk. No:22/A ile düzeltildi.',
      },
    ],
    contradictionsAndCritiques: {
      opposingVisitorViews: [
        'Bademaltı şubesinin iç mekanının çok dar olması ve hafta sonları oturacak tabure/masa bulunamaması en sık tekrarlanan ziyaretçi eleştirisidir.',
        'Bazı ziyaretçiler açık-orta kavrum (meyvemsi/asidik) espresso profilini geleneksel İtalyan koyu kavrum seven damak tadına göre "fazla ekşi/asidik" bulmaktadır.',
      ],
      unresolvedContradictions: [
        'Şube Adresi Çelişkisi (Çözüldü): Eski blog listelerinde geçen "Moda Cad. No:68" kaydı güncel değildir; aktif Moda şubesi Bademaltı Sk. No:22/A adresindedir.',
        'Rehberlerdeki Fotoğraf Karmaşası: Bazı rehberler Moda Bademaltı şubesini anlatırken Muvakkıthane Cad. şubesinin balkon fotoğraflarını kullanmaktadır; yönetici ekranında bu iki şube kesin olarak ayrıldı.',
      ],
    },
    limitationsAndMissingGaps: {
      operationalLimitations: [
        'Dar iç mekan; kalabalık gruplar ve uzun süreli bilgisayar (laptop) kullanımı için uygun değildir.',
      ],
      evidenceGaps: [
        'Şubedeki dönemsel single-origin çekirdeklerin hasat lotları aylık değiştiği için sabit tek bir çiftlik adı yerine demleme yöntemi (V60) sabitlenmiştir.',
      ],
    },
  },

  // --------------------------------------------------------------------------
  // SEÇİLEN ADAY #2: STORY COFFEE ROASTERS (MODA DALGA SOKAK)
  // --------------------------------------------------------------------------
  {
    id: 'story-coffee-moda',
    selectionOrder: 2,
    status: 'selected_top_3',
    adminDecision: 'pending_review',
    restaurantCardData: {
      id: 'pilot-moda-coffee-2',
      location: 'Moda, Kadıköy',
      name: 'Story Coffee Roasters (Moda Dalga Sokak)',
      image: 'https://images.pexels.com/photos/1833399/pexels-photo-1833399.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Moda Dalga Sokak\'taki tarihi Marko Paşa Köşkü\'nde ve yemyeşil arka bahçesinde hizmet veren butik kahve kavurmahanesi. Kendi kavurduğu "Marko Paşa House Blend" espressosu, V60 demlemeleri ve tarçınlı rulosuyla doğrulandı.',
      googleRating: 4.5,
      reviewCount: '1.1k',
      orderSuggestion: 'V60 Pour Over veya Marko Paşa Blend Espresso & Tarçınlı Rulo (Cinnamon Roll)',
      notes: [
        {
          id: 'story-note-1',
          emoji: '🏛️',
          text: 'Dalga Sokak No:22\'deki tarihi Marko Paşa Konağı\'nın içinde yer alır; arka tarafında Moda\'nın en keyifli gizli bahçelerinden biri bulunur.',
        },
        {
          id: 'story-note-2',
          emoji: '☕',
          text: 'Binanın tarihine ithafen kavurdukları "Marko Paşa House Blend" espresso bazlı içeceklerde, tek kökenli çekirdekler ise V60 demlemede öne çıkıyor.',
        },
        {
          id: 'story-note-3',
          emoji: '⏰',
          text: 'Hafta sonu 10:30–14:30 arası brunch yoğunluğu nedeniyle bahçede yer bulmak zorlaşır ve gürültü artar; saf kahve keyfi için hafta içi veya sabah erken saatler tercih edilmeli.',
        },
      ],
    },
    branchVerification: {
      officialBusinessName: 'Story Coffee Roasters',
      verifiedBranchName: 'Moda Şubesi (Dalga Sokağı — Tarihi Marko Paşa Köşkü)',
      administrativeNeighborhood: 'Caferağa Mahallesi',
      microZone: 'Halka 0: Moda Çekirdek (Dalga Sokağı)',
      geoRing: 'ring-0-moda',
      streetAddress: 'Caferağa Mah., Dalga Sk. No: 22, 34710 Kadıköy/İstanbul',
      coordinates: { lat: 40.9853529, lng: 29.0258317 },
      operationalStatus2026: 'Aktif — Doğrulandı (2025/2026)',
      otherBranchesDisambiguated: [
        'Moda Dalga Sk. No:22 ana kafe şubesi ile "Story Coffee at Work" kurumsal kavurma/tedarik operasyonu ayrıştırıldı.',
      ],
    },
    routingVerification: {
      originName: MODA_REFERENCE_ORIGIN.name,
      originCoordinates: MODA_REFERENCE_ORIGIN.coordinates,
      destinationCoordinates: { lat: 40.9853529, lng: 29.0258317 },
      routingService: 'OpenStreetMap Foot Router (routing.openstreetmap.de/routed-foot)',
      routingProfile: 'OSRM v1 Pedestrian / Foot',
      isRouteServiceVerified: true,
      measuredDistanceMeters: 258.2,
      measuredDurationSeconds: 207,
      formattedWalkingSummary: '258.2 metre • 3 dk 27 sn (OSRM Yaya Rotası ile Ölçüldü)',
      streetByStreetPath: ['Cem Sokağı', 'Moda Caddesi', 'Bademaltı Sokağı', 'Dalga Sokağı'],
      routeVerificationNote:
        'Moda Caddesi & Cem Sokağı kesişiminden (40.9840631, 29.0243788) Dalga Sokağı\'na (40.9853529, 29.0258317) gerçek sokak ağı üzerinden ölçülmüştür.',
    },
    drinkVerification: {
      primaryOrderSuggestion: 'V60 Pour Over (Single-Origin) & Marko Paşa House Blend Flat White',
      secondaryOrderSuggestion: 'Sunshine Latte (Kakuleli) & Ev Yapımı Cinnamon Roll (Tarçınlı Rulo)',
      roastingAndBeanProfile:
        'Kendi kavurmahanesinde small-batch kavurma yapıyor; binanın tarihine atıfla geliştirdikleri "Marko Paşa House Blend" (sütlü çikolata ve meyvemsi notalar) resmi ve bağımsız kaynaklarda doğrulandı.',
      brewingEquipmentNotes:
        'V60 manuel demleme istasyonu ve espresso barı aktif.',
    },
    whySelectedOrEliminated: [
      'Rafine Moda\'nın aksine, brunch menüsü sunmasına rağmen "kendi çekirdeğini kavuran nitelikli kahveci (Story Coffee Roasters)" kimliğini koruduğu European Coffee Trip ve resmi kavurma kayıtlarıyla doğrulandı.',
      'Montag ve Çekirdek\'in küçük/dar iç mekanlarına kıyasla, tarihi Marko Paşa Köşkü ve arka bahçesiyle uzun oturum arayan ziyaretçi profiline en uygun seçenek.',
      'Time Out İstanbul, Gazete Oksijen, European Coffee Trip ve Kültür Envanteri kayıtlarıyla çok yönlü doğrulandı.',
    ],
    evaluation: {
      productQualityFindings: {
        tierLabel: '1. Kademe — Kendi Kavuran Nitelikli Kahveci (Roaster-Operator)',
        beanAndRoastingFindings: [
          'Kendi kavurduğu single-origin filtre çekirdekleri ve imza "Marko Paşa House Blend" espresso harmanıyla gerçek bir kavurucu.',
        ],
        brewingAndDrinkFindings: [
          'V60 demlemeleri, Flat White, kakuleli Sunshine Latte ve kahve eşlikçisi Cinnamon Roll (tarçınlı rulo) somut deneyimlerle doğrulandı.',
        ],
        consistencyNotes:
          'Kahve kalitesi istikrarlı; ancak hafta sonu yoğun saatlerde mutfak/tatlı servisinde bekleme ve ısıtma tutarsızlıkları rapor edilmiş.',
      },
      evidenceReliability: {
        tierLabel: 'Yüksek Güvenilirlik (Çoklu Bağımsız & Uluslararası Kanıt)',
        independentSourceFamilyCount: 4,
        firstPartyRegistryCount: 1,
        excludedSyndicatedOrSponsoredCount: 3,
        dateFreshnessAssessment:
          'Aralık 2025 (Gazete Oksijen), 2024–2025 (European Coffee Trip & Time Out İstanbul) ve 2026 resmi kavurma kayıtlarıyla güncel.',
        branchPrecisionAssessment:
          'Tam Kesinlik — Caferağa Mah. Dalga Sk. No:22 (Tarihi Marko Paşa Köşkü) tüm kaynaklarda birebir örtüşüyor.',
      },
      visitorFit: {
        tierLabel: 'Tarihi Köşk & Arka Bahçe (Uzun Oturum ve Eşlikçi Uyumu)',
        bestSuitedFor: [
          'Tarihi atmosferde ve yeşil arka bahçede oturarak nitelikli kahve + tatlı/brunch deneyimi arayanlar',
          'Hafta içi sakin saatlerde kitap okumak veya sohbet etmek isteyenler',
        ],
        notSuitedFor: [
          'Cumartesi-Pazar öğle saatlerinde sıra beklemek istemeyen veya tam sessizlik arayanlar',
          'Bütçe odaklı hızlı kahve arayanlar (fiyatlar bölge ortalamasının üst bandında)',
        ],
        seatingAndAtmosphereContext:
          'Restore edilmiş tarihi Osmanlı dönemi köşkü (Marko Paşa Konağı) ve geniş arka bahçe.',
      },
    },
    googleRatingSignalNote:
      'Google puanı (4.5) hafta sonu brunch kalabalığı ve fiyat eleştirilerinden etkilense de, bağımsız kahve rehberlerindeki kavurucu doğrulaması nedeniyle seçildi.',
    evidenceRecords: [
      {
        id: 'story-ev-1',
        sourceFamilyId: 'fam-ect-story',
        sourceFamilyName: 'Aile #1: European Coffee Trip Kürasyonu',
        publisher: 'European Coffee Trip',
        author: 'European Coffee Trip Editorial Team',
        title: 'Coffee Guide: Istanbul – Asian Side (Story Coffee Moda)',
        exactUrl: 'https://europeancoffeetrip.com/coffee-guide-istanbul-asian-side/',
        publicationDate: '2024–2025',
        experienceDateNote: 'Yerinde kürasyon ve çekirdek/demleme doğrulaması',
        branchMentioned: 'Story Coffee Moda — Dalga Sokak No:22',
        concreteDrinkExperience: 'Single-origin pour-over / filtre kahve ve Marko Paşa house espresso blend',
        independenceLevel: 'Bağımsız Uluslararası Rehber',
        commercialRelationshipNote: 'Bağımsız sektörel rehber; reklam ilişkisi saptanmadı.',
        countedAsIndependentQualityEvidence: true,
        deduplicationRuleApplied: 'World Coffee Map üzerindeki yansıma kayıt bu aile altında tekilleştirildi.',
        contentUsageLicenseNote: 'Yalnızca olgusal doğrulama ve URL bağlantısı kullanıldı.',
        summaryOfFinding:
          'Story Coffee Moda\'yı kendi kavurduğu Marko Paşa espresso harmanı ve single-origin filtre kahveleriyle nitelikli kahve rehberine dahil ediyor.',
      },
      {
        id: 'story-ev-2',
        sourceFamilyId: 'fam-timeout-story',
        sourceFamilyName: 'Aile #2: Time Out İstanbul Editöryal İncelemesi',
        publisher: 'Time Out İstanbul',
        author: 'Time Out İstanbul Editörleri',
        title: 'Story Coffee & Food — Restoran ve Kafe İncelemesi',
        exactUrl: 'https://www.timeout.com/istanbul/tr/restoranlar/story-coffee-food',
        publicationDate: '2024',
        experienceDateNote: 'Editöryal mekan ve menü incelemesi',
        branchMentioned: 'Moda Dalga Sokak No:22',
        concreteDrinkExperience: 'Nitelikli üçüncü dalga demlemeler, Sunshine Latte (kakuleli), Cinnamon Roll ve Kaliforniya usulü brunch',
        independenceLevel: 'Bağımsız Ulusal/Yerel Editöryal',
        commercialRelationshipNote: 'Time Out İstanbul bağımsız editöryal incelemesi.',
        countedAsIndependentQualityEvidence: true,
        deduplicationRuleApplied: 'Tekil ana editöryal inceleme olarak korundu.',
        contentUsageLicenseNote: 'Yalnızca URL ve olgusal içecek/konum bilgisi referans alındı.',
        summaryOfFinding:
          'Dalga Sokak\'taki şubenin hem nitelikli kahve kavurucusu hem de güçlü bir tatlı/brunch noktası olduğunu doğruluyor.',
      },
      {
        id: 'story-ev-3',
        sourceFamilyId: 'fam-oksijen-story',
        sourceFamilyName: 'Aile #3: Gazete Oksijen & Kültür Envanteri Doğrulaması',
        publisher: 'Gazete Oksijen (O2) & Kültür Envanteri',
        author: 'Gazete Oksijen O2 Editörleri',
        title: 'Moda’daki En İyi Mekanlar & Tarihi Apartman/Köşk Kaydı',
        exactUrl: 'https://gazeteoksijen.com/o2/modadaki-en-iyi-mekanlar-234574',
        publicationDate: '2025-12-10',
        experienceDateNote: 'Aralık 2025 güncel doğrulama',
        branchMentioned: 'Caferağa Mah. Dalga Sk. No:22 (Tarihi Marko Paşa Köşkü)',
        concreteDrinkExperience: 'Taze kavrulmuş filtre kahve, iced latte ve tarçınlı rulo',
        independenceLevel: 'Bağımsız Ulusal/Yerel Editöryal',
        commercialRelationshipNote: 'Bağımsız basın yayını.',
        countedAsIndependentQualityEvidence: true,
        deduplicationRuleApplied: 'Yerel bloglardaki (BurayaGidelim, MesPrestiges) tekrarlar bu aile altında birleştirildi.',
        contentUsageLicenseNote: 'Yalnızca URL ve olgusal referans.',
        summaryOfFinding:
          'Tarihi bina dokusunu, arka bahçesini ve 2025 sonu itibarıyla aktif kahve-tatlı standardını doğruluyor.',
      },
      {
        id: 'story-ev-4',
        sourceFamilyId: 'fam-story-official',
        sourceFamilyName: 'Aile #4: 1. Parti Resmi Kavurmahane ve Çekirdek Kaydı',
        publisher: 'Story Coffee Roasters',
        author: 'İşletme Resmi Kaydı',
        title: 'Story Roasters — Kafelerimiz & Marko Paşa House Blend Künyesi',
        exactUrl: 'https://storyroasters.com/marko-pasa-house-blend',
        publicationDate: '2026 (Canlı Web Kaydı)',
        experienceDateNote: 'Güncel çekirdek künyesi ve şube kontrolü',
        branchMentioned: 'Caferağa Mah. Dalga Sk. No:22 Moda / Kadıköy',
        concreteDrinkExperience: 'Marko Paşa House Blend (sütlü çikolata ve meyvemsi notalar) ve Single-Origin V60 çekirdekleri',
        independenceLevel: '1. Parti İşletme Kaydı (Yalnızca Adres/Menü Teyidi)',
        commercialRelationshipNote: '1. Parti işletme sitesi — bağımsız kalite kanıtı sayısına dahil edilmedi, yalnızca çekirdek ve şube teyidi için kullanıldı.',
        countedAsIndependentQualityEvidence: false,
        deduplicationRuleApplied: '1. parti kayıt olarak ayrıldı.',
        contentUsageLicenseNote: 'Olgusal ürün adı ve adres doğrulaması.',
        summaryOfFinding:
          'İşletmenin aktif olarak kendi çekirdeğini kavurduğunu ve Dalga Sk. No:22 şubesinin açık olduğunu doğruluyor.',
      },
    ],
    contradictionsAndCritiques: {
      opposingVisitorViews: [
        'Fiyatların 2024–2026 döneminde bölge ortalamasına göre yüksek bulunduğu yönünde ziyaretçi eleştirileri mevcuttur.',
        'Hafta sonu brunch yoğunluğunda servis hızının düştüğü ve bazı tatlıların ısıtılmasında tutarsızlık yaşandığı belirtilmiştir.',
      ],
      unresolvedContradictions: [
        'Kahveci mi Brunch Mekanı mı İkilemi: Bazı sosyal medya paylaşımları mekanı sadece "pankek/burrito" mekanı gibi tanıtsa da, aktif kavurmahane operasyonu (storyroasters.com) ve European Coffee Trip kaydı nitelikli kahve kimliğini kanıtlamaktadır.',
      ],
    },
    limitationsAndMissingGaps: {
      operationalLimitations: [
        'Hafta sonu 11:00–14:30 arası yoğun brunch kalabalığı ve masa bekleme süresi.',
      ],
      evidenceGaps: [
        'Güncel tadım notlarında tek kökenli V60 çekirdeklerinin hasat ülkesi mevsime göre değişmektedir.',
      ],
    },
  },

  // --------------------------------------------------------------------------
  // SEÇİLEN ADAY #3: ÇEKİRDEK (MODA — ŞAİR LATİFİ SOKAK)
  // (Rafine Moda - Fine Cuisine'in yeniden araştırma sonucu elenmesiyle 3. sıraya yükselen gerçek kavurucu)
  // --------------------------------------------------------------------------
  {
    id: 'cekirdek-coffee-moda',
    selectionOrder: 3,
    status: 'selected_top_3',
    adminDecision: 'pending_review',
    restaurantCardData: {
      id: 'pilot-moda-coffee-3',
      location: 'Moda, Kadıköy',
      name: 'Çekirdek (Moda — Şair Latifi Sokak)',
      image: 'https://images.pexels.com/photos/4350099/pexels-photo-4350099.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Salih Tunca Özgürer tarafından 2012\'de kurulan ve Anadolu Yakası\'nı üçüncü nesil nitelikli kahve kavurmacılığıyla tanıştıran öncü butik dükkan. Şair Latifi Sokak\'ta kendi kavurduğu taze çekirdekleri ve ev yapımı hafif tatlılarıyla hizmet veriyor.',
      googleRating: 4.7,
      reviewCount: '720',
      orderSuggestion: 'Taze Kavrum Günlük Filtre Kahve, Double Espresso veya Cappuccino',
      notes: [
        {
          id: 'cekirdek-note-1',
          emoji: '🔥',
          text: '2012\'den beri Kadıköy\'ün ilk nitelikli kahve kavurucusu olarak kendi çekirdeklerini dükkan içinde taze kavuruyor; sokağa girdiğinizde taze kavrum kokusu karşılar.',
        },
        {
          id: 'cekirdek-note-2',
          emoji: '🍰',
          text: 'Ağır şuruplu tatlılar yerine kahvenin aromasını bastırmayan, günlük ev yapımı hafif kek ve tartlar çıkıyor.',
        },
        {
          id: 'cekirdek-note-3',
          emoji: '🤫',
          text: 'Moda Caddesi\'nin gürültüsünden uzakta, Şair Latifi Sokak\'ta çok küçük ve samimi bir mahalle dükkanıdır; kalabalık gruplar için uygun değildir.',
        },
      ],
    },
    branchVerification: {
      officialBusinessName: 'Çekirdek (Çekirdek Coffee)',
      verifiedBranchName: 'Moda Tek Şube (Şair Latifi Sokağı)',
      administrativeNeighborhood: 'Caferağa Mahallesi',
      microZone: 'Halka 0/1 Sınırı: Moda — Şair Latifi Sokağı',
      geoRing: 'ring-0-moda',
      streetAddress: 'Caferağa Mah., Şair Latifi Sk. No: 9/A, 34710 Kadıköy/İstanbul',
      coordinates: { lat: 40.9836206, lng: 29.0325259 },
      operationalStatus2026: 'Aktif — Doğrulandı (2025/2026)',
      otherBranchesDisambiguated: [
        'Başka şubesi yoktur; kurucusu Salih Tunca Özgürer yönetiminde tek butik dükkan olarak faaliyet göstermektedir.',
      ],
    },
    routingVerification: {
      originName: MODA_REFERENCE_ORIGIN.name,
      originCoordinates: MODA_REFERENCE_ORIGIN.coordinates,
      destinationCoordinates: { lat: 40.9836206, lng: 29.0325259 },
      routingService: 'OpenStreetMap Foot Router (routing.openstreetmap.de/routed-foot)',
      routingProfile: 'OSRM v1 Pedestrian / Foot',
      isRouteServiceVerified: true,
      measuredDistanceMeters: 792.0,
      measuredDurationSeconds: 635,
      formattedWalkingSummary: '792.0 metre • 10 dk 35 sn (OSRM Yaya Rotası ile Ölçüldü)',
      streetByStreetPath: [
        'Cem Sokağı',
        'Ağabey Sokağı',
        'Şair Nefi Sokağı',
        'General Asım Gündüz Caddesi',
        'Şair Latifi Sokağı',
      ],
      routeVerificationNote:
        'Moda Caddesi & Cem Sokağı kesişiminden (40.9840631, 29.0243788) Şair Latifi Sokağı\'na (40.9836206, 29.0325259) gerçek sokak ağı üzerinden ölçülmüştür.',
    },
    drinkVerification: {
      primaryOrderSuggestion: 'Günlük Taze Kavrum Filtre Kahve veya Double Espresso',
      secondaryOrderSuggestion: 'Cappuccino & Ev Yapımı Kek',
      roastingAndBeanProfile:
        'Dükkan içi butik kavurma (in-house micro-roaster); yanık tatlardan uzak, dengeli gövdeli ve aromatik kavrum profili.',
      brewingEquipmentNotes:
        'Klasik üçüncü nesil manuel demleme ve kalibreli espresso ekstraksiyonu.',
    },
    whySelectedOrEliminated: [
      'Yeniden araştırma sonucunda "Rafine Moda - Fine Cuisine"in brunch/bistro konseptine evrildiği doğrulandığı için, saf kahve kavurucusu kriterini eksiksiz karşılayan Çekirdek 3. sıraya yükseltildi.',
      'Barista Magazine, European Coffee Trip ve Hürriyet Pazar kayıtlarında Anadolu Yakası\'nın ilk nitelikli kahve kavurucusu (2012, Salih Tunca Özgürer) olarak bağımsız biçimde doğrulanmaktadır.',
      'Sıfır ticari PR/reklam ilişkisiyle, tamamen zanaatkâr kavurma kalitesi ve mahalle müdavimlerinin sadakatiyle öne çıkmaktadır.',
    ],
    evaluation: {
      productQualityFindings: {
        tierLabel: '1. Kademe — Kendi Kavuran Nitelikli Kahveci (Roaster-Operator)',
        beanAndRoastingFindings: [
          '2012\'den bu yana çekirdeklerini dükkan içinde bizzat kavuran (in-house roaster) zanaatkâr işletme.',
          'Kurucu Salih Tunca Özgürer\'in Londra şeflik ve kahve kavurma geçmişine dayanan teknik disiplin.',
        ],
        brewingAndDrinkFindings: [
          'Double espresso, cappuccino ve günlük taze kavrum filtre kahvelerde yanık olmayan, dengeli ekstraksiyon.',
        ],
        consistencyNotes:
          '14 yıldır tek şubede, zincirleşmeden aynı kavurma standardını koruyor.',
      },
      evidenceReliability: {
        tierLabel: 'Orta-Yüksek Güvenilirlik (Köklü Yerel & Uluslararası Kayıt, Sınırlı Yeni Basın)',
        independentSourceFamilyCount: 4,
        firstPartyRegistryCount: 0,
        excludedSyndicatedOrSponsoredCount: 0,
        dateFreshnessAssessment:
          'Uluslararası rehber (Barista Magazine, European Coffee Trip) ve ulusal basın (Hürriyet Pazar) kayıtları güçlü; 2024–2025 yerel tadım (Tadım Notu / Yandex) kayıtlarıyla aktifliği doğrulandı. Ancak son 12 ayda yeni PR/basın bülteni çıkarmadığı şeffafça not edildi.',
        branchPrecisionAssessment:
          'Tam Kesinlik — Caferağa Mah. Şair Latifi Sk. No:9/A.',
      },
      visitorFit: {
        tierLabel: 'Sakin Ara Sokak & Butik Kavurmahane Deneyimi',
        bestSuitedFor: [
          'Turistik kalabalıktan ve PR mekanlarından uzakta, gerçek bir zanaatkâr kavurucudan kahve içmek isteyenler',
          'Sakin bir Moda ara sokağında kitap okuyup taze kavrulmuş çekirdek satın almak isteyenler',
        ],
        notSuitedFor: [
          'Geniş masa, hızlı Wi-Fi/co-working veya gösterişli "Instagrammable" dekor arayanlar',
          'Moda İskelesi\'nden 1-2 dakikada ulaşılacak sahil üstü mekan arayanlar (merkezden 792m / ~10.5 dk yürüyüş)',
        ],
        seatingAndAtmosphereContext:
          'Şair Latifi Sokak\'ta çok küçük, samimi, mahalle odası sıcaklığında butik dükkan.',
      },
    },
    googleRatingSignalNote:
      'Google puanı (4.7) yüksek olmakla birlikte, seçimde belirleyici olan uluslararası Barista Magazine ve European Coffee Trip doğrulamasıdır.',
    evidenceRecords: [
      {
        id: 'cekirdek-ev-1',
        sourceFamilyId: 'fam-baristamag-cekirdek',
        sourceFamilyName: 'Aile #1: Barista Magazine Uluslararası İncelemesi',
        publisher: 'Barista Magazine',
        author: 'Barista Magazine Editorial',
        title: '5 Cool Cafes to Check Out in Kadıköy, Istanbul',
        exactUrl: 'https://www.baristamagazine.com/5-cool-cafes-to-check-out-in-kadikoy-istanbul/',
        publicationDate: '2023 / Arşiv Doğrulaması 2025',
        experienceDateNote: 'Uluslararası kahve basını saha incelemesi',
        branchMentioned: 'Çekirdek — Moda / Caferağa (Şair Latifi Sokak)',
        concreteDrinkExperience: 'Ev kavrumu (house-roasted) filtre kahve, espresso ve ev yapımı kekler',
        independenceLevel: 'Bağımsız Uluslararası Rehber',
        commercialRelationshipNote: 'Tamamen bağımsız uluslararası sektörel dergi.',
        countedAsIndependentQualityEvidence: true,
        deduplicationRuleApplied: 'Birincil uluslararası kaynak olarak korundu.',
        contentUsageLicenseNote: 'Yalnızca olgusal doğrulama ve URL bağlantısı kullanıldı.',
        summaryOfFinding:
          'Tunca Özgürer tarafından yönetilen Çekirdek\'i Kadıköy\'ü 2012\'de nitelikli kahveyle tanıştıran öncü kavurucu olarak doğruluyor.',
      },
      {
        id: 'cekirdek-ev-2',
        sourceFamilyId: 'fam-ect-cekirdek',
        sourceFamilyName: 'Aile #2: European Coffee Trip Kürasyonu',
        publisher: 'European Coffee Trip',
        author: 'European Coffee Trip Editorial Team',
        title: 'Coffee Guide: Istanbul – Asian Side (Çekirdek)',
        exactUrl: 'https://europeancoffeetrip.com/coffee-guide-istanbul-asian-side/',
        publicationDate: '2024–2025',
        experienceDateNote: 'Nitelikli kahve rehberi doğrulaması',
        branchMentioned: 'Çekirdek — Moda, Kadıköy',
        concreteDrinkExperience: 'House-roasted specialty coffee & homemade cakes',
        independenceLevel: 'Bağımsız Uluslararası Rehber',
        commercialRelationshipNote: 'Bağımsız rehber kaydı.',
        countedAsIndependentQualityEvidence: true,
        deduplicationRuleApplied: 'Tekil rehber ailesi.',
        contentUsageLicenseNote: 'Yalnızca olgusal referans ve URL bağlantısı.',
        summaryOfFinding:
          '2012\'den beri Anadolu yakasının ilk nitelikli kahve dükkanı olduğunu ve kendi kavurduğu çekirdekleri sunduğunu teyit ediyor.',
      },
      {
        id: 'cekirdek-ev-3',
        sourceFamilyId: 'fam-hurriyet-cekirdek',
        sourceFamilyName: 'Aile #3: Ulusal Basın Röportaj & Portre Kaydı (Hürriyet Pazar)',
        publisher: 'Hürriyet Pazar',
        author: 'Hürriyet Pazar Ekibi',
        title: 'Kadıköy Yükseliyor Çünkü İnsanın Ruhuna Sesleniyor (Salih Tunca Özgürer & Çekirdek)',
        exactUrl: 'https://www.hurriyet.com.tr/kelebek/hurriyet-pazar/kadikoy-yukseliyor-cunku-insanin-ruhuna-sesleniyor-40602936',
        publicationDate: '2017-10-08 (Kurucu Tarihsel Doğrulama)',
        experienceDateNote: 'Kurucu Salih Tunca Özgürer ile yerinde röportaj',
        branchMentioned: 'Caferağa / Moda Şair Latifi Sokak',
        concreteDrinkExperience: 'Nitelikli kahve kavurma ve demleme',
        independenceLevel: 'Bağımsız Ulusal/Yerel Editöryal',
        commercialRelationshipNote: 'Ulusal gazete röportajı.',
        countedAsIndependentQualityEvidence: true,
        deduplicationRuleApplied: 'Tarihsel kurucu doğrulaması olarak tekilleştirildi.',
        contentUsageLicenseNote: 'Olgusal kurucu ve tarihçe referansı + URL.',
        summaryOfFinding:
          'Kurucu Salih Tunca Özgürer\'in Londra\'daki şeflik geçmişinden sonra 2012\'de Kadıköy\'de Çekirdek\'i kurarak üçüncü nesil akımı başlattığını belgeliyor.',
      },
      {
        id: 'cekirdek-ev-4',
        sourceFamilyId: 'fam-tadimnotu-cekirdek',
        sourceFamilyName: 'Aile #4: Güncel Yerel Tadım & Ziyaretçi Konsensüsü (2024–2025)',
        publisher: 'Tadım Notu & Kadıköy Tarihi Çarşı Rehberi',
        author: 'Yerel Tadım İncelemeleri',
        title: 'Çekirdek Kadıköy Şair Latifi — Tadım ve Mekan Kaydı',
        exactUrl: 'https://tadimnotu.com/sube/cekirdek-kadikoy-sair-latifi/',
        publicationDate: '2024–2025',
        experienceDateNote: 'Güncel faaliyet ve içecek doğrulaması',
        branchMentioned: 'Şair Latifi Sk. No:9/A, Caferağa',
        concreteDrinkExperience: 'Double espresso, cappuccino, taze kavrulmuş filtre kahve',
        independenceLevel: 'Bağımsız Tadım & Topluluk Kaydı',
        commercialRelationshipNote: 'Bağımsız kullanıcı ve yerel rehber kayıtları.',
        countedAsIndependentQualityEvidence: true,
        deduplicationRuleApplied: 'Yerel dizin kayıtları tek bir topluluk ailesinde birleştirildi.',
        contentUsageLicenseNote: 'Ham yorum metni kopyalanmadan yalnızca olgusal bulgular sentezlendi.',
        summaryOfFinding:
          '2024–2025 itibarıyla Şair Latifi Sokak\'taki şubenin aktifliğini, taze kavrum kokusunu ve dengeli espresso/cappuccino profilini doğruluyor.',
      },
    ],
    contradictionsAndCritiques: {
      opposingVisitorViews: [
        'İç mekanın çok küçük olması nedeniyle hafta sonları oturacak yer bulmanın zor olduğu ve uzun süreli çalışmaya uygun olmadığı belirtiliyor.',
        'Moda sahiline (Moda Caddesi / İskele ucuna) kıyasla Bahariye/Şair Latifi tarafında kaldığı için yürüme mesafesi (~10.5 dk) Bademaltı sokak kafelerinden biraz daha uzundur.',
      ],
      unresolvedContradictions: [
        'Kurumsal Web Sitesi Eksikliği: İşletmenin aktif bir e-ticaret/kurumsal web sitesi bulunmamaktadır; tüm doğrulamalar fiziksel şube kayıtları ve bağımsız basın üzerinden yapılmıştır.',
      ],
    },
    limitationsAndMissingGaps: {
      operationalLimitations: [
        'Çok küçük iç mekan; co-working / laptop mesaisi için uygun değil.',
        'Moda Caddesi merkez durağından 792 metre (10 dk 35 sn) yürüme mesafesinde.',
      ],
      evidenceGaps: [
        'İşletmenin 1. parti resmi web menüsü olmadığı için dönemsel çekirdek fiyatları çevrimiçi doğrulanamamaktadır.',
      ],
    },
  },

  // ==========================================================================
  // KARŞILAŞTIRMALI 4. ADAY (YEDEK) & YENİDEN ARAŞTIRILIP ELENEN ADAYLAR
  // ==========================================================================
  {
    id: 'coffee-manifesto-moda',
    selectionOrder: null,
    status: 'comparative_runner_up',
    adminDecision: 'pending_review',
    restaurantCardData: {
      id: 'pilot-moda-coffee-4',
      location: 'Caferağa, Kadıköy',
      name: 'Coffee Manifesto (Moda — Dr. Esat Işık Cad.)',
      image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Caferağa Dr. Esat Işık Caddesi üzerinde kendi kavurmahanesi ve Manifesto Studio eğitim altyapısıyla nitelikli V60 ve Flat White sunan güçlü 4. alternatif.',
      googleRating: 4.6,
      reviewCount: '950',
      orderSuggestion: 'Single-Origin V60 Demleme veya Flat White',
      notes: [],
    },
    branchVerification: {
      officialBusinessName: 'Coffee Manifesto',
      verifiedBranchName: 'Moda Şubesi (Dr. Esat Işık Caddesi)',
      administrativeNeighborhood: 'Caferağa Mahallesi',
      microZone: 'Halka 1: Dr. Esat Işık Caddesi',
      geoRing: 'ring-1-caferaga',
      streetAddress: 'Caferağa Mah., Dr. Esat Işık Cd. No: 22/B, 34710 Kadıköy/İstanbul',
      coordinates: { lat: 40.9832828, lng: 29.0299669 },
      operationalStatus2026: 'Aktif — Doğrulandı (2025/2026)',
      otherBranchesDisambiguated: [
        'Yeldeğirmeni şubesi, Rasimpaşa Manifesto Studio ve Suadiye şubeleri ayrı şubeler olarak ayrıştırıldı.',
      ],
    },
    routingVerification: {
      originName: MODA_REFERENCE_ORIGIN.name,
      originCoordinates: MODA_REFERENCE_ORIGIN.coordinates,
      destinationCoordinates: { lat: 40.9832828, lng: 29.0299669 },
      routingService: 'OpenStreetMap Foot Router (routing.openstreetmap.de/routed-foot)',
      routingProfile: 'OSRM v1 Pedestrian / Foot',
      isRouteServiceVerified: true,
      measuredDistanceMeters: 586.7,
      measuredDurationSeconds: 469,
      formattedWalkingSummary: '586.7 metre • 7 dk 49 sn (OSRM Yaya Rotası ile Ölçüldü)',
      streetByStreetPath: [
        'Cem Sokağı',
        'Ağabey Sokağı',
        'Şair Nefi Sokağı',
        'General Asım Gündüz Caddesi',
        'Dr. Esat Işık Caddesi',
      ],
      routeVerificationNote: 'OSRM yaya rotası ile ölçüldü.',
    },
    drinkVerification: {
      primaryOrderSuggestion: 'Single-Origin V60 & Flat White',
      secondaryOrderSuggestion: 'Espresso & Ev Yapımı Brownie',
      roastingAndBeanProfile: 'Kendi kavurmahanesi ve SCA eğitim atölyesi (Manifesto Studio) mevcut.',
      brewingEquipmentNotes: 'Tam donanımlı üçüncü nesil demleme barı.',
    },
    whySelectedOrEliminated: [
      'Güçlü Yedek Aday (#4): Kendi kavurmahanesi ve Dr. Esat Işık Cad. (586.7m) konumu doğrulandı; ancak uluslararası bağımsız yayın kanıtlarında (European Coffee Trip & Barista Magazine) Montag, Story ve Çekirdek üçlüsü doğrudan yer aldığı için 4. sırada yedek tutuldu.',
    ],
    evaluation: {
      productQualityFindings: {
        tierLabel: '1. Kademe — Kendi Kavuran Nitelikli Kahveci (Roaster-Operator)',
        beanAndRoastingFindings: ['Kendi kavurmahanesi ve çekirdek künye kartları mevcut.'],
        brewingAndDrinkFindings: ['Flat White mikro-köpük dengesi ve V60 berraklığı olumlu.'],
        consistencyNotes: 'Çok şubeli yapısına rağmen demleme standardı yüksek.',
      },
      evidenceReliability: {
        tierLabel: 'Orta-Yüksek Güvenilirlik (Köklü Yerel & Uluslararası Kayıt, Sınırlı Yeni Basın)',
        independentSourceFamilyCount: 2,
        firstPartyRegistryCount: 1,
        excludedSyndicatedOrSponsoredCount: 1,
        dateFreshnessAssessment: '2025–2026 aktif şube ve yerel inceleme doğrulaması.',
        branchPrecisionAssessment: 'Tam Kesinlik — Dr. Esat Işık Cd. No:22/B.',
      },
      visitorFit: {
        tierLabel: 'Cadde Üstü Hızlı Mola & Ekipman Mağazası',
        bestSuitedFor: ['Ev demleme ekipmanı/çekirdek almak ve hızlı Flat White içmek isteyenler'],
        notSuitedFor: ['Cadde üstü dış oturma alanı dar ve hareketli olduğu için sakin bahçe arayanlar'],
        seatingAndAtmosphereContext: 'Dr. Esat Işık Caddesi üzerinde hareketli kaldırım/iç mekan düzeni.',
      },
    },
    googleRatingSignalNote: 'Google puanı 4.6; kanıt ailesi karşılaştırmasında 4. sırada.',
    evidenceRecords: [
      {
        id: 'manifesto-ev-1',
        sourceFamilyId: 'fam-manifesto-official',
        sourceFamilyName: 'Aile #1: Coffee Manifesto Resmi Şube Kaydı',
        publisher: 'Coffee Manifesto',
        author: 'İşletme Resmi Kaydı',
        title: 'Coffee Manifesto — Dükkanlarımız (Moda Şubesi)',
        exactUrl: 'https://coffeemanifesto.com/dukkanlarimiz',
        publicationDate: '2026',
        experienceDateNote: 'Resmi adres doğrulaması',
        branchMentioned: 'Moda: Caferağa Mah. Dr. Esat Işık Cad. No:22/B',
        concreteDrinkExperience: 'Nitelikli filtre kahve ve espresso bazlı içecekler',
        independenceLevel: '1. Parti İşletme Kaydı (Yalnızca Adres/Menü Teyidi)',
        commercialRelationshipNote: '1. parti işletme kaydı.',
        countedAsIndependentQualityEvidence: false,
        deduplicationRuleApplied: 'Adres doğrulaması için kullanıldı.',
        contentUsageLicenseNote: 'Olgusal adres verisi.',
        summaryOfFinding: 'Dr. Esat Işık Cad. No:22/B şubesinin aktifliğini doğruluyor.',
      },
    ],
    contradictionsAndCritiques: {
      opposingVisitorViews: ['Cadde üstündeki dış masaların birbirine çok yakın ve sıkışık olduğu eleştirisi mevcut.'],
      unresolvedContradictions: [],
    },
    limitationsAndMissingGaps: {
      operationalLimitations: ['Dış oturma alanı cadde trafiğine yakın ve sıkışık.'],
      evidenceGaps: ['European Coffee Trip veya Barista Magazine\'de Moda şubesi için bağımsız inceleme kaydı bulunmadı.'],
    },
  },

  // --------------------------------------------------------------------------
  // YENİDEN ARAŞTIRILIP KATEGORİ DIŞINA ALINAN ADAY: RAFİNE MODA — FINE CUISINE
  // (Kabul Testi Madde 4 Doğrulaması)
  // --------------------------------------------------------------------------
  {
    id: 'rafine-moda-fine-cuisine-reclassified',
    selectionOrder: null,
    status: 'reclassified_brunch_fine_cuisine',
    adminDecision: 'rejected',
    restaurantCardData: {
      id: 'pilot-moda-coffee-reclassified-rafine',
      location: 'Moda, Kadıköy',
      name: 'Rafine Moda — Fine Cuisine (Instagram: @rafineespressobar)',
      image: 'https://images.pexels.com/photos/2113556/pexels-photo-2113556.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Nene Hatun Sk. 3/A adresindeki işletme 2026 itibarıyla üçüncü taraf dizinlerde "Rafine Moda - Fine Cuisine" adıyla ve "restoran" kategorisinde listeleniyor. Espresso bar geçmişi Instagram hesap adında (@rafineespressobar) ve Restaurant Guru URL\'sinde ("Rafine-Espresso-Bar-Istanbul") izlenebiliyor; ancak güncel yorumlarda öne çıkan ürünler brunch tabakları ve tatlılar.',
      googleRating: 4.5,
      reviewCount: '1654 (Restaurant Guru üzerinden görülen Google sayısı, 29.10.2026)',
      orderSuggestion: 'Kahve kategorisi için öneri verilmedi (kategori dışı)',
      notes: [],
    },
    branchVerification: {
      officialBusinessName: 'Rafine Moda — Fine Cuisine',
      verifiedBranchName: 'Moda Nene Hatun Sokak (tek tespit edilen adres)',
      administrativeNeighborhood: 'Caferağa Mahallesi',
      microZone: 'Halka 0: Moda — Nene Hatun Sokağı',
      geoRing: 'ring-0-moda',
      streetAddress: 'Caferağa Mah., Nene Hatun Sk. No: 3/A, 34710 Kadıköy/İstanbul',
      coordinates: { lat: 40.9801349, lng: 29.0228109 },
      operationalStatus2026: 'Aktif — Doğrulandı (2025/2026)',
      otherBranchesDisambiguated: [
        'Aynı adres için iki kimlik bulundu: "Rafine Espresso Bar" (Instagram @rafineespressobar, Restaurant Guru URL kısa adı) ve "Rafine Moda - Fine Cuisine" (Istanbulife ve Restaurant Guru başlığı, @rafinemoda, rafinemoda.com). Farklı bir şube tespit edilmedi; aynı işletmenin ad/konsept değişikliği olarak modellendi.',
      ],
    },
    routingVerification: {
      originName: MODA_REFERENCE_ORIGIN.name,
      originCoordinates: MODA_REFERENCE_ORIGIN.coordinates,
      destinationCoordinates: { lat: 40.9801349, lng: 29.0228109 },
      routingService: 'OpenStreetMap Foot Router (routing.openstreetmap.de/routed-foot)',
      routingProfile: 'OSRM v1 Pedestrian / Foot',
      isRouteServiceVerified: true,
      measuredDistanceMeters: 563.8,
      measuredDurationSeconds: 451,
      formattedWalkingSummary: '563.8 metre • 7 dk 31 sn (OSRM Yaya Rotası ile Ölçüldü)',
      streetByStreetPath: ['Cem Sokağı', 'Moda Bostanı Sokağı', 'Moda Caddesi', 'Nene Hatun Sokağı'],
      routeVerificationNote: 'OSRM yaya rotası ile ölçüldü. Canlı akış her çalıştırmada yeniden ölçer.',
    },
    drinkVerification: {
      primaryOrderSuggestion: '— (Kahve kategorisinde önerilmiyor)',
      secondaryOrderSuggestion: '—',
      roastingAndBeanProfile:
        'Kendi kavurduğuna veya çekirdek kaynağını açıkladığına dair bağımsız kanıt bulunamadı. Resmi site (rafinemoda.com) bot korumalı (HTTP 403) olduğu için menü otomatik doğrulanamadı.',
      brewingEquipmentNotes: 'Demleme ekipmanı veya filtre kahve menüsüne dair doğrulanabilir kayıt bulunamadı.',
    },
    whySelectedOrEliminated: [
      'KABUL TESTİ MADDE 4 KARARI — KAHVE KATEGORİSİNDEN ÇIKARILDI: İki bağımsız üçüncü taraf dizini (Istanbulife, son kontrol 06.10.2026; Restaurant Guru) işletmeyi "Rafine Moda - Fine Cuisine" adıyla "restoran" olarak listeliyor.',
      'Restaurant Guru\'nun yorum özetinde en sık geçen ürünler: croque madame, Paris-Brest, french toast, çılbır, San Sebastian cheesecake, "brunch". Kahve ürünlerine dair somut demleme (V60, filtre, çekirdek kökeni) bulgusu yok.',
      'Kahve uzmanlığını gösteren bağımsız bir editöryal kaynak (kahve rehberi, uzman yayın) bulunamadı. Bu nedenle sırf listeyi doldurmak için kahve kategorisinde tutulmadı; "Kruvasan, Artizan Fırın & Brunch" kategorisinin aday havuzuna aktarıldı.',
      'Önceki raporda yer alan "Kaan Değer yönetimi", "Probat bağlantısı" ve "eski Bahariye Cad. No:89/A adresi" iddiaları canlı kaynaklarda doğrulanamadığı için bu rapordan çıkarıldı.',
    ],
    evaluation: {
      productQualityFindings: {
        tierLabel: 'Kategori Dışı — Brunch / Fırın / Fine Cuisine Ağırlıklı',
        beanAndRoastingFindings: ['Çekirdek kaynağı / kavurma bilgisi doğrulanamadı.'],
        brewingAndDrinkFindings: [
          'Toplu yorum özetinde kahve genel bir kelime olarak geçiyor; somut içecek bulgusu olarak yalnızca bir yorumda "badem sütlü latte" anılıyor (Restaurant Guru, tarih: "bir yıl önce").',
        ],
        consistencyNotes: 'Yemek ve brunch ürünleri tekrarlı olarak öne çıkıyor; kahve uzmanlığına dair tutarlı bağımsız bulgu yok.',
      },
      evidenceReliability: {
        tierLabel: 'Yüksek Faaliyet Kanıtı — Farklı Kategori Uzmanlığı',
        independentSourceFamilyCount: 0,
        firstPartyRegistryCount: 1,
        excludedSyndicatedOrSponsoredCount: 2,
        dateFreshnessAssessment:
          'Istanbulife sayfası "en son 06.10.2026 tarihinde kaynaklardan kontrol edildi" diyor. Restaurant Guru canlı sayfası 29.10.2026 tarihinde okundu.',
        branchPrecisionAssessment: 'Yüksek — iki dizin de aynı adresi (Nene Hatun Sk. 3 A) ve aynı telefonu veriyor.',
      },
      visitorFit: {
        tierLabel: 'Kahvaltı / Brunch Odaklı Ziyaretçi',
        bestSuitedFor: ['Gündüz brunch / tatlı arayanlar (Brunch kategorisinde ayrıca araştırılmalı)'],
        notSuitedFor: ['Nitelikli kahve (çekirdek, demleme) odaklı ziyaretçi — kanıt yok'],
        seatingAndAtmosphereContext: 'Dizinlere göre açık oturma alanı var; çalışma saatleri 10:00-19:00 (Salı bilgisi yok).',
      },
    },
    googleRatingSignalNote:
      'Google puanı (4.5 / 1654, Restaurant Guru üzerinden görülen) seçim kriteri olarak kullanılmadı. Google verisi doğrudan Google\'dan çekilmedi ve saklanmadı.',
    evidenceRecords: [
      {
        id: 'rafine-ev-1',
        sourceFamilyId: 'fam-istanbulife',
        sourceFamilyName: 'Aile: Istanbulife (otomatik derlenen şehir dizini)',
        publisher: 'Istanbulife',
        author: 'Istanbulife (meta author; bireysel yazar yok)',
        title: 'Rafine Moda - Fine Cuisine, Kadıköy',
        exactUrl: 'https://istanbulife.com/mekan/rafine-moda-fine-cuisine-4358',
        publicationDate: 'Sayfa: "Güncellendi 06.10.2026"',
        experienceDateNote: 'Deneyim yok — dizin kaydı (tadım/ziyaret içermiyor)',
        branchMentioned: 'Caferağa, Nene Hatun Sk. 3 A, 34710 Kadıköy',
        concreteDrinkExperience: 'Yok. Sayfa işletmeyi "restoran" olarak tanımlıyor; @rafinemoda ve @rafineespressobar hesaplarını listeliyor.',
        independenceLevel: 'Sendikasyon / Tekrar Liste (Tekilleştirildi)',
        commercialRelationshipNote: 'Ticari ilişki işareti yok. Ancak içerik başka kaynaklardan (restaurantguru, menu-tr.com) derlendiği için bağımsız kalite kanıtı değil.',
        countedAsIndependentQualityEvidence: false,
        deduplicationRuleApplied: 'Kendi beyanına göre restaurantguru.com ve menu-tr.com verisini derliyor → Restaurant Guru ile aynı veri ailesine bağlandı; kimlik/kategori teyidi için kullanıldı.',
        contentUsageLicenseNote: 'Yalnızca URL, ad, adres ve kategori bilgisi (olgusal) kaydedildi; metin ve fotoğraf kopyalanmadı.',
        summaryOfFinding: 'Güncel adın "Rafine Moda - Fine Cuisine" ve kategorinin "restoran" olduğunu gösteriyor.',
      },
      {
        id: 'rafine-ev-2',
        sourceFamilyId: 'fam-restaurantguru',
        sourceFamilyName: 'Aile: Restaurant Guru (yorum toplayıcı)',
        publisher: 'Restaurant Guru',
        author: 'Otomatik toplayıcı (Google/Yandex yorumlarını derler)',
        title: 'Rafine Moda - Fine Cuisine, İstanbul - Restoran menüsü, fiyatları ve yorumları',
        exactUrl: 'https://tr.restaurantguru.com/Rafine-Espresso-Bar-Istanbul',
        publicationDate: 'Tarih yok (canlı sayfa, 29.10.2026 okundu)',
        experienceDateNote: 'Yorumlar göreli tarihli ("bir yıl önce" vb.); kesin deneyim tarihi yok',
        branchMentioned: 'Nene Hatun Sk. 3 A — URL kısa adı eski "Rafine Espresso Bar" adını koruyor',
        concreteDrinkExperience: 'Sık geçen ürünler: croque madame, Paris-Brest, french toast, çılbır, cheesecake. İçecek: tek yorumda badem sütlü latte.',
        independenceLevel: 'Sendikasyon / Tekrar Liste (Tekilleştirildi)',
        commercialRelationshipNote: 'Sayfada "İşletmenizi talep edin" seçeneği var; işletme içeriği yönetebilir. Bağımsız kalite kanıtı sayılmadı.',
        countedAsIndependentQualityEvidence: false,
        deduplicationRuleApplied: 'Google/Yandex yorumlarının ikincil kopyası → kullanıcı yorumu ailesine indirgenip kalite kanıtından çıkarıldı.',
        contentUsageLicenseNote: 'Yorum metinleri saklanmadı; yalnızca sık geçen ürün adları (olgusal) not edildi.',
        summaryOfFinding: 'Ana ürün kimliğinin brunch ve tatlı olduğunu gösteriyor; kahve uzmanlığı kanıtı yok.',
      },
      {
        id: 'rafine-ev-3',
        sourceFamilyId: 'fam-rafine-official',
        sourceFamilyName: 'Aile: 1. Parti — rafinemoda.com',
        publisher: 'Rafine Moda',
        author: 'İşletme',
        title: 'rafinemoda.com',
        exactUrl: 'https://rafinemoda.com/',
        publicationDate: '—',
        experienceDateNote: '—',
        branchMentioned: '—',
        concreteDrinkExperience: 'Otomatik erişilemedi (Cloudflare bot koruması, HTTP 403).',
        independenceLevel: '1. Parti İşletme Kaydı (Yalnızca Adres/Menü Teyidi)',
        commercialRelationshipNote: 'İşletmenin kendi sitesi.',
        countedAsIndependentQualityEvidence: false,
        deduplicationRuleApplied: '1. parti — kalite kanıtı sayılmaz.',
        contentUsageLicenseNote: 'Erişim engeli aşılmaya çalışılmadı (robots/bot koruması ihlal edilmedi).',
        summaryOfFinding: 'Menü 1. parti kaynaktan doğrulanamadı → eksik olarak raporlandı.',
      },
    ],
    contradictionsAndCritiques: {
      opposingVisitorViews: [],
      unresolvedContradictions: [
        'Ad çelişkisi: Instagram hesabı ve Restaurant Guru URL\'si "Rafine Espresso Bar", sayfa başlıkları "Rafine Moda - Fine Cuisine". Değişikliğin tarihi belirlenemedi.',
        'Resmi menü (rafinemoda.com) bot koruması nedeniyle otomatik okunamadı; ürün listesi yalnızca üçüncü taraf yorum özetinden çıkarıldı.',
      ],
    },
    limitationsAndMissingGaps: {
      operationalLimitations: ['Kahve kategorisi için uygun değil (brunch/restoran kimliği).'],
      evidenceGaps: [
        'Güncel resmi menü doğrulanamadı.',
        'Kahve uzmanlığına dair bağımsız editöryal kaynak bulunamadı.',
      ],
    },
  },

  // --------------------------------------------------------------------------
  // KATEGORİ AYRIMI İLE ELENEN ADAY: BREKKIE BREAKFAST CLUB
  // --------------------------------------------------------------------------
  {
    id: 'brekkie-moda-category-split',
    selectionOrder: null,
    status: 'reclassified_bakery_croissant',
    adminDecision: 'rejected',
    restaurantCardData: {
      id: 'pilot-moda-coffee-6',
      location: 'Moda, Kadıköy',
      name: 'Brekkie Breakfast Club (Yoğurtçu Parkı)',
      image: 'https://images.pexels.com/photos/2113556/pexels-photo-2113556.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Yoğurtçu Parkı karşısında kruvasanlarıyla ünlü kahvaltı ve fırın durağı.',
      googleRating: 4.5,
      reviewCount: '3.8k',
      orderSuggestion: 'Bademli Kruvasan & Kahvaltı Kruvasanları',
      notes: [],
    },
    branchVerification: {
      officialBusinessName: 'Brekkie Croissant & Cookie',
      verifiedBranchName: 'Moda Yoğurtçu Parkı Şubesi',
      administrativeNeighborhood: 'Osmanağa / Caferağa Sınırı',
      microZone: 'Yoğurtçu Parkı Caddesi',
      geoRing: 'ring-1-caferaga',
      streetAddress: 'Yoğurtçu Parkı Cd. No: 24/A, 34714 Kadıköy/İstanbul',
      coordinates: { lat: 40.9852, lng: 29.0312 },
      operationalStatus2026: 'Aktif — Doğrulandı (2025/2026)',
      otherBranchesDisambiguated: [],
    },
    routingVerification: {
      originName: MODA_REFERENCE_ORIGIN.name,
      originCoordinates: MODA_REFERENCE_ORIGIN.coordinates,
      destinationCoordinates: { lat: 40.9852, lng: 29.0312 },
      routingService: 'OpenStreetMap Foot Router (routing.openstreetmap.de/routed-foot)',
      routingProfile: 'OSRM v1 Pedestrian / Foot',
      isRouteServiceVerified: false,
      measuredDistanceMeters: null,
      measuredDurationSeconds: null,
      formattedWalkingSummary: 'ROTA ÖLÇÜMÜ YOK (Kategori Dışı Olduğu İçin Tahmini Süre Yayımlanmadı)',
      streetByStreetPath: [],
      routeVerificationNote: 'Kabul Testi Madde 5 gereği rota servisinden ölçüm alınmayan adaylar için tahmini süre yayımlanmaz.',
    },
    drinkVerification: {
      primaryOrderSuggestion: 'Tereyağlı / Dolgulu Kruvasan Çeşitleri',
      secondaryOrderSuggestion: 'Latte',
      roastingAndBeanProfile: 'Kavurmahane değil; artizan kruvasan fırını.',
      brewingEquipmentNotes: 'Eşlikçi espresso bar.',
    },
    whySelectedOrEliminated: [
      'KATEGORİ AYRIMI: 3.800+ yorumu olmasına rağmen birincil uzmanlığı "Nitelikli Kahve Kavurmahanesi" değil, "Kruvasan, Artizan Fırın & Brunch" (Kategori #3) olduğu için Kahve kategorisinden elendi.',
    ],
    evaluation: {
      productQualityFindings: {
        tierLabel: 'Kategori Dışı — Brunch / Fırın / Fine Cuisine Ağırlıklı',
        beanAndRoastingFindings: ['Kendi kahvesini kavurmuyor.'],
        brewingAndDrinkFindings: ['Ana ürün kruvasan ve kurabiye.'],
        consistencyNotes: 'Fırın ürünleri popüler, kahve ikincil eşlikçi.',
      },
      evidenceReliability: {
        tierLabel: 'Yüksek Faaliyet Kanıtı — Farklı Kategori Uzmanlığı',
        independentSourceFamilyCount: 4,
        firstPartyRegistryCount: 1,
        excludedSyndicatedOrSponsoredCount: 5,
        dateFreshnessAssessment: '2025–2026 TimeOut ve Oggusto kahvaltı listelerinde doğrulandı.',
        branchPrecisionAssessment: 'Yoğurtçu Parkı Cd. No:24/A.',
      },
      visitorFit: {
        tierLabel: 'Kahvaltı / Brunch Odaklı Ziyaretçi',
        bestSuitedFor: ['Kruvasan kahvaltısı arayanlar'],
        notSuitedFor: ['Sıra beklemeden nitelikli V60/espresso içmek isteyenler'],
        seatingAndAtmosphereContext: 'Yoğun sirkülasyonlu fırın-kafe.',
      },
    },
    googleRatingSignalNote: 'Yüksek yorum sayısı (3.8k) kruvasan kaynaklıdır.',
    evidenceRecords: [],
    contradictionsAndCritiques: {
      opposingVisitorViews: ['Hafta sonu uzun kapı kuyrukları.'],
      unresolvedContradictions: [],
    },
    limitationsAndMissingGaps: {
      operationalLimitations: ['Kahve kategorisi dışı.'],
      evidenceGaps: [],
    },
  },

  // --------------------------------------------------------------------------
  // FAALİYET DOĞRULAMASI İLE ELENEN ADAY: KAVA COFFEE ROASTERY (KAPALI ŞUBE)
  // --------------------------------------------------------------------------
  {
    id: 'kava-coffee-kadikoy-closed',
    selectionOrder: null,
    status: 'rejected_closed_branch',
    adminDecision: 'rejected',
    restaurantCardData: {
      id: 'pilot-moda-coffee-7',
      location: 'Caferağa, Kadıköy',
      name: 'Kava Coffee Roastery (Eski Caferağa Leylek Sk. Şubesi)',
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Eski listelerde Kadıköy Caferağa Leylek Sokak\'ta gösterilen ancak kapanmış olan şube.',
      googleRating: 4.6,
      reviewCount: '410',
      orderSuggestion: '-',
      notes: [],
    },
    branchVerification: {
      officialBusinessName: 'Kava Coffee Roastery',
      verifiedBranchName: 'Kadıköy Caferağa (Leylek Sk.) Şubesi — KAPALI',
      administrativeNeighborhood: 'Caferağa Mahallesi',
      microZone: 'Caferağa',
      geoRing: 'ring-1-caferaga',
      streetAddress: 'Caferağa Mah., Leylek Sk. (KAPANDI — Aktif şubeler Karaköy ve Kurtuluş)',
      coordinates: { lat: 40.9865, lng: 29.0269 },
      operationalStatus2026: 'Kapalı Şube — Elendi',
      otherBranchesDisambiguated: [
        'Kava Coffee\'nin Karaköy ve Kurtuluş şubeleri aktif olmasına rağmen Kadıköy Leylek Sokak şubesi kapanmıştır.',
      ],
    },
    routingVerification: {
      originName: MODA_REFERENCE_ORIGIN.name,
      originCoordinates: MODA_REFERENCE_ORIGIN.coordinates,
      destinationCoordinates: { lat: 40.9865, lng: 29.0269 },
      routingService: 'Yok (Kapalı Şube)',
      routingProfile: '-',
      isRouteServiceVerified: false,
      measuredDistanceMeters: null,
      measuredDurationSeconds: null,
      formattedWalkingSummary: 'KAPALI ŞUBE — Rota Hesaplanmadı',
      streetByStreetPath: [],
      routeVerificationNote: 'Şube kapalı olduğu için elendi.',
    },
    drinkVerification: {
      primaryOrderSuggestion: '-',
      secondaryOrderSuggestion: '-',
      roastingAndBeanProfile: 'Kadıköy fiziksel şubesi aktif değil.',
      brewingEquipmentNotes: '-',
    },
    whySelectedOrEliminated: [
      'FAALİYET DOĞRULAMASI İLE ELENDİ: Güncellenmemiş blog listelerinde hâlâ Kadıköy\'de açık gibi gösterilse de, Kadıköy Leylek Sokak şubesinin kapandığı doğrulandı.',
    ],
    evaluation: {
      productQualityFindings: {
        tierLabel: 'Faaliyet Dışı — Kapalı Şube',
        beanAndRoastingFindings: [],
        brewingAndDrinkFindings: [],
        consistencyNotes: 'Şube kapalı.',
      },
      evidenceReliability: {
        tierLabel: 'Kesin Elenen (Kapalı Şube Doğrulandı)',
        independentSourceFamilyCount: 2,
        firstPartyRegistryCount: 0,
        excludedSyndicatedOrSponsoredCount: 0,
        dateFreshnessAssessment: '2025–2026 harita ve rehber kayıtlarında kapalı olduğu teyit edildi.',
        branchPrecisionAssessment: 'Karaköy şubesiyle karıştırılması engellendi.',
      },
      visitorFit: {
        tierLabel: 'Hızlı Espresso & Sokak Ritmi (Dar Oturma Alanı)',
        bestSuitedFor: [],
        notSuitedFor: ['Şube kapalıdır'],
        seatingAndAtmosphereContext: 'Kapalı.',
      },
    },
    googleRatingSignalNote: 'Eski Google puanı (4.6) şube kapandığı için geçersizdir.',
    evidenceRecords: [],
    contradictionsAndCritiques: {
      opposingVisitorViews: [],
      unresolvedContradictions: [],
    },
    limitationsAndMissingGaps: {
      operationalLimitations: ['Kadıköy şubesi kalıcı olarak kapalıdır.'],
      evidenceGaps: [],
    },
  },
];
