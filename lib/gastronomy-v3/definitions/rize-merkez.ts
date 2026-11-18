import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const RIZE_MERKEZ_DEF: V3RegionDefinition = {
  id: 'rize-merkez',
  slug: 'rize-merkez',
  city: 'Rize',
  district: 'Merkez',
  allowedDistricts: ['Rize Merkez', 'RİZE MERKEZ', 'Merkez'],
  neighborhood: 'Rize Merkez',
  officialQuarter:
    'Rize Merkez (Çarşı, Piriçelebi, Tophane, Reşadiye, Atmeydanı, Müftü, Fener, Eminettin, Portakallık, Yeniköy, İslampaşa, Taşlıdere & Gündoğdu Sahil Hattı)',
  displayName: 'Rize Merkez (Çarşı, Ziraat & Sahil)',
  locative: "Rize Merkez'de",
  path: ['rize', 'merkez', 'rize-merkez'],
  aliases: [
    'Rize Merkez',
    'Rize',
    'İslampaşa Rize',
    'Piriçelebi',
    'Portakallık',
    'Fener Rize',
    'Ziraat Rize',
    'Yeniköy Rize',
    'Tophane Rize',
    'Gündoğdu Rize',
    'Engindere',
    'Atmeydanı Rize',
  ],
  scopeNote:
    'Rize Merkez (Çarşı, Piriçelebi, Tophane, Reşadiye, Atmeydanı/Ziraat, Fener, Müftü, Taşlıdere & Dağınıksu/Gündoğdu sahili; dış ilçeler Çayeli, Derepazarı, Çamlıhemşin/Ayder, Ardeşen, Pazar, Fındıklı, İkizdere, Güneysu ve İyidere hariç) · Doğrulanmış Seçki',
  characterSubtitle:
    'Çarşı ve Piriçelebi’den Ziraat yamaçları ile sahil bandına uzanan 1968 mirası Rize kavurması ve kuzinede kuru fasulye, taş fırın Rize pidesi, günlük Karadeniz deniz balıkları, ekşi mayalı Napoliten pizzalar ve nitelikli kahve durakları.',
  center: { lat: 41.0258, lng: 40.519 },
  bbox: { minLat: 41.0, maxLat: 41.075, minLng: 40.45, maxLng: 40.65 },
  allowedNeighborhoodTokens: [
    'Çarşı',
    'Carsi',
    'Piriçelebi',
    'Piricelebi',
    'Tophane',
    'Reşadiye',
    'Resadiye',
    'Atmeydanı',
    'Atmeydani',
    'Müftü',
    'Muftu',
    'Fener',
    'Eminettin',
    'Yeniköy',
    'Yenikoy',
    'İslampaşa',
    'Islampasa',
    'Portakallık',
    'Portakallik',
    'Taşlıdere',
    'Taslidere',
    'Dağınıksu',
    'Daginiksu',
    'Gündoğdu',
    'Gundogdu',
    'Alipaşa',
    'Alipasa',
    'Camiönü',
    'Camionu',
    'Fatih',
    'Balsu',
    'Ekrem Orhon',
    'Engindere',
  ],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // --- PİZZA (2) ---
    compactSeed({
      id: 'rize-pizzabey',
      placeId: 'ChIJjYWZeCF7ZkARz6N2NwAndYc',
      cat: 'pizza',
      brand: 'pizzabey',
      area: 'Osman Karavin Cd., Çarşı, Rize Merkez',
      signals: ['48-saat-eksi-maya', 'san-marzano', 'yoresel-adlar'],
      desc:
        'Rize Çarşı içinde uzun fermantasyonlu prebiyotik ekşi maya hamuru, San Marzano domates sosu ve Karadeniz yayla isimleriyle kurgulanan pizzalarıyla ayrışan tek şubeli pizzacı.',
      order: ['Fırtına Vadisi (Karışık) Pizza', 'Gito / Kaçkar Özel Pizza'],
      menu: ['Tiftik Etli Özel Pizza', 'Klasik Margherita'],
      sec: [
        [
          'Ev Yapımı Tiramisu',
          'Yemek sonunda en sık tercih edilen İtalyan usulü tatlı eşlikçisi.',
          'pizzabey.com.tr + Yemeksepeti değerlendirmeleri',
        ],
      ],
      seat: 'Çarşı Blokları içinde kompakt, düzenli iç masa düzeni',
      crowd: 'Akşam saatlerinde gençler ve Rize merkezde gerçek Napoli hamuru arayanlarla canlı',
      dis: 'Ev yapımı fermante hamur nedeniyle sipariş başına hazırlık süresi klasik zincirlere göre daha uzun sürebilir',
      transit: 'Çarşı Mahallesi Osman Karavin Caddesi No:8 H Blok Çarşı AVM içinde',
      sources: [
        [
          'Pizzabey Resmi Site',
          'https://pizzabey.com.tr/',
          'operator',
          'Uzun fermantasyon ekşi maya, San Marzano domates sosu ve Gito/Kaçkar/Fırtına Vadisi menüsü',
        ],
        [
          'Yemeksepeti Rize Çarşı Puanı',
          'https://www.yemeksepeti.com/',
          'community',
          'Hafif hamur yapısı ve tiramisu geri bildirimleri',
        ],
      ],
      pros: ['Rize merkezde nadir gerçek ekşi maya Napoli hamuru', 'Yüksek puan istikrarı'],
      cons: ['Hazırlık süresi pik akşamlarda uzayabilir'],
      unc: ['AVM içi blok yerleşimi sokağa açık değil'],
    }),
    compactSeed({
      id: 'rize-express-pizza',
      placeId: 'ChIJLUtjEeB6ZkARAyUHTfHVz5U',
      cat: 'pizza',
      brand: 'express pizza',
      area: 'Cumhuriyet Cd., Reşadiye, Rize Merkez',
      signals: ['orta-hamur-dengesi', 'gece-servisi', 'bol-malzeme'],
      desc:
        'Reşadiye Cumhuriyet Caddesi üzerinde Rize yerelinin ne çok kalın ne ince hamur dengesi ve sıcak teslimat hızıyla yıllardır tercih ettiği yerel pizzacı.',
      order: ['Pastırmalı & Kavurmalı Pizza', 'Karışık Özel Pizza'],
      menu: ['Sebzeli Pizza', 'Jumbo Paylaşım Pizza'],
      sec: [
        [
          'Fırınlanmış Atıştırmalık Sepeti',
          'Soğan halkası ve baharatlı patates kızartması eşlikleri.',
          'expresspizza.com.tr + Yemeksepeti menüsü',
        ],
      ],
      seat: 'Reşadiye cadde üzerinde sade ve pratik iç oturum',
      crowd: 'Geç akşam saatlerine kadar aileler ve öğrenciler tarafından yoğun ilgi görür',
      dis: 'Geleneksel İtalyan taş fırını yerine doyurucu yerel pizza salonu çizgisindedir',
      transit: 'Reşadiye Mahallesi Cumhuriyet Caddesi No:268 üzerinde merkez sahil yürüyüşüne yakın',
      sources: [
        [
          'Express Pizza Resmi Site',
          'https://expresspizza.com.tr/',
          'operator',
          'Küçük/orta/büyük/jumbo boy pizza ve fırın yan ürün kataloğu',
        ],
        [
          'Yemeksepeti Reşadiye Değerlendirmeleri',
          'https://www.yemeksepeti.com/',
          'community',
          'Sıcak teslimat ve hamur dengesi geri bildirimleri',
        ],
      ],
      pros: ['Geç saatlere kadar ulaşılabilir yerel pizza salonu', 'Bol malzeme oranı'],
      cons: ['Napoliten ekşi maya arayanlardan ziyade klasik pizza severlere hitap eder'],
      unc: ['Yoğun yağışlı akşamlarda paket sırası uzayabilir'],
    }),

    // --- HAMBURGER (1) ---
    compactSeed({
      id: 'rize-burger-no301',
      placeId: 'ChIJAXgf4OV6ZkAR8kHbJ8u5APM',
      cat: 'hamburger',
      brand: 'burger no 301',
      area: 'Osman Karavin Cd., Çarşı, Rize Merkez',
      signals: ['el-yapimi-köfte', 'ozel-soslar', 'tazelik'],
      desc:
        'Çarşı Osman Karavin Caddesi üzerinde taze ekmek ve özgün Casablanca sosuyla Rize merkezde zincir dışı gurme burger çıkaran yerel burger salonu.',
      order: ['Casablanca Burger', 'Klasik Dana Burger'],
      menu: ['Chicken Garlic Mushroom', 'Cheeseburger'],
      sec: [
        [
          'Baharatlı Patates Kızartması',
          'Burger menülerin yanında sıcak ve gevrek çıkan temel eşlikçi.',
          'Yemeksepeti + yerel burger menüleri',
        ],
      ],
      seat: 'TOKİ Blokları cadde cephesinde pratik masa düzeni',
      crowd: 'Öğle ve akşam arası genç kitleyle hareketli',
      dis: 'Rize Ardeşen şubesiyle birlikte iki noktalı yerel bir markadır; fiyat bandı klasik büfe burgerlerin üzerindedir',
      transit: 'Çarşı Osman Karavin Caddesi TOKİ Blokları B Blok üzerinde merkez meydandan yürüyüş mesafesinde',
      sources: [
        [
          'Yemeksepeti Rize Burger Listesi',
          'https://www.yemeksepeti.com/',
          'community',
          'Casablanca Burger, et tazeliği ve sıcak servis geri bildirimleri',
        ],
        [
          'Rizedesin Mekan Rehberi',
          'https://rizedesin.com/',
          'editorial',
          'Çarşı Osman Karavin Caddesi yerel burger işletmesi kaydı',
        ],
      ],
      pros: ['Rize merkezde 600 üstü oylamayla en istikrarlı yerel burger noktası', 'Özgün sos seçenekleri'],
      cons: ['Tek kalem büyük porsiyon arayanlara göre ek patatesle tamamlanmalı'],
      unc: ['Paket yoğunluğunda kurye bekleme süresi uzayabilir'],
    }),

    // --- KAHVE (4) ---
    compactSeed({
      id: 'rize-haura-coffee',
      placeId: 'ChIJcw0GIel6ZkAR8YmDPfM1aCU',
      cat: 'kahve',
      brand: 'haura',
      area: 'Tevfik İleri Cd., Çarşı, Rize Merkez',
      signals: ['teras-kahve', '3-nesil-demleme', 'merkez-bulusma'],
      desc:
        'Rize Çarşı’nın kalbinde ferah iç tasarım, teras oturumu ve üçüncü nesil demlemelerle birlikte geniş içecek menüsü sunan şehrin en köklü sosyal kahve evlerinden biri.',
      order: ['Üçüncü Nesil Filtre Kahve', 'Cortado & Flat White'],
      menu: ['Matcha Latte', 'Iced Americano'],
      sec: [
        [
          'San Sebastian Cheesecake & Ev Tatlıları',
          'Kahve eşliğinde tercih edilen vitrin tatlıları ve atıştırmalıklar.',
          'hauracoffeelounge.com.tr + Finedinemenu',
        ],
      ],
      seat: 'Zümrüt yeşili koltuklu ferah salon ve üst teras oturumu',
      crowd: 'Gündüz sakin çalışma, akşam saatlerinde ise oldukça kalabalık sosyal buluşma noktası',
      dis: 'Akşamları lounge ve nargile oturumları nedeniyle ses düzeyi ve kalabalık artar',
      transit: 'Çarşı Mahallesi Tevfik İleri Caddesi Çarşı AVM üzerinde merkezde',
      sources: [
        [
          'Haura Coffee Resmi Site',
          'https://hauracoffeelounge.com.tr/',
          'operator',
          'Üçüncü nesil kahve, matcha, tatlı ve teras oturumu bilgisi',
        ],
        [
          'Neleri Meşhur Rize Kahve Rehberi',
          'https://nelerimeshur.com/',
          'editorial',
          'Çarşı Mahallesi’nin en bilinen buluşma kahve evlerinden biri olarak inceleme',
        ],
      ],
      pros: ['Yüksek hacimde 4.5 puan tutarlılığı', 'Merkezi Çarşı konumu ve ferah salon'],
      cons: ['Akşam nargile alanı ve kalabalığı sessiz çalışma için ağır gelebilir'],
      unc: ['Yoğun saatlerde teras masaları hızlı dolar'],
    }),
    compactSeed({
      id: 'rize-bkr-coffee',
      placeId: 'ChIJsRgDb8p7ZkAR6d1t66Gb_9E',
      cat: 'kahve',
      brand: 'bkr',
      area: 'İbrahim Karaoğlanoğlu Cd., Çarşı, Rize Merkez',
      signals: ['tek-sube-kahveci', 'sakin-mola', 'espresso-bar'],
      desc:
        'Çarşı AVM blokları içinde tek şubeli samimi düzeniyle taze kavrum espresso bazları, filtre kahveler ve sakin oturum sunan üçüncü nesil kahve dükkânı.',
      order: ['Cappuccino & Flat White', 'Filtre Kahve'],
      menu: ['Iced Latte', 'Americano'],
      sec: [
        [
          'Günün Kahve Yanı Tatlısı',
          'Filtre kahve eşliğinde sunulan sade tatlı ve kurabiye alternatifleri.',
          'bkrcoffee.com + Restoranım sayfası',
        ],
      ],
      seat: 'Büyük lounge kafelerden daha sakin, odaklanmaya ve sohbete uygun masa düzeni',
      crowd: 'Çarşı içinde kaliteli espresso arayan kahve müdavimleri',
      dis: 'Geniş yemek mutfağı yoktur; kahve ve küçük tatlı eşlikçilerine odaklanır',
      transit: 'Çarşı İbrahim Karaoğlanoğlu Caddesi Çarşı AVM A Blok No:4-1/3 içinde',
      sources: [
        [
          'BKR Coffee Resmi Site',
          'https://bkrcoffee.com/',
          'operator',
          'Çarşı tek şubeli nitelikli kahve ve espresso menüsü',
        ],
        [
          'Restoranım Rize BKR Kaydı',
          'https://www.restoranim.net/',
          'community',
          'Cappuccino, filtre kahve ve sakin atmosfer değerlendirmeleri',
        ],
      ],
      pros: ['Tek şubeli saf kahveci yaklaşımı', 'Nargile gürültüsünden uzak sakin tempo'],
      cons: ['AVM içi cephesi manzaralı sahil mekanlarına göre daha içe dönüktür'],
      unc: ['Tatlı çeşitleri günlük tezgâh stoğuna göre değişir'],
    }),
    compactSeed({
      id: 'rize-coffee-de-101',
      placeId: 'ChIJcVsFbAB7ZkAR3NCzy-GKLVs',
      cat: 'kahve',
      brand: 'coffee de 101',
      area: 'Atatürk Cd., Tophane, Rize Merkez',
      signals: ['tophane-cadde', 'soğuk-kahve', 'bulusma'],
      desc:
        'Tophane Atatürk Caddesi hattında sıcak–soğuk espresso bazlı içecekler ve gün içi pratik kafe buluşmalarıyla öne çıkan merkezi kahve noktası.',
      order: ['Iced Caramel Latte / Flat White', 'Espresso Tonic'],
      menu: ['Filtre Kahve', 'Türk Kahvesi'],
      sec: [
        [
          'Sıcak Kahve Yanı Atıştırmalıklar',
          'Cadde molasına eşlik eden küçük tatlı ve sandviç seçenekleri.',
          '101cafelounge.com.tr + yerel dizinler',
        ],
      ],
      seat: 'Tophane ana cadde üzerinde modern sokak önü ve iç masa alanı',
      crowd: 'Tophane ve Liman civarı genç çalışanlar',
      dis: 'Hacmi henüz görece düşüktür; akşam cadde trafiği önünde dış oturum hareketli olur',
      transit: 'Tophane Mahallesi Atatürk Caddesi üzerinde şehir içi durakların hemen yanında',
      sources: [
        [
          '101 Cafe Lounge Resmi Sayfa',
          'https://101cafelounge.com.tr/',
          'operator',
          'Tophane kahve çeşitleri ve kafe menüsü',
        ],
        [
          'Rizedesin İşletme Dizini',
          'https://rizedesin.com/',
          'editorial',
          'Tophane Atatürk Caddesi konum doğrulaması',
        ],
      ],
      pros: ['Tophane ana aksında yürümesi kolay konum', 'Yüksek misafir puanı'],
      cons: ['Menüde ağırlık klasik espresso bazlı içeceklerde'],
      unc: ['Hafta sonu akşamları ön masalar hızlı dolabilir'],
    }),
    compactSeed({
      id: 'rize-aware-coffee',
      placeId: 'ChIJF5SlJjx7ZkARPmFtdPD-n28',
      cat: 'kahve',
      brand: 'aware',
      area: 'Menzil Sk., Fener, Rize Merkez',
      signals: ['fener-sahil', 'nitelikli-kahve', 'sakin-calisma'],
      desc:
        'Fener sahil ve üniversite hattına yakın sokakta nitelikli kahve çeşitlerini samimi oturum ve tost eşlikçileriyle sunan bağımsız mahalle kafesi.',
      order: ['V60 / Filtre Kahve', 'Iced Americano & Latte'],
      menu: ['Cortado', 'Soğuk Demleme'],
      sec: [
        [
          'Özel Fener Tost Çeşitleri',
          'Üniversite çevresi misafirlerin kahve yanında sık tercih ettiği sıcak tost alternatifleri.',
          'Restoranım + Winniey Rize rehberi',
        ],
      ],
      seat: 'Fener’de gürültüden uzak samimi iç salon',
      crowd: 'Fener mahallesi öğrencileri ve sahil yürüyüşü sonrası mola verenler',
      dis: 'Çarşı merkezine yürüyüşle biraz uzaktır; Fener yönüne dolmuş veya araç gerekir',
      transit: 'Fener Mahallesi Menzil Sokak No:1/A üzerinde Menderes Bulvarı’na birkaç adım',
      sources: [
        [
          'Restoranım Fener Aware İncelemesi',
          'https://www.restoranim.net/',
          'editorial',
          'Fener’de nitelikli kahve, tatlı ve özel tost çeşitleriyle 4.7 puan profili',
        ],
        [
          'Winniey Rize Rehberi',
          'https://www.winniey.com/',
          'community',
          'Tostbağa Fener / Aware Coffee sahil-kampüs kafe doğrulaması',
        ],
      ],
      pros: ['Çarşı AVM dışı gerçek mahalle sokak kafesi dokusu', 'Fener sahiline yakınlık'],
      cons: ['Küçük ölçekli alan nedeniyle büyük gruplara dar kalabilir'],
      unc: ['Akademik dönem dışı günlerde yoğunluk seviyesi değişir'],
    }),

    // --- BALIKÇILAR & DENİZ ÜRÜNLERİ (3) ---
    compactSeed({
      id: 'rize-sandal-balik',
      placeId: 'ChIJx9saDhd7ZkARckBDiy31G3w',
      cat: 'balik',
      brand: 'sandal balik',
      area: 'Atatürk Cd., Reşadiye, Rize Merkez',
      signals: ['gunluk-karadeniz-baligi', 'balik-corbasi', 'meze'],
      desc:
        'Reşadiye Atatürk Caddesi üzerinde mevsimlik Karadeniz balıkları, özel balık çorbası, kalamar ve karides mantı gibi ara sıcaklarıyla Rize merkezde deniz ürününü yüksek puanda tutan adres.',
      order: ['Tava veya Izgara Mezgit / Hamsi / Levrek', 'Özel Balık Çorbası'],
      menu: ['Barbun & Dil Balığı', 'Izgara Köfte Alternatifi'],
      sec: [
        [
          'Karides Mantı & Kalamar Tava',
          'Ana balık öncesi masada en sık paylaşılan sıcak deniz ürünü başlangıcı.',
          'sandalbalikmenu.com + Yemeksepeti menüsü',
        ],
      ],
      seat: 'Reşadiye merkezde aile ve iş yemeklerine uygun düzenli kapalı salon',
      crowd: 'Akşam ve öğle yemeklerinde temiz deniz ürünü arayan yerliler ve ziyaretçilerle yoğun',
      dis: 'Ana cadde içinde yer aldığı için deniz sıfır manzarası yoktur; pik akşamlarda masa düzeni sıkışık hissedilebilir',
      transit: 'Reşadiye Atatürk Caddesi üzerinde şehir içi ulaşımla yürüyüşle ulaşılabilir',
      sources: [
        [
          'Sandal Balık Resmi Menü',
          'https://sandalbalikmenu.com/',
          'operator',
          'Balık çorbası, mevsim balıkları, karides mantı, kalamar ve köfte menüsü',
        ],
        [
          'Neleri Meşhur Rize Rehberi',
          'https://nelerimeshur.com/',
          'editorial',
          'Rize Merkez’in önde gelen yerel deniz ürünü restoranı incelemesi',
        ],
      ],
      pros: ['Bin yedi yüzü aşkın oylamayla şehirdeki en yüksek balık puanı', 'Balık yemeyenler için köfte alternatifi'],
      cons: ['Deniz manzaralı sahil tesisi yerine şehir içi cadde lokasyonu'],
      unc: ['Hamsi ve palamut çeşitliliği günlük av sezonuna göre değişir'],
    }),
    compactSeed({
      id: 'rize-piriyoz-balik',
      placeId: 'ChIJd_aA7mtlZkARH4f1hT8uCA0',
      cat: 'balik',
      brand: 'piriyoz',
      area: 'Taşlıdere Sahil, Rize Merkez',
      signals: ['karadeniz-tava', 'karides-guvec', 'sahil-manzara'],
      desc:
        'Taşlıdere sahil hattında deniz manzarasına karşı günlük mezgit, istavrit, barbun, sargan ve kalkan çeşitlerini karides güveç ile çıkaran yerel Karadeniz balıkçısı.',
      order: ['Mevsimine Göre Barbun / İstavrit / Kalkan', 'Karides Güveç'],
      menu: ['Hamsi & Mezgit Tava', 'Levrek / Çipura Izgara'],
      sec: [
        [
          'Buğulama Balık & Soğuk Başlangıç Mezeleri',
          'Kızartma dışında fırın/buğulama isteyenler için sade deniz ürünü tabakları.',
          'Restoranım + Wanderlog incelemeleri',
        ],
      ],
      seat: 'Taşlıdere sahil yolunda denize bakan pencereli, ferah ve aile dostu salon',
      crowd: 'Akşamüstü ve akşam saatlerinde Rize Merkez–Çayeli arası gelen ailelerle canlı',
      dis: 'Çarşı merkezinin biraz doğusunda yer aldığı için sahil yolundan kısa araç veya minibüs ulaşımı ister',
      transit: 'Taşlıdere Mahallesi Cumhuriyet Çay Fabrikası karşısı Karadeniz Sahil Yolu üzerinde',
      sources: [
        [
          'Restoranım Piriyoz İncelemesi',
          'https://www.restoranim.net/',
          'editorial',
          'Hamsi, barbun, mezgit, sargan, kalkan ve karides güveç menü kaydı',
        ],
        [
          'Wanderlog Rize Balık Seçkisi',
          'https://wanderlog.com/',
          'community',
          'Taşlıdere sahil konumu ve misafirperver servis notları',
        ],
      ],
      pros: ['Rize Merkez sınırında gerçek Karadeniz kıyı balık çeşitliliği', 'Taze av sezonuna dayalı tezgâh'],
      cons: ['Pişirme tekniği talepleri sipariş anında net belirtilmelidir'],
      unc: ['Kalkan ve sargan yalnızca sezonunda tezgâha çıkar'],
    }),
    compactSeed({
      id: 'rize-kale-balik',
      placeId: 'ChIJK3jh2YtlZkARttCySang3oc',
      cat: 'balik',
      brand: 'kale balik',
      area: 'Dağınıksu Sahil, Rize Merkez',
      signals: ['av-baligi-odagi', 'acik-mutfak', 'laz-boregi-sonu'],
      desc:
        'Dağınıksu / Gündoğdu sahil hattında açık mutfak tezgâhından çiftlik dışı mevsimlik deniz balığı ve tereyağlı mantarlı karides güveç sunan sade sahil balıkçısı.',
      order: ['Mevsimlik Deniz Mezgiti / Hamsi Tava', 'Tereyağlı Mantarlı Karides Güveç'],
      menu: ['Barbun & Palamut', 'Somon & Çipura'],
      sec: [
        [
          'Yemek Sonrası Laz Böreği & Kabak Tatlısı',
          'Karadeniz balık sofrasını tamamlayan geleneksel yöresel tatlı seçkisi.',
          'Öğrenci Nerede Yer + Neleri Meşhur Rize',
        ],
      ],
      seat: 'Sahil yolundan içeriye uzanan temiz, aydınlık ve açık mutfaklı aile salonu',
      crowd: 'Yerli müdavimlerin taze av balığı için Rize doğu çıkışında tercih ettiği durak',
      dis: 'Gündoğdu yönünde şehir merkezine araçla kısa mesafededir; günlük av maliyetine göre balık fiyatları değişkenlik gösterir',
      transit: 'Rize Merkez Dağınıksu / Gündoğdu sahil yolu paralelinde',
      sources: [
        [
          'Öğrenci Nerede Yer İncelemesi',
          'https://ogrencinerdeyer.com/',
          'community',
          'Deniz balığı tazeliği, açık mutfak temizliği ve tereyağlı karides güveç notları',
        ],
        [
          'Neleri Meşhur Rize Deniz Ürünleri',
          'https://nelerimeshur.com/',
          'editorial',
          'Mezgit, hamsi, kalamar ve laz böreği tatlı seçkisi doğrulaması',
        ],
      ],
      pros: ['Yetiştirme yerine mevsimsel deniz balığına odaklanması', 'Açık ve temiz mutfak düzeni'],
      cons: ['Merkez Çarşı’dan araçla ulaşım gerektirir'],
      unc: ['Günlük çıkan balık türleri hava koşullarına göre değişebilir'],
    }),

    // --- DENEMELİSİN — RİZE GASTRONOMİSİ (3) ---
    compactSeed({
      id: 'rize-liman-lokantasi',
      placeId: 'ChIJHbZCEeZ6ZkARUzkFsUHllNk',
      cat: 'denemelisin',
      brand: 'liman lokantası',
      area: 'Osman Karavin Cd., Çarşı, Rize Merkez',
      signals: ['1968-esnaf-mirasi', 'rize-kavurmasi', 'bakir-kuzine'],
      flags: { heritage: true, ritual: true },
      desc:
        '1968’den beri Rize Çarşı’da üç kuşaktır kuzine ateşinde bakır kaplarda pişen tereyağlı Rize kavurması, İspir kuru fasulyesi ve karalahana sarmasıyla şehrin gastronomi simgelerinden olan esnaf lokantası.',
      order: ['Bakır Kazandan Rize Kavurması', 'Kuru Fasulye & Tereyağlı Pilav'],
      menu: ['Etli Karalahana Sarması', 'Yaprak Döner'],
      sec: [
        [
          'Kadayıflı Fırın Sütlaç & Çıtır Laz Böreği',
          'Rize kavurması sonrasında esnaf lokantasının en çok anılan iki geleneksel tatlısı.',
          'Gurmex + Gezinomi Rize gastronomi dosyası',
        ],
      ],
      seat: 'Çarşı içinde yüksek sirkülasyonlu, işlevsel klasik esnaf lokantası salonu',
      crowd: 'Sabah geç saatten öğle sonrasına kadar yerel esnaf ve şehir dışı gurmelerle sürekli yoğun',
      dis: 'Çok yüksek kalabalık nedeniyle öğle saatlerinde masa ve garson temposu hızlı akar; günün popüler yemekleri akşama kalmadan tükenebilir',
      transit: 'Çarşı Mahallesi Osman Karavin Caddesi No:4/E üzerinde merkez meydanın hemen içinde',
      sources: [
        [
          'Gastronomiturkey Rize Dosyası',
          'https://gastronomiturkey.com/',
          'editorial',
          '1960’lardan beri bakır tencerede Rize kavurması, karalahana sarması ve sütlaç mirası',
        ],
        [
          'Serbestiyet Rize Esnaf Kültür Yazısı',
          'https://serbestiyet.com/',
          'editorial',
          '1968 üç kuşak esnaf lokantası ve kuzine pişirme tekniği',
        ],
        [
          'Gurmex Liman Lokantası Rize',
          'https://gurmex.com/',
          'community',
          'Rize kavurması, kuru fasulye-pilav ve erken tükenme notları',
        ],
      ],
      pros: ['Yarım asrı aşan Rize kavurması standardı', 'Üç kuşak esnaf disiplini ve merkezi konum'],
      cons: ['Yoğun öğle sirkülasyonu ve kavurmanın gün içinde tükenebilmesi'],
      unc: ['Rize kavurması için öğle vaktinden önce gitmek riski azaltır'],
    }),
    compactSeed({
      id: 'rize-tadal-pide',
      placeId: 'ChIJr17jtL57ZkAR-6Rc2nmtUkY',
      cat: 'denemelisin',
      brand: 'tadal pide',
      area: 'Hacı Eşref Cd., Çarşı, Rize Merkez',
      signals: ['tereyagli-karadeniz-pidesi', 'kavurmali-pide', 'firin-sutlac'],
      desc:
        'Çarşı içinde bol tereyağlı kavurmalı ve kıymalı Karadeniz pidelerini süzme mercimek çorbası ve fırın sütlaç eşliğinde çıkaran mahalle pide salonu.',
      order: ['Kavurmalı Karadeniz Pidesi', 'Kıymalı Kapalı / Açık Pide'],
      menu: ['Trabzon Peynirli Pide', 'Süzme Mercimek Çorbası'],
      sec: [
        [
          'Ev Usulü Fırın Sütlaç',
          'Pide üstüne sıklıkla söylenen hafif sütlü fırın tatlısı.',
          'Yemeksepeti + yerel Rize pide incelemeleri',
        ],
      ],
      seat: 'Hacı Eşref Caddesi üzerinde sade ve hızlı esnaf pide salonu',
      crowd: 'Çarşı esnafı ve öğle–akşam pide müdavimleriyle düzenli',
      dis: 'Geleneksel büyük salonlar yerine kompakt yerel pideci atmosferi taşır',
      transit: 'Çarşı Mahallesi Hacı Eşref Caddesi No:11/B üzerinde merkez yürüyüş rotasında',
      sources: [
        [
          'Yemeksepeti Tadal Pide Rize',
          'https://www.yemeksepeti.com/',
          'community',
          'Kavurmalı/kıymalı pide tereyağı dengesi, mercimek çorbası ve fırın sütlaç onayları',
        ],
        [
          'Rizedesin Çarşı Pide Rehberi',
          'https://rizedesin.com/',
          'editorial',
          'Çarşı Hacı Eşref Caddesi yerel pide salonu doğrulaması',
        ],
      ],
      pros: ['Merkezde yüksek puanlı tereyağlı pide alternatifi', 'Hızlı servis ve sıcak fırın çıktısı'],
      cons: ['Klasik Derepazarı tarzı çok ince hamur bekleyenlere daha dolgun gelebilir'],
      unc: ['Öğle vakti sıcak fırın sırası yoğun olabilir'],
    }),
    compactSeed({
      id: 'rize-ziraat-cay-bahcesi',
      placeId: 'ChIJPadUmvp6ZkARsOBZMcfJqTI',
      cat: 'denemelisin',
      brand: 'ziraat çay bahçesi',
      area: 'Narenciye Sk., Atmeydanı, Rize Merkez',
      signals: ['caykur-botanik', 'taze-rize-cayi', 'korfez-manzarasi'],
      desc:
        'Atmeydanı tepesinde çay fidanları ve botanik bahçe içinde Rize körfezine karşı Çaykur’un taze demlenmiş Rize çayı ve çıtır Rize simidiyle şehrin özgün çay ritüelini yaşatan simge durak.',
      order: ['Taze Demlenmiş Rize Çayı (Demlik / Bardak)', 'Rize Simidi Eşleşmesi'],
      menu: ['Mevsimlik Sıcak Çay Çeşitleri', 'Çay Bahçesi Atıştırmalıkları'],
      sec: [
        [
          'Botanik Çay Bahçesi Yürüyüşü & Mikro Çay Tesisi',
          'Çay terasları arasından geçerek Rize körfezi seyrini yaşatan mekânsal deneyim.',
          'Vikipedi Ziraat Çay Bahçesi + Tatılana rehberi',
        ],
      ],
      seat: 'Çay tarhlarına bakan açık teras ve kapalı seyir masaları',
      crowd: 'Günün her saatinde şehir yerlileri ve misafirlerle canlı, hafta sonu yüksek yoğunluk',
      dis: 'Ana yemek restoranı değildir; çay kültürü ve seyir molası odaklıdır, yağışlı günlerde açık teras kullanımı kısıtlanır',
      transit: 'Atmeydanı Narenciye Sokak No:16 üzerinde merkezden kısa yokuş çıkışı veya minibüsle erişimli',
      sources: [
        [
          'Tatilana Rize Ziraat Dosyası',
          'https://www.tatilana.com/',
          'editorial',
          'Çaykur Ziraat Botanik Çay Bahçesi tarihçesi ve mikro üretim tesisi',
        ],
        [
          'Gezilesi Yer Rize Çay Kültürü',
          'https://www.gezilesiyer.com/',
          'community',
          'Çay bahçeleri içinde taze demlik çay ve Rize manzarası doğrulaması',
        ],
      ],
      pros: ['Şehirle özdeşleşmiş gerçek Rize çayı deneyimi', 'Geniş çay terası ve körfez panoraması'],
      cons: ['Tam öğünlük restoran servisi beklenmemelidir'],
      unc: ['Sisli ve yağışlı günlerde manzara görüşü düşebilir'],
    }),

    // --- NEGATİF DENETİM KONTROLLERİ (17) ---
    negControl(
      'ctrl-rize-crakers-chain',
      'ChIJDVeqMxR7ZkARGK4tP_hxA5Q',
      'pizza',
      'Crakers Pizza yerli pizza zinciri reddedilir (Kapı 2)'
    ),
    negControl(
      'ctrl-rize-dominos-chain',
      'ChIJm8pkbOZ6ZkARjYY_0OVA_ww',
      'pizza',
      "Domino's Pizza küresel zincir + ★4.0 (Kapı 2/6)"
    ),
    negControl(
      'ctrl-rize-mono-chain',
      'ChIJOzqKOUx7ZkARTfs_lgth7yE',
      'hamburger',
      'Mono Burger zincir engeli — CHAIN_BLOCKLIST (Kapı 2)'
    ),
    negControl(
      'ctrl-rize-burgerking-chain',
      'ChIJ-e7GD1J7ZkARwvsdw5652QU',
      'hamburger',
      'Burger King küresel zincir + ★2.8 (Kapı 2/6)'
    ),
    negControl(
      'ctrl-rize-harvey-low',
      'ChIJz5ISjz97ZkARsyLcRzTl1vo',
      'hamburger',
      'Harvey Burger ★4.1 < ★4.4 kalite eşiği (Kapı 6)'
    ),
    negControl(
      'ctrl-rize-starbucks-chain',
      'ChIJ_1YV4zN7ZkARXrBHTBFbHaE',
      'kahve',
      'Starbucks küresel zincir + ★3.6 (Kapı 2/6)'
    ),
    negControl(
      'ctrl-rize-espressolab-chain',
      'ChIJYViyJFR7ZkARA8H1UcMx_xs',
      'kahve',
      'Espressolab çok şubeli zincir (Kapı 2)'
    ),
    negControl(
      'ctrl-rize-bayramefendi-chain',
      'ChIJg_Rku0Q8ZEARRzdKflfQ2PY',
      'kahve',
      'Bayramefendi Osmanlı Kahvecisi zincir + ★4.3 (Kapı 2/6)'
    ),
    negControl(
      'ctrl-rize-yagmur-purity',
      'ChIJgbslU-96ZkARAdR3zglRVAg',
      'kahve',
      'pastry_shop saf kahveci değildir + ★3.5 (Kapı 3B/6)'
    ),
    negControl(
      'ctrl-rize-konak-purity',
      'ChIJZfTsMup7ZkARXH65wMpXXe0',
      'kahve',
      'Konak pastaneleri pastry_shop saf kahveci değildir (Kapı 3B)'
    ),
    negControl(
      'ctrl-rize-fasuli-chain',
      'ChIJjyXF22p7ZkARMc0MZWNKzeA',
      'denemelisin',
      'Fasuli çok şehirli restoran zinciri reddedilir (Kapı 2)'
    ),
    negControl(
      'ctrl-rize-nalia-chain',
      'ChIJI1k_9757ZkARQI-lTKVNxhU',
      'denemelisin',
      'Nalia çok şubeli restoran zinciri + ★4.2 (Kapı 2/6)'
    ),
    negControl(
      'ctrl-rize-dagmaran-low',
      'ChIJG10sUod6ZkARvahODnVLKHI',
      'date',
      'Koruma bayrağı olmadan ★4.2 < ★4.4 kalite eşiği (Kapı 6)'
    ),
    negControl(
      'ctrl-rize-yakamoz-low',
      'ChIJ93CaO-h6ZkARmjqddXgkCyY',
      'date',
      'Koruma bayrağı olmadan ★4.3 < ★4.4 kalite eşiği (Kapı 6)'
    ),
    negControl(
      'ctrl-rize-evvelzaman-low',
      'ChIJy0tq7eV6ZkARDaO5OUPgdTU',
      'date',
      'Koruma bayrağı olmadan ★3.6 < ★4.4 kalite eşiği (Kapı 6)'
    ),
    negControl(
      'ctrl-rize-kuzeybalik-low',
      'ChIJCfomlZlFZkAR3TkoWGS1QyQ',
      'balik',
      'Koruma bayrağı olmadan ★4.2 < ★4.4 kalite eşiği (Kapı 6)'
    ),
    negControl(
      'ctrl-rize-cayeli-lale-outside',
      'ChIJSYRFwxxoZkARy0pA-5TI6TY',
      'denemelisin',
      'Çayeli Lale 1973 — Rize Merkez sınır dışı dış ilçe (Kapı 4)'
    ),
    negControl(
      'ctrl-rize-cayeli-husrev-outside',
      'ChIJ43rJuBRoZkARwdaHrBfNTOY',
      'denemelisin',
      'Çayeli Hüsrev — Rize Merkez sınır dışı dış ilçe (Kapı 4)'
    ),
    negControl(
      'ctrl-rize-derepazari-outside',
      'ChIJuctuQvZ7ZkAR57O7_QhKDPo',
      'denemelisin',
      'Derepazarı Köşk Pide — dış ilçe sınır dışı (Kapı 4)'
    ),
    negControl(
      'ctrl-rize-ayder-outside',
      'ChIJtyqecA0YZkARHdKfcZGAetw',
      'denemelisin',
      'Çamlıhemşin Ayder Yaylası — Rize Merkez sınır dışı (Kapı 4)'
    ),
  ],
};
