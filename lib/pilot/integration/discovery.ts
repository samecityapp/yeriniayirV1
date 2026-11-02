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

export function buildIntegrationDiscovery(cards:VisitorVenueData[],region='moda',category='kahve'):IntegrationDiscovery|null {
 // No geographic fallback: a URL never receives another region's cards.
 if(region!=='moda')return null;
 const coffeeVenues=cards.filter(c=>c.categoryId==='coffee');
 const allVenues=[...coffeeVenues, ...MODA_NON_COFFEE_VENUES];

 return {schemaVersion:1,dataKind:'real-research',mode:'integration-preparation',productionPublished:false,
  region:{id:'moda-kadikoy',slug:'moda',name:'Moda',displayName:'Moda, Kadıköy, İstanbul',path:['istanbul','kadikoy','moda']},
  categories:MODA_CATEGORIES,categorySlug:category||'kahve',
  venues:allVenues.map(v=>({id:v.id,name:v.name,location:v.location,categoryId:v.categoryId,description:v.description,
   whatToOrder:[...v.whatToOrder],menuFrom:[...(v.menuFrom||[])],alsoTry:[...v.alsoTry],beforeYouGo:[...v.beforeYouGo],photo:v.photo?{url:v.photo.url}:null,ratings:copyVisitorGoogleRatings(v.ratings)})),rituals:[]};
}
// Retain only our own visitor content; future licensed ratings bypass retained caching.
const cachedVisitor=createVisitorCache<IntegrationDiscovery|null>(30_000,4,data=>!data?.venues.some(v=>v.ratings.length));
export async function readIntegrationDiscovery(region='moda',category='kahve'){
 if(region!=='moda')return null;
 let data: IntegrationDiscovery | null = null;
 if(process.env.GASTRONOMY_DATA_SOURCE==='supabase'){
  try {
   const {readCloudPublication}=await import('../../cloud/publication');
   data = await readCloudPublication(region+'/'+(category || 'kahve'));
  } catch {}
 }
 if(!data){
  const version=await visitorSourceVersion();
  data = await cachedVisitor(`${region}/${category}/${version}`,async()=>{
   const selection=await readVisitorVenueSelection('moda-kadikoy','coffee');
   return buildIntegrationDiscovery(selection.cards,region,category);
  });
 }
 if(data){
  const existingIds = new Set(data.venues.map(v => v.id));
  const missing = MODA_NON_COFFEE_VENUES.filter(v => !existingIds.has(v.id));
  return {
   ...data,
   categories: MODA_CATEGORIES,
   venues: [...data.venues, ...missing]
  };
 }
 return null;
}
