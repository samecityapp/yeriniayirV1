require('dotenv').config({path:'.env.local',quiet:true});require('./research-ts-loader.cjs');
const fs=require('fs/promises');const{readVenueSelection}=require('../lib/pilot/gastronomy/selectionReader.ts');const{DETAILS_FIELDS,verifiedRating,branchMismatchReason,venueFingerprint}=require('../lib/pilot/googlePlaces/client.ts');const{googlePlacesFetch}=require('../lib/pilot/googlePlaces/transport.ts');
(async()=>{
 const dir='work/google-places/',marker=dir+'three-details-consent12.json';try{await fs.access(marker);console.log('Already attempted; no automatic retry.');return;}catch{}
 const store=JSON.parse(await fs.readFile(dir+'place-ids.json','utf8')),aid='user-approved-20261031-eight-requests-v2';if(store.requests.filter(r=>r.approvalId===aid).length!==9)throw Error('BUDGET_STATE');
 const previous=JSON.parse(await fs.readFile(dir+'resume-after-ip-receipt.json','utf8')),extra=JSON.parse(await fs.readFile(dir+'extra-cekirdek-receipt.json','utf8'));
 const targets=[{id:'osm-node-5764070654',pin:extra.checks[0].placeId},...['osm-node-8017443297','osm-node-9375785317'].map(id=>({id,pin:previous.results.find(r=>r.venueId===id).identityChecks.find(r=>r.issue!=='distance').placeId}))];
 await fs.writeFile(marker,JSON.stringify({status:'started',additionalConsent:'explicit-user-approval',totalCap:12}),{flag:'wx',mode:0o600});const venues=(await readVenueSelection()).cards,results=[];
 for(const target of targets){
  if(store.requests.filter(r=>r.approvalId===aid).length>=12)throw Error('CAP');const v=venues.find(v=>v.id===target.id);store.requests.push({approvalId:aid,at:new Date().toISOString(),kind:'details',venueId:v.id});await fs.writeFile(dir+'place-ids.json',JSON.stringify(store,null,2),{mode:0o600});
  const response=await googlePlacesFetch('https://places.googleapis.com/v1/places/'+encodeURIComponent(target.pin),{method:'GET',redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(12000),headers:{'X-Goog-Api-Key':process.env.GOOGLE_PLACES_API_KEY,'X-Goog-FieldMask':DETAILS_FIELDS}});
  if(!response.ok){results.push({venueId:v.id,status:'request-failed',failureCode:'GOOGLE_HTTP_'+response.status});break;}
  const p=await response.json(),r=verifiedRating(v,p,new Date().toISOString());
  results.push({venueId:v.id,status:r.status,issue:branchMismatchReason(v,p)});
  if(r.status==='verified'){store.pins[v.id]={placeId:r.placeId,fingerprint:venueFingerprint(v),matchedAt:r.verifiedAt};await fs.writeFile(dir+'place-ids.json',JSON.stringify(store,null,2),{mode:0o600});console.log(JSON.stringify({venueId:r.venueId,rating:r.rating,verifiedAt:r.verifiedAt,mapsUri:r.mapsUri,requiredAttributions:r.attributions}));}
 }
 const summary={results,totalRequests:store.requests.filter(r=>r.approvalId===aid).length,googleContentStored:false};await fs.writeFile(marker,JSON.stringify(summary,null,2),{mode:0o600});console.log(JSON.stringify(summary,null,2));
})().catch(()=>{console.error('Approved three-detail run stopped; no automatic retry.');process.exitCode=1});
