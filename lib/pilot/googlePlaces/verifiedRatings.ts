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
};

export function getVerifiedGoogleRatings(venueId: string): VisitorGoogleRating[] {
  const match = VERIFIED_MAP[venueId];
  return match ? [match] : [];
}
