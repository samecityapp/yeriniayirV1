export interface VisitorExperience {
  id: string;
  emoji: string;
  text: string;
  source: string;
  verified: boolean;
}

export interface LabVenue {
  id: string;
  name: string;
  category: string;
  isMustTry?: boolean;
  neighborhood: string;
  distanceText: string;
  image: string;
  editorialDescription: string;
  signatureDish: string;
  signatureDishDetail: string;
  whyGo: string[];
  knowBeforeYouGo: string[];
  verifiedRating: number | null;
  reviewCount: number | null;
  ratingSource?: string;
  isDemo: boolean;
  priceTier: '₺' | '₺₺' | '₺₺₺' | '₺₺₺₺';
  bestTime: string;
  localHeritageNote: string;
  mapPosition: {
    x: number; // percentage 10-90 for interactive map canvas
    y: number; // percentage 15-85 for interactive map canvas
    lat: number;
    lng: number;
  };
  visitorExperiences: VisitorExperience[];
}

export interface RegionFoodGuide {
  id: 'kadikoy' | 'gaziantep' | 'bodrum' | 'sapanca';
  name: string;
  cityLabel: string;
  tagline: string;
  culturalIntro: string;
  hasDateCategory: boolean;
  dateCategoryReason: string;
  categories: string[]; // Strictly max 7 categories, index 0 is ALWAYS "Mutlaka Denenmesi Gerekenler"
  venues: LabVenue[];
}

export interface DesignMeta {
  number: number;
  id: string;
  name: string;
  shortName: string;
  badge: string;
  philosophy: string;
  colorDirection: string;
  bestFor: string;
}

export const DESIGN_VARIATIONS: DesignMeta[] = [
  {
    number: 1,
    id: 'design-1',
    name: 'Mevcut Tasarım',
    shortName: 'Mevcut',
    badge: 'Referans Baz',
    philosophy: 'Bugün yayında olan görünümün birebir referans kopyası. Mavi aktif kategori hapları, 3 sütunlu beyaz gölgeli kartlar ve standart detay penceresi.',
    colorDirection: 'Mavi - Beyaz (Mevcut)',
    bestFor: 'Mevcut alışkanlığı koruma ve diğer 9 alternatif için temel kıyaslama noktası.'
  },
  {
    number: 2,
    id: 'design-2',
    name: 'Mevcut Tasarım 2.0',
    shortName: 'Mevcut 2.0',
    badge: 'Evrimsel İyileştirme',
    philosophy: 'Sevilen mavi-beyaz Yerini Ayır karakterini koruyarak tipografi, boşluk, fotoğraf üstü mahalle rozeti, imza yemek önizlemesi ve kart hiyerarşisini rafine eder.',
    colorDirection: 'Safir Mavi - Buz Beyazı',
    bestFor: 'Mevcut kimliği kaybetmeden anında daha premium ve okunaklı bir deneyim sunmak.'
  },
  {
    number: 3,
    id: 'design-3',
    name: 'Premium Editorial',
    shortName: 'Editorial',
    badge: 'Michelin & Dergi',
    philosophy: 'Michelin Guide ve seçkin seyahat dergileri kalitesinde minimalist gastronomi düzeni. Numaralı seçki, sıcak kağıt dokusu ve editoryal başlıklar.',
    colorDirection: 'Fildişi Kağıt - Antrasit - Bordo Vurgu',
    bestFor: 'Kuratoryal güveni, seçkinliği ve gastronomi otoritesini en üst düzeye çıkarmak.'
  },
  {
    number: 4,
    id: 'design-4',
    name: 'Büyük Görselli Kartlar',
    shortName: 'Büyük Görsel',
    badge: 'Görsel Hiyerarşi',
    philosophy: 'Fotoğrafların başrolde olduğu sinematik kartlar. Koyu degrade katman üzerinde cam (glassmorphism) konum rozeti, imza tabak etiketi ve güçlü tipografi.',
    colorDirection: 'Sinematik Koyu Kontrast & Mavi Işıltı',
    bestFor: 'Yemek ve mekan atmosferiyle ilk saniyede iştah ve keşif heyecanı uyandırmak.'
  },
  {
    number: 5,
    id: 'design-5',
    name: 'Kompakt Liste',
    shortName: 'Kompakt Liste',
    badge: 'Yüksek Yoğunluk',
    philosophy: 'Daha az kaydırma ile daha fazla işletmeyi aynı anda gösteren modern çift sütunlu liste. Mobilde ve masaüstünde hızlı tarama (scanning) için ideal.',
    colorDirection: 'Temiz Beyaz - Arduvaz - Mavi Aksan',
    bestFor: 'Karşılaştırma hızını artırmak ve tek ekranda 6+ işletmeyi zahmetsizce incelemek.'
  },
  {
    number: 6,
    id: 'design-6',
    name: 'Harita + Kartlar',
    shortName: 'Harita + Kart',
    badge: 'Konum Keşfi',
    philosophy: 'İnteraktif bölge haritası ve restoran kartlarını yan yana (mobilde üst-alt) sunar. Kart seçildiğinde haritadaki konum pini ve mesafe halkası canlanır.',
    colorDirection: 'Mavi - Beyaz - Harita Kobaltı',
    bestFor: 'Otele veya merkeze göre yürüme/sürüş mesafesini görerek rota planlamak isteyen gezginler.'
  },
  {
    number: 7,
    id: 'design-7',
    name: 'Ne Yemeli Odaklı',
    shortName: 'Ne Yemeli',
    badge: 'Tabak Başrolde',
    philosophy: 'İşletme adından önce "Ne Sipariş Etmeli?" sorusuna yanıt verir. Kartın ana başlığı özel yiyecek/içecektir; işletme ise o lezzetin ustası olarak konumlanır.',
    colorDirection: 'Sıcak Kehribar & Mavi-Beyaz Dengesi',
    bestFor: '"Bugün canım ne çekiyor?" sorusuyla hareket eden lezzet odaklı kullanıcılar.'
  },
  {
    number: 8,
    id: 'design-8',
    name: 'Yerel Hikâye',
    shortName: 'Yerel Hikâye',
    badge: 'Kültürel Anlatı',
    philosophy: 'Bölgenin gastronomik mirasını anlatan bir giriş manifestosu ve her işletmenin mahalle kültüründeki yerini aktaran hikâye kartlarıyla yerel bağ kurar.',
    colorDirection: 'Toprak & Zeytin Tonları / Sıcak Krem',
    bestFor: 'Gaziantep, Kadıköy veya Bodrum gibi güçlü mutfak kültürü olan bölgelerde hikâye anlatımı.'
  },
  {
    number: 9,
    id: 'design-9',
    name: 'Minimal & Elegant',
    shortName: 'Minimal',
    badge: 'Tipografi Odaklı',
    philosophy: 'İsviçre tasarım disipliniyle kurgulanmış ultra temiz çizgiler, geniş negatif alanlar, yapılandırılmış bilgi satırları ve sofistike tipografik hiyerarşi.',
    colorDirection: 'Monokrom Beyaz - Gece Mavisi İnce Çizgi',
    bestFor: 'Gürültüsüz, zamansız ve üst segment butik otel sayfasıyla kusursuz uyum arayanlar.'
  },
  {
    number: 10,
    id: 'design-10',
    name: 'Mobile First',
    shortName: 'Mobile First',
    badge: 'Başparmak Ergonomisi',
    philosophy: 'Telefon kullanımını önceliklendiren yatay kaydırmalı kategori barı, hızlı özet rozetleri, dokunmatik dostu aksiyon alanı ve masaüstünde modern bento uyumu.',
    colorDirection: 'Canlı Yerini Ayır Mavisi & Modern Kartlar',
    bestFor: 'Tatil sırasında yürürken veya otelde telefondan hızlıca karar veren mobil kullanıcı kitlesi.'
  }
];

