import { NextRequest,NextResponse } from 'next/server';
import { checkPilotAdmin,PILOT_PRIVATE_HEADERS,pilotAuthFailureHeaders } from '@/lib/pilot/adminAuth';
import { readManagementView,changeManagement } from '@/lib/pilot/gastronomy/store';
import { runResearchCycle } from '@/lib/pilot/gastronomy/pipeline';
import { ManagementError } from '@/lib/pilot/gastronomy/state';
import type { ManagementAction } from '@/lib/pilot/gastronomy/types';
export const dynamic='force-dynamic';export const runtime='nodejs';
const respond=(data:object,status=200)=>NextResponse.json(data,{status,headers:PILOT_PRIVATE_HEADERS});
export async function GET(request:NextRequest){const auth=await checkPilotAdmin(request.headers.get('authorization'));if(!auth.ok)return NextResponse.json({error:'Admin access denied'},{status:auth.status,headers:pilotAuthFailureHeaders(auth.status)});try{return respond(await readManagementView());}catch{return respond({error:'Yönetim kaydı okunamadı.'},500);}}
export async function POST(request:NextRequest){
 const auth=await checkPilotAdmin(request.headers.get('authorization'));if(!auth.ok)return NextResponse.json({error:'Admin access denied'},{status:auth.status,headers:pilotAuthFailureHeaders(auth.status)});
 const origin=`${request.nextUrl.protocol}//${request.headers.get('host')||request.nextUrl.host}`;
 if(request.headers.get('origin')!==origin||!['same-origin',null].includes(request.headers.get('sec-fetch-site')))return respond({error:'Same-origin required'},403);
 if(!['localhost','127.0.0.1','[::1]'].includes(new URL(origin).hostname)||process.env.VERCEL||process.env.NODE_ENV==='production')return respond({error:'Local development only'},403);
 if(request.headers.get('content-type')?.split(';')[0]!=='application/json')return respond({error:'JSON required'},415);
 if(Number(request.headers.get('content-length'))>16000)return respond({error:'Body too large'},413);
 let action:ManagementAction;
 try{const text=await request.text();if(text.length>16000)return respond({error:'Body too large'},413);const body=JSON.parse(text);if(!body||typeof body!=='object'||Array.isArray(body)||!['add','remove','reset','order','run','undo','create-region','categories','new-candidate'].includes(body.type)||!Number.isInteger(body.revision))return respond({error:'Invalid management action'},400);action=body;}catch{return respond({error:'Invalid JSON'},400);}
 try{return respond(action.type==='run'?await runResearchCycle(action,'engine'):await changeManagement(action));}catch(e){return respond({error:e instanceof ManagementError?e.message:'İşlem tamamlanamadı; mevcut kayıt korundu.'},e instanceof ManagementError?e.status:400);}
}
