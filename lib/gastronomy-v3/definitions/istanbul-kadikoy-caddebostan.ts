import { buildRegionCategories } from '../categories';
import type { V3RegionDefinition } from '../types';

export const ISTANBUL_KADIKOY_CADDEBOSTAN_DEF: V3RegionDefinition = {
  id: 'caddebostan-kadikoy',
  slug: 'caddebostan',
  city: 'İstanbul',
  district: 'Kadıköy',
  neighborhood: 'Caddebostan',
  officialQuarter: 'Caddebostan',
  displayName: 'Caddebostan, Kadıköy, İstanbul',
  locative: "Caddebostan'da",
  path: ['istanbul', 'kadikoy', 'caddebostan'],
  aliases: ['Caddebostan', 'Bağdat Caddesi', 'Bagdat Caddesi', 'Kadıköy'],
  scopeNote: 'Caddebostan · Doğrulanmış Yerel Seçki',
  characterSubtitle:
    'Sahil yürüyüş hattında artizan dondurmacılar, şef bistroları, butik burgerciler ve kahve durakları',
  center: { lat: 40.9668, lng: 29.0662 },
  bbox: { minLat: 40.961, maxLat: 40.974, minLng: 29.05, maxLng: 29.076 },
  allowedNeighborhoodTokens: ['Caddebostan'],
  categories: buildRegionCategories(),
  candidates: [
    // --- PİZZA (Caddebostan) ---
    {
      id: 'cadde-casa-mamma',
      placeId: 'ChIJJaF5w_7HyhQRDU2NC0skPXs',
      categoryId: 'pizza',
      localSignals: ['tas-firin', 'italyan-pizzasi', 'mahalle-restorani'],
      description:
        'Caddebostan’da taş fırından ince hamurlu İtalyan pizzaları ve el yapımı taze makarna çeşitleri çıkaran mahalle restoranı.',
      whatToOrder: ['Bufala Mozzarellalı Margherita', 'Trüflü Mantar Pizza', 'Taze Makarna'],
      menuFrom: ['Diavola', 'Quattro Formaggi', 'Tiramisu'],
      alsoTry: ['Sarımsaklı Zeytinyağı Dokunuşu'],
      beforeYouGo: ['Akşam yemeği saatlerinde sahil yürüyüşü öncesi keyifli bir masa sunar.'],
    },
    {
      id: 'cadde-umberto',
      placeId: 'ChIJhcFWf_7HyhQRWCUHUPiX5d0',
      categoryId: 'pizza',
      localSignals: ['sahil-hatti', 'ince-hamur', 'klasik-italyan'],
      description:
        'Caddebostan sahil paralelinde klasik İtalyan mutfağı çizgisinde ince hamurlu taş fırın pizzaları sunan köklü restoran.',
      whatToOrder: ['Füme Etli İtalyan Pizza', 'Margherita', 'Lasagna'],
      menuFrom: ['Prosciutto Crudo', 'Dört Peynirli', 'Panna Cotta'],
      alsoTry: ['Focaccia Ekmek Başlangıcı'],
      beforeYouGo: ['Hafta sonu akşamları için önceden masa ayırtmak rahat ettirir.'],
    },
    {
      id: 'cadde-pizza-locale',
      placeId: 'ChIJ28l73QvHyhQRY7-axq5ZbFE',
      categoryId: 'pizza',
      displayNameOverride: 'Pizza Locale Caddebostan',
      localSignals: ['eksi-maya-hamur', 'bagdat-caddesi', 'citir-taban'],
      description:
        'Bağdat Caddesi hattında ekşi maya hamurlu çıtır pizzaları ve taze malzemeli kombinasyonlarıyla bilinen pizza barı.',
      whatToOrder: ['Kaburgalı Pizza', 'Keçi Peynirli ve Roka Pizza', 'Margherita'],
      menuFrom: ['Trüflü Mantarlı', 'Pesto Soslu Tavuklu'],
      alsoTry: ['Ev Yapımı Acı Yağ'],
      beforeYouGo: ['Paylaşımlı büyük pizzalar iki kişi için oldukça doyurucudur.'],
    },

    // --- HAMBURGER (Caddebostan) ---
    {
      id: 'cadde-fun-bun',
      placeId: 'ChIJDX2kbSLHyhQREg6UGKCmiow',
      categoryId: 'hamburger',
      localSignals: ['ev-yapimi-bun', 'smash-burger', 'cadde-ara-sokak'],
      description:
        'Kendi pişirdiği yumuşacık ekmekler arasına mühürlenmiş sulu smash köfteler koyan Caddebostan burger mutfağı.',
      whatToOrder: ['Fun Bun Double Smash', 'Karamelize Soğanlı Burger', 'Trüflü Patates'],
      menuFrom: ['Classic Cheeseburger', 'Tavuk Burger'],
      alsoTry: ['Ev Yapımı Dip Sos'],
      beforeYouGo: ['Ara sokak konumuyla Bağdat Caddesi kalabalığından uzak hızlı akşam yemeği sunar.'],
    },
    {
      id: 'cadde-youme',
      placeId: 'ChIJP0_FQIrHyhQRcCx5zvRbx4A',
      categoryId: 'hamburger',
      localSignals: ['butik-burger', 'sokak-mutfagi', 'mahalle-mudavimi'],
      description:
        'Caddebostan içinde özgün sos reçeteleri ve günlük hazırlanan burgerleriyle müdavim kitlesi oluşturan nokta.',
      whatToOrder: ['YouMe Signature Burger', 'Cheddar Smash', 'Çıtır Patates'],
      menuFrom: ['Klasik Burger', 'Acılı Jalapeno Burger'],
      alsoTry: ['Soğan Halkası'],
      beforeYouGo: ['Öğle ve akşam saatlerinde sıcak servis için taze basım yapılır.'],
    },
    {
      id: 'cadde-beeves',
      placeId: 'ChIJYQMjwQS4yhQRSRxn1xsuGls',
      categoryId: 'hamburger',
      localSignals: ['dinlendirilmis-et', 'kasap-burger', 'caddebostan-klasigi'],
      description:
        'Dinlendirilmiş kasap etiyle hazırladığı kalın ve sulu burgerleriyle Caddebostan’ın bilinen et ve burger durağı.',
      whatToOrder: ['Beeves Klasik Burger', 'Tütsülenmiş Dana Etli Burger', 'Ev Yapımı Patates'],
      menuFrom: ['Cheeseburger', 'Hot Dog'],
      alsoTry: ['Milkshake'],
      beforeYouGo: ['Et pişirme derecesini sipariş verirken özellikle belirtebilirsiniz.'],
    },
    {
      id: 'cadde-pov',
      placeId: 'ChIJ-VdxKADHyhQRDjxYzVQLiVE',
      categoryId: 'hamburger',
      localSignals: ['citir-kenar-smash', 'truflu-patates', 'ara-sokak'],
      description:
        'Çıtır kenarlı smash köfteleri, erimiş peynir dengesi ve ince kesim patatesleriyle öne çıkan Caddebostan burgercisi.',
      whatToOrder: ['Pov Double Smash', 'Trüflü Parmesan Patates'],
      menuFrom: ['Classic Smash', 'Chili Cheese Burger'],
      alsoTry: ['Ballı Hardal Sos'],
      beforeYouGo: ['Hızlı servis temposuyla akşam geç saatlere kadar sıcak burger alternatifi sunar.'],
    },

    // --- KAHVE (Caddebostan) ---
    {
      id: 'cadde-homestead',
      placeId: 'ChIJ_SIuCR3HyhQRbcWxYQ8YLkQ',
      categoryId: 'kahve',
      localSignals: ['nitelikli-kahve', 'sakin-cadde-kacisi', 'filtre-demleme'],
      description:
        'Caddebostan’da özenle seçilmiş çekirdeklerle demlenen filtre kahveleri, espresso çeşitleri ve sıcak bahçe atmosferiyle öne çıkan kahveci.',
      whatToOrder: ['V60 Filtre Kahve', 'Cortado', 'Bademli Kruvasan'],
      menuFrom: ['Flat White', 'Cold Brew', 'Cookie'],
      alsoTry: ['Espresso Tonik'],
      beforeYouGo: ['Sabah yürüyüşü sonrası kahve ve taze hamur işi molası için sakin bir duraktır.'],
    },
    {
      id: 'cadde-viyana',
      placeId: 'ChIJQUMVCq_HyhQRXv8buuJc6qk',
      categoryId: 'kahve',
      localSignals: ['viyana-usulu-kahve', 'klasik-pasta', 'bagdat-caddesi'],
      description:
        'Bağdat Caddesi hattında klasik Viyana kahve çeşitleri, kremalı kahveler ve günlük dilim pastalar sunan keyifli kahve dükkanı.',
      whatToOrder: ['Viyana Melange', 'San Sebastian veya Çikolatalı Pasta', 'Filtre Kahve'],
      menuFrom: ['Einspanner', 'Mozart Pasta', 'Americano'],
      alsoTry: ['Sıcak Çikolata'],
      beforeYouGo: ['Öğleden sonra kahve-tatlı eşleşmesi için vitrinden günlük pastaları seçebilirsiniz.'],
    },
    {
      id: 'cadde-orbis',
      placeId: 'ChIJnTJKMHTHyhQRLWXJ3x2p_nk',
      categoryId: 'kahve',
      localSignals: ['ucuncu-nesil-kahve', 'mahalle-kahvecisi', 'dengeli-kavrum'],
      description:
        'Plaj Yolu çevresinde üçüncü nesil demleme barı ve rahat oturma düzeniyle semt sakinlerinin tercih ettiği kahve dükkanı.',
      whatToOrder: ['Flat White', 'Soğuk Demleme Filtre', 'Havuçlu Kek'],
      menuFrom: ['Americano', 'Cortado', 'Matcha'],
      alsoTry: ['Yulaflı Kurabiye'],
      beforeYouGo: ['Günün her saatinde hızlı kahve veya sakin çalışma için uygundur.'],
    },
    {
      id: 'cadde-nou',
      placeId: 'ChIJAUTgoprHyhQR-AKQpUdJoKw',
      categoryId: 'kahve',
      localSignals: ['minimalist-bar', 'plaj-yolu', 'gizli-cevher'],
      description:
        'Plaj Yolu’na yakın konumda minimalist tasarımı ve dengeli espresso bazlı içecekleriyle dikkat çeken butik mahalle kahvecisi.',
      whatToOrder: ['Cortado', 'Iced Americano', 'Günlük Tatlı'],
      menuFrom: ['Latte', 'Filtre Kahve', 'Matcha Latte'],
      alsoTry: ['Kurabiye'],
      beforeYouGo: ['Sahile inmeden önce elde kahve alıp yürümek için çok elverişli konumdadır.'],
    },

    // --- DATE MEKANLARI (Caddebostan) ---
    {
      id: 'cadde-catch',
      placeId: 'ChIJcxlGHwbHyhQRx20PWQqhXmk',
      categoryId: 'date',
      localSignals: ['sahil-hatti', 'aksam-bulusmasi', 'kokteyl-ve-tabaklar'],
      description:
        'Caddebostan sahil hattında özenli dünya mutfağı tabakları, paylaşımlı başlangıçlar ve kokteyl barıyla öne çıkan akşam mekanı.',
      whatToOrder: ['Deniz Mahsullü Başlangıçlar', 'Izgara Et Ana Tabak', 'İmza Kokteyller'],
      menuFrom: ['Taze Makarna', 'Beef Tartar'],
      alsoTry: ['Çikolatalı Sufle'],
      beforeYouGo: ['Akşam ve hafta sonu servisi için önceden rezervasyon yaptırmak gereklidir.'],
    },
    {
      id: 'cadde-basta-neo',
      placeId: 'ChIJsWwbo3LHyhQRRrYY1yET2bM',
      categoryId: 'date',
      localSignals: ['sef-bistrosu', 'fransiz-teknigi-yerel-malzeme', 'bilenlerin-gittigi'],
      chefOrHeritageProtected: true,
      description:
        'Fransız mutfak tekniklerini Anadolu’nun yerel ürünleriyle buluşturan mevsimsel menüsüyle Caddebostan’ın önde gelen şef bistrosu.',
      whatToOrder: ['Şefin Mevsimsel Tadım Tabakları', 'Ağır Pişmiş Et', 'Taze Deniz Ürünü'],
      menuFrom: ['Sıcak Humus Yataklı Et', 'Fırınlanmış Kemik İliği'],
      alsoTry: ['Şarap Eşleşmesi'],
      beforeYouGo: ['Hem bar tezgahı hem masa düzeni vardır; akşam yemeği için rezervasyon önerilir.'],
    },
    {
      id: 'cadde-ororo',
      placeId: 'ChIJHdqci87HyhQRSoUWP0acmeE',
      categoryId: 'date',
      displayNameOverride: 'orōro Japanese Eatery',
      localSignals: ['ramen-ve-sushi', 'zarif-japon-mutfagi', 'bistro-atmosferi'],
      description:
        'El yapımı taze eriştesiyle hazırlanan ramen kaseleri, gyoza çeşitleri ve taze sushi tabaklarıyla bilinen Japon restoranı.',
      whatToOrder: ['Tonkotsu veya Miso Ramen', 'Çıtır Gyoza', 'Özel Sushi Roll'],
      menuFrom: ['Edamame', 'Salmon Sashimi', 'Mochi'],
      alsoTry: ['Yuzu Limonata'],
      beforeYouGo: ['Küçük gruplar ve ikili akşam yemekleri için akşam saatlerinde rezervasyon iyi olur.'],
    },

    // --- KAHVALTI KONTROL (Caddebostan'da ★4.4+ nitelikli kahvaltıcı yoksa otomatik budanır) ---
    {
      id: 'ctrl-cadde-laktea',
      placeId: 'ChIJ60TeUWjHyhQR8D3u-EZtd3s',
      categoryId: 'kahvalti',
      localSignals: ['kontrol-kahvalti'],
      description: 'Kontrol adayı.',
      whatToOrder: [],
      menuFrom: [],
      alsoTry: [],
      beforeYouGo: [],
    },
    {
      id: 'ctrl-cadde-sour-sweet',
      placeId: 'ChIJO7TOb3bHyhQRk4om2OPpTeU',
      categoryId: 'kahvalti',
      localSignals: ['kontrol-kahvalti'],
      description: 'Kontrol adayı.',
      whatToOrder: [],
      menuFrom: [],
      alsoTry: [],
      beforeYouGo: [],
    },

    // --- DENEMELİSİN / BÖLGEYE ÖZGÜ (Caddebostan) ---
    {
      id: 'cadde-fistik',
      placeId: 'ChIJM_Oq3LbHyhQRClcniktbjfo',
      categoryId: 'denemelisin',
      displayNameOverride: 'Fıştık Cadde',
      localSignals: ['antep-fistigi-uzmani', 'artizan-tatli', 'butik-dondurma'],
      description:
        'Antep fıstığı bazlı yoğun lezzetler, fıstıklı tatlılar ve dondurmalar üreten uzman tatlı atölyesi.',
      whatToOrder: ['Saf Antep Fıstıklı Gelato', 'Fıstıklı Tart veya Pasta', 'Fıstık Ezmesi'],
      menuFrom: ['Çikolatalı Fıstıklı Tatlı', 'Türk Kahvesi'],
      alsoTry: ['Fıstıklı Krokan'],
      beforeYouGo: ['Fıstık severler için akşam sahil yürüyüşü öncesi tatlı molasında öne çıkar.'],
    },
    {
      id: 'cadde-cremeria-milano',
      placeId: 'ChIJAxjDNbrHyhQRY_udoV2EZvY',
      categoryId: 'denemelisin',
      displayNameOverride: 'Cremeria Milano Caddebostan',
      localSignals: ['italyan-gelato', 'plaj-yolu', 'gunluk-taze-uretim'],
      description:
        'Plaj Yolu üzerinde her gün taze süt ve meyvelerle küçük partiler halinde İtalyan gelato üreten köşe dondurmacısı.',
      whatToOrder: ['Cremino veya Gianduja Gelato', 'Fıstıklı Gelato', 'Mevsim Sorbesi'],
      menuFrom: ['Stracciatella', 'Fındıklı Nocciola'],
      alsoTry: ['Taze Pişmiş Külah'],
      beforeYouGo: ['Yaz akşamları sahile inenlerin vazgeçilmez tatlı durağıdır; sıra hızlı ilerler.'],
    },
    {
      id: 'cadde-vero-gelato',
      placeId: 'ChIJAR0yaXbHyhQRv_4FJN_UL8I',
      categoryId: 'denemelisin',
      localSignals: ['dogal-sut-gelato', 'mevsim-meyveli-sorbe', 'mahalle-dondurmacisi'],
      description:
        'Katkısız taze süt ve mevsim meyveleriyle yoğun aromalı İtalyan usulü dondurma ve sorbeler çıkaran Caddebostan dondurmacısı.',
      whatToOrder: ['Kavrulmuş Fındıklı Gelato', 'Bitter Çikolata Sorbe', 'Mevsim Meyveli Sorbe'],
      menuFrom: ['Karamelli Bisküvi', 'Antep Fıstığı'],
      alsoTry: ['Külah veya Kapta İkili Top'],
      beforeYouGo: ['Seçim öncesi küçük tatma kaşığı ile aromaları deneyebilirsiniz.'],
    },
    {
      id: 'cadde-tiftik',
      placeId: 'ChIJ59c4JTDHyhQRFr5Pc97zfpE',
      categoryId: 'denemelisin',
      localSignals: ['agir-ates-tiftik-et', 'sokak-sandvici', 'hizli-oglen'],
      description:
        'Ağır ateşte saatlerce pişmiş tiftik dana ve kaburga etlerini taze sandviç ve kaselere dönüştüren sokak mutfağı.',
      whatToOrder: ['Tiftik Dana Sandviç', 'Barbekü Kaburga Kase', 'Çıtır Patates'],
      menuFrom: ['Karamelize Soğanlı Dürüm', 'Meksika Soslu Tiftik'],
      alsoTry: ['Ev Yapımı Turşu'],
      beforeYouGo: ['Hızlı ama doyurucu bir öğle veya akşam yemeği arayanlar için idealdir.'],
    },
  ],
};
