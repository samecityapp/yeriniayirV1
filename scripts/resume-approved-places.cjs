require('dotenv').config({path:'.env.local',quiet:true});require('./research-ts-loader.cjs');
const fs=require('fs/promises');const {readVenueSelection}=require('../lib/pilot/gastronomy/selectionReader.ts');const {GooglePlacesPilot}=require('../lib/pilot/googlePlaces/client.ts');
(async()=>{
 const file='work/google-places/resume-after-ip-receipt.json';try{await fs.access(file);console.log('Resume already attempted; no request sent.');return;}catch{}
 const approval=JSON.parse(await fs.readFile('work/google-places/approval.json','utf8'));
 if(approval.id!=='user-approved-20261031-eight-requests-v2')throw Error('APPROVAL_SCOPE');
 // User confirmed the IP fix; retain the original request counter and total cap.
 approval.expiresAt=new Date(Date.now()+30*60*1000).toISOString();await fs.writeFile('work/google-places/approval.json',JSON.stringify(approval),{mode:0o600});
 await fs.writeFile(file,JSON.stringify({status:'started',approvalId:approval.id}),{flag:'wx',mode:0o600});
 const selection=await readVenueSelection(),venues=selection.cards.map(v=>({id:v.id,name:v.name,address:v.address,coordinates:v.coordinates}));const report=await new GooglePlacesPilot().run(venues,true);
 const store=JSON.parse(await fs.readFile('work/google-places/place-ids.json','utf8'));const summary={status:report.status,newRequests:report.requestsUsed,totalApprovedRequestsUsed:store.requests.filter(r=>r.approvalId===approval.id).length,results:report.results.map(r=>({venueId:r.venueId,status:r.status,failureCode:r.failureCode||null,identityChecks:r.identityChecks||[]})),googleContentStored:false};
 await fs.writeFile(file,JSON.stringify(summary,null,2),{mode:0o600});console.log(JSON.stringify(summary,null,2));
 for(const r of report.results)if(r.status==='verified')console.log(JSON.stringify({venueId:r.venueId,rating:r.rating,verifiedAt:r.verifiedAt,mapsUri:r.mapsUri}));
})().catch(()=>{console.error('Resume stopped; no automatic retries. Sensitive error detail withheld.');process.exitCode=1});
