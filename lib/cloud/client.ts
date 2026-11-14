import {createClient} from '@supabase/supabase-js';
import {cloudConfig} from './config';
export function cloudClient(token?:string){const c=cloudConfig();return createClient(c.url,c.key,{
 auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
 global:{...(token?{headers:{Authorization:'Bearer '+token}}:{}),fetch:async(url,init)=>{
  const controller=new AbortController(),signal=init?.signal;
  const abort=()=>controller.abort();if(signal?.aborted)abort();else signal?.addEventListener('abort',abort,{once:true});
  const timer=setTimeout(abort,15_000);
  try{return await fetch(url,{...init,signal:controller.signal,cache:'no-store'});}
  finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
 }}});}
