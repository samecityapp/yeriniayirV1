'use client';
import {useState} from 'react';
type Card={id:string;name:string};
type Workspace={revision:number;canonical:{venues:Card[]};order:Card[];history:{revision:number;reason:string;branch_order:string[]}[];archiveHash:string;validUntil:string};
export default function CloudAdminPanel(){
 const [message,setMessage]=useState('Bulut test ortamı. Production yayını etkin değil.');
 const [step,setStep]=useState('login'),[secret,setSecret]=useState(''),[qr,setQr]=useState(''),[workspace,setWorkspace]=useState<Workspace|null>(null),[order,setOrder]=useState<string[]>([]),[busy,setBusy]=useState(false);
 async function request(path:string,body?:unknown){const r=await fetch('/api/gastronomy-admin/'+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,cache:'no-store'});const d=await r.json();if(!r.ok)throw Error(d.error||'İşlem tamamlanamadı.');return d;}
 async function load(){const d=await request('workspace');if(!d.workspace)throw Error('Henüz doğrulanmış veri aktarılmadı.');setWorkspace(d.workspace);setOrder(d.workspace.order.map((v:Card)=>v.id));setStep('ready');}
 async function login(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);const form=new FormData(e.currentTarget);try{
  const d=await request('login',step==='login'?{action:'login',email:form.get('email'),password:form.get('password')}:{action:'verify',code:form.get('code')});
  e.currentTarget?.reset();if(d.ok){setSecret('');setQr('');await load();setMessage('Yetkili test oturumu açıldı.');}else{setStep(d.step);setSecret(d.secret||'');setQr(d.qrCodeDataUri||'');setMessage(d.step==='enroll'?'QR kodunu kendi doğrulayıcı uygulamanla okut. Bu ekranı ve kodlarını paylaşma.':'Doğrulayıcı uygulamandaki 6 haneli kodu gir.');}
 }catch(error){setMessage((error as Error).message);}finally{setBusy(false);}}
 async function save(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!workspace)return;setBusy(true);const form=new FormData(e.currentTarget);try{await request('publish',{scope:'moda/kahve',expectedRevision:workspace.revision,order,reason:form.get('reason')});await load();setMessage('Yeni sürüm test ortamında kaydedildi. Diğer önbelleklerde en geç 60 saniyede görünür.');}catch(error){setMessage((error as Error).message);}finally{setBusy(false);}}
 return <main className="mx-auto max-w-3xl p-6 space-y-5"><h1 className="text-2xl font-bold">AI Gastronomi Yönetimi</h1><p role="status">{message}</p>
 {!workspace?<><form key={step} onSubmit={login} className="space-y-4">
 {step==='login'?<><label className="block">E-posta<input name="email" type="email" required autoComplete="username" className="block border p-2 w-full"/></label><label className="block">Parola<input name="password" type="password" required autoComplete="current-password" className="block border p-2 w-full"/></label></>:<>{qr.startsWith('data:image/svg+xml;')&&<img src={qr} width={200} height={200} alt="Doğrulayıcı uygulama kurulum QR kodu"/>}{secret&&<details><summary>Elle kurulum anahtarını göster</summary><code>{secret}</code></details>}<label className="block">Doğrulama kodu<input name="code" inputMode="numeric" pattern="[0-9]{6}" required autoComplete="one-time-code" className="block border p-2"/></label></>}
 <button disabled={busy} className="rounded bg-blue-700 text-white px-4 py-2">{busy?'Kontrol ediliyor…':'Güvenli giriş'}</button></form>
 <button onClick={()=>{setBusy(true);load().catch(e=>setMessage(e.message)).finally(()=>setBusy(false));}} disabled={busy}>Mevcut oturumu kontrol et</button></>:<>
 <p>Moda · Kahve — Sürüm {workspace.revision}</p><p>Veri geçerlilik sınırı: {workspace.validUntil}</p>
 {order.map((id,i)=><div key={id} className="flex gap-3 items-center border p-3"><span className="grow">{workspace.canonical.venues.find(v=>v.id===id)?.name}</span><button aria-label="Yukarı taşı" disabled={i===0||busy} onClick={()=>setOrder(x=>{const n=[...x];[n[i-1],n[i]]=[n[i],n[i-1]];return n;})}>↑</button><button disabled={busy} onClick={()=>setOrder(x=>x.filter(v=>v!==id))}>Çıkar</button></div>)}
 {workspace.canonical.venues.filter(v=>!order.includes(v.id)).map(v=><button key={v.id} disabled={busy} onClick={()=>setOrder(x=>[...x,v.id])}>{v.name} — doğrulanmış kaydı ekle</button>)}
 <form onSubmit={save}><label>Karar gerekçesi<input name="reason" required minLength={5} maxLength={300} className="block border p-2 w-full"/></label><button disabled={busy} className="bg-blue-700 text-white px-4 py-2 my-3">Test seçkisini kaydet</button></form>
 <button onClick={()=>window.location.assign('/api/gastronomy-admin/research')}>Kaynak ve araştırma arşivini indir</button>
 <h2 className="font-bold">Karar geçmişi</h2>{workspace.history.map(h=><p key={h.revision}>Sürüm {h.revision}: {h.reason} <button disabled={busy} onClick={()=>{setOrder(h.branch_order);setMessage('Eski sıralama taslağa alındı. Gerekçe yazarak yeni sürüm olarak kaydet.');}}>Geri alma taslağı</button></p>)}
 <button disabled={busy} onClick={async()=>{try{await request('logout',{});setWorkspace(null);setStep('login');setMessage('Oturum kapandı.');}catch(e){setMessage((e as Error).message);}}}>Çıkış</button></>}
 </main>;
}
