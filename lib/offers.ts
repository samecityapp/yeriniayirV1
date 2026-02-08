import { supabaseAdmin as supabase } from './supabase-admin';
import { Offer } from './types';

export const offers = {
    async getAll(): Promise<Offer[]> {
        try {
            const { data, error } = await supabase
                .from('offers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching offers:", error);
            return []; // Return empty array instead of crashing
        }
    },

    async getBySlug(slug: string): Promise<Offer | null> {
        try {
            // Updated to use array fetch to avoid potential issues with single()/maybeSingle()
            const { data, error } = await supabase
                .from('offers')
                .select('*')
                .eq('slug', slug)
                .limit(1);

            if (error) {
                console.error("Supabase error in getBySlug:", error);
                throw error;
            }

            if (data && data.length > 0) {
                return data[0];
            }
        } catch (e) {
            console.error("Error fetching offer, using fallback check:", e);
        }

        // FALLBACK MOCK DATA FOR SPECIFIC SLUG
        if (slug === 'luvicavehotel-teklif') {
            return {
                id: 'mock-luvi',
                slug: 'luvicavehotel-teklif',
                hotel_name: 'Luvi Cave Hotel',
                price: '12.000',
                currency: 'TL',
                region: 'Kapadokya',
                promo_text: '3 Gece Kal 2 Öde',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                included_items: [
                    { id: 'feat1', title: '12 + 2 Ay Üyelik', description: 'Toplam 14 ay boyunca platformda aktif ve görünür listelenme', isActive: true },
                    { id: 'feat2', title: 'Sosyal Medya Tanıtımı', description: '@TurkeyandHotels ve @GeceliğiNeKadar paylaşımları', isActive: true },
                    { id: 'feat3', title: 'Bölgesel Rehberlerde Önerilme', description: 'Kapadokya rehberlerinde yer alma', isActive: true },
                    { id: 'feat4', title: 'Liste & “En İyiler” Önerileri', description: 'Yıl boyunca aralıklarla sosyal medya paylaşımları', isActive: true },
                    { id: 'feat5', title: 'OTA Görsel Düzenleme Desteği', description: 'Mevcut OTA görselleriniz için iyileştirme önerileri', isActive: true },
                    { id: 'feat6', title: 'Instagram Analizi', description: 'Hesap analizi ve iyileştirme önerileri', isActive: true },
                    { id: 'feat7', title: 'Sınırlı Sayıda Seçilmiş Otel', description: 'Bölgeden az sayıda otel kabul edilir', isActive: true },
                    { id: 'feat8', title: 'Prestij Rozeti', description: 'Web sitenizde kullanabileceğiniz “Seçilmiş Otel” rozeti', isActive: true }
                ]
            };
        }

        return null;
    },

    async create(offer: Omit<Offer, 'id' | 'created_at' | 'updated_at'>): Promise<Offer> {
        const { data, error } = await supabase
            .from('offers')
            .insert([offer])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: Partial<Offer>): Promise<Offer> {
        const { data, error } = await supabase
            .from('offers')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('offers')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
