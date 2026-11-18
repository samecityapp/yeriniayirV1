// Server/CLI only. No paid APIs, database, model calls, or legacy pilot candidates.
import { createHash } from 'node:crypto';
import type { ResearchCandidate, ResearchEvidence, ResearchRun, ResearchSourceResult } from './types';

export const BBOX: [number, number, number, number] = [40.978, 29.018, 40.992, 29.037];
export const SOURCES = {
  osm: 'https://overpass-api.de/api/interpreter',
  barista: 'https://www.baristamagazine.com/5-cool-cafes-to-check-out-in-kadikoy-istanbul/',
  ect: 'https://europeancoffeetrip.com/istanbul/',
  story: 'https://storyroasters.com/pages/kafelerimiz',
};
const USER_AGENT = 'YeriniAyirResearch/0.1 (+https://yeriniayir.com; local admin pilot)';
const MAX_BYTES = 3_000_000;
export const normalize = (value: string) => value.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, ' ').trim();
export const brandKey = (value: string) => normalize(value).replace(/\b(coffee|coffe|coffees|roasters|roastery|food|cafe|caffe|moda|kadikoy|and)\b/g, '').replace(/\s+/g, ' ').trim();
const clean = (v: string) => v.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const idFor = (value: string) => createHash('sha256').update(value).digest('hex').slice(0, 18);
export function publicWebsite(value?: string): string | null {
  if (!value) return null;
  try { const u = new URL(value.startsWith('www.') ? `https://${value}` : value); return ['https:', 'http:'].includes(u.protocol) && !u.username && !u.password ? u.href : null; } catch { return null; }
}
export function distance(a: {lat:number;lng:number}, b: {lat:number;lng:number}) {
  const rad = Math.PI / 180;
  const dlat = (a.lat-b.lat)*rad, dlon = (a.lng-b.lng)*rad;
  const h = Math.sin(dlat/2)**2 + Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dlon/2)**2;
  return 6371000 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}
