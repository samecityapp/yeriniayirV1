import type {VisitorGoogleRating} from '@/lib/pilot/googlePlaces/visitorRating';
import {copyVisitorGoogleRatings,visitorGoogleRatingLabel} from '@/lib/pilot/googlePlaces/visitorRating';

/** Shared by the future main card and detail view. No review-count prop or output. */
export function GooglePlaceRating({ratings}:{ratings:readonly VisitorGoogleRating[]}){
 const rating=copyVisitorGoogleRatings(ratings)[0];if(!rating)return null;
 return <span className="inline-flex flex-wrap items-center gap-2 rounded border border-gray-200 bg-white px-2 py-1 text-xs">
  <span>{visitorGoogleRatingLabel(rating.value)}</span>
  <a href={rating.attribution.mapsUri} target="_blank" rel="noopener noreferrer" translate="no" className="whitespace-nowrap font-normal text-[#5e5e5e]">Google Maps</a>
  {rating.attribution.providers.map((p,i)=><a key={i} href={p.uri} target="_blank" rel="noopener noreferrer">{p.provider}</a>)}
 </span>;
}
