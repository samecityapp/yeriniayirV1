import { RestaurantCategory } from '@/lib/types';

export const sapancaPlaces: RestaurantCategory[] = [
  {
    title: 'En İyi Serpme Kahvaltı',
    places: [
      {
        name: 'Sasa Harmanlık',
        image: 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Sapanca Gölü\'nün tam kenarında, muhteşem bir manzaraya karşı, bölgenin en popüler ve en zengin serpme kahvaltılarından biri.',
        googleRating: 4.4,
        reviewCount: '5.2k',
        orderSuggestion: 'Serpme Kahvaltı (Pişiler ve Acuka)',
        notes: [
          { emoji: '🌅', text: 'Göl kenarındaki masalar için hafta sonu mutlaka rezervasyon yaptırın. En iyi manzara orada.' },
          { emoji: '🥐', text: 'Pişileri inanılmaz lezzetli ve sıcak geliyor, gelmezse mutlaka isteyin.' },
          { emoji: '🚗', text: 'Otoparkı mevcut ancak yoğun günlerde yer bulmak zor olabiliyor, erken gitmekte fayda var.' },
        ],
      },
      {
        name: 'Beta Home Gölevi',
        image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Butik bir otelin içinde yer alan, göl kenarında, inanılmaz huzurlu ve "Instagram\'lık" bir kahvaltı deneyimi. Sakinlik ve estetik arayanlar için ideal.',
        googleRating: 4.6,
        reviewCount: '850',
        orderSuggestion: 'Gölevi Kahvaltı Tabağı',
        notes: [
          { emoji: '🦢', text: 'Göldeki kuğuları izlerken kahvaltı yapmak paha biçilemez bir deneyim.' },
          { emoji: '🌿', text: 'Serpme kahvaltı değil, daha rafine ve kaliteli bir kahvaltı tabağı sunuyorlar. Tam bir "slow living" mekanı.' },
          { emoji: '🤫', text: 'Sadece konaklayanlara değil, dışarıdan misafirlere de açık. Kalabalıktan kaçmak için birebir.' },
        ],
      },
      {
        name: 'İstanbuldere Alabalık Evi',
        image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Göl kenarı değil, ormanın içinde ve derenin hemen yanında. Yeşillikler içinde, su sesi eşliğinde, tam bir doğa kaçamağı kahvaltısı.',
        googleRating: 4.4,
        reviewCount: '4.1k',
        orderSuggestion: 'Serpme Köy Kahvaltısı ve Mıhlama',
        notes: [
          { emoji: '🌲', text: 'Göl manzarası değil, orman ve dere manzarası arayanlar için Fethiye\'deki Yeşil Vadi ayarında bir yer.' },
          { emoji: '👨‍👩‍👧', text: 'Çocuklu aileler için çok uygun, geniş bir alanı ve oyun parkı mevcut.' },
          { emoji: '🍂', text: 'Özellikle sonbaharda yaprakların arasındaki renk cümbüşüyle manzarası harika oluyor.' },
        ],
      },
    ],
  },
  {
    title: 'En İyi Alabalık / Yöresel',
    places: [
      {
        name: 'Vadi Restaurant (Maşukiye)',
        image: 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Maşukiye\'nin en bilinen klasiklerinden. Şelalenin hemen dibinde, derenin üzerine kurulmuş ahşap platformlarda yemek yeme deneyimi sunar.',
        googleRating: 4.3,
        reviewCount: '7.3k',
        orderSuggestion: 'Kiremitte Alabalık ve Mıhlama',
        notes: [
          { emoji: '🏞️', text: 'Atmosfer ve doğa, yemeğin kendisinden daha çok öne çıkıyor. Şelaleyi tam gören masaları istemelisiniz.' },
          { emoji: '🐟', text: 'Kiremitte tereyağlı alabalık ve peyniri uzayan mıhlama buranın imzasıdır.' },
          { emoji: '🔥', text: 'Kış aylarında içerideki büyük şöminenin ve sobanın yanı çok keyifli oluyor.' },
        ],
      },
      {
        name: 'Cansu Tesisleri (Maşukiye)',
        image: 'https://images.pexels.com/photos/1907228/pexels-photo-1907228.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Derenin tam üzerine kurulmuş sedirlerde, ayaklarınızı buz gibi sulara sokarak alabalık yiyebileceğiniz otantik ve salaş bir mekan.',
        googleRating: 4.2,
        reviewCount: '3.9k',
        orderSuggestion: 'Kiremitte Kaşarlı Mantar ve Alabalık',
        notes: [
          { emoji: '💧', text: 'Deneyim için mutlaka derenin üzerindeki sedirlerden birini kapmaya çalışın.' },
          { emoji: '🧣', text: 'Su sesi ve serinlik yaz aylarında harika olsa da, akşamları için yanınıza bir hırka alın.' },
          { emoji: '🍄', text: 'Ara sıcak olarak gelen kiremitte kaşarlı mantarları çok beğeniliyor.' },
        ],
      },
      {
        name: 'Green Blue Restaurant (Maşukiye)',
        image: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Maşukiye\'deki geleneksel dere kenarı mekanlarına göre daha modern ve şık bir alternatif. Menüsü sadece alabalık değil, dünya mutfağından seçenekler de sunar.',
        googleRating: 4.5,
        reviewCount: '2.8k',
        orderSuggestion: 'Karışık Izgara Tabağı veya Somon',
        notes: [
          { emoji: '✨', text: 'Salaş yerlerden hoşlanmayan, daha rafine ve şık bir ortam arayanlar için ideal.' },
          { emoji: '🥩', text: 'Alabalık sevmeyenler için et seçenekleri ve makarnaları da çok başarılı.' },
          { emoji: '🥂', text: 'Alkollü içecek servisi de mevcut, bu da onu bölgedeki diğer alabalıkçılardan ayırıyor.' },
        ],
      },
    ],
  },
  {
    title: 'En İyi Et & Mangal',
    places: [
      {
        name: 'Güven Et Mangal (Kırkpınar)',
        image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Bölgenin en sevilen kasap & restoran (steakhouse) konseptlerinden biri. Kendi etinizi vitrinden seçiyorsunuz ve sizin için pişiriyorlar.',
        googleRating: 4.4,
        reviewCount: '3.1k',
        orderSuggestion: 'Kuru Dinlendirilmiş (Dry-Aged) Antrikot',
        notes: [
          { emoji: '🥩', text: 'Et reyonundan istediğiniz eti ve gramajı seçme özgürlüğü harika.' },
          { emoji: '👨‍🍳', text: 'Kendin pişir değil, siz seçiyorsunuz onlar mükemmel kıvamda pişirip getiriyor.' },
          { emoji: '🌭', text: 'Kendi üretimleri olan kasap sucukları da çok meşhur, mutlaka tadına bakın.' },
        ],
      },
      {
        name: 'Meşhur Taraklı Dönercisi (Adapazarı)',
        image: 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Adapazarı merkezde (Sapanca\'ya yakın) bulunan, odun ateşinde pişen efsanevi bir dönerci. Öğlen saatlerinde biten, kuyruk olan bir lezzet.',
        googleRating: 4.6,
        reviewCount: '1.2k',
        orderSuggestion: 'Odun Ateşinde Döner (Porsiyon)',
        notes: [
          { emoji: '🔥', text: 'Odun ateşinde ağır ağır pişen dönerin lezzeti, endüstriyel dönerlerden çok farklı.' },
          { emoji: '🕒', text: 'Döneri yemek istiyorsanız mutlaka öğlen (12:00-14:00 arası) gitmelisiniz, akşama kalmıyor.' },
          { emoji: '🥛', text: 'Yanında sadece açık ayran ve közlenmiş biberle servis ediliyor, tam bir odaklanmış lezzet.' },
        ],
      },
      {
        name: 'Çiftlik Restaurant (Kırkpınar)',
        image: 'https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Geniş bir bahçe içinde, hem et & mangal seçenekleri sunan hem de meşhur kabak tatlısıyla ünlü bir aile restoranı.',
        googleRating: 4.2,
        reviewCount: '2.9k',
        orderSuggestion: 'Karışık Izgara ve Kabak Tatlısı',
        notes: [
          { emoji: '🎃', text: 'Yemeğin üstüne mutlaka tahinli, cevizli, kaymaklı kabak tatlısından yiyin. Sırf bunun için bile gelinir.' },
          { emoji: '👨‍👩‍👧', text: 'Bahçesi çok geniş ve çocuk oyun alanı var, aileler için de çok uygun.' },
          { emoji: '🌿', text: 'Yeşillikler içinde, sakin bir akşam yemeği için ideal bir ortam sunuyor.' },
        ],
      },
    ],
  },
  {
    title: 'En İyi Kahve & Tatlı',
    places: [
      {
        name: 'Uzun Teras Cafe & Bistro',
        image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Adının hakkını veren, Sapanca Gölü\'nü tepeden gören, belki de bölgenin en panoramik manzaralı mekanı. Yemekten çok kahve ve manzara için tercih ediliyor.',
        googleRating: 4.5,
        reviewCount: '2.1k',
        orderSuggestion: 'Türk Kahvesi veya San Sebastian Cheesecake',
        notes: [
          { emoji: '📸', text: 'Sapanca Gölü\'nü ve gün batımını fotoğraflamak için en iyi nokta burası.' },
          { emoji: '🍰', text: 'Yemekleri ortalama olsa da, manzaraya karşı kahve içmek ve tatlı yemek için gidilir.' },
          { emoji: '💰', text: 'Fiyatlar standartların üzerinde, burada manzarayı da hesaba dahil ediyorlar.' },
        ],
      },
      {
        name: 'EFG Coffee Company (Kırkpınar)',
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Sapanca ve Kırkpınar bölgesindeki "nitelikli kahve" ve "üçüncü nesil kahveci" açığını kapatan, modern ve popüler bir mekan.',
        googleRating: 4.5,
        reviewCount: '900',
        orderSuggestion: 'Cortado veya Chemex Demleme',
        notes: [
          { emoji: '☕', text: 'Bölgede gerçek espresso bazlı (Cortado, Flat White) kahve içebileceğiniz nadir yerlerden.' },
          { emoji: '💻', text: 'Atmosferi laptop ile çalışmak veya arkadaşlarla sohbet etmek için çok uygun.' },
          { emoji: '🍪', text: 'Yanında sundukları taze kurabiye ve tatlılar da kahveye güzel eşlik ediyor.' },
        ],
      },
      {
        name: 'White Mill Cafe & Restoran',
        image: 'https://images.pexels.com/photos/1120970/pexels-photo-1120970.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Değirmen konseptli, şık dekorasyonu ve popülerliğiyle bilinen bir mekan. Hem kahve-tatlı hem de dünya mutfağı için tercih ediliyor.',
        googleRating: 4.3,
        reviewCount: '2.2k',
        orderSuggestion: 'Magnolia Tatlısı veya Sıcak Çikolata',
        notes: [
          { emoji: '✨', text: 'Dekorasyonu çok şık ve "Instagram\'lık". Özellikle akşam ışıklandırması güzel.' },
          { emoji: '🍓', text: 'Tatlı menüleri çok geniş ve sunumları başarılı. Magnolia ve Brownie\'leri seviliyor.' },
          { emoji: '🍔', text: 'Ana yemek menüsü de (özellikle burgerleri) kahvesi kadar popüler.' },
        ],
      },
    ],
  },
  {
    title: 'En İyi Islama Köfteci',
    places: [
      {
        name: 'Eker Lokantası (Adapazarı)',
        image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Sakarya\'nın imzası olan Islama Köfte\'yi yemek için gidilmesi gereken en meşhur, en tarihi ve en iyi yer. Bir efsane.',
        googleRating: 4.4,
        reviewCount: '4.8k',
        orderSuggestion: 'Islama Köfte, Piyaz ve Kabak Tatlısı',
        notes: [
          { emoji: '🚗', text: 'Sapanca\'dan 15 dakikalık bir araba yolculuğunu kesinlikle hak ediyor. Burası bir klasik.' },
          { emoji: '🍞', text: 'Islama köftenin sırrı, kemik suyuna batırılmış ve ızgarada kızartılmış o özel ekmeklerde.' },
          { emoji: '🎃', text: 'Yemeğin üstüne mutlaka meşhur kaymaklı ve cevizli kabak tatlılarından yemelisiniz.' },
        ],
      },
      {
        name: 'Köfteci Hacı Bekir (Adapazarı)',
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: '1970\'lerden beri hizmet veren, Adapazarı\'nın en eski ve otantik köftecilerinden biri. Eker kadar popüler ama daha salaş ve yerel.',
        googleRating: 4.5,
        reviewCount: '1.9k',
        orderSuggestion: 'Islama Köfte ve Ev Yapımı Ayran',
        notes: [
          { emoji: '🔥', text: 'Kömür ateşinde pişen köftenin lezzeti ve ekmeğin ıslaklığı tam kıvamında.' },
          { emoji: '👨‍🍳', text: 'Dekorasyon değil, lezzet arayanların adresi. Tam bir esnaf lokantası klasiği.' },
          { emoji: '🌶️', text: 'Masaya gelen acı biber turşusu ve piyazı da köfte kadar meşhur.' },
        ],
      },
      {
        name: 'Meşhur Köfteci Mustafa (Adapazarı)',
        image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Adapazarı\'nda Islama Köfte denince Eker ile birlikte adı anılan diğer büyük usta. Daha modern bir dükkanı var ama lezzeti geleneksel.',
        googleRating: 4.3,
        reviewCount: '2.5k',
        orderSuggestion: 'Porsiyon Islama Köfte ve Şıra',
        notes: [
          { emoji: '✨', text: 'Eker\'e göre bir tık daha az yağlı bulanlar var. Damak zevkine göre tercih edilebilir.' },
          { emoji: '💯', text: 'Porsiyonlar çok doyurucu ve servis hızlı. Öğle yemeği için mükemmel.' },
          { emoji: '🍇', text: 'Yanında ev yapımı üzüm şırası istemeyi unutmayın, köfteyle harika gidiyor.' },
        ],
      },
    ],
  },
];
