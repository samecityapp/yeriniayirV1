'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';
import { requireOfferAdminAccess } from '@/lib/admin/offerAdminGuard';
import { offers } from '@/lib/offers';
import { getEmergencyMode } from '@/lib/pilot/emergencyMode';
import { enforceRateLimit } from '@/lib/pilot/rateLimit';
import { IncludedItem } from '@/lib/types';

const SUPPORTED_OFFER_LOCALES = ['tr', 'en', 'el'] as const;

const IncludedItemSchema = z
  .object({
    id: z.string().trim().min(1).max(80),
    title: z.string().trim().max(160),
    description: z.string().trim().max(400),
    isActive: z.boolean(),
    isCustom: z.boolean().optional(),
  })
  .strict();

const OfferIdSchema = z.string().trim().uuid('Geçersiz teklif kimliği.');

const OfferPayloadSchema = z
  .object({
    hotel_name: z.string().trim().min(1, 'Otel adı zorunludur.').max(160),
    slug: z
      .string()
      .trim()
      .min(1, 'Slug zorunludur.')
      .max(120)
      .regex(
        /^[a-z0-9][a-z0-9_-]*$/,
        'Slug yalnız küçük harf, rakam, "-" ve "_" karakterlerinden oluşmalıdır.'
      ),
    price: z.string().trim().min(1, 'Fiyat zorunludur.').max(40),
    currency: z.enum(['TL', 'USD', 'EUR', 'GBP']).default('TL'),
    region: z.string().trim().min(1, 'Bölge zorunludur.').max(100),
    promo_text: z.string().trim().max(240).optional().default(''),
    included_items: z.array(IncludedItemSchema).max(20).nullable(),
  })
  .strict();

function readFormString(data: FormData, field: string): string {
  const value = data.get(field);
  return typeof value === 'string' ? value : '';
}

function parseOfferFormData(
  data: FormData
):
  | { ok: true; data: z.infer<typeof OfferPayloadSchema> }
  | { ok: false; error: string } {
  const rawIncludedItems = data.get('included_items');
  let includedItems: IncludedItem[] | null = null;

  if (typeof rawIncludedItems === 'string' && rawIncludedItems.trim() !== '') {
    try {
      includedItems = JSON.parse(rawIncludedItems);
    } catch {
      return { ok: false, error: 'Dahil olan maddeler JSON formatı geçersiz.' };
    }
  } else if (rawIncludedItems !== null && typeof rawIncludedItems !== 'string') {
    return { ok: false, error: 'Dahil olan maddeler alanı geçersiz.' };
  }

  const parsed = OfferPayloadSchema.safeParse({
    hotel_name: readFormString(data, 'hotel_name'),
    slug: readFormString(data, 'slug'),
    price: readFormString(data, 'price'),
    currency: readFormString(data, 'currency') || 'TL',
    region: readFormString(data, 'region'),
    promo_text: readFormString(data, 'promo_text'),
    included_items: includedItems,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || 'Teklif bilgileri doğrulanamadı.',
    };
  }

  return { ok: true, data: parsed.data };
}

function revalidateOfferUrls(...slugs: Array<string | null | undefined>) {
  const uniqueSlugs = Array.from(
    new Set(
      slugs.filter((slug): slug is string => typeof slug === 'string' && slug.trim().length > 0)
    )
  );
  for (const lang of SUPPORTED_OFFER_LOCALES) {
    revalidatePath(`/${lang}/jilinrime/teklif-yonetimi`, 'page');
    for (const slug of uniqueSlugs) {
      revalidatePath(`/${lang}/${slug}`, 'page');
    }
  }
}

async function authorizeAndRateLimitOfferAction() {
  if (getEmergencyMode() === 'lockdown') {
    return {
      ok: false as const,
      error: 'Acil durum kilidi aktif.',
      status: 503,
    };
  }
  const rl = await enforceRateLimit(await headers(), 'costly_admin', { scope: 'action' });
  if (!rl.ok) {
    return {
      ok: false as const,
      error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.',
      status: rl.status,
    };
  }
  return requireOfferAdminAccess({ requireSameOrigin: true });
}

export async function createOffer(data: FormData) {
  const auth = await authorizeAndRateLimitOfferAction();
  if (!auth.ok) {
    return { success: false, error: auth.error, status: auth.status };
  }

  const parsed = parseOfferFormData(data);
  if (!parsed.ok) {
    return { success: false, error: parsed.error, status: 400 };
  }

  try {
    const created = await offers.create(auth.capability, parsed.data);
    revalidateOfferUrls(created?.slug ?? parsed.data.slug);
    return { success: true };
  } catch (error: unknown) {
    console.error('Create Offer Error:', error);
    const errObj = error as { code?: string; message?: string };
    let errorMessage = errObj?.message || 'Teklif oluşturulamadı.';

    if (errObj?.code === '23505' || errorMessage.includes('duplicate key')) {
      errorMessage =
        "Bu URL (slug) zaten bir teklifte kullanılıyor. Lütfen 'slug' alanını değiştirin.";
    }

    return { success: false, error: errorMessage };
  }
}

export async function updateOffer(id: string, data: FormData) {
  const auth = await authorizeAndRateLimitOfferAction();
  if (!auth.ok) {
    return { success: false, error: auth.error, status: auth.status };
  }

  const parsedId = OfferIdSchema.safeParse(id);
  if (!parsedId.success) {
    return {
      success: false,
      error: parsedId.error.issues[0]?.message || 'Geçersiz teklif kimliği.',
      status: 400,
    };
  }

  const parsed = parseOfferFormData(data);
  if (!parsed.ok) {
    return { success: false, error: parsed.error, status: 400 };
  }

  try {
    const { offer, previousSlug } = await offers.update(auth.capability, parsedId.data, parsed.data);
    revalidateOfferUrls(previousSlug, offer?.slug ?? parsed.data.slug);
    return { success: true };
  } catch (error: unknown) {
    console.error('Update Offer Error:', error);
    const errObj = error as { message?: string };
    return {
      success: false,
      error: errObj?.message || 'Failed to update offer',
    };
  }
}

export async function deleteOffer(id: string) {
  const auth = await authorizeAndRateLimitOfferAction();
  if (!auth.ok) {
    return { success: false, error: auth.error, status: auth.status };
  }

  const parsedId = OfferIdSchema.safeParse(id);
  if (!parsedId.success) {
    return {
      success: false,
      error: parsedId.error.issues[0]?.message || 'Geçersiz teklif kimliği.',
      status: 400,
    };
  }

  try {
    const deletedSlug = await offers.delete(auth.capability, parsedId.data);
    revalidateOfferUrls(deletedSlug);
    return { success: true };
  } catch (error: unknown) {
    console.error('Delete Offer Error:', error);
    const errObj = error as { message?: string };
    return {
      success: false,
      error: errObj?.message || 'Teklif silinemedi.',
    };
  }
}
