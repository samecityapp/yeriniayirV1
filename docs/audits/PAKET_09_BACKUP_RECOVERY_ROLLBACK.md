# PAKET 09 — YEDEKLEME, FELAKET KURTARMA, GÜVENLİ GERİ DÖNÜŞ VE %100 SITEMAP GEO DENETİMİ

**Tarih:** 19 Kasım 2026 *(Resmî Vercel, Supabase ve Upstash yedekleme dokümantasyonu doğrulama tarihi: 19 Kasım 2026)*  
**Çalışma Ağacı:** `/Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures`  
**Görev 8 Başlangıç Tabanı:** `feat/paket-08-geo-ai-search-pilot` -> `7be51e2338d1644437837ab3c01f302bfd519479` (`7be51e2`)  
**Çalışma Dalı:** `feat/paket-09-backup-recovery-rollback`  
**Kod & Test Commit SHA (`14` dosya):** **`e5463e58715a69167069e4af9658043bd6f84624`** (`e5463e5`)  
**Kapsam:** Yayın kontrol listesinin **31–36. maddeleri** + Görev 8 GEO sitemap (`%100`) regresyonu + `20/20` temiz checkout regresyon kapısı.

> **NİHAİ KARAR: `ŞARTLI GEÇTİ`**  
> - **Kod, Yerel Kurtarma Dayanıklılığı, Rollback Provası ve %100 Sitemap GEO (`20/20` Kapı, `9/9` Paket 09 Kontrolü, `1.529/1.529` URL):** **GEÇTİ** (`exit 0`).  
> - **Canlı Bulut Yedeği & Sağlayıcı Paneli Kontrolleri:** Gerçek Supabase bulut yedek/PITR aktivasyon durumu, ayrı bir boş projede gerçek production yedeğinden geri yükleme testi, uzak Storage S3 eşlemesi ve gerçek Vercel Instant Rollback tatbikatı panel erişimi/açık onay dışında kaldığı için **`TEST EDİLEMEDİ`**. Production dağıtımı, `git push`, `main` merge, canlı DB yazımı veya veri dışa aktarımı **yapılmamıştır**.

---

## 1. Mevcut Yedekleme Mimarisi ve Sağlayıcı Analizi (Aşama 1)

### 1.1 Vercel Deployment ve Instant Rollback Mekanizması vs Resmî Dokümantasyon
- **Mevcut Yapı ([next.config.js](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/next.config.js), [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/middleware.ts)):**
  - Uygulama Next.js `15.5.28` üzerinde `181/181` derlenen sayfa (`●` SSG + `1h` ISR) ve `111 kB` Edge Middleware ile paketlenir.
  - Her build, `resolveBuildSupabaseEnv(process.env)` aracılığıyla derleme anındaki `NEXT_PUBLIC_SUPABASE_POLICY` hedefini pakete gömer; hatalı production değişkenlerinde build deterministik olarak düşer (`fail-closed`).
- **Resmî Vercel Dokümantasyonu ile Karşılaştırma:**
  - Vercel her production deployment'ını **değişmez (immutable)** olarak saklar; **Instant Rollback** yeni build tetiklemeden edge yönlendirme katmanında trafiği `~1 sn` içinde önceki sağlıklı deployment'a çevirir (`Dashboard -> Instant Rollback` veya `vercel rollback <deployment-url-veya-id>`).
  - **Önemli Resmî Kısıtlar:**
    1. **Plan Farkı:** Hobby planda yalnızca bir önceki deployment'a rollback yapılabilir; Pro/Enterprise planda listedeki önceki uygun deployment'lar seçilebilir.
    2. **Env Var Bağlılığı (Stale Env Riski):** Rollback, hedefteki eski deployment'ın **kendi build anındaki** Environment Variable ve Cron Job tanımlarını geri getirir; olay sonrası Vercel Dashboard'dan sonradan güncellenen yeni gizli anahtarlar eski deployment'a otomatik yansımaz.
    3. **Deployment Retention Policy:** Geçmiş build'ler saklama politikasınca silinmişse Instant Rollback yapılamaz; kalıcı saklama politikasının kontrolü gerekir.
    4. **Skew Protection:** Varsayılan açık olmakla birlikte, aktif ziyaretçi tarayıcılarında eski JS chunk'ı ile yeni Server Action / API uyumsuzluğunu azaltmak için deployment immutable tutulur.

### 1.2 Supabase Database ve Storage Yedekleme Yapısı vs Resmî Dokümantasyon
- **Resmî Supabase Dokümantasyonu ile Karşılaştırma:**
  - **Free Plan:** Otomatik günlük yedekleme ve Point-in-Time Recovery (PITR) **yoktur** (`supabase db dump` ile dışarıda saklama zorunludur).
  - **Pro (`7 gün`) / Team (`14 gün`) / Enterprise (`30 gün`):** Günlük otomatik yedek içerir (`<=15 GB` mantıksal, `>15 GB` veya PITR aktifken fiziksel base + WAL).
  - **PITR (Ücretli Eklenti):** Fiziksel temel yedek + sürekli PostgreSQL WAL arşiviyle saniye hassasiyetinde kurtarma sağlar (en kötü durum RPO `~2 dk`); geri yükleme sırasında proje geçici olarak çevrimdışı kalır.
  - **Kritik Ayrım — Supabase Storage Veritabanı Yedeğine DAHİL DEĞİLDİR:** Resmî Supabase dokümanlarına göre DB yedekleri yalnızca PostgreSQL tablolarını ve Storage metadata satırlarını (`storage.objects` vb.) korur; kovadaki gerçek görsel/medya dosyaları DB geri yüklemesiyle geri gelmez ve ayrı bucket/S3 eşlemesiyle yedeklenmelidir. Auth ayarları, Edge Functions, Vault kök anahtarları ve DB rol parolaları da ayrı yönetilmelidir.
