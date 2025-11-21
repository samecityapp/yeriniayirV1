import { RestaurantCategory } from '@/lib/types';

export const antalyaPlaces: RestaurantCategory[] = [
  {
    title: 'En İyi Kahvaltı',
    places: [
      {
        name: 'Seraser Fine Dining Restaurant (Kaleiçi)',
        image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Genellikle akşam yemeğiyle bilinse de, Kaleiçi\'nin tarihi ve büyüleyici avlusunda sunduğu serpme kahvaltı, Antalya\'nın en şık ve en özel deneyimlerinden biridir.',
        googleRating: 4.7,
        reviewCount: '2.1k',
        orderSuggestion: 'Serpme Kahvaltı (Tarihi Avluda)',
        notes: [
          { emoji: '🏛️', text: '18. yüzyıldan kalma bir konağın avlusunda, kuş sesleri eşliğinde kahvaltı yapıyorsunuz. Atmosfer 10/10.' },
          { emoji: '🍓', text: 'Standart kahvaltılıklardan çok daha fazlası; kaliteli peynirler, özel reçeller ve şık sunumlar var.' },
          { emoji: '🤫', text: 'Kalabalıktan kaçmak ve güne lüks bir başlangıç yapmak için mükemmel bir nokta. Rezervasyon önerilir.' },
        ],
      },
      {
        name: 'Big Man (Lara & Konyaaltı)',
        image: 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Antalya\'nın birçok noktasında şubesi olan, özellikle falezlerin üzerindeki muhteşem deniz manzaralı Lara şubesiyle ünlü, zengin menülü bir klasik.',
        googleRating: 4.4,
        reviewCount: '6.3k',
        orderSuggestion: 'Big Man Serpme Kahvaltı',
        notes: [
          { emoji: '🌊', text: 'Lara\'daki şubesinde, falezlerin hemen kenarındaki masalardan birini kapmaya çalışın. Manzara nefes kesici.' },
          { emoji: '🥞', text: 'Sadece serpme kahvaltı değil, pancake, omlet gibi A la carte seçenekleri de çok başarılı.' },
          { emoji: '👨‍👩‍👧', text: 'Geniş alanı ve menüsü sayesinde çocuklu aileler ve kalabalık gruplar için çok popüler ve güvenli bir seçimdir.' },
        ],
      },
      {
        name: 'Van Kahvaltı Evi (Konyaaltı)',
        image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Antalya\'da "gerçek Van kahvaltısı" denince akla gelen ilk, en otantik ve en meşhur mekan. Her zaman kalabalık, her zaman lezzetli.',
        googleRating: 4.3,
        reviewCount: '4.1k',
        orderSuggestion: 'Serpme Van Kahvaltısı (ve Kavut)',
        notes: [
          { emoji: '🍯', text: 'Bal-kaymak, otlu peynir, murtuğa ve kavut gibi Van\'a özgü lezzetleri tatmak için en doğru adres.' },
          { emoji: '🍳', text: 'Sıcak olarak gelen "kavurmalı yumurta" veya "sucuklu yumurta" porsiyonları çok doyurucu.' },
          { emoji: '⚠️', text: 'Hafta sonları inanılmaz bir kuyruk oluyor. Ya hafta içi gidin ya da sabah çok erken saatte orada olun.' },
        ],
      },
    ],
  },
  {
    title: 'En İyi Yöresel (Piyaz & Döner)',
    places: [
      {
        name: 'Piyazcı Ahmet',
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Antalya\'nın imzası olan "Tahinli Piyaz"ı yemek için gidilecek en meşhur ve en iyi yerlerden biri. Bir turistik noktadan çok bir lezzet mabedi.',
        googleRating: 4.4,
        reviewCount: '5.4k',
        orderSuggestion: 'Piyaz, Köfte ve Kabak Tatlısı',
        notes: [
          { emoji: '🫘', text: 'Piyazın üzerindeki tahin sosu, yumurtası ve domatesiyle, bildiğiniz piyazlardan çok farklı ve çok daha lezzetli.' },
          { emoji: '🥩', text: 'Köftesi de piyazına eşlik eden en iyi lezzet. İkisi bir bütün olarak sipariş edilmeli.' },
          { emoji: '🎃', text: 'Yemeğin üzerine mutlaka, yine tahinli ve cevizli olan meşhur Antalya usulü kabak tatlısından yiyin.' },
        ],
      },
      {
        name: 'Meşhur Aksu Köftecisi (Şimşek Köfte)',
        image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Antalya-Alanya yolu üzerinde, Aksu\'da bulunan bir başka efsane. "Aksu usulü" piyazı ve ızgara köftesiyle ünlenmiş, hızlı ve lezzetli bir durak.',
        googleRating: 4.5,
        reviewCount: '4.7k',
        orderSuggestion: 'Porsiyon Köfte ve Piyaz',
        notes: [
          { emoji: '🌶️', text: 'Piyazı, Piyazcı Ahmet\'e göre daha sirkeli ve daha az tahinlidir. İkisi farklı ekollerdir, ikisi de denenmeli.' },
          { emoji: '⚡', text: 'Servis inanılmaz hızlıdır, tam bir esnaf lokantası mantığında çalışır.' },
          { emoji: '🚗', text: 'Havaalanına çok yakın. Antalya\'ya iner inmez veya dönmeden önce son bir lezzet molası için mükemmel konumda.' },
        ],
      },
      {
        name: 'Dönerci Hakkı Baba (Kaleiçi)',
        image: 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Kaleiçi\'nin turistik kalabalığının içinde, yerellerin bildiği gizli bir dönerci. Odun ateşinde pişen, yaprak yaprak kesilen gerçek bir döner klasiği.',
        googleRating: 4.7,
        reviewCount: '2.2k',
        orderSuggestion: 'Porsiyon Döner (Lavaşı Ayrı İsteyin)',
        notes: [
          { emoji: '🔥', text: 'Odun ateşinde pişen etin lezzeti ve kokusu harika. Döner %100 kuzu etindendir.' },
          { emoji: '🤫', text: 'Turistlerin çoğu bilmez, daha çok Kaleiçi esnafının ve yerellerin tercihidir. Tam bir GNK "içeriden bilgi" mekanı.' },
          { emoji: '🕒', text: 'Çok popüler olduğu için döneri öğleden sonra 3-4 gibi bitebiliyor, geçe kalmayın.' },
        ],
      },
    ],
  },
  {
    title: 'En İyi Balık & Meze',
    places: [
      {
        name: 'Arma Restaurant (Kaleiçi Marina)',
        image: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Eski İtalyan konsolosluk binasında, tarihi Kaleiçi Yat Limanı\'na ve Beydağları\'na bakan, muhteşem manzaralı, şık bir Akdeniz restoranı.',
        googleRating: 4.5,
        reviewCount: '3.1k',
        orderSuggestion: 'Deniz Mahsullü Paella veya Izgara Lagos',
        notes: [
          { emoji: '🌅', text: 'Gün batımını ve marinanın ışıklarını izlemek için Antalya\'daki en romantik ve en iyi manzaralı yer.' },
          { emoji: '🥂', text: 'Özel bir kutlama, yıl dönümü veya iş yemeği için Antalya\'nın en prestijli mekanlarından biridir.' },
          { emoji: '⚠️', text: 'Manzaralı kenar masalar için günler öncesinden rezervasyon yaptırmanız şart.' },
        ],
      },
      {
        name: 'Lara Balık Evi',
        image: 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Antalya\'nın en bilinen ve en güvenilir balık restoranlarından biri. Taptaze ve çok çeşitli meze dolabı ile balık tezgahıyla ünlü.',
        googleRating: 4.4,
        reviewCount: '5.8k',
        orderSuggestion: 'Levrek Marin, Karides Güveç ve Atom',
        notes: [
          { emoji: '👌', text: 'Meze dolabı o kadar zengin ki, sadece mezelerle bile doyabilirsiniz. Hepsi taze ve lezzetli.' },
          { emoji: '👨‍👩‍👧', text: 'Çocuk oyun alanı olması, burayı çocuklu aileler için de harika bir balıkçı yapıyor.' },
          { emoji: '🐟', text: 'Balığınızı tezgahtan görerek ve tarttırarak seçiyorsunuz, bu da tazelik konusunda güven veriyor.' },
        ],
      },
      {
        name: 'Kaleiçi Marina Restaurant',
        image: 'https://images.pexels.com/photos/1907228/pexels-photo-1907228.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Adı üstünde, yat limanının tam içinde, teknelere karşı rakı-balık keyfi yapmak için en otantik ve keyifli yerlerden biri.',
        googleRating: 4.6,
        reviewCount: '4.5k',
        orderSuggestion: 'Kalamar Tava ve Günün Taze Balığı',
        notes: [
          { emoji: '⛵', text: 'Yatların hemen yanında, denize bu kadar yakın yemek yemek çok keyifli. Ortam çok canlı.' },
          { emoji: ' Kalamar', text: 'Kalamarı hem taze hem de çok başarılı pişiriliyor, çıtır ve yumuşacık.' },
          { emoji: '✨', text: 'Arma\'ya göre bir tık daha samimi ve klasik bir meyhane/balıkçı atmosferine sahip.' },
        ],
      },
    ],
  },
  {
    title: 'En Şık Akşam Yemeği',
    places: [
      {
        name: '7 Mehmet',
        image: 'https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Sadece Antalya\'nın değil, Türkiye\'nin en önemli restoranlarından biri. 3 nesildir devam eden, geleneksel Türk mutfağını modern ve kusursuz bir şekilde yorumlayan bir efsane.',
        googleRating: 4.5,
        reviewCount: '11.2k',
        orderSuggestion: 'Kuzu Tandır, Bademli İç Pilav ve Hibeş',
        notes: [
          { emoji: '🐑', text: 'Kuzu Tandırları ve Bademli İç Pilavları, bu mekanın imza yemeğidir. Mutlaka denenmeli.' },
          { emoji: '🎃', text: 'Yemeğin üzerine yiyeceğiniz "Kabak Tatlısı" bile başlı başına bir gurme deneyimidir.' },
          { emoji: '💎', text: 'Burası bir "fine dining" deneyimidir. Fiyatlar yüksektir ancak sunulan kalite, servis ve lezzet bu bedele değer.' },
        ],
      },
      {
        name: 'Seraser Fine Dining Restaurant (Kaleiçi)',
        image: 'https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Tarihi bir konakta, romantik bir avluda, piyano eşliğinde uluslararası mutfaktan seçkiler sunan, Antalya\'nın en şık ve en romantik mekanı.',
        googleRating: 4.7,
        reviewCount: '2.1k',
        orderSuggestion: 'Deniz Tarağı veya Dana Yanağı',
        notes: [
          { emoji: '🕯️', text: 'Özel bir kutlama veya çok romantik bir akşam yemeği için Antalya\'daki bir numaralı tercih.' },
          { emoji: '🎹', text: 'Akşamları çalan canlı piyano, ortamın büyüsünü kat kat artırıyor.' },
          { emoji: '🍷', text: 'Çok zengin bir şarap kavları var. Yemeğinize uygun şarap seçimi için sommelier\'den yardım isteyebilirsiniz.' },
        ],
      },
      {
        name: 'Vahap Usta Et Restaurant (Lara)',
        image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Antalya\'da lüks bir "steakhouse" deneyimi arayanlar için en doğru adres. Et şovları, zengin sunumları ve kaliteli etleriyle biliniyor.',
        googleRating: 4.6,
        reviewCount: '6.9k',
        orderSuggestion: 'Lokum veya Kuzu Kafes',
        notes: [
          { emoji: '🥩', text: 'Etlerin sunumu ve masada yapılan şovlar (alevli vb.) deneyimin bir parçası.' },
          { emoji: '✨', text: 'Modern ve şık bir dekorasyonu var, atmosferi oldukça canlı ve popüler.' },
          { emoji: ' Baklava', text: 'Yemekten sonra ikram ettikleri "fıstıklı havuç dilim baklava" ve semaverde çay klasiktir.' },
        ],
      },
    ],
  },
  {
    title: 'En İyi Kahve & Tatlı',
    places: [
      {
        name: 'The Sudd Coffee (Konyaaltı & Lara)',
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Antalya\'nın kendi yerel "üçüncü nesil" kahve kavurucusu. Nitelikli kahve ve modern bir kafe ortamı arayanlar için şehrin en iyisi.',
        googleRating: 4.5,
        reviewCount: '2k',
        orderSuggestion: 'V60 Demleme veya Cortado',
        notes: [
          { emoji: '☕', text: 'Kahve çekirdeklerini kendileri kavuruyorlar, baristaları bilgili ve kahveleri çok lezzetli.' },
          { emoji: '💻', text: 'Laptop ile çalışmak veya arkadaşlarla buluşmak için popüler ve modern bir atmosfere sahip.' },
          { emoji: '🥐', text: 'Yanında sundukları kruvasan ve San Sebastian Cheesecake de çok seviliyor.' },
        ],
      },
      {
        name: 'Akra Patisserie (Akra Hotel)',
        image: 'https://images.pexels.com/photos/1120970/pexels-photo-1120970.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Lüks Akra Otel\'in içinde yer alan, adeta bir mücevher dükkanını andıran, dünya standartlarında tatlılar üreten bir pastane.',
        googleRating: 4.8,
        reviewCount: '900',
        orderSuggestion: 'Tek Pastalar (Örn: Çarkıfelekli veya Fıstıklı)',
        notes: [
          { emoji: '💎', text: 'Her bir pasta, bir sanat eseri gibi tasarlanmış. Antalya\'daki en "premium" tatlı deneyimi.' },
          { emoji: '💰', text: 'Fiyatlar yüksek ancak kullanılan malzeme kalitesi (Valrhona çikolata vb.) ve lezzet farkı hissediliyor.' },
          { emoji: '🎁', text: 'Özel bir kutlama veya hediye için pasta/çikolata almak için en doğru adres.' },
        ],
      },
      {
        name: 'Börekçi Tevfik (Merkez)',
        image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: '1930\'dan beri hizmet veren, Antalya\'nın en tarihi ve en meşhur börekçisi. Burası bir kafe değil, bir lezzet mirası. "Serpme Böreği" ile ünlü.',
        googleRating: 4.7,
        reviewCount: '3.4k',
        orderSuggestion: 'Serpme Börek (Kıymalı veya Peynirli)',
        notes: [
          { emoji: '🔥', text: 'Böreğin çıtırtısı ve iç harcının lezzeti inanılmaz. Kömür ateşinde pişiyor.' },
          { emoji: '🤫', text: 'Bu bir GNK "içeriden bilgi" hazinesidir. Tatlı değil, en iyi yerel lezzet deneyimlerinden biridir.' },
          { emoji: '🕒', text: 'Öğlen saatlerine kalmadan börek bitiyor. Mutlaka sabah saatlerinde gitmeniz gerekiyor.' },
        ],
      },
    ],
  },
];
