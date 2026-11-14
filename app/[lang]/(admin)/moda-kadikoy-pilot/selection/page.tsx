import GooglePlacesPanel from '../GooglePlacesPanel';
import {headers} from 'next/headers';
import {checkPilotAdmin} from '@/lib/pilot/adminAuth';
import {readVenueSelection} from '@/lib/pilot/gastronomy/selectionReader';
export const dynamic='force-dynamic';
export default async function LocalSelection(
 props:{searchParams: Promise<{region?:string;category?:string}>;params: Promise<{lang:string}>}
) {
 const params = await props.params;
 const searchParams = await props.searchParams;
 if(!(await checkPilotAdmin((await headers()).get('authorization'))).ok)throw new Error('Pilot admin access denied');
 const view=await readVenueSelection(searchParams.region,searchParams.category);
 return <main className="max-w-5xl mx-auto p-6 space-y-5"><h1 className="text-2xl font-bold">Gerçek otomatik mekan seçkisi</h1><p>Yerel geliştirme önizlemesi • Canlı sitede yayın kapalı</p>{view.cards.length===4&&<GooglePlacesPanel lang={params.lang} venues={view.cards}/>}<p className="text-sm">Kanıt uygunluğuna göre sıralanmıştır; kesin tadım üstünlüğü iddiası değildir. Fotoğraf, platform puanları ve yürüme süresi doğrulanmadıysa gösterilmez.</p>{view.cards.length?view.cards.map(c=><article key={c.id} data-selection-card={c.id} className="border rounded-xl p-5 space-y-3"><div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-gray-500 text-sm">Doğrulanmış, kullanım hakkı uygun fotoğraf yok</div><h2 className="text-xl font-bold">{c.rank}. {c.name}</h2><p>{c.address}</p><h3 className="font-bold">Ne Sipariş Etmeli?</h3>{c.whatToOrder.map((f,i)=><p key={i} className="text-sm">{f.text} {f.caveat}</p>)}<h3 className="font-bold">Neden Gitmeli?</h3>{c.whyGo.map(x=><p className="text-sm" key={x}>{x}</p>)}<details><summary className="font-bold cursor-pointer">Ayrıca Bunları da Dene</summary>{c.alsoTry.length?c.alsoTry.map((f,i)=><p className="text-sm" key={i}>{f.text} {f.caveat}</p>):<p>Bağımsız destekli güncel özel yiyecek doğrulanmadı.</p>}</details><details><summary className="font-bold cursor-pointer">Sana Uygun mu?</summary>{c.suitsYou.map((f,i)=><p className="text-sm" key={i}>{f.text} {f.caveat}</p>)}</details><details><summary className="font-bold cursor-pointer">Gitmeden Bil / Kaynaklar ve Belirsizlikler</summary>{c.beforeYouGo.map((x,i)=><p className="text-sm mt-1" key={i}>{x}</p>)}{c.sources.map(s=><p className="text-xs mt-2" key={s.url}><a className="underline" href={s.url} target="_blank" rel="noopener noreferrer">{s.family}</a> • yayın {s.publishedAt||'belirsiz'} • deneyim {s.experienceAt||'bilinmiyor'} • erişim {s.checkedAt}</p>)}</details></article>):<p>Yayın standardını sağlayan kayıt yok. Doğrulanmamış kalite iddiaları yayımlanmadı.</p>}</main>;
}
