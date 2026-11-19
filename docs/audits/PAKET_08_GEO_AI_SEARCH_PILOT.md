# PAKET 08 — GEO VE YAPAY ZEKA ARAMA MOTORU OPTİMİZASYONU (MODA / KADIKÖY PİLOT)

**Tarih:** 19 Kasım 2026  
**Aktif Çalışma Ağacı:** `/Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures`  
**Başlangıç Tabanı:** `feat/paket-07-codex-closures-and-rc` (`1310f91e1ffb8d8e2a172c24be551f51a3af74e3`)  
**Çalışma Dalı:** `feat/paket-08-geo-ai-search-pilot`  
**GEO Uygulama & Test Commit SHA (`22` dosya):** **`83f8e6cb96072f688710bdf15c0c166585e27a67`** (`83f8e6c`)  
**Hedef:** ChatGPT Search (`OAI-SearchBot`/`ChatGPT-User`), Gemini/Google (`Googlebot`/`Google-Extended`), Perplexity (`PerplexityBot`/`Perplexity-User`) ve Microsoft Copilot (`Bingbot`) tarayıcılarının Yerini Ayır gastronomi içeriklerini JavaScript gerektirmeksizin, doğru URL hiyerarşisi ve Schema.org yapısıyla keşfedebilmesini sağlamak; öncelikli olarak Moda & Kadıköy pilotu üzerinde çalışır kod ve otomatik ölçüm testleri üretmek.

> **NİHAİ DURUM: YEREL KOD & `18/18` KAPIDAN TAM GEÇİŞ (`ŞARTLI GEÇTİ` — CANLI ARAMA MOTORU / PANEL DOĞRULAMALARI YAYIN SONRASI BEKLENİR)**
> - Önce/sonra build ve `18/18` temiz checkout regresyon paketi tek geçişte `exit 0` ile geçti (`6/6` yeni GEO ölçüm ve tarayıcı testi dahil).
> - Production deploy, `git push`, `main` merge, canlı veritabanına yazım veya manuel bulut panel değişikliği **yapılmamıştır**.

---

## 0. Başlangıç Doğrulaması, Disk Yönetimi ve Korunan Çalışmalar

- **Başlangıç Doğrulaması:** Görev başında `HEAD` ve `feat/paket-07-codex-closures-and-rc` commit'inin tam olarak `1310f91e1ffb8d8e2a172c24be551f51a3af74e3` olduğu ve ağacın temiz bulunduğu doğrulandı (`c946b9a` veya daha eski dallar temel alınmadı).
- **Disk Koruma Kararı:** `/dev/disk3s5` üzerinde `~2.1–2.2 Gi` boş alan bulunduğundan ikinci bir `.next` (~`773 MB`) üretecek yeni git worktree açılmadı; mevcut `/Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures` deposunda `1310f91` üzerinden yeni bağımsız dal (`feat/paket-08-geo-ai-search-pilot`) açıldı.
- **Korunan Dosyalar & Ajan Çalışma Alanları (Değiştirilmedi / Ezilmedi):**
  - [lib/pilot/rateLimitConfig.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/rateLimitConfig.ts) ve [scripts/verify_production_ratelimit_config.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_production_ratelimit_config.cjs) (`git diff --exit-code 8ac9496` -> `exit 0`)
  - [components/nearby-places/RestaurantCard.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/nearby-places/RestaurantCard.tsx) ve [components/nearby-places/PremiumRestaurantCard.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/nearby-places/PremiumRestaurantCard.tsx) (`git diff --exit-code 1310f91` -> `exit 0`)
  - `app/` altındaki API `route.ts` envanteri `20` dosya olarak korundu (`verify_paket05` `Check 1.1` uyumu için `llms.txt` / `llms-full.txt` statik `public/` varlığı olarak üretildi).
  - `/Users/erdems/Documents/ChatGPT/yeriniayirv1/*` ve diğer `/Users/erdems/Documents/Codex/*` worktree'lerine dokunulmadı.

---

## 1. 7 GEO Öncelik Maddesinin Mimari & Kod Karşılıkları

