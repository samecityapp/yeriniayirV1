import {NextRequest,NextResponse} from 'next/server';
import {checkPilotAdmin,PILOT_PRIVATE_HEADERS,pilotAuthFailureHeaders} from '@/lib/pilot/adminAuth';
import {readIntegrationDiscovery} from '@/lib/pilot/integration/discovery';
export const dynamic='force-dynamic';export const runtime='nodejs';
export async function GET(request:NextRequest){
 const auth=await checkPilotAdmin(request.headers.get('authorization'));
 if(!auth.ok)return NextResponse.json({error:'Admin access denied'},{status:auth.status,headers:pilotAuthFailureHeaders(auth.status)});
 const respond=(data:object,status=200)=>NextResponse.json(data,{status,headers:PILOT_PRIVATE_HEADERS});
 if(process.env.NODE_ENV==='production'||process.env.VERCEL||!['127.0.0.1','localhost','[::1]'].includes(request.nextUrl.hostname))return respond({error:'Local integration preparation only'},403);
 const region=request.nextUrl.searchParams.get('region')||'moda',category=request.nextUrl.searchParams.get('category')||'kahve';
 const data=await readIntegrationDiscovery(region,category);
 return data?respond(data):respond({error:'Region/category not researched'},404);
}
