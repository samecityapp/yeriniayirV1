import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const TRABZON_MERKEZ_DEF: V3RegionDefinition = {
  id: 'trabzon-merkez',
  slug: 'trabzon-merkez',
  city: 'Trabzon',
  district: 'Ortahisar',
  allowedDistricts: ['Ortahisar', 'Ortahi\u0307sar', 'Trabzon Merkez', 'Merkez'],
  neighborhood: 'Trabzon Merkez',
  officialQuarter:
    'Trabzon Ortahisar Merkez (Pazarkapı, Ortahisar Tarihî Mahalle, İskenderpaşa / Meydan, Kemerkaya, Gazipaşa, Cumhuriyet, Çarşı, Boztepe, Soğuksu, Çukurçayır, Yenimahalle, 1–2 Nolu Beşirli, Kalkınma & Yalıncak)',
  displayName: 'Trabzon Merkez (Ortahisar & Beşirli)',
  locative: "Trabzon Merkez'de",
  path: ['trabzon', 'ortahisar', 'trabzon-merkez'],
  aliases: [
    'Trabzon Merkez',
    'Trabzon',
    'Ortahisar',
    'Ortahisar Trabzon',
    'Meydan Trabzon',
    'Uzunsokak',
    'Uzun Sokak Trabzon',
    'Kunduracılar',
    'Pazarkapı',
    'Kemerkaya',
    'Boztepe Trabzon',
    'Ganita',
    'Faroz',
    'Beşirli',
    'Beşirli Trabzon',
    'Kalkınma Trabzon',
    'Konaklar Trabzon',
    'Değirmendere Trabzon',
    'Yalıncak',
  ],
  scopeNote:
    'Trabzon Ortahisar Merkez (İskenderpaşa/Meydan, Kemerkaya, Gazipaşa, Pazarkapı, Tarihî Ortahisar, Boztepe, Soğuksu, Çukurçayır, Yenimahalle, Beşirli, Kalkınma & Yalıncak; Akçaabat, Yomra, Maçka/Sümela/Hamsiköy, Çaykara/Uzungöl, Sürmene, Of, Vakfıkebir ve Beşikdüzü hariç) · Doğrulanmış Seçki',
  characterSubtitle:
    'Pazarkapı ve Uzun Sokak’tan Boztepe ile Beşirli sahiline uzanan 1856 Kalkanoğlu pilavı, 1948 Beton Helva ve Karadeniz deniz balıklarıyla gurme burgerler, üçüncü nesil kahve durakları, kuymak kahvaltıları ve akşam sofraları.',
  center: { lat: 41.003, lng: 39.724 },
  bbox: { minLat: 40.96, maxLat: 41.03, minLng: 39.65, maxLng: 39.845 },
  allowedNeighborhoodTokens: [
    'İskenderpaşa',
    'Iskenderpasa',
    'Kemerkaya',
    'Gazipaşa',
    'Gazipasa',
    'Cumhuriyet',
    'Çarşı',
    'Carsi',
    'Pazarkapı',
    'Pazarkapi',
    'Ortahisar',
    'Boztepe',
    'Soğuksu',
    'Soguksu',
    'Çukurçayır',
    'Cukurcayir',
    'Yenimahalle',
    '2 Nolu Beşirli',
    '2 Nolu Besirli',
    '1 Nolu Beşirli',
    '1 Nolu Besirli',
    'Beşirli',
    'Besirli',
    'Kalkınma',
    'Kalkinma',
    'Yalıncak',
    'Yalincak',
    'Konaklar',
    'Toklu',
    'Fatih',
    'Yeşiltepe',
    'Yesiltepe',
    'Bahçecik',
    'Bahcecik',
    'Kutlugün',
    'Sanayi',
  ],
  categories: buildRegionCategories({ coastalSeafood: true }),
  candidates: [
    // --- HAMBURGER (4) ---
    compactSeed({
      id: 'trb-buracco-burger',
      placeId: 'ChIJ9f4vSPs9ZEARAgjSPlvMU5Y',
      cat: 'hamburger',
      brand: 'buracco',
      area: 'İpekyolu Cd., Çukurçayır, Trabzon Merkez',
      signals: ['ozel-köfte', 'cukurcayir', 'butik-burger'],
      desc:
        'Çukurçayır İpekyolu Caddesi üzerinde taze çekim sulu burger köfteleri ve özgün sos dengesiyle Ortahisar sırtlarında en yüksek oylamaya sahip yerel burger restoranı.',
      order: ['Buracco Özel Dana Burger', 'Double Cheeseburger'],
      menu: ['Tütsü Aromalı Burger', 'Çıtır Tavuk Burger'],
      sec: [
        [
          'Baharatlı Patates & Yan Soslar',
          'Burger menülerin yanında sıcak ve çıtır dokusuyla öne çıkan eşlikçi.',
          'Yemekzone + Neleri Meşhur Trabzon',
        ],
      ],
      seat: 'Çukurçayır ana yolu üzerinde düzenli, sade aile ve genç dostu salon',
      crowd: 'Boztepe üstü Çukurçayır kesiminden akşam ve hafta sonu siparişleriyle yoğun',
      dis: 'Meydan ve Uzun Sokak merkezinden yokuş yukarısında kalır; toplu taşıma ya da araç gerektirir',
      transit: 'Çukurçayır İpekyolu Caddesi No:7A üzerinde Boztepe güzergâhının devamında',
      sources: [
        [
          'Neleri Meşhur Trabzon Burgerleri',
          'https://nelerimeshur.com/',
          'editorial',
          'Ortahisar Çukurçayır yüksek puanlı butik burger restoranı değerlendirmesi',
        ],
        [
          'Yemekzone Trabzon Rehberi',
          'https://yemekzone.com/',
          'community',
          'Özel köfteli Buracco çeşitleri ve servis tutarlılığı notları',
        ],
      ],
      pros: ['400 üstü geri bildirimle Ortahisar’ın en istikrarlı burger puanı', 'Dengeli et–ekmek uyumu'],
      cons: ['Çarşı Meydan’dan yürüyüş mesafesinde değil'],
      unc: ['Akşam paket yoğunluğunda masa servis süresi biraz uzayabilir'],
    }),
    compactSeed({
      id: 'trb-buns-eat-coffee',
      placeId: 'ChIJ3WK6lCY_ZEARNp_maQsNSYE',
      cat: 'hamburger',
      brand: 'buns',
      area: 'Devlet Sahil Yolu, 2 Nolu Beşirli, Trabzon Merkez',
      signals: ['besirli-sahil', 'el-yapimi-burger', 'buncake'],
      desc:
        'Beşirli sahil hattında yumuşak bun ekmeği içine hazırlanan burger çeşitlerini özel reçeteli tatlı kavanozları ve kahve servisiyle buluşturan modern sahil noktası.',
      order: ['Buns Özel Dana Burger', 'Cheeseburger'],
      menu: ['Mushroom & Cheddar Burger', 'Klasik Izgara Burger'],
      sec: [
        [
          'Buncake & Özel Tatlı Kupları',
          'Burger üstüne en çok sipariş edilen imzalı kupa tatlıları ve kahve kapanışı.',
          'dijital.menu + Restoranım Beşirli sayfası',
        ],
      ],
      seat: 'Beşirli sahil yolu üzerinde aydınlık, modern bistro masa düzeni',
      crowd: 'Beşirli ve Toklu gençleri ile sahilde keyifli burger molası verenlerle canlı',
      dis: 'Meydan merkezine uzaktır; sahil yolu üstünde akşamları park yeri aramak gerekebilir',
      transit: '2 Nolu Beşirli Devlet Sahil Yolu Caddesi No:429/A üzerinde dolmuş durağı yakını',
      sources: [
        [
          'Buns Dijital Menü',
          'https://dijital.menu/',
          'operator',
          'Dana burger çeşitleri, Buncake ve tatlı cup menüsü',
        ],
        [
          'Restoranım Trabzon Beşirli',
          'https://www.restoranim.net/',
          'community',
          'Beşirli sahil konumu ve el yapımı burger kalitesi değerlendirmeleri',
        ],
      ],
      pros: ['Beşirli’de sahil yolunda modern burger-kafe kombinasyonu', 'Tatlı kuplarıyla tamamlanan menü'],
      cons: ['Sahil caddesinde yoğun saatlerde park alanı sınırlı'],
      unc: ['Hafta sonu akşam masaları erken dolabiliyor'],
    }),
    compactSeed({
      id: 'trb-massa-hamburger',
      placeId: 'ChIJy9PGfJ8_ZEARmxkv4zxZS1Y',
      cat: 'hamburger',
      brand: 'massa hamburger',
      area: 'Devlet Sahil Yolu, 2 Nolu Beşirli, Trabzon Merkez',
      signals: ['mese-komur-izgara', 'füme-kaburga', 'yerel-klasik'],
      desc:
        '2 Nolu Beşirli sahil hattında meşe kömür ızgarasında pişen burger köfteleri ve tütsülenmiş dana kaburgalı Lokum Burger gibi doyurucu seçenekleriyle bilinen Trabzon yerel markası.',
      order: ['Lokum Burger (Füme Kaburgalı)', 'Massa Burger'],
      menu: ['Ottoman Burger', 'Klasik Cheeseburger'],
      sec: [
        [
          'Çıtır Soğan & Özel Soslu Patates',
          'Kömür ızgara köfte yanında dengeli kızartma eşlikçileri.',
          'dijital.menu + Yemeksepeti Beşirli',
        ],
      ],
      seat: 'Beşirli sahil yolu üzerinde ferah, grup dostu modern burger salonu',
      crowd: 'Trabzon’un yerel burger markaları arasında kalabalık arkadaş ve aile gruplarınca sık seçilir',
      dis: 'Trabzon içi iki şubeli yerel bir işletmedir; kömür dumanlı et tadı hafif burger arayanlara yoğun gelebilir',
      transit: '2 Nolu Beşirli Devlet Sahil Yolu Caddesi No:475/A üzerinde',
      sources: [
        [
          'Massa Hamburger Dijital Menü',
          'https://dijital.menu/',
          'operator',
          'Meşe kömür ızgara köfte, Lokum Burger ve Ottoman Burger çeşitleri',
        ],
        [
          'Yemeksepeti Beşirli İncelemeleri',
          'https://www.yemeksepeti.com/',
          'community',
          '500 üstü geri bildirimde köfte doyuruculuğu ve sos beğenisi',
        ],
      ],
      pros: ['Meşe kömüründe pişen karakteristik ızgara aroması', 'Geniş masa kapasitesi'],
      cons: ['Şehir merkezinin batı ucunda Beşirli aksında yer alır'],
      unc: ['Füme kaburga stoğu yoğun akşam saatlerinde değişebilir'],
    }),
    compactSeed({
      id: 'trb-miri-burger',
      placeId: 'ChIJHeY-SAA9ZEARA1-oz1Yjb7c',
      cat: 'hamburger',
      brand: 'miri burger',
      area: 'Bilaloğlu Sk., Cumhuriyet, Trabzon Merkez',
      signals: ['tiftik-kaburga', 'merkez-sokak', 'smash-köfte'],
      desc:
        'Cumhuriyet Mahallesi’nin ara sokağında ağır pişirilip didiklenmiş dana kaburga ve çıtır kenarlı dana köfte seçenekleriyle Meydan çevresinde öne çıkan butik burger dükkânı.',
      order: ['Ağır Pişmiş Kaburga Burger', 'Double Cheeseburger'],
      menu: ['Klasik Dana Burger', 'Özel Soslu Tavuk Burger'],
      sec: [
        [
          'Taze Baharatlı Patates & Cheddar Sos',
          'Menü yanında sıcak servis edilen doyurucu yan lezzet.',
          'Yemeksepeti + Restoranım + Addagio kayıtları',
        ],
      ],
      seat: 'Bilaloğlu Sokak içinde kompakt, sıcak butik dükkân düzeni',
      crowd: 'Meydan ve Hacı Kasım civarında öğle ve akşam hızlı gurme burger arayan yerliler',
      dis: 'Ara sokakta küçük metrekareli bir dükkândır; kalabalık gruplar için oturma kapasitesi sınırlıdır',
      transit: 'Cumhuriyet Mahallesi Bilaloğlu Sokak üzerinde Meydan Parkı’ndan yürüyüş mesafesinde',
      sources: [
        [
          'Yemeksepeti Miri Burger Ortahisar',
          'https://www.yemeksepeti.com/',
          'community',
          'Double ve özel soslu burger menüleri ile yüksek müşteri memnuniyeti',
        ],
        [
          'Restoranım Ortahisar İncelemeleri',
          'https://www.restoranim.net/',
          'editorial',
          'Ağır pişirilmiş kaburga burger ve fiyat-performans dengesi doğrulaması',
        ],
        [
          'Addagio Yerel Restoran Rehberi',
          'https://addagio.io/',
          'community',
          'Cumhuriyet Bilaloğlu Sokak yerel tek şubeli burger noktası onayı',
        ],
      ],
      pros: ['Meydan merkezinden yürüyerek gidilebilen gerçek butik burgerci', 'Ağır pişmiş kaburga farkı'],
      cons: ['Küçük iç mekân nedeniyle masa sayısı kısıtlı'],
      unc: ['Yoğun paket saatlerinde mutfak çıkışı yavaşlayabilir'],
    }),

    // --- KAHVE (2) ---
    compactSeed({
      id: 'trb-frenza-coffee',
      placeId: 'ChIJF3ZUUF49ZEARoc8y9l0xDMY',
      cat: 'kahve',
      brand: 'frenza',
      area: 'Belediye Cd., İskenderpaşa, Trabzon Merkez',
      signals: ['ozel-harman-kavrum', 'meydan-merkezi', 'matcha-ve-tatli'],
      desc:
        'Atatürk Meydanı hemen yanında Afrika ve Güney Amerika kökenli özel harmanlarıyla espresso bazları, strawberry matcha ve soğuk meyve demlemeleri sunan merkez nitelikli kahve dükkânı.',
      order: ['Single Origin / Özel Harman Filtre & Cortado', 'Strawberry Matcha Latte'],
      menu: ['Flat White', 'Iced Americano'],
      sec: [
        [
          'Ev Yapımı Tiramisu & Biscoff Cheesecake',
          'Kahvenin yanında en sık tercih edilen vitrin tatlıları ve Hibiscus Berry Lemon soğuk içeceği.',
          'frenzacoffee.com + Yemeksepeti Meydan',
        ],
      ],
      seat: 'Belediye Caddesi üzerinde modern ve düzenli iç kafe masaları',
      crowd: 'Meydan çevresi gençleri, çalışanlar ve nitelikli çekirdek arayanlarla gün boyu canlı',
      dis: 'Bölgenin popülerliği ve çekirdek sınıfı nedeniyle fiyatlar standart kahvehanelerin üzerindedir',
      transit: 'İskenderpaşa Belediye Caddesi No:28/A üzerinde Atatürk Alanı Meydanı’na yürüyüşle bir dakika',
      sources: [
        [
          'Frenza Coffee Resmi Site',
          'https://frenzacoffee.com/',
          'operator',
          'Afrika, Orta ve Güney Amerika nitelikli çekirdek harmanları',
        ],
        [
          'Yemeksepeti Meydan Frenza',
          'https://www.yemeksepeti.com/',
          'community',
          'Strawberry Matcha Latte, Hibiscus Berry Lemon, Tiramisu ve Biscoff Cheesecake menüsü',
        ],
      ],
      pros: ['Meydan merkezinde nadir bulunan yüksek hacimli saf kahveci', 'Zengin soğuk matcha ve çekirdek seçkisi'],
      cons: ['Ortalama üstü fiyat algısı ve akşam kalabalığı'],
      unc: ['Tatlı çeşitleri akşam geç saatte tükenebilir'],
    }),
    compactSeed({
      id: 'trb-albades-coffee',
      placeId: 'ChIJVe7Hjno9ZEARc1oxjrRSRwY',
      cat: 'kahve',
      brand: 'albades',
      area: 'Mehmet Sk., Kemerkaya, Trabzon Merkez',
      signals: ['kemerkaya-sokagi', '3-nesil-demleme', 'sicak-sohbet'],
      desc:
        'Kemerkaya’nın taş ve hareketli ara sokaklarından Mehmet Sokak’ta büyük zincirlerin dışında üçüncü nesil sıcak–soğuk kahve demlemeleri sunan bağımsız buluşma kahvecisi.',
      order: ['Flat White & Americano', 'Filtre Kahve'],
      menu: ['Caramel Latte', 'Soğuk Espresso Seçenekleri'],
      sec: [
        [
          'Bitki Çayları & Atıştırmalık Tatlılar',
          'Kahve dışında sıcak bitki çayı ve sohbete eşlik eden küçük tatlı tabakları.',
          'albades.com.tr + Restoranım Kemerkaya',
        ],
      ],
      seat: 'Kemerkaya sokak cephesinde samimi iç dekor ve masa yerleşimi',
      crowd: 'Trabzon merkez öğrenci ve çalışan kesimi için buluşma noktası',
      dis: 'Hareketli ara sokak konumu nedeniyle derin sessizlik arayan çalışma ortamından çok sohbet kafesidir',
      transit: 'Kemerkaya Mahallesi Mehmet Sokak No:5/A üzerinde Halkevi Caddesi ve Uzun Sokak köşesinde',
      sources: [
        [
          'Albades Coffee Resmi Site',
          'https://albades.com.tr/',
          'operator',
          'Kemerkaya Mehmet Sokak konumu ve nitelikli kahve menüsü',
        ],
        [
          'Restoranım Kemerkaya Rehberi',
          'https://www.restoranim.net/',
          'community',
          'Sıcak–soğuk kahveler, bitki çayları ve merkezi atmosfer değerlendirmesi',
        ],
      ],
      pros: ['Uzun Sokak–Kemerkaya dokusunda tek şubeli yerel kafe', 'Güler yüzlü hızlı servis'],
      cons: ['Sessiz kütüphane tarzı uzun çalışma yerine sosyal buluşma odaklı'],
      unc: ['Hafta sonu öğleden sonra masa bulmak güçleşebilir'],
    }),

    // --- DATE & AKŞAM SOFRASI (2) ---
    compactSeed({
      id: 'trb-berweuli',
      placeId: 'ChIJlWC4lEg8ZEARR5z4f5SYz5I',
      cat: 'date',
      brand: 'berweuli',
      area: 'Sarayatik Cami Sk., Tarihî Ortahisar, Trabzon Merkez',
      signals: ['tarihi-sur-manzarasi', 'teras-aksami', 'yoresel-osmanli'],
      desc:
        'Tarihî Ortahisar Mahallesi’nin taş surları üzerindeki eski sokakta taş duvarlar ve şehir terası manzarası eşliğinde yoğurtlu mısır çorbası, Berweuli köftesi ve Osmanlı pilavı sunan özenli akşam restoranı.',
      order: ['Berweuli Köftesi & Kaymaklı Tavuk', 'Yoğurtlu Mısır Çorbası'],
      menu: ['Osmanlı Pilavı', 'Fettuccine & Taş Fırın Pide Seçenekleri'],
      sec: [
        [
          'Teras Akşam Çayı & Yöresel Tatlılar',
          'Tarihî Ortahisar kalesi ve surlara bakan terasta yemek sonu sıcak içecek keyfi.',
          'Şehir Pusulası + Wanderlog incelemeleri',
        ],
      ],
      seat: 'Taş dokulu tarihî iç mekân ve şehri gören teras masaları',
      crowd: 'Çiftler, özel akşam yemeği misafirleri ve tarihî mahalleyi gezen ziyaretçilerle özenli',
      dis: 'Tarihî dar sokak yapısı sebebiyle kapı önüne doğrudan araç parkı zordur; fiyat seviyesi ortalamanın üzerindedir',
      transit: 'Ortahisar Mahallesi Sarayatik Cami Sokak No:22 üzerinde Pazarkapı ve Kale surlarından kısa yürüyüşle',
      sources: [
        [
          'Şehir Pusulası Trabzon Rehberi',
          'https://sehirpusulasi.com/',
          'editorial',
          'Tarihî surlar üzerinde restoran profili, 4.7 puan ve manzaralı teras incelemesi',
        ],
        [
          'Wanderlog Ortahisar Yemekleri',
          'https://wanderlog.com/',
          'community',
          'Yoğurtlu mısır çorbası, Berweuli köftesi ve Osmanlı pilavı doğrulaması',
        ],
      ],
      pros: ['Tarihî Ortahisar kalesi içinde gerçek atmosfer ve teras', 'Bin beş yüz üstü oylamayla 4.7 istikrarı'],
      cons: ['Dar tarihî sokakta otopark olmaması ve üst fiyat bandı'],
      unc: ['Akşam teras masaları için önceden rezervasyon önerilir'],
    }),
    compactSeed({
      id: 'trb-muzeyyen-restaurant',
      placeId: 'ChIJDYX48y09ZEARmIs4Vkanxrc',
      cat: 'date',
      brand: 'müzeyyen',
      area: 'Rize Cd., Yalıncak, Trabzon Merkez',
      signals: ['yeni-nesil-meyhane', 'meze-dolabi', 'canli-muzik'],
      desc:
        'Yalıncak sahil şeridinde zengin soğuk meze seçkisi, güveçte deniz ürünleri, yaprak ciğer ve akşam canlı müzik eşliğiyle Trabzon’un önde gelen akşam buluşma ve kutlama restoranı.',
      order: ['Soğuk Meze Seçkisi & Girit Ezmesi', 'Yaprak Ciğer & Güveçte Deniz Ürünleri'],
      menu: ['Kuzu & Steak Seçenekleri', 'Mevsimlik Balık Izgara'],
      sec: [
        [
          'Paçanga Böreği & Sıcak Ara Başlangıçlar',
          'Ana yemek öncesi sofrayı kuran meyhane ara sıcakları.',
          'Şehir Pusulası + Bujuyollarda Trabzon dosyası',
        ],
      ],
      seat: 'Yalıncak deniz cephesinde geniş, özenle kurulmuş şık meyhane salonu',
      crowd: 'Özel kutlamalar, çiftler ve müzikli akşam sofraları için önceden rezervasyonlu yüksek talep',
      dis: 'Trabzon’un yüksek fiyat segmentindedir; canlı müzik ve servis ücretleri hesaba eklenebilir ve Yalıncak yönüne araç gerektirir',
      transit: 'Yalıncak Mahallesi Rize Caddesi No:108 üzerinde doğu sahil yolu hattında',
      sources: [
        [
          'Şehir Pusulası Müzeyyen İncelemesi',
          'https://sehirpusulasi.com/',
          'editorial',
          'Yeni nesil meyhane konsepti, meze, deniz ürünleri ve canlı müzik bilgisi',
        ],
        [
          'Bujuyollarda Trabzon Akşam Rehberi',
          'https://www.bujuyollarda.com/',
          'community',
          'Girit ezmesi, yaprak ciğer ve özel akşam atmosferi değerlendirmesi',
        ],
      ],
      pros: ['Şehirde meyhane ve akşam kutlama standardını tutan nadir adreslerden biri', 'Geniş meze yelpazesi'],
      cons: ['Üst fiyat politikası ve müzik/servis ek kalem ihtimali', 'Merkez Çarşı’dan araçla doğuda yer alması'],
      unc: ['Fasıl/canlı müzik günlerinde masa rezervasyonu ve ücret detayı önceden sorulmalıdır'],
    }),

    // --- KAHVALTI (4) ---
    compactSeed({
      id: 'trb-ganita-restaurant',
      placeId: 'ChIJPSbGDRw9ZEARXSpbwbignoc',
      cat: 'kahvalti',
      brand: 'ganita restaurant',
      area: 'Ganita Sahili, İskenderpaşa, Trabzon Merkez',
      signals: ['deniz-sifir-ganita', 'kuymak-kaygana', 'serpme-kahvalti'],
      desc:
        'Yenilenen tarihî Ganita sahilinde Karadeniz dalgalarının kıyısında uzayan peynirli kuymak, sıcak kaygana, yerel reçeller ve demlik çayla sabah serpme kahvaltısı sunan kıyı tesisi.',
      order: ['Ganita Serpme Kahvaltı & Sıcak Kuymak', 'Trabzon Kayganası'],
      menu: ['Yöresel Peynir & Tereyağı Tabağı', 'Mevsimlik Deniz Ürünleri (Öğle/Akşam)'],
      sec: [
        [
          'Kalkan & Kötek Balık Seçenekleri',
          'Kahvaltı saatleri dışında sahilde balık yemeği arayanlar için tesisin öğle-akşam menüsü.',
          'trabzon.bel.tr + Onedio Trabzon seçkisi',
        ],
      ],
      seat: 'Deniz sıfırında geniş açık rıhtım ve ferah camlı kapalı oturma alanı',
      crowd: 'Hafta sonu sabahları ve güzel havalarda yerlilerle yoğun kalabalık',
      dis: 'Büyükşehir tesisi olduğundan yoğun sezon sabahlarında servis hızı ağırlaşabilir; pik saatlerde tek içecek servisi sınırlanabilir',
      transit: 'İskenderpaşa Ganita Sahili No:299 üzerinde Meydan’dan yaya geçidiyle sahile yürüyerek inilir',
      sources: [
        [
          'Trabzon Büyükşehir Ganita Menü',
          'https://www.trabzon.bel.tr/',
          'operator',
          'Ganita sahili serpme kahvaltı, kuymak, kaygana ve balık menüsü',
        ],
        [
          'Onedio Trabzon Kahvaltı Rehberi',
          'https://onedio.com/',
          'editorial',
          'Deniz sıfırında serpme kahvaltı ve yerel ürünler incelemesi',
        ],
      ],
      pros: ['Trabzon’un simge Ganita kıyısında doğrudan deniz yakınlığı', 'Meydan’dan yürüyerek kolay erişim'],
      cons: ['Kalabalık tatil sabahlarında bekleme ve servis aksaması riski'],
      unc: ['Yoğun sezonda yalnızca kahve/çay servisi için masa kısıtlaması uygulanabilir'],
    }),
    compactSeed({
      id: 'trb-terrace-soguksu',
      placeId: 'ChIJ_zNA3KQ_ZEARmHx61wtGl8s',
      cat: 'kahvalti',
      brand: 'terrace',
      area: '1405 Nolu Sk., Soğuksu, Trabzon Merkez',
      signals: ['soguksu-manzarasi', 'serpme-kahvalti', 'yoresel-peynirler'],
      desc:
        'Atatürk Köşkü yakasındaki Soğuksu sırtlarında yeşillik ve şehir manzarası eşliğinde uzun sabah serpme kahvaltıları ve sanat galerisi dokulu restoran oturumu sunan mekan.',
      order: ['Serpme Yöresel Kahvaltı', 'Sıcak Kuymak & Sahanda Yumurta'],
      menu: ['Kahvaltı Tabağı', 'Dünya Mutfağı Öğle Tabakları'],
      sec: [
        [
          'Izgara Ana Yemekler & Atıştırmalıklar',
          'Kahvaltı dışındaki saatlerde soya soslu tavuk ve özel burger seçenekleri.',
          'Yemeksepeti + Restoranım Soğuksu',
        ],
      ],
      seat: 'Soğuksu yamaçlarında manzaralı geniş cam salon ve bahçe köşeleri',
      crowd: 'Hafta sonu kahvaltısı için Çarşı kalabalığından yukarı kaçan aileler',
      dis: 'Soğuksu yokuşu üstünde olduğu için merkezden özel araç veya taksi gerektirir',
      transit: 'Soğuksu Mahallesi 1405 Nolu Sokak 6H üzerinde Atatürk Köşkü güzergâhında',
      sources: [
        [
          'Restoranım Soğuksu Terrace',
          'https://www.restoranim.net/',
          'editorial',
          'Soğuksu manzaralı sınırsız/serpme kahvaltı ve 4.5 puan profili',
        ],
        [
          'Yemeksepeti Terrace Art Cafe',
          'https://www.yemeksepeti.com/',
          'community',
          'Kahvaltı ve dünya mutfağı yan yemekleri menü doğrulaması',
        ],
      ],
      pros: ['Soğuksu’nun serin ve yeşil yamacında huzurlu kahvaltı', 'Merkez dışındaki gürültüden uzaklık'],
      cons: ['Yürüyerek gidilemeyecek yokuş konum'],
      unc: ['Hafta sonu serpme kahvaltı için sabah erken saatler daha sakindir'],
    }),
    compactSeed({
      id: 'trb-sinan-aga',
      placeId: 'ChIJoWp4AZM9ZEARS4VOVCZ0Hs0',
      cat: 'kahvalti',
      brand: 'sinan ağa',
      area: 'Akif Saruhan Cd., Kalkınma, Trabzon Merkez',
      signals: ['sicak-tost-kahvalti', 'kavurmali-yumurta', 'ktu-cevresi'],
      desc:
        'Kalkınma’da öğrencilerin ve bölge sakinlerinin taze kavurmalı kaşarlı tostlar, menemen ve hızlı kahvaltı tabakları için tercih ettiği pratik sabah kahvaltıcısı.',
      order: ['Sinan Ağa / Kavurmalı Kaşarlı Tost', 'Serpme & Tek Kişilik Kahvaltı Tabağı'],
      menu: ['Atom Tost & Menemen', 'Sıcak Börek / Gözleme Çeşitleri'],
      sec: [
        [
          'Ekmek Arası Izgara Köfte & Tavuk',
          'Sabah kahvaltısı sonrasında gün boyu çıkan hızlı sıcak ızgara seçenekleri.',
          'Yemeksepeti + Migros Yemek Kalkınma',
        ],
      ],
      seat: 'Kalkınma Akif Saruhan Caddesi üzerinde hızlı ve sade esnaf salonu',
      crowd: 'Sabah ders ve mesai öncesi KTÜ çevresi gençleriyle dolu',
      dis: 'Manzaralı lüks serpme mekanları yerine pratik, sıcak ve bütçe dostu tost–kahvaltı dükkânıdır',
      transit: 'Kalkınma Mahallesi Akif Saruhan Caddesi No:32 üzerinde üniversite ana kapısına yakın',
      sources: [
        [
          'Yemeksepeti Kalkınma Sinan Ağa',
          'https://www.yemeksepeti.com/',
          'community',
          'Sinan Ağa tost, kavurmalı kaşarlı tost ve kahvaltı tabağı menü onayı',
        ],
        [
          'Migros Yemek Ortahisar',
          'https://www.migros.com.tr/',
          'community',
          'Kalkınma şubesi atom tost ve kahvaltı ürünleri listesi',
        ],
      ],
      pros: ['Şişirilmemiş gerçek mahalle tost ve kahvaltı lezzeti', 'Ulaşılabilir öğrenci dostu yapı'],
      cons: ['Uzun Boztepe/Ganita seyir kahvaltısı arayanlara fazla sade gelir'],
      unc: ['Sabah ders geçiş saatlerinde kısa masa yoğunluğu oluşabilir'],
    }),
    compactSeed({
      id: 'trb-cinaralti-yenimahalle',
      placeId: 'ChIJjZjEmC09ZEARrQ5p1FoO2kw',
      cat: 'kahvalti',
      brand: 'çınaraltı',
      area: 'Devlet Sahil Yolu, Yenimahalle, Trabzon Merkez',
      signals: ['aile-bahcesi', 'kuymak-serpme', 'sahil-otoparkli'],
      desc:
        'Yenimahalle sahil yolunda ferah oturumu ve otopark rahatlığıyla sabah saatlerinde kuymak, kaygana ve yöresel peynirli serpme kahvaltı; gün devamında da ızgara köfte-balık sunan aile restoranı.',
      order: ['Yöresel Kuymak & Serpme Kahvaltı', 'Trabzon Usulü Kaygana'],
      menu: ['Kahvaltı Tabağı', 'Izgara Akçaabat Tarzı Köfte & Balık'],
      sec: [
        [
          'Sütlaç & Baklava Tatlı Seçkisi',
          'Sofranın sonunda aile gruplarının sık paylaştığı geleneksel tatlılar.',
          'Restaurant Guru + Restoranım Trabzon',
        ],
      ],
      seat: 'Çocuk oyun alanı ve açık-kapalı geniş salonlu aile yerleşimi',
      crowd: 'Kalabalık aile kahvaltıları ve sahil yolu yemek molalarıyla sürekli canlı',
      dis: 'Büyük aile restoranı temposu butik sabah kafelerine göre daha hareketlidir; sahil yolu üstünde yer alır',
      transit: 'Yenimahalle Devlet Sahil Yolu Caddesi No:269 üzerinde Faroz ile Beşirli arasında',
      sources: [
        [
          'Restoranım Yenimahalle Çınaraltı',
          'https://www.restoranim.net/',
          'editorial',
          '2500 üstü geri bildirimde kuymak, kahvaltı temizliği ve aile dostu düzen',
        ],
        [
          'Restaurant Guru Trabzon Kayıtları',
          'https://restaurantguru.com/',
          'community',
          'Serpme kahvaltı, kaygana, köfte ve balık menü doğrulaması',
        ],
      ],
      pros: ['Aileler için çocuk alanı ve ulaşım rahatlığı', 'Kuymak ve sabah kahvaltısı sürekliliği'],
      cons: ['Sessiz iki kişilik kahve köşesinden çok aile lokantası atmosferi'],
      unc: ['Pazar kahvaltısında aile grupları nedeniyle kalabalık yükselir'],
    }),

    // --- BALIKÇILAR & DENİZ ÜRÜNLERİ (1) ---
    compactSeed({
      id: 'trb-bordo-mavi-balik',
      placeId: 'ChIJ1aZoyBA8ZEAR2dl2IGmTBOU',
      cat: 'balik',
      brand: 'bordo mavi',
      area: 'İpekyolu Cd., Boztepe, Trabzon Merkez',
      signals: ['boztepe-deniz-seyri', 'kaya-levregi-bugulama', 'tonya-tereyagi'],
      flags: { iconic: true },
      desc:
        'Boztepe yamacında Karadeniz manzaralı iki katlı salonunda kaya levreği buğulama, mevsimlik hamsi ve kalkanın yanında Tonya tereyağı, minzi peyniri ve fırınlanmış kum patates ikramıyla öne çıkan köklü balık restoranı.',
      order: ['Kaya Levreği Buğulama / Mevsimlik Kalkan', 'Balık Kokoreç & Fener Kavurma'],
      menu: ['Hamsi & Barbun Tava', 'Tereyağlı Karides'],
      sec: [
        [
          'Tonya Tereyağı, Minzi Peyniri & Kum Patates Başlangıcı',
          'Ana balık öncesi masaya gelen Trabzon’a özgü sıcak başlangıç ikramları.',
          'Kısık Ateş Akademi + Neleri Meşhur Trabzon',
        ],
      ],
      seat: 'Boztepe İpekyolu üzerinde Karadeniz’e bakan pencereli, iki katlı özenli salon',
      crowd: 'Trabzon dışından gelen gurmeler, iş yemekleri ve akşam deniz ürünü sofralarıyla yoğun',
      dis: 'Şehrin yüksek fiyat bandındaki deniz ürünleri restoranlarındandır ve Boztepe yamacı nedeniyle yokuş çıkışı gerektirir; yoğun saatte servis temposu esneyebilir',
      transit: 'Boztepe Mahallesi İpekyolu Caddesi üzerinde Meydan’dan Boztepe dolmuşu veya taksiyle beş dakika',
      sources: [
        [
          'Bordo Mavi Balık Resmi Site',
          'https://bordomavibalik.com.tr/',
          'operator',
          'Erşan Yılmaz mutfak disiplini, mevsim balıkları ve Boztepe salonu',
        ],
        [
          'Kısık Ateş Akademi Trabzon Dosyası',
          'https://kisikatesakademi.com.tr/',
          'editorial',
          'Tonya tereyağı, minzi peyniri, fırınlanmış kum patates ve deniz ürünleri incelemesi',
        ],
        [
          'GZT & Neleri Meşhur Trabzon',
          'https://nelerimeshur.com/',
          'editorial',
          'Kaya levreği buğulama, balık kokoreç ve fener kavurma gastronomi yazısı',
        ],
      ],
      pros: ['Trabzon yöre başlangıçlarını (Tonya tereyağı, minzi) nitelikli balık sofrasına taşıması', 'Boztepe manzarası'],
      cons: ['Üst fiyat segmenti ve çok kalabalık akşamlarda servis hızında esneme'],
      unc: ['Akşam ve hafta sonları için önceden masa ayırtmak gerekir'],
    }),

    // --- DENEMELİSİN — TRABZON GASTRONOMİSİ (3) ---
    compactSeed({
      id: 'trb-kalkanoglu-pilavi',
      placeId: 'ChIJq8zn6k48ZEARw8yhJiO4dy0',
      cat: 'denemelisin',
      brand: 'kalkanoğlu',
      area: 'Tophane Cami Sk., Pazarkapı, Trabzon Merkez',
      signals: ['1856-esnaf-mirasi', 'kemik-sulu-pilav', 'teraziyle-servis'],
      flags: { heritage: true, ritual: true },
      desc:
        '1856’dan beri Pazarkapı’da beşinci kuşaktır kemik suyu ve saf Trabzon tereyağıyla pişen pirinç pilavını geleneksel hassas teraziyle tartarak kavurma, kuru fasulye ve kayısı hoşafıyla sunan asırlık lezzet kurumu.',
      order: ['Teraziyle Kavurmalı Kemik Sulu Pilav', 'İspir Kuru Fasulye'],
      menu: ['Sade Tereyağlı Pilav', 'Geleneksel Kayısı Hoşafı'],
      sec: [
        [
          'Tepsi Kavurması & Osmanlı Hoşafı',
          'Pilav üstü yumuşak et kavurması ile yağ dengesini kıran soğuk hoşaf uyumu.',
          '100 Tarihi Lokanta + Biz Evde Yokuz Trabzon dosyası',
        ],
      ],
      seat: 'Pazarkapı tarihî sokağında mütevazı, işlevsel eski esnaf lokantası masaları',
      crowd: 'Öğle saatlerinde dükkân önünde kuyruk oluşturan yerel esnaf ve seyyahlarla yoğun',
      dis: 'Günlük hazırlanan sınırlı kazan bittiğinde kepenk kapatır; öğleden sonra geç gidenler pilavsız kalabilir ve tereyağlı yapısı hafife göre yoğun hissedilir',
      transit: 'Pazarkapı Mahallesi Tophane Cami Sokak No:3 üzerinde Kahramanmaraş Caddesi alt paralelinde',
      sources: [
        [
          '100 Tarihi Lokanta Arşivi',
          'https://100tarihilokanta.com/',
          'editorial',
          '1856 kuruluşu, kemik suyu ve Trabzon tereyağı reçetesiyle asırlık esnaf lokantası',
        ],
        [
          'Biz Evde Yokuz Trabzon Rehberi',
          'https://bizevdeyokuz.com/',
          'editorial',
          'Teraziyle gramaj servisi, tepsi kavurma, kuru fasulye ve kayısı hoşafı incelemesi',
        ],
        [
          'Bujuyollarda Trabzon Rotası',
          'https://www.bujuyollarda.com/',
          'community',
          '5 kuşak ustalık ve erken tükenme notu',
        ],
      ],
      pros: ['1856’dan kesintisiz 5 kuşaklık Osmanlı–Trabzon esnaf mirası', 'Kemik suyu ve saf tereyağı tekniği'],
      cons: ['Günün stoğu bittiğinde erken kapanması ve öğle kuyruğu'],
      unc: ['Öğle saatleri dışında kavurma ve pilav kalmama ihtimali yüksektir'],
    }),
    compactSeed({
      id: 'trb-beton-helva',
      placeId: 'ChIJpXF6QUQ8ZEARNV7WshmxQFM',
      cat: 'denemelisin',
      brand: 'beton helva',
      area: 'Uzun Sk., Gazipaşa, Trabzon Merkez',
      signals: ['1948-uzun-sokak', 'tahin-helva', 'hamsikoy-sutlu-dondurma'],
      flags: { heritage: true },
      desc:
        '1948’den beri Uzun Sokak’ta sıkı dokusu nedeniyle “Beton” adını alan geleneksel tahin helvasının yanında Hamsiköy sütünden salepli kağıt helva arası dondurma ve taze şıra sunan asırlık Trabzon tatlıcısı.',
      order: ['Hamsiköy Sütlü Salepli Dondurma (Kağıt Helvalı)', 'Geleneksel Beton Tahin Helva'],
      menu: ['Kakaolu & Antep Fıstıklı Helva', 'Doğal Üzüm Şırası'],
      sec: [
        [
          'Taze Şıra & Paket Hediyelik Helva Kalıpları',
          'Dondurma dışında eve götürmek için tartılı kesilen klasik helva çeşitleri.',
          'Kısık Ateş Akademi + Oggusto Trabzon dosyası',
        ],
      ],
      seat: 'Uzun Sokak içinde küçük, ayaküstü ve hızlı tadım düzeni',
      crowd: 'Gün boyu Uzun Sokak kalabalığında kısa dondurma ve helva molası verenlerle canlı',
      dis: 'Oturup uzun saatler geçirilecek bir kafe değildir; ayaküstü tatma ve paket alma dükkânıdır',
      transit: 'Gazipaşa Mahallesi Uzun Sokak No:13/A üzerinde Meydan Parkı yürüyüş hattında',
      sources: [
        [
          'Kısık Ateş Akademi Beton Helva',
          'https://kisikatesakademi.com.tr/',
          'editorial',
          '1948 tarihçesi, beton kıvamlı tahin helvası ve taze şıra kaydı',
        ],
        [
          'Biz Evde Yokuz & Oggusto Trabzon',
          'https://bizevdeyokuz.com/',
          'editorial',
          'Hamsiköy sütünden salepli kağıt helva dondurması incelemesi',
        ],
        [
          'Oggusto Trabzon Lezzetleri',
          'https://www.oggusto.com/',
          'editorial',
          'Uzun Sokak simgesel tarihî helvacı önerisi',
        ],
      ],
      pros: ['1948’den beri değişmeyen helva reçetesi', 'Hamsiköy sütlü gerçek dondurma'],
      cons: ['Uzun oturum yeri olmayan küçük sokak dükkânı'],
      unc: ['Kış ve yaz sezonunda dondurma tezgâh saatleri değişiklik gösterebilir'],
    }),
    compactSeed({
      id: 'trb-kalender-lokanta',
      placeId: 'ChIJQ5YQK0Q8ZEARk_gnx9SgTqU',
      cat: 'denemelisin',
      brand: 'kalender',
      area: 'Şehit Onur Fikret Dülger Cd., Cumhuriyet, Trabzon Merkez',
      signals: ['ev-yemekleri', 'kalender-gozleme', 'tarihi-sokak'],
      desc:
        'Gazipaşa–Cumhuriyet sınırında eski bir Trabzon atmosferi içinde günlük çıkan tencere ev yemekleri, imza Kalender gözlemesi ve el yapımı tatlıları yerel gazoz seçkisiyle sunan samimi mahalle lokantası.',
      order: ['Günlük Tencere Ev Yemekleri & Çardak Kebabı', 'İmza Kalender Gözlemesi'],
      menu: ['Yoğurtlu Arpa Şehriye Salatası', 'Tavuklu Mantarlı Sote'],
      sec: [
        [
          'Yanardağ Pasta & Gazoz Seçkisi',
          'Öğle ev yemeğinin üstüne en sık sorulan ev yapımı tatlı ve nostaljik gazoz çeşitleri.',
          'Biz Evde Yokuz + Şehir Pusulası Trabzon',
        ],
      ],
      seat: 'Cumhuriyet caddesi içinde sıcak aydınlatmalı, nostaljik ev ortamı',
      crowd: 'Turistik gruplardan çok merkez çalışanları ve yerlilerin günlük öğle-akşamüstü adresi',
      dis: 'Günlük hazırlanan tencere yemekleri akşama doğru azalabilir; büyük gruplara göre masalar daha samimi ölçeklidir',
      transit: 'Cumhuriyet Şehit Onur Fikret Dülger Caddesi No:14 üzerinde Uzun Sokak üst paralelinde',
      sources: [
        [
          'Biz Evde Yokuz Trabzon Ev Yemekleri',
          'https://bizevdeyokuz.com/',
          'editorial',
          'Tencere yemekleri, bütçe dostu ev lezzeti ve gün içi çeşit azalma notu',
        ],
        [
          'Şehir Pusulası Kalender İncelemesi',
          'https://sehirpusulasi.com/',
          'editorial',
          'Kalender gözlemesi, tencere yemekleri ve ev yapımı tatlılar incelemesi',
        ],
      ],
      pros: ['800 üstü puanlamada 4.5 ortalamalı gerçek ev mutfağı', 'Makul yerel fiyat dengesi'],
      cons: ['Geç saatlerde günlük tencere yemekleri tükenebiliyor'],
      unc: ['Gözleme ve tatlı seçenekleri gün içi mutfak durumuna göre değişir'],
    }),

    // --- NEGATİF DENETİM KONTROLLERİ (22) ---
    negControl(
      'ctrl-trb-napoli-closed',
      'ChIJ36zCtMQ9ZEARBVr25B5v_tM',
      'pizza',
      'CLOSED_PERMANENTLY işletme kabul edilmez (Kapı 1)'
    ),
    negControl(
      'ctrl-trb-kusina-closed',
      'ChIJyROjjSY9ZEAR8-pdR1HBMS0',
      'pizza',
      'CLOSED_TEMPORARILY işletme kabul edilmez (Kapı 1)'
    ),
    negControl(
      'ctrl-trb-babapizza-closed',
      'ChIJH_TlyJM7ZEARVC8pWLZZ-ZY',
      'pizza',
      'CLOSED_PERMANENTLY işletme kabul edilmez (Kapı 1)'
    ),
    negControl(
      'ctrl-trb-penneroma-closed',
      'ChIJ82-ZxmM9ZEAR3xRpCdZCq1Q',
      'date',
      'CLOSED_PERMANENTLY + ★3.9 (Kapı 1/6)'
    ),
    negControl(
      'ctrl-trb-seyrisefa-closed',
      'ChIJExD3SBU8ZEAREZJvNoPJXBs',
      'kahvalti',
      'CLOSED_PERMANENTLY + ★3.3 (Kapı 1/6)'
    ),
    negControl(
      'ctrl-trb-fazilusta-closed',
      'ChIJzewG4M09ZEARKktLm_IaDGU',
      'balik',
      'CLOSED_PERMANENTLY + ★3.9 (Kapı 1/6)'
    ),
    negControl(
      'ctrl-trb-fevzihoca-closed',
      'ChIJvw_CU0Q8ZEARf78MgOXVmr0',
      'balik',
      'CLOSED_PERMANENTLY + çok şehirli zincir (Kapı 1/2)'
    ),
    negControl(
      'ctrl-trb-crakers-chain',
      'ChIJUbVLeXk8ZEARK-ighYbYzpc',
      'pizza',
      'Crakers Pizza zinciri + ★4.1 (Kapı 2/6)'
    ),
    negControl(
      'ctrl-trb-dominos-chain',
      'ChIJzcX9yCw8ZEAR2nMq55Jztfk',
      'pizza',
      "Domino's Pizza küresel zincir + ★3.5 (Kapı 2/6)"
    ),
    negControl(
      'ctrl-trb-pizzalocale-chain',
      'ChIJNyWkRTI9ZEARzbyDuAuFr0c',
      'pizza',
      'Pizza Locale çok şehirli zincir (Kapı 2)'
    ),
    negControl(
      'ctrl-trb-ercanburger-chain',
      'ChIJOTmaxDvayhQRatUMXaG3MAc',
      'hamburger',
      'Ercan Burger çok şehirli zincir + ★4.2 (Kapı 2/6)'
    ),
    negControl(
      'ctrl-trb-greenwich-chain',
      'ChIJN12Swh89ZEAR_QCw2QGqjcA',
      'kahve',
      'Greenwich Coffee çok şehirli kahve zinciri (Kapı 2)'
    ),
    negControl(
      'ctrl-trb-nesh-chain',
      'ChIJ650xVHg8ZEARKrxGaT8N1gg',
      'kahve',
      'Nesh çok şubeli yerel tatlı-kahve zinciri (Kapı 2)'
    ),
    negControl(
      'ctrl-trb-espressolab-chain',
      'ChIJNdUWX649ZEAR2DBlEb2gbyc',
      'kahve',
      'Espressolab küresel kahve zinciri (Kapı 2)'
    ),
    negControl(
      'ctrl-trb-laos-chain',
      'ChIJJR7hdPM9ZEARZ7OD1B7kzdU',
      'kahve',
      'Laos Coffee zincir engeli + ★3.5 (Kapı 2/6)'
    ),
    negControl(
      'ctrl-trb-cemilusta-chain',
      'ChIJ0f5RkEQ8ZEARz8BRNP9uNxU',
      'denemelisin',
      'Cemilusta çok şubeli zincir + ★4.0 (Kapı 2/6)'
    ),
    negControl(
      'ctrl-trb-ortahisarfirin-purity',
      'ChIJq574H0k8ZEAR3MqFzdP7Xbw',
      'kahve',
      'bakery türünde işletme saf kahveci değildir + 10 değerlendirme (Kapı 3B/6)'
    ),
    negControl(
      'ctrl-trb-rustu-low',
      'ChIJk8v26U48ZEARqxJ-7EdxfYo',
      'denemelisin',
      "Rüştü'nün Fırını ★3.6 — minimum taban altı (Kapı 6)"
    ),
    negControl(
      'ctrl-trb-baliklama-low',
      'ChIJQ7eKB3I8ZEAR0N-emsbhtEQ',
      'balik',
      'Koruma bayrağı olmadan ★4.2 < ★4.4 kalite eşiği (Kapı 6)'
    ),
    negControl(
      'ctrl-trb-rokabalik-low',
      'ChIJdZmeJUQ8ZEARhm1wiMAMRu0',
      'balik',
      'Koruma bayrağı olmadan ★4.3 < ★4.4 kalite eşiği (Kapı 6)'
    ),
    negControl(
      'ctrl-trb-akcaabat-korfez-outside',
      'ChIJTVHl3TgUZEARiLA9ZTwY540',
      'denemelisin',
      'Akçaabat Körfez Köfte — Ortahisar sınır dışı dış ilçe (Kapı 4)'
    ),
    negControl(
      'ctrl-trb-yomra-kumsal-outside',
      'ChIJ6aNq2WM6ZEARhpmScEMS7PA',
      'balik',
      'Yomra Kaşüstü Kumsal — Ortahisar sınır dışı dış ilçe (Kapı 4)'
    ),
    negControl(
      'ctrl-trb-hamsikoy-macka-outside',
      'ChIJySW0EShWZEAR4VDm_PIbu3A',
      'denemelisin',
      'Maçka Hamsiköy Osman Usta — Ortahisar sınır dışı dış ilçe (Kapı 4)'
    ),
  ],
};
