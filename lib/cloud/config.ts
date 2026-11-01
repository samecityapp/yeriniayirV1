if(typeof window!=='undefined')throw new Error('Server module');
export function cloudConfig(){
 const url=process.env.GASTRONOMY_SUPABASE_URL||'',key=process.env.GASTRONOMY_SUPABASE_ANON_KEY||'';
 const ref=process.env.GASTRONOMY_SUPABASE_REF||'';
 const u=new URL(url);
 if(!key||!ref||u.protocol!=='https:'||u.hostname!==ref+'.supabase.co'||u.pathname!=='/'||u.username||u.password||u.search||u.hash)throw new Error('Cloud configuration unavailable');
 // Production activation requires a separate reviewed release, never inherited legacy credentials.
 if(ref==='jerkkxwgddujigsbeqwo')throw new Error('Production cloud activation is not authorized');
 if(process.env.GASTRONOMY_CLOUD_ENV!=='staging')throw new Error('Isolated cloud environment required');
 return {url:u.origin,key,ref};
}
