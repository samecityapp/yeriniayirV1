# PAKET 01 — YERİNİAYIR.COM YAYIN ÖNCESİ ALTYAPI DENETİMİ (01–04)

**Tarih:** 18 Kasım 2026  
**Kapsam:** Yalnızca salt okunur analiz ve raporlama (kod, veritabanı ve canlı dağıtım değiştirilmedi)  
**Hedef Senaryo:** ~1 milyon takipçili sosyal medya (Instagram) ağından eşzamanlı yüksek ziyaretçi trafiği öncesi altyapı, özellik, maliyet ve risk tespiti.

---

## 1. İncelenen Dal, Commit ve Ortamlar

- **GitHub Deposu:** `samecityapp/yeriniayirV1` (`/Users/erdems/Documents/Codex/yeriniayir-cloud-admin`)
- **Aktif Geliştirme Dalı (`HEAD`):** `feat/antigravity-production-readiness` — commit `3ba429661f29fefab490173da3570e8eff7dd585` (*"feat(gastronomy-ui): add 11 custom editorial SVGs for featured discovery regions"*, `2026-11-18T18:10:59Z`)
- **Canlı Production Dalı (`origin/main`):** commit `125c51108d5ef88f09baccf00dd044653b00e365` (*"style: force hero title to render on single line on mobile"*, `2026-05-30T11:06:08Z`) — Canlıda hâlâ **eski Otel platformu** çalışmaktadır; Gastronomi V3.7 / V5 kodu henüz `main` dalına birleştirilmemiştir.
- **Diğer Tespit Edilen Dallar:** `origin/feat/gorseller` (`6a1292c`), `origin/feat/pilot-moda-kadikoy-coffee` (`dbacf9c`), `origin/preview/design-lab-food-guide` (`b03d342`), yerel `feat/gastronomy-cloud-admin` (`c396946`).

| Ortam | URL / Host | Dağıtım / Commit | Bağlı Supabase Referansı | Gözlenen Durum |
|---|---|---|---|---|
| **Canlı Production (TR)** | `https://yeriniayir.com` -> `308` -> `https://www.yeriniayir.com/` | `yeriniayir-v1-6w534dp6w-erlich-bachmans-projects.vercel.app` (`125c51108d5e`) | `jerkkxwgddujigsbeqwo.supabase.co` | Eski Otel vitrini yayında; `x-vercel-cache: MISS`, `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` |
| **Canlı Production (EN)** | `https://worldandhotels.com` -> `308` -> `https://www.worldandhotels.com` | Aynı Production dağıtımı (`125c51108d5e`) | `jerkkxwgddujigsbeqwo.supabase.co` (ortak codebase) | Eski EN Otel vitrini yayında; `x-vercel-cache: MISS` |
| **Vercel Preview (Gastronomi V5)** | `https://yeriniayir-v1-k6rz5skzw-erlich-bachmans-projects.vercel.app` | Preview (`3ba429661f29`) | **Karışık:** İstemci `NEXT_PUBLIC_SUPABASE_URL` -> **`jerkkxwgddujigsbeqwo.supabase.co`** (canlı projeye işaret ediyor!); bulut gastronomi admini -> ayrı staging referansı (`401`) | Kök `/tr` sadece Gastronomi açıyor (`header_tags: 1`); `/tr/search` JS chunk'ı (`5649-b1165e7cc3d14393.js`) canlı Supabase URL'si taşıyor |
| **Supabase Bulut Staging (İzole)** | `vhptlecaixpawtxnhsde.supabase.co` (İrlanda, Free — `docs/CLOUD_ADMIN_READINESS.md:10`) | Staging bulut admin testleri için | `vhptlecaixpawtxnhsde` | `docs/CLOUD_ADMIN_READINESS.md:10-25` kaydına göre kurulu; çalışma zamanı panel erişimi yok |
| **Eski/Kalıntı Supabase Tanımı** | `aknhkpevrlpsrfxzqtop.supabase.co` | Kod içi görsel izin listesi | `next.config.js:18` | `images.remotePatterns` içinde hâlâ tanımlı |
| **Yerel Geliştirme (`.env.local`)** | `http://127.0.0.1` | Çalışma ağacı | `127.0.0.1` (dummy loopback) | `GASTRONOMY_LOCAL_PREVIEW=1`, `SUPABASE_SERVICE_ROLE_KEY` yok, Upstash env yok |

---

## 2. 01–04 Kontrol Sonuçları ve Kanıtlar

