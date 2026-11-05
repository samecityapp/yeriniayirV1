import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import type { QualityReport } from './types';
const directory=path.join(process.cwd(),'work','pilot-quality');
export async function readQualityReport():Promise<QualityReport|null> {
  try {const report=JSON.parse(await fs.readFile(path.join(directory,'latest.json'),'utf8'));
    if(report.schemaVersion!==1 || !Array.isArray(report.dossiers))throw new Error('Invalid quality report');return report;
  } catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return null;throw error;}
}
export async function saveQualityReport(report:QualityReport):Promise<void> {
  if(process.env.VERCEL)throw new Error('Local research only');
  await fs.mkdir(directory,{recursive:true});
  const temporary=path.join(directory,`latest-${process.pid}.tmp`);
  await fs.writeFile(temporary,JSON.stringify(report,null,2));await fs.rename(temporary,path.join(directory,'latest.json'));
}
