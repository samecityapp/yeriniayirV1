import type { FoodLocation, FoodRegionBbox, VisitorFoodVenue } from './types';
import { haversineMeters } from './text';

const TRUSTED_MAPS_HOSTS = new Set([
  'maps.google.com',
  'www.google.com',
  'google.com',
  'maps.app.goo.gl',
  'goo.gl',
  'maps.apple.com',
]);

const CANONICAL_CID_REGEX = /^https:\/\/maps\.google\.com\/\?cid=\d+$/;

export function isValidGeoPoint(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(Math.abs(lat) < 0.0001 && Math.abs(lng) < 0.0001)
  );
}

function isInsideBbox(pt: { lat: number; lng: number }, bbox: FoodRegionBbox): boolean {
  return (
    pt.lat >= bbox.minLat &&
    pt.lat <= bbox.maxLat &&
    pt.lng >= bbox.minLng &&
    pt.lng <= bbox.maxLng
  );
}

export function distanceToBboxMeters(pt: { lat: number; lng: number }, bbox: FoodRegionBbox): number {
  const clampedLat = Math.max(bbox.minLat, Math.min(bbox.maxLat, pt.lat));
  const clampedLng = Math.max(bbox.minLng, Math.min(bbox.maxLng, pt.lng));
  return haversineMeters(pt, { lat: clampedLat, lng: clampedLng });
}

export interface NearestRegionMatch {
  location: FoodLocation;
  distanceMeters: number;
  insideBoundary: boolean;
}

export function findNearestPublishedRegion(
  coords: { lat: number; lng: number },
  readyRegions: readonly FoodLocation[],
  maxBorderDistanceMeters = 6000
): NearestRegionMatch | null {
  if (!isValidGeoPoint(coords.lat, coords.lng)) {
    return null;
  }

  let bestInside: NearestRegionMatch | null = null;
  let bestInsideCenterDist = Infinity;

  let bestOutside: NearestRegionMatch | null = null;
  let bestOutsideBorderDist = Infinity;
  let bestOutsideCenterDist = Infinity;

  for (const loc of readyRegions) {
    if (loc.status !== 'published') continue;
    const bbox = loc.boundary?.bbox;
    const exclude = loc.boundary?.excludeBbox;
    const centerDist = loc.center ? haversineMeters(coords, loc.center) : Infinity;

    if (bbox) {
      const inBox = isInsideBbox(coords, bbox);
      const excluded = Boolean(exclude && isInsideBbox(coords, exclude));

      if (inBox && !excluded) {
        if (!bestInside || centerDist < bestInsideCenterDist) {
          bestInside = { location: loc, distanceMeters: 0, insideBoundary: true };
          bestInsideCenterDist = centerDist;
        }
        continue;
      }

      const borderDist = distanceToBboxMeters(coords, bbox);
      if (borderDist <= maxBorderDistanceMeters) {
        if (
          !bestOutside ||
          borderDist < bestOutsideBorderDist - 1 ||
          (Math.abs(borderDist - bestOutsideBorderDist) <= 1 && centerDist < bestOutsideCenterDist)
        ) {
          bestOutside = { location: loc, distanceMeters: borderDist, insideBoundary: false };
          bestOutsideBorderDist = borderDist;
          bestOutsideCenterDist = centerDist;
        }
      }
      continue;
    }

    if (loc.center && centerDist <= maxBorderDistanceMeters) {
      if (!bestOutside || centerDist < bestOutsideBorderDist) {
        bestOutside = { location: loc, distanceMeters: centerDist, insideBoundary: false };
        bestOutsideBorderDist = centerDist;
        bestOutsideCenterDist = centerDist;
      }
    }
  }

  return bestInside || bestOutside;
}

export function sanitizeExternalMapsUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    if (parsed.username || parsed.password) return null;
    const host = parsed.hostname.toLowerCase();
    if (!TRUSTED_MAPS_HOSTS.has(host)) return null;
    if (parsed.protocol === 'http:') {
      parsed.protocol = 'https:';
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function resolveSafeVenueMapsUrl(
  venue: Pick<
    VisitorFoodVenue,
    'name' | 'address' | 'neighborhood' | 'location' | 'ratings' | 'mapsUri' | 'placeId' | 'coordinates'
  >,
  lang: 'tr' | 'en' = 'tr'
): string {
  const candidates = [venue.mapsUri, venue.ratings?.[0]?.attribution?.mapsUri];
  for (const candidate of candidates) {
    if (candidate && CANONICAL_CID_REGEX.test(candidate)) {
      return candidate;
    }
  }

  for (const candidate of candidates) {
    const clean = sanitizeExternalMapsUrl(candidate);
    if (clean) return clean;
  }

  if (
    venue.placeId &&
    venue.coordinates &&
    isValidGeoPoint(venue.coordinates.lat, venue.coordinates.lng)
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${venue.coordinates.lat},${venue.coordinates.lng}&query_place_id=${encodeURIComponent(venue.placeId)}`;
  }

  const rawName = typeof venue.name === 'string' ? venue.name : (venue.name as any)?.[lang] || '';
  const queryParts = [rawName, venue.address || venue.neighborhood || venue.location]
    .filter(Boolean)
    .join(' ');
  const fallbackBase = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryParts)}`;
  return venue.placeId
    ? `${fallbackBase}&query_place_id=${encodeURIComponent(venue.placeId)}`
    : fallbackBase;
}
