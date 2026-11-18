import { NextResponse } from 'next/server';
import { getStaticRegionVenuePayload } from '@/lib/food/regionDiscovery';
import { V3_LOCATIONS } from '@/lib/gastronomy-v3/registry';

export const dynamic = 'force-static';
export const revalidate = 3600;

export function generateStaticParams() {
  return V3_LOCATIONS.map((loc) => ({ slug: loc.slug }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const payload = await getStaticRegionVenuePayload(slug);
  const isStaging = process.env.APP_ENVIRONMENT === 'staging';

  if (!payload) {
    return NextResponse.json(
      { error: 'Region not found' },
      {
        status: 404,
        headers: {
          'Cache-Control': isStaging
            ? 'private, no-store, max-age=0'
            : 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  }

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': isStaging
        ? 'private, no-store, max-age=0'
        : 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
