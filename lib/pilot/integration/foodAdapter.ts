import {assignVenueIllustrations} from '../../food/illustrations';
import type {IntegrationDiscovery} from './discovery';
import type {VisitorFoodDiscovery} from '../../food/types';
import {copyVisitorGoogleRatings} from '../googlePlaces/visitorRating';
import {getVerifiedGoogleRatings} from '../googlePlaces/verifiedRatings';
import {SYNTHESIZED_VENUE_INSIGHTS} from '../gastronomy/visitorContent';

const CATEGORY_SLUG_MAP: Record<string, string> = {
 coffee: 'kahve',
 burger: 'hamburger',
 pizza: 'pizza',
 breakfast: 'kahvalti',
 dessert: 'tatli-pastane',
 date: 'date-mekanlari',
 lokanta: 'lokanta',
 balik: 'balik-deniz-urunleri',
 meyhane: 'meyhane',
};

const CATEGORY_NAME_MAP: Record<string, string> = {
 coffee: 'Kahve',
 burger: 'Hamburger',
 pizza: 'Pizza',
 breakfast: 'Kahvaltı',
 dessert: 'Tatlı & Pastane',
 date: 'Date Mekanları',
 lokanta: 'Tarihi Lokantalar & Çarşı',
 balik: 'Balık & Deniz Ürünleri',
 meyhane: 'Meyhane & Akşam',
};

