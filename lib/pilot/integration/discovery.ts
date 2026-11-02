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
  // Hamburger
  {
    id: 'kadikoy-burger-basta',
    name: 'Basta! Street Food Bar',
    location: 'Sakız Gülü Sk. No:1, Caferağa, Kadıköy',
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
    id: 'kadikoy-burger-zapata',
    name: 'Zapata Burger',
    location: 'Sakız Sk. No:1/C, Moda, Kadıköy',
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
    location: 'Ağabey Sk. No:17/A, Moda, Kadıköy',
    categoryId: 'burger',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  // Pizza
  {
    id: 'osm-node-4831086823',
    name: 'Pizzeria Il Pellicano',
    location: 'Keresteci Aziz Sk. No:36/B, Moda, Kadıköy',
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
    location: 'Dr. Esat Işık Cd. No:38, Moda, Kadıköy',
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
    id: 'kadikoy-pizza-nappo',
    name: 'Nappo Pizza',
    location: 'Damacı Sk. No:2, Caferağa, Kadıköy',
    categoryId: 'pizza',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  // Kahvaltı
  {
    id: 'kadikoy-breakfast-brekkie',
    name: 'Brekkie Croissant & Breakfast',
    location: 'Yoğurtçu Parkı Cd. No:24/1, Kadıköy',
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
    id: 'kadikoy-breakfast-zapata',
    name: 'Zapata Bakery',
    location: 'Şevki Bey Sk. No:31/A, Moda, Kadıköy',
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
    id: 'kadikoy-breakfast-kuff',
    name: 'Küff Yeldeğirmeni',
    location: 'Karakolhane Cd. No:54, Yeldeğirmeni, Kadıköy',
    categoryId: 'breakfast',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  // Tatlı & Pastane
  {
    id: 'kadikoy-dessert-baylan',
    name: 'Baylan Pastanesi',
    location: 'Muvakkithane Cd. No:9/A, Kadıköy Çarşı',
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
    id: 'kadikoy-dessert-asuman',
    name: 'Asuman',
    location: 'Şair Nefi Sk. No:9/A, Moda, Kadıköy',
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
    location: 'Yeni Fikir Sk. No:1, Moda, Kadıköy',
    categoryId: 'dessert',
    description: null,
    whatToOrder: [],
    menuFrom: [],
    alsoTry: [],
    beforeYouGo: [],
    photo: null,
    ratings: [],
  },
  // Date Mekanları
  {
    id: 'kadikoy-date-aida',
    name: 'Aida - Vino e Cucina',
    location: 'Ressam Şeref Akdik Sk. No:10, Moda, Kadıköy',
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
    id: 'kadikoy-date-viktorlevi',
    name: 'Viktor Levi Şarap Evi',
    location: 'Damacı Sk. No:4, Caferağa, Kadıköy',
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
    id: 'kadikoy-date-bastaneobistro',
    name: 'Basta Neo Bistro',
    location: 'Sakız Gülü Sk. No:1, Caferağa, Kadıköy',
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
