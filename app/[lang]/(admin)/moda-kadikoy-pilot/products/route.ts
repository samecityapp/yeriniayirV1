import {NextRequest,NextResponse} from 'next/server';
import {checkPilotAdmin,PILOT_PRIVATE_HEADERS,pilotAuthFailureHeaders} from '@/lib/pilot/adminAuth';
import {readAllProductResearch} from '@/lib/pilot/quality/productResearch';
export const dynamic='force-dynamic';export const runtime='nodejs';
export async function GET(request:NextRequest){
 const auth=await checkPilotAdmin(request.headers.get('authorization'));
 if(!auth.ok)return NextResponse.json({error:'Admin access denied'},{status:auth.status,headers:pilotAuthFailureHeaders(auth.status)});
 if(process.env.NODE_ENV==='production'||process.env.VERCEL||!['localhost','127.0.0.1','[::1]'].includes(request.nextUrl.hostname))return NextResponse.json({error:'Local research only'},{status:403,headers:PILOT_PRIVATE_HEADERS});
 return NextResponse.json(readAllProductResearch(),{headers:PILOT_PRIVATE_HEADERS});
}
