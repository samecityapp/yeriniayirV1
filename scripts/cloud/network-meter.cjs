// Bootstrap observer: no headers, bodies, URLs containing credentials or token values are logged.
const fs=require('node:fs');const original=globalThis.fetch;
const allowed='vhptlecaixpawtxnhsde.supabase.co';
globalThis.fetch=async function(input,options){const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url);
 if(!['127.0.0.1','localhost','[::1]',allowed].includes(url.hostname))throw Error('Isolated staging network boundary');
 const start=performance.now();const r=await original.call(this,input,options);
 if(url.hostname===allowed){const copy=r.clone(),bytes=(await copy.arrayBuffer()).byteLength;fs.appendFileSync('work/cloud-admin/staging-network.jsonl',JSON.stringify({at:new Date().toISOString(),kind:url.pathname.startsWith('/rest/v1/')?'supabase-data':url.pathname.startsWith('/auth/v1/')?'supabase-auth':'other',path:url.pathname,status:r.status,responseBodyBytes:bytes,contentLength:r.headers.get('content-length'),encoding:r.headers.get('content-encoding'),elapsedMs:Math.round(performance.now()-start)})+'\n',{mode:0o600});}
 return r;};
