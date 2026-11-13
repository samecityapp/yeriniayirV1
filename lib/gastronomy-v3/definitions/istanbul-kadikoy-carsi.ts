import { buildRegionCategories } from '../categories';
import type { V3RegionDefinition } from '../types';

export const ISTANBUL_KADIKOY_CARSI_DEF: V3RegionDefinition = {
  id: 'carsi-osmanaga-kadikoy',
  slug: 'kadikoy-carsi',
  city: 'İstanbul',
  district: 'Kadıköy',
  neighborhood: 'Kadıköy Çarşı',
  officialQuarter: 'Osmanağa & Tarihi Çarşı',
  displayName: 'Kadıköy Çarşı, Kadıköy, İstanbul',
  locative: "Kadıköy Çarşı'da",
  path: ['istanbul', 'kadikoy', 'carsi'],
  aliases: ['Kadıköy Çarşı', 'Osmanağa', 'Osmanaga', 'Tarihi Çarşı', 'Bahariye', 'Kadıköy'],
  scopeNote: 'Tarihi Çarşı & Osmanağa · Doğrulanmış Yerel Seçki',
  characterSubtitle:
    'Asırlık çarşı klasikleri, odun fırını pizzacılar, ara sokak kahve bahçeleri ve akşam sofraları',
  center: { lat: 40.9898, lng: 29.0268 },
  bbox: { minLat: 40.984, maxLat: 40.9935, minLng: 29.0225, maxLng: 29.0345 },
  excludeBbox: { minLat: 40.977, maxLat: 40.988, minLng: 29.02, maxLng: 29.0295 },
  allowedNeighborhoodTokens: ['Osmanağa', 'Caferağa'],
  categories: buildRegionCategories(),
  candidates: [
    // --- PİZZA (Osmanağa & Tarihi Çarşı) ---
    {
      id: 'carsi-costiera',
      placeId: 'ChIJueFFow65yhQRgoSazfK1RkU',
      categoryId: 'pizza',
      localSignals: ['napoli-pizzasi', 'uzun-mayalama', 'gizli-cevher'],
      description:
        'Osmanağa ara sokaklarında uzun fermantasyonlu ince hamur ve İtalyan malzemeleriyle Napoli pizzası çıkaran butik dükkan.',
      whatToOrder: ['Burrata ve Roka Pizza', 'Margherita Napoli', 'Diavola'],
      menuFrom: ['Marinara', 'Prosciutto e Funghi', 'Tiramisu'],
      alsoTry: ['Acı Zeytinyağı Sosu'],
      beforeYouGo: ['Küçük bir tezgah ve sınırlı oturma alanı olduğu için öğle ve erken akşam saatleri daha rahattır.'],
    },
    {
      id: 'carsi-cotti-cotti',
      placeId: 'ChIJVatNg9i5yhQRHdOLhvDvZp4',
      categoryId: 'pizza',
      localSignals: ['fermente-hamur', 'tas-firin', 'mahalle-pizzacisi'],
      description:
        'Söğütlüçeşme-Osmanağa aksında hafif ve kabarık kenarlı fermente hamurla İtalyan pizzaları sunan sıcak mahalle pizzacısı.',
      whatToOrder: ['Dört Peynirli Pizza', 'Füme Kaburgalı Pizza', 'Margherita'],
      menuFrom: ['Bresaola ve Roka Pizza', 'Focaccia Başlangıç'],
      alsoTry: ['Ev Yapımı Tiramisu'],
      beforeYouGo: ['Bütün pizza siparişi öncesinde kenar kalınlığı için fırın süresini sormak yararlıdır.'],
    },
    {
      id: 'carsi-pizzitalia',
      placeId: 'ChIJCVOKt2G5yhQRR-ooW_uxI_I',
      categoryId: 'pizza',
      localSignals: ['dilim-ve-butun-pizza', 'carsi-icinde', 'tas-firin'],
      description:
        'Kadıköy Çarşı içinde taş fırından taze çıkan İtalyan dilim ve bütün pizzalarıyla bilinen hareketli sokak noktası.',
      whatToOrder: ['Mortadella ve Fıstıklı Pizza', 'Klasik Margherita', 'Acılı Sucuklu Pizza'],
      menuFrom: ['Mantar ve Trüflü Pizza', 'Focaccia Sandviç'],
      alsoTry: ['Soğuk İtalyan Soda'],
      beforeYouGo: ['Çarşı yürüyüşü sırasında hızlı dilim molası veya ayaküstü atıştırma için uygundur.'],
    },
    {
      id: 'carsi-il-pellicano',
      placeId: 'ChIJf4xTk2O4yhQRT1INy_MQg-8',
      categoryId: 'pizza',
      localSignals: ['suda-mozzarella', 'odun-firini', 'bahariye-klasigi'],
      description:
        'Bahariye’nin paralel sokağında İtalyan tipi un, suda mozzarella ve odun fırını tekniğiyle Napoli pizzaları pişiren köklü mekan.',
      whatToOrder: ['Margherita Bufala', 'Bresaola ve Parmesanlı Pizza', 'Calzone'],
      menuFrom: ['Marinara', 'Funghi Porcini', 'Panna Cotta'],
      alsoTry: ['Acı Biber Reçelli Pizza'],
      beforeYouGo: ['Masa sayısı kısıtlı olduğundan özellikle hafta sonu akşamlarında sıra beklemek gerekebilir.'],
    },

    // --- HAMBURGER (Osmanağa & Tarihi Çarşı) ---
    {
      id: 'carsi-neva-burger',
      placeId: 'ChIJ4RaAAQC5yhQRYF4-hQbPbNI',
      categoryId: 'hamburger',
      displayNameOverride: 'Neva Burger',
      localSignals: ['gunluk-cekim-et', 'sulu-smash', 'gizli-cevher'],
      description:
        'Osmanağa’da günlük çekim dana köfte, karamelize soğan ve ev yapımı soslarla hazırlanan özenli smash burger mutfağı.',
      whatToOrder: ['Neva Smash Double', 'Truffle Mushroom Burger', 'Çıtır Patates'],
      menuFrom: ['Klasik Cheeseburger', 'BBQ Bacon Burger'],
      alsoTry: ['Ev Yapımı Ranch Sos'],
      beforeYouGo: ['Siparişler taze basılıp hazırlandığı için öğle ve akşam yoğunluğunda kısa hazırlık süresi vardır.'],
    },
    {
      id: 'carsi-musqa-burger',
      placeId: 'ChIJdbn155a5yhQR98a8fTWW2lM',
      categoryId: 'hamburger',
      localSignals: ['el-yapimi-burger', 'ev-sosu', 'ara-sokak'],
      description:
        'Bahariye sokakları arasında el yapımı burger köftesi ve özel sos dengesiyle öne çıkan samimi burger noktası.',
      whatToOrder: ['Musqa Özel Burger', 'Cheddarlı Smash Burger', 'Baharatlı Patates'],
      menuFrom: ['Klasik Burger', 'Çıtır Tavuk Burger'],
      alsoTry: ['Karamelize Soğanlı Ek'],
      beforeYouGo: ['Sıcak servis için yemek saatleri dışında bile taze pişirim yapılmaktadır.'],
    },

    // --- KAHVE (Osmanağa & Tarihi Çarşı) ---
    {
      id: 'carsi-archa-coffee',
      placeId: 'ChIJG18tu2-5yhQRcP6TAIV7xco',
      categoryId: 'kahve',
      localSignals: ['gizli-avlu-bahce', 'nitelikli-kahve', 'fırın-eslesmesi'],
      description:
        'Kadıköy Çarşı kalabalığının ardında saklı yeşil avlusu, taze fırın ürünleri ve nitelikli demlemeleriyle nefes aldıran bahçe kafe.',
      whatToOrder: ['V60 Filtre Kahve', 'Cortado', 'San Sebastian veya Günlük Kek'],
      menuFrom: ['Flat White', 'Cold Brew', 'Taze Kruvasan'],
      alsoTry: ['Iced Americano'],
      beforeYouGo: ['Çarşı içinde sakin ve ağaçlıklı bahçe arayanlar için sabah ve öğle saatleri çok keyiflidir.'],
    },
    {
      id: 'carsi-gua-coffee',
      placeId: 'ChIJKUABnUq5yhQRb1lm_K07A6M',
      categoryId: 'kahve',
      localSignals: ['nitelikli-espresso', 'sakin-bar', 'ara-sokak-kahvecisi'],
      description:
        'Osmanağa’da özenli kavrum çekirdeklerle demlenen filtre kahveler, dengeli sütlü içecekler ve günlük tatlılar sunan kahve dükkanı.',
      whatToOrder: ['Flat White', 'Filtre Kahve', 'Bademli Kurabiye'],
      menuFrom: ['Espresso', 'Cortado', 'Matcha Latte'],
      alsoTry: ['Soğuk Demleme'],
      beforeYouGo: ['Küçük sokak masaları sohbet veya kısa kahve molası için oldukça sakindir.'],
    },

    // --- DATE MEKANLARI (Osmanağa & Tarihi Çarşı) ---
    {
      id: 'carsi-ala-meyhane',
      placeId: 'ChIJQfS802e4yhQR_noYRaE-Y94',
      categoryId: 'date',
      localSignals: ['carsi-meyhanesi', 'ege-anadolu-mezeleri', 'aksam-sofrasi'],
      description:
        'Tarihi Kadıköy Çarşısı sokaklarında günlük taze Ege ve Anadolu mezelerini özenli akşam servisiyle buluşturan meyhane.',
      whatToOrder: ['Girit Ezmesi ve Köpoğlu', 'Ara Sıcak Yaprak Ciğer veya Kalamar', 'Izgara Et'],
      menuFrom: ['Lakerda', 'Atom', 'Fava'],
      alsoTry: ['Tahinli Haydari'],
      beforeYouGo: ['Akşam saatlerinde sokak ve iç masa kapasitesi hızla dolduğu için rezervasyon önerilir.'],
    },
    {
      id: 'carsi-porta-rossa',
      placeId: 'ChIJLyFAWAm5yhQRFjCQR5ZMDxs',
      categoryId: 'date',
      localSignals: ['mum-isikli-sarap-evi', 'peynir-eslesmesi', 'samimi-atmosfer'],
      description:
        'Çarşı-Bahariye arasında loş ışıklı atmosferi, geniş şarap kavı ve özenli peynir tabaklarıyla tanınan butik şarap evi.',
      whatToOrder: ['Yerli ve Yabancı Peynir Tabağı', 'Kadeh veya Şişe Şarap Eşleşmesi'],
      menuFrom: ['Bruschetta Çeşitleri', 'Füme Et Tabağı'],
      alsoTry: ['İncirli Maskarpone Tabak'],
      beforeYouGo: ['Hafta sonu akşamları için önceden masa ayırtmak yer bulmayı garantiler.'],
    },
    {
      id: 'carsi-bordo',
      placeId: 'ChIJwRwx42a4yhQR8nbkPOlaeG0',
      categoryId: 'date',
      localSignals: ['butik-ureticiler', 'saraphane', 'sakin-sohbet'],
      description:
        'Osmanağa’da yerel butik şarap üreticilerinin şişelerini ve sıcak meze eşlikçilerini samimi ortamda sunan mahalle şaraphanesi.',
      whatToOrder: ['Yerli Butik Kupaşlar', 'Şarküteri ve Peynir Tabağı'],
      menuFrom: ['Sıcak Ot Kavurma', 'Zeytin Tabağı'],
      alsoTry: ['Günün Kadeh Seçkisi'],
      beforeYouGo: ['Bar ekibinden damak tadına göre yerli üretici şarap önerisi almak keyiflidir.'],
    },

    // --- KAHVALTI (Osmanağa) ---
    {
      id: 'carsi-lil-bake',
      placeId: 'ChIJo14we3W5yhQRIY5EZ-6H4nc',
      categoryId: 'kahvalti',
      displayNameOverride: 'Lil Bake',
      localSignals: ['brioche-sandvic', 'kahvalti-klasigi', 'taze-hamur-isi'],
      description:
        'Osmanağa’nın sakin ucunda günlük pişen tereyağlı brioche ekmekler arasında yumurtalı kahvaltı sandviçleri hazırlayan fırın.',
      whatToOrder: ['Brioche Yumurta & Cheddar Sandviç', 'Tarçınlı Rulo', 'Filtre Kahve'],
      menuFrom: ['Avokadolu Brioche', 'Sade Kruvasan', 'Granola Kase'],
      alsoTry: ['Matcha Latte'],
      beforeYouGo: ['Hafta sonu sabahları erken dolduğu için 10:00 civarı gelmek sırayı kısaltır.'],
    },
    {
      id: 'carsi-morn',
      placeId: 'ChIJx4Ds0k-5yhQRVcI16m2AA_c',
      categoryId: 'kahvalti',
      localSignals: ['yogurtcu-hatti', 'gun-boyu-brunch', 'yumurtali-tabaklar'],
      description:
        'Yoğurtçu Parkı hattında gün boyu çırpılmış yumurta tabakları, pankek ve nitelikli kahve servisi sunan kahvaltı mekanı.',
      whatToOrder: ['Brioche Üstü Poşe Yumurta', 'Morn Kahvaltı Tabağı', 'Pankek'],
      menuFrom: ['Avokado Tost', 'Çılbır', 'Flat White'],
      alsoTry: ['Taze Sıkılmış Portakal Suyu'],
      beforeYouGo: ['Park yürüyüşü sonrası geniş brunch masaları için uygundur.'],
    },

    // --- DENEMELİSİN / TARİHİ ÇARŞI (Osmanağa & Tarihi Çarşı) ---
    {
      id: 'carsi-cafer-erol',
      placeId: 'ChIJAcvp3me4yhQRqMpBCKURMRY',
      categoryId: 'denemelisin',
      displayNameOverride: 'Şekerci Cafer Erol',
      localSignals: ['1807-miras', 'akide-ve-lokum', 'tarihi-carsi'],
      chefOrHeritageProtected: true,
      description:
        '1807’den bu yana beş kuşaktır Tarihi Kadıköy Çarşısı’nda renkli akide şekerleri, badem ezmesi ve lokumlar üreten asırlık şekerci.',
      whatToOrder: ['Çifte Kavrulmuş Fıstıklı Lokum', 'Tarçınlı ve Susamlı Akide Şekeri', 'Badem Ezmesi'],
      menuFrom: ['Osmanlı Macunu', 'Çikolata Kaplı Portakal', 'Kestane Şekeri'],
      alsoTry: ['Güllü Lokum'],
      beforeYouGo: ['Hediyelik kutular tezgah görevlilerince gramajla taze hazırlanır.'],
    },
    {
      id: 'carsi-ekspres-inegol',
      placeId: 'ChIJiQkj7Ge4yhQRi_iwC6ecZK8',
      categoryId: 'denemelisin',
      localSignals: ['komur-atesi-kofte', 'carsi-esnafi', 'klasik-piyaz'],
      chefOrHeritageProtected: true,
      description:
        'Muvakkithane Caddesi’nde yarım yüzyılı aşkın süredir kömür ateşinde İnegöl köfte, piyaz ve kaymaklı ekmek kadayıfı çıkaran klasik.',
      whatToOrder: ['Kömür Ateşinde İnegöl Köfte', 'Taze Soğanlı Piyaz', 'Kemalpaşa veya Ekmek Kadayıfı'],
      menuFrom: ['Mercimek Çorbası', 'Izgara Kasap Köfte', 'Açık Ayran'],
      alsoTry: ['Acı Biber Sosu'],
      beforeYouGo: ['Öğle ve akşam servisi çok hızlı akar; çarşıda kısa ama doyurucu bir öğün için idealdir.'],
    },
    {
      id: 'carsi-baylan',
      placeId: 'ChIJYeZr6me4yhQRRtlqAlFv5_A',
      categoryId: 'denemelisin',
      localSignals: ['1923-miras', 'kup-griye', 'tarihi-pastane'],
      chefOrHeritageProtected: true,
      description:
        '1923’ten bugüne uzanan geçmişiyle Kadıköy Çarşı içinde ikonik Kup Griye tatlısı ve klasik pastacılık ürünleriyle yaşayan tarih.',
      whatToOrder: ['Kup Griye', 'Adisebaba', 'Trüf Çikolata'],
      menuFrom: ['Mont Blanc', 'Klasik Makaron', 'Türk Kahvesi'],
      alsoTry: ['Rokoko'],
      beforeYouGo: ['Cam vitrinli tarihi salonda Kup Griye molası Kadıköy Çarşı’nın klasik ritüellerindendir.'],
    },
    {
      id: 'carsi-tatar-salim',
      placeId: 'ChIJRUE5vGe4yhQRapyfaCyx5PE',
      categoryId: 'denemelisin',
      localSignals: ['odun-atesi-doner', 'tek-urun-uzmani', 'suzme-ayran'],
      chefOrHeritageProtected: true,
      description:
        'Güneşlibahçe Sokak’ta tek ürüne odaklanarak odun ateşinde yaprak döner, süzme yoğurtlu ayran ve fırın sütlaç sunan çarşı durağı.',
      whatToOrder: ['Porsiyon veya Lavaş Yaprak Döner', 'Süzme Bakır Tas Ayran', 'Fırın Sütlaç'],
      menuFrom: ['Tereyağlı Pide Döner', 'Acılı Turşu'],
      alsoTry: ['Ev Yapımı Fırın Sütlaç'],
      beforeYouGo: ['Günlük takılan döner tükendiğinde servis kapanır; öğle saatlerinde yakalamak en güvenlisidir.'],
    },
  ],
};
