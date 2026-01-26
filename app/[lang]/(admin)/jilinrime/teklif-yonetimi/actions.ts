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

    if (!hotel_name || !slug || !price || !region) {
        throw new Error('All fields are required');
    }

    await offers.create({
        hotel_name,
        slug,
        price,
        region
    });

    revalidatePath('/[lang]/(admin)/jilinrime/teklif-yonetimi');
    revalidatePath(`/tr/${slug}`);
    revalidatePath(`/en/${slug}`);
}

export async function updateOffer(id: string, data: FormData) {
    const hotel_name = data.get('hotel_name') as string;
    const slug = data.get('slug') as string;
    const price = data.get('price') as string;
    const region = data.get('region') as string;

    await offers.update(id, {
        hotel_name,
        slug,
        price,
        region
    });

    revalidatePath('/[lang]/(admin)/jilinrime/teklif-yonetimi');
    revalidatePath(`/tr/${slug}`);
    revalidatePath(`/en/${slug}`);
}

export async function deleteOffer(id: string) {
    await offers.delete(id);
    revalidatePath('/[lang]/(admin)/jilinrime/teklif-yonetimi');
}
