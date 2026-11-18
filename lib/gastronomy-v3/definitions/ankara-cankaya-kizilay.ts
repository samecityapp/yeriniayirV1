import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ANKARA_CANKAYA_KIZILAY_DEF: V3RegionDefinition = {
  id: 'ankara-cankaya-kizilay',
  slug: 'kizilay',
  city: 'Ankara',
  district: 'Çankaya',
  allowedDistricts: ['Çankaya'],
  neighborhood: 'Kızılay',
  officialQuarter:
    'Kızılay, Meşrutiyet, Cumhuriyet, Kocatepe, Kültür & Korkutreis Mahalleleri (Atatürk Bulvarı, Karanfil, Konur, Selanik, Sakarya, Yüksel, Bayındır, İnkılap, İzmir & Necatibey Aksları)',
  displayName: 'Kızılay, Çankaya, Ankara',
  locative: "Kızılay'da",
  path: ['ankara', 'cankaya', 'kizilay'],
  aliases: [
    'Kızılay',
    'Kizilay',
    'Kızılay Ankara',
    'Kızılay Çankaya',
    'Kızılay Merkez',
    'Kocatepe Ankara',
    'Karanfil Sokak',
    'Konur Sokak',
    'Selanik Caddesi',
    'Sakarya Caddesi Kızılay',
    'Yüksel Caddesi',
    'Kumrular',
    'Necatibey',
    'Meşrutiyet Kızılay',
  ],
  scopeNote:
    'Kızılay (Akay Kavşağı kuzeyinde kalan Kızılay, Meşrutiyet, Cumhuriyet, Kocatepe, Kültür & Korkutreis; Tunalı/Kavaklıdere, Ulus ve Maltepe hariç) · Doğrulanmış Seçki',
  characterSubtitle:
    'Necatibey’den Konur, Karanfil, Selanik ve Bayındır sokaklarına uzanan taş fırın pizza ve tek şubeli burger noktaları, pasaj ve ara sokak nitelikli kahve kavurucuları, 1945–1984 mirası esnaf lokantaları, kömür ateşinde yaprak döner ve gece işkembecisi seçkisi.',
  center: { lat: 39.9205, lng: 32.8542 },
  bbox: { minLat: 39.9132, maxLat: 39.9278, minLng: 32.8435, maxLng: 32.8645 },
  allowedNeighborhoodTokens: [
    'Kızılay',
    'Kizilay',
    'Meşrutiyet',
    'Mesrutiyet',
    'Cumhuriyet',
    'Kocatepe',
    'Kültür',
    'Kultur',
    'Korkutreis',
    'Sağlık',
    'Saglik',
    'Devlet',
  ],
  categories: buildRegionCategories(),
  candidates: [
    // =========================================================================
    // 1. PİZZA (1 tek şubeli Necatibey pizzacısı; dolgusuz)
    // =========================================================================
    compactSeed({
      id: 'kizilay-fornellas-pizza',
      placeId: 'ChIJb5_wjetP0xQR-Zuq3Kvkl1A',
      cat: 'pizza',
      name: "Fornella'S Pizza",
      brand: 'fornella',
      area: 'Necatibey Cd., Kızılay',
      signals: ['ince-hamur-pizza', 'necatibey-cadde', 'vegan-secenekler'],
      desc:
        'Necatibey Caddesi üzerinde ince hamurlu el açması pizzaları, dengeli sos reçeteleri ve klasik çeşitlerin yanındaki vegan seçenekleriyle Kızılay merkezinde yüksek beğeni toplayan bağımsız pizza dükkânı.',
      order: ['Karışık İnce Hamur Pizza', 'Dört Peynirli Pizza', 'Vegan Sebzeli Pizza'],
      menu: ['Margherita Pizza', 'Kavurmalı Pizza', 'Dört Peynirli Pizza', 'Vegan Pizza'],
      sec: [
        [
          'Vegan & Sebzeli Hamur Çeşitliliği',
          'Klasik şarküteri pizzalarının yanında bitki bazlı peynir ve köz sebze alternatifleriyle farklı beklentilere yanıt veriyor.',
          'venuesreyon.com ve Menu-TR Kızılay kayıtları',
        ],
      ],
      seat: 'İç masa düzeni ve Necatibey Caddesi üzeri pratik oturum alanı',
      crowd: 'Öğle ve akşam saatlerinde Demirtepe-Necatibey çalışanları ve genç misafirlerle canlı',
      dis: 'Demirtepe tarafında kaldığı için Karanfil-Konur yaya aksından kısa bir yürüyüş gerektiriyor.',
      transit: 'Kızılay, Necatibey Caddesi No:27/B (Demirtepe metro durağı yürüme mesafesi).',
      sources: [
        [
          'Menu-TR Kızılay Pizza',
          'https://menu-tr.com/',
          'editorial',
          'Necatibey Cd. oturma düzeni ve ince hamurlu pizza incelemesi',
        ],
        [
          'VenuesReyon Ankara',
          'https://venuesreyon.com/',
          'community',
          'Klasik ve vegan pizza çeşitleriyle yerel topluluk beğenisi',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '130+ değerlendirmeyle Kızılay merkezinin en yüksek puanlı pizzacısı',
        ],
      ],
      pros: ['Hafif ince hamur ve dengeli malzeme oranı', 'Klasik etli seçeneklerin yanında vegan alternatifler sunması'],
      cons: ['Kızılay’ın Konur-Karanfil merkez çarşısına göre biraz daha batı yakasında kalıyor'],
      unc: ['Akşam paket servis yoğunluğunda masa siparişlerinin çıkışı biraz uzayabiliyor.'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 2. HAMBURGER (1 Kültür/Sağlık-2 tek şubeli butik burgerci; dolgusuz)
    // =========================================================================
    compactSeed({
      id: 'kizilay-bunzilla-burger',
      placeId: 'ChIJzROpbyBP0xQR3aAu9zK7ne4',
      cat: 'hamburger',
      name: 'Bunzilla Burger',
      brand: 'bunzilla',
      area: 'Sağlık-2 Sk., Kızılay',
      signals: ['brioche-ekmek', 'ev-yapimi-dana-kofte', 'ozel-soslar'],
      desc:
        'Kültür Mahallesi Sağlık-2 Sokak’ta günlük hazırlanan dana köftesi, yumuşak brioche ekmeği ve yüksek gramajlı imza soslu burgerleriyle Kızılay’da zincirlere bağımsız alternatif sunan burger dükkânı.',
      order: ['Bunzilla Special Burger', 'Truffle & Karamelize Soğan Burger', 'Baharatlı Patates Kızartması'],
      menu: ['Classic Cheese Burger', 'Bunzilla Special', 'Crispy Chicken Burger', 'Cheddar Patates'],
      sec: [
        [
          'Çıtır Soğan & İmza Sos Eşleştirmeleri',
          'Yumuşak brioche ekmek yapısını dengeleyen sarımsaklı ve karamelize soğanlı sos seçenekleri burgerlerin yanında öne çıkıyor.',
          'bunzillaburger.com.tr ve Menu-TR Kültür kayıtları',
        ],
      ],
      seat: 'Kompakt iç salon masaları ve sokak önü oturumu',
      crowd: 'Üniversite öğrencileri ve öğle-akşam arası doyurucu burger arayanlarla yoğun',
      dis: 'Küçük sokak dükkânı ölçüsünde olduğu için kalabalık gruplarda masa bulmak zorlaşabiliyor.',
      transit: 'Kültür Mahallesi Sağlık-2 Sokak No:52/A (Kolej ve Kızılay metro arası yaya hattı).',
      sources: [
        [
          'Bunzilla Burger Resmi Sitesi',
          'https://www.bunzillaburger.com.tr/',
          'operator',
          'Sağlık-2 Sk. menü, brioche ekmek ve dana köfte bilgisi',
        ],
        [
          'Menu-TR Kültür & Çankaya',
          'https://menu-tr.com/',
          'editorial',
          'Porsiyon doyuruculuğu ve ev yapımı sos dengesi incelemesi',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '154+ değerlendirmeyle Kızılay içinde yüksek puanlı tekil burgerci',
        ],
      ],
      pros: ['Sulu dana köftesi ve taze brioche ekmeği', 'Zincir kalıplarının dışında cömert porsiyonlar'],
      cons: ['Kapalı oturma alanı sınırlı ve pik saatlerde kurye trafiği yoğun olabiliyor'],
      unc: ['Yoğun akşam servisinde sıcak patates ve sos stoğu hızlı tükenebiliyor.'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 3. KAHVE (4 saf 3. nesil kavurucu / espresso bar; çikolatacı hariç)
    // =========================================================================
    compactSeed({
      id: 'kizilay-verte-coffee',
      placeId: 'ChIJu38xAyhP0xQRjRIRycvj29M',
      cat: 'kahve',
      name: 'Verte Coffee House',
      brand: 'verte',
      area: 'Sümer-2 Cd., Kızılay',
      signals: ['ucuncu-nesil-demleme', 'cold-brew', 'ferah-calisma-alani'],
      desc:
        'Sümer-2 Caddesi’nde ana cadde uğultusundan sıyrılan ferah iç mekanı, özenli V60 ve cold brew reçeteleriyle Kızılay merkezinin en yüksek memnuniyetli bağımsız üçüncü nesil kahve evi.',
      order: ['V60 Tek Köken Filtre Kahve', 'Soğuk Demleme Cold Brew', 'Cortado'],
      menu: ['Espresso', 'Flat White', 'V60', 'Cold Brew', 'San Sebastian Cheesecake'],
      sec: [
        [
          'Ev Yapımı Tatlı & Kahve Eşliği',
          'Sade espresso barı çizgisini bozmadan kahvenin yanına taze cheesecake ve kurabiye alternatifleri eşlik ediyor.',
          'vertecoffeehouse.com ve Ankara kahve rehberleri',
        ],
      ],
      seat: 'Doğal ışıklı ferah iç oturum ve çalışma masaları',
      crowd: 'Gündüz çalışanlar, öğrenciler ve sakin nitelikli kahve arayan müdavimler',
      dis: 'Günün ortasında ders ve laptop çalışanları nedeniyle sessiz köşe masaları erken dolabiliyor.',
      transit: 'Kızılay Mahallesi Sümer-2 Caddesi No:24-A (Kumrular ve Necatibey arası).',
      sources: [
        [
          'Verte Coffee House Resmi Sitesi',
          'https://www.vertecoffeehouse.com/',
          'operator',
          'Sümer-2 Cd. tekil konum ve kahve seçkisi',
        ],
        [
          'Yandex Maps Kızılay Topluluğu',
          'https://yandex.com.tr/',
          'community',
          'Cold brew kalitesi ve ferah iç mekan vurgusu',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '1.122+ değerlendirmeyle Kızılay merkezinin en yüksek puanlı kahve evi',
        ],
      ],
      pros: ['Yüksek hacme rağmen demleme tutarlılığını koruyan ekip', 'Ana kalabalığın hemen yanında sakin sokak konumu'],
      cons: ['Öğleden sonra çalışma masalarında yer bulmak beklemeyi gerektirebiliyor'],
      unc: ['Misafir kavrum tek köken çekirdekler sezona göre değişebiliyor.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-melanj-coffee',
      placeId: 'ChIJmVQKYyBP0xQRdstY9F678wQ',
      cat: 'kahve',
      name: 'Melanj Coffee Roastery',
      brand: 'melanj',
      area: 'Şht. Adem Yavuz Sk., Kızılay',
      signals: ['kendi-kavrumu-roastery', 'caz-atmosferi', 'butik-espresso-bar'],
      desc:
        'Şehit Adem Yavuz Sokak’ta kendi çekirdeklerini kavuran, caz müzik yayını eşliğinde nitelikli filtre ve espresso servisi sunan Kızılay’ın samimi mikro kahve kavurma atölyesi.',
      order: ['Günlük Kavrum Filtre Kahve', 'Flat White', 'AeroPress'],
      menu: ['V60 Pour Over', 'AeroPress', 'Flat White', 'Iced Latte', 'Taze Çekirdek Satışı'],
      sec: [
        [
          'Taze Kavrulmuş Çekirdek Paketleri',
          'Dükkan içinde içilen demlemelerin yanı sıra ev tipi öğütüm yaptırılabilen taze kavrum paket çekirdekler temin edilebiliyor.',
          'Menu-TR ve Yandex Kızılay değerlendirmeleri',
        ],
      ],
      seat: 'Küçük butik iç bar ve sokak önü birkaç tabure',
      crowd: 'Kaliteli çekirdek ve sakin müzik eşliğinde kısa kahve molası veren kahve meraklıları',
      dis: 'Büyük zincirler gibi geniş toplantı masaları yok; kısa kahve molası düzeninde işliyor.',
      transit: 'Kızılay Mahallesi Şehit Adem Yavuz Sokak No:15/A (Atatürk Bulvarı batı cephesi).',
      sources: [
        [
          'Menu-TR Kızılay Roastery',
          'https://menu-tr.com/',
          'editorial',
          'Kendi kavurma atölyesi ve nitelikli demleme odaklı butik dükkan incelemesi',
        ],
        [
          'Yandex Maps Kızılay Topluluğu',
          'https://yandex.com.tr/',
          'community',
          'Caz atmosferi ve taze kavrum çekirdek övgüleri',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '452+ değerlendirmeyle istikrarlı mikro kavurucu profili',
        ],
      ],
      pros: ['Şehir merkezinde kendi çekirdeğini kavuran nadir bağımsız dükkanlardan', 'Sıcak ve gürültüsüz atmosfer'],
      cons: ['Oturma alanı kompakt olduğundan kalabalık gruplara uygun değil'],
      unc: ['Haftalık kavrum takvimine göre farklı yöre çekirdekleri raflarda yer değiştiriyor.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-ziryab-coffee',
      placeId: 'ChIJK6uQdhpP0xQRDGoJZberxMA',
      cat: 'kahve',
      name: 'Ziryab Coffee and Culture',
      brand: 'ziryab',
      area: 'Hatay Sk., Kızılay',
      signals: ['kultur-ve-kahve', 'kocatepe-sokak', 'sakin-tempo'],
      desc:
        'Kocatepe Hatay Sokak’ta kültür ve sohbet odağını nitelikli kahve servisiyle birleştiren, Kızılay çarşı trafiğinin hemen dışında dingin bir buluşma alanı sunan bağımsız kahve dükkânı.',
      order: ['Single Origin Filtre Kahve', 'Latte', 'Türk Kahvesi'],
      menu: ['Espresso Çeşitleri', 'Filtre Kahve', 'Türk Kahvesi', 'Bitki Çayları'],
      sec: [
        [
          'Kültür Sohbetleri & Çay-Kahve Ritüeli',
          'Klasik kahve servisine ek olarak geleneksel demleme çay ve sakin okuma-sohbet düzeniyle öne çıkıyor.',
          'Restoranım.net ve Yandex Kocatepe kayıtları',
        ],
      ],
      seat: 'Rahat ahşap iç salon masaları ve sakin sokak cephesi',
      crowd: 'Kocatepe çevresinden gelen kitap, kültür ve kahve müdavimleri',
      dis: 'Merkezi metro çıkışına göre hafif yokuşlu Kocatepe arka sokağında yer alıyor.',
      transit: 'Kocatepe Mahallesi Hatay Sokak No:23/B (Kocatepe Camii batı aksı).',
      sources: [
        [
          'Restoranım.net Kocatepe',
          'https://restoranim.net/',
          'editorial',
          'Kocatepe Hatay Sk. kültür ve kahve atmosferi değerlendirmesi',
        ],
        [
          'Yandex Maps Kocatepe',
          'https://yandex.com.tr/',
          'community',
          'Güler yüzlü hizmet ve sakin çalışma-sohbet ortamı notları',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '174+ misafirden yüksek puan ortalaması',
        ],
      ],
      pros: ['Konur-Karanfil kalabalığından tamamen izole sessiz Kocatepe sokağı', 'Kültür ve kahveyi buluşturan samimi ortam'],
      cons: ['Geniş mutfak veya tatlı vitrini yerine içecek odaklı sade menü sunuyor'],
      unc: ['Hafta sonu etkinlik veya sohbet saatlerinde iç salon doluluk gösterebiliyor.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-ade-miel-coffee',
      placeId: 'ChIJQ5E2vElP0xQREwMBgPjDcL8',
      cat: 'kahve',
      name: 'Ade Miel Coffee Shop',
      brand: 'ade miel',
      area: 'Hatay Sk., Kızılay',
      signals: ['ucuncu-nesil-cekirdek', 'sandvic-ve-espresso', 'kocatepe-duragi'],
      desc:
        'Hatay Sokak’ta üçüncü nesil çekirdek kahve demlemelerini taze soğuk-sıcak sandviç çeşitleriyle tamamlayan, Kocatepe yokuşunda düzenli espresso kalitesi sunan bağımsız kahve barı.',
      order: ['Double Shot Americano', 'Cortado', 'Pesto & Mozzarella Sandviç'],
      menu: ['Espresso', 'Cortado', 'Iced Latte', 'Taze Sandviçler', 'Brownie'],
      sec: [
        [
          'Günlük Taze Sandviç Eşlikçileri',
          'Sadece tatlı değil hafif tuzlu sandviç seçeneklerinin kahve yanında taze hazırlanması öğle molalarını kolaylaştırıyor.',
          'ademielcoffee.com ve Yandex Kocatepe kayıtları',
        ],
      ],
      seat: 'Modern iç oturum, çalışma köşeleri ve küçük sokak masaları',
      crowd: 'Yakın ofis çalışanları ve Kocatepe sakinleriyle gün boyu dengeli yoğunluk',
      dis: 'Kocatepe eğiminde bulunduğu için yürüyüşle çıkarken kısa bir yokuş mesafesi içeriyor.',
      transit: 'Kocatepe Mahallesi Hatay Sokak No:15/A.',
      sources: [
        [
          'Ade Miel Coffee Resmi Sitesi',
          'https://www.ademielcoffee.com/',
          'operator',
          'Nitelikli kahve yaklaşımı ve tek şube konum bilgisi',
        ],
        [
          'Yandex Maps Kocatepe',
          'https://yandex.com.tr/',
          'community',
          'Espresso dengesi ve sandviç tazeliği övgüleri',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '463+ misafirden yüksek istikrar puanı',
        ],
      ],
      pros: ['Kahve yanında hafif ve taze sandviç bulmak kolay', 'Düzenli kavrum ve süt köpüğü standardı'],
      cons: ['Sokak üzerinde otopark imkanı kısıtlı'],
      unc: ['Akşam geç saatlerde taze sandviç çeşitlerinin sayısı azalabiliyor.'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 4. DATE MEKANLARI (2 köklü akşam / sofra klasiği; 1963 & 1974 mirası)
    // =========================================================================
    compactSeed({
      id: 'kizilay-goksu-lokantasi',
      placeId: 'ChIJW71JsEFP0xQRx0xZtJcHqbA',
      cat: 'date',
      name: 'Göksu Lokantası (Kızılay)',
      brand: 'göksu',
      area: 'Bayındır-1 Sk., Kızılay',
      signals: ['1963-ankara-klasiği', 'beyaz-masa-ortulu', 'anadolu-ve-osmanli-mutfagi'],
      desc:
        '1963’ten bu yana Bayındır Sokak’ta beyaz masa örtülü salonu, klasik servis adabı, zengin soğuk-sıcak meze masası ve Osmanlı-Anadolu mutfağıyla Kızılay’ın en ağırbaşlı akşam yemeği ve randevu adresi.',
      order: ['Tereyağlı Ankara Tava / Kuzu Tandır', 'Hünkar Beğendi', 'Seçme Meze Tabağı'],
      menu: ['Hünkar Beğendi', 'Kuzu Tandır', 'Deniz Ürünleri', 'Soğuk Mezeler', 'Fırın Sütlaç'],
      sec: [
        [
          'Klasik Kadeh Eşlikleri & Tatlı Kapanışı',
          'Uzun akşam sofralarına uygun meze seçkisi, et yemekleri sonrası irmik ve sütlü tatlı ikramlarıyla tamamlanıyor.',
          'goksulokantasi.com arşivi ve Restoranım.net incelemesi',
        ],
      ],
      seat: 'Beyaz örtülü şık ana salon ve özenli akşam masaları',
      crowd: 'İş yemekleri, yıldönümü çiftleri ve köklü Ankara müdavimleriyle nezih atmosfer',
      dis: 'Geleneksel şık lokanta düzeni ve geniş porsiyonlarıyla hızlı/ekonomik sokak duraklarından daha yüksek bütçe segmentinde; akşam masaları rezervasyon istiyor.',
      transit: 'Kızılay Cumhuriyet Mahallesi Bayındır-1 Sokak No:22 (Kızılay Metro doğu çıkışı).',
      sources: [
        [
          'Göksu Lokantası Resmi Arşivi',
          'https://goksulokantasi.com/',
          'operator',
          '1963 kuruluş tarihi, Bayındır-1 Sk. adresi ve Osmanlı-Anadolu mutfak seçkisi',
        ],
        [
          'Restoranım.net & Önerimekan',
          'https://restoranim.net/',
          'editorial',
          'Ankara kent belleğindeki klasik servis kültürü ve meze masası profili',
        ],
        [
          'Yandex Maps Bayındır',
          'https://yandex.com.tr/',
          'community',
          'Hünkar beğendi, kuzu tandır ve akşam servisi değerlendirmeleri',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '2.575+ misafirle Kızılay’ın en yüksek puanlı köklü lokantası',
        ],
      ],
      pros: ['Yarım asrı aşan özenli garson servisi ve klasik Ankara ruhu', 'Çiftler ve özel akşam yemekleri için gürültüsüz, şık düzen'],
      cons: ['Akşam ve hafta sonları önceden masa ayırtmadan yer bulmak zor olabiliyor'],
      unc: ['Tarihî Bayındır şubesi dışında Nenehatun şubesi de bulunduğundan rezervasyonu Kızılay şubesine teyit etmek önemli.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-ozen-lokantasi',
      placeId: 'ChIJWw99S1VO0xQRiUKqYJ8DOkc',
      cat: 'date',
      name: 'Özen Lokantası (Piliç & Meyhane)',
      brand: 'özen lokantası',
      area: 'İnkılap Sk., Kızılay',
      signals: ['1974-kizilay-klasiği', 'pilic-cevirme-ve-meze', 'nostaljik-meyhane'],
      desc:
        '1974 yılından beri İnkılap Sokak’ta kızarmış piliç çevirmesi, günlük taze mezeleri ve gösterişsiz Ankara meyhanesi sıcaklığıyla nesillerdir aynı adresinde buluşma kültürünü yaşatan Kızılay efsanesi.',
      order: ['Piliç Çevirme & İç Pilav', 'Günlük Soğuk Meze Tabağı', 'Arnavut Ciğeri'],
      menu: ['Piliç Çevirme', 'Arnavut Ciğeri', 'Yoğurtlu & Zeytinyağlı Mezeler', 'Izgaralar'],
      sec: [
        [
          'Arnavut Ciğeri & Fava Eşlikçileri',
          'Piliç çevirme klasiğinin öncesinde masaya gelen sıcak ciğer ve sade mezeler uzun sohbet sofralarını kuruyor.',
          'Menu-TR ve Yandex Kızılay değerlendirmeleri',
        ],
      ],
      seat: 'Nostaljik kapalı meyhane salonu ve İnkılap Sokak masaları',
      crowd: 'Sanatçılar, gazeteciler, bürokratlar ve eski Ankara ruhunu seven akşam grupları',
      dis: 'Modern kokteyl bar ambiyansı değil, yüksek sohbetli klasik salaş Ankara meyhanesi temposunda.',
      transit: 'Kızılay İnkılap Sokak No:5/F (Sakarya Caddesi hemen paraleli).',
      sources: [
        [
          'Menu-TR İnkılap & Kızılay',
          'https://menu-tr.com/',
          'editorial',
          'Piliç çevirme, günlük taze mezeler ve nostaljik meyhane profili',
        ],
        [
          'Yandex Maps Kızılay Topluluğu',
          'https://yandex.com.tr/',
          'community',
          '1974 kuruluş mirası ve samimi meyhane kültürü notları',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '145+ misafirle köklü Sakarya-İnkılap klasiği',
        ],
      ],
      pros: ['1974’ten beri değişmeyen samimi Ankara meyhanesi karakteri', 'Ulaşılabilir meze ve piliç dengesi'],
      cons: ['Cuma ve cumartesi akşamları gürültü seviyesi yüksek ve masalar dolu olabiliyor'],
      unc: ['Hafta sonu akşamları erken saatte gelmek veya önceden haber vermek yararlı.'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 5. KAHVALTI (1 tekil Kızılay kitap-kafe kahvaltıcısı; dolgusuz)
    // =========================================================================
    compactSeed({
      id: 'kizilay-mekan-kafe',
      placeId: 'ChIJhxbdVlVO0xQRA2PRBQDA-1E',
      cat: 'kahvalti',
      name: 'Mekan Kafe Kitab & Kahve',
      brand: 'mekan kafe',
      area: 'Atatürk Blv., Kızılay',
      signals: ['kitap-ve-kahvalti', 'ataturk-bulvari', 'sakin-sabah-oturumu'],
      desc:
        'Atatürk Bulvarı üzerinde Kızılay’ın merkezinde kitap raflarıyla çevrili sakin atmosferinde kahvaltı tabağı, tost ve taze demleme çay-kahve eşliğiyle güne dingin başlama noktası.',
      order: ['Klasik Kahvaltı Tabağı & Demli Çay', 'Kaşarlı & Sucuklu Tost', 'Filtre Kahve'],
      menu: ['Kahvaltı Tabağı', 'Omlet', 'Tost Çeşitleri', 'Filtre Kahve', 'Demli Çay'],
      sec: [
        [
          'Okuma & Çalışma Sabahları',
          'Sabah kahvaltısı sonrası kitap okuyarak veya çalışarak uzun süre oturulabilen nadir merkezi Kızılay mekanlarından.',
          'AnkaraKahve.com ve Yandex Kızılay kayıtları',
        ],
      ],
      seat: 'Kitaplıklı iç salon masaları ve sakin okuma bölümleri',
      crowd: 'Sabah öğrencileri, okurlar ve merkezde sakin kahvaltı arayanlar',
      dis: 'Atatürk Bulvarı üzerinde üst kat/bina düzeninde olduğu için giriş tabelasına dikkat etmek gerekiyor; serpme kahvaltıdan ziyade pratik tabak odaklı.',
      transit: 'Kızılay Mahallesi Atatürk Bulvarı No:88/1 (Kızılay Meydanı ve Zafer Çarşısı hattı).',
      sources: [
        [
          'Ankara Kahve & Kitap Kafe Rehberi',
          'https://ankarakahve.com/',
          'editorial',
          'Atatürk Bulvarı üzeri kitap kafe, kahvaltı ve sakin oturum profili',
        ],
        [
          'Yandex Maps Kızılay',
          'https://yandex.com.tr/',
          'community',
          'Sakin ortam ve kahvaltı/çalışma uygunluğu değerlendirmeleri',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '641+ değerlendirmeyle istikrarlı Kızılay buluşma adresi',
        ],
      ],
      pros: ['Şehir göbeğinde gürültüden izole sakin sabah temposu', 'Ekonomik ve ulaşılabilir kahvaltı tabağı'],
      cons: ['Geniş serpme masa bekleyen kalabalık gruplara hitap etmiyor'],
      unc: ['Sınav dönemleri ve öğleye doğru masa doluluğu hızla artabiliyor.'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 6. MUTLAKA DENEMELİSİN (10 Kızılay lokanta, döner, işkembe & tatlı klasiği)
    // =========================================================================
    compactSeed({
      id: 'kizilay-tarihi-cicim',
      placeId: 'ChIJbeYAOABP0xQRTRjquEs4UNs',
      cat: 'denemelisin',
      name: 'Tarihi Cicim Lokantası',
      brand: 'tarihi cicim',
      area: 'İzmir-2 Cd., Kızılay',
      signals: ['50-yillik-esnaf-lokantasi', 'gunluk-sulu-yemek', 'turtes-is-hani'],
      flags: { heritage: true },
      desc:
        'Yarım asrı aşan geçmişiyle İzmir-2 Caddesi’nde her öğle taze çıkan kuru fasulye, İzmir köfte, ciğer sote ve ev yemekleriyle Kızılay’ın en yüksek puanlı klasik esnaf lokantası.',
      order: ['Etli Kuru Fasulye & Tereyağlı Pilav', 'İzmir Köfte', 'Tavuk Haşlama'],
      menu: ['Kuru Fasulye', 'Nohut', 'İzmir Köfte', 'Ciğer Sote', 'Zeytinyağlılar', 'Sütlaç'],
      sec: [
        [
          'Geleneksel Tezgâh Sulu Yemek & Tatlı Kapanışı',
          'Sabah erken pişen zeytinyağlılar ve ev yapımı sütlü tatlılar ana yemekle birlikte hızlıca seçilebiliyor.',
          'Restoranım.net ve Yandex İzmir Cd. kayıtları',
        ],
      ],
      seat: 'Klasik esnaf lokantası iç salon masaları',
      crowd: 'Öğle saatlerinde bölge esnafı, avukatlar ve beyaz yakalı çalışanlarla yoğun',
      dis: 'Gündüz esnaf temposunda işlediği için bazı gözde yemekler öğleden sonra erken bitebiliyor.',
      transit: 'Kızılay Mahallesi İzmir-2 Caddesi No:34 D:15 (Turtes İş Hanı).',
      sources: [
        [
          'Restoranım.net Kızılay Esnaf',
          'https://restoranim.net/',
          'editorial',
          '50+ yıllık esnaf geleneği ve ev yemekleri menüsü',
        ],
        [
          'Yandex Maps İzmir Cd.',
          'https://yandex.com.tr/',
          'community',
          'Kuru fasulye, İzmir köfte ve porsiyon tazeliği övgüleri',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '273+ misafirle Ankara merkez lokantaları arasında zirve puan',
        ],
      ],
      pros: ['Gerçek ev yemeği tadını ve temiz mutfak düzenini 50 yıldır koruyor', 'Hızlı ve samimi servis'],
      cons: ['Akşam geç saatlere açık bir restoran değil, öğle ağırlıklı çalışıyor'],
      unc: ['Öğle yoğunluğu saatlerinde aynı masayı paylaşmak veya kısa beklemek gerekebiliyor.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-cici-piknik',
      placeId: 'ChIJDSrCHAFP0xQRg1-nOOhtth8',
      cat: 'denemelisin',
      name: 'Cici Piknik',
      brand: 'cici piknik',
      area: 'Kumrular Cd., Kızılay',
      signals: ['1984-komur-atesi-doner', 'ankara-yaprak-doner', 'kuyruklu-efsane'],
      flags: { heritage: true, ritual: true },
      desc:
        '1984’ten bu yana Kumrular’da ufacık dükkânında yalnızca kömür ateşinde pişirdiği ince kıyım yaprak dana döneriyle öğle saatlerinde önünde kuyruklar oluşturan Ankara gastronomi simgesi.',
      order: ['Kömür Ateşinde Ekmek Arası Et Döner', 'Porsiyon Yaprak Döner', 'Açık Ayran'],
      menu: ['Ekmek Arası Et Döner', 'Dürüm Döner', 'Porsiyon Döner', 'Ayran'],
      sec: [
        [
          'Taze Fırın Ekmeği & Turşu Biber Eşliği',
          'Domates veya ağır soslarla boğulmayan çıtır ekmek içi et döner yalnızca tuz ve taze malzemelerle servis ediliyor.',
          'Milliyet / Türk Aşçı Haberleri Ankara döner dosyaları',
        ],
      ],
      seat: 'Ayaküstü tezgâh düzeni ve sınırlı dar iç/dış tabure',
      crowd: 'Özellikle öğle arasında memurlar, eski Ankaralılar ve gastronomi meraklılarından uzun kuyruk',
      dis: 'Çok dar mekan ve yüksek talep nedeniyle öğleden sonra döner bitebiliyor; geniş oturma alanı yok, hızlı ve sıkışık tempoda yeniyor.',
      transit: 'Kızılay Kumrular Caddesi No:8/C (Necatibey-Atatürk Bulvarı arası).',
      sources: [
        [
          'Milliyet & Türk Aşçı Haberleri',
          'https://www.milliyet.com.tr/',
          'editorial',
          'Kızılay’ın 1980’ler piknik kültürü ve kömür ateşinde Ankara döneri dosyası',
        ],
        [
          'Ankara.com & HangiMekan',
          'https://www.ankara.com/',
          'community',
          'Kumrular önünde kuyruk oluşturan et döner lezzeti değerlendirmeleri',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '3.072+ değerlendirmeyle şehrin yaşayan döner ritüeli',
        ],
      ],
      pros: ['Sosu gizlemeden gerçek kömürde yaprak et döner lezzeti vermesi', '40 yıllık otantik büfe ruhu'],
      cons: ['Döner tükendiğinde erken kapanabiliyor ve geniş masa imkanı yok'],
      unc: ['Hafta içi öğle vaktinde 10–15 dakikalık kuyruk beklemek olağan.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-rumeli-iskembecisi',
      placeId: 'ChIJGU-QwlRO0xQRzh1Y1RNyQ_M',
      cat: 'denemelisin',
      name: 'Rumeli İşkembecisi (1945)',
      brand: 'rumeli',
      area: 'Bayındır-1 Sk., Kızılay',
      signals: ['1945-koklu-corbaci', 'iskembe-ve-tuzlama', 'gece-klasiği'],
      flags: { heritage: true, ritual: true },
      desc:
        'Kökleri 1945’e uzanan geçmişiyle Bayındır Sokak’ta günün her saati sıcak işkembe, tuzlama, damar ve paça çorbalarıyla Ankara’nın gece ve sabah ritüelinin temel direği.',
      order: ['Tuzlama / Damar Çorbası', 'Karışık İşkembe', 'Kelle Paça'],
      menu: ['İşkembe', 'Tuzlama', 'Damar', 'Şırdan Dolması', 'Kelle Paça', 'Sarımsaklı Sirke'],
      sec: [
        [
          'Sarımsaklı Sirke & Kızarmış Ekmek Masası',
          'Masada bekleyen taze sarımsaklı sirke, acı biber ve bol tereyağlı sos ikramı çorbanın karakterini tamamlıyor.',
          'rumeliiskembecisi.com.tr ve Türkiye Turizm Ansiklopedisi',
        ],
      ],
      seat: 'Büyük, aydınlık geleneksel çorbacı salon masaları',
      crowd: 'Gece tiyatro-meyhane çıkışı Ankaralılar, sabah erken çalışanlar ve geleneksel lezzet arayanlar',
      dis: 'Günün bazı saatlerinde çok kalabalık sirkülasyon ve yoğun sakatat mutfağı kokusu sebebiyle herkesin damağına veya beklentisine hitap etmeyebilir.',
      transit: 'Cumhuriyet Mahallesi Bayındır-1 Sokak No:25/A (Kızılay merkez).',
      sources: [
        [
          'Türkiye Turizm Ansiklopedisi',
          'https://turkiyeturizmansiklopedisi.com/',
          'editorial',
          '1945’ten bu yana Ankara gastronomi tarihindeki Rumeli İşkembecisi kaydı',
        ],
        [
          'Rumeli İşkembecisi Resmi Arşivi',
          'http://www.rumeliiskembecisi.com.tr/',
          'operator',
          '1945 kuruluş tarihi, Bayındır Sk. merkez ve sakatat çorba reçeteleri',
        ],
        [
          'Yandex Maps Cumhuriyet',
          'https://yandex.com.tr/',
          'community',
          'Tuzlama, kelle paça ve kesintisiz gece servisi değerlendirmeleri',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '4.371+ değerlendirmeyle Kızılay’ın 1945 mirası kurumu',
        ],
      ],
      pros: ['1945’ten gelen kesintisiz Ankara gece çorbacısı geleneği', 'Temiz, hızlı ve doyurucu porsiyonlar'],
      cons: ['Geç gece saatlerinde masalar çok hızlı dolup boşalıyor'],
      unc: ['Hafif terbiyeli çorba isteyenler tuzlama/damar yerine süzme seçeneklerini belirtebilir.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-urfali-hayrag',
      placeId: 'ChIJByCarFVO0xQRRMNv30Eqzso',
      cat: 'denemelisin',
      name: 'Urfalı Hayrağ’nın Yeri (1961)',
      brand: 'hayrağ',
      area: 'Bayındır-1 Sk., Kızılay',
      signals: ['1961-kizilay-ocakbasi', 'zirh-kebabi', 'taze-lahmacun'],
      desc:
        '1961 yılından beri Bayındır-1 Sokak’ta zırh kıymasından çekilen Urfa kebabını, çıtır lahmacununu ve taze yeşillik-ezme ikramlarını bozmadan sürdüren Ankara’nın en eski ocakbaşı adreslerinden.',
      order: ['Zırh Kıyma Urfa Kebap', 'Taş Fırın Lahmacun', 'Haşhaşlı Kebap'],
      menu: ['Urfa Kebap', 'Adana Kebap', 'Haşhaşlı Kebap', 'Lahmacun', 'İçli Köfte'],
      sec: [
        [
          'Sıcak Lavaş & Fırın İkramları',
          'Kebabın yanında taze çıkan ince taş fırın lahmacun ve içli köfte ikramları sofrayı zenginleştiriyor.',
          'urfalihayrag.com ve Yandex Bayındır kayıtları',
        ],
      ],
      seat: 'Çok katlı köklü kebap salonu',
      crowd: 'Öğle ve akşam Kızılay iş dünyası, aileler ve eski müdavimler',
      dis: 'Giriş katı yoğun saatlerde hareketli; daha sakin masa için üst salon tercih edilebilir.',
      transit: 'Cumhuriyet Mahallesi Bayındır-1 Sokak No:9/B.',
      sources: [
        [
          'Urfalı Hayrağ’nın Yeri Resmi Sitesi',
          'https://www.urfalihayrag.com/',
          'operator',
          '1961 kuruluş tarihi ve Bayındır-1 Sk. ocakbaşı menüsü',
        ],
        [
          'Restoranım.net Cumhuriyet & Kızılay',
          'https://restoranim.net/',
          'editorial',
          '1961’den bu yana Kızılay’da zırh kıymalı kebap ve taş fırın geleneği profili',
        ],
        [
          'Yandex Maps Cumhuriyet',
          'https://yandex.com.tr/',
          'community',
          'Zırh kebabı kıvamı ve 60+ yıllık hizmet tutarlılığı notları',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '3.444+ değerlendirmeyle Kızılay klasik kebapçısı',
        ],
      ],
      pros: ['1961’den bu yana aynı merkez sokakta kesintisiz ocakbaşı standardı', 'Zırh kıyma lezzeti'],
      cons: ['Yoğun yemek saatlerinde servis temposu gürültülü olabiliyor'],
      unc: ['Lahmacun ve künefe siparişi kebap öncesinde birlikte verilirse bekleme azalıyor.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-asmaalti-manti',
      placeId: 'ChIJfyTknVNO0xQRnLox8qGDnB8',
      cat: 'denemelisin',
      name: 'Asmaaltı Mantı Çorba',
      brand: 'asmaaltı',
      area: 'Ataç-2 Sk., Kızılay',
      signals: ['el-yapimi-manti', 'yoresel-corbalar', 'ev-sicakligi'],
      desc:
        'Kültür Ataç-2 Sokak’ta incecik el açması mantısı ve Süleymaniye ile Muradiye gibi özenli yöresel çorbalarıyla öğrencilerden çalışanlara Kızılay’ın en yüksek puanlı ev mutfağı duraklarından.',
      order: ['Ev Yapımı Yoğurtlu Mantı', 'Süleymaniye / Muradiye Çorbası', 'Zeytinyağlı Yaprak Sarma'],
      menu: ['Kayseri Mantısı', 'Süleymaniye Çorbası', 'Muradiye Çorbası', 'Sarma', 'Çibörek'],
      sec: [
        [
          'Anadolu Yöresel Çorbaları',
          'Klasik mercimek-ezogelin dışında Muradiye ve Süleymaniye çorbası gibi ev tipi reçeteleri her gün sıcak çıkarıyor.',
          'Menu-TR ve Yandex Kültür kayıtları',
        ],
      ],
      seat: 'Küçük, sıcak iç salon ve az sayıda sokak masası',
      crowd: 'Öğle arasında memurlar ve akşamüzeri el yapımı mantı arayan gençler',
      dis: 'Salon kapasitesi mütevazı olduğundan öğle 12–14 arası masa beklemesi yaşanabiliyor.',
      transit: 'Kültür Mahallesi Ataç-2 Sokak No:45/C (Kolej Metro ile Kızılay arası).',
      sources: [
        [
          'Menu-TR Kültür & Ataç',
          'https://menu-tr.com/',
          'editorial',
          'El açması mantı, Süleymaniye ve Muradiye çorbaları değerlendirmesi',
        ],
        [
          'Yandex Maps Kültür',
          'https://yandex.com.tr/',
          'community',
          'Ev sıcaklığı, temizlik ve fiyat-performans dengesi övgüleri',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '610+ değerlendirmeyle yüksek memnuniyetli yerel mutfak',
        ],
      ],
      pros: ['Gerçek el açması hamur ve anne eli değmiş gibi taze günlük çorbalar', 'Merkezde erişilebilir fiyat'],
      cons: ['Küçük dükkan yapısı nedeniyle kalabalık gruplara dar gelebiliyor'],
      unc: ['Bazı yöresel çorbalar ve sarma akşamüstü tükenebiliyor.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-cengiz-usta-tantuni',
      placeId: 'ChIJ9SOX559P0xQRSQeRmTvqbJ4',
      cat: 'denemelisin',
      name: 'Mersin Tantuni & Kebap Cengiz Usta',
      brand: 'cengiz usta',
      area: 'Konur Sk., Kızılay',
      signals: ['konur-sokak-klasigi', 'cömert-ikram-mezeler', 'mersin-usulu-et-tantuni'],
      desc:
        'Konur Sokak’ta yıllardır öğrenciler ve Kızılay çalışanlarının değişmez uğrağı olan; sacda taze biftek tantunisinin yanında masaya gelen zengin meze ikramlarıyla yüksek puan toplayan tekil işletme.',
      order: ['Çift Lavaş Biftek Tantuni', 'Yoğurtlu Tantuni', 'Turşu & Meze İkramları'],
      menu: ['Et Tantuni', 'Tavuk Tantuni', 'Yoğurtlu Tantuni', 'Adana & Urfa Dürüm'],
      sec: [
        [
          'Masaya Gelen Taze Meze İkramları',
          'Sipariş öncesi ve yanında servis edilen yeşillik, ezme ve salata ikramları Konur Sokak’ın öğrenci ve esnaf müdavimlerini memnun ediyor.',
          'Menu-TR ve Yandex Konur Sk. değerlendirmeleri',
        ],
      ],
      seat: 'Konur Sokak üzeri açık oturum ve iç salon masaları',
      crowd: 'Günün her saatinde Konur Sokak gençliği ve semt sakinleriyle dolu',
      dis: 'İşlek Konur Sokak yaya aksında yer aldığı için pik saatlerde gürültülü ve kalabalık.',
      transit: 'Meşrutiyet Mahallesi Konur Sokak No:38/4.',
      sources: [
        [
          'Menu-TR Konur & Kızılay',
          'https://menu-tr.com/',
          'editorial',
          'Biftek tantuni porsiyonu ve meze ikramları değerlendirmesi',
        ],
        [
          'Yandex Maps Konur Sk.',
          'https://yandex.com.tr/',
          'community',
          '1.500+ kişilik istikrarlı sokak lezzeti memnuniyeti',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '1.573+ değerlendirmeyle Konur’un en sevilen tantunicisi',
        ],
      ],
      pros: ['Yüksek memnuniyet oranını 1.500+ misafirde koruyan istikrarlı mutfak', 'Cömert salata-turşu ikramları'],
      cons: ['Konur Sokak gürültüsü içinde sakin bir akşam yemeği ortamı arayanlara uygun değil'],
      unc: ['Yoğun saatlerde acılı-acısız lavaş tercihini sipariş anında netleştirmek yararlı.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-selanik-esnaf',
      placeId: 'ChIJ21EcODdP0xQRi2yI8ac5A5o',
      cat: 'denemelisin',
      name: 'Selanik Esnaf Lokantası',
      brand: 'selanik esnaf',
      area: 'Selanik Cd., Kızılay',
      signals: ['temiz-self-servis-ev-yemegi', 'selanik-caddesi', 'gunluk-tezgah'],
      desc:
        'Selanik Caddesi No:64’te hijyeni, güler yüzlü servisi, günlük çıkan sulu ev yemekleri ve hindi kavurma ile çorba çeşitleriyle temiz esnaf lokantası arayanların güvenli durağı.',
      order: ['Hindi Kavurma & Pilav', 'Günlük Çorba & Zeytinyağlı Tabak', 'Etli Sebze Yemeği'],
      menu: ['Sulu Et Yemekleri', 'Hindi Kavurma', 'Mercimek Çorbası', 'Zeytinyağlılar'],
      sec: [
        [
          'Hızlı & Hijyenik Tezgâh Seçkisi',
          'Öğle molasında beklemeden günlük taze sebze ve et yemeği seçilebilen temiz salon düzeni övgü topluyor.',
          'Menu-TR ve Yandex Selanik Cd. kayıtları',
        ],
      ],
      seat: 'Düzenli self-servis ağırlıklı esnaf lokantası salonu',
      crowd: 'Selanik ve Yüksel çevresi çalışanlarıyla öğle vaktinde hareketli',
      dis: 'Akşam geç saat restoranı değil; gündüz ev yemekleri servisine odaklanıyor.',
      transit: 'Kızılay Selanik Caddesi No:64/B.',
      sources: [
        [
          'Menu-TR Selanik Kızılay',
          'https://menu-tr.com/',
          'editorial',
          'Temiz salon düzeni ve günlük ev yemekleri incelemesi',
        ],
        [
          'Yandex Maps Selanik Cd.',
          'https://yandex.com.tr/',
          'community',
          'Hindi kavurma, çorba ve hijyen övgüleri',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '160+ değerlendirmeyle Selanik Cd. esnaf yıldızı',
        ],
      ],
      pros: ['Şehir merkezinde sade, yağsız ve ev tipi temiz sulu yemek', 'Hızlı tezgah düzeni'],
      cons: ['Geç akşam saatlerinde tencere yemekleri kapanmış oluyor'],
      unc: ['Haftalık çıkan hindi kavurma veya özel güveç günleri tezgâha göre değişiyor.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-neo-foods',
      placeId: 'ChIJyRTUGE1P0xQRRMGW2AI6Bnc',
      cat: 'denemelisin',
      name: 'Neo Foods (European Bakery)',
      brand: 'neo foods',
      area: 'Kumrular Cd., Kızılay',
      signals: ['pasteis-de-nata', 'chimney-cake-kürtőskalács', 'avrupa-tatlilari'],
      desc:
        'Kumrular Caddesi’nde geleneksel Kürtőskalács (Baca Keki), Portekiz’in karamelize Pastel de Nata’sı ve Hollanda Stroopwafel’ini taze hazırlayan Kızılay’ın tekil Avrupa tatlı dükkânı.',
      order: ['Taze Pastel de Nata', 'Tarçınlı Chimney Cake (Baca Keki)', 'Sıcak Stroopwafel'],
      menu: ['Pastel de Nata', 'Chimney Cake', 'Stroopwafel', 'Sıcak Çikolata & Kahve'],
      sec: [
        [
          'Karamelize Portekiz Tatlısı & Sıcak Kahve Eşliği',
          'Fırından yeni çıkmış ince milföy hamurlu Pastel de Nata porsiyonu kahve molasına güçlü eşlik sağlıyor.',
          'neofoods.com.tr ve Restoranım.net Kızılay',
        ],
      ],
      seat: 'Tatlı vitrini odaklı kompakt oturma alanı ve al-götür düzeni',
      crowd: 'Farklı tatlılar denemek isteyen gençler ve Kumrular yayaları',
      dis: 'Büyük pastane salonundan ziyade tatlı vitrini ve ayaküstü sıcak hamur işi durağı.',
      transit: 'Kızılay Kumrular Caddesi No:6/B.',
      sources: [
        [
          'Neo Foods Resmi Sitesi',
          'https://www.neofoods.com.tr/',
          'operator',
          'Kumrular Cd. konumu, Pastel de Nata ve Chimney Cake menüsü',
        ],
        [
          'Restoranım.net & Menu-TR',
          'https://restoranim.net/',
          'editorial',
          'Avrupa sokak tatlıları uzmanlığı ve tazelik incelemesi',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '517+ değerlendirmeyle Kumrular’ın yüksek puanlı tatlıcısı',
        ],
      ],
      pros: ['Ankara’da benzeri nadir bulunan taze Pastel de Nata ve Chimney Cake reçeteleri', 'Zincirsiz tekil üretim'],
      cons: ['Geniş oturma alanı bekleyen kalabalık arkadaş gruplarına küçük kalıyor'],
      unc: ['Fırın çıkış saatine denk gelinirse sıcak Nata ve baca keki tazeliği çok daha yüksek.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-baskent-donercisi',
      placeId: 'ChIJr8Ta17ZP0xQRqgqVgl_zT8s',
      cat: 'denemelisin',
      name: 'Başkent Dönercisi',
      brand: 'başkent dönercisi',
      area: 'Sezenler Sk., Kızılay',
      signals: ['közde-ankara-doneri', 'ekmek-arasi-klasik', 'korkutreis-sokak'],
      desc:
        'Korkutreis Sezenler Sokak’ta köz ateşinde ağır ağır pişen et dönerini gevrek ekmek arasında abartısız, temiz ve klasik Ankara esnaf üslubuyla servis eden sevilen dönerci.',
      order: ['Közde Ekmek Arası Et Döner', 'Porsiyon Yaprak Döner', 'Şişe / Açık Ayran'],
      menu: ['Ekmek Arası Döner', 'Porsiyon Et Döner', 'Pilav Üstü Döner', 'Ayran'],
      sec: [
        [
          'Korkutreis & Sıhhiye Çalışanları Öğle Klasiği',
          'Soslu dürüm modasından uzak durup klasik Ankara usulü et tadını arayan yerel müdavimlerle dolu.',
          'Menu-TR ve Yandex Sezenler Sk. kayıtları',
        ],
      ],
      seat: 'Sade iç salon masaları ve hızlı al-götür servis',
      crowd: 'Öğle vakti Sıhhiye ve Korkutreis çevresi çalışanları',
      dis: 'Hafta içi öğle yoğunluğu sonrası et stoğu tükendiğinde servis erken sonlanabiliyor.',
      transit: 'Korkutreis Mahallesi Sezenler Sokak No:4/E.',
      sources: [
        [
          'Menu-TR Korkutreis',
          'https://menu-tr.com/',
          'editorial',
          'Közde ekmek arası et döner lezzeti ve temizlik incelemesi',
        ],
        [
          'Yandex Maps Korkutreis',
          'https://yandex.com.tr/',
          'community',
          'Sezenler Sk. klasik et döneri müdavim deneyim notları',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '141+ değerlendirmeyle Kızılay kuzey aksının güvenilir dönercisi',
        ],
      ],
      pros: ['Sosa boğulmamış temiz közde et döner profili', 'Hızlı servis'],
      cons: ['Geç akşam yemeği için değil ağırlıklı gündüz dönercisi'],
      unc: ['Hafta sonu erken öğleden sonra dönerin bitme ihtimali bulunuyor.'],
      verifiedAt: '2026-11-17',
    }),
    compactSeed({
      id: 'kizilay-durmacun',
      placeId: 'ChIJB7NfZEhP0xQRPFu48YaIQFk',
      cat: 'denemelisin',
      name: 'Dürmacun',
      brand: 'dürmacun',
      area: 'Yüksel Cd., Kızılay',
      signals: ['citir-tas-firin-lahmacun', 'yuksel-caddesi', 'pratik-durum'],
      desc:
        'Yüksel Caddesi üzerinde çıtır taş fırın hamuru, dengeli harcı ve dürümlenmiş pratik sunumuyla Kızılay yaya aksında ayaküstü veya hızlı öğle yemeğinde öne çıkan lahmacun durağı.',
      order: ['Çıtır Klasik Lahmacun Dürüm', 'Kaşarlı Özel Lahmacun', 'Köpüklü Ayran'],
      menu: ['Klasik Lahmacun', 'Acılı Lahmacun', 'Kaşarlı Lahmacun', 'Mercimek Çorbası'],
      sec: [
        [
          'Fırın Çıkışı Çıtırlık & Maydanoz-Limon Dengesi',
          'Hamuru yumuşamadan servis edilen sıcak lahmacunlar Yüksel Caddesi yürüyüşünde pratik bir mola noktası sunuyor.',
          'Restoranım.net ve Menu-TR Yüksel Cd. kayıtları',
        ],
      ],
      seat: 'Küçük oturma bölümü ve Yüksel Caddesi ayaküstü/al-götür düzeni',
      crowd: 'Yüksel yaya aksındaki öğrenciler ve hızlı yemek arayanlar',
      dis: 'Küçük esnaf dükkânı düzeninde; uzun oturumlu akşam sofrası yeri değil.',
      transit: 'Kocatepe Mahallesi Yüksel Caddesi No:20/C.',
      sources: [
        [
          'Restoranım.net & Menu-TR',
          'https://restoranim.net/',
          'editorial',
          'Yüksel Cd. çıtır hamurlu lahmacun sunumu değerlendirmesi',
        ],
        [
          'Yandex Maps Kocatepe',
          'https://yandex.com.tr/',
          'community',
          'Taze harç ve hızlı fırın servisi beğeni notları',
        ],
        [
          'Google Maps Topluluk',
          'https://maps.google.com/',
          'maps',
          '81+ misafirden yüksek Kızılay sokak lezzeti puanı',
        ],
      ],
      pros: ['Merkezi Yüksel aksında taze ve çıtır lahmacun çıkarıyor', 'Hızlı ayaküstü veya pratik yemek'],
      cons: ['Geniş masa veya kalabalık grup alanı sınırlı'],
      unc: ['Yoğun öğle saatlerinde sıcak fırın sırası birkaç dakika bekletebiliyor.'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // NEGATİF DENETİM KONTROLLERİ (8 Kapı Politika Kanıtları)
    // =========================================================================
    negControl(
      'ctrl-kizilay-starbucks-karanfil',
      'ChIJxQOwQ6pP0xQRp0JtKln8JOQ',
      'kahve',
      'Küresel kahve zinciri Karanfil Sokak şubesi.'
    ),
    negControl(
      'ctrl-kizilay-big-baker-chain',
      'ChIJzSEZPKtP0xQRjLyxqGl4KWg',
      'hamburger',
      'Ankara’da 6+ AVM ve cadde şubesi bulunan çok şubeli kafe-burger zinciri.'
    ),
    negControl(
      'ctrl-kizilay-hosta-doner-chain',
      'ChIJXwoZ31RO0xQRGwRUiuoVRFo',
      'denemelisin',
      '10+ şubeli endüstriyel döner zinciri Sakarya şubesi.'
    ),
    negControl(
      'ctrl-kizilay-coffee-big-hill-chain',
      'ChIJGWmCtCJP0xQRcpoiy6Azg68',
      'kahve',
      'Ankara genelinde 10+ şubesi bulunan zincir kafe GMK şubesi.'
    ),
    negControl(
      'ctrl-kizilay-cajun-corner-chain',
      'ChIJL7Z9745P0xQR_3SgQwmRrIw',
      'hamburger',
      'Türkiye geneli franchise fast-food zinciri Karanfil şubesi.'
    ),
    negControl(
      'ctrl-kizilay-caribou-chain',
      'ChIJJVG_XKpP0xQRveouCOKfl40',
      'kahve',
      'Uluslararası kahve zinciri Karanfil şubesi.'
    ),
    negControl(
      'ctrl-kizilay-coffy-chain',
      'ChIJAcGwqp1P0xQR4Zxw9lzJ8YI',
      'kahve',
      'Ulusal kahve zinciri Sakarya/İnkılap şubesi.'
    ),
    negControl(
      'ctrl-kizilay-sr-doner-chain',
      'ChIJQwiPDjFP0xQR8HO_FX3DoL0',
      'denemelisin',
      'Çok şehirli soslu dürüm döner zinciri Sakarya-2 şubesi.'
    ),
    negControl(
      'ctrl-kizilay-cikolata-evim-noncoffee',
      'ChIJi1zpzw1P0xQRI-9bwsfwXL4',
      'kahve',
      'Google Places ana türü chocolate_shop olan tatlıcı; saf kahveci kuralı (Kapı 3B) gereği kahve kategorisine giremez.'
    ),
    negControl(
      'ctrl-kizilay-6his-fal-nonfood',
      'ChIJO6IB2itP0xQR78u76u4-76Y',
      'kahve',
      'Google Places yeme-içme işletme türü taşımayan fal salonu (Kapı 3).'
    ),
    negControl(
      'ctrl-kizilay-out-tunali-allonsy',
      'ChIJsxbRLqZP0xQRAkrgTuDrEwE',
      'hamburger',
      'Sınır ihlali — Akay Kavşağı güneyinde, Kavaklıdere (Tunalı Hilmi) sınırları içinde yer aldığı için Kızılay kapsamı dışında.'
    ),
    negControl(
      'ctrl-kizilay-out-anittepe-citir',
      'ChIJbSwESidP0xQRjPkQnBJSba8',
      'pizza',
      'Sınır ihlali — Yücetepe/Anıttepe sınırlarında kaldığı için Kızılay bbox dışında.'
    ),
    negControl(
      'ctrl-kizilay-low-tarhana-kazani',
      'ChIJGZ5mgv9P0xQRvwzG_UHj6Sc',
      'denemelisin',
      '★4.0 kalite tabanının altında ve tarihsel istisna koruması yok.'
    ),
    negControl(
      'ctrl-kizilay-low-eski-sofra',
      'ChIJq0bncv9O0xQRgy3JVYGIW60',
      'denemelisin',
      '★4.3 kalite tabanının altında.'
    ),
  ],
};
