import type {Metadata} from 'next';
import {GastronomyPageClient} from '@/components/food/GastronomyPageClient';
import {readIntegrationDiscovery} from '@/lib/pilot/integration/discovery';
import {toFoodDiscovery} from '@/lib/pilot/integration/foodAdapter';
import {isLocalFoodPreview} from '@/lib/food/localPreview';
export const dynamic='force-dynamic';
export async function generateMetadata(props:{params: Promise<{lang:string}>}):Promise<Metadata>{
 if(await isLocalFoodPreview())return {title:'Yerini Ayır — Gastronomi Keşif Rehberi',description:'Konum seç! Kahvecileri, yemek mekanlarını ve yerel deneyimleri keşfet.',robots:{index:false,follow:false,googleBot:{index:false,follow:false}}};
 const {generateMetadata}=await import('./_legacy/HotelHomePage');
 return generateMetadata({params:await props.params});
}
export default async function GastronomyHomePage(
 props:{params: Promise<{lang:string}>;searchParams: Promise<{region?:string;category?:string}>}
) {
 const searchParams = await props.searchParams;
 const params = await props.params;
 if(!(await isLocalFoodPreview())){const {default:HotelHomePage}=await import('./_legacy/HotelHomePage');return <HotelHomePage params={params}/>;}
 const targetRegion = searchParams.region || 'moda';
 const targetCategory = searchParams.category || '';
 const data=await readIntegrationDiscovery(targetRegion, targetCategory);
 if(!data)return <p>Rehber şu anda kullanılamıyor.</p>;
 return <GastronomyPageClient discovery={toFoodDiscovery(data)} initialLocationSlug={searchParams.region || data.region.slug} initialCategorySlug={searchParams.category || data.categorySlug} lang={params.lang==='en'?'en':'tr'}/>;
}
