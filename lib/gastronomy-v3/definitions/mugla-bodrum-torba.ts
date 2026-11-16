import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const MUGLA_BODRUM_TORBA_DEF: V3RegionDefinition = {
  id: 'torba-bodrum-mugla',
  slug: 'torba',
  city: 'Muğla',
  district: 'Bodrum',
  allowedDistricts: ['Bodrum'],
  neighborhood: 'Torba',
  officialQuarter:
    'Torba Mahallesi — Torba Koyu, Atatürk Caddesi, Rıza Anter Caddesi, Usuluk Koyu, Kaynar & Zeytinlikahve Hattı',
  displayName: 'Torba, Bodrum, Muğla',
  locative: "Torba'da",
  path: ['mugla', 'bodrum', 'torba'],
  aliases: ['Torba', 'Torba Koyu', 'Torba Sahil', 'Kaynar Torba', 'Usuluk Koyu', 'Zeytinlikahve'],
  scopeNote:
    'Torba Koyu, Atatürk & Rıza Anter Caddeleri, Usuluk Koyu, Kaynar & Zeytinlikahve Hattı · Doğrulanmış Seçki',
  characterSubtitle:
    'Torba Koyu sahil şeridinden Kaynar ve Usuluk koylarına uzanan akşam restoranları, ahşap iskeleli sahil barı, halk plajı kıyısında çamlar altı belediye kahvaltı ve tost molası, el açması mantı ve çi börek durağı, sokak lezzetleri ve 1987 yılından bu yana kum üstü masalarıyla bilinen köklü kıyı balıkçısı.',
  center: { lat: 37.0815, lng: 27.4590 },
  bbox: { minLat: 37.0550, maxLat: 37.1095, minLng: 27.4350, maxLng: 27.5150 },
  allowedNeighborhoodTokens: ['Torba', 'Kaynar', 'Usuluk', 'Zeytinlikahve'],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // ==================== 4. DATE MEKANLARI ====================
    compactSeed({
      id: 'torba-cakil-beach',
      placeId: 'ChIJ_zl93CxpvhQRZxEu8ghU888',
      cat: 'date',
      brand: 'torba çakıl',
      area: 'Atatürk Cd. (Omar Otel), Torba',
      signals: ['ahsap_teras_ve_iskele', 'deniz_urunleri_ve_meze', 'kokteyl_sahil_bari'],
      verifiedAt: '2026-11-16',
      desc: "Torba Koyu Atatürk Caddesi üzerinde Omar Otel kıyısında ahşap terası ve iskelesiyle hizmet veren denize sıfır plaj restoranı ve barı. Gün içinde plaj atıştırmalıkları ve kahvaltı tabağı, akşamları ise taze balık, kalamar tava, karides, mezeler ve kokteyllerle sakin bir sahil masası kurar.",
      order: ['Kalamar Tava & Karides', 'Günlük Balık (Barbun) & Ahtapot', 'Ege Mezeleri & İmza Kokteyller'],
      menu: [
        'Kalamar Tava',
        'Karides Çeşitleri',
        'Kırmızı Barbun & Günlük Balık',
        'Ahtapot',
        'Türk Mezeleri',
        'Kahvaltı Tabağı',
        'Spaghetti Bolognese & Makarnalar',
        'Burger & Salatalar',
        'Kokteyl, Şarap & Bira Seçkisi',
      ],
      sec: [
        [
          'Kahvaltı Tabağı',
          'Sabah saatlerinde deniz kenarında hafif ve pratik bir başlangıç arayanlar için serpme yerine tabak düzeninde sunulur.',
          'Restoranım.net ve Menü Haritası kayıtları',
        ],
        [
          'Spaghetti Bolognese & Plaj Burgerleri',
          'Deniz ürünleri dışında gündüz plaj molasında makarna veya hızlı atıştırmalık tercih eden misafirler için hazırlanır.',
          'Restaurant Guru menü kayıtları',
        ],
      ],
      seat: 'Torba Koyu kıyısında denize sıfır ahşap teras, iskele masaları ve gündüz plaj şezlong düzeni',
      crowd: 'Gündüz plaj misafirleriyle sakin, gün batımı ve akşam yemeği saatlerinde çiftler ve küçük gruplarla keyifli tempo',
      dis: 'Kapsamlı köy serpme kahvaltısı yerine sade kahvaltı tabağı ağırlıklıdır; yaz sezonunda plaj giriş ve harcama koşulları dönemsel değişebiliyor',
      transit: 'Torba Mahallesi Mustafa Kemal Atatürk Caddesi (Omar Otel önü) üzerinde kıyı yürüyüş hattında',
      sources: [
        [
          'Bodrum Guru — Torba Çakıl Beach',
          'https://www.bodrumguru.com/',
          'editorial',
          'Torba sahil hattında denize sıfır plaj-restoran konsepti ve atmosfer tanıtımı',
        ],
        [
          'My Guide Bodrum — Torba Çakıl Beach',
          'https://www.myguidebodrum.com/',
          'community',
          'Omar Hotel & Suites konumu, akşam à la carte servisi, kokteyl-şarap barı ve orta fiyat seviyesi',
        ],
        [
          'Restaurant Guru — Torba Çakıl Beach',
          'https://restaurantguru.com/',
          'community',
          'Türk mezeleri, barbun, ahtapot, makarna ve burger menü kalemleri ile ziyaretçi puanları',
        ],
        [
          'Restoranım.net & Yandex Harita — Torba Çakıl Beach',
          'https://www.restoranim.net/',
          'community',
          'Ahşap teras ve iskele, kalamar tava, karides ve kahvaltı tabağı değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=14984412782591349095',
          'maps',
          'Omar Otel Torba Atatürk Cd. konum ve restaurant/bar tür doğrulaması',
        ],
      ],
      pros: [
        'Torba sahilindeki üst segment resort restoranlarına kıyasla orta bütçe seviyesinde ahşap teras ve iskele akşamı sunması',
        'Deniz ürünleri ve mezelerin yanında kokteyl ve şarap seçkisiyle gün batımına uygun sahil ortamı',
      ],
      cons: [
        'Kış döneminde sezonluk kapanış veya kısıtlı servis düzenine geçebiliyor',
        'Yaz aylarında plaj bölümü harcama koşulları işletme tarafından güncellenebiliyor',
      ],
      unc: ['Sezon içi plaj giriş veya minimum harcama uygulaması önceden teyit edilmelidir'],
    }),
    compactSeed({
      id: 'ezi-restaurant-susona-torba',
      placeId: 'ChIJEVHu_j5pvhQRJxgWe2QVSwk',
      cat: 'date',
      brand: 'ezi',
      area: 'Kaynar Cd. (Susona), Torba',
      signals: ['susona_bodrum_terasi', 'ege_paylasimli_aksam', 'taverna_ve_canli_muzik_geceleri'],
      verifiedAt: '2026-11-16',
      desc: "Torba Kaynar Caddesi'ndeki Susona Bodrum, LXR Hotels & Resorts bünyesinde sonsuzluk havuzu ve Torba Koyu manzarasına karşı hizmet veren şef ve brasserie restoranı. Akşamları paylaşıma uygun yerel Ege mezeleri, deniz ürünleri ve hafta sonu canlı müzikli taverna sofralarıyla öne çıkar.",
      order: ['Şefin Ege Mezeleri & Otlu Mücver', 'Bargilya Karides Güveç & Kalamar', 'Izgara Günlük Balık Çeşitleri'],
      menu: [
        'Şefin Ege Mezeleri',
        'Ege Otlu Mücver',
        'Kızarmış Mihaliç Peyniri (Ballı & Kekikli)',
        'Vitello Tonnato',
        'Bargilya Karides Güveç',
        'Bodrum Usulü Kalamar Tava',
        'Izgara Günlük Balıklar',
        'Manda Burrata & Bahçe Salataları',
        'Yarı Açık Büfe & Alakart Kahvaltı',
        'Çakallı Menemen & Eggs Benedict',
      ],
      sec: [
        [
          'Vitello Tonnato & Kızarmış Mihaliç Peyniri',
          'Ege mezeleri dışında akşam başlangıçlarında artizan peynir, kapari ve ekşi maya eşlikçili modern tabaklar sunar.',
          'Susona Bodrum resmi akşam menü kayıtları',
        ],
        [
          'Yarı Açık Büfe & Alakart Sabah Kahvaltısı',
          'Bodrum tulumu, Milas beyaz peyniri, Bitez mandalini reçeli, Çakallı menemen ve Eggs Benedict gibi seçeneklerle sabah saatlerinde de tercih edilir.',
          'Gastronomi Dergisi ve The Turquoise Collection incelemeleri',
        ],
      ],
      seat: 'Torba Koyu ve sonsuzluk havuzu manzaralı açık teras, zarif akşam yemek masaları ve bar alanı',
      crowd: 'Özel akşam yemeği planlayan çiftler ve otel dışı rezervasyonlu misafirlerle rafine; cuma ve cumartesi etkinlik gecelerinde daha sosyal tempo',
      dis: 'Üst lüks segmentte yer alır; yaz sezonunda otel dışı misafirler için önceden telefonla masa rezervasyonu ve müsaitlik teyidi gerektirir',
      transit: 'Torba Mahallesi Kaynar Caddesi No:15 (Susona Bodrum içinde) üzerinde özel araçla kolay ulaşılır',
      sources: [
        [
          'Gastronomi Dergisi — Susona Bodrum & Ezi Restaurant',
          'https://www.gastronomidergisi.com/',
          'editorial',
          'Torba koyu manzaralı Susona Bodrum içinde deniz-havuz cepheli sosyal gastronomi alanı tanıtımı',
        ],
        [
          'Alem & Mes Prestiges — Ezi Taverna Geceleri',
          'https://www.alem.com.tr/',
          'editorial',
          'Hafta sonu canlı müzikli buluşmalar ve paylaşımlı Ege meze-deniz ürünleri set menüsü haberi',
        ],
        [
          'The Turquoise Collection & Prince of Travel — Susona Kahvaltı & Akşam',
          'https://www.theturquoisecollection.com/',
          'community',
          'Bodrum tulumu, Milas peyniri, Bitez mandalina reçeli, Çakallı menemen ve akşam paylaşım tabakları değerlendirmesi',
        ],
        [
          'Susona Bodrum Resmi Sayfası — Ezi Restaurant',
          'https://susonabodrum.com/ezi/',
          'operator',
          'Kaynar Cd. No:15 adresi, resmi akşam menüsü, Bargilya karides, otlu mücver ve rezervasyon bilgisi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=669652490900609063',
          'maps',
          'Torba Kaynar Cd. No:15 konum ve fine_dining_restaurant tür doğrulaması',
        ],
      ],
      pros: [
        'Torba koyu ve sonsuzluk havuzu manzaralı ferah terasta yerel Ege ürünleriyle rafine paylaşım mutfağı sunması',
        'Taverna konseptli akşamları ve yarı açık büfe-alakart sabah kahvaltısıyla günün farklı saatlerine hitap etmesi',
      ],
      cons: [
        'Yüksek lüks fiyat segmentinde yer alır',
        'Otel doluluğuna bağlı olarak dışarıdan gelen misafirler için önceden rezervasyon zorunludur',
      ],
      unc: ['Sezon dışı aylarda akşam konsept geceleri ve dış misafir kabul saatleri güncellenebiliyor'],
    }),
    compactSeed({
      id: 'rise-restaurant-usuluk-torba',
      placeId: 'ChIJn-bxQABpvhQRO9gskDfxkRA',
      cat: 'date',
      name: 'Rise Restaurant',
      brand: 'rise',
      area: 'Usuluk Koyu, Torba',
      signals: ['usuluk_koyu_sahil', 'yunan_ege_mutfagi', 'rezervasyonlu_aksam_masasi'],
      verifiedAt: '2026-11-16',
      desc: "Usuluk Koyu Kaynar Caddesi hattında Vogue Hotel Supreme Bodrum'un Gastro Bay sahil alanında hizmet veren Yunan ve Akdeniz mutfağı restoranı. Beyaz kumlu koy kıyısında klasik Yunan mezeleri, saganaki, ızgara ahtapot ve taze deniz ürünlerini akşam konseptinde sunar.",
      order: ['Yunan Mezeleri Seçkisi', 'Saganaki', 'Izgara Ahtapot & Deniz Ürünleri'],
      menu: [
        'Yunan Mezeleri',
        'Saganaki',
        'Izgara Ahtapot',
        'Taze Deniz Ürünleri',
        'Akdeniz Salataları',
        'Izgara Balık Çeşitleri',
      ],
      sec: [
        [
          'Akdeniz Salataları & Soğuk Başlangıçlar',
          'Yunan mezeleri ve deniz mahsulleri öncesinde hafif sahil başlangıcı olarak sunulur.',
          'Vogue Hotel Supreme Gastro Bay kayıtları',
        ],
        [
          'Günlük Izgara Balık Çeşitleri',
          'Sıcak ara sıcakların ardından akşam ana yemeğinde deniz kenarı sofralarını tamamlar.',
          'Guest Reservations & My Guide Bodrum kayıtları',
        ],
      ],
      seat: 'Usuluk Koyu kıyısında beyaz kumlu plaj ve deniz cepheli açık hava à la carte akşam düzeni',
      crowd: 'Akşam yemeğinde otel misafirleri ve rezervasyonlu konuklarla şık, sakin ve romantik sahil temposu',
      dis: 'Ultra her şey dahil konseptli tatil köyü alanı içinde bulunduğundan otel dışı ziyaretçiler için ön rezervasyon, ek giriş/kuver bedeli veya günlük kabul sınırlaması uygulanabilir; değerlendirme havuzu henüz küçük ölçeklidir',
      transit: 'Torba Usuluk Koyu Kaynar Caddesi (Vogue Hotel Supreme Bodrum sahil hattı) üzerinde',
      sources: [
        [
          'Vogue Hotel Supreme Resmi Sitesi — Gastro Bay & The Rise',
          'https://www.voguehotelsupreme.com/',
          'operator',
          'Usuluk Koyu sahil hattında Yunan mutfağı konseptli The Rise ve Gastro Bay alanları resmi tanıtımı',
        ],
        [
          'My Guide Bodrum — The Rise Village & Beach Usuluk',
          'https://www.myguidebodrum.com/',
          'community',
          'Torba Usuluk Koyu sahil konumu ve kıyı restoran-plaj profili',
        ],
        [
          'Guest Reservations — The Rise Bodrum Gastro Bay',
          'https://www.guestreservations.com/',
          'community',
          'Yunan mutfağı, saganaki, Akdeniz mezeleri, deniz ürünleri ve akşam kıyafet-rezervasyon politikası bilgisi',
        ],
        [
          'Yandex Harita — Rise Restaurant Usuluk Koyu',
          'https://yandex.com.tr/harita',
          'community',
          'Usuluk Koyu Kaynar Cd. konum ve Yunan restoranı değerlendirme kaydı',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=1194000597174245435',
          'maps',
          'Mevkii Usuluk Koyu Torba Kaynar Cd. konum ve greek_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Usuluk Koyu beyaz kumlu sahil hattında doğrudan Yunan mutfağı ve deniz ürünlerine odaklanan akşam konsepti',
        'Saganaki, mezeler ve ızgara ahtapot eşliğinde sakin koy atmosferi sunması',
      ],
      cons: [
        'Yüksek bütçe segmentindedir ve kapalı resort yerleşkesi içinde yer alır',
        'Konaklamayan misafirler için giriş ve masa rezervasyonu tesis onayına bağlıdır',
      ],
      unc: ['Otel dışı ziyaretçiler için güncel kuver veya günlük giriş koşulları gitmeden önce otel danışmasından teyit edilmelidir'],
    }),

    // ==================== 5. KAHVALTI ====================
    compactSeed({
      id: 'torba-cafe-bodrum-belediyesi',
      placeId: 'ChIJV1UlUtNuvhQRvGWwTw4Etck',
      cat: 'kahvalti',
      secondaryCategoryIds: ['denemelisin'],
      name: 'Torba Cafe (Bodrum Belediyesi)',
      brand: 'torba cafe',
      area: 'Atatürk Cd. (Halk Plajı), Torba',
      signals: ['cam_agaclari_alti_sahil', 'belediye_sosyal_tesisi', 'ulasilabilir_kahvalti_ve_tost'],
      verifiedAt: '2026-11-16',
      desc: "Torba Halk Plajı kıyısında çam ağaçlarının gölgesinde Bodrum Belediyesi A.Ş. tarafından işletilen denize sıfır sosyal tesis kafesi. Özel plajlara göre erişilebilir belediye tarifesiyle sabah kahvaltı tabağı, menemen, Bodrum tostu, çay ve Türk kahvesi molası sunar.",
      order: ['Kahvaltı Tabağı & Menemen', 'Bodrum Tostu', 'Türk Kahvesi & Demleme Çay'],
      menu: [
        'Kahvaltı Tabağı',
        'Serpme Kahvaltı',
        'Menemen',
        'Bodrum Tost Çeşitleri',
        'Salatalar & Gün İçi Atıştırmalıklar',
        'Türk Kahvesi & Espresso Çeşitleri',
        'Demleme Çay & Taze Sıkılmış Meyve Suları',
      ],
      sec: [
        [
          'Serpme Kahvaltı Seçenekleri',
          'Kalabalık aile veya arkadaş masaları için tek kişilik kahvaltı tabağına ek olarak tercih edilen paylaşım düzenidir.',
          'Bodrum Belediye A.Ş. tesis menü ve Restoranım.net kayıtları',
        ],
        [
          'Taze Sıkılmış Meyve Suları & Sahil Atıştırmalıkları',
          'Deniz sonrası veya öğle sıcağında kahve ve çay dışında serinlemek isteyen misafirlere sunulur.',
          'Restoranım.net ve Yandex Harita değerlendirmeleri',
        ],
      ],
      seat: 'Torba Halk Plajı kenarında çam ağaçları altında denize sıfır açık sahil masaları',
      crowd: 'Sabah yürüyüşçüleri, aileler ve yerel sakinlerle gün boyu samimi, telaşsız ama sezonda yoğun tempo',
      dis: 'Üçüncü nesil nitelikli kahve kavurucusu veya lüks servis odaklı bir mekan değildir; yaz hafta sonları ve tatil günlerinde boş masa bulmak ve sipariş sırası beklemek gerekebilir',
      transit: 'Torba Mahallesi Mustafa Kemal Atatürk Caddesi No:157 (halk plajı hattı) üzerinde sahil yürüyüş yolunda',
      sources: [
        [
          'Bodrum Belediye A.Ş. Resmi Sayfası — Torba Cafe',
          'https://www.bodrumbelediyeas.com.tr/',
          'operator',
          'Atatürk Cd. Torba plaj mevkii konumu, çam ağaçları altı deniz manzaralı sosyal tesis ve QR menü bilgisi',
        ],
        [
          'Bodrum Belediyesi Resmi Duyuruları',
          'https://www.bodrum.bel.tr/',
          'operator',
          'Bodrum yerleşik halk tarifesi, ekonomik belediye tesisi ve halk plajı komşuluğu bilgisi',
        ],
        [
          'Restaurant Guru — Torba Cafe Bodrum Belediye',
          'https://restaurantguru.com/',
          'community',
          'Kahvaltı, salata, atıştırmalık, çay-kahve servisi ve manzara değerlendirmeleri',
        ],
        [
          'Restoranım.net & Yandex Harita — Torba Cafe',
          'https://www.restoranim.net/',
          'community',
          'Çamlar altında kahvaltı tabağı, Bodrum tostu, menemen ve fiyat-performans dengesi notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=14534527831921157564',
          'maps',
          'Torba Atatürk Cd. No:157 konum ve cafe türü doğrulaması',
        ],
      ],
      pros: [
        'Torba sahilinde giriş ücreti veya yüksek harcama zorunluluğu olmadan çam ağaçları altında denize sıfır kahvaltı ve mola imkanı',
        'Bodrum genelindeki özel tesislere kıyasla şeffaf ve erişilebilir belediye fiyat tarifesi',
      ],
      cons: [
        'Özel kavurucu nitelikli filtre kahve odaklı değildir; standart kafe içecekleriyle hizmet verir',
        'Hafta sonu ve yüksek yaz sezonunda masa bulma ve servis süresi uzayabilir',
      ],
      unc: ['Sezon dışı kış aylarında tesis açılış ve kapanış saatleri belediye çalışma takvimine göre değişebiliyor'],
    }),

    // ==================== 6. MUTLAKA DENEMELİSİN ====================
    compactSeed({
      id: 'bodrum-cardak-kokorec-kofte-torba',
      placeId: 'ChIJ-QgtYU9pvhQRI_I2X5aMmdA',
      cat: 'denemelisin',
      brand: 'çardak',
      area: 'Atatürk Cd., Torba',
      signals: ['yaz_kis_acik_aile_isletmesi', 'bol_porsiyon_kokorec', 'ev_usulu_izgara_kofte'],
      verifiedAt: '2026-11-16',
      desc: "Torba Atatürk Caddesi'nde yaz kış açık hizmet veren samimi aile işletmesi. Bol porsiyonlu kokoreç, ev yapımı tadında ızgara köfte ve sucuklu köfte seçenekleriyle özellikle akşam ve gece saatlerinde pratik sokak lezzeti arayanların uğrak noktasıdır.",
      order: ['Kokoreç (Ekmek Arası veya Porsiyon)', 'Ev Usulü Izgara Köfte', 'Sucuklu Köfte & Ekmek Arası Sucuk'],
      menu: ['Kokoreç', 'Izgara Köfte', 'Sucuklu Köfte', 'Ekmek Arası Sandviç Çeşitleri', 'Soğuk İçecekler'],
      sec: [
        [
          'Ekmek Arası Sandviç Çeşitleri',
          'Geç saatlerde hızlı ve doyurucu al-götür öğün arayan misafirler için hazırlanır.',
          'Restaurant Guru ve Maptons kayıtları',
        ],
        [
          'Al-Götür & Paket Servis Seçenekleri',
          'Torba içi akşam ve gece atıştırmalıklarında pratik sipariş alternatifi olarak tercih edilir.',
          'Restoranım.net işletme profili',
        ],
      ],
      seat: 'Atatürk Caddesi cephesinde sade açık hava masa düzeni ve hızlı al-götür tezgahı',
      crowd: 'Akşamüstü ve gece geç saatlere kadar yerel sakinler ile pratik atıştırmalık arayan tatilcilerle hareketli',
      dis: 'Deniz manzaralı oturma veya klasik esnaf lokantası meze sofrası sunmaz; cadde kenarı sade sokak lezzeti konseptindedir',
      transit: 'Torba Mahallesi Mustafa Kemal Atatürk Caddesi No:97 üzerinde sahil yerleşimi içinde',
      sources: [
        [
          'Yandex Harita — Bodrum Çardak Kokoreç ve Köfte',
          'https://yandex.com.tr/harita',
          'community',
          'Atatürk Cd. No:97 adresi, yaz-kış açık olması, bol porsiyonlu kokoreç ve ev yapımı tadında köfte notları',
        ],
        [
          'Restaurant Guru — Bodrum Çardak Kokoreç ve Köfte',
          'https://restaurantguru.com/',
          'community',
          'Kokoreç, köfte ve sandviç değerlendirmeleri ile açık hava/al-götür bilgisi',
        ],
        [
          'Restoranım.net & Maptons — Çardak Kokoreç Torba',
          'https://www.restoranim.net/',
          'community',
          'Sucuklu köfte menü detayı, aile işletmesi yapısı ve gece servis saatleri kaydı',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=15031199808796160547',
          'maps',
          'Torba Atatürk Cd. No:97 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Yaz kış açık kalarak Torba içinde gece geç saatlere kadar sıcak kokoreç ve köfte sunan samimi aile işletmesi',
        'Bölgedeki otel ve sahil kulüplerine kıyasla orta bütçe seviyesinde doyurucu porsiyonlar',
      ],
      cons: [
        'Sokak kenarı mütevazı bir işletme olduğundan manzara veya uzun akşam sofrası arayanlara uygun değil',
        'Menü kapsamı ağırlıklı ızgara köfte, kokoreç ve sandviçle sınırlıdır',
      ],
      unc: ['Sezon dışında gece kapanış saatleri dönemsel talebe göre değişebiliyor'],
    }),
    compactSeed({
      id: 'hocanin-yeri-torba',
      placeId: 'ChIJtUQXcDNpvhQRCLA5T4CXR18',
      cat: 'denemelisin',
      secondaryCategoryIds: ['kahvalti'],
      brand: 'hoca',
      area: 'Atatürk Cd., Torba',
      signals: ['zeytin_agaclari_bahce', 'el_yapimi_mini_manti', 'ci_borek_ve_gozleme'],
      verifiedAt: '2026-11-16',
      desc: "Torba Atatürk Caddesi'nde zeytin ağaçları altındaki samimi bahçesiyle hizmet veren köklü aile işletmesi. İnce hamurlu el yapımı minik mantısı, az yağlı çıtır çi böreği, gözlemeleri, lahmacunu ve sabahları sunduğu sıcak ev kahvaltısıyla öne çıkar.",
      order: ['El Yapımı Minik Mantı', 'Kıymalı Çi Börek', 'El Açması Gözleme & Pişi'],
      menu: [
        'Ev Yapımı Minik Mantı',
        'Kıymalı Çi Börek',
        'El Açması Gözleme',
        'Pişi & Pide Çeşitleri',
        'Lahmacun',
        'Ev Usulü Kahvaltı & Brunch',
      ],
      sec: [
        [
          'Lahmacun & Pide Çeşitleri',
          'Mantı ve hamur işleri dışında geleneksel fırın lezzetleri arayan aile masalarında sıkça paylaşılır.',
          'Wanderlog ve Restaurant Guru kayıtları',
        ],
        [
          'Ev Usulü Bahçe Kahvaltısı & Brunch',
          'Zeytin ağaçları altında gözleme, pişi ve sıcak hamur işleriyle sabah kahvaltısı seçeneği sunar.',
          'Yandex Harita ve Eatbu işletme kayıtları',
        ],
      ],
      seat: 'Atatürk Caddesi üzerinde zeytin ağaçları altında gölgeli açık bahçe masaları',
      crowd: 'Torba sakinleri, aileler ve gösterişsiz ev lezzeti arayan müdavimlerle huzurlu ve samimi tempo',
      dis: 'Lüks sahil kulübü tasarımı yerine mütevazı bir bahçe lokantası dokusundadır; sezon dönemine göre çalışma saatleri önceden teyit edilmelidir',
      transit: 'Torba Mahallesi Mustafa Kemal Atatürk Caddesi No:53 üzerinde koy yerleşimi içinde',
      sources: [
        [
          'Wanderlog — Hoca’nın Yeri Torba',
          'https://wanderlog.com/',
          'editorial',
          'İnce hamurlu minik mantı, çi börek ve lahmacun vurgulu Torba yerel lezzet seçkisi',
        ],
        [
          'Mes Prestiges — Hoca’nın Yeri Atatürk Cd. No:53',
          'https://www.mesprestiges.com/',
          'editorial',
          'Atatürk Cd. No:53 konum, aile işletmesi kimliği ve sezonluk saat uyarısı',
        ],
        [
          'Restaurant Guru — Hoca’nın Yeri Torba',
          'https://restaurantguru.com/',
          'community',
          'Mantı, pişi ve çi börek çeşitleri hakkında olumlu ziyaretçi geri bildirimleri',
        ],
        [
          'Yandex Harita & Restoranım.net — Hoca’nın Yeri',
          'https://yandex.com.tr/harita',
          'community',
          'Zeytin ağaçları altındaki bahçe atmosferi ve ev yapımı Türk mutfağı notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=6865622734290399240',
          'maps',
          'Torba Atatürk Cd. No:53 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Zeytin ağaçları altındaki gölgeli bahçede ev yapımı mantı ve az yağlı çıtır çi börek sunması',
        'Gösterişli turistik menülerden uzak, samimi aile işletmesi sıcaklığı ve orta bütçe dengesi',
      ],
      cons: [
        'Sipariş üzerine açılan hamur işlerinde öğle yoğunluğunda bekleme süresi oluşabilir',
        'Kış aylarında çalışma günleri ve saatleri sınırlı olabiliyor',
      ],
      unc: ['Sezon geçişlerinde aktif açılış saatleri telefonla teyit edilmelidir'],
    }),
    compactSeed({
      id: 'essahli-adana-isi-torba',
      placeId: 'ChIJt4hIGW5pvhQR33Fv344tHVc',
      cat: 'denemelisin',
      brand: 'essahlı',
      area: 'Rıza Anter Cd., Torba',
      signals: ['zirh_kiymasi_adana_kebap', 'gece_gec_saatlere_kadar_acik', 'torba_paket_ve_masa'],
      verifiedAt: '2026-11-16',
      desc: "Torba Rıza Anter Caddesi'nde zırh kıymasıyla hazırlanan Adana ve Urfa kebaplarıyla bilinen kebapçı. Tablacı salatası, acılı ezme ve tarator eşliğinde sunulan porsiyon ve dürümlerin yanı sıra gece geç saatlere uzanan servisiyle Torba'da otantik kebap durağı sunar.",
      order: ['Zırh Kıyması Adana Kebap', 'Adana & Urfa Dürüm', 'Tavuk Şiş & Tavuk Kanat'],
      menu: [
        'Adana Kebap',
        'Urfa Kebap',
        'Adana & Urfa Dürüm',
        'Tavuk Şiş & Tavuk Kanat',
        'Mercimek Çorbası',
        'Tablacı & Gavurdağı Salatası',
        'Kiloluk Pişmiş Kebap',
      ],
      sec: [
        [
          'Mercimek Çorbası & Gavurdağı Salatası',
          'Kebap ve ızgara öncesinde veya geç saat öğünlerinde sofrayı tamamlayan sıcak başlangıç ve taze salata seçenekleridir.',
          'Yemeksepeti aktif menü kayıtları',
        ],
        [
          'Kiloluk Pişmiş Kebap Seçenekleri',
          'Kalabalık aile veya arkadaş gruplarının toplu siparişlerinde tercih edilen porsiyon alternatifi olarak sunulur.',
          'Yemeksepeti menü listesi',
        ],
      ],
      seat: 'Rıza Anter Caddesi cephesinde mütevazı masa düzeni ve ağırlıklı hızlı paket servis mutfağı',
      crowd: 'Öğleden gece geç saatlere kadar paket sipariş veren bölge sakinleri ve geç akşam acıkan misafirlerle pratik tempo',
      dis: 'Deniz kıyısı manzarası yoktur, ağırlıklı paket ve hızlı kebap servisi odaklıdır; yoğun saatlerde teslimat hızı ve garnitür paketlemesinde dönemsel dalgalanmalar yaşanabiliyor',
      transit: 'Torba Mahallesi Rıza Anter Caddesi No:51 (3030. Sokak bağlantısı) üzerinde',
      sources: [
        [
          'Yemeksepeti — Essahlı Adana İşi Torba',
          'https://www.yemeksepeti.com/',
          'community',
          'Zırh kıymalı Adana ve Urfa kebap, dürüm, tavuk şiş, mercimek çorbası ve kiloluk kebap menüsü ile altmışın üzerinde sipariş geri bildirimi',
        ],
        [
          'Yandex Harita — Essahlı Adana İşi',
          'https://yandex.com.tr/harita',
          'community',
          'Rıza Anter Cd. / 3030. Sk. Torba konumu, gece geç saatlere kadar açık kebapçı profili',
        ],
        [
          'Rehberi.pro & Infobel — Essahlı Adana İşi Torba',
          'https://rehberi.pro/',
          'community',
          'Torba Rıza Anter Cd. No:51 işletme, çalışma ve Instagram iletişim kaydı',
        ],
        [
          'Essahlı Adana İşi Resmi Instagram',
          'https://www.instagram.com/essahliadanaisikebap',
          'operator',
          'İşletme resmi Instagram hesabı, Adana kebap sunumları ve adres doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=6277223547281568223',
          'maps',
          'Torba Rıza Anter Cd. No:51 konum ve kebab_shop tür doğrulaması',
        ],
      ],
      pros: [
        'Torba içinde deniz ürünlerinden farklı olarak zırh kıyması Adana kebap ve dürüm odağında net uzmanlaşma',
        'Gece geç saatlere kadar açık kalması ve kiloluk servis gibi pratik grup seçenekleri sunması',
      ],
      cons: [
        'Ana yol/cadde aksında kaldığı için sahil manzarası ve oturma konforu beklentisine hitap etmez',
        'Sipariş yoğunluğunda paketleme veya garnitür içeriğinde tutarsızlık bildirimleri görülebiliyor',
      ],
      unc: ['Kış döneminde geç gece kapanış saatleri işletme yoğunluğuna göre güncellenebiliyor'],
    }),

    // ==================== 7. BALIKÇILAR & DENİZ ÜRÜNLERİ ====================
    compactSeed({
      id: 'gonca-balik-torba',
      placeId: 'ChIJF40NW3hyvxQRiOYF-fBfuZs',
      cat: 'balik',
      secondaryCategoryIds: ['date'],
      brand: 'gonca',
      area: 'Mutlu Sk. (Kilise Mevkii), Torba',
      signals: ['1987_kurulus_miras', 'kum_ustu_masalar', 'yil_boyu_acik_balikci'],
      flags: { heritage: true },
      verifiedAt: '2026-11-16',
      desc: "1987 yılından bu yana Torba Kilise Mevkii sahilinde kumların üzerine kurulu masalarıyla hizmet veren, yıl boyunca açık kalan köklü kıyı balıkçısı. Torba teknelerinden gelen günlük taze balıkları, kırka yakın meze çeşidini ve Gonca Börek ile balık kokoreç gibi özel ara sıcakları dalga sesleri eşliğinde sunar.",
      order: ['Kömürde Günlük Taze Balık (Lagos / Sinarit / Levrek)', 'Gonca Börek & Karidesli Mantı', 'Girit Ezmesi & Sıcak Otlu Ege Mezeleri'],
      menu: [
        'Günlük Taze Balık (Deniz Levreği, Çipura, Lagos, Sinarit, Barbun)',
        'Gonca Börek',
        'Karidesli Mantı',
        'Ahtapot Beğendi & Izgara Ahtapot',
        'Balık Kokoreç & Fener Balığı Kavurma',
        'Deniz Mahsullü Pazı Sarma',
        'Girit Ezmesi, Deniz Börülcesi & Kırk Çeşit Meze',
        'Kalamar Tava & Izgara',
        'Dondurmalı İrmik & Fırında Helva',
      ],
      sec: [
        [
          'Balık Kokoreç & Deniz Mahsullü Pazı Sarma',
          'Klasik kalamar ve ahtapot dışında mutfağın özgün deniz mahsullü sıcak başlangıçları arasında öne çıkar.',
          'Gonca Balık menü kayıtları ve Yandex Harita değerlendirmeleri',
        ],
        [
          'Dondurmalı İrmik & Fırında Helva',
          'Rakı-balık sofrasının ardından tercih edilen klasik sıcak ve soğuk tatlı kapanışlarıdır.',
          'Mes Prestiges Bodrum sahil seçkisi',
        ],
      ],
      seat: 'Torba Kilise Mevkii kumsalında doğrudan kum üzerine yerleştirilmiş fener ışıklı denize sıfır masalar',
      crowd: 'Uzun yıllardır süregelen müdavim kitlesiyle samimi ve nostaljik; yüksek yaz sezonu hafta sonlarında yoğun',
      dis: 'Yüksek fiyat segmentindedir ve hesap tutarına yönelik eleştiriler görülebilir; yaz pik sezonunda masa doluluğu ve servis yavaşlaması yaşanabildiğinden önceden rezervasyon gerekir',
      transit: 'Torba Mahallesi Kilise Mevkii Mutlu Sokak No:15 üzerinde sahil hattında',
      sources: [
        [
          'Hürriyet — Bodrum Sahil Balıkçıları (Savaş Özbey & Saffet Emre Tonguç)',
          'https://www.hurriyet.com.tr/',
          'editorial',
          'Torba sahilinde kum üstü masalarda kömürde balık, Gonca Börek ve nostaljik Ege sofrası değerlendirmesi',
        ],
        [
          'Mes Prestiges — Gonca Balık 1987 Torba',
          'https://www.mesprestiges.com/',
          'editorial',
          '1987 kuruluşlu, kışın da açık kalan köklü balıkçı, 40 çeşit meze ve ağustos rezervasyon tavsiyesi',
        ],
        [
          'Meyhankoli — Gonca Balık Zeki Torba',
          'https://www.meyhankoli.com/',
          'editorial',
          'Zeki Soylu işletmeciliği ve 1990’lardan bugüne uzanan müdavim kitlesi profili',
        ],
        [
          'Yandex Harita & Restoranım.net — Gonca Balık Bodrum',
          'https://yandex.com.tr/harita',
          'community',
          'Girit ezmesi, sıcak otlu mezeler ve taze balık beğenisinin yanında yüksek fiyat şikayetleri notu',
        ],
        [
          'Gonca Balık Resmi Sitesi',
          'http://www.goncabalik.net/',
          'operator',
          'Kilise Mevkii Mutlu Sk. No:15 adresi, Gonca Börek, karidesli mantı, ahtapot beğendi ve balık kokoreç menüsü',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=11221105435145004680',
          'maps',
          'Torba Mutlu Sk. No:15 konum, seafood_restaurant türü ve operasyon doğrulaması',
        ],
      ],
      pros: [
        '1987’den bu yana Torba koyunda otel dönüşümüne rağmen ayakta kalan yıl boyu açık özgün kum üstü balıkçı',
        'Gonca Börek, karidesli mantı, balık kokoreç ve 40’a yakın günlük meze ile güçlü mutfak hafızası',
      ],
      cons: [
        'Yüksek fiyat seviyesi ve sezon içi hesap tutarı eleştirileri dikkat gerektirir',
        'Ağustos ve hafta sonu akşamlarında rezervasyonsuz masa bulmak güçtür, servis temposu yavaşlayabilir',
      ],
      unc: ['Günlük av ve mevsime bağlı taze balık çeşitleri ile porsiyon fiyatları günün tedarikine göre değişmektedir'],
    }),

    // ==================== NEGATIVE CONTROLS (POLİTİKA KAPISI DENETİMİ) ====================
    // Kapı 1 — Kalıcı Olarak Kapalı İşletmeler (CLOSED_PERMANENTLY)
    negControl(
      'ctrl-torba-mehmetin-yeri',
      'ChIJ2WPqXi1pvhQRGAwpbBSVH_w',
      'denemelisin',
      'Kapı 1 ihlali: Mehmetin Yeri Restorant kalıcı olarak kapalı (CLOSED_PERMANENTLY)'
    ),
    negControl(
      'ctrl-torba-doner-kebap-ev-yemekleri',
      'ChIJyQL2WP9pvhQRcHFL-8MiLJ0',
      'denemelisin',
      'Kapı 1 ihlali: Torba Döner, Kebap - Ev Yemekleri kalıcı olarak kapalı (CLOSED_PERMANENTLY)'
    ),

    // Kapı 3 — Yeme-İçme Dışı Tür Kontrolleri (Otel / Resort / AVM)
    negControl(
      'ctrl-torba-susona-bodrum-hotel',
      'ChIJr-wURTNpvhQRgfqUtlooL3o',
      'date',
      'Kapı 3 ihlali: Susona Bodrum, LXR Hotels & Resorts resort_hotel türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-torba-voyage-torba-hotel',
      'ChIJdzNmBu9pvhQRJf3tEZvJTAM',
      'date',
      'Kapı 3 ihlali: Voyage Torba hotel türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-torba-hyde-bodrum-hotel',
      'ChIJf76bsKJpvhQRgY8dv19awPA',
      'date',
      'Kapı 3 ihlali: Hyde Bodrum hotel türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-torba-hotel-zeytinada',
      'ChIJtZF5TEBsvhQRmSsj7oOcaw0',
      'kahvalti',
      'Kapı 3 ihlali: Hotel Zeytinada hotel türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-torba-hotel-torbahan',
      'ChIJIeqJV9NuvhQRXxPW2X0FhM0',
      'date',
      'Kapı 3 ihlali: Hotel Torbahan hotel türü FOOD_PLACE_TYPES dışında (ayrıca ★4.2 puanı 4.4 tabanının altında)'
    ),
    negControl(
      'ctrl-torba-bodrum-shop-and-go',
      'ChIJi-U949lpvhQROks5MOuqQqY',
      'kahve',
      'Kapı 3 ihlali: Bodrum Shop & Go shopping_mall türü FOOD_PLACE_TYPES dışında (ayrıca ★4.0 puanı)'
    ),

    // Kapı 2 — Zincir & Çok Şubeli Marka Kontrolleri
    negControl(
      'ctrl-torba-starbucks',
      'ChIJb2-XqoVpvhQRl9-iMRF7Krw',
      'kahve',
      'Kapı 2 & Kapı 6 ihlali: Starbucks global kahve zinciri (CHAIN_BLOCKLIST) ve ★4.2 (580) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-torba-big-chefs-yahsi',
      'ChIJsQWi249zvhQRQAJPFYXuDz0',
      'date',
      'Kapı 2 & Kapı 4 ihlali: Big Chefs ulusal brasserie zinciri (CHAIN_BLOCKLIST: big chefs) ve Müskebi/Yahşi konumu Torba dışında'
    ),

    // Kapı 6, Kapı 3B, Eksik Veri & Yinelenen Pin Kontrolleri
    negControl(
      'ctrl-torba-belediye-kafe-dup',
      'ChIJO1_Ck0xpvhQR1IAT9ywA0iE',
      'kahvalti',
      'Yinelenen harita pini kontrolü: belediye Kafe (★4.5, 40 oy) Torba Cafe - Bodrum Belediye A.Ş. (826 oy) ile aynı Torba Halk Plajı tesisinin ikincil kaydı; kanonik ana kayıt seçildi'
    ),
    negControl(
      'ctrl-torba-suyah-bodrum',
      'ChIJhWCIzO9pvhQRrXMh-uuCnVY',
      'date',
      'Kapı 6 ihlali: Suyah Bodrum primaryType eksik ve ★4.3 (215) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-torba-plaji',
      'ChIJjXnfySxpvhQREHdF1R97SoU',
      'kahvalti',
      'Kapı 6 ihlali: Torba Plajı ★4.2 (131) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-torba-unlu-mamulleri',
      'ChIJQ-zKx0lpvhQR8Q2MzPzJ9y8',
      'kahve',
      'Kapı 3B & Kapı 6 ihlali: Torba Unlu Mamulleri bakery türü kahve uzmanlığı dışı ve ★4.0 (424) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-torba-karya-firin',
      'ChIJmWqoB0ppvhQRFYsf1rQ4iUg',
      'kahvalti',
      'Kapı 6, Kapı 3B & Yeni Zincir Adayı: KARYA FIRIN Marmaris/Bodrum çok şubeli fırın zinciri (Torba/Gündoğan/Konacık/Bitez/Adabükü — CHAIN_BLOCKLIST adayı: karya firin), pastry_shop türü ve ★3.7 (574) puanı'
    ),
    negControl(
      'ctrl-torba-mercan-restaurant-beach',
      'ChIJKVBIxCxpvhQRylRu48F9phc',
      'balik',
      'Kapı 6 ihlali: Mercan Restaurant & Beach ★4.0 (95) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-torba-sanat-evi-restoran',
      'ChIJaXXwpNRuvhQR86cqlGjAh5c',
      'denemelisin',
      'Kapı 6 ihlali: Sanat Evi Restoran ★4.0 (51) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-torba-zeytinkoy-cafe',
      'ChIJySOmCdRpvhQRb8gGCG_A0Mk',
      'date',
      'Kapı 4 & Kapı 6 ihlali: ZeytinKöy Cafe Restaurant ★3.4 (68) puanı 4.4 tabanının çok altında ve güney bbox sınırı (37.0543 < 37.0550) dışında'
    ),
    negControl(
      'ctrl-torba-sanat-evi-pin2',
      'ChIJe9zuG3dtvhQRbsJqk6C0rW8',
      'denemelisin',
      'Kapı 6 ihlali: Torba Sanat Evi ★2.6 (21 oy < 35) hem puan hem değerlendirme hacmi eşiklerinin çok altında'
    ),
    negControl(
      'ctrl-torba-karya-lounge-doner',
      'ChIJmeqz5iVtvhQRVCFW3Nqc93U',
      'denemelisin',
      'Kapı 6 ihlali: Karya Lounge & Döner değerlendirme sayısı (15 < 35) minimum hacim eşiğinin altında'
    ),
    negControl(
      'ctrl-torba-dalli-restaurant',
      'ChIJeRo_ptRuvhQRmjeX1aZBWoE',
      'balik',
      'Kapı 6 ihlali: Dalli Restaurant değerlendirme sayısı (34 < 35) minimum hacim eşiğinin altında'
    ),
    negControl(
      'ctrl-torba-el-papi-usuluk',
      'ChIJOVp6lHBpvhQRl93d58iPtag',
      'date',
      'Kapı 6 ihlali: El Papi Spanish Meat & Paella Bar değerlendirme sayısı (19 < 35) minimum hacim eşiğinin altında'
    ),

    // Kapı 4 — Dış Mahalle & Komşu Belde Sınır Kontrolleri (Gölköy, Gündoğan, Bodrum Merkez, Çiftlik)
    negControl(
      'ctrl-torba-paper-moon-golkoy-outside',
      'ChIJHWXQjNhvvhQRZLXgz4C3_Uc',
      'date',
      'Kapı 4 & Kapı 6 ihlali: Paper Moon Gölköy Mahallesi (37.1144 > maxLat 37.1095) Torba sınırı dışında; ayrıca çok şehirli zincir ve ★3.8 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-torba-kaana-gundogan-outside',
      'ChIJfUsVHTtwvhQR_9Up6czxrmM',
      'date',
      'Kapı 4 ihlali: Kaana Restoran Gündoğan Mahallesi, Torba bbox ve mahalle sınırı dışında (Gündoğan snapshotında yayında)'
    ),
    negControl(
      'ctrl-torba-egede-maya-carsi-outside',
      'ChIJnYkq2dq3yhQR4Ry2RTSvWdA',
      'denemelisin',
      "Kapı 4 ihlali: Ege'de Maya Bodrum Çarşı Mahallesi (Bodrum Merkez), Torba bbox ve mahalle sınırı dışında"
    ),
    negControl(
      'ctrl-torba-sultan-bahce-umurca-outside',
      'ChIJAXpO8W9tvhQRjZa7v1IcGio',
      'balik',
      'Kapı 4 ihlali: sultan bahçe restaurant Umurca Mahallesi (Bodrum Merkez), Torba bbox ve mahalle sınırı dışında'
    ),
    negControl(
      'ctrl-torba-zeytinli-bahce-ciftlik-outside',
      'ChIJObw8SMBBvhQRBdJloHINUE0',
      'denemelisin',
      'Kapı 4 ihlali: Zeytinli Bahçe Restaurant Çiftlik Mahallesi, Torba bbox (27.563 > maxLng 27.515) ve mahalle sınırı dışında'
    ),
  ],
};
