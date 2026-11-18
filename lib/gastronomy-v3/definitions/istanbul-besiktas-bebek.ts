import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ISTANBUL_BESIKTAS_BEBEK_DEF: V3RegionDefinition = {
  id: 'bebek-besiktas',
  slug: 'bebek',
  city: 'İstanbul',
  district: 'Beşiktaş',
  allowedDistricts: ['Beşiktaş'],
  neighborhood: 'Bebek',
  officialQuarter: 'Bebek',
  displayName: 'Bebek, Beşiktaş, İstanbul',
  locative: "Bebek'te",
  path: ['istanbul', 'besiktas', 'bebek'],
  aliases: [
    'Bebek',
    'Küçük Bebek',
    'Kucuk Bebek',
    'Cevdet Paşa',
    'Cevdet Pasa',
    'İnşirah',
    'Insirah',
    'Manolya Sokak',
  ],
  scopeNote:
    'İstanbul · Beşiktaş · Bebek (Cevdet Paşa Cd., Küçük Bebek, Manolya Sk. ve İnşirah Yokuşu Doğrulanmış Seçkisi)',
  characterSubtitle:
    '1904 badem ezmesi ve sahil dondurma ritüelinden 1952 kıyı balıkçısına, Manolya Sokak gurme burger ve matcha barlarından Küçük Bebek artizan fırınlarına uzanan Boğaz kıyısı seçkisi.',
  center: { lat: 41.0781, lng: 29.0442 },
  bbox: { minLat: 41.0740, maxLat: 41.0835, minLng: 29.0400, maxLng: 29.0530 },
  allowedNeighborhoodTokens: ['Bebek'],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // --- HAMBURGER (2 doğrulanmış mekan — Bebek sınırları içinde pizza >= 4.4 bulunmadığından pizza dinamik olarak gizlenir) ---
    compactSeed({
      id: 'beb-bread-burger',
      placeId: 'ChIJd1-IdH63yhQR4Tj2n9L75n0',
      cat: 'hamburger',
      pinnedFirst: true,
      name: 'Bread & Burger',
      brand: 'bread',
      area: 'Manolya Sk., Bebek',
      signals: ['eksi-mayali-ekmek', 'satir-kiyma-kofte', 'manolya-sokak'],
      desc:
        'Manolya Sokak’ta günlük hazırlanan ekşi mayalı artizan ekmekleri, %100 süt danası satır kıyma köfteleri ve el yapımı soslarıyla Bebek’te burger odağını tutan adres.',
      order: [
        'Trüf Burger',
        'Klasik Bread & Burger',
        'Boşnak Burger',
      ],
      menu: ['Mexican Burger', 'Fit Burger (Marul Arası)', 'Ev Yapımı Patates Kızartması'],
      sec: [
        [
          'Buffalo Tavuk Kanatları & Mac and Cheese Topları',
          'Burger yanına çıtır atıştırmalık paylaşmak isteyen masaların sık tercih ettiği başlangıç ikilisi.',
          'Bread & Burger resmi menü kayıtları',
        ],
      ],
      seat: 'Manolya Sokak içinde iç oturum ve kaldırım kenarı masalar',
      crowd: 'Akşam ve hafta sonu öğle saatlerinde Bebek sakinleri ve burger odaklı gruplarla hareketli',
      dis: 'Manolya Sokak trafiği ve dar masa yerleşimi yoğun saatlerde biraz sıkışık hissettirebiliyor.',
      transit: 'Cevdet Paşa Caddesi’nden Manolya Sokak içine birkaç adımlık yürüyüşle.',
      sources: [
        [
          'Google Maps — Bread & Burger Bebek',
          'https://maps.google.com/?cid=9072215381429860577',
          'maps',
          'Bebek Manolya Sk. 12/A konumu ve operational durumu doğrulandı.',
        ],
        [
          'Bread & Burger Resmi Sitesi',
          'http://www.breadandburger.com.tr/',
          'operator',
          'Ekşi mayalı artizan ekmekler ve %100 süt danası satır kıyma burger yaklaşımı doğrulandı.',
        ],
        [
          'The Magger — Bebek Bread & Burger',
          'https://www.themagger.com',
          'editorial',
          'Bebek içi burger seçenekleri, Fit Burger ve ev yapımı sos çeşitliliği doğrulandı.',
        ],
      ],
      pros: [
        'Ekşi mayalı ekmek ve satır kıyma et kalitesini uzun süredir koruyan mutfak',
        'Sahil kalabalığının bir arka sokağı olan Manolya Sokak’ta kolay ulaşım',
      ],
      cons: ['Hafta sonları sokak içi dar oturma alanı çabuk dolabiliyor'],
      unc: ['Ekşi mayalı ekmek ve fit/vegan alternatif stokları güne göre değişebilir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'beb-ck-steakhouse',
      placeId: 'ChIJDSJ-MXK3yhQRoXjBQMV6qGo',
      cat: 'hamburger',
      name: 'ÇK & Steakhouse Bebek',
      brand: 'steakhouse',
      area: 'Küçük Bebek Cd., Bebek',
      signals: ['lokum-burger', 'kucuk-bebek-aks', 'steak-et-odagi'],
      desc:
        'Küçük Bebek yokuşu başında 170 gram dana lokum dilimli Lokum Burgeri, steak burgerleri ve porsiyon kasap etleriyle et ağırlıklı bir burger alternatifine odaklanan durak.',
      order: [
        'Lokum Burger (Dana Lokum Dilimli)',
        'Steak Burger',
        'Sucuk Burger',
      ],
      menu: ['ÇK Fit Burger', 'Cheese Burger', 'Karamelize Soğanlı Patates'],
      sec: [
        [
          'Dry-Aged Steak & Kasap Köfte Porsiyonları',
          'Burger dışında klasik ızgara et tabakları ve porsiyon köfte sunması et seven gruplar için avantaj sağlıyor.',
          'Küçük Bebek yerel menü kayıtları',
        ],
      ],
      seat: 'Küçük Bebek Caddesi girişinde şık ama samimi steak-burger salonu',
      crowd: 'Öğle ve akşam saatlerinde et odaklı yemek arayan bölge sakinleri ve gruplar',
      dis: 'Küçük Bebek trafiğinin hemen kenarında kaldığı için ön masalar cadde hareketine açık.',
      transit: 'Bebek sahil kavşağından Küçük Bebek Caddesi’ne doğru çıkarken No:25/B’de.',
      sources: [
        [
          'Google Maps — Çk&Steakhouse Bebek',
          'https://maps.google.com/?cid=7685527751721318561',
          'maps',
          'Bebek Küçük Bebek Cd. No:25/B konumu ve operational durumu doğrulandı.',
        ],
        [
          'Restoranim — ÇK Steakhouse Bebek Menü',
          'https://www.restoranim.net',
          'community',
          'Lokum Burger, Steak Burger, Sucuk Burger ve kasap köfte porsiyonları doğrulandı.',
        ],
        [
          'Yandex Haritalar — Bebek Et & Burger Seçkisi',
          'https://yandex.com.tr',
          'editorial',
          'Küçük Bebek Caddesi üzerindeki bağımsız steakhouse ve burger odağı doğrulandı.',
        ],
      ],
      pros: [
        'Dana lokum dilimli burgerle klasik kıyma burgerden ayrışan etçi dokunuşu',
        'Klasik steak porsiyonlarıyla karışık gruplara hitap etmesi',
      ],
      cons: ['Yokuş trafiğinin ve park arama sirkülasyonunun yoğun olduğu bir aksta konumlanır'],
      unc: ['Dry-aged kesim stokları gün içindeki servis yoğunluğuna bağlıdır.'],
      verifiedAt: '2026-11-15',
    }),

    // --- KAHVE (2 doğrulanmış saf kahveci — pasta/fırın ve zincirler dışlandı) ---
    compactSeed({
      id: 'beb-poco-coffee',
      placeId: 'ChIJi21dSs63yhQRO32vhkmH0XA',
      cat: 'kahve',
      pinnedFirst: true,
      name: 'POCO Coffee & Matcha Bar',
      brand: 'poco',
      area: 'Manolya Sk., Bebek',
      signals: ['seremonial-matcha', 'nitelikli-espresso', 'manolya-sokak'],
      desc:
        'Bebek’te nitelikli kahveyi seremonial ve platinum grade matcha barıyla buluşturan öncü durak; yulaf sütlü matcha ve çilekli soğuk matcha lattelerinin yanında sade espresso bazlılar da sunuyor.',
      order: [
        'Iced Strawberry Matcha Latte',
        'Seremonial Yulaf Sütlü Matcha',
        'Flat White & Espresso Bazlı Kahveler',
      ],
      menu: ['Sıcak Matcha Latte', 'Filtre Kahve', 'Americano'],
      sec: [
        [
          'Matcha Aromalı Kurabiyeler & Hafif Barlar',
          'İçecek odaklı menüye eşlik eden küçük matcha kurabiyeleri ve rafine tatlı barları öne çıkıyor.',
          'POCO resmi sitesi ve menü kayıtları',
        ],
      ],
      seat: 'Manolya Sokak üzerinde minimal iç tezgâh ve kaldırım kenarı bank/tabureler',
      crowd: 'Sabah yürüyüşü sonrası kahve-matcha alanlar ve semt gençleriyle dinamik akış',
      dis: 'Uzun masa başında çalışmaktan çok hızlı kahve/matcha molası ve kısa sohbet için tasarlanmış kompakt bir alan.',
      transit: 'Manolya Sokak No:8B üzerinde, Cevdet Paşa sahil hattına paralel ilk sokakta.',
      sources: [
        [
          'Google Maps — POCO Coffee & Matcha Bar Bebek',
          'https://maps.google.com/?cid=8129427552242466107',
          'maps',
          'Bebek Manolya Sk. No:8 D:B konumu ve operational durumu doğrulandı.',
        ],
        [
          'POCO Matcha Resmi Sitesi',
          'https://www.pocomatcha.com/',
          'operator',
          'Seremonial ve platinum grade matcha bar konsepti ile espresso çeşitleri doğrulandı.',
        ],
        [
          'JoinPearl & Menü Kayıtları — POCO Bebek',
          'https://joinpearl.co',
          'editorial',
          'Iced Strawberry Matcha Latte, yulaf sütlü matcha ve matcha kurabiye eşlikçileri doğrulandı.',
        ],
      ],
      pros: [
        'İstanbul’da seremonial derece matcha standardını kuran öncü bağımsız bar',
        'Espresso bazlı içeceklerde de temiz çekirdek kalibrasyonu',
      ],
      cons: ['Kompakt oturma kapasitesi nedeniyle kalabalık saatlerde al-götür daha pratik olur'],
      unc: ['Özel hasat matcha ve yulaf sütü çeşitleri döneme göre değişebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'beb-sabba-coffee',
      placeId: 'ChIJQbjk1-a7yhQRumtRASVmE0Y',
      cat: 'kahve',
      name: 'Sabba Coffee',
      brand: 'sabba',
      area: 'Cevdet Paşa Cd., Bebek',
      signals: ['bagimsiz-espresso-bari', 'sahil-cadde-konumu', 'gunluk-kurabiye'],
      desc:
        'Cevdet Paşa Caddesi üzerindeki büyük zincirlerin arasında nitelikli espresso, özenli süt dokusu ve günlük taze kurabiyeleriyle sessizce müdavim toplayan butik kahve dükkânı.',
      order: [
        'Nitelikli Espresso & Cortado',
        'Yöresel Filtre Kahve',
        'İmza Soğuk Kahveler',
      ],
      menu: ['Flat White', 'Iced Latte', 'Americano'],
      sec: [
        [
          'Günlük Artisan Kurabiyeler & Tatlı Eşlikçileri',
          'Zincir kafe vitrinlerinden ayrılan taze kurabiye ve unlu mamul eşlikçileriyle sade kahve saatine yakışıyor.',
          'Bebek yerel kafe menü kayıtları ve harita arşivi',
        ],
      ],
      seat: 'Cevdet Paşa Caddesi üzerinde kompakt, temiz ve düzenli kafe içi oturma köşesi',
      crowd: 'Zincir kahveci kalabalığından kaçıp temiz fincan arayan Bebek müdavimleri',
      dis: 'Sahil yürüyüş aksındaki ana cadde üzerinde küçük bir cepheye sahip olduğundan kalabalık gruplara uygun değil.',
      transit: 'Cevdet Paşa Caddesi No:46/C’de, Bebek meydanı ile Küçük Bebek kavşağı arasında.',
      sources: [
        [
          'Google Maps — Sabba Coffee Bebek',
          'https://maps.google.com/?cid=5049491916334394298',
          'maps',
          'Bebek Cevdet Paşa Cd. No:46/C konumu ve operational durumu doğrulandı.',
        ],
        [
          'Menu-TR — Sabba Coffee Bebek Menüsü',
          'https://menu-tr.com',
          'community',
          'Espresso bazlı kahveler, soğuk imza içecekler ve günlük kurabiye/tatlı eşlikçileri doğrulandı.',
        ],
        [
          'Yandex Haritalar — Bebek Bağımsız Kahve Noktaları',
          'https://yandex.com.tr',
          'editorial',
          'Cevdet Paşa Caddesi üzerinde zincirler dışı nitelikli kahve durağı olarak yüksek memnuniyet sağladığı doğrulandı.',
        ],
      ],
      pros: [
        'Cevdet Paşa’daki zincir tekeline karşı temiz demleme ve özenli espresso sunumu',
        'Sahil yürüyüşünün hemen yanında kolay erişim',
      ],
      cons: ['Genç bir adres olması ve sınırlı oturma alanı'],
      unc: ['Haftalık kurabiye ve tatlı eşlikçileri tezgâhtaki taze üretime bağlıdır.'],
      verifiedAt: '2026-11-15',
    }),

    // --- DATE MEKANLARI (1 birincil doğrulanmış mekan + Yirmibir Kebap ikincil) ---
    compactSeed({
      id: 'beb-sekizdeyiz',
      placeId: 'ChIJVwbvCwC3yhQROKwjxAiF-UU',
      cat: 'date',
      pinnedFirst: true,
      name: 'Sekizdeyiz Bebek',
      brand: 'sekizdeyiz',
      area: 'İnşirah Sk., Bebek',
      signals: ['insirah-yokusu', 'meze-ve-ocakbasi', 'imza-kokteyl-bar'],
      desc:
        'İnşirah Sokağı’nda Cunda ezmesi, pastırmalı humus ve zeytinyağlı enginar gibi meze tabaklarını zırh Adana-kuzu şiş ızgaraları ve özgün kokteyllerle birleştiren şık akşam buluşma adresi.',
      order: [
        'Cunda Ezmesi, Pastırmalı Humus & Zeytinyağlı Enginar',
        'Zırh Kıyması Adana & Kuzu Şiş',
        'İmza Kokteyller',
      ],
      menu: ['Gavurdağı & Bebek Salatası', 'Lahmacun & Pide Çeşitleri', 'Şarap Seçkisi'],
      sec: [
        [
          'Yanık Yedikule Salatası & Çilekli Semizotu',
          'Klasik ocakbaşı menülerinden farklılaşan taze ve yaratıcı salata seçenekleri özellikle kokteyl eşlikçisi olarak tercih ediliyor.',
          'Sekizdeyiz Bebek resmi menüsü ve gastronomi rehberleri',
        ],
      ],
      seat: 'İnşirah Sokağı’nda özenli masalar, bar köşesi ve akşam yemeğine uygun sıcak aydınlatma',
      crowd: 'Bebek akşam yemeği buluşmaları, çiftler ve kutlama masalarıyla nezih atmosfer',
      dis: 'Bebek’in en yüksek bütçeli akşam yemek kategorisinde yer alır ve hafta sonu için rezervasyon gerektirir.',
      transit: 'Cevdet Paşa’dan Bebek Parkı güney ucundaki İnşirah Sokağı No:7’ye kısa adımlarla.',
      sources: [
        [
          'Google Maps — Sekizdeyiz Bebek Restaurant & Kokteyl Bar',
          'https://maps.google.com/?cid=5042207530514885688',
          'maps',
          'Bebek İnşirah Sokağı No:7 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Sekizdeyiz Bebek Resmi Sitesi',
          'https://sekizdeyizbebek.com/',
          'operator',
          'Meze, ızgara, salata ve kokteyl bar menüsü doğrulandı.',
        ],
        [
          'Favori Lezzetler — Sekizdeyiz Bebek Değerlendirmesi',
          'https://www.favorilezzetler.com.tr',
          'editorial',
          'Meze kültürü ile et odaklı mutfağı ve imza kokteylleri birleştiren İnşirah Sokağı konsepti doğrulandı.',
        ],
        [
          'Yemeksepeti — Sekizdeyiz Bebek Menü Doğrulaması',
          'https://www.yemeksepeti.com',
          'community',
          'Zeytinyağlı enginar, Cunda ezmesi, zırh Adana ve yanık Yedikule salatası kalemleri doğrulandı.',
        ],
      ],
      pros: [
        'Klasik meyhane-ocakbaşı çizgisini kokteyl bar ve rafine salatalarla modernleştiren denge',
        'Sahil ana caddesinin kalabalığından bir adım içeride, İnşirah Sokağı’nda huzurlu konum',
      ],
      cons: ['Yüksek segment hesap bütçesi ve rezervasyon zorunluluğu'],
      unc: ['Mevsimsel salata ve meze çeşitleri dönemsel ürün tedarikine göre güncellenir.'],
      verifiedAt: '2026-11-15',
    }),

    // --- KAHVALTI (2 doğrulanmış mekan) ---
    compactSeed({
      id: 'beb-numa',
      placeId: 'ChIJX2ULcJHJyhQRoHX91gkIUDQ',
      cat: 'kahvalti',
      pinnedFirst: true,
      name: 'Numa Bebek',
      brand: 'numa',
      area: 'Cevdet Paşa Cd., Bebek',
      signals: ['ev-yapimi-ekmek-granola', 'all-day-kahvalti', 'cevdet-pasa-sahil'],
      desc:
        'Cevdet Paşa Caddesi sahil şeridinde kendi ekmeğini ve granolasını üreten; Numa Sunrise, Simitli Göz Yumurta ve Mediterranean Morning tabaklarıyla gün boyu modern kahvaltı sunan durak.',
      order: [
        'Numa Sunrise İmza Kahvaltı',
        'Mediterranean Morning & Simitli Göz Yumurta',
        'Kabaklı Fit Omlet',
      ],
      menu: ['Brioche Göz Yumurta', 'Hindi Fümeli Artisan Sandviç', 'Nitelikli Espresso & V60'],
      sec: [
        [
          'Trüflü Dört Mantarlı Pizetta & Günlük Fırın Vitrini',
          'Sabah kahvaltısı sonrasında gün ortasına sarkan masalar için kiş, kruvasan ve pizetta çeşitleri öne çıkıyor.',
          'Numa Bebek resmi menü kayıtları',
        ],
      ],
      seat: 'Cevdet Paşa sahil hattında aydınlık iç salon ve cadde kenarı keyifli dış masalar',
      crowd: 'Sabah Boğaz yürüyüşü sonrası kahvaltıya oturanlar ve Bebek müdavimleri',
      dis: 'Hafta sonu sabah-öğle geçişinde Cevdet Paşa sahil yürüyüşçüleriyle bekleme sırası oluşabiliyor.',
      transit: 'Cevdet Paşa Caddesi No:121 üzerinde, Bebek koyunun Rumelihisarı’na doğru uzanan kuzey aksında.',
      sources: [
        [
          'Google Maps — Numa Bebek',
          'https://maps.google.com/?cid=3769521726463767968',
          'maps',
          'Bebek Cevdet Paşa Cd. No:121 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Numa Cafe Resmi Sitesi',
          'https://www.numacafe.com.tr/',
          'operator',
          'Kendi üretimi ekmek/granola, Mediterranean Morning, Numa Sunrise ve all-day kahvaltı menüsü doğrulandı.',
        ],
        [
          'Müdavim — Numa Bebek Değerlendirmesi',
          'https://www.mudavim.net',
          'editorial',
          'Simitli göz yumurta, trüflü pizetta ve günlük fırın vitrini doğrulandı.',
        ],
      ],
      pros: [
        'Kendi mutfağında pişirilen ekmek ve granola ile oturmuş modern kahvaltı kalitesi',
        'Mangerie/Lucca çizgisine kıyasla tutarlı servis ve yüksek memnuniyet',
      ],
      cons: ['Bebek sahil bandı popülerliği nedeniyle hafta sonu masa bulmak zaman alabilir'],
      unc: ['Fırın vitrinindeki günlük kurabiye, cheesecake ve kiş seçenekleri güne göre değişir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'beb-season-bakery',
      placeId: 'ChIJX8_fnDG3yhQRkelrZ6TVqlA',
      cat: 'kahvalti',
      name: 'SEASON Artisan Bakery',
      brand: 'season',
      area: 'Küçük Bebek Cd., Bebek',
      signals: ['fransiz-patisserie', 'eksi-mayali-ekmek', 'rafine-sekersiz-opsiyon'],
      desc:
        'Küçük Bebek’te Fransız pastacılık tekniğini katkı maddesiz %100 ekşi mayalı köy ekmekleri, taze dolgulu kruvasanlar ve Paris-Brest eklerlerle buluşturan artizan fırın-patisserie.',
      order: [
        'Sade & Dolgulu Ev Yapımı Kruvasanlar',
        '%100 Ekşi Mayalı Köy Ekmeği Üstü Kahvaltılıklar',
        'Paris-Brest Ekler & Limonlu Cheesecake Tart',
      ],
      menu: ['Cevizli & Zeytinli Ekşi Maya Ekmek', 'Glütensiz Ekmek', 'Cappuccino & Filtre Kahve'],
      sec: [
        [
          'Çilekli Bademli Dacquoise Tart & Rafine Şekersiz Tatlılar',
          'Düşük şeker yaklaşımıyla hazırlanan meyveli tartlar ve glütensiz tatlılar kahvaltı sonrası vitrini tamamlıyor.',
          'SEASON Artisan Bakery resmi sitesi ve gastronomi rehberleri',
        ],
      ],
      seat: 'Küçük Bebek’te masalsı vitrin önünde sınırlı kafe masaları ve sıcak iç köşe',
      crowd: 'Ekşi maya ekmek almaya gelen semt sakinleri ve hafta sonu fırın-kahve buluşmaları',
      dis: 'Oturma alanı kısıtlıdır; ayrıca mekânda Türk çayı ve Türk kahvesi servis edilmiyor.',
      transit: 'Cevdet Paşa’dan Küçük Bebek Caddesi No:15-17 içine kısa yürüyüşle.',
      sources: [
        [
          'Google Maps — SEASON Artisan Bakery Bebek',
          'https://maps.google.com/?cid=5812693171161524625',
          'maps',
          'Bebek Küçük Bebek Cd. No:15-17 konumu ve operational durumu doğrulandı.',
        ],
        [
          'SEASON Artisan Bakery Resmi Sitesi',
          'http://www.seasonbakery.com/',
          'operator',
          '%100 ekşi mayalı ekmekler, kruvasanlar, Paris-Brest ekler ve minimum şeker felsefesi doğrulandı.',
        ],
        [
          'Gurme Rehber & Wanderlog — SEASON Bebek',
          'https://gurmerehber.com',
          'editorial',
          'Fransız patisserie tekniği ve mekânda Türk çayı/kahvesi bulunmadığı detayı doğrulandı.',
        ],
      ],
      pros: [
        'Gerçek %100 ekşi maya hamur kalitesi ve yüksek Fransız patisserie işçiliği',
        'Rafine şekersiz ve glütensiz tatlı/ekmek seçeneklerinde özen',
      ],
      cons: ['Türk çayı ve Türk kahvesi olmaması klasik kahvaltı arayanlara uymayabilir'],
      unc: ['Özel dolgulu kruvasan ve ekmek partileri gün içinde tükenebiliyor.'],
      verifiedAt: '2026-11-15',
    }),

    // --- MUTLAKA DENEMELİSİN (3 doğrulanmış mekan — Yirmibir Kebap Date sekmesine de ikincil bağlanır) ---
    compactSeed({
      id: 'beb-badem-ezmesi',
      placeId: 'ChIJLSBYMB22yhQRXQ-T77zbJBs',
      cat: 'denemelisin',
      pinnedFirst: true,
      name: 'Meşhur Bebek Badem Ezmesi',
      brand: 'badem ezmesi',
      area: 'Cevdet Paşa Cd., Bebek',
      signals: ['1904-tarihi-kurum', 'havanda-badem-ezmesi', 'bebek-simgesi'],
      flags: { heritage: true },
      desc:
        '1904’ten beri Cevdet Paşa üzerindeki tarihî tezgâhında taze bademleri havanda döverek katkısız el yapımı sade ve fıstıklı badem ezmesi üreten İstanbul’un asırlık lezzet simgesi.',
      order: [
        'Geleneksel Sade Badem Ezmesi',
        'Antep Fıstıklı Badem Ezmesi',
        'El Yapımı Şekerleme & Lokum Seçkisi',
      ],
      menu: ['Sade Badem Ezmesi (Paket)', 'Fıstıklı Badem Ezmesi (Paket)', 'Bitter Çikolata Kaplı Çeşitler'],
      sec: [
        [
          'Fıstıklı Lokum & Geleneksel El Yapımı Çikolatalar',
          'Badem ezmesi kutularının yanında hediyelik olarak tercih edilen küçük lokum ve el yapımı çikolata seçenekleri.',
          'Meşhur Bebek Badem Ezmesi resmi kaynakları ve ansiklopedik kayıtlar',
        ],
      ],
      seat: 'Tarihi paket satış tezgâhı; yalnızca al-götür düzeninde hizmet verir (oturma alanı yok)',
      crowd: 'Semt yürüyüşçüleri, hediyelik kutu alan İstanbullular ve gün içi sakin tezgâh akışı',
      dis: 'İçeride oturma düzeni yoktur; bazı ziyaretçiler ezmenin şeker oranını geleneksel tarif gereği tatlı bulabiliyor.',
      transit: 'Cevdet Paşa Caddesi No:53/C’de, Bebek meydanı hattının tam üzerinde.',
      sources: [
        [
          'Google Maps — Meşhur Bebek Badem Ezmesi',
          'https://maps.google.com/?cid=1955929742705364829',
          'maps',
          'Bebek Cevdet Paşa Cd. No:53/C konumu ve operational durumu doğrulandı.',
        ],
        [
          'Meşhur Bebek Badem Ezmesi Resmi Sitesi',
          'https://www.meshurbebekbademezmesi.com.tr/',
          'operator',
          '1904 kuruluş geçmişi, katkısız el yapımı sade ve fıstıklı badem ezmesi üretimi doğrulandı.',
        ],
        [
          'Vikipedi — Meşhur Bebek Badem Ezmesi Tarihi',
          'https://tr.wikipedia.org/wiki/Me%C5%9Fhur_Bebek_Badem_Ezmesi',
          'editorial',
          '1904 tarihli tarihî İstanbul şekercilik kurumu statüsü doğrulandı.',
        ],
        [
          'İstanbul.net Kültür & Gastronomi Arşivi',
          'https://www.istanbul.net.tr',
          'community',
          'Bebek semtiyle özdeşleşmiş paket tezgâhı geleneği doğrulandı.',
        ],
      ],
      pros: [
        '1904’ten bugüne aynı sokakta el işçiliği tarifini koruyan nadir gastronomi mirası',
        'Hediyelik ve yürüyüş molası için katkısız geleneksel üretim',
      ],
      cons: [
        'Oturma alanı bulunmayan saf paket dükkânı olması ve fiyat/tat profilinin herkesin damak tadına uymaması',
      ],
      unc: ['Sezonluk taze badem hasadına göre doku ve nem dengesinde küçük nüanslar olabilir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'beb-mini-dondurma',
      placeId: 'ChIJLztnMR22yhQRgVOOyJcZ5dE',
      cat: 'denemelisin',
      name: 'Bebek Mini Dondurma',
      brand: 'mini dondurma',
      area: 'Cevdet Paşa Cd., Bebek',
      signals: ['sahil-kulahta-rituel', 'nane-lokumlu', 'taze-sut-ve-meyve'],
      flags: { ritual: true },
      desc:
        'Bebek sahil yürüyüşlerinin vazgeçilmez nostaljik külahta dondurma penceresi; gerçek süt ve taze meyveyle hazırladığı nane lokumlu ve Lotus bisküvili toplarıyla yıllardır aynı küçük dükkânda.',
      order: [
        'Nane Lokumlu Dondurma',
        'Lotus Bisküvili Dondurma',
        'Taze Mevsim Meyveli & Sütlü Klasik Toplar',
      ],
      menu: ['Çikolatalı Dondurma', 'Karamelli Dondurma', 'Karadut & Limon Sorbe'],
      sec: [
        [
          'Karamelli & Çikolatalı Külahta Karışık Seçenekler',
          'Mevsimlik meyvelerin yanında yoğun sütlü karamelli ve çikolatalı klasikler külah ikilisini tamamlıyor.',
          'İstanbul gastronomi rehberleri ve ziyaretçi kayıtları',
        ],
      ],
      seat: 'Cevdet Paşa Caddesi üzerinde küçük al-götür penceresi; sahil yürüyüşünde ayakta tüketilir (oturma alanı yok)',
      crowd: 'Özellikle güneşli öğleden sonra ve akşamüstü saatlerinde kapı önünde kısa külah sırası',
      dis: 'Oturma alanı yoktur; sıcak yaz ve bahar akşamlarında pencere önünde kısa kuyruk beklenebiliyor.',
      transit: 'Cevdet Paşa Caddesi No:38/A üzerinde, Bebek Parkı’na birkaç adımlık mesafede.',
      sources: [
        [
          'Google Maps — Bebek Mini Dondurma',
          'https://maps.google.com/?cid=15124523063289205633',
          'maps',
          'Bebek Cevdet Paşa Cd. 38/A konumu ve operational durumu doğrulandı.',
        ],
        [
          'İstanbul Dondurma Rehberleri — Bebek Mini Dondurma',
          'https://www.timeout.com',
          'editorial',
          'Taze süt ve meyveli üretim, Lotus bisküvili ve nane lokumlu çeşitleri ile sahil ritüeli doğrulandı.',
        ],
        [
          'Tripadvisor Bebek Topluluk Kayıtları',
          'https://www.tripadvisor.com.tr',
          'community',
          'Yıllardır kalitesini koruyan küçük al-götür penceresi geleneği doğrulandı.',
        ],
      ],
      pros: [
        'Yapay şuruba kaçmayan, taze sütlü ve meyveli temiz dondurma kıvamı',
        'Bebek sahil yürüyüşünü tamamlayan klasik mahalle penceresi ritüeli',
      ],
      cons: ['Küçük tezgâh önünde yoğun akşamlarda sıra oluşması ve oturma alanı olmaması'],
      unc: ['Mevsimlik meyve çeşitleri günlük tezgâh stoğuna göre rotasyonla çıkar.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'beb-yirmibir-kebap',
      placeId: 'ChIJ52I0-Cm3yhQRoDPGFcUE_VM',
      cat: 'denemelisin',
      secondaryCategoryIds: ['date'],
      name: 'Yirmibir Kebap Bebek',
      brand: 'yirmibir',
      area: 'Manolya Sk., Bebek',
      signals: ['bohem-ocakbasi', 'ev-yapimi-mezeler', 'manolya-sokak'],
      desc:
        'Tarihî pasaj ocakbaşı ruhunu bohem bir dokunuşla Manolya Sokak’a taşıyan; zırh Adana, Diyarbakır usulü ciğer şiş ve taze zeytinyağlı/yoğurtlu mezeleriyle Bebek’in sürpriz kebap durağı.',
      order: [
        'Zırh Adana & Urfa Kebap',
        'Diyarbakır Usulü Ciğer Şiş & Çöp Şiş',
        'Atom, Humus & Ev Yapımı Ocakbaşı Mezeleri',
      ],
      menu: ['Kuzu Şiş', 'Haydari & Acılı Ezme', 'Közlenmiş Sebze Eşlikçileri'],
      sec: [
        [
          'Kuzu Şiş & Yoğurtlu Soğuk Başlangıçlar',
          'Ana ızgara öncesi masayı donatan günlük haydari, humus ve atom ikilisi akşam buluşmalarına uyum sağlıyor.',
          'Bebek ocakbaşı menü kayıtları ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Manolya Sokak’ta loş ışıklı, samimi bohem meyhane-ocakbaşı masaları',
      crowd: 'Bebek içi klasik balık/kafe çizgisi dışında samimi rakı-kebap akşamı arayan gruplar',
      dis: 'Ocakbaşı ölçeği kompakt olduğundan hafta sonu akşamlarında rezervasyonsuz yer bulmak zor ve bütçesi semt ortalamasına paralel yüksek.',
      transit: 'Cevdet Paşa’dan Manolya Sokak No:1 içine döner dönmez.',
      sources: [
        [
          'Google Maps — Yirmibir Kebap Bebek',
          'https://maps.google.com/?cid=6051998718776193952',
          'maps',
          'Bebek Manolya Sk. No:1 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Stilika & Mekân İncelemeleri — Yirmibir Kebap Bebek',
          'https://www.stilika.com',
          'editorial',
          'Bohem ocakbaşı atmosferi, atom/humus mezeleri ve kebap menüsü doğrulandı.',
        ],
        [
          'Yandex Haritalar — Yirmibir Kebap Bebek',
          'https://yandex.com.tr',
          'community',
          'Manolya Sokak girişindeki konumu ve ocakbaşı lezzet istikrarı doğrulandı.',
        ],
      ],
      pros: [
        'Bebek sahil şeridinde nitelikli zırh kebap ve ciğer şiş sunan nadir bağımsız ocakbaşı',
        'Hem günlük keyifli akşam yemeğine hem Date buluşmasına uygun samimi atmosfer',
      ],
      cons: ['Bebek konumuna bağlı yüksek bütçe seviyesi ve kompakt salon kapasitesi'],
      unc: ['Hafta sonları grup yoğunluğuna göre ocakbaşı servisi biraz uzayabilir.'],
      verifiedAt: '2026-11-15',
    }),

    // --- BALIKÇILAR & DENİZ ÜRÜNLERİ (1 doğrulanmış tarihi kurum — YALNIZCA localRitualProtected!) ---
    compactSeed({
      id: 'beb-bebek-balikci',
      placeId: 'ChIJScCPisi3yhQRMhVKw4AZVWY',
      cat: 'balik',
      pinnedFirst: true,
      name: 'Bebek Balıkçı',
      brand: 'bebek balıkçı',
      area: 'Cevdet Paşa Cd., Bebek',
      signals: ['1952-bogaz-kurumu', 'deniz-kirpi-taramasi', 'yali-kiyi-sofrasi'],
      flags: { ritual: true },
      desc:
        '1952’den beri Cevdet Paşa’nın Boğaz kıyısında hizmet veren tarihî deniz ürünleri kurumu; efsaneleşmiş deniz kirpi taraması, lakerdası, günlük ızgara levrek-dülgeri ve kıyı teras masalarıyla semtin hafızasında yer tutuyor.',
      order: [
        'Deniz Kirpi Taraması',
        'Mevsim Günlük Izgara Levrek / Dülger',
        'Balık Çorbası & Lakerda',
      ],
      menu: ['Levrek Marine & Somon Füme', 'Kalamar & Midye Dolma', 'Klasik Meyhane Mezeleri'],
      sec: [
        [
          'Karides Güveç, Cevizli Balık & Balık Köftesi',
          'Soğuk meze ve çorba girişinin ardından gelen sıcak ara sıcak üçlüsü masaların vazgeçilmezleri arasında.',
          'Bebek Balıkçı resmi menü kayıtları ve İstanbul gastronomi arşivi',
        ],
      ],
      seat: 'Boğaz suyuna sıfır tarihî deniz cephesi masaları ve kapalı kıyı salonu',
      crowd: 'Özel akşam kutlamaları, yabancı konuk ağırlayanlar ve köklü Bebek müdavimleri',
      dis: 'Boğaz kıyısı lüks segment fiyatlaması oldukça yüksektir; yoğun dönemlerde masa servisi hızında ve hesap-performans dengesinde dalgalanma şikâyetleri görülebiliyor.',
      transit: 'Cevdet Paşa Caddesi No:26/A’da, Bebek iskelesi ve sahil yürüyüş yolunun hemen yanında.',
      sources: [
        [
          'Google Maps — Bebek Balıkçı',
          'https://maps.google.com/?cid=7373828005711975730',
          'maps',
          'Bebek Cevdet Paşa Cd. 26/A konumu ve operational durumu doğrulandı.',
        ],
        [
          'Bebek Balıkçı Resmi Sitesi',
          'http://www.bebekbalikci.com.tr/',
          'operator',
          '1952 kuruluş geçmişi, deniz ürünleri menüsü ve kıyı teras konumu doğrulandı.',
        ],
        [
          'Gastromanya — Bebek Balıkçı İncelemesi',
          'https://www.gastromanya.com',
          'editorial',
          'Deniz kirpi taraması, balık çorbası ve Boğaz sıfır konumuyla tarihsel kıyı kurumu olduğu doğrulandı.',
        ],
        [
          'Mesprestiges & Mekanlar — Bebek Balıkçı Notları',
          'https://www.mesprestiges.com',
          'community',
          'Lakerda, cevizli balık ve yüksek fiyat/servis dalgalanması notlarıyla semt ritüeli statüsü teyit edildi.',
        ],
      ],
      pros: [
        '1952’den beri aynı Boğaz kıyısı noktasında varlığını koruyan yaşayan balıkçı kurumu',
        'Deniz kirpi taraması, lakerda ve günlük mevsim balığı gibi klasik reçeteler',
      ],
      cons: [
        'Çok yüksek Boğaz kıyısı hesap seviyesi ve zaman zaman yoğunlukta yaşanan servis/fiyat-performans eleştirileri',
      ],
      unc: ['Günlük av balığı ve deniz kirpi taraması stoğu mevsime göre değişebiliyor.'],
      verifiedAt: '2026-11-15',
    }),

    // --- NEGATIVE AUDIT CONTROLS (Policy Gates 1, 2, 3B, 4, 6 doğrulaması) ---
    negControl(
      'beb-neg-sankai',
      'ChIJP5ueOS23yhQRpSLxX8OiVgk',
      'date',
      'Kapı 1 kontrolü: Sankai by Nagaya harita kaydında CLOSED_TEMPORARILY döndüğü için dışlanır.'
    ),
    negControl(
      'beb-neg-upper-crust',
      'ChIJW3yKlgK2yhQRFrqB-EjtK2w',
      'pizza',
      'Kapı 2 & 6 kontrolü: The Upper Crust Pizzeria Bebek zincir (upper crust) ve 3.9 puan nedeniyle elenir.'
    ),
    negControl(
      'beb-neg-espressolab',
      'ChIJC67CD9C3yhQR4_xkNE3AZFs',
      'kahve',
      'Kapı 2 kontrolü: Espressolab Bebek çok şubeli zincir (espressolab) olarak CHAIN_BLOCKLIST üzerinden dışlanır.'
    ),
    negControl(
      'beb-neg-divan',
      'ChIJWePUPB22yhQRSjCWpisL7qY',
      'kahvalti',
      'Kapı 2 kontrolü: Divan Pastanesi Bebek CHAIN_BLOCKLIST (divan) kapsamında dışlanır.'
    ),
    negControl(
      'beb-neg-selamlique',
      'ChIJRwBwOBS2yhQRWeskznaQcrI',
      'kahve',
      'Kapı 2 kontrolü: Selamlique Bebek zincir (selamlique) olarak CHAIN_BLOCKLIST kapsamında dışlanır.'
    ),
    negControl(
      'beb-neg-ninda',
      'ChIJ9XHKOcy3yhQRRf_9uzG0BKk',
      'kahve',
      'Kapı 3B & 6 kontrolü: Ninda Bebek ana türü bakery (ve 4.0 puan) olduğu için saf kahveci kuralıyla elenir.'
    ),
    negControl(
      'beb-neg-atlas-balik',
      'ChIJh2_fX723yhQRMZPOS6eCOQA',
      'balik',
      'Kapı 4 kontrolü: ATLAS BALIK güneyde Arnavutköy hattında (41.06743) yer aldığı için strict Bebek bbox dışındadır.'
    ),
    negControl(
      'beb-neg-piccola-arnavutkoy',
      'ChIJ34LIXGu3yhQRbVg8y-_mEEc',
      'pizza',
      'Kapı 4 kontrolü: Piccola Pizzeria Arnavutköy mahallesinde yer aldığı için Bebek sınırları dışındadır.'
    ),
    negControl(
      'beb-neg-lucca',
      'ChIJX2Ug_v-3yhQR_ewLcNyaTuc',
      'date',
      'Kapı 6 kontrolü: Lucca 2.9 puan ile 4.4 tabanı altında kaldığından elenir.'
    ),
    negControl(
      'beb-neg-mangerie',
      'ChIJE2G-ygK2yhQRdvYZjzFVBKc',
      'kahvalti',
      'Kapı 6 kontrolü: Mangerie 3.4 puan ile 4.4 tabanı altında kaldığından elenir.'
    ),
  ],
};
