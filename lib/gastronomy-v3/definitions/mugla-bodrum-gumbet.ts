import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const MUGLA_BODRUM_GUMBET_DEF: V3RegionDefinition = {
  id: 'gumbet-bodrum-mugla',
  slug: 'gumbet',
  city: 'Muğla',
  district: 'Bodrum',
  allowedDistricts: ['Bodrum'],
  neighborhood: 'Gümbet',
  officialQuarter:
    'Gümbet Mahallesi & Cevat Şakir (Gümbet İnişi) Hattı — Gümbet Sahili, Ayaz Caddesi, Adnan Menderes Caddesi, İsmet İnönü Caddesi & Asarlık Mevkii',
  displayName: 'Gümbet, Bodrum, Muğla',
  locative: "Gümbet'te",
  path: ['mugla', 'bodrum', 'gumbet'],
  aliases: [
    'Gümbet',
    'Gumbet',
    'Gümbet Sahil',
    'Asarlık',
    'Asarlik',
    'Asarlık Koyu',
    'Ayaz Caddesi Gümbet',
  ],
  scopeNote:
    'Gümbet Sahili, Ayaz Cd., Adnan Menderes Cd., İsmet İnönü Cd. (Cevat Şakir İnişi) & Asarlık Mevkii · Doğrulanmış Seçki',
  characterSubtitle:
    'Gümbet koyu sahilinden Asarlık sırtlarına, Ayaz ve Adnan Menderes caddelerinin arka sokaklarından Cevat Şakir Gümbet inişine uzanan el yapımı smash burger, taş fırın Konya etli ekmeği, kömür ateşi ocakbaşılar, közde et döner, otuz beş yıllık Uzak Doğu mutfağı, şarap evli steakhouse sofraları ve iskeleli kıyı bistrosu.',
  center: { lat: 37.0338, lng: 27.4025 },
  bbox: { minLat: 37.0240, maxLat: 37.0405, minLng: 27.3960, maxLng: 27.4074 },
  excludeBbox: { minLat: 37.0359, maxLat: 37.0405, minLng: 27.3960, maxLng: 27.3986 },
  allowedNeighborhoodTokens: [
    'Gümbet',
    'Gumbet',
    'Cevat Şakir',
    'Cevat Sakir',
    'Asarlık',
    'Asarlik',
  ],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // ==================== 1. PİZZA ====================
    // Gümbet sınırları içinde nitelikli, bağımsız ve ≥4.4 / ≥35 eşiklerini karşılayan pizzacı bulunmadığından kategori dinamik gizlenir (Yoksa Gösterme).

    // ==================== 2. HAMBURGER ====================
    compactSeed({
      id: 'pixel-burger-gumbet',
      placeId: 'ChIJ0Qh0nxZtvhQREtuy3rOJhvI',
      cat: 'hamburger',
      brand: 'pixel',
      area: 'İsmet İnönü Cd. (Cevat Şakir), Gümbet',
      signals: ['el_yapimi_smash_burger', 'truf_ve_ozel_soslar', 'gece_gec_saat_servisi'],
      verifiedAt: '2026-11-16',
      desc: "Cevat Şakir'den Gümbet'e inen İsmet İnönü Caddesi aksında yer alan, taze çekim etlerle hazırlanan el yapımı smash burgerleri, trüflü sosları ve gece geç saatlere kadar süren mutfağıyla öne çıkan bağımsız sokak burgercisi.",
      order: ['Pixel Cheese Smash Burger', 'Trüf Soslu Dana Burger', 'Animal Fries'],
      menu: [
        'Pixel Cheese Smash Burger',
        'Trüf Soslu Dana Burger',
        'Özel Soslu Tavuk Burger',
        'Çıtır Tavuk Tenders Box',
        'Animal Fries & Chaos Fries',
        'Sade Patates Kızartması',
      ],
      sec: [
        [
          'Çıtır Tavuk Tenders Box',
          'Altılı ve on ikili kutu seçenekleriyle dana burger siparişi yanında paylaşım veya tavuk tercihi için öne çıkar.',
          'Yemeksepeti ve Migros Yemek menü kayıtları',
        ],
        [
          'Chaos Fries',
          'Özel sos ve baharat dokunuşuyla smash burger menülerini tamamlayan yan patates seçeneğidir.',
          'Yemeksepeti menü listesi',
        ],
      ],
      seat: 'Neon detaylı modern iç tezgah alanı ve paket servis odaklı kompakt oturma düzeni',
      crowd: 'Öğleden gece yarısı sonrasına kadar yerel gençler ve gece atıştırmalığı arayanlarla akıcı tempo',
      dis: 'Gümbet sahil şeridinden içeride, Cevat Şakir geçiş aksında yer alır; manzaralı uzun oturum mekanı değildir ve yoğun sezon gecelerinde paket servis bekleme süreleri uzayabilir',
      transit: 'Cevat Şakir İsmet İnönü Caddesi No:58 D:c üzerinde Gümbet kavşağına yürüyüş mesafesinde',
      sources: [
        [
          'Restoranim.net — Pixel Burger Bodrum',
          'https://www.restoranim.net/',
          'community',
          'İsmet İnönü Cd. 58/C konumu, et pişirme dengesi, trüf sosları ve gece servisi değerlendirmeleri',
        ],
        [
          'Yemeksepeti — Pixel Burger Bodrum',
          'https://www.yemeksepeti.com/',
          'community',
          'Pixel Cheese Smash Burger, Animal Fries, Chaos Fries ve Tenders Box menü doğrulaması',
        ],
        [
          'Migros Yemek — Pixel Burger Bodrum',
          'https://www.migros.com.tr/',
          'community',
          'Aktif paket servis menüsü ve bağımsız Bodrum şube doğrulaması',
        ],
        [
          'Yandex Harita — Pixel Burger Bodrum',
          'https://yandex.com.tr/harita',
          'community',
          'Cevat Şakir İsmet İnönü Cd. No:58 konum ve ev yapımı burger geri bildirimleri',
        ],
        [
          'Pixel Burger Bodrum Resmi Instagram',
          'https://www.instagram.com/pixel.bodrum/',
          'operator',
          'Güncel burger çeşitleri ve işletme duyuruları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=17475806809686203154',
          'maps',
          'Cevat Şakir İsmet İnönü Cd. No:58 D:c konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Taze smash köfteleri, trüflü sosları ve çıtır patates çeşitleriyle zincir fast-food markalarından ayrışması',
        'Gece geç saatlere kadar açık kalarak Gümbet-Cevat Şakir hattında güvenilir sıcak yemek sunması',
      ],
      cons: [
        'Kompakt dükkan yapısı nedeniyle kalabalık gruplar için uzun süreli oturuma uygun değildir',
        'Yüksek sezon gecelerinde teslimat ve hazırlık sürelerinde gecikme yaşanabiliyor',
      ],
      unc: ['Sezon dışı dönemlerde gece kapanış saati günün yoğunluğuna göre erken çekilebiliyor'],
    }),

    // ==================== 3. KAHVE ====================
    // Gümbet sınırları içinde nitelikli kahve uzmanı kapılarını (Kapı 3B & Kapı 6/8) geçen işletme olmadığından kategori gizlenir.

    // ==================== 4. DATE MEKANLARI ====================
    compactSeed({
      id: 'annalivia-gumbet',
      placeId: 'ChIJnX7JErJtvhQRiSPgTHfd4Uc',
      cat: 'date',
      brand: 'annalivia',
      area: 'Şakir Esendemir Sk., Gümbet',
      signals: ['panoramik_gumbet_terasi', 'sakin_aksam_sofrasi', 'cikolatali_sufle_klasigi'],
      verifiedAt: '2026-11-16',
      desc: "Gümbet'in gürültülü barlar sokağından uzak ara sokakta, üst terasından koy manzarasına bakan modern ve sıcak aydınlatmalı akşam restoranı. İyi dinlendirilmiş bonfileleri, kuzu pirzolası, peynirli böreği ve taze çıkan çikolatalı suflesiyle çiftlerin baş başa akşam yemeği duraklarından biridir.",
      order: ['Annalivia Steak', 'Fırınlanmış Kuzu Pirzola', 'Peynirli Çıtır Börek'],
      menu: [
        'Annalivia Steak',
        'Bonfile Steak',
        'Kuzu Pirzola',
        'Paper Chicken',
        'Peynirli Börek',
        'Karides Kokteyl',
        'Çikolatalı Sufle & Limonlu Cheesecake',
        'Ev Şarapları',
      ],
      sec: [
        [
          'Çikolatalı Sufle',
          'Ana et yemeklerinin ardından taze pişmiş iç dokusuyla akşam masalarının en sık önerilen tatlı kapanışıdır.',
          'Holiday Hypermarket ve Restaurant Guru kayıtları',
        ],
        [
          'Karides Kokteyl & Paper Chicken',
          'Kırmızı et yerine hafif başlangıç veya kümes hayvanı tabağı tercih edenler için menüyü dengeler.',
          'Restaurant Guru menü içerikleri',
        ],
      ],
      seat: 'Panoramik Gümbet manzaralı kapalı teras ve sıcak aydınlatmalı sakin masa düzeni',
      crowd: 'Akşamları çiftler, yıldönümü kutlamaları ve sakin yemek arayan ailelerle huzurlu tempo',
      dis: 'Gümbet eğlence hattının dışında kaldığından deniz sıfırı yürüyüş yolu üzerinde değildir; yaz akşamlarında teras masaları için önceden rezervasyon gerekir',
      transit: 'Gümbet Mahallesi Şakir Esendemir Sokak No:6/B üzerinde yamaç ara sokak hattında',
      sources: [
        [
          'Holiday Hypermarket — Gümbet Yeme-İçme Rehberi',
          'https://www.holidayhypermarket.co.uk/',
          'editorial',
          'Teras manzarası, bonfile, kuzu pirzola, peynirli börek ve çikolatalı sufle incelemesi',
        ],
        [
          'Bodrum Holiday — Annalivia Restaurant',
          'https://www.bodrumholiday.com/',
          'editorial',
          'Gürültülü gece hayatından uzak, çiftlere uygun romantik yemek atmosferi detayı',
        ],
        [
          'Restaurant Guru — Annalivia Restaurant Gumbet',
          'https://restaurantguru.com/',
          'community',
          'Annalivia Steak, Paper Chicken, limonlu cheesecake ve servis kalitesi değerlendirmeleri',
        ],
        [
          'Yandex Harita — Annalivia Restaurant',
          'https://yandex.com.tr/harita',
          'community',
          'Şakir Esendemir Sk. No:6/B teras konumu ve akşam servisi geri bildirimleri',
        ],
        [
          'Annalivia Restaurant Resmi Sayfası',
          'https://www.facebook.com/annaliviarestaurant',
          'operator',
          'Aktif işletme duyuruları ve rezervasyon bilgisi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=5179664550913385353',
          'maps',
          'Şakir Esendemir Sk. No:6/B konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Karaoke ve bar gürültüsünden tamamen sıyrılmış manzaralı teras ve özenli tabak sunumu',
        'Bonfile ve kuzu pirzolanın yanında taze çikolatalı sufle gibi güçlü tatlı kapanışı sunması',
      ],
      cons: [
        'Yüksek sezonda teras masaları hızlı dolduğundan rezervasyonsuz yer bulmak zorlaşabiliyor',
        'Kumsal kıyısında değil yamaçtaki ara sokakta konumlanır',
      ],
      unc: ['Kış ve ara sezon dönemlerindeki açık kalma takvimi mevsime göre değişebiliyor'],
    }),
    compactSeed({
      id: 'mistral-bay-gumbet',
      placeId: 'ChIJ1TkvHK1tvhQRjyVC_gDLnb8',
      cat: 'date',
      brand: 'mistral bay',
      area: 'Melengeç Sk., Gümbet',
      signals: ['1990_koklu_sarap_evi', 'sakin_bahce_oturumu', 'ozel_bonfile_ve_levrek'],
      verifiedAt: '2026-11-16',
      desc: "1990 yılından bu yana Melengeç Sokak'ta hizmet veren, Gümbet'in gürültülü eğlence şeridinden ayrışan köklü steak ve şarap evi. Geniş bahçe ve iç salonunda iyi pişirilmiş bonfile ve antrikot çeşitlerini ızgara levrek ve şarap eşleşmeleriyle sunar.",
      order: ['Bonfile Steak', 'Ribeye Steak', 'Izgara Levrek'],
      menu: [
        'Bonfile Steak',
        'Ribeye Steak',
        'Kuzu Etleri & Karışık Izgara',
        'Izgara Levrek',
        'Kremalı Mantar Çorbası',
        'Ev Şarapları Seçkisi',
      ],
      sec: [
        [
          'Ev Şarapları & Kadeh Eşleşmeleri',
          'Et ve balık tabaklarıyla birlikte sunulan şarap listesi akşam buluşmalarının temel unsurudur.',
          'Restaurant Guru ve Yerels kayıtları',
        ],
        [
          'Kremalı Mantar Çorbası',
          'Steak öncesi hafif sıcak başlangıç tercih eden misafirlerin öne çıkardığı seçenektir.',
          'Restaurant Guru menü kayıtları',
        ],
      ],
      seat: 'Sakin Melengeç Sokak cephesinde geniş bahçe masaları ve klasik şarap evi iç salonu',
      crowd: 'Çiftler, uzun akşam yemeği tercih eden gruplar ve ailelerle dengeli ve nezih tempo',
      dis: 'Gümbet marinaları veya lüks otellere göre klasik bir steakhouse çizgisindedir; yüksek sezonda yoğun akşamlar için masa ayırtmak gerekir',
      transit: 'Gümbet Mahallesi Melengeç Sokak No:16 D:16 üzerinde sahil otelleri arka hattında',
      sources: [
        [
          'Düğün.com & Düğün Buketi — Mistral Bay 1990 Arşivi',
          'https://dugun.com/',
          'editorial',
          '1990 yılından beri süregelen bahçeli steak ve şarap evi işletmeciliği kaydı',
        ],
        [
          'Restaurant Guru — Mistral Bay Steak & Wine House',
          'https://restaurantguru.com/',
          'community',
          'Bonfile, ribeye, ızgara levrek ve mantar çorbası değerlendirmeleri',
        ],
        [
          'Meyhankoli — Mistral Bay Gümbet',
          'https://www.meyhankoli.com/',
          'community',
          'Melengeç Sk. konumu, nezih servis ve akşam yemeği deneyimi notları',
        ],
        [
          'Yandex Harita — Mistral Bay Steak & Wine House',
          'https://yandex.com.tr/harita',
          'community',
          'Melengeç Sk. No:16 D:16 konum ve şarap evi doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=13807415237713995151',
          'maps',
          'Melengeç Sk. No:16 D:16 konum ve steak_house doğrulaması',
        ],
      ],
      pros: [
        'Otuz yılı aşkın geçmişiyle Gümbet karmaşasından uzak düzenli bahçe steakhouse ortamı sunması',
        'Et kesimlerinin yanında taze levrek ve kapsamlı şarap eşleşmeleri barındırması',
      ],
      cons: [
        'Bölge ortalamasının üzerindeki et ve şarap kalemleri bütçe planlaması gerektirir',
        'Denize sıfır kumsal manzarası yerine bahçe ve sokak dokusu sunar',
      ],
      unc: ['Sezon dışında özel davet ve akşam servisi günleri dönemsel güncellenebiliyor'],
    }),
    compactSeed({
      id: 'the-colombia-gumbet',
      placeId: 'ChIJ-fROaq1tvhQRmLqXlNkIcEs',
      cat: 'date',
      brand: 'colombia',
      area: 'Mister Hadi Sk., Gümbet',
      signals: ['aile_isletmesi_steakhouse', 'sicak_balon_ekmek_ikrami', 'sakin_sokak_terasi'],
      verifiedAt: '2026-11-16',
      desc: "Mister Hadi Sokak'ta aile tarafından işletilen, karaoke veya gürültülü bar akışından uzak, doğrudan masa yemek odaklı steakhouse ve dünya mutfağı restoranı. Masaya ikram edilen sıcak balon ekmeğin ardından bonfile steak, fajita ve Hint körileriyle dengeli bir akşam sunar.",
      order: ['Bonfile Steak', 'Chicken Tikka Masala', 'Izgara Fajita'],
      menu: [
        'Bonfile Steak',
        'Sıcak Balon Ekmek & Dip Soslar',
        'Chicken Tikka Masala',
        'Et & Tavuk Fajita',
        'Makarna & Pizza Çeşitleri',
        'Vejetaryen Seçenekler',
      ],
      sec: [
        [
          'Sıcak Balon Ekmek & Dip Soslar',
          'Ana sipariş öncesinde fırından yeni çıkmış haliyle masaya ikram edilen imza başlangıçtır.',
          'Wanderlog ve Restaurant Guru kayıtları',
        ],
        [
          'Vejetaryen & Hint Köri Seçenekleri',
          'Steak menüsünün yanında farklı damak tatlarına sahip çiftler ve gruplar için esneklik sağlar.',
          'Yandex Harita ve Restaurant Guru menüsü',
        ],
      ],
      seat: 'Mister Hadi Sokak üzerinde ferah açık teras masaları ve düzenli iç salon',
      crowd: 'Sakin akşam yemeği arayan çiftler ve güler yüzlü aile işletmesi ortamı seven gruplarla rahat tempo',
      dis: 'Saf tek mutfaklı bir et restoranı yerine steakhouse ile Hint ve dünya mutfağını aynı menüde toplar; yaz akşamlarında sokak terası erken dolabilir',
      transit: 'Gümbet Mahallesi Mister Hadi Sokak No:6 üzerinde sahil yakını sakin sokakta',
      sources: [
        [
          'Bodrumdayız — The Colombia Gümbet Rehberi',
          'https://www.bodrumdayiz.com/',
          'editorial',
          'Mister Hadi Sokak konumu ve Gümbet steakhouse tavsiyesi',
        ],
        [
          'Wanderlog — The Colombia Restoran Steak House',
          'https://wanderlog.com/',
          'community',
          'Taze balon ekmek ikramı, bonfile steak ve Chicken Tikka Masala değerlendirmeleri',
        ],
        [
          'Restaurant Guru — The Colombia Restoran',
          'https://restaurantguru.com/',
          'community',
          'Aile işletmesi ilgisi, adil fiyatlandırma ve karaoke barlardan ayrılan yemek odaklı ortam',
        ],
        [
          'Yandex Harita — The Colombia Restoran',
          'https://yandex.com.tr/harita',
          'community',
          'Mister Hadi Sk. No:6 konum ve steakhouse doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=5435854480830085784',
          'maps',
          'Mister Hadi Sk. No:6 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Gümbet barlar sokağı karmaşasından uzak, yüksek sesli eğlence olmadan rahat akşam yemeği sunması',
        'Sıcak balon ekmek ikramı ve aile işletmesi sıcaklığıyla makul fiyat-kalite dengesi yakalaması',
      ],
      cons: [
        'Çok geniş yelpazeli dünya menüsü nedeniyle saf butik et lokantası arayanlara eklektik gelebilir',
        'Yoğun yaz akşamlarında teras masalarında yer beklemek gerekebiliyor',
      ],
      unc: ['Sabahtan gece geç saatlere uzanan çalışma takvimi sezon geçişlerinde kısalabiliyor'],
    }),
    compactSeed({
      id: 'iconic-beach-gumbet',
      placeId: 'ChIJDauLUoxtvhQRqsZMlbI4v2Y',
      cat: 'date',
      brand: 'iconic',
      area: 'Kaşif Ertekin Sk. (Asarlık), Gümbet',
      signals: ['asarlik_koyu_ahsap_iskele', 'gun_batimi_kokteyl_ve_bistro', 'akdeniz_plaj_mutfagi'],
      verifiedAt: '2026-11-16',
      desc: "Gümbet'in batı ucundaki Asarlık Koyu'nda ahşap iskelesi, bohem-modern tasarımı ve Akdeniz bistro mutfağıyla öne çıkan sahil restoranı ve beach club. Gün batımına doğru taş fırın flatbread pizzalar, tavuk quesadilla ve imza kokteyllerle deniz kıyısı buluşması sunar.",
      order: ['Taş Fırın Flatbread Pizza', 'Tavuk Quesadilla', 'Günlük Deniz Ürünleri & Ege Tabakları'],
      menu: [
        'Flatbread & Odun Fırını Pizzalar',
        'Tavuk Quesadilla',
        'Gurme Burgerler',
        'Günlük Deniz Ürünleri',
        'İmza Kokteyller & Detoks İçecekleri',
        'Cheesecake & Baklava',
      ],
      sec: [
        [
          'İmza Kokteyller & Gün Batımı Servisi',
          'Akşamüstü iskele ve sahil masalarında gün batımı eşliğinde sunulan bar seçkisidir.',
          'OGGUSTO Bodrum Asarlık rehberi',
        ],
        [
          'Cheesecake & Tatlı Alternatifleri',
          'Bistro öğünlerinin ardından sahil ve teras masalarında tercih edilen tatlı eşlikçisidir.',
          'Wanderlog ziyaretçi geri bildirimleri',
        ],
      ],
      seat: 'Asarlık Koyu kıyısında ince kumlu plaj, ahşap iskele ve bohem tarzda açık hava restoran masaları',
      crowd: 'Gündüz sakin deniz misafirleri, gün batımında DJ ve saksafon eşliğinde sosyal çiftler ve gruplar',
      dis: 'Çok yüksek bütçe segmentindedir; plaj bölümünde minimum harcama limiti ile servis ücreti uygulanabilir ve deniz tabanı yer yer taşlı yapıdadır',
      transit: 'Gümbet Asarlık Mevkii Kaşif Ertekin Sokak 12/7 adresinde Bitez sınır koyunda',
      sources: [
        [
          'OGGUSTO — Iconic Beach Bodrum İncelemesi',
          'https://www.oggusto.com/',
          'editorial',
          'Asarlık mevkii ince kumlu plaj, ahşap iskele ve gün batımı DJ/saksafon atmosferi',
        ],
        [
          'Wanderlog — Iconic Beach Bodrum',
          'https://wanderlog.com/',
          'community',
          'Tavuk quesadilla, cheesecake, güler yüzlü servis ve yüksek fiyat/servis bedeli notları',
        ],
        [
          'MenüHaritası — Iconic Beach Asarlık',
          'https://menuharitasi.com/',
          'community',
          'Akdeniz ve Ege plaj bistro menü kapsamı',
        ],
        [
          'Iconic Bodrum Resmi Sitesi',
          'https://iconicbodrum.com/',
          'operator',
          'Asarlık Koyu konum, dijital menü ve plaj-restoran hizmeti',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=7403698652080555690',
          'maps',
          'Kaşif Ertekin Sk. 12/7 Asarlık konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Gümbet merkez karmaşasından uzakta, Asarlık Koyu üzerinde iskele ve gün batımı manzarası sunması',
        'Plaj bistrosu standardının üzerinde düzenli servis ve modern tasarım çizgisi',
      ],
      cons: [
        'Üst segment fiyatlama, harcama limiti ve ek servis bedeli nedeniyle bütçe açısından yüksektir',
        'Akşamüstü DJ performansı sessiz ve baş başa bir ortam arayanlara hareketli gelebilir',
      ],
      unc: ['Sezon içi minimum harcama ve loca koşulları dönemsel olarak işletme tarafından güncelleniyor'],
    }),

    // ==================== 6. MUTLAKA DENEMELİSİN ====================
    compactSeed({
      id: 'gumbet-dragon',
      placeId: 'ChIJ-XyBsI1tvhQRDq9LwDSWgEE',
      cat: 'denemelisin',
      brand: 'gumbet dragon',
      area: 'Ayaz Cd., Gümbet',
      signals: ['1989_kuruluslu_uzak_dogu', 'cin_hint_ve_sushi_bar', 'teras_ve_bahce_oturumu'],
      verifiedAt: '2026-11-16',
      desc: "1989 yılından bu yana Ayaz Caddesi'nde Bülent Işık öncülüğünde hizmet veren, Gümbet'in otuz beş yıllık köklü Uzak Doğu ve Hint mutfağı kurumu. Çin wok tabakları ve aromatik Hint körilerinin yanında ayrı bir sushi bar bölümüyle taze roll ve maki çeşitleri sunar.",
      order: ['Special Mixed Hint Körisi', 'Tatlı Ekşi Soslu Wok Tavuk', 'Salmon Philadelphia Sesame Sushi'],
      menu: [
        'Salmon Philadelphia Sesame & Maki Roll',
        'Special Mixed Curry (Hint Körisi)',
        'Tandoori Spesiyalleri',
        'Tatlı Ekşi & Acılı Wok Çeşitleri',
        'Chow Mein Noodle',
        'Uzak Doğu Çorbaları',
      ],
      sec: [
        [
          'Salmon Avocado Maki & Sushi Setleri',
          'Wok ve köri ana yemeklerinin yanında ayrı sushi bar bölümünde günlük taze hazırlanır.',
          'Yemeksepeti ve gumbetdragon.com menü kayıtları',
        ],
        [
          'Chow Mein Noodle & Wok Tabakları',
          'Sebzeli veya etli klasik Çin wok tekniğiyle pişirilen paylaşmalık ana tabaklardır.',
          'gumbetdragon.com ve Yemeksepeti kayıtları',
        ],
      ],
      seat: 'Ayaz Caddesi üzerinde samimi iç salon ve sıcak akşam atmosferine sahip teras oturumu',
      crowd: 'Yıllardır gelen müdavimler, Asya mutfağı arayan tatilciler ve kalabalık ailelerle canlı ama düzenli tempo',
      dis: 'Geleneksel Türk mutfağı yerine Asya ve Hint füzyonu arayanlara hitap eder; yüksek sezon akşamlarında doluluk nedeniyle rezervasyon önerilir',
      transit: 'Gümbet Mahallesi Ayaz Caddesi No:41/A üzerinde (Gümbet içi ücretsiz servis olanağıyla)',
      sources: [
        [
          'Bodrum Mekan Rehberi — Gümbet Dragon',
          'https://www.bodrummekanrehberi.com/',
          'editorial',
          'Ayaz Cd. No:41/A konumu ve köklü Çin-Hint-Sushi mutfağı tanıtımı',
        ],
        [
          'Restaurant Guru — Gümbet Dragon',
          'https://restaurantguru.com/',
          'community',
          'Köri çeşitleri, sushi bar, sıcak ev sahipliği ve porsiyon-fiyat dengesi değerlendirmeleri',
        ],
        [
          'Yemeksepeti — Gümbet Dragon Menü',
          'https://www.yemeksepeti.com/',
          'community',
          'Salmon Philadelphia Sesame, Salmon Avocado Maki ve Chow Mein menü doğrulaması',
        ],
        [
          'Yandex Harita — Gümbet Dragon',
          'https://yandex.com.tr/harita',
          'community',
          'Ayaz Cd. No:41/A konum ve Asya mutfağı geri bildirimleri',
        ],
        [
          'Gümbet Dragon Resmi Web Sitesi',
          'https://www.gumbetdragon.com/',
          'operator',
          '1989 kuruluş yılı, Bülent Işık yönetimi ve güncel menü doğrulanması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=4719937562792931086',
          'maps',
          'Ayaz Cd. No:41/A konum ve chinese_restaurant doğrulaması',
        ],
      ],
      pros: [
        '1989 yılından beri aynı adreste istikrarını koruyan nadir Gümbet Uzak Doğu ve Hint mutfağı klasiği olması',
        'Çin wok, Hint körisi ve taze sushi bar seçeneklerini aynı çatı altında yüksek memnuniyetle sunması',
      ],
      cons: [
        'Yaz sezonunun yoğun akşamlarında masa bekleme süresi yaşanabiliyor',
        'Türk mezeleri ve deniz ürünü klasiklerinden ziyade baharatlı Asya mutfağına odaklanır',
      ],
      unc: ['Sezon dışı kış aylarındaki çalışma günleri işletme takvimine göre değişebiliyor'],
    }),
    compactSeed({
      id: 'hane-ocakbasi-gumbet',
      placeId: 'ChIJJTnkLBJtvhQRh8xXIynS9yk',
      cat: 'denemelisin',
      brand: 'hane',
      area: 'Ayaz Cd., Gümbet',
      signals: ['komur_atesi_ocakbasi', 'diyarbakir_usulu_ciger_sis', 'taze_meze_ve_lavas'],
      verifiedAt: '2026-11-16',
      desc: "Gümbet Ayaz Caddesi üzerinde kömür ateşi ocakbaşı kültürünü yaşatan mahalle ve tatil beldesi restoranı. Adana kebap ve patlıcanlı kebabın yanında Diyarbakır usulü ciğer şişi, günlük mezeleri ve soslu ekmekleriyle akşam yemeğinde doyurucu bir kebap durağıdır.",
      order: ['Adana Kebap', 'Diyarbakır Usulü Ciğer Şiş', 'Patlıcanlı Kebap'],
      menu: [
        'Adana & Urfa Kebap',
        'Diyarbakır Usulü Ciğer Şiş',
        'Patlıcanlı Kebap',
        'Tavuk Şiş & Izgara Etler',
        'Lahmacun',
        'Günlük Meze & Soslu Ekmekler',
      ],
      sec: [
        [
          'Tavuk Şiş & Lahmacun',
          'Kırmızı et ve ciğer seçeneklerinin yanında hafif veya paylaşımlı sipariş arayan masalarda öne çıkar.',
          'Restoranim.net ve Restaurant Guru kayıtları',
        ],
        [
          'Günlük Soğuk Mezeler & Soslu Lavaş',
          'Kömür ateşinden çıkan kebaplara eşlik eden taze başlangıçlardır.',
          'MyGuideBodrum ve Yandex Harita kayıtları',
        ],
      ],
      seat: 'Ayaz Caddesi cephesinde açık hava masaları ve ocakbaşı ateşi etrafında samimi iç salon',
      crowd: 'Öğleden gece yarısına kadar aileler, yerel çalışanlar ve kebap gruplarıyla hareketli tempo',
      dis: 'Gümbet merkez caddesinde yer aldığından deniz manzarası sunmaz; yoğun yaz akşamlarında servis hızı yavaşlayabileceği için rezervasyon faydalıdır',
      transit: 'Gümbet Mahallesi Ayaz Caddesi No:77 B02 üzerinde merkezi yürüyüş aksında',
      sources: [
        [
          'MyGuideBodrum — Hane Ocakbaşı Gümbet',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Ayaz Cd. No:77 B02 adresi, ocakbaşı düzeni ve Bodrum ortalamasına göre makul fiyat notu',
        ],
        [
          'Restaurant Guru — Hane Ocakbaşı Gümbet',
          'https://restaurantguru.com/',
          'community',
          'Adana kebap, patlıcanlı kebap ve lahmacun lezzet geri bildirimleri',
        ],
        [
          'Restoranim.net — Hane Ocakbaşı',
          'https://www.restoranim.net/',
          'community',
          'Tavuk şiş, et pişirme kalitesi ve ilgili personel değerlendirmeleri',
        ],
        [
          'Yandex Harita — Hane Ocakbaşı',
          'https://yandex.com.tr/harita',
          'community',
          'Diyarbakır usulü ciğer şiş ve taze meze övgüleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=3024116748931026055',
          'maps',
          'Ayaz Cd. No:77 B02 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Kömür ateşinde pişen Diyarbakır usulü ciğer şiş, Adana ve patlıcanlı kebapta yüksek istikrar sağlaması',
        'Turistik fiyat şişirmelerinden uzak, doyurucu ve ulaşılabilir ocakbaşı deneyimi sunması',
      ],
      cons: [
        'Yüksek yaz sezonunda akşam yoğunluğu nedeniyle masa bulma ve servis süresi uzayabiliyor',
        'Cadde üzerinde bulunduğu için manzara veya sessiz bahçe beklentisine hitap etmez',
      ],
      unc: ['Yoğun sezon dışındaki çalışma saatleri dönemsel esneklik gösterebiliyor'],
    }),
    compactSeed({
      id: 'bodrum-kalabalik-ocakbasi',
      placeId: 'ChIJy9YszeJtvhQRlC0aTYHT83k',
      cat: 'denemelisin',
      brand: 'kalabalık',
      area: 'İsmet İnönü Cd., Gümbet',
      signals: ['cag_ve_adana_kebap', 'kelle_paca_corbasi', 'gece_gec_saat_ocakbasi'],
      verifiedAt: '2026-11-16',
      desc: "Gümbet'in Cevat Şakir geçiş kapısı İsmet İnönü Caddesi'nde yer alan; kömür ateşinde Adana ve cağ kebabının yanında çıtır lahmacunu, pide çeşitleri, kelle paça çorbası ve masaya gelen zengin ikram mezeleriyle gece geç saatlere kadar hizmet veren esnaf ocakbaşısı.",
      order: ['Adana Kebap', 'Cağ Kebap', 'Lahmacun & Pide'],
      menu: [
        'Adana Kebap',
        'Cağ Kebap',
        'Tavuk Kanat & Şiş',
        'Lahmacun & Kuşbaşılı Pide',
        'Kelle Paça & Mercimek Çorbası',
        'Acılı Ezme, Haydari & Soslu Ekmek',
      ],
      sec: [
        [
          'Kelle Paça & Mercimek Çorbası',
          'Gece geç saatlere uzanan servisi boyunca sıcak çorba arayan misafirlerin öncelikli tercihidir.',
          'Yemeksepeti menü kayıtları',
        ],
        [
          'İkram Ezme, Haydari & Soslu Ekmek',
          'Ana kebap siparişinin yanında masaya taze getirilen geleneksel ocakbaşı eşlikçileridir.',
          'Yemeksepeti ve Wanderlog kayıtları',
        ],
      ],
      seat: 'İsmet İnönü Caddesi üzerinde sade, ferah esnaf ocağı salonu ve hızlı servis düzeni',
      crowd: 'Öğle esnafından gece geç saatte kebap ve çorba arayan müdavimlere kesintisiz akış',
      dis: 'Geleneksel esnaf ocakbaşısı atmosferi sunar; romantik akşam yemeği veya sahil manzarası arayanlar için tasarlanmamıştır',
      transit: 'Gümbet Mahallesi İsmet İnönü Caddesi No:5 D:A üzerinde Özükara Apart karşısında',
      sources: [
        [
          'Müdavim.net — Kalabalık Ocakbaşı Bodrum',
          'https://www.mudavim.net/',
          'editorial',
          'Geleneksel ocakbaşı kültürü ve Bodrum kebap seçkisi değerlendirmesi',
        ],
        [
          'Yemeksepeti — Bodrum Kalabalık Ocakbaşı',
          'https://www.yemeksepeti.com/',
          'community',
          'Adana, cağ kebap, lahmacun, kelle paça çorbası ve soslu ekmek ikramları',
        ],
        [
          'Restaurant Guru — Bodrum Kalabalık Ocakbaşı',
          'https://restaurantguru.com/',
          'community',
          'Et lezzeti, hızlı servis ve gece açık olma avantajı geri bildirimleri',
        ],
        [
          'Yandex Harita — Kalabalık Ocakbaşı',
          'https://yandex.com.tr/harita',
          'community',
          'İsmet İnönü Cd. No:5 konum ve ikram mezeleri doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=8787599850227772820',
          'maps',
          'İsmet İnönü Cd. No:5 D:A konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Adana, cağ kebap, lahmacun ve kelle paça çorbasını aynı çatı altında gece geç saatlere dek sunması',
        'Zengin ikram mezeleri ve soslu ekmekleriyle güçlü fiyat-performans dengesi sağlaması',
      ],
      cons: [
        'Ana cadde üzerinde esnaf lokantası düzeninde olduğundan romantik veya manzaralı oturum sunmaz',
        'Çırkan yerleşimindeki Kalabalık Meyhane şubesiyle isim benzerliği nedeniyle karıştırılabiliyor',
      ],
      unc: ['Cağ kebap şişinin günlük tükenme saatleri talebe göre değişebiliyor'],
    }),
    compactSeed({
      id: 'konya-ugurlu-gumbet',
      placeId: 'ChIJ89BuELJtvhQRajOmqnn9WRk',
      cat: 'denemelisin',
      brand: 'konya uğurlu',
      area: 'Ayaz Cd., Gümbet',
      signals: ['tas_firin_etli_ekmek', 'aile_isletmesi_mutfagi', 'dondurmali_katmer'],
      verifiedAt: '2026-11-16',
      desc: "Ayaz Caddesi üzerinde aile tarafından işletilen, Gümbet'te Konya mutfağının ince hamurlu etli ekmeğini, bıçakarasını ve Mevlana pidesini taş fırından sıcak çıkaran köklü pide ve kebap salonu. Kapanışta sunduğu dondurmalı katmer ile de öne çıkar.",
      order: ['Konya Etli Ekmek', 'Bıçakarası Pide', 'Mevlana Pidesi'],
      menu: [
        'Etli Ekmek',
        'Bıçakarası Pide',
        'Mevlana Pidesi',
        'Kaşarlı & Kuşbaşılı Pide',
        'Lahmacun & Adana Kebap',
        'Dondurmalı Katmer & Künefe',
      ],
      sec: [
        [
          'Dondurmalı Katmer & Künefe',
          'Etli ekmek ve pide sonrasında paylaşılan çıtır fırın tatlısı olarak en sık tavsiye edilen kapanıştır.',
          'Wanderlog misafir değerlendirmeleri',
        ],
        [
          'Adana Kebap & Izgara Köfte',
          'Pide dışında sıcak kömür ızgarası arayan aile masaları için menüyü tamamlar.',
          'Yemeksepeti ve Yandex Harita kayıtları',
        ],
      ],
      seat: 'Ayaz Caddesi cephesinde temiz, ferah ve aile dostu açık-kapalı restoran masaları',
      crowd: 'Öğle ve akşam saatlerinde yerel halk, aileler ve makul fiyatlı Türk mutfağı arayan tatilciler',
      dis: 'Gümbet ana caddesi üzerinde kaldığından manzara sunmaz; yoğun yaz akşamlarında taş fırın siparişlerinde servis temposu yavaşlayabiliyor',
      transit: 'Gümbet Mahallesi Ayaz Caddesi No:79 üzerinde merkezi yürüyüş aksında',
      sources: [
        [
          'Restoranim.net — Konya Uğurlu Restorant Gümbet',
          'https://www.restoranim.net/',
          'community',
          'Aile işletmesi samimiyeti, temizlik ve Bodrum ortalamasına göre makul fiyat notları',
        ],
        [
          'Wanderlog — Konya Uğurlu Restaurant',
          'https://wanderlog.com/',
          'community',
          'Etli ekmek, Mevlana pidesi, dondurmalı katmer ve aile işletmeciliği övgüleri',
        ],
        [
          'Yemeksepeti — Konya Uğurlu Restorant',
          'https://www.yemeksepeti.com/',
          'community',
          'Bıçakarası, etli ekmek, lahmacun ve kaşarlı pide menü doğrulaması',
        ],
        [
          'Restaurant Guru — Konya Uğurlu',
          'https://restaurantguru.com/',
          'community',
          'Ayaz Cd. No:79 konumu ve pide kalitesi değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=1826769822871335786',
          'maps',
          'Ayaz Cd. No:79 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'İnce hamurlu otantik Konya etli ekmeği, bıçakarası ve dondurmalı katmerde tutarlı fırın kalitesi',
        'Gümbet turistik fiyatlarına karşı şeffaf ve adil fiyat politikası izleyen aile işletmesi olması',
      ],
      cons: [
        'Yoğun akşam saatlerinde taş fırın ve kurye yoğunluğu nedeniyle servis hızı düşebiliyor',
        'Cadde konumu nedeniyle sahil veya bahçe atmosferi sunmaz',
      ],
      unc: ['Sezon dışı kış dönemlerinde akşam kapanış saatleri talebe göre erken çekilebiliyor'],
    }),
    compactSeed({
      id: 'baki-ustanin-yeri-gumbet',
      placeId: 'ChIJrxTn_4ZtvhQRHQ3YZP1Om0s',
      cat: 'denemelisin',
      brand: 'baki',
      area: 'İsmet İnönü Cd., Gümbet',
      signals: ['komur_izgara_kanat', 'soslu_lavas_ve_taze_salata', 'aile_lokantasi'],
      verifiedAt: '2026-11-16',
      desc: "İsmet İnönü Caddesi üzerinde yerel halkın Kanatçı Baki Usta olarak da bildiği samimi aile ızgara salonu. Kömür ateşinde nar gibi kızaran tavuk kanat ve kelebek çeşitlerini soslu lavaş, ev usulü taze salata ve Adana-Urfa kebaplarla birlikte sıcak servis eder.",
      order: ['Kömürde Tavuk Kanat', 'Tavuk Kelebek & Pirzola', 'Adana Kebap'],
      menu: [
        'Tavuk Kanat & Kelebek',
        'Tavuk Pirzola & Şiş',
        'Adana & Urfa Kebap',
        'Izgara Köfte & Çökertme Kebabı',
        'Soslu Lavaş & Ev Usulü Salata',
        'Kiloluk Pişmiş Izgara',
      ],
      sec: [
        [
          'Çökertme Kebabı & Izgara Köfte',
          'Tavuk kanat uzmanlığının yanında yerel Ege ve klasik et tabağı tercih edenler için öne çıkar.',
          'Yandex Harita ve Restaurant Guru kayıtları',
        ],
        [
          'Soslu Lavaş & Ev Usulü Taze Salata',
          'Tüm ızgara ve kanat siparişlerinin yanında sıcak ve bol porsiyonlu sunulan imzalı eşlikçidir.',
          'Yemeksepeti ve Restoranim.net geri bildirimleri',
        ],
      ],
      seat: 'İsmet İnönü Caddesi üzerinde sade ve temiz esnaf-aile restoranı masa düzeni',
      crowd: 'Öğle ve akşam öğünlerinde Gümbet sakinleri, aileler ve sıcak kanat-ızgara arayan müdavimler',
      dis: 'Basit bir mahalle ızgara salonudur; alkollü gece ambiyansı veya manzara sunmaz ve akşam yoğun saatlerinde paket servislerde kısa gecikmeler olabilir',
      transit: 'Gümbet Mahallesi İsmet İnönü Caddesi No:28 üzerinde ana cadde hattında',
      sources: [
        [
          'Yemeksepeti — Baki Ustanın Yeri (Kanatçı Baki Usta)',
          'https://www.yemeksepeti.com/',
          'community',
          'Tavuk kanat, kelebek, pirzola, Adana kebap ve soslu lavaş menü doğrulaması',
        ],
        [
          'Restoranim.net — Baki Ustanın Yeri',
          'https://www.restoranim.net/',
          'community',
          'Kanat pişirme dengesi, sıcak servis ve ev usulü salata memnuniyeti',
        ],
        [
          'Restaurant Guru — Baki Ustanın Yeri Gümbet',
          'https://restaurantguru.com/',
          'community',
          'Çökertme kebabı, mantı seçenekleri ve aile lokantası ortamı değerlendirmeleri',
        ],
        [
          'Yandex Harita — Baki Ustanın Yeri',
          'https://yandex.com.tr/harita',
          'community',
          'İsmet İnönü Cd. No:28 adres ve ızgara çeşitleri doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=5448035024460320029',
          'maps',
          'İsmet İnönü Cd. No:28 konum ve family_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Kömür ızgarasında pişen tavuk kanat, kelebek ve pirzolada yerel müdavimlerin güvendiği esnaf noktası olması',
        'Soslu lavaşı ve ev usulü taze salatasıyla doyurucu ve gösterişsiz lezzet sunması',
      ],
      cons: [
        'Mütevazı dekorasyonu nedeniyle özel akşam kutlaması yerine pratik ve lezzet odaklı öğünlere uygundur',
        'Yoğun akşam saatlerinde paket sipariş yoğunluğu servis süresini etkileyebiliyor',
      ],
      unc: ['Sezon dışı dönemlerde kiloluk pişmiş sipariş ve kapanış saatleri dönemsel değişebiliyor'],
    }),
    compactSeed({
      id: 'kozhan-et-doner-gumbet',
      placeId: 'ChIJwy9453ptvhQR2fHXLl3ge5Q',
      cat: 'denemelisin',
      brand: 'közhan',
      area: 'İsmet İnönü Cd., Gümbet',
      signals: ['kozde_et_doner', 'gramaj_secenekli_porsiyon', 'hizli_esnaf_servisi'],
      verifiedAt: '2026-11-16',
      desc: "İsmet İnönü Caddesi ile Gara Hasan Caddesi kesişiminde köz ateşinde ağır ağır pişen et döner sunan küçük yerel dönerci. Seksen gramdan duble porsiyon ve kiloluk servislere uzanan gramaj seçenekleriyle gün içi hızlı ve sıcak bir et döner molası sunar.",
      order: ['Porsiyon Közde Et Döner', 'Ekmek Arası Et Döner', 'Lavaş Dürüm Et Döner'],
      menu: [
        'Porsiyon & Duble Közde Et Döner',
        'Ekmek Arası Et Döner (80–140 gr)',
        'Lavaş Dürüm Et Döner',
        'Kiloluk Közde Et Döner',
        'Fırın Sütlaç',
      ],
      sec: [
        [
          'Kiloluk Közde Et Döner',
          'Kalabalık masalar ve ev tipi paylaşım siparişleri için gramajlı olarak hazırlanan seçenektir.',
          'Yemeksepeti menü kayıtları',
        ],
        [
          'Fırın Sütlaç',
          'Et döner öğününün ardından sunulan tek geleneksel sütlü tatlı eşlikçisidir.',
          'Yemeksepeti tatlı menüsü',
        ],
      ],
      seat: 'Küçük esnaf dükkanı içinde sınırlı masa düzeni ve paket servis tezgahı',
      crowd: 'Öğle saatlerinden akşama kadar bölge çalışanları ve esnaf döner arayan yerel sakinlerle pratik tempo',
      dis: 'Günün geç saatlerine kalındığında lavaş veya döner stoğu tükenebiliyor; bazı paket servis geri bildirimlerinde ambalajda yağ sızması ve porsiyon hassasiyeti not edilmiştir, gece geç saatlere kadar açık değildir',
      transit: 'Gümbet Mahallesi İsmet İnönü Caddesi 3/2 (Gara Hasan Cd. kesişimi, Özükara Apart karşısı)',
      sources: [
        [
          'Yemeksepeti — Közhan Et Döner Bodrum',
          'https://www.yemeksepeti.com/',
          'community',
          'Gramajlı et döner menüsü, fırın sütlaç ve ambalaj/lavaş stoğu üzerine gerçek kullanıcı geri bildirimleri',
        ],
        [
          'Yerel Esnaf — Közhan Et Döner Bodrum',
          'https://www.yerelesnaf.com/',
          'community',
          'Bodrum yerel esnaf vitrini kaydı ve gündüz servis çalışma düzeni',
        ],
        [
          'Değermi — Közhan Et Döner (Köz-Han)',
          'https://degermi.com/',
          'community',
          'Közde et döner lezzeti ve Bodrum ortalamasına göre makul fiyat-performans notları',
        ],
        [
          'Yandex Harita — Közhan Et Döner Bodrum',
          'https://yandex.com.tr/harita',
          'community',
          'Gara Hasan Cd. / İsmet İnönü Cd. konumu ve közde döner değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=10699392030571229657',
          'maps',
          'İsmet İnönü Cd. 3/2 konum ve turkish_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Köz ateşinde pişen gerçek et döneri seçilebilir gramaj opsiyonlarıyla sunması',
        'Bodrum merkez ve sahil bandına kıyasla ulaşılabilir esnaf fiyatlarında kalması',
      ],
      cons: [
        'Küçük esnaf dükkanı olduğundan oturma kapasitesi sınırlıdır ve akşam erken saatlerde kapanır',
        'Yoğun günlerde lavaş stoğu bitebiliyor ve paket serviste ambalaj sızması yaşanabiliyor',
      ],
      unc: ['Pazar günleri ve sezon dışı dönemlerde açık olma durumu işletme kararına göre değişebiliyor'],
    }),

    // ==================== 7. BALIKÇILAR & DENİZ ÜRÜNLERİ ====================
    // Gümbet sınırları içinde ≥4.4 / ≥35 eşiklerini karşılayan bağımsız kıyı balıkçısı bulunmadığından kategori dinamik gizlenir (Yoksa Gösterme).

    // ==================== NEGATIVE CONTROLS (POLİTİKA KAPISI DENETİMİ) ====================
    // Kapı 2 — Zincir & Franchise Kontrolleri
    negControl(
      'ctrl-gumbet-burger-king',
      'ChIJcW5euK1tvhQR3oJF-o3Nfzs',
      'hamburger',
      'Kapı 2 & Kapı 6 ihlali: Burger King - Gümbet küresel fast-food zinciri (CHAIN_BLOCKLIST: burger king) ve ★2.9 puanı'
    ),
    negControl(
      'ctrl-gumbet-mcdonalds',
      'ChIJ0XvmG_5rvhQRWh8ME4a5Lc8',
      'hamburger',
      "Kapı 2, Kapı 4 & Kapı 6 ihlali: McDonald's Bodrum Gümbet küresel fast-food zinciri (CHAIN_BLOCKLIST: mcdonald), Yeniköy sınır dışı ve ★3.9 puanı"
    ),
    negControl(
      'ctrl-gumbet-little-caesars',
      'ChIJGV-V5t1tvhQRdnXGmYS0Q-M',
      'pizza',
      'Kapı 2, Kapı 4 & Kapı 6 ihlali: Little Caesars Bodrum Gümbet Şubesi pizza zinciri (CHAIN_BLOCKLIST: little caesars), Çırkan sınır dışı ve ★3.3 puanı'
    ),
    negControl(
      'ctrl-gumbet-dominos',
      'ChIJgUNzlBZsvhQRjtHTiwm_5EA',
      'pizza',
      "Kapı 2, Kapı 4 & Kapı 6 ihlali: Domino's Pizza Bodrum pizza zinciri (CHAIN_BLOCKLIST: domino's), Cumhuriyet sınır dışı ve ★3.2 puanı"
    ),
    negControl(
      'ctrl-gumbet-royal-pastanesi',
      'ChIJ87qdVn5tvhQR0mTzUnXh6EM',
      'kahve',
      'Kapı 2, Kapı 3B & Kapı 6 ihlali: Royal Pastanesi Gümbet 2 Şube çok şubeli pastane zinciri (CHAIN_BLOCKLIST: royal pastanesi), pastry_shop türü ve 15 değerlendirme'
    ),
    negControl(
      'ctrl-gumbet-pizza-locale',
      'ChIJIYcF3BFtvhQRk7zR0P7uf7s',
      'pizza',
      'Kapı 2 & Kapı 4 ihlali: Pizza Locale Bodrum çok şubeli pizza zinciri (CHAIN_BLOCKLIST: pizza locale) ve Çırkan sınır dışı'
    ),
    negControl(
      'ctrl-gumbet-starbucks-oasis',
      'ChIJJ33K-kpsvhQRgzVndDSU5O4',
      'kahve',
      'Kapı 2, Kapı 4 & Kapı 6 ihlali: Starbucks küresel kahve zinciri (CHAIN_BLOCKLIST: starbucks), Cumhuriyet/Oasis sınır dışı ve ★4.2 puanı'
    ),
    negControl(
      'ctrl-gumbet-cookshop',
      'ChIJ0RMgHkNxvhQRAkmWVjZ7jI8',
      'denemelisin',
      'Kapı 2, Kapı 4 & Kapı 6 ihlali: Bodrum Cookshop zinciri (CHAIN_BLOCKLIST: cookshop), Merkez Yat Limanı sınır dışı ve ★4.2 puanı'
    ),
    negControl(
      'ctrl-gumbet-maharet-manti-chain',
      'ChIJsWsEHfFtvhQRpo1oVCfmwlQ',
      'denemelisin',
      'Kapı 2 ihlali (CHAIN_BLOCKLIST adayı: maharet manti / maharet mantı): İzmir, Ankara, Antalya, Manisa ve Bodrum şubeli çok şehirli franchise mantı zinciri'
    ),
    negControl(
      'ctrl-gumbet-oses-cigkofte-chain',
      'ChIJC1Yol2ZtvhQRy--3N2HZYxs',
      'denemelisin',
      'Kapı 2 & Kapı 6 ihlali (CHAIN_BLOCKLIST adayı: oses): Oses Çiğ Köfte ulusal franchise zinciri, ★3.9 puanı ve 18 değerlendirme'
    ),

    // Kapı 3 — Tür Dışı (Turistik Nokta) Kontrolü
    negControl(
      'ctrl-gumbet-sahil-invalid-type',
      'ChIJXaPcSaxtvhQRhQlI7BCVWhg',
      'denemelisin',
      'Kapı 3 & Kapı 6 ihlali: Gümbet Sahil birincil türü tourist_attraction (FOOD_PLACE_TYPES dışında) ve ★3.9 puanı'
    ),

    // Kapı 6 — Kalite Eşiği (<4.4) ve Yetersiz Değerlendirme (<35) Kontrolleri
    negControl(
      'ctrl-gumbet-konya-nergiz-low',
      'ChIJHdQrub9tvhQRs2gVrVEhELc',
      'denemelisin',
      'Kapı 6 ihlali: Konya Nergiz ★4.2 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gumbet-doner-low',
      'ChIJh4TxxsltvhQRlNmncVOkpPc',
      'denemelisin',
      'Kapı 6 ihlali: Gümbet Döner ★4.0 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gumbet-ates-doner-low',
      'ChIJ_WboTy5tvhQRIS7LBBCt01s',
      'denemelisin',
      'Kapı 6 ihlali: ATEŞ DÖNER GÜMBET ★3.7 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gumbet-alora-beach-low',
      'ChIJSQ5YP7htvhQRcwoLlpNYn2c',
      'date',
      'Kapı 6 ihlali: ALORA BEACH CLUB ★3.5 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gumbet-bonita-lounge-low',
      'ChIJSQDrTVdtvhQRzd1W2p_noFk',
      'kahve',
      'Kapı 6 ihlali: Bonita lounge cafe ★4.0 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gumbet-ozukara-low',
      'ChIJDQI8Hq5tvhQRsXdm1py22Ak',
      'date',
      'Kapı 6 ihlali: Özükara Restaurant ★3.6 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gumbet-burnger-low',
      'ChIJn7N2MTdtvhQRJg87lLMAr_w',
      'hamburger',
      'Kapı 6 ihlali: Burnger Gümbet ★3.6 puanı ve 17 değerlendirme ile 4.4 / 35 alt sınırlarının altında'
    ),
    negControl(
      'ctrl-gumbet-gozleme-low-count',
      'ChIJw1t7S1RtvhQRQ0D9ZzJEYaU',
      'kahvalti',
      'Kapı 6 ihlali: Gümbet Gözleme 17 değerlendirme ile 35 alt sınırının altında'
    ),
    negControl(
      'ctrl-gumbet-cali-kebap-low-count',
      'ChIJjcmVUvRtvhQRGPfeELRAJfE',
      'denemelisin',
      'Kapı 6 ihlali: Çali Kebap Evi 33 değerlendirme ile 35 alt sınırının altında'
    ),
    negControl(
      'ctrl-gumbet-nefiss-outside-low',
      'ChIJbXmlDktsvhQR2NdVBj2WvvM',
      'denemelisin',
      'Kapı 4 & Kapı 6 ihlali: NEFİSS EV YEMEKLERİ GÜMBET Gümbet doğu sınırı (27.4074) dışında (27.41013) ve ★3.8 puanı'
    ),
    negControl(
      'ctrl-gumbet-whynot-outside-low',
      'ChIJw8hDoxptvhQRqFDb1kpit44',
      'date',
      'Kapı 4 & Kapı 6 ihlali: WHY NOT BEACH BODRUM Gümbet batı sınırı (27.3960) dışında (27.39582) ve ★4.1 puanı'
    ),

    // Kapı 8 — <150 Oy & ≥4.8 Şişirilmiş Puan / Yetersiz Bağımsız Kanıt Kontrolleri
    negControl(
      'ctrl-gumbet-madu-inflation',
      'ChIJgRTMvBJtvhQRXZ1mV09v4YI',
      'hamburger',
      'Kapı 8 ihlali (suspected_rating_inflation_no_community_proof): Madu Bodrum ★5.0 / 80 oyda Yandex dışı en az 2 bağımsız editorial/community kanıtı bulunamadı'
    ),
    negControl(
      'ctrl-gumbet-bosstans-inflation',
      'ChIJ3xYYOw5tvhQRjIaNeAtgQNg',
      'kahvalti',
      "Kapı 4, Kapı 3B & Kapı 8 ihlali: Bosstan's Fırın Gümbet Google adresinde Bodrum ilçe bileşeni eksik (Gümbet, 48200 MUĞLA/Muğla), fırın konseptli olup kahveye alınamaz ve ★4.9 / 38 oyda Yandex dışı 2 bağımsız kanıtı yoktur"
    ),

    // Kapı 5 — Turistik Bar/Karaoke Pub & Adisyon/Gıda Şikayeti Dışlamaları
    negControl(
      'ctrl-gumbet-family-door-karaoke',
      'ChIJVXMSGI1tvhQR01fxdQjZgCc',
      'date',
      'Kapı 5 / Konsept filtresi: FAMİLY DOOR RESTAURANT & KARAOKE FUN PUB yemek odaklı gastronomi noktası yerine karaoke eğlence pubı kimliğiyle dışlandı',
      {
        degraded:
          'Karaoke ve bar eğlence konsepti baskın olduğundan sessiz akşam yemeği ve gastronomi seçkisi kapsamı dışında bırakıldı',
      }
    ),
    negControl(
      'ctrl-gumbet-cheers-upsell',
      'ChIJA1Kfla9tvhQRugIO-NngwHM',
      'date',
      'Kapı 5 / Turistik bar & hesap şeffaflığı uyarısı: Cheers Restaurant karaoke, canlı maç yayını ve barlar sokağı agresif müşteri yönlendirme uyarıları nedeniyle dışlandı',
      {
        degraded:
          'Karaoke ve canlı maç barı atmosferinin yanında ziyaretçi incelemelerinde fiyat şeffaflığı ve yönlendirme baskısı uyarıları bulunuyor',
      }
    ),
    negControl(
      'ctrl-gumbet-bamboo-house-adisyon',
      'ChIJW8S97JttvhQRwNQ6vkx4Bxk',
      'date',
      'Kapı 5 / Adisyon ve servis şikayeti: Bamboo house ★4.4 sınırında adisyonda ek kalem/çerez ücreti ve servis üslubu şikayetleri nedeniyle dışlandı',
      {
        degraded:
          'Çeşitli platformlarda adisyonda yer almayan ek kalemler, ikram çerezlere yazılan ücretler ve personel tutumu şikayetleri raporlanmıştır',
      }
    ),
    negControl(
      'ctrl-gumbet-landscape-bistro-complaint',
      'ChIJF2g_KENtvhQRgMJfufv50-4',
      'date',
      'Kapı 5 / Gıda güvenliği ve servis şikayeti: Landscape Bistro kuzu yemeğine dair gıda zehirlenmesi bildirimi ve yoğun saat servis yavaşlığı nedeniyle dışlandı',
      {
        degraded:
          'İnceleme platformlarında kuzu yemeği kaynaklı ciddi gıda zehirlenmesi şikayeti ve yoğun saat servis aksaklıkları yer almaktadır',
      }
    ),

    // Kapı 4 — Sıkı Mahalle & Bbox Sınırı Dışı Kontrolleri (Bitez, Eskiçeşme, Yeniköy, Cumhuriyet)
    negControl(
      'ctrl-gumbet-odd-burger-bitez-outside',
      'ChIJd3O_SDptvhQRXrrSj0KHR-A',
      'hamburger',
      'Kapı 4 ihlali: Odd Burger Co. Bitez Mahallesi ve Gümbet maxLat (37.0405) sınırının kuzeyinde'
    ),
    negControl(
      'ctrl-gumbet-fika-bitez-outside',
      'ChIJhfuJW_ZtvhQRn7sc5085cG0',
      'kahve',
      'Kapı 4 ihlali: Fika Coffee Tea Bitez Mahallesi ve Gümbet maxLat (37.0405) sınırının kuzeyinde'
    ),
    negControl(
      'ctrl-gumbet-rascal-bitez-excludebbox',
      'ChIJDUsVrOJtvhQRDVwdaoYpN88',
      'pizza',
      'Kapı 4 & Kapı 6 ihlali: Rascal Napolitan Pizza & Panuozzo Bitez Mahallesi kuzeybatı excludeBbox oyuğu içinde ve 1 değerlendirme'
    ),
    negControl(
      'ctrl-gumbet-rubys-eskicesme-outside',
      'ChIJTSsmuTttvhQRTfF2s7633oc',
      'pizza',
      'Kapı 4 ihlali: Rubys Pizzeria Food & Beverage pizza Eskiçeşme Mahallesi ve Gümbet doğu maxLng (27.4074) sınırının dışında'
    ),
    negControl(
      'ctrl-gumbet-chives-eskicesme-outside',
      'ChIJrTRbqA9tvhQRpxq3brMrp28',
      'kahve',
      'Kapı 4 ihlali: Cafe Chives Eskiçeşme Mahallesi ve Gümbet doğu maxLng (27.4074) sınırının dışında'
    ),
    negControl(
      'ctrl-gumbet-kaya-balik-eskicesme-outside',
      'ChIJkdfm4zdtvhQRmL4ssv0zKjc',
      'balik',
      'Kapı 4 ihlali: KAYA BALIK MEZE EVI Eskiçeşme Mahallesi ve Gümbet doğu maxLng (27.4074) sınırının dışında'
    ),
    negControl(
      'ctrl-gumbet-basar-balik-yenikoy-outside',
      'ChIJZYqxoS5tvhQRLAYItkexZt0',
      'balik',
      'Kapı 4 ihlali: BAŞAR BALIKÇILIK Yeniköy Mahallesi ve Gümbet doğu maxLng (27.4074) sınırının dışında'
    ),
    negControl(
      'ctrl-gumbet-ile-kitabevi-cumhuriyet-outside',
      'ChIJ2QbH5kpsvhQRYAH6EpzaZyk',
      'kahve',
      'Kapı 4 ihlali: İLE Kitabevi &Kafe Cumhuriyet Mahallesi Oasis AVM içinde, Gümbet kuzeydoğu sınırının dışında'
    ),
  ],
};
