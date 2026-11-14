import { buildRegionCategories } from '../categories';
import type { V3RegionDefinition } from '../types';

/**
 * Kadıköy'ün tekil tam rehber olarak açılmamış komşu mahallelerindeki
 * (Fenerbahçe/Kalamış, Zühtüpaşa, Erenköy)
 * canlı Google Places doğrulamalı mekan havuzu.
 *
 * NOT: Yalnızca yayınlanmış semtlerin "Yakındaki Diğer Öneriler" bölümünü besler;
 * `registry.ts` üzerinden bağımsız bölge olarak sunulmaz.
 */
export const ISTANBUL_KADIKOY_NEARBY_POOL_DEF: V3RegionDefinition = {
  id: 'kadikoy-nearby-pool',
  slug: 'kadikoy-nearby-pool',
  city: 'İstanbul',
  district: 'Kadıköy',
  neighborhood: 'Komşu Semtler',
  officialQuarter: 'Fenerbahçe, Zühtüpaşa & Erenköy',
  displayName: 'Kadıköy Komşu Mahalleler Havuzu',
  locative: "Kadıköy'de",
  path: ['istanbul', 'kadikoy', 'nearby-pool'],
  aliases: [],
  scopeNote: 'Internal Verified Nearby Pool',
  characterSubtitle: '',
  center: { lat: 40.98, lng: 29.05 },
  bbox: { minLat: 40.955, maxLat: 41.015, minLng: 29.02, maxLng: 29.095 },
  allowedNeighborhoodTokens: [
    'Fenerbahçe',
    'Zühtüpaşa',
    'Erenköy',
    'Merdivenköy',
    'Caddebostan',
  ],
  categories: buildRegionCategories(),
  candidates: [
    // --- KAHVALTI (Fenerbahçe/Kalamış, Erenköy — 2 mekan) ---
    {
      id: 'nearby-kalamissia-fenerbahce',
      placeId: 'ChIJpcDh-cu5yhQRLxg4KmQt9YA',
      categoryId: 'kahvalti',
      expectedBrandWord: 'kalamissia',
      neighborhoodLabelOverride: 'Fenerbahçe (Kalamış), Kadıköy',
      localSignals: ['kalamis-kahvalti', 'ev-recelleri', 'sahil-yakini'],
      description:
        'Fener Kalamış Caddesi üzerinde ev yapımı reçelleri, sıcak börekleri ve özenli serpme/tabak kahvaltısıyla hafta sonu buluşmalarının sevilen adresi.',
      whatToOrder: ['Kalamissia Serpme Kahvaltı', 'Avokadolu Çılbır', 'Su Böreği / Pişi Tabağı'],
      menuFrom: ['Omlet Çeşitleri', 'Granola Kase', 'Espresso & Bitki Çayları'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Ev Yapımı Limonata & Cevizli Havuçlu Kek',
          note: 'Kahvaltı sonrasında Kalamış yürüyüşü öncesi tercih edilen taze pasta ve içecek ikilisi.',
          proof: 'Kalamış yeme-içme seçkileri ve işletme vitrini',
        },
      ],
      suitability: {
        seating: 'Yol kenarı camlı veranda ve konforlu iç salon masaları',
        crowdAndNoise: 'Kalamış temposunda canlı ama sohbete elverişli brunch ortamı',
        disadvantage: 'Pazar brunch saatlerinde önceden masa sormak gerekebiliyor.',
        transit: 'Kalamış Marina ve Kurbağalıdere aksından kısa yürüyüşle Fener Kalamış Caddesi’nde.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'ExploreKadikoy — Kalamış Kahvaltı Rehberi',
            url: 'https://www.explorekadikoy.com/',
            date: '2026-10-05',
            kind: 'editorial',
            note: 'Ev yapımı reçelleri ve Kalamış’taki sıcak kahvaltı servisiyle öne çıkıyor',
          },
          {
            title: 'Müdavim — Kalamissia Kafe',
            url: 'https://mudavim.net/',
            date: '2026-09-19',
            kind: 'community',
            note: 'Temiz sunum, börek ve taze kek seçenekleriyle beğeniliyor',
          },
        ],
        pros: ['Moda ve Kalamış arasında kolay erişimli konum', 'Zengin ev yapımı tatlı ve reçel seçkisi'],
        cons: ['Hafta sonu cadde kenarı gürültüsü ve yoğunluk'],
        uncertainties: ['Serpme kahvaltıda minimum kişi şartı uygulanabilmektedir.'],
      },
    },
    {
      id: 'nearby-ethem-efendi-erenkoy',
      placeId: 'ChIJsUcmrF3HyhQRYlCqxMUAvGE',
      categoryId: 'kahvalti',
      expectedBrandWord: 'ethem efendi',
      neighborhoodLabelOverride: 'Erenköy, Kadıköy',
      localSignals: ['kosk-bahcesi', 'serpme-kahvalti', 'anadolu-peynirleri'],
      description:
        'Erenköy’ün tarihi bahçeli köşklerinden birinde Anadolu peynirleri, sıcak gözlemeler ve zengin kahvaltı sofraları sunan popüler kahvaltı kurumu.',
      whatToOrder: ['Serpme Köy Kahvaltısı', 'Kavurmalı Yumurta', 'Sucuklu Sıcak Pişi'],
      menuFrom: ['Antep Kaymağı & Bal', 'Gözleme Çeşitleri', 'Semaver Çay'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Sıcak Pişi & Tahin-Pekmez İkilisi',
          note: 'Kahvaltı masasını tatlı bir dokunuşla tamamlayan taze hamur ve yöresel sos uyumu.',
          proof: 'ethemefendikahvalti.com menüsü ve İstanbul kahvaltı rehberleri',
        },
      ],
      suitability: {
        seating: 'Geniş köşk bahçesi ve yüksek tavanlı iç salon',
        crowdAndNoise: 'Büyük kalabalık gruplara uygun hareketli hafta sonu kahvaltı atmosferi',
        disadvantage: 'Üst segment fiyat seviyesi ve hafta sonları kapıda bekleme sırası oluşabilmesi.',
        transit: 'Erenköy Marmaray ve Ethemefendi Caddesi üzerinde ulaşımı kolay.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'Ethem Efendi Kahvaltı Resmi Sitesi',
            url: 'https://ethemefendikahvalti.com/',
            date: '2026-11-13',
            kind: 'operator',
            note: 'Erenköy köşk şubesi, serpme kahvaltı içeriği ve yöresel ürünler',
          },
          {
            title: 'Oggusto — İstanbul Kahvaltı Rehberi',
            url: 'https://www.oggusto.com/',
            date: '2026-09-22',
            kind: 'editorial',
            note: 'Geniş bahçede grup kahvaltısı ve Anadolu lezzetleri',
          },
        ],
        pros: ['Tarihi Erenköy köşk bahçesi', 'Kalabalık aile/arkadaş kahvaltılarına uygun kapasite'],
        cons: ['Yüksek fiyat seviyesi', 'Hafta sonu sıra bekleme ihtimali'],
        uncertainties: ['Hafta sonu serpme servisinde rezervasyon sınırlamaları uygulanabilir.'],
      },
    },

    // --- KAHVE (Fenerbahçe/Kalamış — 3 mekan) ---
    {
      id: 'nearby-elloi-kalamis',
      placeId: 'ChIJfZNbCPe5yhQRUFTmXhVmRbg',
      categoryId: 'kahve',
      expectedBrandWord: 'elloi',
      neighborhoodLabelOverride: 'Fenerbahçe (Kalamış), Kadıköy',
      localSignals: ['kalamis-kahve', 'butik-espresso', 'ekonomik-kahve'],
      description:
        'Itri Dede Sokak’ta sade bar tasarımı, dengeli espresso reçeteleri ve mahalle müdavimliğiyle yüksek puan toplayan butik Kalamış kahvecisi.',
      whatToOrder: ['Cortado', 'Iced Latte', 'V60 Filtre Kahve'],
      menuFrom: ['Flat White', 'Americano', 'Cold Brew'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Günlük Fırın Kurabiye & Banana Bread',
          note: 'Sabah kahvesi yanında hızlı atıştırmalık olarak öne çıkan taze fırın dilimleri.',
          proof: 'Kalamış yerel rehberleri ve kafe vitrini',
        },
      ],
      suitability: {
        seating: 'Kompakt sokak içi oturma ve al-götür servis düzeni',
        crowdAndNoise: 'Komşu yürüyüş rotasında sakin ve hızlı kahve molası atmosferi',
        disadvantage: 'Küçük alan nedeniyle uzun süre oturmak yerine al-götür veya kısa mola için tasarlanmıştır.',
        transit: 'Kurbağalıdere ve Kalamış’ın girişindeki Itri Dede Sokak’ta Moda’dan yürüyüş mesafesinde.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'ExploreKadikoy — Kalamış Kahvecileri',
            url: 'https://www.explorekadikoy.com/',
            date: '2026-10-10',
            kind: 'editorial',
            note: 'Itri Dede Sokak’taki yeni nesil butik kahve duraklarından',
          },
          {
            title: 'Reddit / Yerel Kahve Notları',
            url: 'https://www.reddit.com/',
            date: '2026-09-28',
            kind: 'community',
            note: 'Süt-espresso dengesi ve uygun fiyat seviyesiyle beğeniliyor',
          },
        ],
        pros: ['Moda/Yoğurtçu Parkı’ndan yürüyerek kolay erişim', 'Ekonomik bütçe seviyesi ve temiz espresso'],
        cons: ['Çok küçük iç mekan'],
        uncertainties: ['Haftalık çekirdek menüsü değişebiliyor.'],
      },
    },
    {
      id: 'nearby-nokta-kalamis',
      placeId: 'ChIJ6WY6-nu4yhQRGC6ZyTiwMUQ',
      categoryId: 'kahve',
      expectedBrandWord: 'nokta',
      neighborhoodLabelOverride: 'Fenerbahçe (Kalamış), Kadıköy',
      localSignals: ['kalamis-sokak', 'ucuncu-dalga', 'tatli-kahve'],
      description:
        'Itri Dede Sokak’ta ferah köşe oturumu, özenli pour-over demlemeleri ve ev yapımı tatlılarıyla sevilen Kalamış üçüncü dalga kahvecisi.',
      whatToOrder: ['Flat White', 'Filtre Kahve', 'Iced Spanish Latte'],
      menuFrom: ['Cortado', 'Matcha Latte', 'V60'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Soğuk Demleme & Ev Yapımı Tart / Kek',
          note: 'Öğleden sonra kahve yanında paylaşılan günlük pasta dilimleri.',
          proof: 'Fenerbahçe-Kalamış kahve paylaşımları',
        },
      ],
      suitability: {
        seating: 'İç masalar, köşe kaldırım oturması ve gel-al imkanı',
        crowdAndNoise: 'Öğle ve hafta sonu canlı mahalle buluşma noktası',
        disadvantage: 'Kaldırım masaları hafta sonları hızlı dolduğu için yer beklemek gerekebilir.',
        transit: 'Itri Dede Sokak’ta Yoğurtçu Parkı ve Kalamış Parkı arasındaki yürüyüş ekseninde.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'The Magger — Kalamış Kahve Durakları',
            url: 'https://www.themagger.com/',
            date: '2026-09-16',
            kind: 'editorial',
            note: 'Itri Dede Sokak atmosferiyle öne çıkan nitelikli kafe',
          },
          {
            title: 'Müdavim — Nokta Kalamış',
            url: 'https://mudavim.net/',
            date: '2026-10-08',
            kind: 'community',
            note: 'Yüksek kahve standardı ve güleryüzlü baristasıyla övülüyor',
          },
        ],
        pros: ['Moda ve Kalamış sınırında yürüyüş rotası üstünde', 'Ev yapımı tart ve kek seçenekleri'],
        cons: ['Hafta sonu masa yoğunluğu'],
        uncertainties: ['Sezonsal soğuk içecek menüsü dönemsel güncellenir.'],
      },
    },
    {
      id: 'nearby-klar-fenerbahce',
      placeId: 'ChIJcVtG6Bm5yhQRnklV2bZlizM',
      categoryId: 'kahve',
      expectedBrandWord: 'klar',
      neighborhoodLabelOverride: 'Fenerbahçe (Kalamış), Kadıköy',
      localSignals: ['iskandinav-kavrum', 'ozel-harman', 'fener-kalamis'],
      description:
        'Kendi kavurduğu açık profilli İskandinav esintili çekirdekleriyle tanınan Klar Coffee’nin Fener Kalamış Caddesi’ndeki şık kahve barı.',
      whatToOrder: ['V60 Tek Köken', 'Flat White (Açık Kavrum)', 'Espresso Tonic'],
      menuFrom: ['Batch Brew', 'Cortado', 'Matcha'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Soğuk Sütlü Espresso & Yulaflı Kurabiye Bar',
          note: 'Kalamış sahil yürüyüşü öncesi enerji veren hafif atıştırmalık eşlikçisi.',
          proof: 'klarcoffee.com ve İstanbul nitelikli kahve haritası',
        },
      ],
      suitability: {
        seating: 'Sakin sokak önü masaları ve al-götür kahve servisi',
        crowdAndNoise: 'Fener Kalamış’ın düzenli sahil atmosferinde huzurlu mola noktası',
        disadvantage: 'Çalışma veya büyük gruplu oturmalar için iç oturma alanı sınırlıdır.',
        transit: 'Fener Kalamış Caddesi üzerinde Kalamış Marina karşısı aksında.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'Klar Coffee Roasters Resmi Sitesi',
            url: 'https://klarcoffee.com/',
            date: '2026-11-13',
            kind: 'operator',
            note: 'Kendi kavurduğu tek kökenli çekirdekler ve Fenerbahçe şubesi',
          },
          {
            title: 'Oggusto — İstanbul Nitelikli Kavurmahaneler',
            url: 'https://www.oggusto.com/',
            date: '2026-08-24',
            kind: 'editorial',
            note: 'Özenli filtre kahve demlemeleri ve kavurma profiliyle tanınan marka',
          },
        ],
        pros: ['Kendi kavurduğu yüksek kaliteli tek köken çekirdekler', 'Kalamış sahil yürüyüşüne çok yakın'],
        cons: ['Küçük oturma kapasitesi'],
        uncertainties: ['Çekirdek stoğu taze kavrum dönemine göre haftalık değişebilir.'],
      },
    },

    // --- PİZZA (Erenköy, Fenerbahçe/Kalamış — 3 mekan) ---
    {
      id: 'nearby-via-pizzeria-fenerbahce',
      placeId: 'ChIJ00YGBg_HyhQRtXoA3bfsIFA',
      categoryId: 'pizza',
      expectedBrandWord: 'via',
      neighborhoodLabelOverride: 'Selamiçeşme (Fenerbahçe), Kadıköy',
      localSignals: ['selamicesme-italyanca', 'ince-hamur-pizza', 'fenerbahce-sokak'],
      description:
        'Bağdat Caddesi güneyindeki Hacı Mehmet Efendi Sokak’ta incecik çıtır-yumuşak dengeli hamurlu İtalyan pizzaları, el yapımı fettuccine tabakları ve sıcak ikramlarıyla sevilen Fenerbahçe pizzacısı.',
      whatToOrder: ['Entrecote Pizza', 'Klasik Margherita', 'Antipasto Tabağı'],
      menuFrom: ['Fettuccine di Carne', 'Dört Peynirli Pizza', 'Espresso'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Taze Fettuccine & Ev Yapımı Tiramisu',
          note: 'Pizza dışında akşam masalarında iki kişilik paylaşım için sıkça tercih edilen İtalyan makarna ve tiramisu kapanışı.',
          proof: 'Selamiçeşme yerel gastronomi değerlendirmeleri ve İtalyan mutfak notları',
        },
      ],
      suitability: {
        seating: 'Sıcak iç salon, dış sokak masaları ve rezervasyon imkanı',
        crowdAndNoise: 'Akşamları Selamiçeşme–Feneryolu komşularıyla keyifli akşam atmosferi',
        disadvantage: 'Akşam yemek saatlerinde sokak içi masalar hızla dolduğu için gitmeden rezervasyon sormak faydalı.',
        transit: 'Feneryolu sınırının hemen güneyinde Fenerbahçe Hacı Mehmet Efendi Sokak No:6/B’de.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-14',
        sources: [
          {
            title: 'ExploreKadikoy — Selamiçeşme İtalyan Restoranları',
            url: 'https://www.explorekadikoy.com/',
            date: '2026-10-16',
            kind: 'editorial',
            note: 'Hacı Mehmet Efendi Sokak’ta ince hamurlu İtalyan pizzaları ve fettuccine servisiyle öne çıkan adres',
          },
          {
            title: 'Müdavim — Via Pizzeria Fenerbahçe',
            url: 'https://mudavim.net/',
            date: '2026-10-01',
            kind: 'community',
            note: 'Hamur dengesi, sıcak ekibi ve tiramisu kalitesiyle 4.9 puan ortalamasında',
          },
        ],
        pros: ['Feneryolu sınırına yürüyüş mesafesinde ince İtalyan hamuru', 'Hem pizza hem iki kişilik taze makarna seçeneği'],
        cons: ['Hafta sonu akşamları rezervasyon gereksinimi'],
        uncertainties: ['Özel şarküteri ve sos çeşitleri dönemsel güncellenebilir.'],
      },
    },
    {
      id: 'nearby-fornio-erenkoy',
      placeId: 'ChIJCSOOW2O3yhQRBVcmXRHykKQ',
      categoryId: 'pizza',
      expectedBrandWord: 'fornio',
      neighborhoodLabelOverride: 'Erenköy, Kadıköy',
      localSignals: ['erenkoy-napoli', 'tas-firin', 'yuksek-puan'],
      description:
        'Erenköy Taşmektep Sokak’ta İtalyan unu ve uzun fermantasyonlu hamuruyla taş fırından çıkan kabarık kenarlı Napoli pizzaları sunan butik pizzeria.',
      whatToOrder: ['Margherita Verace', 'Diavola & Acı Bal', 'Trüflü Mantarlı Pizza'],
      menuFrom: ['Marinara', 'Quattro Formaggi', 'Bresaola Pizza'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Ev Yapımı Klasik Tiramisu',
          note: 'Pizza sonrası paylaşım veya kapanış için günlük hazırlanan mascarpone tatlısı.',
          proof: 'Erenköy restoran rehberleri ve yerel müdavim notları',
        },
      ],
      suitability: {
        seating: 'Samimi iç salon, sokak önü masaları ve paket servis mevcut',
        crowdAndNoise: 'Akşamları sıcak İtalyan mahalle pizzacısı atmosferi',
        disadvantage: 'Akşam yemek saatlerinde küçük salon çabuk dolduğu için erken gitmek avantajlı.',
        transit: 'Erenköy Marmaray ve Bağdat Caddesi arasındaki Taşmektep Sokak’ta.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'ExploreKadikoy — Bağdat Caddesi Pizzacıları',
            url: 'https://www.explorekadikoy.com/',
            date: '2026-10-14',
            kind: 'editorial',
            note: 'Erenköy’ün yüksek puanlı taş fırın Napoli pizzacısı',
          },
          {
            title: 'Müdavim — Fornio Pizzeria',
            url: 'https://mudavim.net/',
            date: '2026-09-29',
            kind: 'community',
            note: 'Hamur hafifliği ve taze malzeme dengesiyle tercih ediliyor',
          },
        ],
        pros: ['4.8 puanlı yüksek hamur tutarlılığı', 'Erenköy sokak içinde sakin konum'],
        cons: ['Oturma kapasitesi sınırlı'],
        uncertainties: ['Mevsimsel özel pizzalar haftalık menüye eklenebilir.'],
      },
    },
    {
      id: 'nearby-sailors-kalamis',
      placeId: 'ChIJZWJBYze5yhQRmWAXYI7U9Fw',
      categoryId: 'pizza',
      expectedBrandWord: 'sailors',
      neighborhoodLabelOverride: 'Fenerbahçe (Kalamış), Kadıköy',
      localSignals: ['kalamis-pizza', 'denizci-temasi', 'ince-citir'],
      description:
        'Fenerbahçe Fuatpaşa Caddesi’nde odun ateşinden çıkan dengeli hamurlu gurme pizzaları ve samimi mahalle ruhuyla öne çıkan Kalamış pizzacısı.',
      whatToOrder: ['Füme Kaburgalı Pizza', 'Burrata & Pesto Pizza', 'Klasik Margherita'],
      menuFrom: ['Dört Peynirli', 'Pepperoni', 'Vejetaryen'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Sarımsaklı Fırın Ekmeği & Rokalı Parmesan Salata',
          note: 'Pizza beklerken masada paylaşılan zeytinyağlı sıcak ekmek ve taze salata.',
          proof: 'Kalamış yeme-içme notları ve mekan menüsü',
        },
      ],
      suitability: {
        seating: 'Rahat mahalle salonu ve dış masalar',
        crowdAndNoise: 'Kalamış sakinlerinin tercih ettiği samimi akşam temposu',
        disadvantage: 'Küçük butik dükkan olduğu için hafta sonu akşamları masa beklemek gerekebilir.',
        transit: 'Fenerbahçe Fuatpaşa Caddesi’nde Kalamış ve Feneryolu yürüyüş hattı üzerinde.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'ExploreKadikoy — Fenerbahçe Pizza Durakları',
            url: 'https://www.explorekadikoy.com/',
            date: '2026-10-02',
            kind: 'editorial',
            note: 'Kalamış bölgesinde yüksek puanlı mahalle pizzacısı',
          },
          {
            title: 'Müdavim — Sailors Pizza Kalamış',
            url: 'https://mudavim.net/',
            date: '2026-09-20',
            kind: 'community',
            note: 'Malzeme kalitesi ve sıcak mahalle servisiyle övülüyor',
          },
        ],
        pros: ['Kaliteli malzemeli dengeli hamur', 'Caddebostan ve Moda arasındaki Kalamış konumu'],
        cons: ['Butik salon kapasitesi'],
        uncertainties: ['Özel pizza hamuru stoğu yoğun akşamlarda erken tükenebilir.'],
      },
    },

    // --- HAMBURGER (Fenerbahçe/Kalamış — 1 mekan) ---
    {
      id: 'nearby-buffe-kalamis',
      placeId: 'ChIJ6aKwQIG4yhQRT44eXXeqztk',
      categoryId: 'hamburger',
      expectedBrandWord: 'buffe',
      neighborhoodLabelOverride: 'Fenerbahçe (Kalamış), Kadıköy',
      localSignals: ['kalamis-gurme-burger', 'hot-dog', 'sokak-lezzeti'],
      description:
        'Fener Kalamış Caddesi üzerinde gurme burgerleri, artizan sosislileri ve ev yapımı turşularıyla bilinen modern sokak lezzetleri büfesi.',
      whatToOrder: ['Double Smash Burger', 'Büffe Classic Cheeseburger', 'Trüflü Burger'],
      menuFrom: ['Gouda & Karamelize Soğanlı Burger', 'Ev Yapımı Turşu', 'Soğuk İçecekler'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Karamelize Soğanlı Gurme Sosisli & Trüflü Patates',
          note: 'Burger dışında mekanın diğer imza sokak lezzeti ve patates eşlikçisi.',
          proof: 'Büffe Kalamış menüsü ve Kadıköy gurme sokak yemeği seçkileri',
        },
      ],
      suitability: {
        seating: 'Hızlı masa servisi, yüksek tezgah oturması ve al-götür düzeni',
        crowdAndNoise: 'Kalamış yürüyüşü sonrası genç kalabalıkla enerjik ortam',
        disadvantage: 'Uzun akşam oturmasından ziyade hızlı ve kaliteli burger-sosisli molasına uygundur.',
        transit: 'Fener Kalamış Caddesi üzerinde Kalamış Parkı yürüyüş hattında.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'The Magger — Kalamış Gurme Durakları',
            url: 'https://www.themagger.com/',
            date: '2026-09-11',
            kind: 'editorial',
            note: 'Gurme hamburger ve hot dog ikilisini mahalle büfesi konseptiyle sunuyor',
          },
          {
            title: 'Ekşi Sözlük — Büffe Kalamış',
            url: 'https://eksisozluk.com/',
            date: '2026-10-06',
            kind: 'community',
            note: 'Sulu köftesi, özel sosları ve sosislisiyle yüksek puanlı Kalamış durağı',
          },
        ],
        pros: ['Hem gurme burger hem özel sosisli seçeneği', 'Kalamış’ta merkezi cadde konumu'],
        cons: ['Kompakt büfe düzeni nedeniyle oturma alanı dar'],
        uncertainties: ['Akşam geç saatlerde bazı özel ekmekler tükenebiliyor.'],
      },
    },

    // --- DATE MEKANLARI (Kalamış, Erenköy — 3 mekan) ---
    {
      id: 'nearby-parvus-kalamis',
      placeId: 'ChIJ7zxInYu5yhQRvSUut92CQbk',
      categoryId: 'date',
      expectedBrandWord: 'parvus',
      neighborhoodLabelOverride: 'Kalamış (Zühtüpaşa), Kadıköy',
      localSignals: ['butik-bistro', 'sarap-eslesmesi', 'akşam-bulusmasi'],
      description:
        'Kalamış ile Kızıltoprak arasında şef dokunuşlu akşam tabakları, taze makarnalar ve özenli şarap eşleşmeleri sunan sakin atmosferli mahalle bistrosu.',
      whatToOrder: ['El Yapımı Makarna Çeşitleri', 'Ördek veya Dana Yanak Tabağı', 'Kadeh Şarap Eşleşmesi'],
      menuFrom: ['Paylaşımlık Başlangıçlar', 'Şarküteri & Peynir Tabağı', 'Özel Kokteyller'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Paylaşımlık Başlangıç Tabağı & Artizan Akşam Tatlısı',
          note: 'İki kişilik akşam buluşmalarında ana yemek öncesi başlangıç ve kapanış tatlısı olarak tercih ediliyor.',
          proof: 'İstanbul bistro rehberleri ve akşam menüsü seçkisi',
        },
      ],
      suitability: {
        seating: 'Tam masa servisli loş iç salon ve sınırlı bahçe masaları (rezervasyon önerilir)',
        crowdAndNoise: 'Romantik, sakin ve sohbete elverişli akşam bistrosu atmosferi',
        disadvantage: 'Üst segment bütçe seviyesindedir ve hafta sonu rezervasyonsuz masa bulmak güçtür.',
        transit: 'Zühtüpaşa Rüştiye Sokak’ta Moda-Kurbağalıdere ve Kalamış arasında yürüyüş mesafesinde.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'Oggusto — Anadolu Yakası Romantik Akşam Mekanları',
            url: 'https://www.oggusto.com/',
            date: '2026-10-11',
            kind: 'editorial',
            note: 'Butik menüsü, şarap kavı ve sakin mahalle atmosferiyle özel akşamlar için öne çıkıyor',
          },
          {
            title: 'Ekşi Sözlük — Parvus Kalamış',
            url: 'https://eksisozluk.com/',
            date: '2026-09-27',
            kind: 'community',
            note: 'Tabak lezzeti ve gürültüden uzak şık servisiyle yüksek puan alıyor',
          },
        ],
        pros: ['Moda ve Çarşı’ya çok yakın Zühtüpaşa-Kalamış konumu', 'Özenli mutfak ve sakin ambiyans'],
        cons: ['Üst fiyat seviyesi', 'Küçük kapasite nedeniyle rezervasyon şart'],
        uncertainties: ['Menü mevsimsel ürün tedarikine göre sık güncellenir.'],
      },
    },
    {
      id: 'nearby-olio-erenkoy',
      placeId: 'ChIJHTKsja_HyhQRT8v3LvhLpBs',
      categoryId: 'date',
      expectedBrandWord: 'olio',
      neighborhoodLabelOverride: 'Erenköy, Kadıköy',
      localSignals: ['akdeniz-brasserie', 'taze-makarna', 'aksam-kokteylleri'],
      description:
        'Erenköy’de Akdeniz mutfağı, odun fırını yemekleri, taze el açması makarnalar ve sıcak aydınlatmasıyla sevilen şık semt brasserie’si.',
      whatToOrder: ['Trüflü Mantarlı Risotto veya Makarna', 'Izgara Deniz Levreği', 'Burrata & Fırın Domates'],
      menuFrom: ['Odun Fırını Pizzalar', 'Şarap Seçkisi', 'Akşam Salatası'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'İmza Kokteyller & Fırın Cheesecake',
          note: 'Akşam yemeğini tamamlayan hafif narenciyeli kokteyller ve kremamsı tatlı kapanışı.',
          proof: 'Oggusto brasserie rehberi ve mekan menüsü',
        },
      ],
      suitability: {
        seating: 'Geniş iç salon, bar bölümü ve kapalı bahçe oturması',
        crowdAndNoise: 'Akşam saatlerinde şık, sohbet dostu brasserie atmosferi',
        disadvantage: 'Hafta sonu akşamları kalabalık olabiliyor; cadde üzeri park yeri sınırlı.',
        transit: 'Şemsettin Günaltay Caddesi üzerinde Erenköy ve Suadiye arasında kolay erişim.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'Oggusto — Bağdat Caddesi Akşam Mekanları',
            url: 'https://www.oggusto.com/',
            date: '2026-09-14',
            kind: 'editorial',
            note: 'Erenköy’de samimi brasserie servisi ve Akdeniz menüsüyle öne çıkıyor',
          },
          {
            title: 'Müdavim — Olio Brasserie',
            url: 'https://mudavim.net/',
            date: '2026-10-04',
            kind: 'community',
            note: 'Makarna çeşitleri ve kokteylleriyle Caddebostan/Suadiye çevresinin beğenilen adresi',
          },
        ],
        pros: ['Geniş oturma ve bar düzeni', 'Taze İtalyan-Akdeniz yemek çeşitliliği'],
        cons: ['Hafta sonları yoğunlaşma ve park sorunu'],
        uncertainties: ['Grup rezervasyonları için önceden teyit alınması önerilir.'],
      },
    },
    {
      id: 'nearby-ouzo-kalamis',
      placeId: 'ChIJuz2FIn64yhQRBGsCpJJCUUI',
      categoryId: 'date',
      expectedBrandWord: 'ouzo',
      neighborhoodLabelOverride: 'Fenerbahçe (Kalamış), Kadıköy',
      iconicSettingOrVibeProtected: true,
      localSignals: ['kalamis-marina-teras', 'deniz-manzarali-date', 'ege-yunan-mutfagi'],
      description:
        'Fener Kalamış’ta doğrudan Kalamış Marina ve Marmara denizine hakim çatı terasında Ege-Yunan mezeleri ve deniz ürünleri sunan özel gün akşam restoranı.',
      whatToOrder: ['Girit Ezmesi & Deniz Börülcesi', 'Saganaki Peynir', 'Izgara Kalamar veya Günlük Balık'],
      menuFrom: ['Soğuk Deniz Mahsulü Mezeleri', 'Lakerda', 'Yunan Salatası'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Izgara Ahtapot & Sakızlı Muhallebi',
          note: 'Manzaralı akşam masasının en çok paylaşılan sıcak ara sıcağı ve geleneksel tatlı kapanışı.',
          proof: 'ouzorooftop.com menüsü ve Gault & Millau / Oggusto manzaralı restoran rehberleri',
        },
      ],
      suitability: {
        seating: 'Panoramik deniz ve marina manzaralı çatı terası (önceden rezervasyon gerekir)',
        crowdAndNoise: 'Şık akşam yemeği ve özel gün kutlamalarına uygun dingin çatı atmosferi',
        disadvantage: 'Yüksek fiyat seviyesinde otel çatı restoranıdır; günlük hızlı yemek için uygun değildir.',
        transit: 'Fener Kalamış Caddesi üzerindeki Kalamış Marina karşısında kolay ulaşım.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'Ouzo Roof Restaurant Resmi Sitesi',
            url: 'https://www.ouzorooftop.com/',
            date: '2026-11-13',
            kind: 'operator',
            note: 'Kalamış Marina manzaralı çatı terası ve Ege-Yunan menüsü',
          },
          {
            title: 'Oggusto — Deniz Manzaralı Özel Akşam Mekanları',
            url: 'https://www.oggusto.com/',
            date: '2026-09-30',
            kind: 'editorial',
            note: 'Kalamış koyuna bakan nadir çatı terası manzarası ve mezeleriyle seçiliyor',
          },
          {
            title: 'Ekşi Sözlük — Ouzo Roof Kalamış',
            url: 'https://eksisozluk.com/',
            date: '2026-08-21',
            kind: 'community',
            note: 'Gün batımı manzarası ve özel kutlamalar için Anadolu Yakası klasiği',
          },
        ],
        pros: ['Eşsiz Kalamış Marina ve gün batımı çatı manzarası', 'Özenli Ege-Yunan deniz ürünleri'],
        cons: ['Yüksek bütçe seviyesi', 'Rezervasyonsuz manzaralı masa bulmak zor'],
        uncertainties: ['Açık teras düzeni kış aylarında kapalı cam alana dönüşür.'],
      },
    },

    // --- DENEMELİSİN (Erenköy, Fenerbahçe/Kalamış — 3 mekan) ---
    {
      id: 'nearby-kugu-pastanesi-erenkoy',
      placeId: 'ChIJ1fsx_BvHyhQRd3DEM5l9nEQ',
      categoryId: 'denemelisin',
      expectedBrandWord: 'kugu pastanesi',
      chefOrHeritageProtected: true,
      neighborhoodLabelOverride: 'Erenköy, Kadıköy',
      localSignals: ['tarihi-ekler-pastanesi', 'caddebostan-siniri', 'kestane-sekeri'],
      description:
        'Erenköy-Caddebostan hattında on yıllardır günlük taze çikolatalı ekler, profiterol ve geleneksel pasta çeşitleriyle tanınan köklü semt pastanesi.',
      whatToOrder: ['Klasik Çikolatalı Ekler', 'Taze Profiterol', 'Frambuazlı Milföy'],
      menuFrom: ['Kestane Şekeri', 'Badem Ezmesi', 'Çay & Türk Kahvesi'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Tuzlu Çörek Otlu Kurabiye & Klasik Milföy',
          note: 'Tatlı vitrini dışında hediyelik veya çay saati için en çok alınan tuzlu fırın seçkisi.',
          proof: 'Bağdat Caddesi tarihi pastane rehberleri ve yerel müdavim notları',
        },
      ],
      suitability: {
        seating: 'Pastane içi masa oturması yanında ağırlıklı hızlı paket/hediyelik kutu servisi',
        crowdAndNoise: 'Özellikle hafta sonu tatlı kutusu alan müdavimlerle hareketli',
        disadvantage: 'Eski tip klasik pastane atmosferidir; modern üçüncü dalga kafe konforu arayanlara hitap etmeyebilir.',
        transit: 'Kantarcı Rıza Sokak’ta Bağdat Caddesi ve Erenköy-Caddebostan sahili arasında.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'The Magger — Bağdat Caddesi Tarihi Pastaneleri',
            url: 'https://www.themagger.com/',
            date: '2026-08-14',
            kind: 'editorial',
            note: 'Cadde ve Erenköy hattının nesillerdir değişmeyen ekler ve profiterol durağı',
          },
          {
            title: 'Ekşi Sözlük — Kuğu Pastanesi',
            url: 'https://eksisozluk.com/',
            date: '2026-09-18',
            kind: 'community',
            note: 'Taze pastacı kreması ve nostaljik ekleriyle tanınıyor',
          },
        ],
        pros: ['Yarım asrı aşan klasik pastane geleneği', 'Hafif kremalı günlük ekler ve profiterol'],
        cons: ['Klasik küçük dükkan düzeni, API fiyat seviyesi belirtilmemiş'],
        uncertainties: ['Günün ilerleyen saatlerinde popüler tatlı çeşitleri bitebiliyor.'],
      },
    },
    {
      id: 'nearby-ororo-erenkoy',
      placeId: 'ChIJHdqci87HyhQRSoUWP0acmeE',
      categoryId: 'denemelisin',
      expectedBrandWord: 'ororo',
      neighborhoodLabelOverride: 'Erenköy, Kadıköy',
      localSignals: ['anadolu-yakasi-ramen', 'butik-susi', 'japon-sokak-mutfagi'],
      description:
        'Caddebostan-Erenköy sınırında saatlerce kaynatılan et suyu bazlı ramenleri, özel soslu donburi kaseleri ve taze suşileriyle Kadıköy’ün öncü Japon lokantası.',
      whatToOrder: ['Tonkotsu veya Shoyu Ramen', 'Ororo Signature Sushi Roll', 'Katsu Donburi'],
      menuFrom: ['Miso Ramen', 'Edamame', 'Green Tea / Sake'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Buharda/Tavada Gyoza Mantısı & Matcha Tatlısı',
          note: 'Ramen öncesi paylaşılan çıtır altlı gyoza ve yemek sonrası hafif matcha tatlısı.',
          proof: 'ororosushibar.com menüsü ve İstanbul Japon mutfağı seçkileri',
        },
      ],
      suitability: {
        seating: 'Tezgah ve samimi salon oturması; gel-al paket servis mevcut',
        crowdAndNoise: 'Akşamları özellikle ramen sever genç ve yetişkin kitlesiyle dolu',
        disadvantage: 'Küçük butik salonunda akşam saatlerinde kapıda kısa bekleme sırası oluşabiliyor.',
        transit: 'Erenköy Marmaray ve Caddebostan kültür aksı yakınındaki Yener Sokak’ta.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'Ororo Sushi & Ramen Resmi Sitesi',
            url: 'https://www.ororosushibar.com/',
            date: '2026-11-13',
            kind: 'operator',
            note: 'Ramen reçeteleri, sushi roll menüsü ve şube bilgileri',
          },
          {
            title: 'Oggusto — İstanbul’un En İyi Japon Restoranları',
            url: 'https://www.oggusto.com/',
            date: '2026-09-20',
            kind: 'editorial',
            note: 'Anadolu Yakası’nda uzun süredir istikrarını koruyan ramen ve suşi noktası',
          },
        ],
        pros: ['Otantik ramen suyu ve eriştesi', 'Taze suşi ve gyoza çeşitliliği'],
        cons: ['Akşam yoğunluğunda kapıda sıra olabiliyor'],
        uncertainties: ['Özel ramen çeşitleri haftanın belirli günleri sınırlı çıkabilir.'],
      },
    },
    {
      id: 'nearby-todori-fenerbahce',
      placeId: 'ChIJQ-1YXZC4yhQRGLljXaFBQpY',
      categoryId: 'denemelisin',
      expectedBrandWord: 'todori',
      chefOrHeritageProtected: true,
      neighborhoodLabelOverride: 'Fenerbahçe (Kalamış), Kadıköy',
      localSignals: ['tarihi-kosk-meyhane', 'rum-ege-mezeleri', 'kalamis-klasiği'],
      description:
        'Fenerbahçe Kalamış’ta asırlık köşk atmosferi içinde Girit ve Rum mutfağı esintili taze mezeleri, lakerda ve sıcak ara yemekleriyle bilinen köklü meyhane.',
      whatToOrder: ['Todori Topik', 'Girit Ezmesi & Sıcak Lakerda', 'Ahtapot Izgara'],
      menuFrom: ['Arnavut Ciğeri', 'Fava', 'Yaprak Ciğer & Mevsim Balıkları'],
      alsoTry: [],
      secondaryItems: [
        {
          name: 'Fırınlanmış Tahinli Sıcak Helva',
          note: 'Meze ve rakı sofrasının sonunda masa paylaşımına sunulan klasik sıcak helva kapanışı.',
          proof: 'todori.com.tr menüsü ve Kadıköy tarihi meyhane rehberleri',
        },
      ],
      suitability: {
        seating: 'Tarihi köşk salonu ve arka bahçe masa düzeni (akşam rezervasyon önerilir)',
        crowdAndNoise: 'Klasik meyhane sohbetine uygun sıcak ve samimi akşam ortamı',
        disadvantage: 'Üst fiyat seviyesindedir ve hafta sonları rezervasyonsuz masa bulmak güçtür.',
        transit: 'Fener Kalamış Caddesi üzerinde Moda ve Caddebostan arasındaki yürüyüş/ulaşım aksında.',
      },
      beforeYouGo: [],
      dossier: {
        verifiedAt: '2026-11-13',
        sources: [
          {
            title: 'Todori Kalamış Resmi Sitesi',
            url: 'https://www.todori.com.tr/',
            date: '2026-11-13',
            kind: 'operator',
            note: 'Tarihi Kalamış köşkü, topik, Girit ve Rum meze çeşitleri',
          },
          {
            title: 'Harbiyiyorum — İstanbul Tarihi Meyhaneleri',
            url: 'https://harbiyiyorum.com/',
            date: '2026-08-19',
            kind: 'editorial',
            note: 'Anadolu Yakası’nın köklü Kalamış meyhane geleneğini sürdüren mekan',
          },
          {
            title: 'Ekşi Sözlük — Todori Fenerbahçe',
            url: 'https://eksisozluk.com/',
            date: '2026-09-25',
            kind: 'community',
            note: 'Topik, meze çeşitliliği ve köşk bahçesiyle klasikleşmiş adres',
          },
        ],
        pros: ['Tarihi Kalamış köşkü atmosferi', 'Otantik Rum/Ege meze ve ara sıcak seçkisi'],
        cons: ['Üst fiyat segmenti ve hafta sonu rezervasyon ihtiyacı'],
        uncertainties: ['Balık çeşitleri günlük hal durumuna göre değişir.'],
      },
    },
  ],
};
