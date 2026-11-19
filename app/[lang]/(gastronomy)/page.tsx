import type { Metadata } from 'next';
import { GastronomyPageClient } from '@/components/food/GastronomyPageClient';
import { GeoRootCrawlDirectory } from '@/components/food/GeoSemanticSections';
import { isLocalFoodPreviewSync } from '@/lib/food/localPreview';
import { getDirectoryOnlyFoodDiscovery } from '@/lib/food/regionDiscovery';
import {
  buildGeoPublicUrl,
  buildGeoRootAlternates,
  EN_SITE_ORIGIN,
  getGeoCities,
  TR_SITE_ORIGIN,
} from '@/lib/gastronomy-v3/geoCatalog';
import { buildDirectoryCollectionJsonLd } from '@/lib/gastronomy-v3/geoSchema';

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const isEn = params.lang === 'en';
  const lang = isEn ? 'en' : 'tr';
  const preview = isLocalFoodPreviewSync();

  return {
    title: isEn
      ? 'Yerini Ayır — Verified Local Gastronomy Guide'
      : 'Yerini Ayır — Doğrulanmış Yerel Gastronomi Rehberi',
    description: isEn
      ? 'Discover independent coffee roasters, neighborhood kitchens, bakeries and verified local culinary stops across 21 Turkish cities.'
      : 'Türkiye genelinde 21 il ve 92 bölgede bağımsız kahvecileri, yemek mekanlarını, ekşi maya fırınları ve doğrulanmış yerel lezzet duraklarını keşfet.',
    ...(preview
      ? { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }
      : { alternates: buildGeoRootAlternates(lang) }),
  };
}

export default async function GastronomyRootPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang === 'en' ? 'en' : 'tr';
  const isEn = lang === 'en';
  const preview = isLocalFoodPreviewSync();
  const discovery = getDirectoryOnlyFoodDiscovery();
  const cities = getGeoCities();

  const rootCollectionJsonLd = buildDirectoryCollectionJsonLd({
    pageUrl: isEn ? EN_SITE_ORIGIN : TR_SITE_ORIGIN,
    name: isEn
      ? 'Yerini Ayır — Verified Neighborhood Gastronomy Directory'
      : 'Yerini Ayır — Doğrulanmış Mahalle ve Şehir Gastronomi Rehberi',
    description: isEn
      ? 'Curated independent coffee, wood-fired pizza, burger, breakfast, and local cuisine selections across 92 districts and neighborhoods.'
      : 'Sıfır zincir ve sıkı semt sınırı kurallarıyla doğrulanmış 21 il ve 92 bölge seçkisi.',
    lang,
    items: [
      {
        name: isEn ? 'Full Gastronomy Index' : 'Türkiye Gastronomi Seçki Dizini',
        url: buildGeoPublicUrl('/', lang),
      },
      {
        name: isEn ? 'Moda, Kadikoy Guide' : 'Moda, Kadıköy Gastronomi Seçkisi',
        url: buildGeoPublicUrl('/istanbul/kadikoy/moda', lang),
      },
      {
        name: isEn ? 'Kadikoy Center Guide' : 'Kadıköy Merkez & Çarşı Seçkisi',
        url: buildGeoPublicUrl('/istanbul/kadikoy', lang),
      },
      ...cities.map((c) => ({
        name: c.cityName,
        url: buildGeoPublicUrl(`/${c.citySlug}`, lang),
      })),
    ],
  });

  return (
    <>
      <GastronomyPageClient
        discovery={discovery}
        lang={lang}
        embedded={false}
      />
      <GeoRootCrawlDirectory lang={lang} />
      {!preview && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootCollectionJsonLd) }}
        />
      )}
    </>
  );
}