| Madde | Alt Kontrol | Durum | Özet Dayanak |
|---|---|---|---|
| **01** | Altyapı ve ortam eşleştirmesi | **Kaldı** *(İzolasyon kusurlu)* | Dallar/commitler/sürümler doğrulandı; ancak Vercel Preview canlı Supabase projesine bağlı + yetkisiz `service_role` Server Action mevcut |
| **02** | Sistemin özelliklerini çıkarma | **Kaldı** *(Aktif/ölü ayrıldı; kırık/açık uçlar var)* | 19 `route.ts` ve 4 Server Action çıkarıldı; yetkisiz Server Action, %100 hatalı `/api/track-event`, rate-limit bypass ve açık demo/eski rotalar tespit edildi |
| **03** | Mevcut maliyetleri inceleme | **Test edilemedi** *(Kısmi)* | Kullanılan servisler (Vercel, Supabase, Upstash, Places CLI, GA4/Clarity) kod/dokümandan doğrulandı; güncel fatura/kota kullanımı panel erişimi olmadığı için doğrulanamadı |
| **04** | Ziyaret başına maliyet doğuran işlemler | **Kaldı** *(Yüksek trafik darboğazı)* | `force-dynamic` + `headers()` sıfır CDN önbelleğine yol açıyor; Production'da görünmeyen Footer DB sorgusu + hatalı `POST /api/track-event` + statik SVG Edge Middleware çarpanı tetikleniyor |

---

### 01 — Altyapı ve Ortam Eşleştirmesi

- **01.1 GitHub dalları, güncel commit ve Vercel deployment tespiti — Geçti**
  - GitHub API (`/repos/samecityapp/yeriniayirV1/deployments`) sorgusunda Production (`125c51108d5e`) ve Preview (`3ba429661f29`) dağıtımları doğrulandı.
  - `www.yeriniayir.com` canlı yanıt başlıkları (`server: Vercel`) Vercel barındırmasını doğruladı.

- **01.2 Canlı domain, preview ve bağlı Supabase projelerinin eşleştirilmesi — Kaldı**
  - Canlı `https://www.yeriniayir.com/` HTML'inde preconnect hedefi olarak `https://jerkkxwgddujigsbeqwo.supabase.co` görünüyor (`app/[lang]/layout.tsx:113`).
  - Aktif Vercel Preview dağıtımı (`yeriniayir-v1-k6rz5skzw-erlich-bachmans-projects.vercel.app`) içindeki `/tr/search` istemci JS paketinde (`/_next/static/chunks/5649-b1165e7cc3d14393.js`) **`https://jerkkxwgddujigsbeqwo.supabase.co`** adresi derlenmiş durumda bulundu. Yani Preview'daki eski Otel rotaları doğrudan **canlı production Supabase projesine** bağlanıyor.
  - Buna karşılık Preview üzerindeki `/api/gastronomy-admin/session` çağrısı `401 {"authenticated":false}` döndürdü; bu da `lib/cloud/config.ts:9-15` içindeki zorunlu güvenlik kilidine (`ref === 'jerkkxwgddujigsbeqwo'` ise `GASTRONOMY_CLOUD_ENV === 'production' && GASTRONOMY_PRODUCTION_AUTHORIZED === '1'` şartı) göre Preview'da `GASTRONOMY_SUPABASE_*` env'lerinin ayrı staging projesine işaret ettiğini gösteriyor (`503` yerine `401` döndü).
  - **CORS tutarsızlığı:** `next.config.js:68-70` tüm yanıtlar için `Access-Control-Allow-Origin: https://yeriniayir.com` sabitlerken, canlı domain `308` ile `https://www.yeriniayir.com` adresine yönleniyor ve İngilizce domain (`https://www.worldandhotels.com`) dahil edilmiyor.

