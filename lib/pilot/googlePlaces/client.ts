import {promises as fs} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {googlePlacesFetch} from './transport';
export interface PlacesVenue {id:string;name:string;address:string;coordinates:{lat:number;lng:number}}
export interface GooglePlace {id?:string;displayName?:{text?:string};formattedAddress?:string;addressComponents?:{longText:string;types:string[]}[];location?:{latitude:number;longitude:number};types?:string[];businessStatus?:string;rating?:number;userRatingCount?:number;googleMapsUri?:string;attributions?:{provider?:string;providerUri?:string}[]}
export interface RatingResult {failureCode?:string;venueId:string;status:'verified'|'not-requested'|'missing-key'|'approval-required'|'ambiguous'|'identity-unverified'|'rating-unavailable'|'request-failed'|'blocked';placeId:string|null;rating:number|null;reviewCount:number|null;verifiedAt:string|null;mapsUri:string|null;attributions:{provider:string;uri:string}[];identityChecks?:{placeId:string|null;issue:string|null}[]}
export interface PlacesReport {status:string;requestsUsed:number;keyConfigured:boolean;approvalPresent:boolean;results:RatingResult[];storedGoogleContent:false;maxRequests:8}
interface Approval {consent:'explicit-user-approval';id:string;expiresAt:string;maxRequests:8;fingerprints:string[]}
interface Store {version:1;pins:Record<string,{placeId:string;fingerprint:string;matchedAt:string}>;requests:{approvalId:string;at:string;kind:'search'|'details';venueId:string}[]}
export const IDENTITY_FIELDS='id,displayName,formattedAddress,addressComponents,location,types,businessStatus';
export const DETAILS_FIELDS=IDENTITY_FIELDS+',rating,userRatingCount,googleMapsUri,attributions';
const normalize=(s:string)=>s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,' ').trim();
const brand=(s:string)=>normalize(s.split('•')[0]).split(' ').filter(w=>!['coffee','coffe','roaster','roasters','roasting','roastery','food','and','sourdough','cafe','caffe','moda','kadikoy'].includes(w)).join(' ');
const street=(s:string)=>normalize(s).split(' ').filter(w=>!['sokagi','sokak','sok','sk','caddesi','cadde','cad','cd'].includes(w)).join('');
const house=(s:string)=>normalize(s).replace(/^(?:no|numara|number)\s*/, '').replace(/ /g,'');
export const venueFingerprint=(v:PlacesVenue)=>createHash('sha256').update(JSON.stringify({id:v.id,name:v.name,address:v.address,coordinates:v.coordinates})).digest('hex');
export const formatGoogleRating=(n:number)=>String(n).replace('.',',');
export function branchMismatchReason(v:PlacesVenue,p:GooglePlace):string|null{
 if(!p.id||!/^[-A-Za-z0-9_]{10,255}$/.test(p.id))return 'place-id';
 const expectedBrand=brand(v.name).split(' ').filter(Boolean),actualBrand=new Set(brand(p.displayName?.text||'').split(' '));
 if(!p.displayName?.text||!expectedBrand.length||!expectedBrand.every(token=>actualBrand.has(token)))return 'name';
 if(p.businessStatus!=='OPERATIONAL')return 'operation';
 if(!p.types?.some(t=>['cafe','coffee_shop','coffee_roastery'].includes(t)))return 'category';
 const lat=p.location?.latitude,lng=p.location?.longitude;if(!Number.isFinite(lat)||!Number.isFinite(lng)||!Number.isFinite(v.coordinates.lat)||!Number.isFinite(v.coordinates.lng))return 'coordinates';
 const r=Math.PI/180,h=Math.sin((lat!-v.coordinates.lat)*r/2)**2+Math.cos(lat!*r)*Math.cos(v.coordinates.lat*r)*Math.sin((lng!-v.coordinates.lng)*r/2)**2;if(12742000*Math.asin(Math.min(1,Math.sqrt(h)))>50)return 'distance';
 const parts=v.address.match(/^(.*?)\s+(\d+[A-Za-z/\-]*)$/);if(!parts)return 'local-address-format';
 const component=(type:string)=>p.addressComponents?.find(c=>c.types.includes(type))?.longText||'';
 if(street(parts[1])!==street(component('route')))return 'street';
 let number=component('street_number'),unit=component('subpremise');if(unit&&!house(number).endsWith(house(unit)))number+='/'+unit;
 if(house(number)!==house(parts[2]))return 'door-or-unit';
 return normalize(p.formattedAddress||'').includes('kadikoy')&&normalize(p.formattedAddress||'').includes('istanbul')?null:'district-city';
}
export const matchesBranch=(v:PlacesVenue,p:GooglePlace)=>branchMismatchReason(v,p)===null;
export function selectUniqueBranch(v:PlacesVenue,places:GooglePlace[]){const matches=places.filter(p=>matchesBranch(v,p));return matches.length===1?matches[0]:null;}
const empty=(v:PlacesVenue,status:RatingResult['status']):RatingResult=>({venueId:v.id,status,placeId:null,rating:null,reviewCount:null,verifiedAt:null,mapsUri:null,attributions:[]});
function httpsLink(value:string|undefined){try{const u=new URL(value||'');return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}}
export function verifiedRating(v:PlacesVenue,p:GooglePlace,now:string):RatingResult{
 if(!matchesBranch(v,p))return empty(v,'identity-unverified');
 if(typeof p.rating!=='number'||!Number.isFinite(p.rating)||p.rating<1||p.rating>5||!Number.isSafeInteger(p.userRatingCount)||p.userRatingCount! < 0)return {...empty(v,'rating-unavailable'),placeId:p.id!};
 const attributions:{provider:string;uri:string}[]=[];for(const a of p.attributions||[]){const uri=httpsLink(a.providerUri);if(!a.provider||!uri)return empty(v,'rating-unavailable');attributions.push({provider:a.provider,uri});}
 const url=httpsLink(p.googleMapsUri),host=url?new URL(url).hostname:'';
 const mapsUri=url&&['www.google.com','maps.google.com','google.com'].includes(host)?url:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(v.name+' '+v.address)+'&query_place_id='+encodeURIComponent(p.id!);
 return {venueId:v.id,status:'verified',placeId:p.id!,rating:p.rating,reviewCount:p.userRatingCount!,verifiedAt:now,mapsUri,attributions};
}
export class GooglePlacesPilot {
 constructor(readonly root=process.cwd(),readonly env:Record<string,string|undefined>=process.env,readonly fetcher:typeof fetch=googlePlacesFetch,readonly clock=()=>new Date()){}
 private folder(){return path.join(this.root,'work','google-places');}
 async status(venues:PlacesVenue[]):Promise<PlacesReport>{return this.run(venues,false);}
 async run(venues:PlacesVenue[],execute=true):Promise<PlacesReport>{
  if(venues.length!==4||new Set(venues.map(v=>v.id)).size!==4)throw Error('FOUR_SELECTED_VENUES_REQUIRED');
  const key=this.env.GOOGLE_PLACES_API_KEY?.trim()||this.env.GOOGLE_MAPS_API_KEY?.trim();let approval:Approval|null=null;
  try{approval=JSON.parse(await fs.readFile(path.join(this.folder(),'approval.json'),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')approval=null;}
  const validApproval=Boolean(approval&&approval.consent==='explicit-user-approval'&&Array.isArray(approval.fingerprints)&&typeof approval.id==='string'&&/^[-a-zA-Z0-9]{1,80}$/.test(approval.id)&&approval.maxRequests===8&&Date.parse(approval.expiresAt)>this.clock().getTime()&&Date.parse(approval.expiresAt)-this.clock().getTime()<=3600000&&JSON.stringify([...approval.fingerprints].sort())===JSON.stringify(venues.map(venueFingerprint).sort()));
  const status=!key?'missing-key':!validApproval?'approval-required':'ready';const report:PlacesReport={status,requestsUsed:0,keyConfigured:Boolean(key),approvalPresent:validApproval,results:venues.map(v=>empty(v,status==='missing-key'?'missing-key':status==='ready'?'not-requested':'approval-required')),storedGoogleContent:false,maxRequests:8};
  if(this.env.NODE_ENV==='production'||this.env.VERCEL)return {...report,status:'local-only',results:venues.map(v=>empty(v,'blocked'))};
  if(!execute&&key&&validApproval){
   try{const previous=JSON.parse(await fs.readFile(path.join(this.folder(),'place-ids.json'),'utf8')) as Store;
    const spent=previous.requests.filter(r=>r.approvalId===approval!.id).length;
    if(spent>=approval!.maxRequests)return {...report,status:'budget-exhausted',requestsUsed:spent,results:venues.map(v=>empty(v,'blocked'))};
   }catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')return {...report,status:'store-unavailable'};}
  }
  if(!execute||!key||!validApproval)return report;
  await fs.mkdir(this.folder(),{recursive:true});let lock;try{lock=await fs.open(path.join(this.folder(),'request.lock'),'wx');}catch{return {...report,status:'busy'};}
  try{let store:Store={version:1,pins:{},requests:[]};try{store=JSON.parse(await fs.readFile(path.join(this.folder(),'place-ids.json'),'utf8'));if(store.version!==1||!Array.isArray(store.requests)||!store.pins||typeof store.pins!=='object'||Array.isArray(store.pins)||!store.requests.every(r=>r&&typeof r.approvalId==='string'&&typeof r.venueId==='string'&&Number.isFinite(Date.parse(r.at))&&['search','details'].includes(r.kind)))throw Error('INVALID_STORE');}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')return {...report,status:'store-unavailable'};}
   const save=async()=>{const file=path.join(this.folder(),'place-ids.json');await fs.writeFile(file+'.tmp',JSON.stringify(store,null,2));await fs.rename(file+'.tmp',file);};let stop=false;
   const request=async(v:PlacesVenue,kind:'search'|'details',placeId?:string):Promise<unknown>=>{
    if(this.clock().getTime()>=Date.parse(approval!.expiresAt))throw Error('APPROVAL_EXPIRED');if(store.requests.filter(r=>r.approvalId===approval!.id).length>=8)throw Error('REQUEST_LIMIT');if(store.requests.some(r=>r.approvalId===approval!.id&&r.venueId===v.id&&r.kind===kind))throw Error('REQUEST_ALREADY_ATTEMPTED');
    store.requests.push({approvalId:approval!.id,at:this.clock().toISOString(),kind,venueId:v.id});await save();report.requestsUsed++;
    let response:Response;try{response=await this.fetcher(kind==='search'?'https://places.googleapis.com/v1/places:searchText':'https://places.googleapis.com/v1/places/'+encodeURIComponent(placeId!),{method:kind==='search'?'POST':'GET',redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(12000),headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':kind==='search'?IDENTITY_FIELDS.split(',').map(f=>'places.'+f).join(','):DETAILS_FIELDS},...(kind==='search'?{body:JSON.stringify({textQuery:v.name.split('•')[0]+' '+v.address+' Kadıköy İstanbul',languageCode:'tr',regionCode:'TR',pageSize:5,locationBias:{circle:{center:{latitude:v.coordinates.lat,longitude:v.coordinates.lng},radius:500}}})}:{})});}catch{throw Error('GOOGLE_REQUEST_FAILED');}
    if(!response.ok){
     const allowedReasons=new Set(['API_KEY_IP_ADDRESS_BLOCKED','API_KEY_SERVICE_BLOCKED','API_KEY_INVALID','BILLING_DISABLED','SERVICE_DISABLED','RATE_LIMIT_EXCEEDED','CONSUMER_INVALID']);
     let reason='';try{const payload=await response.json() as {error?:{details?:{reason?:string}[]}};reason=payload.error?.details?.map(d=>d.reason).find((r):r is string=>Boolean(r&&allowedReasons.has(r)))||'';}catch{}
     throw Error(reason||'GOOGLE_HTTP_'+response.status);
    }if(Number(response.headers.get('content-length'))>500000)throw Error('GOOGLE_RESPONSE_TOO_LARGE');const reader=response.body?.getReader();if(!reader)throw Error('GOOGLE_EMPTY_RESPONSE');let bytes=0;const chunks:Uint8Array[]=[];try{while(true){const{done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>500000)throw Error('GOOGLE_RESPONSE_TOO_LARGE');chunks.push(value);}}finally{await reader.cancel();}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw Error('GOOGLE_INVALID_RESPONSE');}
   };
   report.results=[];
   for(const v of venues){if(stop){report.results.push(empty(v,'blocked'));continue;}
    try{const fingerprint=venueFingerprint(v),pin=store.pins[v.id];let placeId=pin?.fingerprint===fingerprint&&this.clock().getTime()-Date.parse(pin.matchedAt)<365*86400000?pin.placeId:null;
     if(placeId&&!/^[-A-Za-z0-9_]{10,255}$/.test(placeId))placeId=null;
     if(!placeId&&store.requests.some(r=>r.approvalId===approval!.id&&r.venueId===v.id&&r.kind==='search')){report.results.push(empty(v,'blocked'));continue;}
     if(!placeId){const body=await request(v,'search')as{places?:GooglePlace[]};if(!Array.isArray(body.places)||body.places.length>5){report.results.push(empty(v,'identity-unverified'));continue;}const matches=body.places.filter(p=>matchesBranch(v,p));if(matches.length!==1){report.results.push({...empty(v,matches.length>1?'ambiguous':'identity-unverified'),identityChecks:body.places.map(p=>({placeId:p.id&&/^[-A-Za-z0-9_]{10,255}$/.test(p.id)?p.id:null,issue:branchMismatchReason(v,p)}))});continue;}placeId=matches[0].id!;store.pins[v.id]={placeId,fingerprint,matchedAt:this.clock().toISOString()};await save();}
     const details=await request(v,'details',placeId)as GooglePlace;if(details.id!==placeId){report.results.push(empty(v,'identity-unverified'));continue;}const result=verifiedRating(v,details,this.clock().toISOString());report.results.push(result);
    }catch(error){const code=error instanceof Error?error.message:'';const safe=/^(GOOGLE_HTTP_[0-9]{3}|GOOGLE_REQUEST_FAILED|GOOGLE_RESPONSE_TOO_LARGE|API_KEY_IP_ADDRESS_BLOCKED|API_KEY_SERVICE_BLOCKED|API_KEY_INVALID|BILLING_DISABLED|SERVICE_DISABLED|RATE_LIMIT_EXCEEDED|CONSUMER_INVALID|APPROVAL_EXPIRED|REQUEST_LIMIT|REQUEST_ALREADY_ATTEMPTED)$/.test(code)?code:'GOOGLE_REQUEST_FAILED';report.results.push({...empty(v,'request-failed'),failureCode:safe});stop=true;}
   }
   report.status=report.results.every(r=>r.status==='verified')?'verified':report.results.some(r=>r.status==='verified')?'partial':'unverified';return report;
  }finally{await lock.close();await fs.unlink(path.join(this.folder(),'request.lock'));}
 }
}
