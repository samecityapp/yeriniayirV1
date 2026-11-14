import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { BBOX,SOURCES,fetchText,parseOsm } from '../research/engine';
import { getRegionBBox } from '../research/geoRegistry';
import type { ManagedCandidate } from './types';
const directory=path.join(process.cwd(),'work','gastronomy-management','discovery');
export async function readAdditionalDiscovery():Promise<ManagedCandidate[]> {
 try{const files=(await fs.readdir(directory)).filter(n=>/^[a-z0-9-]+\.json$/.test(n));const datasets=await Promise.all(files.map(n=>fs.readFile(path.join(directory,n),'utf8').then(JSON.parse)));return datasets.flatMap(d=>d.candidates);}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return [];throw e;}
}
export async function discoverCategory(regionId:string,categoryId:string):Promise<string[]> {
 if(process.env.VERCEL||process.env.NODE_ENV==='production')throw new Error('Local discovery only');
 const bbox=getRegionBBox(regionId)||(regionId==='moda-kadikoy'?BBOX:null);
 if(!bbox)return ['Bu bölgenin coğrafi keşif adaptörü yapılandırılmadı; konum uydurulmadı.'];
 const filters:Record<string,string>={'must-try':'["amenity"="restaurant"]',burger:'["amenity"="restaurant"]["cuisine"~"burger|hamburger",i]',pizza:'["amenity"="restaurant"]["cuisine"~"pizza",i]',breakfast:'["amenity"~"restaurant|cafe"]["cuisine"~"breakfast|brunch",i]',regional:'["amenity"="restaurant"]["cuisine"~"turkish|regional|local|kebab",i]',dessert:'["shop"~"bakery|confectionery|pastry",i]'};
 if(!filters[categoryId])return ['Bu kategori için canlı keşif adaptörü yok; ek araştırma kuyruğunda.'];
 const query=`[out:json][timeout:25];nwr${filters[categoryId]}(${bbox.join(',')});out center meta;`;
 const now=new Date().toISOString(),data=JSON.parse(await fetchText(`${SOURCES.osm}?data=${encodeURIComponent(query)}`));
 const candidates:ManagedCandidate[]=parseOsm(data,now).candidates.map(c=>({id:c.id,name:c.name,regionId,categoryIds:[categoryId],address:c.address,coordinates:c.coordinates,identityVerified:false,operation:c.operation==='closure-signal'?'closure-signal':'unknown',evidence:[],conflicts:[],claimNotes:[`OSM kategori adayı; kalite/uzmanlık onayı değildir. Erişim ${now}. Kaynak: ${c.evidence[0].url}`],reportId:`osm-${now}`}));
 await fs.mkdir(directory,{recursive:true});const file=path.join(directory,categoryId+'.json'),temp=file+'.tmp';await fs.writeFile(temp,JSON.stringify({at:now,candidates},null,2));await fs.rename(temp,file);
 return [`${candidates.length} harita adayı keşfedildi. Bağımsız ürün/deneyim kaynakları olmadan yayımlanmaz.`];
}
