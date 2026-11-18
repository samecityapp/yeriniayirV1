import followup from '@/lib/pilot/quality/targeted-followup.json';
import ledger from '@/lib/pilot/quality/product-evidence.json';
import {headers} from 'next/headers';
import {checkPilotAdmin} from '@/lib/pilot/adminAuth';
import {readAllProductResearch} from '@/lib/pilot/quality/productResearch';
export const dynamic='force-dynamic';
export default async function ProductReport(){
 const h=await headers(),auth=await checkPilotAdmin(h.get('authorization'));
 if(!auth.ok||process.env.VERCEL||!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(h.get('host')||''))return <p>Erişim kapalı.</p>;
 const report=readAllProductResearch();
 return <main className="mx-auto max-w-5xl p-5 text-slate-900"><h1 className="text-2xl font-bold">İmza ürün araştırması — yönetici raporu</h1><p>İmza ilişkisi, güncel tavsiye ve menü mevcudiyeti ayrı değerlendirilir. Eksiklik kötü kalite demek değildir. Kopya yayınlar bağımsız sayılmaz. Yayın tarihi ve ziyaret tarihi farklıdır.</p><p>Bu tur: yeni şube incelemelerinde belirsiz köken; Story için eski ürün anlatısı, Çekirdek/Guten Morgen için güncel resmi şube menüsü eksik; Brekkie kimliği çelişkili. Güncellik eşiği sonuç artırmak için gevşetilmedi.</p>
 <h2 className="mt-5 font-bold">Yeni hedefli araştırma / kabul edilmeyen ipuçları</h2>{followup.findings.map(f=><p key={f.url}><a className="text-blue-700 underline" href={f.url}>{f.venue}</a>: {f.decision}</p>)}
 {report.results.map(r=><section key={r.venueId} className="my-8 border-t pt-4"><h2 className="text-xl font-bold">{ledger.subjects.find(s=>s.venueId===r.venueId)?.name||r.venueId}</h2><p>Ana uzmanlık: {r.mainSpecialty.map(x=>x.categoryId).join(', ')}</p><p>İmza ürün: {r.signatureProducts.join(', ')||'Doğrulanmadı'}</p><p>Ne Sipariş Etmeli: {r.recommendedProducts.join(', ')||'Yeterli güncel kanıt yok'}</p><p>{r.identityGaps.join(' ')}</p><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th>Ürün</th><th>Karar</th><th>Eksik / karşı kanıt</th><th>Kaynak</th></tr></thead><tbody>{r.products.map(p=><tr key={p.product.id} className="border-b"><td className="p-2">{p.product.label}</td><td>{p.state}</td><td>{p.reasons.join(' ')}</td><td>{p.sourceIds.map(id=>{const s=r.sources.find(s=>s.id===id);return s?<div key={id}><a href={s.url} className="text-blue-700 underline">{s.publisher}</a><small> Yayın: {s.publishedAt||'bilinmiyor'}; deneyim: {s.experienceAt||s.experienceYear||'bilinmiyor'}; kontrol: {s.checkedAt}; erişim: {s.access}; sponsorluk: {s.sponsorship}</small></div>:null;})}</td></tr>)}</tbody></table></div></section>)}
 </main>;
}
