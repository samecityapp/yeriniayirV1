import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ANKARA_CANKAYA_BAHCELIEVLER_DEF: V3RegionDefinition = {
  id: 'ankara-cankaya-bahcelievler',
  slug: 'bahcelievler-7-cadde',
  city: 'Ankara',
  district: 'Çankaya',
  allowedDistricts: ['Çankaya', 'Bahçelievler'],
  neighborhood: 'Bahçelievler & 7. Cadde',
  officialQuarter:
    'Bahçelievler & Yukarı Bahçelievler Mahalleleri (Aşkabat Caddesi / 7. Cadde, Prof. Muammer Aksoy / 3. Cadde, Taşkent / 1. Cadde, Oğuzhan Asiltürk & Azerbaycan Caddesi Aksları)',
  displayName: 'Bahçelievler & 7. Cadde, Çankaya, Ankara',
  locative: "Bahçelievler ve 7. Cadde'de",
  path: ['ankara', 'cankaya', 'bahcelievler-7-cadde'],
  aliases: [
    'Bahçelievler & 7. Cadde',
    'Bahçelievler 7. Cadde',
    'Bahçelievler Ankara',
    'Bahçelievler Çankaya',
    '7. Cadde',
    '7. Cadde Ankara',
    'Yedinci Cadde',
    'Aşkabat Caddesi',
    'Askabat Caddesi',
    'Yukarı Bahçelievler',
    'Bahçeli 7',
    'Taşkent Caddesi Bahçelievler',
    'Muammer Aksoy Caddesi',
  ],
  scopeNote:
    'Bahçelievler & Yukarı Bahçelievler (Mevlana Blv., Dögol Cd. & İnönü Blv. arası; Emek 8. Cadde, Beşevler ve Söğütözü hariç) · Doğrulanmış Seçki',
  characterSubtitle:
    'Aşkabat (7. Cadde), Taşkent, Azerbaycan (3. Cadde) ve Muammer Aksoy sokaklarına yayılan ekşi mayalı butik pizzacılar, tek şubeli burger durakları, ara sokak üçüncü dalga kahve kavurucuları, gözleme ve kruvasan kahvaltıcıları ile mantı, Uygur mutfağı ve gece kokoreç klasikleri.',
  center: { lat: 39.9250, lng: 32.8270 },
  bbox: { minLat: 39.9165, maxLat: 39.9340, minLng: 32.8208, maxLng: 32.8355 },
  allowedNeighborhoodTokens: [
    'Bahçelievler',
    'Bahcelievler',
    'Yukarı Bahçelievler',
    'Yukari Bahcelievler',
    'Aşkabat',
    'Askabat',
  ],
  categories: buildRegionCategories(),
  candidates: [
    // =========================================================================
    // 1. PİZZA (2 bağımsız tek şubeli pizzacı; zincirler hariç)
    // =========================================================================
    compactSeed({
      id: 'bah-figza-pizza',
      placeId: 'ChIJgTZzzjRP0xQR5ETSpEeqavE',
      cat: 'pizza',
      name: 'Figza Pizza',
      brand: 'figza',
      area: 'Kazakistan Cd., Bahçelievler & 7. Cadde',
      signals: ['napoli-tarzi-hamur', 'incir-fume-kaburga', 'butik-pizza'],
      desc:
        'Kazakistan Caddesi’nde uzun dinlendirilmiş Napoli tarzı hamur üzerine kurutulmuş incirli ve füme kaburgalı imza Figza Pizza, Dört Peynirli ve Sarımsaklı Etli seçenekler hazırlayan şef odaklı butik pizzacı.',
      order: ['Figza Pizza (İncirli & Füme Kaburga)', 'Dört Peynirli Pizza', 'Sarımsaklı Etli Pizza'],
      menu: ['Margherita', 'Figza Pizza', 'Pepperoni', 'Dört Peynirli Pizza', 'İsli Yoğurtlu Soğan Dolması'],
      sec: [
        [
          'İsli Yoğurtlu Soğan Dolması & Kuzukulağı Limonata',
          'Pizza servisinin yanında ara sıcak olarak isli yoğurtlu soğan dolması ile humus ve içecek olarak ev yapımı kuzukulağı limonata öne çıkıyor.',
          'İşletme menüsü ve yerel gastronomi değerlendirmeleri',
        ],
      ],
      seat: 'Küçük, samimi iç salon ve Kazakistan Caddesi önü masalar',
      crowd: 'Hamur ve özel eşleşme arayan akşamüstü ve akşam misafirleri',
      dis: 'Butik kapasite nedeniyle akşam pik saatlerinde yer bekleme ihtimali bulunur',
      transit: 'Bahçelievler Kazakistan Caddesi No:41/B; Milli Kütüphane ve Bahçelievler metro duraklarına yürüyüş mesafesi.',
      sources: [
        [
          'Menu-TR Figza Pizza',
          'https://menu-tr.com/',
          'editorial',
          'Hamur dokusu, Dört Peynirli ve Sarımsaklı Etli çeşitleri ile soğan dolması',
        ],
        [
          'Ankara.com & Yemeksepeti Menü',
          'https://www.ankara.com/',
          'community',
          'Şef mutfağı reçeteleri, kurutulmuş incir-kaburga uyumu ve güncel menü',
        ],
      ],
      pros: ['Şef imzalı özgün pizza reçeteleri', 'Yüksek puanlı ara sıcak ve içecek eşlikleri'],
      cons: ['Sınırlı masa kapasitesi'],
      unc: ['Hafta sonu akşamlarında doluluk hızlı yükselir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-pizzaci-sedat',
      placeId: 'ChIJk_d6Tz1P0xQR_tsu-FjIvjk',
      cat: 'pizza',
      name: 'Pizzacı Sedat',
      brand: 'sedat',
      area: '69. Sk., Bahçelievler & 7. Cadde',
      signals: ['ince-hamur', 'bol-malzeme', 'eski-ankara-duragi'],
      desc:
        'Yukarı Bahçelievler 69. Sokak’ta yıllardır ince çıtır hamurlu ve bol malzemeli Kavurmalı, Et Şöleni ve 4 Peynirli pizzalarıyla bilinen Ankara’nın köklü bağımsız pizzacısı.',
      order: ['Kavurmalı Pizza', 'Et Şöleni', '4 Peynirli Pizza'],
      menu: ['Kavurmalı Pizza', 'Et Şöleni', '4 Peynirli', 'Karnaval', 'Ton Balıklı'],
      sec: [
        [
          'Ton Balıklı & Karnaval Seçenekleri',
          'Klasik etli çeşitlerin yanında 4 Peynirli ve Ton Balıklı gibi ince tabanlı seçenekler de aynı mutfaktan çıkar.',
          'İşletme menü kayıtları ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Kompakt, sade salon düzeni; ağırlıkla hızlı servis ve mahalle içi müdavim oturumu',
      crowd: 'Bölge sakinleri, öğrenciler ve paket-gel-al siparişi veren müdavimler',
      dis: 'İç oturma alanı dardır; kalabalık gruplar için uygun değildir',
      transit: 'Yukarı Bahçelievler 69. Sokak (Şehit Mehmet Aras Sk.) No:57; Milli Kütüphane metrosuna birkaç dakika.',
      sources: [
        [
          'GazeteBilkent & Mekanlar',
          'https://gazetebilkent.com/',
          'editorial',
          'Eski Pizzacı Altan geleneği, ince hamur ve 4 peynirli değerlendirmeleri',
        ],
        [
          'Yemeksepeti & Yandex Haritalar',
          'https://www.yemeksepeti.com/',
          'community',
          'Kavurmalı pizza, Et Şöleni menüsü ve yüksek müdavim puanı',
        ],
      ],
      pros: ['Bahçelievler’in en köklü tek merkezli ince hamur pizzacılarından', 'Bol malzeme standardı'],
      cons: ['Oturma alanı kısıtlı'],
      unc: ['Yoğun akşam servisinde bekleme uzayabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 2. HAMBURGER (4 tek şubeli bağımsız burger durakları; zincirler hariç)
    // =========================================================================
    compactSeed({
      id: 'bah-last-bite-burger',
      placeId: 'ChIJZdgUMbdP0xQRvqT_iFvdhMQ',
      cat: 'hamburger',
      name: 'Last Bite Burger & Cajun',
      brand: 'last bite',
      area: 'Şht. Kubilay Çon Sk., Bahçelievler & 7. Cadde',
      signals: ['brioche-ekmek', 'dana-kaburga', 'cajun-tenders'],
      desc:
        'Yukarı Bahçelievler’in ara sokağında tereyağlı brioche ekmekler içinde özel meat soslu dana kaburga köfteleri, vişne reçelli-peynirli ve köz patlıcanlı imza burgerleri ile çıtır kajun tavukları sunan tek şubeli burger noktası.',
      order: ['Vişne Reçelli & Trüflü Cheese Burger', 'Köz Burger', 'Erciyes Pastırmalı Burger'],
      menu: ['Cheese Burger', 'Köz Burger', 'Erciyes Burger', 'Cajun Tavuk Tenders Sepeti'],
      sec: [
        [
          'Çıtır Cajun Tavuk Tenders Sepeti',
          'Burgerlere ek olarak özel baharatlı kajun tavuk tenders sepetleri ve çıtır patates kızartması çokça tercih ediliyor.',
          'lastbite.com.tr ve güncel menü kayıtları',
        ],
      ],
      seat: 'Temiz, samimi iç salon ve mahalle sokağı masaları',
      crowd: 'Özgün sos kombinasyonları arayan burger severler ve semt gençleri',
      dis: 'Ara sokak konumu nedeniyle ilk kez gelenler harita takibi yapmalı; hafta sonu akşamları dolabiliyor',
      transit: 'Yukarı Bahçelievler Şehit Kubilay Çon Sk. (83. Sk.) No:20/A; Milli Kütüphane metrosuna yürüme mesafesi.',
      sources: [
        [
          'Last Bite Resmi Sitesi',
          'https://lastbite.com.tr/',
          'operator',
          '%100 dana kaburga köfteler, brioche ekmek ve cajun tenders menüsü',
        ],
        [
          'Restoranim & Menu-TR',
          'https://menu-tr.com/',
          'editorial',
          'Vişne reçelli burger, Köz Burger ve çıtır patates değerlendirmeleri',
        ],
      ],
      pros: ['Tek şubeli yüksek puanlı butik burger üretimi', 'Klasiklerin yanında cesur reçel-köz reçeteleri'],
      cons: ['Ara sokakta kompakt oturum'],
      unc: ['Akşam saatlerinde taze parti hazırlığına bağlı kısa bekleme olabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-periperi-burger',
      placeId: 'ChIJq_Gl-8RP0xQRhuwP0LEURq0',
      cat: 'hamburger',
      name: 'PeriPeri Burger',
      brand: 'periperi',
      area: 'Taşkent Cd., Bahçelievler & 7. Cadde',
      signals: ['dry-age-kofte', 'smash-burger', 'ozel-sos'],
      desc:
        'Taşkent Caddesi üzerinde dry-age dinlendirilmiş etten ince kenarı karamelize smash burgerler ve kendine özgü soslarla porsiyon hazırlayan tek şubeli butik burgerci.',
      order: ['Dry-Age Smash Burger', 'PeriPeri Soslu Double Burger'],
      menu: ['Smash Burger', 'PeriPeri Burger', 'Truffle Mayo Burger', 'Çıtır Patates'],
      sec: [
        [
          'Özel Soslu Çıtır Patates & Sos Seçkisi',
          'Klasik smash burgerlerin yanına ev yapımı acılı ve sarımsaklı özel soslarla sunulan patatesler eşlik ediyor.',
          'Yerel gastronomi dizinleri ve işletme menüsü',
        ],
      ],
      seat: 'Hızlı-rahat tek şube içi oturum ve Taşkent Caddesi vitrini',
      crowd: 'Beşevler ve Taşkent hattındaki smash burger müdavimleri',
      dis: 'Küçük dükkân ölçeği nedeniyle öğle-akşam arası kalabalıklaşınca yer beklemek gerekebilir',
      transit: 'Bahçelievler Taşkent Caddesi No:55/A-B; Beşevler metro çıkışına birkaç dakika yürüyüş.',
      sources: [
        [
          'Menu-TR & Restoranim',
          'https://menu-tr.com/',
          'editorial',
          'Taşkent Caddesi 55B tek şube ve dry-age smash burger profili',
        ],
        [
          'Sonsöz & Yandex Haritalar',
          'https://www.sonsoz.com.tr/',
          'community',
          'Smash tekniği, sos çeşitliliği ve müdavim puanları',
        ],
      ],
      pros: ['Dry-age köfteli yüksek tutarlı smash burger', 'Merkezi Taşkent Caddesi konumu'],
      cons: ['Sınırlı iç mekan genişliği'],
      unc: ['Yoğun saatlerde sipariş hazırlığı 15–20 dakikaya çıkabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-corner-burger-vita',
      placeId: 'ChIJFybuIu5P0xQR3glN3S3x52U',
      cat: 'hamburger',
      name: 'Corner Burger Vita',
      brand: 'corner burger',
      area: 'Taşkent Cd., Bahçelievler & 7. Cadde',
      signals: ['butik-burger', 'tavuk-menu', 'tas-kent-klasigi'],
      desc:
        'Beşevler Metrosu yakınında Taşkent Caddesi’nde tek şubede dengeli burger köfteleri, çıtır tavuk burgerler ve doyurucu sokak menüleri çıkaran yüksek puanlı mahalle burgercisi.',
      order: ['Vita Klasik Burger', 'Çıtır Tavuk Burger'],
      menu: ['Klasik Dana Burger', 'Cheddarlı Burger', 'Çıtır Tavuk Burger', 'Dürüm Seçenekleri'],
      sec: [
        [
          'Çıtır Tavuk & Dürüm Çeşitleri',
          'Dana burgerlere alternatif olarak marineli çıtır tavuk menüleri ve pratik dürümler sunuluyor.',
          'Menu-TR ve yerel sipariş platformu menüleri',
        ],
      ],
      seat: 'Sıcak iç masa düzeni ve Beşevler yaya aksı kenarı',
      crowd: 'Üniversite öğrencileri ve mahalle akşam yemeği müdavimleri',
      dis: 'Akşam yemek saatlerinde öğrenci sirkülasyonu sebebiyle ses seviyesi yükselebilir',
      transit: 'Bahçelievler Taşkent Caddesi No:14/C; Ankaray Beşevler durağına yakın.',
      sources: [
        [
          'Menu-TR Corner Burger Vita',
          'https://menu-tr.com/',
          'editorial',
          'Taşkent Caddesi No:14/C burger ve çıtır tavuk menü içeriği',
        ],
        [
          'Restoranim & Migros Yemek',
          'https://www.restoranim.net/',
          'community',
          'Tek şube konumu ve yüksek fiyat-porsiyon dengesi',
        ],
      ],
      pros: ['Dengeli köfte pişirme ve hızlı servis', 'Beşevler metrosuna çok yakın'],
      cons: ['Pik saatlerde kalabalık ve hareketli'],
      unc: ['Hafta sonu bazı özel soslar erken tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-turgay-abi-burger',
      placeId: 'ChIJqQauAlVP0xQRGrlT-_m6eZs',
      cat: 'hamburger',
      name: 'Turgay Abi - Burger / Ekmek Arası',
      brand: 'turgay abi',
      area: 'Azerbaycan Cd., Bahçelievler & 7. Cadde',
      signals: ['ev-yapimi-kofte', 'karamelize-sogan', 'ekmek-arasi'],
      desc:
        'Azerbaycan Caddesi’nde karamelize soğanlı ev yapımı dana köfteli burgerler ve sıcak ızgara ekmek arası çeşitleriyle müdavim kitlesi yakalamış esnaf ruhlu tek şube burger noktası.',
      order: ['Turgay Abi Ev Yapımı Dana Burger', 'Sıcak Ekmek Arası Özel Soslu Sandviç'],
      menu: ['Dana Burger', 'Ekmek Arası Köfte', 'Cheddarlı Özel Soslu Burger', 'Patates Kızartması'],
      sec: [
        [
          'Izgara Ekmek Arası Çeşitleri',
          'Burgerlerin yanında taze ekmek arasında özel soslu sıcak ızgara seçenekleri eşit popülerlikte hazırlanıyor.',
          'Yerel yemek menüleri ve esnaf dizinleri',
        ],
      ],
      seat: 'Mütevazı, sıcak büfe-salon oturumu ve cadde önü',
      crowd: '3. Cadde esnafı, öğrenciler ve esnaf usulü doyurucu burger arayanlar',
      dis: 'Geleneksel küçük dükkan düzenindedir; uzun süreli kafe oturumu yerine lezzet odaklı hızlı yemek içindir',
      transit: 'Bahçelievler Azerbaycan Caddesi (3. Cadde) No:104/A.',
      sources: [
        [
          'Restoranim & Com.com.tr',
          'https://www.restoranim.net/',
          'editorial',
          'Azerbaycan Cd. ev yapımı dana burger ve ekmek arası değerlendirmeleri',
        ],
        [
          'Yemeksepeti & RestaurantGuru',
          'https://www.yemeksepeti.com/',
          'community',
          'Karamelize soğanlı dana köfte menü ve yüksek kullanıcı memnuniyeti',
        ],
      ],
      pros: ['Katkısız ev yapımı köfte ve sıcak esnaf servisi', 'Yüksek lezzet istikrarı'],
      cons: ['Sınırlı oturma alanı'],
      unc: ['Akşam yoğunluğunda ekmek arası grupları sıra oluşturabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 3. KAHVE (%100 saf üçüncü dalga kahve & roastery; pastane/çikolatacı hariç)
    // =========================================================================
    compactSeed({
      id: 'bah-speco-coffee',
      placeId: 'ChIJ25njQZ5P0xQRAR-a8TNrm7o',
      cat: 'kahve',
      name: 'Speco Coffee',
      brand: 'speco',
      area: '67. Sk., Bahçelievler & 7. Cadde',
      signals: ['kendi-kavrumu', 'sakin-ara-sokak', 'nitelikli-espresso'],
      desc:
        'Yukarı Bahçelievler 67. Sokak’ta kendi kavurduğu taze çekirdeklerle demlenen filtre kahveleri, dengeli espresso bazlı içecekleri ve ev yapımı tatlılarıyla öne çıkan sakin üçüncü dalga kahve kavurucusu.',
      order: ['Single Origin V60', 'Cortado', 'Günlük Ev Yapımı Tatlı'],
      menu: ['V60 Pour Over', 'Cortado', 'Flat White', 'Cold Brew', 'Ev Yapımı Cheesecake'],
      sec: [
        [
          'Ev Yapımı Günlük Tatlı Eşlikçileri',
          'Kahve barının yanında her gün küçük porsiyonlarda taze çıkarılan tatlı dilimleri servis ediliyor.',
          'Yerel çalışma kafe rehberleri ve menü kayıtları',
        ],
      ],
      seat: 'Sessiz iç salon, çalışmaya elverişli masalar ve huzurlu 67. Sokak önü',
      crowd: 'Sakin sokakta iyi çekirdek ve odaklı kahve molası arayanlar',
      dis: 'Ana cadde gürültüsünden uzak olsa da kompakt oturma düzeni hafta sonu erken dolabiliyor',
      transit: 'Yukarı Bahçelievler 67. Sokak No:7/B; Aşkabat Caddesi orta kesiminin hemen yan sokağı.',
      sources: [
        [
          'Koffie.work Ankara Seçkisi',
          'https://koffie.work/',
          'editorial',
          'Bahçelievler sakin çalışma dostu nitelikli kahve listesi',
        ],
        [
          'Menu-TR & Yandex Haritalar',
          'https://menu-tr.com/',
          'community',
          'Kendi kavrumu çekirdek kalitesi ve ev yapımı tatlı doğrulaması',
        ],
      ],
      pros: ['Taze kavrum çekirdek odaklanması', '7. Cadde kalabalığından yalıtılmış sakin sokak'],
      cons: ['Sınırlı masa adedi'],
      unc: ['Hafta sonu öğleden sonra çalışma masaları dolabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-rispetto-coffee',
      placeId: 'ChIJp-epnyRP0xQR_UBqWzLBIlo',
      cat: 'kahve',
      name: 'Rispetto Coffee Co.',
      brand: 'rispetto',
      area: '59. Sk., Bahçelievler & 7. Cadde',
      signals: ['nc-kahve-oncusu', 'v60-demleme', 'el-yapimi-brownie'],
      desc:
        'Ankara’da üçüncü dalga kahve akımının öncülerinden biri olarak 59. Sokak’ta hizmet veren; gıda mühendisi kurucusunun titizliğiyle demlediği V60, kadifemsi cortado ve el yapımı brownie ikilisiyle tanınan tek şube kahve evi.',
      order: ['V60 Filtre Demleme', 'Cortado', 'El Yapımı Brownie'],
      menu: ['V60 Pour Over', 'Cortado', 'Cappuccino', 'El Yapımı Brownie', 'Bal Kabaklı Cheesecake'],
      sec: [
        [
          'El Yapımı Brownie & Bal Kabaklı Cheesecake',
          'Nitelikli kahve sunumlarının yanında mevsimlik bal kabaklı cheesecake ve yoğun dokulu brownie müdavim ürünüdür.',
          'rispetto.com.tr ve kahve blogu incelemeleri',
        ],
      ],
      seat: 'Minimalist ahşap bar, sakin sokak önü masaları ve kitap-kahve köşeleri',
      crowd: 'Gerçek çekirdek profili ve dengeli süt köpüğü arayan kahve meraklıları',
      dis: 'Gürültülü kalabalıklar yerine sakin kahve sohbeti düzenindedir; geç saatlerde erken kapanabilir',
      transit: 'Yukarı Bahçelievler 59. Sokak No:15/C; 7. Cadde paralel ara sokağı.',
      sources: [
        [
          'Rispetto Resmi Sitesi',
          'https://rispetto.com.tr/',
          'operator',
          'Gıda mühendisi kurucu vizyonu, V60 demleme ve tatlı menüsü',
        ],
        [
          'Ankara.com & CoffeeRadar',
          'https://coffeeradar.io/',
          'editorial',
          'Ankara öncü specialty kahve noktası, cortado ve bal kabaklı cheesecake incelemesi',
        ],
      ],
      pros: ['Ankara nitelikli kahve sahnesinin en köklü bağımsız öncülerinden', 'Yıllardır değişmeyen bar istikrarı'],
      cons: ['Küçük sokak dükkânı'],
      unc: ['Mevsimlik cheesecake çeşitleri günlük tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-drupe-coffee',
      placeId: 'ChIJT5nEZtlP0xQRO7T-8i07L9Y',
      cat: 'kahve',
      name: 'Drupe Coffee & Stuff',
      brand: 'drupe',
      area: '37. Sk., Bahçelievler & 7. Cadde',
      signals: ['single-origin', 'manuel-demleme', 'sade-bar'],
      desc:
        '37. Sokak’ta karmaşadan uzak, yalnızca farklı ülkelerden seçilmiş tek kökenli çekirdeklere ve manuel demleme reçetelerine odaklanan sade ve uzman mahalle kahvecisi.',
      order: ['Single Origin Filtre / Demleme', 'Flat White'],
      menu: ['Single Origin V60', 'Aeropress', 'Flat White', 'Espresso Tonic', 'Kuru Pasta Seçkisi'],
      sec: [
        [
          'Single-Origin Çekirdek Satışı & Ekipman Danışması',
          'Farklı yöre çekirdeklerini evde demlemek isteyenler için öğütülmüş veya çekirdek paket seçkisi bulunur.',
          'drupecoffee.com resmi menüsü ve yerel notlar',
        ],
      ],
      seat: 'Huzurlu, az masalı minimalist iç mekan ve sokak cephesi',
      crowd: 'Baristayla çekirdek notası konuşmayı seven nitelikli kahve müdavimleri',
      dis: 'Mutfak-yemek menüsü sunmaz; sade kahve ve hafif eşlikçi odaklıdır',
      transit: 'Bahçelievler 37. Sokak (Şevket Süreyya Aydemir yakını) No:8.',
      sources: [
        [
          'Drupe Coffee Resmi Sitesi',
          'https://drupecoffee.com/',
          'operator',
          'Tek kökenli çekirdek yaklaşımı ve manuel demleme menüsü',
        ],
        [
          'Yandex Haritalar & Yerel Kahve Dizinleri',
          'https://www.ankarakahve.com/',
          'community',
          'Huzurlu atmosfer ve demleme sohbetleriyle yüksek memnuniyet',
        ],
      ],
      pros: ['Tamamen nitelikli çekirdek odaklı uzman bar', 'Bölgenin en sakin sokak noktalarından'],
      cons: ['Yemek alternatifi yoktur'],
      unc: ['Tek kökenli mikro lot çekirdekler dönemsel değişir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-roamers-coffee',
      placeId: 'ChIJLRcEY_lP0xQRQWGtjHDjX5Q',
      cat: 'kahve',
      name: 'Roamers Coffee & Roastery',
      brand: 'roamers',
      area: '46. Sk., Bahçelievler & 7. Cadde',
      signals: ['butik-roastery', 'imza-latte', 'limonlu-kek-brownie'],
      desc:
        'Yukarı Bahçelievler 46. Sokak’ta kendi kavrum çekirdeklerinin yanında Coco Star latte gibi özgün soğuk-sıcak spesiyaller, limonlu kek ve yoğun brownie sunan samimi mahalle roastery’si.',
      order: ['Filtre Kahve / Espresso', 'Coco Star Latte', 'Limonlu Kek'],
      menu: ['V60 Filtre', 'Coco Star Latte', 'Cortado', 'Limonlu Kek', 'Brownie'],
      sec: [
        [
          'Limonlu Kek & Brownie Barı',
          'Kavrulmuş kahvelerin yanında günlük pişen limonlu kek ve brownie tatlıları özellikle övülür.',
          'Menu-TR ve işletme menü kayıtları',
        ],
      ],
      seat: 'Sıcak iç mekan köşeleri ve sakin 46. Sokak kaldırım oturumu',
      crowd: 'Çalışan freelancer’lar ve sokak kafesi sıcaklığı arayan müdavimler',
      dis: 'Küçük butik alanda prizli masalar yoğun saatlerde erken dolabilir',
      transit: 'Yukarı Bahçelievler 46. Sokak No:53/A.',
      sources: [
        [
          'Roamers Coffee Instagram & Menü',
          'https://www.instagram.com/roamerscoffeecompany/',
          'operator',
          'Roastery seçkisi ve günlük tatlı duyuruları',
        ],
        [
          'Menu-TR Roamers Coffee',
          'https://menu-tr.com/',
          'editorial',
          'Coco Star latte, limonlu kek, brownie ve samimi atmosfer değerlendirmeleri',
        ],
      ],
      pros: ['Hem klasik roastery hem de imza tatlı-kahve dengesi', 'Sıcak servis'],
      cons: ['Küçük salon hacmi'],
      unc: ['Hafta sonu masa bulunabilirliği değişkendir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 4. DATE MEKANLARI (3 tek şube akşam / meze / balık & meyhane seçkisi)
    // =========================================================================
    compactSeed({
      id: 'bah-tranca-et-balik',
      placeId: 'ChIJh1oz9SNP0xQR60AtW3lQ7Ao',
      cat: 'date',
      name: "Tranç'a Et Balık",
      brand: 'tranç',
      area: '50. Sk., Bahçelievler & 7. Cadde',
      signals: ['acik-mutfak', 'balik-meze', 'sakin-aksam-sofrasi'],
      desc:
        '50. Sokak’ta açık mutfak anlayışıyla mevsimlik ızgara balık çeşitleri, kiremitte et tabakları, yaprak ciğer ve taze soğuk mezeler sunan nezih ve sakin akşam sofrası.',
      order: ['Izgara Levrek / Mevsim Balığı', 'Yaprak Ciğer', 'Günlük Soğuk Meze Seçkisi'],
      menu: ['Izgara Levrek', 'Kiremitte Et', 'Yaprak Ciğer', 'Deniz Mahsulleri Ara Sıcakları'],
      sec: [
        [
          'Kiremitte Et & Yaprak Ciğer',
          'Balık istemeyen eşlikçiler için açık mutfakta hazırlanan yaprak ciğer ve kiremitte et çeşitleri güçlü alternatif oluşturur.',
          'trancabalik.com ve Menu-TR menü kayıtları',
        ],
      ],
      seat: 'Nezih, sakin iç salon ve düzenli akşam masaları; fasıl gürültüsü yok',
      crowd: 'Sohbet odaklı akşam yemeği planlayan çiftler ve aileler',
      dis: 'Akşam masaları için önceden ayırtma önerilir; otopark sokak düzenindedir',
      transit: 'Bahçelievler 50. Sokak No:9/A.',
      sources: [
        [
          'Tranç’a Resmi Sitesi',
          'http://www.trancabalik.com/',
          'operator',
          'Açık mutfak et ve balık menüsü, günlük meze yaklaşımı',
        ],
        [
          'Menu-TR Tranç’a Et Balık',
          'https://menu-tr.com/',
          'editorial',
          'Izgara levrek, kiremitte et, yaprak ciğer ve nezih sakin ortam notları',
        ],
      ],
      pros: ['Bahçelievler’de canlı müzik gürültüsüz şık balık-et sofrası', 'Açık mutfak güveni'],
      cons: ['Sokak parkı akşam saatlerinde sınırlı olabilir'],
      unc: ['Hafta sonu taze balık stokları erken saatlerde tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-nazende-meyhane',
      placeId: 'ChIJJy1M1daq1BQR00xcjxt0i7k',
      cat: 'date',
      name: 'NAZENDE MEYHANE ÇANKAYA',
      brand: 'nazende',
      area: 'Aşkabat Cd. (7. Cadde), Bahçelievler & 7. Cadde',
      signals: ['2008-beri-ayni-yer', 'gunluk-meze', 'bahce-fasil'],
      desc:
        'Aşkabat Caddesi’nde 2008 yılından bu yana aynı noktada günlük değişen soğuk mezeler, ara sıcaklar, ızgaralar ve geniş bahçesiyle hizmet veren köklü Bahçelievler meyhanesi.',
      order: ['Günlük Meze Tepsisi', 'Kalamar / Ara Sıcaklar', 'Izgara Köfte / Çöp Şiş'],
      menu: ['Soğuk Meze Seçkisi', 'Paçanga & Ara Sıcaklar', 'Izgara Et & Tavuk Çeşitleri'],
      sec: [
        [
          'Ferah Bahçe Oturumu & Grup Sofraları',
          'Geniş salonunun yanı sıra mevsiminde açılan ferah bahçe bölümü uzun akşam sofraları için tercih ediliyor.',
          'nazendemeyhane.com ve bölge rehberleri',
        ],
      ],
      seat: 'Geniş iç salon ve 7. Cadde içinde ferah bahçe masaları',
      crowd: 'Kutlama ve canlı fasıllı uzun akşam yemeği planlayan çiftler ve gruplar',
      dis: 'Canlı fasıl programı nedeniyle sessiz baş başa yemek arayanlar için müzik seviyesi yüksek kalabilir',
      transit: 'Bahçelievler Aşkabat Caddesi No:46/7 (7 Kapı Meyhaneler Hattı).',
      sources: [
        [
          'Nazende Meyhane Resmi Sitesi',
          'http://www.nazendemeyhane.com/',
          'operator',
          '2008’den beri aynı konum, günlük meze ve bahçe kapasitesi bilgileri',
        ],
        [
          'Winniey & Ankara Restoran Rehberleri',
          'https://winniey.com/',
          'editorial',
          'Bahçelievler fasıl ve meyhane seçkisi içinde öne çıkan işletme',
        ],
      ],
      pros: ['2008’den beri süren aynı lokasyon istikrarı', 'Bahçe ve geniş meze çeşitliliği'],
      cons: ['Canlı fasıl sırasında ses düzeyi yükselir'],
      unc: ['Cuma-Cumartesi akşamları rezervasyonsuz yer bulmak güçleşir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-miss-meyhane',
      placeId: 'ChIJ_ZsuGSdP0xQRPiFWdnUNjH8',
      cat: 'date',
      name: 'Miss Meyhane',
      brand: 'miss meyhane',
      area: 'Aşkabat Cd. (7. Cadde), Bahçelievler & 7. Cadde',
      signals: ['fasil-eglencesi', 'zengin-meze', '7-cadde'],
      desc:
        'Aşkabat Caddesi’nde her akşam canlı fasıl programı eşliğinde geleneksel meyhane mezeleri, ara sıcaklar ve ana yemek fiks menüleri sunan hareketli Bahçelievler akşam durağı.',
      order: ['Geleneksel Meze Seçkisi', 'Ara Sıcak Tabağı', 'Izgara Ana Yemek'],
      menu: ['Soğuk Mezeler', 'Ara Sıcaklar', 'Izgara Çeşitleri', 'Fasıl Akşam Menüleri'],
      sec: [
        [
          'Haftanın Her Günü Canlı Fasıl Programı',
          'Eğlenceli akşam buluşmalarında fasıl müziği ve düzenli masa servisi ön plandadır.',
          'missmeyhane.com ve yerel meyhane rehberleri',
        ],
      ],
      seat: 'Canlı müzik düzeninde şık meyhane masaları ve salon yerleşimi',
      crowd: 'Fasıl ve müzikli akşam kutlaması arayan çiftler ve arkadaş grupları',
      dis: 'Müzikli ve canlı bir ortam sunar; sessiz akustik isteyenler için uygun değildir',
      transit: 'Yukarı Bahçelievler Aşkabat Caddesi No:46/3.',
      sources: [
        [
          'Miss Meyhane Resmi Sitesi',
          'https://missmeyhane.com/',
          'operator',
          'Aşkabat Cd. 46/3 konumu, meze ve her akşam canlı fasıl akışı',
        ],
        [
          'Ankara Restoran Rehberleri',
          'https://www.ankararestoranlari.com/',
          'editorial',
          'Bahçelievler canlı müzikli meyhane rehberi içinde yer alan durak',
        ],
      ],
      pros: ['Yüksek puanlı fasıl organizasyonu ve meze dengesi', '7. Cadde merkezi konumu'],
      cons: ['Canlı eğlence kaynaklı yüksek ambiyans sesi'],
      unc: ['Hafta sonları önceden masa teyidi gerekir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 5. KAHVALTI (4 tek şube: bahçeli serpme, gözleme, simit-menemen, kruvasan)
    // =========================================================================
    compactSeed({
      id: 'bah-zula-cafe',
      placeId: 'ChIJs5Z-LiBP0xQRtbN-xb4j7EI',
      cat: 'kahvalti',
      name: 'ZULA CAFE',
      brand: 'zula',
      area: 'Taşkent Cd., Bahçelievler & 7. Cadde',
      signals: ['agacli-bahce', 'soba-sicakligi', 'serpme-kahvalti'],
      desc:
        'Taşkent Caddesi üzerinde ağaçlıklı sakin bahçesi ve kışın iç mekândaki sıcak sobasıyla bilinen; zengin serpme kahvaltısı, sıcak hamur işleri ve samimi servisiyle öne çıkan tek şubeli Bahçelievler kahvaltı durağı.',
      order: ['Zengin Serpme Kahvaltı', 'Sıcak Börek / Pişi Tabağı', 'Demleme Çay & Menemen'],
      menu: ['Serpme Kahvaltı', 'Kahvaltı Tabağı', 'Menemen Çeşitleri', 'Sıcak Pişi & Börek'],
      sec: [
        [
          'Ağaçlıklı Yaz Bahçesi & Kışlık Sobası',
          'Mevsime göre bahçe gölgeliğinde veya içerdeki soba başında uzun hafta sonu kahvaltısı imkânı sunar.',
          'Menu-TR ve yerel kahvaltı dizinleri',
        ],
      ],
      seat: 'Ağaçlıklı ön-arka bahçe ve sobalı sıcak iç salon',
      crowd: 'Hafta sonu uzun serpme kahvaltı için gelen aileler ve semt müdavimleri',
      dis: 'Hafta sonu geç kahvaltı saatlerinde bahçe masaları hızlıca doluyor',
      transit: 'Yukarı Bahçelievler Taşkent Caddesi No:107/F-G; Milli Kütüphane metrosuna yürüyüş mesafesi.',
      sources: [
        [
          'Menu-TR Zula Cafe',
          'https://menu-tr.com/',
          'editorial',
          'Taşkent Caddesi bahçeli ve sobalı atmosfer ile serpme kahvaltı değerlendirmesi',
        ],
        [
          'Restoranim & Wanderlog',
          'https://www.restoranim.net/',
          'community',
          'Bahçelievler kahvaltı durakları içinde yüksek puanlı hizmet ve bahçe konsepti',
        ],
      ],
      pros: ['Bahçelievler merkezinde nadir bulunan ağaçlıklı kahvaltı bahçesi', 'Yüksek puanlı samimi servis'],
      cons: ['Hafta sonu geç saatlerde yer bekleme olabilir'],
      unc: ['Büyük gruplar için sabah erken gitmek avantajlıdır'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-agah-gozleme',
      placeId: 'ChIJY6qag6JP0xQRBBwTsJiWxuA',
      cat: 'kahvalti',
      name: 'Agah Cafe & Gözleme Unlu Mamüller Yöresel Ürünler',
      brand: 'agah',
      area: 'Taşkent Cd., Bahçelievler & 7. Cadde',
      signals: ['el-acmasi-gozleme', 'koy-tereyagli-omlet', 'yoresel-kahvalti'],
      desc:
        'Taşkent Caddesi’nde el açması taze gözlemeler, köy tereyağlı omletler, yöresel kahvaltılıklar ve katkısız unlu mamullerle sabah kahvaltısı sunan mahalle mutfağı.',
      order: ['El Açması Yöresel Gözleme', 'Köy Tereyağlı Omlet', 'Kahvaltı Tabağı'],
      menu: ['Peynirli & Kıymalı Gözleme', 'Köy Tereyağlı Omlet', 'Yöresel Peynir Tabağı', 'Börek'],
      sec: [
        [
          'Yöresel Ürünler & Köy Tereyağlı Kahvaltılıklar',
          'Gözleme çeşitlerinin yanında günlük çıkarılan yöresel hamur işleri ve sade kahvaltılık ürünler de sunuluyor.',
          'Menu-TR ve yerel yemek dizinleri',
        ],
      ],
      seat: 'Temiz, samimi küçük esnaf-kafe masa düzeni',
      crowd: 'Ev yapımı tadında sıcak gözleme ve köy tereyağlı kahvaltı arayanlar',
      dis: 'Siparişe göre el açması hazırlandığı için yoğun sabah saatlerinde servis biraz sürebilir',
      transit: 'Bahçelievler Taşkent Caddesi No:39/A.',
      sources: [
        [
          'Menu-TR Agah Cafe',
          'https://menu-tr.com/',
          'editorial',
          'El açması gözleme, köy tereyağlı omlet ve unlu mamuller profili',
        ],
        [
          'Restoranim & Yandex Haritalar',
          'https://www.restoranim.net/',
          'community',
          'Taşkent Caddesi üzerinde ★4.9 yüksek değerlendirme istikrarı',
        ],
      ],
      pros: ['Siparişe taze el açması gözleme', 'Çok yüksek müşteri memnuniyeti ve yöresel malzeme'],
      cons: ['Hazırlık süresi sipariş yoğunluğuna bağlı'],
      unc: ['Hafta sonu erken öğlede bazı börek çeşitleri tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-bidilim-cafe',
      placeId: 'ChIJlwpxrN9O0xQRV_AH6M5o5Dg',
      cat: 'kahvalti',
      name: "Bi'dilim Cafe",
      brand: "bi'dilim",
      area: 'Taşkent Cd., Bahçelievler & 7. Cadde',
      signals: ['taze-simit', 'menemen', 'mahalle-kahvaltisi'],
      desc:
        'Beşevler Metrosu yakınında Taşkent Caddesi üzerinde taze gevrek simitleri, iddialı menemeni ve hızlı mahalle kahvaltısı tabaklarıyla bilinen sıcak sabah durağı.',
      order: ['Özel Menemen', 'Sıcak Simit & Kahvaltı Tabağı'],
      menu: ['Menemen', 'Taze Simit', 'Kahvaltı Tabağı', 'Tost Çeşitleri'],
      sec: [
        [
          'Tost & Öğle Atıştırmalıkları',
          'Sabah simit-menemen servisinin ardından öğle saatlerinde tost ve atıştırmalık burger çeşitleri de hazırlanıyor.',
          'Menu-TR ve yerel kafe rehberleri',
        ],
      ],
      seat: 'Rahat, ulaşımı pratik iç ve vitrin kenarı oturumu',
      crowd: 'Beşevler civarında güne hızlı ve lezzetli kahvaltıyla başlayan öğrenciler ve çalışanlar',
      dis: 'Sabah ders-mesai başlangıcı öncesi simit-menemen kuyruğu oluşabilir',
      transit: 'Bahçelievler Taşkent Caddesi No:5/B (Ankaray Beşevler çıkışı yanı).',
      sources: [
        [
          'Menu-TR Bi’dilim Simit Cafe',
          'https://menu-tr.com/',
          'editorial',
          'Taşkent Caddesi No:5/B taze simit ve kahvaltı profili',
        ],
        [
          'Restoranim Bi’dilim',
          'https://www.restoranim.net/',
          'community',
          'İddialı menemen, taze simit ve pratik mahalle servisi yorumları',
        ],
      ],
      pros: ['Metro çıkışında hızlı ve taze Ankara simidi + menemen', 'Pratik sabah durağı'],
      cons: ['Sabah pikinde masa devri hızlıdır'],
      unc: ['Sıcak simit partileri belirli aralıklarla çıkar'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-cruffin-bakery',
      placeId: 'ChIJb6fiFpFP0xQRK0myLf_GcfE',
      cat: 'kahvalti',
      name: 'Cruffin',
      brand: 'cruffin',
      area: 'Prof. Muammer Aksoy Cd., Bahçelievler & 7. Cadde',
      signals: ['butik-firin', 'taze-kruvasan', 'danish-tiramisu'],
      desc:
        'Profesör Muammer Aksoy Caddesi’nde tereyağlı katmanlı kruvasanlar, kruvasan-muffin hibridi cruffin’ler ve danish tiramisu hazırlayan küçük, uzman butik pastane-fırın.',
      order: ['Tereyağlı Kruvasan', 'Danish Tiramisu', 'Özel Dolgulu Cruffin'],
      menu: ['Sade & Çikolatalı Kruvasan', 'Cruffin Çeşitleri', 'Danish Tiramisu', 'Kahve Eşlikleri'],
      sec: [
        [
          'Sabah Çıkan Fırın Çeşitleri & Gel-Al Servis',
          'Küçük fırın tezgâhında günlük sınırlı parti pişen ürünler özellikle sabah ve öğlen erken saatlerde tükeniyor.',
          'Menu-TR ve yerel fırın değerlendirmeleri',
        ],
      ],
      seat: 'Çok küçük butik alan; ağırlıkla gel-al ve kısa ayakta/tezgâh önü mola',
      crowd: 'Artizan hamur işi ve taze kruvasan arayan Bahçelievler sakinleri',
      dis: 'Oturma alanı çok dardır; uzun süreli kafe oturumu yerine al-götür veya hızlı kahvaltı için uygundur',
      transit: 'Bahçelievler Prof. Dr. Muammer Aksoy Cd. No:5.',
      sources: [
        [
          'Menu-TR Cruffin Bahçelievler',
          'https://menu-tr.com/',
          'editorial',
          'Taze kruvasanlar, danish tiramisu ve küçük fırın alanı notları',
        ],
        [
          'Restoranim Cruffin',
          'https://www.restoranim.net/',
          'community',
          'Muammer Aksoy Cd. konumu ve erken saat ziyaret tavsiyesi',
        ],
      ],
      pros: ['Gerçek tereyağlı katmanlı cruffin ve danish üretimi', 'Tek şubeli uzman butik fırın'],
      cons: ['Geniş oturma alanı yok'],
      unc: ['Popüler tatlı dolgulu çeşitler öğleden sonraya kalmayabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 6. MUTLAKA DENEMELİSİN (10 özgün yerel mutfak, çorba, mantı, kokoreç & roastery)
    // =========================================================================
    compactSeed({
      id: 'bah-kardesler-uygur',
      placeId: 'ChIJfb7mTJRP0xQRTe76P3nZI3U',
      cat: 'denemelisin',
      name: 'Kardeşler Uygur mutfağı',
      brand: 'kardeşler uygur',
      area: '69. Sk., Bahçelievler & 7. Cadde',
      signals: ['el-cekimi-lagmen', 'uygur-polosu', 'cucure-corbasi'],
      desc:
        'Yukarı Bahçelievler 69. Sokak’ta el çekimi erişteli Lagmen, baharatlı kavurma etli Polo, kızartma mantı ve Çüçüre çorbası ile Ankara’nın en özgün Doğu Türkistan / Uygur sofralarından birini sunan köklü aile lokantası.',
      order: ['El Çekimi Lagmen', 'Uygur Polosu (Özbek Pilavı)', 'Kızartma Mantı & Çüçüre Çorbası'],
      menu: ['Lagmen Çeşitleri', 'Polo', 'Çüçüre Çorbası', 'Samsa', 'Kızartma Mantı'],
      sec: [
        [
          'Çüçüre Çorbası & Fırın Samsa',
          'El açması hamurlarla pişen Çüçüre çorbası ve fırın samsa yemek öncesi öne çıkan otantik eşlikçilerdir.',
          'kardesleruygurmutfagi.com.tr ve Ankara gastronomi notları',
        ],
      ],
      seat: 'Mütevazı, otantik iki katlı lokanta masaları; hızlı servis',
      crowd: 'Ankara genelinden özgün Orta Asya ve el çekimi erişte mutfağı için gelenler',
      dis: 'Baharatlı ve yağlı et tabakları ağırlıktadır; öğle-akşam yemek saatlerinde doluluk yoğundur',
      transit: 'Yukarı Bahçelievler 69. Sokak No:60.',
      sources: [
        [
          'Kardeşler Uygur Mutfağı Resmi Sitesi',
          'https://www.kardesleruygurmutfagi.com.tr/',
          'operator',
          'Lagmen, polo, çüçüre çorbası ve samsa otantik Uygur menüsü',
        ],
        [
          'Yandex Haritalar & Yerel Gezi Blogları',
          'https://www.ankara.com/',
          'editorial',
          'Ankara’da el çekimi erişte ve Uygur mutfağı denince öne çıkan adres',
        ],
      ],
      pros: ['Ankara’da nadir görülen özgün Uygur mutfağı uzmanlığı', 'El çekimi taze hamur ve güçlü porsiyon'],
      cons: ['Yoğun yemek saatlerinde kısa masa bekleme'],
      unc: ['Bazı özel yemekler günün ikinci yarısında sınırlı kalabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-mersimek-corba',
      placeId: 'ChIJ8aCYpUVP0xQRcKJkfGHHG_4',
      cat: 'denemelisin',
      name: 'MerSimek Çorba',
      brand: 'mersimek',
      area: '58. Sk., Bahçelievler & 7. Cadde',
      signals: ['ilikli-kemik-suyu', 'beyran-paca', 'kavurmali-pilav'],
      desc:
        'Bahçelievler 58. Sokak’ta uzun süre kaynatılmış ilikli kemik suyuyla hazırlanan ilikli mercimek, Antep usulü beyran ve paça çorbalarının yanında kavurmalı pilav çıkaran uzman çorbacı.',
      order: ['İlikli Mercimek Çorbası', 'Beyran Çorbası', 'Kavurmalı Pilav'],
      menu: ['İlikli Mercimek', 'Beyran', 'Kelle Paça', 'Kavurmalı Pilav'],
      sec: [
        [
          'Kavurmalı Pilav Eşlikçisi',
          'Uzun pişen çorbaların ardından sıcak kavurmalı pilav tek başına doyurucu bir tamamlayıcıdır.',
          'İşletme menü kayıtları ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Samimi, temiz ve sade mahalle çorbacısı oturumu',
      crowd: 'Sabah-öğle sıcak kemik sulu çorba arayan çalışanlar ve akşamüstü müdavimleri',
      dis: 'Küçük sokak dükkanı düzenindedir; geç akşam yemeklerinden ziyade günlük çorba servisine odaklanır',
      transit: 'Bahçelievler 58. Sokak No:16/A.',
      sources: [
        [
          'MerSimek Çorba Resmi Profili',
          'https://www.instagram.com/mersi_mek',
          'operator',
          'İlikli mercimek, beyran ve kavurmalı pilav sunumları',
        ],
        [
          'Yemeksepeti & Restoranim',
          'https://www.restoranim.net/',
          'editorial',
          'Kemik suyu kalitesi, ilikli mercimek ve yüksek puan değerlendirmeleri',
        ],
      ],
      pros: ['Katkısız ilikli kemik suyu odağı', 'Hem çorba hem kavurmalı pilavda yüksek istikrar'],
      cons: ['Küçük dükkan alanı'],
      unc: ['Beyran ve paça kazanları gün içinde erken bitebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-mini-mutfak',
      placeId: 'ChIJbck_l3JP0xQRhGz3jm60TyA',
      cat: 'denemelisin',
      name: 'Mini Mutfak',
      brand: 'mini mutfak',
      area: 'Taşkent Cd., Bahçelievler & 7. Cadde',
      signals: ['gunluk-ev-yemekleri', 'zeytinyaglilar', 'ev-yapimi-profiterol'],
      desc:
        'Taşkent Caddesi’nde her gün taze çıkan ev yemekleri, zeytinyağlı tabaklar, ızgaralar ve ev yapımı profiterol gibi tatlılarıyla semtte güvenilir öğle ve akşam ev mutfağı arayanların durağı.',
      order: ['Günün Zeytinyağlı & Sulu Ev Yemekleri', 'Ev Yapımı Profiterol'],
      menu: ['Sulu Ev Yemekleri', 'Zeytinyağlılar', 'Izgara Köfte', 'Ev Yapımı Profiterol'],
      sec: [
        [
          'Zeytinyağlı Seçkisi & Ev Yapımı Profiterol',
          'Hafif zeytinyağlı çeşitleri ve yemek sonrası ev yapımı profiterol düzenli tercih edilir.',
          'Menu-TR Mini Mutfak değerlendirmeleri',
        ],
      ],
      seat: 'Küçük, sıcak ve sade ev yemeği lokantası salonu',
      crowd: 'Ev yapımı tencere yemeği özleyen bölge sakinleri ve çalışanlar',
      dis: 'Günün tezgâh çeşitleri öğle pikinde hızlı tükendiği için akşam geçe kalınca seçenek azalır',
      transit: 'Yukarı Bahçelievler Taşkent Caddesi No:91/A.',
      sources: [
        [
          'Menu-TR Mini Mutfak',
          'https://menu-tr.com/',
          'editorial',
          'Zeytinyağlılar, sulu yemekler ve profiterol değerlendirmesi',
        ],
        [
          'Yandex Haritalar Bahçelievler',
          'https://www.qrdos.tr/',
          'community',
          'Taşkent Cd. 91/A ev yemeği temizliği ve ★4.8 müdavim memnuniyeti',
        ],
      ],
      pros: ['Her gün değişen katkısız tencere ve zeytinyağlı menüsü', 'Yüksek puanlı hijyenik mutfak'],
      cons: ['Geç saatlerde çeşitlerin azalması'],
      unc: ['Günlük zeytinyağlı listesi mevsime göre değişir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-sinemis-manti',
      placeId: 'ChIJv2KAloFP0xQR1XxqNIVkb6M',
      cat: 'denemelisin',
      name: 'Sinemis Mantı Evi',
      brand: 'sinemis',
      area: 'Taşkent Cd., Bahçelievler & 7. Cadde',
      signals: ['el-acmasi-manti', 'bosnak-boregi', 'cerkes-yaglamasi'],
      desc:
        'Taşkent Caddesi’nde Kayseri mantısının yanı sıra Özbek mantısı, Sinop mantısı, Çerkes mantısı, tepsi mantısı, Boşnak böreği ve Çerkes yağlaması çıkaran samimi aile işletmesi mantı evi.',
      order: ['Kayseri & Sinop Usulü Mantı', 'Özbek / Çerkes Mantısı', 'Boşnak Böreği'],
      menu: ['Kayseri Mantısı', 'Sinop Mantısı', 'Özbek Mantısı', 'Tepsi Mantısı', 'Boşnak Böreği'],
      sec: [
        [
          'Boşnak Böreği & Çerkes Yağlaması',
          'Çeşitli bölge mantılarının yanında el açması çıtır Boşnak böreği ve kat kat Çerkes yağlaması özel olarak tercih edilir.',
          'sinemismantievi.com menüsü ve yerel seçki kayıtları',
        ],
      ],
      seat: 'Aile işletmesi sıcaklığında sade, temiz iç masa düzeni',
      crowd: 'Anadolu ve Kafkas hamur işlerini tek sofrada denemek isteyenler',
      dis: 'Butik aile mutfağı hızında taze pişirim yapıldığından yoğun saatlerde kısa bekleme yaşanabilir',
      transit: 'Bahçelievler Taşkent Caddesi No:19/A.',
      sources: [
        [
          'Sinemis Mantı Evi Resmi Menüsü',
          'http://sinemismantievi.com/menu/',
          'operator',
          'Kayseri, Özbek, Sinop, Çerkes ve tepsi mantıları ile Boşnak böreği',
        ],
        [
          'Menu-TR Sinemis Mantı Evi',
          'https://menu-tr.com/',
          'editorial',
          'Bölgelere göre el yapımı mantı ve hamur işleri incelemesi',
        ],
      ],
      pros: ['Tek mekânda 5 farklı yöresel mantı çeşidi', 'Katkısız aile işletmesi standardı'],
      cons: ['Küçük salonda pik saat yoğunluğu'],
      unc: ['Tepsi mantısı gibi özel ürünler gün içi stokla sınırlı olabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-aden-durum',
      placeId: 'ChIJQTD4p6hP0xQRkA_HICcvseg',
      cat: 'denemelisin',
      name: 'Aden Dürüm',
      brand: 'aden dürüm',
      area: 'Aşkabat Cd. (7. Cadde), Bahçelievler & 7. Cadde',
      signals: ['komurde-adana-ciger', 'bol-meze-ikrami', '7-cadde-klasigi'],
      desc:
        'Aşkabat Caddesi’nde kömür ateşinde Adana dürüm, Urfa, kuzu şiş ve ciğer şişin yanında zengin meze ikramlarıyla Bahçelievler’de yıllardır kalitesini koruyan bağımsız dürüm salonu.',
      order: ['Adana Dürüm', 'Ciğer Şiş Dürüm'],
      menu: ['Adana Dürüm', 'Ciğer Dürüm', 'Kuzu Şiş Dürüm', 'İkram Meze Tabağı'],
      sec: [
        [
          'İkram Mezeler & Ciğer Şiş',
          'Közlenmiş biber, ezme ve salata ikramlarıyla sunulan ciğer dürüm 7. Cadde müdavimlerinin favorileri arasındadır.',
          'Menu-TR ve restoran menü kayıtları',
        ],
      ],
      seat: 'Hareketli cadde üzeri ocakbaşı-salonu oturumu',
      crowd: '7. Cadde’de hızlı, doyurucu ve taze mangal dürüm arayanlar',
      dis: 'Cadde kalabalığı içinde akşam saatlerinde ocak önü hızlı ve gürültülüdür',
      transit: 'Bahçelievler Aşkabat Caddesi No:46/G.',
      sources: [
        [
          'Menu-TR Aden Dürüm',
          'https://menu-tr.com/',
          'editorial',
          'Aşkabat Caddesi kömürde Adana-ciğer dürüm ve meze ikramı',
        ],
        [
          'Restoranim Aden Dürüm',
          'https://www.restoranim.net/',
          'community',
          '7. Cadde’nin köklü dürüm ve şiş noktası değerlendirmeleri',
        ],
      ],
      pros: ['Taze közlenmiş kebap dürüm ve cömert meze eşlikleri', 'Merkezi 7. Cadde adresi'],
      cons: ['Akşam saatlerinde yoğun sirkülasyon'],
      unc: ['Hafta sonu ciğer şiş yoğun talep görür'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-alacati-mutfak',
      placeId: 'ChIJ0fsMzyZP0xQR6SQTEMjhc08',
      cat: 'denemelisin',
      name: 'Alaçatı Mutfak',
      brand: 'alaçatı mutfak',
      area: 'Prof. Muammer Aksoy Cd., Bahçelievler & 7. Cadde',
      signals: ['ege-zeytinyaglilari', 'manti-gozleme', 'samimi-lokanta'],
      desc:
        'Prof. Muammer Aksoy Caddesi üzerinde Ege mutfağı dokunuşlu zeytinyağlılar, günlük ev yemekleri, ev mantısı ve taze gözleme çıkaran samimi Bahçelievler mutfağı.',
      order: ['Ege Zeytinyağlı Tabağı', 'Ev Mantısı & Gözleme'],
      menu: ['Zeytinyağlılar', 'Günlük Ev Yemekleri', 'Mantı', 'Gözleme'],
      sec: [
        [
          'Günlük Ev Yemekleri & Gözleme Seçkisi',
          'Hafif zeytinyağlı çeşitlerinin yanında taze pişen ev mantısı ve gözleme öğle-akşam arası tercih edilir.',
          'Yerel restoran dizinleri ve işletme menüsü',
        ],
      ],
      seat: 'Rahat, aydınlık küçük lokanta masaları',
      crowd: 'Hafif zeytinyağlı ve ev yemeği arayan çevre sakinleri ve çalışanlar',
      dis: 'Günlük üretilen zeytinyağlı ve ev yemeği tezgahı öğle sonrasında azalabilir',
      transit: 'Bahçelievler Prof. Muammer Aksoy Caddesi No:76/C (Beşevler metro yakınları).',
      sources: [
        [
          'Menum.co Alaçatı Mutfak',
          'https://menum.co/',
          'editorial',
          'Muammer Aksoy Cd. Ege zeytinyağlıları, mantı ve gözleme menüsü',
        ],
        [
          'Yandex Haritalar Bahçelievler',
          'https://www.restoranim.net/',
          'community',
          'Ev yemekleri tazeliği ve samimi işletme puanları',
        ],
      ],
      pros: ['Ege otları ve zeytinyağlılarda dengeli ev lezzeti', 'Hafif öğün arayanlar için güçlü alternatif'],
      cons: ['Akşam geçe kalınca günlük yemek çeşidi daralabilir'],
      unc: ['Mevsimlik ot ve zeytinyağlılar haftalık güncellenir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-isler-gucler-kokorec',
      placeId: 'ChIJ8cAvl99O0xQRvPeEsoZQ9yE',
      cat: 'denemelisin',
      name: 'İŞLER GÜÇLER IZGARA & KOKOREÇ',
      brand: 'işler güçler',
      area: 'Taşkent Cd., Bahçelievler & 7. Cadde',
      signals: ['kuzu-kokorec', 'izgara-et-doner', 'gece-duragi'],
      desc:
        'Taşkent Caddesi No:19/B adresinde temiz kesim kuzu kokoreç, et döner ve ızgara çeşitleriyle özellikle akşam ve gece saatlerinde Bahçelievler sokak lezzeti arayanların tercih ettiği nokta.',
      order: ['Yarım Ekmek Kuzu Kokoreç', 'Izgara Köfte / Et Döner'],
      menu: ['Kuzu Kokoreç', 'Izgara Et Döner', 'Izgara Köfte', 'Midye'],
      sec: [
        [
          'Izgara Et Döner & Gece Servisi',
          'Kuzu kokorecin yanı sıra ızgara et döner ve köfte geç saatlerde de sıcak hazırlanıyor.',
          'Mekanlar.com ve güncel yemek menüleri',
        ],
      ],
      seat: 'Pratik, hızlı sokak lezzeti masaları ve kaldırım kenarı',
      crowd: 'Gece çıkışı ve akşam geç saatte kuzu kokoreç arayanlar',
      dis: 'Hızlı sokak lezzetleri odağındadır; uzun oturumlu restoran konforu sunmaz',
      transit: 'Bahçelievler Taşkent Caddesi No:19/B.',
      sources: [
        [
          'Mekanlar.com İşler Güçler',
          'https://www.mekanlar.com/',
          'editorial',
          'Taşkent Caddesi kuzu kokoreç ve gece açık sokak lezzeti profili',
        ],
        [
          'Yemeksepeti & Yandex Haritalar',
          'https://www.yemeksepeti.com/',
          'community',
          'Kuzu kokoreç ve et döner değerlendirmeleri',
        ],
      ],
      pros: ['Bahçelievler merkezinde temiz kuzu kokoreç ve geç akşam servisi', 'Yüksek puan istikrarı'],
      cons: ['Hızlı sokak düzeni; dar oturma alanı'],
      unc: ['Hafta sonu geceleri kokoreç porsiyonları yoğun talep görür'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-prod-coffee',
      placeId: 'ChIJi2J0Qh9P0xQR8gQ3ADAvOZU',
      cat: 'denemelisin',
      name: 'Prod Coffee & Roastery',
      brand: 'prod',
      area: '49. Sk., Bahçelievler & 7. Cadde',
      signals: ['uzun-yillardir-49-sk', 'aeropress-v60', 'sicak-sandvic'],
      desc:
        '49. Sokak’ta uzun süredir Bahçelievler nitelikli kahve sahnesinin köklü duraklarından biri olup V60 ve Aeropress demlemelerini sıcak sandviçler ve ev yapımı tatlılarla buluşturan roastery.',
      order: ['V60 / Aeropress Demleme', 'Sıcak Sandviç', 'Günlük Tatlı'],
      menu: ['V60', 'Aeropress', 'Cold Brew', 'Sıcak Sandviç Çeşitleri', 'Ev Yapımı Kek & Tatlı'],
      sec: [
        [
          'Sıcak Sandviçler & Hafif Öğle Eşlikleri',
          'Demleme kahvelerle birlikte doyurucu sıcak sandviçler sunularak ders veya çalışma günlerine pratiklik katıyor.',
          'Wanderlog ve yerel kafe dizinleri',
        ],
      ],
      seat: 'Rahat, ders ve çalışma dostu iç salon ile 49. Sokak ön oturumu',
      crowd: 'Bahçelievler’in eski kahve müdavimleri ve öğrenciler',
      dis: 'Öğle ve akşamüstü ders saatlerinde masa devri yavaşlar, yer bulmak zorlaşabilir',
      transit: 'Bahçelievler 49. Sokak No:14.',
      sources: [
        [
          'Mekanlar.com Prod Coffee',
          'https://www.mekanlar.com/',
          'editorial',
          '49. Sokak’ta köklü V60-Aeropress ve sıcak sandviç konsepti',
        ],
        [
          'Wanderlog Ankara Guide',
          'https://wanderlog.com/',
          'community',
          'Nitelikli çekirdek ve çalışma ortamı değerlendirmeleri',
        ],
      ],
      pros: ['Bölgenin köklü üçüncü dalga roastery’lerinden', 'Kahve + sıcak sandviç dengesi'],
      cons: ['Çalışan yoğunluğunda masa bekleme ihtimali'],
      unc: ['Hafta sonu prizli iç masalar erken dolar'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-qukies-bake-shop',
      placeId: 'ChIJqfNSnVBP0xQRt9mInA7JrUI',
      cat: 'denemelisin',
      name: "QUKİE'S BAKE SHOP",
      brand: 'qukie',
      area: 'Kazakistan Cd., Bahçelievler & 7. Cadde',
      signals: ['butik-pastane', 'cookie-brownie', 'firindan-sicak'],
      desc:
        'Kazakistan Caddesi’nde yumuşak dokulu dev Amerikan kurabiyeleri (cookie), brownie’ler ve özel kremalı fırın tatlılarıyla gençler arasında yoğun ilgi gören tek şubeli butik bake shop.',
      order: ['İmza Fırın Cookie Çeşitleri', 'Brownie'],
      menu: ['Sütlü & Bitter Cookie', 'Fıstık Ezmeli Cookie', 'Brownie', 'Taze Kahve Eşlikleri'],
      sec: [
        [
          'Özel Dolgulu Cookie & Brownie Kutuları',
          'Günlük çıkan farklı dolgulu cookie seçenekleri tekli ya da hediyelik kutu olarak yoğun ilgi görüyor.',
          'Yerel pastane dizinleri ve işletme menüsü',
        ],
      ],
      seat: 'Küçük, tatlı odaklı butik dükkan ve sınırlı oturma düzeni',
      crowd: 'Fırından taze cookie ve çikolatalı tatlı arayanlar',
      dis: 'Oturma kapasitesi sınırlıdır; ağırlıkla hızlı tatlı molası ve paket servis içindir',
      transit: 'Yukarı Bahçelievler Kazakistan Caddesi No:143/C.',
      sources: [
        [
          'Yandex Haritalar QUKİE’S',
          'https://yandex.com.tr/',
          'community',
          'Kazakistan Caddesi tek şubeli butik cookie ve brownie değerlendirmeleri',
        ],
        [
          'Restoranim Ankara Pastane Listesi',
          'https://www.restoranim.net/',
          'editorial',
          'Yukarı Bahçelievler ★4.8 puanlı tatlı bake shop kaydı',
        ],
      ],
      pros: ['Taze günlük çıkan dolgulu cookie uzmanlığı', 'Tek şubeli butik kalite'],
      cons: ['Geniş oturma salonu bulunmaz'],
      unc: ['Popüler cookie çeşitleri akşam saatlerinde erken tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'bah-coffee-roof',
      placeId: 'ChIJY6f2BrZP0xQRG48yJeRinvs',
      cat: 'denemelisin',
      name: 'Coffee Roof',
      brand: 'coffee roof',
      area: 'Prof. Muammer Aksoy Cd., Bahçelievler & 7. Cadde',
      signals: ['belcika-cikolatali-tatli', 'san-sebastian', 'kahve-tatli'],
      desc:
        'Prof. Muammer Aksoy Caddesi’nde kahve barının yanında Belçika çikolatalı özel tatlıları, San Sebastian cheesecake, tiramisu ve magnolya çeşitleriyle gençlerin ve öğrencilerin buluşma noktası olan kafe-tatlı durağı.',
      order: ['San Sebastian Cheesecake', 'Belçika Çikolatalı Özel Tatlı', 'Filtre Kahve / Latte'],
      menu: ['San Sebastian Cheesecake', 'Tiramisu', 'Magnolya', 'Espresso & Filtre Kahveler'],
      sec: [
        [
          'San Sebastian & Tiramisu Tatlı Vitrini',
          'Belçika çikolatası sosuyla servis edilen San Sebastian ve katmanlı tiramisu mekanın en çok sipariş edilen ürünleridir.',
          'Dijital.menu ve Menu-TR Coffee Roof kayıtları',
        ],
      ],
      seat: 'Geniş masalı, öğrencilerin sohbet ve tatlı molası için tercih ettiği kafe düzeni',
      crowd: 'Belçika çikolatalı tatlı-kahve buluşması arayan arkadaş grupları',
      dis: 'Tatlı odaklı kafe trafiği nedeniyle akşam saatlerinde hareketli ve sesli olabilir',
      transit: 'Bahçelievler Prof. Muammer Aksoy Caddesi No:68/B.',
      sources: [
        [
          'Dijital.menu Coffee Roof',
          'https://dijital.menu/',
          'editorial',
          'Belçika çikolatalı tatlılar, San Sebastian ve magnolya menüsü',
        ],
        [
          'Menu-TR Coffee Roof',
          'https://menu-tr.com/',
          'community',
          'Muammer Aksoy Caddesi üzerindeki kafe-tatlı değerlendirmeleri',
        ],
      ],
      pros: ['Kahve yanında zengin Belçika çikolatalı ve sütlü tatlı seçkisi', 'Sosyal buluşma için uygun oturum'],
      cons: ['Akşam saatlerinde masa doluluğu'],
      unc: ['Tatlı çeşitliliği gün içi yenilemeye göre değişebilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // NEGATİF DENETİM KONTROLLERİ (Politika Kapısı Audit Testi — 14 Kontrol)
    // =========================================================================
    negControl('ctrl-bah-burgerking-chain', 'ChIJLYydT95O0xQRzse5J_JAUB4', 'hamburger', 'Küresel fast-food zinciri (Kapı 2)'),
    negControl('ctrl-bah-dominos-chain', 'ChIJi45zqSBP0xQR89Isa89NKiY', 'pizza', 'Çok şubeli pizza zinciri (Kapı 2)'),
    negControl('ctrl-bah-terrapizza-chain', 'ChIJnzG8KPlP0xQR1Wctz98a2qs', 'pizza', 'Çok şubeli pizza zinciri (Kapı 2)'),
    negControl('ctrl-bah-hmbrgr-chain', 'ChIJZyV6qSBP0xQRzk6gHDRvgXQ', 'hamburger', 'Çok şubeli Ankara burger zinciri (Kapı 2)'),
    negControl('ctrl-bah-coffy-chain', 'ChIJLzgY1z9P0xQRimfopuIZGRE', 'kahve', 'Çok şubeli kahve zinciri (Kapı 2)'),
    negControl('ctrl-bah-sunbrothers-chain', 'ChIJmdA31IxP0xQRiKzjlfFdhU4', 'pizza', 'Çok şubeli pizza zinciri (Kapı 2)'),
    negControl('ctrl-bah-dipizza-chain', 'ChIJU8gwZSRP0xQRTfb3KALg4Sc', 'pizza', 'Çok şubeli Ankara pizza zinciri (Kapı 2)'),
    negControl('ctrl-bah-thestock-chain', 'ChIJ0YViokZP0xQRaonO96g45hI', 'kahve', 'Çok şubeli Ankara kahve zinciri (Kapı 2)'),
    negControl('ctrl-bah-bigbaker-chain', 'ChIJyW5rRN9O0xQRb2aXJgopWBE', 'hamburger', 'Çok şubeli Ankara burger/bistro zinciri (Kapı 2)'),
    negControl('ctrl-bah-cannes-noncoffee', 'ChIJ7XdhX01P0xQRchNnP9DHcZo', 'kahve', 'chocolate_shop primaryType kahve kategorisine giremez (Kapı 3B)'),
    negControl('ctrl-bah-uyanik-nonfood', 'ChIJvddgdCRP0xQRb6pQgfjKpSE', 'kahve', 'library türü yeme-içme işletmesi değil (Kapı 3)'),
    negControl('ctrl-bah-out-emek-alfreds', 'ChIJnwFme0tP0xQRqatq02d6PDQ', 'kahvalti', 'Emek Mahallesi Bişkek Caddesi (8. Cadde) sınır dışı (Kapı 4)'),
    negControl('ctrl-bah-out-emek-beeburger', 'ChIJ9yPANyZP0xQR9of9LAM7FVI', 'hamburger', 'Emek Mahallesi 30. Sokak sınır dışı (Kapı 4)'),
    negControl('ctrl-bah-low-sevgi-sofrasi', 'ChIJxUAnVjtP0xQRZeKC1P5PXhA', 'denemelisin', '4.3 puan standart 4.4 eşiğinin altında (Kapı 6)'),
  ],
};
