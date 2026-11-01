// Rebuild the local comparison from reviewed source notes. Does not pretend to rescan the web.
require('./research-ts-loader.cjs');
const {readLatestResearch}=require('../lib/pilot/research/store.ts');
const {buildQualityReport}=require('../lib/pilot/quality/report.ts');
const {saveQualityReport}=require('../lib/pilot/quality/store.ts');
const ledger=require('../lib/pilot/quality/evidence-ledger.json');
(async()=>{const discovery=await readLatestResearch();if(!discovery)throw new Error('A real discovery run is required');const report=buildQualityReport(discovery,ledger);await saveQualityReport(report);console.log(JSON.stringify({stats:report.stats,researchedAt:report.researchedAt,discoveryRunId:report.discoveryRunId,networkRequests:0,modelCalls:0},null,2));})().catch(error=>{console.error(error.message);process.exitCode=1;});
