const fs=require('fs');const issues=[];
if(process.env.APP_ENVIRONMENT!=='staging')issues.push('APP_ENVIRONMENT must be staging');
if((process.env.ADMIN_PASSWORD||'').length<24)issues.push('A new staging-only ADMIN_PASSWORD of at least 24 characters is required');
if(process.env.GASTRONOMY_LOCAL_PREVIEW!=='0')issues.push('Loopback-only development preview must remain disabled in cloud staging');
if(!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)issues.push('A staging-only public anon/publishable key is required');
const ref=process.env.STAGING_SUPABASE_PROJECT_REF;
try{const u=new URL(process.env.NEXT_PUBLIC_SUPABASE_URL||'');if(!ref||u.hostname!==ref+'.supabase.co'||['jerkkxwgddujigsbeqwo','aknhkpevrlpsrfxzqtop'].includes(ref))issues.push('Use a distinct staging Supabase project, not a production project');}catch{issues.push('Staging Supabase URL missing');}
for(const k of ['GOOGLE_PLACES_API_KEY','GOOGLE_MAPS_API_KEY','TAVILY_API_KEY','OPENAI_API_KEY','GEMINI_API_KEY','SUPABASE_SERVICE_ROLE_KEY'])if(process.env[k])issues.push(k+' must be absent from default read-only staging');
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}else console.log('PASS isolated staging configuration (no credential values printed)');
