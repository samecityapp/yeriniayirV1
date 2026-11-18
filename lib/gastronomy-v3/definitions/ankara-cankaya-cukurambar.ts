import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ANKARA_CANKAYA_CUKURAMBAR_DEF: V3RegionDefinition = {
  id: 'ankara-cankaya-cukurambar',
  slug: 'cukurambar',
  city: 'Ankara',
  district: 'Çankaya',
  allowedDistricts: ['Çankaya', 'Çukurambar'],
  neighborhood: 'Çukurambar',
  officialQuarter:
    'Çukurambar & Kızılırmak Mahalleleri (Muhsin Yazıcıoğlu Caddesi, Ufuk Üniversitesi Caddesi, 1424–1443. Caddeler, Malcolm X Cd., Öğretmenler Cd. & 1450. Sokak Aksları)',
  displayName: 'Çukurambar, Çankaya, Ankara',
  locative: "Çukurambar'da",
  path: ['ankara', 'cankaya', 'cukurambar'],
  aliases: [
    'Çukurambar',
    'Cukurambar',
    'Çukurambar Ankara',
    'Çukurambar Çankaya',
    'Muhsin Yazıcıoğlu',
    'Muhsin Yazıcıoğlu Caddesi',
    'Kızılırmak Çukurambar',
    'Kızılırmak Ankara',
    'Ufuk Üniversitesi Caddesi',
  ],
  scopeNote:
    'Çukurambar & Kızılırmak (Muhsin Yazıcıoğlu Cd., Ufuk Üniversitesi Cd. & 1443. Cd.; Söğütözü, Balgat, Oğuzlar ve İşçi Blokları/100. Yıl hariç) · Doğrulanmış Seçki',
  characterSubtitle:
    'Muhsin Yazıcıoğlu ve Ufuk Üniversitesi caddelerinden 1071 aksına, Besa Kule ve Cubes’a yayılan; ince hamurlu gurme pizza, tütsülenmiş BBQ & burger noktası, üçüncü dalga özel kahveciler, serpme kahvaltıcı, esnaf aile kebapçısı, tencere et lokantası ve Karadeniz balık mutfağı.',
  center: { lat: 39.9045, lng: 32.8065 },
  bbox: { minLat: 39.8965, maxLat: 39.9110, minLng: 32.7945, maxLng: 32.8145 },
  allowedNeighborhoodTokens: [
    'Çukurambar',
    'Cukurambar',
    'Kızılırmak',
    'Kizilirmak',
  ],
  categories: buildRegionCategories(),
  candidates: [
    // =========================================================================
    // 1. PİZZA (1 nitelikli gurme pizza & İtalyan sandviç durağı — sıfır dolgu)
    // =========================================================================
    compactSeed({
      id: 'cukurambar-vinozza-pizza',
      placeId: 'ChIJwTCz8HdJ0xQRSucpMgEAuSI',
      cat: 'pizza',
      name: 'Vinozza Pizza & Sandwich',
      brand: 'Vinozza',
      area: 'Besa Kule · Muhsin Yazıcıoğlu Cd., Çukurambar',
      signals: ['roastbeef-ve-bresaola-pizza', 'besa-kule', 'ince-hamur-gurme'],
      desc:
        'Besa Kule içinde Muhsin Yazıcıoğlu ve 1480. Sokak kesişiminde roastbeef ve bresaola gibi şarküteri ağırlıklı ince hamur gurme pizzaları ile İtalyan usulü sandviçleriyle ayrışan bağımsız Çukurambar pizzeriası.',
      order: ['Roastbeef / Bresaola Gurme Pizza', 'İtalyan Şarküterili Sandviçler'],
      menu: ['Roastbeef Pizza', 'Bresaola Pizza', 'Margherita', 'Sıcak Sandviçler'],
      sec: [
        [
          'Gurme Şarküterili İtalyan Sandviçler',
          'İnce hamurlu pizzalar yanında iş merkezi temposuna uygun taze şarküteri sandviçleri de tercih edilir.',
          'Şehir rehberleri ve menü kayıtları',
        ],
      ],
      seat: 'Besa Kule plaza dokusunda düzenli, temiz ve öğle-akşam servisli modern salon',
      crowd: 'Zincir pizza markaları dışında malzemesi özenli gurme pizza arayan iş ve mahalle sakinleri',
      dis: 'Plaza kompleksinde yer aldığı için akşam geç saatlerde mahalle sokağı meyhanesi ambiyansı vermez',
      transit: 'Çukurambar Mahallesi Muhsin Yazıcıoğlu Cd. 1480. Sokak No:2B/5 Besa Kule.',
      sources: [
        [
          'Ankara Life Dergisi Vinozza',
          'https://ankaralifedergisi.com/',
          'editorial',
          'Besa Kule konumu, malzeme kalitesi ve gurme İtalyan pizza değerlendirmesi',
        ],
        [
          'Menu-TR Vinozza Pizza',
          'https://www.menu-tr.com/',
          'editorial',
          'Roastbeef, bresaola pizza ve sandviç menüsü doğrulaması',
        ],
      ],
      pros: ['Çukurambar plaza hattında yüksek malzeme kalitesini koruyan nadir bağımsız pizzacı', 'Roastbeef ve bresaola gibi özenli üst malzemeler'],
      cons: ['Plaza katı konumu nedeniyle geleneksel mahalle sokak dokusu sunmuyor'],
      unc: ['Hafta içi öğle iş yoğunluğunda paket ve masa servisi yavaşlayabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 2. HAMBURGER (1 tütsülenmiş et & BBQ burger durağı — zincirler hariç)
    // =========================================================================
    compactSeed({
      id: 'cukurambar-smokey-bbq-burger',
      placeId: 'ChIJz8b6UABJ0xQRrmwxJ7dFnU0',
      cat: 'hamburger',
      name: 'Smokey BBQ&Burger',
      brand: 'Smokey',
      area: 'Cubes · 1424. Cd., Çukurambar',
      signals: ['tutsulenmis-brisket', 'truflu-burger', 'cubes-ankara'],
      desc:
        'Cubes Ankara 1424. Cadde’de uzun saatler tütsülenen brisket (füme et), trüflü burger çeşitleri ve Amerikan barbekü tarzı doyurucu burger porsiyonlarıyla Çukurambar burger zincirlerinden ayrışan et-BBQ durağı.',
      order: ['Smoked Brisket Burger', 'Trüflü Burger & Çıtır Patates'],
      menu: ['Smoked Brisket', 'Trüflü Burger', 'BBQ Burger Çeşitleri', 'Çıtır Patates'],
      sec: [
        [
          'Ağır Ateşte Tütsülenmiş Brisket Seçkisi',
          'Klasik smash veya fast-food köfte dışında tütsülenmiş dana brisket eklentileriyle belirgin lezzet farkı oluşturur.',
          'Restoran incelemeleri ve yerel menü kayıtları',
        ],
      ],
      seat: 'Cubes Ankara içinde samimi ve modern Amerikan BBQ diner düzeni',
      crowd: 'Tütsülenmiş etli, tok ve doyurucu burger arayan Çukurambar ziyaretçileri',
      dis: 'Bütçe seviyesi standart fast-food burgerlerden yukarıdadır; yoğun akşamda porsiyon süresi uzayabilir',
      transit: 'Çukurambar Mahallesi 1424. Cadde Cubes Ankara No:6 İç Kapı:401.',
      sources: [
        [
          'Restoranim Smokey BBQ & Burger',
          'https://www.restoranim.net/',
          'editorial',
          'Smoked Brisket, trüflü burger, doyurucu porsiyon ve samimi atmosfer değerlendirmesi',
        ],
        [
          'Menu-TR Smokey BBQ',
          'https://www.menu-tr.com/',
          'community',
          'Cubes Ankara 1424. Cd. adresi ve Amerikan barbekü menü detayları',
        ],
      ],
      pros: ['Tütsülenmiş brisket ve et kalitesiyle bölgedeki klasik fast-food zincirlerinden ayrışması', 'Doyurucu porsiyonlar'],
      cons: ['Dumanlı ve yoğun BBQ soslu profil hafif burger arayanlara ağır gelebilir'],
      unc: ['Tütsülenmiş et stokları yoğun akşamlarda gün sonunda azalabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 3. KAHVE (%100 saf nitelikli kahveciler)
    // =========================================================================
    compactSeed({
      id: 'cukurambar-hood-coffee',
      placeId: 'ChIJK_Fo8W1J0xQRXrbUIB1gAo4',
      cat: 'kahve',
      name: 'Hood Coffee&BowL&Board Games',
      brand: 'Hood',
      area: '1476. Sk., Çukurambar',
      signals: ['ders-calisma-alani', 'kutu-oyunlari', 'saglikli-bowl'],
      desc:
        'Çukurambar 1476. Sokak’ta ana caddelerin kalabalığından sıyrılan ferah ortamıyla nitelikli üçüncü dalga kahveleri, sağlıklı bowl tabaklarını ve masa başı kutu oyunu kültürünü bir arada sunan tek şubeli mahalle kafesi.',
      order: ['Filtre / Espresso Bazlı Kahveler', 'Taze Tatlılar & Sağlıklı Bowl'],
      menu: ['Espresso & V60 Kahveler', 'Sağlıklı Bowl Çeşitleri', 'Ev Tatlıları'],
      sec: [
        [
          'Çalışma Düzeni & Kutu Oyunu Akşamları',
          'Gündüz saatlerinde ders ve iş odaklanmasına uygun olan ferah masalar akşam arkadaş gruplarının kutu oyunu buluşmalarına dönüşür.',
          'Şehir rehberleri ve menü kayıtları',
        ],
      ],
      seat: 'Sokak içinde ferah, odaklanmaya uygun ve kutu oyunu köşeli masa düzeni',
      crowd: 'Plaza zincirleri yerine mahalle arasında çalışmak veya arkadaşlarıyla sakin vakit geçirmek isteyenler',
      dis: 'Akşam kutu oyunu grupları kalabalıklaştığında sessiz çalışma atmosferi yerini sohbet sesine bırakır',
      transit: 'Çukurambar Mahallesi 1476. Sokak No:4.',
      sources: [
        [
          'Menu-TR Hood Coffee',
          'https://www.menu-tr.com/',
          'editorial',
          '1476. Sk. konumu, kahve-bowl ve odaklanma dostu ferah ortam incelemesi',
        ],
        [
          'Restoranim Hood Coffee',
          'https://www.restoranim.net/',
          'editorial',
          'Kutu oyunları, tatlılar ve üniversite-mahalle buluşması değerlendirmesi',
        ],
        [
          'Yandex Haritalar Hood Coffee',
          'https://yandex.com.tr/',
          'community',
          'Yüksek ziyaretçi memnuniyeti doğrulaması',
        ],
      ],
      pros: ['Çukurambar iş kulelerinden uzak sokak ölçeğinde tek şubeli nitelikli kahveci', 'Gündüz çalışma, akşam kutu oyunu dengesi'],
      cons: ['Akşam oyun masaları yoğunlaştığında sakinlik azalabiliyor'],
      unc: ['Hafta sonu gruplarında masa bulmak için erken saatler avantaj sağlar'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cukurambar-nun-coffee',
      placeId: 'ChIJZ00LI5JP0xQRbAyvCyJPkHs',
      cat: 'kahve',
      name: 'nun coffee',
      brand: 'nun',
      area: '1450. Sk. · Kızılırmak, Çukurambar',
      signals: ['onbes-ulke-arabica', 'gec-saat-acik', 'ucuncu-nesil-sogutozu-hatti'],
      desc:
        'Kızılırmak 1450. Sokak’ta on beşin üzerinde farklı yöreden %100 Arabica çekirdek seçkisiyle demleme ve espresso çeşitleri sunan, geç saatlere kadar açık tek şubeli üçüncü dalga kahve dükkânı.',
      order: ['Tek Köken Filtre Kahve (V60)', 'Flat White & Sandviç-Tatlı Eşlikçisi'],
      menu: ['Yöresel Arabica Filtreler', 'Espresso Bazlı İçecekler', 'Tatlı & Sandviç Seçenekleri'],
      sec: [
        [
          'Geniş Yöresel Arabica Menüsü & Gece Saatleri',
          'Yüksek çeşitlilikteki single-origin Arabica demlemelerini geç kapanış saatleriyle iş çıkışı kahvecilerine de ulaştırır.',
          'İşletme kahve menüsü ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Kızılırmak 1450. Sokak içinde modern, sakin akşam ve gündüz kahve masaları',
      crowd: 'Farklı çekirdek orijinleri denemek ve geç saatlere kadar kahve içmek isteyenler',
      dis: 'Dış cephesi ve yakın çevresi ofis-plaza geçiş hattında olduğu için bahçeli köy kahvesi hissi sunmaz',
      transit: 'Kızılırmak Mahallesi 1450. Sokak No:16/73 (Söğütözü Metro yürüyüş mesafesi).',
      sources: [
        [
          'Nun Coffee Resmi Sitesi',
          'https://nuncoffeeco.com/',
          'operator',
          '%100 Arabica çekirdek seçkisi, 15+ menşe ve geç kapanış bilgisi',
        ],
        [
          'Restoranim nun coffee',
          'https://www.restoranim.net/',
          'editorial',
          '1450. Sk. konumu, kahve kalitesi ve tatlı-sandviç değerlendirmeleri',
        ],
      ],
      pros: ['Geniş single-origin Arabica çeşitliliği', 'Söğütözü Metro yakınlığı ve gece açık kalması'],
      cons: ['Kızılırmak iş merkezi çevresinde park trafiği yoğun olabiliyor'],
      unc: ['Mikro lot çekirdek seçkisi stoklara bağlı olarak yenilenir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 4. KAHVALTI (1 bağımsız Çukurambar kahvaltı ve kafe noktası — sıfır dolgu)
    // =========================================================================
    compactSeed({
      id: 'cukurambar-cupess',
      placeId: 'ChIJ2Z7kxkVJ0xQRaTME5kUfidA',
      cat: 'kahvalti',
      name: 'Cupess Çukurambar',
      brand: 'Cupess',
      area: 'Malcolm X Cd., Çukurambar',
      signals: ['cakalli-menemen', 'kavurmali-yumurta-ve-krep', 'tek-kisilik-special'],
      desc:
        'Malcolm X Caddesi üzerinde Çakallı menemeni, kavurmalı-pastırmalı sahanda yumurta, mantarlı-biftekli krep seçenekleri ve tek kişilik special kahvaltı tabaklarıyla kalabalık serpme kalıplarının dışında özenli kahvaltı sunan bağımsız Çukurambar noktası.',
      order: ['Tek Kişilik Special / Serpme Kahvaltı', 'Çakallı Menemen & Kavurmalı Yumurta', 'Mantarlı / Biftekli Krep'],
      menu: ['Çakallı Menemen', 'Tek Kişilik Special Kahvaltı', 'Kavurmalı Yumurta', 'Biftekli & Mantarlı Krepler', 'Espresso Kahveler'],
      sec: [
        [
          'Gündüz Bowl, Bazlama Tost & Krep Alternatifleri',
          'Sabah kahvaltısının yanında gün içinde bazlama-Ayvalık tostları ve Teriyaki Tavuk Bowl gibi pratik öğünler de çıkar.',
          'İşletme mutfak menüsü ve şehir rehberi değerlendirmeleri',
        ],
      ],
      seat: 'Malcolm X Caddesi üzerinde modern, aydınlık ve şık kafe-restoran oturumu',
      crowd: 'Zincir pastaneler dışında tek kişilik özel kahvaltı veya menemen-krep arayan Çukurambar sakinleri',
      dis: 'Hafta sonu geç kahvaltıda yer dolabilir; ana kahvaltı kalemleri öğleden sonra yavaşlar',
      transit: 'Çukurambar Mahallesi Malcolm X Caddesi No:2/2 A2-11.',
      sources: [
        [
          'Cupess Resmi Sitesi',
          'https://cafecup-ess.com.tr/',
          'operator',
          'Çukurambar konumu, Çakallı menemen, krep, kahvaltı ve kahve menüsü',
        ],
        [
          'Şehir Pusulası Cupess',
          'https://sehirpusulasi.com/',
          'editorial',
          'Malcolm X Cd. kahvaltı konsepti ve menü değerlendirmeleri',
        ],
        [
          'Yandex & Yemeksepeti Cupess',
          'https://www.yemeksepeti.com/',
          'community',
          'Flat white, bowl ve kahvaltı sunumu üzerine misafir doğrulaması',
        ],
      ],
      pros: ['Hem serpme hem tek kişilik nitelikli kahvaltı (Çakallı menemen, krep) imkânı', 'Malcolm X Cd. üzerinde bağımsız konum'],
      cons: ['Hafta içi plaza öğle kalabalığıyla yemek servisi karışabiliyor'],
      unc: ['Serpme kahvaltıda hafta sonu yoğunluk kaynaklı bekleme oluşabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 5. DENEMELİSİN (5 yerel Çukurambar klasiği — et tencere, mantı, Karadeniz balık, focaccia, aile kebap)
    // =========================================================================
    compactSeed({
      id: 'cukurambar-erdem-1071',
      placeId: 'ChIJL6_tV45P0xQRw7GDOLlSRHs',
      cat: 'denemelisin',
      name: 'Erdem 1071 Et Lokantası',
      brand: 'Erdem',
      area: '1071 Usta Plaza · Kızılırmak, Çukurambar',
      signals: ['camekan-tencere-yemekleri', 'kuzu-tandir', 'asci-tabagi'],
      desc:
        '1071 Usta Plaza Kızılırmak hattında geniş salonu ve camekân arkasından seçilen günlük tencere yemekleri, lokum gibi pişen kuzu tandırı ve aşçı tabağıyla Çukurambar iş çevresinin en yüksek hacimli geleneksel esnaf-et lokantası.',
      order: ['Kuzu Tandır', 'Camekândan Günlük Aşçı Tabağı & Tencere Yemekleri'],
      menu: ['Kuzu Tandır', 'Aşçı Tabağı', 'Günlük Tencere Et & Sebze Yemekleri', 'Çorbalar'],
      sec: [
        [
          'Hızlı Öğle Camekân Servisi & Geleneksel Çorbalar',
          'Plaza çalışanları ve misafirler için beklemeden görerek seçilebilen sıcak ev-esnaf tencere çeşitleri gün boyu tazelenir.',
          'İşletme menü kayıtları ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Geniş, ferah, hızlı devirli ve klasik Türk et-esnaf lokantası salonu',
      crowd: 'Çukurambar’da sulu tencere yemeği ve kuzu tandır arayan çalışanlar ile aileler',
      dis: 'Öğle saatleri oldukça kalabalık ve hareketlidir; romantik akşam yemeği ambiyansı arayanlar için fazla büyük ölçeklidir',
      transit: 'Kızılırmak Mahallesi 1444. Cadde 1071 Usta Plaza No:25 D:1 (Söğütözü Metro yakını).',
      sources: [
        [
          'Menulio Erdem 1071',
          'https://menulio.com.tr/',
          'editorial',
          '1071 konumu, geleneksel lokanta mutfağı ve hizmet bilgileri',
        ],
        [
          'Yandex Haritalar Erdem 1071',
          'https://yandex.com.tr/',
          'community',
          'Camekân tencere yemekleri, kuzu tandır, aşçı tabağı ve yüksek hacimli beğeni',
        ],
      ],
      pros: ['Binlerce plaza restoranı arasında gerçek tencere yemeği ve kuzu tandır standardını koruması', 'Geniş ferah oturum'],
      cons: ['Öğle yemek saatlerinde kalabalık ve yüksek sirkülasyon gürültüsü'],
      unc: ['Sevilen tandır ve tencere çeşitleri öğleden sonra tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cukurambar-1071-manti',
      placeId: 'ChIJsaCS0tRP0xQRJN9WEejekp0',
      cat: 'denemelisin',
      name: '1071 Mantı Çukurambar',
      brand: '1071',
      area: '1071 Plaza · Kızılırmak, Çukurambar',
      signals: ['sini-ve-bosnak-manti', 'yoresel-hamur-isi', 'ev-baklavasi'],
      desc:
        '1071 Ankara Kompleksi 1443. Cadde üzerinde klasik Kayseri usulünden sini ve Boşnak mantısına kadar el açması mantı çeşitleri ve kapanışta ev baklavasıyla Çukurambar’da hamur işi mutfağının yerleşik temsilcisi.',
      order: ['Sini Mantısı / Boşnak Mantısı', 'Ev Baklavası Kapanışı'],
      menu: ['Sini Mantısı', 'Boşnak Mantısı', 'Soslu Mantı Çeşitleri', 'Ev Baklavası'],
      sec: [
        [
          'Ev Baklavası & Yöresel Börek Çeşitleri',
          'Mantı tabaklarının yanında çıtır ev baklavası ve yöresel hamur işleri gün boyu servis edilir.',
          'Menü platformları ve şehir değerlendirmeleri',
        ],
      ],
      seat: '1071 yaşam alanı içinde temiz, hızlı servis odaklı mantı restoranı düzeni',
      crowd: 'Çeşitli el açması mantılar ve ev baklavası arayan Çukurambar sakinleri ile çalışanlar',
      dis: 'Öğle saatlerinde 1071 Plaza yoğunluğundan etkilenir; et ızgara menüsü yerine mantı ve hamur işi odaklıdır',
      transit: 'Kızılırmak Mahallesi 1443. Cadde No:25/A Dükkan 4.',
      sources: [
        [
          'Menu-TR 1071 Mantı',
          'https://www.menu-tr.com/',
          'editorial',
          'Sini mantısı, Boşnak mantısı, soslu mantı çeşitleri ve ev baklavası menüsü',
        ],
        [
          'Restoranim 1071 Mantı',
          'https://www.restoranim.net/',
          'community',
          'Hamur kıvamı, servis temposu ve yüksek ziyaretçi puanı doğrulaması',
        ],
      ],
      pros: ['Yüksek ziyaretçi sayısında dahi Boşnak ve sini mantısında kalitesini koruması', 'Temiz porsiyon dengesi'],
      cons: ['Hafta içi öğle arası kalabalık olabiliyor'],
      unc: ['Günün belirli saatlerinde Boşnak mantısı tepsi çıkışı beklenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cukurambar-seruven-balik',
      placeId: 'ChIJnfpGElhF0xQRGWRD1aE7Fos',
      cat: 'denemelisin',
      name: 'Serüven Balık Restaurant',
      brand: 'Serüven',
      area: 'Protokol İş Merkezi, Çukurambar',
      signals: ['karadeniz-balik-mutfagi', 'cocuk-dostu-aile-salonu', 'levrek-bugulama'],
      desc:
        'Muhsin Yazıcıoğlu Caddesi güney kesimindeki Protokol İş Merkezi yanında Karadeniz mutfağından taze ızgara hamsi, çupra ve levrek buğulama sunan; geniş kapalı oyun alanı ve vale imkânıyla aile yemeklerinin güvenilir Çukurambar balıkçısı.',
      order: ['Mevsim Hamsi Izgara / Çupra', 'Levrek Buğulama & Karadeniz Mezeleri'],
      menu: ['Hamsi Izgara', 'Çupra & Levrek Buğulama', 'Karadeniz Mezeleri', 'Hafta Sonu Kahvaltı'],
      sec: [
        [
          'Çocuk Oyun Alanı & Aile Sofrası Konforu',
          'İç mekândaki kapalı oyun alanı sayesinde çocuklu ailelerin rahatça balık ve Karadeniz mutfağı yiyebildiği nadir restoranlardandır.',
          'Yerel aile rehberleri ve yemek değerlendirmeleri',
        ],
      ],
      seat: 'Protokol İş Merkezi yanında geniş, ferah ve çocuk oyun alanlı aile balık restoranı',
      crowd: 'Bar/meyhane kalabalığı yerine aile ve çocuklarla taze balık yemek isteyen Çukurambar sakinleri',
      dis: 'Aile ve çocuk dostu ortamı nedeniyle romantik baş başa sessiz akşam buluşması arayan çiftlere hareketli gelebilir',
      transit: 'Çukurambar Mahallesi Muhsin Yazıcıoğlu Cd. No:39 Protokol İş Merkezi.',
      sources: [
        [
          'AnkaradaÇocuk Serüven Balık',
          'https://ankaradacocuk.com/',
          'editorial',
          'Karadeniz mutfağı, ızgara balık çeşitleri ve kapalı çocuk oyun alanı detayları',
        ],
        [
          'Restoranim Serüven Balık',
          'https://www.restoranim.net/',
          'community',
          'Hamsi ızgara, levrek buğulama, çupra ve aile servisi değerlendirmeleri',
        ],
      ],
      pros: ['Çukurambar içinde ailelere yönelik taze balık ve Karadeniz mutfağı sunması', 'Geniş ferah oturma ve park kolaylığı'],
      cons: ['Oyun alanı ve kalabalık aile masaları nedeniyle akşamları hareketli'],
      unc: ['Hafta sonu aile yemeklerinde büyük masalar için rezervasyon önerilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cukurambar-strada-sandwich',
      placeId: 'ChIJbaNI1A5P0xQR-Ks6qfvfdCI',
      cat: 'denemelisin',
      name: 'Strada Sandwich Çukurambar 1071',
      brand: 'Strada',
      area: '1071 Yaşam Merkezi · Kızılırmak, Çukurambar',
      signals: ['ozel-focaccia-sandvic', 'doyurucu-italyan-harci', 'taze-salatalar'],
      desc:
        '1071 Usta Yaşam Merkezi içinde taze pişirilmiş özel focaccia ekmeğine hazırlanan bol malzemeli İtalyan usulü gurme sandviçleri, salataları ve fresh bar içecekleriyle hızlı öğle ve akşamüstü öğünlerinin öne çıkan Çukurambar noktası.',
      order: ['Özel Focaccia Et / Peynirli Sandviçler', 'Taze Salata & Fresh İçecek'],
      menu: ['Special Focaccia Sandviçler', 'Et & Peynir Kombinasyonları', 'Taze Salatalar', 'Fresh Bar & Kahve'],
      sec: [
        [
          'Hafif Salata Tabakları & Fresh Bar',
          'Tok tutan focaccia sandviçlerin yanında iş temposunda hafif öğün arayanlar için taze salata seçenekleri sunulur.',
          'Yerel menü kayıtları ve kullanıcı değerlendirmeleri',
        ],
      ],
      seat: '1071 Yaşam Merkezi bünyesinde hızlı, pratik ve modern sandviç barı düzeni',
      crowd: 'Hazır tostlar yerine taze focaccia ekmeğinde kaliteli İtalyan sandviçi arayan çalışan ve öğrenciler',
      dis: 'Sıcak ana yemek restoranı değil, hızlı gurme sandviç ve salata tezgâhıdır',
      transit: 'Kızılırmak Mahallesi 1443. Cadde 1071 Usta Yaşam Merkezi.',
      sources: [
        [
          'MenuHaritası Strada Sandwich',
          'https://www.menuharitasi.com/',
          'editorial',
          'Focaccia sandviçleri, salatalar, et-peynir eşleşmeleri ve fresh bar menüsü',
        ],
        [
          'Restoranim Strada Sandwich 1071',
          'https://www.restoranim.net/',
          'community',
          'Doyurucu porsiyon, focaccia kalitesi ve hızlı servis değerlendirmeleri',
        ],
      ],
      pros: ['Taze focaccia ekmeği ve yüksek malzeme doyuruculuğu', 'Hafta içi hızlı iş molaları için pratik'],
      cons: ['Geniş oturumlu uzun akşam yemeği konsepti sunmuyor'],
      unc: ['Hafta içi öğle arasında sandviç hazırlık sırası oluşabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'cukurambar-elit-kebap',
      placeId: 'ChIJS8JezApG0xQRCUcZ4LcKfQU',
      cat: 'denemelisin',
      name: 'ELİT KEBAP PİDE',
      brand: 'ELİT',
      area: '1424. Cd., Çukurambar',
      signals: ['yillarin-mahalle-esnafi', 'guvec-ve-lahmacun', 'aile-pide-kebap'],
      desc:
        'Çukurambar henüz plaza semtine dönüşmeden önce 1424. Cadde’de yerini alan; çıtır taş fırın lahmacun, pide çeşitleri, fırın güveçleri ve klasik kebaplarıyla dürüst esnaf çizgisini koruyan köklü aile işletmesi.',
      order: ['Taş Fırın Lahmacun & Pide Çeşitleri', 'Fırın Güveç & Adana Kebap'],
      menu: ['Klasik Lahmacun', 'Kuşbaşılı & Kaşarlı Pide', 'Fırın Güveç', 'Klasik Kebaplar'],
      sec: [
        [
          'Gösterişsiz Aile Esnaf Mutfağı & Taş Fırın Güveç',
          'Lüks kebap zincirlerinin yüksek etiketlerinden ayrılarak mahalle içi uygun ve güvenilir taş fırın servisi sunar.',
          'İşletme mutfak kayıtları ve yerel harita değerlendirmeleri',
        ],
      ],
      seat: '1424. Cadde üzerinde sade, mütevazı ve temiz eski Çukurambar aile esnaf lokantası',
      crowd: 'Abartısız sunumda iyi lahmacun, pide ve taş fırın güveç yemek isteyen eski semt sakinleri',
      dis: 'Sade klasik dekorasyonundadır; yeni nesil şık plaza restoranı veya vale-kokteyl ortamı beklemez',
      transit: 'Çukurambar Mahallesi 1424. Cadde No:26/B.',
      sources: [
        [
          'Elit Kebap Resmi Sitesi',
          'https://elitkebap.com/',
          'operator',
          '1424. Cadde köklü Çukurambar konumu, lahmacun, pide, güveç ve kebap menüsü',
        ],
        [
          'Mekan.com & Yandex Elit Kebap',
          'https://yandex.com.tr/',
          'community',
          'Dürüst mahalle esnaf çizgisi ve ulaşılabilir fiyat değerlendirmeleri',
        ],
      ],
      pros: ['Çukurambar’ın plaza dokusu arasında yıllardır korunan eski mahalle esnafı karakteri', 'Erişilebilir bütçe'],
      cons: ['Sade esnaf lokantası dekoru'],
      unc: ['Öğle vakitlerinde iş yerlerinden gelen paket ve masa yoğunluğu artar'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // NEGATİF DENETİM KONTROLLERİ (Politika Kapısı Audit Testi — 17 Kontrol)
    // =========================================================================
    negControl('ctrl-cukurambar-davidpeople-chain', 'ChIJOWsx9cFJ0xQRDnooK1vn-g8', 'kahve', 'Çok şubeli David People zinciri (Kapı 2)'),
    negControl('ctrl-cukurambar-mamasburger-chain', 'ChIJw3Je0XBP0xQRli_UBvWJHRk', 'hamburger', 'Çok şubeli Mama’s Burger zinciri (Kapı 2)'),
    negControl('ctrl-cukurambar-coffeedemadrid-chain', 'ChIJQe7f8_BH0xQRxOLBpwa1vVA', 'kahve', 'Çok şubeli Coffee de Madrid zinciri (Kapı 2)'),
    negControl('ctrl-cukurambar-farmburger-chain', 'ChIJVVh3InhF0xQRSop_mI64xVk', 'hamburger', '7 şubeli Ankara Farm Burger zinciri (Kapı 2)'),
    negControl('ctrl-cukurambar-moltobene-chain', 'ChIJ81igg0tP0xQRJG7EbuyfFYc', 'pizza', '3 şubeli Ankara Moltobene zinciri (Kapı 2)'),
    negControl('ctrl-cukurambar-moccabi-chain', 'ChIJ52UuidZP0xQRFgPFPf-sBao', 'kahve', 'İstanbul + Ankara çok şubeli Moccabi zinciri (Kapı 2)'),
    negControl('ctrl-cukurambar-tuzdanbalik-chain', 'ChIJpxIA171P0xQR3QKYek-Rbbc', 'denemelisin', 'İstanbul + Ankara çok şubeli Tuzdan Balık zinciri (Kapı 2)'),
    negControl('ctrl-cukurambar-misbasak-chain', 'ChIJ2aKw6MJP0xQReJpsbJPSVoQ', 'kahvalti', 'Çok şubeli Misbaşak Ankara zinciri (Kapı 2)'),
    negControl('ctrl-cukurambar-bindiyar-chain', 'ChIJ5xjLfBdP0xQR7palwBCQtJA', 'kahvalti', 'Çok şubeli Bindiyar Unlu Mamülleri zinciri (Kapı 2)'),
    negControl('ctrl-cukurambar-bayramusta-chain', 'ChIJc-CYXmJF0xQRowjPa5Z47SY', 'denemelisin', 'Çok şubeli Bayram Usta Yaprak Kebap zinciri (Kapı 2)'),
    negControl('ctrl-cukurambar-aspava-chain', 'ChIJ6V2w4LBP0xQRMzSodhN6sWo', 'denemelisin', 'Çok şubeli Aspava zincir markası (Kapı 2)'),
    negControl('ctrl-cukurambar-loya-noncoffee', 'ChIJfdepmVlP0xQR2NgwCeXT67U', 'kahve', 'chocolate_shop primaryType kahve uzmanı değil (Kapı 3B)'),
    negControl('ctrl-cukurambar-out-balgat-mantiyiyelim', 'ChIJn-5OqB5P0xQRsjdQhlaZ9bQ', 'denemelisin', 'Balgat 1410. Sk. doğu sınır dışı (Kapı 4)'),
    negControl('ctrl-cukurambar-out-oguzlar-ulucay', 'ChIJc6Bw6T1P0xQR_r5bmtGwlsw', 'denemelisin', 'Oğuzlar 1377. Sk. doğu sınır dışı (Kapı 4)'),
    negControl('ctrl-cukurambar-out-iscibloklari-dipizza', 'ChIJ7ZuaSfRH0xQRLYTVTah3-Do', 'pizza', 'İşçi Blokları güney sınır dışı + İtalyan Di’Pizza zinciri (Kapı 2/4)'),
    negControl('ctrl-cukurambar-low-todo', 'ChIJU7OdIhRP0xQRp2tV0Bl0tSQ', 'kahve', '3.9 puan standart 4.4 eşiğinin altında (Kapı 6)'),
    negControl('ctrl-cukurambar-vol-filotto', 'ChIJP3dX6VRP0xQRP1ZCTUbX3hE', 'denemelisin', '6520 değerlendirmede 4.4 puan aşırı ticari hacim kapısı altında (Kapı 7)'),
  ],
};
