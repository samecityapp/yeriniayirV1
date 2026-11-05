import type {RatingResult} from './client';

export interface VisitorGoogleRating {
 platform:'google-maps';value:number;
 attribution:{label:'Google Maps';mapsUri:string;providers:{provider:string;uri:string}[]};
}
const secureUrl=(value:string)=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u:null;}catch{return null;}};
// Explicit allowlist: count aliases or arbitrary provider fields are never copied.
export function copyVisitorGoogleRatings(values:readonly VisitorGoogleRating[]):VisitorGoogleRating[]{
 if(values.length!==1)return [];
 const value=values[0],url=secureUrl(value?.attribution?.mapsUri||'');
 if(value?.platform!=='google-maps'||typeof value.value!=='number'||!Number.isFinite(value.value)||value.value<1||value.value>5||!url||!['www.google.com','google.com','maps.google.com'].includes(url.hostname)||value.attribution.label!=='Google Maps'||!Array.isArray(value.attribution.providers))return [];
 const providers:{provider:string;uri:string}[]=[];
 for(const item of value.attribution.providers){if(!item.provider||!secureUrl(item.uri))return [];providers.push({provider:item.provider,uri:item.uri});}
 return [{platform:'google-maps',value:value.value,attribution:{label:'Google Maps',mapsUri:url.href,providers}}];
}
// Called only with the official server adapter's result; bare research-card scores
// and browser-provided values cannot establish correct physical branch identity.
export function visitorGoogleRatings(venueId:string,result?:RatingResult):VisitorGoogleRating[]{
 if(!result||result.status!=='verified'||result.venueId!==venueId||!result.placeId||!/^[-A-Za-z0-9_]{10,255}$/.test(result.placeId)||result.rating===null||!result.verifiedAt||!Number.isFinite(Date.parse(result.verifiedAt))||!result.mapsUri)return [];
 return copyVisitorGoogleRatings([{platform:'google-maps',value:result.rating,attribution:{label:'Google Maps',mapsUri:result.mapsUri,providers:result.attributions}}]);
}
export const visitorGoogleRatingLabel=(value:number)=>String(value).replace('.',',')+'/5';