/** Never accepts the admin card or uses the Antigravity prototype provider. */
export function toFoodDiscovery(data:IntegrationDiscovery):VisitorFoodDiscovery {
 const illustrations=assignVenueIllustrations(data.venues);
 const distinctLocations: VisitorFoodDiscovery['locations'] = data.venues.length ? [
  {
   id: 'moda-kadikoy',
   level: 'semt',
   name: 'Moda',
   slug: 'moda',
   path: ['istanbul', 'kadikoy', 'moda'],
   displayName: 'Moda, Kadıköy, İstanbul',
   locative: "Moda'da",
   status: 'published',
   aliases: ['İstanbul', 'Kadıköy', 'Istanbul', 'Kadikoy', 'Moda'],
   scopeNote: 'Kadıköy · Moda (Yayında)'
  },
  {
   id: 'yeldegirmeni-kadikoy',
   level: 'semt',
   name: 'Yeldeğirmeni',
   slug: 'yeldegirmeni',
   path: ['istanbul', 'kadikoy', 'yeldegirmeni'],
   displayName: 'Yeldeğirmeni, Kadıköy, İstanbul',
   locative: "Yeldeğirmeni'nde",
   status: 'published',
   aliases: ['Yeldegirmeni', 'Rasimpaşa', 'Rasimpasa', 'Karakolhane', 'İskele Sokak'],
   scopeNote: 'Kadıköy · Yeldeğirmeni (Yayında)'
  },
  {
   id: 'kadikoy-merkez',
   level: 'semt',
   name: 'Kadıköy Merkez & Çarşı',
   slug: 'kadikoy-merkez',
   path: ['istanbul', 'kadikoy', 'merkez'],
   displayName: 'Kadıköy Merkez & Tarihi Çarşı, İstanbul',
   locative: "Kadıköy Merkez'de",
   status: 'published',
   aliases: ['Çarşı', 'Carsi', 'Rıhtım', 'Rihtim', 'Kadıköy Çarşı', 'Kadikoy Merkez'],
   scopeNote: 'Kadıköy · Çarşı (Yayında)'
  },
  {
   id: 'caddebostan',
   level: 'semt',
   name: 'Caddebostan',
   slug: 'caddebostan',
   path: ['istanbul', 'kadikoy', 'caddebostan'],
   displayName: 'Caddebostan, Kadıköy, İstanbul',
   locative: "Caddebostan'da",
   status: 'coming_soon',
   aliases: ['Caddebostan', 'Bağdat Caddesi', 'Bagdat Caddesi'],
   scopeNote: 'Kadıköy · Caddebostan (Araştırmada)'
  },
  {
   id: 'suadiye',
   level: 'semt',
   name: 'Suadiye',
   slug: 'suadiye',
   path: ['istanbul', 'kadikoy', 'suadiye'],
   displayName: 'Suadiye, Kadıköy, İstanbul',
   locative: "Suadiye'de",
   status: 'coming_soon',
   aliases: ['Suadiye', 'Plaj Yolu'],
   scopeNote: 'Kadıköy · Suadiye (Araştırmada)'
  },
  {
   id: 'goztepe',
   level: 'semt',
   name: 'Göztepe',
   slug: 'goztepe',
   path: ['istanbul', 'kadikoy', 'goztepe'],
   displayName: 'Göztepe, Kadıköy, İstanbul',
   locative: "Göztepe'de",
   status: 'coming_soon',
   aliases: ['Göztepe', 'Goztepe'],
   scopeNote: 'Kadıköy · Göztepe (Araştırmada)'
  },
  {
   id: 'acibadem',
   level: 'semt',
   name: 'Acıbadem',
   slug: 'acibadem',
   path: ['istanbul', 'kadikoy', 'acibadem'],
   displayName: 'Acıbadem, Kadıköy, İstanbul',
   locative: "Acıbadem'de",
   status: 'coming_soon',
   aliases: ['Acıbadem', 'Acibadem'],
   scopeNote: 'Kadıköy · Acıbadem (Araştırmada)'
  },
  {
   id: 'kosuyolu',
   level: 'semt',
   name: 'Koşuyolu',
   slug: 'kosuyolu',
   path: ['istanbul', 'kadikoy', 'kosuyolu'],
   displayName: 'Koşuyolu, Kadıköy, İstanbul',
   locative: "Koşuyolu'nda",
   status: 'coming_soon',
   aliases: ['Koşuyolu', 'Kosuyolu'],
   scopeNote: 'Kadıköy · Koşuyolu (Araştırmada)'
  },
  {
   id: 'nisantasi',
   level: 'semt',
   name: 'Nişantaşı',
   slug: 'nisantasi',
   path: ['istanbul', 'sisli', 'nisantasi'],
   displayName: 'Nişantaşı, Şişli, İstanbul',
   locative: "Nişantaşı'nda",
   status: 'coming_soon',
   aliases: ['Nişantaşı', 'Nisantasi', 'Teşvikiye', 'Abdi İpekçi'],
   scopeNote: 'Şişli · Nişantaşı (Araştırmada)'
  },
  {
   id: 'bebek',
   level: 'semt',
   name: 'Bebek',
   slug: 'bebek',
   path: ['istanbul', 'besiktas', 'bebek'],
   displayName: 'Bebek, Beşiktaş, İstanbul',
   locative: "Bebek'te",
   status: 'coming_soon',
   aliases: ['Bebek', 'Cevdet Paşa'],
   scopeNote: 'Beşiktaş · Bebek (Araştırmada)'
  },
  {
   id: 'yenikoy',
   level: 'semt',
   name: 'Yeniköy',
   slug: 'yenikoy',
   path: ['istanbul', 'sariyer', 'yenikoy'],
   displayName: 'Yeniköy, Sarıyer, İstanbul',
   locative: "Yeniköy'de",
   status: 'coming_soon',
   aliases: ['Yeniköy', 'Yenikoy', 'Köybaşı'],
   scopeNote: 'Sarıyer · Yeniköy (Araştırmada)'
  }
 ] : [];

 return {
  locations: distinctLocations,
  categories:data.categories.slice(0,7).map(c=>({slug:c.slug,label:c.label,title:c.label,isMustTry:c.isMustTry,emoji:c.id==='coffee'?'☕':c.id==='burger'?'🍔':c.id==='pizza'?'🍕':c.id==='breakfast'?'🍳':c.id==='dessert'?'🍰':c.id==='date'?'🍷':c.id==='lokanta'?'🍲':c.id==='balik'?'🐟':c.id==='meyhane'?'🥂':undefined})),
  venues:data.venues.map(v=>{
   const verified=getVerifiedGoogleRatings(v.id);
   const resolvedRatings=verified.length?verified:copyVisitorGoogleRatings(v.ratings);
   const curated=SYNTHESIZED_VENUE_INSIGHTS[v.id];
   const description=curated?.description||v.description;
   const whatToOrder=curated?.whatToOrder?.length?curated.whatToOrder:v.whatToOrder;
   const menuFrom=curated?.menuFrom?.length?curated.menuFrom:v.menuFrom;
   const alsoTry=curated?.alsoTry?.length?curated.alsoTry:v.alsoTry;
   const beforeYouGo=curated?.beforeYouGo?.length?curated.beforeYouGo:v.beforeYouGo;

   const catSlug=CATEGORY_SLUG_MAP[v.categoryId]||data.categorySlug;
   const catName=CATEGORY_NAME_MAP[v.categoryId]||'Gastronomi';
   const regionName = data.region?.name || 'Moda';
   const regionDisplayName = data.region?.displayName ? data.region.displayName.split(',').slice(0, 2).join(',') : `${regionName}, İstanbul`;

   return {
    id:v.id,name:v.name,location:regionDisplayName,address:v.location,neighborhood:v.location,categoryName:catName,categorySlugs:[catSlug],
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
