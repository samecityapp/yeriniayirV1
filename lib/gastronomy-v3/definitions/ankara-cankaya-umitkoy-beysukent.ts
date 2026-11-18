import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ANKARA_CANKAYA_UMITKOY_BEYSUKENT_DEF: V3RegionDefinition = {
  id: 'ankara-cankaya-umitkoy-beysukent',
  slug: 'umitkoy-beysukent',
  city: 'Ankara',
  district: 'Çankaya',
  allowedDistricts: ['Çankaya', 'Ümitköy', 'Beysukent', 'Çayyolu'],
  neighborhood: 'Ümitköy & Beysukent',
  officialQuarter:
    'Ümit & Mutlukent Mahalleleri (Galleria Arkası 1943–1964. Sokaklar, Ümitköy Sitesi, Meksika Cd., Osmanağa Konakları, Angora Blv. & Beysukent Aksları)',
  displayName: 'Ümitköy & Beysukent, Çankaya, Ankara',
  locative: "Ümitköy ve Beysukent'te",
  path: ['ankara', 'cankaya', 'umitkoy-beysukent'],
  aliases: [
    'Ümitköy',
    'Umitkoy',
    'Ümitköy Ankara',
    'Ümitköy Çankaya',
    'Beysukent',
    'Beysukent Ankara',
    'Beysukent Çankaya',
    'Ümitköy Beysukent',
    'Umitkoy Beysukent',
    'Mutlukent',
    'Mutluköy',
    'Angora Bulvarı',
    'Angora Evleri',
    'Meksika Caddesi',
    'Galleria Arkası',
    'Ümit Mahallesi',
    'Beysupark',
  ],
  scopeNote:
    'Ümitköy & Beysukent (Mutlukent, Ümit Mahallesi, Angora Bulvarı & Beysupark, Doğan Taşdelen Blv. doğusu; Çayyolu/Park Caddesi/Koru, Beytepe ve Mustafa Kemal hariç) · Doğrulanmış Seçki',
  characterSubtitle:
    'Galleria arkasındaki 1943–1964. sokaklardan Angora Bulvarı ve Beysukent villalarına uzanan; smash ve Cajun burger noktaları, yerel kahve kavurucusu ile bahçeli üçüncü dalga kahveciler, orman dokulu fine-casual restoran, şarap evi, Karadeniz serpme ve ekşi maya fırınları ile modern meyhaneler.',
  center: { lat: 39.8955, lng: 32.7145 },
  bbox: { minLat: 39.8760, maxLat: 39.9085, minLng: 32.6976, maxLng: 32.7420 },
  allowedNeighborhoodTokens: [
    'Ümit',
    'Umit',
    'Ümitköy',
    'Umitkoy',
    'Mutlukent',
    'Beysukent',
    'Angora',
    'Beytepe',
    'Çayyolu',
    'Cayyolu',
  ],
  categories: buildRegionCategories(),
  candidates: [
    // =========================================================================
    // 1. HAMBURGER (2 bağımsız Ümitköy burger noktası — pizza adayı yok: Yoksa Gösterme)
    // =========================================================================
    compactSeed({
      id: 'umitkoy-no95-burger',
      placeId: 'ChIJi6nNKMA50xQRKhIHHMBySD4',
      cat: 'hamburger',
      name: 'No95',
      brand: 'No95',
      area: 'Doğan Taşdelen Blv., Ümitköy',
      signals: ['cajun-tavuk', 'rich-burger', 'kasik-patates'],
      desc:
        'Doğan Taşdelen Bulvarı üzerinde Galleria yakınındaki ferah salonunda Rich Burger, özel Cajun baharatlı çıtır Chicken Cutlet Hero, pankek-bagel sandviç seçenekleri ve kaşık patates kızartmasıyla bilinen tekil Ümitköy burger ve çıtır tavuk noktası.',
      order: ['Rich Burger', 'Chicken Cutlet Hero (Cajun Tavuk)', 'Kaşık Patates Kızartması'],
      menu: ['Rich Burger', 'Chicken Cutlet Hero', 'Cajun Burger', 'Bagel Sandviç & Kaşık Patates'],
      sec: [
        [
          'Cajun Baharatlı Çıtır Tavuk & Kaşık Patates',
          'Dana burgerlerin yanında özgün Cajun baharatlı çıtır tavuk sandviçler ve kaşık patates sunumuyla müdavim kitlesi kazanmıştır.',
          'İşletme menü kayıtları ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Doğan Taşdelen Bulvarı üzerinde modern, ferah iç oturma alanı',
      crowd: 'Kalabalık Galleria arkası sokaklarına girmeden hızlı ama nitelikli burger veya çıtır tavuk arayanlar',
      dis: 'Akşam ve hafta sonu paket yoğunluğu nedeniyle bekleme oluşabilir; menüsü burger ve çıtır tavuk ağırlıklıdır',
      transit: 'Mutlukent Mahallesi Doğan Taşdelen Bulvarı No:95 (Ümitköy Metro çıkışı yürüyüş mesafesi).',
      sources: [
        [
          'Menu-TR No95 Ümitköy',
          'https://www.menu-tr.com/',
          'editorial',
          'Rich Burger, Chicken Cutlet Hero, kaşık patates ve konum detayları',
        ],
        [
          'Yemeksepeti & RestaurantGuru No95',
          'https://www.yemeksepeti.com/',
          'community',
          'Ümitköy Cajun tavuk ve fiyat-performans memnuniyeti değerlendirmeleri',
        ],
      ],
      pros: ['Hem dana burgerde hem Cajun çıtır tavukta yüksek tutarlılık', 'Ümitköy Metro durağına yakın konum'],
      cons: ['Tamamen fast-casual konseptte, uzun akşam oturumları için tasarlanmamış'],
      unc: ['Hafta sonu öğle-akşam arası servis süresi sipariş hacmine bağlı olarak uzayabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-fifty-fifty-burger',
      placeId: 'ChIJrU1DT3s50xQR8m0p_AJe3Xg',
      cat: 'hamburger',
      name: 'Fifty Fifty Burger',
      brand: 'Fifty',
      area: '1946. Sk., Ümitköy',
      signals: ['smash-burger', 'steak-sandvic', 'pazartesi-kapali'],
      desc:
        'Mutluköy Sitesi 1946. Sokak üzerinde yüksek ısıda preslenen dışı karamelize çıtır kenarlı içi sulu Trüf ve Meksika smash burgerleri ile steak sandviçleriyle ayrışan tek şubeli Ümitköy burgercisi.',
      order: ['Trüf Smash Burger / Meksika Burger', 'Steak Sandviç & Baharatlı Patates'],
      menu: ['Trüf Burger', 'Meksika Burger', 'Füme Burger', 'Cheeseburger', 'Steak Sandviç'],
      sec: [
        [
          'Steak Sandviç & Baharatlı Patates Alternatifleri',
          'Smash burgerlerin yanında yumuşak etli steak sandviçler ve özel baharatlı patates tabakları hazırlanır.',
          'İşletme menü kayıtları ve yerel değerlendirmeler',
        ],
      ],
      seat: 'Mutluköy sokak dokusu içinde butik ve samimi burgerci oturma düzeni',
      crowd: 'Dışı çıtır içi sulu smash burger ve steak sandviç arayan Ümitköy burger tutkunları',
      dis: 'Pazartesi günleri kapalıdır; küçük butik kapasite nedeniyle akşam saatlerinde yer beklemek gerekebilir',
      transit: 'Mutlukent Mahallesi Mutluköy Sitesi 1946. Sokak No:6 (Galleria arkası).',
      sources: [
        [
          'Fifty Fifty Resmi Sitesi',
          'http://www.fiftyfifty.com.tr/',
          'operator',
          'Smash ve steak sandviç konsepti, Mutluköy 1946. Sk. konumu',
        ],
        [
          'Restoranim Fifty Fifty Burger',
          'https://www.restoranim.net/',
          'editorial',
          'Trüf burger, steak sandviç ve Pazartesi kapalı gün bilgisi',
        ],
      ],
      pros: ['Yüksek ısıda doğru karamelize edilen tek şubeli smash burger mutfağı', 'Baharatlı patates ve özel sos uyumu'],
      cons: ['Pazartesi günleri hizmet vermemesi ve sınırlı oturma alanı'],
      unc: ['Akşam geç saatlerde stok tükenmesine bağlı olarak menü daralabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 2. KAHVE (%100 saf nitelikli kahveciler ve kavurucu)
    // =========================================================================
    compactSeed({
      id: 'umitkoy-grey-coffee',
      placeId: 'ChIJ88EDR7Y50xQRhs6riZyW4fs',
      cat: 'kahve',
      name: 'grey coffee etc.',
      brand: 'grey',
      area: '1949. Sk., Mutlukent',
      signals: ['genis-bahce', 'honcoff-imzasi', 'ucuncu-nesil-mutlukent'],
      desc:
        'Mutlukent 1949. Sokak’ta yıllardır geniş bahçesi ve samimi iç alanıyla üçüncü dalga demlemeleri, imza Honcoff içeceği ve Lotus kremalı cheesecake gibi eşlikçileri gece yarısına dek sunan köklü Ümitköy kahvecisi.',
      order: ['İmza Honcoff / Nitelikli Filtre Kahve', 'Lotus Creamy Cheesecake'],
      menu: ['Honcoff', 'V60 & Espresso Seçkisi', 'Soğuk Demlemeler', 'Cheesecake Çeşitleri'],
      sec: [
        [
          'Geniş Bahçe Oturumu & Geç Akşam Kapanışı',
          'Mutluköy villaları arasında gece yarısına kadar açık kalan ferah bahçesiyle akşam kahvesi buluşmalarının da adresidir.',
          'İşletme kayıtları ve şehir değerlendirmeleri',
        ],
      ],
      seat: 'Ağaçlı geniş villa bahçesi ve sıcak tonlarda tasarlanmış iç salon',
      crowd: 'Geç saatlere kadar açık bahçede nitelikli kahve içmek isteyen Ümitköy müdavimleri',
      dis: 'Hafta sonu bahçe masaları çabuk dolar; kalabalık saatlerde gürültü düzeyi yükselebilir',
      transit: 'Mutlukent Mahallesi 1949. Sokak No:10 (Galleria arkası).',
      sources: [
        [
          'Grey Coffee Resmi Sitesi',
          'http://www.coffeegrey.com/',
          'operator',
          'Mutlukent 1949. Sk. konumu, üçüncü nesil kahve yaklaşımı ve bahçe düzeni',
        ],
        [
          'Yandex Haritalar grey coffee',
          'https://yandex.com.tr/',
          'community',
          'Honcoff, cheesecake, geç kapanış ve geniş bahçe değerlendirmeleri',
        ],
      ],
      pros: ['Ümitköy içindeki en ferah villalar arası kahve bahçelerinden biri', 'Uzun saatler ve istikrarlı içecek kalitesi'],
      cons: ['Popüler akşam saatlerinde sakin çalışma ortamı yerine sosyal buluşma havası ağır basar'],
      unc: ['Yaz-kış bahçe ısıtma düzeni masa konumuna göre değişebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-11-renaissance',
      placeId: 'ChIJ0RoWoGU50xQRFLKyy2uPApI',
      cat: 'kahve',
      name: '11 Renaissance Coffee',
      brand: 'Renaissance',
      area: '1950. Sk., Mutlukent',
      signals: ['calisma-kafesi', 'priz-altyapisi', 'bol-gun-isigi'],
      desc:
        'Mutluköy Sitesi 1950. Sokak üzerinde yüksek tavanlı, bol gün ışığı alan mimarisi, masalara yakın priz altyapısı ve iyi demlenmiş filtre-espresso çeşitleriyle laptop’la çalışmak ve sakin kahve molaları için ideal Ümitköy noktası.',
      order: ['Filtre Kahve / Flat White', 'Taze Kruvasan & Antep Fıstıklı Tiramisu'],
      menu: ['Filtre & Espresso Kahveler', 'Günlük Kruvasan', 'Antep Fıstıklı Tiramisu', 'Özel Tatlı Vitrini'],
      sec: [
        [
          'Yüksek Tavanlı Çalışma Masaları & Tatlı Vitrini',
          'Rahat oturum ergonomi ve elektrik prizi erişimini günlük taze kruvasan ve vitrin tatlılarıyla destekler.',
          'İşletme tanıtımları ve bağımsız seyahat rehberleri',
        ],
      ],
      seat: 'Yüksek tavanlı, gün ışıklı, masalara yakın priz destekli geniş çalışma düzeni',
      crowd: 'Ümitköy içinde uzun saatler bilgisayarla çalışmak veya sessiz sohbet etmek isteyenler',
      dis: 'Günün ortasında çalışma masaları hızla dolduğu için öğleden önce gitmek avantaj sağlar',
      transit: 'Mutlukent Mahallesi 1950. Sokak Mutluköy Sitesi No:18.',
      sources: [
        [
          '11 Renaissance Resmi Sitesi',
          'https://www.11renaissancecoffee.com/',
          'operator',
          'Çalışma konsepti, priz altyapısı, kahve ve tatlı vitrini bilgileri',
        ],
        [
          'Türk Travel Radar',
          'https://turktravelradar.com/',
          'editorial',
          'Yüksek tavanlı çalışma ortamı, Antep fıstıklı tiramisu ve gün ışığı incelemesi',
        ],
      ],
      pros: ['Yüksek tavan, gün ışığı ve priz erişimi ile ergonomik çalışma düzeni', 'Kahve yanında taze tiramisu ve kruvasan seçenekleri'],
      cons: ['Hafta içi yoğun çalışma saatlerinde boş prizli masa bulmak zorlaşabilir'],
      unc: ['Hafta sonları çalışma yerine sosyal kafe kalabalığı artabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 3. DATE MEKÂNLARI (4 Beysukent & Ümitköy özel akşam durağı)
    // =========================================================================
    compactSeed({
      id: 'umitkoy-altemur-orman',
      placeId: 'ChIJq4pkNs9H0xQRn18DOHbbvow',
      cat: 'date',
      name: 'Altemur Orman',
      brand: 'Altemur',
      area: '2037. Cd., Beysukent',
      signals: ['fine-casual-dining', 'odun-atesi-mevsimsel', 'beysukent-orman'],
      desc:
        'Beysukent’te doğayla temas eden yüksek atmosferli salonunda deneyimli şeflerin mevsimsel malzemeyi ateşle işlediği; Tatar Usulü Bonfile, Izgara Ahtapot, Kuzu Taraklık ve Dana Pöç gibi imzalar sunan yeni nesil fine-casual Ankara restoranı.',
      order: ['Tatar Usulü Bonfile / Dana Pöç', 'Bayburt Pazı Sarması & Izgara Ahtapot', 'Mevsim Tadım Menüsü'],
      menu: ['Tatar Usulü Bonfile', 'Bayburt Pazı Sarması', 'Izgara Ahtapot', 'Bursa Usulü İstiridye Mantar', 'Kuzu Taraklık'],
      sec: [
        [
          'Mevsimsel Şef Tadım Menüsü & Orman Dokusu',
          'Alakart ana yemeklerin yanında mevsimlik yerel ürünleri modern teknikle işleyen tadım menüsü seçeneği bulunur.',
          'İşletme mutfak menüsü ve gastronomi değerlendirmeleri',
        ],
      ],
      seat: 'Beysukent orman sınırına bakan rafine aydınlatmalı fine-casual salon',
      crowd: 'Özel yıl dönümü, sakin şef mutfağı ve mevsimsel gastronomi deneyimi arayan çiftler',
      dis: 'Bölgenin en yüksek bütçe segmentindedir; rezervasyonsuz akşam servisi yakalamak zordur',
      transit: 'Mutlukent Mahallesi (Beysukent) 2037. Cadde No:16 (Angora Bulvarı güney kolu).',
      sources: [
        [
          'Altemur Orman Resmi Sitesi',
          'https://www.altemurorman.com/',
          'operator',
          'Fine-casual doğa konsepti, alakart ve mevsimsel tadım menüsü',
        ],
        [
          'Bosco & Yerel Gastronomi Dizini',
          'https://boscoankara.com/',
          'editorial',
          'Şef mutfağı, yerel malzeme yaklaşımı ve Beysukent konumu',
        ],
      ],
      pros: ['Şehir karmaşasından kopuk Beysukent doğası içinde nitelikli şef mutfağı', 'Yerel Anadolu tatlarını yaratıcı teknikle buluşturması'],
      cons: ['Yüksek bütçe sınıfı ve önceden rezervasyon zorunluluğu'],
      unc: ['Mevsimsel tadım menüsü içerikleri dönemsel olarak güncellenir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-mualla-meyhane',
      placeId: 'ChIJs7SH_-k50xQRlNJHy5dUFgs',
      cat: 'date',
      name: 'Mualla Meyhane Ümitköy (Çayyolu)',
      brand: 'Mualla',
      area: '1946. Sk., Ümitköy',
      signals: ['kirk-cesit-meze', 'sicak-raki-sofrasi', 'canli-muzik'],
      desc:
        'Ümitköy 1946. Sokak’ta günlük hazırlanan kırkı aşkın taze meze çeşidi, sıcak deniz ürünleri ara sıcakları ve canlı müzik programıyla modern Ankara rakı sofrası kültürünü özenle sürdüren popüler Mutlukent meyhanesi.',
      order: ['Günlük Meze Tepsisi Seçkisi', 'Deniz Ürünlü Ara Sıcaklar'],
      menu: ['Günlük Soğuk Mezeler', 'Deniz Ürünleri', 'Et & Kebap Izgaralar', 'Ara Sıcaklar'],
      sec: [
        [
          'Canlı Müzik & Zengin Meze Tepsisi',
          'Günlük çıkan geniş soğuk meze seçenekleri akşam ilerledikçe canlı müzik eşliğinde uzun sohbet sofralarına dönüşür.',
          'İşletme mutfak sunumları ve şehir rehberleri',
        ],
      ],
      seat: 'Yakın ve sıcak düzenlenmiş, sahne/müzik algısı yüksek Ümitköy meyhane salonu',
      crowd: 'Bol meze çeşitliliği ve eğlenceli canlı müzikli rakı akşamı planlayan çift ve arkadaş masaları',
      dis: 'Canlı müzik saatlerinde ortam enerjik ve sesli olabildiği için sakin fısıltı buluşmalarına uygun değildir',
      transit: 'Mutlukent Mahallesi 1946. Sokak No:14 (Galleria arkası).',
      sources: [
        [
          'Mualla Meyhane Resmi Sitesi',
          'https://muallameyhane.com.tr/',
          'operator',
          'Günlük 40+ meze, taze deniz ürünleri ve canlı müzik meyhane konsepti',
        ],
        [
          'Restoranim Mualla Meyhane',
          'https://www.restoranim.net/',
          'editorial',
          'Ümitköy şıklığı, meze tazeliği ve akşam deneyimi değerlendirmeleri',
        ],
      ],
      pros: ['Günlük çok çeşitli taze meze dolabı ve ilgili masa servisi', 'Ümitköy içinde güçlü akşam enerjisi'],
      cons: ['Hafta sonu canlı müzikte ses düzeyi yüksek olabiliyor'],
      unc: ['Cuma-cumartesi akşamlarında erken rezervasyon gerekebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-tingir-mingir',
      placeId: 'ChIJo9oFVHVH0xQRAT-eAfhNOPE',
      cat: 'date',
      name: 'Tıngır Mıngır Meyhane',
      brand: 'Tıngır',
      area: 'Angora Blv., Beysukent',
      signals: ['ege-mezeleri', 'huzurlu-arka-bahce', 'angora-meyhane'],
      desc:
        'Angora Bulvarı üzerinde huzurlu arka bahçesi, Ege esintili soğuk mezeleri ve özenli deniz ürünleri mutfağıyla Beysukent hattında uzun süredir tutarlı memnuniyet yakalayan sakin şık meyhane.',
      order: ['Ege Esintili Soğuk Mezeler', 'Deniz Ürünleri Ara Sıcakları & Ana Balık'],
      menu: ['Ege Otlu Mezeler', 'Deniz Ürünleri Ara Sıcakları', 'Mevsim Balıkları', 'Izgara Et Seçenekleri'],
      sec: [
        [
          'Arka Bahçe Huzuru & Ege Meze Mutfağı',
          'Gürültülü eğlence meyhanelerinden ayrılarak daha sakin arka bahçe düzeninde sohbet ve Ege mutfağı sunar.',
          'İşletme kayıtları ve misafir değerlendirmeleri',
        ],
      ],
      seat: 'Huzurlu, yeşillikli arka bahçe masaları ve sıcak ahşap iç salon',
      crowd: 'Gürültüden uzak sakin Ege sofrası ve şık sohbet akşamı isteyen Beysukent-Ümitköy çiftleri',
      dis: 'Çok yüksek fiyat segmentindedir; meze ve deniz ürünleri hesabını yüksek tutabilir',
      transit: 'Mutlukent Mahallesi Angora Bulvarı No:50 (Beysukent).',
      sources: [
        [
          'Tıngır Mıngır Resmi Sitesi',
          'https://www.tingirmingir.com.tr/',
          'operator',
          'Angora Bulvarı Ege meyhane konsepti, bahçe ve deniz ürünleri menüsü',
        ],
        [
          'Restoranim Tıngır Mıngır',
          'https://www.restoranim.net/',
          'editorial',
          'Arka bahçe atmosferi ve meze kalitesi değerlendirmeleri',
        ],
      ],
      pros: ['Sakin arka bahçe dokusuyla sohbeti bozmayan meyhane atmosferi', 'Ege mezeleri ve deniz ürünlerinde yüksek puan istikrarı'],
      cons: ['Yüksek fiyat düzeyi'],
      unc: ['Bahçe masaları güzel havalarda önceden dolduğu için yer ayırtılmalıdır'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-vinus-wine-house',
      placeId: 'ChIJG5uI1zJH0xQRDI2mSdR0xNc',
      cat: 'date',
      name: 'Vinus Wine House',
      brand: 'Vinus',
      area: 'Angora Blv., Beysukent',
      signals: ['genis-sarap-kavi', 'peynir-sarkuteri', 'angora-sakin-aksam'],
      desc:
        'Angora Bulvarı No:30’da özenle seçilmiş yerli ve yabancı şarap kavı, eşlikçi peynir-şarküteri tabakları ve sakin aydınlatmalı salonuyla baş başa sohbet etmek isteyenler için ayrışan Beysukent şarap evi.',
      order: ['Kadeh / Şişe Şarap Kavı Seçkisi', 'Peynir & Şarküteri Tabağı', 'Dünya Mutfağından Eşlikçiler'],
      menu: ['Yerli & İthal Şarap Kavı', 'Peynir & Şarküteri Tabağı', 'Kokteyl & Butik Bira', 'Sıcak Bistro Tabakları'],
      sec: [
        [
          'Peynir-Şarküteri Eşleşmeleri & Şarap Dışında Kokteyller',
          'Geniş şarap listesini kadeh uyumlu peynir-şarküteri tabakları ve klasik bar kokteylleri tamamlar.',
          'Şehir rehberleri ve menü kayıtları',
        ],
      ],
      seat: 'Rahat koltuklu, loş aydınlatmalı sakin şarap barı ve iç masalar',
      crowd: 'Rakı veya kalabalık pub yerine sakin ortamda kadeh eşliğinde sohbet etmek isteyen çiftler',
      dis: 'Ana yemek odaklı tam restoran yerine şarap-bistro atıştırmalığı ağırlığındadır',
      transit: 'Mutlukent Mahallesi Angora Bulvarı No:30 (Beysukent).',
      sources: [
        [
          'Restoranim Vinus Wine House',
          'https://www.restoranim.net/',
          'editorial',
          'Geniş şarap kavı, sakin atmosfer, peynir tabağı ve kokteyl değerlendirmeleri',
        ],
        [
          'MenuLux & Yandex Haritalar Vinus',
          'https://yandex.com.tr/',
          'community',
          'Angora Bulvarı konumu ve bistro menü doğrulaması',
        ],
      ],
      pros: ['Beysukent içinde nadide kalan sakin, gösterişsiz kaliteli şarap barı', 'İyi seçilmiş peynir ve eşlikçi tabak dengesi'],
      cons: ['Geniş sıcak ana yemek menüsü bekleyen masalara uygun olmayabilir'],
      unc: ['Kav stoğundaki butik şişeler sezona göre değişebilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 4. KAHVALTI (3 bağımsız ekşi maya fırın, Karadeniz serpme ve Ankara simit fırını)
    // =========================================================================
    compactSeed({
      id: 'umitkoy-nils-artisan-bakery',
      placeId: 'ChIJV2CCSIg40xQRTGNfD8h4v4w',
      cat: 'kahvalti',
      name: "Nil's Artisan Bakery",
      brand: 'Nil',
      area: '1943. Cd., Mutlukent',
      signals: ['eksi-maya-ekmek', 'kat-kat-kruvasan', 'nitelikli-sabah-kahvesi'],
      desc:
        'Mutlukent 1943. Cadde üzerinde doğal ekşi mayalı zanaat ekmekleri, kat kat açılan tereyağlı artizan kruvasanları ve kahvesiyle Ümitköy sabahlarının en nitelikli bağımsız fırın-kafesi.',
      order: ['Artizan Tereyağlı Kruvasan', 'Ekşi Mayalı Ekmek & Filtre Kahve'],
      menu: ['Sade & Dolgulu Kruvasanlar', 'Ekşi Mayalı Somunlar', 'Kahvaltı Tatlıları', 'Espresso & Filtre Kahve'],
      sec: [
        [
          'Doğal Ekşi Mayalı Somunlar & Kafe Oturumu',
          'Masada yenilen kat kat kruvasan ve kahvenin yanında ev için günlük çıkan ekşi mayalı ekmekler de hızla tükenir.',
          'İşletme üretim kayıtları ve gastronomi değerlendirmeleri',
        ],
      ],
      seat: 'Vitrin başında şık, aydınlık artizan fırın-kafe oturma düzeni',
      crowd: 'Serpme kahvaltı yerine iyi kruvasan, ekşi mayalı ekmek ve temiz sabah kahvesi arayanlar',
      dis: 'Günün ilerleyen saatlerinde popüler kruvasanlar ve ekmekler bitebilir; klasik Türk serpme kahvaltısı yoktur',
      transit: 'Mutlukent Mahallesi 1943. Cadde No:3 (Çayyolu Metro yakın çevresi).',
      sources: [
        [
          "Nil's Artisan Bakery Resmi Sitesi",
          'https://nilsartisanbakery.com/',
          'operator',
          'Mutlukent 1943. Cd. adresi ve artizan ekşi maya-kruvasan üretimi',
        ],
        [
          "RestaurantGuru & Yandex Nil's Bakery",
          'https://restaurantguru.com/',
          'editorial',
          'Kat kat kruvasanlar, ekşi maya ekmekler ve kahve uyumu değerlendirmeleri',
        ],
      ],
      pros: ['Tek şubeli özenli artizan hamur ve maya işçiliği', 'Hem masada kahvaltı hem eve ekşi maya ekmek alma imkânı'],
      cons: ['Geniş serpme kahvaltı yerine fırın-patisserie tarzı hafif sabah seçkisi'],
      unc: ['Hafta sonu sabahları kruvasan tepsileri öğleye varmadan tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-ayderishi-firin',
      placeId: 'ChIJw6ZAgno50xQRqyAgEnzoDww',
      cat: 'kahvalti',
      name: "Ayder'ishi Fırın & Cafe",
      brand: 'Ayder',
      area: '1961. Cd., Mutlukent',
      signals: ['karadeniz-serpme', 'kuymak-mihlama', 'laz-boregi'],
      desc:
        'Mutlukent 1961. Cadde’de Karadeniz yöresel mutfağını taze fırın ürünleriyle buluşturan; uzayan sıcak kuymak-mıhlama, zengin serpme kahvaltı ve Laz böreği-fırın lezzetleriyle hafta sonu aile sofralarının sevilen Ümitköy adresi.',
      order: ['Karadeniz Serpme Kahvaltı & Sıcak Kuymak', 'Laz Böreği & Fırın Çeşitleri'],
      menu: ['Sıcak Kuymak / Mıhlama', 'Karadeniz Serpme Kahvaltı', 'Fırın Börekleri', 'Laz Böreği & Sütlü Tatlılar'],
      sec: [
        [
          'Yöresel Karadeniz Tatlıları & Fırın Vitrini',
          'Sabah kuymak-serpme sofrasının ardından vitrinden Laz böreği ve yöresel hamur işleri gün boyu eşlik eder.',
          'İşletme mutfak sunumları ve şehir dizinleri',
        ],
      ],
      seat: 'Ailelere ve hafta sonu kalabalık kahvaltı masalarına uygun ferah kafe-fırın salonu',
      crowd: 'Sıcak kuymaklı bol çeşitli Karadeniz serpme kahvaltısı arayan Ümitköy aile ve arkadaş grupları',
      dis: 'Hafta sonu geç kahvaltı saatlerinde yoğunluk yüksek olur',
      transit: 'Mutlukent Mahallesi 1961. Cadde No:11 (Ümitköy Metro çıkışı çevresi).',
      sources: [
        [
          "Ayder'ishi Resmi Sitesi",
          'https://ayderishi.com.tr/',
          'operator',
          'Karadeniz serpme kahvaltısı, sıcak kuymak/mıhlama ve yöresel fırın konsepti',
        ],
        [
          "Yandex Haritalar Ayder'ishi",
          'https://yandex.com.tr/',
          'community',
          'Mutlukent 1961. Cd. konumu, kuymak lezzeti ve kahvaltı memnuniyeti',
        ],
      ],
      pros: ['Ümitköy merkezinde yöresel Karadeniz kahvaltısı ve gerçek kuymak sunması', 'Ümitköy Metro yakınlığı'],
      cons: ['Hafta sonu geç sabah saatlerinde masalar dolabiliyor'],
      unc: ['Bayram ve hafta sonu günlerinde serpme kahvaltı için önceden teyit faydalıdır'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-savarona-simit',
      placeId: 'ChIJwX-PZok40xQRlQxlFVvAkOI',
      cat: 'kahvalti',
      name: 'Savarona Simit Fırını',
      brand: 'Savarona',
      area: '2494/3. Sk., Ümitköy',
      signals: ['taze-ankara-simidi', 'mahalle-firini', 'ekonomik-hizli'],
      desc:
        'Ümit Mahallesi Osmanağa Konakları çevresinde sıcak çıkan susamlı Ankara simidi, açma-poğaça ve pratik mahalle kahvaltılıklarıyla bölge sakinlerinin günlük hızlı sabah durağı.',
      order: ['Fırından Yeni Çıkmış Ankara Simidi & Beyaz Peynir', 'Çay & Taze Poğaça-Börek Seçkisi'],
      menu: ['Susamlı Ankara Simidi', 'Açma & Poğaça', 'Su Böreği', 'Kahvaltı Tabağı'],
      sec: [
        [
          'Günlük Fırın Çeşitleri & Pratik Çay-Simit Molası',
          'Uzun serpme kahvaltı yerine işe veya yürüyüşe giderken sıcacık simit, börek ve demli çay almak için idealdir.',
          'Yerel menü kayıtları ve mahalle değerlendirmeleri',
        ],
      ],
      seat: 'Hızlı kahvaltı ve fırın alışverişine uygun sade mahalle fırını oturma alanı',
      crowd: 'Sıcak Ankara simidiyle hızlı, bütçe dostu sabah kahvaltısı yapmak isteyen Ümitköy sakinleri',
      dis: 'Geleneksel şık kafe-brunch ambiyansı arayanlar yerine pratik mahalle fırını çizgisindedir',
      transit: 'Ümit Mahallesi 2494/3. Sokak No:8 (Çayyolu Metro & Osmanağa Konakları yakını).',
      sources: [
        [
          'Menu-TR Savarona Simit',
          'https://www.menu-tr.com/',
          'editorial',
          'Simit, unlu mamuller ve pratik kahvaltı menüsü bilgileri',
        ],
        [
          'MenuBurada Savarona Simit Fırını',
          'https://menuburada.com/',
          'community',
          '2494/3. Sokak konumu ve fırın ürünleri değerlendirmeleri',
        ],
      ],
      pros: ['Giriş bütçe seviyesinde günlük taze Ankara simidi ve börek çeşitleri', 'Sabah erken saatlerden itibaren hızlı servis'],
      cons: ['Uzun hafta sonu brunch oturumu yerine hızlı fırın atmosferi'],
      unc: ['Sıcak simit çıkış saatleri sabah erken dilimlerde en yoğun tempodadır'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 5. DENEMELİSİN (6 bölge klasiği — modern şef meyhane, Beysukent ocakbaşı, fasıl, Angora grill, aile pidesi, craft mutfak)
    // =========================================================================
    compactSeed({
      id: 'umitkoy-nukteli',
      placeId: 'ChIJx1HY2o850xQRaKaxFscJyTY',
      cat: 'denemelisin',
      name: 'Nükteli',
      brand: 'Nükteli',
      area: 'Osmanağa Konakları, Ümitköy',
      signals: ['yeni-nesil-meyhane', 'sef-tabaklari', 'yuksek-hacim'],
      desc:
        'Osmanağa Konakları’nda yeni nesil meyhaneyi şef tabaklarıyla birleştiren; Beş Peynirli Köz Patlıcan, Fesleğenli Girit, Lakerda ve Beef Wellington / Nükteli Special Kebap seçenekleriyle uzun süredir istikrarını koruyan Ümitköy klasiği.',
      order: ['Beş Peynirli Köz Patlıcan & Fesleğenli Girit', 'Yaprak Ciğer / Kalamar Tava', 'Nükteli Special Kebap / Beef Wellington'],
      menu: ['Fesleğenli Girit & Lakerda', 'Beş Peynirli Köz Patlıcan', 'Kalamar Tava', 'Nükteli Special Kebap', 'Beef Wellington'],
      sec: [
        [
          'Alakart & Fiks Menü Dengesi + Canlı Performanslar',
          'Klasik meze-ara sıcaktan ödün vermeden ana yemeklerde Beef Wellington ve Lokum Bonfile gibi teknik tabaklara uzanır.',
          'İşletme resmi menüsü ve gastronomi değerlendirmeleri',
        ],
      ],
      seat: 'Osmanağa Konakları içinde modern, geniş ve canlı akşam aydınlatmalı salon',
      crowd: 'Yüksek enerjili akşam sofrasında iddialı meze ve et ana yemekleri arayan kutlama grupları',
      dis: 'Çok yüksek fiyat segmentindedir; canlı müzik akşamlarında masa arası mesafe kalabalıklaşabilir',
      transit: 'Ümit Mahallesi 2494/3. Sokak No:6 Osmanağa Konakları.',
      sources: [
        [
          'Nükteli Resmi Sitesi',
          'https://nukteli.com/',
          'operator',
          'Alakart ve fiks menü detayları, Osmanağa Konakları konumu',
        ],
        [
          'GüncelMenü Nükteli',
          'https://www.guncelmenu.com.tr/',
          'editorial',
          'Meze, ara sıcak ve özel şef ana yemekleri menü kayıtları',
        ],
      ],
      pros: ['Yaklaşık bin değerlendirmede çizgisini koruyan yüksek mutfak standartı', 'Hem meyhane hem güçlü et ana yemeği alternatifi'],
      cons: ['Çok yüksek bütçe kategorisinde yer alır'],
      unc: ['Hafta sonu canlı müzikli gecelerde fix menü uygulaması geçerli olabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-kavakli-restaurant',
      placeId: 'ChIJFfRdCphT0xQRULD4WLKr8ZI',
      cat: 'denemelisin',
      name: 'Kavaklı Restaurant Beysukent',
      brand: 'Kavaklı',
      area: 'Angora Blv., Beysukent',
      signals: ['mangal-ocakbasi', 'ferah-teras', 'aile-ve-is-sofrasi'],
      desc:
        'Angora Bulvarı 2015. Cadde üzerindeki ferah terası ve salonuyla mangalda Adana kebap, kuzu pirzola, taş fırın pideler ve taze meze dolabını aile yemekleri ile iş toplantılarına uygun ciddiyette sunan Beysukent durağı.',
      order: ['Mangalda Adana Kebap / Kuzu Pirzola', 'Zengin Meze Dolabı & Taş Fırın Pide'],
      menu: ['Adana Kebap', 'Kuzu Pirzola', 'Taş Fırın Pideler', 'Meze Çeşitleri'],
      sec: [
        [
          'Ferah Teras & Meze-Izgara Dengesi',
          'Grup yemeklerinde meze dolabından seçimler doğrudan mangaldan çıkan pirzola ve kebaplarla dengelenir.',
          'İşletme mutfak kayıtları ve şehir değerlendirmeleri',
        ],
      ],
      seat: 'Beysukent villa aksında ferah teraslı ve düzenli aile-iş restoranı salonu',
      crowd: 'Beysukent ve Angora çevresinde düzenli serviste mangal kebap ve meze yemek isteyen aileler',
      dis: 'Üst segment fiyat düzeyindedir; akşam grup yemekleri için rezervasyon gerekir',
      transit: 'Mutlukent Mahallesi Angora Bulvarı 2015. Cadde No:4/8 (Beysukent).',
      sources: [
        [
          'Kavaklı Beysukent Resmi Sitesi',
          'https://beysukent.kavaklirestaurant.com/',
          'operator',
          'Mangal ızgaralar, meze dolabı, ferah teras ve Beysukent adresi',
        ],
        [
          'Restoranim Kavaklı Restaurant',
          'https://www.restoranim.net/',
          'editorial',
          'Adana kebap, pirzola, teras düzeni ve aile sofrası incelemeleri',
        ],
      ],
      pros: ['Beysukent içinde ferah teras ve oturmuş aile/iş yemeği standardı', 'Izgara etler yanında güçlü meze dolabı'],
      cons: ['Yüksek bütçe sınıfı ve özel araç gerektiren konum'],
      unc: ['Hafta sonu aile buluşmalarında teras masaları hızlı dolar'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-patron-sapkali',
      placeId: 'ChIJSZ8i8v850xQR6bJbiPTIYVw',
      cat: 'denemelisin',
      name: 'Patron Şapkalı Meyhane',
      brand: 'Patron',
      area: '1946. Sk., Ümitköy',
      signals: ['fasil-ve-akdeniz-meze', 'ickini-al-gel-kokeni', 'mutlukent-keyfi'],
      desc:
        'Mutlukent 1946. Sokak üzerinde geleneksel fasıl geleneğini Akdeniz-Yunan mezeleri ve deniz mahsulleriyle buluşturan; neşeli, erişilebilir bütçeli ve yüksek müdavim sadakati biriktirmiş Ümitköy meyhanesi.',
      order: ['Akdeniz-Yunan Meze Seçkisi', 'Deniz Mahsullü Ara Sıcaklar'],
      menu: ['Soğuk Akdeniz-Ege Mezeleri', 'Deniz Mahsulleri', 'Izgara Ana Yemekler'],
      sec: [
        [
          'Geleneksel Fasıl Atmosferi & Dengeli Fiyat Politikası',
          'Lüks sunumlu yeni nesil meyhanelerden ayrılarak samimi fasıl ortamını erişilebilir masa maliyetiyle korur.',
          'İşletme tanıtımları ve harita değerlendirmeleri',
        ],
      ],
      seat: 'Neşeli fasıl masaları ve samimi klasik Ümitköy meyhane salonu',
      crowd: 'Samimi ortamda Ege-Akdeniz mezeleri eşliğinde fasıl dinlemek isteyen arkadaş grupları',
      dis: 'Neşeli ve sesli fasıl akşamları olduğu için sakin bir baş başa konuşma mekânı değildir',
      transit: 'Mutlukent Mahallesi 1946. Sokak No:4 (Galleria arkası).',
      sources: [
        [
          'Patron Şapkalı Meyhane Resmi Sitesi',
          'https://xn--patronsapkalmeyhane-r5c.com/',
          'operator',
          'Akdeniz-Yunan mezeleri, deniz ürünleri ve fasıl kültürü detayları',
        ],
        [
          'Yandex Haritalar Patron Şapkalı',
          'https://yandex.com.tr/',
          'community',
          'Mutlukent 1946. Sk. konumu, neşeli atmosfer ve yüksek puan istikrarı',
        ],
      ],
      pros: ['Ümitköy meyhane ortalamasına göre makul bütçe ve samimi yaklaşım', 'Ege-Yunan mezeleri ile geleneksel fasıl uyumu'],
      cons: ['Fasıl saatlerinde yüksek ortam sesi'],
      unc: ['Masa koşulları ve güncel fasıl takvimi önceden teyit edilmelidir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-angora-grill',
      placeId: 'ChIJBfjHONo50xQRsb_wX7TvF1k',
      cat: 'denemelisin',
      name: 'Angora Grill',
      brand: 'Angora',
      area: 'Angora Blv., Beysukent',
      signals: ['yagli-kara-kuzu-karski', 'zirh-adana', 'gec-saat-ocakbasi'],
      desc:
        'Angora Bulvarı No:29’da zırh kıymasından Adana kebap, özel kuzu karski (yağlı kara), çöp şiş ve mangal kokoreç gibi et odaklı ocakbaşı ürünlerini geç saatlere kadar sürdüren Beysukent ızgara durağı.',
      order: ['Yağlı Kara (Kuzu Karski) & Zırh Adana', 'Kuzu Çöp Şiş & Dürüm'],
      menu: ['Yağlı Kara', 'Zırh Adana Kebap', 'Kuzu Çöp Şiş', 'Kokoreç'],
      sec: [
        [
          'Gece Geç Saat Mangal Servisi & Doyurucu Dürümler',
          'Beysukent ve Angora hattında akşam geç saatlerde sıcak zırh Adana veya kuzu çöp şiş bulmak için öne çıkan noktadır.',
          'Sipariş platformu ve menü değerlendirmeleri',
        ],
      ],
      seat: 'Pratik, düzenli ve hızlı servise yönelik Beysukent ocakbaşı-ızgara düzeni',
      crowd: 'Geç saatte nitelikli zırh Adana, yağlı kara veya mangal dürüm yemek isteyen Beysukent sakinleri',
      dis: 'Bölge genelinde fiyat düzeyi mahalle kebapçılarının biraz üzerindedir',
      transit: 'Mutlukent Mahallesi Angora Bulvarı No:29 (Beysukent).',
      sources: [
        [
          'Yemeksepeti Angora Grill',
          'https://www.yemeksepeti.com/',
          'editorial',
          'Yağlı kara, zırh Adana, kuzu çöp şiş, kokoreç menüsü ve puan doğrulaması',
        ],
        [
          'Yandex Haritalar Angora Grill',
          'https://yandex.com.tr/',
          'community',
          'Angora Bulvarı konumu, geç saat servisi ve doyuruculuk notları',
        ],
      ],
      pros: ['Zırh kıyması ve kuzu etinde düzgün pişirim kalitesi', 'Gece geç saatlere uzanan ocakbaşı erişimi'],
      cons: ['Klasik mahalle dönercilerine kıyasla üst segment porsiyon fiyatları'],
      unc: ['Geç akşam siparişlerinde yoğunluk nedeniyle teslimat veya masa süresi uzayabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-berilya-pide',
      placeId: 'ChIJhQetJIw40xQRtCV37vFEjSM',
      cat: 'denemelisin',
      name: 'Berilya Pide Kebap Salonu',
      brand: 'Berilya',
      area: '2494. Sk., Ümitköy',
      signals: ['karadeniz-pide-aile-isletmesi', 'amasya-eti', 'temiz-esnaf-mutfagi'],
      desc:
        'Ümit Mahallesi 2494. Sokak üzerinde Karadeniz-Anadolu usulü pideleri, özel tedarik Amasya etinden hazırlanan kebapları ve küçük, tertemiz aile işletmesi samimiyetiyle mahallenin güvenilir esnaf lokantası.',
      order: ['Karadeniz Usulü Kıymalı / Kavurmalı Pide', 'Et Kebap & Izgara Çeşitleri'],
      menu: ['Karadeniz Pideleri', 'Kuşbaşılı & Kaşarlı Pide', 'Izgara Kebaplar'],
      sec: [
        [
          'Aile İşletmesi İlgisi & Temiz Esnaf Mutfağı',
          'Büyük kalabalık kebap saraylarından uzak, tertemiz mutfağı ve güler yüzlü servisiyle mahallenin müdavim lokantasıdır.',
          'Yerel menü kayıtları ve kullanıcı değerlendirmeleri',
        ],
      ],
      seat: 'Küçük, tertemiz ve sakin aile işletmesi lokantası düzeni',
      crowd: 'Abartısız, temiz malzemeli Karadeniz pidesi ve dürüst kebap yemek isteyen Ümitköy sakinleri',
      dis: 'Gösterişli dekorasyon veya geç gece eğlencesi sunmayan mütevazı bir esnaf salonudur',
      transit: 'Ümit Mahallesi 2494. Sokak No:70 D:7 (Ümitköy içi).',
      sources: [
        [
          'Restoranim Berilya Pide',
          'https://www.restoranim.net/',
          'editorial',
          'Küçük temiz aile işletmesi, Karadeniz/Anadolu pidesi değerlendirmesi',
        ],
        [
          'Menu-TR Berilya Pide',
          'https://www.menu-tr.com/',
          'editorial',
          'Amasya yöresi et kalitesi ve güler yüzlü hizmet detayları',
        ],
      ],
      pros: ['Mahalle arasında tertemiz aile mutfağı güvenilirliği', 'Amasya eti ve hamur dengesi'],
      cons: ['Küçük ölçekli sade esnaf salonu atmosferi'],
      unc: ['Hafta sonu öğle saatlerinde mahalle içi aile masaları nedeniyle dolabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'umitkoy-coffee-craft-town',
      placeId: 'ChIJ800ammI40xQRLUz0UCceC6Q',
      cat: 'denemelisin',
      name: 'Coffee Craft Town',
      brand: 'Craft',
      area: '1946. Sk., Ümitköy',
      signals: ['genis-craft-bahce', 'eksi-maya-sandvic-tatli', 'yillarin-umitkoy-bulusmasi'],
      desc:
        'Mutluköy 1946. Sokak’ta büyük bahçesi, New York cheesecake ve dolgulu dev donutları gibi zengin tatlı vitrini, ekşi mayalı Roast Beef & Cheddar sandviçleri, burgerleri ve kahveleriyle yıllardır yerini koruyan çok yönlü Ümitköy buluşma noktası.',
      order: ['Roast Beef & Cheddar Ekşi Maya Sandviç / Cheeseburger', 'New York Cheesecake / Cookie & V60'],
      menu: ['Roast Beef Sandviç', 'Cheeseburger & Veggie Burger', 'New York Cheesecake', 'Dolgulu Donut & Cookie', 'V60 Kahve'],
      sec: [
        [
          'Zengin Tatlı Vitrini & Ekşi Maya Sıcak Sandviçler',
          'Kahvaltıdan akşam saatlerine uzanan sürede hem V60 kahve-tatlı ikilisi hem doyurucu sıcak sandviç ve burger servisi sunar.',
          'İşletme resmi menüsü ve restoran rehberleri',
        ],
      ],
      seat: 'Mutluköy villaları içinde geniş bahçeli, hareketli çok amaçlı cafe-bistro salonu',
      crowd: 'Aynı masada biri burger/sandviç isterken diğeri cheesecake ve üçüncü dalga kahve arayan kalabalık gruplar',
      dis: 'Popülerliği nedeniyle bahçe saatleri hareketli ve yer yer gürültülüdür; sakin espresso barı arayanlar için büyük ölçeklidir',
      transit: 'Mutlukent Mahallesi Mutluköy Sitesi 1944. Cd. & 1946. Sk. No:1.',
      sources: [
        [
          'Coffee Craft Resmi Sitesi',
          'http://www.craftyolda.com/',
          'operator',
          'Mutluköy Town şubesi, kahve, ekşi maya sandviç ve tatlı mutfağı konsepti',
        ],
        [
          'Menu-TR Coffee Craft Town',
          'https://www.menu-tr.com/',
          'editorial',
          'New York cheesecake, dev donut, Roast Beef sandviç ve V60 değerlendirmeleri',
        ],
      ],
      pros: ['Yüksek oylama hacmine rağmen yemek, sandviç, tatlı ve kahve standardını koruması', 'Geniş bahçe kapasitesi'],
      cons: ['Büyük ve kalabalık düzeni nedeniyle sakin butik kafe hissi vermez'],
      unc: ['Hafta sonu bahçe masalarında boş yer bulmak zaman alabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // NEGATİF DENETİM KONTROLLERİ (Politika Kapısı Audit Testi — 16 Kontrol)
    // =========================================================================
    negControl('ctrl-umitkoy-pizzalocale-chain', 'ChIJb3JEbG450xQRbjk_ZcRPvvM', 'pizza', 'Çok şubeli Pizza Locale zinciri (Kapı 2)'),
    negControl('ctrl-umitkoy-hmbrgr-chain', 'ChIJ9y71WzY50xQR81lTDaINr94', 'hamburger', '14+ şubeli Ankara HMBRGR zinciri (Kapı 2)'),
    negControl('ctrl-umitkoy-mamasburger-chain', 'ChIJJc2RaxQ50xQRWVM8ZCOoMc4', 'hamburger', 'Çok şubeli Mama’s Burger zinciri (Kapı 2)'),
    negControl('ctrl-umitkoy-arabica-chain', 'ChIJwcyRq4g50xQRzwmJQ40KNhg', 'kahve', 'Çok şubeli Arabica Coffee House zinciri (Kapı 2)'),
    negControl('ctrl-umitkoy-arabica-garden-chain', 'ChIJR7pszKE50xQRHMc7CAc2sYk', 'kahve', 'Çok şubeli Arabica Coffee House zinciri (Kapı 2)'),
    negControl('ctrl-umitkoy-caffeditoee-chain', 'ChIJN1Jhzpo50xQRYa0Drsd7LsY', 'kahve', '14 şubeli Ankara Caffé Di Toeé zinciri (Kapı 2)'),
    negControl('ctrl-umitkoy-roastnberry-chain', 'ChIJ6wx-nS050xQRACxq8NeQnwc', 'kahve', 'Çok şubeli Roast’n Berry zinciri (Kapı 2)'),
    negControl('ctrl-umitkoy-dayikurek-chain', 'ChIJRSy2vuE50xQRsVUYeTf22GM', 'denemelisin', 'Çok şubeli Dayı Kürek Lahmacun zinciri (Kapı 2)'),
    negControl('ctrl-umitkoy-kruvasante-chain', 'ChIJo8FBvqY50xQRmElmKAmDJiQ', 'kahvalti', 'Çok şubeli Kruvasante zinciri (Kapı 2)'),
    negControl('ctrl-umitkoy-mikel-chain', 'ChIJpfsJcLw50xQRnDM_kj6tNqg', 'kahve', 'Uluslararası Mikel Coffee zinciri (Kapı 2)'),
    negControl('ctrl-umitkoy-duale-noncoffee', 'ChIJRb4WUNQ50xQRUP9Wx99-hdE', 'kahve', 'dessert_restaurant primaryType kahve uzmanı değil (Kapı 3B)'),
    negControl('ctrl-umitkoy-out-beytepe-kruvasanka', 'ChIJrYMngZY50xQR7HTeQA7s5M0', 'kahvalti', 'Beytepe 5315. Sk. güney sınır dışı (Kapı 4)'),
    negControl('ctrl-umitkoy-out-mustafakemal-croissant', 'ChIJsZW00AdH0xQRvhaAegGfTq0', 'kahvalti', 'Mustafa Kemal / Tepe Prime doğu sınır dışı (Kapı 4)'),
    negControl('ctrl-umitkoy-low-qness', 'ChIJCypnPK450xQRBfXcsT4MNP4', 'kahvalti', '3.8 puan standart 4.4 eşiğinin altında (Kapı 6)'),
    negControl('ctrl-umitkoy-low-doublezero', 'ChIJ8_ue6CA50xQRNodCRYcjm74', 'pizza', '4.3 puan 4.4 tabanı altı + çok şubeli pizza zinciri (Kapı 2/6)'),
    negControl('ctrl-umitkoy-low-finestra', 'ChIJ9-sVRQA50xQRoWVyhk33zFQ', 'kahve', '4.3 puan standart 4.4 eşiğinin altında (Kapı 6)'),
    negControl('ctrl-umitkoy-lagetom-chain', 'ChIJZXGFYwA50xQRAApD0_se4vM', 'kahve', 'Çok şubeli Lagetom Coffee zinciri (Kapı 2)'),
  ],
};
