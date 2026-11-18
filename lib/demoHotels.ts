import { Hotel, Tag } from './types';

export const DEMO_TAGS: Tag[] = [
  { id: 'tag-1', name: { tr: 'Denize Sıfır & Özel Koy', en: 'Seafront & Private Bay' }, slug: 'denize-sifir', icon: 'Waves', isFeatured: true },
  { id: 'tag-2', name: { tr: 'Isıtmalı Sonsuzluk Havuzu', en: 'Heated Infinity Pool' }, slug: 'havuzlu', icon: 'Droplets', isFeatured: true },
  { id: 'tag-3', name: { tr: 'Aile & Çocuk Dostu', en: 'Family Friendly' }, slug: 'aile-oteli', icon: 'Users', isFeatured: true },
  { id: 'tag-4', name: { tr: 'Evcil Hayvan Dostu', en: 'Pet Friendly' }, slug: 'evcil-hayvan-dostu', icon: 'Dog', isFeatured: true },
  { id: 'tag-5', name: { tr: 'Yerel & Organik Kahvaltı', en: 'Organic Local Breakfast' }, slug: 'organik-kahvalti', icon: 'Coffee', isFeatured: true },
  { id: 'tag-6', name: { tr: 'Spa & Bütünsel Wellness', en: 'Spa & Holistic Wellness' }, slug: 'spa-wellness', icon: 'Sparkles', isFeatured: true },
  { id: 'tag-7', name: { tr: 'Romantik Çift Oteli', en: 'Romantic Boutique Stay' }, slug: 'romantik-kacamak', icon: 'Heart', isFeatured: false },
  { id: 'tag-8', name: { tr: 'Ücretsiz Vale & Otopark', en: 'Free Valet & Parking' }, slug: 'ucretsiz-otopark', icon: 'Car', isFeatured: false },
  { id: 'tag-9', name: { tr: 'Şef Restoranı & Gastronomi', en: 'Chef Restaurant & Dining' }, slug: 'sef-restorani', icon: 'Utensils', isFeatured: false },
];

function buildRichEditorialAbout(hotelName: string, locationLabel: string, highlightNote: string): { tr: string; en: string } {
  return {
    tr: `${hotelName}, ${locationLabel} bölgesinde mimari dokusu, doğayla kurduğu kusursuz denge ve kişiselleştirilmiş misafirperverliğiyle öne çıkan seçkin bir Yerini Ayır koleksiyon otelidir. ${highlightNote}\n\nOdaların tamamında doğal taş ve sıcak ahşap detaylar, yüksek tavanlı ferah yaşam alanları, özel dokuma tekstil ürünleri ve panoramik manzaraya açılan geniş teraslar yer alır. Günün ilk ışıklarından gün batımına kadar dinginlik arayan misafirler için ses yalıtımı, ergonomik yatak konforu ve hızlı fiber bağlantı gibi modern detaylar eksiksiz düşünülmüştür.\n\nYerini Ayır editör ekibi olarak bu tesisi; kalabalıklardan uzaklaşmak, sabahları yerel üreticilerden gelen taze ürünlerle hazırlanan uzun bir kahvaltı sofrasında vakit geçirmek ve akşamları şefin mevsimsel menüsüyle günü tamamlamak isteyen misafirlerimize gönül rahatlığıyla öneriyoruz.`,
    en: `${hotelName} is a curated Yerini Ayır collection property in ${locationLabel}, celebrated for its timeless architecture, seamless harmony with nature, and attentive hospitality. ${highlightNote}\n\nEvery suite features natural stone and warm timber accents, generous high-ceilinged living spaces, bespoke linens, and private terraces opening onto panoramic views. From sunrise serenity to golden-hour relaxation, every modern comfort is thoughtfully provided.\n\nOur editorial team recommends this property for travelers seeking refined tranquility, artisan farm-to-table breakfasts, and memorable evening dining.`,
  };
}

function buildRichBreakfastDescription(hotelName: string, locationLabel: string): { tr: string; en: string } {
  return {
    tr: `${hotelName} mutfağında kahvaltı, ${locationLabel} ve çevresindeki yerel üreticilerden günlük olarak temin edilen doğal ürünlerle 08:00 – 11:30 saatleri arasında serpme olarak servis edilir. Odun ateşinde pişen ekşi mayalı köy ekmekleri, taş baskı erken hasat zeytinyağı, yöresel olgunlaştırılmış peynir çeşitleri, ev yapımı şekersiz meyve reçelleri, bakır sahanda köy yumurtası ve taze fırınlanmış sıcak pişiler sofranın imza lezzetleridir.`,
    en: `Breakfast at ${hotelName} is served daily from 08:00 to 11:30 with farm-fresh ingredients sourced from ${locationLabel} artisans, featuring wood-fired sourdough breads, early-harvest olive oil, aged regional cheeses, homemade preserves, copper-pan eggs, and freshly baked pastries.`,
  };
}

