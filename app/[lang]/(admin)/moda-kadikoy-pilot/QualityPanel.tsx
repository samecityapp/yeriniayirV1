'use client';
import { useState } from 'react';
import type { ClaimField, QualityClaim, QualityDossier, QualityReport, QualitySource } from '@/lib/pilot/quality/types';
const date=(value:string|null)=>value?new Date(value).toLocaleDateString('tr-TR',{timeZone:'Europe/Istanbul'}):'Belirtilmemiş';
const labels:Record<ClaimField,string>={specialty:'Ana uzmanlık ve kalite bulguları',drink:'Ne içmeli? — araştırma siparişi',why:'Neden araştırmaya değer?',also:'Ayrıca hangi özel ürün?',fit:'Atmosfer ve sana uygunluğu',before:'Gitmeden bil',identity:'Fiziksel şube kimliği',operation:'Faaliyet durumu'};
function Claim({claim,sources}:{claim:QualityClaim;sources:QualitySource[]}) {
  return <li className="space-y-1 mb-3">
    <p>{claim.text}</p>
    <p className="text-xs text-gray-500">{claim.scope==='branch'?'Şube anlatısı':claim.scope==='brand'?'Marka düzeyi — şube tadımı değil':'Şube eşleşmesi çözülmedi'} • {claim.basis==='inference'?'Araştırma çıkarımı':claim.basis==='menu'?'Menüde bulunma; kalite hükmü değil':'Kaynağın bildirdiği bulgu'}</p>
    {claim.caveat&&<p className="text-xs text-amber-900">{claim.caveat}</p>}
    <div className="flex flex-wrap gap-2 text-xs">{claim.sourceIds.map(id=>{const source=sources.find(s=>s.id===id)!;return <a key={id} className="underline text-blue-800" href={source.url} target="_blank" rel="noopener noreferrer">{source.publisher} · {date(source.publishedAt)}</a>;})}</div>
  </li>;
}
function Dossier({item,sources}:{item:QualityDossier;sources:QualitySource[]}) {
  const linked=sources.filter(source=>item.claims.some(c=>c.sourceIds.includes(source.id)));
  return <article className="rounded-2xl border bg-white p-5 space-y-4" data-quality-candidate={item.id}>
    <div className="space-y-2">
      <h3 className="text-lg font-bold">{item.name}</h3>
      <span className="inline-block text-xs px-2 py-1 rounded bg-amber-100 text-amber-900">{item.state==='promising'?'Kaynaklı araştırma adayı':'Ek Araştırma'} • Yayınlanmadı</span>
      <p className="text-sm text-gray-600">{item.reason}</p>
      <p className="text-xs text-gray-500">Harita: {item.candidate.address||'Adres alanı boş'} • {item.candidate.coordinates?`${item.candidate.coordinates.lat}, ${item.candidate.coordinates.lng}`:'Koordinat yok'} <a className="underline" href={item.candidate.evidence[0]?.url} target="_blank" rel="noopener noreferrer">Kaynak konumu</a></p>
    </div>
    <div className="bg-blue-50 rounded-xl p-3 text-xs space-y-1">
      <p><strong>Kanıt güvenilirliği:</strong> {item.independentFamilies.length} editöryal yayın ailesi; {item.branchProductFamilies.length} şube düzeyinde ürün anlatısı ailesi.</p>
      <p>{item.recentPublicationFamilies.length} ailede son 365 gün içinde yayın var. Bu, deneyimin son 365 günde yaşandığını göstermez.</p>
      <p>İşletme beyanları, söyleşiler, sponsorlu içerik ve harita türevleri bağımsız kalite sayımının dışında.</p>
    </div>
    {(['identity','specialty','why','drink','also','fit','before'] as ClaimField[]).map(field=><div key={field}>
      <h4 className="text-sm font-bold mb-2">{labels[field]}</h4>
      {item.claims.some(c=>c.field===field)?<ul className="text-sm">{item.claims.filter(c=>c.field===field).map(claim=><Claim key={claim.id} claim={claim} sources={sources}/>)}</ul>:<p className="text-sm text-gray-500">Yeterli doğrulanabilir kanıt yok — Ek Araştırma.</p>}
    </div>)}
    <div className="bg-amber-50 rounded-xl p-3 text-sm space-y-2">
      <h4 className="font-bold">Eksik ve çelişkili bilgiler</h4>
      <ul className="list-disc pl-4">{item.gaps.map(text=><li key={text}>{text}</li>)}</ul>
      {item.conflicts.length>0&&<ul className="list-disc pl-4 text-rose-900">{item.conflicts.map(text=><li key={text}>{text}</li>)}</ul>}
      <p className="text-xs">Kesin kapanış doğrulanmadı. Harita etiketi veya listeden kaybolma tek başına kapanış kanıtı değildir.</p>
    </div>
    <details className="border-t pt-3 text-xs">
      <summary className="cursor-pointer font-bold">Kaynak künyeleri, tarihler ve güvenilirlik ({linked.length})</summary>
      <div className="space-y-4 mt-3">{linked.map(source=><div key={source.id} className="space-y-1">
        <a className="underline text-blue-800 break-all" href={source.url} target="_blank" rel="noopener noreferrer">{source.publisher} — {source.url}</a>
        <p>Yazar: {source.author||'Belirtilmemiş'} • Yayın: {date(source.publishedAt)} • Güncelleme: {date(source.updatedAt)}</p>
        <p>Kaynak inceleme kaydı: {date(source.accessedAt)} • Deneyim: {date(source.experienceDate)}</p>
        <p>Aile: {source.family} • {source.eligibleIndependent?'Editöryal kaynak; açıklanmış sponsorluk görülmedi':'Bağımsız kalite sayımından hariç'}</p>
        <p>{source.note}</p>
      </div>)}</div>
    </details>
    <details className="text-xs"><summary className="cursor-pointer">Yeniden araştırma için sorgular</summary><ul className="list-disc pl-4 mt-2">{item.searchQueries.map(q=><li key={q}>{q}</li>)}</ul></details>
  </article>;
}
export default function QualityPanel({report}:{report:QualityReport|null}) {
  const [chosen,setChosen]=useState<string[]>(()=>report?.dossiers.filter(d=>d.compare).map(d=>d.id)||[]);
  const [notice,setNotice]=useState('');const [query,setQuery]=useState('');
  if(!report)return <p className="rounded-xl border bg-white p-5">Henüz kaynak inceleme dosyası hazırlanmadı. Demo ürün önerisi gösterilmiyor.</p>;
  const selected=report.dossiers.filter(d=>chosen.includes(d.id));
  const toggle=(id:string)=>{setNotice('');if(chosen.includes(id))setChosen(ids=>ids.filter(i=>i!==id));else if(chosen.length>=10)setNotice('En fazla 10 aday karşılaştırılabilir. Önce bir adayın seçimini kaldırın.');else setChosen(ids=>[...ids,id]);};
  return <section aria-label="Kalite ve ürün araştırması" className="space-y-5">
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
      <h2 className="text-xl font-bold">Kalite ve Ürün Araştırması • Aşama 2</h2>
      <p className="text-sm">{report.stats.coffeeSignals} kahve sinyali için mevcut veriden ön kontrol, {report.stats.additionalCandidates} filtre dışında kalmış ek aday ve {report.stats.deep} ayrıntılı kaynak dosyası. {report.stats.comparison} aday başlangıç karşılaştırmasında; alfabetik, sıralamasız.</p>
      <p className="text-sm">Kalite bulguları, kanıt güvenilirliği ve ziyaretçi uygunluğu ayrı tutulur. Yemek veya tatlı satmak eleme nedeni değildir. Bu sekme kaynak dosyalarını gösterir; güncel otomatik seçki ve yayın durumu AI Gastronomi Yönetimi sekmesindedir.</p>
      <p className="text-xs">Kaynak incelemesi: {date(report.researchedAt)} • Keşif kaydı: {date(report.discoveryCompletedAt)}. Bu çalışma, geliştirme ajanının gerçek web incelemesinden kaydedilmiş notlarıdır; her sayfa açılışında yeni tadım veya web araştırması yapılmaz.</p>
      <p className="text-xs">{report.stats.sourceCount} kaynak kaydı • {report.stats.independentFamilies} editöryal yayın ailesi • {report.stats.confirmedClosed} kesin kapanış teyidi. Menüde bulunmak, iyi yapılmış olduğunun kanıtı değildir.</p>
    </div>
    <div className="bg-white rounded-2xl border p-4 space-y-3">
      <h3 className="font-bold">Karşılaştırılacak adaylar ({chosen.length}/10)</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">{report.dossiers.map(d=><label key={d.id} className="flex gap-2 text-sm items-start"><input type="checkbox" checked={chosen.includes(d.id)} onChange={()=>toggle(d.id)} className="mt-1"/>{d.name}</label>)}</div>
      <p role="status" aria-live="polite" className="text-sm text-amber-900">{notice}</p>
    </div>
    <div className="grid lg:grid-cols-2 gap-5 items-start">{selected.map(item=><Dossier key={item.id} item={item} sources={report.sources}/>)}</div>
    {!selected.length&&<p>Karşılaştırmak için yukarıdan aday seçin.</p>}
    <details className="bg-white border rounded-2xl p-5">
      <summary className="font-bold cursor-pointer">Tüm ön kontrol havuzu ({report.stats.triaged}) • Kanıtı eksik olanlar elenmedi</summary>
      <p className="text-sm mt-3">Bu bölüm mevcut keşif kaydının konum, adres ve faaliyet eksiklerini kontrol eder. Ayrıntılı dosyası bulunmayan işletmelerin tümü için derin web taraması yapılmış sayılmaz.</p>
      <label className="block text-sm my-3">Havuzda ara <input type="search" value={query} onChange={e=>setQuery(e.target.value)} className="border rounded-lg p-2 ml-2 max-w-full"/></label>
      <div className="overflow-x-auto"><table className="w-full text-sm text-left"><caption className="sr-only">Ön kontrol ve ek araştırma durumları</caption><thead><tr><th className="p-2">Aday</th><th className="p-2">Durum</th><th className="p-2">Adres / eksikler</th></tr></thead><tbody>{report.triage.filter(c=>c.name.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))).map(c=><tr key={c.id} className="border-t"><th scope="row" className="p-2 font-medium">{c.name}</th><td className="p-2">{c.deep?'Dosya incelendi; teyitler eksik':'Ek Araştırma'}</td><td className="p-2">{c.address||'Harita adresi yok'}<p className="text-xs">Harita sinyali: {c.operation==='recent-map-observation'?'Yakın tarihli kontrol etiketi':c.operation==='operator-listed'?'İşletme listesinde':c.operation==='closure-signal'?'Kapanış sinyali; teyit gerekli':c.operation==='conflict'?'Çelişkili':'Bilinmiyor'}</p><p className="text-xs text-gray-500">{c.specialty} • {c.gaps.join(' ')}</p></td></tr>)}</tbody></table></div>
    </details>
    <details className="bg-white border rounded-xl p-4 text-sm"><summary className="cursor-pointer font-bold">Engellenen / sayımdan çıkarılan kaynaklar</summary><ul className="list-disc pl-5 mt-3 space-y-2">{report.sources.filter(s=>s.access!=='read'||!s.eligibleIndependent).map(s=><li key={s.id}><a className="underline" href={s.url} target="_blank" rel="noopener noreferrer">{s.publisher}</a>: {s.note}</li>)}</ul></details>
    <div className="text-xs text-gray-600 bg-gray-100 rounded-xl p-4 space-y-2">{report.limitations.map(text=><p key={text}>{text}</p>)}<a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">Konum kaynağı © OpenStreetMap contributors • ODbL</a></div>
  </section>;
}
