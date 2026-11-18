const fs=require('node:fs'),path=require('node:path');
const budget=require('./premium-performance-budget.json');const dir=path.resolve('work/premium-performance/after');
function evaluateBudget(rows){
const failures=[],groups=[];
const metric=(r,k)=>r.metrics[k];
for(const device of ['mobile','desktop']){
 for(const state of ['home','moda-coffee']){
  const runs=rows.filter(r=>r.device===device&&r.state===state&&r.mode==='navigation');
  if(new Set(runs.map(r=>r.run)).size<budget.minimumRunsPerStateAndDevice)failures.push({device,state,criterion:'at-least-3-runs'});
  for(const r of runs){const floor=device==='mobile'?budget.mobilePerformanceMin:budget.desktopPerformanceMin;
   for(const [k,min]of [['performance',floor],['accessibility',budget.accessibilityMin],['best-practices',budget.bestPracticesMin],['seo',budget.indexableProductionSeoMin]])if(!Number.isFinite(r.scores[k])||r.scores[k]<min)failures.push({device,state,run:r.run,criterion:k,value:r.scores[k],minimum:min});
   for(const [k,max]of [['largest-contentful-paint',budget.maxLcpMs],['cumulative-layout-shift',budget.maxCls]])if(!Number.isFinite(metric(r,k))||metric(r,k)>max)failures.push({device,state,run:r.run,criterion:k,value:metric(r,k),maximum:max});
  }
  groups.push({device,state,runs:runs.length,performance:runs.map(r=>r.scores.performance),lcpMs:runs.map(r=>Math.round(metric(r,'largest-contentful-paint')))});
 }
 for(const state of ['cekirdek','story','guten','montag']){
  for(const mode of ['timespan','snapshot']){
   const runs=rows.filter(r=>r.device===device&&r.state===state&&r.mode===mode);
   if(new Set(runs.map(r=>r.run)).size<3)failures.push({device,state,criterion:'3-'+mode+'-runs'});
   for(const r of runs){if(r.runtimeError)failures.push({device,state,run:r.run,criterion:'runtime-error'});
    if(mode==='timespan'){for(const[k,max]of [['interaction-to-next-paint',budget.maxInpMs],['cumulative-layout-shift',budget.maxCls]])if(!Number.isFinite(metric(r,k))||metric(r,k)>max)failures.push({device,state,run:r.run,criterion:k,value:metric(r,k),maximum:max});}
    else {for(const[k,min]of [['accessibility',budget.accessibilityMin],['best-practices',budget.bestPracticesMin]])if(!Number.isFinite(r.scores[k])||r.scores[k]<min)failures.push({device,state,run:r.run,criterion:k,value:r.scores[k],minimum:min});}
   }
  }
 }
}
const performanceFailures=failures.filter(f=>f.criterion!=='seo'),result={schemaVersion:1,releaseReady:failures.length===0,performanceBudgetPassed:performanceFailures.length===0,groups,failures,notes:['Raw noindex SEO failure is retained; do not remove preview protection for score','Modal timespan scores are not navigation scores; lab INP is not field p75 INP']};
return result;
}
module.exports={evaluateBudget};
if(require.main===module){
 if(!fs.existsSync(path.join(dir,'summary.json')))throw Error('Run the three-pass production Lighthouse matrix first');
 const result=evaluateBudget(JSON.parse(fs.readFileSync(path.join(dir,'summary.json'))));
 fs.writeFileSync(path.join(dir,'budget-result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(!result.releaseReady)process.exitCode=1;
}
