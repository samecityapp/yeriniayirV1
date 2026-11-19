'use server';

import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { z } from 'zod';
import { requireOfferAdminAccess } from '@/lib/admin/offerAdminGuard';
import { ADMIN_COOKIE } from '@/lib/cloud/auth';
import { cloudClient } from '@/lib/cloud/client';
import { resolveRuntimeEmergencyMode } from '@/lib/pilot/emergencyMode';
import { enforceRateLimit } from '@/lib/pilot/rateLimit';
import { isSupabaseIsolated } from '@/lib/supabase';
import { assertSupabaseAdminReady, supabaseAdmin } from '@/lib/supabase-admin';

const UuidSchema = z.string().trim().uuid('Geçersiz kimlik.');

const LocalizedInputSchema = z.union([
  z.string().trim().max(8000),
  z.record(z.string(), z.unknown()),
]);

const RestaurantPayloadSchema = z
  .object({
    id: UuidSchema.optional(),
    category_id: z.string().trim().min(1).max(120),
    location: z.string().trim().min(1).max(200),
    name: z.string().trim().min(1).max(200),
    image_url: z.string().trim().max(1000).optional().default(''),
    description: z.string().trim().max(4000).optional().default(''),
    google_rating: z.number().finite().min(0).max(10).default(0),
    review_count: z.string().trim().max(100).optional().default(''),
    order_suggestion: z.string().trim().max(1000).optional().default(''),
    display_order: z.number().int().min(0).max(10000).default(0),
    notes: z
      .array(
        z.object({
          emoji: z.string().trim().max(32),
          text: z.string().trim().max(500),
        })
      )
      .max(20)
      .default([]),
  })
  .strict();

const TagCreateSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    slug: z.string().trim().min(1).max(160),
    icon: z.string().trim().min(1).max(80).default('Tag'),
  })
  .strict();

const TagUpdateSchema = TagCreateSchema;

const PriceTagCreateSchema = z
  .object({
    label: z.string().trim().min(1).max(120),
    slug: z.string().trim().min(1).max(120),
    min_price: z.number().finite().min(0),
    max_price: z.number().finite().min(0),
  })
  .strict()
  .refine((v) => v.max_price > v.min_price, 'Geçersiz fiyat aralığı.');

const HotelPayloadSchema = z
  .object({
    id: UuidSchema.optional(),
    name: LocalizedInputSchema,
    slug: z.string().trim().min(1).max(160),
    location: LocalizedInputSchema,
    latitude: z.number().finite().min(-90).max(90).nullable(),
    longitude: z.number().finite().min(-180).max(180).nullable(),
    rating: z.number().finite().min(0).max(10),
    price: z.number().int().min(0),
    currency: z.enum(['TL', 'USD', 'EUR', 'GBP']).default('TL'),
    tags: z.array(z.string().max(120)).max(50).default([]),
    image_url: z.string().trim().max(1000).default(''),
    gallery_images: z.array(z.string().max(1000)).max(50).default([]),
    amenities: z.array(z.string().max(120)).max(80).default([]),
    about: LocalizedInputSchema,
    description: LocalizedInputSchema,
    video_url: z.string().trim().max(1000).nullable(),
    video_thumbnail_url: z.string().trim().max(1000).nullable(),
    website_url: z.string().trim().max(1000).nullable(),
    instagram_url: z.string().trim().max(1000).nullable(),
    google_maps_url: z.string().trim().max(1000).nullable(),
    breakfast_description: LocalizedInputSchema.optional(),
    breakfast_images: z.array(z.string().max(1000)).max(30).nullable(),
    faqs: z.array(z.record(z.string(), z.unknown())).max(30).default([]),
  })
  .strict();

const GroupPayloadSchema = z
  .object({
    id: UuidSchema.optional(),
    title: z.string().trim().min(1).max(1000),
    domains: z.array(z.string().trim().max(120)).max(20).default([]),
    hotelIds: z.array(UuidSchema).min(1).max(20),
  })
  .strict();

export type LegacyAdminActionResult<T = undefined> =
  | (T extends undefined ? { ok: true } : { ok: true; data: T })
  | { ok: false; status: number; error: string };

