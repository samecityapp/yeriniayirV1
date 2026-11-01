import { NextRequest, NextResponse } from 'next/server';
import { checkPilotAdmin, PILOT_PRIVATE_HEADERS, pilotAuthFailureHeaders } from '@/lib/pilot/adminAuth';
import { executeResearch, readLatestResearch, ResearchBusyError } from '@/lib/pilot/research/store';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const respond = (body: object, status=200) => NextResponse.json(body,{status,headers:PILOT_PRIVATE_HEADERS});
export async function GET(request: NextRequest) {
  const auth=await checkPilotAdmin(request.headers.get('authorization'));
  if (!auth.ok) return NextResponse.json({error:'Admin access denied'},{status:auth.status,headers:pilotAuthFailureHeaders(auth.status)});
  try { return respond({run:await readLatestResearch()}); } catch { return respond({error:'Yerel sonuç dosyası okunamadı.'},500); }
}
export async function POST(request: NextRequest) {
  const auth=await checkPilotAdmin(request.headers.get('authorization'));
  if (!auth.ok) return NextResponse.json({error:'Admin access denied'},{status:auth.status,headers:pilotAuthFailureHeaders(auth.status)});
  const expectedOrigin=`${request.nextUrl.protocol}//${request.headers.get('host')||request.nextUrl.host}`;
  const fetchSite=request.headers.get('sec-fetch-site');
  if (request.headers.get('origin')!==expectedOrigin || (fetchSite && fetchSite!=='same-origin')) return respond({error:'Same-origin request required'},403);
  if (process.env.VERCEL || !['localhost','127.0.0.1','[::1]'].includes(new URL(expectedOrigin).hostname)) return respond({error:'Araştırma yalnızca yerel geliştirmede çalıştırılabilir.'},403);
  if (request.headers.get('content-type')?.split(';')[0].trim()!=='application/json') return respond({error:'JSON required'},415);
  if (Number(request.headers.get('content-length'))>128) return respond({error:'Body too large'},413);
  try {
    const text=await request.text();
    if (text.length>128) return respond({error:'Body too large'},413);
    const body=JSON.parse(text);
    if (!body || typeof body!=='object' || Array.isArray(body) || Object.keys(body).length) return respond({error:'Boş JSON nesnesi gerekli; özel URL veya sorgu kabul edilmez.'},400);
  } catch { return respond({error:'Invalid JSON'},400); }
  try { return respond(await executeResearch()); }
  catch(error) {return respond({error:error instanceof ResearchBusyError?error.message:'Araştırma tamamlanamadı; son kayıt korunuyor.'},error instanceof ResearchBusyError?409:500);}
}
