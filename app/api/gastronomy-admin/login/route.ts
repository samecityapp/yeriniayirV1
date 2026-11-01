import {cookies} from 'next/headers';
import {z} from 'zod';
import {createHash} from 'node:crypto';
import {cloudClient} from '@/lib/cloud/client';
import {ADMIN_COOKIE,PRIVATE_HEADERS,sameOrigin} from '@/lib/cloud/auth';
const PENDING='ya_cloud_pending';
const input=z.discriminatedUnion('action',[
 z.object({action:z.literal('login'),email:z.string().email().max(254),password:z.string().min(8).max(256)}).strict(),
 z.object({action:z.literal('verify'),code:z.string().regex(/^\d{6}$/)}).strict(),
]);
// Secondary bounded process guard; Supabase Auth's distributed rate limits still apply.
const attempts=new Map<string,{count:number;until:number}>();
function limited(key:string){const now=Date.now();for(const[k,v]of Array.from(attempts))if(v.until<now)attempts.delete(k);
 if(attempts.size>1000)return true;const a=attempts.get(key)||{count:0,until:now+600_000};attempts.set(key,a);return ++a.count>10;}
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Forbidden'},{status:403,headers:PRIVATE_HEADERS});
 try{
  const raw=await request.text();if(raw.length>2000)throw Error('Input too large');const p=input.safeParse(JSON.parse(raw));
  if(!p.success)return Response.json({error:'Giriş bilgilerini kontrol edin.'},{status:400,headers:PRIVATE_HEADERS});
  const jar=await cookies(),client=cloudClient();
  const secure=new URL(request.url).protocol==='https:';
  if(!secure&&!['127.0.0.1','localhost'].includes(new URL(request.url).hostname))throw Error('HTTPS required');
  const options={httpOnly:true,secure,sameSite:'strict' as const,path:'/',maxAge:300};
  if(p.data.action==='login'){
   const key=createHash('sha256').update(p.data.email.toLowerCase()).digest('hex');
   if(limited('global')||limited(key))return Response.json({error:'Daha sonra tekrar deneyin.'},{status:429,headers:PRIVATE_HEADERS});
   const login=await client.auth.signInWithPassword({email:p.data.email,password:p.data.password});
   if(login.error||!login.data.session||!login.data.user.email_confirmed_at||login.data.user.is_anonymous)return Response.json({error:'Giriş yapılamadı.'},{status:401,headers:PRIVATE_HEADERS});
   const membership=await client.rpc('ya_has_membership');
   if(membership.error||membership.data!==true)return Response.json({error:'Giriş yapılamadı.'},{status:401,headers:PRIVATE_HEADERS});
   jar.set(PENDING,login.data.session.access_token,options);jar.delete(ADMIN_COOKIE);
   const factors=await client.auth.mfa.listFactors();
   if(factors.error)throw Error('MFA unavailable');
   if(factors.data.totp.some(f=>f.status==='verified'))return Response.json({step:'verify'},{headers:PRIVATE_HEADERS});
   // Only an owner-provisioned member with a verified password may enroll.
   for(const f of factors.data.all.filter(f=>f.status==='unverified'))await client.auth.mfa.unenroll({factorId:f.id});
   const enroll=await client.auth.mfa.enroll({factorType:'totp',friendlyName:'Yerini Ayır Yönetimi'});
   if(enroll.error)throw Error('MFA enrollment failed');
   return Response.json({step:'enroll',secret:enroll.data.totp.secret,
    qrCodeDataUri:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(enroll.data.totp.qr_code)},{headers:PRIVATE_HEADERS});
  }
  const token=jar.get(PENDING)?.value;
  if(!token)return Response.json({error:'Oturum süresi doldu.'},{status:401,headers:PRIVATE_HEADERS});
  const user=await client.auth.getUser(token);if(user.error||!user.data.user)throw Error('Invalid pending session');
  if(limited('mfa:'+user.data.user.id))return Response.json({error:'Daha sonra tekrar deneyin.'},{status:429,headers:PRIVATE_HEADERS});
  const scoped=cloudClient(token),member=await scoped.rpc('ya_has_membership');if(member.error||member.data!==true)throw Error('No membership');
  const factors=await scoped.auth.mfa.listFactors();if(factors.error)throw Error('MFA unavailable');
  const factor=factors.data.totp.find(f=>f.status==='verified')||factors.data.all.find(f=>f.factor_type==='totp');
  if(!factor)throw Error('No factor');
  const challenge=await scoped.auth.mfa.challenge({factorId:factor.id});if(challenge.error)throw Error('No challenge');
  const verification=await scoped.auth.mfa.verify({factorId:factor.id,challengeId:challenge.data.id,code:p.data.code});
  if(verification.error)return Response.json({error:'Kod doğrulanamadı.'},{status:401,headers:PRIVATE_HEADERS});
  const verified=cloudClient(verification.data.access_token),allowed=await verified.rpc('ya_is_admin');
  if(allowed.error||allowed.data!==true)throw Error('Not authorized');
  jar.set(ADMIN_COOKIE,verification.data.access_token,{...options,maxAge:Math.min(verification.data.expires_in,3600)});jar.delete(PENDING);
  return Response.json({ok:true},{headers:PRIVATE_HEADERS});
 }catch{return Response.json({error:'Güvenli giriş şu anda kullanılamıyor.'},{status:503,headers:PRIVATE_HEADERS});}
}
