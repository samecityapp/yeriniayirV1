import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis and Ratelimit for API
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Stricter limit for tracking events (e.g., 5 requests per 10 seconds per IP)
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
    analytics: true,
    prefix: '@upstash/ratelimit/api/track-event',
});

// Validation Schema
const eventSchema = z.object({
    hotel_id: z.string().uuid(),
    event_type: z.enum(['view', 'click', 'booking_click', 'contact_click']),
    device_type: z.string().optional(),
    metadata: z.record(z.any()).optional(),
});

export async function POST(request: Request) {
    try {
        // 1. Rate Limiting
        const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
        if (process.env.NODE_ENV === 'production') {
            const { success } = await ratelimit.limit(ip);
            if (!success) {
                return NextResponse.json(
                    { error: 'Too Many Requests' },
                    { status: 429 }
                );
            }
        }

        const body = await request.json();

        // 2. Input Validation
        const validationResult = eventSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const { hotel_id, event_type, device_type, metadata } = validationResult.data;

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
