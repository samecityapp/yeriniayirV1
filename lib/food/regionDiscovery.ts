import type { VisitorFoodDiscovery } from '@/lib/food/types';
import { V3_LOCATIONS } from '@/lib/gastronomy-v3/registry';
import { readIntegrationDiscovery } from '@/lib/pilot/integration/discovery';
import { toFoodDiscovery } from '@/lib/pilot/integration/foodAdapter';

export interface StaticRegionVenuePayload {
  regionSlug: string;
  categories: VisitorFoodDiscovery['categories'];
  venues: VisitorFoodDiscovery['venues'];
  nearbyVenues: VisitorFoodDiscovery['nearbyVenues'];
}

const REGION_SLUG_REGEX = /^[a-z0-9-]{1,80}$/;

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
    categories: adapted.categories,
    venues: adapted.venues,
    nearbyVenues: adapted.nearbyVenues || [],
  };
}