- **Projede Doğrulanmış Tarihsel Durum ([SUPABASE_ACTUAL_BACKUP_RLS_RESULTS.md](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/docs/SUPABASE_ACTUAL_BACKUP_RLS_RESULTS.md), [SUPABASE_PRODUCTION_RECOVERY.md](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/docs/SUPABASE_PRODUCTION_RECOVERY.md)):**
  - Production proje referansı: `jerkkxwgddujigsbeqwo` (Staging: `vhptlecaixpawtxnhsde`).
  - **31 Ekim 2026** yerel mantıksal yedeği (`pg_dump 17.11` + TLS `verify-full` + `transaction_read_only=on`, Git dışı `0700/0600` yerel klasörde):
    - `roles.sql`: `358 B`
    - `schema.sql`: `20.538 B`
    - `managed-schema.sql`: `158.196 B`
    - `data.sql`: `4.711.831 B` (`public` 13, `auth` 26, `storage` 7 tablo COPY bölümü)
    - Toplam: **`4.890.923 B` (`~4,9 MB`)**, SHA-256 doğrulamalı; **4 ayrı mantıksal dosya olup tek anın atomik snapshot'ı değildir**. Vault kök anahtarı, uzantı iç verileri ve Edge Function sırlarını kapsamaz.
  - **Storage Arşivi:** `jerkkxwgddujigsbeqwo.storage.zip` (`662.720.504 B`, `358` girdi, ZIP CRC doğrulamalı) ayrı indirilmiştir.
  - **Aktif Üretim Planı:** Sağlayıcı panelinde Pro günlük yedek/PITR durumu doğrulanmadığı için **`TEST EDİLEMEDİ`** statüsündedir.

### 1.3 PostgreSQL Migration ve Geri Dönüş Riskleri
- **Envantör:** [supabase/migrations/](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/supabase/migrations) altında **`71`** migration, [supabase/operations/](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/supabase/operations) altında **`2`** acil hold/rollback SQL (`20261031_emergency_write_hold.sql` -> `45 -> 87` politika ve `20261031_emergency_write_hold.rollback.sql`), [supabase/proposed/](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/supabase/proposed) altında **`5`** önerilen Faz-A/B SQL (`20261101_*`) vardır.
- **Belirlenen Geri Dönüş & Sürüm Uyum Riskleri:**
  1. `20251018193450_revert_how_to_get_there_column.sql` gibi `DROP COLUMN IF EXISTS` ve eski `DROP POLICY IF EXISTS` adımları **otomatik `down` migration script'ine sahip değildir**; geri dönüş yalnız ileri düzeltici SQL veya backup restore ile yapılabilir.
  2. Tarihsel DB şeması ile `proposed` şeması arasındaki `profiles` tablosu / `is_admin` kolon farkı (`verify_rls_security.mjs` tarafından yakalanan risk), eski dump üzerine yeni uygulama kodu veya yeni şema üzerine eski rollback kodu açılırsa kırılma doğurabilir. Bu nedenle Faz-A yalnız **eklemeli (`ya_private`, `ya_publications`, `ya_publication_heads`, `REVOKE`/`RESTRICTIVE`)** kalır; eski kolon/tablo silinmez.
  3. `20261031_emergency_write_hold.rollback.sql` çalıştırılırsa 42 koruyucu `RESTRICTIVE` kural kalkar ve kalıcıBoundary (`20261101_permanent_write_boundary.sql`) henüz uygulanmamışsa eski 19 geniş anon yazma politikası yeniden açılır (**yüksek risk**).

### 1.4 Upstash Redis Veri Envanteri ve Kayıp Etkisi vs Resmî Dokümantasyon
- **Resmî Dokümantasyon Karşılaştırması:** Upstash Redis her yazmayı hem RAM'e hem kalıcı blok depolamaya (Dual Storage Model) yazar ve ücretli planlarda çok bölgeli yedeklilik ile manuel/günlük periyodik yedekleme sunar.
- **Uygulamada Upstash Redis'in Tuttuğu Veriler ([lib/pilot/rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/rateLimit.ts), [lib/pilot/emergencyMode.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/emergencyMode.ts)):**
  1. Kayan pencere hız sınırlama sayaçları (`10s–60s` kısa ömürlü TTL anahtarları).
  2. Çalışma zamanı acil durum anahtarı: **`ya:pilot:emergency_mode`** (`off` / `shed` / `lockdown`).
- **Kayıp / Kesinti Etkisi:**
  - Çekirdek Gastronomi V5 sayfaları **0 Upstash** kullandığı için etkilenmez (`200 OK`).
  - Rate-limit sayaçları sıfırlanırsa kısa pencere içinde geçici tolerans artar; ancak production'da `RATE_LIMIT_CRITICAL_OUTAGE_MODE=block` kritik admin uçlarını **`503 outage-blocked`** ile kilitler, ziyaretçi uçlarında ise V8 bellek katmanı-1 kalkanı devrede kalır.
  - Bu görevde kapatılan kritik boşluk: Daha önce Upstash kesilince aktif `'shed'` modu `15 sn` sonra `'off'`'a düşüyordu; yeni **`lastKnownActiveRuntimeMode` (`5 dk` varsayılan koruma penceresi)** sayesinde Redis kesintisinde mevcut acil durum kalkanı korunur.

