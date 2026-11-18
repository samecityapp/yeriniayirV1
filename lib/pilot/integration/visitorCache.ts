import {promises as fs} from 'node:fs';
import path from 'node:path';

/** Per-process, short-lived visitor DTO cache. Never stores admin records or API credentials. */
export function createVisitorCache<T>(ttlMs=30_000,maxEntries=4,canRetain:(value:T)=>boolean=()=>true){
 const entries=new Map<string,{expires:number;value:Promise<T>}>();
 return async (key:string,load:()=>Promise<T>):Promise<T>=>{
  const now=Date.now(),hit=entries.get(key);
  if(hit&&hit.expires>now)return structuredClone(await hit.value);
  for(const [k,v] of Array.from(entries))if(v.expires<=now)entries.delete(k);
  while(entries.size>=maxEntries)entries.delete(entries.keys().next().value!);
  const entry={expires:now+ttlMs,value:Promise.resolve().then(load)};
  entries.set(key,entry);
  try{const value=await entry.value;if(!canRetain(value)&&entries.get(key)===entry)entries.delete(key);return structuredClone(value);}catch(error){if(entries.get(key)===entry)entries.delete(key);throw error;}
 };
}

// Atomic source/manual-decision changes alter file or directory metadata immediately.
// Time-dependent product assessments still expire after 30 seconds without a source edit.
const files=[
 'work/gastronomy-management/state.json','work/gastronomy-management/discovery',
 'work/pilot-quality/latest.json','work/pilot-research/latest.json','work/pilot-research',
 'work/first-selection/activation.json','work/first-selection/refreshed-sources.json',
 'work/focused-research/latest.json','work/source-access-pilot/latest.json',
];
export async function visitorSourceVersion(){
 return (await Promise.all(files.map(async file=>{
  try{const s=await fs.stat(path.join(process.cwd(),file));return `${s.ino}:${s.size}:${s.mtimeMs}:${s.ctimeMs}`;}
  catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return 'missing';throw error;}
 }))).join('|');
}
