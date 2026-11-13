import {assignVenueIllustrations} from '../../food/illustrations';
import type {IntegrationDiscovery} from './discovery';
import type {VisitorFoodDiscovery} from '../../food/types';
import {copyVisitorGoogleRatings} from '../googlePlaces/visitorRating';
import {getVerifiedGoogleRatings} from '../googlePlaces/verifiedRatings';
import {SYNTHESIZED_VENUE_INSIGHTS} from '../gastronomy/visitorContent';
import {V3_LOCATIONS} from '../../gastronomy-v3/registry';

const CATEGORY_SLUG_MAP: Record<string, string> = {
 coffee: 'kahve',
 kahve: 'kahve',
 bakery_breakfast: 'firin-kahvalti',
 street_local: 'sokak-mahalle',
 chef_dinner: 'sef-aksam',
 dessert_gelato: 'tatli-gelato',
 burger: 'hamburger',
 hamburger: 'hamburger',
 pizza: 'pizza',
 breakfast: 'kahvalti',
 kahvalti: 'kahvalti',
 dessert: 'tatli-pastane',
 date: 'date-mekanlari',
 denemelisin: 'denemelisin',
 lokanta: 'lokanta',
 balik: 'balik-deniz-urunleri',
 meyhane: 'meyhane',
 bistro: 'aksam-bistro',
 kebap: 'kebap-doner',
};

const CATEGORY_NAME_MAP: Record<string, string> = {
 coffee: 'Kahve',
 kahve: 'Kahve',
 bakery_breakfast: 'Fırın & Sabah',
 street_local: 'Sokak & Mahalle',
 chef_dinner: 'Şef & Akşam',
 dessert_gelato: 'Tatlı & Gelato',
 burger: 'Hamburger',
 hamburger: 'Hamburger',
 pizza: 'Pizza',
 breakfast: 'Kahvaltı',
 kahvalti: 'Kahvaltı',
 dessert: 'Tatlı & Pastane',
 date: 'Date Mekanları',
 denemelisin: 'Denemelisin',
 lokanta: 'Tarihi Lokantalar & Çarşı',
 balik: 'Balık & Deniz Ürünleri',
 meyhane: 'Meyhane & Akşam',
 bistro: 'Akşam Yemeği & Bistro',
 kebap: 'Kebap, Döner & Ocakbaşı',
};

