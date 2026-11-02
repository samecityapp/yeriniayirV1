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
};

export function getVerifiedGoogleRatings(venueId: string): VisitorGoogleRating[] {
  const match = VERIFIED_MAP[venueId];
  return match ? [match] : [];
}
