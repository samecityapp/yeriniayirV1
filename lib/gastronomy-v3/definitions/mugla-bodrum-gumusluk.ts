import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const MUGLA_BODRUM_GUMUSLUK_DEF: V3RegionDefinition = {
  id: 'gumusluk-bodrum-mugla',
  slug: 'gumusluk',
  city: 'Muğla',
  district: 'Bodrum',
  allowedDistricts: ['Bodrum'],
  neighborhood: 'Gümüşlük',
  officialQuarter:
    'Gümüşlük Mahallesi & Koyunbaba Koyu (Yalı Mevkii, Tavşan Adası Karşısı, Köy İçi, Kardak Tepesi & Karakaya Yamaçları)',
  displayName: 'Gümüşlük, Bodrum, Muğla',
  locative: "Gümüşlük'te",
  path: ['mugla', 'bodrum', 'gumusluk'],
  aliases: [
    'Gümüşlük',
    'Gumusluk',
    'Gümüşlük Sahil',
    'Tavşan Adası',
    'Tavsan Adasi',
    'Myndos',
    'Gümüşlük Yalı',
    'Koyunbaba',
    'Karakaya Gümüşlük',
  ],
  scopeNote:
    'Yalı Mevkii & Kral Yolu Sahili, 1120. ve 5120. Sokaklar, Kardak Tepesi, 5233. Cadde, Köy İçi & Koyunbaba · Doğrulanmış Seçki',
  characterSubtitle:
    'Yalı Mevkii ve Kral Yolu kıyısından 1120. ile 5120. Sokaklara, Kardak sırtlarından köy merkezine ve Koyunbaba yamacına uzanan zeytin bahçeli odun fırını pizzacısı, narenciye bahçesi şef sofraları, gün batımı teras ve kokteyl durakları, ekşi mayalı mahalle fırınları, ev yemekleri ile kıyı balıkçıları.',
  center: { lat: 37.0550, lng: 27.2375 },
  bbox: { minLat: 37.0400, maxLat: 37.0780, minLng: 27.2240, maxLng: 27.2660 },
  allowedNeighborhoodTokens: [
    'Gümüşlük',
    'Gumusluk',
    'Koyunbaba',
    'Karakaya',
    'Yalı Mevkii',
    'Yali Mevkii',
  ],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // ==================== 1. PİZZA ====================
    compactSeed({
      id: 'munda-gumusluk',
      placeId: 'ChIJmbCU4a91vhQR3sjYt8yhmOo',
      cat: 'pizza',
      secondaryCategoryIds: ['date'],
      brand: 'munda',
      area: 'Ahmet Yesevi Sk., Gümüşlük',
      signals: ['zeytin_bahcesi', 'napoliten_odun_firini', 'sarap_kavi', 'yerel_italyan'],
      verifiedAt: '2026-11-16',
      desc: "Gümüşlük'te zeytin ağaçlarının altındaki açık bahçe düzeninde, odun ateşinde Napoli usulü taş fırın pizzalar, el yapımı taze makarnalar ve seçkin şarap eşleşmeleri sunan İtalyan restoranı ve şarap evi.",
      order: ['Napoliten Margherita Pizza', 'Odun Fırını Şarküteri Pizza', 'El Yapımı Taze Makarna'],
      menu: [
        'Napoliten Margherita Pizza',
        'Dört Peynirli Pizza',
        'Füme Etli Odun Fırını Pizza',
        'El Yapımı Taze Makarna',
        'Akdeniz Paylaşım Tabakları',
        'Kahvaltı Servisi',
        'Şarap Kavı ve İmza Kokteyller',
      ],
      sec: [
        [
          'Butik Şarap Eşleşmeleri ve İmza Kokteyller',
          'Akşamüstü ve gece servisinde pizzaların yanında geniş şarap kavından kadeh seçenekleri öne çıkar.',
          'mundagumusluk.com ve MyGuideBodrum kayıtları',
        ],
        [
          'Zeytin Ağacı Altında Sabah Kahvaltısı',
          'Günün erken saatlerinde sakin bahçe atmosferinde kahvaltı servisi de sunulur.',
          'MyGuideBodrum incelemesi',
        ],
      ],
      seat: 'Zeytin ağaçları altında uzun ahşap Akdeniz masaları ve bahçe oturma düzeni',
      crowd: 'Yaz akşamları ve hafta sonlarında canlı, kalabalık arkadaş gruplarına uygun, akşamüstü daha sakin',
      dis: 'Sahil yürüyüş bandından içeride yer alır ve yoğun yaz akşamlarında önceden rezervasyon gerekebilir',
      transit: 'Gümüşlük içi Ahmet Yesevi Sokak No:33 adresinde, köy içi güzergahtan kısa sürüş veya yürüyüş mesafesinde',
      sources: [
        [
          'Munda Gümüşlük Resmi Sitesi',
          'https://www.mundagumusluk.com/',
          'operator',
          'Zeytin ağaçları altı bahçe konsepti, Napoliten odun fırını pizza ve taze makarna odağı',
        ],
        [
          'MyGuideBodrum — Munda Gümüşlük',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Kahvaltı, pizza restoranı ve şarap evi/bar çok yönlülüğü, canlı müzik ve akşam temposu değerlendirmesi',
        ],
        [
          'Müdavim — Munda Gümüşlük İncelemesi',
          'https://www.mudavim.net/',
          'editorial',
          'Zeytin ağaçları altı Akdeniz akşamları ve odun fırını hamur kalitesi rehber kaydı',
        ],
        [
          'Fornero Oven — Munda Gümüşlük Referansı',
          'https://fornerooven.com/',
          'community',
          'Napoliten taş fırın altyapısı ve odun ateşi pişirim doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=16904439101964994782',
          'maps',
          'Gümüşlük, Ahmet Yesevi Sk. No:33 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Gümüşlük balıkçı hattının dışında zeytin bahçesinde özgün Napoliten odun fırını pizza ve şarap odağı',
        'Resmi operatör, editoryal rehberler ve fırın üreticisi kayıtlarıyla çoklu bağımsız doğrulama',
      ],
      cons: [
        'Kıyı şeridinden içeride kaldığı için deniz manzaralı sahil masası arayanlara hitap etmez',
        'Sezon akşamlarında rezervasyonsuz yer bulmak zorlaşabiliyor',
      ],
      unc: ['Canlı müzik ve sabah kahvaltısı saatleri yaz/bahar dönemine göre güncellenebiliyor'],
    }),

    // ==================== 4. DATE MEKANLARI ====================
    compactSeed({
      id: 'sia-eli-bodrum',
      placeId: 'ChIJvQNV0sV1vhQRBFGBwnvtZzc',
      cat: 'date',
      name: 'Sia Eli Bodrum',
      brand: 'sia eli',
      area: '1120. Sk. (Narenciye Bahçesi), Gümüşlük',
      signals: ['tarladan_tabaga', 'narenciye_bahcesi', 'sef_mutfagi', 'butik_sarap'],
      verifiedAt: '2026-11-16',
      desc: "Gümüşlük'te zeytin ve narenciye ağaçlarıyla çevrili sakin bir bahçede, arka bostanından ve yerel üreticilerden beslenen sezgisel Akdeniz şef tabakları ve butik Türk şarapları sunan akşam restoranı.",
      order: ['Çıtır Barbunya Tempura', 'Kekikli Yavaş Pişmiş Kuzu İncik', 'Izgara Lagos'],
      menu: [
        'Ekşi Mayalı Ev Ekmeği ve Zeytinyağı',
        'Közlenmiş Patlıcanlı Buğday Salatası',
        'Çıtır Barbunya Tempura',
        'Melitzanosalata',
        'Kekikli Yavaş Pişmiş Kuzu İncik',
        'Izgara Lagos',
        'Steak Diane',
        'Not Sebastian Cheesecake',
      ],
      sec: [
        [
          'Bostan Başlangıçları ve Ekşi Mayalı Ekmek',
          'Fırından yeni çıkmış ekşi mayalı ekmek ve mevsimsel sebze tabakları akşam yemeğinin imza açılışıdır.',
          'Oggusto ve rehber menü kayıtları',
        ],
        [
          'Not Sebastian Cheesecake ve Otlu Kokteyller',
          'Yemek sonunda şekeri dengeli tatlılar ile taze bahçe otlarıyla hazırlanan kokteyller sıkça tercih edilir.',
          'Oggusto incelemesi',
        ],
      ],
      seat: 'Yüz yıllık zeytin ve mandalina ağaçları altında aralıklı bahçe masaları; el yapımı seramik servis',
      crowd: 'Kalabalıktan uzak, sakin, romantik ve yavaş tempolu akşam yemeği atmosferi',
      dis: 'Yalnızca sıcak sezonda hizmet verir; rezervasyon zorunludur ve bölge genelinde üst bütçe segmentindedir',
      transit: 'Gümüşlük 1120. Sokak No:108 adresinde, Kardak yoluna doğru bahçe girişli alan',
      sources: [
        [
          'Sia Eli Bodrum Resmi Sitesi',
          'https://www.siaelibodrum.com/',
          'operator',
          'Tarladan tabağa bahçe mutfağı felsefesi ve sezonluk çalışma düzeni',
        ],
        [
          'Michelin Guide Türkiye — Sia Eli',
          'https://guide.michelin.com/',
          'award',
          '2026 rehber seçkisi, zeytin ağaçları altı bahçe ve Akdeniz füzyon şef mutfağı',
        ],
        [
          'Oggusto — Sia Eli Bodrum İncelemesi',
          'https://www.oggusto.com/',
          'editorial',
          'Barbunya tempura, kuzu incik, ızgara lagos, Not Sebastian Cheesecake ve Urla-Bozcaada kavı detayları',
        ],
        [
          'Bodrum Guru — Sia Eli Gümüşlük',
          'https://www.bodrumguru.com/',
          'editorial',
          'MSA yaz dönemi şef iş birliği ve bahçe servis deneyimi kaydı',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=3992420710487249156',
          'maps',
          'Gümüşlük, 1120. Sk. No:108/1-2-3 konum doğrulaması',
        ],
      ],
      pros: [
        'Narenciye ve zeytin ağaçları içinde kalabalıktan izole yüksek gastronomi standardı',
        'Kendi bostanı ve yerel üreticilere dayanan mevsimsel şef menüsü ile seçkin şarap kavı',
      ],
      cons: [
        'Kış döneminde kapalı olup yalnızca sıcak sezon aylarında açılıyor',
        'Üst segment fiyatlama ve deniz ürünlerinde dönemsel pişirim farkı eleştirisi görülebiliyor',
      ],
      unc: ['Her yaz sezonunda dönemsel şef kadrosu ve tadım menüsü güncellenebiliyor'],
    }),

    compactSeed({
      id: 'teras-gumusluk',
      placeId: 'ChIJ387gnj11vhQRKXN-noBVogI',
      cat: 'date',
      brand: 'teras',
      area: '5120. Sk. (Yalı Tepesi), Gümüşlük',
      signals: ['gun_batimi_terasi', 'italyan_mutfagi', 'kokteyl_sarap', 'manzarali_aksam'],
      verifiedAt: '2026-11-16',
      desc: "Yalı Mevkii üzerindeki teras katından Gümüşlük koyuna ve gün batımına bakan; akşamları İtalyan usulü taze makarnalar, taş fırın pizzalar, kokteyller ve şarap sunan manzaralı restoran.",
      order: ['Spaghetti alla Puttanesca', 'Pappardelle Gamberi', 'Mantarlı İtalyan Pizza'],
      menu: [
        'Spaghetti alla Puttanesca',
        'Spaghetti Napoletana',
        'Penne Alla Arrabbiata',
        'Pappardelle Gamberi',
        'Seafood Capellini Pasta',
        'Mantarlı Pizza',
        'Serpme Kahvaltı',
        'Gün Batımı Kokteylleri',
      ],
      sec: [
        [
          'Deniz Mahsullü Capellini ve Mushroom Bolognese',
          'Resmi menüdeki alternatif soslu makarnalar balık dışındaki akşam seçeneklerini zenginleştirir.',
          'terasgumusluk.com resmi menüsü',
        ],
        [
          'Teras Serpme Kahvaltısı',
          'Sabah saatlerinde aynı koy manzarası eşliğinde Ege peynir ve reçelleriyle kahvaltı servisi verilir.',
          'terasgumusluk.com ve EniyiKahvaltı kayıtları',
        ],
      ],
      seat: 'Yüksek konumlu açık deniz manzaralı teras masaları ve iç salon oturumu',
      crowd: 'Gün batımı ve akşam yemeği saatlerinde romantik ve keyifli, gündüzleri daha dingin',
      dis: 'Yoğun yaz akşamlarında servis temposu yavaşlayabiliyor ve ön sıra manzaralı masalar için rezervasyon gerekiyor',
      transit: 'Gümüşlük 5120. Sokak No:52 (Liman Hotel teras katı) adresinde, Yalı sahiline birkaç adım yokuş yukarıda',
      sources: [
        [
          'Teras Gümüşlük Resmi Sitesi',
          'http://www.terasgumusluk.com/',
          'operator',
          'Spaghetti alla Puttanesca, Napoletana, Pappardelle Gamberi, Capellini menü kalemleri ve gün batımı terası',
        ],
        [
          'MyGuideBodrum — Teras Gümüşlük',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Kahvaltı, Akdeniz-İtalyan mutfağı, kokteyl ve manzara değerlendirmesi',
        ],
        [
          'Yandex Maps & TripAdvisor — Teras Gümüşlük',
          'https://yandex.com.tr/',
          'community',
          'Gün batımı terası manzarası, pizza ve makarna memnuniyeti ile yoğunlukta servis hızı notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=189808145206244137',
          'maps',
          'Gümüşlük, 5120. Sk. No:52 konum doğrulaması',
        ],
      ],
      pros: [
        'Klasik sahil balıkçılarının dışında yüksek terastan koy manzaralı İtalyan akşamı ve kokteyl alternatifi',
        'Resmi web menüsüyle kalem kalem doğrulanan makarna, pizza ve kahvaltı seçenekleri',
      ],
      cons: [
        'Teras merdiven çıkışı gerektiriyor ve yüksek sezonda servis gecikmeleri yaşanabiliyor',
        'Manzaralı ön masalar rezervasyonsuz dolabiliyor',
      ],
      unc: ['Sezon dışı dönemde servis saatleri ve kahvaltı düzeni kısalabiliyor'],
    }),

    compactSeed({
      id: 'jadem-gumusluk',
      placeId: 'ChIJlzzVDFB1vhQR2EhMBCEoMl4',
      cat: 'date',
      brand: 'jadem',
      area: '1120. Sk. (Kral Yolu Başı), Gümüşlük',
      signals: ['acik_ates_mutfagi', 'antik_myndos_kiyisi', 'sef_tabaklari', 'sarap_ve_kokteyl'],
      verifiedAt: '2026-11-16',
      desc: "Antik Myndos kalıntıları ve Kral Yolu'nun başındaki deniz kenarı konumunda; açık ateşte pişen yaratıcı deniz ürünleri, yerel otlu mezeler ve narenciyeli kokteyller sunan şef restoranı.",
      order: ['Kabak Çiçeğinde Bodrum Mandalinalı Levrek', 'Deniz Mahsullü Keşkek', 'Haftanın Meze Beşlisi'],
      menu: [
        'Haftanın Meze Beşlisi',
        'Mandalinalı Jelli Deniz Tarağı',
        'Somon Tartar',
        'Deniz Mahsullü Keşkek',
        'Kabak Çiçeğinde Bodrum Mandalinalı Levrek',
        'Açık Ateş Deniz Ürünleri',
        'Şarap Kavı ve Narenciye Kokteylleri',
      ],
      sec: [
        [
          'Mandalinalı Jelli Deniz Tarağı ve Somon Tartar',
          'Açık ateş ana yemekleri öncesinde soğuk başlangıç olarak sıkça önerilen imza tabaklardır.',
          'GurmeRehber menü incelemesi',
        ],
        [
          'Bodrum Narenciyeli İmza Kokteyller',
          'Gün batımına karşı yemek öncesi veya sonrası için yerel turunçgillerle hazırlanır.',
          'jadem.com.tr resmi kayıtları',
        ],
      ],
      seat: 'Kral Yolu başında su kenarı masalar ve ahşap-taş heykellerle dekore edilmiş açık alan',
      crowd: 'Özel akşam yemekleri ve gün batımı buluşmaları için şık ve özenli akşam temposu',
      dis: 'Gümüşlük içindeki en yüksek bütçeli restoranlardan biridir ve yaz döneminde servis aksamalarına dair münferit eleştiriler bulunabilir',
      transit: 'Gümüşlük 1120. Sokak No:7/1 adresinde, Kral Yolu başlangıcında yaya sahil bandında',
      sources: [
        [
          'Jadem Gümüşlük Resmi Sitesi',
          'https://jadem.com.tr/',
          'operator',
          'Dört element ve açık ateş mutfağı konsepti, Erkan ve Sinan Uyav heykelleri ve narenciye kokteylleri',
        ],
        [
          'GurmeRehber — Jadem Gümüşlük',
          'https://gurmerehber.com/',
          'editorial',
          'Haftanın Meze Beşlisi, mandalinalı deniz tarağı, deniz mahsullü keşkek ve kabak çiçeğinde levrek menü incelemesi',
        ],
        [
          'GrabLocals & Mes Prestiges — Jadem Gümüşlük',
          'https://www.mesprestiges.com/',
          'editorial',
          'Myndos kalıntıları yanı başındaki konum, su altı aydınlatmalı akşam masaları ve sezonluk Nisan-Ekim takvimi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=6787531710671898840',
          'maps',
          'Gümüşlük, 1120. Sk. No:7/1 konum doğrulaması',
        ],
      ],
      pros: [
        'Klasik sahil meyhanesi kalıbının dışında Şef Uğur Filiz imzalı açık ateş ve yerel narenciye mutfağı',
        'Antik Kral Yolu kıyısındaki özgün konum ve sanatsal dekorasyon',
      ],
      cons: [
        'Yüksek fiyat seviyesi ve sezon piklerinde zaman zaman eleştirilen servis temposu',
        'Yalnızca sıcak sezonda (Nisan–Ekim bandında) hizmet veriyor',
      ],
      unc: ['Sezon açılış/kapanış tarihleri ve haftalık meze seçkisi döneme göre değişebiliyor'],
    }),

    compactSeed({
      id: 'guzelev-gumusluk',
      placeId: 'ChIJ1Z972fF0vhQR33PhjWr0FRc',
      cat: 'date',
      brand: 'guzelev',
      area: 'Kardak Cd. (Oruç Reis Sk.), Gümüşlük',
      signals: ['sakin_manzara', 'butik_konukev_restorani', 'gun_batimi_sarap', 'meze_ve_kahvalti'],
      verifiedAt: '2026-11-16',
      desc: "Kardak yamacındaki konukevinin deniz ve gün batımı manzaralı terasında; Gümüşlük sahilinin gürültüsünden uzakta mezeler, Akdeniz tabakları, taze balık ve şarap eşleşmeleri sunan sakin durak.",
      order: ['Günlük Mezeler ve Zeytinyağlılar', 'Mevsim Balığı Izgara', 'Şarap ve Paylaşım Tabağı'],
      menu: [
        'Zeytinyağlı Ege Mezeleri',
        'Mevsim Balığı Seçenekleri',
        'Akdeniz Ana Yemekleri',
        'Sabah Kahvaltı Tabağı',
        'Şarap ve Kokteyl Çeşitleri',
      ],
      sec: [
        [
          'Deniz Manzaralı Sabah Kahvaltısı',
          'Sabah saatlerinden itibaren aynı koy manzarası karşısında sakin kahvaltı servisi sunulur.',
          'MyGuideBodrum ve EniyiKahvaltı kayıtları',
        ],
      ],
      seat: 'Koy ve deniz manzaralı teras masaları ile samimi konukevine bağlı bahçe oturumu',
      crowd: 'Sahil kalabalığından kaçan çiftler ve küçük gruplar için huzurlu akşam temposu',
      dis: 'Yoğun yaz akşamlarında servis hızı yavaşlayabiliyor ve sahil düzlüğünden yokuş yukarı çıkmak gerekiyor',
      transit: 'Gümüşlük Kardak Caddesi / Oruç Reis Sokak bölgesinde, Yalı merkezinden kısa yürüyüşle yamaç üstünde',
      sources: [
        [
          'MyGuideBodrum — Güzelev Gümüşlük',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Butik konukevi ve restoran birleşimi, meze, ana yemek ve içecek seçkisi kaydı',
        ],
        [
          'Restaurant Guru — Güzelev Gümüşlük',
          'https://restaurantguru.com/',
          'community',
          'Akdeniz ve Türk mutfağı yemekleri ile sakin teras atmosferi değerlendirmeleri',
        ],
        [
          'Yandex Maps — Güzelev Gümüşlük',
          'https://yandex.com.tr/',
          'community',
          'Kardak Cd. Oruç Reis Sk. adres, gün batımı manzarası ve yoğunlukta servis hızı geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=1663504375867339743',
          'maps',
          'Gümüşlük yamacı konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Sahil bandındaki yoğun ve gürültülü düzenden uzak, koy manzaralı sakin akşam atmosferi',
        'Hem akşamüstü şarap-meze buluşmalarına hem sabah kahvaltısına uygun çok yönlü yapı',
      ],
      cons: [
        'Yamaç konumu nedeniyle yürüyerek çıkış gerektiriyor',
        'Kalabalık günlerde servis süresinin uzadığına dair ziyaretçi notları mevcut',
      ],
      unc: ['Mevsimsel menü kalemleri günlük tedariğe göre değişebiliyor'],
    }),

    // ==================== 5. KAHVALTI ====================
    compactSeed({
      id: 'daisy-coffee-breakfast-gumusluk',
      placeId: 'ChIJBahz1DV1vhQRpfJehr3mCOY',
      cat: 'kahvalti',
      brand: 'daisy',
      area: '5120. Sk. (Yalı Mevkii), Gümüşlük',
      signals: ['yalida_kahvalti', 'yumurta_cesitleri', 'kahve_ve_tatli', 'sakin_sokak'],
      verifiedAt: '2026-11-16',
      desc: "Gümüşlük 5120. Sokak'ta sahilin hemen arka hattında yer alan; serpme ve tabak kahvaltı seçenekleri, taze yumurta çeşitleri, günlük tatlılar ve kahvelerle güne başlanan samimi kahvaltı ve kafe durağı.",
      order: ['Serpme Kahvaltı', 'Menemen & Yumurta Çeşitleri', 'Günlük Tatlı & Kahve Eşleşmesi'],
      menu: [
        'Serpme Kahvaltı',
        'Klasik Kahvaltı Tabağı',
        'Menemen ve Omlet Çeşitleri',
        'Taze Hamur İşleri',
        'Ev Yapımı Tatlılar',
        'Espresso ve Buzlu Kahveler',
      ],
      sec: [
        [
          'Günün Tatlıları ve Kahve Molası',
          'Kahvaltı saatleri dışında da açık oturma alanında kahve ve günlük tatlı ikilisi için uğranır.',
          'Restaurant Guru ve dijital menü kayıtları',
        ],
      ],
      seat: 'Sokak cephesinde açık hava masaları ve iç salon oturumu',
      crowd: 'Sabah ve öğle saatlerinde sakin mahalle kahvaltısı temposunda, yaz ortasında masalar çabuk dolabiliyor',
      dis: 'Denize sıfır kordon masası bulunmuyor ve yüksek sezonda masalar hızlı dolabiliyor',
      transit: 'Gümüşlük 5120. Sokak üzerinde, Yalı sahiline ve dolmuş son durağına yürüme mesafesinde',
      sources: [
        [
          'MyQRCodeMenu — Daisy Coffee & Breakfast',
          'https://myqrcodemenu.com/',
          'operator',
          'Kahvaltı tabakları, yumurta çeşitleri, tatlı ve içecek menü kapsamı',
        ],
        [
          'Restaurant Guru — Daisy Coffee & Breakfast',
          'https://restaurantguru.com/',
          'community',
          'Kahvaltı, kahve, tatlılar ve açık hava oturumu değerlendirmeleri',
        ],
        [
          'Yandex Maps — Daisy Coffee & Breakfast',
          'https://yandex.com.tr/',
          'community',
          '5120. Sokak No:52 konumu, güler yüzlü servis ve sabah kahvaltısı geri bildirimleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=16575752130214687397',
          'maps',
          'Gümüşlük 5120. Sk. koordinat ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Yalı sahilinin kalabalığına girmeden sakin sokakta ulaşılabilir kahvaltı ve kahve seçeneği',
        'Kahvaltı sonrası gün içinde tatlı-kahve molasına da elverişli menü',
      ],
      cons: [
        'Doğrudan deniz sıfırı manzara yerine sokak içi oturuma sahip',
        'Yaz sezonunda küçük masa kapasitesi hızlı dolabiliyor',
      ],
      unc: ['Yaz dışı çalışma günleri sezon takvimine göre değişebiliyor'],
    }),

    compactSeed({
      id: 'furnos-koyunbaba-gumusluk',
      placeId: 'ChIJr03NJmJ1vhQRqDirmhT62CQ',
      cat: 'kahvalti',
      brand: 'furnos',
      area: 'Kazım Karabekir Cd. (Koyunbaba), Gümüşlük',
      signals: ['eksi_maya_firin', 'sabah_erken_servis', 'koyunbaba_duragi', 'artizan_hamur'],
      verifiedAt: '2026-11-16',
      desc: "Koyunbaba Kazım Karabekir Caddesi üzerinde sabah erken saatlerde fırından çıkan ekşi mayalı ekmekleri, taze hamur işleri, kahvaltı eşlikçileri ve kahvesiyle güne başlayan artizan mahalle fırını ve kafe.",
      order: ['Ekşi Mayalı Ekmek Çeşitleri', 'Kahvaltı Tabağı & Fırın Hamur İşleri', 'Taze Kahve & Kruvasan'],
      menu: [
        'Ekşi Mayalı Ekmek Çeşitleri',
        'Kruvasan ve Taze Hamur İşleri',
        'Kahvaltı Tabağı',
        'Ekşi Maya Hamurlu Fırın Lezzetleri',
        'Tatlı Çeşitleri',
        'Sıcak ve Soğuk Kahve',
      ],
      sec: [
        [
          'Evlik Ekşi Mayalı Ekmek ve Günlük Tatlılar',
          'Yerinde kahvaltı dışında eve taze ekmek veya gün içi atıştırmalık tatlı almak için sıkça tercih edilir.',
          'furnosbodrum.com ve BodrumGuru kayıtları',
        ],
      ],
      seat: 'Koyunbaba dükkan önü kafe oturma alanı ve fırın tezgahı (paket alım da yaygın)',
      crowd: 'Sabah erken saatlerde mahalle sakinlerinin ekmek ve kahvaltı alışverişiyle canlı, öğleden sonra sakin',
      dis: 'Gümüşlük sahilinden uzakta, Koyunbaba ana caddesi üzerinde ticari bir noktada konumlanıyor',
      transit: 'Koyunbaba Kazım Karabekir Caddesi No:71/A (Migros yanı) adresinde, araç ve Yalıkavak–Gümüşlük minibüs hattında',
      sources: [
        [
          'Furnos Bodrum Resmi Sitesi',
          'https://www.furnosbodrum.com/',
          'operator',
          'Furnos Unlu Mamüller Koyunbaba Kazım Karabekir Cd. No:71/A adres ve fırın-kafe kimliği',
        ],
        [
          'Bodrum Guru — Furnos Bodrum',
          'https://www.bodrumguru.com/',
          'editorial',
          'Ekşi maya ekmekler, kahvaltı tabağı ve kahve eşlikçileri incelemesi',
        ],
        [
          'Yandex Maps & Aratsana — Furnos Koyunbaba',
          'https://yandex.com.tr/',
          'community',
          'Sabah erken açılış düzeni, unlu mamul ve artizan ekmek değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=2655146946736109736',
          'maps',
          'Koyunbaba, Kazım Karabekir Cd. no:71 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Koyunbaba hattında sabah erken saatlerden itibaren taze ekşi mayalı fırın ve kahvaltı imkanı',
        'Hem yerinde kahvaltı/kahve hem de evlik fırın alışverişi için kullanışlı',
      ],
      cons: [
        'Sahil atmosferi yerine Koyunbaba cadde ve market çevresi dokusunda yer alıyor',
        'Özel ürün çıkış günleri dışında çeşitler öğleden sonra azalabiliyor',
      ],
      unc: ['Pizza ve özel hamur işleri gün içinde belirli fırın partileriyle sınırlı olabiliyor'],
    }),

    compactSeed({
      id: 'plaj-cafe-gumusluk',
      placeId: 'ChIJ2wT9sc91vhQR1-X6AyRLKis',
      cat: 'kahvalti',
      brand: 'plaj cafe',
      area: '1120. Sk. (Güney Sahil), Gümüşlük',
      signals: ['1972_koklu_isletme', 'denize_sifir_sabah', 'aile_ortami', 'nostaljik_kafe'],
      verifiedAt: '2026-11-16',
      desc: "1972 yılından bu yana Gümüşlük 1120. Sokak kıyısında aile işletmesi sıcaklığıyla hizmet veren; denize sıfır masalarda Ege kahvaltısı, tost, hafif atıştırmalıklar ve çay-kahve sunan köklü sahil durağı.",
      order: ['Ege Kahvaltı Tabağı', 'Klasik Tost & Sandviç', 'Türk Kahvesi ve Ev Yapımı Reçel'],
      menu: [
        'Klasik ve Ege Kahvaltı Tabağı',
        'Tost ve Sandviç Çeşitleri',
        'Salatalar ve Ara Sıcaklar',
        'Izgara Balık Seçenekleri',
        'Tatlılar',
        'Türk Kahvesi, Filtre Kahve ve Çay',
      ],
      sec: [
        [
          'Gün İçi Sahil Molası ve Hafif Öğle Yemeği',
          'Sabah kahvaltısından sonra plaj ve şezlong kullanımına eşlik eden salata, balık ızgara ve soğuk içeceklerle devam eder.',
          'Gümüşlük Rehberi kaydı',
        ],
      ],
      seat: 'Denize sıfır sahil masaları ve gündüz plaj bölümünde şezlong-şemsiye düzeni',
      crowd: 'Sabah sakin ve aile dostu, gün batımına doğru sahil yürüyüşçüleriyle hareketli',
      dis: 'Modern veya lüks bir tasarım bekleyenlere göre oldukça sade ve eski usul salaş bir yapıya sahip',
      transit: 'Gümüşlük 1120. Sokak No:16/1 adresinde, sahil yürüyüş yolu üzerinde',
      sources: [
        [
          'Gümüşlük Rehberi — Plaj Cafe',
          'https://www.gumuslukrehberi.com/',
          'editorial',
          '1120. Sokak No:16 sahil konumu, şezlong-duş imkanı ve geniş kahvaltı-yemek menüsü',
        ],
        [
          'Yandex Maps — Plaj Cafe Gümüşlük',
          'https://yandex.com.tr/',
          'community',
          '1972 kuruluş geçmişi, aile işletmesi atmosferi ve gün batımı manzarası değerlendirmeleri',
        ],
        [
          'Vota — Plaj Cafe Gümüşlük',
          'https://vota.org/',
          'community',
          'Gümüşlük sahilinde sakin ve nezih ortam memnuniyeti',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=3110381110710429143',
          'maps',
          'Gümüşlük, 1120. Sk. 16/1 konum doğrulaması',
        ],
      ],
      pros: [
        'Yarım asrı aşan geçmişiyle abartısız, denize sıfır kahvaltı ve gün boyu sahil molası',
        'Gösterişten uzak samimi aile işletmesi temposu',
      ],
      cons: [
        'Modern kafe donanımı veya özel çekirdek kahve barı standardı arayanlara sade kalabilir',
        'Gün batımı ve hafta sonu öğleden sonraları doluluk artıyor',
      ],
      unc: ['Sezon dışı dönemlerde plaj ve mutfak servis saatleri daralabiliyor'],
    }),

    // ==================== 6. DENEMELİSİN ====================
    compactSeed({
      id: 'social-gumusluk',
      placeId: 'ChIJl30Rr2Z1vhQRyWNI29Es3ZQ',
      cat: 'denemelisin',
      brand: 'social',
      area: 'Atatürk Cd., Gümüşlük',
      signals: ['canli_muzik_sahnesi', 'imza_kokteyller', 'genis_teras', 'burger_ve_bar'],
      verifiedAt: '2026-11-16',
      desc: "Atatürk Caddesi üzerinde geniş terası, canlı müzik ve DJ performansları, özgün imza kokteylleri ve mutfağından çıkan doyurucu burgerleriyle Gümüşlük akşamlarının sosyal buluşma noktası.",
      order: ['İmza Kokteyller', 'Social Dana Burger', 'Paylaşımlık Bar Atıştırmalıkları'],
      menu: [
        'İmza Kokteyller ve Klasik Kokteyller',
        'Burger Çeşitleri',
        'Bar Atıştırmalık Tabakları',
        'Tatlı Çeşitleri',
        'Şarap ve Bira Seçkisi',
      ],
      sec: [
        [
          'Canlı Müzik ve Akustik Performans Geceleri',
          'Sezon boyunca konuk sanatçı konserleri ve DJ setleriyle akşam eğlencesi sunar.',
          'Biletinial ve Müdavim kayıtları',
        ],
      ],
      seat: 'Geniş açık hava terası ve sahne odaklı bar oturma düzeni',
      crowd: 'Gündüz sakin, akşam canlı müzik ve konser gecelerinde oldukça kalabalık ve enerjik',
      dis: 'Deniz kıyısında değil köy içi ana cadde üzerinde bulunur; konser akşamları gürültülü olabilir ve rezervasyon ister',
      transit: 'Gümüşlük Atatürk Caddesi No:6/2 (Jandarma kavşağı yakını) adresinde, dolmuş hattı üzerinde',
      sources: [
        [
          'Müdavim — Social Gümüşlük',
          'https://www.mudavim.net/',
          'editorial',
          'Geniş teras, imza kokteyller, burger/atıştırmalıklar ve canlı müzik sahnesi incelemesi',
        ],
        [
          'MyGuideBodrum — Social Gümüşlük',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Pub/bar atmosferi, şarap-kokteyl ve açık oturma düzeni kaydı',
        ],
        [
          'Biletinial — Social Gümüşlük Etkinlikleri',
          'https://biletinial.com/',
          'community',
          'Biletli canlı performans ve konser takvimi doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=10726779167305130953',
          'maps',
          'Gümüşlük, Atatürk Cd. No:6/2 konum doğrulaması',
        ],
      ],
      pros: [
        'Sahil balıkçılarının dışında kaliteli canlı müzik, teras kokteyli ve burger alternatifi',
        'Bölge ortalamasına göre dengeli fiyat/performans algısı',
      ],
      cons: [
        'Deniz manzaralı sahil mekanı değil; cadde üzerinde yer alıyor',
        'Konser akşamlarında giriş düzeni ve yoğunluk artabiliyor',
      ],
      unc: ['Canlı performans günleri ve bilet uygulaması haftalık programa göre değişiyor'],
    }),

    compactSeed({
      id: 'dalgic-restaurant-gumusluk',
      placeId: 'ChIJEX8rTO50vhQRZBbaL60hA8g',
      cat: 'denemelisin',
      brand: 'dalgic',
      area: 'Yalı Mevkii (İskele Karşısı), Gümüşlük',
      signals: ['ev_yemekleri', 'zeytinyaglilar', 'butce_dostu_yali', 'bitkili_bahce'],
      verifiedAt: '2026-11-16',
      desc: "Yalı Mevkii'nde balık lokantalarının arasında camekanlı tezgahından seçilen taze ev yemekleri, zeytinyağlılar, kabak çiçeği dolması, mantı ve gözlemeleriyle öne çıkan sıcak aile işletmesi.",
      order: ['Kabak Çiçeği Dolması', 'Taze Ev Yapımı Bamya ve Zeytinyağlılar', 'Ev Yapımı Mantı'],
      menu: [
        'Kabak Çiçeği Dolması',
        'Zeytinyağlı Tencere Yemekleri',
        'Yaprak Ciğer',
        'Köfte Güveç',
        'Ev Yapımı Mantı',
        'Kıymalı Biber Dolması',
        'Semizotu Salatası',
        'Kahvaltı ve Gözleme',
      ],
      sec: [
        [
          'Köfte Güveç ve Yaprak Ciğer',
          'Zeytinyağlıların yanında sıcak ana yemek arayanlar için ev usulü doyurucu seçeneklerdir.',
          'Wanderlog menü değerlendirmesi',
        ],
        [
          'Sabah Kahvaltısı ve Taze Gözleme',
          'Gündüz saatlerinde aynı bitkili bahçede kahvaltı ve el açması gözleme de sunulur.',
          'Wanderlog ziyaretçi kayıtları',
        ],
      ],
      seat: 'İskele karşısında kaktüs ve çiçeklerle çevrili samimi bahçe ve açık alan masaları',
      crowd: 'Öğle ve akşam saatlerinde yerel halk ve düzenli müdavimlerle dolu, sıcak aile temposunda',
      dis: 'Pik yaz akşamlarında yoğunluk nedeniyle servis hızında gecikme yaşanabiliyor',
      transit: 'Yalı Mevkii İskele Karşısı noktasında, Gümüşlük son durağından sahile yürüyüşle bir dakika mesafede',
      sources: [
        [
          'Wanderlog — Dalgıç Restaurant Gümüşlük',
          'https://wanderlog.com/',
          'community',
          'Camekanlı ev yemekleri, kabak çiçeği dolması, bamya, yaprak ciğer, mantı, gözleme ve bitkili bahçe notları',
        ],
        [
          'MyGuideBodrum — Dalgıç Restaurant',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Yalı Mevkii İskele Karşısı konumu ve geleneksel Türk mutfağı rehber kaydı',
        ],
        [
          'Yandex Maps — Dalgıç Restaurant Gümüşlük',
          'https://yandex.com.tr/',
          'community',
          'Yüksek fiyatlı balıkçılara kıyasla bütçe dostu ev yemekleri ve yoğun sezonda servis temposu notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=14412400260231599716',
          'maps',
          'Yalı Mevkii İskele Karşısı konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Gümüşlük sahil merkezinde balık dışında ev yapımı sulu yemek ve zeytinyağlı bulmak için nadir adres',
        'Sahil ortalamasına kıyasla bütçe dostu esnaf lokantası dengesi',
      ],
      cons: [
        'Lüks meze veya manzaralı deniz sıfırı masa düzeni bulunmuyor',
        'Çok yoğun yaz öğle/akşamlarında servis bekleyebiliyor',
      ],
      unc: ['Günlük tencere ve zeytinyağlı çeşitleri sabah mutfağına göre değişiyor'],
    }),

    compactSeed({
      id: 'nuka-gumusluk',
      placeId: 'ChIJ6xmuFmJ1vhQRTbZJE2qzqvs',
      cat: 'denemelisin',
      brand: 'nuka',
      area: '5233. Cd., Gümüşlük',
      signals: ['saglikli_kaseler', 'ev_yapimi_tatli', 'vegan_secenekler', 'yavas_uretim'],
      verifiedAt: '2026-11-16',
      desc: "Gümüşlük 5233. Cadde üzerinde yavaş ve taze üretim anlayışıyla hazırlanan besleyici bowl kaseleri, vegan/vejetaryen seçenekler, brioche ekmekli smash burgerler ve ev yapımı tatlılar sunan butik durak.",
      order: ['Teriyaki Tavuklu Bowl', 'Pink Smash Burger', 'Fıstık Krokanlı Profiterol'],
      menu: [
        'Teriyaki Tavuklu Bowl',
        'Vegan ve Vejetaryen Kaseler',
        'Pink Smash Burger',
        'Cheddarlı Hindi Fümeli Tost',
        'Fıstık Krokanlı Profiterol',
        'Paris-Brest',
        'Ev Yapımı Kombucha ve Nuka Iced Tea',
      ],
      sec: [
        [
          'Paris-Brest ve Çikolatalı Kurabiyeler',
          'Kaseler veya burger sonrası choux hamuru ve pastacı kremasıyla hazırlanan ev yapımı tatlılar öne çıkar.',
          'Addagio ve Wanderlog menü kayıtları',
        ],
        [
          'Ev Yapımı Kombucha ve Nuka Iced Tea',
          'Hazır meşrubatlar yerine kendi üretimi ferahlatıcı soğuk içecekler sunulur.',
          'Wanderlog ve Yemeksepeti kayıtları',
        ],
      ],
      seat: 'Sahil kalabalığından içeride ferah, temiz ve sade oturma düzeni; paket servis de aktif',
      crowd: 'Gündüz ve akşamüstü sakin, mahalle sakinleri ile sağlıklı öğün arayanların uğradığı tempolu nokta',
      dis: 'Sahil bandından uzakta 5233. Cadde yamacında yer aldığı için yürüyüşte yokuş gerektirebilir',
      transit: 'Gümüşlük 5233. Cadde No:23/4 adresinde, Güney Gümüşlük / Armonia yönünde araçla kısa mesafede',
      sources: [
        [
          'Nuka Bodrum Resmi Sitesi',
          'http://nukabodrum.online/',
          'operator',
          'Yavaş ve taze üretim felsefesi, kase ve ev yapımı tatlı konsepti',
        ],
        [
          'Wanderlog — Nuka Bowl & Dessert',
          'https://wanderlog.com/',
          'community',
          '5233. Cadde No:23/4 adres doğrulaması, Teriyaki Bowl, profiterol ve kombucha menü kayıtları',
        ],
        [
          'Yemeksepeti — Nuka Bowl & Dessert Gümüşlük',
          'https://www.yemeksepeti.com/',
          'community',
          'Cheddar hindi fümeli tost, Nuka Iced Tea, hijyen ve paketleme özeni geri bildirimleri',
        ],
        [
          'VeganHarita & Addagio — Nuka Bodrum',
          'https://veganharita.com/',
          'community',
          'Vegan/vejetaryen kase seçenekleri, Pink Smash Burger ve Paris-Brest doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=18134504117732226637',
          'maps',
          'Gümüşlük, 5233. Cd. 23/4 konum doğrulaması',
        ],
      ],
      pros: [
        'Bölgede taze bowl, bitki bazlı seçenekler ve artizan choux tatlılarını bir arada sunan nadir adres',
        'Resmi site, Wanderlog, Yemeksepeti ve VeganHarita ile çoklu bağımsız doğrulama',
      ],
      cons: [
        'Sahil yürüyüş aksının dışında kaldığı için özel araç veya kısa transfer gerektiriyor',
        'Klasik Ege mutfağı ya da akşam meze ortamı arayanlara uygun değildir',
      ],
      unc: ['Sezon içi açılış saatleri ve paket servis alanı döneme göre değişebiliyor'],
    }),

    compactSeed({
      id: 'kardesler-koftecisi-gumusluk',
      placeId: 'ChIJG4-j9-h1vhQRG2q8fzfqsKE',
      cat: 'denemelisin',
      brand: 'kardesler',
      area: '5120. Sk. (Yalı Mevkii), Gümüşlük',
      signals: ['salca_soslu_kofte', 'ekonomik_sokak_lezzeti', 'kasap_sucuk_tost', 'yerel_esnaf'],
      verifiedAt: '2026-11-16',
      desc: "5120. Sokak içinde tahta masa-sandalyeli çay bahçesi havasında hizmet veren; özel domates salçalı sosuyla harmanlanmış çıtır ekmek arası köfteleri ve kasap sucuğu tostlarıyla bilinen ekonomik esnaf durağı.",
      order: ['Salça Soslu Ekmek Arası Köfte', 'Yoğurtlu Soslu Köfte', 'Kasap Sucuklu Kaşarlı Tost'],
      menu: [
        'Salça Soslu Ekmek Arası Köfte',
        'Izgara Köfte Porsiyon',
        'Yoğurtlu Soslu Köfte',
        'Kasap Sucuklu Tost',
        'Piyaz ve Salata',
        'Ayran ve İçecekler',
      ],
      sec: [
        [
          'Izgara Köfte Porsiyon ve Piyaz',
          'Ekmek arası yerine tabakta salata ve piyaz eşliğinde oturarak yemek isteyenler için sunulur.',
          'Yemeksepeti menü kayıtları',
        ],
      ],
      seat: 'Sokak arasında tahta masa ve sandalyeli sade açık alan oturumu; paket servis mevcut',
      crowd: 'Öğle ve akşamüstü saatlerinde yerel esnaf ve ekonomik atıştırmalık arayanlarla hareketli',
      dis: 'Sokak arasında kaldığı için ilk kez gelenler açısından gizli kalabiliyor ve porsiyonlar hızlı sokak yemeği ölçüsündedir',
      transit: 'Gümüşlük Yalı Mevkii 5120. Sokak No:48/6 adresinde, sahil merkezine yürüme mesafesinde',
      sources: [
        [
          'NowBodrum — Kardeşler Köftecisi Gümüşlük',
          'https://www.nowbodrum.com/',
          'editorial',
          'Yalı bölgesinde bütçe dostu yerel köfte durağı kaydı',
        ],
        [
          'Küçük Oteller & Gümüşlük Rehberi — Kardeşler Köftecisi',
          'https://www.gumuslukrehberi.com/',
          'editorial',
          'Tahta masalı çay bahçesi tarzı samimi yapı ve balık restoranlarına ekonomik alternatif vurgusu',
        ],
        [
          'Yemeksepeti — Kardeşler Köftecisi Gümüşlük',
          'https://www.yemeksepeti.com/',
          'community',
          'Ekmek arası köfte, yoğurtlu soslu köfte, ızgara köfte menüleri ve fiyat-performans yorumları',
        ],
        [
          'Yaka.la & Yandex Maps — Kardeşler Köftecisi',
          'https://yaka.la/',
          'community',
          'Özel salça soslu ekmek arası köfte, kasap sucuğu tost ve 5120. Sk. adres doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=11651069760094628379',
          'maps',
          '5120. Sk. Yalı Mevkii 48/6 konum doğrulaması',
        ],
      ],
      pros: [
        'Gümüşlük sahilindeki yüksek fiyatlı restoranlara karşı gerçek ekonomik sokak lezzeti alternatifi',
        'Hem editoryal rehberler hem Yemeksepeti ve yerel topluluk kayıtlarıyla güçlü doğrulama',
      ],
      cons: [
        'Salaş ve sade sokak arası oturumu nedeniyle restoran konforu sunmuyor',
        'Porsiyon boyutları büyük iştahlılar için tek başına küçük gelebiliyor',
      ],
      unc: ['Paket servis saatleri ve sos yoğunluğu yoğun günlere göre değişebiliyor'],
    }),

    compactSeed({
      id: 'cafe-bien-gumusluk',
      placeId: 'ChIJRR2GZsR1vhQRrwcoTtlxGHE',
      cat: 'denemelisin',
      secondaryCategoryIds: ['date'],
      brand: 'cafe bien',
      area: 'Kırçiçeği Sk. (Yalı Sahil), Gümüşlük',
      signals: ['caz_ve_akustik_sahne', 'imza_kokteyl_bari', 'ankara_koklu_marka', 'gece_hayati'],
      verifiedAt: '2026-11-16',
      desc: "Ankara'nın köklü müzik ve sosyal mekanı Cafe Bien'in Gümüşlük Kırçiçeği Sokak'taki şubesi; gündüz sahil içeceği ve kahve servisi, akşamları ise caz, akustik ve alternatif canlı müzik eşliğinde kokteyl bar deneyimi sunar.",
      order: ['İmza Kokteyller', 'Klasik Kokteyl Seçkisi', 'Gündüz Kahve Molası'],
      menu: [
        'İmza Kokteyller',
        'Klasik Kokteyller',
        'Şarap ve Bira Çeşitleri',
        'Sıcak ve Soğuk Kahveler',
      ],
      sec: [
        [
          'Canlı Caz, Akustik ve DJ Sahne Geceleri',
          'Akşam saatlerinden gece yarısı sonrasına kadar uzanan canlı performans programıyla öne çıkar.',
          'BizimCaz ve BodrumGuru kayıtları',
        ],
      ],
      seat: 'Sahil ve bahçe bağlantılı bar masaları ile sahne çevresi oturumu',
      crowd: 'Gündüzleri sakin sahil temposunda, akşamları canlı müzik ve konser günlerinde hareketli',
      dis: 'Yemek odaklı bir mutfağı yoktur; konser akşamlarında müzik veya giriş ücreti yansıtılabiliyor',
      transit: 'Gümüşlük Kırçiçeği Sokak No:2/1 adresinde, sahil yürüyüş aksının güney tarafında',
      sources: [
        [
          'Bodrum Guru — Cafe Bien Gümüşlük',
          'https://www.bodrumguru.com/',
          'editorial',
          'Ankara kökenli markanın Gümüşlük sahnesi, caz-akustik-alternatif rock geceleri ve gece çalışma düzeni',
        ],
        [
          'BizimCaz & Müdavim — Cafe Bien Gümüşlük',
          'https://www.bizimcaz.com/',
          'editorial',
          'Kırçiçeği Sokak No:2/1 adres ve canlı müzik etkinlik programı kaydı',
        ],
        [
          'MyGuideBodrum — Cafe Bien Gümüşlük',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Mutfak yerine zengin bar, kokteyl, şarap ve kahve formatı doğrulaması',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=8149388703860000687',
          'maps',
          'Gümüşlük, Kırçiçeği Sk. 2/1 konum doğrulaması',
        ],
      ],
      pros: [
        'Gümüşlük gecelerinde nitelikli caz, akustik ve alternatif müzik dinlenebilen az sayıdaki bar',
        'Güçlü kokteyl seçkisi ve sahil erişimli sosyal atmosfer',
      ],
      cons: [
        'Kapsamlı akşam yemeği mutfağı bulunmadığından yemek sonrası içecek ve müzik için daha uygun',
        'Etkinlik gecelerinde ek müzik ücreti veya rezervasyon şartı olabiliyor',
      ],
      unc: ['Sezonluk yaz operasyonu olduğundan bahar/kış dönemi açık durumu kontrol edilmeli'],
    }),

    compactSeed({
      id: 'fenercinin-gizi-gumusluk',
      placeId: 'ChIJCX2JgPZ1vhQRdG6GGvNg2Y8',
      cat: 'denemelisin',
      brand: 'fenerci',
      area: '5233. Cd., Gümüşlük',
      signals: ['butik_pastane', 'ozel_tasarim_pasta', 'bahce_brunch', 'ev_yapimi_unlu_mamul'],
      verifiedAt: '2026-11-16',
      desc: "Gümüşlük 5233. Cadde üzerinde keyifli bahçesinde hizmet veren; taze ekmekleri, ev yapımı kurabiyeleri, özel tasarım pastaları ve gün boyu tatlı-hamur işi çeşitleriyle bilinen butik fırın ve pastane.",
      order: ['Günlük Kek ve Tart Çeşitleri', 'Özel Tasarım Pastalar', 'Taze Ekmek ve Unlu Mamuller'],
      menu: [
        'Özel Tasarım Pastalar',
        'Ev Yapımı Kek ve Tartlar',
        'Taze Ekmek Çeşitleri',
        'Tatlı ve Tuzlu Kurabiyeler',
        'Fırın Brunch Seçenekleri',
        'Dondurma ve İçecekler',
      ],
      sec: [
        [
          'Bahçede Hafif Fırın Brunch Molası',
          'Gün içinde taze pişmiş tuzlu unlu mamullerle bahçe masalarında sakin bir mola imkanı sunar.',
          'Gümüşlük Rehberi ve BodrumGuru kayıtları',
        ],
      ],
      seat: 'Doğal malzemelerle hazırlanmış bahçe oturma alanı ve tezgah siparişi',
      crowd: 'Sabah ve öğleden sonra tatlı-pasta alışverişi yapan mahalle sakinleri ve tatilcilerle sakin',
      dis: 'Sahil bandından uzakta Turgutreis–Gümüşlük bağlantı caddesi üzerinde kalıyor',
      transit: 'Gümüşlük 5233. Cadde No:17/5 (Turgutreis Cd. dolmuş güzergahı) üzerinde kolay araç ve dolmuş erişimli',
      sources: [
        [
          'Gümüşlük Rehberi — Fenerci’nin Gızı',
          'https://www.gumuslukrehberi.com/',
          'editorial',
          'Tasarım pastalar, kekler, taze ekmekler, doğal malzeme kullanımı ve bahçe atmosferi kaydı',
        ],
        [
          'Bodrum Guru & BodrumdaYaşam — Fenerci’nin Gızı',
          'https://www.bodrumguru.com/',
          'editorial',
          'Butik fırın, pastane ve bahçe brunch durağı önerisi',
        ],
        [
          'Yandex Maps — Fenerci’nin Gızı',
          'https://yandex.com.tr/',
          'community',
          '5233. Cadde No:17/5 adres ve tatlı/pasta lezzet memnuniyeti',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=10365422614608244340',
          'maps',
          'Gümüşlük, 5233. Cd. no:17/5 konum doğrulaması',
        ],
      ],
      pros: [
        'Bölgede taze günlük pasta, tart ve doğal malzemeli unlu mamul arayanlar için köklü butik adres',
        'Bahçeli samimi atmosfer ve dolmuş güzergahı üzerinde kolay erişim',
      ],
      cons: [
        'Sahildeki yürüyüş aksının uzağında kaldığı için araç veya dolmuşla uğramak gerekiyor',
        'Kapsamlı sıcak yemek veya serpme kahvaltı yerine fırın/pastane odağında kalıyor',
      ],
      unc: ['Özel sipariş tasarım pastalar için önceden iletişim kurulması gerekiyor'],
    }),

    compactSeed({
      id: 'mayhos-gumusluk',
      placeId: 'ChIJgczgpfJ1vhQRh87ihLcuTeg',
      cat: 'denemelisin',
      brand: 'mayhos',
      area: 'Cumhuriyet Cd., Gümüşlük',
      signals: ['artizan_ekmek_ve_pasta', 'callebaut_cikolata', 'eksi_maya_brioche', 'butik_firin'],
      verifiedAt: '2026-11-16',
      desc: "Cumhuriyet Caddesi üzerinde nitelikli çikolata ve ekşi maya brioche hamuruyla çalışan; ekşi mayalı ekmekler, limonlu tart, tarçınlı rulo, entremet pastalar ve fudge brownie üreten artizan fırın-pastane.",
      order: ['Limonlu Tart (Limon Curd)', 'Tarçınlı Rulo (Cinnamon Roll)', 'Bitter Çikolatalı Fudge Brownie'],
      menu: [
        'Ekşi Mayalı Ekmek Çeşitleri',
        'Ekşi Maya Brioche Ürünleri',
        'Limonlu Tart',
        'Profiterol',
        'Mango ve Kahveli Entremetler',
        'Cinnamon Roll (Tarçınlı Rulo)',
        'Elmalı ve Orman Meyveli Crumble Bar',
        'Bitter Fudge Brownie ve Çikolatalı Cookie',
      ],
      sec: [
        [
          'Ekşi Mayalı Ekmekler ve Crumble Barlar',
          'Günlük çıkan ekşi maya ekmekler ile meyveli crumble barlar paket alımlarda öne çıkar.',
          'Menum.co ve Yemeksepeti menü kayıtları',
        ],
      ],
      seat: 'Sınırlı kapasiteli butik dükkan düzeni; gel-al ve paket sipariş ağırlıklı',
      crowd: 'Sabah ve öğle saatlerinde mahalle sakinlerinin ekmek ve tatlı alışverişiyle hareketli',
      dis: 'Oturma alanı oldukça kısıtlı olduğu için kalabalık günlerde yer bulmak zor olabiliyor ve akşamüstü geç saatlerde kapanıyor',
      transit: 'Gümüşlük Cumhuriyet Caddesi No:85/2 adresinde, Gümüşlük merkez içi cadde üzerinde',
      sources: [
        [
          'Menum.co — Mayhoş Gümüşlük',
          'https://menum.co/',
          'operator',
          'Artisan bakery konsepti, Callebaut çikolata kullanımı, ekşi mayalı ekmek ve brioche üretimi',
        ],
        [
          'Yemeksepeti — Mayhoş Gümüşlük Menü',
          'https://www.yemeksepeti.com/',
          'community',
          'Profiterol, limonlu tart, entremetler, cinnamon roll, crumble bar ve fudge brownie menü doğrulaması',
        ],
        [
          'Yandex Maps — Mayhoş Gümüşlük',
          'https://yandex.com.tr/',
          'community',
          'Cumhuriyet Cd. No:85/2 konumu, ürün tazeliği ve dengeli şeker oranı değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=16739086755749351047',
          'maps',
          'Gümüşlük, Cumhuriyet Cd. No:85/2 konum doğrulaması',
        ],
      ],
      pros: [
        'Gümüşlük merkezde nitelikli çikolata ve ekşi maya teknikleriyle üretim yapan modern artizan pastane',
        'Aşırı şekerli olmayan dengeli tatlı profili ve taze ekmek seçeneği',
      ],
      cons: [
        'Oturma alanı kısıtlı olduğundan daha çok gel-al ve paket alışverişe uygun',
        'Akşam yemeği saatlerinden önce kapanabiliyor',
      ],
      unc: ['Haftanın başlangıç günü olan pazartesi kapanış düzeni sezona göre değişebiliyor'],
    }),

    // ==================== 7. BALIKÇILAR ====================
    compactSeed({
      id: 'karafaki-erhan-usta-gumusluk',
      placeId: 'ChIJS2zohEB1vhQR0I555fjQzA0',
      cat: 'balik',
      brand: 'erhan usta',
      area: 'Yalı Mevkii No:68 (Sahil), Gümüşlük',
      signals: ['1983_usta_gecmisi', 'denize_sifir_gun_batimi', 'pasa_mezesi', 'tuzda_balik'],
      verifiedAt: '2026-11-16',
      desc: "1983'ten beri Gümüşlük sahilinde mutfaktan yetişme Erhan Usta ve kızı tarafından No:68'de yönetilen; denize sıfır gün batımı masalarında taze mezeler, kalamar, ahtapot ve tuzda balık sunan köklü balıkçı.",
      order: ['Paşa Mezesi ve Deniz Börülcesi', 'Izgara Ahtapot ve Kalamar', 'Tuzda veya Izgara Günlük Balık'],
      menu: [
        'Paşa Mezesi',
        'Atom, Fava ve Deniz Börülcesi',
        'Baron ve Zaho Mezeleri',
        'Kalamar Tava ve Izgara',
        'Ahtapot Izgara',
        'Tarakta Karides ve Karides Güveç',
        'Günlük Tekne Balıkları (Mercan, Levrek, Çipura)',
        'Tuzda Balık',
      ],
      sec: [
        [
          'Tarakta Karides ve Deniz Mahsullü Kroket',
          'Meze tezgahından sonra masa sıcakları için sıkça tercih edilen ara sıcaklardır.',
          'BodrumFinder ve Wanderlog kayıtları',
        ],
      ],
      seat: 'Yalı Mevkii No:68 önünde suya sıfır sahil masaları ve iç oturma alanı',
      crowd: 'Gün batımı ve akşam servisinde oldukça yoğun; sezon boyunca rezervasyonsuz yer bulmak zor',
      dis: 'Bütçe seviyesi yüksektir; balık gramajı ve meze fiyatları önceden sorulmalı ve aynı sokaktaki adaş Karafaki ile karıştırılmamalıdır',
      transit: 'Gümüşlük Yalı Mevkii No:68 adresinde, sahil yürüyüş bandının uç kısmında',
      sources: [
        [
          'Karafaki Erhan Usta Resmi Sitesi',
          'http://karafakierhanusta.com/',
          'operator',
          'Erhan Usta marka tescili, Yalı Mevkii No:68 adres ve deniz ürünleri odağı',
        ],
        [
          'Mes Prestiges — Karafaki Erhan Usta',
          'https://www.mesprestiges.com/',
          'editorial',
          '1983 yılından bu yana Gümüşlük deneyimi, sabah teknelerinden günlük balık ve suya sıfır gün batımı masaları',
        ],
        [
          'BodrumFinder — Karafaki Erhan Usta Farkı',
          'https://bodrumfinder.com/',
          'editorial',
          'No:68 Erhan Usta ve kızı Ceyda yönetimi, Paşa Mezesi, tuzda balık ve adaş Karafaki işletmesinden ayrım bilgisi',
        ],
        [
          'Wanderlog — Karafaki Erhan Usta',
          'https://wanderlog.com/',
          'community',
          'Kalamar, ahtapot, meze tazeliği ve fiyatların sipariş öncesi teyit edilmesi önerisi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=994399385162452688',
          'maps',
          'Gümüşlük Yalı Mevkii No:68 konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Sahildeki adaş mekanlara kıyasla usta ve aile gözetimiyle puan istikrarını koruyan köklü balıkçı',
        'Kalamar-ahtapot pişirim kıvamı, zengin meze dolabı ve suya sıfır gün batımı manzarası',
      ],
      cons: [
        'Üst bütçe segmentinde yer alıyor; gramajlı balık siparişinde hesap önceden netleştirilmeli',
        'Aynı sahil bandındaki diğer Karafaki tabelasıyla karıştırılabiliyor (No:68 tabelasına dikkat)',
      ],
      unc: ['Günlük balık çeşitleri tekne avına ve mevsime göre değişmektedir'],
    }),

    compactSeed({
      id: 'ali-rizanin-yeri-gumusluk',
      placeId: 'ChIJz4HEmK91vhQRVZF66DJSxiA',
      cat: 'balik',
      brand: 'ali riza',
      area: '1120. Sk. No:56/1 (Yalı Sahil), Gümüşlük',
      signals: ['koklu_aile_balıkcisi', 'gunluk_tekne_avi', 'suya_sifir_masalar', 'rustik_gumusluk'],
      verifiedAt: '2026-11-16',
      desc: "1960'lı yıllardan bu yana aynı aile çizgisini sürdüren; tekneler o gün ne getirdiyse sade ızgarada pişiren, ahtapot salatası, kalamarı ve bahçeden gelen Ege otlarıyla rustik bir sahil balıkçısı.",
      order: ['Ahtapot Izgara & Salatası', 'Günlük Sade Izgara Balık', 'Ege Otları ve Bahçe Mezeleri'],
      menu: [
        'Günlük Tekne Balıkları (Levrek, Çipura)',
        'Ahtapot Izgara ve Ahtapot Salatası',
        'Kalamar Tava ve Izgara',
        'Ege Otları ve Zeytinyağlı Mezeler',
        'Salatalar',
      ],
      sec: [
        [
          'Kalamar ve Günlük Ege Otları',
          'Ana balık öncesi bahçeden gelen taze ot kavurmaları ve kalamar ikilisi sıkça tercih edilir.',
          'Mes Prestiges ve Yandex kayıtları',
        ],
      ],
      seat: 'Yalı kıyısında suya neredeyse sıfır ahşap sahil masaları ve sade düzen',
      crowd: 'Gün batımı saatlerinden geceye kadar sakin ama düzenli müdavim yoğunluğuna sahip',
      dis: 'Üst segment fiyatlama geçerlidir; gösterişsiz ve rustik yapıda olduğundan lüks servis bekleyenlere uygun değildir',
      transit: 'Gümüşlük 1120. Sokak No:56/1 adresinde, Yalı sahil şeridinin kalbinde yaya yolu üzerinde',
      sources: [
        [
          'Mes Prestiges — Balıkçı Ali Rıza’nın Yeri',
          'https://www.mesprestiges.com/',
          'editorial',
          '1960–1970 kökenli aile işletmesi, günlük tekne avı, ahtapot salatası ve ahşap su kenarı masaları',
        ],
        [
          'MyGuideBodrum & Müdavim — Ali Rıza’nın Yeri',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Nostaljik Gümüşlük balıkçısı, sade ızgara balık ve rezervasyon önerisi kaydı',
        ],
        [
          'Yandex Maps — Ali Rıza’nın Yeri Gümüşlük',
          'https://yandex.com.tr/',
          'community',
          'Aile sıcaklığı, meze tazeliği ve yüksek fiyat değerlendirmeleri',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=2361665433204592981',
          'maps',
          'Gümüşlük, 1120. Sk. 56/1 konum doğrulaması',
        ],
      ],
      pros: [
        'Gümüşlük’ün eski balıkçı kasabası ruhunu koruyan yarım asırlık aile işletmesi',
        'Gösterişten uzak sade ızgara tekniği ve ayakların suya yakın olduğu sahil masaları',
      ],
      cons: [
        'Sahil hattı genelinde olduğu gibi hesap seviyesi yüksek çıkabiliyor',
        'Yaz gün batımında rezervasyonsuz masa bulmak güç',
      ],
      unc: ['Menü günlük tekne avına bağlı olarak sınırlı ve değişken kalabiliyor'],
    }),

    compactSeed({
      id: 'gumusluk-balik-evi',
      placeId: 'ChIJ2wDcd6Z1vhQRPEXmGZy7BZE',
      cat: 'balik',
      brand: 'gumusluk balik',
      area: '1135. Sk. (Çarşı İçi), Gümüşlük',
      signals: ['balik_pisirme_evi', 'tezgahtan_secim', 'makul_fiyat_dengesi', 'otobus_duragi_yani'],
      verifiedAt: '2026-11-16',
      desc: "Gümüşlük 1135. Sokak'ta son durak yakınında konumlanan; tezgahtan günlük seçilen taze balıkları ızgara ya da tava olarak pişirtip Ege mezeleri eşliğinde yiyebileceğiniz samimi balık pişirme evi.",
      order: ['Tezgahtan Seçme Izgara Balık (Levrek / Çipura)', 'Kalamar ve Karides Ara Sıcak', 'Ege Otları ve Soğuk Mezeler'],
      menu: [
        'Günlük Çipura, Levrek ve Barbun',
        'Izgara veya Tava Balık Pişirme',
        'Kalamar ve Karides',
        'Zeytinyağlı Ege Otları',
        'Soğuk Meze Seçkisi',
        'Paket Çiğ veya Pişmiş Balık',
      ],
      sec: [
        [
          'Paket Pişmiş Balık ve Tezgah Alımı',
          'Evde yemek isteyenler için de aynı taze balıkları tezgahtan alıp pişirtme imkanı sunar.',
          'Gümüşlük Rehberi ve Meyhanedeyiz kayıtları',
        ],
      ],
      seat: 'Çarşı içinde sıcak aile işletmesi masaları ve taze balık teşhir tezgahı',
      crowd: 'Akşam yemeklerinde mahalle sakinleri ve aşırı turistik kalabalıktan kaçan ziyaretçilerle dengeli',
      dis: 'Deniz sıfırı gün batımı manzarası yoktur; bazı ziyaretçiler meze porsiyonlarını küçük bulabiliyor ve pik sezonda servis yavaşlayabiliyor',
      transit: 'Gümüşlük 1135. Sokak No:1/D:1 adresinde, otobüs ve minibüs son duraklarının hemen yanında',
      sources: [
        [
          'Gümüşlük Rehberi — Balık Pişirme Evi',
          'https://gumusluk.com/r/balik-pisirme-evi/',
          'operator',
          'Minibüs son durakları yanı konumu, tezgahtan günlük balık seçimi ve pişirme evi düzeni',
        ],
        [
          'Meyhanedeyiz — Gümüşlük Balık Evi',
          'https://meyhanedeyiz.biz/',
          'editorial',
          '1135. Sk. No:1 adresi, meze-ara sıcak eşlikçileri ve rezervasyon bilgisi',
        ],
        [
          'Wanderlog & Yandex Maps — Gümüşlük Balık Evi',
          'https://wanderlog.com/',
          'community',
          'Sahil restoranlarına kıyasla daha makul fiyat dengesi, balık tazeliği ve küçük meze porsiyonu notları',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=10449964789506917692',
          'maps',
          'Gümüşlük, 1135. Sk. No:1 D:1 konum doğrulaması',
        ],
      ],
      pros: [
        'Kıyı şeridindeki fahiş turistik hesaplar olmadan taze günlük balık ve meze deneyimi',
        'Hem yerinde rakı-balık sofrası hem eve pişmiş balık alma esnekliği',
      ],
      cons: [
        'Sahil cephesinde olmadığı için deniz ve gün batımı manzarası bulunmuyor',
        'Yoğun yaz akşamlarında servis temposu düşebiliyor ve meze tabakları görece küçük kalabiliyor',
      ],
      unc: ['Sezon içi masa rezervasyonu özellikle hafta sonları gerekebiliyor'],
    }),

    compactSeed({
      id: 'reis-balik-gumusluk',
      placeId: 'ChIJU85Jae50vhQRJGUrB4hlf0c',
      cat: 'balik',
      brand: 'reis balik',
      area: 'Yalı Mevkii (Sahil), Gümüşlük',
      signals: ['sahil_balık_sofrası', 'ege_mezeleri', 'gun_batimi_masalari', 'mevsim_baliklari'],
      verifiedAt: '2026-11-16',
      desc: "Gümüşlük Yalı kıyısında açık hava ve iç mekan masalarıyla hizmet veren; mevsim balıkları, klasik Ege zeytinyağlı mezeleri ve deniz mahsullü ara sıcaklarıyla sahil balık sofrası kuran işletme.",
      order: ['Mevsim Balıkları Izgara', 'Kalamar ve Karides Güveç', 'Klasik Ege Mezeleri'],
      menu: [
        'Günlük Mevsim Balıkları',
        'Kalamar ve Karides Güveç',
        'Deniz Börülcesi ve Şevketi Bostan',
        'Fava ve Atom',
        'Salatalar',
      ],
      sec: [
        [
          'Kiremitte ve Tereyağlı Deniz Mahsulleri',
          'Balık ana yemeği yanında masaya paylaşımlık sıcak başlangıç olarak sipariş edilir.',
          'Bodrum Mekanları ve MyGuideBodrum kayıtları',
        ],
      ],
      seat: 'Sahil bandında açık hava ve kapalı mekan masa düzeni',
      crowd: 'Akşamüstü gün batımı ve akşam yemeği saatlerinde sahil temposuyla uyumlu hareketli düzen',
      dis: 'Gümüşlük sahilindeki pek çok balıkçıda olduğu gibi fiyat algısı yüksektir ve Yalıkavak’taki adaş mekanla karıştırılmamalıdır',
      transit: 'Gümüşlük Yalı sahil şeridi üzerinde, son duraktan kıyıya birkaç dakikalık yürüyüş mesafesinde',
      sources: [
        [
          'Bodrum Mekanları — Reis Balık Gümüşlük',
          'https://www.bodrummekanlari.com/',
          'editorial',
          'Gümüşlük sahilinde deniz ürünleri, meze ve rakı-balık sofrası rehber kaydı',
        ],
        [
          'MyGuideBodrum — Reis Balık Gümüşlük',
          'https://www.myguidebodrum.com/',
          'editorial',
          'Açık ve kapalı oturma alanı ile Gümüşlük balık restoranı listelemesi',
        ],
        [
          'Dijital Link / Yerel İşletme Kaydı — Reis Balık Gümüşlük',
          'https://dijital.link/',
          'community',
          'Yalıkavak’taki adaş işletmeden ayrı olarak Gümüşlük şube ve menü odağı teyidi',
        ],
        [
          'Google Maps Canlı Kayıt',
          'https://maps.google.com/?cid=5151948133645378852',
          'maps',
          'Gümüşlük Yalı Mevkii konum ve operasyon doğrulaması',
        ],
      ],
      pros: [
        'Gümüşlük sahil yürüyüş aksında klasik meze ve mevsim balığı deneyimi',
        'Açık ve kapalı oturma alanı seçeneğiyle akşam servisine uygun yapı',
      ],
      cons: [
        'Sahil bölgesi fiyat seviyesi ziyaretçilere yüksek gelebiliyor',
        'Yalıkavak’taki aynı adlı başka bir balıkçıyla sıkça karıştırılıyor',
      ],
      unc: ['Sezon dışı dönem çalışma saatleri ve güncel tezgah çeşitliliği işletmeden teyit edilmeli'],
    }),

    // ==================== NEGATİF DENETİM KONTROLLERİ ====================
    // Kapı 1 — Geçici/Kalıcı Kapalı İşletme
    negControl(
      'ctrl-limon-gumusluk',
      'ChIJNcwJIKJ1vhQRx77eJ4VuNp8',
      'date',
      'Kapı 1 ihlali: LİMON GÜMÜŞLÜK RESTAURANT Google Places durumu CLOSED_TEMPORARILY (ve ★4.3)'
    ),

    // Kapı 2 — Zincir & Franchise Kontrolleri
    negControl(
      'ctrl-starbucks-turgutreis',
      'ChIJ23YWapELvhQRr6MpnOPRaMU',
      'kahve',
      'Kapı 2 & Kapı 4 ihlali: Starbucks küresel zincir (CHAIN_BLOCKLIST) ve Turgutreis bbox dışı'
    ),
    negControl(
      'ctrl-bigchefs-turgutreis',
      'ChIJuX522n0LvhQR-XcAjHuFh6A',
      'date',
      'Kapı 2 & Kapı 4 ihlali: Big Chefs ulusal zincir (CHAIN_BLOCKLIST) ve Turgutreis bbox dışı'
    ),
    negControl(
      'ctrl-battalbey-gumusluk',
      'ChIJUWHYjNN1vhQR_j98Hh4Puz0',
      'denemelisin',
      'Kapı 2 & Kapı 6 ihlali: Battalbey Çiğköfte ulusal franchise bayisi ve ★3.4 (5) ile kalite eşiğinin altında'
    ),

    // Kapı 3 & 3B — Tür Dışı (Otel/Mağaza) ve Saf Kahveci İhlalleri
    negControl(
      'ctrl-metins-hotel-gumusluk',
      'ChIJTyhOR-10vhQRugeKxp4chBc',
      'date',
      'Kapı 3 & Kapı 6 ihlali: Metin’s Gümüşlük primaryType hotel (★4.1)'
    ),
    negControl(
      'ctrl-kofteci-kemal-gumusluk',
      'ChIJkW9zVO50vhQRvwN_uCRMUR0',
      'denemelisin',
      'Kapı 3 ihlali: Köfteci Kemal Google Places primaryType=store, FOOD_PLACE_TYPES dışında'
    ),
    negControl(
      'ctrl-gumusluk-firin-pastane',
      'ChIJh4zEubt1vhQRBkNwhfyfNfM',
      'kahve',
      'Kapı 3B & Kapı 6 ihlali: Gümüşlük Fırın Pastane bakery türü (saf kahveci değil) ve ★3.3 puanı'
    ),

    // Kapı 6 — Düşük Puan (<4.4) ve Yetersiz Değerlendirme (<35) Kontrolleri
    negControl(
      'ctrl-mimoza-gumusluk',
      'ChIJh55zKPB0vhQRb8ggoPV-Knk',
      'balik',
      'Kapı 6 ihlali: Mimoza Gümüşlük Restaurant ★3.4 (1580) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-melengec-gumusluk',
      'ChIJN_9LJfB0vhQRsxFEE28VHEU',
      'balik',
      'Kapı 6 ihlali: Melengeç Balık Restaurant ★3.7 (1798) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-karafaki-37-gumusluk',
      'ChIJVUESbO50vhQRML0Mvadh06Y',
      'balik',
      'Kapı 6 ihlali: Karafaki (1120. Sk. No:62) ★3.7 (510) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-tuz-duman-gumusluk',
      'ChIJJ2pWFgx1vhQRVJUq3BDn5X8',
      'date',
      'Kapı 6 ihlali: Tuz Duman ★4.1 (438) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-club-gumusluk',
      'ChIJJ5F8-e50vhQRvWsBJY3v4v4',
      'date',
      'Kapı 6 ihlali: Club Gümüşlük ★4.1 (988) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-zeytun-balik-gumusluk',
      'ChIJiUC2VO50vhQRqej5s3b1WQk',
      'balik',
      'Kapı 6 ihlali: Zeytun Balık Restaurant ★4.1 (474) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-nazmi-gumusluk',
      'ChIJ____v-10vhQReGCcotDpnJU',
      'balik',
      'Kapı 6 ihlali: Nazmi Restaurant ★4.1 (310) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-satsuma-gumusluk',
      'ChIJ1VHx7e50vhQRaebdywwhzgQ',
      'date',
      'Kapı 6 ihlali: Satsuma Gümüşlük ★3.8 (139) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-okyanus-gumusluk',
      'ChIJQ8iZS-50vhQRnXqf0zhtER0',
      'balik',
      'Kapı 6 ihlali: Okyanus Restaurant Gümüşlük ★3.6 (355) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-victorias-koyunbaba',
      'ChIJ7acXD_Z0vhQR5PaL8bTYsck',
      'date',
      'Kapı 6 ihlali: Victoria’s (Koyunbaba) ★3.9 (189) puanı 4.4 tabanının altında'
    ),
    negControl(
      'ctrl-cilli-pizza-gumusluk',
      'ChIJS1kLrDt1vhQRgymb2CXtZQs',
      'pizza',
      'Kapı 6 ihlali: Çilli Pizza yalnızca 22 değerlendirme ile 35 alt sınırının altında'
    ),
    negControl(
      'ctrl-myndos-pizza-gumusluk',
      'ChIJb7JIWQF1vhQRrxgYMXGtf-Q',
      'pizza',
      'Kapı 6 ihlali: Myndos Pizza&Pide yalnızca 19 değerlendirme ile 35 alt sınırının altında'
    ),
    negControl(
      'ctrl-sisko-burger-gumusluk',
      'ChIJh58YRrJ1vhQRaCO95VnY2XI',
      'hamburger',
      'Kapı 6 ihlali: Şişko Burger Tost yalnızca 1 değerlendirme ile 35 alt sınırının altında'
    ),
    negControl(
      'ctrl-armut-coffee-gumusluk',
      'ChIJczQNRAB1vhQRwiOtxHy3mns',
      'kahve',
      'Kapı 6 ihlali: Armut Coffee yalnızca 5 değerlendirme ile 35 alt sınırının altında'
    ),

    // Kapı 8 — <150 Değerlendirmede ≥4.8 Şişirilmiş Puan / Yetersiz Bağımsız Kanıt Kontrolü
    negControl(
      'ctrl-gumus-ev-yemekleri',
      'ChIJvWk2q7p1vhQRruK1pS9GsBg',
      'denemelisin',
      'Kapı 8 ihlali: Gümüş Ev Yemekleri ★5.0 (65) için sahildeki adaş işletmeden ayrışan ≥2 bağımsız editöryal/topluluk kanıtı yetersiz'
    ),

    // Kapı 4 — Dış Mahalle & Komşu Belde Sınır Kontrolleri
    negControl(
      'ctrl-zest-burger-bahcelievler',
      'ChIJ5aF_VThtvhQRrvoIW7pNdxY',
      'hamburger',
      'Kapı 4 ihlali: ZEST BURGER Bahçelievler (Turgutreis) Mahallesi ve Gümüşlük bbox dışında'
    ),
    negControl(
      'ctrl-milanz-crispy-bahcelievler',
      'ChIJY8ylsMULvhQRcl1QAXy9I7A',
      'hamburger',
      'Kapı 4 ihlali: MILANZ CRİSPY Bahçelievler (Turgutreis) Mahallesi ve Gümüşlük bbox dışında'
    ),
    negControl(
      'ctrl-degirmen-turgutreis',
      'ChIJJ34LkVwLvhQRlInbfbZC6Qk',
      'denemelisin',
      'Kapı 4 ihlali: Değirmen Lokantası Turgutreis Mahallesi ve Gümüşlük bbox dışında'
    ),
    negControl(
      'ctrl-zerde-peksimet',
      'ChIJJ8Wt0at0vhQR-YmjZC96Wcs',
      'kahvalti',
      'Kapı 4 ihlali: Zerde Peksimet Mahallesi ve Gümüşlük bbox dışında'
    ),
    negControl(
      'ctrl-cotto-kadikalesi',
      'ChIJlxNwV7d0vhQRX-EhmHjxLXA',
      'date',
      'Kapı 4 ihlali: Cotto Cafe Kadikalesi Bahçelievler Mahallesi ve Gümüşlük bbox dışında'
    ),
    negControl(
      'ctrl-zeytin-alti-geris',
      'ChIJCU4ZQNd1vhQRc1mcplg0u5A',
      'kahvalti',
      'Kapı 4 ihlali: Zeytin Altı Yalıkavak Geriş Mahallesi ve Gümüşlük bbox dışında'
    ),
    negControl(
      'ctrl-gunes-manti-karabag',
      'ChIJCzzSCgANvhQRcXoGfZS4f5A',
      'denemelisin',
      'Kapı 4 ihlali: Güneş Mantı Karabağ Mahallesi ve Gümüşlük bbox dışında'
    ),
    negControl(
      'ctrl-burcak-firin-karabag',
      'ChIJPcQi2TULvhQRSJ2aoFd38P8',
      'kahvalti',
      'Kapı 4 ihlali: Burçak Fırın Karabağ Mahallesi ve Gümüşlük bbox dışında'
    ),
  ],
};