### 1.5 Statik Gastronomi V3 JSON Verilerinin Tekrar Üretilebilirliği
- `lib/gastronomy-v3/regions/` altında **`92`** yayınlı bölge + **`1`** komşu semt havuzu (`istanbul-kadikoy-nearby-pool.json`) = **`93` JSON dosyası**, toplam **`2.272`** benzersiz `placeId`'li doğrulanmış mekân ve **`18`** pilot mekân detayı ([geoPilot.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/gastronomy-v3/geoPilot.ts)) Git içinde sürümlenir.
- Ayrıca tüm kural değerlendirmeleri ([lib/gastronomy-v3/policy.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/gastronomy-v3/policy.ts) + [definitions/](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/gastronomy-v3/definitions) + [scripts/fixtures/gastronomy-policy-inputs.json](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/fixtures/gastronomy-policy-inputs.json)) canlı Google Places API olmadan **`node scripts/verify_v3_gastronomy.cjs`** (`21/21`) ve **`node scripts/verify_gastronomy_snapshot_integrity.cjs`** ile çevrimdışı doğrulanabilir; `public/llms.txt` ve `public/llms-full.txt` ise `node scripts/generate_geo_llms_files.cjs` ile deterministik olarak yeniden üretilir.

---

## 2. Kritik Veri Envanteri ve Sınıflandırma

| Bileşen / Veri Sınıfı | Kritik Mi? | Tekil Kaynak (Source of Truth) | Kaybolursa Ne Olur? | Yeniden Üretilebilir Mi? |
|---|---|---|---|---|
| **Gastronomi V3 Seçkileri (`92`+`1` JSON, Dossiers, `geoPilot.ts`)** | Yüksek | **Git (`samecityapp/yeriniayirV1`)** | YeriniAyir V5 çekirdek vitrini; `main` + dal yedekleri kaybolmadıkça veri gitmez | **Evet** (Git checkout + offline `fixtures` + yerel `places-cache.json`) |
| **PostgreSQL İş Verisi (`hotels`, `articles`, `offers`, `auth.users`, `ya_private.*`)** | **Kritik (Tekil)** | **Supabase PostgreSQL (`jerkkxwgddujigsbeqwo`)** | Otel/teklif/rehber DB kayıtları, admin üyelikleri ve yayın geçmişi kalıcı kaybolabilir | **Hayır** (yalnız DB yedekleri/WAL ile kurtarılır) |
| **Supabase Storage Medya Dosyaları (`358` nesne, `~662.7 MB`)** | **Kritik (Tekil)** | **Supabase Storage Kovaları** | Eski otel/rehber görselleri 404 olur (DB yedeği bunları içermez!) | **Hayır** (ayrı ZIP / S3 yedeği gerekir) |
| **Vercel / Supabase / Upstash Environment Variables & Sırlar** | **Kritik** | Sağlayıcı Panelleri + Şifreli Parola Yöneticisi | Admin MFA, DB yazımı ve rate-limit kilidi durur / güvenli kapalı (`503`) moda geçer | Kısmen (anahtar rotasyonu ile yeniden üretilebilir, eski oturumlar düşer) |
| **Upstash Redis (`ratelimit`, `ya:pilot:emergency_mode`)** | Düşük (Konfig hariç) | Upstash REST | Hız sayaçları sıfırlanır; `emergency_mode` anahtarı manuel set ile 5 sn'de geri gelir | **Evet** (geçici sayaçlar otomatik dolar, acil anahtar 1 `SET` komutu) |
| **Statik `public/llms*.txt`, `.next` Build & Vercel CDN Cache** | Hayır (Türetilmiş) | Git betikleri + `npm run build` | `generate_geo_llms_files.cjs` ve `npm run build` / `Instant Rollback` ile üretilir | **Evet (%100 deterministik)** |
| **`analytics_events` / `hotel_clicks` ve Local `work/` Önbelleği** | Düşük / Geçici | Supabase / Yerel Disk | Geçmiş telemetri veya yerel Places API önbelleği eksilir; vitrin çalışmaya devam eder | `work/` kısmen; analitik ham olaylar hayır |

---

## 3. Yedekleme Planı ve RPO / RTO Önerileri (Aşama 2)

> **Önemli Not:** Supabase/Vercel/Upstash hesap planı (Free vs Pro + PITR add-on) bu denetimde bulut panelinden doğrulanmadığından aşağıdaki tabloda plan-bağımlı otomatik özellikler **aktif varsayılmamıştır**.

