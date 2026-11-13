import { buildRegionCategories } from '../categories';
import type { V3RegionDefinition } from '../types';

export const ISTANBUL_KADIKOY_SUADIYE_DEF: V3RegionDefinition = {
  id: 'suadiye-kadikoy',
  slug: 'suadiye',
  city: 'İstanbul',
  district: 'Kadıköy',
  neighborhood: 'Suadiye',
  officialQuarter: 'Suadiye',
  displayName: 'Suadiye, Kadıköy, İstanbul',
  locative: "Suadiye'de",
  path: ['istanbul', 'kadikoy', 'suadiye'],
  aliases: ['Suadiye', 'Şaşkınbakkal', 'Saskinbakkal', 'Bağdat Caddesi', 'Kadıköy'],
  scopeNote: 'Suadiye · Doğrulanmış Yerel Seçki',
  characterSubtitle:
    'Şaşkınbakkal’dan Suadiye sahiline uzanan hatta şef restoranları, taş fırın pizzacılar ve köklü profiterol geleneği',
  center: { lat: 40.961, lng: 29.0815 },
  bbox: { minLat: 40.9555, maxLat: 40.9675, minLng: 29.0715, maxLng: 29.091 },
  allowedNeighborhoodTokens: ['Suadiye'],
  categories: buildRegionCategories(),
  candidates: [
    // --- PİZZA (Suadiye) ---
    {
      id: 'sua-valerino',
      placeId: 'ChIJWXCUas3HyhQRLFG19V7fRN8',
      categoryId: 'pizza',
      displayNameOverride: 'Valerino Napoli Pizza',
      localSignals: ['odun-firini-napoli', 'yuksek-isi-pisim', 'butik-pizzaci'],
      description:
        'Suadiye’de yüksek ısılı fırından ince orta ve kabarık kenarlı otantik Napoli pizzaları çıkaran butik pizzacı.',
      whatToOrder: ['Margherita Verace', 'Diavola Napoli', 'Burrata & Fesleğen Pizza'],
      menuFrom: ['Marinara', 'Prosciutto Crudo', 'Tiramisu'],
      alsoTry: ['Sarımsaklı Zeytinyağı'],
      beforeYouGo: ['Akşam saatlerinde fırından yeni çıkmış pizzaları salonda taze tüketmek fark yaratır.'],
    },
    {
      id: 'sua-new-yorker',
      placeId: 'ChIJiyrATgvHyhQRZWakHT8_pRU',
      categoryId: 'pizza',
      localSignals: ['new-york-usulu', 'ince-genis-dilim', 'citir-taban'],
      description:
        'Suadiye’de ince, geniş dilimli ve altı çıtır New York usulü pizzalarıyla bilinen özgün pizza durağı.',
      whatToOrder: ['Classic Pepperoni NY', 'Dört Peynirli Beyaz Pizza', 'Margherita'],
      menuFrom: ['Mantarlı & Trüflü', 'Acı Ballı Pepperoni'],
      alsoTry: ['Ranch veya Sarımsaklı Dip'],
      beforeYouGo: ['Büyük dilimler ve yarım-yarım pizza seçimi iki kişilik paylaşım için oldukça uygundur.'],
    },
    {
      id: 'sua-pizzall',
      placeId: 'ChIJp4C127_HyhQRcmh0f4Gla2o',
      categoryId: 'pizza',
      displayNameOverride: 'Pizz’All Suadiye',
      localSignals: ['eksi-mayali-hamur', 'mahalle-pizzacisi', 'taze-malzeme'],
      description:
        'Suadiye ara sokaklarında uzun mayalı hamur ve bol İtalyan peynirleriyle günlük pizza pişiren sakin mahalle pizzacısı.',
      whatToOrder: ['Füme Kaburgalı Pizza', 'Margherita', 'Roast Beef & Roka Pizza'],
      menuFrom: ['Funghi', 'Quattro Formaggi'],
      alsoTry: ['Ev Yapımı Acı Yağ'],
      beforeYouGo: ['Sakin akşam yemeği veya eve sıcak sipariş için semt içi hızlı servis sunar.'],
    },

    // --- HAMBURGER (Suadiye) ---
    {
      id: 'sua-3monkeys',
      placeId: 'ChIJF7UlovbHyhQRWvk4mey9W3I',
      categoryId: 'hamburger',
      displayNameOverride: '3 Monkey’s Burger',
      localSignals: ['saskinbakkal-suadiye-hatti', 'sulu-smash', 'cadde-klasigi'],
      description:
        'Şaşkınbakkal-Suadiye hattında dengeli köfte-ekmek oranı, ev sosları ve karamelize soğanıyla semtin öne çıkan burgercisi.',
      whatToOrder: ['3 Monkey’s Signature Burger', 'Double Smash Cheddar', 'Çıtır Patates'],
      menuFrom: ['Truffle Burger', 'BBQ Kaburga Burger'],
      alsoTry: ['Çıtır Soğan Halkası'],
      beforeYouGo: ['Özellikle hafta sonu akşamları kalabalık olabildiği için erken akşam saatleri daha rahattır.'],
    },
    {
      id: 'sua-house-of-b',
      placeId: 'ChIJlfKMKL3HyhQRGzxSxI6_WlA',
      categoryId: 'hamburger',
      localSignals: ['bagdat-caddesi-klasigi', 'karamelize-sogan', 'kasap-burger'],
      description:
        'Bağdat Caddesi Suadiye durağında özel karamelize soğanı, kalın köftesi ve klasik soslarıyla yıllardır tercih edilen burgerci.',
      whatToOrder: ['HOB Classic Burger', 'Bacon & Mushroom Burger', 'İnce Kesim Patates'],
      menuFrom: ['Blue Cheese Burger', 'Sloppy Joe'],
      alsoTry: ['Vanilya Milkshake'],
      beforeYouGo: ['Akşam saatlerinde masa bekleme olasılığına karşı erken gitmek yararlıdır.'],
    },
    {
      id: 'sua-smash-up',
      placeId: 'ChIJHeqAiEfHyhQRu4whefCFQ1w',
      categoryId: 'hamburger',
      localSignals: ['citir-kenar-smash', 'butik-dükkan', 'hizli-servis'],
      description:
        'Suadiye’de sıcak döküm tavada basılan çıtır kenarlı smash köfteleri ve taze patatesleriyle odaklanmış modern burger noktası.',
      whatToOrder: ['Smash Up Double', 'Trüflü Smash', 'Peynirli Patates'],
      menuFrom: ['Classic Cheeseburger', 'Acılı Jalapeno Smash'],
      alsoTry: ['Ev Yapımı Turşu'],
      beforeYouGo: ['Kompakt yapısıyla hızlı ve sıcak burger molası için uygundur.'],
    },
    {
      id: 'sua-bon',
      placeId: 'ChIJvfALitTHyhQRtLNSG6kzd9s',
      categoryId: 'hamburger',
      localSignals: ['taze-cekim-et', 'baharatli-patates', 'mahalle-burgercisi'],
      description:
        'Günlük çekim dana eti, tereyağlı yumuşak ekmekler ve ev yapımı patates kızartması sunan Suadiye burger durağı.',
      whatToOrder: ['Bon Özel Burger', 'Cheeseburger', 'Baharatlı Patates'],
      menuFrom: ['Mantarlı Burger', 'Çıtır Tavuk Burger'],
      alsoTry: ['Sarımsaklı Mayonez'],
      beforeYouGo: ['Sahil tarafına yakın konumuyla yürüyüş öncesi ya da sonrası uğranabilir.'],
    },

    // --- KAHVE (Suadiye) ---
    {
      id: 'sua-risto',
      placeId: 'ChIJAQHeBUrHyhQR5TI9WUlbQog',
      categoryId: 'kahve',
      localSignals: ['nitelikli-kahve', 'suadiye-mudavimi', 'dengeli-espresso'],
      description:
        'Suadiye sokakları arasında taze çekirdek demlemeleri, dengeli espresso bazlı içecekleri ve sakin ortamıyla sevilen mahalle kahvecisi.',
      whatToOrder: ['V60 Filtre Kahve', 'Cortado', 'Günlük Kek veya Kurabiye'],
      menuFrom: ['Flat White', 'Iced Americano', 'Cold Brew'],
      alsoTry: ['Matcha Latte'],
      beforeYouGo: ['Sabah erken saatlerde kahve ve sakin sokak havası için oldukça elverişlidir.'],
    },
    {
      id: 'sua-golden-horse',
      placeId: 'ChIJX3GtzX3HyhQRpZwjksSra_o',
      categoryId: 'kahve',
      localSignals: ['ara-sokak-kahvecisi', 'sakin-bar', 'ucuncu-nesil'],
      description:
        'Cadde gürültüsünden bir sokak içeride nitelikli espresso, demleme kahve ve taze atıştırmalıklar sunan butik kahve durağı.',
      whatToOrder: ['Flat White', 'Filtre Kahve', 'Bademli Kruvasan'],
      menuFrom: ['Cortado', 'Americano', 'Cheesecake'],
      alsoTry: ['Espresso Tonik'],
      beforeYouGo: ['Sakin sohbet ve bilgisayar başında kısa çalışma için rahat oturum sağlar.'],
    },
    {
      id: 'sua-loba',
      placeId: 'ChIJvZSntErHyhQR12RBKUJ0Jhg',
      categoryId: 'kahve',
      localSignals: ['kahve-ve-firin', 'taze-kruvasan', 'saskinbakkal-suadiye'],
      description:
        'Şaşkınbakkal-Suadiye geçişinde taze fırın ürünleri ve kruvasan eşliğinde nitelikli kahve hazırlayan mahalle mekanı.',
      whatToOrder: ['Tereyağlı Kruvasan & Latte', 'Filtre Kahve', 'Fırın Sandviç'],
      menuFrom: ['Cortado', 'Pain au Chocolat', 'Granola'],
      alsoTry: ['Soğuk Demleme'],
      beforeYouGo: ['Sabah fırından yeni çıkan ürünlerle kahve eşleşmesi yapmak için sabah saatleri idealdir.'],
    },

    // --- DATE MEKANLARI (Suadiye) ---
    {
      id: 'sua-machi',
      placeId: 'ChIJVfGzawHHyhQR277tWW2KFPE',
      categoryId: 'date',
      localSignals: ['japon-peru-mutfagi', 'paylasimli-tabaklar', 'imza-kokteyller'],
      description:
        'Japon ve Peru mutfaklarını (Nikkei) buluşturan paylaşımlı tabakları, taze sashimi seçkisi ve imza kokteylleriyle şık akşam restoranı.',
      whatToOrder: ['Tiradito ve Ceviche', 'Özel Sushi Roll Seçkisi', 'Robata Izgara Tabaklar'],
      menuFrom: ['Tataki', 'Gyoza', 'Matcha Tatlısı'],
      alsoTry: ['Yuzu Bazlı Kokteyller'],
      beforeYouGo: ['Akşam ve hafta sonu servisi için günler öncesinden rezervasyon yaptırmak gerekir.'],
    },
    {
      id: 'sua-townhouse',
      placeId: 'ChIJmwXY2G7HyhQRPHQkdZ3PjWU',
      categoryId: 'date',
      localSignals: ['plaj-yolu', 'sik-brasserie', 'kokteyl-bar'],
      description:
        'Plaj Yolu köşesinde loş ve zarif salonu, taş fırın yemekleri ve kokteyl barıyla Suadiye’nin öne çıkan akşam buluşma noktası.',
      whatToOrder: ['Odun Fırınından Paylaşımlı Tabaklar', 'Izgara Bonfile', 'Bar Kokteylleri'],
      menuFrom: ['Taze Makarna', 'Trüflü Patates', 'Tiramisu'],
      alsoTry: ['Başlangıç Tartine'],
      beforeYouGo: ['Bar veya bahçe masaları için akşam saatleri öncesi rezervasyon önerilir.'],
    },
    {
      id: 'sua-strada',
      placeId: 'ChIJVxbHjk3HyhQRJ--Ayf_IR6A',
      categoryId: 'date',
      localSignals: ['bagdat-caddesi-klasiği', 'dunya-mutfagi', 'aksam-brasserie'],
      description:
        'Bağdat Caddesi Suadiye merkezinde taş fırın lezzetleri, sushi barı ve dünya mutfağıyla akşam yemeklerinin köklü brasserie adresi.',
      whatToOrder: ['Odun Fırını Tabaklar', 'Dana Bonfile veya Somon', 'İmza Tatlılar'],
      menuFrom: ['Strada Salata', 'Sushi Çeşitleri'],
      alsoTry: ['Kokteyl Menüsü'],
      beforeYouGo: ['Cuma ve cumartesi akşamları kalabalık olduğundan rezervasyon yaptırmak rahat ettirir.'],
    },
    {
      id: 'sua-allen',
      placeId: 'ChIJ85EKhlzHyhQRr9GTK6nW8GA',
      categoryId: 'date',
      localSignals: ['modern-bistro', 'kokteyl-ve-mutfak', 'suadiye-sahil'],
      description:
        'Suadiye sahil hattına yakın konumda özenli modern bistro yemekleri ve kokteyl barı sunan dinamik akşam restoranı.',
      whatToOrder: ['Paylaşımlı Ara Sıcaklar', 'Mevsimsel Ana Yemek', 'Kokteyller'],
      menuFrom: ['El Yapımı Makarna', 'Deniz Mahsullü Tabak'],
      alsoTry: ['Günün Tatlısı'],
      beforeYouGo: ['Hafta sonu akşamları yemek sonrası bar atmosferiyle de hareketlidir.'],
    },

    // --- KAHVALTI (Suadiye) ---
    {
      id: 'sua-cesme-bazlama',
      placeId: 'ChIJWbt6HVzHyhQR2_DwbbWCoLk',
      categoryId: 'kahvalti',
      localSignals: ['bahceli-kosk', 'sicak-bazlama', 'ege-kahvaltisi'],
      description:
        'Şaşkınbakkal-Suadiye hattındaki geniş bahçeli köşkte sıcak bazlama, ev yapımı Ege reçelleri ve sınırsız çay eşliğinde serpme kahvaltı.',
      whatToOrder: ['Sıcak Tereyağlı Bazlama', 'Ev Yapımı Reçel & Kaymak', 'Çemen ve Otlu Peynirler'],
      menuFrom: ['Sahanda Yumurta', 'Menemen', 'Pişi'],
      alsoTry: ['Limonlu İncir Reçeli'],
      beforeYouGo: ['Özellikle hafta sonları çok talep gördüğü için sabah erken saatlerde gitmek bekleme süresini azaltır.'],
    },
    {
      id: 'sua-kukis',
      placeId: 'ChIJx_lMzqLHyhQRIqSF92VZPf4',
      categoryId: 'kahvalti',
      localSignals: ['koklu-suadiye-firini', 'sicak-kruvasan', 'brioche'],
      description:
        'Suadiye’nin yıllardır bilinen köklü fırın-pastanesi olarak sabah saatlerinde sıcak kruvasanlar, brioche sandviçler ve poğaçalar çıkarır.',
      whatToOrder: ['Tereyağlı Sıcak Kruvasan', 'Kahvaltılık Fırın Sandviç', 'Demleme Çay'],
      menuFrom: ['Tahinli Çörek', 'Peynirli Poğaça', 'Filtre Kahve'],
      alsoTry: ['Ev Yapımı Limonata'],
      beforeYouGo: ['Sabah tezgahından yeni çıkan taze poğaça ve kruvasanlar için 09:00–11:00 arası en zengin saattir.'],
    },

    // --- DENEMELİSİN / BÖLGEYE ÖZGÜ (Suadiye) ---
    {
      id: 'sua-nazar',
      placeId: 'ChIJ8eIgzr_HyhQR_UP5Up7bKX8',
      categoryId: 'denemelisin',
      displayNameOverride: 'Nazar Pastanesi Suadiye',
      localSignals: ['profiterol-klasigi', 'suadiye-mirasi', 'taze-cikolata-sos'],
      chefOrHeritageProtected: true,
      description:
        'Suadiye’nin yıllardır değişmeyen tatlı durağı olarak günlük şu hamuru ve yoğun bitter çikolata sosuyla hazırlanan profiterolüyle ünlüdür.',
      whatToOrder: ['Klasik Profiterol', 'Taze Ekler Çeşitleri', 'Çikolatalı Pasta'],
      menuFrom: ['Sütlaç', 'Supangle', 'Kurabiye Çeşitleri'],
      alsoTry: ['Fıstıklı Ekler'],
      beforeYouGo: ['Akşam yemeği sonrası paket profiterol almak semtin klasik alışkanlıklarındandır.'],
    },
    {
      id: 'sua-milkne',
      placeId: 'ChIJPTMUBNPHyhQRZnykZprjCv4',
      categoryId: 'denemelisin',
      localSignals: ['jersey-sutu-dondurma', 'katkisiz-artizan', 'mevsim-sorbe'],
      description:
        'Jersey ineklerinin tam yağlı sütü ve gerçek meyve püreleriyle katkısız, düşük şekerli artizan dondurma üreten Suadiye dondurmacısı.',
      whatToOrder: ['Fior di Latte (Sade Jersey Sütlü)', 'Antep Fıstığı', 'Mevsim Meyveli Sorbe'],
      menuFrom: ['Kavrulmuş Fındık', 'Bitter Çikolata'],
      alsoTry: ['Dondurma & Espresso Affogato'],
      beforeYouGo: ['Günlük değişen mevsim aromaları için tezgah başından küçük tatma isteyebilirsiniz.'],
    },
    {
      id: 'sua-envai',
      placeId: 'ChIJ_4ZvTE_HyhQRztyDCfBIgiU',
      categoryId: 'denemelisin',
      localSignals: ['sokak-lezzetleri', 'gece-klasiği', 'kokorec-ve-sandvic'],
      description:
        'Şaşkınbakkal-Suadiye geçişinde temiz tezgahı, süt kuzu kokoreci ve çeşitlendirilmiş sokak sandviçleriyle gece boyu tercih edilen lezzet noktası.',
      whatToOrder: ['İri Kıyım Kuzu Kokoreç', 'Midye Dolma', 'Özel Soslu Sokak Sandviçi'],
      menuFrom: ['Uykuluk', 'Tantuni Çeşitleri'],
      alsoTry: ['Açık Ayran'],
      beforeYouGo: ['Akşam ve gece yürüyüşleri sonrasında hızlı ve sıcak sokak lezzeti için uğranabilir.'],
    },
  ],
};
