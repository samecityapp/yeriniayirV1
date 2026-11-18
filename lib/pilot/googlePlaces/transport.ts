import https from 'node:https';
import {Readable} from 'node:stream';

// The local API key is restricted to the user's public IPv4. Never fall back to
// unrestricted IPv6, a proxy, another hostname, redirects or disabled TLS checks.
export function createGooglePlacesFetch(request:typeof https.request=https.request):typeof fetch {
 return async(input,init)=>{
  const url=new URL(input instanceof Request?input.url:String(input));
  if(url.protocol!=='https:'||url.hostname!=='places.googleapis.com'||(url.port&&url.port!=='443')||url.username||url.password||!url.pathname.startsWith('/v1/places'))throw Error('PLACES_TRANSPORT_SCOPE');
  const headers:Record<string,string>={};new Headers(init?.headers).forEach((v,k)=>{headers[k]=v;});
  return new Promise<Response>((resolve,reject)=>{
   const req=request(url,{method:init?.method||'GET',headers,family:4},res=>{
    const responseHeaders=new Headers();for(const [key,value] of Object.entries(res.headers))if(value!==undefined)responseHeaders.set(key,Array.isArray(value)?value.join(', '):value);
    res.once('end',cleanup);res.once('close',cleanup);
    resolve(new Response([204,205,304].includes(res.statusCode||0)?null:Readable.toWeb(res) as ReadableStream<Uint8Array>,{status:res.statusCode||502,headers:responseHeaders}));
   });
   const abort=()=>req.destroy(Error('PLACES_REQUEST_ABORTED'));
   const cleanup=()=>init?.signal?.removeEventListener('abort',abort);
   req.once('error',()=>{cleanup();reject(Error('PLACES_TRANSPORT_FAILED'));});req.setTimeout(12000,abort);
   if(init?.signal?.aborted){abort();return;}init?.signal?.addEventListener('abort',abort,{once:true});
   if(init?.body){if(typeof init.body!=='string'){req.destroy(Error('PLACES_BODY_TYPE'));return;}req.write(init.body);}req.end();
  });
 };
}
export const googlePlacesFetch=createGooglePlacesFetch();