### Öncelik 1 — AI Arama Motorlarının Keşfedilebilirliği (`robots.ts`, `llms.txt`, `sitemap.ts`)
- [app/robots.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/robots.ts): Production modda `Googlebot`, `Google-Extended`, `GoogleOther`, `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `PerplexityBot`, `Perplexity-User`, `Bingbot`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, `Applebot`, `Applebot-Extended` ve `*` ajanları için `/`, `/llms.txt`, `/llms-full.txt` açık izinli; `/jilinrime/`, `/gastronomi-yonetimi/`, `/moda-kadikoy-pilot/`, `/design-demo`, `/preview-food-card`, `/fethiye-yemek-rehberi`, `/api/` engellidir. Hem `yeriniayir.com/sitemap.xml` hem `worldandhotels.com/sitemap.xml` bildirilir. Staging/Preview'da `disallow: /` korunur.
- [scripts/generate_geo_llms_files.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/generate_geo_llms_files.cjs): `FORBIDDEN_VISITOR_COPY_REGEX` ve sızıntı kapısından geçen [public/llms.txt](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/public/llms.txt) (`9.355` B) ile Moda/Kadıköy ve `92` bölge özetini içeren [public/llms-full.txt](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/public/llms-full.txt) (`119.638` B) dosyalarını deterministik üretir.
- [app/sitemap.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/sitemap.ts): Supabase'e bağımlı olmadan (`V3_LOCATIONS` + `PILOT_VENUE_IDS` üzerinden) toplam **`1.537` URL (`677.410` B)** içerir; eski `db.hotels` / `db.articles` blokları başarısız olsa bile gastronomi sitemap'i bozulmaz.

### Öncelik 2 — JavaScript Çalıştırılmadan Anlamlı HTML Okunabilirliği
- [components/food/GeoSemanticSections.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/food/GeoSemanticSections.tsx) ve [components/food/CategoryBar.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/food/CategoryBar.tsx) / [components/food/GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/components/food/GastronomyPageClient.tsx):
  - Mevcut kök sayfa (`/tr`, `/en`) kartları ile `CategoryBar` görsel tasarımı değiştirilmeden korundu; kök sayfaya kompakt `<GeoRootCrawlDirectory>` bağlantıları, hiyerarşik sayfalara ise JS kapalıyken de tüm `<a href>` sekme linkleri, breadcrumb, kategorilere ayrılmış **tüm mekan adları, adresleri, Google puanları, `Ne Sipariş Etmeli?`, `Ayrıca Dene`, tam `Gitmeden Bil` maddeleri ve `https://maps.google.com/?cid=...` bağlantıları** basıldı.
  - **Önce vs Sonra No-JS Entity Recall:** Önceden istemci fetch arkasında kaldığı için ham HTML'de `0/29` Moda mekanı bulunurken, yeni `/tr/gastronomi/istanbul/kadikoy/moda` sayfasının görünür ham HTML'inde **`29/29` (%100) Moda mekanı** ve `/tr/gastronomi/istanbul/kadikoy` sayfasında **`32/32` (%100) Kadıköy mekanı** JS çalışmadan okunabilmektedir (`Check 2`).

### Öncelik 3 — İndekslenebilir Şehir, İlçe, Semt, Kategori ve Seçki URL Mimarisi
- [lib/gastronomy-v3/geoCatalog.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/gastronomy-v3/geoCatalog.ts) & [app/[lang]/(gastronomy)/gastronomi/[...segments]/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(gastronomy)/gastronomi/%5B...segments%5D/page.tsx) & [app/[lang]/(gastronomy)/gastronomi/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(gastronomy)/gastronomi/page.tsx):
  - **TR (`www.yeriniayir.com`):** `/gastronomi`, `/gastronomi/<il>` (`21` il), `/gastronomi/<il>/<ilce>` (saf ilçe hub + 2 segmentli bölgeler), `/gastronomi/<il>/<ilce>/<semt>` (`92` bölge), `/gastronomi/.../<kategori>` (yalnız aktif `585` bölge-kategori kombinasyonu; budanan kategoriler **`404`**), `/gastronomi/mekan/<id>` (`18` pilot).
  - **EN (`www.worldandhotels.com`):** `/gastronomy`, `/gastronomy/<city>/...` ve `/gastronomy/venue/<id>` (hem [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/middleware.ts) hem [next.config.js](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/next.config.js) rewrite kurallarıyla tam eşlemeli).
  - Build süresini ve çıktı boyutunu korumak için build zamanında yalnız Moda/Kadıköy pilot hiyerarşisi (`30` rota) + `18x2` (`36`) pilot mekân + `2` dizin sayfası statik üretilir; diğer tüm il/ilçe/semt/kategori sayfaları sıfır-DB `revalidate = 3600` ISR ile sunulur.

