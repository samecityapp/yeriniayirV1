import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { loadCatalog } from './catalog';
import { applyManagementAction,initialState,managementView,ManagementError } from './state';
import type { ManagementState,ManagementAction,ManagementView } from './types';
const directory=path.join(process.cwd(),'work','gastronomy-management');
export async function readManagementState():Promise<ManagementState>{try{return JSON.parse(await fs.readFile(path.join(directory,'state.json'),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return initialState();throw e;}}
export async function readManagementView():Promise<ManagementView>{const [state,catalog]=await Promise.all([readManagementState(),loadCatalog()]);return managementView(state,catalog);}
export async function changeManagement(action:ManagementAction,actor:'admin'|'engine'='admin',warnings:string[]=[]):Promise<ManagementView>{
 if(process.env.VERCEL||process.env.NODE_ENV==='production')throw new ManagementError('Yönetim değişiklikleri yalnızca yerel geliştirmede etkin.',403);
 await fs.mkdir(directory,{recursive:true});let lock;
 try{lock=await fs.open(path.join(directory,'write.lock'),'wx');}catch(e){if((e as NodeJS.ErrnoException).code==='EEXIST')throw new ManagementError('Başka bir karar kaydediliyor; yenileyip tekrar deneyin.',409);throw e;}
 try{
  const [state,catalog]=await Promise.all([readManagementState(),loadCatalog()]);
  const next=applyManagementAction(state,catalog,action,actor,new Date().toISOString(),warnings);
  const temp=path.join(directory,`state-${process.pid}.tmp`);await fs.writeFile(temp,JSON.stringify(next,null,2));await fs.rename(temp,path.join(directory,'state.json'));return managementView(next,catalog);
 }finally{await lock.close();await fs.unlink(path.join(directory,'write.lock'));}
}
