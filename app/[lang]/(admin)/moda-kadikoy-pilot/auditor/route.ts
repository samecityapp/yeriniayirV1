import { NextRequest,NextResponse } from 'next/server';
import { checkPilotAdmin,PILOT_PRIVATE_HEADERS,pilotAuthFailureHeaders } from '@/lib/pilot/adminAuth';
import { readAuditorView,enqueueAudit,runNextAudit,retryAudit,undoAuditCorrections,setPeriodicAudit,AuditorError } from '@/lib/pilot/auditor/store';
export const dynamic='force-dynamic';export const runtime='nodejs';
const respond=(body:object,status=200)=>NextResponse.json(body,{status,headers:PILOT_PRIVATE_HEADERS});
export async function GET(request:NextRequest){const auth=await checkPilotAdmin(request.headers.get('authorization'));if(!auth.ok)return NextResponse.json({error:'Admin access denied'},{status:auth.status,headers:pilotAuthFailureHeaders(auth.status)});try{return respond(await readAuditorView());}catch{return respond({error:'Denetim kaydı okunamadı.'},500);}}
export async function POST(request:NextRequest){
 const auth=await checkPilotAdmin(request.headers.get('authorization'));if(!auth.ok)return NextResponse.json({error:'Admin access denied'},{status:auth.status,headers:pilotAuthFailureHeaders(auth.status)});
 const origin=`${request.nextUrl.protocol}//${request.headers.get('host')||request.nextUrl.host}`;
 if(request.headers.get('origin')!==origin||!['same-origin',null].includes(request.headers.get('sec-fetch-site')))return respond({error:'Same-origin required'},403);
 if(process.env.VERCEL||process.env.NODE_ENV==='production'||!['localhost','127.0.0.1','[::1]'].includes(new URL(origin).hostname))return respond({error:'Local audit only'},403);
 if(request.headers.get('content-type')?.split(';')[0]!=='application/json')return respond({error:'JSON required'},415);
 if(Number(request.headers.get('content-length'))>2048)return respond({error:'Body too large'},413);
 try{const text=await request.text();if(text.length>2048)return respond({error:'Body too large'},413);const action=JSON.parse(text);if(!action||typeof action!=='object'||Array.isArray(action))return respond({error:'Invalid action'},400);
  if(action.type==='check'){if(typeof action.geoId!=='string'||typeof action.category!=='string')return respond({error:'Scope required'},400);await enqueueAudit(action.geoId,action.category);if(action.geoId==='moda'&&['coffee','all'].includes(action.category))await runNextAudit();}
  else if(action.type==='retry'){if(typeof action.jobId!=='string')return respond({error:'Job required'},400);await retryAudit(action.jobId);await runNextAudit();}
  else if(action.type==='undo'){if(typeof action.jobId!=='string')return respond({error:'Job required'},400);await undoAuditCorrections(action.jobId);}
  else if(action.type==='periodic'){if(typeof action.enabled!=='boolean')return respond({error:'Boolean required'},400);await setPeriodicAudit(action.enabled);}
  else return respond({error:'Unsupported audit action'},400);
  return respond(await readAuditorView());
 }catch(e){return respond({error:e instanceof Error?e.message:'Denetim tamamlanamadı.'},e instanceof AuditorError?e.status:400);}
}
