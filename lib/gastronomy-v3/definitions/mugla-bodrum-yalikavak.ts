import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const MUGLA_BODRUM_YALIKAVAK_DEF: V3RegionDefinition = {
  id: 'yalikavak-bodrum-mugla',
  slug: 'yalikavak',
  city: 'Muğla',
  district: 'Bodrum',
  allowedDistricts: ['Bodrum'],
  neighborhood: 'Yalıkavak',
  officialQuarter:
    'Yalıkavak Mahallesi, Dirmil & Gökçebel Sahil-Marina Aksı (Çökertme Caddesi, Plaj Caddesi, Yalıkavak Marina, Küdür & Tilkicik Koyu)',
  displayName: 'Yalıkavak, Bodrum, Muğla',
  locative: "Yalıkavak'ta",
  path: ['mugla', 'bodrum', 'yalikavak'],
  aliases: [
    'Yalıkavak',
    'Yalikavak',
    'Yalıkavak Marina',
    'Yalikavak Marina',
    'Palmarina',
    'Tilkicik',
    'Tilkicik Koyu',
    'Gökçebel Yalıkavak',
    'Dirmil Yalıkavak',
    'Çökertme Caddesi Yalıkavak',
  ],
  scopeNote:
    'Çökertme Caddesi, Yalıkavak Çarşı & İskele, Plaj Caddesi, Tilkicik & Dirmil-Gökçebel Hattı · Doğrulanmış Seçki',
  characterSubtitle:
    'Yalıkavak Çarşı ve eski marina kıyısından Çökertme Caddesi, Plaj Caddesi, Gerişaltı kıyı bandı ve Dirmil sırtlarına uzanan odun fırınlı pizzacı, bağımsız gurme burgerciler, gün batımı bistro ve kokteyl barları, mandalina bahçeli köy kahvaltıları, artizan dondurmacı-fırın durakları ve köklü Ege balıkçıları.',
  center: { lat: 37.1055, lng: 27.2915 },
  bbox: { minLat: 37.0900, maxLat: 37.1330, minLng: 27.2720, maxLng: 27.3260 },
  allowedNeighborhoodTokens: [
    'Yalıkavak',
    'Yalikavak',
    'Dirmil',
    'Gökçebel',
    'Gokcebel',
    'Tilkicik',
    'Küdür',
    'Kudur',
    'Çökertme',
    'Cokertme',
  ],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // ==================== 1. PİZZA ====================
    compactSeed({
      id: 'arka-pizzeria-yalikavak',
      placeId: 'ChIJVSdK6h1xvhQROsoKtkMWW_o',
      cat: 'pizza',
      brand: 'arka',
      area: 'Çarşı Cd., Yalıkavak',
      signals: ['bodrum_klasigi', 'odun_firini_pizza', 'el_yapimi_makarna', 'rezervasyonsuz_sira'],
      verifiedAt: '2026-11-16',
      desc: "Bodrum yarımadasının köklü İtalyan mutfağı geleneğini Yalıkavak Çarşı Caddesi'ne taşıyan, odun ateşinde ince hamurlu pizzaları ve günlük el yapımı makarnalarıyla tanınan restoran.",
      order: ['Margherita Pizza', 'Funghi Pizza', 'Marinara (Peynirsiz)'],
      menu: [
        'Margherita Pizza',
        'Funghi Pizza',
        'Marinara',
        'Bol Sucuksever Pizza',
        'El Yapımı Taze Makarna',
        'Deniz Mahsullü Risotto',
        'Carpaccio di Manzo',
        'Tiramisu',
      ],
      sec: [
        [
          'El Yapımı Makarna & Deniz Mahsullü Risotto',
          'Pizza dışında günlük hazırlanan taze makarnalar ve deniz ürünlü risottolar akşam servisinin güçlü tamamlayıcılarıdır.',
          'arkapizzeria.com ve FineDineMenu menü kayıtları',
        ],
        [
          'Tiramisu & Panna Cotta',
          'Yemek sonunda klasik İtalyan tatlılarıyla kapanış yapmak isteyenler tarafından sıkça tercih edilir.',
          'FineDineMenu ve yerel gastronomi incelemeleri',
        ],
      ],
      seat: 'Çarşı Caddesi üzerinde iç salon ve açık veranda masaları; önceden rezervasyon alınmaz, geliş sırasıyla oturulur',
      crowd: 'Yaz akşamları ve hafta sonlarında kapıda bekleme sırası oluşabilecek kadar hareketli',
      dis: 'Rezervasyon kabul edilmediği için yoğun saatlerde kapıda sıra beklemek gerekebiliyor',
      transit: 'Yalıkavak Çarşı Caddesi No:52-1 adresinde, liman ve çarşı yürüyüş aksı üzerinde',
      sources: [
        [
          'Arka Pizzeria Resmi Sitesi',
          'https://www.arkapizzeria.com/',
          'operator',
          'Bodrum Merkez ve Yalıkavak iki şubeli yerel yapı, walk-in sıra düzeni ve 2013 kuruluş bilgisi',
        ],
        [
          'Michelin Guide Türkiye — Arka Ristorante Pizzeria',
          'https://guide.michelin.com/',
          'award',
          'Bib Gourmand seçkisi, odun fırını pizzalar, el yapımı makarnalar ve risotto vurgusu',
        ],
        [
          'FineDineMenu — Arka Pizzeria Menü',
          'https://www.finedinemenu.com/',
          'community',
          'Marinara, Margherita, Funghi, Carpaccio di Manzo, Tiramisu ve Panna Cotta menü kalemleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=18040037212435434042',
          'maps',
          'Yalıkavak, Çarşı Cd. No:52-1 D:1 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Bodrum yerel mutfak sahnesinde uzun yıllardır çizgisini koruyan iki şubeli bağımsız İtalyan markası',
        'Pizza yanında taze makarna, carpaccio ve risotto seçenekleriyle dengeli akşam menüsü',
      ],
      cons: [
        'Rezervasyon alınmaması yoğun yaz akşamlarında bekleme süresi doğuruyor',
        'Çarşı içi konumu nedeniyle doğrudan marina cephesine nazaran daha hareketli bir sokak dokusunda',
      ],
      unc: ['Sezon yoğunluğunda popüler pizza ve taze makarna çeşitleri akşam geç saatlerde tükenebiliyor'],
    }),

    // ==================== 2. HAMBURGER ====================
    compactSeed({
      id: 'burger-85-yalikavak',
      placeId: 'ChIJmxTHVppxvhQRI59Eovb8O1o',
      cat: 'hamburger',
      brand: 'burger 85',
      area: 'Atatürk Cd., Yalıkavak',
      signals: ['ev_yapimi_ekmek', 'aile_isletmesi', 'tek_sube_yerel'],
      verifiedAt: '2026-11-16',
      desc: 'Atatürk Caddesi üzerinde günlük olarak kendi fırınında pişirdiği burger ekmekleri, kalın ve sulu dana köfteleri ile ev yapımı tatlılar sunan bağımsız aile burgercisi.',
      order: ['Klasik Cheeseburger', 'Özel Soslu Dana Burger', 'Baharatlı Patates Kızartması'],
      menu: [
        'Klasik Burger',
        'Cheeseburger',
        'Yöresel Peynirli Özel Burger',
        'Baharatlı Patates Kızartması',
        'Ev Yapımı Tatlılar',
      ],
      sec: [
        [
          'Ev Yapımı Fırın Tatlıları',
          'Burger sonrasında mutfakta günlük hazırlanan ev usulü tatlı çeşitleri müdavimlerin sıkça övdüğü ek seçenekler arasındadır.',
          'Welcome Center Bodrum incelemesi',
        ],
      ],
      seat: 'Atatürk Caddesi cephesinde samimi iç mekan ve açık sokak oturma alanı',
      crowd: 'Akşam yemeği saatlerinde düzenli dolu, öğleden sonra daha sakin aile temposunda',
      dis: 'Sahil ve marina yürüyüş bandından içerideki ana cadde üzerinde kaldığı için deniz cephesinde değildir',
      transit: 'Atatürk Caddesi No:23/4 adresinde, Yalıkavak merkez girişinden kısa yürüyüş veya dolmuş hattıyla ulaşılabilir',
      sources: [
        [
          'Welcome Center Bodrum — Burger 85 Yalıkavak',
          'https://www.welcomecenterbodrum.com/',
          'editorial',
          'Aile işletmesi kimliği, günlük taze pişen ev yapımı ekmekler ve ev yapımı tatlılar incelemesi',
        ],
        [
          'TatilEksper & Wanderlog — Burger 85 Değerlendirmeleri',
          'https://www.tatileksper.com/',
          'community',
          'Kalın sulu köfte kıvamı, ızgara lezzeti ve baharatlı patates kızartması geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=6502068623254003491',
          'maps',
          'Yalıkavak, Atatürk Cd. 23/4 konum ve fiyat seviyesi doğrulaması',
        ],
      ],
      pros: [
        'Yalnızca Yalıkavak merkezde tek noktada çalışan bağımsız aile işletmesi',
        'Günlük kendi üretimleri olan taze burger ekmeği ve yüksek et kalitesi',
      ],
      cons: [
        'Butik işletme yapısı nedeniyle sezon dönemine göre menü kapsamı ve çalışma günleri değişebiliyor',
        'Marina yürüyüş aksından birkaç dakikalık araç veya yürüyüş mesafesinde kalıyor',
      ],
      unc: ['Sezon dışı aylarda haftalık servis günleri dönemsel olarak güncellenebiliyor'],
    }),
    compactSeed({
      id: 'wooden-burger-fries-yalikavak',
      placeId: 'ChIJmYQJ0BRxvhQRdWBRBcj4-kg',
      cat: 'hamburger',
      brand: 'wooden',
      area: 'Çarşı Cd., Yalıkavak',
      signals: ['sokak_lezzeti', 'baharatli_patates', 'tek_sube_yerel'],
      verifiedAt: '2026-11-16',
      desc: "Çarşı Caddesi'nde mütevazı tezgah düzeninde iyi baharatlanmış dana köfteli burgerler, hot dog çeşitleri ve özel karışımlı patates kızartması hazırlayan yerel sokak lezzeti durağı.",
      order: ['Monkey Burger', 'Cheeseburger', 'Füme Roast Beef & Cheeseburger'],
      menu: [
        'Cheeseburger',
        'Monkey Burger',
        'Gipsy Burger',
        'Füme Roast Beef & Cheeseburger',
        'Veggie Burger',
        'Hot Dog',
        'Özel Baharatlı Patates Kızartması',
      ],
      sec: [
        [
          'Özel Baharatlı Patates Kızartması & Ev Sosları',
          'Burger yanında özgün baharat harmanı ve ev yapımı dip soslarla servis edilen patatesler tek başına sipariş sebebi olarak öne çıkar.',
          'Seemor ve Yandex yerel geri bildirimleri',
        ],
        [
          'Hot Dog & Veggie Burger',
          'Klasik dana burger dışında sosisli ve etsiz alternatif arayanlar için pratik sokak seçenekleri sunar.',
          'Seemor ve yerel menü kayıtları',
        ],
      ],
      seat: 'Çok sınırlı sayıda sade tabure ve tezgah önü oturma alanı; ağırlıklı al-götür ve hızlı atıştırmalık düzeni',
      crowd: 'Öğle ve akşam geç saatlere kadar hızlı al-götür siparişiyle hareketli',
      dis: 'Oturma kapasitesi oldukça kısıtlı olduğu için uzun akşam sohbetlerinden çok hızlı yemek ve paket servise uygundur',
      transit: 'Yalıkavak Çarşı Caddesi üzerinde, eski otogar ve çarşı merkezine yürüme mesafesinde',
      sources: [
        [
          'Wooden Burger Resmi Instagram Hesabı',
          'https://www.instagram.com/woodenburger_hotdog',
          'operator',
          'Tek şubeli Yalıkavak işletmesi ve el yapımı burger ile hot dog sunumu',
        ],
        [
          'Seemor — Wooden Burger & Fries Değerlendirmesi',
          'https://seemor.ai/',
          'community',
          'Monkey Burger, Cheeseburger, Veggie Burger, hot dog ve baharatlı patates notları',
        ],
        [
          'Yandex Haritalar — Wooden Burger Yalıkavak',
          'https://yandex.com.tr/',
          'community',
          'Gipsy Burger, Füme Roast Beef & Cheeseburger ve dip sos menü doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=5258789052874842229',
          'maps',
          'Yalıkavak, Çarşı Cd. konum ve operasyon kaydı',
        ],
      ],
      pros: [
        'Yalıkavak merkezinde yalnızca tek lokasyonda çalışan samimi sokak burgercisi',
        'Sulu köfte, baharatlı patates ve hot dog çeşitleriyle hızlı ve pratik seçenek',
      ],
      cons: [
        'Fiziksel oturma alanı çok dar; kalabalık gruplar için uygun masa düzeni yok',
        'Açık mutfak ve cadde önü yapısı nedeniyle akşam pik saatlerinde bekleme yaşanabiliyor',
      ],
      unc: ['Kış döneminde açılış ve kapanış saatleri yaz sezonuna kıyasla erkene çekilebiliyor'],
    }),
    compactSeed({
      id: 'society-burger-yalikavak',
      placeId: 'ChIJAeiiNnJxvhQRHymW8T4oW7E',
      cat: 'hamburger',
      brand: 'society',
      area: 'Kayacık Cd., Yalıkavak',
      signals: ['brioche_ekmek', 'bodrum_sos', 'tek_sube_yerel'],
      verifiedAt: '2026-11-16',
      desc: 'Kayacık Caddesi Çandır İş Merkezi içinde yumuşak brioche ekmeği, özel Bodrum soslu burgerleri ve karamelize soğanlı reçeteleriyle hizmet veren yerel burger mutfağı.',
      order: ['Bodrum Burger', 'Roast Burger', 'Torque Burger'],
      menu: [
        'Hamburger',
        'Cheeseburger',
        'Bodrum Burger',
        'Roast Burger',
        'Torque Burger',
        'Sweet Chili Burger',
        'Jalapeno Burger',
        'Real Vegan Burger',
      ],
      sec: [
        [
          'Real Vegan Burger & Hot Dog Seçenekleri',
          'Bitkisel köfteli vegan burger ve farklı sos eşlikçileriyle dana eti dışındaki tercihlere de yer verir.',
          'Yemeksepeti menü listesi',
        ],
        [
          'Kaşık Patates & İmza Dip Soslar',
          'Bodrum Sos, Karamelize Soğan Sos, Sweet Chili ve Sriracha Mayonez ile servis edilen kaşık patatesler menünün tamamlayıcısıdır.',
          'Migros Yemek ve Yemeksepeti kayıtları',
        ],
      ],
      seat: 'İş merkezi avlusu ve iç mekanda sade masa düzeni; paket servis ağırlıklı kurgu',
      crowd: 'Akşam saatlerinde hem paket sipariş hem yerel müşterilerle dengeli yoğunluk',
      dis: 'Deniz kenarı yerine iş merkezi girişinde konumlandığı için atmosfer odağından ziyade ürün odaklıdır',
      transit: 'Kayacık Caddesi No:2 Çandır İş Merkezi içinde, Yalıkavak merkez ve marina aksına kısa yürüyüş mesafesinde',
      sources: [
        [
          'Yemeksepeti — Society Burger Yalıkavak Menüsü',
          'https://www.yemeksepeti.com/',
          'community',
          'Brioche ekmekli Bodrum Burger, Roast Burger, Torque Burger, Sweet Chili ve Real Vegan Burger menüsü',
        ],
        [
          'Migros Yemek — Society Burger Soslar & Menü',
          'https://www.migros.com.tr/',
          'community',
          'Bodrum Sos, Sriracha Mayonez, Jalapeno Sos ve kaşık patates seçenekleri doğrulaması',
        ],
        [
          'QRdos — Society Burger Dijital Menü Kaydı',
          'https://qrdos.tr/',
          'operator',
          'Yalıkavak Kayacık Cd. tek şubeli yerel menü kataloğu',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=12779852618400147743',
          'maps',
          'Çandır İş Merkezi, Yalıkavak, Kayacık Cd. No:2 konum kaydı',
        ],
      ],
      pros: [
        'Brioche ekmek ve ev yapımı Bodrum sosu gibi özgün dokunuşlarla bağımsız Yalıkavak burgercisi',
        'Vegan burger ve çeşitli sos seçenekleriyle geniş kitleye hitap ediyor',
      ],
      cons: [
        'İş merkezi içerisindeki konumu sahil veya bahçe atmosferi arayanlara hitap etmez',
        'Yeni nesil butik bir adres olduğu için değerlendirme hacmi yerleşik rakiplere göre daha düşük',
      ],
      unc: ['Sezon içi ve kış dönemindeki masa servisi saatleri dönemsel olarak güncellenebiliyor'],
    }),

    // ==================== 4. DATE MEKANLARI ====================
    compactSeed({
      id: 'sofis-marina-brasserie-yalikavak',
      placeId: 'ChIJx1NzTq5tvhQRVUQCUyV41DE',
      cat: 'date',
      brand: "sofi's",
      area: 'Çökertme Cd. (Marina Girişi), Yalıkavak',
      signals: ['brasserie_steakhouse', 'imza_kokteyl', 'akdeniz_et_deniz'],
      verifiedAt: '2026-11-16',
      desc: 'Yalıkavak Marina girişi yakınında Akdeniz deniz ürünlerini, dinlendirilmiş et kesimlerini ve yerel Ege klasiklerini şık brasserie servisiyle birleştiren akşam yemeği mekanı.',
      order: ['Sea Bass Lokum (Levrek)', 'Biber Soslu Bonfile / Ribeye', 'Çökertme Kebabı'],
      menu: [
        'Sea Bass Lokum',
        'Ribeye Steak',
        'Biber Soslu Bonfile',
        'Çökertme Kebabı',
        'Kuzu Tandır',
        "Sofi's Handcrafted Burger",
        'Sıcak Puf Ekmek & Meze Tabağı',
        'İmza Kokteyller',
      ],
      sec: [
        [
          'Sıcak Puf Ekmek & Yöresel Peynir Başlangıcı',
          'Masaya oturulduğunda gelen sıcak puf ekmek, zeytin ve peynir ikramları akşam yemeğine şık bir açılış yapar.',
          'Restoranim değerlendirmeleri',
        ],
        [
          'İmza Kokteyller & Süryani Şarap Seçkisi',
          'Yemek eşleşmesi için miksolojist kokteylleri ve yerel şarap alternatifleri sunulur.',
          'sofismarinabrasserie.com ve Restoranim kayıtları',
        ],
      ],
      seat: 'Şık iç salon ve marina giriş aksına bakan açık teras masa düzeni',
      crowd: 'Akşam yemeği ve kutlama buluşmalarında yoğun, öğle saatlerinde görece daha sakin',
      dis: 'Marina girişindeki konumu ve üst segment menüsü nedeniyle fiyat seviyesi yüksektir; yaz akşamlarında rezervasyon gerektirir',
      transit: 'Çökertme Caddesi Ekrem Önal İş Merkezi No:4 adresinde, Yalıkavak Marina kapısına yürüyüş mesafesinde',
      sources: [
        [
          "Sofi's Marina Brasserie Resmi Sitesi",
          'https://www.sofismarinabrasserie.com/',
          'operator',
          'Sea Bass Lokum, Ribeye, Sofi’s Burger ve brasserie-steakhouse konsepti',
        ],
        [
          "Restoranim — Sofi's Marina Brasserie İncelemeleri",
          'https://www.restoranim.net/',
          'community',
          'Puf ekmek ikramı, Çökertme Kebabı, biber soslu bonfile, kuzu tandır ve Süryani şarapları notları',
        ],
        [
          'Yerels — Yalıkavak Sofi’s Marina Brasserie',
          'https://www.yerels.com/',
          'community',
          'Marina yakınındaki brasserie atmosferi ve akşam servisi geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=3590626904622908501',
          'maps',
          'Yalıkavak Çökertme Cd. Ekrem Önal İş Merkezi No:4 konum kaydı',
        ],
      ],
      pros: [
        'Hem deniz mahsulü hem de kaliteli et ve yöresel yemek arayan çiftler için dengeli menü',
        'Marina girişine yakın konumuyla kolay erişilebilir akşam yemeği alternatifi',
      ],
      cons: [
        'Üst segment fiyat seviyesi bütçe dostu seçenek arayanlar için uygun değil',
        'Doğrudan kumsal sıfırında değil, cadde aksında yer alıyor',
      ],
      unc: ['Sezonluk günlük balık ve et kesim çeşitleri menüde güncellenebiliyor'],
    }),
    compactSeed({
      id: 'altust-yalikavak',
      placeId: 'ChIJqZfxSN9xvhQRO3HKT2zbh8M',
      cat: 'date',
      brand: 'altust',
      area: 'Çarşı Cd. (Eski Marina), Yalıkavak',
      signals: ['deniz_kiyisi_bistro', 'gun_batimi_kokteyl', 'paylasimlik_tabaklar'],
      verifiedAt: '2026-11-16',
      desc: 'Eski marina kıyısında denizin hemen kenarında gün batımı manzarası, paylaşımlık modern Ege tabakları ve yaratıcı isimli imza kokteylleri bir araya getiren akşam bistrosu.',
      order: ['Çökertme Taco', 'Çıtır Levrek Caponata', 'Narenciyeli Tagliatelle'],
      menu: [
        'Çökertme Taco',
        'Çıtır Levrek Caponata',
        'İncikli Risotto',
        'Narenciyeli Tagliatelle',
        'Yanık Burger',
        'Otlu Falafel',
        'Avokadolu Çiğ Kabak Salatası',
        'Zacapaccino & Magic Margarita',
      ],
      sec: [
        [
          'İmza Kokteyller (Zacapaccino & Magic Margarita)',
          'Özgün reçeteli bar menüsü, gün batımı saatlerinden geceye uzanan buluşmalarda başrolü alır.',
          'Oggusto ve GrabLocals incelemeleri',
        ],
        [
          'İncikli Risotto & Fish and Chips',
          'Paylaşımlık başlangıçların ötesinde doyurucu ana tabak arayanlar için tercih edilir.',
          'Oggusto Yalıkavak bistro rehberi',
        ],
      ],
      seat: 'Deniz kenarında açık iskele-kıyı masaları ve bar çevresi oturma düzeni',
      crowd: 'Gün batımından itibaren DJ müziği ve kokteyl buluşmalarıyla enerjik ve canlı',
      dis: 'Öğleden sonra geç saatlerde açıldığı için gündüz erken saatlere uygun değildir; akşam müzik temposu yükselebiliyor',
      transit: 'Yalıkavak Çarşı Caddesi No:46/1 adresinde, eski balıkçı barınağı ve çarşı kıyı şeridi üzerinde',
      sources: [
        [
          'Oggusto — AltÜst Yalıkavak',
          'https://www.oggusto.com/',
          'editorial',
          'Eski marinada deniz kenarı konum, Çökertme Taco, Levrek Caponata ve imza kokteyller',
        ],
        [
          'The Magger & GrabLocals — AltÜst Bistro İncelemesi',
          'https://www.themagger.com/',
          'editorial',
          'Gün batımı buluşmaları, Narenciyeli Tagliatelle, Otlu Falafel ve DJ performansları',
        ],
        [
          'Restoranim — AltÜst Yalıkavak',
          'https://www.restoranim.net/',
          'community',
          'Yanık Burger ve yaratıcı kokteyl deneyimi değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=14089471217493504315',
          'maps',
          'Yalıkavak, Çarşı Cd. No:46/1 konum ve fiyat seviyesi kaydı',
        ],
      ],
      pros: [
        'Büyük marina kulüplerine kıyasla daha samimi ve yaratıcı paylaşımlık bistro mutfağı',
        'Denize sıfır gün batımı manzarası ve güçlü kokteyl barı',
      ],
      cons: [
        'Akşam ilerledikçe müzik sesi yükseldiği için çok sessiz sohbet arayanlara uymayabilir',
        'Gün batımı saatlerinde kıyı masaları hızla dolduğundan rezervasyon önerilir',
      ],
      unc: ['Sezon dışındaki açılış günleri ve DJ takvimi mevsime göre değişebiliyor'],
    }),
    compactSeed({
      id: 'bilbo-pub-bistro-yalikavak',
      placeId: 'ChIJb5gf70JxvhQR8IZgr9kyub0',
      cat: 'date',
      brand: 'bilbo',
      area: 'Özkan Sk., Yalıkavak',
      signals: ['mahalle_gastropub', 'fici_kokteyl', 'sakin_sokak_bulusmasi'],
      verifiedAt: '2026-11-16',
      desc: "Merkez Özkan Sokak'ta kalabalık marina şovlarından uzak, özenli müzik seçkisi, fıçıda dinlendirilmiş Negroni gibi kokteylleri ve ev yapımı burger-taco tabaklarıyla öne çıkan mahalle bistrosu.",
      order: ['Barrel-Aged Negroni', 'El Yapımı Gurme Burger', 'Taco Gecesi Tabakları'],
      menu: [
        'El Yapımı Gurme Burger',
        'Taco Çeşitleri',
        'Taze Mevsim Salataları',
        'Glütensiz Alternatifler',
        'Barrel-Aged Negroni',
        'Bira & Şarap Seçkisi',
      ],
      sec: [
        [
          'Taco Gecesi & Glütensiz Tabaklar',
          'Belirli akşamlarda düzenlenen taco sunumları ve özel beslenmeye uygun glütensiz seçenekler bar menüsüne eşlik eder.',
          'Restoranim ve Yandex yerel kayıtları',
        ],
        [
          'Taze Salatalar & Craft Kokteyller',
          'Hafif atıştırmalıklarla uzun sohbetlere eşlik eden klasik ve fıçı dinlendirmeli kokteyller öne çıkar.',
          'Trip.com ve Mekanlar değerlendirmeleri',
        ],
      ],
      seat: 'Özkan Sokak üzerinde samimi dış masa düzeni ve sıcak iç bar alanı',
      crowd: 'Akşamları müdavim ağırlıklı, rahat müzikli ve sohbet odaklı dengeli tempo',
      dis: 'Deniz manzaralı bir cephede yer almaz; çarşı içindeki ara sokakta konumlanır',
      transit: 'Yalıkavak Merkez Özkan Sokak üzerinde, Çökertme Caddesi ve çarşı merkezinden birkaç adım içeride',
      sources: [
        [
          'Bodrum Mekan Rehberi — Bilbo Pub & Bistro',
          'https://www.bodrummekanrehberi.com/',
          'editorial',
          'Yalıkavak merkezde mahalle gastropub kimliği ve atmosfer incelemesi',
        ],
        [
          'Restoranim & Mekanlar — Bilbo Kokteyl & Taco Geceleri',
          'https://www.restoranim.net/',
          'community',
          'Barrel-Aged Negroni, Taco Nights, müzik seçkisi ve ulaşılabilir fiyat dengesi geri bildirimleri',
        ],
        [
          'Trip.com & Yandex — Bilbo Pub & Bistro Menü',
          'https://www.trip.com/',
          'community',
          'El yapımı burgerler, taze salatalar ve glütensiz seçeneklerin doğrulanması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=13671014054391482096',
          'maps',
          'Merkez, Özkan Sk., 48990 Yalıkavak konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Yalıkavak Marina fiyatlarına kıyasla çok daha dengeli bütçe ile nitelikli kokteyl ve bistro yemeği',
        'Abartısız, müzik seçkisi güçlü ve sakin akşam buluşması atmosferi',
      ],
      cons: [
        'Sahil veya deniz manzarası bulunmuyor',
        'Küçük ölçekli bir mahalle bistrosu olduğu için kalabalık gruplarda yer önceden teyit edilmeli',
      ],
      unc: ['Taco geceleri gibi tematik etkinlik günleri sezona göre güncellenebiliyor'],
    }),
    compactSeed({
      id: 'j-joes-beach-restaurant-yalikavak',
      placeId: 'ChIJhUZM-GpxvhQRnknZxiYir0E',
      cat: 'date',
      brand: "j joe's",
      area: 'Plaj Cd., Yalıkavak',
      signals: ['plaj_caddesi_kumsal', 'akdeniz_deniz_urunleri', 'gun_batimi_masalari'],
      verifiedAt: '2026-11-16',
      desc: "Plaj Caddesi'nde kumsal kenarında Akdeniz mezeleri, taze ızgara levrek ve rahat bistro tabaklarını deniz havası eşliğinde sunan sahil restoranı ve barı.",
      order: ['Izgara Taze Levrek', 'Deniz Ürünlü Mezeler', 'Sahil Bistro Kokteylleri'],
      menu: [
        'Izgara Levrek',
        'Günün Taze Balığı',
        'Ege & Akdeniz Mezeleri',
        'Bistro Burger & Atıştırmalıklar',
        'Vegan & Glütensiz Seçenekler',
        'Kokteyl & Şarap Barı',
      ],
      sec: [
        [
          'Vejetaryen & Glütensiz Akdeniz Tabakları',
          'Deniz ürünleri dışında hafif sebze ağırlıklı ve glütensiz tabak alternatifleri de talep üzerine hazırlanır.',
          'Trip.com ve Yandex tesis bilgileri',
        ],
        [
          'Gün Batımı Kokteylleri',
          'Plaj gününden akşam yemeğine geçişte sade kokteyl ve soğuk içecek servisi eşlik eder.',
          'Eatbu ve Meyhankoli kayıtları',
        ],
      ],
      seat: 'Plaj Caddesi sahil şeridinde açık kum-teras masaları ve bar oturma alanı',
      crowd: 'Gündüz plaj misafirleriyle hareketli, akşamüstü ve günbatımında sakin sahil yemeği temposunda',
      dis: 'Gündüz plaj servisi yoğunluğu akşamüstü erken saatlerde masa geçişini yavaşlatabiliyor',
      transit: 'Yalıkavak Plaj Caddesi üzerinde, merkez yürüyüş aksından kuzey kıyı bandına doğru kısa yürüyüşle ulaşılır',
      sources: [
        [
          "Meyhankoli — J. Joe's Beach Bar & Restaurant",
          'https://www.meyhankoli.com/',
          'community',
          'Plaj Caddesi sahil mutfağı, Akdeniz-Avrupa bistro tabakları ve bar konsepti',
        ],
        [
          "Trip.com & Yandex — J. Joe's Beach Menü",
          'https://www.trip.com/',
          'community',
          'Izgara levrek, taze mezeler, vejetaryen/glütensiz seçenekler ve adres doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=4733039283329911198',
          'maps',
          'Yalıkavak, Plaj Cd. konum ve fiyat seviyesi kaydı',
        ],
      ],
      pros: [
        'Resmi kıyafet zorunluluğu olmayan, ayağı kuma basan rahat sahil akşamı atmosferi',
        'Balık-meze ile sade bistro tabaklarını aynı masada buluşturması',
      ],
      cons: [
        'Kış sezonunda plaj işletmeleri gibi kapanma veya kısa çalışma takvimine geçebiliyor',
        'Fine-dining düzeyinde kompleks tabaklar yerine sade sahil mutfağı sunar',
      ],
      unc: ['Yaz sezonu dışındaki açılış tarihleri işletme tarafından sezona göre belirleniyor'],
    }),

    // ==================== 5. KAHVALTI ====================
    compactSeed({
      id: 'sefte-bahce-yalikavak',
      placeId: 'ChIJY71ZUboNvhQRS3Y3AErooTc',
      cat: 'kahvalti',
      brand: 'sefte',
      area: '57. Sk. (Yalıkavak Tepesi), Yalıkavak',
      signals: ['rumeli_kosova_mutfagi', 'el_acmasi_borek', 'manzarali_tepe_bahce'],
      verifiedAt: '2026-11-16',
      desc: "Yalıkavak sırtlarında Kosova göçmeni bir aile tarafından işletilen, klasik Ege serpme sofrasına Balkan usulü isli etler, el açması börek ve Rumeli 'lokum' hamurunu ekleyen doğa içi kahvaltı bahçesi.",
      order: ['Serpme Rumeli Kahvaltısı', 'El Açması Kaymaklı & Otlu Börek', 'Kosova İsli Eti & Lokum'],
      menu: [
        'Serpme Kahvaltı',
        'El Açması Kaymaklı Börek',
        'El Açması Otlu Börek',
        'Rumeli Lokum (Hamur Kızartması)',
        'Kosova Kurutulmuş İsli Eti',
        'Trakya & Yöre Peynirleri',
        'Ev Yapımı Reçeller',
        'Bahçeden Yeşillikler & Demlik Çay',
      ],
      sec: [
        [
          'Rumeli Lokum & Ev Yapımı Reçeller',
          'Pişinin Balkan geleneğindeki küçük formu olan sıcak lokumlar, mevsimsel ev reçelleri ve bal-kaymakla eşleşir.',
          'BodrumFinder ve TGRT Haber incelemeleri',
        ],
        [
          'Bahçe Söğüşleri & Sahanda Yumurta',
          'İşletmenin kendi bahçesinden toplanan taze yeşillikler ve demlik çay masayı tamamlar.',
          'seftebahce.com ve MesPrestiges yazıları',
        ],
      ],
      seat: 'Yamaç bahçesinde gölgeli açık localar ve doğa manzaralı masalar',
      crowd: 'Sabah ve hafta sonu brunch saatlerinde rezervasyonlu masalarla çok yoğun',
      dis: 'Yalıkavak tepesinde yer aldığı için araçsız yürüyerek çıkmak zordur; gölgeli localar için önceden rezervasyon gerekir',
      transit: 'Yalıkavak Mahallesi 57. Sokak No:5 adresinde, merkezden özel araç veya taksiyle kısa tırmanışla ulaşılır',
      sources: [
        [
          'Sefte Bahçe Resmi Sitesi',
          'http://www.seftebahce.com/',
          'operator',
          'Aile işletmesi, Kosova-Rumeli kahvaltı konsepti ve bahçe locaları',
        ],
        [
          'BodrumFinder & MesPrestiges — Sefte Bahçe',
          'https://www.bodrumfinder.com/',
          'editorial',
          'Tek tip serpme Rumeli kahvaltısı, el açması börek ve lokum detayları',
        ],
        [
          'TGRT Haber — Yalıkavak Kahvaltı Durakları',
          'https://www.tgrthaber.com/',
          'editorial',
          'Kosova kurutulmuş isli etleri, Fehmiye Teyze el açması börekleri ve bahçe yeşillikleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=4008740547865310795',
          'maps',
          'Yalıkavak Mah. 57. Sok No:5 konum ve yüksek hacimli doğrulama',
        ],
      ],
      pros: [
        'Standart serpme kahvaltının ötesinde özgün Kosova-Rumeli şarküteri ve el açması hamur işi kimliği',
        'Geniş ve ferah tepe bahçesiyle kalabalık gruplar ve aileler için rahat ortam',
      ],
      cons: [
        'Merkezden yukarıda konumlandığı için araç veya taksi gerektirir',
        'Yüksek sezonda hafta sonları rezervasyonsuz masa bulmak güç olabiliyor',
      ],
      unc: ['Sezon yoğunluğunda popüler bahçe locaları birkaç gün önceden dolabiliyor'],
    }),
    compactSeed({
      id: 'mandalin-bahcesi-yalikavak',
      placeId: 'ChIJM3y-z2pxvhQRA3e8GDnM3Wc',
      cat: 'kahvalti',
      brand: 'mandalin',
      area: 'Acar Sk., Yalıkavak',
      signals: ['mandalina_bahcesi', 'ev_yapimi_recel', 'sakin_golgelik'],
      verifiedAt: '2026-11-16',
      desc: "Acar Sokak'ta mandalina ağaçlarının gölgesinde, kendi bahçe atmosferiyle uyumlu mandalina-turunç reçelleri, taze açılan börek-pişi-gözleme çeşitleri ve Ege peynirleri sunan kahvaltı bahçesi.",
      order: ['Bahçe Serpme Kahvaltısı', 'Ev Yapımı Mandalina & Turunç Reçelleri', 'Taze Börek & Pişi'],
      menu: [
        'Serpme Ege Kahvaltısı',
        'Mandalina & Turunç Reçelleri',
        'Günlük Börek & Gözleme',
        'Pişi & Bal-Kaymak',
        'Menemen & Omlet',
        'Ege Peynir & Zeytin Tabağı',
      ],
      sec: [
        [
          'Gözleme & Menemen Çeşitleri',
          'Soğuk serpmeye ek olarak sıcak sac gözlemesi ve isteğe bağlı menemen veya omlet çeşitleri servis edilir.',
          'BodrumDayasam ve MesPrestiges incelemeleri',
        ],
      ],
      seat: 'Her masanın mandalina ağaçları altında kendi gölgeliğinde yer aldığı açık bahçe düzeni',
      crowd: 'Sabah geç saatlerde ve hafta sonlarında sakin ancak düzenli dolu bahçe temposu',
      dis: 'Açık bahçe yapısı nedeniyle yağışlı kış günlerinde veya rüzgarlı havalarda kısıtlı alan sunabilir',
      transit: 'Yalıkavak Acar Sokak No:18 adresinde, Kayacık ve merkez mahalle bağlantısına yakın bahçe sokağında',
      sources: [
        [
          'Mandalin Bahçesi Resmi Sitesi',
          'https://www.mandalinbahcesi.com/',
          'operator',
          'Mandalina bahçesi içinde kahvaltı konsepti ve Acar Sokak No:18 konumu',
        ],
        [
          'BodrumDayasam & MesPrestiges — Mandalin Bahçesi',
          'https://www.bodrumdayasam.com.tr/',
          'editorial',
          'Ev yapımı meyve reçelleri, günlük börek, pişi, gözleme ve gölgeli bahçe masaları',
        ],
        [
          'BujuYollarda — Yalıkavak Kahvaltı Rehberi',
          'https://www.bujuyollarda.com/',
          'community',
          'Rezervasyon önerisi, sakin köy bahçesi atmosferi ve peynir-sucuk detayları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=7484362701359838979',
          'maps',
          'Yalıkavak, Acar Sk. No:18 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Mandalina ağaçlarının gölgesinde kalabalık sahil gürültüsünden uzak huzurlu atmosfer',
        'Ev yapımı narenciye reçelleri ve günlük sıcak hamur işleri',
      ],
      cons: [
        'Açık bahçe ağırlıklı olduğu için hava koşullarına bağımlıdır',
        'Bütçe seviyesi merkezdeki sade fırınlara göre üst-orta düzeyde kalıyor',
      ],
      unc: ['Sezon dışında ve yağışlı günlerde çalışma günleri değişebiliyor'],
    }),
    compactSeed({
      id: 'nar-cicegi-yalikavak',
      placeId: 'ChIJ8SORrmdxvhQRvaIZeZez7XQ',
      cat: 'kahvalti',
      brand: 'nar cicegi',
      area: 'Kayacık Cd., Yalıkavak',
      signals: ['ege_koy_kahvaltisi', 'kabak_cicegi_dolmasi', 'ozgun_receller'],
      verifiedAt: '2026-11-16',
      desc: "Kayacık Caddesi'nde meyve ağaçları arasında otlu gül böreği, kabak ve bal kabağı börekleri, mevsiminde kabak çiçeği dolması ve karpuz kabuğu gibi özgün reçelleriyle öne çıkan köy kahvaltı evi.",
      order: ['Ege Serpme Kahvaltısı', 'Otlu Gül Böreği & Kabak Böreği', 'Kabak Çiçeği Dolması'],
      menu: [
        'Serpme Köy Kahvaltısı',
        'Otlu Gül Böreği',
        'Kabak & Bal Kabağı Böreği',
        'Kabak Çiçeği Dolması',
        'Yaprak Sarma & Soslu Biber Kızartması',
        'Limon, Mandalina & Karpuz Kabuğu Reçeli',
        'Ezine & Lor Peyniri',
      ],
      sec: [
        [
          'Karpuz Kabuğu & Limon Reçelleri',
          'Bodrum mandalinası, limon ve karpuz kabuğu gibi ev yapımı reçeller kahvaltı masasının imza tatları arasındadır.',
          'Bodrum Mekanları ve Oggusto rehberi',
        ],
        [
          'Soslu Biber Kızartması & Bal Kabağı Böreği',
          'Klasik pişi ve peynir tabağı yanında yöresel Ege zeytinyağlıları ve fırın börekleri öne çıkar.',
          'Obilet ve KahvaltıdaNeVar kayıtları',
        ],
      ],
      seat: 'Meyve ve mandalina ağaçları altında gölgeli bahçe masaları',
      crowd: 'Hafta sonları ve yaz sabahlarında aileler ve gruplarla oldukça hareketli',
      dis: 'Sabah pik saatlerinde servis hızı yoğunluktan etkilenebiliyor; deniz manzarası yerine bahçe dokusu sunar',
      transit: 'Yalıkavak Kayacık Caddesi 42A adresinde, merkezden yürüyerek veya kısa araç sürüşüyle kolay ulaşılır',
      sources: [
        [
          'Oggusto — Bodrum Kahvaltı Mekanları (Nar Çiçeği)',
          'https://www.oggusto.com/',
          'editorial',
          'Yöresel Ege kahvaltısı, kabak çiçeği dolması ve bahçe atmosferi seçkisi',
        ],
        [
          'Obilet & KahvaltıdaNeVar — Nar Çiçeği Menüsü',
          'https://www.obilet.com/',
          'editorial',
          'Otlu gül böreği, kabak böreği, soslu biber kızartması ve sınırsız demlik çay doğrulaması',
        ],
        [
          'Bodrum Mekanları — Nar Çiçeği Reçel Seçkisi',
          'https://www.bodrummekanlari.com/',
          'community',
          'Limon, mandalina ve karpuz kabuğu reçelleri ile Kayacık Caddesi bahçe düzeni',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=8425587941033222845',
          'maps',
          'Yalıkavak, Kayacık Cd. 42A konum ve operasyon kaydı',
        ],
      ],
      pros: [
        'Börek çeşitliliği, kabak çiçeği dolması ve nadir bulunan ev yapımı reçellerle güçlü Ege mutfağı dokusu',
        'Merkez aksına yakın meyve bahçesi konumu',
      ],
      cons: [
        'Kalabalık tatil günlerinde bahçe masalarında servis yavaşlayabiliyor',
        'Kişi başı serpme düzeni tek tabak hafif kahvaltı arayanlara fazla gelebilir',
      ],
      unc: ['Kabak çiçeği dolması gibi taze ürünlerin varlığı mevsimine ve sabah hasadına bağlı değişebiliyor'],
    }),
    compactSeed({
      id: 'dirmil-koy-kahvaltisi-yalikavak',
      placeId: 'ChIJc2DDkaNxvhQRKZF5Oys8irg',
      cat: 'kahvalti',
      brand: 'dirmil',
      area: 'Dirmil Mevkii, Yalıkavak',
      signals: ['karakilcik_ekmek', 'odun_atesi_su_boregi', 'koy_evi_bahcesi'],
      verifiedAt: '2026-11-16',
      desc: "Dirmil köy dokusu içindeki bahçesinde karakılçık buğdayından ekşi mayalı ekmeği, sac bazlaması, odun ateşinde pişen peynirli su böreği ve yerel üretici peynirleriyle fiks köy kahvaltısı sunan bahçe.",
      order: ['Fiks Köy Kahvaltısı', 'Odun Ateşinde Peynirli Su Böreği', 'Karakılçık Ekmeği & Sac Bazlaması'],
      menu: [
        'Fiks Köy Kahvaltısı',
        'Odun Ateşinde Peynirli Su Böreği',
        'Ege Otlu Sac Gözleme',
        'Karakılçık Buğday Ekmeği & Bazlama',
        'Ege Menemeni & Köy Yumurtası',
        'Zeytinyağlı Yaprak Sarma & Kabak Çiçeği Dolması',
        'Bergamot, Acı Biber & Mandalina Reçelleri',
      ],
      sec: [
        [
          'Ege Otlu Gözleme & Zeytinyağlı Sarma',
          'Ispanak, pazı ve lor peyniriyle sacda pişen gözlemeler ve aromatik pirinçli yaprak sarma kahvaltıyı zenginleştirir.',
          'dirmilkoykahvaltisi.com resmi menüsü',
        ],
        [
          'Bergamot & Acı Biber Reçelleri',
          'Klasik mandalina ve çilek dışında acı biber ve bergamot gibi yerel reçel çeşitleri sunulur.',
          'dirmilkoykahvaltisi.com ürün listesi',
        ],
      ],
      seat: 'Doğal köy evi bahçesinde ağaçlar altında açık oturma alanı',
      crowd: 'Özellikle hafta sonu sabahları araçla gelen kahvaltı gruplarıyla canlı',
      dis: 'Fiks kahvaltıda temel ürünlerin ek tekrarında ek ücret uygulanabiliyor ve Dirmil içine ulaşım için araç gerekiyor',
      transit: 'Dirmil Mahallesi iç yolları üzerinde, Gökçebel-Yalıkavak hattından özel araçla kısa sürede erişilir',
      sources: [
        [
          'Dirmil Köy Kahvaltısı Resmi Sitesi',
          'http://www.dirmilkoykahvaltisi.com/',
          'operator',
          'Karakılçık ekmeği, odun ateşinde su böreği, bazlama, otlu gözleme ve reçel menüsü',
        ],
        [
          'NerdeNeRede & Yandex — Dirmil Köy Kahvaltısı',
          'https://nerdenerede.com/',
          'community',
          'Köy evi bahçesi atmosferi, Gökçebel-Dirmil konumu ve yerel ürün geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=13297507006143893801',
          'maps',
          'Dirmil, 48400 Bodrum/Muğla konum ve fiyat seviyesi kaydı',
        ],
      ],
      pros: [
        'Karakılçık buğday ekmeği, odun ateşinde su böreği ve kendi üretimleri olan zeytinlerle yüksek el emeği',
        'Turistik marina merkezinden uzak otantik köy bahçesi ortamı',
      ],
      cons: [
        'Toplu taşıma yerine özel araçla ulaşım çok daha pratik',
        'Mevsimlik ürünler (kabak çiçeği gibi) ve tekrar sipariş ek ücretleri döneme göre değişebiliyor',
      ],
      unc: ['Kış ve bahar geçiş dönemlerinde açık bahçe çalışma günleri hava durumuna göre düzenlenebiliyor'],
    }),

    // ==================== 6. MUTLAKA DENEMELİSİN ====================
    compactSeed({
      id: 'gelateria-lilith-natura-yalikavak',
      placeId: 'ChIJaRxvg-pxvhQRgF-o5Sbq5jg',
      cat: 'denemelisin',
      brand: 'lilith',
      area: 'Çökertme Cd., Yalıkavak',
      signals: ['artizan_gelato', 'bodrum_mandalina_sorbe', 'katkisiz_gunluk_uretim'],
      verifiedAt: '2026-11-16',
      desc: "İtalya'da gelato eğitimi almış bir biyokimya uzmanı ve çocuk doktoru çiftin kurduğu; yapay aroma, gıda boyası ve UHT süt kullanmadan günlük meyve ve sütle üretim yapan artizan dondurmacı.",
      order: ['Bodrum Mandalinası Sorbe', 'Tiramisu Gelato', 'Vegan Badem Sütlü Balkabağı'],
      menu: [
        'Bodrum Mandalinası Sorbe',
        'Karadut & Vişne Sorbe',
        'Fior di Latte & Antep Fıstıklı Gelato',
        'Tiramisu Gelato',
        'Vegan Badem Sütlü Çeşitler',
        'Şekersiz / Düşük Glisemik İndeksli Seri',
        'İtalyan Espresso & Ev Yapımı Tatlılar',
      ],
      sec: [
        [
          'Düşük Glisemik İndeksli & Şekersiz Seri',
          'İlave şekersiz tatlı ve dondurma alternatifleri yanında günlük sınırlı sayıda çıkan ev yapımı tiramisu ve cheesecake bulunur.',
          'Tab.Travel ve YouTube röportaj kayıtları',
        ],
        [
          'Fior di Latte & İtalyan Espresso Eşleşmesi',
          'Klasik İtalyan dondurma çeşitleri taze çekilmiş espresso veya filtre kahve ile birlikte sunulur.',
          'Trip.com ve Yerels kayıtları',
        ],
      ],
      seat: 'Çökertme Caddesi üzerinde keyifli küçük bahçe ve sokak önü masaları; evcil hayvan dostu',
      crowd: 'Akşamüstü ve gece geç saatlere kadar yürüyüş sonrası dondurma molası verenlerle canlı',
      dis: 'Butik günlük üretim yapıldığı için gün sonunda bazı popüler sorbe ve özel tatlar tükenebiliyor',
      transit: 'Yalıkavak Çökertme Caddesi No:29 D:E adresinde, marina giriş otoparkına birkaç adım mesafede',
      sources: [
        [
          'Gelateria Lilith Resmi Sitesi',
          'http://www.gelaterialilith.com/',
          'operator',
          'Doğal ve katkısız İtalyan gelato üretim felsefesi ve Yalıkavak adresi',
        ],
        [
          'Tab.Travel & Yandex — Gelateria Lilith Natura',
          'https://tab.travel/',
          'editorial',
          'Biyokimya uzmanı ve çocuk doktoru kurucular, Bodrum mandalina sorbe, vegan ve düşük GI serisi detayları',
        ],
        [
          'Trip.com & Yerels — Gelateria Lilith İncelemeleri',
          'https://www.trip.com/',
          'community',
          'Fior di latte, tiramisu, kahve seçenekleri ve gece geç saatlere uzanan bahçe ortamı',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=4100221963550089088',
          'maps',
          'Yalıkavak, Çökertme Cd. No:29 D:E konum kaydı',
        ],
      ],
      pros: [
        'Biyokimya disipliniyle katkısız, UHT sütsüz gerçek İtalyan gelato ve Bodrum mandalinası sorbe kalitesi',
        'Vegan ve şekersiz seçenekleriyle her beslenme tercihine duyarlı artizan mutfak',
      ],
      cons: [
        'Sınırlı günlük parti üretiminden dolayı geç saatlerde tüm çeşitler kalmayabiliyor',
        'Oturma bahçesi büyük gruplardan ziyade kısa mola ve çiftler için ideal',
      ],
      unc: ['Sezon dışında dondurma çeşit sayısı talebe göre daraltılabiliyor'],
    }),
    compactSeed({
      id: 'aloha-bakery-yalikavak',
      placeId: 'ChIJzzQ2aVxxvhQRc1Q3wN4BoyI',
      cat: 'denemelisin',
      secondaryCategoryIds: ['kahvalti'],
      brand: 'aloha',
      area: 'Çarşı Cd., Yalıkavak',
      signals: ['fransiz_firincilik', 'taze_kruvasan', 'eksi_maya_ekmek'],
      verifiedAt: '2026-11-16',
      desc: "Çarşı Caddesi'nde Fransız fırıncılık tekniğinden ilhamla günlük el yapımı tatlı-tuzlu kruvasanlar, ekşi mayalı ekmekler ve pesto-avokadolu tostlar çıkaran butik fırın ve kahvaltı durağı.",
      order: ['Somon Füme Kruvasan', 'Hollandez Soslu Göz Yumurtalı Kruvasan', 'Ekşi Maya Avokado Tost'],
      menu: [
        'Sade Tereyağlı Kruvasan',
        'Somon Füme Kruvasan',
        'Hollandez Soslu & Yumurtalı Kruvasan',
        'Bal & Kaymaklı Kruvasan',
        'Ekşi Maya Avokado Tost',
        'Ekşi Maya Baget & Ekmekler',
        'Ev Yapımı Brownie & Glütensiz Kek',
      ],
      sec: [
        [
          'Sade Tereyağlı & Bal-Kaymaklı Kruvasan',
          'Tuzlu kahvaltı kruvasanları dışında çıtır katmanlı sade ve tatlı kruvasanlar sabah fırınından taze çıkar.',
          'Marie Claire Türkiye ve Yemeksepeti kayıtları',
        ],
        [
          'Ev Yapımı Brownie & Glütensiz Kek',
          'Günlük pasta vitrininde tartlar, brownie ve glütensiz kek alternatifleri yer alır.',
          'Pause Dergi ve Yemeksepeti menü listesi',
        ],
      ],
      seat: 'Çarşı Caddesi cephesinde sıcak dış oturma alanı ve vitrin önü küçük masalar',
      crowd: 'Sabah kahvaltı ve öğlen brunch saatlerinde kruvasan molası verenlerle canlı',
      dis: 'Serpme köy kahvaltısı yerine daha hafif fırın-kruvasan konseptindedir; yoğun sabahlarda sıcak kruvasanlar hızlı tükenebilir',
      transit: 'Yalıkavak Çarşı Caddesi No:98 civarında, denize ve çarşı merkezine çok kısa yürüyüş mesafesinde',
      sources: [
        [
          'Marie Claire Türkiye — Aloha Bakery Yalıkavak',
          'https://www.marieclaire.com.tr/',
          'editorial',
          'Fransız fırıncılık ilhamı, ekşi maya ekmekler, baget ve kahvaltı-brunch konsepti',
        ],
        [
          'Pause Dergi — Yalıkavak Aloha Bakery',
          'https://www.pausedergi.com/',
          'editorial',
          'El yapımı kruvasan çeşitleri, ev yapımı brownie, tart ve glütensiz kek vurgusu',
        ],
        [
          'Yemeksepeti & Kaçıyor — Aloha Bakery Menüsü',
          'https://www.yemeksepeti.com/',
          'community',
          'Somon Füme Kruvasan, Hollandez Soslu Kruvasan ve Pesto-Avokado Tost detayları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=2495840674712605811',
          'maps',
          'Yalıkavak, Çarşı Cd. konum ve fiyat seviyesi doğrulaması',
        ],
      ],
      pros: [
        'Yalıkavak merkezde ağır serpme sofralara alternatif modern kruvasan ve ekşi maya fırını',
        'Hem tuzlu hem tatlı hamur işi ve kahvaltı tabağı çeşitliliği',
      ],
      cons: [
        'Çarşı caddesi üzerindeki masa sayısı sınırlı olduğundan pik saatlerde beklemek gerekebiliyor',
        'Geç saatlerde fırın ürünlerinin tamamı kalmayabilir',
      ],
      unc: ['Sezon dışı dönemlerde günlük çıkarılan fırın ürünü sayısı azalabiliyor'],
    }),
    compactSeed({
      id: 'pina-restaurant-yalikavak',
      placeId: 'ChIJqazz0GpxvhQRPKyeqiTseIg',
      cat: 'denemelisin',
      brand: 'pina',
      area: 'Plaj Cd., Yalıkavak',
      signals: ['dalga_kenari_mola', 'ev_yapimi_limonata', 'rahat_plaj_mutfagi'],
      verifiedAt: '2026-11-16',
      desc: "Plaj Caddesi No:34'te denizin hemen kıyısında ücretsiz şezlong imkanı, dalga sesleri eşliğinde taze tavuk wrap, patates, ev yapımı limonata ve deniz ürünleri sunan samimi aile sahil işletmesi.",
      order: ['Tavuk Wrap & Patates Kızartması', 'Ev Yapımı Limonata', 'Günlük Deniz Ürünleri & Mezeler'],
      menu: [
        'Tavuk Wrap & Patates',
        'Türk Kahvaltısı & Brunch',
        'Ev Yapımı Limonata',
        'Günlük Mezeler & Deniz Ürünleri',
        'Burger & Sahil Atıştırmalıkları',
        'Türk Kahvesi & Ev Kekleri',
      ],
      sec: [
        [
          'Ev Yapımı Limonata & Taze Kekler',
          'Deniz dönüşü veya gün içi plaj molasında ferahlatıcı ev yapımı limonata ve kahve eşlikçileri öne çıkar.',
          'Yandex ve Eatbu değerlendirmeleri',
        ],
        [
          'Sabah Kahvaltısı & Sahil Mezeleri',
          'Günün farklı saatlerinde kahvaltıdan akşamüstü mezesine uzanan sade aile mutfağı sunar.',
          'Eatbu ve Wanderlog kayıtları',
        ],
      ],
      seat: 'Plaj Caddesi üzerinde doğrudan kumsal ve deniz kenarı masaları ile şezlong alanı',
      crowd: 'Gündüz plaj kullanıcıları ve ailelerle sakin-samimi sahil temposunda',
      dis: 'Gündelik plaj restoranı formatında olduğu için gastronomi fine-dining beklentisi yerine sade lezzet sunar',
      transit: 'Yalıkavak Plaj Caddesi No:34 adresinde, merkez sahil yürüyüşüyle kolay ulaşılır',
      sources: [
        [
          'Yandex Haritalar — Pina Restaurant & Beach',
          'https://yandex.com.tr/',
          'community',
          'Plaj Cd. No:34 konumu, ücretsiz şezlong imkanı, ev yapımı limonata ve deniz ürünleri',
        ],
        [
          'Wanderlog & Eatbu — Pina Restaurant Yalıkavak',
          'https://wanderlog.com/',
          'community',
          'Tavuk wrap, patates kızartması, kahvaltı ve samimi aile sahil ortamı değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=9833869428588981308',
          'maps',
          'Yalıkavak, Plaj Cd. No:34 konum ve operasyon kaydı',
        ],
      ],
      pros: [
        'Yalıkavak yüksek fiyatlı beach club düzenine karşı abartısız ve bütçe dengeli sahil işletmesi',
        'Gün boyu plajdan yemeğe kesintisiz erişim imkanı',
      ],
      cons: [
        'Kış sezonunda kapalı veya kısıtlı saatlerde olabiliyor',
        'Sade sahil kafe-restoranı düzeyinde menü çeşitliliği sunar',
      ],
      unc: ['Sezon içi yoğunlukta şezlong doluluğu sabah saatlerinde artabiliyor'],
    }),

    // ==================== 7. BALIKÇILAR & DENİZ ÜRÜNLERİ ====================
    compactSeed({
      id: 'cardakli-restaurant-yalikavak',
      placeId: 'ChIJve-HzCNxvhQRMQ7TisZRXd4',
      cat: 'balik',
      brand: 'cardakli',
      area: 'İskele Cd., Yalıkavak',
      signals: ['iskelenin_klasigi', 'taze_ege_mezeleri', 'samimi_meyhane'],
      verifiedAt: '2026-11-16',
      name: 'Çardaklı Restaurant',
      desc: "Yalıkavak İskele ve balıkçı barınağı yanında marina şatafatından uzak, günlük taze Ege otları, zeytinyağlı mezeleri ve mevsiminde kıyı balıklarıyla hizmet veren köklü sahil meyhanesi.",
      order: ['Günlük Taze Izgara Balık', 'Zeytinyağlı Ege Otları & Mezeler', 'Kalamar & Karides Güveç'],
      menu: [
        'Günlük Av Mevsim Balıkları',
        'Zeytinyağlı Ege Otları',
        'Kalamar Tava & Izgara',
        'Karides Güveç',
        'Yoğurtlu & Domatesli Mezeler',
        'Fiks Rakı-Balık Menüsü',
      ],
      sec: [
        [
          'Karides Güveç & Ara Sıcak Ot Kavurmaları',
          'Soğuk meze tezgahından sonra masaya gelen sıcak deniz mahsulleri ve ot kavurmaları akşam sofrasını tamamlar.',
          'Bodrum Meyhaneleri ve Meyhankoli kayıtları',
        ],
      ],
      seat: 'İskele Caddesi kıyısında deniz esintili açık çardak masaları ve iç salon',
      crowd: 'Akşam yemeği ve gün batımında sakin rakı-balık sohbeti arayan müdavimlerle dolu',
      dis: 'Güncel balık ve meze fiyatları tezgah üzerinden mevsimine göre belirlenir; yaz akşamları önceden yer ayırtmak gerekir',
      transit: 'Yalıkavak İskele Caddesi No:13/A adresinde, balıkçı barınağı ve eski iskele kıyısında yürüyüş mesafesinde',
      sources: [
        [
          'Çardaklı Restaurant Resmi Sitesi',
          'http://www.cardaklirestaurant.com/',
          'operator',
          'İskele Caddesi konumu, meyhane ve taze balık restoranı bilgileri',
        ],
        [
          'Yemek.com & Bodrum Meyhaneleri — Çardaklı Restaurant',
          'https://yemek.com/',
          'editorial',
          'Balıkçı barınağı yanında huzurlu atmosfer, günlük Ege mezeleri ve balık seçenekleri',
        ],
        [
          'Meyhankoli & Yandex — Çardaklı Yalıkavak',
          'https://www.meyhankoli.com/',
          'community',
          'Taze ot mezeleri, ara sıcaklar ve sakin servis geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=16023052962428554801',
          'maps',
          'Yalıkavak, İskele Cd. 13/A konum ve fiyat seviyesi doğrulaması',
        ],
      ],
      pros: [
        'Yalıkavak balıkçı barınağı dokusunda dingin ve samimi klasik Ege meyhanesi atmosferi',
        'Günlük hazırlanan yerel Ege otları ve taze balık tezgahı',
      ],
      cons: [
        'Üst fiyat segmentinde yer aldığı için sipariş öncesi balık tezgahından bilgi almak yararlıdır',
        'Marina içi gösterişli mekanlara kıyasla daha sade bir dekorasyona sahiptir',
      ],
      unc: ['Günlük av durumuna göre tezgah balıkları mevsime bağlı farklılık gösterebiliyor'],
    }),
    compactSeed({
      id: 'mynos-restaurant-yalikavak',
      placeId: 'ChIJmf6DTFdxvhQRcCKE106D0hY',
      cat: 'balik',
      brand: 'mynos',
      area: 'Çökertme Cd., Yalıkavak',
      signals: ['levrek_simit', 'karides_manti', 'gun_batimi_kiyisi'],
      verifiedAt: '2026-11-16',
      desc: "Çökertme Caddesi sahil şeridinde gün batımına karşı konumlanan; klasik Ege mezeleri yanında levrek simit ve karides mantı gibi özgün deniz mahsulü ara sıcaklarıyla tanınan kıyı balıkçısı.",
      order: ['Levrek Simit', 'Karides Mantı', 'Girit Meze & Ahtapot Izgara'],
      menu: [
        'Levrek Simit',
        'Karides Mantı',
        'Girit Meze & İsli Balık',
        'Ahtapot Izgara',
        'Kalamar Tava & Izgara',
        'Zeytinyağlı Enginar & Şakşuka',
        'Asma Yaprağında Hellim',
        'Günün Taze Balıkları',
      ],
      sec: [
        [
          'Girit Meze, İsli Balık & Zeytinyağlı Enginar',
          'Geniş soğuk meze büfesi özgün peynirli-fıstıklı mezeler ve klasik Ege zeytinyağlılarını bir arada sunar.',
          'mynos.com.tr resmi menüsü',
        ],
        [
          'Ahtapot Izgara & Asma Yaprağında Hellim',
          'Ana balık öncesi ızgara deniz ürünleri ve sıcak başlangıçlar akşamın öne çıkan eşlikçileridir.',
          'mynos.com.tr ve MyGuideBodrum kayıtları',
        ],
      ],
      seat: 'Çökertme Caddesi kıyısında doğrudan deniz cepheli gün batımı masaları',
      crowd: 'Gün batımından itibaren tam kapasiteye yakın akşam yemeği yoğunluğu',
      dis: 'Deniz sıfır konumu ve yüksek fiyat segmenti nedeniyle hesap tutarı seçilen balık ve mezelere göre hızla yükselebiliyor',
      transit: 'Yalıkavak Çökertme Caddesi No:32 üzerinde, marinadan Gerişaltı sahil bandına yürüyüş veya kısa araç mesafesinde',
      sources: [
        [
          'Mynos Restaurant Resmi Menü',
          'http://mynos.com.tr/',
          'operator',
          'Levrek Simit, Karides Mantı, Girit Meze, İsli Balık, Ahtapot Izgara ve tam menü kataloğu',
        ],
        [
          'MyGuideBodrum — Mynos Restaurant Yalıkavak',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Gün batımı konumu, meze büfesi, taze balık tezgahı ve kokteyl-şarap eşleşmesi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=1644521188590101104',
          'maps',
          'Yalıkavak, Çökertme Cd. No:32 konum doğrulaması',
        ],
      ],
      pros: [
        'Klasik balıkçılardan ayrılan Levrek Simit ve Karides Mantı gibi özgün imza ara sıcakları',
        'Gerişaltı-Çökertme aksında doğrudan gün batımı manzaralı masa düzeni',
      ],
      cons: [
        'Yüksek fiyat segmentinde yer alır; ön rezervasyon olmadan gün batımı masası bulmak güçtür',
        'Yoğun yaz akşamlarında servis hızı yavaşlayabiliyor',
      ],
      unc: ['Kış sezonunda çalışma gün ve saatleri mevsime bağlı sınırlanabiliyor'],
    }),
    compactSeed({
      id: 'kahraman-bodrum-yalikavak',
      placeId: 'ChIJQTwZzVRwvhQRYJLGSxm7llE',
      cat: 'balik',
      brand: 'kahraman',
      area: 'Şendoğan Cd. (Dirmil), Yalıkavak',
      signals: ['dirmil_sahili', 'kahraman_usta', 'gun_batimi_balik'],
      verifiedAt: '2026-11-16',
      name: 'Kahraman Bodrum',
      desc: "Dirmil-Gökçebel sahilinde Kahraman Korkmaz ve ailesi tarafından işletilen; deniz ürünlü şevketi bostan, levrek marine ve tereyağlı karides gibi spesiyalleri gün batımına karşı sunan kıyı balıkçısı.",
      order: ['Deniz Ürünlü Şevketi Bostan', 'Levrek Marine & Ahtapot Izgara', 'Kalamar Şiş & Peynir Helvası'],
      menu: [
        'Deniz Ürünlü Şevketi Bostan',
        'Levrek Marine',
        'Tereyağlı Karides',
        'Kalamar Şiş',
        'Ahtapot Izgara',
        'Günlük Taze Balıklar (Levrek / Çipura)',
        'Sıcak Peynir Helvası',
      ],
      sec: [
        [
          'Tereyağlı Karides & Kalamar Şiş',
          'Soğuk Ege otları sonrasında masaya gelen sıcak deniz ürünleri balık öncesi en çok övgü alan ara sıcaklardır.',
          'Restoranim ve Bodrun.org değerlendirmeleri',
        ],
        [
          'Geleneksel Peynir Helvası',
          'Deniz mahsullü akşam yemeğinin ardından tatlı kapanış olarak sıkça önerilir.',
          'Restoranim Dirmil-Yalıkavak kayıtları',
        ],
      ],
      seat: 'Şendoğan Caddesi üzerinde denize sıfır ferah açık masa düzeni ve kapalı salon',
      crowd: 'Gün batımı saatlerinden itibaren akşam yemeği rezervasyonlarıyla düzenli yoğun',
      dis: 'Yalıkavak merkezinden araçla birkaç dakika uzakta Dirmil koyunda kalır; üst fiyat segmentindedir',
      transit: 'Dirmil (Gökçebel) Şendoğan Caddesi üzerinde, Yalıkavak merkezden Küdür-Gökçebel sahil yoluyla ulaşılır',
      sources: [
        [
          'Bodrun.org — Kahraman Bodrum (Kahraman Usta)',
          'https://www.bodrun.org/',
          'editorial',
          'Kahraman Korkmaz aile işletmesi, Dirmil-Gökçebel deniz kıyısı konumu ve rezervasyon notu',
        ],
        [
          'Restoranim & Mekanlar — Kahraman Bodrum Değerlendirmeleri',
          'https://www.restoranim.net/',
          'community',
          'Deniz ürünlü şevketi bostan, tereyağlı karides, kalamar şiş, ahtapot ızgara ve peynir helvası',
        ],
        [
          'Yandex Haritalar — Kahraman Bodrum Dirmil',
          'https://yandex.com.tr/',
          'community',
          'Şendoğan Cad. No:15 konumu ve günlük balık tezgahı doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=5879092080898642528',
          'maps',
          'Dirmil, Şendoğan Cd., 48965 Bodrum/Muğla konum doğrulaması',
        ],
      ],
      pros: [
        'Marina kalabalığından uzak, Dirmil sahilinde aile işletmesi sıcaklığı ve güçlü meze dokunuşları',
        'Deniz ürünlü şevketi bostan gibi yöresel Ege otlarını balıkla buluşturan tabaklar',
      ],
      cons: [
        'Merkez çarşıdan yürüyüş mesafesinde değil; özel araç veya taksi gerektirir',
        'Gün batımı masaları kısıtlı olduğundan önceden rezervasyon yapılmadan yer bulmak zor olabiliyor',
      ],
      unc: ['Sabit basılı menü yerine günlük meze dolabı ve avlanan balık çeşitleri mevsime göre değişiyor'],
    }),
    compactSeed({
      id: 'yalikavak-iskele-balikcisi',
      placeId: 'ChIJh-4LeGlxvhQRMgXf4A3M4w8',
      cat: 'balik',
      brand: 'yalikavak iskele',
      area: 'Çökertme Cd. (Gerişaltı), Yalıkavak',
      signals: ['gerisalti_sahili', 'gunluk_av_tezgahi', 'klasik_rakibalik'],
      verifiedAt: '2026-11-16',
      name: 'Yalıkavak İskele Balıkçısı',
      desc: "Çökertme Caddesi'nin Gerişaltı sahil uzantısında deniz kıyısında hizmet veren; fava, deniz börülcesi, lakerda gibi klasik mezelerle günlük kıyı balıklarını bir araya getiren balıkçı.",
      order: ['Günlük Kıyı Balığı (Barbun / Tekir / Levrek)', 'Lakerda & Deniz Börülcesi', 'Kalamar Tava & Karides Güveç'],
      menu: [
        'Barbun, Tekir & Levrek',
        'Fava & Deniz Börülcesi',
        'Lakerda & Levrek Marin',
        'Kalamar Tava',
        'Karides Güveç',
        'Balık Kokoreç & Ot Kavurmaları',
      ],
      sec: [
        [
          'Fava, Lakerda & Levrek Marin',
          'Soğuk meze dolabından seçilen klasik Ege başlangıçları günlük tezgah balığına eşlik eder.',
          'Bodrum Meyhaneleri ve RestoranClub kayıtları',
        ],
        [
          'Karides Güveç & Kalamar Tava',
          'Ana yemek öncesi klasik meyhane sıcakları tercih edilen seçenekler arasındadır.',
          'Bodrum Meyhaneleri menü notları',
        ],
      ],
      seat: 'Deniz kenarında açık sahil masaları ve iç mekan oturma alanı',
      crowd: 'Akşam yemeği saatlerinde ve grup organizasyonlarında düzenli yoğunluk',
      dis: 'Yüksek fiyat segmentinde yer alır; grup fiks menü veya porsiyon seçimine göre fiyat farkı oluşabiliyor',
      transit: 'Çökertme Merkez Caddesi No:58 (Gerişaltı sahil aksı) üzerinde, Yalıkavak Marina batı devamında yer alır',
      sources: [
        [
          'RestoranClub & Yandex — Yalıkavak İskele Balıkçısı',
          'https://www.restoranclub.com/',
          'community',
          'Gerişaltı Çökertme Caddesi No:58 sahil konumu ve meyhane mutfağı',
        ],
        [
          'Bodrum Meyhaneleri — İskele Balıkçısı Menü Seçenekleri',
          'https://www.bodrummeyhaneleri.com/',
          'community',
          'Soğuk mezeler, ara sıcaklar, günlük balık çeşitleri ve grup fiks menü detayları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=1144983090261591346',
          'maps',
          'Geriş, Çökertme Merkez Cd. No:58 konum ve operasyon kaydı',
        ],
      ],
      pros: [
        'Yalıkavak batı sahil yürüyüş aksı üzerinde geleneksel meze-balık dengesi',
        'Hem alakart tezgah seçimi hem de kalabalık gruplara uygun fiks düzen imkanı',
      ],
      cons: [
        'Yalıkavak Marina çevresinden araç veya uzun kıyı yürüyüşüyle ulaşılıyor',
        'Yüksek sezon akşamlarında grup masaları nedeniyle ortam gürültülü olabiliyor',
      ],
      unc: ['Fiks menü içeriği ve günlük kıyı balığı çeşitleri sezona göre değişebiliyor'],
    }),
    compactSeed({
      id: 'memedof-balik-yalikavak',
      placeId: 'ChIJJ2SLwVVxvhQRBW5Ezry6Dh0',
      cat: 'balik',
      brand: 'memedof',
      area: 'Çökertme Cd. (Gerişaltı), Yalıkavak',
      signals: ['bodrum_kurumu_2001', 'gunun_tekne_avi', 'gun_batimi_kiyisi'],
      flags: { iconic: true, heritage: true },
      verifiedAt: '2026-11-16',
      desc: "Bodrum'un 2001 kuruluşlu köklü balık kurumu Memedof'un Çökertme Caddesi sahilindeki adresi; sabit liste yerine günlük tekne avına dayanan taze balıkları, dülger kavurma ve zengin meze dolabıyla tanınır.",
      order: ['Günün Tekne Avı Balığı', 'Dülger Kavurma & Ahtapot', 'Balık Pastırması & Kabak Çiçeği Dolması'],
      menu: [
        'Günlük Tekne Avı Balıklar (Lüfer / Fangri / Akya)',
        'Dülger Kavurma',
        'Balık Pastırması & Lakerda',
        'Levrek Marin',
        'Kabak Çiçeği Dolması',
        'Ahtapot Izgara',
      ],
      sec: [
        [
          'Balık Pastırması, Lakerda & Kabak Çiçeği Dolması',
          'Soğuk meze vitrininden seçilen deniz ürünleri ve Ege zeytinyağlıları uzun yıllardır mutfağın imza başlangıçlarını oluşturur.',
          'Üşengeç Şef ve MesPrestiges incelemeleri',
        ],
        [
          'Ahtapot & Deniz Mahsullü Ara Sıcaklar',
          'Ana balık öncesi sıcak deniz ürünü tabakları masa paylaşımında öne çıkar.',
          'Üşengeç Şef Yalıkavak değerlendirmesi',
        ],
      ],
      seat: 'Gerişaltı kıyısında denize sıfır gün batımı masaları ve iç salon',
      crowd: 'Özellikle yaz akşamları ve hafta sonları tam kapasite yoğun',
      dis: 'Üst segment yüksek fiyat seviyesi ve ağustos cumartesileri başta olmak üzere yoğun sezonda servis temposu konusunda eleştiriler alabiliyor; mutlaka önceden rezervasyon gerektirir',
      transit: 'Çökertme Caddesi No:42 (Gerişaltı mevkii) adresinde, Mynos yanında sahil bandında yer alır',
      sources: [
        [
          'Memedof Resmi Sitesi',
          'https://www.memedof.com/en',
          'operator',
          '2001 Bodrum kuruluş geçmişi, Yalıkavak Çökertme Cd. No:42 şubesi ve günlük taze balık alakart yapısı',
        ],
        [
          'Gault & Millau Türkiye — Memedof Bodrum (1 Toque)',
          'https://www.gault-millau.com.tr/',
          'award',
          '12/20 1 Toque derecelendirmesi, günlük tekne avı menü disiplini ve meze kalitesi',
        ],
        [
          'Üşengeç Şef & MesPrestiges — Memedof Yalıkavak',
          'https://www.usengecsef.com/',
          'editorial',
          'Levrek marin, lakerda, balık pastırması, kabak çiçeği dolması, dülger kavurma ve yoğun sezon rezervasyon notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=2093816196851068421',
          'maps',
          'Gerişaltı mevkii, Çökertme Cd. No:42 konum doğrulaması',
        ],
      ],
      pros: [
        'Bodrum gastronomisinde çeyrek asra yaklaşan köklü kurum kimliği ve günlük tekne avına sadık mutfak',
        'Marina kalabalığından ayrı duran Gerişaltı sahilinde klasik gün batımı konumu',
      ],
      cons: [
        'Büyük boy günlük balık seçimleri ve yüksek sezon fiyatlaması hesabı ciddi ölçüde yukarı taşıyabiliyor',
        'Pik saatlerdeki yoğunluk servis hızına ve puan ortalamasına olumsuz yansıyabiliyor',
      ],
      unc: ['Günlük avlanan balık çeşitleri deniz koşullarına göre her akşam değişiklik gösterir'],
    }),

    // ==================== NEGATİF DENETİM KONTROLLERİ ====================
    // Kapı 1 — Geçici Kapalı İşletmeler (CLOSED_TEMPORARILY)
    negControl(
      'ctrl-zuma-bodrum-yalikavak',
      'ChIJa2fsA0VxvhQRTnH-a2Blhkc',
      'date',
      'Kapı 1 ihlali: Zuma Bodrum önbellekte CLOSED_TEMPORARILY statüsünde'
    ),
    negControl(
      'ctrl-novikov-bodrum-yalikavak',
      'ChIJ-WF2YTVxvhQRL8iZUOBK1-s',
      'date',
      'Kapı 1 ihlali: Novikov Bodrum önbellekte CLOSED_TEMPORARILY statüsünde'
    ),
    negControl(
      'ctrl-nusret-yalikavak',
      'ChIJt2KH_mtxvhQRCxgZx5d5Eg8',
      'date',
      'Kapı 1 ihlali: Nusr-Et Steakhouse Yalıkavak Marina CLOSED_TEMPORARILY ve zincir'
    ),
    negControl(
      'ctrl-bagatelle-bodrum-yalikavak',
      'ChIJg1zJA6JxvhQRysBKsOZ0Chc',
      'date',
      'Kapı 1 ihlali: Bagatelle Bodrum CLOSED_TEMPORARILY ve ★3.4 puan'
    ),

    // Kapı 2 — Zincir, Franchise ve Çok Şubeli Markalar
    negControl(
      'ctrl-starbucks-yalikavak',
      'ChIJt2KH_mtxvhQReVLT9dAPgLM',
      'kahve',
      'Kapı 2 ihlali: Starbucks küresel kahve zinciri (CHAIN_BLOCKLIST)'
    ),
    negControl(
      'ctrl-meet-lab-yalikavak',
      'ChIJg3g0zwptvhQRAy1ugcNLB4Q',
      'kahve',
      'Kapı 2 ihlali: Meet Lab Coffee İstanbul (Suadiye/Caddebostan/Moda/Ataşehir) ve Bodrum çok şubeli zincir'
    ),
    negControl(
      'ctrl-blak-coffee-yalikavak',
      'ChIJ43eVvWZtvhQRHOAnqHlhUls',
      'kahve',
      'Kapı 2 & Kapı 6 ihlali: BLAK Coffee Co. 50+ şubeli franchise ağı ve ★3.5 (14)'
    ),
    negControl(
      'ctrl-nespresso-yalikavak',
      'ChIJb7gD_GpxvhQRfL1FEWztWx0',
      'kahve',
      'Kapı 2 & Kapı 3 ihlali: Nespresso küresel kapsül kahve mağaza zinciri (food_store)'
    ),
    negControl(
      'ctrl-huqqa-yalikavak',
      'ChIJe5QLRVtxvhQRUM-NtWPCBuc',
      'date',
      'Kapı 2 ihlali: HuQQa ulusal ve uluslararası çok şubeli restoran/nargile zinciri'
    ),
    negControl(
      'ctrl-bodrum-manti-yalikavak',
      'ChIJcRKpB3BxvhQRnRSyhRBeVI0',
      'denemelisin',
      'Kapı 2 ihlali: Bodrum Mantı çok şubeli zincir (CHAIN_BLOCKLIST)'
    ),
    negControl(
      'ctrl-mado-yalikavak',
      'ChIJ77LmsFxxvhQRjlmCpFjlqzk',
      'kahvalti',
      'Kapı 2 & Kapı 6 ihlali: MADO zinciri (CHAIN_BLOCKLIST) ve ★2.9 puan'
    ),
    negControl(
      'ctrl-gunaydin-yalikavak',
      'ChIJrx6epVxxvhQRmmXb3ziySSM',
      'denemelisin',
      'Kapı 2 & Kapı 6 ihlali: Günaydın Kebap zinciri (CHAIN_BLOCKLIST) ve ★2.8 puan'
    ),
    negControl(
      'ctrl-godiva-yalikavak',
      'ChIJseL4-flxvhQRV6-Nb73ueao',
      'denemelisin',
      'Kapı 2 & Kapı 6 ihlali: Godiva küresel çikolata mağaza zinciri ve ★3.9 puan'
    ),
    negControl(
      'ctrl-tarihi-kuzguncuk-yalikavak',
      'ChIJH6Qdb5BxvhQR4UwZgDEhp4M',
      'kahvalti',
      'Kapı 2 ihlali: Tarihi Kuzguncuk Fırını İstanbul çok şubeli franchise fırın ağı'
    ),
    negControl(
      'ctrl-five-oclock-yalikavak',
      'ChIJAeJLRa5xvhQR_ciEhXgQfvQ',
      'denemelisin',
      'Kapı 2 & Kapı 6 ihlali: Five O Clock İstanbul/Bodrum çok şubeli pastane zinciri ve ★4.1 puan'
    ),
    negControl(
      'ctrl-mua-gelatieri-yalikavak',
      'ChIJVwRhb69xvhQRac6D2LKsd6E',
      'denemelisin',
      'Kapı 2 & Kapı 6 ihlali: Muà Gelatieri çok şubeli dondurma zinciri ve ★3.1 puan'
    ),
    negControl(
      'ctrl-gurkan-sef-yalikavak',
      'ChIJTdwAhsxxvhQRrt613sAN9Ls',
      'hamburger',
      'Kapı 2 & Kapı 6 ihlali: Gürkan Şef çok şubeli steakhouse zinciri ve 4 değerlendirme'
    ),
    negControl(
      'ctrl-karaarslan-et-yalikavak',
      'ChIJnb_0iJtxvhQRmfSrpOvFC2k',
      'denemelisin',
      'Kapı 2 & Kapı 3 ihlali: Karaarslan Et çok şubeli İstanbul/Sakarya/Bodrum et markası ve butcher_shop'
    ),

    // Kapı 3, Kapı 3B & Kapı 8 — Tür Dışı, Nargile Salonu & Yetersiz Bağımsız Kanıt Kontrolleri
    negControl(
      'ctrl-yalikavak-marina',
      'ChIJ_759OOxxvhQRXZc1KZwApPw',
      'date',
      'Kapı 3 ihlali: Yalıkavak Marina marina/shopping_mall türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-yaz-yalikavak-hotel',
      'ChIJp7oBLENxvhQRgRe3WfOEeg8',
      'date',
      'Kapı 3 ihlali: YAZ Yalıkavak hotel türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-marina-garden-hotel-yalikavak',
      'ChIJJSJ6C1txvhQRqFhsYHP_aGM',
      'date',
      'Kapı 3 ihlali: Yalikavak Marina Garden Hotel hotel türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-gunay-restaurant-yalikavak',
      'ChIJjV2k6eRtvhQR1eteoKzJo6M',
      'date',
      'Kapı 3 ihlali: Günay Restaurant Yalıkavak event_venue türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-mavra-shisha-yalikavak',
      'ChIJ-1x79K5xvhQRor8MAOVD_Wc',
      'kahve',
      'Kapı 3B & Kapı 8 ihlali: Mavra Cafe Bistro Shisha Nargile hookah_bar/night_club nargile salonu, saf kahveci değil'
    ),
    negControl(
      'ctrl-coaster-coffee-yalikavak',
      'ChIJKZya8EtxvhQRvaQBS-iUWFI',
      'kahve',
      'Kapı 6 ihlali: The Coaster Coffee Roastery yalnızca 1 değerlendirme (35 alt sınırı altında)'
    ),
    negControl(
      'ctrl-dno-yalikavak',
      'ChIJ00jrNwBxvhQRMYMU_b0Sl2g',
      'kahve',
      'Kapı 8 ihlali: D’no Yalıkavak ★5.0 (41) için bağımsız nitelikli kahveci ve editöryal/topluluk kanıtı yetersiz'
    ),
    negControl(
      'ctrl-g-beyond-yalikavak',
      'ChIJLeQ5tyRxvhQRx-MzHvLq9nk',
      'date',
      'Kapı 8 ihlali: G Beyond Restaurant&Bar villa rezidans içi tesis olup bağımsız açık restoran menü kanıtı yetersiz'
    ),

    // Kapı 6 — Düşük Puan (<4.4) ve Yetersiz Değerlendirme (<35) Kontrolleri
    negControl(
      'ctrl-sait-yalikavak',
      'ChIJm6aS3GlxvhQRFvn-6AKya34',
      'balik',
      'Kapı 6 ihlali: Sait ★4.0 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-asmali-cardak-yalikavak',
      'ChIJ19Vl_GZxvhQRJVXRxupxC2Y',
      'kahvalti',
      'Kapı 6 ihlali: Asmalı Çardak Kahvaltı Evi ★4.0 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-kavakli-koftecisi-yalikavak',
      'ChIJSQuHeGlxvhQRTiGkfSpyX2k',
      'denemelisin',
      'Kapı 6 ihlali: Kavaklı Köftecisi ★3.7 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-kavanoz-yalikavak',
      'ChIJd7NM-qwNvhQR5gf_SBzqHkM',
      'date',
      'Kapı 6 ihlali: Kavanoz Yalıkavak ★3.4 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-havva-ana-yalikavak',
      'ChIJy1w6mKJxvhQR4fPu0PTL2zI',
      'kahvalti',
      'Kapı 6 ihlali: Havva Ana Kahvaltı Bahçesi ★4.0 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-mezra-yalikavak',
      'ChIJp7stYbNxvhQR7c2bmJROfJE',
      'date',
      'Kapı 6 ihlali: Mezra Yalıkavak ★4.2 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-ikon-yalikavak',
      'ChIJg4srHhVxvhQRZ5guD576_jY',
      'date',
      'Kapı 6 ihlali: İkon Yalıkavak ★4.1 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-cafe-di-dolce-yalikavak',
      'ChIJj5qiaxBxvhQRS88fYHNOKFg',
      'kahve',
      'Kapı 3B & Kapı 6 ihlali: Cafe Di Dolce pastry_shop türü ve ★2.7 puanı'
    ),
    negControl(
      'ctrl-bir-baska-yalikavak',
      'ChIJ84uSMuFxvhQRcC8awx8gBCQ',
      'denemelisin',
      'Kapı 6 ihlali: Bir Başka 33 değerlendirme ile 35 alt sınırının altında'
    ),
    negControl(
      'ctrl-iskele-belediye-cafe-yalikavak',
      'ChIJt0fz3mlxvhQRvE3Oh1v85ko',
      'kahve',
      'Kapı 6 ihlali: Yalıkavak İskele Cafe Belediye A.Ş. ★4.3 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-yalicapkini-yalikavak',
      'ChIJW44YXmhxvhQRgaNg0Gn_haQ',
      'pizza',
      'Kapı 6 ihlali: Yalıçapkını Kitchen & Cafe ★4.3 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-zipkin-balik-yalikavak',
      'ChIJySg2OdlxvhQRDIDTJ_VA3FI',
      'balik',
      'Kapı 6 ihlali: Zıpkın Yalıkavak Balık ★4.3 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-eskiyer-balik-yalikavak',
      'ChIJXSAa8VZxvhQRLnW4MFIYzzU',
      'balik',
      'Kapı 6 ihlali: Eskiyer Balik Restorant ★4.3 puanı 4.4 tabanının altında'
    ),

    // Kapı 4 — Dış Mahalle & Komşu Belde Sınır Kontrolleri
    negControl(
      'ctrl-jour-gundogan',
      'ChIJ7eqpVb5xvhQRXBju-T0ByIg',
      'date',
      'Kapı 4 ihlali: JOUR Bodrum Gündoğan Mahallesi ve Yalıkavak bbox dışında'
    ),
    negControl(
      'ctrl-akbalik-gundogan',
      'ChIJnYnS_zpwvhQRiPeIg-OLxe4',
      'balik',
      'Kapı 4 ihlali: Akbalık Restaurant Gündoğan Mahallesi ve Yalıkavak bbox dışında'
    ),
    negControl(
      'ctrl-midyeci-sehmus-gundogan',
      'ChIJwUgBUzpwvhQRs2vIAtuLO2U',
      'denemelisin',
      'Kapı 4 & Kapı 6 ihlali: Midyeci Şehmus Usta Gündoğan Mahallesi ve ★4.2 puanı'
    ),
    negControl(
      'ctrl-atilay-turkbuku',
      'ChIJdbNZb25svhQRUKd_OdsB1cg',
      'balik',
      'Kapı 4 & Kapı 6 ihlali: ATILAY Türkbükü Mahallesi ve ★4.3 puanı'
    ),
    negControl(
      'ctrl-miam-turkbuku',
      'ChIJzVDASMJvvhQRYhkIN-ynA6A',
      'date',
      'Kapı 4 & Kapı 6 ihlali: Miam Restoran Türkbükü Mahallesi ve ★4.2 puanı'
    ),
    negControl(
      'ctrl-farina-turkbuku',
      'ChIJQ9oOy6NvvhQR8KBooz-Uo2c',
      'kahvalti',
      'Kapı 4 ihlali: Farina Türkbükü Mahallesi ve Yalıkavak bbox dışında'
    ),
    negControl(
      'ctrl-dalgic-turkbuku',
      'ChIJiZRBAU1vvhQReKY6MQ0xGwY',
      'balik',
      'Kapı 4 ihlali: Dalgıç Türkbükü Türkbükü Mahallesi ve Yalıkavak bbox dışında'
    ),
    negControl(
      'ctrl-kozalak-dagbelen',
      'ChIJDzVMctlxvhQRFl34zv9JWy0',
      'kahvalti',
      'Kapı 4 ihlali: Kozalak Bodrum Kahvaltı Dağbelen Mahallesi ve Yalıkavak bbox dışında'
    ),
    negControl(
      'ctrl-irme-dagbelen',
      'ChIJsdpYlMBzvhQR5A5CuGaXI7M',
      'kahvalti',
      'Kapı 4 ihlali: İrme Köy Kahvaltı Evi Dağbelen Mahallesi ve Yalıkavak bbox dışında'
    ),
    negControl(
      'ctrl-furnos-koyunbaba',
      'ChIJr03NJmJ1vhQRqDirmhT62CQ',
      'kahve',
      'Kapı 4 ihlali: Furnos Koyunbaba Mahallesi ve Yalıkavak bbox dışında'
    ),
    negControl(
      'ctrl-zeytin-alti-geris',
      'ChIJCU4ZQNd1vhQRc1mcplg0u5A',
      'kahvalti',
      'Kapı 4 ihlali: Zeytin Altı Yalıkavak Geriş Mahallesi (Erdemil Cd.) ve Yalıkavak bbox dışında'
    ),
    negControl(
      'ctrl-la-lara-geris',
      'ChIJk3fE2apzvhQRUdaARqA3Lz4',
      'date',
      'Kapı 4 ihlali: La Lara Restaurant & Bar Geriş 6026. Sk., Yalıkavak/Çökertme/Dirmil/Gökçebel tokenları dışında'
    ),
    negControl(
      'ctrl-iz-bodrum-muskebi',
      'ChIJVaWzaLtzvhQRWJ-fLXPF7fE',
      'date',
      'Kapı 4 ihlali: İZ Bodrum Müskebi (Ortakent) Mahallesi ve Yalıkavak bbox dışında'
    ),
  ],
};
