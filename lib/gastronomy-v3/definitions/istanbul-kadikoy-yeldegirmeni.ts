import { buildRegionCategories } from '../categories';
import type { V3RegionDefinition } from '../types';

export const ISTANBUL_KADIKOY_YELDEGIRMENI_DEF: V3RegionDefinition = {
  id: 'yeldegirmeni-kadikoy',
  slug: 'yeldegirmeni',
  city: 'İstanbul',
  district: 'Kadıköy',
  neighborhood: 'Yeldeğirmeni',
  officialQuarter: 'Rasimpaşa',
  displayName: 'Yeldeğirmeni, Kadıköy, İstanbul',
  locative: "Yeldeğirmeni'nde",
  path: ['istanbul', 'kadikoy', 'yeldegirmeni'],
  aliases: ['Yeldeğirmeni', 'Yeldegirmeni', 'Rasimpaşa', 'Rasimpasa', 'Kadıköy'],
  scopeNote: 'Rasimpaşa · Doğrulanmış Yerel Seçki',
  characterSubtitle:
    'Tarihi apartman dokusu altında butik pizzacılar, mahalle kurukahvecisi ve esnaf lokantaları',
  center: { lat: 40.9952, lng: 29.0294 },
  bbox: { minLat: 40.9912, maxLat: 41.0005, minLng: 29.0235, maxLng: 29.0335 },
  allowedNeighborhoodTokens: ['Rasimpaşa'],
  categories: buildRegionCategories(),
  candidates: [
    // --- PİZZA (Rasimpaşa / Yeldeğirmeni) ---
    {
      id: 'yel-lento',
      placeId: 'ChIJmwTPHZy5yhQRsib1kKwS9oQ',
      categoryId: 'pizza',
      localSignals: ['uzun-mayali-hamur', 'napoli-tarzi', 'mahalle-pizzacisi'],
      description:
        'Rasimpaşa sokaklarında uzun fermantasyonlu yumuşak kenarlı hamurla günlük hazırlanan Napoli pizzaları sunan butik mutfak.',
      whatToOrder: ['Margherita Verace', 'Füme Kaburgalı ve Karamelize Soğanlı Pizza', 'Burrata Pizza'],
      menuFrom: ['Marinara', 'Diavola', 'Tiramisu'],
      alsoTry: ['Sarımsaklı Zeytinyağı'],
      beforeYouGo: ['Küçük ve samimi salonda akşam saatleri hızlı dolduğu için erken saatlerde gitmek rahat olur.'],
    },
    {
      id: 'yel-gg-pizza',
      placeId: 'ChIJB8qDNqq5yhQRFpL3ywXrYmk',
      categoryId: 'pizza',
      localSignals: ['kabarik-kenar', 'italyan-malzeme', 'mahalle-klasiği'],
      description:
        'Yeldeğirmeni’nin köşebaşı duraklarından biri olarak kabarık kenarlı Napoli hamuru ve taze soslarıyla öne çıkan pizzacı.',
      whatToOrder: ['Dört Peynirli Pizza', 'Bresaola ve Roka Pizza', 'Margherita'],
      menuFrom: ['Funghi', 'Pepperoni Pizza'],
      alsoTry: ['Trüflü Mantar Sos'],
      beforeYouGo: ['Hem salonda oturma hem paket servis temposu akşamları yüksektir.'],
    },
    {
      id: 'yel-triger',
      placeId: 'ChIJl5cbFtm5yhQRDOC2cWvBKos',
      categoryId: 'pizza',
      localSignals: ['ara-sokak-pizzacisi', 'tas-firin', 'mahalle-mudavimi'],
      description:
        'Rasimpaşa içinde taş fırından ince ve dengeli harçlı pizzalar çıkaran sakin mahalle pizzacısı.',
      whatToOrder: ['Triger Özel Pizza', 'Mantarlı ve Fesleğenli Pizza'],
      menuFrom: ['Margherita', 'Sucuklu & Pastırmalı Pizza'],
      alsoTry: ['Ev Yapımı Acı Sos'],
      beforeYouGo: ['Hafta içi akşamları gürültüsüz, rahat pizza akşamı için uygundur.'],
    },
    {
      id: 'yel-salepepe',
      placeId: 'ChIJj5yDC9G5yhQRG8JD7XEDYAI',
      categoryId: 'pizza',
      localSignals: ['5-tabureli-tezgah', 'tokyo-usulu-napoli', 'hamur-bitene-kadar'],
      chefOrHeritageProtected: true,
      description:
        'Beş taburelik ufak tezgahında şefin birebir pişirdiği, günlük hamuru bitince dükkanı kapatan Tokyo usulü Napoli pizza durağı.',
      whatToOrder: ['Margherita Tokyo Style', 'Ançüezli Marinara', 'Şefin Günün Pizzası'],
      menuFrom: ['Sarımsaklı Zeytinli Pizza', 'Dört Peynirli'],
      alsoTry: ['Klasik Acı Zeytinyağı'],
      beforeYouGo: ['Oturma yeri çok sınırlı ve günlük hamur sayısı kısıtlı olduğundan açılış saatine yakın gitmek gerekir.'],
    },

    // --- HAMBURGER (Rasimpaşa / Yeldeğirmeni) ---
    {
      id: 'yel-bambs',
      placeId: 'ChIJJ4bspmK5yhQRas9X4NCeVhk',
      categoryId: 'hamburger',
      localSignals: ['citir-kenar-smash', 'gizli-cevher', 'ev-soslari'],
      description:
        'Yeldeğirmeni’nde ince çıtır kenarlı smash köfteleri ve taze kızartılmış patatesleriyle mahallede öne çıkan burgerci.',
      whatToOrder: ['Double Bamb’s Smash', 'Truffle Cheese Burger', 'Baharatlı Patates'],
      menuFrom: ['Classic Cheeseburger', 'Jalapeno Smash'],
      alsoTry: ['Ev Yapımı Cheddar Sos'],
      beforeYouGo: ['Sıcak ve taze pişirim için her sipariş tezgah önünde hazırlanır.'],
    },
    {
      id: 'yel-3burger',
      placeId: 'ChIJrX2TwWq5yhQRjePymeoiJxc',
      categoryId: 'hamburger',
      localSignals: ['odakli-menu', 'sulu-kofte', 'mahalle-burgercisi'],
      description:
        'Az çeşit üzerinde uzmanlaşmış menüsüyle kalın ve sulu köfteli burgerler çıkaran Rasimpaşa burger dükkanı.',
      whatToOrder: ['3 Burger Özel', 'Karamelize Soğanlı Burger', 'Çıtır Patates'],
      menuFrom: ['Classic Burger', 'Mushroom Swiss'],
      alsoTry: ['Sarımsaklı Mayonez'],
      beforeYouGo: ['Akşam yemeği ve geç atıştırmalık saatlerinde mahallelinin uğrak noktalarındandır.'],
    },
    {
      id: 'yel-calzone-burger',
      placeId: 'ChIJ4yBbTnS5yhQRMHB2kiLkido',
      categoryId: 'hamburger',
      displayNameOverride: 'Calzone Burger',
      localSignals: ['pizza-hamuru-burger', 'ozgun-teknik', 'tas-firin'],
      description:
        'Klasik burger ekmeği yerine sulu köfte ve peyniri ince pizza hamuru içine kapatıp taş fırında pişiren özgün mutfak.',
      whatToOrder: ['Klasik Calzone Burger', 'Tütsülenmiş Kaburgalı Calzone', 'Çıtır Soğan'],
      menuFrom: ['Acılı Meksika Calzone', 'Mantarlı Calzone'],
      alsoTry: ['Ranch Dip Sos'],
      beforeYouGo: ['Fırınlanmış hamur içi sıcak sunulduğundan servis edilirken dikkatli açmak iyi olur.'],
    },

    // --- KAHVE (Rasimpaşa / Yeldeğirmeni) ---
    {
      id: 'yel-kurukahveci',
      placeId: 'ChIJl70zQ2y4yhQRP5u360giiCc',
      categoryId: 'kahve',
      localSignals: ['reddit:hidden-gem', 'taze-kavrum', 'turk-kahvesi-ve-cekirdek'],
      description:
        'Küçük dükkanında günlük kavrulup çekilen taze Türk kahvesi ve filtre çekirdekleriyle Yeldeğirmeni’nin gerçek mahalle kahvecisi.',
      whatToOrder: ['Taze Çekilmiş Türk Kahvesi', 'Günün Filtre Kahvesi', 'Çekirdek Paket Alışverişi'],
      menuFrom: ['Cortado', 'Americano', 'Tahinli Kurabiye'],
      alsoTry: ['Damla Sakızlı Türk Kahvesi'],
      beforeYouGo: ['Ev için öğütülmüş veya çekirdek kahve alırken demleme yönteminize göre öğütüm isteyebilirsiniz.'],
    },
    {
      id: 'yel-mulin',
      placeId: 'ChIJYyO5iWu4yhQRXVMYAJUkZe8',
      categoryId: 'kahve',
      localSignals: ['sakin-kosk', 'nitelikli-kahve', 'mahalle-calisma-noktasi'],
      description:
        'Rasimpaşa’nın sakin bir sokağında dengeli espresso, filtre demleme ve ev yapımı günlük tatlılar sunan kahve dükkanı.',
      whatToOrder: ['V60 Demleme', 'Flat White', 'Limonlu Kek'],
      menuFrom: ['Cortado', 'Cold Brew', 'Brownie'],
      alsoTry: ['Matcha Latte'],
      beforeYouGo: ['Günün sessiz saatlerinde kitap okumak veya kahve keyfi yapmak için sakin bir atmosfer sunar.'],
    },
    {
      id: 'yel-albero',
      placeId: 'ChIJU3n4QuW5yhQRON1iuttBoSQ',
      categoryId: 'kahve',
      localSignals: ['agaclikli-sokak', 'espresso-bari', 'samimi-esnaf'],
      description:
        'Ağaçlar altındaki sokak masaları ve sıcak espresso barıyla Yeldeğirmeni sakinlerinin günlük kahve buluşma noktası.',
      whatToOrder: ['Cortado', 'Filtre Kahve', 'Ev Yapımı Tiramisu'],
      menuFrom: ['Latte', 'Iced Americano', 'Kiş Çeşitleri'],
      alsoTry: ['Soğuk Demleme'],
      beforeYouGo: ['Hava güzelken sokak önündeki masalar mahalleyi izlemek için oldukça keyiflidir.'],
    },
    {
      id: 'yel-village',
      placeId: 'ChIJw3UdrG64yhQRNWTOXmfJceA',
      categoryId: 'kahve',
      localSignals: ['mahalle-klasigi', 'ucuncu-nesil-kahve', 'sakin-bahce'],
      description:
        'Yeldeğirmeni’nin en köklü üçüncü nesil kahvecilerinden biri olarak taze çekirdek demlemeleri ve kahvaltılıklarıyla bilinen adres.',
      whatToOrder: ['Filtre Kahve', 'Latte', 'Havucu & Tarçınlı Kek'],
      menuFrom: ['Espresso', 'Cortado', 'Granola'],
      alsoTry: ['Iced Latte'],
      beforeYouGo: ['Sabah erken saatlerden itibaren mahalle müdavimlerinin uğrak yeridir.'],
    },

    // --- DATE MEKANLARI (Rasimpaşa / Yeldeğirmeni) ---
    {
      id: 'yel-la-pasta-mamma',
      placeId: 'ChIJoYrb3e-5yhQR8R6EhonF5sY',
      categoryId: 'date',
      localSignals: ['el-acmasi-makarna', 'samimi-italyan', 'aksam-yemegi'],
      description:
        'Taze el açması makarnaları ve yavaş pişen İtalyan soslarıyla Rasimpaşa’da sıcak ve sakin bir akşam sofrası kuran mutfak.',
      whatToOrder: ['Taze Pappardelle Ragu', 'Trüflü Tagliatelle', 'Tiramisu'],
      menuFrom: ['Fettuccine Alfredo', 'Pesto Soslu Makarna'],
      alsoTry: ['Bruschetta Başlangıç'],
      beforeYouGo: ['Akşam saatlerinde masalar az olduğu için gitmeden önce yer durumunu kontrol etmek iyidir.'],
    },
    {
      id: 'yel-javel',
      placeId: 'ChIJPZW5LgC5yhQRF4ySzPJaccs',
      categoryId: 'date',
      displayNameOverride: 'Javel Yeldeğirmeni',
      localSignals: ['mahalle-bistrosu', 'mevsimsel-tabak', 'gizli-cevher'],
      description:
        'Rasimpaşa ara sokaklarında özenli tabak sunumu, mevsimsel soslar ve sakin ışıklandırmasıyla dikkat çeken akşam bistrosu.',
      whatToOrder: ['Günün Makarnası', 'Ağır Pişmiş Et Tabağı', 'Çikolatalı Tatlı'],
      menuFrom: ['Başlangıç Mezeleri', 'Fırın Sebze Tabağı'],
      alsoTry: ['Ev Yapımı Limonata'],
      beforeYouGo: ['Bölgenin gürültüsünden uzak baş başa akşam yemeği için tercih edilebilir.'],
    },
    {
      id: 'yel-borden',
      placeId: 'ChIJVSD5RRu5yhQRFUD_ekeRYxs',
      categoryId: 'date',
      localSignals: ['tarihi-sokak', 'sakin-aksam', 'bistro'],
      description:
        'Yeldeğirmeni’nin tarihi dokusu içinde özenli akşam yemeği tabakları ve sakin atmosfer sunan butik restoran.',
      whatToOrder: ['Izgara Ana Yemek', 'Taze Salata ve Başlangıçlar'],
      menuFrom: ['El Yapımı Makarna', 'Günün Tatlısı'],
      alsoTry: ['Fırın Ekmek ve Zeytinyağı'],
      beforeYouGo: ['Akşam servisi için erken gitmek sakin köşe masaları yakalamayı sağlar.'],
    },

    // --- KAHVALTI (Rasimpaşa / Yeldeğirmeni) ---
    {
      id: 'yel-kapi',
      placeId: 'ChIJlyHk3Vm5yhQRn0XwozzfvB4',
      categoryId: 'kahvalti',
      displayNameOverride: 'Kapı Yeldeğirmeni',
      localSignals: ['ev-usulu-kahvalti', 'atolye-kafe', 'sakin-bahce'],
      description:
        'Huzurlu atölye atmosferinde taze sahanda yumurtalar, ev yapımı reçeller ve sıcak ekmeklerle kahvaltı sunan mahalle kafesi.',
      whatToOrder: ['Ev Usulü Kahvaltı Tabağı', 'Pişi ve Yöresel Peynirler', 'Demleme Çay'],
      menuFrom: ['Menemen', 'Avokadolu Yumurta', 'Filtre Kahve'],
      alsoTry: ['Ev Yapımı Poğaça'],
      beforeYouGo: ['Sakin hafta sonu kahvaltısı için mahalledeki en telaşsız noktalardan biridir.'],
    },
    {
      id: 'yel-flake',
      placeId: 'ChIJ98pI7cG5yhQRqwVixJOhZAo',
      categoryId: 'kahvalti',
      localSignals: ['katmanli-kruvasan', 'brunch-tabaklari', 'pose-yumurta'],
      description:
        'Katmanlı tereyağlı kruvasanları, poşe yumurtalı sabah kaseleri ve fırın lezzetleriyle bilinen Yeldeğirmeni brunch mekanı.',
      whatToOrder: ['Poşe Yumurtalı Kruvasan Sandviç', 'Granola Kase', 'Flat White'],
      menuFrom: ['Bademli Kruvasan', 'Avokado Tost', 'Çılbır'],
      alsoTry: ['Taze Portakal Suyu'],
      beforeYouGo: ['Hafta sonu brunch yoğunluğu yaşanabileceği için 10:00 öncesi gelmek avantajlıdır.'],
    },
    {
      id: 'yel-routes',
      placeId: 'ChIJCTwvfY-5yhQRlRL1vPpuJHM',
      categoryId: 'kahvalti',
      localSignals: ['eksi-maya-tost', 'sakin-mahalle-kahvaltisi', 'ev-reci'],
      description:
        'Rasimpaşa’da ekşi mayalı tostlar, bol malzemeli kahvaltı tabakları ve sıcak kahve sunan mahalle noktası.',
      whatToOrder: ['Ekşi Maya Peynirli Tost', 'Kahvaltı Tabağı', 'Americano'],
      menuFrom: ['Menemen', 'Yulaf Kasesi', 'Sıcak Çikolata'],
      alsoTry: ['Ev Yapımı Kek'],
      beforeYouGo: ['Sokak masaları sabah güneşi alırken mahalle havasını yaşamak keyiflidir.'],
    },

    // --- DENEMELİSİN / BÖLGEYE ÖZGÜ (Rasimpaşa / Yeldeğirmeni) ---
    {
      id: 'yel-hos-sefa',
      placeId: 'ChIJpYvsQ125yhQRtJbh2tbh7YI',
      categoryId: 'denemelisin',
      localSignals: ['mahalle-esnaf-lokantasi', 'sulu-tencere', 'gunluk-menu'],
      description:
        'Yeldeğirmeni’nin sevilen esnaf lokantası olarak her gün taze pişirilen sulu tencere yemekleri, çorbalar ve zeytinyağlılar sunar.',
      whatToOrder: ['Günün Tencere Yemeği', 'Zeytinyağlı Tabağı', 'Ev Yapımı Çorba'],
      menuFrom: ['Kuru Fasulye & Pilav', 'Karnıyarık', 'İrmik Helvası'],
      alsoTry: ['Komposto'],
      beforeYouGo: ['Öğle saatlerinde çeşitler eksilmeden gitmek mahalle lokantası deneyimi için idealdir.'],
    },
    {
      id: 'yel-mudavim',
      placeId: 'ChIJV-NREmy4yhQRUN4d7rch97s',
      categoryId: 'denemelisin',
      localSignals: ['anadolu-ev-yemekleri', 'mahalle-sofrasi', 'oglen-klasiği'],
      description:
        'Rasimpaşa’da temiz, hafif ve ev tadında Anadolu mutfağı tabaklarıyla mahalle sakinlerinin düzenli uğradığı lokanta.',
      whatToOrder: ['Mercimek veya Tarhana Çorbası', 'Zeytinyağlı Çeşitleri', 'Fırın Yemekleri'],
      menuFrom: ['Mücver', 'Köfte', 'Sütlaç'],
      alsoTry: ['Yoğurtlu Semizotu'],
      beforeYouGo: ['Günlük çıkan sınırlı tencere yemekleri akşamüstü tükenebilir.'],
    },
    {
      id: 'yel-leylak',
      placeId: 'ChIJnRNR-fW5yhQRIaSKdGQxqC8',
      categoryId: 'denemelisin',
      localSignals: ['bitkisel-mutfak', 'yaratıcı-sokak-ev-yemegi', 'mahalle-seckisi'],
      description:
        'Yeldeğirmeni’nde tamamen bitkisel malzemelerle dönerden tencere yemeklerine, tatlılardan kaselere zengin lezzetler üreten mutfak.',
      whatToOrder: ['Bitkisel İskender veya Dürüm', 'Günün Tencere Tabağı', 'Ev Yapımı Tatlı'],
      menuFrom: ['Falafel Wrap', 'Zeytinyağlı Tabaklar'],
      alsoTry: ['Vegan Cheesecake'],
      beforeYouGo: ['Bitkisel mutfağa ön yargısı olanların bile şaşırdığı sıcak ve doyurucu porsiyonlara sahiptir.'],
    },
    {
      id: 'yel-nayn',
      placeId: 'ChIJeQjQamy4yhQR-QmwK6POuK4',
      categoryId: 'denemelisin',
      localSignals: ['mevsimsel-kaseler', 'butik-mutfak', 'mahalle-mudavimi'],
      description:
        'İskele Sokak çevresinde mevsimsel sebzelerle hazırlanan özgün kaseler, sandviçler ve ev yapımı içecekler sunan küçük dükkan.',
      whatToOrder: ['Mevsimsel Kase', 'Ekşi Maya Sandviç', 'Ev Yapımı Buzlu Çay'],
      menuFrom: ['Günün Çorbası', 'Fırın Sebze Tabağı'],
      alsoTry: ['Zencefilli Kurabiye'],
      beforeYouGo: ['Hafif ve temiz içerikli öğle veya erken akşam öğünü arayanlar için uygundur.'],
    },
  ],
};
