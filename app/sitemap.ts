import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import {
  buildGeoPublicUrl,
  EN_SITE_ORIGIN,
  getGeoCities,
  getGeoDistrictHubs,
  TR_SITE_ORIGIN,
} from '@/lib/gastronomy-v3/geoCatalog';
import { PILOT_VENUE_IDS } from '@/lib/gastronomy-v3/geoPilot';
import { getPublishedV3Snapshot, V3_LOCATIONS } from '@/lib/gastronomy-v3/registry';
import { isSupabaseIsolated } from '@/lib/supabase';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const pushEntry = (item: MetadataRoute.Sitemap[number]) => {
    if (seenUrls.has(item.url)) return;
    seenUrls.add(item.url);
    entries.push(item);
  };

  // 1. Kök & Gastronomi Ana Dizin URL'leri
  pushEntry({
    url: TR_SITE_ORIGIN,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: { languages: { 'tr-TR': TR_SITE_ORIGIN, en: EN_SITE_ORIGIN, 'x-default': TR_SITE_ORIGIN } },
  });
  pushEntry({
    url: EN_SITE_ORIGIN,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: { languages: { 'tr-TR': TR_SITE_ORIGIN, en: EN_SITE_ORIGIN, 'x-default': TR_SITE_ORIGIN } },
  });

  for (const lang of ['tr', 'en'] as const) {
    pushEntry({
      url: buildGeoPublicUrl('/', lang),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
      alternates: {
        languages: {
          'tr-TR': buildGeoPublicUrl('/', 'tr'),
          en: buildGeoPublicUrl('/', 'en'),
        },
      },
    });
  }

  // 2. 21 Şehir Hub URL'leri
  for (const city of getGeoCities()) {
    for (const lang of ['tr', 'en'] as const) {
      pushEntry({
        url: buildGeoPublicUrl(`/${city.citySlug}`, lang),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            'tr-TR': buildGeoPublicUrl(`/${city.citySlug}`, 'tr'),
            en: buildGeoPublicUrl(`/${city.citySlug}`, 'en'),
          },
        },
      });
    }
  }

  // 3. Alt Semtleri Olan İlçe Hub Sayfaları
  for (const hub of getGeoDistrictHubs()) {
    const sub = `/${hub.citySlug}/${hub.districtSlug}`;
    for (const lang of ['tr', 'en'] as const) {
      pushEntry({
        url: buildGeoPublicUrl(sub, lang),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            'tr-TR': buildGeoPublicUrl(sub, 'tr'),
            en: buildGeoPublicUrl(sub, 'en'),
          },
        },
      });
    }
  }

  // 4. 92 Yayınlı Semt / Bölge ve Aktif Kategori Sayfaları
  for (const loc of V3_LOCATIONS) {
    const snap = getPublishedV3Snapshot(loc.slug);
    const verifiedDate = snap?.verifiedAt ? new Date(snap.verifiedAt) : new Date();
    const regionSub = `/${loc.path.join('/')}`;
    for (const lang of ['tr', 'en'] as const) {
      pushEntry({
        url: buildGeoPublicUrl(regionSub, lang),
        lastModified: verifiedDate,
        changeFrequency: 'weekly',
        priority: loc.slug === 'moda' || loc.slug === 'kadikoy' ? 0.95 : 0.9,
        alternates: {
          languages: {
            'tr-TR': buildGeoPublicUrl(regionSub, 'tr'),
            en: buildGeoPublicUrl(regionSub, 'en'),
          },
        },
      });
    }

    if (snap) {
      for (const cat of snap.categories) {
        const hasVenues = snap.venues.some(
          (v) => v.categoryId === cat.id || (v.secondaryCategoryIds || []).includes(cat.id)
        );
        if (!hasVenues) continue;
        const catSub = `${regionSub}/${cat.slug}`;
        for (const lang of ['tr', 'en'] as const) {
          pushEntry({
            url: buildGeoPublicUrl(catSub, lang),
            lastModified: verifiedDate,
            changeFrequency: 'weekly',
            priority: loc.slug === 'moda' || loc.slug === 'kadikoy' ? 0.9 : 0.8,
            alternates: {
              languages: {
                'tr-TR': buildGeoPublicUrl(catSub, 'tr'),
                en: buildGeoPublicUrl(catSub, 'en'),
              },
            },
          });
        }
      }
    }
  }

  // 5. Yalnızca 18 Doğrulanmış Moda & Kadıköy Pilot Mekân Sayfası (Asla 2.277 mekanın tamamı değil)
  for (const venueId of PILOT_VENUE_IDS) {
    const sub = `/mekan/${venueId}`;
    for (const lang of ['tr', 'en'] as const) {
      pushEntry({
        url: buildGeoPublicUrl(sub, lang),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            'tr-TR': buildGeoPublicUrl(sub, 'tr'),
            en: buildGeoPublicUrl(sub, 'en'),
          },
        },
      });
    }
  }

  // 6. Eski Otel & Makale URL'leri (Yalnız Supabase aktifken; hata olursa gastronomi sitemap'ini bozmaz)
  if (!isSupabaseIsolated) {
    try {
      const hotels = await db.hotels.getAll();
      for (const hotel of hotels) {
        pushEntry({
          url: `${TR_SITE_ORIGIN}/otel/${hotel.slug || hotel.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
        pushEntry({
          url: `${EN_SITE_ORIGIN}/hotel/${hotel.slug || hotel.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    } catch {
      // Keep verified gastronomy sitemap intact when legacy hotels table is unreachable
    }
  }

  pushEntry({
    url: `${TR_SITE_ORIGIN}/rehber`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: {
      languages: {
        'tr-TR': `${TR_SITE_ORIGIN}/rehber`,
        en: `${EN_SITE_ORIGIN}/guide`,
        'x-default': `${TR_SITE_ORIGIN}/rehber`,
      },
    },
  });
  pushEntry({
    url: `${EN_SITE_ORIGIN}/guide`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: {
      languages: {
        'tr-TR': `${TR_SITE_ORIGIN}/rehber`,
        en: `${EN_SITE_ORIGIN}/guide`,
        'x-default': `${TR_SITE_ORIGIN}/rehber`,
      },
    },
  });

  try {
    const [trArticles, enArticles] = await Promise.all([
      db.articles.getAll('tr'),
      db.articles.getAll('en'),
    ]);
    const enIds = new Set(enArticles.map((a: any) => String(a.id || a.slug_en || a.slug)));
    const trIds = new Set(trArticles.map((a: any) => String(a.id || a.slug)));

    for (const article of trArticles) {
      const modDate = new Date(article.published_at || article.updated_at || Date.now());
      const trUrl = encodeURI(`${TR_SITE_ORIGIN}/rehber/${article.slug}`);
      const slugEn = (article as { slug_en?: string }).slug_en || article.slug;
      const enUrl = encodeURI(`${EN_SITE_ORIGIN}/guide/${slugEn}`);
      const hasEnPair = enIds.has(String((article as any).id || slugEn));
      pushEntry({
        url: trUrl,
        lastModified: modDate,
        changeFrequency: 'weekly',
        priority: 0.75,
        ...(hasEnPair
          ? { alternates: { languages: { 'tr-TR': trUrl, en: enUrl, 'x-default': trUrl } } }
          : {}),
      });
    }

    for (const article of enArticles) {
      const modDate = new Date(article.published_at || article.updated_at || Date.now());
      const slugEn = (article as { slug_en?: string }).slug_en || article.slug;
      const trUrl = encodeURI(`${TR_SITE_ORIGIN}/rehber/${article.slug}`);
      const enUrl = encodeURI(`${EN_SITE_ORIGIN}/guide/${slugEn}`);
      const hasTrPair = trIds.has(String((article as any).id || article.slug));
      pushEntry({
        url: enUrl,
        lastModified: modDate,
        changeFrequency: 'weekly',
        priority: 0.75,
        ...(hasTrPair
          ? { alternates: { languages: { 'tr-TR': trUrl, en: enUrl, 'x-default': trUrl } } }
          : {}),
      });
    }
  } catch {
    // Keep verified gastronomy sitemap intact
  }

  pushEntry({
    url: `${TR_SITE_ORIGIN}/hakkimizda`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
    alternates: {
      languages: {
        'tr-TR': `${TR_SITE_ORIGIN}/hakkimizda`,
        en: `${EN_SITE_ORIGIN}/hakkimizda`,
        'x-default': `${TR_SITE_ORIGIN}/hakkimizda`,
      },
    },
  });
  pushEntry({
    url: `${EN_SITE_ORIGIN}/hakkimizda`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
    alternates: {
      languages: {
        'tr-TR': `${TR_SITE_ORIGIN}/hakkimizda`,
        en: `${EN_SITE_ORIGIN}/hakkimizda`,
        'x-default': `${TR_SITE_ORIGIN}/hakkimizda`,
      },
    },
  });

  return entries;
}
