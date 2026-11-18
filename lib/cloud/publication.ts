import {createVisitorCache} from '../pilot/integration/visitorCache';
import {publicationEnvelope} from './contracts';
import {cloudConfig} from './config';
import type {IntegrationDiscovery} from '../pilot/integration/discovery';
type Envelope=ReturnType<typeof publicationEnvelope.parse>;
const cache=createVisitorCache<Envelope|null>(60_000,4);
let generation=0;
export function invalidateCloudPublication(){generation++;}
export async function readCloudPublication(scope='moda/kahve'){
 if(!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(scope))return null;
 const c=cloudConfig();
 const data=await cache(c.ref+'/'+scope+'/'+generation,async()=>{
  const response=await fetch(c.url+'/rest/v1/rpc/ya_read_publication',{
   method:'POST',headers:{apikey:c.key,Authorization:'Bearer '+c.key,'Content-Type':'application/json'},
   body:JSON.stringify({p_scope:scope}),next:{revalidate:60,tags:['ya-publication']},signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw new Error('Cloud publication unavailable');
  const raw=await response.text();if(Buffer.byteLength(raw)>100_000)throw new Error('Publication exceeds budget');
  const parsed=JSON.parse(raw);if(parsed===null)return null;
  const data=publicationEnvelope.parse(parsed);
  if(data.scope!==scope||data.document.region.slug+'/'+data.document.categorySlug!==scope)throw new Error('Publication scope mismatch');
  return data;
 });
 // Rechecked on every cache hit: expiration cannot be extended by retained data.
 if(!data||Date.parse(data.validUntil)<=Date.now())return null;
 return {...data.document,rituals:[]} satisfies IntegrationDiscovery;
}
