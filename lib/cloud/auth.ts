import {cookies} from 'next/headers';
import {cloudClient} from './client';
export const ADMIN_COOKIE='ya_cloud_admin';
export const PRIVATE_HEADERS={'Cache-Control':'private, no-store, max-age=0','Vary':'Cookie','X-Robots-Tag':'noindex, nofollow'};
export async function cloudAdmin(){
 const token=(await cookies()).get(ADMIN_COOKIE)?.value;
 if(!token)return null;
 const client=cloudClient(token);
 // getUser validates the token against Auth, not untrusted local cookie claims.
 const {data,error}=await client.auth.getUser(token);
 if(error||!data.user||data.user.is_anonymous)return null;
 // Database membership is authoritative on every request, including revoked members.
 const membership=await client.rpc('ya_is_admin');
 if(membership.error||membership.data!==true)return null;
 return {client,userId:data.user.id};
}
export function sameOrigin(request:Request){
 const origin=request.headers.get('origin');
 if(!origin||request.headers.get('sec-fetch-site')==='cross-site')return false;
 try{const incoming=new URL(origin),url=new URL(request.url);
  // Next may normalize 127.0.0.1 to localhost internally. Browser Host is authoritative;
  // forwarded-host is intentionally ignored, just as in the existing pilot guard.
  return !incoming.username&&!incoming.password&&incoming.origin===origin&&incoming.host===request.headers.get('host')&&incoming.protocol===url.protocol;
 }catch{return false;}
}
