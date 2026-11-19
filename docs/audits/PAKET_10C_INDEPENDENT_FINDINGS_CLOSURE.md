# Paket 10C — ChatGPT Bağımsız Kaynak Kod İncelemesi Bulgularının Kapatılması (`B1`–`B6`)

- **Depo:** `samecityapp/yeriniayirV1` (`/Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures`)
- **Çalışma Dalı:** `fix/paket-10c-chatgpt-review-closures`
- **Baz Alınan 10B Sürümü:** `07be6d65595210428453e1eb01f391c253f3af50` (`fix/paket-10b-codex-final-closures`)
- **10C Kod, SQL ve Test Commit'leri:** `d19c24711d6210273cd92b53b041e20163223e49` (B1–B6 kapatmaları, `17` dosya) ve `e6df43a116cafdb153ff8e4f1c513f61e253a6a9` (Son Güvenlik Kapısı RPC SQL sınır/`search_path` + `/api/go` SSRF/kesinti sertleştirmesi, `4` dosya)
- **Migration Uygulanma Sırası (Canlı/Staging Öncesi):**
  1. `supabase/migrations/20261119180000_enforce_cloud_mfa_admin_rls.sql` (72. migration — `is_admin_user()`, miras RLS + `restaurant-images` bucket koruması)
  2. `supabase/migrations/20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql` (73. migration — `storage` kapsam onarımı, `analytics_events`/`hotel_clicks` istemci `INSERT` kilidi, `ya_admin_save_restaurant` & `ya_admin_save_group` RPC'leri)
- **İncelenen Rapor:** `YERINIAYIR_10B_CHATGPT_BAGIMSIZ_INCELEME.md` (`B1`–`B6`)
- **Canlı Yayın / DB Durumu:** Yerel kod, SQL migration'lar (`73` dosya), TypeScript denetimi, Next.js build (`181/181`) ve tüm yerel/PG17/Next SSR doğrulama kapıları **GEÇTİ (`exit 0`)**. Hiçbir canlı/staging Supabase veritabanına migration **uygulanmadı**, `main` dalına merge veya `git push` **yapılmadı**; operatör/bulut adımları canlıya çıkış öncesinde zorunlu ön koşul olarak açıktır.

---

## 1. Bulgu Bazlı Kök Neden, Düzeltme ve Önce/Sonra Kanıtları

### `B1` (`P1`) — Storage Bucket Politika Silme ve Kısıtlayıcı Guard Yan Etkisi
- **Kök Neden:** [20261119180000_enforce_cloud_mfa_admin_rls.sql](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/supabase/migrations/20261119180000_enforce_cloud_mfa_admin_rls.sql#L291-L340) içindeki `storage.objects` `DROP POLICY` döngüsü `ya_permanent_%` dışında bucket ayrımı yapmadan tüm `INSERT`/`UPDATE`/`DELETE`/`ALL` politikalarını siliyor; eklenen `AS RESTRICTIVE` `ya_mfa_admin_storage_guard_*` politikaları da `bucket_id` koşulu içermediği için diğer bucket'ların kullanıcı yazma yetkilerini bloke edebiliyordu.
- **Yapılan Düzeltme:**
  - Henüz hiçbir veritabanına uygulanmamış olan `20261119180000_enforce_cloud_mfa_admin_rls.sql` içinde `DROP POLICY` döngüsü yalnızca `'restaurant-images'` hedefleyen veya `ya_mfa_admin_storage_%` önekli politikalara daraltıldı; `ya_mfa_admin_storage_guard_insert/update/delete` politikaları `(bucket_id <> 'restaurant-images' OR public.is_admin_user())` olarak sınırlandırıldı (tarihsel `71` `main` migration dosyasına dokunulmadı).
  - İleri yönlü 73. migration [20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/supabase/migrations/20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql#L14-L47) eklendi; bu migration da idempotent biçimde `ya_mfa_admin_storage_guard_*` kısıtlarını `(bucket_id <> 'restaurant-images' OR public.is_admin_user())` olarak yeniden tanımlar.
- **Önce -> Sonra Kanıtı ([verify_rls_security.mjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_rls_security.mjs)):**
  - İzole **PostgreSQL 17.11** motorunda migration öncesi ikinci Storage bucket `'hotel-media'` (`Hotel media auth insert/update/delete` politikalarıyla) kuruldu; hem `20261119180000` hem `20261119210000` sırayla çalıştırıldığında:
    - `[B1 / 180000 SONRASI]`: `'hotel-media'` üzerinde `authenticated` (`adminUuid`, `aal1`) `INSERT/UPDATE/DELETE` **BAŞARILI** (`hotelMediaCrud=true`).
    - `[B1 / 210000 SONRASI]`: `3/3` `'hotel-media'` politikası `pg_policies`'de korunuyor, `hotelMediaCrud=true`, buna karşın `'restaurant-images'` sıradan `authenticated`, eski `admin` ve `anon` için **BLOKLANIRKEN** yalnız aktif `aal2` Cloud Admin yazabiliyor (`30/30` PG17 testinin parçası, `exit 0`).

---

### `B2` (`P1`) — `analytics_events` ve `hotel_clicks` Doğrudan Anonim REST Yazma Yolunun Kapatılması
- **Kök Neden:** `analytics_events` ve `hotel_clicks` tablolarında anonim `INSERT ... WITH CHECK (true)` politikaları (`ya_permanent_analytics_anon_insert`, `"Anyone can track hotel clicks"`) ile `GRANT INSERT` açık olduğu için uygulama rate-limit'ini atlayan doğrudan PostgREST anonim yazmaları mümkündü; `/api/track-event`, `/api/go` ve istemci `ReportGenerator` bileşeni de anon `supabase` istemcisi kullanıyordu.
- **Yapılan Düzeltme:**
  - **SQL ([20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/supabase/migrations/20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql#L52-L129)):** Her iki tabloda tüm `INSERT/UPDATE/DELETE/ALL` politikaları düşürüldü, `PUBLIC, anon, authenticated` rollerinden `INSERT, UPDATE, DELETE, TRUNCATE` yetkileri geri alındı (`REVOKE`), `service_role` yazma/okuma yetkisi verildi ve savunma derinliği için `AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false)` politikaları eklendi.
  - **Sunucu Rotaları:**
    - [app/api/track-event/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/api/track-event/route.ts#L199-L225): Bulut ortamında (`APP_ENVIRONMENT`/`VERCEL`) yalnız `hasServiceRoleKey === true` olduğunda `supabaseAdmin` (`service_role`) üzerinden yazma yapar; key yoksa anon istemciye düşmeden `202 { ok: true, success: true, recorded: false }` döner.
    - [app/api/go/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/api/go/route.ts#L119-L170): `hotels.website_url` okumasını ve yönlendirmeyi korur; `hotel_clicks` yazmasını yalnız `hasServiceRoleKey === true` ise `supabaseAdmin` ile yapar (`read-only` staging'de yönlendirme bozulmadan atlanır ve `X-Hotel-Click-Tracked: false` döner).
  - **Admin Rapor İstemcisi:** [components/admin/ReportGenerator.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/admin/ReportGenerator.tsx#L8-L25) içindeki tarayıcı `supabase.from('analytics_events')` sorguları kaldırıldı; yerine [legacyAdminActions.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(admin)/jilinrime/legacyAdminActions.ts#L209-L246) içindeki MFA + rate-limit korumalı `getAdminHotelAnalyticsSummaryAction` Server Action'ı bağlandı.
- **Önce -> Sonra Kanıtı:**
  - *PostgreSQL 17.11 (`verify_rls_security.mjs`):* `anon`, sıradan `authenticated` ve aktif `aal2` Cloud Admin'in doğrudan `INSERT` denemeleri **BLOKLU** (`anonA=true, authA=true, admDirA=true, anonC=true, authC=true`), `anon` `hotel_clicks` `SELECT` **BLOKLU**, `service_role` yazmaları **BAŞARILI** (`srv=true`), aktif `aal2` Cloud Admin `SELECT` **BAŞARILI**.
  - *Birim & Rota (`verify_paket10c_independent_closures.cjs` Check 3):* `/api/track-event` ve `/api/go` üretimde yalnız `supabaseAdmin` üzerinden yazıyor (`anon=0`), `service_role` yokken anon istemciye düşmüyor.

---

### `B3` (`P1`/`P2`) — Upstash Yapılandırması Eksik veya Bozukken Analitik DB Yazımının Durdurulması
- **Kök Neden:** `APP_ENVIRONMENT=production` (veya `staging`) ortamında `UPSTASH_REDIS_REST_URL`/`TOKEN` eksik veya bozuk olduğunda kritik olmayan `visitor_analytics` tier'ı katman-1 sonucunu `'memory-fallback'` (status `200`) olarak döndürüyor; [app/api/track-event/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/api/track-event/route.ts#L189-L197) ise yalnızca `emergency-fallback` ve `outage-blocked` durumlarında kaydı düşürüyordu.
- **Yapılan Düzeltme:** `app/api/track-event/route.ts` içinde veritabanı yazımı için **`rl.policy !== 'upstash'`** reddi zorunlu kılındı. Böylece `'memory-fallback'`, `'disabled'`, `'emergency-fallback'` ve `'outage-blocked'` modlarının tamamında DB yazımı atlanıp `202 { ok: true, success: true, recorded: false }` dönülür.
- **Önce -> Sonra Kanıtı (`verify_paket10c_independent_closures.cjs` Check 2):**
  - Bağımsız incelemede yeniden üretilen **`APP_ENVIRONMENT=production` + eksik Upstash** (`policy=memory-fallback`), **bozuk Upstash URL** (`http://bad-upstash.example.com`, `policy=memory-fallback`), **`RATE_LIMIT_ENFORCE=0` prod** (`policy=memory-fallback`) ve **non-prod `disabled`** senaryolarının tamamı negatif test olarak eklendi; hepsi `202 { recorded: false }` ve **`0` `supabaseAdmin` / `0` `supabase` anon yazımı** ile doğrulandı.

---

### `B4` (`P1`) — Kanıtlanmamış Otel FAQ Varsayımları ve Sabit `reviewCount: '1'` Temizliği
- **Kök Neden:** [app/[lang]/(main)/otel/[id]/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/otel/%5Bid%5D/page.tsx#L144-L160) otelin `faqs` dizisi boşken 10 maddelik sabit `defaultFaqs` (otopark, kahvaltı/giriş-çıkış saati, rampa/asansör, gym/yoga, evcil hayvan yasağı, plaj mesafesi) üretiyor ve `FAQPage` JSON-LD yayımlıyordu. [lib/schema-generator.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/schema-generator.ts#L43-L115) ise `gnkScore` bulunan her otelde `aggregateRating.reviewCount: '1'` sabitliyordu.
- **Yapılan Düzeltme:**
  - `otel/[id]/page.tsx` içindeki `defaultFaqs` dizisi tamamen silindi; yalnızca `hotel.faqs` içindeki boş olmayan doğrulanmış soru-cevap çiftleri varsa `FAQPage` JSON-LD ve `<HotelFAQ>` render ediliyor.
  - `lib/schema-generator.ts` içinde sabit `reviewCount: '1'` ve doğrulanmamış `aggregateRating` üretimi kaldırıldı (yalnız pozitif tam sayı yorum sayısı doğrulanmışsa `aggregateRating` eklenir); `generateFAQSchema` boş dizi için `null` döner.
- **Önce -> Sonra Kanıtı (`verify_paket10c_independent_closures.cjs` Check 6 & Check 7):**
  - Sahte PostgREST üzerinde derlenmiş canlı Next.js üretim sunucusunda `faqs: []` ve `rating: 9.2` olan `empty-faq-hotel` TR (`/otel/empty-faq-hotel`) ve EN (`/hotel/empty-faq-hotel`) sayfalarında `<HotelFAQ>` başlığının, `FAQPage` JSON-LD'sinin, `AggregateRating` / `"reviewCount":"1"` ve uydurma `defaultFaqs` metinlerinin **hiçbirinin bulunmadığı**; yalnızca editöryal `faqs` taşıyan `verified-faq-hotel` sayfasında kendi sorusunun yayınlandığı doğrulandı.

---

### `B5` (`P1`) — Geçersiz Redis Namespace Değerinde Sessiz Ortak Anahtar Düşüşünün Engellenmesi
- **Kök Neden:** [lib/pilot/emergencyMode.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/emergencyMode.ts#L58-L108) (`prod!` -> `ya:pilot:emergency_mode`) ve [lib/pilot/rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/rateLimit.ts#L492-L545) (`staging!` -> `''`) geçersiz namespace değerlerinde hata vermek yerine sessizce ortak ön eksiz Redis anahtarına düşüyordu.
- **Yapılan Düzeltme:**
  - Paylaşılan [lib/pilot/redisNamespace.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/redisNamespace.ts) oluşturuldu (`raw !== raw.trim()` veya `/^[a-z0-9:_-]{1,40}$/i` dışı değerler fail-closed geçersiz sayılır).
  - `resolveEmergencyModeRedisKey()` geçersiz namespace'de ortak anahtar döndürmek yerine hata fırlatır; `resolveRuntimeEmergencyMode()` bozuk namespace'de paylaşılan Redis anahtarını hiç sorgulamadan `'shed'` (veya aktif `'lockdown'`) fail-safe'e geçer.
  - `rateLimit.ts` içinde `resolveUpstashRuntimeConfig()` geçersiz `RATE_LIMIT_REDIS_NAMESPACE` durumunda `null` döner (prod `costly_admin` `503 outage-blocked`, analytics `202 recorded:false`); `resolveRedisNamespace()` de geçersiz değerde fırlatır.
  - [verify_staging_config.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_staging_config.cjs#L24-L72) ve [verify_staging_preflight.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_staging_preflight.cjs#L74-L86) geçersiz veya çakışan Redis namespace değerlerini preflight'ta reddeder (`32` vaka).
- **Doğrulama:** `verify_paket10c_independent_closures.cjs` Check 4 & `verify_staging_preflight.cjs` (`exit 0`).

---

### `B6` (`P2`) — `legacyAdminActions.ts` Çok Adımlı Yazmalarının Tek Transaction RPC'ye Alınması
- **Kök Neden:** `saveAdminRestaurantAction` (restoran güncelleme -> not silme -> not ekleme) ve `saveAdminGroupAction` (grup güncelleme -> `group_hotels` silme -> yeniden ekleme) ardışık REST çağrıları yaptığından ikinci veya üçüncü adımdaki hata önceki silinen/güncellenen veriyi bozuk bırakabiliyordu.
- **Yapılan Düzeltme:**
  - [20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/supabase/migrations/20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql#L134-L403) içinde `public.ya_admin_save_restaurant` ve `public.ya_admin_save_group` (`SECURITY INVOKER`, sahip `postgres`, `SET search_path = pg_catalog, public` — `pg_temp` hariç, girişte `current_user <> 'service_role' AND NOT public.is_admin_user()` zorunlu `42501` kontrolü, `REVOKE ALL FROM PUBLIC, anon`, yalnızca `authenticated` ve `service_role` için `EXECUTE`) oluşturuldu. Fonksiyonlar Server Action Zod doğrulamasına güvenmeden doğrudan SQL sınır denetimleri (`rating 0..10`, boş/uzun alan ve `1..20` otel dizisi reddi) uygular.
  - [legacyAdminActions.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(admin)/jilinrime/legacyAdminActions.ts#L248-L510) her iki aksiyonda tekil `.rpc(...)` çağrısına geçirildi; hata durumunda `revalidatePublicCatalog()` çağrılmadan `403`/`500` döner.
- **Önce -> Sonra Kanıtı (`verify_rls_security.mjs` PG17 Aşama 6 & `[B6-SEC]`):**
  - **PG17 `pg_proc`/`proacl` Denetimi:** Her iki fonksiyonda `prosecdef=false` (`SECURITY INVOKER`), `owner=postgres`, `proconfig=["search_path=pg_catalog, public"]`, `anon_exec=false`, `auth_exec=true`, `service_exec=true`, `PUBLIC` ACL girişi `0`.
  - **Doğrudan RPC Aktör Matrisi & Rollback:** `anon`, normal `authenticated` (`aal2`), eski `profiles.role=admin` (`aal2`), aktif Cloud Admin (`aal1`) ve üyeliği iptal edilmiş yönetici (`active=false`, `aal2`) aktörlerinin tamamı hem `INSERT` hem `UPDATE` RPC çağrılarında reddedildi (`0` satır/veri değişimi); SQL sınır ihlalleri (`google_rating = -1`, `21` otel) reddedildi; 2. not ve 2. otel FK hatalarında önceki kayıtların tam korunduğu (rollback) ve yalnız aktif `aal2` Cloud Admin / `service_role` yazmalarının geçtiği kanıtlandı.

---

## 2. Koşulan Doğrulama Kapıları

`e6df43a116cafdb153ff8e4f1c513f61e253a6a9` üzerinde çalıştırılan temel doğrulamalar + `/api/go` SSRF/kesinti sertleştirmesi (`app/api/go/route.ts` loopback/özel IP/link-local engeli, `rl.policy === 'upstash'` ve otel doğrulaması sonrası click yazımı) ile Son Güvenlik Kapısı doğrulamaları:

| # | Doğrulama Komutu | Kapsam Özeti |
|---|---|---|
| 1 | `npx tsc --noEmit` | Sıfır tip hatası |
| 2 | `NEXT_DISABLE_WEBPACK_CACHE=1 npm run build` | `181/181` sayfa derlendi (`.next` = `56M`) |
| 3 | `node scripts/verify_rls_security.mjs` | PG17.11 `32/32` PASS (`B1`/`B2`/`B6` + `pg_proc`/`proacl` + 5 rol matrisi + SQL sınırlar) |
| 4 | `node scripts/verify_paket10c_independent_closures.cjs` | `8/8` PASS (`B1`–`B6` + canlı SSR + Check 8 `/api/track-event` & `/api/go` doğrulama, SSRF, kesinti, 0 sızıntı) |
| 5 | `node scripts/verify_pilot_security.cjs` | `48/48` PASS |
| 6 | `node scripts/verify_gastronomy_snapshot_integrity.cjs` | `92` bölge / `2272` mekan / tekil `placeId` PASS |
| 7 | `node scripts/cloud/verify_secret_leakage.cjs` | `119` istemci paketi dosyası, `0` sızıntı PASS |
| 8 | `node scripts/verify_codex_audit_closures.cjs` | `6/6` Codex audit kapanış kontrolü PASS |
| 9 | `node scripts/verify_paket03_perf_and_analytics.cjs` | `7/7` performans ve analitik kontrolü PASS |
| 10 | `node scripts/verify_paket05_api_middleware_mobile.cjs` | `12/12` API, middleware & mobil kontrol PASS |
| 11 | `node scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs` | `9/9` yedek/felaket & `1529/1529` sitemap URL PASS |
| 12 | `node scripts/verify_paket10b_codex_closures.cjs` | `7/7` Paket 10B regresyonu PASS |
| 13 | `node scripts/security/scan-secrets.cjs --ref=HEAD` | Tüm izlenen dosyalarda `0` sır bulgusu PASS |

*(Ayrıca `d19c247` üzerinde `policy-tests` (`74/74`), `verify_staging_preflight` (`32/32`), `verify_production_ratelimit_config` (prod env ile `exit 0`, env'siz `exit 1`), `verify_v3_gastronomy` (`21/21`), `verify_visitor_content` (`10/10`), `verify_p0_security_fixes` (`25/25`), `verify_paket06` (`8/8`), `verify_paket07` (`10/10`), `verify_paket08` (`6/6`), `verify_paket10` (`6/6`) `exit 0` ile doğrulandı.)*

- **Korunan 5 Dosya (`git diff`):** `0` değişiklik (`RestaurantCard.tsx`, `PremiumRestaurantCard.tsx`, `lib/pilot/rateLimitConfig.ts`, `scripts/verify_production_ratelimit_config.cjs`, `tsconfig.json`).
- **Route Envanteri (`app/` `route.ts`/`route.js`):** Tam **`20`** adet.

---

## 3. Açık Kalan Manuel Operatör / Bulut İşlemleri (Yayın Öncesi Zorunlu)

1. **Canlı / Staging Migration Uygulama Sırası ve Bucket/Grant Envanteri:**
   - Staging/canlı Supabase üzerinde `20261119180000` ve `20261119210000` çalıştırılmadan önce mevcut tüm `storage.objects` bucket/policy listesi (`SELECT schemaname, tablename, policyname, cmd, qual, with_check FROM pg_policies WHERE schemaname='storage'`) ve `analytics_events`/`hotel_clicks` grant'ları kontrol edilip yedeklenmelidir.
   - Staging/prod Upstash erişim anahtarları, ayrı endpoint/namespace değerleri (`RATE_LIMIT_REDIS_NAMESPACE`, `EMERGENCY_MODE_REDIS_NAMESPACE`) ve `SUPABASE_SERVICE_ROLE_KEY` yalnız ilgili sunucu ortamında operatörce tanımlanmalıdır.
2. **GitHub Geçmişindeki Eski Google API Anahtarları:** Açık repodaki geçmişte kalmış anahtarların Google Cloud Console üzerinden iptali/rotasyonu ve gerekiyorsa git geçmişi temizliği.
3. **Yasal Sayfa Kurumsal Bilgileri:** `gizlilik-politikasi`, `kvkk-aydinlatma-metni` ve `kullanim-kosullari` sayfalarındaki şirket unvanı, MERSİS/VKN ve açık adres yer tutucularının gerçek şirket kayıtlarıyla doldurulması.
4. **Canlı Bulut Bütçe/Alarm ve Gerçek Cihaz Kontrolü:** Vercel/Supabase/Upstash harcama limitlerinin doğrulanması ve küçük pilot öncesi gerçek mobil cihazlar üzerinde son gözden geçirme.
