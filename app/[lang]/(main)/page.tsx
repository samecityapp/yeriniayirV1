import type {Metadata} from 'next';
import {GastronomyPageClient} from '@/components/food/GastronomyPageClient';
import {readIntegrationDiscovery} from '@/lib/pilot/integration/discovery';
import {toFoodDiscovery} from '@/lib/pilot/integration/foodAdapter';
import {isLocalFoodPreview} from '@/lib/food/localPreview';

export const dynamic='force-dynamic';

export async function generateMetadata(props:{params: Promise<{lang:string}>}):Promise<Metadata>{
 const params = await props.params;
 const isEn = params.lang === 'en';
 const preview = await isLocalFoodPreview();
 return {
  title: isEn
   ? 'Yerini Ayır — Verified Local Gastronomy Guide'
   : 'Yerini Ayır — Doğrulanmış Yerel Gastronomi Rehberi',
  description: isEn
   ? 'Discover independent coffee roasters, neighborhood kitchens, bakeries and local culinary stops.'
   : 'Kahvecileri, yemek mekanlarını, ekşi maya fırınları ve doğrulanmış yerel lezzet duraklarını keşfet.',
  ...(preview ? {robots:{index:false,follow:false,googleBot:{index:false,follow:false}}} : {}),
 };
}

export default async function UnifiedHomePage(
 props:{params: Promise<{lang:string}>;searchParams: Promise<{region?:string;category?:string;view?:string}>}
) {
 const searchParams = await props.searchParams;
 const params = await props.params;
 const targetRegion = searchParams.region || 'moda';
 const targetCategory = searchParams.category || '';
 const data = await readIntegrationDiscovery(targetRegion, targetCategory);
 const resolvedData = data || (await readIntegrationDiscovery('moda', ''));
 const lang = params.lang === 'en' ? 'en' : 'tr';

 if (!resolvedData) {
  return null;
 }

 return (
  <GastronomyPageClient
   discovery={toFoodDiscovery(resolvedData)}
   initialLocationSlug={searchParams.region}
   initialCategorySlug={searchParams.category}
   lang={lang}
   embedded={false}
  />
 );
}
