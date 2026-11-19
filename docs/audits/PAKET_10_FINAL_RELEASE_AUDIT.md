# Yerini Ayır — Paket 10 Nihai Yayın Öncesi Denetim Raporu

**Denetim Tarihi:** 19 Kasım 2026  
**Depo:** `samecityapp/yeriniayirV1` (`/Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures`)  
**Yayın Adayı Dalı:** `feat/paket-10-final-release-audit`  
**Başlangıç Temeli (Paket 09 `HEAD`):** `d3758a318e3f865d2acab287271b9cefa41ebc62`  
**Paket 10 Kod & Test Commit'i:** `dda2cd6a2d9a669fbee9e14b7a2d6defd93f01ed`  
**Denetim Kapsamı:** Görev 1–9 süreklilik denetimi, 48 maddelik yayın kontrol listesi doğrulaması, 6 uçtan uca akış (A–F), bağımsız ikinci ajan denetimi ve 21/21 temiz kurulum regresyon kapısı.

---

## 1. İki Ayrı Nihai Karar (Özet)

| Karar Boyutu | Nihai Karar | Kısa Gerekçe |
| :--- | :--- | :--- |
| **A. Yerel kod ve otomatik test kararı** | **GEÇTİ** | Paket 10'da saptanan 6 başlangıç açığı ve bağımsız ikinci ajanın yakaladığı 3 P1 + 1 P2 kod/SEO hatası düzeltildi; `21/21` regresyon kapısı (`181/181` build sayfası, `1.529/1.529` sitemap URL'si, `92` bölge / `2.425` mekân, `2.714` dosyada `0` sır, korunan 5 dosyada `0` diff) `exit 0` ile geçti. |
| **B. Gerçek canlı yayın kararı** | **ERTELE** *(Manuel ön koşullar kapandığında küçük pilot için **ŞARTLI HAZIR**)* | `origin/main` üzerinde 3 adet açık Google `AIza...` API anahtarı + `.env.local.backup` hâlâ erişilebilir durumda (iptal/rotasyon şart); `gizlilik-politikasi` ve `kvkk-aydinlatma-metni` sayfalarında `[İlgili Bilgiler Eklenecektir]` yer tutucuları var; `jilinrime` eski istemci tablolarında canlı Supabase RLS, canlı Vercel/Supabase/Upstash panelleri/bütçe alarmları, gerçek DB yedeğinden geri yükleme tatbikatı ve iki fiziksel telefonda (iOS Safari / Android Chrome / Instagram WebView) test henüz yapılmadı. |

---

## 2. Görev 1–9 Bütünlük Zinciri ve Teknik Sürümler

*Paket 01–09 arası tüm güvenlik, performans, API/middleware, maliyet dayanıklılığı, Codex kapanışları, GEO/AI arama ve felaket kurtarma kontrolleri tek aday üzerinde korunmuştur.*

- **Doğrulanan Paket Sürümleri (`package.json` / `package-lock.json`):** `next@15.5.28`, `react@18.3.1`, `@supabase/supabase-js@2.86.0`, `@upstash/ratelimit@2.0.8`, `@upstash/redis@1.36.2`, `zod@4.6.7`.
- **Korunan Dosyalar Bütünlüğü (`git diff --exit-code` = 0):**
  - `components/nearby-places/RestaurantCard.tsx`
  - `components/nearby-places/PremiumRestaurantCard.tsx`
  - `lib/pilot/rateLimitConfig.ts`
  - `scripts/verify_production_ratelimit_config.cjs`
  - `tsconfig.json`
- **API Route Envanteri:** `app/` altında tam `20` `route.ts` / `route.js` dosyası korundu (hiç yeni route eklenmedi/silinmedi).
- **Sır Taraması:**
  - `HEAD` (`dda2cd6`): `node scripts/security/scan-secrets.cjs --ref=HEAD` → **`2.714` dosya, `0` kimlik bilgisi/sır**.
  - İstemci Paketi: `node scripts/cloud/verify_secret_leakage.cjs` → **`120` statik istemci dosyası, `0` sızıntı**.
  - `origin/main` (`125c51108d5ef88f09baccf00dd044653b00e365`): **HÂLÂ `KALDI`** — `2.109` dosyada `3` benzersiz `AIza...` Google API anahtarı (`19` eşleşme) ve `.env.local.backup` mevcuttur; bulut konsolundan iptal edilmeden canlıya çıkılamaz.

