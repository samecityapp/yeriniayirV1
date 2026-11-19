# Yerini Ayır — 48 Maddelik Nihai Yayın Kontrol Matrisi

**Kaynak Liste:** `/Users/erdems/Downloads/YeriniAyir_Yayin_Kontrol_Listesi.md` (18 Kasım 2026)  
**Denetlenen Sürüm:** `feat/paket-10-final-release-audit` (`dda2cd6a2d9a669fbee9e14b7a2d6defd93f01ed` + Paket 10 denetim belgeleri)  
**Değerlendirme İlkesi:** Yalnızca bu oturumda yerel kod, derleme ve ağ kilitli testlerle doğrudan gözlemlenen bulgular `GEÇTİ` sayılmıştır. Canlı bulut panelleri, fiziksel mobil cihazlar, canlı işletme saatleri ve hukuki/telif onayları `TEST EDİLEMEDİ`, `ŞARTLI GEÇTİ` veya `KALDI` olarak işaretlenmiştir.

## Özet Durum Dağılımı (Toplam 48 Madde)

| Durum | Adet | Maddeler |
| :--- | ---: | :--- |
| **GEÇTİ** | 6 | `04, 14, 15, 17, 20, 42` |
| **ŞARTLI GEÇTİ** | 22 | `01, 02, 06, 09, 10, 11, 12, 13, 16, 19, 25, 26, 28, 29, 32, 33, 35, 36, 37, 38, 43, 44` |
| **KALDI** | 4 | `08, 39, 45, 47` |
| **TEST EDİLEMEDİ** | 15 | `03, 05, 07, 18, 21, 22, 23, 24, 27, 30, 31, 34, 40, 41, 46` |
| **KAPSAM DIŞI** | 1 | `48` |

---

## 1 · Envanter ve bütçe (01–06)

### Madde 01
- **1. Madde numarası ve başlığı:** 01. Canlı alan adını, dağıtım sürümünü, test ortamını ve bağlı Supabase projesini eşleştir. Test ortamının gerçek verilere yazmadığını doğrula.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_staging_preflight.cjs` (`28` PASS), `node scripts/verify_p0_security_fixes.cjs` (`25` PASS), `node scripts/security/policy-tests.cjs` (`74` PASS).
- **4. İlgili kod dosyaları:** `lib/security/supabase-policy.js`, `lib/supabase-env-guard.ts`, `lib/cloud/config.ts`, `next.config.js`, `scripts/verify_staging_config.cjs`.
- **5. Tespit edilen risk veya eksik:** Yerel ve izole testlerde staging (`vhptlecaixpawtxnhsde`) ile prod (`jerkkxwgddujigsbeqwo`, `aknhkpevrlpsrfxzqtop`) ayrımı kesinlikle engellense de canlı Vercel projesinin prod/preview env değişken eşleştirmesi bulut panelinden görülmeden %100 kesinleştirilemez.
- **6. Yapılan düzeltme:** Görev 1–7 boyunca çapraz ortam izolasyonu, `ISOLATED` build guard ve staging preflight düzeltmeleri tamamlandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Vercel Production ve Preview ortam değişkenlerinde doğru Supabase ref eşleşmesini teyit edin.
- **8. Öncelik seviyesi:** `P1`

### Madde 02
- **1. Madde numarası ve başlığı:** 02. Ziyaretçi, editör ve yönetici özelliklerini çıkar. Arama, filtre, harita, dosya yükleme, formlar, zamanlanmış işler, AI ve ücretli API’lerden hangileri gerçekten çalışıyor?
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket05_api_middleware_mobile.cjs` (`20` API route envanteri), `docs/audits/PAKET_01_ALTYAPI_DENETIMI.md`, `node scripts/verify_paket10_final_release_audit.cjs` (`6/6`).
- **4. İlgili kod dosyaları:** `app/api/**`, `middleware.ts`, `components/food/GastronomyPageClient.tsx`, `app/[lang]/(admin)/gastronomi-yonetimi/panel.tsx`.
- **5. Tespit edilen risk veya eksik:** Yerel derlemede tüm aktif ziyaretçi özellikleri (statik bölge listeleri, arama, GPS/bölge modalı, CID harita linkleri) çalışıyor; admin panelinin AI/Places işleri ve Supabase depolama/veritabanı yazmaları gerçek bulut anahtarları olmadan devre dışıdır (`ISOLATED`). Eski `/jilinrime` client sayfaları ve pasif `/hoteloffer` butonları kapsam ayrımındadır.
- **6. Yapılan düzeltme:** Paket 10'da çıplak `/gastronomi-yonetimi` yönlendirmesi düzeltildi, kullanılmayan `/otel-listesi` ve tekrar `/kullanim-sartlari` `noindex` yapıldı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Ücretli Places/AI işlerinin yalnız staging/yönetici ortamında etkin olduğunu doğrulayın.
- **8. Öncelik seviyesi:** `P2`

### Madde 03
- **1. Madde numarası ve başlığı:** 03. Her sağlayıcının sabit ücreti, dahil kotası, birim fiyatı, mevcut tüketimi ve fatura dönemini kaydet. Fiyatları güncel hesap ve resmî tarifeden al.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** `docs/audits/PAKET_03_PERFORMANS_MALIYET.md`, `docs/audits/PAKET_06_TRAFiK_MALIYET_KORUMA.md` (kod içi tüketim analizi).
- **4. İlgili kod dosyaları:** Uygulama dışı bulut hesap ayarları (`next.config.js`, `lib/gastronomy-v3/` Places kota korumaları hariç).
- **5. Tespit edilen risk veya eksik:** Gerçek Vercel, Supabase, Upstash ve Google Cloud hesap planları, mevcut aylık tüketim ve fatura kesim tarihleri yerel depoda bulunmaz ve panel erişimi olmadan doğrulanamaz.
- **6. Yapılan düzeltme:** `AGENTS.md` ve `verify_v3_gastronomy.cjs` ile çalışma anı `Places API` çağrısı `0`'a indirildi (`--max-fetches=0`, `ENTERPRISE_FIELD_MASK`).
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Vercel, Supabase, Upstash ve Google Cloud Billing panellerinden güncel plan/kota/fatura dönemlerini kaydedin.
- **8. Öncelik seviyesi:** `P1`