- **01.3 Test/Preview ortamının canlı veritabanına yazmadığının doğrulanması — Kaldı**
  - **Yerel ortam (`.env.local`) — Geçti:** `NEXT_PUBLIC_SUPABASE_URL` `127.0.0.1` loopback'e ayarlı, `SUPABASE_SERVICE_ROLE_KEY` tanımlı değil.
  - **Canlı RLS yazma kalkanı — Geçti (kısmi):** `docs/SUPABASE_ACTUAL_BACKUP_RLS_RESULTS.md:5-9` ve `supabase/operations/20261031_emergency_write_hold.sql` uyarınca 31.10.2026'da `jerkkxwgddujigsbeqwo` üzerindeki 13 public tablo ve `storage.objects` için `anon`/`authenticated` yazmalarını bloke eden **42 RESTRICTIVE** RLS politikası uygulanmıştır. Ayrıca Gastronomi V5 sayfalarında (`VERCEL_ENV === 'preview'`) `isLocalFoodPreview() === true` olduğu için `PageViewTracker` kapalıdır (`components/Providers.tsx:15`) ve gastronomi verisi depodaki statik JSON dosyalarından okunur.
  - **Kritik Risk — Kaldı:**
    1. Preview, `NEXT_PUBLIC_SUPABASE_URL` üzerinden canlı `jerkkxwgddujigsbeqwo` projesine bağlıdır.
    2. `app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts:11-109` içindeki `'use server'` Server Action'ları (`createOffer`, `updateOffer`, `deleteOffer`) **hiçbir oturum/yetki doğrulaması yapmadan** `lib/offers.ts:1` üzerinden `supabaseAdmin` (`lib/supabase-admin.ts:14`) istemcisini çağırır. `SUPABASE_SERVICE_ROLE_KEY` PostgreSQL RLS ve 42 RESTRICTIVE politikayı **tamamen bypass eder**; Server Action çağrıları kök sayfa (`/tr`) üzerinden `Next-Action` başlığıyla gönderildiğinde `middleware.ts:100`'deki `/jilinrime` korumasına da yakalanmaz! (`SUPABASE_SERVICE_ROLE_KEY`'in Vercel Preview kapsamına atanıp atanmadığı Vercel panel erişimi olmadan **Test edilemedi**.)

- **01.4 Kullanılan gerçek framework, paket ve altyapı sürümleri — Geçti**
  - `package.json` & `package-lock.json` doğrulaması:
    - Çalışma ortamı: Node.js `v24.11.1`, npm `11.6.2` (`package.json` içinde `"engines"` alanı yok — Vercel Node sürümü panelden teyit edilmeli).
    - Çekirdek: `next@15.5.28`, `react@18.3.1`, `react-dom@18.3.1`, `typescript@5.2.2`, `tailwindcss@3.3.3`, `postcss@8.5.32`, `eslint@8.57.1`.
    - Veri & Altyapı: `@supabase/supabase-js@2.86.0` (beyan `^2.58.0`), `@upstash/ratelimit@2.0.8`, `@upstash/redis@1.36.2`, `zod@4.6.7`, `lucide-react@^0.544.0`.
    - Çalışma zamanı Gastronomi V5 kodu tarafından kullanılmayan kurulu paketler: `openai@6.16.0`, `replicate@1.4.0`, `@google/genai@1.42.0`, `@google/generative-ai@0.24.1`, `@google-cloud/aiplatform@6.0.0`, `@google-cloud/vertexai@1.10.0`, `google-auth-library@10.5.0`, `leaflet@1.9.4`, `react-leaflet@4.2.1`, `jspdf@4.2.1`, `html2canvas@1.4.1`, `recharts@2.15.4`, `puppeteer@25.16.0` (dev), 27 adet `@radix-ui/*` paketi.

---

### 02 — Sistemin Özelliklerinin Çıkarılması

- **02.1 Ziyaretçi, editör ve yönetici özellikleri — Geçti**

| Rol / Katman | Özelliğin Durumu | Rotalar / Dosyalar | Çalışma Şekli & Not |
|---|---|---|---|
| **Ziyaretçi (Aktif V5 Gastronomi)** | **Aktif** | `/`, `/[lang]` (`app/[lang]/(main)/page.tsx`), `components/food/*`, `components/nearby-places/PremiumRestaurantCard.tsx`, `components/mobile-detail-variants/VariantABottomSheet.tsx` | 92 yayındaki + 1 `coming_soon` bölge (`lib/gastronomy-v3/registry.ts` + `regions/` içinde 93 JSON, `4.35 MB`, `2.277` mekan, `153` komşu öneri). İstemci içi filtreleme ve `history.pushState` kategori geçişi. |
| **Ziyaretçi GPS ("Konumumu Kullan")** | **Aktif ama Tarayıcıda Engelli** | `components/food/LocationPickerModal.tsx:91`, `next.config.js:115` | `navigator.geolocation.getCurrentPosition` çağrılır; ancak `next.config.js:115` yanıt başlığı **`Permissions-Policy: geolocation=()`** olduğu için modern tarayıcılarda her zaman izin reddine düşer. |
| **Ziyaretçi (Eski Otel / Rehber / Demo Rotaları)** | **Hâlâ Açık (Erişilebilir Legacy Kod)** | `/[lang]/search`, `/[lang]/otel-listesi`, `/[lang]/otel/[id]`, `/[lang]/rehber`, `/[lang]/rehber/[slug]`, `/[lang]/[slug]`, `/[lang]/hoteloffer*`, `/[lang]/hakkimizda`, legal sayfalar + korumasız `/[lang]/design-demo`, `/[lang]/preview-food-card`, `/[lang]/fethiye-yemek-rehberi` | Ana sayfadan otel sekmesi kaldırılsa da URL'den doğrudan açılırlar; `/[lang]/kullanim-kosullari` ve `kullanim-sartlari` mükerrerdir; `design-demo`, `preview-food-card`, `fethiye-yemek-rehberi` `(admin)` klasöründe olup Auth kontrolü ve `noindex` içermez. |
| **Editör / Yönetici 1 (Bulut Gastronomi Admini)** | **Staging'e Kurulu, V5 Vitrinden Bağımsız** | `/[lang]/gastronomi-yonetimi` (`panel.tsx`), `app/api/gastronomy-admin/*` | Supabase Auth + TOTP MFA (`aal2`) + `ya_is_admin` RPC. Ancak yalnızca `moda/kahve` kapsamına sabitlidir (`research/route.ts:4`, `workspace/route.ts:6`) ve V5 vitrin verisini beslemez. |
| **Editör / Yönetici 2 (Yerel Pilot Paneli)** | **Yerel/Basic Auth Korumalı** | `/[lang]/moda-kadikoy-pilot/*` (`page.tsx` + 8 `route.ts`) | `middleware.ts:43-58` `checkPilotAdmin` korumalı; yazma/araştırma uçları Vercel'de `403 Local development only` döner (`manage`, `products`, `research`). |
| **Editör / Yönetici 3 (Eski Otel/Restoran Admini)** | **Legacy Korumalı / Kısmen Kırık** | `/[lang]/jilinrime/*` (`layout.tsx` + 10 sayfa + `teklif-yonetimi/actions.ts`) | `middleware.ts:100-147` Basic Auth (sabit zamanlı olmayan `===`). Canlıda 42 RESTRICTIVE RLS kuralı nedeniyle çoğu `anon` yazma sayfası durmuştur; yalnız `teklif-yonetimi` `service_role` ile yazar ve Server Action'ı korumasızdır. |

- **02.2 Çalışan API Endpoint'leri (19 `route.ts` + 4 Server Action + 2 OG + Sitemap/RSS) — Kaldı**
  - `POST /api/track-event` (`app/api/track-event/route.ts`) — **Aktif ama Hatalı:** `PageViewTracker.tsx:26` her ziyarette `event_type: 'page_view'` ve `hotel_id: null` (otel dışı sayfalarda) gönderir; oysa Zod şeması (`route.ts:22-27`) `hotel_id` için zorunlu `uuid` ve `event_type` için `['view','click','booking_click','contact_click']` ister -> **%100 HTTP 400** (Upstash env eksikse `catch` ile **HTTP 500**).
  - `GET /api/go` (`app/api/go/route.ts`) — **Legacy Otel Redirect:** `hotel_clicks` tablosuna `anon` INSERT + `hotels` SELECT yapar; `middleware.ts:209` nedeniyle rate-limit bypass edilmiştir.
  - `GET /api/gastronomy-public` (`app/api/gastronomy-public/route.ts`) — **Ölü/Bağlanmamış:** `readCloudPublication` çağırır (`Cache-Control: no-store`), V5 ön yüzünden hiç çağrılmaz, rate-limit yok.
  - `/api/gastronomy-admin/{login,logout,session,workspace,publish,research,jobs}` (7 `route.ts`) — **Aktif (Bulut Admin):** MFA/oturum korumalı; ancak `logout/route.ts:7` `anon` istemciyle `client.auth.admin.signOut` çağırıp sessiz hataya düşer.
  - `/[lang]/moda-kadikoy-pilot/{auditor,decision,integration,manage,products,research,selection/data,selection/google}` (8 `route.ts`) — Basic Auth korumalı; yazma/araştırma Vercel'de `403`.
  - `GET /[lang]/feed.xml` (`app/[lang]/(main)/feed.xml/route.ts`) — Legacy makale RSS'i (`db.articles.getAll()`).
  - `teklif-yonetimi/actions.ts` (`getOffers`, `createOffer`, `updateOffer`, `deleteOffer`) — **Yetkisiz `service_role` Server Action (Kritik P0)**.
  - `/sitemap.xml` (`app/sitemap.ts`) ve `opengraph-image.tsx` (`otel/[id]`, `rehber/[slug]`) — Eski otel/makale şemasını tarar.

- **02.3 Arama, filtreleme, harita, görsel yükleme, formlar, cron ve AI işlemleri — Geçti**
  - **Arama & Filtreleme:** Gastronomi V5'te tamamen istemci bellek içi (`realProvider.ts`); eski `/[lang]/search` rotasında Supabase `hotels` sorgusu (`lib/db.ts:156`).
  - **Harita:** Gastronomi V5'te harita SDK/tile yüklemesi **yok** (yalnız dış link `https://maps.google.com/?cid=...`). Eski `/[lang]/otel/[id]` sayfasında `components/MapComponent.tsx:44` `leaflet` + `tile.openstreetmap.org` kullanır.
  - **Görsel Yükleme & Depolama:** Gastronomi V5'te yükleme **yok** (`public/images/gastronomy/*.svg`). Eski `lib/storage.ts` (`hotel-images`, `hotel-videos`) canlıda 42 RESTRICTIVE RLS nedeniyle engellidir.
  - **Formlar:** Ziyaretçi form POST'u **yok**. Yalnız yönetici tarafında login/sıralama/teklif/otel formları mevcut.
  - **Cron:** Vercel Cron (`vercel.json`) tanımlı **değil**. Yalnızca `supabase/proposed/20261101_publication_cron.sql` içinde staging için önerilen `pg_cron` (`*/5 * * * *`) betiği var; V5 statik JSON akışını etkilemez.
  - **AI & Dış Araştırma API'leri:** Ziyaretçi çalışma zamanında (`app/`, `components/`, `lib/`) `@google/genai`, `@google/generative-ai`, `openai`, `replicate`, `@google-cloud/vertexai` paketleri **hiç import edilmemektedir** (sıfır çalışma zamanı maliyeti). Google Places API (New) ve Tavily yalnızca çevrimdışı `scripts/` / yerel pilot CLI işlemlerinde kullanılır (`lib/pilot/googlePlaces/client.ts`, `lib/pilot/research/search/tavily.ts`).

---

### 03 — Mevcut Maliyetlerin İncelenmesi

- **03.1 Servis ve Maliyet Türü Envanteri — Geçti**

| Servis / Sağlayıcı | Kullanım Yeri | Maliyet Tipi | Doğrulanabilen Teknik Gerçek |
|---|---|---|---|
| **Vercel** | Production (`main`) + Preview (`feat/*`), Edge Middleware, SSR Serverless Functions, Origin Transfer | Sabit plan + Kullanıma bağlı (Transfer, Function Invocations, GB-Hrs, Edge Middleware) | `force-dynamic` yüzünden şu an her sayfa isteği `MISS` + Serverless SSR tetikliyor |
| **Supabase (Production `jerkkxwgddujigsbeqwo`)** | Eski Otel DB + Storage + Auth (`Footer` makale sorgusu + `hotels`) | Sabit plan (kullanıcı beyanına göre Pro: `docs/CLOUD_ADMIN_READINESS.md:10`) + Kullanıma bağlı Egress/Storage aşımı | 31.10.2026 envanteri (`docs/SUPABASE_FREE_CAPACITY.md:17-20`): DB `18.2 MB`, Storage `662.8 MB` (358 nesne) |
| **Supabase (Staging `vhptlecaixpawtxnhsde`)** | Bulut gastronomi admini testleri | Free plan (`docs/CLOUD_ADMIN_READINESS.md:10`) | Ayrı organizasyon/projede tutuluyor |
| **Upstash Redis** | `middleware.ts:13-23` + `app/api/track-event/route.ts:8-19` | Kullanıma bağlı (komut sayısı) | Kodda entegre; Production'da `/api/track-event` her ziyaret başına Redis komutu tüketebilir |
| **Google Cloud — Places API (New)** | Sadece çevrimdışı CLI (`scripts/discover_region_places.mjs`, `run_region_pipeline.mjs`) | Kullanıma bağlı (SKU kotası; çalışma zamanında `$0`) | `ENTERPRISE_FIELD_MASK` uygulanır; Atmosphere SKU alanları (`reviews` vb.) V3.7 kurallarıyla stripped |
| **GA4 & Microsoft Clarity** | `app/[lang]/layout.tsx:123-144` (`G-593PL85N6Q`, `G-E2Z6W3YXSM`, `ufxa278rg4`) | Ücretsiz katman (`$0`) | Preview'da (`localPreview === true`) kapalı; Production'da aktif |
| **Alan Adları** | `yeriniayir.com`, `worldandhotels.com` | Sabit yıllık yenileme | Her iki domain aynı Vercel projesine yönleniyor |

- **03.2 Mevcut Plan, Kota ve Güncel Dönem Tüketimi — Test edilemedi**
  - Vercel, Supabase, Upstash ve Google Cloud faturalandırma/kullanım panellerine ajan erişimi olmadığı için güncel aylık fatura tutarları ve kalan kotalar doğrulanamamıştır (varsayım/uydurma rakam yazılmamıştır; gereken ekranlar Bölüm 5'tedir).

---

### 04 — Ziyaret Başına Maliyet Doğuran İşlemlerin Haritası

| Ziyaretçi Aşaması | Vercel Preview (Bugün) | Canlı Production (`VERCEL_ENV=production` Olursa) | Ziyaret Başına Maliyet & Teknik Neden |
|---|---|---|---|
| **1. Instagram'dan `/`, `/tr` veya `/tr?region=moda` Açılışı** | • 1 Edge Middleware<br>• 1 SSR Function (`x-vercel-cache: MISS`, `~222 KB` ham HTML)<br>• **0** Supabase sorgusu<br>• **0** `/api/track-event`<br>• **6–11** Edge Middleware çağrısı (statik `.svg` dosyaları için!) | • 1 Edge Middleware<br>• 1 SSR Function (`MISS`, `~222 KB` HTML)<br>• **1 Supabase `articles` sorgusu** (görünmeyen `<Footer />` için!)<br>• **1 `POST /api/track-event`** Serverless + Upstash komutu (**%100 `400`/`500` hata!**)<br>• **GA4 + Clarity** istemci yükü (onaysız)<br>• **6–11** Edge Middleware çağrısı (`.svg` + `.woff2` için) | `page.tsx:8` `force-dynamic`, `localPreview.ts:33` `headers()`, `layout.tsx:18-25` koşulsuz `<Footer />`, `Providers.tsx:15` `PageViewTracker`, `middleware.ts:214` geniş matcher |
| **2. Konum Modalından Bölge Değişimi (`?region=karakoy`)** | • `router.push` ile yeni **1 SSR Function** + RSC payload<br>• **0** Supabase sorgusu | • **1 SSR Function** (`force-dynamic` `MISS`)<br>• **1 `POST /api/track-event` + 1 Upstash** (**%100 `400`/`500`**)<br>• `<Footer />` `layout.tsx` tekrar **1 Supabase `articles` sorgusu** | Tam sayfa sunucu yeniden çizimi (halbuki tüm 92 bölgenin JSON verisi statik) |
| **3. Kategori Değişimi (`?category=pizza`)** | • **0** sunucu çağrısı<br>• **0** DB sorgusu<br>• Yeni kategori SVG'si Edge Middleware'e düşebilir (`max-age=86400`) | • İstemcide **0** SSR/DB; ancak `useSearchParams` / `history.pushState` tetiklemezse ekstra SSR yok (**DİKKAT:** `window.history.pushState` `useSearchParams()`'i güncellerse `PageViewTracker` effect'i (`PageViewTracker.tsx:44`) tekrar tetiklenip **1 ekstra `POST /api/track-event`** atar!) | `GastronomyPageClient.tsx:735` + `PageViewTracker.tsx:44` |
| **4. Mekan Detay Modalı + "Google Haritalar'da Konumu Gör"** | • **0** sunucu, **0** DB, **0** Places API | • **0** sunucu, **0** DB, **0** Places API (`maps.google.com/?cid=...` harici yönlendirme) | Sıfır maliyetli, ideal akış |
| **5. Arama Botları (`/sitemap.xml`, `/tr/feed.xml`)** | • Her istekte **1 Serverless Function + 2 Supabase sorgusu** (`SELECT * FROM hotels` + `SELECT * FROM articles`) | • Aynı şekilde önbelleksiz tüm `hotels` + tüm `articles` tablo taraması | `app/sitemap.ts:11,31` ve `app/[lang]/(main)/feed.xml/route.ts:7` |

#### Yüksek Trafik Projeksiyonu (Ölçülen Veri Hacmine Dayalı — Fiyat Uydurmasız): **100.000 Instagram Ziyaretçisi** *(Ortalama 1 giriş + 2 bölge geçişi = 300.000 sayfa görüntüleme varsayımıyla)*
- **Mevcut `force-dynamic` + Production Davranışı ile:**
  - `~300.000` SSR Serverless Function çalıştırması (`x-vercel-cache: MISS`),
  - `~66,6 GB` sıkıştırılmamış ham HTML origin çıktısı (her SSR yanıtta `~222 KB`),
  - `~300.000` **gereksiz Supabase `articles` SELECT** sorgusu (ekranda gizlenen `<Footer />` için!),
  - `~300.000–600.000` **hatalı (`400`/`500`) `POST /api/track-event`** Serverless çalıştırması + Upstash Redis komutu + Runtime Error logu,
  - `~1.000.000+` **Edge Middleware çağrısı** (kapsam dışı bırakılmamış `/images/gastronomy/*.svg` ve font istekleri dahil!).
- **Önbellekli Statik/ISR + Temizlik Sonrası Beklenen Etki:** SSR invocation ve Supabase sayfa sorgusu **%99+ oranında düşerek yalnızca CDN hit'ine** iner; statik dosya Edge Middleware çağrısı **0'a** iner.

---

## 3. Kritik Riskler (Önem Derecesine Göre Sıralı)

1. **`[P0 — KRİTİK]` Kimlik Doğrulamasız `service_role` Server Action ile Canlı DB Yazma/Silme ve SSRF:** `app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts:11-109` + `lib/offers.ts:1`. Herhangi bir kimlik kontrolü yoktur; `/tr` üzerinden `Next-Action` ile tetiklenerek `middleware.ts:100` engelini aşar, canlı `offers` tablosunda tüm RLS politikalarını bypass eder ve `actions.ts:46-47` doğrulanmamış `slug` ile sunucu taraflı HTTP `fetch` yapar.
2. **`[P0 — KRİTİK]` `force-dynamic` + `await headers()` Nedeniyle Sıfır CDN Önbelleği ve `~222 KB` Şişmiş HTML:** `app/[lang]/(main)/page.tsx:8`, `lib/food/localPreview.ts:33`. Instagram'dan aynı anda gelecek binlerce kullanıcıyı CDN yerine her istekte Serverless SSR fonksiyonuna yönlendirir.
3. **`[P1 — YÜKSEK]` Production'a Geçişte Gizli `isLocalFoodPreview()` Yan Etkileri (`Footer` DB Sorgusu + Bozuk `PageViewTracker`):** `lib/food/localPreview.ts:17-19` `VERCEL_ENV === 'production'` altında `false` döner; böylece `Footer.tsx:11` görünmeyen alt bilgi için her ziyarette Supabase'e sorgu atar ve `PageViewTracker.tsx:26` şema uyumsuzluğu yüzünden her sayfada `400`/`500` üretir.
4. **`[P1 — YÜKSEK]` `middleware.ts` `/api/*` Rate-Limit Bypass Hatası ve Statik Dosyalarda Edge Middleware Çarpanı:** `middleware.ts:209-210` tüm `/api/` uçlarında `ratelimit.limit()` bloğunu atlar; `middleware.ts:214` matcher'ı `.svg`/`.woff2` dosyalarını dışlamadığı için her sayfa görseli Edge Middleware kotasını tüketir.
5. **`[P1 — YÜKSEK]` Vercel Preview Ortamının Canlı Supabase Projesine (`jerkkxwgddujigsbeqwo`) Bağlı Olması:** Preview JS chunk'ı doğrulaması (`5649-b1165e7cc3d14393.js`). Test ortamı ile canlı DB izolasyonu sağlanmamıştır.
6. **`[P1 — YÜKSEK]` "Konumumu Kullan" Özelliğinin Güvenlik Başlığıyla Tarayıcıda Engellenmesi:** `next.config.js:115` (`Permissions-Policy: geolocation=()`) başlığı `LocationPickerModal.tsx:91` GPS konum bulma butonunu tüm ziyaretçilerde çalışmaz hale getirir.
7. **`[P2 — ORTA]` Açık Legacy/Demo Sayfaları, `noindex` Eksikleri ve Sitemap/Robots Uyumsuzluğu:** `/[lang]/design-demo`, `/[lang]/preview-food-card`, `/[lang]/fethiye-yemek-rehberi` herkesçe erişilebilir ve indekslenebilir durumdadır; `/otel/*`, `/search`, `/rehber/*`, `/hoteloffer*` hâlâ aktiftir; `app/sitemap.ts` yalnız eski otel/makale URL'leri üretip tam tablo sorgusu atar; `app/robots.ts:8` `/tr/jilinrime/` desenini kapsamaz.
8. **`[P2 — ORTA]` KVKK/GDPR Onayı Öncesi GA4/Clarity Yüklenmesi & CORS Başlığı Uyumsuzluğu:** `app/[lang]/layout.tsx:123-144` rıza beklemeden izleme başlatır; `next.config.js:70` yalnızca `https://yeriniayir.com` döndürüp `www.yeriniayir.com` ve `www.worldandhotels.com` domainlerini kapsamaz.
9. **`[P2 — ORTA]` `/jilinrime` Basic Auth Sabit Zamanlı Olmayan Parola Karşılaştırması & `logout` Hatası:** `middleware.ts:121` (`pwd === expectedPassword`); `app/api/gastronomy-admin/logout/route.ts:7` (yetkisiz `auth.admin.signOut`).
10. **`[DÜŞÜK — P3]` Sunucu Bellek Ayak İzi & Kullanılmayan Bağımlılıklar:** `lib/gastronomy-v3/registry.ts` (4.35 MB JSON tek modülde) + `lib/pilot/integration/discovery.ts` (6.145 satır eski dizi) ve runtime'da kullanılmayan AI/PDF/harita paketleri (`package.json`).

---

## 4. Doğrulanamayan Noktalar ve Gereken Erişimler

Aşağıdaki kalemler hesap panellerine erişim olmadığı için **Test edilemedi** olarak bırakılmıştır. Denetimin tamamlanması için yalnız okuma amaçlı aşağıdaki ekranların (gizli anahtarlar/değerler kapalı şekilde) paylaşılması gerekir:

1. **Vercel Dashboard -> Project Settings -> General / Billing & Usage (Son 30 Gün):**
   - Aktif plan (Hobby mi Pro mu — eşzamanlılık ve ticari trafik kotası açısından kritik), Node.js Runtime sürümü, Fast Origin Transfer, Edge Middleware Invocations ve Serverless Function kullanım grafikleri.
2. **Vercel Dashboard -> Project Settings -> Environment Variables *(Değerler KESİNLİKLE maskeli/kapalı — yalnız değişken adı ve Environment Scope `[Production / Preview / Development]` listesi)*:**
   - Özellikle `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ADMIN_PASSWORD`, `GASTRONOMY_SUPABASE_*`, `APP_ENVIRONMENT` kapsamları.
3. **Supabase Dashboard (`jerkkxwgddujigsbeqwo` ve `vhptlecaixpawtxnhsde`) -> Settings -> Billing & Usage:**
   - Plan türü, Spend Cap durumu, güncel dönem Egress / Database / Storage kullanım sayaçları ve 31.10.2026 tarihli 42 RESTRICTIVE engelin hâlâ aktif olduğunun teyidi.
4. **Upstash Console -> Redis Database / Billing:**
   - Production'da aktif bir Upstash veritabanı bulunup bulunmadığı, plan limiti (günlük/aylık komut kotası) ve rate-limiter'ın `fail-open` (`middleware.ts:94`) moduna düşüp düşmediği.
5. **Google Cloud Console -> APIs & Services -> Credentials & Billing:**
   - `GOOGLE_PLACES_API_KEY` için IP/API kısıtlarının ve aylık bütçe uyarısının doğrulanması.

---

## 5. Öncelik Sırasına Göre Düzeltme Önerileri (Sonraki Paketler İçin Yol Haritası)

1. **`[P0]` Yetkisiz `service_role` Server Action Kapatma & Preview İzolasyonu:** `app/[lang]/(admin)/jilinrime/teklif-yonetimi/actions.ts` yazma aksiyonlarına sunucu tarafında `checkPilotAdmin` / kimlik doğrulaması ekle (veya teklif yönetimi kullanılmıyorsa devre dışı bırak); `slug` SSRF `fetch`'ini kaldır; Vercel Preview `NEXT_PUBLIC_SUPABASE_URL` değerini canlı projeden ayır.
2. **`[P0]` Gastronomi Vitrinini Statik/ISR CDN Önbelleğine Alma:** `app/[lang]/(main)/page.tsx` üzerinden `force-dynamic` ve koşulsuz `await headers()` (`isLocalFoodPreview()`) çağrısını kaldırarak gastronomi sayfalarının Vercel Edge CDN'de önbelleklenmesini sağla; bölge seçilmemiş `/tr` ana sayfasında gereksiz Moda mekan verisinin serileştirilmesini kes (`~222 KB` -> minimal HTML/payload).
3. **`[P1]` `isLocalFoodPreview()` Production Geçiş Temizliği:** Kök gastronomi rotasında görünmeyen `<Footer />` sunucu sorgusunu (`db.articles.getLatest`) tamamen durdur; `PageViewTracker` -> `/api/track-event` kırık çağrısını gastronomi sayfalarından kaldır veya şemaya uygun toplu/önbellekli analitiğe taşı.
4. **`[P1]` `middleware.ts` ve `Permissions-Policy` Düzeltmesi:** `middleware.ts:214` `matcher`'ına `svg|woff2|png|jpg|jpeg|webp|robots\.txt|sitemap\.xml` istisnası ekleyerek Edge Middleware çağrılarını ~%85 azalt; `middleware.ts:209` `/api/` rate-limit bypass hatasını düzelt ve Basic Auth karşılaştırmasını `timingSafeEqual` yap; `next.config.js:115` içinde `geolocation=(self)` ile konum butonunu aç.
5. **`[P2]` Yayın Yüzeyi Sıkılaştırma, KVKK & CORS:** Eski otel/demo/test sayfalarını (`/design-demo`, `/preview-food-card`, `/fethiye-yemek-rehberi` ve gastronomi dışı alt rotaları) kapat veya `noindex` + koruma altına al; `app/sitemap.ts`'i V5 gastronomi bölgeleriyle güncelle (`revalidate` ile); GA4/Clarity için KVKK rıza kapısı (Consent Mode varsayılan `denied`) ekle; `next.config.js` CORS başlığını `www.yeriniayir.com` ve `www.worldandhotels.com` ile uyumlu hale getir.
