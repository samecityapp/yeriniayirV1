// Single user-approved run. Never prints a key or stores Google's returned content.
require('dotenv').config({path:'.env.local',quiet:true});require('./research-ts-loader.cjs');
const fs=require('node:fs/promises'),path=require('node:path');
const {readVenueSelection}=require('../lib/pilot/gastronomy/selectionReader.ts');
const {GooglePlacesPilot,venueFingerprint}=require('../lib/pilot/googlePlaces/client.ts');
(async()=>{
 const dir=path.resolve('work/google-places'),receipt=path.join(dir,'two-priorities-receipt.json');
 try{await fs.access(receipt);console.log('Already attempted; no request sent and no automatic retry.');return;}catch{}
 const selection=await readVenueSelection(),venues=selection.cards.map(c=>({id:c.id,name:c.name,address:c.address,coordinates:c.coordinates}));
 if(venues.length!==4)throw Error('FOUR_REAL_SELECTED_BRANCHES_REQUIRED');
 const id='user-approved-20261031-eight-requests-v2';await fs.mkdir(dir,{recursive:true,mode:0o700});
 const approval={consent:'explicit-user-approval',id,expiresAt:new Date(Date.now()+30*60*1000).toISOString(),maxRequests:8,fingerprints:venues.map(venueFingerprint)};
 // A durable attempt marker prevents this runner from silently restarting after a crash.
 await fs.writeFile(receipt,JSON.stringify({approvalId:id,status:'started',maxRequests:8,at:new Date().toISOString(),googleContentStored:false}),{flag:'wx',mode:0o600});
 await fs.writeFile(path.join(dir,'approval.json'),JSON.stringify(approval),{mode:0o600});
 const report=await new GooglePlacesPilot().run(venues,true);
 const metadata={approvalId:id,status:report.status,requestsUsed:report.requestsUsed,results:report.results.map(r=>({venueId:r.venueId,status:r.status,failureCode:r.failureCode||null,identityChecks:r.identityChecks||[]})),googleContentStored:false};
 await fs.writeFile(receipt,JSON.stringify(metadata,null,2),{mode:0o600});
 console.log(JSON.stringify(metadata,null,2));
 for(const r of report.results)if(r.status==='verified')console.log(JSON.stringify({venueId:r.venueId,rating:r.rating,verifiedAt:r.verifiedAt,attribution:r.mapsUri}));
})().catch(()=>{console.error('Approved Places run stopped; sensitive diagnostics withheld. Do not retry automatically.');process.exitCode=1;});
