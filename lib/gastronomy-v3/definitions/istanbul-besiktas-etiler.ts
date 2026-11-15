import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ISTANBUL_BESIKTAS_ETILER_DEF: V3RegionDefinition = {
  id: 'etiler-besiktas',
  slug: 'etiler',
  city: 'İstanbul',
  district: 'Beşiktaş',
  allowedDistricts: ['Beşiktaş'],
  neighborhood: 'Etiler',
  officialQuarter: 'Etiler & Akat',
  displayName: 'Etiler, Beşiktaş, İstanbul',
  locative: "Etiler'de",
  path: ['istanbul', 'besiktas', 'etiler'],
  aliases: [
    'Etiler',
    'Nispetiye',
    'Nisbetiye',
    'Akatlar',
    'Akat',
    'Tepecik Yolu',
    'Alkent',
    'Dilhayat',
    'Ulus Etiler',
  ],
  scopeNote:
    'İstanbul · Beşiktaş · Etiler (Nispetiye Cd., Akatlar / Zeytinoğlu Cd., Tepecik Yolu / Alkent ve Ahmet Adnan Saygun Aksı Doğrulanmış Seçkisi)',
  characterSubtitle:
    '1980’lerden kalan Tatar mantısı ve 1996 İtalyan klasiğinden Dilhayat Sokak şef mutfağına, Akatlar kavurmahaneleri ve butik ocakbaşılardan Alkent kokteyl barlarına uzanan seçki.',
  center: { lat: 41.0802, lng: 29.0298 },
  bbox: { minLat: 41.0700, maxLat: 41.0900, minLng: 29.0185, maxLng: 29.0395 },
  allowedNeighborhoodTokens: ['Etiler', 'Akat', 'Akatlar', 'Nisbetiye', 'Nispetiye', 'Kültür', 'Ulus'],
  categories: buildRegionCategories(),
  candidates: [
    // --- PİZZA (2) ---
    compactSeed({
      id: 'eti-pizza-wood-fire',
      placeId: 'ChIJhZD5j423yhQRV6fQ7xx1pE4',
      cat: 'pizza',
      pinnedFirst: true,
      name: 'Pizza Wood Fire',
      brand: 'pizza wood fire',
      area: 'Nispetiye Cd., Etiler',
      signals: ['odun-atesi-firin', 'ince-hamur-pizza', 'nispetiye-caddesi'],
      desc:
        'Nispetiye Caddesi aksında odun ateşinde pişen ince hamurlu klasik ve füme kaburgalı pizzalarıyla Etiler’de doğrudan pizzaya odaklanan adres.',
      order: [
        'Odun Ateşinde Margherita Pizza',
        'Dört Peynirli İnce Hamur Pizza',
        'Füme Kaburgalı Odun Ateşi Pizza',
      ],
      menu: ['Pepperoni Pizza', 'Mantarlı & Karamelize Soğanlı Pizza', 'Sarımsaklı Fırın Ekmeği'],
      sec: [
        [
          'Roka & Permesanlı Akdeniz Salatası',
          'Odun fırını pizzaların yanına hafif denge kuran taze yeşillik tabağı.',
          'Pizza Wood Fire menü kayıtları',
        ],
      ],
      seat: 'Nispetiye Caddesi üzerinde kompakt iç salon ve cadde önü küçük masalar',
      crowd: 'Öğle ve akşam saatlerinde bölge çalışanları ve semt sakinleriyle dengeli akış',
      dis: 'Yoğun akşam saatlerinde paket sipariş trafiği nedeniyle fırın çıkış süresi uzayabiliyor.',
      transit: 'Nispetiye Caddesi No:37/C üzerinde, Etiler metro çıkışına kısa yürüyüş mesafesinde.',
      sources: [
        [
          'Google Maps — Pizza Wood Fire',
          'https://maps.google.com/?cid=5666782998281889623',
          'maps',
          'Etiler Nisbetiye Cd. No:37/C konumu ve operational durumu doğrulandı.',
        ],
        [
          'Pizza Wood Fire Resmi Instagram',
          'https://instagram.com/woodfirepizzaa',
          'operator',
          'Odun ateşi taş fırın konsepti ve pizza çeşitleri işletme hesabından doğrulandı.',
        ],
        [
          'Menu-TR — Pizza Wood Fire Etiler',
          'https://menu-tr.com',
          'community',
          'Margherita, dört peynirli ve füme etli pizza seçenekleri doğrulandı.',
        ],
      ],
      pros: [
        'Gerçek odun ateşi fırınında pişen dengeli ince hamur',
        'Nispetiye Caddesi üzerinde merkezi ama kalabalıktan boğulmayan konum',
      ],
      cons: ['Sınırlı masa kapasitesi büyük gruplar için uygun değildir'],
      unc: ['Füme etli özel pizza çeşitleri günlük fırın hazırlığına bağlıdır.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-da-lupo',
      placeId: 'ChIJhx5Jj_S7yhQRByGctrP7ssU',
      cat: 'pizza',
      name: 'Da Lupo Trattoria',
      brand: 'da lupo',
      area: 'Tepecik Yolu / Alkent, Etiler',
      signals: ['sef-fabio-foltran', 'odun-firini-italyan', 'alkent-trattoria'],
      desc:
        'Şef Fabio Foltran yönetimindeki Alkent trattoria’sında İtalyan unundan odun fırını pizzaları ve el yapımı taze makarnalar aynı mutfaktan çıkar.',
      order: [
        'Bresaola & Rokalı Odun Fırını Pizza',
        'Pizza Di Manzo (Marine Bonfileli)',
        'Trüflü Ev Yapımı Gnocchi',
      ],
      menu: ['Diavola Pizza', 'Tagliatelle Bolognese', 'Burrata Başlangıç'],
      sec: [
        [
          'Melanzane alla Parmigiana & Klasik Tiramisu',
          'Taş fırın patlıcan başlangıcı ve ev yapımı İtalyan tatlı kapanışı.',
          'Da Lupo resmi menüsü ve Gurmerehber seçkisi',
        ],
      ],
      seat: 'Alkent sitesi içi sakin teras masaları ve klasik İtalyan trattoria salonu',
      crowd: 'Alkent ve Akatlar sakinleri, aile akşam yemekleri ve İtalyan mutfağı müdavimleri',
      dis: 'Üst-orta fiyat bandı ve site içi konumu nedeniyle hafta sonu akşamları rezervasyon gerektiriyor.',
      transit: 'Tepecik Yolu üzerindeki Alkent İş Merkezi F4 Blok içinde kolay yaya erişimiyle.',
      sources: [
        [
          'Google Maps — Da Lupo Trattoria',
          'https://maps.google.com/?cid=14245725320607703303',
          'maps',
          'Akat Alkent İş Merkezi F4 Blok konumu ve operational durumu doğrulandı.',
        ],
        [
          'Da Lupo Trattoria Resmi Sitesi',
          'http://www.da-lupo.com/',
          'operator',
          'Şef Fabio Foltran mutfağı, odun fırını pizzalar ve el yapımı makarna menüsü doğrulandı.',
        ],
        [
          'Gurmerehber — Da Lupo Trattoria Değerlendirmesi',
          'https://www.gurmerehber.com',
          'editorial',
          'Bresaolalı pizza, trüflü gnocchi ve melanzane başlangıçları doğrulandı.',
        ],
      ],
      pros: [
        'İtalyan şef elinden çıkan geleneksel trattoria reçeteleri',
        'Odun fırını pizzalarla birlikte güçlü el yapımı makarna alternatifi',
      ],
      cons: ['Site yerleşimi içinde kaldığı için dışarıdan yürürken tabelayı bulmak ilk gelişte dikkat ister'],
      unc: ['Mevsimsel trüf ve özel şef tabakları dönem menüsüne göre güncellenir.'],
      verifiedAt: '2026-11-15',
    }),

    // --- HAMBURGER (3) ---
    compactSeed({
      id: 'eti-catch-n-eat',
      placeId: 'ChIJcwl4jV23yhQR250jimKM3_M',
      cat: 'hamburger',
      pinnedFirst: true,
      name: "Catch-N'-Eat",
      brand: 'catch n eat',
      area: 'Hazal Sk. / Akatlar, Etiler',
      signals: ['oklahoma-smash', 'yuzde-25-yagli-brisket', 'akatlar-ara-sokak'],
      desc:
        'Akatlar ara sokağında %25 yağ oranlı dana döş etiyle hazırladığı dantel kenarlı Oklahoma soğanlı smash burgerleriyle kısa sürede mahalle odağına dönüşen bağımsız burger dükkanı.',
      order: [
        'Oklahoma Soğanlı Smash Burger',
        'Trüf Mayonezli Cheeseburger',
        'Double Brisket Smash Burger',
      ],
      menu: ['Classic Cheeseburger', 'Jalapeño Smash Burger', 'Ev Yapımı Burger Sosları'],
      sec: [
        [
          'Kaşık Patates Kızartması & Özel Dip Soslar',
          'Kıtır kenarlı %25 yağlı brisket smash köftelerle eşleşen imza kaşık kesim patates.',
          'HangiMekan ve Diggin Social kayıtları',
        ],
      ],
      seat: 'Hazal Sokak girişinde az sayıda masa ve hızlı servis odaklı iç tezgah',
      crowd: 'Özellikle akşam saatlerinde Akatlar ve Etiler civarından smash burger için gelen müdavimler',
      dis: 'Çok sınırlı oturma kapasitesi bulunduğundan yoğun saatlerde masa bulmak zorlaşabiliyor.',
      transit: 'Zeytinoğlu Caddesi’nden Hazal Sokak içine girer girmez No:1-C’de.',
      sources: [
        [
          'Google Maps — Catch-N\'-Eat',
          'https://maps.google.com/?cid=17572918625875238363',
          'maps',
          'Akat Hazal Sk. No:1-C konumu ve operational durumu doğrulandı.',
        ],
        [
          'HangiMekan — Catch-N\'-Eat Akatlar İncelemesi',
          'https://www.hangimekan.com',
          'editorial',
          '%25 yağlı brisket Oklahoma smash tekniği ve kaşık patates eşlikçisi doğrulandı.',
        ],
        [
          'Diggin Social — İstanbul Smash Burger Notları',
          'https://www.digginsocial.com',
          'community',
          'Akatlar ara sokağındaki bağımsız smash burger odağı ve dantel kenarlı köfte kalitesi doğrulandı.',
        ],
        [
          'Menu-TR — Catch-N\'-Eat Menüsü',
          'https://menu-tr.com',
          'community',
          'Trüf mayonezli cheeseburger ve double smash çeşitleri doğrulandı.',
        ],
      ],
      pros: [
        'Gerçek yüksek yağ oranlı brisket smash tekniği ve hafif karamelize soğan dengesi',
        'Kaşık patates ve ev yapımı dip sosların uyumu',
      ],
      cons: ['Küçük dükkan hacmi nedeniyle uzun süreli kalabalık oturuma elverişli değildir'],
      unc: ['Akşam geç saatlerde günlük köfte stoğu tükenebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-ciftlik-kasap',
      placeId: 'ChIJ0f-BiRS2yhQROs8ZeA3nfmg',
      cat: 'hamburger',
      name: 'Çiftlik Kasap Burger',
      brand: 'ciftlik kasap',
      area: 'Selçuklar Sk. / Akatlar, Etiler',
      signals: ['kasap-burger', 'dana-fume', 'akatlar-lokal'],
      desc:
        'Akatlar’da kasap kökenli et seçimiyle kalın sulu burger köfteleri ve füme etli alternatifler sunan sakin mahalle burgercisi.',
      order: [
        'Çiftlik Burger (Dana Füme & Karamelize Soğan)',
        'Lokum Burger',
        'Klasik Kasap Cheeseburger',
      ],
      menu: ['Mantar Soslu Kasap Burger', 'Izgara Kasap Köfte', 'Baharatlı Patates Kızartması'],
      sec: [
        [
          'Kasap Sucuk Burger & Ev İşi Baharatlı Patates',
          'Açık besi dana etinden kendi kasap tezgahında çekilen alternatif.',
          'Akatlar yerel menü arşivi',
        ],
      ],
      seat: 'Selçuklar Sokak üzerinde sade iç salon ve kaldırım kenarı birkaç masa',
      crowd: 'Akatlar mahalle sakinleri ve öğle yemeğinde kalın kasap köftesi arayanlar',
      dis: 'Gündüz-akşam temposu daha sakin aktığı için geç gece kulüp çıkışı burger duraklarından ayrılır.',
      transit: 'Akatlar Selçuklar Sokak No:17/B üzerinde, spor kompleksi ve Zeytinoğlu hattına yakın.',
      sources: [
        [
          'Google Maps — Çiftlik Kasap Burger',
          'https://maps.google.com/?cid=7529709672045596474',
          'maps',
          'Akat Selçuklar Sk. No:17 D:B konumu ve operational durumu doğrulandı.',
        ],
        [
          'Restoranim — Çiftlik Kasap Burger Menüsü',
          'https://www.restoranim.net',
          'community',
          'Çiftlik Burger, Lokum Burger ve kasap köfte seçenekleri doğrulandı.',
        ],
        [
          'Yandex Haritalar — Akatlar Kasap Burger Kayıtları',
          'https://yandex.com.tr',
          'editorial',
          'Bölge içi et kalitesi odaklı kasap burgerci konsepti doğrulandı.',
        ],
      ],
      pros: [
        'Smash modasının dışında kalın ve sulu kasap köftesi tercih edenlere hitap etmesi',
        'Sakin ara sokak konumu',
      ],
      cons: ['Küçük bir mahalle dükkânı olduğundan ambiyansı sadedir'],
      unc: ['Lokum ve özel kesim burger stokları günlük kasap tedarikine göre değişir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-abrakadabra',
      placeId: 'ChIJmYYIS4K3yhQRiUBNpaYlC9Y',
      cat: 'hamburger',
      name: 'Abrakadabra Burger Ulus',
      brand: 'abrakadabra',
      area: 'Müderris Salih Rüştü Sk. / Ulus, Etiler',
      signals: ['smash-me-honey', 'churros-tatli', 'ulus-nisbetiye-hatti'],
      desc:
        'Ahmet Adnan Saygun Caddesi paralelindeki ara sokakta çıtır kenarlı smash burgerleri, acılı bal dokunuşlu seçenekleri ve taze churros tatlısıyla öne çıkan butik burgerci.',
      order: [
        'Smash Me Honey Burger',
        'Magic Cheeseburger',
        'Chick On Fire Çıtır Tavuk Burger',
      ],
      menu: ['Double Smash Burger', 'Truffle Mushroom Burger', 'Kajun Baharatlı Patates'],
      sec: [
        [
          'Tarçınlı Sıcak Churros',
          'Burger sonrası tatlı kapanış olarak öne çıkan çıtır İspanyol hamuru.',
          'abrakadabraburger.com ve Menu-TR',
        ],
      ],
      seat: 'Sokak cephesinde ferah açık alan ve düzenli iç oturma düzeni',
      crowd: 'Ulus ve Nisbetiye çevresindeki genç profesyoneller ve akşam burger grupları',
      dis: 'Akşam paket servis talebi yoğunlaştığında masa siparişlerinin bekleme süresi artabiliyor.',
      transit: 'Ahmet Adnan Saygun Caddesi kavşağından Müderris Salih Rüştü Bey Sokak No:2E’ye yürüyerek.',
      sources: [
        [
          'Google Maps — Abrakadabra Burger Ulus',
          'https://maps.google.com/?cid=15423462746528497801',
          'maps',
          'Nisbetiye Müderris Salih Rüştü Sk. 2E konumu ve operational durumu doğrulandı.',
        ],
        [
          'Abrakadabra Burger Resmi Sitesi',
          'http://www.abrakadabraburger.com/',
          'operator',
          'Smash Me Honey, Magic Cheeseburger ve churros menüsü doğrulandı.',
        ],
        [
          'Menu-TR — Abrakadabra Burger Ulus',
          'https://menu-tr.com',
          'community',
          'Tatlı-tuzlu sos dengeli smash burger ve çıtır tavuk çeşitleri doğrulandı.',
        ],
      ],
      pros: [
        'Burgerle sınırlı kalmayıp sıcak churros gibi imza kapanış sunması',
        'Tatlı-acı sos dengesini sevenler için özgün burger kombinasyonları',
      ],
      cons: ['Yaya trafiğinin az olduğu ara sokak nedeniyle ulaşım çoğunlukla Ulus aksından planlanmalı'],
      unc: ['Özel soslu mevsim burgerleri dönemsel olarak menüde yer değiştirir.'],
      verifiedAt: '2026-11-15',
    }),

    // --- KAHVE (3 saf kahveci) ---
    compactSeed({
      id: 'eti-lali-coffee',
      placeId: 'ChIJDxNuKFe3yhQRtGfWoGWpXQc',
      cat: 'kahve',
      pinnedFirst: true,
      name: 'Lali Coffee',
      brand: 'lali',
      area: 'Zeytinoğlu Cd. / Akatlar, Etiler',
      signals: ['nitelikli-kahve-bari', 'akatlar-mahalle-kafesi', 'sessiz-sokak'],
      desc:
        'Zeytinoğlu Caddesi üzerindeki mahalle kahvecisi; tutarlı espresso kalibrasyonu, temiz filtre kahveleri ve müdavim ilişkisiyle Etiler’de zincirler dışındaki öncelikli kahve noktası.',
      order: ['Nitelikli Filtre Kahve', 'Flat White', 'Cortado'],
      menu: ['Iced Latte', 'Americano', 'Cappuccino'],
      sec: [
        [
          'Ev Yapımı Cheesecake & Günlük Kurabiye',
          'Zeytinoğlu Caddesi’ndeki mahalle kahvecisinde küçük partiler halinde pişen ev işi eşlikçiler.',
          'Menu-TR ve Akatlar müdavim kayıtları',
        ],
      ],
      seat: 'Ağaçlıklı apartman altı iç oturma düzeni ve ön cephede küçük kahve masaları',
      crowd: 'Sabah yürüyüşçüleri, Akatlar sakinleri ve bilgisayarla sessizce çalışan tekil konuklar',
      dis: 'Büyük grupları ağırlamaktan çok 1-2 kişilik dingin kahve molalarına uygun kapasitede.',
      transit: 'Zeytinoğlu Caddesi No:19 altında, Akatlar apartman dokusunun merkezinde.',
      sources: [
        [
          'Google Maps — Lali Coffee',
          'https://maps.google.com/?cid=530766585054783412',
          'maps',
          'Akat Zeytinoğlu Cd. No:19 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Lali Coffee Resmi Paylaşımları',
          'https://www.instagram.com/p/CqWFlkTLpIU/',
          'operator',
          'Bağımsız üçüncü dalga espresso barı ve günlük pasta/kurabiye vitrini doğrulandı.',
        ],
        [
          'Menu-TR — Lali Coffee Etiler',
          'https://menu-tr.com',
          'community',
          'Filtre kahve, flat white ve ev yapımı cheesecake seçkisi doğrulandı.',
        ],
      ],
      pros: [
        'Süt dokusu ve espresso dengesi yüksek mahalle ölçeğinde bağımsız kahve barı',
        'Nispetiye kalabalığından uzak huzurlu Zeytinoğlu atmosferi',
      ],
      cons: ['Küçük oturma alanı nedeniyle pik saatlerde masa beklemek gerekebilir'],
      unc: ['Ev yapımı kek ve kurabiye çeşitleri günlük fırın çıkışına göre değişir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-molecule-house',
      placeId: 'ChIJWc4ueC63yhQRl4hrMqUZYmE',
      cat: 'kahve',
      name: 'Molecule House',
      brand: 'molecule',
      area: 'Açelya Sk. / Akatlar, Etiler',
      signals: ['kavurmahaneden-fincana', 'el-demlemesi', 'seramik-tasarim'],
      desc:
        'Kendi çekirdeklerini kavuran ve el yapımı seramik fincanlarda V60/Chemex demlemeler sunan, kahve odaklı tasarım evi.',
      order: ['Single-Origin V60 Demleme', 'Chemex El Demlemesi', 'Cappuccino'],
      menu: ['Cold Brew', 'Flat White', 'Espresso Tonic'],
      sec: [
        [
          'Beyaz Çikolata Dolgulu Sufle Brownie & Sebzeli Kiş',
          'Kavurmahanenin nitelikli çekirdeklerine eşlik eden fırın ürünleri.',
          'coffeemolecule.com ve Gurmerehber',
        ],
      ],
      seat: 'Açelya Sokak içinde tasarım seramiklerle çevrili aydınlık kafe salonu',
      crowd: 'Kavrum profiline dikkat eden kahve meraklıları ve tasarım/çalışma odaklı konuklar',
      dis: 'Ara sokak konumu nedeniyle ana caddeden yürürken kısa bir yokuş çıkış gerektiriyor.',
      transit: 'Akatlar Açelya Sokak No:39 üzerinde, Zeytinoğlu hattının bir üst sokağında.',
      sources: [
        [
          'Google Maps — Molecule House',
          'https://maps.google.com/?cid=7017199366702860439',
          'maps',
          'Akat Açelya Sk. No:39 konumu ve coffee_roastery türü doğrulandı.',
        ],
        [
          'Coffee Molecule Resmi Sitesi',
          'http://www.coffeemolecule.com/',
          'operator',
          'Kendi kavrumu yöresel çekirdekler ve el demlemesi reçeteleri doğrulandı.',
        ],
        [
          'Gurmerehber — Molecule House Akatlar',
          'https://www.gurmerehber.com',
          'editorial',
          'V60/Chemex demleme standartları, seramik sunumu ve sufle brownie eşlikçisi doğrulandı.',
        ],
      ],
      pros: [
        'Kendi kavrum çekirdekleriyle V60 ve Chemex gibi el demlemelerinde net tat profili',
        'El yapımı seramik sunumların mekân karakterini güçlendirmesi',
      ],
      cons: ['Hafta sonu bahçe ve iç masalar sessiz çalışma arayanlarla erken dolabiliyor'],
      unc: ['Single-origin çekirdek seçkisi hasat dönemlerine göre güncellenir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-roastico',
      placeId: 'ChIJAQAw20G2yhQR35KpOBCXyEQ',
      cat: 'kahve',
      name: 'Roastico Coffee & Cocktail Bar',
      brand: 'roastico',
      area: 'Aytar Cd. / Nisbetiye, Etiler',
      signals: ['wake-me-up-blend', 'mikro-kavurum', 'gun-boyu-gecis'],
      desc:
        'Aytar Caddesi başında kendi harmanı Wake Me Up ve yöresel çekirdekleriyle nitelikli sabah kahvesi, akşamüstünden itibaren ise kokteyl barı atmosferi sunan bağımsız durak.',
      order: [
        'Wake Me Up Blend Espresso',
        'Yöresel Çekirdek Filtre Kahve',
        'Iced Americano',
      ],
      menu: ['Cortado', 'V60 Demleme', 'Buzlu Flat White'],
      sec: [
        [
          'Fırın Mac & Cheese & Sıcak Atıştırmalıklar',
          'Gün içi kahve molasından akşamüstü buluşmalarına geçişte paylaşılan mutfak tabağı.',
          'roastico.com ve Menu-TR',
        ],
      ],
      seat: 'Köşe cepheli ferah iç bar alanı ve Aytar Caddesi boyunca açık kaldırım masaları',
      crowd: 'Gündüz kahve ve dizüstü bilgisayarla çalışanlar, akşamüstü kokteyle geçen semt gençleri',
      dis: 'Akşam saatlerine yaklaştıkça bar temposunun artması sessiz okuma için uygunluğu azaltabiliyor.',
      transit: 'Nisbetiye Mahallesi Aytar Caddesi No:27/C’de, metro ve otobüs duraklarına birkaç dakika.',
      sources: [
        [
          'Google Maps — Roastico Coffee & Cocktail Bar',
          'https://maps.google.com/?cid=4956377485847139039',
          'maps',
          'Nisbetiye Aytar Cd. 27/C konumu ve operational durumu doğrulandı.',
        ],
        [
          'Roastico Resmi Sitesi',
          'http://www.roastico.com/',
          'operator',
          'Wake Me Up harmanı, yöresel kahve çekirdekleri ve akşam bar servisi doğrulandı.',
        ],
        [
          'Menu-TR — Roastico Nisbetiye',
          'https://menu-tr.com',
          'community',
          'Espresso bazlı içecekler, V60 demleme ve fırın mac & cheese menü kalemleri doğrulandı.',
        ],
      ],
      pros: [
        'Kendi kavrum blend çekirdekleriyle istikrarlı espresso bazlı içecekler',
        'Aytar Caddesi köşesinde gün boyu ulaşımı kolay konum',
      ],
      cons: ['Öğleden sonra akşamüstüne dönerken müzik seviyesi yükselir'],
      unc: ['Yöresel kahve çekirdeği menüsü kavrum partilerine göre dönemsel değişebilir.'],
      verifiedAt: '2026-11-15',
    }),

    // --- DATE MEKANLARI (4) ---
    compactSeed({
      id: 'eti-arkestra',
      placeId: 'ChIJW1D7CIu3yhQRDmAZbPUrjjw',
      cat: 'date',
      pinnedFirst: true,
      flags: { heritage: true },
      name: 'Arkestra',
      brand: 'arkestra',
      area: 'Dilhayat Sk., Etiler',
      signals: ['1960s-villa-mutfagi', 'listening-room', 'sef-cenk-debensason'],
      desc:
        'Şef Cenk Debensason’un 1960’lardan kalma iki katlı Etiler villasında kurguladığı modern İstanbul mutfağı; alt katta paylaşım ve tadım tabakları, üst kattaki plak dinleme salonunda ise imza kokteyllerle akşam buluşmalarına odaklanır.',
      order: [
        'Arkestra Katsu Sando (Shokupan Ekmeğinde)',
        'Kuru Dinlendirilmiş Kaya Levreği & Yer Elması',
        'Steak au Poivre',
      ],
      menu: ['Yuzu Kosho Soslu Hamachi', 'Mevsimsel Tadım Tabakları', 'Şefin Tatlı Kapanışı'],
      sec: [
        [
          'Tuna Sashimi & Listening Room İmza Kokteylleri',
          '1960’lar villasının üst katındaki plak dinleme salonuyla bütünleşen çiğ balık başlangıcı ve miksoloji seçkisi.',
          'arkestra.com.tr ve Oggusto seçkisi',
        ],
      ],
      seat: 'İki katlı yenilenmiş modern villa içinde loş yemek salonu, bahçe ve üst kat listening room barı',
      crowd: 'Özel akşam yemekleri, uluslararası gastronomi takipçileri ve şık kokteyl randevuları',
      dis: 'Üst segment fine-dining fiyatlaması yüksektir; yemek salonu için haftalar öncesinden rezervasyon gerekebilir ve 4.3 puanın temel kaynağı da fiyat/erişim beklentisidir.',
      transit: 'Etiler Dilhayat Sokak No:28 üzerinde, Nispetiye ve Levent aksına araç/yaya erişimli.',
      sources: [
        [
          'Google Maps — Arkestra',
          'https://maps.google.com/?cid=4363473422049173518',
          'maps',
          'Etiler Dilhayat Sk. No:28 konumu ve fine_dining_restaurant statüsü doğrulandı.',
        ],
        [
          'Arkestra Resmi Sitesi',
          'https://arkestra.com.tr/',
          'operator',
          'Şef Cenk Debensason mutfağı, Katsu Sando ve Listening Room kokteyl barı doğrulandı.',
        ],
        [
          'Michelin Guide Türkiye — Arkestra (1 Yıldız)',
          'https://guide.michelin.com',
          'award',
          'Etiler villasında bir yıldızlı modern gastronomi mutfağı tescili doğrulandı.',
        ],
        [
          'Gault & Millau Türkiye — Arkestra Seçkisi',
          'https://www.gaultmillau.com.tr',
          'award',
          'Çağdaş teknikli mutfak ve listening room konseptiyle tescilli şef restoranı olarak doğrulandı.',
        ],
        [
          'Oggusto — Arkestra Etiler',
          'https://www.oggusto.com',
          'editorial',
          'Shokupan katsu sando, hamachi ve üst kat dinleme salonu atmosferi doğrulandı.',
        ],
      ],
      pros: [
        'Tescilli şef mutfağını samimi listening room plak barıyla birleştiren özgün konsept',
        'Klasik Katsu Sando gibi ulaşılabilir ikonlarla tadım tabaklarını dengelemesi',
      ],
      cons: [
        'Fine-dining segmenti yüksek hesap çıkarır; yer bulmak için erken rezervasyon şarttır',
      ],
      unc: ['Mevsimsel balık ve tadım menüsü şefin pazar tedarikine göre güncellenir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-sipster',
      placeId: 'ChIJK0E4tA23yhQRRtZFd3rKiyM',
      cat: 'date',
      name: 'Sipster Etiler',
      brand: 'sipster',
      area: 'Tepecik Yolu / Alkent, Etiler',
      signals: ['ege-neo-bistro', 'paylasimli-tabaklar', 'sarap-ve-kokteyl'],
      desc:
        'Alaçatı kökenli Ege neo-bistro çizgisini Alkent’in sakin teraslarına taşıyan; enginarlı humus, tarama ve aromatik kokteyl eşleşmeleriyle sıcak date buluşmalarına uygun adres.',
      order: [
        'Enginarlı Humus & Tarama Köpüğü',
        'Fırında Enginar Pate & Özel Pizetta',
        'Lokum Bonfile',
      ],
      menu: ['Ege Otlu Paylaşım Tabakları', 'Deniz Mahsullü Makarna', 'Şarap Eşleşmeli Peynir Tabağı'],
      sec: [
        [
          'Itırlı Lor Tatlısı & İmza Kokteyller',
          'Alaçatı kökenli neo-bistro mutfağının aromatik tatlı ve kadeh eşleşmesi.',
          'sipster.com.tr ve Oggusto seçkisi',
        ],
      ],
      seat: 'Alkent sitesi içinde şık bistro masaları ve ağaçlıklı dış oturma alanı',
      crowd: 'İkili akşam buluşmaları, şarap-bistro sofraları ve Akatlar müdavimleri',
      dis: 'Paylaşımlık porsiyonlar küçük ölçekli geldiği için kalabalık akşamlarda birden fazla tabak seçimi bütçeyi yükseltebiliyor.',
      transit: 'Tepecik Yolu Alkent İş Merkezi F-2 Blok No:13/28 içinde.',
      sources: [
        [
          'Google Maps — Sipster Etiler',
          'https://maps.google.com/?cid=2561363440426145350',
          'maps',
          'Akat Alkent F-2 Blok konumu ve operational durumu doğrulandı.',
        ],
        [
          'Sipster Resmi Sitesi',
          'http://www.sipster.com.tr/',
          'operator',
          'Ege neo-bistro menüsü, enginarlı tabaklar ve imza kokteyller doğrulandı.',
        ],
        [
          'Oggusto — Sipster Alkent',
          'https://www.oggusto.com',
          'editorial',
          'Alaçatı çıkışlı şık akşam buluşması ve şarap-bistro atmosferi doğrulandı.',
        ],
      ],
      pros: [
        'Ege dokunuşlu hafif paylaşım tabakları ve yüksek konuk memnuniyeti',
        'Kalabalık caddeden izole, sohbete uygun sakin Alkent avlusu',
      ],
      cons: ['Küçük paylaşımlı tabaklar ana yemek beklentisinde olanlara hafif kalabilir'],
      unc: ['Mevsimsel Ege otları ve tatlı seçenekleri döneme göre yenilenir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-paper-moon',
      placeId: 'ChIJ1wbFRo-5yhQRxTUCK8IumGc',
      cat: 'date',
      name: 'Paper Moon',
      brand: 'paper moon',
      area: 'Ahmet Adnan Saygun Cd., Etiler',
      signals: ['1996-milano-klasigi', 'truf-tagliolini', 'etiler-kurumu'],
      desc:
        '1996’dan beri Etiler’de İstanbul’un klasik Kuzey İtalya ve Milano sofrası standardını temsil eden; siyah trüflü tagliolini ve cotoletta alla Milanese ile köklü akşam yemeği kurumu.',
      order: [
        'Tagliolini al Tartufo Nero',
        'Pappardelle Paper Moon',
        'Cotoletta alla Milanese',
      ],
      menu: ['Risotto ai Funghi Porcini', 'Odun Fırını İnce İtalyan Pizzası', 'Tiramisu'],
      sec: [
        [
          'Vitello Tonnato & Carpaccio di Manzo',
          '1996’dan beri çizgisini koruyan Milano usulü ince dilim başlangıç ikilisi.',
          'papermoonrestaurants.com ve MesPrestiges',
        ],
      ],
      seat: 'Yüksek tavanlı klasik Milanese salonu, beyaz örtülü masalar ve zarif bar köşesi',
      crowd: 'İş yemekleri, yıldönümü buluşmaları ve 1996’dan beri değişmeyen İstanbul müdavimleri',
      dis: 'Giyim ve masa adabı daha resmîdir; akşam yemeğinde rezervasyonsuz masa bulmak güçtür.',
      transit: 'Ahmet Adnan Saygun Caddesi Akmerkez residence girişi aksında vale ve taksi erişimiyle.',
      sources: [
        [
          'Google Maps — Paper Moon',
          'https://maps.google.com/?cid=7464767793846695365',
          'maps',
          'Etiler Ahmet Adnan Saygun Cd. konumu ve operational durumu doğrulandı.',
        ],
        [
          'Paper Moon İstanbul Resmi Sayfası',
          'https://www.papermoonrestaurants.com/paper-moon-istanbul.html',
          'operator',
          '1996 açılış tarihi, Milano mutfak çizgisi ve imza makarnalar doğrulandı.',
        ],
        [
          'MesPrestiges — Paper Moon İstanbul',
          'https://www.mesprestiges.com',
          'editorial',
          'Tagliolini al Tartufo Nero, Vitello Tonnato ve klasik servis disiplini doğrulandı.',
        ],
      ],
      pros: [
        'Otuz yıla yaklaşan kesintisiz servis kalitesi ve klasik İtalyan tabak tutarlılığı',
        'Ciddi akşam randevuları için oturmuş atmosfer',
      ],
      cons: ['Yüksek fiyat seviyesi ve ağırbaşlı salon atmosferi günlük rahat buluşmalara hitap etmez'],
      unc: ['Mevsimsel beyaz veya siyah trüf menüleri ithal taze tedarike bağlıdır.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-bardy',
      placeId: 'ChIJKQoToo-3yhQR92h-y4kZEbE',
      cat: 'date',
      name: 'Bardy.',
      brand: 'bardy',
      area: 'Tepecik Yolu / Alkent, Etiler',
      signals: ['numarali-imza-kokteyl', 'alkent-mahalle-bari', 'aksam-bulusmasi'],
      desc:
        'Alkent’te her mevsim numaralandırılmış reçetelerle yenilenen imza kokteyl menüsü, loş bar atmosferi ve burrata-smash burger gibi nitelikli eşlikçileriyle mahalle kokteyl barı.',
      order: [
        'Mevsimsel Numaralı İmza Kokteyller',
        'Çilekli Burrata Salatası',
        'Bardy Smash Burger',
      ],
      menu: ['Klasik Negroni & Ekşi Kokteyller', 'Paylaşımlık Bar Tabakları', 'Mini Tatlı Kapanışı'],
      sec: [
        [
          'Trüflü Patates Kızartması & Taze Guacamole',
          'Alkent mahalle barında kokteyl masalarının en sık paylaştığı eşlikçi tabaklar.',
          'Vogue Türkiye ve FoodinLife seçkileri',
        ],
      ],
      seat: 'Yüksek bar tabureleri, sıcak aydınlatmalı iç salon ve Alkent teras masaları',
      crowd: 'Kokteyl sonrası sohbete devam etmek isteyen çiftler ve Alkent-Etiler bar müdavimleri',
      dis: 'Cuma ve cumartesi geceleri masa kapasitesi hızla dolduğundan bar çevresi hareketlenebiliyor.',
      transit: 'Tepecik Yolu No:13/21 Alkent sitesi içinde yürüyüş mesafesinde.',
      sources: [
        [
          'Google Maps — Bardy.',
          'https://maps.google.com/?cid=12759007298932599031',
          'maps',
          'Etiler Tepecik Yolu 13/21 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Vogue Türkiye — Etiler Kokteyl Durakları',
          'https://vogue.com.tr',
          'editorial',
          'Mevsimsel numaralı imza kokteyller ve mahalle barı konsepti doğrulandı.',
        ],
        [
          'FoodinLife — Bardy. Etiler İncelemesi',
          'https://foodinlife.com',
          'editorial',
          'Bardy Smash Burger, çilekli burrata salatası ve miksoloji mutfağı doğrulandı.',
        ],
      ],
      pros: [
        'Bölgede az bulunan özgün reçeteli bağımsız mahalle kokteyl barı kimliği',
        'Kokteyllerle uyumlu taze bar mutfağı eşlikçileri',
      ],
      cons: ['Tam kapsamlı akşam yemeği restoranı değil, kokteyl-bistro barı formatındadır'],
      unc: ['Numaralı imza kokteyl listesi sezon geçişlerinde yenilenmektedir.'],
      verifiedAt: '2026-11-15',
    }),

    // --- KAHVALTI (1 saf yerel zanaatkar adres — çok şubeli zincirler ve site içi kulüpler dışlandı) ---
    compactSeed({
      id: 'eti-minval',
      placeId: 'ChIJvw5ltzC3yhQRSPgjJgZipi0',
      cat: 'kahvalti',
      pinnedFirst: true,
      name: 'Minval',
      brand: 'minval',
      area: 'Yaren Sk. / Akatlar, Etiler',
      signals: ['eksi-maya-ekmek-ustu', 'zanaatkar-pastacilik', 'yaren-sokak'],
      desc:
        'Akatlar’da kendi ekşi mayalı ekmeklerinin üzerinde Antakya peynirli tabaklar, kuşkonmazlı omlet ve tereyağlı French toast sunan, pastane tezgahıyla sabahları canlanan sıcak mahalle kahvaltıcısı.',
      order: [
        'Kuşkonmazlı Omlet',
        'Antakya Peynirli Ekşi Mayalı Ekmek Üstü',
        'Tereyağlı French Toast',
      ],
      menu: ['Çırpılmış Yumurta & Avokado Tost', 'Taze Kruvasan Sandviç', 'Sabah Filtre Kahvesi'],
      sec: [
        [
          'Karpatka & Paris-Brest Tatlısı',
          'Sabah kahvaltısı sonrasında vitrinden günlük çıkan zanaatkâr pastacılık klasikleri.',
          'Restoranim.net ve semt gastronomi rehberleri',
        ],
      ],
      seat: 'Yaren Sokak üzerinde sade iç salon ve sabah güneşi alan kaldırım kenarı masalar',
      crowd: 'Hafta sonu kahvaltısı için gelen Akatlar sakinleri ve zanaatkâr tatlı meraklıları',
      dis: 'Serpme kahvaltı yerine tabak ve ekmek üstü kahvaltı sunar; hafta sonu geç saatlerde masa beklemek gerekebilir.',
      transit: 'Zeytinoğlu Caddesi’nden Yaren Sokak içine birkaç adımlık yürüyüşle No:6/12’de.',
      sources: [
        [
          'Google Maps — Minval',
          'https://maps.google.com/?cid=3289424356389943368',
          'maps',
          'Akat Yaren Sk. No:6 D:12 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Time Out İstanbul — Akatlar Kahvaltı & Pastacılık',
          'https://www.timeout.com/istanbul',
          'editorial',
          'Ekşi mayalı ekmek üstü tabaklar, kuşkonmazlı omlet ve zanaatkar tatlıları doğrulandı.',
        ],
        [
          'Restoranim — Minval Akatlar Menüsü',
          'https://www.restoranim.net',
          'community',
          'French toast, Karpatka ve Paris-Brest menü çeşitleri doğrulandı.',
        ],
      ],
      pros: [
        'Zincir brasserie’lere alternatif gerçek zanaatkâr fırın ve kahvaltı tabakları',
        'Kahvaltı sonrası aynı vitrinde güçlü pastacılık ürünlerinin bulunması',
      ],
      cons: ['Geniş serpme masa bekleyen kalabalık gruplar için uygun değildir'],
      unc: ['Karpatka ve Paris-Brest gibi vitrin tatlıları gün içinde tükenebiliyor.'],
      verifiedAt: '2026-11-15',
    }),

    // --- DENEMELİSİN (7) ---
    compactSeed({
      id: 'eti-askana-manti',
      placeId: 'ChIJ983H0Di2yhQRy20WLUAJlrE',
      cat: 'denemelisin',
      pinnedFirst: true,
      name: 'Aşkana Mantı Ulus',
      brand: 'askana',
      area: 'Ahmet Adnan Saygun Cd. / Ulus, Etiler',
      signals: ['1980s-tatar-mantisi', 'citir-ve-klasik', 'ci-borek'],
      desc:
        '1980’lerden beri İstanbul’un Tatar mantısı geleneğini yaşatan köklü aile işletmesi; incecik el açması hamuru, tereyağlı yoğurt dengesi ve taze çi böreğiyle semt klasiği.',
      order: [
        'Tereyağlı Klasik Tatar Mantısı',
        'Kıtır Fırın/Kızartma Mantı',
        'Geleneksel Kıymalı Çi Börek',
      ],
      menu: ['Kepekli Mantı', 'Mercimek Çorbası', 'Ev Yapımı Ayran'],
      sec: [
        [
          'Etli Yaprak Sarma & Manda Kaymaklı Yoğurt Tatlısı',
          '1980’lerden beri süren Tatar mutfağı sofrasını tamamlayan yan tabak ve hafif tatlı.',
          'askanamanti.com.tr ve Gurmerehber',
        ],
      ],
      seat: 'Metehan Sokak köşesinde düzenli iki katlı klasik mantı salonu ve bahçe bölümü',
      crowd: 'Öğle ve akşam her yaştan mantı müdavimleri, aileler ve semt eskileri',
      dis: 'Küçük porsiyonlu ve sade ev tipi bir salon olduğu için kalabalık saatlerde servis hızı artabiliyor.',
      transit: 'Ahmet Adnan Saygun Caddesi Metehan Sokak No:1/1 köşesinde.',
      sources: [
        [
          'Google Maps — Aşkana Mantı ULUS',
          'https://maps.google.com/?cid=12796425562458844619',
          'maps',
          'Ulus Ahmet Adnan Saygun Cd. Metehan Sk. No:1/1 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Aşkana Mantı Resmi Sitesi',
          'http://askanamanti.com.tr/',
          'operator',
          '1980’lere uzanan Tatar mutfağı geleneği, klasik/kıtır mantı ve çi börek menüsü doğrulandı.',
        ],
        [
          'Gurmerehber — Aşkana Mantı Ulus',
          'https://www.gurmerehber.com',
          'editorial',
          'El açması Tatar mantısı ve manda kaymaklı yoğurt tatlısıyla kurum statüsü doğrulandı.',
        ],
      ],
      pros: [
        'Kırk yılı aşan kesintisiz el açması Tatar mantısı ve çi börek reçetesi',
        'Zincir mantıcıların donuk hamurlarından ayrılan taze günlük üretim',
      ],
      cons: ['Mantı porsiyonları standart ölçülüdür; yüksek iştahlılar yanında çi börek tercih eder'],
      unc: ['Çi börek siparişi taze kızartıldığı için kısa bekleme süresi gerektirir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-miyabi',
      placeId: 'ChIJAQAAADy2yhQRey312vTl75A',
      cat: 'denemelisin',
      name: 'Miyabi Sushi & Japanese Grill Bar',
      brand: 'miyabi',
      area: 'Yaren Sk. / Akatlar, Etiler',
      signals: ['japon-izgara-teppan', 'akatlar-sushi-klasiği', 'bagimsiz-mutfak'],
      desc:
        'Akatlar Yaren Sokak’ta uzun yıllardır çizgisini koruyan bağımsız Japon mutfağı; yalnızca sushi roll değil, canlı teppanyaki ve sıcak Japon ızgara barıyla öne çıkar.',
      order: [
        'Şefin Özel Sushi Roll Seçkisi',
        'Teppanyaki Dana Bonfile',
        'Sashimi & Nigiri Tabağı',
      ],
      menu: ['Miso Çorbası', 'Edamame', 'Somon Teriyaki'],
      sec: [
        [
          'Karides Tempura & Japon Usulü Wok Noodle',
          'Sushi rulolarının yanında sıcak teppan ve wok mutfağından çıkan klasikler.',
          'miyabisushi.com.tr ve Oggusto',
        ],
      ],
      seat: 'Teppanyaki ocak başı tezgahı, iç Japon barı ve sessiz bahçe terası',
      crowd: 'Uzak Doğu mutfağı müdavimleri, akşam yemeği grupları ve aileler',
      dis: 'Teppanyaki masaları için önceden rezervasyon gerekir ve fiyat seviyesi üst-orta bandındadır.',
      transit: 'Akatlar Yaren Sokak No:6/14-15 üzerinde, Zeytinoğlu Caddesi paralelinde.',
      sources: [
        [
          'Google Maps — Miyabi Sushi & Japanese Grill Bar',
          'https://maps.google.com/?cid=10443818900703751547',
          'maps',
          'Akat Yaren Sk. No:6 D:14-15 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Miyabi Sushi Resmi Sitesi',
          'http://www.miyabisushi.com.tr/',
          'operator',
          'Sushi roll, sashimi ve teppanyaki ızgara barı menüsü doğrulandı.',
        ],
        [
          'Oggusto — Miyabi Akatlar',
          'https://www.oggusto.com',
          'editorial',
          'Akatlar’ın yerleşik bağımsız Japon restoranı olarak tutarlılığı doğrulandı.',
        ],
      ],
      pros: [
        'Zincir sushi noktalarından ayrılan taze balık tedariki ve sıcak teppanyaki barı',
        'Huzurlu bahçe yerleşimi ve uzun süreli semt istikrarı',
      ],
      cons: ['Teppanyaki gösterili masalarda akşam kişi başı maliyet artabiliyor'],
      unc: ['Mevsimlik sashimi balıkları günlük tedarike göre değişebilir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-minikebapci',
      placeId: 'ChIJ4bXNQN23yhQRIR6R9p10z_I',
      cat: 'denemelisin',
      name: 'MiniKebapçı',
      brand: 'minikebapci',
      area: 'Selçuklar Sk. / Akatlar, Etiler',
      signals: ['butik-ocakbasi', 'caz-blues-esligi', 'yagli-kara'],
      desc:
        'Akatlar ara sokağında klasik ocakbaşı kalabalığından uzak, caz ve blues müzikleri eşliğinde yağlı kara, küşleme ve fıstıklı kebap sunan butik yeni nesil kebapçı.',
      order: ['Izgara Yağlı Kara', 'Kuzu Küşleme Şiş', 'Antep Fıstıklı Kebap'],
      menu: ['Zırh Kıyması Adana Kebap', 'Çöp Şiş', 'Közlenmiş Soğan & Sarımsak'],
      sec: [
        [
          'Kuzu Ciğer Şiş Dürüm & Köz Mezeler',
          'Caz-blues tınılı butik ocakbaşının dürüme sarılı sakatat ve köz başlangıç eşleşmesi.',
          'minikebapci.com ve Gurme Magazin',
        ],
      ],
      seat: 'Selçuklar Sokak içinde az masalı sıcak butik ocakbaşı salonu ve küçük dış alan',
      crowd: 'Samimi akşam sofrası kurmak isteyen küçük gruplar ve Akatlar sakinleri',
      dis: 'Butik ölçeği nedeniyle akşam saatlerinde yer kalmayabiliyor; klasik gürültülü taverna ocakbaşı atmosferi arayanlara daha sakin gelebilir.',
      transit: 'Akatlar Selçuklar Sokak No:15A üzerinde yürüyüş mesafesinde.',
      sources: [
        [
          'Google Maps — MiniKebapçı',
          'https://maps.google.com/?cid=17496331299153059361',
          'maps',
          'Akat Selçuklar Sk. 15A konumu ve operational durumu doğrulandı.',
        ],
        [
          'MiniKebapçı Resmi Sitesi',
          'https://minikebapci.com/',
          'operator',
          'Yağlı kara, küşleme, Antep fıstıklı kebap ve butik konsept doğrulandı.',
        ],
        [
          'Gurme Magazin — MiniKebapçı Akatlar',
          'https://www.gurmemagazin.com',
          'editorial',
          'Caz müzik eşliğinde temiz et işçiliği sunan yeni nesil ocakbaşı yaklaşımı doğrulandı.',
        ],
      ],
      pros: [
        'Büyük gösterişli kebap salonlarına alternatif yüksek et kalitesi ve özenli müzik seçimi',
        'Yağlı kara ve küşleme gibi özel kesimlerde kıvam istikrarı',
      ],
      cons: ['Sınırlı masa sayısı nedeniyle son dakika büyük grup kabul edemeyebilir'],
      unc: ['Özel et kesimleri yoğun akşamlarda servis sonuna doğru tükenebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-by-ulus',
      placeId: 'ChIJl1XDEW-3yhQRRd7ALXcEWuo',
      cat: 'denemelisin',
      name: 'By Ulus Steakhouse',
      brand: 'by ulus',
      area: 'Ahmet Adnan Saygun Cd., Etiler',
      signals: ['dry-aged-etler', 'saslik-bonfile', 'gösteristen-uzak-etci'],
      desc:
        'Etiler-Ulus hattındaki şov odaklı et zincirlerinden ayrılıp doğrudan etin dinlendirilmesine ve pişirme dengesine odaklanan, kuru dinlendirilmiş antrikot ve şaşlık sunan et restoranı.',
      order: ['Dry-Aged Dana Antrikot', 'Dana Şaşlık', 'Lokum Bonfile'],
      menu: ['Kuzu Kafes', 'Kasap Köfte', 'Tulum Peynirli Bahçe Salatası'],
      sec: [
        [
          'Atom Kokoreç & Kremalı Ispanak Püresi',
          'Kuru dinlendirilmiş etlerin öncesinde ve yanında öne çıkan sıcak eşlikçiler.',
          'Menum.co ve semt etçi seçkileri',
        ],
      ],
      seat: 'Ahmet Adnan Saygun Caddesi üzerinde rahat oturumlu et salonu ve vale imkanı',
      crowd: 'Show odaklı kalabalıktan kaçınıp düzgün et yemek isteyen akşam grupları',
      dis: 'Cadde trafiğinin yoğun olduğu aksta yer aldığından yaya gelişinden çok araç/taksi ile tercih edilir.',
      transit: 'Kültür Mahallesi Ahmet Adnan Saygun Caddesi No:23/A üzerinde.',
      sources: [
        [
          'Google Maps — By Ulus Steakhouse',
          'https://maps.google.com/?cid=16886814662694329925',
          'maps',
          'Kültür Ahmet Adnan Saygun Cd. No:23/A konumu ve operational durumu doğrulandı.',
        ],
        [
          'Menum.co — By Ulus Steakhouse Menüsü',
          'https://menum.co',
          'community',
          'Dry-aged antrikot, dana şaşlık ve lokum bonfile çeşitleri doğrulandı.',
        ],
        [
          'Restoranim — By Ulus Steakhouse',
          'https://www.restoranim.net',
          'editorial',
          'Atom kokoreç ve kremalı ıspanak püresi gibi yan tabaklarla yüksek et puanı doğrulandı.',
        ],
      ],
      pros: [
        'Şov ve gürültü olmadan doğrudan pişirme kalitesine odaklanan et mutfağı',
        'Şaşlık ve kuru dinlendirilmiş antrikotta tutarlı lezzet',
      ],
      cons: ['Steakhouse segmenti fiyatlama ve cadde cepheli lokasyon'],
      unc: ['Dry-aged kemikli özel kesimler gün içi stoklara bağlıdır.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-saye-ocakbasi',
      placeId: 'ChIJIWksUwC3yhQRYhJMEFctvfY',
      cat: 'denemelisin',
      name: 'Saye Ocakbaşı',
      brand: 'saye',
      area: 'Zeytinoğlu Cd. / Akatlar, Etiler',
      signals: ['zeytinoglu-ocakbasi', 'findik-lahmacun', 'pastirmali-humus'],
      desc:
        'Akatlar Zeytinoğlu Caddesi üzerinde meze ve kömür ateşi dengesini özenle kuran; pastırmalı sıcak humusu, Ali Nazik kebabı ve çıtır fındık lahmacunuyla tam donanımlı bir modern ocakbaşı.',
      order: [
        'Kömür Ateşinde Yağlı Kara',
        'Ali Nazik Kebap',
        'Taş Fırın Fındık Lahmacun',
      ],
      menu: ['Acılı Zırh Kebabı', 'Kuzu Şiş', 'Gavurdağı Salatası'],
      sec: [
        [
          'Pastırmalı Sıcak Humus & Geleneksel Soğuk Mezeler',
          'Zeytinoğlu Caddesi ocakbaşı sofralarının imza sıcak başlangıcı.',
          'sayeocakbasi.com ve Oggusto',
        ],
      ],
      seat: 'Ocakbaşı etrafı bar düzeni ve Zeytinoğlu cepheli şık akşam masaları',
      crowd: 'Rakı-kebap veya uzun meze-ocakbaşı akşamı planlayan arkadaş grupları',
      dis: 'Akşam hafta sonu rezervasyonsuz masa bulmak zorlaşıyor.',
      transit: 'Akatlar Zeytinoğlu Caddesi No:73 üzerinde, otobüs duraklarına yakın.',
      sources: [
        [
          'Google Maps — Saye Ocakbaşı',
          'https://maps.google.com/?cid=17779416755887411810',
          'maps',
          'Akat Zeytinoğlu Cd. No:73 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Saye Ocakbaşı Resmi Sitesi',
          'https://sayeocakbasi.com/',
          'operator',
          'Yağlı kara, Ali Nazik ve pastırmalı sıcak humus menüsü doğrulandı.',
        ],
        [
          'Oggusto — Akatlar Saye Ocakbaşı',
          'https://www.oggusto.com',
          'editorial',
          'Modern ocakbaşı meze dengesi ve temiz mutfak düzeni doğrulandı.',
        ],
      ],
      pros: [
        'Soğuk meze ve ara sıcakların kebabın önüne geçmeden sofrayı tamamlaması',
        'Havalandırması iyi, ferah modern ocakbaşı salonu',
      ],
      cons: ['Genç bir adres olması nedeniyle ilerleyen dönemde yoğun saat servis temposu yakından izlenmeli'],
      unc: ['Günlük özel soğuk mezeler mevsime göre değişmektedir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-citra',
      placeId: 'ChIJNWmFdfG3yhQRHV7qMK1Sp-8',
      cat: 'denemelisin',
      name: 'Citra',
      brand: 'citra',
      area: 'Yaren Sk. / Akatlar, Etiler',
      signals: ['yerli-kraft-bira', 'bosnak-sucuklu-pizza', 'gastropub'],
      desc:
        '3 Kafadar imzalı yerli kraft fıçı çeşitlerini Kore usulü kanatlar ve Boşnak sucuklu pizzalarla eşleştiren, Akatlar’ın sevilen mahalle gastropub’ı.',
      order: [
        'Yerli Kraft Fıçı Seçkisi & Boşnak Sucuklu Pizza',
        'Kore Usulü Acılı Tavuk Kanatları',
        'Citra Gastropub Burger',
      ],
      menu: ['Sosis Tabağı', 'Nachos', 'Çıtır Atıştırmalık Sepeti'],
      sec: [
        [
          'Trüflü Parmesanlı Patates Kızartması',
          'Kraft tadım bardaklarının yanına en sık paylaşılan sıcak bar tabağı.',
          'MesPrestiges ve ClubInIstanbul kayıtları',
        ],
      ],
      seat: 'Yüksek pub masaları ve Yaren Sokak boyunca açık ferah teras oturumu',
      crowd: 'Yerli kraft bira severler, iş çıkışı grupları ve maç/sohbet akşamı kalabalıkları',
      dis: 'Akşamları pub ses seviyesi doğal olarak yükseldiği için sakin bir baş başa akşam yemeği arayanlara uygun değil.',
      transit: 'Akatlar Yaren Sokak Evrim Apt. altında, Zeytinoğlu’ndan içeri dönerek.',
      sources: [
        [
          'Google Maps — Citra',
          'https://maps.google.com/?cid=17268862199978941981',
          'maps',
          'Akat Yaren Sk. konumu ve operational durumu doğrulandı.',
        ],
        [
          'MesPrestiges — Citra Gastropub Akatlar',
          'https://www.mesprestiges.com',
          'editorial',
          'Yerli 3 Kafadar kraft fıçıları, Boşnak sucuklu pizza ve gastropub mutfağı doğrulandı.',
        ],
        [
          'ClubInIstanbul — Etiler Kraft Bira Durakları',
          'https://clubinistanbul.com',
          'community',
          'Kore tavuk kanatları, burger ve akşam bar temposu doğrulandı.',
        ],
      ],
      pros: [
        'Etiler-Akatlar’da taze yerli kraft fıçı seçkisi sunan nadir bağımsız pub',
        'Fıçı çeşitleriyle iyi eşleşen sıcak bar mutfağı',
      ],
      cons: ['Dış teras konut dokusu içinde olduğu için kapanış saatlerine dikkat edilir'],
      unc: ['Musluktaki dönemsel kraft bira çeşitleri parti bitiminde değişir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'eti-ikonium',
      placeId: 'ChIJ1exgRhG2yhQRjXZ9NFwFQeI',
      cat: 'denemelisin',
      name: 'İkonium Etiler Etli Ekmek & Tandır',
      brand: 'ikonium',
      area: 'Aytar Cd. / Nisbetiye, Etiler',
      signals: ['konya-etli-ekmek', 'kuzu-tandir', 'bamya-corbasi'],
      desc:
        'Aytar Caddesi üzerinde Konya usulü ince uzun taş fırın etli ekmek, bıçakarası pide ve ağır ateşte kuzu tandır geleneğini öğle-akşam sürdüren yöresel durak.',
      order: [
        'Klasik Konya Etli Ekmeği',
        'Bıçakarası Kaşarlı Pide',
        'Ağır Ateşte Kuzu Tandır',
      ],
      menu: ['Recai Böreği (Küflü Peynirli)', 'Tereyağlı İskender', 'Sac Arası Tatlısı'],
      sec: [
        [
          'Mevlana Pidesi & Geleneksel Bamya Çorbası',
          'Konya taş fırın ve tandır geleneğini tamamlayan yöresel başlangıçlar.',
          'Restoranim.net ve semt menü kayıtları',
        ],
      ],
      seat: 'Aytar Caddesi üzerinde geniş masalı geleneksel fırın-lokanta salonu',
      crowd: 'Öğle yemeğinde bölge çalışanları ve akşamüstü Konya pidesi arayan aileler',
      dis: 'Geleneksel esnaf lokantası temposunda ilerlediği için dekorasyondan çok mutfağa odaklanır.',
      transit: 'Nisbetiye Mahallesi Aytar Caddesi No:28 önünde, Levent-Nispetiye sınır hattında.',
      sources: [
        [
          'Google Maps — İkonium Etiler Etli Ekmek & Tandır',
          'https://maps.google.com/?cid=16303318019633673869',
          'maps',
          'Nisbetiye Aytar Cd. No:28 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Restoranim — İkonium Etiler Menüsü',
          'https://www.restoranim.net',
          'community',
          'Konya etli ekmek, Mevlana, Recai böreği, bamya çorbası ve kuzu tandır çeşitleri doğrulandı.',
        ],
        [
          'Yandex Haritalar — İkonium Etiler',
          'https://yandex.com.tr',
          'editorial',
          'Nisbetiye’de taş fırın Konya pidesi ve tandır sunan yerel adres doğrulandı.',
        ],
      ],
      pros: [
        'Nispetiye çevresinde gerçek ince hamur Konya etli ekmeği ve bamya çorbası sunması',
        'Uzun servis boyunca taze taş fırın çıkışı',
      ],
      cons: ['Tandır ve bamya çorbası öğle yoğunluğundan sonra günün geç saatlerinde azalabiliyor'],
      unc: ['Kuzu tandır porsiyonları günlük pişirim bittiğinde menüden kalkabilir.'],
      verifiedAt: '2026-11-15',
    }),

    // --- NEGATIVE AUDIT CONTROLS (16 adet: Kapı 2 zincir, Kapı 3B kahve saflığı, Kapı 4 sınır, Kapı 6 4.4 tabanı) ---
    negControl(
      'ctrl-eti-akali-chain',
      'ChIJk3H2qRG2yhQRhbY-zDTX_tE',
      'hamburger',
      'Kapı 2 & 6 kontrolü: Akali Etiler çok şubeli zincir (akali) ve 4.3 puan nedeniyle elenir.'
    ),
    negControl(
      'ctrl-eti-espressolab-chain',
      'ChIJ62BBBhC2yhQRfqqOgA5A_Zs',
      'kahve',
      'Kapı 2 kontrolü: Espressolab Etiler çok şubeli zincir (espressolab) olarak CHAIN_BLOCKLIST üzerinden dışlanır.'
    ),
    negControl(
      'ctrl-eti-beyazfirin-chain',
      'ChIJmxDf_hC2yhQRq1-JbaXGeWQ',
      'kahvalti',
      'Kapı 2 & 6 kontrolü: Beyaz Fırın Etiler çok şubeli brasserie zinciri (beyaz fırın) ve 4.2 puan nedeniyle dışlanır.'
    ),
    negControl(
      'ctrl-eti-cookshop-chain',
      'ChIJnTNVMb63yhQRNgS5FV7czgw',
      'kahvalti',
      'Kapı 2 & 6 kontrolü: COOKSHOP. Etiler çok şubeli AVM-cadde zinciri (cookshop) olarak dışlanır.'
    ),
    negControl(
      'ctrl-eti-mikel-chain',
      'ChIJMQZVjNy3yhQRHOf3b8zZEpY',
      'kahve',
      'Kapı 2 kontrolü: Mikel Coffee Company franchise zinciri (mikel coffee) CHAIN_BLOCKLIST kapsamında dışlanır.'
    ),
    negControl(
      'ctrl-eti-bodrum-manti-chain',
      'ChIJRaMKDz62yhQRjTCpV2mvGpQ',
      'denemelisin',
      'Kapı 2 kontrolü: Bodrum Mantı & Cafe Ulus çok şubeli zincir (bodrum mantı) olarak elenir.'
    ),
    negControl(
      'ctrl-eti-grandma-chain',
      'ChIJq3FGveK3yhQRw020sX1S1p0',
      'kahvalti',
      'Kapı 2 kontrolü: Grandma - Etiler çok şubeli fırın-kafe zinciri (grandma) olarak dışlanır.'
    ),
    negControl(
      'ctrl-eti-casita-chain',
      'ChIJxUTUARG2yhQRD10ipfxXGrk',
      'denemelisin',
      'Kapı 2 kontrolü: Casita çok şubeli mantı-restoran zinciri (casita) olarak CHAIN_BLOCKLIST üzerinden elenir.'
    ),
    negControl(
      'ctrl-eti-nusret-chain',
      'ChIJi9exExC2yhQRE6xAOUOUZ8M',
      'denemelisin',
      'Kapı 2 & 6 & 7 kontrolü: Nusr-Et Steakhouse küresel zincir (nusr-et) ve yüksek hacimli 4.2 puanıyla dışlanır.'
    ),
    negControl(
      'ctrl-eti-melodi-cikolata',
      'ChIJh1c711O3yhQRniP3ObrhtvQ',
      'kahve',
      'Kapı 3B kontrolü: Melodi Çikolata ana türü chocolate_shop olduğundan saf kahveci kuralıyla elenir.'
    ),
    negControl(
      'ctrl-eti-opera-pastanesi',
      'ChIJ1fNb10G2yhQRzGvFVvxl4oE',
      'kahve',
      'Kapı 3B kontrolü: Etiler Opera Pastanesi ana türü pastry_shop olduğundan saf kahveci kuralıyla elenir.'
    ),
    negControl(
      'ctrl-eti-scarpetta-below-44',
      'ChIJeR5QXhC2yhQR4ET1pFeoMw4',
      'date',
      'Kapı 6 kontrolü: Scarpetta 4.2 puan ile 4.4 kalite tabanının altında kaldığı için elenir.'
    ),
    negControl(
      'ctrl-eti-supernormal-below-44',
      'ChIJKT2EX723yhQRCQsH9R4y8K8',
      'pizza',
      'Kapı 6 kontrolü: Supernormal Burger Etiler 4.1 puan ile 4.4 tabanı altında kaldığından elenir.'
    ),
    negControl(
      'ctrl-eti-harvard-below-44',
      'ChIJ68Y37g-2yhQRJLboho_GM3E',
      'kahvalti',
      'Kapı 6 kontrolü: Harvard Bistro Cafe 4.0 puan ile 4.4 kalite tabanının altında kaldığı için elenir.'
    ),
    negControl(
      'ctrl-eti-minoa-village-below-44',
      'ChIJE6r3PCW3yhQR98lSm-PlTQ4',
      'kahve',
      'Kapı 6 kontrolü: Minoa Village 3.6 puan ile 4.4 kalite tabanı altında kaldığı için elenir.'
    ),
    negControl(
      'ctrl-eti-oliva-sariyer',
      'ChIJH0VPDnG1yhQRT6KMutBg7lw',
      'pizza',
      'Kapı 4 kontrolü: Oliva İstanbul Sarıyer / Fatih Sultan Mehmet sınırında kaldığı için Etiler dışındadır.'
    ),
  ],
};
