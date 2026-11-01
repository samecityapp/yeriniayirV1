import {promises as fs} from 'node:fs';
import path from 'node:path';
import type {QualityReport} from '../quality/types';
import type {ResearchRun} from '../research/types';
import type {FocusSource} from '../research/focused/types';
import {TARGETS,normalized,digest,FOCUS_SOURCES,MAP_ENDPOINTS} from '../research/focused/sources';
import type {ManagedCandidate,Evidence} from './types';
async function optional(file:string){try{return JSON.parse(await fs.readFile(path.join(process.cwd(),file),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e;}}
export async function applyResearchPortfolio(base:ManagedCandidate[],quality:QualityReport|null,discovery:ResearchRun|null):Promise<ManagedCandidate[]>{
 // Activation is an explicit local product decision; tests/other categories keep their existing strict gate.
 const config=await optional('work/first-selection/activation.json');if(config?.policy!=='portfolio-v2'||!quality||!discovery)return base;
 const [focus,access,refresh]=await Promise.all([optional('work/focused-research/latest.json'),optional('work/source-access-pilot/latest.json'),optional('work/first-selection/refreshed-sources.json')]);
 const live=new Map<string,FocusSource>();for(const s of [...(focus?.sources||[]),...(access?.sources||[]),...(refresh?.sources||[])])if(s.status==='ok'&&s.fingerprint===digest(s.facts)&&(FOCUS_SOURCES.some(p=>p.id===s.id&&p.url===s.url&&p.family===s.family&&p.kind===s.kind)||(s.id==='focused-map'&&s.kind==='map'&&s.family==='openstreetmap.org'&&MAP_ENDPOINTS.includes(s.url))))live.set(s.id,s);
 return base.map(original=>{
  const d=quality.dossiers.find(d=>d.id===original.id);if(!d)return original;
  const c={...original,evidence:[] as Evidence[],conflicts:[...original.conflicts],advisories:[...(original.advisories||[])]};
  const push=(e:Evidence)=>{if(!c.evidence.some(x=>x.id===e.id))c.evidence.push(e);};
  for(const claim of d.claims)for(const sid of claim.sourceIds){const s=quality.sources.find(s=>s.id===sid);if(!s||s.access!=='read'||s.rights==='link-only')continue;
   const isReview=s.eligibleIndependent&&s.kind==='editorial'&&['drink','specialty'].includes(claim.field)&&claim.basis!=='inference'&&claim.scope!=='unresolved';
   const isAddress=false; // Address claims enter only through structured facts or street/base-door agreement below.
   const isMenu=s.kind==='operator'&&/menu/i.test(s.id)&&claim.field==='drink';
   if(!isReview&&!isAddress&&!isMenu)continue;
   push({id:claim.id+':portfolio:'+sid,url:s.url,family:s.family,kind:s.kind==='operator'?'operator':'independent',branchId:c.id,productCategory:'coffee',productName:isReview||isMenu?claim.text:null,publishedAt:s.publishedAt,experienceAt:s.experienceDate,checkedAt:s.accessedAt,usable:true,claimScope:claim.scope==='unresolved'?'brand':claim.scope,role:isAddress?'address':isMenu?'menu':'product-review'});
  }
  const target=TARGETS.find(t=>t.candidateId===c.id),addresses:{value:string;operator:boolean;family:string}[]=[];
  if(target)for(const s of Array.from(live.values()))for(const f of s.facts.filter(f=>f.target===target.id)){
   const role=f.field==='address'?'address':s.kind==='operator'&&f.field==='drink'?'menu':s.kind==='editorial'&&f.field==='drink'?'product-review':null;if(!role)continue;
   push({id:'live:'+s.id+':'+f.field+':'+f.value,url:s.url,family:s.family,kind:s.kind==='operator'?'operator':s.kind==='map'?'map':'independent',branchId:c.id,productCategory:'coffee',productName:role==='address'?null:f.value,publishedAt:s.publishedAt,experienceAt:null,checkedAt:s.accessedAt,usable:true,claimScope:f.scope,role});
   if(role==='address')addresses.push({value:f.value,operator:s.kind==='operator',family:s.family});
  }
  if(original.address){push({id:'map-address:'+c.id,url:'https://www.openstreetmap.org/'+c.id.replace('osm-','').replace('-', '/'),family:'openstreetmap.org',kind:'map',branchId:c.id,productCategory:'coffee',productName:null,publishedAt:null,experienceAt:null,checkedAt:discovery.mapSnapshotAt||discovery.completedAt,usable:true,claimScope:'branch',role:'address'});}
  // Resolve a unit suffix only when the operator's statement agrees with the map street/base door.
  const mapStreet=original.address?.replace(/\s+\d.*$/,'').replace(/Sokağı|Sokak|Caddesi|Cadde/gi,'').trim(),baseDoor=original.address?.match(/\d+/)?.[0];
  if(mapStreet&&baseDoor){const statement=d.claims.find(x=>x.field==='identity'&&x.sourceIds.some(id=>quality.sources.find(s=>s.id===id)?.kind==='operator')&&normalized(x.text).includes(normalized(mapStreet)+baseDoor));if(statement){const door=statement.text.match(/\d+(?:\/[A-Za-z])?/)?.[0];if(door){const sid=statement.sourceIds.find(id=>quality.sources.find(s=>s.id===id)?.kind==='operator')!,source=quality.sources.find(s=>s.id===sid)!;push({id:'operator-address:'+sid,url:source.url,family:source.family,kind:'operator',branchId:c.id,productCategory:'coffee',productName:null,publishedAt:source.publishedAt,experienceAt:null,checkedAt:source.accessedAt,usable:true,claimScope:'branch',role:'address'});addresses.push({value:mapStreet+' '+door,operator:true,family:source.family});c.address=mapStreet+' '+door;c.conflicts=c.conflicts.filter(v=>!/^Haritada kapı/.test(v));}}}
  const preferred=addresses.find(a=>a.operator)||addresses[0];if(preferred)c.address=preferred.value;
  const addressKey=(v:string)=>normalized(v.replace(/\s+\d.*$/,'').replace(/Sokağı|Sokak|Caddesi|Cadde/gi,''))+'|'+(v.match(/\d+/)?.[0]||'');if(new Set(addresses.map(a=>addressKey(a.value))).size>1)c.conflicts.push('Yapılandırılmış kaynakların fiziksel sokak/kapı bilgileri uyuşmuyor.');
  const addrFamilies=new Set(c.evidence.filter(e=>e.role==='address'&&e.claimScope==='branch').map(e=>e.family));
  c.identityVerified=Boolean(c.address&&c.coordinates&&addrFamilies.size>=2);
  // Explicitly discarded broad page tags are not competing physical address evidence.
  c.conflicts=c.conflicts.filter(v=>!(/üst etiket/i.test(v)&&/sayılmadı/i.test(v)));
  if(c.id===target?.candidateId&&preferred?.operator&&c.address?.startsWith('Fırıldak'))c.advisories.push('Resmî Fırıldak 19/B adresi kullanıldı; farklı sokak yazan üçüncü taraf sonuçları bu şubeye aktarılmadı.');
  c.researchProfile={policy:'portfolio-v2',mapObservedAt:discovery.mapSnapshotAt||discovery.completedAt,areaMatch:!(/Çarşı|şube ayrımı|kimliği belirsiz/.test(d.name))};
  c.presentation={claims:d.claims,sources:quality.sources.filter(s=>d.claims.some(x=>x.sourceIds.includes(s.id))).map(s=>({id:s.id,url:s.url,publisher:s.publisher,publishedAt:s.publishedAt,experienceAt:s.experienceDate,checkedAt:s.accessedAt})),gaps:d.gaps};c.reportId='portfolio:'+quality.discoveryRunId;return c;
 });
}
