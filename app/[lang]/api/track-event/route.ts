import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { hotel_id, event_type, device_type, metadata } = body;

        if (!hotel_id || !event_type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('analytics_events')
            .insert({
                hotel_id,
                event_type,
                device_type: device_type || 'unknown',
                metadata: metadata || {},
            });

        if (error) {
            console.error('Error tracking event:', error);
            return NextResponse.json(
                { error: 'Error tracking event' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in track-event route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
