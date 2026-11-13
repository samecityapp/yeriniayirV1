import type {FoodLocation, VisitorFoodDiscovery} from './types';
const normalize=(text:string)=>text.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
/** In-memory UI queries only. Input has already passed the server visitor allowlist. */
export function createRealFoodProvider(data:VisitorFoodDiscovery){
 return {
  searchLocations:(query:string)=>data.locations.filter(l=>normalize([l.name,l.displayName,...(l.aliases||[])].join(' ')).includes(normalize(query.trim()))),
  getReadyRegions:()=>data.locations.filter(l=>l.status==='published'),
  getLocationBySlug:(slug:string):FoodLocation|undefined=>data.locations.find(l=>l.status==='published'&&(l.slug===slug||l.id===slug||(slug==='kadikoy-carsi'&&l.slug==='kadikoy')||((slug==='merkez-kusadasi-aydin'||slug==='guzelcamli'||slug==='davutlar'||slug==='kusadasi-aydin')&&l.slug==='kusadasi')||((slug==='gaziantep-merkez'||slug==='sahinbey'||slug==='sehitkamil'||slug==='kalealti-sahinbey-gaziantep')&&l.slug==='gaziantep'))),
  getRegionCategories:(id:string)=>data.locations.some(l=>l.id===id)?data.categories.filter(c=>data.venues.some(v=>v.categorySlugs.includes(c.slug))):[],
  getCategoryResult:(id:string,slug:string)=>{
   const location=data.locations.find(l=>l.id===id),category=data.categories.find(c=>c.slug===slug);
   return location&&category?{location,category,coreVenues:data.venues.filter(v=>v.categorySlugs.includes(slug)),nearbyVenues:(data.nearbyVenues||[]).filter(v=>v.categorySlugs.includes(slug)),isDemo:false}:undefined;
  },
 };
}