async function getAuthorizedAdminClient(options: { readOnly: boolean }) {
  if (!options.readOnly && (await resolveRuntimeEmergencyMode()) === 'lockdown') {
    return {
      ok: false as const,
      status: 503,
      error: 'Acil durum kilidi aktif.',
    };
  }

  const rl = await enforceRateLimit(
    await headers(),
    options.readOnly ? 'admin_read' : 'costly_admin',
    { scope: 'action' }
  );
  if (!rl.ok) {
    return {
      ok: false as const,
      status: rl.status,
      error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.',
    };
  }

  const auth = await requireOfferAdminAccess({ requireSameOrigin: !options.readOnly });
  if (!auth.ok) {
    return {
      ok: false as const,
      status: auth.status,
      error: auth.error,
    };
  }

  if (auth.capability.mode === 'cloud_mfa') {
    const token = (await cookies()).get(ADMIN_COOKIE)?.value;
    if (!token) {
      return { ok: false as const, status: 401, error: 'Unauthorized' };
    }
    return { ok: true as const, client: cloudClient(token) };
  }

  assertSupabaseAdminReady();
  return { ok: true as const, client: supabaseAdmin };
}

function revalidatePublicCatalog() {
  for (const lang of ['tr', 'en', 'el']) {
    revalidatePath(`/${lang}`, 'page');
    revalidatePath(`/${lang}/search`, 'page');
  }
}

export async function fetchAdminDashboardStatsAction(): Promise<
  LegacyAdminActionResult<{
    viewsCount: number;
    clicksCount: number;
    events: Array<{ created_at: string; event_type: string }>;
    allEvents: Array<{ hotel_id: string | null; hotels?: { name?: unknown } | null }>;
  }>
> {
  const ctx = await getAuthorizedAdminClient({ readOnly: true });
  if (!ctx.ok) return ctx;
  if (isSupabaseIsolated) {
    return { ok: true, data: { viewsCount: 0, clicksCount: 0, events: [], allEvents: [] } };
  }

  const sinceIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [viewsRes, clicksRes, eventsRes, allEventsRes] = await Promise.all([
    ctx.client
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view'),
    ctx.client
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .in('event_type', ['website_click', 'instagram_click', 'whatsapp_click', 'phone_click']),
    ctx.client
      .from('analytics_events')
      .select('created_at, event_type')
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: true }),
    ctx.client
      .from('analytics_events')
      .select('hotel_id, hotels(name)')
      .not('hotel_id', 'is', null)
      .limit(1000),
  ]);

  const err = viewsRes.error || clicksRes.error || eventsRes.error || allEventsRes.error;
  if (err) {
    return { ok: false, status: 500, error: 'İstatistikler okunamadı.' };
  }

  return {
    ok: true,
    data: {
      viewsCount: viewsRes.count || 0,
      clicksCount: clicksRes.count || 0,
      events: (eventsRes.data as Array<{ created_at: string; event_type: string }>) || [],
      allEvents: (allEventsRes.data as any[]) || [],
    },
  };
}

export async function saveAdminRestaurantAction(
  rawInput: unknown
): Promise<LegacyAdminActionResult<{ id: string }>> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsed = RestaurantPayloadSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, status: 400, error: 'Geçersiz restoran verisi.' };
  }

  const { id, notes, ...restaurantData } = parsed.data;
  let restaurantId: string;

  if (id) {
    const { error } = await ctx.client.from('restaurants').update(restaurantData).eq('id', id);
    if (error) return { ok: false, status: 500, error: 'Restoran güncellenemedi.' };
    restaurantId = id;
    const { error: delNotesErr } = await ctx.client
      .from('restaurant_notes')
      .delete()
      .eq('restaurant_id', restaurantId);
    if (delNotesErr) return { ok: false, status: 500, error: 'Restoran notları temizlenemedi.' };
  } else {
    const { data, error } = await ctx.client
      .from('restaurants')
      .insert([restaurantData])
      .select('id')
      .single();
    if (error || !data?.id) {
      return { ok: false, status: 500, error: 'Restoran oluşturulamadı.' };
    }
    restaurantId = String(data.id);
  }

  if (notes.length > 0) {
    const { error: notesErr } = await ctx.client.from('restaurant_notes').insert(
      notes.map((note, idx) => ({
        restaurant_id: restaurantId,
        emoji: note.emoji,
        text: note.text,
        display_order: idx,
      }))
    );
    if (notesErr) return { ok: false, status: 500, error: 'Restoran notları kaydedilemedi.' };
  }

  revalidatePublicCatalog();
  return { ok: true, data: { id: restaurantId } };
}

