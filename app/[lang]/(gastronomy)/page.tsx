import type { Metadata } from 'next';
import { GastronomyPageClient } from '@/components/food/GastronomyPageClient';
import { isLocalFoodPreviewSync } from '@/lib/food/localPreview';
import { getDirectoryOnlyFoodDiscovery } from '@/lib/food/regionDiscovery';

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const isEn = params.lang === 'en';
  const preview = isLocalFoodPreviewSync();

  return {
    title: isEn
      ? 'Yerini Ayır — Verified Local Gastronomy Guide'
      : 'Yerini Ayır — Doğrulanmış Yerel Gastronomi Rehberi',
    description: isEn
      ? 'Discover independent coffee roasters, neighborhood kitchens, bakeries and local culinary stops.'
      : 'Kahvecileri, yemek mekanlarını, ekşi maya fırınları ve doğrulanmış yerel lezzet duraklarını keşfet.',
    ...(preview ? { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } } : {}),
  };
}

export default async function GastronomyRootPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang === 'en' ? 'en' : 'tr';

  return (
    <GastronomyPageClient
      discovery={getDirectoryOnlyFoodDiscovery()}
      lang={lang}
      embedded={false}
    />
  );
}
