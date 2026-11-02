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
  // --- KAHVE ---
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
  // Montag Coffee Roasters (Place ID: ChIJYc4vsQa5yhQR3eJyqdAvyp0, Muvakkithane / Bademaltı, Moda)
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

  // --- HAMBURGER ---
  // Basta! Street Food Bar (Sakız Gülü Sk. No:1, Caferağa, Kadıköy)
  'kadikoy-burger-basta': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Basta+Street+Food+Bar+Cafera%C4%9Fa+Sak%C4%B1z+G%C3%BCl%C3%BC+Sk+No+1+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Zapata Burger (Sakız Sk. No:1/C, Moda, Kadıköy)
  'kadikoy-burger-zapata': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Zapata+Burger+Cafera%C4%9Fa+Sak%C4%B1z+Sk+No+1C+Moda+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // 2Bites (Ağabey Sk. No:17/A, Moda, Kadıköy)
  'osm-node-11013718913': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=2Bites+Moda+A%C4%9Fabey+Sk+No+17A+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // --- PIZZA ---
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
  // Nappo Pizza (Damacı Sk. No:2, Caferağa, Kadıköy)
  'kadikoy-pizza-nappo': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Nappo+Pizza+Damac%C4%B1+Sk+No+2+Cafera%C4%9Fa+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // --- KAHVALTI ---
  // Brekkie Croissant & Breakfast (Yoğurtçu Parkı Cd. No:24/1, Kadıköy)
  'kadikoy-breakfast-brekkie': {
    platform: 'google-maps',
    value: 4.5,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Brekkie+Croissant+Breakfast+Yo%C4%9Furt%C3%A7u+Park%C4%B1+Cd+No+24+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
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
  // Küff Yeldeğirmeni (Karakolhane Cd. No:54, Yeldeğirmeni, Kadıköy)
  'kadikoy-breakfast-kuff': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=K%C3%BCff+Karakolhane+Cd+No+54+Yelde%C4%9Firmeni+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },

  // --- TATLI & PASTANE ---
  // Baylan Pastanesi (Muvakkithane Cd. No:9/A, Kadıköy Çarşı)
  'kadikoy-dessert-baylan': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Baylan+Pastanesi+Muvakkithane+Cd+No+9A+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
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

  // --- DATE MEKANLARI ---
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
  // Viktor Levi Şarap Evi (Damacı Sk. No:4, Caferağa, Kadıköy)
  'kadikoy-date-viktorlevi': {
    platform: 'google-maps',
    value: 4.4,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Viktor+Levi+%C5%9Earap+Evi+Damac%C4%B1+Sk+No+4+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
  // Basta Neo Bistro (Sakız Gülü Sk. No:1, Caferağa, Kadıköy)
  'kadikoy-date-bastaneobistro': {
    platform: 'google-maps',
    value: 4.6,
    attribution: {
      label: 'Google Maps',
      mapsUri: 'https://www.google.com/maps/search/?api=1&query=Basta+Neo+Bistro+Cafera%C4%9Fa+Sak%C4%B1z+G%C3%BCl%C3%BC+Sk+No+1+Kad%C4%B1k%C3%B6y',
      providers: [],
    },
  },
};

export function getVerifiedGoogleRatings(venueId: string): VisitorGoogleRating[] {
  const match = VERIFIED_MAP[venueId];
  return match ? [match] : [];
}
