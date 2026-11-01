'use client';

import { useState } from 'react';

type Card = {
  id: string;
  name: string;
  location?: string;
  rating?: number;
  unverifiedRating?: boolean;
  whatToOrder?: string[];
  menuFrom?: string[];
};

type Workspace = {
  revision: number;
  canonical: { venues: Card[] };
  order: Card[];
  history: { revision: number; reason: string; branch_order: string[] }[];
  archiveHash: string;
  validUntil: string;
};

type Job = {
  id: number;
  scope: string;
  state: string;
  attempts: number;
  created_at: string;
  finished_at: string;
  revision: number | null;
  detail: string;
};

export default function CloudAdminPanel() {
  const [message, setMessage] = useState('Bulut test ortamı. Production yayını etkin değil.');
  const [step, setStep] = useState('login');
  const [secret, setSecret] = useState('');
  const [qr, setQr] = useState('');
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [busy, setBusy] = useState(false);

  async function request(path: string, body?: unknown) {
    const r = await fetch('/api/gastronomy-admin/' + path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
    const d = await r.json();
    if (!r.ok) throw Error(d.error || 'İşlem tamamlanamadı.');
    return d;
  }

  async function load() {
    const d = await request('workspace');
    if (!d.workspace) throw Error('Henüz doğrulanmış veri aktarılmadı.');
    setWorkspace(d.workspace);
    setOrder(d.workspace.order.map((v: Card) => v.id));
    setStep('ready');

    try {
      const jobData = await request('jobs');
      if (jobData && Array.isArray(jobData.jobs)) {
        setJobs(jobData.jobs);
      }
    } catch {
      // Non-blocking for workspace display
    }
  }

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      const d = await request(
        'login',
        step === 'login'
          ? { action: 'login', email: form.get('email'), password: form.get('password') }
          : { action: 'verify', code: form.get('code') }
      );
      e.currentTarget?.reset();
      if (d.ok) {
        setSecret('');
        setQr('');
        await load();
        setMessage('Yetkili test oturumu açıldı.');
      } else {
        setStep(d.step);
        setSecret(d.secret || '');
        setQr(d.qrCodeDataUri || '');
        setMessage(
          d.step === 'enroll'
            ? 'QR kodunu kendi doğrulayıcı uygulamanla okut. Bu ekranı ve kodlarını paylaşma.'
            : 'Doğrulayıcı uygulamandaki 6 haneli kodu gir.'
        );
      }
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!workspace) return;
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      await request('publish', {
        scope: 'moda/kahve',
        expectedRevision: workspace.revision,
        order,
        reason: form.get('reason'),
      });
      await load();
      setMessage('Yeni sürüm test ortamında kaydedildi. Diğer önbelleklerde en geç 60 saniyede görünür.');
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-6 text-zinc-900 font-sans">
      <header className="border-b border-zinc-200 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">AI Gastronomi Yönetimi</h1>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
            Staging (Test)
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">Ortak Mekan Yönetimi · Codex & Antigravity Eşzamanlı Çalışma Alanı</p>
      </header>

      <div className="rounded-lg bg-zinc-50 p-3.5 border border-zinc-200 text-sm">
        <p role="status" className="font-medium text-zinc-800 break-words">{message}</p>
      </div>

      {!workspace ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
          <form key={step} onSubmit={login} className="space-y-4">
            {step === 'login' ? (
              <>
                <label className="block text-sm font-medium text-zinc-700">
                  E-posta
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="username"
                    className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700">
                  Parola
                  <input
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </label>
              </>
            ) : (
              <div className="space-y-3">
                {qr.startsWith('data:image/svg+xml;') && (
                  <div className="flex justify-center p-3 bg-zinc-50 rounded-lg border">
                    <img src={qr} width={200} height={200} alt="Doğrulayıcı uygulama kurulum QR kodu" />
                  </div>
                )}
                {secret && (
                  <details className="text-xs text-zinc-600">
                    <summary className="cursor-pointer font-medium text-zinc-700">Elle kurulum anahtarını göster</summary>
                    <code className="block mt-1 p-2 bg-zinc-100 rounded break-all">{secret}</code>
                  </details>
                )}
                <label className="block text-sm font-medium text-zinc-700">
                  Doğrulama kodu
                  <input
                    name="code"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    required
                    autoComplete="one-time-code"
                    placeholder="000000"
                    className="mt-1 block w-40 rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm tracking-widest text-center font-mono focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </label>
              </div>
            )}
            <button
              disabled={busy}
              className="w-full sm:w-auto rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-zinc-800 disabled:opacity-50"
            >
              {busy ? 'Kontrol ediliyor…' : 'Güvenli giriş'}
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-100">
            <button
              onClick={() => {
                setBusy(true);
                load().catch((e) => setMessage(e.message)).finally(() => setBusy(false));
              }}
              disabled={busy}
              className="text-xs text-zinc-600 hover:text-zinc-900 underline"
            >
              Mevcut oturumu kontrol et
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <p className="font-semibold text-zinc-900">Moda · Kahve — Sürüm {workspace.revision}</p>
                <p className="text-xs text-zinc-500">Veri geçerlilik sınırı: {workspace.validUntil}</p>
              </div>
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                Canlı Projeksiyon Yayında
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Aktif Sıralama ({order.length} Mekan)
              </h2>

              {order.map((id, i) => {
                const venue = workspace.canonical.venues.find((v) => v.id === id);
                return (
                  <div
                    key={id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-3.5 shadow-sm hover:border-zinc-300 transition-colors"
                  >
                    <div className="min-w-0 grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-zinc-900">{venue?.name || id}</span>
                        {venue?.location && (
                          <span className="text-xs text-zinc-500">· {venue.location}</span>
                        )}
                        {venue?.rating && (
                          <span className="inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
                            ★ {venue.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      {venue?.menuFrom && venue.menuFrom.length > 0 && (
                        <p className="mt-1 text-xs text-zinc-500 truncate">
                          <span className="font-medium text-zinc-600">Menüden:</span> {venue.menuFrom.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        aria-label="Yukarı taşı"
                        disabled={i === 0 || busy}
                        onClick={() =>
                          setOrder((x) => {
                            const n = [...x];
                            [n[i - 1], n[i]] = [n[i], n[i - 1]];
                            return n;
                          })
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-zinc-300 bg-white text-sm font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-30"
                        title="Yukarı taşı"
                      >
                        ↑
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => setOrder((x) => x.filter((v) => v !== id))}
                        className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-40"
                      >
                        Çıkar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {workspace.canonical.venues.filter((v) => !order.includes(v.id)).length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Çıkarılan Doğrulanmış Mekanlar (Geri Eklenebilir)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {workspace.canonical.venues
                    .filter((v) => !order.includes(v.id))
                    .map((v) => (
                      <button
                        key={v.id}
                        disabled={busy}
                        onClick={() => setOrder((x) => [...x, v.id])}
                        className="rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40"
                      >
                        {v.name} — doğrulanmış kaydı ekle
                      </button>
                    ))}
                </div>
              </div>
            )}

            <form onSubmit={save} className="mt-5 pt-4 border-t border-zinc-200 space-y-3">
              <label className="block text-sm font-medium text-zinc-700">
                Karar gerekçesi
                <input
                  name="reason"
                  required
                  minLength={5}
                  maxLength={300}
                  placeholder="Örnek: Kahve haftası öne çıkarma sıralaması"
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </label>
              <button
                disabled={busy}
                className="rounded-md bg-blue-700 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-800 disabled:opacity-50"
              >
                Test seçkisini kaydet
              </button>
            </form>
          </section>

          {jobs.length > 0 && (
            <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-900">Otomasyon & İşlem Geçmişi (pg_cron)</h2>
                <span className="text-xs text-zinc-500">Son {jobs.slice(0, 5).length} işlem</span>
              </div>
              <p className="text-xs text-zinc-500">
                Otomatik tick döngüsü insan yöneticinin belirlediği sıralamayı ve çıkarmaları korur.
              </p>
              <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-100 overflow-hidden text-xs">
                {jobs.slice(0, 5).map((j) => (
                  <div key={j.id} className="p-2.5 flex items-center justify-between gap-2 bg-zinc-50/50">
                    <div>
                      <span className="font-mono font-medium text-zinc-700">#{j.id}</span>
                      <span className="ml-2 font-medium text-zinc-900">[{j.state.toUpperCase()}]</span>
                      <span className="ml-2 text-zinc-500">{j.detail}</span>
                    </div>
                    <span className="text-zinc-400 shrink-0 font-mono">
                      {j.finished_at ? new Date(j.finished_at).toLocaleTimeString() : 'Devam ediyor'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-sm text-zinc-900">Karar geçmişi</h2>
            <div className="space-y-2">
              {workspace.history.map((h) => (
                <p key={h.revision} className="text-xs text-zinc-700 flex flex-wrap items-center justify-between gap-2 p-2 bg-zinc-50 rounded border border-zinc-100">Sürüm {h.revision}: {h.reason} <button
                    disabled={busy}
                    onClick={() => {
                      setOrder(h.branch_order);
                      setMessage('Eski sıralama taslağa alındı. Gerekçe yazarak yeni sürüm olarak kaydet.');
                    }}
                    className="rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
                  >
                    Geri alma taslağı
                  </button>
                </p>
              ))}
            </div>
          </section>

          <footer className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200">
            <button
              onClick={() => window.location.assign('/api/gastronomy-admin/research')}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 underline"
            >
              Kaynak ve araştırma arşivini indir
            </button>
            <button
              disabled={busy}
              onClick={async () => {
                try {
                  await request('logout', {});
                  setWorkspace(null);
                  setStep('login');
                  setMessage('Oturum kapandı.');
                } catch (e) {
                  setMessage((e as Error).message);
                }
              }}
              className="rounded-md border border-zinc-300 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
            >
              Çıkış
            </button>
          </footer>
        </div>
      )}
    </main>
  );
}
