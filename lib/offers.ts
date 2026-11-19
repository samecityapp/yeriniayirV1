import { assertValidOfferAdminCapability, OfferAdminCapability } from './admin/offerAdminGuard';
import { isSupabaseIsolated, supabase } from './supabase';
import { assertSupabaseAdminReady, supabaseAdmin, validatedAdminTarget } from './supabase-admin';
import { Offer } from './types';

const PUBLIC_SLUG_REGEX = /^[A-Za-z0-9_-]{1,120}$/;
const ADMIN_SLUG_REGEX = /^[a-z0-9][a-z0-9_-]{0,119}$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertAdminCapabilityMatchesWriteTarget(capability: OfferAdminCapability): void {
  assertValidOfferAdminCapability(capability);
  assertSupabaseAdminReady();
  const writeTarget = validatedAdminTarget();
  if (
    capability.targetUrl !== writeTarget.url ||
    capability.projectRef !== writeTarget.ref ||
    capability.environment !== writeTarget.environment
  ) {
    throw new Error('SECURITY VIOLATION: Offer admin capability does not match write target.');
  }
}

function pickOfferFields(
  input: Partial<Omit<Offer, 'id' | 'created_at' | 'updated_at'>>
): Partial<Omit<Offer, 'id' | 'created_at' | 'updated_at'>> {
  const result: Partial<Omit<Offer, 'id' | 'created_at' | 'updated_at'>> = {};
  if (input.hotel_name !== undefined) result.hotel_name = input.hotel_name;
  if (input.slug !== undefined) result.slug = input.slug;
  if (input.price !== undefined) result.price = input.price;
  if (input.currency !== undefined) result.currency = input.currency;
  if (input.region !== undefined) result.region = input.region;
  if (input.promo_text !== undefined) result.promo_text = input.promo_text;
  if (input.included_items !== undefined) result.included_items = input.included_items;
  return result;
}

export const offers = {
  async getAll(capability: OfferAdminCapability): Promise<Offer[]> {
    assertAdminCapabilityMatchesWriteTarget(capability);

    try {
      const { data, error } = await supabaseAdmin
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching offers:', error);
      return [];
    }
  },

  async getBySlug(slug: string): Promise<Offer | null> {
    if (!slug || typeof slug !== 'string' || !PUBLIC_SLUG_REGEX.test(slug)) {
      return null;
    }

    if (!isSupabaseIsolated) {
      try {
        // Public offer lookup must use least-privilege anon client (RLS enforced).
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('slug', slug)
          .limit(1);

        if (error) {
          console.error('Supabase error in getBySlug:', error);
          throw error;
        }

        if (data && data.length > 0) {
          return data[0];
        }
      } catch (e) {
        console.error('Error fetching offer:', e);
      }
    }

    // Legacy demo fallback only when explicitly enabled in isolated local development.
    if (
      slug === 'luvicavehotel-teklif' &&
      process.env.ALLOW_DEMO_OFFER_FALLBACK === '1' &&
      process.env.APP_ENVIRONMENT === 'development'
    ) {
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
          { id: 'feat8', title: 'Prestij Rozeti', description: 'Web sitenizde kullanabileceğiniz “Seçilmiş Otel” rozeti', isActive: true },
        ],
      };
    }

    return null;
  },

  async create(
    capability: OfferAdminCapability,
    offer: Omit<Offer, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Offer> {
    assertAdminCapabilityMatchesWriteTarget(capability);

    if (!offer.slug || !ADMIN_SLUG_REGEX.test(offer.slug)) {
      throw new Error('Invalid offer slug');
    }

    const sanitizedOffer = pickOfferFields(offer);
    const { data, error } = await supabaseAdmin
      .from('offers')
      .insert([sanitizedOffer])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(
    capability: OfferAdminCapability,
    id: string,
    updates: Partial<Offer>
  ): Promise<{ offer: Offer; previousSlug: string }> {
    assertAdminCapabilityMatchesWriteTarget(capability);

    if (!id || !UUID_REGEX.test(id)) {
      throw new Error('Invalid offer id');
    }

    if (updates.slug !== undefined && !ADMIN_SLUG_REGEX.test(updates.slug)) {
      throw new Error('Invalid offer slug');
    }

    const previous = await supabaseAdmin.from('offers').select('slug').eq('id', id).single();
    if (previous.error) throw previous.error;

    const sanitizedUpdates = pickOfferFields(updates);
    const { data, error } = await supabaseAdmin
      .from('offers')
      .update({ ...sanitizedUpdates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { offer: data, previousSlug: previous.data.slug };
  },

  async delete(capability: OfferAdminCapability, id: string): Promise<string | null> {
    assertAdminCapabilityMatchesWriteTarget(capability);

    if (!id || !UUID_REGEX.test(id)) {
      throw new Error('Invalid offer id');
    }

    const { data, error } = await supabaseAdmin
      .from('offers')
      .delete()
      .eq('id', id)
      .select('slug')
      .maybeSingle();

    if (error) throw error;
    return data?.slug ?? null;
  },
};
