import type { VisitorFoodDiscovery } from '@/lib/food/types';
import { V3_LOCATIONS } from '@/lib/gastronomy-v3/registry';
import { readIntegrationDiscovery } from '@/lib/pilot/integration/discovery';
import { toFoodDiscovery } from '@/lib/pilot/integration/foodAdapter';

export interface StaticRegionVenuePayload {
  regionSlug: string;
  version?: string;
  categories: VisitorFoodDiscovery['categories'];
  venues: VisitorFoodDiscovery['venues'];
  nearbyVenues: VisitorFoodDiscovery['nearbyVenues'];
}

const REGION_SLUG_REGEX = /^[a-z0-9-]{1,80}$/;

function computeRegionPayloadVersion(
  regionSlug: string,
  adapted: Pick<VisitorFoodDiscovery, 'categories' | 'venues' | 'nearbyVenues'>
): string {
  const basis = JSON.stringify({
    r: regionSlug,
    c: adapted.categories.map((c) => c.slug),
    v: adapted.venues.map((v) => [v.id, v.name, (v.ratings || []).map((r) => r.value)]),
    n: (adapted.nearbyVenues || []).map((v) => [v.id, v.distanceMeters]),
  });
  let h = 0x811c9dc5;
  for (let i = 0; i < basis.length; i++) {
    h ^= basis.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `v3-${h.toString(16).padStart(8, '0')}`;
}

/**
 * Returns only the published region directory metadata for the initial root shell.
 * Venues/categories are loaded on-demand from the statically cached region endpoint,
 * shrinking initial HTML payload without exposing any unpublished drafts or admin data.
 */
export function getDirectoryOnlyFoodDiscovery(): VisitorFoodDiscovery {
  return {
    locations: V3_LOCATIONS,
    categories: [],
    venues: [],
    nearbyVenues: [],
  };
}

export async function getStaticRegionVenuePayload(
  slug: string
): Promise<StaticRegionVenuePayload | null> {
  if (!slug || typeof slug !== 'string' || !REGION_SLUG_REGEX.test(slug)) {
    return null;
  }

  const raw = await readIntegrationDiscovery(slug, '');
  if (!raw) {
    return null;
  }

  const adapted = toFoodDiscovery(raw);

  return {
    regionSlug: raw.region.slug,
    version: computeRegionPayloadVersion(raw.region.slug, adapted),
    categories: adapted.categories,
    venues: adapted.venues,
    nearbyVenues: adapted.nearbyVenues || [],
  };
}
