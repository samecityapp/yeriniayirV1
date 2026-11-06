import type {Metadata} from 'next';
import {GastronomyPageClient} from '@/components/food/GastronomyPageClient';
import {readIntegrationDiscovery} from '@/lib/pilot/integration/discovery';
import {toFoodDiscovery} from '@/lib/pilot/integration/foodAdapter';
import {isLocalFoodPreview} from '@/lib/food/localPreview';
import HotelHomePage, {generateMetadata as generateHotelMetadata} from './_legacy/HotelHomePage';

export const dynamic='force-dynamic';

export async function generateMetadata(props:{params: Promise<{lang:string}>}):Promise<Metadata>{
 const params = await props.params;
 if(await isLocalFoodPreview()){
  return {
   title:'Yerini Ayır — Seçkin Oteller & Gastronomi Keşif Rehberi',
   description:'Kalabalıkların değil, bilenlerin tercih ettiği butik otelleri, kahvecileri, kahvaltıcıları ve restoranları keşfet.',
   robots:{index:false,follow:false,googleBot:{index:false,follow:false}}
  };
 }
 return generateHotelMetadata({params});
}

export default async function UnifiedHomePage(
 props:{params: Promise<{lang:string}>;searchParams: Promise<{region?:string;category?:string;view?:string}>}
) {
 const searchParams = await props.searchParams;
 const params = await props.params;
 const targetRegion = searchParams.region || 'moda';
 const targetCategory = searchParams.category || '';
 const data = await readIntegrationDiscovery(targetRegion, targetCategory);
 const lang = params.lang === 'en' ? 'en' : 'tr';

 // Eğer kullanıcı doğrudan gastronomi görünümünü açtıysa (?view=gastronomi) veya bir bölge seçtiyse (?region=...)
 // sayfanın aşağısında değil, doğrudan tam ekran orijinal Gastronomi deneyimi olarak açılır!
 if ((searchParams.view === 'gastronomi' || Boolean(searchParams.region)) && data) {
  return (
   <GastronomyPageClient
    discovery={toFoodDiscovery(data)}
    initialLocationSlug={searchParams.region}
    initialCategorySlug={searchParams.category}
    lang={lang}
    embedded={false}
   />
  );
 }

 const gastronomySection = data ? (
  <GastronomyPageClient
   discovery={toFoodDiscovery(data)}
   initialLocationSlug={searchParams.region}
   initialCategorySlug={searchParams.category}
   lang={lang}
   embedded={true}
  />
 ) : null;

 return <HotelHomePage params={params} gastronomySection={gastronomySection} />;
}
