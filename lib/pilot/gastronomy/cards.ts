import type {ManagedCandidate,ScopeView} from './types';
import {buildNeutralVisitorContent} from './visitorContent';
import type {NeutralVisitorContent} from './visitorContent';
export interface VenueFact {text:string;sourceUrls:string[];scope:'branch'|'brand'|'unresolved';status:'reported'|'research-suggestion';caveat:string}
export interface VenueCardData {productResearch?:ManagedCandidate['productResearch'];visitorContent?:NeutralVisitorContent;schemaVersion:1;dataKind:'real-research';id:string;rank:number;name:string;regionId:string;categoryId:string;areaLabel:string;address:string;coordinates:{lat:number;lng:number;basis:'openstreetmap-observation'};googleRating:number|null;googleReviewCount:number|null;photo:{url:string;sourceUrl:string;license:string;verifiedAt:string}|null;walking:{seconds:number;meters:number;sourceUrl:string;verifiedAt:string;travelMode:'walking'}|null;otherRatings:{platform:string;value:number;sourceUrl:string;verifiedAt:string}[];whatToOrder:VenueFact[];menuFrom?:VenueFact[];whyGo:string[];alsoTry:VenueFact[];suitsYou:VenueFact[];beforeYouGo:string[];sources:{url:string;family:string;publishedAt:string|null;experienceAt:string|null;checkedAt:string}[];selection:{origin:'automatic'|'manual';productEvidence:'branch'|'brand';publicationClass:string;qualityStatement:'evidence-based-shortlist-not-definitive-tasting-rank';reason:string[]};}
export function buildVenueCards(scopes:ScopeView[],catalog:ManagedCandidate[]):VenueCardData[]{
 return scopes.flatMap(scope=>scope.selected.map((a,index)=>{
  const c=catalog.find(c=>c.id===a.id);if(!c?.address||!c.coordinates)return null;
  const details=(field:string):VenueFact[]=>(c.presentation?.claims||[]).filter(x=>x.field===field&&x.scope!=='unresolved').map(x=>({text:x.text,scope:x.scope,status:x.basis==='inference'?'research-suggestion':'reported',caveat:x.caveat||'Kaynağın tarihi ve kapsamıyla birlikte değerlendirin; bugünkü servis garantisi değildir.',sourceUrls:x.sourceIds.map(id=>c.presentation!.sources.find(s=>s.id===id)?.url).filter((v):v is string=>Boolean(v))}));
  const sources=Array.from(new Map([...a.evidence.map(e=>({url:e.url,family:e.family,publishedAt:e.publishedAt,experienceAt:e.experienceAt,checkedAt:e.checkedAt})),...(c.presentation?.sources||[]).map(s=>({url:s.url,family:new URL(s.url).hostname.replace(/^www\./,''),publishedAt:s.publishedAt,experienceAt:s.experienceAt,checkedAt:s.checkedAt}))].map(s=>[s.url,s])).values());
  const card:VenueCardData={schemaVersion:1,dataKind:'real-research',id:c.id,rank:index+1,name:c.name,regionId:c.regionId,categoryId:scope.category.id,areaLabel:scope.region.name,address:c.address,coordinates:{...c.coordinates,basis:'openstreetmap-observation'},googleRating:null,googleReviewCount:null,photo:null,walking:null,otherRatings:[],whatToOrder:details('drink'),whyGo:[...(c.presentation?.claims||[]).filter(x=>['why','specialty'].includes(x.field)&&x.basis==='reported'&&x.scope!=='unresolved').map(x=>x.text),...(a.selectionBasis?.explanation||a.warnings)],alsoTry:details('also'),suitsYou:details('fit'),beforeYouGo:[...a.warnings,...(c.presentation?.gaps||[]),'Google puanı/yorum sayısı, lisanslı fotoğraf ve gerçek yaya rotası doğrulanmadığı için boş bırakıldı.'],sources,selection:{origin:a.origin==='manual'?'manual':'automatic',productEvidence:a.selectionBasis?.productScope==='brand'?'brand':'branch',publicationClass:a.selectionBasis?.publicationClass||'dated-experience',qualityStatement:'evidence-based-shortlist-not-definitive-tasting-rank',reason:a.selectionBasis?.explanation||a.warnings}};
  card.productResearch=c.productResearch;
  if(c.productResearch){
   const productFact=(p:NonNullable<ManagedCandidate['productResearch']>['products'][number]):VenueFact=>({text:p.product.label,scope:'branch',status:'reported',caveat:'',sourceUrls:p.sourceIds.map(id=>c.productResearch!.sources.find(s=>s.id===id)?.url).filter((url):url is string=>Boolean(url))});
   const recommended=c.productResearch.products.filter(p=>p.state==='recommendable'&&c.productResearch!.recommendedProducts.includes(p.product.id));
   card.whatToOrder=recommended.filter(p=>p.product.categoryId===scope.category.id).map(productFact);
   card.alsoTry=recommended.filter(p=>p.product.categoryId!==scope.category.id).map(productFact);
   card.menuFrom=c.productResearch.products.filter(p=>p.state==='menu-confirmed'&&p.product.categoryId===scope.category.id).map(productFact);
  }
  card.visitorContent=buildNeutralVisitorContent(c,card);
  return card;
 }).filter((x):x is VenueCardData=>x!==null));
}
