import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ISTANBUL_BEYOGLU_ASMALIMESCIT_DEF: V3RegionDefinition = {
  id: 'asmalimescit-beyoglu',
  slug: 'asmalimescit',
  city: 'İstanbul',
  district: 'Beyoğlu',
  allowedDistricts: ['Beyoğlu', 'Taksim'],
  neighborhood: 'Asmalımescit & Pera',
  officialQuarter: 'Asmalı Mescit, Evliya Çelebi & Tomtom',
  displayName: 'Asmalımescit & Pera, Beyoğlu, İstanbul',
  locative: "Asmalımescit ve Pera'da",
  path: ['istanbul', 'beyoglu', 'asmalimescit'],
  aliases: [
    'Asmalımescit',
    'Asmalimescit',
    'Pera',
    'Beyoğlu',
    'Beyoglu',
    'Tünel',
    'Tunel',
    'Meşrutiyet',
    'Mesrutiyet',
    'Odakule',
    'Tepebaşı',
    'Tepebasi',
    'Galatasaray',
    'İstiklal Caddesi',
  ],
  scopeNote:
    'Tünel Meydanı ile Galatasaray arasında; güneyde Şişhane–Kumbaracı hattı, batıda Tepebaşı–Meşrutiyet aksı, doğuda İstiklal–Tomtom sınırları içindeki Asmalımescit & Pera seçkisi.',
  characterSubtitle:
    'Köklü meyhaneler, şef mutfakları, butik şarap barları ve 1967’den gelen kahve ritüeliyle Pera gastronomisi',
  center: { lat: 41.0306, lng: 28.9754 },
  bbox: { minLat: 41.02812, maxLat: 41.03315, minLng: 28.9718, maxLng: 28.97805 },
  allowedNeighborhoodTokens: [
    'Asmalı Mescit',
    'Asmalımescit',
    'Evliya Çelebi',
    'Şahkulu',
    'Tomtom',
    'Çatma Mescit',
    'Pera',
    'Meşrutiyet',
  ],
  categories: buildRegionCategories(),
  candidates: [
    // =========================================================================
    // 1. PİZZA
    // =========================================================================
    compactSeed({
      id: 'asmalimescit-pizzeria-pera',
      placeId: 'ChIJKxUZXuC5yhQRrYPeNdd9L6U',
      cat: 'pizza',
      pinnedFirst: true,
      area: 'Gönül Sk., Asmalımescit',
      signals: [
        '2013’ten bu yana Gönül Sokak’ta tek şubeyle açık İtalyan pizzacısı',
        'İtalya’dan getirilen Valoriani odun ateşli taş fırında 30 cm ince hamur pizza',
        'Manda mozzarella, burrata, prosciutto crudo ve Kalabriya salamlı klasik reçeteler',
      ],
      desc: "Asmalımescit’te Gönül Sokak’ta 2013’ten beri tek adreste hizmet veren Pizzeria Pera, İtalya’dan getirilen Valoriani taş fırınında ve odun ateşinde pişirdiği ince hamurlu Napoliten pizzalarıyla öne çıkıyor. Uzun süre dinlendirilmiş hamuru, manda mozzarella ve burrata gibi nitelikli malzemelerle buluşturuyor.",
      order: ['Margherita', 'Pesto e Burrata'],
      menu: ['Odun ateşinde pizzalar', 'Ev yapımı İtalyan tatlıları'],
      sec: [
        [
          'Quattro Formaggi',
          'Mozzarella, gorgonzola, isli scamorza ve parmesan dörtlüsüyle yoğun peynirli alternatif.',
          'pizzeriapera.com menü verisi: Quattro Formaggi içeriği',
        ],
        [
          'Tiramisù',
          'Mascarpone, kedi dili, espresso ve kakao ile hazırlanan klasik final.',
          'pizzeriapera.com Dolci bölümü',
        ],
      ],
      seat: 'Dar ara sokakta sıcak ahşap iç salon ve birkaç sokak masası.',
      crowd: 'Akşam yemeklerinde kalabalık ve enerjik; arka planda klasik rock eşlik ediyor.',
      dis: 'Pazar günleri kapalı ve popüler akşam saatlerinde rezervasyonsuz masa bulmak zorlaşabiliyor.',
      transit: 'M2 Şişhane Metro İstiklal veya Meşrutiyet çıkışından birkaç dakikalık yürüyüş.',
      sources: [
        [
          'Pizzeria Pera Resmi Sitesi',
          'http://www.pizzeriapera.com/',
          'operator',
          'Gönül Sk. No:6/A adresinde 2013’ten beri tek şube, Valoriani odun fırını ve pizza menüsü.',
        ],
        [
          'Yandex Harita Yerel Kayıtları',
          'https://maps.google.com/?cid=11902870703438726061',
          'community',
          'Şişhane yakınındaki taş fırın hamuru, malzeme tazeliği ve klasik pizzalarına dair topluluk notları.',
        ],
        [
          'Bgnneyesem Rehber İncelemesi',
          'https://bgnneyesem.com/',
          'editorial',
          'Sürdürülebilir yerel üretici odağı ve odun ateşinde pişen 30 cm Napoli usulü pizzaları vurgulanıyor.',
        ],
      ],
      pros: [
        '2013’ten beri tek şubeyle çalışan bağımsız Asmalımescit klasiği',
        'Valoriani taş fırında odun ateşinde yüksek ısı pişimi',
        'Hamur ve peynir kalitesinde tutarlılık',
      ],
      cons: [
        'Pazar günleri kapalı olması hafta sonu planını kısıtlıyor',
        'Salon kapasitesi küçük olduğu için akşam saatlerinde beklemeye açık',
      ],
      unc: ['Google Places fiyat seviyesi belirtilmemiş olsa da menü fiyatları üst-orta segmentte seyreder.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-play-pizza',
      placeId: 'ChIJdwzo2-C5yhQRD9MauOLgK-I',
      cat: 'pizza',
      name: 'Play Pizza',
      brand: 'play',
      area: 'Ensiz Sk., Asmalımescit',
      signals: [
        'Ensiz Sokak’ta Şişhane ve Tünel hattına yakın tek şubeli mahalle pizzacısı',
        'İnce ve çıtır İtalyan tarzı hamur üzerinde bol malzemeli günlük çeşitler',
        'Küçük ve orta boy seçenekleriyle pratik öğle-akşam durağı',
      ],
      desc: 'Ensiz Sokak’ta Tünel ve Şişhane arasında saklanan Play Pizza, gösterişsiz ama işlevsel bir ara sokak pizzacısı. İncecik açılan İtalyan tarzı hamurunun üzerinde dengeli sos ve bol malzemeli klasikleri hızlı servisle masaya getiriyor.',
      order: ['Mescolare Pizza', 'Regina Pizza'],
      menu: ['İnce hamurlu pizzalar', 'Peynirli ve vejetaryen çeşitler'],
      sec: [
        [
          'Castello Pizza',
          'Sucuk, dana jambon ve taze mantar üçlüsüyle doyurucu etli seçenek.',
          'Yemeksepeti & menü kayıtlarında Castello Pizza içeriği',
        ],
        [
          'Gorgonzola Pizza',
          'Peynir ağırlıklı, daha keskin aromalı bir alternatif arayanlar için.',
          'Menü çeşitleri listesi',
        ],
      ],
      seat: 'İçeride samimi birkaç masa ve sokak cephesinde küçük oturma düzeni.',
      crowd: 'Gündüz ve erken akşamda sakin; çevre çalışanları ve semt müdavimleri uğruyor.',
      dis: 'Atmosfer şık bir akşam restoranından çok günlük ve hızlı bir mahalle pizzacısı çizgisinde.',
      transit: 'Tünel Meydanı ve M2 Şişhane Meşrutiyet çıkışından kısa yürüyüş.',
      sources: [
        [
          'Menu-TR Mekan Özeti',
          'https://www.menu-tr.com/',
          'community',
          'Ensiz Sokak’taki ince İtalyan hamuru, pratik servis ve Mescolare/Regina beğenileri.',
        ],
        [
          'Yandex Harita Yerel Kayıtları',
          'https://maps.google.com/?cid=16297366940926268175',
          'community',
          'Şişhane/Tünel yakınında tek lokasyonlu samimi sokak pizzacısı konumu ve kullanıcı notları.',
        ],
        [
          'Yemeksepeti Menü Kaydı',
          'https://www.yemeksepeti.com/',
          'community',
          'Mescolare, Regina, Castello ve Gorgonzola pizza çeşitleri ile porsiyon boyutları doğrulandı.',
        ],
      ],
      pros: [
        'İnce, mideyi yormayan hamur ve fiyat-performans dengesi',
        'Semt içi tek şube olarak tutarlı yerel kimlik',
      ],
      cons: [
        'Oturma alanı kısıtlı; uzun süreli date akşamı için uygun değil',
        'Akşamüstü paket servis yoğunluğunda servis yavaşlayabiliyor',
      ],
      unc: ['Hafta sonu geç saatlerde Ensiz Sokak yaya geçişi daralabiliyor.'],
      verifiedAt: '2026-11-15',
    }),

    // =========================================================================
    // 2. HAMBURGER — Politikamız gereği dolgu yok (0 mekan -> sekme otomatik gizlenir)
    // =========================================================================

    // =========================================================================
    // 3. KAHVE (Saf kahveciler; pastane/çikolatacı hariç)
    // =========================================================================
    compactSeed({
      id: 'asmalimescit-mandabatmaz',
      placeId: 'ChIJey_CUGS3yhQR8We58TT5ifM',
      cat: 'kahve',
      pinnedFirst: true,
      area: 'Olivya Geçidi, Asmalımescit',
      flags: { heritage: true, iconic: true },
      signals: [
        '1967’den bu yana Olivya Geçidi’nde yalnız geleneksel Türk kahvesi odaklı kurum',
        'Bakır cezvede parmak kalınlığında köpüğüyle simgeleşmiş sade, orta ve şekerli demleme',
        'Asmalımescit’in tarihi geçidinde küçük taburelerde hızlı ve özgün kahve ritüeli',
      ],
      desc: "1967’den beri Olivya Geçidi’nin ağzında duran Mandabatmaz, kapsamlı bir kafe menüsü yerine odağını tamamen geleneksel Türk kahvesine ayıran köklü bir durak. Bakır cezvede ağır ağır pişen, yoğun kıvamlı ve koyu köpüklü fincanı yarım asrı aşkın süredir aynı reçeteyle servis ediliyor.",
      order: ['Orta Türk Kahvesi', 'Sade Türk Kahvesi'],
      menu: ['Bakır cezvede Türk kahvesi', 'Demleme Türk çayı'],
      sec: [
        [
          'Türk Çayı',
          'Kahve dışı eşlikçi arayanlar için klasik ince belli bardakta sade çay.',
          'mandabatmaz.com.tr içecek listesi',
        ],
      ],
      seat: 'Dar içeride birkaç masa ve çoğunlukla Olivya Geçidi taşlarına dizili alçak tabureler.',
      crowd: 'Günün her saati hareketli; yerli müdavimler ve gezginler yan yana oturuyor.',
      dis: 'Alçak tabure düzeni uzun süreli oturma veya bilgisayar açmaya uygun değil; yoğunlukta sıra beklenebiliyor.',
      transit: 'İstiklal Caddesi Odakule – Galatasaray aralığından Olivya Geçidi içine iki adım.',
      sources: [
        [
          'Mandabatmaz Resmi Sitesi',
          'http://www.mandabatmaz.com.tr/',
          'operator',
          '1967 kuruluş tarihi, bakır cezve hazırlığı ve Olivya Geçidi adresi doğrulandı.',
        ],
        [
          'Beyoğlu Belediyesi Kültür Rehberi',
          'https://www.beyoglu.gov.tr/',
          'editorial',
          'Asmalımescit kültür mirası içinde Mandabatmaz’ın tarihi Türk kahvesi durağı olarak kaydı.',
        ],
        [
          'Oggusto İstanbul Kahve Seçkisi',
          'https://www.oggusto.com/',
          'editorial',
          'Yoğun köpüğü ve yarım asırlık reçetesiyle semtin vazgeçilmez geleneksel kahvecisi.',
        ],
      ],
      pros: [
        '1967’den beri süren değişmez Türk kahvesi standardı',
        'İkonik Olivya Geçidi sokak atmosferi ve hızlı erişim',
      ],
      cons: [
        'Tatlı/yemek eşlikçisi neredeyse yok; alçak tabureler kısa mola için uygun',
        'Yoğun saatlerde oturacak boş tabure bulmak bekletebiliyor',
      ],
      unc: ['Yazın güneşli öğle saatlerinde geçit girişi kalabalıklaşabiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-espo-coffee',
      placeId: 'ChIJf-JdGEW5yhQR9ejklefn0eI',
      cat: 'kahve',
      area: 'Kıblelizade Sk., Pera',
      signals: [
        'Evliya Çelebi / Şişhane hattında kavurma odaklı üçüncü dalga tek şube',
        'Guatemala Antigua ve Kolombiya Huila gibi tek kökenli çekirdek kavrumları',
        'Espresso bazlı içeceklerin yanında el demlemesi filtre ve Türk kahvesi seçenekleri',
      ],
      desc: 'Kıblelizade Sokak’ta Şişhane çıkışının hemen yamacında yer alan Espo Coffee Roastery, çekirdek seçimine ve kendi kavrumuna odaklanan tek lokasyonlu bir üçüncü dalga kahveci. Tek kökenli filtrelerden espresso bazlı klasiklere temiz profilli fincanlar çıkarıyor.',
      order: ['Tek Kökenli Filtre Kahve', 'Flat White'],
      menu: ['Kendi kavrumu espresso içecekler', 'Tek kökenli filtre ve Türk kahvesi'],
      sec: [
        [
          'Türk Kahvesi',
          'Nitelikli çekirdeklerden öğütülmüş geleneksel kavrum Türk kahvesi alternatifi.',
          'espocoffee.com ürün yelpazesi',
        ],
      ],
      seat: 'Kompakt, sade bir iç alan; kısa kahve molası ve birkaç masa için elverişli.',
      crowd: 'Kalabalık İstiklal trafiğinden uzak, çoğunlukla bölge sakinleri ve çalışanların uğradığı sakin tempo.',
      dis: 'Metrekare olarak dar olduğu için kalabalık arkadaş gruplarıyla uzun süre oturmaya elverişli değil.',
      transit: 'M2 Şişhane Metro Vergi Dairesi / Meşrutiyet çıkışına yürüme mesafesinde.',
      sources: [
        [
          'Espo Coffee Roastery Resmi Sitesi',
          'http://www.espocoffee.com/',
          'operator',
          'Evliya Çelebi Kıblelizade Sk. No:14/A konumu, kavurma yaklaşımı ve tek kökenli çekirdekler.',
        ],
        [
          'Yandex Harita Yerel Kayıtları',
          'https://maps.google.com/?cid=16344099504542509301',
          'community',
          'Şişhane yakınındaki espresso, filtre kahve ve sakin sokak molası geri bildirimleri.',
        ],
      ],
      pros: [
        'Kendi kavrumu single-origin çekirdeklerle net tat profili',
        'Şişhane’nin kalabalığından sıyrılan sakin ara sokak konumu',
      ],
      cons: [
        'İç mekan kapasitesi sınırlı',
        'Mutfak/kahvaltı seçeneği yerine tamamen kahveye odaklanıyor',
      ],
      unc: ['Kavrum takvimine göre mevcut single-origin çekirdek seçkisi değişebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-ecuador-coffee',
      placeId: 'ChIJs3O6wIi5yhQR-50T4EpJumo',
      cat: 'kahve',
      area: 'Meşrutiyet Cd., Pera',
      signals: [
        'Meşrutiyet Caddesi üzerinde Şişhane metroya komşu tek şubeli üçüncü dalga kafe',
        'Barista özeniyle hazırlanan dengeli flat white, latte ve demleme filtre kahveler',
        'Kahve molasına eşlik eden taze günlük tatlılar',
      ],
      desc: 'Meşrutiyet Caddesi’nin Şişhane ucunda yer alan Ecuador Coffee House, bölgede zincirlere bulaşmadan bağımsız kalan nadir üçüncü dalga kahve duraklarından biri. Dengeli kavrulmuş espresso bazlı içecekleri ve ferah masa düzeniyle gün içi kahve molasına rahat bir zemin sunuyor.',
      order: ['Flat White', 'Filtre Kahve'],
      menu: ['Espresso bazlı kahveler', 'V60 ve günlük filtre kahve'],
      sec: [
        [
          'San Sebastian Cheesecake',
          'Kahve eşliğinde taze servis edilen hafif tatlı alternatifi.',
          'Menu-TR & Maimahru değerlendirmelerinde övülen kahve eşlikçisi',
        ],
      ],
      seat: 'Aydınlık iç oturma alanı; tek başına çalışmaya veya sakin ikili sohbete uygun masalar.',
      crowd: 'Hafta içi öğleden sonraları sakin ve odaklı; çevre ofislerden düzenli gelen bir kitle var.',
      dis: 'Cadde tarafı zaman zaman trafik sesi alabiliyor ve yoğun saatlerde prizli masalar hızlı doluyor.',
      transit: 'M2 Şişhane Metro Meşrutiyet çıkışından yürüyerek iki dakika.',
      sources: [
        [
          'Menu-TR Kullanıcı Notları',
          'https://www.menu-tr.com/',
          'community',
          'Meşrutiyet Caddesi üzerinde barista özeni, flat white ve çalışma uygunluğu geri bildirimleri.',
        ],
        [
          'Google Haritalar Konum Kaydı',
          'https://maps.google.com/?cid=7690539899624332795',
          'maps',
          'Asmalı Mescit, Meşrutiyet Cd. No:111 doğrulanmış konum ve mekan kategorisi.',
        ],
        [
          'Restoranım Şehir Listesi',
          'https://www.restoranim.net/',
          'community',
          'Tek şubeli üçüncü dalga kahve dükkanı olarak Meşrutiyet hattındaki konumu doğrulandı.',
        ],
      ],
      pros: [
        'Tek şubeli, barista odaklı dengeli kahve kalitesi',
        'Şişhane metrosuna çok yakın pratik Pera buluşma noktası',
      ],
      cons: [
        'Sokak arası kadar sessiz değil; ana cadde geçişinde yer alıyor',
        'Akşamüstü tatlı çeşitliliği tükenebiliyor',
      ],
      unc: ['Hafta içi çalışma masalarında öğle sonrası doluluk artabiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-rhm-cafe',
      placeId: 'ChIJ9UGyOTu5yhQRO9SFIV_SYxY',
      cat: 'kahve',
      name: 'RHM Cafe',
      brand: 'rhm',
      area: 'İstiklal Cd., Asmalımescit',
      signals: [
        'Türkiye İş Bankası Resim Heykel Müzesi giriş katında kültür-sanat odaklı kafe',
        'İstiklal Caddesi kalabalığından izole, kitaplı ve sakin atmosfer',
        'Espresso bazlı kahveler, filtre demlemeler ve hafif sandviç eşlikçileri',
      ],
      desc: "İstiklal Caddesi üzerindeki Türkiye İş Bankası Resim Heykel Müzesi’nin giriş katında konumlanan RHM Cafe, caddenin gürültüsünden bir kapıyla ayrılan sakin bir kültür molası. Sergi öncesi ya da sonrası nitelikli espresso ve filtre kahve çeşitlerini müze kitaplığı atmosferinde sunuyor.",
      order: ['Filtre Kahve', 'Cortado'],
      menu: ['Espresso bazlı kahveler', 'Pesto soslu sandviç ve kruvasan'],
      sec: [
        [
          'Pesto Soslu Ciabatta',
          'Kahvenin yanında hafif tuzlu öğle atıştırmalığı arayanlar için.',
          'Arasatır & İş Sanat mekan tanıtımlarında öne çıkarılan seçenek',
        ],
      ],
      seat: 'Tarihi banka binasının yüksek tavanlı, aydınlık ve ferah giriş katı masaları.',
      crowd: 'Sergi ziyaretçileri ve sakin sohbet arayanlardan oluşan düşük desibelli bir kitle.',
      dis: 'Müze çalışma düzenine bağlı kapanış saatleri erken; giriş katı müze erişim akışından etkilenebiliyor.',
      transit: 'İstiklal Caddesi No:144 önünde; Odakule durağı ve Şişhane çıkışından kısa yürüyüş.',
      sources: [
        [
          'İş Sanat Kültür Portalı',
          'https://www.issanat.com.tr/',
          'operator',
          'Türkiye İş Bankası Resim Heykel Müzesi giriş katında konumlanan kafe bilgileri.',
        ],
        [
          'Arasatır Kültür Mekan Rehberi',
          'https://www.arasatir.com/',
          'editorial',
          'Müze binası içindeki sakin kitap-kafe atmosferi, kahve ve pesto ciabatta detayları.',
        ],
        [
          'Yandex Harita Yerel Kayıtları',
          'https://maps.google.com/?cid=1613364397554914363',
          'community',
          'İstiklal gürültüsünden kaçış sağlayan müze kahve molası geri bildirimleri.',
        ],
      ],
      pros: [
        'İstiklal üzerinde beklenmedik ölçüde sessiz ve mimari açıdan ferah ortam',
        'Kültür-sanat ziyaretiyle kolayca birleştirilebiliyor',
      ],
      cons: [
        'Gece geç saatlere kadar açık bir sokak kafesi değil',
        'Müze düzeni gereği yoğun sergi günlerinde giriş kontrolü yaşanabiliyor',
      ],
      unc: ['Müze içi kafe kullanımının bilet politikasıyla ilişkisi dönemlik sergilere göre güncellenebiliyor.'],
      verifiedAt: '2026-11-15',
    }),

    // =========================================================================
    // 4. DATE MEKANLARI (Mikla iconic: true ile tavan 5)
    // =========================================================================
    compactSeed({
      id: 'asmalimescit-mikla',
      placeId: 'ChIJReR3RuC5yhQR_t7o9KL5qYQ',
      cat: 'date',
      pinnedFirst: true,
      area: 'Meşrutiyet Cd., Pera',
      flags: { heritage: true, iconic: true },
      signals: [
        'Şef Mehmet Gürs’ün The Marmara Pera 18. katındaki Yeni Anadolu Mutfağı öncüsü',
        'Haliç’ten Tarihi Yarımada’ya 360 derece uzanan İstanbul akşam manzarası',
        'Günlük basılan mevsimsel 3 aşamalı seçmeli veya 7 aşamalı tadım menüsü',
      ],
      desc: 'The Marmara Pera’nın 18. katında Şef Mehmet Gürs öncülüğünde kurulan Mikla, Anadolu’nun yerel malzemelerini çağdaş tekniklerle işleyen Yeni Anadolu Mutfağı akımının sembolü. Tarihi Yarımada ve Haliç’e bakan panoramasıyla özel akşamlar için Pera’nın en güçlü buluşma noktalarından biri.',
      order: ['7 Aşamalı Tadım Menüsü', '3 Aşamalı Prix Fixe Menü'],
      menu: ['Günlük değişen Anadolu tadım menüleri', 'Yerli bağlardan şarap eşleşmesi'],
      sec: [
        [
          'Vejetaryen Tadım Menüsü',
          'Anadolu sebze ve tahıllarını merkezine alan ayrı çok aşamalı akşam seçkisi.',
          'miklarestaurant.com tadım menüsü opsiyonları',
        ],
        [
          'İmza Kokteyller',
          'Yemek öncesi veya sonrası teras barında yerel aromalarla hazırlanan kokteyller.',
          'The Marmara Pera Mikla bar sunumu',
        ],
      ],
      seat: 'Panoramik cam cepheli şık salon ve manzaralı teras bar masaları.',
      crowd: 'Özel akşam kutlamaları, yabancı konuklar ve sessiz fine-dining temposu.',
      dis: 'Üst segment fine-dining fiyat politikası, haftalar öncesinden rezervasyon şartı ve belirli giyim protokolü bazı misafirlere mesafeli gelebilir.',
      transit: 'M2 Şişhane Metro Meşrutiyet çıkışından Tepebaşı yönüne 3 dakikalık yürüyüş.',
      sources: [
        [
          'Mikla Resmi Sitesi',
          'http://www.miklarestaurant.com/',
          'operator',
          'The Marmara Pera 18. kat konumu, günlük basılan menü ve tadım kurgusu.',
        ],
        [
          'Oggusto Fine Dining Rehberi',
          'https://www.oggusto.com/',
          'editorial',
          'Yeni Anadolu Mutfağı vizyonu, yerel malzeme araştırmaları ve 360 derece manzara değerlendirmesi.',
        ],
        [
          'World’s 50 Best & Gastronomi Kayıtları',
          'https://www.theworlds50best.com/',
          'award',
          'Uluslararası gastronomi listelerinde İstanbul’un en köklü çağdaş restoranlarından biri olarak kaydı.',
        ],
      ],
      pros: [
        'Haliç ve Tarihi Yarımada’ya hakim ikonik 18. kat manzarası',
        'Mevsimlik yerel ürünlerle sürekli yenilenen şef mutfağı',
      ],
      cons: [
        'Bölgedeki en yüksek bütçe gerektiren restoranlardan biri',
        'Spontane masa bulmak çok zor; resmi akşam giyimi bekleniyor',
      ],
      unc: ['Tadım menüsü içeriği günlük tedarike göre aynı hafta içinde değişebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-yeni-lokanta',
      placeId: 'ChIJpfAaheC5yhQRWDl3LVDNp04',
      cat: 'date',
      area: 'Kumbaracı Ykş., Asmalımescit',
      signals: [
        'Şef Civan Er’in Kumbaracı Yokuşu’ndaki amiral gemisi çağdaş Anadolu mutfağı',
        'Kurutulmuş patlıcanlı yoğurtlu Antakya mantısı ve odun fırını tabakları',
        'Küçük üretici yerli şaraplar ve rakı/kumkuat dokunuşlu imza kokteyller',
      ],
      desc: 'Kumbaracı Yokuşu’nda Şef Civan Er’in imzasını taşıyan Yeni Lokanta, geleneksel Anadolu lezzetlerini çağdaş pişirme teknikleriyle yalın ama derinlikli tabaklara dönüştürüyor. Loş taş-ahşap salonu ve paylaşıma açık menüsüyle samimi ama özenli bir akşam yemeği deneyimi kuruyor.',
      order: ['Kurutulmuş Patlıcanlı Mantı', 'Odun Fırınında Kuzu'],
      menu: ['Modern Anadolu paylaşım tabakları', 'Çok aşamalı şef tadım menüsü'],
      sec: [
        [
          'Kadayıflı Muhallebi ve İsli Dondurma',
          'Fıstık ezmeli ve isli süt dondurmasıyla servis edilen imza tatlı.',
          'yenilokanta.com & gastronomi incelemelerinde öne çıkan tatlı',
        ],
        [
          'Kumkuatlı İmza Kokteyller',
          'Anadolu narenciyeleri ve rakı aromalarıyla dengelenen aperitif kokteyller.',
          'Yeni Lokanta bar seçkisi',
        ],
      ],
      seat: 'Tarihi binanın alt ve üst katlarında sıcak aydınlatmalı şık masalar.',
      crowd: 'Özenli ama kasıntı olmayan; yemek meraklısı çiftler ve küçük masalardan oluşan kitle.',
      dis: 'Beş kişi ve üzeri masalarda tadım menüsü zorunlu tutuluyor; dik Kumbaracı Yokuşu tırmanışı yorucu olabiliyor.',
      transit: 'İstiklal Caddesi Tünel – Galatasaray hattından Kumbaracı Yokuşu’na iniş.',
      sources: [
        [
          'Yeni Lokanta Resmi Sitesi',
          'http://www.yenilokanta.com/',
          'operator',
          'Kumbaracı Yokuşu No:66/B adresinde Şef Civan Er mutfağı, 7-9 aşamalı tadım ve à la carte kuralları.',
        ],
        [
          'Oggusto Şehir Rehberi',
          'https://www.oggusto.com/',
          'editorial',
          'Kurutulmuş patlıcanlı mantı, isli tereyağı ve odun fırını et yemekleriyle çağdaş Türk mutfağı övgüsü.',
        ],
        [
          'Harden’s & Cornucopia İncelemeleri',
          'https://www.cornucopia.net/',
          'editorial',
          'Anadolu malzemelerine dayalı rafine akşam kurgusu ve şarap eşleşmeleri.',
        ],
      ],
      pros: [
        'Ciddi mutfak kalitesini samimi meyhane-bistro sıcaklığıyla birleştiriyor',
        'Kurutulmuş patlıcanlı mantı gibi özgün imza tabaklar',
      ],
      cons: [
        'Dik Kumbaracı Yokuşu üzerinde bulunduğu için ulaşım yokuş gerektiriyor',
        'Kalabalık masalarda menü esnekliği azalıyor; erken rezervasyon şart',
      ],
      unc: ['Hafta sonları alt salon akustik olarak biraz yükseliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-aheste',
      placeId: 'ChIJy30zq-C5yhQRW0Dy1evbJNg',
      cat: 'date',
      area: 'Meşrutiyet Cd., Pera',
      signals: [
        'Meşrutiyet Caddesi’nde loş ve romantik atmosferli modern meze-tapas restoranı',
        'Türk, Osmanlı, İran, Ermeni ve Rum mutfak izlerini buluşturan paylaşımlı tabaklar',
        'Standart et-balık tadımının yanında zengin vejetaryen tadım menüsü',
      ],
      desc: 'İsmini “yavaş” kavramından alan Aheste, Meşrutiyet Caddesi’nde klasik meyhane kültürünü dingin ve loş ışıklı bir akşam yemeği deneyimine çeviriyor. Osmanlı’dan İran’a, Ermeni ve Rum mutfaklarından izler taşıyan modern mezeleri küçük paylaşım porsiyonlarıyla masaya geliyor.',
      order: ['Aheste Tadım Menüsü', 'Modern Meze Seçkisi'],
      menu: ['Yaratıcı soğuk ve sıcak mezeler', 'Standart ve vejetaryen tadım menüleri'],
      sec: [
        [
          'Vejetaryen Tadım Menüsü',
          'Sebze, baklagil ve baharat dengesine odaklanan kapsamlı etsiz akşam menüsü.',
          'ahesterestaurant.com tadım menüsü seçeneği',
        ],
      ],
      seat: 'Yumuşak ışıklı, taş dokulu ve ikili masaların öne çıktığı sakin iç salon.',
      crowd: 'Sohbet etmeye gelen çiftler ve sakin gastronomi akşamı arayan yerli-yabancı konuklar.',
      dis: 'Porsiyonlar paylaşım tapas mantığında olduğundan kalabalık iştahlı akşamlar için hesabın yükselmesi kolay.',
      transit: 'M2 Şişhane Metro Meşrutiyet çıkışından birkaç adım kuzeyde.',
      sources: [
        [
          'Aheste Resmi Sitesi',
          'http://www.ahesterestaurant.com/',
          'operator',
          'Meşrutiyet Cd. No:107/F konumu, standart ve vejetaryen tadım menüleri.',
        ],
        [
          'Oggusto Beyoğlu Mekanları',
          'https://www.oggusto.com/',
          'editorial',
          'Loş romantik atmosferi ve çok kültürlü modern meze seçkisiyle date akşamları için öne çıkarılıyor.',
        ],
        [
          'Mesprestiges Şehir Rehberi',
          'https://mesprestiges.com/',
          'editorial',
          'Meşrutiyet hattındaki modern meyhane ve yaratıcı paylaşım tabakları incelemesi.',
        ],
      ],
      pros: [
        'Pera’daki en romantik ve sohbete elverişli loş restoran ambiyanslarından biri',
        'Vejetaryen konuklar için özenle kurgulanmış ayrı tadım menüsü',
      ],
      cons: [
        'Tapas porsiyonları küçük olduğundan tek başına doyurucu değil, birden fazla tabak paylaşımı gerekiyor',
        'Fiyat seviyesi üst segmentte seyrediyor',
      ],
      unc: ['Cuma ve Cumartesi akşamları pencere kenarı masalar günler öncesinden doluyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-bag-pera',
      placeId: 'ChIJ-TuBWUC5yhQR5srbkHRzoqQ',
      cat: 'date',
      area: 'İstiklal Cd., Asmalımescit',
      signals: [
        'Tünel meydanı karşısında Anadolu’nun şarap bölgelerine göre ayrılmış geniş kav',
        'Amuse-bouche eşlikli cl seçenekli şarap tadım setleri (flight) ve kadeh servisi',
        'Kuzu ciğer tapas, keçi peynirli enginar ve deniz mahsullü linguini gibi sıcak eşlikçiler',
      ],
      desc: 'İstiklal Caddesi’nin Tünel ucunda konumlanan Bağ Pera, Ege’den Trakya’ya, Marmara’dan İç Anadolu’ya uzanan bölgesel yerli ve yabancı şarap seçkisiyle öne çıkıyor. Farklı miktarlarda kadeh veya tadım seti seçilebilmesi, peynir ve sıcak tapas eşleşmeleriyle zahmetsiz bir şarap akşamı kuruyor.',
      order: ['Anadolu Şarap Tadım Seti', 'Kuzu Ciğer Tapas'],
      menu: ['Bölgesel kadeh ve şişe şaraplar', 'Peynir-şarküteri ve sıcak tapas'],
      sec: [
        [
          'Keçi Peynirli Enginar',
          'Beyaz ve roze şarap eşleşmeleriyle uyumlu hafif ara sıcak.',
          'FineDineMenu & Müdavim Bağ Pera menü kayıtları',
        ],
        [
          'Deniz Mahsullü Linguini',
          'Şarabın yanına daha doyurucu ana yemek arayan masalar için.',
          'Bağ Pera mutfak menüsü',
        ],
      ],
      seat: 'Yüksek tavanlı şık şarap barı, kav rafları çevresinde rahat oturma ve ikili masalar.',
      crowd: 'İş çıkışı ve hafta sonu akşamlarında genç profesyoneller ile şarap meraklıları.',
      dis: 'Girişi İstiklal-Tünel kalabalığının hemen ucunda; arka sokağa göre hafta sonu giriş trafiği yoğun ve fiyatlar üst bantta.',
      transit: 'F2 Tünel İstasyonu karşısı; Şişhane Metro İstiklal çıkışına yürüme mesafesi.',
      sources: [
        [
          'Bağ Pera Resmi Sitesi',
          'https://bagpera.com/',
          'operator',
          'Bölgesel ayrılmış şarap kavı, tadım uçuşları ve tapas-mutfak eşlikçileri.',
        ],
        [
          'Oggusto İstanbul Şarap Barları',
          'https://www.oggusto.com/',
          'editorial',
          'Yeni nesil Anadolu şarap kültürü ve amuse-bouche eşlikli tadım kurgusu incelemesi.',
        ],
        [
          'Müdavim Şehir Rehberi',
          'https://mudavim.net/',
          'community',
          'Tünel girişindeki konum, cl bazlı kadeh/tadımlık seçenekleri ve sıcak yemek kalitesi.',
        ],
      ],
      pros: [
        'Farklı yerli üreticileri tadım setiyle tek akşamda kıyaslama imkanı',
        'Klasik peynir tabağının ötesine geçen güçlü sıcak tapas mutfağı',
      ],
      cons: [
        'İthal ve özel şişelerde hesap hızla yükseliyor',
        'Hafta sonu akşamlarında rezervasyon yapmadan köşe masa bulmak güç',
      ],
      unc: ['Tadım setlerinin sunum saatleri dönemsel olarak değişebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-comedus-wine-bar',
      placeId: 'ChIJ18pHVOC5yhQRw99OosNwA2E',
      cat: 'date',
      area: 'General Yazgan Sk., Asmalımescit',
      signals: [
        'General Yazgan Sokak’ta tarihi tuğla dokulu butik şarküteri ve doğal şarap barı',
        'Raflardan seçilen yerli-yabancı şişeler ve kişiye özel hazırlanan peynir-füme et tabakları',
        'Masaya başlangıç olarak gelen taze ekşi mayalı ekmek, zeytin ve zeytinyağı',
      ],
      desc: 'General Yazgan Sokak’ın köşesindeki tarihi tuğla yapıda yer alan Comedus Wine Bar, bir mahalle şarküterisi sıcaklığını zengin bir doğal ve butik şarap kavıyla birleştiriyor. Dolaptan seçilen yerli peynir ve füme etlerle kurulan sofralar, gösterişsiz ama yüksek keyifli bir buluşma sunuyor.',
      order: ['El Yapımı Peynir & Şarküteri Tabağı', 'Butik Doğal Şarap Seçkisi'],
      menu: ['Yerli ve doğal şarap kavı', 'Zanaat peynir ve füme et tabakları'],
      sec: [
        [
          'Ekşi Mayalı Ekmek & Zeytinyağı',
          'Şişe eşliğinde taze servis edilen sade başlangıç ikramı.',
          'Lokalist & Wanderlog ziyaretçi incelemeleri',
        ],
      ],
      seat: 'Tuğla duvarlı samimi iç bar ve General Yazgan Sokak’a bakan kaldırım masaları.',
      crowd: 'Mahalle müdavimleri, şarap meraklıları ve sohbet odaklı ikili-üçlü gruplar.',
      dis: 'Sıcak ana yemek menüsü yok; aç karnına tam akşam yemeğinden çok şarküteri-şarap buluşması için ideal ve fiyatlar yüksek.',
      transit: 'M2 Şişhane Metro Meşrutiyet çıkışından General Yazgan Sokak’a iki dakikalık yürüyüş.',
      sources: [
        [
          'Comedus Pera Resmi Hesabı',
          'https://instagram.com/comeduspera?igshid=19jo2i9ldq2js',
          'operator',
          'General Yazgan Sk. No:9 konumu, butik kav ve günlük şarküteri-peynir seçkisi.',
        ],
        [
          'Lokalist Şehir Seçkisi',
          'https://www.lokalist.com/',
          'editorial',
          'Pera’nın en samimi doğal şarap ve şarküteri barlarından biri olarak tarihi tuğla doku vurgusu.',
        ],
        [
          'Gloobles Pera Rehberi',
          'https://www.gloobles.com/',
          'editorial',
          'Raflardan şişe seçimi ve kişisel şarküteri eşleştirmesine dair editör notları.',
        ],
      ],
      pros: [
        'Tuğla doku ve sokak masalarıyla yapaylıktan uzak sıcak date ambiyansı',
        'Süpermarket dışı küçük üretici peynir ve şarap çeşitliliği',
      ],
      cons: [
        'Sıcak mutfak bulunmadığı için tam akşam yemeği beklentisini karşılamıyor',
        'Sokak ve iç mekan küçük; kalabalıkta masalar birbirine yakın',
      ],
      unc: ['Bazı nadir doğal şarap şişeleri hızla tükenebiliyor.'],
      verifiedAt: '2026-11-15',
    }),

    // =========================================================================
    // 5. KAHVALTI
    // =========================================================================
    compactSeed({
      id: 'asmalimescit-mornings-in-pera',
      placeId: 'ChIJ0aA-5me3yhQRTfbnpZPQKwc',
      cat: 'kahvalti',
      pinnedFirst: true,
      area: 'Kallavi Sk., Asmalımescit',
      signals: [
        'Kallavi Sokak’taki özgün ilk şubede şef dokunuşlu brunch ve artizan fırın ürünleri',
        'Ev yapımı brioche French toast çeşitleri, çılbır ve ekşi mayalı kahvaltı tabağı',
        'Avokado, füme somon, çikolatalı granola kasesi gibi hafif modern alternatifler',
      ],
      desc: 'Kallavi Sokak’ta kapılarını açan ilk Mornings In Pera lokasyonu, klasik serpme kahvaltı kalıbının dışına çıkarak şef odaklı modern brunch tabakları ve kendi fırınından çıkan hamur işleriyle ayrışıyor. Özellikle brioche French toast ve ekşi mayalı ekmek bazlı tabaklarıyla sabahları semtin en canlı buluşma noktalarından.',
      order: ['Brioche French Toast', 'Çılbır & Ekşi Mayalı Kahvaltı Tabağı'],
      menu: ['Şef brunch tabakları', 'Artizan fırın ve nitelikli kahve'],
      sec: [
        [
          'Çikolatalı Granola Kasesi',
          'Meyveli ve hafif başlangıç tercih edenler için soğuk kase alternatifi.',
          'GrabLocals & Vogue Türkiye içeriklerinde öne çıkarılan tabak',
        ],
        [
          'Hatay Zeytinli Kahvaltı Tabağı',
          'Çökelek, pesto, ev yapımı reçel ve tereyağıyla tuzlu klasik kahvaltı seçeneği.',
          'morningsinpera.com kahvaltı menüsü',
        ],
      ],
      seat: 'Tarihi sokak dokusuna bakan aydınlık iç mekan ve dışarıda dar sokak masaları.',
      crowd: 'Hafta sonu sabahları ve öğle brunch saatlerinde oldukça kalabalık ve genç.',
      dis: 'Hafta sonları kapıda bekleme sırası oluşabiliyor; tek başına kahvaltı fiyatları ortalama mahalle kahvaltısının üzerinde.',
      transit: 'İstiklal Caddesi Odakule – Galatasaray arasından Kallavi Sokak’a birkaç adım.',
      sources: [
        [
          'Mornings In Pera Resmi Sitesi',
          'https://www.morningsinpera.com/',
          'operator',
          'Kallavi Sokak No:4 özgün şube, brioche French toast ve kahvaltı tabağı menüleri.',
        ],
        [
          'Vogue Türkiye Brunch Seçkisi',
          'https://www.vogue.com.tr/',
          'editorial',
          'Kurucusu Ömer Atalay, mimari tasarım ve çılbır-granola odaklı modern brunch kurgusu.',
        ],
        [
          'Vegan İstanbul & GrabLocals İncelemeleri',
          'https://www.veganistanbul.com/',
          'community',
          'Tatlı patates tabağı ve gün boyu fırın-kahve sürekliliğine dair topluluk notları.',
        ],
      ],
      pros: [
        'Klasik serpme yerine özenli brioche, ekşi maya ve brunch reçeteleri',
        'Kallavi Sokak’taki özgün ilk nokta ve gün boyu süren fırın tazeliği',
      ],
      cons: [
        'Cumartesi-Pazar geç sabah saatlerinde masa bulmak beklemeye açık',
        'Sokak kenarındaki masalarda alan dar kalabiliyor',
      ],
      unc: ['Markanın sonradan açtığı Yeşilköy şubesi olsa da Kallavi orijinal amiral gemisidir.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-firinna',
      placeId: 'ChIJSx1KemC5yhQRgJMtRZKwiEM',
      cat: 'kahvalti',
      area: 'Kumbaracı Ykş., Pera',
      signals: [
        '150 yıllık tarihi taş binada Çakallı menemen, bazlama tost ve Türk kahvaltısı',
        'Kumbaracı Yokuşu üzerinde gün ışığı alan sıcak kafe-bruncherie atmosferi',
        'Gül goncası çay harmanı ve safranlı hibiscus limonata gibi özgün içecekler',
      ],
      desc: "Kumbaracı Yokuşu’nun alt kısmında 150 yıllık taş bir binada hizmet veren Fırınna, Pera yokuşuna yakışan sakin bir kahvaltı durağı. Çakallı menemen ve bazlama tosttan geleneksel Türk kahvaltı tabaklarına uzanan menüsünü özel harman çaylar ve taze kahvelerle tamamlıyor.",
      order: ['Çakallı Menemen', 'Geleneksel Bazlama Tost'],
      menu: ['Sıcak kahvaltı ve menemenler', 'Serpme kahvaltı ve bitki çayları'],
      sec: [
        [
          'Gül Goncası Karışım Çay',
          'Kahvaltı veya gün içi molaya eşlik eden aromatik özel harman.',
          'firinna.com içecek menüsü',
        ],
        [
          'Dondurmalı Sıcak Çikolatalı Kek',
          'Öğle sonrasında taş fırın veya kahve eşlikçisi olarak tercih edilen tatlı.',
          'Fırınna menü kayıtları',
        ],
      ],
      seat: 'Tarihi taş duvarlı sıcak iç salon; sakin bir sabah masası için elverişli.',
      crowd: 'İstiklal’in kalabalığından kaçan yerli ziyaretçiler ve Galata-Pera yürüyüşçüleri.',
      dis: 'Yokuş üzerinde olduğu için ulaşım tırmanış gerektiriyor; akşam servisinden çok gündüz kahvaltı-kafe kimliği baskın.',
      transit: 'M2 Şişhane Metro çıkışından Kumbaracı Yokuşu’na veya T2 nostaljik tramvaydan aşağı yürüyüş.',
      sources: [
        [
          'Fırınna Resmi Sitesi',
          'https://www.firinna.com/',
          'operator',
          '150 yıllık taş bina, Kumbaracı Yokuşu No:41/A konumu, Çakallı menemen ve bazlama tost menüsü.',
        ],
        [
          'Yandex Harita Yerel Kayıtları',
          'https://maps.google.com/?cid=4866333539646149504',
          'community',
          'Tarihi sokak dokusu, kahvaltı tazeliği ve samimi işletme geri bildirimleri.',
        ],
        [
          'Menu-TR Menü Rehberi',
          'https://www.menu-tr.com/',
          'community',
          'Kahvaltı çeşitleri, taş fırın ürünleri ve içecek seçenekleri doğrulandı.',
        ],
      ],
      pros: [
        'Tarihi taş bina içinde samimi ve telaşsız sabah atmosferi',
        'Çakallı menemen ve bazlama tost gibi sıcak mutfak çeşitliliği',
      ],
      cons: [
        'Kumbaracı Yokuşu eğimi sebebiyle bebek arabası veya yaşlı misafirler için erişim zorlayabilir',
        'Dış oturma alanı yokuş eğimi yüzünden sınırlı',
      ],
      unc: ['Taş fırın pizzaları da bulunduğundan öğle saatlerinde masa profili karma hale gelebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-nazende-coffee-and-food',
      placeId: 'ChIJd9NSvSa5yhQR2IEbQrdLxdY',
      cat: 'kahvalti',
      name: 'Nazende Coffee & Food',
      brand: 'nazende',
      area: 'Tepebaşı Cd., Pera',
      signals: [
        'Tepebaşı / Çatma Mescit sınırında gürültüden uzak sakin sabah kahvaltısı noktası',
        'Organik yumurtalı menemen, geleneksel kahvaltı tabakları ve taze demleme çay-kahveler',
        'Çalışma ve uzun kahvaltı sohbetine elverişli samimi mahalle düzeni',
      ],
      desc: 'Tepebaşı Caddesi’nin Çatma Mescit tarafında, kalabalık ana akstan birkaç dakikalık uzaklıkta yer alan Nazende Coffee & Food, doyurucu ve ev yapımı hissini koruyan geleneksel Türk kahvaltısıyla biliniyor. Gösterişli brunch kalabalığı yerine sakin ortamda menemen, börek-tost ve bitki çayı arayanların uğrak noktası.',
      order: ['Geleneksel Kahvaltı Tabağı', 'Organik Yumurtalı Menemen'],
      menu: ['Türk kahvaltısı ve sahanda yumurtalar', 'Türk kahvesi, bitki çayları ve ev yemekleri'],
      sec: [
        [
          'Yöresel Türk Kahvesi Çeşitleri',
          'Kahvaltı sonrasında farklı kavrum ve aromalarla sunulan kahve kapanışı.',
          'nazendekafe.com içecek seçkisi',
        ],
      ],
      seat: 'Rahat koltuk ve ahşap masalı, sessiz ve aydınlık iç salon.',
      crowd: 'Tepebaşı çevresi çalışanları, mahalle sakinleri ve sakin sabah arayan çiftler.',
      dis: 'Tarihi Pera manzarası veya süslü avlu atmosferi yerine sade bir mahalle kafe-lokantası ortamı sunuyor.',
      transit: 'M2 Şişhane Metro Çıkışı ve Tepebaşı Pera Müzesi aksından 4 dakikalık yürüyüş.',
      sources: [
        [
          'Nazende Kafe Resmi Sitesi',
          'https://www.nazendekafe.com/',
          'operator',
          'Tepebaşı / Çatma Mescit adresinde kahvaltı, bitki çayları ve kahve menüsü.',
        ],
        [
          'Yandex Harita Yerel Kayıtları',
          'https://maps.google.com/?cid=15475858944988774872',
          'community',
          'Doyurucu kahvaltı porsiyonları ve Tepebaşı’ndaki sakin ortamına dair kullanıcı geri bildirimleri.',
        ],
      ],
      pros: [
        'Turistik fiyat ve kalabalıktan uzak, samimi Tepebaşı kahvaltı durağı',
        'Zengin çay ve kahve seçkisiyle uzun kahvaltıya uygun rahat tempo',
      ],
      cons: [
        'Tepebaşı tarafında kaldığı için Asmalımescit’in canlı sokak estetiğinden daha sade',
        'Manzara veya geniş açık hava avlusu bulunmuyor',
      ],
      unc: ['Akşam saatlerinde meze ve ev yemeği servisine dönüşebildiği için sabah kimliği gündüz öne çıkar.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-kafe-ara',
      placeId: 'ChIJ-_ZZaWC3yhQRTOEY66a-toM',
      cat: 'kahvalti',
      area: 'Ara Güler Sk., Pera',
      flags: { heritage: true },
      signals: [
        'Usta fotoğrafçı Ara Güler tarafından 2001’de kurulan tarihi Pera kafe-bistrolarından',
        'Ara Güler’in siyah-beyaz İstanbul fotoğrafları arasında serpme ve tabak kahvaltı',
        'Kahvaltı sonrası ünü semti aşan Ara’nın Islak Keki ve taze kahve servisi',
      ],
      desc: "2001 yılında usta foto muhabiri Ara Güler tarafından kurulan Kafe Ara, adını verdiği sokakta eski İstanbul kareleri eşliğinde hizmet veren yaşayan bir Pera hafızası. Zengin kahvaltı tabakları ve omletleriyle sabahları sinema-edebiyat çevresini ağırlarken, kapanışta mutlaka anılan tatlısıyla da öne çıkıyor.",
      order: ['Ara Kahvaltı Tabağı', "Ara'nın Islak Keki"],
      menu: ['Kahvaltı ve yumurta çeşitleri', 'Ev yapımı tatlılar ve filtre-Türk kahvesi'],
      sec: [
        [
          'Beyaz Peynirli Omlet',
          'Serpme kahvaltı yerine sıcak ve hızlı bir sabah tabağı tercih edenler için.',
          'Kafe Ara menü kayıtları',
        ],
      ],
      seat: 'Ahşap masalı, duvarları siyah-beyaz İstanbul fotoğraflarıyla kaplı iç mekan ve sokak önü masalar.',
      crowd: 'Sabahları semt müdavimleri, sinemacılar ve Ara Güler mirasını görmeye gelen ziyaretçiler.',
      dis: 'Turistik ilgiden ötürü öğleye doğru sokak masaları hızla doluyor ve servis yoğunlukta ağırlaşabiliyor.',
      transit: 'İstiklal Caddesi Galatasaray Meydanı’ndan bir yan sokağa dönerek hemen ulaşılıyor.',
      sources: [
        [
          'Kafe Ara Resmi Hesabı',
          'https://arakafe.com.tr/',
          'operator',
          'Ara Güler Sokak konumu, kahvaltı tabakları ve Ara’nın Islak Keki imza tatlısı.',
        ],
        [
          'İstanbul Net & Kültür Rehberi',
          'https://www.istanbul.net.tr/',
          'editorial',
          'Ara Güler tarafından 2001’de kurulan tarihi kültür ve kahvaltı durağı tanıtımı.',
        ],
        [
          'Your Little Black Book Şehir Seçkisi',
          'https://www.yourlittleblackbook.me/',
          'editorial',
          'Galatasaray arkasındaki nostaljik kafe ambiyansı, kahve ve ıslak kek tavsiyesi.',
        ],
      ],
      pros: [
        'Ara Güler fotoğrafları arasında gerçek bir Pera kültürel hafıza mekanı',
        'Sabah kahvaltısından öğleden sonra tatlı-kahve molasına uzanan çok yönlü menü',
      ],
      cons: [
        'Tarihi ünü nedeniyle hafta sonları turist trafiği yoğunlaşabiliyor',
        'İçerideki ahşap masa araları dar',
      ],
      unc: ['Sabah erken saatler sakin bir masa için belirgin biçimde daha elverişli.'],
      verifiedAt: '2026-11-15',
    }),

    // =========================================================================
    // 6. DENEMELİSİN (En fazla 10 mekan)
    // =========================================================================
    compactSeed({
      id: 'asmalimescit-asmali-cavit',
      placeId: 'ChIJ7yKreY65yhQRzHPvzue7Na0',
      cat: 'denemelisin',
      pinnedFirst: true,
      area: 'Asmalımescit Cd., Asmalımescit',
      flags: { heritage: true },
      signals: [
        'Cavit Saatçi’nin kurduğu, Asmalımescit meyhane geleneğinin yaşayan temel taşlarından',
        'Dev tepsi dayatması olmadan garson eşliğinde seçilen özenli klasik soğuk mezeler',
        'Köz patlıcan, lakerda, topik, yaprak ciğer ve mevsiminde taze ızgara balık',
      ],
      desc: "Asmalımescit Caddesi’nin simgelerinden Asmalı Cavit, Cavit Saatçi’nin kurduğu eski usul İstanbul meyhanesi geleneğini ödün vermeden sürdürüyor. Büyük meze tepsileri yerine mutfağından günlük çıkan köz patlıcan, lakerda ve yaprak ciğer gibi özenli tabaklarla ağırlıyor.",
      order: ['Köz Patlıcan & Lakerda', 'Yaprak Ciğer'],
      menu: ['Günlük soğuk mezeler', 'Ara sıcaklar ve mevsim balıkları'],
      sec: [
        [
          'Mevsim Balığı & Kuzu Şiş',
          'Ana yemek aşamasında taze lüfer/palamut veya ocakbaşı tercih edenler için.',
          'OAD & Gault&Millau Türkiye değerlendirmeleri',
        ],
      ],
      seat: 'Duvarları eski İstanbul fotoğraflarıyla kaplı beyaz örtülü, klasik ve samimi salon.',
      crowd: 'Yerli meyhane müdavimleri, yazarlar ve akşam yemeğini ritüele çeviren masalar.',
      dis: 'Yüksek fiyat seviyesi ve haftalar öncesinden dolan rezervasyon defteri spontane gelişi imkansız kılıyor; masa araları sıkışık.',
      transit: 'M2 Şişhane Metro İstiklal çıkışından Asmalımescit Caddesi içine 4 dakikalık yürüyüş.',
      sources: [
        [
          'OAD Guides & Gastronomi Listesi',
          'https://www.oadguides.com/',
          'award',
          'Asmalı Cavit’in İstanbul’un önde gelen klasik meyhanesi olarak listelenmesi ve meze seçkisi.',
        ],
        [
          'Lezzet Rehberi & Mesprestiges',
          'https://www.lezzetrehberi.org/',
          'editorial',
          'Cavit Saatçi mirası, tepsisiz sipariş düzeni, köz patlıcan, topik ve yaprak ciğer incelemesi.',
        ],
      ],
      pros: [
        'Modern “yeni nesil” gürültüsü olmadan gerçek klasik meyhane mutfağı',
        'Köz patlıcan, lakerda ve ciğerde yüksek malzeme istikrarı',
      ],
      cons: [
        'Rezervasyonsuz masa bulmak çok güç',
        'Bütçe olarak sıradan bir sokak meyhanesinin oldukça üzerinde',
      ],
      unc: ['Mevsim balıkları günlük hal tedarikine göre değişiyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-ficcin',
      placeId: 'ChIJbyzm-1-3yhQREwcDH9vdbWY',
      cat: 'denemelisin',
      area: 'Kallavi Sk., Asmalımescit',
      flags: { heritage: true },
      signals: [
        '1996’da Leyla Kılıç tarafından Kallavi Sokak’ta kurulan Çerkes ve Anadolu mutfağı klasiği',
        'İsmini veren kıymalı Oset böreği Fıccın, peynirli Çerkes mantısı Haluj ve Velibah',
        'Aynı sokakta birbirine bakan birden fazla salonla gündüz ev yemeğinden akşam rakı masasına geçiş',
      ],
      desc: "1996’dan bu yana Kallavi Sokak’ın çehresini belirleyen Fıccın, Beyoğlu’nda Çerkes ve Anadolu ev mutfağını yaşatan en köklü durak. İsmini aldığı kıymalı Oset böreğinden peynirli mantı Haluj’a, ıspanaklı Velibah’tan günlük tencere yemeklerine uzanan mutfağı öğle saatlerinde esnaf lokantası, akşamları ise sohbet meyhanesi atmosferine bürünüyor.",
      order: ['Fıccın Böreği', 'Haluj (Peynirli Çerkes Mantısı)'],
      menu: ['Çerkes börek ve mantıları', 'Günlük zeytinyağlılar ve ev yemekleri'],
      sec: [
        [
          'Velibah & Çerkes Tavuğu',
          'Ispanaklı-patatesli Oset böreği ve cevizli soğuk başlangıç klasiği.',
          'ficcin.com menü arşivindeki imza Çerkes çeşitleri',
        ],
        [
          'Tulen Çorbası',
          'Geleneksel tavuklu Çerkes çorbası arayanlar için sıcak başlangıç.',
          'Fıccın günlük mutfak listesi',
        ],
      ],
      seat: 'Kallavi Sokak’ta yan yana birkaç dükkan cephesine yayılan ahşap salonlar ve sokak masaları.',
      crowd: 'Öğlen çevredeki çalışanlar ve öğrenciler; akşamları gruplar ve yerli müdavimler.',
      dis: 'Akşam saatlerinde Kallavi Sokak oldukça kalabalık ve gürültülü olabiliyor; sokak masalarında geçiş dar.',
      transit: 'İstiklal Caddesi Galatasaray – Odakule arasından Kallavi Sokak’a iniş.',
      sources: [
        [
          'Fıccın Resmi Sitesi',
          'https://www.ficcin.com/',
          'operator',
          'Kallavi Sokak No:13/1 ana mutfak, Fıccın, Haluj, Gabın, Velibah ve Tulen menüsü.',
        ],
        [
          'Jineps Gazetesi Kültür Haberi',
          'https://www.jinepsgazetesi.com/',
          'editorial',
          '1996’da Leyla Kılıç tarafından Kallavi’de kuruluş öyküsü ve Cihangir açılışı.',
        ],
        [
          'Müdavim & Ömer Faruk Ordulu Arşivi',
          'https://mudavim.net/',
          'community',
          'Kallavi Sokak’taki sokak masaları ve Çerkes mantısı-böreği beğenileri.',
        ],
      ],
      pros: [
        'İstanbul’da Çerkes hamur işlerini bu çeşitlilikte yaşatan nadir amiral gemisi',
        'Öğle ve akşam arasında erişilebilir fiyat-lezzet dengesi',
      ],
      cons: [
        'Akşam kalabalığında servis temposu düşebiliyor ve sokak sesi yükseliyor',
        'Kallavi Sokak’ta masalar birbirine oldukça yakın',
      ],
      unc: ['2026’da Cihangir’de ikinci bir şube açılmış olsa da 1996’daki asıl merkez Kallavi Sokak’tır.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-yakup-2',
      placeId: 'ChIJ6b-eX-C5yhQR5eQKzgxz0Zo',
      cat: 'denemelisin',
      name: 'Yakup 2',
      brand: 'yakup2',
      area: 'Asmalımescit Cd., Asmalımescit',
      flags: { heritage: true },
      signals: [
        '60 yılı aşan geçmişiyle yazarlar, ressamlar ve gazetecilerin efsanevi Asmalımescit meyhanesi',
        'Sabah halden seçilen günlük taze balıklar, yaprak ciğer tava, fava ve köpoğlu',
        'Duvarları portre ve anılarla dolu tarihi Asmalımescit Caddesi salonu',
      ],
      desc: "Altmış yılı aşan tarihiyle Asmalımescit’in yaşayan edebiyat ve sanat hafızası olan Yakup 2, şehrin dönüşümüne rağmen klasik meyhane kimliğini koruyan nadir kurumlardan biri. Yaprak ciğer tavası, fava, köpoğlu ve sabah halden seçilip getirilen taze balıklarıyla nostaljik bir akşam sofrası kuruyor.",
      order: ['Yaprak Ciğer Tava', 'Fava & Köpoğlu'],
      menu: ['Klasik meyhane mezeleri', 'Ara sıcaklar ve günlük taze balık'],
      sec: [
        [
          'Paçanga & Izgara Börek',
          'Meze faslından sonra sofraya eşlik eden çıtır ara sıcak klasikleri.',
          'Yakup 2 menü kayıtları',
        ],
      ],
      seat: 'Tarihi hatıralarla kaplı yoğun, sıkışık beyaz örtülü salon ve sokak önü masalar.',
      crowd: 'Eski müdavimler, sanat çevresi ve kalabalık dost masaları.',
      dis: 'Masalar çok dip dibe ve mekan akşam saatlerinde son derece gürültülü; hafta sonu rezervasyonsuz yer bulmak imkansıza yakın ve fiyatlar yüksek.',
      transit: 'M2 Şişhane Metro İstiklal çıkışından Asmalımescit Caddesi No:21/B’ye 4 dakikalık yürüyüş.',
      sources: [
        [
          'Yakup 2 Resmi Sitesi',
          'http://www.yakup2.com.tr/',
          'operator',
          'Asmalımescit Caddesi No:21/B adresi ve 60 yılı aşan meyhane tarihi.',
        ],
        [
          'Culinary Backstreets & Basın Arşivi',
          'https://culinarybackstreets.com/',
          'editorial',
          'Entelektüel müdavim geleneği, yaprak ciğer, sabah halinden taze balık ve yoğun meyhane akustiği.',
        ],
        [
          'T24 Kültür-Sanat Yazıları',
          'https://t24.com.tr/',
          'editorial',
          'Adına şiirler yazılan Yakup 2’nin Asmalımescit kültüründeki yeri ve kalabalık akşam atmosferi.',
        ],
      ],
      pros: [
        'Yarım asrı geçen kesintisiz tarihi doku ve yaşayan kültür mirası',
        'Klasik meze reçeteleri ve sabah seçilen taze balık sürekliliği',
      ],
      cons: [
        'Akşamları oldukça gürültülü ve masalar çok sıkışık',
        'Hizmet hızı yoğun gecelerde aksayabiliyor; rezervasyon şart',
      ],
      unc: ['Yüksek tarihi sembol değeri ve meyhane ritüeliyle 4.4 puan altı koruma kapsamında tutulmuştur.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-1924-istanbul',
      placeId: 'ChIJb6aACWC3yhQRLj1oIdmI2HQ',
      cat: 'denemelisin',
      area: 'Olivya Geçidi, Pera',
      flags: { heritage: true },
      signals: [
        'Tarihi Rejans geleneğini sürdüren 1924 köklü Rus ve Doğu Avrupa mutfağı',
        'Dana ve Tvorog peynirli piroşki, Beef Stroganoff ve elmalı klasik Rus salatası',
        'Masa başında servis edilen limonlu ve vişne-tarçın-safran infüze votka arabası',
      ],
      desc: "Olivya Geçidi’nde köklü Rejans mirasını devralarak yaşatan 1924 İstanbul, Beyoğlu’nun yüzyıllık Rus ve Doğu Avrupa gastronomi geleneğini bugüne taşıyor. Tvorog peynirli piroşkiden kibrit patatesli Beef Stroganoff’a uzanan menüsü, meşhur aromalı votka arabasıyla tamamlanıyor.",
      order: ['Beef Stroganoff', 'Dana & Peynirli Piroşki'],
      menu: ['Zakuski ve Rus mutfağı klasikleri', 'İnfüze votka arabası servisi'],
      sec: [
        [
          '1924 Portakallı Ördek',
          'Ana yemeklerde tarihi reçeteyi denemek isteyenler için öne çıkan tabak.',
          '1924istanbul.com ana yemek menüsü',
        ],
        [
          'Tavuk Supreme Kievsky',
          'Tereyağlı dolgusuyla klasik Doğu Avrupa mutfağı alternatifi.',
          '1924 İstanbul zakuski & ana yemek listesi',
        ],
      ],
      seat: 'Tarihi ahşap lambri, kristal avizeler ve korunmuş tarihi masa köşesiyle nostaljik salon.',
      crowd: 'Tarihi Pera deneyimi arayan çiftler, özel akşam kutlamaları ve yabancı konuklar.',
      dis: 'Çok yüksek fiyat seviyesi, tadım menüsü odaklı kurgu ve erken rezervasyon gerekliliği gündelik bir akşam için ağır kaçabilir.',
      transit: 'İstiklal Caddesi Galatasaray – Odakule arasından Olivya Geçidi’ne giriş.',
      sources: [
        [
          '1924 İstanbul Resmi Sitesi',
          'http://www.1924istanbul.com/',
          'operator',
          'Olivya Geçidi No:7-A konumu, tarihi Rejans geçmişi, Stroganoff, Piroşki ve votka arabası.',
        ],
        [
          'Oggusto Tarihi Restoranlar Seçkisi',
          'https://www.oggusto.com/',
          'editorial',
          '1924’ten günümüze Doğu Avrupa mutfağı ve infüze votka ritüeli incelemesi.',
        ],
        [
          'TheFork Misafir Değerlendirmeleri',
          'https://www.thefork.com/',
          'community',
          'Zakuski başlangıçlar, tarihi salon dokusu ve servis deneyimi notları.',
        ],
      ],
      pros: [
        'İstanbul’da tarihi Rejans/Rus mutfağını yerinde yaşatan tek sembol adres',
        'Masa başı infüze votka servisi ve korunmuş nostaljik iç mimari',
      ],
      cons: [
        'Fiyat bandı oldukça yüksek; tadım odaklı maliyet çıkarabiliyor',
        'Hafif ve hızlı bir akşam yemeğinden ziyade ağır klasik reçeteler baskın',
      ],
      unc: ['Rezervasyon saatleri ve akşam fiks menü şartları özel günlerde değişebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-pera-antakya',
      placeId: 'ChIJj834uIS5yhQRnElLODAASPA',
      cat: 'denemelisin',
      area: 'Balyoz Sk., Asmalımescit',
      signals: [
        'Balyoz Sokak’ta aile çiftliği tedarikli Antakya yöresel mezeleri ve kuzu kebapları',
        'Taze açılan lavaşta kebap dürümler, humus, babagannuş ve muhammara',
        'Akşamüstü ve gece yarısına uzanan enerjik Asmalımescit sokak sofraları',
      ],
      desc: "Balyoz Sokak’ta yer alan Pera Antakya, Antakya’daki aile çiftliğinden gelen peynir, zeytin ve baharatları İstanbul’un kalbine taşıyor. Doyurucu kuzu kebapları, taze açılan lavaşa sarılan dürümleri ve yöresel mezeleriyle hem kalabalık sofralar hem de hızlı kebap-meze akşamları için güçlü bir durak.",
      order: ['Antakya Humus & Babagannuş', 'Özel Kuzu Kebap Dürüm'],
      menu: ['Yöresel Antakya mezeleri', 'Mangal kebaplar ve tepsi çeşitleri'],
      sec: [
        [
          'Muhammara & Zahter Salatası',
          'Cevizli biber salçası ve dağ kekiğiyle sofrayı açan yöresel meze ikilisi.',
          'peraantakya.com meze menüsü',
        ],
      ],
      seat: 'Sıcak aydınlatmalı çok katlı iç salon ve Balyoz Sokak boyunca dizili dış masalar.',
      crowd: 'Yerli müdavimler, arkadaş grupları ve kalabalık akşam yemekleri.',
      dis: 'Sokak atmosferi hafta sonları çok gürültülü ve kalabalık olabiliyor; rezervasyonsuz sıra beklenebiliyor.',
      transit: 'M2 Şişhane Metro İstiklal çıkışından Balyoz Sokak’a 3 dakikalık yürüyüş.',
      sources: [
        [
          'Pera Antakya Resmi Sitesi',
          'http://www.peraantakya.com/',
          'operator',
          'Balyoz Sk. No:14 adresi, aile çiftliğinden Antakya ürün tedariki ve kebap-meze seçkisi.',
        ],
        [
          'Yemek.com & Restoranım Seçkileri',
          'https://yemek.com/',
          'editorial',
          'Balyoz Sokak’taki Antakya lezzetleri, kuzu kebapları ve humus övgüleri.',
        ],
        [
          'Restaurant Guru Ziyaretçi Puanları',
          'https://restaurantguru.com/',
          'community',
          'Yüksek memnuniyet oranı, sıcak lavaş sunumu ve canlı sokak servisi notları.',
        ],
      ],
      pros: [
        'Baharat, nar ekşisi ve peynirlerde gerçek Antakya tedarik kalitesi',
        'Hem tam meze-kebap masası hem pratik dürüm düzenine uygun esneklik',
      ],
      cons: [
        'Balyoz Sokak’ta masalar dar ve akşam sesi yüksek',
        'Popüler saatlerde rezervasyon öneriliyor',
      ],
      unc: ['Google Places fiyat seviyesi belirtilmemiş olup meze-kebap ağırlıklı orta-üst bantta seyreder.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-antiochia',
      placeId: 'ChIJl4bZ3OC5yhQRKUrB6vT-Fck',
      cat: 'denemelisin',
      flags: { heritage: true },
      area: 'General Yazgan Sk., Asmalımescit',
      signals: [
        'Kurucu Süleyman Gülüm yönetiminde tek şubeyle açık köklü Antakya Concept mutfağı',
        'Özel marine edilmiş etli Antiochia Dürüm, kağıt kebabı ve zahterli zeytin',
        'Sahlepli dondurma eşlikli ceviz-patlıcan tatlısı ve Antakya künefesi',
      ],
      desc: "General Yazgan Sokak’ta kurucusu Süleyman Gülüm’ün liderliğinde yıllardır tek şubeyle çalışan Antiochia, Antakya sokak kültürünü rafine bir şarap-rakı sofrasına dönüştürüyor. Özenle marine edilmiş etlerle hazırlanan Antiochia Dürüm ve kağıt kebabının yanında, ceviz ve patlıcan tatlısı gibi yerel klasikleri yaşatıyor.",
      order: ['Antiochia Dürüm', 'Kağıt Kebabı'],
      menu: ['Antakya meze ve kebapları', 'Yöresel tatlılar ve uyumlu şarap seçkisi'],
      sec: [
        [
          'Ceviz & Patlıcan Tatlısı',
          'Özel yapım sahlepli dondurmayla servis edilen otantik Antakya finali.',
          'antiochiaconcept.com tatlı menüsü',
        ],
        [
          'Abagannuş & Cevizli Roka',
          'Dürüm ve kebap öncesi masayı dengeli açan yöresel başlangıçlar.',
          'Antiochia başlangıç menüsü',
        ],
      ],
      seat: 'Minimal, loş ışıklı şık iç salon ve sokağa taşan birkaç masa.',
      crowd: 'Gastronomi odaklı çiftler, müdavimler ve şarap eşleşmeli yöresel yemek arayanlar.',
      dis: 'Geleneksel kebapçı porsiyonlarına kıyasla tabaklar daha küçük ve fiyat seviyesi yüksek.',
      transit: 'M2 Şişhane Metro Meşrutiyet çıkışından General Yazgan Sokak No:3’e yürüyerek iki dakika.',
      sources: [
        [
          'Antiochia Resmi Sitesi',
          'http://www.antiochiaconcept.com/',
          'operator',
          'General Yazgan Sk. No:3 tek şube adresi, Antiochia Dürüm, kağıt kebabı ve sahlepli tatlılar.',
        ],
        [
          'Gastronomi Rehberleri İncelemesi',
          'https://gastronomiturkey.com/',
          'editorial',
          'Süleyman Gülüm yönetimindeki tek şube istikrarı ve Antakya mutfağının modern sunumu.',
        ],
        [
          'Yandex Harita Yerel Kayıtları',
          'https://maps.google.com/?cid=14489767703998450217',
          'community',
          'Dürüm marinasyonu, humus ve küçük şık ortamına dair uzun soluklu kullanıcı geri bildirimleri.',
        ],
      ],
      pros: [
        'Tek şube disipliniyle Antakya reçetelerini şık sunumla koruyor',
        'Kebapla birlikte iyi seçilmiş şarap eşleşmesi sunabilmesi',
      ],
      cons: [
        'Fiyat-porsiyon oranı mahalle kebapçılarından daha yüksek',
        'İç mekan kapasitesi küçük olduğu için yer ayırmak gerekiyor',
      ],
      unc: ['Hafta sonları aynı sokaktaki diğer bar ve restoranlarla birlikte çevre sesi artabiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-beyoglu-esnaf-lokantasi',
      placeId: 'ChIJ148pOoS5yhQRvPBjYquATjE',
      cat: 'denemelisin',
      area: 'Orhan Adlı Apaydın Sk., Asmalımescit',
      signals: [
        'Orhan Adlı Apaydın Sokak’ta odun ateşinde kuzinede pişen geleneksel tencere yemekleri',
        'Porsiyon ve pilav üstü odun ateşi yaprak döner, kuzu incik ve güveçte kuru fasulye',
        'Turistik Asmalımescit hattında gerçek günlük ev yemeği ve sulu yemek çeşitliliği',
      ],
      desc: 'Asmalımescit’in meyhane ve barları arasında saklanan Beyoğlu Esnaf Lokantası, odun ateşinde kuzinede ağır ağır pişen ev yemekleri ve yaprak dönerle öğle-akşam arası gerçek Türk mutfağı arayanlar için güvenli liman. Güveçte kuru fasulyeden kuzu inciğe, zeytinyağlılardan çorbalara günlük tezgah tazeliğini koruyor.',
      order: ['Odun Ateşinde Yaprak Döner', 'Kuzinede Kuzu İncik'],
      menu: ['Odun ateşinde kuzine yemekleri', 'Günlük zeytinyağlı ve sulu ev yemekleri'],
      sec: [
        [
          'Güveçte Kuru Fasulye & Pilav',
          'Öğle servisinde en çok tercih edilen klasik esnaf ikilisi.',
          'beyogluesnaflokantasi.com günlük tencere menüsü',
        ],
        [
          'İslim Köfte & Ankara Tava',
          'Günlük çıkan fırın ve et yemeklerinden alternatifler.',
          'Menu-TR günlük lokanta çeşitleri',
        ],
      ],
      seat: 'Temiz, düzenli ve yüksek sirkülasyonlu klasik esnaf lokantası masaları.',
      crowd: 'Öğlen çevredeki ofis çalışanları ve esnaf; gün boyu ev yemeği özleyen semt ziyaretçileri.',
      dis: 'Günün popüler döner ve kuzine çeşitleri öğleden sonra erken saatlerde tükenebiliyor; atmosfer sade ve hızlı.',
      transit: 'M2 Şişhane Metro İstiklal çıkışından Orhan Adlı Apaydın Sokak’a yürüyerek üç dakika.',
      sources: [
        [
          'Beyoğlu Esnaf Lokantası Resmi Sitesi',
          'https://www.beyogluesnaflokantasi.com/',
          'operator',
          'Orhan Adlı Apaydın Sk. No:11/A konumu, odun ateşinde döner ve kuzine yemekleri.',
        ],
        [
          'Menu-TR & Yemeksepeti Kayıtları',
          'https://www.menu-tr.com/',
          'community',
          'Günlük değişen çorbalar, zeytinyağlılar, islim köfte ve taze döner değerlendirmeleri.',
        ],
      ],
      pros: [
        'Bölgedeki turistik fiyatların dışında dürüst, ulaşılabilir esnaf mutfağı',
        'Odun ateşi kuzinede pişen gerçek tencere yemekleri ve yaprak döner',
      ],
      cons: [
        'Öğle yoğunluğunda bazı signature yemekler erken bitebiliyor',
        'Uzun akşam eğlencesi yerine temiz ve pratik yemek durağı',
      ],
      unc: ['Hafta sonları öğle saatleri arasında servis hızı ve çeşit yoğunluğu daha yüksek.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-kuffette-pera',
      placeId: 'ChIJbVUy3OC5yhQRpJ2ngJaicZg',
      cat: 'denemelisin',
      name: 'Kuffette Pera',
      brand: 'kuffette',
      area: 'General Yazgan Sk., Asmalımescit',
      signals: [
        'General Yazgan Sokak’ta zeytinyağlı ev yemekleri ve anne usulü tencere mutfağı',
        'Sosyete mantısı, günlük mercimek çorbası ve zengin vejetaryen-vegan tabak seçenekleri',
        'Gösterişsiz, samimi ve ev yapımı sıcaklığı sunan öğle-akşamüstü noktası',
      ],
      desc: "General Yazgan Sokak’ta yer alan Kuffette Pera, Beyoğlu’nda ağır kebap veya bar atıştırmalığı yerine hafif ev yemeği ve zeytinyağlı arayanlar için sıcacık bir mahalle mutfağı. Her gün taze pişen zeytinyağlı tencere yemekleri, mercimek çorbası ve çıtır sosyete mantısıyla ev sofrası dengesi yakalıyor.",
      order: ['Sosyete Mantısı', 'Zeytinyağlı Ev Yemekleri Tabağı'],
      menu: ['Günlük zeytinyağlı ve vegan tabaklar', 'Ev yapımı çorba ve mantılar'],
      sec: [
        [
          'Ev Yapımı Mercimek Çorbası',
          'Hızlı öğle molasında en çok övülen sıcak başlangıç.',
          'Menu-TR ve Restaurant Guru kullanıcı notları',
        ],
      ],
      seat: 'Küçük, sade ve samimi birkaç masalı iç mekan.',
      crowd: 'Tünel-Şişhane çevresi çalışanları, öğrenciler ve hafif-vejetaryen öğün arayanlar.',
      dis: 'İçeride masa sayısı çok az; akşam geç saatte açık bir restoran değil, daha çok gündüz ve erken akşam mutfağı.',
      transit: 'M2 Şişhane Metro Meşrutiyet çıkışından General Yazgan Sokak No:5/A’ya yürüyerek iki dakika.',
      sources: [
        [
          'Menu-TR Mekan Kaydı',
          'https://www.menu-tr.com/',
          'community',
          'General Yazgan Sk. No:5/A konumu, sosyete mantısı, mercimek çorbası ve ev yemeği övgüleri.',
        ],
        [
          'Restaurant Guru Topluluk Özeti',
          'https://restaurantguru.com/',
          'community',
          'Zeytinyağlı tencere yemekleri, vejetaryen seçenekler ve samimi hizmet geri bildirimleri.',
        ],
      ],
      pros: [
        'Pera merkezinde vejetaryen ve vegan dostu hafif zeytinyağlı seçenekler',
        'Ev yapımı tazelikte sade ve uygun fiyatlı günlük tabaklar',
      ],
      cons: [
        'Çok sınırlı oturma kapasitesi nedeniyle kalabalık gruplara uygun değil',
        'Menü tezgahındaki günlük tencere yemeklerine bağlı olarak değişiyor',
      ],
      unc: ['Yoğun öğle arasında zeytinyağlı çeşitlerinin bir kısmı hızla tükenebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-galaktion',
      placeId: 'ChIJIzMqZee5yhQRB1BdLYSTtuw',
      cat: 'denemelisin',
      name: 'Galaktion',
      brand: 'galaktion',
      area: 'Şehbender Sk., Asmalımescit',
      signals: [
        'Şehbender Sokak’ta otantik Gürcü mutfağını yaşatan tek şubeli köklü restoran',
        'Kayık formunda peynirli ve yumurtalı Açaruli Khachapuri ile el açması Khinkali',
        'Ceviz içli patlıcan, Phali meze tabağı ve baharatlı Supkharço çorbası',
      ],
      desc: "Şehbender Sokak’taki köklü adresiyle Galaktion, İstanbul’un kalbinde gerçek Gürcü mutfağına adanmış en bilinen noktalardan biri. Fırından sıcak çıkan tereyağlı yumurtalı Açaruli Khachapuri, sulu içi korunan el yapımı Khinkali mantısı ve ceviz soslu mezeleriyle özgün bir Kafkas sofrası kuruyor.",
      order: ['Açaruli Khachapuri', 'Khinkali (Gürcü Mantısı)'],
      menu: ['Gürcü hamur işleri ve pideler', 'Ceviz soslu mezeler ve Gürcü güveçleri'],
      sec: [
        [
          'Ceviz İçli Patlıcan & Phali',
          'Kafkas mutfağının ceviz ve nar ekşili karakteristik soğuk meze başlangıcı.',
          'cafegalaktion.com menü seçkisi',
        ],
        [
          'Supkharço Çorbası',
          'Baharatlı dana etli geleneksel Gürcü çorbası.',
          'Galaktion yemek menüsü',
        ],
      ],
      seat: 'Ahşap masalı, sıcak aydınlatmalı iç salon ve Şehbender Sokak önündeki dış oturma alanı.',
      crowd: 'Farklı ülke mutfağı arayan yerli gruplar, turistler ve kalabalık paylaşım sofraları.',
      dis: 'Akşam saatlerinde yoğunluktan ötürü hamur işleri siparişinde bekleme süresi uzayabiliyor ve sokak gürültülü.',
      transit: 'M2 Şişhane Metro İstiklal veya Meşrutiyet çıkışından Şehbender Sokak’a 3 dakikalık yürüyüş.',
      sources: [
        [
          'Galaktion Resmi Sitesi',
          'https://www.cafegalaktion.com/',
          'operator',
          'Şehbender Sk. konumu, Açaruli/İmeruli Khachapuri, Khinkali, Phali ve Supkharço menüsü.',
        ],
        [
          'Oggusto Dünya Mutfakları Seçkisi',
          'https://www.oggusto.com/',
          'editorial',
          'İstanbul’daki otantik Gürcü mutfağı adresleri arasında hamur işleri ve meze önerisi.',
        ],
        [
          'Yandex Harita Yerel Kayıtları',
          'https://maps.google.com/?cid=17056982834618388487',
          'community',
          'Khinkali ve Khachapuri porsiyonları, tazelik ve servis temposu hakkında topluluk notları.',
        ],
      ],
      pros: [
        'Bölgede kolay bulunmayan otantik Kafkas ve Gürcü reçetelerinde tutarlı uzmanlık',
        'Paylaşıma çok uygun hamur işi ve ceviz bazlı soğuk mezeler',
      ],
      cons: [
        'Taze açılan Khachapuri ve Khinkali yoğun saatlerde gecikebiliyor',
        'Sokak akşamları hareketli ve yüksek sesli',
      ],
      unc: ['Hafta sonu akşamları için önceden masa ayırtmak gerekiyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'asmalimescit-galata-saraphanesi',
      placeId: 'ChIJc7xNlrG5yhQRE-XikQNZIeo',
      cat: 'denemelisin',
      area: 'Jurnal Sk., Asmalımescit',
      signals: [
        'Jurnal Sokak’ta büyük zincirlerde bulunmayan küçük Anadolu şarap üreticileri seçkisi',
        'Toprak küpte yıllandırılan geleneksel Gürcü Qvevri şarapları ve butik şişeler',
        'Ana cadde karmaşasından sıyrılan işletmecili, sakin ara sokak şarap evi',
      ],
      desc: "Jurnal Sokak No:7’de ana caddelerin gürültüsünden uzak konumlanan Galata Şaraphanesi, büyük markalar yerine küçük ölçekli Anadolu üreticilerinin nadir şişelerine ve toprak küpte fermente edilen Gürcü Qvevri şaraplarına odaklanıyor. İşletmecisinin birebir eşlik ettiği tadım sohbetleriyle sakin, keşif odaklı bir şarap durağı.",
      order: ['Butik Anadolu Şarap Seçkisi', 'Gürcü Qvevri Amfora Şarabı'],
      menu: ['Nadir Anadolu ve Qvevri şarapları', 'Peynir ve hafif şarap eşlikçileri'],
      sec: [
        [
          'Şarap Eşlikçisi Peynir Tabağı',
          'Seçilen şişeye göre önerilen sade yerel peynir eşleştirmesi.',
          'Mesprestiges & Burayagidelim şarap evi notları',
        ],
      ],
      seat: 'Taş-ahşap dokulu samimi iç şarap odası ve Jurnal Sokak’ta sakin birkaç masa.',
      crowd: 'Gürültülü barlar yerine sohbet ve şarap keşfi arayan küçük masalar.',
      dis: 'Mutfak yalnızca hafif şarap eşlikçilerine dayalı; doyurucu akşam yemeği arayanlar için yetersiz ve alan küçük.',
      transit: 'M2 Şişhane Metro çıkışından Jurnal Sokak’a yürüyerek iki dakika.',
      sources: [
        [
          'Galata Şaraphanesi Resmi Sitesi',
          'http://galatasaraphanesi.com/',
          'operator',
          'Asmalı Mescit Jurnal Sk. No:7 adresi, küçük Anadolu üreticileri ve Gürcü qvevri şarapları.',
        ],
        [
          'Mesprestiges Beyoğlu Seçkisi',
          'https://mesprestiges.com/',
          'editorial',
          'Ana cadde karmaşasından uzak, işletmecili sakin şarap evi atmosferi vurgusu.',
        ],
        [
          'Clubinistanbul & Burayagidelim Rehberleri',
          'https://www.burayagidelim.com/',
          'community',
          'Şişhane yakını ara sokak konumu ve nadir şişe koleksiyonu değerlendirmeleri.',
        ],
      ],
      pros: [
        'Zincir barlarda olmayan küçük Anadolu ve Qvevri üretici çeşitliliği',
        'Jurnal Sokak’ta gürültüsüz, gerçek şarap odası sakinliği',
      ],
      cons: [
        'Sıcak mutfak seçeneği yok; yemek sonrası veya hafif atıştırmalıkla uygun',
        'İçerideki masa sayısı kısıtlı',
      ],
      unc: ['Google Places fiyat seviyesi belirtilmemiş olsa da nadir şişelerde bütçe esnekliği gerekir.'],
      verifiedAt: '2026-11-15',
    }),
    // =========================================================================
    // NEGATİF KONTROLLER (Politika Kapıları Test Havuzu — Reddedilmesi Zorunlu)
    // =========================================================================
    // Kapı 1: Operasyonel olmayan (CLOSED_PERMANENTLY)
    negControl(
      'ctrl-asm-lebon-closed',
      'ChIJUb7xkeC5yhQRiHbq9Nu5LH8',
      'kahvalti',
      'Kapı 1 kontrolü: Lebon Pastanesi kalıcı olarak kapalı (CLOSED_PERMANENTLY); tarihi isme rağmen asla listeye alınamaz.'
    ),
    // Kapı 2: CHAIN_BLOCKLIST zincir & franchise şubeleri
    negControl(
      'ctrl-asm-espressolab-chain',
      'ChIJHYpVPUG5yhQRrfPZWRTedV8',
      'kahve',
      'Kapı 2 kontrolü: Espressolab Taksim Tünel yaygın zincir kahve şubesi (CHAIN_BLOCKLIST).'
    ),
    negControl(
      'ctrl-asm-viyana-chain',
      'ChIJg5Nw3lO5yhQRjQR-UFkpQtg',
      'kahve',
      'Kapı 2 kontrolü: Viyana Kahvesi Narmanlı Han çok şubeli turistik zincir (CHAIN_BLOCKLIST) + 5611 review.'
    ),
    negControl(
      'ctrl-asm-betro-chain',
      'ChIJA74SMjm5yhQRQfysfSaT4Gs',
      'hamburger',
      'Kapı 2 kontrolü: Betro Burger Taksim çok şubeli burger zinciri (CHAIN_BLOCKLIST).'
    ),
    negControl(
      'ctrl-asm-burgeryiyelim-chain',
      'ChIJR0a-zQa5yhQRaNaajFTB2mQ',
      'hamburger',
      'Kapı 2 kontrolü: Burger Yiyelim ülke geneli fast-food burger zinciri (CHAIN_BLOCKLIST + ★4.1).'
    ),
    negControl(
      'ctrl-asm-midpoint-chain',
      'ChIJT0EAxeC5yhQRWv3eejlMxWY',
      'date',
      'Kapı 2 kontrolü: Midpoint Tünel yaygın AVM/cadde brasserie zinciri (CHAIN_BLOCKLIST + ★4.0).'
    ),
    negControl(
      'ctrl-asm-thehunger-chain',
      'ChIJK4spI-C5yhQRv6Kt0139kRI',
      'date',
      'Kapı 2 kontrolü: The Hunger Narmanlı Han çok şubeli brasserie zinciri (CHAIN_BLOCKLIST).'
    ),
    negControl(
      'ctrl-asm-mado-chain',
      'ChIJTeQViOC5yhQRv0EhP-AwuH4',
      'kahvalti',
      'Kapı 2 kontrolü: MADO TÜNEL çok şubeli tatlı/kahve zinciri (CHAIN_BLOCKLIST).'
    ),
    negControl(
      'ctrl-asm-eleos-chain',
      'ChIJAYCdleC5yhQRrIxN74goNPA',
      'date',
      'Kapı 2 kontrolü: Eleos Restoran (Yeşilköy & Beyoğlu şubeli zincir listesinde: CHAIN_BLOCKLIST).'
    ),
    // Kapı 3B: Saf Kahveci kuralı (kahve kategorisine pastane / çikolatacı sızması engeli)
    negControl(
      'ctrl-asm-patisserie-pera-purity',
      'ChIJ7f-DueG5yhQR5i3kwKmk2xU',
      'kahve',
      'Kapı 3B kontrolü: Patisserie De Pera primaryType pastry_shop (ayrıca Pera Palace + Kanyon 2 şube ve ★4.2).'
    ),
    negControl(
      'ctrl-asm-jadore-purity',
      'ChIJAwBwlGa3yhQRX45LReXEz5g',
      'kahve',
      'Kapı 3B kontrolü: Jadore Chocolatier primaryType chocolate_shop (ayrıca ★4.2 < 4.4).'
    ),
    // Kapı 6: < 4.4 korumasız eleme (+ önerilen yeni zincir adayları)
    negControl(
      'ctrl-asm-misspizza-below44',
      'ChIJm2SQKeG5yhQR846pdfAvs48',
      'pizza',
      'Kapı 6 kontrolü: Miss Pizza Şişhane korumasız ★4.2 < 4.4 (ayrıca Cihangir/Şişhane/Etiler 3 şubeli zincir).'
    ),
    negControl(
      'ctrl-asm-yesenburger-below44',
      'ChIJt2mgUkO5yhQR5Tvz0bcmUhM',
      'hamburger',
      'Kapı 6 kontrolü: Yesen Burger Beyoğlu ★3.6 < 4.4 ve çok şubeli zincir.'
    ),
    negControl(
      'ctrl-asm-perabakery-below44',
      'ChIJ5VWv6im5yhQRd8qsSnE3mus',
      'kahvalti',
      'Kapı 6 kontrolü: Pera Bakery ★3.9 < 4.4 (ayrıca primaryType pastry_shop).'
    ),
    negControl(
      'ctrl-asm-cecconis-below44',
      'ChIJDdgQ_uC5yhQRUrOhObYMyc0',
      'date',
      "Kapı 6 kontrolü: Cecconi's Restaurant (Soho House küresel zinciri) ★4.1 < 4.4 korumasız."
    ),
    // Kapı 8 / Önerilen yeni zincirler: çoklu bağımsız kanıt eksikliği + önerilen CHAIN_BLOCKLIST eklentisi
    negControl(
      'ctrl-asm-mocpera-newchain',
      'ChIJL99k8QS5yhQRQzGPfLKu7Mw',
      'kahve',
      'Kapı 2 (önerilen: moc pera / ministry of coffee, 13+ İstanbul şubesi) & Kapı 8 (<150 yorumda ★4.8 bağımsız kanıt eksik).'
    ),
    negControl(
      'ctrl-asm-noirpit-newchain',
      'ChIJdS0MJ-G5yhQRyp7I7Jlp9LI',
      'kahve',
      'Kapı 2 (önerilen: noir pit, 5 İstanbul şubesi) & Kapı 8 (bağımsız kanıt yetersizliği).'
    ),
    // Kapı 4: Sınır dışı (Galata güney & Taksim/Kalyoncu Kulluğu kuzey taşma kontrolü)
    negControl(
      'ctrl-asm-outside-galata-frida',
      'ChIJuSqiaoe5yhQRHJUMfhFlLN8',
      'kahvalti',
      'Kapı 4 kontrolü: Galata Frida House (41.02726, İlk Belediye Cd.) Asmalımescit & Pera güney sınırı (41.02812) dışında kalır.'
    ),
    negControl(
      'ctrl-asm-outside-taksim-sini',
      'ChIJ0caFvwK3yhQRQ8lK10NlVp8',
      'date',
      'Kapı 4 kontrolü: Sini Ethnic Omakase (41.03627, Kalyoncu Kulluğu) hem kuzey sınırı (41.03315) hem izinli mahalle listesi dışındadır.'
    ),
  ],
};
