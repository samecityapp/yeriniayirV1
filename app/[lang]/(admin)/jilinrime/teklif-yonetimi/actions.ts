'use server';

import { offers } from '@/lib/offers';
import { Offer } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getOffers() {
    return await offers.getAll();
}

export async function createOffer(data: FormData) {
    const hotel_name = data.get('hotel_name') as string;
    const slug = data.get('slug') as string;
    const price = data.get('price') as string;
    const region = data.get('region') as string;
    const included_items_json = data.get('included_items') as string;

    let included_items = null;
    try {
        if (included_items_json) {
            included_items = JSON.parse(included_items_json);
        }
    } catch (e) {
        console.error("Error parsing included_items", e);
    }

    await offers.create({
        hotel_name,
        slug,
        price,
        region,
        included_items
    });

    revalidatePath('/[lang]/(admin)/jilinrime/teklif-yonetimi');

    // Server-Side Warmup (Trigger Cache Generation)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yeriniayir.com';
    try {
        console.log(`Warming up: ${baseUrl}/tr/${slug}`);
        await fetch(`${baseUrl}/tr/${slug}`, { method: 'GET' });
        await fetch(`${baseUrl}/en/${slug}`, { method: 'GET' });
    } catch (e) {
        console.error("Warmup failed:", e);
    }

    export async function updateOffer(id: string, data: FormData) {
        const hotel_name = data.get('hotel_name') as string;
        const slug = data.get('slug') as string;
        const price = data.get('price') as string;
        const region = data.get('region') as string;
        const included_items_json = data.get('included_items') as string;

        // Parse JSON if valid, otherwise undefined (which Supabase might treat as null or error if not careful, but update ignores undefined keys usually? No, update replaces. Let's send what we have.)
        let included_items = null;
        try {
            if (included_items_json) {
                included_items = JSON.parse(included_items_json);
            }
        } catch (e) {
            console.error("Error parsing included_items:", e);
        }

        await offers.update(id, {
            hotel_name,
            slug,
            price,
            region,
            included_items
        });

        revalidatePath('/[lang]/(admin)/jilinrime/teklif-yonetimi');
        revalidatePath(`/tr/${slug}`);
        revalidatePath(`/en/${slug}`);
    }

    export async function deleteOffer(id: string) {
        await offers.delete(id);
        revalidatePath('/[lang]/(admin)/jilinrime/teklif-yonetimi');
    }
