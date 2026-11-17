import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ANKARA_CANKAYA_AYRANCI_DEF: V3RegionDefinition = {
  id: 'ankara-cankaya-ayranci',
  slug: 'ayranci',
  city: 'Ankara',
  district: 'Çankaya',
  allowedDistricts: ['Çankaya'],
  neighborhood: 'Ayrancı',
  officialQuarter:
    'Ayrancı, Güvenevler, Aziziye & Güzeltepe Mahalleleri (Hoşdere Caddesi, Kuzgun Sokak, Güvenlik Cd., Kıbrıs Sk., Yeşilyurt Sk., Farabi & Mesnevi Sokak Aksları)',
  displayName: 'Ayrancı, Çankaya, Ankara',
  locative: "Ayrancı'da",
  path: ['ankara', 'cankaya', 'ayranci'],
  aliases: [
    'Ayrancı',
    'Ayranci',
    'Ayrancı Ankara',
    'Ayrancı Çankaya',
    'Aşağı Ayrancı',
    'Yukarı Ayrancı',
    'Hoşdere',
    'Hoşdere Caddesi',
    'Kuzgun Sokak',
    'Mesnevi Sokak',
    'Güvenevler',
    'Güvenevler Ankara',
    'Aziziye Çankaya',
  ],
  scopeNote:
    'Ayrancı, Güvenevler, Aziziye & Güzeltepe (Hoşdere, Kuzgun, Güvenlik & Mesnevi hattı; Tunalı/Kavaklıdere, Kuğulu Park, Gaziosmanpaşa ve Yıldız hariç) · Doğrulanmış Seçki',
  characterSubtitle:
    'Hoşdere ve Güvenlik caddelerinden Kuzgun, Yeşilyurt ve Mesnevi’nin ağaçlıklı ara sokaklarına uzanan; el açması Napoli pizzacısı, butik mahalle burgercileri, bahçeli üçüncü dalga kahveciler, yeni nesil bahçe meyhaneleri, ekşi mayalı artizan fırınlar ve Hatay-Lübnan tatlısı gibi özgün sokak durakları.',
  center: { lat: 39.8955, lng: 32.8535 },
  bbox: { minLat: 39.8825, maxLat: 39.9045, minLng: 32.8420, maxLng: 32.8605 },
  excludeBbox: { minLat: 39.8995, maxLat: 39.9045, minLng: 32.8555, maxLng: 32.8605 },
  allowedNeighborhoodTokens: [
    'Ayrancı',
    'Ayranci',
    'Güvenevler',
    'Guvenevler',
    'Aziziye',
    'Güzeltepe',
    'Guzeltepe',
  ],
  categories: buildRegionCategories(),
  candidates: [
    // =========================================================================
    // 1. PİZZA (1 tek şubeli artizan Napoli pizzacısı — sıfır dolgu)
    // =========================================================================
    compactSeed({
      id: 'ayranci-gusto-di-napoli',
      placeId: 'ChIJzcQjAQBP0xQRzOq0GSl_VTE',
      cat: 'pizza',
      name: 'Gusto Di Napoli Pizza & Panuozzo Sandviç',
      brand: 'Gusto',
      area: 'Kırkpınar Sk. · Aziziye, Ayrancı',
      signals: ['el-acmasi-napoli', 'panuozzo-sandvic', 'kirpinar-butik'],
      desc:
        'Aziziye Kırkpınar Sokak’ta el açması Napoli usulü fermente hamurla pişirdiği artizan pizzaları ve fırından çıkan sıcak panuozzo sandviçleriyle ayrışan küçük ölçekli Ayrancı İtalyan lezzet noktası.',
      order: ['El Açması Napoli Pizzaları', 'Fırından Panuozzo Sandviç'],
      menu: ['Margherita & Napoli Pizzalar', 'Panuozzo Sandviç Çeşitleri', 'Özel Soslu Focaccia'],
      sec: [
        [
          'Pizza Hamurundan Sıcak Panuozzo Sandviç',
          'Klasik daire pizza dışında aynı fermente hamurdan hazırlanan içi dolgulu Napoli sokak sandviçi panuozzo ile öne çıkar.',
          'İşletme mutfak menüsü ve şehir rehberi değerlendirmeleri',
        ],
      ],
      seat: 'Kırkpınar Sokak üzerinde sade, birkaç masalı butik pizzeria ve hızlı paket tezgâhı',
      crowd: 'Hafif fermente Napoli hamuru ve gerçek panuozzo sandviç arayan mahalle sakinleri',
      dis: 'Oturma alanı kısıtlıdır; büyük gruplar veya uzun akşam oturumları için uygun değildir',
      transit: 'Aziziye Mahallesi Kırkpınar Sokak No:7 D:C (Hoşdere & Cinnah arası yokuş bağlantı).',
      sources: [
        [
          'Menum Gusto Di Napoli',
          'https://menum.co/',
          'editorial',
          'Kırkpınar Sk. adresi, el açması Napoli pizzası ve panuozzo sandviç menüsü',
        ],
        [
          'Restoranim Gusto Di Napoli',
          'https://www.restoranim.net/',
          'community',
          'Hamur fermente dokusu ve özgün sos değerlendirmeleri',
        ],
      ],
      pros: ['Mahalle arasında gerçek Napoli hamuru ve nadir bulunan panuozzo sandviç uzmanlığı', 'Temiz, hafif hamur dengesi'],
      cons: ['Sınırlı iç masa kapasitesi ve sade tezgâh düzeni'],
      unc: ['Yoğun akşam saatlerinde taze hamur stoku nedeniyle bekleme uzayabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 2. HAMBURGER (2 bağımsız Ayrancı & Hoşdere burgercisi)
    // =========================================================================
    compactSeed({
      id: 'ayranci-ratu-burger',
      placeId: 'ChIJBQi5YHNP0xQRWjs89JcrvBA',
      cat: 'hamburger',
      name: 'Ratu Burger House',
      brand: 'Ratu',
      area: 'Hoşdere Cd. · Güvenevler, Ayrancı',
      signals: ['el-yapimi-burger', 'nosferatu-ve-tiftik', 'aile-isletmesi'],
      desc:
        'Hoşdere Caddesi Güvenevler kesiminde el yapımı köfteleri ve aile işletmesi sıcaklığıyla çizgisini koruyan; Nosferatu, Anadolu Burger ve cheddar dolgulu Tiftik Burger seçenekleriyle sevilen köklü mahalle burgercisi.',
      order: ['Nosferatu / Deli Burger', 'Cheddar Dolgulu Tiftik Burger', 'Çıtır Patates Kızartması'],
      menu: ['Nosferatu Burger', 'Kitsch Burger', 'Anadolu Burger', 'Tiftik Burger'],
      sec: [
        [
          'Özel Reçete Soslar & Çıtır Başlangıçlar',
          'Klasik burgerlerin yanı sıra tiftik dana etli çeşitler ve ev yapımı burger sosları siparişlerde sıkça tercih edilir.',
          'Yerel menü platformları ve misafir değerlendirmeleri',
        ],
      ],
      seat: 'Hoşdere Caddesi üzerinde mütevazı, sıcak ve samimi mahalle burgercisi salonu',
      crowd: 'Zincir fast-food yerine dürüst el yapımı köfteli burger arayan Ayrancı müdavimleri',
      dis: 'İç mekân görece küçük ölçeklidir; yoğun saatlerde masa bulmak veya paket sırası beklemek gerekebilir',
      transit: 'Güvenevler Mahallesi Hoşdere Caddesi No:51 D:C.',
      sources: [
        [
          'Restoranim Ratu Burger House',
          'https://www.restoranim.net/',
          'editorial',
          'Aile işletmesi sıcaklığı, el yapımı burger köftesi ve Hoşdere değerlendirmeleri',
        ],
        [
          'Menu-TR Ratu Burger House',
          'https://www.menu-tr.com/',
          'community',
          'Nosferatu, Tiftik Burger ve Anadolu Burger menü doğrulaması',
        ],
      ],
      pros: ['Yıllardır Hoşdere üzerinde kalitesini bozmayan bağımsız aile işletmesi', 'Zengin özgün burger reçeteleri'],
      cons: ['Küçük oturma kapasitesi'],
      unc: ['Akşam paket servis yoğunluğunda masa siparişi birkaç dakika gecikebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-hamm-burger',
      placeId: 'ChIJadELg95P0xQRL-G7ZcoPlhc',
      cat: 'hamburger',
      name: 'HAMM-BURGER',
      brand: 'HAMM',
      area: 'Atakan Dut Cd., Ayrancı',
      signals: ['yuzde-yuz-dana-kofte', 'yumusak-ev-ekmegi', 'truflu-soslar'],
      desc:
        'Ayrancı Şehit Pilot Mustafa Atakan Dut Caddesi’nde yumuşak ev yapımı ekmekler arasında sulu %100 dana köfteleri, Mahalle Burger ve trüf soslu çeşitleriyle temiz, sakin bir sokak lezzeti durağı sunan butik burgerci.',
      order: ['Mahalle Burger / Trüflü Burger', 'Çıtır Patates & Soslar'],
      menu: ['Mahalle Burger', 'Üç Kardeş Burger', 'Trüflü Burger', 'Çıtır Patates'],
      sec: [
        [
          'Ev Yapımı Yumuşak Ekmek & Trüflü Sos Uyumu',
          'Köftelerin suyunu tutan yumuşak ekmek yapısı ve trüflü sos alternatifleri mahalle müdavimlerince öne çıkarılır.',
          'Şehir rehberleri ve menü değerlendirmeleri',
        ],
      ],
      seat: 'Ayrancı ara caddesinde sakin, temiz ve aile ortamına uygun birkaç masalı salon',
      crowd: 'Sakin sokakta sulu burger ve çıtır patates yemek isteyen Aşağı Ayrancı sakinleri',
      dis: 'Kapasitesi kısıtlı olduğu için özellikle akşamları dolabilir; ana cadde dışında yokuşlu sokak konumundadır',
      transit: 'Ayrancı Mahallesi Şht. Pilot Mustafa Atakan Dut Caddesi No:49/B.',
      sources: [
        [
          'Restoranim HAMM-BURGER Ayrancı',
          'https://www.restoranim.net/',
          'editorial',
          'Sulu dana köfte, yumuşak ekmek, trüflü sos ve temiz aile ortamı değerlendirmesi',
        ],
        [
          'Menu-TR HAMM-BURGER',
          'https://www.menu-tr.com/',
          'editorial',
          'Atakan Dut Cd. konumu, Mahalle Burger ve Üç Kardeş menü incelemesi',
        ],
        [
          'Migros Yemek & Dijital Menü',
          'https://www.migros.com.tr/',
          'community',
          'Ayrancı tek şube doğrulaması ve menü seçenekleri',
        ],
      ],
      pros: ['Mahalle içinde temiz, nezih aile ortamı ve dengeli burger ekmeği', 'Katkısız sulu dana köfte profili'],
      cons: ['Sınırlı masa kapasitesi ve ara sokak park zorluğu'],
      unc: ['Yoğun akşam saatlerinde stoklara bağlı olarak sınırlı adet çıkabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 3. KAHVE (4 saf üçüncü dalga mahalle kahvecisi — bahçeli ve çalışma odaklı)
    // =========================================================================
    compactSeed({
      id: 'ayranci-oak-coffee',
      placeId: 'ChIJvUldCaRP0xQRo-pPSrcuZvg',
      cat: 'kahve',
      name: 'OAK Coffee Co.',
      brand: 'OAK',
      area: 'Kuzgun Cd., Ayrancı',
      signals: ['ferah-ayranci-bahcesi', 'mahalle-kahvecisi', 'nitelikli-kahve'],
      desc:
        'Kuzgun ve Ali Dede sokakları kesişiminde Ayrancı’nın en ferah mahalle bahçelerinden birini sunan; nitelikli kahve çeşitleri, ev tatlıları ve arkadaş gruplarının rahatça vakit geçirdiği tek şubeli Ayrancı kahvecisi.',
      order: ['V60 / Espresso Bazlı Kahveler', 'Günün Ev Yapımı Tatlıları'],
      menu: ['Flat White & Cortado', 'V60 Filtre Kahve', 'Soğuk Demlemeler', 'Tatlı Eşlikçiler'],
      sec: [
        [
          'Ferah Mahalle Bahçesi & Sosyal Masa Düzeni',
          'Kuzgun Sokak dokusu içindeki açık bahçesiyle günün her saatinde hem kahve sohbetine hem rahat çalışmaya olanak tanır.',
          'Yerel mahalle rehberleri ve menü değerlendirmeleri',
        ],
      ],
      seat: 'Ağaçlı ferah dış bahçe masaları ve sıcak ahşap iç salon',
      crowd: 'Kuzgun Sokak çevresinde bahçeli üçüncü dalga kahve keyfi arayan Ayrancı müdavimleri',
      dis: 'Günün popüler saatlerinde bahçe alanı hareketli olduğu için tam sessiz odaklanma bekleyenler için canlı kalabilir',
      transit: 'Ayrancı Mahallesi Kuzgun Caddesi No:18 D:C (Ali Dede Sk. köşesi).',
      sources: [
        [
          'Ayrancım Yerel Rehber',
          'https://ayrancim.org.tr/',
          'editorial',
          'Ayrancı tek şubeli bahçeli kahveci konumu ve mahalle kültürü incelemesi',
        ],
        [
          'Menu-TR OAK Coffee',
          'https://www.menu-tr.com/',
          'community',
          'Kahve çeşitleri, tatlılar ve bahçe düzeni değerlendirmeleri',
        ],
      ],
      pros: ['Ayrancı içindeki en ferah açık bahçelerden biri', 'Tek şubeli samimi mahalle kimliği'],
      cons: ['Hafta sonu bahçe masaları hızla dolar'],
      unc: ['Kış aylarında ısıtmalı yarı açık alan kapasitesi sınırlı kalabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-owster-coffee',
      placeId: 'ChIJmwfkX3hP0xQRymm5i36rtq0',
      cat: 'kahve',
      name: 'Owster Coffee',
      brand: 'Owster',
      area: 'Elçi Sk. · Yukarı Ayrancı, Ayrancı',
      signals: ['aile-isletmesi', 'calisma-masalari', 'yukari-ayranci'],
      desc:
        'Yukarı Ayrancı Elçi Sokak’ta bir aile işletmesi özeniyle çalışan; temiz üçüncü dalga espresso-filtre kahve sunumunu rahat çalışma masaları ve sıcak mahalle samimiyetiyle birleştiren kahve durağı.',
      order: ['Filtre Kahve / Cortado', 'Günün Taze Tatlıları'],
      menu: ['Espresso & Flat White', 'V60 Filtre Kahve', 'Tatlı Vitrini'],
      sec: [
        [
          'Çalışma Masaları & Sakin Sokak Atmosferi',
          'Ana caddelerin gürültüsünden uzak Elçi Sokak konumu sayesinde bilgisayarla odaklanmak veya kitap okumak için idealdir.',
          'İşletme mutfak kayıtları ve Ayrancı mahalle değerlendirmeleri',
        ],
      ],
      seat: 'Rahat çalışma masaları ve samimi iç mekân oturumu',
      crowd: 'Yukarı Ayrancı yokuşunda sessiz, sıcak kahve barı ve çalışma alanı arayanlar',
      dis: 'Yukarı Ayrancı’nın eğimli sokaklarında yer aldığı için yürüyüşle ulaşımda yokuş çıkılır',
      transit: 'Ayrancı Mahallesi Elçi Sokağı No:17/A.',
      sources: [
        [
          'Owster Coffee Resmi Sitesi',
          'http://owstercoffee.com/',
          'operator',
          'Yukarı Ayrancı Elçi Sokak konumu ve kahve menüsü',
        ],
        [
          'Ayrancım & Menu-TR İncelemesi',
          'https://ayrancim.org.tr/',
          'editorial',
          'Aile işletmesi sıcaklığı, çalışma masaları ve kahve kalitesi notları',
        ],
      ],
      pros: ['Ana caddeden uzak huzurlu çalışma ve kahve atmosferi', 'İlgili aile işletmesi servis kalitesi'],
      cons: ['Eğimli ara sokak konumu nedeniyle araç parkı kısıtlı olabilir'],
      unc: ['Öğleden sonra çalışma masalarında doluluk artabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-caffenux',
      placeId: 'ChIJP1eIEORP0xQRaBEhfO60aBY',
      cat: 'kahve',
      name: 'CaffeNux',
      brand: 'CaffeNux',
      area: 'Kıbrıs Sk. · Güvenevler, Ayrancı',
      signals: ['agac-alti-teras', 'steampunk-dekor', 'huzurlu-bahce'],
      desc:
        'Güvenevler Kıbrıs Sokak’ta steampunk esintili özgün dekorasyonu, kalabalıktan koparan ağaç altı sakin terası ve ev yapımı günlük tatlıları eşliğinde servis edilen nitelikli kahveleriyle ayrışan köklü mahalle kahvecisi.',
      order: ['Nitelikli Espresso / Filtre Kahve', 'Günlük Ev Yapımı Tatlılar'],
      menu: ['Espresso & Latte Seçkisi', 'Demleme Kahveler', 'Günlük Ev Tatlıları'],
      sec: [
        [
          'Ağaç Altı Arka Teras & Müzik Seçkisi',
          'Kalabalık caddelerin hemen arkasında ağaç gölgesi sunan terası ve özenli müzik seçkisiyle uzun sohbetlere ev sahipliği yapar.',
          'Şehir rehberleri ve müdavim değerlendirmeleri',
        ],
      ],
      seat: 'Ağaç altı sakin teras ve karakterli iç salon masaları',
      crowd: 'Klasik AVM veya zincir tasarımından uzak, sakin teraslı kahve sığınağı arayanlar',
      dis: 'Güneşsiz günlerde dış teras serin olabildiğinden içerideki sınırlı masalar hızla dolabilir',
      transit: 'Güvenevler Mahallesi Kıbrıs Sokak No:13 (Farabi Sk. yakını).',
      sources: [
        [
          'Restoranim CaffeNux',
          'https://www.restoranim.net/',
          'editorial',
          'Ağaç altı teras, nitelikli kahve ve günlük ev tatlıları değerlendirmesi',
        ],
        [
          'Ayrancım CaffeNux Rehberi',
          'https://ayrancim.org.tr/',
          'editorial',
          'Steampunk esintili dekorasyon ve Kıbrıs Sokak huzurlu atmosfer incelemesi',
        ],
      ],
      pros: ['Ağaç altı terasıyla Güvenevler içinde nadide sakin sığınak atmosferi', 'Zincir benzeri olmayan özgün iç tasarım'],
      cons: ['Kış aylarında iç salon kapasitesi nispeten butik'],
      unc: ['Hafta sonu bahçe masaları hızlı dolabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-sloth-coffee',
      placeId: 'ChIJzb5ij3VP0xQR6xCAP8zyA-E',
      cat: 'kahve',
      name: 'Sloth Coffee Shop',
      brand: 'Sloth',
      area: 'Güvenlik Cd., Ayrancı',
      signals: ['ders-calisma-odakli', 'minimalist-tasarim', 'bitki-caylari'],
      desc:
        'Güvenlik Caddesi üzerinde minimalist tasarımı, sessiz odaklanmaya elverişli oturma düzeni, bitki çayları ve dengeli üçüncü dalga kahve çeşitleriyle Ayrancı öğrencilerinin ve çalışanlarının düzenli kahve durağı.',
      order: ['Filtre Kahve / Americano', 'Bitki Çayları & Hafif Tatlılar'],
      menu: ['Filtre & Espresso Kahveler', 'Özel Bitki Çayları', 'Hafif Kek & Tatlı'],
      sec: [
        [
          'Odaklanma Dostu Sessiz Çizgi & Bitki Çayı Seçkisi',
          'Kahve dışında özenli bitki çayı alternatifleri ve dikkat dağıtmayan sade tasarımıyla çalışmaya olanak tanır.',
          'Yerel harita kayıtları ve müdavim değerlendirmeleri',
        ],
      ],
      seat: 'Minimalist, sade ve bilgisayarla odaklanmaya elverişli çalışma masaları',
      crowd: 'Dikkat dağılmadan sessiz ortamda çalışmak ve kahve içmek isteyen öğrenciler ve uzaktan çalışanlar',
      dis: 'Büyük bahçe veya yüksek enerjili akşam sohbet ortamı arayanlar için fazla sakin ve minimalist kalır',
      transit: 'Ayrancı Mahallesi Güvenlik Caddesi No:36/A (Portakal Çiçeği & Tunalı yakını).',
      sources: [
        [
          'Ekşi Şeyler Ankara Kahve Rehberi',
          'https://eksiseyler.com/',
          'editorial',
          'Güvenlik Cd. çalışma dostu ve minimalist üçüncü nesil kahveci değerlendirmesi',
        ],
        [
          'Yandex Haritalar Sloth Coffee',
          'https://yandex.com.tr/',
          'community',
          'Bitki çayları, kahve çeşitleri ve sakin ortam teyidi',
        ],
      ],
      pros: ['Güvenlik Caddesi üzerinde sakin çalışma atmosferi', 'İyi dengelenmiş kahve ve bitki çayı alternatifleri'],
      cons: ['Sosyal kalabalık buluşmalar yerine bireysel/küçük masa düzeni'],
      unc: ['Hafta içi öğleden sonra çalışma masaları yoğun olabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 4. DATE MEKÂNLARI (3 Ayrancı / Aziziye / Güzeltepe akşam & bahçe durağı)
    // =========================================================================
    compactSeed({
      id: 'ayranci-mufredat-meyhane',
      placeId: 'ChIJkVsi83NF0xQRtH0GyTLlXCA',
      cat: 'date',
      name: 'Müfredat Meyhane',
      brand: 'Müfredat',
      area: 'Güzeltepe, Ayrancı',
      signals: ['yeni-nesil-teras-meyhane', 'ortaklar-cop-sis', 'kaz-kebabi'],
      desc:
        'Güzeltepe Ahmet Mithat Efendi Sokak’ta eski usul meyhane kültürünü modern teras şıklığıyla buluşturan; günlük taze mezelerin yanı sıra Ortaklar usulü çöp şiş ve kaz kebabı gibi sıra dışı lezzetleriyle öne çıkan meyhane.',
      order: ['Günlük Taze Mezeler', 'Ortaklar Usulü Çöp Şiş / Kaz Kebabı'],
      menu: ['Günlük Soğuk Mezeler', 'Ortaklar Çöp Şiş', 'Kaz Kebabı', 'Ara Sıcaklar'],
      sec: [
        [
          'Teras Akşamları & Anadolu Spesiyal Etler',
          'Standart meze-balık menülerinin ötesinde Ortaklar çöp şiş ve sezonluk kaz kebabı gibi yöresel et yemekleri sunmasıyla ayrışır.',
          'İşletme mutfak kayıtları ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Şık aydınlatmalı modern teras ve keyifli meyhane salonu',
      crowd: 'Tunalı kalabalığından sıyrılıp özgün et-meze menüsüyle akşam buluşması arayanlar',
      dis: 'Hafta sonu akşamları erken dolduğundan önceden yer ayırtmak gerekir; yokuşlu Güzeltepe ara sokağındadır',
      transit: 'Güzeltepe Mahallesi Ahmet Mithat Efendi Sokak No:10 (Hoşdere üst aksı).',
      sources: [
        [
          'Müfredat Meyhane Resmi Sitesi',
          'https://mufredatmeyhane.com/',
          'operator',
          'Güzeltepe teras konsepti, günlük mezeler, Ortaklar çöp şiş ve kaz kebabı',
        ],
        [
          'Yandex Haritalar Müfredat Meyhane',
          'https://yandex.com.tr/',
          'community',
          'Modern meyhane atmosferi ve yüksek akşam memnuniyeti değerlendirmeleri',
        ],
      ],
      pros: ['Teras atmosferiyle birleşen özgün çöp şiş ve kaz kebabı seçkisi', 'Tunalı kalabalığı dışında seçkin konum'],
      cons: ['Güzeltepe eğimli sokaklarda otopark kısıtı'],
      unc: ['Kaz kebabı gibi özel yemeklerin servis günleri önceden teyit edilmelidir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-ora-restaurant',
      placeId: 'ChIJv4FJaoJP0xQRzfWiI5UFsgw',
      cat: 'date',
      name: 'Ora Restaurant',
      brand: 'Ora',
      area: 'Willy Brandt Sk. · Aziziye, Ayrancı',
      signals: ['samimi-dost-meclisi', 'canli-muzik-meze', 'aziziye-aksam'],
      desc:
        'Aziziye Willy Brandt Sokak’ta abartısız, samimi bir dost meclisi sıcaklığında lezzetli günlük mezeler, ızgaralar ve seçili akşamlardaki canlı müzik programıyla uzun sohbet sofralarına ev sahipliği yapan meyhane-restoran.',
      order: ['Soğuk & Sıcak Meze Seçkisi', 'Izgara Ana Yemekler'],
      menu: ['Soğuk Mezeler', 'Ara Sıcaklar', 'Izgara Et & Balık Çeşitleri'],
      sec: [
        [
          'Dost Meclisi Atmosferi & Canlı Akşam Müziği',
          'Gösterişçi lüksten uzak, samimi sohbet ortamını seçili günlerdeki canlı müzik eşliğiyle dengeler.',
          'Yerel menü kayıtları ve restoran rehberi değerlendirmeleri',
        ],
      ],
      seat: 'Sıcak ve samimi iç salon masa düzeni',
      crowd: 'Abartısız, içten bir ortamda meze ve canlı müzik akşamı arayan çiftler ve arkadaş masaları',
      dis: 'Canlı müzik akşamlarında ortam sesi yükselir; yüksek tavanlı ferah teras arayanlara görece kompakt gelebilir',
      transit: 'Aziziye Mahallesi Willy Brandt Sokak No:1 D:A (Atakule çevresi aşağı aks).',
      sources: [
        [
          'Menu-TR Ora Restaurant',
          'https://www.menu-tr.com/',
          'editorial',
          'Willy Brandt Sk. konumu, meze-ızgara menüsü ve canlı müzik detayları',
        ],
        [
          'Restoranim Ora Restaurant',
          'https://www.restoranim.net/',
          'community',
          'Dost meclisi sıcaklığı ve samimi servis değerlendirmeleri',
        ],
      ],
      pros: ['Aziziye içinde abartısız, içten meyhane atmosferi', 'İyi kurgulanmış meze çeşitliliği'],
      cons: ['Canlı müzik saatlerinde ses seviyesi yükselebiliyor'],
      unc: ['Canlı müzik günleri ve masa rezervasyonu önceden doğrulanmalıdır'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-meymenet-meyhane',
      placeId: 'ChIJNwGtngNP0xQR7di9Pl8zKIc',
      cat: 'date',
      name: 'Meymenet Meyhane',
      brand: 'Meymenet',
      area: 'Portakal Çiçeği Sk. · Aziziye, Ayrancı',
      signals: ['agaclar-alti-bahce', 'saslik-eti', 'genis-yaz-meyhanesi'],
      desc:
        'Aziziye Portakal Çiçeği Sokak’ta ağaçların altındaki geniş ve ferah bahçesi, zengin klasik meze masaları ve et yemekleri arasındaki şaşlık sunumuyla Ankara’nın sevilen açık hava meyhane akşamlarını sunan adres.',
      order: ['Ağaç Altı Meze Seçkisi', 'Özel Şaşlık Et / Izgaralar'],
      menu: ['Klasik Soğuk Mezeler', 'Ara Sıcaklar', 'Şaşlık & Izgara Etler'],
      sec: [
        [
          'Ağaç Altı Geniş Bahçe & Et Seçenekleri',
          'Kapalı alanlara sıkışmadan bahçedeki ağaçların altında ferah masalarda şaşlık ve meze paylaşımı sağlar.',
          'Şehir rehberleri ve meyhane değerlendirmeleri',
        ],
      ],
      seat: 'Ağaçlıklı geniş açık bahçe masaları ve klasik iç meyhane salonu',
      crowd: 'Özellikle ılık havalarda ağaç altında geniş ve ferah rakı-meze akşamı planlayanlar',
      dis: 'Geniş bahçe kapasitesi nedeniyle dolu akşamlarda gürültülü olabiliyor ve servis süresi uzayabiliyor',
      transit: 'Aziziye Mahallesi Portakal Çiçeği Sokak No:2/A.',
      sources: [
        [
          'Restoranim Meymenet Meyhane',
          'https://www.restoranim.net/',
          'editorial',
          'Ağaçlar altındaki geniş bahçe düzeni, şaşlık ve meze değerlendirmeleri',
        ],
        [
          'Yandex Haritalar Meymenet Meyhane',
          'https://yandex.com.tr/',
          'community',
          'Portakal Çiçeği Sk. konumu ve bahçe atmosferi teyidi',
        ],
      ],
      pros: ['Aziziye içinde ferah, ağaçlıklı gerçek bahçe meyhanesi', 'Meze yanında et ve şaşlık dengesi'],
      cons: ['Kalabalık yaz akşamlarında servis temposu yavaşlayabilir'],
      unc: ['Bahçe masaları için güzel havalarda önceden rezervasyon gerekir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 5. KAHVALTI (3 bağımsız artizan fırın & mahalle kahvaltıcısı)
    // =========================================================================
    compactSeed({
      id: 'ayranci-around-tatli-tuzlu',
      placeId: 'ChIJ53WuMvlP0xQRekC-g-l5XZE',
      cat: 'kahvalti',
      name: 'Around Tatlı Tuzlu',
      brand: 'Around',
      area: 'Kuzgun Cd., Ayrancı',
      signals: ['butik-kahvalti', 'muzlu-ekmek-ve-tatli', 'kuzgun-cd'],
      desc:
        'Ayrancı Kuzgun Caddesi’nde ev yapımı muzlu ekmek (banana bread), fırınlanmış elmalı tarçınlı lezzetler, tuzlu kahvaltı tabakları ve kahve eşlikçileriyle mahallede hızlı müdavim kitlesi oluşturmuş butik kahvaltı-kafe.',
      order: ['Tuzlu Kahvaltı Tabağı & Kahve', 'Ev Yapımı Banana Bread / Fırın Tatlıları'],
      menu: ['Kahvaltı Tabakları', 'Muzlu Ekmek (Banana Bread)', 'Fırınlanmış Elma Dilimleri', 'Nitelikli Kahve'],
      sec: [
        [
          'Fırın Tatlıları & Tatlı-Tuzlu Denge',
          'Klasik serpme yerine günlük pişen muzlu ekmek ve hafif kahvaltı tabaklarıyla hem sabah hem öğleden sonra tercih edilir.',
          'Yerel menü platformları ve misafir değerlendirmeleri',
        ],
      ],
      seat: 'Kuzgun Caddesi üzerinde sıcak, butik mahalle kafesi masaları',
      crowd: 'Hafif ve özenli tatlı-tuzlu kahvaltı tabakları arayan Kuzgun Sokak müdavimleri',
      dis: 'Küçük butik mekân olduğu için kalabalık hafta sonu grupları yerine 2–3 kişilik buluşmalara daha uygundur',
      transit: 'Ayrancı Mahallesi Kuzgun Caddesi No:20/A.',
      sources: [
        [
          'Restoranim Around Tatlı Tuzlu',
          'https://www.restoranim.net/',
          'editorial',
          'Fırınlanmış elma dilimleri, banana bread ve kahvaltı-kahve değerlendirmeleri',
        ],
        [
          'Menu-TR Around Tatlı Tuzlu',
          'https://www.menu-tr.com/',
          'editorial',
          'Kuzgun Cd. No:20/A menü kalemleri ve kahvaltılık seçkisi',
        ],
        [
          'Yandex Haritalar Around Tatlı Tuzlu',
          'https://yandex.com.tr/',
          'community',
          'Konum doğrulaması ve yüksek ziyaretçi memnuniyeti',
        ],
      ],
      pros: ['Ağır serpmeler yerine taze fırınlanmış muzlu ekmek ve temiz kahvaltı çizgisi', 'Samimi Kuzgun Cd. konumu'],
      cons: ['Küçük oturma kapasitesi'],
      unc: ['Günlük taze pişen tatlı çeşitleri öğleden sonra bitebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-art-artisan-bakery',
      placeId: 'ChIJFz-GTAtP0xQR1W5uR7_A3do',
      cat: 'kahvalti',
      name: 'Art. Artisan Bakery',
      brand: 'Art',
      area: 'Güvenlik Cd. · Güvenevler, Ayrancı',
      signals: ['fransiz-alman-firin', 'zimtschnecken-ve-berliner', 'eksi-maya-ekmek'],
      desc:
        'Güvenlik Caddesi 74/C’de Fransız ve Alman fırıncılık ekolünden ilham alan ekşi mayalı somunları, tereyağlı kruvasan-danish katmanları, çikolatalı berliner ve tarçınlı zimtschnecken çörekleriyle öne çıkan zanaat fırın.',
      order: ['Tereyağlı Kruvasan / Danish', 'Zimtschnecken (Tarçınlı Rulo) & Berliner', 'Ekşi Mayalı Ekmekler'],
      menu: ['Kruvasan & Danish', 'Zimtschnecken', 'Çikolatalı Berliner', 'Ekşi Mayalı Somun Ekmek'],
      sec: [
        [
          'Alman Ekolü Zimtschnecken, Berliner & Ekşi Maya',
          'Standart kruvasancıların ötesinde gerçek Alman tarçınlı rulosu zimtschnecken ve dolgulu berliner çıkarmasıyla ayrışır.',
          'Fırın rehberleri ve menü değerlendirmeleri',
        ],
      ],
      seat: 'Tezgâh önü hızlı al-götür ağırlıklı düzen (oturma alanı sınırlıdır)',
      crowd: 'Sabah erken saatte sıcak kruvasan, tarçınlı rulo ve gerçek ekşi mayalı somun almak isteyenler',
      dis: 'Büyük kahvaltı masası oturtan kafe yerine erken tükenen tezgâh-fırın formatındadır',
      transit: 'Güvenevler Mahallesi Güvenlik Caddesi No:74/C.',
      sources: [
        [
          'Menu-TR Art Artisan Bakery',
          'https://www.menu-tr.com/',
          'editorial',
          'Kruvasan, berliner, zimtschnecken ve erken tükenen fırın detayları',
        ],
        [
          'RestaurantGuru Art Bakery',
          'https://restaurantguru.com/',
          'community',
          'Fransız-Alman ekolü hamur kalitesi ve yüksek memnuniyet notları',
        ],
      ],
      pros: ['Ankara içinde nadir Alman-Fransız tarzı zimtschnecken ve ekşi maya üretimi', 'Taze ve yüksek hamur işçiliği'],
      cons: ['Uzun oturmalı kafe salonu yok; geç kalınınca ürünler bitebiliyor'],
      unc: ['Sabah tepsileri öğle saatlerinden önce hızla tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-sarah-bakery',
      placeId: 'ChIJp6vOdMNP0xQRckaVPQHdwMI',
      cat: 'kahvalti',
      name: 'Sarah Bakery',
      brand: 'Sarah',
      area: 'Mesnevi Sk. · Aziziye, Ayrancı',
      signals: ['mesnevi-kahvalti', 'unsuz-portakalli-kek', 'tiramisu-ve-kahve'],
      desc:
        'Aziziye Mesnevi Sokak’ta özenli sabah kahvaltı tabakları ile temiz kahve servisini ev yapımı tiramisu ve unsuz portakallı-çikolatalı kek gibi imza tatlılarla tamamlayan butik fırın-kafe.',
      order: ['Sabah Kahvaltı Tabağı & Kahve', 'Unsuz Portakallı Çikolatalı Kek / Tiramisu'],
      menu: ['Kahvaltı Seçenekleri', 'Unsuz Portakallı-Çikolatalı Kek', 'Tiramisu', 'Espresso & Filtre Kahve'],
      sec: [
        [
          'Unsuz Portakallı-Çikolatalı Kek & Kahve Kapanışı',
          'Sabah kahvaltısı dışında öğleden sonra özellikle unsuz portakallı keki ve tiramisusuyla tatlı-kahve molası için seçilir.',
          'Yerel menü rehberleri ve kullanıcı değerlendirmeleri',
        ],
      ],
      seat: 'Mesnevi Sokak üzerinde zarif, sakin mahalle fırın-kafe masaları',
      crowd: 'Mesnevi hattında sakin kahvaltı veya unsuz kek eşliğinde kahve molası arayanlar',
      dis: 'Mekân kapasitesi butik olduğundan kalabalık grup kahvaltıları için sınırlıdır',
      transit: 'Aziziye Mahallesi Mesnevi Sokağı No:19/A.',
      sources: [
        [
          'Menu-TR Sarah Bakery',
          'https://www.menu-tr.com/',
          'editorial',
          'Kahvaltı seçenekleri, unsuz portakallı-çikolatalı kek ve tiramisu menüsü',
        ],
        [
          'Yandex Haritalar Sarah Bakery',
          'https://yandex.com.tr/',
          'community',
          'Mesnevi Sokak konumu, kahve kalitesi ve atmosfer değerlendirmeleri',
        ],
      ],
      pros: ['Mesnevi Sokak dokusu içinde sakin sabah kahvaltısı ve nitelikli unsuz kek seçeneği', 'Dengeli servis hızı'],
      cons: ['Sınırlı masa adedi'],
      unc: ['Günlük pasta-kek vitrini saate göre değişebilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 6. DENEMELİSİN (6 Ayrancı & Aziziye & Güzeltepe özgün mahalle lezzeti)
    // =========================================================================
    compactSeed({
      id: 'ayranci-solepigastro',
      placeId: 'ChIJs78laCBP0xQRLhQfL1CjkB4',
      cat: 'denemelisin',
      name: 'SolePiGastro',
      brand: 'SolePiGastro',
      area: 'Mesnevi Sk. · Güvenevler, Ayrancı',
      signals: ['pizza-hamurundan-sandvic', 'vegan-mutfak-secenekleri', 'bes-puan-istikrari'],
      desc:
        'Mesnevi Sokak 20/B’de pizza hamurundan özel hazırlanan ekmeklerle çıkardığı özgün vegan ve gurme sandviçleri (köz kapya, kremalı patates, Meksika fasulyeli vb.), taze salataları ve ev patatesiyle yüksek misafir memnuniyeti biriktirmiş gizli gastronomi durağı.',
      order: ['Pizza Hamurundan Özel Vegan / Gurme Sandviç', 'Parmak Patates & Taze Salata'],
      menu: ['Pizza Hamuru Sandviçler', 'Vegan Özel Sandviç', 'Mevsim Salataları', 'Parmak Patates'],
      sec: [
        [
          'Güçlü Vegan Seçenekler & Özel Salatalar',
          'Klasik et sandviçleri dışında bitkisel beslenenler için de baştan sona özenli kremalı soslu sandviç ve salata çıkarır.',
          'İşletme menü kayıtları ve restoran değerlendirmeleri',
        ],
      ],
      seat: 'Mesnevi Sokak üzerinde butik gastro-sandviç tezgâhı ve samimi oturma düzeni',
      crowd: 'Özenle hazırlanmış hamurda gurme/vegan sandviç arayan Güvenevler sakinleri',
      dis: 'Küçük ölçekli bir gastro-sandviç dükkanıdır; uzun masa yemeği beklentisi yerine taze el yapımı sandviç sunar',
      transit: 'Güvenevler Mahallesi Mesnevi Sokağı No:20/B.',
      sources: [
        [
          'VenuesReyon SolePiGastro',
          'https://venuesreyon.com/',
          'editorial',
          'Pizza hamurundan ekmek, vegan sandviç reçetesi, patates ve salata menüsü',
        ],
        [
          'Restoranim SolePiGastro',
          'https://www.restoranim.net/',
          'community',
          'Mesnevi Sokak gastronomi değerlendirmeleri ve tam puana yakın memnuniyet',
        ],
      ],
      pros: ['Pizza hamuru ekmeğiyle ayrışan yaratıcı gurme ve vegan sandviç mutfağı', 'Yüksek puan istikrarı'],
      cons: ['Sınırlı kapasiteli sandviç dükkânı formatı'],
      unc: ['Günlük hamur hazırlığına bağlı olarak akşam geç saatlerde bazı çeşitler bitebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-mangiare',
      placeId: 'ChIJ3_ytcgBP0xQRNizg7pWGKlk',
      cat: 'denemelisin',
      name: 'Mangiare',
      brand: 'Mangiare',
      area: 'Yeşilyurt Sk. · Güvenevler, Ayrancı',
      signals: ['taze-focaccia-sandvic', 'roma-ve-livorno', 'tuf-mayonez-brisket'],
      desc:
        'Güvenevler Yeşilyurt Sokak’ta günlük taze fırınlanan focaccia ekmeğinin arasına sipariş anında hazırlanan Roma (roastbeef, pesto, isli peynir) ve Livorno (brisket, trüf mayonez) gibi İtalyan sokak sandviçleriyle ünlenen butik sandviççi.',
      order: ['Roma Focaccia Sandviç (Roastbeef & İsli Peynir)', 'Livorno (Brisket & Trüf Mayonez)', 'Günün Çorbası'],
      menu: ['Roma Sandviç', 'Livorno Sandviç', 'Como & Palermo Sandviç', 'Günün Çorbası & Ev Tatlıları'],
      sec: [
        [
          'Günün Çorbası & İtalyan Kahvaltı Alternatifleri',
          'Sipariş üzerine sıcak dilimlenen focaccia sandviçlerin yanında günlük çorba ve hafif ev tatlıları da bulunur.',
          'İşletme mutfak kayıtları ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Yeşilyurt Sokak üzerinde samimi birkaç masalık İtalyan sandviç barı',
      crowd: 'Fırından yeni çıkmış gerçek focaccia sandviç arayan öğle ve akşamüstü müdavimleri',
      dis: 'İç mekân küçük olduğu için yoğun öğle saatlerinde ayakta bekleme veya paket tercih edilebilir',
      transit: 'Güvenevler Mahallesi Yeşilyurt Sokak No:21/D.',
      sources: [
        [
          'Mangiare Resmi Sitesi',
          'https://mangiare.com.tr/',
          'operator',
          'Taze focaccia ekmeğiyle Roma, Como, Palermo, Livorno sandviç reçeteleri',
        ],
        [
          'Menu-TR Mangiare',
          'https://www.menu-tr.com/',
          'editorial',
          'Yeşilyurt Sk. konumu, brisket ve roastbeef sandviç incelemeleri',
        ],
        [
          'Restoranim Mangiare',
          'https://www.restoranim.net/',
          'editorial',
          'Focaccia kalitesi, çorba ve tatlı değerlendirmeleri',
        ],
      ],
      pros: ['Taze günlük focaccia hamuru ve dengeli soğuk-sıcak İtalyan şarküteri eşleşmeleri', 'Hızlı ve tutarlı kalite'],
      cons: ['Küçük oturma alanı nedeniyle kalabalık gruplara uygun değil'],
      unc: ['Focaccia partileri gün sonunda tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-hestia',
      placeId: 'ChIJq_bgiLJP0xQRRduY_xuHxX0',
      cat: 'denemelisin',
      name: 'Hestia',
      brand: 'Hestia',
      area: 'Mesnevi Cd. · Aziziye, Ayrancı',
      signals: ['ozel-fit-bowls', 'izgara-et-kase', 'vitamin-bar'],
      desc:
        'Mesnevi Caddesi 9/B’de taze Akdeniz yeşillikleri ve ızgara et-tavuk alternatifleriyle kişiselleştirilen besleyici kaseleri (bowls), meze çeşitleri ve taze sıkılmış Vitamin Bar içecekleriyle öne çıkan modern sağlıklı mutfak durağı.',
      order: ['Izgara Etli / Tavuklu Özel Bowl', 'Vişneli Brownie & Vitamin Bar İçecekleri'],
      menu: ['Özel Fit Kaseler (Bowls)', 'Izgara Et & Köfte', 'Meze Çeşitleri', 'Vişneli Brownie', 'Vitamin Bar'],
      sec: [
        [
          'Vitamin Bar & Vişneli Brownie Seçenekleri',
          'Hafif öğün kaselerine eşlik eden taze sıkım meyve-sebze suları ve ev yapımı vişneli brownie sunumuyla tamamlanır.',
          'İşletme mutfak menüsü ve restoran rehberleri',
        ],
      ],
      seat: 'Mesnevi Caddesi üzerinde aydınlık, modern ve temiz bistro salonu',
      crowd: 'Hamur işi ve fast-food dışında dengeli, taze malzemeli öğle veya akşam yemeği arayanlar',
      dis: 'Klasik Türk kebapçısı veya meyhane arayanlar yerine bowl ve sağlıklı bistro çizgisindedir',
      transit: 'Aziziye Mahallesi Mesnevi Caddesi No:9/B.',
      sources: [
        [
          'Dijital Menü Hestia',
          'https://dijital.menu/',
          'editorial',
          'Akdeniz yeşillikli kaseler, ızgara et/tavuk, brownie ve Vitamin Bar detayları',
        ],
        [
          'Restoranim Hestia Mesnevi',
          'https://www.restoranim.net/',
          'community',
          'Malzeme tazeliği, sağlıklı menü ve servis değerlendirmeleri',
        ],
      ],
      pros: ['Bölge içinde nadir bulunan tutarlı sağlıklı bowl ve ızgara bistrosu', 'Yüksek malzeme tazeliği'],
      cons: ['Geleneksel tencere yemeği çeşitliliği yok'],
      unc: ['Öğle saatlerinde çevredeki çalışan yoğunluğu nedeniyle servis uzayabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-kuzgundokuz',
      placeId: 'ChIJ771axtFP0xQR1HTzQvwX7kM',
      cat: 'denemelisin',
      name: 'Kuzgundokuz',
      brand: 'Kuzgundokuz',
      area: 'Kuzgun Cd., Ayrancı',
      signals: ['lavantali-balkabakli-cheesecake', 'ev-yapimi-sahlep', 'turk-kahvesi'],
      desc:
        'Ayrancı Kuzgun Caddesi No:9’da lavantalı, balkabaklı ve süt reçelli gibi özgün ev yapımı cheesecake çeşitlerini özenle pişirilen Türk kahvesi ve mevsiminde ev yapımı sahlep eşliğinde sunan yüksek hacimli mahalle klasiği.',
      order: ['Lavantalı / Balkabaklı / Süt Reçelli Cheesecake', 'Türk Kahvesi veya Ev Yapımı Sahlep'],
      menu: ['Özgün Cheesecake Çeşitleri', 'Türk Kahvesi', 'Ev Yapımı Sahlep', 'Kahve Seçkisi'],
      sec: [
        [
          'Mevsimlik Ev Yapımı Sahlep & Özgün Tatlı Vitrini',
          'Üçüncü dalga kahve barlarından ayrılarak özellikle ev yapımı sahlebi ve imza cheesecake reçeteleriyle Ayrancı’da ayrı bir yer edinmiştir.',
          'Şehir değerlendirmeleri ve tatlı rehberleri',
        ],
      ],
      seat: 'Kuzgun Caddesi üzerinde sıcak, sakin ve sohbete uygun butik kafe düzeni',
      crowd: 'Klasik pastane kalıplarının dışında özgün cheesecake, Türk kahvesi ve sahlep sevenler',
      dis: 'Ana yemek mutfağı yoktur; tatlı-kahve-sohbet durağıdır ve akşam yoğunlukta masa çabuk dolar',
      transit: 'Ayrancı Mahallesi Kuzgun Caddesi No:9.',
      sources: [
        [
          'Restoranim Kuzgundokuz',
          'https://www.restoranim.net/',
          'editorial',
          'Kuzgun Cd. No:9 konumu, lavantalı/balkabaklı cheesecake, sahlep ve Türk kahvesi',
        ],
        [
          'Yandex Haritalar Kuzgundokuz',
          'https://yandex.com.tr/',
          'community',
          'Yüksek değerlendirme istikrarı ve sakin mahalle atmosferi doğrulaması',
        ],
      ],
      pros: ['Yüksek ziyaretçi hacmine rağmen el yapımı cheesecake standardını koruması', 'Sahlep ve Türk kahvesi vurgusu'],
      cons: ['Tuzlu yemek yerine sadece tatlı-içecek odaklı'],
      unc: ['Hafta sonu öğleden sonra bazı özel cheesecake dilimleri erken tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-basbousa',
      placeId: 'ChIJF7e9PnRP0xQRCJmYkwCPwPE',
      cat: 'denemelisin',
      name: 'Basbousa - Şam Tatlı, Kömbe, Kaytaz Böreği',
      brand: 'Basbousa',
      area: 'Hoşdere Cd., Ayrancı',
      signals: ['unsuz-yagsiz-sam-tatlisi', 'hatay-kaytaz-boregi', 'biberli-ekmek'],
      desc:
        'Hoşdere Caddesi 29/B’de unsuz ve yağsız (ve vegan dostu) Antakya usulü ev yapımı Şam tatlısının yanı sıra Hatay kaytaz böreği, biberli ekmek ve kömbe gibi özgün yöresel hamur işlerini sunan tekil aile işletmesi.',
      order: ['Antakya Usulü Unsuz Şam Tatlısı', 'Kaytaz Böreği & Biberli Ekmek', 'Antakya Kömbesi'],
      menu: ['Unsuz Yağsız Şam Tatlısı', 'Kaytaz Böreği', 'Biberli Ekmek', 'Kömbe'],
      sec: [
        [
          'Tuzlu Hatay Fırını (Kaytaz Böreği & Biberli Ekmek)',
          'Şam tatlısı yanında günlük çıkan sıcak Antakya kaytaz böreği ve biberli ekmek öğle-ikindi atıştırması olarak rağbet görür.',
          'Yerel mahalle rehberleri ve menü kayıtları',
        ],
      ],
      seat: 'Küçük, tezgâh-paket ağırlıklı sade aile fırını dükkânı',
      crowd: 'Ağır şerbetli tatlılar yerine gerçek Hatay usulü hafif Şam tatlısı ve kaytaz böreği arayanlar',
      dis: 'Uzun kafe oturumu yerine eve/ayaküstü paket almaya daha uygun küçük bir dükkândır',
      transit: 'Ayrancı Mahallesi Hoşdere Caddesi No:29 D:B.',
      sources: [
        [
          'Ayrancım Basbousa İncelemesi',
          'https://ayrancim.org.tr/',
          'editorial',
          'Hoşdere aile işletmesi, unsuz-yağsız Şam tatlısı, kaytaz böreği ve kömbe detayları',
        ],
        [
          'Menu-TR Basbousa',
          'https://www.menu-tr.com/',
          'community',
          'Biberli ekmek, kaytaz böreği ve yöresel tatlı değerlendirmeleri',
        ],
      ],
      pros: ['Ankara’da tek çatı altında nadir bulunan özgün Hatay kaytaz böreği ve hafif Şam tatlısı', 'İçten aile işletmesi'],
      cons: ['Oturma alanı oldukça kısıtlı, ağırlıklı paket odaklı'],
      unc: ['Kaytaz böreği ve kömbe çeşitleri gün içinde tükendikçe yenilenir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'ayranci-kaymaklim-kunefe',
      placeId: 'ChIJFTrWr1BP0xQREhvH4-CzePk',
      cat: 'denemelisin',
      name: 'Kaymaklım künefe',
      brand: 'Kaymaklım',
      area: 'Hoşdere Cd., Ayrancı',
      signals: ['sicak-peynirli-kunefe', 'hasir-ve-atom-kunefe', 'ozel-baklava'],
      desc:
        'Hoşdere Caddesi 46/C’de günlük sipariş üzerine pişirilen peynirli, hasır ve fıstıklı atom künefe çeşitleri ile taze baklavalarını mahalle içinde akşam geç saatlere uzanan tatlı durağı olarak sunan butik künefeci.',
      order: ['Klasik Peynirli Künefe', 'Hasır / Atom Künefe'],
      menu: ['Peynirli Künefe', 'Hasır Künefe', 'Atom Künefe', 'Baklava Çeşitleri'],
      sec: [
        [
          'Sıcak Süt & Çay Eşliğinde Akşam Tatlısı',
          'Siparişle sıcak pişen künefe servisi sade dondurma veya süt eşlikçisiyle akşam sohbetlerinin tatlı kapanışı olur.',
          'Harita kayıtları ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Hoşdere Caddesi cephesinde sade, tatlı odaklı oturma salonu',
      crowd: 'Akşam yemeği sonrası Hoşdere hattında sıcak taze künefe yemek isteyenler',
      dis: 'Geleneksel şerbetli künefe dükkânıdır; hafif kafe pastanesi arayanlar için ağırdır',
      transit: 'Ayrancı Mahallesi Hoşdere Caddesi No:46 D:C.',
      sources: [
        [
          'TGO & Yemek Kayıtları Kaymaklım Künefe',
          'https://www.tgoyemek.com/',
          'editorial',
          'Peynirli, hasır, atom künefe ve baklava menüsü',
        ],
        [
          'Yandex Haritalar Kaymaklım Künefe',
          'https://yandex.com.tr/',
          'community',
          'Hoşdere Cd. konumu ve sıcak künefe memnuniyet notları',
        ],
      ],
      pros: ['Mahalle içinde siparişe göre sıcak pişirilen temiz Antep-Hatay künefesi', 'Akşam geç saatlere kadar tatlı erişimi'],
      cons: ['Küçük oturma alanı ve park güçlüğü'],
      unc: ['Akşam kalabalığında künefe pişirim sırası kısa bekleme yaratabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // NEGATİF DENETİM KONTROLLERİ (Politika Kapısı Audit Testi — 17 Kontrol)
    // =========================================================================
    negControl('ctrl-ayranci-terrapizza-chain', 'ChIJ1_Krk3BP0xQR_kROBsPdYXg', 'pizza', 'Çok şubeli Terra Pizza zinciri (Kapı 2)'),
    negControl('ctrl-ayranci-littlecaesars-chain', 'ChIJ54LdvYBF0xQRH34ExlpRvug', 'pizza', 'Çok şubeli Little Caesars zinciri (Kapı 2)'),
    negControl('ctrl-ayranci-tadimpizza-chain', 'ChIJS0YF6BxG0xQRrP130rzG7u4', 'pizza', 'Çok şubeli Tadım Pizza zinciri (Kapı 2)'),
    negControl('ctrl-ayranci-mamasburger-chain', 'ChIJtzvS5V1F0xQR466I3X_Qbpw', 'hamburger', 'Çok şubeli Mama’s Burger zinciri (Kapı 2)'),
    negControl('ctrl-ayranci-herdsbbq-chain', 'ChIJH430nwlF0xQRyNz3vI73y38', 'hamburger', 'Çok şubeli Herd’s BBQ & Burger (Kapı 2)'),
    negControl('ctrl-ayranci-coffeep22-chain', 'ChIJ1UfjqgNF0xQRxONHvaS5qJ8', 'kahve', 'Çok şubeli Coffee P22 zinciri (Kapı 2)'),
    negControl('ctrl-ayranci-ekleristan-chain', 'ChIJvVgfRrhP0xQRQvUCD_2r7eI', 'denemelisin', 'Çok şubeli Ekleristan zinciri (Kapı 2)'),
    negControl('ctrl-ayranci-kaymaklava-chain', 'ChIJ5ZHaq9VF0xQRpVVnNWaXYX0', 'denemelisin', 'Çok şubeli Kaymaklava zinciri (Kapı 2)'),
    negControl('ctrl-ayranci-3rdsebastian-chain', 'ChIJueGrGHZP0xQRJJFWjsx4OAc', 'denemelisin', 'Çok şubeli 3rdsebastian zinciri (Kapı 2)'),
    negControl('ctrl-ayranci-chocolateart-noncoffee', 'ChIJhd5YKoNP0xQRmE1ZVedMOWs', 'kahve', 'chocolate_shop primaryType kahve uzmanı değil (Kapı 3B)'),
    negControl('ctrl-ayranci-out-tunali-unica', 'ChIJI5XN5fRP0xQRyfftw9t0Bxc', 'pizza', 'Remzi Oğuz Arık Tunalı bölgesi kuzey sınır dışı (Kapı 4)'),
    negControl('ctrl-ayranci-out-yildiz-kuce', 'ChIJwY0dPZ9F0xQRj5PVf98RB9g', 'date', 'Yıldızevler mahallesi güney sınır dışı (Kapı 4)'),
    negControl('ctrl-ayranci-out-gop-origano', 'ChIJV4GK9CNP0xQRBk8H8Sm-myY', 'pizza', 'Kazım Özalp GOP doğu sınır dışı (Kapı 4)'),
    negControl('ctrl-ayranci-low-unbakery', 'ChIJPc9VnSFP0xQRAViG3MjA8-Y', 'kahvalti', '4.3 puan standart 4.4 eşiğinin altında (Kapı 6)'),
    negControl('ctrl-ayranci-low-letsbake', 'ChIJB2SXJpxP0xQREBBdsRw1aMo', 'kahvalti', '4.3 puan standart 4.4 eşiğinin altında (Kapı 6)'),
    negControl('ctrl-ayranci-low-nofork', 'ChIJvX7T1SJP0xQRvk3XWchiAak', 'hamburger', '4.3 puan standart 4.4 eşiğinin altında (Kapı 6)'),
    negControl('ctrl-ayranci-low-burgerdinho', 'ChIJ2QtiioFP0xQRHQxITz9nAc0', 'hamburger', '4.3 puan ve Burgerdinho zinciri (Kapı 2/6)'),
  ],
};
