import {NextRequest,NextResponse} from 'next/server';
import {checkPilotAdmin,PILOT_PRIVATE_HEADERS,pilotAuthFailureHeaders} from '@/lib/pilot/adminAuth';
import {runSelectedGoogleRatings} from '@/lib/pilot/googlePlaces/run';
import {readVenueSelection} from '@/lib/pilot/gastronomy/selectionReader';
export const dynamic='force-dynamic';export const runtime='nodejs';
async function handle(request:NextRequest,execute:boolean){
 const auth=await checkPilotAdmin(request.headers.get('authorization'));if(!auth.ok)return NextResponse.json({error:'Admin access denied'},{status:auth.status,headers:pilotAuthFailureHeaders(auth.status)});
 const respond=(value:object,status=200)=>NextResponse.json(value,{status,headers:PILOT_PRIVATE_HEADERS});
 if(process.env.NODE_ENV==='production'||process.env.VERCEL||!['localhost','127.0.0.1','[::1]'].includes(request.nextUrl.hostname))return respond({error:'Local pilot only'},403);
 if(execute){if(request.headers.get('origin')!==request.nextUrl.origin||!['same-origin',null].includes(request.headers.get('sec-fetch-site')))return respond({error:'Same origin required'},403);if(!request.headers.get('content-type')?.startsWith('application/json'))return respond({error:'JSON required'},415);if(Number(request.headers.get('content-length'))>64)return respond({error:'Invalid action'},400);try{const raw=await request.text();if(raw.length>64||raw.trim()!=='{}')return respond({error:'No client approval or target overrides allowed'},400);}catch{return respond({error:'Invalid action'},400);}}
 try{const report=await runSelectedGoogleRatings(execute);const selection=await readVenueSelection();const cards=selection.cards.map(c=>{const result=report.results.find(r=>r.venueId===c.id&&r.status==='verified');return result?{...c,googleRating:result.rating,googleReviewCount:result.reviewCount,googleMaps:{placeId:result.placeId,verifiedAt:result.verifiedAt,mapsUri:result.mapsUri,attributions:result.attributions}}:c;});return respond({report,cards});}catch{return respond({error:'Google Places scope/configuration unavailable; no rating inferred'},409);}
}
export const GET=(r:NextRequest)=>handle(r,false);
export const POST=(r:NextRequest)=>handle(r,true);
