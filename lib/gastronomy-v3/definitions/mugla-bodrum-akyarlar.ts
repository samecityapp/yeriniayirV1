import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const MUGLA_BODRUM_AKYARLAR_DEF: V3RegionDefinition = {
  id: 'akyarlar-bodrum-mugla',
  slug: 'akyarlar',
  city: 'Muğla',
  district: 'Bodrum',
  allowedDistricts: ['Bodrum'],
  neighborhood: 'Akyarlar',
  officialQuarter:
    'Akyarlar Mahallesi — Akyarlar Limanı, Karaincir Koyu, Kemer Burnu, Fenerburnu, Akçabük & Aspat Koyu (Anthaven) Hattı',
  displayName: 'Akyarlar, Bodrum, Muğla',
  locative: "Akyarlar'da",
  path: ['mugla', 'bodrum', 'akyarlar'],
  aliases: [
    'Akyarlar',
    'Karaincir',
    'Karaincir Koyu',
    'Aspat',
    'Aspat Koyu',
    'Anthaven',
    'Fenerburnu',
    'Kemer Burnu',
    'Akçabük',
    'Akcabuk',
  ],
  scopeNote:
    'Akyarlar Limanı, Karaincir Koyu, Kemer & Fenerburnu, Akçabük & Aspat Koyu (Anthaven) · Doğrulanmış Seçki',
  characterSubtitle:
    'Fenerburnu ve Çamlıburnu fenerinden Akyarlar Limanı, Karaincir Koyu ve Aspat (Anthaven) kanallarına uzanan taş fırın İtalyan mutfağı, bağımsız gurme burger, sahil kokteyl barları, ağaç gölgesinde gözleme ve serpme kahvaltılar, butik ekşi maya fırın, tencere ev yemekleri ile kırk yılı aşkın kıyı balıkçıları.',
  center: { lat: 36.9735, lng: 27.2965 },
  bbox: { minLat: 36.9500, maxLat: 36.9935, minLng: 27.2550, maxLng: 27.3245 },
  excludeBbox: { minLat: 36.9820, maxLat: 36.9935, minLng: 27.2550, maxLng: 27.2855 },
  allowedNeighborhoodTokens: [
    'Akyarlar',
    'Karaincir',
    'Aspat',
    'Anthaven',
    'Fenerburnu',
    'Akçabük',
    'Akcabuk',
  ],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // ==================== 1. PİZZA ====================
    compactSeed({
      id: 'antre-pizza-aspat',
      placeId: 'ChIJ0e1AF9YNvhQRbcet65Ymwwc',
      cat: 'pizza',
      brand: 'antre',
      area: 'Aspat Koyu (Anthaven), Akyarlar',
      signals: ['tas_firin_pizza', 'el_yapimi_niyokki', 'anthaven_kule_manzarasi'],
      verifiedAt: '2026-11-17',
      desc: "Aspat Koyu'ndaki Anthaven çarşısı ve Balkan köprüsü kulesi aksında taze günlük hamurla pişirdiği taş fırın İtalyan pizzaları, mantar dolgulu niyokki ve burrata başlangıçlarıyla hizmet veren İtalyan restoranı.",
      order: ['Dört Peynirli (Quattro Formaggi) Pizza', 'Pizza Margherita', 'Mantar Dolgulu Niyokki'],
      menu: [
        'Dört Peynirli Pizza (Quattro Formaggi)',
        'Pizza Margherita',
        'Caprese & Burrata Pizzalar',
        'Mantar Dolgulu Niyokki (Gnocchi)',
        'Ev Yapımı Ravioli & Taze Makarna',
        'Taze Burrata Başlangıcı',
        'Şarap Kavı Seçkisi',
      ],
      sec: [
        [
          'Taze Burrata & Başlangıç Tabakları',
          'Ana pizza siparişi öncesi şarap eşliğinde paylaşımlık olarak tercih edilen kremsi İtalyan peyniri sunumudur.',
          'antrepizza.com menüsü ve Anthaven ziyaretçi geri bildirimleri',
        ],
        [
          'Mantar Dolgulu Ev Yapımı Niyokki',
          'Taş fırın pizzalar dışında İtalyan mutfağının öne çıkan sıcak makarna alternatifidir.',
          'antrepizza.com ve Yandex Harita değerlendirmeleri',
        ],
      ],
      seat: 'Anthaven kanal ve Balkan köprüsü kulesi manzarasına bakan açık teras ve modern iç salon masaları',
      crowd: 'Akşam yemeğinde Anthaven sakinleri, çiftler ve İtalyan mutfağı arayan gruplarla dengeli tempo',
      dis: 'Anthaven kompleksinin üst segment fiyatlandırması uygulanır ve yaz sezon dışı dönemlerde çalışma düzeni değişebilir',
      transit: 'Akyarlar Atatürk Caddesi No:352/26-1A Aspat Koyu (Anthaven) içinde',
      sources: [
        [
          'Antre Pizza Resmi Web Sitesi',
          'https://www.antrepizza.com/',
          'operator',
          'Aspat Koyu Anthaven kule konumu, taş fırın pizza ve el yapımı makarna menüsü doğrulaması',
        ],
        [
          'FoodInLife — Anthaven Gastronomi Rehberi',
          'https://www.foodinlife.com/',
          'editorial',
          'Anthaven çarşı içindeki Antre Pizza ve İtalyan mutfağı odağı değerlendirmesi',
        ],
        [
          'Sluurpy & Yandex Harita — Antre Pizza Aspat',
          'https://yandex.com.tr/harita',
          'community',
          'Dört peynirli pizza, niyokki, burrata ve kule manzarası hakkında çoklu misafir notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=559333208365057901',
          'maps',
          'Operasyonel doğrulama (★4.4, 77 değerlendirme)',
        ],
      ],
      pros: [
        'Aspat Anthaven içinde taze hamurlu taş fırın İtalyan pizzası ve el yapımı niyokki sunması',
        'Ferah kanal ve kule manzaralı akşam yemeği atmosferi',
      ],
      cons: ['Fiyatların yüksek bulunması ve Anthaven otopark/giriş mesafesi'],
      unc: ['Sezon dışı kış aylarında hafta içi servis saatleri kısıtlı olabilir'],
    }),

    // ==================== 2. HAMBURGER ====================
    compactSeed({
      id: 'burger-house-akyarlar',
      placeId: 'ChIJoyX_IbwNvhQRciPiWgTUxoU',
      cat: 'hamburger',
      brand: 'burger house',
      area: 'Atatürk Cd., Akyarlar',
      signals: ['bagimsiz_yerel_burger', '150g_dana_kofte_kibrit_patates', 'gece_servisi'],
      verifiedAt: '2026-11-17',
      desc: "Akyarlar merkezindeki Atatürk Caddesi üzerinde faaliyet gösteren (ulusal zincirden bağımsız yerel işletme); dana fümeli Special Burger, karamelize mantarlı Cheff Burger ve kibrit patates eşlikleriyle öne çıkan burgerci.",
      order: ['Special Burger (150 g)', 'Cheff Burger', 'Mexico Burger'],
      menu: [
        'Special Burger (Dana Füme & Cheddar)',
        'Cheff Burger (Karamelize Mantar)',
        'Mexico Burger (Jalapeno)',
        'Avokadolu & Pastırmalı Burger',
        'Klasik / Double / Triple Burger',
        'Kibrit Patates Kızartması',
        'Burger House Combo Atıştırmalık Tabağı',
        'Bodrum Mandalin & Çıtır Tavuk Seçenekleri',
      ],
      sec: [
        [
          'Kibrit Patates & Burger Combo Tabağı',
          'İnce kesim çıtır kibrit patatesin yanında soğan halkası, kroket ve sosis içeren paylaşımlık eşlikçi seçeneğidir.',
          'Migros Yemek ve Yemeksepeti menü listesi',
        ],
        [
          'Tost, Gözleme & Sandviç Seçenekleri',
          'Ana burger menüsünün dışında günün farklı saatleri için sıcak atıştırmalık alternatifleri de bulundurur.',
          'Migros Yemek sipariş menüsü',
        ],
      ],
      seat: 'Atatürk Caddesi üzerinde Akyarlar koyu esintisine açık teras ve iç masa düzeni',
      crowd: 'Öğleden gece yarısı sonrasına kadar yerel gençler, sörfçüler ve akşam atıştırmalığı arayanlarla canlı tempo',
      dis: 'Gündelik hızlı servis ağırlıklı olduğundan uzun oturuşlu fine-dining veya masa düzeni atmosferi sunmaz',
      transit: 'Akyarlar Mahallesi Atatürk Caddesi No:261/4 üzerinde sahile yürüyüş mesafesinde',
      sources: [
        [
          'Yemeksepeti & Migros Yemek — By Burger House Akyarlar',
          'https://www.yemeksepeti.com/',
          'operator',
          'Special Burger, Cheff Burger, Mexico Burger, kibrit patates ve combo tabak menü doğrulaması',
        ],
        [
          'My Guide Bodrum & Restaurant Guru — Burger House Bodrum',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Atatürk Cd. No:261/4 konumunda yerel bağımsız burger noktası ve doyurucu porsiyon kaydı',
        ],
        [
          'Wanderlog & Yandex Harita — Burger House Bodrum',
          'https://wanderlog.com/',
          'community',
          'Sulu dana köfte, çıtır kibrit patates ve geç saat servis kalitesi üzerine misafir değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=9639625167602852722',
          'maps',
          'Operasyonel doğrulama (★4.8, 226 değerlendirme)',
        ],
      ],
      pros: [
        'Ulusal AVM zincirlerinden bağımsız, 200’ü aşkın değerlendirmede yüksek puan istikrarı koruyan yerel burger adresi',
        'Kibrit patates ve çeşitli burger içeriklerinin geç saatlere kadar erişilebilir olması',
      ],
      cons: ['Sahil içi sokak/cadde trafiği nedeniyle yaz akşamlarında park alanı sınırlı kalabilir'],
      unc: ['Sezon içi ve sezon dışı gece kapanış saati mevsime göre değişebilir'],
    }),

    // ==================== 3. KAHVE ====================
    // Akyarlar sınırları içinde >=4.4 puanlı bağımsız 3. dalga saf kahve dükkanı bulunmadığından
    // (Magnolia Shop Anthaven COOKSHOP zinciri, Kahve Dünyası & Çaytaze zincir, Karabatak ★3.9,
    // Makbush dondurma/çikolata türevi; Yalı Cafe ve Bake My Day ise kahvaltı odağındadır)
    // "Yoksa Gösterme" kuralı gereği bu kategori dinamik olarak gizlenir.

    // ==================== 4. DATE MEKANLARI ====================
    compactSeed({
      id: 'tiki-beach-akyarlar',
      placeId: 'ChIJk4hH30kNvhQRLQZlMYwjIVc',
      cat: 'date',
      brand: 'tiki',
      area: 'Tarık Akan Sk., Akyarlar',
      signals: ['kos_adasi_manzarasi', 'imza_yaz_kokteylleri', 'bohem_sahil_atmosferi'],
      verifiedAt: '2026-11-17',
      desc: "Akyarlar koyunda İstanköy (Kos) Adası manzarasına karşı bohem dekorasyonlu sahil alanında mevsim meyveli imza kokteylleri, ev yapımı soslu burgerleri ve canlı müzik eşliğinde gün batımı akşamları sunan plaj barı ve bistrosu.",
      order: ['Meyveli İmza Yaz Kokteylleri', 'Ev Yapımı Soslu Beach Burger'],
      menu: [
        'Meyveli & Tropikal İmza Kokteyller',
        'Ev Yapımı Soslu Burger & Patates Kızartması',
        'Akdeniz & Ton Balıklı Salatalar',
        'Izgara Tavuklu & Peynirli Salata Çeşitleri',
        'Sıcak Başlangıç & Snack Tabağı',
        'Tost & Makarna Çeşitleri',
        'Kahve & Serinletici Yaz İçecekleri',
      ],
      sec: [
        [
          'Akdeniz & Ton Balıklı Plaj Salatası',
          'Gün boyu plajda ya da gün batımında hafif bir akşamüstü tabağı arayanlar tarafından öne çıkarılır.',
          'Resmi KirazSoft QR menü ve Yandex Harita misafir notları',
        ],
        [
          'Makarna & Izgara Snack Seçenekleri',
          'Kokteyl eşliğinde paylaşımlık sıcak atıştırmalık isteyen gruplar için plaj mutfağının tamamlayıcı seçenekleridir.',
          'İşletme QR menü kayıtları',
        ],
      ],
      seat: 'Akyarlar kumsalında bohem ahşap gölgelikler, şezlong alanı ve Kos manzaralı sahil masaları',
      crowd: 'Gündüz sakin deniz ve güneşlenme, akşamüstü gün batımında canlı müzik eşliğinde sosyal plaj barı havası',
      dis: 'Açık hava sahil işletmesi olduğundan rüzgarlı günlerde kıyıda esinti artar ve yaz dönemi şezlong/masa yoğunluğu görülür',
      transit: 'Akyarlar Mahallesi Tarık Akan Sokak (No:41/2) sahil bandı üzerinde',
      sources: [
        [
          'Tiki Beach Bodrum Resmi Dijital Menüsü',
          'https://qr.kirazsoft.com/#/anasayfa?c=slV7zL&b=DsBKyQ&ci=1768&bi=2393&st=table',
          'operator',
          'Resmi QR menü kaydı: kokteyller, beach burger, Akdeniz salataları ve sıcak atıştırmalıklar',
        ],
        [
          'Yandex Harita — Tiki Beach Bodrum',
          'https://yandex.com.tr/harita',
          'community',
          'Tarık Akan Sk. 41/2 konumu, berrak deniz, bohem dekorasyon, kokteyller ve hızlı servis geri bildirimleri',
        ],
        [
          'Restaurant Guru — Tiki Beach Bodrum',
          'https://restaurantguru.com/',
          'community',
          'Gün batımı atmosferi, canlı müzik ve sahil menüsü üzerine çoklu ziyaretçi değerlendirmesi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=6278338440562279981',
          'maps',
          'Operasyonel doğrulama (★4.6, 428 değerlendirme)',
        ],
      ],
      pros: [
        'Bohem sahil kurgusu, berrak Akyarlar koyu kıyısı ve gün batımı kokteyl deneyimini bir araya getirmesi',
        'Yüksek ziyaretçi memnuniyeti ve canlı müzik programlarıyla sosyal akşam enerjisi',
      ],
      cons: ['Tamamen açık sahil alanında yer aldığı için serin rüzgarlı havalarda ve kış sezonunda kısıtlıdır'],
      unc: ['Sezonluk canlı müzik takvimi ve minimum harcama koşulları aylara göre değişebilir'],
    }),

    // ==================== 5. KAHVALTI ====================
    compactSeed({
      id: 'yali-cafe-akyarlar',
      placeId: 'ChIJaX2qFWcMvhQR3FjMG5RPQjM',
      cat: 'kahvalti',
      brand: 'yalı',
      area: 'Atatürk Cd., Akyarlar',
      signals: ['agaclar_alti_serpme_kahvalti', 'el_acmasi_otlu_gozleme', 'koy_manzarasi'],
      verifiedAt: '2026-11-17',
      desc: "Akyarlar Atatürk Caddesi kıyısında ağaçlar altında koy manzarasına açılan; el açması otlu gözlemeleri, çıtır simit ve ev yapımı böreklerle zengin serpme kahvaltı sunan mütevazı sahil kafesi.",
      order: ['Akyarlar Serpme Kahvaltı', 'El Açması Otlu Gözleme'],
      menu: [
        'Yöresel Serpme Kahvaltı',
        'Kahvaltı Tabağı',
        'El Açması Otlu & Peynirli Gözleme',
        'Ev Yapımı Börek Çeşitleri',
        'Çıtır Simit & Taze Peynir Tabakları',
        'Sıcak Menemen & Sahanda Yumurta',
        'Tost, Sandviç & Demleme Çay',
      ],
      sec: [
        [
          'Sıcak Menemen & Sahanda Yumurta',
          'Serpme kahvaltı dışında sabah saatlerinde sade bir sıcak tabak tercih eden konukların öne çıkardığı seçenektir.',
          'Restaurant Guru ve Turgutreis Rehberi kahvaltı notları',
        ],
        [
          'Ev Yapımı Börek & Çıtır Simit',
          'Hafif sabah atıştırması arayanların manzaraya karşı sıkça tercih ettiği fırın eşlikçileridir.',
          'Turgutreis Rehberi mekan incelemesi',
        ],
      ],
      seat: 'Akyarlar koyuna bakan ağaç gölgeli ferah bahçe ve açık sahil masaları',
      crowd: 'Sabah ve geç kahvaltı saatlerinde sakin aileler, çiftler ve koy manzarası arayan gezginlerle huzurlu ortam',
      dis: 'Temmuz-Ağustos hafta sonu sabah pik saatlerinde servis hızının yavaşlayabildiğine dair geri bildirimler bulunur',
      transit: 'Akyarlar Mahallesi Atatürk Caddesi sahil aksı üzerinde merkez iskeleye yürüme mesafesinde',
      sources: [
        [
          'Yalı Cafe Resmi Instagram (@yali.cafe)',
          'https://www.instagram.com/yali.cafe/',
          'operator',
          'Atatürk Cd. konumu, Akyarlar koyu kahvaltı sunumları ve aktif işletme profili',
        ],
        [
          'Turgutreis Rehberi — Yalı Cafe Akyarlar',
          'https://www.turgutreisrehberi.com/',
          'editorial',
          'Serpme kahvaltı, çıtır simit ve koy manzarası öne çıkanları incelemesi',
        ],
        [
          'Yandex Harita & Restaurant Guru — Yalı Cafe Akyarlar',
          'https://yandex.com.tr/harita',
          'community',
          '550’yi aşkın değerlendirme içinde el açması gözleme, börek, menemen ve makul fiyat vurguları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=3693602141937359068',
          'maps',
          'Operasyonel doğrulama (★4.5, 559 değerlendirme)',
        ],
      ],
      pros: [
        'Ağaç gölgesinde nostaljik koy manzarasıyla ulaşılabilir fiyat-kalite dengesi sunması',
        'Gözleme ve serpme kahvaltıda taze yöresel ürün kullanımı',
      ],
      cons: ['Yoğun yaz sabahlarında sıcak servis ve sipariş bekleme süresi uzayabiliyor'],
      unc: ['Kış döneminde günlük açılış saatleri mevsime göre değişebilir'],
    }),

    compactSeed({
      id: 'bake-my-day-anthaven',
      placeId: 'ChIJVbrZkDENvhQR-WSIZtYMbFg',
      cat: 'kahvalti',
      brand: 'bake my day',
      area: 'Aspat Koyu (Anthaven), Akyarlar',
      signals: ['tereyagli_kruvasan', 'eksi_maya_firin', 'tuzlu_kruvasan_sandvic'],
      verifiedAt: '2026-11-17',
      desc: "Bodrum çıkışlı butik fırın-kafe Bake My Day'in Anthaven girişindeki durağı; Fransız viennoiserie tekniğiyle hazırlanan kat kat tereyağlı kruvasanları, avokadolu-somonlu kruvasan sandviçleri ve ekşi maya ekmekleriyle sabah kahvaltısı adresi.",
      order: ['Tereyağlı Klasik Kruvasan', 'Avokadolu & Somonlu Kruvasan Sandviç', 'Ekşi Maya Ekmek & Kahvaltı Tabağı'],
      menu: [
        'Tereyağlı Sade Kruvasan',
        'Avokadolu, Peynirli & Füme Etli/Somonlu Kruvasan Sandviç',
        'Kruvasan Benedict Çeşitleri',
        'Ekşi Maya Artizan Ekmekler',
        'Ev Yapımı Tatlı & Tuzlu Kurabiyeler',
        'Nitelikli Kahve Çeşitleri',
        'Ev Yapımı Pasta & Tart Dilimleri',
      ],
      sec: [
        [
          'Ekşi Maya Ekmek & Tuzlu/Tatlı Kurabiyeler',
          'Kahvaltı dışı gün içi saatlerinde ev alışverişi veya kahve yanı atıştırmalık olarak öne çıkan fırın ürünleridir.',
          'T24 ve Yandex Harita misafir notları',
        ],
        [
          'Ev Yapımı Tatlılar & Fırın Pastaları',
          'Öğleden sonra kahve eşliği arayan Anthaven ziyaretçilerinin tercih ettiği günlük vitrin ürünleridir.',
          'Mesprestiges Bodrum incelemesi ve bakemydaybodrum.com',
        ],
      ],
      seat: 'Anthaven AVM giriş aksında ferah çarşı önü teras masaları ve modern butik kafe içi düzen',
      crowd: 'Sabah yürüyüşçüleri, Anthaven ev sakinleri ve hafta sonu brunch müdavimleriyle sakin ve düzenli tempo',
      dis: 'Geleneksel serpme köy kahvaltısından ziyade artizan fırın, kruvasan ve kafe porsiyonları sunar; fiyatları üst segmenttedir',
      transit: 'Akyarlar Atatürk Caddesi Anthaven Çarşı girişinde',
      sources: [
        [
          'Bake My Day Bodrum Resmi Sitesi',
          'https://www.bakemydaybodrum.com/',
          'operator',
          'Bodrum butik fırın konsepti, ekşi maya ve viennoiserie ürün portföyü',
        ],
        [
          'T24 Kültür-Sanat / Yaşam — Bodrum Kahvaltı & Fırın Seçkisi',
          'https://t24.com.tr/',
          'editorial',
          'Avokadolu ve somonlu kruvasan sandviç çeşitleri ile butik fırın değerlendirmesi',
        ],
        [
          'Mesprestiges & Bodrum Guru — Bake My Day Anthaven',
          'https://bodrumguru.com/',
          'editorial',
          'Fransız viennoiserie tekniği, kat kat tereyağlı kruvasanlar ve Anthaven çarşı konumu incelemesi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=6371481687805158649',
          'maps',
          'Operasyonel doğrulama (★4.6, 79 değerlendirme)',
        ],
      ],
      pros: [
        'Bitez ve Gümüşlük noktalarıyla bilinen yerel Bodrum fırın markasının Aspat Anthaven’daki taze viennoiserie üretimi',
        'Klasik serpme dışında kruvasan benedict ve tuzlu sandviç alternatifi sunması',
      ],
      cons: ['Taze kruvasan çeşitleri erken saatlerde hızlı tükenebiliyor ve AVM çarşı girişinde manzarası sınırlıdır'],
      unc: ['Sezon dışı kış döneminde öğleden sonra fırın çıkışı sıklığı azalabilir'],
    }),

    // ==================== 6. DENEMELİSİN ====================
    compactSeed({
      id: 'cafeluka-akyarlar',
      placeId: 'ChIJ3-Fmr2AMvhQRmku3M7AELY8',
      cat: 'denemelisin',
      brand: 'cafeluka',
      area: '4. Sk. (Köy İçi), Akyarlar',
      signals: ['gunluk_ev_yemekleri', 'ev_yapimi_saksuka_zeytinyaglilar', 'aile_lokantasi'],
      verifiedAt: '2026-11-17',
      desc: "Akyarlar köy içi 4. (4261.) Sokak'ta günlük değişen sıcak tencere yemekleri, ev yapımı şakşuka ve hafif zeytinyağlı tabaklarıyla sahil turistik mekanlarından ayrışan sade aile lokantası.",
      order: ['Ev Yapımı Şakşuka', 'Günlük Sıcak Tencere Yemeği', 'Zeytinyağlı Ev Yemekleri Tabağı'],
      menu: [
        'Ev Yapımı Şakşuka',
        'Günlük Değişen Sıcak Ev Yemekleri',
        'Zeytinyağlı Tabak Çeşitleri',
        'Kahvaltılık Alternatifler',
        'Hafif Atıştırmalık & Sandviç Seçenekleri',
      ],
      sec: [
        [
          'Günlük Değişen Zeytinyağlı & Kahvaltılıklar',
          'Sabah ve öğle servisinde ağır et/balık yemekleri yerine hafif, katkısız ev lezzeti arayanlarca tercih edilir.',
          'Yandex Harita Akyarlar köy içi kullanıcı değerlendirmeleri',
        ],
      ],
      seat: 'Akyarlar köy içi ara sokakta mütevazı, sıcak mahalle lokantası oturma alanı',
      crowd: 'Gündüz ve öğle saatlerinde mahalle sakinleri ile sade ev yemeği arayan müdavimlerle sakin tempo (Pazar günleri kapalı)',
      dis: 'Sahil manzarası ve akşam yemeği servisi bulunmaz; yalnızca gündüz saatlerinde hizmet veren ufak bir aile mutfağıdır',
      transit: 'Akyarlar Mahallesi 4. Sokak (4261. Sk. No:4, Sağlık Ocağı yakınında)',
      sources: [
        [
          'Yandex Harita — Cafeluka Akyarlar Konum & İncelemeleri',
          'https://yandex.com.tr/harita',
          'community',
          '4261. Sokak No:4 konumu, günlük değişen sağlıklı ev yemekleri, şakşuka ve doyurucu porsiyon geri bildirimleri',
        ],
        [
          'Yerel İşletme Kaydı & Gündüz Çalışma Takvimi',
          'https://maps.google.com/?cid=10316907476204080026',
          'community',
          'Pazartesi-Cumartesi gündüz servisi ve mahalle lokantası konsepti doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=10316907476204080026',
          'maps',
          'Operasyonel doğrulama (★4.7, 144 değerlendirme)',
        ],
      ],
      pros: [
        'Turistik sahil bandından sıyrılıp ulaşılabilir ev yapımı şakşuka ve tencere yemeği sunması',
        'Porsiyon doyuruculuğu ve samimi esnaf işletmesi tavrı',
      ],
      cons: ['Akşam yemeği ve Pazar servisinin olmaması, deniz manzarasından içeride yer alması'],
      unc: ['Günlük çıkan yemek çeşitleri o günün mutfak tedarikine göre sınırlı adette hazırlanır'],
    }),

    compactSeed({
      id: 'kaptanin-yeri-akyarlar',
      placeId: 'ChIJn6V236gMvhQRbFCi9qlXcWk',
      cat: 'denemelisin',
      brand: 'kaptanın',
      area: '4264. Sk. (Liman), Akyarlar',
      signals: ['1984_aile_isletmesi', 'tas_firin_pide_ve_izgara_kofte', 'gunluk_taze_deniz_urunleri'],
      verifiedAt: '2026-11-17',
      desc: "1984'ten bu yana Akyarlar Limanı yakınında taş fırından elde açılan pideleri, kömür ateşinde ızgara köfte-kebapları, zeytinyağlı meze vitrini ve günlük taze deniz ürünlerini aynı çatı altında sunan köklü aile işletmesi.",
      order: ['El Açması Taş Fırın Pide Çeşitleri', 'Kalamar & Tereyağlı Karides Tava', 'Kömür Ateşinde Izgara Köfte'],
      menu: [
        'El Açması Taş Fırın Pideler',
        'Kömür Ateşinde Izgara Köfte & Kebaplar',
        'Mevsimlik Günlük Taze Balıklar (Levrek & Çipura)',
        'Tereyağlı Karides & Kalamar Tava',
        'Kömür Ateşinde Ahtapot',
        'Zeytinyağlı Soğuk & Sıcak Meze Vitrini',
        'İkram Minik İrmik / Tahin Helva Dokunuşları',
      ],
      sec: [
        [
          'Günlük Meze Vitrini & Yemek Sonrası İkram Helva',
          'Balık veya pide siparişlerinin başında vitrinden seçilen zeytinyağlı mezeler ve kapanışta sunulan geleneksel küçük helva öne çıkar.',
          'kaptaninyeriakyarlar.com ve Yemeksepeti müşteri geri bildirimleri',
        ],
        [
          'Midye Dolma & Ekmek Arası Taze Balık / Köfte',
          'Daha hızlı ve pratik öğün arayanlar tarafından paket veya hızlı servis olarak da tercih edilen seçeneklerdir.',
          'Yemeksepeti Akyarlar menü kayıtları',
        ],
      ],
      seat: 'Liman arkası 4264. Sokak üzerinde sade açık hava ve aile lokantası salonu düzeni',
      crowd: 'Öğle ve akşam saatlerinde yerel halk, aileler ve makul bütçeli balık-pide arayan misafirlerle dengeli tempo',
      dis: 'Yalı Caddesi üzerindeki mekanlar gibi doğrudan kumsal üzerinde konumlanmaz ve bazı ziyaretçiler porsiyon fiyatlarını Bodrum ortalamasında bulabilir',
      transit: 'Akyarlar Mahallesi 4264. Sokak No:5/A, Akyarlar Limanı arkasında kısa yürüyüş mesafesinde',
      sources: [
        [
          'Kaptanın Yeri Akyarlar Resmi Web Sitesi',
          'https://kaptaninyeriakyarlar.com/',
          'operator',
          '1984 kuruluş geçmişi, taş fırın pideler, köfte-kebap ve günlük taze deniz ürünleri menüsü',
        ],
        [
          'Yemeksepeti — Kaptanın Yeri Akyarlar',
          'https://www.yemeksepeti.com/',
          'community',
          'Taze balık, kalamar, karides tava, ikram helva ve taş fırın menüsü hakkında çoklu doğrulanmış sipariş yorumları',
        ],
        [
          'Yandex Harita — Kaptanın Yeri Akyarlar',
          'https://yandex.com.tr/harita',
          'community',
          '4264 Sk. 5/A konumu, aile işletmesi sıcaklığı ve zeytinyağlı meze vitrini değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=7597950433849659500',
          'maps',
          'Operasyonel doğrulama (★4.4, 113 değerlendirme)',
        ],
      ],
      pros: [
        '1984’ten beri aile çizgisini koruması ve hem taş fırın pide-köfte hem de günlük taze deniz ürünü alternatifi sunması',
        'Akyarlar Limanı’na çok yakın konumda yıl boyu ulaşılabilir yerel mutfak çizgisi',
      ],
      cons: ['Denize sıfır masası bulunmaması nedeniyle tamamen kumsal/manzara odağı arayanlara göre iç sokakta kalır'],
      unc: ['Sezon dışındaki dönemlerde meze vitrini çeşidi günlük talebe göre daralabilir'],
    }),

    // ==================== 7. BALIKÇILAR ====================
    compactSeed({
      id: 'marea-fish-akyarlar',
      placeId: 'ChIJkwToNoQLvhQRtv41Kxijt80',
      cat: 'balik',
      brand: 'marea',
      area: 'GMK Blv. No:323 (Fenerburnu), Akyarlar',
      signals: ['denize_sifir_gun_batimi', 'taze_lakerda_ve_kalamar', 'modern_bohem_balikci'],
      verifiedAt: '2026-11-17',
      desc: "Akyarlar Fenerburnu batı kıyısında, Rammos Hotel bünyesinde denize sıfır gün batımı manzarasıyla hizmet veren; ev usulü taze lakerdası, özgün kalamar ara sıcakları, Ege otlu mezeleri ve günlük mevsim balıklarıyla modern çizgide bir kıyı balıkçısı.",
      order: ['Taze Lakerda & İmza Mezeler', 'Şef Dokunuşlu Kalamar & Karides', 'Günlük Mevsim Balıkları (Lagos / Fangri / Levrek)'],
      menu: [
        'Ev Usulü Taze Lakerda',
        'Ege Otları & Modern Zeytinyağlı Mezeler',
        'Şef Reçeteli Kalamar & Karides Ara Sıcakları',
        'Günlük Taze Lagos, Fangri, Levrek & Çipura',
        'Izgara, Tava & Buğulama Balık Seçenekleri',
        'Deniz Mahsullü Salatalar',
      ],
      sec: [
        [
          'Ege Otları & Zeytinyağlı Meze Vitrini',
          'Ana balık servisinden önce modern tekniklerle hafifletilmiş geleneksel Ege başlangıçları öne çıkar.',
          'FoodInLife ve rammoshotel.com menü anlatımı',
        ],
        [
          'Deniz Mahsullü Salata & Karides Ara Sıcakları',
          'Paylaşımlık akşam sofralarında lakerda ve kalamarın yanında sıkça tercih edilen ara tabaklardır.',
          'Yandex Harita misafir değerlendirmeleri',
        ],
      ],
      seat: 'Denize sıfır kumsal/teras platformu ve bohem akşam aydınlatmalı açık yemek alanı',
      crowd: 'Gün batımı saatlerinden geceye kadar sakin romantik çiftler ve gastronomi odaklı otel dışı akşam konukları',
      dis: 'Üst segment otel bünyesinde hizmet verdiğinden fiyat seviyesi klasik köy balıkçılarının üzerindedir ve yaz akşamları önceden rezervasyon gerektirir',
      transit: 'Akyarlar, Gazi Mustafa Kemal Bulvarı No:323 (Rammos Hotel sahil bandı) üzerinde',
      sources: [
        [
          'Rammos Hotel Bodrum — Marea Fish Restaurant',
          'https://www.rammoshotel.com/',
          'operator',
          'Denize sıfır Fenerburnu konumu, günlük mevsim balıkları ve modern meze mutfağı bilgisi',
        ],
        [
          'FoodInLife — Marea Fish Bodrum',
          'https://www.foodinlife.com/',
          'editorial',
          'Ege mutfağını modern pişirme teknikleriyle birleştiren şef balık mutfağı incelemesi',
        ],
        [
          'Yandex Harita & Tripadvisor Misafir Değerlendirmeleri',
          'https://yandex.com.tr/harita',
          'community',
          '700’ü aşkın değerlendirme ile lakerda, kalamar, gün batımı manzarası ve profesyonel servis geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=14823496022712778422',
          'maps',
          'Operasyonel doğrulama (★4.4, 702 değerlendirme)',
        ],
      ],
      pros: [
        'Standart balıkçıların yanında modern sunumlu lakerda, kalamar ve denize sıfır gün batımı deneyimi sunması',
        '700’ün üzerindeki değerlendirmeye rağmen istikrarlı mutfak ve servis kalitesi',
      ],
      cons: ['Üst segment fiyatlandırma uygulanması ve yaz sezonuna endeksli açık alan işletmeciliği'],
      unc: ['Otel dışı misafirler için kış sezonu açılış-kapanış dönemleri değişkenlik gösterebilir'],
    }),

    compactSeed({
      id: 'fener-restaurant-akyarlar',
      placeId: 'ChIJAQAAwF8MvhQRSMDunuyV8r4',
      cat: 'balik',
      brand: 'fener',
      area: 'Kemer Cd. No:30 (Çamlıburnu), Akyarlar',
      signals: ['1978_ucuncu_kusak_kurum', 'kos_bogazi_panoramik_manzara', 'gunluk_tezgah_mezeleri'],
      flags: { heritage: true, iconic: true },
      verifiedAt: '2026-11-17',
      desc: "1978'den beri üçüncü kuşak aile işletmesi olarak Çamlıburnu kayalıklarının üzerinden İstanköy (Kos) Boğazı'nı çerçeveleyen; her sabah taze hazırlanan klasik Ege mezeleri ve sade ızgara mevsim balıklarıyla Akyarlar'ın yarım asırlık simge balıkçısı.",
      order: ['Sabah Hazırlanan Tezgah Ege Mezeleri', 'Sade Izgara Mevsim Balıkları', 'Kalamar Tava & Ahtapot'],
      menu: [
        'Sabah Hazırlanan Zeytinyağlı & Yoğurtlu Ege Mezeleri',
        'Kalamar Tava & Karides Güveç',
        'Izgara Ahtapot',
        'Balık Böreği',
        'Günlük Mevsim Balıkları (Levrek, Çipura, Barbunya, Lüfer — Izgara/Buğulama)',
        'Deniz Mahsullü Salatalar',
      ],
      sec: [
        [
          'Balık Böreği & Karides Güveç',
          'Soğuk tezgah mezeleriyle ana ızgara balık arasında sıcak başlangıç olarak öne çıkar.',
          'Bodrum Meyhaneleri ve mesprestiges incelemeleri',
        ],
        [
          'Deniz Mahsullü Yeşil Salatalar',
          'Klasik rakı-balık masasını dengeleyen taze Ege yeşilliği tabaklarıdır.',
          'Yandex Harita konuk notları',
        ],
      ],
      seat: 'Denizden yaklaşık 15 metre yüksekte çamlar ve taş teras üzerinde kesintisiz Kos Adası manzaralı masalar',
      crowd: 'Gün batımı saatlerinde büyük aile yemekleri, özel kutlamalar ve nostaljik Bodrum arayan müdavimlerle yüksek akşam yoğunluğu',
      dis: 'Popüler gün batımı saatlerinde ve pik yaz akşamlarında servis hızında yavaşlama yaşanabilir; sahil ortalamasının üzerinde hesap gelir ve rezervasyonsuz masa bulmak zordur',
      transit: 'Akyarlar Mahallesi Kemer Caddesi No:30 Çamlıburnu Fener burnu üzerinde',
      sources: [
        [
          'Mesprestiges — Akyarlar Fener Restaurant (1978)',
          'https://www.mesprestiges.com/',
          'editorial',
          '1978’den beri aynı aile işletmesi geçmişi, sabah hazırlanan Ege mezeleri ve 15 metre kayalık konumu incelemesi',
        ],
        [
          'Bodrum Finder & Bodrum Meyhaneleri Rehberi',
          'https://www.bodrumfinder.com/',
          'editorial',
          'Üçüncü kuşak miras kurum kimliği, Kos Boğazı gün batımı panoraması ve rezervasyon uyarısı',
        ],
        [
          'Yandex Harita — Fener Restaurant Akyarlar',
          'https://yandex.com.tr/harita',
          'community',
          '1200’ü aşkın misafir değerlendirmesinde manzara, balık tazeliği ile yaz pik servis yavaşlaması ve fiyat geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=13726925884434845256',
          'maps',
          'Operasyonel doğrulama (★4.3, 1234 değerlendirme — 1978 tarihi kurum)',
        ],
      ],
      pros: [
        '1978’den beri üçüncü kuşak aile işletmesi olarak İstanköy (Kos) Boğazı’na hakim benzersiz fener konumu',
        'Gösterişten uzak sade ızgara balık ve günlük tezgah meze geleneği',
      ],
      cons: ['Yoğun yaz akşamlarında servis hızının düşebilmesi, yüksek fiyatlar ve önceden rezervasyon zorunluluğu'],
      unc: ['Yılın serin rüzgarlı aylarında açık teras kullanımı hava koşullarına bağlıdır'],
    }),

    compactSeed({
      id: 'mehtap-balik-akyarlar',
      placeId: 'ChIJJVpmD6kMvhQRLQIjcEDmJ6U',
      cat: 'balik',
      brand: 'mehtap',
      area: 'Yalı Cd. (Liman), Akyarlar',
      signals: ['1986_liman_kurumu', 'karamelize_izgara_ahtapot', 'kabak_cicegi_dolmasi'],
      flags: { heritage: true, iconic: true },
      verifiedAt: '2026-11-17',
      desc: "1986'dan beri Akyarlar Limanı'nda begonviller altında İdris Bey ve ailesi tarafından işletilen; önce haşlanıp ardından ızgarada karamelize edilen imza ahtapotu, kabak çiçeği dolması ve sabah iskeleden seçilen balıklarıyla kırk yıllık liman kurumu.",
      order: ['İmza Izgara Ahtapot (Karamelize)', 'Kabak Çiçeği Dolması & Patlıcanlı Mezeler', 'Sabah İskeleden Günlük Taze Balıklar'],
      menu: [
        'Haşlanıp Izgarada Karamelize Edilen Ahtapot',
        'Kabak Çiçeği Dolması',
        'Deniz Börülcesi & Taze Barbunya',
        'Levrek Marin & Patlıcanlı Ege Mezeleri',
        'Sabah İskeleden Seçilen Günlük Taze Balıklar',
        'Kalamar & Mevsim Salataları',
      ],
      sec: [
        [
          'Deniz Börülcesi & Levrek Marin',
          'Karamelize ahtapot ve kabak çiçeği dolması yanında sofrayı tamamlayan klasik günlük meze çeşitleridir.',
          'Harbiyiyorum gastronomi incelemesi',
        ],
        [
          'Gün İçi Serpme Kahvaltı & Kafe Servisi',
          'Akşam liman meyhanesi kimliği dışında gündüz saatlerinde limonata, çay ve kahvaltı seçeneği de sunar.',
          'Resmi Temassız Menü QR kaydı',
        ],
      ],
      seat: 'Akyarlar Limanı içinde begonviller altında, suya neredeyse sıfır kompakt iskele ve sokak kenarı masaları',
      crowd: 'Yaz akşamlarında yer bulmak için günler öncesinden dolan samimi müdavim ve gastronomi gezgini yoğunluğu',
      dis: 'Küçük bir liman aile işletmesi olduğu için yaz pik aylarında masalar arası mesafe sıkışık ve gürültülü olabilir; üst segment deniz ürünü fiyatları uygulanır',
      transit: 'Akyarlar Mahallesi Yalı / Tarık Akan Sokak No:4 Akyarlar Limanı içinde',
      sources: [
        [
          'Harbiyiyorum — Mehtap Balık Restaurant Akyarlar İncelemesi',
          'https://harbiyiyorum.com/',
          'editorial',
          'Karamelize ızgara ahtapot tekniği, kabak çiçeği dolması ve 1986 aile işletmesi gastronomi yazısı',
        ],
        [
          'Küçük Oteller & Mesprestiges — Akyarlar Limanı Mehtap Balık',
          'https://www.kucukoteller.com.tr/',
          'editorial',
          'İdris Bey ve ailesinin sabah iskeleden taze balık seçimi, mezeler ve Ağustos rezervasyon zorunluluğu incelemesi',
        ],
        [
          'Temassız Menü — Mehtap Restaurant Akyarlar',
          'https://temassizmenu.site/',
          'operator',
          'Aktif dijital menü ve liman kahvaltı/meze/balık listesi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=11900733704783462957',
          'maps',
          'Operasyonel doğrulama (★4.2, 520 değerlendirme — 1986 tarihi liman kurumu)',
        ],
      ],
      pros: [
        '1986’dan beri aynı aile yönetiminde Türkiye’nin bilinen ahtapot ızgara örneklerinden birini sunması',
        'Kurumsal gösterişten uzak, Akyarlar Limanı içinde begonvilli esnaf sıcaklığı',
      ],
      cons: ['Küçük liman alanında yaz kalabalığında sıkışıklık yaşanması ve üst segment hesap ortalaması'],
      unc: ['Sezon zirvesinde rezervasyonsuz akşam yemeği masası bulmak genellikle mümkün olmaz'],
    }),

    // ==================== NEGATİF DENETİM KONTROLLERİ ====================
    // Kapı 1 — Operasyonel Değil (Geçici veya Kalıcı Kapalı)
    negControl(
      'ctrl-akyarlar-tipsy-crab-closed',
      'ChIJ913HAp8NvhQRng_mcwtOQ4s',
      'balik',
      'Anthaven Tipsy Crab şu an Google Places kayıtlarında CLOSED_TEMPORARILY görünüyor (Kapı 1).'
    ),
    negControl(
      'ctrl-akyarlar-buselik-anthaven-closed',
      'ChIJhV96VvJzvhQRdQ2zLMzXMK4',
      'date',
      'Buselik Meyhane - Anthaven Bodrum Google Places kayıtlarında CLOSED_PERMANENTLY (Kapı 1).'
    ),

    // Kapı 2 — Zincir & Çok Şubeli Markalar
    negControl(
      'ctrl-akyarlar-magnolia-shop-chain',
      'ChIJKxGCPa9tvhQRjEAJzJ2g9Jw',
      'kahve',
      'Magnolia Shop Anthaven COOKSHOP bünyesinde 24 şubeli ulusal tatlı-kahve zinciri şubesi (Kapı 2).'
    ),
    negControl(
      'ctrl-akyarlar-kahve-dunyasi-chain',
      'ChIJi7Kyo58NvhQR2HBhMmyFOfw',
      'kahve',
      'Kahve Dünyası Anthaven ulusal kahve zinciri şubesi (Kapı 2).'
    ),
    negControl(
      'ctrl-akyarlar-bedri-usta-chain',
      'ChIJUWpUqvVtvhQR_b0JkUYQkX4',
      'denemelisin',
      'Bedri Usta Aspat çok şubeli kebap zinciri şubesi (Kapı 2).'
    ),
    negControl(
      'ctrl-akyarlar-big-chefs-chain',
      'ChIJ5zy3TC8NvhQR1Uv6rHwndjM',
      'date',
      'Big Chefs - Anthaven Şubesi çok şubeli brasserie zinciri (Kapı 2).'
    ),
    negControl(
      'ctrl-akyarlar-caytaze-chain',
      'ChIJk-WPaXoNvhQRB8XbcVc3OTU',
      'kahve',
      'Çaytaze Anthaven çok şubeli franchise kafe şubesi (Kapı 2).'
    ),

    // Kapı 3 — Yeme-İçme Dışı İşletmeler (Otel, Motel, AVM, Genel Hizmet, Turistik Nokta)
    negControl(
      'ctrl-akyarlar-radisson-hotel',
      'ChIJFYY9bckNvhQRWD8gO42POcY',
      'date',
      'Radisson Collection Hotel Bodrum ana türü hotel olduğu için yeme-içme seçkisi dışı (Kapı 3).'
    ),
    negControl(
      'ctrl-akyarlar-aspat-hotel-rest',
      'ChIJS8TbUlYNvhQR_fh-bq0pJDg',
      'denemelisin',
      'ASPAT HOTEL BODRUM Beach Restaurant birincil türü hotel (Kapı 3).'
    ),
    negControl(
      'ctrl-akyarlar-kardesler-motel',
      'ChIJF3q4N_YMvhQRCoAsH9W7kqY',
      'balik',
      'Kardeşler Motel &Restaurant birincil türü motel ve puanı ★4.1 (Kapı 3).'
    ),
    negControl(
      'ctrl-akyarlar-anthaven-carsi-mall',
      'ChIJTdSVi0INvhQRKQXcpq4e120',
      'kahve',
      'Anthaven Çarşı birincil türü shopping_mall (Kapı 3).'
    ),
    negControl(
      'ctrl-akyarlar-anthaven-service',
      'ChIJv4WajfUMvhQRNR00qe32LSE',
      'date',
      'Anthaven genel site/hizmet pini (Kapı 3).'
    ),
    negControl(
      'ctrl-akyarlar-adacik-attraction',
      'ChIJu8zOxLwNvhQRBW8xqbUyco8',
      'date',
      'Aspat koyu ıssız adacık birincil türü tourist_attraction (Kapı 3).'
    ),
    negControl(
      'ctrl-akyarlar-sahil-evleri',
      'ChIJ2UrTLfUNvhQRqafB5oKZ5D4',
      'date',
      'Anthaven Sahil Evleri birincil türü tourist_attraction (Kapı 3).'
    ),

    // Kapı 3B — Saf Kahveci Olmayan Çikolata/Dondurma Dükkanı Kahve Reddi
    negControl(
      'ctrl-akyarlar-makbush-kahve-purity',
      'ChIJDSl_Xy8NvhQRF8XgiCGEEbI',
      'kahve',
      'Makbush Chocolatier & Gelateria Aspat birincil türü ice_cream_shop; kahve kategorisine giremez (Kapı 3B).'
    ),

    // Kapı 6 — Sıkı ★4.4 Puan & ≥35 Değerlendirme Tabanı Altı
    negControl(
      'ctrl-akyarlar-karabatak-low',
      'ChIJs_GgUW0NvhQR4TbgD0m-a5s',
      'kahve',
      'Karabatak Aspat ★3.9 (258) ile ★4.4 kalite eşiğinin altında (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-parilti-low',
      'ChIJb4hUdpoNvhQRMDfRYhU9FMI',
      'denemelisin',
      'PARILTI BEACH RESTAURANT ★4.3 (56) ile taban altında (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-sedir-low',
      'ChIJT4iIBV4MvhQRUsf7rEeTSt4',
      'denemelisin',
      'Sedir Restaurant Akyarlar ★4.2 (245) ile ★4.4 eşiğinin altında (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-kadikoyluler-low',
      'ChIJhZwUv0sNvhQRcFv0NgEdkdM',
      'balik',
      'Karaincir Kadıköylüler Beach & Restaurant ★4.2 (172) ile ★4.4 eşiğinin altında (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-karaincir-motel-low',
      'ChIJjwWTBfcMvhQRwNcXdfRtig4',
      'denemelisin',
      'Karaincir Beach Motel ★4.2 (75) ile ★4.4 eşiğinin altında (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-pareo-beach-low',
      'ChIJG9wJF3EMvhQRXTmu0c2Cc6I',
      'date',
      'Pareo Beach Restoran ★4.1 (154) ile ★4.4 eşiğinin altında (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-bal-mahmut-low',
      'ChIJObR16l8MvhQRxj_wTDY1SRA',
      'balik',
      "Karaincir Beach Bal Mahmut'un Yeri ★3.9 (586) ile ★4.4 eşiğinin altında (Kapı 6)."
    ),
    negControl(
      'ctrl-akyarlar-moonlight-low',
      'ChIJV-NLE14MvhQRLDj9D7s1KkQ',
      'denemelisin',
      'Moonlight Restaurant ★4.0 (150) ile ★4.4 eşiğinin altında (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-belediye-cafe-low',
      'ChIJaU6N_DgNvhQRTQh33Fuj850',
      'kahvalti',
      'Akyarlar Cafe - Bodrum Belediye A.Ş. ★4.3 (76) ile taban altında (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-fener-doner-low',
      'ChIJG0lthPELvhQRN8Het3c5nHw',
      'denemelisin',
      'Fener Döner ★4.3 (69) ile ★4.4 tabanı altında (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-ozbalci-pide-low',
      'ChIJh0ERQGcMvhQRU4WfYmOc9Xg',
      'denemelisin',
      'Özbalcı Karadeniz Pide Salonu ★3.6 (197) ile taban altında (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-katre-low-count',
      'ChIJA-ZaYQANvhQRa5JEOMDE6Lg',
      'denemelisin',
      'Katre Bodrum yalnızca 17 değerlendirmeye sahip olduğundan <35 eşiği altında elenir (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-delice-bahce-low-count',
      'ChIJLZD7UPwNvhQRM5_KXkuzwpg',
      'kahvalti',
      'Akyarlar Delice Bahçe Restaurant & Cafe yalnızca 15 değerlendirmeye sahip (Kapı 6).'
    ),
    negControl(
      'ctrl-akyarlar-ninetta-low-count',
      'ChIJC0-ly7pzvhQRZFU4qFMAQBs',
      'date',
      'Ninetta Beach & Restaurant yalnızca 25 değerlendirmeye sahip (Kapı 6).'
    ),

    // Kapı 8 — <150 Değerlendirmede ★4.8+ Şüpheli Şişirilmiş Puan Koruması (Bağımsız Editöryal Kanıt Yok)
    negControl(
      'ctrl-akyarlar-kayikhan-inflation',
      'ChIJieKB5MYNvhQR0icUADK_Gjg',
      'date',
      'Kayıkhane Bodrum 56 değerlendirmede ★5.0 puana sahip olup 2 bağımsız gastronomi/topluluk kanıtı taşımadığı için elenir (Kapı 8).'
    ),
    negControl(
      'ctrl-akyarlar-castello-inflation',
      'ChIJR8yurtkNvhQRH-ygA69-tko',
      'date',
      'Castello Aspat 79 değerlendirmede ★4.9 puana sahip olup bağımsız gastronomi kanıtı sunmadığı için elenir (Kapı 8).'
    ),
    negControl(
      'ctrl-akyarlar-asia-hotel-inflation',
      'ChIJH78W5lMNvhQRLLFGfetvTm4',
      'denemelisin',
      'Asia Hotel & Restaurant 35 değerlendirmede ★5.0 puana sahip olup bağımsız gastronomi incelemesi taşımaz (Kapı 8).'
    ),

    // Kapı 4 — Sıkı Mahalle Sınırı Dışı (Turgutreis, Bahçelievler & Yahşi Komşu Taşmaları)
    negControl(
      'ctrl-akyarlar-jura-turgutreis-outside',
      'ChIJAUwFTnkLvhQRqC9lzDHIBHs',
      'balik',
      'Jura İskele Balık coğrafi koordinatları sınıra yakın olsa da resmi adresi Turgutreis Mahallesi olarak geçtiği için dışlanır (Kapı 4).'
    ),
    negControl(
      'ctrl-akyarlar-monachello-turgutreis-outside',
      'ChIJT9-FyrwLvhQRFl-ruWRUnY4',
      'date',
      'Monachello Restaurant adresi Turgutreis Mahallesi sınırlarında yer alır (Kapı 4).'
    ),
    negControl(
      'ctrl-akyarlar-costa-sueno-turgutreis-outside',
      'ChIJ1ThucjsNvhQRdzOi4jg0qWQ',
      'date',
      'Costa Del Sueno yayındaki #49 Turgutreis bölgesine aittir (Kapı 4).'
    ),
    negControl(
      'ctrl-akyarlar-caffeine-turgutreis-outside',
      'ChIJRULn0eALvhQR14ann0qw5lQ',
      'kahve',
      'Caffeine Coffee Turgutreis yayındaki #49 Turgutreis bölgesine aittir (Kapı 4).'
    ),
    negControl(
      'ctrl-akyarlar-balikcinin-yeri-yahsi-outside',
      'ChIJFSTXyjINvhQRnzTLEavKbbs',
      'balik',
      'Balıkçının Yeri balık Restaurant yayındaki #50 Ortakent & Yahşi bölgesine aittir (Kapı 4).'
    ),
    negControl(
      'ctrl-akyarlar-sakalli-bahcelievler-outside',
      'ChIJjQfvE1sLvhQRwAnYlq2CaAw',
      'denemelisin',
      'Sakalli Restaurant Sinan Bahçelievler (Turgutreis) sınırlarında yer alır (Kapı 4).'
    ),
  ],
};
