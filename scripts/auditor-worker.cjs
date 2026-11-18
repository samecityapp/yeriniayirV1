require('./research-ts-loader.cjs');
const {scheduleDueAudit,runNextAudit}=require('../lib/pilot/auditor/store.ts');
const fs=require('node:fs'),path=require('node:path');const dir=path.join(process.cwd(),'work','quality-auditor');fs.mkdirSync(dir,{recursive:true});const lock=path.join(dir,'worker.lock');let fd;
try{fd=fs.openSync(lock,'wx');fs.writeFileSync(fd,String(process.pid));}catch{console.error('Audit worker lock already exists; inspect before removing.');process.exit(1);}
const cleanup=()=>{try{fs.closeSync(fd);fs.unlinkSync(lock);}catch{}};process.on('SIGTERM',()=>{cleanup();process.exit(0);});process.on('SIGINT',()=>{cleanup();process.exit(0);});let busy=false;
async function tick(){if(busy)return;busy=true;try{await scheduleDueAudit();const id=await runNextAudit();fs.writeFileSync(path.join(dir,'worker-status.json'),JSON.stringify({checkedAt:new Date().toISOString(),jobId:id}));}catch(e){console.error(e.message);}finally{busy=false;}}
(async()=>{await tick();if(!process.argv.includes('--watch')){cleanup();return;}console.log('Local audit worker: one job at a time; pilot-only periodic scheduling.');setInterval(tick,60000);})();
