import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const MUGLA_BODRUM_TURKBUKU_DEF: V3RegionDefinition = {
  id: 'turkbuku-bodrum-mugla',
  slug: 'turkbuku',
  city: 'Muğla',
  district: 'Bodrum',
  allowedDistricts: ['Bodrum'],
  neighborhood: 'Türkbükü',
  officialQuarter:
    'Türkbükü & Gölköy Mahalleleri — Göltürkbükü Koyu (Liman Caddesi, İnönü Caddesi, Gölköy Sahili, Hebil & Cennet Koyu)',
  displayName: 'Türkbükü, Bodrum, Muğla',
  locative: "Türkbükü'nde",
  path: ['mugla', 'bodrum', 'turkbuku'],
  aliases: [
    'Türkbükü',
    'Turkbuku',
    'Göltürkbükü',
    'Golturkbuku',
    'Gölköy',
    'Golkoy',
    'Cennet Koyu',
    'Hebil',
    'Türkbükü Sahil',
  ],
  scopeNote:
    'Türkbükü Liman & İnönü Caddeleri, Gölköy Sahili, Hebil & Cennet Koyu Hattı · Doğrulanmış Seçki',
  characterSubtitle:
    'Türkbükü Liman ve İnönü caddelerinden Gölköy sahil bandına, arka sokaklardaki ekşi mayalı artizan fırınlara ve balıkçı barınağı çevresine uzanan Ege aksanlı İtalyan mutfağı, brioche burgerciler, halk plajı kıyısında belediye sahil kafesi, iskele şef restoranları, serpme köy kahvaltıları, yöresel ev yemekleri ve kıyı balıkçıları.',
  center: { lat: 37.1275, lng: 27.3815 },
  bbox: { minLat: 37.1100, maxLat: 37.1520, minLng: 27.3620, maxLng: 27.4450 },
  allowedNeighborhoodTokens: [
    'Türkbükü',
    'Turkbuku',
    'Göltürkbükü',
    'Golturkbuku',
    'Gölköy',
    'Golkoy',
    'Cennet Koyu',
    'Hebil',
  ],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // ==================== 1. PİZZA ====================
    compactSeed({
      id: 'mila-turkbuku',
      placeId: 'ChIJ0UptUyBvvhQRopl9PCtMpDA',
      cat: 'pizza',
      secondaryCategoryIds: ['date'],
      brand: 'mila',
      area: 'İnönü Cd., Türkbükü',
      signals: ['deniz_kenari_italyan', 'eski_ship_a_hoy_noktasi', 'imza_kokteyl'],
      verifiedAt: '2026-11-16',
      desc: "Türkbükü İnönü Caddesi'nde eski Ship a Hoy yerinde konumlanan, Ege ürünleriyle buluşan İtalyan ve Akdeniz mutfağını deniz manzaralı terası ve imza kokteylleriyle birleştiren restoran-bar.",
      order: ['Margherita Pizza', 'Quattro Formaggi Pizza', 'Diavola Pizza'],
      menu: [
        'Margherita Pizza',
        'Ortolana Pizza',
        'Fungi Pizza',
        'Quattro Formaggi Pizza',
        'Capricciosa Pizza',
        'Diavola Pizza',
        'Taze İtalyan Makarnaları',
        'Carpaccio Çeşitleri',
        'İmza Kokteyller',
      ],
      sec: [
        [
          'Taze İtalyan Makarnaları & Carpaccio',
          'Pizza dışında akşam servisinde Akdeniz başlangıçları ve el yapımı makarnalarla masa kurulur.',
          'Yemeksepeti menüsü ve Bodrum Guru incelemesi',
        ],
        [
          'Meyveli İmza Kokteyller',
          'Gün batımı sonrası bar bölümünde müzik eşliğinde tercih edilen bar menüsüdür.',
          'Şamdan ve SonDakika gezi haberleri',
        ],
      ],
      seat: 'Denize nazır açık sahil oturma düzeni, bar köşesi ve akşam yemek masaları',
      crowd: 'Yaz akşamlarında rezervasyonlu misafirlerle hareketli fakat kulüp gürültüsünden uzak sakin tempo',
      dis: 'Üst-orta fiyat segmentinde yer alır; popüler yaz akşamlarında önceden rezervasyon gerekebilir',
      transit: 'Türkbükü İnönü Caddesi No:44/4 üzerinde sahil yürüyüş hattında',
      sources: [
        [
          'Şamdan — Mila Türkbükü Açılış & İşletme Haberi',
          'https://www.samdan.com.tr/',
          'editorial',
          'İlgi Gövsa ve Celal Altınel işletmeciliğinde eski Ship a Hoy yerinde açılan konsept detayı',
        ],
        [
          'Bodrum Guru — Mila Türkbükü',
          'https://www.bodrumguru.com/',
          'editorial',
          'Ege aksanlı İtalyan mutfağı, rezervasyonlu butik restoran-bar incelemesi',
        ],
        [
          'SonDakika — Mila Türkbükü Kokteyl & Dekorasyon',
          'https://www.sondakika.com/',
          'editorial',
          'Taze meyveli imza kokteyller ve deniz kenarı dekorasyon tanıtımı',
        ],
        [
          'Yemeksepeti — Mila Türkbükü Menü',
          'https://www.yemeksepeti.com/',
          'community',
          'Margherita, Ortolana, Fungi, Quattro Formaggi, Capricciosa ve Diavola pizza menü kayıtları',
        ],
        [
          'Restaurant Guru — Mila Türkbükü',
          'https://restaurantguru.com/',
          'community',
          'Akdeniz mutfağı, makarna ve deniz manzaralı akşam servisi değerlendirmeleri',
        ],
        [
          'Mila Türkbükü Resmi Sitesi',
          'http://www.milaturkbuku.com/',
          'operator',
          'Türkbükü İnönü Caddesi No:44/4 resmi işletme kaydı',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=3505010158583257506',
          'maps',
          'Türkbükü İnönü Caddesi 44/4 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Taş fırın pizza çeşitliliğini carpaccio, makarna ve imza kokteyllerle tamamlayan deniz kenarı mekan',
        'Yüksek sesli plaj kulüplerine alternatif daha nezih ve sakin bir akşam atmosferi sunması',
      ],
      cons: [
        'Türkbükü sahil hattı sebebiyle fiyat seviyesi iç sokak restoranlarına göre yüksek kalabiliyor',
        'Yaz sezonu dışında servis gün ve saatleri mevsime göre değişebiliyor',
      ],
      unc: ['Sezon içi kahvaltı ile akşam servisi menü kapsamı dönemlere göre güncellenebiliyor'],
    }),

    // ==================== 2. HAMBURGER ====================
    compactSeed({
      id: 'horn-turkbuku',
      placeId: 'ChIJr8vGJy1vvhQRzkRVLjnLh_s',
      cat: 'hamburger',
      brand: 'hörn',
      area: 'Şht. Gaffur Kaynar Cd., Türkbükü',
      signals: ['brioche_ekmek', 'ozel_burger_soslari', 'agaclar_alti_bahce'],
      verifiedAt: '2026-11-16',
      desc: "Şehit Gaffur Kaynar Caddesi'nde ağaçlar altındaki sakin bahçesinde yumuşak brioche ekmeğine hazırlanan burgerleri, ev yapımı trüf-sriracha sosları ve churros tarzı patates kızartmasıyla bilinen burgerci.",
      order: ['Hörnbükü Burger', 'Truffle Burger', 'Blue Cheeseburger'],
      menu: [
        'Hörnbükü Burger',
        'Truffle Burger',
        'Blue Cheeseburger',
        'Cheeseburger',
        'Curry Burger',
        'Chicken Burger',
        'Trüflü Parmesanlı Patates Kızartması',
        'Napoli Usulü Pizza',
      ],
      sec: [
        [
          'Trüflü Parmesanlı & Baharatlı Patates Kızartması',
          'Sade churros kesim patates dışında trüflü parmesan ve özel soslarla servis edilen yan ürün seçeneğidir.',
          'Qrdos dijital menü ve Migros Yemek kayıtları',
        ],
        [
          'Özel Dip Soslar (Trüflü Mayonez & Barbekü Sriracha)',
          'Burger ve patateslerin yanında tercih edilen imza sos çeşitleridir.',
          'Yemeksepeti menü listesi',
        ],
      ],
      seat: 'Ağaçlar altında gölgeli açık bahçe masaları ve cadde cephesinde rahat oturma düzeni',
      crowd: 'Öğle sonrası plaj dönüşü ve akşam saatlerinde genç tatilcilerle hareketli ama ferah tempo',
      dis: 'Sahil bandının bir arka caddesinde kaldığından deniz manzarası bulunmaz; yoğun saatlerde paket sipariş trafiği masalara servisi yavaşlatabilir',
      transit: 'Türkbükü Şehit Gaffur Kaynar Caddesi No:24 üzerinde merkez yürüyüş aksında',
      sources: [
        [
          'Onedio — Bodrum Burger Mekanları Derlemesi',
          'https://onedio.com/',
          'editorial',
          'Ağaçlar altındaki konumu, brioche ekmeği ve Hörnbükü / Truffle / Blue Cheese burgerleri vurgusu',
        ],
        [
          'Bodrum Guru — Hörn Türkbükü',
          'https://www.bodrumguru.com/',
          'editorial',
          'Türkbükü burger ve sokak lezzeti seçkisinde öne çıkan mekan değerlendirmesi',
        ],
        [
          'Migros Yemek & Yemeksepeti — Hörn Türkbükü',
          'https://www.yemeksepeti.com/',
          'community',
          'Hörnbükü Burger, Truffle Burger, Chicken Burger ve özel sos menü kayıtları',
        ],
        [
          'Hörn Türkbükü QR Menü & Instagram',
          'http://www.instagram.com/hornturkbuku',
          'operator',
          'Şehit Gaffur Kaynar Cd. No:24 adresi ve patates-sos menü detayı',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=18124678671826765006',
          'maps',
          'Şht. Gaffur Kaynar Cd. No:24 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Brioche ekmek, mantar duxelles ve avokado kremalı Hörnbükü gibi özgün reçeteler sunması',
        'Sahil kulüplerine göre daha ulaşılabilir orta bütçe seviyesinde hızlı ve doyurucu seçenek olması',
      ],
      cons: [
        'Kıyı hattının arka sokağında yer alması nedeniyle manzara beklentisine hitap etmez',
        'Yaz sezonu dışında mevsimsel kapanış veya kısa çalışma düzenine geçebiliyor',
      ],
      unc: ['Sezon dışı aylarda açık kalma takvimi işletme tarafından mevsime göre belirleniyor'],
    }),
    compactSeed({
      id: 'intense-burger-bistro-turkbuku',
      placeId: 'ChIJywmj_8JvvhQRqmAlPRIrxEE',
      cat: 'hamburger',
      brand: 'intense',
      name: 'Intense Burger & Bistro',
      area: '85. Sokak, Türkbükü',
      signals: ['gece_gec_servis', 'bazlama_tost', 'bistro_burger'],
      verifiedAt: '2026-11-16',
      desc: "Türkbükü 85. Sokak'ta geniş iç alanıyla akşam ve gece geç saatlere kadar hizmet veren; özel soslu dana burgerlerinin yanında kavurmalı bazlama tostları ve atıştırmalık tabaklarıyla bilinen bistro.",
      order: ['İntense Cheddar Burger', 'İntense Roquefort Burger', 'İntense Magic Mushroom Burger'],
      menu: [
        'İntense Cheddar Burger',
        'İntense Roquefort Burger',
        'İntense Magic Mushroom Burger',
        'Chipotle Burger',
        'Meksikan Burger',
        'BBQ Burger',
        'Kavurmalı Kaşarlı Bazlama Tost',
        'Chicken Cheddar Burger',
      ],
      sec: [
        [
          'Kavurmalı Kaşarlı Bazlama Tost',
          'Burger dışında geç saat atıştırmalığı veya hızlı öğün arayanların sıkça seçtiği bistro ürünüdür.',
          'Qrdos dijital menü kayıtları',
        ],
        [
          'Chipotle & Meksikan Burger',
          'Baharatlı ve acı sos tercih edenler için klasik cheddar seçeneğine alternatif sunar.',
          'Yemeksepeti menü listesi',
        ],
      ],
      seat: 'Geniş iç salon, sokak cephesi oturma alanı ve bistro-bar düzeni',
      crowd: 'Özellikle akşam saatlerinden gece yarısı sonrasına kadar genç gruplar ve gece geç acıkanlarla canlı',
      dis: 'Bistro bünyesinde nargile servisi de bulunduğu için koku hassasiyeti olanlar iç mekandan ziyade açık havayı veya paket siparişi tercih edebilir; yoğun yaz gecelerinde servis temposu dalgalanabiliyor',
      transit: 'Türkbükü Mahallesi 85. Sokak No:6/4 üzerinde merkez sokaklar içinde',
      sources: [
        [
          'Yemeksepeti — Intense Burger & Bistro Türkbükü',
          'https://www.yemeksepeti.com/',
          'community',
          'İntense Cheddar, Roquefort, Magic Mushroom, Chipotle burger menüsü ve paket teslimat memnuniyeti',
        ],
        [
          'Yandex Harita — Intense Burger & Bistro',
          'https://yandex.com.tr/harita',
          'community',
          '85. Sokak No:6/4 konumu, geç saatlere kadar açık bistro yapısı, nargile ve doyurucu porsiyon notları',
        ],
        [
          'Qrdos QR Menü — Intense Burger & Bistro',
          'https://qrdos.tr/',
          'operator',
          'Bazlama tost çeşitleri ve burger gramaj/sos içerikleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=4738960065235869866',
          'maps',
          'Türkbükü konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Türkbükü merkezinde gece geç saatlere kadar açık kalabilen nadir burger ve tost duraklarından biri',
        'Rokforlu, mantarlı ve chipotle gibi farklı sos profilleriyle doyurucu burger menüsü',
      ],
      cons: [
        'Mekanda nargile servisi bulunması sakin veya dumansız bir yemek ortamı arayanlar için dezavantaj oluşturabilir',
        'Dönemsel yoğunluklarda servis ve masa düzeni eleştirileri görülebiliyor',
      ],
      unc: ['Sezon içi ve sezon dışı gece kapanış saatleri yoğunluğa göre değişebiliyor'],
    }),

    // ==================== 3. KAHVE ====================
    compactSeed({
      id: 'turkbuku-cafe-belediye',
      placeId: 'ChIJa6QTTehvvhQR7jvMJ4SRNjo',
      cat: 'kahve',
      brand: 'türkbükü cafe',
      name: 'Türkbükü Cafe (Bodrum Belediyesi)',
      area: 'Liman Cd. (Halk Plajı), Türkbükü',
      signals: ['halk_plaji_kiyisi', 'belediye_sosyal_tesisi', 'uygun_fiyatli_kahve'],
      verifiedAt: '2026-11-16',
      desc: "Türkbükü halk plajıyla iç içe denize sıfır konumda Bodrum Belediyesi A.Ş. tarafından işletilen sosyal tesis kafesi. Özel plaj kulüplerinin aksine şeffaf belediye tarifesiyle Türk kahvesi, espresso çeşitleri ve serinletici içecek molası sunar.",
      order: ['Türk Kahvesi', 'Ice Latte & Espresso Çeşitleri', 'Demleme Çay & Limonata'],
      menu: [
        'Türk Kahvesi',
        'Espresso & Americano',
        'Ice Latte & Soğuk Kahveler',
        'Demleme Çay & Bitki Çayları',
        'Kahvaltı Tabağı & Menemen',
        'Tost & Atıştırmalıklar',
      ],
      sec: [
        [
          'Menemen & Tek Kişilik Türk Kahvaltısı',
          'Deniz kenarında sabah kahvesi yanında ekonomik kahvaltı yapmak isteyenler için mutfaktan çıkar.',
          'Bodrum Belediye A.Ş. resmi menü duyuruları',
        ],
        [
          'Tost & Sahil Atıştırmalıkları',
          'Gün içi yüzme molalarında içeceklerin yanına alınan pratik seçeneklerdir.',
          'Yandex Harita misafir geri bildirimleri',
        ],
      ],
      seat: 'Denize sıfır halk plajı kenarında açık hava sahil masaları ve gölgelik teras alanı',
      crowd: 'Sabah yürüyüşçülerinden ailelere ve bölge sakinlerine kadar gün boyu canlı ve kalabalık',
      dis: 'Üçüncü nesil nitelikli kahve kavurucusu değildir; belediye sosyal tesisi olarak yoğun yaz günlerinde boş masa bulmak ve sipariş sırası beklemek gerekebiliyor',
      transit: 'Türkbükü Liman Caddesi No:119 (halk plajı hattı) üzerinde sahil yürüyüş yolunda',
      sources: [
        [
          'Bodrum Belediyesi Resmi Sayfası — Türkbükü Cafe',
          'https://www.bodrum.bel.tr/tesis.php?id=197/Turkbuku_Cafe',
          'operator',
          'Bodrum Belediyesi A.Ş. sosyal tesis statüsü, denize sıfır halk plajı konumu ve iletişim kaydı',
        ],
        [
          'Bodrum Belediye A.Ş. Resmi Web Sitesi',
          'https://www.bodrumbelediyeas.com.tr/',
          'operator',
          'Tesis menü yapısı, kahvaltı-kahve hizmeti ve sosyal tesis işletme bilgisi',
        ],
        [
          'Muğla Gazetesi & Yerel Basın — Belediye Kafeleri',
          'https://www.muglagazetesi.com.tr/',
          'editorial',
          'Bodrum genelindeki belediye kafe işletmeleri ve erişilebilir fiyat politikası haberleri',
        ],
        [
          'Yandex Harita — Türkbükü Cafe Bodrum Belediyesi',
          'https://yandex.com.tr/harita',
          'community',
          'Halk plajı kıyısı manzara, kahve molası ve fiyat-performans değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=4194700099731602414',
          'maps',
          'Türkbükü Liman Cd. No:119 konum ve cafe türü doğrulaması',
        ],
      ],
      pros: [
        'Türkbükü sahilinde giriş ücreti veya yüksek harcama limiti olmadan denize sıfır kahve içilebilen sosyal tesis',
        'Bölgedeki özel beach ve kafelere kıyasla erişilebilir belediye fiyatlaması',
      ],
      cons: [
        'Özel kavurucu standartlarında nitelikli filtre/pour-over kahve odağı sunmaz, klasik kafe menüsüyle çalışır',
        'Hafta sonları ve yüksek sezonda sahil masaları çabuk dolabiliyor',
      ],
      unc: ['Yaz ve kış sezonlarında tesisin akşam kapanış saati belediye takvimine göre değişebiliyor'],
    }),

    // ==================== 4. DATE MEKANLARI ====================
    compactSeed({
      id: 'lago-bodrum-turkbuku',
      placeId: 'ChIJs0UZXxZvvhQRwnDFbB5reyA',
      cat: 'date',
      brand: 'lago',
      area: 'Gölköy Sahili, Türkbükü',
      signals: ['iskele_sef_restorani', 'beyaz_ortulu_aksam', 'ada_bar_kokteyl'],
      verifiedAt: '2026-11-16',
      desc: "Gölköy koyunda Babana Otel iskelesi ve sahilinde Şef Erol Akayay yönetiminde çalışan; gündüz plaj ve snack, akşam ise beyaz örtülü masalarda Ege-Akdeniz şef mutfağı ile ada bar kokteylleri sunan adres.",
      order: ['Siyah Sarımsaklı Karides', 'Günlük Ege Mezeleri & Taze Levrek', 'Farilya & Halikarnasos İmza Kokteylleri'],
      menu: [
        'Siyah Sarımsaklı Karides',
        'Izgara Kalamar & Taze Levrek',
        'Günlük Ege Zeytinyağlı Mezeleri',
        'Trüf Yağlı Pizzetta',
        'Somon Bowl',
        'Farilya & Halikarnasos İmza Kokteylleri',
        'Lago Serpme Kahvaltı',
      ],
      sec: [
        [
          'Trüf Yağlı Pizzetta & Taze Semizotlu Panzanella',
          'Gündüz sahil ve iskele saatlerinde akşam menüsünden önce tercih edilen hafif plaj tabaklarıdır.',
          'Ege Alternatif ve Müdavim.net incelemeleri',
        ],
        [
          'Bodrum Mandalina Reçelli & Egg Benedict Kahvaltı',
          'Sabah saatlerinde deniz kenarında serpme veya yumurta tabaklarıyla güne başlamak isteyenlere sunulur.',
          'FineDineMenu ve Babana Hotel menü kayıtları',
        ],
      ],
      seat: 'Gölköy koyuna uzanan geniş iskele masaları, ortadaki ada bar çevresi ve beyaz örtülü sahil akşam düzeni',
      crowd: 'Gün batımında kokteyl ve akşam yemeği için şık giyimli çiftler ve sakin tatil gruplarıyla dengeli hareketlilik',
      dis: 'Yüksek fiyat segmentinde yer alır; canlı müzik etkinlik akşamlarında ses seviyesi klasik romantik yemeklere göre yükselebilir',
      transit: 'Gölköy Mahallesi Yalı Mevkii No:5 (Babana Hotel içi), Akdeniz Caddesi sahil şeridinde',
      sources: [
        [
          'Kent TV Bodrum — Lago Bodrum & Şef Erol Akayay',
          'https://www.kenttv.net/',
          'editorial',
          'Şef Erol Akayay mutfak yönetimi, ada bar konsepti ve yerel mevsimsel Ege menüsü haberi',
        ],
        [
          'Ege Alternatif — Lago Bodrum İncelemesi',
          'https://www.egealternatif.com/',
          'editorial',
          'Gündüz plajdan akşam beyaz örtülü şef restoranına dönüşen konsept ve trüf yağlı pizzetta detayı',
        ],
        [
          'Müdavim.net — Lago Bodrum',
          'https://www.mudavim.net/',
          'community',
          'Babana Otel iskelesi, imza kokteyller ve canlı müzik akşamları değerlendirmesi',
        ],
        [
          'FineDineMenu & Babana Hotel Menü',
          'https://babanahotel.com/',
          'operator',
          'Serpme kahvaltı, Ege mezeleri ve siyah sarımsaklı deniz ürünleri menü doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=2340582209767174338',
          'maps',
          'Gölköy Yalı Mevkii No:5 konum ve mediterranean_restaurant kaydı',
        ],
      ],
      pros: [
        'Gölköy sahilindeki geniş iskelesi ve ada barıyla gün batımından geceye uzanan güçlü sahil atmosferi',
        'Şef imzalı Ege-Akdeniz tabakları ve Bodrum temalı kokteyl reçeteleri',
      ],
      cons: [
        'Yüksek bütçe segmentinde konumlanır',
        'Canlı müzik performansları olan gecelerde sohbet için iskele dışı masalar daha sakin kalabilir',
      ],
      unc: ['Etkinlik takvimi ve akşam servisi yaz sezonu dışındaki aylarda sınırlanabiliyor'],
    }),
    compactSeed({
      id: 'mana-turkbuku',
      placeId: 'ChIJ_TdWSn9vvhQRHRVq_yMMWXo',
      cat: 'date',
      brand: 'mana',
      area: 'Gölköy (36. Sokak), Türkbükü',
      signals: ['bohem_sahil_iskelesi', 'modern_meyhane_aksami', 'gun_batimi_kokteyl'],
      verifiedAt: '2026-11-16',
      desc: "Gölköy Yalı Mevkii'nde Faros Hotel bahçesi, kumsalı ve iskelesinde hizmet veren; bohem sahil tasarımını modern Ege mezeleri, deniz mahsulleri, seçkin rakı kavı ve akşam kokteylleriyle buluşturan akşam restoranı.",
      order: ['Modern Ege Mezeleri Seçkisi', 'Günün Deniz Mahsulleri & Taze Balık', 'Gün Batımı İmza Kokteylleri'],
      menu: [
        'Modern Ege Mezeleri',
        'Deniz Mahsullü Başlangıçlar',
        'Günlük Taze Balık Çeşitleri',
        'Akdeniz Ana Yemekleri',
        'Seçkin Rakı Kavı',
        'İmza Kokteyller',
      ],
      sec: [
        [
          'Seçkin Rakı Kavı & Meze Eşleşmesi',
          'Modern meyhane geleneğini sahil iskelesine taşıyan akşam sofralarının merkezinde yer alır.',
          'Hürriyet gezi yazısı ve Faros Hotel kayıtları',
        ],
        [
          'Bahçe ve İskele Lounge Kokteylleri',
          'Akşam yemeği öncesi gün batımını izlemek için kumsal ve iskele barında tercih edilir.',
          'OGGUSTO ve Bodrum Guru incelemeleri',
        ],
      ],
      seat: 'Denize sıfır kumsal, özel iskele ve yeşil otel bahçesi içinde ferah akşam masaları',
      crowd: 'Türkbükü merkezinin kalabalığından sıyrılmak isteyen çiftler ve akşam yemeği gruplarıyla dingin atmosfer',
      dis: 'Yüksek fiyat segmentinde yer alır; akşam à la carte servis odaklı olduğu için yaz sezonunda önceden rezervasyon önerilir',
      transit: 'Gölköy Mahallesi 36. Sokak (Yalı Mevkii) No:1/1, Faros Bodrum Hotel içinde',
      sources: [
        [
          'Hürriyet — Gölköy Faros Hotel & Ma’nâ Restoran',
          'https://www.hurriyet.com.tr/',
          'editorial',
          'Karaköy’ün modern meyhane kültürünü Gölköy bahçe-kumsal-iskele hattına taşıyan yaz konsepti haberi',
        ],
        [
          'OGGUSTO — Gölköy Sahil Restoranları',
          'https://www.oggusto.com/',
          'editorial',
          'Gölköy sahilinde gün batımı sofraları ve bohem sahil atmosferi seçkisi',
        ],
        [
          'Faros Hotel Bodrum Resmi Sitesi',
          'https://www.farosbodrum.com/',
          'operator',
          'Gölköy 36. Sokak No:1/1 konumu ve akşam à la carte servis bilgisi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=8816091094302987549',
          'maps',
          'Faros Bodrum Hotel Gölköy 36. Sk. No:1/1 konum doğrulaması',
        ],
      ],
      pros: [
        'Gölköy’ün sakin ve dalgasız koyunda kumsal ile iskelenin iç içe geçtiği romantik akşam ambiyansı',
        'Modern meyhane yaklaşımını Ege deniz ürünleriyle birleştiren rafine akşam servisi',
      ],
      cons: [
        'Üst fiyat bandında yer alması nedeniyle günlük spontane uğraklardan ziyade özel akşamlara uygundur',
        'Sezonluk otel restoranı yapısı nedeniyle kış aylarında kapalı olabiliyor',
      ],
      unc: ['Sezon açılış ve kapanış tarihleri ile dönemsel şef menüsü yaz takvimine göre güncelleniyor'],
    }),

    // ==================== 5. KAHVALTI ====================
    compactSeed({
      id: 'farina-turkbuku',
      placeId: 'ChIJQ9oOy6NvvhQR8KBooz-Uo2c',
      cat: 'kahvalti',
      brand: 'farina',
      area: '140. Sokak, Türkbükü',
      signals: ['eksi_mayali_ekmek', 'artizan_kruvasan', 'sabah_firini'],
      verifiedAt: '2026-11-16',
      desc: "Türkbükü 140. Sokak'ta uzun fermantasyonlu ekşi mayalı ekmekleri, tereyağlı kruvasanları ve günlük çıkan fırın ürünleriyle bilinen küçük ve gösterişten uzak artizan fırın.",
      order: ['Tereyağlı Kruvasan', 'Uzun Fermantasyon Ekşi Mayalı Ekmek (Cevizli / Zeytinli)', 'Artizan Simit'],
      menu: [
        'Ekşi Mayalı Sade Köy Ekmeği',
        'Cevizli & Zeytinli Ekşi Maya Ekmek',
        'Tereyağlı Kruvasan',
        'Artizan Simit',
        'Günlük Pastane & Poğaça Çeşitleri',
      ],
      sec: [
        [
          'Cevizli & Zeytinli Köy Ekmeği',
          'Evde veya teknede kahvaltı sofrası kurmak isteyenlerin sabah erken saatlerde aldığı imza ekmeklerdir.',
          'OGGUSTO ve MesPrestiges artizan fırın incelemeleri',
        ],
        [
          'Günlük Fırın Poğaça & Pastane Ürünleri',
          'Kruvasan dışında hızlı sabah atıştırmalığı arayanlar için sınırlı sayıda çıkar.',
          'farinabodrum.com resmi kayıtları',
        ],
      ],
      seat: 'Tek odalı kompakt artizan fırın tezgahı; ağırlıklı al-götür ve hızlı sabah uğrağı düzeni',
      crowd: 'Sabah açılış saatlerinden öğleye kadar taze ekmek ve kruvasan almaya gelen bölge sakinleriyle hareketli',
      dis: 'Serpme kahvaltı sunan büyük bir oturma bahçesi değildir; popüler ekmek ve kruvasanlar öğleden sonraya kalmadan tükenebiliyor',
      transit: 'Türkbükü 140. Sokak No:5 üzerinde sahil aksının bir arka sokağında',
      sources: [
        [
          'OGGUSTO — Bodrum Ekşi Maya Fırınları',
          'https://www.oggusto.com/',
          'editorial',
          'Bodrum yarımadasının öne çıkan ekşi mayalı artizan fırın seçkisi',
        ],
        [
          'MesPrestiges — Farina Bakery Türkbükü',
          'https://www.mesprestiges.com/',
          'editorial',
          'Baş pasta şefi Helin Ersöz mutfağı, kruvasan, uzun fermantasyon ekşi maya ekmekler ve öğle öncesi tükenme notu',
        ],
        [
          'Farina Bodrum Resmi Sitesi',
          'https://www.farinabodrum.com/',
          'operator',
          'Türkbükü 140. Sokak No:5 adres ve artizan fırın konsept doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=7467975608155807984',
          'maps',
          'Türkbükü 140. Sk. No:5 konum ve bakery türü doğrulaması',
        ],
      ],
      pros: [
        'Uzun fermantasyon ekşi maya ve gerçek tereyağlı kruvasan tekniğine odaklanan gerçek butik fırın',
        'Gösterişten uzak mahalle fırını atmosferi ve orta fiyat seviyesi',
      ],
      cons: [
        'Uzun oturmalı serpme kahvaltı mekanı değil, ağırlıklı tezgah ve al-götür odaklıdır',
        'Günlük üretim hacmi sınırlı olduğundan öğleden sonra çeşit azalır',
      ],
      unc: ['Hafta sonu özel ekmek çeşitleri için önceden telefonla ayırtma gerekebiliyor'],
    }),
    compactSeed({
      id: 'kahvalticim-turkbuku',
      placeId: 'ChIJMT0TftltvhQR1oZhMl8HKFo',
      cat: 'kahvalti',
      brand: 'kahvaltıcım',
      area: 'Atatürk Cd. (Gölköy), Türkbükü',
      signals: ['serpme_kahvalti', 'erken_sabah_servisi', 'ev_yemekleri_destegi'],
      verifiedAt: '2026-11-16',
      desc: "Gölköy Atatürk Caddesi'nde sabah erken saatlerden itibaren zengin serpme kahvaltı sofraları kuran, günün devamında ise taze tencere ve ev yemekleriyle hizmet veren mütevazı mahalle kahvaltıcısı.",
      order: ['Serpme Köy Kahvaltısı', 'Sıcak Omlet & Sahanda Yumurta Çeşitleri', 'Yöresel Peynir & Zeytin Tabağı'],
      menu: [
        'Serpme Kahvaltı',
        'Sıcak Omlet & Menemen',
        'Yöresel Peynir & Zeytin Çeşitleri',
        'Ev Yapımı Reçel & Bal-Kaymak',
        'Günlük Tencere & Ev Yemekleri',
      ],
      sec: [
        [
          'Günlük Tencere & Ev Yemekleri',
          'Sabah kahvaltı servisinin ardından öğle saatlerinde sıcak ev yemeği arayanlar için alternatif sunar.',
          'Restaurant Guru ve Menü Haritası kayıtları',
        ],
        [
          'Menemen & Sıcak Yumurta Tabakları',
          'Serpme sofraya ek veya tek kişilik hızlı kahvaltı tercihi olarak öne çıkar.',
          'Yandex Harita ziyaretçi notları',
        ],
      ],
      seat: 'Gölköy cadde cephesinde sade masa düzeni ve aile işletmesi servisi',
      crowd: 'Sabah erken yola çıkanlar, yerel esnaf ve ailelerle dengeli sabah trafiği',
      dis: 'Denize sıfır beach kahvaltısı yerine Gölköy ana caddesi üzerinde sade lokanta atmosferi sunar',
      transit: 'Gölköy Mahallesi Atatürk Caddesi No:169/A üzerinde toplu taşıma ve araç yolu üstünde',
      sources: [
        [
          'Restaurant Guru — Kahvaltıcım Türkbükü Ev Yemekleri',
          'https://restaurantguru.com/',
          'community',
          'Serpme kahvaltı, sıcak yumurta seçenekleri ve ev yemekleri menü değerlendirmeleri',
        ],
        [
          'Yandex Harita — Kahvaltıcım Türkbükü',
          'https://yandex.com.tr/harita',
          'community',
          'Atatürk Cd. No:169-A adresi, sabah erken servis ve yöresel kahvaltılık notları',
        ],
        [
          'Menü Haritası — Kahvaltıcım Gölköy',
          'https://menuharitasi.com/',
          'community',
          'Gölköy konum ve kahvaltı-ev yemeği işletme kaydı',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=6496450567930480342',
          'maps',
          'Gölköy Atatürk Cd. No:169-A konum ve breakfast_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Sahildeki yüksek maliyetli plaj kahvaltılarına karşı samimi ve orta bütçeli serpme kahvaltı alternatifi',
        'Sabah erken saatlerden akşama kadar açık kalmasıyla esnek ziyaret imkanı',
      ],
      cons: [
        'Deniz manzarası bulunmaz, cadde üzerinde sade bir mahalle düzenindedir',
        'Öğle ve akşam saatlerinde odak kahvaltıdan ev yemeklerine kayar',
      ],
      unc: ['Sezon içi ve sezon dışı serpme tabak içeriği taze malzeme teminine göre değişebiliyor'],
    }),

    // ==================== 6. MUTLAKA DENEMELİSİN ====================
    compactSeed({
      id: 'solmaz-hanimin-mutfagi-turkbuku',
      placeId: 'ChIJZ_B-BLJvvhQRGsFs63l2uqA',
      cat: 'denemelisin',
      brand: 'solmaz',
      area: 'Gölköy (39. Sokak), Türkbükü',
      signals: ['ege_zeytinyaglilari', 'ev_yapimi_manti_cigborek', 'butik_ev_mutfagi'],
      verifiedAt: '2026-11-16',
      desc: "Gölköy'ün ara sokaklarında bizzat Solmaz Hanım'ın mutfağından çıkan zeytinyağlı kabak çiçeği dolması, deniz börülcesi, el açması mini mantı ve çiğ börekleriyle bilinen küçük ve samimi ev yemekleri durağı.",
      order: ['Kabak Çiçeği Dolması & Zeytinyağlılar', 'Ev Yapımı Mini Mantı', 'El Açması Çiğ Börek'],
      menu: [
        'Kabak Çiçeği Dolması',
        'Deniz Börülcesi & Barbunya',
        'Ev Yapımı Mini Mantı',
        'Çiğ Börek & Gözleme Çeşitleri',
        'Et Kavurma & Sarma',
        'Şekerpare & Ev Tatlıları',
      ],
      sec: [
        [
          'Deniz Börülcesi & Zeytinyağlı Barbunya',
          'Bodrum mutfağını yansıtan günlük taze zeytinyağlılar olarak öne çıkar.',
          'Restoranım.net ve Maptons yerel rehber notları',
        ],
        [
          'Gözleme Çeşitleri & Ev Yapımı Şekerpare',
          'Ana yemek veya mantı sonrası hafif atıştırmalık ve ev tatlısı eşlikçisidir.',
          'Restaurant Guru ve yerel menü kayıtları',
        ],
      ],
      seat: 'Küçük, sakin mahalle sokak oturumu ve ev sıcaklığında samimi tezgah düzeni',
      crowd: 'Yolunu bilen müdavimler ve Gölköy sakinleriyle telaşsız, küçük ölçekli tempo',
      dis: 'Oturma kapasitesi çok sınırlı olduğundan kalabalık gruplara uygun değildir; günlük yemekler bittiğinde kapanabiliyor',
      transit: 'Gölköy Mahallesi 39. Sokak (Lale Sokak civarı) üzerinde iç mahalle yerleşiminde',
      sources: [
        [
          'Restoranım.net — Solmaz Hanımın Mutfağı',
          'https://www.restoranim.net/',
          'community',
          'Kabak çiçeği dolması, deniz börülcesi, mini mantı, çiğ börek ve gözleme menü detayları',
        ],
        [
          'Maptons — Solmaz Hanımın Mutfağı Gölköy',
          'https://www.maptons.com/',
          'community',
          'Yemeklerin bizzat Solmaz Hanım tarafından ev usulü hazırlandığına dair ziyaretçi kayıtları',
        ],
        [
          'Restaurant Guru — Solmaz Hanımın Mutfağı',
          'https://restaurantguru.com/',
          'community',
          'Ev yemekleri, sarma, dolma ve şekerpare menü geri bildirimleri',
        ],
        [
          'Yandex Harita — Solmaz Hanımın Mutfağı',
          'https://yandex.com.tr/harita',
          'community',
          'Gölköy 39. Sokak konum ve lezzet memnuniyeti doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=11581699657749545242',
          'maps',
          'Gölköy 39. Sk. konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Bölgenin lüks beach mutfaklarından tamamen ayrılarak gerçek Bodrum ev yemekleri ve hamur işleri sunması',
        'Her tabağın günlük, küçük parti üretilmesi sayesinde yüksek ev lezzeti standardı',
      ],
      cons: [
        'Küçük ve mütevazı bir işletme olduğundan manzara ya da geniş salon konforu arayanlara uygun değil',
        'Günlük çıkarılan yemeklerin tükenme ihtimali nedeniyle geç öğleden sonra çeşit azalabilir',
      ],
      unc: ['Sezon içi açılış günleri ve günlük yemek listesi ev üretimine bağlı olarak değişebiliyor'],
    }),
    compactSeed({
      id: 'omur-mutfak-turkbuku',
      placeId: 'ChIJPxT-L05vvhQRTM4rFcAd5Vw',
      cat: 'denemelisin',
      brand: 'ömür mutfak',
      area: '85. Sokak, Türkbükü',
      signals: ['gunluk_tencere_yemekleri', 'dana_kavurma_hunkarbegendi', 'aile_isletmesi'],
      verifiedAt: '2026-11-16',
      desc: "Türkbükü 85. Sokak'ta her sabah taze hazırlanan tencere yemekleri, zeytinyağlılar, hünkarbeğendi ve dana kavurma çeşitleriyle mahalle sakinlerine ve ziyaretçilere ev sıcaklığı sunan aile lokantası.",
      order: ['Dana Kavurma', 'Hünkarbeğendi', 'Zeytinyağlılar & Meze Tabağı'],
      menu: [
        'Dana Kavurma',
        'Hünkarbeğendi',
        'Etli Lahana Sarma & Karnıyarık',
        'Ev Yapımı Mantı',
        'Zeytinyağlılar & Mezeler',
        'Kuzu Pirzola & Izgara Köfte',
        'Mercimek & Düğün Çorbası',
      ],
      sec: [
        [
          'Etli Lahana Sarma & Ev Yapımı Mantı',
          'Günlük tencere menüsünde kavurma dışında öne çıkan geleneksel Türk ev yemekleridir.',
          'omurmutfak.com.tr ve Yemeksepeti menü listesi',
        ],
        [
          'Çömlekte Yoğurt & Düğün Çorbası',
          'Ana tencere yemeklerinin yanında tercih edilen geleneksel eşlikçilerdir.',
          'Yemeksepeti menü kayıtları',
        ],
      ],
      seat: 'Türkbükü iç sokak cephesinde sade lokanta masaları ve paket servis imkanı',
      crowd: 'Öğle saatlerinde bölge çalışanları ve ev yemeği arayan müdavimlerle canlı, akşamları daha sakin',
      dis: 'Sahil manzaralı gösterişli bir restoran değildir; menü çeşitliliği sabah hazırlanan günlük tezgahla sınırlıdır',
      transit: 'Türkbükü Mahallesi 85. Sokak No:5/4 üzerinde merkez yerleşim hattında',
      sources: [
        [
          'Ömür Mutfak Resmi Sitesi',
          'https://omurmutfak.com.tr/',
          'operator',
          '85. Sokak No:5/4 adresi, aile işletmesi yapısı ve günlük taze zeytinyağlı-tencere yemekleri bilgisi',
        ],
        [
          'Yemeksepeti — Ömür Mutfak Türkbükü',
          'https://www.yemeksepeti.com/',
          'community',
          'Dana kavurma, hünkarbeğendi, lahana sarma, mantı ve çorba menü doğrulaması',
        ],
        [
          'Yandex Harita — Ömür Mutfak',
          'https://yandex.com.tr/harita',
          'community',
          'Et yemekleri, zeytinyağlı çeşitleri ve samimi ev ortamı geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=6693789131982229068',
          'maps',
          'Türkbükü 85. Sk. konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Türkbükü içinde günlük taze tencere yemeği ve sulu ev yemeği bulmayı sağlayan güvenilir aile lokantası',
        'Hem yerinde öğün hem de çevredeki adreslere paket servis kolaylığı sunması',
      ],
      cons: [
        'Arka sokak lokantası atmosferi nedeniyle deniz kıyısı ambiyansı arayanlara hitap etmez',
        'Popüler et ve zeytinyağlı yemekler öğleden sonra tükenebiliyor',
      ],
      unc: ['Günlük çıkan tencere yemeği çeşitleri haftanın gününe göre değişiklik gösterebiliyor'],
    }),
    compactSeed({
      id: 'antakya-cuisine-turkbuku',
      placeId: 'ChIJxfJwDAZvvhQRVLikMwxk4r4',
      cat: 'denemelisin',
      brand: 'antakya',
      name: 'Antakya Cuisine',
      area: 'İlhan Feyman Sk., Türkbükü',
      signals: ['hatay_mutfagi', 'tepsi_kebabi_kunefe', 'deniz_yakini'],
      verifiedAt: '2026-11-16',
      desc: "Türkbükü İlhan Feyman Sokak'ta Hatay mutfağının geleneksel tepsi kebabı, Antakya kebabı ve sıcak künefe gibi yöresel lezzetlerini Bodrum sahil dokusuna taşıyan butik lokanta.",
      order: ['Antakya Tepsi Kebabı', 'Antakya Kebabı', 'Sıcak Künefe'],
      menu: [
        'Antakya Tepsi Kebabı',
        'Antakya Kebabı',
        'Et & Dürüm Alternatifleri',
        'Hatay Yöresel Mezeleri',
        'Sıcak Künefe',
      ],
      sec: [
        [
          'Hatay Yöresel Mezeleri',
          'Tepsi kebabı öncesi yöresel baharat ve ezme dengesiyle sofrayı açan başlangıçlardır.',
          'Yandex Harita ve Restoranım.net kayıtları',
        ],
        [
          'Sıcak Dürüm & Et Çeşitleri',
          'Daha pratik veya tek kişilik öğün tercih eden misafirler için menüde yer alır.',
          'Restoranım.net değerlendirmeleri',
        ],
      ],
      seat: 'İlhan Feyman Sokak üzerinde denize yakın butik masa düzeni',
      crowd: 'Balık ve İtalyan mutfağı dışında yöresel et ve kebap lezzeti arayan gruplarla sakin ama düzenli',
      dis: 'Küçük ölçekli bir yöresel restoran olduğu için kalabalık yaz akşamlarında yer bulmak için önceden aramak gerekebilir',
      transit: 'Türkbükü Mahallesi İlhan Feyman Sokak No:11 üzerinde sahil bandına yakın',
      sources: [
        [
          'Yandex Harita — Antakya Cuisine Türkbükü',
          'https://yandex.com.tr/harita',
          'community',
          'İlhan Feyman Sokak No:11 adresi, Antakya kebabı, tepsi kebabı ve künefe değerlendirmeleri',
        ],
        [
          'Restoranım.net — Antakya Cuisine Bodrum',
          'https://www.restoranim.net/',
          'community',
          'Hatay yöresel kebap, dürüm çeşitleri ve sıcak servis notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=13754666215511734356',
          'maps',
          'Türkbükü konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Deniz ürünleri ve beach mutfaklarının yoğun olduğu Türkbükü’nde özgün Hatay mutfağı alternatifi sunması',
        'Tepsi kebabı ve taze künefe ikilisiyle tutarlı yöresel lezzet profili',
      ],
      cons: [
        'Menüsü spesifik olarak Antakya et ve hamur tatlarına odaklıdır, deniz ürünleri seçeneği aranmamalıdır',
        'Büyük restoranlara kıyasla masa sayısı sınırlıdır',
      ],
      unc: ['Sezon dışı dönemlerde çalışma gün ve saatleri telefonla teyit edilmelidir'],
    }),
    compactSeed({
      id: 'buse-ev-yemekleri-turkbuku',
      placeId: 'ChIJ7U2Ba8VvvhQRah5GIwxV65Q',
      cat: 'denemelisin',
      brand: 'buse',
      area: 'Akdeniz Cd. (Gölköy), Türkbükü',
      signals: ['esnaf_lokantasi', 'cennet_koyu_kavsak', 'uygun_fiyatli_ev_yemegi'],
      verifiedAt: '2026-11-16',
      desc: "Gölköy Akdeniz Caddesi ile 1. Sokak kesişiminde Cennet Koyu kavşağı yakınında konumlanan, günlük sulu tencere yemekleri, zeytinyağlıları ve makul fiyat politikasıyla öne çıkan temiz esnaf lokantası.",
      order: ['Günlük Sulu Tencere Yemekleri', 'Zeytinyağlı Ev Yemekleri', 'Günün Çorbası'],
      menu: [
        'Günlük Etli Tencere Yemekleri',
        'Zeytinyağlı Sebze Yemekleri',
        'Günün Ev Çorbası',
        'Pilav & Makarna Çeşitleri',
        'Ev Yapımı Tatlılar',
      ],
      sec: [
        [
          'Pilav & Mevsim Salata Eşlikçileri',
          'Öğle servisinde sulu yemeklerin yanında tamamlayıcı olarak alınan sade lokanta eşlikçileridir.',
          'Yandex Harita ve Restaurant Guru kayıtları',
        ],
        [
          'Günün Ev Tatlısı',
          'Esnaf lokantası öğününü hafif bir kapanışla bitirmek isteyenler için tezgaha çıkar.',
          'Restoranım.net ziyaretçi notları',
        ],
      ],
      seat: 'Cadde köşesinde sade, temiz iç mekan ve birkaç dış masa',
      crowd: 'Özellikle öğle saatlerinde bölge esnafı, çalışanlar ve uygun fiyatlı ev yemeği arayanlarla dolu',
      dis: 'Pazar günleri kapalıdır ve yalnız gündüz-akşamüstü servisi verir; öğleden sonra geç kalındığında tencere çeşitleri azalır',
      transit: 'Gölköy 1. Sokak / Akdeniz Caddesi No:3/A üzerinde Cennet Koyu kavşağı yakınında',
      sources: [
        [
          'Restaurant Guru — Buse Ev Yemekleri Bodrum',
          'https://restaurantguru.com/',
          'community',
          'Gölköy 1. Sokak konumu, pazartesi-cumartesi çalışma düzeni ve sulu yemek değerlendirmeleri',
        ],
        [
          'Yandex Harita — Buse Ev Yemekleri',
          'https://yandex.com.tr/harita',
          'community',
          'Cennet Koyu kavşağı yakınındaki konumu, temizliği ve Bodrum ortalamasına göre makul fiyat notları',
        ],
        [
          'Restoranım.net — Buse Ev Yemekleri Gölköy',
          'https://www.restoranim.net/',
          'community',
          'Günlük tencere yemekleri ve zeytinyağlı esnaf lokantası konsepti',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=10730764047760105066',
          'maps',
          'Gölköy Akdeniz Cd. 3/A konum doğrulaması',
        ],
      ],
      pros: [
        'Cennet Koyu ve Gölköy hattında Bodrum ortalamasının altında, dürüst fiyatlı ve temiz ev yemeği sunması',
        'Yalnızca taze günlük üretimle dönen samimi esnaf lokantası çizgisi',
      ],
      cons: [
        'Pazar günleri kapalı olması ve akşam yemeği servisine kalmaması hafta sonu planlarını kısıtlar',
        'Gösterişli sahil oturma alanı yerine sade lokanta masaları vardır',
      ],
      unc: ['Günlük çıkan tencere yemekleri mevsim sebzelerine göre her gün değişir'],
    }),
    compactSeed({
      id: 'turkbuku-pasta-evi',
      placeId: 'ChIJGWDFuDVvvhQR9U9WLDOsydQ',
      cat: 'denemelisin',
      brand: 'türkbükü pasta evi',
      name: 'Türkbükü Pasta Evi',
      area: 'İnönü Cd., Türkbükü',
      signals: ['orman_meyveli_magnolia', 'aile_pastanesi', 'gece_acik_tatli'],
      verifiedAt: '2026-11-16',
      desc: "İnönü Caddesi üzerinde sıcak aile işletmesi atmosferiyle bilinen; orman meyveli magnoliası, günlük yaş pasta dilimleri, cheesecake çeşitleri, börekleri ve dondurma tezgahıyla hizmet veren mahalle pastanesi.",
      order: ['Orman Meyveli Magnolia', 'Günlük Cheesecake & Tart Çeşitleri', 'Taze Dilim Yaş Pasta'],
      menu: [
        'Orman Meyveli Magnolia',
        'Cheesecake & Meyveli Tart',
        'Çikolatalı & Meyveli Yaş Pastalar',
        'El Açması Börek & Poğaça',
        'Serpme Kahvaltı Tabağı',
        'Dondurma Çeşitleri',
      ],
      sec: [
        [
          'El Açması Börek & Sabah Kahvaltısı',
          'Sabah saatlerinde tatlı dışında tuzlu hamur işi veya pratik kahvaltı arayanlar için öne çıkar.',
          'Eatbu ve Maptons menü notları',
        ],
        [
          'Dondurma Çeşitleri',
          'Akşam sahil yürüyüşünde hafif soğuk tatlı arayanların uğrak kalemidir.',
          'Maptons ve ziyaretçi değerlendirmeleri',
        ],
      ],
      seat: 'İnönü Caddesi üzerinde samimi vitrin önü ve iç pastane masaları',
      crowd: 'Sabah kahvaltı-börek saati ile akşam yemek sonrası tatlı saatlerinde dengeli hareketlilik',
      dis: 'Turistik cadde konumu nedeniyle porsiyon fiyat algısı zaman zaman yüksek bulunabiliyor; kahve uzmanı bir kavurucu değildir',
      transit: 'Türkbükü İnönü Caddesi No:75 üzerinde merkezi sahil aksına paralel konumda',
      sources: [
        [
          'Maptons — Türkbükü Pasta Evi',
          'https://www.maptons.com/',
          'community',
          'İnönü Cd. No:75 adresi, orman meyveli magnolia, dondurma ve güler yüzlü aile işletmesi notları',
        ],
        [
          'Eatbu — Türkbükü Pasta Evi Menü',
          'https://eatbu.com/',
          'community',
          'Börek, cheesecake, tart, serpme kahvaltı ve yaş pasta çeşitleri kaydı',
        ],
        [
          'Restaurant Guru — Pasta Evi Türkbükü',
          'https://restaurantguru.com/',
          'community',
          'Sabah erken saatlerden gece geç saatlere kadar süren servis ve misafirperverlik değerlendirmesi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=15332975742146727925',
          'maps',
          'Türkbükü İnönü Cd. No:75 konum ve pastry_shop türü doğrulaması',
        ],
      ],
      pros: [
        'Türkbükü merkezinde sabah böreğinden gece tatlısına geniş saat aralığında hizmet veren aile pastanesi',
        'Orman meyveli magnolia ve taze pasta dilimleriyle mahalle içi tatlı ihtiyacını karşılaması',
      ],
      cons: [
        'Merkezi konum sebebiyle fiyat seviyesi yerel mahalle fırınlarının bir miktar üzerinde kalabiliyor',
        'Üçüncü nesil kahve uzmanı değil, klasik pastane ve tatlı tezgahı odağındadır',
      ],
      unc: ['Günlük üretilen pasta ve sütlü tatlı çeşitleri sezona göre farklılık gösterebiliyor'],
    }),

    // ==================== 7. BALIKÇILAR ====================
    compactSeed({
      id: 'cetimek-restaurant-turkbuku',
      placeId: 'ChIJKYiVRcJvvhQR_8VMg7_0rOc',
      cat: 'balik',
      secondaryCategoryIds: ['date'],
      brand: 'çetimek',
      area: '83. Sokak (Balıkçı Barınağı), Türkbükü',
      signals: ['balikci_barinagi_yani', 'nostaljik_bahce_meyhane', 'soslu_citir_karides'],
      verifiedAt: '2026-11-16',
      desc: "Türkbükü Liman Caddesi'nin ucunda, balıkçı barınağının hemen yanındaki ağaç altlı sakin bahçesinde hizmet veren; yerel teknelerden gelen taze balıkları, Ege mezeleri ve soslu çıtır karidesiyle klasik rakı-balık ruhunu koruyan yerel restoran.",
      order: ['Soslu Çıtır Karides', 'Günlük Tekne Balığı (Levrek / Çipura / Dülger)', 'Kabak Çiçeği Dolması & Ege Mezeleri'],
      menu: [
        'Soslu Çıtır Karides',
        'Kalamar Tava',
        'Izgara Ahtapot',
        'Dolgulu Kabak & Kabak Çiçeği Dolması',
        'Deniz Börülcesi & Fava',
        'Günlük Tekne Balığı',
      ],
      sec: [
        [
          'Kalamar Tava & Izgara Ahtapot',
          'Soslu çıtır karides yanında deniz mahsulü ara sıcak çeşitliliğini tamamlar.',
          'Müdavim.net ve Wanderlog değerlendirmeleri',
        ],
        [
          'Deniz Börülcesi & Fava',
          'Günlük zeytinyağlı Ege mezeleri seçkisi içinde sofraya ilk gelen klasiklerdir.',
          'Bodrum Mekan Rehberi menü kayıtları',
        ],
      ],
      seat: 'Balıkçı barınağı yanında ağaçlar altındaki samimi açık bahçe masaları',
      crowd: 'Gösterişli iskele kulüplerinden uzak durup sakin rakı-balık sohbeti arayan yerel ve tatilci müdavimler',
      dis: 'Yüksek fiyat segmentinde yer alsa da lüks beach kulüplere göre daha ölçülüdür; sahil merkezindeki müzikli eğlence atmosferi arayanlara sakin gelebilir',
      transit: 'Göltürkbükü Mahallesi 83. Sokak No:1/1, Liman Caddesi sonu balıkçı barınağı yanında',
      sources: [
        [
          'Müdavim.net — Çetimek Restaurant Türkbükü',
          'https://www.mudavim.net/',
          'community',
          'Balıkçı barınağı yanındaki konumu, eski Türkbükü atmosferi ve soslu çıtır karides değerlendirmesi',
        ],
        [
          'Wanderlog — Çetimek Restaurant',
          'https://wanderlog.com/',
          'community',
          'Kabak çiçeği dolması, soslu karides, fiyat-kalite dengesi ve hızlı servis notları',
        ],
        [
          'Bodrum Mekan Rehberi — Çetimek Restaurant',
          'https://www.bodrummekanrehberi.com/',
          'editorial',
          '83. Sokak No:1/1 konumu, klasik meyhane ve günlük deniz ürünleri konsepti',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=16693987022134363647',
          'maps',
          'Türkbükü 83. Sk. No:1/1 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Balıkçı barınağı yanında gürültüden uzak, nostaljik Ege bahçesi atmosferini koruması',
        'Türkbükü sahilindeki pek çok lüks mekana kıyasla daha dürüst porsiyon ve fiyat dengesi sunması',
      ],
      cons: [
        'Yine de üst-yüksek bütçe bandındaki Bodrum balıkçıları arasında yer alır',
        'Yüksek sezonda bahçe masaları çabuk dolabildiğinden rezervasyon önerilir',
      ],
      unc: ['Günlük balık çeşitleri doğrudan yerel teknelerin avına göre değişiklik gösterir'],
    }),
    compactSeed({
      id: 'dalgic-turkbuku',
      placeId: 'ChIJiZRBAU1vvhQReKY6MQ0xGwY',
      cat: 'balik',
      brand: 'dalgıç',
      area: 'Liman Cd., Türkbükü',
      signals: ['denize_sifir_iskele', 'zengin_ege_mezeleri', 'taze_deniz_urunleri'],
      verifiedAt: '2026-11-16',
      desc: "Türkbükü Liman Caddesi üzerinde denize sıfır konumu, kendine ait iskelesi ve bahçe masalarıyla hizmet veren; günlük taze balıkları, klasik Ege mezeleri ve kalamar-ahtapot ara sıcaklarıyla köklü sahil işletmesi.",
      order: ['Günlük Izgara Levrek & Çipura', 'Taze Ege Mezeleri (Tarator & Deniz Börülcesi)', 'Izgara Ahtapot & Kalamar Tava'],
      menu: [
        'Izgara Levrek & Çipura',
        'Levrek Marin',
        'Kalamar Tava & Izgara Kalamar',
        'Izgara Ahtapot & Ahtapot Salatası',
        'Tereyağlı Karides Güveç',
        'Zeytinyağlı Ege Mezeleri',
      ],
      sec: [
        [
          'Tereyağlı Sarımsaklı Karides Güveç',
          'Balık ve soğuk mezelerin arasında sıcak ara öğün olarak sofrada sıkça tercih edilir.',
          'Deniz mahsulleri menüsü ve yerel restoran kayıtları',
        ],
        [
          'Levrek Marin & Fava',
          'Yaz akşamlarında rakı-balık sofrasını hafif başlangıçlarla açmak isteyenlerin favorilerindendir.',
          'Restaurant Guru ve Yandex Harita notları',
        ],
      ],
      seat: 'Liman Caddesi kıyısında denize sıfır iskele ve bahçe oturma düzeni',
      crowd: 'Gündüz plaj-iskele keyfinden akşam huzurlu balık sofrasına geçen dengeli ve keyifli sahil kalabalığı',
      dis: 'Otel bünyesindeki restoran-plaj yapısı sebebiyle yüksek bütçe kategorisindedir ve sezon akşamlarında sahil masaları çabuk dolar',
      transit: 'Türkbükü Liman Caddesi No:61 üzerinde doğrudan kıyı şeridinde',
      sources: [
        [
          'Restaurant Guru — Dalgıç Türkbükü',
          'https://restaurantguru.com/',
          'community',
          'Tarator, kısır, zengin meze çeşitliliği, deniz kenarı konum ve servis ilgisi değerlendirmeleri',
        ],
        [
          'Küçük Oteller & Gezi Rehberi — Dalgıç Türkbükü',
          'https://www.kucukoteller.com.tr/',
          'editorial',
          'Liman Caddesi No:61 denize sıfır iskele, plaj ve balık restoranı işletme profili',
        ],
        [
          'Yandex Harita — Dalgıç Türkbükü',
          'https://yandex.com.tr/harita',
          'community',
          'Taze balık, meze çeşitliliği ve deniz kenarı akşam atmosferi geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=439999321329018488',
          'maps',
          'Türkbükü Liman Cd. No:61 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Türkbükü Liman Caddesi’nde denize sıfır iskelede geleneksel meze ve balık sofrası deneyimi sunması',
        'Otel restoranı güvencesiyle düzenli servis ve sakin kıyı atmosferi',
      ],
      cons: [
        'Yüksek fiyat segmentinde yer alır; gramajlı taze balık siparişinde fiyat hesabı önceden teyit edilmelidir',
        'Sadece balıkçı lokantası değil, aynı zamanda otel ve plaj tesisi olarak da işletilir',
      ],
      unc: ['Sezon dışında restoran servisi otel doluluğuna bağlı olarak dönemsel kapanış yapabiliyor'],
    }),

    // ==================== NEGATIVE CONTROLS (POLİTİKA KAPISI DENETİMİ) ====================
    // Kapı 2 & Zincir / Lüks Grup Kontrolleri
    negControl(
      'ctrl-turkbuku-hakkasan',
      'ChIJrVKHaL11vhQR9bzC7_POj6Q',
      'date',
      'Kapı 2 / Zincir denetimi: Hakkasan küresel lüks Kanton restoran zinciri (CHAIN_BLOCKLIST adayı: hakkasan)'
    ),
    negControl(
      'ctrl-turkbuku-paper-moon',
      'ChIJHWXQjNhvvhQRZLXgz4C3_Uc',
      'date',
      'Kapı 2 & Kapı 6 ihlali: Paper Moon çok şehirli İtalyan restoran zinciri ve ★3.8 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-turkbuku-lokanta-divan',
      'ChIJwZKHsjBvvhQRt0inbklaZ0w',
      'date',
      'Kapı 2 & Kapı 6 ihlali: Lokanta by Divan Bodrum Divan grubu şubesi ve ★2.6 puanı (8 değerlendirme)'
    ),
    negControl(
      'ctrl-turkbuku-vakko-mare',
      'ChIJMcfIdmVvvhQR_DTjJCTNWZ4',
      'denemelisin',
      'Kapı 2 & Kapı 3 ihlali: Vakko zinciri (CHAIN_BLOCKLIST) ve clothing_store türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-turkbuku-gaia',
      'ChIJy-wcC41vvhQRi4cFyM1jk48',
      'date',
      'Kapı 2 & Kapı 6 ihlali: Gaia Bodrum küresel restoran zinciri (Dubai/Doha/Londra/Bodrum) ve ★4.0 puanı'
    ),

    // Kapı 3 & Kapı 3B — Saf Kahveci ve Tür Dışı (Otel / Spa / Kamp Alanı) Kontrolleri
    negControl(
      'ctrl-turkbuku-firin-bi-tatli-tuzlu',
      'ChIJo56mf8pvvhQRRllIJBGitMc',
      'kahve',
      'Kapı 3B & Kapı 6 ihlali: pastry_shop türü kahve kategorisine giremez, çok şubeli Bodrum fırın zinciri ve ★4.2 puanı'
    ),
    negControl(
      'ctrl-turkbuku-firin-bi-tatli-tuzlu-gol',
      'ChIJV46mZRRvvhQRCUUFwEUpejQ',
      'kahve',
      'Kapı 3B & Kapı 6 ihlali: pastry_shop türü kahve kategorisine giremez, çok şubeli Bodrum fırın zinciri ve ★4.3 puanı'
    ),
    negControl(
      'ctrl-turkbuku-maxx-royal',
      'ChIJXw4kos9vvhQRKYQ9bw7hmcI',
      'date',
      'Kapı 3 ihlali: Maxx Royal Bodrum hotel/resort_hotel türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-turkbuku-club-turkbuku',
      'ChIJi_g-W9lvvhQR79uNJnocgA8',
      'date',
      'Kapı 3 ihlali: Club Türkbükü hotel/lodging türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-turkbuku-cennet-koyu',
      'ChIJ4UVXlQtvvhQRs_dHoZpAJN0',
      'denemelisin',
      'Kapı 3 ihlali: Cennet Koyu campground/lodging türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-turkbuku-the-spa-mandarin',
      'ChIJ7RkGz3VvvhQReW6ZuMg9i0Y',
      'denemelisin',
      'Kapı 3 ihlali: The Spa at Mandarin Oriental Bodrum spa/health türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-turkbuku-mandarin-oriental',
      'ChIJAQAAQO5vvhQR0cqCHEaK7ic',
      'date',
      'Kapı 3 & Kapı 4 denetimi: Mandarin Oriental, Bodrum hotel birincil türü ve adres bileşenlerinde Bodrum eksik'
    ),
    negControl(
      'ctrl-turkbuku-babana-hotel',
      'ChIJW7-Z9-hvvhQRACntL8CkDZw',
      'date',
      'Kapı 3 / Otel denetimi: Babana Hotel birincil otel kaydı; restoranı Lago Bodrum ayrı kayıt olarak seçildi'
    ),

    // Kapı 6 & Kapı 4 — Düşük Puan (<4.4), Yetersiz Değerlendirme (<35) ve Yerel Mahalle Kontrolleri
    negControl(
      'ctrl-turkbuku-atilay',
      'ChIJdbNZb25svhQRUKd_OdsB1cg',
      'balik',
      'Kapı 6 ihlali: ATILAY - TÜRKBÜKÜ ★4.3 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-turkbuku-miam',
      'ChIJzVDASMJvvhQRYhkIN-ynA6A',
      'date',
      'Kapı 6 ihlali: Miam Restoran Türkbükü ★4.2 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-turkbuku-garos',
      'ChIJ-VSiL8JvvhQRE8xtPSgqKdk',
      'balik',
      "Kapı 4 & Kapı 6 ihlali: Garo's Restaurant ★4.0 puanı ve adreste yalnızca Menemene geçiyor"
    ),
    negControl(
      'ctrl-turkbuku-macakizi',
      'ChIJzd_i6yxvvhQRiz7skl-JPrc',
      'balik',
      'Kapı 6 ihlali: Macakizi Restaurant ★4.1 (104) puanı 4.4 tabanının altında ve 200+ koruma eşiği sağlanmıyor'
    ),
    negControl(
      'ctrl-turkbuku-daze',
      'ChIJ-RnSl0VvvhQRU5H2gfn0oBE',
      'date',
      'Kapı 6 ihlali: DAZE Türkbükü ★4.1 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-turkbuku-pizzerie-ce',
      'ChIJL_6fj8JvvhQRzuF36r1bMrU',
      'pizza',
      "Kapı 6 ihlali: Pizzerie C'e ★4.2 puanı 4.4 tabanının altında"
    ),
    negControl(
      'ctrl-turkbuku-hocanin-yeri',
      'ChIJdbNZb25svhQRLAoKVN9bKgc',
      'balik',
      'Kapı 6 ihlali: Türkbükü Hocanın Yeri ★3.6 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-turkbuku-tufan-milat',
      'ChIJWRXHGSVtvhQRTMTBrIONloE',
      'balik',
      'Kapı 6 ihlali: TÜRKBÜKÜ BALIKÇISI - TUFAN MİLAT 30 değerlendirme ile 35 alt sınırının altında'
    ),
    negControl(
      'ctrl-turkbuku-sofra-cennet',
      'ChIJdTUBz3VvvhQRtyy-nVFIDrw',
      'denemelisin',
      'Kapı 6 ihlali: Sofra (Cennet Koyu) 28 değerlendirme ile 35 alt sınırının altında'
    ),
    negControl(
      'ctrl-turkbuku-etnegra',
      'ChIJASdAJ8ZvvhQRgtgL9cvdgns',
      'denemelisin',
      'Kapı 6 ihlali: Etnegra Bodrum 21 değerlendirme ile 35 alt sınırının altında'
    ),
    negControl(
      'ctrl-turkbuku-loft-elia',
      'ChIJX_CWtS1vvhQRwjAbTFPnH44',
      'date',
      'Kapı 6 ihlali: Loft Elia Restaurant ★4.3 puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-turkbuku-galia',
      'ChIJq5YgTzZvvhQRadgtRlPIm-Y',
      'balik',
      'Kapı 6 ihlali: GALİA RESTAURANT/BAR ★3.3 puanı 4.4 tabanının altında'
    ),

    // Kapı 4 — Dış Mahalle & Komşu Belde Sınır Kontrolleri (Gündoğan, Farilya, Torba, Dağbelen, Müskebi)
    negControl(
      'ctrl-turkbuku-jour-gundogan-outside',
      'ChIJ7eqpVb5xvhQRXBju-T0ByIg',
      'date',
      'Kapı 4 ihlali: JOUR Bodrum Gündoğan Mahallesi, Türkbükü bbox ve mahalle sınırı dışında'
    ),
    negControl(
      'ctrl-turkbuku-akbalik-gundogan-outside',
      'ChIJnYnS_zpwvhQRiPeIg-OLxe4',
      'balik',
      'Kapı 4 ihlali: Akbalık Restaurant Gündoğan Mahallesi, Türkbükü bbox ve mahalle sınırı dışında'
    ),
    negControl(
      'ctrl-turkbuku-guno-gundogan-outside',
      'ChIJsbd2WOJxvhQRnT8MinbAywY',
      'denemelisin',
      'Kapı 4 ihlali: Güno Ocakbaşı Steakhouse Gündoğan Mahallesi, Türkbükü bbox ve mahalle sınırı dışında'
    ),
    negControl(
      'ctrl-turkbuku-bodrum-hayat-farilya-outside',
      'ChIJMYGF8utxvhQROq3PDdX4Lwk',
      'date',
      'Kapı 4 ihlali: Bodrum Hayat MEYHANESI Farilya (Gündoğan) Mahallesi, Türkbükü bbox ve mahalle sınırı dışında'
    ),
    negControl(
      'ctrl-turkbuku-torba-cafe-outside',
      'ChIJV1UlUtNuvhQRvGWwTw4Etck',
      'kahve',
      'Kapı 4 ihlali: Torba Cafe - Bodrum Belediye A.Ş. Torba Mahallesi, Türkbükü bbox ve mahalle sınırı dışında'
    ),
    negControl(
      'ctrl-turkbuku-starbucks-torba-outside',
      'ChIJb2-XqoVpvhQRl9-iMRF7Krw',
      'kahve',
      'Kapı 2 & Kapı 4 ihlali: Starbucks zinciri ve Torba Mahallesi, Türkbükü dışında'
    ),
    negControl(
      'ctrl-turkbuku-hocanin-yeri-torba-outside',
      'ChIJtUQXcDNpvhQRCLA5T4CXR18',
      'balik',
      "Kapı 4 ihlali: Hoca'nın Yeri Torba Mahallesi, Türkbükü bbox ve mahalle sınırı dışında"
    ),
    negControl(
      'ctrl-turkbuku-irme-dagbelen-outside',
      'ChIJsdpYlMBzvhQR5A5CuGaXI7M',
      'kahvalti',
      'Kapı 4 ihlali: İrme Köy Kahvaltı Evi Dağbelen Mahallesi, Türkbükü bbox ve mahalle sınırı dışında'
    ),
    negControl(
      'ctrl-turkbuku-iz-bodrum-muskebi-outside',
      'ChIJVaWzaLtzvhQRWJ-fLXPF7fE',
      'date',
      'Kapı 4 ihlali: İZ Bodrum Müskebi (Ortakent) Mahallesi, Türkbükü bbox ve mahalle sınırı dışında'
    ),
  ],
};
