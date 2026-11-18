import {cloudAdmin,PRIVATE_HEADERS} from '@/lib/cloud/auth';
export async function GET(){try{const admin=await cloudAdmin();if(!admin)return Response.json({error:'Unauthorized'},{status:401,headers:PRIVATE_HEADERS});
 const result=await admin.client.rpc('ya_admin_archive',{p_scope:'moda/kahve'});if(result.error)throw Error('Archive unavailable');
 return Response.json(result.data,{headers:{...PRIVATE_HEADERS,'Content-Disposition':'attachment; filename="yeriniayir-arastirma.json"'}});
 }catch{return Response.json({error:'Araştırma arşivi alınamadı.'},{status:503,headers:PRIVATE_HEADERS});}}
