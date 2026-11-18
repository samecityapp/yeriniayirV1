import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const ANKARA_CANKAYA_GAZIOSMANPASA_DEF: V3RegionDefinition = {
  id: 'ankara-cankaya-gaziosmanpasa',
  slug: 'gaziosmanpasa',
  city: 'Ankara',
  district: 'Çankaya',
  allowedDistricts: ['Çankaya', 'Kavaklıdere', 'Gaziosmanpaşa'],
  neighborhood: 'Gaziosmanpaşa',
  officialQuarter:
    'Gaziosmanpaşa, Büyükesat & Kazım Özalp Mahalleleri (Arjantin Caddesi, Filistin Caddesi, İran Caddesi, Uğur Mumcu Caddesi, Koza Sokak, Reşit Galip, Attar, Kırlangıç & Kuleli Sokak Aksları)',
  displayName: 'Gaziosmanpaşa, Çankaya, Ankara',
  locative: "Gaziosmanpaşa'da",
  path: ['ankara', 'cankaya', 'gaziosmanpasa'],
  aliases: [
    'Gaziosmanpaşa',
    'Gaziosmanpasa',
    'Gaziosmanpaşa Ankara',
    'Gaziosmanpaşa Çankaya',
    'GOP',
    'GOP Ankara',
    'Arjantin Caddesi',
    'Filistin Caddesi',
    'İran Caddesi',
    'Uğur Mumcu Caddesi',
    'Koza Sokak',
    'Büyükesat',
    'Kazım Özalp',
    'Reşit Galip',
  ],
  scopeNote:
    'Gaziosmanpaşa, Büyükesat & Kazım Özalp (Arjantin, Filistin, Uğur Mumcu, Kuleli & Nenehatun hattı; Kavaklıdere/Tunalı, Ayrancı, Yıldız ve Oran hariç) · Doğrulanmış Seçki',
  characterSubtitle:
    'Rabat, Kuleli, Kırlangıç ve Nenehatun sokaklarından Arjantin, Filistin ve Uğur Mumcu caddelerine yayılan Napoli pizzacısı, tek şubeli gurme burger noktası, üçüncü dalga kavurucular, Ankara’nın ödüllü balık ve Akdeniz sofraları, artizan kruvasan fırını ve köklü meyhane klasikleri.',
  center: { lat: 39.8955, lng: 32.8705 },
  bbox: { minLat: 39.8820, maxLat: 39.9040, minLng: 32.8615, maxLng: 32.8920 },
  allowedNeighborhoodTokens: [
    'Gaziosmanpaşa',
    'Gaziosmanpasa',
    'Büyükesat',
    'Buyukesat',
    'Kazım Özalp',
    'Kazim Ozalp',
  ],
  categories: buildRegionCategories(),
  candidates: [
    // =========================================================================
    // 1. PİZZA (1 tek şubeli bağımsız İtalyan pizzacısı — sıfır dolgu)
    // =========================================================================
    compactSeed({
      id: 'gop-origano-pizza',
      placeId: 'ChIJV4GK9CNP0xQRBk8H8Sm-myY',
      cat: 'pizza',
      name: 'Origano Pizza & Pasta',
      brand: 'origano',
      area: 'Rabat Sk., Gaziosmanpaşa',
      signals: ['sef-meryem-dogan', 'napoliten-odun-firini', 'el-yapimi-makarna'],
      desc:
        'Kazım Özalp Rabat Sokak’ta kurucu şef Meryem Doğan yönetiminde açık mutfaktan çıkan odun fırını Napoliten pizzalar ve günlük el yapımı taze makarnalarla bilinen tek şubeli Gaziosmanpaşa İtalyan restoranı.',
      order: ['Odun Fırını Margherita / Napoliten Pizza', 'El Yapımı Taze Makarna', 'Fırın Başlangıçları'],
      menu: ['Margherita', 'Quattro Formaggi', 'Bresaola Pizza', 'El Yapımı Makarnalar', 'Tiramisu'],
      sec: [
        [
          'El Yapımı Taze Makarna & İtalyan Tatlıları',
          'Napoliten pizzaların yanı sıra günlük açılan taze makarna tabakları ve tiramisu kapanışları sıkça tercih ediliyor.',
          'origanorestoran.com menü ve mutfak bilgileri',
        ],
      ],
      seat: 'Ferah bahçe masaları ve açık mutfağı gören şık, sakin iç salon',
      crowd: 'Gerçek odun fırını İtalyan mutfağı arayan çiftler ve akşam misafirleri',
      dis: 'Akşam bahçe ve salon masaları dolduğu için rezervasyon önerilir; yokuşlu Rabat Sokak’ta park sınırlıdır',
      transit: 'Kazım Özalp Mahallesi Rabat Sokak No:13/A (Arjantin üst paraleli).',
      sources: [
        [
          'Origano Resmi Sitesi',
          'https://origanorestoran.com/',
          'operator',
          'Şef Meryem Doğan imzalı Napoliten pizza, el yapımı makarna ve bahçe detayları',
        ],
        [
          'Yemek.com & Nerdeyiyelim',
          'https://yemek.com/',
          'editorial',
          'Açık mutfak odun fırını pizzaları ve taze makarna değerlendirmesi',
        ],
      ],
      pros: ['Şef yönetiminde tek şubeli gerçek İtalyan mutfağı', 'Bahçe ve pizza + makarna kalitesi'],
      cons: ['Sokak park yeri akşam saatlerinde kısıtlı'],
      unc: ['Hafta sonu bahçe masaları hızlı dolabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 2. HAMBURGER (1 tek şubeli bağımsız gurme burger — sıfır dolgu)
    // =========================================================================
    compactSeed({
      id: 'gop-arca-burger',
      placeId: 'ChIJdyjFZZpP0xQR2Lc0FT0iD4w',
      cat: 'hamburger',
      name: 'Arca Burger Ankara',
      brand: 'arca burger',
      area: 'Uğur Mumcu Cd., Gaziosmanpaşa',
      signals: ['ozel-sos-pluvia', 'gurme-recete-burger', 'buyukesat'],
      desc:
        'Uğur Mumcu Caddesi No:96/8’de Molendini Gourmand, Aurum Bite, Kıyıntı ve Ventus Prime gibi kendine özgü reçeteli burgerlerini Pluvia gibi özel sosları ve çıtır patatesleriyle hazırlayan tek şube gurme burger noktası.',
      order: ['Molendini Gourmand / Aurum Bite', 'Pluvia Soslu Patates'],
      menu: ['Molendini Gourmand', 'Aurum Bite', 'Kıyıntı Burger', 'Ventus Prime', 'Çıtır Patates'],
      sec: [
        [
          'Pluvia Soslu Çıtır Patates',
          'İmza gurme burgerlerin yanına özel reçeteli Pluvia sosuyla sunulan çıtır patatesler tercih ediliyor.',
          'arcaburger.framer.ai menüsü ve Menu-TR kayıtları',
        ],
      ],
      seat: 'Kompakt, düzenli iç oturum ve Uğur Mumcu üst hattı vitrini',
      crowd: 'GOP ve Büyükesat çevresinde zincir dışı gurme burger arayanlar',
      dis: 'Paket servis akışı yoğundur ve küçük dükkân alanında masa sayısı azdır',
      transit: 'Büyükesat Mahallesi Uğur Mumcu Caddesi No:96/8.',
      sources: [
        [
          'Arca Burger Resmi Sayfası',
          'https://arcaburger.framer.ai/',
          'operator',
          'Molendini Gourmand, Aurum Bite, Kıyıntı ve Ventus Prime menüsü',
        ],
        [
          'Menu-TR & SehrinMenusu',
          'https://menu-tr.com/',
          'editorial',
          'Özel soslu gurme burger ve Pluvia soslu patates değerlendirmesi',
        ],
      ],
      pros: ['Klasik zincir burgerlerden ayrılan yaratıcı reçeteler', 'Tek şubeli özenli pişirim'],
      cons: ['Sınırlı iç oturma kapasitesi'],
      unc: ['Yoğun paket saatlerinde mutfak teslimi uzayabilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 3. KAHVE (4 bağımsız saf kahveci; zincir & çikolatacı hariç)
    // =========================================================================
    compactSeed({
      id: 'gop-buen-coffee',
      placeId: 'ChIJVXDxp-hP0xQRWSqGEoiuS_A',
      cat: 'kahve',
      name: 'BUEN Coffee',
      brand: 'buen',
      area: 'Uğur Mumcu Cd., Gaziosmanpaşa',
      signals: ['pastel-de-nata', 'cortado', 'ic-dis-bahce'],
      desc:
        'Uğur Mumcu Caddesi üst kesiminde temiz ve sakin atmosferiyle Cortado, Americano gibi nitelikli espresso bazlı içeceklerin yanında günlük taze Portekiz tatlısı Pastel de Nata sunan tek şubeli kahve dükkânı.',
      order: ['Cortado / Americano', 'Pastel de Nata'],
      menu: ['Cortado', 'Americano', 'Flat White', 'Filtre Kahve', 'Pastel de Nata'],
      sec: [
        [
          'Günlük Taze Pastel de Nata',
          'Dışı çıtır katmanlı, içi yumuşak kremalı Portekiz turtası Pastel de Nata kahvelerin yanındaki birincil imza eşlikçisidir.',
          'buencoffee.com menüsü ve yerel tatlı değerlendirmeleri',
        ],
      ],
      seat: 'Sakin iç oturma alanı ve Uğur Mumcu önü küçük açık masalar',
      crowd: 'Sakin ortamda kahve ve taze Pastel de Nata molası veren Büyükesat müdavimleri',
      dis: 'Büyük yemek menüsü arayanlar için sade kahve-tatlı düzenindedir',
      transit: 'Büyükesat Mahallesi Uğur Mumcu Caddesi No:95/A.',
      sources: [
        [
          'BUEN Coffee Resmi Sitesi',
          'http://www.buencoffee.com/',
          'operator',
          'Uğur Mumcu Cd. 95/A adresi ve nitelikli espresso menüsü',
        ],
        [
          'Restoranim & Menu-TR BUEN',
          'https://www.restoranim.net/',
          'editorial',
          'Pastel de Nata tazeliği, Cortado ve sakin ortam değerlendirmesi',
        ],
      ],
      pros: ['Ankara’da iyi kıvamlı Pastel de Nata + kahve ikilisi sunan nadir nokta', 'Sakin atmosfer'],
      cons: ['Doyurucu öğün menüsü yok'],
      unc: ['Pastel de Nata tepsileri günlük stokla sınırlıdır'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-globica-coffee',
      placeId: 'ChIJ68GwoZRP0xQR9yAAQAZUzQA',
      cat: 'kahve',
      name: 'Globica Coffee Shop',
      brand: 'globica',
      area: 'Uğur Mumcu Cd., Gaziosmanpaşa',
      signals: ['ucuncu-nesil-demleme', 'matcha-ube', 'sandvic-cheesecake'],
      desc:
        'Büyükesat Uğur Mumcu Caddesi’nde V60, Chemex ve Cold Brew gibi demlemelerle birlikte ube/matcha spesiyalleri, dört peynirli sandviçler ve ev yapımı cheesecake çeşitleri sunan köklü GOP kahve evi.',
      order: ['V60 / Chemex Demleme', 'Flat White', 'Orman Meyveli Cheesecake'],
      menu: ['V60', 'Chemex', 'Cold Brew', 'Dört Peynirli Sandviç', 'Cheesecake Çeşitleri'],
      sec: [
        [
          'Sandviçler & Cheesecake Çeşitleri',
          'Laktozsuz süt opsiyonlu kahvelerinin yanında doyurucu kruvasan-sandviç çeşitleri ve zengin cheesecake seçkisi bulunur.',
          'globicacoffee.com.tr menüsü ve yerel dizinler',
        ],
      ],
      seat: 'Rahat, çalışmaya ve sohbete elverişli geniş masa düzeni ile açık teras bölümü',
      crowd: 'Laptopuyla çalışanlar, müdavimler ve akşam kahve molası verenler',
      dis: 'Uğur Mumcu üzerindeki yüksek popülerliği nedeniyle öğleden sonra masalar çabuk dolar',
      transit: 'Büyükesat Mahallesi Uğur Mumcu Caddesi No:45/B.',
      sources: [
        [
          'Globica Coffee Resmi Sitesi',
          'https://www.globicacoffee.com.tr/',
          'operator',
          '3. nesil V60/Chemex/Cold Brew demlemeler ve sandviç-cheesecake menüsü',
        ],
        [
          'Menu-TR & Hammhum',
          'https://www.hammhum.com/',
          'editorial',
          'Uğur Mumcu Cd. konumu, laktozsuz seçenekler ve çalışma alanı uyumu',
        ],
      ],
      pros: ['Hem filtre demleme derinliği hem de güçlü sandviç-cheesecake eşliği', 'Yüksek puan ve hacimli memnuniyet'],
      cons: ['Öğleden sonra kalabalıklaşma'],
      unc: ['Hafta sonları dış oturumda bekleme olabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-atlas-coffee',
      placeId: 'ChIJu5ti2hVP0xQRvcbakObhprQ',
      cat: 'kahve',
      name: 'Atlas Coffee & Roastery',
      brand: 'atlas coffee',
      area: 'Kahraman Kadın Sk., Gaziosmanpaşa',
      signals: ['pati-dostu', 'sakin-ara-sokak', 'roastery'],
      desc:
        'Büyükesat Kahraman Kadın Sokağı’nda cadde yoğunluğunun bir adım arkasında konumlanan; üçüncü dalga demleme kahveleri, taze kruvasan-tatlı eşlikçileri ve pati dostu sıcak ortamıyla bilinen butik kahve dükkânı.',
      order: ['Filtre Kahve / Espresso', 'Taze Kruvasan & Ev Yapımı Tatlı'],
      menu: ['V60 Filtre', 'Cortado', 'Flat White', 'Kruvasan Çeşitleri', 'Günlük Ev Yapımı Tatlı'],
      sec: [
        [
          'Pati Dostu Sıcak Mahalle Kahvesi & Ev Yapımı Tatlı',
          'Ev yapımı tatlı çeşitleri ve evcil hayvan dostu yaklaşımıyla Büyükesat ara sokaklarında huzurlu bir mola noktası sunar.',
          'Ankara kahve seçkileri ve Qrdos yerel kayıtları',
        ],
      ],
      seat: 'Küçük, sıcak sokak içi salon ve kapı önü sakin masalar',
      crowd: 'Kalabalık caddeden uzaklaşıp kitap veya kahve eşliğinde nefes almak isteyen mahalle sakinleri',
      dis: 'Ara sokaktaki küçük iç mekan nedeniyle kalabalık gruplara uygun değildir',
      transit: 'Büyükesat Mahallesi Kahraman Kadın Sokağı No:17/A.',
      sources: [
        [
          'AnkaraKahve Rehberi',
          'https://www.ankarakahve.com/',
          'editorial',
          '3. nesil kahve sunumu ve pati dostu Büyükesat sokak kafesi incelemesi',
        ],
        [
          'Menu-TR Atlas Cafe',
          'https://menu-tr.com/',
          'editorial',
          'Kahraman Kadın Sk. kahve, kruvasan ve ev yapımı tatlı değerlendirmesi',
        ],
        [
          'Qrdos Yerel Dizin',
          'https://qrdos.tr/',
          'community',
          'Büyükesat mahalle müdavim puanları ve adres teyidi',
        ],
      ],
      pros: ['Ana cadde gürültüsünden uzak sakin ara sokak', 'Evcil hayvan dostu samimi yaklaşım'],
      cons: ['Sınırlı iç mekan kapasitesi'],
      unc: ['Günlük kruvasan ve tatlı stokları saatlere göre azalır'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-house-blend-coffee',
      placeId: 'ChIJpZ9OA15P0xQR3bqSlOXfLx8',
      cat: 'kahve',
      name: 'House Blend Coffee Shop',
      brand: 'house blend',
      area: 'Uğur Mumcu Cd., Gaziosmanpaşa',
      signals: ['alt-kat-calisma-alani', 'bahce-keyfi', 'etkinlik-kahvecisi'],
      desc:
        'Gaziosmanpaşa Uğur Mumcu Caddesi’nin girişinde bahçe oturumu, üst kattaki sosyalleşme düzeni ve alt kattaki sessiz çalışma alanıyla dikkat çeken nitelikli kahve evi.',
      order: ['Filtre Kahve / Latte', 'Günlük Ev Yapımı Tatlı'],
      menu: ['Espresso', 'Filtre Kahve', 'Cortado', 'Soğuk Kahveler', 'Cheesecake & Kek Çeşitleri'],
      sec: [
        [
          'Alt Kat Çalışma Alanı & Keyifli Bahçe',
          'İki katlı ve bahçeli yerleşim sayesinde alt katta odaklanarak çalışmak, bahçede ise kahve sohbeti yapmak mümkün.',
          'Menu-TR ve Neyiyelim değerlendirmeleri',
        ],
      ],
      seat: 'Alt kat çalışma/toplantı masaları, ferah üst kat ve açık bahçe',
      crowd: 'Çalışmak için sessiz alan arayanlar ile bahçede kahve içen GOP sakinleri',
      dis: 'Etkinlik akşamlarında ana kat daha hareketli olur; sessizlik isteyenler çalışma katını seçmelidir',
      transit: 'Gaziosmanpaşa (Kazım Özalp) Uğur Mumcu Caddesi No:17/A.',
      sources: [
        [
          'Menu-TR House Blend Coffee',
          'https://menu-tr.com/',
          'editorial',
          'Uğur Mumcu 17/A bahçe, kahve-tatlı menüsü ve çalışma katı değerlendirmesi',
        ],
        [
          'Neyiyelim Ankara',
          'https://neyiyelim.com/',
          'editorial',
          'Gaziosmanpaşa nitelikli kahve durakları profili',
        ],
        [
          'Bubilet Etkinlik Kayıtları',
          'https://www.bubilet.com.tr/',
          'community',
          'Stand-up ve kültür akşamlarına ev sahipliği yapan mekân doğrulaması',
        ],
      ],
      pros: ['Çalışma katı ile bahçe sosyalleşmesini net biçimde ayıran plan', 'Merkezi Uğur Mumcu konumu'],
      cons: ['Etkinlik günlerinde erken saat dışında bahçe-salon kalabalık olabilir'],
      unc: ['Akşam etkinlik programları hafta içi günlere göre değişir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 4. DATE MEKANLARI (4 Ankara seviyesi seçkin balık, şarap & bistro adresi)
    // =========================================================================
    compactSeed({
      id: 'gop-trilye-restoran',
      placeId: 'ChIJgWWgw5VP0xQRPb6m-k-HePk',
      cat: 'date',
      name: 'Trilye Restoran',
      brand: 'trilye',
      area: 'Kuleli Sk., Gaziosmanpaşa',
      signals: ['sureyya-uzmez', 'deniz-urunleri-mirasi', 'ozel-gun-sofrasi'],
      desc:
        'Kazım Özalp Kuleli Sokak’ta Süreyya Üzmez yönetiminde mevsiminde gelen taze deniz balıkları, özel deniz mahsulü mezeleri ve özenli masa servisiyle Ankara’nın en köklü balık-Akdeniz restoranlarından biri.',
      order: ['Mevsimlik Taze Deniz Balığı', 'Özel Deniz Mahsulleri Mezeleri', 'Sütlü Kadayıf / Tatlı'],
      menu: ['Günlük Taze Balıklar', 'Deniz Mahsullü Ara Sıcaklar', 'Zeytinyağlı Mezeler', 'Şarap Kavı'],
      sec: [
        [
          'Zengin Şarap Kavı & Ara Sıcak Mezeler',
          'Günlük av deniz balıklarına eşlik eden geniş kav seçkisi ve özenli ara sıcaklar özel kutlamaların temel parçasıdır.',
          'trilyerestaurant.com menü ve mutfak kayıtları',
        ],
      ],
      seat: 'Beyaz örtülü, şık, sakin üst segment salon ve özel davet masaları',
      crowd: 'Özel akşam kutlamaları, iş yemekleri ve üst düzey deniz ürünü sofraları',
      dis: 'Üst segment fiyat seviyesindedir ve özellikle akşamları rezervasyonsuz masa bulmak zordur',
      transit: 'Kazım Özalp Mahallesi Kuleli Sokak No:32.',
      sources: [
        [
          'Trilye Resmi Sitesi',
          'http://www.trilye.com.tr/',
          'operator',
          'Süreyya Üzmez mutfağı, deniz bilinci ve Kuleli Sokak konumu',
        ],
        [
          'Gastronomi Rehberleri & Seçkiler',
          'https://www.kisikatesakademi.com.tr/',
          'award',
          'Türkiye genelinde ödüllü ve referans deniz mahsulleri restoranı doğrulaması',
        ],
        [
          'GurmanAtlas & Vedat Milor Arşivi',
          'https://www.gurmanatlas.com/',
          'editorial',
          'Ankara balık mutfağı liderliği ve istikrarlı ürün kalitesi değerlendirmesi',
        ],
      ],
      pros: ['Ankara’nın en saygın taze deniz ürünleri kurumlarından', 'Üst düzey masa servisi ve kav'],
      cons: ['Yüksek bütçe seviyesi ve zorunlu rezervasyon gereksinimi'],
      unc: ['Günlük balık ve kabuklu deniz ürünleri av dönemine göre değişir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-charm-bistro',
      placeId: 'ChIJJ3__QWBP0xQRPsFd2ldyYSk',
      cat: 'date',
      name: 'Charm',
      brand: 'charm',
      area: 'Arjantin Cd., Gaziosmanpaşa',
      signals: ['anne-kiz-mimar', 'imza-kokteyl', 'arka-bahce'],
      desc:
        'Arjantin Caddesi üzerinde anne-kız iki mimarın sanat ve tasarım estetiğiyle kurguladığı; arka bahçesi, imza kokteylleri ve modern bistro tabaklarıyla randevu akşamları için öne çıkan Gaziosmanpaşa bistro-barı.',
      order: ['Passion / Luna İmza Kokteyller', 'Bistro Paylaşımlı Tabaklar'],
      menu: ['İmza Kokteyller', 'Bistro Ana Yemekler', 'Paylaşımlı Başlangıçlar', 'Tatlılar'],
      sec: [
        [
          'Sanat Galerisi İç Mekan & Arka Bahçe',
          'Şık iç mekan enstalasyonları ve sakin arka bahçe alanı özellikle iki kişilik akşam buluşmalarında tercih ediliyor.',
          'charmbistro.com ve yerel bistro incelemeleri',
        ],
      ],
      seat: 'Estetik iç bar masaları ve ağaçlıklı arka bahçe oturumu',
      crowd: 'Şık ambiyansta kokteyl ve akşam sohbeti planlayan çiftler',
      dis: 'Etkinlik ve hafta sonu akşamlarında bahçe masaları hızlıca dolar; fiyatlar Arjantin çizgisindedir',
      transit: 'Gaziosmanpaşa Arjantin Caddesi No:6/A.',
      sources: [
        [
          'Charm Resmi Sitesi',
          'https://www.charmbistro.com/',
          'operator',
          'Mimar kurucular, kokteyl menüsü ve bahçe konsepti bilgileri',
        ],
        [
          'Restoranim Charm',
          'https://www.restoranim.net/',
          'editorial',
          'Passion/Luna kokteylleri, servis kalitesi ve Arjantin ambiyansı incelemesi',
        ],
      ],
      pros: ['Zarif mimari atmosfer ve imza kokteyller', 'Arjantin Caddesi başında şık randevu adresi'],
      cons: ['Hafta sonu bahçe masası için önceden ayırtma gerekir'],
      unc: ['Haftalık trivia veya sosyal etkinlik akşamlarında atmosfer daha canlı olabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-sargus-seafood',
      placeId: 'ChIJp03bzN1P0xQRFmT_jmMn608',
      cat: 'date',
      name: 'Sargus Seafood & More',
      brand: 'sargus',
      area: 'Nenehatun Cd., Gaziosmanpaşa',
      signals: ['karides-ravioli', 'levrekli-sevketi-bostan', 'fransiz-muzikleri'],
      desc:
        'Nenehatun Caddesi üzerinde sakin Fransız ezgileri eşliğinde karides ravioli, levrekli şevketi bostan ve avokadolu karides gibi yaratıcı Akdeniz deniz ürünleri çıkaran zarif tek şube restoran.',
      order: ['Karides Ravioli', 'Levrekli Şevketi Bostan', 'Avokadolu Karides'],
      menu: ['Karides Ravioli', 'Levrekli Şevketi Bostan', 'Mevsim Balıkları', 'Özel Deniz Mezeleri'],
      sec: [
        [
          'Yaratıcı Deniz Ürünü Ara Sıcakları',
          'Klasik ızgara balıkların ötesinde karides ravioli ve Ege otlu deniz ürünü eşleşmeleri akşam menüsünü farklılaştırır.',
          'sargus.com.tr menüsü ve yerel restoran değerlendirmeleri',
        ],
      ],
      seat: 'Huzurlu, şık, masa aralıkları ferah akşam restoranı düzeni',
      crowd: 'Sakin müzik ve yaratıcı Akdeniz mutfağı arayan çiftler',
      dis: 'Üst-yüksek bütçe sınıfındadır; akşam yemeği için rezervasyon önerilir',
      transit: 'Kazım Özalp Mahallesi Nenehatun Caddesi No:111.',
      sources: [
        [
          'Sargus Resmi Sitesi',
          'http://www.sargus.com.tr/',
          'operator',
          'Deniz mahsulleri menüsü ve Nenehatun Cd. konumu',
        ],
        [
          'Menu-TR Sargus Seafood',
          'https://menu-tr.com/',
          'editorial',
          'Karides ravioli, tazelik, sakin ortam ve profesyonel servis incelemesi',
        ],
      ],
      pros: ['Yaratıcı deniz mahsulü tabakları ve sakin akustik', 'Çok yüksek tazelik ve servis kalitesi'],
      cons: ['Yüksek hesap ortalaması'],
      unc: ['Mevsim balığı alternatifleri günlük olarak yenilenir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-gabbiano-balik',
      placeId: 'ChIJe11SBZdP0xQRQjR5WdGOUDA',
      cat: 'date',
      name: 'Gabbiano Balık',
      brand: 'gabbiano',
      area: 'Kırlangıç Sk., Gaziosmanpaşa',
      signals: ['kirlangic-sokak', 'akdeniz-mezeleri', 'sakin-sik-salon'],
      desc:
        'Gaziosmanpaşa’nın yeşil sokaklarından Kırlangıç Sokak’ta günlük taze deniz ürünleri, Akdeniz mutfağı esintili soğuk mezeler ve özenli sunumuyla sakin bir akşam yemeği sunan tek şubeli balık restoranı.',
      order: ['Günlük Taze Izgara Balık', 'Akdeniz Meze Seçkisi'],
      menu: ['Mevsim Balıkları', 'Akdeniz Mezeleri', 'Deniz Mahsullü Ara Sıcaklar', 'Tatlı'],
      sec: [
        [
          'Kırlangıç Sokak Bahçe & Özel Masa Düzeni',
          'Cadde kalabalığından içeride kalan Kırlangıç Sokak konumu romantik ve gürültüsüz yemekler için uygundur.',
          'gabbiano.com.tr ve Ankara balık restoranı dizinleri',
        ],
      ],
      seat: 'Sakin, zarif iç salon ve yeşillikler arasındaki Kırlangıç Sokak cephesi',
      crowd: 'Baş başa sakin balık ve şarap-rakı sofrası isteyen çiftler',
      dis: 'Üst segment fiyat aralığındadır; dar Kırlangıç Sokak akşamları park yönünden yoğun olabilir',
      transit: 'Gaziosmanpaşa Kırlangıç Sokak No:3.',
      sources: [
        [
          'Gabbiano Balık Resmi Sitesi',
          'http://gabbiano.com.tr/',
          'operator',
          'Kırlangıç Sokak konumu ve Akdeniz esintili deniz ürünleri mutfağı',
        ],
        [
          'Gotoeat & Yandex Haritalar',
          'https://gotoeat.net/',
          'editorial',
          'Taze deniz ürünleri ve sakin şık ortam doğrulaması',
        ],
      ],
      pros: ['Cadde gürültüsünden uzak sakin Kırlangıç Sokak atmosferi', 'İstikrarlı ürün ve sunum kalitesi'],
      cons: ['Üst segment fiyat seviyesi'],
      unc: ['Hafta sonları masa ayırtmak gerekir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 5. KAHVALTI (1 tek şubeli artizan kruvasan & bahçe kafe — sıfır dolgu)
    // =========================================================================
    compactSeed({
      id: 'gop-soli-croissant',
      placeId: 'ChIJg5hfUAtP0xQRij22CqZIEV0',
      cat: 'kahvalti',
      name: 'Soli Croissant',
      brand: 'soli',
      area: 'Uğur Mumcu Cd., Gaziosmanpaşa',
      signals: ['tatli-tuzlu-kruvasan', 'ferah-bahce', 'kahvalti-tabagi'],
      desc:
        'Büyükesat Uğur Mumcu Caddesi üzerinde geniş ve sakin bahçesi, günlük pişen tatlı ve tuzlu kruvasanları, kahvaltı tabakları ve nitelikli kahve servisiyle sabah buluşmalarının öne çıkan tek şubeli durağı.',
      order: ['Tuzlu Peynirli / Klasik Kruvasan', 'Kahvaltı Tabağı', 'Nutellalı-Dondurmalı Kruvasan'],
      menu: ['Sade Kruvasan', 'Tuzlu Kruvasanlar', 'Kahvaltı Tabağı', 'Tost Çeşitleri', 'Kahve Barı'],
      sec: [
        [
          'Ferah Bahçe Oturumu & Tatlı Kruvasanlar',
          'Bahçe masalarında tatlı-tuzlu kruvasanların yanında sabah kahvaltı tabağı ve özel kahveler bir arada sunulur.',
          'Menu-TR ve yerel kahvaltı rehberleri',
        ],
      ],
      seat: 'Ferah, yeşillikli bahçe alanı ve aydınlık iç masalar',
      crowd: 'Hafta sonu sakin bahçede kruvasan ve kahvaltı keyfi yapanlar',
      dis: 'Hafta sonu geç sabah saatlerinde bahçe masaları hızlı dolabilir',
      transit: 'Büyükesat Mahallesi Uğur Mumcu Caddesi No:84.',
      sources: [
        [
          'Menu-TR Soli Croissant',
          'https://menu-tr.com/',
          'editorial',
          'Uğur Mumcu Cd. No:84 ferah bahçe, kruvasan çeşitleri ve huzurlu ortam',
        ],
        [
          'Yemeksepeti & Restoranim Soli',
          'https://www.restoranim.net/',
          'community',
          'Tatlı-tuzlu kruvasanlar ve kahvaltı tabağı değerlendirmeleri',
        ],
      ],
      pros: ['Uğur Mumcu üzerinde geniş ve sakin bahçe', 'Hem tatlı hem tuzlu artizan kruvasan çeşitleri'],
      cons: ['Hafta sonu bahçe masası için bekleme ihtimali'],
      unc: ['Özel dolgulu kruvasan çeşitleri gün içi erken tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // 6. MUTLAKA DENEMELİSİN (8 tek şubeli meyhane, ocakbaşı, canlı müzik & klasik)
    // =========================================================================
    compactSeed({
      id: 'gop-adiguzel-meyhane',
      placeId: 'ChIJda8-OABP0xQRMqNPN96RKs0',
      cat: 'denemelisin',
      name: 'Adıgüzel Meyhane',
      brand: 'adıgüzel',
      area: 'Filistin Cd., Gaziosmanpaşa',
      signals: ['modern-meyhane', 'zengin-soguk-meze', 'kale-manzarasi'],
      desc:
        'Filistin Caddesi’nde geleneksel Ankara meyhane kültürünü özenli sunum, zengin soğuk mezeler, sıcak ara tabaklar ve manzaralı ferah salonuyla yaşatan tek şubeli modern meyhane.',
      order: ['Soğuk Meze Seçkisi', 'Ara Sıcaklar', 'Izgara Ana Yemek'],
      menu: ['Soğuk Mezeler', 'Paçanga & Deniz Mahsulü Ara Sıcak', 'Et & Balık Ana Yemekler'],
      sec: [
        [
          'Sıcak Ara Yemekler & Manzaralı Salon',
          'Klasik rakı-meze eşleşmelerinin yanı sıra özenle hazırlanan ara sıcak çeşitleri uzun akşamlar için öne çıkar.',
          'adiguzelmeyhane.com ve Menu-TR kayıtları',
        ],
      ],
      seat: 'Zarif, modern Türk meyhanesi masaları ve ferah Ankara manzaralı pencere hattı',
      crowd: 'Kaliteli meze ve nezih akşam sohbeti arayan dost sofraları',
      dis: 'Üst segment meyhane fiyat seviyesindedir; Cuma-Cumartesi akşamları erken rezervasyon şarttır',
      transit: 'Kazım Özalp Mahallesi Filistin Caddesi No:38.',
      sources: [
        [
          'Adıgüzel Meyhane Resmi Sitesi',
          'https://adiguzelmeyhane.com/',
          'operator',
          'Filistin Cd. 38 konumu, soğuk meze ve meyhane adabı detayları',
        ],
        [
          'Menu-TR Adıgüzel Meyhane',
          'https://menu-tr.com/',
          'editorial',
          'Modern meze kalitesi ve zarif atmosfer değerlendirmeleri',
        ],
      ],
      pros: ['Şık ve temiz sunumlu yüksek puanlı modern meyhane', 'Tek şubede tutarlı mutfak'],
      cons: ['Yüksek bütçe seviyesi ve önceden masa ayırtma gereksinimi'],
      unc: ['Cam kenarı masalar günler öncesinden dolabilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-senli-benli-meyhane',
      placeId: 'ChIJn7KDas1P0xQRpQqDxc2jKnw',
      cat: 'denemelisin',
      name: 'Senli Benli Meyhane',
      brand: 'senli benli',
      area: 'Arjantin Cd., Gaziosmanpaşa',
      signals: ['arjantin-meyhanesi', 'genis-masalar', 'modern-meze'],
      desc:
        'Arjantin Caddesi üzerinde modern mutfak anlayışıyla yenilenmiş mezeleri geniş masalarda ve ferah bir salonda servis eden yüksek puanlı tek şubeli GOP meyhanesi.',
      order: ['Modern Meze Seçkisi', 'Ara Sıcak Tabağı', 'Izgara Lokum / Köfte'],
      menu: ['Soğuk Mezeler', 'Ara Sıcaklar', 'Izgara Et Çeşitleri'],
      sec: [
        [
          'Ferah Salon & Geniş Grup Masaları',
          'Arjantin Caddesi’ndeki birçok sıkışık mekana kıyasla masa aralıkları daha geniştir ve arkadaş kutlamalarına uygundur.',
          'senlibenlimeyhane.com ve bölge değerlendirmeleri',
        ],
      ],
      seat: 'Ferah salon, rahat koltuklu ve geniş masalı meyhane yerleşimi',
      crowd: 'Arjantin Caddesi’nde modern meyhane ve dost sohbeti arayanlar',
      dis: 'Hafta sonları yoğun grup ağırlamaları nedeniyle ortam hareketli olabilir',
      transit: 'Gaziosmanpaşa Arjantin Caddesi No:21/A.',
      sources: [
        [
          'Senli Benli Resmi Sitesi',
          'https://www.senlibenlimeyhane.com/',
          'operator',
          'Arjantin Cd. No:21/A adresi, geniş masalar ve modern meyhane mutfağı',
        ],
        [
          'Yerel Ankara Rehberleri',
          'https://yandex.com.tr/',
          'community',
          'Yüksek puan istikrarı ve servis kalitesi doğrulaması',
        ],
      ],
      pros: ['Arjantin Caddesi kalbinde modern ve ferah meyhane deneyimi', 'Masa aralıkları konforlu'],
      cons: ['Hafta sonu rezervasyonsuz yer bulmak zor'],
      unc: ['Özel meze tabakları akşam servisine göre güncellenir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-muptela-meyhane',
      placeId: 'ChIJ3SZNxeJP0xQRmu-9mXFSOXA',
      cat: 'denemelisin',
      name: 'Müptela Meyhane',
      brand: 'müptela',
      area: 'Reşit Galip Cd., Gaziosmanpaşa',
      signals: ['resit-galip', 'taze-meze', 'samimi-meyhane'],
      desc:
        'Reşit Galip Caddesi üzerinde taze günlük mezeleri, sıcak ara tabakları ve canlı meyhane havasıyla Kazım Özalp akşamlarının sevilen buluşma noktalarından tek şubeli meyhane.',
      order: ['Günlük Meze Seçkisi', 'Sıcak Ara Tabaklar'],
      menu: ['Soğuk Mezeler', 'Ara Sıcaklar', 'Izgara Ana Yemekler'],
      sec: [
        [
          'Samimi Akşam Atmosferi & Müzikli Sohbet',
          'Arkadaş gruplarının uzun akşam buluşmaları için canlı ve samimi masa düzeni sunar.',
          'Mekanlar.com ve Restoranim kayıtları',
        ],
      ],
      seat: 'Canlı ve sıcak meyhane masa düzeni',
      crowd: 'Reşit Galip hattında eğlenceli akşam sofrası arayan gruplar',
      dis: 'Akşam müzik ve sohbet temposu yüksektir; sakin yemek arayanlar için hareketli kalır',
      transit: 'Kazım Özalp Mahallesi Reşit Galip Caddesi No:53.',
      sources: [
        [
          'Müptela Meyhane Resmi Profili',
          'https://www.instagram.com/muptelameyhane/',
          'operator',
          'Reşit Galip Cd. 53 konumu ve güncel akşam programı',
        ],
        [
          'Mekanlar.com & Restoranim',
          'https://www.mekanlar.com/',
          'editorial',
          'Taze mezeler ve samimi atmosfer değerlendirmeleri',
        ],
      ],
      pros: ['Taze günlük meze çeşitliliği ve canlı atmosfer', 'Tek şubede samimi ilgi'],
      cons: ['Akşam saatlerinde yüksek ortam sesi'],
      unc: ['Hafta sonu fiks veya menü düzeni rezervasyonla teyit edilmelidir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-kuleli-ocakbasi',
      placeId: 'ChIJK1CliJFP0xQRW5e2wTCilus',
      cat: 'denemelisin',
      name: 'Kuleli Ocakbaşı',
      brand: 'kuleli ocakbaşı',
      area: 'Kızkulesi Sk., Gaziosmanpaşa',
      signals: ['kizkulesi-sokak', 'mangal-kebap', 'et-kalitesi'],
      desc:
        'Kazım Özalp Kızkulesi Sokak’ta geleneksel ocakbaşı mangalını GOP meyhane kültürüyle buluşturan; özenli et kesimleri, zırh kebapları ve taze mezeleriyle beğenilen tek şubeli ocakbaşı.',
      order: ['Kuleli Adana / Urfa Zırh Kebap', 'Kuzu Şiş & Yaprak Ciğer', 'Ocakbaşı Mezeleri'],
      menu: ['Zırh Kebapları', 'Kuzu Şiş', 'Çöp Şiş', 'Soğuk Mezeler', 'Künefe / Tatlı'],
      sec: [
        [
          'Klasik Ocakbaşı Mezeleri & Ara Sıcaklar',
          'Közde etlerin yanında taze ezme, humus, haydari ve közlenmiş sebze mezeleri övgü alır.',
          'Yerel ocakbaşı rehberleri ve harita kayıtları',
        ],
      ],
      seat: 'Sıcak ocakbaşı ve şık iç masa düzeni',
      crowd: 'Balık dışındaki akşamlarda gerçek mangal ve meze arayan GOP sakinleri',
      dis: 'Ocakbaşı çevresi akşam saatlerinde yoğun ve duman kokusu barındırabilir',
      transit: 'Kazım Özalp Mahallesi Kızkulesi Sokak No:18/2.',
      sources: [
        [
          'Yandex Haritalar Kuleli Ocakbaşı',
          'https://yandex.com.tr/',
          'community',
          'Et kalitesi, zırh kebabı ve meyhane-ocakbaşı uyumu değerlendirmeleri',
        ],
        [
          'Ankara Restoran Dizinleri',
          'https://www.restoranim.net/',
          'editorial',
          'Kızkulesi Sokak tek şube ocakbaşı mutfak doğrulaması',
        ],
      ],
      pros: ['GOP içinde nitelikli tek şube ocakbaşı alternatifi', 'Et seçimi ve meze tazeliği'],
      cons: ['Yoğun akşam servisinde masalar hızlı dolar'],
      unc: ['Özel kuzu kesimleri akşam geçe kalınca tükenebilir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-ruhe-restaurant',
      placeId: 'ChIJJ7g05RFP0xQRWlNh8xFEcSw',
      cat: 'denemelisin',
      name: 'Ruhe Restaurant',
      brand: 'ruhe',
      area: 'Nenehatun Cd., Gaziosmanpaşa',
      signals: ['turk-yunan-mutfagi', 'canli-muzik', 'nenehatun'],
      desc:
        'Nenehatun Caddesi No:123/A’da Türk ve Yunan mutfağından esinlenen mezeler, deniz ve et tabaklarıyla birlikte seçili akşamlarda canlı müzik performansı sunan samimi tek şubeli akşam restoranı.',
      order: ['Türk-Yunan Meze Tabakları', 'Deniz & Et Ana Yemekleri'],
      menu: ['Soğuk Ege-Yunan Mezeleri', 'Sıcak Ara Tabaklar', 'Ana Yemekler'],
      sec: [
        [
          'Canlı Müzik Akşamları & Ege Mezeleri',
          'Özenli meyhane-bistro sunumları seçili günlerde akustik/canlı müzik eşliğiyle tamamlanır.',
          'ruherestaurant.com.tr ve Restoranim değerlendirmeleri',
        ],
      ],
      seat: 'Şık, sıcak aydınlatmalı iç salon düzeni',
      crowd: 'Ege-Yunan mezeleri eşliğinde keyifli canlı müzik akşamı planlayanlar',
      dis: 'Üst segment fiyat düzeyindedir; canlı müzik akşamlarında önceden yer ayırtmak gerekir',
      transit: 'Kazım Özalp Mahallesi Nenehatun Caddesi No:123/A.',
      sources: [
        [
          'Ruhe Restaurant Resmi Sitesi',
          'http://www.ruherestaurant.com.tr/',
          'operator',
          'Türk-Yunan mutfağı konsepti ve Nenehatun Cd. konumu',
        ],
        [
          'Restoranim Ruhe',
          'https://www.restoranim.net/',
          'editorial',
          'Samimi atmosfer ve canlı müzik performansı değerlendirmeleri',
        ],
      ],
      pros: ['Türk ve Yunan meyhane mutfağını birleştiren dengeli menü', 'Kaliteli canlı müzik ambiyansı'],
      cons: ['Yüksek bütçe sınıfı'],
      unc: ['Canlı müzik program günleri dönemsel güncellenir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-kumsal-lokantasi',
      placeId: 'ChIJNSiFGlVO0xQRcRro7GE99aU',
      cat: 'denemelisin',
      name: 'Kumsal Lokantası',
      brand: 'kumsal',
      area: 'Nenehatun Cd., Gaziosmanpaşa',
      signals: ['1970s-ankara-mirasi', 'gosteristen-uzak-balik', 'klasik-meyhane'],
      desc:
        '1970’li yıllardan bu yana GOP Nenehatun Caddesi’nde gösterişten uzak, sade salonunda taze mevsim balıkları (ızgara sardalya, mezgit vb.) ve klasik mezeleri GOP ortalamasına kıyasla daha ulaşılabilir bir sofrada sunan köklü Ankara lokantası.',
      order: ['Sezonluk Izgara Sardalya / Mezgit', 'Klasik Ankara Balıkçı Mezeleri'],
      menu: ['Mezgit', 'Sardalya / Hamsi', 'Levrek & Çipura', 'Klasik Soğuk Mezeler'],
      sec: [
        [
          'Sade Klasik Lokanta Kültürü & Nikah/Aile Sofraları',
          'Lüks sunumlar yerine taze günlük balık ve klasik sohbet sofrası arayan eski Ankaralıların yarım asırlık durağıdır.',
          'kumsallokantasi.com ve Haydibul rehber kayıtları',
        ],
      ],
      seat: 'Gösterişsiz, klasik beyaz örtülü eski Ankara lokantası salonu',
      crowd: 'Sade, samimi ortamda taze balık ve klasik meze tercih eden eski Ankara müdavimleri',
      dis: 'Modern bistro dekorasyonu bekleyenler için fazla geleneksel ve sade kalır',
      transit: 'Kazım Özalp Mahallesi Nenehatun Caddesi No:97.',
      sources: [
        [
          'Kumsal Lokantası Resmi Sitesi',
          'http://kumsallokantasi.com/',
          'operator',
          'Köklü GOP Nenehatun balık lokantası menüsü ve bilgileri',
        ],
        [
          'Haydibul & DüğünBuketi',
          'https://www.haydibul.com/',
          'editorial',
          '1970’lerden beri süren miras, sade atmosfer, taze sardalya-mezgit ve dengeli fiyat övgüsü',
        ],
      ],
      pros: ['Yarım asra yaklaşan köklü Ankara geleneği', 'GOP lüks balıkçılarına göre samimi ve ulaşılabilir klasik çizgi'],
      cons: ['Sade ve eski usul dekorasyon'],
      unc: ['Hafta sonu kalabalık aile grupları nedeniyle önceden aramak faydalıdır'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-amarillo',
      placeId: 'ChIJFZjFi5FP0xQRMGHzFea-HXQ',
      cat: 'denemelisin',
      name: 'Amarillo',
      brand: 'amarillo',
      area: 'Reşit Galip Cd., Gaziosmanpaşa',
      signals: ['tex-mex', 'fajitaburrito', 'canli-muzik-pub'],
      desc:
        'Reşit Galip Caddesi üzerinde Ankara’da uzun süredir Tex-Mex (Teksas-Meksika) mutfağı, sıcak fajita/burrito tabakları, burgerleri ve hafta sonu canlı müzik pub atmosferiyle hizmet veren tek şubeli buluşma mekânı.',
      order: ['Sizzling Fajita', 'Nachos & Quesadilla', 'Klasik Kokteyller'],
      menu: ['Fajita Çeşitleri', 'Quesadilla', 'Nachos', 'Tex-Mex Burger', 'Kokteyller'],
      sec: [
        [
          'Hafta Sonu Canlı Müzik & Pub İçecek Menüsü',
          'Tex-Mex yemeklerinin ardından bar atmosferinde hafta sonu canlı müzik programları devam eder.',
          'Wanderlog ve yerel pub rehberleri',
        ],
      ],
      seat: 'Ahşap Tex-Mex pub barı ve geniş akşam masaları',
      crowd: 'Baharatlı Meksika-Teksas mutfağı ve akşam pub müziği sevenler',
      dis: 'Canlı müzik akşamlarında gürültü seviyesi yüksektir',
      transit: 'Kazım Özalp Mahallesi Reşit Galip Caddesi No:89/2.',
      sources: [
        [
          'Wanderlog Amarillo',
          'https://wanderlog.com/',
          'editorial',
          'Reşit Galip Cd. Tex-Mex menüsü ve pub incelemeleri',
        ],
        [
          'MenuHaritasi & Yandex Haritalar',
          'https://www.menuharitasi.com/',
          'community',
          'Fajita, burger, kokteyller ve hafta sonu canlı müzik teyidi',
        ],
      ],
      pros: ['GOP içinde nadir bulunan uzun soluklu Tex-Mex mutfağı', '1000+ oyda istikrarlı ★4.4 puan'],
      cons: ['Canlı müzik gecelerinde sohbet zorlaşabilir'],
      unc: ['Mutfak kapanış ve canlı müzik başlangıç saatleri güne göre değişir'],
      verifiedAt: '2026-11-17',
    }),

    compactSeed({
      id: 'gop-aramizda-meyhane',
      placeId: 'ChIJ1WIl5b1P0xQRPn6UiqX6y_A',
      cat: 'denemelisin',
      name: 'Aramızda Meyhane',
      brand: 'aramızda',
      area: 'Beyaz Zambaklar Sk., Gaziosmanpaşa',
      signals: ['fasil-ve-dj', 'beyaz-zambaklar', 'eglenceli-meyhane'],
      desc:
        'Beyaz Zambaklar Sokak’ta geleneksel meyhane mezeleri ile ara sıcaklarını canlı fasıl ve geç saat DJ performanslı eğlence anlayışıyla birleştiren tek şubeli Gaziosmanpaşa meyhanesi.',
      order: ['Meze & Ara Sıcak Fiks Seçkisi', 'Ana Yemek Izgara'],
      menu: ['Soğuk Mezeler', 'Ara Sıcaklar', 'Izgara Ana Yemekler'],
      sec: [
        [
          'Canlı Fasıl & Geç Akşam DJ Programı',
          'Yemekle başlayan akşam fasıl ve ardından ritmik eğlence programıyla geceye uzanır.',
          'aramizdameyhane.com ve Restoranim değerlendirmeleri',
        ],
      ],
      seat: 'Eğlence odaklı, sahne görüşlü meyhane masaları',
      crowd: 'Yemek sonrası fasıl ve canlı eğlence isteyen kutlama grupları',
      dis: 'Tamamen eğlence ve yüksek sesli fasıl konseptlidir; sakin baş başa yemek için uygun değildir',
      transit: 'Gaziosmanpaşa Beyaz Zambaklar Sokak No:9/1.',
      sources: [
        [
          'Aramızda Meyhane Resmi Sitesi',
          'https://www.aramizdameyhane.com/',
          'operator',
          'Beyaz Zambaklar Sk. tek şube konumu, meze ve fasıl-DJ akışı',
        ],
        [
          'Restoranim Aramızda Meyhane',
          'https://www.restoranim.net/',
          'editorial',
          'GOP meyhane ve gece eğlencesi değerlendirmeleri',
        ],
      ],
      pros: ['Tek mekânda meze yemeğinden fasıl-DJ eğlencesine kesintisiz geçiş', 'Tek şube GOP odağı'],
      cons: ['Yüksek ses ve üst-orta bütçe'],
      unc: ['Cuma-Cumartesi programları rezervasyonla takip edilmelidir'],
      verifiedAt: '2026-11-17',
    }),

    // =========================================================================
    // NEGATİF DENETİM KONTROLLERİ (Politika Kapısı Audit Testi — 15 Kontrol)
    // =========================================================================
    negControl('ctrl-gop-doublezero-chain', 'ChIJWy_eZJNP0xQRnhb30qVh3tA', 'pizza', '4 şubeli Ankara pizza zinciri (Kapı 2)'),
    negControl('ctrl-gop-divan-chain', 'ChIJgw7PqKRP0xQRfVyF9P92YXo', 'date', 'Çok şubeli Divan Brasserie zinciri (Kapı 2)'),
    negControl('ctrl-gop-mezzaluna-chain', 'ChIJ8WTEz5lP0xQRVfzT5NuGE4M', 'pizza', 'Çok şubeli Mezzaluna zinciri (Kapı 2)'),
    negControl('ctrl-gop-sofaburger-chain', 'ChIJa8IXMc9P0xQR7mXOr6qK_XI', 'hamburger', '3 şubeli Ankara burger zinciri (Kapı 2)'),
    negControl('ctrl-gop-thestock-chain', 'ChIJPdY4sKNP0xQRqFQVHo3QiQM', 'kahve', '3 şubeli Ankara kahve zinciri (Kapı 2)'),
    negControl('ctrl-gop-bigbaker-chain', 'ChIJGbxBkOpP0xQRbreNHolNxQo', 'hamburger', 'Çok şubeli burger/bistro zinciri (Kapı 2)'),
    negControl('ctrl-gop-kahvedunyasi-chain', 'ChIJxeqL2-pP0xQRGZFSf59VEHI', 'kahve', 'Ulusal kahve zinciri (Kapı 2)'),
    negControl('ctrl-gop-arabica-chain', 'ChIJf2FMW01P0xQRJUtdUTaKph4', 'kahve', 'Çok şubeli kahve zinciri (Kapı 2)'),
    negControl('ctrl-gop-basil-chain', 'ChIJszERkfVP0xQRKucprL3w7f0', 'denemelisin', '4 şubeli Ankara bowl/restoran zinciri (Kapı 2)'),
    negControl('ctrl-gop-tarabya-chain', 'ChIJE9t8updP0xQRuNRTJfpvS1U', 'date', 'Çayyolu + GOP çok şubeli balık zinciri (Kapı 2)'),
    negControl('ctrl-gop-guava-noncoffee', 'ChIJNX9Fvj1P0xQRuQMDEezekPU', 'kahve', 'chocolate_shop primaryType kahve kategorisine giremez (Kapı 3B)'),
    negControl('ctrl-gop-out-tunali-eksimaya', 'ChIJ0zDQV6JP0xQRkt0bn4e8VZg', 'kahvalti', 'Barbaros Mahallesi Tunalı bölgesi sınır dışı (Kapı 4)'),
    negControl('ctrl-gop-out-ayranci-oak', 'ChIJvUldCaRP0xQRo-pPSrcuZvg', 'kahve', 'Ayrancı Mahallesi sınır dışı (Kapı 4)'),
    negControl('ctrl-gop-low-vento', 'ChIJa5nqGf5P0xQRUOot_hXdxgM', 'pizza', '3.7 puan standart 4.4 eşiğinin altında (Kapı 6)'),
    negControl('ctrl-gop-low-cafemiz', 'ChIJN6gIm5dP0xQRZPeKnkY02Vk', 'date', '4.1 puan standart 4.4 eşiğinin altında (Kapı 6)'),
  ],
};
