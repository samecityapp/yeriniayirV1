import type {FoodLocation, VisitorFoodDiscovery} from './types';
const normalize=(text:string)=>text.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
/** In-memory UI queries only. Input has already passed the server visitor allowlist. */
export function createRealFoodProvider(data:VisitorFoodDiscovery){
 return {
  searchLocations:(query:string)=>data.locations.filter(l=>normalize([l.name,l.displayName,...(l.aliases||[])].join(' ')).includes(normalize(query.trim()))),
  getReadyRegions:()=>data.locations,
  getLocationBySlug:(slug:string):FoodLocation|undefined=>data.locations.find(l=>l.slug===slug),
  getRegionCategories:(id:string)=>data.locations.some(l=>l.id===id)?data.categories:[],
  getCategoryResult:(id:string,slug:string)=>{
   const location=data.locations.find(l=>l.id===id),category=data.categories.find(c=>c.slug===slug);
   return location&&category?{location,category,coreVenues:data.venues.filter(v=>v.categorySlugs.includes(slug)),nearbyVenues:[],isDemo:false}:undefined;
  },
 };
}
