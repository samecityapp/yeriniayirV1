import {assignVenueIllustrations} from '../../food/illustrations';
import type {IntegrationDiscovery} from './discovery';
import type {VisitorFoodDiscovery} from '../../food/types';
import {copyVisitorGoogleRatings} from '../googlePlaces/visitorRating';
import {getVerifiedGoogleRatings} from '../googlePlaces/verifiedRatings';
import {SYNTHESIZED_VENUE_INSIGHTS} from '../gastronomy/visitorContent';

/** Never accepts the admin card or uses the Antigravity prototype provider. */
export function toFoodDiscovery(data:IntegrationDiscovery):VisitorFoodDiscovery {
 const illustrations=assignVenueIllustrations(data.venues);
 return {
  locations:data.venues.length?[{id:data.region.id,level:'semt',name:data.region.name,slug:data.region.slug,path:[...data.region.path],displayName:data.region.displayName,locative:"Moda'da",status:'published',aliases:['İstanbul','Kadıköy','Istanbul','Kadikoy'],scopeNote:'Moda · Kahve'}]:[],
  categories:data.categories.slice(0,7).map(c=>({slug:c.slug,label:c.label,title:c.label,isMustTry:c.isMustTry,emoji:c.id==='coffee'?'☕':undefined})),
  venues:data.venues.map(v=>{
   const verified=getVerifiedGoogleRatings(v.id);
   const resolvedRatings=verified.length?verified:copyVisitorGoogleRatings(v.ratings);
   const curated=SYNTHESIZED_VENUE_INSIGHTS[v.id];
   const description=curated?.description||v.description;
   const whatToOrder=curated?.whatToOrder?.length?curated.whatToOrder:v.whatToOrder;
   const menuFrom=curated?.menuFrom?.length?curated.menuFrom:v.menuFrom;
   const alsoTry=curated?.alsoTry?.length?curated.alsoTry:v.alsoTry;
   const beforeYouGo=curated?.beforeYouGo?.length?curated.beforeYouGo:v.beforeYouGo;

   return {
    id:v.id,name:v.name,location:'Moda, Kadıköy',address:v.location,neighborhood:v.location,categoryName:'Kahve',categorySlugs:[data.categorySlug],
    tagline:description,
    imageUrl:illustrations.get(v.id)!,imageIsRepresentative:true,imageCategory:v.categoryId,
    ratings:resolvedRatings,
    orderSuggestion:whatToOrder.length?{title:whatToOrder.join(' · ')}:null,
    menuFrom:[...menuFrom],
    alsoTry:{items:alsoTry.map(name=>({name,description:''}))},
    knowBeforeYouGo:{tips:[...beforeYouGo]}
   };
  }),
 };
}
