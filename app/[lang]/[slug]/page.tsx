import { notFound } from 'next/navigation';
import { offers } from '@/lib/offers';
import OfferPageTemplate from '@/components/OfferPageTemplate';
import { Header } from '@/components/Header';

// This page catches all root-level slugs like /luvicavehotel-teklif
// It checks if it matches an Offer in the DB.

export const dynamicParams = true;
export const revalidate = 3600; // 1 Hour Cache

export default async function DynamicOfferPage({ params }: { params: { slug: string; lang: string } }) {
    const { slug, lang } = params;

    const offer = await offers.getBySlug(slug);

    if (!offer) {
        notFound();
    }

    // Determine language, default to 'tr'
    const language = (lang === 'en' || lang === 'tr' || lang === 'el') ? lang : 'tr';

    // Defensive handling for included_items (in case DB returns string)
    let includedItems = offer.included_items;
    if (typeof includedItems === 'string') {
        try {
            // @ts-ignore
            includedItems = JSON.parse(includedItems);
        } catch (e) {
            console.error("Failed to parse included_items", e);
            includedItems = null;
        }
    }

    return (
        <>
            <Header lang={language} variant="offer" />
            <OfferPageTemplate
                hotelName={offer.hotel_name}
                price={offer.price}
                currency={offer.currency}
                region={offer.region}
                lang={language}
                includedItems={includedItems}
                promoText={offer.promo_text}
            />

        </>
    );
}
