import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { offers } from '@/lib/offers';
import OfferPageTemplate from '@/components/OfferPageTemplate';
import { Header } from '@/components/Header';
import type { IncludedItem } from '@/lib/types';

// This page catches all root-level slugs like /luvicavehotel-teklif
// It checks if it matches an Offer in the DB.

export const dynamicParams = true;
export const revalidate = 3600; // 1 Hour Cache

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
};

function sanitizeIncludedItems(raw: unknown): IncludedItem[] | null {
    let parsed: unknown = raw;
    if (typeof parsed === 'string') {
        try {
            parsed = JSON.parse(parsed);
        } catch (e) {
            console.error("Failed to parse included_items", e);
            return null;
        }
    }
    if (!Array.isArray(parsed)) {
        return null;
    }
    const sanitized = parsed.filter(
        (item): item is IncludedItem =>
            Boolean(item) &&
            typeof item === 'object' &&
            typeof (item as IncludedItem).id === 'string' &&
            (item as IncludedItem).id.length > 0
    );
    return sanitized.length > 0 ? sanitized : null;
}

export default async function DynamicOfferPage(props: { params: Promise<{ slug: string; lang: string }> }) {
    const params = await props.params;
    const { slug, lang } = params;

    const offer = await offers.getBySlug(slug);

    if (!offer) {
        notFound();
    }

    // Determine language, default to 'tr'
    const language = (lang === 'en' || lang === 'tr' || lang === 'el') ? lang : 'tr';

    const includedItems = sanitizeIncludedItems(offer.included_items);
    const safeHotelName = typeof offer.hotel_name === 'string' && offer.hotel_name.trim() ? offer.hotel_name.trim() : slug;
    const safePrice = offer.price !== undefined && offer.price !== null ? String(offer.price) : '';
    const safeCurrency = typeof offer.currency === 'string' && offer.currency.trim() ? offer.currency.trim() : 'TL';
    const safeRegion = typeof offer.region === 'string' && offer.region.trim() ? offer.region.trim() : 'Türkiye';
    const safePromoText = typeof offer.promo_text === 'string' ? offer.promo_text : undefined;

    return (
        <>
            <Header lang={language} variant="offer" />
            <OfferPageTemplate
                hotelName={safeHotelName}
                price={safePrice}
                currency={safeCurrency}
                region={safeRegion}
                lang={language}
                includedItems={includedItems}
                promoText={safePromoText}
            />

        </>
    );
}
