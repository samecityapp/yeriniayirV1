import { RestaurantCategory } from '@/lib/types';

export const kapadokyaPlaces: RestaurantCategory[] = [
  {
    title: 'En İyi Serpme Kahvaltı',
    places: [
      {
        name: 'Goreme Han Restaurant',
        image: 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Tarihi bir konağın avlusunda, otantik bir atmosferde, inanılmaz zengin bir serpme kahvaltı. Tam bir "anne kahvaltısı" hissi veriyor.',
        googleRating: 4.7,
        reviewCount: '2.2k',
        orderSuggestion: 'Serpme Kahvaltı (ve Menemen)',
        notes: [
          { emoji: '🧀', text: 'Peynir çeşitleri, ev yapımı reçelleri ve sahanda yumurtasıyla hem gözü hem karnı doyuruyor.' },
          { emoji: '🌿', text: 'Avlusu çok keyifli ve serin. Güne kalabalıktan uzakta, huzurlu başlamak için mükemmel.' },
          { emoji: '💰', text: 'Bölgedeki birçok yere göre fiyat/performans oranı çok yüksek. Bu kalitede bir kahvaltı için harika.' },
        ],
      },
      {
        name: 'Viewpoint Sunset Cafe',
        image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Adı üstünde, Göreme\'yi ve vadileri tepeden gören, belki de bölgenin en iyi manzaralı kahvaltı noktası. Balonları izlemek için de ideal.',
        googleRating: 4.7,
        reviewCount: '3.1k',
        orderSuggestion: 'Serpme Kahvaltı (Manzara Eşliğinde)',
        notes: [
          { emoji: '🎈', text: 'Sabahın çok erken saatlerinde giderseniz, balonların kalkışını buradan kahve eşliğinde izleyebilirsiniz.' },
          { emoji: '📸', text: 'Terası tam bir fotoğraf çekim platosu. Kahvaltıdan çok manzarası için bile gelinir.' },
          { emoji: '🍳', text: 'Sundukları serpme kahvaltı hem çeşitli hem de lezzetli. Manzara ile birleşince unutulmaz oluyor.' },
        ],
      },
      {
        name: 'Tandır Cafe Restaurant',
        image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Göreme\'de, güler yüzlü bir aile işletmesi. Odun ateşinde pişen taze ekmekleri ve otantik sunumlarıyla biliniyorlar.',
        googleRating: 4.8,
        reviewCount: '1.4k',
        orderSuggestion: 'Köy Kahvaltısı Tabağı',
        notes: [
          { emoji: '🍞', text: 'Odun fırınından çıkan sıcacık, balon pideye bayıldık. Kahvaltının yıldızı o.' },
          { emoji: '👨‍🍳', text: 'İşletme sahibi çok ilgili ve samimi. Kendinizi evinizde gibi hissediyorsunuz.' },
          { emoji: '🏺', text: 'Akşam yemeği için Testi Kebabı da çok başarılı, kahvaltısına gelip akşam için rezervasyon yaptıran çok.' },
        ],
      },
    ],
  },
  {
    title: 'En İyi Yöresel / Testi Kebabı',
    places: [
      {
        name: 'Dibek (Göreme)',
        image: 'https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Kapadokya\'da "Testi Kebabı" denince akla gelen ilk, en otantik ve en meşhur yer. Yere kurulu masaları ve atmosferiyle tam bir mağara deneyimi.',
        googleRating: 4.5,
        reviewCount: '4.8k',
        orderSuggestion: 'Testi Kebabı (Kuzu veya Dana)',
        notes: [
          { emoji: '⚠️', text: 'REZERVASYON ŞART! Testi kebabı yavaş piştiği için gitmeden 3-4 saat önce arayıp siparişinizi vermeniz gerekiyor.' },
          { emoji: '🏺', text: 'Kebabın masanızda, sizin önünüzde kırılma seremonisi deneyimin en güzel parçası.' },
          { emoji: '🧎', text: 'Yerdeki minderlerde (şark köşesi) oturarak yemek yiyorsunuz, bu da ortama otantik bir hava katıyor.' },
        ],
      },
      {
        name: 'Topdeck Cave Restaurant (Göreme)',
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Küçük, samimi ve bir aile tarafından işletilen gizli bir gurme durağı. Geleneksel Anadolu yemeklerini modern bir dokunuşla sunuyorlar.',
        googleRating: 4.8,
        reviewCount: '2.5k',
        orderSuggestion: 'Kuzu İncik veya Günün Meze Tabağı',
        notes: [
          { emoji: '🤫', text: 'Burası GNK\'nın gizli tavsiyesidir. Çok az masası var, bu yüzden tur otobüslerinin uğradığı bir yer değil. Tam bir sığınak.' },
          { emoji: '🐑', text: 'Kuzu incikleri lokum gibi dağılıyor. Testi kebabına harika bir alternatif.' },
          { emoji: '📅', text: 'Mutlaka ama mutlaka rezervasyon yaptırın, kapıdan dönme ihtimaliniz çok yüksek.' },
        ],
      },
      {
        name: 'Seten Restaurant (Göreme)',
        image: 'https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Sultan Cave Suites otelin içinde yer alan, lüks ve şık bir Anadolu mutfağı. Mağara atmosferini "fine dining" ile birleştirmek isteyenler için ideal.',
        googleRating: 4.6,
        reviewCount: '1.9k',
        orderSuggestion: 'Testi Kebabı veya Kuru Patlıcan Dolması',
        notes: [
          { emoji: '✨', text: 'Dibek\'ten daha lüks ve rafine bir Testi Kebabı deneyimi sunar. Atmosfer çok şık.' },
          { emoji: '🍷', text: 'Kendi şarap kavları (wine cellar) var. Yemeğinize eşlik edecek harika yerel şaraplar tavsiye ediyorlar.' },
          { emoji: '💑', text: 'Romantik bir akşam yemeği için Kapadokya\'daki en iyi seçeneklerden biri.' },
        ],
      },
    ],
  },
  {
    title: 'En Şık Akşam Yemeği',
    places: [
      {
        name: 'Lil\'a Restaurant (Uçhisar - Museum Hotel)',
        image: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Türkiye\'nin tek Relais & Châteaux oteli olan Museum Hotel\'in içinde, Michelin Yeşil Yıldızlı bir restoran. Nefes kesen vadi manzarası ve gurme lezzetler.',
        googleRating: 4.8,
        reviewCount: '700',
        orderSuggestion: 'Tadım Menüsü veya Dana Kaburga',
        notes: [
          { emoji: '🌟', text: 'Burası bir yemekten fazlası, bir gastronomi deneyimi. Michelin yıldızını sonuna kadar hak ediyor.' },
          { emoji: '💎', text: 'Özel bir kutlama veya evlilik teklifi gibi anlar için Kapadokya\'daki zirve nokta. Fiyatlar bu kaliteye göre ayarlanmış.' },
          { emoji: '🌅', text: 'Gün batımı için rezervasyon yaptırmaya çalışın. Vadiye karşı manzarası büyüleyici.' },
        ],
      },
      {
        name: 'Seki Restaurant (Uçhisar - Argos in Cappadocia)',
        image: 'https://images.pexels.com/photos/1907228/pexels-photo-1907228.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Argos in Cappadocia otelin içinde, Güvercinlik Vadisi\'ne bakan, devasa bir yer altı şarap kavına sahip, şık ve modern bir restoran.',
        googleRating: 4.6,
        reviewCount: '1.1k',
        orderSuggestion: 'Ördek veya Kendi Kavlarından Bir Şarap',
        notes: [
          { emoji: '🍇', text: 'Restoranın altındaki "Sekzen" adlı devasa yer altı kavını mutlaka gezin. Binlerce şişe şarap var.' },
          { emoji: '🦆', text: 'Menüleri modern ve uluslararası. Ördek gibi imza yemekleri çok başarılı.' },
          { emoji: '✨', text: 'Lüks, sakin ve sofistike bir atmosfer arayanlar için mükemmel bir seçim.' },
        ],
      },
      {
        name: 'Haruna Restaurant (Göreme)',
        image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Göreme\'nin tam merkezinde, vadiye tepeden bakan, harika bir gün batımı manzarasına sahip yeni nesil, popüler ve çok şık bir mekan.',
        googleRating: 4.7,
        reviewCount: '1.5k',
        orderSuggestion: 'Kokteyller ve Asya Mutfağından Seçkiler',
        notes: [
          { emoji: '🌇', text: 'Gün batımını izlemek için Göreme\'deki en popüler ve en "Instagrammable" yer. Terası harika.' },
          { emoji: '🍸', text: 'Sadece yemek için değil, imza kokteyllerini içmek için de gidilir. Çok yaratıcılar.' },
          { emoji: '🍣', text: 'Menüsü Testi Kebabı\'ndan Sushi\'ye kadar uzanıyor, bu da kalabalık gruplar için ideal olmasını sağlıyor.' },
        ],
      },
    ],
  },
  {
    title: 'En İyi Kahve & Tatlı',
    places: [
      {
        name: 'Coffeedocia (Göreme)',
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Göreme\'nin merkezindeki en popüler "üçüncü nesil" kahveci. Hem yerli hem yabancı turistlerin buluşma noktası. Modern ve rahat bir atmosfere sahip.',
        googleRating: 4.5,
        reviewCount: '2.3k',
        orderSuggestion: 'Cortado veya San Sebastian Cheesecake',
        notes: [
          { emoji: '☕', text: 'Bölgede nitelikli ve doğru demlenmiş bir kahve içmek için en güvenilir adres.' },
          { emoji: '🍰', text: 'Meşhur San Sebastian Cheesecake\'leri çok kremamsı ve lezzetli, kahvenin yanına harika gidiyor.' },
          { emoji: '💻', text: 'Geniş alanı ve hızlı internetiyle laptop\'unu alıp çalışmak isteyenler için de çok uygun.' },
        ],
      },
      {
        name: 'Cafe Safak (Göreme)',
        image: 'https://images.pexels.com/photos/4350099/pexels-photo-4350099.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Büyük ve modern kafelerin aksine, küçük, samimi, bir aile işletmesi. Kaliteli kahveleri ve ev yapımı tatlılarıyla biliniyor.',
        googleRating: 4.6,
        reviewCount: '950',
        orderSuggestion: 'Türk Kahvesi ve Ev Yapımı Baklava',
        notes: [
          { emoji: '👨‍🍳', text: 'İşletme sahibi çok tatlı ve misafirperver, size evinizde hissettiriyor.' },
          { emoji: '🥧', text: 'Ev yapımı elmalı turta ve baklavaları çok taze ve lezzetli.' },
          { emoji: '🤫', text: 'Kalabalıktan uzakta, sakin bir kahve molası vermek için ideal, samimi bir durak.' },
        ],
      },
      {
        name: 'K\'ai Cafe (Uçhisar - Argos in Cappadocia)',
        image: 'https://images.pexels.com/photos/1120970/pexels-photo-1120970.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Argos otelin içinde yer alan, vadiye bakan terasıyla, lüks ve sakin bir kahve & tatlı molası için mükemmel bir nokta.',
        googleRating: 4.7,
        reviewCount: '300',
        orderSuggestion: 'Affogato veya Özel Bitki Çayları',
        notes: [
          { emoji: '💎', text: 'Lüks bir otelin parçası olmasına rağmen dışarıdan misafirlere açık, şık bir kafe.' },
          { emoji: '🍮', text: 'Tatlıları ve sunumları "fine dining" restoran kalitesinde, çok rafine.' },
          { emoji: '🌄', text: 'Manzarası Uçhisar\'ın en güzellerinden. Sırf o manzaraya karşı bir kahve içmek için bile gelinir.' },
        ],
      },
    ],
  },
  {
    title: 'En İyi Şarap Evleri',
    places: [
      {
        name: 'Turasan Şarap Fabrikası (Ürgüp)',
        image: 'https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Kapadokya şarapçılığının en köklü ve en bilinen ismi. Hem fabrika satış mağazası hem de tadım alanı olarak hizmet veriyorlar.',
        googleRating: 4.4,
        reviewCount: '3.3k',
        orderSuggestion: 'Emir (Beyaz) ve Öküzgözü (Kırmızı) Tadımı',
        notes: [
          { emoji: '🍇', text: 'Bölgenin imzası olan "Emir" üzümünden yapılan beyaz şaraplarını mutlaka deneyin. Çok karakteristik.' },
          { emoji: '💰', text: 'Tadım ücretleri çok makul ve şişe fiyatları marketlere göre daha uygun.' },
          { emoji: '🏭', text: 'Burası bir bağ değil, büyük bir üretim tesisi ve satış mağazası. Hızlı bir tadım ve alışveriş için ideal.' },
        ],
      },
      {
        name: 'Kocabağ Şarapları (Uçhisar)',
        image: 'https://images.pexels.com/photos/1657849/pexels-photo-1657849.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Bölgenin diğer büyük ve köklü üreticisi. Uçhisar\'da, kayaya oyulmuş muhteşem bir yer altı kavına (mahzen) sahipler.',
        googleRating: 4.7,
        reviewCount: '1.4k',
        orderSuggestion: 'Kocabağ K (Kırmızı) veya Kof (Beyaz)',
        notes: [
          { emoji: '🦇', text: 'Kayaya oyulmuş yer altı mahzenlerini gezmek harika bir deneyim. Atmosfer çok etkileyici.' },
          { emoji: '🏆', text: 'Ödüllü şarapları var ve tadım konusunda çok cömert ve bilgilendiriciler.' },
          { emoji: '🤫', text: 'Turasan kadar kalabalık değil, daha butik ve kişisel bir tadım deneyimi sunuyorlar.' },
        ],
      },
      {
        name: 'Mahzen Şarap Evi (Ürgüp)',
        image: 'https://images.pexels.com/photos/1850629/pexels-photo-1850629.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Bir üretici değil, Ürgüp merkezde, kayaya oyulmuş bir mağara içinde çeşitli yerel şarapları tadabileceğiniz otantik bir şarap barı.',
        googleRating: 4.6,
        reviewCount: '1.2k',
        orderSuggestion: 'Yerel Şarap Tadım Tabağı',
        notes: [
          { emoji: '🕯️', text: 'Akşamları loş ışıklandırması ve mağara ortamıyla çok romantik ve keyifli bir atmosferi var.' },
          { emoji: '🧀', text: 'Şarabınızın yanına zengin bir yerel peynir tabağı söylemeyi unutmayın.' },
          { emoji: '🔥', text: 'Kış aylarında içeride yanan şömine ortamı daha da ısıtıyor. Tam bir GNK mekanı.' },
        ],
      },
    ],
  },
];
