import {createVisitorCache,visitorSourceVersion} from './visitorCache';
import {readVisitorVenueSelection} from '../gastronomy/selectionReader';
import type {VisitorVenueData} from '../gastronomy/visitorContent';
import {copyVisitorGoogleRatings} from '../googlePlaces/visitorRating';

export interface IntegrationDiscovery {
 schemaVersion:1;dataKind:'real-research';mode:'integration-preparation';productionPublished:false;
 region:{id:string;slug:string;name:string;displayName:string;path:string[]};
 categories:{slug:string;id:string;label:string;isMustTry:boolean}[];
 categorySlug:string;venues:VisitorVenueData[];rituals:[];
}
export const MODA_CATEGORIES = [
  { slug: 'kahve', id: 'coffee', label: 'Kahve', isMustTry: false },
  { slug: 'hamburger', id: 'burger', label: 'Hamburger', isMustTry: false },
  { slug: 'pizza', id: 'pizza', label: 'Pizza', isMustTry: false },
  { slug: 'kahvalti', id: 'breakfast', label: 'Kahvaltı', isMustTry: false },
  { slug: 'tatli-pastane', id: 'dessert', label: 'Tatlı & Pastane', isMustTry: false },
  { slug: 'date-mekanlari', id: 'date', label: 'Date Mekanları', isMustTry: false },
];