function buildRichFaqs(hotelName: string, locationLabel: string, isPetFriendly: boolean) {
  return [
    {
      question: 'Giriş ve çıkış saatleri nelerdir?',
      answer: `${hotelName} için standart giriş saati 14:00, çıkış saati ise 12:00'dir. Müsaitlik durumuna göre erken giriş ve geç çıkış talepleriniz resepsiyon ekibi tarafından memnuniyetle karşılanmaktadır.`,
    },
    {
      question: 'Tesisin kahvaltı saatleri ve konsepti nedir?',
      answer: `Kahvaltımız her gün 08:00 - 11:30 saatleri arasında yerel çiftlik ürünleri, sıcak taş fırın lezzetleri ve taze demleme çay/kahve eşliğinde serpme olarak sunulmaktadır. Konaklama fiyatına dahildir.`,
    },
    {
      question: 'Otopark ve vale hizmeti mevcut mu?',
      answer: 'Evet, tesis bünyesinde misafirlerimize özel 24 saat güvenlik kameralı ücretsiz otopark, vale hizmeti ve elektrikli araç şarj istasyonu bulunmaktadır.',
    },
    {
      question: 'Evcil hayvan kabul ediliyor mu?',
      answer: isPetFriendly
        ? 'Evet! Tesisimiz evcil hayvan dostudur. Bahçeli odalarımızda patili dostlarınız için özel yatak, mama/su kabı ve geniş çim oyun alanları ücretsiz olarak sunulmaktadır.'
        : 'Evet, önceden bilgi verilmesi koşuluyla belirli bahçe katı süitlerimizde evcil hayvan misafirlerimiz kabul edilmektedir.',
    },
    {
      question: 'Konum olarak merkeze ve popüler noktalara uzaklığı nedir?',
      answer: `Tesisimiz ${locationLabel} bölgesinin en nezih ve sakin noktasında yer almakta olup, bölgenin öne çıkan gastronomi mekanlarına, plajlarına ve yürüyüş rotalarına 5-10 dakikalık sürüş mesafesindedir.`,
    },
    {
      question: 'Çocuklu aileler için uygun mu?',
      answer: 'Evet, geniş aile süitlerimiz, güvenli bahçe alanlarımız ve çocuklara özel sağlıklı mutfak menümüz ile aile konaklamaları için son derece uygundur.',
    },
    {
      question: 'Spa, havuz ve wellness olanakları nelerdir?',
      answer: 'Tesisimizde ısıtmalı açık/kapalı yüzme havuzu, geleneksel Türk hamamı, sauna, aromaterapi masaj odaları ve sabah yoga seansları düzenlenen dinlenme terası mevcuttur.',
    },
    {
      question: 'Bu otele gelmek için en ideal dönem hangisidir?',
      answer: `${locationLabel} bölgesinin doğasını ve gastronomisini deneyimlemek için Nisan-Kasım arası bahar ve yaz ayları ile dingin bir kaçamak arayanlar için hafta içi dönemleri en ideal zamanlardır.`,
    },
  ];
}

const DEFAULT_TAGS = [
  'denize-sifir',
  'havuzlu',
  'aile-oteli',
  'evcil-hayvan-dostu',
  'organik-kahvalti',
  'spa-wellness',
  'romantik-kacamak',
  'ucretsiz-otopark',
  'sef-restorani',
];