// Fixed source URLs only. Redirects are rejected; discovered websites are links, never fetched.
export async function fetchText(url: string, fetcher: typeof fetch = fetch): Promise<string> {
  const allowed = Object.values(SOURCES).some(source => url === source || url === new URL('/robots.txt', source).href);
  if (!allowed && !url.startsWith(`${SOURCES.osm}?data=`)) throw new Error('Source URL not allowed');
  const res = await fetcher(url, { redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(35000), headers: { 'User-Agent': USER_AGENT, Accept: 'application/json,text/html,text/plain' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (Number(res.headers.get('content-length')) > MAX_BYTES) throw new Error('Source too large');
  const reader = res.body?.getReader();
  if (!reader) throw new Error('Empty source');
  const chunks: Uint8Array[] = []; let bytes = 0;
  try {
    while (true) { const { value, done } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > MAX_BYTES) throw new Error('Source too large'); chunks.push(value); }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks).toString('utf8');
}
// Conservative robots evaluation: honor the most specific matching user-agent group.
export function robotsAllowed(text: string, pathname: string): boolean {
  const groups: { agents: string[]; rules: {allow:boolean; path:string}[] }[] = [];
  let group = { agents: [] as string[], rules: [] as {allow:boolean; path:string}[] };
  for (const line of text.split(/\r?\n/)) {
    const match = line.split('#')[0].trim().match(/^([^:]+):\s*(.*)$/); if (!match) continue;
    const key = match[1].toLowerCase(), value = match[2].trim();
    if (key === 'user-agent') { if (group.rules.length) { groups.push(group); group = { agents: [], rules: [] }; } group.agents.push(value.toLowerCase()); }
    else if (['allow','disallow'].includes(key) && value && group.agents.length) group.rules.push({allow:key==='allow',path:value});
  }
  groups.push(group);
  const exact = groups.filter(g=>g.agents.some(a=>a !== '*' && USER_AGENT.toLowerCase().includes(a)));
  const selected = exact.length ? exact : groups.filter(g=>g.agents.includes('*'));
  const rules = selected.flatMap(g=>g.rules).filter(r=>{
    const pattern = r.path.split('*').map(p=>p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*').replace(/\\\$$/, '$');
    return new RegExp('^'+pattern).test(pathname);
  }).sort((a,b)=>b.path.length-a.path.length || Number(b.allow)-Number(a.allow));
  return rules.length === 0 || rules[0].allow;
}
export async function fetchPage(url: string, fetcher: typeof fetch): Promise<string> {
  const robots = await fetchText(new URL('/robots.txt', url).href, fetcher);
  if (!robots.toLowerCase().includes('user-agent:')) throw new Error('Robots policy unavailable');
  if (!robotsAllowed(robots, new URL(url).pathname)) throw new Error('Robots access denied');
  return fetchText(url, fetcher);
}
interface OsmElement { type:string; id:number; lat?:number; lon?:number; center?:{lat:number;lon:number}; timestamp?:string; tags?:Record<string,string> }
export function parseOsm(data: { elements?:OsmElement[]; remark?:string }, now: string): { candidates:ResearchCandidate[]; ignoredUnnamed:number } {
  if (!Array.isArray(data.elements) || data.remark) throw new Error('Incomplete Overpass response');
  const candidates: ResearchCandidate[] = []; let ignoredUnnamed=0;
  for (const el of data.elements) {
    const t=el.tags || {}; const name=t.name || t['disused:name'] || t['name:tr'];
    if (!name) { ignoredUnnamed++; continue; }
    const lat=el.lat ?? el.center?.lat, lng=el.lon ?? el.center?.lon;
    if (lat === undefined || lng === undefined || !Number.isFinite(lat) || !Number.isFinite(lng) || lat<BBOX[0] || lat>BBOX[2] || lng<BBOX[1] || lng>BBOX[3]) continue;
    const osmId=`${el.type}/${el.id}`;
    const street=t['addr:street']||null, houseNumber=t['addr:housenumber']||null;
    const closed=['yes','true'].includes(t.disused) || ['yes','true'].includes(t.abandoned) || Boolean(t['disused:amenity'] || t['abandoned:amenity'] || t['demolished:amenity']);
    const checked=t['check_date:opening_hours']||t.check_date||t['survey:date']||null;
    const age=checked ? Date.parse(now)-Date.parse(checked) : NaN;
    const evidence: ResearchEvidence={url:`https://www.openstreetmap.org/${osmId}`,publisher:'OpenStreetMap contributors',kind:'open-map',scope:'branch',retrievedAt:now,publishedAt:null,updatedAt:el.timestamp||null,author:null,
      facts:[`Harita adı: ${name}`,`Harita koordinatı: ${lat}, ${lng}`, ...(street?[`Harita adresi: ${street} ${houseNumber||''}`]:[]),...(checked?[`Harita kontrol etiketi: ${checked}`]:[]),...(closed?['Haritada faaliyet dışı etiketi var']:[])],usage:'© OpenStreetMap contributors — ODbL 1.0; https://www.openstreetmap.org/copyright'};
    candidates.push({id:`osm-${el.type}-${el.id}`,name,aliases:[name],osmIds:[osmId],coordinates:{lat,lng},street,houseNumber,address:street?[street,houseNumber].filter(Boolean).join(' '):null,website:publicWebsite(t.website||t['contact:website']),
      category:/coffee|kahve|roast|espresso|coffee_shop/i.test(`${name} ${t.cuisine||''} ${t.shop||''}`)?'coffee-signal':'cafe-needs-review',branchStatus:'map-location',operation:closed?'closure-signal':age>=0 && age<=90*86400000?'recent-map-observation':'unknown',mapCheckedAt:checked,evidence:[evidence],missing:[],conflicts:[]});
  }
  return { candidates, ignoredUnnamed };
}
export function deduplicate(candidates: ResearchCandidate[]): { candidates:ResearchCandidate[]; merged:number } {
  const result:ResearchCandidate[]=[]; let merged=0;
  // Sort by source identity for deterministic IDs across repeated runs.
  for (const candidate of [...candidates].sort((a,b)=>a.id.localeCompare(b.id))) {
    const existing=result.find(c=>{
      if (c.osmIds.some(id=>candidate.osmIds.includes(id))) return true;
      if (!c.coordinates || !candidate.coordinates || !brandKey(c.name) || brandKey(c.name)!==brandKey(candidate.name)) return false;
      if (c.houseNumber && candidate.houseNumber && normalize(c.houseNumber)!==normalize(candidate.houseNumber)) return false;
      if (c.street && candidate.street && normalize(c.street)!==normalize(candidate.street)) return false;
      return distance(c.coordinates,candidate.coordinates)<=25;
    });
    if (!existing) { result.push(candidate); continue; }
    merged++; existing.osmIds=Array.from(new Set([...existing.osmIds,...candidate.osmIds]));
    existing.aliases=Array.from(new Set([...existing.aliases,...candidate.aliases]));existing.evidence.push(...candidate.evidence.filter(e=>!existing.evidence.some(previous=>previous.url===e.url&&previous.scope===e.scope&&JSON.stringify(previous.facts)===JSON.stringify(e.facts))));
    if (!existing.address && candidate.address) { existing.address=candidate.address;existing.street=candidate.street;existing.houseNumber=candidate.houseNumber; }
    if (existing.address && candidate.address && normalize(existing.address)!==normalize(candidate.address)) existing.conflicts.push('Yakın harita kayıtlarında adres farkı var; şube incelenmeli.');
    if ((existing.operation==='closure-signal') !== (candidate.operation==='closure-signal')) { existing.operation='conflict';existing.conflicts.push('Aynı konumdaki harita kayıtları faaliyet durumunda çelişiyor.'); }
    if (candidate.category==='coffee-signal') existing.category='coffee-signal';
    if (existing.operation==='unknown' && candidate.operation==='recent-map-observation') existing.operation='recent-map-observation';
    if (!existing.mapCheckedAt) existing.mapCheckedAt=candidate.mapCheckedAt;
    if (!existing.website) existing.website=candidate.website;
  }
  return {candidates:result,merged};
}
export function editorialNames(html:string): {names:string[];publishedAt:string|null} {
  // Bound to article body; do not parse related-article/sidebar headings.
  const end=html.search(/ABOUT THE AUTHOR/i);
  const body=end>=0?html.slice(0,end):html;
  const names=Array.from(body.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)).map(m=>clean(m[1])).filter(n=>n.length>1&&n.length<100);
  const date=html.match(/"datePublished"\s*:\s*"([^"]+)"/)?.[1]||null;
  if (!names.length) throw new Error('Editorial parser found no business headings');
  return {names:Array.from(new Set(names)),publishedAt:date};
}
export function attachEditorial(candidates:ResearchCandidate[], html:string, now:string): number {
  const {names,publishedAt}=editorialNames(html);
  for (const name of names) {
    const matches=candidates.filter(c=>brandKey(c.name)===brandKey(name));
    const evidence:ResearchEvidence={url:SOURCES.barista,publisher:'Barista Magazine',kind:'editorial',scope:'brand',retrievedAt:now,publishedAt,updatedAt:null,author:clean(html.match(/BY\s+(BENJAMIN\s+SAND)/i)?.[1]||'')||null,facts:[`Rehberde işletme adı geçiyor: ${name}. Bu kayıt belirli şubeyi veya bugünkü faaliyeti doğrulamaz.`],usage:'Yalnızca işletme adı, kaynak künyesi ve bağlantı saklanır; yazı, değerlendirme ve fotoğraf kopyalanmaz.'};
    if (matches.length) matches.forEach(c=>c.evidence.push({...evidence}));
    else candidates.push({id:`editorial-${idFor(brandKey(name))}`,name,aliases:[name],osmIds:[],coordinates:null,address:null,street:null,houseNumber:null,website:null,category:'coffee-signal',branchStatus:'unresolved',operation:'unknown',mapCheckedAt:null,evidence:[evidence],missing:[],conflicts:[]});
  }
  return names.length;
}
export function attachOperator(candidates:ResearchCandidate[], html:string, now:string): number {
  const cards=Array.from(html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi)); let count=0;
  for (const card of cards) {
    const name=clean(card[1].match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1]||'');
    const paragraphs=Array.from(card[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)).map(m=>clean(m[1]));
    const address=paragraphs.find(p=>/Caferağa|Caferaga/i.test(p)&&/No\s*:/i.test(p));
    if (!name || !address || !/moda/i.test(name)) continue;
    const house=address.match(/No\s*:\s*([\w/-]+)/i)?.[1];
    // Require shared street token AND exact house number. Never select a branch by brand alone.
    const matches=candidates.filter(c=>brandKey(c.name)===brandKey(name)&&house&&normalize(c.houseNumber||'')===normalize(house)&&c.street&&normalize(address).includes(normalize(c.street).split(' ')[0]));
    const evidence:ResearchEvidence={url:SOURCES.story,publisher:'Story Coffee Roasters (işletmenin kendi sitesi)',kind:'first-party',scope:'branch',retrievedAt:now,publishedAt:null,updatedAt:null,author:null,facts:[`İşletme şube listesi: ${name}`,`İşletmenin bildirdiği adres: ${address}`],usage:'Yalnızca şube adı, adres ve kaynak bağlantısı; saatler ve Google verisi kopyalanmaz. İşletme beyanıdır, bağımsız saha teyidi değildir.'};
    if (matches.length===1) {
      const c=matches[0];c.evidence.push(evidence);c.branchStatus='address-corroborated';
      if (c.operation==='closure-signal'||c.operation==='conflict') {c.operation='conflict';c.conflicts.push('İşletme listesi ile harita kapanış sinyali çelişiyor.');} else c.operation='operator-listed';
    } else candidates.push({id:`operator-${idFor(name+address)}`,name,aliases:[name],osmIds:[],coordinates:null,address,street:null,houseNumber:house||null,website:SOURCES.story,category:'coffee-signal',branchStatus:'unresolved',operation:'operator-listed',mapCheckedAt:null,evidence:[evidence],missing:[],conflicts:matches.length>1?['Birden çok harita şubesiyle adres eşleşti; otomatik birleştirilmedi.']:[]});
    count++;
  }
  if (!count) throw new Error('Operator parser found no Moda branch address');
  return count;
}
export async function runResearch(fetcher:typeof fetch=fetch, clock:()=>Date=()=>new Date()): Promise<ResearchRun> {
  const startedAt=clock().toISOString(); const sources:ResearchSourceResult[]=[];
  let candidates:ResearchCandidate[]=[]; let ignoredUnnamed=0,duplicatesMerged=0,mapSnapshotAt:string|null=null;
  const attempt=async(id:string,url:string,task:()=>Promise<number>)=>{
    const retrievedAt=clock().toISOString();
    try { const count=await task();sources.push({id,url,status:'ok',count,retrievedAt,message:'Kaynak okundu; sadece izin verilen olgusal alanlar işlendi.'}); }
    catch(e){ const message=e instanceof Error?e.message:'Source unavailable';sources.push({id,url,status:/403|429|Robots|access denied/.test(message)?'blocked':'failed',count:0,retrievedAt,message}); }
  };
  // One bounded map query per run. No per-business map requests, no paid fallback.
  await attempt('osm',SOURCES.osm,async()=>{
    const query=`[out:json][timeout:25];(nwr["amenity"="cafe"](${BBOX.join(',')});nwr["shop"="coffee"](${BBOX.join(',')});nwr["disused:amenity"="cafe"](${BBOX.join(',')});nwr["abandoned:amenity"="cafe"](${BBOX.join(',')}););out center meta;`;
    const data=JSON.parse(await fetchText(`${SOURCES.osm}?data=${encodeURIComponent(query)}`,fetcher));
    const parsed=parseOsm(data,startedAt);const dedup=deduplicate(parsed.candidates);candidates=dedup.candidates;ignoredUnnamed=parsed.ignoredUnnamed;duplicatesMerged=dedup.merged;mapSnapshotAt=data.osm3s?.timestamp_osm_base||null;return candidates.length;
  });
  await attempt('barista',SOURCES.barista,async()=>attachEditorial(candidates,await fetchPage(SOURCES.barista,fetcher),clock().toISOString()));
  await attempt('story',SOURCES.story,async()=>attachOperator(candidates,await fetchPage(SOURCES.story,fetcher),clock().toISOString()));
  await attempt('ect',SOURCES.ect,async()=>{
    // This directory currently blocks automated access. Do not bypass protection or guess its HTML structure.
    await fetchPage(SOURCES.ect,fetcher);throw new Error('Directory adapter pending: access and reuse conditions require review');
  });
  for (const c of candidates) {
    c.missing=[...(!c.address?['Tam sokak/kapı adresi eksik.']:[]),...(!c.coordinates?['Şube koordinatı doğrulanmadı.']:[]),...(c.branchStatus!=='address-corroborated'?['Fiziksel şube ikinci adres kaynağıyla doğrulanmadı.']:[]),
      'Bugünkü açık/kapalı durum bağımsız ve güncel kanıtla kesinleşmedi.',...(c.mapCheckedAt?[]:['Haritada saha kontrol tarihi yok; düzenleme tarihi faaliyet kanıtı değildir.']), 'Kahve uzmanlığı, ürün kalitesi ve ziyaretçi uygunluğu bu aşamada değerlendirilmedi.'];
    if (c.mapCheckedAt && Date.parse(c.mapCheckedAt)>Date.parse(startedAt)) c.conflicts.push('Harita kontrol tarihi gelecekte; faaliyet kanıtı sayılmadı.');
  }
  const coverage=['Montag','Story','Çekirdek','Guten Morgen'].map(query=>({query,candidateIds:candidates.filter(c=>brandKey(c.name)===brandKey(query)).map(c=>c.id)}));
  return {schemaVersion:1,id:`moda-${startedAt.replace(/[:.]/g,'-')}`,startedAt,completedAt:clock().toISOString(),status:!candidates.length?'failed':sources.every(s=>s.status==='ok')?'complete':'partial',
    area:{label:'Moda–Caferağa ve Kadıköy Çarşı çevresi',bbox:BBOX,note:'Dikdörtgen keşif alanıdır; resmi Moda sınırı değildir. Genel kafe/çaycılar da havuzdadır; kahve kategorisi uygunluğu henüz kesinleşmedi.'},sources,candidates:candidates.sort((a,b)=>a.name.localeCompare(b.name,'tr')||a.id.localeCompare(b.id)),duplicatesMerged,ignoredUnnamed,mapSnapshotAt,coverage,
    limitations:['Kalite sıralaması ve Google puanı kullanılmaz. Alfabetik havuzdur.','Haritada kayıt bulunması, sitenin açılması veya yakın tarihli harita düzenlemesi bugün faaliyette olunduğunu kanıtlamaz.','Genel web arama API erişimi yapılandırılmadı. Keşif kaynakları sınırlıdır; tüm işletmeleri kapsama garantisi yoktur. Rehber kayıtları marka düzeyindedir.','European Coffee Trip erişimi/yeniden kullanım koşulları nedeniyle hazır bir otomatik adaptör değildir.','Araştırma yerel diskte saklanır; canlı veritabanına veya ziyaretçi sayfasına yazılmaz.']};
}