### Öncelik 4 — Schema.org, Sitemap, Canonical ve `hreflang`
- [lib/gastronomy-v3/geoSchema.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/gastronomy-v3/geoSchema.ts), [lib/schema-generator.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/schema-generator.ts), [app/[lang]/layout.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/layout.tsx):
  - Sayfa türüne göre `Organization`, `WebSite`, `CollectionPage`, `ItemList`, `BreadcrumbList`, `FAQPage` ve mekân türüne özel `@type` (`Restaurant`, `CafeOrCoffeeShop`, `Bakery`, `IceCreamShop`, `BarOrPub`) + `PostalAddress`, `GeoCoordinates`, `hasMap` (`?cid=`), `hasMenu`/`MenuSection` üretildi.
  - Ziyaretçi izolasyon kuralına uygun olarak **`reviewCount` ve `userRatingCount` hiçbir Schema.org veya HTML çıktısında basılmaz**; global `Organization` şemasındaki yasaklı `"en iyi"` kelimesi temizlendi ve `manifest: '/manifest.webmanifest'` düzeltildi.
  - Her indekslenebilir sayfada doğru `<link rel="canonical">` ve karşılıklı `hreflang="tr-TR"`, `hreflang="en"`, `hreflang="x-default"` eşlemesi sağlandı (`Check 3`).

### Öncelik 5 — AI Bot Erişimi, Middleware, Güvenlik ve Acil Durum Koruması
- [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/middleware.ts): `/llms.txt` ve `/llms-full.txt` statik `config.matcher` bypass listesine eklendi; İngilizce `/gastronomy` ve `/venue/` URL eşlemeleri `applicationMiddleware` içinde yönetildi. Yönetici/API güvenlik kapılarında (`jilinrime`, `moda-kadikoy-pilot`, `gastronomi-yonetimi`, `/api/gastronomy-admin/*`) hiçbir `User-Agent` için ayrıcalık açılmadı.
- [lib/pilot/emergencyMode.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/pilot/emergencyMode.ts): Tüm GEO gastronomi yolları `isCoreGastronomyVisitorPath` kapsamına alındığından **normal trafikte ve `shed`/`lockdown` modunda `0` Upstash çağrısı** ile **`200 OK`** hizmet verir.
- [app/api/gastronomy-admin/publish/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/api/gastronomy-admin/publish/route.ts): Yayın sonrası ilgili `/tr/gastronomi/...` ve `/en/gastronomi/...` sayfalarını da `revalidatePath` ile tazeler.