export const DEMO_HOTELS: Hotel[] = [
  // ============================================================================
  // KATEGORİ 1: HAFTANIN İNDİRİMLİ OTELLERİ (3 Otel)
  // ============================================================================
  {
    id: 'demo-indirimli-1',
    name: { tr: 'Lujo Cove & Infinity Resort (%25 İndirim)', en: 'Lujo Cove & Infinity Resort (25% Off)' },
    location: { tr: 'Bodrum, Güvercinlik Koyu, Muğla', en: 'Bodrum, Guvercinlik Bay, Mugla' },
    slug: 'demo-indirimli-1',
    gnkScore: 9.6,
    price: 7450,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_indirimli_1.png',
    galleryImages: [
      '/images/demo-hotels/hotel_indirimli_1.png',
      '/images/demo-hotels/hotel_detail_suite.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_indirimli_1.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['Özel Koy & İskele', 'Isıtmalı Sonsuzluk Havuzu', 'Fine Dining Restoran', 'Sensum Spa', 'Ücretsiz Vale'],
    about: buildRichEditorialAbout(
      'Lujo Cove & Infinity Resort',
      'Bodrum Güvercinlik Koyu',
      'Bu haftaya özel %25 erken rezervasyon indirimiyle sunulan tesis, çam ormanlarının turkuaz Ege sularıyla buluştuğu özel bir yarımadada kademeli sonsuzluk havuzları ve beyaz kumlu plajıyla benzersiz bir konfor sunuyor.'
    ),
    description: buildRichEditorialAbout(
      'Lujo Cove & Infinity Resort',
      'Bodrum Güvercinlik Koyu',
      'Bu haftaya özel %25 erken rezervasyon indirimiyle sunulan tesis, çam ormanlarının turkuaz Ege sularıyla buluştuğu özel bir yarımadada kademeli sonsuzluk havuzları ve beyaz kumlu plajıyla benzersiz bir konfor sunuyor.'
    ),
    breakfast_description: buildRichBreakfastDescription('Lujo Cove & Infinity Resort', 'Bodrum, Muğla'),
    coordinates: { lat: 37.1265, lng: 27.5592 },
    latitude: 37.1265,
    longitude: 27.5592,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=37.1265,27.5592',
    faqs: buildRichFaqs('Lujo Cove & Infinity Resort', 'Bodrum, Muğla', true),
  },
  {
    id: 'demo-indirimli-2',
    name: { tr: 'Casa Lavanda Butik Otel & Spa (%20 İndirim)', en: 'Casa Lavanda Boutique Hotel & Spa (20% Off)' },
    location: { tr: 'Sapanca, Kırkpınar, Sakarya', en: 'Sapanca, Kirkpinar, Sakarya' },
    slug: 'demo-indirimli-2',
    gnkScore: 9.4,
    price: 5200,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_indirimli_2.png',
    galleryImages: [
      '/images/demo-hotels/hotel_indirimli_2.png',
      '/images/demo-hotels/hotel_detail_suite.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_indirimli_2.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['Lavanta Bahçeleri', 'Şefin Tadım Menüsü', 'Orman Manzaralı Havuz', 'Aromaterapi Spa', 'Şömineli Süitler'],
    about: buildRichEditorialAbout(
      'Casa Lavanda Butik Otel & Spa',
      'Sapanca Kırkpınar',
      'Haftanın indirimli seçkisinde %20 fiyat avantajıyla yer alan tesis, 20 dönümlük yemyeşil vadi içerisinde taş mimarisi, organik bostanı ve gurme restoranıyla hafta sonu kaçamaklarının en rafine adresidir.'
    ),
    description: buildRichEditorialAbout(
      'Casa Lavanda Butik Otel & Spa',
      'Sapanca Kırkpınar',
      'Haftanın indirimli seçkisinde %20 fiyat avantajıyla yer alan tesis, 20 dönümlük yemyeşil vadi içerisinde taş mimarisi, organik bostanı ve gurme restoranıyla hafta sonu kaçamaklarının en rafine adresidir.'
    ),
    breakfast_description: buildRichBreakfastDescription('Casa Lavanda Butik Otel & Spa', 'Sapanca, Sakarya'),
    coordinates: { lat: 40.6914, lng: 30.2285 },
    latitude: 40.6914,
    longitude: 30.2285,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=40.6914,30.2285',
    faqs: buildRichFaqs('Casa Lavanda Butik Otel & Spa', 'Sapanca, Sakarya', true),
  },
  {
    id: 'demo-indirimli-3',
    name: { tr: 'D-Maris Peninsula Bay Retreat (%30 İndirim)', en: 'D-Maris Peninsula Bay Retreat (30% Off)' },
    location: { tr: 'Fethiye, Göcek Koyu, Muğla', en: 'Fethiye, Gocek Bay, Mugla' },
    slug: 'demo-indirimli-3',
    gnkScore: 9.7,
    price: 8900,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_indirimli_3.png',
    galleryImages: [
      '/images/demo-hotels/hotel_indirimli_3.png',
      '/images/demo-hotels/hotel_detail_suite.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_indirimli_3.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['5 Özel Kum Plaj', 'Panoramik Koy Manzarası', 'Deniz Uçağı & Yat İskelesi', 'Vitality Spa', 'Helikopter Pisti'],
    about: buildRichEditorialAbout(
      'D-Maris Peninsula Bay Retreat',
      'Fethiye & Göcek Yarımadası',
      'Haftanın en yüksek oranlı (%30) indirim fırsatına sahip olan bu görkemli yarımada oteli, çam ormanlarıyla çevrili beş ayrı özel kumsalı ve Ege ile Akdeniz’in birleştiği noktadaki nefes kesici manzarasıyla unutulmaz bir tatil vadediyor.'
    ),
    description: buildRichEditorialAbout(
      'D-Maris Peninsula Bay Retreat',
      'Fethiye & Göcek Yarımadası',
      'Haftanın en yüksek oranlı (%30) indirim fırsatına sahip olan bu görkemli yarımada oteli, çam ormanlarıyla çevrili beş ayrı özel kumsalı ve Ege ile Akdeniz’in birleştiği noktadaki nefes kesici manzarasıyla unutulmaz bir tatil vadediyor.'
    ),
    breakfast_description: buildRichBreakfastDescription('D-Maris Peninsula Bay Retreat', 'Fethiye, Muğla'),
    coordinates: { lat: 36.7528, lng: 28.9412 },
    latitude: 36.7528,
    longitude: 28.9412,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=36.7528,28.9412',
    faqs: buildRichFaqs('D-Maris Peninsula Bay Retreat', 'Fethiye, Muğla', true),
  },

  // ============================================================================
  // KATEGORİ 2: EVCİL HAYVAN DOSTU OTELLER (3 Otel)
  // ============================================================================
  {
    id: 'demo-pet-1',
    name: { tr: 'Narköy Orman & Patili Doğa Лоdge', en: 'Narkoy Forest & Pet Eco Lodge' },
    location: { tr: 'Sapanca, Kırkpınar Orman Yolu, Sakarya', en: 'Sapanca, Kirkpinar Forest Road, Sakarya' },
    slug: 'demo-pet-1',
    gnkScore: 9.5,
    price: 4650,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_pet_1.png',
    galleryImages: [
      '/images/demo-hotels/hotel_pet_1.png',
      '/images/demo-hotels/hotel_detail_suite.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_pet_1.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['Çitle Çevrili Özel Bahçe', 'Ücretsiz Pati Paketi', 'Orman Yürüyüş Parkuru', 'Ekolojik Çiftlik', 'Şömineli Ahşap Chalet'],
    about: buildRichEditorialAbout(
      'Narköy Orman & Patili Doğa Lodge',
      'Sapanca Kırkpınar',
      'Patili dostlarınızla hiçbir kısıtlama olmadan tatil yapabilmeniz için tasarlanan bu ahşap orman evleri, her odanın önünde yer alan güvenli çim bahçesi, orman içi yürüyüş parkurları ve organik çiftlik mutfağıyla hayvansever misafirlerin favorisidir.'
    ),
    description: buildRichEditorialAbout(
      'Narköy Orman & Patili Doğa Lodge',
      'Sapanca Kırkpınar',
      'Patili dostlarınızla hiçbir kısıtlama olmadan tatil yapabilmeniz için tasarlanan bu ahşap orman evleri, her odanın önünde yer alan güvenli çim bahçesi, orman içi yürüyüş parkurları ve organik çiftlik mutfağıyla hayvansever misafirlerin favorisidir.'
    ),
    breakfast_description: buildRichBreakfastDescription('Narköy Orman & Patili Doğa Lodge', 'Sapanca, Sakarya'),
    coordinates: { lat: 40.6881, lng: 30.2419 },
    latitude: 40.6881,
    longitude: 30.2419,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=40.6881,30.2419',
    faqs: buildRichFaqs('Narköy Orman & Patili Doğa Lodge', 'Sapanca, Sakarya', true),
  },
  {
    id: 'demo-pet-2',
    name: { tr: 'Alavya Taş Avlu & Pet Boutique Hotel', en: 'Alavya Stone Courtyard & Pet Boutique Hotel' },
    location: { tr: 'Bodrum, Bitez Mandalina Bahçeleri, Muğla', en: 'Bodrum, Bitez Tangerine Gardens, Mugla' },
    slug: 'demo-pet-2',
    gnkScore: 9.6,
    price: 6800,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_pet_2.png',
    galleryImages: [
      '/images/demo-hotels/hotel_pet_2.png',
      '/images/demo-hotels/hotel_bodrum_interior.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_pet_2.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['Zeytin & Mandalina Avlusu', 'Evcil Hayvan Dostu Plaj Erişimi', 'Taş Mimari Süitler', 'Güneşlenme Terası', 'Yoga & Meditasyon Bahçesi'],
    about: buildRichEditorialAbout(
      'Alavya Taş Avlu & Pet Boutique Hotel',
      'Bodrum Bitez',
      'Begonvillerle sarılı tarihi taş avlusu ve asırlık zeytin ağaçları altında patili dostlarınızı aileden biri gibi ağırlayan tesis, gölgeli geniş bahçe alanları ve denize yürüme mesafesindeki konumuyla huzurlu bir Ege klasiğidir.'
    ),
    description: buildRichEditorialAbout(
      'Alavya Taş Avlu & Pet Boutique Hotel',
      'Bodrum Bitez',
      'Begonvillerle sarılı tarihi taş avlusu ve asırlık zeytin ağaçları altında patili dostlarınızı aileden biri gibi ağırlayan tesis, gölgeli geniş bahçe alanları ve denize yürüme mesafesindeki konumuyla huzurlu bir Ege klasiğidir.'
    ),
    breakfast_description: buildRichBreakfastDescription('Alavya Taş Avlu & Pet Boutique Hotel', 'Bodrum, Muğla'),
    coordinates: { lat: 37.0294, lng: 27.3812 },
    latitude: 37.0294,
    longitude: 27.3812,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=37.0294,27.3812',
    faqs: buildRichFaqs('Alavya Taş Avlu & Pet Boutique Hotel', 'Bodrum, Muğla', true),
  },
  {
    id: 'demo-pet-3',
    name: { tr: 'Cedar Glass Bungalow & Spa Retreat', en: 'Cedar Glass Bungalow & Spa Retreat' },
    location: { tr: 'Sapanca, Mahmudiye Vadisi, Sakarya', en: 'Sapanca, Mahmudiye Valley, Sakarya' },
    slug: 'demo-pet-3',
    gnkScore: 9.3,
    price: 5400,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_pet_3.png',
    galleryImages: [
      '/images/demo-hotels/hotel_pet_3.png',
      '/images/demo-hotels/hotel_detail_suite.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_pet_3.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['Özel Isıtmalı Havuz', 'Müstakil Korunaklı Bahçe', 'Sedir Ağacı & Cam Mimari', 'Ateş Çukuru (Fire Pit)', 'Odaya Serpme Kahvaltı'],
    about: buildRichEditorialAbout(
      'Cedar Glass Bungalow & Spa Retreat',
      'Sapanca Mahmudiye Vadisi',
      'Modern cam ve sedir ağacı mimarisini özel ısıtmalı havuz ve tamamen korunaklı müstakil bahçeyle buluşturan bu tasarım bungalovlar, evcil hayvanınızla birlikte özgürce vakit geçirebileceğiniz dört mevsim popüler bir doğa sığınağıdır.'
    ),
    description: buildRichEditorialAbout(
      'Cedar Glass Bungalow & Spa Retreat',
      'Sapanca Mahmudiye Vadisi',
      'Modern cam ve sedir ağacı mimarisini özel ısıtmalı havuz ve tamamen korunaklı müstakil bahçeyle buluşturan bu tasarım bungalovlar, evcil hayvanınızla birlikte özgürce vakit geçirebileceğiniz dört mevsim popüler bir doğa sığınağıdır.'
    ),
    breakfast_description: buildRichBreakfastDescription('Cedar Glass Bungalow & Spa Retreat', 'Sapanca, Sakarya'),
    coordinates: { lat: 40.6795, lng: 30.2541 },
    latitude: 40.6795,
    longitude: 30.2541,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=40.6795,30.2541',
    faqs: buildRichFaqs('Cedar Glass Bungalow & Spa Retreat', 'Sapanca, Sakarya', true),
  },

  // ============================================================================
  // KATEGORİ 3: KAPADOKYA OTELLERİ (3 Otel)
  // ============================================================================
  {
    id: 'demo-kapadokya-1',
    name: { tr: 'Museum Cave Hotel & Heated Pool Terrace', en: 'Museum Cave Hotel & Heated Pool Terrace' },
    location: { tr: 'Kapadokya, Uçhisar Kalesi Yolu, Nevşehir', en: 'Cappadocia, Uchisar Castle Road, Nevsehir' },
    slug: 'demo-kapadokya-1',
    gnkScore: 9.8,
    price: 11200,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_kapadokya_1.png',
    galleryImages: [
      '/images/demo-hotels/hotel_kapadokya_1.png',
      '/images/demo-hotels/hotel_kapadokya_interior.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_kapadokya_1.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['Balon Manzaralı Roma Havuzu', 'Otantik Kaya & Mağara Süitler', 'Relais & Châteaux Üyesi', 'Şarap Mahzeni & Tadım', 'Jakuzili Teras'],
    about: buildRichEditorialAbout(
      'Museum Cave Hotel & Heated Pool Terrace',
      'Uçhisar, Kapadokya',
      'Binlerce yıllık tarihi mağara odaların paha biçilmez antikalarla restore edilmesiyle hayata geçen bu eşsiz müze otel, gün doğumunda yüzlerce sıcak hava balonunu dört mevsim sıcak Roma havuzundan izleme ayrıcalığı sunuyor.'
    ),
    description: buildRichEditorialAbout(
      'Museum Cave Hotel & Heated Pool Terrace',
      'Uçhisar, Kapadokya',
      'Binlerce yıllık tarihi mağara odaların paha biçilmez antikalarla restore edilmesiyle hayata geçen bu eşsiz müze otel, gün doğumunda yüzlerce sıcak hava balonunu dört mevsim sıcak Roma havuzundan izleme ayrıcalığı sunuyor.'
    ),
    breakfast_description: buildRichBreakfastDescription('Museum Cave Hotel & Heated Pool Terrace', 'Kapadokya, Nevşehir'),
    coordinates: { lat: 38.6319, lng: 34.8065 },
    latitude: 38.6319,
    longitude: 34.8065,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=38.6319,34.8065',
    faqs: buildRichFaqs('Museum Cave Hotel & Heated Pool Terrace', 'Kapadokya, Nevşehir', true),
  },
  {
    id: 'demo-kapadokya-2',
    name: { tr: 'Argos Stone Mansion in Cappadocia', en: 'Argos Stone Mansion in Cappadocia' },
    location: { tr: 'Kapadokya, Güvercinlik Vadisi, Uçhisar', en: 'Cappadocia, Pigeon Valley, Uchisar' },
    slug: 'demo-kapadokya-2',
    gnkScore: 9.7,
    price: 9600,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_kapadokya_2.png',
    galleryImages: [
      '/images/demo-hotels/hotel_kapadokya_2.png',
      '/images/demo-hotels/hotel_kapadokya_interior.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_kapadokya_2.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['Güvercinlik Vadisi Manzarası', 'Tarihi Yeraltı Tüneli & Mahzen', 'Özel İç Havuzlu Süitler', 'Seki Lounge & Gastronomi', 'Şömineli Taş Odalar'],
    about: buildRichEditorialAbout(
      'Argos Stone Mansion in Cappadocia',
      'Uçhisar Güvercinlik Vadisi, Kapadokya',
      'Eski bir manastır yerleşkesinin üzerinde yükselen taş konaklar, yeraltı tünelleriyle birbirine bağlanan mağara süitler ve Erciyes Dağı’na karşı konumlanan teraslarıyla Kapadokya’nın en büyüleyici mimari projelerinden biridir.'
    ),
    description: buildRichEditorialAbout(
      'Argos Stone Mansion in Cappadocia',
      'Uçhisar Güvercinlik Vadisi, Kapadokya',
      'Eski bir manastır yerleşkesinin üzerinde yükselen taş konaklar, yeraltı tünelleriyle birbirine bağlanan mağara süitler ve Erciyes Dağı’na karşı konumlanan teraslarıyla Kapadokya’nın en büyüleyici mimari projelerinden biridir.'
    ),
    breakfast_description: buildRichBreakfastDescription('Argos Stone Mansion in Cappadocia', 'Kapadokya, Uçhisar'),
    coordinates: { lat: 38.6284, lng: 34.8082 },
    latitude: 38.6284,
    longitude: 34.8082,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=38.6284,34.8082',
    faqs: buildRichFaqs('Argos Stone Mansion in Cappadocia', 'Kapadokya, Uçhisar', true),
  },
  {
    id: 'demo-kapadokya-3',
    name: { tr: 'Sacred House Cave & Panoramic Terrace', en: 'Sacred House Cave & Panoramic Terrace' },
    location: { tr: 'Kapadokya, Ürgüp Tarihi Merkez, Nevşehir', en: 'Cappadocia, Urgup Historic Center, Nevsehir' },
    slug: 'demo-kapadokya-3',
    gnkScore: 9.5,
    price: 8400,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_kapadokya_3.png',
    galleryImages: [
      '/images/demo-hotels/hotel_kapadokya_3.png',
      '/images/demo-hotels/hotel_kapadokya_interior.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_kapadokya_3.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['Gün Doğumu Balon Terası', 'Kemerli Taş Jakuzi Süitleri', 'Inferno Yeraltı Spa & Havuz', 'Tarihi Rum Konağı', 'Kişisel Butler Servisi'],
    about: buildRichEditorialAbout(
      'Sacred House Cave & Panoramic Terrace',
      'Ürgüp, Kapadokya',
      '250 yıllık tarihi bir taş konağın dramatik bir tasarım diliyle yeniden yorumlandığı tesis; el dokuması Anadolu halılarıyla bezeli balon izleme terası, yeraltı taş spa alanı ve mistik atmosferiyle benzersiz bir deneyim sunar.'
    ),
    description: buildRichEditorialAbout(
      'Sacred House Cave & Panoramic Terrace',
      'Ürgüp, Kapadokya',
      '250 yıllık tarihi bir taş konağın dramatik bir tasarım diliyle yeniden yorumlandığı tesis; el dokuması Anadolu halılarıyla bezeli balon izleme terası, yeraltı taş spa alanı ve mistik atmosferiyle benzersiz bir deneyim sunar.'
    ),
    breakfast_description: buildRichBreakfastDescription('Sacred House Cave & Panoramic Terrace', 'Kapadokya, Ürgüp'),
    coordinates: { lat: 38.6305, lng: 34.9115 },
    latitude: 38.6305,
    longitude: 34.9115,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=38.6305,34.9115',
    faqs: buildRichFaqs('Sacred House Cave & Panoramic Terrace', 'Kapadokya, Ürgüp', true),
  },

  // ============================================================================
  // KATEGORİ 4: BODRUM OTELLERİ (3 Otel)
  // ============================================================================
  {
    id: 'demo-bodrum-1',
    name: { tr: 'Maçakızı Beach & Aegean Deck Hotel', en: 'Macakizi Beach & Aegean Deck Hotel' },
    location: { tr: 'Bodrum, Göltürkbükü, Muğla', en: 'Bodrum, Golturkbuku, Mugla' },
    slug: 'demo-bodrum-1',
    gnkScore: 9.8,
    price: 14500,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_bodrum_1.png',
    galleryImages: [
      '/images/demo-hotels/hotel_bodrum_1.png',
      '/images/demo-hotels/hotel_bodrum_interior.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_bodrum_1.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['İkonik Ahşap İskele & Beach', 'Akdeniz & Ege Gastronomisi', 'Begonvilli Deniz Manzaralı Odalar', 'Nuxe Spa & Açık Hava Hamamı', 'Özel Tekne Transferi'],
    about: buildRichEditorialAbout(
      'Maçakızı Beach & Aegean Deck Hotel',
      'Göltürkbükü, Bodrum',
      'Türkbükü’nün berrak suları üzerine uzanan ikonik ahşap iskelesi, pembe begonvillerin gölgelediği terasları ve öğle yemeklerini bir gastronomi ritüeline dönüştüren mutfağıyla Bodrum yarımadasının en zamansız klasiğidir.'
    ),
    description: buildRichEditorialAbout(
      'Maçakızı Beach & Aegean Deck Hotel',
      'Göltürkbükü, Bodrum',
      'Türkbükü’nün berrak suları üzerine uzanan ikonik ahşap iskelesi, pembe begonvillerin gölgelediği terasları ve öğle yemeklerini bir gastronomi ritüeline dönüştüren mutfağıyla Bodrum yarımadasının en zamansız klasiğidir.'
    ),
    breakfast_description: buildRichBreakfastDescription('Maçakızı Beach & Aegean Deck Hotel', 'Bodrum, Göltürkbükü'),
    coordinates: { lat: 37.1432, lng: 27.3865 },
    latitude: 37.1432,
    longitude: 27.3865,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=37.1432,27.3865',
    faqs: buildRichFaqs('Maçakızı Beach & Aegean Deck Hotel', 'Bodrum, Göltürkbükü', true),
  },
  {
    id: 'demo-bodrum-2',
    name: { tr: 'The Bodrum EDITION Yalıkavak Bay', en: 'The Bodrum EDITION Yalikavak Bay' },
    location: { tr: 'Bodrum, Yalıkavak Tilkicik Koyu, Muğla', en: 'Bodrum, Yalikavak Tilkicik Bay, Mugla' },
    slug: 'demo-bodrum-2',
    gnkScore: 9.7,
    price: 13200,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_bodrum_2.png',
    galleryImages: [
      '/images/demo-hotels/hotel_bodrum_2.png',
      '/images/demo-hotels/hotel_bodrum_interior.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_bodrum_2.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['Özel Plunge Havuzlu Süitler', 'Beyaz Kumlu Koy & Cabana', 'Michelin Rehberli Morena & Brava', 'Sonsuzluk Havuzu', 'Yalıkavak Marina 5 Dk'],
    about: buildRichEditorialAbout(
      'The Bodrum EDITION Yalıkavak Bay',
      'Yalıkavak, Bodrum',
      'Tilkicik Koyu’na hakim amfi-tiyatro mimarisi, açık renk traverten taşlarla bezeli özel havuzlu süitleri ve dünyaca ünlü şeflerin imzasını taşıyan restoranlarıyla Yalıkavak’ın modern lüks anlayışını zirveye taşıyor.'
    ),
    description: buildRichEditorialAbout(
      'The Bodrum EDITION Yalıkavak Bay',
      'Yalıkavak, Bodrum',
      'Tilkicik Koyu’na hakim amfi-tiyatro mimarisi, açık renk traverten taşlarla bezeli özel havuzlu süitleri ve dünyaca ünlü şeflerin imzasını taşıyan restoranlarıyla Yalıkavak’ın modern lüks anlayışını zirveye taşıyor.'
    ),
    breakfast_description: buildRichBreakfastDescription('The Bodrum EDITION Yalıkavak Bay', 'Bodrum, Yalıkavak'),
    coordinates: { lat: 37.1218, lng: 27.2846 },
    latitude: 37.1218,
    longitude: 27.2846,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=37.1218,27.2846',
    faqs: buildRichFaqs('The Bodrum EDITION Yalıkavak Bay', 'Bodrum, Yalıkavak', true),
  },
  {
    id: 'demo-bodrum-3',
    name: { tr: 'Amanruya Stone Pavilion & Olive Grove', en: 'Amanruya Stone Pavilion & Olive Grove' },
    location: { tr: 'Bodrum, Demirbükü Koyu, Muğla', en: 'Bodrum, Demirbuku Bay, Mugla' },
    slug: 'demo-bodrum-3',
    gnkScore: 9.9,
    price: 16800,
    currency: 'TRY',
    coverImageUrl: '/images/demo-hotels/hotel_bodrum_3.png',
    galleryImages: [
      '/images/demo-hotels/hotel_bodrum_3.png',
      '/images/demo-hotels/hotel_bodrum_interior.png',
      '/images/demo-hotels/hotel_detail_breakfast.png',
    ],
    breakfast_images: [
      '/images/demo-hotels/hotel_detail_breakfast.png',
      '/images/demo-hotels/hotel_bodrum_3.png',
    ],
    tags: DEFAULT_TAGS,
    amenities: ['Müstakil Taş Köşk & Özel Havuz', '50 Metre Yeşil Mermer Havuz', 'Asırlık Zeytinlik & Çam Ormanı', 'Özel Çakıl Plaj & İskele', 'Kütüphane & Şarap Kulesi'],
    about: buildRichEditorialAbout(
      'Amanruya Stone Pavilion & Olive Grove',
      'Demirbükü Koyu, Bodrum',
      'Asırlık zeytinlikler ve kızılçam ormanları arasında her biri kendi özel bahçesine ve mermer yüzme havuzuna sahip müstakil taş köşklerden oluşan Amanruya, mutlak mahremiyet ve dinginlik arayanlar için tasarlanmış bir başyapıttır.'
    ),
    description: buildRichEditorialAbout(
      'Amanruya Stone Pavilion & Olive Grove',
      'Demirbükü Koyu, Bodrum',
      'Asırlık zeytinlikler ve kızılçam ormanları arasında her biri kendi özel bahçesine ve mermer yüzme havuzuna sahip müstakil taş köşklerden oluşan Amanruya, mutlak mahremiyet ve dinginlik arayanlar için tasarlanmış bir başyapıttır.'
    ),
    breakfast_description: buildRichBreakfastDescription('Amanruya Stone Pavilion & Olive Grove', 'Bodrum, Demirbükü'),
    coordinates: { lat: 37.1489, lng: 27.4192 },
    latitude: 37.1489,
    longitude: 27.4192,
    website_url: 'https://www.yeriniayir.com/tr',
    instagram_url: 'https://instagram.com/gnkoteller',
    google_maps_url: 'https://maps.google.com/?q=37.1489,27.4192',
    faqs: buildRichFaqs('Amanruya Stone Pavilion & Olive Grove', 'Bodrum, Demirbükü', true),
  },
];

export const DEMO_HOTEL_GROUPS = [
  {
    id: 'group-indirimli',
    title: { tr: 'Haftanın İndirimli Otelleri', en: 'Discounted Hotels of the Week' },
    domains: ['yeriniayir.com', 'worldandhotels.com'],
    hotels: DEMO_HOTELS.filter((h) => h.id.startsWith('demo-indirimli-')),
  },
  {
    id: 'group-evcil-hayvan',
    title: { tr: 'Evcil Hayvan Dostu Oteller', en: 'Pet-Friendly Hotels' },
    domains: ['yeriniayir.com', 'worldandhotels.com'],
    hotels: DEMO_HOTELS.filter((h) => h.id.startsWith('demo-pet-')),
  },
  {
    id: 'group-kapadokya',
    title: { tr: 'Kapadokya Otelleri', en: 'Cappadocia Hotels' },
    domains: ['yeriniayir.com', 'worldandhotels.com'],
    hotels: DEMO_HOTELS.filter((h) => h.id.startsWith('demo-kapadokya-')),
  },
  {
    id: 'group-bodrum',
    title: { tr: 'Bodrum Otelleri', en: 'Bodrum Hotels' },
    domains: ['yeriniayir.com', 'worldandhotels.com'],
    hotels: DEMO_HOTELS.filter((h) => h.id.startsWith('demo-bodrum-')),
  },
];

export function getDemoHotelById(id: string): Hotel | null {
  return DEMO_HOTELS.find((h) => h.id === id || h.slug === id) || null;
}
