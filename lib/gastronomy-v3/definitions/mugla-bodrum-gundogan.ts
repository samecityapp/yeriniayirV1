import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const MUGLA_BODRUM_GUNDOGAN_DEF: V3RegionDefinition = {
  id: 'gundogan-bodrum-mugla',
  slug: 'gundogan',
  city: 'Muğla',
  district: 'Bodrum',
  allowedDistricts: ['Bodrum'],
  neighborhood: 'Gündoğan',
  officialQuarter:
    'Gündoğan, Farilya & Küçükbük Mahalleleri — Gündoğan Sahil Şeridi, Balıkçı Barınağı, Küçükbük Koyu & Kızılburun Hattı',
  displayName: 'Gündoğan, Bodrum, Muğla',
  locative: "Gündoğan'da",
  path: ['mugla', 'bodrum', 'gundogan'],
  aliases: [
    'Gündoğan',
    'Gundogan',
    'Farilya',
    'Küçükbük',
    'Kucukbuk',
    'Küçükbük Koyu',
    'Gündoğan Sahil',
    'Kızılburun Gündoğan',
  ],
  scopeNote:
    'Gündoğan Sahil Şeridi, Farilya, Küçükbük Koyu, Kızılburun & Yukarı Gündoğan Hattı · Doğrulanmış Seçki',
  characterSubtitle:
    'Gündoğan sahil şeridi ve balıkçı barınağından Farilya sırtlarına, Kızılburun koyundan Küçükbük fırınlarına uzanan odun fırını pizza durağı, gün batımı kokteyl barları, otantik Japon mutfağı ve sahil bistroları, mandalina bahçeli serpme kahvaltılar, ekşi mayalı artizan fırın, ev yemekleri lokantaları, ocakbaşı ve kıyı balıkçıları.',
  center: { lat: 37.1315, lng: 27.3455 },
  bbox: { minLat: 37.1180, maxLat: 37.1560, minLng: 27.3265, maxLng: 27.3615 },
  allowedNeighborhoodTokens: ['Gündoğan', 'Gundogan', 'Farilya', 'Küçükbük', 'Kucukbuk'],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // ==================== 1. PİZZA ====================
    compactSeed({
      id: 'gundogan-pam-pizza',
      placeId: 'ChIJJbhdItdxvhQRMA64rQY8hBA',
      cat: 'pizza',
      brand: 'pam',
      area: 'Şht. Uğur Öztop Cd., Gündoğan',
      signals: ['yerel_pizza_firini', 'zengin_pizza_cesidi', 'paket_ve_masada_servis'],
      verifiedAt: '2026-11-16',
      desc: "Gündoğan Şehit Uğur Öztop Caddesi'nde eski garaj çevresinde hizmet veren; klasik Margherita ve dört peynirli çeşitlerden bonfile, pastırma ve ton balıklı pizzalara uzanan menüsüyle bilinen yerel pizza fırını.",
      order: ['Margherita Pizza', '4 Peynirli Pizza', 'Bonfile Pizza'],
      menu: [
        'Margherita Pizza',
        '4 Peynirli Pizza',
        'Mantarlı Pizza',
        'Ispanaklı Pizza',
        'Sebzeli Pizza',
        'Sucuklu Pizza',
        'Karışık Pizza',
        'Ton Balıklı Pizza',
        'Pastırmalı Pizza',
        'Bonfile Pizza',
      ],
      sec: [
        [
          'Pastırmalı & Karışık Pizza',
          'Klasik Margherita ve peynirli çeşitler dışında şarküteri ve et ağırlıklı orta boy alternatif arayanların tercih ettiği seçeneklerdir.',
          'Yemeksepeti menü kayıtları',
        ],
        [
          'Ton Balıklı & Ispanaklı Pizza',
          'Daha hafif veya sebze-deniz ürünü dengeli pizza tercih edenler için menüde düzenli olarak yer alır.',
          'Yemeksepeti menü listesi ve Restaurant Guru kayıtları',
        ],
      ],
      seat: 'Şehit Uğur Öztop Caddesi üzerinde mütevazı iç masa düzeni ve hızlı paket servis bankosu',
      crowd: 'Bölge sakinleri, aileler ve akşam saatlerinde paket sipariş veren yerel misafirlerle sakin tempo',
      dis: 'Sahil bandının içerideki ana caddesinde kaldığından deniz manzarası bulunmaz; çevrimiçi değerlendirme havuzu henüz küçük ölçeklidir',
      transit: 'Gündoğan Şehit Uğur Öztop Caddesi No:79-2 (eski garaj civarı) üzerinde',
      sources: [
        [
          'Yemeksepeti — Gündoğan Pam Pizza Menüsü',
          'https://www.yemeksepeti.com/',
          'community',
          'Margherita, 4 Peynirli, Bonfile, Pastırmalı, Ton Balıklı, Ispanaklı ve Karışık pizza menü kayıtları',
        ],
        [
          'Restaurant Guru — Gündoğan Pam Pizza',
          'https://restaurantguru.com/',
          'community',
          'Gündoğan yerel pizzacı profili, ziyaretçi fotoğrafları ve değerlendirme kayıtları',
        ],
        [
          'Yandex Harita — Pam Pizza Gündoğan',
          'https://yandex.com.tr/harita',
          'community',
          'Şehit Uğur Öztop Caddesi No:79 Gündoğan Garajı civarı konum ve pide-pizza notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=1190142200914644528',
          'maps',
          'Gündoğan Şht. Uğur Öztop Cd. 79-2 konum ve pizza_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Sahil turizmi kalabalığından uzakta, Gündoğan merkezinde dürüst orta bütçe seviyesinde pizza ve paket servis imkanı',
        'Klasik İtalyan tariflerinden bonfileli ve pastırmalı seçeneklere geniş orta boy çeşitliliği',
      ],
      cons: [
        'Deniz kıyısı manzarası veya geniş bahçe oturma alanı sunmaz',
        'Değerlendirme sayısı görece sınırlı olduğundan yoğun sezon akşamlarında servis süresi değişebilir',
      ],
      unc: ['Sezon dışında çalışma saatleri ve paket servis bölgesi dönemsel olarak güncellenebiliyor'],
    }),

    // ==================== 4. DATE MEKANLARI ====================
    compactSeed({
      id: 'jour-bodrum-gundogan',
      placeId: 'ChIJ7eqpVb5xvhQRXBju-T0ByIg',
      cat: 'date',
      secondaryCategoryIds: ['kahvalti'],
      brand: 'jour',
      area: 'Sahil Şeridi, Gündoğan',
      signals: ['bohem_teras_marina', 'petra_kahve_ve_kokteyl', 'canli_cello_aksamlari'],
      verifiedAt: '2026-11-16',
      desc: "Gündoğan Sahil Şeridi'nde marina karşısındaki bohem bahçesi ve koy manzaralı terasıyla bilinen; sabah ekşi mayalı kahvaltı tabakları ve Petra çekirdekleriyle nitelikli kahve, akşamüstü ise paylaşımlı tabaklar, imza kokteyller ve çello-gitar dinletileri sunan yaşam alanı.",
      order: ['Keçi Peynirli & Cevizli Menemen', 'Akşam Paylaşımlı Tabaklar', 'İmza Kokteyller'],
      menu: [
        'Keçi Peynirli Cevizli Menemen',
        'Ekşi Mayalı Çılbır & Çırpılmış Yumurta',
        'Pancake & French Toast',
        'Nitelikli Kahveler (Petra)',
        'Paylaşımlı Dünya Mutfağı Tabakları',
        'İmza Kokteyller',
      ],
      sec: [
        [
          'Ekşi Mayalı Çılbır & Çırpılmış Yumurta',
          'Gündoğan sahilinde sabah saatlerinden itibaren modern dokunuşlu kahvaltı arayanların öne çıkardığı tabaklardır.',
          'Müdavim.net kahvaltı ve menü incelemesi',
        ],
        [
          'Petra Çekirdekleriyle Hazırlanan Nitelikli Kahveler',
          'Gündüz bahçede çalışma veya sakin mola sırasında tercih edilen üçüncü nesil kahve seçkisidir.',
          'Yandex Harita ve Müdavim.net kayıtları',
        ],
      ],
      seat: 'Gündoğan koyuna bakan geniş teras, bohem tasarımlı bahçe masaları ve üç odalı butik konaklama yapısı',
      crowd: 'Gündüz dizüstü bilgisayarla çalışanlar ve kahve molası verenlerle dingin, akşamüstü DJ ve canlı dinletilerle hareketli',
      dis: 'Canlı müzik veya DJ seti olan akşamüstü ve hafta sonu saatlerinde tempo sessiz sohbet beklentisinin üzerine çıkabilir',
      transit: 'Gündoğan Sahil Şeridi Küme Evleri No:22 (marina karşısı) üzerinde sahil yürüyüş aksında',
      sources: [
        [
          'JOUR Bodrum Resmi Sitesi',
          'https://www.jourbodrum.com/',
          'operator',
          'Üç odalı butik konaklama, restoran-bar konsepti ve paylaşımlı tabaklar resmi tanıtımı',
        ],
        [
          'Müdavim.net — JOUR Bodrum',
          'https://www.mudavim.net/',
          'community',
          'Ekşi mayalı kahvaltı, çılbır, keçi peynirli menemen, imza kokteyller ve cumartesi çello-gitar dinletileri notu',
        ],
        [
          'GrabLocals & My Guide Bodrum — JOUR Bodrum',
          'https://www.grablocals.com/',
          'editorial',
          'Marina manzaralı geniş teras, bohem bahçe atmosferi ve gün boyu sosyal buluşma alanı profili',
        ],
        [
          'Yandex Harita — JOUR Bodrum',
          'https://yandex.com.tr/harita',
          'community',
          'Petra kahve çekirdekleri, bahçe düzeni ve konum değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=9856129150198093916',
          'maps',
          'Gündoğan Sahil Şeridi Küme Evleri No:22 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Sabah modern kahvaltı ve üçüncü nesil kahveden akşam kokteyl ve canlı dinletiye kesintisiz dönüşen nadir Gündoğan adresi',
        'Koy ve marina manzaralı geniş terası ile estetik Ege mimarisi',
      ],
      cons: [
        'Akşamüstü müzik ritminin yükselmesi erken saatlere göre daha canlı ve sesli bir atmosfer yaratabilir',
        'Yaz sezonunda teras masaları hızlı dolduğu için akşam saatlerinde rezervasyon gerekebiliyor',
      ],
      unc: ['Sezon dışı aylarda akşam bar ve canlı müzik takvimi işletme tarafından sınırlanabiliyor'],
    }),
    compactSeed({
      id: 'piha-bodrum-gundogan',
      placeId: 'ChIJy8yiuSBxvhQRYiPkl24QOTw',
      cat: 'date',
      brand: 'piha',
      area: 'Kızılburun Plaj Çıkmazı, Gündoğan',
      signals: ['gun_batimi_kokteyl_bari', 'kizilburun_sahili', 'dj_ve_konsept_geceler'],
      verifiedAt: '2026-11-16',
      desc: "Kızılburun Plaj Çıkmazı'nda deniz kıyısında konumlanan; gündüz sakin plaj alanı, gün batımında ise imza kokteylleri ve DJ performanslarıyla Gündoğan'ın akşam sosyalleşme adreslerinden biri haline gelen kokteyl bar.",
      order: ['İmza Kokteyller', 'Gün Batımı Aperitifleri', 'Sahil Atıştırmalıkları'],
      menu: [
        'İmza Kokteyl Seçkisi',
        'Klasik Kokteyller & Cin-Tonik',
        'Sahil Atıştırmalık Tabakları',
        'Soğuk İçecekler & Şarap Seçkisi',
      ],
      sec: [
        [
          'Sahil Atıştırmalık Tabakları',
          'Kokteyl eşliğinde paylaşımlı akşamüstü atıştırmalıkları arayan masalara sunulur.',
          'Bodrum Guru incelemesi ve resmi Instagram duyuruları',
        ],
        [
          'Konsept DJ Geceleri & Sanat Atölyeleri',
          'Popaturca gibi 90lar geceleri ve sezon içi baskı atölyeleriyle yalnız bar değil sosyal buluşma takvimi sunar.',
          'Bodrum Flow ve Shopier etkinlik kayıtları',
        ],
      ],
      seat: 'Kızılburun kıyısında denize sıfır açık sahil alanı, kokteyl bar çevresi ve lounge oturma grupları',
      crowd: 'Gün batımı ve gece saatlerinde genç yetişkinler, çiftler ve müzik odaklı arkadaş gruplarıyla enerjik',
      dis: 'Yüksek bütçe segmentindedir; DJ ve tematik müzik gecelerinde ses düzeyi sakin akşam yemeği mekanlarına göre yüksektir',
      transit: 'Gündoğan Kızılburun Caddesi Plaj Çıkmazı No:68/1-1 üzerinde sahil hattında',
      sources: [
        [
          'Bodrum Guru — Piha Bodrum',
          'https://www.bodrumguru.com/',
          'editorial',
          'Kızılburun sahil atmosferi, imza kokteyller, gün batımı ve DJ performansları değerlendirmesi',
        ],
        [
          'Bodrum Flow — Piha Bodrum Etkinlikleri',
          'https://bodrumflow.com/',
          'editorial',
          '90lar Türkçe pop temalı Popaturca geceleri ve canlı müzik etkinlik takvimi',
        ],
        [
          'My Guide Bodrum — Piha Bodrum',
          'https://www.myguidebodrum.com/',
          'community',
          'Kızılburun Cd. Plaj Çıkmazı No:68/1-1 konum ve bar profili doğrulaması',
        ],
        [
          'Piha Bodrum Resmi Instagram',
          'https://www.instagram.com/piha.bodrum',
          'operator',
          'Güncel kokteyl menüsü ve yaz sezonu etkinlik paylaşımları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=4339517783128941410',
          'maps',
          'Kızılburun Plaj Çıkmazı No:68/1-1 konum ve cocktail_bar doğrulaması',
        ],
      ],
      pros: [
        'Gündoğan’da doğrudan kokteyl bar ve gün batımı DJ atmosferine odaklanan nadir sahil mekanlarından biri',
        'Kızılburun kıyısındaki konumuyla merkez kalabalığından ayrı bir akşam deneyimi sunması',
      ],
      cons: [
        'Yüksek fiyat segmentinde yer alır',
        'Ağırlıklı kokteyl ve müzik mekanı olduğundan kapsamlı akşam yemeği mutfağı bekleyenlere uygun değildir',
      ],
      unc: ['Sezonluk çalışma takvimi nedeniyle yaz ayları dışında kapalı kalabiliyor'],
    }),
    compactSeed({
      id: 'itsumi-bodrum-gundogan',
      placeId: 'ChIJJZqFPDlxvhQRLP0KRS1zvmY',
      cat: 'date',
      brand: 'itsumi',
      area: 'Kızılburun Cd. (Cape Bodrum), Gündoğan',
      signals: ['otantik_japon_mutfagi', 'sef_shunichi_horikoshi', 'gun_batimi_koy_terasi'],
      verifiedAt: '2026-11-16',
      desc: "İstanbul'un köklü Japon restoranı Itsumi'nin Gündoğan Kızılburun'daki Cape Bodrum Luxury Hotel & Beach terasında açılan yaz şubesi. Şef Shunichi Horikoshi imzalı geleneksel suşi, sashimi, tempura ve robata tabaklarını koy manzaralı gün batımı eşliğinde sunar.",
      order: ['Şefin Özel Sashimi & Nigiri Seçkisi', 'Çıtır Tempura Çeşitleri', 'Robata Izgara Tabakları'],
      menu: [
        'Nigiri & Sashimi Çeşitleri',
        'Chirashi Sushi & Futomaki',
        'Somon Carpaccio',
        'Karides & Sebze Tempura',
        'Robata Izgara Seçenekleri',
        'Edamame, Gyoza & Miso Çorbası',
        'Yakimeshi & Noodle Çeşitleri',
      ],
      sec: [
        [
          'Chirashi Sushi & Somon Carpaccio',
          'Geleneksel nigiri dışında taze balık ve pirinç dengesini öne çıkaran otantik Japon tabaklarıdır.',
          'itsumijp.com menü listesi ve Yandex Harita kayıtları',
        ],
        [
          'Gyoza, Edamame & Miso Çorbası',
          'Suşi ve robata öncesi sofrayı açan klasik sıcak başlangıçlardır.',
          'Yemeksepeti menü kayıtları ve Üşengeç Şef incelemesi',
        ],
      ],
      seat: 'Cape Bodrum terasında Gündoğan koyuna hakim açık hava akşam yemek masaları',
      crowd: 'Özel akşam yemeği planlayan çiftler ve otantik Japon mutfağı arayan misafirlerle sakin ve seçkin tempo',
      dis: 'Yüksek bütçe kategorisindedir; yalnızca yaz sezonunda akşam servisi verdiğinden önceden rezervasyon gerektirir',
      transit: 'Gündoğan Kızılburun Caddesi No:72 (Cape Bodrum Luxury Hotel & Beach içi) üzerinde',
      sources: [
        [
          'Itsumi Resmi Sitesi — Bodrum Şubesi',
          'https://itsumijp.com/',
          'operator',
          'Şef Shunichi Horikoshi yönetimindeki Cape Bodrum yaz sezonu şubesi ve akşam servisi detayı',
        ],
        [
          'Üşengeç Şef — Itsumi Bodrum',
          'https://www.usengecsef.com/',
          'editorial',
          'Amerikanlaşmış füzyon yerine geleneksel Japon reçetelerine sadık suşi, sashimi ve tempura değerlendirmesi',
        ],
        [
          'Mes Prestiges — Itsumi Bodrum Gündoğan',
          'https://www.mesprestiges.com/',
          'editorial',
          'Kızılburun koy manzaralı teras atmosferi ve rezervasyon önerisi',
        ],
        [
          'Cape Bodrum Resmi Sitesi',
          'https://www.capebodrum.com/',
          'operator',
          'Otel içi konum, deniz manzaralı teras ve sushi-robata menü bilgisi',
        ],
        [
          'Yemeksepeti — Itsumi Bodrum Menüsü',
          'https://www.yemeksepeti.com/',
          'community',
          'Edamame, miso çorbası, agemono ve robata menü kalemleri doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=7403481475712744748',
          'maps',
          'Gündoğan Kızılburun hattı konum ve japanese_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Bodrum yarımadasında geleneksel Japon mutfağı disiplinine sadık şef yönetimindeki ender restoranlardan biri',
        'Cape Bodrum terasından Gündoğan koyuna bakan sakin gün batımı ambiyansı',
      ],
      cons: [
        'Yüksek fiyat segmentinde yer alır',
        'Mevsimlik yaz şubesi olduğundan sezon dışında hizmet vermez; değerlendirme sayısı henüz küçük ölçeklidir',
      ],
      unc: ['Sezon açılış ve kapanış tarihleri her yaz dönemsel olarak belirlenmektedir'],
    }),
    compactSeed({
      id: 'gadioglu-restaurant-beach-cafe',
      placeId: 'ChIJxVZ_mjlwvhQRxuGz7UXjb30',
      cat: 'date',
      brand: 'gadıoğlu',
      area: 'Emek Sk., Gündoğan',
      signals: ['denize_sifir_kumsal', 'gun_batimi_caz_canli_muzik', 'ege_deniz_urunleri'],
      verifiedAt: '2026-11-16',
      desc: "Aşağı Mahalle Emek Sokak'ın denizle buluştuğu noktada yer alan; gündüz plaj ve kahve-kahvaltı düzeniyle çalışan, akşamüstü ise gün batımı kokteylleri, canlı caz-akustik performansları ve Ege deniz ürünleriyle sahil akşamlarına dönüşen mekan.",
      order: ['Izgara Ahtapot & Günlük Taze Balık', 'Ege Otlu Mezeler', 'Gün Batımı İmza Kokteylleri'],
      menu: [
        'Ege Otlu & Zeytinyağlı Mezeler',
        'Midye Dolma & Deniz Börülcesi',
        'Izgara Ahtapot',
        'Günün Avı Taze Balıklar',
        'Serpme Kahvaltı & Kahvaltı Tabağı',
        'İmza Kokteyller & Kahve Çeşitleri',
      ],
      sec: [
        [
          'Serpme Kahvaltı & Gündüz Plaj Servisi',
          'Sabah saatlerinden öğleye kadar denize sıfır masalarda kahvaltı ve hafif plaj atıştırmalıkları sunar.',
          'Mes Prestiges ve My Guide Bodrum kayıtları',
        ],
        [
          'Midye Dolma & Deniz Börülcesi',
          'Akşam yemeği başlangıcında taze balık öncesi sofraya gelen kıyı mezeleridir.',
          'My Guide Bodrum menü ve atmosfer incelemesi',
        ],
      ],
      seat: 'Denize sıfır kumsal şezlongları, sahil kenarı açık akşam masaları ve aile dostu oyun-otopark alanı',
      crowd: 'Gündüz plaj ve ailelerle hareketli, gün batımında canlı müzik eşliğinde çiftler ve gruplarla keyifli',
      dis: 'Gündüz plaj, yoga ve kutlama organizasyonları da yapıldığından tamamen sessiz izole bir akşam mekanı değildir; sezonluk çalışır',
      transit: 'Gündoğan Aşağı Mahallesi Emek Sokak No:13 üzerinde sahil kıyısında',
      sources: [
        [
          'Gadıoğlu Resmi Sitesi',
          'https://gadioglu.com/',
          'operator',
          'Aşağı Mahalle Emek Sokak No:13 adresi, plaj-restoran-kafe yapısı ve canlı müzik bilgisi',
        ],
        [
          'Mes Prestiges — Gadıoğlu Restaurant & Beach',
          'https://www.mesprestiges.com/',
          'editorial',
          'Denize sıfır konum, sabah kahvaltısından akşam balık ve meze servisine dönüşen sezonluk konsept',
        ],
        [
          'My Guide Bodrum — Gadıoğlu',
          'https://www.myguidebodrum.com/',
          'community',
          'Ege otları, taze deniz ürünleri, ahtapot ızgara, imza kokteyller ve gün batımı canlı müzik notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=9038692866636112326',
          'maps',
          'Gündoğan Emek Sk. No:13 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Gündoğan kıyısında tek noktada plaj, gündüz kahvesi ve gün batımı canlı müzikli akşam yemeğini birleştirmesi',
        'Otopark imkanı ve çocuklu ailelere de hitap eden geniş sahil alanı',
      ],
      cons: [
        'Özel kutlama ve organizasyon akşamlarında alan kalabalıklaşabilir',
        'İlkbahar-sonbahar arası sezonluk çalışma düzeni nedeniyle kış aylarında kapalıdır',
      ],
      unc: ['Gün batımı canlı müzik günleri yaz sezonunda haftalık programa göre değişmektedir'],
    }),

    // ==================== 5. KAHVALTI ====================
    compactSeed({
      id: 'bodrum-hayat-kahvalti-farilya',
      placeId: 'ChIJMYGF8utxvhQROq3PDdX4Lwk',
      cat: 'kahvalti',
      brand: 'hayat',
      name: 'Bodrum Hayat Kahvaltı Evi',
      area: 'Aşık Veysel Cd. (Farilya), Gündoğan',
      signals: ['mandalina_bahcesi_kahvaltisi', 'ev_yapimi_recel_gozleme', 'comlekte_sosis'],
      verifiedAt: '2026-11-16',
      desc: "Farilya Aşık Veysel Caddesi'nde mandalina ve limon ağaçlarının gölgesindeki huzurlu bahçesinde servis veren; ev yapımı reçelleri, el açması gözlemeleri, sıcak pişisi ve çömlekte sosisiyle tanınan köy kahvaltısı durağı.",
      order: ['Serpme Köy Kahvaltısı', 'El Açması Gözleme & Pişi', 'Çömlekte Sosis'],
      menu: [
        'Serpme Köy Kahvaltısı',
        'Ev Yapımı Reçeller & Yöresel Peynirler',
        'El Açması Gözleme Çeşitleri',
        'Sıcak Pişi & Odun Fırını Börekleri',
        'Çömlekte Sosis',
        'Menemen & Sahanda Yumurta',
      ],
      sec: [
        [
          'Odun Fırını Börekleri & Menemen',
          'Serpme kahvaltı sofrasını zenginleştiren fırından taze çıkan sıcak hamur işleri ve yumurta çeşitleridir.',
          'Mes Prestiges ve Yandex Harita değerlendirmeleri',
        ],
        [
          'Ev Yapımı Reçeller & Organik Bahçe Ürünleri',
          'Kahvaltının imza parçaları arasında mevsim meyvelerinden hazırlanan doğal reçel çeşitleri öne çıkar.',
          'OGGUSTO Bodrum kahvaltı seçkisi',
        ],
      ],
      seat: 'Farilya iç kesiminde mandalina ve limon ağaçları altında gölgeli açık bahçe masaları',
      crowd: 'Sabah ve geç kahvaltı saatlerinde sakin bahçe atmosferi arayan aileler ve çiftlerle dengeli',
      dis: 'Sahilden içerideki Farilya bölgesinde bulunduğundan deniz manzarası yoktur; harita kayıtlarında zaman zaman eski Hayat Meyhanesi adıyla da görünebiliyor',
      transit: 'Farilya Mahallesi Aşık Veysel Caddesi No:1 üzerinde Gündoğan iç yol hattında',
      sources: [
        [
          'OGGUSTO — Bodrum Kahvaltı Mekanları',
          'https://www.oggusto.com/',
          'editorial',
          'Farilya Aşık Veysel Caddesi konumu, mandalina-limon bahçesi ve ev yapımı serpme kahvaltı vurgusu',
        ],
        [
          'Mes Prestiges — Bodrum Hayat Kahvaltı Evi',
          'https://www.mesprestiges.com/',
          'editorial',
          'Doğayla iç içe bahçe atmosferi, ev reçelleri ve odun fırını börekleri incelemesi',
        ],
        [
          'Bodrum Guru — Bodrum Hayat',
          'https://www.bodrumguru.com/',
          'editorial',
          'Meyhane yerine ağırlıklı serpme kahvaltı ve gündüz bahçe konseptiyle öne çıktığına dair rehber notu',
        ],
        [
          'Restaurant Guru & Sluurpy — Bodrum Hayat Kahvaltı Evi',
          'https://restaurantguru.com/',
          'community',
          'Çömlekte sosis, el açması gözleme ve ziyaretçi memnuniyeti kayıtları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=662021264190188858',
          'maps',
          'Farilya Aşık Veysel Cd. No:1 konum ve breakfast_restaurant/bar tür doğrulaması',
        ],
      ],
      pros: [
        'Sahildeki gürültülü plaj kahvaltılarına alternatif olarak ağaçlar altında huzurlu bir Farilya bahçesi sunması',
        'Ev yapımı reçeller, sıcak pişi, gözleme ve çömlekte sosis gibi özenli kahvaltı ürünleri',
      ],
      cons: [
        'Deniz kıyısında değil iç mahalle yolunda yer alır',
        'Harita kaydının Bodrum Hayat MEYHANESI olarak görünmesi ilk kez gelen ziyaretçilerde kafa karışıklığı yaratabiliyor',
      ],
      unc: ['Sezon dışı dönemlerde çalışma saatleri telefonla teyit edilmelidir'],
    }),
    compactSeed({
      id: 'ekmek-iskelesi-beequpa-kucukbuk',
      placeId: 'ChIJH5RTUJdxvhQRUfgQz4G-UUo',
      cat: 'kahvalti',
      brand: 'ekmek iskelesi',
      area: 'Fevzi Çakmak Cd. (Küçükbük), Gündoğan',
      signals: ['artizan_eksi_maya_firini', 'kucukbuk_sabah_duragi', 'kahve_ve_unlu_mamul'],
      verifiedAt: '2026-11-16',
      desc: "Küçükbük Mahallesi Fevzi Çakmak Caddesi'nde yer alan; uzun fermantasyonlu ekşi mayalı artizan ekmekleri, kruvasanları, taze poğaça-simit çeşitleri ve yanındaki kahve tezgahıyla Küçükbük sabahlarının öne çıkan fırın durağı.",
      order: ['Ekşi Mayalı Artizan Ekmekler', 'Taze Kruvasan & Poğaça Çeşitleri', 'Simit & Kahvaltılık Fırın Ürünleri'],
      menu: [
        'Ekşi Mayalı Artizan Ekmek Çeşitleri',
        'Taze Kruvasan',
        'Günlük Poğaça & Simit',
        'Kahvaltı Tabağı Alternatifleri',
        'Nitelikli Kahve Çeşitleri',
      ],
      sec: [
        [
          'Kahvaltı Tabağı & Fırın Yanı Kahve Eşleşmesi',
          'Fırından yeni çıkan ekmek ve hamur işlerini yerinde sıcak bir kahveyle tamamlamak isteyenler için pratik sabah düzeni sunar.',
          'Sofra dergisi ve Yandex Harita kayıtları',
        ],
        [
          'Günlük Unlu Mamuller',
          'Evde veya teknede kahvaltı sofrası kurmak üzere paket olarak da sıkça tercih edilir.',
          'Turnkey Bodrum ve Restaurant Guru kayıtları',
        ],
      ],
      seat: 'Küçükbük Fevzi Çakmak Caddesi üzerinde küçük fırın önü tezgah ve sınırlı sabah oturma düzeni',
      crowd: 'Sabah saatlerinde taze ekmek ve kruvasan almaya uğrayan Küçükbük sakinleri ve tekne-ev misafirleriyle canlı',
      dis: 'Büyük bahçeli uzun serpme kahvaltı mekanı değil, ağırlıklı artizan fırın ve hızlı sabah molası noktasıdır; popüler ekmekler erken tükenebilir',
      transit: 'Küçükbük Mahallesi Fevzi Çakmak Caddesi No:9 (Macrocenter Küçükbük yakınında) üzerinde',
      sources: [
        [
          'Sofra Dergisi — Bodrum Artizan Fırınları',
          'https://www.sofra.com.tr/',
          'editorial',
          'Küçükbük adresinde ekşi mayalı artizan ekmekler ve kahve eşleşmesi vurgusu',
        ],
        [
          'Turnkey Bodrum — Küçükbük Yerel Rehberi',
          'https://turnkeybodrum.com/',
          'editorial',
          'Küçükbük Macrocenter yakınındaki konumu ve taze fırın ürünleri tanıtımı',
        ],
        [
          'Restaurant Guru — Ekmek İskelesi & Beequpa Kahve',
          'https://restaurantguru.com/',
          'community',
          'Küçükbük Fevzi Çakmak Cd. fırın ve kahve mekanı profili',
        ],
        [
          'Yandex Harita — Ekmek İskelesi & Beequpa Kahve',
          'https://yandex.com.tr/harita',
          'community',
          'Unlu mamuller, artizan ekmekler ve kahve tezgahı konum doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=5355270896654284881',
          'maps',
          'Küçükbük Fevzi Çakmak Cd. No:9 konum ve bakery doğrulaması',
        ],
      ],
      pros: [
        'Küçükbük bölgesinde endüstriyel fırınlar yerine ekşi mayalı artizan ekmek ve taze unlu mamul sunması',
        'Macrocenter çevresindeki merkezi noktada hem al-götür hem hızlı sabah kahvesi pratikliği',
      ],
      cons: [
        'Uzun saatler oturulan geniş serpme kahvaltı bahçesi konseptinde değildir',
        'Deniz kıyısı yerine Küçükbük iç caddesi üzerinde konumlanır',
      ],
      unc: ['Sezon içi ve sezon dışı günlük ekmek çıkış saatleri değişiklik gösterebiliyor'],
    }),
    compactSeed({
      id: 'deniz-beach-restorant-kizilburun',
      placeId: 'ChIJP9litNtxvhQRnrVIRowNpk8',
      cat: 'kahvalti',
      brand: 'deniz',
      area: 'Hacıoğlu Sk. (Kızılburun), Gündoğan',
      signals: ['kizilburun_kumlu_sahil', 'sig_cocuk_dostu_deniz', 'aile_isletmesi_plaj'],
      verifiedAt: '2026-11-16',
      desc: "Kızılburun Hacıoğlu Sokak'ta denize sıfır kumlu sahiliyle hizmet veren, Deniz Cafe Beach adıyla da bilinen samimi aile işletmesi. Sığ ve sakin denize karşı kahvaltı tabakları, menemen-omlet seçenekleri ve gün boyu ev yapımı sahil yemekleri sunar.",
      order: ['Sahil Serpme Kahvaltı', 'Menemen & Omlet Çeşitleri', 'Ev Yapımı Günlük Sahil Yemekleri'],
      menu: [
        'Serpme Kahvaltı & Kahvaltı Tabağı',
        'Menemen & Sahanda Yumurta',
        'Yöresel Peynir, Zeytin & Ev Reçelleri',
        'Tost, Sandviç & Burger Çeşitleri',
        'Ev Yapımı Zeytinyağlılar',
        'Günlük Balık & Izgara Çeşitleri',
      ],
      sec: [
        [
          'Ev Yapımı Zeytinyağlılar & Günlük Tencere Yemekleri',
          'Kahvaltı sonrası sahilde kalan misafirler için öğle ve akşam saatlerinde aile mutfağından çıkan ev yemekleridir.',
          'Yandex Harita ve Önerimekan değerlendirmeleri',
        ],
        [
          'Tost, Hamburger & Plaj Atıştırmalıkları',
          'Deniz molasında pratik öğün arayan aileler ve çocuklar için gün boyu servis edilir.',
          'Yandex Harita ziyaretçi kayıtları',
        ],
      ],
      seat: 'Kızılburun kıyısında kumlu plaj şezlongları ve gölgelik denize sıfır sahil masaları',
      crowd: 'Sığ ve sakin denizi nedeniyle özellikle çocuklu aileler ve kalabalıktan uzak duran tatilcilerle huzurlu',
      dis: 'Lüks beach club standartlarında tasarım veya üçüncü nesil kahve kavuruculuğu sunmaz; sezon içi şezlong ve harcama düzeni dönemsel değişebilir',
      transit: 'Gündoğan Kızılburun Mevkii Hacıoğlu Sokak No:10 üzerinde kıyı hattında',
      sources: [
        [
          'Önerimekan — Deniz Cafe Beach Gündoğan',
          'https://www.onerimekan.com/',
          'community',
          'Kızılburun Hacıoğlu Sokak No:10 konumu ve sahil kafe-restoran profili',
        ],
        [
          'Yandex Harita — Deniz Cafe Beach Kızılburun',
          'https://yandex.com.tr/harita',
          'community',
          'Denize sıfır kumlu sahil, sığ deniz, çocuklu ailelere uygunluk ve ev yapımı yemek notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=5739289671256028574',
          'maps',
          'Gündoğan Kızılburun Hacıoğlu Sk. No:10 konum doğrulaması',
        ],
      ],
      pros: [
        'Kızılburun koyunda gösterişten uzak, sığ ve kumlu sahiliyle çocuklu ailelere uygun sakin aile işletmesi',
        'Sabah kahvaltısından öğle ev yemeklerine uzanan ulaşılabilir orta bütçe seviyesi',
      ],
      cons: [
        'Nitelikli kahve uzmanı bir kafe değildir; klasik plaj kafe-restoranı düzeniyle çalışır',
        'Yaz sezonuna odaklanan bir sahil noktası olduğundan kış aylarında kapalı kalabilir',
      ],
      unc: ['Sezon içi şezlong giriş veya harcama koşulları işletme tarafından güncellenebiliyor'],
    }),

    // ==================== 6. MUTLAKA DENEMELİSİN ====================
    compactSeed({
      id: 'guno-ocakbasi-steakhouse-gundogan',
      placeId: 'ChIJsbd2WOJxvhQRnT8MinbAywY',
      cat: 'denemelisin',
      brand: 'güno',
      area: 'Sahil Şeridi, Gündoğan',
      signals: ['sahilde_ocakbasi_steakhouse', 'ozgun_deniz_mahsullu_mezeler', 'canli_muzik_aksamlari'],
      verifiedAt: '2026-11-16',
      desc: "Gündoğan Sahil Şeridi'nde deniz manzarasına karşı geleneksel ocakbaşı kebaplarını ve dinlendirilmiş steakhouse kesimlerini bir araya getiren; parmesanli denizci kalamarı ve enginarlı ahtapot gibi özgün mezeleriyle balık restoranlarına güçlü bir et alternatifi sunan adres.",
      order: ['Adana & Fıstıklı Kebap', 'Bonfile Lokum & Dana Şaşlık', 'Parmesanlı Denizci Kalamarı'],
      menu: [
        'Adana & Fıstıklı Kebap',
        'Patlıcanlı Kebap & Sarma Beyti',
        'Kuzu Çöp Şiş & Küşleme',
        'Bonfile Lokum & Dana Antrikot',
        'Dana Şaşlık',
        'Parmesanlı Denizci Kalamarı',
        'Enginarlı Ahtapot Izgara',
      ],
      sec: [
        [
          'Enginarlı Ahtapot Izgara & Yöresel Mezeler',
          'Ocakbaşı öncesi sahil sofrasını Ege dokunuşlu soğuk ve sıcak başlangıçlarla açmak isteyenlerin seçtiği tabaklardır.',
          'Yandex Harita ve Restoranım.net kayıtları',
        ],
        [
          'Kuzu Küşleme & Sarma Beyti',
          'Klasik Adana kebap dışında mangal lezzetlerini denemek isteyen gruplar için öne çıkan et kalemleridir.',
          'Yemeksepeti menü listesi',
        ],
      ],
      seat: 'Gündoğan sahil şeridinde deniz cepheli açık masalar ve kapalı salon düzeni',
      crowd: 'Akşam yemeklerinde aileler ve gruplarla canlı; belirli gecelerde canlı müzik eşliğinde hareketli tempo',
      dis: 'Canlı müzik olan akşamlarda ses seviyesi klasik sessiz lokantalara göre yükselebilir',
      transit: 'Gündoğan Sahil Şeridi Küme Evleri No:24/1 üzerinde merkezi sahil yürüyüş yolunda',
      sources: [
        [
          'Yemeksepeti — Güno Ocakbaşı Steakhouse',
          'https://www.yemeksepeti.com/',
          'community',
          'Adana, fıstıklı, patlıcanlı kebap, sarma beyti, kuzu küşleme, bonfile lokum ve şaşlık menü kayıtları',
        ],
        [
          'My Guide Bodrum — Güno Ocakbaşı Steakhouse',
          'https://www.myguidebodrum.com/',
          'community',
          'Sahil Şeridi No:24/1 adresi, açık-kapalı alan ve canlı müzik akşamları bilgisi',
        ],
        [
          'Restoranım.net & Yandex Harita — Güno Ocakbaşı',
          'https://www.restoranim.net/',
          'community',
          'Parmesanlı denizci kalamarı, enginarlı ahtapot ızgara ve deniz kenarı ocakbaşı değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=489696599854563229',
          'maps',
          'Gündoğan Sahil Şeridi Küme Evleri No:24/1 konum doğrulaması',
        ],
      ],
      pros: [
        'Balıkçıların yoğun olduğu Gündoğan sahilinde deniz manzarası eşliğinde nitelikli kebap ve steakhouse seçeneği sunması',
        'Et ana yemeklerinin yanında deniz mahsullü yaratıcı sıcak mezelerle zengin başlangıç kurgusu',
      ],
      cons: [
        'Canlı müzik akşamlarında daha yüksek tempolu ve kalabalık olabiliyor',
        'Sahil hattındaki popüler akşamlarda önceden masa ayırtmak gerekebiliyor',
      ],
      unc: ['Canlı müzik programının günleri mevsime göre değişiklik gösterebiliyor'],
    }),
    compactSeed({
      id: 'yali-cafe-restoran-gundogan',
      placeId: 'ChIJLcDIITtwvhQRbtcQQ-SyiPg',
      cat: 'denemelisin',
      brand: 'yalı',
      area: 'Atatürk Cd., Gündoğan',
      signals: ['yirmi_yillik_aile_isletmesi', 'gambilli_fava_ev_mezeleri', 'mangal_izgara_ve_balik'],
      verifiedAt: '2026-11-16',
      desc: "Gündoğan sahilindeki Atatürk Caddesi üzerinde yaklaşık yirmi yıldır Özhan ve Yurdanur çifti tarafından yaşatılan samimi aile lokantası. Izgarada balık, et ve köfteyi ev mutfağından çıkan gambilli fava, dolmalar ve Ege otlarıyla buluşturur.",
      order: ['Gambilli Fava & Zeytinyağlı Dolmalar', 'Izgara Köfte & Et Çeşitleri', 'Günlük Izgara Balık'],
      menu: [
        'Gambilli Fava',
        'Zeytinyağlı Dolmalar & Ege Otları',
        'Izgara Balık Çeşitleri',
        'Izgara Et & Köfte',
        'Sahil Atıştırmalıkları',
      ],
      sec: [
        [
          'Ege Otları & Ev Yapımı Zeytinyağlılar',
          'Mutfakta günlük olarak hazırlanan mevsimlik yöresel otlar ve soğuk mezeler sofranın temelini oluşturur.',
          'Snob Magazin aile işletmesi röportajı',
        ],
        [
          'Sıcak Izgara Köfte & Et Tabakları',
          'Balık tercih etmeyen misafirler için Özhan Usta tarafından ızgarada hazırlanan doyurucu alternatiflerdir.',
          'Snob Magazin ve My Guide Bodrum kayıtları',
        ],
      ],
      seat: 'Atatürk Caddesi sahil aksında samimi açık hava masaları ve grup yemeklerine uygun oturma düzeni',
      crowd: 'Yıllardır müdavimi olan Gündoğan sakinleri, aileler ve akşam gruplarıyla telaşsız sahil temposunda',
      dis: 'Gösterişli bir sahil kulübü veya modern bar tasarımı yerine klasik ve mütevazı bir esnaf-aile işletmesi dokusundadır',
      transit: 'Gündoğan Mahallesi Atatürk Caddesi No:8 üzerinde sahil şeridi yürüyüş yolunda',
      sources: [
        [
          'Snob Magazin — Yalı Restaurant Gündoğan',
          'https://www.snobmagazin.com/',
          'editorial',
          'Özhan ve Yurdanur çiftinin yaklaşık 20 yıllık aile işletmesi, gambilli fava, dolmalar ve ızgara çeşitleri haberi',
        ],
        [
          'Restaurant Guru — Yalı Cafe Restoran Gündoğan',
          'https://restaurantguru.com/',
          'community',
          'Gündoğan Atatürk Cd. bölgesi yüksek puanlı sahil restoranı ve kullanıcı geri bildirimleri',
        ],
        [
          'My Guide Bodrum & Sluurpy — Yalı Cafe Restoran',
          'https://www.myguidebodrum.com/',
          'community',
          'Atatürk Cad. No:8 adresi, açık oturma alanı, orta fiyat seviyesi ve paket-masa servis bilgisi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=17908760611686242158',
          'maps',
          'Gündoğan Atatürk Cd. No:8 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Gündoğan sahilinde uzun yıllardır aynı aile tarafından sürdürülen dürüst fiyatlı ev yemekleri ve ızgara çizgisi',
        'Bodrum yöresine özgü gambilli fava ve el emeği zeytinyağlıları orta bütçede sunması',
      ],
      cons: [
        'Süslemeli lüks dekorasyon arayanlar için fazla sade gelebilir',
        'Bodrumdaki başka Yalı isimli mekanlarla karıştırılmaması için Atatürk Cd. No:8 konumu dikkate alınmalıdır',
      ],
      unc: ['Günlük çıkan zeytinyağlı ve balık çeşitleri mevsimlik tedarike göre değişebiliyor'],
    }),
    compactSeed({
      id: 'gokyuzu-restaurant-ev-yemekleri-farilya',
      placeId: 'ChIJf7nRxbtxvhQRMt48iOmNwuo',
      cat: 'denemelisin',
      brand: 'gökyüzü',
      area: 'Emek Sk. (Farilya), Gündoğan',
      signals: ['gunluk_tabldot_ev_yemegi', 'farilya_ic_sokak', 'paket_ve_gruplara_uygun'],
      verifiedAt: '2026-11-16',
      desc: "Farilya Emek Sokak'ta günlük tencere yemekleri, tabldot menüler, çorba ve ızgara çeşitleriyle mahalle sakinlerine ulaşılabilir fiyatlı ev yemeği sunan sade lokanta.",
      order: ['Günlük Tencere & Tabldot Yemekleri', 'Izgara Köfte Tabakları', 'Günün Mercimek Çorbası'],
      menu: [
        'Günlük Tencere & Tabldot Menüleri',
        'Mercimek Çorbası',
        'Izgara Köfte',
        'Izgara Tavuk Kanat',
        'Ekmek Arası Kavurma & Köfte',
        'Aydın Tostu & Klasik Kahvaltı Tabağı',
        'Sigara Böreği',
      ],
      sec: [
        [
          'Ekmek Arası Kavurma & Aydın Tostu',
          'Hızlı öğle molası veya pratik atıştırmalık arayanlar için mutfaktan çıkan popüler seçeneklerdir.',
          'Yemeksepeti menü listesi',
        ],
        [
          'Sigara Böreği & Kızartma Tabakları',
          'Tabldot ve ızgara yanına ek olarak ya da sabah kahvaltı tabaklarıyla birlikte tercih edilir.',
          'Yemeksepeti ve Wanderlog kayıtları',
        ],
      ],
      seat: 'Farilya Emek Sokak üzerinde sade iç ve dış masa düzeni ile paket servis imkanı',
      crowd: 'Öğle saatlerinde bölge çalışanları ve ev yemeği arayan yerel sakinlerle pratik ve hızlı tempo',
      dis: 'Sahil manzaralı bir akşam restoranı değil, mütevazı bir esnaf ve tabldot lokantasıdır; değerlendirme sayısı henüz küçük ölçeklidir',
      transit: 'Farilya Mahallesi Emek Sokak No:2/C üzerinde Gündoğan sahilinin bir arka sokak aksında',
      sources: [
        [
          'Yemeksepeti — Gökyüzü Restaurant Ev Yemekleri',
          'https://www.yemeksepeti.com/',
          'community',
          'Mercimek çorbası, ızgara köfte, ekmek arası kavurma, Aydın tostu ve kahvaltı tabağı menü doğrulaması',
        ],
        [
          'Wanderlog — Gökyüzü Restaurant Ev Yemekleri Tabldot',
          'https://wanderlog.com/',
          'community',
          'Ev yapımı lezzetler, kızartma tabakları ve ilgili servis üzerine gezgin notları',
        ],
        [
          'My Guide Bodrum — Gökyüzü Restaurant',
          'https://www.myguidebodrum.com/',
          'community',
          'Farilya Emek Sokak No:2/C adresi, dine-in ve paket servis profil doğrulaması',
        ],
        [
          'Yandex Harita — Gökyüzü Ev Yemekleri',
          'https://yandex.com.tr/harita',
          'community',
          'Emek Sokak No:2/C konumu ve geleneksel Türk ev yemekleri kayıtları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=16916239184509591090',
          'maps',
          'Farilya Emek Sk. konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Gündoğan merkezinde sahil fiyatlarına alternatif dürüst tabldot ve günlük tencere yemeği sunması',
        'Sabah kahvaltısı ve ekmek arası pratik seçeneklerden akşamüstü ev yemeklerine uzanan kullanışlı menü',
      ],
      cons: [
        'Arka sokak esnaf lokantası olduğu için manzara ve ambiyans beklentisine hitap etmez',
        'Günlük tabldot çeşitleri öğleden sonra geç saatlerde tükenebilir',
      ],
      unc: ['Sezon dışı dönemlerde günlük tencere çeşidi sayısı değişkenlik gösterebiliyor'],
    }),
    compactSeed({
      id: 'yildirim-ev-yemekleri-gundogan',
      placeId: 'ChIJM8NaKwBxvhQR4bT9hXFSV5g',
      cat: 'denemelisin',
      brand: 'yıldırım',
      name: 'Yıldırım Ev Yemekleri',
      area: 'Atatürk Cd. (Yukarı), Gündoğan',
      signals: ['yaz_kis_acik_esnaf_lokantasi', 'gunluk_sulu_ev_yemekleri', 'yukari_gundogan'],
      verifiedAt: '2026-11-16',
      desc: "Yukarı Gündoğan'da Atatürk Caddesi üzerinde yaz kış hizmet veren; günlük taze sulu tencere yemekleri, zeytinyağlılar, köfte ve dürüm seçenekleriyle özellikle yerel halkın ev yemeği durağı olarak bildiği esnaf lokantası.",
      order: ['Günlük Sulu Tencere Yemekleri', 'Zeytinyağlı Ev Yemekleri', 'Izgara Köfte'],
      menu: [
        'Günlük Sulu Ev Yemekleri',
        'Zeytinyağlı Çeşitleri',
        'Izgara Köfte',
        'Hatay Usulü Dürüm',
        'Sucuk Ekmek & Pratik Izgaralar',
      ],
      sec: [
        [
          'Hatay Usulü Dürüm & Sucuk Ekmek',
          'Tencere yemekleri dışında akşam veya gece geç saatlerde hızlı öğün arayanların seçtiği seçeneklerdir.',
          'Menu-TR menü ve müşteri değerlendirmeleri',
        ],
        [
          'Zeytinyağlı Günlük Tabaklar',
          'Sulu et yemeklerinin yanında hafif ve ev yapımı eşlikçi olarak tezgaha çıkar.',
          'Restoranim.net ve Menu-TR kayıtları',
        ],
      ],
      seat: 'Yukarı Gündoğan ana cadde üzerinde sade lokanta masaları ve hızlı servis bankosu',
      crowd: 'Yılın dört mevsimi Gündoğan esnafı, mahalle sakinleri ve pratik ev yemeği arayanlarla düzenli',
      dis: 'Deniz kıyısından yukarıda ana yol aksında yer aldığından manzara sunmaz ve ambiyans yerine hızlı ev yemeği odaklıdır',
      transit: 'Yukarı Gündoğan Atatürk Caddesi üzerinde dolmuş güzergahı boyunca',
      sources: [
        [
          'Menu-TR — Yıldırım Ev Yemekleri Gündoğan',
          'https://menu-tr.com/',
          'community',
          'Yukarı Atatürk Cd. konumu, günlük sulu tencere yemekleri, köfte, Hatay dürüm ve geniş servis saatleri',
        ],
        [
          'Restoranım.net — Yıldırım Ev Yemekleri',
          'https://www.restoranim.net/',
          'community',
          'Yaz-kış açık ev yemekleri servisi ve yüksek misafir memnuniyeti kayıtları',
        ],
        [
          'Yemeksepeti — Yıldırım Ev Yemekleri Bölge Listesi',
          'https://www.yemeksepeti.com/',
          'community',
          'Gündoğan mahallesi ev yemekleri ve paket sipariş erişim kaydı',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=10977333264271652065',
          'maps',
          'Yukarı Gündoğan Atatürk Cd. konum doğrulaması',
        ],
      ],
      pros: [
        'Turizm sezonu kapandığında dahi yaz-kış açık kalan güvenilir yerel ev yemekleri noktası',
        'Kıymanın tazeliği, hızlı servisi ve ulaşılabilir orta fiyat seviyesiyle yerel halkın tercihi olması',
      ],
      cons: [
        'Kıyı şeridinden içeride konumlandığı için deniz atmosferi arayanlara hitap etmez',
        'Sınırlı değerlendirme hacmine sahip mütevazı bir yol üstü lokantasıdır',
      ],
      unc: ['Günlük çıkan sulu yemek listesi tezgah üretimine göre her gün değişmektedir'],
    }),
    compactSeed({
      id: 'pamukkale-otel-restaurant-gundogan',
      placeId: 'ChIJQ49rWTpwvhQRLYeBhWL2_3U',
      cat: 'denemelisin',
      brand: 'pamukkale',
      name: 'Pamukkale Otel & Restaurant',
      area: 'Atatürk Cd., Gündoğan',
      signals: ['tas_firin_pide_lahmacun', 'kiremitte_balik_ve_guvec', 'merkezi_aile_isletmesi'],
      verifiedAt: '2026-11-16',
      desc: "Gündoğan merkezinde sahile kısa yürüyüş mesafesindeki Atatürk Caddesi No:143 adresinde uzun yıllardır hizmet veren aile işletmesi. Otel konaklaması dışında halka açık restoranında taş fırından pide-lahmacun çeşitleri, güveçler, kebaplar ve kiremitte balık sunar.",
      order: ['Kuşbaşılı Kaşarlı Pide & Lahmacun', 'Kiremitte Balık & Güveç', 'Adana & Kuzu Şiş'],
      menu: [
        'Kıymalı & Kuşbaşılı Pide Çeşitleri',
        'Otlu Pide & Lahmacun',
        'Margarita & Karışık Pizza',
        'Kiremitte Balık & Tereyağlı Karides',
        'Adana, Beyti & Kuzu Şiş',
        'Köpoğlu, Haydari & Paçanga Böreği',
        'Sıcak Künefe',
      ],
      sec: [
        [
          'Otlu Pide & Fırın Lahmacun',
          'Klasik etli pidelerin yanında Ege otlu pide ve çıtır lahmacun çeşitleri sıkça tercih edilir.',
          'pamukkaleotelrestaurant.com resmi menü kayıtları',
        ],
        [
          'Paçanga Böreği, Köpoğlu & Sıcak Künefe',
          'Yemek başında yöresel mezelerle açılış, sonunda ise sıcak künefe ile kapanış yapmak isteyenler için menüde yer alır.',
          'Resmi menü listesi ve Yandex Harita değerlendirmeleri',
        ],
      ],
      seat: 'Atatürk Caddesi üzerinde merkezi aile restoranı bahçe ve salon masaları',
      crowd: 'Gündoğan merkezinde pide, kebap veya ulaşılabilir akşam yemeği arayan aileler ve yerlilerle sakin',
      dis: 'Doğrudan deniz kıyısında değildir; otel konseptinde dışarıdan açık serpme kahvaltı yerine ağırlıklı oda-kahvaltı ve öğle-akşam restoran servisi sunar',
      transit: 'Gündoğan Atatürk Caddesi No:143 üzerinde dolmuş durakları ve sahile kısa yürüyüş mesafesinde',
      sources: [
        [
          'Pamukkale Otel & Restaurant Resmi Sitesi',
          'https://pamukkaleotelrestaurant.com/',
          'operator',
          'Atatürk Cd. No:143 adresi, pide-lahmacun, pizza, kebap, kiremitte balık ve künefe tam menüsü',
        ],
        [
          'My Guide Bodrum — Pamukkale Otel Restaurant',
          'https://www.myguidebodrum.com/',
          'community',
          'Merkezi konum, huzurlu aile işletmesi atmosferi ve restoran hizmeti profili',
        ],
        [
          'Restaurant Guru & Yandex Harita — Pamukkale Otel Restaurant',
          'https://restaurantguru.com/',
          'community',
          'Ev yemekleri, pide çeşitleri, güler yüzlü servis ve merkezi ulaşım değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=8502785524505872173',
          'maps',
          'Gündoğan Atatürk Cd. No:143 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Gündoğan merkezinde pide-lahmacundan kiremitte balık ve kebaba uzanan geniş ve dürüst fiyatlı menü',
        'Ulaşım duraklarına ve sahile yürüme mesafesinde köklü bir aile işletmesi olması',
      ],
      cons: [
        'Otel restoranı yapısı gereği kahvaltı servisi ağırlıklı konaklayan misafirlere odaklıdır',
        'Sahil şeridi masaları yerine cadde üzerinde yer alır',
      ],
      unc: ['Sezon içi ve sezon dışı restoran menüsü kapsamı otel doluluğuna göre değişebiliyor'],
    }),

    // ==================== 7. BALIKÇILAR ====================
    compactSeed({
      id: 'akbalik-restaurant-gundogan',
      placeId: 'ChIJnYnS_zpwvhQRiPeIg-OLxe4',
      cat: 'balik',
      secondaryCategoryIds: ['date'],
      brand: 'akbalık',
      area: 'Sahil Şeridi, Gündoğan',
      signals: ['sef_ali_akbalik', 'ozgun_ege_mezeleri', 'gun_batimi_denize_sifir'],
      verifiedAt: '2026-11-16',
      desc: "Şef Ali Akbalık yönetiminde Gündoğan sahilinde uzun yıllardır hizmet veren kıyı balıkçısı. Klasik rakı-balık çizgisini karamelize lahana, ısırgan otlu mücver, dil peynirli kalamar ve kadayıfa sarılı deniz mahsulleri gibi özgün meze ve ara sıcaklarla zenginleştirir.",
      order: ['Isırgan Otlu Mücver & Karamelize Lahana', 'Kadayıfa Sarılı Deniz Mahsulleri', 'Günlük Taze Balık'],
      menu: [
        'Karamelize Lahana & 7 Peynirli Meze',
        'Isırgan Otlu Mücver',
        'Dil Peynirli Kalamar Izgara',
        'Kadayıfa & Yufkaya Sarılı Deniz Mahsulleri',
        'Günlük Taze Levrek, Çipura & Lagos',
      ],
      sec: [
        [
          'Dil Peynirli Kalamar Izgara',
          'Klasik kalamar tavaya alternatif olarak şef mutfağının öne çıkan sıcak ara lezzetlerinden biridir.',
          'Ege Alternatif ve Meyhankoli incelemeleri',
        ],
        [
          '7 Peynirli Meze & Yöresel Ege Otları',
          'Balık öncesi masayı kuran özgün ve paylaşımı kolay soğuk meze seçenekleridir.',
          'Mes Prestiges ve yerel gastronomi incelemeleri',
        ],
      ],
      seat: 'Gündoğan Sahil Şeridi üzerinde denize sıfır gün batımı masaları ve iskele yanı düzeni',
      crowd: 'Yüksek sezonda yerli müdavimler ve şef mezeleri için gelen akşam yemeği misafirleriyle dolu',
      dis: 'Yüksek fiyat segmentinde yer alır; popüler gün batımı saatlerinde önceden rezervasyon yapılmadan masa bulmak güçleşebiliyor',
      transit: 'Gündoğan Sahil Şeridi Küme Evler No:14/A (Atatürk Cd. sahil hattı) üzerinde',
      sources: [
        [
          'Ege Alternatif — Akbalık Restaurant Gündoğan',
          'https://www.egealternatif.com/',
          'editorial',
          'Şef Ali Akbalık mutfak yönetimi ve yenilikçi Ege mezeleri incelemesi',
        ],
        [
          'Mes Prestiges — Akbalık Restaurant',
          'https://www.mesprestiges.com/',
          'editorial',
          'Gündoğan sahil şeridinde uzun yıllardır çizgisini koruyan kıyı balıkçısı ve rezervasyon notu',
        ],
        [
          'Meyhankoli — Akbalık Restaurant Gündoğan',
          'https://meyhankoli.com/',
          'community',
          'Karamelize lahana, ısırgan otlu mücver, dil peynirli kalamar ve kadayıfa sarılı deniz mahsulleri kayıtları',
        ],
        [
          'Yandex Harita — Akbalık Restaurant',
          'https://yandex.com.tr/harita',
          'community',
          'Denize sıfır gün batımı manzarası ve taze balık değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=17205311760719476616',
          'maps',
          'Gündoğan Sahil Şeridi Küme Evler No:14/A konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Klasik balık restoranı mezelerinin ötesine geçen şef dokunuşlu ara sıcaklar ve özgün ot mezeleri',
        'Gündoğan koyunun sakin kıyı dokusunda denize sıfır gün batımı atmosferi',
      ],
      cons: [
        'Yüksek bütçe seviyesinde konumlanır; gramajlı taze balık siparişinde fiyat teyidi önerilir',
        'Akşam yoğunluğunda rezervasyonsuz yer bulmak zorlaşabilir',
      ],
      unc: ['Mevsimsel av durumuna göre tezgah balığı çeşitleri günlük değişmektedir'],
    }),
    compactSeed({
      id: 'paragadi-bodrum-balik-gundogan',
      placeId: 'ChIJYXzSrDtwvhQRDH7be4vzfNU',
      cat: 'balik',
      secondaryCategoryIds: ['date'],
      brand: 'paragadi',
      area: 'Sahil Şeridi, Gündoğan',
      signals: ['modern_balik_mutfagi', 'ahtapot_carpaccio_levrek_sarma', 'denize_sifir_sahil'],
      verifiedAt: '2026-11-16',
      desc: "Gündoğan Sahil Şeridi'nde denize sıfır konumuyla hizmet veren, klasik meyhane ve balık kültürünü soya soslu cibes salatası, ahtapot carpaccio, sübye güveç ve levrek pazı sarması gibi yenilikçi deniz mahsulü tabaklarıyla buluşturan restoran.",
      order: ['Ahtapot Carpaccio & Soya Soslu Cibes', 'Levrek Pazı Sarması & Sübye Güveç', 'Günlük Taze Balık'],
      menu: [
        'Soya Soslu Cibes Salatası & Deniz Börülcesi',
        'Torik Lakerda',
        'Ahtapot Carpaccio & Ahtapot Izgara',
        'Levrek Pazı Sarması',
        'Sübye Güveç & Pilaki',
        'Balık Köftesi & Zencefilli Karides',
        'Günlük Lagos, Mercan, Barbunya & Levrek',
      ],
      sec: [
        [
          'Balık Köftesi & Zencefilli Karides',
          'Yaratıcı deniz ürünü ara sıcaklarıyla klasik kalamar-karides çizgisine farklı dokunuş ekler.',
          'Bodrumlu.com incelemesi',
        ],
        [
          'Torik Lakerda & Soya Soslu Kalamar',
          'Rakı-balık sofralarında soğuk meze ve ara sıcak çeşitliliğini tamamlayan imza tabaklardır.',
          'Bodrumlu.com ve Yandex Harita kayıtları',
        ],
      ],
      seat: 'Gündoğan sahil şeridinde şık dekorasyonlu denize sıfır kıyı masaları',
      crowd: 'Kaliteli meze sunumu ve sakin deniz manzarası arayan çiftler ve akşam gruplarıyla nezih tempo',
      dis: 'Üst-orta fiyat segmentinde yer alır; yaz akşamlarında sahil önü masalar için önceden rezervasyon gerekir',
      transit: 'Gündoğan Sahil Şeridi Küme Evleri No:15 üzerinde kıyı yürüyüş hattında',
      sources: [
        [
          'Bodrumlu — Paragadi Balık Gündoğan',
          'https://www.bodrumlu.com/',
          'editorial',
          'Soya soslu cibes, levrek pazı sarması, balık köftesi, zencefilli karides ve günlük balık seçkisi incelemesi',
        ],
        [
          'Bodrum Mekanları — Paragadi Balık Restaurant',
          'https://www.bodrummekanlari.com/',
          'editorial',
          'Gündoğan sahil şeridi modern balıkçı profili ve rakı-balık atmosferi tanıtımı',
        ],
        [
          'Eatbu & Yandex Harita — Paragadi Bodrum',
          'https://eatbu.com/',
          'community',
          'Ahtapot carpaccio, sübye güveç, meze tepsisi sunumu ve konum doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=15383438207594757644',
          'maps',
          'Gündoğan Sahil Şeridi Küme Evleri No:15 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Alışılmış meze tepsisinin yanında sübye güveç, levrek pazı sarması ve ahtapot carpaccio gibi özel reçeteler sunması',
        'Modern ama gürültüsüz sahil atmosferiyle akşam yemeğine uygun düzeni',
      ],
      cons: [
        'Üst-orta bütçe seviyesindedir',
        'Deniz kenarındaki ilk sıra masalar hızlı dolduğu için rezervasyonsuz gelindiğinde yer bulunamayabilir',
      ],
      unc: ['Sezon içi balık ve deniz ürünü tezgahı günlük av durumuna göre güncellenir'],
    }),
    compactSeed({
      id: 'kaana-restoran-gundogan',
      placeId: 'ChIJfUsVHTtwvhQR_9Up6czxrmM',
      cat: 'balik',
      secondaryCategoryIds: ['date'],
      brand: 'kaana',
      area: 'Farilya Cd., Gündoğan',
      signals: ['iskelenin_karsisinda_aile_balıkcisi', 'ust_kat_deniz_terasi', 'ev_yapimi_ege_mezeleri'],
      verifiedAt: '2026-11-16',
      desc: "Gündoğan Farilya Caddesi'nde iskelenin hemen karşısında İlkay ve Bilal Yoldemir çiftinin işlettiği samimi aile balıkçısı. Fava, borani, kabak çiçeği dolması, Girit kabağı ve etli yaprak sarma gibi ev yapımı mezelerinin yanında narenciyeli levrek ve günlük balıklar sunar.",
      order: ['Narenciyeli Levrek', 'Kabak Çiçeği Dolması & Girit Kabağı', 'Kalamar Tava & Ahtapot Kavurma'],
      menu: [
        'Narenciyeli Levrek',
        'Günlük Taze Levrek & Çipura',
        'Fava, Borani & Tarator',
        'Kabak Çiçeği Dolması & Etli Yaprak Sarma',
        'Enginar Kalbi & Girit Kabağı',
        'Kalamar Tava & Ahtapot Kavurma',
      ],
      sec: [
        [
          'Enginar Kalbi, Borani & Etli Yaprak Sarma',
          'Ev mutfağı titizliğinde hazırlanan yöresel soğuk başlangıçları denemek isteyenlerin vazgeçilmezlerindendir.',
          'Meyhanedeyiz.biz ve Yandex Harita kayıtları',
        ],
        [
          'Mantarlı & Biberli Ahtapot Kavurma',
          'Klasik ızgara ahtapota alternatif olarak sıcak ara öğün tercih edenlere sunulur.',
          'Wanderboat.ai inceleme özetleri',
        ],
      ],
      seat: 'Sahil kıyısı dış mekan masaları ve deniz manzaralı üst kat terası',
      crowd: 'Samimi aile işletmesi sıcaklığı arayan çiftler ve düzenli Gündoğan müdavimleriyle huzurlu',
      dis: 'Büyük gruplarda önceden rezervasyon gerekir; bazı akşamlar popüler sıcak mezeler erken saatlerde tükenebilir',
      transit: 'Gündoğan Mahallesi Farilya Caddesi No:14 (iskele karşısı) üzerinde sahil yürüyüş aksında',
      sources: [
        [
          'Meyhanedeyiz — Kaana Restoran Gündoğan',
          'https://www.meyhanedeyiz.biz/',
          'community',
          'İlkay ve Bilal Yoldemir aile işletmesi, üst kat terası ve ev yapımı Ege mezeleri profili',
        ],
        [
          'Kaana Restoran Resmi Sayfası',
          'https://kaanarestoran.eatbu.com/',
          'operator',
          'Farilya Caddesi No:14 adres ve kahvaltıdan akşam servisine uzanan işletme kaydı',
        ],
        [
          'Restaurant Guru & Wanderboat — Kaana Restoran',
          'https://restaurantguru.com/',
          'community',
          'Kalamar tava, ahtapot kavurma, fava, borani ve rezervasyon önerisi değerlendirmeleri',
        ],
        [
          'Yandex Harita — Kaana Restoran',
          'https://yandex.com.tr/harita',
          'community',
          'Narenciyeli levrek, kabak çiçeği dolması ve güler yüzlü aile hizmeti notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=7182944318089975295',
          'maps',
          'Gündoğan Farilya Cd. No:14 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Ev yapımı meze çeşitliliğini sıcak aile işletmesi atmosferi ve deniz manzaralı terasla birleştirmesi',
        'Narenciyeli levrek ve Girit kabağı gibi özgün Ege mutfağı dokunuşları',
      ],
      cons: [
        'Büyük sahil restoranlarına kıyasla masa kapasitesi daha butiktir, yaz akşamları rezervasyon ister',
        'Fiyat seviyesi güncel menü üzerinden teyit edilmelidir',
      ],
      unc: ['Sezon dışı aylarda açık kalma günleri aile işletmesi takvimine göre değişebiliyor'],
    }),
    compactSeed({
      id: 'hasiralti-restaurant-gundogan',
      placeId: 'ChIJQ_sInDlwvhQREJ0dMtBtwi4',
      cat: 'balik',
      brand: 'hasıraltı',
      name: 'Hasıraltı Restaurant',
      area: 'Emek Sk. Sahili, Gündoğan',
      signals: ['gundogan_hasir_beach', 'denize_sifir_balik_meze', 'rahat_sahil_sofrasi'],
      verifiedAt: '2026-11-16',
      desc: "Gündoğan koyunun sakin kıyı hattında Gündoğan Hasır Beach Restaurant adıyla da bilinen denize sıfır sahil restoranı. Günlük taze balıklar, Ege mezeleri ve kalamar-karides çeşitlerini gösterişsiz plaj atmosferinde sunar.",
      order: ['Günlük Taze Balık Çeşitleri', 'Ege Zeytinyağlı Mezeleri', 'Kalamar & Karides Seçenekleri'],
      menu: [
        'Günlük Izgara Balık',
        'Zeytinyağlı Ege Mezeleri',
        'Fava & Deniz Börülcesi',
        'Kalamar Tava & Karides',
        'Akdeniz Salataları & Izgaralar',
      ],
      sec: [
        [
          'Fava & Deniz Börülcesi',
          'Denize sıfır akşam sofralarında taze balık öncesinde paylaşılan klasik soğuk başlangıçlardır.',
          'Yandex Harita ve Mekanlar.com kayıtları',
        ],
        [
          'Akdeniz Izgaraları & Gündüz Plaj Servisi',
          'Gündüz sahil düzeninden akşam balık masasına geçen rahat konsepti destekler.',
          'Mekanlar.com işletme profili',
        ],
      ],
      seat: 'Gündoğan sahilinde açık hava kumsal ve iskele yanı yemek masaları',
      crowd: 'Gösterişten uzak, günlük ve rahat bir sahil balıkçısı atmosferi arayan çiftler ve ailelerle sakin',
      dis: 'Sezonluk sahil-plaj işletmesi yapısı nedeniyle dönemlere göre açık olma durumu ve isim tabelası (Hasır Beach / Hasıraltı) değişiklik gösterebiliyor; gitmeden teyit önerilir',
      transit: 'Gündoğan Aşağı Mahallesi Emek Sokak sahil hattı (Gadıoğlu komşuluğunda) üzerinde',
      sources: [
        [
          'Gezgin Rehber Profili — Gündoğan Hasır Beach Restaurant',
          'https://www.tripadvisor.com.tr/Restaurant_Review-g951444-d4476041-Reviews-Gundogan_HasIr_Beach_Restaurant-Gundogan_Bodrum_Mugla_Province_Turkish_Aegean_Coa.html',
          'community',
          'Gündoğan sahil şeridinde deniz ürünleri ve plaj restoranı geçmiş değerlendirme kaydı',
        ],
        [
          'Mekanlar.com — Hasıraltı Restaurant Gündoğan',
          'https://www.mekanlar.com/',
          'community',
          'Emek Sokak sahil konumu, Akdeniz mutfağı, deniz ürünleri ve açık hava oturma alanı kaydı',
        ],
        [
          'Yandex Harita — Gündoğan Hasır Beach / Hasıraltı',
          'https://yandex.com.tr/harita',
          'community',
          'Emek Sokak No:37 sahil konumu, mezeler ve balık servisi notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=3369376212187979024',
          'maps',
          'Gündoğan sahil hattı konum ve seafood_restaurant doğrulaması',
        ],
      ],
      pros: [
        'Merkez iskele kalabalığının bir miktar batısında, daha sakin Emek Sokak sahilinde denize sıfır balık keyfi',
        'Hem gündüz plaj hem akşam meze-balık konseptiyle esnek sahil kullanımı',
      ],
      cons: [
        'Resmi adres ve tabela kayıtlarında Hasır Beach ile Hasıraltı adlarının birlikte geçmesi kafa karıştırabiliyor',
        'Sezonluk sahil tesisi olduğundan çalışma gün ve saatleri mevsime göre değişebiliyor',
      ],
      unc: ['Sezon dışı ve bahar geçiş dönemlerinde açık olma durumu telefonla teyit edilmelidir'],
    }),

    // ==================== NEGATIVE CONTROLS (POLİTİKA KAPISI DENETİMİ) ====================
    // Kapı 2 & Kapı 3B — Zincir ve Saf Kahveci Kontrolleri
    negControl(
      'ctrl-gundogan-bitez-dondurma',
      'ChIJjSSqWTpwvhQRgw6gOTFRNhc',
      'kahve',
      'Kapı 2, Kapı 3B & Kapı 6 ihlali: Bitez Dondurma çok şubeli zincir (CHAIN_BLOCKLIST), ice_cream_shop türü ve ★4.0 (274) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-royal-firin',
      'ChIJiYe2EfdxvhQRc3tpvswhtmc',
      'kahve',
      'Kapı 3B, Kapı 6 & Yeni Zincir Adayı: Royal Fırın Bodrum genelinde çok şubeli (Umurca/Eskiçeşme/Ortakent/Gündoğan — CHAIN_BLOCKLIST adayı: royal firin), pastry_shop türü ve ★3.8 (121) puanı'
    ),

    // Kapı 3 — Yeme-İçme Dışı Tür Kontrolleri (Otel / Resort / Plaj / Barınak)
    negControl(
      'ctrl-gundogan-costa-farilya-hotel',
      'ChIJi3_p9zhwvhQRGBCSxo0tZ34',
      'date',
      'Kapı 3 ihlali: Costa Farilya Special Class Hotel Bodrum hotel türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-gundogan-halk-plaji',
      'ChIJnfkdXVNxvhQRwDc_Vp7xDVk',
      'kahve',
      'Kapı 3 ihlali: Gündoğan Halk Plajı resort_hotel türü FOOD_PLACE_TYPES dışında (ayrıca ★4.3 puanı 4.4 tabanının altında)'
    ),
    negControl(
      'ctrl-gundogan-via-farilya-hotel',
      'ChIJKwYt4DdwvhQRw4pnvuKwk6M',
      'date',
      'Kapı 3 ihlali: Via Farilya Boutique Hotel hotel/motel türü FOOD_PLACE_TYPES dışında (ayrıca ★4.2 puanı)'
    ),
    negControl(
      'ctrl-gundogan-kucukbuk-sahil',
      'ChIJx_dnBRxwvhQRABJXgm2l0ec',
      'date',
      'Kapı 3 ihlali: Küçükbük Sahil beach/natural_feature türü FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-gundogan-balikci-barinagi',
      'ChIJK3v1BQBxvhQRJDm3WuHpKHU',
      'balik',
      'Kapı 3 & Kapı 6 ihlali: Gündoğan balıkçı barınağı association_or_organization türü ve puanı bulunmuyor'
    ),

    // Kapı 8 — Şişirilmiş Puan / Yetersiz Bağımsız Kanıt Kontrolü (<150 oy & >=4.8)
    negControl(
      'ctrl-gundogan-murgarita-pizza',
      'ChIJcxzdn8BtvhQREIUquY11iHM',
      'pizza',
      'Kapı 8 ihlali: murgarita pizza ★4.8 (52 oy < 150) eşiğinde kendi sitesi ve Yandex Harita dışında yalnızca tek bağımsız platform (Restaurant Guru) doğrulanabildi; ikinci bağımsız yayın/platform kanıtı eksik'
    ),

    // Kapı 6 — Kalite Eşiği (<4.4 veya <35 değerlendirme) Kontrolleri
    negControl(
      'ctrl-gundogan-midyeci-sehmus-usta',
      'ChIJwUgBUzpwvhQRs2vIAtuLO2U',
      'denemelisin',
      "Kapı 6 ihlali: Midyeci Şehmus Usta'nın Yeri ★4.2 (1735) puanı 4.4 tabanının altında"
    ),
    negControl(
      'ctrl-gundogan-sail-loft',
      'ChIJobLoKTpwvhQRYYLWaUjWYAU',
      'kahve',
      'Kapı 6 ihlali: Sail Loft ★3.3 (426) puanı 4.4 tabanının çok altında'
    ),
    negControl(
      'ctrl-gundogan-reana-restaurant',
      'ChIJBwqxGDtwvhQRLUonwAe9HrU',
      'balik',
      'Kapı 6 ihlali: Reana Restaurant ★4.3 (352) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-quzine-kahvalti',
      'ChIJAQAAQDNwvhQRm-3rmSGQP6A',
      'kahvalti',
      'Kapı 6 ihlali: quzine Kahvaltı Evi ★4.3 (508) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-terzi-mustafa',
      'ChIJUfaGHjtwvhQRdPcA-Qka36o',
      'balik',
      'Kapı 6 ihlali: Terzi Mustafanın Yeri ★4.1 (712) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-koroglu-ocakbasi',
      'ChIJI4pcwH9xvhQR23ZEtgpxTlc',
      'denemelisin',
      'Kapı 6 ihlali: Köroğlu Ocakbaşı ★4.1 (146) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-mehmet-okaliptus',
      'ChIJuTTQzB1wvhQR8j6FQ4lABpE',
      'balik',
      "Kapı 6 ihlali: Mehmet'in Yeri Okaliptus Restaurant (Küçükbük) ★4.2 (168) puanı 4.4 tabanının altında"
    ),
    negControl(
      'ctrl-gundogan-valentino-beach-cafe',
      'ChIJYxKcMxxwvhQR6cNmwRwVqk4',
      'kahve',
      'Kapı 6 ihlali: Valentino Beach Cafe (Küçükbük) ★4.3 (41) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-dandik-restaurant',
      'ChIJY1OK8l1xvhQRza8RDXyOijM',
      'denemelisin',
      'Kapı 6 ihlali: DANDİK RESTAURANT (Küçükbük) ★4.3 (72) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-dozo-beach',
      'ChIJQ7vmN6RxvhQRSMA5AZko1xE',
      'date',
      'Kapı 6 ihlali: Dozó Beach & Restaurant ★4.3 (44) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-farilya-restaurant',
      'ChIJV4ybXzpwvhQR4_pyKcZ-c5Y',
      'balik',
      'Kapı 6 ihlali: Farilya Restaurant ★4.1 (38) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-denizim-restaurant',
      'ChIJyawjmzlwvhQRycUi4aQdUrA',
      'balik',
      'Kapı 6 ihlali: Denizim Restaurant ,Gündoğan Yaz kış Açık ★4.3 (51) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-moon-burger',
      'ChIJF7kRDnlxvhQR4zAmnbdHORQ',
      'hamburger',
      'Kapı 6 ihlali: Moon Burger Bodrum ★3.8 (76) puanı 4.4 tabanının altında (hamburger kategorisi boş bırakıldı)'
    ),
    negControl(
      'ctrl-gundogan-gambille-gurme',
      'ChIJS2E0K-ZvvhQRafPzfcqCTmw',
      'hamburger',
      'Kapı 6 ihlali: Gambille Gurme ★4.1 (45) puanı 4.4 tabanının altında (hamburger kategorisi boş bırakıldı)'
    ),
    negControl(
      'ctrl-gundogan-balikcilar-kahvesi',
      'ChIJ8_XsAztwvhQRWpBJMDqTcxM',
      'kahve',
      'Kapı 6 ihlali: balıkçılar kahvesi ★4.3 (95) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-gundogan-farilya-cafe',
      'ChIJKXMVOctxvhQRGlxIz43gp8c',
      'kahve',
      'Kapı 6 ihlali: Farilya Cafe ★3.8 (31) puanı ve oy sayısı alt sınırların altında'
    ),

    // Kapı 4 — Dış Mahalle & Komşu Belde Sınır Kontrolleri (Dirmil/Yalıkavak & Türkbükü/Menemene)
    negControl(
      'ctrl-gundogan-safiye-yalikavak-outside',
      'ChIJ12p7zv5xvhQR5YkRZSEfUUo',
      'date',
      'Kapı 4 ihlali: SAFİYE YALIKAVAK Dirmil (Yalıkavak) Mahallesi, Gündoğan bbox ve mahalle sınırı dışında'
    ),
    negControl(
      'ctrl-gundogan-mezra-yalikavak-outside',
      'ChIJp7stYbNxvhQR7c2bmJROfJE',
      'date',
      'Kapı 4 ihlali: Mezra Yalıkavak Dirmil Mahallesi, Gündoğan bbox ve mahalle sınırı dışında'
    ),
    negControl(
      'ctrl-gundogan-kahraman-dirmil-outside',
      'ChIJQTwZzVRwvhQRYJLGSxm7llE',
      'balik',
      'Kapı 4 ihlali: KAHRAMAN BODRUM Dirmil Mahallesi, Gündoğan dışında (Yalıkavak snapshotında zaten yayında)'
    ),
    negControl(
      'ctrl-gundogan-azur-dirmil-outside',
      'ChIJF-Ru_WhxvhQRCXXCNxHoDf0',
      'balik',
      'Kapı 4 ihlali: Azur Bodrum Dirmil Mahallesi, Gündoğan bbox ve mahalle sınırı dışında'
    ),
    negControl(
      'ctrl-gundogan-farina-turkbuku-outside',
      'ChIJQ9oOy6NvvhQR8KBooz-Uo2c',
      'kahvalti',
      'Kapı 4 ihlali: Farina Türkbükü Mahallesi, Gündoğan dışında (Türkbükü snapshotında zaten yayında)'
    ),
    negControl(
      'ctrl-gundogan-pizzerie-ce-turkbuku-outside',
      'ChIJL_6fj8JvvhQRzuF36r1bMrU',
      'pizza',
      "Kapı 4 ihlali: Pizzerie C'e Türkbükü Mahallesi, Gündoğan bbox ve mahalle sınırı dışında"
    ),
    negControl(
      'ctrl-gundogan-club-turkbuku-outside',
      'ChIJi_g-W9lvvhQR79uNJnocgA8',
      'date',
      'Kapı 3 & Kapı 4 ihlali: Club Türkbükü hotel türü ve Menemene (Türkbükü) Mahallesi, Gündoğan dışında'
    ),
    negControl(
      'ctrl-gundogan-fuat-usta-turkbuku-outside',
      'ChIJZ9navGRvvhQRcjQ-rSYmy98',
      'hamburger',
      'Kapı 4 ihlali: FUAT USTA FASTFOOD CAFE Türkbükü Mahallesi, Gündoğan bbox ve mahalle sınırı dışında'
    ),
  ],
};
