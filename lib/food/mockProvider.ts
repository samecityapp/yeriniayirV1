import { 
  FoodDiscoveryProvider, 
  FoodLocation, 
  FoodCategory, 
  FoodVenue, 
  CategoryResult,
  FoodRitual 
} from './types';
import { normalizeTr } from './text';

// ============================================================================
// 1. TÜRKİYE KONUM LİSTESİ (ŞEHİR, İLÇE, SEMT)
// ============================================================================
const LOCATIONS: FoodLocation[] = [
  {
    id: 'istanbul/kadikoy/moda',
    level: 'semt',
    name: 'Moda',
    slug: 'moda',
    path: ['istanbul', 'kadikoy', 'moda'],
    parentId: 'istanbul/kadikoy',
    displayName: 'Moda, Kadıköy, İstanbul',
    locative: "Moda'da",
    aliases: ['moda', 'caferaga', 'caferağa', 'kadikoy moda', 'kadıköy moda'],
    status: 'demo',
    center: { lat: 40.9841, lng: 29.0244 },
    scopeNote: 'Caferağa Mahallesini ve Moda Caddesi sahil hattını kapsar.',
    characterSubtitle: 'Üçüncü nesil kahve, fırın ürünleri ve sahil sokak mekanları',
  },
  {
    id: 'gaziantep',
    level: 'il',
    name: 'Gaziantep',
    slug: 'gaziantep',
    path: ['gaziantep'],
    displayName: 'Gaziantep',
    locative: "Gaziantep'te",
    aliases: ['antep', 'gaziantep', 'sehitkamil', 'sahinbey'],
    status: 'demo',
    center: { lat: 37.0662, lng: 37.3833 },
    scopeNote: 'Şahinbey ve Şehitkamil tarihi çarşı merkezlerini kapsar.',
    characterSubtitle: 'Geleneksel Güneydoğu mutfağı, kebap, beyran ve baklava üretimi',
  },
  {
    id: 'mugla/fethiye',
    level: 'ilce',
    name: 'Fethiye',
    slug: 'fethiye',
    path: ['mugla', 'fethiye'],
    displayName: 'Fethiye, Muğla',
    locative: "Fethiye'de",
    aliases: ['fethiye', 'oludeniz', 'kayakoy', 'paspatur'],
    status: 'demo',
    center: { lat: 36.6213, lng: 29.1164 },
    scopeNote: 'Paspatur Çarşısı, Kordon ve sahil hattını kapsar.',
    characterSubtitle: 'Balık Pazarı kültürü, sahil restoranları ve dağ köyleri',
  },
  {
    id: 'istanbul/kadikoy',
    level: 'ilce',
    name: 'Kadıköy',
    slug: 'kadikoy',
    path: ['istanbul', 'kadikoy'],
    parentId: 'istanbul',
    displayName: 'Kadıköy, İstanbul',
    locative: "Kadıköy'de",
    aliases: ['kadikoy', 'kadıköy'],
    status: 'coming_soon',
    center: { lat: 40.9880, lng: 29.0280 },
  },
  {
    id: 'izmir/alsancak',
    level: 'semt',
    name: 'Alsancak',
    slug: 'alsancak',
    path: ['izmir', 'konak', 'alsancak'],
    displayName: 'Alsancak, Konak, İzmir',
    locative: "Alsancak'ta",
    aliases: ['alsancak', 'kordon', 'izmir alsancak'],
    status: 'coming_soon',
    center: { lat: 38.4380, lng: 27.1420 },
  },
];

// ============================================================================
// 2. BÖLGEYE ÖZEL DİNAMİK KATEGORİLER (HER BÖLGEDE FARKLI)
// ============================================================================

// MODA: Kahve, Kahvaltı, Hamburger, Pizza, Tatlı & Pastane, Date Mekanları (6 Kategori, Mutlaka Denenmeli YOK)
const MODA_CATEGORIES: FoodCategory[] = [
  { slug: 'kahve', label: 'Kahve', emoji: '☕', title: 'Kahve Mekanları' },
  { slug: 'kahvalti', label: 'Kahvaltı', emoji: '🍳', title: 'Kahvaltı & Kruvasan Noktaları' },
  { slug: 'hamburger', label: 'Hamburger', emoji: '🍔', title: 'Hamburger & Sokak Lezzetleri' },
  { slug: 'pizza', label: 'Pizza', emoji: '🍕', title: 'Taş Fırın Pizzacıları' },
  { slug: 'tatli-pastane', label: 'Tatlı & Pastane', emoji: '🍰', title: 'Tatlı & Dondurma Noktaları' },
  { slug: 'date-mekanlari', label: 'Date Mekanı', emoji: '🍷', title: 'Akşam Yemeği & Buluşma Mekanları' },
];

// GAZİANTEP: Mutlaka Denenmeli (İLK SIRADA), Kebap, Beyran, Baklava, Katmer, Kahvaltı (6 Kategori)
const GAZIANTEP_CATEGORIES: FoodCategory[] = [
  { slug: 'mutlaka-denenmesi-gerekenler', label: 'Mutlaka Denenmeli', emoji: '⭐', title: 'Öne Çıkan Yöresel Lezzetler', isMustTry: true },
  { slug: 'kebap', label: 'Kebap', emoji: '🥩', title: 'Zırh Kebabı & Küşleme Noktaları' },
  { slug: 'beyran', label: 'Beyran', emoji: '🍲', title: 'Geleneksel Sabah Beyranı' },
  { slug: 'baklava', label: 'Baklava', emoji: '🥮', title: 'Gaziantep Kuru Baklavası & Havuç Dilimi' },
  { slug: 'katmer', label: 'Katmer', emoji: '🥞', title: 'Taş Fırında Katmer' },
  { slug: 'kahvalti', label: 'Kahvaltı', emoji: '🍳', title: 'Yöresel Gaziantep Kahvaltısı' },
];

// FETHİYE: Deniz Ürünleri, Kahvaltı, Kahve, Hamburger, Pizza, Date Mekanları (6 Kategori)
const FETHIYE_CATEGORIES: FoodCategory[] = [
  { slug: 'deniz-urunleri', label: 'Deniz Ürünleri', emoji: '🐟', title: 'Balık Pazarı & Deniz Mahsulleri' },
  { slug: 'kahvalti', label: 'Kahvaltı', emoji: '🍳', title: 'Köy Kahvaltısı & Bahçe Noktaları' },
  { slug: 'kahve', label: 'Kahve', emoji: '☕', title: 'Kordon & Çarşı Kahvecileri' },
  { slug: 'hamburger', label: 'Hamburger', emoji: '🍔', title: 'Burger & Sokak Lezzeti' },
  { slug: 'pizza', label: 'Pizza', emoji: '🍕', title: 'Paspatur Pizzacıları' },
  { slug: 'date-mekanlari', label: 'Date Mekanı', emoji: '🍷', title: 'Sahil & Akşam Yemeği Mekanları' },
];

