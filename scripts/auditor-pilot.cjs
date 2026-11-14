require('./research-ts-loader.cjs');
const {enqueueAudit,runNextAudit,readAuditorView}=require('../lib/pilot/auditor/store.ts');
(async()=>{await enqueueAudit('moda','coffee');const id=await runNextAudit();const view=await readAuditorView(),job=view.jobs.find(j=>j.id===id);console.log(JSON.stringify({jobId:id,status:job?.status,stats:job?.report?.stats,sources:job?.report?.sources.map(s=>({id:s.id,status:s.status,error:s.error,cache:s.fromCache,unchanged:s.unchanged})),corrections:view.activeCorrectionIds.length},null,2));})().catch(e=>{console.error(e.message);process.exitCode=1;});
