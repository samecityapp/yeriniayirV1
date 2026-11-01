import {createVisitorCache,visitorSourceVersion} from './visitorCache';
import {readVisitorVenueSelection} from '../gastronomy/selectionReader';
import type {VisitorVenueData} from '../gastronomy/visitorContent';
import {copyVisitorGoogleRatings} from '../googlePlaces/visitorRating';

export interface IntegrationDiscovery {
 schemaVersion:1;dataKind:'real-research';mode:'integration-preparation';productionPublished:false;
 region:{id:string;slug:string;name:string;displayName:string;path:string[]};
 categories:{slug:string;id:string;label:string;isMustTry:boolean}[];
 categorySlug:string;venues:VisitorVenueData[];rituals:[];
}
export function buildIntegrationDiscovery(cards:VisitorVenueData[],region='moda',category='kahve'):IntegrationDiscovery|null {
 // No geographic or category fallback: a URL never receives another region's cards.
 if(region!=='moda'||category!=='kahve')return null;
 const venues=cards.filter(c=>c.categoryId==='coffee');
 return {schemaVersion:1,dataKind:'real-research',mode:'integration-preparation',productionPublished:false,
  region:{id:'moda-kadikoy',slug:'moda',name:'Moda',displayName:'Moda, Kadıköy, İstanbul',path:['istanbul','kadikoy','moda']},
  categories:venues.length?[{slug:'kahve',id:'coffee',label:'Kahve',isMustTry:false}]:[],categorySlug:category,
  venues:venues.map(v=>({id:v.id,name:v.name,location:v.location,categoryId:v.categoryId,description:v.description,
   whatToOrder:[...v.whatToOrder],menuFrom:[...(v.menuFrom||[])],alsoTry:[...v.alsoTry],beforeYouGo:[...v.beforeYouGo],photo:v.photo?{url:v.photo.url}:null,ratings:copyVisitorGoogleRatings(v.ratings)})),rituals:[]};
}
// Retain only our own visitor content; future licensed ratings bypass retained caching.
const cachedVisitor=createVisitorCache<IntegrationDiscovery|null>(30_000,4,data=>!data?.venues.some(v=>v.ratings.length));
export async function readIntegrationDiscovery(region='moda',category='kahve'){
 if(region!=='moda'||category!=='kahve')return null;
 if(process.env.GASTRONOMY_DATA_SOURCE==='supabase'){
  const {readCloudPublication}=await import('../../cloud/publication');
  return readCloudPublication(region+'/'+category);
 }
 const version=await visitorSourceVersion();
 return cachedVisitor(`${region}/${category}/${version}`,async()=>{
  const selection=await readVisitorVenueSelection('moda-kadikoy','coffee');
  const result=buildIntegrationDiscovery(selection.cards,region,category);
  return result;
 });
}