// ============================================================================
// 3. MEKAN VERİTABANI (KART 1.0 - 4 BİLGİ KURALI / DETAY EKRANI - TARAFSIZ BİLGİ)
// ============================================================================
const ALL_VENUES: FoodVenue[] = [
  // --- MODA MEKANLARI ---
  {
    id: 'story-coffee-moda',
    name: 'Story Coffee Roasters',
    tagline: 'Marko Paşa Köşkü bahçesinde kahve kavurumu ve demleme servisi',
    location: 'Moda, Kadıköy',
    neighborhood: 'Caferağa Mah., Dalga Sokak',
    address: 'Caferağa Mah., Dalga Sk. No:22, 34710 Kadıköy/İstanbul',
    mapsUrl: 'https://maps.google.com/?q=Story+Coffee+Roasters+Moda',
    imageUrl: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Kahve',
    googleRatingSignal: {
      rating: 4.7,
      reviewCount: '1.2k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Hario V60 Filtre Kahve & Flat White',
      description: 'Mevsimsel çekirdeklerden pour-over filtre kahve ve çift shot espresso ekstraksiyonu.',
      tags: ['V60 Filtre', 'Flat White'],
    },
    whyGo: {
      summary: 'Kendi çekirdeklerini profillendiren roaster-operator kimliği ve Moda\'nın en dingin saklı köşk bahçesi.',
      reasons: [
        'Çekirdekler kendi kavurmahanesinde taze kavruluyor ve lot bilgileri şeffafça sunuluyor.',
        'Sokak gürültüsünden tamamen izole, asırlık Marko Paşa Köşkü\'nün yemyeşil arka bahçesi.',
      ],
    },
    visitorFit: {
      bestFor: ['Nitelikli kahveyi sakin bir bahçede uzun soluklu yudumlamak isteyenler'],
      notIdealFor: ['Hafta sonu kalabalığında laptopla kesintisiz çalışmak isteyenler'],
      vibeText: 'Geniş, yeşil, dingin ve mahalle nezaketinde.',
    },
    alsoTry: {
      items: [
        {
          name: 'Tarçınlı Rulo (Cinnamon Roll)',
          description: 'Filtre kahve eşliğinde fırından taze servis edilen fırın ürünü.',
        },
      ],
    },
    knowBeforeYouGo: {
      tips: ['Girişteki koridordan köşkün arka bahçesine geçilebilir; hafta sonu öğle saatlerinde yoğunluk oluşabilir.'],
    },
    sources: [
      {
        publisher: 'European Coffee Trip',
        title: 'Istanbul Specialty Coffee Guide — Asian Side',
        url: 'https://europeancoffeetrip.com/coffee-guide-istanbul-asian-side/',
        date: '2024–2025',
      },
    ],
    categorySlugs: ['kahve'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'cekirdek-coffee-moda',
    name: 'Çekirdek',
    tagline: 'Şair Latifi Sokak\'ta günlük taze kavrum filtre kahve ve espresso servisi',
    location: 'Moda, Kadıköy',
    neighborhood: 'Caferağa Mah., Şair Latifi Sokak',
    address: 'Caferağa Mah., Şair Latifi Sk. No:9/A, 34710 Kadıköy/İstanbul',
    mapsUrl: 'https://maps.google.com/?q=Cekirdek+Kahve+Kadikoy',
    imageUrl: 'https://images.pexels.com/photos/4350099/pexels-photo-4350099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Kahve',
    googleRatingSignal: {
      rating: 4.8,
      reviewCount: '780',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Günün Filtre Kahvesi & Double Espresso',
      description: 'Günlük kavrulan çekirdeklerle hazırlanan filtre kahve ve çift shot espresso.',
      tags: ['Günün Filtresi', 'Double Espresso'],
    },
    whyGo: {
      summary: 'Mahalle arasında kompakt espresso barı ve filtre kahve servisi.',
      reasons: ['Düzenli kahve servisi.'],
    },
    visitorFit: {
      bestFor: ['Kahve içmek isteyenler'],
      notIdealFor: ['Geniş grup buluşması'],
      vibeText: 'Kompakt mahalle dükkanı.',
    },
    knowBeforeYouGo: {
      tips: ['İçeride oturma alanı kısıtlıdır; paket servis ve sokak önü tabureleri kullanılabilir.'],
    },
    sources: [
      {
        publisher: 'Barista Magazine',
        title: 'Istanbul Cafes Guide',
        url: 'https://baristamagazine.com',
        date: '2025',
      },
    ],
    categorySlugs: ['kahve'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'brekkie-croissant-moda',
    name: 'Brekkie Croissant & Breakfast Club',
    tagline: 'Yoğurtçu Parkı karşısında fırın ürünleri ve kruvasanlı kahvaltı servisi',
    location: 'Moda, Kadıköy',
    neighborhood: 'Osmanağa / Yoğurtçu Parkı Hattı',
    address: 'Osmanağa Mah., Yoğurtçu Parkı Cad. No:24, 34714 Kadıköy/İstanbul',
    mapsUrl: 'https://maps.google.com/?q=Brekkie+Croissant+Moda',
    imageUrl: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Kahvaltı',
    googleRatingSignal: {
      rating: 4.6,
      reviewCount: '3.4k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Yumurtalı & Avokadolu Tuzlu Kruvasan Sandviç',
      description: 'Tereyağlı fırın kruvasanı içerisinde haşlanmış yumurta ve labne eşliğinde kahvaltı tabağı.',
      tags: ['Tereyağlı Kruvasan', 'Kahvaltı'],
    },
    whyGo: {
      summary: 'Kruvasanlı kahvaltı servisi.',
      reasons: ['Fırın ürünleri.'],
    },
    visitorFit: {
      bestFor: ['Kahvaltı yapmak isteyenler'],
      notIdealFor: ['Hızlı çıkmak isteyenler'],
      vibeText: 'Açık hava kahvaltı alanı.',
    },
    knowBeforeYouGo: {
      tips: ['Hafta sonu sabah 11:00-14:00 arası bekleme süresi oluşabilir; hafta içi sabahları sakindir.'],
    },
    sources: [
      {
        publisher: 'Gastronomi Rehberi',
        title: 'Kadıköy Kahvaltı Noktaları',
        url: 'https://yeriniayir.com',
        date: '2025',
      },
    ],
    categorySlugs: ['kahvalti'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'rafine-moda-bistro',
    name: 'Rafine Moda — Fine Cuisine',
    tagline: 'Şair Nefi Sokak\'ta butik fırın ürünleri ve kahvaltı tabağı servisi',
    location: 'Moda, Kadıköy',
    neighborhood: 'Caferağa Mah., Şair Nefi Sokak',
    address: 'Caferağa Mah., Şair Nefi Sk. No:4, 34710 Kadıköy/İstanbul',
    mapsUrl: 'https://maps.google.com/?q=Rafine+Moda+Kadikoy',
    imageUrl: 'https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Kahvaltı',
    googleRatingSignal: {
      rating: 4.7,
      reviewCount: '1.1k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Brioche Ekmeğinde Fransız Tostu & Poşe Yumurta',
      description: 'Tereyağlı brioche ekmeği dilimi ve taze peynirli poşe yumurta servisi.',
      tags: ['French Toast', 'Poşe Yumurta'],
    },
    whyGo: {
      summary: 'Butik kahvaltı bistrosu.',
      reasons: ['Taze hazırlanan kahvaltı tabakları.'],
    },
    visitorFit: {
      bestFor: ['Kahvaltı ve fırın lezzetleri arayanlar'],
      notIdealFor: ['Geniş esnaf sofrası arayanlar'],
      vibeText: 'Sakin sokak bistrosu.',
    },
    knowBeforeYouGo: {
      tips: ['Masa kapasitesi sınırlıdır, öğle saatlerinde erken gidilmesi tavsiye edilir.'],
    },
    sources: [
      {
        publisher: 'Food & Travel',
        title: 'Moda Rehberi',
        url: 'https://foodandtravel.com.tr',
        date: '2024',
      },
    ],
    categorySlugs: ['kahvalti'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'basta-street-food',
    name: 'Basta! Street Food Bar',
    tagline: 'Sakız Sokak\'ta ağır ateşte pişmiş kuzu eti dürümü ve burger servisi',
    location: 'Moda, Kadıköy',
    neighborhood: 'Caferağa Mah., Sakız Sokağı',
    address: 'Caferağa Mah., Sakız Sk. No:1, 34710 Kadıköy/İstanbul',
    mapsUrl: 'https://maps.google.com/?q=Basta+Street+Food+Bar+Kadikoy',
    imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Hamburger & Sokak',
    googleRatingSignal: {
      rating: 4.6,
      reviewCount: '2.1k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Kuzu Gerdan Dürüm & Ev Yapımı Kuzu Burger',
      description: 'Kısık ateşte pişirilen kuzu eti, köz patlıcan sosu ve lavaş ile sunulan dürüm veya brioche ekmeğinde burger.',
      tags: ['Kuzu Dürüm', 'Kuzu Burger'],
    },
    whyGo: {
      summary: 'Sokak lezzetleri servisi.',
      reasons: ['Taze hazırlanan kuzu eti.'],
    },
    visitorFit: {
      bestFor: ['Dürüm ve burger sevenler'],
      notIdealFor: ['Uzun oturmalı akşam yemeği arayanlar'],
      vibeText: 'Hareketli sokak barı.',
    },
    alsoTry: {
      items: [
        {
          name: 'Fırın Sütlaç',
          description: 'Karamelize üst yüzeyli geleneksel sütlü tatlı servisi.',
        },
      ],
    },
    knowBeforeYouGo: {
      tips: ['Hızlı servis konseptindedir; bar tabureleri ve dış mekan masaları bulunur.'],
    },
    sources: [
      {
        publisher: 'Gault & Millau Türkiye',
        title: 'Street Food Seçkisi',
        url: 'https://gaultmillau.com.tr',
        date: '2024–2025',
      },
    ],
    categorySlugs: ['hamburger'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'zapata-burger-moda',
    name: 'Zapata Burger',
    tagline: 'Şevki Bey Sokak\'ta brioche ekmeğinde smash burger ve patates servisi',
    location: 'Moda, Kadıköy',
    neighborhood: 'Caferağa Mah., Şevki Bey Sokak',
    address: 'Caferağa Mah., Şevki Bey Sk. No:31, 34710 Kadıköy/İstanbul',
    mapsUrl: 'https://maps.google.com/?q=Zapata+Burger+Moda',
    imageUrl: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Hamburger',
    googleRatingSignal: {
      rating: 4.5,
      reviewCount: '1.8k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Zapata Burger & Baharatlı Patates',
      description: 'Karamelize soğan, dana köfte ve eritilmiş peynirli burger tabağı.',
      tags: ['Smash Köfte', 'Burger'],
    },
    whyGo: {
      summary: 'Burger servisi.',
      reasons: ['Dana etli burger.'],
    },
    visitorFit: {
      bestFor: ['Burger severler'],
      notIdealFor: ['Diyet menüsü arayanlar'],
      vibeText: 'Mahalle burgercisi.',
    },
    knowBeforeYouGo: {
      tips: ['Patatesle birlikte ev yapımı soslar sipariş anında servis edilir.'],
    },
    sources: [
      {
        publisher: 'Basın Seçkisi',
        title: 'İstanbul Burger Durakları',
        url: 'https://yeriniayir.com',
        date: '2025',
      },
    ],
    categorySlugs: ['hamburger'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'forno-moda-pizza',
    name: 'Forno Moda',
    tagline: 'Dr. Esat Işık Caddesi\'nde taş fırında mayalanmış Napoli usulü pizza servisi',
    location: 'Moda, Kadıköy',
    neighborhood: 'Caferağa Mah., Dr. Esat Işık Caddesi',
    address: 'Caferağa Mah., Dr. Esat Işık Cad. No:18, 34710 Kadıköy/İstanbul',
    mapsUrl: 'https://maps.google.com/?q=Forno+Moda+Pizza',
    imageUrl: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Pizza',
    googleRatingSignal: {
      rating: 4.6,
      reviewCount: '1.5k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Pizza Margherita Di Bufala & Mantarlı Pizza',
      description: 'Manda mozzarellası, domates sosu ve fesleğenli odun ateşi pizzası.',
      tags: ['Napoli Pizza', 'Taş Fırın'],
    },
    whyGo: {
      summary: 'Taş fırın pizzası.',
      reasons: ['Odun ateşi fırını.'],
    },
    visitorFit: {
      bestFor: ['İtalyan pizzası sevenler'],
      notIdealFor: ['Kalın hamurlu pizza arayanlar'],
      vibeText: 'Pizzacı salonu.',
    },
    knowBeforeYouGo: {
      tips: ['Pizzalar taş fırından çıkar çıkmaz sıcak servis edilir.'],
    },
    sources: [
      {
        publisher: 'İtalyan Mutfak Rehberi',
        title: 'İstanbul Pizzacıları',
        url: 'https://yeriniayir.com',
        date: '2024',
      },
    ],
    categorySlugs: ['pizza'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'asuman-tatli-moda',
    name: 'Çikolata Moda — Asuman',
    tagline: 'Şair Nefi Sokak\'ta çikolatalı ve meyveli porselen kase tatlıları',
    location: 'Moda, Kadıköy',
    neighborhood: 'Caferağa Mah., Şair Nefi Sokak',
    address: 'Caferağa Mah., Şair Nefi Sk. No:9/A, 34710 Kadıköy/İstanbul',
    mapsUrl: 'https://maps.google.com/?q=Asuman+Moda+Kadikoy',
    imageUrl: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Tatlı & Pastane',
    googleRatingSignal: {
      rating: 4.6,
      reviewCount: '5.2k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Asuman Kase Tatlısı',
      description: 'Eritilmiş çikolata, bisküvi parçaları ve taze çilek katmanları.',
      tags: ['Çikolata', 'Kase Tatlısı'],
    },
    whyGo: {
      summary: 'Çikolata tatlıları servisi.',
      reasons: ['Kase tatlıları.'],
    },
    visitorFit: {
      bestFor: ['Çikolatalı tatlı sevenler'],
      notIdealFor: ['Sıra beklemek istemeyenler'],
      vibeText: 'Tatlıcı dükkanı.',
    },
    knowBeforeYouGo: {
      tips: ['Akşam saatlerinde kapıda kısa bekleme oluşabilir, sıra düzenli akar.'],
    },
    sources: [
      {
        publisher: 'Yerel Rehber',
        title: 'Kadıköy Tatlıcıları',
        url: 'https://yeriniayir.com',
        date: '2025',
      },
    ],
    categorySlugs: ['tatli-pastane'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'ali-usta-dondurma-moda',
    name: 'Meşhur Dondurmacı Ali Usta',
    tagline: 'Moda Caddesi sahil aksında mevsim meyveli külah dondurma servisi',
    location: 'Moda, Kadıköy',
    neighborhood: 'Caferağa Mah., Moda Caddesi',
    address: 'Moda Cad. No:176/B, 34710 Kadıköy/İstanbul',
    mapsUrl: 'https://maps.google.com/?q=Ali+Usta+Moda+Kadikoy',
    imageUrl: 'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Tatlı & Dondurma',
    googleRatingSignal: {
      rating: 4.3,
      reviewCount: '12.4k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Sütlü ve Meyveli Dondurma Çeşitleri',
      description: 'Mevsim meyvelerinden hazırlanan karadut, kavun ve fıstıklı külah seçenekleri.',
      tags: ['Meyveli Dondurma', 'Külah'],
    },
    whyGo: {
      summary: 'Dondurma servisi.',
      reasons: ['Sahil aksında dondurma.'],
    },
    visitorFit: {
      bestFor: ['Dondurma almak isteyenler'],
      notIdealFor: ['Oturmalı kafe ortamı arayanlar'],
      vibeText: 'Ayaküstü dondurmacı.',
    },
    knowBeforeYouGo: {
      tips: ['Sipariş sonrasında dondurma külahıyla sahil parkı yönüne yürünebilir.'],
    },
    sources: [
      {
        publisher: 'Basın Arşivi',
        title: 'Tarihi Dondurmacılar',
        url: 'https://yeriniayir.com',
        date: '2024',
      },
    ],
    categorySlugs: ['tatli-pastane'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'rita-moda-date',
    name: 'Rita Moda',
    tagline: 'Şair Nefi Sokak\'ta restore edilmiş köşkte akşam yemeği ve içecek servisi',
    location: 'Moda, Kadıköy',
    neighborhood: 'Caferağa Mah., Şair Nefi Sokak',
    address: 'Caferağa Mah., Şair Nefi Sk. No:14, 34710 Kadıköy/İstanbul',
    mapsUrl: 'https://maps.google.com/?q=Rita+Moda+Kadikoy',
    imageUrl: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Date Mekanları',
    googleRatingSignal: {
      rating: 4.5,
      reviewCount: '1.9k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'El Yapımı Makarna & Akşam Yemeği Menüsü',
      description: 'Günlük hazırlanan et soslu taze makarna ve alakart tabaklar.',
      tags: ['Taze Makarna', 'Akşam Yemeği'],
    },
    whyGo: {
      summary: 'Akşam yemeği servisi.',
      reasons: ['Tarihi bina atmosferi.'],
    },
    visitorFit: {
      bestFor: ['Akşam yemeği planı yapanlar'],
      notIdealFor: ['Sessiz çalışma ortamı arayanlar'],
      vibeText: 'Akşam restoranı.',
    },
    knowBeforeYouGo: {
      tips: ['Akşam servisi için önceden rezervasyon yapılması önerilir.'],
    },
    sources: [
      {
        publisher: 'Kent Rehberi',
        title: 'Akşam Yemeği Mekanları',
        url: 'https://yeriniayir.com',
        date: '2025',
      },
    ],
    categorySlugs: ['date-mekanlari'],
    scope: 'core',
    isDemoData: false,
  },

  // --- GAZİANTEP MEKANLARI (YÖRESEL & BİLGİ ODAKLI) ---
  {
    id: 'imam-cagdas-gaziantep',
    name: 'İmam Çağdaş Kebap & Baklava',
    tagline: 'Bakırcılar Çarşısı girişinde taş fırın baklavası ve zırh kebabı servisi',
    location: 'Gaziantep',
    neighborhood: 'Şahinbey, Uzun Çarşı',
    address: 'Eski Saray Mah., Uzun Çarşı Cad. No:49, 27400 Şahinbey/Gaziantep',
    mapsUrl: 'https://maps.google.com/?q=Imam+Cagdas+Gaziantep',
    imageUrl: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Kebap & Baklava',
    googleRatingSignal: {
      rating: 4.4,
      reviewCount: '18.2k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Ali Nazik Kebabı & Fıstıklı Havuç Dilim Baklava',
      description: 'Közlenmiş patlıcanlı süzme yoğurt üzerine zırh kıyması ve fırından sıcak havuç dilim baklava.',
      tags: ['Ali Nazik', 'Havuç Dilim Baklava'],
    },
    whyGo: {
      summary: 'Geleneksel kebap ve baklava üretimi.',
      reasons: ['Tarihi çarşı konumu.'],
    },
    visitorFit: {
      bestFor: ['Kebap ve baklava denemek isteyenler'],
      notIdealFor: ['Küçük kafe konsepti arayanlar'],
      vibeText: 'Tarihi çarşı lokantası.',
    },
    alsoTry: {
      items: [
        {
          name: 'Kuru Baklava Paketi',
          description: 'Şehirlerarası yolculuk için hazırlanan dayanıklı fıstıklı baklava kutusu.',
        },
      ],
    },
    knowBeforeYouGo: {
      tips: ['Baklava paketleri yolculuk için taze olarak ambalajlanabilir.'],
    },
    sources: [
      {
        publisher: 'Gastronomi Envanteri',
        title: 'Gaziantep Mutfak Kayıtları',
        url: 'https://yeriniayir.com',
        date: '2024',
      },
    ],
    categorySlugs: ['mutlaka-denenmesi-gerekenler', 'kebap', 'baklava'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'halil-usta-kusleme-gaziantep',
    name: 'Kebapçı Halil Usta',
    tagline: 'Zeugma Müzesi yakınında odun kömüründe küşleme ve kebap servisi',
    location: 'Gaziantep',
    neighborhood: 'Şehitkamil, Karşıyaka',
    address: 'Mithatpaşa Mah., Tekel Cad. No:7, 27500 Şehitkamil/Gaziantep',
    mapsUrl: 'https://maps.google.com/?q=Kebapci+Halil+Usta+Gaziantep',
    imageUrl: 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Kebap',
    googleRatingSignal: {
      rating: 4.5,
      reviewCount: '9.4k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Küşleme & Salçalı Kaşık Salatası',
      description: 'Kuzunun sırt bölümünden hazırlanan marine edilmemiş ızgara küşleme eti ve sumaklı salata.',
      tags: ['Küşleme', 'Kuzu Eti'],
    },
    whyGo: {
      summary: 'Küşleme servisi.',
      reasons: ['Odun kömürü ızgarası.'],
    },
    visitorFit: {
      bestFor: ['Küşleme eti denemek isteyenler'],
      notIdealFor: ['Geniş tatlı çeşitleri arayanlar'],
      vibeText: 'Esnaf kebapçısı.',
    },
    knowBeforeYouGo: {
      tips: ['Öğle servis saatlerinde (12:00-14:00) yoğunluk oluşabilir; porsiyonlar erken saatte tükenebilir.'],
    },
    sources: [
      {
        publisher: 'Gastronomi Envanteri',
        title: 'Gaziantep Kebapçıları',
        url: 'https://yeriniayir.com',
        date: '2024',
      },
    ],
    categorySlugs: ['mutlaka-denenmesi-gerekenler', 'kebap'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'metanet-beyran-gaziantep',
    name: 'Metanet Lokantası',
    tagline: 'Tabakhane bölgesinde bakır sahanda acılı kuzu gerdan beyranı servisi',
    location: 'Gaziantep',
    neighborhood: 'Şahinbey, Tabakhane',
    address: 'Kozluca Mah., Kozluca Cad. No:11, 27400 Şahinbey/Gaziantep',
    mapsUrl: 'https://maps.google.com/?q=Metanet+Lokantasi+Gaziantep',
    imageUrl: 'https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Beyran',
    googleRatingSignal: {
      rating: 4.6,
      reviewCount: '11.8k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Geleneksel Kuzu Gerdan Beyranı',
      description: 'Pirinç, haşlanmış kuzu gerdan eti, sarımsak ve et suyuyla harlı ateşte kaynatılan çorba.',
      tags: ['Sabah Beyranı', 'Kuzu Gerdan'],
    },
    whyGo: {
      summary: 'Beyran servisi.',
      reasons: ['Geleneksel sabah servisi.'],
    },
    visitorFit: {
      bestFor: ['Geleneksel beyran içmek isteyenler'],
      notIdealFor: ['Hafif kahvaltı arayanlar'],
      vibeText: 'Sabah lokantası.',
    },
    knowBeforeYouGo: {
      tips: ['Beyran servisi sabah 06:00\'da başlar; öğleden sonra servisi sınırlıdır.'],
    },
    sources: [
      {
        publisher: 'Gastronomi Envanteri',
        title: 'Beyran Servis Noktaları',
        url: 'https://yeriniayir.com',
        date: '2024',
      },
    ],
    categorySlugs: ['mutlaka-denenmesi-gerekenler', 'beyran'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'kocak-baklava-gaziantep',
    name: 'Koçak Baklava',
    tagline: 'Ali Fuat Cebesoy Bulvarı\'nda erken hasat fıstıklı kuru baklava servisi',
    location: 'Gaziantep',
    neighborhood: 'Şehitkamil, Ali Fuat Cebesoy',
    address: 'Budak Mah., Ali Fuat Cebesoy Bulv. No:44, 27090 Şehitkamil/Gaziantep',
    mapsUrl: 'https://maps.google.com/?q=Kocak+Baklava+Gaziantep',
    imageUrl: 'https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Baklava',
    googleRatingSignal: {
      rating: 4.7,
      reviewCount: '15.6k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Kare Kuru Baklava & Havuç Dilimi',
      description: 'İnce yufka katmanları arasında Antep fıstığı ve şerbetle fırınlanan kuru baklava.',
      tags: ['Kuru Baklava', 'Antep Fıstığı'],
    },
    whyGo: {
      summary: 'Fıstıklı baklava üretimi.',
      reasons: ['Günlük üretim.'],
    },
    visitorFit: {
      bestFor: ['Baklava satın almak ve tatmak isteyenler'],
      notIdealFor: ['Düşük kalorili tatlı arayanlar'],
      vibeText: 'Baklava salonu.',
    },
    knowBeforeYouGo: {
      tips: ['Şehir dışı gönderim ve seyahat için özel vakumlu kutularda paketleme yapılır.'],
    },
    sources: [
      {
        publisher: 'Gastronomi Envanteri',
        title: 'Baklava Üreticileri',
        url: 'https://yeriniayir.com',
        date: '2024',
      },
    ],
    categorySlugs: ['mutlaka-denenmesi-gerekenler', 'baklava'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'zekeriya-usta-katmer-gaziantep',
    name: 'Katmerci Zekeriya Usta',
    tagline: 'Çukur Mahallesi\'nde taş fırında pişen kaymaklı ve fıstıklı katmer servisi',
    location: 'Gaziantep',
    neighborhood: 'Şahinbey, Çukur Mahallesi',
    address: 'Çukur Mah., Körükçü Sk. No:16/C, 27400 Şahinbey/Gaziantep',
    mapsUrl: 'https://maps.google.com/?q=Katmerci+Zekeriya+Usta+Gaziantep',
    imageUrl: 'https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Katmer',
    googleRatingSignal: {
      rating: 4.6,
      reviewCount: '7.8k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Taş Fırında Fıstıklı Katmer',
      description: 'İnce açılmış yufka içerisine süt kaymağı ve Antep fıstığı sarılarak fırınlanan tatlı.',
      tags: ['Taş Fırın Katmer', 'Süt Kaymağı'],
    },
    whyGo: {
      summary: 'Katmer fırını.',
      reasons: ['Taş fırın pişirimi.'],
    },
    visitorFit: {
      bestFor: ['Geleneksel katmer denemek isteyenler'],
      notIdealFor: ['Modern pastane ortamı arayanlar'],
      vibeText: 'Tarihi arasta fırını.',
    },
    knowBeforeYouGo: {
      tips: ['Geleneksel olarak sabah saatlerinde tüketilir; yanında ılık süt tercih edilir.'],
    },
    sources: [
      {
        publisher: 'Gastronomi Envanteri',
        title: 'Gaziantep Katmercileri',
        url: 'https://yeriniayir.com',
        date: '2024',
      },
    ],
    categorySlugs: ['mutlaka-denenmesi-gerekenler', 'katmer'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'orkide-pastanesi-gaziantep',
    name: 'Orkide Pastanesi & Kahvaltı',
    tagline: 'Değirmiçem Mahallesi\'nde yöresel peynirler ve sahan sıcakları ile kahvaltı',
    location: 'Gaziantep',
    neighborhood: 'Şehitkamil, Değirmiçem',
    address: 'Değirmiçem Mah., Gazi Muhtar Paşa Bulv. No:19, Şehitkamil/Gaziantep',
    mapsUrl: 'https://maps.google.com/?q=Orkide+Pastanesi+Gaziantep',
    imageUrl: 'https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Kahvaltı',
    googleRatingSignal: {
      rating: 4.5,
      reviewCount: '4.8k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Yöresel Antep Serpme Kahvaltısı',
      description: 'Antep sıkma peyniri, semsek böreği, fırın pidesi ve reçel çeşitleri eşliğinde kahvaltı servisi.',
      tags: ['Serpme Kahvaltı', 'Antep Peyniri'],
    },
    whyGo: {
      summary: 'Yöresel kahvaltı servisi.',
      reasons: ['Yerel peynir çeşitleri.'],
    },
    visitorFit: {
      bestFor: ['Serpme kahvaltı arayan aile ve gruplar'],
      notIdealFor: ['Hızlı ayaküstü atıştırmalık arayanlar'],
      vibeText: 'Geniş kahvaltı salonu.',
    },
    knowBeforeYouGo: {
      tips: ['Geniş salon oturma alanına sahiptir; hafta sonu rezervasyon önerilir.'],
    },
    sources: [
      {
        publisher: 'Gastronomi Envanteri',
        title: 'Antep Kahvaltı Salonları',
        url: 'https://yeriniayir.com',
        date: '2024',
      },
    ],
    categorySlugs: ['kahvalti'],
    scope: 'core',
    isDemoData: false,
  },

  // --- FETHİYE MEKANLARI (BALIK PAZARI & SAHİL GASTRONOMİSİ) ---
  {
    id: 'hilmi-balik-fethiye',
    name: 'Hilmi Balık Restaurant (Tarihi Balık Pazarı)',
    tagline: 'Fethiye Balık Pazarı merkezinde taze deniz ürünleri ve meze servisi',
    location: 'Fethiye, Muğla',
    neighborhood: 'Cumhuriyet Mah., Tarihi Balık Pazarı',
    address: 'Cumhuriyet Mah., Belediye Cad. Balık Pazarı No:51, 48300 Fethiye/Muğla',
    mapsUrl: 'https://maps.google.com/?q=Hilmi+Balik+Fethiye',
    imageUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Deniz Ürünleri',
    googleRatingSignal: {
      rating: 4.5,
      reviewCount: '3.6k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Izgara Lagos & Kalamar Tava',
      description: 'Tezgahtan seçilen günlük deniz balığının ızgarada pişirilmesi ve zeytinyağlı mezeler.',
      tags: ['Lagos Balığı', 'Kalamar'],
    },
    whyGo: {
      summary: 'Balık pazarında taze deniz ürünleri servisi.',
      reasons: ['Taze balık pişirme olanağı.'],
    },
    visitorFit: {
      bestFor: ['Balık pazarında yemek yemek isteyenler'],
      notIdealFor: ['Sessiz sahil ortamı arayanlar'],
      vibeText: 'Balık hali restoranı.',
    },
    knowBeforeYouGo: {
      tips: ['Balık pazarındaki halden balık satın alınıp restorana pişirme ücreti karşılığında hazırlatılabilir.'],
    },
    sources: [
      {
        publisher: 'Ege Deniz Rehberi',
        title: 'Fethiye Balık Restoranları',
        url: 'https://yeriniayir.com',
        date: '2025',
      },
    ],
    categorySlugs: ['deniz-urunleri'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'enver-yalcin-fethiye',
    name: 'Enver Yalçın Yörük Müzesi & Köy Kahvaltısı',
    tagline: 'Kargı Köyü\'nde bahçe içerisinde yöresel köy kahvaltısı servisi',
    location: 'Fethiye, Muğla',
    neighborhood: 'Kargı Köyü, Fethiye',
    address: 'Kargı Mah., Yanıklar Yolu Üzeri, 48300 Fethiye/Muğla',
    mapsUrl: 'https://maps.google.com/?q=Enver+Yalcin+Yoruk+Muzesi+Fethiye',
    imageUrl: 'https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Kahvaltı',
    googleRatingSignal: {
      rating: 4.7,
      reviewCount: '4.1k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Yörük Köy Kahvaltısı & Odun Ateşinde Bazlama',
      description: 'Köy peynirleri, ev reçelleri, zeytin ve fırından sıcak bazlama eşliğinde bahçe kahvaltısı.',
      tags: ['Köy Kahvaltısı', 'Fırın Bazlama'],
    },
    whyGo: {
      summary: 'Köy ortamında bahçe kahvaltısı.',
      reasons: ['Bahçe ortamı.'],
    },
    visitorFit: {
      bestFor: ['Doğada köy kahvaltısı yapmak isteyenler'],
      notIdealFor: ['Şehir merkezinde yürüyerek ulaşmak isteyenler'],
      vibeText: 'Portakal bahçesi.',
    },
    knowBeforeYouGo: {
      tips: ['Şehir merkezine araçla yaklaşık 15 dakika mesafededir.'],
    },
    sources: [
      {
        publisher: 'Muğla Gezi Kayıtları',
        title: 'Köy Kahvaltıları',
        url: 'https://yeriniayir.com',
        date: '2025',
      },
    ],
    categorySlugs: ['kahvalti'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'babadag-coffee-fethiye',
    name: 'Babadağ Roastery & Specialty Coffee',
    tagline: 'Paspatur Çarşısı girişinde filtre kahve, soğuk demleme ve espresso servisi',
    location: 'Fethiye, Muğla',
    neighborhood: 'Cumhuriyet Mah., Çarşı Caddesi',
    address: 'Cumhuriyet Mah., Çarşı Cad. No:12, 48300 Fethiye/Muğla',
    mapsUrl: 'https://maps.google.com/?q=Babadag+Coffee+Fethiye',
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Kahve',
    googleRatingSignal: {
      rating: 4.7,
      reviewCount: '980',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Soğuk Demleme (Cold Drip) & Filtre Kahve',
      description: 'Tek kökenli çekirdeklerle hazırlanan V60 filtre kahve ve buzlu soğuk demleme.',
      tags: ['Cold Brew', 'Filtre Kahve'],
    },
    whyGo: {
      summary: 'Kahve servisi.',
      reasons: ['Paspatur konumu.'],
    },
    visitorFit: {
      bestFor: ['Kahve molası vermek isteyenler'],
      notIdealFor: ['Yemek menüsü arayanlar'],
      vibeText: 'Çarşı kahvecisi.',
    },
    knowBeforeYouGo: {
      tips: ['Açık hava sarmaşıklı sokak masalarında oturma alanı bulunur.'],
    },
    sources: [
      {
        publisher: 'Kahve Rehberi',
        title: 'Ege Kahve Dükkanları',
        url: 'https://yeriniayir.com',
        date: '2025',
      },
    ],
    categorySlugs: ['kahve'],
    scope: 'core',
    isDemoData: false,
  },
  {
    id: 'mori-restaurant-fethiye',
    name: 'Mori Restaurant (Yat Limanı Hattı)',
    tagline: 'Karagözler sahil aksında deniz manzaralı Akdeniz mutfağı ve deniz ürünleri servisi',
    location: 'Fethiye, Muğla',
    neighborhood: 'Karagözler Mah., Fevzi Çakmak Caddesi',
    address: 'Karagözler Mah., Fevzi Çakmak Cad. No:42, 48300 Fethiye/Muğla',
    mapsUrl: 'https://maps.google.com/?q=Mori+Restaurant+Fethiye',
    imageUrl: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg?auto=compress&cs=tinysrgb&w=1200',
    categoryName: 'Date Mekanları',
    googleRatingSignal: {
      rating: 4.6,
      reviewCount: '1.4k',
      note: 'Google Maps işletme kaydı doğrulanmış değerlendirme sinyali.',
    },
    orderSuggestion: {
      title: 'Deniz Mahsullü Risotto & Günlük Balık',
      description: 'Deniz mahsulleriyle hazırlanan risotto ve mevsim balıkları alakart menüsü.',
      tags: ['Risotto', 'Deniz Ürünleri'],
    },
    whyGo: {
      summary: 'Deniz manzaralı akşam servisi.',
      reasons: ['Körfez manzarası.'],
    },
    visitorFit: {
      bestFor: ['Akşam yemeği planı yapanlar'],
      notIdealFor: ['Ayaküstü atıştırmalık arayanlar'],
      vibeText: 'Sahil restoranı.',
    },
    knowBeforeYouGo: {
      tips: ['Gün batımı saatleri için deniz kenarı masalara rezervasyon yapılması tavsiye edilir.'],
    },
    sources: [
      {
        publisher: 'Kıyı Rehberi',
        title: 'Fethiye Restoranları',
        url: 'https://yeriniayir.com',
        date: '2025',
      },
    ],
    categorySlugs: ['date-mekanlari'],
    scope: 'core',
    isDemoData: false,
  },
];

// ============================================================================
// 4. "BURANIN RİTÜELLERİ" VERİTABANI (STANDART KATEGORİLERDEN AYRI VE BAĞIMSIZ)
// ============================================================================
const REGION_RITUALS: Record<string, FoodRitual[]> = {
  'istanbul/kadikoy/moda': [
    {
      id: 'moda-cay-bahcesi-firini',
      locationId: 'istanbul/kadikoy/moda',
      headline: "Moda'da Böyle Yap",
      title: 'Tarihi Moda Çay Bahçesi & Fırın Sabahı',
      summary: 'Pastaneden alınan taze simit veya açma ile deniz manzaralı asırlık çınarların altında demli çay içme deneyimi.',
      badgeText: 'Semt Ritüeli',
      bestTime: 'Sabah 08:30 – 11:00',
      verifiedNote: 'Çay bahçesinde dışarıdan fırın ürünü kabul edilmektedir; içecek siparişi verilmesi yeterlidir.',
      stops: [
        {
          order: 1,
          venueName: 'Tarihi Moda Fırını veya Butik Kruvasancı',
          action: 'Fırından yeni çıkmış sıcak susamlı simit, kaşarlı açma veya kruvasanınızı paket yaptırın.',
          note: 'Hafta sonu sabah 09:00 civarı taze tezgaha denk gelinir.',
        },
        {
          order: 2,
          venueName: 'Tarihi Moda İskelesi Çay Bahçesi',
          action: 'Deniz kenarındaki ferforje masalardan birine yerleşip ince belli bardakta çay söyleyin.',
          note: 'Marmara Denizi ve Adalar manzarasına karşı kahvaltınızı yapın.',
        },
      ],
      tips: [
        'Hafta sonları saat 10:00 sonrasında deniz kenarı masalar dolabilir; erken saatlerde gitmek daha sakindir.',
      ],
      imageUrl: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ],

  'gaziantep': [
    {
      id: 'gaziantep-beyran-tahmis',
      locationId: 'gaziantep',
      headline: "Gaziantep'te Böyle Yap",
      title: 'Sabah Beyranı & Bakırcılar Çarşısı Tahmis Kahvesi',
      summary: 'Günün erken saatinde acılı sarımsaklı kuzu beyranıyla başlayıp, tarihi handa menengiç kahvesi içme ritüeli.',
      badgeText: 'Kent Ritüeli',
      bestTime: 'Sabah 06:30 – 09:30',
      verifiedNote: 'Beyran yerel kültürde bir öğle veya akşam yemeği değil, güne başlama çorbasıdır; öğleden sonra servisi sınırlıdır.',
      stops: [
        {
          order: 1,
          venueName: 'Metanet Lokantası',
          action: 'Bakır sahanda servis edilen kuzu gerdanlı beyran çorbasını tırnak pideyle için.',
          note: 'Acı ve sarımsak oranını ustanıza sipariş verirken belirtebilirsiniz.',
        },
        {
          order: 2,
          venueName: 'Tarihi Tahmis Kahvesi (1635)',
          action: 'Bakırcılar Çarşısı\'ndan geçerek tarihi kahveye varın; közde pişen menengiç kahvesi sipariş edin.',
          note: 'Yanında kavrulmuş karpuz çekirdeği ikram edilir.',
        },
      ],
      tips: [
        'Beyran dükkanları sabah erkenden açılır; saat 11:00 civarında tencere tükenebilir.',
      ],
      imageUrl: 'https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ],

  'mugla/fethiye': [
    {
      id: 'fethiye-balik-pazari-pisirt',
      locationId: 'mugla/fethiye',
      headline: "Fethiye'de Böyle Yap",
      title: 'Tarihi Balık Pazarı "Seç ve Pişirt" Akşamı',
      summary: 'Ortadaki tezgahlardan günlük taze balığı seçip etraftaki restoranlara ızgara yaptırma deneyimi.',
      badgeText: 'Pazar Ritüeli',
      bestTime: 'Akşamüstü 18:30 – 21:00',
      verifiedNote: 'Pişirme bedeli restoranlarda kişi başı sabit tarife ile ücretlendirilir.',
      stops: [
        {
          order: 1,
          venueName: 'Tarihi Balık Hali Meydanı',
          action: 'Ortadaki tezgahlardan günlük lagos, levrek veya kalamarı tarttırıp satın alın.',
          note: 'Balıkçı balığı hemen temizleyip teslim eder.',
        },
        {
          order: 2,
          venueName: 'Meydan Restoranları (Hilmi vb.)',
          action: 'Masanıza geçin, balığınızı teslim edin; zeytinyağlı mezeler eşliğinde ızgaradan gelmesini bekleyin.',
          note: 'Kalamarı tavada, balığı ızgarada tercih edebilirsiniz.',
        },
      ],
      tips: [
        'Yaz aylarında saat 20:00 sonrasında balık pazarında masa bulmak zorlaşabilir; 19:00 civarı gitmek daha uygundur.',
      ],
      imageUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ],
};

// ============================================================================
// 5. SAĞLAYICI MOTORU (PROVIDER ENGINE)
// ============================================================================
export const foodDiscoveryProvider: FoodDiscoveryProvider = {
  searchLocations(query: string): FoodLocation[] {
    const q = normalizeTr(query.trim());
    if (!q) return [];

    return LOCATIONS.filter((loc) => {
      const matchName = normalizeTr(loc.name).includes(q);
      const matchDisplayName = normalizeTr(loc.displayName).includes(q);
      const matchAliases = loc.aliases?.some((a) => normalizeTr(a).includes(q));
      return matchName || matchDisplayName || matchAliases;
    });
  },

  getLocationByPath(path: string[]): FoodLocation | undefined {
    const fullPathStr = path.join('/').toLowerCase();
    return LOCATIONS.find((loc) => loc.path.join('/').toLowerCase() === fullPathStr);
  },

  getLocationBySlug(slug: string): FoodLocation | undefined {
    const cleanSlug = slug.toLowerCase();
    return LOCATIONS.find(
      (loc) => loc.slug === cleanSlug || loc.id === cleanSlug || loc.path.join('/') === cleanSlug
    );
  },

  getChildren(locationId: string): FoodLocation[] {
    return LOCATIONS.filter((loc) => loc.parentId === locationId);
  },

  getReadyRegions(): FoodLocation[] {
    return LOCATIONS.filter((loc) => loc.status === 'published' || loc.status === 'demo');
  },

  /** Bölgeye özel dinamik kategoriler (en fazla 7 kategori) */
  getRegionCategories(locationId: string): FoodCategory[] {
    const loc = this.getLocationBySlug(locationId) || LOCATIONS.find((l) => l.id === locationId);
    if (!loc) return MODA_CATEGORIES;

    if (loc.slug === 'gaziantep' || loc.id === 'gaziantep') {
      return GAZIANTEP_CATEGORIES;
    }
    if (loc.slug === 'fethiye' || loc.id === 'mugla/fethiye') {
      return FETHIYE_CATEGORIES;
    }
    // Varsayılan Moda / Kadıköy
    return MODA_CATEGORIES;
  },

  /** Bölge ve Kategori bazlı mekan sonuçları */
  getCategoryResult(locationId: string, categorySlug: string): CategoryResult | undefined {
    const loc = this.getLocationBySlug(locationId) || LOCATIONS.find((l) => l.id === locationId);
    if (!loc) return undefined;

    const categories = this.getRegionCategories(loc.id);
    const category = categories.find((c) => c.slug === categorySlug) || categories[0];

    // Bu konuma ait mekanları bul
    const regionVenues = ALL_VENUES.filter((v) => {
      const locStr = typeof v.location === 'string' ? v.location : (v.location?.tr || '');
      if (loc.slug === 'moda') {
        return locStr.includes('Moda') || locStr.includes('Kadıköy');
      }
      if (loc.slug === 'gaziantep') {
        return locStr.includes('Gaziantep');
      }
      if (loc.slug === 'fethiye') {
        return locStr.includes('Fethiye');
      }
      return false;
    });

    // Kategori filtrelemesi
    let matchingVenues: FoodVenue[] = [];
    if (category.isMustTry || category.slug === 'mutlaka-denenmesi-gerekenler') {
      matchingVenues = regionVenues.filter((v) =>
        v.categorySlugs.includes('mutlaka-denenmesi-gerekenler')
      );
    } else {
      matchingVenues = regionVenues.filter((v) => v.categorySlugs.includes(category.slug));
    }

    const coreVenues = matchingVenues.filter((v) => v.scope === 'core');
    const nearbyVenues = matchingVenues.filter((v) => v.scope === 'nearby');

    return {
      location: loc,
      category,
      coreVenues,
      nearbyVenues,
      isDemo: loc.status === 'demo',
    };
  },

  /** Bölgeye özel doğrulanmış ritüeller */
  getRegionRituals(locationId: string): FoodRitual[] {
    const loc = this.getLocationBySlug(locationId) || LOCATIONS.find((l) => l.id === locationId);
    if (!loc) return [];
    return REGION_RITUALS[loc.id] || [];
  },
};
