import type { VisitorGoogleRating } from './visitorRating';
import { copyVisitorGoogleRatings } from './visitorRating';

/**
 * Official verified Google Places ratings for canonical pilot branches.
 * Matches verified Place IDs from work/google-places/place-ids.json.
 *
 * Rules:
 * - Only verified physical branches with confirmed Place IDs and validated Details.
 * - Unverified branches (e.g. Guten Morgen door/unit mismatch) must have NO rating.
 * - No fake ratings, no arbitrary approximations.
 * - No review counts (userRatingCount strictly withheld per product design).
 */
const VERIFIED_BRANCH_RATINGS: Record<string, VisitorGoogleRating[]> = {
  // Story Coffee Roasters • Dalga 22 (Place ID: ChIJQce432C4yhQRKlx16syzfGs)
  'osm-node-6124757286': [
    {
      platform: 'google-maps',
      value: 4.7,
      attribution: {
        label: 'Google Maps',
        mapsUri: 'https://maps.google.com/?cid=12361699042630986538',
        providers: [],
      },
    },
  ],
  // Çekirdek • Şair Latifi 9/A (Place ID: ChIJZTpOQ2G4yhQRXy7M8aFB0Wc)
  'osm-node-5764070654': [
    {
      platform: 'google-maps',
      value: 4.8,
      attribution: {
        label: 'Google Maps',
        mapsUri: 'https://maps.google.com/?cid=7462058376837132127',
        providers: [],
      },
    },
  ],
  // Montag Coffee • Bademaltı 22/A (Place ID: ChIJYc4vsQa5yhQR3eJyqdAvyp0)
  'osm-node-9375785317': [
    {
      platform: 'google-maps',
      value: 4.6,
      attribution: {
        label: 'Google Maps',
        mapsUri: 'https://maps.google.com/?cid=11364506828551176925',
        providers: [],
      },
    },
  ],
  // osm-node-8017443297 (Guten Morgen): Door/unit mismatch -> unverified -> NO RATING
};

export function getVerifiedGoogleRatings(venueId: string): VisitorGoogleRating[] {
  const ratings = VERIFIED_BRANCH_RATINGS[venueId];
  return ratings ? copyVisitorGoogleRatings(ratings) : [];
}
