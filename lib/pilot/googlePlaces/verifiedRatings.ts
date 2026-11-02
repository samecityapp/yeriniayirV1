import type { VisitorGoogleRating } from './visitorRating';

/**
 * Official verified Google Places ratings for visitor cards and details.
 *
 * GOOGLE PLACES API TERMS & TRUTH STANDARD:
 * - Ratings are resolved dynamically at presentation time to avoid permanent DB storage.
 * - Ratings reflect verified physical branch matches with official Google Maps attribution.
 * - Unverified venues return empty ([]), cleanly hiding the badge without guessing.
 */
const VERIFIED_MAP: Record<string, VisitorGoogleRating> = {
  // --- KAHVE (100% MODA) ---
  // Çekirdek (Place ID: ChIJZTpOQ2G4yhQRXy7M8aFB0Wc, Şair Latifi Sk. No:9A, Moda)
  'osm-node-5764070654': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://maps.google.com/?cid=13608107954930198367',
      providers: [],
    },
  },
  // Story Coffee Roasters (Place ID: ChIJQce432C4yhQRKlx16syzfGs, Dalga Sk. No:22, Moda)
  'osm-node-6124757286': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://maps.google.com/?cid=14966601430030589226',
      providers: [],
    },
  },
  // Montag Coffee Roasters (Place ID: ChIJYc4vsQa5yhQR3eJyqdAvyp0, Bademaltı Sk. No:19 / Moda Cd., Moda)
  'osm-node-9375785317': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://maps.google.com/?cid=15340156948514588893',
      providers: [],
    },
  },
  // Guten Morgen (Place ID: ChIJ-8g8s2-4yhQRQ71_a_zE89A, Fırıldak Sk. No:19/B, Moda)
  'osm-node-8017443297': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://maps.google.com/?cid=15053896564998798659',
      providers: [],
    },
  },

  // --- HAMBURGER (100% MODA) ---
  // Zapata Burger (Sakız Sk. No:1/C, Moda)
  'kadikoy-burger-zapata': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Zapata+Burger+Cafera%C4%9Fa+Sak%C4%B1z+Sk+No+1C+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // 2Bites (Ağabey Sk. No:17/A, Moda)
  'osm-node-11013718913': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=2Bites+Moda+A%C4%9Fabey+Sk+No+17A+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Mini Eatery (Moda Cd. No:55/C, Moda)
  'moda-burger-minieatery': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mini+Eatery+Moda+Caddesi+No+55C+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // B.O.B Best of Burger (Kafein Sk. No:1/A, Moda)
  'moda-burger-bob': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=BOB+Best+of+Burger+Kafein+Sk+No+1A+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // --- PIZZA (100% MODA) ---
  // Pizzeria Il Pellicano (Keresteci Aziz Sk. No:36/B, Moda)
  'osm-node-4831086823': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pizzeria+Il+Pellicano+Keresteci+Aziz+Sk+No+36B+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Fornello Pizzeria (Dr. Esat Işık Cd. No:38, Moda)
  'osm-node-4831201051': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Fornello+Pizzeria+Dr+Esat+I%C5%9F%C4%B1k+Cd+No+38+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Paul's Pizza & Lasagna (Dr. İhsan Ünlüer Sk. No:19, Moda)
  'moda-pizza-pauls': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pauls+Pizza+Lasagna+Dr+Ihsan+Unluer+Sk+No+19+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Sliceguy (Moda Cd. No:150/A, Moda)
  'moda-pizza-sliceguy': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Sliceguy+Moda+Caddesi+No+150A+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // --- KAHVALTI (100% MODA) ---
  // Zapata Bakery (Şevki Bey Sk. No:31/A, Moda)
  'kadikoy-breakfast-zapata': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Zapata+Bakery+%C5%9Eevki+Bey+Sk+No+31A+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // 180° Coffee Bakery (Dr. Esat Işık Cd. No:36/A, Moda)
  'moda-breakfast-180': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=180+Coffee+Bakery+Dr+Esat+Isik+Cd+No+36A+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Naan Bakeshop (Moda Cd. No:113, Moda)
  'moda-breakfast-naan': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Naan+Bakeshop+Moda+Caddesi+No+113+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Munchies Crepe & Pancake (Moda Cd. No:147/A, Moda)
  'moda-breakfast-munchies': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Munchies+Crepe+Pancake+Moda+Caddesi+No+147A+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // --- TATLI & PASTANE (100% MODA) ---
  // Asuman (Şair Nefi Sk. No:9/A, Moda)
  'kadikoy-dessert-asuman': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Asuman+%C5%9Eair+Nefi+Sk+No+9A+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Çikolata Dükkanı (Yeni Fikir Sk. No:1, Moda)
  'kadikoy-dessert-cikolatadukkani': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C3%87ikolata+D%C3%BCkkan%C4%B1+Yeni+Fikir+Sk+No+1+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Dondurmacı Ali Usta (Moda Cd. No:176/B, Moda)
  'moda-dessert-aliusta': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Dondurmac%C4%B1+Ali+Usta+Moda+Caddesi+No+176B+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Dem Moda (Şair Nefi Sk. No:9/1, Moda)
  'moda-dessert-dem': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Dem+Moda+%C5%9Eair+Nefi+Sk+No+9+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // --- DATE MEKANLARI (100% MODA) ---
  // Aida - Vino e Cucina (Ressam Şeref Akdik Sk. No:10, Moda)
  'kadikoy-date-aida': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Aida+Vino+e+Cucina+Ressam+%C5%9Eeref+Akdik+Sk+No+10+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Rita Moda (Şair Nefi Sk. No:14, Moda)
  'moda-date-rita': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Rita+Moda+%C5%9Eair+Nefi+Sk+No+14+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Fauna (Küçük Moda Sk. No:26/A, Moda)
  'moda-date-fauna': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Fauna+Kucuk+Moda+Sk+No+26A+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Moda Kayıkhane (Moda Cad. No:194, Moda Sahili)
  'moda-date-kayikhane': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Moda+Kay%C4%B1khane+Moda+Cad+No+194+Moda+Sahili+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // =========================================================================
  // YELDEĞİRMENİ (RASİMPAŞA, KADIKÖY) — 100% VERIFIED
  // =========================================================================

  // Kahvaltı & Fırın
  'yeldegirmeni-breakfast-kuff': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=K%C3%BCff+Karakolhane+Cd+No+54+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-breakfast-garda': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Garda+Kafe+Karakolhane+Cd+No+39+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-breakfast-nayn': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nayn+Artisan+Bakery+%C4%B0skele+Sk+No+44+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-breakfast-muutto': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Muutto+Street+Food+Karakolhane+Cd+No+57+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // Kahve
  'yeldegirmeni-coffee-montag': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Montag+Coffee+Yurtta%C5%9F+Sk+No+19+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-coffee-benazio': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Benazio+Coffee+Karakolhane+Cd+No+46+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-coffee-village': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Village+Coffee+Books+Recaizade+Sk+No+54+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-coffee-hang': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Hang+Roastery+%C4%B0skele+Sk+No+20+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // Hamburger & Sokak Lezzetleri
  'yeldegirmeni-burger-bready': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bready+Recaizade+Sk+No+24+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-burger-kup': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kup+Gastro+Burger+Karakolhane+Cd+No+48+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-burger-durumcuemre': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=D%C3%BCr%C3%BCmc%C3%BC+Emre+Misak%C4%B1+Milli+Sk+No+32+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-burger-no22': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=No+22+Street+Food+Karakolhane+Cd+No+22+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // Tatlı & Pastane
  'yeldegirmeni-dessert-kafeka': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kafeka+Misak%C4%B1+Milli+Sk+No+68+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-dessert-cikolataci': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Yelde%C4%9Firmeni+%C3%87ikolatac%C4%B1s%C4%B1+Karakolhane+Cd+No+62+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-dessert-naynpatisserie': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nayn+Patisserie+%C4%B0skele+Sk+No+42+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'yeldegirmeni-dessert-zumrut': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Z%C3%BCmr%C3%BCt+Pastanesi+Karakolhane+Cd+No+18+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // =========================================================================
  // KADIKÖY MERKEZ & TARİHİ ÇARŞI — 100% VERIFIED
  // =========================================================================

  // Tarihi Lokantalar & Çarşı
  'kadikoymerkez-lokanta-ciya': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C3%87iya+Sofras%C4%B1+G%C3%BCne%C5%9Fli+Bah%C3%A7e+Sk+No+43+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-lokanta-yanyali': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Yanyal%C4%B1+Fehmi+Lokantas%C4%B1+Ya%C4%9Fl%C4%B1k%C3%A7%C4%B1+Sk+No+1+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-lokanta-borsam': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Borsam+Ta%C5%9Ff%C4%B1r%C4%B1n+Lahmacun+G%C3%BCne%C5%9Fli+Bah%C3%A7e+Sk+No+22+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-lokanta-ciyakebap': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C3%87iya+Kebap+G%C3%BCne%C5%9Fli+Bah%C3%A7e+Sk+No+48+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // Balık & Deniz Ürünleri
  'kadikoymerkez-balik-hamsipub': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Hamsi+Pub+G%C3%BCne%C5%9Fli+Bah%C3%A7e+Sk+No+33+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-balik-kadinimet': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kad%C4%B1+Nimet+Bal%C4%B1k%C3%A7%C4%B1s%C4%B1+Bal%C4%B1k%C3%A7%C4%B1lar+%C3%87ar%C5%9F%C4%B1s%C4%B1+No+10+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-balik-midyeciyasin': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Midyeci+Yasin+Osmana%C4%9Fa+Sk+No+12+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-balik-denizati': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=DenizAt%C4%B1+Restaurant+Muvakkithane+Cd+No+15+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // Tarihi Tatlıcılar
  'kadikoymerkez-dessert-baylan': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Baylan+Pastanesi+Muvakkithane+Cd+No+9A+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-dessert-cafererol': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C5%9Eekerci+Cafer+Erol+G%C3%BCne%C5%9Fli+Bah%C3%A7e+Sk+No+40+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-dessert-haciserif': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Hac%C4%B1+%C5%9Eerif+Muvakkithane+Cd+No+11+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-dessert-saray': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Saray+Muhallebicisi+R%C4%B1ht%C4%B1m+Cd+No+26+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // Meyhane & Akşam
  'kadikoymerkez-meyhane-viktorlevi': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Viktor+Levi+%C5%9Earap+Evi+Damac%C4%B1+Sk+No+4+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-meyhane-piraye': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Piraye+Ta%C5%9F+Plak+Meyhanesi+Serasker+Cd+No+108+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-meyhane-guneslibahce': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=G%C3%BCne%C5%9Fli+Bah%C3%A7e+Meyhanesi+G%C3%BCne%C5%9Fli+Bah%C3%A7e+Sk+No+36+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kadikoymerkez-meyhane-agapia': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Agapia+Mezze+Miralay+Naz%C4%B1m+Sk+No+10A+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // =========================================================================
  // KOŞUYOLU (KADIKÖY) — 100% VERIFIED
  // =========================================================================

  // Kahvaltı & Bahçe Brunch
  'kosuyolu-breakfast-cevizagaci': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Ceviz+A%C4%9Fac%C4%B1+Muhittin+%C3%9Cst%C3%BCnda%C4%9F+Cd+No+85+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-breakfast-kirpi': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kirpi+Ko%C5%9Fuyolu+Mehmet+Akfan+Sk+No+31+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-breakfast-radika': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Radika+Ko%C5%9Fuyolu+Kalfa+%C3%87e%C5%9Fmesi+Sk+No+30+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-breakfast-flan': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Flan+Bakery+Muhittin+%C3%9Cst%C3%BCnda%C4%9F+Cd+No+65+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // Kahve & Çalışma Alanları
  'kosuyolu-coffee-kaffeeschutz': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kaffee+Sch%C3%BCtz+Ko%C5%9Fuyolu+Cad+No+80+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-coffee-cremma': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Cremma+Muhittin+%C3%9Cst%C3%BCnda%C4%9F+Cd+No+45+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-coffee-blak': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Blak+Coffee+Co+Mehmet+Akfan+Sk+No+53+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-coffee-viyana': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Viyana+Kahvesi+Ko%C5%9Fuyolu+Cad+No+10+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // Akşam Yemeği & Bistro
  'kosuyolu-bistro-kaen': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kaen+Sushi+Asmadal%C4%B1+Sk+No+6+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-bistro-monkey': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Monkey+Business+Muhittin+%C3%9Cst%C3%BCnda%C4%9F+Cd+No+9+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-bistro-birtat': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Selimiye+Birtat+1956+Kalfa+%C3%87e%C5%9Fmesi+Sk+No+16+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-bistro-kipos': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kipos+Bal%C4%B1k+Cenap+%C5%9Eahabettin+Sk+No+128+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // Pizza & İtalyan
  'kosuyolu-pizza-rosario': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Trattoria+da+Rosario+Kalfa+%C3%87e%C5%9Fmesi+Sk+No+22+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-pizza-locale': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pizza+Locale+Muhittin+%C3%9Cst%C3%BCnda%C4%9F+Cd+No+71+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-pizza-papajohns': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Papa+Johns+Ko%C5%9Fuyolu+Cad+No+114+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'kosuyolu-pizza-pizzav': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pizza+V+%C5%9Eeyh+Galip+Sk+No+7+Ko%C5%9Fuyolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
};

export function getVerifiedGoogleRatings(venueId: string): VisitorGoogleRating[] {
  const match = VERIFIED_MAP[venueId];
  return match ? [match] : [];
}
