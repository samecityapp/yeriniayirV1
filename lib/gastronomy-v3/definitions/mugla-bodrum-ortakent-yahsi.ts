import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const MUGLA_BODRUM_ORTAKENT_YAHSI_DEF: V3RegionDefinition = {
  id: 'ortakent-yahsi-bodrum-mugla',
  slug: 'ortakent-yahsi',
  city: 'Muğla',
  district: 'Bodrum',
  allowedDistricts: ['Bodrum'],
  neighborhood: 'Ortakent & Yahşi',
  officialQuarter:
    'Müskebi (Ortakent) & Yahşi Mahalleleri — Yahşi Yalısı, Ortakent Köy İçi, Cumhuriyet Caddesi & Kargı Koyu Hattı',
  displayName: 'Ortakent & Yahşi, Bodrum, Muğla',
  locative: "Ortakent ve Yahşi'de",
  path: ['mugla', 'bodrum', 'ortakent-yahsi'],
  aliases: [
    'Ortakent & Yahşi',
    'Ortakent-Yahşi',
    'Ortakent',
    'Yahşi',
    'Yahsi',
    'Müskebi',
    'Muskebi',
    'Müsgebi',
    'Musgebi',
    'Yahşi Yalısı',
    'Kargı Koyu',
    'Camel Beach',
  ],
  scopeNote:
    'Yahşi Yalısı, Ortakent Köy İçi, Cumhuriyet & Müskebi Cd., Oyder Hattı & Kargı Koyu · Doğrulanmış Seçki',
  characterSubtitle:
    'Kargı Koyu ve Yahşi Yalısı kıyı şeridinden Oyder Caddesi ve mandalina bahçeleri arasındaki Müskebi (Ortakent) Köy İçi sokaklarına uzanan taş fırın İtalyan mutfağı, brioche burgerciler, üçüncü nesil kahve durakları, tarihi yağhane avlusu ile mandalina bahçeli meyhaneler, köy kahvaltıları, odun ateşinde yatık et dönerciler ve Kargı Koyu balıkçıları.',
  center: { lat: 37.0340, lng: 27.3455 },
  bbox: { minLat: 37.0010, maxLat: 37.0655, minLng: 27.3180, maxLng: 27.3650 },
  allowedNeighborhoodTokens: [
    'Ortakent',
    'Yahşi',
    'Yahsi',
    'Müskebi',
    'Muskebi',
    'Müsgebi',
    'Musgebi',
    'Kargı',
    'Kargi',
  ],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // ==================== 1. PİZZA ====================
    compactSeed({
      id: 'iz-bodrum-ortakent',
      placeId: 'ChIJVaWzaLtzvhQRWJ-fLXPF7fE',
      cat: 'pizza',
      secondaryCategoryIds: ['date'],
      brand: 'iz bodrum',
      area: 'Badrum Cd., Ortakent',
      signals: ['napoliten_pizza', 'el_yapimi_gnocchi_makarna', 'agaclar_alti_bahce'],
      verifiedAt: '2026-11-16',
      desc: "Ortakent'in kuzey sırtındaki Badrum (Kapuz) Caddesi üzerinde, ağaçlar altındaki sakin bahçesinde Napoli usulü odun ateşi pizzaları, el yapımı taze makarnaları ve klasik İtalyan başlangıçlarını sunan butik İtalyan restoranı.",
      order: ['Pizza Margherita', 'El Yapımı Taze Makarna', 'Gnocchi'],
      menu: [
        'Pizza Margherita',
        'Odun Ateşi Napoli Pizzaları',
        'El Yapımı Taze Makarna',
        'Gnocchi',
        'Bruschetta & Arancini',
        'Tiramisu & Panna Cotta',
      ],
      sec: [
        [
          'Bruschetta & Arancini (Antipasti)',
          'Ana pizza ve makarna siparişleri öncesinde paylaşımlık başlangıç olarak tercih edilen geleneksel İtalyan tabaklarıdır.',
          'izbodrum.com dijital menüsü ve Wanderlog kayıtları',
        ],
        [
          'Tiramisu & Panna Cotta',
          'Akşam yemeği kapanışında şarap eşliği sonrasında sunulan İtalyan tatlı klasikleridir.',
          'izbodrum.com menü listesi',
        ],
      ],
      seat: 'Ağaçlar altında mum ışıklı bahçe masaları, kapalı salon, çocuk oyun alanı ve kendine ait otopark',
      crowd: 'Marina kalabalığından uzak, akşam yemeğinde çiftler ve çocuklu ailelerle sakin İtalyan sofrası temposu',
      dis: 'Sahil hattından kuzeyde iç kesimde yer aldığından deniz manzarası sunmaz; yoğun sezon akşamlarında servis akışı yavaşlayabilir ve fiyat seviyesi üst-orta segmenttedir',
      transit: 'Müskebi (Ortakent) Badrum / Kapuz Caddesi No:93/3 üzerinde özel otopark imkanıyla',
      sources: [
        [
          'İZ Bodrum Resmi Web Sitesi & Dijital Menü',
          'https://www.izbodrum.com/',
          'operator',
          'Napoliten pizza, Pizza Margherita, gnocchi, taze makarna, bruschetta, arancini, tiramisu ve Kapuz Cd. No:93/3 doğrulaması',
        ],
        [
          'Mesprestiges — İZ Bodrum Mekan İncelemesi',
          'https://www.mesprestiges.com/',
          'editorial',
          'Marina hattından uzak ağaçlar altında mum ışıklı bahçe atmosferi ve İtalyan mutfak detayı',
        ],
        [
          'Bodrum Flow — İZ Bodrum Pizza & Makarna Akşamları',
          'https://www.bodrumflow.com/',
          'editorial',
          'Seçili akşamlarda iki kişilik pizza/makarna ve şarap eşleşmeleri bilgisi',
        ],
        [
          'Wanderlog & Yandex Harita — İZ Bodrum',
          'https://wanderlog.com/',
          'community',
          'Çocuk oyun alanı, otopark kolaylığı ve dönemsel servis hızı geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=17432806831098404696',
          'maps',
          'Müskebi Badrum Cad No:93 D:3 konum ve italian_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Yahşi sahil gürültüsünden uzakta ağaçlar içinde sakin İtalyan bahçe atmosferi sunması',
        'Odun ateşi Napoli pizzaları yanında el yapımı taze makarna, gnocchi ve antipasti çeşitliliği',
      ],
      cons: [
        'Üst-orta fiyat segmentinde yer alır ve yoğun yaz akşamlarında servis akışı uzayabilir',
        'Deniz kıyısında değil Ortakent kuzey sırtında kaldığından araçla ulaşım gerektirir',
      ],
      unc: ['Sezon dışında haftalık açık günler ve özel pizza-makarna akşamı takvimi güncellenebiliyor'],
    }),

    // ==================== 2. HAMBURGER ====================
    compactSeed({
      id: 'mid-burger-yahsi',
      placeId: 'ChIJ9eu_--RzvhQRPKjrIWdkaOY',
      cat: 'hamburger',
      brand: 'mid burger',
      area: 'Hortma Cd., Yahşi',
      signals: ['brioche_ekmek_burger', 'yahsi_garaji_cikisli', 'yuksek_gramaj_kofte'],
      verifiedAt: '2026-11-16',
      desc: "Ortakent-Yahşi çıkışlı yerel Bodrum burger markasının Hortma Caddesi Yahşi Garajı içindeki ana mutfağı. El yapımı yumuşak brioche ekmekler arasında doyurucu dana köftesi, karamelize soğan, mantar veya trüf soslarıyla hazırlanır.",
      order: ['Truffle Burger', 'Mushroom Burger', 'Mexico Burger'],
      menu: [
        'Klasik Mid Burger',
        'Cheeseburger',
        'Truffle Burger',
        'Mushroom Burger',
        'Mexico Burger',
        'Crispy Chicken Tenders',
        'Kabuklu Hollanda Patatesi',
        'Soğan Halkası',
      ],
      sec: [
        [
          'Crispy Chicken Tenders & Özel Soslar',
          'Dana burger dışındaki menüde çıtır tavuk parçaları ve imza dip sosları tercih edilir.',
          'Yemeksepeti ve Yandex menü kayıtları',
        ],
        [
          'Soğan Halkası & Kabuklu Hollanda Patatesi',
          'Burger menülerinin yanında paylaşımlık sıcak çıtır eşlikçi olarak sunulur.',
          'Yemeksepeti sipariş listesi',
        ],
      ],
      seat: 'Yahşi Garajı içi Hortma Caddesi cephesinde pratik oturma masaları ve hızlı paket servis tezgahı',
      crowd: 'Öğle ve akşam saatlerinde bölge sakinleri, genç gruplar ve paket siparişiyle hareketli',
      dis: 'Sahil manzaralı uzun oturum mekanı değildir; bazı misafir geri bildirimlerinde patates kızartması kıvamının burger köftesinin gerisinde kalabildiği ve yaz yoğunluğunda bekleme süresinin uzayabildiği belirtilmiştir',
      transit: 'Yahşi Mahallesi Hortma Caddesi üzerindeki Yahşi Garajı içinde yürüyüş ve araç ulaşımına uygun',
      sources: [
        [
          'Restaurant Guru — Mid Burger Yahşi',
          'https://restaurantguru.com/',
          'community',
          'El yapımı brioche ekmekli burger çeşitleri, güler yüzlü servis ve yüksek memnuniyet değerlendirmeleri',
        ],
        [
          'Yemeksepeti — Mid Burger Yahşi',
          'https://www.yemeksepeti.com/',
          'community',
          'Truffle, Mushroom, Mexico Burger ve Crispy Chicken Tenders menü kayıtları',
        ],
        [
          'Yandex Harita — Mid Burger Yahşi',
          'https://yandex.com.tr/harita',
          'community',
          'Hortma Cd. konumu, sıcak paket servis övgüleri ve patates kızartması geri bildirimleri',
        ],
        [
          'Mid Burger Bodrum Resmi Instagram',
          'https://instagram.com/midburgerbodrum',
          'operator',
          'Yahşi ana şube ve güncel ürün paylaşımları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=16602630420414834748',
          'maps',
          'Yahşi Hortma Cd. konum ve hamburger_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Taze brioche ekmek ve el yapımı köfte dengesini koruyan yerel Bodrum çıkışlı ana mutfak',
        'Sıcak ve hızlı paket servis ile truffle, mushroom, mexico gibi net burger çeşitliliği',
      ],
      cons: [
        'Yan ürün olarak gelen patates kızartması dönemsel olarak burger kalitesinin gerisinde kalabiliyor',
        'Garaj içi cadde noktasında olduğundan deniz kenarı ambiyansı sunmaz',
      ],
      unc: ['Yaz pik saatlerinde hem masa hem kurye yoğunluğu hazırlık süresini uzatabiliyor'],
    }),
    compactSeed({
      id: 'bob-burger-ortakent',
      placeId: 'ChIJo2eIjUdzvhQR-etvE1AxPag',
      cat: 'hamburger',
      brand: 'bob burger',
      area: 'Kemer Sk., Ortakent',
      signals: ['el_yapimi_ekmek', 'truflu_mayonez', 'tek_sube_yerel_burgerci'],
      verifiedAt: '2026-11-16',
      desc: "Ortakent Köy İçi Kemer Sokak'ta tek şubesiyle hizmet veren bağımsız gurme burgerci. Günlük taze burger ekmekleri, trüflü mayonez ve karamelize soğan gibi ev yapımı dokunuşların yanında tavuklu ve vejetaryen burger alternatifleri de hazırlar.",
      order: ['Bobby Cheeseburger', 'Süper Bob Burger', 'Klasik Burger'],
      menu: [
        'Bobby Cheeseburger',
        'Süper Bob Burger',
        'Klasik Burger',
        'Tavuklu Burger',
        'Vejetaryen Burger',
        'Soğan Halkası',
        'Patates Kızartması & Trüflü Mayonez',
      ],
      sec: [
        [
          'Tavuklu & Vejetaryen Burger Seçenekleri',
          'Klasik dana köfte dışında etsiz beslenenler ve tavuk burger tercih edenler için alternatif sunar.',
          'Yandex Harita ve Yemeksepeti menüsü',
        ],
        [
          'Soğan Halkası & Trüflü Dip Soslar',
          'Siparişlerin yanında taze ve sıcak sunulan yan ürün ve sos eşleşmeleridir.',
          'Yemeksepeti menü içerikleri',
        ],
      ],
      seat: 'Kemer Sokak üzerinde kompakt iç ve sokak önü masalarıyla paket servis odaklı düzen',
      crowd: 'Akşam saatlerinde Ortakent sakinleri ve online sipariş trafiğiyle düzenli akış',
      dis: 'İç kesim sokakta yer aldığından deniz manzarası sunmaz; yaz sezonu pik saatlerinde online paket sipariş yoğunluğu bekleme süresini uzatabiliyor',
      transit: 'Müskebi (Ortakent) Kemer Sokak No:16 üzerinde Ortakent Köy İçi merkez yürüyüş aksında',
      sources: [
        [
          'Yemeksepeti — Bob Burger Ortakent',
          'https://www.yemeksepeti.com/',
          'community',
          'Bobby Cheeseburger, Süper Bob Burger, taze ekmek ve hızlı sıcak paket teslimat değerlendirmeleri',
        ],
        [
          'Yandex Harita — Bob Burger Kemer Sk.',
          'https://yandex.com.tr/harita',
          'community',
          'Kemer Sk. No:16 konumu, trüflü mayonez, karamelize soğan ve vejetaryen burger notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=12122899991944489977',
          'maps',
          'Müskebi Kemer Sk. No:16 konum ve hamburger_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Ortakent Köy İçi merkezinde tek şubeli bağımsız yerel burger mutfağı olması',
        'Taze yumuşak ekmekler yanında vejetaryen ve tavuklu burger alternatifleri de sunması',
      ],
      cons: [
        'Sahil kesiminden uzakta ve dar oturma kapasiteli küçük bir sokak dükkanı yapısındadır',
        'Yoğun yaz akşamlarında kurye trafiği teslimat süresini etkileyebiliyor',
      ],
      unc: ['Sezon dışındaki akşam çalışma saatleri yerel talebe göre esneyebiliyor'],
    }),

    // ==================== 3. KAHVE ====================
    compactSeed({
      id: 'nis-coffee-bakery-yahsi',
      placeId: 'ChIJs0Cl1ndzvhQRbsv3MAUNl3c',
      cat: 'kahve',
      brand: 'nis coffee',
      area: 'Emiroğlu Sk., Yahşi',
      signals: ['nitelikli_kahve', 'kore_tostu_esligi', 'yahsi_ara_sokak_butik'],
      verifiedAt: '2026-11-16',
      desc: "Yahşi sahilinin hemen arkasındaki Emiroğlu Sokak'ta nitelikli kahve demlemelerini taze fırın ürünleri ve Kore tostu gibi yaratıcı atıştırmalıklarla buluşturan sakin, modern butik kahve dükkanı.",
      order: ['Flat White', 'Filtre Kahve', 'Iced Matcha Latte'],
      menu: [
        'Flat White & Espresso',
        'Filtre Kahve & Americano',
        'Iced Matcha & Matcha Latte',
        'Kore Tostu (Peynirli / Tavuklu / Etli)',
        'Kruvasan Çeşitleri',
        'Ekşi Mayalı Kahvaltı Tabağı',
      ],
      sec: [
        [
          'Kore Tostu (Peynirli / Tavuklu / Etli)',
          'Kaşık patates eşliğinde sunulan sıcak ve doyurucu tuzlu atıştırmalık olarak kahve yanında sıkça tercih edilir.',
          'niscoffeebakery.com ve GetClevi menü kayıtları',
        ],
        [
          'Taze Kruvasan & Ekşi Mayalı Sandviçler',
          'Sabah kahvesi ve öğle arası molalarında taze fırın tezgahından sunulan eşlikçilerdir.',
          'niscoffeebakery.com ve Yemeksepeti kayıtları',
        ],
      ],
      seat: 'Emiroğlu Sokak üzerinde küçük, özenli butik kafe oturma alanı',
      crowd: 'Sabah saatlerinden öğleden sonraya sakin kahve ve hafif atıştırmalık arayanlarla huzurlu tempo',
      dis: 'Küçük oturma kapasitesi nedeniyle yoğun saatlerde masa bulmak zorlaşabilir; ara sokakta özel otoparkı bulunmadığından yaz sezonunda park alanı sınırlıdır ve fiyatlar butik üst-orta düzeydedir',
      transit: 'Yahşi sahil yoluna paralel Emiroğlu Sokak No:18 üzerinde Yalı Caddesi yürüyüş mesafesinde',
      sources: [
        [
          'Nis Coffee & Bakery Resmi Web Sitesi',
          'https://niscoffeebakery.com/',
          'operator',
          'Specialty coffee, Kore tostları, ekşi mayalı kahvaltı tabağı ve Emiroğlu Sk. No:18 doğrulaması',
        ],
        [
          'GetClevi — Nis Coffee & Bakery Menü Rehberi',
          'https://getclevi.com/',
          'community',
          'Kahve, matcha, Kore tostu ve fırın ürünleri menü ile fiyat segmenti kayıtları',
        ],
        [
          'Yemeksepeti — Nis Coffee & Bakery',
          'https://www.yemeksepeti.com/',
          'community',
          'Iced matcha, kahve ve günlük taze fırın ürünleri aktif menü listesi',
        ],
        [
          'Yandex Harita — Nis Coffee & Bakery',
          'https://yandex.com.tr/harita',
          'community',
          'Müskebi Emiroğlu Sokak No:18 konum ve specialty coffee değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=8617370727944276846',
          'maps',
          'Müskebi Emiroğlu Sok No:18 konum ve coffee_shop doğrulaması',
        ],
      ],
      pros: [
        'Yahşi sahil bandındaki kalabalık zincir kafelere alternatif sakin nitelikli kahve ve matcha sunması',
        'Kahve yanında klasik poğaça yerine Kore tostu ve ekşi mayalı taze fırın seçenekleri hazırlaması',
      ],
      cons: [
        'Oturma alanı küçük olduğundan kalabalık gruplar için elverişli değildir',
        'Ara sokak konumu yaz döneminde araç parkını zorlaştırıyor',
      ],
      unc: ['Sezon dışında mutfak ve fırın ürün çeşitliliği günlük talebe göre daralabiliyor'],
    }),
    compactSeed({
      id: 'mini-coffee-shop-ortakent',
      placeId: 'ChIJsRZbjd25yhQRggq3ooAY4kM',
      cat: 'kahve',
      brand: 'mini coffee',
      area: 'Düzalan Cd., Ortakent',
      signals: ['butik_mahalle_kahvecisi', 'filtre_ve_cold_brew', 'samimi_mola_noktasi'],
      verifiedAt: '2026-11-16',
      desc: "Ortakent Köy İçi Düzalan Caddesi'nde AVM zincirlerinden uzakta günlük filtre kahve, espresso çeşitleri ve soğuk demleme cold brew sunan samimi ve kompakt mahalle kahvecisi.",
      order: ['Filtre Kahve', 'Cold Brew', 'Latte'],
      menu: [
        'Filtre Kahve',
        'Cold Brew & Buzlu Kahveler',
        'Espresso, Latte & Cappuccino',
        'Türk Kahvesi',
        'Günlük Kurabiye Çeşitleri',
        'Mini Kek & Tart Atıştırmalıkları',
      ],
      sec: [
        [
          'Günlük Kurabiye & Mini Kek Çeşitleri',
          'Kahve siparişlerinin yanında taze eşlikçi olarak tercih edilen ev yapımı tatlı atıştırmalıklardır.',
          'Yandex Harita ve yerel kahve rehberi notları',
        ],
        [
          'Türk Kahvesi & Bitki Çayları',
          'Espresso bazlı içecekler dışında klasik kahve ve sıcak demleme alternatifi sunar.',
          'Bodrum Mekan Rehberi kayıtları',
        ],
      ],
      seat: 'Düzalan Caddesi cephesinde birkaç masalı kompakt dükkan ve ayaküstü al-götür tezgahı',
      crowd: 'Gün içinde Ortakent sakinleri ve çevreden gelen hızlı kahve molası misafirleriyle sakin',
      dis: 'İsminin hakkını veren küçük bir dükkan olduğundan uzun süreli çalışma masaları veya geniş grup oturumu sunmaz; sahil hattından içeride kalır',
      transit: 'Ortakent Düzalan Caddesi No:8 üzerinde Cumhuriyet Caddesi merkezine yürüyüş mesafesinde',
      sources: [
        [
          'Bodrum Mekan Rehberi — Mini Coffee Shop',
          'https://www.bodrummekanrehberi.com/',
          'editorial',
          'Müskebi Düzalan Cd. No:8 adresi ve nitelikli filtre kahve odaklı yerel inceleme',
        ],
        [
          'Bodrum Guru — Mini Coffee Shop Ortakent',
          'https://www.bodrumguru.com/',
          'editorial',
          'Ortakent köy içi sakin kahve durağı ve butik mahalle atmosferi kaydı',
        ],
        [
          'Yandex Harita — Mini Coffee Shop',
          'https://yandex.com.tr/harita',
          'community',
          'Cold brew, latte, kurabiye ve ilgili işletmeci yaklaşımı geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=4891499086042565250',
          'maps',
          'Müskebi Düzalan Cd. No:8 konum ve cafe doğrulaması',
        ],
      ],
      pros: [
        'Midtown çevresindeki ticari AVM zincirlerine alternatif samimi mahalle kahvecisi olması',
        'Güler yüzlü servis, dengeli filtre kahve ve yaz aylarına uygun cold brew seçenekleri',
      ],
      cons: [
        'Oturma kapasitesi çok sınırlı olduğundan kalabalık gruplar ve uzun çalışma seansları için uygun değil',
        'Ortakent iç caddede kaldığından deniz manzarası bulunmaz',
      ],
      unc: ['Sezon dışı dönemlerde kapanış saatleri erken saatlere çekilebiliyor'],
    }),

    // ==================== 4. DATE MEKANLARI ====================
    compactSeed({
      id: 'yaghane-ortakent',
      placeId: 'ChIJw2m-Y6lzvhQRhYkz7tOQV7c',
      cat: 'date',
      brand: 'yaghane',
      area: 'Mustantik Sk., Ortakent',
      signals: ['tarihi_zeytinyagi_fabrikasi', 'ege_sarap_evi', 'asirlik_zeytin_avlusu'],
      verifiedAt: '2026-11-16',
      desc: "Ortakent Köy İçi'nde 1800'lerden kalma taş değirmenli tarihi zeytinyağı fabrikasının restore edilmesiyle kurulan kafe, bistro, şarap evi ve sanat galerisi. Asırlık zeytin ağaçları altındaki huzurlu avlusunda Ege şarapları, erken hasat zeytinyağı tadımları ve ekşi maya sandviçler sunar.",
      order: ['Ege Şarapları & Yerel Peynir Tabağı', 'Yağhane Tost', 'Avokadolu Kruvasan'],
      menu: [
        'Ege Beyaz & Kırmızı Şarap Seçkisi',
        'Yerel Peynir & Şarküteri Tabağı',
        'Erken Hasat Memecik Zeytinyağı Tadımı',
        'Yağhane Tost (Biber Salçalı & Zeytin Ezmeli)',
        'Ekşi Mayalı Tulum & Hindi Fümeli Baget',
        'Kabaklı Cevizli Gül Böreği',
        'Avokadolu Yumurtalı Kruvasan',
      ],
      sec: [
        [
          'Erken Hasat Memecik Zeytinyağı Tadımı & Atıştırmalık Bagetler',
          'Milas ve Bodrum yöresi soğuk sıkım zeytinyağları eşliğinde sunulan ekşi mayalı sandviç ve börek seçenekleridir.',
          'Mesprestiges incelemesi ve yaghanebodrum.com',
        ],
        [
          'Kabaklı Cevizli Gül Böreği & Ev Tatlıları',
          'Gündüz kahve molalarında ve akşamüstü şarap öncesi hafif eşlikçi olarak tercih edilir.',
          'Mesprestiges ve Yandex Harita kayıtları',
        ],
      ],
      seat: 'Tarihi taş duvarlar ve dev zeytin ağaçları gölgesinde sakin köy malikanesi ruhunda avlu masaları ile iç sergi alanı',
      crowd: 'Gün batımından akşama sakinlik, kültür ve şarap eşleşmesi arayan çiftler ve seçkin misafirlerle huzurlu tempo',
      dis: 'Büyük ölçekli sıcak ana yemek restoranından ziyade şarap evi, kafe ve hafif bistro menüsüyle çalışır; Ortakent iç sokakta otopark planlaması gerekebilir',
      transit: 'Ortakent Köy İçi Mustantik Sokak No:2 üzerinde merkezi köy yürüyüş aksında',
      sources: [
        [
          'Mesprestiges — Yağhane Bodrum İncelemesi',
          'https://www.mesprestiges.com/',
          'editorial',
          '150 yıllık zeytinyağı fabrikası dönüşümü, Ege şarapları, Yağhane Tost, kabaklı gül böreği ve avlu atmosferi detayı',
        ],
        [
          'Sözcü & Yerels — Tarihi Yağhane Restorasyonu',
          'https://www.sozcu.com.tr/',
          'editorial',
          '1800lü yıllardan kalma taş değirmenli yapının korunması, sergiler ve soğuk sıkım zeytinyağı kültürü haberi',
        ],
        [
          'Yağhane Bodrum Resmi Web Sitesi',
          'https://www.yaghanebodrum.com/',
          'operator',
          'Milas Memecik zeytinyağları, sergi alanı ve bistro işletme doğrulaması',
        ],
        [
          'Yandex Harita — Yaghane Cafe&Bistro',
          'https://yandex.com.tr/harita',
          'community',
          'Mustantik Sk. No:2 konumu, sessiz avlu huzuru ve kahve-tatlı geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=13211187271823493509',
          'maps',
          'Müskebi Mustantik Sk. No:2 konum ve bistro/art_gallery doğrulaması',
        ],
      ],
      pros: [
        'Bodrum yarımadasındaki en özgün tarihi taş yağhane atmosferi ve sakin zeytinlik avlusu',
        'Şarap eşlikçileri, yerel peynirler ve soğuk sıkım zeytinyağı tadımını kültür-sanatla buluşturması',
      ],
      cons: [
        'Kapsamlı akşam ana yemeği (et/balık) yerine kafe-bistro ve şarap eşlikçileri üzerine kuruludur',
        'Köy içi dar sokakta bulunduğundan araç parkı için yakında yer aramak gerekebilir',
      ],
      unc: ['Sergi takvimi ve akşam kapanış saatleri yaz-kış sezonuna göre değişiklik gösterebiliyor'],
    }),
    compactSeed({
      id: 'eyba-restoran-yahsi',
      placeId: 'ChIJ8--58JByvhQRS2HEJeAM_Jg',
      cat: 'date',
      brand: 'eyba',
      area: 'Oyder Cd., Yahşi',
      signals: ['mandalina_bahcesi_meyhane', 'nostaljik_turk_muzigi', 'masada_mangal'],
      verifiedAt: '2026-11-16',
      desc: "Oyder Caddesi üzerinde mandalina ve limon ağaçlarının altındaki yemyeşil bahçesinde nostaljik Türk müziği eşliğinde meyhane mezeleri, ciğer tava ve masada kendin pişir et mangal deneyimi sunan klasik Ortakent akşam mekanı.",
      order: ['Mangal Et & Pirzola Çeşitleri', 'Ege Otları & Kuru Cacık', 'Ciğer Tava & Atom'],
      menu: [
        'Kuzu Pirzola & Izgara Köfte',
        'Kırmızı Et Mangal Seçenekleri',
        'Ege Otları & Pilaki',
        'Kuru Cacık & Patlıcan Salatası',
        'Atom & Acılı Ezme',
        'Ciğer Tava',
        'Çıtır Patates',
      ],
      sec: [
        [
          'Balzamik Sirkeli Sebze & Köz Biber Mezeleri',
          'Et mangal masalarının başlangıcında meyhane dolabından paylaşılan klasik soğuk tabaklardır.',
          'Meyhanedeyiz.biz mekan profili',
        ],
        [
          'Izgara Köfte',
          'Pirzola dışında kendin pişir mangal tezgahında tercih edilen klasik et seçeneğidir.',
          'Yandex Harita misafir değerlendirmeleri',
        ],
      ],
      seat: 'Mandalina ve limon ağaçları altında masalara mangal kurulabilen geniş açık bahçe düzeni',
      crowd: 'Akşam saatlerinde nostaljik müzik eşliğinde uzun rakı-meze-et sofrası kuran çiftler ve gruplar',
      dis: 'Üst bütçe segmentinde konumlanır; yüksek yaz sezonunda servis hızı aksayabilir, masada mangal düzeni nedeniyle duman hassasiyeti olanlar için uygun olmayabilir ve rezervasyon gerekir',
      transit: 'Yahşi-Ortakent Oyder Caddesi No:16 üzerinde sahile yürüyüş mesafesinde',
      sources: [
        [
          'Meyhanedeyiz.biz — Eyba Restoran Ortakent',
          'https://www.meyhanedeyiz.biz/',
          'editorial',
          'Oyder Cd. No:16 konumu, Ege otları, kuru cacık, balzamik sebze, patlıcan salatası ve rezervasyon bilgisi',
        ],
        [
          'Meyhankoli & MyGuideBodrum — Eyba Restoran',
          'https://www.meyhankoli.com/',
          'editorial',
          'Mandalina ağaçları altında bahçe atmosferi, atom, ciğer tava ve üst segment fiyat değerlendirmesi',
        ],
        [
          'Wanderlog & Yandex Harita — Eyba Restoran',
          'https://yandex.com.tr/harita',
          'community',
          'Masada mangal konsepti, Zeki Müren şarkıları ve yoğun sezonda servis temposu notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=11023700144741966155',
          'maps',
          'Müskebi Oyder Cd. No:16 konum ve barbecue_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Mandalina ve limon ağaçları gölgesinde sahil gürültüsünden uzak nostaljik Bodrum bahçesi atmosferi',
        'Zengin Ege meze açılışının ardından masada kendi etini pişirebilme sosyalliği',
      ],
      cons: [
        'Üst fiyat segmentinde yer alır ve kalabalık yaz akşamlarında servis akışı yavaşlayabiliyor',
        'Masada mangal düzeni kıyafetlerde is kokusu bırakabilir',
      ],
      unc: ['Kış döneminde açık gün sayısı hava durumuna ve sezon talebine göre değişebiliyor'],
    }),

    // ==================== 5. KAHVALTI ====================
    compactSeed({
      id: 'yarbasan-restaurant-yahsi',
      placeId: 'ChIJx30nnO1yvhQRg52SZnGphPo',
      cat: 'kahvalti',
      pinnedFirst: true,
      brand: 'yarbasan',
      area: 'Kuşlan Sk., Yahşi',
      signals: ['tarladan_sofraya_kahvalti', 'tas_firin_pide_borek', 'zeytinlik_bahce'],
      verifiedAt: '2026-11-16',
      desc: "Yahşi sırtlarındaki Kuşlan Sokak'ta kalabalıktan uzak yeşil bahçesinde kendi üretimi reçeller, taze köy ürünleri ve arka taş fırından sıcak çıkan pideler, el açması otlu börekler ile Bodrum'un köklü serpme kahvaltı deneyimini sunan aile işletmesi.",
      order: ['Serpme Köy Kahvaltısı', 'El Açması Otlu & Paçanga Böreği', 'Kavurmalı Taş Fırın Pide'],
      menu: [
        'Serpme Köy Kahvaltısı',
        'Ev Yapımı Mevsim Reçelleri & Kaymak',
        'Arka Fırından Sıcak Lavaş, Pişi & Simit',
        'El Açması Otlu Börek & Paçanga Böreği',
        'Kavurmalı & Kıymalı Taş Fırın Pide',
        'Tahinli Pide',
        'Köy Yumurtası Çeşitleri',
      ],
      sec: [
        [
          'Tahinli Pide & Ev Yapımı Acı Sos',
          'Kahvaltı masasının sonunda fırından sıcak çıkan tatlı pide ve özel baharatlı kahvaltı sosu öne çıkar.',
          'Meyhankoli incelemesi ve mesprestiges.com',
        ],
        [
          'Ev Yemekleri & Taze Günlük Mezeler',
          'Öğle sonrası saatlerde kahvaltı dışında yöresel Ege ev yemekleri de mutfaktan çıkar.',
          'Eatbu ve Wanderlog kayıtları',
        ],
      ],
      seat: 'Ağaçlar altında geniş, rustik ahşap masalı doğa bahçesi ve kapalı kış alanı',
      crowd: 'Özellikle hafta sonları ve pazar sabahları uzun kahvaltı sofraları kuran aileler ve gruplarla çok yoğun',
      dis: 'Hafta sonları ve yaz sezonunda birkaç gün önceden rezervasyon yapılmadan masa bulmak neredeyse imkansızdır; öğleden sonra erken kapanabildiği için gitmeden saat teyidi gerekir',
      transit: 'Yahşi Mahallesi Kuşlan Sokak No:29 üzerinde Hortma Caddesi iç sırt hattında',
      sources: [
        [
          'Mesprestiges — Yarbasan Restaurant Bodrum',
          'https://www.mesprestiges.com/',
          'editorial',
          'Kuşlan Sk. No:29 adresi, tarladan sofraya felsefe, ev yapımı reçeller ve hafta sonu rezervasyon zorunluluğu',
        ],
        [
          'Meyhankoli & Kahvaltılık.com — Yarbasan',
          'https://www.meyhankoli.com/',
          'editorial',
          'Arka fırından çıkan sıcak pide-lavaş-pişi, otlu börek, kavurmalı pide ve tahinli pide detayları',
        ],
        [
          'Wanderlog — Yarbasan Restaurant',
          'https://wanderlog.com/',
          'community',
          'Rustik ağaçlık bahçe atmosferi, ürün doğallığı ve aile işletmesi ilgisi değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=18051739510925073795',
          'maps',
          'Yahşi Kuslan Sk. No:29 konum ve turkish_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Dondurulmuş ürün yerine kendi bahçe ve fırınından çıkan taze peynir, reçel, pişi ve sıcak pideler',
        'Yahşi sahil gürültüsünden uzakta geniş ve gölgelikli doğal bahçe ortamı',
      ],
      cons: [
        'Hafta sonları özellikle pazar sabahları rezervasyonsuz yer bulmak çok zordur',
        'Akşam yemeği yerine gündüz ve kahvaltı odaklı erken kapanan bir işletme düzenine sahiptir',
      ],
      unc: ['Sezon dışında hafta içi açılış ve kapanış saatleri dönemsel olarak daralabiliyor'],
    }),
    compactSeed({
      id: 'fikriye-sultan-ortakent',
      placeId: 'ChIJ3ZWB2jBzvhQRvGXb9hE5KI4',
      cat: 'kahvalti',
      brand: 'fikriye sultan',
      area: '2729. Sk., Ortakent',
      signals: ['zeytinlik_serpme_kahvalti', 'bakir_tavada_menemen', 'semaverde_cay'],
      verifiedAt: '2026-11-16',
      desc: "Ortakent'in üst kesimindeki 2729. Sokak'ta asırlık zeytin ağaçlarının gölgesinde bakır tavada menemen, çıtır pişi, ev yapımı zeytin-reçeller ve semaverde çay ile evcil hayvan dostu sakin köy kahvaltısı sunan bahçe mekanı.",
      order: ['Serpme Köy Kahvaltısı', 'Bakır Tavada Menemen', 'Çıtır Pişi'],
      menu: [
        'Ev Yapımı Serpme Köy Kahvaltısı',
        'Bakır Tavada Menemen',
        'Çıtır Pişi',
        'Ev Yapımı Zeytin & Reçel Çeşitleri',
        'Yöresel Peynir Tabağı',
        'Semaverde Sınırsız Çay',
      ],
      sec: [
        [
          'Semaverde Çay & Ev Yapımı Zeytin Reçel Çeşitleri',
          'Bahçedeki uzun kahvaltılarda masalara gelen semaver servisi ve ev yapımı doğal reçeller deneyimi tamamlar.',
          'fikriyesultan.com ve bodrumfinder.com kayıtları',
        ],
      ],
      seat: 'Zeytin ağaçları altında ferah açık bahçe masaları (evcil hayvan kabul edilir)',
      crowd: 'Sabah saatlerinden öğleden sonraya doğa içinde sessiz ve uzun kahvaltı arayan çiftler ve aileler',
      dis: 'Sabah ve öğleden erken saatlere odaklı çalıştığından günün ikinci yarısında kapanır; Ortakent üst sokakta kaldığı için araç gerektirir ve küçük bahçe kapasitesi nedeniyle önceden telefonla yer sormak faydalıdır',
      transit: 'Müskebi (Ortakent) 2729. Sokak No:3 üzerinde Ortakent iç kesiminde',
      sources: [
        [
          'Fikriye Sultan Kahvaltı Bahçesi Resmi Web Sitesi',
          'http://www.fikriyesultan.com/',
          'operator',
          'Bakır tavada menemen, çıtır pişi, ev zeytinleri, semaverde çay ve 2729. Sk. No:3 doğrulaması',
        ],
        [
          'Bodrum Finder & NerdeYiyelim — Fikriye Sultan',
          'https://www.bodrumfinder.com/',
          'editorial',
          'Zeytin ağaçları altında ev yapımı serpme kahvaltı, menemen ve yöresel peynir tabağı rehber kaydı',
        ],
        [
          'Yandex Harita & YouTube Mekan İncelemeleri',
          'https://yandex.com.tr/harita',
          'community',
          'Evcil hayvan dostu bahçe ortamı, sessiz doğa konumu ve misafir değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=10243500101772993980',
          'maps',
          'Müskebi 2729 Sokak No:3 konum ve breakfast_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Şehir gürültüsünden tamamen uzak gerçek zeytin bahçesi içinde huzurlu serpme kahvaltı sunması',
        'Evcil hayvan dostu açık alan yapısı ve masaya semaverle çay servisi',
      ],
      cons: [
        'Öğleden sonra erken saatlerde kapandığı için geç öğünlere uygun değildir',
        'Ana yolların dışında ara sokakta bulunduğundan araçsız ulaşım zordur',
      ],
      unc: ['Sezon dışında yağışlı günlerde kapalı alan kapasitesi sınırlı kalabiliyor'],
    }),
    compactSeed({
      id: 'firinci-oyder-yahsi',
      placeId: 'ChIJ1X2hKGZzvhQRVfPoXIL08ig',
      cat: 'kahvalti',
      brand: 'firinci',
      area: 'Oyder Cd., Yahşi',
      signals: ['eksi_mayali_ekmek', 'sabah_kruvasan_simit', 'oyder_caddesi_firin'],
      verifiedAt: '2026-11-16',
      desc: "Yahşi Oyder Caddesi üzerinde günlük taze çıkan ekşi mayalı ekmekleri, simit, poğaça, kruvasan ve pastane ürünleriyle sabah kahvaltısı ve fırın molası için bölge sakinlerinin tercih ettiği artizan fırın-pastane.",
      order: ['Taze Kruvasan Çeşitleri', 'Ekşi Mayalı Ekmekler', 'Bodrum Simidi & Poğaça'],
      menu: [
        'Ekşi Mayalı Artizan Ekmekler',
        'Taze Kruvasan Çeşitleri',
        'Sıcak Poğaça & Simit',
        'Günlük Pastane & Tart Ürünleri',
        'Kuru & Yaş Pastalar',
      ],
      sec: [
        [
          'Günlük Pastane & Tart Ürünleri',
          'Sabah fırın çeşitleri dışında öğleden sonra tatlı molaları için günlük hazırlanan dilim pasta ve tartlar bulunur.',
          'Yandex Harita ve bodrumguru.com kayıtları',
        ],
      ],
      seat: 'Oyder Caddesi üzerinde pratik oturma düzeni ve yoğun al-götür fırın tezgahı',
      crowd: 'Sabah erken saatlerden itibaren taze ekmek ve hamur işi alan mahalle sakinleriyle hareketli',
      dis: 'Serpme bahçe kahvaltısı mekanı değil, ağırlıklı olarak fırın ve pastane tezgahı formatında hizmet verir; oturma kapasitesi sınırlıdır',
      transit: 'Yahşi (Müskebi) Oyder Caddesi No:30 üzerinde Tansel Market ve Oyder Kavşağı yakınında',
      sources: [
        [
          'Bodrum Guru — Fırıncı Ortakent Rehberi',
          'https://www.bodrumguru.com/',
          'editorial',
          'Taze ekmekler, ekşi maya alternatifleri, simit, poğaça ve kruvasan çeşitleri değerlendirmesi',
        ],
        [
          'Yandex Harita — Fırıncı Patisserie Oyder Cd.',
          'https://yandex.com.tr/harita',
          'community',
          'Oyder Cd. No:30 (Tansel Market civarı) konumu ve unlu mamul kalite notları',
        ],
        [
          'Winniey — Fırıncı Patisserie Bodrum',
          'https://winniey.com/',
          'community',
          'Ortakent-Yahşi Oyder Caddesi pastane ve fırın doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=2950689546622792533',
          'maps',
          'Müskebi Oyder Cd. konum ve pastry_shop doğrulaması',
        ],
      ],
      pros: [
        'Oyder hattında günlük sıcak simit, poğaça, kruvasan ve ekşi maya ekmek bulmayı kolaylaştırması',
        'Uzun serpme kahvaltı yerine hızlı ve taze sabah fırın ürünü arayanlar için pratik olması',
      ],
      cons: [
        'Bahçeli uzun oturumlu kahvaltı sofrası değil fırın-pastane tezgahı konseptindedir',
        'Popüler çeşitler sabah geç saatlere kalmadan tükenebiliyor',
      ],
      unc: ['Gün içi pasta ve ekmek çeşitliliği fırından çıkış saatlerine göre değişebiliyor'],
    }),

    // ==================== 6. MUTLAKA DENEMELİSİN ====================
    compactSeed({
      id: 'cezayir-usta-ortakent',
      placeId: 'ChIJJ8qkjxpzvhQRpVYcnUDR1YE',
      cat: 'denemelisin',
      pinnedFirst: true,
      brand: 'cezayir usta',
      area: '2721. Cd., Ortakent',
      signals: ['1970_odun_atesi_yatik_doner', 'suzme_yogurt_sumakli_sogan', 'fethiye_koklu_usta'],
      verifiedAt: '2026-11-16',
      desc: "Kökleri 1970'e uzanan Fethiye çıkışlı ustalık geleneğini Ortakent 2721. Cadde'ye taşıyan; odun ateşinde yatık şişte pişirdiği hafif, ağır yağ bırakmayan yaprak et dönerini süzme yoğurt, sumaklı soğan ve köz domatesle sunan döner salonu.",
      order: ['Odun Ateşinde Yatık Et Döner (Tabak)', 'Lavaş Dürüm Et Döner', 'Tombik Ekmek Et Döner'],
      menu: [
        'Tabakta Yatık Et Döner (Süzme Yoğurt & Sumaklı Soğanlı)',
        'Lavaş Dürüm Et Döner',
        'Tombik Ekmek Et Döner',
        'Günün Çorbası',
        'Ayran & Şalgam',
      ],
      sec: [
        [
          'Günün Çorbası & Ayran Eşliği',
          'Odaklı döner menüsünü tamamlayan sıcak çorba başlangıcı ve geleneksel içecek seçeneğidir.',
          'cezayirusta.com menü listesi',
        ],
        [
          'Süzme Yoğurtlu ve Pişmiş Domatesli Tabak Sunumu',
          'Dönerin yanında verilen roka, salatalık ve cin biber turşusuyla hafifliğini koruyan servis biçimidir.',
          'Yandex Harita ve Yemeksepeti kayıtları',
        ],
      ],
      seat: 'MY İnko Çarşısı içinde sade, düzenli salon masaları ve hızlı servis tezgahı',
      crowd: 'Öğle saatlerinden şiş bitimine dek bölge esnafı, tatilciler ve paket siparişiyle yoğun',
      dis: 'Günlük hazırlanan yatık döner şişi tükendiğinde servis sona erdiğinden akşam geç saatlerde et kalmama ihtimali vardır; sahil manzarası bulunmaz',
      transit: 'Müskebi (Ortakent) 2721. Cadde No:8/6 üzerinde Ortakent PTT karşısı MY İnko Çarşısı içinde',
      sources: [
        [
          'Cezayir Usta Resmi Web Sitesi',
          'https://www.cezayirusta.com/',
          'operator',
          '1970den beri odun ateşinde yatık et döner geleneği, gramaj seçenekleri ve Ortakent adres doğrulaması',
        ],
        [
          'Restaurant Guru — Cezayir Usta Bodrum Döner Salonu',
          'https://restaurantguru.com/',
          'community',
          'Hafif yağ dengesi, kalite istikrarı ve servis hızı değerlendirmeleri',
        ],
        [
          'Yemeksepeti & Yandex Harita — Cezayir Usta Ortakent',
          'https://www.yemeksepeti.com/',
          'community',
          'Süzme yoğurt, sumaklı soğan, pişmiş domatesli tabak servisi ve sıcak paket teslimat notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=9355613876376065701',
          'maps',
          'Müskebi 2721 Cad. No:8/6 konum ve turkish_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Dikey döner yerine odun ateşinde yatık pişirimle ağır yağ hissi bırakmayan gerçek yaprak et döner',
        'Süzme yoğurt, sumaklı soğan, köz domates ve turşu eşlikçileriyle eksiksiz esnaf servisi',
      ],
      cons: [
        'Günlük şiş tükendiğinde kapanabildiği için geç akşam ziyaretlerinde stok riski taşır',
        'Çarşı içi sade yemek salonu düzeninde olduğundan manzaralı uzun oturuma hitap etmez',
      ],
      unc: ['Sezon dışında şişin tükenme saati günlük yoğunluğa göre öne çekilebiliyor'],
    }),
    compactSeed({
      id: 'ramonun-yeri-yahsi',
      placeId: 'ChIJgcpWhYpzvhQR4g7Byd2lM_w',
      cat: 'denemelisin',
      brand: 'ramo',
      area: 'Hortma Cd., Yahşi',
      signals: ['sabah_gece_esnaf_lokantasi', 'et_cokertme_yaprak_ciger', 'gece_kelle_paca'],
      verifiedAt: '2026-11-16',
      desc: "Yahşi Hortma Caddesi'nde Şef Ramazan Çığlı yönetiminde sabahtan gece yarısı sonrasına kadar açık kalan; ev yapımı gözleme ve menemenle güne başlayıp gün içinde et çökertme, dana külbastı, yaprak ciğer ve gece kelle paça çorbası çıkaran samimi aile lokantası.",
      order: ['Et Çökertme', 'Dana Külbastı', 'Yaprak Ciğer'],
      menu: [
        'Et Çökertme',
        'Dana Külbastı (Köz Patlıcan & Yoğurtlu)',
        'Yaprak Ciğer (Sumaklı Soğanlı)',
        'Ramo Izgara Köfte',
        'Kelle Paça Çorbası',
        'Üç Peynirli & Ispanaklı Gözleme',
        'Bazlama Tost & Menemen',
      ],
      sec: [
        [
          'Kelle Paça Çorbası & Gece Izgaraları',
          'Yahşi bölgesinde gece geç saatlere dek sıcak çorba ve ızgara köfte arayanların uğrak seçeneğidir.',
          'ramonunyeribodrum.com menü listesi',
        ],
        [
          'El Açması Gözleme & Bazlama Tost',
          'Sabah ve gündüz öğünlerinde kahvaltı ve pratik atıştırmalık olarak tercih edilir.',
          'ramonunyeribodrum.com ve Yandex kayıtları',
        ],
      ],
      seat: 'Hortma Caddesi üzerinde sade ve samimi aile lokantası masaları',
      crowd: 'Sabah kahvaltıcılarından akşam ızgara gruplarına ve gece çorbası müdavimlerine uzanan geniş akış',
      dis: 'Turistik deniz manzaralı restoran yerine yol üstü samimi lokanta düzenindedir; yaz sezonunda et yemekleri fiyatlaması Bodrum ortalamasına paralel yüksek bulunabiliyor',
      transit: 'Yahşi Mahallesi Hortma Caddesi No:83/C üzerinde Yahşi Garajı cephesinde',
      sources: [
        [
          "Ramo'nun Yeri Bodrum Resmi Web Sitesi",
          'https://ramonunyeribodrum.com/',
          'operator',
          'Şef Ramazan Çığlı mutfağı, et çökertme, dana külbastı, yaprak ciğer, kelle paça ve gözleme menüsü',
        ],
        [
          "Restaurant Guru — Ramo'nun Yeri Bodrum",
          'https://restaurantguru.com/',
          'community',
          'Güler yüzlü aile işletmesi yaklaşımı, köfte-ciğer kalitesi ve yüksek misafir memnuniyeti',
        ],
        [
          "Yandex Harita — Ramo'nun Yeri Bodrum",
          'https://yandex.com.tr/harita',
          'community',
          'Gece geç saatlere uzanan açık çalışma düzeni, kelle paça ve gözleme geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=18173051293361311458',
          'maps',
          'Yahşi Hortma Cd. 83/C konum ve turkish_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Sabah gözlemeden akşam et çökertme ve gece kelle paça çorbasına kadar çok geniş saatlerde açık kalması',
        'Aile işletmesi sıcaklığında hem ev yemeği hem kömür ızgara seçeneklerini bir arada sunması',
      ],
      cons: [
        'Sahil kenarında değil cadde/garaj aksında bulunduğundan deniz manzarası sunmaz',
        'Kırmızı et ana yemekleri yüksek sezonda tatil bölgesi fiyat bandındadır',
      ],
      unc: ['Sezon dışında gece geç saat servisinin kapanış zamanı dönemsel değişebiliyor'],
    }),
    compactSeed({
      id: 'gussiye-et-mangal-ortakent',
      placeId: 'ChIJ-wsdfB1zvhQRCUI_sHyzL78',
      cat: 'denemelisin',
      brand: 'gussiye',
      area: 'Müskebi Cd., Ortakent',
      signals: ['mandalina_bahcesi_ocakbasi', 'masada_mangal', 'butce_dostu_aile_isletmesi'],
      verifiedAt: '2026-11-16',
      desc: "Ortakent Müskebi Caddesi üzerinde mandalina bahçeleri içinde yer alan, kışın şömineli ve sobalı sıcak salonuyla, yazın sakin bahçesiyle hizmet veren; kuzu şiş, pirzola, köfte ve taze mezeleri dengeli fiyat-performans çizgisinde sunan aile işletmesi.",
      order: ['Kuzu Pirzola & Kuzu Şiş', 'Izgara Köfte & Ciğer', 'Enginar Kalbi & Çıtır Mantı'],
      menu: [
        'Kuzu Pirzola & Kuzu Şiş',
        'Izgara Köfte & Ciğer',
        'Masada Mangal Et Seçenekleri',
        'Enginar Kalbi & Taze Mezeler',
        'Çıtır Soğan & Çıtır Mantı',
        'Bahçe Salatası & İkram Yeşillikler',
      ],
      sec: [
        [
          'Taze Mezeler (Enginar Kalbi & Çıtır Mantı)',
          'Mangal etleri öncesinde masada paylaşılan soğuk ve çıtır ara sıcak seçkisidir.',
          'Wanderlog ve Yandex Harita değerlendirmeleri',
        ],
      ],
      seat: 'Mandalina ağaçları altında sakin bahçe masaları, kışın şömineli iç salon ve özel otopark alanı',
      crowd: 'Yüksek sesli müzikten kaçıp sakin et mangal akşamı geçirmek isteyen aileler ve yerel müdavimler',
      dis: 'Genellikle akşamüstü saatlerinden itibaren açıldığı için öğle servisi vermez; sahilden içeride cadde konumunda yer alır',
      transit: 'Müskebi (Ortakent) Müskebi Caddesi No:56 üzerinde Ortakent Pazar Yeri yakınında özel otoparkıyla',
      sources: [
        [
          'Wanderlog — Güssiye Restaurant Et Mangal',
          'https://wanderlog.com/',
          'editorial',
          'Mandalina bahçesi, kış şöminesi, otopark, enginar kalbi, çıtır mantı ve dengeli fiyat-performans incelemesi',
        ],
        [
          'Yandex Harita — Güssiye Restaurant Et Mangal',
          'https://yandex.com.tr/harita',
          'community',
          'Müskebi Cd. No:56 konumu, et pişirme kıvamı, taze mezeler ve sakin aile işletmesi geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=13776427133263888905',
          'maps',
          'Müskebi Cd. No:56 konum ve restaurant doğrulaması',
        ],
      ],
      pros: [
        'Bodrum lüks sahil mekanlarına kıyasla daha ulaşılabilir fiyatlarla et mangal ve taze meze sunması',
        'Yazın mandalina bahçesi, kışın şömineli salon ve kendi otoparkıyla dört mevsim konforlu olması',
      ],
      cons: [
        'Akşamüstü sonrası açıldığı için gündüz öğle yemeğine uygun değildir',
        'Denize uzak iç cadde hattında bulunduğundan manzara beklentisiyle gidilmemelidir',
      ],
      unc: ['Sezon dışı dönemlerde haftalık çalışma günleri ve şömine salonu düzeni değişebiliyor'],
    }),
    compactSeed({
      id: 'donerci-alizade-ortakent',
      placeId: 'ChIJzVREdwBzvhQR4XpCvdaUkzo',
      cat: 'denemelisin',
      brand: 'alizade',
      area: 'Kemer Sk., Ortakent',
      signals: ['1973_erzurum_cag_kebabi', 'odun_atesi_yaprak_doner', 'gunluk_taze_et'],
      verifiedAt: '2026-11-16',
      desc: "Kökleri 1973'e uzanan usta-çırak geleneğini Ortakent Kemer Sokak'a taşıyan; dana ve kuzu karışımlı eti yatay şişte odun ateşinde pişirip tereyağıyla sunduğu Erzurum cağ kebabı ve günlük taze yaprak dönerleriyle tanınan lokanta.",
      order: ['Erzurum Cağ Kebabı', 'Pilav Üstü Yaprak Et Döner', 'Lavaş Dürüm Et Döner'],
      menu: [
        'Erzurum Usulü Cağ Kebabı',
        'Pilav Üstü Yaprak Et Döner',
        'Lavaş Dürüm Et & Tavuk Döner',
        'Yaprak Sarma & Piyaz',
        'Ev Yapımı Ayran & Şalgam',
      ],
      sec: [
        [
          'Yaprak Sarma & Piyaz',
          'Cağ kebabı ve döner porsiyonlarının yanında tercih edilen geleneksel ev yapımı yan lezzetlerdir.',
          'donercializade.com.tr menü ve mobil sipariş listesi',
        ],
        [
          'Ev Yapımı Ayran & Taze Fırın Ekmeği',
          'Her sabah kendi mutfağında çıkan taze ekmek ve köpüklü ayran eşliği sunar.',
          'donercializade.com.tr kurumsal kayıtları',
        ],
      ],
      seat: 'Taş duvarlı ve yeşil tenteli sade aile lokantası masaları ve açık mutfak tezgahı',
      crowd: 'Öğle ve akşam saatlerinde Erzurum cağ kebabı arayan bölge sakinleri ve paket siparişleriyle canlı',
      dis: 'Günü kurtarmayan taze tüketim ilkesiyle çalıştığından etler tükendiğinde servis bitebilir; sahil yerine köy içi esnaf sokağındadır',
      transit: 'Müskebi (Ortakent) Kemer Sokak No:6 üzerinde Ortakent merkez çarşı yürüyüş aksında',
      sources: [
        [
          'Dönerci Alizade Resmi Web Sitesi',
          'https://donercializade.com.tr/',
          'operator',
          '1973 geleneği, odun ateşinde Erzurum cağ kebabı, günlük yaprak döner ve taze ekmek doğrulaması',
        ],
        [
          'Bodrum Guru — Dönerci Alizade Ortakent',
          'https://www.bodrumguru.com/',
          'editorial',
          'Ortakent cephesinde geleneksel cağ kebabı ve yaprak döner esnaf durağı önerisi',
        ],
        [
          'Apple App Store — Dönerci Alizade Menü',
          'https://apps.apple.com/',
          'community',
          'Dana-kuzu cağ kebabı, yaprak sarma, piyaz ve ev yapımı ayran menü listesi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=4220880925795449569',
          'maps',
          'Müskebi Kemer Sk. No:6 konum ve turkish_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Bodrum yarımadasında ender bulunan gerçek odun ateşli Erzurum cağ kebabı adresi olması',
        'Ertesi güne et bırakmayan şeffaf mutfak anlayışı ve sabah pişen taze ekmekler',
      ],
      cons: [
        'Akşam geç saatlerde günlük et stoğu tükenebiliyor',
        'Sade esnaf lokantası ortamında olduğundan uzun akşam buluşmalarına yönelik değildir',
      ],
      unc: ['Sezon dışındaki akşam servis bitiş saati günlük tüketim hızına bağlıdır'],
    }),
    compactSeed({
      id: 'musgebi-cafe-yahsi',
      placeId: 'ChIJxTCYupdyvhQRCmZe9arr5Qc',
      cat: 'denemelisin',
      brand: 'musgebi',
      area: 'Yalı Cd., Yahşi',
      signals: ['belediye_sosyal_tesisi', 'denize_sifir_iskele', 'ekonomik_sahil_duragi'],
      verifiedAt: '2026-11-16',
      desc: "Yahşi Yalı Caddesi'nde Bodrum Belediyesi iştirakiyle işletilen, denize sıfır iskelesi ve plaj şezlong alanıyla özel beach fiyatlarının aksine herkesin ulaşabildiği ekonomik kahvaltı, tost, burger, çay ve kahve noktası.",
      order: ['Kahvaltı Tabağı', 'Kaşarlı & Karışık Tost', 'Çay & Türk Kahvesi'],
      menu: [
        'Kahvaltı Tabağı',
        'Kaşarlı & Karışık Tost',
        'Hamburger & Patates Kızartması',
        'Simit & Poğaça',
        'Çay & Türk Kahvesi',
        'Soğuk İçecekler',
      ],
      sec: [
        [
          'Hamburger & Patates Kızartması',
          'Deniz sonrası öğle saatlerinde plaj misafirlerinin hızlı atıştırmalık olarak tercih ettiği sıcak menü kalemidir.',
          'Yandex Harita ve bodrumbelediyeas.com.tr kayıtları',
        ],
        [
          'Simit, Poğaça & Plaj İskelesi Kahvesi',
          'Sabah yürüyüşü veya deniz keyfi arasında ekonomik fiyatlı kıyı molası sağlar.',
          'Kent TV ve Yandex değerlendirmeleri',
        ],
      ],
      seat: 'Denize sıfır açık teras, ahşap iskele ve şezlonglu belediye plajı alanı (self-servis düzen)',
      crowd: 'Sabah yürüyüşçülerinden gün boyu denize giren ailelere yüksek sezonda oldukça kalabalık',
      dis: 'Self-servis çalıştığı için yoğun yaz günlerinde ve hafta sonlarında kasa sırası, masa bulma zorluğu ve temizlik/servis hızında aksamalar yaşanabiliyor',
      transit: 'Yahşi sahil bandı Yalı Caddesi No:2 üzerinde sahil yürüyüş yolunda',
      sources: [
        [
          'Bodrum Belediye A.Ş. — Müsgebi Cafe Resmi Sayfası',
          'https://bodrumbelediyeas.com.tr/',
          'operator',
          'Belediye sosyal tesisi işletmesi, denize sıfır iskele ve Yalı Cd. No:2 doğrulaması',
        ],
        [
          'Kent TV — Bodrum Belediyesi Müsgebi Cafe Haberi',
          'https://www.kenttv.net/',
          'editorial',
          'Sahil şeridinde plaj-iskele imkanı ve sosyal tesis hizmeti haberi',
        ],
        [
          'Yandex Harita — Bodrum Belediyesi Müsgebi Cafe',
          'https://yandex.com.tr/harita',
          'community',
          'Bütçe dostu belediye fiyatları, deniz manzarası övgüsü ve self-servis yoğunluk eleştirileri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=569120047425807882',
          'maps',
          'Müskebi Yalı Cd. No:2 konum ve cafe doğrulaması',
        ],
      ],
      pros: [
        'Yahşi sahilindeki yüksek beach fiyatlarına karşı denize sıfır iskelede en ekonomik alternatif olması',
        'Sabah kahvaltısından plaj sonrası tost ve kahveye gün boyu pratik erişim',
      ],
      cons: [
        'Yaz sezonunda çok kalabalık olduğundan şezlong ve masa bulmak erken saat gerektirir',
        'Self-servis tezgahında pik saatlerde sıra ve masa temizliğinde gecikmeler olabiliyor',
      ],
      unc: ['Plaj iskele ve şezlong sezon açılış-kapanış tarihleri hava şartlarına göre değişebiliyor'],
    }),
    compactSeed({
      id: 'emektar-gurme-ortakent',
      placeId: 'ChIJsyfjP39zvhQR8TPVHelEczk',
      cat: 'denemelisin',
      name: 'Emektar Gurme Ortakent',
      brand: 'emektar gurme',
      area: '2721. Cd., Ortakent',
      signals: ['tas_firin_pide_lahmacun', 'kelle_paca_iskembe_corba', 'bol_ikramli_servis'],
      verifiedAt: '2026-11-16',
      desc: "Ortakent 2721. Cadde'de (Yalıkavak ile birlikte Bodrum'da iki noktada hizmet veren) Başaran Gıda bünyesinde taş fırın pideler, çıtır lahmacun, Adana dürüm, kelle paça-işkembe çorbaları ve bol garnitürlü esnaf servisi sunan kebap ve pide salonu.",
      order: ['Taş Fırın Pide & Lahmacun', 'Adana Dürüm', 'Kelle Paça & Mercimek Çorbası'],
      menu: [
        'Taş Fırın Pide Çeşitleri',
        'Lahmacun',
        'Adana Dürüm & Kebaplar',
        'Kelle Paça, İşkembe & Mercimek Çorbası',
        'Et Döner',
        'Salata, Bulgur & Sıcak Pide İkramları',
      ],
      sec: [
        [
          'İşkembe & Ezogelin Çorbası',
          'Kebap ve lahmacun öncesi sıcak başlangıç ya da geç akşam öğünü olarak tercih edilir.',
          'ortakentrestaurant.com ve menucum.com menü listesi',
        ],
        [
          'Bulgur, Salata & Pide Garnitür İkramları',
          'Ana yemek ve paket siparişlerin yanında eksiksiz gönderilen doyurucu eşlikçilerdir.',
          'Yemeksepeti müşteri geri bildirimleri',
        ],
      ],
      seat: '2721. Cadde üzerinde geniş cadde salonu ve yoğun paket servis operasyonu',
      crowd: 'Öğle ve akşam saatlerinde Ortakent çalışanları, aileler ve online yemek siparişleriyle hareketli',
      dis: 'Turistik sahil manzarası yerine şehir içi esnaf restoranı düzenindedir; yoğun sipariş saatlerinde kurye teslimatında gecikme yaşanabiliyor',
      transit: 'Müskebi (Ortakent) 2721. Cadde No:8/B üzerinde Ortakent merkez aksında',
      sources: [
        [
          'Emektar Gurme Resmi Sitesi (ortakentrestaurant.com)',
          'https://ortakentrestaurant.com/',
          'operator',
          'Ortakent ve Yalıkavak iki şubeli yapı, taş fırın pide, lahmacun, çorba çeşitleri ve tedarik ilkeleri',
        ],
        [
          'Yemeksepeti — Emektar Gurme Ortakent',
          'https://www.yemeksepeti.com/',
          'community',
          'Adana dürüm, lahmacun, bol garnitür ikramı ve sipariş notu özeni hakkında 500+ değerlendirme',
        ],
        [
          'Yandex Harita — Emektar Gurme 2721. Cd.',
          'https://yandex.com.tr/harita',
          'community',
          'Müskebi 2721. Cd. konum, çorba ve kebap çeşitliliği geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=4139728250502198257',
          'maps',
          'Müskebi 2721 Cd. No:8B konum ve restaurant doğrulaması',
        ],
      ],
      pros: [
        'Taş fırın pide, lahmacun, kebap ve sıcak çorbayı aynı çatıda istikrarlı porsiyonlarla sunması',
        'Salata, bulgur ve sıcak pide garnitürlerinin hem salonda hem paket serviste bol tutulması',
      ],
      cons: [
        'Ticari çarşı cadde noktasında olduğundan manzaralı tatil ambiyansı sunmaz',
        'Yemek saatleri piklerinde paket servis kurye süresi uzayabiliyor',
      ],
      unc: ['Sezon dışında geç gece çorba servisinin kapanış saati değişebiliyor'],
    }),

    // ==================== 7. BALIKÇILAR & DENİZ ÜRÜNLERİ ====================
    compactSeed({
      id: 'balikcinin-yeri-kargi-yahsi',
      placeId: 'ChIJFSTXyjINvhQRnzTLEavKbbs',
      cat: 'balik',
      name: 'Balıkçının Yeri Balık Restaurant',
      brand: 'balikcinin yeri',
      area: 'Kargı Koyu, Yahşi',
      signals: ['kargi_koyu_aile_balikcisi', 'ahtapotlu_pilav', 'yarim_porsiyon_meze'],
      verifiedAt: '2026-11-16',
      desc: "Yahşi'nin güney ucundaki Kargı Koyu yakınında hizmet veren, lüks marina gösterişinden uzak samimi aile işletmesi balıkçı. Günlük av tezgah balıkları, lakerda ve ahtapotlu pilavının yanında mezelerin yarım porsiyon istenebilmesiyle öne çıkar.",
      order: ['Günlük Av Tezgah Balığı', 'Ahtapotlu Pilav', 'Lakerda & Kalamar'],
      menu: [
        'Günlük Av Mevsim Balıkları',
        'Ahtapotlu Pilav',
        'Lakerda',
        'Kalamar & Karides Çeşitleri',
        'Ev Yapımı Deniz Mahsullü Mezeler (Tam / Yarım Porsiyon)',
      ],
      sec: [
        [
          'Yarım Porsiyon Ev Yapımı Meze Seçkisi',
          'İki kişilik masalarda fazla meze çeşidi deneyebilmek için mezelerin yarım porsiyon söylenebilmesi öne çıkan avantajdır.',
          'Restaurant Guru misafir geri bildirimleri',
        ],
        [
          'Karides & Kalamar Ara Sıcakları',
          'Ana balık öncesi sıcak paylaşımlık olarak tercih edilir.',
          'Yandex Harita ve Yerels kayıtları',
        ],
      ],
      seat: 'Kargı Koyu yolunda mütevazı, temiz ve sakin aile meyhanesi masaları',
      crowd: 'Gösterişsiz ve taze balık sofrası arayan yerel müdavimler, çiftler ve sakin aile grupları',
      dis: 'Lüks marinalardaki şık dekorasyon veya denize sıfır kumsal masası konseptinde değildir; Kargı Koyu güney hattında kaldığından toplu taşıma dışında özel araçla ulaşım daha rahattır ve gramajlı balıkla hesap orta-üst segmente çıkabilir',
      transit: 'Yahşi Mahallesi güney ucunda Kargı Koyu (Camel Beach) hattında araç ulaşımına uygun',
      sources: [
        [
          'Restaurant Guru — Balıkçının Yeri Balık Restaurant',
          'https://restaurantguru.com/',
          'community',
          'Ahtapotlu pilav, lakerda, sakin sahil müziği ve mezelerin yarım porsiyon sipariş edilebilmesi detayı',
        ],
        [
          'Yerels & Restoranim.net — Balıkçının Yeri Yahşi',
          'https://www.yerels.com/',
          'editorial',
          'Kargı Koyu yakınında günlük av balık tezgahı ve samimi aile işletmesi değerlendirmesi',
        ],
        [
          'Yandex Harita — Balıkçının Yeri Balık Restaurant',
          'https://yandex.com.tr/harita',
          'community',
          'Mekan temizliği, ev sahibi yaklaşımı ve taze deniz ürünleri notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=13505673693640733855',
          'maps',
          'Yahşi Kargı Koyu konum ve seafood_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Yarım porsiyon meze sipariş kolaylığı sayesinde az kişiyle çok çeşit tadılabilmesi',
        'Ahtapotlu pilav ve günlük av balıklarını samimi aile işletmesi sıcaklığında sunması',
      ],
      cons: [
        'Kargı Koyu ucunda bulunduğundan merkezden yürüyüş mesafesinde değildir',
        'Sade mütevazı dekorasyonu lüks akşam beklentisindeki misafirleri tatmin etmeyebilir',
      ],
      unc: ['Günlük av tezgahı çeşitliliği hava şartlarına ve tekne tedarikine göre değişir'],
    }),
    compactSeed({
      id: 'gunes-balikcilik-ortakent',
      placeId: 'ChIJWQxidMVzvhQRFGs7iARxYtw',
      cat: 'balik',
      secondaryCategoryIds: ['date'],
      brand: 'gunes balikcilik',
      area: 'Müskebi Cd., Ortakent',
      signals: ['mandalina_bahcesi_balik', 'granyoz_kaya_levregi', 'dengeli_fiyat_performans'],
      verifiedAt: '2026-11-16',
      desc: "Müskebi Caddesi üzerinde mandalina ağaçları altındaki sakin bahçesinde turistik sahil gürültüsünden uzaklaşarak günlük granyoz (kaya levreği), taze deniz börülcesi, kalamar tava ve karides sunan yerel aile balıkçısı.",
      order: ['Granyoz (Kaya Levreği) & Günlük Balık', 'Kalamar Tava & Karides', 'Deniz Börülcesi'],
      menu: [
        'Granyoz (Kaya Levreği)',
        'Günlük Mevsim Balıkları',
        'Deniz Börülcesi & Ege Otları',
        'Kalamar Tava',
        'Karides',
        'Yemek Sonu Çıtır Tatlı',
      ],
      sec: [
        [
          'Ege Otları & Çıtır Tatlı Kapanışı',
          'Soğuk Ege otları başlangıcı ve balık sonrasında ikram veya sipariş edilen hafif çıtır tatlı öne çıkar.',
          'Restoranim.net ve Yandex Harita değerlendirmeleri',
        ],
      ],
      seat: 'Mandalina ağaçları altında ferah ve temiz açık bahçe masaları',
      crowd: 'Kıyıdaki yüksek sesli mekanlar yerine huzurlu rakı-balık sohbeti arayan aileler ve çiftler',
      dis: 'Sahil şeridinde değil Ortakent iç kesimde Müskebi Caddesi üzerinde kaldığından deniz manzarası sunmaz; online dijital menüsü olmadığından günlük balık çeşitleri ve fiyatları yerinde veya telefonla teyit edilir',
      transit: 'Müskebi (Ortakent) Müskebi Caddesi No:18 üzerinde Ortakent Köy İçi güney çıkışında',
      sources: [
        [
          'Restoranim.net — Güneş Balıkçılık Restaurant',
          'https://www.restoranim.net/',
          'editorial',
          'Granyoz balığı, kalamar tava, karides, hijyen özeni, çıtır tatlı ve dengeli fiyat-performans incelemesi',
        ],
        [
          'Yandex Harita — Güneş Balıkçılık Restaurant',
          'https://yandex.com.tr/harita',
          'community',
          'Müskebi Cd. No:18 konumu, mandalina ağaçları altı bahçe, deniz börülcesi ve güleryüzlü servis notları',
        ],
        [
          'Güneş Balıkçılık Resmi Instagram',
          'https://www.instagram.com/gunesbalikcilikrestaurant/',
          'operator',
          'Ortakent günlük balık tezgahı ve bahçe paylaşımları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=15880379500341193492',
          'maps',
          'Müskebi No:18 konum ve restoran doğrulaması',
        ],
      ],
      pros: [
        'Sahil bandındaki turistik balıkçılara göre daha dengeli hesapla taze granyoz ve Ege mezeleri sunması',
        'Mandalina bahçesi içinde sessiz, temiz ve samimi aile işletmesi atmosferi',
      ],
      cons: [
        'İç kesimde yer aldığından deniz kıyısı manzarası yoktur',
        'Sabit dijital menüsü sınırlı olup günlük tezgah balığına göre seçim yapılır',
      ],
      unc: ['Sezon dışında haftalık açık günleri ve günlük dip balığı stoğu tedarike göre değişebiliyor'],
    }),
    compactSeed({
      id: 'musto-balik-yahsi',
      placeId: 'ChIJNzhKh2pzvhQRtfhEn1jN3wA',
      cat: 'balik',
      brand: 'musto balik',
      area: 'Yalı Cd., Yahşi',
      signals: ['yahsi_yalisi_denize_sifir', 'gun_batimi_plaj_balik', 'akdeniz_meze_baliklari'],
      verifiedAt: '2026-11-16',
      desc: "Bodrum merkez Neyzen Tevfik'teki Musto Bistro ile aynı gruptan doğan, Yahşi Yalı Caddesi üzerindeki MyElla Boutique Hotel kıyısında denize sıfır konumuyla gün batımında taze deniz ürünleri, Ege mezeleri ve beach-restoran servisi sunan sahil balıkçısı.",
      order: ['Günlük Izgara Balık Çeşitleri', 'Taze Ege Mezeleri', 'Deniz Mahsullü Ara Sıcaklar'],
      menu: [
        'Günlük Izgara Balık Çeşitleri',
        'Soğuk Ege & Akdeniz Mezeleri',
        'Deniz Mahsullü Ara Sıcaklar',
        'Gün Batımı Bar Kokteylleri',
        'Sahil Öğle Atıştırmalıkları',
      ],
      sec: [
        [
          'Gün Batımı Bar Kokteylleri & Sahil Öğle Servisi',
          'Akşam balık masaları öncesinde denize sıfır plaj ve bar bölümünde gün batımı içecekleri tercih edilir.',
          'myellaboutique.com resmi tesis bilgileri',
        ],
      ],
      seat: 'Yahşi Yalı Caddesi kıyısında denize sıfır plaj/teras masaları ve gün batımı bar bölümü',
      crowd: 'Gün batımında sahil kenarında balık ve içecek keyfi arayan otel misafirleri ve tatilciler',
      dis: 'Yüksek bütçe segmentinde yer alır; yoğun yaz sezonunda yüksek hesaplar karşısında bazı ara sıcaklarda porsiyon oranı ve kalabalık anlarda servis ilgisiyle ilgili şikayet geri bildirimleri bulunmuştur',
      transit: 'Yahşi Yalı Caddesi No:36/A (Asma Sk. No:19 kıyısı) üzerinde MyElla Boutique Hotel sahilinde',
      sources: [
        [
          'MyElla Boutique Hotel — Musto Balık Resmi Sayfası',
          'https://www.myellaboutique.com/',
          'operator',
          'Yahşi kıyısında denize sıfır balık, Akdeniz mutfağı ve gün batımı bar doğrulaması',
        ],
        [
          'Etstur & Restoranim.net — Musto Balık Yahşi',
          'https://www.restoranim.net/',
          'editorial',
          'Yalı Caddesi sahil konumu, taze deniz ürünleri ve meze konsepti kayıtları',
        ],
        [
          'Yandex Harita & Şikayetvar — Musto Balık Değerlendirmeleri',
          'https://yandex.com.tr/harita',
          'community',
          'Yahşi manzara övgülerinin yanında yüksek hesap ve ara sıcak porsiyon eleştirileri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=62994700319389877',
          'maps',
          'Müskebi Yalı Cd. 36/A konum ve seafood_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Yahşi Yalı Caddesi sahilinde doğrudan denize sıfır gün batımı manzarası ve plaj erişimi sunması',
        'Hem gündüz sahil servisi hem akşam taze deniz ürünü sofraları için elverişli konum',
      ],
      cons: [
        'Üst bütçe segmentindedir; gramaj ve ara sıcak fiyatları sipariş öncesi netleştirilmelidir',
        'Yoğun yaz sezonunda kalabalık saatlerde karşılama ve servis tutarlılığı eleştiri alabiliyor',
      ],
      unc: ['Sezon dışında otel ve beach bölümü çalışma takvimine paralel olarak kapalı olabiliyor'],
    }),

    // ==================== NEGATIVE CONTROLS (POLİTİKA KAPISI DENETİMİ) ====================
    // Kapı 3 — Yeme-İçme Türü Dışı (AVM, Otel, Turistik Nokta)
    negControl(
      'ctrl-oy-midtown-avm',
      'ChIJhZ84wApyvhQRHWSXTzksJtQ',
      'denemelisin',
      'Kapı 3 ihlali: Midtown Alışveriş Merkezi birincil türü shopping_mall (FOOD_PLACE_TYPES dışında)'
    ),
    negControl(
      'ctrl-oy-kefi-beach-hotel',
      'ChIJN39o0JVyvhQRrcJWBvaq1QY',
      'date',
      'Kapı 3 & Kapı 6 ihlali: Kefi Beach Bodrum birincil türü hotel (FOOD_PLACE_TYPES dışında) ve ★4.3 puanı'
    ),
    negControl(
      'ctrl-oy-marin-beach-otel',
      'ChIJt6uGRItzvhQRI7-SbDkGDkY',
      'date',
      'Kapı 3 ihlali: Marin Beach & Otel birincil türü hotel (FOOD_PLACE_TYPES dışında)'
    ),
    negControl(
      'ctrl-oy-yahsi-yalisi',
      'ChIJObM6KcdyvhQRRx_bzd_T6wQ',
      'denemelisin',
      'Kapı 3 ihlali: Yahşi Yalısı birincil türü tourist_attraction (FOOD_PLACE_TYPES dışında)'
    ),

    // Kapı 2 — Zincir & Franchise Kontrolleri
    negControl(
      'ctrl-oy-big-chefs',
      'ChIJsQWi249zvhQRQAJPFYXuDz0',
      'date',
      'Kapı 2 ihlali: Big Chefs - Bodrum Yahşi Şubesi ulusal brasserie zinciri (CHAIN_BLOCKLIST: big chefs)'
    ),
    negControl(
      'ctrl-oy-starbucks',
      'ChIJ36YbRKdzvhQRczrJKzn7PnQ',
      'kahve',
      'Kapı 2 & Kapı 6 ihlali: Starbucks küresel kahve zinciri (CHAIN_BLOCKLIST: starbucks), ★3.0 puanı ve 26 değerlendirme'
    ),
    negControl(
      'ctrl-oy-caffe-nero',
      'ChIJEXr4-FNzvhQRCkUUAM8Spew',
      'kahve',
      'Kapı 2 & Kapı 6 ihlali: Caffè Nero Midtown AVM şubesi uluslararası kahve zinciri (CHAIN_BLOCKLIST: nero) ve ★4.0 puanı'
    ),
    negControl(
      'ctrl-oy-kahve-dunyasi',
      'ChIJ8ZjCK8JzvhQROL0JM_YeQVI',
      'kahve',
      'Kapı 2 & Kapı 6 ihlali: Kahve Dünyası Algötür-Bodrum Midtown zinciri (CHAIN_BLOCKLIST: kahve dünyası) ve ★2.8 puanı'
    ),
    negControl(
      'ctrl-oy-costa-coffee',
      'ChIJl0zzIFNzvhQROXV8CrGM9Xk',
      'kahve',
      'Kapı 2 & Kapı 6 ihlali: COSTA COFFEE küresel kahve zinciri (CHAIN_BLOCKLIST adayı: costa coffee), ★4.3 puanı ve 15 değerlendirme'
    ),
    negControl(
      'ctrl-oy-bursa-kebap-evi',
      'ChIJq7r9BAtyvhQRlxH1sKqFtqQ',
      'denemelisin',
      'Kapı 2 & Kapı 6 ihlali: Bursa Kebap Evi çok şubeli AVM kebap zinciri (CHAIN_BLOCKLIST adayı: bursa kebap evi) ve ★3.0 puanı'
    ),
    negControl(
      'ctrl-oy-chinese-inn',
      'ChIJY0oXwApyvhQR1VHPcp-IP5I',
      'denemelisin',
      'Kapı 2 & Kapı 6 ihlali: Chinese Inn Restaurant Midtown çok şubeli AVM Asya restoranı zinciri (CHAIN_BLOCKLIST adayı: chinese inn) ve ★4.2 puanı'
    ),

    // Kapı 6 — Kalite Eşiği (<4.4) ve Yetersiz Değerlendirme (<35) Kontrolleri
    negControl(
      'ctrl-oy-suzgec',
      'ChIJJSq4JgBzvhQRIcDUH6BvrA8',
      'pizza',
      'Kapı 6 ihlali: Süzgeç ★4.2 (214) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-oy-tuzz',
      'ChIJo7hT4JVyvhQRkYOeaz9_qQY',
      'date',
      'Kapı 6 ihlali: TUZZ RESTAURANT ★4.3 (75) puanı 4.4 tabanının altında ve Karaköy merkezli dönem geçişi'
    ),
    negControl(
      'ctrl-oy-sirin-bahce',
      'ChIJk-PgZAxzvhQRvXkQ9qx0bsQ',
      'kahvalti',
      'Kapı 6 ihlali: Şirin Bahçe Bodrum ★4.3 (249) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-oy-kosem-balik',
      'ChIJ-egUUrNtvhQReGKlcmzsI2E',
      'balik',
      'Kapı 6 ihlali: Köşem Balık Restaurant ★4.1 (762) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-oy-la-bohemme',
      'ChIJU0jt9zZzvhQR86vlNmofVqw',
      'date',
      'Kapı 6 ihlali: La Bohemme Beach & Restaurant ★4.0 (422) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-oy-ortakent-lokantasi',
      'ChIJQXSNt2BtvhQRLZS505xCwsQ',
      'denemelisin',
      'Kapı 6 ihlali: Ortakent Lokantası Ev Yemekleri ★4.2 (44) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-oy-hortma-beach',
      'ChIJowh3YOpzvhQRPaj_-KAgNsI',
      'denemelisin',
      'Kapı 6 ihlali: Hortma Beach&Restaurant ★4.2 (414) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-oy-yuzgec',
      'ChIJT_kOuBdzvhQRN8bYTeoaNPs',
      'date',
      'Kapı 6 ihlali: Yüzgeç ★4.1 (551) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-oy-ayana-balik',
      'ChIJq3Z9ZJlyvhQRBZvgyDovr4w',
      'balik',
      'Kapı 6 ihlali: Ayana Balık Restaurant ★3.9 (669) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-oy-yahsi-bati-rest',
      'ChIJDd8TUeZzvhQRfDfF2Pwq9x4',
      'hamburger',
      'Kapı 6 ihlali: YAHŞİ BATI RESTAURANT yalnızca 1 değerlendirme ile 35 alt sınırının altında'
    ),

    // Kapı 8 — Şişirilmiş Puan / Bağımsız Menü Kanıtı Yetersizliği Kontrolü
    negControl(
      'ctrl-oy-mernas-bahce',
      'ChIJB1yGEAtzvhQRUCWmRgFUEVw',
      'date',
      'Kapı 8 ihlali: Mernas Bahçe ★4.8 (92) için web araştırmasında doğrulanabilir özgün menü ve ürün kanıtı bulunamadı'
    ),

    // Kapı 4 — Sıkı Mahalle & Bbox Sınırı Dışı Kontrolleri (Konacık, İslamhaneleri, Dağbelen, Bitez)
    negControl(
      'ctrl-oy-crudo-konacik-outside',
      'ChIJ5ZlcTN1pvhQRhqCiBmvKwjM',
      'pizza',
      'Kapı 4 ihlali: Crudo Bodrum Konacık Mahallesi ve Ortakent maxLng (27.3650) sınırının doğusunda'
    ),
    negControl(
      'ctrl-oy-geremeli-islamhaneleri-outside',
      'ChIJbUzjNgVzvhQRzsoEHtp4yFk',
      'kahvalti',
      'Kapı 4 ihlali: Geremeli Cafe & Restaurant Köy Kahvaltısı İslamhaneleri Mahallesi ve Ortakent minLng (27.3180) sınırının batısında'
    ),
    negControl(
      'ctrl-oy-irme-dagbelen-outside',
      'ChIJsdpYlMBzvhQR5A5CuGaXI7M',
      'kahvalti',
      'Kapı 4 ihlali: İrme Köy Kahvaltı Evi Dağbelen Mahallesi ve Ortakent maxLat (37.0655) sınırının kuzeyinde'
    ),
    negControl(
      'ctrl-oy-mid-burger-bitez-outside',
      'ChIJa6YkZwxtvhQRirSpPdn35tw',
      'hamburger',
      'Kapı 4 ihlali: Mid Burger Bitez Bitez Mahallesi ve Ortakent maxLng (27.3650) sınırının doğusunda'
    ),
  ],
};
