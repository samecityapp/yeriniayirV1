import {cookies} from 'next/headers';
import {ADMIN_COOKIE,PRIVATE_HEADERS,sameOrigin} from '@/lib/cloud/auth';
import {cloudClient} from '@/lib/cloud/client';
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Forbidden'},{status:403,headers:PRIVATE_HEADERS});
 const jar=await cookies(),token=jar.get(ADMIN_COOKIE)?.value;
 if(token){try{const client=cloudClient();await client.auth.admin.signOut(token,'local');}catch{/* Cookie is still deleted; token expires shortly. */}}
 jar.delete(ADMIN_COOKIE);return Response.json({ok:true},{headers:PRIVATE_HEADERS});
}
