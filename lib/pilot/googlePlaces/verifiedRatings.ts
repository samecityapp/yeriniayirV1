import type { VisitorGoogleRating } from './visitorRating';

/**
 * Official verified Google Places ratings for visitor cards.
 *
 * GOOGLE PLACES API TERMS & TRUTH STANDARD:
 * - Google Places API ToS Section 3.2.3 & 3.2.4 strictly prohibits permanent caching/storage
 *   of rating values without live periodic refreshes.
 * - Previous historical receipts recorded:
 *     Çekirdek: 4.8 (Place ID: ChIJZTpOQ2G4yhQRXy7M8aFB0Wc, matched 2026-10-31)
 *     Story Dalga: 4.3 (Place ID: ChIJQce432C4yhQRKlx16syzfGs, matched 2026-10-31)
 *     Montag Bademaltı: 4.5 (Place ID: ChIJYc4vsQa5yhQR3eJyqdAvyp0, matched 2026-10-31)
 *     Guten Morgen: Unverified (door/unit check failed)
 * - Without an authorized, newly verified live API session and fresh attribution timestamps,
 *   we NEVER display hardcoded, stale, or estimated ratings to visitors.
 * - When no fresh authorized rating exists, this returns empty ([]), causing the badge
 *   to cleanly remain hidden rather than displaying unverified or non-compliant scores.
 */
export function getVerifiedGoogleRatings(_venueId: string): VisitorGoogleRating[] {
  // Returns empty until an authorized live Places API run provides fresh attributions.
  return [];
}
