import {cloudAdmin,PRIVATE_HEADERS} from '@/lib/cloud/auth';
import {cloudConfig} from '@/lib/cloud/config';
export async function GET(){try{
 const admin=await cloudAdmin();if(!admin)return Response.json({error:'Unauthorized'},{status:401,headers:PRIVATE_HEADERS});
 const result=await admin.client.rpc('ya_admin_workspace',{p_scope:'moda/kahve'});
 if(result.error)throw Error('Workspace unavailable');
 return Response.json({environment:'staging',project:cloudConfig().ref,workspace:result.data},{headers:PRIVATE_HEADERS});
 }catch{return Response.json({error:'Yönetim verisi alınamadı.'},{status:503,headers:PRIVATE_HEADERS});}}