---

## 3. Paket 10'da Tespit Edilip Kapatılan Hatalar

### 3.1 İlk Denetimde Kapatılan 6 Bulgu

1. **Tüm 4 Gastronomi Rotasında Sosyal Önizleme (`openGraph` / `twitter`) Eksikliği (#44):**
   - `lib/gastronomy-v3/geoCatalog.ts` içine `buildGeoSocialMetadata` eklendi (`public/yeriniayir-logo.png` — `19.771` bayt yerel varlık).
   - `app/[lang]/(gastronomy)/page.tsx`, `app/[lang]/(gastronomy)/gastronomi/page.tsx`, `app/[lang]/(gastronomy)/gastronomi/[...segments]/page.tsx` ve `app/[lang]/(gastronomy)/gastronomi/mekan/[venueSlug]/page.tsx` rotalarının tamamına (`!preview` durumunda) `og:title`, `og:description`, `og:url`, `og:image`, `og:type` ve `twitter:card=summary_large_image` eklendi.
2. **Global Sabit CORS Başlıkları (`next.config.js`):**
   - `/:path*` üzerindeki `Access-Control-Allow-Credentials: true`, `Access-Control-Allow-Origin: https://yeriniayir.com`, `Access-Control-Allow-Methods` ve `Access-Control-Allow-Headers` başlıkları kaldırılarak aynı-köken (same-origin) yalıtımı sıkılaştırıldı.
3. **Admin Oturum Kapatma ve Bekleyen Çerez Temizliği (`app/api/gastronomy-admin/logout/route.ts`):**
   - `@supabase/auth-js` `GoTrueClient.js` & `GoTrueAdminApi.js` kaynak kodu incelendi: `persistSession: false` istemcide `auth.signOut({ scope: 'local' })` çağrısı GoTrue `/logout` isteğini atladığından, kullanıcı JWT'si ile anon `apikey` kullanarak `POST /auth/v1/logout?scope=local` gönderen `client.auth.admin.signOut(token, 'local')` davranışı `cloudClient(token)` ile bağlandı, gerekçe belgelendi ve varsa `ya_cloud_pending` çerezi de temizlendi.
4. **Schema.org `@id` Domain Uyumsuzluğu ve `og-image.jpg` 404 Hatası (`lib/utils.ts`, `lib/schema-generator.ts`, `app/[lang]/(main)/rehber/[slug]/page.tsx`):**
   - `lib/utils.ts`: `DOMAIN_TR` `'www.yeriniayir.com'`, `DOMAIN_EN` `'www.worldandhotels.com'` olarak güncellendi (`geoSchema.ts` `https://www.yeriniayir.com/#organization` kimliğiyle %100 uyum sağlandı).
   - `lib/schema-generator.ts`: Bulunmayan `/og-image.jpg` yerine `/yeriniayir-logo.png` kullanıldı ve URL `encodeURI(...)` ile sarıldı.
   - `app/[lang]/(main)/rehber/[slug]/page.tsx`: `generateArticleSchema` çağrısına `slug_en` ve `lang` parametresi eklendi.
5. **Eski `gnkhotels.com` RSS Beslemesi (`app/[lang]/(main)/feed.xml/route.ts`):**
   - `gnkhotels.com`, `"GNK Hotels RSS Generator"` ve Gastronomi V3 yasaklı sıfat alt-dizeleri (`"en seçkin"`) temizlendi; TR/EN dil ayrımı (`www.yeriniayir.com/rehber/...` vs `www.worldandhotels.com/guide/...`), CDATA/XML öznitelik kaçışı (`escapeCdata`, `escapeXmlAttr`) ve `encodeURI` eklendi.
6. **Yasal Sayfa Canonical'ları ve Eski Taslak/Tekrar Rotaların `noindex` Edilmesi:**
   - `app/[lang]/(main)/otel-listesi/page.tsx` → `noindex, nofollow` + `middleware.ts` `X-Robots-Tag: noindex, nofollow`.
   - `app/[lang]/(main)/(legal)/kullanim-sartlari/page.tsx` → `noindex, follow` (`middleware.ts` HTTP `X-Robots-Tag: noindex, nofollow`) ve canonical `https://www.yeriniayir.com/kullanim-kosullari`.
   - 4 aktif yasal sayfa (`cerez-politikasi`, `gizlilik-politikasi`, `kullanim-kosullari`, `kvkk-aydinlatma-metni`) için tekil TR `https://www.yeriniayir.com/<slug>` canonical tanımlandı.

### 3.2 Bağımsız İkinci Ajan Denetiminde Yakalanıp Kapatılan 4 Ek Hata

Bağımsız `research` alt ajanı (`8aca855d-5cec-4f94-a4d9-4b58df3fe7af`) çalışma ağacını denetleyerek 3 P1 ve 1 P2 somut hatayı yakaladı; tamamı düzeltilip yeniden doğrulandı:

1. **Kök `/feed.xml` URL'sinin XML Yerine HTML Dönmesi (`middleware.ts`):**
   - `app/[lang]/layout.tsx` ve RSS `<atom:link>` tarafından duyurulan `/feed.xml`, `pathname.includes('.')` kuralı nedeniyle locale yönlendirmesini atlayıp `<html lang="feed.xml">` gastronomi anasayfası döndürüyordu. `middleware.ts` içine `isEnglishDomain` bilincine sahip `/feed.xml` → `/${tr|en}/feed.xml` rewrite eklendi (yeni `route.ts` dosyası açmadan).
2. **`feed.xml` DB-Kesinti Yedeği ve `isSupabaseIsolated` Uyumunun Korunması (`app/[lang]/(main)/feed.xml/route.ts`):**
   - Canlı DB hatasında boş 0 öğeli `<channel>` dönmesi ve `verify_paket05`'in `isSupabaseIsolated` kontrolü geri kazandırıldı; hem izole modda hem de DB hata yakalama (`catch`) yolunda `getLocalFallbackArticles(lang)` + tam `renderRssXml` çıktısı sağlanıyor.
3. **Çıplak `/gastronomi-yonetimi` Yolunun Açık Anasayfaya Düşmesi (`middleware.ts`):**
   - `/tr/` öneki olmayan `/gastronomi-yonetimi` isteği `NextResponse.next()` döndüğü için genel gastronomi anasayfasını `<html lang="gastronomi-yonetimi">` olarak sunuyordu. `moda-kadikoy-pilot` kalıbıyla eksik locale için `/${tr|en}/gastronomi-yonetimi` rewrite eklendi.
4. **İngilizce Mekân Başlığında Tekrarlı Kadıköy Etiketi (`app/[lang]/(gastronomy)/gastronomi/mekan/[venueSlug]/page.tsx`):**
   - `carsi-ciya-sofrasi` sayfasında oluşan `Çiya Sofrası (Kadıköy, Kadikoy)` tekrarlanması `(Kadikoy)` olarak düzeltildi.

---

## 4. Uçtan Uca (A–F) Testleri, Sitemap Farkı & Bayt Ölçümleri

Tüm 6 akış `scripts/verify_paket10_final_release_audit.cjs` ile yerel derlenmiş `next start` + Başsız Chrome + ağ egress kilidi (`network-lock.cjs`) altında çalıştırıldı ve **`6/6 PASS`** aldı (`69,5 sn`):

- **Akış A (Instagram Story + Sosyal Önizleme):** `390x844` dokunmatik mobilde `/tr?utm_source=instagram&utm_medium=story&utm_campaign=moda_launch` ve `/tr?region=moda&category=pizza&utm_source=instagram` 200 OK, `0` sayfa hatası, çerez rızası öncesi `0` GA4/Clarity isteği; 8 TR/EN sosyal rota kartı + `/yeriniayir-logo.png` HTTP `200` (`>10 KB`).
- **Akış B (Arama, Sonuçsuz Durum, Kategori, İleri/Geri, `/search`):** Modalda `olmayanbolge123` → `Arama Sonuçları (0)`, `Karaköy` seçimi → kart render, kategori geçişi, `goBack`/`goForward` geçmiş uyumu ve `/tr/search?q=hicvarolmayanotel999` → HTTP `200` + `X-Robots-Tag: noindex, nofollow`.
- **Akış C (390px Mobil GPS ve Taşma):** GPS reddi (`code=1`), zaman aşımı (`code=3`), `Escape` sonrası eski/geçersiz callback yoksayma yarışı, gerçek Moda koordinatı (`40.9806, 29.0265`) ile otomatik bölge seçimi; `390px`, `375px` ve `1280px` görünümlerde sıfır yatay taşma (`scrollWidth <= innerWidth + 1`).
- **Akış D (AI Botları & Teknik SEO):** `OAI-SearchBot`, `GPTBot`, `PerplexityBot`, `Googlebot` 200 OK + JSON-LD + `Access-Control-Allow-*` yokluğu; `/rehber/...` & `/guide/...` Schema `@id` domain uyumu (`0` `og-image.jpg`); `/tr/feed.xml`, `/en/feed.xml` ve domain-duyarlı kök `/feed.xml` geçerli XML; **`1.529` sitemap URL** (`otel-listesi` ve `kullanim-sartlari` hariç); yasal canonical'lar ve `noindex` başlıkları doğrulandı.
- **Akış E (Yönetici Güvenliği):** Supabase modunda yetkisiz `/tr/jilinrime` `401` (`noindex, nofollow`, `private, no-store`), Basic modda `ADMIN_PASSWORD` yokken `checkPilotAdmin(null)` → **`503`**, çapraz köken `POST /api/gastronomy-admin/logout` → `403`, aynı köken `POST` → yerel GoTrue `/auth/v1/logout?scope=local` çağrısı + `ya_cloud_admin` ve `ya_cloud_pending` çerez silme doğrulandı. *(Not: Live izole `next start` test süreci build-time `NEXT_PUBLIC_SUPABASE_POLICY=ISOLATED` ile derlendiğinden, GoTrue HTTP iptal isteği aynı rotanın `loadTs` ile bulut-politikası enjekte edilmiş doğrudan çalıştırması üzerinden doğrulanmıştır.)*
- **Akış F (Veri Bütünlüğü & Sayfa Boyutu Ölçümleri):**
  - `lib/gastronomy-v3/regions/`: `93` JSON dosyası (`92` yayınlı bölge snapshot'ı + `istanbul-kadikoy-nearby-pool.json` yardımcı havuzu).
  - Yayınlı `92` bölgede **`2.272` birincil + `153` yakın öneri = `2.425` mekân**, tüm birincil `placeId` değerleri benzersiz (`2.272/2.272`), `0` eksik koordinat, `0` hatalı CID URL, `0` yasaklı ziyaretçi metni (`verify_gastronomy_snapshot_integrity.cjs` digest: `153d8f8c58707cd0`).

| Rota (`next start` canlı HTML çıktısı) | Ham HTML (Bayt) | Gzip (Bayt) | Brotli (Bayt) | `<script src>` Sayısı |
| :--- | ---: | ---: | ---: | ---: |
| `/tr` | `192.680` | `38.549` | `30.533` | `13` |
| `/tr/gastronomi` | `128.014` | `16.755` | `12.200` | `12` |
| `/tr/gastronomi/istanbul/kadikoy/moda` | `495.978` | `88.505` | `53.433` | `12` |
| `/tr/gastronomi/mekan/moda-gg-pizza` | `72.890` | `15.132` | `11.315` | `11` |

### Sitemap Fark Özeti (`1.537 -> 1.529`, net `-8` URL)

- **`7be51e2` (`1.537` URL) → `HEAD` (`1.529` URL):** **`-22` hatalı URL çıkarıldı, `+14` geçerli URL eklendi.**
- Çıkarılan `22` URL: `worldandhotels.com/guide/<yalnız-TR-mock-slug>` biçiminde 404 veren `21` geçersiz URL + UTF-8 kodlanmamış `/rehber/likya-yolu-fethiye-günübirlik-rotalar`.
- Eklenen `14` URL: `https://www.yeriniayir.com/rehber`, `https://www.worldandhotels.com/guide`, percent-kodlu `likya-yolu-fethiye-g%C3%BCn%C3%BCbirlik-rotalar`, `10` geçerli İngilizce `fallbackArticles` `/guide/...` URL'si ve `https://www.worldandhotels.com/hakkimizda`.

---

## 5. Tam 21/21 Temiz Kurulum Regresyon Sonuçları

Tüm kontroller `rm -rf work` sonrası çalıştırılmış ve `21/21 exit 0` vermiştir:

| # | Doğrulama Kapısı / Komut | Süre | Sonuç / Kapsam | Durum |
| :--- | :--- | ---: | :--- | :--- |
| 1 | `node scripts/security/scan-secrets.cjs --ref=HEAD` | `41.0s` | `2.714` dosya (`dda2cd6`), `0` sır | **GEÇTİ** |
| 2 | `node scripts/security/policy-tests.cjs` | `0.4s` | `74` politika & staging izolasyon testi *(mock Auth/RPC)* | **GEÇTİ** |
| 3 | `node scripts/verify_rls_security.mjs` | `1.2s` | İzole PostgreSQL `20/20` RLS testi *(yerel PG)* | **GEÇTİ** |
| 4 | `node scripts/verify_pilot_security.cjs` | `0.6s` | `48/48` pilot Auth & CSRF testi | **GEÇTİ** |
| 5 | `node scripts/verify_staging_preflight.cjs` | `4.4s` | `28` staging yapılandırma denetimi *(çevrimdışı)* | **GEÇTİ** |
| 6 | `UPSTASH_REDIS_REST_URL=https://sample-preflight-check.upstash.io UPSTASH_REDIS_REST_TOKEN=sample-token RATE_LIMIT_CRITICAL_OUTAGE_MODE=block node scripts/verify_production_ratelimit_config.cjs` | `0.1s` | Prod rate-limit env şekli PASS *(env olmadan fail-closed `exit 1`)* | **GEÇTİ** |
| 7 | `node scripts/verify_v3_gastronomy.cjs` | `7.0s` | `21/21` Gastronomi V3.7 kuralı *(çevrimdışı fixture)* | **GEÇTİ** |
| 8 | `node scripts/verify_gastronomy_snapshot_integrity.cjs` | `0.5s` | `92` bölge (`93` JSON), `2.272` birincil, `18` pilot (`digest=153d8f8c58707cd0`) | **GEÇTİ** |
| 9 | `node scripts/verify_visitor_content.cjs` | `0.3s` | `10/10` ziyaretçi metin izolasyonu | **GEÇTİ** |
| 10 | `npx tsc --noEmit` | `2.1s` | `0` TypeScript hatası | **GEÇTİ** |
| 11 | `npm run build` | `13.6s` | `181/181` statik sayfa, middleware `111 kB` | **GEÇTİ** |
| 12 | `node scripts/cloud/verify_secret_leakage.cjs` | `0.1s` | `120` statik istemci dosyası, `0` sızıntı | **GEÇTİ** |
| 13 | `node scripts/verify_p0_security_fixes.cjs` | `32.3s` | `25/25` P0 güvenlik & ortam sınırı | **GEÇTİ** |
| 14 | `node scripts/verify_paket03_perf_and_analytics.cjs` | `10.1s` | `7/7` performans & rıza sonrası analitik | **GEÇTİ** |
| 15 | `node scripts/verify_paket05_api_middleware_mobile.cjs` | `5.0s` | `12/12` API envanteri (`20` route), CGNAT & mobil | **GEÇTİ** |
| 16 | `node scripts/verify_codex_audit_closures.cjs` | `20.4s` | `6/6` Codex kapanış yeniden doğrulaması | **GEÇTİ** |
| 17 | `node scripts/verify_paket06_traffic_cost_resilience.cjs` | `9.4s` | `8/8` (`Scenario A: 3.000`, `Scenario B: 2.000`, `0` 5xx/429/DB/Upstash) | **GEÇTİ** |
| 18 | `node scripts/verify_paket07_release_candidate.cjs` | `109.4s` | `10/10` GPS yarış, arama sayfalama, dinamik `shed/lockdown` | **GEÇTİ** |
| 19 | `node scripts/verify_paket08_geo_ai_search.cjs` | `6.8s` | `6/6` GEO/AI botlar, Jaccard `0.157 < 0.35` | **GEÇTİ** |
| 20 | `node scripts/verify_paket09_backup_recovery_and_geo_sitemap.cjs` | `40.1s` | `9/9` felaket/kurtarma & **`1.529/1.529` sitemap taraması** | **GEÇTİ** |
| 21 | `node scripts/verify_paket10_final_release_audit.cjs` | `69.5s` | `6/6` Paket 10 Akış A–F & bayt ölçümü | **GEÇTİ** |

---

## 6. Açık Riskler, Mock Sınırları ve Canlı Yayın Ön Koşulları

### Yerelde Kanıtlanamayan Gerçek Ortam Sınırları
1. **Gerçek Bulut Panelleri ve Yapılandırma Eşleşmesi:** Vercel (`APP_ENVIRONMENT`, `VERCEL_ENV`, `SUPABASE_PRODUCTION_AUTHORIZED=1`, `GASTRONOMY_PRODUCTION_AUTHORIZED=1`, `RATE_LIMIT_CRITICAL_OUTAGE_MODE=block`), Vercel Spend Management, Supabase Spend Cap, PITR/otomatik yedekleme ve Upstash kotaları yerel erişim dışında olduğu için doğrulanamadı.
2. **Gerçek Fiziksel Cihazlar ve Üçüncü Taraf Betikler:** Gerçek iPhone Safari, Android Chrome, Instagram WebView, hücresel veri performansı (`LCP/INP/CLS`), GA4/Clarity gerçek ağ yüklemesi ve harita uygulaması olmayan telefonda yol tarifi akışı test edilmedi.
3. **Canlı İşletme ve Telif Kontrolleri:** `2.425` mekânın 14–18 Kasım 2026 dışındaki anlık açık/kapalı durumu/saatleri ve eski otel/rehber görsellerinin telif/kullanım izinleri yerel testle doğrulanamaz.

### Kalan Öncelikli Açıklar
- **P0 — `origin/main` Sızdırılmış Anahtarlar:** 3 Google `AIza...` anahtarı ve `.env.local.backup` `origin/main` üzerinde duruyor; anahtarlar Google Cloud'dan iptal edilmeli ve history temizliği planlanmalıdır.
- **P1 — Yasal Metin Yer Tutucuları:** `gizlilik-politikasi/page.tsx` ve `kvkk-aydinlatma-metni/page.tsx` sayfalarındaki `[İlgili Bilgiler Eklenecektir]` alanları gerçek şirket MERSİS/Vergi No/adresiyle değiştirilmeli (`kullanim-sartlari` içindeki `legal@gnkotel.com` tekrarından ayrı olarak `kullanim-kosullari` metni gastronomi rehberini de kapsayacak şekilde gözden geçirilmelidir).
- **P1 — Eski `jilinrime` İstemci Bileşenleri ve Canlı RLS:** `jilinrime/{restoranlar,dashboard,etiket-yonetimi,main-page-tags,otel-listesi}` doğrudan `anon` `@/lib/supabase` kullandığından canlı Supabase'de anon yazma/okuma RLS kilitleri manuel doğrulanmalıdır.
- **P2 (Bilinen Minör Teknik Borçlar):** `track-event/route.ts` ayrı Upstash `Ratelimit` örneği (`fail-open` catch), `lib/cloud/auth.ts` `sameOrigin` HTTP proxy toleransı, `app/[lang]/layout.tsx` görece esnek CSP (`unsafe-inline`/`unsafe-eval`), `OfferManager.tsx` teklif tablosunda yinelenen `offer.region` hücresi, `otel/[id]/page.tsx` EN canonical'ında `yeriniayir.com` kullanımı, `Footer.tsx` `gnkoteller` Instagram bağlantısı, `not-found.tsx` yalnızca Türkçe otel metni, `/el` yerel kodu desteği ve `app/[lang]/(admin)/design-demo` / `fethiye-yemek-rehberi` / `preview-food-card` rotalarının yalnız `noindex` ile korunması (tasarım değişikliği gerektirmediği için kapsam dışı bırakılmıştır).

Detaylı 48 maddelik döküm için [48_MADDE_NIHAI_KONTROL_MATRISI.md](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/docs/audits/48_MADDE_NIHAI_KONTROL_MATRISI.md), operatör aksiyonları için [MANUEL_YAYIN_ONCESI_ISLEMLER.md](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/docs/audits/MANUEL_YAYIN_ONCESI_ISLEMLER.md) ve bağımsız devir için [CODEX_FINAL_INDEPENDENT_REVIEW_HANDOFF.md](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/docs/audits/CODEX_FINAL_INDEPENDENT_REVIEW_HANDOFF.md) belgelerine bakınız.
