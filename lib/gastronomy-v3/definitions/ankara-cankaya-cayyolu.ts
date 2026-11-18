import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ANKARA_CANKAYA_CAYYOLU_DEF: V3RegionDefinition = {
  id: 'ankara-cankaya-cayyolu',
  slug: 'cayyolu-park-caddesi',
  city: 'Ankara',
  district: 'Çankaya',
  allowedDistricts: ['Çankaya', 'Çayyolu'],
  neighborhood: 'Çayyolu & Park Caddesi',
  officialQuarter:
    'Prof. Dr. Ahmet Taner Kışlalı, Koru & Konutkent Mahalleleri (Park Caddesi / 2864. Cd., Alacaatlı Cd., Bangabandhu Blv., Ankaralılar Cd., Ihlamur Cd. & Konutkent Aksları)',
  displayName: 'Çayyolu & Park Caddesi, Çankaya, Ankara',
  locative: "Çayyolu ve Park Caddesi'nde",
  path: ['ankara', 'cankaya', 'cayyolu-park-caddesi'],
  aliases: [
    'Çayyolu',
    'Cayyolu',
    'Çayyolu Ankara',
    'Çayyolu Çankaya',
    'Park Caddesi',
    'Park Cadde',
    'Park Caddesi Ankara',
    'Park Caddesi Çayyolu',
    'Koru',
    'Koru Ankara',
    'Konutkent',
    'Ahmet Taner Kışlalı',
    'Ahmet Taner Kislali',
    'Ankaralılar Caddesi',
  ],
  scopeNote:
    'Çayyolu & Park Caddesi (Ahmet Taner Kışlalı, Koru & Konutkent, Doğan Taşdelen Blv. batısı; Ümitköy, Beysukent, Yaşamkent ve Alacaatlı güneyi hariç) · Doğrulanmış Seçki',
  characterSubtitle:
    'Park Caddesi ve Onyx’ten Koru Çarşısı, Ankaralılar Caddesi ve Konutkent’e uzanan; odun fırını Napoli pizzacıları, ev yapımı smash burger ve pub durakları, üçüncü dalga matcha-kahve mekânları, modern meyhaneler, ekşi mayalı artizan fırınlar ve Konutkent deniz ürünleri sofrası.',
  center: { lat: 39.8765, lng: 32.6835 },
  bbox: { minLat: 39.8630, maxLat: 39.9000, minLng: 32.6680, maxLng: 32.6975 },
  allowedNeighborhoodTokens: [
    'Prof. Dr. Ahmet Taner Kışlalı',
    'Ahmet Taner Kışlalı',
    'Ahmet Taner Kislali',
    'Çayyolu',
    'Cayyolu',
    'Koru',
    'Konutkent',
  ],
  categories: buildRegionCategories(),
  candidates: [
    // =========================================================================
    // 1. PİZZA (2 bağımsız odun/taş fırın İtalyan noktası)
    // =========================================================================
    compactSeed({
      id: 'cayyolu-borgo-due',
      placeId: 'ChIJNU5XrWE50xQRmdPXcqi2Uxk',
      cat: 'pizza',
      name: 'Borgo Due | Ristorante & Pizzeria',
      brand: 'Borgo',
      area: '2092. Cd., Ahmet Taner Kışlalı',
      signals: ['eksimaya-napoli', 'tas-firin', 'el-yapimi-makarna'],
      desc:
        'Ahmet Taner Kışlalı 2092. Cadde üzerinde ekşi mayalı hamurla odun-taş fırında pişen Napoli pizzaları, günlük el yapımı taze makarnaları, risotto çeşitleri ve klasik tiramisu sunumuyla öne çıkan bağımsız Çayyolu İtalyan restoranı.',
      order: ['Odun Fırını Burrata / Margherita Pizza', 'El Yapımı Taze Makarna', 'Tiramisu'],
      menu: ['Margherita', 'Burrata Pizza', 'Bresaola Pizza', 'El Yapımı Makarna & Risotto', 'Focaccia & Carpaccio'],
      sec: [
        [
          'El Yapımı Taze Makarna & Başlangıçlar',
          'Ekşi mayalı pizzaların yanı sıra ev yapımı taze makarna, risotto ve carpaccio başlangıçları aynı mutfak özeniyle sunulur.',
          'İşletme mutfak menüsü ve misafir değerlendirmeleri',
        ],
      ],
      seat: 'Şık aydınlatmalı, çiftler ve akşam yemeği buluşmalarına uygun ferah salon',
      crowd: 'Hafif ekşi mayalı Napoli pizzası ve sakin akşam İtalyan sofrası arayanlar',
      dis: 'Hafta sonu akşamlarında doluluk artar; rezervasyonla gitmek rahatlık sağlar',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi 2092. Cadde No:7/12 (Koru hattına kısa araç mesafesi).',
      sources: [
        [
          'Borgo Due Resmi Sitesi',
          'https://borgo-due.com.tr/',
          'operator',
          'Artizan İtalyan mutfağı, ekşi mayalı pizza ve el yapımı makarna menüsü',
        ],
        [
          'Restoranim Borgo Due',
          'https://www.restoranim.net/',
          'editorial',
          'Çayyolu Napoli pizzası, hafif hamur ve akşam buluşması değerlendirmeleri',
        ],
      ],
      pros: ['Ekşi mayalı Napoli pizza ve el yapımı makarnayı bir arada başarıyla sunması', 'Sakin, özenli İtalyan restoranı atmosferi'],
      cons: ['Metro yürüyüşü yerine özel araç veya taksi ile ulaşım daha pratik'],
      unc: ['Hafta sonu akşamları masa bekleme ihtimali oluşabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-makka-ankara',
      placeId: 'ChIJfahc8ho50xQRq8d0E4q5mxI',
      cat: 'pizza',
      name: 'Makka Ankara',
      brand: 'Makka',
      area: 'Park Cd. · Onyx, Ahmet Taner Kışlalı',
      signals: ['tas-firin-pizza', 'taze-makarna', 'onyx-cayyolu'],
      desc:
        'Park Caddesi Onyx Yaşam Merkezi bünyesinde taş fırın pizzaları, parmesan tekerinde servis edilen Makka Alfredo ve günlük açılan ravioli-tagliatelle tabaklarıyla bilinen bağımsız craft İtalyan mutfağı.',
      order: ['Taş Fırın İtalyan Pizza', 'Makka Alfredo / El Yapımı Ravioli', 'Arancini & Panzerotti'],
      menu: ['Taş Fırın Pizzalar', 'Makka Alfredo', 'Lazanya', 'Rigatoni Pesto', 'Burrata & Carpaccio'],
      sec: [
        [
          'Günlük Taze Makarna & İtalyan Atıştırmalıkları',
          'Taş fırın pizzalara eşlik eden günlük ravioli, tagliatelle ve arancini tabakları akşam servisinin ana direğini oluşturur.',
          'İşletme mutfak menüsü ve şehir rehberi kayıtları',
        ],
      ],
      seat: 'Onyx Çayyolu içinde modern, temiz ve şık masa düzeni',
      crowd: 'Kutlama yemekleri, çiftler ve İtalyan pasta-pizza ikilisi arayan Park Caddesi müdavimleri',
      dis: 'Üst-orta fiyat bandındadır; pizzalar yanında özellikle taze makarnaları öne çıkar',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi Selçuk Yula Caddesi Onyx Çayyolu No:25C/20.',
      sources: [
        [
          'Makka Craft Kitchen Resmi Sitesi',
          'https://makkacraftkitchen.com/',
          'operator',
          'Onyx Çayyolu adresi, el yapımı makarna ve taş fırın pizza menüsü',
        ],
        [
          'Menu-TR Makka Ankara',
          'https://www.menu-tr.com/',
          'editorial',
          'Alfredo, ravioli ve taş fırın pizza değerlendirmeleri',
        ],
      ],
      pros: ['Günlük taze açılan makarna ve taş fırın pizza birlikteliği', 'Temiz, özenli Onyx yaşam alanı konumu'],
      cons: ['Makarnalara kıyasla pizza beklentisi zaman zaman ikinci planda kalabiliyor'],
      unc: ['Hafta sonu akşam saatlerinde Onyx çevresinde otopark yoğunluğu artabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 2. HAMBURGER (3 bağımsız burger ve pub noktası)
    // =========================================================================
    compactSeed({
      id: 'cayyolu-drool',
      placeId: 'ChIJhykwwTo50xQR7cOGg3jKOBs',
      cat: 'hamburger',
      name: 'Drool',
      brand: 'Drool',
      area: 'Ankaralılar Cd., Çayyolu',
      signals: ['smash-burger', 'ev-yapimi-ekmek', 'fistik-yaginda-patates'],
      desc:
        'Ankaralılar Caddesi üzerinde kendi fırınlarında pişirdikleri hafif ekmekler arasında S’den XXL’ye katmanlanan Drool ve Truffe smash burgerleri, yer fıstığı yağında çıtır patatesi ve Nashville Hot Mozzarella ile öne çıkan yeni nesil burgerci.',
      order: ['Drool Smash Burger', 'Truffe Smash Burger', 'Nashville Hot Mozzarella'],
      menu: ['Drool Smash', 'Truffe Smash', 'Yer Fıstığı Yağında Patates', 'Nashville Hot Mozzarella'],
      sec: [
        [
          'Yer Fıstığı Yağında Patates & Hot Mozzarella',
          'Şişkinlik yapmayan ev yapımı brioche ekmekler kadar yer fıstığı yağında kızaran patatesler ve uzayan peynirli atıştırmalık da tercih edilir.',
          'Yerel mutfak rehberleri ve menü incelemeleri',
        ],
      ],
      seat: 'Dinamik ve modern şehir burgercisi konseptinde iç-dış masalar',
      crowd: 'Yeni nesil ince kenarlı çıtır smash burger tutkunları ve akşamüstü atıştırması arayanlar',
      dis: 'Popüler akşam saatlerinde sipariş bekleme süresi uzayabilir; klasik kalın köfte yerine smash stilidir',
      transit: 'Çayyolu Mahallesi Ankaralılar Caddesi No:21 D:12 (Gordion AVM karşısı aksı).',
      sources: [
        [
          'Restoranim Drool Çayyolu',
          'https://www.restoranim.net/',
          'editorial',
          'Ev yapımı ekmek, Drool/Truffe smash burger ve patates övgüsü',
        ],
        [
          'Menu-TR Drool',
          'https://www.menu-tr.com/',
          'community',
          'Ankaralılar Cd. konumu, katmanlı porsiyonlar ve Nashville Hot Mozzarella detayları',
        ],
      ],
      pros: ['Şişkinlik yapmayan kendi yapımları ekmek ve dengeli smash köfte', 'Ankaralılar Cd. üzerinde kolay ulaşım'],
      cons: ['Yoğun saatlerde masa sirkülasyonu yüksek olabiliyor'],
      unc: ['Köfte adedine göre değişen porsiyon tercihleri kalabalık gruplarda siparişi uzatabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-mojo-house',
      placeId: 'ChIJH-RgYe050xQRyUFDeuz7Rbs',
      cat: 'hamburger',
      name: 'Mojo House',
      brand: 'Mojo',
      area: 'Park Cd., Ahmet Taner Kışlalı',
      signals: ['gurme-burger', 'kokteyl-pub', 'dart-masalari'],
      desc:
        'Park Caddesi 2864. Sokak üzerinde katkısız dana köfteli cheddar burgerleri, imza kokteylleri, zengin bira seçkisi ve kasıntısız pub-dart ortamıyla sevilen samimi Çayyolu burger ve pub mekânı.',
      order: ['Cheddar Gurme Burger', 'İmza Kokteyller', 'Çıtır Pub Atıştırmalıkları'],
      menu: ['Cheddar Burger', 'Gurme Burgerler', 'Kokteyl Seçkisi', 'Bira & Atıştırmalıklar'],
      sec: [
        [
          'Kokteyl Barı & Dart Turnuvası Akşamları',
          'Akşam saatlerinde mutfaktan çıkan burgerlere kokteyl menüsü ve mekândaki dart masalarında sosyal pub etkinlikleri eşlik eder.',
          'Şehir rehberleri ve müdavim değerlendirmeleri',
        ],
      ],
      seat: 'Dart masaları ve bar bankosuyla samimi, kasıntısız Park Caddesi pub düzeni',
      crowd: 'İyi burger yanında kokteyl-bira içmek ve arkadaşlarıyla vakit geçirmek isteyenler',
      dis: 'Mutfak öğleden sonra erken saatlerde kapalı olabildiği için burger için akşam saatlerinde gitmek daha uygundur',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi 2864. Cadde No:42/L (Park Caddesi aksı).',
      sources: [
        [
          'Restoranim Mojo House',
          'https://www.restoranim.net/',
          'editorial',
          'Katkısız gurme cheddar burgerler, kokteyller ve akşam mutfak saati notu',
        ],
        [
          'Menu-TR Mojo House',
          'https://www.menu-tr.com/',
          'editorial',
          'Park Cd. pub konsepti, dart masaları ve menü değerlendirmeleri',
        ],
        [
          'Yandex Haritalar Mojo House',
          'https://yandex.com.tr/',
          'community',
          'Konum ve ziyaretçi memnuniyeti doğrulaması',
        ],
      ],
      pros: ['Katkısız ev yapımı burger köftesi ve samimi pub atmosferi', 'Park Caddesi üzerinde yüksek müdavim memnuniyeti'],
      cons: ['Gündüz/erken öğleden sonra mutfak servisi sınırlı olabiliyor'],
      unc: ['Cuma dart etkinliği akşamlarında kalabalık erken başlar'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-hamburglu',
      placeId: 'ChIJF2YKcgA50xQRQaxauqZUPuM',
      cat: 'hamburger',
      name: 'Hamburglu',
      brand: 'Hamburglu',
      area: 'Mesa Plaza, Koru',
      signals: ['butik-burger', 'mesa-plaza', 'koru-avm'],
      desc:
        'Koru Mahallesi Mesa Plaza AVM’nin birinci katında hizmet veren; günlük hazırlanan köftesi, sadeleştirilmiş butik menüsü ve düzenli porsiyonlarıyla hızlı ve güvenilir burger durağı sunan yerel nokta.',
      order: ['Klasik Ev Yapımı Burger', 'Cheeseburger & Patates'],
      menu: ['Klasik Burger', 'Cheeseburger', 'Çıtır Patates Kızartması'],
      sec: [
        [
          'Mesa Plaza Koru Kolay Erişimi',
          'Koru metro kavşağındaki Mesa Plaza içinde yer aldığı için günlük iş veya alışveriş arasında pratik durak sağlar.',
          'Mesa Plaza dizini ve ziyaretçi değerlendirmeleri',
        ],
      ],
      seat: 'AVM içi hızlı servis ve pratik oturma düzeni',
      crowd: 'Koru Metro çevresinde pratik ve doyurucu ev yapımı burger arayanlar',
      dis: 'AVM katında yer aldığı için sokak restoranı ambiyansı sunmaz',
      transit: 'Koru Mahallesi Mesa Plaza AVM 1. Kat No:2 D:28 (Koru Metro çıkışı yanı).',
      sources: [
        [
          'Mesa Plaza AVM Dizini',
          'https://mesaplaza.com.tr/',
          'editorial',
          'Mesa Plaza 1. Kat konumu ve hizmet bilgileri',
        ],
        [
          'Yandex Haritalar Hamburglu',
          'https://yandex.com.tr/',
          'community',
          'Ev yapımı burger kalitesi ve Koru konumu değerlendirmeleri',
        ],
      ],
      pros: ['Koru Metro hemen yanında pratik ulaşım', 'Sade ve temiz ev yapımı burger menüsü'],
      cons: ['AVM ortamı nedeniyle uzun akşam oturumları için sınırlı ambiyans'],
      unc: ['AVM kapanış saatlerine bağlı olarak geç akşam servisi bulunmaz'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 3. KAHVE (%100 saf nitelikli kahve / matcha uzmanları)
    // =========================================================================
    compactSeed({
      id: 'cayyolu-solid-and-stripe',
      placeId: 'ChIJNTKg63c50xQRbHfmbCbXblU',
      cat: 'kahve',
      name: 'Solid and Stripe coffee',
      brand: 'Solid',
      area: 'Bangabandhu Blv., Ahmet Taner Kışlalı',
      signals: ['v60-ve-chemex', 'genis-calisma-alani', 'bilardo-kafesi'],
      desc:
        'Bangabandhu Bulvarı Özçelik İş Merkezi’nde V60 ve Chemex gibi nitelikli demleme yöntemlerini, geniş çalışma odalarını ve bilardo-sosyalleşme alanlarını tek çatı altında birleştiren Çayyolu kahvecisi.',
      order: ['V60 / Chemex Filtre Kahve', 'Espresso Bazlı İçimler'],
      menu: ['V60 & Chemex', 'Flat White', 'Sıcak Çikolata & Dünya Çayları'],
      sec: [
        [
          'Çalışma Odaları & Sosyal Oyun Alanları',
          'Ayrı çalışma bölümleri ve bilardo masalarıyla hem odaklanmak isteyenleri hem genç grupları ağırlayacak şekilde kurgulanmıştır.',
          'İşletme menü kayıtları ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Geniş iç hacimli, çalışma masaları ve bilardo alanları ayrılmış salon',
      crowd: 'Nitelikli demleme kahve eşliğinde çalışmak veya arkadaşlarıyla bilardo oynamak isteyenler',
      dis: 'Oyun alanında akşam saatlerinde hareketlilik arttığından sessizlik arayanlar çalışma bölümünü seçmelidir',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi Bangabandhu Bulvarı Özçelik İş Merkezi.',
      sources: [
        [
          'Menu-TR Solid and Stripe',
          'https://www.menu-tr.com/',
          'editorial',
          'V60, Chemex kahve seçkisi, çalışma odaları ve bilardo detayları',
        ],
        [
          'Restoranim Solid and Stripe',
          'https://www.restoranim.net/',
          'community',
          'Ahmet Taner Kışlalı konumu ve nitelikli kahve değerlendirmeleri',
        ],
      ],
      pros: ['V60 ve Chemex gibi el demlemelerine yer veren geniş mekân', 'Çayyolu içinde çalışma ve sosyalleşme dengesi'],
      cons: ['Tamamen sakin butik espresso barı yerine çok amaçlı sosyal mekân'],
      unc: ['Hafta sonu akşamları oyun alanına bağlı olarak doluluk yükselir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-whisk',
      placeId: 'ChIJCUMjdBE50xQRAUh8LvpH9Bg',
      cat: 'kahve',
      name: 'Whisk',
      brand: 'Whisk',
      area: 'Ankaralılar Cd., Çayyolu',
      signals: ['matcha-bar', 'nitelikli-kahve', 'butik-kafe'],
      desc:
        'Ankaralılar Caddesi üzerinde klasik nitelikli kahvelerinin yanı sıra farklı meyveli ve seremoniyel matcha latte çeşitleriyle Ankara’nın bu hattında ayrışan modern üçüncü dalga matcha ve kahve barı.',
      order: ['İmza Meyveli / Klasik Matcha Latte', 'Flat White & Soğuk Demlemeler'],
      menu: ['Matcha Latte Çeşitleri', 'Cortado & Flat White', 'Hafif Eşlikçi Tatlılar'],
      sec: [
        [
          'Meyveli & Seremoniyel Matcha Çeşitleri',
          'Espresso bazlı içeceklerin yanında mevsim meyveleri ve aromalarla hazırlanan taze matcha içecekleri en çok tercih edilen seçkidir.',
          'İşletme içecek menüsü ve şehir değerlendirmeleri',
        ],
      ],
      seat: 'Minimalist ve modern tasarımlı butik kahve-matcha barı masaları',
      crowd: 'Matcha kültürü meraklıları ve Ankaralılar Caddesi üçüncü dalga kahve severleri',
      dis: 'İç oturma alanı görece butik ölçeklidir; yoğun saatlerde yer bulmak zorlaşabilir',
      transit: 'Çayyolu Mahallesi Ankaralılar Caddesi No:21 D:30 (Gordion çevresi).',
      sources: [
        [
          'Whisk Resmi Sitesi',
          'https://whiskandmore.com/',
          'operator',
          'Matcha bar ve nitelikli kahve konsepti',
        ],
        [
          'Restoranim Whisk Çayyolu',
          'https://www.restoranim.net/',
          'editorial',
          'Ankaralılar Cd. konumu, matcha latte çeşitleri ve tatlı değerlendirmeleri',
        ],
      ],
      pros: ['Ankara batı aksında nitelikli matcha latte çeşitleriyle öne çıkması', 'Sade ve kaliteli kahve sunumu'],
      cons: ['Küçük oturma kapasitesi nedeniyle kalabalık çalışma gruplarına pek uygun değil'],
      unc: ['Yeni sezon aromalı matcha seçenekleri dönemsel yenilenir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 4. DATE MEKÂNLARI (4 akşam buluşması, şık restoran ve meyhane)
    // =========================================================================
    compactSeed({
      id: 'cayyolu-koru-adatepe',
      placeId: 'ChIJN8dSpks50xQRdAWnYmaSo8E',
      cat: 'date',
      name: 'Koru Adatepe Restoran',
      brand: 'Adatepe',
      area: 'Mesa Koru, Koru',
      signals: ['modern-meyhane', 'meze-izgara', 'mesa-koru'],
      desc:
        'Mesa Koru Ticaret Merkezi Ihlamur Caddesi’nde geleneksel meyhane kültürünü özenli sunumlarla modernleştiren; zengin soğuk-sıcak mezeleri, ızgara et seçenekleri ve düzenli servisiyle özel akşam buluşmalarının öne çıkan adresi.',
      order: ['Soğuk-Sıcak Meze Seçkisi', 'Izgara Et & Kebap Tabağı'],
      menu: ['Özel Soğuk Mezeler', 'Ara Sıcaklar', 'Izgara Kebap & Bonfile'],
      sec: [
        [
          'Özel Masa Sunumları & Akşam Fix Menüleri',
          'Çiftler ve özel kutlama masaları için mevsimlik meze tabaklarını tamamlayan düzenli akşam servisi sunulur.',
          'İşletme mutfak sunumları ve şehir değerlendirmeleri',
        ],
      ],
      seat: 'Mesa Koru içinde şık aydınlatmalı, örtülü ve konforlu restoran salonu',
      crowd: 'Özenli bir ortamda meze-ızgara sofrası paylaşmak isteyen çiftler ve özel akşam grupları',
      dis: 'Üst segment bütçededir; cuma-cumartesi akşamları önceden rezervasyon gerekir',
      transit: 'Koru Mahallesi Ihlamur Caddesi Mesa Koru Ticaret Merkezi No:7/3-7.',
      sources: [
        [
          'Koru Adatepe Resmi Sitesi',
          'http://koruadateperestoran.com/',
          'operator',
          'Modern Türk meyhane-restoran konsepti, meze ve ızgara menüleri',
        ],
        [
          'Restoranim Koru Adatepe',
          'https://www.restoranim.net/',
          'editorial',
          'Mesa Koru akşam yemeği, servis kalitesi ve meze incelemeleri',
        ],
      ],
      pros: ['Mesa Koru içinde sakin, şık ve oturmuş servis kalitesi', 'Meze ve et dengesini iyi kuran mutfak'],
      cons: ['Yüksek bütçe sınıfında konumlanır'],
      unc: ['Özel gün ve hafta sonu programlarında fiks menü şartları sorulmalıdır'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-kalamis-fish-meat',
      placeId: 'ChIJPwJAAxQ_0xQRsLR4TzfqDEw',
      cat: 'date',
      name: 'Çayyolu Kalamış | Fish & Meat',
      brand: 'Kalamış',
      area: 'Alacaatlı Cd., Ahmet Taner Kışlalı',
      signals: ['deniz-ve-et', 'modern-meyhane', 'ferah-mimari'],
      desc:
        'Alacaatlı Caddesi başında deniz ürünlerini, özenli kırmızı et tabaklarını ve modern wok dokunuşlarını şık ve ferah bir salon mimarisinde bir araya getiren modern Çayyolu akşam restoranı.',
      order: ['Baby Kalamar & Ahtapot Ara Sıcakları', 'Mevsim Balığı / Et Ana Yemeği', 'İmza Tatlı Kapanışı'],
      menu: ['Baby Kalamar', 'Ahtapot Topları', 'Mevsim Balıkları', 'Kırmızı Et & Wok Seçenekleri', 'Soğuk Mezeler'],
      sec: [
        [
          'Karma Deniz & Et Mutfağı Seçkisi',
          'Aynı sofrada taze balık tercih edenlerle kırmızı et veya wok seven misafirleri ortak kalite çizgisinde buluşturur.',
          'İşletme mutfak menüsü ve yemek rehberi kayıtları',
        ],
      ],
      seat: 'Ferah yüksek tavanlı, VIP oda seçenekli şık akşam salonu',
      crowd: 'Estetik sunumlu modern deniz ve et sofrası arayan çiftler ve kutlama masaları',
      dis: 'Çok yüksek fiyat segmentindedir; akşam yemekleri için önceden rezervasyon önerilir',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi Alacaatlı Caddesi No:30/8.',
      sources: [
        [
          'Çayyolu Kalamış Resmi Sitesi',
          'https://cayyolukalamis.com/',
          'operator',
          'Fish, meat ve wok konsepti, meze çeşitleri ve salon detayları',
        ],
        [
          'Ankara Rehber İncelemesi',
          'https://ankaradagezilecekyerler.com/',
          'editorial',
          'Ambiyans, estetik sunumlar ve modern meyhane değerlendirmeleri',
        ],
        [
          'Menu-TR Çayyolu Kalamış',
          'https://www.menu-tr.com/',
          'editorial',
          'Baby kalamar, balık ve et menüsü detayları',
        ],
      ],
      pros: ['Deniz ürünleri ile et mutfağını aynı kalite standardında sunması', 'Şık ve ferah akşam ambiyansı'],
      cons: ['Bölgenin en yüksek bütçeli akşam restoranlarından biri'],
      unc: ['VIP salon ve hafta sonu canlı performans günleri rezervasyonda teyit edilmelidir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-salkim-meyhane',
      placeId: 'ChIJE9fVZxY50xQRd2pziWQbpZw',
      cat: 'date',
      name: 'Salkım Meyhane',
      brand: 'Salkım',
      area: '2853. Cd., Ahmet Taner Kışlalı',
      signals: ['canli-muzik-meyhane', 'sef-mezeleri', 'koklu-cayyolu'],
      desc:
        '2853. Cadde üzerinde şef imzalı Atatürk Meze, fesleğenli Girit, balık simit ve pastırmalı humus gibi ara sıcaklarıyla canlı müzikli uzun Çayyolu akşamlarının en köklü ve yüksek hacimli adreslerinden biri.',
      order: ['Şefin Salkım Mezeleri & Girit', 'Balık Simit & Pastırmalı Humus', 'Antrikot Kavurma / Mevsim Balığı'],
      menu: ['Fesleğenli Girit', 'Pastırmalı Humus', 'Balık Simit', 'Antrikot Kavurma', 'Günün Balıkları'],
      sec: [
        [
          'Canlı Müzik Akşamları & Geniş Meze Masası',
          'Geniş salon yapısı sayesinde büyük kutlama ve sohbet sofralarına canlı müzik eşliğinde ev sahipliği yapar.',
          'Yerel menü kayıtları ve etkinlik değerlendirmeleri',
        ],
      ],
      seat: 'Geniş kapasiteli, yüksek tavanlı, sahne odaklı meyhane masaları',
      crowd: 'Canlı müzikli keyifli rakı-meze akşamı ve kutlama sofrası planlayanlar',
      dis: 'Canlı müzik gecelerinde kalabalık ve ses seviyesi artar; sakin baş başa fısıltı sohbetine uygun değildir',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi 2853. Cadde No:28 (Park Caddesi arkası).',
      sources: [
        [
          'Menu-TR Salkım Meyhane',
          'https://www.menu-tr.com/',
          'editorial',
          'Fesleğenli Girit, pastırmalı humus, balık simit ve antrikot kavurma menüsü',
        ],
        [
          'Yandex Haritalar Salkım Meyhane',
          'https://yandex.com.tr/',
          'community',
          'Canlı müzik, şef mezeleri ve yüksek misafir değerlendirmeleri',
        ],
      ],
      pros: ['Zengin ve tutarlı meze-ara sıcak seçkisi', 'Canlı müzikle birleşen oturmuş Çayyolu meyhane deneyimi'],
      cons: ['Kalabalık gruplar ve müzik nedeniyle gürültü düzeyi yüksek olabiliyor'],
      unc: ['Hafta sonu fiks menü içerikleri sezona göre değişebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-this-towns-last-stop',
      placeId: 'ChIJ14hxpNE40xQRD5Ios42jMF8',
      cat: 'date',
      name: "This Town's Last Stop",
      brand: 'Last',
      area: 'Park Cd., Ahmet Taner Kışlalı',
      signals: ['park-cd-gastropub', 'teras-bar', 'bistro-tabaklari'],
      desc:
        'Park Caddesi 2864. Cadde üzerindeki teras alanı, et-tavuk ana yemekleri, vegan seçenekler sunan gastropub mutfağı ve akşam içecek barıyla rahat akşam buluşmalarının öne çıkan Park Caddesi durağı.',
      order: ['Gastropub Et / Tavuk Ana Yemekleri', 'Paylaşımlı Atıştırmalık Tabağı & Bar İçecekleri'],
      menu: ['Et & Tavuk Tabakları', 'Vegan Alternatifler', 'Paylaşımlı Atıştırmalıklar', 'Kokteyl & Bira Barı'],
      sec: [
        [
          'Park Caddesi Teras & Paylaşımlı Bistro Servisi',
          'Meyhane yerine rahat müzik eşliğinde bira-kokteyl ve sıcak bistro tabakları tercih edenlerin buluşma noktasıdır.',
          'İşletme mutfak sunumları ve şehir rehberleri',
        ],
      ],
      seat: 'Park Caddesi cepheli açık teras ve sıcak aydınlatmalı iç pub alanı',
      crowd: 'Meyhane dışında modern gastropub akşamı arayan çiftler ve arkadaş grupları',
      dis: 'Akşam teras masaları hızlı dolar; hafta sonu müzikle beraber ortam hareketlenir',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi 2864. Cadde (Park Caddesi) No:38/C.',
      sources: [
        [
          "This Town's Last Stop Resmi Sitesi",
          'http://www.thistownslaststop.com/',
          'operator',
          'Gastropub konsepti, atıştırmalıklar ve Park Cd. adresi',
        ],
        [
          'Restoranim This Towns Last Stop',
          'https://www.restoranim.net/',
          'editorial',
          'Teras alanı ve akşam buluşması değerlendirmeleri',
        ],
      ],
      pros: ['Park Caddesi üzerinde köklü ve oturmuş gastropub atmosferi', 'Vegan dahil çeşitlilik sunan bistro mutfağı'],
      cons: ['Hafta sonu teras doluluğu ve müzik temposu yükselebilir'],
      unc: ['Canlı etkinlik akşamlarında masa rezervasyonu önerilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 5. KAHVALTI (2 bağımsız artizan fırın & butik patisserie)
    // =========================================================================
    compactSeed({
      id: 'cayyolu-farro-artisan-bakery',
      placeId: 'ChIJU_h4BeNP0xQRPN3bzYcMwRM',
      cat: 'kahvalti',
      name: 'Farro Artisan Bakery Çayyolu',
      brand: 'Farro',
      area: '2857. Sk., Ahmet Taner Kışlalı',
      signals: ['fransiz-tereyagli-kruvasan', 'eksi-maya', 'crovolcano'],
      desc:
        'Fransız ön mayası ve gerçek tereyağı ile kat kat hazırlanan sade veya Antep fıstıklı-frambuazlı Crovolcano kruvasanları, ekşi mayalı sandviçleri ve kahvaltı tabaklarıyla öne çıkan zanaat fırın-kafe.',
      order: ['Tereyağlı Sade / Bademli Kruvasan', 'Crovolcano (Antep Fıstıklı)', 'Paris Caprese Sandviç'],
      menu: ['Sade & Bademli Kruvasan', 'Crovolcano', 'Paris Caprese Sandviç', 'Ekşi Maya Ekmekler', 'Kahvaltı Tabağı'],
      sec: [
        [
          'Ekşi Mayalı Sandviç & Yumurta Tabakları',
          'Tatlı kruvasanların yanında ekşi maya ekmekle hazırlanan sandviçler ve çırpılmış yumurtalı kahvaltı seçenekleri sunulur.',
          'İşletme mutfak menüsü ve yemek değerlendirmeleri',
        ],
      ],
      seat: 'Vitrin ve fırın kokusuna yakın şık kafe masaları',
      crowd: 'Sabah nitelikli artizan kruvasan, ekşi maya sandviç ve kahve arayanlar',
      dis: 'Günün ilerleyen saatlerinde popüler dolgulu kruvasan çeşitleri tükenebilir',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi 2857. Sokak No:8.',
      sources: [
        [
          'Farro Resmi Sitesi',
          'https://farro.com.tr/',
          'operator',
          'Fransız ön mayası, gerçek tereyağlı kruvasan ve ekşi maya üretimi',
        ],
        [
          'Restoranim Farro',
          'https://www.restoranim.net/',
          'editorial',
          'Kahvaltı tabakları ve artizan fırın kalitesi değerlendirmeleri',
        ],
      ],
      pros: ['Katman dokusu başarılı gerçek tereyağlı kruvasanlar', 'Ekşi mayalı ekmek ve tuzlu sandviç çeşitliliği'],
      cons: ['Öğleye doğru bazı imza hamur işleri bitebiliyor'],
      unc: ['Hafta sonu kahvaltı saatlerinde masa bulmak zaman alabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-qrabiye-patisserie',
      placeId: 'ChIJMwzjxuQ40xQR1yWdLSCGs98',
      cat: 'kahvalti',
      name: 'Qrabiye Boutique Patisserie',
      brand: 'Qrabiye',
      area: 'Mesa Koru, Koru',
      signals: ['butik-pastane', 'mesa-koru-kahvalti', 'ev-yapimi-kurabiye'],
      desc:
        'Mesa Koru Çarşısı’nda uzun yıllardır anne evi sıcaklığındaki küçük salonunda kişi bazlı özenli kahvaltı, pankek, tuzlu börek-yaprak sarma ikramları ve ev yapımı kurabiye-cheesecake çeşitleri sunan köklü Koru butik patisserisi.',
      order: ['Özenli Kahvaltı & Pankek', 'Ev Yapımı Kurabiye & Cheesecake'],
      menu: ['Kahvaltı & Pankek', 'Elmalı & Marmelatlı Kurabiyeler', 'Cheesecake', 'Börek & Tuzlular'],
      sec: [
        [
          'Ev Yapımı Kurabiyeler & Öğleden Sonra Çay Saati',
          'Kahvaltı servisinin ardından vitrindeki taze pişmiş elmalı kurabiyeler, börekler ve unsuz çikolatalı kek gün boyu ilgi görür.',
          'Misafir rehberi ve değerlendirme kayıtları',
        ],
      ],
      seat: 'Küçük, sıcak ve ev atmosferinde dekore edilmiş butik pastane masaları',
      crowd: 'Sakin ortamda ev yapımı lezzetlerle kahvaltı ve çay keyfi yapmak isteyen Koru sakinleri',
      dis: 'Mekân küçük kapasiteli ve erken kapanışlıdır; hafta sonu kahvaltı için önceden yer ayırtmak gerekir',
      transit: 'Koru Mahallesi Ihlamur Caddesi Mesa Koru Ticaret Merkezi No:2.',
      sources: [
        [
          'Qrabiye Resmi Sitesi',
          'https://qrabiye.com/',
          'operator',
          'Mesa Koru Çarşısı konumu ve ev yapımı kurabiye-patisserie geçmişi',
        ],
        [
          'Restoranim Qrabiye',
          'https://www.restoranim.net/',
          'editorial',
          'Kahvaltı, pankek, samimi ev atmosferi ve erken kapanış detayları',
        ],
      ],
      pros: ['Mesa Koru içinde yıllardır çizgisini koruyan butik aile sıcaklığı', 'Ev yapımı kurabiye ve kahvaltı ikilisi'],
      cons: ['Küçük oturma kapasitesi ve akşam erken kapanış'],
      unc: ['Hafta sonu kahvaltısı için rezervasyon yapılmadan yer bulmak zorlaşabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 6. DENEMELİSİN (4 yerel mahalle klasiği — deniz ürünleri, lahmacun, sokak lezzeti, ocakbaşı)
    // =========================================================================
    compactSeed({
      id: 'cayyolu-kaptanin-yeri',
      placeId: 'ChIJdbPJs9c40xQRT9xnFRMB0WQ',
      cat: 'denemelisin',
      name: "Kaptan'ın Yeri (Konutkent)",
      brand: 'Kaptan',
      area: 'Konutkent Çarşısı, Konutkent',
      signals: ['taze-balik-satis-pisirme', 'dil-baligi-tava', 'konutkent-klasigi'],
      desc:
        'Konutkent 2 Çarşısı içinde günlük balık satışını mutfakta usta pişirimle birleştiren; dil balığı tava, çıtır kalamar, balık çorbası ve taze zeytinyağlı meze dolabıyla bilinen köklü aile balıkçısı.',
      order: ['Dil Balığı Tava & Günlük Mevsim Balığı', 'Kalamar Tava & Midye Dolma', 'Zeytinyağlı Meze & Balık Çorbası'],
      menu: ['Dil Balığı Tava', 'Kalamar Tava', 'Balık Çorbası', 'Midye Dolma', 'Zeytinyağlı Mezeler'],
      sec: [
        [
          'Zeytinyağlı Meze Dolabı & Al-Pişir Pratikliği',
          'Mevsimlik günlük balıkların yanında taze zeytinyağlı mezeler ve balık çorbası da müdavimler tarafından düzenli alınır.',
          'İşletme mutfak menüsü ve yemek rehberi değerlendirmeleri',
        ],
      ],
      seat: 'Konutkent Çarşısı içinde gösterişten uzak, aile ve mahalle balıkçısı düzeni',
      crowd: 'Gösterişli meyhane yerine taze, günlük temiz balık yemek isteyen Konutkent ve Çayyolu sakinleri',
      dis: 'Yoğun akşam ve hafta sonlarında içerisi kalabalık ve gürültülü olabilir; porsiyon tartısı net sorulmalıdır',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi Konutkent 2 Çarşısı No:21.',
      sources: [
        [
          "Kaptan'ın Yeri Resmi Sitesi",
          'https://kaptaninyeri.com.tr/',
          'operator',
          'Konutkent balık pişirme ve taze meze-deniz ürünleri menüsü',
        ],
        [
          'Sluurpy & Yemeksepeti Kayıtları',
          'https://www.sluurpy.com/',
          'editorial',
          'Dil balığı tava, kalamar, balık çorbası ve kalabalık saat değerlendirmeleri',
        ],
      ],
      pros: ['Mahalle çarşısı içinde güvenilir günlük taze balık rotasyonu', 'Meze ve sıcak deniz ürünleri tazeliği'],
      cons: ['Lüks dekorasyon yerine klasik esnaf-çarşı balıkçısı atmosferi'],
      unc: ['Yoğun hafta sonu saatlerinde servis temposu düşebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-carsihan-lahmacun',
      placeId: 'ChIJ2bI578I50xQRkoE8R8LvH0o',
      cat: 'denemelisin',
      name: 'Çarşıhan Lahmacun',
      brand: 'Çarşıhan',
      area: '2818. Cd., Ahmet Taner Kışlalı',
      signals: ['citir-tas-firin-lahmacun', 'findik-lahmacun', 'adana-durum'],
      desc:
        'Ahmet Taner Kışlalı 2818. Cadde üzerinde ince hamurlu çıtır taş fırın lahmacunları, fındık lahmacun seçenekleri ve doyurucu Adana dürümleriyle yüksek hacimde puanını koruyan yerel fırın-kebap durağı.',
      order: ['Taş Fırın Çıtır Lahmacun', 'Fındık Lahmacun & Adana Dürüm'],
      menu: ['Klasik & Fındık Lahmacun', 'Adana Dürüm', 'Pide Çeşitleri', 'Köz Eşlikçiler'],
      sec: [
        [
          'Hızlı Fırın Çıkışı & Dürüm Alternatifleri',
          'İnce hamurlu lahmacunun yanında taş fırın pideleri ve ızgara dürüm çeşitleri de hızlı servis edilir.',
          'Yerel menü platformları ve sipariş değerlendirmeleri',
        ],
      ],
      seat: 'Hızlı öğle ve akşam yemeğine uygun sade fırın-kebapçı oturma düzeni',
      crowd: 'Çıtır hamurlu dürüst lahmacun ve kebap dürüm arayan mahalle müdavimleri',
      dis: 'Uzun akşam oturumları için değil, hızlı sıcak fırın lezzeti odaklıdır',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi 2818. Cadde No:25.',
      sources: [
        [
          'Menu-TR Çarşıhan Lahmacun',
          'https://www.menu-tr.com/',
          'editorial',
          '2818. Cd. konumu, taş fırın lahmacun, fındık lahmacun ve Adana dürüm menüsü',
        ],
        [
          'Restoranim Çarşıhan',
          'https://www.restoranim.net/',
          'community',
          'Çıtır hamur ve fiyat-porsiyon dengesi değerlendirmeleri',
        ],
      ],
      pros: ['Yüksek sipariş hacmine rağmen çıtır taş fırın hamur tutarlılığı', 'Hızlı ve erişilebilir fiyat-lezzet dengesi'],
      cons: ['Ambiyans yerine pratik yemek odaklı sade salon'],
      unc: ['Öğle ve akşam yoğunluğunda sıcak servis birkaç dakika gecikebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-kokorec-kofte',
      placeId: 'ChIJ94SKFn450xQRUS90WsaZ_mw',
      cat: 'denemelisin',
      name: 'Çayyolu Kokoreç&Köfte',
      brand: 'Çayyolu',
      area: '2760. Cd., Ahmet Taner Kışlalı',
      signals: ['ince-sis-kokorec', 'izgara-kofte', 'temiz-sokak-lezzeti'],
      desc:
        '2760. Cadde üzerinde ince şişe sarılmış gevrek kokoreç, ızgara köfte ve sucuk ekmek çeşitlerini düzenli ve temiz mahalle tezgâhında sunan tekil Çayyolu sokak lezzeti noktası.',
      order: ['Yarım / Tam Ekmek Kokoreç', 'Izgara Köfte Ekmek'],
      menu: ['Klasik & İnce Kıyım Kokoreç', 'Izgara Köfte', 'Sucuk Ekmek', 'Islak Hamburger'],
      sec: [
        [
          'Izgara Köfte & Geç Saat Sokak Klasikleri',
          'Kokoreç sevmeyen eşlikçiler için odun-kömür ızgara köfte ve sucuk ekmek seçenekleri de aynı tezgâhtan çıkar.',
          'Menü rehberleri ve gece atıştırması değerlendirmeleri',
        ],
      ],
      seat: 'Hızlı tezgâh servisi ve küçük sade masa alanı',
      crowd: 'Temiz ortamda gevrek kokoreç ve ızgara köfte yemek isteyen Çayyolu sakinleri',
      dis: 'Gündüz-gece hızlı ayaküstü sokak lezzeti konseptindedir; geniş restoran konforu beklenmemelidir',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi 2760. Cadde.',
      sources: [
        [
          'Menu-TR Çayyolu Kokoreç',
          'https://www.menu-tr.com/',
          'editorial',
          'İnce şiş kokoreç, ızgara köfte, sucuk ekmek ve antrikot menüsü',
        ],
        [
          'RestaurantGuru Çayyolu Kokoreç',
          'https://restaurantguru.com/',
          'community',
          'Temiz sunum ve yerel değerlendirmeler',
        ],
      ],
      pros: ['Mahalle içinde temiz ve güvenilir kokoreç-köfte standardı', 'Hızlı paket ve masa servisi'],
      cons: ['Sınırlı oturma alanı ve sade tezgâh düzeni'],
      unc: ['Gece geç saatlerde paket sipariş trafiği artabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cayyolu-urfali-bekir',
      placeId: 'ChIJgcXZ5tE50xQR0Vz04Sh87oI',
      cat: 'denemelisin',
      name: 'Urfalı Kebapçı Bekir & Çarşaf Lahmacun',
      brand: 'Bekir',
      area: 'Selçuk Yula Cd., Ahmet Taner Kışlalı',
      signals: ['carsaf-lahmacun', 'ciger-sis', 'koz-mantar'],
      desc:
        'Selçuk Yula Caddesi üzerinde geniş ince açılan Urfa usulü çarşaf lahmacun, sarma beyti, ciğer şiş ve közde mantar eşlikçileriyle samimi ocakbaşı çizgisini koruyan mahalle kebapçısı.',
      order: ['Urfa Usulü Çarşaf Lahmacun', 'Ciğer Şiş & Sarma Beyti', 'Közde Mantar'],
      menu: ['Çarşaf Lahmacun', 'Ciğer Şiş', 'Sarma Beyti', 'Adana / Urfa Kebap', 'Közde Mantar'],
      sec: [
        [
          'Ciğer Şiş, Beyti & Közde Mantar Eşlikçileri',
          'Çarşaf lahmacunun dışında zırh kıymalı kebaplar ve közlenmiş mantar ikramları yemek deneyimini tamamlar.',
          'Yerel menü kayıtları ve kullanıcı geri bildirimleri',
        ],
      ],
      seat: 'Sade, temiz ve mahalle kebapçısı sıcaklığında iç salon',
      crowd: 'Park Caddesi çevresinde gösterişsiz Urfa lahmacunu ve ciğer şiş arayanlar',
      dis: 'Yoğun paket servis saatlerinde hamur çıtırlığı kısa beklemelerde yumuşayabilir; yerinde yemek daha iyidir',
      transit: 'Prof. Dr. Ahmet Taner Kışlalı Mahallesi Selçuk Yula Caddesi No:40/4.',
      sources: [
        [
          'Menu-TR Urfalı Kebapçı Bekir',
          'https://www.menu-tr.com/',
          'editorial',
          'Selçuk Yula Cd. adresi, çarşaf lahmacun, beyti ve ciğer şiş menüsü',
        ],
        [
          'Yemeksepeti Değerlendirmeleri',
          'https://www.yemeksepeti.com/',
          'community',
          'Lezzet, közde mantar ve hamur kıvamı üzerine misafir notları',
        ],
      ],
      pros: ['Büyük ince açılan çarşaf lahmacun ve ciğer şiş dengesi', 'Park Caddesi çevresine göre dengeli bütçe seviyesi'],
      cons: ['Paket serviste çıtırlık yerinde tüketim kadar yüksek olmayabilir'],
      unc: ['Yoğun akşam saatlerinde taş fırın çıkış sırası uzayabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // NEGATİF DENETİM KONTROLLERİ (Politika Kapısı Audit Testi — 18 Kontrol)
    // =========================================================================
    negControl('ctrl-cayyolu-brandburger-chain', 'ChIJS8cJ_Ts50xQR2d27pzgAefE', 'hamburger', 'Çok şubeli Brand Burger zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-hmbrgr-chain', 'ChIJhxYBmcI40xQRTUHN8Sv7kXQ', 'hamburger', '14+ şubeli Ankara HMBRGR zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-caffeditoee-chain', 'ChIJMe_AxSM_0xQRyP8cXmxM2M0', 'kahve', '14 şubeli Ankara Caffé Di Toeé zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-coffeegate-chain', 'ChIJ71p9qxo50xQRZrxZy8K7kGc', 'kahve', '6+ şubeli Coffee Gate zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-burgerking-chain', 'ChIJg1FSWAA50xQRvML9qWgllqs', 'hamburger', 'Küresel fast-food Burger King zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-littlecaesars-chain', 'ChIJ-XmJW6k50xQRd1IvGFQcSN4', 'pizza', 'Çok şubeli Little Caesars pizza zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-balikcikoy-chain', 'ChIJuZw3hdk40xQRePVNQLXhdas', 'date', 'Çok şubeli Balıkçıköy Fahri balık zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-tarabya-chain', 'ChIJZZO4prg50xQRxmpkLUTlr64', 'date', 'Çok şubeli Tarabya Balık zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-zahire-chain', 'ChIJ4_r9pMU40xQRT_t2laM2x3A', 'kahvalti', '5+ şubeli Zahire Pastanesi zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-cezzar-chain', 'ChIJ72ypSAo_0xQR_w38bvvgVuM', 'denemelisin', 'Çok şubeli Ankara Cezzar Steakhouse zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-ifsokak-chain', 'ChIJlwddlxw50xQR983WUFu60x0', 'denemelisin', 'Çok şubeli IF Sokak zinciri (Kapı 2)'),
    negControl('ctrl-cayyolu-lepain-chain', 'ChIJa_NAsLk50xQRvdbuW8rc_PE', 'kahvalti', 'Çok şubeli Le Pain fırın-kafe markası (Kapı 2)'),
    negControl('ctrl-cayyolu-nona-noncoffee', 'ChIJ5xknELY50xQRftXVQ-2K8xs', 'kahve', 'chocolate_shop primaryType kahve uzmanı değil (Kapı 3B)'),
    negControl('ctrl-cayyolu-out-yasamkent-pacas', 'ChIJPfeaebQ_0xQRiYtFXFVHgyg', 'kahve', 'Yaşamkent mahallesi batı sınır dışı (Kapı 4)'),
    negControl('ctrl-cayyolu-out-alacaatli-kvass', 'ChIJtaJRGn850xQRN1oXWnju-gI', 'kahvalti', 'Alacaatlı mahallesi güney sınır dışı (Kapı 4)'),
    negControl('ctrl-cayyolu-low-vicolo', 'ChIJfTpiL7850xQRUpIkBKTwIiY', 'pizza', '4.2 puan standart 4.4 eşiğinin altında (Kapı 6)'),
    negControl('ctrl-cayyolu-low-flone', 'ChIJHVdM01o_0xQRoVmISZ40SCM', 'date', '4.3 puan standart 4.4 eşiğinin altında (Kapı 6)'),
    negControl('ctrl-cayyolu-infl-pizzest', 'ChIJw11e9jU50xQRzljnVkqo55I', 'pizza', '4.9 puan 136 yorumda >=2 bağımsız yayın/topluluk kanıtı yok (Kapı 8)'),
  ],
};
