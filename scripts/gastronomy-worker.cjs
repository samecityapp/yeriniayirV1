require('dotenv').config({path:'.env.local',quiet:true});
require('./research-ts-loader.cjs');
const {runDueReview}=require('../lib/pilot/gastronomy/pipeline.ts');
const fs=require('node:fs'),path=require('node:path');
const directory=path.join(process.cwd(),'work','gastronomy-management');fs.mkdirSync(directory,{recursive:true});
const lock=path.join(directory,'worker.lock');let fd;
try{fd=fs.openSync(lock,'wx');fs.writeFileSync(fd,String(process.pid));}catch{console.error('Worker already running, or stale worker lock needs inspection.');process.exit(1);}
let busy=false;
const cleanup=()=>{try{fs.closeSync(fd);fs.unlinkSync(lock);}catch{}};
process.on('SIGTERM',()=>{cleanup();process.exit(0);});process.on('SIGINT',()=>{cleanup();process.exit(0);});
async function tick(){if(busy)return;busy=true;try{const result=await runDueReview();fs.writeFileSync(path.join(directory,'worker-status.json'),JSON.stringify({checkedAt:new Date().toISOString(),...result}));if(result.ran)console.log(JSON.stringify(result));}catch(error){console.error(error.message);}finally{busy=false;}}
(async()=>{await tick();if(process.argv.includes('--once')){cleanup();return;}console.log('Local weekly review worker active; checks due dates every 60 seconds.');setInterval(tick,60000);})();