| Bileşen | Neler Yedeklenmeli? | Sıklık | Nerede Saklanmalı? | Kim Erişebilmeli? | Yedek Dışı Bırakılanlar | Hedef RPO | Hedef RTO |
|---|---|---|---|---|---|---|---|
| **Veritabanı (PostgreSQL)** | `roles`, `schema`, `managed-schema`, `data` (özellikle `public`, `auth`, `storage` şemaları ve gelecekte `ya_private`) + SHA-256 manifest | Plan Pro+PITR doğrulanırsa günlük + sürekli WAL; **her önemli schema/veri değişikliği öncesi mutlaka manuel mantıksal + fiziksel yedek** | Ayrı bulut bölge / şifreli yerel disk (`0700`/`0600`, Git DIŞI, asla repoya veya staging DB'ye konmaz) | Yalnız yetkili DB sahibi / acil durum operatörü (MFA zorunlu) | Geçici oturum logları, süresi dolmuş dedupe kayıtları | PITR aktifse `<= 5 dk` (resmî `~2 dk`); yalnızca günlük/manuel dump ise `<= 24 saat` *(en az değişiklik öncesi 0)* | Küçük DB (`~4.9 MB`) yeni/boş projede **`<= 30 dk`**; bulut PITR restore ile `<= 60 dk` |
| **Supabase Storage** | Tüm aktif kovalar (`images`, `article_media` vb.) tam ikili nesneler + nesne SHA-256 listesi | İlk tam senkron + haftalık/ekleme sonrası artımlı senkron (`rclone` / S3 sync / arşiv doğrulama) | Harici şifreli S3 uyumlu kova veya imzalı çevrimdışı arşiv + ikincil kopya | Yalnız depo yöneticisi (salt-okuma yedek kimliği, silme kilidi / Object Lock ile) | Tarayıcı önbellek kopyaları | `<= 24 saat` (ekleme sonrası anlık/günlük) | `<= 60 dk` (`.storage.zip` `662.7 MB` yükleme) |
| **Git & Gastronomi Seçkileri** | Tüm dallar (`main`, `feat/...`), etiketlenmiş (`tag`) yayın sürümleri, `lib/gastronomy-v3/*`, `supabase/migrations/*` | Her commit / release öncesi etiket (`release-v5.x`) | GitHub özel depo (`origin`) + en az 1 bağımsız çevrimdışı mirror / bundle (`git bundle`) | Yalnız repo sahipleri (Branch Protection + PR zorunlu) | `.env*`, `work/`, `.next/`, `node_modules/` | **`0`** (her commit ve PR'da anlık) | **`<= 10 dk`** (clone/checkout + `npm ci`) |
| **Konfigürasyon & Sırlar** | Vercel Env matrisi (Production vs Preview ayrı), `ADMIN_PASSWORD` karması, `SUPABASE_*`, `UPSTASH_*`, domain DNS kayıtları (anahtar değerleri **yalnız kasada**) | Her anahtar değişimi / rotasyon sonrası | Kurumsal Parola Kasası (1Password / Vault) + şifreli DNS JSON dışa aktarımı; **asla Git / Markdown içine ham değer yazılmaz** | Yalnız 2 yetkili yönetici (break-glass erişimi) | Vercel build cache, ephemeral JWT token'ları | **`0`** (değişiklik anında kasaya kayıt) | **`<= 15 dk`** |
| **Upstash Redis** | Yalnız acil durum politikası (`ya:pilot:emergency_mode` dokümante anahtar adı) ve Max Monthly Budget ayar kaydı | Config değişikliği sonrası belge güncellemesi | Parola kasası / Runbook; kritik durumlarda Vercel statik env yedeği (`TRAFFIC_EMERGENCY_MODE`) | Yetkili operatör | `10s–60s` rate-limit pencereleri (yeniden doğar) | `<= 1 dk` (anahtar yeniden yazılabilir) | **`<= 1 dk`** (`redis SET` veya `Instant Rollback`) |

---

## 4. İzole Kurtarma Test Sonuçları (Aşama 3 — Canlı Veri Yok)

Tüm testler `scripts/security/network-lock.cjs` soket egress kilidi altında, derlenmiş gerçek `next start` sunucusu ve izole sahte uçlarla (`node scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs`) çalıştırıldı (`9/9 PASS`):

| Senaryo | Beklenen Davranış | Kullanıcının Karşılaşacağı Sonuç | Ölçülen Gerçek Sonuç & Süre | Kurtarma Prosedürü |
|---|---|---|---|---|
| **1. Veritabanı erişilemez (`503` / kesinti)** | Gastronomi V5 statik seçkileri hiç DB beklemeden `200`; `/api/track-event` `202`; `/api/gastronomy-public` `503`; `/api/go` güvenli yönlendirme | Ziyaretçi tüm restoran adlarını, adresleri ve `?cid=` yol tariflerini görmeye devam eder; eski otel/teklif/analitik sessizce degrades olur (`0` ham stack sızıntısı) | Core rotalar (`/tr`, `.../moda`, `.../moda-vermilion`, `/api/gastronomy/regions/moda`) **`200 OK` + CID**, `track-event` **`202`**, `gastronomy-public` **`503`**, `/api/go` **`307`**, `luvicavehotel-teklif` not-found fallback (`577–608 ms`) | Supabase Dashboard durumu kontrol edilir -> DB erişimi açıldığında ek müdahalesiz düzelir; uzun kesintide `TRAFFIC_EMERGENCY_MODE=shed` açılır |
| **2. Upstash Redis çalışmıyor (`500` / timeout)** | Ziyaretçi vitrini `0` Upstash çağrısıyla sürer; production kritik admin (`admin_auth`, `costly_admin`) fail-closed **`503 outage-blocked`** olur | Ziyaretçi etkilenmez; saldırgan admin login/publish uçlarına sınırsız yüklenemez | Gastronomi **`0` Upstash hiti & `200 OK`**; production `enforceRateLimit('admin_auth')` -> **`503 outage-blocked`** (`281–289 ms`) | Upstash durumu / Max Budget kotası kontrol edilir; gerekirse `TRAFFIC_EMERGENCY_MODE=shed` devreye alınır, kurtarma sonrası `10s` içinde otomatik açılır |
| **3. Harici API yanıt vermiyor (`Places` vb.)** | Runtime `0` dış API çağrısı yapar; çevrimdışı politika/bütünlük kapıları çalışır | Kullanıcı hiçbir kesinti hissetmez; Google Maps bağlantıları doğrudan dış link (`?cid=`) olduğundan site içi çökme olmaz | `places.googleapis.com` egress denemesi engellendi (`ENETUNREACH`); `verify_v3_gastronomy` (`21/21`) + `verify_gastronomy_snapshot_integrity` (`92/92`) **`exit 0`** (`7.364 ms`) | Yayın akışı etkilenmez; yalnızca içerik üretim hattında `--max-fetches=0` ile yerelden devam edilir |
| **4. Hatalı uygulama sürümü dağıtılmış** | Sağlık kontrolü `500` yakalar ve trafik öncekine (`v-good`) döndürülür | Rollback sonrası tüm sayfalar yeniden `200 OK` döner | Sahte bozuk arka uç **`500`** -> yönlendirici anında sağlıklı `next start` sürümüne döndü: **`200 OK` + `29/29` Moda mekanı + `?cid=`**, geçiş süresi **`28 ms`** | Vercel Instant Rollback (`vercel rollback <onceki-deployment>`) -> `200` ve canonical/API smoke kontrolü |
| **5. Gastronomi JSON dosyalarından biri bozulmuş** | Build/CI bütünlük kapısı bozuk/eksik şemalı JSON'u üretim öncesi engeller; bozuk bulut zarfı Zod ile reddedilir | Bozuk veri canlıya hiç çıkmaz; yayın zarfı bozulursa mevcut/statik vitrin korunur | `os.tmpdir()` üzerinde kesik `istanbul-kadikoy-moda.json` (`CORRUPT_JSON` -> `exit 1`), bozuk `mapsUri` (`exit 1`), temiz geri yükleme (`exit 0`) (`1.531–1.565 ms`) | `git checkout HEAD -- lib/gastronomy-v3/regions/<dosya>.json && node scripts/verify_gastronomy_snapshot_integrity.cjs && node scripts/verify_v3_gastronomy.cjs` |
| **6. Yanlış veya eksik environment variable var** | Eksik `ADMIN_PASSWORD` `503`; yetkisiz production build reddi; çelişkili staging/prod URL reddi; belirsiz preview'da `ISOLATED` mod | Admin uçları kapalı kalır (`503`); sahte production bağlantısı oluşmaz; vitrin güvende kalır | `checkPilotAdmin` (şifresiz) -> **`503`**; `supabase-policy` yetkisiz prod -> **throw**; `ISOLATED` canlı sunucu gastronomi -> **`200 OK`** (`20–23 ms`) | Doğru Vercel/Vault env seti geri yüklenip **Redeploy** yapılır (bkz. Bölüm 5 env uyarısı) |
| **7. Yedekten geri yüklenen test verisi tutarsız** | Malformed `offers.included_items` / null `region` `500` üretmez; çift mekan ID'li `ya_publications` Zod tarafından reddedilir | Teklif sayfası çökmek yerine güvenli varsayılan özelliklerle açılır; hatalı yayın zarfı vitrini bozmaz | `[null, 42, {id:'feat1'}]` + `region: null` içeren `bozuk-teklif-test` hatasız render (`Türkiye` varsayılanı); çift ID'li `ya_read_publication` **`rejects`** (`158–159 ms`) | `supabase/migrations` (`71`) + `proposed` (`5`) SQL taraması ile uyuşmazlık tespit edilir; bozuk `offers` satırı onarılır veya `ya_publication_heads` önceki temiz revizyona alınır |

---

## 5. Rollback ve Acil Durum Prosedürü (Aşama 4)

### 5.1 Vercel Önceki Sağlam Deployment'a Güvenli Dönüş Runbook'u
1. **Tanı (30 sn):** `vercel logs requests --environment production --query 'httpStatus >= 500 AND httpStatus < 600' --since 30m` veya Vercel Monitoring üzerinden hata veren route ve deployment ID'sini belirle.
2. **DB / Şema Uyum Kontrolü (Zorunlu Ön Kapı):** Geri dönülecek deployment'tan bu yana veritabanında yıkıcı kolon/tablo silme veya kalıcı politika kaldırma uygulanıp uygulanmadığını kontrol et (`supabase/migrations/*` & `supabase/proposed/*`). Eklemeli Faz-A (`ya_private`, `ya_publications`) değişikliği eski kodu kırmaz; ancak eski kod yeni zorunlu env istiyorsa 3. adımda kontrol et.
3. **Anında Geri Dönüş (Instant Rollback):**
   - **Dashboard:** Vercel -> Project Overview -> Production Deployment -> **Instant Rollback** -> son yeşil etiketli deployment seçimi (domain listesinde hem `www.yeriniayir.com` hem `www.worldandhotels.com` doğrulaması).
   - **CLI:** `vercel rollback <onceki-saglam-deployment-url-veya-id>`
   - **Env Uyarısı:** Vercel Rollback, eski deployment'ın **build/deploy anındaki environment variable'larını** yükler. Sonradan Dashboard'da anahtar/acil mod değiştirilmişse rollback sonrası env doğrulaması ve gerekiyorsa `Redeploy` gerekir.
4. **Rollback Sonrası Duman Testi (<= 2 dk):**
   - `GET https://www.yeriniayir.com/gastronomi/istanbul/kadikoy/moda` -> `200` + adres + `maps.google.com/?cid=`
   - `GET https://www.worldandhotels.com/gastronomy/istanbul/kadikoy/moda` -> `200`
   - `GET https://www.yeriniayir.com/sitemap.xml` -> `200` (`> 1.500` URL)
   - `GET https://www.yeriniayir.com/tr/jilinrime` -> `401` / `403` (anonim erişim hâlâ kapalı)

### 5.2 Redis Tabanlı `TRAFFIC_EMERGENCY_MODE` ve Redis Kesintisindeki Davranış (Doğrulandı)
- [lib/pilot/emergencyMode.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/emergencyMode.ts):
  - **Öncelik Sırası:** `lockdown` statik env (`TRAFFIC_EMERGENCY_MODE=lockdown`) > önbellekli (`15 sn`) veya canlı Redis `ya:pilot:emergency_mode` > **Redis kesintisinde son bilinen aktif koruma penceresi (`lastKnownActiveRuntimeMode`, varsayılan `5 dk`)** > statik `shed`/`off`.
  - **Bu Görevde Kapatılan Risk & Ölçüm (`Check 8`, `1.158 ms`):** Upstash üzerinde `ya:pilot:emergency_mode='shed'` aktifken `/tr/search` `503` (`X-Emergency-Mode: shed`) verdikten sonra Upstash bilinçli olarak `500` çökertildi ve `120 ms`'lik önbellek süresi aşıldı. Yeni koruma penceresi sayesinde `/tr/search` **`503`** korunurken, çekirdek gastronomi (`/tr`, `/tr/gastronomi/istanbul/kadikoy/moda`, `/tr/gastronomi/mekan/moda-vermilion`, `/api/gastronomy/regions/moda`) **sıfır Upstash bağımlılığıyla, adres ve `https://maps.google.com/?cid=...` yol tarifi linkleri tam olarak `200 OK` hizmet vermeye devam etti.** Koruma penceresi (`700 ms` test / `5 dk` prod) dolduğunda veya Redis tekrar `'off'` döndürdüğünde normal trafik kendiliğinden açıldı.

---

## 6. GEO Sitemap Regresyon Sonuçları — `%100` URL Denetimi (Aşama 5)

### 6.1 İlk Denetimde Bulunan Kusurlar ve Yapılan Hedefli Düzeltmeler
Görev 8'in `1.537` URL'li sitemap'i kapsamlı incelendiğinde `1.494` GEO/kök URL'sinin sağlam olduğu, ancak eski makale ve genel sayfa bölümünde **4 gerçek SEO/erişim kusuru** bulunduğu saptandı ve tamamı kapatıldı:

1. **Türkçe-özel makalelerin `worldandhotels.com/guide/...` üzerinde 404 üretmesi ve EN makalelerin eksikliği:** [app/sitemap.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/sitemap.ts) varsayılan `'tr'` ile `db.articles.getAll()` çağırıp `21` TR-only `mockArticles` kaydını yanlış biçimde `worldandhotels.com/guide/<tr-slug>` altına da yazıyor, `10` İngilizce `fallbackArticles` makalesini ise hiç eklemiyordu. **Düzeltme:** `tr` ve `en` listeleri `doesArticleSupportLang` üzerinden ayrı çekildi; [app/[lang]/(main)/rehber/[slug]/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/rehber/%5Bslug%5D/page.tsx) metadata ve sayfa aşamasında dil eşleşmesi olmayan makalelere `notFound()` uyguladı.
2. **Unicode makale slug reddi ve `/guide/*` middleware rewrite eksikliği:** `likya-yolu-fethiye-günübirlik-rotalar` slug'ı [lib/db.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/db.ts) içindeki ASCII `ARTICLE_SLUG_REGEX` yüzünden `404` dönüyordu; ayrıca [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/middleware.ts) `worldandhotels.com/guide/...` isteklerini `/en/rehber/...` yerine `/en/guide/...` rewrite ettiği için tüm İngilizce rehber URL'leri `404` alıyordu. **Düzeltme:** `ARTICLE_SLUG_REGEX` `/^[\p{L}\p{N}-]{1,140}$/u` + `decodeURIComponent` oldu; `middleware.ts` içine `translateEnPublicInternalPath` & `toPublicEnglishPath` eklendi.
3. **Canonical ve Hreflang Uyumsuzlukları:** `rehber/[slug]/page.tsx` `/tr/rehber/...` ve `yeriniayir.com/en/guide/...` canonical'ı üretiyordu; `rehber/page.tsx` ve `hakkimizda/page.tsx` canonical taşımıyordu. **Düzeltme:** Tüm rehber ve hakkımızda sayfalarına tam `www.yeriniayir.com` / `www.worldandhotels.com` canonical + karşılıklı `tr-TR` / `en` / `x-default` `hreflang` eklendi (`encodeURI` ile sitemap birebir eşit).
4. **Yönetici / Arama / Demo / Teklif Sayfalarında `noindex` Kalkanı:** [app/[lang]/(admin)/layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(admin)/layout.tsx), [app/[lang]/(main)/search/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(main)/search/page.tsx), [app/[lang]/[slug]/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/%5Bslug%5D/page.tsx), [lib/pilot/adminAuth.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/adminAuth.ts) (`PILOT_PRIVATE_HEADERS`) ve [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/middleware.ts) (`NOINDEX_PUBLIC_PATH_RE`) ile tüm yönetici/demo/arama/teklif rotaları `noindex, nofollow` güvencesine alındı.

### 6.2 Tam Sitemap Tarama Sonuçları (`1.529 / 1.529` URL — Örnekleme Yok)
`1.537` adet ham listeden `21` geçersiz/var olmayan TR->EN makale çifti temizlenip, eksik olan `10` geçerli EN makale + `2` rehber dizin (`/rehber`, `/guide`) + `1` EN `/hakkimizda` eklenerek tam **`1.529` temiz URL** elde edildi:

| Kontrol Edilen GEO Kriteri | Kapsam | Gözlemlenen Sonuç | Durum |
|---|---|---|---|
| **Tüm Sitemap `<loc>` URL Erişilebilirliği** | **`1.529 / 1.529` (%100)** *(1.494 GEO/Kök + 2 Rehber Dizin + 21 TR Makale + 10 EN Makale + 2 Hakkımızda)* | `1.529` adet HTTP **`200 OK`** (`0` adet 301/307/308, `0` adet 404, `0` adet 500, `0` adet `NEXT_HTTP_ERROR_FALLBACK;404`) | **GEÇTİ** |
| **Canonical Tutarlılığı & Alan Adı Ayrımı** | **`1.529 / 1.529` (%100)** | Her sayfada `<link rel="canonical">` tam olarak kendi `<loc>` URL'si ve doğru domain (`www.yeriniayir.com` vs `www.worldandhotels.com`) ile eşleşti | **GEÇTİ** |
| **`hreflang` Eşleşmeleri (`tr-TR` / `en` / `x-default`)** | Sitemap'te çift dilli ilan edilen tüm girişler | HTML `<link rel="alternate">` bağlantıları sitemap `xhtml:link` hedefleriyle `%100` örtüştü | **GEÇTİ** |
| **Çapraz Alan Adı Yönlendirmeleri** | `yeriniayir.com/gastronomy/istanbul` ve `worldandhotels.com/tr/gastronomi` | Sırasıyla `308 -> https://www.worldandhotels.com/gastronomy/istanbul` ve `308 -> https://www.yeriniayir.com/gastronomi` | **GEÇTİ** |
| **Soğuk İlk İstek ISR (`first-hit ISR`)** | Prerender dışı `/gastronomi/izmir/urla/kahve` (crawl öncesi ilk istek) | İlk soğuk istekte `200 OK` + tam HTML + `application/ld+json` | **GEÇTİ** |
| **Yönetici & Dahili `noindex` Koruması** | `/tr/jilinrime`, `/tr/gastronomi-yonetimi`, `/tr/moda-kadikoy-pilot`, `/tr/design-demo`, `/tr/preview-food-card`, `/tr/fethiye-yemek-rehberi`, `/tr/search`, `/tr/hoteloffer` | Hiçbiri sitemap'te yok; tümü `X-Robots-Tag: noindex` / `meta noindex` veya auth `401/503` ile korunuyor | **GEÇTİ** |

---

## 7. Başarısız veya `TEST EDİLEMEDİ` Olan Kontroller

- **Başarısız Yerel Otomatik Kontrol:** `0` (`20/20` regresyon kapısı temiz checkout `rm -rf work` sonrası `exit 0`). *(Not: `verify_production_ratelimit_config.cjs` beklenen şekilde prod Upstash env değişkenleri yoksa fail-closed `exit 1` döner; doğrulama koşusunda geçerli şekil env değişkenleriyle çalıştırılıp `PASS` alınmıştır.)*
- **`TEST EDİLEMEDİ` Kontroller (Canlı Sağlayıcı Panel & Gerçek Yedek İşlemleri):**
  1. **Gerçek Production Supabase Yedeğinden Geri Yükleme Testi (`TEST EDİLEMEDİ`):** `31 Ekim 2026` tarihli mantıksal yedeğin veya canlı bulut yedeğinin **yeni/boş bir Supabase projesine** uçtan uca geri yüklenip satır sayısı/RLS/auth doğrulaması yapılması henüz gerçekleştirilmemiştir.
  2. **Canlı Supabase Otomatik Günlük Yedekleme & PITR Durumu (`TEST EDİLEMEDİ`):** Hesabın Pro+PITR üzerinde olup olmadığı koddan görülemez; panelden teyit edilmelidir.
  3. **Canlı Supabase Storage Harici S3 / Sürekli Yedek Senkronu (`TEST EDİLEMEDİ`):** Mevcut arşiv (`jerkkxwgddujigsbeqwo.storage.zip`, `358` dosya) dışında otomatik uzak senkronizasyon doğrulanmamıştır.
  4. **Canlı Vercel Hesap Planı Deployment Retention & Gerçek Production Rollback Tatbikatı (`TEST EDİLEMEDİ`):** Yalnız yerel blue/green proxy üzerinde prova edilmiştir.

---

## 8. Manuel Aşamaya Bırakılan İşlemler

Yayın öncesi ve hemen sonrasında operatör tarafından panel üzerinden yapılacak tek seferlik adımlar:
1. **Supabase Dashboard:** Proje planını (`Pro`), **Database -> Backups / PITR** durumunu kontrol et; mümkünse PITR'yi aç ve mevcut yedekten **ayrı, boş bir kurtarma/staging projesine** geri yükleme tatbikatı yap (canlı projeyi silmeden/değiştirmeden).
2. **Supabase Storage:** Uzaktaki aktif bucket nesnelerini mevcut yerel `358` dosyalı arşivle karşılaştırıp harici S3/R2 veya çevrimdışı şifreli depoya periyodik kopya kur.
3. **Vercel Dashboard:** **Settings -> Deployment Retention** ayarını doğrula; **Spend Management (`Pause production deployments`)** ayarını kontrol et; production deploy sonrası iki canlı URL (`yeriniayir.com` ve `worldandhotels.com`) üzerinden tek seferlik Instant Rollback buton erişimini ve önceki deployment listesini gözden geçir.
4. **Upstash Redis Console:** Production Redis veritabanı için **Max Monthly Budget**, `%70/%90` uyarı alarmları ve otomatik günlük backup/multi-zone redundancy durumunu doğrula.
5. **Önceki Paketlerden Devreden Önkoşullar:** Paket 07/08 raporlarındaki `origin/main` maruz Google Cloud API anahtar iptali/rotasyonu ve Google Search Console'da hem `www.yeriniayir.com/sitemap.xml` hem `www.worldandhotels.com/sitemap.xml` gönderimi.

---

## 9. Dal Adı, Commit SHA'ları, `20/20` Kapı Özeti ve Nihai Karar

- **Dal Adı:** `feat/paket-09-backup-recovery-rollback`
- **Başlangıç Commit SHA (Görev 8 `HEAD`):** `7be51e2338d1644437837ab3c01f302bfd519479` (`7be51e2`)
- **Kod & Test Commit SHA (`14` dosya):** **`e5463e58715a69167069e4af9658043bd6f84624`** (`e5463e5`)
- **Korunan Dosyalar:** `tsconfig.json`, [rateLimitConfig.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/rateLimitConfig.ts), [verify_production_ratelimit_config.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_production_ratelimit_config.cjs), [RestaurantCard.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/nearby-places/RestaurantCard.tsx) ve [PremiumRestaurantCard.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/nearby-places/PremiumRestaurantCard.tsx) `git diff --exit-code` ile **0 değişiklik** olarak doğrulandı.

### Tam `20/20` Temiz Checkout Doğrulama Özeti (`rm -rf work` sonrası)

| # | Doğrulama Komutu | Gerçek Sonuç | Durum |
|---|---|---|---|
| 1 | `node scripts/security/scan-secrets.cjs` | `2.709` dosya, `uniqueCredentials: 0` | **GEÇTİ** |
| 2 | `node scripts/security/policy-tests.cjs` | `74/74` PASS | **GEÇTİ** |
| 3 | `node scripts/verify_rls_security.mjs` | İzole PG 17.11 `20/20 TEST BAŞARILI` | **GEÇTİ** |
| 4 | `node scripts/verify_pilot_security.cjs` | `48/48` PASS | **GEÇTİ** |
| 5 | `node scripts/verify_staging_preflight.cjs` | `28` PASS | **GEÇTİ** |
| 6 | `UPSTASH_... RATE_LIMIT_CRITICAL_OUTAGE_MODE=block node scripts/verify_production_ratelimit_config.cjs` | `PASS` *(env yokken beklendiği gibi fail-closed `exit 1`)* | **GEÇTİ** |
| 7 | `node scripts/verify_v3_gastronomy.cjs` | `21/21` PASS | **GEÇTİ** |
| 8 | [scripts/verify_gastronomy_snapshot_integrity.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_gastronomy_snapshot_integrity.cjs) | `92` yayınlı bölge / `93` JSON / `2.272` mekan / `18` pilot / SHA-256 manifest PASS | **GEÇTİ** |
| 9 | `node scripts/verify_visitor_content.cjs` | `10/10` PASS | **GEÇTİ** |
| 10 | `npx tsc --noEmit` | `0` hata | **GEÇTİ** |
| 11 | `npm run build` | `181/181` sayfa, Middleware `111 kB`, `exit 0` | **GEÇTİ** |
| 12 | `node scripts/cloud/verify_secret_leakage.cjs` | `120` istemci dosyası, `0` sızıntı | **GEÇTİ** |
| 13 | `node scripts/verify_p0_security_fixes.cjs` | `25/25` PASS | **GEÇTİ** |
| 14 | `node scripts/verify_paket03_perf_and_analytics.cjs` | `7/7` PASS | **GEÇTİ** |
| 15 | `node scripts/verify_paket05_api_middleware_mobile.cjs` | `12/12` PASS | **GEÇTİ** |
| 16 | `node scripts/verify_codex_audit_closures.cjs` | `6/6` PASS | **GEÇTİ** |
| 17 | `node scripts/verify_paket06_traffic_cost_resilience.cjs` | `8/8` PASS (`Scenario A` & `B`: `0` 5xx/429/DB/Upstash) | **GEÇTİ** |
| 18 | `node scripts/verify_paket07_release_candidate.cjs` | `10/10` PASS | **GEÇTİ** |
| 19 | `node scripts/verify_paket08_geo_ai_search.cjs` | `6/6` PASS (`0.157` Jaccard, AI bot & Chrome `390px`/`1280px`) | **GEÇTİ** |
| 20 | [scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs) | **`9/9` PASS** (`7` izole kurtarma senaryosu + Redis kesintisindeki acil durum + **`1.529/1.529` sitemap URL `%100` taraması**) | **GEÇTİ** |

**NİHAİ KARAR: `ŞARTLI GEÇTİ`** — Kod tabanı, acil durum kesinti koruması, izole 7 felaket kurtarma senaryosu, yerel rollback provası ve `%100` (`1.529/1.529` URL) sitemap GEO doğrulaması eksiksiz geçmiştir; canlı bulut yedek/PITR plan teyidi, ayrı boş projede gerçek DB/Storage geri yükleme tatbikatı ve önceki paketlerin anahtar rotasyonu tamamlanınca production'a güvenle geçilebilir.