export async function deleteAdminRestaurantAction(
  rawId: string
): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsedId = UuidSchema.safeParse(rawId);
  if (!parsedId.success) return { ok: false, status: 400, error: 'Geçersiz restoran kimliği.' };

  const { error } = await ctx.client.from('restaurants').delete().eq('id', parsedId.data);
  if (error) return { ok: false, status: 500, error: 'Restoran silinemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}


export async function createAdminTagAction(rawInput: unknown): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsed = TagCreateSchema.safeParse(rawInput);
  if (!parsed.success) return { ok: false, status: 400, error: 'Geçersiz etiket verisi.' };

  const { error } = await ctx.client.from('tags').insert([
    {
      name: parsed.data.name,
      slug: parsed.data.slug,
      icon: parsed.data.icon,
      is_featured: false,
    },
  ]);
  if (error) return { ok: false, status: 500, error: 'Etiket eklenemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}


export async function updateAdminTagAction(
  rawId: string,
  rawInput: unknown
): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsedId = UuidSchema.safeParse(rawId);
  const parsed = TagUpdateSchema.safeParse(rawInput);
  if (!parsedId.success || !parsed.success) {
    return { ok: false, status: 400, error: 'Geçersiz etiket verisi.' };
  }

  const { error } = await ctx.client
    .from('tags')
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      icon: parsed.data.icon,
    })
    .eq('id', parsedId.data);
  if (error) return { ok: false, status: 500, error: 'Etiket güncellenemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}


export async function softDeleteAdminTagAction(rawId: string): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsedId = UuidSchema.safeParse(rawId);
  if (!parsedId.success) return { ok: false, status: 400, error: 'Geçersiz etiket kimliği.' };

  const { error } = await ctx.client
    .from('tags')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', parsedId.data);
  if (error) return { ok: false, status: 500, error: 'Etiket silinemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}


export async function toggleAdminTagFeaturedAction(
  rawId: string,
  isFeatured: boolean
): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsedId = UuidSchema.safeParse(rawId);
  if (!parsedId.success || typeof isFeatured !== 'boolean') {
    return { ok: false, status: 400, error: 'Geçersiz istek.' };
  }

  const { error } = await ctx.client
    .from('tags')
    .update({ is_featured: isFeatured })
    .eq('id', parsedId.data);
  if (error) return { ok: false, status: 500, error: 'Etiket güncellenemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}


export async function createAdminPriceTagAction(
  rawInput: unknown
): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsed = PriceTagCreateSchema.safeParse(rawInput);
  if (!parsed.success) return { ok: false, status: 400, error: 'Geçersiz fiyat etiketi.' };

  const { error } = await ctx.client.from('price_tags').insert([parsed.data]);
  if (error) return { ok: false, status: 500, error: 'Fiyat etiketi eklenemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}


export async function softDeleteAdminPriceTagAction(
  rawId: string
): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsedId = UuidSchema.safeParse(rawId);
  if (!parsedId.success) return { ok: false, status: 400, error: 'Geçersiz kimlik.' };

  const { error } = await ctx.client
    .from('price_tags')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', parsedId.data);
  if (error) return { ok: false, status: 500, error: 'Fiyat etiketi silinemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}


export async function saveAdminHotelAction(
  rawInput: unknown
): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsed = HotelPayloadSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, status: 400, error: 'Geçersiz otel verisi.' };
  }

  const { id, ...hotelData } = parsed.data;
  if (id) {
    const { error } = await ctx.client.from('hotels').update(hotelData).eq('id', id);
    if (error) return { ok: false, status: 500, error: 'Otel güncellenemedi.' };
    for (const lang of ['tr', 'en', 'el']) {
      revalidatePath(`/${lang}/otel/${id}`, 'page');
      revalidatePath(`/${lang}/otel/${hotelData.slug}`, 'page');
    }
  } else {
    const { error } = await ctx.client.from('hotels').insert([hotelData]);
    if (error) return { ok: false, status: 500, error: 'Otel eklenemedi.' };
  }

  revalidatePublicCatalog();
  return { ok: true };
}


export async function deleteAdminHotelAction(rawId: string): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsedId = UuidSchema.safeParse(rawId);
  if (!parsedId.success) return { ok: false, status: 400, error: 'Geçersiz otel kimliği.' };

  const { error } = await ctx.client.from('hotels').delete().eq('id', parsedId.data);
  if (error) return { ok: false, status: 500, error: 'Otel silinemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}


export async function saveAdminGroupAction(rawInput: unknown): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsed = GroupPayloadSchema.safeParse(rawInput);
  if (!parsed.success) return { ok: false, status: 400, error: 'Geçersiz grup verisi.' };

  const { id, title, domains, hotelIds } = parsed.data;
  let groupId: string;

  if (id) {
    const { error } = await ctx.client
      .from('groups')
      .update({ title, domains, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return { ok: false, status: 500, error: 'Grup güncellenemedi.' };
    groupId = id;
    const { error: delErr } = await ctx.client.from('group_hotels').delete().eq('group_id', id);
    if (delErr) return { ok: false, status: 500, error: 'Grup otelleri güncellenemedi.' };
  } else {
    const { data, error } = await ctx.client
      .from('groups')
      .insert([{ title, is_published: false, domains }])
      .select('id')
      .single();
    if (error || !data?.id) return { ok: false, status: 500, error: 'Grup oluşturulamadı.' };
    groupId = String(data.id);
  }

  const { error: relErr } = await ctx.client.from('group_hotels').insert(
    hotelIds.map((hid, index) => ({
      group_id: groupId,
      hotel_id: hid,
      display_order: index,
    }))
  );
  if (relErr) return { ok: false, status: 500, error: 'Grup otelleri kaydedilemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}


export async function toggleAdminGroupPublishAction(
  rawId: string,
  isPublished: boolean
): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsedId = UuidSchema.safeParse(rawId);
  if (!parsedId.success || typeof isPublished !== 'boolean') {
    return { ok: false, status: 400, error: 'Geçersiz istek.' };
  }

  const { error } = await ctx.client
    .from('groups')
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq('id', parsedId.data);
  if (error) return { ok: false, status: 500, error: 'Yayın durumu güncellenemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}


export async function deleteAdminGroupAction(rawId: string): Promise<LegacyAdminActionResult> {
  const ctx = await getAuthorizedAdminClient({ readOnly: false });
  if (!ctx.ok) return ctx;

  const parsedId = UuidSchema.safeParse(rawId);
  if (!parsedId.success) return { ok: false, status: 400, error: 'Geçersiz grup kimliği.' };

  const { error } = await ctx.client
    .from('groups')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', parsedId.data);
  if (error) return { ok: false, status: 500, error: 'Grup silinemedi.' };

  revalidatePublicCatalog();
  return { ok: true };
}



export async function listAdminTagsAction(): Promise<LegacyAdminActionResult<any[]>> {
  const ctx = await getAuthorizedAdminClient({ readOnly: true });
  if (!ctx.ok) return ctx;
  const { data, error } = await ctx.client
    .from('tags')
    .select('*')
    .is('deleted_at', null)
    .order('name', { ascending: true });
  if (error) return { ok: false, status: 500, error: 'Etiketler yüklenemedi.' };
  return { ok: true, data: data || [] };
}

export async function listAdminPriceTagsAction(): Promise<LegacyAdminActionResult<any[]>> {
  const ctx = await getAuthorizedAdminClient({ readOnly: true });
  if (!ctx.ok) return ctx;
  const { data, error } = await ctx.client
    .from('price_tags')
    .select('*')
    .is('deleted_at', null)
    .order('min_price', { ascending: true });
  if (error) return { ok: false, status: 500, error: 'Fiyat etiketleri yüklenemedi.' };
  return { ok: true, data: data || [] };
}

export async function listAdminHotelsAction(): Promise<LegacyAdminActionResult<any[]>> {
  const ctx = await getAuthorizedAdminClient({ readOnly: true });
  if (!ctx.ok) return ctx;
  const { data, error } = await ctx.client
    .from('hotels')
    .select('*')
    .order('name', { ascending: true });
  if (error) return { ok: false, status: 500, error: 'Oteller yüklenemedi.' };
  return { ok: true, data: data || [] };
}

export async function getAdminHotelByIdAction(
  rawId: string
): Promise<LegacyAdminActionResult<Record<string, any> | null>> {
  const ctx = await getAuthorizedAdminClient({ readOnly: true });
  if (!ctx.ok) return ctx;
  const parsedId = UuidSchema.safeParse(rawId);
  if (!parsedId.success) return { ok: false, status: 400, error: 'Geçersiz otel kimliği.' };
  const { data, error } = await ctx.client
    .from('hotels')
    .select('*')
    .eq('id', parsedId.data)
    .maybeSingle();
  if (error) return { ok: false, status: 500, error: 'Otel bilgisi alınamadı.' };
  return { ok: true, data: data || null };
}

export async function listAdminRestaurantCategoriesAction(): Promise<
  LegacyAdminActionResult<any[]>
> {
  const ctx = await getAuthorizedAdminClient({ readOnly: true });
  if (!ctx.ok) return ctx;
  const { data, error } = await ctx.client
    .from('restaurant_categories')
    .select('*')
    .order('display_order');
  if (error) return { ok: false, status: 500, error: 'Kategoriler yüklenemedi.' };
  return { ok: true, data: data || [] };
}

export async function listAdminRestaurantsAction(
  location: string
): Promise<LegacyAdminActionResult<any[]>> {
  const ctx = await getAuthorizedAdminClient({ readOnly: true });
  if (!ctx.ok) return ctx;
  const safeLocation = String(location || '').trim().slice(0, 200);
  if (!safeLocation) return { ok: true, data: [] };
  const { data, error } = await ctx.client
    .from('restaurants')
    .select('*, notes:restaurant_notes(*)')
    .eq('location', safeLocation)
    .order('display_order');
  if (error) return { ok: false, status: 500, error: 'Restoranlar yüklenemedi.' };
  return { ok: true, data: data || [] };
}
