import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hotelId = searchParams.get('hotelId');

    if (!hotelId) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const userIp = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || '';

    // Insert click record
    const clickPromise = supabase
      .from('hotel_clicks')
      .insert({
        hotel_id: hotelId,
        user_ip: userIp,
        user_agent: userAgent,
        referrer: referrer
      });

    // Get hotel URL
    const hotelPromise = supabase
      .from('hotels')
      .select('website_url')
      .eq('id', hotelId)
      .maybeSingle();

    const [clickResult, hotelResult] = await Promise.all([clickPromise, hotelPromise]);

    if (clickResult.error) {
      console.error('Failed to track click:', clickResult.error);
    }

    if (hotelResult.error || !hotelResult.data || !hotelResult.data.website_url) {
      // If hotel not found or no URL, redirect home
      return NextResponse.redirect(new URL('/', request.url));
    }

    const bookingUrl = hotelResult.data.website_url;

    // Create redirect response
    const response = NextResponse.redirect(bookingUrl);

    // Add custom header for debugging/tracking if needed
    response.headers.set('X-Hotel-Click-Tracked', 'true');

    return response;

  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
