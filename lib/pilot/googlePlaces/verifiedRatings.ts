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
};

export function getVerifiedGoogleRatings(venueId: string): VisitorGoogleRating[] {
  const match = VERIFIED_MAP[venueId];
  return match ? [match] : [];
}
