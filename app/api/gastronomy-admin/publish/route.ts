import {revalidateTag} from 'next/cache';
import {cloudAdmin,PRIVATE_HEADERS,sameOrigin} from '@/lib/cloud/auth';
import {publicationChange} from '@/lib/cloud/contracts';
import {invalidateCloudPublication} from '@/lib/cloud/publication';
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Forbidden'},{status:403,headers:PRIVATE_HEADERS});
 try{const admin=await cloudAdmin();if(!admin)return Response.json({error:'Unauthorized'},{status:401,headers:PRIVATE_HEADERS});
  const raw=await request.text();if(raw.length>12_000)return Response.json({error:'Too large'},{status:413,headers:PRIVATE_HEADERS});
  const parsed=publicationChange.safeParse(JSON.parse(raw));if(!parsed.success)return Response.json({error:'Invalid change'},{status:400,headers:PRIVATE_HEADERS});
  const p=parsed.data;
  const result=await admin.client.rpc('ya_publish_order',{p_scope:p.scope,p_expected:p.expectedRevision,p_order:p.order,p_reason:p.reason});
  if(result.error){const status=result.error.code==='PT409'?409:result.error.code==='42501'?403:result.error.code==='P0001'?400:503;
   return Response.json({error:'Değişiklik doğrulanamadı; güncel sürümü yeniden yükleyin.'},{status,headers:PRIVATE_HEADERS});}
  invalidateCloudPublication();revalidateTag('ya-publication');return Response.json({revision:result.data},{headers:PRIVATE_HEADERS});
 }catch{return Response.json({error:'İşlem tamamlanamadı.'},{status:503,headers:PRIVATE_HEADERS});}
}
