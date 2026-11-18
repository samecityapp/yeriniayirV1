require('./research-ts-loader.cjs');
const { executeResearch } = require('../lib/pilot/research/store.ts');
executeResearch().then(({run,reused})=>{
  console.log(JSON.stringify({id:run.id,status:run.status,candidates:run.candidates.length,branches:run.candidates.filter(c=>c.coordinates).length,duplicatesMerged:run.duplicatesMerged,sources:run.sources,coverage:run.coverage,reused},null,2));
}).catch(error=>{console.error(error.message);process.exitCode=1;});
