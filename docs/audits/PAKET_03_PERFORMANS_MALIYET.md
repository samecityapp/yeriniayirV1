# PAKET 03 — GASTRONOMİ V5 PERFORMANS VE MALİYET OPTİMİZASYONU

**Tarih:** 18 Kasım 2026  
**Temel Commit (`b208160`, dokunulmadı):** `feat/antigravity-production-readiness` (`b208160a3e4f9db2f4b932225deb73ee1c6e4fe3`)  
**Bağımsız Geliştirme Dalı & Worktree:** `feat/gastronomy-v5-perf-cost` (`/Users/erdems/Documents/Codex/yeriniayir-perf-cost`)  
**Önceki Raporlar:** [PAKET_01_ALTYAPI_DENETIMI.md](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/docs/audits/PAKET_01_ALTYAPI_DENETIMI.md) · [PAKET_02_P0_GUVENLIK_DUZELTMELERI.md](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/docs/audits/PAKET_02_P0_GUVENLIK_DUZELTMELERI.md)  
**Çalışma Sınırları:** P0 güvenlik düzeltmelerini içeren hiçbir dosyaya dokunulmadı; tasarım/görseller/UX korunarak yeni bağımlılık veya ücretli servis eklenmedi; canlı Supabase/staging'e veri yazılmadı; `main` veya P0 dalına merge ve `git push` yapılmadı.

---

## 1. Doğrulanan Sorunlar

Değişiklik öncesi `b208160` sürümü üzerinde izole `127.0.0.1` mock Supabase/Upstash ve `VERCEL=1 VERCEL_ENV=production` simülasyonuyla çalıştırılan baseline ölçümünde (`work/perf-cost/before.json`) şu 4 darboğaz kanıtlandı:

1. **`force-dynamic` + `headers()` Nedeniyle Sıfır CDN/ISR Önbelleği ve `useSearchParams` SSR Maliyeti:**
   - Eski `app/[lang]/(main)/page.tsx` içinde `export const dynamic = 'force-dynamic'` ve `searchParams` bulunuyordu; ayrıca `lib/food/localPreview.ts` her çağrıda `(await headers()).get('host')` okuduğu için tüm kök sayfalar dinamik render'a zorlanıyordu.
   - `b208160` derlemesinde yalnızca `6` rota prerender edilirken `/tr` ve `/en` `ƒ (Dynamic)` kaldı; her `/tr`, `/tr?utm_source=...&fbclid=...` ve `/tr?region=moda` isteğinde `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` ve `233.708–237.365` bayt ham HTML (`53.004–53.733` bayt gzip) döndü.
   - İlk HTML içinde varsayılan Moda mekan verisiyle birlikte eski `<Header />` ve `<Footer />` RSC yükü taşınıyordu; konum modalından bölge değiştirildiğinde `GastronomyPageClient` `router.push` ile tam sunucu SSR/RSC yenilemesi tetikliyordu (`1` akışta `3` belge/RSC isteği).

2. **Production Modunda Gizli `<Footer />` Supabase `articles` Sorgusu ve `revalidate = 0` Alt Rotalar:**
   - Eski ana sayfa `(main)` rota grubunda olduğu için `app/[lang]/(main)/layout.tsx` koşulsuz `<Footer lang={lang} localPreview={preview} />` render ediyor, `PublicLayoutWrapper.tsx` yalnızca istemcide `/` ve `/${lang}` rotalarında DOM'u gizliyordu. `VERCEL_ENV=production` (`localPreview === false`) olduğunda görünmeyen footer için `components/Footer.tsx:11` -> `db.articles.getLatest(3, lang)` **her sayfa isteğinde 1 Supabase sorgusu** (`11/11` istek = `11` DB sorgusu) üretti.
   - Ayrıca `/[lang]/rehber`, `/[lang]/rehber/[slug]` ve `/[lang]/otel/[id]` `revalidate = 0`, `app/sitemap.ts` ise cache süresizdi.

