# PAKET 05 — API GÜVENLİĞİ, MIDDLEWARE OPTİMİZASYONU VE MOBİL FONKSİYONLAR

**Tarih:** 19 Kasım 2026  
**Taban Commit (`feat/paket-04-rc-integration`):** `a4d73e2d44bfdbb106c370387bdc3ad34a3e93c8`  
**Çalışma Dalı:** `feat/paket-05-api-middleware-mobile`  
**Uygulama Commit SHA (`36` kod/test dosyası):** `5e7f0cb0b791abb071ce552f73c9cc47cb6cd8dd`  
**İzole Çalışma Ağacı:** `/Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile`  
**İlgili Kontrol Maddeleri:** `11, 12, 13, 20, 21, 23`

> **Genel Karar Özeti:**
> - **Yerel Kod ve Otomatik Doğrulama (`13/13` Kapı):** **GEÇTİ** — Paket 05 kapsamındaki tüm kod ve test kapıları (`scan-secrets`, `policy-tests`, PostgreSQL 17.11 `verify_rls_security`, `verify_pilot_security`, `verify_staging_preflight`, `verify_v3_gastronomy`, `verify_visitor_content`, `tsc --noEmit`, `npm run build`, `verify_secret_leakage`, `verify_p0_security_fixes`, `verify_paket03_perf_and_analytics`, `verify_paket05_api_middleware_mobile`) son kod üzerinde kesintisiz `exit 0` verdi.
> - **Yayın Öncesi Genel Operasyonel Karar:** **ŞARTLI GEÇTİ** — Fiziksel iOS/Android cihazlarda native konum izni diyaloğu, donanım GPS/Wi-Fi triangülasyonu, yüklü Google Maps / Apple Maps uygulamasına Universal Link geçişi ile canlı Vercel Edge/Upstash sayaçları yerel ortamdan doğrulanamaz (**`Test edilemedi`**). Ek olarak [PAKET_04_GUVENLIK_PERFORMANS_ENTEGRASYONU.md](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/docs/audits/PAKET_04_GUVENLIK_PERFORMANS_ENTEGRASYONU.md) içinde belirtilen `origin/main` maruz Google anahtar iptali ile Vercel/Supabase ortam ayrımı ön koşulları geçerliliğini korur. `main` dalına dokunulmamış, `git push` ve canlı production dağıtımı yapılmamıştır.

---

## 1. Aktif API Endpoint'leri ve Server Action Envanteri (`20 Route Handler` + `3 Server Action` + `3 Metadata Route`)

Depoda `app/` altında taranan tüm `route.ts` uçları (`20` adet), Next.js metadata uçları (`3` adet) ve admin Server Action'ları (`3` adet) sınıf, yöntem, önbellek, hız sınırı katmanı, girdi doğrulama ve zaman aşımı politikalarıyla aşağıda listelenmiştir:

