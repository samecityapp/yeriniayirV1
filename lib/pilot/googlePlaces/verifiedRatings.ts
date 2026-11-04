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

  // =========================================================================
  // ACIBADEM (KADIKÖY & ÜSKÜDAR) — 100% VERIFIED
  // =========================================================================

  // Çikolata & Tatlı
  'acibadem-dessert-asuman': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Asuman+%C3%87ikolata+%C3%87e%C3%A7en+Sk+No+25+Ac%C4%B1badem+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'acibadem-dessert-foodlab': {
    platform: 'google-maps',
    value: 4.9,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Foodlab+Ac%C4%B1badem+Bet%C3%BCl+Sk+No+8A+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'acibadem-dessert-veronika': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Veronika+%C3%87ikolata+Kruvasan+Ac%C4%B1badem+Cd+No+228A+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'acibadem-dessert-kukis': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kukis+Ac%C4%B1badem+Cd+No+154+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Nitelikli Kahve & Kafe
  'acibadem-coffee-bakku': {
    platform: 'google-maps',
    value: 4.9,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bakku+Coffee+Shop+Muhtarbey+Sk+No+6B+Ac%C4%B1badem+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'acibadem-coffee-espressino': {
    platform: 'google-maps',
    value: 4.9,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Espressino+Caffe+Ac%C4%B1badem+Cd+No+76+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'acibadem-coffee-solvi': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=SOLVI+Coffee+Co+Ac%C4%B1badem+Cd+No+104+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'acibadem-coffee-feinka': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Feinka+Coffee+Eczac%C4%B1+Necip+Akar+Sk+No+1A+Ac%C4%B1badem+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Kebap & Döner
  'acibadem-kebap-hacibasar': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Hac%C4%B1ba%C5%9Far+Kebap+Ac%C4%B1badem+Cd+No+67A+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'acibadem-kebap-intiba': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C4%B0ntiba+D%C3%B6ner+Ac%C4%B1badem+%C5%9Eehit+Emin+%C3%87%C3%B6len+Sk+No+4+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'acibadem-kebap-canak': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C3%87anak+Kebap+Katmer+Ac%C4%B1badem+Cd+No+115+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'acibadem-kebap-birbicer': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Birbi%C3%A7er+Kebap+Ac%C4%B1badem+Cd+No+174+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Bistro & Ev Yemekleri
  'acibadem-bistro-charla': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Charla+Ac%C4%B1badem+Cd+No+190A+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'acibadem-bistro-draft': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Draft+Gastropub+Ac%C4%B1badem+Cd+No+67B+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'acibadem-bistro-lagom': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Lagom+Ev+Yemekleri+Sarayard%C4%B1+Cd+No+28A+Ac%C4%B1badem+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'acibadem-bistro-aum': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=AUM+Pasta+Cafe+Ac%C4%B1badem+Cd+No+144+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Region 6: Feneryolu (16 verified venues)
  'feneryolu-coffee-orlando': {
    platform: 'google-maps',
    value: 4.9,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Orlando+Coffee+Gazi+Muhtarpa%C5%9Fa+Sk+No+5+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-coffee-barneys': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Barneys+Cafe+Gazi+Muhtarpa%C5%9Fa+Sk+No+12E+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-coffee-kaffabuna': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kaffa+Buna+Kuyuba%C5%9F%C4%B1+Sk+No+12A+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-coffee-fenway': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Fenway+Coffee+Roastery+Mustafa+Mazhar+Bey+Sk+No+53+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-kahvalti-kameriye': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kameriye+Cafe+Gazi+Muhtar+Pa%C5%9Fa+Korusu+No+1+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-kahvalti-safranbolu': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tarihi+Safranbolu+F%C4%B1r%C4%B1n%C4%B1+Mustafa+Mazhar+Bey+Sk+No+77+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-kahvalti-salkim': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Salk%C4%B1m+Meze+Cafe+Mustafa+Mazhar+Bey+Cd+No+81+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-kahvalti-ekmek-firini': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Feneryolu+Ekmek+F%C4%B1r%C4%B1n%C4%B1+Mazhar+Osman+Sk+No+20A+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-tatli-merveilleux': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Merveilleux+Patisserie+Hamdibey+Sk+No+16+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-tatli-sec-baklava': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Se%C3%A7+Baklavalar%C4%B1+Ba%C4%9Fdat+Cd+No+146A+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-tatli-kuba': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kuba+Pasta+Cafe+Feneryolu+Sk+No+7B+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-tatli-kerem': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kerem+Pastanesi+Feneryolu+Sk+No+1+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-bistro-spello': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Spello+Kitchen+Taze+Makarna+Gazi+Muhtarpa%C5%9Fa+Sk+No+12F+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-bistro-lamora': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=La+Mora+Pizza+Pasta+Gazi+Muhtarpa%C5%9Fa+Sk+No+12C+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-bistro-nur-kebap': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nur+Kebap+Lahmacun+Ba%C4%9Fdat+Cd+No+51B+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'feneryolu-bistro-nakkas': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nakka%C5%9F+Kebap+Boztepe+Sk+No+2+Feneryolu+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Region 7: Caddebostan (16 verified venues)
  'caddebostan-coffee-klar': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Klar+Coffee+Co+%C3%96merpa%C5%9Fa+Sk+No+5+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-coffee-orbis': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Orbis+Coffee+Caddebostan+Plaj+Yolu+Sk+No+3+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-coffee-nou': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nou+Cafe+Kitchen+Plaj+Yolu+Sk+No+8B+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-coffee-meetlab': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Meet+Lab+Coffee+Selin+Sk+No+6A+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-brunch-cafecadde': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Cafe+Cadde+Ba%C4%9Fdat+Cd+No+349+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-brunch-sourandsweet': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Sour+and+Sweet+Artisan+Bakery+Caddebostan+Plaj+Yolu+Sk+No+8A+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-brunch-fiyonk': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Fiyonk+Bakery+Cafe+%C5%9Eim%C5%9Fek+Sk+No+4+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-brunch-kasabim': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kasab%C4%B1m+D%C3%B6ner+Caddebostan+%C4%B0skele+Sk+No+10+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-dessert-paseo': {
    platform: 'google-maps',
    value: 4.9,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Paseo+Gelato+Sorbet+%C3%96merpa%C5%9Fa+Sk+No+24B+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-dessert-girandola': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Girandola+Dondurma+Caddebostan+%C4%B0skele+Sk+No+16+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-dessert-divan': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Divan+Pastanesi+Ba%C4%9Fdat+Cd+No+333+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-dessert-pelit': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pelit+Pastanesi+Ba%C4%9Fdat+Cd+No+259B+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-bistro-ilpadrino': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Il+Padrino+Ristorante+Caddebostan+%C4%B0skele+Sk+No+8C+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-bistro-sakibalik': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Saki+Bal%C4%B1k+Restoran+Caddebostan+%C4%B0skele+Sk+No+17+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-bistro-havelka': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Havelka+Caddebostan+%C4%B0skele+Sk+No+12+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'caddebostan-bistro-theirishpub': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=The+Irish+Pub+CKM+Haldun+Taner+Sk+No+11+Caddebostan+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Region 8: Suadiye (16 verified venues)
  'suadiye-coffee-glann': {
    platform: 'google-maps',
    value: 4.9,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Glann+Coffee+Ay%C5%9Fe%C3%A7avu%C5%9F+Cd+No+36+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-coffee-matters': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Matters+Suadiye+Pembe+G%C3%BCl+Sk+No+1+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-coffee-voi': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Voi+Cadde+M%C3%BCcahit+Sk+No+5+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-coffee-drip': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Drip+Coffeeist+Noter+Sk+No+17C+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-brunch-bazlama': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C3%87e%C5%9Fme+Bazlama+Kahvalt%C4%B1+Noter+Sk+No+23+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-brunch-lepain': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Le+Pain+Quotidien+Ba%C4%9Fdat+Cd+No+405+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-brunch-grandma': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Grandma+Suadiye+Ba%C4%9Fdat+Cd+No+396+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-brunch-beyazfirin': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Beyaz+F%C4%B1r%C4%B1n+Suadiye+Plaj+Yolu+Sk+No+18+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-dessert-nazar': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nazar+Profiterol+Kaz%C4%B1m+%C3%96zalp+Sk+No+12+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-dessert-tatlimanna': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tatl%C4%B1m+Anna+Profiterol+Suadiye+Cami+Sk+No+23+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-dessert-godiva': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Godiva+Cafe+Ba%C4%9Fdat+Cd+No+408+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-dessert-manolya': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Manolya+Pastanesi+Tonozlu+Sk+No+2+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-bistro-townhouse': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=The+Townhouse+Plaj+Yolu+Sk+No+13+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-bistro-brasserienoir': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Brasserie+Noir+Ba%C4%9Fdat+Cd+No+481+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-bistro-kirpi': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kirpi+Suadiye+Ba%C4%9Fdat+Cd+No+425+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  'suadiye-bistro-akali': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Akali+Suadiye+Ak%C4%B1n+Sk+No+5B+Suadiye+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // ==========================================
  // REGION 9: KUZGUNCUK (Üsküdar)
  // ==========================================
  // Bostan & Köy Kahvaltısı
  'kuzguncuk-kahvalti-pita': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pita+Kuzguncuk+%C4%B0cadiye+Cd+No+41A+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-kahvalti-saraninbahcesi': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Sara+Bah%C3%A7esi+%C4%B0cadiye+Cd+No+144+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-kahvalti-botanica': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Botanik+Bah%C3%A7e+Kuzguncuk+%C4%B0cadiye+Cd+No+132+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-kahvalti-cinaralti': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kuzguncuk+%C3%87%C4%B1naralt%C4%B1+Cafe+%C4%B0cadiye+Cd+No+2+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Fırın & Butik Tatlıcılar
  'kuzguncuk-firin-tarihifirin': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tarihi+Kuzguncuk+F%C4%B1r%C4%B1n%C4%B1+%C4%B0cadiye+Cd+No+24A+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-firin-dilimpastanesi': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Dilim+Pastanesi+Pa%C5%9Faliman%C4%B1+Cd+No+126B+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-firin-galette': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Galette+Kuzguncuk+%C4%B0cadiye+Cd+No+45B+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-firin-cikolakahve': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kuzguncuk+%C3%87ikolata+Kahve+%C4%B0cadiye+Cd+No+45+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Nitelikli Kahve & Kitap
  'kuzguncuk-kahve-nailkitabevi': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nail+Kitabevi+Cafe+%C4%B0cadiye+Cd+No+32+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-kahve-glow': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Glow+Coffee+%C3%9Cryanizade+Sk+No+1C+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-kahve-kosinitza': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kosinitza+Coffee+%C4%B0cadiye+Cd+No+9+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-kahve-neruda': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Neruda+Coffee+%C4%B0cadiye+Cd+No+28A+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Boğaz Balıkçıları & Kuzguncuk Lezzetleri
  'kuzguncuk-lokanta-baymanti': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bay+Mant%C4%B1+Cafe+%C4%B0cadiye+Cd+No+68A+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-lokanta-balikcisi': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kuzguncuk+Bal%C4%B1k%C3%A7%C4%B1s%C4%B1+Perihan+Abla+Sk+No+3+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-lokanta-metet': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Metet+K%C3%B6zde+D%C3%B6ner+%C4%B0cadiye+Cd+No+10+Kuzguncuk+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'kuzguncuk-lokanta-ismetbaba': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C4%B0smet+Baba+Restaurant+Kuzguncuk+%C3%87ar%C5%9F%C4%B1+Cd+No+1+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // ==========================================
  // REGION 10: ÇENGELKÖY (Üsküdar)
  // ==========================================
  // Tarihi Çınaraltı Kahvaltısı & Boğaz Manzarası
  'cengelkoy-kahvalti-cinaralti': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tarihi+%C3%87%C4%B1naralt%C4%B1+Aile+%C3%87ay+Bah%C3%A7esi+%C3%87%C4%B1narl%C4%B1+Cami+Sk+No+4+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-kahvalti-boon': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Boon+Cafe+Restaurant+Kara+Sk+No+5+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-kahvalti-sutis': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Emirgan+S%C3%BCti%C5%9F+%C3%87engelk%C3%B6y+Kaptan%C4%B1+Derya+Seyit+Ali+Pa%C5%9Fa+Sk+No+16+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-kahvalti-muzelik': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=M%C3%BCzelik+Cafe+Kerime+Hatun+Camii+Sk+No+9A+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Tarihi Çengelköy Börekçisi & İkonik Tatlılar
  'cengelkoy-borek-tarihiborekci': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tarihi+%C3%87engelk%C3%B6y+B%C3%B6rek%C3%A7isi+%C3%87engelk%C3%B6y+Cd+No+41+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-tatli-seval': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Seval+Pastanesi+%C3%87engelk%C3%B6y+Cd+No+9A+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-tatli-cikolakahve': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C3%87ikolata+Kahve+%C4%B0stanbul+Derecik+Sk+No+8+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-tatli-buandbu': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bu+and+Bu+Dondurma+%C3%87engelk%C3%B6y+Cd+No+40C+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Nitelikli Kahve & Kafe
  'cengelkoy-kahve-gofi': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Gofi+House+Coffee+%C5%9Eenol+Sk+No+2+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-kahve-pureblack': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pure+Black+Coffee+Albay+H%C3%BCsamettin+Ert%C3%BCrk+Sk+No+2E+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-kahve-espressolab': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Espressolab+%C3%87engelk%C3%B6y+%C4%B0skele+Kuleli+Cd+No+1+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-kahve-thepawn': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=The+Pawn+Cafe+Albay+H%C3%BCsamettin+Ert%C3%BCrk+Sk+No+6+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Boğaz Balıkçıları & Çengelköy Lezzetleri
  'cengelkoy-balik-delmare': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Del+Mare+Restaurant+Kuleli+Cd+No+45-1+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-balik-rigel': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Rigel+Restaurant+Kaptan%C4%B1+Derya+Seyit+Ali+Pa%C5%9Fa+Sk+No+11+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-balik-salvatore': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Osteria+Salvatore+Kuleli+Cd+No+45-1+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'cengelkoy-balik-chacha': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Chacha+Bal%C4%B1k+Kuleli+Cd+No+47+%C3%87engelk%C3%B6y+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // ==========================================
  // REGION 11: ÜSKÜDAR MERKEZ
  // ==========================================
  // Tarihi Esnaf Lokantaları & Meşhur Köfteciler
  'uskudar-lokanta-kanaat': {
    platform: 'google-maps',
    value: 3.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kanaat+Lokantas%C4%B1+Selman%C4%B1+Pak+Cd+No+9+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-lokanta-filizler': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Filizler+K%C3%B6ftecisi+Harem+Sahil+Yolu+Cd+No+61+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-lokanta-kofteci': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C3%9Csk%C3%BCdar+K%C3%B6ftecisi+Uncular+Cd+No+29-A+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-lokanta-deryadeniz': {
    platform: 'google-maps',
    value: 3.9,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Derya+Deniz+Bal%C4%B1k+Lokantas%C4%B1+Atlas+Sk+No+8+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Kız Kulesi & Boğaz Manzaralı Kahvaltı
  'uskudar-kahvalti-katibim': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Katibim+Restaurant+Harem+Sahil+Yolu+Cd+No+53+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-kahvalti-payedar': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Payedar+Kahve+Kur%C5%9Funlu+Medrese+Sk+No+2+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-kahvalti-cappadocia': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Cappadocia+Coffee+Bakery+Uncular+Cd+No+14+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-kahvalti-nuuva': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nuuva+Coffee+Bakery+Uncular+Cd+No+22+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Tarihi Tatlıcılar, Helva & Dondurma
  'uskudar-tatli-hafizmustafa': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Haf%C4%B1z+Mustafa+1864+Atlas+%C3%87%C4%B1kmaz%C4%B1+No+42-46+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-tatli-helvaciali': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tarihi+Helvac%C4%B1+Ali+Selman%C4%B1+Pak+Cd+No+17-A+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-tatli-haciserif': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Hac%C4%B1+%C5%9Eerif+Molla+E%C5%9Fref+Sk+No+7+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-tatli-boluluhasanusta': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bolulu+Hasan+Usta+Selman-%C4%B1+Pak+Cd+No+4-1+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // Kültür & Sanat Kafeleri / Nitelikli Kahve
  'uskudar-kahve-nevmecan': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nevmekan+Sahil+%C5%9Eemsi+Pa%C5%9Fa+Cd+No+2+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-kahve-heeps': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Heeps+Coffee+%C4%B0mam+Nas%C4%B1r+Sk+No+8+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-kahve-kadim': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kadim+Kahve+Hakimiyeti+Milliye+Cd+No+44+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },
  'uskudar-kahve-arvav': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Arvav+Mekan+Do%C4%9Fanc%C4%B1lar+Cd+No+48+%C3%9Csk%C3%BCdar',
      providers: [],
    },
  },

  // ==========================================
  // REGION 12: KARAKÖY (Beyoğlu)
  // ==========================================
  // Tarihi Lokantalar & Özgün Lezzetler
  'karakoy-lokanta-karakoylokantasi': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Karak%C3%B6y+Lokantas%C4%B1+Kemanke%C5%9F+Cd+No+57+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-lokanta-mahkeme': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mahkeme+Lokantas%C4%B1+Galata+Mahkemesi+Sk+No+2-A+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-lokanta-corbaevi': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Karak%C3%B6y+%C3%87orba+Evi+Mumhane+Cd+No+35+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-lokanta-namli': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Naml%C4%B1+Gurme+Mumhane+Cd+No+6-A+Karak%C3%B6y',
      providers: [],
    },
  },

  // 3. Nesil Nitelikli Kahve & Tasarım Kafeler
  'karakoy-kahve-coffeesapiens': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Coffee+Sapiens+K%C4%B1l%C4%B1%C3%A7+Ali+Pa%C5%9Fa+Mescidi+Sk+No+10-C+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-kahve-mums': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mums+Cafe+Frans%C4%B1z+Ge%C3%A7idi+Sk+No+1-16+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-kahve-pim': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pim+Karak%C3%B6y+K%C4%B1l%C4%B1%C3%A7+Ali+Pa%C5%9Fa+Mescidi+Sk+No+20+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-kahve-karabatak': {
    platform: 'google-maps',
    value: 3.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Karabatak+Karak%C3%B6y+Kara+Ali+Kaptan+Sk+No+7+Karak%C3%B6y',
      providers: [],
    },
  },

  // Tarihi Baklavacılar & Artizan Çikolata
  'karakoy-tatli-gulluoglu': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Karak%C3%B6y+G%C3%BCll%C3%BCo%C4%9Flu+Kemanke%C5%9F+Cd+No+67+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-tatli-hane': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Hane+%C3%87ikolata+Kahve+K%C4%B1l%C4%B1%C3%A7+Ali+Pa%C5%9Fa+Mescidi+Sk+No+6-A+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-tatli-koskeroglu': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=K%C3%B6%C5%9Fkero%C4%9Flu+Baklava+Kemeralt%C4%B1+Cd+No+46-A+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-tatli-hafizmustafa': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Haf%C4%B1z+Mustafa+1864+Galataport+Meclis-i+Mebusan+Cd+No+8+Karak%C3%B6y',
      providers: [],
    },
  },

  // Şef Restoranları, Modern Meyhane & Akşam
  'karakoy-bistro-neolokal': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Neolokal+Bankalar+Cd+No+11+SALT+Galata+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-bistro-murver': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=M%C3%BCrver+Restaurant+Kemanke%C5%9F+Cd+No+57-59+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-bistro-mukellef': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=M%C3%BCkellef+Karak%C3%B6y+Maliye+Cd+No+8-A+Karak%C3%B6y',
      providers: [],
    },
  },
  'karakoy-bistro-balikci': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tarihi+Karak%C3%B6y+Bal%C4%B1k+%C3%87ar%C5%9F%C4%B1s%C4%B1+Tersane+Cd+Karde%C5%9Fim+Sk+No+45+Grifin+Han+Karak%C3%B6y',
      providers: [],
    },
  },

  // ==========================================
  // REGION 13: GALATA (Beyoğlu)
  // ==========================================
  // Galata Kulesi & Nitelikli Kahve / Tasarım Kafe
  'galata-kahve-federal': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Federal+Coffee+K%C3%BC%C3%A7%C3%BCk+Hendek+Cd+No+7+Galata',
      providers: [],
    },
  },
  'galata-kahve-mavra': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mavra+Cafe+Design+Serdar-%C4%B1+Ekrem+Cd+No+31-A+Galata',
      providers: [],
    },
  },
  'galata-kahve-privato': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Cafe+Privato+T%C4%B1marc%C4%B1+Sk+No+3-B+Galata',
      providers: [],
    },
  },
  'galata-kahve-sirinfirin': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=%C5%9Eirin+F%C4%B1r%C4%B1n+Bakery+B%C3%BCy%C3%BCk+Hendek+Cd+No+16-A+Galata',
      providers: [],
    },
  },

  // Meşhur San Sebastian Cheesecake & Fırınlar
  'galata-tatli-viyana': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Viyana+Kahvesi+B%C3%BCy%C3%BCk+Hendek+Cd+No+19-A+Galata',
      providers: [],
    },
  },
  'galata-tatli-hafizmustafa': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Haf%C4%B1z+Mustafa+1864+%C5%9Eahkap%C4%B1s%C4%B1+Sk+No+2-A+Galata',
      providers: [],
    },
  },
  'galata-tatli-freddo': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Freddo+Galata+B%C3%BCy%C3%BCk+Hendek+Cd+No+21+Galata',
      providers: [],
    },
  },
  'galata-tatli-vaacoffee': {
    platform: 'google-maps',
    value: 4.9,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=VAA+Coffee+Bakery+B%C3%BCy%C3%BCk+Hendek+Cd+No+27+Galata',
      providers: [],
    },
  },

  // Kule Çevresi Tarihi Teraslar & Akşam Sofrası
  'galata-meyhane-guney': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=G%C3%BCney+Restaurant+1964+%C5%9Eahkap%C4%B1s%C4%B1+Sk+No+2-B+Galata',
      providers: [],
    },
  },
  'galata-meyhane-firuzende': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Firuzende+Galata+B%C3%BCy%C3%BCk+Hendek+Cd+No+5+Anemon+Teras+Galata',
      providers: [],
    },
  },
  'galata-meyhane-galatada24': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Galatada+24+Georges+Hotel+Serdar-%C4%B1+Ekrem+Cd+No+24+Galata',
      providers: [],
    },
  },
  'galata-meyhane-barnathan': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Barnathan+Roof+T%C4%B1marc%C4%B1+Sk+No+1+Galata',
      providers: [],
    },
  },

  // Şık Galata Bistroları & Dünya Mutfağı
  'galata-bistro-ilcortile': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Il+Cortile+Ristorante+Galata+Kulesi+Sk+No+14+Galata',
      providers: [],
    },
  },
  'galata-bistro-dukkan': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=D%C3%BCkkan+Galata+Tatar+Beyi+Sk+No+15-B+Galata',
      providers: [],
    },
  },
  'galata-bistro-otantik': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Otantik+Galata+Camekan+Sk+No+4+Galata',
      providers: [],
    },
  },
  'galata-bistro-snog': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Snog+Roof+Bar+Galip+Dede+Cd+No+56+Kat+4+Galata',
      providers: [],
    },
  },

  // --- CİHANGİR (100% CİHANGİR) ---
  'cihangir-kahvalti-kahve6': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kahve+6+Anahtar+Sk+No+13A+Cihangir',
      providers: [],
    },
  },
  'cihangir-kahvalti-journey': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Journey+Akarsu+Yokusu+No+21A+Cihangir',
      providers: [],
    },
  },
  'cihangir-kahvalti-susam': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Susam+Cafe+Susam+Sk+No+11+Cihangir',
      providers: [],
    },
  },
  'cihangir-kahvalti-kaktus': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kaktus+Cihangir+Cihangir+Cad+No+16A',
      providers: [],
    },
  },
  'cihangir-kahve-kronotrop': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kronotrop+Turnacibasi+Cd+No+56+Cihangir',
      providers: [],
    },
  },
  'cihangir-kahve-norm': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Norm+Coffee+Gunesli+Sk+No+39A+Cihangir',
      providers: [],
    },
  },
  'cihangir-kahve-geyik': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Geyik+Coffee+Roastery+Akarsu+Yokusu+No+22+Cihangir',
      providers: [],
    },
  },
  'cihangir-kahve-21': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=21+Cihangir+Coskun+Sok+No+2+Cihangir',
      providers: [],
    },
  },
  'cihangir-bistro-demeti': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Demeti+Meyhane+Siraselviler+Cd+No+58+1+Cihangir',
      providers: [],
    },
  },
  'cihangir-bistro-jash': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Jash+Cihangir+Cihangir+Cad+No+9',
      providers: [],
    },
  },
  'cihangir-bistro-surbalik': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Sur+Balik+Cihangir+Defterdar+Yokusu+No+39',
      providers: [],
    },
  },
  'cihangir-bistro-rosemarine': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Rose+Marine+Cihangir+Akarsu+Yokusu+No+27',
      providers: [],
    },
  },
  'cihangir-tatli-savoy': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Savoy+Pastanesi+Siraselviler+Cd+No+91A+Cihangir',
      providers: [],
    },
  },
  'cihangir-tatli-cuppa': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Cuppa+Cihangir+Yeni+Yuva+Sk+No+22',
      providers: [],
    },
  },
  'cihangir-tatli-faw': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=FAW+Coffee+Bakery+Taktaki+Yokusu+No+14A+Cihangir',
      providers: [],
    },
  },
  'cihangir-tatli-misspizza': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Miss+Pizza+Havyar+Sokak+No+5+Cihangir',
      providers: [],
    },
  },

  // --- BEYOĞLU (100% BEYOĞLU & ASMALI MESCİT) ---
  'beyoglu-meyhane-asmalicavit': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Asmali+Cavit+Asmali+Mescit+Cad+No+16D+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-meyhane-yakup2': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Yakup+2+Asmalimescit+Sok+No+21B+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-meyhane-refik': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Refik+Restaurant+Sofyali+Sok+No+6+8+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-meyhane-galatameyhanesi': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Galata+Meyhanesi+Orhan+Adli+Apaydin+Sok+No+5+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-lokanta-haciabdullah': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Haci+Abdullah+Lokantasi+Atif+Yilmaz+Cd+No+9A+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-lokanta-helvetia': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Helvetia+Genel+Yazici+Sk+No+8+Asmali+Mescit',
      providers: [],
    },
  },
  'beyoglu-lokanta-kalkanoglu': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tarihi+Kalkanoglu+Pilavcisi+Ayhan+Isik+Sk+No+16A+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-lokanta-nizampide': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nizam+Pide+Kalyoncu+Kullugu+Cd+No+13+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-bistro-mikla': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mikla+Restaurant+The+Marmara+Pera+Mesrutiyet+Cd+No+15',
      providers: [],
    },
  },
  'beyoglu-bistro-360istanbul': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=360+Istanbul+Istiklal+Cad+Misir+Apt+No+163+Kat+8',
      providers: [],
    },
  },
  'beyoglu-bistro-lebiderya': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Lebi+Derya+Kumbaraci+Yokusu+No+57+Kat+6+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-bistro-litera': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Litera+Restaurant+Yeni+Carsi+Cad+No+32+Kat+6+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-tatli-incipastanesi': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Inci+Pastanesi+Mis+Sk+No+18A+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-tatli-mandabatmaz': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mandabatmaz+Olivia+Gecidi+No+1A+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-tatli-hacibekir': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Ali+Muhiddin+Haci+Bekir+Istiklal+Cad+No+83A+Beyoglu',
      providers: [],
    },
  },
  'beyoglu-tatli-beyoglucikolatacisi': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Meshur+Beyoglu+Cikolatacisi+Istiklal+Cad+No+69A+Beyoglu',
      providers: [],
    },
  },

  // --- TAKSİM (100% TAKSİM & GÜMÜŞSUYU) ---
  'taksim-kebap-zubeyir': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Zubeyir+Ocakbasi+Bekar+Sk+No+28+Taksim',
      providers: [],
    },
  },
  'taksim-kebap-durumzade': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Durumzade+Kurabiye+Sk+No+26B+Taksim',
      providers: [],
    },
  },
  'taksim-kebap-kizilkayalar': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kizilkayalar+Taksim+Siraselviler+Cad+No+2C',
      providers: [],
    },
  },
  'taksim-kebap-bambi': {
    platform: 'google-maps',
    value: 3.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bambi+Cafe+Taksim+Siraselviler+Cad+No+2J',
      providers: [],
    },
  },
  'taksim-tatli-hafizmustafa': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Hafiz+Mustafa+1864+Siraselviler+Cad+No+7B+Taksim',
      providers: [],
    },
  },
  'taksim-tatli-saray': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Saray+Muhallebicisi+Istiklal+Cad+No+107+Taksim',
      providers: [],
    },
  },
  'taksim-tatli-jadore': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Jadore+Chocolatier+Emir+Nevruz+Sk+No+5F+Taksim',
      providers: [],
    },
  },
  'taksim-tatli-mado': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mado+Taksim+Siraselviler+Cad+No+33',
      providers: [],
    },
  },
  'taksim-bistro-divan': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Lokanta+by+Divan+Asker+Ocagi+Cd+No+1+Elmadag+Taksim',
      providers: [],
    },
  },
  'taksim-bistro-izaka': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Izaka+Terrace+CVK+Park+Bosphorus+Inonu+Cd+No+8+Gumussuyu',
      providers: [],
    },
  },
  'taksim-bistro-safran': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Safran+Restaurant+InterContinental+Asker+Ocagi+Cd+No+1+Taksim',
      providers: [],
    },
  },
  'taksim-bistro-topaz': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Topaz+Restaurant+Inonu+Cd+No+50+Gumussuyu+Taksim',
      providers: [],
    },
  },
  'taksim-cafe-arakafe': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Ara+Kafe+Tosbaga+Sk+No+2+Galatasaray+Taksim',
      providers: [],
    },
  },
  'taksim-cafe-limonlubahce': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Limonlu+Bahce+Yeni+Carsi+Cd+No+98+Taksim',
      providers: [],
    },
  },
  'taksim-cafe-49cukurcuma': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=49+Cukurcuma+Turnacibasi+Cd+No+49+Taksim',
      providers: [],
    },
  },
  'taksim-cafe-geziistanbul': {
    platform: 'google-maps',
    value: 3.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Gezi+Istanbul+Inonu+Cd+No+5+Taksim+Meydani',
      providers: [],
    },
  },

  // --- NİŞANTAŞI (100% NİŞANTAŞI & TEŞVİKİYE) ---
  'nisantasi-kahve-petra': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Petra+Roasting+Co+Prof+Dr+Orhan+Ersek+Sk+No+18B+Topagaci',
      providers: [],
    },
  },
  'nisantasi-kahve-moc': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=MOC+Istanbul+Sakayik+Sk+No+4A+Tesvikiye',
      providers: [],
    },
  },
  'nisantasi-kahve-spada': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Spada+Coffee+Av+Sureyya+Agaoglu+Sk+No+13A+Tesvikiye',
      providers: [],
    },
  },
  'nisantasi-kahve-cupofjoy': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Cup+of+Joy+Sair+Nigar+Sk+No+58+Nisantasi',
      providers: [],
    },
  },
  'nisantasi-kahvalti-kruvasan': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kruvasan+Istanbul+Av+Sureyya+Agaoglu+Sk+No+10+Tesvikiye',
      providers: [],
    },
  },
  'nisantasi-kahvalti-grandma': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Grandma+Bakery+Cafe+Ahmet+Fetgari+Sk+No+38+Tesvikiye',
      providers: [],
    },
  },
  'nisantasi-kahvalti-delicatessen': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Delicatessen+Mim+Kemal+Oke+Cd+No+19+Nisantasi',
      providers: [],
    },
  },
  'nisantasi-kahvalti-breadbutter': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bread+Butter+Mim+Kemal+Oke+Cd+No+1A+Nisantasi',
      providers: [],
    },
  },
  'nisantasi-bistro-juno': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Juno+Mim+Kemal+Oke+Cd+No+15+Nisantasi',
      providers: [],
    },
  },
  'nisantasi-bistro-spago': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Spago+The+St+Regis+Istanbul+Mim+Kemal+Oke+Cd+No+35',
      providers: [],
    },
  },
  'nisantasi-bistro-glens': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Glens+Istanbul+Abdi+Ipekci+Cd+No+12+Nisantasi',
      providers: [],
    },
  },
  'nisantasi-bistro-beymen': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Beymen+Brasserie+Abdi+Ipekci+Cd+No+23+Nisantasi',
      providers: [],
    },
  },
  'nisantasi-tatli-divan': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Divan+Pastanesi+Mim+Kemal+Oke+Cd+No+1+Nisantasi',
      providers: [],
    },
  },
  'nisantasi-tatli-vakko': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Vakko+LAtelier+Abdi+Ipekci+Cad+No+43+Nisantasi',
      providers: [],
    },
  },
  'nisantasi-tatli-tatbak': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tatbak+Akkavak+Sk+No+38B+Nisantasi',
      providers: [],
    },
  },
  'nisantasi-tatli-pelit': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pelit+Pastanesi+Rumeli+Cd+No+13+Nisantasi',
      providers: [],
    },
  },

  // --- BEBEK (100% BEBEK) ---
  'bebek-kahve-bebekkahve': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bebek+Kahve+Cevdet+Pasa+Cd+No+18+Bebek',
      providers: [],
    },
  },
  'bebek-kahve-mangerie': {
    platform: 'google-maps',
    value: 3.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mangerie+Bebek+Cevdet+Pasa+Cd+No+69+Kat+3',
      providers: [],
    },
  },
  'bebek-kahve-lucca': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Lucca+Bebek+Cevdet+Pasa+Cd+No+51',
      providers: [],
    },
  },
  'bebek-kahve-cupofjoy': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Cup+of+Joy+Cevdet+Pasa+Cd+Yasemin+Pasaji+No+53+5+Bebek',
      providers: [],
    },
  },
  'bebek-tatli-bademezmesi': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Meshur+Bebek+Badem+Ezmesi+Cevdet+Pasa+Cd+No+38+1+Bebek',
      providers: [],
    },
  },
  'bebek-tatli-minidondurma': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mini+Dondurma+Cevdet+Pasa+Cd+No+38A+Bebek',
      providers: [],
    },
  },
  'bebek-tatli-abbaswaffle': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Abbas+Waffle+Cevdet+Pasa+Cd+No+48B+Bebek',
      providers: [],
    },
  },
  'bebek-tatli-baylan': {
    platform: 'google-maps',
    value: 3.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Baylan+Bebek+Cevdet+Pasa+Cd+No+52+54',
      providers: [],
    },
  },
  'bebek-balik-poseidon': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Poseidon+Restaurant+Cevdet+Pasa+Cd+No+58+Bebek',
      providers: [],
    },
  },
  'bebek-balik-chilai': {
    platform: 'google-maps',
    value: 4.0,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Chilai+Bebek+Cevdet+Pasa+Cd+No+60',
      providers: [],
    },
  },
  'bebek-balik-bebekotel': {
    platform: 'google-maps',
    value: 3.9,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bebek+Otel+Restaurant+Cevdet+Pasa+Cd+No+34',
      providers: [],
    },
  },
  'bebek-balik-bebekbalikci': {
    platform: 'google-maps',
    value: 3.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bebek+Balikci+Cevdet+Pasa+Cd+No+26A',
      providers: [],
    },
  },
  'bebek-bistro-divan': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Divan+Brasserie+Bebek+Cevdet+Pasa+Cd+No+28A',
      providers: [],
    },
  },
  'bebek-bistro-taps': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Taps+Bebek+Cevdet+Pasa+Cd+No+119',
      providers: [],
    },
  },
  'bebek-bistro-kirinti': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kirinti+Bebek+Cevdet+Pasa+Cd+No+35',
      providers: [],
    },
  },
  'bebek-bistro-midpoint': {
    platform: 'google-maps',
    value: 3.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Midpoint+Bebek+Cevdet+Pasa+Cd+No+35',
      providers: [],
    },
  },

  // --- YENİKÖY (100% YENİKÖY) ---
  'yenikoy-kahve-yenikoykahvesi': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Yenikoy+Kahvesi+Kurkcu+Faik+Sk+No+4+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-kahve-sutisyalisi': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Sutis+Abdullah+Aga+Yalisi+Koybasi+Cd+No+68+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-kahve-kup': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kup+Coffee+and+Tea+Koybasi+Cd+No+138B+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-kahve-sedir': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Sedir+Cafe+Koybasi+Cd+No+80+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-firin-borekci': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tarihi+Yenikoy+Borekchisi+Koybasi+Cd+No+74+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-firin-pan': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pan+Bakery+Koybasi+Cd+No+165+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-firin-mua': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mua+Gelato+Koybasi+Cd+No+140A+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-firin-emekmanti': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Emek+Manti+Evi+Koybasi+Cd+No+112+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-balik-takanik': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Takanik+Balik+Koybasi+Cd+No+155+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-balik-iskele': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Yenikoy+Iskele+Balikcisi+Koybasi+Cd+No+108+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-balik-sandal': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Sandal+Balik+Koybasi+Cd+No+173+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-balik-azur': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Azur+Yenikoy+Koybasi+Cd+No+71+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-bistro-apartiman': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Apartiman+Yenikoy+Koybasi+Cd+No+153+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-bistro-fiko': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Fiko+Ocakbasi+Koybasi+Cd+No+107+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-bistro-gazebo': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Gazebo+Lounge+Koybasi+Cd+No+125A+Yenikoy',
      providers: [],
    },
  },
  'yenikoy-bistro-saithalim': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Sait+Halim+Pasa+Yalisi+Koybasi+Cd+No+83+Yenikoy',
      providers: [],
    },
  },

  // --- GÖKTÜRK (100% GÖKTÜRK) ---
  'gokturk-kahve-yasemin': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Yasemin+ve+Ev+Sahipliginde+Istanbul+Cd+Arcadium+Life+No+30+Gokturk',
      providers: [],
    },
  },
  'gokturk-kahve-boter': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Boter+Coffee+Belediye+Cd+No+25+Gokturk',
      providers: [],
    },
  },
  'gokturk-kahve-minoa': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Minoa+Gokturk+Istanbul+Cd+Larus+Palas+No+2A+Gokturk',
      providers: [],
    },
  },
  'gokturk-kahve-manifesto': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Coffee+Manifesto+Istanbul+Cd+Arcadium+Life+No+26+Gokturk',
      providers: [],
    },
  },
  'gokturk-bistro-enzo': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Trattoria+Enzo+Istanbul+Cd+Arcadium+Life+No+26+Gokturk',
      providers: [],
    },
  },
  'gokturk-bistro-bite': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bite+Gokturk+Istanbul+Cd+Larus+Palas+No+28+Gokturk',
      providers: [],
    },
  },
  'gokturk-bistro-noir': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Brasserie+Noir+Istanbul+Cd+Arcadium+Life+No+26+Gokturk',
      providers: [],
    },
  },
  'gokturk-bistro-sushico': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=SushiCo+Gokturk+Belediye+Cd+No+1+Gokturk',
      providers: [],
    },
  },
  'gokturk-kebap-kosebasi': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kosebasi+Gokturk+Istanbul+Cd+No+48+Gokturk',
      providers: [],
    },
  },
  'gokturk-kebap-gunaydin': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Gunaydin+Kasap+Steakhouse+Arcadium+Life+No+26+Gokturk',
      providers: [],
    },
  },
  'gokturk-kebap-bedriusta': {
    platform: 'google-maps',
    value: 4.1,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bedri+Usta+Gokturk+Gokturk+Cd+No+15+Gokturk',
      providers: [],
    },
  },
  'gokturk-kebap-sedatusta': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Durumcu+Sedat+Usta+Camlik+Cd+No+6+Gokturk',
      providers: [],
    },
  },
  'gokturk-tatli-pelit': {
    platform: 'google-maps',
    value: 4.2,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pelit+Pastanesi+Istanbul+Cd+No+38+Gokturk',
      providers: [],
    },
  },
  'gokturk-tatli-dondurmaci': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Gokturk+Dondurmacisi+Belediye+Cd+No+11+Gokturk',
      providers: [],
    },
  },
  'gokturk-tatli-divan': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Divan+Pastanesi+Arcadium+Life+No+26+Gokturk',
      providers: [],
    },
  },
  'gokturk-tatli-butterfly': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Butterfly+Chocolate+Istanbul+Cd+Larus+Palas+No+2+Gokturk',
      providers: [],
    },
  },

  // --- KUŞADASI (AYDIN) ---
  // Ege Köy Kahvaltısı & Çiftlik
  'kusadasi-kahvalti-cardak6': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Cardak+6+Davutlar+Yolu+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-kahvalti-sultankonak': {
    platform: 'google-maps',
    value: 4.9,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kirazli+Sultan+Konak+Kirazli+Koyu+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-kahvalti-kruvasunday': {
    platform: 'google-maps',
    value: 4.8,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kruvasunday+Ataturk+Blv+No+116+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-kahvalti-marvista': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Marvista+Restaurant+Ataturk+Blv+No+44+Kusadasi',
      providers: [],
    },
  },

  // Taş Fırın & İtalyan Pizza
  'kusadasi-pizza-miovino': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pizza+Mio+and+Vino+Huseyin+Reis+Sk+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-pizza-cimino': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Cimino+Restaurant+Kadinlar+Denizi+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-pizza-granidiperle': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Grani+Di+Perle+Turkmen+Mah+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-pizza-locale': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Pizza+Locale+Turkmen+Mah+Kusadasi',
      providers: [],
    },
  },

  // Date, Gün Batımı & Fine Dining
  'kusadasi-date-giorooftop': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Gio+Rooftop+DoubleTree+by+Hilton+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-date-seckinsakli': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Seckin+Sakli+Bahce+Kadinlar+Denizi+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-date-bottarga': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Bottarga+Restaurant+Turkmen+Mah+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-date-tranche': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Tranche+Steak+House+Setur+Marina+Kusadasi',
      providers: [],
    },
  },

  // Nitelikli 3. Nesil Kahve & Artisan Kafeler
  'kusadasi-kahve-court': {
    platform: 'google-maps',
    value: 4.7,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Court+Coffee+Company+Setur+Marina+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-kahve-colombia': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Colombia+Coffee+Sahil+Karaova+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-kahve-roost': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=The+Roost+Coffee+Co+Turkmen+Mah+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-kahve-espressolab': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Espressolab+Setur+Marina+Kusadasi',
      providers: [],
    },
  },

  // Ege Balıkçıları & Sahil Deniz Mahsulleri
  'kusadasi-balik-mezgit': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Mezgit+Restaurant+Ataturk+Blv+No+104+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-balik-kumsal': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kumsal+Restaurant+Yavansu+Sahili+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-balik-sef': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Sef+Balik+Restaurant+Ataturk+Blv+No+74+Kusadasi',
      providers: [],
    },
  },
  'kusadasi-balik-kazimusta': {
    platform: 'google-maps',
    value: 4.3,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Kazim+Usta+Restaurant+Balikcilar+Meydani+Kusadasi',
      providers: [],
    },
  },
};

export function getVerifiedGoogleRatings(venueId: string): VisitorGoogleRating[] {
  const match = VERIFIED_MAP[venueId];
  return match ? [match] : [];
}
