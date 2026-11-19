# PAKET 07 — CODEX BAĞIMSIZ DENETİM BULGULARININ KAPATILMASI

**Tarih:** 19 Kasım 2026  
**Taban Commit (`feat/paket-06-traffic-cost-resilience`):** `98185599d276cdb3183bca3a2dfddbdab2745be2` *(içinde `P1-01` ve `P2-01` uzlaşısı `8ac9496a670a000bf4dd6cd42888c95b5802f569` dahildir)*  
**Çalışma Dalı:** `fix/paket-07-codex-audit-closures`  
**Uygulama & Regresyon Testi Commit SHA (`14` dosya):** **`84890ee8e685d2dad09584deff348993c82b79cc`**  
**İzole Çalışma Ağacı:** `/Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures` *(sparse checkout; `work/` dizini bağlı değildir)*  
**Referans Codex Raporu:** [CODEX_BAGIMSIZ_PAKET_02_05_DENETIMI.md](file:///Users/erdems/Documents/ChatGPT/yeriniayirv1/audit-paket02-05/docs/audits/CODEX_BAGIMSIZ_PAKET_02_05_DENETIMI.md)

> **NET KARAR ÖZETİ:**
> - **Kod ve Otomatik Doğrulama Kapıları (`16/16` Kapı):** **GEÇTİ** — Codex bağımsız denetimindeki `5` açık teknik bulgunun tamamı (`P1-02`, `P2-02`, `P2-03`, `P2-04`, `P2-05` + §4.5 istemci bölge önbelleği) yeniden üretildi, kapatıldı ve hem eski hata senaryoları hem yeni regresyon testleri gerçek derlenmiş Next.js + Headless Chrome üzerinde doğrulanarak `exit 0` verdi (ek olarak Paket 06 uzlaşısındaki `P1-01` ve `P2-01` de `feat/paket-06-traffic-cost-resilience` tabanından devralındı ve tüm kapılar bu dalda da çalıştırıldı).
> - **Canlı Yayın Öncesi Genel Karar:** **ŞARTLI GEÇTİ** — Yerel uygulama/test katmanındaki kapatmalar tamdır; ancak Codex ve Paket 04–06 raporlarında ayrılan **`P1-03` (`origin/main` maruz Google anahtar iptali + geçmiş temizliği)**, gerçek **Vercel/Supabase/Upstash canlı bulut kimlik, RLS, CDN ve bütçe limitleri** ile **fiziksel mobil cihaz (iOS Safari / Instagram WebView)** doğrulamaları yerel ortamda test edilemedi (`Test edilemedi`) — canlıya çıkış öncesi kullanıcı panel adımları zorunludur. Production deploy, `git push`, `main` merge veya canlı veritabanı yazması yapılmamıştır.

---

## 1. Worktree Güvenliği ve Codex Çalışma Alanı Koruması

Hiçbir mevcut çalışma ağacı ve Codex tarafından bırakılan tamamlanmamış/commit edilmemiş çalışma ezilmemiştir:
- **Korunan Codex Worktree'leri (Salt Okunur):**
  - `/Users/erdems/Documents/ChatGPT/yeriniayirv1/audit-paket02-05` (`2f7db00` detached HEAD; `?? docs/audits/CODEX_BAGIMSIZ_PAKET_02_05_DENETIMI.md` değişmeden korundu)
  - `/Users/erdems/Documents/ChatGPT/yeriniayirv1/independent-fixes` (`fix/codex-independent-regressions`; Codex'in 5 kısmi değişikliği ve untracked dosyaları olduğu gibi bırakıldı; yalnızca `gastronomy-policy-inputs.json` salt okunur kopyalandı)
  - `/Users/erdems/Documents/ChatGPT/yeriniayirv1/security-worktree` (`fix/codex-p0-security`, `b208160` olduğu gibi bırakıldı)
- **Ayrı Çalışma Dalları ve Alanları:**
  - **Görev 6 (Aşama 1):** `feat/paket-06-traffic-cost-resilience` -> `/Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost`
  - **Codex Bulgularını Kapatma (Aşama 2):** `fix/paket-07-codex-audit-closures` -> `/Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures`

---

## 2. Önceki Hatalı Davranış vs. Düzeltme Sonrası Kanıtlar (5 Bulgu + Devralınan P1-01/P2-01)

| # | Codex Bulgusu | Düzeltme Öncesi Yeniden Üretim (Kırmızı) | Uygulanan Düzeltme | Düzeltme Sonrası Doğrulama (Yeşil) |
|---|---|---|---|---|
| **1** | **`P1-02` — Staging preflight sahte `PASS`** | `STAGING_SUPABASE_PROJECT_REF=synthetic-staging-fixture`, `GASTRONOMY_AUTH_MODE` eksik iken [verify_staging_config.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_staging_config.cjs) `exit 0 (PASS)` döndü; aynı env için runtime `cloudConfig()` hata fırlattı (`Supabase security configuration rejected`). | [verify_staging_config.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_staging_config.cjs) doğrudan [lib/cloud/config.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/cloud/config.ts) (`cloudConfig()`) ve varsa [lib/pilot/rateLimitConfig.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/rateLimitConfig.ts) (`validUpstashConfig()`) kurallarını çalıştırır; [verify_staging_preflight.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_staging_preflight.cjs) gerçek `STAGING_REFS[0]` (`vhptlecaixpawtxnhsde`) + `supabase` modu ve `28` negatif/pozitif vaka ile güncellendi. | `verify_staging_preflight.cjs` **`28/28` PASS**; eski `synthetic-staging-fixture` artık **`exit 1`** ile reddediliyor ([verify_codex_audit_closures.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_codex_audit_closures.cjs) `Check 1`). |
| **2** | **`P2-02` — GPS modalı geç yanıt yarışı** | [LocationPickerModal.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/food/LocationPickerModal.tsx) yalnız `isOpenRef.current` kontrol ediyordu; modal kapatılıp tekrar açıldığında eski bekleyen `getCurrentPosition` yanıtı yeni açılan modalı kapatıp URL'yi değiştirebiliyordu. | `gpsRequestRef` epoch sayacı eklendi; her kapanış, `useEffect([isOpen])` temizliği ve yeni `Konumumu Kullan` tıklamasında sayaç artırılır (`requestId !== gpsRequestRef.current` ise hem success hem error callback yoksayılır). UI tasarımı değişmedi. | Headless Chrome `390px` E2E (`Check 2`): İstek #0 bekletildi -> Escape -> tekrar aç -> Moda koordinatı döndü -> URL `/tr` kaldı, yeni modal açık kaldı, mesaj sızmadı; geç hata (#1) da yoksayıldı; yeni modalda taze istek (#2) `/tr?region=moda&category=pizza` ile başarıyla yönlendirdi. |
| **3** | **`P2-03` — `excludeBbox` hatalı `0m` eşleşmesi** | Tüm 92 bölgede `findNearestPublishedRegion({ lat: 36.87425, lng: 30.61575 })` (`antalya-konyaalti` `excludeBbox` merkezi) **`antalya-konyaalti`, `distanceMeters: 0`** döndü; Kilitbahir (`40.148, 26.379`) ise **`canakkale-merkez`, `85m`** döndü. | [lib/food/maps.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/food/maps.ts): `if (excluded) continue;` ile dışlanan bölge adaylıktan çıkarıldı; dış noktalarda da `decomposeAllowedBoundaryRects` + `distanceToAllowedBoundaryMeters` (`bbox \ excludeBbox`) hesaplanıyor. | `Check 3`: Hem Konyaaltı `excludeBbox` merkezi hem Kilitbahir iç/kenar noktaları hariç tutuldu; oyuk köşesinin dışındaki nokta gerçek izinli sınır mesafesini (`>1.200m`) ölçtü; sentetik örtüşen `Region B` fallback seçimi doğrulandı. |
| **4** | **`P2-04` — Temiz checkout'ta gastronomi testinin kırılması** | `work/` dizini olmayan temiz checkout'ta `node scripts/verify_v3_gastronomy.cjs` satır `567`'de `places-cache.json must exist after pipeline run` hatasıyla **`exit 1`** verdi. | Sır taramasından temiz (`0` bulgu) [gastronomy-policy-inputs.json](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/fixtures/gastronomy-policy-inputs.json) (`87` bölge) eklendi; [verify_v3_gastronomy.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_v3_gastronomy.cjs) canlı `lib/gastronomy-v3/policy.ts` + `definitions/*.ts` üzerinden offline replay (`acceptedCount` dahil) yapar hale getirildi, `places-cache.json` disk zorunluluğu kaldırıldı, `6` zincir-öncelik (Gate 2) negatif kontrol beklentisi güncellendi ve [.github/workflows/verification-gates.yml](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/.github/workflows/verification-gates.yml) eklendi. | Hem `work/` dizinsiz çalışma alanında hem tam izole `/tmp/ya-clean-checkout-*` dizininde `verify_v3_gastronomy.cjs` **`21/21` (`exit 0`)** geçti (`Check 4`). |
| **5A** | **`P2-05` — Çerez rızası olmadan GA4/Clarity & reddedilen analitik** | [app/[lang]/layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/layout.tsx) `microsoft-clarity` ve `gtag/js` script'lerini kullanıcı tercihi olmadan koşulsuz yüklüyordu. | [lib/cookieConsent.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/cookieConsent.ts) + [ConsentManagedAnalytics.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/ConsentManagedAnalytics.tsx) oluşturuldu: varsayılan `Consent Mode v2` `denied` + `ga-disable-* = true`; onay (`analytics: true`) gelmedikçe **`0` GA4/Clarity `<script>`** enjeksiyonu; [CookieBanner.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/ui/CookieBanner.tsx) `COOKIE_CONSENT_EVENT` yayınlar ve açılışta kayıtlı rızayı uygular; ret/iptalde Clarity durdurulur, loader script'leri kaldırılır ve `_ga*`/`_cl*` çerezleri temizlenir; [PageViewTracker.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/PageViewTracker.tsx) açık ret durumunda `/api/track-event` atlamaz. Görsel tasarım korundu. | Chrome E2E (`Check 5a`): İlk açılış (`0` dış istek) -> Reddet -> Yenile (`0` dış istek + otel detayda `0` `/api/track-event`) -> Kabul Et (GA4 & Clarity script'leri yüklendi) -> İptal Et & Yenile (`ga-disable=true`, `0` yeni dış istek). |
| **5B** | **§4.5 — Süresiz istemci bölge önbelleği (`regionCacheRef`)** | [GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/food/GastronomyPageClient.tsx) `regionCacheRef` süresiz ve sınırsız `Map` tutuyordu; açık sekmede ISR/yayın sonrası eski veri kalabiliyordu. | `5 dk` (`300.000 ms`, HTTP `max-age=300` ile uyumlu; tarayıcı testi için güvenli `__YA_REGION_CACHE_TTL_MS` alt/üst sınırı ile) TTL + `32` bölge sınırı + süresi dolan kayıtlarda `cache: 'no-cache'` taze doğrulama + `visibilitychange` ile arka plandan dönülen açık sekmede sessiz yenileme eklendi. | Chrome E2E + HTTP proxy (`Check 5b`): TTL içinde `Moda -> Karaköy -> Geri` dönüşünde **`0` ek istek**; TTL sonrasında HTTP disk önbelleği `max-age=1` geçerli olsa bile `Cache-Control: max-age=0` (Fetch `no-cache`) ile güncellenmiş `[CANLI YENILENDI v2]` verisi çekilip DOM'da gösterildi. |

**Devralınan Paket 06 Uzlaşısı (`8ac9496` — [rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/rateLimit.ts), [rateLimitConfig.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/rateLimitConfig.ts), [verify_production_ratelimit_config.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_production_ratelimit_config.cjs)):**
- `P1-01`: Bulut ortamlarında yalnız `https://<id>.upstash.io` (`validUpstashConfig`) geçerli kabul edilir; eksik/bozuk Upstash konfigürasyonu artık runtime kesintisiyle aynı `handleCriticalOutageFallback` kapısına girer (Production'da varsayılan `503 outage-blocked`, `emergency` modunda `6/60s` global tavan).
- `P2-01`: Rolling sliding-window `expiresAt` son timestamp'e taşındı, havuz/UA taşmasında canlı sayaç kovası silinmez; `verify_paket06_traffic_cost_resilience.cjs` `Check 1.5` (`t=10001ms` -> `1` kabul / `29` ret + 4.200 kova taşma koruması) ile doğrulandı.

---

## 3. Tam Regresyon Doğrulama Tablosu (`16/16` Kapı — Son Kod Üzerinde `exit 0`)

| # | Komut | Gerçek Gözlemlenen Sonuç | Durum |
|---|---|---|---|
| 1 | `node scripts/security/scan-secrets.cjs` *(ve `--ref=HEAD`)* | `2.689` dosya (`working`) / HEAD temiz, `0` kimlik bilgisi | **GEÇTİ** |
| 2 | `node scripts/security/policy-tests.cjs` | `74` ortam / URL / capability / staging / `Vary` kontrolü | **GEÇTİ** |
| 3 | `node scripts/verify_rls_security.mjs` | İzole PostgreSQL 17.11 UNIX sokette `20/20` RLS & MFA SQL | **GEÇTİ** |
| 4 | `node scripts/verify_pilot_security.cjs` | `48/48` pilot auth, CSRF & payload kontrolü | **GEÇTİ** |
| 5 | `node scripts/verify_staging_preflight.cjs` | **`28/28`** runtime `cloudConfig` uyumlu staging preflight vakası | **GEÇTİ** |
| 6 | `node scripts/verify_production_ratelimit_config.cjs` | `https://<id>.upstash.io` şekli + `RATE_LIMIT_CRITICAL_OUTAGE_MODE=block` `PASS` | **GEÇTİ** |
| 7 | `node scripts/verify_v3_gastronomy.cjs` *(`work/` olmadan)* | **`21/21`** çevrimdışı V3 gastronomi + `87` bölge canlı politika replay'i | **GEÇTİ** |
| 8 | `node scripts/verify_visitor_content.cjs` | `10/10` ziyaretçi DTO izolasyonu | **GEÇTİ** |
| 9 | `npx tsc --noEmit` | `0` TypeScript hatası | **GEÇTİ** |
| 10 | `npm run build` | `113/113` statik/SSG sayfa, `92` bölge JSON, `/[lang]` First Load `149 kB`, `ƒ Middleware 110 kB` | **GEÇTİ** |
| 11 | `node scripts/cloud/verify_secret_leakage.cjs` | `115` istemci paket dosyasında `0` sızıntı | **GEÇTİ** |
| 12 | `node scripts/verify_p0_security_fixes.cjs` | `25/25` Server Action / CSRF / Cloud MFA / Preview izolasyonu E2E | **GEÇTİ** |
| 13 | `node scripts/verify_paket03_perf_and_analytics.cjs` | `7/7` ISR/SSG, `/api/track-event`, Chrome `390px` & `1440px` E2E | **GEÇTİ** |
| 14 | `node scripts/verify_paket05_api_middleware_mobile.cjs` | `12/12` API envanteri, CGNAT/bypass, `2425` CID & mobil tarayıcı E2E | **GEÇTİ** |
| 15 | `node scripts/verify_codex_audit_closures.cjs` | **`6/6`** (preflight + GPS yarış + `excludeBbox` + `work/`'sız temiz checkout + çerez rızası + önbellek TTL E2E) | **GEÇTİ** |
| 16 | `node scripts/verify_paket06_traffic_cost_resilience.cjs` | **`8/8`** (`P1-01`/`P2-01` + `Scenario A` `3.000` req `1,625.1 RPS`, `Scenario B` `2.000` req `2,179.8 RPS`, `0` 5xx/`429`/DB/Upstash + Acil `shed`) | **GEÇTİ** |

---

## 4. Yerelde Test Edilemeyenler (`Test edilemedi`) ve Nihai Kullanıcı Panel Kontrol Listesi

### Test Edilemeyenler
- Canlı Vercel Global CDN üzerinde `x-vercel-cache: HIT/MISS`, `utm_*`/`fbclid` Edge cache anahtarı ve gerçek aylık Vercel/Supabase/Upstash fatura & kredi tüketimi.
- Gerçek Supabase GoTrue MFA (TOTP) akışı, `42` canlı RESTRICTIVE RLS politikası ve uzak Staging (`vhptlecaixpawtxnhsde`) <-> Production (`jerkkxwgddujigsbeqwo`) ayrımının bulut panellerinde uygulanmış hali.
- Canlı Upstash Redis çoklu PoP/Edge bağlantısı ve güvenilir Vercel proxy IP başlık davranışı.
- Fiziksel iOS Safari, Android Chrome ve Instagram WebView üzerinde gerçek GPS izin diyaloğu, arka plan geçişi ve `maps.google.com/?cid=` universal-link açılışı.
- Uzak `origin/main` ve Git geçmişindeki sızmış Google API anahtarlarının Google Cloud Console üzerinden iptal/rotasyon durumu (`P1-03`).

### Biriktirilen Manuel Bulut Panel İşlemleri (Yayın Öncesi Zorunlu)
1. **Google Cloud Console (`P1-03` Yayın Engeli):**
   - `origin/main` ve geçmiş commit'lerde görünen `3` Google API anahtarını iptal edin/yenileyin; kalan aktif anahtarlara HTTP referrer / IP / yalnız gerekli API kısıtı ve aylık bütçe uyarısı tanımlayın. (`main` temizliği ve gerekirse kontrollü Git history temizliği kullanıcı onayıyla ayrı adım olarak planlanmalıdır.)
2. **Vercel Dashboard (Project Settings):**
   - Production vs Preview environment variable kapsamlarını doğrulayın: `SUPABASE_PRODUCTION_AUTHORIZED=1` & `GASTRONOMY_PRODUCTION_AUTHORIZED=1` yalnız Production'da olsun; Preview ortamına canlı `SUPABASE_SERVICE_ROLE_KEY` ve `jerkkxwgddujigsbeqwo` URL/ref verilmesin; Preview için `APP_ENVIRONMENT=staging`, `VERCEL_ENV=preview`, `GASTRONOMY_AUTH_MODE=supabase`, `GASTRONOMY_CLOUD_ENV=staging` ve `vhptlecaixpawtxnhsde` atansın.
   - Production ortamında geçerli `UPSTASH_REDIS_REST_URL` (`https://<id>.upstash.io`) ve `UPSTASH_REDIS_REST_TOKEN` mutlaka tanımlı olsun (`RATE_LIMIT_CRITICAL_OUTAGE_MODE` varsayılan `block`).
   - Billing & Spend Management: Pro plan (`$20/ay`), `%50 / %75 / %100` uyarıları ve "Pause production deployments" kararını ayarlayın; Vercel Firewall Attack Challenge Mode erişimini ve acil anahtar `TRAFFIC_EMERGENCY_MODE` kullanımını (`off` varsayılan) not edin.
3. **Supabase Dashboard (`jerkkxwgddujigsbeqwo` Production & `vhptlecaixpawtxnhsde` Staging):**
   - Her iki projede `supabase/migrations/20261029193000_lockdown_rls_policies.sql` ve onayınızla `supabase/proposed/20261101_gastronomy_cloud_admin.sql` (cloud admin `ya_is_admin` + MFA `aal2`) durumunu ve `42` RESTRICTIVE politikayı doğrulayın; Production'da Spend Cap = `ON` ve güncel Egress/Storage durumunu teyit edin.
4. **Upstash Console:**
   - Production için ayrı Redis DB açıp **Max Monthly Budget** ve `%70 / %90` uyarı e-postalarını etkinleştirin.

---

## 5. Değiştirilen / Eklenen Dosyalar (`fix/paket-07-codex-audit-closures`)

- **Kod & CI (`84890ee8e685d2dad09584deff348993c82b79cc`, `14` dosya):**
  - [.github/workflows/verification-gates.yml](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/.github/workflows/verification-gates.yml) *(Yeni)*
  - [app/\[lang\]/layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/layout.tsx)
  - [components/ConsentManagedAnalytics.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/ConsentManagedAnalytics.tsx) *(Yeni)*
  - [components/PageViewTracker.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/PageViewTracker.tsx)
  - [components/food/GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/food/GastronomyPageClient.tsx)
  - [components/food/LocationPickerModal.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/food/LocationPickerModal.tsx)
  - [components/ui/CookieBanner.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/ui/CookieBanner.tsx)
  - [lib/cookieConsent.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/cookieConsent.ts) *(Yeni)*
  - [lib/food/maps.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/food/maps.ts)
  - [scripts/fixtures/gastronomy-policy-inputs.json](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/fixtures/gastronomy-policy-inputs.json) *(Yeni)*
  - [scripts/verify_codex_audit_closures.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_codex_audit_closures.cjs) *(Yeni)*
  - [scripts/verify_staging_config.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_staging_config.cjs)
  - [scripts/verify_staging_preflight.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_staging_preflight.cjs)
  - [scripts/verify_v3_gastronomy.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_v3_gastronomy.cjs)
- **Rapor Commit'i (`fix/paket-07-codex-audit-closures`):** Bu belge ([PAKET_07_CODEX_BULGULARI_KAPATMA.md](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/docs/audits/PAKET_07_CODEX_BULGULARI_KAPATMA.md)) izleyen commit ile eklenmiştir.