| # | Yol / İşlem | Sınıf | HTTP Yöntemleri | Önbellek / Çalışma Biçimi | Hız Sınırı Katmanı | Girdi Sınırı & Zaman Aşımı |
|---|---|---|---|---|---|---|
| 1 | [regions/\[slug\]/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy/regions/%5Bslug%5D/route.ts) | Ziyaretçi Statik CDN | `GET`, `HEAD` | `force-static`, `dynamicParams = false`, `revalidate = 3600`, `92` SSG yolu | Edge'de yalnızca yöntem (`405`), **`0` Upstash komutu** | Bilinmeyen slug derlemede/üretimde reddedilir |
| 2 | [track-event/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/track-event/route.ts) | Ziyaretçi Dinamik Analitik | `POST` | `no-store, max-age=0` | Edge Katman-1 kalkanı + route içi Katman-1 + Upstash (`visitor_analytics`: `10/10s` cihaz, `120/10s` IP) | Maks. `2048` byte JSON, Zod `eventSchema`, `60s` view tekilleştirme, Upstash `1500ms`, DB `4000ms` |
| 3 | [go/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/go/route.ts) | Ziyaretçi Dinamik Yönlendirme | `GET`, `HEAD` | `force-dynamic`, `private, no-store, max-age=0` | Edge Katman-1 (`visitor_redirect`) + Upstash (`30/10s` cihaz, `150/10s` IP; kesintide `20/10s`, `100/10s` IP) | URL ≤ `512`, Upstash/DB öncesi katı UUID doğrulama (`400`), yalnızca `http`/`https` hedef, DB `4000ms` |
| 4 | [gastronomy-public/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-public/route.ts) | Ziyaretçi Dinamik Okuma | `GET`, `HEAD` | `no-store` (`unstable_cache` arkası) | Edge Katman-1 (`visitor_public`) + Upstash (`30/10s` cihaz, `150/10s` IP) | URL ≤ `512`, `SCOPE_REGEX` + yayınlı bölge doğrulaması (`getPublishedV3Snapshot`) öncesi `400` (`0` DB/Upstash) |
| 5 | [feed.xml/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/%5Blang%5D/(main)/feed.xml/route.ts) | Ziyaretçi RSS Akışı | `GET` | `revalidate = 3600`, `public, s-maxage=3600, stale-while-revalidate=7200` (build çıktısı `ƒ`) | Genel sayfa / RSS akışı | `isSupabaseIsolated` kısa devre; `db.articles.getAll()` `50` kayıt tavanı, Supabase `8000ms` fetch timeout |
| 6 | [gastronomy-admin/login/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/login/route.ts) | Yönetici Kimlik / MFA | `POST` | `private, no-store, max-age=0`, `noindex` | `admin_auth` (MW + Handler: `8/60s` IP; **Upstash kesintisinde `3/60s` IP, `6/60s` global**; `block` kipinde `503`) | `sameOrigin` CSRF, ≤ `2000` byte, Zod strict `login`/`verify`, süreç içi ikincil `10/10dk` koruma |
| 7 | [gastronomy-admin/logout/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/logout/route.ts) | Yönetici Oturum | `POST` | `private, no-store, max-age=0` | `admin_read` (MW + Handler: `30/60s` IP; kesintide `10/60s` IP, `20/60s` global) | `sameOrigin` CSRF + çerez temizliği |
| 8 | [gastronomy-admin/session/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/session/route.ts) | Yönetici Okuma | `GET`, `HEAD` | `private, no-store, max-age=0` | `admin_read` (MW + Handler) | Supabase Cloud JWT `aal2` doğrulaması |
| 9 | [gastronomy-admin/workspace/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/workspace/route.ts) | Yönetici Okuma | `GET`, `HEAD` | `private, no-store, max-age=0` | `admin_read` (MW + Handler) | `cloudAdmin()` `aal2` + `ya_admin_workspace` RPC |
| 10 | [gastronomy-admin/jobs/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/jobs/route.ts) | Yönetici Okuma | `GET`, `HEAD` | `private, no-store, max-age=0` | `admin_read` (MW + Handler) | `cloudAdmin()` `aal2` + `MAX_JOB_HISTORY = 50` dilim sınırı |
| 11 | [gastronomy-admin/publish/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/publish/route.ts) | Maliyetli Yönetici Yazma | `POST` | `private, no-store, max-age=0` | `costly_admin` (MW + Handler: `12/60s` IP; **kesintide `3/60s` IP, `6/60s` global**; `block` kipinde `503`) | `sameOrigin`, `cloudAdmin()`, ≤ `12_000` byte, Zod `publicationChange`, ISR `revalidatePath`/`Tag` |
| 12 | [gastronomy-admin/research/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/research/route.ts) | Maliyetli Yönetici Arşiv | `GET`, `HEAD` | `private, no-store, max-age=0` | `costly_admin` (MW + Handler) | `cloudAdmin()` `aal2` + `ya_admin_archive` RPC |
| 13–20 | `app/[lang]/(admin)/moda-kadikoy-pilot/{auditor,decision,integration,manage,products,research,selection/data,selection/google}/route.ts` (`8` uç) | Pilot Yönetici / Yerel Araçlar | Okuma (`GET`), Yazma (`POST`: `auditor`, `decision`, `manage`, `research`, `selection/google`) | `private, no-store, max-age=0`, `noindex` | MW üzerinde `costly_admin` (`POST` ve `research`/`manage`/`auditor`/`decision`) veya `admin_panel` (`25/60s` IP) | Her handler içinde ayrıca `checkPilotAdmin()` + CSRF/Origin + yerel/test ortam kilitleri (`selection/*` Vercel/prod'da `403`) |
| SA 1–3 | [actions.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/%5Blang%5D/(admin)/jilinrime/teklif-yonetimi/actions.ts) (`createOffer`, `updateOffer`, `deleteOffer`) | Maliyetli Yönetici Server Action | Next `POST` Server Action | `private, no-store` | `authorizeAndRateLimitOfferAction()` → `costly_admin` (`12/60s` IP; **kesintide `3/60s` IP, `6/60s` global**) | `requireOfferAdminAccess({ requireSameOrigin: true })` (`aal2` + hedef capability) + Zod `offerSchema` + `UUID_RE` + eski/yeni slug revalidasyonu |
| Meta 1–3 | [robots.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/robots.ts), [sitemap.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/sitemap.ts), [manifest.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/manifest.ts) | Statik / ISR Metadata | `GET` | `/robots.txt` & `/manifest.webmanifest` statik, `/sitemap.xml` `revalidate = 3600` (`●`) | `config.matcher` dışı (**`0` Middleware çağrısı**) | `robots.ts` `/jilinrime/` ve `/api/` dizinlerini taramaya kapatır; `sitemap.ts` `db.hotels.getAll()` `100` sınırıyla okur |

---

## 2. Tespit Edilen Sorunlar (Taban `a4d73e2` Kanıtlarıyla)

1. **`/api/` Yollarında Tam Rate-Limit ve Koruma Atlama Açığı (`a4d73e2` [middleware.ts:273-274](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/middleware.ts)):** `a4d73e2` sürümünde `const api = pathname === '/api' || pathname.startsWith('/api/'); const response = api ? NextResponse.next() : await applicationMiddleware(request);` satırı nedeniyle tüm `/api/*` istekleri rate-limit ve yönetici koruma katmanını baypas ederek doğrudan `NextResponse.next()` alıyordu.
2. **Eager Redis / Upstash Başlatma ve Kesintide Sınırsız Fail-Open (`a4d73e2` `middleware.ts:12-22, 190`):** Modül yüklenirken `new Redis(...)` + `new Ratelimit({ ..., analytics: true })` çalışıyor, yalnızca `isJilinrime` yolları sınırlanıyor ve Upstash hata/zaman aşımında `catch` bloğu sınırsız fail-open davranıyordu (`Rate Limiting Error (Fail Open)`). Aynı şekilde `/api/gastronomy-admin/*` uçlarında ve `teklif-yonetimi/actions.ts` Server Action'larında dağıtık rate-limit yoktu.
3. **Yüzdeli Kodlanmış (Percent-Encoded) Yönetici Rota Atlatma Açığı:** `new NextRequest('.../tr/%6a%69%6c%69%6e%72%69%6d%65').nextUrl.pathname` ifadesi `%6a...` kodlamasını çözmeden bıraktığı için `a4d73e2` içindeki `hasProtectedSegment(pathname, 'jilinrime')` kontrolü `false` dönüyor, ancak alt katmandaki Next.js App Router yolu `/tr/jilinrime` olarak çözüp sayfayı sunabiliyordu (`middleware.ts` üzerinde doğrudan doğrulanmış gerçek atlatma).
4. **Statik Varlıkların Edge Middleware Tüketimi (`a4d73e2` `middleware.ts:283`):** `matcher: ['/((?!_next/static|favicon.ico).*)']` yalnızca `_next/static` ve `favicon.ico` yollarını hariç tuttuğundan `/images/gastronomy/*.svg`, `/fonts/*.woff2`, `/images/articles/*.jpg`, `/authors/*.png`, `/restaurants/*.png`, `robots.txt`, `sitemap.xml` ve `manifest.webmanifest` her cache-miss'te Edge Middleware çalıştırıyordu.
5. **Maliyet Büyütme (Bill Amplification) ve Girdi/Zaman Aşımı Açıkları:**
   - `/api/go` (`a4d73e2` `go/route.ts:10-58`) rastgele/geçersiz `hotelId` için `supabase.from('hotel_clicks').insert` + `supabase.from('hotels').select` sorgusu atıyor, ham ziyaretçi IP'sini kaydediyor, hedef URL protokolünü doğrulamıyor ve DB sorgusunda zaman aşımı uygulamıyordu.
   - `/api/gastronomy-public` geçersiz `scope` değerlerinde dahi `readCloudPublication()` RPC çağrısı başlatıyordu.
   - `/api/gastronomy/regions/[slug]` içinde `dynamicParams = false` eksikti; `/[lang]/feed.xml` üzerinde `revalidate = 3600` ve `isSupabaseIsolated` kısa devresi yoktu.
   - `lib/db.ts` (`getAll`, `search`, `getByTag`, `getByPriceRange`, `articles.getAll`) ve `lib/offers.ts` (`getAll`) `.limit(...)` olmadan sorgu atıyordu; `lib/supabase.ts` ve `lib/supabase-admin.ts` istemcilerinde `fetch` zaman aşımı yoktu.
   - `SearchFilters.tsx` ve `SearchClient.tsx` ayrı ayrı `hotels`, `tags`, `price_tags` sorguları atıyor (`6` sorgu), [SearchClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/%5Blang%5D/(main)/search/SearchClient.tsx) bozuk `%` query'de (`?q=%E0%A4%A`) `decodeURIComponent` üzerinden `URIError` fırlatabiliyor ve tüm sonuçları sayfalama olmadan render ediyordu.
   - [GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/food/GastronomyPageClient.tsx) `fetchRegionPayload` isteğinde `AbortController` zaman aşımı kullanmıyordu; aynı sekmeye/bölgeye tıklamada gereksiz `history.pushState` yapabiliyor ve `utm_*`/`fbclid` query parametrelerini düşürebiliyordu.
6. **GPS ve Yol Tarifi Engelleri (`a4d73e2` [next.config.js:149-151](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/next.config.js) & [LocationPickerModal.tsx:96-129](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/food/LocationPickerModal.tsx)):**
   - `next.config.js` içindeki `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()` başlığı `Konumumu Kullan` özelliğini tarayıcı başlığı düzeyinde tamamen blokluyordu.
   - `92` yayınlı V3 bölgesinden **`33` bölgenin** sınır köşeleri merkez noktadan `4.000 m`'den daha uzaktı (en büyükler: `kusadasi` `19.606 m`, `foca` `19.206 m`, `bursa-merkez` `16.927 m`, `mersin` `14.596 m`, `hatay` `13.202 m`). Eski merkez-odaklı kontrol bu bölgelerin dış mahallelerindeki kullanıcıları reddediyordu; ayrıca `timeout: 8000` iç mekan mobil GPS ediniminde zaman aşımı riski taşıyordu.
   - [LocationCard.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/hotel/LocationCard.tsx) `(0,0)` koordinatlarını reddetmiyor ve [HotelDetails.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/HotelDetails.tsx) harici `googleMapsUrl` host'unu doğrulamıyordu. [VariantABottomSheet.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/mobile-detail-variants/VariantABottomSheet.tsx) tekilleştirilmiş CID/konum doğrulama yardımcısı yerine ham bir URL çözümü kullanıyordu.

---

## 3. Uygulanan Düzeltmeler ve Mimari Sertleştirme

### A. Katmanlı API Güvenliği, CGNAT Uyumu ve Upstash Kesinti Koruması ([rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/pilot/rateLimit.ts))
- **`analytics: false` & Tembel (Lazy) Upstash İstemcisi:** Sabit global `new Redis(...)` kaldırıldı; istemciler yalnızca ortam değişkenleri geçerliyse önbellekli oluşturulur ve Upstash Analytics kapalı (`analytics: false`) tutularak gereksiz Redis komutu üretilmez. Her uzak çağrı `UPSTASH_TIMEOUT_MS = 1500` ms ile sınırlıdır.
- **Katman-1 Sıfır-Maliyet Bellek Kalkanı (`MAX_MEMORY_BUCKETS = 4096`):** Aynı cihaz veya flood kaynağı limiti aştığında istek Upstash'a gitmeden `429 memory-l1` (`Retry-After`, `no-store`) ile kesilir.
- **Instagram Story CGNAT Adaleti:** Ziyaretçi katmanları (`visitor_analytics`, `visitor_redirect`, `visitor_public`) `buildVisitorClientKey` ile günlük dönen SHA-256 `(IP + User-Agent + Accept-Language)` cihaz parmak izi üzerinden sınırlandırılır; aynı mobil taşıyıcı NAT IP'sini (`198.51.100.77` vb.) paylaşan farklı telefonlar kendi cihaz kotasından değerlendirilirken ham IP tavanı (`120–150/10s`) kaba DDoS taşmalarını keser.
- **Upstash Kesintisinde Devre Kesici (Circuit Breaker):** `admin_auth` ve `costly_admin` kritik katmanlarında Upstash erişilemez olduğunda sistem asla sınırsız fail-open olmaz: varsayılan `emergency-fallback` kipinde IP başına **`3/60s`** ve global **`6/60s`** sınır uygulanır (tek bir saldırgan IP'nin küresel yönetici kotasını tüketmesini önlemek için per-IP kontrolü `outageGlobal`'den önce çalışır). İstenirse `RATE_LIMIT_CRITICAL_OUTAGE_MODE=block` tanımlanarak Upstash kesintisinde doğrudan **`503 Service Unavailable`** (`outage-blocked`) zorlanabilir.
- **Uçlara Bağlama:** [login](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/login/route.ts), [logout](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/logout/route.ts), [session](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/session/route.ts), [workspace](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/workspace/route.ts), [jobs](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/jobs/route.ts), [publish](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/publish/route.ts), [research](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/research/route.ts), [go](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/go/route.ts), [gastronomy-public](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-public/route.ts), [track-event](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/track-event/route.ts) ve [actions.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/%5Blang%5D/(admin)/jilinrime/teklif-yonetimi/actions.ts) katmanlı hız sınırı, URL uzunluğu / payload boyut sınırı, erken `400` doğrulama (`0` Upstash/DB maliyeti) ve `4000 ms` DB zaman aşımıyla donatıldı.

### B. Middleware Sertleştirme, Atlama Kapatma ve Statik Varlık Optimizasyonu ([middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/middleware.ts))
- **İstek Yolu Normalizasyonu & Anomali Reddi (`MAX_URL_LENGTH = 2048`):** `414 URI Too Long`, `\0` / `\` / bozuk `%` / `.` ve `..` segment traversal reddi (`400`), `2` turlu `decodeURIComponent` sonrası kanonik segment incelemesi ve `%`-kodlu / çift slash (`//`) / büyük-küçük harf karma (`/tr/JILINRIME`, `/tr/%6a%69%6c%69%6e%72%69%6d%65`, `/%61%70%69/...`) denemelerine yetkili oturumda bile `400 Bad Request` (`private, no-store, noindex`) uygular.
- **Merkezi `/api/*` Yönlendiricisi (`handleApiMiddleware`):** Bilinmeyen `/api/*` uçlarına `404`, geçersiz HTTP yöntemlerine `405 Allow`, `/api/gastronomy/regions/[slug]` statik bölge uçlarına **sıfır Upstash komutuyla** doğrudan geçiş, diğer API uçlarına da `edge-shield` / `upstash` katman politikalarını uygular.
- **Statik Varlık Matcher Hariç Tutma (`config.matcher`):** `_next/static/`, `/fonts/*.{woff2,ttf,txt}`, `/images/*.{svg,png,jpg,jpeg,webp,avif,gif}`, `/authors/*.png`, `/restaurants/*.png`, kök simgeler, `manifest.webmanifest`, `robots.txt` ve `sitemap.xml` **içlerinde `..` veya `%` yoksa** middleware çalıştırmaz; traversal veya yüzde-kodlu atlatma içeren yollar (`negative lookahead` içindeki `(?!.*(?:\.\.|%))`) yakalanarak middleware'de `400`/`401` ile durdurulur.

### C. Veritabanı, Arama ve İstemci Önbellek İyileştirmeleri
- **[supabase-env-guard.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/supabase-env-guard.ts), [supabase.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/supabase.ts), [supabase-admin.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/supabase-admin.ts):** Public istemcide `8000 ms`, admin istemcide `10_000 ms` `createTimedSupabaseFetch` abort zaman aşımı eklendi.
- **[db.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/db.ts) & [offers.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/offers.ts):** Otel sorguları `100`, makale sorguları `50`, `offers.getAll()` `200` kayıtla sınırlandırıldı ve `isSupabaseIsolated` hızlı dönüşleri eklendi.
- **[hotelSearchCache.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/hotelSearchCache.ts), [SearchFilters.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/SearchFilters.tsx), [SearchClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/%5Blang%5D/(main)/search/SearchClient.tsx):** `loadHotelSearchCatalog()` uçuş içi (in-flight) Promise tekilleştirme ve `5` dakikalık bellek önbelleği sağlar; `maxLength={80}` girdi sınırı, bozuk `%` sorgularında güvenli `safeDecodeQuery` koruması ve `PAGE_SIZE = 12` istemci sayfalama eklendi.
- **[GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/food/GastronomyPageClient.tsx):** Bölge JSON fetch'ine `8000 ms` `AbortController` zaman aşımı eklendi; aynı konum/kategori tekrarında `history.pushState` atlanır ve mevcut `utm_*`/`fbclid` parametreleri korunur.

### D. Mobil GPS, Harita ve Yanlış Şube Koruması
- **[next.config.js](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/next.config.js):** `Permissions-Policy` başlığı `camera=(), microphone=(), geolocation=(self), browsing-topics=()` olarak güncellendi.
- **[maps.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/food/maps.ts), [config.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/food/config.ts), [registry.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/gastronomy-v3/registry.ts), [foodAdapter.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/pilot/integration/foodAdapter.ts):** `FoodLocation.boundary` (`bbox` + `excludeBbox`) ve `VisitorFoodVenue` (`mapsUri`, `placeId`, `coordinates`) dışa aktarıldı. `findNearestPublishedRegion` önce gerçek `bbox \ excludeBbox` kapsama kontrolü yapar, sınır dışındaysa bölge kenarına `<= 6000 m` mesafeye bakar ve `(0,0)`/geçersiz koordinatları reddeder.
- **[LocationPickerModal.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/food/LocationPickerModal.tsx):** İç mekan dostu GPS seçenekleri (`enableHighAccuracy: false, timeout: 10000, maximumAge: 120000`), kapanma yarış durumu koruması (`isOpenRef`) ve kısa mobil hata mesajları eklendi; konum reddedildiğinde sayfa, kartlar ve adresler bozulmadan kalır.
- **[VariantABottomSheet.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/mobile-detail-variants/VariantABottomSheet.tsx), [LocationCard.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/hotel/LocationCard.tsx), [HotelDetails.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/HotelDetails.tsx):** Mevcut tasarım korunarak `resolveSafeVenueMapsUrl` (kanonik `https://maps.google.com/?cid=...` önceliği), `isValidGeoPoint` ve `sanitizeExternalMapsUrl` bağlandı (`PremiumRestaurantCard.tsx` ve `RestaurantCard.tsx` değiştirilmedi).

---

## 4. Gerçek Doğrulama Sonuçları (`5e7f0cb` Üzerinde Yeniden Çalıştırılan 13 Kapı)

Tüm 13 kapı, son kod değişikliğinden sonra izole yerel ortamda ve gerçek ağ/soket kilidi ([network-lock.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/scripts/security/network-lock.cjs)) altında yeniden çalıştırıldı:

| # | Doğrulama Komutu | Kapsam | Gözlemlenen Sonuç | Durum |
|---|---|---|---|---|
| 1 | `node scripts/security/scan-secrets.cjs` | Takip edilen tüm kod tabanı | `2679` dosya taranıp `0` kimlik bilgisi/gizli anahtar (`commit #1` sonrası `2683` dosyada `0`) | **GEÇTİ** |
| 2 | `node scripts/security/policy-tests.cjs` | Ortam, URL/trailing-dot, capability, staging MFA & Vary | `74` kontrol (`0` hata) | **GEÇTİ** |
| 3 | `node scripts/verify_rls_security.mjs` | İzole yerel PostgreSQL 17.11 UNIX soket gerçek SQL | `20/20` (anon yazma engeli, `aal1`/`active=false` reddi, `ya_private` erişim reddi) | **GEÇTİ** |
| 4 | `node scripts/verify_pilot_security.cjs` | Pilot auth, segmentler, CSRF ve payload kontrolleri | `48/48` (`0` ağ/DB çağrısı) | **GEÇTİ** |
| 5 | `node scripts/verify_staging_preflight.cjs` | İzole staging preflight yapılandırma kontrolleri | `8/8` | **GEÇTİ** |
| 6 | `node scripts/verify_v3_gastronomy.cjs` | 92 yayınlı bölge, 8 politika kapısı, V3.7 maliyet kalkanları | `21/21` (`0` çakışan `placeId`, `<=1` nearby `<=400m`, Atmosphere SKU yok) | **GEÇTİ** |
| 7 | `node scripts/verify_visitor_content.cjs` | Ziyaretçi DTO sıkı anahtar allowlist ve metin izolasyonu | `10/10` | **GEÇTİ** |
| 8 | `npx tsc --noEmit` | Tüm TypeScript derlemesi | `0` hata (`exit 0`) | **GEÇTİ** |
| 9 | `npm run build` | Üretim `.next` derlemesi ve statik/SSG/SSR analizi | `113/113` statik/SSG sayfa (`/[lang]` `36.1 kB / 148 kB`, `/api/gastronomy/regions/[slug]` `92` SSG yolu `1h`, `ƒ Middleware 108 kB`), `exit 0` | **GEÇTİ** |
| 10 | `node scripts/cloud/verify_secret_leakage.cjs` | `.next/static` istemci paketlerinde sır taraması | `115` istemci dosyası tarandı, `0` sızıntı | **GEÇTİ** |
| 11 | `node scripts/verify_p0_security_fixes.cjs` | Server Action, CSRF, Cloud MFA, Preview/Prod DB izolasyonu, derlenmiş `.next` HTTP E2E | `25/25` (`Group A–F` tamamı `exit 0`) | **GEÇTİ** |
| 12 | `node scripts/verify_paket03_perf_and_analytics.cjs` | ISR/SSG korunumu, `/api/track-event` doğrulama/tekilleştirme, canlı Chrome `390px` & `1440px` (`0` `articles` & `0` `track-event`, `utm/fbclid`, Back/Forward cache) | `7/7` (`exit 0`) | **GEÇTİ** |
| 13 | [verify_paket05_api_middleware_mobile.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/scripts/verify_paket05_api_middleware_mobile.cjs) | Envanter, erken `400` (`0` Upstash/DB), 25-cihaz CGNAT, Katman-1 sel engeli, Upstash kesintisi (`login`/`publish`/`createOffer`), matcher regex, canlı `200` CGNAT dalgası, `/api/*` & admin atlatma matrisi, `loadHotelSearchCatalog`, `92` bölge (`2425` mekân) CID & bbox, Mobil Chrome (`412x915`) & Safari UA (`390x844`) Puppeteer E2E | **`12/12`** (beklenmeyen stderr hatası yok) | **GEÇTİ** |

**Öne Çıkan Somut Ölçümler:**
- **CGNAT Instagram Story Simülasyonu (`Check 2.2` & `Check 3.2`):** Derlenmiş canlı Next sunucusuna aynı NAT IP üzerinden (`198.51.100.77`, farklı `Instagram/<id>` UA) atılan `200` ardışık karma isteğin (`200/200`) tamamı `200 OK` döndü (`0` hatalı `429`).
- **Upstash Kesinti Devre Kesicisi (`Check 2.3` & `Check 2.4`):** Upstash `ECONNREFUSED` altında `admin_auth` ve `costly_admin` (hem middleware/API handler hem `createOffer` Server Action) 4. istekte `429 X-RateLimit-Policy: emergency-fallback` döndürdü; farklı IP rotasyonunda da 7. küresel istek `429` aldı (`block` kipinde `503`).
- **Admin Atlatma & API Yöntem Matrisi (`Check 3.3` & `Check 3.4`):** `/tr/jilinrime.rsc`, `/tr/jilinrime/teklif-yonetimi.json`, `/tr/%6a%69%6c%69%6e%72%69%6d%65`, `/tr/%256a...`, `/tr/jilinrime%2ersc`, `/tr/JILINRIME`, `/tr//jilinrime`, `/images/../tr/jilinrime.svg`, `/images/%2e%2e/tr/jilinrime.svg`, `/tr/%6d%6f%64%61-kadikoy-pilot`, `/tr/moda-kadikoy-pilot/decision.json` hepsi reddedildi; doğrudan middleware testinde yetkili Basic başlığı taşıyan `%`-kodlu, büyük harfli veya çift slash admin yollarının tamamı `400` aldı.
- **2.425 Mekan Şube/CID ve Sınır Bütünlüğü (`Check 5.1`):** `92` bölgedeki `2.272` çekirdek + `153` yakın öneri = `2.425` mekânın `%100`'ünün `https://maps.google.com/?cid=<digits>` bağlantısı, `0` çekirdek CID çakışması ve `0` bbox dışı çekirdek koordinatı doğrulandı; aynı adı taşıyan `4` farklı şehir çifti (`Glow Coffee`, `Ciğerci Mustafa`, `Smokey BBQ&Burger`, `Rise Restaurant`) birbirinden ayrı şehirlere ait CID'lere çözümlendi.

---

## 5. Önce (`a4d73e2`) / Sonra (`5e7f0cb`) Karşılaştırması

| Ölçüt / Bileşen | Taban (`a4d73e2`) | Güncel (`5e7f0cb`) |
|---|---|---|
| `/api/*` Middleware Davranışı | Tüm `/api/` yolları `NextResponse.next()` ile baypas | Bilinmeyen uç `404`, yanlış HTTP yöntemi `405`, `/api/gastronomy/regions/[slug]` `0`-Upstash geçişi, diğer uçlar `7` katmanlı hız sınırı & anomali koruması |
| Middleware Statik Varlık Çağrıları | Yalnız `/_next/static` ve `favicon.ico` hariç (`.svg`, `.woff2`, `.png`, `robots.txt` dahil her miss'te Edge çalışır) | Temiz `.svg`, `.woff2`, `.png`, `.jpg`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest` **0 middleware çağrısı** (`..` veya `%` içeren yollar hariç) |
| Upstash Redis Yapılandırması | Global eager başlatma, `analytics: true`, admin kesintide **sınırsız fail-open** | Lazy başlatma, `analytics: false`, Katman-1 bellek kalkanı (`4096` bucket), kritik uç kesintisinde `emergency-fallback` (`3/60s` IP, `6/60s` global) / `503` seçeneği |
| Admin / API Yüzdeli Kod Atlama | `/tr/%6a%69%6c%69%6e%72%69%6d%65` `nextUrl.pathname` üzerinde `jilinrime` tespitini atlıyordu | 2 turlu decode & traversal/çift-slash/case anomali kontrolü ile `400` reddi |
| Geçersiz `/api/go` & `/api/gastronomy-public` Maliyeti | Supabase sorgusu / `readCloudPublication` RPC çalışıyordu | Doğrulama öncesi erken `400` → **`0` Upstash komutu, `0` Supabase/RPC çağrısı** |
| `/[lang]/feed.xml` & Arama Sorguları | `/feed.xml` önbellek yenileme süresi ve izolasyon koruması yok; arama 2 ayrı bileşenden 6 sorgu + bozuk `%` query'de `URIError` riski | `revalidate = 3600` + `isSupabaseIsolated`; `loadHotelSearchCatalog()` 5 dk cache & in-flight tekilleştirme (`0` sorgu izole ortamda) + güvenli URI çözümü + `12`'li sayfalama |
| `Permissions-Policy` & GPS Kapsamı | `geolocation=()` (tarayıcı konumu engelli) + yalnızca 4 km merkez mesafesi (`33/92` bölge sınır köşeleri `>4 km`) | `geolocation=(self)` + `bbox \ excludeBbox` öncelikli `findNearestPublishedRegion` (**`92/92` bölge** kapsamı) + iç mekan dostu seçenekler + `412px`/`390px` tarayıcı testi |

*(Not: `5e7f0cb` için `npm run build` çıktısındaki `ƒ Middleware` boyutu **`108 kB`** olarak ölçülmüştür; `a4d73e2` derlemesine ait `Middleware` kB ölçümü önceki denetim belgelerinde kayıtlı olmadığından tahmini fark uydurulmamıştır.)*

---

## 6. Kalan Riskler ve Yerel Ortamda Test Edilemeyenler (`Test edilemedi`)

1. **Gerçek Fiziksel Cihazda OS Konum İzni & Donanım GPS/Wi-Fi Triangülasyonu — `Test edilemedi`:** Puppeteer Mobil Chrome (`412x915`) ve iOS Safari UA (`390x844`) testlerinde DOM, `Permissions-Policy: geolocation=(self)` başlığı, `navigator.geolocation` başarı/ret/hata akışları ve taşma (`scrollWidth`) doğrulandı; ancak iOS/Android işletim sistemi düzeyindeki native izin penceresi ve gerçek GPS/baz istasyonu gecikmesi yalnız fiziksel telefonda doğrulanabilir.
2. **Yüklü Google Maps / Apple Maps Uygulamalarına Universal Link Geçişi — `Test edilemedi`:** `2.425` mekânın canonical `https://maps.google.com/?cid=...` bağlantıları, `LocationCard` / `HotelDetails` URL sanitizasyonu ve şehir içi homonim şube ayrımı yerel olarak %100 doğrulandı; iOS/Android tarayıcıdan native harita uygulamasına el değiştirme davranışı gerçek cihazda test edilmelidir.
3. **Çoklu Sunucusuz (Multi-Instance) Upstash Kesintisi & Canlı Bulut Sayaçları — `Test edilemedi`:** `emergency-fallback` devre kesicisi tek/yerel süreç belleğinde her sunucu örneğini `3/60s` IP ve `6/60s` global olarak sınırlar; çok bölgeli Edge PoP'larda bellek paylaşımı olmadığından uzun süreli Upstash kesintisinde katı kapatma tercih edilirse Vercel üzerinde `RATE_LIMIT_CRITICAL_OUTAGE_MODE=block` (`503`) etkinleştirilmelidir. Canlı Vercel Edge Invocation ve Upstash dashboard tüketimleri bulut panel erişimi olmadan doğrulanamaz (**`Test edilemedi`**).
4. **Önceki Paket 04 Bulut Ön Koşulları (Değişmedi):** `origin/main` ve eski uzak dallardaki Google API anahtarlarının Google Cloud Console üzerinden iptali, Vercel Preview/Production env değişkenlerinin ayrılması ve canlı Supabase MFA (`aal2`) / migration kurulumu canlı yayın öncesi zorunlu adımlardır.

---

## 7. İlgili Kontrol Maddelerinin Durumu (`11, 12, 13, 20, 21, 23`)

*(Not: Depo içinde ayrı bir numaralı 48 maddelik ana kontrol listesi dosyası bulunmadığından `11, 12, 13, 20, 21, 23` numaraları Görev 5 kapsamındaki API/Middleware/Mobil kontrol başlıklarıyla eşlenmiştir.)*

| Kontrol Maddesi | Görev 5 Kapsamı | Durum | Kanıt |
|---|---|---|---|
| **11** | `/api/` rate-limit bypass kapatılması, katmanlı limitler, Upstash kesinti devre kesicisi & CGNAT uyumu | **GEÇTİ** | [rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/pilot/rateLimit.ts), [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/middleware.ts), `Check 2.1–2.4`, `Check 3.2` (`200/200` OK) |
| **12** | Girdi doğrulama, sayfalama, DB/fetch zaman aşımı, arama tekilleştirme & fatura şişirme önlemleri | **GEÇTİ** | `go`, `gastronomy-public`, `track-event`, `jobs`, `db.ts`, `offers.ts`, `supabase*.ts`, `hotelSearchCache.ts`, `SearchClient.tsx`, `Check 1.1`, `Check 2.1`, `Check 4.1` |
| **13** | Middleware statik varlık optimizasyonu (`.svg`, `.woff2`), CDN cache korunumu & `.rsc`/`.json`/`%`-kodlu atlatma kapatma | **GEÇTİ** | [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/middleware.ts), `Check 3.1–3.4` (`12/12` atlatma engelli, CDN başlıkları doğrulandı) |
| **20** | `Permissions-Policy`, `Konumumu Kullan` ve `92` bölge (`bbox \ excludeBbox`) GPS eşlemesi | **ŞARTLI GEÇTİ** *(yerel E2E tam, fiziksel OS diyaloğu `Test edilemedi`)* | [next.config.js](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/next.config.js), [maps.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/food/maps.ts), [LocationPickerModal.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/food/LocationPickerModal.tsx), `Check 5.1–5.2` |
| **21** | GPS ret/hata senaryolarında sayfa dayanıklılığı, adres görünürlüğü & yanlış şubesiz CID yol tarifi | **ŞARTLI GEÇTİ** *(2425 CID & web CTA tam, native app handoff `Test edilemedi`)* | [maps.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/food/maps.ts), [VariantABottomSheet.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/mobile-detail-variants/VariantABottomSheet.tsx), [LocationCard.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/hotel/LocationCard.tsx), [HotelDetails.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/HotelDetails.tsx), `Check 5.1–5.2` |
| **23** | Mobil Chrome (`412px`) & Mobil Safari UA (`390px`) temel kullanıcı akışı + bozuk URI güvenliği + önceki P0 & Perf regressions | **ŞARTLI GEÇTİ** *(emüle mobil tam, fiziksel iPhone/Android cihaz `Test edilemedi`)* | `verify_paket05` `Check 5.2`, `verify_p0_security_fixes` `25/25`, `verify_paket03` `7/7`, `verify_rls_security` `20/20` |

---

## 8. Değiştirilen / Eklenen Dosyalar ve Commit Kayıtları

- **Taban Commit (`feat/paket-04-rc-integration`):** `a4d73e2d44bfdbb106c370387bdc3ad34a3e93c8`
- **Uygulama Commit'i (`feat/paket-05-api-middleware-mobile`, `36` dosya):** `5e7f0cb0b791abb071ce552f73c9cc47cb6cd8dd`
- **Denetim Raporu Commit'i (`feat/paket-05-api-middleware-mobile`):** Bu dosyayı (`docs/audits/PAKET_05_API_MIDDLEWARE_MOBIL.md`) ekleyen izleyen dokümantasyon commit'i.

### Değiştirilen ve Yeni Oluşturulan Dosyalar (`36` + `1` rapor)
- **Rate Limit, Güvenlik & Altyapı Çekirdeği:**
  - *(Yeni)* [lib/pilot/rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/pilot/rateLimit.ts)
  - [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/middleware.ts)
  - [next.config.js](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/next.config.js)
  - [lib/supabase-env-guard.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/supabase-env-guard.ts)
  - [lib/supabase.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/supabase.ts)
  - [lib/supabase-admin.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/supabase-admin.ts)
  - [lib/db.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/db.ts)
  - [lib/offers.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/offers.ts)
  - *(Yeni)* [lib/hotelSearchCache.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/hotelSearchCache.ts)
- **API Route Handler'ları & Server Actions:**
  - [app/api/go/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/go/route.ts)
  - [app/api/gastronomy-public/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-public/route.ts)
  - [app/api/track-event/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/track-event/route.ts)
  - [app/api/gastronomy/regions/\[slug\]/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy/regions/%5Bslug%5D/route.ts)
  - [app/api/gastronomy-admin/login/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/login/route.ts)
  - [app/api/gastronomy-admin/logout/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/logout/route.ts)
  - [app/api/gastronomy-admin/session/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/session/route.ts)
  - [app/api/gastronomy-admin/workspace/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/workspace/route.ts)
  - [app/api/gastronomy-admin/jobs/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/jobs/route.ts)
  - [app/api/gastronomy-admin/publish/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/publish/route.ts)
  - [app/api/gastronomy-admin/research/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/api/gastronomy-admin/research/route.ts)
  - [app/\[lang\]/(admin)/jilinrime/teklif-yonetimi/actions.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/%5Blang%5D/(admin)/jilinrime/teklif-yonetimi/actions.ts)
  - [app/\[lang\]/(main)/feed.xml/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/%5Blang%5D/(main)/feed.xml/route.ts)
- **Arama, GPS & Harita Modülleri:**
  - *(Yeni)* [lib/food/maps.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/food/maps.ts)
  - [lib/food/config.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/food/config.ts)
  - [lib/food/types.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/food/types.ts)
  - [lib/gastronomy-v3/registry.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/gastronomy-v3/registry.ts)
  - [lib/pilot/integration/discovery.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/pilot/integration/discovery.ts)
  - [lib/pilot/integration/foodAdapter.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/lib/pilot/integration/foodAdapter.ts)
  - [components/food/GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/food/GastronomyPageClient.tsx)
  - [components/food/LocationPickerModal.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/food/LocationPickerModal.tsx)
  - [components/mobile-detail-variants/VariantABottomSheet.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/mobile-detail-variants/VariantABottomSheet.tsx)
  - [components/hotel/LocationCard.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/hotel/LocationCard.tsx)
  - [components/HotelDetails.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/HotelDetails.tsx)
  - [components/SearchFilters.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/components/SearchFilters.tsx)
  - [app/\[lang\]/(main)/search/SearchClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/app/%5Blang%5D/(main)/search/SearchClient.tsx)
- **Doğrulama Suite'i & Rapor:**
  - *(Yeni)* [scripts/verify_paket05_api_middleware_mobile.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/scripts/verify_paket05_api_middleware_mobile.cjs)
  - *(Yeni)* [docs/audits/PAKET_05_API_MIDDLEWARE_MOBIL.md](file:///Users/erdems/Documents/Codex/yeriniayir-paket05-api-mobile/docs/audits/PAKET_05_API_MIDDLEWARE_MOBIL.md)
