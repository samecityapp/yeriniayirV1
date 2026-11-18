import {readCloudPublication} from '@/lib/cloud/publication';
export async function GET(request:Request){
 try{const scope=new URL(request.url).searchParams.get('scope')||'moda/kahve';const data=await readCloudPublication(scope);
  // Server/Data Cache handles query reduction; browser/CDN must not extend evidence expiry.
  return Response.json(data,{status:data?200:404,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 }catch{return Response.json({error:'Rehber şu anda kullanılamıyor.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
