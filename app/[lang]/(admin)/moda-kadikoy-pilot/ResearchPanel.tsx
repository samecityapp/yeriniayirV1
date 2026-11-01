'use client';
import { useState } from 'react';
import type { ResearchRun } from '@/lib/pilot/research/types';
const operationLabels = {
  unknown: 'Faaliyet durumu bilinmiyor',
  'recent-map-observation': 'Yakın tarihli harita kontrol etiketi',
  'operator-listed': 'İşletmenin şube listesinde var',
  'closure-signal': 'Haritada kapanış sinyali',
  conflict: 'Çelişki var',
};
const date = (value: string | null) => value ? new Date(value).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }) : 'Belirtilmemiş';
export default function ResearchPanel({ initialRun, lang }: { initialRun: ResearchRun | null; lang: string }) {
  const [run,setRun] = useState(initialRun);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');
  const [query,setQuery] = useState('');
  const [coffeeOnly,setCoffeeOnly] = useState(false);
  const [page,setPage] = useState(0);
  const [failedOnly,setFailedOnly] = useState(false);
  const load = async (start: boolean) => {
    setBusy(true);setMessage(start?'Kaynaklar araştırılıyor; bu işlem birkaç dakika sürebilir.':'Kayıt okunuyor…');
    try {
      const response = await fetch(`/${encodeURIComponent(lang)}/moda-kadikoy-pilot/research`, start ? {
        method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:'{}',
      } : {credentials:'same-origin',cache:'no-store'});
      const result=await response.json();
      if (!response.ok) throw new Error(result.error || 'İşlem tamamlanamadı.');
      setRun(result.run);setPage(0);
      setMessage(result.reused?'Kaynakları korumak için 10 dakika içindeki son çalışma gösteriliyor.':start?'Araştırma tamamlandı. Kaynak hataları ve eksikler aşağıda gösteriliyor.':'Son kayıt yüklendi; yeni araştırma çalıştırılmadı.');
    } catch(error) { setMessage(error instanceof Error?error.message:'Bağlantı hatası; son kayıt korunuyor.'); }
    finally { setBusy(false); }
  };
  const filtered=run?.candidates.filter(c=>(!coffeeOnly || c.category==='coffee-signal') && (!failedOnly || c.conflicts.length>0 || c.operation==='closure-signal') && c.name.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))) || [];
  return <section className="space-y-5" aria-label="Otomatik araştırma havuzu">
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
      <h2 className="text-lg font-bold">Gerçek kaynaklardan keşif • Sıralamasız araştırma havuzu</h2>
      <p className="text-sm">Eski pilotun sabit adayları bu havuza aktarılmaz. Harita kaydı, yakın tarihli düzenleme veya internet sitesinin açılması bugün işletmenin açık olduğunu kanıtlamaz. Adaylar alfabetik gösterilir; kalite puanı ve otomatik kazanan yoktur.</p>
      <div className="flex flex-wrap gap-3">
        <button disabled={busy} onClick={()=>load(true)} className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold disabled:opacity-50">{busy?'İşlem sürüyor…':'Araştırmayı çalıştır'}</button>
        <button disabled={busy} onClick={()=>load(false)} className="px-4 py-2 rounded-xl bg-white border border-gray-300 disabled:opacity-50">Son kaydı yenile</button>
      </div>
      <p role="status" aria-live="polite" className="text-sm">{message}</p>
      <p className="text-xs">Yalnızca yönetici tarafından başlatılır. Sayfa açılışı araştırma çalıştırmaz. En az 10 dakika aralıkla; sonuçlar yerel diskte saklanır.</p>
    </div>
    {run?.lastAttempt && <div role="status" className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm space-y-2">
      <strong>Son denemede harita kaynağı okunamadı; önceki kullanılabilir araştırma gösteriliyor.</strong>
      <p>Son deneme: {date(run.lastAttempt.completedAt)} • Bu denemede bulunan: {run.lastAttempt.discoveredCount} kayıt. Aşağıdaki havuz ve kaynak tarihleri önceki çalışmaya aittir.</p>
      {run.lastAttempt.sources.filter(source => source.status !== 'ok').map(source => <p key={source.id}>{source.id}: {source.message}</p>)}
    </div>}
    {!run ? <p className="p-5 bg-white rounded-xl">Henüz kaydedilmiş araştırma yok. Sabit demo verisi gösterilmiyor.</p> : <>
      <div className="bg-white border rounded-2xl p-5 space-y-2 text-sm">
        <h3 className="font-bold">{run.candidates.length} aday kaydı • {run.candidates.filter(c=>c.coordinates).length} harita konumu • {run.duplicatesMerged} tekrar birleştirildi</h3>
        <p>Başlangıç: {date(run.startedAt)} • Bitiş: {date(run.completedAt)} • {run.status==='complete'?'Tüm kaynaklar işlendi':run.status==='partial'?'Kısmi sonuç — kaynak eksikleri var':'Araştırma başarısız'}</p>
        <p>{run.area.label} • {run.area.note}</p>
        <p>Harita veri anı: {date(run.mapSnapshotAt)}. Bu tarih faaliyet teyidi değildir.</p>
        <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors • ODbL 1.0</a>
      </div>
      <div className="grid md:grid-cols-2 gap-3">{run.sources.map(source=><div key={source.id} className="bg-white border rounded-xl p-4 text-sm">
        <a className="font-bold underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.id}</a>
        <p>{source.status==='ok'?'Okundu':source.status==='blocked'?'Erişim engelli':'İşlenemedi'} • {source.count} kaynak kaydı • {date(source.retrievedAt)}</p>
        <p className="text-xs text-gray-600 mt-1">{source.message}</p>
      </div>)}</div>
      <div className="bg-white border rounded-xl p-4 text-sm">
        <h3 className="font-bold mb-2">İstenen isimlerin kapsama kontrolü (seçim veya sıralama değildir)</h3>
        <div className="flex flex-wrap gap-4">{run.coverage.map(item=><span key={item.query}>{item.query}: {item.candidateIds.length?`${item.candidateIds.length} aday kaydı`:'Bu çalışmada keşfedilemedi'}</span>)}</div>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <label className="text-sm">İşletme ara <input type="search" value={query} onChange={e=>{setQuery(e.target.value);setPage(0);}} className="ml-2 p-2 rounded-lg border" placeholder="İşletme adı" /></label>
        <label className="text-sm"><input type="checkbox" checked={coffeeOnly} onChange={e=>{setCoffeeOnly(e.target.checked);setPage(0);}} className="mr-2" />Adında/harita etiketinde kahve sinyali olanlar</label>
        <label className="text-sm"><input type="checkbox" checked={failedOnly} onChange={e=>{setFailedOnly(e.target.checked);setPage(0);}} className="mr-2" />Çelişki / kapanış sinyali</label>
      </div>
      <p className="text-sm">{filtered.length} kayıt eşleşti. Kahve sinyali filtresi uzmanlık veya kalite onayı değildir.</p>
      <div className="space-y-3">{filtered.slice(page*25,(page+1)*25).map(candidate=><details key={candidate.id} className="bg-white border rounded-2xl p-4">
        <summary className="cursor-pointer"><strong>{candidate.name}</strong><span className="block text-xs text-gray-600 mt-1">{candidate.address||'Adres eksik'} • {operationLabels[candidate.operation]} • {candidate.evidence.length} kaynak kaydı</span></summary>
        <div className="mt-4 space-y-3 text-sm">
          <p><strong>Şube:</strong> {candidate.branchStatus==='address-corroborated'?'İşletme adresi ile harita sokak/kapı bilgisi eşleşti':candidate.branchStatus==='map-location'?'Yalnızca harita konumu mevcut; ikinci adres teyidi yok':'Fiziksel şube ayrıştırılamadı'}</p>
          <p><strong>Koordinat:</strong> {candidate.coordinates?`${candidate.coordinates.lat}, ${candidate.coordinates.lng} (harita beyanı)`:'Bilinmiyor'}</p>
          <p><strong>Faaliyet:</strong> {operationLabels[candidate.operation]}. Bugünkü faaliyet kesin olarak doğrulanmadı.</p>
          {candidate.conflicts.map((text,i)=><p key={i} className="text-rose-800">Çelişki: {text}</p>)}
          <h4 className="font-bold">Kaynaklar ve kaydedilen bilgiler</h4>
          {candidate.evidence.map((e,i)=><div key={`${e.url}-${i}`} className="border rounded-lg p-3 bg-gray-50 space-y-1">
            <a href={e.url} target="_blank" rel="noopener noreferrer" className="underline font-semibold break-words">{e.publisher}</a>
            <p className="text-xs">{e.scope==='branch'?'Şube kaydı':'Marka kaydı; şube teyidi değildir'} • Erişim: {date(e.retrievedAt)} • Yayın: {date(e.publishedAt)} • Güncelleme: {date(e.updatedAt)} • Yazar: {e.author||'Belirtilmemiş'}</p>
            <ul className="list-disc pl-5">{e.facts.map(f=><li key={f}>{f}</li>)}</ul>
            <p className="text-xs text-gray-500">{e.usage}</p>
          </div>)}
          <h4 className="font-bold">Eksikler</h4>
          <ul className="list-disc pl-5 text-gray-700">{candidate.missing.map(m=><li key={m}>{m}</li>)}</ul>
        </div>
      </details>)}</div>
      {!filtered.length && <p>Bu filtrelerle eşleşen aday yok.</p>}
      <div className="flex items-center gap-4 text-sm">
        <button disabled={page===0} onClick={()=>setPage(p=>p-1)} className="border rounded-lg p-2 disabled:opacity-40">Önceki</button>
        <span>Sayfa {page+1} / {Math.max(1,Math.ceil(filtered.length/25))}</span>
        <button disabled={(page+1)*25>=filtered.length} onClick={()=>setPage(p=>p+1)} className="border rounded-lg p-2 disabled:opacity-40">Sonraki</button>
      </div>
      <div className="bg-gray-100 rounded-xl p-4 text-xs space-y-1">{run.limitations.map(text=><p key={text}>{text}</p>)}</div>
    </>}
  </section>;
}
