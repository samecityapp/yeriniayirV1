require('dotenv').config({path:'.env.local',quiet:true});require('./research-ts-loader.cjs');
const fs=require('fs/promises');const {readVenueSelection}=require('../lib/pilot/gastronomy/selectionReader.ts');const {DETAILS_FIELDS,verifiedRating,branchMismatchReason,venueFingerprint}=require('../lib/pilot/googlePlaces/client.ts');const {googlePlacesFetch}=require('../lib/pilot/googlePlaces/transport.ts');
(async()=>{
 const base='work/google-places/',marker=base+'details-after-ip.json';try{await fs.access(marker);console.log('Details already attempted; no repeat.');return;}catch{}
 const approval=JSON.parse(await fs.readFile(base+'approval.json','utf8')),store=JSON.parse(await fs.readFile(base+'place-ids.json','utf8')),receipt=JSON.parse(await fs.readFile(base+'resume-after-ip-receipt.json','utf8'));
 if(approval.id!=='user-approved-20261031-eight-requests-v2')throw Error('APPROVAL_SCOPE');
 const views=await readVenueSelection(),results=[];await fs.writeFile(marker,JSON.stringify({status:'started'}),{flag:'wx',mode:0o600});
 for(const id of ['osm-node-6124757286','osm-node-8017443297','osm-node-9375785317']){
  const v=views.cards.find(c=>c.id===id),candidate=receipt.results.find(r=>r.venueId===id)?.identityChecks.find(c=>c.issue==='name'||c.issue==='door-or-unit');if(!v||!candidate?.placeId)continue;
  if(Date.now()>=Date.parse(approval.expiresAt)||store.requests.filter(r=>r.approvalId===approval.id).length>=8||store.requests.some(r=>r.approvalId===approval.id&&r.kind==='details'&&r.venueId===id))throw Error('BUDGET_OR_EXPIRY');
  store.requests.push({approvalId:approval.id,at:new Date().toISOString(),kind:'details',venueId:id});await fs.writeFile(base+'place-ids.json',JSON.stringify(store,null,2),{mode:0o600});
  const response=await googlePlacesFetch('https://places.googleapis.com/v1/places/'+encodeURIComponent(candidate.placeId),{method:'GET',redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(12000),headers:{'X-Goog-Api-Key':process.env.GOOGLE_PLACES_API_KEY,'X-Goog-FieldMask':DETAILS_FIELDS}});
  if(!response.ok){results.push({venueId:id,status:'request-failed',failureCode:'GOOGLE_HTTP_'+response.status});break;}
  const body=await response.json();const r=verifiedRating(v,body,new Date().toISOString());
  if(r.status==='verified'){store.pins[id]={placeId:r.placeId,fingerprint:venueFingerprint(v),matchedAt:r.verifiedAt};await fs.writeFile(base+'place-ids.json',JSON.stringify(store,null,2),{mode:0o600});console.log(JSON.stringify({venueId:id,rating:r.rating,verifiedAt:r.verifiedAt,mapsUri:r.mapsUri,requiredAttributions:r.attributions}));}
  results.push({venueId:id,status:r.status,issue:branchMismatchReason(v,body)});
 }
 const meta={results,totalRequests:store.requests.filter(r=>r.approvalId===approval.id).length,googleContentStored:false};await fs.writeFile(marker,JSON.stringify(meta,null,2),{mode:0o600});console.log(JSON.stringify(meta,null,2));
})().catch(()=>{console.error('Details run stopped, no automatic retry.');process.exitCode=1});
