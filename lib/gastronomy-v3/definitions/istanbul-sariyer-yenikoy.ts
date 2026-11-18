import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ISTANBUL_SARIYER_YENIKOY_DEF: V3RegionDefinition = {
  id: 'yenikoy-sariyer',
  slug: 'yenikoy',
  city: 'İstanbul',
  district: 'Sarıyer',
  allowedDistricts: ['Sarıyer'],
  neighborhood: 'Yeniköy',
  officialQuarter: 'Yeniköy',
  displayName: 'Yeniköy, Sarıyer, İstanbul',
  locative: "Yeniköy'de",
  path: ['istanbul', 'sariyer', 'yenikoy'],
  aliases: [
    'Yeniköy',
    'Yenikoy',
    'Köybaşı',
    'Koybasi',
    'Köybaşı Caddesi',
    'Kalender',
    'Sarıyer',
  ],
  scopeNote:
    'İstanbul · Sarıyer · Yeniköy (Köybaşı Cd., Daire, Kapalı Bakkal ve Vapur İskelesi sokakları, Kalender ve Bağlar mevkii doğrulanan yerel seçki; Tarabya, İstinye ve Emirgan adresleri dışarıda tutulur)',
  characterSubtitle:
    'Boğaz kıyısının yarım asrı aşan meyhane ve menemen ritüellerinden arka sokaklardaki bahçeli şef lokantalarına, Cami Pasajı kahve kavurucularından iki asırlık taş fırın börekçisine uzanan Yeniköy seçkisi.',
  center: { lat: 41.1205, lng: 29.0675 },
  bbox: { minLat: 41.1155, maxLat: 41.1295, minLng: 29.0525, maxLng: 29.0730 },
  allowedNeighborhoodTokens: ['Yeniköy', 'Köybaşı', 'Kalender'],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // --- NİTELİKLİ KAHVE (4) ---
    compactSeed({
      id: 'yen-grea-coffee',
      placeId: 'ChIJlR5ekATLyhQRN28im3kr3ZY',
      cat: 'kahve',
      pinnedFirst: true,
      name: 'Grea Coffee Nations',
      brand: 'grea',
      area: 'Dirhem Sk. · Cami Pasajı, Yeniköy',
      signals: ['yerinde-kavurma', 'cami-pasaji-bahcesi', 'single-origin'],
      desc:
        'Yeniköy Merkez Cami Pasajı içindeki saklı avluda Kolombiya, Etiyopya ve Guatemala çekirdeklerini kendi bünyesinde kavurarak servis eden tek şubeli kavurma atölyesi ve kafe.',
      order: [
        'Pour Over / V60 Single Origin',
        'Cortado',
        'Purple Churchill (Blue Butterfly Çayı)',
      ],
      menu: [
        'Iced Flat White & Espresso Serisi',
        'Rosy Pop & Aurora Citrus Soğuk İçecekler',
        'Iced Matcha Latte',
      ],
      sec: [
        [
          'Badem ve Antep Fıstık Unlu Pasta & Glutensiz Cookie',
          'Rafine şekersiz karabuğdaylı ve tahinli-ballı kurabiyelerle filtre kahve yanına günlük hazırlanan tatlılar.',
          'greacoffee.com menüsü ve HangiMekan',
        ],
      ],
      seat: 'Cami Pasajı içindeki taş zeminli iç atölye ve ağaçlı arka bahçe masaları; al-götür seçeneği de bulunur',
      crowd: 'Köybaşı kalabalığından pasaj içine çekilen nitelikli kahve müdavimleri ve bisikletçiler',
      dis: 'Pasaj içinde yer aldığı için ilk kez gelenler tabelayı kaçırabiliyor; bahçe masaları güneşli günlerde erken doluyor.',
      transit: 'Köybaşı Caddesi Yeniköy Merkez Camii yanındaki Dirhem Sokak pasaj girişinden birkaç adımda.',
      sources: [
        [
          'Google Maps — Grea Coffee Nations',
          'https://maps.google.com/?cid=10870892876836007735',
          'maps',
          'Dirhem Sk. Cami Pasajı No:2 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Grea Coffee Nations Resmi Sitesi',
          'http://www.greacoffee.com/',
          'operator',
          'Tekil Yeniköy kavurma atölyesi, single-origin çekirdek seçkisi, Purple Churchill ve unlu mamul menüsü doğrulandı.',
        ],
        [
          'Hoodtip — Grea Coffee Nations',
          'https://hoodtip.com',
          'editorial',
          'Cami Pasajı arkasındaki saklı avlu ve yerinde kavurma profili doğrulandı.',
        ],
        [
          'HangiMekan — Grea Coffee Nations',
          'https://www.hangimekan.com.tr',
          'community',
          'Terrazzo zeminli avlu atmosferi ve soğuk demleme seçenekleri doğrulandı.',
        ],
      ],
      pros: [
        'Kendi çekirdeklerini yerinde kavuran gerçek coffee_roastery kimliği',
        'Pasaj arkasında ana cadde gürültüsünden yalıtılmış avlu ve gluten hassasiyeti dostu eşlikçiler',
      ],
      cons: ['Ana cadde cephesi olmadığı için ilk ziyarette giriş pasajı gözden kaçabiliyor'],
      unc: ['Mevsimsel çekirdek stokları haftalık kavurma programına göre değişebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-yeni-bikoy',
      placeId: 'ChIJZ1pK0TjLyhQRRRdY2jXQ3k4',
      cat: 'kahve',
      name: "yeni bi'köy",
      brand: "yeni bi'köy",
      area: 'Yasemen Sk., Yeniköy',
      signals: ['arka-bahce-sakinligi', 'laptopsuz-ortam', 'ev-yapimi-tatli'],
      desc:
        'Köybaşı Caddesi’nin yukarısındaki Yasemen Sokak’ta uzaktan çalışma ve çevrim içi toplantılara izin vermeyen, sakin bahçesiyle kahve ve ev yapımı tatlı odaklı mahalle kafesi.',
      order: [
        'Filtre Kahve & Cortado',
        'Türk Kahvesi',
        'Limonlu Cheesecake',
      ],
      menu: [
        "Marshmallow'lu Sıcak Çikolata",
        'San Sebastian Cheesecake',
        'Kruvasan Sandviç Çeşitleri',
      ],
      sec: [
        [
          'Limonlu Cheesecake & Hindi Fümeli Kruvasan',
          'Kahve eşliğinde taze dilim cheesecake veya hafif öğle atıştırmalığı olarak kruvasan sandviç öne çıkıyor.',
          'Gurme Rehber ve Yemeksepeti menüsü',
        ],
      ],
      seat: 'Ev sıcaklığında iç salon ve yokuş üstünde kısmi Boğaz havası alan sakin arka bahçe',
      crowd: 'Bilgisayar ekranı olmadan sohbet etmek ve kitap okumak isteyen semt sakinleri',
      dis: 'Pazartesi günleri kapalı; menü politikası gereği dizüstü bilgisayarla uzun çalışma veya online toplantıya uygun değil.',
      transit: 'Köybaşı Caddesi’nden Yasemen Sokak yokuşuna kısa yürüyüşle ulaşılır.',
      sources: [
        [
          'Google Maps — yeni bi’köy',
          'https://maps.google.com/?cid=5683208709503194949',
          'maps',
          'Yasemen Sk. No:8 Yeniköy konumu ve operational durumu doğrulandı.',
        ],
        [
          'Gurme Rehber — Yeni Bi’Köy',
          'https://gurmerehber.com',
          'editorial',
          'Home-office yasağı, sakin bahçe düzeni, Pazartesi kapalı günü ve Türk kahvesi/cheesecake seçkisi doğrulandı.',
        ],
        [
          'The Magger — Yeni Bi’Köy',
          'https://www.themagger.com',
          'editorial',
          'Semtin arka sokaklarında Ege kasabası atmosferi sunan kahve durağı olarak doğrulandı.',
        ],
        [
          'Yemeksepeti — yeni bi’köy Menü',
          'https://www.yemeksepeti.com',
          'community',
          'Kruvasan sandviçler, kahve çeşitleri ve sıcak çikolata menüsü doğrulandı.',
        ],
      ],
      pros: [
        'Zincirleşmeden sakinliğini korumak için çalışma/toplantı sınırı koyan özgün mahalle kafesi',
        'Bahçe oturumu ve günlük taze tatlı uyumu',
      ],
      cons: ['Yokuş üzerinde yer alması ve Pazartesi kapalı olması planlama gerektiriyor'],
      unc: ['Tatlı çeşitliliği gün sonuna doğru tükenebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-wolk-coffee',
      placeId: 'ChIJURuu9mrLyhQRdPAuYnNQOL0',
      cat: 'kahve',
      name: 'Wolk Coffee',
      brand: 'wolk',
      area: 'Köybaşı Cd., Yeniköy',
      signals: ['ucuncu-nesil-espresso', 'tuzlu-karamel-tart', 'koybasi-vitrin'],
      desc:
        'Yeniköy’deki tek şubesiyle Köybaşı Caddesi üzerinde üçüncü nesil espresso bazlı kahvelerini yer fıstıklı tuzlu karamel tart ve sandviçlerle buluşturan butik kahve dükkanı.',
      order: [
        'Flat White & Cortado',
        'Tuzlu Karamelli Yer Fıstıklı Tart',
        'Gelibolu Sandviç',
      ],
      menu: [
        'Filtre Kahve & Cold Brew',
        'Bask Cheesecake & Mississippi Pie',
        'Wolk Club Sandviç',
      ],
      sec: [
        [
          'Tuzlu Karamelli Yer Fıstıklı Tart & Bask Cheesecake',
          'Sütlü kahvelerin yanında yoğun dokulu el yapımı tart ve cheesecake dilimleri öne çıkıyor.',
          'wolkcoffee.com ve ziyaretçi değerlendirmeleri',
        ],
      ],
      seat: 'Köybaşı Caddesi üzerinde kompakt iç oturma düzeni, kaldırım kenarı birkaç masa ve al-götür tezgahı',
      crowd: 'Sabah sahil yürüyüşçüleri ve kahve-tatlı molası veren genç müdavimler',
      dis: 'İç mekan oturma kapasitesi sınırlı ve tatlı-kahve fiyat bandı ortalama mahalle kafelerinin üzerinde seyrediyor.',
      transit: 'Köybaşı Caddesi No:164 üzerinde İETT Köybaşı durağına yürüme mesafesinde.',
      sources: [
        [
          'Google Maps — Wolk Coffee',
          'https://maps.google.com/?cid=13634736328362881140',
          'maps',
          'Köybaşı Cd. No:164 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Wolk Coffee Resmi Sitesi',
          'http://www.wolkcoffee.com/',
          'operator',
          'Türkiye’deki tekil Yeniköy şubesi, kahve barı ve imza tart/sandviç menüsü doğrulandı.',
        ],
        [
          'Restaurant Guru — Wolk Coffee',
          'https://restaurantguru.com',
          'community',
          'Kahve kalitesi ve el yapımı tatlı eşleşmesi puanlaması doğrulandı.',
        ],
        [
          'Migros Yemek — Wolk Coffee',
          'https://www.migros.com.tr',
          'community',
          'Aktif espresso, filtre kahve ve tatlı ürün kataloğu doğrulandı.',
        ],
      ],
      pros: [
        'İstanbul’da yalnızca Yeniköy’de tek şube olarak hizmet veren istikrarlı specialty kahve barı',
        'Sadece kahve değil güçlü tart ve doyurucu sandviç desteği',
      ],
      cons: ['Küçük oturma alanı yoğun saatlerde yalnız al-götür seçeneğini bırakabiliyor'],
      unc: ['Günlük sandviç ve pasta çeşitleri öğleden sonra erken bitebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-sedona-concept',
      placeId: 'ChIJSxLt02HKyhQRIDfIgAav67c',
      cat: 'kahve',
      name: 'Sedona Concept Bisiklet Cafe',
      brand: 'sedona',
      area: 'Köybaşı Cd., Yeniköy',
      signals: ['bisiklet-kafe', 'eksimaya-sandvic', 'grea-kavrumu'],
      desc:
        'Kardeş kavurucusu Grea Coffee çekirdeklerini Boğaz bisiklet rotası üzerindeki atölye ve mağaza konseptiyle birleştiren, ekşi mayalı sandviçler sunan bisiklet kafe.',
      order: [
        'Pour Over & Double Espresso',
        'Dana Kaburga & Cheddar Ekşi Maya Sandviç',
        'Karabuğday & Siyez Tuzlu Atıştırmalıklar',
      ],
      menu: [
        'Cortado & Iced Americano',
        'Avokadolu & Hindi Fümeli Ekşi Maya Sandviç',
        'Sağlıklı Smoothie & Soğuk Demleme',
      ],
      sec: [
        [
          'Dana Kaburgalı Ekşi Maya Sandviç & Siyez Tuzlular',
          'Sabah Boğaz sürüşü sonrası kahveyle eşleşen doyurucu sıcak ve soğuk sandviçler.',
          'sedonaconcept.com ve TheMagger seçkisi',
        ],
      ],
      seat: 'Yüksek tavanlı endüstriyel mağaza-kafe içi, bisiklet park alanı ve cadde önü oturum',
      crowd: 'Sabah erken saatlerde İstanbul Boğaz hattında pedallayan sporcular ve aktif mahalle sakinleri',
      dis: 'Hafta sonu sabahları bisiklet gruplarının aynı anda duraklamasıyla kısa süreli yoğunluk ve gürültü oluşuyor.',
      transit: 'Köybaşı Caddesi No:136 üzerinde sahil bisiklet yolunun hemen karşısında.',
      sources: [
        [
          'Google Maps — Sedona Concept Bisiklet Cafe',
          'https://maps.google.com/?cid=13252878770933085984',
          'maps',
          'Köybaşı Cd. No:136 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Sedona Concept Resmi Sitesi',
          'http://sedonaconcept.com/',
          'operator',
          'Aslı Bisiklet bünyesindeki tekil konsept kafe, Grea kavrumu ve sağlıklı sandviç menüsü doğrulandı.',
        ],
        [
          'The Magger — Sedona Concept',
          'https://www.themagger.com',
          'editorial',
          'İstanbul’daki bisiklet-kafe kültürünün Yeniköy temsilcisi olarak doğrulandı.',
        ],
        [
          'HangiMekan — Sedona Concept',
          'https://www.hangimekan.com.tr',
          'community',
          'Nitelikli kahve ve ekşi mayalı sandviç seçenekleri doğrulandı.',
        ],
      ],
      pros: [
        'Bisiklet park ve bakım altyapısını nitelikli kahve barıyla bütünleştiren benzersiz konsept',
        'Kendi grubuna ait taze Grea kavrumu çekirdek tedariki',
      ],
      cons: ['Hafta sonu sabah sürüş saatlerinde tezgah önü hızla kalabalıklaşabiliyor'],
      unc: ['Etkinlik ve grup buluşması günlerinde oturma düzeni kısmen mağaza etkinliğine ayrılabiliyor.'],
      verifiedAt: '2026-11-15',
    }),

    // --- DATE MEKANLARI (3) ---
    compactSeed({
      id: 'yen-araka',
      placeId: 'ChIJ8yRKQxPLyhQRQx-2zdPdWa0',
      cat: 'date',
      pinnedFirst: true,
      name: 'Araka',
      brand: 'araka',
      area: 'Kapalı Bakkal Sk., Yeniköy',
      signals: ['sef-mutfagi', 'bitki-bahcesi', 'mevsimsel-tadım'],
      flags: { heritage: true },
      desc:
        'Şef Zeynep Pınar Taşdemir’in gürgen ve ıhlamur ağaçlarıyla çevrili teraslı köy evinde mevsimlik otlar, yerel üretici sebzeleri ve asidik dokunuşlar üzerine kurduğu bağımsız şef lokantası.',
      order: [
        'Ayvalı Kereviz Carpaccio',
        'Salatalıklı Çipura Ceviche',
        'Siyah Sarımsaklı Dana Kaburga',
      ],
      menu: [
        'Mevsimlik Yabani Ot & Deniz Ürünü Tabakları',
        'Yerli Butik Üretici Doğal Şarap Eşleşmeleri',
        'Bademli İncir Tatlısı',
      ],
      sec: [
        [
          'Bademli İncir Tatlısı & Yerli Doğal Şarap Seçkisi',
          'Ot ve asidite odaklı tabakları dengeleyen mevsim meyveli kapanış ve küçük üretici şişeleri.',
          'araka.com.tr ve OGGUSTO incelemesi',
        ],
      ],
      seat: 'Kapalı Bakkal Sokak’ta iki katlı ahşap köy evi salonu ve ağaçlar altındaki samimi arka teras',
      crowd: 'Özel akşam kutlaması yapan çiftler ve gastronomi meraklısı küçük masalar',
      dis: 'Porsiyonlar paylaşım boyutunda küçüktür, şarap dahil toplam hesap yüksek bandadır ve ağır et/klasik kebap arayanlara asidik bitki profili uymayabilir.',
      transit: 'Köybaşı Caddesi’nden Kapalı Bakkal Sokak No:8’e yürüyerek ulaşılır; önceden rezervasyon gerekir.',
      sources: [
        [
          'Google Maps — Araka',
          'https://maps.google.com/?cid=12491258943247884099',
          'maps',
          'Kapalı Bakkal Sk. No:8 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Araka Resmi Sitesi',
          'https://araka.com.tr/',
          'operator',
          'Şef Zeynep Pınar Taşdemir liderliğindeki tekil şef restoranı ve mevsimsel ot/sebze felsefesi doğrulandı.',
        ],
        [
          'Michelin Guide — Araka',
          'https://guide.michelin.com',
          'award',
          '1 Michelin Yıldızı tescili ile uluslararası gastronomi otoritesi doğrulandı.',
        ],
        [
          'Gault & Millau Türkiye — Araka',
          'https://gault-millau.com.tr',
          'award',
          'Yüksek şef mutfağı derecelendirmesi ve yerel üretici odağı doğrulandı.',
        ],
        [
          'OGGUSTO — Araka Yeniköy',
          'https://www.oggusto.com',
          'editorial',
          'Ayvalı kereviz carpaccio, siyah sarımsaklı kaburga ve bademli incir tatlısı doğrulandı.',
        ],
      ],
      pros: [
        'Michelin 1 Yıldız ve Gault & Millau dereceli, tamamen kendine has mevsimsel ot/sebze kimliği',
        'Ana cadde gürültüsünden kopuk, ağaçlı teras atmosferi',
      ],
      cons: [
        'Paylaşımlı küçük tabaklara kıyasla yüksek fiyat algısı ve sınırlı şarap listesi',
        'Ekşi/asidik ve otsu tat profili geleneksel damak tadına uzak kalabiliyor',
      ],
      unc: ['Menü hasada göre sık değiştiği için imza tabakların varlığı mevsime bağlıdır.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-lokanta-limu',
      placeId: 'ChIJK3ahJj3LyhQRS7tqPMkVGdo',
      cat: 'date',
      name: 'Lokanta Limu',
      brand: 'limu',
      area: 'Köybaşı Cd., Yeniköy',
      signals: ['modern-meyhane', 'bes-dakikalik-ciger', 'sevtap-sara'],
      desc:
        'Adını Farsça misket limonundan alan, Şef Sara Tabrizi’nin mezeleri Acem ve Anadolu mutfağıyla buluşturduğu sıcak, çağdaş Yeniköy meyhanesi.',
      order: [
        'Beş Dakikalık Kum Saati Yaprak Ciğer',
        'Ekşi Maya Köpoğlu & Kargı Tulumlu Domates Salatası',
        'Acem Kebabı / Acem Pilavı',
      ],
      menu: [
        'Çakır Lakerda & Limon Kremalı Izgara Karides',
        'Çilingir Sofrası Tadım Seçkisi',
        'Yoğurt Dondurmalı Çıtır Kabak',
      ],
      sec: [
        [
          'Yoğurt Dondurmalı Çıtır Kabak & Acem Pilavı',
          'Mezeler sonrası ana yemek ve tatlı kapanışında klasik meyhane çizgisinin dışına çıkan imzalar.',
          'lokantalimu.com ve OGGUSTO',
        ],
      ],
      seat: 'Köybaşı Caddesi üzerinde özenli loş aydınlatmalı küçük lokanta salonu ve kapı önü masaları',
      crowd: 'Uzun sohbetli akşam yemeği arayan çiftler ve rafine meze-rakı eşleşmesi seven gruplar',
      dis: 'Mekan hacmi kompakt olduğu için erken akşam saatlerinde rezervasyonsuz yer bulmak güç; yemek hızı kalabalık akşamlarda yavaşlayabiliyor.',
      transit: 'Köybaşı Caddesi No:158/B adresinde Yeniköy merkez otobüs duraklarına birkaç adım mesafede.',
      sources: [
        [
          'Google Maps — Lokanta Limu',
          'https://maps.google.com/?cid=15715616328732293963',
          'maps',
          'Köybaşı Cd. No:158/B konumu ve operational durumu doğrulandı.',
        ],
        [
          'Lokanta Limu Resmi Sitesi',
          'https://www.lokantalimu.com/',
          'operator',
          'Kurucu ortaklar ve çağdaş meyhane menü yapısı doğrulandı.',
        ],
        [
          'Michelin Guide — Lokanta Limu',
          'https://guide.michelin.com',
          'award',
          'İstanbul rehber seçkisi ve rafine meyhane mutfağı tescili doğrulandı.',
        ],
        [
          'Time Out İstanbul & OGGUSTO',
          'https://www.oggusto.com',
          'editorial',
          'Kum saatli yaprak ciğer, ekşi maya köpoğlu, çakır lakerda ve Acem pilavı doğrulandı.',
        ],
      ],
      pros: [
        'Fars ve Anadolu mutfağını klasik meyhane formatında ince işçilikle buluşturan özgün reçeteler',
        'Hem yüksek puanlı hem de Michelin rehber seçkisinde yer alan güçlü yemek tutarlılığı',
      ],
      cons: ['Küçük salon nedeniyle akşam masaları sıkışık hissedilebiliyor ve rezervasyon şart'],
      unc: ['Bazı özel mezeler günlük mutfak hazırlığına göre tükenebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-apartiman',
      placeId: 'ChIJB8yBhGHKyhQRIEJP93-z-Ks',
      cat: 'date',
      secondaryCategoryIds: ['kahvalti'],
      name: 'Apartıman Yeniköy',
      brand: 'apartıman',
      area: 'Köybaşı Cd., Yeniköy',
      signals: ['bahceli-bistro', 'alakart-kahvalti', 'somine-sicakligi', 'kokorec-arpa-sehriye'],
      desc:
        'Bir aile apartmanının giriş katı ve yeşil arka bahçesinden dönüştürülen; gündüzleri alakart kahvaltı tabaklarıyla, akşamları ise mevsimsel Anadolu bistro mutfağıyla öne çıkan semt adresi.',
      order: [
        'Kokoreç Suyunda Pişen Kuzu Etli Arpa Şehriye',
        'Pekmezli Patlıcan',
        'Ahududu ile Kürlenmiş Somon Gravlax',
      ],
      menu: [
        'Saray Yumurtası & Alakart Kahvaltı Tabakları',
        'Butik Şarap & İmza Kokteyl Seçkisi',
        'Odun Ateşinde Mevsim Sebzeleri',
        'Apartıman Tatlısı',
      ],
      sec: [
        [
          'Saray Yumurtası, Cunda Loru & Pişi',
          'Serpme kalıbına girmeden tek tek seçilen sabah-öğle kahvaltı tabakları ve günlük ev yapımı ekmekler.',
          'Yemek.com ve Gurme Rehber',
        ],
        [
          'Apartıman Tatlısı & İmza Kokteyller',
          'Şömineli iç salon veya yemyeşil bahçede akşam yemeğini tamamlayan tatlı ve bar eşleşmeleri.',
          'TheMagger ve Gurme Rehber',
        ],
      ],
      seat: 'Şömineli sıcak apartman salonu ve ağaçlar içindeki arka bahçe terası',
      crowd: 'İlk buluşma veya özel kutlama için şık ama kasıntısız bistro arayan çiftler',
      dis: 'Bahçe masaları yoğun sezon akşamlarında günler öncesinden doluyor; fiyat seviyesi lüks bistro skalasında.',
      transit: 'Köybaşı Caddesi No:153 üzerinde sahile paralel ana aks üzerinde konumlanır.',
      sources: [
        [
          'Google Maps — Apartıman Yeniköy',
          'https://maps.google.com/?cid=12391851736901304864',
          'maps',
          'Köybaşı Cd. No:153 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Apartıman Yeniköy Rezervasyon',
          'http://reservation.google.apartimanyenikoy.com/',
          'operator',
          'Resmi rezervasyon ve tekil Yeniköy işletme kaydı doğrulandı.',
        ],
        [
          'Michelin Guide — Apartıman Yeniköy',
          'https://guide.michelin.com',
          'award',
          'Bib Gourmand / seçki varlığı ve mevsimsel Anadolu bistro çizgisi doğrulandı.',
        ],
        [
          'The Magger & Time Out İstanbul',
          'https://www.themagger.com',
          'editorial',
          'Kokoreç suyunda arpa şehriye, pekmezli patlıcan ve arka bahçe atmosferi doğrulandı.',
        ],
        [
          'Yemek.com & Gurme Rehber — Apartıman Yeniköy Kahvaltı',
          'https://yemek.com',
          'editorial',
          'Serpme yerine alakart kurgulanan kahvaltı sofrası, Saray Yumurtası, Cunda loru ve ev yapımı ekmekler doğrulandı.',
        ],
      ],
      pros: [
        'Hem kışın şömineli iç mekanda hem yazın arka bahçede dengeli akşam ambiyansı',
        'Uzun yıllardır semt karakterini koruyan özgün menü',
      ],
      cons: ['Popüler hafta sonu akşamlarında erken rezervasyon olmadan yer bulmak zor'],
      unc: ['Mevsim değişimlerinde ana yemek ve tatlı kalemleri yenilenebiliyor.'],
      verifiedAt: '2026-11-15',
    }),

    // --- KAHVALTI & PASTANE (3) ---
    compactSeed({
      id: 'yen-bramble-cafe',
      placeId: 'ChIJOyEfKSzLyhQRbD3stthRIhs',
      cat: 'kahvalti',
      name: 'Bramble Cafe Yeniköy',
      brand: 'bramble',
      area: 'Valide Çeşme Sk. · Cami Pasajı, Yeniköy',
      signals: ['tereyagli-kruvasan', 'balkan-sos-yumurta', 'evcil-hayvan-dostu'],
      desc:
        'Merkez Camii Pasajı ve küçük park kıyısında, ev yapımı reçeller ve balkan soslu yumurta tabaklarının taze tereyağlı kruvasanlarla buluştuğu Yeniköy brunch durağı.',
      order: [
        'Scrambled Avocado (Balkan Sos & Ev Yapımı Reçel)',
        'Bademli Kruvasan (Almond Croissant)',
        'Heavy Gun 2.0 Kahvaltı Tabağı',
      ],
      menu: [
        'Sunny Side Up Tabakları',
        'Pain au Chocolat',
        'Specialty Espresso & Filtre Kahveler',
      ],
      sec: [
        [
          'Almond Croissant & Pain au Chocolat',
          'Kahvaltı tabaklarının yanında veya sonrasında kahveyle tercih edilen çıtır katmanlı kruvasanlar.',
          'Yemek.com ve Gurme Rehber',
        ],
      ],
      seat: 'Küçük park yanındaki açık hava/kaldırım masaları ve dar cam cepheli iç oturma alanı; evcil hayvan dostu',
      crowd: 'Hafta sonu sabahı sakin arka cephe brunch’ı yapmak isteyen çiftler ve mahalle sakinleri',
      dis: 'İç mekan dar olduğu için hafta sonu sabahları masa bekleme süresi oluşuyor; porsiyonlara kıyasla fiyat bandı yüksek algılanabiliyor.',
      transit: 'Köybaşı Caddesi Yeniköy Merkez Camii yanındaki Valide Çeşme Sokak pasaj girişinde.',
      sources: [
        [
          'Google Maps — Bramble Cafe Yeniköy',
          'https://maps.google.com/?cid=1955215179455937900',
          'maps',
          'Valide Çeşme Sk. Merkez Camii Pasajı No:1 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Yemek.com — Yeniköy Kahvaltı Seçkisi',
          'https://yemek.com',
          'editorial',
          'Kruvasan katman kalitesi ve sabah kahvaltı tabakları doğrulandı.',
        ],
        [
          'Gurme Rehber — Bramble Cafe Yeniköy',
          'https://gurmerehber.com',
          'editorial',
          'Scrambled Avocado, Heavy Gun 2.0, Almond Croissant ve dış park masaları doğrulandı.',
        ],
      ],
      pros: [
        'Yumurta tabakları ile fırın kruvasanlarını aynı nitelikte sunan tekil Yeniköy brunch mutfağı',
        'Evcil hayvan dostu dış oturma avantajı',
      ],
      cons: ['Hafta sonu iç ve dış masalar küçük kapasite yüzünden hızlıca doluyor'],
      unc: ['Kruvasan çeşitleri yoğun sabah servisinde öğlene kalmadan bitebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-emek-cafe',
      placeId: 'ChIJu5trZvPKyhQRlSRz3HwbxPs',
      cat: 'kahvalti',
      name: 'Emek Cafe',
      brand: 'emek',
      area: 'Köybaşı Cd., Yeniköy',
      signals: ['1965-bogaz-ritueli', 'soğansiz-menemen', 'gul-boregi'],
      flags: { heritage: true, ritual: true },
      desc:
        'Kurucusu Osman Özbaşı’ndan bu yana deniz kıyısındaki dar rıhtımda önceden çektirilmiş domatesle hazırlanan menemeni ve sabah çıkan gül böreğiyle Yeniköy’ün yarım asırlık Boğaz kahvaltı ritüeli.',
      order: [
        'Klasik Yeniköy Menemeni',
        'Sabah Gül Böreği (Erken Tükenen)',
        'Bal-Kaymak, Ezine Peyniri & Kızarmış Ekmek',
      ],
      menu: [
        'Kavurmalı / Sucuklu Menemen & Omlet',
        'Tavşan Kanı Demleme Çay',
        'Pişi & Zeytin Tabağı',
      ],
      sec: [
        [
          'Gül Böreği & Kızarmış Ekmek Üstü Tereyağı-Bal-Kaymak',
          'Menemenin yanında masaya gelen çıtır gül böreği ve klasik Türk kahvaltısı eşlikçileri.',
          'Hürriyet ve TheMagger Yeniköy rehberi',
        ],
      ],
      seat: 'Doğrudan Boğaz suyuna sıfır dar açık rıhtım masaları ve tenteli sahil bölümü',
      crowd: 'Sabah yürüyüşçüleri, nostaljik semt müdavimleri ve hafta sonu Boğaz kahvaltısı arayan ziyaretçiler',
      dis: 'Hafta sonu kapıda kuyruk oluyor, masalar birbirine yakın ve yoğun saatlerde servis aceleci/sert hissedilebiliyor; fiyatlar sade kahvehane görünümünün hayli üzerinde.',
      transit: 'Köybaşı Caddesi No:57 üzerinde Yeniköy Vapur İskelesi’ne birkaç dakikalık yürüyüşle.',
      sources: [
        [
          'Google Maps — Emek Cafe',
          'https://maps.google.com/?cid=18141655422043628693',
          'maps',
          'Köybaşı Cd. No:57 sahil konumu ve operational durumu doğrulandı.',
        ],
        [
          'Hürriyet — Yeniköy Emek Cafe',
          'https://www.hurriyet.com.tr',
          'editorial',
          '1965’ten beri süren Boğaz kıyısı kahvaltı geleneği ve menemen/gül böreği reçetesi doğrulandı.',
        ],
        [
          'The Magger — Emek Cafe',
          'https://www.themagger.com',
          'editorial',
          'Soğansız klasik menemen, sabah gül böreği ve hafta sonu kalabalık uyarısı doğrulandı.',
        ],
        [
          'Gurme Rehber — Emek Cafe',
          'https://gurmerehber.com',
          'editorial',
          'Suya sıfır oturum ve yüksek fiyat/servis yoğunluğu dengesi doğrulandı.',
        ],
      ],
      pros: [
        '1965’ten bugüne kesintisiz süren, İstanbul Boğaz kıyısının sembol kahvaltı ritüeli',
        'Kıvamı oturtulmuş geleneksel domates bazlı menemen ve taze gül böreği',
      ],
      cons: [
        'Hafta sonu sıra bekleme, sıkışık masa düzeni ve aceleci servis dili',
        'Görünüme kıyasla yüksek hesap tutarı şikayetleri',
      ],
      unc: ['Gül böreği sabah saatlerinde tükendiğinde gün ortasında bulunamayabiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-kanti',
      placeId: 'ChIJ-5qipx_LyhQRyvl_FPTWlLY',
      cat: 'kahvalti',
      name: 'Kanti - All Day Eatery',
      brand: 'kanti',
      area: 'Köybaşı Cd., Yeniköy',
      signals: ['gun-boyu-brunch', 'brioche-truffle-egg', 'rezervasyonsuz-walk-in'],
      desc:
        'Rezervasyonsuz kapıdan giriş düzeniyle gün boyu kahvaltı sunan, trüflü çırpılmış yumurtalı brioche’undan Croque Madame’ına özenli sabah ve öğlen tabakları çıkaran modern mahalle mutfağı.',
      order: [
        'Truffle Scrambled Eggs on Brioche',
        'Truffle Béchamel Croque Madame',
        'Poşe Yumurtalı Avokado Toast',
      ],
      menu: [
        'Breakfast Burrito',
        'Korean Chicken Sando & A la Vodka Fusilli',
        'Half-Baked Cookie & Specialty Coffee',
      ],
      sec: [
        [
          'Half-Baked Cookie & Korean Chicken Sando',
          'Gün boyu açık mutfakta kahvaltı sonrası öğlene geçiş yapanlar için öne çıkan tatlı ve sandviç.',
          'kantikitchen.com ve ALEM seçkisi',
        ],
      ],
      seat: 'Sade, aydınlık bistro salonu ve caddeye bakan masa düzeni (rezervasyonsuz walk-in sistem)',
      crowd: 'Geç kahvaltı ve hafta içi/hafta sonu modern brunch arayan semt gençleri ve aileler',
      dis: 'Rezervasyon kabul etmediği için hafta sonu geç sabah saatlerinde kapıda bekleme oluşuyor; masalar birbirine yakın.',
      transit: 'Köybaşı Caddesi No:78 üzerinde Tarihi Yeniköy Börekçisi’nin hemen yanında.',
      sources: [
        [
          'Google Maps — Kanti - All Day Eatery',
          'https://maps.google.com/?cid=13156376755260357066',
          'maps',
          'Köybaşı Cd. No:78 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Kanti Kitchen Resmi Sitesi',
          'https://www.kantikitchen.com/',
          'operator',
          'Tekil Yeniköy şubesi, gün boyu kahvaltı ve walk-in hizmet modeli doğrulandı.',
        ],
        [
          'The Magger — Kanti Yeniköy',
          'https://www.themagger.com',
          'editorial',
          'Truffle Scrambled Brioche, Croque Madame ve Half-Baked Cookie imzaları doğrulandı.',
        ],
        [
          'ALEM — Kanti Yeniköy',
          'https://www.alem.com.tr',
          'editorial',
          'Modern mahalle lokantası ve all-day eatery kimliği doğrulandı.',
        ],
      ],
      pros: [
        'Geç saatte dahi taze yumurta ve brioche tabakları çıkarabilen gerçek all-day brunch mutfağı',
        'Sadece sabahla sınırlı kalmayan dengeli öğle sandviç/makarna devamlılığı',
      ],
      cons: ['Rezervasyon alınmaması popüler saatlerde bekleme süresi yaratıyor'],
      unc: ['Half-Baked Cookie pişirim süreleri siparişe göre kısa bekleme gerektirebiliyor.'],
      verifiedAt: '2026-11-15',
    }),

    // --- DENEMELİSİN (4) ---
    compactSeed({
      id: 'yen-evimiz-osmanli',
      placeId: 'ChIJa9oyqXTKyhQRSfNEjIBKfr4',
      cat: 'denemelisin',
      pinnedFirst: true,
      name: 'Evimiz Osmanlı Mutfağı',
      brand: 'evimiz',
      area: 'Salihağa Sk., Yeniköy',
      signals: ['aile-bahcesi', 'osmanli-ev-yemegi', 'kuzu-tandir'],
      desc:
        'Köybaşı’nın bir paralel arka sokağı Salihağa Sokak’ta bahçe içinde Hünkar Beğendi’den kuzu tandır ve zeytinyağlılara uzanan özenli Osmanlı-Türk ev yemekleri lokantası.',
      order: [
        'Hünkar Beğendi',
        'Kuzu Tandır',
        'Zeytinyağlı Yaprak Sarma & Kıtır Mantı',
      ],
      menu: [
        'Testi Kebabı & Güveç Yemekleri',
        'Peynirli Su Böreği',
        'Sarı Burma & Ev Baklavası',
      ],
      sec: [
        [
          'Sarı Burma & Peynirli Su Böreği',
          'Sulu ve ağır tencere yemeklerinin yanında ev yapımı hamur işi ve şerbetli kapanış seçeneği.',
          'Mekanlar.com ve menü kayıtları',
        ],
      ],
      seat: 'Salihağa Sokak içinde sakin aile bahçesi ve geleneksel dokulu kapalı salon',
      crowd: 'Kalabalık sahil lokantalarından uzakta ağır pişen sulu yemek arayan aileler ve semt müdavimleri',
      dis: 'Geleneksel tencere yemekleri günlük miktarda çıktığı için akşam geç saatlerde bazı çeşitler bitebiliyor; hafta içi öğlen hızlı tüketime yönelebiliyor.',
      transit: 'Köybaşı Caddesi’nden Salihağa Sokak No:25’e birkaç dakikalık yürüyüşle ulaşılır.',
      sources: [
        [
          'Google Maps — Evimiz Osmanlı Mutfağı',
          'https://maps.google.com/?cid=13726490630241448777',
          'maps',
          'Salihağa Sk. No:25 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Mekanlar.com — Evimiz Osmanlı Mutfağı',
          'https://www.mekanlar.com',
          'editorial',
          'Bahçeli aile işletmesi ortamı, Hünkar Beğendi, kuzu tandır ve ev baklavası doğrulandı.',
        ],
        [
          'Vegan İstanbul & Menü Rehberi',
          'https://www.veganistanbul.com',
          'community',
          'Zeytinyağlı seçkisi, yaprak sarma ve bitkisel tencere seçenekleri doğrulandı.',
        ],
      ],
      pros: [
        'Yeniköy’de lüks şef lokantaları ve kafeler arasında gerçek ev yemeği ve Osmanlı mutfağı boşluğunu dolduran tekil adres',
        'Bahçeli sakin arka sokak konumu ve dengeli puan istikrarı',
      ],
      cons: ['Günün tencere menüsü erken saatlerde tükendiğinde seçim daralabiliyor'],
      unc: ['Testi kebabı gibi uzun hazırlıklı yemekler önceden sorulmalı.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-rafine00',
      placeId: 'ChIJs3PUWwDLyhQRsuLWIixiZrw',
      cat: 'denemelisin',
      name: 'Rafine00',
      brand: 'rafine00',
      area: 'Kapalı Bakkal Sk., Yeniköy',
      signals: ['gunluk-el-yapimi-makarna', 'butik-kapali-bakkal', 'erken-kapanis'],
      desc:
        'Kapalı Bakkal Sokak’ta günlük taze hamurla hazırlanan radiatori, casarecce ve spagetti çeşitleriyle yüksek puan istikrarı yakalayan butik taze makarna dükkanı.',
      order: [
        'Fesleğen Pestolu Antep Fıstıklı Radiatori',
        'Taze Keçi Peynirli Arrabbiata Radiatori',
        'Bolonez Soslu Taze Spagetti',
      ],
      menu: [
        'Füme Kaburgalı & Trüf Mantarlı Taze Casarecce',
        'Kremalı Tavuklu Mantarlı Radiatori',
        'Dilim Tiramisu',
      ],
      sec: [
        [
          'Dilim Tiramisu',
          'Günlük taze makarna tabağının ardından tek porsiyonluk İtalyan tatlı kapanışı olarak öne çıkıyor.',
          'Yemeksepeti ve yerel platform geri bildirimleri',
        ],
      ],
      seat: 'Küçük butik dükkan içi birkaç masa ve ağırlıklı al-götür / hızlı öğle-erken akşam servisi',
      crowd: 'Öğle ve erken akşam saatlerinde taze İtalyan makarnası arayan semt çalışanları ve sakinleri',
      dis: 'Çok sınırlı oturma kapasitesi var, Pazartesi kapalı ve akşam geç servis vermeden erken saatte kapanıyor.',
      transit: 'Köybaşı Caddesi’nden Kapalı Bakkal Sokak No:5/A’ya kısa yürüyüşle.',
      sources: [
        [
          'Google Maps — Rafine00',
          'https://maps.google.com/?cid=13575646068457530034',
          'maps',
          'Kapalı Bakkal Sk. No:5/A konumu ve operational durumu doğrulandı.',
        ],
        [
          'Yemeksepeti — Rafine00 Menü',
          'https://www.yemeksepeti.com',
          'community',
          'Antep fıstıklı pesto radiatori, keçi peynirli arrabbiata, füme kaburgalı casarecce ve tiramisu doğrulandı.',
        ],
        [
          'Fırsat Bu Fırsat — Rafine00 Yeniköy',
          'https://www.firsatbufirsat.com',
          'community',
          'Günlük el yapımı taze makarna üretimi ve semt içi servis doğrulandı.',
        ],
        [
          'Ürün Sepetim — Rafine00 Rehber',
          'https://urunsepetim.com',
          'community',
          'Kapalı Bakkal Sokak dükkan detayı ve taze sos reçeteleri doğrulandı.',
        ],
      ],
      pros: [
        'Günlük taze hamur kesen tekil mahalle makarna atölyesi',
        'Fıstıklı pesto ve keçi peynirli arrabbiata gibi net imza reçeteler',
      ],
      cons: [
        'Erken kapanış ve Pazartesi tatili akşam yemeği planını kısıtlıyor',
        'Oturma yeri çok dar olduğundan ağırlıklı paket veya hızlı yemek formatına uygun',
      ],
      unc: ['Hacmi henüz görece yeni olduğundan sos stokları gün içinde değişebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-yeni-damla-pastanesi',
      placeId: 'ChIJl9yzXvPKyhQR_uXhcSaknPY',
      cat: 'denemelisin',
      name: 'Yeni Damla Pastanesi',
      brand: 'damla',
      area: 'Köybaşı Cd., Yeniköy',
      signals: ['1973-mahalle-pastanesi', 'yali-capkini', 'tahinli-yufka-kurabiye'],
      desc:
        'Köybaşı Caddesi’nde yarım asrı aşkın süredir yalnızca Yeniköy’de üretim yapan; Yalı Çapkını tatlısı, tahinli yufkalı özel kurabiyesi ve ekşi mayalı ekmekleriyle tanınan semt pastanesi.',
      order: [
        'Yalı Çapkını Tatlısı',
        'Damla Special (Tahinli Yufkalı Kurabiye)',
        'Mini Ekler Çeşitleri',
      ],
      menu: [
        'Peynirli & Kıymalı Su Böreği / Kol Böreği',
        'Ekşi Mayalı & Siyez Ekmek Çeşitleri',
        'Geleneksel Kurabiye & Kek Seçkisi',
      ],
      sec: [
        [
          'Peynirli Su Böreği & Mini Ekler',
          'Sabah fırınından çıkan börek çeşitleri ve kutuluk taze eklerler mahallenin günlük uğrak ürünleri.',
          'Milliyet ve Nerede Ne Var kayıtları',
        ],
      ],
      seat: 'Ağırlıklı tezgah önü al-götür ve paket pastane düzeni; vitrin önünde çok sınırlı oturma alanı',
      crowd: 'Misafirliğe kutu tatlı/börek götüren Yeniköy sakinleri ve sabah ekmek müdavimleri',
      dis: 'Büyük bir kafe oturma alanı sunmaz; öğleden sonra özel kurabiye ve su böreği tepsileri tükenebiliyor.',
      transit: 'Köybaşı Caddesi No:74/A üzerinde Kanti’nin birkaç kapı yanında.',
      sources: [
        [
          'Google Maps — Yeni Damla Pastanesi',
          'https://maps.google.com/?cid=17770258714723476990',
          'maps',
          'Köybaşı Cd. No:74/A konumu ve operational durumu doğrulandı.',
        ],
        [
          'Milliyet — Yeniköy Durakları',
          'https://www.milliyet.com.tr',
          'editorial',
          '1973’ten bu yana süren mahalle pastanesi geçmişi ve imza tatlıları doğrulandı.',
        ],
        [
          'Nerede Ne Var / VenuesReyon — Yeni Damla Pastanesi',
          'https://www.nerdenerede.com',
          'community',
          'Yalı Çapkını tatlısı, Damla Special tahinli kurabiye, ekler ve su böreği beğenileri doğrulandı.',
        ],
      ],
      pros: [
        '1973’ten beri aynı mahalle dokusunu sürdüren tek şubeli esnaf pastanesi',
        'Başka yerde bulunmayan Yalı Çapkını ve tahinli yufka kurabiye reçeteleri',
      ],
      cons: ['Uzun süre oturup kahve içilecek kafe düzeninden ziyade vitrin/paket pastane formatında'],
      unc: ['Ekşi mayalı ve siyez ekmeklerin çıkış saatleri günlük fırın döngüsüne göre değişiyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-tarihi-yenikoy-borekcisi',
      placeId: 'ChIJM9etsfTKyhQR59MXNcDEmVU',
      cat: 'denemelisin',
      name: 'Tarihi Yeniköy Börekçisi',
      brand: 'yeniköy börekçisi',
      area: 'Köybaşı Cd., Yeniköy',
      signals: ['1817-tarihi-tas-firin', 'kusuzumlu-kiymali-borek', 'kayikci-ailesi'],
      flags: { heritage: true },
      desc:
        'Kökeni eski Osmanlı dönemine dayanan ve dört kuşaktır odun ateşindeki taş fırında kuş üzümlü dolmalık fıstıklı kıymalı kol böreğinden peksimete uzanan mirası yaşatan tarihi mahalle fırını.',
      order: [
        'Kuş Üzümlü & Çam Fıstıklı Kıymalı Kol Böreği',
        'Peynirli Su Böreği',
        'Paskalya Çöreği & Peksimet',
      ],
      menu: [
        'Ispanaklı & Patatesli Kol Böreği',
        'Geleneksel Un Kurabiyesi',
        'Mahlepli Çörek & Galeta Çeşitleri',
      ],
      sec: [
        [
          'Paskalya Çöreği & Taş Fırın Peksimeti',
          'Sabah böreklerinin yanında eski İstanbul fırın geleneğini sürdüren mahlepli çörek ve kıtır peksimet.',
          'tarihiyenikoyborekcisi.com ve TheMagger',
        ],
      ],
      seat: 'Tarihi ahşap dükkan içinde al-götür tezgah ağırlıklı düzen ve birkaç küçük masa',
      crowd: 'Sabah erken sıcak kol böreği alan semt sakinleri ve tarihi İstanbul fırını meraklıları',
      dis: 'Geleneksel bir kafe oturumuna değil hızlı tezgah/paket satışına odaklıdır; kıymalı börek yağlı dokusuyla ağır gelebiliyor ve erken saatlerde bitebiliyor.',
      transit: 'Köybaşı Caddesi No:80 adresinde Yeniköy Merkez Camii’ne birkaç adım uzaklıkta.',
      sources: [
        [
          'Google Maps — Tarihi Yeniköy Börekçisi',
          'https://maps.google.com/?cid=6168177494464123879',
          'maps',
          'Köybaşı Cd. No:80 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Tarihi Yeniköy Börekçisi Resmi Sitesi',
          'http://www.tarihiyenikoyborekcisi.com/',
          'operator',
          '1817 kökeni, Kayıkçı ailesi mirası, odun fırını ve peksimet/Paskalya çöreği menüsü doğrulandı.',
        ],
        [
          'The Magger — Tarihi Yeniköy Börekçisi',
          'https://www.themagger.com',
          'editorial',
          'Kuş üzümlü dolmalık fıstıklı kıymalı kol böreği ve tarihi taş fırın geçmişi doğrulandı.',
        ],
        [
          'Cornucopia & Kültür Envanteri',
          'https://kulturenvanteri.com',
          'editorial',
          'Yeniköy’ün tescilli tarihi Rum fırın mirası olarak belgelenmiştir.',
        ],
      ],
      pros: [
        'İki asrı aşan geçmişiyle Yeniköy’ün yaşayan en eski gastronomi mirası',
        'Kuş üzümlü fıstıklı iç harç ve taş odun fırını karakteri',
      ],
      cons: [
        'Oturma alanı oldukça kısıtlı, ağırlıklı al-götür fırın deneyimi',
        'Gün ortasına kalındığında sıcak börek tepsileri bitebiliyor',
      ],
      unc: ['Fırından taze çıkış saatlerine denk gelmeyen dilimler bekledikçe yağ hissiyatı artabiliyor.'],
      verifiedAt: '2026-11-15',
    }),

    // --- BALIK & DENİZ ÜRÜNLERİ (4) ---
    compactSeed({
      id: 'yen-sandal-balik',
      placeId: 'ChIJm0TB2mPKyhQRAaevmtjGvc4',
      cat: 'balik',
      pinnedFirst: true,
      name: 'Sandal Balık',
      brand: 'sandal',
      area: 'Köybaşı Cd., Yeniköy',
      signals: ['alkolsuz-balikci', 'balik-simidi', 'bahceli-aile-sofrasi'],
      desc:
        'Arka bahçesi ve ferah salonuyla alkolsüz aile balıkçısı konseptinde hizmet veren; balık simidi, balık mantısı ve dereotlu mısır ekmeği gibi sıcak ara lezzetleriyle tanınan Yeniköy klasiği.',
      order: [
        'Balık Simidi',
        'Balık Mantısı',
        'Havuçlu Dereotlu Mısır Ekmeği & İzmir Salatası',
      ],
      menu: [
        'Balık Köftesi & Kalamar Tava',
        'Mevsimlik Izgara / Tava Boğaz Balıkları',
        'Tahinli Kabak Tatlısı',
      ],
      sec: [
        [
          'Balık Köftesi & Tahinli Kabak Tatlısı',
          'Çocuklu aileler ve alkolsüz balık sofrası arayan gruplar için başlangıç ve tatlı tamamlayıcıları.',
          'yenikoysandalbalik.com.tr ve BgnNeYesem',
        ],
      ],
      seat: 'Köybaşı Caddesi üzerinde iki katlı geniş salon ve yeşil arka bahçe',
      crowd: 'Aileler, kalabalık hafta sonu yemek grupları ve alkolsüz taze balık arayan müdavimler',
      dis: 'Alkolsüz işletme olduğu için rakı-meze eşleşmesi arayanlara uygun değildir; kremalı/kızartma ara sıcaklar fazla seçildiğinde ağırlaşabiliyor.',
      transit: 'Köybaşı Caddesi No:178 üzerinde İstinye yönü çıkışına doğru cadde üstünde yer alır.',
      sources: [
        [
          'Google Maps — Sandal Balık',
          'https://maps.google.com/?cid=14897281776021907201',
          'maps',
          'Köybaşı Cd. No:178 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Sandal Balık Resmi Sitesi',
          'http://www.yenikoysandalbalik.com.tr/',
          'operator',
          'Tekil Yeniköy işletmesi, alkolsüz konsept ve balık simidi/mantısı imza menüsü doğrulandı.',
        ],
        [
          'Bugün Ne Yesem / Nerede Ne Var',
          'https://www.bgnneyesem.com',
          'editorial',
          'Dereotlu mısır ekmeği, balık mantısı, bahçe ortamı ve aile dostu hizmet doğrulandı.',
        ],
      ],
      pros: [
        '1300’ü aşkın değerlendirmede puan istikrarını koruyan yüksek hacimli mahalle balıkçısı',
        'Balık simidi ve balık mantısı gibi başka balıkçılarda az bulunan sıcak ara lezzetler',
      ],
      cons: ['Tamamen alkolsüz konsept klasik meyhane beklentisi olanları şaşırtabiliyor'],
      unc: ['Mevsim balık çeşitliliği günlük hale gelen tekneye göre değişiklik gösteriyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-datca-balikcisi',
      placeId: 'ChIJGSJkfzPLyhQRB4290anQCkk',
      cat: 'balik',
      name: 'Datça Balıkçısı Yeniköy',
      brand: 'datça',
      area: 'Vapur İskelesi Sk., Yeniköy',
      signals: ['iskele-yaninda-manzara', 'ege-mezeleri', 'levrekli-pazi-sarma'],
      desc:
        'Yeniköy Vapur İskelesi bitişiğinde cam tavanlı ve deniz manzaralı üst katıyla Ege mezelerini, levrekli pazı sarmayı ve mevsimlik ızgara balıkları sunan sahil balık meyhanesi.',
      order: [
        'Levrekli Pazı Sarma',
        'Ahtapot Izgara',
        'Hibeş, Fava & Levrek Marine',
      ],
      menu: [
        'Lakerda & Girit Ezme',
        'Karides Güveç & Kalamar Izgara',
        'Mevsimlik Günlük Deniz Balıkları',
      ],
      sec: [
        [
          'Karides Güveç & Lakerda',
          'Üst kat Boğaz manzarası eşliğinde soğuk meze ve sıcak deniz ürünü başlangıcı.',
          'datçabalıkçısıyeniköy.com ve Mes Prestiges',
        ],
      ],
      seat: 'Vapur İskelesi yanında iki katlı restoran; üst katta açılabilir camlı Boğaz manzaralı masalar',
      crowd: 'İskele manzarasında uzun meyhane akşamı geçirmek isteyen çiftler ve arkadaş grupları',
      dis: 'Boğaz hattı fiyat bandı yüksek düzeydedir ve yoğun hafta sonu akşamlarında sıcak ara servisleri gecikebiliyor.',
      transit: 'Köybaşı Caddesi’nden Yeniköy Vapur İskelesi Sokağı No:7/A’ya yürüyerek.',
      sources: [
        [
          'Google Maps — Datça Balıkçısı Yeniköy',
          'https://maps.google.com/?cid=5263248542322756871',
          'maps',
          'Vapur İskelesi Sk. No:7/A sahil konumu ve operational durumu doğrulandı.',
        ],
        [
          'Datça Balıkçısı Yeniköy Resmi Sitesi',
          'https://datçabalıkçısıyeniköy.com/',
          'operator',
          'Tekil Yeniköy işletmesi, Ege mezeleri ve Boğaz manzaralı üst kat yapısı doğrulandı.',
        ],
        [
          'Mes Prestiges & Menu-TR',
          'https://mesprestiges.com',
          'editorial',
          'Hibeş, fava, levrekli pazı sarma, lakerda ve iskele yanı manzara doğrulandı.',
        ],
      ],
      pros: [
        'Vapur İskelesi bitişiğinde gerçek Boğaz manzaralı camlı teras deneyimi',
        'Ege odaklı hafif mezeler ile klasik mevsim balıklarının temiz dengesi',
      ],
      cons: ['Tam manzara masaları için rezervasyon gerekir ve fiyat skalası üst segmenttedir'],
      unc: ['Hafta sonu dolu salonda sipariş hızı değişebiliyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-taka-balik',
      placeId: 'ChIJw0bOm_LKyhQRK0fDU2ZiI_s',
      cat: 'balik',
      name: 'Taka balık',
      brand: 'taka',
      area: 'Köybaşı Cd. · Kalender Yakını, Yeniköy',
      signals: ['bogaz-tabure-ritueli', 'citir-kalamar', 'sokak-balik-ekmek'],
      flags: { ritual: true },
      desc:
        'Köybaşı Caddesi’nin Kalender tarafındaki ucunda alçak taburelerde çıtır kalamar, midye tava ve balık ekmek sunan köklü sokak arası Boğaz balıkçısı ritüeli.',
      order: [
        'Çıtır Kalamar Tava',
        'Balık Ekmek (Hamsi / İstavrit / Mezgit)',
        'Midye Tava',
      ],
      menu: [
        'Turşu Suyu & Taze Roka Salatası',
        'Közlenmiş Kırmızı Biberli Mezeler',
        'Fırın Helva',
      ],
      sec: [
        [
          'Midye Tava & Fırın Helva',
          'Balık ekmek ve kalamar ikilisini tamamlayan turşu suyu eşlikli sıcak kapanış.',
          'Yemek.com ve müdavim rehberleri',
        ],
      ],
      seat: 'Kaldırım kenarı ve dar iç alanda alçak tahta tabure/kısa masa düzeni; al-götür seçeneği de yaygındır',
      crowd: 'Samimi ve salaş ortamda hızlı taze balık yemek isteyen gençler, yürüyüşçüler ve müdavimler',
      dis: 'Konforlu sandalyeli bir restoran değildir (tabure düzeni), yoğun saatlerde ayakta sıra beklenir ve yalnızca nakit ödeme geçerli olabiliyor.',
      transit: 'Köybaşı Caddesi No:1 adresinde Tarabya-Kalender sınırındaki sahil durağının hemen yanında.',
      sources: [
        [
          'Google Maps — Taka balık',
          'https://maps.google.com/?cid=18096415919336277803',
          'maps',
          'Köybaşı Cd. No:1 konumu ve operational durumu doğrulandı.',
        ],
        [
          'Yemek.com — Taka Balık Yeniköy',
          'https://yemek.com',
          'editorial',
          'Alçak tabure düzeni, balık ekmek, kalamar tava ve Yeniköy sahil ritüeli doğrulandı.',
        ],
        [
          'DonanımHaber & Mekan.com',
          'https://www.mekan.com',
          'community',
          'Hızlı sirkülasyonlu taze tava balık, midye tava ve nakit ödeme uyarısı doğrulandı.',
        ],
      ],
      pros: [
        '2400’ü aşkın değerlendirmeye sahip gerçek Boğaz salaş balık ekmek ve kalamar klasiği',
        'Gösterişsiz, hızlı sirkülasyonlu taze kızartma standardı',
      ],
      cons: [
        'Alçak tabureler uzun oturuma elverişli değil',
        'Nakit ödeme kısıtı ve dar alanda yoğun kalabalık',
      ],
      unc: ['Mevsimine göre günlük tava balık türü (hamsi/istavrit/mezgit) değişiyor.'],
      verifiedAt: '2026-11-15',
    }),
    compactSeed({
      id: 'yen-aleko-deniz-park',
      placeId: 'ChIJ5Q_JbvPKyhQRe_oyG_aEEGw',
      cat: 'balik',
      name: 'Aleko’nun Yeri Deniz Park Restoran',
      brand: 'aleko',
      area: 'Daire Sk., Yeniköy',
      signals: ['1967-eski-istanbul', 'splendid-binasi', 'beyaz-ortulu-meyhane'],
      flags: { heritage: true },
      desc:
        'Kurucusu Aleksandros “Bay Aleko” Nikolaidis tarafından tarihî sahil yapısında kurulan, beyaz örtülü masaları ve eski İstanbul balık meyhanesi geleneğiyle yarım asrı deviren Yeniköy klasiği.',
      order: [
        'Lakerda & Levrek Marin',
        'Karides Güveç',
        'Kalkan / Levrek Buğulama',
      ],
      menu: [
        'Avokadolu Karides & Deniz Börülcesi',
        'Mevsimlik Tava ve Izgara Boğaz Balıkları',
        'Tarama & Klasik Soğuk Mezeler',
      ],
      sec: [
        [
          'Avokadolu Karides & Tarama',
          'Denize sıfır masalarda ana balık öncesi klasik beyaz örtülü meyhane başlangıçları.',
          'Milliyet ve İstanbul meyhane arşivleri',
        ],
      ],
      seat: 'Tarihî taş bina altında denize nazır beyaz örtülü teras ve klasik iç salon',
      crowd: 'Eski İstanbul usulü ağırbaşlı balık meyhanesi arayan müdavimler ve özel aile yemekleri',
      dis: 'Boğaz hattının en yüksek fiyat bandındaki balıkçılarındandır; hesap kontrolü konusunda şeffaf menü sorma ihtiyacı ve dönemsel servis aksaklıkları bildirilebiliyor.',
      transit: 'Köybaşı Caddesi’nden Yeniköy Vapur İskelesi yanındaki Daire Sokak No:9’a birkaç adımda.',
      sources: [
        [
          'Google Maps — Aleko’nun Yeri Deniz Park Restoran',
          'https://maps.google.com/?cid=7786869948276734587',
          'maps',
          'Daire Sk. No:9 sahil konumu ve operational durumu doğrulandı.',
        ],
        [
          'Milliyet — Bay Aleko ve Yeniköy Meyhaneleri',
          'https://www.milliyet.com.tr',
          'editorial',
          '1967 kuruluş tarihi, Aleksandros Nikolaidis mirası ve tarihî Splendid sahil konumu doğrulandı.',
        ],
        [
          'Restoranım & Harita Değerlendirmeleri',
          'https://www.restoranim.net',
          'community',
          'Lakerda, karides güveç, buğulama balıklar ve fiyat/hesap uyarıları doğrulandı.',
        ],
      ],
      pros: [
        '1967’den beri süren otantik eski İstanbul balık lokantası kimliği',
        'Tarihî sahil yapısı içinde gerçek suya sıfır beyaz örtü atmosferi',
      ],
      cons: [
        'Üst düzey fiyat politikası ve sipariş öncesi gramaj/fiyat teyidi gerektirmesi',
        'Yoğun akşamlarda servis temposunun dalgalanabilmesi',
      ],
      unc: ['Tarihi işletmede mevsim balığı gramaj fiyatları günlük sorulmalıdır.'],
      verifiedAt: '2026-11-15',
    }),

    // --- OLUMSUZ KONTROLLER (negControl) ---
    negControl(
      'ctrl-yen-vagabondos-closed',
      'ChIJ0famgGHKyhQR9rmzgD2mpAs',
      'pizza',
      'Kapı 1 kontrolü: Vagabondo’s Pizzeria kalıcı olarak kapalı (CLOSED_PERMANENTLY).',
      { brand: 'vagabondo' }
    ),
    negControl(
      'ctrl-yen-marcel-closed',
      'ChIJY6Tuiou1yhQROiBvs_GVoDE',
      'kahvalti',
      'Kapı 1 kontrolü: Marcel Patisserie kalıcı olarak kapalı (CLOSED_PERMANENTLY).',
      { brand: 'marcel' }
    ),
    negControl(
      'ctrl-yen-juanvaldez-chain',
      'ChIJq3DLxUnLyhQRzJjbA3f5aHo',
      'kahve',
      'Kapı 2 kontrolü: Juan Valdez uluslararası kahve zinciri şubesidir.',
      { brand: 'juan valdez' }
    ),
    negControl(
      'ctrl-yen-kronotrop-chain',
      'ChIJpTogw8_LyhQRb904bfCfI_U',
      'kahve',
      'Kapı 2 kontrolü: Kronotrop çok şubeli kahve zinciridir.',
      { brand: 'kronotrop' }
    ),
    negControl(
      'ctrl-yen-caffenero-chain',
      'ChIJlex3BOPLyhQRjQDWa7-QG6c',
      'kahve',
      'Kapı 2 kontrolü: Caffe Nero uluslararası kahve zinciridir.',
      { brand: 'nero' }
    ),
    negControl(
      'ctrl-yen-whiteburger-chain',
      'ChIJbcDMmcvLyhQRx7KkQMrRvO0',
      'hamburger',
      'Kapı 2 & 6 kontrolü: White Burger hem çok şubeli zincir hem 3.4 puanlıdır.',
      { brand: 'white burger' }
    ),
    negControl(
      'ctrl-yen-hopdaddy-chain',
      'ChIJeedYtvTKyhQRksA7XsIFeeY',
      'hamburger',
      'Kapı 2 & 6 kontrolü: HOPDADDY BURGER Yeniköy/Maslak/Teşvikiye 3 şubeli zincir ve 4.2 puanlıdır.',
      { brand: 'hopdaddy' }
    ),
    negControl(
      'ctrl-yen-fiko-chain',
      'ChIJu6D-sfTKyhQRTN9sS_9d_MU',
      'denemelisin',
      'Kapı 2 & 6 kontrolü: Fiko Yeniköy çok şubeli ocakbaşı zinciri ve 3.9 puanlıdır.',
      { brand: 'fiko' }
    ),
    negControl(
      'ctrl-yen-voi-chain',
      'ChIJm1vrEtTLyhQRVSH92bnenN8',
      'kahve',
      'Kapı 2 & 6 kontrolü: VOI Yeniköy çok şubeli kafe zinciri ve 3.9 puanlıdır.',
      { brand: 'voi' }
    ),
    negControl(
      'ctrl-yen-ioki-chain',
      'ChIJn1sHi7XLyhQRMkAMgmTmoSg',
      'date',
      'Kapı 2 kontrolü: İoki çok şubeli suşi zinciridir (Ulus/Kandilli/Karaköy/Yeniköy/İzmir).',
      { brand: 'ioki' }
    ),
    negControl(
      'ctrl-yen-girandola-purity',
      'ChIJQX31jmHKyhQRAVj-9VmiT-c',
      'kahve',
      'Kapı 3B & 2 kontrolü: Girandola Gelato ice_cream_shop birincil türü ve çok şubeli dondurma zinciridir.',
      { brand: 'girandola' }
    ),
    negControl(
      'ctrl-yen-emekmanti-below44',
      'ChIJP60_K4vKyhQRi0MAXCqtrjE',
      'denemelisin',
      'Kapı 6 kontrolü: Emek Mantı Evi 3.5 puan (1505 oy) ile 4.4 tabanı altındadır.',
      { brand: 'emek mantı' }
    ),
    negControl(
      'ctrl-yen-gazebo-below44',
      'ChIJkWl0lYrKyhQRv_VETQ42R2k',
      'date',
      'Kapı 6 kontrolü: Gazebo 4.0 puan (1517 oy) ile korumasız 4.4 tabanı altındadır.',
      { brand: 'gazebo' }
    ),
    negControl(
      'ctrl-yen-flamor-tarabya',
      'ChIJJaEOAHzLyhQR_sk9LTTjkMM',
      'date',
      'Kapı 4 kontrolü: Flamor Yeniköy adı Yeniköy geçmesine rağmen adresi ve konumu Tarabya sınırındadır.',
      { brand: 'flamor' }
    ),
    negControl(
      'ctrl-yen-haga-istinye',
      'ChIJV9rz6rrLyhQR-X-tnBYE4zM',
      'hamburger',
      'Kapı 4 kontrolü: Haga Smash Burger İstinye Dereboyu Sokak adresinde ve Yeniköy bbox dışındadır.',
      { brand: 'haga' }
    ),
  ],
};