### Öncelik 6 — 18 Seçkin Moda & Kadıköy Pilot Mekân Detay Sayfası (Anti-Doorway / Anti-Thin-Content)
- [lib/gastronomy-v3/geoPilot.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/lib/gastronomy-v3/geoPilot.ts) & [app/[lang]/(gastronomy)/gastronomi/mekan/[venueSlug]/page.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/app/%5Blang%5D/(gastronomy)/gastronomi/mekan/%5BvenueSlug%5D/page.tsx):
  - Tüm `2.277` mekân için otomatik şablon sayfaları oluşturulması `dynamicParams = false` + explicit `PILOT_VENUE_IDS` (`9` Moda + `9` Kadıköy = **`18` pilot mekân**) ile mimari olarak engellendi (pilot dışı ID'ler -> `404` ve sitemap dışı).
  - Her pilot mekân için tamamen özgün mutfak kimliği, sipariş rehberi, sokak/ulaşım bağlamı, kategori içi karşılaştırma, `<= 450 m` yürüme mesafesi komşu seçki bağlantıları ve mekâna özel 3 SSS eklendi; 18 TR sayfasının 153 ikili karşılaştırmasında maksimum kelime kümesi Jaccard benzerliği **`0.157`** (`< 0.35` eşiğinin çok altında) ölçüldü (`Check 4`).

### Öncelik 7 — Otomatik GEO Ölçüm & Regresyon Test Altyapısı
- [scripts/verify_paket08_geo_ai_search.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_paket08_geo_ai_search.cjs): Soket egress kilitli (`network-lock.cjs`) gerçek `next start` + mock Upstash/Supabase + Headless Chrome üzerinde `6` kapsamlı GEO kapısını otomatik çalıştırır ve ölçer (`6/6 PASS`).

---

## 2. Önce (`1310f91`) vs Sonra (`83f8e6c`) Build & GEO Ölçüm Karşılaştırması

| Metrik | Önce (`1310f91`) | Sonra (`83f8e6c`) | Fark / Değerlendirme |
|---|---|---|---|
| **Build Süresi (`npm run build`)** | `14.29 sn` (`14.288 ms`) | İlk derleme: `31.23 sn` (`31.232 ms`) · Sıcak cache temiz build: **`13.19 sn` (`13.186 ms`)** | Kabul edilebilir; sıcak build süresi korunuyor |
| **Prerender Manifest Rotaları (`.next/prerender-manifest.json`)** | `102` | **`170`** (`+68` statik GEO rotası: `/tr|en/gastronomi`, `30` hiyerarşi, `36` pilot mekân) | Yapılandırılmış kontrollü artış |
| **Next Build Statik Sayfa Çıktısı** | `113/113` | **`181/181`** | Tüm pilot rotalar statik |
| **İstemci JS Paketi (`.next/static`)** | `5.493.025 B` (`~5,24 MiB`) | **`5.506.370 B`** (`~5,25 MiB`, `+13,3 KB`) | Mevcut vitrin JS yükü korundu |
| **Sunucu / Statik HTML+RSC Çıktısı (`.next/server/app`)** | `10.928.508 B` (`~10,42 MiB`) | **`32.294.564 B`** (`~30,80 MiB`) | `68` tam içerikli statik HTML + `.rsc` sayfası + `661,5 KB` `sitemap.xml` nedeniyle artış |
| **Edge Middleware Paketi** | `110 kB` | **`111 kB`** (`+1 kB`) | Neredeyse sabit |
| **İstemci Secret Scan Kapsamı** | `115` statik dosya (`0` sızıntı) | **`119` statik dosya** (`0` sızıntı) | Temiz |
| **Moda & Kadıköy No-JS Görünür Mekân Okunabilirliği** | Kök SPA kartları JS arkası (`0` tam mekân sayfası) | **`29/29` (%100) Moda** · **`32/32` (%100) Kadıköy** | Ham HTML tam okunabilir |
| **18 Pilot Mekân İkili Jaccard Benzerliği** | Uygulanmıyordu | Maksimum **`0.157`** (`< 0.35` eşiği) | Anti-doorway kanıtlı |

---

## 3. Tam Regresyon & Temiz Checkout Test Sonuçları (`rm -rf work` Sonrası, `18/18` `exit 0`)

| # | Doğrulama Komutu | Gerçek Gözlemlenen Sonuç | Durum |
|---|---|---|---|
| 1 | `node scripts/security/scan-secrets.cjs` *(ve `--ref=HEAD`)* | `2.697+` dosya, `uniqueCredentials: 0`, `findings: []` | **GEÇTİ** |
| 2 | `node scripts/security/policy-tests.cjs` | `74` güvenlik politika / boundary / staging MFA kontrolü | **GEÇTİ** |
| 3 | `node scripts/verify_rls_security.mjs` | İzole yerel PostgreSQL 17.11 `20/20 TEST BAŞARILI` | **GEÇTİ** |
| 4 | `node scripts/verify_pilot_security.cjs` | `48` PASS | **GEÇTİ** |
| 5 | `node scripts/verify_staging_preflight.cjs` | `28` PASS | **GEÇTİ** |
| 6 | `node scripts/verify_production_ratelimit_config.cjs` | `PASS` | **GEÇTİ** |
| 7 | `node scripts/verify_v3_gastronomy.cjs` *(`work/` olmadan)* | `21/21` PASS (sıfır koşullu atlama) | **GEÇTİ** |
| 8 | `node scripts/verify_visitor_content.cjs` | `10` PASS | **GEÇTİ** |
| 9 | `npx tsc --noEmit` | `0` hata | **GEÇTİ** |
| 10 | `npm run build` | `181/181` sayfa, Middleware `111 kB`, `exit 0` | **GEÇTİ** |
| 11 | `node scripts/cloud/verify_secret_leakage.cjs` | `119` statik dosya, `0` sızıntı | **GEÇTİ** |
| 12 | `node scripts/verify_p0_security_fixes.cjs` | `25` check PASS | **GEÇTİ** |
| 13 | `node scripts/verify_paket03_perf_and_analytics.cjs` | `7` check PASS | **GEÇTİ** |
| 14 | `node scripts/verify_paket05_api_middleware_mobile.cjs` | `12` check PASS | **GEÇTİ** |
| 15 | `node scripts/verify_codex_audit_closures.cjs` | `6` check PASS | **GEÇTİ** |
| 16 | `node scripts/verify_paket06_traffic_cost_resilience.cjs` | `8` check PASS (Scenario A `1534.5` RPS, Scenario B `2043.3` RPS, `0` 5xx/DB/Upstash) | **GEÇTİ** |
| 17 | `node scripts/verify_paket07_release_candidate.cjs` | `10` check PASS | **GEÇTİ** |
| 18 | [scripts/verify_paket08_geo_ai_search.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket07-codex-closures/scripts/verify_paket08_geo_ai_search.cjs) | **`6` check PASS** (`robots/sitemap/llms`, `29/29 & 32/32` No-JS + domain rewrite + ISR + `404`, JSON-LD/canonical/`hreflang`, `18` pilot Jaccard `0.157`, `70` AI bot `0` Upstash + sahte bot `401/403` + `shed` koruması, Chrome `390px`/`1280px`) | **GEÇTİ** |

---

## 4. Kalan GEO Riskleri ve `Test edilemedi` Sınırları

1. **`Test edilemedi` — Canlı Arama Motoru & AI Tarayıcı Gözlemi:** Google Search Console (`yeriniayir.com` & `worldandhotels.com`), Bing Webmaster Tools, OpenAI (`OAI-SearchBot`/`ChatGPT-User`) ve Perplexity (`PerplexityBot`) canlı tarama ve alıntılanma oranları yayın sonrasında doğrulanabilir.
2. **`Test edilemedi` — Bulut Edge / Cloudflare / Vercel WAF Bot Politikaları:** Bazı CDN veya WAF kuralları (ör. Vercel Attack Challenge Mode veya Cloudflare Bot Fight Mode) gerçek bulut ortamında `GPTBot` / `PerplexityBot` TLS parmak izini durdurabilir; `robots.txt` izinlerinin etkisiz kalmaması için canlı yayında WAF kuralları gözden geçirilmelidir.
3. **Sektörel / Ölçeklenebilirlik Riski (Kalan 90 Bölgenin Tekil Mekân Sayfaları):** Bilinçli olarak yalnız Moda & Kadıköy pilotundaki `18` mekân için tekil detay sayfası (`dynamicParams = false`) açıldı; diğer `2.259` mekân şimdilik il/ilçe/semt ve kategori sayfalarındaki tam metin HTML atlası içinde indekslenir. Gelecekte diğer bölgelerdeki mekânlara tekil sayfa açılacaksa aynı `geoPilot.ts` özgünlük/kalite kapısı (%100 el/kanıt temelli benzersiz metin) şartıyla eklenmelidir.
4. **`sitemap.xml` Gönderim Koordinasyonu:** `app/robots.ts` iki sitemap domainini birden ilan etse de Google Search Console'da `worldandhotels.com` mülkünün ayrı doğrulanması ve `https://www.worldandhotels.com/sitemap.xml` kaydının tanımlanması yayın sonrası faydalı olur.
5. **Önceki Yayın Önkoşulları:** Paket 07 raporundaki (`P1-03` Google Cloud API anahtar rotasyonu ve Supabase/Vercel/Upstash bulut panel adımları) manuel maddeler geçerliliğini korur.
