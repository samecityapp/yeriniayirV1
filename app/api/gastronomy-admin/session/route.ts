import {cloudAdmin,PRIVATE_HEADERS} from '@/lib/cloud/auth';
export async function GET(){try{const admin=await cloudAdmin();return Response.json({authenticated:!!admin},{status:admin?200:401,headers:PRIVATE_HEADERS});}catch{return Response.json({authenticated:false},{status:503,headers:PRIVATE_HEADERS});}}