3. **`PageViewTracker` ve `/api/track-event` %100 Hata (400/500), Çift Sayım, PII ve Boşa Upstash Tüketimi:**
   - `components/PageViewTracker.tsx`, tüm gastronomi ve otel sayfalarında `useSearchParams()` değişimine bağlı olarak `event_type: 'page_view'`, `hotel_id: null` ve `metadata.search` (UTM/`fbclid` ham sorgu dizisi) gönderiyordu.
   - `app/api/track-event/route.ts` şeması ise yalnız `uuid` `hotel_id` ve `['view','click','booking_click','contact_click']` kabul ettiği için her ziyarette `400` veya (Upstash env/script uyumsuzluğunda) **`500`** veriyordu. Baseline Chrome akışında **4 adet `POST /api/track-event`** isteğinin **4/4'ü HTTP `500`** döndü ve her hatalı istekte doğrulama öncesi `4` Upstash komutu harcandı. Üstelik `MobileHotelInfo.tsx:89,101` tarafındaki `website_click`/`instagram_click` olayları da eski enum tarafından reddediliyordu.

---

## 2. Yapılan Düzeltmeler & Önbellek / Güvenlik Garantileri

| Alan | Yapılan Değişiklik | Dosya(lar) |
|---|---|---|
| **`headers()` Kaldırılması** | `await headers()` bağımlılığı kaldırıldı; `isLocalFoodPreviewSync()` platform/build değişkenleriyle (`VERCEL_ENV`, `APP_ENVIRONMENT`, `GASTRONOMY_CLOUD_ENV`, `GASTRONOMY_LOCAL_PREVIEW`) çalışacak biçimde güncellendi (geriye dönük `isLocalFoodPreview()` korundu). | [localPreview.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/lib/food/localPreview.ts) |
| **Gastronomi Statik/ISR Kabuğu & Gizli `<Footer />` Kaldırma** | Eski `app/[lang]/(main)/page.tsx` kaldırılarak Gastronomi kökü ayrı `(gastronomy)` rota grubuna taşındı (`app/[lang]/(gastronomy)/layout.tsx` & `page.tsx`, `revalidate = 3600`, `generateStaticParams` `tr`/`en`). Bu grupta `<Header />` ve `<Footer />` hiç mount edilmez (`0` Supabase `articles` sorgusu); Production'da yalnız `dict.cookie_banner` dilimi lazy `GastronomyCookieBanner` ile sunulur. | [layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/%5Blang%5D/(gastronomy)/layout.tsx), [page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/%5Blang%5D/(gastronomy)/page.tsx), [GastronomyCookieBanner.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/components/food/GastronomyCookieBanner.tsx) |
| **92 Bölge Statik/ISR JSON API & İstemci Bellek Önbelleği** | Ana HTML yalnızca 92 yayınlı bölge dizinini (`getDirectoryOnlyFoodDiscovery`) taşır. Bölge seçildiğinde istemci önce `Map` belleğine ve uçuş-içi Promise deduplication katmanına bakar; yoksa statik `force-static` (`revalidate = 3600`, 92 `generateStaticParams`, `Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400`) `/api/gastronomy/regions/[slug]` ucundan ~55–62 KB ham (CDN'de sıkıştırılan) salt ziyaretçi JSON'unu çeker. Browser `Back`/`Forward` (`popstate`) 0 ek istek üretir. | [regionDiscovery.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/lib/food/regionDiscovery.ts), [route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/api/gastronomy/regions/%5Bslug%5D/route.ts), [GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/components/food/GastronomyPageClient.tsx) |
| **UTM / `fbclid` Önbellek Bağışıklığı** | Root `page.tsx` `searchParams` okumaz, API çerez/query okumaz, istemci yalnızca `region`/`category` okur; `utm_*`, `fbclid`, `gclid` tarayıcı adres çubuğunda GA4 için korunurken sunucu/CDN cache anahtarını asla bölmez (`HIT`). | [page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/%5Blang%5D/(gastronomy)/page.tsx), [GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/components/food/GastronomyPageClient.tsx) |
| **Diğer Alt Rotalarda ISR + `<Footer />` Cache + Revalidation** | `(main)` alt rotaları için `Footer.tsx` `isSupabaseIsolated` koruması ve `unstable_cache(..., { revalidate: 3600, tags: ['articles', 'footer-articles'] })` eklendi; `/rehber`, `/rehber/[slug]`, `/otel/[id]` ve `sitemap.ts` `revalidate = 3600` yapıldı. `publish/route.ts` mevcut auth/CSRF kontrolleri korunarak `revalidatePath('/tr')`, `revalidatePath('/en')` ve `revalidatePath('/api/gastronomy/regions/moda')` eklendi. | [Footer.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/components/Footer.tsx), [rehber/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/%5Blang%5D/(main)/rehber/page.tsx), [rehber/[slug]/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/%5Blang%5D/(main)/rehber/%5Bslug%5D/page.tsx), [otel/[id]/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/%5Blang%5D/(main)/otel/%5Bid%5D/page.tsx), [sitemap.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/sitemap.ts), [publish/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/api/gastronomy-admin/publish/route.ts) |
| **Analitik Onarımı & Upstash Tasarrufu** | `PageViewTracker` yalnız gerçek otel UUID detay rotalarında (`/(tr\|en\|el)/(otel\|hotel)/<uuid>`) çalışır, `useSearchParams()` yerine `usePathname()` kullanır ve `Set` + `sessionStorage` ile çift sayımı önler. `/api/track-event` ise Upstash'ı tembel (lazy) başlatır; gövde boyutu + JSON + Zod doğrulamasını Upstash **öncesine** alır; `page_view`/`view` ve tıklama olaylarının tamamını destekler; `metadata` içinden tüm query/`fbclid`/`email` alanlarını ayıklar, IP'yi günlük SHA-256 ile özetler; 60 sn `view` deduplication uygular; izole ortamda/RLS engelinde/Upstash arızasında **`500` yerine `202 { success: true, recorded: false }`** döner. | [PageViewTracker.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/components/PageViewTracker.tsx), [track-event/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/api/track-event/route.ts) |

### Önbellek Güncelliği ve Gizlilik Garantileri
- **İçerik güncellendiğinde yenilenme:** Bölge JSON snapshot'ları kod deposunda olduğu için her Git/Vercel dağıtımında 92 bölge + `/tr` + `/en` tazelenir; ek olarak çalışma zamanı `revalidate = 3600` (1 saat ISR) ve `/api/gastronomy-admin/publish` üzerinden `revalidateTag` + `revalidatePath` tetiklenir.
- **Taslak / Yönetici / Kişisel veri sızıntısı önleme:** `regionDiscovery.ts` yalnız `getPublishedV3Snapshot` okur (`dossiers/`, `reviewCount`, kaynak URL veya `coming_soon` asla serileştirilmez; bilinmeyen slug `404` döner); `APP_ENVIRONMENT === 'staging'` altında bölge API yanıtları `Cache-Control: private, no-store, max-age=0` döner; `/api/track-event` her zaman `Cache-Control: no-store, max-age=0` ile çalışır.

---

## 3. Önce (`b208160`) / Sonra (`feat/gastronomy-v5-perf-cost`) Ölçüm Karşılaştırması

Aşağıdaki tüm sayılar, harici ağ kapatılarak `127.0.0.1` mock Supabase/Upstash ve `VERCEL=1 VERCEL_ENV=production` simülasyonuyla `work/perf-cost/benchmark.cjs` (`before.json` ve `after.json`) tarafından ölçülen **gerçek yerel `npx next start` + Headless Chrome (`390px`)** gözlemleridir:

| Metrik | Önce (`b208160`) | Sonra (`feat/gastronomy-v5-perf-cost`) | Değişim / Kanıt |
|---|---|---|---|
| **Build statik prerender rota sayısı** | `6` (`/tr`, `/en` dynamic) | **`102`** (`113` statik sayfa; `/tr`, `/en`, `/tr/rehber`, `/en/rehber`, `/sitemap.xml` + `92` bölge API) | +96 statik/ISR rota |
| **`/tr` `Cache-Control` başlığı** | `private, no-cache, no-store, max-age=0, must-revalidate` | **`s-maxage=3600, stale-while-revalidate=31532400`** | Public CDN/ISR önbelleğe alındı |
| **Yerel Next Cache (`x-nextjs-cache`) — `/tr` & UTM/`fbclid`** | `null` (her istek dinamik SSR) | **`HIT`** (tüm `/tr`, `utm_source`, `fbclid` varyantlarında) | `%0` önbellek parçalanması |
| **`/tr` ham HTML / Gzip boyutu** | `233.708 B` / `53.004 B` | **`160.988 B` / `33.717 B`** | **-%31,1** ham HTML / **-%36,4** gzip |
| **`/tr` soğuk / sıcak (10 istek medyan) yerel yanıt** | `464,71 ms` / `15,12 ms` | **`433,53 ms` / `4,54 ms`** (UTM/fbclid `3,83–3,93 ms`) | Sıcak yanıtta **~%70–75** hızlanma |
| **Sayfa başı `articles` DB sorgusu (11 istek ölçümü)** | `1` (`11/11`) | **`0` (`0/11`)** | **-%100** |
| **`/api/gastronomy/regions/moda` & `karakoy` yanıtı** | *Yoktu (tam SSR `~237 KB`)* | **`HIT`**, `public, max-age=300, s-maxage=3600`, warm medyan **`1,41 ms` / `1,02 ms`**, `0` DB | Statik CDN JSON |
| **390px Chrome tam akış — Belge/RSC SSR isteği** | `3` | **`1`** | Bölge geçişi SSR/RSC'siz |
| **390px Chrome tam akış — Toplam yerel istek** | `40` | **`35`** *(Not: 2 bölge JSON dahil)* | `-5` net istek (`-4` hatalı analitik, `-2` RSC, `+2` bölge JSON) |
| **390px Chrome tam akış — `/api/track-event` & durum** | `4` (`4× HTTP 500`) | **`0`** | **-%100** hata ve gereksiz fonksiyon |
| **390px Chrome tam akış — Upstash / `articles` / `analytics` DB** | `4` Upstash / `1` `articles` | **`0` Upstash / `0` `articles` / `0` `analytics`** | **-%100** |
| **390px Chrome tam akış — Sayfa açılışı (`homeLoadMs` -> `karakoyLoadMs`)** | `903,2 ms` -> `447,9 ms` (`Moda`) -> `406,0 ms` (`Karaköy`) | **`801,1 ms`** -> **`446,5 ms`** (`Moda`) -> **`383,1 ms`** (`Karaköy`) | Açılış ~`102 ms` hızlandı |
| **390px Chrome tam akış — Aktarılan toplam bayt (`local next start`)** | `536.767 B` *(gzip'li RSC)* | **`553.712 B`** *(`next start` statik Route Handler JSON çıktısını yerelde gzip'lemeden `55.534 + 62.377 B` raw yolladığı için)* | **Vercel CDN Edge (`br`/`gzip`) canlıda Test edilemedi** *(sıkıştırma sonrası ~%20-25 düşüş beklenir)* |
| **Gerçek Vercel Global Edge CDN `x-vercel-cache: HIT`, gerçek kullanıcı p75 TTFB/LCP/INP & aylık fatura** | Production deploy yapılmadı | **Test edilemedi** | Deploy ve trafik sonrası panelden doğrulanacak |

---

## 4. Geçen Testler (Son Kod Üzerinde `exit 0`)

- `node scripts/verify_v3_gastronomy.cjs` → **21/21 Geçti**
- `node scripts/verify_visitor_content.cjs` → **10/10 Geçti**
- `node scripts/verify_pilot_security.cjs` → **48/48 Geçti**
- `node scripts/verify_staging_preflight.cjs` → **8/8 Geçti**
- `npx tsc --noEmit` → **Geçti (`0` hata)**
- `npm run build` → **Geçti (`113/113` statik sayfa)**
- `node scripts/verify_p0_security_fixes.cjs` → **24/24 Geçti** (`Anonim`, `Normal Kullanıcı`, `Yetkili Yönetici`, `CSRF`, `SSRF`, `Preview İzolasyon`)
- `node scripts/verify_paket03_perf_and_analytics.cjs` → **7/7 Geçti** (P0 dokunulmazlık diff'i boş, `headers()` yokluğu, bölge API izolasyon/staging/404 kontrolleri, `/api/track-event` validasyon/dedupe/PII/graceful-202 matrisi, `390px` ve `1440px` izole Incognito Chrome E2E akışı + `Back`/`Forward`)

---

## 5. Devam Eden Riskler

1. **`middleware.ts` Statik Varlık & `.svg` Edge Çağrı Çarpanı:** P0 güvenlik denetiminin sürdüğü `middleware.ts` dosyasına dokunmama kuralı nedeniyle [middleware.ts:214](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/middleware.ts) `matcher`'ındaki `.svg`/`.woff2` kapsam dışı bırakma iyileştirmesi henüz yapılmamıştır; birleştirme sonrası uygulanmalıdır.
2. **İstemci Başlangıç İndirme Bütçesi (`regions/*.json` & `LocationPickerModal`):** Bölge JSON'ları CDN'den sıkıştırılıp önbellekten gelse de ilk yüklemede `LocationPickerModal` için `locations` dizisi (`160 KB` ham HTML) ve 11 görsel yüklenir; Vercel Brotli/Gzip ile canlıda ölçümü (**Test edilemedi**) ayrıca yapılmalıdır.
3. **KVKK/GDPR Rıza Öncesi GA4/Clarity Yüklenmesi & `Permissions-Policy: geolocation=()`:** [app/[lang]/layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/app/%5Blang%5D/layout.tsx) ve [next.config.js](file:///Users/erdems/Documents/Codex/yeriniayir-cloud-admin/next.config.js) P0 koruma sınırında olduğu için bu pakette değiştirilmemiştir.
4. **Eski/Demo Rotalar (`/design-demo`, `/preview-food-card`, `/fethiye-yemek-rehberi`, `/otel/*`):** Sonraki güvenlik/temizlik paketinde kapatılmalı veya `noindex` + auth altına alınmalıdır.

---

## 6. Codex'in Özellikle Denetlemesi Gereken Değişiklikler

`git diff --name-only b208160` kontrolüyle `b208160` P0 güvenlik dosyalarının **hiçbirine** (`lib/admin/offerAdminGuard.ts`, `lib/supabase-env-guard.ts`, `lib/supabase.ts`, `lib/supabase-admin.ts`, `lib/cloud/config.ts`, `lib/offers.ts`, `middleware.ts`, `next.config.js`, `app/[lang]/layout.tsx`, `app/[lang]/(admin)/jilinrime/*`, `scripts/verify_p0_security_fixes.cjs`) dokunulmadığı doğrulanmıştır (**`0` dosya kesişimi**). Codex'in özellikle denetlemesi gereken yeni/değişen yüzeyler:

1. [app/api/gastronomy/regions/[slug]/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/api/gastronomy/regions/%5Bslug%5D/route.ts) & [lib/food/regionDiscovery.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/lib/food/regionDiscovery.ts): `force-static` çıktısının hiçbir şekilde `dossiers/`, `reviewCount`, kaynak URL'si, admin alanı veya `coming_soon` taslağı içermediği; `APP_ENVIRONMENT === 'staging'` iken `private, no-store` başlığının korunduğu.
2. [app/[lang]/(gastronomy)/layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/%5Blang%5D/(gastronomy)/layout.tsx) & [app/[lang]/(gastronomy)/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/%5Blang%5D/(gastronomy)/page.tsx) *(eski `app/[lang]/(main)/page.tsx` silindi)*: `isLocalFoodPreviewSync()` altında Preview/Staging `noindex, nofollow` ve çerez/analitik izolasyonunun korunduğu; `(main)/layout.tsx` ve `(main)` alt rotalarının (`otel`, `rehber`, `search`, legal) çalışmaya devam ettiği.
3. [components/food/GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/components/food/GastronomyPageClient.tsx): URL senkronizasyonunun `utm_*`/`fbclid` parametrelerini koruyup cache anahtarını bozmadığı, yarış durumlarına (`activeRegionRequestRef`) ve tarayıcı `Back`/`Forward` geçmişine (`popstate`) uyumlu olduğu.
4. [components/PageViewTracker.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/components/PageViewTracker.tsx) & [app/api/track-event/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/api/track-event/route.ts): `metadata` PII temizliği, SHA-256 IP özetleme, Upstash öncesi Zod doğrulaması, 60 sn view deduplication ve DB/Upstash hatasında `202` ile sessiz geri çekilme.
5. [components/Footer.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/components/Footer.tsx), [app/api/gastronomy-admin/publish/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/api/gastronomy-admin/publish/route.ts), [app/sitemap.ts](file:///Users/erdems/Documents/Codex/yeriniayir-perf-cost/app/sitemap.ts) ve `/rehber` + `/otel/[id]` `revalidate = 3600` değişiklikleri (`publish/route.ts` içindeki `sameOrigin` + `cloudAdmin` kilidinin bozulmadığı).

---

## 7. İlgili 48 Maddelik Listedeki Kontrol Numaraları

Görev 1 denetim yönergesinde (`01–04` maddeleri) iletilen numaralı çerçeve ile bu pakette kapatılan kalemler doğrudan aşağıdaki maddelere karşılık gelmektedir *(not: `05–48` arası maddelerin tam numaralı listesi depodaki mevcut dokümanlarda yer almadığından uydurma numara ataması yapılmamış; yalnız doğrudan verilen `01–04` numaraları ile depodaki 48 maddelik güvenlik test paketi belirtilmiştir)*:

- **Doğrudan Karşılık Gelen Verilen Denetim Maddeleri:**
  - **`02` — Sistemin özelliklerini çıkar (ve kırık/ölü uçları ayır):** Hatalı `%100 400/500` veren `/api/track-event` & `PageViewTracker` akışı ve gereksiz `router.push` SSR tetiklemesi düzeltildi.
  - **`03` — Mevcut maliyetleri incele:** Kullanıma bağlı Upstash komut maliyeti (`4 -> 0`), Serverless Function çağrı hacmi (`3 -> 1` ve statik `HIT`) ve Supabase Egress (`articles` `1 -> 0`) maliyeti düşürüldü.
  - **`04` — Ziyaret başına maliyet doğuran işlemleri bul (ve düşür):** `force-dynamic`, `headers()`, gizli `<Footer />` DB sorgusu ve bozuk `/api/track-event` çağrıları ortadan kaldırıldı (`revalidate` eksikliği olan `/rehber`, `/otel/[id]`, `sitemap.ts` ISR'a alındı).
- **Depodaki İlgili Regresyon Kapısı:** `scripts/verify_pilot_security.cjs` (**48/48 kontrol** — `auth`, `middleware`, `CSRF`, `payload` ve aday veri bütünlüğü) kesintisiz `48/48 Geçti` olarak korunmuştur.
