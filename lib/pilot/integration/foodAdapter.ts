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
 bistro: 'aksam-bistro',
 kebap: 'kebap-doner',
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
 bistro: 'Akşam Yemeği & Bistro',
 kebap: 'Kebap, Döner & Ocakbaşı',
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
   status: 'published',
   aliases: ['Caddebostan', 'Bağdat Caddesi', 'Bagdat Caddesi', 'İskele Sokak', 'Plaj Yolu', 'CKM'],
   scopeNote: 'Kadıköy · Caddebostan (Yayında)'
  },
  {
   id: 'suadiye',
   level: 'semt',
   name: 'Suadiye',
   slug: 'suadiye',
   path: ['istanbul', 'kadikoy', 'suadiye'],
   displayName: 'Suadiye, Kadıköy, İstanbul',
   locative: "Suadiye'de",
   status: 'published',
   aliases: ['Suadiye', 'Bağdat Caddesi', 'Plaj Yolu', 'Noter Sokak', 'Suadiye Park'],
   scopeNote: 'Kadıköy · Suadiye (Yayında)'
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
   id: 'acibadem-kadikoy',
   level: 'semt',
   name: 'Acıbadem',
   slug: 'acibadem',
   path: ['istanbul', 'kadikoy', 'acibadem'],
   displayName: 'Acıbadem, Kadıköy, İstanbul',
   locative: "Acıbadem'de",
   status: 'published',
   aliases: ['Acıbadem', 'Acibadem', 'Çeçen Sokak', 'Akasya'],
   scopeNote: 'Kadıköy · Acıbadem (Yayında)'
  },
  {
   id: 'feneryolu-kadikoy',
   level: 'semt',
   name: 'Feneryolu',
   slug: 'feneryolu',
   path: ['istanbul', 'kadikoy', 'feneryolu'],
   displayName: 'Feneryolu, Kadıköy, İstanbul',
   locative: "Feneryolu'nda",
   status: 'published',
   aliases: ['Feneryolu', 'Gazi Muhtar Paşa', 'Mustafa Mazhar Bey', 'Kuyubaşı'],
   scopeNote: 'Kadıköy · Feneryolu (Yayında)'
  },
  {
   id: 'kosuyolu-kadikoy',
   level: 'semt',
   name: 'Koşuyolu',
   slug: 'kosuyolu',
   path: ['istanbul', 'kadikoy', 'kosuyolu'],
   displayName: 'Koşuyolu, Kadıköy, İstanbul',
   locative: "Koşuyolu'nda",
   status: 'published',
   aliases: ['Koşuyolu', 'Kosuyolu'],
   scopeNote: 'Kadıköy · Koşuyolu (Yayında)'
  },
  {
   id: 'kuzguncuk',
   level: 'semt',
   name: 'Kuzguncuk',
   slug: 'kuzguncuk',
   path: ['istanbul', 'uskudar', 'kuzguncuk'],
   displayName: 'Kuzguncuk, Üsküdar, İstanbul',
   locative: "Kuzguncuk'ta",
   status: 'published',
   aliases: ['Kuzguncuk', 'İcadiye Caddesi', 'İcadiye', 'Perihan Abla', 'Bostan', 'Paşalimanı'],
   scopeNote: 'Üsküdar · Kuzguncuk (Yayında)'
  },
  {
   id: 'kuzguncuk-uskudar',
   level: 'semt',
   name: 'Kuzguncuk',
   slug: 'kuzguncuk',
   path: ['istanbul', 'uskudar', 'kuzguncuk'],
   displayName: 'Kuzguncuk, Üsküdar, İstanbul',
   locative: "Kuzguncuk'ta",
   status: 'published',
   aliases: ['Kuzguncuk', 'İcadiye Caddesi', 'İcadiye', 'Perihan Abla', 'Bostan', 'Paşalimanı'],
   scopeNote: 'Üsküdar · Kuzguncuk (Yayında)'
  },
  {
   id: 'cengelkoy',
   level: 'semt',
   name: 'Çengelköy',
   slug: 'cengelkoy',
   path: ['istanbul', 'uskudar', 'cengelkoy'],
   displayName: 'Çengelköy, Üsküdar, İstanbul',
   locative: "Çengelköy'de",
   status: 'published',
   aliases: ['Çengelköy', 'Cengelkoy', 'Çınaraltı', 'Cinaralti', 'Kuleli Caddesi', 'Kuleli'],
   scopeNote: 'Üsküdar · Çengelköy (Yayında)'
  },
  {
   id: 'cengelkoy-uskudar',
   level: 'semt',
   name: 'Çengelköy',
   slug: 'cengelkoy',
   path: ['istanbul', 'uskudar', 'cengelkoy'],
   displayName: 'Çengelköy, Üsküdar, İstanbul',
   locative: "Çengelköy'de",
   status: 'published',
   aliases: ['Çengelköy', 'Cengelkoy', 'Çınaraltı', 'Cinaralti', 'Kuleli Caddesi', 'Kuleli'],
   scopeNote: 'Üsküdar · Çengelköy (Yayında)'
  },
  {
   id: 'uskudar',
   level: 'semt',
   name: 'Üsküdar Merkez',
   slug: 'uskudar',
   path: ['istanbul', 'uskudar'],
   displayName: 'Üsküdar Merkez, İstanbul',
   locative: "Üsküdar'da",
   status: 'published',
   aliases: ['Üsküdar', 'Uskudar', 'Üsküdar Merkez', 'Salacak', 'Mimar Sinan', 'Mihrimah Sultan', 'Kız Kulesi', 'Selman-ı Pak', 'Uncular'],
   scopeNote: 'Üsküdar · Merkez & Sahil (Yayında)'
  },
  {
   id: 'uskudar-merkez',
   level: 'semt',
   name: 'Üsküdar Merkez',
   slug: 'uskudar',
   path: ['istanbul', 'uskudar'],
   displayName: 'Üsküdar Merkez, İstanbul',
   locative: "Üsküdar'da",
   status: 'published',
   aliases: ['Üsküdar', 'Uskudar', 'Üsküdar Merkez', 'Salacak', 'Mimar Sinan', 'Mihrimah Sultan', 'Kız Kulesi', 'Selman-ı Pak', 'Uncular'],
   scopeNote: 'Üsküdar · Merkez & Sahil (Yayında)'
  },
  {
   id: 'karakoy',
   level: 'semt',
   name: 'Karaköy',
   slug: 'karakoy',
   path: ['istanbul', 'beyoglu', 'karakoy'],
   displayName: 'Karaköy, Beyoğlu, İstanbul',
   locative: "Karaköy'de",
   status: 'published',
   aliases: ['Karaköy', 'Karakoy', 'Kemankeş', 'Kemankes', 'Mumhane', 'Galataport', 'Fransız Geçidi', 'Bankalar Caddesi', 'Perşembe Pazarı'],
   scopeNote: 'Beyoğlu · Karaköy (Yayında)'
  },
  {
   id: 'karakoy-beyoglu',
   level: 'semt',
   name: 'Karaköy',
   slug: 'karakoy',
   path: ['istanbul', 'beyoglu', 'karakoy'],
   displayName: 'Karaköy, Beyoğlu, İstanbul',
   locative: "Karaköy'de",
   status: 'published',
   aliases: ['Karaköy', 'Karakoy', 'Kemankeş', 'Kemankes', 'Mumhane', 'Galataport', 'Fransız Geçidi', 'Bankalar Caddesi', 'Perşembe Pazarı'],
   scopeNote: 'Beyoğlu · Karaköy (Yayında)'
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
  categories:data.categories.slice(0,7).map(c=>({slug:c.slug,label:c.label,title:c.label,isMustTry:c.isMustTry,emoji:c.id==='coffee'||c.slug.includes('kahve')?'☕':c.id==='burger'||c.slug.includes('burger')?'🍔':c.id==='pizza'||c.slug.includes('pizza')?'🍕':c.id==='breakfast'||c.slug.includes('kahvalti')?'🍳':c.id==='dessert'||c.slug.includes('tatli')||c.slug.includes('firin')?'🍰':c.id==='date'?'🍷':c.id==='lokanta'||c.slug.includes('lokanta')?'🍲':c.id==='balik'||c.slug.includes('balik')?'🐟':c.id==='meyhane'?'🥂':c.id==='bistro'||c.slug.includes('bistro')?'🍸':c.id==='kebap'||c.slug.includes('kebap')?'🍢':'🍽️'})),
  venues:data.venues.map(v=>{
   const verified=getVerifiedGoogleRatings(v.id);
   const resolvedRatings=verified.length?verified:copyVisitorGoogleRatings(v.ratings);
   const curated=SYNTHESIZED_VENUE_INSIGHTS[v.id];
   const description=curated?.description||v.description;
   const whatToOrder=curated?.whatToOrder?.length?curated.whatToOrder:v.whatToOrder;
   const menuFrom=curated?.menuFrom?.length?curated.menuFrom:v.menuFrom;
   const alsoTry=curated?.alsoTry?.length?curated.alsoTry:v.alsoTry;
   const beforeYouGo=curated?.beforeYouGo?.length?curated.beforeYouGo:v.beforeYouGo;

   const matchedCategory = data.categories.find(c => c.id === v.categoryId);
   const catSlug = matchedCategory?.slug || CATEGORY_SLUG_MAP[v.categoryId] || data.categorySlug;
   const catName = matchedCategory?.label || CATEGORY_NAME_MAP[v.categoryId] || 'Gastronomi';
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