const MODA_NON_COFFEE_VENUES: VisitorVenueData[] = [
  // Hamburger (100% Moda)
  {
    id: 'kadikoy-burger-zapata',
    name: 'Zapata Burger',
    location: 'Sakız Sk. No:1/C, Moda',
    categoryId: 'burger',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'osm-node-11013718913',
    name: '2Bites',
    location: 'Ağabey Sk. No:17/A, Moda',
    categoryId: 'burger',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-burger-minieatery',
    name: 'Mini Eatery',
    location: 'Moda Cd. No:55/C, Moda',
    categoryId: 'burger',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-burger-bob',
    name: 'B.O.B Best of Burger',
    location: 'Kafein Sk. No:1/A, Moda',
    categoryId: 'burger',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },

  // Pizza (100% Moda)
  {
    id: 'osm-node-4831086823',
    name: 'Pizzeria Il Pellicano',
    location: 'Keresteci Aziz Sk. No:36/B, Moda',
    categoryId: 'pizza',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'osm-node-4831201051',
    name: 'Fornello Pizzeria',
    location: 'Dr. Esat Işık Cd. No:38, Moda',
    categoryId: 'pizza',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-pizza-pauls',
    name: "Paul's Pizza & Lasagna",
    location: 'Dr. İhsan Ünlüer Sk. No:19, Moda',
    categoryId: 'pizza',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-pizza-sliceguy',
    name: 'Sliceguy',
    location: 'Moda Cd. No:150/A, Moda',
    categoryId: 'pizza',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },

  // Kahvaltı (100% Moda)
  {
    id: 'kadikoy-breakfast-zapata',
    name: 'Zapata Bakery',
    location: 'Şevki Bey Sk. No:31/A, Moda',
    categoryId: 'breakfast',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-breakfast-180',
    name: '180° Coffee Bakery',
    location: 'Dr. Esat Işık Cd. No:36/A, Moda',
    categoryId: 'breakfast',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-breakfast-naan',
    name: 'Naan Bakeshop',
    location: 'Moda Cd. No:113, Moda',
    categoryId: 'breakfast',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-breakfast-munchies',
    name: 'Munchies Crepe & Pancake',
    location: 'Moda Cd. No:147/A, Moda',
    categoryId: 'breakfast',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },

  // Tatlı & Pastane (100% Moda)
  {
    id: 'kadikoy-dessert-asuman',
    name: 'Asuman',
    location: 'Şair Nefi Sk. No:9/A, Moda',
    categoryId: 'dessert',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'kadikoy-dessert-cikolatadukkani',
    name: 'Çikolata Dükkanı',
    location: 'Yeni Fikir Sk. No:1, Moda',
    categoryId: 'dessert',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-dessert-aliusta',
    name: 'Dondurmacı Ali Usta',
    location: 'Moda Cd. No:176/B, Moda',
    categoryId: 'dessert',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-dessert-dem',
    name: 'Dem Moda',
    location: 'Şair Nefi Sk. No:9/1, Moda',
    categoryId: 'dessert',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },

  // Date Mekanları (100% Moda)
  {
    id: 'kadikoy-date-aida',
    name: 'Aida - Vino e Cucina',
    location: 'Ressam Şeref Akdik Sk. No:10, Moda',
    categoryId: 'date',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-date-rita',
    name: 'Rita Moda',
    location: 'Şair Nefi Sk. No:14, Moda',
    categoryId: 'date',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-date-fauna',
    name: 'Fauna',
    location: 'Küçük Moda Sk. No:26/A, Moda',
    categoryId: 'date',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'moda-date-kayikhane',
    name: 'Moda Kayıkhane',
    location: 'Moda Cad. No:194, Moda Sahili',
    categoryId: 'date',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
];

export const YELDEGIRMENI_CATEGORIES = [
  { slug: 'kahvalti', id: 'breakfast', label: 'Kahvaltı & Fırın', isMustTry: false },
  { slug: 'kahve', id: 'coffee', label: 'Kahve', isMustTry: false },
  { slug: 'hamburger', id: 'burger', label: 'Sokak Lezzetleri & Burger', isMustTry: false },
  { slug: 'tatli-pastane', id: 'dessert', label: 'Tatlı & Pastane', isMustTry: false },
];

export const YELDEGIRMENI_VENUES: VisitorVenueData[] = [
  // Kahvaltı & Fırın (100% Yeldeğirmeni)
  {
    id: 'yeldegirmeni-breakfast-kuff',
    name: 'Küff Yeldeğirmeni',
    location: 'Karakolhane Cd. No:54, Yeldeğirmeni',
    categoryId: 'breakfast',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-breakfast-garda',
    name: 'Garda Kafe',
    location: 'Karakolhane Cd. No:39, Yeldeğirmeni',
    categoryId: 'breakfast',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-breakfast-nayn',
    name: 'Nayn Artisan Bakery',
    location: 'İskele Sk. No:44, Yeldeğirmeni',
    categoryId: 'breakfast',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-breakfast-muutto',
    name: 'Muutto Street Food & Bar',
    location: 'Karakolhane Cd. No:57, Yeldeğirmeni',
    categoryId: 'breakfast',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },

  // Kahve (100% Yeldeğirmeni)
  {
    id: 'yeldegirmeni-coffee-montag',
    name: 'Montag Coffee Roasters',
    location: 'Yurttaş Sk. No:19, Yeldeğirmeni',
    categoryId: 'coffee',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-coffee-benazio',
    name: 'Benazio Coffee',
    location: 'Karakolhane Cd. No:46, Yeldeğirmeni',
    categoryId: 'coffee',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-coffee-village',
    name: 'Village Coffee & Books',
    location: 'Recaizade Sk. No:54/A, Yeldeğirmeni',
    categoryId: 'coffee',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-coffee-hang',
    name: 'Hang Roastery',
    location: 'İskele Sk. No:20, Yeldeğirmeni',
    categoryId: 'coffee',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },

  // Hamburger & Sokak Lezzetleri (100% Yeldeğirmeni)
  {
    id: 'yeldegirmeni-burger-bready',
    name: 'Bready Yeldeğirmeni',
    location: 'Recaizade Sk. No:24, Yeldeğirmeni',
    categoryId: 'burger',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-burger-kup',
    name: 'Kup Gastro Burger',
    location: 'Karakolhane Cd. No:48, Yeldeğirmeni',
    categoryId: 'burger',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-burger-durumcuemre',
    name: 'Dürümcü Emre',
    location: 'Misak-ı Milli Sk. No:32, Yeldeğirmeni',
    categoryId: 'burger',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-burger-no22',
    name: 'No:22 Street Food',
    location: 'Karakolhane Cd. No:22, Yeldeğirmeni',
    categoryId: 'burger',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },

  // Tatlı & Pastane (100% Yeldeğirmeni)
  {
    id: 'yeldegirmeni-dessert-kafeka',
    name: 'Kafeka Yeldeğirmeni',
    location: 'Misak-ı Milli Sk. No:68, Yeldeğirmeni',
    categoryId: 'dessert',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-dessert-cikolataci',
    name: 'Yeldeğirmeni Çikolatacısı',
    location: 'Karakolhane Cd. No:62, Yeldeğirmeni',
    categoryId: 'dessert',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-dessert-naynpatisserie',
    name: 'Nayn Pâtisserie',
    location: 'İskele Sk. No:42, Yeldeğirmeni',
    categoryId: 'dessert',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  {
    id: 'yeldegirmeni-dessert-zumrut',
    name: 'Zümrüt Pastanesi & Çay Evi',
    location: 'Karakolhane Cd. No:18, Yeldeğirmeni',
    categoryId: 'dessert',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
];

export const REGIONAL_CONFIGS: Record<string, {
  region: { id: string; slug: string; name: string; displayName: string; path: string[] };
  categories: { slug: string; id: string; label: string; isMustTry: boolean }[];
  venues: VisitorVenueData[];
}> = {
  moda: {
    region: { id: 'moda-kadikoy', slug: 'moda', name: 'Moda', displayName: 'Moda, Kadıköy, İstanbul', path: ['istanbul', 'kadikoy', 'moda'] },
    categories: MODA_CATEGORIES,
    venues: MODA_NON_COFFEE_VENUES,
  },
  yeldegirmeni: {
    region: { id: 'yeldegirmeni-kadikoy', slug: 'yeldegirmeni', name: 'Yeldeğirmeni', displayName: 'Yeldeğirmeni, Kadıköy, İstanbul', path: ['istanbul', 'kadikoy', 'yeldegirmeni'] },
    categories: YELDEGIRMENI_CATEGORIES,
    venues: YELDEGIRMENI_VENUES,
  },
};

export function buildIntegrationDiscovery(cards:VisitorVenueData[],region='moda',category='kahve'):IntegrationDiscovery|null {
 const regConfig = REGIONAL_CONFIGS[region];
 if(!regConfig)return null;

 let allVenues = regConfig.venues;
 if (region === 'moda') {
  const coffeeVenues = cards.filter(c => c.categoryId === 'coffee');
  const existingIds = new Set(coffeeVenues.map(c => c.id));
  allVenues = [...coffeeVenues, ...regConfig.venues.filter(v => !existingIds.has(v.id))];
 }

 const targetCategory = category || regConfig.categories[0]?.slug || 'kahve';

 return {
  schemaVersion: 1,
  dataKind: 'real-research',
  mode: 'integration-preparation',
  productionPublished: false,
  region: regConfig.region,
  categories: regConfig.categories,
  categorySlug: targetCategory,
  venues: allVenues.map(v => ({
   id: v.id,
   name: v.name,
   location: v.location,
   categoryId: v.categoryId,
   description: v.description,
   whatToOrder: [...v.whatToOrder],
   menuFrom: [...(v.menuFrom || [])],
   alsoTry: [...v.alsoTry],
   beforeYouGo: [...v.beforeYouGo],
   photo: v.photo ? { url: v.photo.url } : null,
   ratings: copyVisitorGoogleRatings(v.ratings),
  })),
  rituals: [],
 };
}

// Retain only our own visitor content; future licensed ratings bypass retained caching.
const cachedVisitor=createVisitorCache<IntegrationDiscovery|null>(30_000,4,data=>!data?.venues.some(v=>v.ratings.length));
export async function readIntegrationDiscovery(region='moda',category='kahve'){
 const regConfig = REGIONAL_CONFIGS[region];
 if(!regConfig)return null;
 const targetCategory = category || regConfig.categories[0]?.slug || 'kahve';

 let data: IntegrationDiscovery | null = null;
 if(process.env.GASTRONOMY_DATA_SOURCE==='supabase'){
  try {
   const {readCloudPublication}=await import('../../cloud/publication');
   data = await readCloudPublication(region+'/'+targetCategory);
  } catch {}
 }
 if(!data){
  const version=await visitorSourceVersion();
  data = await cachedVisitor(`${region}/${targetCategory}/${version}`,async()=>{
   const selection=await readVisitorVenueSelection(regConfig.region.id,'coffee');
   return buildIntegrationDiscovery(selection.cards,region,targetCategory);
  });
 }
 if(data){
  const existingIds = new Set(data.venues.map(v => v.id));
  const missing = regConfig.venues.filter(v => !existingIds.has(v.id));
  return {
   ...data,
   region: regConfig.region,
   categories: regConfig.categories,
   venues: [...data.venues, ...missing]
  };
 }
 return null;
}