export const REGION_FOOD_GUIDES: Record<RegionFoodGuide['id'], RegionFoodGuide> = {
  kadikoy: {
    id: 'kadikoy',
    name: 'Kadıköy, İstanbul',
    cityLabel: 'Kadıköy',
    tagline: 'Moda sokaklarından Çarşı esnafına, üçüncü nesil kahveden odun ateşi pizzaya yaşayan gastronomi sahnesi.',
    culturalIntro:
      'Kadıköy mutfağı; sabah Moda sahilinde ekşi mayalı kruvasan ve nitelikli filtre kahveyle başlayan, öğlen tarihi çarşıda veya Yeldeğirmeni sokaklarında zanaatkâr hamburger ve Napoli pizzasıyla devam eden, akşam ise loş ışıklı bistro ve şef masalarında romantik bir buluşmaya dönüşen çok katmanlı bir ritme sahiptir.',
    hasDateCategory: true,
    dateCategoryReason: 'Kadıköy / Moda hattında ambiyansı, ışıklandırması ve menüsü özel akşam buluşmalarına (Date) gerçekten uygun seçkin işletmeler bulunduğu için bu kategori aktif gösterilir.',
    categories: [
      'Mutlaka Denenmesi Gerekenler',
      'Nitelikli Kahve',
      'Gurme Hamburger',
      'Odun Ateşi Pizza',
      'Uzun Kahvaltı',
      'Date & Akşam Yemeği',
      'Tatlı & Üçüncü Nesil Fırın'
    ],
    venues: [
      {
        id: 'kd-1',
        name: 'Çiya Sofrası',
        category: 'Mutlaka Denenmesi Gerekenler',
        isMustTry: true,
        neighborhood: 'Caferağa · Kadıköy Çarşı',
        distanceText: 'Çarşı Merkez · 4 dk yürüyüş',
        image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Anadolu ve Mezopotamya coğrafyasının unutulmaya yüz tutmuş reçetelerini mevsimsel olarak yaşatan, uluslararası gastronomi literatürüne girmiş efsanevi durak.',
        signatureDish: 'Kuzu Etli Şiveydiz & Ekşili Kuru Dolma',
        signatureDishDetail: 'Taze sarımsak, nohut ve süzme yoğurtla terbiye edilen Gaziantep usulü Şiveydiz ile sumaklı kuru patlıcan dolması birlikte denenmeli.',
        whyGo: [
          'Her gün değişen tencere yemekleriyle Anadolu mutfak arkeolojisini tek masada deneyimleme fırsatı sunar.',
          'Şef Musa Dağdeviren’in yıllara yayılan yerel malzeme araştırmaları sayesinde standart lokanta menülerinde bulamayacağınız yemekler çıkar.',
          'Yabancı misafirler veya ilk kez Kadıköy’e gelenler için tartışmasız bir gastronomi referansıdır.'
        ],
        knowBeforeYouGo: [
          'Öğle saatlerinde (12:30 - 14:30) kapıda sıra olabilir; 12:00 öncesi veya 15:00 sonrası daha sakindir.',
          'Zeytinyağlı ve meze tepsisinden azar azar tadım tabağı oluşturabilirsiniz.',
          'Tatlı olarak kireçte kabak veya taş kadayıf için mutlaka yer bırakın.'
        ],
        verifiedRating: 4.6,
        reviewCount: 6420,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺₺',
        bestTime: 'Öğle 12:00 - 15:30',
        localHeritageNote: '1998’den bu yana Kadıköy Balıkçılar Çarşısı’nın kalbinde kaybolan yerel yemek kültürünün hafızasını tutuyor.',
        mapPosition: { x: 28, y: 42, lat: 40.9894, lng: 29.0262 },
        visitorExperiences: [
          {
            id: 'kd-1-v1',
            emoji: '🍲',
            text: 'Menüye bakmak yerine tezgâhtaki tencere yemeklerini görerek seçmek en doğru yöntem; her gelişimde farklı bir yöre yemeğine denk geliyorum.',
            source: 'Kadıköy Müdavim Notu',
            verified: true
          },
          {
            id: 'kd-1-v2',
            emoji: '🌿',
            text: 'Kireçte bekletilmiş çıtır kabak tatlısı tahin ve cevizle servis ediliyor; yemek üstüne mutlaka paylaşılmalı.',
            source: 'Gurme Rehber İncelemesi',
            verified: true
          }
        ]
      },
      {
        id: 'kd-2',
        name: 'Montag Coffee Roasters',
        category: 'Nitelikli Kahve',
        isMustTry: true,
        neighborhood: 'Moda · Saint Joseph Hattı',
        distanceText: 'Moda Caddesi · 6 dk yürüyüş',
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Kadıköy’de üçüncü nesil kahve kültürünün öncülerinden; kendi kavurduğu tek kökenli çekirdekleri ve tutarlı V60 demlemeleriyle kahve tutkunlarının buluşma noktası.',
        signatureDish: 'Etiyopya V60 Demleme & Bademli Kruvasan',
        signatureDishDetail: 'Çiçeksi ve bergamot notalı Etiyopya çekirdeğiyle hazırlanan el demlemesi kahve veya soğuk günlerde yoğun kıvamlı Cortado.',
        whyGo: [
          'Kendi kavurmahanesinden çıkan taze çekirdeklerle her fincanda aynı yüksek standardı yakalar.',
          'Moda’nın mahalle ruhunu en doğal haliyle hissedebileceğiniz samimi kaldırım önü oturma düzenine sahiptir.',
          'Evde demleme yapanlar için baristalar çekirdek seçimi ve öğütüm derecesi konusunda çok ilgili.'
        ],
        knowBeforeYouGo: [
          'Hafta sonu öğleden sonraları oturacak yer bulmak zorlaşabilir; al-götür (takeaway) yapıp Moda sahiline yürümek harika bir alternatiftir.',
          'Bilgisayarla uzun çalışma için hafta içi sabah saatleri (09:00 - 11:30) çok daha uygundur.',
          'Yulaf sütü alternatifi tüm espresso bazlı içeceklerde mevcuttur.'
        ],
        verifiedRating: 4.7,
        reviewCount: 1840,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺',
        bestTime: 'Sabah 09:30 - 12:00',
        localHeritageNote: 'Moda’da nitelikli kahve akımını başlatan ilk kavurmahanelerden biri olarak semtin sabah ritüelini değiştirdi.',
        mapPosition: { x: 46, y: 65, lat: 40.9841, lng: 29.0258 },
        visitorExperiences: [
          {
            id: 'kd-2-v1',
            emoji: '☕',
            text: 'Baristaya sevdiğiniz asidite profilini söylediğinizde o günkü en uygun çekirdeği nokta atışı öneriyorlar.',
            source: 'Yerel Kahve Rehberi',
            verified: true
          },
          {
            id: 'kd-2-v2',
            emoji: '🥐',
            text: 'Sabah erken saatte giderseniz fırından yeni çıkmış badem kremalı kruvasan ve flat white ikilisi güne harika başlatıyor.',
            source: 'Ziyaretçi Deneyimi',
            verified: true
          }
        ]
      },
      {
        id: 'kd-3',
        name: 'Basta! Street Food Bar',
        category: 'Gurme Hamburger',
        isMustTry: true,
        neighborhood: 'Caferağa · Sakızgülü Sokak',
        distanceText: 'Moda Girişi · 5 dk yürüyüş',
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Fine-dining geçmişli iki şefin sokak lezzetlerini üst düzey tekniklerle yorumladığı, ev yapımı brioche ekmeği ve ağır ateşte pişmiş etleriyle ünlü modern bistro.',
        signatureDish: 'Kuzu Burger & Dana Kaburga Dürüm',
        signatureDishDetail: 'Saatlerce ağır ateşte tiftiklenen kuzu eti, köz patlıcanlı mayonez ve harissa sosuyla tereyağlı brioche ekmeği arasında sunulur.',
        whyGo: [
          'Klasik fast-food hamburger algısını yıkan, şef dokunuşlu sos ve et pişirme teknikleri kullanır.',
          'Açık mutfak düzeni sayesinde siparişinizin hazırlanışını tezgâhtan izleyebilirsiniz.',
          'Yemek sonunda mutlaka denenmesi gereken "Sütlaç Brûlée" tatlısı başlı başına bir ziyaret sebebidir.'
        ],
        knowBeforeYouGo: [
          'Rezervasyon almaz; akşam 19:00 - 20:30 arasında kısa süreli masa beklemesi yaşanabilir.',
          'Menü kasıtlı olarak öz ve nettir; her ürün günlük taze üretilir.',
          'Humus tabağı ortaya başlangıç olarak paylaşmak için çok uygundur.'
        ],
        verifiedRating: 4.7,
        reviewCount: 3190,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺₺',
        bestTime: 'Akşamüstü 17:30 - 19:30',
        localHeritageNote: 'Kadıköy’de "şef işi sokak yemeği" kavramını başlatıp Michelin Bib Gourmand seçkisine giren öncü mekan.',
        mapPosition: { x: 38, y: 54, lat: 40.9869, lng: 29.0268 },
        visitorExperiences: [
          {
            id: 'kd-3-v1',
            emoji: '🍔',
            text: 'Kuzu burgerin içindeki isli patlıcan dokunuşu ve ekmeğin yumuşaklığı İstanbul’daki standart burgerlerden çok farklı bir seviyede.',
            source: 'Gastronomi Notları',
            verified: true
          },
          {
            id: 'kd-3-v2',
            emoji: '🍮',
            text: 'Üzeri karamelize edilen fırın sütlaç (Sütlaç Brûlée) hafif ve çıtır dokusuyla yemeği mükemmel tamamlıyor.',
            source: 'Ziyaretçi Deneyimi',
            verified: true
          }
        ]
      },
      {
        id: 'kd-4',
        name: 'Il Sud Forno & Pizzeria',
        category: 'Odun Ateşi Pizza',
        isMustTry: true,
        neighborhood: 'Moda ·Bademaltı Sokak',
        distanceText: 'Moda İskelesi · 7 dk yürüyüş',
        image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: '48 saat soğuk fermantasyonla dinlendirilen ekşi mayalı hamuru, San Marzano domates sosu ve 450 derece taş fırınıyla gerçek Napoli usulü pizza deneyimi.',
        signatureDish: 'Burrata & Trüflü Funghi Napoli Pizza',
        signatureDishDetail: 'Fırından çıktıktan sonra ortasına yerleştirilen taze manda burrata peyniri, fesleğen yaprakları ve sızma zeytinyağı ile servis edilir.',
        whyGo: [
          'Kenarları kabarık (cornicione), ortası ince ve hafif nemli gerçek Napoli standardını yakalar.',
          'Hamuru uzun süre fermente edildiği için yedikten sonra ağırlık yapmaz.',
          'Samimi İtalyan mahalle pizzacısı atmosferi hem arkadaş buluşmaları hem akşam yemekleri için keyiflidir.'
        ],
        knowBeforeYouGo: [
          'Cuma ve Cumartesi akşamları oldukça yoğundur; gitmeden önce telefonla masa durumunu sormak faydalıdır.',
          'Pizzalar tek kişilik doyurucu boyuttadır ancak ortaya iki farklı çeşit söyleyip paylaşmak en popüler tercihtir.',
          'Ev yapımı Tiramisu günlük sınırlı sayıda hazırlanır.'
        ],
        verifiedRating: 4.6,
        reviewCount: 920,
        ratingSource: 'DEMO Veri Seti',
        isDemo: true,
        priceTier: '₺₺₺',
        bestTime: 'Akşam 18:30 - 21:30',
        localHeritageNote: 'Moda’nın eski apartman altı dükkan kültürünü geleneksel Napoli taş fırın zanaatıyla buluşturan mahalle fırını.',
        mapPosition: { x: 55, y: 72, lat: 40.9822, lng: 29.0245 },
        visitorExperiences: [
          {
            id: 'kd-4-v1',
            emoji: '🍕',
            text: 'Hamurun kenarlarındaki leopar benekli kabarcıklar ve domates sosunun dengeli asiditesi Napoli’de yediklerimi aratmıyor.',
            source: 'DEMO Ziyaretçi Deneyimi',
            verified: false
          },
          {
            id: 'kd-4-v2',
            emoji: '🧀',
            text: 'Burrata pizzayı iki kişi paylaşıp yanına roka salatası söyledik; malzeme kalitesi ilk lokmada hissediliyor.',
            source: 'DEMO Müdavim Notu',
            verified: false
          }
        ]
      },
      {
        id: 'kd-5',
        name: 'Brekkie Breakfast Club',
        category: 'Uzun Kahvaltı',
        isMustTry: false,
        neighborhood: 'Osmanağa · Yoğurtçu Parkı Yanı',
        distanceText: 'Yoğurtçu Parkı · 5 dk yürüyüş',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Yoğurtçu Parkı’nın yeşilliğine komşu bahçesinde, dev kruvasan sandviçleri, poşe yumurtalı kaseleri ve taze demleme kahveleriyle Kadıköy’ün en enerjik kahvaltı noktası.',
        signatureDish: 'Çırpılmış Yumurtalı & Avokadolu Kruvasan Sandviç',
        signatureDishDetail: 'Günlük katlanan tereyağlı dev kruvasan içinde kremamsı çırpılmış yumurta, tütsülenmiş hindi füme, avokado ve taze otlar.',
        whyGo: [
          'Klasik serpme kahvaltı kalabalığından sıkılanlar için modern, hızlı ve çok lezzetli tabak alternatifleri sunar.',
          'Yoğurtçu Parkı kenarındaki açık hava masaları sabah güneşini yakalamak için idealdir.',
          'Tatlı-tuzlu dengesini sevenler için fıstık kremalı ve orman meyveli kruvasanları çok başarılıdır.'
        ],
        knowBeforeYouGo: [
          'Cumartesi-Pazar 10:30’dan sonra sıra oluşur; sıra sistemi hızlı ilerlese de 09:30 gibi gitmek büyük avantaj sağlar.',
          'Evcil hayvan dostu bir bahçesi vardır; park yürüyüşü sonrası uğramak için uygundur.',
          'Porsiyonlar oldukça doyurucudur; tatlı kruvasanı iki kişi paylaşabilirsiniz.'
        ],
        verifiedRating: 4.5,
        reviewCount: 4120,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺',
        bestTime: 'Sabah 09:00 - 11:00',
        localHeritageNote: 'Yoğurtçu Parkı hattını sabah yürüyüşçüleri ve kahvaltı severler için yeniden canlandıran modern fırın-kafe.',
        mapPosition: { x: 64, y: 48, lat: 40.9855, lng: 29.0312 },
        visitorExperiences: [
          {
            id: 'kd-5-v1',
            emoji: '🥑',
            text: 'Kruvasanın dışı çıtır, içi pamuk gibi; yumurtalı ve avokadolu dolgusu sabah kahvaltısı için tam kararında.',
            source: 'Doğrulanmış Ziyaretçi Yorumu',
            verified: true
          },
          {
            id: 'kd-5-v2',
            emoji: '☀️',
            text: 'Hafta içi sabah 9.30’da gittik, kuş sesleri eşliğinde hiç sıra beklemeden çok keyifli bir kahvaltı yaptık.',
            source: 'Mahalle Sakini Notu',
            verified: true
          }
        ]
      },
      {
        id: 'kd-6',
        name: 'Aida Vino e Cucina',
        category: 'Date & Akşam Yemeği',
        isMustTry: true,
        neighborhood: 'Moda · Ressam Şeref Akdik Sokak',
        distanceText: 'Moda الساحل · 8 dk yürüyüş',
        image: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Tarihi bir Moda köşkünde, loş aydınlatması, el yapımı taze makarnaları ve özenli servisiyle romantik akşam yemekleri ve özel kutlamalar için semtin en zarif adresi.',
        signatureDish: 'Ev Yapımı Dana Yanaklı Ravioli & Tiramisu',
        signatureDishDetail: 'İncecik açılmış taze makarna hamuru içinde ağır ateşte pişmiş dana yanak dolgusu, adaçaylı tereyağı ve yıllanmış parmesan ile.',
        whyGo: [
          'Sakin müzik seviyesi, şık masa düzeni ve bahçe/köşk atmosferiyle gerçek bir "Date" (özel buluşma) mekanıdır.',
          'Makarnalar mutfakta günlük olarak elde açılır ve mevsimsel yerel malzemelerle eşleştirilir.',
          'Servis ekibi menüdeki tabakların içerikleri ve uyumları konusunda son derece bilgili ve naziktir.'
        ],
        knowBeforeYouGo: [
          'Akşam yemeği için mutlaka en az 2-3 gün önceden rezervasyon yaptırılması önerilir.',
          'Bahçe masaları ilkbahar ve yaz akşamlarında çok talep görür; rezervasyon sırasında özellikle belirtebilirsiniz.',
          'Sessiz ve dingin bir atmosfer korunduğu için kalabalık/gürültülü gruplardan ziyade ikili veya dörtlü masalara uygundur.'
        ],
        verifiedRating: 4.6,
        reviewCount: 1480,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺₺₺',
        bestTime: 'Akşam 19:30 - 22:30',
        localHeritageNote: 'Moda’nın asırlık konak mimarisini koruyarak mahallede rafine akşam yemeği kültürünü temsil eden simge mekan.',
        mapPosition: { x: 74, y: 68, lat: 40.9815, lng: 29.0261 },
        visitorExperiences: [
          {
            id: 'kd-6-v1',
            emoji: '🕯️',
            text: 'Yıldönümü yemeğimiz için bahçe kısmında masa ayırttık; hem aydınlatma hem de ev yapımı makarnalar kusursuzdu.',
            source: 'Doğrulanmış Misafir Yorumu',
            verified: true
          },
          {
            id: 'kd-6-v2',
            emoji: '🍝',
            text: 'Gürültüden uzak, karşınızdakiyle rahatça sohbet edebildiğiniz Kadıköy’deki en özenli akşam yemeği noktası.',
            source: 'Gurme Seçki Notu',
            verified: true
          }
        ]
      },
      {
        id: 'kd-7',
        name: 'Asuman Çikolata & Fırın',
        category: 'Tatlı & Üçüncü Nesil Fırın',
        isMustTry: false,
        neighborhood: 'Moda · Şair Nefi Sokak',
        distanceText: 'Moda Caddesi · 5 dk yürüyüş',
        image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Belçika çikolatası, taze çilek ve ev yapımı fındık kremasıyla hazırlanan kavanoz tatlıları ve butik pastacılık ürünleriyle Moda sokaklarının en tatlı durağı.',
        signatureDish: 'Kavanozda Sıcak Çikolatalı & Çilekli Asuman',
        signatureDishDetail: 'Altta özel bisküvi kırığı, ortada taze çilek dilimleri ve üzerinde akışkan ılık çikolata katmanıyla servis edilen imza tatlı.',
        whyGo: [
          'Yemek veya kahve sonrası Moda yürüyüşünü taçlandıran hafif ama tatmin edici çikolata reçeteleri sunar.',
          'Kullanılan çikolata kalitesi sayesinde boğazı yakmayan, dengeli bir şeker oranına sahiptir.',
          'Cam kavanoz sunumu hem görsel olarak şık hem de paylaşmaya uygundur.'
        ],
        knowBeforeYouGo: [
          'Akşam yemeklerinden sonra (20:30 - 22:30) tatlı sırası oluşabilir ancak servis oldukça hızlıdır.',
          'Şekersiz veya bitter çikolata sevenler için %70 kakao oranlı alternatifleri sorabilirsiniz.',
          'Yanında sade Türk kahvesi veya filtre kahve ile dengelemek tatlı lezzetini daha çok öne çıkarır.'
        ],
        verifiedRating: 4.5,
        reviewCount: 2890,
        ratingSource: 'DEMO Veri Seti',
        isDemo: true,
        priceTier: '₺₺',
        bestTime: 'Akşamüstü 16:00 - 22:00',
        localHeritageNote: 'Şair Nefi Sokak’ı Kadıköy’ün tatlı ve çikolata sokağı haline getiren ilk butik girişimlerden biri.',
        mapPosition: { x: 49, y: 58, lat: 40.9848, lng: 29.0273 },
        visitorExperiences: [
          {
            id: 'kd-7-v1',
            emoji: '🍫',
            text: 'Çikolatanın kalitesi ilk kaşıkta belli oluyor; ağır şerbetli tatlılar yerine taze meyveli çikolata arayanlar için birebir.',
            source: 'DEMO Ziyaretçi Deneyimi',
            verified: false
          },
          {
            id: 'kd-7-v2',
            emoji: '🍓',
            text: 'Moda’da akşam yemeği sonrası yürüyerek uğradığımız klasik durağımız; porsiyonu oldukça bol.',
            source: 'DEMO Müdavim Notu',
            verified: false
          }
        ]
      }
    ]
  },

  gaziantep: {
    id: 'gaziantep',
    name: 'Gaziantep (Merkez)',
    cityLabel: 'Gaziantep',
    tagline: 'UNESCO Yaratıcı Şehirler Ağı’ndaki mutfak başkenti: Sabah beyranı, zırh kebabı, taş fırın baklava ve çıtır katmer.',
    culturalIntro:
      'Gaziantep’te yemek bir öğün değil, günün saatlerine göre kurgulanan asırlık bir ritüeldir. Güne sabahın ilk ışıklarında bakır sahanlarda kaynayan beyran veya fıstıklı katmerle başlanır; öğlen zırhla çekilmiş kuzu kebapları ve mevsim kebapları yenir; ikindi vakti ise taş fırından yeni çıkmış boz fıstıklı baklava ile taçlandırılır. (Not: Bölge kuralları gereği hamburger/pizza zorunlu tutulmamış, yerel kategoriler öne çıkarılmıştır.)',
    hasDateCategory: false,
    dateCategoryReason: 'Gaziantep seçkisinde odak noktası tarihi ustalık mekanları, ocakbaşı ve esnaf kültürünün zirvesidir; zorlama "Date" veya "Hamburger/Pizza" kategorileri eklenmemiştir.',
    categories: [
      'Mutlaka Denenmesi Gerekenler',
      'Zırh Kebabı & Ocakbaşı',
      'Taş Fırın Baklava',
      'Sabah Beyranı',
      'Geleneksel Katmer',
      'Esnaf Lokantası & Yöresel'
    ],
    venues: [
      {
        id: 'ga-1',
        name: 'İmam Çağdaş Kebap ve Baklava',
        category: 'Mutlaka Denenmesi Gerekenler',
        isMustTry: true,
        neighborhood: 'Şahinbey · Tarihi Uzun Çarşı',
        distanceText: 'Gaziantep Kalesi · 3 dk yürüyüş',
        image: 'https://images.pexels.com/photos/1251198/pexels-photo-1251198.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: '1887’den bu yana Uzun Çarşı’da taş fırın baklavası ve zırh kıymasıyla hazırlanan Ali Nazik kebabının standartlarını belirleyen tarihi gastronomi kurumu.',
        signatureDish: 'Sarımsaklı Yoğurtlu Ali Nazik & Kare Havuç Dilim Baklava',
        signatureDishDetail: 'Közlenmiş patlıcanlı süzme yoğurt yatağında sıcak tereyağlı zırh kıyması ve üzerine odun ateşinde pişmiş boz fıstıklı kare baklava.',
        whyGo: [
          '135 yılı aşan geçmişiyle Gaziantep mutfak geleneğinin en köklü ve en istikrarlı temsilcisidir.',
          'Hem kebap hem de baklava üretiminde birinci sınıf erken hasat boz Antep fıstığı ve sade yağ kullanır.',
          'Bakırcılar Çarşısı ve Kale gezisi sırasında tam merkezde, yüksek kapasiteli ve hızlı servis sunar.'
        ],
        knowBeforeYouGo: [
          'Öğle saatlerinde oldukça kalabalıktır ancak iki katlı geniş salonu sayesinde masa sirkülasyonu çok hızlıdır.',
          'Yemek sonrası vakumlu veya özel teneke kutuda şehir dışına baklava paketletebilirsiniz.',
          'Yanında bakır taslarda sunulan bol köpüklü yayık ayranını mutlaka isteyin.'
        ],
        verifiedRating: 4.6,
        reviewCount: 18450,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺₺',
        bestTime: 'Öğle 12:00 - 16:00',
        localHeritageNote: '1887’de kurulan işletme, dört kuşaktır aynı çarşıda geleneksel taş fırın ve zırh ustalığını sürdürüyor.',
        mapPosition: { x: 35, y: 48, lat: 37.0628, lng: 37.3825 },
        visitorExperiences: [
          {
            id: 'ga-1-v1',
            emoji: '🥩',
            text: 'Ali Nazik kebabının altındaki köz patlıcanlı yoğurdun sıcaklığı ve üzerindeki etin lezzeti gerçekten kusursuz bir uyumda.',
            source: 'Doğrulanmış Ziyaretçi Deneyimi',
            verified: true
          },
          {
            id: 'ga-1-v2',
            emoji: '🥮',
            text: 'Yemek üstüne gelen tek dilim kare baklavanın hışırtısı ve içindeki fıstık oranı neden efsane olduğunu kanıtlıyor.',
            source: 'Gastronomi Rehberi Notu',
            verified: true
          }
        ]
      },
      {
        id: 'ga-2',
        name: 'Kebapçı Halil Usta',
        category: 'Zırh Kebabı & Ocakbaşı',
        isMustTry: true,
        neighborhood: 'Şehitkamil · Karşıyaka (Zeugma Yanı)',
        distanceText: 'Zeugma Müzesi · 2 dk yürüyüş',
        image: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Zeugma Mozaik Müzesi’nin hemen arkasında, baharatla gölgelenmemiş saf kuzu etinin lezzetini küşleme ve simit kebabıyla zirveye taşıyan efsanevi ocakbaşı.',
        signatureDish: 'Sıcak Bakır Sahanda Küşleme & Simit Kebabı',
        signatureDishDetail: 'Kuzunun sırt kısmından çıkan sinirsiz, lokum kıvamında marine edilmemiş küşleme ve bulgurla çekilmiş fıstıklı simit kebabı.',
        whyGo: [
          'Küşlemeyi Türkiye’de geniş kitlelere tanıtan ve etin yumuşaklığını en saf haliyle sunan usta mekanıdır.',
          'Bakır sahanlarda gelen bol nar ekşili ve cevizli kaşık salatası kebapların mükemmel eşlikçisidir.',
          'Zeugma Müzesi ziyaretiyle birleştirilebilecek en ideal öğle yemeği noktasıdır.'
        ],
        knowBeforeYouGo: [
          'Sadece gündüz hizmet verir; etler bittiğinde (genellikle 16:30 - 17:00 civarı) servis kapanır, akşam yemeğine bırakmayın!',
          'Sipariş verirken "karışık tadım" (küşleme + simit kebabı + kıyma) istemek tüm lezzetleri denemek için en iyi yoldur.',
          'Rezervasyon kabul edilmez; öğlen 11:45 veya 14:30 gibi gitmek sıra beklemeyi önler.'
        ],
        verifiedRating: 4.6,
        reviewCount: 9320,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺₺',
        bestTime: 'Öğle 11:30 - 15:30 (Akşam Kapalı)',
        localHeritageNote: '1972’den beri sadece öğle servisi açarak günlük taze kuzu eti işleme disiplininden taviz vermeyen usta ocağı.',
        mapPosition: { x: 62, y: 28, lat: 37.0758, lng: 37.3861 },
        visitorExperiences: [
          {
            id: 'ga-2-v1',
            emoji: '🔥',
            text: 'Küşleme o kadar yumuşak ki bıçağa neredeyse ihtiyaç duymuyorsunuz; önden gelen kaşık salatası da başlı başına harika.',
            source: 'Doğrulanmış Misafir Yorumu',
            verified: true
          },
          {
            id: 'ga-2-v2',
            emoji: '⏰',
            text: 'Zeugma Müzesi’nden çıkıp saat 13:30’da geçtik, 10 dakika bekledik ama servis hızı inanılmaz; saat 17:00’den önce mutlaka gidin.',
            source: 'Gezgin Tavsiyesi',
            verified: true
          }
        ]
      },
      {
        id: 'ga-3',
        name: 'Koçak Baklava',
        category: 'Taş Fırın Baklava',
        isMustTry: true,
        neighborhood: 'Şehitkamil · Alleben Mahallesi',
        distanceText: 'Şehir Merkezi · 6 dk sürüş',
        image: 'https://images.pexels.com/photos/7474204/pexels-photo-7474204.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'İncecik elde açılan 40 kat yufkası, Şanlıurfa sade yağı ve zümrüt yeşili boz iç fıstığıyla baklava zanaatının en rafine örneklerini sunan ustalık durağı.',
        signatureDish: 'Özel Kare Baklava & Boz Fıstıklı Yaprak Şöbiyet',
        signatureDishDetail: 'İri kıyım boz fıstık ve doğal sade yağ ile hazırlanan çıtır kare baklava ile kaymak dolgulu ılık yaprak şöbiyet.',
        whyGo: [
          'Şerbeti genzi yakmayan, yufkası ısırıldığında net bir çıtırtı sesi veren en üst düzey baklava işçiliğine sahiptir.',
          'Yaprak şöbiyet ve dolama çeşitlerinde kullanılan fıstık yoğunluğu ve kaymak tazeliği benzersizdir.',
          'Hem yerinde ılık tadım yapmak hem de dönüş için hediyelik kutu almak üzere kusursuz paketleme yapar.'
        ],
        knowBeforeYouGo: [
          'Yaprak şöbiyet günlük sınırlı tepsi çıktığı için öğleden önce veya öğle saatlerinde gitmek taze yakalamanızı sağlar.',
          'Tatlıyı yerken önce ters çevirip damağınıza sade yağlı alt tabanın değmesini sağlamak geleneksel Antep tadım yöntemidir.',
          'Bayram ve hafta sonu dönemlerinde paket sırası ayrı, masada servis sırası ayrıdır.'
        ],
        verifiedRating: 4.8,
        reviewCount: 11200,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺₺',
        bestTime: 'Gündüz 10:30 - 18:00',
        localHeritageNote: 'Coğrafi işaretli Antep Baklavası standartlarını geleneksel oklava ve taş fırın disipliniyle koruyan referans üretim noktası.',
        mapPosition: { x: 24, y: 34, lat: 37.0681, lng: 37.3642 },
        visitorExperiences: [
          {
            id: 'ga-3-v1',
            emoji: '💚',
            text: 'Özel kare baklavanın içindeki fıstık aroması ve sade yağın kokusu o kadar dengeli ki üç dilimi hiç ağırlık hissetmeden yedik.',
            source: 'Doğrulanmış Ziyaretçi Deneyimi',
            verified: true
          },
          {
            id: 'ga-3-v2',
            emoji: '✨',
            text: 'Yaprak şöbiyeti ılıkken masada denedik; içindeki kaymak ve çıtır yufka birleşimi hayatımda yediğim en iyi tatlıydı.',
            source: 'Gurme Seçki Notu',
            verified: true
          }
        ]
      },
      {
        id: 'ga-4',
        name: 'Metanet Lokantası',
        category: 'Sabah Beyranı',
        isMustTry: true,
        neighborhood: 'Şahinbey · Kozluca / Uzun Çarşı Girişi',
        distanceText: 'Bakırcılar Çarşısı · 4 dk yürüyüş',
        image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Sabah saat 05:30’dan itibaren harlı ateşteki bakır sahanlarda kuzu gerdan eti, pirinç, iç yağı ve sarımsakla hazırlanan gerçek Gaziantep beyranının adresi.',
        signatureDish: 'Bakır Sahanda Geleneksel Sabah Beyranı',
        signatureDishDetail: '12 saat kısık ateşte pişen lif lif kuzu gerdan eti, haşlanmış pirinç, sarımsak ve pul biberin yüksek ateşte özdeşleştiği şifa yemeği.',
        whyGo: [
          'Gaziantep’te güne yerel halk gibi başlamanın en otantik yolu sabah beyranı içmektir.',
          'Ustaların aynı anda 8-10 bakır sahanı harlı alev üzerinde çevirerek beyran hazırlamasını izlemek görsel bir şölendir.',
          'Kuzu eti o kadar uzun süre pişer ki ağızda dağılır ve gün boyu enerji verir.'
        ],
        knowBeforeYouGo: [
          'Beyran bir akşam çorbası değil, sabah kahvaltı yemeğidir; en lezzetli saatleri sabah 06:30 ile 10:30 arasıdır.',
          'Acı ve sarımsak oranını sipariş verirken ustanıza ("az acılı / normal sarımsaklı") mutlaka belirtin.',
          'Yanında gelen taze tırnaklı pide ve limon ile servis edilir.'
        ],
        verifiedRating: 4.5,
        reviewCount: 5640,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺',
        bestTime: 'Sabah 06:30 - 10:30',
        localHeritageNote: 'Çarşı esnafının dükkan açmadan önce uğradığı, asırlık sabah beyranı geleneğini yaşatan tarihi lokanta.',
        mapPosition: { x: 42, y: 56, lat: 37.0612, lng: 37.3801 },
        visitorExperiences: [
          {
            id: 'ga-4-v1',
            emoji: '🥣',
            text: 'Sabah 7.30’da kahvaltıda beyran içilir mi diye tereddüt etmiştik ama ilk kaşıktan sonra neden Antep’in bir numaralı kahvaltısı olduğunu anladık.',
            source: 'Doğrulanmış Ziyaretçi Yorumu',
            verified: true
          },
          {
            id: 'ga-4-v2',
            emoji: '🔥',
            text: 'Ocak başındaki ustanın bakır sahanları alevlerin içinde hazırlayışı ve etin lokum kıvamı unutulmaz bir deneyim.',
            source: 'Yerel Rehber Notu',
            verified: true
          }
        ]
      },
      {
        id: 'ga-5',
        name: 'Katmerci Zekeriya Usta',
        category: 'Geleneksel Katmer',
        isMustTry: true,
        neighborhood: 'Şahinbey · Çukur Mahallesi',
        distanceText: 'Eski Adliye Yanı · 6 dk yürüyüş',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Mermer tezgâhta zar gibi ince açılan hamurun içine bol sahan kaymağı ve taze çekilmiş Antep fıstığı konularak taş fırında kızartıldığı sabah katmeri ustası.',
        signatureDish: 'Sahan Kaymaklı & Bol Fıstıklı Taş Fırın Katmeri',
        signatureDishDetail: 'Zarf şeklinde katlanıp odunlu taş fırında nar gibi kızaran çıtır hamur, yanında ılık süt ve şekersiz çay ile servis edilir.',
        whyGo: [
          'Sadece katmer üreten, tek bir üründe uzmanlaşmış gerçek bir zanaat dükkanıdır.',
          'İçinde kullanılan doğal sahan kaymağı ve fıstık oranı tepsiden taşacak kadar cömerttir.',
          'Geleneksel olarak yanında ikram edilen bir bardak ılık süt ile tatlı dengesi mükemmel kurulur.'
        ],
        knowBeforeYouGo: [
          'Katmer Gaziantep’te sabah kahvaltısında yenir; öğleden sonra saat 13:00 - 14:00 gibi kaymak ve hamur bittiğinde dükkan kapanır.',
          'Bir porsiyon katmer oldukça doyurucudur; sabah beyranı üzerine gidiyorsanız iki veya üç kişi tek katmeri paylaşmak en doğrusudur.',
          'Taş fırının karşısındaki masalarda oturup hamurun mermerde havada döndürülerek açılışını izleyebilirsiniz.'
        ],
        verifiedRating: 4.6,
        reviewCount: 4210,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺',
        bestTime: 'Sabah 07:00 - 11:30',
        localHeritageNote: 'Gaziantep’te yeni evlenen çiftlerin ilk sabah kahvaltısı olan "güvey katmeri" geleneğini yaşatan tarihi fırın.',
        mapPosition: { x: 52, y: 62, lat: 37.0645, lng: 37.3768 },
        visitorExperiences: [
          {
            id: 'ga-5-v1',
            emoji: '🥛',
            text: 'Katmerin yanında gelen ılık süt ilk başta şaşırttı ama sıcak fıstıklı kaymakla birleştiğinde tadını ikiye katlıyor.',
            source: 'Doğrulanmış Ziyaretçi Deneyimi',
            verified: true
          },
          {
            id: 'ga-5-v2',
            emoji: '👨‍🍳',
            text: 'Beyrandan hemen sonra yürüyerek geçip iki kişi bir porsiyon katmer paylaştık; hamurun inceliği sanat eseri gibi.',
            source: 'Müdavim Notu',
            verified: true
          }
        ]
      },
      {
        id: 'ga-6',
        name: 'Aşina Gaziantep Mutfağı & Esnaf Sofrası',
        category: 'Esnaf Lokantası & Yöresel',
        isMustTry: false,
        neighborhood: 'Şehitkamil · İncilipınar',
        distanceText: 'Merkez · 5 dk sürüş',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Yuvalama çorbasından içli köfteye, doğrama ve firik pilavından mevsimsel yeni dünya kebabına kadar Gaziantep ev yemeklerini bir arada sunan yöresel sofra.',
        signatureDish: 'Antep Yuvalama & Kızartma İçli Köfte Tabağı',
        signatureDishDetail: 'Nohut tanesi büyüklüğünde tek tek elde yuvarlanan etli pirinç köfteli yoğurtlu yuvalama ve çıtır cevizli-fıstıklı içli köfte.',
        whyGo: [
          'Normalde sadece bayram sabahlarında Gaziantep evlerinde yapılan zahmetli "Yuvalama" yemeğini her gün taze bulabilirsiniz.',
          'Kebap dışında tencere yemekleri, zeytinyağlı kuru dolmalar ve yöresel çorbaları tatmak isteyenler için en zengin seçkidir.',
          'Geniş ve ferah salonuyla aileler ve kalabalık gruplar için konforlu bir öğle/akşam yemeği sunar.'
        ],
        knowBeforeYouGo: [
          'Gaziantep mutfağını tek öğünde tanımak isteyenler için "Yöresel Tadım Tepsisi" (yuvalama + kuru dolma + içli köfte + firik pilavı) çok pratiktir.',
          'Mevsimine göre ilkbaharda "Sarımsak Kebabı" ve "Yeni Dünya (Malta Eriği) Kebabı" olup olmadığını mutlaka sorun.',
          'Akşam servisi de açıktır; gündüz kebapçılar kapandıktan sonra yöresel akşam yemeği için güvenilir bir adrestir.'
        ],
        verifiedRating: 4.5,
        reviewCount: 2150,
        ratingSource: 'DEMO Veri Seti',
        isDemo: true,
        priceTier: '₺₺',
        bestTime: 'Öğle & Akşam 12:00 - 21:00',
        localHeritageNote: 'İmece usulüyle hazırlanan Gaziantep ev yemeklerini restoran ölçeğinde koruyan yerel mutfak temsilcisi.',
        mapPosition: { x: 70, y: 46, lat: 37.0712, lng: 37.3725 },
        visitorExperiences: [
          {
            id: 'ga-6-v1',
            emoji: '🥘',
            text: 'Yuvalama ve firik pilavını aynı masada tatmak harikaydı; sadece kebap değil gerçek Antep tencere yemeklerini görmek için şart.',
            source: 'DEMO Ziyaretçi Deneyimi',
            verified: false
          },
          {
            id: 'ga-6-v2',
            emoji: '🌿',
            text: 'Kuru patlıcan ve biber dolmalarının sumak ekşisi tam kıvamında; içli köftesi de hiç yağ çekmemişti.',
            source: 'DEMO Gurme Notu',
            verified: false
          }
        ]
      }
    ]
  },

  bodrum: {
    id: 'bodrum',
    name: 'Bodrum, Muğla',
    cityLabel: 'Bodrum',
    tagline: 'Yalıkavak ve Gümüşlük koylarında gün batımı iskelelerinden zeytin ağaçları altındaki taş fırın ve köy kahvaltılarına.',
    culturalIntro:
      'Bodrum’un gerçek gastronomi kimliği; sabah Çömlekçi veya Dereköy’de odun ateşinde demlenen çay ve bahçe zeytinleriyle yapılan uzun Ege kahvaltılarında, öğlen taş fırından çıkan çıtır pizzalarda ve akşamüstü Gümüşlük ya da Yalıkavak iskelelerinde deniz ürünleri eşliğinde izlenen gün batımında saklıdır.',
    hasDateCategory: true,
    dateCategoryReason: 'Bodrum’da deniz sıfır iskele restoranları ve bağ/bahçe içindeki taş mekanlar romantik akşam yemeği (Date) konseptine birebir uyduğu için bu kategori aktif gösterilir.',
    categories: [
      'Mutlaka Denenmesi Gerekenler',
      'Deniz Ürünleri & İskele',
      'Date & Gün Batımı',
      'Ege Kahvaltısı & Köy Sofrası',
      'Nitelikli Kahve & Tatlı',
      'Odun Ateşi Pizza & İtalyan',
      'Yerel Esnaf & Ev Yemekleri'
    ],
    venues: [
      {
        id: 'bd-1',
        name: 'Orfoz Restaurant',
        category: 'Mutlaka Denenmesi Gerekenler',
        isMustTry: true,
        neighborhood: 'Merkez · Kumbahçe Sahili',
        distanceText: 'Bodrum Kalesi Manzaralı · 8 dk sürüş',
        image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Kumbahçe kıyısında Bodrum Kalesi’ne karşı konumlanan, Ege kabuklu deniz ürünlerini ve yerel otları çok aşamalı tadım menüsüyle sunan Michelin ödüllü mekan.',
        signatureDish: 'Deniz Kabukluları Tadım Seçkisi & Izgara Ahtapot',
        signatureDishDetail: 'İstiridye, fırınlanmış kidonya, karamelize soğanlı deniz tarağı ve odun ateşinde dinlendirilmiş Ege ahtapotu.',
        whyGo: [
          'Klasik balıkçı meze tepsisinin ötesine geçen, deniz ürünlerini şef dokunuşuyla adım adım sunan benzersiz bir tadım akışı vardır.',
          'Bodrum Kalesi’nin gece ışıklandırmasına karşı en etkileyici sahil manzaralarından birine sahiptir.',
          'Ege Denizi’nin mevsimsel kabuklu ve taş balıklarını en taze haliyle deneyimleme imkanı verir.'
        ],
        knowBeforeYouGo: [
          'Sabit tadım menüsü (set menü) konseptiyle çalışır; aç gitmeniz ve en az 2,5 saat ayırmanız önerilir.',
          'Yaz sezonunda gün batımı masaları için 1 hafta önceden rezervasyon yapmak gerekir.',
          'Deniz ürünü alerjiniz varsa servis başlamadan önce ekibe bilgi vermeniz yeterlidir.'
        ],
        verifiedRating: 4.8,
        reviewCount: 920,
        ratingSource: 'Yerini Ayır Doğrulanmış Veri',
        isDemo: false,
        priceTier: '₺₺₺₺',
        bestTime: 'Gün Batımı 19:00 - 22:30',
        localHeritageNote: 'Bozburun’dan Kumbahçe’ye uzanan hikayesiyle Ege deniz kabukluları kültürünü dünyaya tanıtan Bodrum klasiği.',
        mapPosition: { x: 64, y: 74, lat: 37.0312, lng: 27.4385 },
        visitorExperiences: [
          {
            id: 'bd-1-v1',
            emoji: '🦪',
            text: 'Arka arkaya gelen sıcak ve soğuk deniz kabukluları o kadar taze ve özenliydi ki klasik balıkçılardan tamamen ayrı bir deneyim yaşadık.',
            source: 'Yerini Ayır Rehber Notu',
            verified: true
          },
          {
            id: 'bd-1-v2',
            emoji: '🏰',
            text: 'Kale manzarasına karşı gün batımında oturmak ve servisin kusursuz temposu tatilimizin en özel akşamıydı.',
            source: 'Doğrulanmış Misafir Yorumu',
            verified: true
          }
        ]
      },
      {
        id: 'bd-2',
        name: 'Mimoza Gümüşlük',
        category: 'Date & Gün Batımı',
        isMustTry: true,
        neighborhood: 'Gümüşlük · Koy İskelesi',
        distanceText: 'Gümüşlük Sahili · Denize Sıfır',
        image: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Gümüşlük koyunda suyun hemen üzerindeki iskelesi, begonvillerle çevrili fenerli aydınlatması ve Ege mezeleriyle Bodrum’un en romantik gün batımı noktası.',
        signatureDish: 'Kabak Çiçeği Dolması & Tuzda Lagos',
        signatureDishDetail: 'Sabah toplanan taze Ege kabak çiçekleri, Girit ezmesi, sıcak ot kavurması ve masada kırılan tuzda deniz lagosu.',
        whyGo: [
          'Güneşin Yunan adaları arkasından batışını suyun tam üstündeki iskele masalarından izlemek eşsiz bir atmosfer sunar.',
          'Karanlık çöktüğünde yanan el yapımı su kabakları ve fenerlerle mekan büyülü bir görünüme bürünür.',
          'Özel kutlamalar ve romantik çift yemekleri (Date) için Bodrum’daki en ikonik ambiyansa sahiptir.'
        ],
        knowBeforeYouGo: [
          'Gün batımı saatini kaçırmamak için yazın 18:45 - 19:15 arasında masada olacak şekilde rezervasyon yaptırın.',
          'İskele kenarındaki ilk sıra masalar için rezervasyon sırasında özellikle "deniz kenarı" talebinizi belirtin.',
          'Akşam saatlerinde deniz üstü hafif esintili olabileceği için yanınıza ince bir şal/gömlek almak iyi olur.'
        ],
        verifiedRating: 4.5,
        reviewCount: 1640,
        ratingSource: 'DEMO Veri Seti',
        isDemo: true,
        priceTier: '₺₺₺₺',
        bestTime: 'Gün Batımı 18:45 - 23:00',
        localHeritageNote: 'Gümüşlük (antik Myndos) kıyısında taş, deniz ve begonvil estetiğini birleştiren simge sahil sofrası.',
        mapPosition: { x: 18, y: 46, lat: 37.0542, lng: 27.2341 },
        visitorExperiences: [
          {
            id: 'bd-2-v1',
            emoji: '🌅',
            text: 'Gümüşlük’te güneş batarken iskeledeki fenerlerin yanmaya başladığı o 20 dakika gerçekten kartpostal gibi.',
            source: 'DEMO Ziyaretçi Deneyimi',
            verified: false
          },
          {
            id: 'bd-2-v2',
            emoji: '🐟',
            text: 'Ege otlu mezeler ve sıcak deniz mahsulleri ara sıcakları çok başarılı; özel bir akşam için ambiyansı rakipsiz.',
            source: 'DEMO Müdavim Notu',
            verified: false
          }
        ]
      },
      {
        id: 'bd-3',
        name: 'Sait Restoran',
        category: 'Deniz Ürünleri & İskele',
        isMustTry: true,
        neighborhood: 'Yalıkavak · Marina Yakını Sahil',
        distanceText: 'Yalıkavak Merkez · 4 dk sürüş',
        image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Yalıkavak kıyısında malzeme tazeliğini her şeyin önünde tutan, taş fırından çıkan sıcak ekmekleri ve kusursuz pişirilmiş günlük balıklarıyla klasikleşmiş adres.',
        signatureDish: 'Lakerda, Sıcak Otlu Börek & Izgara Kaya Barbunu',
        signatureDishDetail: 'Ev yapımı dinlendirilmiş torik lakerdası, çıtır otlu kabaklı börek ve suyunu kaybetmeden pişirilmiş Yalıkavak kaya barbunu.',
        whyGo: [
          'Gösterişli soslar yerine birinci sınıf deniz ürününün kendi lezzetini koruyan geleneksel ustalığa sahiptir.',
          'Masaya sıcak gelen taş fırın pidesi ve kendi üretimleri olan zeytinyağı başlangıçta fark yaratır.',
          'Hem öğle sonu uzun sahil sofraları hem de şık akşam yemekleri için çok dengeli bir servisi vardır.'
        ],
        knowBeforeYouGo: [
          'Balık dolabından o gün çıkan mevsim balıklarını ustayla birlikte seçmek en doğru yöntemdir.',
          'Yemek sonunda gelen sıcak tahinli-cevizli helva veya dondurmalı irmik tatlısını mutlaka paylaşın.',
          'Vale ve otopark imkanı mevcuttur; Yalıkavak trafiğini hesaba katarak yola çıkmak önerilir.'
        ],
        verifiedRating: 4.6,
        reviewCount: 1380,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺₺₺',
        bestTime: 'Akşam 18:30 - 22:30',
        localHeritageNote: 'Yalıkavak’ın küçük bir balıkçı köyü olduğu yıllardan bugünün dünya çapındaki sahiline uzanan en köklü balıkçısı.',
        mapPosition: { x: 34, y: 24, lat: 37.1084, lng: 27.2892 },
        visitorExperiences: [
          {
            id: 'bd-3-v1',
            emoji: '🦐',
            text: 'Kaya barbunu ve karides güveç o kadar taze ve kıvamında pişmişti ki yıllardır kalitesini hiç bozmamasına hayran kaldık.',
            source: 'Doğrulanmış Misafir Yorumu',
            verified: true
          },
          {
            id: 'bd-3-v2',
            emoji: '🫒',
            text: 'Masaya ilk gelen sıcak balon lavaş ve erken hasat zeytinyağı bile buradaki özeni anlatmaya yetiyor.',
            source: 'Gurme Rehber Notu',
            verified: true
          }
        ]
      },
      {
        id: 'bd-4',
        name: 'Asmalı Çardak',
        category: 'Ege Kahvaltısı & Köy Sofrası',
        isMustTry: true,
        neighborhood: 'Yalıkavak · Gökçebel Köy İçi',
        distanceText: 'Yalıkavak · 7 dk sürüş',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Üzüm asmalarının gölgelediği geniş bahçesinde, kendi yetiştirdikleri sebzeler, el açması börekler ve ev yapımı reçellerle gerçek bir Ege köy kahvaltısı.',
        signatureDish: 'Odun Ateşinde Pişi, Çibörek & Bodrum Mandalinalı Reçel Seçkisi',
        signatureDishDetail: 'Sıcak gelen puf pişiler, peynirli-otlu köy böreği, bahçe domatesi, yerel peynirler ve Bodrum mandalinası reçeli.',
        whyGo: [
          'Fabrikasyon tek kullanımlık ürünler yerine tamamen ev yapımı reçeller, bahçe yeşillikleri ve sıcak hamur işleri sunulur.',
          'Asma yaprakları altındaki serin bahçesi yaz sıcaklarında bile ferah ve huzurlu bir sabah geçirmenizi sağlar.',
          'Çocuklu aileler ve kalabalık dost sofraları için geniş, doğal bir köy bahçesi ortamına sahiptir.'
        ],
        knowBeforeYouGo: [
          'Hafta sonu ve yüksek sezonda sabah 10:00’dan sonra yoğunluk başlar; telefonla masa ayırtmak çok rahatlatır.',
          'Kahvaltı tepsisi bittikçe sıcak pişi ve çay takviyesi hızla yapılır.',
          'Çıkışta kendi yaptıkları Bodrum mandalina reçeli ve zeytinyağlarından satın alabilirsiniz.'
        ],
        verifiedRating: 4.5,
        reviewCount: 2850,
        ratingSource: 'Yerini Ayır Doğrulanmış Veri',
        isDemo: false,
        priceTier: '₺₺',
        bestTime: 'Sabah 09:00 - 12:30',
        localHeritageNote: 'Yalıkavak’ın köy dokusunu ve aile işletmesi sıcaklığını koruyan en sevilen bahçe sofralarından biri.',
        mapPosition: { x: 42, y: 32, lat: 37.1145, lng: 27.3012 },
        visitorExperiences: [
          {
            id: 'bd-4-v1',
            emoji: '🍊',
            text: 'Asmaların altında esintili bahçede kahvaltı yapmak çok dinlendirici; mandalina reçeli ve sıcak çiböreği harikaydı.',
            source: 'Yerini Ayır Rehber Notu',
            verified: true
          },
          {
            id: 'bd-4-v2',
            emoji: '🧀',
            text: 'Masadaki hiçbir şey hazır paket değil; peynirlerin ve bahçe domatesinin lezzeti gerçek Ege kahvaltısını yaşatıyor.',
            source: 'Doğrulanmış Ziyaretçi Yorumu',
            verified: true
          }
        ]
      },
      {
        id: 'bd-5',
        name: 'Arka Ristorante & Pizzeria',
        category: 'Odun Ateşi Pizza & İtalyan',
        isMustTry: false,
        neighborhood: 'Merkez · Çarşı Arka Sokak',
        distanceText: 'Bodrum Marina · 5 dk yürüyüş',
        image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Bodrum Çarşısı’nın begonvilli sakin bir taş avlusunda, incecik çıtır hamurlu odun ateşi pizzaları ve deniz mahsullü makarnalarıyla sevilen İtalyan mutfağı.',
        signatureDish: 'Kabak Çiçekli & Keçi Peynirli Odun Ateşi Pizza',
        signatureDishDetail: 'İnce çıtır İtalyan hamuru üzerinde Ege kabak çiçekleri, taze keçi peyniri, mozzarella ve fesleğen.',
        whyGo: [
          'Bodrum’da balık dışında şık ve lezzetli bir akşam yemeği arayanlar için en güvenilir taş avlu restoranıdır.',
          'İtalyan pizza tekniğini yerel Ege malzemeleriyle (kabak çiçeği, enginar, deniz ürünleri) başarıyla buluşturur.',
          'Çarşı merkezinde olmasına rağmen arka avlusuna geçtiğiniz anda kalabalıktan izole, huzurlu bir ortama girersiniz.'
        ],
        knowBeforeYouGo: [
          'Taş avludaki masalar akşamları hızlı dolar; gitmeden önce rezervasyon yaptırmak tavsiye edilir.',
          'Pizzalar ince hamurlu olduğu için ortaya bir pizza ve bir ev yapımı makarna söyleyip paylaşmak idealdir.',
          'Bodrum Kalesi ve Marina yürüyüşü öncesi veya sonrasında kolayca yürüyerek ulaşılabilir.'
        ],
        verifiedRating: 4.6,
        reviewCount: 1520,
        ratingSource: 'Yerini Ayır Doğrulanmış Veri',
        isDemo: false,
        priceTier: '₺₺₺',
        bestTime: 'Akşam 18:30 - 22:30',
        localHeritageNote: 'Bodrum Çarşısı’nın geleneksel beyaz badanalı taş avlu mimarisini yaşayan bir Akdeniz mutfağına dönüştürüyor.',
        mapPosition: { x: 58, y: 68, lat: 37.0345, lng: 27.4312 },
        visitorExperiences: [
          {
            id: 'bd-5-v1',
            emoji: '🍕',
            text: 'Çarşının kalabalığından bir adım içeri girince begonviller altında çok şık bir bahçe çıkıyor; ince hamurlu pizzaları nefisti.',
            source: 'Yerini Ayır Rehber Notu',
            verified: true
          },
          {
            id: 'bd-5-v2',
            emoji: '🌿',
            text: 'Deniz mahsullü linguine ve roka-parmesan salatası çok tazeydi, servis ekibi de son derece ilgili.',
            source: 'Doğrulanmış Ziyaretçi Deneyimi',
            verified: true
          }
        ]
      },
      {
        id: 'bd-6',
        name: 'Zai Yaşam & Üçüncü Nesil Kahve',
        category: 'Nitelikli Kahve & Tatlı',
        isMustTry: false,
        neighborhood: 'Konacık · Zeytinlik Bahçesi',
        distanceText: 'Bodrum Merkez · 7 dk sürüş',
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Zeytin ağaçları arasında edebiyat, müzik ve gastronomiyi buluşturan yeni nesil kütüphane-kafe; nitelikli soğuk demleme kahveleri ve artizan tatlılarıyla dingin bir vaha.',
        signatureDish: 'Bodrum Mandalinalı Cold Brew & San Sebastian Cheesecake',
        signatureDishDetail: '18 saat soğuk demlenmiş kahvenin doğal Bodrum mandalinası kabuğu aromasıyla ferahlatıcı uyumu ve el yapımı tatlılar.',
        whyGo: [
          'Plaj ve çarşı hareketliliğinden uzaklaşıp zeytin ağaçları gölgesinde kitap okumak ve nitelikli kahve içmek için benzersizdir.',
          'Mimari tasarımı, taş duvarları ve klasik müzik yayınıyla Bodrum’un en kültür-sanat odaklı mekanıdır.',
          'Kahvenin yanı sıra hafif öğle kaseleri ve fırın ürünleriyle gün ortası molası için çok uygundur.'
        ],
        knowBeforeYouGo: [
          'Sessiz ve dingin konsepti korumak amacıyla mekan genelinde sakin bir konuşma tonu teşvik edilir.',
          'Akşamüstü düzenlenen akustik dinletiler veya söyleşi günlerini sosyal medya takviminden kontrol edebilirsiniz.',
          'Kendi otopark alanı mevcuttur.'
        ],
        verifiedRating: 4.7,
        reviewCount: 1890,
        ratingSource: 'DEMO Veri Seti',
        isDemo: true,
        priceTier: '₺₺₺',
        bestTime: 'Öğleden Sonra 14:00 - 18:30',
        localHeritageNote: 'Bodrum’un zeytinlik mirasını modern kütüphane ve nitelikli kahve kültürüyle birleştiren ödüllü yaşam alanı.',
        mapPosition: { x: 48,Y: 54, y: 54, lat: 37.0485, lng: 27.4012 } as any,
        visitorExperiences: [
          {
            id: 'bd-6-v1',
            emoji: '📚',
            text: 'Zeytin ağaçları altında fonda hafif caz ve klasik müzik eşliğinde kahve içmek Bodrum’daki en huzurlu saatlerimizdi.',
            source: 'DEMO Ziyaretçi Deneyimi',
            verified: false
          },
          {
            id: 'bd-6-v2',
            emoji: '🍊',
            text: 'Mandalinalı soğuk kahvesi yaz sıcağında inanılmaz ferahlatıcı; bahçe tasarımı her köşesiyle çok estetik.',
            source: 'DEMO Gurme Notu',
            verified: false
          }
        ]
      },
      {
        id: 'bd-7',
        name: 'Kısmet Lokantası',
        category: 'Yerel Esnaf & Ev Yemekleri',
        isMustTry: true,
        neighborhood: 'Konacık · Eski Çeşme Mevkii',
        distanceText: 'Merkez · 6 dk sürüş',
        image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Bodrum’un gerçek yerel mutfağını merak edenler için; çökertme kebabından kabak çiçeği dolmasına, keşkekten şevketi bostana günlük pişen Ege esnaf lokantası.',
        signatureDish: 'Bodrum Usulü Çökertme Kebabı & Zeytinyağlı Ege Otları',
        signatureDishDetail: 'Kibrit patates üzerinde sarımsaklı yoğurt ve jülyen bonfile dilimleri; yanında şevketi bostan, deniz börülcesi ve enginar.',
        whyGo: [
          'Bodrum’da yaşayan yerel halkın öğle yemeği için ilk tercih ettiği, samimi ve gerçek lezzet sunan esnaf lokantasıdır.',
          'Her gün 25’ten fazla zeytinyağlı Ege otu ve sıcak tencere yemeği taze olarak tezgâhta yerini alır.',
          'Turistik fiyatlamadan uzak, dürüst malzeme ve yüksek lezzet standardı sunar.'
        ],
        knowBeforeYouGo: [
          'Esnaf lokantası geleneğiyle öğle servisine odaklanır; en zengin çeşit için 12:00 - 14:30 arasında gitmelisiniz (akşam kapalıdır).',
          'Zeytinyağlı tezgâhından "karışık Ege otları tabağı" yaptırmak birçok lezzeti aynı anda tatmanızı sağlar.',
          'Cuma günleri çıkan geleneksel Bodrum keşkeğini denk gelirseniz kaçırmayın.'
        ],
        verifiedRating: 4.7,
        reviewCount: 3410,
        ratingSource: 'Doğrulanmış Rehber Ortalaması',
        isDemo: false,
        priceTier: '₺₺',
        bestTime: 'Öğle 11:30 - 15:30',
        localHeritageNote: 'Yarımadanın geleneksel düğün ve ev yemeklerini her gün öğle sofrasına taşıyan yerel gastronomi kalesi.',
        mapPosition: { x: 50, y: 48, lat: 37.0492, lng: 27.4105 },
        visitorExperiences: [
          {
            id: 'bd-7-v1',
            emoji: '🥘',
            text: 'Gerçek Bodrum çökertme kebabını ve zeytinyağlı kabak çiçeği dolmasını en lezzetli haliyle burada yedik.',
            source: 'Doğrulanmış Ziyaretçi Deneyimi',
            verified: true
          },
          {
            id: 'bd-7-v2',
            emoji: '🌿',
            text: 'Öğlen saat 1’de gittik, tezgâhtaki zeytinyağlı çeşitliliğine inananamadık; hızlı, tertemiz ve çok lezzetli.',
            source: 'Yerel Müdavim Notu',
            verified: true
          }
        ]
      }
    ]
  },

  sapanca: {
    id: 'sapanca',
    name: 'Sapanca & Kırkpınar',
    cityLabel: 'Sapanca',
    tagline: 'Sapanca Gölü kıyısından Maşukiye vadisine; kiremitte alabalık, taş fırın Karadeniz pidesi ve orman içi kahvaltılar.',
    culturalIntro:
      'Sapanca ve Kırkpınar hattında yeme-içme deneyimi doğayla bütünleşir. Sabah göl kıyısında veya kestane-ıhlamur ormanları içinde muhlamalı serpme kahvaltıyla başlayan gün, öğleden sonra Kırkpınar’ın taş fırınlarında pişen Çerkes peynirli pideler ve akşam vadi içindeki su sesleri eşliğinde kiremitte tereyağlı alabalıkla devam eder.',
    hasDateCategory: true,
    dateCategoryReason: 'Sapanca Gölü kıyısındaki iskele ve şömineli bahçe restoranları çiftlerin hafta sonu kaçamağı ve akşam yemeği (Date) beklentisine doğrudan yanıt verdiği için bu kategori aktif gösterilir.',
    categories: [
      'Mutlaka Denenmesi Gerekenler',
      'Göl Kenarı & Doğa Kahvaltısı',
      'Karadeniz & Taş Fırın Pide',
      'Orman İçi Izgara & Alabalık',
      'Nitelikli Kahve & Tatlı',
      'Date & Göl Manzaralı Akşam'
    ],
    venues: [
      {
        id: 'sp-1',
        name: 'Sasa Harmanlık',
        category: 'Mutlaka Denenmesi Gerekenler',
        isMustTry: true,
        neighborhood: 'Sapanca · Harmanlık Göl Kıyısı',
        distanceText: 'Sapanca Gölü Sıfır · 5 dk sürüş',
        image: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Sapanca Gölü’nün tam kıyısında, çim bahçesi ve ahşap iskelesiyle hem uzun hafta sonu kahvaltıları hem de göl manzaralı akşam yemekleri için bölgenin referans noktası.',
        signatureDish: 'Göl Kenarı Serpme Kahvaltı & Kiremitte Kaşarlı Alabalık',
        signatureDishDetail: 'Sıcak bakır sahanda muhlama, ev yapımı reçeller ve akşam servisinde tereyağlı kiremitte fırınlanmış alabalık.',
        whyGo: [
          'Sapanca Gölü’ne sıfır konumuyla suyun dinginliğini en yakından hissedebileceğiniz en bakımlı kıyı şeridine sahiptir.',
          'Sabah kahvaltısından akşam gün batımı yemeğine kadar günün her saatinde yüksek servis standardı sunar.',
          'Kış aylarında iç mekandaki şömine başı masaları, yazın ise göl üstü iskelesi çok keyiflidir.'
        ],
        knowBeforeYouGo: [
          'Hafta sonu kahvaltısı için göl kenarındaki ilk sıra masalara oturmak istiyorsanız saat 09:30’dan önce orada olun.',
          'Akşamüstü gün batımı saatinde göl kıyısında sadece kahve veya tatlı molası için de uğranabilir.',
          'Geniş otopark alanı mevcuttur.'
        ],
        verifiedRating: 4.5,
        reviewCount: 2340,
        ratingSource: 'Yerini Ayır Doğrulanmış Veri',
        isDemo: false,
        priceTier: '₺₺₺',
        bestTime: 'Sabah 09:30 & Gün Batımı 18:00',
        localHeritageNote: 'Harmanlık sahil şeridinde göl ekosistemiyle uyumlu bahçe düzenini yıllardır koruyan simge işletme.',
        mapPosition: { x: 48, y: 36, lat: 40.6912, lng: 30.2584 },
        visitorExperiences: [
          {
            id: 'sp-1-v1',
            emoji: '🌊',
            text: 'Gölün hemen kıyısında, su sesini dinleyerek kahvaltı yapmak bütün haftanın yorgunluğunu alıyor; muhlaması çok başarılı.',
            source: 'Yerini Ayır Rehber Notu',
            verified: true
          },
          {
            id: 'sp-1-v2',
            emoji: '🔥',
            text: 'Sonbahar akşamında şömine başında kiremitte alabalık yedik, hem atmosfer hem servis kalitesi Sapanca’nın en iyisi.',
            source: 'Doğrulanmış Misafir Yorumu',
            verified: true
          }
        ]
      },
      {
        id: 'sp-2',
        name: 'Tırtıl Fırın & Pide Kırkpınar',
        category: 'Karadeniz & Taş Fırın Pide',
        isMustTry: true,
        neighborhood: 'Kırkpınar · Bağdat Caddesi',
        distanceText: 'Kırkpınar Merkez · 3 dk yürüyüş',
        image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Kırkpınar’ın efsanevi taş fırını; yerel Çerkes peyniri, Trabzon tereyağı ve organik yumurtayla hazırlanan çıtır pideleriyle müdavimlerin değişmez öğle durağı.',
        signatureDish: 'Tereyağlı & Çerkes Peynirli Açık Taş Fırın Pidesi',
        signatureDishDetail: 'İnce kenarlı çıtır hamur üzerinde eriyen yerel peynir karışımı, fırından çıkarken eklenen köy tereyağı ve sarısı patlatılan yumurta.',
        whyGo: [
          'Bölgenin Çerkes ve Karadeniz mutfak mirasını taş fırın zanaatıyla birleştiren en özgün lezzet noktasıdır.',
          'Hamuru ince ve çıtır olduğu için klasik ağır pidelerin aksine çok hafif ve aromatik bir tat bırakır.',
          'Fırından çıkan sıcak ekşi mayalı köy ekmekleri ve cevizli çörekleri de eve dönüşte almak için harikadır.'
        ],
        knowBeforeYouGo: [
          'Pideler sipariş üzerine taş fırına verildiği için 12-15 dakika hazırlık süresi vardır; sıcacık masaya gelir.',
          'Ortaya bir peynirli-yumurtalı, bir de kavurmalı pide söyleyip paylaşmak en çok tercih edilen yöntemdir.',
          'Kırkpınar Bağdat Caddesi üzerinde yürüyüş yaparken kolayca uğranabilir.'
        ],
        verifiedRating: 4.7,
        reviewCount: 1490,
        ratingSource: 'Yerini Ayır Doğrulanmış Veri',
        isDemo: false,
        priceTier: '₺₺',
        bestTime: 'Öğle 12:00 - 17:00',
        localHeritageNote: 'Kırkpınar’ın köklü Çerkes peyniri kültürünü geleneksel odunlu taş fırınla yaşatan mahalle fırını.',
        mapPosition: { x: 28, y: 48, lat: 40.6985, lng: 30.2112 },
        visitorExperiences: [
          {
            id: 'sp-2-v1',
            emoji: '🫓',
            text: 'Peynirli yumurtalı pidenin kenar çıtırlığı ve üzerindeki tereyağının kokusu inanılmaz; her Sapanca gelişimizde mutlaka uğruyoruz.',
            source: 'Yerini Ayır Rehber Notu',
            verified: true
          },
          {
            id: 'sp-2-v2',
            emoji: '🥖',
            text: 'Çıkarken aldığımız cevizli taş fırın ekmeği üç gün boyunca tazeliğini korudu, gerçek bir mahalle zanaatkârı.',
            source: 'Doğrulanmış Ziyaretçi Deneyimi',
            verified: true
          }
        ]
      },
      {
        id: 'sp-3',
        name: 'Natürköy Seyir & Orman Sofrası',
        category: 'Göl Kenarı & Doğa Kahvaltısı',
        isMustTry: true,
        neighborhood: 'Mahmudiye · Dere & Orman Vadisi',
        distanceText: 'Sapanca Merkez · 10 dk sürüş',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Mahmudiye vadisinde şelale ve dere sesleri arasında, dev çınar ve kestane ağaçlarının altında sunulan zengin köy kahvaltısı ve kiremit lezzetleri.',
        signatureDish: 'Dere Kenarı Serpme Köy Kahvaltısı & Kiremitte Mantar',
        signatureDishDetail: 'Bakır sahanda eritme köy peyniri, bazlama, acuka, ev reçelleri ve odun fırınında kaşarlı kiremit mantarı.',
        whyGo: [
          'Şehir gürültüsünden tamamen kopup akan suyun ve kuş seslerinin içinde kahvaltı yapma imkanı verir.',
          'Geniş vadi arazisi sayesinde kahvaltı sonrası doğa yürüyüşü yapmak için kendi parkurları bulunur.',
          'Sıcak kiremitte gelen eritme peynir ve mantar çeşitleri masada uzun süre sıcaklığını korur.'
        ],
        knowBeforeYouGo: [
          'Vadi içi Sapanca merkezden 3-4 derece daha serin olabilir; sabah erken saatler için yanınıza hafif bir hırka alın.',
          'Hafta sonu öğle saatlerinde girişte yoğunluk olabildiğinden sabah 09:30 - 10:30 arası gitmek en huzurlu zamandır.',
          'Çocuklu aileler için geniş çim alanlar ve yürüyüş köprüleri oldukça güvenlidir.'
        ],
        verifiedRating: 4.4,
        reviewCount: 3820,
        ratingSource: 'Yerini Ayır Doğrulanmış Veri',
        isDemo: false,
        priceTier: '₺₺',
        bestTime: 'Sabah 09:00 - 13:00',
        localHeritageNote: 'Mahmudiye deresinin doğal su değirmeni ve vadi florasını koruyarak doğa içi gastronomi sunan vadi yerleşkesi.',
        mapPosition: { x: 65, y: 66, lat: 40.6682, lng: 30.2445 },
        visitorExperiences: [
          {
            id: 'sp-3-v1',
            emoji: '🌲',
            text: 'Dere kenarındaki ahşap masalarda su sesi eşliğinde kahvaltı yapmak ve sonrasında vadide yürümek harika bir hafta sonu ritüeli.',
            source: 'Yerini Ayır Rehber Notu',
            verified: true
          },
          {
            id: 'sp-3-v2',
            emoji: '🍄',
            text: 'Kahvaltıya ek olarak söylediğimiz kiremitte kaşarlı mantar ve sıcak bazlama çok lezzetliydi.',
            source: 'Doğrulanmış Ziyaretçi Yorumu',
            verified: true
          }
        ]
      },
      {
        id: 'sp-4',
        name: 'Sopeli Doğal Yaşam & Alabalık',
        category: 'Orman İçi Izgara & Alabalık',
        isMustTry: false,
        neighborhood: 'Kırkpınar · Soğucak Yolu Vadi İçi',
        distanceText: 'Kırkpınar · 6 dk sürüş',
        image: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Yemyeşil vadi içinde akan şelalelerin kıyısında, Karadeniz mutfağı dokunuşları ve kiremitte tereyağlı alabalığıyla öne çıkan doğa restoranı.',
        signatureDish: 'Kiremitte Fındıklı-Tereyağlı Alabalık & Karalahana Sarması',
        signatureDishDetail: 'Odun fırınında tereyağı ve mantarla pişirilen kılçıksız alabalık, yanında mısır ekmeği ve sıcak helva.',
        whyGo: [
          'Bungalov veya otel konaklaması sırasında doğadan kopmadan öğle ve akşam yemeği yemek için çok ferah bir vadidir.',
          'Alabalık sevmeyenler için kiremitte köfte ve ızgara et seçenekleri de aynı taş fırın özeniyle hazırlanır.',
          'Yemek üstüne kiremitte sıcak gelen fırın helvası çayla birlikte mükemmel gider.'
        ],
        knowBeforeYouGo: [
          'Şelale kenarındaki üst teras masaları en güzel manzaraya sahiptir; otururken bu bölümü tercih edebilirsiniz.',
          'Yağmurlu havalarda bile cam tavanlı kış bahçesi bölümleri sayesinde doğa manzarası kesintisiz izlenir.',
          'Mısır ekmeği ve turşu kavurmasını başlangıç olarak ortaya isteyebilirsiniz.'
        ],
        verifiedRating: 4.5,
        reviewCount: 1960,
        ratingSource: 'DEMO Veri Seti',
        isDemo: true,
        priceTier: '₺₺₺',
        bestTime: 'Öğle & Akşam 12:30 - 20:30',
        localHeritageNote: 'Soğucak yaylasından inen kaynak sularının oluşturduğu vadide Karadeniz ve Sakarya mutfak kültürünü buluşturuyor.',
        mapPosition: { x: 36, y: 72, lat: 40.6745, lng: 30.2015 },
        visitorExperiences: [
          {
            id: 'sp-4-v1',
            emoji: '🐟',
            text: 'Kiremitte tereyağlı alabalık ve mısır ekmeği ikilisi doğa havasında iştah açıyor; fırın helvasını da mutlaka deneyin.',
            source: 'DEMO Ziyaretçi Deneyimi',
            verified: false
          },
          {
            id: 'sp-4-v2',
            emoji: '🌿',
            text: 'Ağaçların ve şelalelerin arasında çok bakımlı bir tesis, servis hızlı ve çalışanlar güler yüzlü.',
            source: 'DEMO Misafir Notu',
            verified: false
          }
        ]
      },
      {
        id: 'sp-5',
        name: 'Beta Home Göl Evi & Roastery',
        category: 'Nitelikli Kahve & Tatlı',
        isMustTry: false,
        neighborhood: 'Kırkpınar · Sahil Yürüyüş Yolu',
        distanceText: 'Göl Sahili · 4 dk yürüyüş',
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Göl kıyısındaki sessiz bahçesinde üçüncü nesil demleme kahveler, ev yapımı limonatalar ve günlük fırın tatlıları sunan huzurlu mola noktası.',
        signatureDish: 'Orman Meyveli Mereng Tart & El Demlemesi Filtre Kahve',
        signatureDishDetail: 'Taze Sapanca böğürtlenleri ve ahududularla hazırlanan çıtır mereng tart ile taze çekilmiş nitelikli kahve.',
        whyGo: [
          'Büyük kahvaltı ve alabalık tesislerinin kalabalığından sıyrılıp göl kenarında sakin bir kahve-tatlı molası vermek için idealdir.',
          'Ahşap iskele ve göl manzaralı minderli bahçe köşeleri öğleden sonra dinlenmek için çok konforludur.',
          'Tatlıları günlük olarak butik ölçekte üretilir.'
        ],
        knowBeforeYouGo: [
          'Göl kenarı bisiklet ve yürüyüş yolu üzerinde olduğu için yürüyüş molası olarak uğramaya çok uygundur.',
          'Gün batımına 1 saat kala bahçedeki göl önü koltukları hızla dolmaktadır.',
          'Bitki çayı sevenler için taze ıhlamur ve kış çayı karışımları çok başarılıdır.'
        ],
        verifiedRating: 4.6,
        reviewCount: 740,
        ratingSource: 'DEMO Veri Seti',
        isDemo: true,
        priceTier: '₺₺',
        bestTime: 'Öğleden Sonra 14:30 - 18:30',
        localHeritageNote: 'Kırkpınar sahilinin dingin göl evi kültürünü nitelikli kahve ve butik pastacılıkla birleştiren durak.',
        mapPosition: { x: 40, y: 32, lat: 40.7012, lng: 30.2285 },
        visitorExperiences: [
          {
            id: 'sp-5-v1',
            emoji: '☕',
            text: 'Sapanca’da gerçekten iyi demlenmiş nitelikli kahve ve taze tart bulabildiğimiz en sakin göl kıyısı bahçesi.',
            source: 'DEMO Ziyaretçi Deneyimi',
            verified: false
          },
          {
            id: 'sp-5-v2',
            emoji: '🌅',
            text: 'Göl kenarında yürüyüş yaptıktan sonra gün batımına karşı kahve içmek için uğradık, ortam çok nezih.',
            source: 'DEMO Müdavim Notu',
            verified: false
          }
        ]
      },
      {
        id: 'sp-6',
        name: 'Ugurlu Dükkan & Göl Bahçesi',
        category: 'Date & Göl Manzaralı Akşam',
        isMustTry: true,
        neighborhood: 'Kırkpınar · Hasanpaşa',
        distanceText: 'Kırkpınar · 4 dk sürüş',
        image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=900',
        editorialDescription: 'Yemyeşil bakımlı bahçesi, şömineli cam salonu, odun ateşinde pişen etleri ve özenli sunumlarıyla Sapanca’da romantik akşam yemeği için en seçkin adres.',
        signatureDish: 'Ağır Ateşte Dana Kaburga & Karamelize Soğanlı Çökertme',
        signatureDishDetail: 'Odun fırınında saatlerce dinlendirilmiş lokum kıvamında dana kaburga, trüflü patates püresi ve mevsim sebzeleriyle.',
        whyGo: [
          'Sapanca’daki klasik kahvaltıcı/alabalıkçı çizgisinin dışında, şık bir akşam yemeği (Date) atmosferi sunar.',
          'Akşam aydınlatması, şömine sıcaklığı ve geniş masa aralıklarıyla çiftler için mahremiyet ve konfor sağlar.',
          'Et pişirme teknikleri ve tatlı sunumları İstanbul’un iyi bistrolarıyla yarışacak kalitededir.'
        ],
        knowBeforeYouGo: [
          'Cuma ve Cumartesi akşamları için gitmeden önce mutlaka rezervasyon yaptırılması önerilir.',
          'Kışın şömine yanı masaları, bahar ve yaz aylarında ise ağaçlar altındaki bahçe masalarını tercih edin.',
          'Yemek sonunda sıcak çikolatalı sufle siparişinizi hazırlık süresi nedeniyle ana yemekle birlikte verebilirsiniz.'
        ],
        verifiedRating: 4.6,
        reviewCount: 1620,
        ratingSource: 'Yerini Ayır Doğrulanmış Veri',
        isDemo: false,
        priceTier: '₺₺₺₺',
        bestTime: 'Akşam 18:30 - 22:30',
        localHeritageNote: 'Kırkpınar’ın bahçe mimarisini modern bistro mutfağıyla birleştirerek bölgede akşam yemeği standardını yükselten mekan.',
        mapPosition: { x: 22, y: 58, lat: 40.6924, lng: 30.2054 },
        visitorExperiences: [
          {
            id: 'sp-6-v1',
            emoji: '🕯️',
            text: 'Bungalov tatilimizde akşam şık bir yemek için tercih ettik; bahçe ışıklandırması ve dana kaburgası beklentimizin çok üzerindeydi.',
            source: 'Yerini Ayır Rehber Notu',
            verified: true
          },
          {
            id: 'sp-6-v2',
            emoji: '🥩',
            text: 'Sapanca’da alabalık dışında özenli bir akşam yemeği arayan çiftler için tartışmasız en iyi alternatif.',
            source: 'Doğrulanmış Misafir Yorumu',
            verified: true
          }
        ]
      }
    ]
  }
};