### Madde 04
- **1. Madde numarası ve başlığı:** 04. Ziyaret başına ücret doğurabilecek işlemleri listele: CDN/veri transferi, fonksiyonlar, veritabanı, görsel dönüşümü/depolama, harita, analiz, log ve varsa mesajlaşma.
- **2. Durum:** `GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket03_perf_and_analytics.cjs` (`7/7`), `node scripts/verify_paket06_traffic_cost_resilience.cjs` (`8/8` — `0` DB/Upstash/track-event), `docs/audits/PAKET_06_TRAFiK_MALIYET_KORUMA.md`.
- **4. İlgili kod dosyaları:** `app/[lang]/(gastronomy)/**`, `app/api/gastronomy/regions/[slug]/route.ts`, `middleware.ts`, `components/Analytics.tsx`.
- **5. Tespit edilen risk veya eksik:** Gastronomy V5 normal story ziyaretinde veritabanı ve Upstash tüketmez; ancak CDN egress (`raw/brotli`), Google Analytics/Clarity (yalnız rıza verilirse) ve eski otel/arama yolları SSR Function + Supabase tüketir.
- **6. Yapılan düzeltme:** Statik ön-render, `?region` gecikmeli fetch, rıza öncesi sıfır analitik betik ve statik görsel (`/yeriniayir-logo.png`, `unoptimized` ayarları) korundu.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Hayır *(kod envanteri tamam; canlı Vercel/Supabase gerçek rakamları Madde 03/30'da izlenecek)*.
- **8. Öncelik seviyesi:** `Yok`

### Madde 05
- **1. Madde numarası ve başlığı:** 05. Aylık bütçeyi, erken uyarıyı kimin alacağını ve hangi seviyede neyin kapanacağını belirle. Vercel bütçe alarmı ile projeyi duraklatma ayarını ayrı kaydet. Supabase Spend Cap kapsamını ve hariç tutulan kalemleri kontrol et.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** `docs/audits/PAKET_06_TRAFiK_MALIYET_KORUMA.md` ve `docs/audits/MANUEL_YAYIN_ONCESI_ISLEMLER.md`.
- **4. İlgili kod dosyaları:** Kod dışı bulut kontrol düzlemi ayarları (`lib/pilot/emergencyMode.ts` uygulama içi kesici desteği hariç).
- **5. Tespit edilen risk veya eksik:** Vercel Spend Management alarm/auto-pause ve Supabase Spend Cap (özellikle Auth MAU / PITR / ek egress hariç tutmaları) kodla kurulamaz; kontrolsüz viral sıçrama veya bot saldırısı açık fatura riski taşır.
- **6. Yapılan düzeltme:** Kod tarafında Upstash tabanlı 0-deploy `TRAFFIC_EMERGENCY_MODE` (`shed`/`lockdown`) eklendi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Vercel Spend Management + Auto-Pause, Supabase Spend Cap, Upstash ve Google Cloud günlük kota sınırlarını etkinleştirin.
- **8. Öncelik seviyesi:** `P1`

### Madde 06
- **1. Madde numarası ve başlığı:** 06. Üç ayrı senaryoda maliyet tedbirini yaz: gerçek story yoğunluğu, otomatik bot trafiği, uygulamanın aynı işlemi tekrar tekrar çalıştırması. Her senaryo için ilk sinyal ve müdahale sahibi belli olsun.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket06_traffic_cost_resilience.cjs` (`8/8`), `node scripts/verify_paket07_release_candidate.cjs` (`10/10`Check 8–9), `node scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs` (`Check 8`).
- **4. İlgili kod dosyaları:** `lib/pilot/emergencyMode.ts`, `lib/pilot/rateLimit.ts`, `middleware.ts`, `components/food/GastronomyPageClient.tsx` (`regionCacheRef`).
- **5. Tespit edilen risk veya eksik:** Uygulama katmanındaki tedbirler (statik ISR, `shed`/`lockdown`, rate limit, tekilleştirme, `Places` `--max-fetches=0`) test edildi; ancak gerçek müdahale nöbetçisi ve canlı Vercel/Cloudflare WAF bot/alarm eşikleri ekipçe tanımlanmalıdır.
- **6. Yapılan düzeltme:** Redis kesintisinde acil durum penceresini (`grace window`) koruyan Paket 09 düzeltmesi korundu ve yeniden doğrulandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — İlk sinyal/alarm alıcılarını ve Vercel Firewall / Bot Protection kurallarını aktive edin.
- **8. Öncelik seviyesi:** `P1`

---

## 2 · Hesaplar, veri ve API güvenliği (07–13)

### Madde 07
- **1. Madde numarası ve başlığı:** 07. Domain, GitHub, Vercel ve Supabase sahipliğini, iki aşamalı doğrulamayı, kurtarma erişimini ve ekip yetkilerini kontrol et.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** `docs/audits/MANUEL_YAYIN_ONCESI_ISLEMLER.md` (yerel kod dışı).
- **4. İlgili kod dosyaları:** Sağlayıcı hesap ayarları.
- **5. Tespit edilen risk veya eksik:** Alan adı registrar'ı, GitHub `samecityapp/yeriniayirV1`, Vercel ve Supabase hesap 2FA/kurtarma kodları yerel ortamdan doğrulanamaz.
- **6. Yapılan düzeltme:** Yok (panel işlemi).
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Tüm 4 ana hesapta donanım/TOTP 2FA ve kurtarma erişimini doğrulayın.
- **8. Öncelik seviyesi:** `P1`

### Madde 08
- **1. Madde numarası ve başlığı:** 08. Yönetici anahtarlarının ve servis sırlarının istemci paketinde, kaynak deposunda, loglarda veya hata mesajlarında görünmediğini doğrula. Bulguda anahtar değerini paylaşma.
- **2. Durum:** `KALDI` *(Kod `HEAD` `GEÇTİ`, ancak `origin/main` nedeniyle madde `KALDI`)*
- **3. Kanıt dosyası veya test komutu:** `node scripts/security/scan-secrets.cjs --ref=HEAD` (`2.714` dosya, `0` bulgu), `node scripts/cloud/verify_secret_leakage.cjs` (`120` istemci dosyası, `0` sızıntı), `scan-secrets.cjs --ref=origin/main` (bağımsız ajan doğrulaması: `2.109` dosya, **`3` benzersiz Google API anahtarı / `19` eşleşme + `.env.local.backup`**, `EXIT 1`).
- **4. İlgili kod dosyaları:** `lib/supabase-admin.ts`, `app/api/**`, `origin/main:scripts/*`, `origin/main:.env.local.backup`.
- **5. Tespit edilen risk veya eksik:** Mevcut geliştirme dalı (`dda2cd6`) temiz olmasına karşın `origin/main` ve Git geçmişi hâlâ 3 Google `AIza...` anahtarı ile `.env.local.backup` taşımaktadır. Ayrıca `scan-secrets.cjs` `UPSTASH_REDIS_REST_TOKEN` ve `ADMIN_PASSWORD` kalıplarını taramaz.
- **6. Yapılan düzeltme:** `dda2cd6` temizliği doğrulandı; `ADMIN_PASSWORD` sabit yedeği ve admin sızıntıları önceki paketlerde kapatılmıştı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet (ZORUNLU BLOKAJ) — Google Cloud Console'dan 3 eski API anahtarını derhal iptal/rotate edin, `.env.local.backup`'taki eski anahtar/URL durumunu denetleyin ve `main` birleştirmesi öncesi geçmiş temizliğini tamamlayın.
- **8. Öncelik seviyesi:** `P0`

### Madde 09
- **1. Madde numarası ve başlığı:** 09. Supabase tabloları, görünümleri, fonksiyonları ve dosya depolarında herkese açık yetkileri incele. Ziyaretçi yalnızca yayınlanmış ve herkese gösterilecek bilgileri okuyabilsin.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_rls_security.mjs` (`20/20` izole PostgreSQL RLS testi PASS).
- **4. İlgili kod dosyaları:** `supabase/migrations/*`, `app/[lang]/(admin)/jilinrime/{restoranlar,dashboard,etiket-yonetimi,main-page-tags,otel-listesi}/page.tsx`.
- **5. Tespit edilen risk veya eksik:** Yeni Gastronomi V5 tabloları (`ya_publications`, `ya_publication_heads`, `ya_private.admin_members`) izole PostgreSQL üzerinde %100 RLS kilitli çıktı; **ancak** eski `/jilinrime` istemci sayfaları doğrudan `anon` `@/lib/supabase` kullandığından canlı Supabase'de `hotels`, `restaurants`, `tags`, `price_tags`, `analytics_events` tablolarının `anon` yazmaya kapalı olduğu gerçek projede ayrıca doğrulanmalıdır.
- **6. Yapılan düzeltme:** Paket 04–09 `ya_is_admin` / `REVOKE` migrasyonları korundu.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Canlı Supabase SQL Editor üzerinden tüm tablo/view/storage bucket RLS politikalarını doğrulayın.
- **8. Öncelik seviyesi:** `P1`

### Madde 10
- **1. Madde numarası ve başlığı:** 10. Ayrı test verisiyle rol kontrollerini doğrula. Ziyaretçi taslağı okuyamasın, mekân düzenleyemesin veya silemesin. Yönetici işlemlerinde sunucu tarafı yetki kontrolünü doğrula.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/security/policy-tests.cjs` (`74` checks), `node scripts/verify_rls_security.mjs` (`20/20`), `node scripts/verify_paket10_final_release_audit.cjs` (Check 5).
- **4. İlgili kod dosyaları:** `lib/cloud/auth.ts`, `app/api/gastronomy-admin/**`, `middleware.ts`, `lib/admin/offerAdminGuard.ts`.
- **5. Tespit edilen risk veya eksik:** `aal1` JWT, anonim kullanıcı ve üye olmayan hesapların `401/403` reddi izole PG + sahte GoTrue üzerinde test edildi; canlı Supabase Staging/Prod Auth + `ya_publish_order` RPC üzerinde gerçek oturumla denenmesi gerekir.
- **6. Yapılan düzeltme:** Paket 10'da `logout/route.ts` token bağlaması ve `ya_cloud_pending` temizliği tamamlandı, `Check 5` ile `/auth/v1/logout?scope=local` akışı doğrulandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Canlı Supabase üzerinde sıradan kullanıcı vs MFA (`aal2`) yönetici rolleriyle bir duman testi yapın.
- **8. Öncelik seviyesi:** `P1`

### Madde 11
- **1. Madde numarası ve başlığı:** 11. Açık API’lerde veri doğrulama, sayfalama, sonuç sınırı, zaman aşımı ve tekrar deneme sınırlarını incele. Kullanılan paketlerde uygulanabilir güvenlik güncellemelerini kontrol et.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket05_api_middleware_mobile.cjs` (`12/12`), `node scripts/verify_paket07_release_candidate.cjs` (`7A/7B` sayfalama), `package-lock.json` sürüm incelemesi (`next 15.5.28`, `zod 4.6.7`).
- **4. İlgili kod dosyaları:** `next.config.js`, `app/api/gastronomy-public/route.ts`, `app/api/gastronomy/regions/[slug]/route.ts`, `app/api/go/route.ts`, `app/api/track-event/route.ts`, `lib/cloud/client.ts`.
- **5. Tespit edilen risk veya eksik:** Tüm API giriş şemaları Zod + üst sınır + `15 sn` fetch AbortController zaman aşımıyla korundu; ancak ağ kilidi nedeniyle `npm audit` canlı danışma veri tabanına karşı koşturulmadı.
- **6. Yapılan düzeltme:** Paket 10'da `next.config.js` içindeki tüm rotalara uygulanan global `Access-Control-Allow-Origin` ve `Access-Control-Allow-Credentials` CORS başlıkları kaldırıldı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — İnternet erişimli CI/terminalde `npm audit` ile güncel paket güvenlik açıklarını tarayın.
- **8. Öncelik seviyesi:** `P2`

### Madde 12
- **1. Madde numarası ve başlığı:** 12. Form, arama, yönetici girişi ve ücretli uçlarda uygun hız ve kota sınırlarını kontrol et. Doğrudan sağlayıcıya giden çağrıları ayrıca incele. Normal story ziyaretçisinin yanlışlıkla engellenmediğini test et.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket05_api_middleware_mobile.cjs` (CGNAT 200-istek testi), `node scripts/verify_paket07_release_candidate.cjs` (Check 9), `verify_production_ratelimit_config.cjs` (geçerli şekil PASS).
- **4. İlgili kod dosyaları:** `lib/pilot/rateLimit.ts`, `lib/pilot/rateLimitConfig.ts`, `middleware.ts`, `app/api/track-event/route.ts`, `app/api/gastronomy-admin/login/route.ts`.
- **5. Tespit edilen risk veya eksik:** Instagram CGNAT patlamaları statik bölge/sayfalarda `0` 429 döndürdü; ancak `track-event/route.ts` ayrı Upstash `Ratelimit` örneği kurduğundan (`fail-open`) ortak devre kesici dışında kalır ve Vercel canlı ortamında `RATE_LIMIT_CRITICAL_OUTAGE_MODE=block` + gerçek `UPSTASH_*` env doğrulanmalıdır.
- **6. Yapılan düzeltme:** Paket 07–09 hız sınırları korundu; Paket 10'da kök `/feed.xml` ve `/gastronomi-yonetimi` de aynı middleware hız/kapsam koruması altına alındı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Production Vercel ortamında `UPSTASH_REDIS_REST_*` ve `RATE_LIMIT_CRITICAL_OUTAGE_MODE=block` varlığını doğrulayın.
- **8. Öncelik seviyesi:** `P1`

### Madde 13
- **1. Madde numarası ve başlığı:** 13. Varsa harita anahtarını gerekli alan adları ve hizmetlerle sınırla. Araştırma, toplu içerik üretimi ve AI işlerini kimin tetikleyebildiğini doğrula.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_v3_gastronomy.cjs` (`21/21` — Atmosphere SKU/bulk CLI engeli), `node scripts/verify_pilot_security.cjs` (`48/48`).
- **4. İlgili kod dosyaları:** `middleware.ts`, `app/api/gastronomy-admin/{research,jobs,publish}/route.ts`, `scripts/run_region_pipeline.mjs`.
- **5. Tespit edilen risk veya eksik:** Uygulama çalışma anında tarayıcıda Google Maps JS/Places anahtarı kullanmaz (yalnız `maps.google.com/?cid=...` linki verir) ve admin AI işleri çift katmanlı MFA (`aal2`) + Basic auth arkasındadır; ancak `origin/main`'deki eski Google anahtarları iptal edilmeli ve mevcut Google Places/GenAI anahtarlarına GCP HTTP/IP/API kısıtlaması panelden doğrulanmalıdır.
- **6. Yapılan düzeltme:** Paket 02–09 korumaları korundu; Paket 10'da çıplak `/gastronomi-yonetimi` yönlendirme açığı kapatıldı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Google Cloud Console → Credentials altında tüm aktif anahtarlara API/IP kısıtlaması koyun ve eskileri silin.
- **8. Öncelik seviyesi:** `P0`

---

## 3 · Önbellek, veritabanı ve mobil hız (14–23)

### Madde 14
- **1. Madde numarası ve başlığı:** 14. Story açılış sayfası, semt, kategori ve mekân detayının nasıl sunulduğunu derleme çıktısı ve çalışma zamanı ölçümüyle kaydet. Hangi ziyaret sunucu fonksiyonu veya veritabanı sorgusu doğuruyor?
- **2. Durum:** `GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `npm run build` (`181/181` statik sayfa), `node scripts/verify_paket03_perf_and_analytics.cjs` (`7/7`), `node scripts/verify_paket06_traffic_cost_resilience.cjs` (`8/8`), `node scripts/verify_paket10_final_release_audit.cjs` (`PAKET10_HTML_BENCHMARK`).
- **4. İlgili kod dosyaları:** `app/[lang]/(gastronomy)/page.tsx`, `app/[lang]/(gastronomy)/gastronomi/[...segments]/page.tsx`, `app/[lang]/(gastronomy)/gastronomi/mekan/[venueSlug]/page.tsx`, `app/api/gastronomy/regions/[slug]/route.ts`.
- **5. Tespit edilen risk veya eksik:** Yok (Gastronomi V5 ana sayfaları, 92 bölge JSON endpoint'i ve 18 pilot detay sayfası `revalidate = 3600` ile ISR statik olarak üretilmektedir; normal ziyarette `0` DB / `0` Upstash çağrısı oluşur; yalnız eski `/search` veya ilk soğuk bölge ISR hit'i sunucu çalışması tetikler).
- **6. Yapılan düzeltme:** Paket 10 ek SEO etiketleriyle birlikte statik `181/181` üretim derlemesi ve `0` DB/Upstash davranışı korundu.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Hayır.
- **8. Öncelik seviyesi:** `Yok`

### Madde 15
- **1. Madde numarası ve başlığı:** 15. Aynı herkese açık içeriği temiz URL, farklı UTM ve varsa farklı fbclid değerleriyle karşılaştır. Önbellek göstergesi, fonksiyon çalışması ve sorgu sayısını birlikte ölç. Her tıklamada fbclid olacağını varsayma.
- **2. Durum:** `GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket03_perf_and_analytics.cjs` (Check 4.2), `node scripts/verify_paket06_traffic_cost_resilience.cjs` (Scenario A/B `utm_*`/`fbclid`), `node scripts/verify_paket10_final_release_audit.cjs` (Flow A).
- **4. İlgili kod dosyaları:** `components/food/GastronomyPageClient.tsx`, `app/api/gastronomy/regions/[slug]/route.ts`, `middleware.ts`.
- **5. Tespit edilen risk veya eksik:** Vercel Edge CDN katmanında `fbclid`/`utm_*` query parametrelerinin cache-key ayrımı yapıp yapmadığı yerel `next start`'ta tam taklit edilemez, ancak uygulama katmanında `/api/gastronomy/regions/[slug]` bu parametreleri almaz (`0` DB/Upstash).
- **6. Yapılan düzeltme:** Paket 10 Flow A'da `?utm_source=instagram&utm_medium=story` ve `?region=moda&category=pizza&utm_source=instagram` senaryoları doğrulandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Hayır *(canlı Vercel CDN `x-vercel-cache: HIT` gözlemi pilot sırasında teyit edilebilir)*.
- **8. Öncelik seviyesi:** `P3`

### Madde 16
- **1. Madde numarası ve başlığı:** 16. Önbellek güncelliğini dene: editör bir adres değiştirince yeni adres ne zaman görünür? Taslak veya kişisel içerik ortak önbelleğe giriyor mu?
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_p0_security_fixes.cjs` (Group F.3 slug cache invalidation), `node scripts/verify_paket07_release_candidate.cjs` (Check 6 `regionCacheRef` TTL), `middleware.ts` (`private, no-store` admin başlıkları).
- **4. İlgili kod dosyaları:** `components/food/GastronomyPageClient.tsx`, `app/api/gastronomy/regions/[slug]/route.ts`, `app/api/gastronomy-admin/publish/route.ts`.
- **5. Tespit edilen risk veya eksik:** İstemci `regionCacheRef` TTL ve slug invalidasyonu yerelde geçti; ancak statik JSON `revalidate = 3600` (`1 saat`) ile yeni `git push` sonrası gerçek Vercel CDN yayılımı canlıda ölçülmedi. Taslak/admin yanıtları `private, no-store, Vary: Cookie` ile ortak önbellek dışındadır.
- **6. Yapılan düzeltme:** Admin çıkış ve `/gastronomi-yonetimi` çerez/önbellek başlıkları Paket 10'da korundu.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Pilot içerik güncellemesi sonrası canlı CDN yayılım süresini doğrulayın.
- **8. Öncelik seviyesi:** `P2`

### Madde 17
- **1. Madde numarası ve başlığı:** 17. Liste açılırken kartların önceden yüklenmesinin ağ isteği ve bayt maliyetini ölç. Arama yazarken her harfte sorgu gidiyor mu? Büyük listelerde sayfalama ve sorgu indekslerini kontrol et.
- **2. Durum:** `GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket05_api_middleware_mobile.cjs` (`loadHotelSearchCatalog`), `node scripts/verify_paket07_release_candidate.cjs` (Check 7A/7B `245` & `135` otel sayfalama), `node scripts/verify_paket10_final_release_audit.cjs` (Flow B).
- **4. İlgili kod dosyaları:** `components/food/LocationPickerModal.tsx`, `components/food/GastronomyPageClient.tsx`, `lib/db.ts`.
- **5. Tespit edilen risk veya eksik:** Gastronomi konum araması tarayıcı belleğindeki statik liste üzerinde çalışır (tuş vuruşunda `0` ağ isteği); eski otel araması tek seferlik sayfalanmış katalog kullanır.
- **6. Yapılan düzeltme:** Paket 10 Flow B'de arama + sonuçsuz durum + geri/ileri geçmiş geçişi uçtan uca test edildi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Hayır.
- **8. Öncelik seviyesi:** `Yok`

### Madde 18
- **1. Madde numarası ve başlığı:** 18. Fonksiyon ve veritabanı bölgelerini, kullanılan bağlantı yöntemini ve yük altında dolan kaynağı kontrol et. Ayar değişikliğini gerçek sorgu gecikmesiyle gerekçelendir.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** `docs/audits/PAKET_01_ALTYAPI_DENETIMI.md` (yerel kod dışı).
- **4. İlgili kod dosyaları:** `lib/cloud/client.ts`, Vercel Project Settings / Supabase Connection Pooler (`6543`/`5432`).
- **5. Tespit edilen risk veya eksik:** Vercel Functions bölgesinin (`fra1`/`iad1` vb.) Supabase DB bölgesi ile aynı olup olmadığı ve Supavisor Transaction/Session havuz sınırları canlı bulut panelleri görülmeden ölçülemez.
- **6. Yapılan düzeltme:** Yok (panel doğrulaması).
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Vercel Serverless Function bölgesi ile Supabase DB bölgesinin eşleştiğini (ör. Frankfurt `fra1`) teyit edin.
- **8. Öncelik seviyesi:** `P1`

### Madde 19
- **1. Madde numarası ve başlığı:** 19. Kart illüstrasyonları ve varsa fotoğraflarda dosya boyutu, ekran boyutuna uygun sürüm, geç yükleme ve önbellek süresini kontrol et. Aynı görselin depolama çıkışı ve dönüştürme maliyetini birlikte ölç.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `ls -la public/`, `next.config.js` (statik asset + `public/yeriniayir-logo.png` `19.771 B`), `node scripts/verify_paket10_final_release_audit.cjs` (Flow A `/yeriniayir-logo.png` 200 OK).
- **4. İlgili kod dosyaları:** `next.config.js`, `components/food/VenueImage.tsx`, `public/**`.
- **5. Tespit edilen risk veya eksik:** Gastronomi V5 dış üçüncü taraf fotoğraf proxylemesi yerine hafif illüstrasyon/statik logo kullanır; ancak `public/fethiye-*.png` (`~822 KB–1,04 MB`) gibi eski rehber görselleri büyük PNG'dir ve gerçek Vercel Image Optimization kotası canlı ortamda izlenmelidir.
- **6. Yapılan düzeltme:** Paket 10'da olmayan `og-image.jpg` yerine mevcut `public/yeriniayir-logo.png` (`19,3 KB`) kullanıldı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Canlı Vercel Image Optimization tüketimini ve eski büyük PNG görselleri izleyin/gerekirse WebP'e düşürün.
- **8. Öncelik seviyesi:** `P2`

### Madde 20
- **1. Madde numarası ve başlığı:** 20. İlk açılışta indirilen JavaScript, harita ve üçüncü taraf betikleri ölç. Harita kullanılmadan yükleniyorsa ertelemeyi değerlendir.
- **2. Durum:** `GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `npm run build` (`First Load JS shared: 103 kB`, `/[lang]: 149 kB`), `node scripts/verify_paket10_final_release_audit.cjs` (`PAKET10_HTML_BENCHMARK` + Flow A pre-consent `0` analitik isteği).
- **4. İlgili kod dosyaları:** `app/[lang]/layout.tsx`, `components/Analytics.tsx`, `components/CookieConsent.tsx`.
- **5. Tespit edilen risk veya eksik:** Gastronomi V5 sayfaları Leaflet/etkileşimli harita yüklemez (`scriptTags: 11–13`), `/tr` brotli `30.533 B` ve `/mekan/...` brotli `11.315 B`'dir; GA4/Clarity çerez rızası verilmeden yüklenmez.
- **6. Yapılan düzeltme:** Rıza tabanlı analitik kilidi ve haritasız hafif açılış korundu ve Flow A ile yeniden doğrulandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Hayır.
- **8. Öncelik seviyesi:** `Yok`

### Madde 21
- **1. Madde numarası ve başlığı:** 21. iPhone ve orta sınıf Android’de Instagram içinden, ayrıca Safari/Chrome’da mobil veriyle dene. Açılış, filtre, geri tuşu, kaydırma, klavye ve konum izni reddini kontrol et.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** *(Yerel kısmi benzetim)* `node scripts/verify_paket05_api_middleware_mobile.cjs` (5.2), `node scripts/verify_paket10_final_release_audit.cjs` (Flow A/B/C `390x844`/`375x812` Headless Chrome).
- **4. İlgili kod dosyaları:** `components/food/GastronomyPageClient.tsx`, `components/food/LocationPickerModal.tsx`.
- **5. Tespit edilen risk veya eksik:** Başsız Masaüstü Chrome mobil görünümü, gerçek iOS Safari klavye/safe-area davranışı, Android düşük bellek performansı ve Instagram IAB (in-app browser) kısıtlarını birebir temsil etmez.
- **6. Yapılan düzeltme:** GPS modal yarış koşulu (`verify_paket07`) ve `390px`/`375px` yatay taşma yokluğu (`verify_paket10`) yerelde kapatıldı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet (ZORUNLU) — Preview URL üzerinde en az 1 iPhone (Safari + Instagram WebView) ve 1 Android (Chrome) cihazda fiziksel test yapın.
- **8. Öncelik seviyesi:** `P1`

### Madde 22
- **1. Madde numarası ve başlığı:** 22. Mobil hız göstergelerini kaydet. Gerçek kullanım hedefleri: ziyaretlerin yüzde 75’inde LCP ≤ 2,5 sn, INP ≤ 200 ms ve CLS ≤ 0,1. Pilot öncesi cihaz ölçümünü, pilot sonrası saha verisini ayrı göster.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** Yerel Lighthouse / saha CrUX / Vercel Speed Insights verisi canlı ortam olmadan ölçülemedi *(yalnız sunucu HTML bayt boyutları ölçüldü)*.
- **4. İlgili kod dosyaları:** `app/[lang]/(gastronomy)/**`, `next.config.js`.
- **5. Tespit edilen risk veya eksik:** Gerçek hücresel ağ (3G/4G) üzerinde ilk boyama (`LCP`), etkileşim gecikmesi (`INP`) ve düzen kayması (`CLS`) henüz gerçek cihazda veya canlı preview Lighthouse üzerinde ölçülmedi.
- **6. Yapılan düzeltme:** HTML ve brotli boyutları ölçüldü (`/tr/gastronomi/mekan/...` `11.315 B` brotli).
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Preview URL'de mobil PageSpeed Insights / Lighthouse ve gerçek iki telefonda süre ölçümü alın; pilot sonrası Vercel Speed Insights saha p75'ini kaydedin.
- **8. Öncelik seviyesi:** `P1`

### Madde 23
- **1. Madde numarası ve başlığı:** 23. Yol tarifini iki telefonda gerçek story bağlantısından aç. Doğru şubeyi ve harita uygulaması kurulu olmayan durumu kontrol et. Adres harita çalışmasa da görülsün ve kopyalanabilsin.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** *(Veri formatı kısmı geçti)* `node scripts/verify_paket05_api_middleware_mobile.cjs`, `node scripts/verify_paket10_final_release_audit.cjs` (Flow F: `2.425/2.425` mekânda `https://maps.google.com/?cid=...` ve açık adres metni).
- **4. İlgili kod dosyaları:** `lib/gastronomy-v3/regions/*.json`, `components/food/**`, `app/[lang]/(gastronomy)/gastronomi/mekan/[venueSlug]/page.tsx`.
- **5. Tespit edilen risk veya eksik:** Tüm `cid=` URL'leri ve metin adresler snapshotlarda doğrulansa da iki gerçek telefonda Google Maps uygulaması kurulu olan ve olmayan durumlarda Instagram IAB içinden derin bağlantı davranışı denenmedi.
- **6. Yapılan düzeltme:** Yok (fiziksel cihaz testi gerekli).
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Story önizleme linkinden iki telefonda yol tarifine tıklayıp doğru şube pinini ve adres görünürlüğünü doğrulayın.
- **8. Öncelik seviyesi:** `P1`

---

## 4 · Ani yük ve 1.000 ziyaret maliyeti (24–30)

### Madde 24
- **1. Madde numarası ve başlığı:** 24. Geçmiş story bağlantı tıklamaları varsa ilk dakikaların dağılımını kullan. Ziyaret/dakika, eşzamanlı kullanıcı ve istek/saniyeyi ayrı yaz. Hedef, test bütçesi ve erken durdurma eşiği belli olsun.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** `docs/audits/PAKET_06_TRAFiK_MALIYET_KORUMA.md` (varsayımsal kapasite senaryosu).
- **4. İlgili kod dosyaları:** Yok (Instagram Insights verisi ve operasyon bütçesi).
- **5. Tespit edilen risk veya eksik:** Yaklaşık 1M takipçili hesabın geçmiş story tıklama eğrisi (ilk 5 dakikadaki eşzamanlı pik) gerçek analitik panelinden paylaşılmadığı için gerçek tepe RPS tahminidir.
- **6. Yapılan düzeltme:** Scenario A (`3.000` istek) ve B (`2.000` istek) yerel eşik modeli kuruldu.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Geçmiş Instagram story tıklama eğrisini ve erken durdurma eşiğini ekiple belirleyin.
- **8. Öncelik seviyesi:** `P2`

### Madde 25
- **1. Madde numarası ve başlığı:** 25. Canlıya benzer kontrollü ortamda tek semt bağlantısına yoğunlaşan trafiği dene. Farklı takip etiketlerini, boş ve dolu önbelleği kapsa.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket06_traffic_cost_resilience.cjs` (`Scenario A`: Moda/Kadıköy `3.000` istek, `c=10/50/150` basamaklarında `0` 5xx, `0` 429, `0` DB, `0` Upstash).
- **4. İlgili kod dosyaları:** `app/[lang]/(gastronomy)/page.tsx`, `app/api/gastronomy/regions/[slug]/route.ts`.
- **5. Tespit edilen risk veya eksik:** Test yerel loopback `next start` üzerinde çalıştı; gerçek Vercel Edge + dış ağ gecikmesi ve soğuk/ısınmış CDN cache davranışı canlı/staging ortamda denenmedi.
- **6. Yapılan düzeltme:** Paket 06 yük testi Paket 10 kod değişiklikleri sonrasında da yeniden geçildi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Vercel Preview/Staging ortamında tek semt (`?region=moda`) kontrollü duman yük testi yapın.
- **8. Öncelik seviyesi:** `P1`

### Madde 26
- **1. Madde numarası ve başlığı:** 26. Ayrı senaryoda ziyaretçiler farklı semtlere dağılsın, filtre uygulasın ve detaya geçsin. Harici ücretli servisleri kontrolsüz biçimde yük testine sokma.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket06_traffic_cost_resilience.cjs` (`Scenario B`: 22 il çoklu bölge `2.000` istek, `c=10/50/120`, `0` 5xx, `0` 429, `0` DB, `0` Upstash + Headless Chrome 390px filtre/detay E2E).
- **4. İlgili kod dosyaları:** `app/[lang]/(gastronomy)/**`, `scripts/security/network-lock.cjs`.
- **5. Tespit edilen risk veya eksik:** Ağ kilidi sayesinde harici ücretli servislere `0` çağrı gitti; ancak canlı CDN üzerinde farklı iller arası paralel geçiş hızı henüz ölçülmedi.
- **6. Yapılan düzeltme:** Paket 10 kod değişiklikleri sonrası Scenario B yeniden geçildi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Staging/Preview ortamında harici servisleri koruyarak çoklu semt testi yapın.
- **8. Öncelik seviyesi:** `P1`

### Madde 27
- **1. Madde numarası ve başlığı:** 27. Başlangıç taslağı: senaryo başına 2 dk ısınma, 3 dk yükseliş, 5 dk tepe, 5 dk azalma ve toparlanma. 100/500/1.000 eşzamanlı kullanıcı basamaklarını hedefe ve test kapasitesine göre seç.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** Yalnızca kısa süreli yerel `c=10..150` patlama testleri koşuldu (`verify_paket06_traffic_cost_resilience.cjs`); 15 dakikalık `100/500/1.000` VUs kademeli bulut yük testi koşulmadı.
- **4. İlgili kod dosyaları:** Yok (k6/Artillery harici yük testi altyapısı).
- **5. Tespit edilen risk veya eksik:** Uzun süreli (`15 dk` x 2) bellek/soket/Edge ölçeklenme davranışı `500–1.000` eşzamanlı gerçek ziyaretçi altında bulutta kanıtlanmamıştır.
- **6. Yapılan düzeltme:** Yerel bellek takibi (`rssMb: 336,9 -> 522,5 MB` Scenario A/B süresince sızıntısız) kaydedildi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Bütçe sınırı koyarak kademeli bulut yük testini (en azından `100` ve `500` VU hedefiyle) staging/preview üzerinde yürütün.
- **8. Öncelik seviyesi:** `P1`

### Madde 28
- **1. Madde numarası ve başlığı:** 28. İki senaryo için p95/p99 yanıt süresi, 5xx, normal ziyarette 429, önbellekten karşılanma oranı, fonksiyon çağrısı, veritabanı CPU/bağlantı ve yük sonrası toparlanmayı kaydet.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket06_traffic_cost_resilience.cjs`: Scenario A `c=150` → `p95: 312,79 ms`, `p99: 1.263,71 ms`, `0` 5xx, `0` 429, `0` DB/Upstash; Scenario B `c=120` → `p95: 457,49 ms`, `p99: 523,7 ms`, `0` 5xx/429/DB/Upstash.
- **4. İlgili kod dosyaları:** `scripts/verify_paket06_traffic_cost_resilience.cjs`.
- **5. Tespit edilen risk veya eksik:** Yerel ölçüm Vercel CDN cache isabet oranını (`x-vercel-cache`) ve gerçek Supabase DB CPU grafiğini gösteremez.
- **6. Yapılan düzeltme:** Paket 10 kodları üzerinde yeniden doğrulandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Bulut yük testi veya pilot esnasında Vercel Analytics/Logs ve Supabase DB metriklerinden bu kalemleri kaydedin.
- **8. Öncelik seviyesi:** `P1`

### Madde 29
- **1. Madde numarası ve başlığı:** 29. Eşikleri testten önce tanımla. Carbon’un aday hedefleri: 5xx <%0,1; ısınmış tek ortak rotada önbellek isabeti >%95; önbellekte p95 ilk bayt <300 ms. Ölçüm bölgesini belirt. Dinamik rotaları ve beklenen hız sınırlamalarını ayrı değerlendir.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket06_traffic_cost_resilience.cjs` (`%0` 5xx, `%0` 429, yerel `c=10` `p95=17,64–22,30 ms`; `c=150` `p95=312,79 ms`).
- **4. İlgili kod dosyaları:** `docs/audits/PAKET_06_TRAFiK_MALIYET_KORUMA.md`.
- **5. Tespit edilen risk veya eksik:** Tek sunucuda `c=150` eşzamanlılıkta yerel TTFB `312 ms`'ye çıkmıştır; gerçek Edge CDN'de `>%95` cache hit ve `p95 TTFB < 300 ms` hedefi yalnızca belirli Vercel Edge bölgesinden doğrulanabilir.
- **6. Yapılan düzeltme:** Yok (bulut/CDN testi bekliyor).
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — İstanbul/Avrupa ölçüm noktasından ısınmış rotada canlı/preview TTFB ve cache-hit yüzdesini ölçün.
- **8. Öncelik seviyesi:** `P1`

### Madde 30
- **1. Madde numarası ve başlığı:** 30. 1.000 tamamlanmış örnek ziyaret için önce/sonra kullanım farkını ölç. Arka plan tüketimini ayır. Görsel ve analiz gibi tarayıcı kaynaklı istekleri örneğe dahil et. Her kalemde miktar × güncel birim fiyatı hesapla. Kalan kota içindeki ek fatura, kota aşılırsa maliyet ve aylık sabit gider ayrı görünsün.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** `docs/audits/PAKET_06_TRAFiK_MALIYET_KORUMA.md` (varsayımsal tablo), `node scripts/verify_paket10_final_release_audit.cjs` (`PAKET10_HTML_BENCHMARK`).
- **4. İlgili kod dosyaları:** Uygulama dışı gerçek hesap fatura panelleri.
- **5. Tespit edilen risk veya eksik:** Gerçek sağlayıcı tarifeleri ve mevcut kullanım kotası olmadan `1.000` ziyaretin kesin dolar maliyeti/aşım farkı çıkarılamaz.
- **6. Yapılan düzeltme:** Sayfa başı net HTML+Brotli baytları (`11–53 KB` brotli) ölçüldü; `PAKET_06` birim fiyat şablonu hazırlandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Preview/staging'de 1.000 sentetik ziyareti gerçek fatura sayacı farkıyla çarpıp bütçe onayını alın.
- **8. Öncelik seviyesi:** `P1`

---

## 5 · Arıza, yedek ve geri dönüş (31–36)

### Madde 31
- **1. Madde numarası ve başlığı:** 31. Dışarıdan erişim, çalışmayan arama/detay, artan hata, gecikme ve olağandışı harcama için alarm kurulumunu kontrol et. Deneme alarmının sorumluya ulaştığını doğrula.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** `docs/audits/PAKET_09_BACKUP_RECOVERY_ROLLBACK.md`, `docs/audits/MANUEL_YAYIN_ONCESI_ISLEMLER.md`.
- **4. İlgili kod dosyaları:** Sağlayıcı/izleme aracı panelleri (UptimeRobot/Better Stack/Vercel/Supabase/Upstash).
- **5. Tespit edilen risk veya eksik:** Dışarıdan sentetik health check ve hata/gecikme/maliyet deneme alarmı henüz gerçek bildirim kanalına (e-posta/Slack/Telegram/SMS) gönderilip test edilmedi.
- **6. Yapılan düzeltme:** Yapısal JSON güvenlik logları ve acil kesici kodda hazırlandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Dış izleme monitörü kurun (`/tr/gastronomi/mekan/moda-gg-pizza` + `/tr/search`) ve en az bir deneme alarmı tetikleyip ulaştığını doğrulayın.
- **8. Öncelik seviyesi:** `P1`

### Madde 32
- **1. Madde numarası ve başlığı:** 32. Gerekirse gömülü harita, pahalı arama veya yoğun görselleri kapatma yolunu dene. Rehberin temel listesi, adres ve yol tarifi çalışmaya devam etsin. Bu mekanizma yeniden dağıtım gerektiriyorsa süresini ölç.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket07_release_candidate.cjs` (Check 8: yeniden derlemeden `shed -> lockdown -> off`), `node scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs` (Check 8: Redis kesintisi altında `shed` koruması).
- **4. İlgili kod dosyaları:** `lib/pilot/emergencyMode.ts`, `middleware.ts`.
- **5. Tespit edilen risk veya eksik:** Yeniden dağıtım (redeploy) gerektirmeden `UPSTASH` anahtarı üzerinden pahalı arama/API rotaları kapanırken temel gastronomi seçkisi + adres + Google Maps CID linki `200 OK` çalışıyor; ancak canlı Upstash konsolundan tetikleme provası canlıda yapılmadı.
- **6. Yapılan düzeltme:** Paket 09 kesinti penceresi ve Paket 10 regresyonuyla doğrulandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Staging ortamında Upstash anahtarını (`TRAFFIC_EMERGENCY_MODE=shed`) değiştirerek `0`-deploy kapanışı canlı gözlemleyin.
- **8. Öncelik seviyesi:** `P1`

### Madde 33
- **1. Madde numarası ve başlığı:** 33. Veritabanı ve Storage dosyaları için ayrı yedek kapsamını, sıklığı, saklama süresini ve erişimi kaydet. Kabul edilebilir veri kaybı ve dönüş süresini belirle.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `docs/audits/PAKET_09_BACKUP_RECOVERY_ROLLBACK.md` (Bölüm 2–4: Git + JSON snapshot + Supabase DB + Storage sınıflandırması ve RPO/RTO matrisi).
- **4. İlgili kod dosyaları:** `lib/gastronomy-v3/regions/*.json`, `supabase/migrations/*`, `scripts/verify_gastronomy_snapshot_integrity.cjs`.
- **5. Tespit edilen risk veya eksik:** Gastronomi V5 statik içerikleri Git ve JSON snapshotlarda deterministik olarak korunuyor; ancak canlı Supabase planındaki DB günlük yedek / PITR ve Storage bucket yedek sıklığı/saklama süresi panel erişimi olmadan teyit edilemedi.
- **6. Yapılan düzeltme:** Yedek sınıflandırma planı `PAKET_09` içinde belgelendi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Supabase Backups panelini ve Storage yedekleme politikasını doğrulayın.
- **8. Öncelik seviyesi:** `P1`

### Madde 34
- **1. Madde numarası ve başlığı:** 34. Yedeği ayrı bir test ortamına geri yükle. Örnek mekân kaydını, bağlı görseli ve doğru adresi aç. Gerçekleşen dönüş süresini yaz.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** *(Yalnız yerel simülasyon geçti)* `node scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs` (Senaryo 5 & 7 bozuk JSON ve bozuk restored satır testi).
- **4. İlgili kod dosyaları:** `lib/db.ts`, `lib/food/regionDiscovery.ts`, `supabase/migrations/*`.
- **5. Tespit edilen risk veya eksik:** Gerçek bir Supabase yedek/dump dosyasının ayrı bir test/staging projesine geri yüklenip örnek bir kayıt+görsel+adresi doğrulayan ve süreyi ölçen canlı DR tatbikatı henüz gerçekleştirilmedi.
- **6. Yapılan düzeltme:** Restored DB satırlarında bozuk diziler geldiğinde UI'ın `500` atmasını önleyen korumalar `PAKET_09`'da doğrulandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Gerçek Supabase yedeğini staging/test projesine geri yükleyip süreyi ve örnek kaydı kaydedin.
- **8. Öncelik seviyesi:** `P1`

### Madde 35
- **1. Madde numarası ve başlığı:** 35. Önceki sağlam uygulama sürümüne dönüş provası yap. Eski sürümün mevcut veritabanı şeması ve ayarlarla çalıştığını doğrula.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs` (Senaryo 4: `<1s` yerel rollback provası) ve eklemeli (`additive`) şema uyumu denetimi.
- **4. İlgili kod dosyaları:** `supabase/migrations/*`, `next.config.js`, `middleware.ts`.
- **5. Tespit edilen risk veya eksik:** Yerel rollback + geriye uyumlu eklemeli migrasyon kuralı doğrulansa da Vercel Dashboard üzerindeki tek tık **Instant Rollback** butonunun gerçek preview/prod üzerinde provası yapılmadı.
- **6. Yapılan düzeltme:** Yok (`PAKET_09` runbook korundu).
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Vercel Preview üzerinde bir önceki dağılıma Instant Rollback provası yapın.
- **8. Öncelik seviyesi:** `P1`

### Madde 36
- **1. Madde numarası ve başlığı:** 36. Duyuru sırasında teknik müdahale ve Instagram iletişimi için sorumluları belirle. Bozuk sürüm, pahalı servis, kota alarmı ve trafik düşmesine rağmen düzelmeyen sistem için ilk eylemi yaz.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `docs/audits/PAKET_09_BACKUP_RECOVERY_ROLLBACK.md` (Bölüm 5), `docs/audits/MANUEL_YAYIN_ONCESI_ISLEMLER.md`.
- **4. İlgili kod dosyaları:** Runbook belgeleri.
- **5. Tespit edilen risk veya eksik:** Teknik müdahale akışı yazılı; ancak gerçek ekip isimleri/nöbetçi iletişim bilgileri ve kriz anı Instagram hikaye/iletişim metni ataması kullanıcı/ekip onayı bekliyor.
- **6. Yapılan düzeltme:** Manuel acil müdahale checklisti güncellendi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Teknik nöbetçi ve Instagram kriz iletişimi sorumlusunu isimlendirip onaylayın.
- **8. Öncelik seviyesi:** `P2`

---

## 6 · Ölçüm, içerik ve kullanıcı güveni (37–44)

### Madde 37
- **1. Madde numarası ve başlığı:** 37. Bio, story, reklam ve farklı hesap bağlantılarını tutarlı UTM’lerle etiketle. Gerçek bir test tıklamasının doğru kampanyaya yazıldığını ve etiketlerin önbelleği gereksiz bölmediğini doğrula.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket03_perf_and_analytics.cjs`, `node scripts/verify_paket10_final_release_audit.cjs` (Flow A `utm_source=instagram&utm_medium=story`).
- **4. İlgili kod dosyaları:** `components/Analytics.tsx`, `app/api/track-event/route.ts`, `components/food/GastronomyPageClient.tsx`.
- **5. Tespit edilen risk veya eksik:** UTM parametrelerinin sayfayı bozmadığı ve önbellek/DB sorgusu tetiklemediği yerelde geçti; ancak gerçek Google Analytics 4 Real-Time / Clarity panelinde kampanyaya yazılma testi canlı domain üzerinde yapılmadı.
- **6. Yapılan düzeltme:** Paket 10 Flow A ek testleri geçti.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — UTM adlandırma standardını sabitleyip GA4 Real-Time'da tek test tıklaması doğrulayın.
- **8. Öncelik seviyesi:** `P2`

### Madde 38
- **1. Madde numarası ve başlığı:** 38. Mekân görüntüleme, arama, sonuçsuz arama, filtre, telefon ve yol tarifi tıklamalarını doğrula. Aynı eylemi iki kez sayma. Haritaya tıklamayı fiziksel ziyaret veya rezervasyon sayma.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket03_perf_and_analytics.cjs` (`track-event` doğrulama/tekilleştirme), `node scripts/verify_paket10_final_release_audit.cjs` (Flow B sonuçsuz arama & filtre).
- **4. İlgili kod dosyaları:** `app/api/track-event/route.ts`, `app/api/go/route.ts`, `components/food/GastronomyPageClient.tsx`.
- **5. Tespit edilen risk veya eksik:** Çift sayım önleyici dedup ve sonuçsuz arama UX çalışıyor; ancak gastronomi yol tarifi linkleri doğrudan `maps.google.com/?cid=...` çıktığından harita tıklama ölçümü ancak GA4 çıkış bağlantısı (outbound click) olaylarıyla canlı ortamda izlenebilir.
- **6. Yapılan düzeltme:** Paket 10'da Flow B arama & geri/ileri ve Flow A analitik kilidi doğrulandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Canlı GA4/Clarity üzerinde çıkış tıklaması ve arama olay adlarının fiziksel ziyaret olarak etiketlenmediğini doğrulayın.
- **8. Öncelik seviyesi:** `P2`

### Madde 39
- **1. Madde numarası ve başlığı:** 39. Toplanan verileri, analiz/çerez tercihlerini, gizlilik metnini ve log saklama süresini kontrol et. Kişisel bilgileri olay adlarına ve bağlantı parametrelerine koyma.
- **2. Durum:** `KALDI`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket07_release_candidate.cjs` (Check 5 çerez rızası & `#cerez-ayarlari`), `app/[lang]/(main)/(legal)/{gizlilik-politikasi,kvkk-aydinlatma-metni}/page.tsx` kaynak kodu incelemesi.
- **4. İlgili kod dosyaları:** `components/CookieConsent.tsx`, `app/api/track-event/route.ts`, `app/[lang]/(main)/(legal)/cerez-politikasi/page.tsx`, `gizlilik-politikasi/page.tsx`, `kvkk-aydinlatma-metni/page.tsx`, `kullanim-kosullari/page.tsx`, `kullanim-sartlari/page.tsx`.
- **5. Tespit edilen risk veya eksik:** Çerez rızası ve PII parametre temizliği teknik olarak geçti; **ancak** yayındaki `gizlilik-politikasi` ve `kvkk-aydinlatma-metni` sayfalarında hâlâ **`MERSİS/Vergi No: [İlgili Bilgiler Eklenecektir] – Adres: [İlgili Bilgiler Eklenecektir]`** boş yer tutucuları duruyor, `kullanim-kosullari` metni yalnız otel keşfinden bahsediyor ve tekrar sayfa `kullanim-sartlari` içinde `legal@gnkotel.com` e-postası kalmış durumda.
- **6. Yapılan düzeltme:** Paket 10'da 4 aktif yasal sayfaya canonical URL eklendi, tekrar `kullanim-sartlari` `noindex` yapılıp `kullanim-kosullari`'na canonicalize edildi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet (ZORUNLU) — Gerçek MERSİS/Vergi No/Adres bilgilerini ve log saklama sürelerini hukuk onayıyla doldurun, `kullanim-kosullari` metnine gastronomi rehberi kapsamını ekleyin.
- **8. Öncelik seviyesi:** `P1`

### Madde 40
- **1. Madde numarası ve başlığı:** 40. Paylaşılacak seçkideki mekânları tek tek kontrol et: açık mı, doğru şube mi, adres, harita noktası, telefon, saatler, fiyat ve son doğrulama tarihi tutarlı mı? Yanlış bilgi bildirme yolu çalışıyor mu?
- **2. Durum:** `TEST EDİLEMEDİ` *(Yapısal doğrulama geçti; canlı işletme/bilgi bildirme akışı yok)*
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_gastronomy_snapshot_integrity.cjs`, `node scripts/verify_paket10_final_release_audit.cjs` (Flow F: `92` bölge, `2.272` birincil + `153` yakın = `2.425` mekân, `verifiedAt` 2026-11-14..18, `0` eksik koordinat/`cid=`).
- **4. İlgili kod dosyaları:** `lib/gastronomy-v3/regions/*.json`, `lib/gastronomy-v3/policy.ts`.
- **5. Tespit edilen risk veya eksik:** Maliyet kuralı gereği `currentOpeningHours`/`phone` API'den çekilmez ve TL fiyatı yazılmaz; 14–18 Kasım 2026 sonrası kapanmış olabilecek işletmeler için güncel saha/harita kontrolü ve ziyaretçiler için sayfa içi "Yanlış Bilgi Bildir" mekanizması henüz yoktur.
- **6. Yapılan düzeltme:** Tekil `placeId`, `coordinates` ve `https://maps.google.com/?cid=...` bütünlüğü doğrulandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Pilot duyuruda paylaşılacak semtteki (ör. Moda/Kadıköy) mekânların anlık açık durumunu tek tek doğrulayın ve iletişim/hata bildirim bağlantısını (`info@yeriniayir.com` veya form) duyurun.
- **8. Öncelik seviyesi:** `P1`

### Madde 41
- **1. Madde numarası ve başlığı:** 41. Görsel ve metin kullanım haklarını, temsili illüstrasyonların yanıltıcı olup olmadığını ve yayımlanan mekân iddialarının dayanağını kontrol et.
- **2. Durum:** `TEST EDİLEMEDİ` *(Metin kanıt/izolasyon kuralları geçti; üçüncü taraf telif/hukuki izin yerel koddan doğrulanamaz)*
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_visitor_content.cjs` (`10/10`), `node scripts/verify_v3_gastronomy.cjs` (`21/21` dossier kanıt kapısı), `node scripts/verify_paket08_geo_ai_search.cjs` (Jaccard `0.157`).
- **4. İlgili kod dosyaları:** `lib/gastronomy-v3/dossiers/*.json`, `lib/gastronomy-v3/geoPilot.ts`, `public/images/**`, `public/restaurants/**`.
- **5. Tespit edilen risk veya eksik:** Gastronomi V5 ziyaretçi metinleri sübjektif şişirmeden arındırılmıştır ve iç `dossiers` dosyalarında kanıt kaynakları tutulur; ancak `public/` altındaki eski restoran/otel görselleri ve rehber görsellerinin telif hakları/lisans belgeleri bu oturumda hukuki olarak kanıtlanmamıştır.
- **6. Yapılan düzeltme:** Paket 10'da görünür pilot HTML + snapshotlar üzerinde yasaklı sıfat taraması tekrarlandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Paylaşılacak tüm görsellerin (özellikle `public/images/`, `public/restaurants/` ve logo/ikonların) lisans/telif hakkını teyit edin.
- **8. Öncelik seviyesi:** `P1`

### Madde 42
- **1. Madde numarası ve başlığı:** 42. Mobil okunabilirlik, kontrast, dokunma alanları, klavye erişimi, boş liste, bozuk bağlantı, 404 ve ağ hatası ekranlarını dene.
- **2. Durum:** `GEÇTİ` *(Yerel Headless Chrome & statik HTML kapsamı; noter: `not-found.tsx` İngilizce dil çevirisi P3 iyileştirme olarak açıktır)*
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket10_final_release_audit.cjs` (Flows B, C), `node scripts/verify_paket08_geo_ai_search.cjs` (Check 6).
- **4. İlgili kod dosyaları:** `components/food/CategoryBar.tsx`, `components/food/LocationPickerModal.tsx`, `app/[lang]/not-found.tsx`.
- **5. Tespit edilen risk veya eksik:** `390px`/`375px`/`1280px` sıfır taşma, klavye `Escape`, boş arama (`Arama Sonuçları (0)`), `404` ve GPS/hata ekranları doğrulandı (`not-found.tsx` yalnızca EN rotada Türkçe otel metni göstermektedir — P3).
- **6. Yapılan düzeltme:** Paket 10'da Flow B/C ile mobil erişim, boş arama ve hata akışları doğrulandı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Hayır *(Madde 21 kapsamındaki fiziksel cihaz deneyi hariç)*.
- **8. Öncelik seviyesi:** `Yok` *(EN 404 çevirisi için `P3`)*

### Madde 43
- **1. Madde numarası ve başlığı:** 43. HTTPS, alan adı yönlendirmeleri ve yenileme bildirimlerini kontrol et. Canlı sayfalarda indeksleme, site haritası ve ana URL doğru olsun. Test sayfalarının görünürlüğünü ayrıca kontrol et.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs` (`1.529/1.529` sitemap taraması + domain ayrımı + `noindex`), `node scripts/verify_paket10_final_release_audit.cjs` (Flow D).
- **4. İlgili kod dosyaları:** `middleware.ts`, `app/sitemap.ts`, `app/robots.ts`, `next.config.js`, `app/[lang]/(main)/{otel-listesi,(legal)/*}`.
- **5. Tespit edilen risk veya eksik:** `1.529` sitemap URL'si, TR/EN domain `308` yönlendirmeleri, kök `/feed.xml`, admin/test rotalarının `noindex` başlıkları yerelde %100 geçti; ancak gerçek DNS, SSL sertifika yenileme bildirimleri ve Google Search Console mülkiyet/sitemap gönderimi canlı ortam gerektirir (`design-demo`, `preview-food-card`, `fethiye-yemek-rehberi` rotaları `noindex` olsa da auth arkasında değildir).
- **6. Yapılan düzeltme:** Paket 10'da kök `/feed.xml` HTML dönme hatası, Schema `@id` (`www.`), `otel-listesi`/`kullanim-sartlari` `noindex` ve yasal canonical'lar düzeltildi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — DNS/SSL otomatik yenileme uyarılarını ve Search Console `sitemap.xml` gönderimini doğrulayın.
- **8. Öncelik seviyesi:** `P2`

### Madde 44
- **1. Madde numarası ve başlığı:** 44. Duyuruda kullanılacak gerçek bağlantıyı WhatsApp ve sosyal paylaşım önizlemesinde aç. Görsel, başlık, hedef sayfa ve analitik kaydı aynı seçkiyi göstermeli.
- **2. Durum:** `ŞARTLI GEÇTİ`
- **3. Kanıt dosyası veya test komutu:** `node scripts/verify_paket10_final_release_audit.cjs` (Flow A: 8 TR/EN rotada `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card` + `/yeriniayir-logo.png` 200 OK).
- **4. İlgili kod dosyaları:** `lib/gastronomy-v3/geoCatalog.ts` (`buildGeoSocialMetadata`), `app/[lang]/(gastronomy)/**`.
- **5. Tespit edilen risk veya eksik:** HTML metatagları ve görsel varlık yerelde tam geçse de WhatsApp/Instagram/X dış tarayıcılarının (scraper) canlı SSL alan adına erişip görseli önbelleklediği gerçek URL üzerinden denenmelidir.
- **6. Yapılan düzeltme:** Paket 10'da tüm 4 gastronomi rotasına dinamik `openGraph` ve `twitter` meta etiketleri eklendi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Duyuru öncesi kesin URL'yi WhatsApp'ta gerçek bir mesaja yapıştırıp kart önizlemesini gözle onaylayın.
- **8. Öncelik seviyesi:** `P2`

---

## 7 · Pilot ve geniş duyuru kararı (45–48)

### Madde 45
- **1. Madde numarası ve başlığı:** 45. Küçük pilot öncesi temel yolculuğun iki cihazda çalıştığını, verinin korunduğunu, ücretli uçların denetimli olduğunu, alarmın ulaştığını ve geri dönüş yolunu doğrula. Kritik bir kontrol başarısız veya doğrulanamamışsa riski ve gereken işi açıkça yaz.
- **2. Durum:** `KALDI`
- **3. Kanıt dosyası veya test komutu:** Paket 10 yerel testleri (`21/21`), açık kalan maddeler: `08` (P0), `39` (P1), `05/09/18/21/22/23/31/34` (P1).
- **4. İlgili kod dosyaları:** Tüm aday dal (`dda2cd6`) + manuel panel/cihaz ön koşulları.
- **5. Tespit edilen risk veya eksik:** Kod ve yerel güvenlik testleri hazır olmasına rağmen `origin/main` açık Google API anahtarları, yasal yer tutucu metinler, dış izleme deneme alarmı, canlı RLS/yedekten dönüş doğrulaması ve gerçek iki telefon testi henüz tamamlanmamıştır.
- **6. Yapılan düzeltme:** Kod adayındaki bilinen tüm buglar (`10` düzeltme) Paket 10'da kapatıldı.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Pilot açılmadan `MANUEL_YAYIN_ONCESI_ISLEMLER.md` P0/P1 listesini tamamlayın.
- **8. Öncelik seviyesi:** `P0`

### Madde 46
- **1. Madde numarası ve başlığı:** 46. Sınırlı pilotu ölç. Gerçek ziyaret başına istek, veri transferi, kullanıcı hatası, yol tarifi tıklaması ve maliyeti test varsayımlarıyla karşılaştır.
- **2. Durum:** `TEST EDİLEMEDİ`
- **3. Kanıt dosyası veya test komutu:** Henüz gerçek pilot yayını başlatılmadı (ölçüm planı `PAKET_06` ve `PAKET_10`'da tanımlı).
- **4. İlgili kod dosyaları:** `components/Analytics.tsx`, `app/api/track-event/route.ts`.
- **5. Tespit edilen risk veya eksik:** Gerçek takipçi trafiği altında ilk sınırlı story verisi henüz toplanmamıştır.
- **6. Yapılan düzeltme:** Maliyet korumaları ve bayt taban çizgisi kaydedildi.
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Küçük pilot yayını sırasında ilk 1 saatlik gerçek Vercel/Supabase/GA4 metriklerini `PAKET_06` modeliyle kıyaslayın.
- **8. Öncelik seviyesi:** `P2`

### Madde 47
- **1. Madde numarası ve başlığı:** 47. Geniş duyuru kararı için hedef yükte iki senaryonun sonucunu, bütçe payını, yedekten dönüş kanıtını, gerçek cihaz sonuçlarını ve müdahale sorumlusunu birlikte değerlendir. Kararı “Hazır / Şartlı hazır / Ertele” olarak gerekçelendir.
- **2. Durum:** `KALDI` *(Nihai Canlı Karar: **ERTELE** — ön koşullar sonrası pilot için **ŞARTLI HAZIR**)*
- **3. Kanıt dosyası veya test komutu:** `docs/audits/PAKET_10_FINAL_RELEASE_AUDIT.md`, `21/21` yerel regresyon geçer sonucu, ancak canlı bulut/cihaz/sır/hukuk ön koşulları eksik.
- **4. İlgili kod dosyaları:** Bütün yayın adayı (`dda2cd6`).
- **5. Tespit edilen risk veya eksik:** 1 milyon takipçiye geniş duyuru öncesi `P0` anahtar iptali + `P1` yasal metin, bütçe/duraklatma kilidi, canlı yük (`100–500` VU), gerçek yedekten geri dönüş ve gerçek cihaz (`LCP/INP/CLS`) ölçümleri kanıtlanmadan geniş duyuru yapılmamalıdır.
- **6. Yapılan düzeltme:** Tüm kod ve otomatik regresyon engelleri sıfırlandı (`GEÇTİ`).
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Evet — Önce P0/P1 manuel işlemlerle küçük pilotu doğrulayın, ardından geniş duyuru onayı verin.
- **8. Öncelik seviyesi:** `P0`

### Madde 48
- **1. Madde numarası ve başlığı:** 48. Rezervasyon ve ödeme açılacağı zaman ayrı denetim yap: müsaitlik, aynı anda son odayı alan iki kişi, günlük kota, mükerrer işlem, ödeme alınıp onay oluşmaması, sağlayıcı bildirimi, iptal/iade ve müşteriye bildirim.
- **2. Durum:** `KAPSAM DIŞI`
- **3. Kanıt dosyası veya test komutu:** `YeriniAyir_Yayin_Kontrol_Listesi.md:5` ("İlk sürümde otel satışı planın dışında"), `app/[lang]/hoteloffer/page.tsx:220` (pasif/işlemsiz buton).
- **4. İlgili kod dosyaları:** Rezervasyon/ödeme modülü bulunmamaktadır.
- **5. Tespit edilen risk veya eksik:** Gastronomi V5 ilk sürümünde rezervasyon, stok kilitleme veya ödeme işlemi yoktur; gelecekte otel/rezervasyon satışına geçilirse bağımsız güvenlik ve yarış durumu denetimi şarttır.
- **6. Yapılan düzeltme:** Kapsam dışı olarak işaretlendi (`otel-listesi` `noindex`).
- **7. Canlı yayından önce manuel işlem gerekiyor mu?:** Hayır *(Gastronomi V5 yayını için kapsam dışı; satış açılmadan önce zorunlu ayrı denetim gerekir)*.
- **8. Öncelik seviyesi:** `Yok`