/** Never accepts the admin card or uses the Antigravity prototype provider. */
export function toFoodDiscovery(data:IntegrationDiscovery):VisitorFoodDiscovery {
 const allInputs = [...data.venues, ...(data.nearbyVenues || [])];
 const illustrations=assignVenueIllustrations(allInputs);
 const distinctLocations: VisitorFoodDiscovery['locations'] = data.venues.length ? V3_LOCATIONS : [];
 const regionName = data.region?.name || 'Moda';
 const regionDisplayName = data.region?.displayName ? data.region.displayName.split(',').slice(0, 2).join(',') : `${regionName}, İstanbul`;

 const mapVenue = (
  v: IntegrationDiscovery['venues'][number] & {
   subAreaLabel?: string;
   nearbyAreaLabel?: string;
   distanceKm?: number;
   distanceMeters?: number;
  },
  scope: 'core' | 'nearby'
 ) => {
  const inlineRatings=copyVisitorGoogleRatings(v.ratings);
  const verified=getVerifiedGoogleRatings(v.id);
  const resolvedRatings=inlineRatings.length?inlineRatings:verified;
  const curated=SYNTHESIZED_VENUE_INSIGHTS[v.id];
  const description=v.description||curated?.description||null;
  const whatToOrder=v.whatToOrder.length?v.whatToOrder:(curated?.whatToOrder||[]);
  const menuFrom=v.menuFrom?.length?v.menuFrom:(curated?.menuFrom||[]);
  const alsoTry=v.alsoTry.length?v.alsoTry:(curated?.alsoTry||[]);
  const beforeYouGo=v.beforeYouGo.length?v.beforeYouGo:(curated?.beforeYouGo||[]);

  const matchedCategory = data.categories.find(c => c.id === v.categoryId);
  const catSlug = matchedCategory?.slug || CATEGORY_SLUG_MAP[v.categoryId] || data.categorySlug;
  const secondarySlugs = (v.secondaryCategoryIds || [])
   .map(id => data.categories.find(c => c.id === id)?.slug || CATEGORY_SLUG_MAP[id])
   .filter((s): s is string => Boolean(s));
  const categorySlugs = Array.from(new Set([catSlug, ...secondarySlugs]));
  const catName = matchedCategory?.label || CATEGORY_NAME_MAP[v.categoryId] || 'Gastronomi';

  const distanceSuffix =
   typeof v.distanceMeters === 'number'
    ? ` · Sınıra ${v.distanceMeters} m`
    : typeof v.distanceKm === 'number'
    ? ` · ${v.distanceKm.toFixed(1)} km`
    : '';
  const coreLocationLabel =
   v.subAreaLabel && v.subAreaLabel.includes(',') ? v.subAreaLabel : regionDisplayName;
  const locationLabel =
   scope === 'nearby' && v.nearbyAreaLabel
    ? `${v.nearbyAreaLabel}${distanceSuffix}`
    : coreLocationLabel;

  return {
   id:v.id,name:v.name,location:locationLabel,address:v.location,neighborhood:v.location,categoryName:catName,categorySlugs,
   scope,
   ...(scope === 'nearby' && v.nearbyAreaLabel ? { nearbyAreaLabel: v.nearbyAreaLabel } : {}),
   ...(scope === 'nearby' && typeof v.distanceKm === 'number' ? { distanceKm: v.distanceKm } : {}),
   ...(scope === 'nearby' && typeof v.distanceMeters === 'number'
    ? { distanceMeters: v.distanceMeters }
    : {}),
   tagline:description,
   imageUrl:illustrations.get(v.id)!,imageIsRepresentative:true,imageCategory:v.categoryId,
   ratings:resolvedRatings,
   orderSuggestion:whatToOrder.length?{title:whatToOrder.join(' · ')}:null,
   menuFrom:[...menuFrom],
   alsoTry:{items:alsoTry.map(raw=>{const idx=raw.indexOf(' — ');return idx>=0?{name:raw.slice(0,idx).trim(),description:raw.slice(idx+3).trim()}:{name:raw,description:''};})},
   knowBeforeYouGo:{tips:[...beforeYouGo]}
  };
 };

 return {
  locations: distinctLocations,
  categories:data.categories.slice(0,9).map(c=>({slug:c.slug,label:c.label,title:c.title||c.label,isMustTry:c.isMustTry,emoji:c.emoji || (c.slug.includes('kruvasan')?'🥐':c.id==='coffee'||c.slug.includes('kahve')?'☕':c.id==='burger'||c.slug.includes('burger')?'🍔':c.id==='pizza'||c.slug.includes('pizza')?'🍕':c.id==='breakfast'||c.slug.includes('kahvalti')?'🍳':c.id==='kofte'||c.slug.includes('piyaz')?'🧆':c.id==='doner'?'🥙':c.id==='pide'?'🫓':c.id==='ozel-gun'?'✨':c.id==='baklava'?'🍯':c.id==='katmer'?'🥞':c.id==='beyran'?'🥣':c.id==='kusleme'||c.slug.includes('kebap')?'🍢':c.id==='mutfak'?'🍲':c.id==='dessert'||c.slug.includes('tatli')||c.slug.includes('firin')?'🍰':c.id==='date'?'🍷':c.id==='denemelisin'?'⭐':c.id==='lokanta'||c.slug.includes('lokanta')?'🍲':c.id==='balik'||c.slug.includes('balik')?'🐟':c.id==='meyhane'?'🥂':c.id==='bistro'||c.slug.includes('bistro')?'🍸':c.id==='kebap'||c.slug.includes('kebap')?'🍢':'🍽️')})),
  venues:data.venues.map(v => mapVenue(v, 'core')),
  nearbyVenues:(data.nearbyVenues || []).map(v => mapVenue(v, 'nearby')),
 };
}
