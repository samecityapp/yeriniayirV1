import {assignVenueIllustrations} from '../../food/illustrations';
import type {IntegrationDiscovery} from './discovery';
import type {VisitorFoodDiscovery} from '../../food/types';
import {copyVisitorGoogleRatings} from '../googlePlaces/visitorRating';
import {getVerifiedGoogleRatings} from '../googlePlaces/verifiedRatings';
/** Never accepts the admin card or uses the Antigravity prototype provider. */
export function toFoodDiscovery(data:IntegrationDiscovery):VisitorFoodDiscovery {
 const illustrations=assignVenueIllustrations(data.venues);
 return {
  locations:data.venues.length?[{id:data.region.id,level:'semt',name:data.region.name,slug:data.region.slug,path:[...data.region.path],displayName:data.region.displayName,locative:"Moda'da",status:'published',aliases:['İstanbul','Kadıköy','Istanbul','Kadikoy'],scopeNote:'Moda · Kahve'}]:[],
  categories:data.categories.slice(0,7).map(c=>({slug:c.slug,label:c.label,title:c.label,isMustTry:c.isMustTry,emoji:c.id==='coffee'?'☕':undefined})),
  venues:data.venues.map(v=>{
   const verified=getVerifiedGoogleRatings(v.id);
   const resolvedRatings=verified.length?verified:copyVisitorGoogleRatings(v.ratings);
   return {
    id:v.id,name:v.name,location:'Moda, Kadıköy',address:v.location,neighborhood:v.location,categoryName:'Kahve',categorySlugs:[data.categorySlug],tagline:v.description,
    // No rights-cleared photo exists yet. Deliberately ignore arbitrary image URLs.
    imageUrl:illustrations.get(v.id)!,imageIsRepresentative:true,imageCategory:v.categoryId,
    ratings:resolvedRatings,orderSuggestion:v.whatToOrder.length?{title:v.whatToOrder.join(' · ')}:null,
    menuFrom:[...v.menuFrom],alsoTry:{items:v.alsoTry.map(name=>({name,description:''}))},knowBeforeYouGo:{tips:[...v.beforeYouGo]}
   };
  }),
 };
}
