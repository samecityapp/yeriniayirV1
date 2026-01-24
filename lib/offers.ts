import { supabaseAdmin as supabase } from './supabase-admin';
import { Offer } from './types';

export const offers = {
    async getAll(): Promise<Offer[]> {
        const { data, error } = await supabase
            .from('offers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getBySlug(slug: string): Promise<Offer | null> {
        // Updated to use array fetch to avoid potential issues with single()/maybeSingle()
        const { data, error } = await supabase
            .from('offers')
            .select('*')
            .eq('slug', slug)
            .limit(1);

        if (error) throw error;
        return (data && data.length > 0) ? data[0] : null;
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
